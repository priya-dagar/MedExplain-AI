from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.routes import get_current_user
from app.auth.schemas import ProfileUpdate, ProfileResponse

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(current_user=Depends(get_current_user)):
    return current_user

@router.put("", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user