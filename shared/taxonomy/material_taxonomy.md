# Standard Material Taxonomy & Identifiers
**Project:** Kabadiwala Connect (RE:LINK Platform)  
**Standard Version:** 1.0.0 (CPCB E-Waste Management Rules 2022 Aligned)

---

## 1. Unified Taxonomy Matrix

| Category ID | Standard Slug | English Name | Hindi Name (हिंदी) | Marathi Name (मराठी) | CPCB E-Waste Code | Hazard Level | Rate Range (₹/kg) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mat_pcb_high` | `pcb-high-grade` | High-Grade PCB | हाई-ग्रेड सर्किट बोर्ड | हाय-ग्रेड सर्किट बोर्ड | `ITEW1-PCB-HG` | Low | ₹180 – ₹320 |
| `mat_pcb_low` | `pcb-low-grade` | Low-Grade PCB | लो-ग्रेड सर्किट बोर्ड | लो-ग्रेड सर्किट बोर्ड | `ITEW1-PCB-LG` | Low | ₹35 – ₹75 |
| `mat_crt_monitor` | `crt-monitor-tube` | CRT Monitor / TV Tube | सीआरटी मॉनिटर ट्यूब | सीआरटी मॉनिटर ट्यूब | `CEEW1-CRT` | **Hazardous** | ₹8 – ₹18 |
| `mat_lcd_panel` | `lcd-led-panel` | LCD / LED Display Panel | एलसीडी / एलईडी स्क्रीन | एलसीडी / एलईडी स्क्रीन | `CEEW1-FPD` | Medium | ₹25 – ₹60 |
| `mat_cables_copper`| `cables-insulated-copper` | Insulated Copper Cables | तांबे के तार / केबल | तांब्याची वायर / केबल | `ITEW-CBL-CU` | Low | ₹240 – ₹420 |
| `mat_batteries_lead`| `batteries-lead-acid` | Lead-Acid Battery | लेड-एसिड बैटरी | लेड-अ‍ॅसिड बॅटरी | `BATT-PB-ACID` | **Hazardous** | ₹85 – ₹115 |
| `mat_batteries_li_ion`| `batteries-li-ion` | Lithium-Ion Battery | लिथियम-आयन बैटरी | लिथियम-आयन बॅटरी | `BATT-LI-ION` | **Hazardous** | ₹120 – ₹250 |
| `mat_motors_magnets`| `motors-and-magnets` | Motors & Assemblies | मोटर और चुंबक असेंबली | मोटर आणि मॅग्नेट असेंब्ली | `ITEW-MTR-MAG` | Low | ₹45 – ₹95 |
| `mat_mixed_plastics`| `mixed-technical-plastics`| Technical Plastics (ABS/HIPS)| टेक्निकल प्लास्टिक | टेक्निकल प्लास्टिक | `PLAST-ENG-MIX` | Low | ₹18 – ₹38 |

---

## 2. Naming Conventions & Design Rules
1. **Machine Identifiers:** Standardized prefix `mat_` followed by category and grade (snake_case), e.g., `mat_pcb_high`.
2. **URL / Route Slugs:** Kebab-case URL-safe identifiers, e.g., `pcb-high-grade`.
3. **Hazardous Flagging:** High-hazard items (`mat_crt_monitor`, `mat_batteries_lead`, `mat_batteries_li_ion`) require mandatory cautionary audio prompts and handling instructions before digital lot submission.
4. **CPCB EPR Code:** All transactions emit standardized EPR category strings so authorized recyclers can automatically credit recycling compliance certificates to registered producers.
