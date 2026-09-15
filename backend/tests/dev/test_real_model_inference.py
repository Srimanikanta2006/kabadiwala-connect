"""
Verification tests for real MobileNetV2 E-Waste model loading and /classify endpoint integration.
"""

import io
from pathlib import Path
from PIL import Image
import pytest
from fastapi.testclient import TestClient

from main import app
from ml.classifier import MaterialClassifier, REAL_MODEL_PATH

client = TestClient(app)
BASE_DIR = Path(__file__).resolve().parent.parent
TEST_PCB_IMAGE = BASE_DIR / "datasets" / "real_ewaste" / "modified-dataset" / "test" / "PCB"

def test_1_real_model_file_exists_and_loads():
    """Verify that the real trained MobileNetV2 weights file exists and loads."""
    assert REAL_MODEL_PATH.exists(), f"Model file not found at {REAL_MODEL_PATH}"
    classifier = MaterialClassifier()
    assert classifier.pytorch_model is not None, "PyTorch model failed to initialize"
    assert len(classifier.pytorch_classes) == 10, f"Expected 10 classes, got {len(classifier.pytorch_classes)}"

def test_2_classify_real_image_returns_top3_predictions():
    """Verify that classifying a real test image returns top-3 predictions and valid category."""
    # Find a test image
    test_files = list(TEST_PCB_IMAGE.glob("*.jpg"))
    assert len(test_files) > 0, "No test PCB images found"
    img_bytes = test_files[0].read_bytes()

    res = client.post("/classify", files={"file": ("pcb_sample.jpg", img_bytes, "image/jpeg")})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

    # Check top-level contract
    assert "category" in data
    assert "confidence" in data
    assert "top_3_predictions" in data
    assert len(data["top_3_predictions"]) == 3

    # Check structure of top-3 predictions
    for pred in data["top_3_predictions"]:
        assert "category" in pred
        assert "confidence" in pred
        assert "category_name" in pred

def test_3_json_base64_returns_top3_predictions():
    """Verify base64 JSON payload also receives top_3_predictions."""
    img = Image.new("RGB", (224, 224), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    import base64
    b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")

    res = client.post("/classify", json={"image_base64": b64_str})
    assert res.status_code == 200
    data = res.json()
    assert "top_3_predictions" in data
    assert len(data["top_3_predictions"]) == 3
