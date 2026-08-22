import re
import ipaddress
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.target import Target
from app.models.user import User
from app.schemas.target import TargetCreate, TargetUpdate, TargetBulkCreate, TargetResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/targets", tags=["targets"])

DOMAIN_RE = re.compile(r"^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$")
IP_RE = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
CIDR_RE = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/\d{1,2}$")
URL_RE = re.compile(r"^https?://")


def detect_target_type(value: str) -> str:
    value = value.strip()
    if URL_RE.match(value):
        return "url"
    if CIDR_RE.match(value):
        try:
            ipaddress.ip_network(value, strict=False)
            return "cidr"
        except ValueError:
            pass
    if IP_RE.match(value):
        try:
            ipaddress.ip_address(value)
            return "ip"
        except ValueError:
            pass
    if DOMAIN_RE.match(value):
        return "domain"
    if "@" in value:
        return "email"
    return "username"


@router.get("", response_model=List[TargetResponse])
async def list_targets(
    project_id: UUID = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Target).order_by(Target.created_at.desc())
    if project_id:
        query = query.where(Target.project_id == project_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=TargetResponse)
async def create_target(
    data: TargetCreate,
    project_id: UUID = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required")

    target_type = detect_target_type(data.value)
    target = Target(
        project_id=project_id,
        value=data.value.strip(),
        target_type=target_type,
        tags=data.tags,
        notes=data.notes,
        excluded_hosts=data.excluded_hosts,
        included_ports=data.included_ports,
        excluded_ports=data.excluded_ports,
        scan_profile=data.scan_profile,
    )
    db.add(target)
    await db.commit()
    await db.refresh(target)
    return target


@router.post("/bulk", response_model=List[TargetResponse])
async def create_targets_bulk(
    data: TargetBulkCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    created = []
    for value in data.targets:
        value = value.strip()
        if not value:
            continue
        target_type = detect_target_type(value)
        target = Target(
            project_id=data.project_id,
            value=value,
            target_type=target_type,
            tags=data.tags,
            scan_profile=data.scan_profile,
        )
        db.add(target)
        created.append(target)

    await db.commit()
    for t in created:
        await db.refresh(t)
    return created


@router.get("/{target_id}", response_model=TargetResponse)
async def get_target(
    target_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Target).where(Target.id == target_id))
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    return target


@router.put("/{target_id}", response_model=TargetResponse)
async def update_target(
    target_id: UUID,
    data: TargetUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Target).where(Target.id == target_id))
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(target, key, value)
    await db.commit()
    await db.refresh(target)
    return target


@router.post("/{target_id}/confirm-scope", response_model=TargetResponse)
async def confirm_scope(
    target_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Target).where(Target.id == target_id))
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    from datetime import datetime
    target.scope_confirmed = True
    target.scope_confirmed_at = datetime.utcnow()
    await db.commit()
    await db.refresh(target)
    return target


@router.delete("/{target_id}")
async def delete_target(
    target_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Target).where(Target.id == target_id))
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    await db.delete(target)
    await db.commit()
    return {"detail": "Target deleted"}
