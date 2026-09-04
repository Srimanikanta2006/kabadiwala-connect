-- ==============================================================================
-- KABADIWALA CONNECT (RE:LINK) - SUPABASE MASTER DATABASE SCHEMA
-- Models all 7 Core Datasets specified in the Problem Statement & Chunk 2
-- Includes Storage Bucket, RLS Policies, and Initial Seed Data
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. COLLECTORS TABLE (Minimal profile by design: no PII, DPDP 2023 compliant)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collectors (
    id TEXT PRIMARY KEY,                       -- e.g. 'col_8832a' or UUID
    preferred_language TEXT DEFAULT 'hi',      -- 'hi' (Hindi), 'mr' (Marathi), 'en' (English)
    general_location TEXT NOT NULL,            -- e.g. 'Dharavi, Mumbai', 'Kurla, Mumbai'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. MATERIALS TABLE (Standardized CPCB e-waste and recyclable scrap taxonomy)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
    id TEXT PRIMARY KEY,                       -- e.g. 'mat_pcb_high', 'mat_crt_monitor'
    category TEXT NOT NULL,                    -- 'PCB', 'DISPLAYS', 'CABLES', 'BATTERIES', 'MOTORS_MAGNETS', 'PLASTICS'
    sub_category TEXT NOT NULL,                -- e.g. 'High-Grade Motherboards'
    description TEXT,                          -- Human-readable description
    image_url TEXT,                            -- Icon or reference asset
    weight NUMERIC DEFAULT 1.0,                -- Standard unit weight baseline
    condition TEXT DEFAULT 'CLEAN_INTACT',     -- 'CLEAN_INTACT', 'DIRTY_MIXED', 'DAMAGED_BURNT'
    cpcb_e_waste_code TEXT NOT NULL,           -- e.g. 'ITEW1-PCB-HG', 'CEEW1-CRT'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. RECYCLERS TABLE (CPCB/SPCB authorized formal recyclers and facilities)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recyclers (
    id TEXT PRIMARY KEY,                       -- e.g. 'rec_ecorecycle_01'
    name TEXT NOT NULL,                        -- e.g. 'EcoRecycle India Pvt Ltd'
    cpcb_registration_no TEXT UNIQUE NOT NULL, -- Central Pollution Control Board registration
    location_lat NUMERIC NOT NULL,             -- Latitude
    location_lng NUMERIC NOT NULL,             -- Longitude
    address TEXT NOT NULL,                     -- Facility physical address
    materials_accepted JSONB DEFAULT '[]'::jsonb, -- Array of material IDs accepted
    authorization_status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED', 'EXPIRED'
    contact TEXT,                              -- Business phone/email
    offered_rates JSONB DEFAULT '{}'::jsonb,   -- { "mat_pcb_high": 255.0, ... }
    pickup_availability BOOLEAN DEFAULT FALSE, -- Offers doorstep vehicle pickup
    service_area TEXT DEFAULT 'Mumbai MMR',    -- Geographic coverage description
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. PRICES TABLE (Regional scrap mandi benchmark prices & historical trends)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    material_id TEXT REFERENCES public.materials(id) ON DELETE CASCADE,
    location TEXT NOT NULL,                    -- e.g. 'IN-MH-MUM' (Dharavi / Kurla Mandi)
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    buying_price NUMERIC NOT NULL,             -- Benchmark buying rate in ₹
    unit TEXT DEFAULT 'kg' NOT NULL,
    recycler_id TEXT REFERENCES public.recyclers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. MATERIAL LOTS TABLE (Digital lots created by collectors in the field)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.material_lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collector_id TEXT REFERENCES public.collectors(id) ON DELETE CASCADE,
    material_id TEXT REFERENCES public.materials(id) ON DELETE RESTRICT,
    material_category TEXT NOT NULL,
    approximate_weight NUMERIC NOT NULL,
    condition TEXT DEFAULT 'CLEAN_INTACT',
    quoted_price NUMERIC NOT NULL,
    image_url TEXT,                            -- Path inside 'lot-photos' bucket
    image_phash TEXT,                          -- 64-bit hash for duplicate detection
    ai_prediction JSONB,                       -- { "confidence": 0.92, "detected_id": "mat_pcb_high" }
    status TEXT DEFAULT 'CREATED',             -- 'CREATED', 'MATCHED', 'HANDED_OVER', 'CANCELLED'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. TRANSACTIONS TABLE (Settled transactions and collector earnings ledger)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_id UUID REFERENCES public.material_lots(id) ON DELETE RESTRICT,
    collector_id TEXT REFERENCES public.collectors(id) ON DELETE CASCADE,
    material_category TEXT NOT NULL,
    weight NUMERIC NOT NULL,
    quoted_price NUMERIC NOT NULL,
    final_price NUMERIC NOT NULL,
    recycler_id TEXT REFERENCES public.recyclers(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'COMPLETED',           -- 'PENDING', 'COMPLETED', 'DISPUTED'
    payment_status TEXT DEFAULT 'PAID_CASH_CONFIRMED', -- 'PAID_CASH_CONFIRMED', 'PAID_UPI_SUCCESS'
    payment_mode TEXT DEFAULT 'CASH',          -- 'CASH', 'UPI'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. TRACEABILITY TABLE (Verifiable handover record & CPCB EPR certificates)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.traceability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_id UUID REFERENCES public.material_lots(id) ON DELETE RESTRICT,
    photo_url TEXT,                            -- Photo proof at scale / weighbridge
    weight NUMERIC NOT NULL,                   -- Recycler verified actual weight
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    gps_lat NUMERIC NOT NULL,                  -- Handover coordinate
    gps_lng NUMERIC NOT NULL,
    handover_ref TEXT UNIQUE NOT NULL,         -- Unique human-verifiable reference token
    recycler_confirmation BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'VERIFIED',
    cpcb_certificate_id TEXT,                  -- Official EPR audit trail ID
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- STORAGE BUCKET: lot-photos
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('lot-photos', 'lot-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Public access policy for lot photos
CREATE POLICY "Public Access for lot-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'lot-photos');

CREATE POLICY "Allow Uploads to lot-photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lot-photos');

-- ==============================================================================
-- INITIAL SEED DATA (Ready for immediate testing in Supabase SQL Editor)
-- ==============================================================================

-- Seed 1: Minimal Collector Profile
INSERT INTO public.collectors (id, preferred_language, general_location)
VALUES 
    ('col_test_001', 'hi', 'Dharavi 13th Compound, Mumbai'),
    ('col_test_002', 'mr', 'Kurla West Scrap Market, Mumbai')
ON CONFLICT (id) DO NOTHING;

-- Seed 2: Core Materials
INSERT INTO public.materials (id, category, sub_category, description, image_url, weight, condition, cpcb_e_waste_code)
VALUES 
    ('mat_pcb_high', 'PCB', 'High-Grade PCB', 'Motherboards, RAM, and telecom cards with gold fingers', '/assets/icons/pcb_high.svg', 1.0, 'CLEAN_INTACT', 'ITEW1-PCB-HG'),
    ('mat_pcb_low', 'PCB', 'Low-Grade PCB', 'Single-sided power supply boards and brown phenolic sheets', '/assets/icons/pcb_low.svg', 1.0, 'CLEAN_INTACT', 'ITEW1-PCB-LG'),
    ('mat_crt_monitor', 'DISPLAYS', 'CRT Monitor / TV Tube', 'Bulky glass vacuum tubes containing leaded funnel glass', '/assets/icons/crt_tube.svg', 1.0, 'CLEAN_INTACT', 'CEEW1-CRT'),
    ('mat_lcd_panel', 'DISPLAYS', 'LCD/LED Display Panel', 'Flat screens with CCFL or LED backlights', '/assets/icons/lcd_panel.svg', 1.0, 'CLEAN_INTACT', 'CEEW1-FPD'),
    ('mat_cables_copper', 'CABLES', 'Insulated Copper Cables', 'Wiring harnesses, power cords, and telecom copper wires', '/assets/icons/cables_copper.svg', 1.0, 'CLEAN_INTACT', 'ITEW-CBL-CU'),
    ('mat_batteries_lead', 'BATTERIES', 'Lead-Acid Battery', 'Inverter, automotive, and UPS wet cells', '/assets/icons/batt_lead.svg', 1.0, 'CLEAN_INTACT', 'BATT-PB-ACID'),
    ('mat_batteries_li_ion', 'BATTERIES', 'Lithium-Ion Battery', 'Laptop batteries, phone pouch cells, and 18650 packs', '/assets/icons/batt_li_ion.svg', 1.0, 'CLEAN_INTACT', 'BATT-LI-ION')
ON CONFLICT (id) DO NOTHING;

-- Seed 3: Authorized Recyclers
INSERT INTO public.recyclers (id, name, cpcb_registration_no, location_lat, location_lng, address, materials_accepted, authorization_status, contact, offered_rates, pickup_availability, service_area)
VALUES 
    ('rec_ecorecycle_01', 'EcoRecycle India Pvt Ltd', 'CPCB/E-WASTE/REG/MH/2023/1042', 19.0550, 72.8710, 'Plot 42, Kurla Industrial Estate, Mumbai', '["mat_pcb_high", "mat_cables_copper", "mat_batteries_lead"]'::jsonb, 'ACTIVE', '+91-98201-44521', '{"mat_pcb_high": 255.0, "mat_cables_copper": 395.0, "mat_batteries_lead": 102.0}'::jsonb, true, 'Mumbai & Thane'),
    ('rec_greencircle_02', 'GreenCircle Urban Recyclers', 'CPCB/E-WASTE/REG/MH/2022/0891', 19.0410, 72.8620, '12 Dharavi Cross Road, Mumbai', '["mat_pcb_high", "mat_pcb_low", "mat_batteries_li_ion"]'::jsonb, 'ACTIVE', '+91-98205-77123', '{"mat_pcb_high": 248.0, "mat_pcb_low": 54.0, "mat_batteries_li_ion": 190.0}'::jsonb, false, 'Central Mumbai')
ON CONFLICT (id) DO NOTHING;

-- Seed 4: Daily Benchmark Prices
INSERT INTO public.prices (category, material_id, location, date, buying_price, unit, recycler_id)
VALUES 
    ('PCB', 'mat_pcb_high', 'IN-MH-MUM', CURRENT_DATE, 245.0, 'kg', 'rec_ecorecycle_01'),
    ('CABLES', 'mat_cables_copper', 'IN-MH-MUM', CURRENT_DATE, 380.0, 'kg', 'rec_ecorecycle_01'),
    ('BATTERIES', 'mat_batteries_lead', 'IN-MH-MUM', CURRENT_DATE, 98.0, 'kg', 'rec_ecorecycle_01'),
    ('BATTERIES', 'mat_batteries_li_ion', 'IN-MH-MUM', CURRENT_DATE, 185.0, 'kg', 'rec_greencircle_02');

-- Seed 5: Sample Material Lot
INSERT INTO public.material_lots (id, collector_id, material_id, material_category, approximate_weight, condition, quoted_price, image_url, image_phash, ai_prediction, status)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'col_test_001', 'mat_pcb_high', 'PCB', 14.5, 'CLEAN_INTACT', 3552.50, 'https://contribution.usercontent.google.com/sample_pcb.jpg', 'd8f0e4b8a1c2', '{"confidence": 0.92, "detected_id": "mat_pcb_high"}'::jsonb, 'CREATED')
ON CONFLICT (id) DO NOTHING;

-- Seed 6: Sample Transaction
INSERT INTO public.transactions (id, lot_id, collector_id, material_category, weight, quoted_price, final_price, recycler_id, status, payment_status, payment_mode)
VALUES 
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'col_test_001', 'PCB', 14.5, 3552.50, 3697.50, 'rec_ecorecycle_01', 'COMPLETED', 'PAID_CASH_CONFIRMED', 'CASH')
ON CONFLICT (id) DO NOTHING;

-- Seed 7: Sample Traceability Record
INSERT INTO public.traceability (id, lot_id, photo_url, weight, timestamp, gps_lat, gps_lng, handover_ref, recycler_confirmation, status, cpcb_certificate_id)
VALUES 
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://contribution.usercontent.google.com/sample_scale.jpg', 14.5, NOW(), 19.0550, 72.8710, 'KC-TRACE-2026-MH-8812', true, 'VERIFIED', 'EPR-CERT-MH-2026-9921')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- VERIFICATION QUERY (Run this after migration to verify all 7 datasets)
-- ==============================================================================
SELECT 'collectors' AS table_name, count(*) AS total_rows FROM public.collectors
UNION ALL
SELECT 'materials', count(*) FROM public.materials
UNION ALL
SELECT 'recyclers', count(*) FROM public.recyclers
UNION ALL
SELECT 'prices', count(*) FROM public.prices
UNION ALL
SELECT 'material_lots', count(*) FROM public.material_lots
UNION ALL
SELECT 'transactions', count(*) FROM public.transactions
UNION ALL
SELECT 'traceability', count(*) FROM public.traceability;
