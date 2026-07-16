from app.ai.gemini_client import get_gemini_model
from langchain_core.messages import SystemMessage, HumanMessage

SUPERVISOR_PROMPT = """You are a routing assistant. Classify the user's message into exactly one category:

- "symptom" — describing a health symptom, feeling unwell, or a follow-up on a prior symptom conversation
- "health_record" — asking about their health history, timeline, past symptoms/prescriptions, or a summary of their records
- "general" — anything else

Use the recent conversation history to judge follow-up messages correctly.

Respond with only one word: symptom, health_record, or general. No explanation.
"""

def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [block.get("text", "") for block in content if isinstance(block, dict)]
        return "".join(parts)
    return str(content)


def classify_intent(user_message: str, history: list = None) -> str:
    model = get_gemini_model(temperature=0)

    messages = [SystemMessage(content=SUPERVISOR_PROMPT)]

    if history:
        history_lines = "\n".join(
            f"User: {turn.message}\nAssistant: {turn.response}" for turn in history
        )
        messages.append(HumanMessage(content=f"Recent conversation:\n{history_lines}"))

    messages.append(HumanMessage(content=f"Latest message: {user_message}"))

    response = model.invoke(messages)
    intent = _extract_text(response.content).strip().lower()
    return intent if intent in ("symptom", "health_record", "general") else "general"