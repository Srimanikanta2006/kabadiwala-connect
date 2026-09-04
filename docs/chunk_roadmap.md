# Project Implementation Chunks & Roadmap
**System:** Kabadiwala Connect (RE:LINK)  
**Architecture:** React PWA + FastAPI + Supabase/SQLite + Dexie.js + Leaflet.js + Bhashini/i18next + MobileNetV2

---

## Chunk Overview & Execution Plan

### Chunk 1: Foundation & Repository Skeleton (Current)
- **Goal:** Set up modular project structure, React PWA scaffold (Vite), Python virtual environment, FastAPI hello-world server, seed datasets, and git baseline.
- **Verification:**
  - `npm start` in `/frontend` runs React development server.
  - `uvicorn main:app --reload` in `/backend` serves `GET /` with `{"message": "Hello World"}`.
  - Initial repository skeleton committed and pushed to GitHub.

---

### Chunk 2: Supabase / Database Engine & Seed Data
- **Goal:** Configure database schemas, relational migrations, and load all 7 structured datasets.
- **Deliverables:**
  - Materials, Recyclers, Daily Prices, Lots, Handover/Traceability, Ledger, and AI samples.
  - Supabase client integration + local SQLite edge fallback.

---

### Chunk 3: Offline Storage & PWA Client Shell
- **Goal:** Implement offline-first local database and vernacular shell on the React PWA.
- **Deliverables:**
  - IndexedDB via Dexie.js for offline lot queuing and photo storage.
  - Service worker caching for 100% offline shell loading.
  - i18next configuration for Marathi, Hindi, and English instant UI text switching.
  - Bhashini / Web Speech API integration for audio readouts.

---

### Chunk 4: Collector Mobile Workflows (Stitch Integration)
- **Goal:** Build the collector-facing mobile UI using the Stitch prototypes.
- **Deliverables:**
  - Collector Home (daily rate ticker, lot creation CTA, audio guide).
  - Material Scanner viewfinder with confidence scoring badges.
  - 6-tile pictorial category grid fallback.
  - Fair Price Discovery board with Mandi rate ranges.
  - Offline signed QR code generator for physical handover.
  - My Earnings financial ledger.

---

### Chunk 5: Authorized Recycler Web Portal
- **Goal:** Build the desktop/tablet interface for CPCB-authorized recyclers.
- **Deliverables:**
  - Daily buyback price broadcaster per material category.
  - Incoming lots review and pickup dispatcher.
  - Handover QR scanner & weighbridge actual weight entry.
  - Instant CPCB EPR compliance traceability certificate generation.

---

### Chunk 6: Machine Learning Pipeline & Anomaly Guard
- **Goal:** Fine-tune MobileNetV2 for scrap classification and deploy fraud detection.
- **Deliverables:**
  - Transfer learning script fine-tuning MobileNetV2 on e-waste classes.
  - TFLite / ONNX quantization pipeline (<8MB).
  - Physical weight bounds and rate outlier checks.
  - Perceptual image hashing (pHash) to detect duplicate lot uploads.

---

### Chunk 7: Field Research, Unit Economics & Final Integration
- **Goal:** Ground the project in real-world validation and commercial viability.
- **Deliverables:**
  - Field research transcripts & workflow analysis of 2 working scrap dealers.
  - Unit economics model comparing informal vs. platform earnings (+20-30% uplift).
  - End-to-end integration test from lot capture to recycler EPR settlement.
