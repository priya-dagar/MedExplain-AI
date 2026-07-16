from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from pydantic import BaseModel
from app.ai.agents.health_record_agent import run_health_record_agent

from app.core.database import get_db
from app.health_record.schemas import HealthRecordItem
from app.health_record.service import get_timeline
from app.auth.routes import get_current_user
from app.auth.models import User
from app.health_record.schemas import DashboardSummary
from app.health_record.service import get_dashboard_summary

class HealthRecordChatRequest(BaseModel):
    message: str

router = APIRouter(prefix="/api/health-record", tags=["health-record"])

@router.post("/chat")
def health_record_chat(
    request: HealthRecordChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reply = run_health_record_agent(request.message, db, current_user.id)
    return {"response": reply}



@router.get("/timeline", response_model=list[HealthRecordItem])
def timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_timeline(db, current_user.id)


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_dashboard_summary(db, current_user.id)