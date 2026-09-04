"""
MCDA Recycler Matching Engine for Kabadiwala Connect (RE:LINK).
Ranks authorized CPCB recyclers based on Multi-Criteria Decision Analysis (MCDA).

Scoring Formulation:
Score = (w1 * price_offered_norm) + (w2 * (1 / distance_km_norm)) + (w3 * material_fit) + (w4 * pickup_availability) + (w5 * authorization_status)

Weights:
- w1 (Price Offered):        0.35 (35%)
- w2 (Distance / Proximity):  0.25 (25%)
- w3 (Material Fit):         0.20 (20%)
- w4 (Pickup Availability):  0.10 (10%)
- w5 (Authorization Status): 0.10 (10%)

Hard Filter:
- Strict authorization filtering: UNAUTHORIZED or SUSPENDED facilities are 100% excluded,
  regardless of proximity or quoted price, ensuring all material flows exclusively into
  formal, CPCB-registered recycling chains under the E-Waste Rules 2022.
"""

import json
import logging
import math
from pathlib import Path
from typing import List, Dict, Any, Optional

logger = logging.getLogger("kabadiwala.matching.engine")

# Load seed fallback recyclers from dataset file if database is offline
SEED_PATH = Path(__file__).resolve().parent.parent.parent / "datasets" / "seed_recyclers.json"

DEFAULT_RECYCLERS = [
    {
        "id": "rec_ecorecycle_01",
        "name": "EcoRecycle India Pvt Ltd (Ecoreco)",
        "cpcb_registration_no": "CPCB/E-WASTE/REG/MH/2023/1042",
        "location_lat": 19.0550,
        "location_lng": 72.8710,
        "address": "Eco House, Western Express Highway, Goregaon East / Dharavi Hub, Mumbai",
        "materials_accepted": ["mat_pcb_high", "mat_pcb_low", "mat_cables_copper", "mat_batteries_lead", "mat_batteries_li_ion", "mat_crt_monitor", "mat_lcd_panel", "mat_motors_magnets", "mat_mixed_plastics"],
        "authorization_status": "ACTIVE",
        "contact": {"phone": "+91-22-4005-2900", "email": "info@ecoreco.com"},
        "offered_rates": {"mat_pcb_high": 255.0, "mat_pcb_low": 58.0, "mat_cables_copper": 395.0, "mat_batteries_lead": 105.0, "mat_batteries_li_ion": 190.0, "mat_crt_monitor": 16.0, "mat_lcd_panel": 45.0, "mat_motors_magnets": 75.0, "mat_mixed_plastics": 30.0},
        "pickup_availability": True,
        "service_area": "Greater Mumbai & Thane"
    },
    {
        "id": "rec_greencircle_02",
        "name": "GreenCircle Urban Recyclers",
        "cpcb_registration_no": "CPCB/E-WASTE/REG/MH/2022/0891",
        "location_lat": 19.0410,
        "location_lng": 72.8620,
        "address": "Mahim East Industrial Zone, Dharavi Junction, Mumbai",
        "materials_accepted": ["mat_pcb_high", "mat_pcb_low", "mat_cables_copper", "mat_mixed_plastics", "mat_motors_magnets"],
        "authorization_status": "ACTIVE",
        "contact": {"phone": "+91-22-2407-1122", "email": "contact@greencircle.org.in"},
        "offered_rates": {"mat_pcb_high": 248.0, "mat_pcb_low": 54.0, "mat_cables_copper": 385.0, "mat_mixed_plastics": 32.0, "mat_motors_magnets": 74.0},
        "pickup_availability": False,
        "service_area": "Dharavi, Sion, Kurla"
    },
    {
        "id": "rec_cerebra_03",
        "name": "Cerebra Integrated Technologies Ltd",
        "cpcb_registration_no": "CPCB/E-WASTE/REG/MH/2021/0432",
        "location_lat": 19.0820,
        "location_lng": 73.0150,
        "address": "TTC Industrial Area, MIDC Turbhe, Navi Mumbai",
        "materials_accepted": ["mat_pcb_high", "mat_pcb_low", "mat_crt_monitor", "mat_lcd_panel", "mat_cables_copper", "mat_batteries_li_ion"],
        "authorization_status": "ACTIVE",
        "contact": {"phone": "+91-22-2763-8800", "email": "ewaste@cerebracomputers.com"},
        "offered_rates": {"mat_pcb_high": 260.0, "mat_pcb_low": 60.0, "mat_crt_monitor": 18.0, "mat_lcd_panel": 48.0, "mat_cables_copper": 390.0, "mat_batteries_li_ion": 195.0},
        "pickup_availability": True,
        "service_area": "Navi Mumbai, Raigad, Mumbai"
    },
    {
        "id": "rec_unauthorized_yard_06",
        "name": "Backyard Unregistered Scrap Godown",
        "cpcb_registration_no": "NONE",
        "location_lat": 19.0436,
        "location_lng": 72.8568,
        "address": "Dharavi 90 Feet Road, Mumbai",
        "materials_accepted": ["mat_pcb_high", "mat_cables_copper", "mat_batteries_lead"],
        "authorization_status": "UNAUTHORIZED",
        "contact": {"phone": "+91-98765-43210"},
        "offered_rates": {"mat_pcb_high": 270.0, "mat_cables_copper": 410.0},
        "pickup_availability": True,
        "service_area": "Local"
    }
]


