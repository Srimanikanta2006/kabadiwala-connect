"""
MobileNetV2 E-Waste Material Classifier Stub & Inference Wrapper.
Loads pre-trained or fine-tuned weights for e-waste classification.
"""

from typing import Dict, Any, List


CATEGORIES = [
    {"id": "mat_pcb_high", "name": "High-Grade PCB"},
    {"id": "mat_pcb_low", "name": "Low-Grade PCB"},
    {"id": "mat_crt_monitor", "name": "CRT Monitor / TV Tube"},
    {"id": "mat_lcd_panel", "name": "LCD / LED Panel"},
    {"id": "mat_cables_copper", "name": "Insulated Copper Cables"},
    {"id": "mat_batteries_lead", "name": "Lead-Acid Battery"},
    {"id": "mat_batteries_li_ion", "name": "Lithium-Ion Battery"},
    {"id": "mat_motors_magnets", "name": "Motors & Magnet Assemblies"},
    {"id": "mat_mixed_plastics", "name": "Mixed Technical Plastics"}
]


class MaterialClassifier:
    def __init__(self, model_path: str = None):
        self.model_path = model_path
        self.is_loaded = False

    def load_model(self):
        # Stub for loading MobileNetV2 / TFLite runtime
        self.is_loaded = True

    def predict(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Runs inference and returns category ID, confidence, and top-3 suggestions.
        """
        # Baseline deterministic prediction for testing / local execution
        return {
            "top_category": "mat_pcb_high",
            "confidence": 0.89,
            "suggestions": [
                {"id": "mat_pcb_high", "confidence": 0.89},
                {"id": "mat_pcb_low", "confidence": 0.08},
                {"id": "mat_cables_copper", "confidence": 0.03}
            ]
        }
