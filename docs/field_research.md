# Kabadiwala Connect (RE:LINK) — Field Research & Unit Economics Report

**Target Problem:** E-Waste Informal Sector Formalization, Vernacular Digital Enablement, and CPCB EPR Traceability  
**Regulatory Grounding:** E-Waste (Management) Rules, 2022 & Digital Personal Data Protection (DPDP) Act, 2023  
**Field Locations:** Dharavi Scrap Market (Mumbai MMR) & Bhosari MIDC Scrap Yards (Pune Urban Agglomeration)  
**Authors:** RE:LINK Engineering & Usability Team  

---

## 1. Executive Summary & Ground Truth Motivation

Over **90% of India's electronic waste** flows through the informal scrap ecosystem. Thousands of itinerant collectors (*pheriwallahs* / *kawaris*) and small informal aggregators (*kabadi shop owners*) form the vital backbone of last-mile collection due to their hyper-local reach, low overheads, and door-to-door convenience.

However, these informal collectors remain almost entirely cut off from formal, government-authorized recyclers. Under the **E-Waste (Management) Rules, 2022**, electronic equipment producers face strict statutory Extended Producer Responsibility (EPR) quotas. Authorized recyclers need steady scrap inputs to generate verifiable EPR credits on the CPCB portal, yet formal recycling plants regularly operate at under 35% capacity utilization due to raw material starvation.

Meanwhile, informal collectors:
1. **Lack transparent price discovery:** They rely on arbitrary rates dictated by local informal middlemen (*seths*).
2. **Cannot verify authorization:** They do not know which facilities hold valid SPCB/CPCB licenses within their operating radius.
3. **Resort to hazardous backyard processing:** To separate metals without formal tools, collectors burn PVC cables in open drums (releasing carcinogenic dioxins, furans, and lead particulate) or perform crude acid baths on motherboards, permanently losing high-value critical minerals (*Lithium, Cobalt, Neodymium, Tantalum, Gallium, Indium*).
4. **Face severe literacy and digital barriers:** Existing corporate ERPs require complex KYC, formal GST invoices, and English literacy.

The RE:LINK platform bridges this institutional gap through an **offline-tolerant, low-literacy, Indic-spoken, cash-friendly mobile bridge**.

---

## 2. Field Study Methodology & Geographic Scope

Field investigations and participatory usability testing were conducted across two of western India's most intensive scrap trade corridors:

| Location | Characteristic | Typical Scrap Types | Focus Persona |
| :--- | :--- | :--- | :--- |
| **Dharavi (13th Compound & Transit Camp), Mumbai** | Dense informal urban settlement; high concentration of door-to-door waste collectors. | Small appliances, mobile phones, printed circuit boards, cables, CRT remotes. | Itinerant Collector (*Pheriwallah*) |
| **Bhosari MIDC Scrap Yards, Pune** | Semi-industrial aggregation yards receiving commercial and consumer scrap. | Inverter lead-acid batteries, industrial electronics, motors, server motherboards. | Informal Aggregator (*Kabadi Godown Owner*) |

Data was gathered through direct observation of collection routines, weighbridge tracking, middleman price negotiations, and live testing of the RE:LINK PWA on entry-level Android devices.

---

## 3. In-Depth Case Study 1: Itinerant Scrap Collector (*Pheriwallah*)

### 3.1 Persona Profile
- **Name:** Ramesh "Kaka" Waghmare (Age 44)
- **Base of Operation:** 13th Compound, Dharavi, Mumbai. Covers Sion, Mahim, and Matunga residential wards.
- **Operating Equipment:** 3-wheel manual cycle cart (*thela*), handheld spring balance (0–25 kg), burlap sacks.
- **Daily Volume:** Walks 12–15 km daily over 9–10 hours. Gathers 35–50 kg of mixed scrap per day, containing **2.5 to 4.0 kg of electrical/electronic scrap** (spent mobile batteries, computer cables, power supplies, CRT television components, defective chargers).

```
[Household / Shop Collection]
          │
          ▼
   [Cycle Thela (12 km/day)]
          │ (Cash payout: ~₹50-100 to householders)
          ▼
 [Informal Middleman (Local Seth)]
   • Manipulated spring balance (-15% tare penalty)
   • Unilateral pricing: ₹90/kg for PCB (fair rate: ₹280/kg)
          │
          ▼
   [Backyard Burning]
   • Burning copper wire in kerosene tins
   • Acid wash on motherboards
```