def load_all_recyclers() -> List[Dict[str, Any]]:
    """Fetches candidate recyclers from Supabase `recyclers` table or local seed."""
    try:
        from app.db.supabase_client import get_supabase
        sb = get_supabase()
        if sb:
            res = sb.table("recyclers").select("*").execute()
            if res.data and len(res.data) > 0:
                return res.data
    except Exception as e:
        logger.debug(f"Failed to query recyclers from DB: {e}")

    if SEED_PATH.exists():
        try:
            return json.loads(SEED_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return DEFAULT_RECYCLERS


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes Great-Circle Haversine distance between two coordinates in kilometers.
    """
    R = 6371.0  # Earth radius in km
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
    MCDA Recycler Matching Algorithm.
    Filters out unauthorized recyclers (Hard Filter), evaluates multi-criteria fitness,
    and returns ranked authorized recycling facilities.
    """
    from pricing.engine import resolve_material_id
    canonical_id = resolve_material_id(material_id)

    raw_recyclers = load_all_recyclers()
    eligible_candidates = []

    # Phase 1: Hard Filter Verification
    for r in raw_recyclers:
        status = str(r.get("authorization_status", "")).strip().upper()
        # CRITICAL HARD FILTER: Exclude unauthorized, expired, or suspended facilities
        if status not in ["ACTIVE", "AUTHORIZED"]:
            logger.info(f"Excluding facility '{r.get('name')}' due to status: {status}")
            continue

        # Check material acceptance
        materials_accepted = r.get("materials_accepted") or []
        rates = r.get("offered_rates") or {}
        
        # Check if material is accepted or has a listed rate
        is_accepted = (canonical_id in materials_accepted) or (canonical_id in rates)
        if not is_accepted:
            continue

        offered_rate = float(rates.get(canonical_id, 0.0))
        # If rate not explicitly listed, fallback to a competitive baseline
        if offered_rate <= 0.0:
            from pricing.engine import get_base_rate
            base, _ = get_base_rate(canonical_id)
            offered_rate = base

        # Check pickup requirement
        has_pickup = bool(r.get("pickup_availability", False))
        if require_pickup and not has_pickup:
            continue

        # Calculate distance
        r_lat = float(r.get("location_lat", 19.0550))
        r_lng = float(r.get("location_lng", 72.8710))
        distance_km = haversine_distance_km(collector_lat, collector_lng, r_lat, r_lng)

        eligible_candidates.append({
            "raw": r,
            "distance_km": distance_km,
            "offered_rate": offered_rate,
            "pickup_available": has_pickup,
            "estimated_payout": round(offered_rate * float(weight_kg), 2)
        })

    if not eligible_candidates:
        return []

    # Phase 2: Compute Normalizations & MCDA Scores
    max_rate = max(c["offered_rate"] for c in eligible_candidates)
    # Compute inverse distance fitness: 1 / max(dist, 0.1)
    for c in eligible_candidates:
        c["inv_dist"] = 1.0 / max(c["distance_km"], 0.1)
    max_inv_dist = max(c["inv_dist"] for c in eligible_candidates)

    w1_price = 0.35
    w2_dist = 0.25
    w3_mat = 0.20
    w4_pickup = 0.10
    w5_auth = 0.10

    for c in eligible_candidates:
        norm_price = c["offered_rate"] / max_rate if max_rate > 0 else 1.0
        norm_dist = c["inv_dist"] / max_inv_dist if max_inv_dist > 0 else 1.0
        norm_mat = 1.0   # 100% fit because non-fitting materials were filtered out
        norm_pickup = 1.0 if c["pickup_available"] else 0.0
        norm_auth = 1.0   # 100% because unauthorized were hard filtered

        score = (
            (w1_price * norm_price) +
            (w2_dist * norm_dist) +
            (w3_mat * norm_mat) +
            (w4_pickup * norm_pickup) +
            (w5_auth * norm_auth)
        )
        c["mcda_score"] = round(score, 4)

    # Sort descending by composite score
    eligible_candidates.sort(key=lambda x: x["mcda_score"], reverse=True)

    # Phase 3: Highlight Badges & Vernacular Presentation
    highest_payout = max(c["offered_rate"] for c in eligible_candidates)
    lowest_dist = min(c["distance_km"] for c in eligible_candidates)

    ranked_results = []
    for rank, c in enumerate(eligible_candidates, 1):
        r = c["raw"]
        
        # Badge logic
        badges = []
        if c["offered_rate"] == highest_payout:
            badges.append({
                "type": "HIGHEST_PAYOUT",
                "label_en": f"Highest Payout (₹{c['offered_rate']}/kg)",
                "label_hi": f"सबसे ज़्यादा भाव (₹{int(c['offered_rate'])}/किग्रा)",
                "label_mr": f"सर्वाधिक भाव (₹{int(c['offered_rate'])}/किलो)"
            })
        if c["distance_km"] == lowest_dist:
            badges.append({
                "type": "NEAREST_FACILITY",
                "label_en": f"Nearest Facility ({c['distance_km']} km)",
                "label_hi": f"सबसे नज़दीकी केंद्र ({c['distance_km']} किमी)",
                "label_mr": f"सर्वात जवळचे केंद्र ({c['distance_km']} किमी)"
            })
        if c["pickup_available"]:
            badges.append({
                "type": "DOORSTEP_PICKUP",
                "label_en": "Free Doorstep Pickup",
                "label_hi": "मुफ़्त पिकअप उपलब्ध",
                "label_mr": "मोफत वाहतूक उपलब्ध"
            })

        contact_info = r.get("contact") or {}
        phone = contact_info.get("phone") if isinstance(contact_info, dict) else str(contact_info)

        ranked_results.append({
            "rank": rank,
            "recycler_id": r.get("id"),
            "facility_name": r.get("name"),
            "cpcb_reg_no": r.get("cpcb_registration_no"),
            "authorization_status": r.get("authorization_status"),
            "distance_km": c["distance_km"],
            "offered_rate_per_kg": c["offered_rate"],
            "estimated_payout_inr": c["estimated_payout"],
            "pickup_available": c["pickup_available"],
            "address": r.get("address", ""),
            "contact_phone": phone or "+91-22-4005-2900",
            "mcda_score": c["mcda_score"],
            "badges": badges
        })

    return ranked_results
