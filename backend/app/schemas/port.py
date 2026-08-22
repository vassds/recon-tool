from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
from uuid import UUID


class PortResponse(BaseModel):
    id: UUID
    scan_id: str
    host: str
    ip_address: Optional[str]
    port_number: int
    protocol: str
    state: str
    service_name: Optional[str]
    version: Optional[str]
    banner: Optional[str]
    confidence: int
    source: str
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True


class ServiceResponse(BaseModel):
    id: UUID
    scan_id: str
    host: str
    port_number: int
    protocol: str
    service_type: str
    status_code: Optional[int]
    title: Optional[str]
    server_header: Optional[str]
    technologies: list
    redirect_url: Optional[str]
    tls_info: dict
    headers: dict
    source: str
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True
