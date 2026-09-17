import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationsModal from './common/NotificationsModal';
import AdminToolsModal from './common/AdminToolsModal';
import Form6ManifestModal from './recycler/Form6ManifestModal';
import DealerNavigationModal from './common/DealerNavigationModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DEALER_TRANSLATIONS = {
  hi: {
    brandSubtitle: 'यार्ड डेस्क',
    synced: 'सिंक हुआ',
    yardDeskLive: 'YARD DESK LIVE',
    peenyaYard: 'PEENYA-YARD-04',
    workingFloat: 'Working Float',
    avail: 'Avail',
    cashDeskReserve: 'रोकड़ शेष (Cash Desk)',
    hx711Digital: 'HX711 DIGITAL',
    calibrated: 'Calibrated (±0.1)',
    tabGatePay: 'Gate & Pay',
    tabStockBays: 'Stock & Bays',
    tabArbitrage: 'Arbitrage',
    tabForm6: 'Form-6',
    pickupRequests: 'पिकअप अनुरोध',
    viewLot: 'लॉट देखें',
    acceptPickup: 'पिकअप स्वीकारें',
    pickupAccepted: 'पिकअप स्वीकृत ✓',
    startNavigation: 'नेविगेशन शुरू करें',
    searchPlaceholder: 'लॉट # या कबाड़ी का नाम दर्ज करें (उदा. RL-2026-00482)...',
    scanCamera: 'कैमरा स्कैन',
    fetchVoucher: 'वाउचर खोजें',
    recentInboundQueue: 'हाल की आवक कतार',
    activeLots: 'सक्रिय लॉट',
    today: 'आज',
    activeGateWeighment: 'सक्रिय गेट वजन एवं तुरंत भुगतान',
    lotNo: 'लॉट #',
    queued: 'कतार में',
    weighbridgeSensor: 'इलेक्ट्रॉनिक कांटा सेंसर',
    grossWeight: 'सकल वजन (Gross)',
    tareDeduction: 'कांटा घटाव (Tare)',
    netPayableWeight: 'शुद्ध वजन (Net)',
    netVerifiedWeight: 'शुद्ध सत्यापित वजन',
    mandiBenchmark: 'मंडी बेंचमार्क',
    scaleCalibratedISO: 'कांटा #02 कैलिब्रेटेड (ISO/IEC)',
    zeroTareVerified: 'शून्य टेयर सत्यापित',
    calculatedPayoutDue: 'कुल देय नकद राशि',
    tdsDeductions: 'टीडीएस कटौती: छूट प्राप्त (ई-कचरा नीति के तहत <₹10,000)',
    askingRate: 'मांग भाव',
    approvedRate: 'स्वीकृत भाव',
    totalCashPayout: 'कुल नकद भुगतान',
    payCash: '💵 नकद भुगतान करें',
    payUpi: '📱 UPI तुरंत भेजें',
    settling: 'भुगतान जारी...',
    collectorLedgerSynced: 'कलेक्टर बहीखाता सिंक ✓',
    soundboxTitle: 'पेटीएम / फोनपे यार्ड साउंडबॉक्स (सुनने के लिए टैप करें):',
    todaysGateInbound: 'आज का गेट इनबाउंड',
    disbursed: 'वितरित',
    verifiedCollectors: 'सत्यापित कबाड़ीवाले',
    activeToday: 'आज सक्रिय',
    liveMandiTicker: 'लाइव मंडी दैनिक भाव',
    scanCollectorLotQr: 'कलेक्टर लॉट QR स्कैन करें',
    gateInboundReader: 'गेट इनबाउंड इलेक्ट्रॉनिक कांटा रीडर',
    alignCollectorSlip: 'कलेक्टर पर्ची का QR बॉक्स के अंदर रखें',
    simulateQrScan: 'QR स्कैन / वजनकाटा टोकन लोड करने के लिए टैप करें:',
    load: 'लोड करें',
    pasteQrPlaceholder: 'QR पेलोड या लॉट # दर्ज करें (उदा. RL-2026-00482)...',
    outboundConsignment: 'आउटबाउंड बैच प्रेषण',
    batchNo: 'बैच #04',
    gradePcb: 'ग्रेड-ए पीसीबी',
    lotsCount: 'लॉट',
    recycler: 'रीसायकलर:',
    pickupAvailable: 'पिकअप: उपलब्ध',
    requestRecyclerPickup: 'रीसायकलर पिकअप',
    selfTransport: 'स्वयं ट्रांसपोर्ट →',
    selfTransportSelected: 'स्वयं ट्रांसपोर्ट मोड (+₹10/किग्रा मालभाड़ा छूट)',
    lockDeal: 'थोक सौदा तय करें एवं डिस्पैच करें',
    dealLocked: 'सौदा तय हुआ ✓ (माल रवाना)',
    yardBaysTitle: 'यार्ड बे एवं इन्वेंटरी स्टॉक',
    form6Title: 'CPCB फॉर्म-6 अनुपालन एवं ईपीआर ट्रैसेबिलिटी',
    yardMasterAdmin: 'यार्ड प्रमुख प्रबंधक',
    cpcbAdminTools: 'CPCB मास्टर एडमिन टूल्स',
    alertsNotifs: 'अलर्ट एवं सूचनाएं',
    logOutRole: 'लॉग आउट करें / रोल बदलें'
  },
  mr: {
    brandSubtitle: 'यार्ड डेस्क',
    synced: 'सिंक झाले',
    yardDeskLive: 'YARD DESK LIVE',
    peenyaYard: 'PEENYA-YARD-04',
    workingFloat: 'Working Float',
    avail: 'Avail',
    cashDeskReserve: 'रोख शिल्लक (Cash Desk)',
    hx711Digital: 'HX711 DIGITAL',
    calibrated: 'Calibrated (±0.1)',
    tabGatePay: 'Gate & Pay',
    tabStockBays: 'Stock & Bays',
    tabArbitrage: 'Arbitrage',
    tabForm6: 'Form-6',
    pickupRequests: 'पिकअप विनंत्या',
    viewLot: 'लॉट पहा',
    acceptPickup: 'पिकअप स्वीकारा',
    pickupAccepted: 'पिकअप स्वीकारले ✓',
    startNavigation: 'नेव्हिगेशन सुरू करा',
    searchPlaceholder: 'लॉट # किंवा कबाडी नाव टाका (उदा. RL-2026-00482)...',
    scanCamera: 'कॅमेरा स्कॅन',
    fetchVoucher: 'व्हाउचर शोधा',
    recentInboundQueue: 'अलीकडील आवक रांग',
    activeLots: 'सक्रिय लॉट',
    today: 'आज',
    activeGateWeighment: 'सक्रिय गेट वजन व तत्काळ पेमेंट',
    lotNo: 'लॉट #',
    queued: 'रांगेत',
    weighbridgeSensor: 'इलेक्ट्रॉनिक वजनकाटा सेन्सर',
    grossWeight: 'एकूण वजन (Gross)',
    tareDeduction: 'काटा वजावट (Tare)',
    netPayableWeight: 'निव्वळ वजन (Net)',
    netVerifiedWeight: 'निव्वळ सत्यापित वजन',
    mandiBenchmark: 'मंडी बेंचमार्क',
    scaleCalibratedISO: 'काटा #02 कॅलिब्रेटेड (ISO/IEC)',
    zeroTareVerified: 'शून्य टेअर सत्यापित',
    calculatedPayoutDue: 'एकूण देय रोख रक्कम',
    tdsDeductions: 'टीडीएस कपात: सूट (<₹10,000 ई-कचरा धोरणानुसार)',
    askingRate: 'मागणी दर',
    approvedRate: 'मंजूर दर',
    totalCashPayout: 'एकूण रोख रक्कम',
    payCash: '💵 रोख पेमेंट करा',
    payUpi: '📱 UPI तत्काळ पाठवा',
    settling: 'पेमेंट प्रक्रिया...',
    collectorLedgerSynced: 'कलेक्टर लेजर सिंक ✓',
    soundboxTitle: 'पेटीएम / फोनपे यार्ड साउंडबॉक्स (ऐकण्यासाठी टॅप करा):',
    todaysGateInbound: 'आजचे गेट इनबाउंड',
    disbursed: 'वितरित',
    verifiedCollectors: 'सत्यापित कलेक्टर्स',
    activeToday: 'आज सक्रिय',
    liveMandiTicker: 'लाइव्ह मंडी दैनिक दर',
    scanCollectorLotQr: 'कलेक्टर लॉट QR स्कॅन करा',
    gateInboundReader: 'गेट इनबाउंड वजनकाटा रीडर',
    alignCollectorSlip: 'कलेक्टर पावतीचा QR बॉक्समध्ये धरा',
    simulateQrScan: 'QR स्कॅन / वजनकाटा टोकन लोड करण्यासाठी टॅप करा:',
    load: 'लोड करा',
    pasteQrPlaceholder: 'QR पेलोड किंवा लॉट # टाका (उदा. RL-2026-00482)...',
    outboundConsignment: 'आउटबाउंड बॅच डिस्पॅच',
    batchNo: 'बॅच #04',
    gradePcb: 'ग्रेड-ए पीसीबी',
    lotsCount: 'लॉट',
    recycler: 'रिसायकलर:',
    pickupAvailable: 'पिकअप: उपलब्ध',
    requestRecyclerPickup: 'रिसायकलर पिकअप',
    selfTransport: 'स्वतः ट्रान्सपोर्ट →',
    selfTransportSelected: 'स्वतः ट्रान्सपोर्ट मोड (+₹10/किलो सूट)',
    lockDeal: 'घाऊक सौदा निश्चित करा व डिस्पॅच करा',
    dealLocked: 'सौदा निश्चित ✓ (माल रवाना)',
    yardBaysTitle: 'यार्ड बे व इन्व्हेंटरी साठा',
    form6Title: 'CPCB फॉर्म-6 पूर्तता व ईपीआर ट्रॅसेबिलिटी',
    yardMasterAdmin: 'यार्ड प्रमुख व्यवस्थापक',
    cpcbAdminTools: 'CPCB मास्टर ॲडमिन टूल्स',
    alertsNotifs: 'सूचना व अलर्ट',
    logOutRole: 'लॉग आउट करा / भूमिका बदला'
  },
  en: {
    brandSubtitle: 'Yard Desk',
    synced: 'Synced',
    yardDeskLive: 'YARD DESK LIVE',
    peenyaYard: 'PEENYA-YARD-04',
    workingFloat: 'Working Float',
    avail: 'Avail',
    cashDeskReserve: 'Cash Desk Reserve',
    hx711Digital: 'HX711 DIGITAL',
    calibrated: 'Calibrated (±0.1)',
    tabGatePay: 'Gate & Pay',
    tabStockBays: 'Stock & Bays',
    tabArbitrage: 'Arbitrage',
    tabForm6: 'Form-6',
    pickupRequests: 'Pickup Requests',
    viewLot: 'View Lot',
    acceptPickup: 'Accept Pickup',
    pickupAccepted: 'Pickup Accepted ✓',
    startNavigation: 'Start Navigation',
    searchPlaceholder: 'Enter Lot # or Collector Name (e.g. RL-2026-00482)...',
    scanCamera: 'Scan Camera',
    fetchVoucher: 'Fetch Voucher',
    recentInboundQueue: 'Recent Inbound Queue',
    activeLots: 'Active Lots',
    today: 'Today',
    activeGateWeighment: 'ACTIVE GATE WEIGHMENT & PAYOUT',
    lotNo: 'Lot #',
    queued: 'Queued',
    weighbridgeSensor: 'Weighbridge Digital Sensor',
    grossWeight: 'Gross Weight',
    tareDeduction: 'Tare Deduction',
    netPayableWeight: 'Net Payable Weight',
    netVerifiedWeight: 'Net Verified Weight',
    mandiBenchmark: 'Mandi Benchmark',
    scaleCalibratedISO: 'Scale #02 Calibrated (ISO/IEC)',
    zeroTareVerified: 'Zero Tare Verified',
    calculatedPayoutDue: 'Calculated Payout Due',
    tdsDeductions: 'TDS Deductions: Exempt (<₹10,000 threshold under e-waste yard policy)',
    askingRate: 'Asking Rate',
    approvedRate: 'Approved Rate',
    totalCashPayout: 'Total Cash Payout',
    payCash: '💵 Pay Cash & Confirm',
    payUpi: '📱 UPI Instant',
    settling: 'Settling...',
    collectorLedgerSynced: 'Collector Ledger Synced ✓',
    soundboxTitle: 'Paytm / PhonePe Yard Soundbox (Tap to Play):',
    todaysGateInbound: "Today's Gate Inbound",
    disbursed: 'Disbursed',
    verifiedCollectors: 'Verified Collectors',
    activeToday: 'Active today',
    liveMandiTicker: 'Live Mandi Daily Ticker',
    scanCollectorLotQr: 'Scan Collector Lot QR',
    gateInboundReader: 'Gate Inbound Weighbridge Reader',
    alignCollectorSlip: 'Align collector slip QR within box',
    simulateQrScan: 'Tap to Simulate QR Scan / Weighbridge Token:',
    load: 'Load',
    pasteQrPlaceholder: 'Paste QR payload or Lot # (e.g. RL-2026-00482)...',
    outboundConsignment: 'Consolidated Batch Consignment',
    batchNo: 'Batch #04',
    gradePcb: 'Grade-A PCB',
    lotsCount: 'Lots',
    recycler: 'Recycler:',
    pickupAvailable: 'Pickup: Available',
    requestRecyclerPickup: 'Request Recycler Pickup',
    selfTransport: 'Self Transport →',
    selfTransportSelected: 'Self-Transport Mode (+₹10/kg Freight Rebate)',
    lockDeal: 'Lock Wholesale Deal & Dispatch',
    dealLocked: 'Deal Locked ✓ (Consignment Dispatched)',
    yardBaysTitle: 'Yard Bays & Inventory Stock',
    form6Title: 'CPCB Form-6 Manifests & EPR Provenance',
    yardMasterAdmin: 'Yard Master Admin',
    cpcbAdminTools: 'CPCB Master Admin Tools',
    alertsNotifs: 'Alerts & Notifications',
    logOutRole: 'Log Out / Switch Role'
  }
};

