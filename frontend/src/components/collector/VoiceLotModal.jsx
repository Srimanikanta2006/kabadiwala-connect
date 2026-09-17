import React, { useState, useEffect, useRef } from 'react';

const VERNACULAR_CONFIG = {
  hi: {
    title: 'आवाज़ सहायक (Voice AI)',
    listening: 'सुन रहे हैं... कृपया बोलें',
    tapToSpeak: 'बोलने के लिए माइक दबाएं',
    whatToSay: 'आप यह बोलें:',
    samples: [
      '15 किलो तांबे के तार, पिकअप चाहिए',
      '20 किलो पीसीबी स्क्रैप, यार्ड में लाऊंगा',
      '10 किलो बैटरी, वैन भेजो'
    ],
    recognized: 'पहचाना गया:',
    createLotBtn: 'लॉट सारांश देखें',
    cancel: 'रद्द करें'
  },
  mr: {
    title: 'व्हॉइस असिस्टंट (Voice AI)',
    listening: 'ऐकत आहे... कृपया बोला',
    tapToSpeak: 'बोलण्यासाठी माइक दाबा',
    whatToSay: 'तुम्ही हे बोला:',
    samples: [
      '१५ किलो तांब्याची वायर, पिकअप पाहिजे',
      '२० किलो पीसीबी स्क्रॅप, यार्डात घेऊन येतो',
      '१० किलो बॅटरी, व्हॅन पाठवा'
    ],
    recognized: 'ओळखले:',
    createLotBtn: 'लॉट तपशील पहा',
    cancel: 'रद्द करा'
  },
  en: {
    title: 'Voice Assistant (Voice AI)',
    listening: 'Listening... Please speak now',
    tapToSpeak: 'Tap microphone to speak',
    whatToSay: 'What to say:',
    samples: [
      '15 kg copper cables, need van pickup',
      '20 kg PCB scrap, will drop at yard',
      '10 kg battery scrap, send van'
    ],
    recognized: 'Recognized:',
    createLotBtn: 'View Lot Summary',
    cancel: 'Cancel'
  }
};

function parseSpeechToScrap(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  let material = 'High Grade PCB Scrap';
  let category = 'PCB';
  let rate = 480;

  if (
    lower.includes('copper') || lower.includes('तांब') || lower.includes('तार') || 
    lower.includes('केबल') || lower.includes('cable') || lower.includes('wire')
  ) {
    material = 'Heavy Copper Scrap';
    category = 'COPPER';
    rate = 650;
  } else if (
    lower.includes('battery') || lower.includes('बैटरी') || lower.includes('बॅटरी') || 
    lower.includes('lithium') || lower.includes('सेल')
  ) {
    material = 'Lithium-Ion Battery Packs';
    category = 'BATTERY';
    rate = 280;
  } else if (
    lower.includes('display') || lower.includes('स्क्रीन') || lower.includes('plastic') || 
    lower.includes('प्लास्टिक')
  ) {
    material = 'Clean E-Plastics & Displays';
    category = 'PLASTIC';
    rate = 85;
  }

  let weight = 15;
  const digitMatch = lower.match(/(\d+(?:\.\d+)?)/);
  if (digitMatch && digitMatch[1]) {
    weight = parseFloat(digitMatch[1]);
  } else {
    const words = {
      'एक': 1, 'दो': 2, 'दोन': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाच': 5,
      'दस': 10, 'दहा': 10, 'पंद्रह': 15, 'पंधरा': 15, 'बीस': 20, 'वीस': 20,
      'पच्चीस': 25, 'पंचवीस': 25, 'पचास': 50, 'पन्नास': 50
    };
    for (const [w, val] of Object.entries(words)) {
      if (lower.includes(w)) {
        weight = val;
        break;
      }
    }
  }

  let fulfillment = 'VAN_PICKUP';
  if (
    lower.includes('यार्ड') || lower.includes('yard') || lower.includes('दुकान') || 
    lower.includes('drop') || lower.includes('जाऊंगा') || lower.includes('घेऊन येतो')
  ) {
    fulfillment = 'SELF_DROPOFF';
  }

  return {
    material,
    category,
    weight,
    rate,
    fulfillment,
    payout: Math.round(weight * rate)
  };
}

