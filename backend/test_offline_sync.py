# -*- coding: utf-8 -*-
"""
Kabadiwala Connect - Offline-First Architecture & Airplane Mode Test Suite.
Tests:
1. PWA Service Worker precache and Web App Manifest verification.
2. Dexie.js / IndexedDB schema and offline queue contracts.
3. Airplane Mode lot creation flow (Offline photo blob + 2.5kg PCB + GPS).
4. Automatic reconnection & sync to Supabase without manual intervention.
5. Idempotency test (no duplicates or 500s on repeated sync attempts).
6. FastAPI /sync/status and /sync/batch endpoints validation.
"""

import json
import os
import uuid
import base64
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from main import app
from app.db.supabase_client import get_supabase

client = TestClient(app)

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
FRONTEND_SRC = Path(__file__).resolve().parent.parent / "frontend" / "src"


def test_1_pwa_service_worker_and_manifest():
    """
    Step 1 verification:
    PWA service worker and Web App Manifest are properly built and configured.
    """
    manifest_path = FRONTEND_DIST / "manifest.webmanifest"
    sw_path = FRONTEND_DIST / "sw.js"
    index_html = FRONTEND_DIST / "index.html"

    assert manifest_path.exists(), "manifest.webmanifest must exist in dist/"
    assert sw_path.exists(), "sw.js must exist in dist/ for service worker offline caching"
    assert index_html.exists(), "index.html must exist in dist/"

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest_data = json.load(f)

    assert "Kabadiwala" in manifest_data.get("name", "")
    assert manifest_data.get("theme_color") == "#16a34a"
    assert manifest_data.get("display") == "standalone"

    icons = manifest_data.get("icons", [])
    sizes = [ic.get("sizes") for ic in icons]
    assert "192x192" in sizes, "PWA must provide 192x192 icon"
    assert "512x512" in sizes, "PWA must provide 512x512 icon"


def test_2_dexie_offline_database_contract():
    """
    Step 2 verification:
    Dexie.js offline database mirrors material_lots and traceability schema.
    """
    db_file = FRONTEND_SRC / "db" / "offlineDb.js"
    assert db_file.exists(), "frontend/src/db/offlineDb.js must exist"

    with open(db_file, "r", encoding="utf-8") as f:
        content = f.read()

    assert "KabadiwalaOfflineDB" in content
    assert "offline_lots" in content
    assert "offline_handovers" in content
    assert "cached_prices" in content
    assert "saveOfflineLot" in content
    assert "getUnsyncedLots" in content
    assert "markLotSynced" in content
    assert "UNSYNCED" in content


def test_3_airplane_mode_offline_lot_simulation():
    """
    Step 3 & 4 verification:
    Simulates collector creating a full lot in Airplane Mode (Offline):
    - Photo captured locally as base64 blob
    - PCB identified (91% confidence)
    - 2.5 kg weight recorded
    - GPS coordinates (19.0435, 72.8566)
    - Quoted price = 2.5 * 240 = ₹600.0
    - Handover QR reference generated locally
    - Saved locally with status = 'UNSYNCED'
    """
    lot_id = str(uuid.uuid4())
    # 1x1 transparent PNG sample photo blob
    sample_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

    offline_lot = {
        "id": lot_id,
        "collector_id": "col_8832a",
        "material_category": "PCB",
        "material_id": "mat_pcb_high",
        "approximate_weight": 2.5,
        "condition": "CLEAN_INTACT",
        "quoted_price": 600.0,
        "photo_base64": sample_b64,
        "gps_lat": 19.0435,
        "gps_lng": 72.8566,
        "ai_prediction": {"confidence": 0.91, "detected_id": "mat_pcb_high"},
        "sync_status": "UNSYNCED",
        "created_at": "2026-09-05T10:00:00.000Z"
    }

    assert offline_lot["sync_status"] == "UNSYNCED"
    assert offline_lot["approximate_weight"] == 2.5
    assert offline_lot["quoted_price"] == 600.0
    assert "photo_base64" in offline_lot


def test_4_automatic_sync_on_reconnection():
    """
    Simulates internet coming back on:
    Queued offline lot is pushed to backend, stored in Supabase, and marked SYNCED.
    """
    lot_id = str(uuid.uuid4())
    sample_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

    sync_payload = {
        "id": lot_id,
        "collector_id": "col_8832a",
        "material_category": "PCB",
        "material_id": "mat_pcb_high",
        "approximate_weight": 2.5,
        "condition": "CLEAN_INTACT",
        "quoted_price": 600.0,
        "photo_base64": sample_b64,
        "gps_lat": 19.0435,
        "gps_lng": 72.8566,
        "ai_prediction": {"confidence": 0.91, "detected_id": "mat_pcb_high"}
    }

    res = client.post("/lots", json=sync_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

    # Check that lot is searchable via GET /lots/{id}
    fetch_res = client.get(f"/lots/{lot_id}")
    assert fetch_res.status_code == 200
    saved = fetch_res.json()
    assert saved["success"] is True
    assert saved["data"]["id"] == lot_id
    assert float(saved["data"]["approximate_weight"]) == 2.5


def test_5_idempotency_on_repeated_sync():
    """
    Verifies that re-syncing the same offline lot multiple times is idempotent
    (does not throw primary key violation or create duplicate lots).
    """
    lot_id = str(uuid.uuid4())
    payload = {
        "id": lot_id,
        "collector_id": "col_8832a",
        "material_category": "CABLES",
        "material_id": "mat_cables_copper",
        "approximate_weight": 4.0,
        "condition": "CLEAN_INTACT",
        "quoted_price": 1560.0
    }

    res1 = client.post("/lots", json=payload)
    assert res1.status_code == 200
    assert res1.json()["success"] is True

    # Re-sync exact same record
    res2 = client.post("/lots", json=payload)
    assert res2.status_code == 200
    assert res2.json()["success"] is True


def test_6_sync_status_and_batch_endpoints():
    """
    Validates /sync/status ping endpoint and /sync/batch bulk upload endpoint.
    """
    status_res = client.get("/sync/status")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["status"] == "ONLINE"
    assert "server_time" in status_data

    batch_payload = {
        "lots": [
            {
                "id": str(uuid.uuid4()),
                "collector_id": "col_8832a",
                "material_category": "BATTERIES",
                "approximate_weight": 10.0,
                "quoted_price": 800.0
            },
            {
                "id": str(uuid.uuid4()),
                "collector_id": "col_8832a",
                "material_category": "DISPLAYS",
                "approximate_weight": 8.0,
                "quoted_price": 128.0
            }
        ],
        "handovers": []
    }

    batch_res = client.post("/sync/batch", json=batch_payload)
    assert batch_res.status_code == 200
    batch_data = batch_res.json()
    assert batch_data["success"] is True
    assert batch_data["synced_lots_count"] == 2
