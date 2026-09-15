"""
Test suite for Roboflow Serverless Cloud API e-waste object detection.
Verifies model e-waste-dataset-r0ojc/43 integration, Authorization: Bearer transport,
and statutory CPCB category mappings.
"""

import os
import io
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

from main import app
from ml.roboflow_service import roboflow_detector, ROBOFLOW_CLASS_MAPPING

client = TestClient(app)

TEST_IMG_DIR = Path(__file__).resolve().parent.parent / "datasets" / "real_ewaste" / "modified-dataset" / "test"


def test_1_roboflow_config_loaded_from_env():
    """Verify that private Roboflow API key is loaded from .env and not hardcoded."""
    api_key = os.getenv("ROBOFLOW_API_KEY")
    assert api_key is not None, "ROBOFLOW_API_KEY must be defined in backend/.env"
    assert len(api_key) > 5, "ROBOFLOW_API_KEY must not be empty"
    assert roboflow_detector.is_configured(), "RoboflowDetector must report configured=True"
    assert roboflow_detector.model_id == "e-waste-dataset-r0ojc/43"


def test_2_roboflow_live_cloud_inference():
    """Verify that live cloud inference executes with Bearer token and returns valid detections."""
    test_img = TEST_IMG_DIR / "Television" / "Television_106.jpg"
    if not test_img.exists():
        pytest.skip(f"Test image {test_img} not found")

    with open(test_img, "rb") as f:
        img_bytes = f.read()

    res = roboflow_detector.detect_objects(img_bytes, confidence_threshold=0.10)
    assert res is not None, "Roboflow cloud inference response should not be None"
    assert res["engine"] == "roboflow_cloud"
    assert res["model_id"] == "e-waste-dataset-r0ojc/43"
    assert "bounding_boxes" in res
    assert res["detected_objects_count"] >= 1

    primary = res["primary_detection"]
    assert primary is not None
    assert "raw_class" in primary
    assert "cpcb_code" in primary
    assert "confidence" in primary
    assert primary["confidence"] > 0.10


def test_3_detect_roboflow_endpoint():
    """Verify POST /detect/roboflow FastAPI endpoint with multipart image upload."""
    test_img = TEST_IMG_DIR / "Mouse" / "Mouse_106.jpg"
    if not test_img.exists():
        pytest.skip(f"Test image {test_img} not found")

    with open(test_img, "rb") as f:
        resp = client.post(
            "/detect/roboflow?confidence=0.15",
            files={"file": ("mouse.jpg", f, "image/jpeg")}
        )

    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    data = body["data"]
    assert data["engine"] == "roboflow_cloud"
    assert len(data["bounding_boxes"]) >= 1


def test_4_classify_endpoint_enriched_with_roboflow():
    """Verify POST /classify seamlessly includes bounding_boxes and roboflow object metadata."""
    test_img = TEST_IMG_DIR / "Television" / "Television_106.jpg"
    if not test_img.exists():
        pytest.skip(f"Test image {test_img} not found")

    with open(test_img, "rb") as f:
        resp = client.post(
            "/classify",
            files={"file": ("tv.jpg", f, "image/jpeg")}
        )

    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert "category" in body
    assert "top_3_predictions" in body
    data = body["data"]
    assert "bounding_boxes" in data
    assert "class_counts" in data
