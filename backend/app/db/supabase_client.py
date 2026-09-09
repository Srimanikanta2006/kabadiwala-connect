"""
Supabase Client Wrapper for Kabadiwala Connect (RE:LINK).
Handles database operations with automatic fallback to local seed data
when running offline or before Supabase credentials are configured.
"""

import os
import json
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

try:
    from supabase import create_client, Client
except ImportError:
    Client = None
    create_client = None

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

_supabase_client: Optional[Any] = None


def get_supabase() -> Optional[Any]:
    """Returns the initialized Supabase client, or None if credentials are missing."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if SUPABASE_URL and SUPABASE_KEY and create_client:
        try:
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            return _supabase_client
        except Exception as e:
            print(f"[Supabase] Connection error: {e}. Falling back to local data.")
            return None
    return None


def get_materials() -> List[Dict[str, Any]]:
    """Fetches material taxonomy from Supabase, or local seed file if offline."""
    client = get_supabase()
    if client:
        try:
            res = client.table("materials").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"[Supabase] Error fetching materials: {e}")

    # Local fallback
    seed_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "datasets", "seed_materials.json")
    if os.path.exists(seed_path):
        with open(seed_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


CANONICAL_DEMO_FACILITIES: List[Dict[str, Any]] = [
    {
        "id": "rec_ecorecycle_01",
        "name": "EcoRecycle India Pvt Ltd (Ecoreco)",
        "facility_name": "EcoRecycle India Pvt Ltd (Ecoreco)",
        "cpcb_registration_no": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032",
        "statutory_reference": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032",
        "authorizing_agency": "Maharashtra Pollution Control Board (MPCB)",
        "statutory_authorization_status": "Authorised under E-Waste (Management) Rules",
        "authorization_status": "ACTIVE",
        "is_cpcb_authorized": True,
        "facility_type": "Authorised E-Waste Recycler",
        "installed_capacity_mta": 12000.0,
        "state_or_ut": "Maharashtra",
        "state_code": "MH",
        "location_lat": 19.0550,
        "location_lng": 72.8710,
        "address": "Eco House, Western Express Highway, Goregaon East / Dharavi Hub, Mumbai",
        "materials_accepted": [
            "mat_pcb_high", "mat_pcb_low", "mat_cables_copper", "mat_batteries_lead",
            "mat_batteries_li_ion", "mat_crt_monitor", "mat_lcd_panel", "mat_motors_magnets", "mat_mixed_plastics"
        ],
        "contact": {"phone": "+91-22-4005-2900", "email": "info@ecoreco.com"},
        "offered_rates": {
            "mat_pcb_high": 255.0, "mat_pcb_low": 58.0, "mat_cables_copper": 395.0,
            "mat_batteries_lead": 105.0, "mat_batteries_li_ion": 190.0, "mat_crt_monitor": 16.0,
            "mat_lcd_panel": 45.0, "mat_motors_magnets": 75.0, "mat_mixed_plastics": 30.0
        },
        "pickup_availability": True,
        "service_area": "Greater Mumbai & Thane"
    },
    {
        "id": "rec_greencircle_02",
        "name": "GreenCircle Urban Recyclers",
        "facility_name": "GreenCircle Urban Recyclers",
        "cpcb_registration_no": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/019",
        "statutory_reference": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/019",
        "authorizing_agency": "Maharashtra Pollution Control Board (MPCB)",
        "statutory_authorization_status": "Authorised under E-Waste (Management) Rules",
        "authorization_status": "ACTIVE",
        "is_cpcb_authorized": True,
        "facility_type": "Authorised E-Waste Recycler",
        "installed_capacity_mta": 6000.0,
        "state_or_ut": "Maharashtra",
        "state_code": "MH",
        "location_lat": 19.0410,
        "location_lng": 72.8620,
        "address": "Mahim East Industrial Zone, Dharavi Junction, Mumbai",
        "materials_accepted": ["mat_pcb_high", "mat_pcb_low", "mat_cables_copper", "mat_mixed_plastics", "mat_motors_magnets"],
        "contact": {"phone": "+91-22-2407-1122", "email": "contact@greencircle.org.in"},
        "offered_rates": {
            "mat_pcb_high": 248.0, "mat_pcb_low": 54.0, "mat_cables_copper": 385.0,
            "mat_mixed_plastics": 32.0, "mat_motors_magnets": 74.0
        },
        "pickup_availability": False,
        "service_area": "Dharavi, Sion, Kurla"
    },
    {
        "id": "rec_cerebra_03",
        "name": "Cerebra Integrated Technologies Ltd",
        "facility_name": "Cerebra Integrated Technologies Ltd",
        "cpcb_registration_no": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/044",
        "statutory_reference": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/044",
        "authorizing_agency": "Maharashtra Pollution Control Board (MPCB)",
        "statutory_authorization_status": "Authorised under E-Waste (Management) Rules",
        "authorization_status": "ACTIVE",
        "is_cpcb_authorized": True,
        "facility_type": "Authorised E-Waste Recycler",
        "installed_capacity_mta": 15000.0,
        "state_or_ut": "Maharashtra",
        "state_code": "MH",
        "location_lat": 19.0820,
        "location_lng": 73.0150,
        "address": "TTC Industrial Area, MIDC Turbhe, Navi Mumbai",
        "materials_accepted": ["mat_pcb_high", "mat_pcb_low", "mat_crt_monitor", "mat_lcd_panel", "mat_cables_copper", "mat_batteries_li_ion"],
        "contact": {"phone": "+91-22-2763-8800", "email": "ewaste@cerebracomputers.com"},
        "offered_rates": {
            "mat_pcb_high": 260.0, "mat_pcb_low": 60.0, "mat_crt_monitor": 18.0,
            "mat_lcd_panel": 48.0, "mat_cables_copper": 390.0, "mat_batteries_li_ion": 195.0
        },
        "pickup_availability": True,
        "service_area": "Navi Mumbai, Raigad, Mumbai"
    },
    {
        "id": "rec_greenscape_04",
        "name": "Greenscape Eco Management Pvt Ltd",
        "facility_name": "Greenscape Eco Management Pvt Ltd",
        "cpcb_registration_no": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/028",
        "statutory_reference": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/028",
        "authorizing_agency": "Maharashtra Pollution Control Board (MPCB)",
        "statutory_authorization_status": "Authorised under E-Waste (Management) Rules",
        "authorization_status": "ACTIVE",
        "is_cpcb_authorized": True,
        "facility_type": "Authorised E-Waste Recycler",
        "installed_capacity_mta": 8000.0,
        "state_or_ut": "Maharashtra",
        "state_code": "MH",
        "location_lat": 19.0280,
        "location_lng": 73.1180,
        "address": "Taloja MIDC, Navi Mumbai",
        "materials_accepted": ["mat_batteries_lead", "mat_batteries_li_ion", "mat_motors_magnets", "mat_mixed_plastics"],
        "contact": {"phone": "+91-22-2741-2300", "email": "info@greenscape.com"},
        "offered_rates": {
            "mat_batteries_lead": 102.0, "mat_batteries_li_ion": 185.0,
            "mat_motors_magnets": 72.0, "mat_mixed_plastics": 28.0
        },
        "pickup_availability": True,
        "service_area": "Navi Mumbai, Panvel, Thane"
    },
    {
        "id": "rec_envirocare_05",
        "name": "Enviro-Care Recycling Pvt Ltd",
        "facility_name": "Enviro-Care Recycling Pvt Ltd",
        "cpcb_registration_no": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/011",
        "statutory_reference": "Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/011",
        "authorizing_agency": "Maharashtra Pollution Control Board (MPCB)",
        "statutory_authorization_status": "Authorised under E-Waste (Management) Rules",
        "authorization_status": "ACTIVE",
        "is_cpcb_authorized": True,
        "facility_type": "Authorised E-Waste Recycler",
        "installed_capacity_mta": 5000.0,
        "state_or_ut": "Maharashtra",
        "state_code": "MH",
        "location_lat": 18.6298,
        "location_lng": 73.8131,
        "address": "Bhosari MIDC, Pune",
        "materials_accepted": ["mat_cables_copper", "mat_batteries_lead", "mat_batteries_li_ion"],
        "contact": {"phone": "+91-20-2712-4500", "email": "info@envirocare.in"},
        "offered_rates": {
            "mat_cables_copper": 388.0, "mat_batteries_lead": 108.0, "mat_batteries_li_ion": 192.0
        },
        "pickup_availability": True,
        "service_area": "Pune, Pimpri-Chinchwad, MMR"
    }
]


def _merge_canonical_demo(facilities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Appends canonical demo facilities if not already in the list."""
    existing_ids = {f.get("id") for f in facilities}
    result = list(facilities)
    for demo in CANONICAL_DEMO_FACILITIES:
        if demo["id"] not in existing_ids:
            result.append(demo)
    return result


