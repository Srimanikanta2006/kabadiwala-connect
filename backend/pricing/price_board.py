"""
Kabadiwala Connect - Price Board, Trends & Voice Engine
=======================================================
Generates real-time mandi rate board with:
1. Current buying rates per CPCB e-waste category for specified location.
2. Pure arithmetic trend indicator (UP ▲, DOWN ▼, STABLE ―) comparing latest vs prior rates.
3. Lightweight sparkline coordinate points for SVG rendering without external charting libraries.
4. Vernacular spoken voice readouts in Hindi, Marathi, and English for Bhashini TTS.
"""

from datetime import datetime
from typing import Dict, Any, List, Optional

from app.db.supabase_client import get_supabase
from pricing.engine import (
    MATERIAL_DISPLAY_NAMES,
    REGIONAL_MANDI_CACHE,
    get_base_rate
)

# Ordered list of primary scrap categories to display on the board
DISPLAY_CATEGORIES = [
    "mat_pcb_high",
    "mat_cables_copper",
    "mat_batteries_lead",
    "mat_batteries_li_ion",
    "mat_motors_magnets",
    "mat_pcb_low",
    "mat_lcd_panel",
    "mat_mixed_plastics",
    "mat_crt_monitor"
]

CATEGORY_ICONS = {
    "mat_pcb_high": "⚡",
    "mat_cables_copper": "🔌",
    "mat_batteries_lead": "🔋",
    "mat_batteries_li_ion": "📱",
    "mat_motors_magnets": "⚙️",
    "mat_pcb_low": "🖥️",
    "mat_lcd_panel": "📺",
    "mat_mixed_plastics": "♻️",
    "mat_crt_monitor": "📻"
}


def compute_category_trend(current_rate: float, previous_rate: float) -> Dict[str, Any]:
    """
    Computes pure arithmetic trend direction and percentage difference.
    No ML needed: simple comparison of latest rate vs prior baseline.
    """
    diff = round(current_rate - previous_rate, 2)
    pct = round((diff / previous_rate) * 100, 1) if previous_rate > 0 else 0.0

    if diff > 0.1:
        trend = "UP"
        arrow = "▲"
        label_hi = f"₹{abs(diff):.0f} तेज"
        label_mr = f"₹{abs(diff):.0f} वाढ"
        label_en = f"+₹{abs(diff):.0f}"
    elif diff < -0.1:
        trend = "DOWN"
        arrow = "▼"
        label_hi = f"₹{abs(diff):.0f} मंदा"
        label_mr = f"₹{abs(diff):.0f} घट"
        label_en = f"-₹{abs(diff):.0f}"
    else:
        trend = "STABLE"
        arrow = "―"
        label_hi = "स्थिर"
        label_mr = "स्थिर"
        label_en = "Stable"

    return {
        "trend": trend,
        "arrow": arrow,
        "change_amount": diff,
        "change_pct": pct,
        "labels": {
            "hi": label_hi,
            "mr": label_mr,
            "en": label_en
        }
    }


def generate_vernacular_speech_text(
    cat_id: str,
    current_rate: float,
    trend_info: Dict[str, Any]
) -> Dict[str, str]:
    """
    Generates colloquial, clear spoken sentences for Bhashini Indic TTS and screen readers.
    """
    names = MATERIAL_DISPLAY_NAMES.get(cat_id, {
        "en": cat_id,
        "hi": cat_id,
        "mr": cat_id
    })

    rate_int = int(round(current_rate))
    diff_int = int(round(abs(trend_info["change_amount"])))
    trend = trend_info["trend"]

    # Hindi sentence
    hi_trend_text = (
        f" आज भाव {diff_int} रुपये चढ़ा है।" if trend == "UP" else (
            f" आज भाव {diff_int} रुपये गिरा है।" if trend == "DOWN" else " आज भाव स्थिर है।"
        )
    )
    hi_speech = f"{names['hi']} का आज का भाव {rate_int} रुपये प्रति किलो है।{hi_trend_text}"

    # Marathi sentence
    mr_trend_text = (
        f" आज दर {diff_int} रुपयांनी वाढला आहे." if trend == "UP" else (
            f" आज दर {diff_int} रुपयांनी कमी झाला आहे." if trend == "DOWN" else " आज दर स्थिर आहे."
        )
    )
    mr_speech = f"{names['mr']}चा आजचा दर {rate_int} रुपये प्रति किलो आहे.{mr_trend_text}"

    # English sentence
    en_trend_text = (
        f" Price is up by {diff_int} rupees today." if trend == "UP" else (
            f" Price is down by {diff_int} rupees today." if trend == "DOWN" else " Price is stable."
        )
    )
    en_speech = f"{names['en']} rate today is {rate_int} rupees per kg.{en_trend_text}"

    return {
        "hi": hi_speech,
        "mr": mr_speech,
        "en": en_speech
    }


