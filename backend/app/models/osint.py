import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class OSINTResult(Base):
    __tablename__ = "osint_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    target_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    query = Column(String(500), nullable=False)
    query_type = Column(String(50), nullable=False)  # domain, email, username
    source = Column(String(100), nullable=False)
    result_data = Column(JSON, default=dict)
    confidence = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
