"""
Pydantic Validation Schemas for Kabadiwala Connect (RE:LINK).
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address_text: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None


class MandiRange(BaseModel):
    min: float
    max: float
    unit: str = "kg"


class MaterialSchema(BaseModel):
    id: str
    slug: str
    name_en: str
    name_hi: str
    name_mr: str
    parent_category: str
    hazard_level: str
    cpcb_e_waste_code: str
    base_mandi_rate_range_inr: MandiRange
    pictorial_icon: Optional[str] = None


class ValuationRequest(BaseModel):
    material_id: str
    weight_kg: float = Field(..., gt=0)
    condition: str = "CLEAN_INTACT"
    region_code: str = "IN-MH-MUM"


class ValuationResponseData(BaseModel):
    material_id: str
    weight_kg: float
    calculated_rate_per_kg: float
    estimated_total_range_inr: Dict[str, float]
    spoken_summary_hi: str
    spoken_summary_mr: str
    audio_tts_url: Optional[str] = None


class RecyclerMatchRequest(BaseModel):
    material_id: str
    weight_kg: float = Field(..., gt=0)
    collector_location: Location
    require_pickup: bool = False


class RecyclerMatchItem(BaseModel):
    rank: int
    recycler_id: str
    facility_name: str
    cpcb_reg_no: str
    cpcb_status: str
    distance_km: float
    offered_rate_per_kg: float
    estimated_payout_inr: float
    badge_highlight: str
    badge_text_hi: str
    badge_text_mr: str
    pickup_available: bool
    payment_modes_supported: List[str]


class HandoverVerificationRequest(BaseModel):
    lot_id: str
    qr_payload_token: str
    verified_weight_kg: float = Field(..., gt=0)
    recycler_photo_weighbridge_url: Optional[str] = None
    agreed_rate_per_kg: float = Field(..., gt=0)
    payment_mode: str = "CASH"


class HandoverVerificationResponse(BaseModel):
    transaction_id: str
    settled_amount_inr: float
    cpcb_traceability_number: str
    payment_status: str
    digital_receipt_url: Optional[str] = None


class OfflineSyncBatchRequest(BaseModel):
    client_id: str
    batch_id: str
    timestamp: datetime
    lots: List[Dict[str, Any]] = []
    handover_records: List[Dict[str, Any]] = []
    user_feedback_corrections: List[Dict[str, Any]] = []
