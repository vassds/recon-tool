from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class OSINTSearch(BaseModel):
    query: str
    query_type: str  # domain, email, username
    project_id: UUID


class OSINTResultResponse(BaseModel):
    id: UUID
    query: str
    query_type: str
    source: str
    result_data: dict
    confidence: int
    created_at: datetime

    class Config:
        from_attributes = True
