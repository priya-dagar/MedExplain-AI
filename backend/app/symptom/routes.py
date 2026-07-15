from fastapi import APIRouter, Depends
from app.ai.graph import compiled_graph
from app.symptom.schemas import ChatRequest, ChatResponse
from app.auth.routes import get_current_user
from app.auth.models import User

router = APIRouter(prefix="/api/symptom", tags=["symptom"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    result = compiled_graph.invoke({
        "user_message": request.message,
        "intent": "",
        "response": "",
    })
    return ChatResponse(response=result["response"], intent=result["intent"])