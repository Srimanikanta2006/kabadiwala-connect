# Kabadiwala Connect (RE:LINK) - API Specification & Contracts
**Base URL:** `https://api.kabadiwalaconnect.org/api/v1`  
**Protocol:** HTTPS / JSON REST  
**Authentication:** Bearer JWT token (Optional for read-only price checks; required for handovers and sync)

---

## 1. Global Response Standards

### Success Wrapper
All standard successful responses return an HTTP `200` or `201` with:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-09-04T12:00:00Z"
}
```

### Standard Error Response Format
All errors return a machine-readable code accompanied by localized bilingual explanations (Hindi & Marathi) and an optional audio link for low-literacy users:
```json
{
  "success": false,
  "error_code": "WEIGHT_OUT_OF_BOUNDS",
  "message_en": "Entered weight (520 kg) exceeds plausible single-lot capacity for batteries.",
  "message_hi": "दर्ज किया गया वजन (520 किलो) बैटरी के लिए सामान्य सीमा से अधिक है। कृपया जांचें।",
  "message_mr": "नोंदवलेले वजन (520 किलो) बॅटरीसाठी सामान्य मर्यादेपेक्षा जास्त आहे. कृपया तपासा.",
  "audio_url": "https://api.kabadiwalaconnect.org/assets/audio/errors/err_weight_bounds.mp3",
  "details": {
    "field": "approximate_weight_kg",
    "entered_value": 520,
    "max_allowed_kg": 150
  },
  "timestamp": "2026-09-04T12:00:05Z"
}
```

---

## 2. Endpoints Matrix

### Endpoint 1: Retrieve Material Taxonomy
- **Route:** `GET /materials`
- **Description:** Returns the active material categories, visual icons, hazard warnings, and vernacular labels.
- **Request:** None
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "mat_pcb_high",
      "slug": "pcb-high-grade",
      "name_en": "High-Grade PCB",
      "name_hi": "हाई-ग्रेड सर्किट बोर्ड",
      "name_mr": "हाय-ग्रेड सर्किट बोर्ड",
      "hazard_level": "LOW",
      "cpcb_e_waste_code": "ITEW1-PCB-HG",
      "base_mandi_rate_range_inr": { "min": 180, "max": 320, "unit": "kg" },
      "pictorial_icon": "/assets/icons/pcb_high.svg"
    },
    {
      "id": "mat_batteries_lead",
      "slug": "batteries-lead-acid",
      "name_en": "Lead-Acid Battery",
      "name_hi": "लेड-एसिड बैटरी",
      "name_mr": "लेड-अ‍ॅसिड बॅटरी",
      "hazard_level": "HAZARDOUS",
      "cpcb_e_waste_code": "BATT-PB-ACID",
      "base_mandi_rate_range_inr": { "min": 85, "max": 115, "unit": "kg" },
      "pictorial_icon": "/assets/icons/batt_lead.svg"
    }
  ],
  "timestamp": "2026-09-04T12:00:00Z"
}
```

---

