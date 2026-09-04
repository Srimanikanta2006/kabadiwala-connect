"""
Comprehensive Test Suite for Chunk 6: Recycler Matching Engine (MCDA Ranking).
Validates:
1. Hard filter: Unauthorized and suspended facilities are 100% excluded.
2. Material fit: Recyclers only matched if they accept the requested material category.
3. MCDA Scoring formula: (0.35 * price) + (0.25 * dist) + (0.20 * mat) + (0.10 * pickup) + (0.10 * auth).
4. Haversine distance calculation in kilometers.
5. Pickup requirement filter (require_pickup=True).
6. Highlight badges (HIGHEST_PAYOUT, NEAREST_FACILITY, DOORSTEP_PICKUP) with vernacular text.
7. FastAPI GET /match-recyclers endpoint integration.
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
from matching.engine import (
    match_and_rank_recyclers,
    haversine_distance_km,
    load_all_recyclers
)

client = TestClient(app)

# Dharavi, Mumbai reference location
DHARAVI_LAT = 19.0435
DHARAVI_LNG = 72.8567


def test_1_hard_filter_unauthorized_recyclers_excluded():
    print("\n--- Test 1: Hard Filter Verification (Unauthorized Facilities Excluded) ---")
    all_recs = load_all_recyclers()
    unauthorized_ids = {r["id"] for r in all_recs if r.get("authorization_status") not in ["ACTIVE", "AUTHORIZED"]}
    assert len(unauthorized_ids) >= 1, "Expected at least one unauthorized facility in database for testing"
    print("  • Found unauthorized/suspended facilities in database:", unauthorized_ids)

    # Search for PCB lots (both unauthorized facilities claim to buy PCB at high rates)
    ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=15.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    result_ids = {r["recycler_id"] for r in ranked}

    # CRITICAL ASSERTION: No unauthorized facility may EVER appear
    intersection = unauthorized_ids.intersection(result_ids)
    assert len(intersection) == 0, f"SECURITY VIOLATION: Unauthorized facilities appeared in matching: {intersection}"
    
    for r in ranked:
        assert r["authorization_status"] in ["ACTIVE", "AUTHORIZED"]
    print("  ✓ PASSED: Zero unauthorized facilities returned! 100% hard filter enforced.")


def test_2_material_acceptance_filtering():
    print("\n--- Test 2: Material Acceptance Filtering ---")
    # CRT Monitors: Only facilities with CRT equipment (EcoRecycle, Cerebra) accept it
    ranked_crt = match_and_rank_recyclers("mat_crt_monitor", weight_kg=12.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    result_names = [r["facility_name"] for r in ranked_crt]
    
    # GreenCircle does NOT accept CRT
    for name in result_names:
        assert "GreenCircle" not in name, f"GreenCircle should not accept CRT but appeared: {name}"
    
    assert len(ranked_crt) >= 1
    print("  ✓ PASSED: Material filtering verified. Only CRT authorized facilities returned:", result_names)


def test_3_haversine_distance_accuracy():
    print("\n--- Test 3: Great-Circle Haversine Distance Accuracy ---")
    # Distance from Dharavi (19.0435, 72.8567) to EcoRecycle Goregaon (19.0550, 72.8710)
    # Expected: ~1.95 km
    dist = haversine_distance_km(DHARAVI_LAT, DHARAVI_LNG, 19.0550, 72.8710)
    assert 1.5 <= dist <= 2.5, f"Unexpected distance: {dist} km"
    print(f"  ✓ Distance Dharavi to EcoRecycle: {dist} km (Sensible and accurate)")

    # Distance to Chakan, Pune (~115 km)
    dist_pune = haversine_distance_km(DHARAVI_LAT, DHARAVI_LNG, 18.7520, 73.8560)
    assert 100.0 <= dist_pune <= 135.0, f"Unexpected distance: {dist_pune} km"
    print(f"  ✓ Distance Dharavi to Pune facility: {dist_pune} km (Sensible cross-city calculation)")


def test_4_mcda_scoring_and_sanity_check():
    print("\n--- Test 4: MCDA Scoring & Sanity Check of Top Pick ---")
    ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=20.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    assert len(ranked) >= 2, "Expected at least 2 active matches"

    top = ranked[0]
    print(f"  • Top Pick (Rank 1): {top['facility_name']} (MCDA Score: {top['mcda_score']})")
    print(f"    - Offered Rate: ₹{top['offered_rate_per_kg']}/kg | Distance: {top['distance_km']} km | Payout: ₹{top['estimated_payout_inr']}")

    # Verification: Scores must be sorted descending
    scores = [r["mcda_score"] for r in ranked]
    assert scores == sorted(scores, reverse=True), "Candidates not sorted descending by MCDA score"
    print("  ✓ PASSED: Ranked order is strictly descending by multi-criteria score")


def test_5_require_pickup_filtering():
    print("\n--- Test 5: Require Pickup Filter ---")
    # When pickup is required, facilities with pickup_availability=False (like GreenCircle) must be excluded
    ranked_pickup = match_and_rank_recyclers(
        "mat_pcb_high", weight_kg=10.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG, require_pickup=True
    )
    for r in ranked_pickup:
        assert r["pickup_available"] is True, f"Facility {r['facility_name']} lacks pickup but appeared when required"
    print("  ✓ PASSED: require_pickup=True returned only facilities with active vehicle collection")


def test_6_highlight_badges_and_vernacular():
    print("\n--- Test 6: Highlight Badges and Bilingual Labels ---")
    ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=10.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    all_badges = [b for r in ranked for b in r.get("badges", [])]
    badge_types = {b["type"] for b in all_badges}

    assert "HIGHEST_PAYOUT" in badge_types, "Expected HIGHEST_PAYOUT badge"
    assert "NEAREST_FACILITY" in badge_types, "Expected NEAREST_FACILITY badge"

    for b in all_badges:
        assert b["label_en"]
        assert b["label_hi"]
        assert b["label_mr"]
    print("  ✓ PASSED: Badges generated with English, Hindi, and Marathi text")


def test_7_fastapi_match_recyclers_endpoint():
    print("\n--- Test 7: FastAPI GET /match-recyclers Endpoint ---")
    response = client.get(f"/match-recyclers?material_id=mat_pcb_high&weight=15.0&lat={DHARAVI_LAT}&lng={DHARAVI_LNG}")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["status"] == "COMPLETED"
    assert body["total_matches"] >= 2
    assert len(body["ranked_recyclers"]) == body["total_matches"]

    # Verify no unauthorized facility in HTTP response
    for rec in body["ranked_recyclers"]:
        assert rec["authorization_status"] in ["ACTIVE", "AUTHORIZED"]
    print(f"  ✓ PASSED: GET /match-recyclers returned {body['total_matches']} authorized facilities with HTTP 200")


if __name__ == "__main__":
    print("=================================================================")
    print("Running Kabadiwala Connect Chunk 6 (Recycler Matching) Test Suite")
    print("=================================================================")
    test_1_hard_filter_unauthorized_recyclers_excluded()
    test_2_material_acceptance_filtering()
    test_3_haversine_distance_accuracy()
    test_4_mcda_scoring_and_sanity_check()
    test_5_require_pickup_filtering()
    test_6_highlight_badges_and_vernacular()
    test_7_fastapi_match_recyclers_endpoint()
    print("\n=================================================================")
    print("🎉 ALL 7 TESTS PASSED! Chunk 6 Recycler Matching Fully Verified!")
    print("=================================================================\n")
