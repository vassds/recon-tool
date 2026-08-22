from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class TargetCreate(BaseModel):
    value: str
    target_type: str  # domain, ip, cidr, url, username, email
    tags: List[str] = []
    notes: str = ""
    excluded_hosts: List[str] = []
    included_ports: List[int] = []
    excluded_ports: List[int] = []
    scan_profile: str = "standard_pentest"


class TargetUpdate(BaseModel):
    value: Optional[str] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    scope_confirmed: Optional[bool] = None
    excluded_hosts: Optional[List[str]] = None
    included_ports: Optional[List[int]] = None
    excluded_ports: Optional[List[int]] = None
    scan_profile: Optional[str] = None
    status: Optional[str] = None


class TargetBulkCreate(BaseModel):
    targets: List[str]  # list of domain/IP/CIDR/URL strings
    project_id: UUID
    tags: List[str] = []
    scan_profile: str = "standard_pentest"


class TargetResponse(BaseModel):
    id: UUID
    project_id: UUID
    value: str
    target_type: str
    status: str
    tags: list
    notes: str
    scope_confirmed: bool
    excluded_hosts: list
    included_ports: list
    excluded_ports: list
    scan_profile: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
