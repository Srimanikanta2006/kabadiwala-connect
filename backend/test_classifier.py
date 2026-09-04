"""
Integration and Unit Tests for Chunk 4: ML Material Classifier.
Validates:
1. End-to-end inference on real scrap images (PCB, Copper Cable, CRT, Battery).
2. Perceptual gradient dHash fingerprint generation.
3. Human-in-the-Loop confidence tiers (HIGH >= 85%, MEDIUM 60-85%, LOW < 60%).
4. CPCB e-waste code and hazard warning enrichment.
5. Vernacular Hindi & Marathi spoken text generation.
6. FastAPI POST /classify endpoint via multipart/form-data and JSON base64.
"""

import base64
import io
import os
import sys
from pathlib import Path
from PIL import Image

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from main import app
from ml.classifier import MaterialClassifier, classifier_service

ASSETS_DIR = BACKEND_DIR.parent / "stitch-designs" / "assets"
client = TestClient(app)


def test_1_pcb_archetype_inference():
    print("\n--- Test 1: High-Grade PCB Archetype Inference ---")
    pcb_path = ASSETS_DIR / "pcb_motherboards.png"
    assert pcb_path.exists(), f"Asset not found: {pcb_path}"

    image_bytes = pcb_path.read_bytes()
    res = classifier_service.classify(image_bytes)

    assert res["top_category"] == "mat_pcb_high"
    assert res["confidence"] >= 0.85
    assert res["confidence_tier"] == "HIGH"
    assert res["auto_select"] is True
    assert res["recommended_action"] == "AUTO_SELECT_BADGE"
    assert res["cpcb_e_waste_code"] == "ITEW1-PCB-HG"
    assert len(res["image_dhash"]) == 16
    assert len(res["suggestions"]) >= 3
    print("  ✓ PCB classified as High-Grade PCB (Conf:", res["confidence"], "Tier:", res["confidence_tier"], ")")
    print("  ✓ CPCB Code:", res["cpcb_e_waste_code"], "dHash:", res["image_dhash"])


def test_2_copper_cables_inference():
    print("\n--- Test 2: Copper Cables Archetype Inference ---")
    cable_path = ASSETS_DIR / "copper_cables_wire.png"
    assert cable_path.exists(), f"Asset not found: {cable_path}"

    image_bytes = cable_path.read_bytes()
    res = classifier_service.classify(image_bytes)

    assert res["top_category"] == "mat_cables_copper"
    assert res["confidence"] >= 0.85
    assert res["confidence_tier"] == "HIGH"
    assert res["cpcb_e_waste_code"] == "ITEW-CBL-CU"
    assert "cables_copper" in res["top_category"]
    print("  ✓ Copper cables classified correctly (Conf:", res["confidence"], "CPCB:", res["cpcb_e_waste_code"], ")")


def test_3_hazardous_material_and_warnings():
    print("\n--- Test 3: Hazardous Battery Identification & Safety Alerts ---")
    batt_path = ASSETS_DIR / "scrap_batteries.png"
    assert batt_path.exists(), f"Asset not found: {batt_path}"

    image_bytes = batt_path.read_bytes()
    res = classifier_service.classify(image_bytes)

    assert res["top_category"] == "mat_batteries_lead"
    assert res["hazard_level"] == "HAZARDOUS"
    assert res["cpcb_e_waste_code"] == "BATT-PB-ACID"
    assert len(res["hazard_warnings"]) > 0
    # Spoken warnings should include caution
    assert "चेतावनी" in res["spoken_announcements"]["hi"] or "सावधानी" in res["spoken_announcements"]["hi"]
    print("  ✓ Lead-Acid Battery flagged as HAZARDOUS with", len(res["hazard_warnings"]), "safety guidelines")
    print("  ✓ Hindi caution confirmed in spoken string")


def test_4_confidence_tiers_human_in_the_loop():
    print("\n--- Test 4: Human-in-the-Loop Confidence UX Tiers ---")
    sample_path = ASSETS_DIR / "pcb_motherboards.png"
    image_bytes = sample_path.read_bytes()

    # High Tier (>= 85%)
    res_high = classifier_service.classify(image_bytes, confidence_override=0.91)
    assert res_high["confidence_tier"] == "HIGH"
    assert res_high["auto_select"] is True
    assert res_high["recommended_action"] == "AUTO_SELECT_BADGE"
    print("  ✓ Tier HIGH (0.91) -> Action: AUTO_SELECT_BADGE, auto_select=True")

    # Medium Tier (60% - 85%)
    res_med = classifier_service.classify(image_bytes, confidence_override=0.74)
    assert res_med["confidence_tier"] == "MEDIUM"
    assert res_med["auto_select"] is False
    assert res_med["recommended_action"] == "SHOW_SUGGESTIONS"
    assert len(res_med["suggestions"]) == 3
    print("  ✓ Tier MEDIUM (0.74) -> Action: SHOW_SUGGESTIONS, auto_select=False")

    # Low Tier (< 60%)
    res_low = classifier_service.classify(image_bytes, confidence_override=0.42)
    assert res_low["confidence_tier"] == "LOW"
    assert res_low["auto_select"] is False
    assert res_low["recommended_action"] == "MANUAL_GRID_SELECT"
    assert res_low["logged_for_retraining"] is True
    assert len(res_low["grid_categories"]) == 9
    print("  ✓ Tier LOW (0.42) -> Action: MANUAL_GRID_SELECT, auto_select=False, logged_for_retraining=True")