### Endpoint 2: Daily Mandi Price Benchmarks
- **Route:** `GET /prices/daily?region=IN-MH-MUM`
- **Description:** Returns cached daily benchmark prices and regional market trends for Dharavi/Kurla scrap markets.
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "region_code": "IN-MH-MUM",
    "effective_date": "2026-09-04T06:00:00Z",
    "prices": [
      {
        "material_id": "mat_pcb_high",
        "base_rate_per_kg": 245.00,
        "fair_range_min": 230.00,
        "fair_range_max": 265.00,
        "daily_trend": "UP (+2.1%)"
      },
      {
        "material_id": "mat_cables_copper",
        "base_rate_per_kg": 380.00,
        "fair_range_min": 360.00,
        "fair_range_max": 405.00,
        "daily_trend": "STABLE"
      }
    ]
  },
  "timestamp": "2026-09-04T12:00:00Z"
}
```

---

### Endpoint 3: Calculate Fair Valuation
- **Route:** `POST /valuation/calculate`
- **Description:** Computes transparent estimated price range based on weight, condition, and mandi cache.
- **Request Payload:**
```json
{
  "material_id": "mat_pcb_high",
  "weight_kg": 14.5,
  "condition": "CLEAN_INTACT",
  "region_code": "IN-MH-MUM"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "material_id": "mat_pcb_high",
    "weight_kg": 14.5,
    "calculated_rate_per_kg": 245.00,
    "estimated_total_range_inr": {
      "min_inr": 3335.00,
      "max_inr": 3842.50
    },
    "spoken_summary_hi": "चौदह दशमलव पाँच किलो हाई-ग्रेड पीसीबी का अनुमानित मूल्य तैंतीस सौ पैंतीस से अड़तीस सौ बयालीस रुपये है।",
    "spoken_summary_mr": "चौदा पूर्णांक पाच किलो हाय-ग्रेड पीसीबीचे अंदाजे मूल्य तेहतीसशे पस्तीस ते अडतीसशे बेचाळीस रुपये आहे.",
    "audio_tts_url": "/assets/audio/generated/val_4981a.mp3"
  },
  "timestamp": "2026-09-04T12:00:00Z"
}
```

---

### Endpoint 4: Intelligent Recycler Matching & Ranking
- **Route:** `POST /recyclers/match`
- **Description:** Runs Multi-Criteria Decision Analysis (MCDA) to rank authorized CPCB recyclers for a collector's lot.
- **Request Payload:**
```json
{
  "material_id": "mat_pcb_high",
  "weight_kg": 14.5,
  "collector_location": {
    "latitude": 19.0435,
    "longitude": 72.8567
  },
  "require_pickup": false
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "ranked_recyclers": [
      {
        "rank": 1,
        "recycler_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "facility_name": "EcoRecycle India Pvt Ltd",
        "cpcb_reg_no": "CPCB/E-WASTE/REG/MH/2023/1042",
        "cpcb_status": "ACTIVE",
        "distance_km": 3.8,
        "offered_rate_per_kg": 255.00,
        "estimated_payout_inr": 3697.50,
        "badge_highlight": "HIGHEST_PAYOUT",
        "badge_text_hi": "सबसे ज़्यादा भाव (₹255/किग्रा)",
        "badge_text_mr": "सर्वाधिक भाव (₹255/किलो)",
        "pickup_available": true,
        "payment_modes_supported": ["CASH", "UPI"]
      },
      {
        "rank": 2,
        "recycler_id": "4e73b4d1-81f3-42e1-a083-d92e5912bb20",
        "facility_name": "GreenCircle Urban Recyclers",
        "cpcb_reg_no": "CPCB/E-WASTE/REG/MH/2022/0891",
        "cpcb_status": "ACTIVE",
        "distance_km": 1.4,
        "offered_rate_per_kg": 248.00,
        "estimated_payout_inr": 3596.00,
        "badge_highlight": "NEAREST_FACILITY",
        "badge_text_hi": "सबसे नज़दीकी केंद्र (1.4 किमी)",
        "badge_text_mr": "सर्वात जवळचे केंद्र (1.4 किमी)",
        "pickup_available": false,
        "payment_modes_supported": ["CASH", "UPI"]
      }
    ]
  },
  "timestamp": "2026-09-04T12:00:00Z"
}
```

---

### Endpoint 5: Offline Sync Batch Upload
- **Route:** `POST /sync/batch`
- **Description:** Uploads queued offline records (created lots, handovers, and AI user-correction feedback) when internet connectivity resumes.
- **Request Payload:** See [`sync_batch.schema.json`](../schemas/sync_batch.schema.json).
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "batch_id": "c71a39f1-d009-4e01-9011-827a4b08ef91",
    "processed_lots": 3,
    "processed_handovers": 2,
    "user_corrections_logged": 1,
    "status": "ALL_SYNCHRONIZED"
  },
  "timestamp": "2026-09-04T12:00:00Z"
}
```

---

### Endpoint 6: Verify Handover & Release Payment
- **Route:** `POST /handover/verify`
- **Description:** Authorized recycler scans collector's QR token, enters verified scale weight, and triggers instant settlement.
- **Request Payload:**
```json
{
  "lot_id": "fa1298c1-192a-4318-b80c-992a76db209e",
  "qr_payload_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "verified_weight_kg": 14.6,
  "recycler_photo_weighbridge_url": "https://storage.kabadiwalaconnect.org/proofs/wb_9921.jpg",
  "agreed_rate_per_kg": 255.00,
  "payment_mode": "CASH"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "tx_4910283b_8911",
    "settled_amount_inr": 3723.00,
    "cpcb_traceability_number": "EPR-TRACE-2026-09-04-MH-88192",
    "payment_status": "PAID_CASH_CONFIRMED",
    "digital_receipt_url": "https://receipts.kabadiwalaconnect.org/tx_4910283b_8911.pdf"
  },
  "timestamp": "2026-09-04T12:00:00Z"
}
```
