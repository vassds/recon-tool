import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    domain = Column(String(500), nullable=False)
    record_type = Column(String(10), nullable=False)  # A, AAAA, CNAME, MX, NS, TXT, SOA, CAA, SRV, PTR
    record_value = Column(Text, nullable=False)
    ttl = Column(Integer, nullable=True)
    priority = Column(Integer, nullable=True)
    source = Column(String(100), default="dns")
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
