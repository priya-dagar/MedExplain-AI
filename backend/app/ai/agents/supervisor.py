from app.ai.gemini_client import get_gemini_model
from langchain_core.messages import SystemMessage, HumanMessage

SUPERVISOR_PROMPT = """You are a routing assistant. Your only job is to classify the user's message into exactly one category:

- "symptom" — if the user is describing a health symptom, feeling unwell, or asking about a medical condition
- "general" — for anything else (greetings, unclear messages, unrelated questions)

Respond with only one word: symptom or general. No explanation.
"""

def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [block.get("text", "") for block in content if isinstance(block, dict)]
        return "".join(parts)
    return str(content)


def classify_intent(user_message: str) -> str:
    model = get_gemini_model(temperature=0)
    messages = [
        SystemMessage(content=SUPERVISOR_PROMPT),
        HumanMessage(content=user_message),
    ]
    response = model.invoke(messages)
    intent = _extract_text(response.content).strip().lower()
    return intent if intent in ("symptom", "general") else "general"