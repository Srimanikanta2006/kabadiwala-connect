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

  const weight = lotDraft.weight || 12.0;
  const materialTitle = lotDraft.materialTitle || 'PCB (A-Grade)';
  const agreedRate = lotDraft.agreedRate || 780;
  const totalPaid = Math.round(weight * agreedRate);
  const recycler = lotDraft.acceptedRecycler || {
    name: 'EcoRecycle India Pvt Ltd',
    cpcbNo: 'CPCB/E-WASTE/REG/MH/2023/1042'
  };

  const handoverRef = lotDraft.handoverRef || `KC-TRACE-20260905-MH-${(lotDraft.id || '8F2A1C').slice(-6).toUpperCase()}`;
  const lotRef = `RL-MH-2026-${(lotDraft.id || '00482').slice(-5)}`;
  const certId = lotDraft.cpcbCertificateId || `CPCB-EPR-2026-MH-${(lotDraft.id || '9921ABCD').slice(-8).toUpperCase()}`;
  const isConfirmed = lotDraft.status === 'CONFIRMED' || lotDraft.status === 'HANDED_OVER' || true;

  const qrPayload = JSON.stringify({
    handover_ref: handoverRef,
    lot_id: lotRef,
    material: materialTitle,
    weight_kg: weight,
    rate_inr: agreedRate,
    total_inr: totalPaid,
    recycler: recycler.name,
    cpcb_reg: recycler.cpcbNo,
    gps: { lat: 19.0434, lng: 72.8576 },
    timestamp: new Date().toISOString()
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

  const handleSpeakReceipt = () => {
    const speech = currentLang === 'mr'
      ? `हँडओव्हर आणि देयक यशस्वी: ${totalPaid} रुपये रोख प्राप्त झाले. अधिकृत खरेदीदार ${recycler.name}.`
      : `हैंडओवर और भुगतान सफल: ₹${totalPaid} नकद प्राप्त हुए। अधिकृत खरीदार ${recycler.name}।`;
    speakText(speech);
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

            {/* 4 Pillars of Traceability */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px] filled">verified_user</span>
                  <span>4 Pillars of Traceability</span>
                </h3>
                <span className="text-[10px] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-bold border border-primary/20">
                  Audit Verified
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] filled mt-0.5">location_on</span>
                  <div className="flex-grow">
                    <p className="font-semibold text-on-surface">GPS Geofenced Location</p>
                    <p className="text-secondary text-[11px]">Dharavi Transit Hub • Lat 19.0434, Long 72.8576</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] filled">check_circle</span>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] filled mt-0.5">photo_camera</span>
                  <div className="flex-grow">
                    <p className="font-semibold text-on-surface">Handover Photo Proof</p>
                    <p className="text-secondary text-[11px]">Timestamped lot inspection &amp; scale capture verified</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] filled">check_circle</span>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] filled mt-0.5">scale</span>
                  <div className="flex-grow">
                    <p className="font-semibold text-on-surface">Certified Weight Scale</p>
                    <p className="text-secondary text-[11px]">
                      Gross: {(weight + 0.4).toFixed(2)} kg | Tare: 0.40 kg | Net: {weight.toFixed(2)} kg
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] filled">check_circle</span>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] filled mt-0.5">draw</span>
                  <div className="flex-grow">
                    <p className="font-semibold text-on-surface">Recycler Digital Sign-off</p>
                    <p className="text-secondary text-[11px] font-mono">{certId}</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] filled">check_circle</span>
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
                  <p className="text-xs text-secondary font-medium">{weight} kg Net Weight</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant">
                  <p className="text-xs text-secondary font-semibold">Agreed Rate</p>
                  <p className="text-sm font-bold text-primary mt-0.5 font-mono">
                    ₹{agreedRate} <span className="font-normal text-xs text-secondary">/ kg</span>
                  </p>
                  <p className="text-[11px] text-secondary">Market: ₹700-₹780</p>
                </div>
              </div>

              <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant flex items-center justify-between">
                <div>
                  <p className="text-xs text-secondary font-semibold">Authorized Buyer</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className="text-sm font-bold text-on-surface">{recycler.name}</p>
                    <span className="material-symbols-outlined text-primary text-[18px] filled">verified</span>
                  </div>
                  <p className="text-[11px] text-secondary font-mono">{recycler.cpcbNo}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary font-semibold">Total Paid</span>
                  <p className="text-2xl font-extrabold text-primary font-mono">₹{totalPaid.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-primary-container/10 p-3 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary filled text-[24px]">payments</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">✓ Paid in Full via Cash</p>
                    <p className="text-[11px] text-secondary">Physical cash verified &amp; acknowledged by collector</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-[20px] filled">check</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleShare}
                className="w-full h-12 bg-primary text-on-primary rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 font-bold text-sm cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
                <span>Download / Share Receipt (PDF/SMS)</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('earnings')}
                  className="h-11 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>View in Earnings</span>
                </button>
                <button
                  onClick={onResetLot}
                  className="h-11 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Create New Lot</span>
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
