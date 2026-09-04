"""
Comprehensive Test Suite for Chunk 5: Pricing Engine.
Validates:
1. Pure rule-based formulation: estimated_value = base_rate * weight * condition_multiplier
2. Hand-calculated unit tests for good (1.0), fair (0.8), poor (0.55).
3. Dynamic database lookup from Supabase `prices` table.
4. Database price update test: changing DB rate changes output (proves not hardcoded).
5. FastAPI POST /estimate-price and GET /prices/daily endpoints.
6. Spoken vernacular audio string generation (Hindi & Marathi).
"""

import sys
from pathlib import Path

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv
load_dotenv()

from fastapi.testclient import TestClient
from main import app
from pricing.engine import (
    calculate_valuation,
    get_base_rate,
    update_base_rate_in_db,
    resolve_material_id
)

client = TestClient(app)


def test_1_hand_calculated_pcb_good():
    print("\n--- Test 1: Hand-Calculated Example: High-Grade PCB (Good) ---")
    # Base rate = 240.0, Weight = 10.0 kg, Condition = 'good' (1.00)
    # Expected: 240 * 10 * 1.0 = 2,400.00 INR
    # Range (0.95 to 1.05): 2,280.00 to 2,520.00 INR
    res = calculate_valuation("mat_pcb_high", weight_kg=10.0, condition="good", location="IN-MH-MUM")
    
    assert res["base_rate_per_kg"] == 240.0
    assert res["weight_kg"] == 10.0
    assert res["condition"] == "good"
    assert res["condition_multiplier"] == 1.0
    assert res["estimated_value_inr"] == 2400.0
    assert res["estimated_range_inr"]["min_inr"] == 2280.0
    assert res["estimated_range_inr"]["max_inr"] == 2520.0
    print("  ✓ PCB (10kg, good): ₹2,400.00 [₹2,280.00 - ₹2,520.00] (Passed exact hand-calculation)")


def test_2_hand_calculated_battery_fair():
    print("\n--- Test 2: Hand-Calculated Example: Lead-Acid Battery (Fair) ---")
    # Base rate = 100.0, Weight = 20.0 kg, Condition = 'fair' (0.80)
    # Expected: 100 * 20 * 0.8 = 1,600.00 INR
    # Range (0.95 to 1.05): 1,520.00 to 1,680.00 INR
    res = calculate_valuation("mat_batteries_lead", weight_kg=20.0, condition="fair", location="IN-MH-MUM")
    
    assert res["base_rate_per_kg"] == 100.0
    assert res["weight_kg"] == 20.0
    assert res["condition"] == "fair"
    assert res["condition_multiplier"] == 0.8
    assert res["estimated_value_inr"] == 1600.0
    assert res["estimated_range_inr"]["min_inr"] == 1520.0
    assert res["estimated_range_inr"]["max_inr"] == 1680.0
    print("  ✓ Battery (20kg, fair): ₹1,600.00 [₹1,520.00 - ₹1,680.00] (Passed exact hand-calculation)")


def test_3_hand_calculated_crt_poor():
    print("\n--- Test 3: Hand-Calculated Example: CRT Monitor (Poor) ---")
    # Base rate = 15.0, Weight = 12.0 kg, Condition = 'poor' (0.55)
    # Expected: 15 * 12 * 0.55 = 99.00 INR
    # Range (0.95 to 1.05): 94.05 to 103.95 INR
    res = calculate_valuation("mat_crt_monitor", weight_kg=12.0, condition="poor", location="IN-MH-MUM")
    
    assert res["base_rate_per_kg"] == 15.0
    assert res["weight_kg"] == 12.0
    assert res["condition"] == "poor"
    assert res["condition_multiplier"] == 0.55
    assert res["estimated_value_inr"] == 99.0
    assert res["estimated_range_inr"]["min_inr"] == 94.05
    assert res["estimated_range_inr"]["max_inr"] == 103.95
    print("  ✓ CRT (12kg, poor): ₹99.00 [₹94.05 - ₹103.95] (Passed exact hand-calculation)")


def test_4_hand_calculated_copper_cable_good():
    print("\n--- Test 4: Hand-Calculated Example: Copper Cable (Good) ---")
    # Base rate = 380.0, Weight = 5.0 kg, Condition = 'good' (1.00)
    # Expected: 380 * 5 * 1.0 = 1,900.00 INR
    # Range: 1,805.00 to 1,995.00 INR
    res = calculate_valuation("mat_cables_copper", weight_kg=5.0, condition="good", location="IN-MH-MUM")
    
    assert res["base_rate_per_kg"] == 380.0
    assert res["weight_kg"] == 5.0
    assert res["estimated_value_inr"] == 1900.0
    assert res["estimated_range_inr"]["min_inr"] == 1805.0
    assert res["estimated_range_inr"]["max_inr"] == 1995.0
    print("  ✓ Copper Cable (5kg, good): ₹1,900.00 [₹1,805.00 - ₹1,995.00] (Passed exact hand-calculation)")


