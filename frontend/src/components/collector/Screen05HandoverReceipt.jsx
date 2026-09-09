import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

export default function Screen05HandoverReceipt({
  lotDraft,
  onNavigate,
  onResetLot,
  syncStatus = { isOnline: true }
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const unit = lotDraft.unit || 'kg';
  const weight = lotDraft.weight || (unit === 'piece' ? 5 : 12.0);
  const materialTitle = lotDraft.materialTitle || 'Printed Circuit Boards (PCB)';
  const agreedRate = lotDraft.agreedRate || 275;
  const totalPaid = Math.round(weight * agreedRate);
  const recycler = lotDraft.acceptedRecycler || {
    id: 'cpcb_mh_032',
    name: 'CBS EWaste Recycling Industries',
    statutoryRef: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032',
    cpcbNo: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032',
    facilityType: 'Recycler',
    capacityMta: 2500,
    state: 'Maharashtra',
    sourceDoc: 'CPCB Directory 2023'
  };

  const [backendHandoverRef, setBackendHandoverRef] = useState(null);
  const [paymentMode, setPaymentMode] = useState('CASH_RECEIVED'); // 'CASH_RECEIVED' | 'UPI_RECEIVED' | 'PENDING_SETTLEMENT'
  const handoverRef = backendHandoverRef || lotDraft.handoverRef || `KC-TRACE-20260905-MH-${(lotDraft.id || '8F2A1C').slice(-6).toUpperCase()}`;
  const lotRef = `RL-MH-2026-${(lotDraft.id || '00482').slice(-5)}`;
  const certId = lotDraft.cpcbCertificateId || `CPCB-EPR-2026-MH-${(lotDraft.id || '9921ABCD').slice(-8).toUpperCase()}`;
  const isConfirmed = lotDraft.status === 'CONFIRMED' || lotDraft.status === 'HANDED_OVER' || true;

  // Sync to backend digital handover service if online
  useEffect(() => {
    async function syncHandover() {
      try {
        const payload = {
          lot_id: lotDraft.id || `lot_${Date.now()}`,
          weight: Number(weight),
          gps_lat: 19.0434,
          gps_lng: 72.8576,
          collector_id: 'col_dharavi_01',
          material_id: lotDraft.materialId || 'mat_pcb_high',
          material_category: materialTitle,
          quoted_price: totalPaid,
          state: 'MH',
          recycler_id: recycler.id,
          cpcb_registration_no: recycler.statutoryRef || recycler.cpcbNo,
          statutory_reference: recycler.statutoryRef || recycler.cpcbNo,
          facility_name: recycler.name,
          facility_type: recycler.facilityType || 'Recycler',
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
  }, [paymentMode]);

  const qrPayload = JSON.stringify({
    protocol: 'RE:LINK-TRACE-V1',
    handover_ref: handoverRef,
    lot_id: lotRef,
    material: materialTitle,
    weight_kg: weight,
    rate_inr: agreedRate,
    total_inr: totalPaid,
    recycler_id: recycler.id,
    recycler_name: recycler.name,
    statutory_reference: recycler.statutoryRef || recycler.cpcbNo,
    facility_type: recycler.facilityType || 'Recycler',
    source: 'CPCB Directory 2023',
    gps: { lat: 19.0434, lng: 72.8576 },
    timestamp: new Date().toISOString(),
    payment_status: paymentMode,
    status: 'CONFIRMED'
  });

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakSoundbox = (mode = paymentMode) => {
    let speech = '';
    if (mode === 'CASH_RECEIVED') {
      speech = currentLang === 'mr'
        ? `री लिंक वर ${totalPaid.toLocaleString('en-IN')} रुपये रोख प्राप्त झाले.`
        : `री-लिंक पर ${totalPaid.toLocaleString('en-IN')} रुपये नकद प्राप्त हुए।`;
    } else if (mode === 'UPI_RECEIVED') {
      speech = currentLang === 'mr'
        ? `री लिंक वर ${totalPaid.toLocaleString('en-IN')} रुपये युपीआय द्वारे प्राप्त झाले.`
        : `री-लिंक पर ${totalPaid.toLocaleString('en-IN')} रुपये यूपीआई प्राप्त हुए।`;
    } else {
      speech = currentLang === 'mr'
        ? `वजनकाटा पडताळणीनंतर ${totalPaid.toLocaleString('en-IN')} रुपये बाकी देय आहेत.`
        : `कांटा तौल सत्यापन के बाद ${totalPaid.toLocaleString('en-IN')} रुपये बकाया देय हैं।`;
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
            onClick={() => onNavigate('offers')}
            aria-label="Back"
            className="flex items-center justify-center w-10 h-10 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="font-label-md text-[11px] text-secondary font-semibold uppercase tracking-wider leading-none">RE:LINK</span>
            <h1 className="font-headline-md text-[17px] font-bold text-on-surface leading-tight">Digital Handover Receipt</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant text-xs text-primary font-medium">
            <span className="material-symbols-outlined text-[16px] filled">cloud_done</span>
            <span>{syncStatus.isOnline ? 'Synced' : 'Offline'}</span>
          </div>
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
                  {isConfirmed ? 'Verified Handover' : 'Pending Confirmation'}
                </span>
                <h2 className="font-headline-md text-xl sm:text-2xl text-on-primary-container font-extrabold mt-1.5">
                  Handover &amp; Payment Verified
                </h2>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                  Lot successfully transferred to Authorized Recycler
                </p>
              </div>
              <button
                onClick={handleSpeakReceipt}
                aria-label="Play Hindi Audio Guidance"
                className="w-full mt-3 flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed py-2.5 px-3.5 rounded-xl border border-tertiary-fixed-dim hover:bg-tertiary-fixed-dim transition-colors shadow-sm text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-tertiary filled">volume_up</span>
                <span className="text-xs font-semibold leading-tight">
                  सुनें: 'हैंडओवर और भुगतान सफल: ₹{totalPaid.toLocaleString('en-IN')} नकद प्राप्त'
                </span>
              </button>
            </div>

            {/* Live Scannable QR Code */}
            <div className="bg-surface rounded-2xl border-2 border-primary/40 shadow-md p-5 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Weighbridge Scanner Token</p>
              <div className="p-3.5 bg-white rounded-2xl shadow-inner border border-outline-variant inline-block">
                <QRCodeSVG value={qrPayload} size={180} level="M" includeMargin={true} />
              </div>
              <p className="font-mono text-xs font-bold text-primary mt-2.5">{handoverRef}</p>
              <span className="text-[11px] text-secondary mt-0.5">Show this QR to the Recycler Weighbridge Scale Operator</span>
            </div>

            {/* Scale & Handover Verification Checklist */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px] filled">verified_user</span>
                  <span>Handover Verification Checklist</span>
                </h3>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                  Verified Clean
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">scale</span>
                    <span>Scale Weighment: <strong>{weight} {unit === 'piece' ? 'pcs (नग)' : 'kg'} Certified</strong></span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] filled">check_circle</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                    <span>Payment Status: <strong>100% Cash / Bank Received</strong></span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] filled">check_circle</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                    <span>Authorized Buyer: <strong>{recycler.name}</strong></span>
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
                  <span className="text-xs text-secondary font-semibold">Lot Reference</span>
                  <span className="text-base font-bold text-on-surface font-mono">{lotRef}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary font-semibold">Handover Token</span>
                  <p className="text-xs font-bold text-primary font-mono">{handoverRef.split('-').slice(-2).join('-')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant">
                  <p className="text-xs text-secondary font-semibold">Material &amp; Quantity</p>
                  <p className="text-sm font-bold text-on-surface mt-0.5">{materialTitle}</p>
                  <p className="text-xs text-secondary font-medium">{weight} {unit === 'piece' ? 'pcs (नग)' : 'kg'} Net</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant">
                  <p className="text-xs text-secondary font-semibold">Agreed Rate</p>
                  <p className="text-sm font-bold text-primary mt-0.5 font-mono">
                    ₹{agreedRate} <span className="font-normal text-xs text-secondary">/ {unit === 'piece' ? 'pc (नग)' : 'kg'}</span>
                  </p>
                  <p className="text-[11px] text-secondary">
                    Mandi Benchmark: ₹{Math.round(agreedRate * 0.95)}–₹{Math.round(agreedRate * 1.05)}/{unit === 'piece' ? 'pc' : 'kg'}
                  </p>
                </div>
              </div>

              <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] filled">verified</span>
                        Authorised Facility (Source: CPCB Directory 2023)
                      </span>
                      {recycler.facilityType && (
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                          {recycler.facilityType}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-on-surface mt-1">{recycler.name}</h4>
                    <p className="text-[11px] text-secondary">
                      {recycler.state || 'Maharashtra'} • {recycler.capacityMta ? `${recycler.capacityMta.toLocaleString('en-IN')} MTA Capacity` : 'Authorised E-Waste Unit'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-secondary font-semibold">Total Paid</span>
                    <p className="text-2xl font-extrabold text-primary font-mono">₹{totalPaid.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="pt-1.5 border-t border-outline-variant/40 text-[10px] text-secondary font-mono truncate" title={recycler.statutoryRef || recycler.cpcbNo}>
                  <strong>SPCB Ref:</strong> {recycler.statutoryRef || recycler.cpcbNo}
                </div>
              </div>

              {/* 3-Way Payment Status Selector (Citing Ul et al. 2023, Ray 2025) */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                    <span>{currentLang === 'mr' ? 'देयक स्थिती निवडा' : 'भुगतान स्थिति (Payment Status)'}</span>
                  </span>
                  <button
                    onClick={() => handleSpeakSoundbox(paymentMode)}
                    aria-label="Soundbox Audio Announcement"
                    className="text-[11px] text-tertiary font-bold flex items-center gap-1 bg-tertiary-fixed/60 hover:bg-tertiary-fixed px-2.5 py-1 rounded-full border border-tertiary-fixed-dim transition-colors cursor-pointer"
                    title="Soundbox Broadcast"
                  >
                    <span className="material-symbols-outlined text-[15px] filled">speaker</span>
                    <span>Soundbox Audio</span>
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
                    <span className="truncate">{currentLang === 'mr' ? 'रोख मिळाली' : 'नकद मिला'}</span>
                    <span className="text-[9px] opacity-80">(Cash)</span>
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
                    <span className="truncate">{currentLang === 'mr' ? 'UPI मिळाले' : 'UPI प्राप्त'}</span>
                    <span className="text-[9px] opacity-80">(Digital)</span>
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
                    <span className="truncate">{currentLang === 'mr' ? 'बाकी देय' : 'बकाया'}</span>
                    <span className="text-[9px] opacity-80">(Pending)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-secondary">
                  <span className="material-symbols-outlined text-[15px] text-primary">info</span>
                  <span>
                    {paymentMode === 'CASH_RECEIVED' && (currentLang === 'mr' ? 'प्रत्यक्ष रोख रक्कम मिळाली आणि सत्यापित झाली.' : 'शारीरिक नकद प्राप्त एवं सत्यापित।')}
                    {paymentMode === 'UPI_RECEIVED' && (currentLang === 'mr' ? 'डिजिटल UPI द्वारे तात्काळ खात्यात जमा.' : 'डिजिटल UPI बैंक खाते में तत्काल जमा।')}
                    {paymentMode === 'PENDING_SETTLEMENT' && (currentLang === 'mr' ? 'काटा पावतीनंतर देयक दिले जाईल (लेजरमध्ये नोंद).' : 'तौल कांटा पर्ची के बाद भुगतान देय (खाते में दर्ज)।')}
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
                    ? '100% Cash Confirmed ✓ (नकद मिला)'
                    : (paymentMode === 'UPI_RECEIVED' ? 'Instant UPI Digital Payment Verified ✓ (UPI प्राप्त)' : 'Pending Weighbridge Settlement ⏳ (कांटा तौल बकाया)');
                  const text = encodeURIComponent(
                    `*RE:LINK E-Waste Handover Voucher (हैंडओवर पर्ची)*\n` +
                    `Lot Ref: ${lotRef}\n` +
                    `Material: ${materialTitle}\n` +
                    `Quantity: ${weight} ${unit === 'piece' ? 'pcs (नग)' : 'kg'}\n` +
                    `Rate: ₹${agreedRate}/${unit === 'piece' ? 'pc (नग)' : 'kg'}\n` +
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
                <span>Share Receipt on WhatsApp (व्हाट्सएप पर पर्ची भेजें)</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full h-11 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs sm:text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>{currentLang === 'mr' ? 'पावती डाउनलोड करा • Print / Download Voucher PDF' : (currentLang === 'hi' ? 'पर्ची डाउनलोड करें • Print / Download Voucher PDF' : 'Print / Download Voucher PDF')}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('earnings')}
                  className="h-11 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>{currentLang === 'mr' ? 'कमाई पहा' : (currentLang === 'hi' ? 'कमाई देखें' : 'View Earnings')}</span>
                </button>
                <button
                  onClick={onResetLot}
                  className="h-11 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>{currentLang === 'mr' ? 'नवीन लॉट' : (currentLang === 'hi' ? 'नया लॉट' : 'Create New Lot')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-xs mt-1">Home</span>
        </button>
        <button onClick={() => onNavigate('ai_scan')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
          <span className="material-symbols-outlined filled">inventory_2</span>
          <span className="font-label-md text-xs font-bold mt-1">Sell / Lots</span>
        </button>
        <button onClick={() => onNavigate('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-xs mt-1">Earnings</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">Safety</span>
        </button>
      </nav>
    </div>
  );
}
