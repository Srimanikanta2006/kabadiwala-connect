import React, { useState, useEffect, useRef } from 'react';
import './PriceBoard.css';

// Fallback rates if backend is unreachable or offline
const FALLBACK_CATEGORIES = [
  {
    material_id: "mat_pcb_high",
    icon: "⚡",
    name_en: "High-Grade PCB",
    name_hi: "हाई-ग्रेड सर्किट बोर्ड",
    name_mr: "हाय-ग्रेड सर्किट बोर्ड",
    current_rate: 240,
    previous_rate: 230,
    unit: "kg",
    trend: "UP",
    trend_arrow: "▲",
    change_amount: 10,
    change_pct: 4.3,
    sparkline: [225, 228, 230, 235, 240],
    spoken_texts: {
      hi: "हाई-ग्रेड सर्किट बोर्ड का आज का भाव 240 रुपये प्रति किलो है। आज भाव 10 रुपये चढ़ा है।",
      mr: "हाय-ग्रेड सर्किट बोर्डचा आजचा दर 240 रुपये प्रति किलो आहे. आज दर 10 रुपयांनी वाढला आहे.",
      en: "High-Grade PCB rate today is 240 rupees per kg. Price is up by 10 rupees today."
    }
  },
  {
    material_id: "mat_cables_copper",
    icon: "🔌",
    name_en: "Copper Cables",
    name_hi: "तांबे के तार / केबल",
    name_mr: "तांब्याची केबल",
    current_rate: 380,
    previous_rate: 380,
    unit: "kg",
    trend: "STABLE",
    trend_arrow: "―",
    change_amount: 0,
    change_pct: 0.0,
    sparkline: [375, 380, 380, 380, 380],
    spoken_texts: {
      hi: "तांबे के तार का आज का भाव 380 रुपये प्रति किलो है। आज भाव स्थिर है।",
      mr: "तांब्याची केबलचा आजचा दर 380 रुपये प्रति किलो आहे. आज दर स्थिर आहे.",
      en: "Copper Cables rate today is 380 rupees per kg. Price is stable."
    }
  },
  {
    material_id: "mat_batteries_lead",
    icon: "🔋",
    name_en: "Lead-Acid Battery",
    name_hi: "लेड-एसिड बैटरी",
    name_mr: "लेड-अ‍ॅसिड बॅटरी",
    current_rate: 100,
    previous_rate: 105,
    unit: "kg",
    trend: "DOWN",
    trend_arrow: "▼",
    change_amount: -5,
    change_pct: -4.8,
    sparkline: [110, 108, 106, 105, 100],
    spoken_texts: {
      hi: "लेड-एसिड बैटरी का आज का भाव 100 रुपये प्रति किलो है। आज भाव 5 रुपये गिरा है।",
      mr: "लेड-अ‍ॅसिड बॅटरीचा आजचा दर 100 रुपये प्रति किलो आहे. आज दर 5 रुपयांनी कमी झाला आहे.",
      en: "Lead-Acid Battery rate today is 100 rupees per kg. Price is down by 5 rupees today."
    }
  },
  {
    material_id: "mat_batteries_li_ion",
    icon: "📱",
    name_en: "Lithium-Ion Battery",
    name_hi: "लिथियम बैटरी",
    name_mr: "लिथियम बॅटरी",
    current_rate: 185,
    previous_rate: 180,
    unit: "kg",
    trend: "UP",
    trend_arrow: "▲",
    change_amount: 5,
    change_pct: 2.8,
    sparkline: [175, 178, 180, 182, 185],
    spoken_texts: {
      hi: "लिथियम बैटरी का आज का भाव 185 रुपये प्रति किलो है। आज भाव 5 रुपये चढ़ा है।",
      mr: "लिथियम बॅटरीचा आजचा दर 185 रुपये प्रति किलो आहे. आज दर 5 रुपयांनी वाढला आहे.",
      en: "Lithium-Ion Battery rate today is 185 rupees per kg. Price is up by 5 rupees today."
    }
  },
  {
    material_id: "mat_motors_magnets",
    icon: "⚙️",
    name_en: "Motors & Magnets",
    name_hi: "मोटर और चुंबक",
    name_mr: "मोटार आणि चुंबक",
    current_rate: 72,
    previous_rate: 70,
    unit: "kg",
    trend: "UP",
    trend_arrow: "▲",
    change_amount: 2,
    change_pct: 2.9,
    sparkline: [68, 69, 70, 71, 72],
    spoken_texts: {
      hi: "मोटर और चुंबक का आज का भाव 72 रुपये प्रति किलो है।",
      mr: "मोटार आणि चुंबकचा आजचा दर 72 रुपये प्रति किलो आहे.",
      en: "Motors & Magnets rate today is 72 rupees per kg."
    }
  },
  {
    material_id: "mat_pcb_low",
    icon: "🖥️",
    name_en: "Low-Grade PCB",
    name_hi: "लो-ग्रेड सर्किट बोर्ड",
    name_mr: "लो-ग्रेड सर्किट बोर्ड",
    current_rate: 55,
    previous_rate: 55,
    unit: "kg",
    trend: "STABLE",
    trend_arrow: "―",
    change_amount: 0,
    change_pct: 0.0,
    sparkline: [52, 54, 55, 55, 55],
    spoken_texts: {
      hi: "लो-ग्रेड सर्किट बोर्ड का आज का भाव 55 रुपये प्रति किलो है।",
      mr: "लो-ग्रेड सर्किट बोर्डचा आजचा दर 55 रुपये प्रति किलो आहे.",
      en: "Low-Grade PCB rate today is 55 rupees per kg."
    }
  },
  {
    material_id: "mat_lcd_panel",
    icon: "📺",
    name_en: "LCD Screen",
    name_hi: "एलसीडी स्क्रीन",
    name_mr: "एलसीडी स्क्रीन",
    current_rate: 42,
    previous_rate: 44,
    unit: "kg",
    trend: "DOWN",
    trend_arrow: "▼",
    change_amount: -2,
    change_pct: -4.5,
    sparkline: [46, 45, 44, 43, 42],
    spoken_texts: {
      hi: "एलसीडी स्क्रीन का आज का भाव 42 रुपये प्रति किलो है। भाव 2 रुपये गिरा है।",
      mr: "एलसीडी स्क्रीनचा आजचा दर 42 रुपये प्रति किलो आहे. दर 2 रुपयांनी कमी झाला आहे.",
      en: "LCD Screen rate today is 42 rupees per kg. Down by 2 rupees."
    }
  },
  {
    material_id: "mat_crt_monitor",
    icon: "📻",
    name_en: "CRT Monitor / TV",
    name_hi: "सीआरटी मॉनिटर / टीवी",
    name_mr: "सीआरटी मॉनिटर / टीव्ही",
    current_rate: 15,
    previous_rate: 15,
    unit: "kg",
    trend: "STABLE",
    trend_arrow: "―",
    change_amount: 0,
    change_pct: 0.0,
    sparkline: [14, 15, 15, 15, 15],
    spoken_texts: {
      hi: "सीआरटी मॉनिटर का आज का भाव 15 रुपये प्रति किलो है।",
      mr: "सीआरटी मॉनिटरचा आजचा दर 15 रुपये प्रति किलो आहे.",
      en: "CRT Monitor rate today is 15 rupees per kg."
    }
  }
];

