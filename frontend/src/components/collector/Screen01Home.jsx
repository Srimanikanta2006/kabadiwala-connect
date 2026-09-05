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
      <header className="bg-surface dark:bg-on-background w-full sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-margin-mobile h-touch-target-min border-b border-outline-variant dark:border-outline">
          <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container rounded-full p-1 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-outline-variant text-primary font-bold text-sm">
              👷‍♂️
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim leading-none">RE:LINK</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Role / Portal Switcher */}
            {onSwitchRole && (
              <button
                onClick={onSwitchRole}
                aria-label="Switch Portal"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant border border-primary/30 hover:bg-primary-fixed transition-colors text-xs font-semibold cursor-pointer"
                title="Switch Portal or Role"
              >
                <span className="material-symbols-outlined text-[16px]">domain</span>
                <span className="hidden sm:inline">Recycler</span>
              </button>
            )}

            {/* Language Picker */}
            <button
              onClick={onLanguageChange}
              aria-label="Switch Language"
              className="flex items-center gap-xs px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-label-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-primary">language</span>
              <span className="font-semibold">{currentLang === 'hi' ? 'हिन्दी' : (currentLang === 'mr' ? 'मराठी' : 'English')}</span>
            </button>
            {/* Cloud Sync Status */}
            <div
              className={`flex items-center gap-xs px-2.5 py-1 rounded-full border text-xs font-label-md ${
                syncStatus.isOnline
                  ? 'bg-surface-container-low border-outline-variant text-primary'
                  : 'bg-amber-100 border-amber-300 text-amber-900'
              }`}
              title="Cloud Sync Status"
            >
              <span className="material-symbols-outlined text-base filled">
                {syncStatus.isOnline ? 'cloud_done' : 'cloud_off'}
              </span>
              <span className="font-bold">
                {syncStatus.isOnline ? 'Synced' : `${syncStatus.unsyncedCount || 1} offline`}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-margin-mobile pt-lg pb-xl max-w-3xl mx-auto space-y-xl">
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
        </section>

        {/* Recent Lots */}
        <section className="space-y-md">
          <div className="flex items-center gap-xs">
            <h2 className="font-headline-md text-headline-md text-on-background font-bold text-lg">Recent Lots</h2>
            <button
              onClick={() => speakText('हाल ही के लॉट्स: लॉट 8402, 42 किलो सर्किट बोर्ड, अनुमानित मूल्य 9450 रुपये')}
              aria-label="Play audio instruction for recent lots"
              className="w-8 h-8 rounded-full flex items-center justify-center text-tertiary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-tertiary">volume_up</span>
            </button>
          </div>
          <div className="space-y-sm">
            {recentLots.length > 0 ? (
              recentLots.map((lot, idx) => (
                <div
                  key={lot.id || idx}
                  onClick={() => onSelectLot && onSelectLot(lot)}
                  className="bg-surface rounded-lg p-md border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between gap-sm active:bg-surface-container-low transition-colors cursor-pointer hover:border-primary"
                >
                  <div className="flex gap-md items-start">
                    <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-background font-bold">
                        Lot #{String(lot.id || idx + 8400).slice(-4)}
                      </h3>
                      <p className="font-body-md text-body-md text-secondary text-xs">
                        {lot.material_category || 'Mixed Scrap'} • {lot.approximate_weight || 12}kg
                      </p>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-tertiary-container/20 border border-tertiary-container/30">
                        <span className="w-2 h-2 rounded-full bg-tertiary mr-1.5"></span>
                        <span className="font-label-md text-label-md text-on-tertiary-container text-xs font-semibold">
                          {lot.status === 'CONFIRMED' || lot.status === 'HANDED_OVER' ? 'Handover Confirmed' : 'Offer Received'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant pt-2 sm:pt-0 mt-2 sm:mt-0">
                    <span className="font-body-md text-body-md text-secondary sm:hidden text-xs">Est. Value</span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">
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
                  className="bg-surface rounded-lg p-md border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between gap-sm active:bg-surface-container-low transition-colors cursor-pointer hover:border-primary"
                >
                  <div className="flex gap-md items-start">
                    <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-background font-bold">Lot #8402</h3>
                      <p className="font-body-md text-body-md text-secondary text-xs">Mixed PCB &amp; Cables • 42kg</p>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-tertiary-container/20 border border-tertiary-container/30">
                        <span className="w-2 h-2 rounded-full bg-tertiary mr-1.5"></span>
                        <span className="font-label-md text-label-md text-on-tertiary-container text-xs font-semibold">Offer Received</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant pt-2 sm:pt-0 mt-2 sm:mt-0">
                    <span className="font-body-md text-body-md text-secondary sm:hidden text-xs">Est. Value</span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">~₹9,450</span>
                  </div>
                </div>

                {/* Seed Lot 2 */}
                <div
                  onClick={() => onNavigate('receipt')}
                  className="bg-surface rounded-lg p-md border border-outline-variant shadow-sm flex flex-col sm:flex-row justify-between gap-sm active:bg-surface-container-low transition-colors cursor-pointer opacity-85 hover:border-primary"
                >
                  <div className="flex gap-md items-start">
                    <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary">inventory_2</span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-background font-bold">Lot #8399</h3>
                      <p className="font-body-md text-body-md text-secondary text-xs">CRT Monitors • 115kg</p>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-surface-container-high border border-outline-variant">
                        <span className="w-2 h-2 rounded-full bg-secondary mr-1.5"></span>
                        <span className="font-label-md text-label-md text-secondary text-xs font-semibold">Pending Verification</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-outline-variant pt-2 sm:pt-0 mt-2 sm:mt-0">
                    <span className="font-body-md text-body-md text-secondary sm:hidden text-xs">Est. Value</span>
                    <span className="font-headline-md text-headline-md text-on-background font-bold">~₹3,200</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
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
          onClick={() => onNavigate('ai_scan')}
          aria-label="Sell / Lots"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[64px] text-on-surface-variant hover:bg-surface-container-low rounded-lg p-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-md text-label-md mt-1 text-xs">Sell / Lots</span>
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
