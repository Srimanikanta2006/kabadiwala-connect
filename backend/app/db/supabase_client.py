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


def get_recyclers() -> List[Dict[str, Any]]:
    """Fetches authorized recyclers from Supabase, or local seed file if offline."""
    client = get_supabase()
    if client:
        try:
            res = client.table("recyclers").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"[Supabase] Error fetching recyclers: {e}")

    # Local fallback
    seed_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "datasets", "seed_recyclers.json")
    if os.path.exists(seed_path):
        with open(seed_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


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
