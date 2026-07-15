from langchain_core.tools import tool
from sqlalchemy.orm import Session
from app.prescription.models import Prescription


def make_prescription_history_tool(db: Session, user_id: int):
    @tool
    def get_prescription_history() -> str:
        """Fetch the user's past prescription records, including medicines and AI-generated explanations. Use this when the user's question might relate to medication they've previously been prescribed, or when knowing their prescription history would help give a more relevant answer."""
        prescriptions = (
            db.query(Prescription)
            .filter(Prescription.user_id == user_id)
            .order_by(Prescription.created_at.desc())
            .limit(5)
            .all()
        )
        if not prescriptions:
            return "No prescription history found for this user."

        summary_lines = []
        for p in prescriptions:
            summary_lines.append(f"- ({p.created_at.date()}) {p.ai_summary[:200]}")
        return "\n".join(summary_lines)

    return get_prescription_history