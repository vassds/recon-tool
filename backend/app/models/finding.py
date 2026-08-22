import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Finding(Base):
    __tablename__ = "findings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String(20), default="informational")  # informational, low, medium, high, critical
    asset = Column(String(500), nullable=True)
    asset_type = Column(String(50), nullable=True)
    evidence = Column(Text, nullable=True)
    detection_method = Column(String(100), nullable=True)
    confidence = Column(Integer, default=0)  # 0-100
    status = Column(String(50), default="open")  # open, confirmed, false_positive, resolved
    notes = Column(Text, default="")
    references = Column(JSON, default=list)
    cve_id = Column(String(50), nullable=True)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