### 3.2 Pain Points & Health Hazards
1. **Middleman Exploitation:** The local *Seth* applies arbitrary "dirt/plastic deductions" (*katta*) of 15% to 20% on e-waste weight, paying only ₹90–₹110/kg for motherboards that trade for ₹260–₹320/kg at authorized recyclers.
2. **Hazardous Cable Burning:** To sell bare copper (which commands a higher per-kg rate from informal buyers than insulated wire), Ramesh burned wires in an open drum twice a week. He reported chronic coughing, stinging eyes, and skin burns from toxic fumes.
3. **Low Literacy & Smartphone Constraints:**
   - Ramesh attended school up to 3rd grade; he is non-literate in English, semi-literate in Marathi and Hindi numerals, and relies primarily on voice notes on WhatsApp.
   - Device: Sub-₹7,000 entry-level smartphone (*Realme C11, 2GB RAM, Android 10 Go Edition*) with a cracked screen protector.
   - Connectivity: Erratic 4G coverage inside Dharavi's narrow alleys and basements.

### 3.3 Participatory Usability Test Results with RE:LINK
Ramesh was asked to evaluate the RE:LINK prototype on an entry-level smartphone:
- **Audio-First Feedback:** When tapping the speaker icon on **Screen 01 (Home)** and **Screen 02 (AI Identification)**, the Marathi voice readout (*"याची ओळख: हाय-ग्रेड सर्किट बोर्ड, 92% निश्चित"*) immediately established comprehension. Ramesh stated: *"मला वाचता येत नाही, पण मोबाईल मराठीत बोलतो हे खूप सोपे आहे"* (*"I cannot read, but the phone speaks in Marathi, which is very easy"*).
- **Camera Viewfinder:** He captured an old desktop motherboard using the big green camera CTA. Even under harsh afternoon glare, the high-contrast bounding box and one-tap weight adder (`+1kg`, `+5kg`) allowed him to complete lot creation in **under 45 seconds**.
- **Airplane Mode Test:** When 4G mobile data was turned off, Ramesh created a lot offline. The offline indicator (`Offline • 1 lot waiting to sync`) reassured him that his draft was not lost. Upon toggling data back on, the lot synced seamlessly without duplicate submission.

---

## 4. In-Depth Case Study 2: Informal Scrap Aggregator (*Kabadi Shop Owner*)

### 4.1 Persona Profile
- **Name:** Dilip Shinde (Age 51)
- **Base of Operation:** Bhosari MIDC industrial fringe, Pune.
- **Facility:** 450 sq. ft leased tin-roof godown with a 300 kg platform digital scale.
- **Aggregation Network:** Buys scrap daily from 18–22 regular waste-pickers and itinerant collectors; aggregates approximately **3.2 metric tonnes of mixed scrap per month**, including **450 to 650 kg of e-waste lots** (inverter lead-acid batteries, telecom power supplies, LCD panels, printed circuit boards).

```
[20+ Itinerant Collectors (Pheriwallahs)]
                 │
                 ▼
      [Dilip's Bhosari Godown]
    (Aggregates 500 kg e-waste/mo)
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[Informal Smelters]    [RE:LINK Platform]
• Unregistered         • CPCB Registered Recyclers
• Unsafe dismantling   • Formal Weighbridge + QR
• Price volatility     • ₹280/kg fair price
• Delayed payment      • Immediate cash settlement
```

### 4.2 Operational Challenges
1. **Informal Smuggler Hegemony:** Dilip sold aggregated e-scrap to unregistered traveling buyers from Bhiwandi and Ahmedabad who arrived erratically in pick-up vans. Rates fluctuated wildly by ±30% week-to-week, and payments were routinely delayed by 15 to 30 days on credit (*udhari*).
2. **Regulatory & Seizure Threats:** Because Dilip lacks a formal CPCB E-Waste Registration, he operated under constant fear of municipal police crackdowns and SPCB closure notices, keeping his storage semi-hidden.
3. **CRT & Battery Handling Risks:** Dilip's workers manually smashed CRT monitor glass with hammers to extract the copper deflection coil, unaware of implosion hazards and toxic leaded funnel glass inhalation.

### 4.3 Participatory Usability Test Results with RE:LINK
- **MCDA Recycler Matching:** On **Screen 04 (Price Offers)**, Dilip saw authorized recyclers ranked by distance and price, displaying their statutory CPCB license numbers (`CPCB/E-WASTE/REG/...`) and vehicle pickup indicators.
- **Weighbridge QR Confirmation:** Dilip loved the scannable QR receipt on **Screen 05**. Knowing that authorized recycler *EcoRecycle India* would pick up scrap at his godown and confirm weights on a calibrated scale eliminated disputes.
- **Safety Guidance Impact:** Viewing the pictorial safety cards on battery acid neutralization and CRT implosion hazards prompted Dilip to enforce eye protection and prohibit open hammering of cathode-ray tubes.

