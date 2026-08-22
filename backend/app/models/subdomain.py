import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Subdomain(Base):
    __tablename__ = "subdomains"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    hostname = Column(String(500), nullable=False, index=True)
    resolved_ip = Column(String(50), nullable=True)
    cname = Column(String(500), nullable=True)
    http_status = Column(Integer, nullable=True)
    title = Column(String(500), nullable=True)
    technology = Column(String(255), nullable=True)
    open_ports = Column(JSON, default=list)
    source = Column(String(100), default="dns")
    is_alive = Column(Boolean, default=False)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
