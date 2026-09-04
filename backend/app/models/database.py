"""
SQLAlchemy Database Models for Kabadiwala Connect (RE:LINK).
Supports PostgreSQL for Cloud Backend and SQLite for Local Edge/Testing.
"""

from datetime import datetime
import uuid
from sqlalchemy import (
    Column, String, Float, Integer, Boolean, DateTime, ForeignKey, JSON, Enum, Text
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Material(Base):
    __tablename__ = "materials"

    id = Column(String(64), primary_key=True)  # e.g., "mat_pcb_high"
    slug = Column(String(128), unique=True, nullable=False)
    name_en = Column(String(256), nullable=False)
    name_hi = Column(String(256), nullable=False)
    name_mr = Column(String(256), nullable=False)
    parent_category = Column(String(64), nullable=False)
    hazard_level = Column(String(32), default="LOW")
    cpcb_e_waste_code = Column(String(64), nullable=False)
    base_mandi_min_inr = Column(Float, nullable=False)
    base_mandi_max_inr = Column(Float, nullable=False)
    unit = Column(String(16), default="kg")
    pictorial_icon = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    lots = relationship("MaterialLot", back_populates="material")
    prices = relationship("PriceIndex", back_populates="material")


class PriceIndex(Base):
    __tablename__ = "price_indices"

    price_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    material_id = Column(String(64), ForeignKey("materials.id"), nullable=False)
    region_code = Column(String(32), nullable=False, index=True)  # e.g., "IN-MH-MUM"
    base_mandi_buy_rate_per_kg = Column(Float, nullable=False)
    fair_range_min_per_kg = Column(Float, nullable=False)
    fair_range_max_per_kg = Column(Float, nullable=False)
    daily_delta_percentage = Column(Float, default=0.0)
    benchmark_source = Column(String(128), default="Mandi Bulletin")
    effective_date = Column(DateTime, default=datetime.utcnow)

    material = relationship("Material", back_populates="prices")


class Recycler(Base):
    __tablename__ = "recyclers"

    recycler_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    facility_name = Column(String(256), nullable=False)
    cpcb_registration_no = Column(String(128), unique=True, nullable=False)
    authorization_status = Column(String(32), default="ACTIVE")
    valid_upto = Column(DateTime, nullable=True)
    contact_phone = Column(String(32), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address_text = Column(Text, nullable=False)
    city = Column(String(128), nullable=False)
    state = Column(String(128), nullable=False)
    accepted_materials = Column(JSON, default=list)  # List of material_ids
    offered_rates = Column(JSON, default=dict)  # {material_id: rate_inr}
    service_radius_km = Column(Float, default=25.0)
    pickup_available = Column(Boolean, default=False)
    min_pickup_weight_kg = Column(Float, default=20.0)
    fulfillment_rating = Column(Float, default=4.5)
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="recycler")


class MaterialLot(Base):
    __tablename__ = "material_lots"

    lot_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    collector_id = Column(String(64), nullable=False, index=True)
    material_id = Column(String(64), ForeignKey("materials.id"), nullable=False)
    approximate_weight_kg = Column(Float, nullable=False)
    condition_rating = Column(String(32), default="CLEAN_INTACT")
    image_url = Column(String(512), nullable=True)
    image_phash = Column(String(64), nullable=True, index=True)
    ai_predicted_material_id = Column(String(64), nullable=True)
    ai_confidence_score = Column(Float, nullable=True)
    user_corrected = Column(Boolean, default=False)
    estimated_val_min = Column(Float, nullable=False)
    estimated_val_max = Column(Float, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    sync_status = Column(String(32), default="LOCAL_PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)

    material = relationship("Material", back_populates="lots")
    handover = relationship("TraceabilityRecord", back_populates="lot", uselist=False)
    transaction = relationship("Transaction", back_populates="lot", uselist=False)


class TraceabilityRecord(Base):
    __tablename__ = "traceability_records"

    traceability_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lot_id = Column(String(36), ForeignKey("material_lots.lot_id"), unique=True, nullable=False)
    collector_id = Column(String(64), nullable=False)
    recycler_id = Column(String(36), ForeignKey("recyclers.recycler_id"), nullable=False)
    handover_timestamp = Column(DateTime, default=datetime.utcnow)
    handover_lat = Column(Float, nullable=False)
    handover_lng = Column(Float, nullable=False)
    collector_photo_proof_url = Column(String(512), nullable=True)
    recycler_weighbridge_photo_url = Column(String(512), nullable=True)
    verified_weight_kg = Column(Float, nullable=False)
    qr_signature = Column(String(256), nullable=False)
    cpcb_epr_certificate_ref = Column(String(128), nullable=True)

    lot = relationship("MaterialLot", back_populates="handover")


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lot_id = Column(String(36), ForeignKey("material_lots.lot_id"), unique=True, nullable=False)
    collector_id = Column(String(64), nullable=False, index=True)
    recycler_id = Column(String(36), ForeignKey("recyclers.recycler_id"), nullable=False)
    quoted_estimate_inr = Column(Float, nullable=False)
    final_settled_amount_inr = Column(Float, nullable=False)
    payment_mode = Column(String(32), default="CASH")  # CASH or UPI
    payment_status = Column(String(32), default="PAID_CASH_CONFIRMED")
    upi_transaction_ref = Column(String(128), nullable=True)
    settled_at = Column(DateTime, default=datetime.utcnow)
    collector_receipt_number = Column(String(64), nullable=True)

    lot = relationship("MaterialLot", back_populates="transaction")
    recycler = relationship("Recycler", back_populates="transactions")


class AITrainingSample(Base):
    __tablename__ = "ai_training_samples"

    sample_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    image_storage_path = Column(String(512), nullable=False)
    image_phash = Column(String(64), nullable=True)
    ground_truth_label = Column(String(64), nullable=False)
    ai_initial_prediction = Column(String(64), nullable=True)
    was_corrected_by_user = Column(Boolean, default=False)
    dataset_split = Column(String(16), default="TRAIN")
    verified_by_expert = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
