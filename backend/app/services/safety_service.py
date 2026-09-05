"""
Kabadiwala Connect (RE:LINK) - Safety Guidance Service.
Chunk 11: Pictorial and Indic audio safety guidance for informal waste collectors and dismantlers.
Surfaced contextually (e.g. on first battery or CRT lot creation) with Bhashini Indic TTS.
"""

from typing import Dict, Any, List, Optional
from app.services.bhashini_tts import synthesize_speech_bhashini

# 7 Practical, high-impact safety guidance cards for scrap and e-waste handling
SAFETY_CARDS: List[Dict[str, Any]] = [
    {
        "card_id": "cables_no_burn",
        "category_trigger": "CABLES",
        "hazard_level": "CRITICAL",
        "icon": "🔥🚫",
        "icon_label": "No Open Burning",
        "title_hi": "तार कभी न जलाएं (Don't Burn Cables)",
        "title_mr": "केबल कधीही आगीत जाळू नका",
        "title_en": "Never Burn Insulated Cables",
        "guidance_hi": "प्लास्टिक तांबे के तार को आग में कभी न जलाएं। इससे निकलने वाला डायऑक्सिन धुआं फेफड़ों, आंखों और बच्चों के स्वास्थ्य को स्थायी नुकसान पहुंचाता है। केबल स्ट्रिपर का उपयोग करें या पूरी तार रीसायकलर को बेचें।",
        "guidance_mr": "प्लास्टिक वायर आगीत जाळू नका. त्यातून निघणारा विषारी डायऑक्सिन धूर फुफ्फुसांना हानी पोहोचवतो. केबल स्ट्रिपर वापरा किंवा संपूर्ण केबल विका.",
        "guidance_en": "Never burn insulated copper cables in open fires. Burning releases toxic dioxins causing irreversible lung damage. Use a mechanical wire stripper.",
        "audio_text_hi": "तार को कभी न जलाएं। इसका धुआं जहरीला होता है और फेफड़ों को नुकसान पहुंचाता है। रीसायकलर को पूरी तार दें या स्ट्रिपर का इस्तेमाल करें।",
        "audio_text_mr": "केबल कधीही जाळू नका. त्यातील विषारी धूर फुफ्फुसांना घातक असतो. संपूर्ण केबल थेट रीसायकलरला द्या.",
        "recommended_gear": "Mechanical wire stripper, Cotton gloves",
        "cpcb_rule_ref": "E-Waste Management Rules 2022 - Schedule IV (Prohibition of Open Burning)"
    },
    {
        "card_id": "batteries_no_open",
        "category_trigger": "BATTERIES",
        "hazard_level": "CRITICAL",
        "icon": "🔋⚠️",
        "icon_label": "Battery Acid Hazard",
        "title_hi": "बैटरी खुद न खोलें (Don't Open Batteries)",
        "title_mr": "बॅटरी स्वतः कधीही उघडू नका",
        "title_en": "Do Not Dismantle Batteries by Hand",
        "guidance_hi": "लेड-एसिड या मोबाइल की लिथियम बैटरी को हथौड़े या छेनी से कभी न तोड़ें। सल्फ्यूरिक एसिड से त्वचा जल सकती है और लिथियम हवा के संपर्क में आने पर धमाका हो सकता है।",
        "guidance_mr": "लेड-ऍसिड किंवा लिथियम बॅटरी हातोड्याने फोडू नका. ऍसिडमुळे त्वचा जळू शकते आणि स्फोट होऊ शकतो.",
        "guidance_en": "Never crush, puncture, or open lead-acid or lithium batteries manually. Acid causes severe chemical burns and lithium explodes upon atmospheric exposure.",
        "audio_text_hi": "बैटरी को कभी न तोड़ें। इसमें खतरनाक तेजाब और आग लगने का डर रहता है। इसे बंद हालत में सीधे अधिकृत रीसायकलर को दें।",
        "audio_text_mr": "बॅटरी कधीही फोडू नका. ऍसिड आणि स्फोटाचा धोका असतो. सुरक्षितपणे बंद स्थितीत रीसायकलरला द्या.",
        "recommended_gear": "Acid-resistant rubber gloves, Safety goggles",
        "cpcb_rule_ref": "Battery Waste Management Rules 2022 - Authorized Dismantling Protocols"
    },
    {
        "card_id": "crt_no_smash",
        "category_trigger": "DISPLAYS",
        "hazard_level": "HIGH",
        "icon": "📺⚠️",
        "icon_label": "Leaded Glass Implosion",
        "title_hi": "सीआरटी मॉनिटर न तोड़ें (Don't Smash CRTs)",
        "title_mr": "सीआरटी टीव्ही स्क्रीन फोडू नका",
        "title_en": "Avoid Breaking CRT Monitor Glass",
        "guidance_hi": "पुराने भारी टीवी और कंप्यूटर मॉनिटर के कांच में 2 किलो तक जहरीला सीसा (Lead) और फॉस्फोरस पाउडर होता है। हथौड़े से फोड़ने पर वैक्यूम फटने से कांच उड़ता है।",
        "guidance_mr": "जुने मोठे टीव्ही फोडू नका. यात 2 किलोपर्यंत विषारी शिसे असते आणि काचेचे तुकडे उडून गंभीर दुखापत होऊ शकते.",
        "guidance_en": "Old CRT television picture tubes contain up to 2 kg of toxic lead and toxic phosphors under vacuum. Smashing causes implosion and glass shrapnel.",
        "audio_text_hi": "सीआरटी टीवी को हथौड़े से कभी न फोड़ें। इसमें जहरीला सीसा होता है और कांच तेजी से उड़कर चोट पहुंचा सकता है।",
        "audio_text_mr": "सीआरटी स्क्रीन फोडू नका. यात घातक शिसे असते आणि काच उडून दुखापत होऊ शकते.",
        "recommended_gear": "Impact face shield, Thick leather gloves",
        "cpcb_rule_ref": "CPCB Guidelines for Environmentally Sound Dismantling of CRT Tubes"
    },
    {
        "card_id": "pcb_sharp_edges",
        "category_trigger": "PCB",
        "hazard_level": "MEDIUM",
        "icon": "🧤⚠️",
        "icon_label": "Sharp Edge Protection",
        "title_hi": "पीसीबी नुकीले किनारों से बचाव (Handle Sharp PCB Edges)",
        "title_mr": "पीसीबीच्या तीक्ष्ण कडांपासून काळजी घ्या",
        "title_en": "Beware of Sharp Circuit Board Edges",
        "guidance_hi": "मदरबोर्ड, रैम और सर्किट बोर्ड के कटे हुए किनारे कांच के फाइबर से बने होते हैं जो हाथों को गहराई से काट सकते हैं। सोल्डर में सीसा होने के कारण घाव पक सकता है।",
        "guidance_mr": "सर्किट बोर्ड हाताळताना जाड हातमोजे वापरा. फायबरच्या तीक्ष्ण कडांमुळे हात कापू नये.",
        "guidance_en": "Fiberglass edges of broken motherboards cause deep lacerations. Lead solder dust can contaminate open wounds.",
        "audio_text_hi": "सर्किट बोर्ड उठाते समय मोटे दस्ताने पहनें। इसके नुकीले किनारे हाथ काट सकते हैं और घाव में इंफेक्शन हो सकता है।",
        "audio_text_mr": "पीसीबी उचलताना जाड हातमोजे वापरा. कडा तीक्ष्ण असतात आणि हात कापू शकतो.",
        "recommended_gear": "Heavy-duty cut-resistant gloves",
        "cpcb_rule_ref": "Occupational Safety Standard for Electronic Scrap Sorting"
    },
    {
        "card_id": "wear_masks_gloves",
        "category_trigger": "GENERAL",
        "hazard_level": "RECOMMENDED",
        "icon": "😷🛡️",
        "icon_label": "Dust & Particulate Shield",
        "title_hi": "धूल व धुएं से बचाव - मास्क लगाएं (Wear Face Mask)",
        "title_mr": "छानणी करताना मास्क आणि हातमोजे वापरा",
        "title_en": "Always Wear a Protective Face Mask",
        "guidance_hi": "ई-कचरे की छंटाई और उठाई के समय बारीक धातु के कण और धूल उड़ती है। सांस की बीमारियों, अस्थमा और सिलिकोसिस से बचने के लिए N95 या कपड़े का मास्क लगाएं।",
        "guidance_mr": "कचरा वेगळा करताना धूळ नाकात जाऊ नये म्हणून नेहमी कापडी किंवा N95 मास्क वापरा.",
        "guidance_en": "Sorting electronic scrap generates toxic metal particulates. Always wear an N95 or double-layered mask to protect lungs.",
        "audio_text_hi": "छंटाई करते समय हमेशा मास्क लगाएं ताकि धातु की धूल फेफड़ों में न जाए और सांस की बीमारी न हो।",
        "audio_text_mr": "कचरा हाताळताना मास्क जरूर वापरा जेणेकरून धूळ फुफ्फुसात जाणार नाही.",
        "recommended_gear": "N95 particulate respirator mask",
        "cpcb_rule_ref": "Worker Welfare & Occupational Health Mandate (Factory Act & CPCB Guidelines)"
    },
    {
        "card_id": "food_water_separation",
        "category_trigger": "GENERAL",
        "hazard_level": "HIGH",
        "icon": "💧🚫",
        "icon_label": "Food & Water Distance",
        "title_hi": "पीने के पानी व भोजन से दूर रखें (Keep Away from Food & Water)",
        "title_mr": "अन्न आणि पिण्याच्या पाण्यापासून दूर ठेवा",
        "title_en": "Keep Scrap Away from Food and Water",
        "guidance_hi": "ई-कचरे को कभी भी मटके, पानी के नल या खाने-पीने की जगह के पास न रखें। काम खत्म होने के बाद साबुन से हाथ अच्छी तरह धोए बिना कुछ भी न खाएं।",
        "guidance_mr": "ई-कचरा पिण्याच्या पाण्याजवळ किंवा अन्नाजवळ ठेवू नका. काम संपल्यावर हात साबणाने स्वच्छ धुवूनच जेवा.",
        "guidance_en": "Never store e-waste near drinking water or food supplies. Wash hands thoroughly with soap before eating to prevent heavy metal ingestion.",
        "audio_text_hi": "ई-कचरे को पानी और खाने की चीजों से दूर रखें और काम के बाद हाथ साबुन से धोए बिना भोजन न करें।",
        "audio_text_mr": "पाण्यापासून कचरा लांब ठेवा आणि काम झाल्यावर हात साबणाने धुवा.",
        "recommended_gear": "Handwashing soap, Dedicated storage demarcation",
        "cpcb_rule_ref": "Heavy Metal Toxicity Prevention Protocol"
    },
    {
        "card_id": "capacitor_hazard",
        "category_trigger": "PCB",
        "hazard_level": "HIGH",
        "icon": "⚡⚠️",
        "icon_label": "High Voltage Capacitor",
        "title_hi": "बड़े कंडेंसर से करंट का खतरा (Check Capacitor Charge)",
        "title_mr": "मोठ्या कॅपॅसिटरपासून विजेचा झटका टाळा",
        "title_en": "Stored Electrical Charge in Large Capacitors",
        "guidance_hi": "पावर सप्लाई, इन्वर्टर और माइक्रोवेव के बड़े कंडेंसर/कैपेसिटर बिजली कटने के घंटों बाद भी 300 वोल्ट तक का जानलेवा करंट जमा रखते हैं। बिना डिस्चार्ज किए सीधे न छुएं।",
        "guidance_mr": "इन्व्हर्टर आणि जुन्या उपकरणांमधील कॅपॅसिटरमध्ये वीज साठलेली असू शकते. थेट हाताने स्पर्श करू नका.",
        "guidance_en": "Large electrolytic capacitors in power supplies retain lethal charges up to 400V even when unplugged. Discharge with a resistor before handling.",
        "audio_text_hi": "बड़ी मशीनों के कंडेंसर को सीधे न छुएं, इसमें बिजली का झटका लग सकता है। इसे पहले डिस्चार्ज करें।",
        "audio_text_mr": "कॅपॅसिटर थेट हाताने स्पर्श करू नका, विजेचा झटका बसू शकतो.",
        "recommended_gear": "Insulated screwdrivers (1000V rated)",
        "cpcb_rule_ref": "Electrical Hazard Mitigation in Informal Scrap Dismantling"
    }
]


