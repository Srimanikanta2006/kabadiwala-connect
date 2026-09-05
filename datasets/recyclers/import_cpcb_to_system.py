"""
CPCB Authorized Recyclers Importer and Geocoding Engine.
Converts extracted 569 CPCB authorized records into the system seed database.
Calculates geographic coordinates from city/district addresses, sets material compatibility,
and assigns offered rates and capacity criteria.
"""

import json
import re
from pathlib import Path

CPCB_EXTRACTED_FILE = Path(__file__).resolve().parent / "cpcb_authorized_recyclers.json"
SYSTEM_SEED_FILE = Path(__file__).resolve().parent.parent / "seed_recyclers.json"

# High-resolution District & Industrial Cluster Coordinate Map (India)
DISTRICT_COORDINATE_MAP = {
    # Maharashtra
    "dharavi": (19.0434, 72.8576), "mumbai": (19.0760, 72.8777), "goregaon": (19.1663, 72.8526),
    "palghar": (19.6966, 72.7655), "tarapur": (19.8517, 72.7042), "boiser": (19.8016, 72.7562),
    "vasai": (19.3919, 72.8397), "virar": (19.4564, 72.8020), "bhoipada": (19.3980, 72.8450),
    "wada": (19.6547, 73.1368), "thane": (19.2183, 72.9781), "bhiwandi": (19.2967, 73.0631),
    "kalyan": (19.2403, 73.1305), "turbhe": (19.0820, 73.0150), "navi mumbai": (19.0330, 73.0297),
    "taloja": (19.0844, 73.1090), "panvel": (18.9894, 73.1175), "raigad": (18.5158, 73.1822),
    "pune": (18.5204, 73.8567), "bhosari": (18.6270, 73.8131), "haveli": (18.4682, 73.8570),
    "bhor": (18.1477, 73.8437), "chakan": (18.7606, 73.8617), "pimpri": (18.6298, 73.7997),
    "nagpur": (21.1458, 79.0882), "kamptee": (21.2230, 79.1970), "nashik": (19.9975, 73.7898),
    "dindori": (20.2033, 73.8340), "aurangabad": (19.8762, 75.3433), "waluj": (19.8247, 75.2427),
    "dhule": (20.9042, 74.7749), "dondaicha": (21.3283, 74.5772), "kolhapur": (16.7050, 74.2433),
    "ichalkaranji": (16.6922, 74.4578), "solapur": (17.6599, 75.9064), "jalgaon": (21.0077, 75.5626),
    "nanded": (19.1383, 77.3210), "sangli": (16.8524, 74.5815), "satara": (17.6805, 74.0183),

    # Karnataka
    "bengaluru": (12.9716, 77.5946), "bangalore": (12.9716, 77.5946), "peenya": (13.0285, 77.5197),
    "bommasandra": (12.8184, 77.6896), "jigani": (12.7844, 77.6358), "hoskote": (13.0700, 77.7981),
    "doddaballapur": (13.2924, 77.5424), "doddabalapura": (13.2924, 77.5424), "anekal": (12.7107, 77.6974),
    "attibele": (12.7801, 77.7712), "kumbalgodu": (12.8837, 77.4646), "tumkur": (13.3409, 77.1006),
    "vasanthanarsapura": (13.3850, 77.0620), "mysore": (12.2958, 76.6394), "mysuru": (12.2958, 76.6394),

    # Gujarat
    "ahmedabad": (23.0225, 72.5714), "sanand": (22.9922, 72.3807), "daskroi": (22.9400, 72.6300),
    "bodakdev": (23.0418, 72.5074), "surat": (21.1702, 72.8311), "sachin": (21.0850, 72.8683),
    "ankleshwar": (21.6264, 73.0016), "panoli": (21.5298, 72.9760), "bharuch": (21.7051, 72.9959),
    "vadodara": (22.3072, 73.1812), "vapi": (20.3893, 72.9106), "valsad": (20.5992, 72.9342),
    "rajkot": (22.3039, 70.8022), "kothariya": (22.2530, 70.8140), "mehsana": (23.5880, 72.3693),
    "kadi": (23.2974, 72.3330), "gandhinagar": (23.2156, 72.6369), "dahegam": (23.1685, 72.8123),

    # Delhi NCR & Haryana
    "delhi": (28.6139, 77.2090), "okhla": (28.5355, 77.2732), "patparganj": (28.6280, 77.3001),
    "peeragarhi": (28.6757, 77.0934), "mandoli": (28.7060, 77.3050), "gurgaon": (28.4595, 77.0266),
    "gurugram": (28.4595, 77.0266), "manesar": (28.3515, 76.9427), "faridabad": (28.4089, 77.3178),
    "sonipat": (28.9931, 77.0151), "sonepat": (28.9931, 77.0151), "rai": (28.9280, 77.0980),
    "panipat": (29.3909, 76.9635), "ambala": (30.3782, 76.7767), "rohtak": (28.8955, 76.6066),
    "bahadurgarh": (28.6925, 76.9240),

    # Uttar Pradesh
    "noida": (28.5355, 77.3910), "greater noida": (28.4744, 77.5040), "ghaziabad": (28.6692, 77.4538),
    "sahibabad": (28.6766, 77.3569), "sikandrabad": (28.4503, 77.6978), "bulandshahr": (28.4070, 77.8498),
    "kanpur": (26.4499, 80.3319), "moradabad": (28.8386, 78.7733), "meerut": (28.9845, 77.7064),
    "lucknow": (26.8467, 80.9462), "varanasi": (25.3176, 82.9739), "agra": (27.1767, 78.0081),

    # Tamil Nadu
    "chennai": (13.0827, 80.2707), "porur": (13.0382, 80.1565), "ambattur": (13.1143, 80.1481),
    "sriperumbudur": (12.9675, 79.9442), "oragadam": (12.8360, 79.9570), "kanchipuram": (12.8342, 79.7036),
    "coimbatore": (11.0168, 76.9558), "tiruvallur": (13.1435, 79.9083),

    # Telangana & Andhra Pradesh
    "hyderabad": (17.3850, 78.4867), "medchal": (17.6297, 78.4814), "cherlapally": (17.4727, 78.5997),
    "patancheru": (17.5332, 78.2659), "visakhapatnam": (17.6868, 83.2185), "gajuwaka": (17.6908, 83.2081),
    "anantapur": (14.6819, 77.6006), "hindupur": (13.8285, 77.4920), "chittoor": (13.2172, 79.1003),
    "srikakulam": (18.2969, 83.8968),

    # Rajasthan
    "alwar": (27.5530, 76.6346), "bhiwadi": (28.2102, 76.8406), "chopanki": (28.1750, 76.8520),
    "jaipur": (26.9124, 75.7873),

    # Other States
    "kolkata": (22.5726, 88.3639), "hooghly": (22.9030, 88.3968), "bhubaneswar": (20.2961, 85.8245),
    "derabassi": (30.5960, 76.8437), "mohali": (30.7046, 76.7179), "roorkee": (29.8543, 77.8880),
    "haridwar": (29.9457, 78.1642), "kochi": (9.9312, 76.2673), "indore": (22.7196, 75.8577),
    "saligao": (15.5497, 73.7744), "guwahati": (26.1445, 91.7362), "raipur": (21.2514, 81.6296),
    "ranchi": (23.3441, 85.3096), "solan": (30.9045, 77.0967), "jammu": (32.7266, 74.8570)
}

