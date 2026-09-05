import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './SafetyGuidance.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function SafetyGuidance({ contextualCategory = null }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const [cards, setCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(contextualCategory || 'ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAudioCard, setActiveAudioCard] = useState(null);

  useEffect(() => {
    fetchCards(selectedCategory, currentLang);
  }, [selectedCategory, currentLang]);

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
          title: lang === 'mr' ? 'केबल कधीही आगीत जाळू नका' : (lang === 'hi' ? 'तार कभी न जलाएं (Don\'t Burn Cables)' : 'Never Burn Insulated Cables'),
          guidance: lang === 'mr'
            ? 'प्लास्टिक वायर आगीत जाळू नका. त्यातून निघणारा विषारी डायऑक्सिन धूर फुफ्फुसांना हानी पोहोचवतो. केबल स्ट्रिपर वापरा.'
            : (lang === 'hi'
                ? 'प्लास्टिक तांबे के तार को आग में कभी न जलाएं। इससे निकलने वाला जहरीला डायऑक्सिन धुआं फेफड़ों और आंखों को नुकसान पहुंचाता है।'
                : 'Never burn cables in open fire. Toxic dioxin smoke causes severe lung damage. Use a mechanical stripper.'),
          audio_text: lang === 'mr'
            ? 'केबल कधीही जाळू नका. विषारी धुरापासून स्वतःचा बचाव करा.'
            : 'तार को कभी न जलाएं। इसका धुआं जहरीला होता है।',
          recommended_gear: 'Wire stripper, Cut-resistant gloves'
        },
        {
          card_id: 'batteries_no_open',
          category_trigger: 'BATTERIES',
          hazard_level: 'CRITICAL',
          icon: '🔋⚠️',
          title: lang === 'mr' ? 'बॅटरी स्वतः उघडू नका' : (lang === 'hi' ? 'बैटरी खुद न खोलें (Don\'t Open Batteries)' : 'Do Not Open Batteries by Hand'),
          guidance: lang === 'mr'
            ? 'लेड-ऍसिड किंवा लिथियम बॅटरी कधीही फोडू नका. ऍसिडमुळे त्वचा जळू शकते आणि स्फोट होऊ शकतो.'
            : (lang === 'hi'
                ? 'लेड-एसिड या लिथियम बैटरी को हथौड़े से कभी न तोड़ें। सल्फ्यूरिक एसिड से त्वचा जल सकती है और लिथियम में आग लग सकती है।'
                : 'Never crack open lead-acid or lithium batteries. Acid causes chemical burns and lithium combusts violently.'),
          audio_text: lang === 'mr'
            ? 'बॅटरी कधीही फोडू नका. ऍसिडचा धोका असतो.'
            : 'बैटरी को कभी न तोड़ें। इसमें खतरनाक तेजाब होता है।',
          recommended_gear: 'Acid-resistant gloves, Eye goggles'
        },
        {
          card_id: 'crt_no_smash',
          category_trigger: 'DISPLAYS',
          hazard_level: 'HIGH',
          icon: '📺⚠️',
          title: lang === 'mr' ? 'सीआरटी टीव्ही स्क्रीन फोडू नका' : (lang === 'hi' ? 'सीआरटी मॉनिटर न तोड़ें (Don\'t Smash CRTs)' : 'Never Smash CRT Monitor Tubes'),
          guidance: lang === 'mr'
            ? 'जुने मोठे टीव्ही फोडू नका. यात विषारी शिसे असते आणि काच उडून दुखापत होऊ शकते.'
            : (lang === 'hi'
                ? 'पुराने टीवी व कंप्यूटर मॉनिटर के कांच में 2 किलो तक जहरीला सीसा (Lead) होता है। हथौड़े से फोड़ने पर कांच उड़ता है।'
                : 'Old CRT monitors contain up to 2kg of toxic lead and implode violently when smashed with a hammer.'),
          audio_text: lang === 'mr'
            ? 'सीआरटी स्क्रीन फोडू नका. यात घातक शिसे असते.'
            : 'सीआरटी टीवी को हथौड़े से न फोड़ें। इसमें जहरीला सीसा होता है।',
          recommended_gear: 'Impact face shield, Leather gloves'
        },
        {
          card_id: 'pcb_sharp_edges',
          category_trigger: 'PCB',
          hazard_level: 'MEDIUM',
          icon: '🧤⚠️',
          title: lang === 'mr' ? 'पीसीबीच्या तीक्ष्ण कडांपासून काळजी घ्या' : (lang === 'hi' ? 'पीसीबी नुकीले किनारों से बचाव (Sharp PCB Edges)' : 'Beware of Sharp Circuit Board Edges'),
          guidance: lang === 'mr'
            ? 'सर्किट बोर्ड हाताळताना जाड हातमोजे वापरा. तीक्ष्ण कडांमुळे हात कापू नये.'
            : (lang === 'hi'
                ? 'मदरबोर्ड और सर्किट बोर्ड के किनारे बहुत तेज होते हैं। हमेशा चमड़े या रबर के मोटे दस्ताने पहनकर उठाएं।'
                : 'Circuit board fiberglass edges cause deep cuts. Always wear heavy-duty puncture-resistant gloves.'),
          audio_text: lang === 'mr'
            ? 'पीसीबी उचलताना जाड हातमोजे वापरा.'
            : 'सर्किट बोर्ड उठाते समय मोटे दस्ताने पहनें। इसके नुकीले किनारे हाथ काट सकते हैं।',
          recommended_gear: 'Heavy duty gloves'
        },
        {
          card_id: 'wear_masks_gloves',
          category_trigger: 'GENERAL',
          hazard_level: 'RECOMMENDED',
          icon: '😷🛡️',
          title: lang === 'mr' ? 'छानणी करताना मास्क वापरा' : (lang === 'hi' ? 'धूल व धुएं से बचाव - मास्क लगाएं (Wear Face Mask)' : 'Always Wear a Dust Mask'),
          guidance: lang === 'mr'
            ? 'कचरा वेगळा करताना धूळ नाकात जाऊ नये म्हणून मास्क वापरा.'
            : (lang === 'hi'
                ? 'ई-कचरे की छंटाई के समय बारीक धातु के कण उड़ते हैं। सांस की बीमारी से बचने के लिए N95 या कपड़े का मास्क लगाएं।'
                : 'Always wear an N95 particulate mask while sorting e-waste to protect lungs from toxic heavy metal dust.'),
          audio_text: lang === 'mr'
            ? 'कचरा हाताळताना मास्क जरूर वापरा.'
            : 'छंटाई करते समय हमेशा मास्क लगाएं ताकि धातु की धूल फेफड़ों में न जाए।',
          recommended_gear: 'N95 respirator mask'
        },
        {
          card_id: 'food_water_separation',
          category_trigger: 'GENERAL',
          hazard_level: 'HIGH',
          icon: '💧🚫',
          title: lang === 'mr' ? 'अन्न आणि पिण्याच्या पाण्यापासून दूर ठेवा' : (lang === 'hi' ? 'पीने के पानी व भोजन से दूर रखें (Keep Away from Food/Water)' : 'Keep Scrap Away from Food and Water'),
          guidance: lang === 'mr'
            ? 'ई-कचरा पिण्याच्या पाण्याजवळ ठेवू नका. काम संपल्यावर हात साबणाने स्वच्छ धुवा.'
            : (lang === 'hi'
                ? 'ई-कचरे को कभी भी मटके या खाने की जगह के पास न रखें। काम के बाद हाथ साबुन से धोए बिना भोजन न करें।'
                : 'Never store electronic scrap near drinking water or cooking areas. Wash hands with soap thoroughly.'),
          audio_text: lang === 'mr'
            ? 'पाण्यापासून कचरा लांब ठेवा आणि काम झाल्यावर हात साबणाने धुवा.'
            : 'ई-कचरे को पानी और खाने से दूर रखें और काम के बाद हाथ जरूर धोएं।',
          recommended_gear: 'Handwashing soap'
        },
        {
          card_id: 'capacitor_hazard',
          category_trigger: 'PCB',
          hazard_level: 'HIGH',
          icon: '⚡⚠️',
          title: lang === 'mr' ? 'मोठ्या कॅपॅसिटरपासून विजेचा झटका टाळा' : (lang === 'hi' ? 'बड़े कंडेंसर से करंट का खतरा (Check Capacitor Charge)' : 'Stored Charge in Power Capacitors'),
          guidance: lang === 'mr'
            ? 'इन्व्हर्टरमधील कॅपॅसिटरमध्ये वीज साठलेली असू शकते. थेट स्पर्श करू नका.'
            : (lang === 'hi'
                ? 'पावर सप्लाई और इन्वर्टर के बड़े कंडेंसर/कैपेसिटर में 300 वोल्ट तक करंट जमा रहता है। बिना डिस्चार्ज किए न छुएं।'
                : 'Large capacitors retain dangerous lethal electrical charges. Discharge before touching directly.'),
          audio_text: lang === 'mr'
            ? 'कॅपॅसिटर थेट हाताने स्पर्श करू नका.'
            : 'बड़ी मशीनों के कंडेंसर को सीधे न छुएं, इसमें बिजली का झटका लग सकता है।',
          recommended_gear: '1000V Insulated tool'
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

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      utterance.onend = () => setActiveAudioCard(null);
      utterance.onerror = () => setActiveAudioCard(null);
      window.speechSynthesis.speak(utterance);
    }

    try {
      await fetch(`${API_BASE}/safety/cards/${card.card_id}/audio?language=${currentLang}`);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="safety-container">
      {/* Header */}
      <header className="safety-header">
        <div className="safety-badge">🦺 {t('safety_badge')}</div>
        <h1 className="safety-title">{t('safety_title')}</h1>
        <p className="safety-subtitle">{t('safety_subtitle')}</p>

        {/* Controls: Context Category Filter */}
        <div className="safety-controls">
          <div className="cat-filter-group">
            <label>{t('filter_label')}</label>
            <button
              className={`cat-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              {t('cat_all')}
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'BATTERIES' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('BATTERIES')}
            >
              {t('cat_batteries')}
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'CABLES' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('CABLES')}
            >
              {t('cat_cables')}
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'DISPLAYS' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('DISPLAYS')}
            >
              {t('cat_displays')}
            </button>
            <button
              className={`cat-btn ${selectedCategory === 'PCB' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('PCB')}
            >
              {t('cat_pcb')}
            </button>
          </div>
        </div>
      </header>

      {/* Contextual Alert Banner if category triggered */}
      {selectedCategory !== 'ALL' && (
        <div className="contextual-alert-banner">
          <span className="banner-icon">⚠️</span>
          <div>
            <strong>{t('contextual_alert')}</strong>
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
                  {card.hazard_level === 'CRITICAL'
                    ? t('hazard_critical')
                    : (card.hazard_level === 'HIGH' ? t('hazard_high') : t('hazard_recommended'))}
                </span>
              </div>

              <h3 className="card-title-text">{card.title}</h3>
              <p className="card-guidance-text">{card.guidance}</p>

              {card.recommended_gear && (
                <div className="gear-tag">
                  🛡️ {t('gear_label')} <strong>{card.recommended_gear}</strong>
                </div>
              )}

              <button
                className={`audio-listen-btn ${isPlaying ? 'playing' : ''}`}
                onClick={() => playCardAudio(card)}
              >
                {isPlaying ? t('rules_speaking') : t('btn_listen_rules')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
