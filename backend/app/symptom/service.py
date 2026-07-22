from sqlalchemy.orm import Session
from app.symptom.models import ChatHistory


def save_chat_turn(db: Session, user_id: int, message: str, response: str, intent: str, conversation_id: str) -> ChatHistory:
    entry = ChatHistory(
        user_id=user_id,
        message=message,
        response=response,
        intent=intent,
        conversation_id=conversation_id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_recent_chat_history(db: Session, user_id: int, conversation_id: str, limit: int = 6) -> list[ChatHistory]:
    results = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id, ChatHistory.conversation_id == conversation_id)
        .order_by(ChatHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(results))


def get_full_chat_history(db: Session, user_id: int, conversation_id: str) -> list[ChatHistory]:
    return (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id, ChatHistory.conversation_id == conversation_id)
        .order_by(ChatHistory.created_at.asc())
        .all()
    )