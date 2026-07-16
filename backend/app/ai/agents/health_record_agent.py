from sqlalchemy.orm import Session
from app.ai.gemini_client import get_gemini_model
from app.ai.tools.health_tools import make_health_timeline_tool
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage

HEALTH_RECORD_PROMPT = """You are a healthcare assistant that summarizes a user's health history.
Use the get_health_timeline tool to see their past symptoms and prescriptions, then answer their question clearly.
Never diagnose. Encourage consulting a doctor for medical decisions."""

def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(b.get("text", "") for b in content if isinstance(b, dict))
    return str(content)

def run_health_record_agent(user_message: str, db: Session, user_id: int) -> str:
    tool = make_health_timeline_tool(db, user_id)
    model = get_gemini_model(temperature=0.3).bind_tools([tool])
    messages = [SystemMessage(content=HEALTH_RECORD_PROMPT), HumanMessage(content=user_message)]
    response = model.invoke(messages)
    if response.tool_calls:
        messages.append(response)
        for tc in response.tool_calls:
            if tc["name"] == "get_health_timeline":
                result = tool.invoke(tc["args"])
                messages.append(ToolMessage(content=result, tool_call_id=tc["id"]))
        final = model.invoke(messages)
        return _extract_text(final.content)
    return _extract_text(response.content)