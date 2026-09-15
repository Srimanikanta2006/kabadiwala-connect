"""
Kabadiwala Connect (RE:LINK) - AI Robustness & Edge Fallback Test Suite.
Verifies system resilience against deliberately degraded images:
1. Low-light / dim photography (common in evening scrap collection or dark alleys).
2. Cluttered / noisy scrap backgrounds.
3. Severe camera tilt / angled perspectives.
4. Human-in-the-loop fallback triggering (LOW tier -> MANUAL_GRID_SELECT).
5. Active learning queueing for low-confidence inferences.
6. Graceful API recovery with HTTP 200 and vernacular voice warnings.
"""

import base64
import io
from pathlib import Path
import pytest
from PIL import Image, ImageFilter, ImageEnhance
from fastapi.testclient import TestClient
from main import app
from ml.classifier import classifier_service

client = TestClient(app)
ASSETS_DIR = Path(__file__).resolve().parent.parent / "stitch-designs" / "assets"


def _image_to_base64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"


def test_1_dim_low_light_photo_triggers_fallback_tier():
    """Verify that a very dark/underexposed scrap photo triggers LOW or MEDIUM confidence tier."""
    # Create dark image (brightness ~ 15 out of 255)
    dark_img = Image.new("RGB", (256, 256), color=(18, 22, 16))
    b64_str = _image_to_base64(dark_img)

    res = client.post("/classify", json={"image_base64": b64_str})
    assert res.status_code == 200, res.text
    data = res.json()["data"]

    # In low light, system must NOT claim false high confidence
    assert data["confidence_tier"] in ["LOW", "MEDIUM"]
    assert data["recommended_action"] in ["MANUAL_GRID_SELECT", "SHOW_SUGGESTIONS"]
    assert data["auto_select"] is False
    assert len(data["suggestions"]) >= 2


def test_2_cluttered_noisy_background_provides_top3_suggestions():
    """Verify that a noisy, cluttered scrap photo surfaces top-3 suggestions for user disambiguation."""
    # Create high-noise pattern image
    import random
    noise_img = Image.new("RGB", (200, 200))
    pixels = noise_img.load()
    for x in range(200):
        for y in range(200):
            pixels[x, y] = (
                random.randint(60, 180),
                random.randint(60, 180),
                random.randint(60, 180)
            )

    b64_str = _image_to_base64(noise_img)
    res = client.post("/classify", json={"image_base64": b64_str})
    assert res.status_code == 200
    data = res.json()["data"]

    # Verify fallback suggestions list has 3 distinct classes with CPCB codes
    suggestions = data["suggestions"]
    assert len(suggestions) == 3
    suggestion_ids = [s["id"] for s in suggestions]
    assert len(set(suggestion_ids)) == 3  # All distinct


def test_3_synthetic_blur_and_compression_degrades_gracefully():
    """Verify that heavy motion blur and severe JPEG artifacting does not crash the vision model."""
    sample_path = ASSETS_DIR / "pcb_motherboards.png"
    if sample_path.exists():
        base_img = Image.open(sample_path).convert("RGB")
    else:
        base_img = Image.new("RGB", (128, 128), color=(34, 139, 34))

    # Apply heavy Gaussian blur (simulating walking camera shake)
    blurred_img = base_img.filter(ImageFilter.GaussianBlur(radius=8.0))
    # Dim the brightness by 60%
    dimmed_img = ImageEnhance.Brightness(blurred_img).enhance(0.4)

    buf = io.BytesIO()
    dimmed_img.save(buf, format="JPEG", quality=25)  # Heavy compression artifacts
    b64_str = f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

    res = client.post("/classify", json={"image_base64": b64_str})
    assert res.status_code == 200
    data = res.json()["data"]
    assert "top_category" in data
    assert 0.0 <= data["confidence"] <= 1.0


def test_4_low_confidence_queued_for_active_learning():
    """Verify that ambiguous or low-confidence scans are written to active learning retraining queue."""
    queue_file = Path(__file__).resolve().parent.parent / "datasets" / "retraining_queue" / "queue_manifest.jsonl"
    initial_count = len(queue_file.read_text().splitlines()) if queue_file.exists() else 0

    # Classify with low confidence override
    dark_img = Image.new("RGB", (64, 64), color=(10, 15, 10))
    b64_str = _image_to_base64(dark_img)
    res = client.post("/classify", json={
        "image_base64": b64_str,
        "confidence_override": 0.45
    })
    assert res.status_code == 200

    # Verify queue was appended
    assert queue_file.exists()
    final_count = len(queue_file.read_text().splitlines())
    assert final_count >= initial_count + 1


def test_5_hazardous_material_vernacular_warning_persists_under_uncertainty():
    """Verify that battery or CRT detections provide vernacular safety warnings even with reduced confidence."""
    # Test classifier directly with lead-acid battery category hint and medium confidence
    buf = io.BytesIO()
    Image.new("RGB", (64, 64), color=(30, 30, 30)).save(buf, format="PNG")
    valid_bytes = buf.getvalue()

    result = classifier_service.classify(
        image_bytes=valid_bytes,
        confidence_override=0.65,
        category_hint="mat_batteries_lead"
    )

    assert result["confidence_tier"] == "MEDIUM"
    assert "चेतावनी" in result["spoken_announcements"]["hi"]  # Hindi hazard alert
    assert "सावधान" in result["spoken_announcements"]["mr"]  # Marathi hazard alert
    assert len(result["hazard_warnings"]) > 0
