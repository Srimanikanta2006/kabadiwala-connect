"""
Kabadiwala Connect - Chunk 7 Anomaly & Fraud Detection Engine Verification Suite
================================================================================
Verifies:
1. Physical weight-density plausibility checks across CPCB categories.
2. Perceptual image hashing (64-bit dHash) duplicate detection with Hamming distance.
3. Market rate outlier / pricing spike detection against live mandi benchmarks.
4. Composite multi-factor risk scoring and operational decision tiers.
5. Vernacular low-literacy spoken feedback in Hindi and Marathi.
6. FastAPI GET /anomaly-check and POST /anomaly-check endpoints.
"""

import sys
import os
import unittest
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app
from anomaly.detector import (
    evaluate_lot_anomaly,
    check_weight_bounds,
    check_duplicate_image,
    check_price_outlier,
    hamming_distance,
    MATERIAL_WEIGHT_BOUNDS
)


class TestAnomalyDetectionEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_1_normal_plausible_lot_clean_signal(self):
        """Test 1: A normal, plausible lot must produce LOW risk (score <= 25), ALLOW decision."""
        print("\n--- Test 1: Normal Plausible Lot (Clean Signal) ---")
        report = evaluate_lot_anomaly(
            material_id="mat_pcb_high",
            weight_kg=12.5,
            quoted_price=3000.0,  # ₹240/kg (standard mandi rate)
            image_phash="1a2b3c4d5e6f7081",
            location="IN-MH-MUM"
        )
        self.assertFalse(report["is_anomalous"])
        self.assertLessEqual(report["risk_score"], 25)
        self.assertEqual(report["risk_level"], "LOW")
        self.assertEqual(report["decision"], "ALLOW")
        self.assertEqual(len(report["anomalies"]), 0)
        self.assertIn("12.5", report["vernacular_feedback"]["en"])
        print(f"  ✓ Clean Lot Verified: Risk Score={report['risk_score']} Level={report['risk_level']} Decision={report['decision']}")

    def test_2_physical_weight_density_bounds(self):
        """Test 2: Weight bounds guard must catch physically impossible scrap weights."""
        print("\n--- Test 2: Physical Weight Density Bounds ---")
        # 1. Lead-acid battery cannot be 0.05 kg (minimum is 3.0 kg)
        under_res = check_weight_bounds("mat_batteries_lead", 0.05)
        self.assertIsNotNone(under_res)
        self.assertEqual(under_res["code"], "WEIGHT_BELOW_MIN_BOUND")
        self.assertEqual(under_res["severity"], "HIGH")
        print(f"  ✓ Under-weight caught: {under_res['message_en']}")

        # 2. PCB lot of 450 kg exceeds single collection cart limit (250 kg)
        over_res = check_weight_bounds("mat_pcb_high", 450.0)
        self.assertIsNotNone(over_res)
        self.assertEqual(over_res["code"], "WEIGHT_ABOVE_MAX_BOUND")
        self.assertEqual(over_res["severity"], "HIGH")
        print(f"  ✓ Over-weight caught: {over_res['message_en']}")

        # 3. Negative weight
        neg_res = check_weight_bounds("mat_crt_monitor", -10.0)
        self.assertIsNotNone(neg_res)
        self.assertEqual(neg_res["code"], "WEIGHT_ZERO_OR_NEGATIVE")
        self.assertEqual(neg_res["severity"], "CRITICAL")
        self.assertEqual(neg_res["risk_score"], 100)
        print(f"  ✓ Negative weight caught: {neg_res['message_en']}")

    def test_3_perceptual_image_hash_duplicate_detection(self):
        """Test 3: Perceptual dHash duplicate check must flag duplicate or near-duplicate scrap photos."""
        print("\n--- Test 3: Perceptual Duplicate Image Detection (dHash) ---")
        test_hash = "cc036586cd250bca"
        exact_dup_hash = "cc036586cd250bca"
        near_dup_hash = "cc036586cd250bce"  # Hamming distance 1 (0xa = 1010, 0xe = 1110)
        unrelated_hash = "11f0e4a90033ffee"  # High Hamming distance

        # Bitwise Hamming distance sanity
        self.assertEqual(hamming_distance(test_hash, exact_dup_hash), 0)
        self.assertEqual(hamming_distance(test_hash, near_dup_hash), 1)
        self.assertGreater(hamming_distance(test_hash, unrelated_hash), 20)

        # Mock recent database lot hashes
        mock_recent_lots = [
            {"id": "lot_mock_001", "image_phash": exact_dup_hash, "created_at": "2026-09-04T10:00:00Z"},
            {"id": "lot_mock_002", "image_phash": unrelated_hash, "created_at": "2026-09-04T09:00:00Z"}
        ]

        # Check exact duplicate
        dup_res = check_duplicate_image(test_hash, recent_lots=mock_recent_lots, threshold=4)
        self.assertIsNotNone(dup_res)
        self.assertEqual(dup_res["code"], "DUPLICATE_IMAGE_DETECTED")
        self.assertEqual(dup_res["severity"], "CRITICAL")
        self.assertEqual(dup_res["hamming_distance"], 0)
        print(f"  ✓ Exact duplicate caught: dist={dup_res['hamming_distance']} matched_lot={dup_res['matched_lot_id']}")

        # Check near-duplicate (rotated or slight lighting difference, distance=1)
        near_res = check_duplicate_image(near_dup_hash, recent_lots=mock_recent_lots, threshold=4)
        self.assertIsNotNone(near_res)
        self.assertEqual(near_res["hamming_distance"], 1)
        print(f"  ✓ Near-duplicate caught: dist={near_res['hamming_distance']} <= threshold 4")

        # Unrelated hash should pass cleanly
        clean_res = check_duplicate_image("ffffffff00000000", recent_lots=mock_recent_lots, threshold=4)
        self.assertIsNone(clean_res)
        print("  ✓ Unrelated image passed cleanly with zero flags")

    def test_4_price_outlier_and_market_spike(self):
        """Test 4: Pricing outlier checks must detect unnatural price spikes and underpayment risk."""
        print("\n--- Test 4: Pricing Outlier & Market Spike Checks ---")
        # Mandi rate for mat_pcb_high is ₹240/kg in Mumbai.
        # Asking ₹600/kg (+150% spike)
        spike_res = check_price_outlier(
            material_id="mat_pcb_high",
            weight_kg=10.0,
            quoted_price=6000.0,  # ₹600/kg
            location="IN-MH-MUM"
        )
        self.assertIsNotNone(spike_res)
        self.assertEqual(spike_res["code"], "PRICE_EXCESSIVE_SPIKE")
        self.assertGreater(spike_res["deviation_pct"], 50.0)
        print(f"  ✓ Price spike detected: {spike_res['unit_price_inr_per_kg']}/kg vs benchmark {spike_res['mandi_benchmark_inr_per_kg']}/kg (+{spike_res['deviation_pct']}%)")

        # Copper cables benchmark ₹380/kg. Quoting ₹30/kg (-92% depressed)
        under_res = check_price_outlier(
            material_id="mat_cables_copper",
            weight_kg=10.0,
            quoted_price=300.0,  # ₹30/kg
            location="IN-MH-MUM"
        )
        self.assertIsNotNone(under_res)
        self.assertEqual(under_res["code"], "PRICE_SUSPICIOUSLY_LOW")
        print(f"  ✓ Depressed rate caught: {under_res['unit_price_inr_per_kg']}/kg vs benchmark {under_res['mandi_benchmark_inr_per_kg']}/kg")

    def test_5_composite_multi_factor_risk_scoring_and_decision_tiers(self):
        """Test 5: Composite scoring must combine risk points and map to correct operational decisions."""
        print("\n--- Test 5: Composite Risk Scoring & Decision Tiers ---")
        mock_lots = [{"id": "lot_prior_dup", "image_phash": "1122334455667788"}]

        # Lot with BOTH duplicate image (60 pts) and excessive price spike (35 pts) -> 95 pts -> CRITICAL / BLOCK
        high_risk_lot = evaluate_lot_anomaly(
            material_id="mat_pcb_high",
            weight_kg=10.0,
            quoted_price=6500.0,  # price spike
            image_phash="1122334455667788",  # duplicate image
            recent_lots_cache=mock_lots
        )
        self.assertTrue(high_risk_lot["is_anomalous"])
        self.assertGreaterEqual(high_risk_lot["risk_score"], 86)
        self.assertEqual(high_risk_lot["risk_level"], "CRITICAL")
        self.assertEqual(high_risk_lot["decision"], "BLOCK")
        self.assertEqual(high_risk_lot["anomalies_count"], 2)
        print(f"  ✓ Fraud Lot Blocked: Score={high_risk_lot['risk_score']} Level={high_risk_lot['risk_level']} Decision={high_risk_lot['decision']}")

        # Lot with only moderate weight anomaly (40 pts) -> MEDIUM / FLAG_FOR_WEIGHBRIDGE
        med_risk_lot = evaluate_lot_anomaly(
            material_id="mat_batteries_lead",
            weight_kg=1.5,  # under 3.0 kg min
            quoted_price=120.0
        )
        self.assertEqual(med_risk_lot["risk_level"], "MEDIUM")
        self.assertEqual(med_risk_lot["decision"], "FLAG_FOR_WEIGHBRIDGE")
        self.assertTrue(med_risk_lot["requires_weighbridge_photo"])
        print(f"  ✓ Weighbridge Inspection Flagged: Score={med_risk_lot['risk_score']} Level={med_risk_lot['risk_level']} Decision={med_risk_lot['decision']}")

    def test_6_vernacular_low_literacy_feedback(self):
        """Test 6: Spoken audio guidance must contain clear Devanagari text in Hindi and Marathi."""
        print("\n--- Test 6: Vernacular Hindi & Marathi Feedback ---")
        report = evaluate_lot_anomaly(
            material_id="mat_crt_monitor",
            weight_kg=2.0  # CRT under 5kg min
        )
        feedback = report["vernacular_feedback"]
        self.assertIn("hi", feedback)
        self.assertIn("mr", feedback)
        self.assertIn("चेतावनी", feedback["hi"])
        self.assertIn("सूचना", feedback["mr"])
        print(f"  ✓ Hindi Feedback: {feedback['hi']}")
        print(f"  ✓ Marathi Feedback: {feedback['mr']}")

    def test_7_fastapi_endpoints_integration(self):
        """Test 7: Verify GET /anomaly-check and POST /anomaly-check live HTTP endpoints."""
        print("\n--- Test 7: FastAPI Endpoints (GET & POST) Integration ---")
        # 1. GET /anomaly-check with query params
        res = self.client.get("/anomaly-check?material_id=mat_pcb_high&weight=15.0&price=3600.0")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "COMPLETED")
        self.assertEqual(data["decision"], "ALLOW")
        self.assertIn("placeholder", data)
        print("  ✓ GET /anomaly-check succeeded with clean response (Decision: ALLOW)")

        # 2. GET /anomaly-check flagging anomaly
        res = self.client.get("/anomaly-check?material_id=mat_crt_monitor&weight=1.0")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["is_anomalous"])
        self.assertGreater(data["risk_score"], 25)
        print(f"  ✓ GET /anomaly-check flagged out-of-bounds weight (Risk: {data['risk_score']})")

        # 3. POST /anomaly-check with JSON payload
        post_payload = {
            "material_id": "mat_cables_copper",
            "weight_kg": 8.0,
            "quoted_price": 3040.0,
            "location": "IN-MH-MUM"
        }
        res = self.client.post("/anomaly-check", json=post_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "COMPLETED")
        self.assertFalse(data["is_anomalous"])
        print("  ✓ POST /anomaly-check pre-flight payload verified successfully")


if __name__ == "__main__":
    print("=================================================================")
    print("Running Kabadiwala Connect Chunk 7 (Anomaly Detection) Test Suite")
    print("=================================================================")
    unittest.main(verbosity=1)
