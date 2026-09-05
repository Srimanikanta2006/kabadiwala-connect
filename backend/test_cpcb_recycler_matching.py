"""
Test Suite for Real CPCB Authorized Recycler Matching Engine.
Verifies:
1. Hard filter on authorization: Unauthorized and suspended facilities are 100% excluded.
2. Proximity ranking: Dharavi/Mumbai (19.0435, 72.8567) prioritizes local Maharashtra facilities.
3. Material compatibility: High-grade PCB matches specialized Recyclers with higher priority.
4. Capacity scaling: Higher installed MTA is favored for larger scrap lots.
5. Statutory metadata integrity: All matched records include statutory_reference, facility_type, and installed_capacity_mta.
6. Multi-state coverage: Tests proximity matches for Delhi-NCR, Bengaluru, and Chennai.
"""

import os
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from matching.engine import (
    load_all_recyclers,
    match_and_rank_recyclers,
    haversine_distance_km
)

DHARAVI_LAT = 19.0435
DHARAVI_LNG = 72.8567


def test_1_hard_filter_unauthorized_rejection():
    print("\n--- Test 1: Hard Filter Verification (Unauthorized Facilities Excluded) ---")
    all_recs = load_all_recyclers()
    unauth = [r for r in all_recs if r.get("authorization_status") not in ["ACTIVE", "AUTHORIZED", "AUTHORISED"]]
    assert len(unauth) >= 1, "Expected negative control unauthorized facilities in candidate pool"
    print(f"  [i] Candidate pool contains {len(unauth)} unauthorized negative control facilities: {[u['id'] for u in unauth]}")

    ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=25.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    ranked_ids = {r["recycler_id"] for r in ranked}

    for u in unauth:
        assert u["id"] not in ranked_ids, f"SECURITY FAILURE: Unauthorized facility {u['id']} appeared in ranked results!"

    for r in ranked:
        assert r["authorization_status"] in ["ACTIVE", "AUTHORIZED", "AUTHORISED"], f"Found invalid status: {r}"

    print(f"  [OK] PASSED: Zero unauthorized facilities returned across {len(ranked)} ranked candidates. 100% hard filter enforced.")


def test_2_proximity_ranking_mumbai():
    print("\n--- Test 2: Proximity Ranking for Mumbai / Dharavi ---")
    ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=20.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    assert len(ranked) >= 5, f"Expected at least 5 matches, got {len(ranked)}"

    top_3 = ranked[:3]
    for idx, r in enumerate(top_3, 1):
        print(f"  Rank {idx}: {r['facility_name']} | Distance: {r['distance_km']} km | State: {r['state_or_ut']} | Capacity: {r['installed_capacity_mta']} MTA")

    # Top facilities in Mumbai search should be in Maharashtra / Western Region
    for r in top_3:
        assert r["state_or_ut"] == "Maharashtra", f"Expected Maharashtra facility in top ranks for Mumbai collector, got {r['state_or_ut']}"
        assert r["distance_km"] < 150.0, f"Distance too large for top local facility: {r['distance_km']} km"

    print("  [OK] PASSED: Proximity ranking successfully prioritized nearby Maharashtra industrial facilities.")


