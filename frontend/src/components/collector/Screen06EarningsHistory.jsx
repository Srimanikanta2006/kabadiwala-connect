import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EARNINGS_TRANSLATIONS = {
  hi: {
    ledgerTitle: 'कमाई का बहीखाता',
    settledBadge: 'नकद भुगतान प्राप्त',
    totalCompletedEarnings: 'कुल प्राप्त कमाई',
    pendingDuesLabel: 'कांटा तौल सत्यापन के लिए लंबित बकाया:',
    cashGuaranteeBadge: '✓ तराजू पर 100% नकद भुगतान',
    recentTransactions: 'हाल के लेन-देन',
    liveAuditTrail: 'लाइव ऑडिट ट्रेल',
    materialBreakdown: 'सामग्री अनुसार आय',
    statusPaid: 'नकद प्राप्त',
    statusPending: 'लंबित',
    recent: 'हाल का',
    navHome: 'होम',
    navMyLots: 'बेचें / लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा',
    categories: {
      PCB: 'पीसीबी',
      Cables: 'केबल एवं तार',
      Batteries: 'बैटरी',
      Mixed: 'मिश्रित ई-कबाड़'
    }
  },
  mr: {
    ledgerTitle: 'कमाई खतावणी',
    settledBadge: 'रोख रक्कम जमा',
    totalCompletedEarnings: 'एकूण झालेली कमाई',
    pendingDuesLabel: 'काटा पडताळणीसाठी बाकी थकीत रक्कम:',
    cashGuaranteeBadge: '✓ वजनकाट्यावर 100% रोख देयक',
    recentTransactions: 'नुकतेच झालेले व्यवहार',
    liveAuditTrail: 'थेट ऑडिट नोंद',
    materialBreakdown: 'सामग्रीनुसार वर्गीकरण',
    statusPaid: 'मिळाले',
    statusPending: 'बाकी देय',
    recent: 'नुकतेच',
    navHome: 'मुख्य',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा',
    categories: {
      PCB: 'पीसीबी',
      Cables: 'केबल आणि वायर',
      Batteries: 'बॅटरी',
      Mixed: 'मिश्र ई-कचरा'
    }
  },
  en: {
    ledgerTitle: 'Earnings Ledger',
    settledBadge: 'Physical Cash Settled',
    totalCompletedEarnings: 'Total Settled Earnings',
    pendingDuesLabel: 'Pending dues awaiting weighbridge confirmation:',
    cashGuaranteeBadge: '✓ 100% Cash Paid at Scale',
    recentTransactions: 'Recent Transactions',
    liveAuditTrail: 'Live Audit Trail',
    materialBreakdown: 'Material Breakdown',
    statusPaid: 'Paid',
    statusPending: 'Pending',
    recent: 'Recent',
    navHome: 'Home',
    navMyLots: 'Sell / Lots',
    navEarnings: 'Earnings',
    navSafety: 'Safety',
    categories: {
      PCB: 'PCB Boards',
      Cables: 'Cables & Wire',
      Batteries: 'Batteries',
      Mixed: 'Mixed E-Waste'
    }
  }
};

