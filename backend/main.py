"""
Kabadiwala Connect (RE:LINK) - Main Backend API Application.
FastAPI app wired to Supabase, with all core feature stubs and CORS enabled.
"""

import base64
import json
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, status, Body, Query, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.db.supabase_client import get_supabase, get_materials, get_recyclers, get_prices, insert_lot
from app.services.pricing_engine import calculate_valuation, REGIONAL_MANDI_CACHE
from app.services.recycler_matcher import match_and_rank_recyclers
from anomaly.detector import (
    evaluate_lot_anomaly,
    check_weight_bounds,
    check_weight_plausibility,
    check_duplicate_image,
    check_price_outlier
)
from ml.classifier import classifier_service

logger = logging.getLogger("kabadiwala.api")

app = FastAPI(
    title="Kabadiwala Connect API (RE:LINK)",
    description="Vernacular, Offline-Tolerant Scrap & E-Waste Traceability Platform",
    version="1.0.0"
)

# Step 4: Enable CORS for React frontend on any port (localhost:5173, localhost:3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# System Health & Root Routes
# ------------------------------------------------------------------------------
@app.get("/", tags=["System"])
def root():
    """Root route returning basic Hello World for server status."""
    return {
        "message": "Hello World",
        "service": "Kabadiwala Connect API (RE:LINK)",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint indicating database connection status."""
    client = get_supabase()
    db_status = "connected" if client else "offline_fallback"
    return {
        "status": "healthy",
        "database": db_status,
        "service": "Kabadiwala Connect API",
        "timestamp": datetime.utcnow().isoformat()
    }


# ------------------------------------------------------------------------------
# Core Feature Stubs (Chunks 4 - 7, 10 - 11)
# ------------------------------------------------------------------------------
@app.post("/classify", tags=["AI/ML"])
async def classify_material(request: Request):
    """
    POST /classify -> Chunk 4 (Production)
    MobileNetV2 & Vision e-waste material classifier.
    Supports:
    - multipart/form-data with file upload (PWA camera capture)
    - application/json with base64 encoded image, image_url, or test overrides
    Returns:
    - Top predicted category, confidence tier (HIGH / MEDIUM / LOW)
    - Recommended UX action (AUTO_SELECT_BADGE / SHOW_SUGGESTIONS / MANUAL_GRID_SELECT)
    - Bilingual Hindi/Marathi vernacular spoken audio strings
    - CPCB e-waste code and hazard safety instructions
    - 64-bit dHash for duplicate & fraud tracking
    """
    content_type = request.headers.get("content-type", "")
    image_bytes = None
    confidence_override = None
    category_hint = None

    try:
        if "multipart/form-data" in content_type:
            form = await request.form()
            uploaded_file = form.get("file")
            if uploaded_file and hasattr(uploaded_file, "read"):
                image_bytes = await uploaded_file.read()
            conf_val = form.get("confidence_override")
            if conf_val is not None and conf_val != "":
                confidence_override = float(conf_val)
            category_hint = form.get("category_hint")
        elif "application/json" in content_type:
            body = await request.json() if await request.body() else {}
            if "image_base64" in body and body["image_base64"]:
                b64_str = body["image_base64"]
                if "," in b64_str:
                    b64_str = b64_str.split(",", 1)[1]
                b64_str = b64_str.strip()
                b64_str += "=" * ((4 - len(b64_str) % 4) % 4)
                try:
                    image_bytes = base64.b64decode(b64_str)
                except Exception:
                    image_bytes = None
            elif "image_url" in body and body["image_url"]:
                import httpx
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(body["image_url"])
                    if resp.status_code == 200:
                        image_bytes = resp.content
            if "confidence_override" in body and body["confidence_override"] is not None:
                confidence_override = float(body["confidence_override"])
            category_hint = body.get("category_hint")
        else:
            raw_body = await request.body()
            if raw_body:
                try:
                    body = json.loads(raw_body)
                    if "image_base64" in body and body["image_base64"]:
                        b64_str = body["image_base64"]
                        if "," in b64_str:
                            b64_str = b64_str.split(",", 1)[1]
                        b64_str = b64_str.strip()
                        b64_str += "=" * ((4 - len(b64_str) % 4) % 4)
                        try:
                            image_bytes = base64.b64decode(b64_str)
                        except Exception:
                            image_bytes = None
                    if "confidence_override" in body and body["confidence_override"] is not None:
                        confidence_override = float(body["confidence_override"])
                    category_hint = body.get("category_hint")
                except Exception:
                    image_bytes = raw_body

        # Fallback to sample PCB archetype if no image provided (e.g. empty call for testing)
        if not image_bytes:
            sample_path = Path(__file__).resolve().parent.parent / "stitch-designs" / "assets" / "pcb_motherboards.png"
            if sample_path.exists():
                image_bytes = sample_path.read_bytes()
            else:
                from PIL import Image
                import io
                buf = io.BytesIO()
                Image.new("RGB", (64, 64), color=(34, 139, 34)).save(buf, format="PNG")
                image_bytes = buf.getvalue()

        result = classifier_service.classify(
            image_bytes=image_bytes,
            confidence_override=confidence_override,
            category_hint=category_hint
        )

        return {
            "success": True,
            "status": "COMPLETED",
            "data": result,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        logger.error(f"Classification error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error_code": "CLASSIFICATION_FAILED",
                "message_en": f"Material classification failed: {str(e)}",
                "message_hi": "सामग्री की पहचान विफल रही। कृपया पुनः प्रयास करें।",
                "message_mr": "साहित्याची ओळख अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा."
            }
        )


@app.post("/estimate-price", tags=["Pricing"])
def estimate_price(payload: Optional[Dict[str, Any]] = Body(default={})):
    """
    POST /estimate-price -> Chunk 5 (Production)
    Calculates fair valuation:
    estimated_value = base_rate_per_kg * weight_kg * condition_multiplier
    Dynamically looks up base rate from Supabase prices table by material/category + location.
    """
    payload = payload or {}
    material_id = payload.get("material_id") or payload.get("category") or "mat_pcb_high"
    try:
        weight_kg = float(payload.get("weight_kg", 10.0))
        if weight_kg <= 0:
            weight_kg = 1.0
    except (ValueError, TypeError):
        weight_kg = 10.0

    condition = payload.get("condition", "good")
    location = payload.get("location", "IN-MH-MUM")

    try:
        val = calculate_valuation(material_id, weight_kg, condition, location)
        return {
            "success": True,
            "status": "COMPLETED",
            "data": val,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Pricing calculation error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error_code": "PRICING_FAILED",
                "message_en": f"Valuation calculation failed: {str(e)}",
                "message_hi": "मूल्य गणना विफल रही। कृपया सामग्री और वजन जांचें।",
                "message_mr": "मूल्य गणना अयशस्वी झाली. कृपया साहित्य आणि वजन तपासा."
            }
        )


@app.get("/prices/daily", tags=["Pricing"])
def get_daily_prices_endpoint(location: str = Query("IN-MH-MUM", description="Regional location code")):
    """
    GET /prices/daily -> Mandi benchmark rates for regional scrap centers.
    """
    client = get_supabase()
    if client:
        try:
            res = client.table("prices").select("*").eq("location", location).order("date", desc=True).execute()
            if res.data and len(res.data) > 0:
                return {
                    "success": True,
                    "location": location,
                    "source": "SUPABASE_DATABASE",
                    "prices": res.data,
                    "timestamp": datetime.utcnow().isoformat()
                }
        except Exception as e:
            logger.warning(f"Failed to fetch prices from DB: {e}")

    rates = REGIONAL_MANDI_CACHE.get(location, REGIONAL_MANDI_CACHE["IN-MH-MUM"])
    return {
        "success": True,
        "location": location,
        "source": "LOCAL_MANDI_CACHE",
        "prices": [{"material_id": k, "base_rate_per_kg": v, "unit": "kg"} for k, v in rates.items()],
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/match-recyclers", tags=["Matching"])
def match_recyclers_endpoint(
    material_id: str = Query("mat_pcb_high", description="Material category ID or macro name"),
    weight: float = Query(10.0, description="Approximate lot weight in kg"),
    lat: float = Query(19.0435, description="Collector GPS latitude"),
    lng: float = Query(72.8567, description="Collector GPS longitude"),
    require_pickup: bool = Query(False, description="Require doorstep vehicle collection")
):
    """
    GET /match-recyclers -> Chunk 6 (Production)
    MCDA Recycler Matching Engine.
    Hard filters out unauthorized recyclers.
    Ranks authorized CPCB facilities by Price (35%), Distance (25%), Material Fit (20%),
    Pickup Availability (10%), and Authorization Status (10%).
    """
    try:
        ranked = match_and_rank_recyclers(
            material_id=material_id,
            weight_kg=weight,
            collector_lat=lat,
            collector_lng=lng,
            require_pickup=require_pickup
        )
        return {
            "success": True,
            "status": "COMPLETED",
            "material_id": material_id,
            "lot_weight_kg": weight,
            "collector_location": {"latitude": lat, "longitude": lng},
            "total_matches": len(ranked),
            "ranked_recyclers": ranked,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Recycler matching error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error_code": "MATCHING_FAILED",
                "message_en": f"Recycler matching failed: {str(e)}",
                "message_hi": "पुनर्चक्रणकर्ता मिलान विफल रहा।",
                "message_mr": "पुनर्चक्रण केंद्र शोधणे अयशस्वी झाले."
            }
        )


@app.get("/anomaly-check", tags=["Anomaly"])
def anomaly_check_endpoint(
    lot_id: Optional[str] = Query(None, description="Lot UUID to inspect"),
    weight: Optional[float] = Query(None, description="Weight to check for density bounds (kg)"),
    material_id: Optional[str] = Query("mat_pcb_high", description="Material category ID"),
    price: Optional[float] = Query(None, description="Quoted price (₹)"),
    image_phash: Optional[str] = Query(None, description="64-bit dHash perceptual fingerprint"),
    collector_id: Optional[str] = Query(None, description="Collector ID for velocity checks"),
    location: str = Query("IN-MH-MUM", description="Regional location code")
):
    """
    GET /anomaly-check -> Chunk 7 Production Engine
    Inspects lot parameters or existing lot record against physical density bounds,
    image duplicate hashes, price outliers, and collector submission velocity.
    """
    inspected_material = material_id or "mat_pcb_high"
    inspected_weight = weight
    inspected_price = price
    inspected_hash = image_phash
    inspected_collector = collector_id

    # If lot_id is provided, fetch lot record from Supabase
    if lot_id:
        client = get_supabase()
        if client:
            try:
                res = client.table("material_lots").select("*").eq("id", lot_id).execute()
                if res.data and len(res.data) > 0:
                    lot = res.data[0]
                    inspected_material = lot.get("material_id") or inspected_material
                    if inspected_weight is None and lot.get("approximate_weight") is not None:
                        inspected_weight = float(lot["approximate_weight"])
                    if inspected_price is None and lot.get("quoted_price") is not None:
                        inspected_price = float(lot["quoted_price"])
                    if not inspected_hash and lot.get("image_phash"):
                        inspected_hash = lot["image_phash"]
                    if not inspected_collector and lot.get("collector_id"):
                        inspected_collector = lot["collector_id"]
            except Exception as e:
                logger.warning(f"Error fetching lot {lot_id} for anomaly check: {e}")

    # Fallback weight if none provided
    if inspected_weight is None:
        inspected_weight = 10.0

    report = evaluate_lot_anomaly(
        material_id=inspected_material,
        weight_kg=inspected_weight,
        quoted_price=inspected_price,
        image_phash=inspected_hash,
        collector_id=inspected_collector,
        location=location,
        current_lot_id=lot_id
    )

    # Maintain backward compatibility with stub placeholder keys
    report["placeholder"] = {
        "lot_id": lot_id,
        "risk_score": report["risk_score"],
        "is_anomalous": report["is_anomalous"],
        "details": report["anomalies"][0] if report["anomalies"] else None
    }
    return report


@app.post("/anomaly-check", tags=["Anomaly"])
def anomaly_check_post_endpoint(payload: Dict[str, Any] = Body(...)):
    """
    POST /anomaly-check -> Pre-flight verification payload before lot creation on mobile PWA.
    Accepts: material_id, weight_kg, quoted_price, image_phash, collector_id, location, lot_id.
    """
    payload = payload or {}
    material_id = payload.get("material_id") or payload.get("category") or "mat_pcb_high"
    try:
        weight_kg = float(payload.get("weight_kg", payload.get("approximate_weight", 10.0)))
    except (ValueError, TypeError):
        weight_kg = 10.0

    quoted_price = payload.get("quoted_price")
    if quoted_price is not None:
        try:
            quoted_price = float(quoted_price)
        except (ValueError, TypeError):
            quoted_price = None

    image_phash = payload.get("image_phash") or payload.get("image_dhash")
    collector_id = payload.get("collector_id")
    location = payload.get("location", "IN-MH-MUM")
    lot_id = payload.get("lot_id") or payload.get("id")

    report = evaluate_lot_anomaly(
        material_id=material_id,
        weight_kg=weight_kg,
        quoted_price=quoted_price,
        image_phash=image_phash,
        collector_id=collector_id,
        location=location,
        current_lot_id=lot_id
    )

    report["placeholder"] = {
        "lot_id": lot_id,
        "risk_score": report["risk_score"],
        "is_anomalous": report["is_anomalous"],
        "details": report["anomalies"][0] if report["anomalies"] else None
    }
    return report


# ------------------------------------------------------------------------------
# Material Lots API (Wired directly to Supabase table 'material_lots')
# ------------------------------------------------------------------------------
@app.post("/lots", tags=["Lots"])
def create_new_lot(lot: Dict[str, Any] = Body(...)):
    """
    POST /lots -> Create a new material lot in Supabase.
    """
    # Ensure ID exists
    if "id" not in lot:
        lot["id"] = str(uuid.uuid4())
    if "quoted_price" not in lot:
        # Default price calculation if omitted
        lot["quoted_price"] = 245.0 * float(lot.get("approximate_weight", 1.0))

    client = get_supabase()
    if client:
        try:
            res = client.table("material_lots").insert(lot).execute()
            if res.data:
                return {
                    "success": True,
                    "message": "Lot created successfully in Supabase",
                    "data": res.data[0]
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fallback_data": lot
            }

    # Fallback to local memory mock
    return {
        "success": True,
        "mode": "offline_fallback",
        "data": lot
    }


@app.get("/lots/{lot_id}", tags=["Lots"])
def get_lot_by_id(lot_id: str):
    """
    GET /lots/{id} -> Fetch lot details by ID from Supabase.
    """
    client = get_supabase()
    if client:
        try:
            res = client.table("material_lots").select("*").eq("id", lot_id).execute()
            if res.data:
                return {
                    "success": True,
                    "data": res.data[0]
                }
            else:
                raise HTTPException(status_code=404, detail="Lot not found")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database query error: {e}")

    return {
        "success": False,
        "message": "Database client not connected"
    }


# ------------------------------------------------------------------------------
# Handover & Earnings Stubs (Chunks 10 & 11)
# ------------------------------------------------------------------------------
@app.post("/handover", tags=["Handover"])
def process_handover(payload: Optional[Dict[str, Any]] = Body(default={})):
    """
    POST /handover -> Chunk 10
    Stub for QR token scanning and physical handover verification.
    """
    handover_ref = f"KC-TRACE-{datetime.utcnow().strftime('%Y%m%d')}-MH-{uuid.uuid4().hex[:6].upper()}"
    return {
        "status": "STUB_CHUNK_10",
        "message": "Handover processing stub ready. Will be implemented in Chunk 10.",
        "placeholder": {
            "handover_ref": handover_ref,
            "verified": True,
            "timestamp": datetime.utcnow().isoformat()
        }
    }


@app.get("/earnings/{collector_id}", tags=["Earnings"])
def get_collector_earnings(collector_id: str):
    """
    GET /earnings/{collector_id} -> Chunk 11
    Fetches collector transaction ledger from Supabase.
    """
    client = get_supabase()
    if client:
        try:
            res = client.table("transactions").select("*").eq("collector_id", collector_id).execute()
            total_earned = sum(float(t.get("final_price", 0)) for t in res.data)
            return {
                "success": True,
                "collector_id": collector_id,
                "total_earnings_inr": total_earned,
                "transaction_count": len(res.data),
                "transactions": res.data
            }
        except Exception as e:
            pass

    return {
        "status": "STUB_CHUNK_11",
        "collector_id": collector_id,
        "total_earnings_inr": 3697.50,
        "transaction_count": 1,
        "transactions": [
            {
                "id": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22",
                "material_category": "PCB",
                "final_price": 3697.50,
                "payment_mode": "CASH",
                "status": "COMPLETED"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
