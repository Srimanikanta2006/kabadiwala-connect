import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CollectorApp from './components/collector/CollectorApp';
import RecyclerDashboard from './components/RecyclerDashboard';
import OfflineSyncBanner from './components/OfflineSyncBanner';
import LanguagePicker from './components/LanguagePicker';

function App() {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState(() => localStorage.getItem('kabadiwala_user_role') || 'collector');

  const handleRoleChange = (role) => {
    setUserRole(role);
    localStorage.setItem('kabadiwala_user_role', role);
  };

  if (userRole === 'recycler') {
    return <RecyclerDashboard onRoleSwitch={() => handleRoleChange('collector')} />;
  }

  return (
    <div className="app-root" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top Application Navbar with Role Switcher & Language Picker */}
      <nav style={{
        background: '#0f172a',
        padding: '0.6rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff',
        borderBottom: '3px solid #0284c7',
        flexWrap: 'wrap',
        gap: '0.75rem',
        zIndex: 50,
        position: 'relative'
      }}>
        {/* Brand Logo & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>♻️</span>
          <div>
            <strong style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>{t('app_title')}</strong>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '0.5rem', display: 'inline-block' }}>
              {t('app_subtitle')}
            </span>
          </div>
        </div>

        {/* Role Switcher Pill & Language Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Role Switcher Pill */}
          <div style={{
            display: 'inline-flex',
            background: '#1e293b',
            borderRadius: '8px',
            padding: '3px',
            border: '1.5px solid #475569'
          }}>
            <button
              onClick={() => handleRoleChange('collector')}
              style={{
                background: userRole === 'collector' ? '#16a34a' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              📱 {t('role_collector')} (Mobile App)
            </button>
            <button
              onClick={() => handleRoleChange('recycler')}
              style={{
                background: userRole === 'recycler' ? '#0284c7' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              🏭 {t('role_recycler')} (Desktop Portal)
            </button>
          </div>

          <LanguagePicker />
        </div>
      </nav>

      {/* Airplane Mode Offline Simulator Banner */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.5rem 1rem 0' }}>
        <OfflineSyncBanner />
      </div>

      {/* Main Viewport Container */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        <CollectorApp />
      </main>
    </div>
  );
}

export default App;
