import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    recyclerPortal: 'रीसायकलर पोर्टल',
    syncLive: 'लाइव',
    syncOffline: 'ऑफलाइन',
    scanTitle: 'कबाड़ स्कैन करें • तुरंत पहचानें',
    scanSubtitle: 'एआई कैमरा पहचान • तुरंत भाव',
    openViewfinder: 'एआई कैमरा खोलें',
    manualGrid: 'मैनुअल 7-श्रेणी ग्रिड',
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
    fastPicker: 'त्वरित श्रेणी चयन',
    viewAll7: 'सभी 7 श्रेणियां देखें',
    pcbs: 'पीसीबी',
    cables: 'तार / केबल',
    batteries: 'बैटरी',
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
    recyclerPortal: 'रिसायकलर पोर्टल',
    syncLive: 'थेट',
    syncOffline: 'ऑफलाइन',
    scanTitle: 'भंगार स्कॅन करा • त्वरित ओळखा',
    scanSubtitle: 'एआई कॅमेरा तपासणी • तात्काळ वजन व दर',
    openViewfinder: 'एआई कॅमेरा उघडा',
    manualGrid: '7-श्रेणी मॅन्युअल ग्रिड',
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
    fastPicker: 'जलद श्रेणी निवड',
    viewAll7: 'सर्व 7 श्रेणी पहा',
    pcbs: 'पीसीबी',
    cables: 'केबल / वायर',
    batteries: 'बॅटरी',
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
    recyclerPortal: 'Recycler Portal',
    syncLive: 'Live',
    syncOffline: 'Offline',
    scanTitle: 'Scan & Identify E-Waste',
    scanSubtitle: 'AI Camera Detection • Instant Rate',
    openViewfinder: 'Open AI Viewfinder',
    manualGrid: 'Manual 7-Category Grid',
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
    fastPicker: 'Fast Category Picker',
    viewAll7: 'View All 7 Categories',
    pcbs: 'PCBs',
    cables: 'Cables',
    batteries: 'Batteries',
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
  onSelectLot,
  recentLots = [],
  syncStatus = { isOnline: true, unsyncedCount: 0 },
  currentLang: propLang,
  onLanguageChange,
  onSwitchRole
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

  const [marketRates, setMarketRates] = useState([
    { id: 'mat_pcb_high', name: 'Circuit Boards', sub: 'A-Grade PCB', rate: 265, unit: 'kg', icon: 'memory', spoken: 'सर्किट बोर्ड का मंडी भाव 265 रुपये प्रति किलो है।' },
    { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire', rate: 385, unit: 'kg', icon: 'cable', spoken: 'तांबे के तार का भाव 385 रुपये प्रति किलो है।' },
    { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mixed lot', rate: 190, unit: 'kg', icon: 'battery_charging_full', spoken: 'लिथियम बैटरी का भाव 190 रुपये प्रति किलो है।' }
  ]);

  // Load live prices from backend if available
  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch('http://localhost:8000/prices/board?location=IN-MH-MUM');
        if (res.ok) {
          const data = await res.json();
          if (data.categories && data.categories.length >= 3) {
            const pcb = data.categories.find(c => c.material_id === 'mat_pcb_high') || data.categories[0];
            const copper = data.categories.find(c => c.material_id === 'mat_cables_copper') || data.categories[1];
            const battery = data.categories.find(c => c.material_id === 'mat_batteries_li_ion') || data.categories[2];
            setMarketRates([
              { id: 'mat_pcb_high', name: 'Circuit Boards', sub: 'A-Grade PCB', rate: Math.round(pcb.current_rate || 265), unit: 'kg', icon: 'memory', spoken: `सर्किट बोर्ड का मंडी भाव ${Math.round(pcb.current_rate || 265)} रुपये प्रति किलो है।` },
              { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire', rate: Math.round(copper.current_rate || 385), unit: 'kg', icon: 'cable', spoken: `तांबे के तार का भाव ${Math.round(copper.current_rate || 385)} रुपये प्रति किलो है।` },
              { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mixed lot', rate: Math.round(battery.current_rate || 190), unit: 'kg', icon: 'battery_charging_full', spoken: `लिथियम बैटरी का भाव ${Math.round(battery.current_rate || 190)} रुपये प्रति किलो है।` }
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = safeLang === 'mr' ? 'mr-IN' : (safeLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakAllRates = () => {
    const summary = safeLang === 'mr'
      ? `आजचे बाजार दर: सर्किट बोर्ड ${marketRates[0].rate} रुपये, तांब्याची केबल ${marketRates[1].rate} रुपये, बॅटरी ${marketRates[2].rate} रुपये प्रति किलो.`
      : (safeLang === 'hi'
          ? `आज के बाजार भाव: सर्किट बोर्ड ${marketRates[0].rate} रुपये, तांबे के तार ${marketRates[1].rate} रुपये, बैटरी ${marketRates[2].rate} रुपये प्रति किलो।`
          : `Today's market rates: Circuit boards ₹${marketRates[0].rate}, Copper cables ₹${marketRates[1].rate}, Batteries ₹${marketRates[2].rate} per kilogram.`);
    speakText(summary);
  };

  const getSpokenRate = (idx) => {
    const r = marketRates[idx]?.rate || (idx === 0 ? 265 : idx === 1 ? 385 : 190);
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

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen pb-24 relative overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-on-background w-full sticky top-0 z-40 border-b border-outline-variant dark:border-outline">
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full px-4 sm:px-6 h-16">
          {/* Brand & Clean Status Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px]">recycling</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-md text-base sm:text-lg font-bold text-primary dark:text-primary-fixed-dim tracking-tight">
                RE:LINK
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                <span className="uppercase tracking-wider text-primary/90 font-bold">
                  {t.mandiTag}
                </span>
                <span className="text-outline-variant">•</span>
                {!syncStatus.isOnline || (syncStatus.unsyncedCount && syncStatus.unsyncedCount > 0) ? (
                  <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>{syncStatus.unsyncedCount || 1} {safeLang === 'mr' ? 'लॉट ऑफलाइन जतन • जोडल्यावर सिंक होईल' : (safeLang === 'hi' ? 'लॉट ऑफलाइन सुरक्षित • जुड़ने पर सिंक होगा' : 'lots saved offline • Syncing when connected')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{safeLang === 'mr' ? 'ऑनलाइन' : (safeLang === 'hi' ? 'ऑनलाइन' : 'Online')}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-outline-variant/40 text-xs font-semibold">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-full bg-primary text-on-primary shadow-sm font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] filled">home</span>
              <span>{t.navHome}</span>
            </button>
            <button
              onClick={() => onNavigate('my_lots')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              <span>{t.navMyLots}</span>
            </button>
            <button
              onClick={onScanClick}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>{t.navAiScan}</span>
            </button>
            <button
              onClick={() => onNavigate('category_select')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>{t.navCategories}</span>
            </button>
            <button
              onClick={() => onNavigate('earnings')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">payments</span>
              <span>{t.navEarnings}</span>
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
              <span>{t.navSafety}</span>
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">

            {/* Role / Portal Switcher */}
            {onSwitchRole && (
              <button
                onClick={onSwitchRole}
                aria-label="Switch Portal"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant transition-colors text-xs font-semibold cursor-pointer"
                title="Switch Portal or Role"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">domain</span>
                <span className="hidden md:inline">{t.recyclerPortal}</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface relative cursor-pointer transition-colors shrink-0"
              title="Live Offers, Pickups & Payment Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error animate-ping"></span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
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

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Primary Column (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
        {/* Primary CTA */}
        <section>
          <button
            onClick={onScanClick}
            className="w-full bg-primary hover:bg-primary-container text-on-primary min-h-[56px] py-3 rounded-xl flex flex-col items-center justify-center shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-sm font-action-xl text-action-xl font-bold text-lg sm:text-xl">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>photo_camera</span>
              <span>{t.scanTitle}</span>
            </div>
            <span className="text-xs text-on-primary/90 font-label-md mt-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-xs">auto_awesome</span> {t.scanSubtitle}
            </span>
          </button>
          <div className="flex items-center justify-center gap-3 pt-2.5">
            <button
              onClick={() => onNavigate('ai_scan')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">view_in_ar</span>
              <span>{t.openViewfinder}</span>
            </button>
            <span className="text-outline-variant text-xs">•</span>
            <button
              onClick={() => onNavigate('category_select')}
              className="text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">grid_view</span>
              <span>{t.manualGrid}</span>
            </button>
          </div>
        </section>

        {/* Current Market Rates (Bento/Card Grid) */}
        <section className="space-y-md">
          <div className="flex items-center gap-xs">
            <h2 className="font-headline-md text-headline-md text-on-background font-bold text-lg">{t.marketRatesTitle}</h2>
            <button
              onClick={handleSpeakAllRates}
              aria-label="Play audio instruction for current market rates"
              className="w-8 h-8 rounded-full flex items-center justify-center text-tertiary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-tertiary">volume_up</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-gutter-mobile">
            {/* PCB Card */}
            <div
              onClick={() => speakText(getSpokenRate(0))}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary transition-all"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="flex flex-col gap-xs relative z-10">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant shadow-sm mb-sm">
                  <span className="material-symbols-outlined text-primary">memory</span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface-variant font-semibold">{t.pcbName}</h3>
                <p className="font-body-md text-body-md text-secondary text-xs">{t.pcbSub}</p>
                <p className="font-headline-md text-headline-md text-on-background mt-sm font-bold text-base">
                  ₹{marketRates[0].rate} <span className="font-body-md text-body-md text-secondary font-normal text-xs">{t.perKg}</span>
                </p>
              </div>
            </div>

            {/* Cable Card */}
            <div
              onClick={() => speakText(getSpokenRate(1))}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary transition-all"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="flex flex-col gap-xs relative z-10">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant shadow-sm mb-sm">
                  <span className="material-symbols-outlined text-primary">cable</span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface-variant font-semibold">{t.cableName}</h3>
                <p className="font-body-md text-body-md text-secondary text-xs">{t.cableSub}</p>
                <p className="font-headline-md text-headline-md text-on-background mt-sm font-bold text-base">
                  ₹{marketRates[1].rate} <span className="font-body-md text-body-md text-secondary font-normal text-xs">{t.perKg}</span>
                </p>
              </div>
            </div>

            {/* Battery Card */}
            <div
              onClick={() => speakText(getSpokenRate(2))}
              className="col-span-2 bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group flex justify-between items-center cursor-pointer hover:border-primary transition-all"
            >
              <div className="flex items-center gap-md relative z-10">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant shadow-sm">
                  <span className="material-symbols-outlined text-primary">battery_charging_full</span>
                </div>
                <div>
                  <h3 className="font-label-lg text-label-lg text-on-surface-variant font-semibold">{t.batteryName}</h3>
                  <p className="font-body-md text-body-md text-secondary text-xs">{t.batterySub}</p>
                </div>
              </div>
              <p className="font-headline-md text-headline-md text-on-background text-right font-bold text-base">
                ₹{marketRates[2].rate} <span className="font-body-md text-body-md text-secondary text-xs">{t.perKg}</span>
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
                `• ${t.pcbName}: ₹${marketRates[0]?.rate || 265}/kg\n` +
                `• ${t.cableName}: ₹${marketRates[1]?.rate || 385}/kg\n` +
                `• ${t.batteryName}: ₹${marketRates[2]?.rate || 190}/kg\n` +
                `• Direct CPCB Scale Weighment & 100% Cash Settlement.\n` +
                `Check live: https://relink-mandi.gov.in`
              );
              window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            }}
            className="w-full min-h-[44px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            <span>{t.shareWhatsApp}</span>
          </button>

          {/* Category Fast Shortcuts */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">{t.fastPicker}</span>
              <button
                onClick={() => onNavigate('category_select')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>{t.viewAll7}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onNavigate('category_select')}
                className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/50 hover:border-primary text-left transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">memory</span>
                <span className="text-xs font-medium truncate">{t.pcbs}</span>
              </button>
              <button
                onClick={() => onNavigate('category_select')}
                className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/50 hover:border-primary text-left transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">cable</span>
                <span className="text-xs font-medium truncate">{t.cables}</span>
              </button>
              <button
                onClick={() => onNavigate('category_select')}
                className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/50 hover:border-primary text-left transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">battery_charging_full</span>
                <span className="text-xs font-medium truncate">{t.batteries}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Right / Companion Column (col-span-5) on Desktop / Tablet */}
      <div className="lg:col-span-5 space-y-6">
        {/* Live Mandi Intelligence & Trend Card */}
        <section className="bg-gradient-to-br from-primary/10 via-surface-container-low to-surface rounded-2xl p-5 border border-primary/20 shadow-sm space-y-3">
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
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">trending_up</span>
                <span className="font-medium">{t.copperWires}</span>
              </div>
              <span className="font-bold text-emerald-700">{t.copperTrend}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                <span className="font-medium">{t.serverPcbs}</span>
              </div>
              <span className="font-bold text-primary">{t.serverPcbPeak}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[16px]">warning</span>
                <span className="font-medium">{t.batteryWarning}</span>
              </div>
              <span className="font-semibold text-amber-800">{t.mustIsolate}</span>
            </div>
          </div>
        </section>

        {/* Recent Scrap Lots */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-xs">
              <h2 className="font-headline-md text-headline-md text-on-background font-bold text-base">{t.recentLots}</h2>
              <button
                onClick={() => speakText(safeLang === 'mr' ? 'नुकतेच नोंदवलेले लॉट पहा' : 'हाल ही के लॉट्स देखें')}
                aria-label="Play audio instruction for recent lots"
                className="w-7 h-7 rounded-full flex items-center justify-center text-tertiary hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">volume_up</span>
              </button>
            </div>
            <span className="text-xs text-secondary font-semibold">{t.offlineCached}</span>
          </div>

          <div className="space-y-sm">
            {recentLots.length > 0 ? (
              recentLots.map((lot, idx) => (
                <div
                  key={lot.id || idx}
                  onClick={() => onSelectLot && onSelectLot(lot)}
                  className="bg-surface rounded-xl p-3 sm:p-4 border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between gap-sm active:bg-surface-container-low transition-colors cursor-pointer hover:border-primary"
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-secondary">
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-sm text-on-background font-bold">
                        {t.lotNumber}{String(lot.id || idx + 8400).slice(-4)}
                      </h3>
                      <p className="font-body-md text-secondary text-xs">
                        {lot.material_category || t.mixedScrap} • {lot.approximate_weight || 12}kg
                      </p>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-tertiary-container/15 border border-tertiary-container/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5"></span>
                        <span className="text-[11px] font-semibold text-on-tertiary-container">
                          {lot.status === 'CONFIRMED' || lot.status === 'HANDED_OVER' ? t.handoverConfirmed : t.offerReceived}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant pt-2 sm:pt-0 mt-1 sm:mt-0">
                    <span className="text-xs text-secondary sm:hidden">{t.estValue}</span>
                    <span className="text-base text-primary font-bold">
                      ~₹{Math.round(lot.quoted_price || (lot.approximate_weight || 12) * 240)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface rounded-2xl p-5 border border-outline-variant/60 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">inventory_2</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">{t.noRecentLotsTitle}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t.noRecentLotsDesc}
                  </p>
                </div>
                <button
                  onClick={onScanClick}
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span>{t.scanFirstLot}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Nearby CPCB Recycler Network Status */}
        <section className="bg-surface rounded-2xl p-4 border border-outline-variant shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface">{t.verifiedFacilities}</span>
            <span className="text-xs text-emerald-700 font-bold">{t.facilitiesActive}</span>
          </div>
          <p className="text-xs text-on-surface-variant">
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
  <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Home"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] scale-95 transition-all cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1">
            <span className="material-symbols-outlined filled">home</span>
          </div>
          <span className="font-label-md text-label-md mt-1 text-primary font-bold text-xs">{t.navHome}</span>
        </button>

        <button
          onClick={() => onNavigate('my_lots')}
          aria-label="My Lots"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] text-on-surface-variant hover:bg-surface-container-low rounded-lg p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-md text-label-md mt-1 text-xs">{t.navMyLots}</span>
        </button>

        <button
          onClick={() => onNavigate('earnings')}
          aria-label="Earnings"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] text-on-surface-variant hover:bg-surface-container-low rounded-lg p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-label-md mt-1 text-xs">{t.navEarnings}</span>
        </button>

        <button
          onClick={() => onNavigate('safety')}
          aria-label="Safety"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] text-on-surface-variant hover:bg-surface-container-low rounded-lg p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-label-md mt-1 text-xs">{t.navSafety}</span>
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
