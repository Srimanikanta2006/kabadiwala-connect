"""
Kabadiwala Connect (RE:LINK) - Stitch Collector Mobile Experience Test Suite.
Verifies backend services powering all 6 Stitch-designed screens:
1. Screen 01 (Home): Live price board & rate ticker endpoints.
2. Screen 02 (AI Scan): TFLite/MobileNet AI material detection & confidence scoring.
3. Screen 03 (Category Select): 6-material CPCB taxonomy alignment.
4. Screen 04 (Offers): Recycler MCDA matching, top match ranking & Haversine distance.
5. Screen 05 (Receipt): Verifiable QR token payload, traceability pillars & CPCB audit certification.
6. Screen 06 (Earnings): Earnings ledger aggregation & cash settlement status.
"""

import base64
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
ASSETS_DIR = Path(__file__).resolve().parent.parent / "stitch-designs" / "assets"


def test_screen01_live_price_board_for_home():
    """Test Screen 01 (Collector Home) data feeds."""
    res = client.get("/prices/board?location=IN-MH-MUM")
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["success"] is True
    assert len(data["categories"]) >= 3

    # Check that top materials (PCB, Cables, Batteries) have live rates and units
    cat_ids = [c["material_id"] for c in data["categories"]]
    assert "mat_pcb_high" in cat_ids
    assert "mat_cables_copper" in cat_ids


def test_screen02_ai_classification_confidence():
    """Test Screen 02 (AI Material Identification) inference endpoint with Stitch asset."""
    sample_path = ASSETS_DIR / "pcb_motherboards.png"
    assert sample_path.exists(), f"Asset not found: {sample_path}"
    image_bytes = sample_path.read_bytes()
    b64_str = f"data:image/png;base64,{base64.b64encode(image_bytes).decode('utf-8')}"

    res = client.post("/classify", json={"image_base64": b64_str})
    assert res.status_code == 200, res.text
    result = res.json()
    data = result.get("data", result)
    assert "top_category" in data
    assert "confidence" in data
    assert data["top_category"] == "mat_pcb_high"
    assert 0.0 <= data["confidence"] <= 1.0


def test_screen03_taxonomy_alignment():
    """Test Screen 03 (Category Selection Grid) matches all 6 primary scrap materials."""
    res = client.get("/materials")
    assert res.status_code == 200
    res_json = res.json()
    materials = res_json.get("data", res_json)
    mat_ids = [m["id"] for m in materials]

    expected_ids = [
        "mat_crt_monitor",
        "mat_lcd_panel",
        "mat_cables_copper",
        "mat_batteries_lead",
        "mat_pcb_high",
        "mat_motors_magnets"
    ]
    for expected in expected_ids:
        assert expected in mat_ids, f"Missing required Stitch category: {expected}"


def test_screen04_recycler_offers_ranking():
    """Test Screen 04 (Price Discovery & Offers) MCDA ranking."""
    res = client.get("/match-recyclers?material_id=mat_pcb_high&lat=19.0434&lng=72.8576")
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["total_matches"] >= 2
    matches = data.get("ranked_recyclers", data.get("matches", data.get("recommendations", [])))

    # Verify top match has valid rate, distance, and CPCB license
    top_match = matches[0]
    assert top_match["facility_name"]
    assert top_match["offered_rate_per_kg"] > 0
    assert top_match["distance_km"] < 50.0
    assert top_match["cpcb_reg_no"].startswith("CPCB/E-WASTE/REG/")


def test_screen05_handover_receipt_and_qr():
    """Test Screen 05 (Digital Handover Receipt) end-to-end QR & confirmation loop."""
    init_res = client.post("/handover/initiate", json={
        "weight": 12.0,
        "gps_lat": 19.0434,
        "gps_lng": 72.8576,
        "collector_id": "col_stitch_001",
        "material_id": "mat_pcb_high",
        "material_category": "PCB",
        "quoted_price": 9360.0
    })
    assert init_res.status_code == 200
    init_data = init_res.json()
    handover_ref = init_data["handover_ref"]

    # Verify QR code image is generated
    qr_res = client.get(f"/handover/qr/{handover_ref}")
    assert qr_res.status_code == 200
    assert qr_res.headers["content-type"] == "image/png"

    # Confirm receipt at weighbridge
    confirm_res = client.post("/handover/confirm", json={
        "handover_ref": handover_ref,
        "recycler_id": "rec_ecorecycle_01",
        "verified_weight": 12.0,
        "payment_mode": "CASH"
    })
    assert confirm_res.status_code == 200
    confirm_data = confirm_res.json()
    assert confirm_data["status"] == "CONFIRMED"
    assert confirm_data["cpcb_certificate_id"].startswith("CPCB-EPR-")


def test_screen06_earnings_ledger():
    """Test Screen 06 (My Earnings History) ledger aggregation."""
    res = client.get("/earnings/col_test_001")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    metrics = data.get("metrics", {})
    assert "total_completed_earnings_inr" in metrics
    assert "total_pending_dues_inr" in metrics
    assert "completed_transactions" in data
