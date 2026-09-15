"""
Kabadiwala Connect (RE:LINK) - Handover, Traceability & QR Confirmation Test Suite.
Chunk 10 Validation:
1. Every completed lot has a full traceability record with all required fields populated.
2. The QR code actually encodes a working, unique reference.
3. The status genuinely changes from pending to confirmed.
4. Official CPCB EPR audit certificate generated upon confirmation.
5. All REST endpoints work seamlessly via FastAPI TestClient.
"""

import json
import base64
import pytest
from fastapi.testclient import TestClient

from main import app
from app.services.handover_service import (
    generate_handover_reference,
    generate_cpcb_epr_certificate,
    generate_qr_code,
    build_qr_payload,
    create_handover_record,
    get_handover_details,
    confirm_handover_receipt,
    list_recent_handovers
)

client = TestClient(app)


def test_handover_reference_format():
    """Test unique handover reference generation format and uniqueness."""
    ref1 = generate_handover_reference(state="MH")
    ref2 = generate_handover_reference(state="MH")

    assert ref1.startswith("KC-TRACE-")
    assert "-MH-" in ref1
    assert len(ref1.split("-")) == 5
    assert ref1 != ref2, "Consecutive handover references must be unique"


def test_cpcb_epr_certificate_format():
    """Test CPCB EPR certificate ID generation format and uniqueness."""
    cert1 = generate_cpcb_epr_certificate(state="MH")
    cert2 = generate_cpcb_epr_certificate(state="MH")

    assert cert1.startswith("CPCB-EPR-")
    assert "-MH-" in cert1
    assert cert1 != cert2, "Consecutive CPCB EPR certificates must be unique"


def test_qr_code_generation_valid_png():
    """Test that QR code generates a valid PNG with standard PNG magic header."""
    test_payload = json.dumps({"test_ref": "KC-TRACE-20260905-MH-TEST01"})
    data_uri, raw_bytes = generate_qr_code(test_payload)

    assert data_uri.startswith("data:image/png;base64,")
    # Standard PNG file magic header: \x89PNG\r\n\x1a\n
    assert raw_bytes[:8] == b"\x89PNG\r\n\x1a\n"
    # Verify base64 decodes back to the same raw bytes
    b64_content = data_uri.split(",")[1]
    decoded_bytes = base64.b64decode(b64_content)
    assert decoded_bytes == raw_bytes


def test_create_handover_full_traceability_fields():
    """
    CRITERION 1: Every completed lot has a full traceability record with
    all required fields populated, not just some.
    """
    res = create_handover_record(
        weight=4.5,
        gps_lat=19.0434,
        gps_lng=72.8576,
        photo_url="https://relink-storage.gov.in/lot-photos/test_lot_pcb.jpg",
        collector_id="col_test_001",
        material_id="mat_pcb_high",
        material_category="PCB",
        quoted_price=1080.0
    )

    assert res["success"] is True
    rec = res["traceability"]

    # Verify ALL required fields are populated and non-null
    required_fields = [
        "id", "lot_id", "photo_url", "weight", "timestamp",
        "gps_lat", "gps_lng", "handover_ref", "recycler_confirmation",
        "status", "created_at"
    ]
    for field in required_fields:
        assert field in rec, f"Missing required field: {field}"
        assert rec[field] is not None, f"Field {field} must not be null"

    # Status must be pending confirmation initially
    assert rec["status"] == "PENDING_CONFIRMATION"
    assert rec["recycler_confirmation"] is False
    assert rec["weight"] == 4.5
    assert rec["gps_lat"] == 19.0434
    assert rec["gps_lng"] == 72.8576


def test_qr_code_encodes_working_unique_reference():
    """
    CRITERION 2: The QR code actually encodes a working, unique reference.
    """
    res = create_handover_record(
        weight=3.2,
        collector_id="col_test_001",
        material_id="mat_pcb_high",
        material_category="PCB"
    )

    handover_ref = res["handover_ref"]
    qr_payload = res["qr_payload"]
    qr_data_uri = res["qr_data_uri"]

    # QR payload encodes the working reference and verifiable metadata
    assert qr_payload["handover_ref"] == handover_ref
    assert qr_payload["weight_kg"] == 3.2
    assert "gps" in qr_payload
    assert qr_payload["verify_url"] == f"https://relink.cpcb.gov.in/verify/{handover_ref}"
    assert qr_data_uri.startswith("data:image/png;base64,")

    # Verify that searching by this reference retrieves the exact same handover record
    retrieved = get_handover_details(handover_ref)
    assert retrieved is not None
    assert retrieved["traceability"]["handover_ref"] == handover_ref
    assert retrieved["traceability"]["weight"] == 3.2


