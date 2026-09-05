import React, { useState } from 'react';
import Screen00WelcomeRole from './components/collector/Screen00WelcomeRole';
import CollectorApp from './components/collector/CollectorApp';
import RecyclerDashboard from './components/RecyclerDashboard';
import OfflineSyncBanner from './components/OfflineSyncBanner';

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('kabadiwala_user_role') || null);

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
    return <Screen00WelcomeRole onSelectRole={handleRoleChange} />;
  }

  // 2. Recycler Enterprise Desktop Portal (Screen 07)
  if (userRole === 'recycler') {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <OfflineSyncBanner />
        <RecyclerDashboard onRoleSwitch={() => handleRoleChange(null)} />
      </div>
    );
  }

  // 3. Collector Mobile App Workflow (Screens 01-06)
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <OfflineSyncBanner />
      <CollectorApp onSwitchRole={() => handleRoleChange(null)} />
    </div>
  );
}

export default App;
