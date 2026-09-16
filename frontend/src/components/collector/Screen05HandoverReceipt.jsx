import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

const RECEIPT_TRANSLATIONS = {
  hi: {
    receiptTitle: 'डिजिटल हस्तांतरण रसीद',
    verifiedHandover: 'सत्यापित हस्तांतरण',
    pendingHandover: 'सत्यापन प्रक्रियाधीन',
    handoverVerified: 'हस्तांतरण एवं भुगतान सत्यापित',
    lotTransferred: 'कबाड़ अधिकृत डीलर यार्ड को सफलतापूर्वक हस्तांतरित हुआ',
    qrTokenTitle: 'वजनकांटा स्कैनर टोकन',
    showQrPrompt: 'यह QR कोड डीलर यार्ड के कांटा ऑपरेटर को दिखाएं',
    checklistTitle: 'हस्तांतरण सत्यापन चेकलिस्ट',
    checklistClean: 'सत्यापित सुरक्षित',
    scaleWeighment: 'कांटा तौल:',
    scaleCertified: 'प्रमाणित',
    paymentStatusLabel: 'भुगतान स्थिति:',
    paymentReceived: '100% नकद / बैंक में प्राप्त',
    authorizedBuyer: 'अधिकृत डीलर यार्ड:',
    lotRef: 'लॉट संदर्भ',
    handoverToken: 'हस्तांतरण टोकन',
    matAndQty: 'सामग्री एवं मात्रा',
    agreedRate: 'स्वीकृत दर',
    mandiBenchmark: 'मंडी हमीभाव:',
    cpcbDirectory: 'अधिकृत स्क्रैप डीलर यार्ड',
    totalPaid: 'कुल भुगतान',
    selectPaymentStatus: 'भुगतान स्थिति चुनें',
    soundboxAudio: 'साउंडबॉक्स ऑडियो',
    cashReceived: 'नकद मिला',
    cashSub: '(नकद)',
    upiReceived: 'UPI प्राप्त',
    upiSub: '(डिजिटल)',
    pendingSettlement: 'बकाया',
    pendingSub: '(लंबित)',
    cashDesc: 'शारीरिक नकद प्राप्त एवं सत्यापित।',
    upiDesc: 'डिजिटल UPI बैंक खाते में तत्काल जमा।',
    pendingDesc: 'तौल कांटा पर्ची के बाद भुगतान देय (खाते में दर्ज)।',
    shareWhatsApp: 'व्हाट्सएप पर पर्ची भेजें',
    printPdf: 'पर्ची डाउनलोड करें (PDF)',
    viewEarnings: 'कमाई देखें',
    newLot: 'नया लॉट',
    navHome: 'होम',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  mr: {
    receiptTitle: 'डिजिटल हस्तांतरण पावती',
    verifiedHandover: 'सत्यापित हस्तांतरण',
    pendingHandover: 'पडताळणी बाकी',
    handoverVerified: 'हस्तांतरण व देयक पडताळणी पूर्ण',
    lotTransferred: 'भंगार अधिकृत डीलर यार्डकडे यशस्वीरित्या हस्तांतरित झाले',
    qrTokenTitle: 'वजनकाटा स्कॅनर टोकन',
    showQrPrompt: 'हा QR कोड डीलर यार्डच्या वजनकाटा ऑपरेटरला दाखवा',
    checklistTitle: 'हस्तांतरण पडताळणी चेकलिस्ट',
    checklistClean: 'सत्यापित सुरक्षित',
    scaleWeighment: 'काटा मोजणी:',
    scaleCertified: 'प्रमाणित',
    paymentStatusLabel: 'देयक स्थिती:',
    paymentReceived: '100% रोख / बँक जमा',
    authorizedBuyer: 'अधिकृत डीलर यार्ड:',
    lotRef: 'लॉट संदर्भ',
    handoverToken: 'हस्तांतरण टोकन',
    matAndQty: 'सामग्री व प्रमाण',
    agreedRate: 'मान्य दर',
    mandiBenchmark: 'हमीभाव निर्देशांक:',
    cpcbDirectory: 'अधिकृत स्क्रॅप डीलर यार्ड',
    totalPaid: 'एकूण देयक रक्कम',
    selectPaymentStatus: 'देयक स्थिती निवडा',
    soundboxAudio: 'साउंडबॉक्स ध्वनी',
    cashReceived: 'रोख मिळाले',
    cashSub: '(रोख)',
    upiReceived: 'UPI जमा',
    upiSub: '(डिजिटल)',
    pendingSettlement: 'बाकी',
    pendingSub: '(बाकी)',
    cashDesc: 'प्रत्यक्ष रोख रक्कम मिळाली व तपासली.',
    upiDesc: 'तातडीने बँक खात्यात UPI द्वारे जमा.',
    pendingDesc: 'काटा पावतीनंतर देयक दिले जाईल (लेजरमध्ये नोंद).',
    shareWhatsApp: 'व्हॉट्सॲपवर पावती पाठवा',
    printPdf: 'पावती डाउनलोड करा (PDF)',
    viewEarnings: 'कमाई पहा',
    newLot: 'नवीन लॉट',
    navHome: 'मुख्य',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  en: {
    receiptTitle: 'Digital Handover Receipt',
    verifiedHandover: 'Verified Handover',
    pendingHandover: 'Pending Confirmation',
    handoverVerified: 'Handover & Payment Verified',
    lotTransferred: 'Lot successfully transferred to Authorized Recycler',
    qrTokenTitle: 'Weighbridge Scanner Token',
    showQrPrompt: 'Show this QR to the Recycler Weighbridge Scale Operator',
    checklistTitle: 'Handover Verification Checklist',
    checklistClean: 'Verified Clean',
    scaleWeighment: 'Scale Weighment:',
    scaleCertified: 'Certified',
    paymentStatusLabel: 'Payment Status:',
    paymentReceived: '100% Cash / Bank Received',
    authorizedBuyer: 'Authorized Buyer:',
    lotRef: 'Lot Reference',
    handoverToken: 'Handover Token',
    matAndQty: 'Material & Quantity',
    agreedRate: 'Agreed Rate',
    mandiBenchmark: 'Mandi Benchmark:',
    cpcbDirectory: 'Authorised Facility (Source: CPCB Directory 2023)',
    totalPaid: 'Total Paid',
    selectPaymentStatus: 'Payment Status',
    soundboxAudio: 'Soundbox Audio',
    cashReceived: 'Cash Received',
    cashSub: '(Cash)',
    upiReceived: 'UPI Received',
    upiSub: '(Digital)',
    pendingSettlement: 'Pending',
    pendingSub: '(Pending)',
    cashDesc: 'Physical cash received and verified.',
    upiDesc: 'Instant UPI transferred to bank account.',
    pendingDesc: 'Payment due upon weighbridge slip verification.',
    shareWhatsApp: 'Share Receipt on WhatsApp',
    printPdf: 'Print / Download Voucher PDF',
    viewEarnings: 'View Earnings',
    newLot: 'Create New Lot',
    navHome: 'Home',
    navMyLots: 'My Lots',
    navEarnings: 'Earnings',
    navSafety: 'Safety'
  }
};

export default function Screen05HandoverReceipt({
  lotDraft,
  onNavigate,
  onNavigateBack,
  activeScreen = 'receipt',
  onResetLot,
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
  const t = RECEIPT_TRANSLATIONS[safeLang] || RECEIPT_TRANSLATIONS.hi;

  const unit = lotDraft.unit || 'kg';
  const weight = lotDraft.weight || (unit === 'piece' ? 5 : 12.0);
  const materialTitle = lotDraft.materialTitle || 'Printed Circuit Boards (PCB)';
  const agreedRate = lotDraft.agreedRate || 275;
  const totalPaid = Math.round(weight * agreedRate);
  const isDealer = lotDraft.buyerType === 'DEALER' || lotDraft.acceptedBuyer?.tier?.includes('Aggregator') || lotDraft.acceptedBuyer?.facilityType?.includes('Aggregator');
  const buyer = lotDraft.acceptedBuyer || lotDraft.acceptedRecycler || {
    id: 'hub_peenya_04',
    name: 'Peenya Industrial Aggregator Yard #04 (Dilip Bhai)',
    adminName: 'Dilip Bhai',
    statutoryRef: 'CPCB Aggregator Reg #KA-AGG-2024-118',
    cpcbNo: 'CPCB Aggregator Reg #KA-AGG-2024-118',
    facilityType: 'Authorised Aggregator Yard',
    tier: 'Aggregator Yard',
    address: 'Gate Desk #02, 4th Cross, Peenya Industrial Area Phase 1, Bengaluru',
    state: 'Karnataka'
  };
  const recycler = buyer;

  const [backendHandoverRef, setBackendHandoverRef] = useState(null);
  const [paymentMode, setPaymentMode] = useState('CASH_RECEIVED'); // 'CASH_RECEIVED' | 'UPI_RECEIVED' | 'PENDING_SETTLEMENT'
  const [showQrVerifierModal, setShowQrVerifierModal] = useState(false);
  const [scannedVerifiedToast, setScannedVerifiedToast] = useState(false);
  const handoverRef = backendHandoverRef || lotDraft.handoverRef || `KC-TRACE-20260912-KA-${(lotDraft.id || '8F2A1C').slice(-6).toUpperCase()}`;
  const lotRef = `RL-2026-${(lotDraft.id || '00482').slice(-5)}`;
  const certId = lotDraft.cpcbCertificateId || `CPCB-EPR-2026-KA-${(lotDraft.id || '9921ABCD').slice(-8).toUpperCase()}`;
  const isConfirmed = lotDraft.status === 'CONFIRMED' || lotDraft.status === 'HANDED_OVER' || true;

  // Cross-Portal Handshake: write directly to localStorage so DealerDashboard.jsx immediately loads this lot
  useEffect(() => {
    if (isDealer) {
      try {
        const existing = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
        const lotItem = {
          id: lotDraft.id || `lot_${Date.now()}`,
          lot_ref: handoverRef.startsWith('RL-') ? handoverRef : lotRef,
          collector_id: 'col_ramesh_peenya',
          collector_name: 'Ramesh Kumar',
          collector_cluster: 'Peenya Cluster 3',
          rating: 4.8,
          kyc_verified: true,
          material_category: (lotDraft.materialId || 'pcb').includes('pcb') ? 'PCB' : ((lotDraft.materialId || '').includes('cable') ? 'CABLES' : ((lotDraft.materialId || '').includes('batt') ? 'BATTERIES' : 'DISPLAYS')),
          material_name: materialTitle,
          ai_confidence: 0.94,
          asking_rate: agreedRate,
          approved_rate: agreedRate,
          tare_weight: 0.40,
          gross_weight: Number((weight + 0.40).toFixed(2)),
          net_weight: Number(weight.toFixed(2)),
          sensor_id: buyer.scaleSensorId || 'HX711-PEENYA-02-OK',
          status: 'QUEUED',
          queued_time: 'Just now',
          image_url: lotDraft.photoUrl || '/assets/icons/pcb_high.svg',
          is_new_live_intake: true
        };
        const updated = [lotItem, ...existing.filter(l => l.lot_ref !== lotItem.lot_ref && l.id !== lotItem.id)];
        localStorage.setItem('relink_inbound_dealer_lots', JSON.stringify(updated));
      } catch (e) {
        console.log('Dealer inbound storage sync notice:', e);
      }
    }
  }, [isDealer, lotRef, handoverRef, materialTitle, agreedRate, weight]);

  // Sync to backend digital handover service if online
  useEffect(() => {
    async function syncHandover() {
      try {
        const payload = {
          lot_id: lotDraft.id || `lot_${Date.now()}`,
          weight: Number(weight),
          gps_lat: 13.0285,
          gps_lng: 77.5195,
          collector_id: 'col_ramesh_peenya',
          material_id: lotDraft.materialId || 'mat_pcb_high',
          material_category: materialTitle,
          quoted_price: totalPaid,
          state: 'KA',
          buyer_type: isDealer ? 'DEALER' : 'RECYCLER',
          dealer_id: buyer.id,
          dealer_name: buyer.name,
          admin_name: buyer.adminName || 'Dilip Bhai',
          recycler_id: buyer.id,
          cpcb_registration_no: buyer.statutoryRef || buyer.cpcbNo,
          statutory_reference: buyer.statutoryRef || buyer.cpcbNo,
          facility_name: buyer.name,
          facility_type: buyer.facilityType || (isDealer ? 'Authorised Aggregator Yard' : 'Recycler'),
          payment_mode: paymentMode
        };
        const res = await fetch('http://localhost:8000/handover/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.handover_ref) {
            setBackendHandoverRef(data.handover_ref);
          }
        }
      } catch (e) {
        console.log('Offline / local handover fallback', e);
      }
    }
    syncHandover();
  }, [paymentMode, isDealer, weight, totalPaid, buyer, materialTitle]);

  const qrPayload = JSON.stringify({
    protocol: 'RE:LINK-TRACE-V1',
    handover_ref: handoverRef,
    lot_id: lotRef,
    buyer_type: isDealer ? 'DEALER' : 'RECYCLER',
    dealer_id: buyer.id,
    dealer_name: buyer.name,
    admin_name: buyer.adminName || 'Dilip Bhai',
    material: materialTitle,
    weight_kg: weight,
    rate_inr: agreedRate,
    total_inr: totalPaid,
    statutory_reference: buyer.statutoryRef || buyer.cpcbNo,
    facility_type: buyer.facilityType || (isDealer ? 'Authorised Aggregator Yard' : 'Authorised Recycler'),
    timestamp: new Date().toISOString(),
    payment_status: paymentMode,
    status: 'QUEUED_AT_GATE'
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

  const handleSpeakSoundbox = (mode = paymentMode) => {
    let speech = '';
    if (mode === 'CASH_RECEIVED') {
      speech = safeLang === 'mr'
        ? `री लिंक वर ${totalPaid.toLocaleString('en-IN')} रुपये रोख प्राप्त झाले.`
        : (safeLang === 'en' ? `On RE:LINK, Rupees ${totalPaid.toLocaleString('en-IN')} cash received.` : `री-लिंक पर ${totalPaid.toLocaleString('en-IN')} रुपये नकद प्राप्त हुए।`);
    } else if (mode === 'UPI_RECEIVED') {
      speech = safeLang === 'mr'
        ? `री लिंक वर ${totalPaid.toLocaleString('en-IN')} रुपये युपीआय द्वारे प्राप्त झाले.`
        : (safeLang === 'en' ? `On RE:LINK, Rupees ${totalPaid.toLocaleString('en-IN')} received via UPI.` : `री-लिंक पर ${totalPaid.toLocaleString('en-IN')} रुपये यूपीआई प्राप्त हुए।`);
    } else {
      speech = safeLang === 'mr'
        ? `वजनकाटा पडताळणीनंतर ${totalPaid.toLocaleString('en-IN')} रुपये बाकी देय आहेत.`
        : (safeLang === 'en' ? `Balance of Rupees ${totalPaid.toLocaleString('en-IN')} pending after weighbridge verification.` : `कांटा तौल सत्यापन के बाद ${totalPaid.toLocaleString('en-IN')} रुपये बकाया देय हैं।`);
    }
    speakText(speech);
  };

  const handleSpeakReceipt = () => {
    handleSpeakSoundbox(paymentMode);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `RE:LINK Handover Receipt - ${handoverRef}`,
        text: `Handover Receipt: ${weight}kg ${materialTitle}, Amount ₹${totalPaid}, Ref: ${handoverRef}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      window.print();
    }
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="docked full-width top-0 border-b border-outline-variant bg-surface text-primary flex justify-between items-center w-full px-margin-mobile h-touch-target-min z-40 sticky">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (onNavigateBack ? onNavigateBack() : onNavigate('home'))}
            aria-label="Back"
            className="flex items-center justify-center w-10 h-10 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="font-label-md text-[11px] text-secondary font-semibold uppercase tracking-wider leading-none">RE:LINK</span>
            <h1 className="font-headline-md text-[17px] font-bold text-on-surface leading-tight">{t.receiptTitle}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onLanguageChange && (
            <button
              onClick={onLanguageChange}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/40 bg-primary-container/40 text-primary hover:bg-primary-container text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Change Language"
            >
              <span className="material-symbols-outlined text-[16px]">translate</span>
              <span>{safeLang === 'hi' ? 'हिन्दी' : safeLang === 'mr' ? 'मराठी' : 'EN'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Responsive 2-Column Grid on Desktop/Tablet */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Status, QR Code & Traceability (md:col-span-6) */}
          <div className="md:col-span-6 space-y-4">
            {/* Status Banner */}
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-5 shadow-md border border-outline-variant relative overflow-hidden flex flex-col items-center text-center gap-2 py-6">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[36px] filled text-primary">check_circle</span>
              </div>
              <div>
                <span className="bg-primary-fixed text-on-primary-fixed font-label-md text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {isConfirmed ? t.verifiedHandover : t.pendingHandover}
                </span>
                <h2 className="font-headline-md text-xl sm:text-2xl text-on-primary-container font-extrabold mt-1.5">
                  {t.handoverVerified}
                </h2>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                  {t.lotTransferred}
                </p>
              </div>
              <button
                onClick={handleSpeakReceipt}
                aria-label="Play Audio Guidance"
                className="w-full mt-3 flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed py-2.5 px-3.5 rounded-xl border border-tertiary-fixed-dim hover:bg-tertiary-fixed-dim transition-colors shadow-sm text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-tertiary filled">volume_up</span>
                <span className="text-xs font-semibold leading-tight">
                  {safeLang === 'mr'
                    ? `ऐका: 'हस्तांतरण व देयक यशस्वी: ₹${totalPaid.toLocaleString('en-IN')} प्राप्त'`
                    : (safeLang === 'en'
                      ? `Listen: 'Handover & Payment verified: ₹${totalPaid.toLocaleString('en-IN')} received'`
                      : `सुनें: 'हैंडओवर और भुगतान सफल: ₹${totalPaid.toLocaleString('en-IN')} प्राप्त'`)}
                </span>
              </button>
            </div>

            {/* Live Scannable QR Code */}
            <div className="bg-surface rounded-2xl border-2 border-primary/40 shadow-md p-5 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">{t.qrTokenTitle}</p>
              <div className="p-3.5 bg-white rounded-2xl shadow-inner border border-outline-variant inline-block">
                <QRCodeSVG value={qrPayload} size={180} level="M" includeMargin={true} />
              </div>
              <p className="font-mono text-xs font-bold text-primary mt-2.5">{handoverRef}</p>
              <span className="text-[11px] text-secondary mt-0.5">
                {isDealer
                  ? (safeLang === 'mr' ? 'हा क्यूआर कोड यार्ड गेट ऑपरेटरला (दिलीप भाई) दाखवा' : (safeLang === 'hi' ? 'यह क्यूआर कोड यार्ड गेट ऑपरेटर (दिलीप भाई) को दिखाएं' : 'Show this QR to the Yard Gate Scale Operator (Dilip Bhai)'))
                  : t.showQrPrompt}
              </span>

              {/* Interactive Live Weighbridge Scanner Test Button */}
              <button
                type="button"
                onClick={() => setShowQrVerifierModal(true)}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-700">document_scanner</span>
                <span>{safeLang === 'mr' ? 'स्कॅनर पडताळणी चाचणी (Verify QR)' : (safeLang === 'hi' ? 'स्कैनर सत्यापन टेस्ट (Verify QR)' : 'Test / Verify Weighbridge Scanner')}</span>
              </button>
            </div>

            {/* Scale & Handover Verification Checklist */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px] filled">verified_user</span>
                  <span>{t.checklistTitle}</span>
                </h3>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                  {t.checklistClean}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">scale</span>
                    <span>{t.scaleWeighment} <strong>{weight} {unit === 'piece' ? (safeLang === 'en' ? 'pcs' : 'नग') : 'kg'} {t.scaleCertified}</strong></span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] filled">check_circle</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                    <span>{t.paymentStatusLabel} <strong>{t.paymentReceived}</strong></span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] filled">check_circle</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                    <span>{t.authorizedBuyer} <strong>{recycler.name}</strong></span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] filled">check_circle</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Receipt Breakdown & Payout (md:col-span-6) */}
          <div className="md:col-span-6 space-y-4">
            {/* Receipt Details Card */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-start border-b border-surface-variant pb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-secondary font-semibold">{t.lotRef}</span>
                  <span className="text-base font-bold text-on-surface font-mono">{lotRef}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary font-semibold">{t.handoverToken}</span>
                  <p className="text-xs font-bold text-primary font-mono">{handoverRef.split('-').slice(-2).join('-')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant">
                  <p className="text-xs text-secondary font-semibold">{t.matAndQty}</p>
                  <p className="text-sm font-bold text-on-surface mt-0.5">{materialTitle}</p>
                  <p className="text-xs text-secondary font-medium">{weight} {unit === 'piece' ? (safeLang === 'en' ? 'pcs' : 'नग') : 'kg'} Net</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant">
                  <p className="text-xs text-secondary font-semibold">{t.agreedRate}</p>
                  <p className="text-sm font-bold text-primary mt-0.5 font-mono">
                    ₹{agreedRate} <span className="font-normal text-xs text-secondary">/ {unit === 'piece' ? (safeLang === 'en' ? 'pc' : 'नग') : 'kg'}</span>
                  </p>
                  <p className="text-[11px] text-secondary">
                    {t.mandiBenchmark} ₹{Math.round(agreedRate * 0.95)}–₹{Math.round(agreedRate * 1.05)}/{unit === 'piece' ? (safeLang === 'en' ? 'pc' : 'नग') : 'kg'}
                  </p>
                </div>
              </div>

              <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] filled">verified</span>
                        {t.cpcbDirectory}
                      </span>
                      {recycler.facilityType && (
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                          {recycler.facilityType}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-on-surface mt-1">{recycler.name}</h4>
                    <p className="text-[11px] text-secondary">
                      {recycler.address || recycler.state || 'Peenya Industrial Area'} • {safeLang === 'mr' ? 'प्रमाणित वजनकाटा' : (safeLang === 'hi' ? 'प्रमाणित कांटा' : 'Calibrated Scale')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-secondary font-semibold">{t.totalPaid}</span>
                    <p className="text-2xl font-extrabold text-primary font-mono">₹{totalPaid.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="pt-1.5 border-t border-outline-variant/40 text-[10px] text-secondary font-mono truncate" title={recycler.statutoryRef || recycler.cpcbNo}>
                  <strong>{safeLang === 'mr' ? 'नोंदणी:' : (safeLang === 'hi' ? 'यार्ड पंजीकरण:' : 'Yard ID:')}</strong> {recycler.statutoryRef || recycler.cpcbNo}
                </div>
                <div className="pt-1.5 border-t border-outline-variant/30 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">recycling</span>
                  <span>{safeLang === 'mr' ? 'डीलरमार्फत प्रमाणित औद्योगिक रिसायकलिंग प्रकल्पाकडे पाठवले जाईल' : (safeLang === 'hi' ? 'डीलर द्वारा प्रमाणित रीसाइक्लिंग प्लांट को प्रेषित' : 'Aggregated by dealer for certified industrial recycling')}</span>
                </div>
              </div>

              {/* 3-Way Payment Status Selector (Citing Ul et al. 2023, Ray 2025) */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                    <span>{t.selectPaymentStatus}</span>
                  </span>
                  <button
                    onClick={() => handleSpeakSoundbox(paymentMode)}
                    aria-label="Soundbox Audio Announcement"
                    className="text-[11px] text-tertiary font-bold flex items-center gap-1 bg-tertiary-fixed/60 hover:bg-tertiary-fixed px-2.5 py-1 rounded-full border border-tertiary-fixed-dim transition-colors cursor-pointer"
                    title="Soundbox Broadcast"
                  >
                    <span className="material-symbols-outlined text-[15px] filled">speaker</span>
                    <span>{t.soundboxAudio}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('CASH_RECEIVED');
                      handleSpeakSoundbox('CASH_RECEIVED');
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      paymentMode === 'CASH_RECEIVED'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span className="truncate">{t.cashReceived}</span>
                    <span className="text-[9px] opacity-80">{t.cashSub}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('UPI_RECEIVED');
                      handleSpeakSoundbox('UPI_RECEIVED');
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      paymentMode === 'UPI_RECEIVED'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    <span className="truncate">{t.upiReceived}</span>
                    <span className="text-[9px] opacity-80">{t.upiSub}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('PENDING_SETTLEMENT');
                      handleSpeakSoundbox('PENDING_SETTLEMENT');
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      paymentMode === 'PENDING_SETTLEMENT'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                    <span className="truncate">{t.pendingSettlement}</span>
                    <span className="text-[9px] opacity-80">{t.pendingSub}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-secondary">
                  <span className="material-symbols-outlined text-[15px] text-primary">info</span>
                  <span>
                    {paymentMode === 'CASH_RECEIVED' && t.cashDesc}
                    {paymentMode === 'UPI_RECEIVED' && t.upiDesc}
                    {paymentMode === 'PENDING_SETTLEMENT' && t.pendingDesc}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* 1-Tap WhatsApp Voucher Share */}
              <button
                onClick={() => {
                  const paymentText = paymentMode === 'CASH_RECEIVED'
                    ? (safeLang === 'en' ? '100% Cash Confirmed ✓' : '100% Cash Confirmed ✓ (नकद मिला)')
                    : (paymentMode === 'UPI_RECEIVED' ? (safeLang === 'en' ? 'Instant UPI Digital Payment Verified ✓' : 'Instant UPI Digital Payment Verified ✓ (UPI प्राप्त)') : (safeLang === 'en' ? 'Pending Weighbridge Settlement ⏳' : 'Pending Weighbridge Settlement ⏳ (कांटा तौल बकाया)'));
                  const text = encodeURIComponent(
                    `*RE:LINK E-Waste Handover Voucher*\n` +
                    `Lot Ref: ${lotRef}\n` +
                    `Material: ${materialTitle}\n` +
                    `Quantity: ${weight} ${unit === 'piece' ? (safeLang === 'en' ? 'pcs' : 'नग') : 'kg'}\n` +
                    `Rate: ₹${agreedRate}/${unit === 'piece' ? (safeLang === 'en' ? 'pc' : 'नग') : 'kg'}\n` +
                    `*Total Value: ₹${totalPaid.toLocaleString('en-IN')}*\n` +
                    `Authorized Recycler: ${recycler.name}\n` +
                    `SPCB Ref: ${recycler.statutoryRef || recycler.cpcbNo}\n` +
                    `Payment Status: ${paymentText}\n` +
                    `Weighbridge Token: ${handoverRef}`
                  );
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-bold text-sm cursor-pointer active:scale-[0.99]"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
                <span>{t.shareWhatsApp}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full h-11 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs sm:text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>{t.printPdf}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('earnings')}
                  className="h-11 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>{t.viewEarnings}</span>
                </button>
                <button
                  onClick={onResetLot}
                  className="h-11 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>{t.newLot}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer transition-colors ${
            activeScreen === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'home' ? 'filled' : ''}`}>home</span>
          <span className="font-label-md text-xs mt-1">{t.navHome}</span>
        </button>
        <button
          onClick={() => onNavigate('my_lots')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
            activeScreen === 'my_lots' || activeScreen === 'receipt' ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90' : 'p-2 text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'my_lots' || activeScreen === 'receipt' ? 'filled' : ''}`}>inventory_2</span>
          <span className="font-label-md text-xs font-bold mt-1">{t.navMyLots}</span>
        </button>
        <button
          onClick={() => onNavigate('earnings')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
            activeScreen === 'earnings' ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90' : 'p-2 text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'earnings' ? 'filled' : ''}`}>payments</span>
          <span className="font-label-md text-xs mt-1">{t.navEarnings}</span>
        </button>
        <button
          onClick={() => onNavigate('safety')}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer transition-colors ${
            activeScreen === 'safety' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'safety' ? 'filled' : ''}`}>info</span>
          <span className="font-label-md text-xs mt-1">{t.navSafety}</span>
        </button>
      </nav>

      {/* Live Weighbridge Scanner Verification Modal */}
      {showQrVerifierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-5 shadow-2xl border border-outline-variant space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">qr_code_scanner</span>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Weighbridge Scanner Verification</h3>
                  <p className="text-[11px] text-emerald-700 font-bold">🟢 Live Traceability QR Valid</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowQrVerifierModal(false);
                  setScannedVerifiedToast(false);
                }}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/60 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/30">
                <span className="text-secondary font-medium">Token Reference:</span>
                <span className="font-mono font-bold text-primary">{handoverRef}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/30">
                <span className="text-secondary font-medium">Scrap Material:</span>
                <span className="font-bold text-on-surface">{materialTitle}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/30">
                <span className="text-secondary font-medium">Net Weight:</span>
                <span className="font-extrabold text-on-surface">{weight} {unit === 'piece' ? 'pcs' : 'kg'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/30">
                <span className="text-secondary font-medium">Approved Payout:</span>
                <span className="font-extrabold text-emerald-800 font-mono text-sm">₹{totalPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/30">
                <span className="text-secondary font-medium">Destination Yard:</span>
                <span className="font-medium text-on-surface">{buyer.name || 'Dilip Bhai Scrap Yard'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-secondary font-medium">Scale Sensor Link:</span>
                <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  HX711-PEENYA-02-OK
                </span>
              </div>
            </div>

            {scannedVerifiedToast && (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
                <span className="material-symbols-outlined text-emerald-700 text-[20px] filled">check_circle</span>
                <span>Gate Scanner Beep Verified! Handover token acknowledged at yard scale desk.</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setScannedVerifiedToast(true);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(
                      safeLang === 'mr'
                        ? 'वजनकाटा स्कॅनर प्रमाणित. टोकन यशस्वीपणे जोडले गेले आहे.'
                        : (safeLang === 'en'
                            ? 'Weighbridge scanner confirmed. Token handshake successful.'
                            : 'कांटा स्कैनर सत्यापित। टोकन सफलतापूर्वक प्राप्त हुआ।')
                    );
                    utterance.lang = safeLang === 'mr' ? 'mr-IN' : (safeLang === 'hi' ? 'hi-IN' : 'en-IN');
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">volume_up</span>
                <span>Test Gate Scanner Beep</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQrVerifierModal(false);
                  setScannedVerifiedToast(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
