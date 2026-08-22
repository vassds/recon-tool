import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.database import Base


class Target(Base):
    __tablename__ = "targets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    value = Column(String(500), nullable=False)  # domain, IP, CIDR, URL
    target_type = Column(String(50), nullable=False)  # domain, ip, cidr, url, username, email
    status = Column(String(50), default="active")
    tags = Column(JSON, default=list)
    notes = Column(Text, default="")
    scope_confirmed = Column(Boolean, default=False)
    scope_confirmed_at = Column(DateTime, nullable=True)
    excluded_hosts = Column(JSON, default=list)
    included_ports = Column(JSON, default=list)
    excluded_ports = Column(JSON, default=list)
    scan_profile = Column(String(100), default="standard_pentest")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
