import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminToolsModal from '../common/AdminToolsModal';

const TRANSLATIONS = {
  hi: {
    cpcbRecognised: 'सीपीसीबी मान्यता प्राप्त',
    tagline: 'स्मार्ट ई-कचरा मंडी • डिजिटल कबाड़ीबाज़ार',
    liveIndex: 'लाइव मंडी दरें 2026',
    nationalGateway: 'राष्ट्रीय ई-कचरा परिपत्र अर्थव्यवस्था प्रवेशद्वार',
    choosePortal: 'अपना पोर्टल चुनें',
    heroSubtitle: 'पारदर्शी मंडी भाव • प्रत्यक्ष कांटा तौल सत्यापन • तत्काल नकद एवं बैंक भुगतान',
    fieldCollection: 'द्वार-संग्रह (FIELD COLLECTION)',
    instantAi: 'त्वरित एआई मूल्यांकन',
    collectorTitle: 'कलेक्टर / कबाड़ीवाला',
    collectorDesc: 'घरोघरी व गली-मोहल्ले के कबाड़ीवालों के लिए। कबाड़ की फोटो खींचें, आज का सही मंडी भाव जानें और नकद भुगतान पाएं।',
    featAiScanTitle: 'एआई कबाड़ पहचान:',
    featAiScanDesc: 'तुरंत सामग्री श्रेणी और वजन मार्गदर्शन',
    featAudioRatesTitle: 'बोलता मंडी भाव:',
    featAudioRatesDesc: 'हिंदी और मराठी में वास्तविक समय ऑडियो',
    featPayoutTitle: 'सुरक्षित भुगतान:',
    featPayoutDesc: 'तौल कांटे पर 100% सत्यापित नकद / यूपीआई',
    phoneLabel: 'मोबाइल लॉगिन / फ़ोन नंबर से जुड़ें',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
    launchCollector: 'कलेक्टर ऐप शुरू करें',
    quickDemoCollector: '⚡ त्वरित डेमो: रमेश कुमार (+91 98450 12891)',
    registeredFacility: 'पंजीकृत संयंत्र (REGISTERED FACILITY)',
    cpcbTier: 'CPCB टियर-1 / टियर-2',
    recyclerTitle: 'अधिकृत रीसायकलर',
    recyclerDesc: 'सीपीसीबी-पंजीकृत रीसायकलर्स एवं डिस्मेंटलर्स के लिए। एकत्रित कबाड़ लॉट खरीदें और स्वचालित ईपीआर ऑडिट ट्रेल प्राप्त करें।',
    featLiveStreamTitle: 'लाइव लॉट स्ट्रीम:',
    featLiveStreamDesc: 'अपने क्षेत्र के सत्यापित कबाड़ लॉट देखें',
    featWeighbridgeTitle: 'कांटा तौल एकीकरण:',
    featWeighbridgeDesc: 'लॉट क्यूआर स्कैन करें और प्रमाणित वजन दर्ज करें',
    featForm6Title: 'फॉर्म-6 व ईपीआर क्रेडिट:',
    featForm6Desc: 'वैधानिक हस्तांतरण पर्ची तुरंत बनाएं',
    facilityAuth: 'संयंत्र प्रमाणीकरण:',
    facilitiesActive: '5 अधिकृत संयंत्र सक्रिय',
    accessRecycler: 'रीसायकलर पोर्टल खोलें',
    quickDemoRecycler: '⚡ त्वरित डेमो: इको-रीसायकल इंडिया (Tier-1)',
    dealerTitle: 'डीलर / स्क्रैप यार्ड',
    dealerDesc: 'मध्यवर्ती स्क्रैप यार्ड एवं एग्रीगेटर्स के लिए। गेट इनबाउंड वजन, माइक्रो-लॉट एकत्रीकरण एवं थोक रीसायकलर नीलामी।',
    featGateIntakeTitle: 'गेट तौल व भुगतान:',
    featGateIntakeDesc: 'कैलिब्रेटेड वजनकांटा व 1-क्लिक नकद / यूपीआई भुगतान',
    featBatchConsolidateTitle: 'बैच कंसोलिडेशन इंजन:',
    featBatchConsolidateDesc: 'माइक्रो-लॉट्स का CPCB सीलबंद पैलेट में एकत्रीकरण',
    featMarketplaceTitle: 'थोक B2B नीलामी:',
    featMarketplaceDesc: '+9.8% स्प्रेड मुनाफा व CPCB फॉर्म-6 कस्टडी ट्री',
    yardDesk: 'यार्ड गेट डेस्क (YARD DESK)',
    cpcbAggregator: 'CPCB #KA-AGG-2024-118',
    launchDealer: 'डीलर यार्ड डेस्क खोलें',
    quickDemoDealer: '⚡ त्वरित डेमो: दिलीप भाई (Peenya Yard 04)',
    statCollectors: 'अनौपचारिक कबाड़ीवाले',
    statFormalized: 'इस महीने औपचारिक संकलन',
    statTraceable: 'CPCB फॉर्म-6 ट्रेस करने योग्य',
    cpcbNetwork: 'सीपीसीबी अधिकृत नेटवर्क',
    offlineReady: 'ऑफलाइन-सक्षम PWA',
    statutoryAudit: 'फॉर्म-6 वैधानिक ऑडिट ट्रेल',
    adminConsole: 'एडमिन कंसोल',
    tollFree: 'राष्ट्रीय टोल-फ्री सहायता:',
    timing: '(सुबह 8 बजे – रात 8 बजे)'
  },
  mr: {
    cpcbRecognised: 'सीपीसीबी मान्यता प्राप्त',
    tagline: 'स्मार्ट ई-कचरा बाजार • डिजिटल कबाडीबाजार',
    liveIndex: 'थेट बाजार दर 2026',
    nationalGateway: 'राष्ट्रीय ई-कचरा चक्रीय अर्थव्यवस्था पोर्टल',
    choosePortal: 'आपले पोर्टल निवडा',
    heroSubtitle: 'पारदर्शक बाजार भाव • थेट वजनकाटा तपासणी • त्वरित रोख व बँक जमा',
    fieldCollection: 'क्षेत्र संकलन (FIELD COLLECTION)',
    instantAi: 'तात्काळ एआई मूल्यमापन',
    collectorTitle: 'कलेक्टर / कबाड़ीवाला',
    collectorDesc: 'घरोघरी संकलन करणारे व कबाडी बांधवांसाठी. भंगार स्कॅन करा, थेट मंडी दर ऐका आणि रोख मोबदला मिळवा.',
    featAiScanTitle: 'एआई भंगार ओळख:',
    featAiScanDesc: 'त्वरित श्रेणी आणि वजन मार्गदर्शन',
    featAudioRatesTitle: 'बोलके बाजार दर:',
    featAudioRatesDesc: 'मराठी आणि हिंदीमध्ये थेट आवाजी दर',
    featPayoutTitle: 'खात्रीशीर मोबदला:',
    featPayoutDesc: 'वजनकाट्यावर 100% रोख / यूपीआय देयक',
    phoneLabel: 'मोबाईल लॉगिन / नंबरने जोडा',
    phonePlaceholder: '10 अंकी मोबाईल नंबर टाका',
    launchCollector: 'कलेक्टर ॲप सुरू करा',
    quickDemoCollector: '⚡ जलद डेमो: रमेश कुमार (+91 98450 12891)',
    registeredFacility: 'नोंदणीकृत प्रकल्प (REGISTERED FACILITY)',
    cpcbTier: 'CPCB टियर-1 / टियर-2',
    recyclerTitle: 'अधिकृत पुनर्वापरदार',
    recyclerDesc: 'सीपीसीबी-नोंदणीकृत अधिकृत रिसायकलर्ससाठी. संकलित लॉट खरेदी करा आणि ईपीआर ऑडिट दाखला मिळवा.',
    featLiveStreamTitle: 'थेट लॉट प्रवाह:',
    featLiveStreamDesc: 'आपल्या परिसरातील सत्यापित लॉट तपासा',
    featWeighbridgeTitle: 'वजनकाटा एकत्रीकरण:',
    featWeighbridgeDesc: 'लॉट क्यूआर स्कॅन करा आणि वजन नोंदवा',
    featForm6Title: 'फॉर्म-6 व ईपीआर क्रेडिट:',
    featForm6Desc: 'अधिकृत हस्तांतरण पावती त्वरित मिळवा',
    facilityAuth: 'प्रकल्प प्रमाणीकरण:',
    facilitiesActive: '5 अधिकृत प्रकल्प सक्रिय',
    accessRecycler: 'रिसायकलर पोर्टल उघडा',
    quickDemoRecycler: '⚡ जलद डेमो: इको-रिसायकल इंडिया (Tier-1)',
    dealerTitle: 'डीलर / स्क्रॅप यार्ड',
    dealerDesc: 'मध्यम स्क्रॅप यार्ड आणि एग्रीगेटर्ससाठी. संकलन गेटवर डिजिटल वजन, पॅलेट बॅच एकत्रीकरण आणि थेट रिसायकलर लिलाव.',
    featGateIntakeTitle: 'गेट वेईंग व कॅश डेस्क:',
    featGateIntakeDesc: 'कॅलिब्रेटेड वजनकाटा आणि त्वरित रोख/UPI मोबदला',
    featBatchConsolidateTitle: 'व्यावसायिक बॅच इंजिन:',
    featBatchConsolidateDesc: 'लहान लॉट्सचे CPCB टॅग्ड पॅलेटमध्ये एकत्रीकरण',
    featMarketplaceTitle: 'B2B रिसायकलर ऑक्शन:',
    featMarketplaceDesc: '+9.8% स्प्रेड नफा व अखंड फॉर्म-6 ऑडिट ट्री',
    yardDesk: 'यार्ड गेट डेस्क (YARD DESK)',
    cpcbAggregator: 'CPCB Reg #KA-AGG-2024-118',
    launchDealer: 'डीलर यार्ड डेस्क उघडा',
    quickDemoDealer: '⚡ जलद डेमो: दिलीप भाई (Peenya Yard 04)',
    statCollectors: 'अनौपचारिक कबाडीवाले',
    statFormalized: 'या महिन्यात संकलित',
    statTraceable: 'CPCB फॉर्म-6 ट्रॅकेबल',
    cpcbNetwork: 'सीपीसीबी अधिकृत नेटवर्क',
    offlineReady: 'ऑफलाइन-तयार PWA',
    statutoryAudit: 'फॉर्म-6 वैधानिक ऑडिट ट्रेल',
    adminConsole: 'प्रशासक कन्सोल',
    tollFree: 'राष्ट्रीय टोल-फ्री मदत:',
    timing: '(सकाळी 8 – रात्री 8)'
  },
  en: {
    cpcbRecognised: 'CPCB RECOGNISED',
    tagline: 'Smart E-Waste Mandi • Digital Scrap Market',
    liveIndex: 'Live Mandi Index 2026',
    nationalGateway: 'National E-Waste Circular Economy Gateway',
    choosePortal: 'Choose Your Portal',
    heroSubtitle: 'Fair Mandi Prices • Direct Physical Scale Verification • Instant Cash & Bank Settlement',
    fieldCollection: 'FIELD COLLECTION',
    instantAi: 'Instant AI Valuation',
    collectorTitle: 'Collector / Kabadiwala',
    collectorDesc: 'Designed for doorstep collectors and informal aggregators. Scan scrap, check live mandi rates, and receive verified payment.',
    featAiScanTitle: 'AI Scrap Recognition:',
    featAiScanDesc: 'Instant categorization & weight guidance',
    featAudioRatesTitle: 'Spoken Mandi Rates:',
    featAudioRatesDesc: 'Real-time audio voice in Hindi & Marathi',
    featPayoutTitle: 'Guaranteed Payout:',
    featPayoutDesc: '100% verified cash/UPI at weighbridge scale',
    phoneLabel: 'Mobile Login / Phone Number',
    phonePlaceholder: 'Enter 10 digit mobile number',
    launchCollector: 'Launch Collector App',
    quickDemoCollector: '⚡ Quick Demo: Ramesh K. (+91 98450 12891)',
    registeredFacility: 'REGISTERED FACILITY',
    cpcbTier: 'CPCB TIER-1 / TIER-2',
    recyclerTitle: 'Authorized Recycler',
    recyclerDesc: 'Designed for CPCB-registered formal recyclers, dismantling facilities, and PROs. Source aggregated scrap lots with automated EPR audit trails.',
    featLiveStreamTitle: 'Live Lot Stream:',
    featLiveStreamDesc: 'Inspect verified scrap lots within your radius',
    featWeighbridgeTitle: 'Weighbridge Integration:',
    featWeighbridgeDesc: 'Scan lot QR & record calibrated scale weights',
    featForm6Title: 'Form-6 & EPR Credits:',
    featForm6Desc: 'Auto-generate statutory transfer manifests',
    facilityAuth: 'Facility Authentication:',
    facilitiesActive: '5 Facilities Active',
    accessRecycler: 'Access Recycler Portal',
    quickDemoRecycler: '⚡ Quick Demo: EcoRecycle India (Tier-1)',
    dealerTitle: 'Dealer / Aggregator Hub',
    dealerDesc: 'Designed for intermediate scrap yards and urban aggregators. Inbound gate intake, commercial batch palletization, and wholesale B2B smelter auctions.',
    featGateIntakeTitle: 'Gate Weighment & Payout:',
    featGateIntakeDesc: 'Calibrated scale with 1-tap cash / UPI settlement',
    featBatchConsolidateTitle: 'Batch Consolidation Engine:',
    featBatchConsolidateDesc: 'Palletize micro-lots with CPCB tamper seals',
    featMarketplaceTitle: 'Wholesale B2B Auction:',
    featMarketplaceDesc: '+9.8% dealer arbitrage spread & Form-6 custody tree',
    yardDesk: 'YARD GATE DESK',
    cpcbAggregator: 'CPCB #KA-AGG-2024-118',
    launchDealer: 'Launch Dealer Yard Desk',
    quickDemoDealer: '⚡ Quick Demo: Dilip Bhai (Peenya Yard 04)',
    statCollectors: 'Informal Collectors',
    statFormalized: 'Formalized This Month',
    statTraceable: 'CPCB Form-6 Traceable',
    cpcbNetwork: 'CPCB Authorized Network',
    offlineReady: 'Offline-Ready PWA',
    statutoryAudit: 'Form-6 Statutory Audit Trail',
    adminConsole: 'Admin Console',
    tollFree: 'National Toll-Free Assistance:',
    timing: '(8 AM – 8 PM)'
  }
};

