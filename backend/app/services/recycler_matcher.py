"""
Service wrapper for Recycler Matcher.
Re-exports canonical MCDA ranking from matching.engine.
"""

from matching.engine import (
    match_and_rank_recyclers,
    haversine_distance_km,
    load_all_recyclers
)

__all__ = [
    "match_and_rank_recyclers",
    "haversine_distance_km",
    "load_all_recyclers"
]
