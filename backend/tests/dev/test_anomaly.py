"""
Kabadiwala Connect - Chunk 7 Anomaly & Fraud Detection Engine Verification Suite
================================================================================
Verifies all requirements from Chunk 7 specification:
1. Statistical price outlier detection:
   - Z-score (> 2 standard deviations from rolling mean) via scipy/numpy.
   - Interquartile range (IQR fence: [Q1 - 1.5*IQR, Q3 + 1.5*IQR]) for small sample sizes.
2. Perceptual-hash duplicate detection (imagehash):
   - Flags duplicate photo submissions against recent lots from the same collector and regional pool.
3. Repeated rejected transactions tracking:
   - Flags collectors with repeated rejected/disputed transactions over a rolling window.
4. Physical weight-density bounds across all CPCB material categories.
5. Background job execution over new transactions and lots.
6. Handful of known-good test cases to guarantee ZERO false positives for normal transactions.
7. FastAPI GET /anomaly-check and POST /anomaly-check endpoints.
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
    check_repeated_rejected_transactions,
    calculate_statistical_price_bounds,
    run_anomaly_background_sweep,
    hamming_distance,
    MATERIAL_WEIGHT_BOUNDS
)


class TestAnomalyDetectionEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_1_known_good_normal_transactions_zero_false_positives(self):
        """
        Step 1 & Done When: Normal transactions don't get falsely flagged.
        Checks against a handful of known-good test cases across materials and weights.
        """
        print("\n--- Test 1: Known-Good Normal Transactions (Zero False Positives) ---")
        known_good_cases = [
            # High-Grade PCB: 10kg at ₹240/kg (₹2,400)
            {"cat": "mat_pcb_high", "weight": 10.0, "price": 2400.0, "hash": "1111222233334444", "name": "PCB High-Grade"},
            # Low-Grade PCB: 25kg at ₹55/kg (₹1,375)
            {"cat": "mat_pcb_low", "weight": 25.0, "price": 1375.0, "hash": "2222333344445555", "name": "PCB Low-Grade"},
            # Lead-Acid Battery: 15kg at ₹100/kg (₹1,500)
            {"cat": "mat_batteries_lead", "weight": 15.0, "price": 1500.0, "hash": "3333444455556666", "name": "Lead-Acid Battery"},
            # Copper Cables: 8kg at ₹380/kg (₹3,040)
            {"cat": "mat_cables_copper", "weight": 8.0, "price": 3040.0, "hash": "4444555566667777", "name": "Copper Cables"},
            # CRT Monitor: 14kg at ₹15/kg (₹210)
            {"cat": "mat_crt_monitor", "weight": 14.0, "price": 210.0, "hash": "5555666677778888", "name": "CRT Monitor"},
            # LCD Panel: 6kg at ₹42/kg (₹252)
            {"cat": "mat_lcd_panel", "weight": 6.0, "price": 252.0, "hash": "6666777788889999", "name": "LCD Screen"}
        ]

        for case in known_good_cases:
            report = evaluate_lot_anomaly(
                material_id=case["cat"],
                weight_kg=case["weight"],
                quoted_price=case["price"],
                image_phash=case["hash"],
                location="IN-MH-MUM"
            )
            # Must NOT be anomalous
            self.assertFalse(
                report["is_anomalous"],
                f"False positive triggered for legitimate transaction: {case['name']} (Risk: {report['risk_score']})"
            )
            self.assertEqual(report["risk_level"], "LOW")
            self.assertEqual(report["decision"], "ALLOW")
            self.assertEqual(len(report["anomalies"]), 0)
            print(f"  ✓ Known-good verified: {case['name']:<18} | Weight: {case['weight']:>4}kg | Rate: ₹{case['price']/case['weight']:>6.1f}/kg -> Clean (Risk: {report['risk_score']}, Decision: {report['decision']})")

    def test_2_deliberately_inflated_test_price_statistical_detection(self):
        """
        Step 1 & Done When: A deliberately-inflated test price gets flagged.
        Tests both Z-score (> 2 std devs from rolling mean) and IQR fence calculations.
        """
        print("\n--- Test 2: Deliberately-Inflated Test Price (Z-Score & IQR Fence) ---")
        material_id = "mat_pcb_high"
        weight_kg = 10.0
        # Benchmark for PCB is ₹240/kg. Deliberately inflate to ₹550/kg (₹5,500 total).
        inflated_price = 5500.0

        anomaly, stats_metrics = check_price_outlier(
            material_id=material_id,
            weight_kg=weight_kg,
            quoted_price=inflated_price,
            location="IN-MH-MUM"
        )

        self.assertIsNotNone(anomaly, "Inflated test price failed to trigger an anomaly!")
        self.assertEqual(anomaly["code"], "PRICE_STATISTICAL_OUTLIER_HIGH")
        self.assertEqual(anomaly["severity"], "HIGH")

        # Verify statistical values produced by scipy / numpy
        z_score = stats_metrics["z_score"]
        rolling_mean = stats_metrics["rolling_mean"]
        iqr_upper = stats_metrics["iqr_upper_fence"]

        print(f"  • Baseline Mean: ₹{rolling_mean}/kg | StdDev: ₹{stats_metrics['rolling_std']}/kg")
        print(f"  • Quoted Rate: ₹{stats_metrics['unit_price']}/kg | Upper IQR Fence: ₹{iqr_upper}/kg | Z-Score: {z_score}")

        self.assertGreater(z_score, 2.0, f"Z-score {z_score} must exceed 2.0 standard deviations")
        self.assertGreater(stats_metrics["unit_price"], iqr_upper, "Quoted rate must exceed upper IQR fence")
        self.assertTrue(stats_metrics["zscore_flagged"])
        self.assertTrue(stats_metrics["iqr_flagged"])

        print(f"  ✓ PASSED: Inflated price correctly flagged by Z-Score ({z_score} > 2.0) and IQR Fence ({stats_metrics['unit_price']} > ₹{iqr_upper}/kg)")

    def test_3_duplicate_image_perceptual_hash_same_collector(self):
        """
        Step 2 & Done When: A duplicate test image gets flagged.
        Tests perceptual hash comparison using imagehash against recent lots from the same collector.
        """
        print("\n--- Test 3: Duplicate Test Image Flagging (Perceptual Hash & Same Collector) ---")
        original_hash = "cc036586cd250bca"
        exact_dup_hash = "cc036586cd250bca"
        near_dup_hash = "cc036586cd250bce"  # 1 bit difference (dist = 1 <= 4)
        different_image_hash = "9988776655443322"  # Completely different image

        mock_recent_lots = [
            {
                "id": "lot_collector_prior_01",
                "collector_id": "col_kabadi_dharavi_101",
                "image_phash": exact_dup_hash,
                "created_at": "2026-09-04T12:00:00Z"
            }
        ]

        # 1. Exact duplicate photo submitted by the SAME collector
        dup_same = check_duplicate_image(
            new_hash=original_hash,
            collector_id="col_kabadi_dharavi_101",
            recent_lots=mock_recent_lots,
            threshold=4
        )
        self.assertIsNotNone(dup_same)
        self.assertEqual(dup_same["code"], "DUPLICATE_SUBMISSION_SAME_COLLECTOR")
        self.assertTrue(dup_same["is_same_collector"])
        self.assertEqual(dup_same["hamming_distance"], 0)
        self.assertEqual(dup_same["severity"], "CRITICAL")
        print(f"  ✓ Duplicate from same collector flagged: {dup_same['code']} (dist={dup_same['hamming_distance']})")

        # 2. Near-duplicate photo (slight lighting/crop difference, dist=1 <= 4)
        dup_near = check_duplicate_image(
            new_hash=near_dup_hash,
            collector_id="col_kabadi_dharavi_101",
            recent_lots=mock_recent_lots,
            threshold=4
        )
        self.assertIsNotNone(dup_near)
        self.assertLessEqual(dup_near["hamming_distance"], 4)
        print(f"  ✓ Near-duplicate photo flagged: dist={dup_near['hamming_distance']} <= threshold 4")

        # 3. Legitimate distinct photo must NOT be flagged
        clean_img = check_duplicate_image(
            new_hash=different_image_hash,
            collector_id="col_kabadi_dharavi_101",
            recent_lots=mock_recent_lots,
            threshold=4
        )
        self.assertIsNone(clean_img)
        print("  ✓ Distinct fresh photograph passed with zero flags")

    def test_4_repeated_rejected_transactions_per_collector(self):
        """
        Step 3: Flag repeated rejected transactions per collector over a rolling window.
        """
        print("\n--- Test 4: Repeated Rejected Transactions per Collector ---")
        bad_collector_id = "col_suspicious_repeat_99"
        mock_tx_history = [
            {"id": "tx_01", "collector_id": bad_collector_id, "status": "REJECTED"},
            {"id": "tx_02", "collector_id": bad_collector_id, "status": "DISPUTED"},
            {"id": "tx_03", "collector_id": bad_collector_id, "status": "COMPLETED"},
            {"id": "tx_04", "collector_id": "col_other_002", "status": "REJECTED"}
        ]

        rej_res = check_repeated_rejected_transactions(
            collector_id=bad_collector_id,
            rolling_window_days=7,
            rejection_threshold=2,
            mock_history=mock_tx_history
        )
        self.assertIsNotNone(rej_res)
        self.assertEqual(rej_res["code"], "REPEATED_REJECTIONS_SUSPICIOUS")
        self.assertEqual(rej_res["rejected_transactions_count"], 2)
        self.assertEqual(rej_res["severity"], "HIGH")
        print(f"  ✓ Repeated rejections flagged: {rej_res['rejected_transactions_count']} rejected lots in {rej_res['rolling_window_days']} days")

        # Good collector with 0 rejected transactions
        clean_collector = check_repeated_rejected_transactions(
            collector_id="col_good_collector_01",
            rolling_window_days=7,
            rejection_threshold=2,
            mock_history=mock_tx_history
        )
        self.assertIsNone(clean_collector)
        print("  ✓ Trustworthy collector with 0 rejections passed cleanly")

    def test_5_physical_weight_density_safeguards(self):
        """
        Physical weight density checks: Impossible weights must be caught.
        """
        print("\n--- Test 5: Physical Weight Density Bounds ---")
        # Lead-acid battery cannot be 0.05kg (min 3.0kg)
        res_under = check_weight_bounds("mat_batteries_lead", 0.05)
        self.assertIsNotNone(res_under)
        self.assertEqual(res_under["code"], "WEIGHT_BELOW_MIN_BOUND")

        # PCB cannot be 450kg on a hand-cart (max 250kg)
        res_over = check_weight_bounds("mat_pcb_high", 450.0)
        self.assertIsNotNone(res_over)
        self.assertEqual(res_over["code"], "WEIGHT_ABOVE_MAX_BOUND")

        # Negative weight
        res_neg = check_weight_bounds("mat_crt_monitor", -5.0)
        self.assertIsNotNone(res_neg)
        self.assertEqual(res_neg["code"], "WEIGHT_ZERO_OR_NEGATIVE")
        print("  ✓ All physical weight density violations caught accurately")

    def test_6_fastapi_anomaly_check_endpoints_and_background_sweep(self):
        """
        Step 4: Wire into GET /anomaly-check, run as a background job over new transactions.
        """
        print("\n--- Test 6: FastAPI Endpoints & Background Sweep Job ---")
        # 1. GET /anomaly-check with legitimate parameters
        res = self.client.get("/anomaly-check?material_id=mat_pcb_high&weight=12.0&price=2880.0")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body["status"], "COMPLETED")
        self.assertFalse(body["is_anomalous"])
        self.assertEqual(body["decision"], "ALLOW")
        self.assertIn("statistical_metrics", body)
        print("  ✓ GET /anomaly-check returned clean HTTP 200 (Decision: ALLOW)")

        # 2. GET /anomaly-check with deliberately inflated rate
        res = self.client.get("/anomaly-check?material_id=mat_pcb_high&weight=10.0&price=5800.0")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertTrue(body["is_anomalous"])
        self.assertIn("statistical_metrics", body)
        self.assertGreater(body["risk_score"], 25)
        print(f"  ✓ GET /anomaly-check flagged price outlier (Risk: {body['risk_score']}, Decision: {body['decision']})")

        # 3. POST /anomaly-check/run-background-job
        bg_res = self.client.post("/anomaly-check/run-background-job?batch_size=15")
        self.assertEqual(bg_res.status_code, 200)
        bg_data = bg_res.json()
        self.assertTrue(bg_data["success"])
        self.assertEqual(bg_data["status"], "QUEUED")
        print(f"  ✓ POST /anomaly-check/run-background-job successfully triggered background sweep (Status: {bg_data['status']})")


if __name__ == "__main__":
    print("=================================================================")
    print("Running Kabadiwala Connect Chunk 7 (Statistical Anomaly) Test Suite")
    print("=================================================================")
    unittest.main(verbosity=1)
