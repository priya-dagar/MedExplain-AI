from pydantic import BaseModel
from datetime import datetime


class PrescriptionResponse(BaseModel):
    id: int
    image_url: str
    ai_summary: str
    created_at: datetime

    class Config:
        from_attributes = True