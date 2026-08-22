import uuid
from datetime import datetime
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.scan import ScanJob, ScanLog
from app.models.target import Target
from app.models.user import User
from app.schemas.scan import ScanCreate, ScanResponse, ScanLogResponse, ScanStats
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/scans", tags=["scans"])

# Active WebSocket connections per scan
ws_connections: dict[str, list[WebSocket]] = {}


def generate_scan_id() -> str:
    now = datetime.utcnow()
    seq = str(uuid.uuid4().int % 999999).zfill(6)
    return f"SCAN-{now.year}-{seq}"


@router.get("", response_model=List[ScanResponse])
async def list_scans(
    project_id: UUID = None,
    target_id: UUID = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(ScanJob).order_by(ScanJob.created_at.desc())
    if project_id:
        query = query.where(ScanJob.project_id == project_id)
    if target_id:
        query = query.where(ScanJob.target_id == target_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=ScanResponse)
async def create_scan(
    data: ScanCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Check target exists
    result = await db.execute(select(Target).where(Target.id == data.target_id))
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    # For active scans, scope must be confirmed
    if data.scan_type in ("active", "full") and not target.scope_confirmed:
        raise HTTPException(
            status_code=403,
            detail="Scope not confirmed. Please confirm authorization before active scanning.",
        )

    scan = ScanJob(
        scan_id=generate_scan_id(),
        project_id=target.project_id,
        target_id=data.target_id,
        scan_type=data.scan_type,
        profile=data.profile,
        stages_config=data.stages_config,
        status="pending",
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    # In a real implementation, this would dispatch to Celery
    # from app.workers.tasks import run_scan
    # task = run_scan.delay(str(scan.id))
    # scan.celery_task_id = task.id
    # await db.commit()

    return scan


@router.get("/stats", response_model=ScanStats)
async def scan_stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total = (await db.execute(select(func.count(ScanJob.id)))).scalar() or 0
    running = (await db.execute(select(func.count(ScanJob.id)).where(ScanJob.status == "running"))).scalar() or 0
    completed = (await db.execute(select(func.count(ScanJob.id)).where(ScanJob.status == "completed"))).scalar() or 0
    failed = (await db.execute(select(func.count(ScanJob.id)).where(ScanJob.status == "failed"))).scalar() or 0
    return ScanStats(total_scans=total, running=running, completed=completed, failed=failed)


@router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan(
    scan_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(ScanJob).where(ScanJob.id == scan_id))
    scan = result.scalar_one_or_none()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan


@router.post("/{scan_id}/cancel", response_model=ScanResponse)
async def cancel_scan(
    scan_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(ScanJob).where(ScanJob.id == scan_id))
    scan = result.scalar_one_or_none()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    if scan.status not in ("pending", "queued", "running"):
        raise HTTPException(status_code=400, detail="Scan cannot be cancelled")
    scan.status = "cancelled"
    scan.completed_at = datetime.utcnow()
    await db.commit()
    await db.refresh(scan)
    return scan


@router.get("/{scan_id}/logs", response_model=List[ScanLogResponse])
async def get_scan_logs(
    scan_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ScanLog).where(ScanLog.scan_id == str(scan_id)).order_by(ScanLog.timestamp)
    )
    return result.scalars().all()


@router.websocket("/ws/{scan_id}")
async def scan_websocket(websocket: WebSocket, scan_id: str):
    await websocket.accept()
    if scan_id not in ws_connections:
        ws_connections[scan_id] = []
    ws_connections[scan_id].append(websocket)
    try:
        while True:
            # Keep connection alive; client sends pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        ws_connections[scan_id].remove(websocket)
        if not ws_connections[scan_id]:
            del ws_connections[scan_id]


async def broadcast_scan_update(scan_id: str, data: dict):
    """Broadcast update to all connected WebSocket clients for a scan."""
    connections = ws_connections.get(scan_id, [])
    disconnected = []
    for ws in connections:
        try:
            await ws.send_json(data)
        except Exception:
            disconnected.append(ws)
    for ws in disconnected:
        connections.remove(ws)