export default function VoiceLotModal({ isOpen, onClose, currentLang = 'hi', onLotCreated }) {
  const langKey = currentLang === 'mr' ? 'mr' : currentLang === 'en' ? 'en' : 'hi';
  const t = VERNACULAR_CONFIG[langKey] || VERNACULAR_CONFIG.hi;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detected, setDetected] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = langKey === 'mr' ? 'mr-IN' : langKey === 'en' ? 'en-IN' : 'hi-IN';

    recognition.onresult = (event) => {
      let cur = '';
      for (let i = 0; i < event.results.length; i++) {
        cur += event.results[i][0].transcript;
      }
      setTranscript(cur);
      const parsed = parseSpeechToScrap(cur);
      if (parsed) setDetected(parsed);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      try { recognition.abort(); } catch (e) {}
    };
  }, [langKey]);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setDetected(null);
      const autoListen = setTimeout(() => {
        startListening();
      }, 400);
      return () => clearTimeout(autoListen);
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = langKey === 'mr' ? 'mr-IN' : langKey === 'en' ? 'en-IN' : 'hi-IN';
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
  };

  const handleSelectSample = (sampleText) => {
    setTranscript(sampleText);
    const parsed = parseSpeechToScrap(sampleText);
    setDetected(parsed);
  };

  const handleCreateLot = () => {
    if (!detected) return;

    const matId = detected.category === 'COPPER'
      ? 'mat_cables_copper'
      : (detected.category === 'BATTERY' ? 'mat_batteries_li_ion' : 'mat_pcb_high');

    const refCode = `RL-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLot = {
      lot_id: `LOT-V${Math.floor(1000 + Math.random() * 9000)}`,
      collector_id: 'COL-8821',
      collector_name: 'Ramesh Kumar (Collector)',
      material: detected.material,
      materialTitle: detected.material,
      materialSub: `${detected.material} • Verified Scrap`,
      material_category: detected.material,
      materialId: matId,
      category: detected.category,
      weight: detected.weight,
      net_weight: detected.weight,
      quantity_kg: detected.weight,
      unit: 'kg',
      condition: 'Good / Intact',
      rate: detected.rate,
      approved_rate: detected.rate,
      market_rate: detected.rate,
      asking_rate: detected.rate,
      payout: detected.payout,
      gross_amount: detected.payout,
      delivery_mode: detected.fulfillment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      status: 'AWAITING_OFFERS',
      source: 'VOICE_AI',
      handoverRef: refCode,
      items: [{
        id: 'item_1',
        materialId: matId,
        materialTitle: detected.material,
        materialSub: `${detected.material} • Verified Scrap`,
        weight: detected.weight,
        unit: 'kg',
        condition: 'Good / Intact',
        lowEst: Math.round(detected.payout * 0.95),
        highEst: Math.round(detected.payout * 1.05)
      }]
    };

    if (onLotCreated) {
      onLotCreated(newLot);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 p-5 text-slate-900 flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </div>
            <h3 className="font-bold text-base text-slate-900">{t.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Big Mic Button */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-emerald-400/30 animate-ping"></span>
            )}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-900/30'
                  : 'bg-emerald-600 text-white shadow-emerald-900/30 hover:scale-105'
              }`}
            >
              <span className="material-symbols-outlined text-[36px]">
                {isListening ? 'mic_off' : 'mic'}
              </span>
            </button>
          </div>

          <p className="mt-3 text-xs font-bold text-slate-700">
            {isListening ? t.listening : t.tapToSpeak}
          </p>

          {transcript && (
            <p className="mt-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-center line-clamp-2">
              "{transcript}"
            </p>
          )}
        </div>

        {/* Recognized Result Pill */}
        {detected && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="leading-tight">
              <span className="text-[10.5px] font-bold uppercase text-emerald-700 block">
                {t.recognized}
              </span>
              <span className="text-xs font-black text-slate-900 block mt-0.5">
                {detected.weight} kg • {detected.material}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCreateLot}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1 transition cursor-pointer active:scale-95"
            >
              <span>{t.createLotBtn} (₹{detected.payout.toLocaleString('en-IN')})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Clean Sample Prompts Section: Just what the user should say */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            {t.whatToSay}
          </p>
          <div className="space-y-1.5">
            {t.samples.map((sample, idx) => {
              const isSelected = transcript === sample;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                      : 'bg-slate-50 hover:bg-emerald-50/70 hover:border-emerald-300 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-700">🎙️</span>
                    <span>"{sample}"</span>
                  </span>
                  <span className={`material-symbols-outlined text-[16px] transition shrink-0 ${
                    isSelected ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'
                  }`}>
                    {isSelected ? 'check_circle' : 'arrow_forward'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
