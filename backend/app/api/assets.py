from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.dns import DNSRecord
from app.models.subdomain import Subdomain
from app.models.port import Port, Service
from app.models.technology import Technology
from app.models.web import URL
from app.models.finding import Finding
from app.models.user import User
from app.schemas.dns import DNSRecordResponse
from app.schemas.subdomain import SubdomainResponse
from app.schemas.port import PortResponse, ServiceResponse
from app.schemas.technology import TechnologyResponse
from app.schemas.web import URLResponse
from app.schemas.finding import FindingResponse, FindingUpdate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api", tags=["assets"])


# ── DNS ─────────────────────────────────────────────────────────────
@router.get("/dns", response_model=List[DNSRecordResponse])
async def list_dns(
    project_id: UUID = None,
    scan_id: str = None,
    domain: str = None,
    record_type: str = None,
    skip: int = 0,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(DNSRecord).order_by(DNSRecord.created_at.desc())
    if project_id:
        query = query.where(DNSRecord.project_id == project_id)
    if scan_id:
        query = query.where(DNSRecord.scan_id == scan_id)
    if domain:
        query = query.where(DNSRecord.domain == domain)
    if record_type:
        query = query.where(DNSRecord.record_type == record_type)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# ── Subdomains ──────────────────────────────────────────────────────
@router.get("/subdomains", response_model=List[SubdomainResponse])
async def list_subdomains(
    project_id: UUID = None,
    scan_id: str = None,
    hostname: str = None,
    is_alive: bool = None,
    skip: int = 0,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Subdomain).order_by(Subdomain.created_at.desc())
    if project_id:
        query = query.where(Subdomain.project_id == project_id)
    if scan_id:
        query = query.where(Subdomain.scan_id == scan_id)
    if hostname:
        query = query.where(Subdomain.hostname.ilike(f"%{hostname}%"))
    if is_alive is not None:
        query = query.where(Subdomain.is_alive == is_alive)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# ── Ports ───────────────────────────────────────────────────────────
@router.get("/ports", response_model=List[PortResponse])
async def list_ports(
    project_id: UUID = None,
    scan_id: str = None,
    host: str = None,
    skip: int = 0,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Port).order_by(Port.port_number)
    if project_id:
        query = query.where(Port.project_id == project_id)
    if scan_id:
        query = query.where(Port.scan_id == scan_id)
    if host:
        query = query.where(Port.host.ilike(f"%{host}%"))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# ── Services ────────────────────────────────────────────────────────
@router.get("/services", response_model=List[ServiceResponse])
async def list_services(
    project_id: UUID = None,
    scan_id: str = None,
    host: str = None,
    service_type: str = None,
    skip: int = 0,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Service).order_by(Service.created_at.desc())
    if project_id:
        query = query.where(Service.project_id == project_id)
    if scan_id:
        query = query.where(Service.scan_id == scan_id)
    if host:
        query = query.where(Service.host.ilike(f"%{host}%"))
    if service_type:
        query = query.where(Service.service_type == service_type)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# ── Technologies ────────────────────────────────────────────────────
@router.get("/technologies", response_model=List[TechnologyResponse])
async def list_technologies(
    project_id: UUID = None,
    scan_id: str = None,
    host: str = None,
    technology_name: str = None,
    skip: int = 0,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Technology).order_by(Technology.created_at.desc())
    if project_id:
        query = query.where(Technology.project_id == project_id)
    if scan_id:
        query = query.where(Technology.scan_id == scan_id)
    if host:
        query = query.where(Technology.host.ilike(f"%{host}%"))
    if technology_name:
        query = query.where(Technology.technology_name.ilike(f"%{technology_name}%"))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# ── URLs ────────────────────────────────────────────────────────────
@router.get("/urls", response_model=List[URLResponse])
async def list_urls(
    project_id: UUID = None,
    scan_id: str = None,
    domain: str = None,
    status_code: int = None,
    skip: int = 0,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(URL).order_by(URL.created_at.desc())
    if project_id:
        query = query.where(URL.project_id == project_id)
    if scan_id:
        query = query.where(URL.scan_id == scan_id)
    if domain:
        query = query.where(URL.domain.ilike(f"%{domain}%"))
    if status_code:
        query = query.where(URL.status_code == status_code)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


# ── Findings ────────────────────────────────────────────────────────
@router.get("/findings", response_model=List[FindingResponse])
async def list_findings(
    project_id: UUID = None,
    scan_id: str = None,
    severity: str = None,
    status: str = None,
    skip: int = 0,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Finding).order_by(
        func.case(
            (Finding.severity == "critical", 0),
            (Finding.severity == "high", 1),
            (Finding.severity == "medium", 2),
            (Finding.severity == "low", 3),
            else_=4,
        )
    )
    if project_id:
        query = query.where(Finding.project_id == project_id)
    if scan_id:
        query = query.where(Finding.scan_id == scan_id)
    if severity:
        query = query.where(Finding.severity == severity)
    if status:
        query = query.where(Finding.status == status)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.put("/findings/{finding_id}", response_model=FindingResponse)
async def update_finding(
    finding_id: UUID,
    data: FindingUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Finding).where(Finding.id == finding_id))
    finding = result.scalar_one_or_none()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(finding, key, value)
    await db.commit()
    await db.refresh(finding)
    return finding


# ── Dashboard Stats ─────────────────────────────────────────────────
@router.get("/stats")
async def asset_stats(
    project_id: UUID = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    async def _count(model, extra_filter=None):
        q = select(func.count(model.id))
        if project_id:
            q = q.where(model.project_id == project_id)
        if extra_filter:
            q = q.where(extra_filter)
        return (await db.execute(q)).scalar() or 0

    ip_q = select(func.count(func.distinct(Port.ip_address))).where(
        Port.ip_address.isnot(None) if not project_id else
        (Port.project_id == project_id) & (Port.ip_address.isnot(None))
    )
    return {
        "subdomains": await _count(Subdomain),
        "ip_addresses": (await db.execute(ip_q)).scalar() or 0,
        "open_ports": await _count(Port, Port.state == "open"),
        "services": await _count(Service),
        "technologies": await _count(Technology),
        "urls": await _count(URL),
        "findings": await _count(Finding),
        "findings_by_severity": {
            sev: await _count(Finding, Finding.severity == sev)
            for sev in ("critical", "high", "medium", "low", "informational")
        },
    }
