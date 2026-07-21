from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.auth.routes import get_current_user
from app.healthcare.service import search_nearby_facilities, HealthcareSearchUnavailable

router = APIRouter(prefix="/api/healthcare", tags=["healthcare"])


@router.get("/nearby")
def get_nearby_facilities(
    lat: float = Query(...),
    lng: float = Query(...),
    facility_type: Optional[str] = Query(None, description="hospital | clinic | diagnostic_lab"),
    radius_m: int = Query(8000, ge=500, le=20000),
    current_user=Depends(get_current_user),
):
    try:
        results = search_nearby_facilities(lat, lng, radius_m, facility_type)
    except HealthcareSearchUnavailable:
        return {
            "count": 0,
            "results": [],
            "error": "Healthcare facility search is temporarily unavailable. Please try again in a moment.",
        }
    return {"count": len(results), "results": results}