export default function DealerDashboard({ onRoleSwitch, currentLang: propLang, onLanguageChange: propOnLanguageChange }) {
  const { i18n } = useTranslation();
  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const [internalLang, setInternalLang] = useState(() => normalize(propLang || i18n?.language || localStorage.getItem('relink_lang')));

  useEffect(() => {
    if (propLang) {
      setInternalLang(normalize(propLang));
    }
  }, [propLang]);

  const currentLang = normalize(propLang || internalLang);
  const t = DEALER_TRANSLATIONS[currentLang] || DEALER_TRANSLATIONS.hi;

  const handleLanguageCycle = () => {
    const cycle = { hi: 'mr', mr: 'en', en: 'hi' };
    const next = cycle[currentLang] || 'hi';
    setInternalLang(next);
    localStorage.setItem('relink_lang', next);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(next);
    }
    if (propOnLanguageChange) {
      propOnLanguageChange(next);
    }
  };

  // Global Navigation & Portals
  const [activeTab, setActiveTab] = useState('tab-intake');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedManifestData, setSelectedManifestData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showDealerNav, setShowDealerNav] = useState(false);
  const [navModalMode, setNavModalMode] = useState('INBOUND_PICKUP');
  const [navLotData, setNavLotData] = useState(null);
  const [navBatchData, setNavBatchData] = useState(null);
  const [pickupAcceptedMap, setPickupAcceptedMap] = useState({ 'lot_rl_00482': true });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Live Mandi Rates synced with Recycler Broadcast
  const [broadcastMandiRates, setBroadcastMandiRates] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('relink_broadcast_rates') || '{}');
      return {
        pcb: saved.pcb || 755,
        copper: saved.copper || 415,
        battery: saved.battery || 240
      };
    } catch (e) {
      return { pcb: 755, copper: 415, battery: 240 };
    }
  });

  useEffect(() => {
    const handleRatesUpdate = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('relink_broadcast_rates') || '{}');
        if (saved.pcb || saved.copper || saved.battery) {
          setBroadcastMandiRates({
            pcb: saved.pcb || 755,
            copper: saved.copper || 415,
            battery: saved.battery || 240
          });
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleRatesUpdate);
    window.addEventListener('relink_rates_updated', handleRatesUpdate);
    return () => {
      window.removeEventListener('storage', handleRatesUpdate);
      window.removeEventListener('relink_rates_updated', handleRatesUpdate);
    };
  }, []);

  // Camera & QR Scanner State
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualQrInput, setManualQrInput] = useState('');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Financial & Operational State
  const [workingCapitalFloat, setWorkingCapitalFloat] = useState(385000);
  const [scaleCalibrated, setScaleCalibrated] = useState(true);

  // TAB 1: Inbound Queue & Active Intake State
  const [inboundLots, setInboundLots] = useState([
    {
      id: 'lot_rl_00482',
      lot_ref: 'RL-2026-00482',
      collector_id: 'col_ramesh_peenya',
      collector_name: 'Ramesh Kumar',
      collector_cluster: 'Peenya Cluster 3',
      rating: 4.8,
      kyc_verified: true,
      material_category: 'PCB',
      material_name: 'PCB Grade-A Motherboards',
      ai_confidence: 0.92,
      asking_rate: 740,
      approved_rate: 755,
      tare_weight: 0.40,
      gross_weight: 12.40,
      net_weight: 12.00,
      sensor_id: 'HX711-PEENYA-02-OK',
      status: 'QUEUED',
      queued_time: '14 mins ago',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbUagrPvZBSpU5OSDT1ZkzRP-C5_lK9WqhTwmexjs6nhNfh8M9EnYpmcfV5i_iThyFhX04Zgur5XQ89-LnGRuUBOpt5cDZotWFsuY9F2NZQ4IpmmrFlafWKiW4No-fkbJrdO4Rw01_Eion13qtCIORLPgNheo_OB9cEVmigB7JOTLai2Iv77k9-t90dHyVIhukTPVNf1lHK0Yw9snELlfGalsajR_QBd03e1NWQGZ2rOgUw1DC9T79'
    },
    {
      id: 'lot_rl_00485',
      lot_ref: 'RL-2026-00485',
      collector_id: 'col_sunil_rail',
      collector_name: 'Sunil Kumar',
      collector_cluster: 'Rail Yard Cluster',
      rating: 4.9,
      kyc_verified: true,
      material_category: 'CABLES',
      material_name: 'Bright Copper Wire (94% Cu)',
      ai_confidence: 0.95,
      asking_rate: 410,
      approved_rate: 415,
      tare_weight: 0.60,
      gross_weight: 29.10,
      net_weight: 28.50,
      sensor_id: 'HX711-PEENYA-01-OK',
      status: 'PAID_CASH',
      total_payout: 11827.5,
      payment_mode: 'CASH',
      queued_time: '35 mins ago',
      image_url: '/assets/icons/cables_copper.svg'
    },
    {
      id: 'lot_rl_00486',
      lot_ref: 'RL-2026-00486',
      collector_id: 'col_imran_jalahalli',
      collector_name: 'Imran B.',
      collector_cluster: 'Jalahalli Hub',
      rating: 4.7,
      kyc_verified: true,
      material_category: 'BATTERIES',
      material_name: 'Li-ion Cells (18650)',
      ai_confidence: 0.89,
      asking_rate: 230,
      approved_rate: 240,
      tare_weight: 0.50,
      gross_weight: 15.70,
      net_weight: 15.20,
      sensor_id: 'HX711-PEENYA-02-OK',
      status: 'INSPECTION',
      total_payout: 3648,
      payment_mode: 'PENDING',
      queued_time: '50 mins ago',
      image_url: '/assets/icons/batt_liion.svg'
    },
    {
      id: 'lot_rl_00481',
      lot_ref: 'RL-2026-00481',
      collector_id: 'col_anita_dasarahalli',
      collector_name: 'Anita Bai',
      collector_cluster: 'Dasarahalli Hub',
      rating: 4.9,
      kyc_verified: true,
      material_category: 'PCB',
      material_name: 'Grade-B Mixed PCB',
      ai_confidence: 0.91,
      asking_rate: 470,
      approved_rate: 480,
      tare_weight: 0.40,
      gross_weight: 15.40,
      net_weight: 15.00,
      sensor_id: 'HX711-PEENYA-02-OK',
      status: 'PAID_UPI',
      total_payout: 7200,
      payment_mode: 'UPI',
      queued_time: '1 hour ago',
      image_url: '/assets/icons/pcb_low.svg'
    }
  ]);

  const [activeLot, setActiveLot] = useState(null);
  const [activeNetWeight, setActiveNetWeight] = useState(12.0);
  const [activeApprovedRate, setActiveApprovedRate] = useState(755);
  const [lastSoundboxMessage, setLastSoundboxMessage] = useState({
    hi: '₹9,060 नकद भुगतान सफल - कबाड़ीवाला कनेक्ट',
    mr: '₹9,060 रोख देण्यात आले - कबाड़ीवाला कनेक्ट',
    en: 'Rupees 9,060 cash payment confirmed.'
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Enhanced cross-portal Voucher Loader & QR Decoder
  const handleFetchOrScanVoucher = (queryOrPayload) => {
    if (!queryOrPayload) return;
    const q = typeof queryOrPayload === 'string' ? queryOrPayload.trim() : '';

    let targetRef = q;
    let payloadObj = null;
    if (q.startsWith('{') && q.includes('}')) {
      try {
        payloadObj = JSON.parse(q);
        targetRef = payloadObj.lot_id || payloadObj.handover_ref || '';
      } catch (e) {}
    }

    // 1. Search memory inboundLots
    let found = inboundLots.find(l =>
      (targetRef && (l.lot_ref === targetRef || l.id === targetRef)) ||
      l.lot_ref.toLowerCase().includes(q.toLowerCase()) ||
      l.collector_name.toLowerCase().includes(q.toLowerCase())
    );

    // 2. Search localStorage relink_inbound_dealer_lots
    if (!found) {
      try {
        const storedInbound = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
        found = storedInbound.find(l =>
          (targetRef && (l.lot_ref === targetRef || l.id === targetRef)) ||
          l.lot_ref.toLowerCase().includes(q.toLowerCase()) ||
          l.collector_name.toLowerCase().includes(q.toLowerCase())
        );
      } catch (e) {}
    }

    // 3. Search localStorage relink_lots
    if (!found) {
      try {
        const storedLots = JSON.parse(localStorage.getItem('relink_lots') || '[]');
        const matched = storedLots.find(l =>
          (targetRef && (l.id === targetRef || l.handoverRef === targetRef)) ||
          (l.id && l.id.toLowerCase().includes(q.toLowerCase())) ||
          (l.materialTitle && l.materialTitle.toLowerCase().includes(q.toLowerCase()))
        );
        if (matched) {
          found = {
            id: matched.id,
            lot_ref: matched.handoverRef || `RL-2026-${(matched.id || '00482').slice(-5)}`,
            collector_id: 'col_collector_live',
            collector_name: 'Ramesh Kumar',
            collector_cluster: 'Peenya Cluster 3',
            rating: 4.8,
            kyc_verified: true,
            material_category: (matched.materialId || 'pcb').includes('pcb') ? 'PCB' : 'CABLES',
            material_name: matched.materialTitle || 'Grade-A PCB',
            ai_confidence: 0.94,
            asking_rate: matched.agreedRate || 755,
            approved_rate: matched.agreedRate || 755,
            tare_weight: 0.40,
            gross_weight: Number(((matched.weight || 12.0) + 0.40).toFixed(2)),
            net_weight: Number((matched.weight || 12.0).toFixed(2)),
            sensor_id: 'HX711-PEENYA-02-OK',
            status: 'QUEUED',
            queued_time: 'Just now',
            image_url: matched.photoUrl || '/assets/icons/pcb_high.svg',
            is_new_live_intake: true
          };
        }
      } catch (e) {}
    }

    // 4. If payloadObj contains details (direct QR code scan/paste) but wasn't in storage
    if (!found && payloadObj && (payloadObj.handover_ref || payloadObj.lot_id)) {
      const weightVal = Number(payloadObj.weight_kg || payloadObj.weight || 12.0);
      const rateVal = Number(payloadObj.rate_inr || payloadObj.agreedRate || 755);
      found = {
        id: payloadObj.lot_id || `lot_${Date.now()}`,
        lot_ref: payloadObj.handover_ref || payloadObj.lot_id,
        collector_id: payloadObj.collector_id || 'col_collector_live',
        collector_name: payloadObj.collector_name || 'Ramesh Kumar',
        collector_cluster: payloadObj.collector_cluster || 'Peenya Cluster 3',
        rating: 4.8,
        kyc_verified: true,
        material_category: (payloadObj.material || 'PCB').toUpperCase().includes('PCB') ? 'PCB' : 'CABLES',
        material_name: payloadObj.material || 'Grade-A PCB',
        ai_confidence: 0.94,
        asking_rate: rateVal,
        approved_rate: rateVal,
        tare_weight: 0.40,
        gross_weight: Number((weightVal + 0.40).toFixed(2)),
        net_weight: Number(weightVal.toFixed(2)),
        sensor_id: 'HX711-PEENYA-02-OK',
        status: 'QUEUED',
        queued_time: 'Scanned via QR',
        image_url: '/assets/icons/pcb_high.svg',
        is_new_live_intake: true
      };
    }

    if (found) {
      setInboundLots(prev => {
        if (!prev.some(l => l.id === found.id || l.lot_ref === found.lot_ref)) {
          return [found, ...prev];
        }
        return prev;
      });
      setActiveLot(found);
      setActiveNetWeight(found.net_weight);
      setActiveApprovedRate(found.approved_rate);
      setShowScannerModal(false);
      setSearchQuery('');
      setManualQrInput('');
      showToast('Voucher Loaded ✓', `Loaded #${found.lot_ref} (${found.collector_name}) into weighbridge desk.`);
    } else {
      showToast('Search Notice', `No collector lot voucher matching "${q}" found.`);
    }
  };

  useEffect(() => {
    let streamRef = null;
    if (showScannerModal && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          streamRef = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        })
        .catch(err => {
          console.log('Camera access notice:', err);
          setCameraActive(false);
        });
    } else {
      setCameraActive(false);
    }
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach(tr => tr.stop());
      }
    };
  }, [showScannerModal]);

  // TAB 2: Physical Inventory & Consolidation State
  const [inventoryStock, setInventoryStock] = useState({
    PCB: {
      category: 'Server & Consumer PCBs',
      code: 'ITEW1-PCB',
      stock_kg: 185.0,
      target_pallet_kg: 350.0,
      bin: 'Bin #P-04',
      avg_cost_inr: 742.0,
      micro_lots_count: 14,
      status: 'Ready to Consolidate'
    },
    CABLES: {
      category: 'Insulated Copper Cables',
      code: 'ITEW-CBL-CU',
      stock_kg: 320.0,
      target_pallet_kg: 500.0,
      bin: 'Bin #C-02',
      avg_cost_inr: 415.0,
      micro_lots_count: 22,
      status: 'Stock In Yard'
    },
    BATTERIES: {
      category: 'Li-ion Battery Packs',
      code: 'BATT-LI-ION',
      stock_kg: 110.0,
      target_pallet_kg: 250.0,
      bin: 'Hazmat Vault #H-1',
      avg_cost_inr: 240.0,
      micro_lots_count: 9,
      status: 'Hazmat Yard Cell'
    }
  });

  const [batchMicroLots, setBatchMicroLots] = useState([
    { id: 'micro_01', ref: '#RL-2026-00482', collector: 'Ramesh Kumar (Peenya)', grade: 'PCB Grade-A (Motherboards)', weight: 12.0, rate: 755, selected: true },
    { id: 'micro_02', ref: '#RL-2026-00479', collector: 'Shivaji Rao (Yeshwantpur)', grade: 'PCB Grade-A (Server Trays)', weight: 45.0, rate: 745, selected: true },
    { id: 'micro_03', ref: '#RL-2026-00475', collector: 'Anita Bai (Dasarahalli)', grade: 'PCB Grade-A (Telecom Boards)', weight: 38.5, rate: 738, selected: true },
    { id: 'micro_04', ref: '#RL-2026-00470', collector: '+ 11 Other Micro-Intakes', grade: 'Assorted Grade-A Lots', weight: 254.5, rate: 742, selected: true }
  ]);

  // TAB 3: Marketplace & Arbitrage State
  const [selectedBidder, setSelectedBidder] = useState('bid_cerebra_01');
  const [logisticsType, setLogisticsType] = useState('RECYCLER_PICKUP');
  const [checklist, setChecklist] = useState({
    tareVerified: true,
    sortingConfirmed: true,
    manifestReady: true
  });
  const [dealLocked, setDealLocked] = useState(false);

  // Initialize Active Lot & Sync Live Collector Inbound Lots
  useEffect(() => {
    try {
      const liveLots = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
      if (liveLots && liveLots.length > 0) {
        setInboundLots(prev => {
          const merged = [...liveLots];
          for (const p of prev) {
            if (!merged.some(m => m.lot_ref === p.lot_ref || m.id === p.id)) {
              merged.push(p);
            }
          }
          return merged;
        });

        // Set the most recently submitted queued live lot as active
        const latestQueued = liveLots.find(l => l.status === 'QUEUED') || liveLots[0];
        if (latestQueued) {
          setActiveLot(latestQueued);
          setActiveNetWeight(latestQueued.net_weight);
          setActiveApprovedRate(latestQueued.approved_rate);
        }
      } else if (!activeLot && inboundLots.length > 0) {
        const firstQueued = inboundLots.find(l => l.status === 'QUEUED') || inboundLots[0];
        setActiveLot(firstQueued);
        setActiveNetWeight(firstQueued.net_weight);
        setActiveApprovedRate(firstQueued.approved_rate);
      }
    } catch (e) {
      console.log('Error loading local live intake lots:', e);
    }

    // Fetch backend lots if available
    async function fetchBackendLots() {
      try {
        const res = await fetch(`${API_BASE}/aggregator/lots?hub_id=hub_peenya_04`);
        if (res.ok) {
          const data = await res.json();
          if (data.lots && data.lots.length > 0) {
            setInboundLots(prev => {
              const live = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
              const combined = [...live];
              for (const bl of data.lots) {
                if (!combined.some(c => c.lot_ref === bl.lot_ref || c.id === bl.id)) {
                  combined.push(bl);
                }
              }
              return combined;
            });
          }
        }
      } catch (err) {
        console.log('Backend aggregator lots offline fallback');
      }
    }
    fetchBackendLots();
  }, []);

  // Update active lot selection
  useEffect(() => {
    if (!activeLot && inboundLots.length > 0) {
      const firstQueued = inboundLots.find(l => l.status === 'QUEUED') || inboundLots[0];
      setActiveLot(firstQueued);
      setActiveNetWeight(firstQueued.net_weight);
      setActiveApprovedRate(firstQueued.approved_rate);
    }
  }, [inboundLots, activeLot]);

  // Toast Helper
  const showToast = (title, desc) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Vernacular Speech Helper
  const speakAnnouncement = (text, langCode = 'hi-IN') => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.log('Speech synthesis notice:', e);
    }
  };

  // Payment Settlement Handler (Tab 1)
  const handleProcessPayment = async (mode) => {
    if (!activeLot) return;
    setIsProcessingPayment(true);
    const totalAmount = Math.round(activeNetWeight * activeApprovedRate);

    try {
      const res = await fetch(`${API_BASE}/aggregator/intake/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: activeLot.id,
          collector_name: activeLot.collector_name,
          material_category: activeLot.material_category,
          net_weight_kg: activeNetWeight,
          rate_per_kg: activeApprovedRate,
          payment_mode: mode,
          collector_phone: '+91 98450 12891'
        })
      });

      if (res.ok) {
        await res.json();
      }

      // Deduct from working capital float
      setWorkingCapitalFloat(prev => Math.max(0, prev - totalAmount));

      // Update lot in queue state
      setInboundLots(prev => prev.map(l => l.id === activeLot.id ? {
        ...l,
        status: mode === 'CASH' ? 'PAID_CASH' : 'PAID_UPI',
        total_payout: totalAmount,
        payment_mode: mode
      } : l));

      // Persist paid status in localStorage for cross-portal sync
      try {
        const stored = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
        const updated = stored.map(l => (l.id === activeLot.id || l.lot_ref === activeLot.lot_ref) ? {
          ...l,
          status: mode === 'CASH' ? 'PAID_CASH' : 'PAID_UPI',
          total_payout: totalAmount,
          payment_mode: mode
        } : l);
        localStorage.setItem('relink_inbound_dealer_lots', JSON.stringify(updated));
      } catch (e) {}

      // Add to batch micro-lots in Tab 2 so Dealer can batch this newly bought lot!
      setBatchMicroLots(prev => [
        {
          id: `micro_${activeLot.id}`,
          ref: `#${activeLot.lot_ref}`,
          collector: `${activeLot.collector_name} (${activeLot.collector_cluster || 'Peenya'})`,
          grade: activeLot.material_name,
          weight: activeNetWeight,
          rate: activeApprovedRate,
          selected: true
        },
        ...prev.filter(m => m.ref !== `#${activeLot.lot_ref}`)
      ]);


      // Increment physical yard inventory
      const cat = activeLot.material_category;
      if (inventoryStock[cat]) {
        setInventoryStock(prev => ({
          ...prev,
          [cat]: {
            ...prev[cat],
            stock_kg: parseFloat((prev[cat].stock_kg + activeNetWeight).toFixed(1)),
            micro_lots_count: prev[cat].micro_lots_count + 1
          }
        }));
      }

      // Play Soundbox
      const speechText = currentLang === 'mr'
        ? `${totalAmount.toLocaleString('en-IN')} रुपये रोख देण्यात आले - कबाड़ीवाला कनेक्ट`
        : (totalAmount === 9060
            ? 'नौ हज़ार साठ रुपये नकद भुगतान सफल - कबाड़ी वाला Connect'
            : `${totalAmount.toLocaleString('en-IN')} रुपये नकद भुगतान सफल - कबाड़ी वाला Connect`);

      setLastSoundboxMessage({
        hi: `₹${totalAmount.toLocaleString('en-IN')} नकद भुगतान सफल - कबाड़ीवाला कनेक्ट`,
        mr: `₹${totalAmount.toLocaleString('en-IN')} रोख देण्यात आले - कबाड़ीवाला कनेक्ट`,
        en: `Rupees ${totalAmount.toLocaleString('en-IN')} ${mode.toLowerCase()} payment confirmed.`
      });

      speakAnnouncement(speechText, currentLang === 'mr' ? 'mr-IN' : 'hi-IN');
      showToast(
        `Settlement Verified (${mode})`,
        `₹${totalAmount.toLocaleString('en-IN')} disbursed to ${activeLot.collector_name}. Voucher #RCP-${activeLot.lot_ref.slice(-5)} issued.`
      );
    } catch (err) {
      console.error('Payment processing error:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Consolidate Selected Lots (Tab 2)
  const handleToggleMicroLot = (id) => {
    setBatchMicroLots(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const handleSelectAllQualified = () => {
    const allSelected = batchMicroLots.every(i => i.selected);
    setBatchMicroLots(prev => prev.map(i => ({ ...i, selected: !allSelected })));
  };

  const selectedLots = batchMicroLots.filter(i => i.selected);
  const totalBatchWeight = selectedLots.reduce((sum, item) => sum + item.weight, 0);
  const totalBatchCost = selectedLots.reduce((sum, item) => sum + (item.weight * item.rate), 0);
  const avgBatchBuyRate = totalBatchWeight > 0 ? Math.round(totalBatchCost / totalBatchWeight) : 742;

  // Official Karnataka Authorized Recyclers (from CPCB / KSPCB official registry)
  const biddersList = [
    {
      id: 'bid_cerebra_01',
      code: 'CI',
      name: 'M/s. Cerebra Integrated Technologies Ltd',
      desc: 'KSPCB Authorised Smelter • Narasapura / Kolar (39,000 MTA)',
      rate: 820,
      badge: 'High Bid',
      bgBadge: 'bg-emerald-200 text-emerald-900'
    },
    {
      id: 'bid_eparisaraa_02',
      code: 'EP',
      name: 'M/s. E-Parisaraa Pvt Ltd',
      desc: 'R2 / CPCB Registered Smelter • Dabaspet Hub (9,288 MTA)',
      rate: 815,
      badge: 'Certified R2',
      bgBadge: 'bg-blue-100 text-blue-900'
    },
    {
      id: 'bid_sriram_03',
      code: 'SR',
      name: 'M/s. Sriram Eco Raksha Computer Services Pvt Ltd',
      desc: 'KSPCB Authorised Recycler • Bommasandra (360 MTA)',
      rate: 805,
      badge: 'Valid 3h',
      bgBadge: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'bid_trishyirya_04',
      code: 'TR',
      name: 'M/s. Trishyirya Recycling India Pvt Ltd',
      desc: 'CPCB Reg #KA/E-WASTE/019 • Peenya 4th Phase (360 MTA)',
      rate: 802,
      badge: 'Local Peenya',
      bgBadge: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'bid_ehasiru_05',
      code: 'EH',
      name: 'M/s. E-Hasiru',
      desc: 'Authorised Dismantler • Peenya 3rd Phase (300 MTA)',
      rate: 795,
      badge: 'Ex-Yard',
      bgBadge: 'bg-slate-100 text-slate-700'
    }
  ];

  // Wholesale Deal Lock (Tab 3)
  const handleLockWholesaleDeal = async () => {
    const selectedB = biddersList.find(b => b.id === selectedBidder) || biddersList[0];
    const agreedRate = selectedB.rate;
    const buyerName = selectedB.name;

    try {
      await fetch(`${API_BASE}/aggregator/marketplace/deal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_number: 'BATCH-KA-PCB-104',
          recycler_name: buyerName,
          agreed_rate: agreedRate,
          weight_kg: totalBatchWeight || 350.0,
          logistics_type: logisticsType
        })
      });
    } catch (e) {
      console.log('Wholesale lock notice:', e);
    }

    // Save to shared localStorage so Recycler Dashboard immediately displays this pallet
    try {
      const palletRecord = {
        id: 'batch_ka_pcb_104',
        batch_number: 'BATCH-KA-PCB-104',
        material_name: 'Grade-A PCB Palletized (Peenya Yard Consignment)',
        material_category: 'PCB',
        origin_hub: 'Peenya Industrial Aggregator Yard #04 (Dilip Bhai)',
        origin_reg: 'CPCB Reg #KA-AGG-2024-118',
        weight_kg: totalBatchWeight || 350.0,
        approximate_weight: totalBatchWeight || 350.0,
        quoted_price: Math.round((totalBatchWeight || 350.0) * agreedRate),
        agreed_rate: agreedRate,
        status: 'CONSIGNMENT_LOCKED',
        buyer: buyerName,
        micro_lots_count: selectedLots.length || 14,
        cpcb_provenance_hash: 'CPCB-EPR-2026-KA-B104-F92E',
        is_dealer_pallet: true,
        created_at: new Date().toISOString()
      };
      const existingPallets = JSON.parse(localStorage.getItem('relink_dealer_pallets') || '[]');
      localStorage.setItem('relink_dealer_pallets', JSON.stringify([palletRecord, ...existingPallets.filter(p => p.batch_number !== palletRecord.batch_number)]));
    } catch (e) {
      console.log('Error caching dealer pallet:', e);
    }

    setDealLocked(true);
    showToast(
      'Wholesale Consignment Locked!',
      `Deal sealed with ${buyerName} at ₹${agreedRate}/kg. CPCB Form-6 generated and fleet scheduled.`
    );
  };

  // Calculated Arbitrage Numbers (Tab 3)
  const currentBidderObj = biddersList.find(b => b.id === selectedBidder) || biddersList[0];
  const topBidRate = currentBidderObj.rate;
  const netSpreadPerKg = topBidRate - avgBatchBuyRate;
  const netSpreadMarginPct = ((netSpreadPerKg / avgBatchBuyRate) * 100).toFixed(1);
  const netYardGain = Math.round((totalBatchWeight || 350) * netSpreadPerKg);
  const grossConsignmentValue = Math.round((totalBatchWeight || 350) * topBidRate);

  return (
    <div className="bg-[#f4f6f8] font-sans text-on-surface antialiased min-h-screen flex flex-col selection:bg-emerald-200">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-emerald-400 text-[24px]">verified</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-emerald-300">{toastMessage.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5">{toastMessage.desc}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* TOP GLOBAL HEADER (Exact Match to Collector Style & Compact App Layout) */}
      <header className="bg-surface-container-lowest border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* Top Branding & Quick Actions Bar */}
        <div className="px-3 sm:px-6 py-2 flex items-center justify-between gap-2 border-b border-slate-100">
          {/* Brand Logo & Name (Matching Collector Page Exactly) */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">recycling</span>
            </div>
            <span className="font-headline-md text-base sm:text-lg font-bold text-primary tracking-tight">
              RE:LINK
            </span>
          </div>

          {/* Right Status Pills & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Synced Status Pill (Matching Collector Page) */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-semibold shrink-0"
              title="Application is Synced"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t.synced}</span>
            </div>

            {/* Language Switcher Button (Matching Collector Page Exactly) */}
            <button
              onClick={handleLanguageCycle}
              aria-label="Switch Language"
              className="flex items-center gap-1 h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-bold cursor-pointer shrink-0"
              title="Switch Language (Hindi / Marathi / English)"
            >
              <span className="material-symbols-outlined text-sm text-primary">language</span>
              <span>{currentLang === 'hi' ? 'हिन्दी' : (currentLang === 'mr' ? 'मराठी' : 'EN')}</span>
            </button>

            {/* User Profile Button with Interactive Dropdown (Matching Collector Page) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(prev => !prev)}
                className="w-8 h-8 rounded-full bg-primary/15 hover:bg-primary/25 active:scale-95 flex items-center justify-center border border-primary/30 text-primary font-bold text-xs cursor-pointer shadow-2xs transition-all shrink-0"
                title="Yard Master Profile & Account Options"
                aria-label="Yard Master Profile"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-11 h-11 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-base font-bold shrink-0">
                      DB
                    </div>
                    <div className="leading-tight flex-1 truncate">
                      <p className="font-bold text-sm text-slate-900 truncate">Dilip Bhai</p>
                      <p className="text-[11px] text-emerald-800 font-semibold">{t.yardMasterAdmin}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                          KYC VERIFIED
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-500 truncate">
                          #KA-AGG-2024-118
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowAdminModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-emerald-700">admin_panel_settings</span>
                      <span>{t.cpcbAdminTools}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowNotifications(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-600">notifications</span>
                      <span>{t.alertsNotifs}</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onRoleSwitch) onRoleSwitch();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-bold transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>{t.logOutRole}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subheader: Yard Desk Live & Facility Reg */}
        <div className="px-3 sm:px-6 pt-2 pb-0.5 flex items-center justify-between">
          <span className="text-teal-950 font-black tracking-wider text-[11px] sm:text-xs uppercase">
            {t.yardDeskLive}
          </span>
          <span className="text-slate-600 font-mono font-bold text-[11px] sm:text-xs tracking-wider uppercase">
            {t.peenyaYard}
          </span>
        </div>

        {/* Dual Hero Cards: Always 2-Columns Side-by-Side (Working Float & Calibrated Scale) */}
        <div className="px-3 sm:px-6 py-1.5 grid grid-cols-2 gap-2 sm:gap-3">
          {/* Card 1: Working Float */}
          <div className="bg-[#f0f4f9] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-700 font-bold text-[11px] sm:text-xs tracking-tight truncate">{t.workingFloat}</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg border border-teal-700/20 text-teal-800 bg-teal-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[15px] sm:text-[17px]">account_balance_wallet</span>
              </div>
            </div>
            <div className="my-1 flex items-baseline gap-1 truncate">
              <span className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight leading-none">
                ₹{workingCapitalFloat.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 font-bold">{t.avail}</span>
            </div>
            <span className="text-slate-500 text-[9.5px] sm:text-[11px] font-medium truncate">
              {t.cashDeskReserve}
            </span>
          </div>

          {/* Card 2: HX711 DIGITAL */}
          <div className="bg-[#0b3829] text-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-emerald-900 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-emerald-300 font-black tracking-wider text-[10.5px] sm:text-xs uppercase truncate">
                {t.hx711Digital}
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-emerald-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">scale</span>
              </div>
            </div>
            <div className="my-1 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="text-[12px] sm:text-base font-black text-white leading-none tracking-tight truncate">
                {t.calibrated}
              </span>
            </div>
            <span className="text-emerald-400/80 font-mono text-[9px] sm:text-[10px] tracking-wider truncate">
              HX711-PEENYA-02-OK
            </span>
          </div>
        </div>

        {/* 4-TAB NAVIGATION BAR (Compact & Clean) */}
        <div className="px-3 sm:px-6 pt-0.5 pb-2 grid grid-cols-4 gap-1 sm:gap-2 border-b border-slate-200">
          {/* Tab 1: Gate & Pay */}
          <button
            onClick={() => setActiveTab('tab-intake')}
            className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tab-intake'
                ? 'bg-[#0b3829] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[22px]">login</span>
            <span className="text-[10px] sm:text-[11.5px] font-bold mt-0.5 tracking-tight truncate">{t.tabGatePay}</span>
          </button>

          {/* Tab 2: Stock & Bays */}
          <button
            onClick={() => setActiveTab('tab-inventory')}
            className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tab-inventory'
                ? 'bg-[#0b3829] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[22px]">warehouse</span>
            <span className="text-[10px] sm:text-[11.5px] font-bold mt-0.5 tracking-tight truncate">{t.tabStockBays}</span>
          </button>

          {/* Tab 3: Arbitrage */}
          <button
            onClick={() => setActiveTab('tab-marketplace')}
            className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tab-marketplace'
                ? 'bg-[#0b3829] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[22px]">trending_up</span>
            <span className="text-[10px] sm:text-[11.5px] font-bold mt-0.5 tracking-tight truncate">{t.tabArbitrage}</span>
          </button>

          {/* Tab 4: Form-6 */}
          <button
            onClick={() => setActiveTab('tab-compliance')}
            className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tab-compliance'
                ? 'bg-[#0b3829] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[19px] sm:text-[22px]">verified_user</span>
            <span className="text-[10px] sm:text-[11.5px] font-bold mt-0.5 tracking-tight truncate">{t.tabForm6}</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ======================================================== */}
        {/* TAB 1: INBOUND INTAKE & CASH DESK                        */}
        {/* ======================================================== */}
        {activeTab === 'tab-intake' && (
          <section className="space-y-6">
            {/* Quick Metric KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">{t.todaysGateInbound}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900">342.0</span>
                    <span className="text-xs font-semibold text-slate-500">kg (18 Lots)</span>
                  </div>
                  <span className="text-[11.5px] text-emerald-700 font-medium">₹1,42,887 {t.disbursed}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">scale</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">{t.verifiedCollectors}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900">14</span>
                    <span className="text-xs font-semibold text-slate-500">{t.activeToday}</span>
                  </div>
                  <span className="text-[11.5px] text-slate-600 font-medium">100% CPCB KYC registered</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">badge</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">Avg Intake Grading</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900">Grade A</span>
                    <span className="text-xs font-semibold text-slate-500">76% of Vol</span>
                  </div>
                  <span className="text-[11.5px] text-emerald-700 font-medium">AI Vision confidence 94%</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">Avg Gate Settlement</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900">1m 45s</span>
                    <span className="text-xs font-semibold text-slate-500">speed</span>
                  </div>
                  <span className="text-[11.5px] text-emerald-700 font-medium">Zero Cash Discrepancy</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined">speed</span>
                </div>
              </div>
            </div>

            {/* Intake Workflow Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Rapid Scanner & Active Weighment Desk (Hero) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Rapid QR Scanner & Token Search Bar */}
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-auto flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                      qr_code_scanner
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleFetchOrScanVoucher(searchQuery)}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowScannerModal(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-primary border border-emerald-200 font-semibold text-[13px] rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      <span>{t.scanCamera}</span>
                    </button>
                    <button
                      onClick={() => handleFetchOrScanVoucher(searchQuery)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-white font-semibold text-[13px] rounded-xl shadow-xs hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">search</span>
                      <span>{t.fetchVoucher}</span>
                    </button>
                  </div>
                </div>

                {/* Active Calibrated Weighment & Instant Settlement Card */}
                {activeLot && (
                  <div className="bg-surface-container-lowest rounded-2xl border-2 border-emerald-600/30 shadow-sm overflow-hidden">
                    {/* Header banner with active status */}
                    <div className="bg-emerald-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="font-bold text-[14px] tracking-wide">{t.activeGateWeighment}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 text-[11px] font-mono">
                          {t.lotNo} {activeLot.lot_ref}
                        </span>
                      </div>
                      <div className="text-[12px] text-emerald-200 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">timer</span>
                        <span>{t.queued} {activeLot.queued_time}</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-6">
                      {/* Collector Profile & Material Tag */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-[16px] flex items-center justify-center shadow-xs">
                            {activeLot.collector_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-[16px] text-slate-900">{activeLot.collector_name}</h3>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 gap-0.5">
                                <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                                {activeLot.rating} Rating
                              </span>
                            </div>
                            <p className="text-[12.5px] text-slate-500">
                              {activeLot.collector_cluster} • Aadhaar KYC Verified ✓
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-bold">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            {activeLot.material_name}
                          </span>
                          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                            {Math.round(activeLot.ai_confidence * 100)}% AI Match
                          </span>
                        </div>
                      </div>

                      {/* Weighbridge Scale Display + Material Snapshot */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        {/* Scale Reading Visual Display */}
                        <div className="md:col-span-7 bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
                          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>
                          <div className="flex items-center justify-between text-slate-400 text-[12px] mb-2">
                            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono uppercase">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              {t.scaleCalibratedISO}
                            </span>
                            <span className="font-mono">
                              {t.tareDeduction}: {activeLot.tare_weight.toFixed(2)} kg | {t.grossWeight}: {(activeNetWeight + activeLot.tare_weight).toFixed(2)} kg
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between my-2">
                            <div>
                              <span className="text-slate-400 text-[11px] uppercase tracking-wider block font-semibold">
                                {t.netVerifiedWeight}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400">
                                  {activeNetWeight.toFixed(2)}
                                </span>
                                <span className="text-lg font-bold text-slate-300">kg</span>
                                {/* Interactive Weight Step Controls */}
                                <div className="flex flex-col gap-1 ml-2">
                                  <button
                                    onClick={() => setActiveNetWeight(prev => parseFloat((prev + 0.5).toFixed(2)))}
                                    className="w-6 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                                    title="Add 0.5 kg"
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={() => setActiveNetWeight(prev => Math.max(0.5, parseFloat((prev - 0.5).toFixed(2))))}
                                    className="w-6 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                                    title="Subtract 0.5 kg"
                                  >
                                    -
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-slate-400 text-[11px] uppercase tracking-wider block font-semibold">
                                {t.mandiBenchmark}
                              </span>
                              <div className="flex items-baseline justify-end gap-1">
                                <span className="text-2xl font-bold font-mono text-white">
                                  ₹{activeApprovedRate}
                                </span>
                                <span className="text-xs text-slate-400 font-normal">/ kg</span>
                              </div>
                              <span className="text-[11px] text-emerald-400 block font-medium">Top Mandi Tier</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11.5px] text-slate-400">
                            <span>Digital Sensor Signature: <code className="text-slate-200">{activeLot.sensor_id}</code></span>
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">lock</span> {t.zeroTareVerified}
                            </span>
                          </div>
                        </div>

                        {/* AI Lot Photo & Grading Verification */}
                        <div className="md:col-span-5 flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <div className="relative rounded-lg overflow-hidden h-32 bg-slate-200 group">
                            <img
                              alt="Lot Verification"
                              className="w-full h-full object-cover"
                              src={activeLot.image_url}
                              onError={(e) => {
                                e.target.src = '/assets/icons/pcb_high.svg';
                              }}
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-white text-[10px] font-mono flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px] text-emerald-400">check_circle</span>
                              <span>AI Vision: Multi-layer Contacts</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[12px] px-1">
                            <span className="text-slate-500 font-medium">{t.askingRate}: ₹{activeLot.asking_rate} / kg</span>
                            <span className="text-primary font-bold">{t.approvedRate}: ₹{activeApprovedRate} / kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Payout Summary & Big 1-Tap Payment Buttons */}
                      <div className="bg-gradient-to-br from-emerald-50/70 to-slate-50 p-5 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{t.calculatedPayoutDue}</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                              ₹{Math.round(activeNetWeight * activeApprovedRate).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                              ({activeNetWeight.toFixed(2)} kg × ₹{activeApprovedRate})
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-500 mt-0.5">
                            {t.tdsDeductions}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                          <button
                            onClick={() => handleProcessPayment('CASH')}
                            disabled={isProcessingPayment || activeLot.status.startsWith('PAID')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-[13.5px] shadow-sm transition-all cursor-pointer ${
                              activeLot.status.startsWith('PAID')
                                ? 'bg-slate-400 text-white cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                            }`}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[20px] text-emerald-400">payments</span>
                            <span>{isProcessingPayment ? t.settling : t.payCash}</span>
                          </button>

                          <button
                            onClick={() => handleProcessPayment('UPI')}
                            disabled={isProcessingPayment || activeLot.status.startsWith('PAID')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-[13.5px] shadow-sm transition-all cursor-pointer ${
                              activeLot.status.startsWith('PAID')
                                ? 'bg-emerald-300 text-white cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-emerald-800 active:scale-95'
                            }`}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                            <span>{isProcessingPayment ? t.settling : t.payUpi}</span>
                          </button>
                        </div>
                      </div>

                      {/* Vernacular Soundbox Simulation & Audit Confirmation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Soundbox Simulation Pill */}
                        <div
                          onClick={() => {
                            const speechText = currentLang === 'mr' ? lastSoundboxMessage.mr : (currentLang === 'en' ? lastSoundboxMessage.en : lastSoundboxMessage.hi);
                            speakAnnouncement(speechText, currentLang === 'mr' ? 'mr-IN' : (currentLang === 'en' ? 'en-IN' : 'hi-IN'));
                            showToast('Soundbox Replay', speechText);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] cursor-pointer hover:bg-amber-100 transition-colors"
                          title="Click to hear soundbox announcement again"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-900 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">volume_up</span>
                          </div>
                          <div>
                            <span className="font-bold block text-[12.5px]">{t.soundboxTitle}</span>
                            <span className="italic text-amber-800">
                              "{currentLang === 'mr' ? lastSoundboxMessage.mr : (currentLang === 'en' ? lastSoundboxMessage.en : lastSoundboxMessage.hi)}"
                            </span>
                          </div>
                        </div>

                        {/* Ledger Audit Status */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[12px]">
                          <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center text-emerald-900 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                          </div>
                          <div>
                            <span className="font-bold block text-[12.5px]">{t.collectorLedgerSynced}</span>
                            <span className="text-emerald-800">
                              Receipt #RCP-{activeLot.lot_ref.slice(-5)} SMS/Token Sent to +91 98450-XXXXX
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Recent Inbound Queue & Live Mandi Ticker */}
              <div className="lg:col-span-4 space-y-6">
                {/* 🚛 Doorstep Pickup Requests Card (Contextual Inbound Navigation) */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border-2 border-amber-500/30 shadow-xs space-y-3 bg-gradient-to-br from-amber-50/40 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      </div>
                      <h3 className="font-bold text-[14.5px] text-slate-900">
                        🚛 {t.pickupRequests}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                      3
                    </span>
                  </div>

                  {/* Active Doorstep Request Item */}
                  <div className="p-3.5 rounded-xl border border-amber-200/80 bg-white space-y-2.5 shadow-2xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-[13.5px] block">Ramesh Kumar</span>
                        <span className="text-xs text-slate-600 block mt-0.5">
                          PCB • <b>12 kg</b>
                        </span>
                        <span className="text-[11.5px] text-amber-800 font-medium flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span>📍 1.8 km away • Peenya Sector 2</span>
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                        Est. ₹9,060
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      {!pickupAcceptedMap['lot_rl_00482'] ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const rameshLot = inboundLots.find(l => l.id === 'lot_rl_00482') || inboundLots[0];
                              setActiveLot(rameshLot);
                              setActiveNetWeight(rameshLot.net_weight);
                              setActiveApprovedRate(rameshLot.approved_rate);
                              showToast('Viewing Lot', `Loaded ${rameshLot.lot_ref} for Ramesh Kumar`);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer text-center transition-colors"
                          >
                            {t.viewLot}
                          </button>
                          <button
                            onClick={() => {
                              setPickupAcceptedMap(prev => ({ ...prev, 'lot_rl_00482': true }));
                              showToast('Pickup Accepted ✓', 'Assigned Driver Rajesh Kumar. Click Start Navigation to route.');
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer text-center transition-colors"
                          >
                            {t.acceptPickup}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                            <span className="font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              <span>{t.pickupAccepted}</span>
                            </span>
                            <span className="font-mono text-[11px]">1.8 km</span>
                          </div>
                          <button
                            onClick={() => {
                              const rameshLot = inboundLots.find(l => l.id === 'lot_rl_00482') || inboundLots[0];
                              setNavLotData(rameshLot);
                              setNavModalMode('INBOUND_PICKUP');
                              setShowDealerNav(true);
                            }}
                            className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
                          >
                            <span className="material-symbols-outlined text-[16px] text-emerald-300">navigation</span>
                            <span>{t.startNavigation}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Inbound Queue Card */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[15px] text-slate-900">{t.recentInboundQueue}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        {t.today}
                      </span>
                    </div>
                    <span className="text-[12px] text-primary font-semibold">
                      {inboundLots.length} {t.activeLots}
                    </span>
                  </div>

                  {/* Queue Items */}
                  <div className="space-y-2.5">
                    {inboundLots.map((lot) => {
                      const isSelected = activeLot?.id === lot.id;
                      return (
                        <div
                          key={lot.id}
                          onClick={() => {
                            setActiveLot(lot);
                            setActiveNetWeight(lot.net_weight);
                            setActiveApprovedRate(lot.approved_rate);
                          }}
                          className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-emerald-50/40 shadow-xs'
                              : 'border-slate-200/80 bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-[12px] flex items-center justify-center">
                                {lot.collector_name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <span className="font-bold text-[13.5px] text-slate-900 block leading-tight">
                                  {lot.collector_name}
                                </span>
                                <span className="text-[11px] text-slate-500 leading-tight flex items-center gap-1 mt-0.5">
                                  {lot.handover_type === 'DOORSTEP_PICKUP' || lot.status === 'PICKUP_SCHEDULED' ? (
                                    <span className="text-amber-800 font-semibold flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                      <span className="material-symbols-outlined text-[12px]">local_shipping</span>
                                      <span>Pickup ({lot.driver_eta || '35m'})</span>
                                    </span>
                                  ) : (
                                    <span className="text-emerald-800 font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                      <span className="material-symbols-outlined text-[12px]">storefront</span>
                                      <span>Gate Drop</span>
                                    </span>
                                  )}
                                  <span>• {lot.lot_ref}</span>
                                </span>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              lot.status === 'PAID_CASH'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lot.status === 'PAID_UPI'
                                ? 'bg-blue-100 text-blue-800'
                                : lot.status === 'PICKUP_SCHEDULED'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : lot.status === 'INSPECTION'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {lot.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[12px] pt-1 border-t border-slate-200/60">
                            <span className="text-slate-600 truncate max-w-[180px]">
                              {lot.net_weight} kg {lot.material_name}
                            </span>
                            <span className="font-bold text-slate-900 font-mono">
                              ₹{Math.round(lot.net_weight * lot.approved_rate).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Mandi Daily Price Benchmark */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <h3 className="font-bold text-[14px] text-slate-900">Live Mandi Daily Ticker</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Bangalore North Zone</span>
                  </div>
                  <div className="space-y-2.5 text-[12.5px]">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700 font-medium">PCB Grade A (High-yield)</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 font-mono">₹{broadcastMandiRates.pcb} / kg</span>
                        <span className="text-[10.5px] text-emerald-600 font-semibold block">+₹15 vs yesterday</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-700 font-medium">Bright Copper Wire 99%</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 font-mono">₹{broadcastMandiRates.copper} / kg</span>
                        <span className="text-[10.5px] text-emerald-600 font-semibold block">+₹5 vs yesterday</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-700 font-medium">Lithium NMC Cells (Packs)</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 font-mono">₹{broadcastMandiRates.battery} / kg</span>
                        <span className="text-[10.5px] text-slate-500 font-semibold block">Unchanged</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 2: YARD INVENTORY & BATCH CONSOLIDATION ENGINE       */}
        {/* ======================================================== */}
        {activeTab === 'tab-inventory' && (
          <section className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-[20px] font-bold text-slate-900">Yard Physical Stock &amp; Micro-Lot Aggregation</h2>
                  <p className="text-[13px] text-secondary">
                    Organized inventory segregated into tamper-proof bins ready for commercial batch consolidation
                  </p>
                </div>
                <button
                  onClick={() => {
                    setScaleCalibrated(true);
                    showToast('Scales Refreshed', 'Weighbridge zero tare and RS-232 telemetry synchronized.');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-[13px] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[17px]">sync</span>
                  <span>Refresh Scales</span>
                </button>
              </div>

              {/* 3 Material Stock Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: PCBs */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border-2 border-emerald-500/40 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold uppercase tracking-wide">
                        {inventoryStock.PCB.status}
                      </span>
                      <h3 className="text-[16px] font-bold text-slate-900 mt-2">{inventoryStock.PCB.category}</h3>
                      <p className="text-[12px] text-slate-500">Grade-A Motherboards &amp; Telecom cards</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">developer_board</span>
                    </div>
                  </div>

                  <div className="my-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-extrabold text-slate-900 font-mono">
                          {inventoryStock.PCB.stock_kg.toFixed(1)}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 ml-1">kg</span>
                      </div>
                      <span className="text-[12px] font-bold text-emerald-700">
                        {inventoryStock.PCB.micro_lots_count} Micro-lots
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (inventoryStock.PCB.stock_kg / inventoryStock.PCB.target_pallet_kg) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {Math.round((inventoryStock.PCB.stock_kg / inventoryStock.PCB.target_pallet_kg) * 100)}% of {inventoryStock.PCB.target_pallet_kg} kg pallet target reached
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[12.5px] pt-2 border-t border-slate-100">
                    <span className="text-slate-600">Avg Cost: <b>₹{inventoryStock.PCB.avg_cost_inr}/kg</b></span>
                    <span className="text-emerald-700 font-bold">{inventoryStock.PCB.bin}</span>
                  </div>
                </div>

                {/* Card 2: Copper Cables */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold uppercase tracking-wide">
                        {inventoryStock.CABLES.status}
                      </span>
                      <h3 className="text-[16px] font-bold text-slate-900 mt-2">{inventoryStock.CABLES.category}</h3>
                      <p className="text-[12px] text-slate-500">Industrial &amp; Appliance Wiring (94% Cu)</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <span className="material-symbols-outlined">cable</span>
                    </div>
                  </div>

                  <div className="my-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-extrabold text-slate-900 font-mono">
                          {inventoryStock.CABLES.stock_kg.toFixed(1)}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 ml-1">kg</span>
                      </div>
                      <span className="text-[12px] font-bold text-blue-700">
                        {inventoryStock.CABLES.micro_lots_count} Micro-lots
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (inventoryStock.CABLES.stock_kg / inventoryStock.CABLES.target_pallet_kg) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {Math.round((inventoryStock.CABLES.stock_kg / inventoryStock.CABLES.target_pallet_kg) * 100)}% of {inventoryStock.CABLES.target_pallet_kg} kg bundle target
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[12.5px] pt-2 border-t border-slate-100">
                    <span className="text-slate-600">Avg Cost: <b>₹{inventoryStock.CABLES.avg_cost_inr}/kg</b></span>
                    <span className="text-slate-700 font-bold">{inventoryStock.CABLES.bin}</span>
                  </div>
                </div>

                {/* Card 3: Li-ion Batteries */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wide">
                        {inventoryStock.BATTERIES.status}
                      </span>
                      <h3 className="text-[16px] font-bold text-slate-900 mt-2">{inventoryStock.BATTERIES.category}</h3>
                      <p className="text-[12px] text-slate-500">EV &amp; Laptop NMC / LFP Cells</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <span className="material-symbols-outlined">battery_charging_full</span>
                    </div>
                  </div>

                  <div className="my-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-extrabold text-slate-900 font-mono">
                          {inventoryStock.BATTERIES.stock_kg.toFixed(1)}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 ml-1">kg</span>
                      </div>
                      <span className="text-[12px] font-bold text-amber-700">
                        {inventoryStock.BATTERIES.micro_lots_count} Micro-lots
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (inventoryStock.BATTERIES.stock_kg / inventoryStock.BATTERIES.target_pallet_kg) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {Math.round((inventoryStock.BATTERIES.stock_kg / inventoryStock.BATTERIES.target_pallet_kg) * 100)}% of {inventoryStock.BATTERIES.target_pallet_kg} kg Hazmat Drum target
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[12.5px] pt-2 border-t border-slate-100">
                    <span className="text-slate-600">Avg Cost: <b>₹{inventoryStock.BATTERIES.avg_cost_inr}/kg</b></span>
                    <span className="text-amber-800 font-bold">{inventoryStock.BATTERIES.bin}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Consolidation Engine Core Panel */}
            <div className="bg-surface-container-lowest rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wide">
                      Batch Engine
                    </span>
                    <h3 className="text-[18px] font-bold text-slate-900">Create Bulk Commercial Consignment Batch</h3>
                  </div>
                  <p className="text-[12.5px] text-slate-500">
                    Bundle micro-collector intakes into formal traceable lot with CPCB Form-6 manifest tagging
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-slate-500 font-medium">
                    Selected: <b>{selectedLots.length} Micro-Lots ({totalBatchWeight.toFixed(1)} kg)</b>
                  </span>
                  <button
                    onClick={handleSelectAllQualified}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[12px] rounded-lg cursor-pointer transition-colors"
                  >
                    {batchMicroLots.every(i => i.selected) ? 'Deselect All' : 'Select All Qualified'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Multi-lot micro-collector table */}
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wide block">
                    Qualified Micro-Lots in Batch Buffer
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-[12.5px]">
                    <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-600 grid grid-cols-12 border-b border-slate-200">
                      <span className="col-span-1">
                        <input
                          type="checkbox"
                          checked={batchMicroLots.every(i => i.selected)}
                          onChange={handleSelectAllQualified}
                          className="rounded text-primary focus:ring-primary cursor-pointer"
                        />
                      </span>
                      <span className="col-span-4">Lot # &amp; Collector</span>
                      <span className="col-span-3">Material Grade</span>
                      <span className="col-span-2 text-right">Net Wt</span>
                      <span className="col-span-2 text-right">Cost Rate</span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {batchMicroLots.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleMicroLot(item.id)}
                          className={`px-4 py-2.5 grid grid-cols-12 items-center font-medium transition-colors cursor-pointer ${
                            item.selected ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="col-span-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => handleToggleMicroLot(item.id)}
                              className="rounded text-primary focus:ring-primary cursor-pointer"
                            />
                          </span>
                          <div className="col-span-4 flex flex-col">
                            <span className="font-bold text-slate-900">{item.ref}</span>
                            <span className="text-[11px] text-slate-500">{item.collector}</span>
                          </div>
                          <span className="col-span-3 text-emerald-800 font-semibold">{item.grade}</span>
                          <span className="col-span-2 text-right font-bold text-slate-900 font-mono">
                            {item.weight.toFixed(1)} kg
                          </span>
                          <span className="col-span-2 text-right text-slate-700 font-mono">
                            ₹{item.rate}/kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Batch Manifest & Target Consignment Card */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-emerald-50/50 p-5 rounded-xl border border-emerald-200/80 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                          Generated Commercial Batch
                        </span>
                        <h4 className="text-xl font-extrabold text-slate-900">#BATCH-KA-PCB-104</h4>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[30px] text-slate-800">qr_code_2</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-[13px]">
                      <div className="flex justify-between py-1 border-b border-slate-200/80">
                        <span className="text-slate-500">Material Designation:</span>
                        <span className="font-bold text-slate-900">Grade-A PCB Palletized</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/80">
                        <span className="text-slate-500">Gross / Net Weight:</span>
                        <span className="font-bold text-emerald-700 text-[15px] font-mono">
                          {totalBatchWeight.toFixed(2)} kg Net (1 Pallet)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/80">
                        <span className="text-slate-500">Aggregated Sourcing Cost:</span>
                        <span className="font-bold text-slate-900 font-mono">
                          ₹{Math.round(totalBatchCost).toLocaleString('en-IN')} (₹{avgBatchBuyRate} / kg)
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">EPR Token Provenance:</span>
                        <span className="font-semibold text-blue-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">link</span>
                          {selectedLots.length} Collector Proofs Linked
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('tab-marketplace');
                      showToast('Consignment Published', 'Batch #BATCH-KA-PCB-104 published to B2B Recycler Board.');
                    }}
                    className="w-full py-3 bg-primary hover:bg-emerald-800 text-white font-bold text-[14px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    type="button"
                  >
                    <span>Consolidate &amp; Publish to B2B Board</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 3: OUTBOUND B2B RECYCLER MARKETPLACE                 */}
        {/* ======================================================== */}
        {activeTab === 'tab-marketplace' && (
          <section className="space-y-6">
            {/* Marketplace Header Banner */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    Authorized Smelter / Recycler Auction
                  </span>
                  <span className="text-[12px] text-slate-500">• 5 Formal Bidders Online</span>
                </div>
                <h2 className="text-[22px] font-black text-slate-900 mt-1">Commercial Consignment #BATCH-KA-PCB-104</h2>
                <p className="text-[13px] text-secondary">
                  {totalBatchWeight.toFixed(1)} kg Palletized Grade-A PCB Motherboards • Sealed CPCB Tamper Tag #KA-TG-9821
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800 block">Current High Bid</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    ₹{topBidRate}<span className="text-xs text-slate-500 font-normal font-sans"> / kg</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Spread & Financial Mechanics Breakdown Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Profit Spread Details */}
              <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                <h3 className="font-bold text-[16px] text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                  <span>Dealer Arbitrage &amp; Profit Spread Calculation</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Avg Yard Buy Rate</span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-1 block font-mono">₹{avgBatchBuyRate} / kg</span>
                    <span className="text-[11px] text-slate-500">14 micro-lot blended avg</span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/70">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide block">Top Recycler Bid</span>
                    <span className="text-2xl font-extrabold text-blue-900 mt-1 block font-mono">₹{topBidRate} / kg</span>
                    <span className="text-[11px] text-blue-700 font-medium">E-Parisaraa / EcoRecycle</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/70">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">Net Profit Spread</span>
                    <span className="text-2xl font-extrabold text-emerald-700 mt-1 block font-mono">+₹{netSpreadPerKg} / kg</span>
                    <span className="text-[11px] font-bold text-emerald-800">+{netSpreadMarginPct}% Spread Margin</span>
                  </div>
                </div>

                {/* Total Consignment Commercial Value */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider block">
                      Net Yard Profit on this Consignment
                    </span>
                    <div className="text-3xl font-black text-white mt-0.5 font-mono">
                      +₹{netYardGain.toLocaleString('en-IN')}{' '}
                      <span className="text-sm font-normal text-emerald-200 font-sans">Net Yard Gain</span>
                    </div>
                    <p className="text-[11.5px] text-emerald-200/80 mt-1">
                      Total Consignment Value: ₹{grossConsignmentValue.toLocaleString('en-IN')} (Gross Payout from Formal Smelter)
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-800/80 border border-emerald-700 text-center text-white text-[12px] font-medium shrink-0">
                    Immediate RTGS on Weighment
                  </div>
                </div>

                {/* Active Recycler Bid List */}
                <div className="space-y-3 pt-2">
                  <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider block">
                    Live Competitive Wholesale Bids
                  </span>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {biddersList.map((b) => {
                      const isBidSelected = selectedBidder === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBidder(b.id)}
                          className={`p-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                            isBidSelected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg font-bold text-[12px] flex items-center justify-center ${
                              isBidSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {b.code}
                            </div>
                            <div>
                              <span className="font-bold text-[13.5px] text-slate-900 block leading-tight">
                                {b.name}
                              </span>
                              <span className="text-[11.5px] text-slate-500">{b.desc}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-black text-emerald-700 text-[16px] font-mono">
                              ₹{b.rate} / kg
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ml-2 ${b.bgBadge}`}>
                              {b.badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Logistics Dispatch & Lock Settlement */}
              <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-bold text-[16px] text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">local_shipping</span>
                    <span>Logistics &amp; Smelter Dispatch Mode</span>
                  </h3>

                  {/* 📦 Outbound Bulk Batch Consignment Card (Contextual Navigation Architecture) */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                          Consolidated Batch Consignment
                        </span>
                        <h4 className="font-black text-sm sm:text-base text-slate-900 mt-0.5">
                          📦 Batch #04
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Grade-A PCB • <b>{totalBatchWeight.toFixed(0)} kg</b> ({batchMicroLots.filter(m => m.selected).length || 14} Lots)
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-mono">
                        ₹{grossConsignmentValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Recycler:</span>
                        <span className="font-bold text-slate-900 block">{currentBidderObj.name}</span>
                        <span className="text-emerald-800 text-[11.5px] font-medium flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">location_on</span>
                          <span>📍 14.8 km away • Dabaspet Smelter</span>
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase border border-emerald-200">
                        Pickup: Available
                      </span>
                    </div>

                    {/* Quick Mode Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLogisticsType('RECYCLER_PICKUP')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                          logisticsType === 'RECYCLER_PICKUP'
                            ? 'bg-[#0d3b2e] text-white border-[#0d3b2e] shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {t.requestRecyclerPickup}
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogisticsType('SELF_TRANSPORT')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                          logisticsType === 'SELF_TRANSPORT'
                            ? 'bg-[#0d3b2e] text-white border-[#0d3b2e] shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {t.selfTransport}
                      </button>
                    </div>

                    {/* Contextual Navigation Trigger (Shown if Self-Transport selected) */}
                    {logisticsType === 'SELF_TRANSPORT' && (
                      <div className="pt-2 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs text-emerald-900 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                          <span className="font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-emerald-700">local_shipping</span>
                            <span>Self-Transport Mode (+₹10/kg Freight Rebate)</span>
                          </span>
                          <span className="font-mono text-[11px]">14.8 km route</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNavBatchData({
                              batch_number: 'BATCH-KA-PCB-104',
                              weight_kg: totalBatchWeight || 350.0,
                              recycler_name: currentBidderObj.name,
                              recycler_location: 'Plot 41-43, Dabaspet Industrial Area, NH 48, Bengaluru Rural'
                            });
                            setNavModalMode('OUTBOUND_DISPATCH');
                            setShowDealerNav(true);
                          }}
                          className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
                        >
                          <span className="material-symbols-outlined text-[16px] text-emerald-300">navigation</span>
                          <span>Start Navigation</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pre-dispatch inspection checklist */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-[12px]">
                    <span className="font-bold text-slate-700 block uppercase tracking-wide text-[11px]">
                      Consignment Dispatch Checklist
                    </span>
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.tareVerified}
                        onChange={(e) => setChecklist(prev => ({ ...prev, tareVerified: e.target.checked }))}
                        className="rounded text-primary focus:ring-primary w-4 h-4"
                      />
                      <span>Moisture &amp; Tare deduction verified at scale (&lt;0.5%)</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.sortingConfirmed}
                        onChange={(e) => setChecklist(prev => ({ ...prev, sortingConfirmed: e.target.checked }))}
                        className="rounded text-primary focus:ring-primary w-4 h-4"
                      />
                      <span>Battery/Capacitor non-hazardous sorting confirmed</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.manifestReady}
                        onChange={(e) => setChecklist(prev => ({ ...prev, manifestReady: e.target.checked }))}
                        className="rounded text-primary focus:ring-primary w-4 h-4"
                      />
                      <span>CPCB Form-6 Manifest ready for driver countersignature</span>
                    </label>
                  </div>
                </div>

                {/* Lock Wholesale Deal Action Button */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleLockWholesaleDeal}
                    className="w-full py-3.5 bg-tertiary hover:bg-tertiary-container text-white font-bold text-[14px] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                    <span>{dealLocked ? 'Deal Locked ✓ (Consignment Dispatched)' : 'Lock Wholesale Deal & Dispatch Consignment'}</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-500">
                    Locks ₹{topBidRate}/kg bid price &amp; reserves collection truck driver allocation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 4: FORM-6 COMPLIANCE & PROVENANCE TREE               */}
        {/* ======================================================== */}
        {activeTab === 'tab-compliance' && (
          <section className="space-y-6">
            {/* CPCB 2022 Compliance Status Card */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] fill-current">verified</span>
                    CPCB E-Waste (Management) Rules 2022 Verified
                  </span>
                  <span className="text-[12px] text-slate-500">• Yard Audit Status: Passed (0 Non-conformances)</span>
                </div>
                <h2 className="text-[20px] font-black text-slate-900 mt-1">EPR Credit &amp; Form-6 Provenance Tree Engine</h2>
                <p className="text-[13px] text-secondary">
                  Complete unbroken custody trail from informal itinerant collectors through aggregator yard to R2/CPCB registered smelter.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedManifestData({
                      cert: 'CPCB-EPR-2026-KA-B104',
                      lot: '#BATCH-KA-PCB-104',
                      collector: 'Peenya Aggregator Hub (Dilip Bhai)',
                      material: 'Grade-A PCB Palletized (High Yield)',
                      weight: `${totalBatchWeight.toFixed(1)} kg`,
                      payout: `₹${grossConsignmentValue.toLocaleString('en-IN')}`,
                      mode: 'RTGS / Bank Transfer',
                      date: new Date().toLocaleDateString('en-IN') + ' 15:30 IST',
                      hash: 'SHA256: CPCB-EPR-2026-KA-B104-F92E'
                    });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-[13px] hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Generate CPCB Form-6 Manifest (PDF)</span>
                </button>
              </div>
            </div>

            {/* Provenance Tree Visual Diagram Card */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-[16px] text-slate-900">Consignment #BATCH-KA-PCB-104 End-to-End Lineage</h3>
                  <p className="text-[12px] text-slate-500">
                    Every gram mapped to registered collector Aadhaar IDs &amp; non-hazardous certifications
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[12px] font-bold">
                  Zero Open-Air Burning Proof ✓
                </span>
              </div>

              {/* The Hierarchy Tree Nodes */}
              <div className="space-y-6 relative">
                {/* Root Level: Recycler Consignment */}
                <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
                      <span className="material-symbols-outlined">factory</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block">
                        Consignment Destination (Smelter)
                      </span>
                      <span className="font-bold text-base">E-Parisaraa Pvt Ltd (CPCB Authorised Refiner #CPCB-EWR-2022-771)</span>
                      <span className="text-slate-400 text-xs block font-mono">
                        Manifest ID: FORM6-2026-KA-0982 | Target: Copper &amp; Precious Metal Refining
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {totalBatchWeight.toFixed(2)} kg
                    </span>
                    <span className="text-xs text-slate-300 block font-mono">1 Pallet Grade-A PCB</span>
                  </div>
                </div>

                {/* Connector vertical line */}
                <div className="w-0.5 h-6 bg-slate-300 mx-auto"></div>

                {/* Middle Level: Aggregator Yard (Dilip Bhai) */}
                <div className="bg-emerald-50 border-2 border-emerald-500/50 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center">
                      <span className="material-symbols-outlined">warehouse</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-900 font-bold block">
                        Aggregator Hub &amp; Gate Desk
                      </span>
                      <span className="font-bold text-base text-slate-900">
                        Peenya Yard 04 - Dilip Bhai (Om Scrap Aggregators)
                      </span>
                      <span className="text-slate-600 text-xs block font-mono">
                        CPCB Aggregator Reg #KA-AGG-2024-118 • ISO 14001 Yard Facility
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      100% Non-Hazardous Depolluted
                    </span>
                  </div>
                </div>

                {/* Connector vertical line */}
                <div className="w-0.5 h-6 bg-slate-300 mx-auto"></div>

                {/* Collector Level: Micro-intakes breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide px-1">
                    <span>Sourced From 14 Verified Informal Collectors (Traceable Micro-Lots)</span>
                    <span className="text-emerald-700">100% Direct-to-Collector UPI/Cash Ledger</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Collector Leaf 1 */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-[13px] block">Ramesh Kumar</span>
                        <span className="text-[11px] text-slate-500">Lot #RL-00482 • Peenya #3</span>
                        <span className="text-[11px] text-emerald-700 block font-semibold">12.0 kg Grade-A PCB</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-[12.5px] font-mono">₹9,060</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold block mt-1">
                          CPCB KYC ✓
                        </span>
                      </div>
                    </div>

                    {/* Collector Leaf 2 */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-[13px] block">Shivaji Rao</span>
                        <span className="text-[11px] text-slate-500">Lot #RL-00479 • Yeshwantpur</span>
                        <span className="text-[11px] text-emerald-700 block font-semibold">45.0 kg Server Trays</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-[12.5px] font-mono">₹33,525</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold block mt-1">
                          CPCB KYC ✓
                        </span>
                      </div>
                    </div>

                    {/* Collector Leaf 3 */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-[13px] block">Anita Bai</span>
                        <span className="text-[11px] text-slate-500">Lot #RL-00475 • Dasarahalli</span>
                        <span className="text-[11px] text-emerald-700 block font-semibold">38.5 kg Telecom Cards</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-[12.5px] font-mono">₹28,413</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold block mt-1">
                          CPCB KYC ✓
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100/70 rounded-xl border border-dashed border-slate-300 text-center text-[12px] text-slate-600 font-medium">
                    + 11 other itinerant collectors contributing 254.5 kg (
                    <button
                      onClick={() => showToast('Schedule A Annexure', 'Downloading full 14-collector audit schedule CSV...')}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      Download Complete Form-6 Schedule A Collector Annexure
                    </button>
                    )
                  </div>
                </div>
              </div>

              {/* Form-6 Legal Compliance Declaration footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span>
                    Cryptographic EPR Hash: <code className="font-mono text-slate-700 font-bold">CPCB-EPR-2026-KA-B104-F92E</code>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => showToast('Traceability Tree', 'All 14 collector signatures, GPS coordinates, and weighbridge stamps verified.')}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    View Collector Traceability Tree
                  </button>
                  <span className="text-slate-300">|</span>
                  <span className="text-emerald-700 font-medium">CPCB Portal Synced (Live)</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Camera / QR Code Scanner Modal (Live Camera + Cross-Portal Collector Lots) */}
      {showScannerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-outline-variant space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">qr_code_scanner</span>
                <div>
                  <h3 className="font-bold text-base text-on-surface">{t.scanCollectorLotQr}</h3>
                  <p className="text-[11px] text-on-surface-variant">{t.gateInboundReader}</p>
                </div>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Live Camera Viewfinder or Simulated Box */}
            <div className="relative rounded-xl overflow-hidden h-52 bg-slate-950 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/50 shadow-inner">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : null}

              {/* Viewfinder Reticle & Laser Scan Line Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20">
                <div className="w-36 h-36 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-400 animate-pulse top-1/2 shadow-[0_0_8px_#34d399]"></div>
                  {!cameraActive && (
                    <span className="material-symbols-outlined text-4xl text-emerald-400/40">qr_code_2</span>
                  )}
                </div>
                <span className="text-[11px] text-emerald-300 mt-2 font-mono bg-black/60 px-2 py-0.5 rounded">
                  {cameraActive ? `📷 Camera Active • ${t.alignCollectorSlip}` : t.alignCollectorSlip}
                </span>
              </div>
            </div>

            {/* Manual QR Token / Voucher Code Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualQrInput}
                onChange={(e) => setManualQrInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchOrScanVoucher(manualQrInput)}
                placeholder={t.pasteQrPlaceholder}
                className="flex-1 px-3 py-2 text-xs bg-surface-container rounded-xl border border-outline-variant font-mono text-on-surface focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => handleFetchOrScanVoucher(manualQrInput)}
                className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-800 cursor-pointer shrink-0 transition-all active:scale-95"
              >
                {t.load}
              </button>
            </div>

            {/* List of Live Available Vouchers from Memory and LocalStorage */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                {t.simulateQrScan}
              </span>
              {(() => {
                let combined = [...inboundLots];
                try {
                  const stored = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
                  stored.forEach(sl => {
                    if (!combined.some(l => l.lot_ref === sl.lot_ref || l.id === sl.id)) {
                      combined.unshift(sl);
                    }
                  });
                } catch (e) {}
                return combined.slice(0, 5).map((lot) => (
                  <button
                    key={lot.id || lot.lot_ref}
                    type="button"
                    onClick={() => handleFetchOrScanVoucher(lot.lot_ref || lot.id)}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between gap-2 text-xs font-bold transition-colors cursor-pointer border text-left ${
                      lot.is_new_live_intake
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[18px] text-primary shrink-0">qr_code</span>
                      <div className="truncate">
                        <span className="block leading-tight font-mono text-[11.5px] truncate">{lot.lot_ref}</span>
                        <span className="text-[10px] text-secondary font-normal block truncate">
                          {lot.collector_name} • {lot.net_weight} kg {lot.material_name || lot.material_category}
                        </span>
                      </div>
                    </div>
                    {lot.is_new_live_intake ? (
                      <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 animate-pulse">
                        Collector Slip
                      </span>
                    ) : (
                      <span className="text-[10.5px] text-primary font-mono shrink-0">
                        ₹{Math.round(lot.net_weight * lot.approved_rate).toLocaleString('en-IN')}
                      </span>
                    )}
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onSelectNotification={(notif) => {
          setShowNotifications(false);
          showToast('Notification Selected', notif.title);
        }}
      />

      {/* Admin Master Tools Modal */}
      <AdminToolsModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />

      {/* Statutory CPCB Form-6 Manifest Modal */}
      <Form6ManifestModal
        isOpen={Boolean(selectedManifestData)}
        onClose={() => setSelectedManifestData(null)}
        certData={selectedManifestData}
      />

      {/* Contextual Dealer Navigation Modal (Inbound Pickup & Outbound Dispatch) */}
      <DealerNavigationModal
        isOpen={showDealerNav}
        onClose={() => setShowDealerNav(false)}
        mode={navModalMode}
        lotData={navLotData}
        batchData={navBatchData}
        currentLang={currentLang}
        onArrivedAtCollector={(lot) => {
          setActiveTab('tab-intake');
          if (lot) {
            setActiveLot(lot);
            setActiveNetWeight(lot.net_weight);
            setActiveApprovedRate(lot.approved_rate);
          }
          showToast('Arrived at Collector Doorstep', `Electronic scale ready for ${lot?.collector_name || 'Ramesh Kumar'}`);
        }}
        onDeliveryConfirmed={(batch) => {
          setDealLocked(true);
          showToast('Consignment Delivered to Smelter!', `Form-6 digital signed at ${batch?.recycler_name || 'Cerebra Smelter'}`);
        }}
      />
    </div>
  );
}
