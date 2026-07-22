import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.ai.graph import compiled_graph
from app.symptom.schemas import ChatRequest, ChatResponse, ChatHistoryItem
from app.symptom.service import save_chat_turn, get_recent_chat_history, get_full_chat_history
from app.auth.routes import get_current_user
from app.auth.models import User
from app.health_record.service import add_health_record

router = APIRouter(prefix="/api/symptom", tags=["symptom"])


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation_id = request.conversation_id or str(uuid.uuid4())
    history = get_recent_chat_history(db, current_user.id, conversation_id, limit=6)

    result = compiled_graph.invoke({
        "user_message": request.message,
        "intent": "",
        "response": "",
        "user_id": current_user.id,
        "db": db,
        "history": history,
    })

    saved = save_chat_turn(
        db=db, user_id=current_user.id, message=request.message,
        response=result["response"], intent=result["intent"],
        conversation_id=conversation_id,
    )

    if result["intent"] == "symptom":
        add_health_record(
            db=db, user_id=current_user.id, record_type="symptom",
            source_id=saved.id, summary=f"Q: {request.message}\nA: {result['response']}",
        )

    return ChatResponse(response=result["response"], intent=result["intent"], conversation_id=conversation_id)


@router.get("/chat/history", response_model=list[ChatHistoryItem])
def chat_history(
    conversation_id: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_full_chat_history(db, current_user.id, conversation_id)