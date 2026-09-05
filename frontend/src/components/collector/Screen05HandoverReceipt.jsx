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
      <main className="flex-grow px-margin-mobile py-lg max-w-2xl mx-auto w-full flex flex-col gap-lg">
        {/* Status Banner */}
        <div className="bg-primary-container text-on-primary-container rounded-xl p-md shadow-md border border-outline-variant relative overflow-hidden flex flex-col items-center text-center gap-2 py-5">
          <div className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[32px] filled text-primary">check_circle</span>
          </div>
          <div>
            <span className="bg-primary-fixed text-on-primary-fixed font-label-md text-[12px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
              {isConfirmed ? 'Verified Handover' : 'Pending Confirmation'}
            </span>
            <h2 className="font-headline-md text-headline-md text-on-primary-container font-bold mt-1 text-xl">
              Handover &amp; Payment Verified
            </h2>
            <p className="font-body-md text-[14px] opacity-90">
              Lot successfully transferred to Authorized Recycler
            </p>
          </div>
          <button
            onClick={handleSpeakReceipt}
            aria-label="Play Hindi Audio Guidance"
            className="w-full mt-2 flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed py-2 px-3 rounded-lg border border-tertiary-fixed-dim hover:bg-tertiary-fixed-dim transition-colors shadow-sm text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-tertiary filled">volume_up</span>
            <span className="font-label-md text-[13px] font-medium leading-tight">
              सुनें: 'हैंडओवर और भुगतान सफल: ₹{totalPaid.toLocaleString('en-IN')} नकद प्राप्त'
            </span>
          </button>
        </div>

        {/* Live Scannable QR Code */}
        <div className="bg-surface rounded-xl border-2 border-primary/40 shadow-md p-md flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Weighbridge Scanner Token</p>
          <div className="p-3 bg-white rounded-xl shadow-inner border border-outline-variant inline-block">
            <QRCodeSVG value={qrPayload} size={180} level="M" includeMargin={true} />
          </div>
          <p className="font-mono text-xs font-bold text-primary mt-2">{handoverRef}</p>
          <span className="text-[11px] text-secondary mt-0.5">Show this QR to the Recycler Weighbridge Scale Operator</span>
        </div>

        {/* Receipt Details Card */}
        <div className="bg-surface rounded-xl border border-outline-variant shadow-sm p-md flex flex-col gap-md">
          <div className="flex justify-between items-start border-b border-surface-variant pb-sm">
            <div className="flex flex-col">
              <span className="font-label-md text-[12px] text-secondary">Lot Reference</span>
              <span className="font-headline-md text-[15px] font-bold text-on-surface">{lotRef}</span>
            </div>
            <div className="text-right">
              <span className="font-label-md text-[12px] text-secondary">Handover ID</span>
              <p className="font-label-md text-[13px] font-semibold text-primary">{handoverRef.split('-').slice(-2).join('-')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="bg-surface-container-low p-sm rounded-lg border border-surface-variant p-2.5">
              <p className="font-label-md text-[11px] text-secondary">Material &amp; Quantity</p>
              <p className="font-headline-md text-[14px] font-semibold text-on-surface mt-0.5">{materialTitle}</p>
              <p className="font-body-md text-[12px] text-on-surface-variant font-medium">{weight} kg Net Weight</p>
            </div>
            <div className="bg-surface-container-low p-sm rounded-lg border border-surface-variant p-2.5">
              <p className="font-label-md text-[11px] text-secondary">Agreed Rate</p>
              <p className="font-headline-md text-[14px] font-semibold text-primary mt-0.5">
                ₹{agreedRate} <span className="font-normal text-[11px] text-secondary">/ kg</span>
              </p>
              <p className="font-label-md text-[11px] text-secondary">Market: ₹700-₹780</p>
            </div>
          </div>

          <div className="bg-surface-container p-sm rounded-lg border border-outline-variant flex items-center justify-between p-3">
            <div>
              <p className="font-label-md text-[11px] text-secondary">Authorized Buyer</p>
              <div className="flex items-center gap-1">
                <p className="font-headline-md text-[14px] font-bold text-on-surface">{recycler.name}</p>
                <span className="material-symbols-outlined text-primary text-[16px] filled">verified</span>
              </div>
              <p className="font-body-md text-[11px] text-secondary">{recycler.cpcbNo}</p>
            </div>
            <div className="text-right">
              <span className="font-label-md text-[11px] text-secondary">Total Paid</span>
              <p className="font-action-xl text-[20px] font-extrabold text-primary">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-primary-container/10 p-sm rounded-lg border border-primary/20 p-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary filled">payments</span>
              <div>
                <p className="font-label-md text-[13px] font-bold text-on-surface">✓ Paid in Full via Cash</p>
                <p className="font-body-md text-[11px] text-secondary">Physical cash verified &amp; acknowledged by collector</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[20px] filled">check</span>
          </div>
        </div>

        {/* 4 Pillars of Traceability */}
        <div className="bg-surface rounded-xl border border-outline-variant shadow-sm p-md flex flex-col gap-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-headline-md text-[15px] font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px] filled">verified_user</span>
              4 Pillars of Traceability
            </h3>
            <span className="font-label-md text-[11px] text-primary bg-secondary-container px-2 py-0.5 rounded-full font-semibold">
              Audit Verified
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 filled">location_on</span>
              <div className="flex-grow">
                <p className="font-label-md text-[12px] font-semibold text-on-surface">GPS Geofenced Location</p>
                <p className="font-body-md text-[11px] text-on-surface-variant">Dharavi Transit Hub • Lat 19.0434, Long 72.8576</p>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px] filled">check_circle</span>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 filled">photo_camera</span>
              <div className="flex-grow">
                <p className="font-label-md text-[12px] font-semibold text-on-surface">Handover Photo Proof</p>
                <p className="font-body-md text-[11px] text-on-surface-variant">Timestamped lot inspection &amp; scale capture verified</p>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px] filled">check_circle</span>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 filled">scale</span>
              <div className="flex-grow">
                <p className="font-label-md text-[12px] font-semibold text-on-surface">Certified Weight Scale</p>
                <p className="font-body-md text-[11px] text-on-surface-variant">
                  Gross: {(weight + 0.4).toFixed(2)} kg | Tare: 0.40 kg | Net: {weight.toFixed(2)} kg
                </p>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px] filled">check_circle</span>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 filled">draw</span>
              <div className="flex-grow">
                <p className="font-label-md text-[12px] font-semibold text-on-surface">Recycler Digital Sign-off</p>
                <p className="font-body-md text-[11px] text-on-surface-variant font-mono">{certId}</p>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px] filled">check_circle</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-sm">
          <button
            onClick={handleShare}
            className="w-full h-touch-target-min bg-primary text-on-primary font-action-xl text-[15px] rounded-lg shadow-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span>Download / Share Receipt (PDF/SMS)</span>
          </button>

          <div className="grid grid-cols-2 gap-sm">
            <button
              onClick={() => onNavigate('earnings')}
              className="h-touch-target-min bg-surface-container border border-outline text-on-surface font-label-lg text-[13px] rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>View in Earnings</span>
            </button>
            <button
              onClick={onResetLot}
              className="h-touch-target-min bg-surface-container border border-outline text-on-surface font-label-lg text-[13px] rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create New Lot</span>
            </button>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
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
