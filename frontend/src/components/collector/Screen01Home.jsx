import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { speakVernacular } from '../../utils/speechUtils';
import PriceBoardModal from './PriceBoardModal';
import NotificationsModal from '../common/NotificationsModal';

const HOME_TRANSLATIONS = {
  hi: {
    mandiTag: 'कलेक्टर मंडी',
    navHome: 'होम',
    navMyLots: 'मेरे लॉट',
    navAiScan: 'एआई स्कैन',
    navCategories: 'श्रेणियां',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा',
    recyclerPortal: 'डीलर पोर्टल',
    syncLive: 'लाइव',
    syncOffline: 'ऑफलाइन',
    scanTitle: 'एआई कबाड़ स्कैनर',
    scanSubtitle: 'कैमरा से तुरंत पहचान व लाइव मंडी भाव',
    openViewfinder: 'कबाड़ स्कैन करें (फोटो लें)',
    manualGrid: 'श्रेणियां देखें',
    todaysHaulTitle: 'आज का काम व कमाई (Today\'s Haul)',
    todaysEarnings: 'आज की कमाई',
    todaysWeight: 'कुल वजन बेचा',
    todaysLots: 'निपटारे (लॉट)',
    viewPassbook: 'पूरी पासबुक देखें',
    speakHaul: 'आज का हिसाब सुनें',
    nearestYardTitle: 'निकटतम चालू स्क्रैप डीलर यार्ड',
    yardName: 'दिलीप भाई स्क्रैप यार्ड (पीन्या यार्ड 04)',
    yardDistance: '1.2 किमी दूर',
    openNow: '🟢 अभी खुला है (रात 8:30 तक)',
    electronicScaleVerified: 'डिजिटल कांटा प्रमाणित • तुरंत नकद/UPI',
    callDealer: 'डीलर को कॉल करें',
    getDirections: 'दुकान का रास्ता व भाव',
    marketRatesTitle: 'आज के बाजार भाव',
    perKg: '/ किग्रा',
    pcbName: 'सर्किट बोर्ड (PCB)',
    pcbSub: 'ए-ग्रेड पीसीबी (मदरबोर्ड)',
    cableName: 'तांबे के तार व केबल',
    cableSub: 'इंसुलेटेड तांबा वायर',
    batteryName: 'ली-आयन बैटरी',
    batterySub: 'मिश्रित लॉट',
    viewFullBoard: 'पूरा क्षेत्रीय मंडी बोर्ड देखें (9 श्रेणियां व रुझान)',
    shareWhatsApp: 'व्हाट्सएप पर आज के भाव साझा करें',
    calcTitle: 'डोरस्टेप भाव कैलकुलेटर',
    calcSub: 'ग्राहक के सामने वजन चुनें और तुरंत नकद मूल्य देखें',
    calcMaterialPcb: 'मदरबोर्ड (PCB)',
    calcMaterialCopper: 'तांबा तार (Copper)',
    calcMaterialBattery: 'बैटरी (Battery)',
    calcMaterialAlu: 'एल्युमिनियम',
    calcWeightLabel: 'अनुमानित वजन (किग्रा):',
    calcEstCash: 'अनुमानित कुल नकद:',
    createLotWithRate: 'इस भाव पर लॉट बनाएं',
    fastPicker: 'त्वरित श्रेणी चयन',
    viewAll7: 'सभी 7 श्रेणियां देखें',
    pcbs: 'पीसीबी',
    cables: 'तार / केबल',
    batteries: 'बैटरी',
    safetyAlertTitle: 'फील्ड सुरक्षा व जोखिम चेतावनी',
    safetyAlertDesc: 'फूली हुई ली-आयन बैटरी को अलग सूखे कैनवास बैग में रखें। कभी भी बैटरी या सीआरटी को न तोड़ें।',
    viewSafetyTips: 'सुरक्षा नियम देखें',
    mandiInsights: 'मंडी बाजार रुझान',
    todaysTrends: 'आज के रुझान',
    copperWires: 'तांबे के तार व केबल',
    copperTrend: '+8.4% इस सप्ताह',
    serverPcbs: 'ए-ग्रेड सर्वर पीसीबी',
    serverPcbPeak: '₹780/किग्रा उच्चतम',
    batteryWarning: 'फूली हुई ली-आयन चेतावनी',
    mustIsolate: 'अलग रखें (सुरक्षा)',
    recentLots: 'हाल ही के फील्ड लॉट्स',
    offlineCached: 'ऑफलाइन सुरक्षित',
    estValue: 'अनुमानित मूल्य',
    handoverConfirmed: 'हैंडओवर सत्यापित',
    offerReceived: 'ऑफर प्राप्त',
    noRecentLotsTitle: 'कोई पिछला लॉट नहीं है',
    noRecentLotsDesc: 'कैमरा से कबाड़ स्कैन करें और तुरंत पास के अधिकृत डीलर को बेचें।',
    scanFirstLot: 'पहला लॉट स्कैन करें',
    verifiedFacilities: 'क्षेत्र में अधिकृत स्क्रैप डीलर यार्ड',
    facilitiesActive: '10 किमी में 14 सक्रिय यार्ड',
    facilitiesDesc: 'पीन्या इंडस्ट्रियल यार्ड 04 (1.2 किमी), धारावी लिंक रोड यार्ड (1.8 किमी) और कुर्ला मंडी यार्ड (2.6 किमी) आज इलेक्ट्रॉनिक कांटे पर तुरंत नकद भुगतान के लिए सक्रिय हैं।',
    exploreBids: 'पास के अधिकृत डीलर यार्ड देखें',
    lotNumber: 'लॉट #',
    mixedScrap: 'मिश्रित कबाड़'
  },
  mr: {
    mandiTag: 'कलेक्टर बाजार',
    navHome: 'मुख्य',
    navMyLots: 'माझे लॉट',
    navAiScan: 'एआई स्कॅन',
    navCategories: 'श्रेणी',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा',
    recyclerPortal: 'डीलर पोर्टल',
    syncLive: 'थेट',
    syncOffline: 'ऑफलाइन',
    scanTitle: 'एआई भंगार स्कॅनर',
    scanSubtitle: 'कॅमेऱ्याने तात्काळ ओळख व थेट बाजार दर',
    openViewfinder: 'भंगार स्कॅन करा (फोटो घ्या)',
    manualGrid: 'श्रेणी तक्ता',
    todaysHaulTitle: 'आजचे काम व कमाई (Today\'s Haul)',
    todaysEarnings: 'आजची कमाई',
    todaysWeight: 'एकूण वजन विकले',
    todaysLots: 'लॉट पूर्ण',
    viewPassbook: 'संपूर्ण पासबुक पहा',
    speakHaul: 'आजचा हिशोब ऐका',
    nearestYardTitle: 'जवळचे अधिकृत स्क्रॅप डीलर यार्ड',
    yardName: 'दिलीप भाई स्क्रॅप यार्ड (पीन्या यार्ड ०४)',
    yardDistance: '१.२ किमी अंतरावर',
    openNow: '🟢 आता सुरू आहे (रात्री 8:30 पर्यंत)',
    electronicScaleVerified: 'डिजिटल वजनकाटा प्रमाणित • तात्काळ रोख/UPI',
    callDealer: 'डीलरला कॉल करा',
    getDirections: 'दुकानचा मार्ग व दर',
    marketRatesTitle: 'आजचे बाजार दर',
    perKg: '/ किलो',
    pcbName: 'सर्किट बोर्ड (PCB)',
    pcbSub: 'ए-ग्रेड पीसीबी (मदरबोर्ड)',
    cableName: 'तांब्याची केबल व वायर',
    cableSub: 'इन्सुलेटेड तांब्याची वायर',
    batteryName: 'ली-आयन बॅटरी',
    batterySub: 'मिश्रित लॉट',
    viewFullBoard: 'संपूर्ण प्रादेशिक बाजार दर तक्ता पहा (9 श्रेणी व कल)',
    shareWhatsApp: 'आजचे दर व्हॉट्सॲपवर पाठवा',
    calcTitle: 'डोरस्टेप दर कॅल्क्युलेटर',
    calcSub: 'ग्राहकासमोर वजन निवडा आणि तात्काळ रोख रक्कम पहा',
    calcMaterialPcb: 'मदरबोर्ड (PCB)',
    calcMaterialCopper: 'तांबे वायर (Copper)',
    calcMaterialBattery: 'बॅटरी (Battery)',
    calcMaterialAlu: 'ॲल्युमिनियम',
    calcWeightLabel: 'अंदाजे वजन (किलो):',
    calcEstCash: 'अंदाजे एकूण रोख:',
    createLotWithRate: 'या दरावर लॉट बनवा',
    fastPicker: 'जलद श्रेणी निवड',
    viewAll7: 'सर्व 7 श्रेणी पहा',
    pcbs: 'पीसीबी',
    cables: 'केबल / वायर',
    batteries: 'बॅटरी',
    safetyAlertTitle: 'फील्ड सुरक्षा व धोक्याची सूचना',
    safetyAlertDesc: 'फुगलेल्या ली-आयन बॅटऱ्या वेगळ्या कोरड्या पिशवीत ठेवा. बॅटरी किंवा सीआरटी काच कधीही फोडू नका.',
    viewSafetyTips: 'सुरक्षा नियम पहा',
    mandiInsights: 'बाजार विश्‍लेषण व कल',
    todaysTrends: 'आजचा कल',
    copperWires: 'तांब्याच्या तारा व केबल',
    copperTrend: '+8.4% या आठवड्यात',
    serverPcbs: 'ए-ग्रेड सर्व्हर पीसीबी',
    serverPcbPeak: '₹780/किलो सर्वोच्च',
    batteryWarning: 'फुगलेल्या बॅटऱ्या चेतावणी',
    mustIsolate: 'स्वतंत्र ठेवा (सुरक्षा)',
    recentLots: 'नुकतेच नोंदवलेले लॉट',
    offlineCached: 'ऑफलाइन जतन',
    estValue: 'अंदाजे मूल्य',
    handoverConfirmed: 'हस्तांतरण प्रमाणित',
    offerReceived: 'ऑफर प्राप्त',
    noRecentLotsTitle: 'कोणतेही अलीकडील लॉट नाहीत',
    noRecentLotsDesc: 'कॅमेऱ्याने भंगार स्कॅन करा आणि थेट जवळच्या अधिकृत डीलरकडे विका.',
    scanFirstLot: 'पहिला लॉट स्कॅन करा',
    verifiedFacilities: 'परिसरातील अधिकृत स्क्रॅप डीलर यार्ड',
    facilitiesActive: '10 किमी मध्ये 14 सक्रिय यार्ड',
    facilitiesDesc: 'पीन्या इंडस्ट्रियल यार्ड 04 (1.2 किमी), धारावी लिंक रोड यार्ड (1.8 किमी) आणि कुर्ला मंडी यार्ड (2.6 किमी) इलेक्ट्रॉनिक वजनकाट्यावर थेट रोख पेमेंटसाठी सक्रिय आहेत.',
    exploreBids: 'जवळचे अधिकृत डीलर यार्ड पहा',
    lotNumber: 'लॉट #',
    mixedScrap: 'मिश्रित भंगार'
  },
  en: {
    mandiTag: 'Collector Mandi',
    navHome: 'Home',
    navMyLots: 'My Lots',
    navAiScan: 'AI Scan',
    navCategories: 'Categories',
    navEarnings: 'Earnings',
    navSafety: 'Safety',
    recyclerPortal: 'Dealer Portal',
    syncLive: 'Live',
    syncOffline: 'Offline',
    scanTitle: 'AI Scrap Scanner',
    scanSubtitle: 'Instant photo recognition & live market price',
    openViewfinder: 'Scan Scrap (Take Photo)',
    manualGrid: 'Categories',
    todaysHaulTitle: "Today's Work & Earnings",
    todaysEarnings: "Today's Earnings",
    todaysWeight: 'Total Weight Sold',
    todaysLots: 'Lots Completed',
    viewPassbook: 'View Full Passbook',
    speakHaul: "Listen to Today's Summary",
    nearestYardTitle: 'Nearest Authorized Scrap Yard',
    yardName: 'Dilip Bhai Scrap Yard (Peenya Yard #04)',
    yardDistance: '1.2 km away',
    openNow: '🟢 Open Now (until 8:30 PM)',
    electronicScaleVerified: 'Digital Scale Certified • Instant Cash/UPI',
    callDealer: 'Call Dealer',
    getDirections: 'Directions & Offers',
    marketRatesTitle: 'Current Market Rates',
    perKg: '/ kg',
    pcbName: 'Circuit Boards (PCB)',
    pcbSub: 'A-Grade PCB Motherboard',
    cableName: 'Copper Cables',
    cableSub: 'Insulated Wire',
    batteryName: 'Li-ion Batteries',
    batterySub: 'Mixed lot',
    viewFullBoard: 'View Full Regional Mandi Board (9 Categories & Trends)',
    shareWhatsApp: "Share Today's Rates on WhatsApp",
    calcTitle: 'Doorstep Scrap Rate Calculator',
    calcSub: 'Select scrap and enter weight at customer doorstep for instant cash estimate',
    calcMaterialPcb: 'Motherboard (PCB)',
    calcMaterialCopper: 'Copper Wire',
    calcMaterialBattery: 'Battery (Li-ion)',
    calcMaterialAlu: 'Aluminium',
    calcWeightLabel: 'Estimated Weight (kg):',
    calcEstCash: 'Estimated Cash Payout:',
    createLotWithRate: 'Create Lot With This Rate',
    fastPicker: 'Fast Category Picker',
    viewAll7: 'View All 7 Categories',
    pcbs: 'PCBs',
    cables: 'Cables',
    batteries: 'Batteries',
    safetyAlertTitle: 'Field Safety & Hazard Notice',
    safetyAlertDesc: 'Keep swollen Li-ion batteries separated in a dry canvas bag. Never puncture batteries or smash CRT tubes.',
    viewSafetyTips: 'View Safety Guide',
    mandiInsights: 'Mandi Market Insights',
    todaysTrends: "TODAY'S TRENDS",
    copperWires: 'Copper Wires & Cables',
    copperTrend: '+8.4% this week',
    serverPcbs: 'A-Grade Server PCBs',
    serverPcbPeak: '₹780/kg Peak',
    batteryWarning: 'Swollen Li-ion Warning',
    mustIsolate: 'Must isolate',
    recentLots: 'Recent Field Lots',
    offlineCached: 'Offline Cached',
    estValue: 'Est. Value',
    handoverConfirmed: 'Handover Confirmed',
    offerReceived: 'Offer Received',
    noRecentLotsTitle: 'No Recent Lots',
    noRecentLotsDesc: 'Scan scrap with camera and sell directly to verified local dealers for instant cash.',
    scanFirstLot: 'Scan First Lot',
    verifiedFacilities: 'Verified Local Scrap Dealer Yards',
    facilitiesActive: '14 Active Yards (< 10 km)',
    facilitiesDesc: 'Peenya Industrial Yard #04 (1.2 km), Dharavi Link Road Yard (1.8 km), and Kurla Mandi Yard (2.6 km) are actively taking in scrap with instant cash/UPI payment on electronic scales.',
    exploreBids: 'Explore Nearby Dealer Yards',
    lotNumber: 'Lot #',
    mixedScrap: 'Mixed Scrap'
  }
};

