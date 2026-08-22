from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class DNSRecordResponse(BaseModel):
    id: UUID
    scan_id: str
    domain: str
    record_type: str
    record_value: str
    ttl: Optional[int]
    priority: Optional[int]
    source: str
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True
