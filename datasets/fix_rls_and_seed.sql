-- ==============================================================================
-- KABADIWALA CONNECT (RE:LINK) - SUPABASE POLICIES, STORAGE & SEED SCRIPT
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Disable RLS or grant open access for Hackathon prototype tables
ALTER TABLE IF EXISTS public.collectors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recyclers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.material_lots DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.traceability DISABLE ROW LEVEL SECURITY;

-- 2. Create the Storage Bucket: lot-photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lot-photos', 'lot-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if any, then recreate
DROP POLICY IF EXISTS "Public Select lot-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert lot-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Update lot-photos" ON storage.objects;

CREATE POLICY "Public Select lot-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'lot-photos');

CREATE POLICY "Public Insert lot-photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lot-photos');

CREATE POLICY "Public Update lot-photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lot-photos');

-- 3. Seed Initial Data into all 7 Tables

-- A. Collectors
INSERT INTO public.collectors (id, preferred_language, general_location)
VALUES 
    ('col_test_001', 'hi', 'Dharavi 13th Compound, Mumbai'),
    ('col_test_002', 'mr', 'Kurla West Scrap Market, Mumbai')
ON CONFLICT (id) DO NOTHING;

-- B. Materials
INSERT INTO public.materials (id, category, sub_category, description, image_url, weight, condition, cpcb_e_waste_code)
VALUES 
    ('mat_pcb_high', 'PCB', 'High-Grade PCB', 'Motherboards, RAM, and telecom cards with gold fingers', '/assets/icons/pcb_high.svg', 1.0, 'CLEAN_INTACT', 'ITEW1-PCB-HG'),
    ('mat_pcb_low', 'PCB', 'Low-Grade PCB', 'Single-sided power supply boards and brown phenolic sheets', '/assets/icons/pcb_low.svg', 1.0, 'CLEAN_INTACT', 'ITEW1-PCB-LG'),
    ('mat_crt_monitor', 'DISPLAYS', 'CRT Monitor / TV Tube', 'Bulky glass vacuum tubes containing leaded funnel glass', '/assets/icons/crt_tube.svg', 1.0, 'CLEAN_INTACT', 'CEEW1-CRT'),
    ('mat_lcd_panel', 'DISPLAYS', 'LCD/LED Display Panel', 'Flat screens with CCFL or LED backlights', '/assets/icons/lcd_panel.svg', 1.0, 'CLEAN_INTACT', 'CEEW1-FPD'),
    ('mat_cables_copper', 'CABLES', 'Insulated Copper Cables', 'Wiring harnesses, power cords, and telecom copper wires', '/assets/icons/cables_copper.svg', 1.0, 'CLEAN_INTACT', 'ITEW-CBL-CU'),
    ('mat_batteries_lead', 'BATTERIES', 'Lead-Acid Battery', 'Inverter, automotive, and UPS wet cells', '/assets/icons/batt_lead.svg', 1.0, 'CLEAN_INTACT', 'BATT-PB-ACID'),
    ('mat_batteries_li_ion', 'BATTERIES', 'Lithium-Ion Battery', 'Laptop batteries, phone pouch cells, and 18650 packs', '/assets/icons/batt_li_ion.svg', 1.0, 'CLEAN_INTACT', 'BATT-LI-ION'),
    ('mat_motors_magnets', 'MOTORS_MAGNETS', 'Motors & Magnets', 'Compressors, fan motors, hard drive neodymium assemblies', '/assets/icons/motor_magnets.svg', 1.0, 'CLEAN_INTACT', 'ITEW-MTR-MAG'),
    ('mat_mixed_plastics', 'PLASTICS', 'Mixed Engineering Plastics', 'ABS, HIPS, PC casing from old printers and computer monitors', '/assets/icons/plastics_mixed.svg', 1.0, 'CLEAN_INTACT', 'PLAST-ENG-MIX')
ON CONFLICT (id) DO NOTHING;

-- C. Recyclers
INSERT INTO public.recyclers (id, name, cpcb_registration_no, location_lat, location_lng, address, materials_accepted, authorization_status, contact, offered_rates, pickup_availability, service_area)
VALUES 
    ('rec_ecorecycle_01', 'EcoRecycle India Pvt Ltd', 'CPCB/E-WASTE/REG/MH/2023/1042', 19.0550, 72.8710, 'Plot 42, Kurla Industrial Estate, Mumbai', '["mat_pcb_high", "mat_cables_copper", "mat_batteries_lead"]'::jsonb, 'ACTIVE', '+91-98201-44521', '{"mat_pcb_high": 255.0, "mat_cables_copper": 395.0, "mat_batteries_lead": 102.0}'::jsonb, true, 'Mumbai & Thane'),
    ('rec_greencircle_02', 'GreenCircle Urban Recyclers', 'CPCB/E-WASTE/REG/MH/2022/0891', 19.0410, 72.8620, '12 Dharavi Cross Road, Mumbai', '["mat_pcb_high", "mat_pcb_low", "mat_batteries_li_ion"]'::jsonb, 'ACTIVE', '+91-98205-77123', '{"mat_pcb_high": 248.0, "mat_pcb_low": 54.0, "mat_batteries_li_ion": 190.0}'::jsonb, false, 'Central Mumbai')
ON CONFLICT (id) DO NOTHING;

-- D. Prices
INSERT INTO public.prices (category, material_id, location, date, buying_price, unit, recycler_id)
VALUES 
    ('PCB', 'mat_pcb_high', 'IN-MH-MUM', CURRENT_DATE, 245.0, 'kg', 'rec_ecorecycle_01'),
    ('CABLES', 'mat_cables_copper', 'IN-MH-MUM', CURRENT_DATE, 380.0, 'kg', 'rec_ecorecycle_01'),
    ('BATTERIES', 'mat_batteries_lead', 'IN-MH-MUM', CURRENT_DATE, 98.0, 'kg', 'rec_ecorecycle_01'),
    ('BATTERIES', 'mat_batteries_li_ion', 'IN-MH-MUM', CURRENT_DATE, 185.0, 'kg', 'rec_greencircle_02');

-- E. Material Lots
INSERT INTO public.material_lots (id, collector_id, material_id, material_category, approximate_weight, condition, quoted_price, image_url, image_phash, ai_prediction, status)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'col_test_001', 'mat_pcb_high', 'PCB', 14.5, 'CLEAN_INTACT', 3552.50, 'lot-photos/sample_pcb.jpg', 'd8f0e4b8a1c2', '{"confidence": 0.92, "detected_id": "mat_pcb_high"}'::jsonb, 'CREATED')
ON CONFLICT (id) DO NOTHING;

-- F. Transactions
INSERT INTO public.transactions (id, lot_id, collector_id, material_category, weight, quoted_price, final_price, recycler_id, status, payment_status, payment_mode)
VALUES 
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'col_test_001', 'PCB', 14.5, 3552.50, 3697.50, 'rec_ecorecycle_01', 'COMPLETED', 'PAID_CASH_CONFIRMED', 'CASH')
ON CONFLICT (id) DO NOTHING;

-- G. Traceability
INSERT INTO public.traceability (id, lot_id, photo_url, weight, timestamp, gps_lat, gps_lng, handover_ref, recycler_confirmation, status, cpcb_certificate_id)
VALUES 
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'lot-photos/sample_scale.jpg', 14.5, NOW(), 19.0550, 72.8710, 'KC-TRACE-2026-MH-8812', true, 'VERIFIED', 'EPR-CERT-MH-2026-9921')
ON CONFLICT (id) DO NOTHING;

-- 4. Verification Count
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
