import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminToolsModal from '../common/AdminToolsModal';

const TRANSLATIONS = {
  hi: {
    cpcbRecognised: 'सीपीसीबी मान्यता प्राप्त',
    tagline: 'स्मार्ट ई-कचरा मंडी',
    liveIndex: 'लाइव मंडी भाव',
    synced: 'सिंक्ड',
    signIn: 'साइन इन',
    liveMandiTickerTitle: 'आज का लाइव मंडी भाव:',
    mandiPcb: 'मदरबोर्ड (PCB): ₹780/किग्रा (+₹15 ▲)',
    mandiCopper: 'तांबा केबल: ₹420/किग्रा (+₹8 ▲)',
    mandiBattery: 'ली-आयन बैटरी: ₹110/किग्रा (+₹3 ▲)',
    mandiAlu: 'एल्युमिनियम: ₹165/किग्रा',
    serverStatus: 'सर्वर: 100% ऑनलाइन व सिंक्ड',
    cpcbVerified: 'CPCB ई-कचरा नियम 2022 सत्यापित',
    form6Passes: '100% फॉर्म-6 डिजिटल ट्रांसफर पास',
    helplineText: 'राष्ट्रीय सहायता: 1800-EW-RELINK',
    installBannerTitle: 'कबाड़ीवाला कनेक्ट ऐप इंस्टॉल करें',
    installBannerDesc: 'बिना इंटरनेट फोन स्क्रीन से तुरंत खोलें • तेज और आसान',
    installBtn: 'ऐप जोड़ें (Install)',
    worksOffline: 'बिना इंटरनेट भी चलेगा',
    ready100: '100% तैयार',
    voiceSelect: 'बोलकर चुनें',
    whoAreYou: 'आप कौन हैं?',
    whoAreYouSub: 'आगे बढ़ने के लिए अपनी भूमिका चुनें',
    audioPlaying: 'आवाज़ चालू है... अपनी भूमिका चुनें',
    role1Title: 'कबाड़ी / फेरीवाला',
    role1Sub: 'डोरस्टेप स्क्रैप कलेक्टर व कबाड़ी',
    role1Tag: 'दुकान / फेरी (दैनिक कबाड़ और तुरंत नकद)',
    role2Title: 'स्क्रैप डीलर / आढ़ती',
    role2Sub: 'यार्ड एग्रीगेटर एवं दुकान मालिक',
    role2Tag: 'दुकान / गोदाम (तौलें, खरीदें और बैच बनाएं)',
    role3Title: 'रीसाइक्लिंग कंपनी',
    role3Sub: 'अधिकृत औद्योगिक रीसायकलर संयंत्र',
    role3Tag: 'बड़ी कंपनी (थोक मांग एवं प्रमाणित आपूर्ति)',
    authMethodSms: 'एसएमएस ओटीपी',
    authMethodWhatsapp: 'व्हाट्सएप ओटीपी',
    authMethodPin: '4-अंक पिन',
    enterMobile: 'मोबाइल नंबर दर्ज करें',
    enterMobileSub: '10 अंकों का मोबाइल नंबर दर्ज करें',
    enterPin: '4 अंकों का दैनिक पिन दर्ज करें',
    enterPinSub: 'नियमित कबाड़ी भाइयों के लिए त्वरित लॉगिन',
    sendOtp: 'ओटीपी भेजें (Send OTP)',
    loginWithPin: 'पिन से लॉगिन करें',
    otpModalTitle: 'ओटीपी सत्यापन',
    otpSentTo: 'ओटीपी भेजा गया:',
    enterOtpCode: '4 अंकों का ओटीपी कोड दर्ज करें',
    verifyAndProceed: 'सत्यापित करें और आगे बढ़ें',
    autoFillDemo: '⚡ ऑटो-फिल डेमो ओटीपी (4821)',
    resendOtpIn: 'ओटीपी पुनः भेजें:',
    resendOtpNow: 'ओटीपी पुनः भेजें',
    legalProtectionTitle: 'CPCB अधिकृत डिजिटल लॉट रसीद',
    legalProtectionDesc: 'केंद्रीय ई-कचरा नियम 2022 के तहत 100% वैध व्यापार • पुलिस और स्थानीय जांच से सुरक्षित',
    needHelp: 'मदद चाहिए? ऑडियो गाइड सुनें',
    quickDemoCollector: '⚡ त्वरित डेमो: रमेश कुमार (+91 98450 12891)',
    quickDemoDealer: '⚡ त्वरित डेमो: दिलीप भाई (Peenya Yard 04)',
    quickDemoRecycler: '⚡ त्वरित डेमो: इको-रीसायकल इंडिया (Tier-1)',
    statCollectors: 'अनौपचारिक कबाड़ीवाले',
    statFormalized: 'इस महीने औपचारिक संकलन',
    statTraceable: 'CPCB फॉर्म-6 ट्रेस करने योग्य',
    cpcbNetwork: 'सीपीसीबी अधिकृत नेटवर्क',
    offlineReady: 'ऑफलाइन-सक्षम PWA',
    statutoryAudit: 'फॉर्म-6 वैधानिक ऑडिट ट्रेल',
    tollFree: 'राष्ट्रीय टोल-फ्री सहायता:',
    timing: '(सुबह 8 बजे – रात 8 बजे)'
  },
  mr: {
    cpcbRecognised: 'सीपीसीबी मान्यता प्राप्त',
    tagline: 'स्मार्ट ई-कचरा मंडी',
    liveIndex: 'थेट बाजार भाव',
    synced: 'सिंक्ड',
    signIn: 'साइन इन',
    liveMandiTickerTitle: 'आजचा थेट मंडी भाव:',
    mandiPcb: 'मदरबोर्ड (PCB): ₹780/किलो (+₹15 ▲)',
    mandiCopper: 'तांबे केबल: ₹420/किलो (+₹8 ▲)',
    mandiBattery: 'ली-आयन बॅटरी: ₹110/किलो (+₹3 ▲)',
    mandiAlu: 'ॲल्युमिनियम: ₹165/किलो',
    serverStatus: 'सर्व्हर: 100% ऑनलाइन व सिंक्ड',
    cpcbVerified: 'CPCB ई-कचरा नियम २०२२ प्रमाणित',
    form6Passes: '१००% फॉर्म-६ डिजिटल ट्रान्सफर पास',
    helplineText: 'राष्ट्रीय मदत: 1800-EW-RELINK',
    installBannerTitle: 'कबाड़ीवाला कनेक्ट ॲप इंस्टॉल करा',
    installBannerDesc: 'इंटरनेटशिवाय थेट फोन स्क्रीनवरून उघडा • वेगवान आणि सोपे',
    installBtn: 'ॲप जोडा (Install)',
    worksOffline: 'इंटरनेटशिवाय देखील चालेल',
    ready100: '100% सज्ज',
    voiceSelect: 'बोलून निवडा',
    whoAreYou: 'आपण कोण आहात?',
    whoAreYouSub: 'पुढे जाण्यासाठी आपली भूमिका निवडा',
    audioPlaying: 'आवाज सुरू आहे... आपली भूमिका निवडा',
    role1Title: 'कबाडी / फेरीवाला',
    role1Sub: 'घरोघरी संकलन करणारे व कबाडी',
    role1Tag: 'दुकान / फेरी (दैनिक भंगार आणि त्वरित रोख)',
    role2Title: 'स्क्रॅप डीलर / आढ़ती',
    role2Sub: 'यार्ड एग्रीगेटर आणि दुकान मालक',
    role2Tag: 'दुकान / गोदाम (वजन करा, खरेदी करा व बॅच बनवा)',
    role3Title: 'रीसायकलिंग कंपनी',
    role3Sub: 'अधिकृत औद्योगिक रिसायकलर प्रकल्प',
    role3Tag: 'मोठी कंपनी (थोक मागणी आणि प्रमाणित पुरवठा)',
    authMethodSms: 'एसएमएस ओटीपी',
    authMethodWhatsapp: 'व्हॉट्सॲप ओटीपी',
    authMethodPin: '४-अंकी पिन',
    enterMobile: 'मोबाईल नंबर टाका',
    enterMobileSub: '१० अंकी मोबाईल नंबर प्रविष्ट करा',
    enterPin: '४-अंकी दैनिक पिन टाका',
    enterPinSub: 'नियमित कबाडी बांधवांसाठी जलद लॉगिन',
    sendOtp: 'ओटीपी पाठवा (Send OTP)',
    loginWithPin: 'पिनने लॉगिन करा',
    otpModalTitle: 'ओटीपी पडताळणी',
    otpSentTo: 'ओटीपी पाठवला आहे:',
    enterOtpCode: '४-अंकी ओटीपी कोड प्रविष्ट करा',
    verifyAndProceed: 'पडताळणी करा आणि पुढे जा',
    autoFillDemo: '⚡ ऑटो-फिल डेमो ओटीपी (4821)',
    resendOtpIn: 'पुन्हा पाठवा:',
    resendOtpNow: 'ओटीपी पुन्हा पाठवा',
    legalProtectionTitle: 'CPCB अधिकृत डिजिटल पावती',
    legalProtectionDesc: 'केंद्रीय ई-कचरा नियम २०२२ नुसार १००% कायदेशीर व्यापार • पोलीस तपासणीपासून संरक्षण',
    needHelp: 'मदत हवी आहे? ऑडिओ मार्गदर्शक ऐका',
    quickDemoCollector: '⚡ जलद डेमो: रमेश कुमार (+91 98450 12891)',
    quickDemoDealer: '⚡ जलद डेमो: दिलीप भाई (Peenya Yard 04)',
    quickDemoRecycler: '⚡ जलद डेमो: इको-रीसायकल इंडिया (Tier-1)',
    statCollectors: 'अनौपचारिक कबाडीवाले',
    statFormalized: 'या महिन्यात संकलित',
    statTraceable: 'CPCB फॉर्म-6 ट्रॅकेबल',
    cpcbNetwork: 'सीपीसीबी अधिकृत नेटवर्क',
    offlineReady: 'ऑफलाइन-तयार PWA',
    statutoryAudit: 'फॉर्म-6 वैधानिक ऑडिट ट्रेल',
    tollFree: 'राष्ट्रीय टोल-फ्री मदत:',
    timing: '(सकाळी 8 – रात्री 8)'
  },
  en: {
    cpcbRecognised: 'CPCB RECOGNISED',
    tagline: 'Smart E-Waste Mandi',
    liveIndex: 'Live Mandi Rates',
    synced: 'Synced',
    signIn: 'Sign In',
    liveMandiTickerTitle: "Today's Live Mandi Rates:",
    mandiPcb: 'Server PCB: ₹780/kg (+₹15 ▲)',
    mandiCopper: 'Copper Cables: ₹420/kg (+₹8 ▲)',
    mandiBattery: 'Li-ion Battery: ₹110/kg (+₹3 ▲)',
    mandiAlu: 'Aluminum: ₹165/kg',
    serverStatus: 'Server: 100% Online & Synced',
    cpcbVerified: 'CPCB E-Waste Rules 2022 Verified',
    form6Passes: '100% Form-6 Digital Transfer Passes',
    helplineText: 'National Helpline: 1800-EW-RELINK',
    installBannerTitle: 'Install Kabadiwala Connect App',
    installBannerDesc: 'Access 100% offline directly from your home screen • Fast & Reliable',
    installBtn: 'Install App',
    worksOffline: 'Works 100% Offline',
    ready100: '100% Ready',
    voiceSelect: 'Voice Select',
    whoAreYou: 'Who are you?',
    whoAreYouSub: 'Select who you are to continue',
    audioPlaying: 'Audio guide active... Please select your role',
    role1Title: 'Waste Picker / Kabadiwala',
    role1Sub: 'Doorstep Collector & Scrap Picker',
    role1Tag: 'Daily Scrap & Instant Cash',
    role2Title: 'Scrap Dealer / Aggregator',
    role2Sub: 'Yard Aggregator & Shop Owner',
    role2Tag: 'Weigh, Buy & Consolidate',
    role3Title: 'Industrial Recycler',
    role3Sub: 'Authorized Smelter & Recycler',
    role3Tag: 'Bulk Demand & Certified Supply',
    authMethodSms: 'SMS OTP',
    authMethodWhatsapp: 'WhatsApp OTP',
    authMethodPin: '4-Digit PIN',
    enterMobile: 'Enter Mobile Number',
    enterMobileSub: 'Enter 10-digit mobile number',
    enterPin: 'Enter 4-Digit Quick PIN',
    enterPinSub: 'Instant login for daily field workers',
    sendOtp: 'Send OTP',
    loginWithPin: 'Login with PIN',
    otpModalTitle: 'OTP Verification',
    otpSentTo: 'OTP sent to:',
    enterOtpCode: 'Enter 4-digit verification code',
    verifyAndProceed: 'Verify & Continue',
    autoFillDemo: '⚡ Auto-fill Demo OTP (4821)',
    resendOtpIn: 'Resend in:',
    resendOtpNow: 'Resend OTP',
    legalProtectionTitle: 'CPCB Certified Digital Transfer Pass',
    legalProtectionDesc: '100% Legal Trade under E-Waste Rules 2022 • Statutory Police & Inspection Safe',
    needHelp: 'Need Help? Listen to Audio Guide',
    quickDemoCollector: '⚡ Quick Demo: Ramesh K. (+91 98450 12891)',
    quickDemoDealer: '⚡ Quick Demo: Dilip Bhai (Peenya Yard 04)',
    quickDemoRecycler: '⚡ Quick Demo: EcoRecycle India (Tier-1)',
    statCollectors: 'Informal Collectors',
    statFormalized: 'Formalized This Month',
    statTraceable: 'CPCB Form-6 Traceable',
    cpcbNetwork: 'CPCB Authorized Network',
    offlineReady: 'Offline-Ready PWA',
    statutoryAudit: 'Form-6 Statutory Audit Trail',
    tollFree: 'National Toll-Free Assistance:',
    timing: '(8 AM – 8 PM)'
  }
};

