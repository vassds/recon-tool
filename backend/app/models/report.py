import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    scan_ids = Column(JSON, default=list)
    title = Column(String(500), nullable=False)
    format = Column(String(20), default="html")  # pdf, html, json, csv, markdown
    file_path = Column(String(1000), nullable=True)
    file_size = Column(Integer, nullable=True)
    status = Column(String(50), default="pending")  # pending, generating, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
