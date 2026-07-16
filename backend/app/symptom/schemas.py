from pydantic import BaseModel
from datetime import datetime


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    intent: str


class ChatHistoryItem(BaseModel):
    message: str
    response: str
    intent: str
    created_at: datetime

    class Config:
        from_attributes = True