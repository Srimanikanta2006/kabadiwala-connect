"""
Anomaly Detection Service for Kabadiwala Connect.
"""

from typing import Dict, Any, List, Optional

MATERIAL_WEIGHT_BOUNDS = {
    "mat_pcb_high": {"min_kg": 0.1, "max_kg": 250.0},
    "mat_pcb_low": {"min_kg": 0.2, "max_kg": 500.0},
    "mat_crt_monitor": {"min_kg": 5.0, "max_kg": 300.0},
    "mat_lcd_panel": {"min_kg": 1.0, "max_kg": 200.0},
    "mat_cables_copper": {"min_kg": 0.5, "max_kg": 1000.0},
    "mat_batteries_lead": {"min_kg": 3.0, "max_kg": 800.0},
    "mat_batteries_li_ion": {"min_kg": 0.05, "max_kg": 100.0},
    "mat_motors_magnets": {"min_kg": 0.5, "max_kg": 600.0},
    "mat_mixed_plastics": {"min_kg": 1.0, "max_kg": 1000.0}
}


def check_weight_plausibility(material_id: str, weight_kg: float) -> Optional[Dict[str, Any]]:
    bounds = MATERIAL_WEIGHT_BOUNDS.get(material_id)
    if not bounds:
        return None

    if weight_kg < bounds["min_kg"] or weight_kg > bounds["max_kg"]:
        return {
            "error_code": "WEIGHT_OUT_OF_BOUNDS",
            "message_en": f"Entered weight ({weight_kg} kg) exceeds plausible range ({bounds['min_kg']}-{bounds['max_kg']} kg).",
            "message_hi": f"दर्ज किया गया वजन ({weight_kg} किलो) सामान्य सीमा से बाहर है।",
            "message_mr": f"नोंदवलेले वजन ({weight_kg} किलो) सामान्य मर्यादेबाहेर आहे."
        }
    return None


def hamming_distance(hash1: str, hash2: str) -> int:
    try:
        val1 = int(hash1, 16)
        val2 = int(hash2, 16)
        xor_val = val1 ^ val2
        return bin(xor_val).count('1')
    except Exception:
        return 99


def check_duplicate_image(new_hash: str, recent_hashes: List[str], threshold: int = 4) -> bool:
    if not new_hash:
        return False
    for existing in recent_hashes:
        if hamming_distance(new_hash, existing) <= threshold:
            return True
    return False
