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
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [materialTitle, setMaterialTitle] = useState(lotDraft.materialTitle || 'Printed Circuit Board (PCB)');
  const [materialSub, setMaterialSub] = useState(lotDraft.materialSub || 'Motherboard / Component Grade 1');
  const [materialId, setMaterialId] = useState(lotDraft.materialId || 'mat_pcb_high');

  // Dynamic top-3 alternatives from model predictions
  const alternativeMatches = (lotDraft.top3Predictions && lotDraft.top3Predictions.length > 0)
    ? lotDraft.top3Predictions.filter(p => (p.category || p.id) !== materialId).slice(0, 2)
    : [
        { category: 'mat_cables_copper', category_name: 'Insulated Copper Cable', confidence: 0.08 },
        { category: 'mat_motors_magnets', category_name: 'Electric Motors & Magnets', confidence: 0.05 }
      ];

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
    onNavigate('lot_summary');
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
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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

        {/* 2-Column Responsive Layout on Desktop/Tablet */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Viewfinder & AI Detection (md:col-span-7) */}
          <div className="md:col-span-7 space-y-4">
            {/* Viewfinder Image */}
            <div className="relative rounded-2xl overflow-hidden border border-outline-variant bg-inverse-surface shadow-md aspect-[4/3] flex items-center justify-center">
              <img
                alt="Scanned E-Waste Scrap"
                className="w-full h-full object-cover opacity-90"
                src={lotDraft.photoUrl || '/assets/icons/pcb_high.svg'}
              />
              {/* Dashed Bounding Box */}
              <div className="absolute inset-6 border-2 border-primary-fixed border-dashed rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="self-start bg-primary text-on-primary text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">document_scanner</span>
                  <span>{materialTitle.split(' ')[0]} detected • {confidence}% Match</span>
                </div>
                <div className="self-end bg-inverse-surface/85 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md border border-white/20">
                  High Value E-Scrap Grade 1
                </div>
              </div>
              {/* Retake Button */}
              <button
                onClick={onRetakePhoto}
                className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur text-on-surface hover:bg-surface text-xs font-semibold px-3 py-1.5 rounded-full shadow border border-outline-variant flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>Retake Photo</span>
              </button>
            </div>

            {/* AI Detection Card */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
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
              <span className={`font-bold ${
                confidence >= 80 ? 'text-primary' : (confidence >= 60 ? 'text-amber-600' : 'text-error')
              }`}>
                {confidence}% {confidence >= 80 ? 'High' : (confidence >= 60 ? 'Moderate' : 'Low (Unclear/Dim)')}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  confidence >= 80 ? 'bg-primary' : (confidence >= 60 ? 'bg-amber-500' : 'bg-error')
                }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 bg-surface-container-low rounded-lg p-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-tertiary text-[18px]">record_voice_over</span>
            <span><strong>Audio:</strong> {currentLang === 'mr'
              ? `याची ओळख: ${materialTitle} (${confidence}% निश्चित).`
              : `इसकी पहचान: ${materialTitle} (${confidence}% निश्चित)।`}</span>
          </div>

          {lotDraft.boundingBoxes && lotDraft.boundingBoxes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-outline-variant/60">
              <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface-variant mb-2">
                <span className="flex items-center gap-1 text-primary font-bold">
                  <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                  Roboflow 19.6k Model ({lotDraft.boundingBoxes.length} Objects Detected)
                </span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                  v43 Cloud
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {lotDraft.boundingBoxes.map((b, idx) => (
                  <button
                    key={b.detection_id || idx}
                    type="button"
                    onClick={() => handleSelectAlternative(b.name_en, b.cpcb_code, b.category_id, Math.round(b.confidence * 100))}
                    className="text-xs px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/15 text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-primary">{b.raw_class}</span>
                    <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded border border-outline-variant/60 text-on-surface-variant font-bold">
                      {Math.round(b.confidence * 100)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3">
            <div className="text-[11px] font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Other Potential Matches (Top Predictions):
            </div>
            <div className="flex flex-wrap gap-2">
              {alternativeMatches.map((alt, idx) => {
                const altTitle = alt.category_name || alt.name_en || alt.category || 'Alternative Scrap';
                const altId = alt.category || alt.id || 'mat_cables_copper';
                const altPct = Math.round((alt.confidence || 0.1) * 100);
                return (
                  <button
                    key={altId + idx}
                    onClick={() => handleSelectAlternative(altTitle, 'Alternative Candidate', altId, altPct)}
                    className="text-xs px-2.5 py-1 rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{altTitle}</span>
                    <span className="text-on-surface-variant text-[11px] font-bold">{altPct}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Configurable Confidence Threshold Selector Bar */}
        <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2 rounded-xl border border-outline-variant/40 text-xs">
          <span className="font-semibold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
            Confidence Gate Threshold:
          </span>
          <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 border border-outline-variant/60">
            {[60, 70, 85].map(th => (
              <button
                key={th}
                type="button"
                onClick={() => setConfidenceThreshold(th)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  confidenceThreshold === th
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {th}%
              </button>
            ))}
          </div>
        </div>

        {/* Low Confidence Fallback Banner */}
        {confidence < confidenceThreshold && (
          <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-xl p-3.5 flex flex-col gap-2 shadow-sm animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px] text-amber-600">warning</span>
                <span>
                  {currentLang === 'mr'
                    ? `${confidence}% अचूकता (${confidenceThreshold}% मर्यादेपेक्षा कमी)`
                    : (currentLang === 'hi'
                        ? `${confidence}% सटीकता (${confidenceThreshold}% सीमा से कम)`
                        : `${confidence}% Confidence is Below ${confidenceThreshold}% Gate`)}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase">
                Review Required
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {currentLang === 'mr'
                ? `अचूकता ${confidence}% आहे. कृपया अचूक दरासाठी श्रेणी ग्रिडमधून खात्री करा किंवा बदला.`
                : (currentLang === 'hi'
                    ? `सटीकता ${confidence}% है। सही मूल्य पाने के लिए कृपया श्रेणी ग्रिड से पुष्टि करें या बदलें।`
                    : `AI confidence (${confidence}%) is below the configured gate (${confidenceThreshold}%). You can manually confirm this category or select from the 7-category grid.`)}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => onNavigate('category_select')}
                className="bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                <span>{currentLang === 'mr' ? 'श्रेणी ग्रिडमधून बदला' : (currentLang === 'hi' ? 'श्रेणी ग्रिड से बदलें' : 'Change Category')}</span>
              </button>
              <button
                onClick={handleConfirm}
                className="bg-surface hover:bg-surface-container border border-amber-500/50 text-amber-900 dark:text-amber-200 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Confirm Anyway</span>
              </button>
            </div>
          </div>
        )}

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
              className={`h-touch-target-min font-semibold border rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer ${
                confidence < 60
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 font-bold'
                  : 'bg-surface hover:bg-surface-container text-secondary border-outline-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Change Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Weight, Condition & Valuation Workbench (md:col-span-5) */}
      <div className="md:col-span-5 space-y-4">
        {/* Quick Lot Details Card */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <span className="font-label-lg text-label-lg font-semibold text-on-surface">Lot Specifications</span>
            <span className="text-xs text-primary font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Verified
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">Estimated Batch Weight</label>
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
            <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">Batch Physical Condition</label>
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

          {/* Regional Benchmark Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">currency_rupee</span>
              <div>
                <p className="text-xs font-bold text-on-surface">Mandi Benchmark Rate</p>
                <p className="text-[11px] text-secondary">Verified MMR CPCB Index</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-primary">₹700 – ₹780/kg</span>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">cloud_sync</span>
            <div className="text-[11px] text-on-surface-variant">
              <span className="font-semibold text-on-surface">Local draft ready</span> — offline persistence active.
            </div>
          </div>
        </div>

        {/* Proceed Action Bar */}
        <div className="pt-1">
          <button
            onClick={handleProceed}
            className="w-full py-4 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-2xl font-headline-md font-bold shadow-md flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="text-base">Create Lot &amp; View Summary</span>
            </div>
            <span className="text-sm font-extrabold bg-white/20 px-3 py-1 rounded-lg">
              ₹{lowEst.toLocaleString('en-IN')} - ₹{highEst.toLocaleString('en-IN')}
            </span>
          </button>
          <p className="text-center text-[11px] text-on-surface-variant mt-2">
            Estimated based on {weight} kg {materialTitle} scrap in your region
          </p>
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
