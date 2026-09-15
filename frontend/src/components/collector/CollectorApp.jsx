import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Screen01Home from './Screen01Home';
import Screen02AiIdentification from './Screen02AiIdentification';
import Screen03CategorySelect from './Screen03CategorySelect';
import Screen03bDigitalSummary from './Screen03bDigitalSummary';
import Screen04PriceOffers from './Screen04PriceOffers';
import Screen05HandoverReceipt from './Screen05HandoverReceipt';
import Screen06EarningsHistory from './Screen06EarningsHistory';
import Screen07MyLots from './Screen07MyLots';
import SafetyGuidance from '../SafetyGuidance';
import { saveOfflineLot, saveOfflineHandover, getRecentOfflineLots } from '../../db/offlineDb';
import { syncEngine } from '../../services/syncEngine';
import './collectorStyles.css';

const DEFAULT_LOT_DRAFT = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnrXAynZNALXyOl8wueunxDavXvrvwno8ShM4qL4CTD3UnF4MmWJ4LuV71LlqCfufAD8qkP3HoAHlCEuL7qoWrLSB0I4vFLT1hUpey49XO7COePpM-6at6f5FTV23fkqAjMDEO9Jg1r5sjRFSPBVvgkjtNYGN8HeK8__5iQzaZgcica5tUIT_hal2cwOajIdRrMqTOBd9zGHioWKGJwwIlmo-VT4oy01MOUIeUVPTlHh1ywxpynama',
  materialId: 'mat_pcb_high',
  materialTitle: 'Printed Circuit Board (PCB)',
  materialSub: 'Motherboard / Component Grade 1',
  confidence: 92,
  weight: 12.0,
  unit: 'kg',
  condition: 'Used / Mixed',
  isConfirmed: false,
  acceptedRecycler: {
    id: 'cpcb_mh_032',
    name: 'CBS EWaste Recycling Industries',
    cpcbNo: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032',
    rate: 275
  },
  agreedRate: 275,
  totalEst: 3300,
  handoverRef: 'KC-TRACE-20260905-MH-8F2A1C',
  status: 'PENDING_CONFIRMATION',
  items: [
    {
      id: 'item_init_01',
      materialId: 'mat_pcb_high',
      materialTitle: 'Printed Circuit Board (PCB)',
      materialSub: 'Motherboard / Component Grade 1',
      weight: 12.0,
      unit: 'kg',
      condition: 'Used / Mixed',
      baseRate: 265,
      lowEst: 2870,
      highEst: 3450,
      confidence: 92,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnrXAynZNALXyOl8wueunxDavXvrvwno8ShM4qL4CTD3UnF4MmWJ4LuV71LlqCfufAD8qkP3HoAHlCEuL7qoWrLSB0I4vFLT1hUpey49XO7COePpM-6at6f5FTV23fkqAjMDEO9Jg1r5sjRFSPBVvgkjtNYGN8HeK8__5iQzaZgcica5tUIT_hal2cwOajIdRrMqTOBd9zGHioWKGJwwIlmo-VT4oy01MOUIeUVPTlHh1ywxpynama'
    }
  ]
};

