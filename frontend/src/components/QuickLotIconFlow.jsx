import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import './QuickLotIconFlow.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MATERIALS = [
  { id: 'mat_pcb_high', category: 'PCB', icon: '🟩', color: '#16a34a', rate: 240, labelKey: 'PCB' },
  { id: 'mat_cables_copper', category: 'CABLES', icon: '🔌', color: '#ea580c', rate: 390, labelKey: 'Cables' },
  { id: 'mat_batteries_lead', category: 'BATTERIES', icon: '🔋', color: '#dc2626', rate: 105, labelKey: 'Batteries' },
  { id: 'mat_crt_monitor', category: 'DISPLAYS', icon: '📺', color: '#2563eb', rate: 16, labelKey: 'Screens' }
];

export default function QuickLotIconFlow() {
  const { t, i18n } = useTranslation();
  
  const [selectedMat, setSelectedMat] = useState(MATERIALS[0]);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [weight, setWeight] = useState(5.0);
  const [qrToken, setQrToken] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCashSettled, setIsCashSettled] = useState(false);

  const estimatedInr = Math.round(selectedMat.rate * weight);

  const speakAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'mr' ? 'mr-IN' : (i18n.language === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSnapPhoto = () => {
    setHasPhoto(true);
    const audioMsg = i18n.language === 'mr'
      ? 'फोटो घेतली. वजन निवडा.'
      : (i18n.language === 'hi' ? 'फोटो खींच ली गई है। अब वजन चुनें।' : 'Photo captured. Choose weight.');
    speakAudio(audioMsg);
  };

  const handleSelectMaterial = (m) => {
    setSelectedMat(m);
    setQrToken(null);
    setIsCashSettled(false);
    const audioMsg = i18n.language === 'mr'
      ? `${m.category} निवडले. दर ₹${m.rate} प्रति किलो.`
      : (i18n.language === 'hi' ? `${m.category} चुना गया। दर ₹${m.rate} प्रति किलो।` : `${m.category} selected. Rate ₹${m.rate} per kg.`);
    speakAudio(audioMsg);
  };

  const handleAddWeight = (increment) => {
    const newW = Math.max(0.5, Math.round((weight + increment) * 10) / 10);
    setWeight(newW);
    setQrToken(null);
  };

  const handleGenerateQR = async () => {
    try {
      const payload = {
        weight,
        material_category: selectedMat.category,
        material_id: selectedMat.id,
        quoted_price: estimatedInr,
        collector_id: 'col_test_001'
      };
      const res = await fetch(`${API_BASE}/handover/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setQrToken(data.handover_ref);
      } else {
        setQrToken(`KC-TRACE-${Date.now().toString().slice(-6)}`);
      }
    } catch {
      setQrToken(`KC-TRACE-${Date.now().toString().slice(-6)}`);
    }

    const audioMsg = i18n.language === 'mr'
      ? `एकूण अंदाजे मूल्य ₹${estimatedInr}. क्यूआर कोड तयार आहे. रीसायकलरला दाखवा.`
      : (i18n.language === 'hi'
          ? `कुल अनुमानित मूल्य ₹${estimatedInr} है। क्यूआर कोड तैयार है। रीसायकलर को दिखाएं।`
          : `Total estimated value ₹${estimatedInr}. QR pass ready.`);
    speakAudio(audioMsg);
  };

  const handleReceiveCash = () => {
    setIsCashSettled(true);
    const audioMsg = i18n.language === 'mr'
      ? `₹${estimatedInr} रोख रक्कम मिळाली. व्यवहार पूर्ण झाला.`
      : (i18n.language === 'hi'
          ? `₹${estimatedInr} नकद भुगतान प्राप्त हुआ। लेनदेन संपन्न हुआ।`
          : `₹${estimatedInr} Cash received. Transaction complete.`);
    speakAudio(audioMsg);
  };

  return (
    <div className="icon-flow-container">
      {/* Header with Visual Indicators */}
      <div className="flow-header">
        <h1 className="flow-title">{t('guided_title')}</h1>
        <p className="flow-subtitle">{t('guided_subtitle')}</p>
      </div>

      {/* 5-Step Visual Stepper Bar */}
      <div className="stepper-icons-row">
        <div className={`step-bubble ${selectedMat ? 'done' : 'active'}`}>
          <span className="bubble-icon">{selectedMat.icon}</span>
          <span className="bubble-label">{t('step_1_material')}</span>
        </div>
        <div className="step-arrow">➔</div>
        <div className={`step-bubble ${hasPhoto ? 'done' : 'active'}`}>
          <span className="bubble-icon">📷</span>
          <span className="bubble-label">{t('step_2_photo')}</span>
        </div>
        <div className="step-arrow">➔</div>
        <div className={`step-bubble ${weight > 0 ? 'done' : ''}`}>
          <span className="bubble-icon">⚖️</span>
          <span className="bubble-label">{t('step_3_weight')}</span>
        </div>
        <div className="step-arrow">➔</div>
        <div className={`step-bubble ${qrToken ? 'done' : ''}`}>
          <span className="bubble-icon">🔲</span>
          <span className="bubble-label">{t('step_4_listen')}</span>
        </div>
        <div className="step-arrow">➔</div>
        <div className={`step-bubble ${isCashSettled ? 'done' : ''}`}>
          <span className="bubble-icon">💵</span>
          <span className="bubble-label">{t('step_5_cash')}</span>
        </div>
      </div>

      {/* STEP 1: Big Visual Material Selector */}
      <section className="flow-section">
        <h2 className="section-label">
          <span>1️⃣</span> {t('step_1_material')}
        </h2>
        <div className="material-tiles-grid">
          {MATERIALS.map((m) => {
            const isSelected = selectedMat.id === m.id;
            return (
              <button
                key={m.id}
                className={`mat-tile ${isSelected ? 'selected' : ''}`}
                style={{ borderColor: isSelected ? m.color : '#e2e8f0' }}
                onClick={() => handleSelectMaterial(m)}
              >
                <div className="tile-icon">{m.icon}</div>
                <div className="tile-title">{m.category}</div>
                <div className="tile-rate">₹{m.rate}/kg</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 2: Huge One-Touch Photo Camera Button */}
      <section className="flow-section">
        <h2 className="section-label">
          <span>2️⃣</span> {t('step_2_photo')}
        </h2>
        <div className="camera-touch-box">
          <button
            className={`big-camera-btn ${hasPhoto ? 'snapped' : ''}`}
            onClick={handleSnapPhoto}
          >
            <span className="cam-icon">{hasPhoto ? '✅' : '📷'}</span>
            <span className="cam-text">
              {hasPhoto ? t('photo_captured') : t('btn_snap_photo')}
            </span>
          </button>
        </div>
      </section>

      {/* STEP 3: Bag Weight Stepper & One-Touch Increment Buttons */}
      <section className="flow-section">
        <h2 className="section-label">
          <span>3️⃣</span> {t('step_3_weight')}
        </h2>
        <div className="weight-stepper-row">
          <button className="stepper-touch-btn minus" onClick={() => handleAddWeight(-0.5)}>
            ➖
          </button>
          <div className="weight-display-bubble">
            <span className="weight-num">{weight}</span>
            <span className="weight-unit">kg</span>
          </div>
          <button className="stepper-touch-btn plus" onClick={() => handleAddWeight(0.5)}>
            ➕
          </button>
        </div>

        {/* Quick Presets */}
        <div className="quick-weight-presets">
          {[1, 2, 5, 10, 20].map((inc) => (
            <button
              key={inc}
              className={`preset-btn ${weight === inc ? 'active-preset' : ''}`}
              onClick={() => {
                setWeight(inc);
                setQrToken(null);
              }}
            >
              +{inc} kg
            </button>
          ))}
        </div>
      </section>

      {/* STEP 4 & 5: Value Banner & QR Code Generation */}
      <section className="flow-section value-section">
        <div className="valuation-banner">
          <div className="inr-display">
            <span className="inr-symbol">₹</span>
            <span className="inr-value">{estimatedInr.toLocaleString('en-IN')}</span>
          </div>

          <button
            className="speak-loud-btn"
            onClick={() =>
              speakAudio(
                i18n.language === 'mr'
                  ? `${weight} किलो ${selectedMat.category} चे अंदाजे मूल्य ₹${estimatedInr} आहे.`
                  : (i18n.language === 'hi'
                      ? `${weight} किलो ${selectedMat.category} का अनुमानित मूल्य ₹${estimatedInr} है।`
                      : `${weight} kg ${selectedMat.category} estimated value is ₹${estimatedInr}.`)
              )
            }
          >
            {isSpeaking ? '🔊...' : '🔊 भाव सुनें (Hear)'}
          </button>
        </div>

        {!qrToken ? (
          <button className="generate-touch-btn" onClick={handleGenerateQR}>
            🔲 {t('btn_generate_qr')}
          </button>
        ) : (
          <div className="qr-reveal-card">
            <div className="qr-box">
              <QRCodeSVG value={qrToken} size={200} level="M" />
            </div>
            <div className="token-text">{qrToken}</div>

            {!isCashSettled ? (
              <button className="cash-claim-btn" onClick={handleReceiveCash}>
                💵 {t('btn_receive_cash')} (₹{estimatedInr})
              </button>
            ) : (
              <div className="cash-confirmed-banner">
                <span className="cash-tick">✅</span>
                <strong>{t('cash_paid')}: ₹{estimatedInr}</strong>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
