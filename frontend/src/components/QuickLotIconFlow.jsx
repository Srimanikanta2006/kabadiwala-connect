import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { saveOfflineLot, saveOfflineHandover, getCachedPrice } from '../db/offlineDb';
import { syncEngine } from '../services/syncEngine';
import './QuickLotIconFlow.css';

const MATERIALS = [
  { id: 'mat_pcb_high', category: 'PCB', icon: '🟩', color: '#16a34a', rate: 240, labelKey: 'PCB' },
  { id: 'mat_cables_copper', category: 'CABLES', icon: '🔌', color: '#ea580c', rate: 390, labelKey: 'Cables' },
  { id: 'mat_batteries_lead', category: 'BATTERIES', icon: '🔋', color: '#dc2626', rate: 105, labelKey: 'Batteries' },
  { id: 'mat_crt_monitor', category: 'DISPLAYS', icon: '📺', color: '#2563eb', rate: 16, labelKey: 'Screens' }
];

export default function QuickLotIconFlow() {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  
  const [selectedMat, setSelectedMat] = useState(MATERIALS[0]);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [weight, setWeight] = useState(2.5);
  const [qrToken, setQrToken] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCashSettled, setIsCashSettled] = useState(false);
  const [savedOfflineLotId, setSavedOfflineLotId] = useState(null);
  const [offlineSavedBanner, setOfflineSavedBanner] = useState(false);
  const [currentRate, setCurrentRate] = useState(240);

  // Load cached rate on selection
  useEffect(() => {
    async function loadRate() {
      const rate = await getCachedPrice(selectedMat.category);
      setCurrentRate(rate || selectedMat.rate);
    }
    loadRate();
  }, [selectedMat]);

  const estimatedInr = Math.round(currentRate * weight);

  const speakAudio = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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

  const handleCameraClick = () => {
    // Open system camera / file picker
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setPhotoDataUrl(dataUrl);
        setHasPhoto(true);
        playPhotoCapturedAudio();
      };
      reader.readAsDataURL(file);
    } else {
      // Fallback synthetic photo if cancelled or simulated
      generateFallbackPhoto();
    }
  };

  const generateFallbackPhoto = () => {
    // Generate a lightweight green PCB / battery thumbnail data URL
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = selectedMat.color;
    ctx.fillRect(0, 0, 160, 160);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(selectedMat.category, 80, 75);
    ctx.fillText(`${weight} kg`, 80, 105);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    setPhotoDataUrl(dataUrl);
    setHasPhoto(true);
    playPhotoCapturedAudio();
  };

  const playPhotoCapturedAudio = () => {
    const audioMsg = i18n.language === 'mr'
      ? 'फोटो घेतली. आता वजन निवडा.'
      : (i18n.language === 'hi' ? 'फोटो खींच ली गई है। अब वजन चुनें।' : 'Photo captured. Choose weight.');
    speakAudio(audioMsg);
  };

  const handleSelectMaterial = (m) => {
    setSelectedMat(m);
    setQrToken(null);
    setIsCashSettled(false);
    setOfflineSavedBanner(false);
    const audioMsg = i18n.language === 'mr'
      ? `${m.category} निवडले. दर ₹${m.rate} प्रति किलो.`
      : (i18n.language === 'hi' ? `${m.category} चुना गया। दर ₹${m.rate} प्रति किलो।` : `${m.category} selected. Rate ₹${m.rate} per kg.`);
    speakAudio(audioMsg);
  };

  const handleAddWeight = (increment) => {
    const newW = Math.max(0.5, Math.round((weight + increment) * 10) / 10);
    setWeight(newW);
    setQrToken(null);
    setOfflineSavedBanner(false);
  };

  /**
   * STEP 4: OFFLINE-FIRST LOT & HANDOVER CREATION
   * 1. Writes record to Dexie.js local IndexedDB with sync_status = 'UNSYNCED'
   * 2. Generates local unique handover reference and renders QR code offline
   * 3. Triggers background sync to backend/Supabase if online
   */
  const handleGenerateQR = async () => {
    const lotId = crypto.randomUUID();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const handoverRef = `KC-TRACE-${dateStr}-MH-${randHex}`;

    // Auto-generate photo if none snapped yet
    let finalPhoto = photoDataUrl;
    if (!finalPhoto) {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = selectedMat.color;
      ctx.fillRect(0, 0, 160, 160);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedMat.category, 80, 85);
      finalPhoto = canvas.toDataURL('image/jpeg', 0.7);
      setPhotoDataUrl(finalPhoto);
      setHasPhoto(true);
    }

    try {
      // 1. Write to Dexie.js Local Database (Mirrors Supabase shape)
      const savedLot = await saveOfflineLot({
        id: lotId,
        collector_id: 'col_8832a',
        material_category: selectedMat.category,
        material_id: selectedMat.id,
        approximate_weight: weight,
        condition: 'CLEAN_INTACT',
        quoted_price: estimatedInr,
        photo_base64: finalPhoto,
        gps_lat: 19.0435,
        gps_lng: 72.8566,
        ai_prediction: { detected_id: selectedMat.id, confidence: 0.91 }
      });

      // 2. Save Offline Handover record
      await saveOfflineHandover({
        lot_id: lotId,
        handover_ref: handoverRef,
        collector_id: 'col_8832a',
        recycler_id: 'rec_ecorecycle_01',
        weight: weight,
        material_category: selectedMat.category,
        gps_lat: 19.0435,
        gps_lng: 72.8566
      });

      setSavedOfflineLotId(lotId);
      setQrToken(handoverRef);
      setOfflineSavedBanner(true);

      // 3. Trigger automatic sync if online
      if (syncEngine.isEffectivelyOnline()) {
        syncEngine.syncNow();
      } else {
        syncEngine.refreshCounts();
      }

    } catch (err) {
      console.error('Error saving offline lot to IndexedDB:', err);
      setQrToken(handoverRef);
    }

    const isOffline = !syncEngine.isEffectivelyOnline();
    const audioMsg = i18n.language === 'mr'
      ? `एकूण मूल्य ₹${estimatedInr}. क्यूआर कोड तयार आहे. ${isOffline ? 'डिव्हाइसवर सेव्ह केले.' : ''}`
      : (i18n.language === 'hi'
          ? `कुल मूल्य ₹${estimatedInr} है। क्यूआर कोड तैयार है। ${isOffline ? 'लोकल सेव किया गया।' : ''}`
          : `Total value ₹${estimatedInr}. QR pass generated. ${isOffline ? 'Saved offline.' : ''}`);
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
      {/* Hidden file input for native camera access */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
          {photoDataUrl ? (
            <div className="camera-preview-container" onClick={handleCameraClick}>
              <img src={photoDataUrl} alt="Captured scrap" className="camera-preview-img" />
              <div className="camera-retake-badge">🔄 {t('btn_snap_photo')}</div>
            </div>
          ) : (
            <button
              className={`big-camera-btn ${hasPhoto ? 'snapped' : ''}`}
              onClick={handleCameraClick}
            >
              <span className="cam-icon">{hasPhoto ? '✅' : '📷'}</span>
              <span className="cam-text">
                {hasPhoto ? t('photo_captured') : t('btn_snap_photo')}
              </span>
            </button>
          )}
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
          {[1, 2, 2.5, 5, 10, 20].map((inc) => (
            <button
              key={inc}
              className={`preset-btn ${weight === inc ? 'active-preset' : ''}`}
              onClick={() => {
                setWeight(inc);
                setQrToken(null);
                setOfflineSavedBanner(false);
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

        {offlineSavedBanner && (
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '0.6rem 1rem',
            margin: '0.75rem 0',
            fontSize: '0.85rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}>
            <span>💾</span>
            <span>
              {syncEngine.isEffectivelyOnline()
                ? '✅ Saved locally & synced to cloud'
                : '✈️ Saved in Offline DB (IndexedDB). Will sync to Supabase automatically when online.'}
            </span>
          </div>
        )}

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