export default function Screen00WelcomeRole({ onSelectRole, currentLang: propLang, onLanguageChange }) {
  const { i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState('collector');
  const [phoneNumber, setPhoneNumber] = useState('9845012891');
  const [authMethod, setAuthMethod] = useState('sms'); // 'sms' | 'whatsapp' | 'pin'
  const [pinCode, setPinCode] = useState('1289');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAudioHint, setShowAudioHint] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const [currentLang, setCurrentLang] = useState(() => {
    return normalize(propLang || localStorage.getItem('relink_lang') || i18n.language);
  });

  useEffect(() => {
    if (propLang) {
      setCurrentLang(normalize(propLang));
    }
  }, [propLang]);

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLang(normalize(lng));
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Hidden developer shortcut via Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setShowAdminModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (showOtpModal && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, countdown]);

  const safeLang = normalize(propLang || currentLang);
  const t = TRANSLATIONS[safeLang] || TRANSLATIONS.hi;

  const handleLangChange = (lang) => {
    const safe = normalize(lang);
    if (onLanguageChange) {
      onLanguageChange(safe);
    } else {
      i18n.changeLanguage(safe);
      localStorage.setItem('relink_lang', safe);
      setCurrentLang(safe);
    }
  };

  const handlePlayWelcomeAudio = () => {
    setShowAudioHint(true);
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        let speechText = '';
        let langCode = 'hi-IN';
        if (safeLang === 'mr') {
          speechText = 'कबाड़ीवाला कनेक्ट मध्ये आपले स्वागत आहे. आपण कोण आहात? कबाडीवाला, स्क्रॅप डीलर, किंवा रीसायकलिंग कंपनी निवडा आणि पुढे जा.';
          langCode = 'mr-IN';
        } else if (safeLang === 'en') {
          speechText = 'Welcome to Kabadiwala Connect. Select who you are: Waste Picker, Scrap Dealer, or Recycler, and continue.';
          langCode = 'en-IN';
        } else {
          speechText = 'कबाड़ीवाला कनेक्ट में आपका स्वागत है। आप कौन हैं? कबाड़ीवाला, स्क्रैप डीलर, या रीसाइक्लिंग कंपनी चुनें और आगे बढ़ें।';
          langCode = 'hi-IN';
        }
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = langCode;
        utterance.rate = 0.95;
        utterance.onend = () => setShowAudioHint(false);
        utterance.onerror = () => setShowAudioHint(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.log('Audio playback notice:', e);
    }
    setTimeout(() => setShowAudioHint(false), 4500);
  };

  const handlePrimaryAuthSubmit = () => {
    if (authMethod === 'pin') {
      // 4-digit PIN verified immediately
      executeRoleLogin();
    } else {
      // Open OTP Verification Dialog
      setCountdown(30);
      setOtpInput('');
      setShowOtpModal(true);
    }
  };

  const executeRoleLogin = () => {
    setShowOtpModal(false);
    if (selectedRole === 'collector') {
      onSelectRole('collector', phoneNumber || '9845012891');
    } else if (selectedRole === 'dealer') {
      onSelectRole('dealer');
    } else if (selectedRole === 'recycler') {
      onSelectRole('recycler');
    }
  };

  const handleInstallApp = () => {
    alert(safeLang === 'mr' 
      ? 'कबाड़ीवाला कनेक्ट ॲप होम स्क्रीनवर जोडले जात आहे...' 
      : (safeLang === 'en' ? 'Adding Kabadiwala Connect to home screen...' : 'कबाड़ीवाला कनेक्ट ऐप होम स्क्रीन पर जोड़ा जा रहा है...'));
    setShowInstallBanner(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-body-md antialiased w-full bg-background text-on-surface">
      {/* Top Header Bar */}
      <header className="w-full backdrop-blur-md border-b sticky top-0 z-30 px-4 sm:px-8 py-3 bg-surface/90 border-outline-variant/30 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 bg-primary text-on-primary">
              <span className="material-symbols-outlined text-[24px]">recycling</span>
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-xl tracking-tight font-bold text-on-surface">RE:LINK</span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">
                  {t.cpcbRecognised}
                </span>
              </div>
              <span className="font-label-md text-[11px] font-bold tracking-wider uppercase text-primary">
                {t.tagline}
              </span>
            </div>
          </div>

          {/* Right Controls: Synced Status & Sign In Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Synced Status Indicator */}
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border border-outline-variant/30 bg-surface-container-low text-primary whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full animate-pulse shrink-0 bg-primary"></span>
              <span>{t.synced}</span>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURE 1: TODAY'S LIVE MANDI & STATUS TICKER MARQUEE (SCROLLING LEFT SLOWLY) */}
      <section className="w-full border-b py-2 px-0 bg-primary/5 border-primary/20 text-on-surface overflow-hidden select-none">
        <div className="w-full flex items-center overflow-hidden relative">
          {/* Left fixed badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-surface border-r border-primary/20 text-primary font-bold text-xs shrink-0 z-10 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span className="whitespace-nowrap uppercase tracking-wider text-[11px] font-extrabold">{t.liveIndex}</span>
          </div>

          {/* Marquee Track scrolling to the left */}
          <div className="overflow-hidden w-full flex">
            <div className="animate-marquee-slow flex items-center gap-4 text-xs font-semibold">
              {/* Set 1 */}
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-emerald-800">
                💻 {t.mandiPcb}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-emerald-800">
                🔌 {t.mandiCopper}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-amber-800">
                🔋 {t.mandiBattery}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-slate-800">
                ⚙️ {t.mandiAlu}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100/90 border border-emerald-300 text-emerald-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {t.serverStatus}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs text-primary font-medium">
                🏛️ {t.cpcbVerified}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs text-on-surface font-medium">
                📜 {t.form6Passes}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs text-on-surface-variant font-medium">
                📞 {t.helplineText}
              </span>

              {/* Set 2 (Duplicate for seamless continuous loop) */}
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-emerald-800">
                💻 {t.mandiPcb}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-emerald-800">
                🔌 {t.mandiCopper}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-amber-800">
                🔋 {t.mandiBattery}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs font-mono text-slate-800">
                ⚙️ {t.mandiAlu}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100/90 border border-emerald-300 text-emerald-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {t.serverStatus}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs text-primary font-medium">
                🏛️ {t.cpcbVerified}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs text-on-surface font-medium">
                📜 {t.form6Passes}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-outline-variant/30 shadow-2xs text-on-surface-variant font-medium">
                📞 {t.helplineText}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full flex-1 px-4 sm:px-6 py-5 flex flex-col justify-start items-center">
        <div className="w-full max-w-[560px] mx-auto space-y-3.5">
          
          {/* FEATURE 2: PWA INSTALL APP BANNER */}
          {showInstallBanner && (
            <div className="p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-xs bg-surface-container-low border-outline-variant/40 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate">{t.installBannerTitle}</h4>
                  <p className="text-[11px] text-on-surface-variant truncate">{t.installBannerDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
                >
                  {t.installBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInstallBanner(false)}
                  className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  title="Dismiss"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. Offline & Status Banner (Strictly Monolingual) */}
          <div className="flex items-center justify-between gap-2 px-4 py-2 rounded-full border border-outline-variant/30 bg-surface-container-high shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0 bg-primary"></span>
              <span className="text-xs font-semibold truncate">{t.worksOffline}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-primary">
              <span className="material-symbols-outlined text-[18px]">signal_cellular_alt</span>
              <span className="text-xs font-bold">{t.ready100}</span>
            </div>
          </div>

          {/* 2. Language Switcher Strip (Audio Enabled) */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xs">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleLangChange('hi')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  safeLang === 'hi' 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>हिंदी</span>
                {safeLang === 'hi' && <span className="material-symbols-outlined text-[15px]">check</span>}
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('mr')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  safeLang === 'mr' 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>मराठी</span>
                {safeLang === 'mr' && <span className="material-symbols-outlined text-[15px]">check</span>}
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('en')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  safeLang === 'en' 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>English</span>
                {safeLang === 'en' && <span className="material-symbols-outlined text-[15px]">check</span>}
              </button>
            </div>
            <button
              type="button"
              onClick={handlePlayWelcomeAudio}
              aria-label={t.voiceSelect}
              className="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer bg-primary text-on-primary"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
              <span className="hidden xs:inline">{t.voiceSelect}</span>
            </button>
          </div>

          {/* 3. Welcoming Section with Audio Prompt */}
          <div className="p-4 sm:p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">{t.whoAreYou}</h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">{t.whoAreYouSub}</p>
              </div>
              <button
                type="button"
                onClick={handlePlayWelcomeAudio}
                className="h-12 w-12 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0 bg-primary text-on-primary hover:bg-emerald-800"
                title="सुनें / Listen"
              >
                <span className="material-symbols-outlined text-[24px]">volume_up</span>
              </button>
            </div>
            {showAudioHint && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/15 text-primary text-xs font-semibold animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-[16px] animate-spin">graphic_eq</span>
                <span>{t.audioPlaying}</span>
              </div>
            )}
          </div>

          {/* 4. Role Selection Cards (3 Visual Panels) */}
          <div className="flex flex-col space-y-3" role="radiogroup" aria-label="Role selection">
            {/* Role 1: Collector / Waste Picker */}
            <div
              onClick={() => setSelectedRole('collector')}
              className={`role-card relative p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer ${
                selectedRole === 'collector'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-primary-fixed text-primary">
                  <span className="material-symbols-outlined text-[32px]">recycling</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base sm:text-lg font-bold text-on-surface truncate">
                      {t.role1Title}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        selectedRole === 'collector'
                          ? 'bg-primary text-on-primary'
                          : 'border-2 border-outline-variant text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold mt-0.5 text-primary">
                    {t.role1Sub}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[14px] text-primary">payments</span>
                    <span>{t.role1Tag}</span>
                  </div>
                </div>
              </div>
              {/* Quick Demo Shortcut */}
              <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole('collector', '9845012891');
                  }}
                  className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer text-primary"
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>{t.quickDemoCollector}</span>
                </button>
              </div>
            </div>

            {/* Role 2: Aggregator / Scrap Dealer */}
            <div
              onClick={() => setSelectedRole('dealer')}
              className={`role-card relative p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer ${
                selectedRole === 'dealer'
                  ? 'border-emerald-700 bg-emerald-500/5 shadow-sm'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:border-emerald-600/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-emerald-100 text-emerald-800">
                  <span className="material-symbols-outlined text-[32px]">store</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base sm:text-lg font-bold text-on-surface truncate">
                      {t.role2Title}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        selectedRole === 'dealer'
                          ? 'bg-emerald-700 text-white'
                          : 'border-2 border-outline-variant text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold mt-0.5 text-emerald-800">
                    {t.role2Sub}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[14px] text-emerald-700">scale</span>
                    <span>{t.role2Tag}</span>
                  </div>
                </div>
              </div>
              {/* Quick Demo Shortcut */}
              <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole('dealer');
                  }}
                  className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer text-emerald-800"
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>{t.quickDemoDealer}</span>
                </button>
              </div>
            </div>

            {/* Role 3: Authorized Recycler */}
            <div
              onClick={() => setSelectedRole('recycler')}
              className={`role-card relative p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer ${
                selectedRole === 'recycler'
                  ? 'border-secondary bg-secondary/5 shadow-sm'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:border-secondary/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined text-[32px]">precision_manufacturing</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base sm:text-lg font-bold text-on-surface truncate">
                      {t.role3Title}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        selectedRole === 'recycler'
                          ? 'bg-secondary text-on-secondary'
                          : 'border-2 border-outline-variant text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold mt-0.5 text-secondary">
                    {t.role3Sub}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                    <span>{t.role3Tag}</span>
                  </div>
                </div>
              </div>
              {/* Quick Demo Shortcut */}
              <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole('recycler');
                  }}
                  className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer text-secondary"
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>{t.quickDemoRecycler}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Quick Login Section with Dual OTP (SMS/WhatsApp) & 4-Digit Quick PIN */}
          <div className="p-4 sm:p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-on-surface">
                  {authMethod === 'pin' ? t.enterPin : t.enterMobile}
                </h2>
                <p className="text-[11px] text-on-surface-variant">
                  {authMethod === 'pin' ? t.enterPinSub : t.enterMobileSub}
                </p>
              </div>
              <span className="material-symbols-outlined text-[24px] text-primary">
                {authMethod === 'pin' ? 'pin' : (authMethod === 'whatsapp' ? 'chat' : 'smartphone')}
              </span>
            </div>

            {/* Auth Method Selector Tabs: SMS OTP / WhatsApp OTP / 4-Digit Quick PIN */}
            <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
              <button
                type="button"
                onClick={() => setAuthMethod('sms')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  authMethod === 'sms' 
                    ? 'bg-surface-container-lowest text-primary shadow-xs' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">sms</span>
                <span>{t.authMethodSms}</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('whatsapp')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  authMethod === 'whatsapp' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                <span>{t.authMethodWhatsapp}</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('pin')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  authMethod === 'pin' 
                    ? 'bg-surface-container-lowest text-primary shadow-xs' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">pin</span>
                <span>{t.authMethodPin}</span>
              </button>
            </div>

            {/* Input Box: Phone Input or 4-Digit PIN */}
            {authMethod === 'pin' ? (
              <div className="flex items-center justify-center gap-3 py-2">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength="1"
                    value={pinCode[idx] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const newPin = pinCode.split('');
                      newPin[idx] = val;
                      setPinCode(newPin.join('').slice(0, 4));
                    }}
                    className="w-12 h-14 text-center text-xl font-extrabold rounded-xl border border-outline-variant/60 bg-surface-container-low text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-stretch rounded-xl overflow-hidden border p-1 border-outline-variant/40 bg-surface-container-low focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="flex items-center justify-center px-3.5 bg-surface-container rounded-lg text-on-surface font-bold text-sm select-none">
                  <span>+91</span>
                </div>
                <input
                  id="mobile-input-field"
                  className="w-full bg-transparent px-3 py-2.5 text-base sm:text-lg font-bold text-on-surface tracking-wider outline-none placeholder:text-on-surface-variant/40"
                  inputMode="numeric"
                  maxLength="10"
                  pattern="[0-9]*"
                  placeholder="98765 43210"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                {phoneNumber.length > 0 && (
                  <button
                    onClick={() => setPhoneNumber('')}
                    className="px-3 text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
              </div>
            )}

            {/* Primary Action Button (Taller, Modern & Tactile) */}
            <button
              onClick={handlePrimaryAuthSubmit}
              className={`w-full h-14 sm:h-15 min-h-[56px] rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg active:translate-y-0.5 transition-all cursor-pointer ${
                authMethod === 'whatsapp' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-primary hover:bg-emerald-800 text-on-primary'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">
                {authMethod === 'pin' ? 'login' : (authMethod === 'whatsapp' ? 'chat' : 'send')}
              </span>
              <span>{authMethod === 'pin' ? t.loginWithPin : t.sendOtp}</span>
            </button>
          </div>

          {/* FEATURE 4: LEGAL & POLICE PROTECTION TRUST CARD */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-emerald-950 flex items-start gap-3 shadow-xs">
            <span className="material-symbols-outlined text-[24px] text-emerald-700 shrink-0">verified_user</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-emerald-900 leading-tight">
                {t.legalProtectionTitle}
              </h4>
              <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                {t.legalProtectionDesc}
              </p>
            </div>
          </div>

          {/* 6. Vernacular Voice Assistance Pill CTA */}
          <div>
            <button
              onClick={handlePlayWelcomeAudio}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-transform cursor-pointer bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
              <span className="truncate">{t.needHelp}</span>
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
            </button>
          </div>

          {/* 7. PRESERVED: Underneath Numbers & Stats Strip */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl p-4 sm:p-5 border border-outline-variant/30 bg-surface-container-low text-center shadow-xs">
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-primary">1,420+</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium mt-0.5">{t.statCollectors}</p>
            </div>
            <div className="border-x border-outline-variant/40">
              <p className="text-lg sm:text-2xl font-extrabold text-on-surface">42.8 MT</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium mt-0.5">{t.statFormalized}</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-secondary">100%</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium mt-0.5">{t.statTraceable}</p>
            </div>
          </div>

          {/* 8. PRESERVED: Clean Trust & Compliance Footer */}
          <footer className="pt-2 text-center space-y-2 pb-6">
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
            </div>
            <p className="text-xs text-on-surface-variant/70">
              {t.tollFree} <strong>1800-EW-RELINK</strong> {t.timing}
            </p>
          </footer>
        </div>
      </main>

      {/* FEATURE 5: INTERACTIVE OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">{t.otpModalTitle}</h3>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="text-xs text-on-surface-variant">
              <span>{t.otpSentTo} </span>
              <span className="font-bold text-on-surface">+91 {phoneNumber}</span>
              <span className="block mt-0.5 text-[11px] text-primary font-medium">
                {authMethod === 'whatsapp' ? 'via WhatsApp' : 'via SMS'}
              </span>
            </div>

            {/* 4-digit OTP Inputs */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otpInput[idx] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const newOtp = otpInput.split('');
                    newOtp[idx] = val;
                    setOtpInput(newOtp.join('').slice(0, 4));
                  }}
                  className="w-12 h-14 text-center text-2xl font-extrabold rounded-2xl border border-outline-variant/60 bg-surface-container-low text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              ))}
            </div>

            {/* 1-Tap Demo Auto-Fill */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setOtpInput('4821')}
                className="text-xs font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>{t.autoFillDemo}</span>
              </button>
            </div>

            {/* Verify & Proceed Button */}
            <button
              type="button"
              onClick={executeRoleLogin}
              className="w-full h-12 rounded-xl bg-primary hover:bg-emerald-800 text-on-primary font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.verifyAndProceed}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            {/* Resend Timer */}
            <div className="text-center text-[11px] text-on-surface-variant">
              {countdown > 0 ? (
                <span>{t.resendOtpIn} <b>{countdown}s</b></span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCountdown(30)}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  {t.resendOtpNow}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Master Admin Tools Modal (Hidden Developer Shortcut via Ctrl+Shift+A) */}
      <AdminToolsModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
