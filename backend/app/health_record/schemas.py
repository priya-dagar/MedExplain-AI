from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HealthRecordItem(BaseModel):
    record_type: str
    source_id: int
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    chat_count: int
    last_prescription_summary: Optional[str] = None
    last_activity_summary: Optional[str] = None
    last_activity_date: Optional[datetime] = None