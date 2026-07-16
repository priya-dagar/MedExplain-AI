from sqlalchemy.orm import Session
from app.symptom.models import ChatHistory


def save_chat_turn(db: Session, user_id: int, message: str, response: str, intent: str) -> ChatHistory:
    entry = ChatHistory(
        user_id=user_id,
        message=message,
        response=response,
        intent=intent,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_recent_chat_history(db: Session, user_id: int, limit: int = 6) -> list[ChatHistory]:
    results = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(results))  # oldest first, for natural conversation order


def get_full_chat_history(db: Session, user_id: int) -> list[ChatHistory]:
    return (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.asc())
        .all()
    )