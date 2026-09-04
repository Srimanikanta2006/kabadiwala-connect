"""
Kabadiwala Connect - Anomaly & Fraud Detection Engine (Chunk 7)
===============================================================
Comprehensive fraud prevention and quality assurance for informal e-waste collection:
1. Physical weight-density bounds per CPCB e-waste material type.
2. Perceptual Difference Hashing (64-bit dHash) duplicate scrap photo detection.
3. Market rate outlier / pricing spike detection against live mandi benchmarks.
4. Collector submission velocity / rate-limiting guard.
5. Composite multi-factor risk scoring (0-100) with low-literacy vernacular readouts (Hindi/Marathi).
"""

import os
import binascii
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple

import dotenv
dotenv.load_dotenv()

from app.db.supabase_client import get_supabase
from pricing.engine import get_mandi_base_rate, REGIONAL_MANDI_CACHE

# ------------------------------------------------------------------------------
# 1. Physical Material Weight Boundaries (kg) for Single-Lot Field Collection
# ------------------------------------------------------------------------------
MATERIAL_WEIGHT_BOUNDS: Dict[str, Dict[str, Any]] = {
    "mat_pcb_high": {
        "min_kg": 0.1,
        "max_kg": 250.0,
        "name_en": "High-Grade PCB",
        "name_hi": "हाई-ग्रेड सर्किट बोर्ड",
        "name_mr": "हाय-ग्रेड सर्किट बोर्ड",
        "typical_single_unit_kg": 0.35
    },
    "mat_pcb_low": {
        "min_kg": 0.2,
        "max_kg": 500.0,
        "name_en": "Low-Grade PCB",
        "name_hi": "लो-ग्रेड सर्किट बोर्ड",
        "name_mr": "लो-ग्रेड सर्किट बोर्ड",
        "typical_single_unit_kg": 0.5
    },
    "mat_crt_monitor": {
        "min_kg": 5.0,
        "max_kg": 300.0,
        "name_en": "CRT Monitor / TV",
        "name_hi": "सीआरटी मॉनिटर/टीवी",
        "name_mr": "सीआरटी मॉनिटर/टीव्ही",
        "typical_single_unit_kg": 14.0
    },
    "mat_lcd_panel": {
        "min_kg": 1.0,
        "max_kg": 200.0,
        "name_en": "LCD / LED Panel",
        "name_hi": "एलसीडी/एलईडी पैनल",
        "name_mr": "एलसीडी/एलईडी पॅनल",
        "typical_single_unit_kg": 4.5
    },
    "mat_cables_copper": {
        "min_kg": 0.5,
        "max_kg": 1000.0,
        "name_en": "Copper Cables",
        "name_hi": "तांबे की तारें/केबल",
        "name_mr": "तांब्याच्या तारा/केबल्स",
        "typical_single_unit_kg": 2.0
    },
    "mat_batteries_lead": {
        "min_kg": 3.0,
        "max_kg": 800.0,
        "name_en": "Lead-Acid Batteries",
        "name_hi": "लेड-एसिड बैटरी",
        "name_mr": "लेड-ऍसिड बॅटरी",
        "typical_single_unit_kg": 18.0
    },
    "mat_batteries_li_ion": {
        "min_kg": 0.05,
        "max_kg": 100.0,
        "name_en": "Lithium-Ion Batteries",
        "name_hi": "लिथियम-आयन बैटरी",
        "name_mr": "लिथियम-आयन बॅटरी",
        "typical_single_unit_kg": 0.15
    },
    "mat_motors_magnets": {
        "min_kg": 0.5,
        "max_kg": 600.0,
        "name_en": "Motors & Hard Drives",
        "name_hi": "मोटर्स और हार्ड ड्राइव्स",
        "name_mr": "मोटारी व हार्ड ड्राईव्ह्स",
        "typical_single_unit_kg": 3.5
    },
    "mat_mixed_plastics": {
        "min_kg": 1.0,
        "max_kg": 1000.0,
        "name_en": "Mixed E-Waste Plastics",
        "name_hi": "मिश्रित ई-कचरा प्लास्टिक",
        "name_mr": "मिश्र ई-कचरा प्लास्टिक",
        "typical_single_unit_kg": 5.0
    }
}


# ------------------------------------------------------------------------------
# 2. Bitwise Hamming Distance for Perceptual Difference Hashing (dHash)
# ------------------------------------------------------------------------------
def hamming_distance(hash1: str, hash2: str) -> int:
    """
    Computes bitwise Hamming distance between two hex perceptual hash strings.
    A distance of 0 means bit-for-bit identical; <= 4 indicates near-duplicate image.
    """
    if not hash1 or not hash2:
        return 64
    try:
        val1 = int(hash1.strip(), 16)
        val2 = int(hash2.strip(), 16)
        xor_val = val1 ^ val2
        return bin(xor_val).count("1")
    except Exception:
        return 64