def get_recyclers() -> List[Dict[str, Any]]:
    """Fetches authorized CPCB recyclers from local seed file (569 facilities) or Supabase, plus canonical demo accounts."""
    seed_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "datasets", "seed_recyclers.json")
    if os.path.exists(seed_path):
        try:
            with open(seed_path, "r", encoding="utf-8") as f:
                seed_data = json.load(f)
                if seed_data and len(seed_data) >= 500:
                    return _merge_canonical_demo(seed_data)
        except Exception as e:
            print(f"[Seed] Error reading seed_recyclers.json: {e}")

    client = get_supabase()
    if client:
        try:
            res = client.table("recyclers").select("*").execute()
            if res.data:
                return _merge_canonical_demo(res.data)
        except Exception as e:
            print(f"[Supabase] Error fetching recyclers: {e}")

    if os.path.exists(seed_path):
        try:
            with open(seed_path, "r", encoding="utf-8") as f:
                return _merge_canonical_demo(json.load(f))
        except Exception:
            pass
    return list(CANONICAL_DEMO_FACILITIES)


def get_prices(location: str = "IN-MH-MUM") -> List[Dict[str, Any]]:
    """Fetches prices from Supabase, or local seed file if offline."""
    client = get_supabase()
    if client:
        try:
            res = client.table("prices").select("*").eq("location", location).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"[Supabase] Error fetching prices: {e}")

    # Local fallback
    seed_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "datasets", "seed_prices.json")
    if os.path.exists(seed_path):
        with open(seed_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("prices", [])
    return []


def insert_lot(lot_data: Dict[str, Any]) -> Dict[str, Any]:
    """Inserts a new material lot into Supabase, or returns simulated confirmation."""
    client = get_supabase()
    if client:
        try:
            res = client.table("material_lots").insert(lot_data).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"[Supabase] Error inserting lot: {e}")
    return {"status": "LOCAL_SAVED", "data": lot_data}