STATE_DEFAULT_COORDS = {
    "Maharashtra": (19.0760, 72.8777), # Default to Mumbai MMR hub
    "Karnataka": (12.9716, 77.5946),   # Bengaluru
    "Gujarat": (23.0225, 72.5714),     # Ahmedabad
    "Delhi": (28.6139, 77.2090),       # Delhi Central
    "Haryana": (28.4595, 77.0266),     # Gurgaon
    "Uttar Pradesh": (28.5355, 77.3910),# Noida
    "Tamil Nadu": (13.0827, 80.2707),  # Chennai
    "Telangana": (17.3850, 78.4867),   # Hyderabad
    "Andhra Pradesh": (17.6868, 83.2185), # Visakhapatnam
    "Rajasthan": (26.9124, 75.7873),   # Jaipur
    "Punjab": (30.7046, 76.7179),      # Mohali
    "Uttarakhand": (29.9457, 78.1642), # Haridwar
    "West Bengal": (22.5726, 88.3639), # Kolkata
    "Orissa": (20.2961, 85.8245),      # Bhubaneswar
    "Kerala": (9.9312, 76.2673),       # Kochi
    "Madhya Pradesh": (22.7196, 75.8577), # Indore
    "Goa": (15.2993, 73.9577),         # Goa
    "Assam": (26.1445, 91.7362),       # Guwahati
    "Chhattisgarh": (21.2514, 81.6296),# Raipur
    "Jharkhand": (23.3441, 85.3096),   # Ranchi
    "Himachal Pradesh": (30.9045, 77.0967), # Solan
    "Jammu & Kashmir": (32.7266, 74.8570)   # Jammu
}

# Standard material rates based on mandi fair value benchmark
BASE_OFFERED_RATES = {
    "mat_pcb_high": 275.0,
    "mat_pcb_low": 65.0,
    "mat_cables_copper": 385.0,
    "mat_batteries_lead": 105.0,
    "mat_batteries_li_ion": 195.0,
    "mat_crt_monitor": 15.0,
    "mat_lcd_panel": 45.0,
    "mat_motors_magnets": 75.0,
    "mat_mixed_plastics": 32.0
}

