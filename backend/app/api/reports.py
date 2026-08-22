import os
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate, ReportResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])

REPORTS_DIR = "/app/reports"
os.makedirs(REPORTS_DIR, exist_ok=True)


@router.get("", response_model=List[ReportResponse])
async def list_reports(
    project_id: UUID = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Report).order_by(Report.created_at.desc())
    if project_id:
        query = query.where(Report.project_id == project_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=ReportResponse)
async def create_report(
    data: ReportCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    report = Report(
        project_id=data.project_id,
        scan_ids=[str(s) for s in data.scan_ids],
        title=data.title,
        format=data.format,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/{report_id}/download")
async def download_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if not report.file_path or not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not generated yet")

    media_types = {
        "pdf": "application/pdf",
        "html": "text/html",
        "json": "application/json",
        "csv": "text/csv",
        "markdown": "text/markdown",
    }
    return FileResponse(
        report.file_path,
        media_type=media_types.get(report.format, "application/octet-stream"),
        filename=f"{report.title}.{report.format}",
    )