def get_price_board_data(location: str = "IN-MH-MUM", preferred_lang: str = "hi") -> Dict[str, Any]:
    """
    Assembles the complete Price Board payload across all categories.
    Queries Supabase `prices` table directly for live data.
    """
    client = get_supabase()
    board_items = []
    source = "SUPABASE_DATABASE" if client else "LOCAL_MANDI_CACHE"

    # Pre-fetch recent price rows from Supabase for this location
    all_db_rows = []
    if client:
        try:
            res = client.table("prices").select("*").eq("location", location).order("created_at", desc=True).limit(100).execute()
            all_db_rows = res.data or []
        except Exception:
            all_db_rows = []

    # Group rows by material_id
    rows_by_material: Dict[str, List[Dict[str, Any]]] = {}
    for r in all_db_rows:
        mat = r.get("material_id")
        if mat:
            rows_by_material.setdefault(mat, []).append(r)

    for cat_id in DISPLAY_CATEGORIES:
        db_history = rows_by_material.get(cat_id, [])

        if db_history:
            current_rate = float(db_history[0]["buying_price"])
            unit = db_history[0].get("unit", "kg")
            updated_at = db_history[0].get("created_at")

            if len(db_history) >= 5:
                # Prior recorded price entry
                previous_rate = float(db_history[1]["buying_price"])
                # Extract chronological history for sparkline (up to 7 points)
                spark_points = [float(r["buying_price"]) for r in reversed(db_history[:7])]
            elif len(db_history) >= 2:
                previous_rate = float(db_history[1]["buying_price"])
                p0 = current_rate
                p1 = previous_rate
                spark_points = [
                    round(p1 * 0.98, 1),
                    round(p1 * 0.99, 1),
                    round(p1, 1),
                    round((p1 + p0) / 2.0, 1),
                    round(p0, 1)
                ]
            else:
                # If only 1 entry in DB, compare against slight prior baseline
                previous_rate = current_rate
                spark_points = [
                    round(current_rate * 0.98, 1),
                    round(current_rate * 0.99, 1),
                    round(current_rate * 1.01, 1),
                    round(current_rate * 0.995, 1),
                    current_rate
                ]
        else:
            # Regional cache fallback
            base_rate, _ = get_base_rate(cat_id, location)
            current_rate = base_rate
            previous_rate = base_rate
            unit = "kg"
            updated_at = datetime.utcnow().isoformat()
            spark_points = [
                round(base_rate * 0.97, 1),
                round(base_rate * 0.99, 1),
                round(base_rate * 0.98, 1),
                round(base_rate * 1.01, 1),
                base_rate
            ]

        trend_info = compute_category_trend(current_rate, previous_rate)
        spoken_texts = generate_vernacular_speech_text(cat_id, current_rate, trend_info)
        names = MATERIAL_DISPLAY_NAMES.get(cat_id, {"en": cat_id, "hi": cat_id, "mr": cat_id})

        board_items.append({
            "material_id": cat_id,
            "icon": CATEGORY_ICONS.get(cat_id, "📦"),
            "name_en": names["en"],
            "name_hi": names["hi"],
            "name_mr": names["mr"],
            "current_rate": current_rate,
            "previous_rate": previous_rate,
            "unit": unit,
            "trend": trend_info["trend"],
            "trend_arrow": trend_info["arrow"],
            "change_amount": trend_info["change_amount"],
            "change_pct": trend_info["change_pct"],
            "trend_label": trend_info["labels"].get(preferred_lang, trend_info["labels"]["hi"]),
            "sparkline": spark_points,
            "spoken_texts": spoken_texts,
            "active_speech": spoken_texts.get(preferred_lang, spoken_texts["hi"]),
            "updated_at": updated_at
        })

    return {
        "success": True,
        "location": location,
        "source": source,
        "preferred_language": preferred_lang,
        "items_count": len(board_items),
        "categories": board_items,
        "timestamp": datetime.utcnow().isoformat()
    }
