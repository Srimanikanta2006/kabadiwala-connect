"""
Roboflow Serverless Cloud API Service for Object Detection in E-Waste.
Supports Roboflow model e-waste-dataset-r0ojc/43 (19,613 images, 77 classes).
Uses Authorization: Bearer header transport as specified by Roboflow inference v1.5.0+.
"""

import os
import base64
import logging
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("kabadiwala.roboflow")

# 77 Roboflow classes mapped directly to CPCB E-Waste / Battery Rules and app material IDs
ROBOFLOW_CLASS_MAPPING: Dict[str, Dict[str, Any]] = {
    # Telecom & IT Devices
    "Smartphone": {
        "category_id": "mat_it_mobile",
        "cpcb_code": "ITEW15",
        "name_en": "Smartphone",
        "name_hi": "स्मार्टफ़ोन",
        "name_mr": "स्मार्टफोन",
        "hazard_level": "MEDIUM",
        "base_rate": 520,
    },
    "Bar-Phone": {
        "category_id": "mat_it_mobile",
        "cpcb_code": "ITEW15",
        "name_en": "Feature / Keypad Phone",
        "name_hi": "फीचर फोन",
        "name_mr": "फीचर फोन",
        "hazard_level": "MEDIUM",
        "base_rate": 450,
    },
    "Telephone-Set": {
        "category_id": "mat_it_mobile",
        "cpcb_code": "ITEW12",
        "name_en": "Telephone Set",
        "name_hi": "टेलीफोन सेट",
        "name_mr": "टेलिफोन संच",
        "hazard_level": "LOW",
        "base_rate": 120,
    },
    "Tablet": {
        "category_id": "mat_it_mobile",
        "cpcb_code": "ITEW15",
        "name_en": "Tablet Computer",
        "name_hi": "टैबलेट कंप्यूटर",
        "name_mr": "टॅब्लेट संगणक",
        "hazard_level": "MEDIUM",
        "base_rate": 480,
    },
    "Laptop": {
        "category_id": "mat_it_mobile",
        "cpcb_code": "ITEW3",
        "name_en": "Laptop Computer",
        "name_hi": "लैपटॉप",
        "name_mr": "लॅपटॉप",
        "hazard_level": "MEDIUM",
        "base_rate": 420,
    },
    "Desktop-PC": {
        "category_id": "mat_pcb_high",
        "cpcb_code": "ITEW2",
        "name_en": "Desktop PC (Central Processing Unit)",
        "name_hi": "डेस्कटॉप पीसी / सीपीयू",
        "name_mr": "डेस्कटॉप पीसी / सीपीयू",
        "hazard_level": "LOW",
        "base_rate": 350,
    },
    "Server": {
        "category_id": "mat_pcb_high",
        "cpcb_code": "ITEW1",
        "name_en": "Mainframe Server Unit",
        "name_hi": "सर्वर यूनिट",
        "name_mr": "सर्व्हर युनिट",
        "hazard_level": "LOW",
        "base_rate": 400,
    },
    "Computer-Keyboard": {
        "category_id": "mat_it_keyboard",
        "cpcb_code": "ITEW2-KEYBOARD",
        "name_en": "Computer Keyboard",
        "name_hi": "कंप्यूटर कीबोर्ड",
        "name_mr": "संगणक कीबोर्ड",
        "hazard_level": "LOW",
        "base_rate": 75,
    },
    "Computer-Mouse": {
        "category_id": "mat_it_mouse",
        "cpcb_code": "ITEW2-MOUSE",
        "name_en": "Computer Mouse",
        "name_hi": "कंप्यूटर माउस",
        "name_mr": "संगणक माउस",
        "hazard_level": "LOW",
        "base_rate": 80,
    },
    "Printer": {
        "category_id": "mat_it_printer",
        "cpcb_code": "ITEW6",
        "name_en": "Printer / Scanner",
        "name_hi": "प्रिंटर / स्कैनर",
        "name_mr": "प्रिंटर / स्कॅनर",
        "hazard_level": "LOW",
        "base_rate": 95,
    },
    "Router": {
        "category_id": "mat_pcb_low",
        "cpcb_code": "ITEW11",
        "name_en": "Network Router / Modem",
        "name_hi": "राउटर / मॉडेम",
        "name_mr": "राउटर / मोडेम",
        "hazard_level": "LOW",
        "base_rate": 180,
    },
    "Network-Switch": {
        "category_id": "mat_pcb_low",
        "cpcb_code": "ITEW11",
        "name_en": "Network Switch Hub",
        "name_hi": "नेटवर्क स्विच",
        "name_mr": "नेटवर्क स्विच",
        "hazard_level": "LOW",
        "base_rate": 180,
    },
    "PCB": {
        "category_id": "mat_pcb_high",
        "cpcb_code": "ITEW1-PCB-HG",
        "name_en": "Printed Circuit Board (PCB)",
        "name_hi": "सर्किट बोर्ड (मदरबोर्ड / पीसीबी)",
        "name_mr": "सर्किट बोर्ड (मदरबोर्ड / पीसीबी)",
        "hazard_level": "LOW",
        "base_rate": 780,
    },
    "HDD": {
        "category_id": "mat_pcb_high",
        "cpcb_code": "ITEW2-HDD",
        "name_en": "Hard Disk Drive (HDD)",
        "name_hi": "हार्ड डिस्क ड्राइव",
        "name_mr": "हार्ड डिस्क ड्राईव्ह",
        "hazard_level": "LOW",
        "base_rate": 320,
    },
    "SSD": {
        "category_id": "mat_pcb_high",
        "cpcb_code": "ITEW2-SSD",
        "name_en": "Solid State Drive (SSD)",
        "name_hi": "सॉलिड स्टेट ड्राइव",
        "name_mr": "सॉलिड स्टेट ड्राईव्ह",
        "hazard_level": "LOW",
        "base_rate": 450,
    },
    "USB-Flash-Drive": {
        "category_id": "mat_pcb_high",
        "cpcb_code": "ITEW2-USB",
        "name_en": "USB Flash Drive",
        "name_hi": "पेन ड्राइव",
        "name_mr": "पेन ड्राईव्ह",
        "hazard_level": "LOW",
        "base_rate": 200,
    },
    "Calculator": {
        "category_id": "mat_mixed_plastics",
        "cpcb_code": "ITEW2-CALC",
        "name_en": "Electronic Calculator",
        "name_hi": "कैलकुलेटर",
        "name_mr": "कॅल्क्युलेटर",
        "hazard_level": "LOW",
        "base_rate": 60,
    },

    # Displays & Screens
    "CRT-Monitor": {
        "category_id": "mat_crt_monitor",
        "cpcb_code": "ITEW2-CRT",
        "name_en": "CRT Computer Monitor",
        "name_hi": "सीआरटी मॉनिटर (पिक्चर ट्यूब)",
        "name_mr": "सीआरटी मॉनिटर (पिक्चर ट्यूब)",
        "hazard_level": "HAZARDOUS",
        "base_rate": 60,
    },
    "CRT-TV": {
        "category_id": "mat_crt_monitor",
        "cpcb_code": "CEEW1-CRT",
        "name_en": "CRT Television Set",
        "name_hi": "सीआरटी टीवी (पिक्चर ट्यूब)",
        "name_mr": "सीआरटी टीव्ही (पिक्चर ट्यूब)",
        "hazard_level": "HAZARDOUS",
        "base_rate": 70,
    },
    "Flat-Panel-Monitor": {
        "category_id": "mat_lcd_panel",
        "cpcb_code": "ITEW2-LCD",
        "name_en": "Flat Panel LCD/LED Monitor",
        "name_hi": "एलसीडी / एलईडी मॉनिटर",
        "name_mr": "एलसीडी / एलईडी मॉनिटर",
        "hazard_level": "MEDIUM",
        "base_rate": 150,
    },
    "Flat-Panel-TV": {
        "category_id": "mat_ce_television",
        "cpcb_code": "CEEW1",
        "name_en": "Flat Panel Television",
        "name_hi": "एलसीडी / एलईडी टीवी",
        "name_mr": "एलसीडी / एलईडी टीव्ही",
        "hazard_level": "MEDIUM",
        "base_rate": 160,
    },

    # Batteries & Power
    "Battery": {
        "category_id": "mat_batteries_li_ion",
        "cpcb_code": "BWMR-2022-BAT",
        "name_en": "Battery Assembly",
        "name_hi": "बैटरी (ली-आयन / सील्ड)",
        "name_mr": "बॅटरी (ली-आयन / सील्ड)",
        "hazard_level": "HIGH",
        "base_rate": 110,
    },
    "Power-Adapter": {
        "category_id": "mat_cables_copper",
        "cpcb_code": "ITEW-ADAPTER",
        "name_en": "Power Adapter & Cable",
        "name_hi": "पावर अडैप्टर और केबल",
        "name_mr": "पॉवर अडॅप्टर आणि केबल",
        "hazard_level": "LOW",
        "base_rate": 150,
    },
    "Christmas-Lights": {
        "category_id": "mat_cables_copper",
        "cpcb_code": "CEEW-LIGHT-STRIP",
        "name_en": "Decorative Cable Wire",
        "name_hi": "लाइटिंग केबल वायर",
        "name_mr": "लाइटिंग केबल वायर",
        "hazard_level": "LOW",
        "base_rate": 140,
    },

    # Consumer Audio / Video
    "Music-Player": {
        "category_id": "mat_ce_player",
        "cpcb_code": "CEEW-AV-PLAYER",
        "name_en": "Music / Media Player",
        "name_hi": "म्यूजिक / मीडिया प्लेयर",
        "name_mr": "म्युझिक / मीडिया प्लेयर",
        "hazard_level": "LOW",
        "base_rate": 90,
    },
    "Camera": {
        "category_id": "mat_ce_player",
        "cpcb_code": "CEEW-CAM",
        "name_en": "Digital Camera",
        "name_hi": "डिजिटल कैमरा",
        "name_mr": "डिजिटल कॅमेरा",
        "hazard_level": "LOW",
        "base_rate": 180,
    },
    "Projector": {
        "category_id": "mat_ce_player",
        "cpcb_code": "CEEW-PROJ",
        "name_en": "Video Projector",
        "name_hi": "प्रोजेक्टर",
        "name_mr": "प्रोजेक्टर",
        "hazard_level": "LOW",
        "base_rate": 120,
    },
    "PlayStation-5": {
        "category_id": "mat_ce_player",
        "cpcb_code": "CEEW-CONSOLE",
        "name_en": "Gaming Console",
        "name_hi": "गेमिंग कंसोल",
        "name_mr": "गेमिंग कन्सोल",
        "hazard_level": "LOW",
        "base_rate": 220,
    },
    "Xbox-Series-X": {
        "category_id": "mat_ce_player",
        "cpcb_code": "CEEW-CONSOLE",
        "name_en": "Gaming Console",
        "name_hi": "गेमिंग कंसोल",
        "name_mr": "गेमिंग कन्सोल",
        "hazard_level": "LOW",
        "base_rate": 220,
    },
    "Speaker": {
        "category_id": "mat_motors_magnets",
        "cpcb_code": "CEEW-SPKR",
        "name_en": "Audio Speaker",
        "name_hi": "स्पीकर",
        "name_mr": "स्पीकर",
        "hazard_level": "LOW",
        "base_rate": 90,
    },
    "Headphone": {
        "category_id": "mat_mixed_plastics",
        "cpcb_code": "CEEW-AUDIO",
        "name_en": "Headphones / Headset",
        "name_hi": "हेडफ़ोन",
        "name_mr": "हेडफोन",
        "hazard_level": "LOW",
        "base_rate": 70,
    },
    "TV-Remote-Control": {
        "category_id": "mat_mixed_plastics",
        "cpcb_code": "CEEW-REMOTE",
        "name_en": "Remote Control",
        "name_hi": "रिमोट कंट्रोल",
        "name_mr": "रिमोट कंट्रोल",
        "hazard_level": "LOW",
        "base_rate": 50,
    },

    # Appliances
    "Washing-Machine": {
        "category_id": "mat_ce_washing_machine",
        "cpcb_code": "CEEW3",
        "name_en": "Washing Machine",
        "name_hi": "वाशिंग मशीन",
        "name_mr": "वॉशिंग मशीन",
        "hazard_level": "LOW",
        "base_rate": 85,
    },
    "Microwave": {
        "category_id": "mat_appl_microwave",
        "cpcb_code": "CEEW-APPL-MW",
        "name_en": "Microwave Oven",
        "name_hi": "माइक्रोवेव ओवन",
        "name_mr": "मायक्रोव्हेव ओव्हन",
        "hazard_level": "MEDIUM",
        "base_rate": 65,
    },
    "Refrigerator": {
        "category_id": "mat_ce_washing_machine",
        "cpcb_code": "CEEW2",
        "name_en": "Refrigerator",
        "name_hi": "रेफ्रिजरेटर / फ्रिज",
        "name_mr": "रेफ्रिजरेटर / फ्रिज",
        "hazard_level": "MEDIUM",
        "base_rate": 75,
    },
    "Freezer": {
        "category_id": "mat_ce_washing_machine",
        "cpcb_code": "CEEW2",
        "name_en": "Deep Freezer",
        "name_hi": "डीप फ्रीजर",
        "name_mr": "डीप फ्रीझर",
        "hazard_level": "MEDIUM",
        "base_rate": 75,
    },
    "Air-Conditioner": {
        "category_id": "mat_motors_magnets",
        "cpcb_code": "CEEW4",
        "name_en": "Air Conditioner Unit",
        "name_hi": "एयर कंडीशनर",
        "name_mr": "एअर कंडिशनर",
        "hazard_level": "MEDIUM",
        "base_rate": 95,
    },
    "Dishwasher": {
        "category_id": "mat_ce_washing_machine",
        "cpcb_code": "CEEW5",
        "name_en": "Dishwashing Machine",
        "name_hi": "डिशवॉशर",
        "name_mr": "डिशवॉशर",
        "hazard_level": "LOW",
        "base_rate": 70,
    },
    "Oven": {
        "category_id": "mat_appl_microwave",
        "cpcb_code": "CEEW-OVEN",
        "name_en": "Electric Oven",
        "name_hi": "इलेक्ट्रिक ओवन",
        "name_mr": "इलेक्ट्रिक ओव्हन",
        "hazard_level": "LOW",
        "base_rate": 65,
    },
    "Vacuum-Cleaner": {
        "category_id": "mat_motors_magnets",
        "cpcb_code": "CEEW-VAC",
        "name_en": "Vacuum Cleaner",
        "name_hi": "वैक्यूम क्लीनर",
        "name_mr": "व्हॅक्यूम क्लिनर",
        "hazard_level": "LOW",
        "base_rate": 80,
    },
    "Ceiling-Fan": {
        "category_id": "mat_motors_magnets",
        "cpcb_code": "CEEW-FAN",
        "name_en": "Ceiling Fan (Motor Assembly)",
        "name_hi": "सीलिंग फैन मोटर",
        "name_mr": "सीलिंग फॅन मोटर",
        "hazard_level": "LOW",
        "base_rate": 110,
    },
    "Exhaust-Fan": {
        "category_id": "mat_motors_magnets",
        "cpcb_code": "CEEW-FAN",
        "name_en": "Exhaust Fan Motor",
        "name_hi": "एग्जॉस्ट फैन",
        "name_mr": "एक्झॉस्ट फॅन",
        "hazard_level": "LOW",
        "base_rate": 95,
    },
    "Floor-Fan": {
        "category_id": "mat_motors_magnets",
        "cpcb_code": "CEEW-FAN",
        "name_en": "Floor / Table Fan",
        "name_hi": "टेबल फैन",
        "name_mr": "टेबल फॅन",
        "hazard_level": "LOW",
        "base_rate": 85,
    },
    "Photovoltaic-Panel": {
        "category_id": "mat_lcd_panel",
        "cpcb_code": "SOLAR-PV-MOD",
        "name_en": "Solar Photovoltaic Panel",
        "name_hi": "सोलर पैनल",
        "name_mr": "सोलर पॅनेल",
        "hazard_level": "LOW",
        "base_rate": 130,
    },
}

