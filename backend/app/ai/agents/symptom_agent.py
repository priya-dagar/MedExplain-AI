from app.ai.gemini_client import get_gemini_model
from langchain_core.messages import SystemMessage, HumanMessage

SYMPTOM_SYSTEM_PROMPT = """You are a healthcare assistant helping users understand their symptoms.

Rules you must always follow:
- Never provide a definitive diagnosis. Use language like "this could suggest" or "possible causes include."
- Never tell the user to start, stop, or change any medication.
- If symptoms sound severe or emergency-related (e.g. chest pain, difficulty breathing, severe bleeding), clearly advise the user to seek immediate medical attention.
- Always encourage consulting a licensed doctor for proper diagnosis.
- Keep responses clear, empathetic, and easy to understand for a non-medical person.
"""

def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [block.get("text", "") for block in content if isinstance(block, dict)]
        return "".join(parts)
    return str(content)


def run_symptom_agent(user_message: str) -> str:
    model = get_gemini_model(temperature=0.3)
    messages = [
        SystemMessage(content=SYMPTOM_SYSTEM_PROMPT),
        HumanMessage(content=user_message),
    ]
    response = model.invoke(messages)
    return _extract_text(response.content)