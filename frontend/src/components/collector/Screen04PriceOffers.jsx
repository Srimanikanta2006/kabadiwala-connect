import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Screen04PriceOffers({
  lotDraft,
  onAcceptOffer,
  onNavigate,
  syncStatus = { isOnline: true }
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const weight = lotDraft.weight || 12;
  const materialTitle = lotDraft.materialTitle || 'Printed Circuit Boards (PCB)';
  const materialId = lotDraft.materialId || 'mat_pcb_high';

  const [offers, setOffers] = useState([
    {
      id: 'rec_ecorecycle_01',
      name: 'EcoRecycle India Pvt Ltd',
      cpcbNo: 'CPCB/E-WASTE/REG/MH/2023/1042',
      distance: 1.97,
      rate: 780,
      pickup: true,
      topMatch: true
    },
    {
      id: 'rec_greencircle_02',
      name: 'GreenCircle Urban Recyclers',
      cpcbNo: 'CPCB/E-WASTE/REG/MH/2022/0891',
      distance: 3.42,
      rate: 750,
      pickup: true,
      topMatch: false
    }
  ]);

  // Query backend recycler matching endpoint if available
  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`http://localhost:8000/match-recyclers?material_id=${materialId}&lat=19.0434&lng=72.8576`);
        if (res.ok) {
          const data = await res.json();
          const matches = data.ranked_recyclers || data.matches || data.recommendations;
          if (matches && matches.length >= 2) {
            setOffers(matches.slice(0, 2).map((rec, idx) => ({
              id: rec.recycler_id,
              name: rec.facility_name,
              cpcbNo: rec.cpcb_reg_no || 'CPCB/E-WASTE/REG/MH/2023/1042',
              distance: rec.distance_km != null ? Number(rec.distance_km.toFixed(2)) : (idx === 0 ? 1.97 : 3.42),
              rate: rec.offered_rate_per_kg || (idx === 0 ? 780 : 750),
              pickup: rec.pickup_available ?? true,
              topMatch: idx === 0
            })));
          }
        }
      } catch (err) {
        console.log('Using local recycler offers');
      }
    }
    fetchMatches();
  }, [materialId]);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakOffers = () => {
    const topOffer = offers[0];
    const speech = currentLang === 'mr'
      ? `${weight} किलो ${materialTitle}. सर्वोत्तम ऑफर: ${topOffer.name}, दर ${topOffer.rate} रुपये प्रति किलो, एकूण ₹${Math.round(weight * topOffer.rate)}.`
      : `${weight} किलो ${materialTitle}। सर्वश्रेष्ठ ऑफर: ${topOffer.name}, भाव ₹${topOffer.rate} प्रति किलो, कुल ₹${Math.round(weight * topOffer.rate)}।`;
    speakText(speech);
  };

  const handleAccept = (offer) => {
    const totalEst = Math.round(weight * offer.rate);
    onAcceptOffer({
      ...lotDraft,
      acceptedRecycler: offer,
      agreedRate: offer.rate,
      totalEst,
      weight,
      materialTitle,
      materialId
    });
    onNavigate('receipt');
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen flex flex-col pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="docked full-width top-0 border-b border-outline-variant bg-surface text-primary flex justify-between items-center w-full px-margin-mobile h-touch-target-min z-40 sticky">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('lot_summary')}
            aria-label="Back"
            className="flex items-center justify-center w-touch-target-min h-touch-target-min hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">RE:LINK</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant text-xs text-primary font-medium">
            <span className="material-symbols-outlined text-[16px] filled">cloud_done</span>
            <span>{syncStatus.isOnline ? 'Synced' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Context Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-md text-secondary uppercase tracking-wider text-xs font-bold">Competitive Recycler Bids</p>
            <h2 className="text-xl sm:text-2xl text-on-background font-extrabold">
              {weight}kg • {materialTitle}
            </h2>
          </div>
          <button
            onClick={handleSpeakOffers}
            aria-label="Play Audio Guidance"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors shadow-sm border border-tertiary-fixed-dim cursor-pointer"
          >
            <span className="material-symbols-outlined filled text-[22px]">volume_up</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Recycler Offers (md:col-span-7) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-on-surface font-bold text-base sm:text-lg">Authorized Buyer Quotes</h3>
              <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/20">
                {offers.length} Bids Active
              </span>
            </div>

            {/* Recycler Option A (Top Choice) */}
            <div className="bg-surface rounded-2xl border-2 border-primary shadow-md p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-md text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                HIGHEST BIDDER
              </div>
              <div className="flex justify-between items-start mb-3 pr-20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-on-surface text-base sm:text-lg">{offers[0].name}</h4>
                    <span className="material-symbols-outlined text-primary text-[20px] filled" title="Authorized Recycler">verified</span>
                  </div>
                  <p className="text-on-surface-variant flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {offers[0].distance}km away • CPCB Tier-1 Ecoreco Facility
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                <div>
                  <p className="text-secondary text-xs font-semibold">Offer Unit Rate</p>
                  <p className="text-primary font-extrabold text-2xl font-mono">
                    ₹{offers[0].rate} <span className="text-xs font-normal text-on-surface-variant">/kg</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-secondary text-xs font-semibold">Total Handover Payout</p>
                  <p className="text-on-surface font-extrabold text-2xl font-mono">
                    ₹{Math.round(weight * offers[0].rate).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleAccept(offers[0])}
                className="w-full h-12 bg-primary text-on-primary rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 font-bold text-sm sm:text-base cursor-pointer active:scale-[0.99]"
              >
                <span>Accept &amp; Generate QR Pass</span>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </button>
            </div>

            {/* Recycler Option B (Alternative) */}
            {offers[1] && (
              <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-on-surface text-base">{offers[1].name}</h4>
                      <span className="material-symbols-outlined text-primary text-[18px] filled" title="Authorized Recycler">verified</span>
                    </div>
                    <p className="text-on-surface-variant flex items-center gap-1 text-xs">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {offers[1].distance}km away • Doorstep Van Available
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                  <div>
                    <p className="text-secondary text-xs">Offer Rate</p>
                    <p className="text-on-surface font-bold text-xl font-mono">
                      ₹{offers[1].rate} <span className="text-xs font-normal text-on-surface-variant">/kg</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary text-xs">Total Est.</p>
                    <p className="text-on-surface font-bold text-xl font-mono">
                      ₹{Math.round(weight * offers[1].rate).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAccept(offers[1])}
                  className="w-full h-11 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center transition-colors cursor-pointer border border-outline-variant/40"
                >
                  Accept Alternative Bid
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Mandi Valuation & Buyer Trust (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            {/* Valuation Card */}
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-5 sm:p-6 shadow-md border border-outline-variant relative overflow-hidden flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-on-primary-container/80">Fair Mandi Valuation Band</p>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                ₹{Math.round(weight * 700).toLocaleString('en-IN')} – ₹{Math.round(weight * 780).toLocaleString('en-IN')}
              </p>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Calculated for {weight}kg at ₹700 – ₹780/kg
              </p>
            </div>

            {/* Recycler Guarantee Card */}
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm space-y-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-on-surface block">Settlement Guarantees</span>
              <div className="space-y-2 text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span><strong>Scale Weighbridge:</strong> Calibrated electronic scale with printed slip.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">payments</span>
                  <span><strong>Instant Payment:</strong> 100% Cash in hand or immediate UPI bank transfer.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                  <span><strong>Statutory Form-6:</strong> Complete CPCB regulatory protection from illegal dumping liabilities.</span>
                </div>
              </div>
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
        <button onClick={() => onNavigate('ai_scan')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
          <span className="material-symbols-outlined filled">inventory_2</span>
          <span className="font-label-md text-xs font-bold mt-1">Sell / Lots</span>
        </button>
        <button onClick={() => onNavigate('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-xs mt-1">Earnings</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">Safety</span>
        </button>
      </nav>
    </div>
  );
}
