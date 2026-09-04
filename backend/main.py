"""
Kabadiwala Connect (RE:LINK) - Main Backend API Application.
FastAPI app wired to Supabase, with all core feature stubs and CORS enabled.
"""

import json
import os
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, status, Body, Query
from fastapi.middleware.cors import CORSMiddleware

from app.db.supabase_client import get_supabase, get_materials, get_recyclers, get_prices, insert_lot
from app.services.pricing_engine import calculate_valuation, REGIONAL_MANDI_CACHE
from app.services.recycler_matcher import match_and_rank_recyclers
from app.services.anomaly_detector import check_weight_plausibility

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
def classify_material(payload: Optional[Dict[str, Any]] = Body(default={})):
    """
    POST /classify -> Chunk 4
    Stub for MobileNetV2 / TFLite scrap material classification.
    """
    return {
        "status": "STUB_CHUNK_4",
        "message": "Classifier endpoint stub ready. Will be implemented in Chunk 4.",
        "placeholder": {
            "predicted_category": "mat_pcb_high",
            "confidence": 0.89,
            "suggestions": [
                {"id": "mat_pcb_high", "name": "High-Grade PCB", "confidence": 0.89},
                {"id": "mat_pcb_low", "name": "Low-Grade PCB", "confidence": 0.08},
                {"id": "mat_cables_copper", "name": "Copper Cables", "confidence": 0.03}
            ]
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/estimate-price", tags=["Pricing"])
def estimate_price(payload: Optional[Dict[str, Any]] = Body(default={})):
    """
    POST /estimate-price -> Chunk 5
    Stub / entry point for dynamic fair valuation pricing engine.
    """
    material_id = payload.get("material_id", "mat_pcb_high") if payload else "mat_pcb_high"
    weight_kg = float(payload.get("weight_kg", 10.0)) if payload else 10.0
    condition = payload.get("condition", "CLEAN_INTACT") if payload else "CLEAN_INTACT"

    # Use pricing engine calculation
    val = calculate_valuation(material_id, weight_kg, condition)
    return {
        "status": "STUB_CHUNK_5",
        "message": "Pricing estimation stub ready. Will be finalized in Chunk 5.",
        "data": val,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/match-recyclers", tags=["Matching"])
def match_recyclers_endpoint(
    material_id: str = Query("mat_pcb_high", description="Material category ID"),
    weight: float = Query(10.0, description="Approximate weight in kg"),
    lat: float = Query(19.0435, description="Collector latitude"),
    lng: float = Query(72.8567, description="Collector longitude")
):
    """
    GET /match-recyclers -> Chunk 6
    Stub for MCDA recycler matching engine.
    """
    ranked = match_and_rank_recyclers(material_id, weight, lat, lng)
    return {
        "status": "STUB_CHUNK_6",
        "message": "Recycler matching stub ready. Will be finalized in Chunk 6.",
        "ranked_recyclers": ranked,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/anomaly-check", tags=["Anomaly"])
def anomaly_check_endpoint(
    lot_id: Optional[str] = Query(None, description="Lot UUID to inspect"),
    weight: Optional[float] = Query(None, description="Weight to check for density bounds"),
    material_id: Optional[str] = Query("mat_pcb_high", description="Material type")
):
    """
    GET /anomaly-check -> Chunk 7
    Stub for statistical rate/weight anomaly and fraud detection.
    """
    anomaly_flag = None
    if weight is not None and material_id:
        anomaly_flag = check_weight_plausibility(material_id, weight)

    return {
        "status": "STUB_CHUNK_7",
        "message": "Anomaly check stub ready. Will be finalized in Chunk 7.",
        "placeholder": {
            "lot_id": lot_id,
            "risk_score": 75 if anomaly_flag else 12,
            "is_anomalous": anomaly_flag is not None,
            "details": anomaly_flag
        },
        "timestamp": datetime.utcnow().isoformat()
    }


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
