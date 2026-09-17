import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const OFFERS_TRANSLATIONS = {
  hi: {
    govQuotes: 'अधिकृत स्क्रैप डीलर दरें एवं यार्ड',
    filterAll: '📍 सभी नज़दीकी डीलर (< 5 किमी)',
    filterCash: '💵 तुरंत नकद / UPI यार्ड',
    filterPickup: '🚚 यार्ड वाहन पिकअप',
    dealerSubtitle: 'गली-मोहल्ले के कबाड़ हेतु अधिकृत लोकल यार्ड • इलेक्ट्रॉनिक कांटा तौल व नकद काउंटर',
    dealersMatched: 'अधिकृत यार्ड उपलब्ध',
    matchingBuyers: 'नज़दीकी अधिकृत डीलर यार्ड एवं आज की दरें खोज रहे हैं...',
    bestValueDealer: '⭐ सर्वोत्तम भाव एवं नज़दीकी यार्ड',
    authorisedAggregator: 'अधिकृत स्क्रैप डीलर यार्ड',
    away: 'किमी दूर',
    freePickup: '• 🚚 निःशुल्क वाहन पिकअप',
    selfDropoff: '• 🏭 स्वयं यार्ड पर जमा करें',
    facilityType: 'केंद्र प्रकार:',
    capacity: 'वार्षिक क्षमता:',
    adminLabel: 'यार्ड प्रबंधक:',
    ref: 'यार्ड पंजीकरण:',
    offerUnitRate: 'प्रस्तावित दर',
    totalHandoverPayout: 'कुल हस्तांतरण भुगतान',
    acceptDealerVoucher: 'स्वीकारें और यार्ड नकद वाउचर बनाएं',
    mandiBand: 'सरकारी मंडी भाव सीमा',
    calculatedFor: 'हेतु सीपीसीबी दर सूचकांक पर परिकलित',
    settlementGuarantees: 'भुगतान एवं वजन गारंटी',
    scaleWeighbridge: 'कांटा तौल:',
    scaleWeighbridgeDesc: 'HX711 इलेक्ट्रॉनिक वजनकांटा एवं मुद्रित पर्ची।',
    instantPayment: 'तुरंत भुगतान:',
    instantPaymentDesc: '100% नकद हाथ में या तुरंत UPI बैंक ट्रांसफर।',
    statutoryForm6: 'कानूनी सुरक्षा:',
    statutoryForm6Desc: 'अधिकृत डीलर को प्रत्यक्ष बिक्री से पूर्ण सुरक्षा व पक्की रसीद।',
    scaleActiveBadge: '⚖️ HX711 प्रमाणित कांटा',
    instantCashBadge: '💵 तुरंत नकद / UPI',
    gateIntakeBadge: '⚡ 2 मिनट में गेट तौल',
    dealerNotice: '💡 पारदर्शी व्यवस्था: आप अपना कबाड़ सीधे अधिकृत डीलर यार्ड (पीन्या यार्ड 04) को सौंपते हैं। आपके डीलर इन लॉट को एकत्र कर सीधे सरकारी प्रमाणित रीसाइक्लिंग प्लांट तक पहुंचाते हैं।',
    supplyChainTitle: 'पारदर्शी कबाड़ आपूर्ति व्यवस्था',
    supplyChainBadge: 'कलेक्टर → डीलर → रीसाइक्लर',
    step1Title: 'आप (कलेक्टर)',
    step1Desc: 'डीलर यार्ड पर तुरंत नकद/UPI',
    step2Title: 'अधिकृत डीलर यार्ड',
    step2Desc: 'लॉट संकलन व बड़े पैलेट निर्माण',
    step3Title: 'औद्योगिक रीसाइक्लर',
    step3Desc: 'प्रमाणित स्मेल्टिंग व पुनर्चक्रण',
    navHome: 'होम',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  mr: {
    govQuotes: 'अधिकृत स्क्रॅप डीलर दर व यार्ड',
    filterAll: '📍 सर्व जवळचे डीलर (< 5 किमी)',
    filterCash: '💵 तात्काळ रोख / UPI यार्ड',
    filterPickup: '🚚 मोफत गाडी पिकअप',
    dealerSubtitle: 'स्थानिक भंगारासाठी अधिकृत लोकल यार्ड • थेट वजनकाटा व रोख देयक काउंटर',
    dealersMatched: 'अधिकृत यार्ड उपलब्ध',
    matchingBuyers: 'जवळचे अधिकृत डीलर यार्ड आणि आजचे दर शोधत आहोत...',
    bestValueDealer: '⭐ सर्वोत्तम दर आणि सर्वात जवळचे यार्ड',
    authorisedAggregator: 'अधिकृत स्क्रॅप डीलर यार्ड',
    away: 'किमी अंतरावर',
    freePickup: '• 🚚 मोफत गाडी पिकअप',
    selfDropoff: '• 🏭 स्वतः यार्डवर जमा करा',
    facilityType: 'केंद्राचा प्रकार:',
    capacity: 'वार्षिक क्षमता:',
    adminLabel: 'यार्ड व्यवस्थापक:',
    ref: 'यार्ड नोंदणी क्रमांक:',
    offerUnitRate: 'दिलेला दर',
    totalHandoverPayout: 'एकूण देयक रक्कम',
    acceptDealerVoucher: 'स्वीकारा आणि यार्ड व्हाउचर तयार करा',
    mandiBand: 'शासकीय हमीभाव श्रेणी',
    calculatedFor: 'साठी सीपीसीबी दर सूचीनुसार अंदाजित',
    settlementGuarantees: 'देयक व वजन हमी',
    scaleWeighbridge: 'वजनकाटा:',
    scaleWeighbridgeDesc: 'HX711 इलेक्ट्रॉनिक काटा व छापील पावती.',
    instantPayment: 'तात्काळ देयक:',
    instantPaymentDesc: '100% रोख हातात किंवा थेट UPI बँक जमा.',
    statutoryForm6: 'कायदेशीर संरक्षण:',
    statutoryForm6Desc: 'अधिकृत डीलरकडे थेट विक्री केल्याने पूर्ण पावती व हमी.',
    scaleActiveBadge: '⚖️ HX711 प्रमाणित काटा',
    instantCashBadge: '💵 तात्काळ रोख / UPI',
    gateIntakeBadge: '⚡ 2 मिनिटांत गेट वजन',
    dealerNotice: '💡 पारदर्शक साखळी: तुम्ही तुमचे भंगार थेट अधिकृत स्थानिक डीलरकडे जमा करता. डीलर हे भंगार एकत्र करून थेट प्रमाणित रिसायकलिंग प्लांट्सकडे पाठवतात. थेट वजन व रोख मोबदला.',
    supplyChainTitle: 'पारदर्शक भंगार पुरवठा साखळी',
    supplyChainBadge: 'कलेक्टर → डीलर → रिसायकलर',
    step1Title: 'तुम्ही (कलेक्टर)',
    step1Desc: 'यार्डवर तात्काळ रोख/UPI',
    step2Title: 'स्थानिक डीलर यार्ड',
    step2Desc: 'साठा गोळा करणे व पॅलेट बांधणी',
    step3Title: 'औद्योगिक रिसायकलर',
    step3Desc: 'प्रमाणित स्मेल्टिंग व प्रक्रिया',
    navHome: 'मुख्य',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  en: {
    govQuotes: 'Verified Scrap Dealer Rates & Yards',
    filterAll: '📍 All Nearby Dealers (< 5 km)',
    filterCash: '💵 Instant Cash / UPI Desk',
    filterPickup: '🚚 Free Yard Pickup',
    dealerSubtitle: 'Authorized local scrap yards for collectors • Calibrated electronic scale & instant cash/UPI payment',
    dealersMatched: 'Authorised Yards Matched',
    matchingBuyers: 'Matching verified local scrap yards & live mandi rates...',
    bestValueDealer: '⭐ BEST PRICE & CLOSEST YARD',
    authorisedAggregator: 'Verified Scrap Dealer / Aggregator Yard',
    away: 'km away',
    freePickup: '• 🚚 Free Vehicle Pickup',
    selfDropoff: '• 🏭 Self Drop-off at Yard',
    facilityType: 'Facility Type:',
    capacity: 'Capacity:',
    adminLabel: 'Yard Admin:',
    ref: 'Yard Reg:',
    offerUnitRate: 'Offer Unit Rate',
    totalHandoverPayout: 'Total Handover Payout',
    acceptDealerVoucher: 'Accept & Generate Yard Cash Voucher',
    mandiBand: 'Fair Mandi Valuation Band',
    calculatedFor: 'Calculated at Live Mandi Index',
    settlementGuarantees: 'Settlement Guarantees',
    scaleWeighbridge: 'Scale Weighbridge:',
    scaleWeighbridgeDesc: 'HX711 calibrated electronic scale with printed slip.',
    instantPayment: 'Instant Payment:',
    instantPaymentDesc: '100% Cash in hand or immediate UPI bank transfer.',
    statutoryForm6: 'Legal Protection:',
    statutoryForm6Desc: 'Direct sale to licensed dealer with official weighment receipt.',
    scaleActiveBadge: '⚖️ HX711 Calibrated Scale',
    instantCashBadge: '💵 Instant Cash / UPI Desk',
    gateIntakeBadge: '⚡ Under 2-Min Turnaround',
    dealerNotice: '💡 Transparent Supply Chain: You sell scrap directly to your verified local dealer yard. Dealers aggregate lots from multiple collectors and supply them directly to certified recyclers.',
    supplyChainTitle: 'Clean 3-Tier Supply Chain Guarantee',
    supplyChainBadge: 'Collector → Dealer → Recycler',
    step1Title: 'You (Collector)',
    step1Desc: 'Instant cash/UPI at local yard',
    step2Title: 'Local Dealer Yard',
    step2Desc: 'Aggregates into bulk pallets',
    step3Title: 'Certified Recycler',
    step3Desc: 'Eco-friendly green processing',
    navHome: 'Home',
    navMyLots: 'My Lots',
    navEarnings: 'Earnings',
    navSafety: 'Safety'
  }
};

export default function Screen04PriceOffers({
  lotDraft,
  onAcceptOffer,
  onNavigate,
  onNavigateBack,
  syncStatus = { isOnline: true },
  currentLang: propLang,
  onLanguageChange
}) {
  const { i18n } = useTranslation();
  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const safeLang = normalize(propLang || i18n.language || localStorage.getItem('relink_lang'));
  const t = OFFERS_TRANSLATIONS[safeLang] || OFFERS_TRANSLATIONS.hi;

  const unit = lotDraft.unit || 'kg';
  const weight = Number(lotDraft.weight) || (unit === 'piece' ? 5 : 12);
  const materialTitle = lotDraft.materialTitle || 'Printed Circuit Boards (PCB)';
  const materialId = lotDraft.materialId || 'mat_pcb_high';

  const getBaseRate = (matId, u) => {
    try {
      const broadcast = JSON.parse(localStorage.getItem('relink_broadcast_rates') || '{}');
      if (matId === 'mat_pcb_high' && broadcast.pcb) return broadcast.pcb;
      if (matId === 'mat_cables_copper' && broadcast.copper) return broadcast.copper;
      if (matId === 'mat_batteries_li_ion' && broadcast.battery) return broadcast.battery;
      if (matId === 'mat_batteries_lead' && broadcast.lead) return broadcast.lead;
    } catch (e) {}

    if (u === 'piece') {
      return matId === 'mat_pcb_high' ? 280 : (matId === 'mat_crt_monitor' ? 250 : (matId === 'mat_batteries_li_ion' ? 120 : (matId === 'mat_motors_magnets' ? 180 : 200)));
    }
    return matId === 'mat_pcb_high' ? 755 : (matId === 'mat_cables_copper' ? 415 : (matId === 'mat_batteries_li_ion' ? 240 : (matId === 'mat_batteries_lead' ? 105 : (matId === 'mat_motors_magnets' ? 180 : 120))));
  };

  const baseRate = getBaseRate(materialId, unit);
  const mandiLow = Math.round(weight * baseRate * 0.95);
  const mandiHigh = Math.round(weight * baseRate * 1.05);

  // Dealer Yard Filter Mode: 'all' | 'cash' | 'pickup'
  const [filterMode, setFilterMode] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Default dealers (matched to Peenya Yard 04 - Dilip Bhai)
  const [dealerOffers, setDealerOffers] = useState([
    {
      id: 'hub_peenya_04',
      name: 'Peenya Industrial Aggregator Yard #04 (Dilip Bhai)',
      adminName: 'Dilip Bhai',
      statutoryRef: 'CPCB Aggregator Reg #KA-AGG-2024-118',
      cpcbNo: 'CPCB Aggregator Reg #KA-AGG-2024-118',
      facilityType: 'Authorised Aggregator Yard',
      tier: 'Aggregator Yard',
      address: 'Gate Desk #02, 4th Cross, Peenya Industrial Area Phase 1, Bengaluru',
      distance: 1.2,
      rate: baseRate,
      pickup: true,
      instantCash: true,
      scaleSensorId: 'HX711-PEENYA-02-OK',
      topMatch: true,
      sourceDoc: 'CPCB Aggregator Registry 2024'
    },
    {
      id: 'hub_dharavi_01',
      name: 'Dharavi Link Road Scrap Aggregation Center',
      adminName: 'Munna Bhai / R.K. Yadav',
      statutoryRef: 'MPCB Aggregator Reg #MH-AGG-2023-042',
      cpcbNo: 'MPCB Aggregator Reg #MH-AGG-2023-042',
      facilityType: 'Authorised Aggregator Yard',
      tier: 'Aggregator Yard',
      address: 'Transit Yard 03, Dharavi Link Road, Mahim East, Mumbai',
      distance: 1.8,
      rate: Math.max(50, Math.round(baseRate * 0.98)),
      pickup: false,
      instantCash: true,
      scaleSensorId: 'HX711-DHARAVI-01-OK',
      topMatch: false,
      sourceDoc: 'CPCB Aggregator Registry 2023'
    },
    {
      id: 'hub_kurla_02',
      name: 'Kurla E-Waste Yard & Mandi Hub',
      adminName: 'Aslam Sheikh',
      statutoryRef: 'MPCB Aggregator Reg #MH-AGG-2024-091',
      cpcbNo: 'MPCB Aggregator Reg #MH-AGG-2024-091',
      facilityType: 'Authorised Aggregator Yard',
      tier: 'Aggregator Yard',
      address: 'Plot 18, LBS Marg, Kurla West, Mumbai',
      distance: 2.6,
      rate: Math.max(45, Math.round(baseRate * 0.97)),
      pickup: true,
      instantCash: true,
      scaleSensorId: 'HX711-KURLA-01-OK',
      topMatch: false,
      sourceDoc: 'CPCB Aggregator Registry 2024'
    },
    {
      id: 'hub_yeshwanthpur_03',
      name: 'Yeshwanthpur Scrap Aggregators Hub',
      adminName: 'Shivaji Rao',
      statutoryRef: 'KSPCB Aggregator Reg #KA-AGG-2023-055',
      cpcbNo: 'KSPCB Aggregator Reg #KA-AGG-2023-055',
      facilityType: 'Authorised Aggregator Yard',
      tier: 'Aggregator Yard',
      address: 'Near Railway Freight Yard, Yeshwanthpur Industrial Suburb, Bengaluru',
      distance: 3.1,
      rate: Math.max(40, Math.round(baseRate * 0.96)),
      pickup: false,
      instantCash: true,
      scaleSensorId: 'HX711-YESHW-01-OK',
      topMatch: false,
      sourceDoc: 'CPCB Aggregator Registry 2023'
    }
  ]);

  // Default industrial recyclers
  const [recyclerOffers, setRecyclerOffers] = useState([
    {
      id: 'rec_ecorecycle_01',
      name: 'EcoRecycle India Pvt Ltd (Ecoreco)',
      adminName: 'Enterprise Facility Ops',
      statutoryRef: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032',
      cpcbNo: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032',
      facilityType: 'Authorised E-Waste Recycler',
      tier: 'Tier-1 Smelter',
      capacityMta: 12000,
      state: 'Maharashtra',
      distance: 4.8,
      rate: baseRate + 15,
      pickup: true,
      topMatch: true,
      sourceDoc: 'CPCB Directory 2023'
    },
    {
      id: 'rec_cerebra_03',
      name: 'Cerebra Integrated Technologies Ltd',
      adminName: 'Industrial Smelter Desk',
      statutoryRef: 'Karnataka State Pollution Control Board (KSPCB) - Reg #KA/E-WASTE/044',
      cpcbNo: 'Karnataka State Pollution Control Board (KSPCB) - Reg #KA/E-WASTE/044',
      facilityType: 'Authorised E-Waste Recycler',
      tier: 'Tier-1 Refinery',
      capacityMta: 15000,
      state: 'Karnataka',
      distance: 6.2,
      rate: baseRate + 10,
      pickup: true,
      topMatch: false,
      sourceDoc: 'CPCB Directory 2023'
    }
  ]);

  // Query backend for both dealers and recyclers
  useEffect(() => {
    async function fetchMatches() {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/match-recyclers?material_id=${materialId}&weight=${weight}&lat=13.0285&lng=77.5195`);
        if (res.ok) {
          const data = await res.json();
          // Load dealers
          if (data.dealers && data.dealers.length > 0) {
            setDealerOffers(data.dealers.map((d, idx) => ({
              id: d.id || d.dealer_id,
              name: d.name || d.facility_name,
              adminName: d.admin_name || 'Yard Admin',
              statutoryRef: d.statutory_reference || d.cpcb_reg_no,
              cpcbNo: d.cpcb_reg_no || d.statutory_reference,
              facilityType: d.facility_type || 'Authorised Aggregator Yard',
              tier: d.tier || 'Aggregator Yard',
              address: d.address || 'Peenya Industrial Area',
              distance: d.distance_km != null ? Number(d.distance_km.toFixed(2)) : (idx === 0 ? 1.2 : 2.5),
              rate: unit === 'piece' ? baseRate : Math.round(d.offered_rate_per_kg || baseRate),
              pickup: d.pickup_available ?? true,
              instantCash: true,
              scaleSensorId: d.scale_sensor_id || 'HX711-PEENYA-02-OK',
              topMatch: idx === 0,
              sourceDoc: d.source_doc || 'CPCB Aggregator Registry 2024'
            })));
          }
          // Load recyclers
          if (data.recyclers && data.recyclers.length > 0) {
            setRecyclerOffers(data.recyclers.slice(0, 4).map((rec, idx) => ({
              id: rec.recycler_id || rec.id,
              name: rec.facility_name || rec.name,
              adminName: rec.admin_name || 'Plant Supervisor',
              statutoryRef: rec.statutory_reference || rec.cpcb_reg_no,
              cpcbNo: rec.statutory_reference || rec.cpcb_reg_no,
              facilityType: rec.facility_type || 'Authorised Facility',
              tier: rec.tier || 'Tier-1 Recycler',
              capacityMta: rec.installed_capacity_mta || 3500,
              state: rec.state_or_ut || 'Karnataka',
              address: rec.address || '',
              distance: rec.distance_km != null ? Number(rec.distance_km.toFixed(2)) : (idx === 0 ? 4.8 : 6.5),
              rate: unit === 'piece' ? baseRate : Math.round(rec.offered_rate_per_kg || baseRate),
              pickup: rec.pickup_available ?? true,
              topMatch: idx === 0,
              sourceDoc: rec.source_document ? 'CPCB Directory 2023' : 'Government Authorized'
            })));
          }
        }
      } catch (err) {
        console.log('Using local authenticated dealer and recycler data', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatches();
  }, [materialId, weight, unit, baseRate]);

  const activeOffers = dealerOffers.filter((d) => {
    if (filterMode === 'cash') return d.instantCash;
    if (filterMode === 'pickup') return d.pickup;
    return true;
  });

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = safeLang === 'mr' ? 'mr-IN' : (safeLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakOffers = () => {
    const top = activeOffers[0] || dealerOffers[0];
    if (!top) return;
    const speech = safeLang === 'mr'
      ? `${weight} किलो ${materialTitle}. सर्वोत्तम डीलर यार्ड: ${top.name}, दर ${top.rate} रुपये प्रति किलो, एकूण ₹${Math.round(weight * top.rate)}. थेट काटा आणि रोख काउंटर सुरू.`
      : (safeLang === 'hi'
          ? `${weight} किलो ${materialTitle}। सर्वश्रेष्ठ डीलर यार्ड: ${top.name}, भाव ₹${top.rate} प्रति किलो, कुल भुगतान ₹${Math.round(weight * top.rate)}। कांटा तौल और तुरंत नकद काउंटर सक्रिय।`
          : `Identified ${weight} kg ${materialTitle}. Top dealer yard: ${top.name}, rate ₹${top.rate} per kg, estimated payout ₹${Math.round(weight * top.rate)}.`);
    speakText(speech);
  };

  const handleAccept = (offer) => {
    const totalEst = Math.round(weight * offer.rate);
    const handoverRef = `RL-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const acceptedPayload = {
      ...lotDraft,
      buyerType: 'DEALER',
      isDealer: true,
      handoverRef,
      acceptedBuyer: {
        id: offer.id,
        name: offer.name,
        adminName: offer.adminName,
        statutoryRef: offer.statutoryRef,
        cpcbNo: offer.cpcbNo,
        facilityType: offer.facilityType,
        tier: offer.tier,
        address: offer.address,
        distance: offer.distance,
        scaleSensorId: offer.scaleSensorId,
        instantCash: Boolean(offer.instantCash)
      },
      acceptedDealer: {
        id: offer.id,
        name: offer.name,
        adminName: offer.adminName,
        statutoryRef: offer.statutoryRef,
        cpcbNo: offer.cpcbNo,
        facilityType: offer.facilityType,
        tier: offer.tier,
        address: offer.address,
        distance: offer.distance,
        scaleSensorId: offer.scaleSensorId,
        instantCash: Boolean(offer.instantCash)
      },
      acceptedRecycler: {
        id: offer.id,
        name: `${offer.name} (Aggregated for Certified Recycling)`,
        statutoryRef: offer.statutoryRef,
        cpcbNo: offer.cpcbNo,
        facilityType: 'Authorised Aggregator Yard',
        capacityMta: 3500,
        state: 'Karnataka',
        distance: offer.distance,
        sourceDoc: 'CPCB Registered Dealer'
      },
      recyclerId: offer.id,
      statutoryReference: offer.statutoryRef,
      cpcbRegistrationNo: offer.cpcbNo,
      facilityType: offer.facilityType,
      agreedRate: offer.rate,
      totalEst,
      weight,
      materialTitle,
      materialId
    };

    // Cross-Portal Storage: Save to shared storage so DealerDashboard sees it instantly!
    try {
      const existingInbound = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
      const newInboundLot = {
        id: `lot_${Date.now()}`,
        lot_ref: handoverRef,
        collector_id: 'col_ramesh_peenya',
        collector_name: 'Ramesh Kumar',
        collector_cluster: 'Peenya Cluster 3',
        rating: 4.8,
        kyc_verified: true,
        material_category: materialId.includes('pcb') ? 'PCB' : (materialId.includes('cable') ? 'CABLES' : (materialId.includes('batt') ? 'BATTERIES' : 'DISPLAYS')),
        material_name: materialTitle,
        ai_confidence: 0.94,
        asking_rate: offer.rate,
        approved_rate: offer.rate,
        tare_weight: 0.40,
        gross_weight: Number((weight + 0.40).toFixed(2)),
        net_weight: Number(weight.toFixed(2)),
        sensor_id: offer.scaleSensorId || 'HX711-PEENYA-02-OK',
        status: 'QUEUED',
        queued_time: 'Just now',
        image_url: lotDraft.photoUrl || '/assets/icons/pcb_high.svg',
        is_new_live_intake: true
      };
      localStorage.setItem('relink_inbound_dealer_lots', JSON.stringify([newInboundLot, ...existingInbound.filter(x => x.id !== newInboundLot.id)]));
    } catch (e) {
      console.log('Cross-portal dealer sync notice:', e);
    }

    onAcceptOffer(acceptedPayload);
    onNavigate('receipt');
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="docked full-width top-0 border-b border-outline-variant bg-surface text-primary flex justify-between items-center w-full px-margin-mobile h-touch-target-min z-40 sticky shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onNavigateBack ? onNavigateBack() : onNavigate('home'))}
            aria-label="Back"
            className="flex items-center justify-center w-touch-target-min h-touch-target-min hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-md text-headline-md font-bold text-primary">RE:LINK</h1>
            <span className="text-outline-variant">•</span>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">MANDI</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{safeLang === 'mr' ? 'ऑनलाइन' : (safeLang === 'hi' ? 'ऑनलाइन' : 'Online')}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onLanguageChange && (
            <button
              onClick={onLanguageChange}
              className="flex items-center gap-1 h-9 px-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-bold cursor-pointer shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-primary">language</span>
              <span>{safeLang === 'hi' ? 'हिन्दी' : (safeLang === 'mr' ? 'मराठी' : 'EN')}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Context Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-label-md text-secondary uppercase tracking-wider text-xs font-bold">{t.govQuotes}</p>
            <h2 className="text-xl sm:text-2xl text-on-background font-extrabold">
              {weight}{unit === 'piece' ? (safeLang === 'en' ? ' pcs' : ' नग') : (safeLang === 'hi' ? ' किग्रा' : (safeLang === 'mr' ? ' किलो' : ' kg'))} • {materialTitle}
            </h2>
          </div>
          <button
            onClick={handleSpeakOffers}
            aria-label="Play Audio Guidance"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors shadow-sm border border-tertiary-fixed-dim cursor-pointer shrink-0"
            title="Play Vernacular Audio Guidance"
          >
            <span className="material-symbols-outlined filled text-[22px]">volume_up</span>
          </button>
        </div>

        {/* Dealer Yard Filter Pills */}
        <div className="flex bg-surface-container-low p-1 rounded-2xl border border-outline-variant/60 gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>{t.filterAll}</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('cash')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'cash'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>{t.filterCash}</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('pickup')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'pickup'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span>{t.filterPickup}</span>
          </button>
        </div>

        {/* Informational Guidance Alert */}
        <div className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-surface-container-low dark:border-outline-variant dark:text-on-surface">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5 text-primary">verified</span>
          <p className="leading-relaxed">{t.dealerNotice}</p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Buyer Offers (md:col-span-7) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-md text-on-surface font-bold text-base sm:text-lg">
                  {safeLang === 'mr' ? 'अधिकृत स्थानिक स्क्रॅप डीलर' : (safeLang === 'hi' ? 'अधिकृत स्थानीय स्क्रैप डीलर' : 'Authorised Local Scrap Dealers')}
                </h3>
                <p className="text-secondary text-xs">
                  {t.dealerSubtitle}
                </p>
              </div>
              <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/20 shrink-0">
                {activeOffers.length} {t.dealersMatched}
              </span>
            </div>

            {/* Offers Cards List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm animate-pulse space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-surface-container-high rounded w-2/3"></div>
                      <div className="h-4 bg-surface-container-high rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-surface-container-low rounded w-1/2"></div>
                    <div className="h-14 bg-surface-container-low rounded-xl"></div>
                    <div className="h-11 bg-primary/20 rounded-xl"></div>
                  </div>
                ))}
                <p className="text-center text-xs text-primary font-semibold flex items-center justify-center gap-1.5 pt-2">
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>{t.matchingBuyers}</span>
                </p>
              </div>
            ) : (
              activeOffers.map((offer, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={offer.id || idx}
                    className={`bg-surface rounded-2xl p-5 relative overflow-hidden transition-all ${
                      isTop ? 'border-2 border-primary shadow-md' : 'border border-outline-variant shadow-sm'
                    }`}
                  >
                    {isTop && (
                      <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-md text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                        {t.bestValueDealer}
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2 pr-16">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-on-surface text-base sm:text-lg">{offer.name}</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] filled">verified</span>
                            {t.authorisedAggregator}
                          </span>
                        </div>
                        <p className="text-on-surface-variant flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[15px]">location_on</span>
                          <span>{offer.distance} {t.away} • {offer.address || offer.state}</span>
                          {offer.pickup ? (
                            <span className="ml-1 text-emerald-700 font-bold">{t.freePickup}</span>
                          ) : (
                            <span className="ml-1 text-secondary font-medium">{t.selfDropoff}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Operational Badges for Dealer Yards */}
                    <div className="flex flex-wrap items-center gap-1.5 my-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                        {t.scaleActiveBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold flex items-center gap-1">
                        {t.instantCashBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center gap-1">
                        {t.gateIntakeBadge}
                      </span>
                    </div>

                    {/* Statutory Credentials Banner */}
                    <div className="mb-3 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-secondary flex-wrap gap-1">
                        <span><strong>{t.facilityType}</strong> <span className="text-on-surface font-semibold">{offer.facilityType}</span></span>
                        {offer.adminName && <span><strong>{t.adminLabel}</strong> <span className="text-on-surface font-semibold">{offer.adminName}</span></span>}
                        {offer.capacityMta && <span><strong>{t.capacity}</strong> <span className="text-on-surface font-semibold">{offer.capacityMta?.toLocaleString('en-IN')} MTA</span></span>}
                      </div>
                      <div className="text-secondary font-mono text-[10px] truncate" title={offer.statutoryRef}>
                        <strong>{t.ref}</strong> {offer.statutoryRef}
                      </div>
                    </div>

                    {/* Price & Payout Box */}
                    <div className="flex items-center justify-between mb-4 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                      <div>
                        <p className="text-secondary text-xs font-semibold">{t.offerUnitRate}</p>
                        <p className="text-primary font-extrabold text-2xl font-mono">
                          ₹{offer.rate} <span className="text-xs font-normal text-on-surface-variant">/{unit === 'piece' ? (safeLang === 'en' ? 'pc' : 'नग') : (safeLang === 'hi' ? 'किग्रा' : (safeLang === 'mr' ? 'किलो' : 'kg'))}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-secondary text-xs font-semibold">{t.totalHandoverPayout}</p>
                        <p className="text-on-surface font-extrabold text-2xl font-mono">
                          ₹{Math.round(weight * offer.rate).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAccept(offer)}
                      className={`w-full h-12 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm sm:text-base cursor-pointer active:scale-[0.99] ${
                        isTop
                          ? 'bg-primary text-on-primary shadow-md hover:bg-primary-container'
                          : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40'
                      }`}
                    >
                      <span>{t.acceptDealerVoucher}</span>
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Mandi Valuation & Buyer Trust (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            {/* Valuation Card */}
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-5 sm:p-6 shadow-md border border-outline-variant relative overflow-hidden flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-on-primary-container/80">
                {t.mandiBand}
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                ₹{mandiLow.toLocaleString('en-IN')} – ₹{mandiHigh.toLocaleString('en-IN')}
              </p>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                {t.calculatedFor} {weight} {unit === 'piece' ? (safeLang === 'en' ? 'pcs' : 'नग') : (safeLang === 'hi' ? 'किग्रा' : (safeLang === 'mr' ? 'किलो' : 'kg'))} (~₹{baseRate}/{unit === 'piece' ? 'pc' : 'kg'})
              </p>
            </div>

            {/* Buyer Settlement Guarantees */}
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm space-y-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-on-surface block">{t.settlementGuarantees}</span>
              <div className="space-y-2.5 text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span><strong>{t.scaleWeighbridge}</strong> {t.scaleWeighbridgeDesc}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">payments</span>
                  <span><strong>{t.instantPayment}</strong> {t.instantPaymentDesc}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                  <span><strong>{t.statutoryForm6}</strong> {t.statutoryForm6Desc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-xs mt-1">{t.navHome}</span>
        </button>
        <button onClick={() => onNavigate('ai_scan')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
          <span className="material-symbols-outlined filled">inventory_2</span>
          <span className="font-label-md text-xs font-bold mt-1">{t.navMyLots}</span>
        </button>
        <button onClick={() => onNavigate('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-xs mt-1">{t.navEarnings}</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">{t.navSafety}</span>
        </button>
      </nav>
    </div>
  );
}

