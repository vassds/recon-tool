from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class ReportCreate(BaseModel):
    project_id: UUID
    scan_ids: List[UUID] = []
    title: str
    format: str = "html"  # pdf, html, json, csv, markdown


class ReportResponse(BaseModel):
    id: UUID
    project_id: UUID
    scan_ids: list
    title: str
    format: str
    file_path: Optional[str]
    file_size: Optional[int]
    status: str
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True