def test_5_fastapi_multipart_upload():
    print("\n--- Test 5: FastAPI POST /classify via multipart/form-data ---")
    pcb_path = ASSETS_DIR / "pcb_motherboards.png"
    with open(pcb_path, "rb") as f:
        files = {"file": ("pcb.png", f, "image/png")}
        response = client.post("/classify", files=files)

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["status"] == "COMPLETED"
    assert body["data"]["top_category"] == "mat_pcb_high"
    assert body["data"]["confidence_tier"] in ["HIGH", "MEDIUM"]
    assert "spoken_announcements" in body["data"]
    print("  ✓ Multipart file upload succeeded (HTTP 200)")
    print("  ✓ Category:", body["data"]["category_name"], "Confidence:", body["data"]["confidence"])


def test_6_fastapi_base64_json():
    print("\n--- Test 6: FastAPI POST /classify via JSON base64 Payload ---")
    cable_path = ASSETS_DIR / "copper_cables_wire.png"
    b64_str = base64.b64encode(cable_path.read_bytes()).decode("utf-8")

    payload = {
        "image_base64": f"data:image/png;base64,{b64_str}",
        "confidence_override": 0.88
    }
    response = client.post("/classify", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["top_category"] == "mat_cables_copper"
    assert body["data"]["confidence"] == 0.88
    assert body["data"]["confidence_tier"] == "HIGH"
    print("  ✓ JSON Base64 upload succeeded (HTTP 200)")
    print("  ✓ Top Category:", body["data"]["top_category"], "Confidence:", body["data"]["confidence"])


def test_7_spoken_announcements_vernacular():
    print("\n--- Test 7: Vernacular Spoken Audio Strings (Hindi & Marathi) ---")
    pcb_path = ASSETS_DIR / "pcb_motherboards.png"
    res = classifier_service.classify(pcb_path.read_bytes(), confidence_override=0.89)

    hi = res["spoken_announcements"]["hi"]
    mr = res["spoken_announcements"]["mr"]
    assert len(hi) > 10
    assert len(mr) > 10
    assert "89%" in hi
    assert "89%" in mr
    print("  ✓ Hindi Spoken Text generated correctly")
    print("  ✓ Marathi Spoken Text generated correctly")


def test_8_grid_categories_completeness():
    print("\n--- Test 8: Pictorial Grid Completeness for Low-Literacy UI ---")
    res = classifier_service.classify(ASSETS_DIR.joinpath("crt_monitor_scrap.png").read_bytes())
    grid = res["grid_categories"]
    assert len(grid) == 9
    category_ids = {c["id"] for c in grid}
    expected_ids = {
        "mat_pcb_high", "mat_pcb_low", "mat_crt_monitor", "mat_lcd_panel",
        "mat_cables_copper", "mat_batteries_lead", "mat_batteries_li_ion",
        "mat_motors_magnets", "mat_mixed_plastics"
    }
    assert category_ids == expected_ids
    for item in grid:
        assert item["name_en"]
        assert item["name_hi"]
        assert item["name_mr"]
        assert item["pictorial_icon"]
    print("  ✓ All 9 CPCB categories present with EN, HI, MR labels and icons")


if __name__ == "__main__":
    print("=================================================================")
    print("Running Kabadiwala Connect Chunk 4 (ML Classifier) Test Suite")
    print("=================================================================")
    test_1_pcb_archetype_inference()
    test_2_copper_cables_inference()
    test_3_hazardous_material_and_warnings()
    test_4_confidence_tiers_human_in_the_loop()
    test_5_fastapi_multipart_upload()
    test_6_fastapi_base64_json()
    test_7_spoken_announcements_vernacular()
    test_8_grid_categories_completeness()
    print("\n=================================================================")
    print("🎉 ALL 8 TESTS PASSED! Chunk 4 ML Classifier Fully Verified!")
    print("=================================================================\n")
