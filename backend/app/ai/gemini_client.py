from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def get_gemini_model(temperature: float = 0.4) -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=temperature,
    )