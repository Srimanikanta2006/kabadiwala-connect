"""
Intelligent Recycler Matching Engine using Multi-Criteria Decision Analysis (MCDA).
Evaluates candidate recyclers on Offered Rate (35%), Proximity (25%), CPCB Trust (20%),
Fulfillment Rating (10%), and Pickup Service (10%).
"""

import math
from typing import List, Dict, Any

# Benchmark sample recyclers for Maharashtra
SAMPLE_RECYCLERS = [
    {
        "recycler_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "facility_name": "EcoRecycle India Pvt Ltd",
        "cpcb_reg_no": "CPCB/E-WASTE/REG/MH/2023/1042",
        "cpcb_status": "ACTIVE",
        "latitude": 19.0550,
        "longitude": 72.8710,
        "rates": {
            "mat_pcb_high": 255.0,
            "mat_cables_copper": 395.0,
            "mat_batteries_lead": 102.0
        },
        "pickup_available": True,
        "min_pickup_kg": 10.0,
        "fulfillment_rating": 4.8,
        "payment_modes": ["CASH", "UPI"]
    },
    {
        "recycler_id": "4e73b4d1-81f3-42e1-a083-d92e5912bb20",
        "facility_name": "GreenCircle Urban Recyclers",
        "cpcb_reg_no": "CPCB/E-WASTE/REG/MH/2022/0891",
        "cpcb_status": "ACTIVE",
        "latitude": 19.0410,
        "longitude": 72.8620,
        "rates": {
            "mat_pcb_high": 248.0,
            "mat_cables_copper": 385.0,
            "mat_batteries_lead": 98.0
        },
        "pickup_available": False,
        "min_pickup_kg": 0.0,
        "fulfillment_rating": 4.6,
        "payment_modes": ["CASH", "UPI"]
    },
    {
        "recycler_id": "8a32d184-72c1-4099-b391-729abcc80104",
        "facility_name": "MahaGreen Recovery Hub",
        "cpcb_reg_no": "CPCB/E-WASTE/REG/MH/2021/0411",
        "cpcb_status": "ACTIVE",
        "latitude": 19.0980,
        "longitude": 72.8940,
        "rates": {
            "mat_pcb_high": 240.0,
            "mat_cables_copper": 375.0,
            "mat_batteries_lead": 94.0
        },
        "pickup_available": True,
        "min_pickup_kg": 25.0,
        "fulfillment_rating": 4.2,
        "payment_modes": ["CASH"]
    }
]


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def match_and_rank_recyclers(
    material_id: str,
    weight_kg: float,
    collector_lat: float,
    collector_lng: float,
    require_pickup: bool = False
) -> List[Dict[str, Any]]:
    """
    Ranks authorized recyclers for a given lot using composite MCDA scoring.
    """
    candidates = []

    for r in SAMPLE_RECYCLERS:
        offered_rate = r["rates"].get(material_id, 0.0)
        if offered_rate <= 0.0:
            continue

        dist_km = haversine_distance_km(collector_lat, collector_lng, r["latitude"], r["longitude"])

        if require_pickup and not r["pickup_available"]:
            continue

        # Criteria Normalizations (0.0 to 1.0)
        norm_rate = min(offered_rate / 300.0, 1.0)
        norm_dist = 1.0 / (1.0 + (dist_km / 5.0))  # Distance penalty decay
        norm_trust = 1.0 if r["cpcb_status"] == "ACTIVE" else 0.2
        norm_rating = r["fulfillment_rating"] / 5.0
        norm_pickup = 1.0 if r["pickup_available"] else 0.5

        # Weighted Composite Score
        composite_score = (
            0.35 * norm_rate +
            0.25 * norm_dist +
            0.20 * norm_trust +
            0.10 * norm_rating +
            0.10 * norm_pickup
        )

        candidates.append({
            "recycler": r,
            "distance_km": dist_km,
            "offered_rate": offered_rate,
            "estimated_payout": round(offered_rate * weight_kg, 2),
            "score": composite_score
        })

    # Sort descending by composite score
    candidates.sort(key=lambda x: x["score"], reverse=True)

    ranked_results = []
    for idx, c in enumerate(candidates, 1):
        r = c["recycler"]
        
        # Determine vernacular badges
        if idx == 1:
            highlight = "HIGHEST_PAYOUT"
            badge_hi = f"सबसे ज़्यादा भाव (₹{int(c['offered_rate'])}/किग्रा)"
            badge_mr = f"सर्वाधिक भाव (₹{int(c['offered_rate'])}/किलो)"
        elif c["distance_km"] <= 2.0:
            highlight = "NEAREST_FACILITY"
            badge_hi = f"सबसे नज़दीकी केंद्र ({c['distance_km']} किमी)"
            badge_mr = f"सर्वात जवळचे केंद्र ({c['distance_km']} किमी)"
        else:
            highlight = "DOORSTEP_PICKUP" if r["pickup_available"] else "VERIFIED_PARTNER"
            badge_hi = "सत्यापित CPCB पार्टनर"
            badge_mr = "प्रमाणित CPCB पार्टनर"

        ranked_results.append({
            "rank": idx,
            "recycler_id": r["recycler_id"],
            "facility_name": r["facility_name"],
            "cpcb_reg_no": r["cpcb_reg_no"],
            "cpcb_status": r["cpcb_status"],
            "distance_km": c["distance_km"],
            "offered_rate_per_kg": c["offered_rate"],
            "estimated_payout_inr": c["estimated_payout"],
            "badge_highlight": highlight,
            "badge_text_hi": badge_hi,
            "badge_text_mr": badge_mr,
            "pickup_available": r["pickup_available"],
            "payment_modes_supported": r["payment_modes"]
        })

    return ranked_results
