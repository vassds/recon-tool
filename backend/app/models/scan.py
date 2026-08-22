import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class ScanJob(Base):
    __tablename__ = "scan_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), unique=True, nullable=False, index=True)  # SCAN-2026-000124
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    scan_type = Column(String(50), nullable=False)  # passive, active, full, custom
    profile = Column(String(100), default="standard_pentest")
    status = Column(String(50), default="pending")  # pending, queued, running, completed, failed, cancelled
    progress = Column(Integer, default=0)
    current_stage = Column(String(100), default="")
    stages_config = Column(JSON, default=dict)  # which stages are enabled
    results_summary = Column(JSON, default=dict)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    error_message = Column(Text, nullable=True)
    celery_task_id = Column(String(255), nullable=True)


class ScanLog(Base):
    __tablename__ = "scan_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    level = Column(String(20), default="INFO")  # INFO, WARNING, ERROR, DEBUG
    stage = Column(String(100), default="")
    message = Column(Text, nullable=False)
    details = Column(JSON, nullable=True)
