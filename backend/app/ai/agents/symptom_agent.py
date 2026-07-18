from sqlalchemy.orm import Session
from app.ai.gemini_client import get_gemini_model
from app.ai.tools.health_tools import make_prescription_history_tool
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage

SYMPTOM_SYSTEM_PROMPT = """You are a healthcare assistant helping users understand their symptoms.

Response style — this is critical:
- Match your response length to the question's complexity: a simple factual or yes/no question deserves a short, direct answer (1-3 sentences). A question needing explanation (why something happens, what to do about it, how symptoms connect) deserves a fuller, more detailed answer — don't artificially shorten it.
- Never pad a simple answer with unnecessary caveats or filler just to seem thorough.
- Never compress a genuinely complex answer into a couple of sentences just to seem concise.
- No long lists of clarifying questions — ask at most ONE follow-up question, only if genuinely needed.
- Skip the exhaustive "emergency red flags" list unless symptoms actually sound severe.
- Be direct and conversational, like a knowledgeable friend, not a medical pamphlet.

Rules you must always follow:
- Never provide a definitive diagnosis. Use language like "this could suggest" or "possible causes include."
- Never tell the user to start, stop, or change any medication.
- If symptoms sound severe or emergency-related (e.g. chest pain, difficulty breathing, severe bleeding), clearly and briefly advise seeking immediate medical attention.
- Encourage consulting a doctor for proper diagnosis, briefly.
- - Before answering ANY symptom or health-related question, use the get_prescription_history tool to check if the user has relevant prescription history — don't wait for medication to be explicitly mentioned.
- Use the recent conversation history for context if the user refers back to something they mentioned earlier.
"""


def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [block.get("text", "") for block in content if isinstance(block, dict)]
        return "".join(parts)
    return str(content)


def run_symptom_agent(user_message: str, db: Session, user_id: int, history: list = None) -> str:
    prescription_tool = make_prescription_history_tool(db, user_id)
    model = get_gemini_model(temperature=0.3)
    model_with_tools = model.bind_tools([prescription_tool])

    messages = [SystemMessage(content=SYMPTOM_SYSTEM_PROMPT)]

    # Add recent conversation history for context
    if history:
        for turn in history:
            messages.append(HumanMessage(content=turn.message))
            messages.append(AIMessage(content=turn.response))

    messages.append(HumanMessage(content=user_message))

    response = model_with_tools.invoke(messages)

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