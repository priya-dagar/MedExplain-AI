from langchain_core.tools import tool
from sqlalchemy.orm import Session
from app.prescription.models import Prescription
from app.health_record.service import get_timeline



def make_prescription_history_tool(db: Session, user_id: int):
    @tool
    def get_prescription_history() -> str:
        """Fetch the user's past prescription records, including medicines, dosages, and AI-generated explanations. ALWAYS call this for any symptom, health, or medication-related question — the user's prescription history is often relevant even if not explicitly mentioned."""
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
            summary_lines.append(f"- ({p.created_at.date()}) {p.ai_summary}")
        return "\n".join(summary_lines)

    return get_prescription_history

def make_health_timeline_tool(db: Session, user_id: int):
    @tool
    def get_health_timeline() -> str:
        """Get the user's full health record timeline (symptoms + prescriptions)."""
        records = get_timeline(db, user_id)
        if not records:
            return "No health records found."
        return "\n".join(f"[{r.created_at.date()}] {r.record_type}: {r.summary}" for r in records)
    return get_health_timeline