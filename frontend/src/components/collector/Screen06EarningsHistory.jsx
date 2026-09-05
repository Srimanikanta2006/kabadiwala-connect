import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Screen06EarningsHistory({ onNavigate, syncStatus = { isOnline: true } }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const [earnings, setEarnings] = useState({
    totalCompleted: 18450,
    pendingDues: 5250,
    monthName: 'September 2026',
    transactions: [
      { id: 'tx_1', desc: '10kg PCB', amount: 7800, recycler: 'EcoRecycle India • Aug 29', status: 'Paid', icon: 'memory', isPaid: true },
      { id: 'tx_2', desc: '25kg Cables', amount: 5250, recycler: 'GreenCircle • Aug 26', status: 'Pending', icon: 'cable', isPaid: false },
      { id: 'tx_3', desc: '5kg Mixed E-Waste', amount: 1200, recycler: 'City Depot • Aug 15', status: 'Paid', icon: 'devices', isPaid: true },
      { id: 'tx_4', desc: '18kg Batteries', amount: 4200, recycler: 'EcoRecycle India • Aug 08', status: 'Paid', icon: 'battery_charging_full', isPaid: true }
    ],
    breakdown: [
      { name: 'PCB', pct: '42%', inr: '₹7,800', icon: 'memory', color: 'text-primary' },
      { name: 'Cables', pct: '28%', inr: '₹5,250', icon: 'cable', color: 'text-tertiary' },
      { name: 'Batteries', pct: '20%', inr: '₹3,700', icon: 'battery_charging_full', color: 'text-secondary' },
      { name: 'Mixed', pct: '10%', inr: '₹1,700', icon: 'devices', color: 'text-secondary' }
    ]
  });

  // Query live earnings endpoint if available
  useEffect(() => {
    async function fetchLedger() {
      try {
        const res = await fetch('http://localhost:8000/earnings/col_test_001');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.transactions) {
            const completed = data.total_completed_earnings || 18450;
            const pending = data.total_pending_dues || 5250;
            setEarnings((prev) => ({
              ...prev,
              totalCompleted: completed,
              pendingDues: pending
            }));
          }
        }
      } catch (err) {
        console.log('Using local earnings cache');
      }
    }
    fetchLedger();
  }, []);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakEarnings = () => {
    const speech = currentLang === 'mr'
      ? `या महिन्याची एकूण कमाई: ₹${earnings.totalCompleted.toLocaleString('en-IN')}. थकीत रक्कम ₹${earnings.pendingDues.toLocaleString('en-IN')}. सर्व व्यवहार थेट रोखीने पूर्ण होतात.`
      : `इस महीने की कुल कमाई: ₹${earnings.totalCompleted.toLocaleString('en-IN')}। बकाया राशि ₹${earnings.pendingDues.toLocaleString('en-IN')}। सभी लेनदेन सीधे नकद में पूर्ण होते हैं।`;
    speakText(speech);
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="docked full-width top-0 border-b border-outline-variant bg-surface text-primary flex justify-between items-center w-full px-margin-mobile h-touch-target-min z-40 sticky">
        <div className="flex items-center gap-md">
          <span className="font-headline-md text-headline-md font-bold text-primary">RE:LINK</span>
        </div>
        <div className="flex items-center gap-sm">
          <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant text-xs text-primary font-medium">
            <span className="material-symbols-outlined text-[16px] filled">cloud_done</span>
            <span>{syncStatus.isOnline ? 'Synced' : 'Offline'}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-outline-variant text-primary font-bold text-xs">
            👷‍♂️
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 flex-grow w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-2xl">
            Earnings Ledger
          </h1>
          <button
            onClick={handleSpeakEarnings}
            aria-label="Play Audio Guidance"
            className="flex items-center gap-xs text-tertiary hover:bg-surface-container rounded-full p-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-tertiary filled">volume_up</span>
          </button>
        </div>

        {/* Summary Card */}
        <section className="bg-surface rounded-xl shadow-md border border-outline-variant p-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md relative overflow-hidden p-5">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
          </div>
          <div className="z-10">
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xs text-xs text-secondary font-semibold uppercase tracking-wider">
              {earnings.monthName} (Physical Cash Settled)
            </p>
            <div className="flex items-end gap-sm">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-extrabold text-primary text-3xl md:text-4xl">
                ₹{earnings.totalCompleted.toLocaleString('en-IN')}
              </h2>
              <div className="flex items-center text-primary bg-primary-container text-on-primary-container px-2 py-1 rounded-md mb-1 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                +12%
              </div>
            </div>
            <p className="text-xs text-secondary mt-1">
              Pending dues awaiting weighbridge confirmation: <strong className="text-amber-700 font-bold">₹{earnings.pendingDues.toLocaleString('en-IN')}</strong>
            </p>
          </div>
          <div className="z-10 flex gap-sm mt-2 md:mt-0">
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 font-label-lg text-xs rounded-lg px-4 py-2.5 flex items-center justify-center font-bold">
              ✓ 100% Cash Paid at Scale
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Transactions List */}
          <div className="md:col-span-2 space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h3 className="font-headline-md text-headline-md font-bold text-base">Recent Transactions</h3>
              <span className="text-tertiary font-label-md text-xs font-semibold">Live Audit Trail</span>
            </div>
            <div className="space-y-sm">
              {earnings.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-surface rounded-lg shadow-sm border border-outline-variant p-md flex items-center gap-md hover:bg-surface-container-lowest transition-colors p-3"
                >
                  <div className="w-11 h-11 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[22px]">{tx.icon}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="font-label-lg text-label-lg font-bold text-sm truncate">{tx.desc}</p>
                      <p className="font-label-lg text-label-lg text-primary font-bold text-sm">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant">
                      <p className="truncate text-secondary text-xs">{tx.recycler}</p>
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          tx.isPaid
                            ? 'bg-surface-container-high text-primary'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {tx.isPaid ? 'check_circle' : 'schedule'}
                        </span>
                        <span>{tx.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Material Breakdown (Bento Grid) */}
          <div className="space-y-md">
            <h3 className="font-headline-md text-headline-md font-bold text-base border-b border-outline-variant pb-2">
              Material Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-sm">
              {earnings.breakdown.map((item) => (
                <div
                  key={item.name}
                  className="bg-surface rounded-lg p-md border border-outline-variant shadow-sm flex flex-col justify-between h-28 p-3"
                >
                  <div className="flex items-start justify-between">
                    <span className={`material-symbols-outlined ${item.color} bg-primary-container/10 p-1 rounded-md text-[20px]`}>
                      {item.icon}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-xs font-bold">{item.pct}</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant text-xs text-secondary">{item.name}</p>
                    <p className="font-label-lg text-label-lg font-bold text-sm">{item.inr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-xs mt-1">Home</span>
        </button>
        <button onClick={() => onNavigate('ai_scan')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-md text-xs mt-1">Sell / Lots</span>
        </button>
        <button onClick={() => onNavigate('earnings')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
          <span className="material-symbols-outlined filled">payments</span>
          <span className="font-label-md text-xs font-bold mt-1">Earnings</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">Safety</span>
        </button>
      </nav>
    </div>
  );
}
