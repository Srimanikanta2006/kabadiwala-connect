import React, { useState, useEffect } from 'react';
import './SafetyGuidance.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function SafetyGuidance({ contextualCategory = null }) {
  const [cards, setCards] = useState([]);
  const [language, setLanguage] = useState('hi'); // 'hi' | 'mr'
  const [selectedCategory, setSelectedCategory] = useState(contextualCategory || 'ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAudioCard, setActiveAudioCard] = useState(null);

  useEffect(() => {
    fetchCards(selectedCategory, language);
  }, [selectedCategory, language]);

  const fetchCards = async (cat, lang) => {
    setIsLoading(true);
    try {
      const url = cat && cat !== 'ALL'
        ? `${API_BASE}/safety/cards?category=${encodeURIComponent(cat)}&language=${lang}`
        : `${API_BASE}/safety/cards?language=${lang}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCards(data.cards || []);
    } catch (err) {
      console.warn('Backend unavailable, using resilient offline safety cards:', err);
      // Hardcoded resilient offline cards
      const offlineCards = [
        {
          card_id: 'cables_no_burn',
          category_trigger: 'CABLES',
          hazard_level: 'CRITICAL',
          icon: '🔥🚫',
          title: lang === 'hi' ? 'तार कभी न जलाएं (Don\'t Burn Cables)' : 'केबल कधीही आगीत जाळू नका',
          guidance: lang === 'hi'
            ? 'प्लास्टिक तांबे के तार को आग में कभी न जलाएं। इससे निकलने वाला जहरीला डायऑक्सिन धुआं फेफड़ों और आंखों को नुकसान पहुंचाता है। स्ट्रिपर का उपयोग करें।'
            : 'प्लास्टिक वायर आगीत जाळू नका. विषारी धूर फुफ्फुसांना हानी पोहोचवतो. केबल स्ट्रिपर वापरा.',
          audio_text: lang === 'hi'
            ? 'तार को कभी न जलाएं। इसका धुआं जहरीला होता है। रीसायकलर को पूरी तार दें या स्ट्रिपर का इस्तेमाल करें।'
            : 'केबल कधीही जाळू नका. विषारी धुरापासून स्वतःचा बचाव करा.',
          recommended_gear: 'Wire stripper, Gloves'
        },
        {
          card_id: 'batteries_no_open',
          category_trigger: 'BATTERIES',
          hazard_level: 'CRITICAL',
          icon: '🔋⚠️',
          title: lang === 'hi' ? 'बैटरी खुद न खोलें (Don\'t Open Batteries)' : 'बॅटरी स्वतः उघडू नका',
          guidance: lang === 'hi'
            ? 'लेड-एसिड या लिथियम बैटरी को हथौड़े से कभी न तोड़ें। सल्फ्यूरिक एसिड से त्वचा जल सकती है और लिथियम में आग लग सकती है।'
            : 'लेड-ऍसिड किंवा लिथियम बॅटरी कधीही फोडू नका. ऍसिडमुळे त्वचा जळू शकते आणि स्फोट होऊ शकतो.',
          audio_text: lang === 'hi'
            ? 'बैटरी को कभी न तोड़ें। इसमें खतरनाक तेजाब होता है। इसे सीधे अधिकृत रीसायकलर को दें।'
            : 'बॅटरी कधीही फोडू नका. तेजाबाचा धोका असतो.',
          recommended_gear: 'Acid-resistant gloves, Goggles'
        },
        {
          card_id: 'crt_no_smash',
          category_trigger: 'DISPLAYS',
          hazard_level: 'HIGH',
          icon: '📺⚠️',
          title: lang === 'hi' ? 'सीआरटी मॉनिटर न तोड़ें (Don\'t Smash CRTs)' : 'सीआरटी टीव्ही स्क्रीन फोडू नका',
          guidance: lang === 'hi'
            ? 'पुराने टीवी व कंप्यूटर मॉनिटर के कांच में 2 किलो तक जहरीला सीसा (Lead) होता है। हथौड़े से फोड़ने पर कांच उड़ता है।'
            : 'जुने मोठे टीव्ही फोडू नका. यात विषारी शिसे असते आणि काच उडून दुखापत होऊ शकते.',
          audio_text: lang === 'hi'
            ? 'सीआरटी टीवी को हथौड़े से न फोड़ें। इसमें जहरीला सीसा होता है।'
            : 'सीआरटी स्क्रीन फोडू नका. यात घातक शिसे असते.',
          recommended_gear: 'Face shield, Leather gloves'
        },
        {
          card_id: 'pcb_sharp_edges',
          category_trigger: 'PCB',
          hazard_level: 'MEDIUM',
          icon: '🧤⚠️',
          title: lang === 'hi' ? 'पीसीबी नुकीले किनारों से बचाव (Sharp PCB Edges)' : 'पीसीबीच्या तीक्ष्ण कडांपासून काळजी घ्या',
          guidance: lang === 'hi'
            ? 'मदरबोर्ड और सर्किट बोर्ड के किनारे बहुत तेज होते हैं। हमेशा चमड़े या रबर के मोटे दस्ताने पहनकर उठाएं।'
            : 'सर्किट बोर्ड हाताळताना जाड हातमोजे वापरा. तीक्ष्ण कडांमुळे हात कापू नये.',
          audio_text: lang === 'hi'
            ? 'सर्किट बोर्ड उठाते समय मोटे दस्ताने पहनें। इसके नुकीले किनारे हाथ काट सकते हैं।'
            : 'पीसीबी उचलताना जाड हातमोजे वापरा.',
          recommended_gear: 'Cut-resistant gloves'
        },
        {
          card_id: 'wear_masks_gloves',
          category_trigger: 'GENERAL',
          hazard_level: 'RECOMMENDED',
          icon: '😷🛡️',
          title: lang === 'hi' ? 'धूल व धुएं से बचाव - मास्क लगाएं (Wear Face Mask)' : 'छानणी करताना मास्क वापरा',
          guidance: lang === 'hi'
            ? 'ई-कचरे की छंटाई के समय बारीक धातु के कण उड़ते हैं। सांस की बीमारी से बचने के लिए N95 या कपड़े का मास्क लगाएं।'
            : 'कचरा वेगळा करताना धूळ नाकात जाऊ नये म्हणून मास्क वापरा.',
          audio_text: lang === 'hi'
            ? 'छंटाई करते समय हमेशा मास्क लगाएं ताकि धातु की धूल फेफड़ों में न जाए।'
            : 'कचरा हाताळताना मास्क जरूर वापरा.',
          recommended_gear: 'N95 respirator mask'
        },
        {
          card_id: 'food_water_separation',
          category_trigger: 'GENERAL',
          hazard_level: 'HIGH',
          icon: '💧🚫',
          title: lang === 'hi' ? 'पीने के पानी व भोजन से दूर रखें (Keep Scrap Away from Food/Water)' : 'अन्न आणि पिण्याच्या पाण्यापासून दूर ठेवा',
          guidance: lang === 'hi'
            ? 'ई-कचरे को कभी भी मटके या खाने की जगह के पास न रखें। काम के बाद हाथ साबुन से धोए बिना भोजन न करें।'
            : 'ई-कचरा पिण्याच्या पाण्याजवळ ठेवू नका. काम संपल्यावर हात साबणाने स्वच्छ धुवा.',
          audio_text: lang === 'hi'
            ? 'ई-कचरे को पानी और खाने से दूर रखें और काम के बाद हाथ जरूर धोएं।'
            : 'पाण्यापासून कचरा लांब ठेवा आणि काम झाल्यावर हात साबणाने धुवा.',
          recommended_gear: 'Handwashing soap'
        },
        {
          card_id: 'capacitor_hazard',
          category_trigger: 'PCB',
          hazard_level: 'HIGH',
          icon: '⚡⚠️',
          title: lang === 'hi' ? 'बड़े कंडेंसर से करंट का खतरा (Check Capacitor Charge)' : 'मोठ्या कॅपॅसिटरपासून विजेचा झटका टाळा',
          guidance: lang === 'hi'
            ? 'पावर सप्लाई और इन्वर्टर के बड़े कंडेंसर/कैपेसिटर में 300 वोल्ट तक करंट जमा रहता है। बिना डिस्चार्ज किए न छुएं।'
            : 'इन्व्हर्टरमधील कॅपॅसिटरमध्ये वीज साठलेली असू शकते. थेट स्पर्श करू नका.',
          audio_text: lang === 'hi'
            ? 'बड़ी मशीनों के कंडेंसर को सीधे न छुएं, इसमें बिजली का झटका लग सकता है।'
            : 'कॅपॅसिटर थेट हाताने स्पर्श करू नका.',
          recommended_gear: 'Insulated screwdriver'
        }
      ];

      const filtered = cat && cat !== 'ALL'
        ? offlineCards.filter((c) => c.category_trigger === cat || c.category_trigger === 'GENERAL')
        : offlineCards;
      setCards(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const playCardAudio = async (card) => {
    setActiveAudioCard(card.card_id);
    const spokenText = card.audio_text || card.guidance;

    // First try browser native speech synthesis for immediate, zero-latency vernacular playback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = language === 'mr' ? 'mr-IN' : 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setActiveAudioCard(null);
      utterance.onerror = () => setActiveAudioCard(null);
      window.speechSynthesis.speak(utterance);
    }

    // Also invoke Bhashini TTS endpoint in background for verified server compliance
    try {
      await fetch(`${API_BASE}/safety/cards/${card.card_id}/audio?language=${language}`);
    } catch (e) {
      // Handled silently
    }
  };

  return (
    <div className="safety-container">
      {/* Header */}
      <header className="safety-header">
        <div className="safety-badge">🦺 Chunk 11 • Pictorial & Audio Safety Guidance</div>
        <h1 className="safety-title">कचरा छंटाई व सुरक्षा मार्गदर्शिका (Safety Guidance)</h1>
        <p className="safety-subtitle">
          अनौपचारिक कबाड़ीवालों व श्रमिकों के स्वास्थ्य की सुरक्षा • सचित्र कार्ड व भाषिणी आवाज़ (Bhashini TTS)
        </p>

        {/* Controls Row: Category Filter & Language Switch */}
        <div className="safety-controls">
          <div className="cat-filter-group">
            <label>⚡ श्रेणी अनुसार सतर्कता (Filter):</label>
            <button
              className={`cat-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              सभी (All)
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'BATTERIES' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('BATTERIES')}
            >
              🔋 बैटरी (Batteries)
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'CABLES' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('CABLES')}
            >
              🔥 तार (Cables)
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'DISPLAYS' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('DISPLAYS')}
            >
              📺 सीआरटी/स्क्रीन (CRT)
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'PCB' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('PCB')}
            >
              🟩 पीसीबी (PCB)
            </button>
          </div>

          <div className="lang-toggle-group">
            <button
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              🇮🇳 हिंदी (Hindi)
            </button>
            <button
              className={`lang-btn ${language === 'mr' ? 'active' : ''}`}
              onClick={() => setLanguage('mr')}
            >
              🚩 मराठी (Marathi)
            </button>
          </div>
        </div>
      </header>

      {/* Contextual Alert Banner if category triggered */}
      {selectedCategory !== 'ALL' && (
        <div className="contextual-alert-banner">
          <span className="banner-icon">⚠️</span>
          <div>
            <strong>प्रासंगिक सुरक्षा चेतावनी (Contextual Safety Alert):</strong> आप {selectedCategory} सामग्री संभाल रहे हैं। नीचे दिए गए सुरक्षा नियमों का कड़ाई से पालन करें।
          </div>
        </div>
      )}

      {/* Safety Cards Grid */}
      <div className="cards-grid">
        {cards.map((card) => {
          const isPlaying = activeAudioCard === card.card_id;
          return (
            <div key={card.card_id} className={`safety-card level-${card.hazard_level.toLowerCase()}`}>
              <div className="card-top-row">
                <div className="card-icon">{card.icon}</div>
                <span className={`hazard-badge ${card.hazard_level.toLowerCase()}`}>
                  {card.hazard_level === 'CRITICAL' ? 'खतरनाक (CRITICAL)' : card.hazard_level === 'HIGH' ? 'चेतावनी (HIGH)' : 'अनिवार्य (RECOMMENDED)'}
                </span>
              </div>

              <h3 className="card-title-text">{card.title}</h3>
              <p className="card-guidance-text">{card.guidance}</p>

              {card.recommended_gear && (
                <div className="gear-tag">
                  🛡️ सुरक्षा उपकरण: <strong>{card.recommended_gear}</strong>
                </div>
              )}

              <button
                className={`audio-listen-btn ${isPlaying ? 'playing' : ''}`}
                onClick={() => playCardAudio(card)}
              >
                {isPlaying ? '🔊 आवाज़ चल रही है...' : `🔊 नियम सुनें (${language === 'mr' ? 'मराठी' : 'हिंदी'})`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
