"""
Kabadiwala Connect (RE:LINK) - Recycler Portal & Verification Test Suite.
Chunk 14 Validation:
1. Recycler listing and profile discovery with active CPCB registration.
2. Facility-specific material taxonomy matching and scrap queue isolation.
3. Recycler KPIs and metrics aggregation (tonnage, dues, EPR certs).
4. Recycler weighbridge confirmation updating traceability and issuing CPCB EPR certificate.
5. Bidirectional status synchronization between Recycler Dashboard and Collector App.
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_list_authorized_recyclers():
    """
    Test GET /recyclers returns all active authorized recyclers
    with valid CPCB registration numbers and accepted materials.
    """
    response = client.get("/recyclers")
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["success"] is True
    assert data["count"] >= 5
    assert len(data["data"]) >= 5

    for rec in data["data"]:
        assert rec["authorization_status"] == "ACTIVE"
        assert rec["cpcb_registration_no"].startswith("CPCB/E-WASTE/REG/")
        assert isinstance(rec["materials_accepted"], list)
        assert len(rec["materials_accepted"]) > 0
        assert "offered_rates" in rec
        assert isinstance(rec["offered_rates"], dict)


def test_get_recycler_profile():
    """
    Test GET /recyclers/{recycler_id} returns facility details or 404 for invalid ID.
    """
    # 1. Valid recycler facility
    res_valid = client.get("/recyclers/rec_ecorecycle_01")
    assert res_valid.status_code == 200
    rec = res_valid.json()["data"]
    assert rec["id"] == "rec_ecorecycle_01"
    assert "EcoRecycle" in rec["name"]
    assert "cpcb_registration_no" in rec
    assert "location_lat" in rec
    assert "location_lng" in rec

    # 2. Invalid facility ID -> 404
    res_invalid = client.get("/recyclers/invalid_facility_xyz")
    assert res_invalid.status_code == 404
    assert "not found" in res_invalid.json()["detail"].lower()


def test_facility_material_acceptance_filtering():
    """
    CRITERION 1: Recycler account can log in and see ONLY lots matched to them.
    A recycler with limited licenses must never see scrap they are unauthorized to accept.
    """
    # Enviro-Care only accepts batteries and cables, NEVER PCBs
    res_enviro = client.get("/recyclers/rec_envirocare_05/lots")
    assert res_enviro.status_code == 200
    enviro_lots = res_enviro.json()["lots"]

    # Verify no PCB lots are delivered to Enviro-Care
    for lot in enviro_lots:
        assert lot["material_category"] != "PCB", f"Unauthorized PCB delivered to Enviro-Care: {lot}"
        assert lot["material_id"] not in ["mat_pcb_high", "mat_pcb_low"]

    # Cerebra Integrated does NOT accept lead acid batteries (mat_batteries_lead)
    res_cerebra = client.get("/recyclers/rec_cerebra_03/lots")
    assert res_cerebra.status_code == 200
    cerebra_lots = res_cerebra.json()["lots"]

    for lot in cerebra_lots:
        assert lot["material_id"] != "mat_batteries_lead", f"Unauthorized lead battery delivered to Cerebra: {lot}"


def test_recycler_lots_status_filtering():
    """
    Test status filtering (PENDING vs CONFIRMED) on incoming lots queue.
    """
    # 1. Status = PENDING
    res_pending = client.get("/recyclers/rec_ecorecycle_01/lots?status_filter=PENDING")
    assert res_pending.status_code == 200
    for lot in res_pending.json()["lots"]:
        assert lot["recycler_confirmation"] is False

    # 2. Status = CONFIRMED
    res_confirmed = client.get("/recyclers/rec_ecorecycle_01/lots?status_filter=CONFIRMED")
    assert res_confirmed.status_code == 200
    for lot in res_confirmed.json()["lots"]:
        assert lot["recycler_confirmation"] is True


def test_recycler_metrics_computation():
    """
    Test GET /recyclers/{recycler_id}/metrics aggregates correct KPIs.
    """
    response = client.get("/recyclers/rec_ecorecycle_01/metrics")
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["success"] is True
    assert data["recycler_id"] == "rec_ecorecycle_01"
    metrics = data["metrics"]

    assert "total_incoming_lots" in metrics
    assert "pending_verification_count" in metrics
    assert "confirmed_count" in metrics
    assert "total_verified_weight_kg" in metrics
    assert "total_verified_tonnage_mt" in metrics
    assert "total_payout_settled_inr" in metrics
    assert "cpcb_certificates_issued" in metrics

    # Arithmetic consistency
    assert metrics["total_incoming_lots"] == metrics["pending_verification_count"] + metrics["confirmed_count"]
    assert metrics["total_verified_tonnage_mt"] == round(metrics["total_verified_weight_kg"] / 1000.0, 3)


def test_end_to_end_handover_confirmation_and_collector_sync():
    """
    CRITERION 2: Confirming a handover on the recycler screen updates the status
    the collector sees on their side too, and issues official CPCB EPR audit certificate.
    """
    # Step 1: Collector initiates a new high-grade PCB handover
    init_res = client.post("/handover/initiate", json={
        "weight": 7.5,
        "gps_lat": 19.0434,
        "gps_lng": 72.8576,
        "collector_id": "col_ramesh_dharavi",
        "material_id": "mat_pcb_high",
        "material_category": "PCB",
        "quoted_price": 1912.50
    })
    assert init_res.status_code == 200, init_res.text
    init_data = init_res.json()
    handover_ref = init_data["handover_ref"]
    assert init_data["traceability"]["status"] == "PENDING_CONFIRMATION"

    # Step 2: Recycler inspects incoming queue - lot appears as PENDING
    queue_res = client.get("/recyclers/rec_ecorecycle_01/lots?status_filter=PENDING")
    assert queue_res.status_code == 200
    pending_refs = [l["handover_ref"] for l in queue_res.json()["lots"]]
    assert handover_ref in pending_refs

    # Step 3: Recycler confirms receipt at weighbridge with calibrated scale weight
    confirm_res = client.post("/handover/confirm", json={
        "handover_ref": handover_ref,
        "recycler_id": "rec_ecorecycle_01",
        "verified_weight": 7.8,  # Calibrated weighbridge weight
        "weighbridge_photo_url": "https://relink-storage.gov.in/weighbridge/scale_wb_771.jpg",
        "payment_mode": "CASH"
    })
    assert confirm_res.status_code == 200, confirm_res.text
    confirm_data = confirm_res.json()

    assert confirm_data["status"] == "CONFIRMED"
    assert confirm_data["verified_weight"] == 7.8
    assert confirm_data["cpcb_certificate_id"].startswith("CPCB-EPR-")

    # Step 4: Verify status is genuinely updated on Collector side (GET /handover/{ref})
    collector_view = client.get(f"/handover/{handover_ref}")
    assert collector_view.status_code == 200
    collector_data = collector_view.json()
    assert collector_data["traceability"]["status"] == "CONFIRMED"
    assert collector_data["traceability"]["recycler_confirmation"] is True
    assert collector_data["traceability"]["weight"] == 7.8
    assert collector_data["traceability"]["cpcb_certificate_id"] == confirm_data["cpcb_certificate_id"]

    # Step 5: Verify Recycler Metrics reflects the verified tonnage and settlement
    metrics_res = client.get("/recyclers/rec_ecorecycle_01/metrics")
    assert metrics_res.status_code == 200
    updated_metrics = metrics_res.json()["metrics"]
    assert updated_metrics["confirmed_count"] >= 1
    assert updated_metrics["cpcb_certificates_issued"] >= 1
    assert updated_metrics["total_verified_weight_kg"] >= 7.8