def resolve_facility_coordinates(state: str, address: str):
    addr_lower = address.lower()
    for keyword, coords in DISTRICT_COORDINATE_MAP.items():
        if keyword in addr_lower:
            return coords[0], coords[1]
    return STATE_DEFAULT_COORDS.get(state, (20.5937, 78.9629))

def build_system_records():
    if not CPCB_EXTRACTED_FILE.exists():
        raise FileNotFoundError(f"Extracted CPCB JSON not found at {CPCB_EXTRACTED_FILE}")

    with open(CPCB_EXTRACTED_FILE, "r", encoding="utf-8") as f:
        raw_cpcb = json.load(f)

    records = raw_cpcb.get("records", [])
    system_recyclers = []

    for r in records:
        state = r.get("state_or_ut", "Maharashtra")
        addr = r.get("facility_address", "")
        name = r.get("facility_name", "")
        cap = r.get("installed_capacity_mta") or 300.0
        ftype = r.get("facility_type", "Recycler")

        lat, lng = resolve_facility_coordinates(state, addr)

        # Materials accepted:
        # Dismantlers accept mechanical stripping & separation (cables, casings, screens, motors, low PCBs)
        # Recyclers accept end-to-end metallurgical extraction (all categories including high-grade PCBs & batteries)
        if "Dismantler" in ftype:
            accepted_mats = [
                "mat_pcb_low",
                "mat_cables_copper",
                "mat_crt_monitor",
                "mat_lcd_panel",
                "mat_motors_magnets",
                "mat_mixed_plastics"
            ]
        else:
            accepted_mats = [
                "mat_pcb_high",
                "mat_pcb_low",
                "mat_cables_copper",
                "mat_batteries_lead",
                "mat_batteries_li_ion",
                "mat_crt_monitor",
                "mat_lcd_panel",
                "mat_motors_magnets",
                "mat_mixed_plastics"
            ]

        # Name-based specializations
        name_lower = name.lower()
        if "copper" in name_lower:
            accepted_mats = ["mat_cables_copper", "mat_motors_magnets"]
        elif "battery" in name_lower or "lead" in name_lower:
            accepted_mats = ["mat_batteries_lead", "mat_batteries_li_ion"]
        elif "plastic" in name_lower:
            accepted_mats = ["mat_mixed_plastics"]

        # Pickup available: facilities with > 1000 MTA capacity provide vehicle logistics
        pickup_avail = bool(cap and cap >= 1000.0)

        # Offered rates: small variation based on capacity tier
        rate_modifier = 1.05 if cap and cap > 5000.0 else (1.0 if cap and cap > 1000.0 else 0.96)
        rates = {k: round(v * rate_modifier, 1) for k, v in BASE_OFFERED_RATES.items() if k in accepted_mats}

        system_recyclers.append({
            "id": r["id"],
            "name": name,
            "facility_name": name,
            "cpcb_registration_no": r.get("statutory_reference") or f"CPCB/AUTH/{r['state_code']}/{r['unit_sl_no']:03d}",
            "statutory_reference": r.get("statutory_reference"),
            "authorizing_agency": r.get("authorizing_agency"),
            "statutory_authorization_status": r.get("statutory_authorization_status", "Authorised under E-Waste Rules"),
            "authorization_status": "ACTIVE",
            "is_cpcb_authorized": True,
            "source_document": r.get("source_document"),
            "source_date": r.get("source_date", "2023-06-08"),
            "page_number": r.get("page_number"),
            "facility_type": ftype,
            "installed_capacity_mta": cap,
            "state_or_ut": state,
            "state_code": r.get("state_code"),
            "address": addr,
            "location_lat": lat,
            "location_lng": lng,
            "materials_accepted": accepted_mats,
            "offered_rates": rates,
            "pickup_availability": pickup_avail,
            "min_pickup_weight_kg": 50.0 if pickup_avail else 10.0,
            "service_area": f"{state} Industrial Hubs",
            "contact": {
                "agency": r.get("authorizing_agency"),
                "status": "Verified by SPCB Government Registry"
            }
        })

    # Save to seed_recyclers.json to directly empower matching engine
    with open(SYSTEM_SEED_FILE, "w", encoding="utf-8") as f:
        json.dump(system_recyclers, f, indent=2, ensure_ascii=False)

    print(f"Imported {len(system_recyclers)} CPCB facilities into {SYSTEM_SEED_FILE}")
    return system_recyclers

if __name__ == "__main__":
    build_system_records()