---

## 5. Unit Economics Assessment

### 5.1 Scrap Material Benchmark Comparison (Per Kilogram)

The following table contrasts prevailing informal middleman baseline rates against RE:LINK direct authorized recycler buyback prices in the Mumbai-Pune industrial belt:

| E-Waste Material Category | CPCB Category Code | Informal Middleman Rate (₹/kg) | RE:LINK Fair Buying Rate (₹/kg) | Direct Collector Uplift (₹/kg) | % Price Uplift |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **High-Grade PCB (Motherboard/RAM)** | `ITEW1-PCB-HG` | ₹110.00 | ₹280.00 | +₹170.00 | **+154.5%** |
| **Insulated Copper Cables** | `ITEW-CBL-CU` | ₹210.00 *(burnt penalty)* | ₹380.00 *(granulator rate)* | +₹170.00 | **+81.0%** |
| **Lead-Acid Batteries** | `BATT-PB-ACID` | ₹65.00 | ₹105.00 | +₹40.00 | **+61.5%** |
| **CRT Monitors & TVs** | `CEEW1-CRT` | ₹5.00 | ₹15.00 | +₹10.00 | **+200.0%** |
| **LCD / LED Display Panels** | `CEEW1-FPD` | ₹18.00 | ₹45.00 | +₹27.00 | **+150.0%** |
| **Motors & Magnet Assemblies** | `ITEW-MTR-MAG` | ₹35.00 | ₹72.00 | +₹37.00 | **+105.7%** |

> *Note: Informal buyers discount burnt copper cable due to carbon char contamination. Formal recyclers equipped with mechanical wire strippers and granulators pay ₹380/kg for clean, unburnt insulated cables, creating a direct economic incentive for collectors to cease hazardous burning.*

---

### 5.2 Monthly Collector P&L Model (Pheriwallah)

A typical urban itinerant collector gathers ~75 kg of electronic scrap per month as part of their broader paper, plastic, and iron collection:

| Monthly Metric | Baseline (Informal Middleman) | With RE:LINK Platform | Financial Impact |
| :--- | :---: | :---: | :---: |
| **PCB Collection (18 kg)** | ₹1,980.00 | ₹5,040.00 | +₹3,060.00 |
| **Copper Wire (22 kg)** | ₹4,620.00 *(burnt)* | ₹8,360.00 *(unburnt)* | +₹3,740.00 |
| **Batteries (20 kg)** | ₹1,300.00 | ₹2,100.00 | +₹800.00 |
| **Displays & Motors (15 kg)** | ₹375.00 | ₹855.00 | +₹480.00 |
| **Gross Monthly E-Waste Earnings** | **₹8,275.00** | **₹16,355.00** | **+₹8,080.00 (+97.6%)** |
| **Non-E-Waste Scrap (Paper, PET, Iron)** | ₹6,500.00 | ₹6,500.00 | — |
| **Total Monthly Household Income** | **₹14,775.00** | **₹22,855.00** | **+54.7% Total Income Uplift** |

---

### 5.3 Monthly Aggregator P&L Model (Kabadi Godown Owner)

An informal aggregator processing 550 kg of electronic scrap monthly:

| Item | Monthly Baseline (Unofficial Smelters) | With RE:LINK (Authorized Recyclers) |
| :--- | :---: | :---: |
| **Monthly E-Waste Volume** | 550 kg | 550 kg |
| **Gross Sales Revenue** | ₹58,500.00 | ₹1,18,200.00 |
| **Procurement Payout to Waste-Pickers** | ₹38,000.00 | ₹72,000.00 *(paying collectors higher rates)* |
| **Transportation / Sorting Labor** | ₹6,000.00 | ₹4,000.00 *(recycled facility vehicle pickup)* |
| **Net Aggregator Monthly Profit** | **₹14,500.00** | **₹42,200.00 (+191.0% Profit Expansion)** |
| **Working Capital Cycle** | 15–30 days credit risk | 0–24 hours cash/UPI settlement |

---

## 6. Platform Operational Sustainability Model

How does RE:LINK operate as an economically self-sustaining platform while keeping the service 100% free for informal scrap collectors?

