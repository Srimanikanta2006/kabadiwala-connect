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
        <div className="max-w-md w-full mx-auto flex items-center justify-between">
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
      <main className="w-full pt-4 px-4 sm:px-6 flex-1 max-w-md mx-auto space-y-4">
        {/* Back Nav & Title Bar */}
        <div className="flex items-center justify-between py-1">
          <button
            onClick={() => onNavigate('ai_scan')}
            aria-label="Go Back"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center text-center">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Lot Creation
            </span>
            <h1 className="font-headline-md text-base font-bold text-on-surface leading-tight">
              Summary &amp; Offers
            </h1>
          </div>
          <div className="w-9 h-9"></div>
        </div>

        {/* Save Offline Banner Toast if triggered */}
        {saveMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-between shadow-md animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {saveMessage}
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">IndexedDB</span>
          </div>
        )}

        {/* Prominent Lot Identifier Banner */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center justify-between border border-surface-container-high">
          <div className="flex flex-col">
            <span className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
              Lot Identifier
            </span>
            <span className="font-headline-md text-base text-on-surface font-bold tracking-tight mt-0.5 font-mono">
              #{handoverRef}
            </span>
          </div>
          <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-md text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Ready
          </span>
        </div>

        {/* Hero Visual & AI Card */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high">
          <div className="relative w-full h-48 bg-surface-container overflow-hidden flex items-center justify-center">
            <img
              alt={materialTitle}
              className="w-full h-full object-cover"
              src={lotDraft.photoUrl || 'https://lh3.googleusercontent.com/aida/AEtjO1Uibj7iPqmg9YKdnMYAfgjprFLErbb0FcOdAiLVCHgIpkj7gbP3YTmKP8zFMrg1kaOj63apJEhpOtxdLXe-93ri5nb5eVArP4y3X_auotJ1wePJz5s4YibZAvhuz-KAXyzC05MmFpsIy-yBUY4Mqu5yd0ohBBU3_J9_aC-nPfLKrNm8V66IvtxKehIH0e-8jnBWhBN-DbfYt6LisI-TlJcyw1QSl4R5LDqnipESfPn5rrrJ6LyUFidtmQ'}
            />
            <div className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {confidence}% Match
            </div>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-base font-bold text-on-surface">{materialTitle}</h2>
              <span className="font-body-md text-xs text-on-surface-variant">{materialSub}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">memory</span>
            </div>
          </div>
        </div>

        {/* Minimal Specs Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-lowest p-3 rounded-xl text-center border border-surface-container-high">
            <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">Weight</span>
            <span className="font-headline-md text-lg text-on-surface font-bold block">{weight}</span>
            <span className="font-body-md text-[10px] text-on-surface-variant">kg net</span>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-xl text-center border border-surface-container-high">
            <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">Condition</span>
            <span className="font-headline-md text-sm text-primary font-bold block truncate mt-1">{condition}</span>
            <span className="font-body-md text-[10px] text-on-surface-variant">Verified</span>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-xl text-center border border-surface-container-high">
            <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">Location</span>
            <span className="font-label-lg text-sm text-on-surface font-bold block truncate mt-1">Dharavi</span>
            <span className="font-body-md text-[10px] text-on-surface-variant truncate block">Mumbai MMR</span>
          </div>
        </div>

        {/* Clean High-Impact Value Card */}
        <div className="bg-primary text-on-primary rounded-2xl p-4 shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs text-on-primary/80 uppercase tracking-wider font-semibold">
              Estimated Value
            </span>
            <span className="bg-white/20 text-on-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
              Live Mandi Index
            </span>
          </div>
          <div className="font-headline-lg text-2xl sm:text-3xl font-bold tracking-tight font-mono">
            ₹{lowEst.toLocaleString('en-IN')} – ₹{highEst.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-on-primary/90 text-xs font-medium">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>14 authorized recyclers ready to bid within 10 km</span>
          </div>
        </div>

        {/* Streamlined Primary Actions */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={() => onNavigate('offers')}
            className="w-full h-12 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-action-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
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

        {/* Minimal Bottom Nav */}
        <nav className="sticky bottom-2 left-0 right-0 mt-4 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-lg p-1.5 flex items-center justify-around z-30 border border-surface-container-high">
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
