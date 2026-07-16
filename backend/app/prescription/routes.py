from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.routes import get_current_user
from app.auth.models import User
from app.prescription.schemas import PrescriptionResponse
from app.prescription.service import process_prescription_upload, get_user_prescriptions
from app.health_record.service import add_health_record


router = APIRouter(prefix="/api/prescription", tags=["prescription"])

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_MB = 10


@router.post("/upload", response_model=PrescriptionResponse)
async def upload_prescription(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WEBP images are allowed")

    image_bytes = await file.read()

    if len(image_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max size is {MAX_FILE_SIZE_MB}MB")

    prescription = process_prescription_upload(
        db=db,
        user_id=current_user.id,
        image_bytes=image_bytes,
        mime_type=file.content_type,
    )

    add_health_record(
        db=db,
        user_id=current_user.id,
        record_type="prescription",
        source_id=prescription.id,
        summary=prescription.ai_summary[:100],
    )

    return prescription


@router.get("/history", response_model=list[PrescriptionResponse])
def prescription_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_prescriptions(db, current_user.id)