import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Screen00WelcomeRole from './components/collector/Screen00WelcomeRole';
import CollectorApp from './components/collector/CollectorApp';
import RecyclerDashboard from './components/RecyclerDashboard';
import DealerDashboard from './components/DealerDashboard';

function App() {
  const { i18n } = useTranslation();
  const [userRole, setUserRole] = useState(() => localStorage.getItem('kabadiwala_user_role') || null);

  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const [currentLang, setCurrentLang] = useState(() => {
    return normalize(localStorage.getItem('relink_lang') || i18n?.language || 'hi');
  });

  const handleLanguageChange = (newLang) => {
    const next = newLang || (currentLang === 'hi' ? 'mr' : currentLang === 'mr' ? 'en' : 'hi');
    const safe = normalize(next);
    setCurrentLang(safe);
    localStorage.setItem('relink_lang', safe);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(safe);
    }
  };

  const handleRoleChange = (role, extraInfo = null) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('kabadiwala_user_role', role);
      if (extraInfo) {
        localStorage.setItem('kabadiwala_user_phone', extraInfo);
      }
    } else {
      localStorage.removeItem('kabadiwala_user_role');
    }
  };

  // 1. Welcome & Role Selection Gateway (Screen 00)
  if (!userRole) {
    return (
      <Screen00WelcomeRole
        onSelectRole={handleRoleChange}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // 2. Recycler Enterprise Desktop Portal (Screen 07)
  if (userRole === 'recycler') {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <RecyclerDashboard
          onRoleSwitch={() => handleRoleChange(null)}
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    );
  }

  // 3. Dealer / Aggregator Hub (Yard Desk)
  if (userRole === 'dealer' || userRole === 'aggregator') {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <DealerDashboard
          onRoleSwitch={() => handleRoleChange(null)}
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    );
  }

  // 4. Collector Mobile App Workflow (Screens 01-06)
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <CollectorApp
        onSwitchRole={() => handleRoleChange(null)}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}

export default App;