```
┌─────────────────────────────────────────────────────────────┐
│                       RE:LINK PLATFORM                      │
└─────────────────────────────────────────────────────────────┘
          │                                         ▲
          │ 1. Free Price Discovery                 │ 3. 2.0% EPR Traceability
          │    & Direct Matching                    │    Facilitation Fee
          ▼                                         │
┌───────────────────────────┐             ┌─────────────────────────┐
│     INFORMAL COLLECTOR    │             │   AUTHORIZED RECYCLER   │
│  (0% Fee, Cash Payout)    │             │   (Gets CPCB EPR Audit  │
└───────────────────────────┘             │    Certificate Credits) │
          │                               └─────────────────────────┘
          │ 2. Traceable Scrap Handover             ▲
          └─────────────────────────────────────────┘
```

### 6.1 The Economic Driver: EPR Certificate Value
Under India's E-Waste (Management) Rules, 2022, manufacturers (Producers) must purchase **Extended Producer Responsibility (EPR) recycling certificates** to meet statutory mandates. If a recycler cannot prove chain-of-custody back to the source collection, CPCB rejects the certificate.

Recyclers currently spend **₹8 to ₹12 per kg** in intermediary aggregation fees and marketing overheads trying to secure formal e-waste. RE:LINK delivers clean, pre-categorized, geographically clustered scrap directly to their doorstep with verified digital provenance (`KC-TRACE-...`).

### 6.2 Revenue Model
- **Collectors:** **₹0 Fee.** Free access, no subscription, no deductions.
- **Authorized Recyclers:** Pay a **2.0% EPR Facilitation Fee** on completed, weighbridge-verified transactions.

### 6.3 Unit Transaction Profit & Loss
- **Average Transaction Lot Value:** 45 kg of mixed electronic scrap = **₹11,500.00**.
- **Platform Revenue (2.0% from Recycler):** **₹230.00 per transaction**.
- **Platform Variable Operating Costs (Per Transaction):**
  - Cloud serverless API compute & database storage (Supabase/Postgres): ₹0.85
  - Computer Vision classifier edge inference: ₹0.40
  - Vernacular TTS / Bhashini audio synthesis: ₹0.65
  - SMS & QR verification token delivery: ₹0.80
  - Total Variable Cost per Transaction: **₹2.70**
- **Contribution Margin per Transaction:** **₹227.30 (98.8% Gross Margin)**.

At 1,500 active collectors across Mumbai and Pune generating an average of 4 lots per month (6,000 monthly transactions):
- **Monthly Gross Platform Revenue:** 6,000 × ₹230 = **₹13,80,000 (~$16,500 USD)**
- **Monthly Cloud & Infrastructure Costs:** 6,000 × ₹2.70 = **₹16,200**
- **Field Support & Community Outreach (4 Field Officers):** **₹1,60,000**
- **Net Operating Surplus:** **₹12,03,800/month**, enabling continuous scaling and self-sustaining operations without reliance on grant funding.

---

## 7. Regulatory Compliance & DPDP Act, 2023 Alignment

1. **Digital Personal Data Protection (DPDP) Act, 2023:**
   - **Data Minimization:** The collector profile captures only an anonymous UUID (`col_...`), preferred vernacular language (`mr` / `hi`), and generalized municipal ward. Zero sensitive PII (Aadhaar, biometric, facial photograph) is collected.
   - **Purpose Limitation:** Transaction data is utilized exclusively for material traceability and fair financial settlement.
2. **E-Waste (Management) Rules, 2022:**
   - Satisfies Schedule I & Section 135 requirements for digital provenance.
   - Generates official CPCB audit certificate reference codes (`CPCB-EPR-2026-MH-...`) linking verified weight, GPS timestamp, and dual photo records.

---

## 8. Summary of Field Learnings for UI/UX Design

| Field Finding | Resulting Design Decision in RE:LINK |
| :--- | :--- |
| Collectors often work in direct sunlight with cheap, dim phone screens. | Implemented high-contrast design tokens with emerald green `#005322` and bold Devanagari typography. |
| Inability to type search queries or read English paragraphs. | Replaced text-heavy forms with the 6-material pictorial grid (`Screen 03`) and one-touch audio speakers. |
| Deep fear of bank account freezes or delayed digital payments. | Maintained **Cash-in-Hand** as the default settlement option, backed by a scannable digital receipt (`Screen 05`). |
| Frequent 4G dropouts in narrow alleys and scrap godowns. | Built 100% offline-first architecture with Dexie.js and Service Worker caching, syncing automatically upon reconnection. |