export default function Screen06EarningsHistory({
  onNavigate,
  onNavigateBack,
  activeScreen = 'earnings',
  syncStatus = { isOnline: true },
  currentLang: propLang,
  onLanguageChange,
  onSwitchRole
}) {
  const { i18n } = useTranslation();
  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const safeLang = normalize(propLang || i18n.language || localStorage.getItem('relink_lang'));
  const t = EARNINGS_TRANSLATIONS[safeLang] || EARNINGS_TRANSLATIONS.hi;

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [earnings, setEarnings] = useState({
    totalCompleted: 18450,
    pendingDues: 5250,
    monthName: 'September 2026',
    transactions: [
      { id: 'tx_1', desc: '10kg PCB', amount: 7800, dealer: 'Peenya Yard #04 (Dilip Bhai) • Aug 29', status: 'Paid', icon: 'memory', isPaid: true },
      { id: 'tx_2', desc: '25kg Cables', amount: 5250, dealer: 'Dharavi Aggregator Yard • Aug 26', status: 'Pending', icon: 'cable', isPaid: false },
      { id: 'tx_3', desc: '5kg Mixed E-Waste', amount: 1200, dealer: 'Kurla Mandi Yard • Aug 15', status: 'Paid', icon: 'devices', isPaid: true },
      { id: 'tx_4', desc: '18kg Batteries', amount: 4200, dealer: 'Peenya Yard #04 (Dilip Bhai) • Aug 08', status: 'Paid', icon: 'battery_charging_full', isPaid: true }
    ],
    breakdown: [
      { nameKey: 'PCB', defaultName: 'PCB', pct: '42%', inr: '₹7,800', icon: 'memory', color: 'text-primary' },
      { nameKey: 'Cables', defaultName: 'Cables', pct: '28%', inr: '₹5,250', icon: 'cable', color: 'text-tertiary' },
      { nameKey: 'Batteries', defaultName: 'Batteries', pct: '20%', inr: '₹3,700', icon: 'battery_charging_full', color: 'text-secondary' },
      { nameKey: 'Mixed', defaultName: 'Mixed', pct: '10%', inr: '₹1,700', icon: 'devices', color: 'text-secondary' }
    ]
  });

  // Query live earnings endpoint if available
  useEffect(() => {
    async function fetchLedger() {
      try {
        const res = await fetch('http://localhost:8000/earnings/col_test_001');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            const metrics = data.metrics || {};
            const completed = metrics.total_completed_earnings_inr ?? data.total_completed_earnings ?? 18450;
            const pending = metrics.total_pending_dues_inr ?? data.total_pending_dues ?? 5250;
            const txs = (data.completed_transactions || []).concat(data.pending_dues || []);
            setEarnings((prev) => ({
              ...prev,
              totalCompleted: completed,
              pendingDues: pending,
              transactions: txs.length > 0 ? txs.map((txItem, idx) => ({
                id: txItem.id || `tx_${idx}`,
                desc: `${txItem.weight || 12}kg ${txItem.material_category || 'Scrap'}`,
                amount: txItem.final_price || 0,
                dealer: txItem.dealer_name || txItem.recycler_name ? `${txItem.dealer_name || txItem.recycler_name} • Recent` : 'Authorized Scrap Dealer',
                status: txItem.payment_status === 'COMPLETED' ? 'Paid' : 'Pending',
                icon: (txItem.material_category || '').toLowerCase().includes('cable') ? 'cable' : 'memory',
                isPaid: txItem.payment_status === 'COMPLETED'
              })) : prev.transactions
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
      utterance.lang = safeLang === 'mr' ? 'mr-IN' : (safeLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakEarnings = () => {
    const speech = safeLang === 'mr'
      ? `या महिन्याची एकूण कमाई: ₹${earnings.totalCompleted.toLocaleString('en-IN')}. थकीत रक्कम ₹${earnings.pendingDues.toLocaleString('en-IN')}. सर्व व्यवहार थेट रोखीने पूर्ण होतात.`
      : (safeLang === 'en'
        ? `Total earnings this month: ₹${earnings.totalCompleted.toLocaleString('en-IN')}. Pending dues: ₹${earnings.pendingDues.toLocaleString('en-IN')}. 100% settled directly at scale.`
        : `इस महीने की कुल कमाई: ₹${earnings.totalCompleted.toLocaleString('en-IN')}। बकाया राशि ₹${earnings.pendingDues.toLocaleString('en-IN')}। सभी लेनदेन सीधे नकद में पूर्ण होते हैं।`);
    speakText(speech);
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="docked full-width top-0 border-b border-outline-variant bg-surface text-primary flex justify-between items-center w-full px-margin-mobile h-touch-target-min z-40 sticky">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (onNavigateBack ? onNavigateBack() : onNavigate('home'))}
            aria-label="Back"
            className="flex items-center justify-center w-10 h-10 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-headline-md text-headline-md font-bold text-primary">RE:LINK</span>
        </div>
        <div className="flex items-center gap-2">
          {onLanguageChange && (
            <button
              onClick={onLanguageChange}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/40 bg-primary-container/40 text-primary hover:bg-primary-container text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Change Language"
            >
              <span className="material-symbols-outlined text-[16px]">translate</span>
              <span>{safeLang === 'hi' ? 'हिन्दी' : safeLang === 'mr' ? 'मराठी' : 'EN'}</span>
            </button>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(prev => !prev)}
              aria-label="Collector Profile & Account Options"
              className="w-8 h-8 rounded-full bg-primary/15 hover:bg-primary/25 active:scale-95 flex items-center justify-center border border-primary/30 text-primary font-bold text-xs cursor-pointer shadow-2xs transition-all"
              title="Collector Profile & Role Switching"
            >
              👷‍♂️
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-2xl shadow-xl border border-outline-variant p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/60">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
                    👷‍♂️
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-xs text-on-surface">Ramesh Kumar</p>
                    <p className="text-[10px] text-secondary">Peenya Cluster 3 • Collector</p>
                    <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded mt-0.5">
                      KYC VERIFIED
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onSwitchRole) {
                        onSwitchRole();
                      } else if (onNavigate) {
                        onNavigate('welcome');
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold cursor-pointer transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>{safeLang === 'mr' ? 'लॉग आउट करा / भूमिका बदला' : (safeLang === 'hi' ? 'लॉग आउट करें / रोल बदलें' : 'Log Out / Switch Role')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 flex-grow w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-xl sm:text-2xl">
            {t.ledgerTitle}
          </h1>
          <button
            onClick={handleSpeakEarnings}
            aria-label="Play Audio Guidance"
            className="flex items-center gap-1 text-tertiary bg-tertiary-fixed/40 hover:bg-tertiary-fixed px-3 py-1.5 rounded-full border border-tertiary-fixed-dim transition-colors cursor-pointer text-xs font-bold"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary filled">volume_up</span>
            <span>{safeLang === 'mr' ? 'ऐका' : (safeLang === 'hi' ? 'सुनें' : 'Listen')}</span>
          </button>
        </div>

        {/* Summary Card */}
        <section className="bg-surface rounded-xl shadow-md border border-outline-variant p-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md relative overflow-hidden p-5">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
          </div>
          <div className="z-10">
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xs text-xs text-secondary font-semibold uppercase tracking-wider">
              {earnings.monthName} ({t.settledBadge})
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
              {t.pendingDuesLabel} <strong className="text-amber-700 font-bold">₹{earnings.pendingDues.toLocaleString('en-IN')}</strong>
            </p>
          </div>
          <div className="z-10 flex gap-sm mt-2 md:mt-0">
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 font-label-lg text-xs rounded-lg px-4 py-2.5 flex items-center justify-center font-bold">
              {t.cashGuaranteeBadge}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Transactions List */}
          <div className="md:col-span-2 space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h3 className="font-headline-md text-headline-md font-bold text-base">{t.recentTransactions}</h3>
              <span className="text-tertiary font-label-md text-xs font-semibold">{t.liveAuditTrail}</span>
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
                      <p className="truncate text-secondary text-xs">{tx.dealer || tx.recycler}</p>
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
                        <span>{tx.isPaid ? t.statusPaid : t.statusPending}</span>
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
              {t.materialBreakdown}
            </h3>
            <div className="grid grid-cols-2 gap-sm">
              {earnings.breakdown.map((item) => (
                <div
                  key={item.nameKey || item.defaultName}
                  className="bg-surface rounded-lg p-md border border-outline-variant shadow-sm flex flex-col justify-between h-28 p-3"
                >
                  <div className="flex items-start justify-between">
                    <span className={`material-symbols-outlined ${item.color} bg-primary-container/10 p-1 rounded-md text-[20px]`}>
                      {item.icon}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-xs font-bold">{item.pct}</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant text-xs text-secondary truncate">
                      {t.categories[item.nameKey] || item.defaultName}
                    </p>
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
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer transition-colors ${
            activeScreen === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'home' ? 'filled' : ''}`}>home</span>
          <span className="font-label-md text-xs mt-1">{t.navHome}</span>
        </button>
        <button
          onClick={() => onNavigate('my_lots')}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer transition-colors ${
            activeScreen === 'my_lots' ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'my_lots' ? 'filled' : ''}`}>inventory_2</span>
          <span className="font-label-md text-xs mt-1">{t.navMyLots}</span>
        </button>
        <button
          onClick={() => onNavigate('earnings')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
            activeScreen === 'earnings' ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90' : 'p-2 text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'earnings' ? 'filled' : ''}`}>payments</span>
          <span className="font-label-md text-xs font-bold mt-1">{t.navEarnings}</span>
        </button>
        <button
          onClick={() => onNavigate('safety')}
          className={`flex flex-col items-center justify-center p-2 cursor-pointer transition-colors ${
            activeScreen === 'safety' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className={`material-symbols-outlined ${activeScreen === 'safety' ? 'filled' : ''}`}>info</span>
          <span className="font-label-md text-xs mt-1">{t.navSafety}</span>
        </button>
      </nav>
    </div>
  );
}
