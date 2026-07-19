from sqlalchemy.orm import Session
from app.prescription.models import Prescription
from app.core.s3_config import upload_prescription_image
from app.ai.agents.prescription_agent import run_prescription_agent


def process_prescription_upload(
    db: Session, user_id: int, image_bytes: bytes, mime_type: str
) -> Prescription:
    # 1. Upload image to Cloudinary
    image_url = upload_prescription_image(image_bytes, user_id)

    # 2. Send image to Gemini Vision for understanding
    ai_summary = run_prescription_agent(image_bytes, mime_type)

    # 3. Save record to DB
    prescription = Prescription(
        user_id=user_id,
        image_url=image_url,
        ai_summary=ai_summary,
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    return prescription


def get_user_prescriptions(db: Session, user_id: int) -> list[Prescription]:
    return db.query(Prescription).filter(Prescription.user_id == user_id).order_by(Prescription.created_at.desc()).all()