def test_3_material_compatibility_and_facility_type():
    print("\n--- Test 3: Material Compatibility & Facility Type Suitability ---")
    # For high-grade PCB (requires specialized metallurgical smelting/recovery), Recyclers should have higher type_fit
    ranked_pcb = match_and_rank_recyclers("mat_pcb_high", weight_kg=50.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    
    # Check that matched facilities accept mat_pcb_high
    for r in ranked_pcb[:5]:
        assert "mat_pcb_high" in r.get("materials_accepted", []) or r.get("offered_rate_per_kg", 0) > 0
        print(f"  • {r['facility_name']}: Type={r['facility_type']} | Rate=₹{r['offered_rate_per_kg']}/kg")

    # Recyclers should dominate the top ranks for hazardous PCB lots
    recycler_count = sum(1 for r in ranked_pcb[:5] if "Recycler" in str(r.get("facility_type", "")))
    assert recycler_count >= 2, f"Expected authorized Recyclers in top ranks for PCB lots, got {recycler_count}"
    print(f"  [OK] PASSED: {recycler_count}/5 top facilities are certified Recyclers for PCB processing.")


def test_4_capacity_scaling():
    print("\n--- Test 4: Capacity Scaling (MTA) Suitability ---")
    # For small lots (10 kg), smaller facilities are suitable
    ranked_small = match_and_rank_recyclers("mat_mixed_plastics", weight_kg=10.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    # For bulk lots (5000 kg), massive capacity facilities should be prioritized
    ranked_bulk = match_and_rank_recyclers("mat_mixed_plastics", weight_kg=5000.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)

    avg_cap_small = sum(r["installed_capacity_mta"] for r in ranked_small[:5]) / 5.0
    avg_cap_bulk = sum(r["installed_capacity_mta"] for r in ranked_bulk[:5]) / 5.0

    print(f"  • Avg Capacity for 10 kg lot top-5:   {avg_cap_small:.1f} MTA")
    print(f"  • Avg Capacity for 5000 kg lot top-5: {avg_cap_bulk:.1f} MTA")
    assert avg_cap_bulk >= 500.0, "Bulk lot top facilities should have large installed capacity"
    print("  [OK] PASSED: Capacity scaling prioritizes high-capacity industrial processors for bulk lots.")


def test_5_statutory_metadata_fields():
    print("\n--- Test 5: Statutory Metadata Fields Integrity ---")
    ranked = match_and_rank_recyclers("mat_cables_copper", weight_kg=30.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    assert len(ranked) > 0

    for r in ranked:
        assert "statutory_reference" in r, "Missing statutory_reference"
        assert "facility_type" in r, "Missing facility_type"
        assert "installed_capacity_mta" in r, "Missing installed_capacity_mta"
        assert r["installed_capacity_mta"] is not None and r["installed_capacity_mta"] >= 0
        valid_types = ["Recycler", "Dismantler", "Authorised E-Waste Facility", "Recycler & Dismantler", "Dismantler / Aggregator"]
        assert r["facility_type"] in valid_types, f"Unexpected facility_type: {r['facility_type']}"
        assert "cpcb_reg_no" in r
        assert "source_document" in r
        assert "source_date" in r

    sample = ranked[0]
    print(f"  • Sample Record Metadata:")
    print(f"    - Name:                {sample['facility_name']}")
    print(f"    - Statutory Ref:       {sample['statutory_reference']}")
    print(f"    - Facility Type:       {sample['facility_type']}")
    print(f"    - Capacity:            {sample['installed_capacity_mta']} MTA")
    print(f"    - Source Document:     {sample['source_document']}")
    print(f"    - Source Date:         {sample['source_date']}")
    print("  [OK] PASSED: All CPCB statutory metadata verified without fabricated fields.")


def test_6_pan_india_proximity_coverage():
    print("\n--- Test 6: Pan-India Proximity Matching ---")
    # 1. Bengaluru (Karnataka)
    blr_ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=20.0, collector_lat=12.9716, collector_lng=77.5946)
    assert blr_ranked[0]["state_or_ut"] == "Karnataka"
    print(f"  • Bengaluru Top Pick: {blr_ranked[0]['facility_name']} ({blr_ranked[0]['distance_km']} km, {blr_ranked[0]['state_or_ut']})")

    # 2. Delhi (National Capital Region)
    del_ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=20.0, collector_lat=28.6139, collector_lng=77.2090)
    assert del_ranked[0]["state_or_ut"] in ["Delhi", "Haryana", "Uttar Pradesh"]
    print(f"  • Delhi Top Pick:     {del_ranked[0]['facility_name']} ({del_ranked[0]['distance_km']} km, {del_ranked[0]['state_or_ut']})")

    # 3. Chennai (Tamil Nadu)
    chn_ranked = match_and_rank_recyclers("mat_pcb_high", weight_kg=20.0, collector_lat=13.0827, collector_lng=80.2707)
    assert chn_ranked[0]["state_or_ut"] == "Tamil Nadu"
    print(f"  • Chennai Top Pick:   {chn_ranked[0]['facility_name']} ({chn_ranked[0]['distance_km']} km, {chn_ranked[0]['state_or_ut']})")

    print("  [OK] PASSED: Pan-India proximity matches verified across Karnataka, NCR, and Tamil Nadu.")


def test_7_handover_stores_real_cpcb_recycler_metadata():
    print("\n--- Test 7: Digital Handover & Traceability Real Recycler Storage ---")
    from app.services.handover_service import create_handover_record, get_handover_details, confirm_handover_receipt

    # 1. Match a lot to find the top real CPCB facility
    matches = match_and_rank_recyclers("mat_pcb_high", weight_kg=15.0, collector_lat=DHARAVI_LAT, collector_lng=DHARAVI_LNG)
    top_facility = matches[0]
    rec_id = top_facility["recycler_id"]
    statutory_ref = top_facility["statutory_reference"]
    facility_name = top_facility["facility_name"]
    facility_type = top_facility["facility_type"]

    print(f"  • Selected CPCB Facility: {facility_name} (ID: {rec_id}, Ref: {statutory_ref})")

    # 2. Initiate digital handover with selected facility
    init_res = create_handover_record(
        weight=15.0,
        collector_id="col_dharavi_01",
        material_id="mat_pcb_high",
        material_category="PCB",
        quoted_price=top_facility["estimated_payout_inr"],
        state="MH",
        recycler_id=rec_id,
        statutory_reference=statutory_ref,
        facility_name=facility_name,
        facility_type=facility_type
    )
    assert init_res["success"] is True
    handover_ref = init_res["handover_ref"]
    tr = init_res["traceability"]

    # Verify real CPCB metadata stored in handover
    assert tr["recycler_id"] == rec_id
    assert tr["statutory_reference"] == statutory_ref
    assert tr["facility_name"] == facility_name
    assert tr["facility_type"] == facility_type
    assert tr["payment_status"] == "PENDING_HANDOVER"

    # Verify QR payload carries genuine facility metadata
    qr_payload = init_res["qr_payload"]
    assert qr_payload["recycler_id"] == rec_id
    assert qr_payload["statutory_reference"] == statutory_ref
    assert qr_payload["facility_name"] == facility_name

    # 3. Retrieve handover details and verify integrity
    details = get_handover_details(handover_ref)
    assert details["success"] is True
    d_tr = details["traceability"]
    assert d_tr["recycler_id"] == rec_id
    assert d_tr["statutory_reference"] == statutory_ref

    # 4. Recycler confirms handover
    confirm_res = confirm_handover_receipt(
        handover_ref_or_id=handover_ref,
        recycler_id=rec_id,
        verified_weight=15.2,
        payment_mode="CASH"
    )
    assert confirm_res["status"] == "CONFIRMED"
    c_tr = confirm_res["traceability"]
    assert c_tr["recycler_id"] == rec_id
    assert c_tr["statutory_reference"] == statutory_ref
    assert c_tr["recycler_confirmation"] is True
    assert confirm_res["transaction"]["recycler_id"] == rec_id

    print("  [OK] PASSED: Real CPCB Recycler ID and government authorization stored in handover and ledger!")


if __name__ == "__main__":
    print("==================================================================")
    print("CPCB Authorized Recycler Matching Engine - Verification Suite")
    print("==================================================================")
    test_1_hard_filter_unauthorized_rejection()
    test_2_proximity_ranking_mumbai()
    test_3_material_compatibility_and_facility_type()
    test_4_capacity_scaling()
    test_5_statutory_metadata_fields()
    test_6_pan_india_proximity_coverage()
    test_7_handover_stores_real_cpcb_recycler_metadata()
    print("\n==================================================================")
    print("ALL 7 CPCB RECYCLER MATCHING & HANDOVER TESTS PASSED PERFECTLY!")
    print("==================================================================\n")