// Lightweight SVG Sparkline component (no charting library needed)
function Sparkline({ points = [], trend = "STABLE", width = 64, height = 26 }) {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padding = 3;
  const usableHeight = height - padding * 2;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * (width - 4) + 2;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${coords.join(" L ")}`;
  const strokeColor = trend === "UP" ? "#059669" : (trend === "DOWN" ? "#dc2626" : "#64748b");

  return (
    <svg width={width} height={height} className="price-sparkline" aria-hidden="true">
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circle highlight at latest point */}
      <circle
        cx={coords[coords.length - 1].split(",")[0]}
        cy={coords[coords.length - 1].split(",")[1]}
        r="3"
        fill={strokeColor}
      />
    </svg>
  );
}

export default function PriceBoard() {
  const [location, setLocation] = useState("IN-MH-MUM");
  const [language, setLanguage] = useState("hi");
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);
  const [dataSource, setDataSource] = useState("SUPABASE_DATABASE");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const currentAudioRef = useRef(null);

  // Fetch real-time price board from FastAPI backend
  const fetchPriceBoard = async (loc = location, lang = language) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/prices/board?location=${loc}&language=${lang}`);
      if (res.ok) {
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setDataSource(data.source || "SUPABASE_DATABASE");
          setLastUpdated(new Date().toLocaleTimeString());
        }
      }
    } catch (err) {
      console.warn("Backend price board unreachable, using local cached rates:", err);
      setDataSource("OFFLINE_CACHE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceBoard(location, language);
  }, [location, language]);

  // Voice playback handler: calls Bhashini TTS with Web Speech API native fallback
  const speakPrice = async (category) => {
    const textToSpeak = category.spoken_texts?.[language] || category.spoken_texts?.hi || `${category.name_hi} भाव ₹${category.current_rate}`;

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setActiveSpeakingId(category.material_id);

    try {
      // 1. Try Bhashini Indic TTS endpoint
      const response = await fetch("http://localhost:8000/tts/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak, language: language })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio_base64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
          currentAudioRef.current = audio;
          audio.onended = () => setActiveSpeakingId(null);
          audio.onerror = () => fallbackWebSpeech(textToSpeak, language, category.material_id);
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.log("Using browser SpeechSynthesis fallback");
    }

    // 2. Native Web Speech API fallback (works 100% offline on Android & Desktop)
    fallbackWebSpeech(textToSpeak, language, category.material_id);
  };

  const fallbackWebSpeech = (text, lang, catId) => {
    if (!window.speechSynthesis) {
      setActiveSpeakingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : (lang === "mr" ? "mr-IN" : "en-IN");
    utterance.rate = 0.95; // Slightly slower for clear rural comprehension
    utterance.pitch = 1.0;

    utterance.onend = () => setActiveSpeakingId(null);
    utterance.onerror = () => setActiveSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Read entire price board sequentially
  const speakAllPrices = () => {
    const combined = categories.map(c => c.spoken_texts?.[language] || c.name_hi).join(" ... ");
    fallbackWebSpeech(combined, language, "all");
  };

  return (
    <div className="priceboard-container">
      {/* Header Bar */}
      <header className="priceboard-header">
        <div className="header-brand">
          <div className="brand-badge">⚡ LIVE MANDI</div>
          <h1 className="header-title">
            {language === "hi" && "दैनिक कबाड़ भाव सूची"}
            {language === "mr" && "दैनिक स्क्रॅप दर पत्रक"}
            {language === "en" && "Daily Scrap Price Board"}
          </h1>
          <p className="header-subtitle">
            {language === "hi" && "सरकारी सीपीसीबी दरों पर आधारित पारदर्शी मूल्य"}
            {language === "mr" && "अधिकृत सीपीसीबी नियमांनुसार पारदर्शक दर"}
            {language === "en" && "Transparent rates aligned with CPCB E-Waste Rules"}
          </p>
        </div>

        {/* Controls: Location & Language */}
        <div className="priceboard-controls">
          <div className="control-group">
            <label className="control-label">📍 {language === "hi" ? "मंडी स्थान" : (language === "mr" ? "बाजारपेठ" : "Location")}</label>
            <select
              className="control-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="IN-MH-MUM">मुंबई - धारावी / कुर्ला</option>
              <option value="IN-MH-PUN">पुणे - पिंपरी / भोसरी</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">🌐 {language === "hi" ? "भाषा" : (language === "mr" ? "भाषा" : "Language")}</label>
            <div className="lang-pill-group">
              <button
                type="button"
                className={`lang-pill ${language === 'hi' ? 'active' : ''}`}
                onClick={() => setLanguage('hi')}
              >
                हिंदी
              </button>
              <button
                type="button"
                className={`lang-pill ${language === 'mr' ? 'active' : ''}`}
                onClick={() => setLanguage('mr')}
              >
                मराठी
              </button>
              <button
                type="button"
                className={`lang-pill ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Action toolbar */}
        <div className="board-toolbar">
          <div className="live-status">
            <span className="live-dot"></span>
            <span className="live-text">
              {dataSource === "SUPABASE_DATABASE" ? "🟢 लाइव डेटाबेस सिंक" : "🟡 ऑफलाइन कैश"} • {lastUpdated}
            </span>
          </div>

          <button
            type="button"
            className={`listen-all-btn ${activeSpeakingId === 'all' ? 'playing' : ''}`}
            onClick={speakAllPrices}
            title="सभी भाव बोलकर सुनाएं"
          >
            📢 {language === "hi" ? "सभी भाव सुनें" : (language === "mr" ? "सर्व दर ऐका" : "Listen All")}
          </button>
        </div>
      </header>

      {/* Main Rates Grid */}
      <main className="rates-card-list">
        {categories.map((item) => {
          const isSpeaking = activeSpeakingId === item.material_id;
          const isUp = item.trend === "UP";
          const isDown = item.trend === "DOWN";

          return (
            <article
              key={item.material_id}
              className={`rate-row-card ${isSpeaking ? 'is-speaking' : ''}`}
            >
              {/* Material Icon & Titles */}
              <div className="rate-col-material">
                <div className="mat-icon-box">{item.icon}</div>
                <div className="mat-name-block">
                  <h3 className="mat-primary-name">
                    {language === "hi" ? item.name_hi : (language === "mr" ? item.name_mr : item.name_en)}
                  </h3>
                  <span className="mat-secondary-name">
                    {language === "en" ? item.name_hi : item.name_en}
                  </span>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="rate-col-sparkline" title="7-दिवसीय रुझान ग्राफ">
                <Sparkline points={item.sparkline} trend={item.trend} width={72} height={26} />
                <span className="sparkline-subtext">7 दिन</span>
              </div>

              {/* Trend Badge */}
              <div className="rate-col-trend">
                <span className={`trend-badge ${isUp ? 'trend-up' : (isDown ? 'trend-down' : 'trend-stable')}`}>
                  <span className="trend-arrow">{item.trend_arrow}</span>
                  <span className="trend-val">
                    {item.change_amount > 0 ? `+₹${Math.abs(item.change_amount)}` : (item.change_amount < 0 ? `-₹${Math.abs(item.change_amount)}` : `₹0`)}
                  </span>
                </span>
                <span className="trend-pct">
                  {item.change_pct > 0 ? `+${item.change_pct}%` : `${item.change_pct}%`}
                </span>
              </div>

              {/* Big Numerical Price */}
              <div className="rate-col-price">
                <div className="price-display">
                  <span className="currency-symbol">₹</span>
                  <span className="price-value">{item.current_rate}</span>
                  <span className="price-unit">/{item.unit || 'kg'}</span>
                </div>
              </div>

              {/* Speaker Voice Action */}
              <div className="rate-col-voice">
                <button
                  type="button"
                  className={`voice-speaker-btn ${isSpeaking ? 'is-active-pulse' : ''}`}
                  onClick={() => speakPrice(item)}
                  aria-label={`बोलकर सुनाएं: ${item.name_hi} का भाव`}
                  title={item.active_speech || "भाव सुनें"}
                >
                  {isSpeaking ? (
                    <span className="sound-wave">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  ) : (
                    <span className="speaker-emoji">🔊</span>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </main>

      {/* Footer Info & Regulatory Notice */}
      <footer className="priceboard-footer">
        <div className="regulatory-seal">
          <span className="seal-icon">🛡️</span>
          <div className="seal-text">
            <strong>ई-अपशिष्ट (प्रबंधन) नियम 2022 के अनुसार</strong>
            <p>अधिकृत रिसाइक्लर्स द्वारा न्यूनतम गारंटीकृत मूल्य। बिचौलियों के शोषण से मुक्ति।</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
