"""
Automated Verification Suite for Chunk 3: Backend API Foundation.
Tests all stub routes, Supabase integration, and CORS headers.
"""

import uuid
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("=== Testing Chunk 3: Backend API Foundation ===")

    # 1. Root & Health
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.status_code}"
    print("1. [PASS] GET / ->", res.json()["message"])

    # 2. POST /classify (Chunk 4 stub)
    res = client.post("/classify", json={"image": "dummy_base64"})
    assert res.status_code == 200
    assert res.json()["status"] == "STUB_CHUNK_4"
    print("2. [PASS] POST /classify ->", res.json()["status"])

    # 3. POST /estimate-price (Chunk 5 stub)
    res = client.post("/estimate-price", json={"material_id": "mat_pcb_high", "weight_kg": 15.0})
    assert res.status_code == 200
    assert res.json()["status"] == "STUB_CHUNK_5"
    print("3. [PASS] POST /estimate-price ->", res.json()["status"], f"(Calc: INR {res.json()['data']['calculated_rate_per_kg']}/kg)")

    # 4. GET /match-recyclers (Chunk 6 stub)
    res = client.get("/match-recyclers?material_id=mat_pcb_high&weight=12.0")
    assert res.status_code == 200
    assert res.json()["status"] == "STUB_CHUNK_6"
    assert len(res.json()["ranked_recyclers"]) >= 1
    print("4. [PASS] GET /match-recyclers ->", res.json()["status"], f"({len(res.json()['ranked_recyclers'])} recyclers matched)")

    # 5. GET /anomaly-check (Chunk 7 stub)
    res = client.get("/anomaly-check?weight=10.0&material_id=mat_pcb_high")
    assert res.status_code == 200
    assert res.json()["status"] == "STUB_CHUNK_7"
    print("5. [PASS] GET /anomaly-check ->", res.json()["status"], f"(Risk: {res.json()['placeholder']['risk_score']})")

    # 6. POST /lots (Wired to Supabase)
    test_lot_id = str(uuid.uuid4())
    lot_payload = {
        "id": test_lot_id,
        "collector_id": "col_test_001",
        "material_id": "mat_pcb_high",
        "material_category": "PCB",
        "approximate_weight": 8.5,
        "quoted_price": 2082.50,
        "condition": "CLEAN_INTACT"
    }
    res = client.post("/lots", json=lot_payload)
    assert res.status_code == 200
    assert res.json()["success"] is True
    print("6. [PASS] POST /lots -> Supabase Insert Success (ID:", test_lot_id, ")")

    # 7. GET /lots/{id} (Fetch from Supabase)
    res = client.get(f"/lots/{test_lot_id}")
    assert res.status_code == 200
    assert res.json()["data"]["id"] == test_lot_id
    print("7. [PASS] GET /lots/{id} -> Supabase Read Success (Weight:", res.json()["data"]["approximate_weight"], "kg)")

    # 8. POST /handover (Chunk 10 stub)
    res = client.post("/handover", json={"lot_id": test_lot_id})
    assert res.status_code == 200
    assert res.json()["status"] == "STUB_CHUNK_10"
    print("8. [PASS] POST /handover ->", res.json()["status"], f"(Ref: {res.json()['placeholder']['handover_ref']})")

    # 9. GET /earnings/{collector_id} (Chunk 11 stub)
    res = client.get("/earnings/col_test_001")
    assert res.status_code == 200
    print("9. [PASS] GET /earnings/{id} -> Success (Total INR:", res.json()["total_earnings_inr"], ")")

    # 10. CORS Verification
    res = client.options("/lots", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    })
    allow_origin = res.headers.get("access-control-allow-origin")
    assert allow_origin == "*" or allow_origin == "http://localhost:5173", f"CORS failed: {res.headers}"
    print("10. [PASS] CORS Header Check -> 'access-control-allow-origin':", allow_origin)

    print("\nALL 10 VERIFICATION TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
