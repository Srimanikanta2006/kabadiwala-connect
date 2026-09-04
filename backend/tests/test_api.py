"""
Unit & Integration Tests for Kabadiwala Connect API.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from app.services.pricing_engine import calculate_valuation
from app.services.recycler_matcher import match_and_rank_recyclers
from app.services.anomaly_detector import check_weight_plausibility

client = TestClient(app)


def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_list_materials():
    res = client.get("/api/v1/materials")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) >= 6
    # Check that high-grade PCB exists
    pcb = next((m for m in data if m["id"] == "mat_pcb_high"), None)
    assert pcb is not None
    assert pcb["parent_category"] == "PCB"
    assert "हाई-ग्रेड" in pcb["name_hi"]


def test_pricing_calculation():
    val = calculate_valuation("mat_pcb_high", 10.0, "CLEAN_INTACT", "IN-MH-MUM")
    assert val["material_id"] == "mat_pcb_high"
    assert val["calculated_rate_per_kg"] == 245.0
    assert val["estimated_total_range_inr"]["min_inr"] > 2000.0
    assert "10.0 किलो" in val["spoken_summary_hi"]


def test_recycler_matching():
    ranked = match_and_rank_recyclers("mat_pcb_high", 15.0, 19.0435, 72.8567)
    assert len(ranked) >= 2
    assert ranked[0]["rank"] == 1
    assert ranked[0]["cpcb_status"] == "ACTIVE"
    assert ranked[0]["distance_km"] > 0


def test_weight_anomaly_filter():
    # 600 kg for high-grade PCB exceeds plausible single-lot bound (250 kg)
    anomaly = check_weight_plausibility("mat_pcb_high", 600.0)
    assert anomaly is not None
    assert anomaly["error_code"] == "WEIGHT_OUT_OF_BOUNDS"

    # 15 kg is valid
    valid = check_weight_plausibility("mat_pcb_high", 15.0)
    assert valid is None
