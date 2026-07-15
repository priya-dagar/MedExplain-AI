import base64
from app.ai.gemini_client import get_gemini_model
from langchain_core.messages import SystemMessage, HumanMessage

PRESCRIPTION_SYSTEM_PROMPT = """You are a healthcare assistant that helps users understand their medical prescriptions.

You will be shown an image of a prescription. Read the medicines, dosages, and instructions written on it, then explain it in simple, easy-to-understand language.

Rules you must always follow:
- Never tell the user to start, stop, or change their medication — only explain what is written.
- If any part of the prescription is unclear or illegible, say so honestly rather than guessing.
- Explain what each medicine is generally used for, in simple terms.
- Explain the dosage and timing instructions clearly (e.g. "twice a day after food").
- Always end by encouraging the user to confirm details with their doctor or pharmacist if anything is unclear.
- Do not invent information that is not visible in the image.
"""


def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [block.get("text", "") for block in content if isinstance(block, dict)]
        return "".join(parts)
    return str(content)


def run_prescription_agent(image_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    model = get_gemini_model(temperature=0.2)
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    messages = [
        SystemMessage(content=PRESCRIPTION_SYSTEM_PROMPT),
        HumanMessage(content=[
            {"type": "text", "text": "Please read and explain this prescription."},
            {
                "type": "image_url",
                "image_url": f"data:{mime_type};base64,{image_b64}",
            },
        ]),
    ]
    response = model.invoke(messages)
    return _extract_text(response.content)