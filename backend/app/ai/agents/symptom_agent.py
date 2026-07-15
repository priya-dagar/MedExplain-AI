from sqlalchemy.orm import Session
from app.ai.gemini_client import get_gemini_model
from app.ai.tools.health_tools import make_prescription_history_tool
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage

SYMPTOM_SYSTEM_PROMPT = """You are a healthcare assistant helping users understand their symptoms.

Rules you must always follow:
- Never provide a definitive diagnosis. Use language like "this could suggest" or "possible causes include."
- Never tell the user to start, stop, or change any medication.
- If symptoms sound severe or emergency-related (e.g. chest pain, difficulty breathing, severe bleeding), clearly advise the user to seek immediate medical attention.
- Always encourage consulting a licensed doctor for proper diagnosis.
- Keep responses clear, empathetic, and easy to understand for a non-medical person.
- If the user's message might relate to medication they've been prescribed before, use the get_prescription_history tool to check their history before answering.
"""


def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [block.get("text", "") for block in content if isinstance(block, dict)]
        return "".join(parts)
    return str(content)


def run_symptom_agent(user_message: str, db: Session, user_id: int) -> str:
    prescription_tool = make_prescription_history_tool(db, user_id)
    model = get_gemini_model(temperature=0.3)
    model_with_tools = model.bind_tools([prescription_tool])

    messages = [
        SystemMessage(content=SYMPTOM_SYSTEM_PROMPT),
        HumanMessage(content=user_message),
    ]

    response = model_with_tools.invoke(messages)

    # If the model decided to call a tool, execute it and let the model respond again with the result
    if response.tool_calls:
        messages.append(response)
        for tool_call in response.tool_calls:
            if tool_call["name"] == "get_prescription_history":
                tool_result = prescription_tool.invoke(tool_call["args"])
                messages.append(
                    ToolMessage(content=tool_result, tool_call_id=tool_call["id"])
                )
        final_response = model_with_tools.invoke(messages)
        return _extract_text(final_response.content)

    return _extract_text(response.content)