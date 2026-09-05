import React, { useState } from 'react';
import PriceBoard from './components/PriceBoard';
import HandoverTraceability from './components/HandoverTraceability';

function App() {
  const [activeTab, setActiveTab] = useState('handover'); // Default to newly implemented Handover tab

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
        borderBottom: '3px solid #0284c7'
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

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('handover')}
            style={{
              background: activeTab === 'handover' ? '#0284c7' : 'transparent',
              border: activeTab === 'handover' ? 'none' : '1px solid #334155',
              color: '#ffffff',
              padding: '0.45rem 0.95rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            🛡️ हैंडओवर व क्यूआर (Chunk 10)
          </button>
          <button
            onClick={() => setActiveTab('priceboard')}
            style={{
              background: activeTab === 'priceboard' ? '#0284c7' : 'transparent',
              border: activeTab === 'priceboard' ? 'none' : '1px solid #334155',
              color: '#ffffff',
              padding: '0.45rem 0.95rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            📊 भाव बोर्ड (Price Board)
          </button>
        </div>
      </nav>

      {/* Main Content View */}
      <main style={{ minHeight: 'calc(100vh - 65px)', background: '#f8fafc' }}>
        {activeTab === 'handover' ? <HandoverTraceability /> : <PriceBoard />}
      </main>
    </div>
  );
}

export default App;
