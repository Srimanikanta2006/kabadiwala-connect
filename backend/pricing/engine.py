"""
Pricing Engine for Kabadiwala Connect.
Calculates fair valuation ranges based on cached Mandi rates, condition multipliers,
and volume incentives.
"""

from typing import Dict, Any

REGIONAL_MANDI_CACHE = {
    "IN-MH-MUM": {
        "mat_pcb_high": 245.0,
        "mat_pcb_low": 55.0,
        "mat_crt_monitor": 12.0,
        "mat_lcd_panel": 42.0,
        "mat_cables_copper": 380.0,
        "mat_batteries_lead": 98.0,
        "mat_batteries_li_ion": 185.0,
        "mat_motors_magnets": 72.0,
        "mat_mixed_plastics": 28.0,
    },
    "IN-MH-PUN": {
        "mat_pcb_high": 235.0,
        "mat_pcb_low": 50.0,
        "mat_crt_monitor": 10.0,
        "mat_lcd_panel": 40.0,
        "mat_cables_copper": 370.0,
        "mat_batteries_lead": 95.0,
        "mat_batteries_li_ion": 175.0,
        "mat_motors_magnets": 68.0,
        "mat_mixed_plastics": 26.0,
    }
}

CONDITION_MULTIPLIERS = {
    "CLEAN_INTACT": 1.0,
    "DIRTY_MIXED": 0.85,
    "DAMAGED_BURNT": 0.70
}


def calculate_valuation(
    material_id: str,
    weight_kg: float,
    condition: str = "CLEAN_INTACT",
    region_code: str = "IN-MH-MUM"
) -> Dict[str, Any]:
    region_rates = REGIONAL_MANDI_CACHE.get(region_code, REGIONAL_MANDI_CACHE["IN-MH-MUM"])
    base_rate = region_rates.get(material_id, 50.0)

    cond_mult = CONDITION_MULTIPLIERS.get(condition, 1.0)
    volume_mult = 1.03 if weight_kg >= 30.0 else 1.0

    effective_rate = round(base_rate * cond_mult * volume_mult, 2)
    nominal_total = effective_rate * weight_kg

    min_inr = round(nominal_total * 0.95, 2)
    max_inr = round(nominal_total * 1.08, 2)

    spoken_hi = f"{weight_kg:.1f} किलो सामग्री का अनुमानित मूल्य ₹{int(min_inr)} से ₹{int(max_inr)} के बीच है।"
    spoken_mr = f"{weight_kg:.1f} किलो साहित्याचे अंदाजे मूल्य ₹{int(min_inr)} ते ₹{int(max_inr)} दरम्यान आहे."

    return {
        "material_id": material_id,
        "weight_kg": weight_kg,
        "calculated_rate_per_kg": effective_rate,
        "estimated_total_range_inr": {
            "min_inr": min_inr,
            "max_inr": max_inr
        },
        "spoken_summary_hi": spoken_hi,
        "spoken_summary_mr": spoken_mr
    }
