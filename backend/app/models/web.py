import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class URL(Base):
    __tablename__ = "urls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    url = Column(Text, nullable=False)
    domain = Column(String(500), nullable=False, index=True)
    status_code = Column(Integer, nullable=True)
    title = Column(String(500), nullable=True)
    server = Column(String(255), nullable=True)
    technology = Column(JSON, default=list)
    content_type = Column(String(255), nullable=True)
    response_size = Column(Integer, nullable=True)
    redirect_url = Column(Text, nullable=True)
    tls_valid = Column(Boolean, nullable=True)
    tls_expiry = Column(DateTime, nullable=True)
    depth = Column(Integer, default=0)
    source = Column(String(100), default="gobuster")
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class WebTechnology(Base):
    __tablename__ = "web_technologies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    url_id = Column(UUID(as_uuid=True), nullable=True)
    host = Column(String(500), nullable=False)
    technology = Column(String(255), nullable=False)
    version = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    confidence = Column(Integer, default=0)
    source = Column(String(100), default="whatweb")
    created_at = Column(DateTime, default=datetime.utcnow)
