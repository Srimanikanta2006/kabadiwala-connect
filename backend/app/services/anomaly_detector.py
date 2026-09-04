"""
Transaction Anomaly & Fraud Detection Engine (Service Facade).
Delegates directly to canonical `anomaly.detector` module.
"""

from typing import Dict, Any, List, Optional
from anomaly.detector import (
    MATERIAL_WEIGHT_BOUNDS,
    check_weight_bounds,
    check_weight_plausibility,
    check_duplicate_image,
    check_price_outlier,
    check_submission_velocity,
    evaluate_lot_anomaly,
    hamming_distance
)

__all__ = [
    "MATERIAL_WEIGHT_BOUNDS",
    "check_weight_bounds",
    "check_weight_plausibility",
    "check_duplicate_image",
    "check_price_outlier",
    "check_submission_velocity",
    "evaluate_lot_anomaly",
    "hamming_distance"
]