def get_all_safety_cards(language: str = "hi") -> List[Dict[str, Any]]:
    """
    Returns all 7 safety guidance cards enriched with vernacular titles and audio text.
    """
    lang = language.strip().lower()
    res = []
    for card in SAFETY_CARDS:
        item = {
            "card_id": card["card_id"],
            "category_trigger": card["category_trigger"],
            "hazard_level": card["hazard_level"],
            "icon": card["icon"],
            "icon_label": card["icon_label"],
            "title": card.get(f"title_{lang}") or card["title_hi"],
            "guidance": card.get(f"guidance_{lang}") or card["guidance_hi"],
            "audio_text": card.get(f"audio_text_{lang}") or card["audio_text_hi"],
            "recommended_gear": card["recommended_gear"],
            "cpcb_rule_ref": card["cpcb_rule_ref"],
            "language": lang
        }
        res.append(item)
    return res


def get_contextual_safety_cards(category: Optional[str] = None, language: str = "hi") -> List[Dict[str, Any]]:
    """
    Step 3: Surface safety guidance contextually — e.g. shown the first time
    a collector logs a battery, CRT, or cable lot — rather than as a wall of text.
    """
    all_cards = get_all_safety_cards(language=language)
    if not category:
        return all_cards

    cat_upper = category.strip().upper()
    
    # Match specific category trigger or GENERAL
    contextual = [
        c for c in all_cards
        if c["category_trigger"] == cat_upper or c["category_trigger"] == "GENERAL"
    ]
    # Put category-specific cards first
    contextual.sort(key=lambda x: 0 if x["category_trigger"] == cat_upper else 1)
    return contextual


async def get_card_audio(card_id: str, language: str = "hi") -> Dict[str, Any]:
    """
    Step 2: Attach a Bhashini-generated audio clip to each card explaining it in Hindi/Marathi.
    """
    card = next((c for c in SAFETY_CARDS if c["card_id"] == card_id), None)
    if not card:
        raise ValueError(f"Safety card '{card_id}' not found")

    lang = language.strip().lower()
    spoken_text = card.get(f"audio_text_{lang}") or card["audio_text_hi"]
    tts_res = await synthesize_speech_bhashini(text=spoken_text, language=lang)
    return {
        "card_id": card_id,
        "title": card.get(f"title_{lang}") or card["title_hi"],
        "icon": card["icon"],
        "language": lang,
        "spoken_text": spoken_text,
        "tts": tts_res
    }