export default function CollectorApp({ onSwitchRole, currentLang: propLang, onLanguageChange: propOnLanguageChange }) {
  const { i18n } = useTranslation();
  const fileInputRef = useRef(null);

  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'ai_scan' | 'category_select' | 'lot_summary' | 'offers' | 'receipt' | 'earnings' | 'safety'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningPreview, setScanningPreview] = useState(null);
  const [scanStep, setScanStep] = useState(1);
  
  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const [internalLang, setInternalLang] = useState(() => {
    return normalize(propLang || localStorage.getItem('relink_lang') || i18n.language);
  });

  useEffect(() => {
    if (propLang) {
      setInternalLang(normalize(propLang));
    }
  }, [propLang]);

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setInternalLang(normalize(lng));
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const currentLang = normalize(propLang || internalLang);

  // Persist in-progress draft to sessionStorage (Fixes Issue 4.4)
  const [lotDraft, setLotDraft] = useState(() => {
    try {
      const saved = sessionStorage.getItem('relink_lot_draft');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_LOT_DRAFT;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('relink_lot_draft', JSON.stringify(lotDraft));
    } catch (e) {}
  }, [lotDraft]);

  const [recentLots, setRecentLots] = useState([]);
  const [syncStatus, setSyncStatus] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    unsyncedCount: 0
  });

  // Listen to offline sync engine
  useEffect(() => {
    syncEngine.init();
    const unsubscribe = syncEngine.subscribe((status) => {
      setSyncStatus({
        isOnline: status.isOnline && !status.isSimulatedAirplaneMode,
        unsyncedCount: status.unsyncedCount?.total || 0
      });
    });

    async function loadOfflineLots() {
      try {
        const local = await getRecentOfflineLots(5);
        if (local && local.length > 0) {
          setRecentLots(local);
        }
      } catch (e) {
        console.log('Error loading offline lots:', e);
      }
    }
    loadOfflineLots();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle Photo Capture / Scan Trigger with value reset (Fixes Issue 2.3)
  const handleScanTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    } else {
      setActiveScreen('ai_scan');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      // If user cancels camera/file picker, stay cleanly on current screen (Fixes Issue 2.4)
      return;
    }

    try {
      const tempUrl = URL.createObjectURL(file);
      setScanningPreview(tempUrl);
    } catch (err) {
      // Ignore preview creation error
    }

    // Trigger instant analyzing visual overlay
    setIsAnalyzing(true);
    setScanStep(1);

    const stepTimer1 = setTimeout(() => setScanStep(2), 600);
    const stepTimer2 = setTimeout(() => setScanStep(3), 1300);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target.result;
      
      // Auto-classify using backend if available
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('http://localhost:8000/classify', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const aiData = await res.json();
          const info = aiData.data || aiData;
          const topCategory = info.category || info.top_category || 'mat_pcb_high';
          const topTitle = info.category_name || info.top_category_name || info.label || 'Printed Circuit Board (PCB)';
          const confScore = Math.round((info.confidence || 0.92) * 100);
          const top3 = info.top_3_predictions || info.suggestions || [];
          const boundingBoxes = info.bounding_boxes || [];
          const detectedObjectsCount = info.detected_objects_count || 0;
          const roboflowMeta = info.roboflow || null;

          setLotDraft((prev) => ({
            ...prev,
            photoUrl: dataUrl,
            materialId: topCategory,
            materialTitle: topTitle,
            confidence: confScore,
            top3Predictions: top3,
            boundingBoxes: boundingBoxes,
            detectedObjectsCount: detectedObjectsCount,
            roboflowMeta: roboflowMeta
          }));
        } else {
          setLotDraft((prev) => ({ ...prev, photoUrl: dataUrl }));
        }
      } catch (err) {
        setLotDraft((prev) => ({ ...prev, photoUrl: dataUrl }));
      } finally {
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        setIsAnalyzing(false);
        setActiveScreen('ai_scan');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLanguageChange = (lng) => {
    const safe = normalize(lng);
    if (propOnLanguageChange) {
      propOnLanguageChange(safe);
    } else {
      i18n.changeLanguage(safe);
      localStorage.setItem('relink_lang', safe);
      setInternalLang(safe);
    }
  };

  const handleLanguageCycle = () => {
    const nextLang = currentLang === 'hi' ? 'mr' : (currentLang === 'mr' ? 'en' : 'hi');
    handleLanguageChange(nextLang);
  };

  const handleUpdateDraft = (updates) => {
    setLotDraft((prev) => ({ ...prev, ...updates }));
  };

  const handleAcceptOffer = async (acceptedDraft) => {
    setLotDraft(acceptedDraft);

    // Save to Dexie offline database
    try {
      const lotRecord = {
        id: acceptedDraft.id || `lot_${Date.now()}`,
        collector_id: 'col_test_001',
        material_id: acceptedDraft.materialId,
        material_category: acceptedDraft.materialTitle.split(' ')[0],
        approximate_weight: acceptedDraft.weight,
        condition: acceptedDraft.condition,
        quoted_price: acceptedDraft.totalEst,
        image_data_url: acceptedDraft.photoUrl,
        ai_confidence: (acceptedDraft.confidence || 92) / 100,
        status: 'OFFER_ACCEPTED',
        acceptedRecycler: acceptedDraft.acceptedRecycler,
        handover_ref: acceptedDraft.handoverRef || `RL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        created_at: 'Just now',
        synced: false
      };
      const savedLot = await saveOfflineLot(lotRecord);

      const handoverRecord = {
        lot_id: savedLot.id,
        handover_ref: lotRecord.handover_ref,
        weight: acceptedDraft.weight,
        gps_lat: 19.0434,
        gps_lng: 72.8576,
        photo_url: acceptedDraft.photoUrl,
        recycler_id: acceptedDraft.acceptedRecycler?.id || 'rec_ecorecycle_01',
        status: 'PENDING_CONFIRMATION',
        synced: false
      };
      await saveOfflineHandover(handoverRecord);
      setRecentLots((prev) => [savedLot, ...prev.filter(l => l.id !== savedLot.id)]);

      // Cross-Portal Live Handshake to Dealer Dashboard
      if (acceptedDraft.buyerType === 'DEALER' || acceptedDraft.acceptedBuyer?.tier?.includes('Aggregator')) {
        try {
          const existing = JSON.parse(localStorage.getItem('relink_inbound_dealer_lots') || '[]');
          const newDealerItem = {
            id: savedLot.id,
            lot_ref: lotRecord.handover_ref,
            collector_id: 'col_ramesh_peenya',
            collector_name: 'Ramesh Kumar',
            collector_cluster: 'Peenya Cluster 3',
            rating: 4.8,
            kyc_verified: true,
            material_category: acceptedDraft.materialTitle.split(' ')[0] || 'PCB',
            material_name: acceptedDraft.materialTitle,
            ai_confidence: (acceptedDraft.confidence || 92) / 100,
            asking_rate: acceptedDraft.agreedRate || 755,
            approved_rate: acceptedDraft.agreedRate || 755,
            tare_weight: 0.40,
            gross_weight: Number((Number(acceptedDraft.weight) + 0.40).toFixed(2)),
            net_weight: Number(acceptedDraft.weight),
            sensor_id: acceptedDraft.acceptedBuyer?.scaleSensorId || 'HX711-PEENYA-02-OK',
            status: 'QUEUED',
            queued_time: 'Just now',
            image_url: acceptedDraft.photoUrl || '/assets/icons/pcb_high.svg',
            is_new_live_intake: true
          };
          localStorage.setItem('relink_inbound_dealer_lots', JSON.stringify([newDealerItem, ...existing.filter(l => l.lot_ref !== newDealerItem.lot_ref)]));
        } catch (storageErr) {
          console.log('Error saving to dealer queue:', storageErr);
        }
      }

      if (syncEngine.isEffectivelyOnline()) {
        syncEngine.syncNow();
      }
    } catch (err) {
      console.log('Error caching accepted lot:', err);
    }
  };

  const handleSaveDraftOffline = async (draftToSave) => {
    try {
      const lotRecord = {
        id: draftToSave.id || `lot_${Date.now()}`,
        collector_id: 'col_test_001',
        material_id: draftToSave.materialId || 'mat_pcb_high',
        material_category: (draftToSave.materialTitle || 'PCB').split(' ')[0],
        approximate_weight: draftToSave.weight || 12.0,
        condition: draftToSave.condition || 'Used / Mixed',
        quoted_price: draftToSave.lowEst || 8400,
        image_data_url: draftToSave.photoUrl,
        ai_confidence: (draftToSave.confidence || 92) / 100,
        status: 'AWAITING_OFFERS',
        handover_ref: draftToSave.handoverRef || `RL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        created_at: 'Just now',
        synced: false
      };
      const saved = await saveOfflineLot(lotRecord);
      setRecentLots((prev) => [saved, ...prev.filter(l => l.id !== saved.id)]);

      if (syncEngine.isEffectivelyOnline()) {
        syncEngine.syncNow();
      }
      return saved;
    } catch (err) {
      console.log('Error saving offline lot draft:', err);
      return null;
    }
  };

  const handleAddItemToDraft = (newItem) => {
    setLotDraft((prev) => {
      const existingItems = prev.items || [];
      const updatedItems = [...existingItems, { ...newItem, id: `item_${Date.now()}` }];
      const totalWeight = updatedItems.reduce((sum, it) => sum + (Number(it.weight) || 0), 0);
      const totalLow = updatedItems.reduce((sum, it) => sum + (Number(it.lowEst) || 0), 0);
      const totalHigh = updatedItems.reduce((sum, it) => sum + (Number(it.highEst) || 0), 0);
      return {
        ...prev,
        items: updatedItems,
        weight: totalWeight,
        lowEst: totalLow,
        highEst: totalHigh,
        totalEst: Math.round((totalLow + totalHigh) / 2)
      };
    });
  };

  const handleRemoveItemFromDraft = (itemId) => {
    setLotDraft((prev) => {
      const existingItems = prev.items || [];
      const updatedItems = existingItems.filter(it => it.id !== itemId);
      const totalWeight = updatedItems.reduce((sum, it) => sum + (Number(it.weight) || 0), 0);
      const totalLow = updatedItems.reduce((sum, it) => sum + (Number(it.lowEst) || 0), 0);
      const totalHigh = updatedItems.reduce((sum, it) => sum + (Number(it.highEst) || 0), 0);
      return {
        ...prev,
        items: updatedItems,
        weight: totalWeight,
        lowEst: totalLow,
        highEst: totalHigh,
        totalEst: Math.round((totalLow + totalHigh) / 2)
      };
    });
  };

  const handleResetLot = () => {
    sessionStorage.removeItem('relink_lot_draft');
    setLotDraft({
      ...DEFAULT_LOT_DRAFT,
      id: `lot_${Date.now()}`,
      handoverRef: `KC-TRACE-20260905-MH-${Math.random().toString(16).slice(2, 8).toUpperCase()}`
    });
    setActiveScreen('home');
  };

  return (
    <div className="collector-main-container">
      {/* Smart Scrap Scanner Overlay Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-200">
          <div className="w-72 h-72 relative rounded-3xl overflow-hidden border-2 border-primary/70 shadow-[0_0_35px_rgba(26,125,75,0.35)] flex items-center justify-center bg-surface-container-highest">
            {/* Background Image Preview if available */}
            {scanningPreview ? (
              <img
                src={scanningPreview}
                alt="Scanned item preview"
                className="absolute inset-0 w-full h-full object-cover opacity-85 filter contrast-105"
              />
            ) : (
              <div className="absolute inset-0 bg-radial from-primary/20 via-surface-container-highest to-black/80 flex items-center justify-center">
                <span className="material-symbols-outlined text-[64px] text-primary/40 animate-pulse">inventory_2</span>
              </div>
            )}

            {/* Dark contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80"></div>

            {/* Viewfinder Target Grid and Corner Brackets */}
            <div className="absolute inset-3 border border-white/20 rounded-2xl pointer-events-none">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-lg"></div>

              {/* Center Target Reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-primary/40 flex items-center justify-center animate-ping opacity-30"></div>
                <div className="absolute w-8 h-8 rounded-full border-2 border-primary/80 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Animated Laser Scanning Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-[pulse_1.2s_infinite] top-1/3"></div>

            {/* Top Pill Inside Viewfinder */}
            <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/75 border border-primary/50 text-[11px] font-bold tracking-wide text-emerald-300 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  {currentLang === 'mr' ? 'स्मार्ट भंगार स्कॅनर' : (currentLang === 'hi' ? 'स्मार्ट कबाड़ स्कैनर' : 'Smart Scrap Scanner')}
                </span>
              </span>
            </div>
          </div>

          {/* Friendly Status and Steps */}
          <div className="mt-6 text-center space-y-2.5 max-w-sm w-full px-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <span>
                  {currentLang === 'mr'
                    ? 'भंगाराची तपासणी सुरू आहे...'
                    : (currentLang === 'hi'
                        ? 'कबाड़ की जांच हो रही है...'
                        : 'Checking your scrap item...')}
                </span>
              </h3>
              <p className="text-xs text-emerald-300/90 mt-0.5 font-medium">
                {currentLang === 'mr'
                  ? 'सामग्रीचा प्रकार ओळखून आजचा सर्वोत्तम दर शोधत आहे'
                  : (currentLang === 'hi'
                      ? 'सामग्री पहचान कर आज का सबसे अच्छा मंडी भाव निकाल रहे हैं'
                      : 'Detecting scrap type & fetching today’s best mandi rate')}
              </p>
            </div>

            {/* Live Visual Micro-Steps */}
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px]">
              <span className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                scanStep >= 1 ? 'bg-primary/30 text-emerald-300 border border-primary/50' : 'bg-white/10 text-white/50'
              }`}>
                <span>{scanStep > 1 ? '✓' : '•'}</span>
                <span>{currentLang === 'mr' ? 'प्रकार ओळख' : (currentLang === 'hi' ? 'प्रकार' : 'Material')}</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                scanStep >= 2 ? 'bg-primary/30 text-emerald-300 border border-primary/50' : 'bg-white/10 text-white/50'
              }`}>
                <span>{scanStep > 2 ? '✓' : '•'}</span>
                <span>{currentLang === 'mr' ? 'दर्जा व वजन' : (currentLang === 'hi' ? 'दर्जा व वजन' : 'Grade & Weight')}</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                scanStep >= 3 ? 'bg-primary/30 text-emerald-300 border border-primary/50' : 'bg-white/10 text-white/50'
              }`}>
                <span>•</span>
                <span>{currentLang === 'mr' ? 'डीलर दर' : (currentLang === 'hi' ? 'डीलर दर' : 'Dealer Rate')}</span>
              </span>
            </div>

            {/* Real-World Reassurance Note */}
            <p className="text-[11px] text-white/70 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 inline-block">
              {currentLang === 'mr'
                ? '💡 जवळच्या अधिकृत स्क्रॅप डीलरशी थेट संपर्क • तुरंत रोख रक्कम'
                : (currentLang === 'hi'
                    ? '💡 निकटतम अधिकृत कबाड़ डीलर से सीधा संपर्क • तुरंत नकद भुगतान'
                    : '💡 Connects directly with verified local dealers for instant cash.')}
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input for native camera capture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
      />

      {/* Screen 1: Collector Home */}
      {activeScreen === 'home' && (
        <Screen01Home
          onScanClick={handleScanTrigger}
          onNavigate={setActiveScreen}
          onSelectLot={(lot) => {
            setLotDraft((prev) => ({
              ...prev,
              ...lot,
              materialTitle: lot.material_category || 'Printed Circuit Board (PCB)'
            }));
            setActiveScreen('receipt');
          }}
          recentLots={recentLots}
          syncStatus={syncStatus}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
          onSwitchRole={onSwitchRole}
        />
      )}

      {/* Screen 1b: My Lots & Active Tracking */}
      {activeScreen === 'my_lots' && (
        <Screen07MyLots
          lots={recentLots}
          onSelectLot={(lot) => {
            setLotDraft((prev) => ({
              ...prev,
              ...lot,
              materialTitle: lot.material_category || lot.materialTitle || 'Printed Circuit Board (PCB)'
            }));
            if (lot.status === 'AWAITING_OFFERS' || lot.status === 'CREATED') {
              setActiveScreen('offers');
            } else if (lot.status === 'OFFER_ACCEPTED' || lot.status === 'READY_FOR_PICKUP') {
              setActiveScreen('receipt');
            } else {
              setActiveScreen('receipt');
            }
          }}
          onNewScan={handleScanTrigger}
          onNavigate={setActiveScreen}
          syncStatus={syncStatus}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
        />
      )}

      {/* Screen 2: AI Material Identification & Viewfinder */}
      {activeScreen === 'ai_scan' && (
        <Screen02AiIdentification
          lotDraft={lotDraft}
          onUpdateDraft={handleUpdateDraft}
          onNavigate={setActiveScreen}
          onRetakePhoto={handleScanTrigger}
          syncStatus={syncStatus}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
        />
      )}

      {/* Screen 3: Category Select Grid (Manual Fallback) */}
      {activeScreen === 'category_select' && (
        <Screen03CategorySelect
          onSelectCategory={(cat) => handleUpdateDraft(cat)}
          onNavigate={setActiveScreen}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
        />
      )}

      {/* Screen 3b: Create Lot & Digital Summary (Stitch Screen) */}
      {activeScreen === 'lot_summary' && (
        <Screen03bDigitalSummary
          lotDraft={lotDraft}
          onNavigate={setActiveScreen}
          onSaveOffline={handleSaveDraftOffline}
          onAddItem={() => setActiveScreen('ai_scan')}
          onRemoveItem={handleRemoveItemFromDraft}
          syncStatus={syncStatus}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
        />
      )}

      {/* Screen 4: Price Discovery & Recycler Offers */}
      {activeScreen === 'offers' && (
        <Screen04PriceOffers
          lotDraft={lotDraft}
          onAcceptOffer={handleAcceptOffer}
          onNavigate={setActiveScreen}
          syncStatus={syncStatus}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
        />
      )}

      {/* Screen 5: Digital Handover Receipt & QR */}
      {activeScreen === 'receipt' && (
        <Screen05HandoverReceipt
          lotDraft={lotDraft}
          onNavigate={setActiveScreen}
          onResetLot={handleResetLot}
          syncStatus={syncStatus}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
        />
      )}

      {/* Screen 6: My Earnings History */}
      {activeScreen === 'earnings' && (
        <Screen06EarningsHistory
          onNavigate={setActiveScreen}
          syncStatus={syncStatus}
          currentLang={currentLang}
          onLanguageChange={handleLanguageCycle}
        />
      )}

      {/* Screen 7: Pictorial Safety Guidance (Wired to Safety Tab) */}
      {activeScreen === 'safety' && (
        <div className="collector-shell pb-24">
          <header className="bg-surface border-b border-outline-variant p-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveScreen('home')}
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="font-headline-md font-bold text-primary text-lg">
                {currentLang === 'mr' ? 'सुरक्षा मार्गदर्शन' : (currentLang === 'hi' ? 'सुरक्षा मार्गदर्शन' : 'Safety Guidance')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLanguageCycle}
                className="flex items-center gap-1 h-9 px-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-bold cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm text-primary">language</span>
                <span>{currentLang === 'hi' ? 'हिन्दी' : (currentLang === 'mr' ? 'मराठी' : 'EN')}</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-outline-variant text-primary font-bold text-xs">
                👷‍♂️
              </div>
            </div>
          </header>
          <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
            <SafetyGuidance currentLang={currentLang} onLanguageChange={handleLanguageCycle} />
          </div>
          {/* Bottom Nav (Mobile Only) */}
          <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
            <button onClick={() => setActiveScreen('home')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">home</span>
              <span className="font-label-md text-xs mt-1">
                {currentLang === 'mr' ? 'मुख्य' : (currentLang === 'hi' ? 'होम' : 'Home')}
              </span>
            </button>
            <button onClick={() => setActiveScreen('ai_scan')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="font-label-md text-xs mt-1">
                {currentLang === 'mr' ? 'लॉट' : (currentLang === 'hi' ? 'बेचें/लॉट' : 'Sell/Lots')}
              </span>
            </button>
            <button onClick={() => setActiveScreen('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-md text-xs mt-1">
                {currentLang === 'mr' ? 'कमाई' : (currentLang === 'hi' ? 'कमाई' : 'Earnings')}
              </span>
            </button>
            <button onClick={() => setActiveScreen('safety')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
              <span className="material-symbols-outlined filled">info</span>
              <span className="font-label-md text-xs font-bold mt-1">
                {currentLang === 'mr' ? 'सुरक्षा' : (currentLang === 'hi' ? 'सुरक्षा' : 'Safety')}
              </span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
