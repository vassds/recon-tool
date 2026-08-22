from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class FindingResponse(BaseModel):
    id: UUID
    scan_id: str
    title: str
    description: Optional[str]
    severity: str
    asset: Optional[str]
    asset_type: Optional[str]
    evidence: Optional[str]
    detection_method: Optional[str]
    confidence: int
    status: str
    notes: str
    references: list
    cve_id: Optional[str]
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True


class FindingUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    severity: Optional[str] = None
