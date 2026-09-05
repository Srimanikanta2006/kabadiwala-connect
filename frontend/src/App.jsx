import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PriceBoard from './components/PriceBoard';
import HandoverTraceability from './components/HandoverTraceability';
import EarningsLedger from './components/EarningsLedger';
import SafetyGuidance from './components/SafetyGuidance';
import QuickLotIconFlow from './components/QuickLotIconFlow';
import LanguagePicker from './components/LanguagePicker';
import OfflineSyncBanner from './components/OfflineSyncBanner';

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('icon_flow'); // Default to low-literacy icon flow

  return (
    <div className="app-root">
      {/* Top Application Navbar with Language Picker Prominently Positioned */}
      <nav style={{
        background: '#0f172a',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff',
        borderBottom: '3px solid #0284c7',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Brand Logo & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.6rem' }}>♻️</span>
          <div>
            <strong style={{ fontSize: '1.15rem', letterSpacing: '0.5px' }}>{t('app_title')}</strong>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '0.5rem', display: 'inline-block' }}>
              {t('app_subtitle')}
            </span>
          </div>
        </div>

        {/* Step 2: Prominent Language Picker using native scripts and flags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <LanguagePicker />

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('icon_flow')}
              style={{
                background: activeTab === 'icon_flow' ? '#f59e0b' : 'transparent',
                border: activeTab === 'icon_flow' ? 'none' : '1px solid #475569',
                color: '#ffffff',
                padding: '0.45rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.86rem',
                minHeight: '40px'
              }}
            >
              {t('tab_icon_flow')}
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              style={{
                background: activeTab === 'ledger' ? '#16a34a' : 'transparent',
                border: activeTab === 'ledger' ? 'none' : '1px solid #334155',
                color: '#ffffff',
                padding: '0.45rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.86rem',
                minHeight: '40px'
              }}
            >
              {t('tab_ledger')}
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              style={{
                background: activeTab === 'safety' ? '#dc2626' : 'transparent',
                border: activeTab === 'safety' ? 'none' : '1px solid #334155',
                color: '#ffffff',
                padding: '0.45rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.86rem',
                minHeight: '40px'
              }}
            >
              {t('tab_safety')}
            </button>
            <button
              onClick={() => setActiveTab('handover')}
              style={{
                background: activeTab === 'handover' ? '#0284c7' : 'transparent',
                border: activeTab === 'handover' ? 'none' : '1px solid #334155',
                color: '#ffffff',
                padding: '0.45rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.86rem',
                minHeight: '40px'
              }}
            >
              {t('tab_handover')}
            </button>
            <button
              onClick={() => setActiveTab('priceboard')}
              style={{
                background: activeTab === 'priceboard' ? '#0284c7' : 'transparent',
                border: activeTab === 'priceboard' ? 'none' : '1px solid #334155',
                color: '#ffffff',
                padding: '0.45rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.86rem',
                minHeight: '40px'
              }}
            >
              {t('tab_priceboard')}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content View */}
      <main style={{ minHeight: 'calc(100vh - 65px)', background: '#f8fafc', padding: '0.75rem 1rem' }}>
        <OfflineSyncBanner />
        {activeTab === 'icon_flow' && <QuickLotIconFlow />}
        {activeTab === 'ledger' && <EarningsLedger />}
        {activeTab === 'safety' && <SafetyGuidance />}
        {activeTab === 'handover' && <HandoverTraceability />}
        {activeTab === 'priceboard' && <PriceBoard />}
      </main>
    </div>
  );
}

export default App;