export default function Screen00WelcomeRole({ onSelectRole }) {
  const { i18n } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const [currentLang, setCurrentLang] = useState(() => {
    return normalize(localStorage.getItem('relink_lang') || i18n.language);
  });

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLang(normalize(lng));
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const safeLang = normalize(currentLang);
  const t = TRANSLATIONS[safeLang] || TRANSLATIONS.hi;

  const handleLangChange = (lang) => {
    const safe = normalize(lang);
    i18n.changeLanguage(safe);
    localStorage.setItem('relink_lang', safe);
    setCurrentLang(safe);
  };

  const handleCollectorLogin = () => {
    onSelectRole('collector', phoneNumber || '9845012891');
  };

  const handleDealerLogin = () => {
    onSelectRole('dealer');
  };

  const handleRecyclerLogin = () => {
    onSelectRole('recycler');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body-md text-on-surface antialiased w-full">
      {/* Top Header Bar */}
      <header className="w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm text-on-primary">
              <span className="material-symbols-outlined text-[24px]">recycling</span>
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-xl tracking-tight text-on-surface font-bold">RE:LINK</span>
                <span className="hidden sm:inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  {t.cpcbRecognised}
                </span>
              </div>
              <span className="font-label-md text-[11px] text-primary font-bold tracking-wider uppercase">
                {t.tagline}
              </span>
            </div>
          </div>

          {/* Right Controls: Live Mandi Indicator & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full text-xs font-semibold text-primary border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>{t.liveIndex}</span>
            </div>

            <div className="flex items-center bg-surface-container rounded-full p-1 shadow-sm border border-outline-variant/30">
              <button
                onClick={() => handleLangChange('hi')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'hi' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLangChange('mr')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'mr' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                मराठी
              </button>
              <button
                onClick={() => handleLangChange('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'en' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero & Portals Container */}
      <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Hero Greeting & Tagline */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide mb-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>{t.nationalGateway}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              {t.choosePortal}
            </h1>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Role Selection Cards: Responsive 3-Column Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6 items-stretch">
            {/* Card 1: Collector / Kabadiwala */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border-2 border-primary/30 flex flex-col justify-between hover:shadow-md hover:border-primary transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center shrink-0 text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">handshake</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-primary text-on-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {t.fieldCollection}
                    </span>
                    <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span> {t.instantAi}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    {t.collectorTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {t.collectorDesc}
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-2 py-2 border-t border-b border-surface-container-high text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                    <span><strong>{t.featAiScanTitle}</strong> {t.featAiScanDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">record_voice_over</span>
                    <span><strong>{t.featAudioRatesTitle}</strong> {t.featAudioRatesDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                    <span><strong>{t.featPayoutTitle}</strong> {t.featPayoutDesc}</span>
                  </div>
                </div>
              </div>

              {/* Login Action Area */}
              <div className="mt-5 space-y-3 bg-surface-container-low p-4 rounded-xl">
                <label className="block font-label-md text-xs text-on-surface font-semibold" htmlFor="collectorPhoneClean">
                  {t.phoneLabel}
                </label>
                <div className="flex items-center bg-surface-container-lowest rounded-lg px-3 py-2.5 shadow-sm border border-outline-variant/40 focus-within:border-primary">
                  <span className="font-label-md text-sm text-on-surface-variant font-bold pr-2">+91</span>
                  <input
                    id="collectorPhoneClean"
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={t.phonePlaceholder}
                    className="w-full bg-transparent font-label-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                  />
                  <span className="material-symbols-outlined text-primary text-[20px]">phone_android</span>
                </div>
                <button
                  onClick={handleCollectorLogin}
                  className="w-full h-12 rounded-xl bg-primary text-on-primary font-action-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all active:scale-[0.99] cursor-pointer"
                  type="button"
                >
                  <span>{t.launchCollector}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <div className="pt-1">
                  <button
                    onClick={() => onSelectRole('collector', '9845012891')}
                    type="button"
                    className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-primary/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>{t.quickDemoCollector}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Card 2: Dealer / Aggregator Hub */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border-2 border-emerald-600/30 flex flex-col justify-between hover:shadow-md hover:border-emerald-600 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">warehouse</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {t.yardDesk}
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {t.cpcbAggregator}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    {t.dealerTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {t.dealerDesc}
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-2 py-2 border-t border-b border-surface-container-high text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">scale</span>
                    <span><strong>{t.featGateIntakeTitle}</strong> {t.featGateIntakeDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
                    <span><strong>{t.featBatchConsolidateTitle}</strong> {t.featBatchConsolidateDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                    <span><strong>{t.featMarketplaceTitle}</strong> {t.featMarketplaceDesc}</span>
                  </div>
                </div>
              </div>

              {/* Dealer Launch Button */}
              <div className="mt-5 space-y-3 bg-surface-container-low p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="font-semibold">Peenya Hub 04:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> Scales Active
                  </span>
                </div>
                <button
                  onClick={handleDealerLogin}
                  className="w-full h-12 rounded-xl bg-primary text-white hover:bg-emerald-800 font-action-xl text-sm sm:text-base font-bold flex items-center justify-between px-5 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px]">store</span>
                    <span>{t.launchDealer}</span>
                  </div>
                  <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                </button>
                <div className="pt-1">
                  <button
                    onClick={handleDealerLogin}
                    type="button"
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>{t.quickDemoDealer}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Card 3: Recycler */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border-2 border-outline-variant/40 flex flex-col justify-between hover:shadow-md hover:border-secondary transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">factory</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-secondary text-on-secondary text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {t.registeredFacility}
                    </span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {t.cpcbTier}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    {t.recyclerTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {t.recyclerDesc}
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-2 py-2 border-t border-b border-surface-container-high text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">inbox</span>
                    <span><strong>{t.featLiveStreamTitle}</strong> {t.featLiveStreamDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">scale</span>
                    <span><strong>{t.featWeighbridgeTitle}</strong> {t.featWeighbridgeDesc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">description</span>
                    <span><strong>{t.featForm6Title}</strong> {t.featForm6Desc}</span>
                  </div>
                </div>
              </div>

              {/* Recycler Launch Button */}
              <div className="mt-5 space-y-3 bg-surface-container-low p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="font-semibold">{t.facilityAuth}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> {t.facilitiesActive}
                  </span>
                </div>
                <button
                  onClick={handleRecyclerLogin}
                  className="w-full h-12 rounded-xl bg-on-surface text-surface hover:bg-black font-action-xl text-sm sm:text-base font-bold flex items-center justify-between px-5 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                    <span>{t.accessRecycler}</span>
                  </div>
                  <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                </button>
                <div className="pt-1">
                  <button
                    onClick={handleRecyclerLogin}
                    type="button"
                    className="w-full py-2 px-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-secondary/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>{t.quickDemoRecycler}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Underneath Stats Strip */}
          <div className="grid grid-cols-3 gap-4 bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/30 text-center">
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-primary">1,420+</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">{t.statCollectors}</p>
            </div>
            <div className="border-x border-outline-variant/40">
              <p className="text-lg sm:text-2xl font-extrabold text-on-surface">42.8 MT</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">{t.statFormalized}</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-secondary">100%</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">{t.statTraceable}</p>
            </div>
          </div>

          {/* Clean Trust & Compliance Footer */}
          <footer className="pt-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-on-surface-variant text-xs font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span> {t.cpcbNetwork}
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">cloud_sync</span> {t.offlineReady}
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">security</span> {t.statutoryAudit}
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                className="flex items-center gap-1.5 text-primary hover:underline font-bold cursor-pointer transition-colors"
                title="Access Master Admin Tools & AI Feedback Queue"
              >
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>{t.adminConsole}</span>
              </button>
            </div>
            <p className="font-body-md text-xs text-on-surface-variant/70">
              {t.tollFree} <strong>1800-EW-RELINK</strong> {t.timing}
            </p>
          </footer>
        </div>
      </main>

      {/* Master Admin Tools Modal */}
      <AdminToolsModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
