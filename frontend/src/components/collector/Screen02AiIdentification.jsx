import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Screen02AiIdentification({
  lotDraft,
  onUpdateDraft,
  onNavigate,
  onRetakePhoto,
  syncStatus = { isOnline: true }
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const [weight, setWeight] = useState(lotDraft.weight || 12);
  const [condition, setCondition] = useState(lotDraft.condition || 'Used / Mixed');
  const [isConfirmed, setIsConfirmed] = useState(lotDraft.isConfirmed || false);
  const [confidence, setConfidence] = useState(lotDraft.confidence || 92);
  const [materialTitle, setMaterialTitle] = useState(lotDraft.materialTitle || 'Printed Circuit Board (PCB)');
  const [materialSub, setMaterialSub] = useState(lotDraft.materialSub || 'Motherboard / Component Grade 1');
  const [materialId, setMaterialId] = useState(lotDraft.materialId || 'mat_pcb_high');

  // Rate lookup for estimate range
  const ratePerKg = materialId === 'mat_pcb_high' ? 740 : (materialId === 'mat_cables_copper' ? 410 : 105);
  const conditionMult = condition === 'Good / Intact' ? 1.05 : (condition === 'Damaged' ? 0.75 : 0.95);
  const lowEst = Math.round(weight * ratePerKg * conditionMult * 0.95);
  const highEst = Math.round(weight * ratePerKg * conditionMult * 1.05);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakDetection = () => {
    const speech = currentLang === 'mr'
      ? `याची ओळख: ${materialTitle} (${confidence}% निश्चित). वजन ${weight} किलो.`
      : `इसकी पहचान: ${materialTitle} (${confidence}% निश्चित)। वजन ${weight} किलो।`;
    speakText(speech);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    speakText(currentLang === 'mr' ? 'श्रेणी निश्चित झाली' : 'श्रेणी कन्फर्म हुई');
  };

  const handleSelectAlternative = (title, sub, id, conf) => {
    setMaterialTitle(title);
    setMaterialSub(sub);
    setMaterialId(id);
    setConfidence(conf);
    setIsConfirmed(true);
    onUpdateDraft({ materialTitle: title, materialSub: sub, materialId: id, confidence: conf });
  };

  const handleProceed = () => {
    onUpdateDraft({
      weight,
      condition,
      materialTitle,
      materialSub,
      materialId,
      confidence,
      lowEst,
      highEst,
      isConfirmed: true
    });
    onNavigate('offers');
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen pb-[80px]">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-on-background border-b border-outline-variant dark:border-outline docked full-width top-0 sticky z-40">
        <div className="flex justify-between items-center w-full px-margin-mobile h-touch-target-min">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              aria-label="Go back"
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">RE:LINK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-primary-container/10 text-primary dark:text-primary-fixed-dim rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] filled">cloud_done</span>
              <span>{syncStatus.isOnline ? 'Synced' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-margin-mobile py-lg max-w-xl mx-auto flex flex-col gap-md">
        {/* Header Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">AI Scan Complete</span>
          </div>
          <div className="text-xs text-on-surface-variant font-medium">
            Lot #{lotDraft.id ? lotDraft.id.slice(-6).toUpperCase() : 'RL-84920'}
          </div>
        </div>

        {/* Viewfinder Image */}
        <div className="relative rounded-xl overflow-hidden border border-outline-variant bg-inverse-surface shadow-md aspect-[4/3] flex items-center justify-center">
          <img
            alt="Scanned E-Waste Scrap"
            className="w-full h-full object-cover opacity-90"
            src={lotDraft.photoUrl || '/assets/icons/pcb_high.svg'}
          />
          {/* Dashed Bounding Box */}
          <div className="absolute inset-6 border-2 border-primary-fixed border-dashed rounded-lg pointer-events-none flex flex-col justify-between p-2">
            <div className="self-start bg-primary text-on-primary text-[11px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">document_scanner</span>
              <span>{materialTitle.split(' ')[0]} detected • {confidence}%</span>
            </div>
            <div className="self-end bg-inverse-surface/85 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded border border-white/20">
              High Value E-Scrap
            </div>
          </div>
          {/* Retake Button */}
          <button
            onClick={onRetakePhoto}
            className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur text-on-surface hover:bg-surface text-xs font-medium px-3 py-1.5 rounded-full shadow border border-outline-variant flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>Retake Photo</span>
          </button>
        </div>

        {/* AI Detection Card */}
        <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px] filled">verified</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">{materialTitle}</h2>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">{materialSub}</p>
            </div>
            <button
              onClick={handleSpeakDetection}
              aria-label="Listen to narration"
              className="w-touch-target-min h-touch-target-min rounded-full flex items-center justify-center bg-tertiary-fixed text-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container shadow-sm border border-outline-variant flex-shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] filled">volume_up</span>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-outline-variant/60">
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="text-on-surface">Match Confidence</span>
              <span className="text-primary font-bold">{confidence}% High</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${confidence}%` }}></div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 bg-surface-container-low rounded-lg p-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-tertiary text-[18px]">record_voice_over</span>
            <span><strong>Audio:</strong> इसकी पहचान: {materialTitle} ({confidence}% निश्चित)</span>
          </div>

          <div className="mt-3">
            <div className="text-[11px] font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Other Potential Matches:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSelectAlternative('Copper Cables', 'Insulated Wiring Harness', 'mat_cables_copper', 88)}
                className="text-xs px-2.5 py-1 rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Insulated Copper Cable</span>
                <span className="text-on-surface-variant text-[11px] font-bold">5%</span>
              </button>
              <button
                onClick={() => handleSelectAlternative('Electric Motors', 'Copper Core & Magnets', 'mat_motors_magnets', 85)}
                className="text-xs px-2.5 py-1 rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Mixed Electronic Scrap</span>
                <span className="text-on-surface-variant text-[11px] font-bold">3%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-3 text-center">
            Is this material identified correctly?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleConfirm}
              className={`h-touch-target-min font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-colors active:scale-[0.98] cursor-pointer ${
                isConfirmed ? 'bg-emerald-700 text-white' : 'bg-primary hover:bg-primary-container text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] font-bold">check</span>
              <span>{isConfirmed ? '✓ Confirmed' : 'Yes, Confirm'}</span>
            </button>
            <button
              onClick={() => onNavigate('category_select')}
              className="h-touch-target-min bg-surface hover:bg-surface-container text-secondary font-semibold border border-outline-variant rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Change Category</span>
            </button>
          </div>
        </div>

        {/* Quick Lot Details Card */}
        <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <span className="font-label-lg text-label-lg font-semibold text-on-surface">Quick Lot Details</span>
            <span className="text-xs text-primary font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Auto-estimated
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">Approximate Weight</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full h-11 px-3 bg-surface-container-low border border-outline-variant rounded-lg font-headline-md text-headline-md font-bold text-on-surface focus:outline-none focus:border-primary text-lg"
                />
                <span className="absolute right-3 top-2.5 text-on-surface-variant font-medium text-sm">kg</span>
              </div>
              <button
                onClick={() => setWeight((w) => parseFloat((w + 1).toFixed(1)))}
                className="h-11 px-3 bg-surface border border-outline-variant hover:bg-surface-container rounded-lg font-medium text-xs text-on-surface cursor-pointer"
              >
                +1kg
              </button>
              <button
                onClick={() => setWeight((w) => parseFloat((w + 5).toFixed(1)))}
                className="h-11 px-3 bg-surface border border-outline-variant hover:bg-surface-container rounded-lg font-medium text-xs text-on-surface cursor-pointer"
              >
                +5kg
              </button>
              <button
                onClick={() => setWeight((w) => parseFloat((w + 10).toFixed(1)))}
                className="h-11 px-3 bg-surface border border-outline-variant hover:bg-surface-container rounded-lg font-medium text-xs text-on-surface cursor-pointer"
              >
                +10kg
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">Batch Condition</label>
            <div className="grid grid-cols-3 gap-2">
              {['Good / Intact', 'Used / Mixed', 'Damaged'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    condition === cond
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'border border-outline-variant text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">cloud_sync</span>
            <div className="text-xs text-on-surface-variant">
              <span className="font-semibold text-on-surface">Saved to local storage</span> — ready to match buyers offline or online.
            </div>
          </div>
        </div>

        {/* Proceed Action Bar */}
        <div className="pt-1">
          <button
            onClick={handleProceed}
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-headline-md text-headline-md font-bold shadow-md flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">request_quote</span>
              <span>Proceed to Recycler Offers</span>
            </div>
            <span className="text-sm font-semibold bg-white/20 px-2.5 py-1 rounded-md">
              ₹{lowEst.toLocaleString('en-IN')} - ₹{highEst.toLocaleString('en-IN')}
            </span>
          </button>
          <p className="text-center text-[11px] text-on-surface-variant mt-2">
            Estimated based on {weight} kg {materialTitle} scrap in your region
          </p>
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
