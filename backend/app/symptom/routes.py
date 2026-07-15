from fastapi import APIRouter, Depends
from app.ai.graph import compiled_graph
from app.symptom.schemas import ChatRequest, ChatResponse
from app.auth.routes import get_current_user
from app.auth.models import User
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter(prefix="/api/symptom", tags=["symptom"])


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = compiled_graph.invoke({
        "user_message": request.message,
        "intent": "",
        "response": "",
        "user_id": current_user.id,
        "db": db,
    })
    return ChatResponse(response=result["response"], intent=result["intent"])