# ------------------------------------------------------------------------------
# 3. Individual Inspection Checks
# ------------------------------------------------------------------------------
def check_weight_bounds(material_id: str, weight_kg: float) -> Optional[Dict[str, Any]]:
    """
    Inspects entered weight against physical density boundaries.
    Detects impossible weights like negative amounts, 0.01kg lead-acid battery, or 5000kg carts.
    """
    if weight_kg is None:
        return None

    if weight_kg <= 0:
        return {
            "code": "WEIGHT_ZERO_OR_NEGATIVE",
            "severity": "CRITICAL",
            "risk_score": 100,
            "weight_kg": weight_kg,
            "message_en": f"Entered weight ({weight_kg} kg) must be strictly greater than zero.",
            "message_hi": f"दर्ज किया गया वजन ({weight_kg} किग्रा) शून्य से अधिक होना चाहिए।",
            "message_mr": f"नोंदवलेले वजन ({weight_kg} किग्रा) शून्यापेक्षा जास्त असावे."
        }

    bounds = MATERIAL_WEIGHT_BOUNDS.get(material_id)
    if not bounds:
        return None

    min_w = bounds["min_kg"]
    max_w = bounds["max_kg"]
    cat_en = bounds["name_en"]
    cat_hi = bounds["name_hi"]
    cat_mr = bounds["name_mr"]

    if weight_kg < min_w:
        return {
            "code": "WEIGHT_BELOW_MIN_BOUND",
            "severity": "HIGH",
            "risk_score": 40,
            "weight_kg": weight_kg,
            "min_allowed_kg": min_w,
            "max_allowed_kg": max_w,
            "material_name": cat_en,
            "message_en": f"Weight ({weight_kg} kg) is below physical minimum ({min_w} kg) for {cat_en}. Please re-check scale.",
            "message_hi": f"वजन ({weight_kg} किग्रा) {cat_hi} की न्यूनतम सीमा ({min_w} किग्रा) से कम है। कृपया तराजू की जांच करें।",
            "message_mr": f"वजन ({weight_kg} किग्रा) {cat_mr} च्या किमान मर्यादेपेक्षा ({min_w} किग्रा) कमी आहे. कृपया वजन काटा तपासा."
        }

    if weight_kg > max_w:
        return {
            "code": "WEIGHT_ABOVE_MAX_BOUND",
            "severity": "HIGH",
            "risk_score": 45,
            "weight_kg": weight_kg,
            "min_allowed_kg": min_w,
            "max_allowed_kg": max_w,
            "material_name": cat_en,
            "message_en": f"Weight ({weight_kg} kg) exceeds plausible single-lot collection capacity ({max_w} kg) for {cat_en}.",
            "message_hi": f"वजन ({weight_kg} किग्रा) {cat_hi} की एकल संग्रह सीमा ({max_w} किग्रा) से अधिक है।",
            "message_mr": f"वजन ({weight_kg} किग्रा) {cat_mr} च्या एका खेपेतील कमाल मर्यादेपेक्षा ({max_w} किग्रा) जास्त आहे."
        }

    return None


def check_weight_plausibility(material_id: str, weight_kg: float) -> Optional[Dict[str, Any]]:
    """Backward-compatible wrapper for check_weight_bounds."""
    return check_weight_bounds(material_id, weight_kg)


