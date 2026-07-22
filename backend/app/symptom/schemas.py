from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    intent: str
    conversation_id: str


class ChatHistoryItem(BaseModel):
    message: str
    response: str
    intent: str
    created_at: datetime
    conversation_id: Optional[str] = None

    class Config:
        from_attributes = True