from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.osint import OSINTResult
from app.models.user import User
from app.schemas.osint import OSINTSearch, OSINTResultResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/osint", tags=["osint"])


@router.get("", response_model=List[OSINTResultResponse])
async def list_osint(
    project_id: UUID = None,
    query_type: str = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = select(OSINTResult).order_by(OSINTResult.created_at.desc())
    if project_id:
        q = q.where(OSINTResult.project_id == project_id)
    if query_type:
        q = q.where(OSINTResult.query_type == query_type)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/search", response_model=List[OSINTResultResponse])
async def search_osint(
    data: OSINTSearch,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Run an OSINT search. Currently returns placeholder results;
    integrate real providers via the adapter pattern."""
    results = []

    # Placeholder: in production, dispatch to OSINT adapter modules
    if data.query_type == "domain":
        results.append(
            OSINTResult(
                project_id=data.project_id,
                query=data.query,
                query_type="domain",
                source="certificate_transparency",
                result_data={"note": "Certificate transparency search"},
                confidence=80,
            )
        )
    elif data.query_type == "email":
        results.append(
            OSINTResult(
                project_id=data.project_id,
                query=data.query,
                query_type="email",
                source="public_dns",
                result_data={"note": "Public DNS MX lookup"},
                confidence=60,
            )
        )
    elif data.query_type == "username":
        results.append(
            OSINTResult(
                project_id=data.project_id,
                query=data.query,
                query_type="username",
                source="username_check",
                result_data={"note": "Public username enumeration"},
                confidence=50,
            )
        )

    for r in results:
        db.add(r)
    await db.commit()
    for r in results:
        await db.refresh(r)
    return results