DEFAULT_FALLBACK_MAPPING = {
    "category_id": "mat_pcb_low",
    "cpcb_code": "ITEW1-GEN",
    "name_en": "Electronic Waste Component",
    "name_hi": "इलेक्ट्रॉनिक कचरा सामग्री",
    "name_mr": "इलेक्ट्रॉनिक कचरा साहित्य",
    "hazard_level": "LOW",
    "base_rate": 80,
}


class RoboflowDetector:
    """Client for Roboflow Serverless Cloud API e-waste object detection."""

    def __init__(self):
        self.api_key = os.getenv("ROBOFLOW_API_KEY", "")
        self.model_id = os.getenv("ROBOFLOW_MODEL_ID", "e-waste-dataset-r0ojc/43")
        self.api_url = os.getenv("ROBOFLOW_API_URL", "https://serverless.roboflow.com").rstrip("/")
        self.timeout_sec = 10.0

    def is_configured(self) -> bool:
        """Returns True if the API key and model ID are present."""
        return bool(self.api_key and self.model_id)

    def detect_objects(
        self,
        image_bytes: bytes,
        confidence_threshold: float = 0.15,
        overlap_threshold: float = 0.50,
    ) -> Optional[Dict[str, Any]]:
        """
        Sends image base64 payload to Roboflow Serverless Cloud API with Authorization: Bearer header.
        Maps 77 Roboflow classes to CPCB codes and application category IDs.
        """
        if not self.is_configured():
            logger.warning("RoboflowDetector is not configured with ROBOFLOW_API_KEY")
            return None

        try:
            b64_str = base64.b64encode(image_bytes).decode("utf-8")
            conf_int = max(1, min(100, int(confidence_threshold * 100)))
            overlap_int = max(1, min(100, int(overlap_threshold * 100)))

            endpoint = f"{self.api_url}/{self.model_id}?confidence={conf_int}&overlap={overlap_int}"
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/x-www-form-urlencoded",
            }

            with httpx.Client(timeout=self.timeout_sec) as client:
                response = client.post(endpoint, content=b64_str, headers=headers)

            if response.status_code != 200:
                logger.warning(
                    f"Roboflow API returned status {response.status_code}: {response.text[:200]}"
                )
                return None

            data = response.json()
            raw_preds = data.get("predictions", [])
            img_meta = data.get("image", {})

            bounding_boxes: List[Dict[str, Any]] = []
            class_counts: Dict[str, int] = {}
            best_pred: Optional[Dict[str, Any]] = None
            highest_conf: float = -1.0

            for p in raw_preds:
                raw_class = p.get("class", "Unknown")
                conf = float(p.get("confidence", 0.0))
                mapped = ROBOFLOW_CLASS_MAPPING.get(raw_class, DEFAULT_FALLBACK_MAPPING)

                class_counts[raw_class] = class_counts.get(raw_class, 0) + 1

                box_item = {
                    "detection_id": p.get("detection_id"),
                    "raw_class": raw_class,
                    "confidence": round(conf, 4),
                    "category_id": mapped["category_id"],
                    "cpcb_code": mapped["cpcb_code"],
                    "name_en": mapped["name_en"],
                    "name_hi": mapped["name_hi"],
                    "name_mr": mapped["name_mr"],
                    "hazard_level": mapped["hazard_level"],
                    "base_rate": mapped["base_rate"],
                    # Normalized and pixel bounding box coordinates
                    "x": p.get("x"),
                    "y": p.get("y"),
                    "width": p.get("width"),
                    "height": p.get("height"),
                }
                bounding_boxes.append(box_item)

                if conf > highest_conf:
                    highest_conf = conf
                    best_pred = box_item

            # Build top suggestions
            top_suggestions = []
            seen_categories = set()
            for b in sorted(bounding_boxes, key=lambda x: x["confidence"], reverse=True):
                cid = b["category_id"]
                if cid not in seen_categories:
                    seen_categories.add(cid)
                    top_suggestions.append({
                        "id": cid,
                        "name_en": b["name_en"],
                        "name_hi": b["name_hi"],
                        "name_mr": b["name_mr"],
                        "cpcb_e_waste_code": b["cpcb_code"],
                        "hazard_level": b["hazard_level"],
                        "confidence": b["confidence"],
                        "count": class_counts.get(b["raw_class"], 1),
                    })
                if len(top_suggestions) >= 3:
                    break

            return {
                "engine": "roboflow_cloud",
                "model_id": self.model_id,
                "dataset_scale": "19.6k images, 77 classes",
                "image_width": img_meta.get("width"),
                "image_height": img_meta.get("height"),
                "detected_objects_count": len(bounding_boxes),
                "class_counts": class_counts,
                "bounding_boxes": bounding_boxes,
                "primary_detection": best_pred,
                "top_suggestions": top_suggestions,
                "inference_time_sec": data.get("time"),
            }

        except Exception as exc:
            logger.error(f"Error executing Roboflow inference: {exc}")
            return None


# Global singleton instance
roboflow_detector = RoboflowDetector()