def test_recycler_confirmation_genuinely_updates_status():
    """
    CRITERION 3: The status genuinely changes from pending to confirmed,
    issues official CPCB EPR audit certificate, and records transaction.
    """
    # 1. Initiate handover
    init_res = create_handover_record(
        weight=5.0,
        quoted_price=1200.0,
        collector_id="col_test_001",
        material_id="mat_pcb_high",
        material_category="PCB"
    )
    handover_ref = init_res["handover_ref"]
    assert init_res["traceability"]["status"] == "PENDING_CONFIRMATION"
    assert init_res["traceability"]["recycler_confirmation"] is False

    # 2. Recycler confirms receipt at weighbridge with verified weight
    confirm_res = confirm_handover_receipt(
        handover_ref_or_id=handover_ref,
        recycler_id="rec_ecorecycle_01",
        verified_weight=5.2,
        weighbridge_photo_url="https://relink-storage.gov.in/weighbridge/scale_wb_992.jpg",
        payment_mode="CASH"
    )

    assert confirm_res["success"] is True
    assert confirm_res["status"] == "CONFIRMED"
    assert confirm_res["verified_weight"] == 5.2
    assert confirm_res["cpcb_certificate_id"].startswith("CPCB-EPR-")

    # Verify updated traceability record
    updated_rec = confirm_res["traceability"]
    assert updated_rec["status"] == "CONFIRMED"
    assert updated_rec["recycler_confirmation"] is True
    assert updated_rec["weight"] == 5.2
    assert updated_rec["cpcb_certificate_id"] == confirm_res["cpcb_certificate_id"]

    # Verify settled transaction record
    trans = confirm_res["transaction"]
    assert trans["status"] == "COMPLETED"
    assert trans["payment_mode"] == "CASH"
    assert trans["payment_status"] == "PAID_CASH_CONFIRMED"
    assert trans["final_price"] > 0

    # 3. Verify idempotent re-confirmation returns already_confirmed cleanly
    reconfirm_res = confirm_handover_receipt(
        handover_ref_or_id=handover_ref,
        recycler_id="rec_ecorecycle_01"
    )
    assert reconfirm_res["already_confirmed"] is True
    assert reconfirm_res["status"] == "CONFIRMED"


def test_api_handover_endpoints_full_lifecycle():
    """
    Test end-to-end HTTP API lifecycle:
    POST /handover/initiate -> GET /handover/{ref} -> POST /handover/confirm -> GET /handover/qr/{ref}
    """
    # Step 1: POST /handover/initiate
    init_payload = {
        "weight": 6.0,
        "gps_lat": 19.0434,
        "gps_lng": 72.8576,
        "collector_id": "col_test_001",
        "material_id": "mat_pcb_high",
        "material_category": "PCB",
        "quoted_price": 1440.0
    }
    r_init = client.post("/handover/initiate", json=init_payload)
    assert r_init.status_code == 200, r_init.text
    init_data = r_init.json()
    assert init_data["success"] is True
    handover_ref = init_data["handover_ref"]
    assert init_data["traceability"]["status"] == "PENDING_CONFIRMATION"

    # Step 2: GET /handover/{handover_ref}
    r_get = client.get(f"/handover/{handover_ref}")
    assert r_get.status_code == 200, r_get.text
    get_data = r_get.json()
    assert get_data["traceability"]["handover_ref"] == handover_ref
    assert get_data["traceability"]["status"] == "PENDING_CONFIRMATION"

    # Step 3: GET /handover/qr/{handover_ref}
    r_qr = client.get(f"/handover/qr/{handover_ref}")
    assert r_qr.status_code == 200
    assert r_qr.headers["content-type"] == "image/png"
    assert r_qr.content[:8] == b"\x89PNG\r\n\x1a\n"

    # Step 4: POST /handover/confirm
    confirm_payload = {
        "handover_ref": handover_ref,
        "recycler_id": "rec_ecorecycle_01",
        "verified_weight": 6.1,
        "payment_mode": "CASH"
    }
    r_confirm = client.post("/handover/confirm", json=confirm_payload)
    assert r_confirm.status_code == 200, r_confirm.text
    confirm_data = r_confirm.json()
    assert confirm_data["status"] == "CONFIRMED"
    assert confirm_data["cpcb_certificate_id"].startswith("CPCB-EPR-")

    # Step 5: Verify status genuinely flipped when querying GET /handover/{ref} again
    r_get_after = client.get(f"/handover/{handover_ref}")
    assert r_get_after.status_code == 200
    assert r_get_after.json()["traceability"]["status"] == "CONFIRMED"
    assert r_get_after.json()["traceability"]["recycler_confirmation"] is True

    # Step 6: GET /traceability
    r_list = client.get("/traceability")
    assert r_list.status_code == 200
    assert r_list.json()["count"] >= 1


def test_api_handover_backward_compatible_endpoint():
    """Test that POST /handover works with both empty payload or provided payload."""
    r = client.post("/handover", json={"weight": 2.0, "material_category": "CABLES"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert "handover_ref" in data
    assert data["traceability"]["status"] == "PENDING_CONFIRMATION"
