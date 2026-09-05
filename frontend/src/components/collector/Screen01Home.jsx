import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Screen01Home({
  onScanClick,
  onNavigate,
  onSelectLot,
  recentLots = [],
  syncStatus = { isOnline: true, unsyncedCount: 0 },
  onLanguageChange,
  onSwitchRole
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const [marketRates, setMarketRates] = useState([
    { id: 'mat_pcb_high', name: 'Circuit Boards', sub: 'A-Grade PCB', rate: 780, unit: 'kg', icon: 'memory', spoken: 'सर्किट बोर्ड का भाव 780 रुपये प्रति किलो है।' },
    { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire', rate: 420, unit: 'kg', icon: 'cable', spoken: 'तांबे के तार का भाव 420 रुपये प्रति किलो है।' },
    { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mixed lot', rate: 110, unit: 'kg', icon: 'battery_charging_full', spoken: 'लिथियम बैटरी का भाव 110 रुपये प्रति किलो है।' }
  ]);

  // Load live prices from backend if available
  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch('http://localhost:8000/prices/board?location=IN-MH-MUM');
        if (res.ok) {
          const data = await res.json();
          if (data.categories && data.categories.length >= 3) {
            setMarketRates([
              { id: 'mat_pcb_high', name: 'Circuit Boards', sub: 'A-Grade PCB', rate: data.categories[0].current_rate || 780, unit: 'kg', icon: 'memory', spoken: `सर्किट बोर्ड का भाव ${data.categories[0].current_rate || 780} रुपये प्रति किलो है।` },
              { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire', rate: data.categories[1].current_rate || 420, unit: 'kg', icon: 'cable', spoken: `तांबे के तार का भाव ${data.categories[1].current_rate || 420} रुपये प्रति किलो है।` },
              { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mixed lot', rate: data.categories[2].current_rate || 110, unit: 'kg', icon: 'battery_charging_full', spoken: `लिथियम बैटरी का भाव ${data.categories[2].current_rate || 110} रुपये प्रति किलो है।` }
            ]);
          }
        }
      } catch (err) {
        console.log('Using local market rates');
      }
    }
    loadPrices();
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

  const handleSpeakAllRates = () => {
    const summary = currentLang === 'mr'
      ? `आजचे बाजार दर: सर्किट बोर्ड ${marketRates[0].rate} रुपये, तांब्याची केबल ${marketRates[1].rate} रुपये, बॅटरी ${marketRates[2].rate} रुपये प्रति किलो.`
      : `आज के बाजार भाव: सर्किट बोर्ड ${marketRates[0].rate} रुपये, तांबे के तार ${marketRates[1].rate} रुपये, बैटरी ${marketRates[2].rate} रुपये प्रति किलो।`;
    speakText(summary);
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen pb-24 relative overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-on-background w-full sticky top-0 z-40 border-b border-outline-variant dark:border-outline">
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full px-4 sm:px-6 h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
              <span className="material-symbols-outlined text-[22px]">recycling</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-headline-md text-lg sm:text-xl font-bold text-primary dark:text-primary-fixed-dim">RE:LINK</span>
              <span className="text-[10px] text-primary/80 font-bold uppercase tracking-wider hidden sm:inline">Collector Mandi</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-outline-variant/40 text-xs font-semibold">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-full bg-primary text-on-primary shadow-sm font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] filled">home</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => onNavigate('my_lots')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              <span>My Lots</span>
            </button>
            <button
              onClick={onScanClick}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>AI Scan</span>
            </button>
            <button
              onClick={() => onNavigate('category_select')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Categories</span>
            </button>
            <button
              onClick={() => onNavigate('earnings')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">payments</span>
              <span>Earnings</span>
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="px-3 py-1.5 rounded-full text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
              <span>Safety</span>
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Role / Portal Switcher */}
            {onSwitchRole && (
              <button
                onClick={onSwitchRole}
                aria-label="Switch Portal"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant transition-colors text-xs font-semibold cursor-pointer"
                title="Switch Portal or Role"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">domain</span>
                <span className="hidden sm:inline">Recycler Portal</span>
              </button>
            )}

            {/* Language Picker */}
            <button
              onClick={onLanguageChange}
              aria-label="Switch Language"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-primary">language</span>
              <span>{currentLang === 'hi' ? 'हिन्दी' : (currentLang === 'mr' ? 'मराठी' : 'EN')}</span>
            </button>

            {/* Cloud Sync Status */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-semibold ${
                syncStatus.isOnline
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-amber-100 border-amber-300 text-amber-900'
              }`}
              title="Cloud Sync Status"
            >
              <span className="material-symbols-outlined text-[16px] filled">
                {syncStatus.isOnline ? 'cloud_done' : 'cloud_off'}
              </span>
              <span className="hidden sm:inline">
                {syncStatus.isOnline ? 'Live' : `${syncStatus.unsyncedCount || 1} offline`}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Primary Column (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
        {/* Primary CTA */}
        <section>
          <button
            onClick={onScanClick}
            className="w-full bg-primary hover:bg-primary-container text-on-primary min-h-[56px] py-3 rounded-xl flex flex-col items-center justify-center shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-sm font-action-xl text-action-xl font-bold text-lg sm:text-xl">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>photo_camera</span>
              <span>Scan &amp; Identify E-Waste</span>
            </div>
            <span className="text-xs text-on-primary/90 font-label-md mt-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-xs">auto_awesome</span> AI Camera Detection • तुरंत पहचानें
            </span>
          </button>
        </section>

        {/* Current Market Rates (Bento/Card Grid) */}
        <section className="space-y-md">
          <div className="flex items-center gap-xs">
            <h2 className="font-headline-md text-headline-md text-on-background font-bold text-lg">Current Market Rates</h2>
            <button
              onClick={handleSpeakAllRates}
              aria-label="Play audio instruction for current market rates"
              className="w-8 h-8 rounded-full flex items-center justify-center text-tertiary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-tertiary">volume_up</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-gutter-mobile">
            {/* PCB Card */}
            <div
              onClick={() => speakText(marketRates[0].spoken)}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary transition-all"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="flex flex-col gap-xs relative z-10">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant shadow-sm mb-sm">
                  <span className="material-symbols-outlined text-primary">memory</span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface-variant font-semibold">Circuit Boards</h3>
                <p className="font-body-md text-body-md text-secondary text-xs">A-Grade PCB</p>
                <p className="font-headline-md text-headline-md text-on-background mt-sm font-bold text-base">
                  ₹{marketRates[0].rate} <span className="font-body-md text-body-md text-secondary font-normal text-xs">/ kg</span>
                </p>
              </div>
            </div>

            {/* Cable Card */}
            <div
              onClick={() => speakText(marketRates[1].spoken)}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary transition-all"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="flex flex-col gap-xs relative z-10">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant shadow-sm mb-sm">
                  <span className="material-symbols-outlined text-primary">cable</span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface-variant font-semibold">Copper Cables</h3>
                <p className="font-body-md text-body-md text-secondary text-xs">Insulated Wire</p>
                <p className="font-headline-md text-headline-md text-on-background mt-sm font-bold text-base">
                  ₹{marketRates[1].rate} <span className="font-body-md text-body-md text-secondary font-normal text-xs">/ kg</span>
                </p>
              </div>
            </div>

            {/* Battery Card */}
            <div
              onClick={() => speakText(marketRates[2].spoken)}
              className="col-span-2 bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm relative overflow-hidden group flex justify-between items-center cursor-pointer hover:border-primary transition-all"
            >
              <div className="flex items-center gap-md relative z-10">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant shadow-sm">
                  <span className="material-symbols-outlined text-primary">battery_charging_full</span>
                </div>
                <div>
                  <h3 className="font-label-lg text-label-lg text-on-surface-variant font-semibold">Li-ion Batteries</h3>
                  <p className="font-body-md text-body-md text-secondary text-xs">Mixed lot</p>
                </div>
              </div>
              <p className="font-headline-md text-headline-md text-on-background text-right font-bold text-base">
                ₹{marketRates[2].rate} <span className="font-body-md text-body-md text-secondary text-xs">/ kg</span>
              </p>
            </div>
          </div>

          {/* Category Fast Shortcuts */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Fast Category Picker</span>
              <button
                onClick={() => onNavigate('category_select')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All 6 Categories</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onNavigate('category_select')}
                className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/50 hover:border-primary text-left transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">memory</span>
                <span className="text-xs font-medium truncate">PCBs</span>
              </button>
              <button
                onClick={() => onNavigate('category_select')}
                className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/50 hover:border-primary text-left transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">cable</span>
                <span className="text-xs font-medium truncate">Cables</span>
              </button>
              <button
                onClick={() => onNavigate('category_select')}
                className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/50 hover:border-primary text-left transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">battery_charging_full</span>
                <span className="text-xs font-medium truncate">Batteries</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Right / Companion Column (col-span-5) on Desktop / Tablet */}
      <div className="lg:col-span-5 space-y-6">
        {/* Live Mandi Intelligence & Trend Card */}
        <section className="bg-gradient-to-br from-primary/10 via-surface-container-low to-surface rounded-2xl p-5 border border-primary/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
              <h3 className="font-bold text-sm text-on-surface">Mandi Market Insights</h3>
            </div>
            <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              TODAY'S TRENDS
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">trending_up</span>
                <span className="font-medium">Copper Wires &amp; Cables</span>
              </div>
              <span className="font-bold text-emerald-700">+8.4% this week</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                <span className="font-medium">A-Grade Server PCBs</span>
              </div>
              <span className="font-bold text-primary">₹780/kg Peak</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[16px]">warning</span>
                <span className="font-medium">Swollen Li-ion Warning</span>
              </div>
              <span className="font-semibold text-amber-800">Must isolate</span>
            </div>
          </div>
        </section>

        {/* Recent Scrap Lots */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-xs">
              <h2 className="font-headline-md text-headline-md text-on-background font-bold text-base">Recent Field Lots</h2>
              <button
                onClick={() => speakText('हाल ही के लॉट्स: लॉट 8402, 42 किलो सर्किट बोर्ड, अनुमानित मूल्य 9450 रुपये')}
                aria-label="Play audio instruction for recent lots"
                className="w-7 h-7 rounded-full flex items-center justify-center text-tertiary hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">volume_up</span>
              </button>
            </div>
            <span className="text-xs text-secondary font-semibold">Offline Cached</span>
          </div>

          <div className="space-y-sm">
            {recentLots.length > 0 ? (
              recentLots.map((lot, idx) => (
                <div
                  key={lot.id || idx}
                  onClick={() => onSelectLot && onSelectLot(lot)}
                  className="bg-surface rounded-xl p-3 sm:p-4 border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between gap-sm active:bg-surface-container-low transition-colors cursor-pointer hover:border-primary"
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-secondary">
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-sm text-on-background font-bold">
                        Lot #{String(lot.id || idx + 8400).slice(-4)}
                      </h3>
                      <p className="font-body-md text-secondary text-xs">
                        {lot.material_category || 'Mixed Scrap'} • {lot.approximate_weight || 12}kg
                      </p>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-tertiary-container/15 border border-tertiary-container/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5"></span>
                        <span className="text-[11px] font-semibold text-on-tertiary-container">
                          {lot.status === 'CONFIRMED' || lot.status === 'HANDED_OVER' ? 'Handover Confirmed' : 'Offer Received'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant pt-2 sm:pt-0 mt-1 sm:mt-0">
                    <span className="text-xs text-secondary sm:hidden">Est. Value</span>
                    <span className="text-base text-primary font-bold">
                      ~₹{Math.round(lot.quoted_price || (lot.approximate_weight || 12) * 240)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Seed Lot 1 */}
                <div
                  onClick={() => onNavigate('receipt')}
                  className="bg-surface rounded-xl p-3 sm:p-4 border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between gap-sm active:bg-surface-container-low transition-colors cursor-pointer hover:border-primary"
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-secondary">
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-background">Lot #8402</h3>
                      <p className="text-xs text-secondary">Mixed PCB &amp; Cables • 42kg</p>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                        <span className="text-[11px] font-semibold text-primary">Offer Received</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant pt-2 sm:pt-0 mt-1 sm:mt-0">
                    <span className="text-xs text-secondary sm:hidden">Est. Value</span>
                    <span className="text-base text-primary font-bold">~₹9,450</span>
                  </div>
                </div>

                {/* Seed Lot 2 */}
                <div
                  onClick={() => onNavigate('receipt')}
                  className="bg-surface rounded-xl p-3 sm:p-4 border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between gap-sm active:bg-surface-container-low transition-colors cursor-pointer opacity-85 hover:border-primary"
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-secondary">
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-background">Lot #8399</h3>
                      <p className="text-xs text-secondary">CRT Monitors • 115kg</p>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-surface-container-high border border-outline-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                        <span className="text-[11px] font-semibold text-secondary">Pending Verification</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant pt-2 sm:pt-0 mt-1 sm:mt-0">
                    <span className="text-xs text-secondary sm:hidden">Est. Value</span>
                    <span className="text-base text-on-background font-bold">~₹3,200</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Nearby CPCB Recycler Network Status */}
        <section className="bg-surface rounded-2xl p-4 border border-outline-variant shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Verified Facilities in Area</span>
            <span className="text-xs text-emerald-700 font-bold">14 Active in 10km</span>
          </div>
          <p className="text-xs text-on-surface-variant">
            EcoRecycle MMR (3.2 km), GreenCircle Dharavi (1.8 km), and Cerebra MIDC (7.4 km) are actively quoting for high-grade PCBs and insulated copper cables today.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => onNavigate('offers')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Live Recycler Bids</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </main>

  {/* BottomNavBar (Mobile Viewport Only - Hidden on Desktop) */}
  <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Home"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] scale-95 transition-all cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1">
            <span className="material-symbols-outlined filled">home</span>
          </div>
          <span className="font-label-md text-label-md mt-1 text-primary font-bold text-xs">Home</span>
        </button>

        <button
          onClick={() => onNavigate('my_lots')}
          aria-label="My Lots"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] text-on-surface-variant hover:bg-surface-container-low rounded-lg p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-md text-label-md mt-1 text-xs">My Lots</span>
        </button>

        <button
          onClick={() => onNavigate('earnings')}
          aria-label="Earnings"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] text-on-surface-variant hover:bg-surface-container-low rounded-lg p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-label-md mt-1 text-xs">Earnings</span>
        </button>

        <button
          onClick={() => onNavigate('safety')}
          aria-label="Safety"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] text-on-surface-variant hover:bg-surface-container-low rounded-lg p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-label-md mt-1 text-xs">Safety</span>
        </button>
      </nav>
    </div>
  );
}
