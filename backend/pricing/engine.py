"""
Dynamic Rule-Based Pricing Engine for Kabadiwala Connect (RE:LINK).
Calculates transparent scrap valuation from classified material, weight, and condition.

Rule Formulation:
estimated_value = base_rate_per_kg * weight_kg * condition_multiplier

Condition Multipliers:
- good  = 1.00 (Clean, intact, sorted)
- fair  = 0.80 (Dirty, unsorted, mixed casings)
- poor  = 0.55 (Damaged, burnt, stripped, desoldered)

Dynamic Lookup:
Looks up base_rate_per_kg from Supabase `prices` table by material_id + location,
with graceful fallback to local regional mandi cache if offline.
"""

import logging
from typing import Dict, Any, Optional, Tuple

logger = logging.getLogger("kabadiwala.pricing.engine")

# Regional fallback cache (₹/kg) when offline or DB unreachable
REGIONAL_MANDI_CACHE: Dict[str, Dict[str, float]] = {
    "IN-MH-MUM": {
        "mat_pcb_high": 240.0,
        "mat_pcb_low": 55.0,
        "mat_crt_monitor": 15.0,
        "mat_lcd_panel": 42.0,
        "mat_cables_copper": 380.0,
        "mat_batteries_lead": 100.0,
        "mat_batteries_li_ion": 185.0,
        "mat_motors_magnets": 72.0,
        "mat_mixed_plastics": 28.0
    },
    "IN-MH-PUN": {
        "mat_pcb_high": 230.0,
        "mat_pcb_low": 50.0,
        "mat_crt_monitor": 14.0,
        "mat_lcd_panel": 40.0,
        "mat_cables_copper": 370.0,
        "mat_batteries_lead": 95.0,
        "mat_batteries_li_ion": 175.0,
        "mat_motors_magnets": 68.0,
        "mat_mixed_plastics": 26.0
    }
}

# Synonyms and condition multiplier mappings
CONDITION_MULTIPLIERS: Dict[str, float] = {
    "good": 1.0,
    "clean_intact": 1.0,
    "clean": 1.0,
    "intact": 1.0,
    "fair": 0.8,
    "dirty_mixed": 0.8,
    "dirty": 0.8,
    "mixed": 0.8,
    "poor": 0.55,
    "damaged_burnt": 0.55,
    "damaged": 0.55,
    "burnt": 0.55
}

# Alias map from macro/colloquial names to canonical taxonomy IDs
CATEGORY_ALIAS_MAP: Dict[str, str] = {
    "crt": "mat_crt_monitor",
    "crt monitor": "mat_crt_monitor",
    "crt-monitor": "mat_crt_monitor",
    "lcd": "mat_lcd_panel",
    "lcd-panel": "mat_lcd_panel",
    "lcd_panel": "mat_lcd_panel",
    "pcb": "mat_pcb_high",
    "motherboard": "mat_pcb_high",
    "pcb-high": "mat_pcb_high",
    "pcb-low": "mat_pcb_low",
    "cable": "mat_cables_copper",
    "copper": "mat_cables_copper",
    "copper cable": "mat_cables_copper",
    "battery": "mat_batteries_lead",
    "lead-acid": "mat_batteries_lead",
    "li-ion": "mat_batteries_li_ion",
    "lithium": "mat_batteries_li_ion",
    "motor": "mat_motors_magnets",
    "motor-magnet": "mat_motors_magnets",
    "motor_magnet": "mat_motors_magnets",
    "plastic": "mat_mixed_plastics",
    "mixed-plastic": "mat_mixed_plastics",
    "mixed_plastic": "mat_mixed_plastics"
}

MATERIAL_DISPLAY_NAMES = {
    "mat_pcb_high": {"en": "High-Grade PCB", "hi": "हाई-ग्रेड सर्किट बोर्ड", "mr": "हाय-ग्रेड सर्किट बोर्ड"},
    "mat_pcb_low": {"en": "Low-Grade PCB", "hi": "लो-ग्रेड सर्किट बोर्ड", "mr": "लो-ग्रेड सर्किट बोर्ड"},
    "mat_crt_monitor": {"en": "CRT Monitor", "hi": "सीआरटी मॉनिटर", "mr": "सीआरटी मॉनिटर"},
    "mat_lcd_panel": {"en": "LCD Panel", "hi": "एलसीडी स्क्रीन", "mr": "एलसीडी स्क्रीन"},
    "mat_cables_copper": {"en": "Copper Cables", "hi": "तांबे के तार", "mr": "तांब्याची केबल"},
    "mat_batteries_lead": {"en": "Lead-Acid Battery", "hi": "लेड-एसिड बैटरी", "mr": "लेड-अ‍ॅसिड बॅटरी"},
    "mat_batteries_li_ion": {"en": "Lithium-Ion Battery", "hi": "लिथियम बैटरी", "mr": "लिथियम बॅटरी"},
    "mat_motors_magnets": {"en": "Motors & Magnets", "hi": "मोटर और चुंबक", "mr": "मोटार आणि चुंबक"},
    "mat_mixed_plastics": {"en": "Technical Plastics", "hi": "टेक्निकल प्लास्टिक", "mr": "टेक्निकल प्लास्टिक"}
}


def resolve_material_id(raw_identifier: str) -> str:
    """Normalizes any category slug, macro name, or ID to canonical material_id."""
    clean = str(raw_identifier).strip().lower()
    if clean in CATEGORY_ALIAS_MAP:
        return CATEGORY_ALIAS_MAP[clean]
    if raw_identifier in MATERIAL_DISPLAY_NAMES:
        return raw_identifier
    return clean


