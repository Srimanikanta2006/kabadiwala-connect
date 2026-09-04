# Datasets, Sources & Licensing Compliance
**Project:** Kabadiwala Connect (RE:LINK)  
**Regulatory Context:** Central Pollution Control Board (CPCB) E-Waste Management Rules, 2022 & Digital Personal Data Protection (DPDP) Act, 2023.

---

## 1. Primary AI/ML Training Datasets

| Dataset Name | Source / Repository | Volume / Images | Relevant Classes | License | Usage in Project |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TACO (Trash Annotations in Context)** | Pedro F. Proença et al. / GitHub | 1,500+ annotated images | Batteries, Electrical cables, Rigid plastics | **CC BY 4.0** | Transfer learning backbone for general litter & background separation |
| **Roboflow E-Waste Universe** | Roboflow Community / Public datasets | 4,200+ annotated images | Circuit boards (PCBs), Motherboards, IC chips, Cables | **CC BY 4.0 / MIT** | Primary bounding-box object detection training for YOLOv8n |
| **TrashNet** | Gary Thung & Mindy Yang / Stanford | 2,527 images | Mixed plastics, Glass, Metal | **MIT License** | Pre-training baseline for base scrap materials |
| **Kaggle Printed Circuit Board (PCB) Dataset** | Open Kaggle E-Waste repositories | 3,800 images | High vs Low-grade PCBs, Solder masks | **Database Contents License (DbCL)** | Fine-grained grade classification between multi-layer and single-sided PCBs |
| **Kabadiwala Connect Real-World Field Dataset** | Ground fieldwork (scrap aggregators in Dharavi/Kurla/Pune) | 650 targeted field images | Broken CRTs, tangled copper harnesses, dusty inverter batteries | **Proprietary / CC BY-NC-SA 4.0** | Critical test and validation set representing actual collection conditions |

---

## 2. Institutional Benchmark Data Sources

1. **CPCB Authorized Recycler Registry:**
   - **Source:** Central Pollution Control Board (CPCB) Public Registered E-Waste Recycler Directory (`cpcb.nic.in`).
   - **Fields Extracted:** Registered facility name, state pollution board authorization ID, licensed processing capacity (MTA), valid period, authorized item codes (ITEW, CEEW).
   - **License:** Open Government Data (OGD) Platform India / Public Regulatory Record.
2. **Scrap Mandi Price Benchmarks:**
   - **Source:** Daily wholesale metal & scrap bulletins from regional exchanges (e.g., Dharavi Scrap Association, Mayapuri Industrial Exchange, London Metal Exchange copper cash equivalent index).
   - **Use:** Ground-truth inputs for the deterministic daily price index cache.

---

## 3. Data Privacy & Ethical Compliance (DPDP Act 2023)

- **Minimization of Personal Identifiable Information (PII):**
  - The collector profile does **not** mandate legal name, Aadhaar, or biometric data.
  - Collectors are identified solely via an anonymous local UUID (`col_<hex>`).
  - Mobile phone number is optional (only required if collector requests SMS backup or direct UPI payment).
- **Location Privacy:**
  - Precise GPS coordinates ($<5\text{m}$) are recorded **only** at the moment of physical handover to establish traceability under CPCB audit rules.
  - Ambient routine location tracking is strictly disabled.
- **Image Sanitization:**
  - Training images collected in the field undergo automated face and vehicle license plate blurring before inclusion into the cloud training pool.
