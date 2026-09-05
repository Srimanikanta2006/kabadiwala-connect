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
  condition: 'Used / Mixed',
  isConfirmed: false,
  acceptedRecycler: {
    name: 'EcoRecycle India Pvt Ltd',
    cpcbNo: 'CPCB/E-WASTE/REG/MH/2023/1042',
    rate: 780
  },
  agreedRate: 780,
  totalEst: 9360,
  handoverRef: 'KC-TRACE-20260905-MH-8F2A1C',
  status: 'PENDING_CONFIRMATION'
};

export default function CollectorApp({ onSwitchRole }) {
  const { i18n } = useTranslation();
  const fileInputRef = useRef(null);

  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'ai_scan' | 'category_select' | 'lot_summary' | 'offers' | 'receipt' | 'earnings' | 'safety'
  const [lotDraft, setLotDraft] = useState(DEFAULT_LOT_DRAFT);
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

  // Handle Photo Capture / Scan Trigger
  const handleScanTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      setActiveScreen('ai_scan');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setActiveScreen('ai_scan');
      return;
    }

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

          setLotDraft((prev) => ({
            ...prev,
            photoUrl: dataUrl,
            materialId: topCategory,
            materialTitle: topTitle,
            confidence: confScore,
            top3Predictions: top3
          }));
        } else {
          setLotDraft((prev) => ({ ...prev, photoUrl: dataUrl }));
        }
      } catch (err) {
        setLotDraft((prev) => ({ ...prev, photoUrl: dataUrl }));
      }
      setActiveScreen('ai_scan');
    };
    reader.readAsDataURL(file);
  };

  const handleLanguageCycle = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : (i18n.language === 'hi' ? 'mr' : 'en');
    i18n.changeLanguage(nextLang);
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

  const handleResetLot = () => {
    setLotDraft({
      ...DEFAULT_LOT_DRAFT,
      id: `lot_${Date.now()}`,
      handoverRef: `KC-TRACE-20260905-MH-${Math.random().toString(16).slice(2, 8).toUpperCase()}`
    });
    setActiveScreen('home');
  };

  return (
    <div className="collector-main-container">
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
        />
      )}

      {/* Screen 3: Category Select Grid (Manual Fallback) */}
      {activeScreen === 'category_select' && (
        <Screen03CategorySelect
          onSelectCategory={(cat) => handleUpdateDraft(cat)}
          onNavigate={setActiveScreen}
        />
      )}

      {/* Screen 3b: Create Lot & Digital Summary (Stitch Screen) */}
      {activeScreen === 'lot_summary' && (
        <Screen03bDigitalSummary
          lotDraft={lotDraft}
          onNavigate={setActiveScreen}
          onSaveOffline={handleSaveDraftOffline}
          syncStatus={syncStatus}
        />
      )}

      {/* Screen 4: Price Discovery & Recycler Offers */}
      {activeScreen === 'offers' && (
        <Screen04PriceOffers
          lotDraft={lotDraft}
          onAcceptOffer={handleAcceptOffer}
          onNavigate={setActiveScreen}
          syncStatus={syncStatus}
        />
      )}

      {/* Screen 5: Digital Handover Receipt & QR */}
      {activeScreen === 'receipt' && (
        <Screen05HandoverReceipt
          lotDraft={lotDraft}
          onNavigate={setActiveScreen}
          onResetLot={handleResetLot}
          syncStatus={syncStatus}
        />
      )}

      {/* Screen 6: My Earnings History */}
      {activeScreen === 'earnings' && (
        <Screen06EarningsHistory
          onNavigate={setActiveScreen}
          syncStatus={syncStatus}
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
              <h1 className="font-headline-md font-bold text-primary text-lg">Safety Guidance</h1>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-outline-variant text-primary font-bold text-xs">
              👷‍♂️
            </div>
          </header>
          <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
            <SafetyGuidance />
          </div>
          {/* Bottom Nav (Mobile Only) */}
          <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
            <button onClick={() => setActiveScreen('home')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">home</span>
              <span className="font-label-md text-xs mt-1">Home</span>
            </button>
            <button onClick={() => setActiveScreen('ai_scan')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="font-label-md text-xs mt-1">Sell / Lots</span>
            </button>
            <button onClick={() => setActiveScreen('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-md text-xs mt-1">Earnings</span>
            </button>
            <button onClick={() => setActiveScreen('safety')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
              <span className="material-symbols-outlined filled">info</span>
              <span className="font-label-md text-xs font-bold mt-1">Safety</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
