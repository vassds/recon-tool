from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime
from uuid import UUID


class ScanCreate(BaseModel):
    target_id: UUID
    scan_type: str = "full"  # passive, active, full, custom
    profile: str = "standard_pentest"
    stages_config: Dict[str, bool] = {
        "passive_recon": True,
        "dns_intelligence": True,
        "subdomain_discovery": True,
        "active_recon": True,
        "port_scan": True,
        "service_enum": True,
        "web_recon": True,
        "tech_detection": True,
        "finding_correlation": True,
    }


class ScanUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    current_stage: Optional[str] = None


class ScanLogCreate(BaseModel):
    scan_id: str
    level: str = "INFO"
    stage: str = ""
    message: str
    details: Optional[dict] = None


class ScanResponse(BaseModel):
    id: UUID
    scan_id: str
    project_id: UUID
    target_id: UUID
    scan_type: str
    profile: str
    status: str
    progress: int
    current_stage: str
    stages_config: dict
    results_summary: dict
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    error_message: Optional[str]

    class Config:
        from_attributes = True


class ScanLogResponse(BaseModel):
    id: UUID
    scan_id: str
    timestamp: datetime
    level: str
    stage: str
    message: str
    details: Optional[dict]

    class Config:
        from_attributes = True


class ScanStats(BaseModel):
    total_scans: int = 0
    running: int = 0
    completed: int = 0
    failed: int = 0
