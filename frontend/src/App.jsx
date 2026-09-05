import React, { useState } from 'react';
import PriceBoard from './components/PriceBoard';
import HandoverTraceability from './components/HandoverTraceability';
import EarningsLedger from './components/EarningsLedger';
import SafetyGuidance from './components/SafetyGuidance';

function App() {
  const [activeTab, setActiveTab] = useState('earnings'); // Default to newly implemented Earnings Ledger

  return (
    <div className="app-root">
      {/* Top Application Navbar */}
      <nav style={{
        background: '#0f172a',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff',
        borderBottom: '3px solid #0284c7',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>♻️</span>
          <div>
            <strong style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>RE:LINK</strong>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
              Kabadiwala Connect • Smart E-Waste Mandi
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('earnings')}
            style={{
              background: activeTab === 'earnings' ? '#16a34a' : 'transparent',
              border: activeTab === 'earnings' ? 'none' : '1px solid #334155',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem'
            }}
          >
            💰 कमाई बही (Ledger)
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            style={{
              background: activeTab === 'safety' ? '#dc2626' : 'transparent',
              border: activeTab === 'safety' ? 'none' : '1px solid #334155',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem'
            }}
          >
            🦺 सुरक्षा गाइड (Safety)
          </button>
          <button
            onClick={() => setActiveTab('handover')}
            style={{
              background: activeTab === 'handover' ? '#0284c7' : 'transparent',
              border: activeTab === 'handover' ? 'none' : '1px solid #334155',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem'
            }}
          >
            🛡️ हैंडओवर व क्यूआर (QR)
          </button>
          <button
            onClick={() => setActiveTab('priceboard')}
            style={{
              background: activeTab === 'priceboard' ? '#0284c7' : 'transparent',
              border: activeTab === 'priceboard' ? 'none' : '1px solid #334155',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem'
            }}
          >
            📊 भाव बोर्ड (Prices)
          </button>
        </div>
      </nav>

      {/* Main Content View */}
      <main style={{ minHeight: 'calc(100vh - 65px)', background: '#f8fafc' }}>
        {activeTab === 'earnings' && <EarningsLedger />}
        {activeTab === 'safety' && <SafetyGuidance />}
        {activeTab === 'handover' && <HandoverTraceability />}
        {activeTab === 'priceboard' && <PriceBoard />}
      </main>
    </div>
  );
}

export default App;
