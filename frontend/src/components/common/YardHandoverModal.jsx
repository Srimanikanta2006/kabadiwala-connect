import React, { useState } from 'react';

export default function YardHandoverModal({
  isOpen,
  onClose,
  onNavigate,
  currentLang = 'hi',
  lotData = null
}) {
  const [activeTab, setActiveTab] = useState('drop'); // 'drop' | 'pickup'
  const [showVoucher, setShowVoucher] = useState(false);
  const [pickupSubmitted, setPickupSubmitted] = useState(false);
  const [pickupSlot, setPickupSlot] = useState('immediate');
  const [pickupAddress, setPickupAddress] = useState('Peenya Cluster 3, Near 4th Cross Arch, Bengaluru');
  const [estWeight, setEstWeight] = useState(lotData?.weight || 12.0);
  const [materialType, setMaterialType] = useState(lotData?.material_category || 'PCB');

  if (!isOpen) return null;

  const safeLang = currentLang === 'mr' ? 'mr' : (currentLang === 'en' ? 'en' : 'hi');

  const t = {
    en: {
      yardTitle: "Dilip Bhai's Scrap Yard (Peenya Yard #04)",
      cpcbReg: 'CPCB Aggregator Reg #KA-AGG-2024-118',
      address: 'Gate Desk #02, 4th Cross, Peenya Industrial Area Phase 1, Bengaluru',
      distance: '1.2 km away',
      transitTime: '~8 mins by cycle/e-rickshaw',
      status: 'Open Now (08:00 - 20:00)',
      tabDrop: '📍 Drop at Yard (Self-Delivery)',
      tabPickup: '🚚 Request Doorstep Pickup',
      // Drop tab
      routeTitle: 'Physical Navigation to Yard Gate',
      step1: '1. Head East towards Peenya 4th Cross (600m)',
      step2: '2. Turn right into 4th Cross Industrial Estate (450m)',
      step3: '3. Arrive at Gate Desk #02 - Om Scrap Aggregators / Dilip Bhai (150m)',
      liveRatesTitle: 'Today\'s Guaranteed Gate Rates:',
      ratePcb: '₹755/kg',
      rateCopper: '₹415/kg',
      rateBattery: '₹240/kg',
      scaleNote: 'HX711 Digital Calibrated Scale • Zero Tare Deduction Guarantee',
      callYard: 'Call Dilip Bhai',
      openGps: 'Open Google Maps GPS',
      arrivedBtn: '⚡ Arrived at Yard - Show Inbound QR Voucher',
      // Voucher view
      voucherTitle: 'Gate Inbound Digital Voucher',
      voucherDesc: 'Show this QR code to Dilip Bhai at the Gate Scale desk for instant weighment & payment.',
      waitingScale: 'Waiting for weighbridge digital sensor handshake...',
      closeVoucher: 'Back to Navigation',
      // Pickup tab
      pickupHeader: 'Doorstep Scrap Collection Request',
      pickupSub: 'Authorized dealer vehicle will come to your workshop/location to weigh & pay on the spot.',
      pickupAddressLabel: 'Your Collection Location / Landmark:',
      slotLabel: 'Preferred Collection Time Window:',
      slot1: '⚡ Next Available (~35-45 mins - E-Rickshaw #03 Rajesh)',
      slot2: '🕐 Today Afternoon (02:00 PM - 03:30 PM)',
      slot3: '🕐 Today Evening (05:00 PM - 06:30 PM)',
      slot4: '🕐 Tomorrow Morning (09:30 AM - 11:00 AM)',
      estWeightLabel: 'Estimated Scrap Weight (kg):',
      confirmPickup: '🚚 Confirm Doorstep Pickup Request',
      pickupSuccessTitle: 'Pickup Scheduled Successfully!',
      pickupSuccessDesc: 'Dilip Bhai has accepted your pickup request. Driver Rajesh (E-Rickshaw #KA-02-ER-4412) is en route.',
      driverEta: 'Driver ETA: ~35 mins',
      callDriver: 'Call Driver Rajesh (+91 98450 12891)'
    },
    hi: {
      yardTitle: 'दिलीप भाई स्क्रैप यार्ड (पीन्या यार्ड #04)',
      cpcbReg: 'CPCB एग्रीगेटर पंजीकरण #KA-AGG-2024-118',
      address: 'गेट डेस्क #02, 4थी क्रॉस, पीन्या इंडस्ट्रियल एरिया फेज 1, बेंगलुरु',
      distance: '1.2 किमी दूर',
      transitTime: '~8 मिनट (साइकिल/ई-रिक्शा)',
      status: 'अभी खुला है (08:00 - 20:00)',
      tabDrop: '📍 यार्ड में खुद ले जाएं (ड्रॉप एट यार्ड)',
      tabPickup: '🚚 घर बैठे पिकअप मंगाएं',
      // Drop tab
      routeTitle: 'यार्ड गेट तक का वास्तविक रास्ता',
      step1: '1. पूर्व की ओर पीन्या 4थी क्रॉस की तरफ बढ़ें (600 मी.)',
      step2: '2. 4थी क्रॉस औद्योगिक क्षेत्र में दाएं मुड़ें (450 मी.)',
      step3: '3. गेट डेस्क #02 - ओम स्क्रैप एग्रीगेटर्स / दिलीप भाई पर पहुंचें (150 मी.)',
      liveRatesTitle: 'आज के गारंटीकृत गेट भाव:',
      ratePcb: '₹755/किग्रा',
      rateCopper: '₹415/किग्रा',
      rateBattery: '₹240/किग्रा',
      scaleNote: 'HX711 डिजिटल प्रमाणित इलेक्ट्रॉनिक कांटा • सही वजन की गारंटी',
      callYard: 'दिलीप भाई को कॉल करें',
      openGps: 'गूगल मैप्स GPS खोलें',
      arrivedBtn: '⚡ यार्ड पर पहुंचे - इनबाउंड QR वाउचर दिखाएं',
      // Voucher view
      voucherTitle: 'गेट इनबाउंड डिजिटल वाउचर',
      voucherDesc: 'कांटा डेस्क पर दिलीप भाई को यह QR कोड दिखाएं, तुरंत वजन और नकद/UPI भुगतान मिलेगा।',
      waitingScale: 'इलेक्ट्रॉनिक कांटे से स्वचालित वजन दर्ज होने की प्रतीक्षा...',
      closeVoucher: 'वापस नेविगेशन पर जाएं',
      // Pickup tab
      pickupHeader: 'घर/दुकान से पिकअप का अनुरोध',
      pickupSub: 'अधिकृत डीलर का वाहन आपकी लोकेशन पर आकर डिजिटल कांटे से तौलकर तुरंत पैसे देगा।',
      pickupAddressLabel: 'आपका पता / लैंडमार्क:',
      slotLabel: 'पसंदीदा पिकअप समय चुनें:',
      slot1: '⚡ सबसे जल्दी (~35-45 मिनट - ई-रिक्शा #03 राजेश)',
      slot2: '🕐 आज दोपहर (02:00 PM - 03:30 PM)',
      slot3: '🕐 आज शाम (05:00 PM - 06:30 PM)',
      slot4: '🕐 कल सुबह (09:30 AM - 11:00 AM)',
      estWeightLabel: 'अनुमानित स्क्रैप वजन (किग्रा):',
      confirmPickup: '🚚 डोरस्टेप पिकअप बुक करें',
      pickupSuccessTitle: 'पिकअप सफलतापूर्वक बुक हुआ!',
      pickupSuccessDesc: 'दिलीप भाई ने आपका पिकअप स्वीकार कर लिया है। ड्राइवर राजेश (ई-रिक्शा #KA-02-ER-4412) रवाना हो चुके हैं।',
      driverEta: 'ड्राइवर आगमन समय: ~35 मिनट',
      callDriver: 'ड्राइवर राजेश को कॉल करें (+91 98450 12891)'
    },
    mr: {
      yardTitle: 'दिलीप भाई स्क्रॅप यार्ड (पिन्या यार्ड #04)',
      cpcbReg: 'CPCB ॲग्रीगेटर नोंदणी #KA-AGG-2024-118',
      address: 'गेट डेस्क #02, 4थी क्रॉस, पिन्या इंडस्ट्रियल एरिया फेज 1, बेंगळुरू',
      distance: '1.2 किमी अंतर',
      transitTime: '~8 मिनिटे (सायकल/रिक्षा)',
      status: 'सध्या उघडे आहे (08:00 - 20:00)',
      tabDrop: '📍 यार्डवर थेट घेऊन जा (ड्रॉप)',
      tabPickup: '🚚 दाराशी पिकअप मागवा',
      // Drop tab
      routeTitle: 'यार्ड गेटकडे जाण्याचा मार्ग',
      step1: '1. पूर्वेकडे पिन्या 4थ्या क्रॉसकडे जा (600 मी.)',
      step2: '2. 4थ्या क्रॉस औद्योगिक क्षेत्रात उजवीकडे वळा (450 मी.)',
      step3: '3. गेट डेस्क #02 - ओम स्क्रॅप / दिलीप भाई येथे पोहोचा (150 मी.)',
      liveRatesTitle: 'आजचे खात्रीशीर गेट भाव:',
      ratePcb: '₹755/किलो',
      rateCopper: '₹415/किलो',
      rateBattery: '₹240/किलो',
      scaleNote: 'HX711 डिजिटल प्रमाणित वजनकाटा • तंतोतंत वजनाची खात्री',
      callYard: 'दिलीप भाईंना कॉल करा',
      openGps: 'गुगल मॅप्स GPS सुरू करा',
      arrivedBtn: '⚡ यार्डवर पोहोचलो - इनबाउंड QR वाउचर दाखवा',
      // Voucher view
      voucherTitle: 'गेट इनबाउंड डिजिटल वाउचर',
      voucherDesc: 'काटा चालवणाऱ्या दिलीप भाईंना हा QR दाखवा, लगेच वजन व रोख/UPI पेमेंट मिळेल.',
      waitingScale: 'काट्यावर वजन तपासले जात आहे...',
      closeVoucher: 'परत नेव्हिगेशनवर जा',
      // Pickup tab
      pickupHeader: 'दारातून स्क्रॅप पिकअप विनंती',
      pickupSub: 'अधिकृत डीलरचे वाहन तुमच्या जागी येऊन इलेक्ट्रॉनिक काट्यावर वजन करून जागेवर पैसे देईल.',
      pickupAddressLabel: 'पिकअप पत्ता / खूण:',
      slotLabel: 'पिकअपसाठी वेळ निवडा:',
      slot1: '⚡ सर्वात आधी (~35-45 मिनिटे - ई-रिक्षा #03 राजेश)',
      slot2: '🕐 आज दुपारी (02:00 PM - 03:30 PM)',
      slot3: '🕐 आज संध्याकाळी (05:00 PM - 06:30 PM)',
      slot4: '🕐 उद्या सकाळी (09:30 AM - 11:00 AM)',
      estWeightLabel: 'अंदाजे स्क्रॅप वजन (किलो):',
      confirmPickup: '🚚 दाराशी पिकअप बुक करा',
      pickupSuccessTitle: 'पिकअप यशस्वीरित्या बुक झाले!',
      pickupSuccessDesc: 'दिलीप भाईंनी तुमची विनंती स्वीकारली आहे. चालक राजेश (ई-रिक्षा #KA-02-ER-4412) निघत आहेत.',
      driverEta: 'चालक पोहोचण्याची वेळ: ~35 मिनिटे',
      callDriver: 'चालक राजेश यांना कॉल करा (+91 98450 12891)'
    }
  }[safeLang];

  const handleArrivedAtYard = () => {
    // Register lot into relink_inbound_dealer_lots as Yard Drop-in
    const lotRef = `RL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newLot = {
      id: `lot_${Date.now()}`,
      lot_ref: lotRef,
      collector_id: 'col_babu_rao_01',
      collector_name: 'Babu Rao (Collector)',
      collector_cluster: 'Peenya Cluster 3',
      rating: 4.8,
      kyc_verified: true,
      material_category: materialType,
      material_name: materialType === 'PCB' ? 'PCB Grade-A Motherboards' : (materialType === 'CABLES' ? 'Bright Copper Wire (94%)' : 'Li-ion Battery Cells'),
      ai_confidence: 0.94,
      asking_rate: materialType === 'PCB' ? 745 : (materialType === 'CABLES' ? 410 : 235),
      approved_rate: materialType === 'PCB' ? 755 : (materialType === 'CABLES' ? 415 : 240),
      tare_weight: 0.40,
      gross_weight: parseFloat((Number(estWeight) + 0.40).toFixed(2)),
      net_weight: Number(estWeight),
      sensor_id: 'HX711-PEENYA-02-OK',
      status: 'QUEUED',
      handover_type: 'YARD_DROP',
      queued_time: 'Just now',
      is_new_live_intake: true,
      image_url: materialType === 'PCB'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbUagrPvZBSpU5OSDT1ZkzRP-C5_lK9WqhTwmexjs6nhNfh8M9EnYpmcfV5i_iThyFhX04Zgur5XQ89-LnGRuUBOpt5cDZotWFsuY9F2NZQ4IpmmrFlafWKiW4No-fkbJrdO4Rw01_Eion13qtCIORLPgNheo_OB9cEVmigB7JOTLai2Iv77k9-t90dHyVIhukTPVNf1lHK0Yw9snELlfGalsajR_QBd03e1NWQGZ2rOgUw1DC9T79'
        : (materialType === 'CABLES' ? '/assets/icons/cables_copper.svg' : '/assets/icons/batt_liion.svg')
    };

    try {
      const existing = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
      localStorage.setItem('relink_inbound_dealer_lots', JSON.stringify([newLot, ...existing.filter(l => l.lot_ref !== newLot.lot_ref)]));
    } catch (e) {
      console.error(e);
    }

    setShowVoucher(true);
  };

  const handleConfirmPickup = () => {
    // Register lot into relink_inbound_dealer_lots as Doorstep Pickup Request
    const lotRef = `RL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newLot = {
      id: `lot_${Date.now()}`,
      lot_ref: lotRef,
      collector_id: 'col_babu_rao_01',
      collector_name: 'Babu Rao (Collector)',
      collector_cluster: 'Peenya Cluster 3',
      rating: 4.8,
      kyc_verified: true,
      material_category: materialType,
      material_name: materialType === 'PCB' ? 'PCB Grade-A Motherboards' : (materialType === 'CABLES' ? 'Bright Copper Wire (94%)' : 'Li-ion Battery Cells'),
      ai_confidence: 0.94,
      asking_rate: materialType === 'PCB' ? 745 : (materialType === 'CABLES' ? 410 : 235),
      approved_rate: materialType === 'PCB' ? 755 : (materialType === 'CABLES' ? 415 : 240),
      tare_weight: 0.40,
      gross_weight: parseFloat((Number(estWeight) + 0.40).toFixed(2)),
      net_weight: Number(estWeight),
      sensor_id: 'HX711-PEENYA-02-OK',
      status: 'PICKUP_SCHEDULED',
      handover_type: 'DOORSTEP_PICKUP',
      pickup_slot: pickupSlot,
      pickup_address: pickupAddress,
      driver_name: 'Rajesh (Fleet #03)',
      driver_phone: '+91 98450 12891',
      driver_eta: '35 mins',
      queued_time: 'Just now',
      is_new_live_intake: true,
      image_url: materialType === 'PCB'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbUagrPvZBSpU5OSDT1ZkzRP-C5_lK9WqhTwmexjs6nhNfh8M9EnYpmcfV5i_iThyFhX04Zgur5XQ89-LnGRuUBOpt5cDZotWFsuY9F2NZQ4IpmmrFlafWKiW4No-fkbJrdO4Rw01_Eion13qtCIORLPgNheo_OB9cEVmigB7JOTLai2Iv77k9-t90dHyVIhukTPVNf1lHK0Yw9snELlfGalsajR_QBd03e1NWQGZ2rOgUw1DC9T79'
        : (materialType === 'CABLES' ? '/assets/icons/cables_copper.svg' : '/assets/icons/batt_liion.svg')
    };

    try {
      const existing = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
      localStorage.setItem('relink_inbound_dealer_lots', JSON.stringify([newLot, ...existing.filter(l => l.lot_ref !== newLot.lot_ref)]));
    } catch (e) {
      console.error(e);
    }

    setPickupSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl max-w-xl w-full border border-outline-variant/60 shadow-2xl overflow-hidden my-auto">
        
        {/* MODAL HEADER */}
        <div className="bg-surface-container-lowest p-4 sm:p-5 border-b border-outline-variant/50 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">storefront</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-on-surface">
                  {t.yardTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10.5px] font-bold">
                  BEST PRACTICAL DEAL
                </span>
              </div>
              <p className="text-[11.5px] text-secondary flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-emerald-700">verified</span>
                <span>{t.cpcbReg}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* DISTANCE & OPERATIONAL STATUS BAR */}
        <div className="bg-surface-container-low px-4 sm:px-5 py-2.5 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-on-surface font-semibold">
            <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
            <span>{t.distance}</span>
            <span className="text-outline-variant">•</span>
            <span className="text-secondary font-medium">{t.transitTime}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.status}</span>
          </div>
        </div>

        {/* 2-TAB SWITCHER: DROP AT YARD vs REQUEST PICKUP */}
        <div className="grid grid-cols-2 p-1.5 bg-surface-container border-b border-outline-variant/40">
          <button
            type="button"
            onClick={() => { setActiveTab('drop'); setShowVoucher(false); }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'drop'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span>{t.tabDrop}</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('pickup'); setShowVoucher(false); }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pickup'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span>{t.tabPickup}</span>
          </button>
        </div>

        {/* TAB BODY */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[65vh] overflow-y-auto">

          {/* ======================================================== */}
          {/* OPTION A: DROP AT YARD (SELF-DELIVERY & NAVIGATION)      */}
          {/* ======================================================== */}
          {activeTab === 'drop' && (
            <>
              {!showVoucher ? (
                <div className="space-y-4">
                  {/* High-Contrast Interactive Route Card */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 relative overflow-hidden border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400 text-[20px]">explore</span>
                        <span className="font-bold text-xs uppercase tracking-wider text-emerald-300">{t.routeTitle}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">1.2 km • ~8 mins</span>
                    </div>

                    {/* Schematic GPS Road Line */}
                    <div className="space-y-2 py-1 text-xs">
                      <div className="flex items-start gap-2.5 text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">A</span>
                        <span>{t.step1}</span>
                      </div>
                      <div className="w-0.5 h-3 bg-emerald-500/40 ml-2.5"></div>
                      <div className="flex items-start gap-2.5 text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">B</span>
                        <span>{t.step2}</span>
                      </div>
                      <div className="w-0.5 h-3 bg-emerald-500/40 ml-2.5"></div>
                      <div className="flex items-start gap-2.5 text-emerald-300 font-bold">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">🏁</span>
                        <span>{t.step3}</span>
                      </div>
                    </div>

                    {/* External Maps & Call Action Row */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => window.open('tel:+919845012891')}
                        className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-emerald-400">call</span>
                        <span>{t.callYard}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=13.0285,77.5195', '_blank')}
                        className="py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">navigation</span>
                        <span>{t.openGps}</span>
                      </button>
                    </div>
                  </div>

                  {/* Guaranteed Live Yard Rates */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block">
                      {t.liveRatesTitle}
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                        <span className="text-[10.5px] text-secondary block font-medium">PCB</span>
                        <span className="text-xs sm:text-sm font-extrabold text-primary">{t.ratePcb}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                        <span className="text-[10.5px] text-secondary block font-medium">Copper</span>
                        <span className="text-xs sm:text-sm font-extrabold text-primary">{t.rateCopper}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface border border-outline-variant/40">
                        <span className="text-[10.5px] text-secondary block font-medium">Battery</span>
                        <span className="text-xs sm:text-sm font-extrabold text-primary">{t.rateBattery}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>{t.scaleNote}</span>
                    </p>
                  </div>

                  {/* Big Primary Action: Arrived at Yard -> Show Voucher */}
                  <button
                    type="button"
                    onClick={handleArrivedAtYard}
                    className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-emerald-800 text-on-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
                    <span>{t.arrivedBtn}</span>
                  </button>
                </div>
              ) : (
                /* INBOUND DIGITAL VOUCHER VIEW */
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-center space-y-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>INBOUND YARD TOKEN ACTIVE</span>
                    </span>
                    <h4 className="font-extrabold text-base sm:text-lg text-on-surface">
                      {t.voucherTitle}
                    </h4>
                    <p className="text-xs text-secondary max-w-sm mx-auto">
                      {t.voucherDesc}
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-emerald-500/40 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-inner">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=RELINK-INBOUND-PEENYA04-${Date.now()}`}
                        alt="Inbound Lot QR Voucher"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                    </div>
                    <span className="font-mono text-xs font-black tracking-widest text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                      LOT #RL-2026-PEENYA-04
                    </span>
                    <div className="text-xs text-secondary font-medium space-y-1">
                      <div>Material: <b className="text-on-surface">{materialType} ({estWeight} kg)</b></div>
                      <div>Expected Payout: <b className="text-primary">₹{(estWeight * 755).toLocaleString('en-IN')}</b></div>
                    </div>
                  </div>

                  {/* Weighbridge scale waiting heartbeat */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping shrink-0"></span>
                    <span className="font-semibold">{t.waitingScale}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVoucher(false)}
                      className="w-full py-2.5 px-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {t.closeVoucher}
                    </button>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigate('dealer_portal');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        ⚡ Open Dealer Hub (Simulate Intake)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* OPTION B: REQUEST DOORSTEP PICKUP                        */}
          {/* ======================================================== */}
          {activeTab === 'pickup' && (
            <>
              {!pickupSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-on-surface">
                      {t.pickupHeader}
                    </h4>
                    <p className="text-xs text-secondary mt-0.5">
                      {t.pickupSub}
                    </p>
                  </div>

                  {/* Pickup Address Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface block">
                      {t.pickupAddressLabel}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">
                        pin_drop
                      </span>
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Material & Weight fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface block">Scrap Category:</label>
                      <select
                        value={materialType}
                        onChange={(e) => setMaterialType(e.target.value)}
                        className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="PCB">PCB Grade-A</option>
                        <option value="CABLES">Copper Cables</option>
                        <option value="BATTERIES">Li-ion Batteries</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface block">{t.estWeightLabel}</label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={estWeight}
                        onChange={(e) => setEstWeight(e.target.value)}
                        className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      />
                    </div>
                  </div>

                  {/* Pickup Slot Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface block">
                      {t.slotLabel}
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'immediate', label: t.slot1, tag: 'Fastest' },
                        { id: 'afternoon', label: t.slot2, tag: null },
                        { id: 'evening', label: t.slot3, tag: null },
                        { id: 'tomorrow', label: t.slot4, tag: null }
                      ].map((slot) => (
                        <label
                          key={slot.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs ${
                            pickupSlot === slot.id
                              ? 'bg-emerald-50/70 border-primary text-primary font-bold'
                              : 'bg-surface-container-low border-outline-variant/50 text-on-surface font-medium hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="pickup_slot"
                              checked={pickupSlot === slot.id}
                              onChange={() => setPickupSlot(slot.id)}
                              className="text-primary focus:ring-primary"
                            />
                            <span>{slot.label}</span>
                          </div>
                          {slot.tag && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold uppercase shrink-0">
                              {slot.tag}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="button"
                    onClick={handleConfirmPickup}
                    className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-emerald-800 text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                    <span>{t.confirmPickup}</span>
                  </button>
                </div>
              ) : (
                /* PICKUP CONFIRMED STATE */
                <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-primary flex items-center justify-center mx-auto shadow-inner">
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-lg text-on-surface">
                      {t.pickupSuccessTitle}
                    </h4>
                    <p className="text-xs text-secondary max-w-sm mx-auto">
                      {t.pickupSuccessDesc}
                    </p>
                  </div>

                  {/* Driver Card */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white text-left space-y-3 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">
                          RK
                        </div>
                        <div>
                          <span className="font-bold text-sm block leading-tight">Rajesh Kumar</span>
                          <span className="text-[11px] text-slate-400">Peenya Yard Driver • E-Rickshaw #KA-02-ER-4412</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black">
                        {t.driverEta}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Digital Scale: <b>HX711 Onboard ✓</b></span>
                      <button
                        type="button"
                        onClick={() => window.open('tel:+919845012891')}
                        className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>{t.callDriver}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPickupSubmitted(false)}
                      className="w-full py-2.5 px-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Modify Request
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-emerald-800 text-on-primary font-bold text-xs transition-colors cursor-pointer"
                    >
                      Done &amp; Return Home
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
