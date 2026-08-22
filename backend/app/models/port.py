import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Port(Base):
    __tablename__ = "ports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    host = Column(String(500), nullable=False, index=True)
    ip_address = Column(String(50), nullable=True)
    port_number = Column(Integer, nullable=False)
    protocol = Column(String(10), default="tcp")
    state = Column(String(20), default="open")
    service_name = Column(String(100), nullable=True)
    version = Column(String(255), nullable=True)
    banner = Column(Text, nullable=True)
    confidence = Column(Integer, default=0)
    source = Column(String(100), default="nmap")
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    host = Column(String(500), nullable=False, index=True)
    port_id = Column(UUID(as_uuid=True), nullable=True)
    port_number = Column(Integer, nullable=False)
    protocol = Column(String(10), default="tcp")
    service_type = Column(String(50), nullable=False)  # http, ssh, dns, ftp, smtp, etc.
    status_code = Column(Integer, nullable=True)
    title = Column(String(500), nullable=True)
    server_header = Column(String(255), nullable=True)
    technologies = Column(JSON, default=list)
    redirect_url = Column(Text, nullable=True)
    tls_info = Column(JSON, default=dict)
    headers = Column(JSON, default=dict)
    cookies = Column(JSON, default=list)
    response_size = Column(Integer, nullable=True)
    content_type = Column(String(255), nullable=True)
    robots_txt = Column(Text, nullable=True)
    sitemap_xml = Column(Text, nullable=True)
    source = Column(String(100), default="httpx")
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
