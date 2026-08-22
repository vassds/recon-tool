from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class TechnologyResponse(BaseModel):
    id: UUID
    scan_id: str
    host: str
    technology_name: str
    version: Optional[str]
    category: Optional[str]
    evidence: Optional[str]
    confidence: int
    source: str
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True
