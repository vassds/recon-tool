from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class SubdomainResponse(BaseModel):
    id: UUID
    scan_id: str
    hostname: str
    resolved_ip: Optional[str]
    cname: Optional[str]
    http_status: Optional[int]
    title: Optional[str]
    technology: Optional[str]
    open_ports: list
    source: str
    is_alive: bool
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True
