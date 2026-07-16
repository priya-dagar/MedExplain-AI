from sqlalchemy.orm import Session
from app.health_record.models import HealthRecord
from app.symptom.models import ChatHistory
from app.prescription.models import Prescription  # adjust import path if different


def add_health_record(db: Session, user_id: int, record_type: str, source_id: int, summary: str) -> HealthRecord:
    record = HealthRecord(
        user_id=user_id,
        record_type=record_type,
        source_id=source_id,
        summary=summary,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_timeline(db: Session, user_id: int) -> list[HealthRecord]:
    return (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.created_at.desc())
        .all()
    )

def get_dashboard_summary(db: Session, user_id: int) -> dict:
    chat_count = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).count()
    last_prescription = (
        db.query(Prescription)
        .filter(Prescription.user_id == user_id)
        .order_by(Prescription.created_at.desc())
        .first()
    )
    last_record = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.created_at.desc())
        .first()
    )
    return {
        "chat_count": chat_count,
        "last_prescription_summary": last_prescription.ai_summary[:100] if last_prescription else None,
        "last_activity_summary": last_record.summary if last_record else None,
        "last_activity_date": last_record.created_at if last_record else None,
    }