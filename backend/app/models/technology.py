import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Technology(Base):
    __tablename__ = "technologies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(String(50), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    host = Column(String(500), nullable=False, index=True)
    technology_name = Column(String(255), nullable=False, index=True)
    version = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)  # web_server, language, framework, cms, cdn, etc.
    evidence = Column(Text, nullable=True)
    confidence = Column(Integer, default=0)  # 0-100
    source = Column(String(100), default="whatweb")
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