def get_base_rate(material_id: str, location: str = "IN-MH-MUM") -> Tuple[float, str]:
    """
    Fetches base_rate_per_kg dynamically from Supabase `prices` table.
    Falls back to regional cache if database is unreachable or offline.
    Returns (rate, source).
    """
    canonical_id = resolve_material_id(material_id)

    # 1. Attempt dynamic live lookup from Supabase
    try:
        from app.db.supabase_client import get_supabase
        sb = get_supabase()
        if sb:
            query = sb.table("prices").select("buying_price").eq("material_id", canonical_id)
            if location:
                query = query.eq("location", location)
            res = query.order("created_at", desc=True).limit(1).execute()
            if res.data and len(res.data) > 0:
                rate = float(res.data[0]["buying_price"])
                return rate, "SUPABASE_DATABASE"
            
            # If not found for specific location, query without location filter
            fallback_res = sb.table("prices").select("buying_price").eq("material_id", canonical_id).order("created_at", desc=True).limit(1).execute()
            if fallback_res.data and len(fallback_res.data) > 0:
                rate = float(fallback_res.data[0]["buying_price"])
                return rate, "SUPABASE_DATABASE"
    except Exception as e:
        logger.debug(f"Supabase price lookup fallback triggered: {e}")

    # 2. Regional cache fallback
    reg = location if location in REGIONAL_MANDI_CACHE else "IN-MH-MUM"
    rates = REGIONAL_MANDI_CACHE.get(reg, REGIONAL_MANDI_CACHE["IN-MH-MUM"])
    rate = rates.get(canonical_id, 50.0)
    return rate, "LOCAL_MANDI_CACHE"


def get_mandi_base_rate(material_id: str, location: str = "IN-MH-MUM") -> float:
    """Convenience helper returning benchmark base rate per kg as float."""
    rate, _ = get_base_rate(material_id, location)
    return rate


def calculate_valuation(
    material_id: str,
    weight_kg: float,
    condition: str = "good",
    location: str = "IN-MH-MUM"
) -> Dict[str, Any]:
    """
    Pure dynamic pricing calculation:
    estimated_value = base_rate_per_kg * weight_kg * condition_multiplier

    Args:
        material_id: Material category ID or macro name (e.g. 'mat_pcb_high', 'PCB', 'CRT')
        weight_kg: Weight of scrap lot in kilograms (float > 0)
        condition: Quality condition ('good'=1.0, 'fair'=0.8, 'poor'=0.55)
        location: Regional mandi code (e.g. 'IN-MH-MUM')

    Returns:
        Structured valuation payload with estimated value, range, rate breakdown, and vernacular audio text.
    """
    if weight_kg <= 0:
        raise ValueError("Weight must be greater than zero kg.")

    canonical_id = resolve_material_id(material_id)
    base_rate, source = get_base_rate(canonical_id, location)

    # Condition multiplier normalization
    cond_clean = str(condition).strip().lower()
    cond_mult = CONDITION_MULTIPLIERS.get(cond_clean, 1.0)
    standard_condition = "good" if cond_mult == 1.0 else ("fair" if cond_mult == 0.8 else "poor")

    # Core Formula
    nominal_total = round(base_rate * float(weight_kg) * cond_mult, 2)

    # 5% Market Valuation Spread Interval
    min_inr = round(nominal_total * 0.95, 2)
    max_inr = round(nominal_total * 1.05, 2)

    names = MATERIAL_DISPLAY_NAMES.get(canonical_id, {"en": canonical_id, "hi": canonical_id, "mr": canonical_id})

    # Vernacular spoken summaries for low-literacy readouts (Bhashini/Web Speech)
    spoken_hi = f"{weight_kg:.1f} किलो {names['hi']} का अनुमानित मूल्य ₹{int(round(min_inr))} से ₹{int(round(max_inr))} के बीच है।"
    spoken_mr = f"{weight_kg:.1f} किलो {names['mr']} चे अंदाजे मूल्य ₹{int(round(min_inr))} ते ₹{int(round(max_inr))} दरम्यान आहे."

    return {
        "material_id": canonical_id,
        "category_name": names["en"],
        "location": location,
        "weight_kg": float(weight_kg),
        "condition": standard_condition,
        "condition_multiplier": cond_mult,
        "base_rate_per_kg": base_rate,
        "estimated_value_inr": nominal_total,
        "estimated_range_inr": {
            "min_inr": min_inr,
            "max_inr": max_inr
        },
        "price_source": source,
        "spoken_summary_hi": spoken_hi,
        "spoken_summary_mr": spoken_mr
    }


def update_base_rate_in_db(material_id: str, new_rate: float, location: str = "IN-MH-MUM") -> bool:
    """
    Updates the base rate in the Supabase database.
    Used for administrative updates, market feed ingestion, and verification tests.
    """
    canonical_id = resolve_material_id(material_id)
    try:
        from app.db.supabase_client import get_supabase
        import datetime
        sb = get_supabase()
        if not sb:
            return False
        today = datetime.date.today().isoformat()
        res = sb.table("prices").select("id").eq("material_id", canonical_id).eq("location", location).execute()
        if res.data and len(res.data) > 0:
            sb.table("prices").update({"buying_price": float(new_rate), "date": today}).eq("id", res.data[0]["id"]).execute()
            return True
        return False
    except Exception as e:
        logger.error(f"Error updating price in DB: {e}")
        return False