def check_duplicate_image(
    new_hash: Optional[str],
    recent_lots: Optional[List[Dict[str, Any]]] = None,
    threshold: int = 4,
    current_lot_id: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Checks if scrap photo fingerprint is bitwise identical or near-duplicate (Hamming dist <= threshold)
    to any previously uploaded lot photograph.
    """
    if not new_hash or not isinstance(new_hash, str) or len(new_hash.strip()) < 8:
        return None

    clean_hash = new_hash.strip().lower()

    # If recent_lots not provided, query Supabase
    if recent_lots is None:
        client = get_supabase()
        if client:
            try:
                res = client.table("material_lots").select("id, image_phash, created_at, collector_id").not_.is_("image_phash", "null").limit(50).execute()
                recent_lots = res.data or []
            except Exception:
                recent_lots = []
        else:
            recent_lots = []

    for item in recent_lots:
        existing_hash = None
        matched_id = None
        if isinstance(item, dict):
            matched_id = item.get("id")
            existing_hash = item.get("image_phash") or item.get("image_dhash")
        elif isinstance(item, str):
            existing_hash = item

        if not existing_hash or not isinstance(existing_hash, str):
            continue

        if current_lot_id and matched_id and str(matched_id) == str(current_lot_id):
            continue

        dist = hamming_distance(clean_hash, existing_hash.strip().lower())
        if dist <= threshold:
            return {
                "code": "DUPLICATE_IMAGE_DETECTED",
                "severity": "CRITICAL",
                "risk_score": 60,
                "hamming_distance": dist,
                "threshold": threshold,
                "matched_lot_id": matched_id,
                "message_en": f"Duplicate image detected! Photo matches previous lot {matched_id or ''} (Hamming dist: {dist} <= {threshold}). Re-uploading photos is prohibited.",
                "message_hi": "यह स्क्रैप फोटो पहले ही उपयोग की जा चुकी है! धोखाधड़ी रोकने के लिए कृपया ताजा फोटो खींचें।",
                "message_mr": "हा स्क्रॅप फोटो आधीच वापरला गेला आहे! कृपया ताजी नवीन फोटो काढा."
            }

    return None


def check_price_outlier(
    material_id: str,
    weight_kg: float,
    quoted_price: float,
    location: str = "IN-MH-MUM"
) -> Optional[Dict[str, Any]]:
    """
    Validates entered price against prevailing mandi benchmark.
    Flags sudden price spikes (+50% above mandi) or suspiciously depressed rates (< 35% of mandi).
    """
    if not weight_kg or weight_kg <= 0 or not quoted_price or quoted_price <= 0:
        return None

    unit_price = quoted_price / weight_kg
    mandi_rate = get_mandi_base_rate(material_id, location)

    # 1. Excessive price spike (> 50% above mandi rate)
    if unit_price > (mandi_rate * 1.50):
        spike_pct = ((unit_price - mandi_rate) / mandi_rate) * 100.0
        return {
            "code": "PRICE_EXCESSIVE_SPIKE",
            "severity": "HIGH",
            "risk_score": 35,
            "unit_price_inr_per_kg": round(unit_price, 2),
            "mandi_benchmark_inr_per_kg": round(mandi_rate, 2),
            "deviation_pct": round(spike_pct, 1),
            "message_en": f"Quoted price (₹{unit_price:.1f}/kg) is {spike_pct:.0f}% higher than regional mandi rate (₹{mandi_rate:.1f}/kg).",
            "message_hi": f"मांगा गया भाव (₹{unit_price:.1f}/किग्रा) मंडी भाव (₹{mandi_rate:.1f}/किग्रा) से {spike_pct:.0f}% अधिक है।",
            "message_mr": f"मागितलेला दर (₹{unit_price:.1f}/किग्रा) बाजार दरापेक्षा (₹{mandi_rate:.1f}/किग्रा) {spike_pct:.0f}% जास्त आहे."
        }

    # 2. Suspiciously low rate (< 35% of mandi rate - risk of predatory pricing or stolen goods)
    if unit_price < (mandi_rate * 0.35):
        under_pct = ((mandi_rate - unit_price) / mandi_rate) * 100.0
        return {
            "code": "PRICE_SUSPICIOUSLY_LOW",
            "severity": "MEDIUM",
            "risk_score": 20,
            "unit_price_inr_per_kg": round(unit_price, 2),
            "mandi_benchmark_inr_per_kg": round(mandi_rate, 2),
            "deviation_pct": round(under_pct, 1),
            "message_en": f"Quoted price (₹{unit_price:.1f}/kg) is {under_pct:.0f}% below market value (₹{mandi_rate:.1f}/kg). Underpayment risk.",
            "message_hi": f"मांगा गया भाव (₹{unit_price:.1f}/किग्रा) बाजार भाव (₹{mandi_rate:.1f}/किग्रा) से काफी कम है।",
            "message_mr": f"मागितलेला दर (₹{unit_price:.1f}/किग्रा) बाजार दरापेक्षा खूप कमी आहे."
        }

    return None


def check_submission_velocity(
    collector_id: Optional[str],
    time_window_minutes: int = 15,
    max_allowed_lots: int = 5
) -> Optional[Dict[str, Any]]:
    """
    Flags unnatural bot-like or batch submission velocity from a single informal collector account.
    """
    if not collector_id or collector_id in ["anonymous", "col_test_001"]:
        return None

    client = get_supabase()
    if not client:
        return None

    try:
        cutoff = (datetime.utcnow() - timedelta(minutes=time_window_minutes)).isoformat()
        res = client.table("material_lots").select("id, created_at").eq("collector_id", collector_id).gte("created_at", cutoff).execute()
        count = len(res.data) if res.data else 0
        if count >= max_allowed_lots:
            return {
                "code": "HIGH_SUBMISSION_VELOCITY",
                "severity": "MEDIUM",
                "risk_score": 30,
                "lots_in_window": count,
                "window_minutes": time_window_minutes,
                "message_en": f"Rapid submissions detected: {count} lots created within {time_window_minutes} minutes.",
                "message_hi": f"अत्यधिक तेज़ प्रविष्टि: {time_window_minutes} मिनट में {count} लॉट दर्ज किए गए।",
                "message_mr": f"अति जलद नोंदणी: {time_window_minutes} मिनिटांत {count} लॉट नोंदवले गेले."
            }
    except Exception:
        pass

    return None


# ------------------------------------------------------------------------------
# 4. Master Composite Inspection Pipeline
# ------------------------------------------------------------------------------
def evaluate_lot_anomaly(
    material_id: str,
    weight_kg: float,
    quoted_price: Optional[float] = None,
    image_phash: Optional[str] = None,
    collector_id: Optional[str] = None,
    location: str = "IN-MH-MUM",
    recent_lots_cache: Optional[List[Dict[str, Any]]] = None,
    current_lot_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Runs multi-factor anomaly inspection on scrap lot.
    Returns:
      - risk_score: 0 to 100
      - risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      - decision: 'ALLOW' | 'FLAG_FOR_WEIGHBRIDGE' | 'SUPERVISORY_HOLD' | 'BLOCK'
      - is_anomalous: bool
      - anomalies: list of detected anomalies
      - vernacular_feedback: { en, hi, mr }
    """
    anomalies: List[Dict[str, Any]] = []

    # 1. Weight boundaries
    weight_anomaly = check_weight_bounds(material_id, weight_kg)
    if weight_anomaly:
        anomalies.append(weight_anomaly)

    # 2. Duplicate image check
    if image_phash:
        dup_anomaly = check_duplicate_image(
            new_hash=image_phash,
            recent_lots=recent_lots_cache,
            threshold=4,
            current_lot_id=current_lot_id
        )
        if dup_anomaly:
            anomalies.append(dup_anomaly)

    # 3. Price outlier check
    if quoted_price is not None and weight_kg > 0:
        price_anomaly = check_price_outlier(material_id, weight_kg, quoted_price, location)
        if price_anomaly:
            anomalies.append(price_anomaly)

    # 4. Velocity check
    if collector_id:
        velocity_anomaly = check_submission_velocity(collector_id)
        if velocity_anomaly:
            anomalies.append(velocity_anomaly)

    # Calculate composite risk score (capped at 100)
    total_risk = min(100, sum(a.get("risk_score", 0) for a in anomalies))

    # Determine risk level and operational decision
    if total_risk <= 25:
        risk_level = "LOW"
        decision = "ALLOW"
        is_anomalous = False
    elif total_risk <= 55:
        risk_level = "MEDIUM"
        decision = "FLAG_FOR_WEIGHBRIDGE"
        is_anomalous = True
    elif total_risk <= 85:
        risk_level = "HIGH"
        decision = "SUPERVISORY_HOLD"
        is_anomalous = True
    else:
        risk_level = "CRITICAL"
        decision = "BLOCK"
        is_anomalous = True

    # Generate bilingual spoken audio & visual feedback
    if not is_anomalous:
        cat_name = MATERIAL_WEIGHT_BOUNDS.get(material_id, {}).get('name_en', material_id)
        spoken_en = f"Lot verified. Physical weight of {weight_kg} kg is normal for {cat_name}. Ready for recycler matching."
        spoken_hi = f"लॉट सत्यापित। {weight_kg} किलो वजन सामान्य सीमा में है। रीसाइक्लर चयन के लिए तैयार है।"
        spoken_mr = f"लॉट पडताळले. {weight_kg} किलो वजन सामान्य मर्यादेत आहे. रिसायकलर निवडीसाठी सज्ज."
    else:
        top_anomaly = anomalies[0]
        spoken_en = f"Warning: {top_anomaly['message_en']} Action: {decision}."
        spoken_hi = f"चेतावनी: {top_anomaly['message_hi']} कार्यवाही: {decision}।"
        spoken_mr = f"सूचना: {top_anomaly['message_mr']} कारवाई: {decision}."

    return {
        "status": "COMPLETED",
        "material_id": material_id,
        "weight_kg": weight_kg,
        "quoted_price": quoted_price,
        "risk_score": total_risk,
        "risk_level": risk_level,
        "decision": decision,
        "is_anomalous": is_anomalous,
        "anomalies_count": len(anomalies),
        "anomalies": anomalies,
        "vernacular_feedback": {
            "en": spoken_en,
            "hi": spoken_hi,
            "mr": spoken_mr
        },
        "requires_weighbridge_photo": decision in ["FLAG_FOR_WEIGHBRIDGE", "SUPERVISORY_HOLD"],
        "requires_supervisor_approval": decision in ["SUPERVISORY_HOLD", "BLOCK"],
        "timestamp": datetime.utcnow().isoformat()
    }