def test_5_dynamic_database_lookup_and_price_change():
    print("\n--- Test 5: Dynamic Database Lookup & Live Price Change Test ---")
    # Initial rate for CRT in Mumbai is 15.0
    res_before = calculate_valuation("mat_crt_monitor", weight_kg=10.0, condition="good", location="IN-MH-MUM")
    assert res_before["base_rate_per_kg"] == 15.0
    assert res_before["estimated_value_inr"] == 150.0
    assert res_before["price_source"] == "SUPABASE_DATABASE"
    print("  ✓ Initial DB Price: ₹15.0/kg -> 10kg Valuation = ₹150.00 (Source:", res_before["price_source"], ")")

    # Update CRT price in Supabase to 25.0
    print("  ... Updating base rate in Supabase prices table to ₹25.0/kg ...")
    success = update_base_rate_in_db("mat_crt_monitor", new_rate=25.0, location="IN-MH-MUM")
    assert success is True, "Failed to update price in Supabase"

    # Query valuation again
    res_after = calculate_valuation("mat_crt_monitor", weight_kg=10.0, condition="good", location="IN-MH-MUM")
    assert res_after["base_rate_per_kg"] == 25.0
    assert res_after["estimated_value_inr"] == 250.0
    print("  ✓ Updated DB Price: ₹25.0/kg -> 10kg Valuation = ₹250.00 (PROVES DYNAMIC LOOKUP!)")

    # Revert price back to 15.0
    update_base_rate_in_db("mat_crt_monitor", new_rate=15.0, location="IN-MH-MUM")
    res_reverted = calculate_valuation("mat_crt_monitor", weight_kg=10.0, condition="good", location="IN-MH-MUM")
    assert res_reverted["base_rate_per_kg"] == 15.0
    print("  ✓ Reverted DB Price cleanly back to ₹15.0/kg")


def test_6_fastapi_estimate_price_endpoint():
    print("\n--- Test 6: FastAPI POST /estimate-price Endpoint Integration ---")
    # 1. By canonical ID
    payload = {
        "material_id": "mat_pcb_high",
        "weight_kg": 10.0,
        "condition": "good",
        "location": "IN-MH-MUM"
    }
    response = client.post("/estimate-price", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["status"] == "COMPLETED"
    assert body["data"]["estimated_value_inr"] == 2400.0
    print("  ✓ POST /estimate-price (mat_pcb_high) -> HTTP 200, Val: ₹2,400.00")

    # 2. By macro category name ('Cable', 'fair')
    payload_macro = {
        "category": "Cable",
        "weight_kg": 10.0,
        "condition": "fair",
        "location": "IN-MH-MUM"
    }
    response_macro = client.post("/estimate-price", json=payload_macro)
    assert response_macro.status_code == 200
    body_macro = response_macro.json()
    # Base rate 380 * 10 * 0.8 = 3040.0
    assert body_macro["data"]["estimated_value_inr"] == 3040.0
    print("  ✓ POST /estimate-price (category='Cable', fair) -> HTTP 200, Val: ₹3,040.00")


def test_7_fastapi_daily_prices_endpoint():
    print("\n--- Test 7: FastAPI GET /prices/daily Endpoint ---")
    response = client.get("/prices/daily?location=IN-MH-MUM")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["prices"]) >= 7
    print("  ✓ GET /prices/daily -> HTTP 200, Returned", len(data["prices"]), "benchmark rates (Source:", data["source"], ")")


def test_8_vernacular_spoken_summaries():
    print("\n--- Test 8: Vernacular Spoken Summaries (Hindi & Marathi) ---")
    res = calculate_valuation("mat_pcb_high", weight_kg=10.0, condition="good")
    hi = res["spoken_summary_hi"]
    mr = res["spoken_summary_mr"]
    
    assert "2280" in hi or "२२८०" in hi or "2520" in hi
    assert "2280" in mr or "२२८०" in mr or "2520" in mr
    print("  ✓ Hindi Spoken Readout generated:", hi)
    print("  ✓ Marathi Spoken Readout generated:", mr)


if __name__ == "__main__":
    print("=================================================================")
    print("Running Kabadiwala Connect Chunk 5 (Pricing Engine) Test Suite")
    print("=================================================================")
    test_1_hand_calculated_pcb_good()
    test_2_hand_calculated_battery_fair()
    test_3_hand_calculated_crt_poor()
    test_4_hand_calculated_copper_cable_good()
    test_5_dynamic_database_lookup_and_price_change()
    test_6_fastapi_estimate_price_endpoint()
    test_7_fastapi_daily_prices_endpoint()
    test_8_vernacular_spoken_summaries()
    print("\n=================================================================")
    print("🎉 ALL 8 TESTS PASSED! Chunk 5 Pricing Engine Fully Verified!")
    print("=================================================================\n")