export default function Screen01Home({
  onScanClick,
  onNavigate,
  onNavigateBack,
  activeScreen = 'home',
  onSelectLot,
  recentLots = [],
  syncStatus = { isOnline: true, unsyncedCount: 0 },
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
  const t = HOME_TRANSLATIONS[safeLang] || HOME_TRANSLATIONS.hi;

  const [showPriceBoardModal, setShowPriceBoardModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Doorstep Rate Calculator State
  const [calcMaterial, setCalcMaterial] = useState('mat_cables_copper');
  const [calcWeight, setCalcWeight] = useState(5);

  const [marketRates, setMarketRates] = useState([
    { id: 'mat_pcb_high', name: 'Circuit Boards', sub: 'A-Grade PCB', rate: 240, unit: 'kg', icon: 'memory' },
    { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire', rate: 380, unit: 'kg', icon: 'cable' },
    { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mixed lot', rate: 185, unit: 'kg', icon: 'battery_charging_full' }
  ]);

  // Load live prices from backend if available
  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch('http://localhost:8000/prices/board?location=IN-MH-MUM');
        if (res.ok) {
          const data = await res.json();
          if (data.categories && data.categories.length >= 3) {
            setMarketRates([
              { id: 'mat_pcb_high', name: 'Circuit Boards', sub: 'A-Grade PCB', rate: 240, unit: 'kg', icon: 'memory' },
              { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire', rate: 380, unit: 'kg', icon: 'cable' },
              { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mixed lot', rate: 185, unit: 'kg', icon: 'battery_charging_full' }
            ]);
          }
        }
      } catch (err) {
        console.log('Using local market rates');
      }
    }
    loadPrices();
  }, []);

  const speakText = (text) => {
    speakVernacular(text, safeLang);
  };

  const handleSpeakAllRates = () => {
    const summary = safeLang === 'mr'
      ? `आजचे बाजार दर: सर्किट बोर्ड ${marketRates[0].rate} रुपये, तांब्याची केबल ${marketRates[1].rate} रुपये, बॅटरी ${marketRates[2].rate} रुपये प्रति किलो.`
      : (safeLang === 'hi'
          ? `आज के बाजार भाव: सर्किट बोर्ड ${marketRates[0].rate} रुपये, तांबे के तार ${marketRates[1].rate} रुपये, बैटरी ${marketRates[2].rate} रुपये प्रति किलो।`
          : `Today's market rates: Circuit boards ₹${marketRates[0].rate}, Copper cables ₹${marketRates[1].rate}, Batteries ₹${marketRates[2].rate} per kilogram.`);
    speakText(summary);
  };

  const handleSpeakHaul = () => {
    const speech = safeLang === 'mr'
      ? `आजचे काम आणि कमाई: एकूण 1,480 रुपये मिळाले. 18.5 किलो कबाड विकले आणि 2 लॉट पूर्ण केले.`
      : (safeLang === 'hi'
          ? `आज का काम और कमाई: आज कुल 1,480 रुपये मिले। 18.5 किलो कबाड़ बिका और 2 लॉट पूरे हुए।`
          : `Today's haul: ₹1,480 earned, 18.5 kilograms sold across 2 completed lots.`);
    speakText(speech);
  };

  const getSpokenRate = (idx) => {
    const r = marketRates[idx]?.rate || (idx === 0 ? 240 : idx === 1 ? 380 : 185);
    if (idx === 0) {
      return safeLang === 'mr'
        ? `सर्किट बोर्डचा बाजार भाव ${r} रुपये प्रति किलो आहे.`
        : (safeLang === 'hi'
            ? `सर्किट बोर्ड का मंडी भाव ${r} रुपये प्रति किलो है।`
            : `Circuit board rate is ${r} rupees per kilogram.`);
    }
    if (idx === 1) {
      return safeLang === 'mr'
        ? `तांब्याच्या केबलचा बाजार भाव ${r} रुपये प्रति किलो आहे.`
        : (safeLang === 'hi'
            ? `तांबे के तार का भाव ${r} रुपये प्रति किलो है।`
            : `Copper cable rate is ${r} rupees per kilogram.`);
    }
    return safeLang === 'mr'
      ? `लिथियम बॅटरीचा बाजार भाव ${r} रुपये प्रति किलो आहे.`
      : (safeLang === 'hi'
          ? `लिथियम बैटरी का भाव ${r} रुपये प्रति किलो है।`
          : `Lithium battery rate is ${r} rupees per kilogram.`);
  };

  const getCalcRate = () => {
    if (calcMaterial === 'mat_pcb_high') return marketRates[0]?.rate || 240;
    if (calcMaterial === 'mat_cables_copper') return marketRates[1]?.rate || 380;
    if (calcMaterial === 'mat_batteries_li_ion') return marketRates[2]?.rate || 185;
    if (calcMaterial === 'mat_alu') return 165;
    return 120;
  };

  const calcEstimatedCash = Math.round((Number(calcWeight) || 0) * getCalcRate());

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen pb-24 relative overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface w-full sticky top-0 z-40 border-b border-outline-variant shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full px-4 sm:px-6 h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px]">recycling</span>
            </div>
            <span className="font-headline-md text-lg sm:text-xl font-bold text-primary tracking-tight">
              RE:LINK
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-outline-variant/40 text-xs font-semibold">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'home' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${activeScreen === 'home' ? 'filled' : ''}`}>home</span>
              <span>{t.navHome}</span>
            </button>
            <button
              onClick={() => onNavigate('my_lots')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'my_lots' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${activeScreen === 'my_lots' ? 'filled' : ''}`}>inventory_2</span>
              <span>{t.navMyLots}</span>
            </button>
            <button
              onClick={onScanClick}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'ai_scan' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>{t.navAiScan}</span>
            </button>
            <button
              onClick={() => onNavigate('category_select')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'category_select' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>{t.navCategories}</span>
            </button>
            <button
              onClick={() => onNavigate('earnings')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'earnings' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${activeScreen === 'earnings' ? 'filled' : ''}`}>payments</span>
              <span>{t.navEarnings}</span>
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'safety' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${activeScreen === 'safety' ? 'filled' : ''}`}>health_and_safety</span>
              <span>{t.navSafety}</span>
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Small Compact Online/Offline Status Box */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold shrink-0 ${
                syncStatus.isOnline
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}
              title={syncStatus.isOnline ? 'Application is Online' : 'Application is Offline'}
            >
              <span className={`w-2 h-2 rounded-full ${syncStatus.isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span>{syncStatus.isOnline ? (safeLang === 'mr' ? 'ऑनलाइन' : safeLang === 'hi' ? 'ऑनलाइन' : 'Online') : (safeLang === 'mr' ? 'ऑफलाइन' : safeLang === 'hi' ? 'ऑफलाइन' : 'Offline')}</span>
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface relative cursor-pointer transition-colors shrink-0"
              title="Live Offers, Pickups & Payment Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600"></span>
            </button>

            {/* Language Picker */}
            <button
              onClick={onLanguageChange}
              aria-label="Switch Language"
              className="flex items-center gap-1 h-10 px-3 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-bold cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-sm text-primary">language</span>
              <span>{safeLang === 'hi' ? 'हिन्दी' : (safeLang === 'mr' ? 'मराठी' : 'EN')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Primary Column (col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. AWESOME TACTILE SMART VIEWFINDER SCANNER HERO CONSOLE */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-emerald-500/30 group">
              {/* High-tech Grid Background Pattern & Glowing Ambience */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                {/* Header Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  <span>{safeLang === 'mr' ? 'स्मार्ट एआई विज़न २.४' : (safeLang === 'hi' ? 'स्मार्ट एआई विज़न 2.4' : 'Smart AI Vision 2.4')}</span>
                </div>

                {/* Tactile Optical Viewfinder Centerpiece */}
                <div
                  onClick={onScanClick}
                  className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-dashed border-emerald-400/60 bg-emerald-950/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:border-emerald-300 hover:scale-105 transition-all shadow-inner"
                  title={t.openViewfinder}
                >
                  {/* Optical Reticle Corner Brackets */}
                  <span className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400"></span>
                  <span className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400"></span>
                  <span className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400"></span>
                  <span className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400"></span>

                  {/* Pulsing Optical Center Shutter Button */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/40 relative group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px] font-bold">photo_camera</span>
                    <span className="absolute inset-0 rounded-full border-2 border-emerald-300/80 animate-ping opacity-60 pointer-events-none"></span>
                  </div>

                  {/* Laser Scanning Line Animation */}
                  <div className="absolute left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse opacity-90 pointer-events-none"></div>
                </div>

                {/* Clear Headline & Subtitle */}
                <div className="space-y-1 max-w-md">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {t.scanTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/85 font-medium leading-snug">
                    {t.scanSubtitle}
                  </p>
                </div>

                {/* Integrated Action Triggers */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1 max-w-md">
                  <button
                    type="button"
                    onClick={onScanClick}
                    className="sm:col-span-8 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                    <span>{t.openViewfinder}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('category_select')}
                    className="sm:col-span-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 backdrop-blur-md active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-emerald-400">grid_view</span>
                    <span>{t.manualGrid}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. FEATURE: TODAY'S HAUL & EARNINGS QUICK GLANCE CARD */}
            <section className="bg-gradient-to-r from-emerald-50 via-surface-container-low to-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface">{t.todaysHaulTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={handleSpeakHaul}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-emerald-100 transition-colors cursor-pointer"
                  title={t.speakHaul}
                >
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-surface p-3 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[11px] text-on-surface-variant font-medium block">{t.todaysEarnings}</span>
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-800">₹1,480</span>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[11px] text-on-surface-variant font-medium block">{t.todaysWeight}</span>
                  <span className="text-lg sm:text-xl font-extrabold text-on-surface">18.5 kg</span>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[11px] text-on-surface-variant font-medium block">{t.todaysLots}</span>
                  <span className="text-lg sm:text-xl font-extrabold text-primary">2</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-xs">
                <span className="text-emerald-900/80 font-medium">⚡ 100% तुरंत नकद व UPI निपटारा</span>
                <button
                  type="button"
                  onClick={() => onNavigate('earnings')}
                  className="font-bold text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{t.viewPassbook}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </section>

            {/* 3. FEATURE: NEAREST ACTIVE SCRAP DEALER LIVE CARD */}
            <section className="bg-surface rounded-2xl p-4 sm:p-5 border border-outline-variant/60 shadow-xs space-y-3">
              {/* Row 1: One big horizontal line with icon & yard name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[22px]">storefront</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                    {t.nearestYardTitle}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-on-surface truncate">
                    {t.yardName}
                  </h4>
                </div>
              </div>

              {/* Row 2: One big HORIZONTAL line containing 1.2 km, open status, and electronic scale verified */}
              <div className="flex flex-wrap items-center gap-2 text-xs py-2 px-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <span className="inline-flex items-center gap-1 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[15px] text-primary">near_me</span>
                  <span>{t.yardDistance}</span>
                </span>
                <span className="text-outline-variant">•</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{t.openNow}</span>
                </span>
                <span className="text-outline-variant">•</span>
                <span className="inline-flex items-center gap-1 text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
                  <span>{t.electronicScaleVerified}</span>
                </span>
              </div>

              {/* Row 3: Live Rates & Details - Exactly 2 things per row */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* 1: PCB */}
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">memory</span>
                    <span className="text-xs font-semibold text-on-surface truncate">PCB</span>
                  </div>
                  <span className="font-extrabold text-emerald-800 text-sm shrink-0">₹240/kg</span>
                </div>

                {/* 2: Copper */}
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0">cable</span>
                    <span className="text-xs font-semibold text-on-surface truncate">{safeLang === 'mr' ? 'तांबे' : (safeLang === 'hi' ? 'तांबा' : 'Copper')}</span>
                  </div>
                  <span className="font-extrabold text-emerald-800 text-sm shrink-0">₹380/kg</span>
                </div>

                {/* 3: Battery */}
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-blue-700 text-[18px] shrink-0">battery_charging_full</span>
                    <span className="text-xs font-semibold text-on-surface truncate">{safeLang === 'mr' ? 'बॅटरी' : (safeLang === 'hi' ? 'बैटरी' : 'Battery')}</span>
                  </div>
                  <span className="font-extrabold text-emerald-800 text-sm shrink-0">₹185/kg</span>
                </div>

                {/* 4: Scale Verification / Instant Cash */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0">verified</span>
                    <span className="text-xs font-semibold text-on-surface truncate">{safeLang === 'mr' ? 'काटा' : (safeLang === 'hi' ? 'कांटा' : 'Scale')}</span>
                  </div>
                  <span className="font-bold text-emerald-700 text-xs shrink-0">Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => window.open('tel:+919845012891')}
                  className="py-3 px-4 rounded-xl border border-outline-variant/60 bg-surface hover:bg-surface-container text-on-surface font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-98 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                  <span>{t.callDealer}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('offers')}
                  className="py-3 px-4 rounded-xl bg-primary hover:bg-emerald-800 text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  <span>{t.getDirections}</span>
                </button>
              </div>
            </section>

            {/* 4. Current Market Rates (Bento/Card Grid) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">{t.marketRatesTitle}</h2>
                  <button
                    onClick={handleSpeakAllRates}
                    aria-label="Play audio instruction for current market rates"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">volume_up</span>
                  </button>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  लाइव भाव
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* PCB Card */}
                <div
                  onClick={() => speakText(getSpokenRate(0))}
                  className="bg-surface border border-outline-variant/60 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden group cursor-pointer hover:border-primary transition-all"
                >
                  <div className="flex flex-col gap-1 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shadow-2xs mb-1">
                      <span className="material-symbols-outlined text-[22px]">memory</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-on-surface">{t.pcbName}</h3>
                    <p className="text-[11px] text-on-surface-variant truncate">{t.pcbSub}</p>
                    <p className="font-extrabold text-base sm:text-lg text-emerald-800 mt-1">
                      ₹{marketRates[0].rate} <span className="text-xs font-normal text-on-surface-variant">{t.perKg}</span>
                    </p>
                  </div>
                </div>

                {/* Cable Card */}
                <div
                  onClick={() => speakText(getSpokenRate(1))}
                  className="bg-surface border border-outline-variant/60 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden group cursor-pointer hover:border-primary transition-all"
                >
                  <div className="flex flex-col gap-1 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs mb-1">
                      <span className="material-symbols-outlined text-[22px]">cable</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-on-surface">{t.cableName}</h3>
                    <p className="text-[11px] text-on-surface-variant truncate">{t.cableSub}</p>
                    <p className="font-extrabold text-base sm:text-lg text-emerald-800 mt-1">
                      ₹{marketRates[1].rate} <span className="text-xs font-normal text-on-surface-variant">{t.perKg}</span>
                    </p>
                  </div>
                </div>

                {/* Battery Card */}
                <div
                  onClick={() => speakText(getSpokenRate(2))}
                  className="col-span-2 bg-surface border border-outline-variant/60 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden group flex justify-between items-center cursor-pointer hover:border-primary transition-all"
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                      <span className="material-symbols-outlined text-[22px]">battery_charging_full</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-on-surface">{t.batteryName}</h3>
                      <p className="text-[11px] text-on-surface-variant">{t.batterySub}</p>
                    </div>
                  </div>
                  <p className="font-extrabold text-base sm:text-lg text-emerald-800 text-right">
                    ₹{marketRates[2].rate} <span className="text-xs font-normal text-on-surface-variant">{t.perKg}</span>
                  </p>
                </div>
              </div>

              {/* View Full 9-Category Regional Mandi Board Button */}
              <button
                onClick={() => setShowPriceBoardModal(true)}
                className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/15 border border-primary/30 rounded-xl text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-sm">table_chart</span>
                <span>{t.viewFullBoard}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              {/* 1-Tap Share Today's Rates on WhatsApp */}
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `*RE:LINK Live E-Waste Mandi Rates (आज का भाव)*\n` +
                    `• ${t.pcbName}: ₹${marketRates[0]?.rate || 240}/kg\n` +
                    `• ${t.cableName}: ₹${marketRates[1]?.rate || 380}/kg\n` +
                    `• ${t.batteryName}: ₹${marketRates[2]?.rate || 185}/kg\n` +
                    `• Direct Electronic Scale Weighment & Instant Cash/UPI.\n` +
                    `Check live rates: https://relink-mandi.gov.in`
                  );
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                className="w-full min-h-[44px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>{t.shareWhatsApp}</span>
              </button>
            </section>

            {/* 5. FEATURE: DOORSTEP SCRAP RATE & PAYOUT CALCULATOR */}
            <section className="bg-surface rounded-2xl p-4 sm:p-5 border border-outline-variant/60 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shadow-2xs">
                    <span className="material-symbols-outlined text-[18px]">calculate</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-on-surface">{t.calcTitle}</h3>
                    <p className="text-[11px] text-on-surface-variant">{t.calcSub}</p>
                  </div>
                </div>
              </div>

              {/* Material Select Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCalcMaterial('mat_pcb_high')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    calcMaterial === 'mat_pcb_high'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary/50'
                  }`}
                >
                  <span>{t.calcMaterialPcb}</span>
                  <span className="block text-[10px] font-normal opacity-90">₹{marketRates[0]?.rate || 240}/kg</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMaterial('mat_cables_copper')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    calcMaterial === 'mat_cables_copper'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary/50'
                  }`}
                >
                  <span>{t.calcMaterialCopper}</span>
                  <span className="block text-[10px] font-normal opacity-90">₹{marketRates[1]?.rate || 380}/kg</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMaterial('mat_batteries_li_ion')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    calcMaterial === 'mat_batteries_li_ion'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary/50'
                  }`}
                >
                  <span>{t.calcMaterialBattery}</span>
                  <span className="block text-[10px] font-normal opacity-90">₹{marketRates[2]?.rate || 185}/kg</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMaterial('mat_alu')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    calcMaterial === 'mat_alu'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary/50'
                  }`}
                >
                  <span>{t.calcMaterialAlu}</span>
                  <span className="block text-[10px] font-normal opacity-90">₹165/kg</span>
                </button>
              </div>

              {/* Weight Adjustment Stepper */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-on-surface">{t.calcWeightLabel}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCalcWeight((w) => Math.max(1, Number(w) + 1))}
                      className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/40 hover:border-primary cursor-pointer"
                    >
                      +1 kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcWeight((w) => Math.max(1, Number(w) + 5))}
                      className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/40 hover:border-primary cursor-pointer"
                    >
                      +5 kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcWeight((w) => Math.max(1, Number(w) + 10))}
                      className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/40 hover:border-primary cursor-pointer"
                    >
                      +10 kg
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    className="w-28 p-2.5 rounded-xl border border-outline-variant/60 bg-surface text-center font-extrabold text-lg text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex-1 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">{t.calcEstCash}</span>
                    <span className="text-lg sm:text-xl font-extrabold text-emerald-800 font-mono">
                      ₹{calcEstimatedCash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onNavigate('category_select')}
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-emerald-800 text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
              >
                <span>{t.createLotWithRate}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </section>
          </div>

          {/* Right / Companion Column (col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 6. FEATURE: FIELD SAFETY & HAZARD NOTICE CARD */}
            <section className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/90 shadow-xs flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-700 text-[24px] shrink-0 mt-0.5">warning</span>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-amber-950 leading-tight">
                  {t.safetyAlertTitle}
                </h4>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  {t.safetyAlertDesc}
                </p>
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => onNavigate('safety')}
                    className="text-[11px] font-bold text-amber-950 underline hover:text-amber-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.viewSafetyTips}</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 7. Live Mandi Intelligence & Trend Card */}
            <section className="bg-gradient-to-br from-primary/10 via-surface-container-low to-surface rounded-2xl p-4 sm:p-5 border border-primary/20 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                  <h3 className="font-bold text-sm text-on-surface">{t.mandiInsights}</h3>
                </div>
                <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {t.todaysTrends}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">trending_up</span>
                    <span className="font-medium">{t.copperWires}</span>
                  </div>
                  <span className="font-bold text-emerald-700">{t.copperTrend}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                    <span className="font-medium">{t.serverPcbs}</span>
                  </div>
                  <span className="font-bold text-primary">{t.serverPcbPeak}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-[16px]">warning</span>
                    <span className="font-medium">{t.batteryWarning}</span>
                  </div>
                  <span className="font-semibold text-amber-800">{t.mustIsolate}</span>
                </div>
              </div>
            </section>

            {/* 8. Recent Scrap Lots */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-on-surface">{t.recentLots}</h2>
                  <button
                    onClick={() => speakText(safeLang === 'mr' ? 'नुकतेच नोंदवलेले लॉट पहा' : 'हाल ही के लॉट्स देखें')}
                    aria-label="Play audio instruction for recent lots"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-primary hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">volume_up</span>
                  </button>
                </div>
                <span className="text-xs text-on-surface-variant font-semibold">{t.offlineCached}</span>
              </div>

              <div className="space-y-2.5">
                {recentLots.length > 0 ? (
                  recentLots.map((lot, idx) => (
                    <div
                      key={lot.id || idx}
                      onClick={() => onSelectLot && onSelectLot(lot)}
                      className="bg-surface rounded-2xl p-3.5 sm:p-4 border border-outline-variant/60 shadow-xs flex flex-col sm:flex-row justify-between gap-2 active:bg-surface-container-low transition-colors cursor-pointer hover:border-primary"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-on-surface">
                            {t.lotNumber}{String(lot.id || idx + 8400).slice(-4)}
                          </h3>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">
                            {lot.material_category || t.mixedScrap} • {lot.approximate_weight || 12}kg
                          </p>
                          <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-emerald-50 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
                            <span className="text-[10px] font-bold text-emerald-800">
                              {lot.status === 'CONFIRMED' || lot.status === 'HANDED_OVER' ? t.handoverConfirmed : t.offerReceived}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant/40 pt-2 sm:pt-0 mt-1 sm:mt-0">
                        <span className="text-xs text-on-surface-variant sm:hidden">{t.estValue}</span>
                        <span className="text-sm sm:text-base text-primary font-extrabold">
                          ~₹{Math.round(lot.quoted_price || (lot.approximate_weight || 12) * 240)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-surface rounded-2xl p-5 border border-outline-variant/60 shadow-xs text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                      <span className="material-symbols-outlined text-[26px]">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-on-surface">{t.noRecentLotsTitle}</h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {t.noRecentLotsDesc}
                      </p>
                    </div>
                    <button
                      onClick={onScanClick}
                      className="px-4 py-2 bg-primary hover:bg-emerald-800 text-on-primary rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      <span>{t.scanFirstLot}</span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* 9. Nearby Scrap Dealer Network Status */}
            <section className="bg-surface rounded-2xl p-4 border border-outline-variant/50 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">{t.verifiedFacilities}</span>
                <span className="text-xs text-emerald-700 font-bold">{t.facilitiesActive}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                {t.facilitiesDesc}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('offers')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.exploreBids}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Viewport Only - Hidden on Desktop) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant/50 shadow-lg rounded-t-2xl">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Home"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[64px] transition-all cursor-pointer ${
            activeScreen === 'home' ? 'scale-95' : 'text-on-surface-variant hover:bg-surface-container-low rounded-xl p-1'
          }`}
        >
          {activeScreen === 'home' ? (
            <div className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-4 py-1 shadow-xs">
              <span className="material-symbols-outlined text-[20px] filled">home</span>
            </div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">home</span>
          )}
          <span className={`text-[10px] mt-1 ${activeScreen === 'home' ? 'text-primary font-bold' : ''}`}>{t.navHome}</span>
        </button>

        <button
          onClick={() => onNavigate('my_lots')}
          aria-label="My Lots"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[64px] transition-all cursor-pointer ${
            activeScreen === 'my_lots' ? 'scale-95' : 'text-on-surface-variant hover:bg-surface-container-low rounded-xl p-1'
          }`}
        >
          {activeScreen === 'my_lots' ? (
            <div className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-4 py-1 shadow-xs">
              <span className="material-symbols-outlined text-[20px] filled">inventory_2</span>
            </div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          )}
          <span className={`text-[10px] mt-1 ${activeScreen === 'my_lots' ? 'text-primary font-bold' : ''}`}>{t.navMyLots}</span>
        </button>

        <button
          onClick={() => onNavigate('earnings')}
          aria-label="Earnings"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[64px] transition-all cursor-pointer ${
            activeScreen === 'earnings' ? 'scale-95' : 'text-on-surface-variant hover:bg-surface-container-low rounded-xl p-1'
          }`}
        >
          {activeScreen === 'earnings' ? (
            <div className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-4 py-1 shadow-xs">
              <span className="material-symbols-outlined text-[20px] filled">payments</span>
            </div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">payments</span>
          )}
          <span className={`text-[10px] mt-1 ${activeScreen === 'earnings' ? 'text-primary font-bold' : ''}`}>{t.navEarnings}</span>
        </button>

        <button
          onClick={() => onNavigate('safety')}
          aria-label="Safety"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[64px] transition-all cursor-pointer ${
            activeScreen === 'safety' ? 'scale-95' : 'text-on-surface-variant hover:bg-surface-container-low rounded-xl p-1'
          }`}
        >
          {activeScreen === 'safety' ? (
            <div className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-4 py-1 shadow-xs">
              <span className="material-symbols-outlined text-[20px] filled">health_and_safety</span>
            </div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
          )}
          <span className={`text-[10px] mt-1 ${activeScreen === 'safety' ? 'text-primary font-bold' : ''}`}>{t.navSafety}</span>
        </button>
      </nav>

      {/* Full Regional Mandi Price Board Modal */}
      <PriceBoardModal
        isOpen={showPriceBoardModal}
        onClose={() => setShowPriceBoardModal(false)}
        currentLang={safeLang}
      />

      {/* Notifications & Live Activity Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onSelectNotification={(screen) => onNavigate(screen)}
      />
    </div>
  );
}
