import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Screen03bDigitalSummary({
  lotDraft,
  onNavigate,
  onSaveOffline,
  syncStatus = { isOnline: true }
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';
  const [saveMessage, setSaveMessage] = useState(null);

  const weight = lotDraft.weight || 12.0;
  const condition = lotDraft.condition || 'Good / Intact';
  const confidence = lotDraft.confidence || 92;
  const materialTitle = lotDraft.materialTitle || 'Printed Circuit Board (PCB)';
  const materialSub = lotDraft.materialSub || 'Grade A Telecom / Server Grade';
  const handoverRef = lotDraft.handoverRef || `RL-MH-2026-00482`;

  // Calculated valuation range
  const ratePerKg = lotDraft.materialId === 'mat_cables_copper' ? 410 : (lotDraft.materialId === 'mat_batteries_lead' ? 105 : 740);
  const conditionMult = condition.includes('Good') || condition.includes('Intact') ? 1.05 : (condition.includes('Damaged') ? 0.8 : 0.95);
  const baseVal = Math.round(weight * ratePerKg * conditionMult);
  const lowEst = lotDraft.lowEst || Math.round(baseVal * 0.95);
  const highEst = lotDraft.highEst || Math.round(baseVal * 1.05);

  const handleSaveDraft = async () => {
    if (onSaveOffline) {
      await onSaveOffline({
        ...lotDraft,
        lowEst,
        highEst
      });
    }
    setSaveMessage('Saved to Offline SQLite Queue 💾');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  return (
    <div className="collector-shell bg-background font-body-md text-on-surface antialiased min-h-screen pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[18px]">recycling</span>
            </div>
            <span className="font-headline-md text-base text-primary font-bold tracking-tight">RE:LINK</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full text-xs font-medium text-on-surface-variant border border-outline-variant/30">
              <span className={`w-2 h-2 rounded-full ${syncStatus.isOnline ? 'bg-primary animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{syncStatus.isOnline ? 'Live' : 'Offline'}</span>
            </div>
            <button
              onClick={() => {
                const nextLang = currentLang === 'en' ? 'hi' : (currentLang === 'hi' ? 'mr' : 'en');
                i18n.changeLanguage(nextLang);
              }}
              className="h-8 px-2.5 bg-surface-container rounded-full text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
              type="button"
            >
              {currentLang.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-4 px-4 sm:px-6 flex-1 max-w-5xl mx-auto space-y-6">
        {/* Back Nav & Title Bar */}
        <div className="flex items-center justify-between py-1">
          <button
            onClick={() => onNavigate('ai_scan')}
            aria-label="Go Back"
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center text-center">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Digital Scrap Lot
            </span>
            <h1 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface leading-tight">
              Lot Summary &amp; Instant Valuation
            </h1>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Save Offline Banner Toast if triggered */}
        {saveMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-md animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {saveMessage}
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">IndexedDB Offline Synced</span>
          </div>
        )}

        {/* 2-Column Responsive Layout on Desktop/Tablet */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Lot Identifier, Visual, Specs (md:col-span-7) */}
          <div className="md:col-span-7 space-y-4">
            {/* Prominent Lot Identifier Banner */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between border border-surface-container-high">
              <div className="flex flex-col">
                <span className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  Verifiable Lot Reference
                </span>
                <span className="font-headline-md text-base sm:text-lg text-on-surface font-bold tracking-tight mt-0.5 font-mono text-primary">
                  #{handoverRef}
                </span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-md text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Ready for Bids
              </span>
            </div>

            {/* Hero Visual & AI Card */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high">
              <div className="relative w-full h-56 sm:h-64 bg-surface-container overflow-hidden flex items-center justify-center">
                <img
                  alt={materialTitle}
                  className="w-full h-full object-cover"
                  src={lotDraft.photoUrl || 'https://lh3.googleusercontent.com/aida/AEtjO1Uibj7iPqmg9YKdnMYAfgjprFLErbb0FcOdAiLVCHgIpkj7gbP3YTmKP8zFMrg1kaOj63apJEhpOtxdLXe-93ri5nb5eVArP4y3X_auotJ1wePJz5s4YibZAvhuz-KAXyzC05MmFpsIy-yBUY4Mqu5yd0ohBBU3_J9_aC-nPfLKrNm8V66IvtxKehIH0e-8jnBWhBN-DbfYt6LisI-TlJcyw1QSl4R5LDqnipESfPn5rrrJ6LyUFidtmQ'}
                />
                <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-on-surface text-xs font-bold flex items-center gap-1.5 shadow-sm border border-outline-variant/30">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {confidence}% Match
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-headline-md text-lg font-bold text-on-surface">{materialTitle}</h2>
                  <span className="font-body-md text-xs text-on-surface-variant">{materialSub}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">memory</span>
                </div>
              </div>
            </div>

            {/* Specs Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-lowest p-3.5 rounded-xl text-center border border-surface-container-high">
                <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">Net Weight</span>
                <span className="font-headline-md text-xl text-on-surface font-extrabold block">{weight}</span>
                <span className="font-body-md text-[11px] text-on-surface-variant">kg (est.)</span>
              </div>
              <div className="bg-surface-container-lowest p-3.5 rounded-xl text-center border border-surface-container-high">
                <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">Condition</span>
                <span className="font-headline-md text-sm text-primary font-bold block truncate mt-1">{condition}</span>
                <span className="font-body-md text-[11px] text-on-surface-variant">Verified</span>
              </div>
              <div className="bg-surface-container-lowest p-3.5 rounded-xl text-center border border-surface-container-high">
                <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">Collection Hub</span>
                <span className="font-label-lg text-sm text-on-surface font-bold block truncate mt-1">Dharavi</span>
                <span className="font-body-md text-[11px] text-on-surface-variant truncate block">Mumbai MMR</span>
              </div>
            </div>

            {/* CPCB Form-6 Assurance Card */}
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-3 flex items-center gap-2.5 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px]">policy</span>
              <span><strong>CPCB Form-6 Pre-Validated:</strong> Guaranteed statutory e-waste transfer manifest generated upon weighbridge scale settlement.</span>
            </div>
          </div>

          {/* Right Column: High-Impact Valuation & Recycler Actions (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            {/* Clean High-Impact Value Card */}
            <div className="bg-primary text-on-primary rounded-2xl p-5 sm:p-6 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-on-primary/80 uppercase tracking-wider font-semibold">
                  Estimated Mandi Value
                </span>
                <span className="bg-white/20 text-on-primary text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  Live Mandi Index
                </span>
              </div>
              <div className="font-headline-lg text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">
                ₹{lowEst.toLocaleString('en-IN')} – ₹{highEst.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-on-primary/80">
                Calculated at ₹700 – ₹780/kg for {weight}kg verified {materialTitle.split(' ')[0]} scrap.
              </p>
              <div className="flex items-center gap-1.5 pt-2 text-on-primary text-xs font-semibold border-t border-white/20">
                <span className="material-symbols-outlined text-[18px]">hub</span>
                <span>14 authorized recyclers ready to bid within 10 km</span>
              </div>
            </div>

            {/* Recycler Field Readiness Notice */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-on-surface">
                <span>Pickup Readiness</span>
                <span className="text-emerald-700">High Demand</span>
              </div>
              <div className="space-y-1 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Fastest Nearby Buyer:</span>
                  <strong className="text-on-surface">EcoRecycle MMR (3.2 km)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Average Scale Handover:</span>
                  <strong className="text-on-surface">&lt; 45 minutes</strong>
                </div>
                <div className="flex justify-between">
                  <span>Settlement Guarantee:</span>
                  <strong className="text-emerald-700">100% Cash / UPI on scale</strong>
                </div>
              </div>
            </div>

            {/* Streamlined Primary Actions */}
            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={() => onNavigate('offers')}
                className="w-full h-13 py-3.5 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-action-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                type="button"
              >
                <span>Find Recycler Offers (14 Nearby)</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full h-11 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-outline-variant/30"
                type="button"
              >
                <span className="material-symbols-outlined text-secondary text-[18px]">cloud_download</span>
                <span>Save Draft to Phone (Offline Queue)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Nav (Mobile Only) */}
        <nav className="sticky bottom-2 left-0 right-0 mt-4 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-lg p-1.5 flex md:hidden items-center justify-around z-30 border border-surface-container-high">
          <button
            onClick={() => onNavigate('ai_scan')}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-primary font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            <span className="font-label-md text-[10px]">Scan</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
            <span className="font-label-md text-[10px]">Lots</span>
          </button>
          <button
            onClick={() => onNavigate('earnings')}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span className="font-label-md text-[10px]">Earnings</span>
          </button>
          <button
            onClick={() => onNavigate('safety')}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
            <span className="font-label-md text-[10px]">Support</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
