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
            onClick={() => onNavigate('ai_scan')}
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
      <main className="flex-grow px-margin-mobile py-lg max-w-2xl mx-auto w-full flex flex-col gap-lg">
        {/* Context Header */}
        <div className="flex items-center justify-between mb-sm">
          <div>
            <p className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-xs text-xs font-semibold">Lot Details</p>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-bold text-xl">
              {weight}kg • {materialTitle}
            </h2>
          </div>
          <button
            onClick={handleSpeakOffers}
            aria-label="Play Audio Guidance"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors shadow-sm border border-tertiary-fixed-dim cursor-pointer"
          >
            <span className="material-symbols-outlined filled">volume_up</span>
          </button>
        </div>

        {/* Valuation Card */}
        <div className="bg-primary-container text-on-primary-container rounded-xl p-lg shadow-md border border-outline-variant relative overflow-hidden flex flex-col items-center justify-center text-center py-6">
          <p className="font-body-lg text-body-lg mb-2 z-10 font-medium">Estimated Lot Value</p>
          <p className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-primary-container font-extrabold z-10 tracking-tight text-3xl md:text-4xl">
            ₹{Math.round(weight * 700).toLocaleString('en-IN')} - ₹{Math.round(weight * 780).toLocaleString('en-IN')}
          </p>
          <p className="font-label-md text-label-md mt-sm z-10 opacity-90 flex items-center gap-1 text-xs">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Based on current market rates (₹700-₹780/kg)
          </p>
        </div>

        {/* Recycler Matches Section */}
        <div className="flex flex-col gap-md mt-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Nearby Recycler Offers</h3>
            <span className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-3 py-1 rounded-full font-bold">
              {offers.length} Found
            </span>
          </div>

          {/* Recycler Option A (Top Choice) */}
          <div className="bg-surface rounded-xl border border-outline-variant shadow-md p-md relative overflow-hidden ring-2 ring-primary">
            <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-md text-[11px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
              TOP MATCH
            </div>
            <div className="flex justify-between items-start mb-md pr-16">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-base">{offers[0].name}</h4>
                  <span className="material-symbols-outlined text-primary text-[20px] filled" title="Authorized Recycler">verified</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 text-xs">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {offers[0].distance}km away • Authorized E-Waste Handler
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-lg bg-surface-container-low p-sm rounded-lg border border-surface-variant p-3 my-2">
              <div>
                <p className="font-label-md text-label-md text-secondary text-xs">Offer Price</p>
                <p className="font-action-xl text-action-xl text-primary font-bold text-xl">
                  ₹{offers[0].rate} <span className="font-body-md text-xs font-normal text-on-surface-variant">/kg</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-label-md text-label-md text-secondary text-xs">Total Est.</p>
                <p className="font-headline-md text-headline-md text-on-surface font-extrabold text-xl">
                  ₹{Math.round(weight * offers[0].rate).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAccept(offers[0])}
              className="w-full h-touch-target-min bg-primary text-on-primary font-action-xl text-action-xl rounded-lg shadow-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer"
            >
              <span>Accept Offer</span>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </button>
          </div>

          {/* Recycler Option B (Alternative) */}
          {offers[1] && (
            <div className="bg-surface rounded-xl border border-outline-variant shadow-sm p-md">
              <div className="flex justify-between items-start mb-md">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-base">{offers[1].name}</h4>
                    <span className="material-symbols-outlined text-primary text-[20px] filled" title="Authorized Recycler">verified</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-1 text-xs">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {offers[1].distance}km away
                  </p>
                  <span className="inline-flex items-center gap-1 bg-tertiary-container text-on-tertiary-container font-label-md text-[11px] px-2 py-0.5 rounded-full mt-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px] filled">local_shipping</span>
                    Pickup Available
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-md bg-surface-container-low p-sm rounded-lg border border-surface-variant p-3 my-2">
                <div>
                  <p className="font-label-md text-label-md text-secondary text-xs">Offer Price</p>
                  <p className="font-action-xl text-action-xl text-on-surface font-bold text-xl">
                    ₹{offers[1].rate} <span className="font-body-md text-xs font-normal text-on-surface-variant">/kg</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-label-md text-label-md text-secondary text-xs">Total Est.</p>
                  <p className="font-headline-md text-headline-md text-on-surface font-extrabold text-xl">
                    ₹{Math.round(weight * offers[1].rate).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleAccept(offers[1])}
                className="w-full h-touch-target-min bg-surface-container border border-outline text-on-surface font-label-lg rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center font-bold cursor-pointer"
              >
                Accept Offer
              </button>
            </div>
          )}
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
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
