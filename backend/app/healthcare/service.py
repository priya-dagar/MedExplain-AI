"""
Nearby healthcare facility search using OpenStreetMap's Overpass API.
No API key required. Returns hospitals, clinics, and diagnostic labs
within a radius of a given lat/lng.

NOTE: OSM data does NOT include star ratings or review counts — those
fields are intentionally omitted rather than faked.
"""

import httpx
from typing import Optional

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

# Maps our facility_type filter to OSM tag queries.
OSM_TAG_QUERIES = {
    "hospital": ['amenity=hospital'],
    "clinic": ['amenity=clinic', 'amenity=doctors'],
    "diagnostic_lab": ['healthcare=laboratory', 'amenity=diagnostic_lab'],
}

ALL_TAGS = [tag for tags in OSM_TAG_QUERIES.values() for tag in tags]


def _build_query(lat: float, lng: float, radius_m: int, facility_type: Optional[str]) -> str:
    tags = OSM_TAG_QUERIES.get(facility_type, ALL_TAGS) if facility_type else ALL_TAGS
    clauses = "\n".join(
        f'node[{tag}](around:{radius_m},{lat},{lng});\nway[{tag}](around:{radius_m},{lat},{lng});'
        for tag in tags
    )
    return f"""
    [out:json][timeout:25];
    (
      {clauses}
    );
    out center tags;
    """


def _haversine_km(lat1, lng1, lat2, lng2) -> float:
    from math import radians, sin, cos, sqrt, atan2
    R = 6371
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


class HealthcareSearchUnavailable(Exception):
    """Raised when all Overpass mirrors fail or time out."""
    pass


def search_nearby_facilities(
    lat: float,
    lng: float,
    radius_m: int = 8000,
    facility_type: Optional[str] = None,
) -> list[dict]:
    query = _build_query(lat, lng, radius_m, facility_type)
    data = None
    last_error = None

    for url in OVERPASS_URLS:
        try:
            with httpx.Client(timeout=20) as client:
                response = client.post(
                    url,
                    data={"data": query},
                    headers={
                        "User-Agent": "MedExplainAI/1.0 (contact: priyadagar0044@gmail.com)",
                        "Accept": "application/json",
                    },
                )
                response.raise_for_status()
                data = response.json()
                break  # success, stop trying mirrors
        except (httpx.HTTPStatusError, httpx.TimeoutException, httpx.ConnectError) as e:
            last_error = e
            continue  # try next mirror

    if data is None:
        raise HealthcareSearchUnavailable(str(last_error))

    results = []

    results = []
    for el in data.get("elements", []):
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue  # skip unnamed nodes, not useful to show

        # Nodes have lat/lon directly; ways use a computed "center"
        el_lat = el.get("lat") or el.get("center", {}).get("lat")
        el_lng = el.get("lon") or el.get("center", {}).get("lon")
        if el_lat is None or el_lng is None:
            continue

        amenity = tags.get("amenity", "")
        healthcare = tags.get("healthcare", "")
        if amenity == "hospital":
            resolved_type = "hospital"
        elif healthcare == "laboratory" or amenity == "diagnostic_lab":
            resolved_type = "diagnostic_lab"
        else:
            resolved_type = "clinic"

        address_parts = [
            tags.get("addr:housenumber"),
            tags.get("addr:street"),
            tags.get("addr:suburb"),
            tags.get("addr:city"),
            tags.get("addr:postcode"),
        ]
        address = ", ".join(p for p in address_parts if p) or None

        results.append({
            "name": name,
            "facility_type": resolved_type,
            "latitude": el_lat,
            "longitude": el_lng,
            "distance_km": round(_haversine_km(lat, lng, el_lat, el_lng), 1),
            "address": address,
            "phone": tags.get("phone") or tags.get("contact:phone"),
            "opening_hours": tags.get("opening_hours"),
        })

    results.sort(key=lambda r: r["distance_km"])
    return results