from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class URLResponse(BaseModel):
    id: UUID
    scan_id: str
    url: str
    domain: str
    status_code: Optional[int]
    title: Optional[str]
    server: Optional[str]
    technology: list
    content_type: Optional[str]
    response_size: Optional[int]
    redirect_url: Optional[str]
    tls_valid: Optional[bool]
    depth: int
    source: str
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True
