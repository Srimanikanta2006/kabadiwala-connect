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
      id: 'cpcb_mh_032',
      name: 'CBS EWaste Recycling Industries',
      statutoryRef: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032',
      cpcbNo: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/032',
      facilityType: 'Recycler',
      capacityMta: 2500,
      state: 'Maharashtra',
      distance: 4.23,
      rate: 275,
      pickup: true,
      topMatch: true,
      sourceDoc: 'CPCB Directory 2023'
    },
    {
      id: 'cpcb_mh_069',
      name: 'Navkar Recycling Unit',
      statutoryRef: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/069',
      cpcbNo: 'Maharashtra Pollution Control Board (MPCB) - Reg #MH/E-WASTE/069',
      facilityType: 'Recycler',
      capacityMta: 1000,
      state: 'Maharashtra',
      distance: 4.23,
      rate: 264,
      pickup: false,
      topMatch: false,
      sourceDoc: 'CPCB Directory 2023'
    }
  ]);

  // Query backend recycler matching endpoint for genuine CPCB facilities
  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`http://localhost:8000/match-recyclers?material_id=${materialId}&weight=${weight}&lat=19.0434&lng=72.8576`);
        if (res.ok) {
          const data = await res.json();
          const matches = data.ranked_recyclers || data.matches || data.recommendations;
          if (matches && matches.length > 0) {
            setOffers(matches.slice(0, 4).map((rec, idx) => ({
              id: rec.recycler_id,
              name: rec.facility_name,
              statutoryRef: rec.statutory_reference || rec.cpcb_reg_no,
              cpcbNo: rec.statutory_reference || rec.cpcb_reg_no,
              facilityType: rec.facility_type || 'Authorised Facility',
              capacityMta: rec.installed_capacity_mta || 300,
              state: rec.state_or_ut || 'Maharashtra',
              address: rec.address || '',
              distance: rec.distance_km != null ? Number(rec.distance_km.toFixed(2)) : (idx === 0 ? 4.23 : 5.8),
              rate: Math.round(rec.offered_rate_per_kg || 264),
              pickup: rec.pickup_available ?? true,
              topMatch: idx === 0,
              sourceDoc: rec.source_document ? 'CPCB Directory 2023' : 'Government Authorized'
            })));
          }
        }
      } catch (err) {
        console.log('Using local CPCB authorized recycler offers', err);
      }
    }
    fetchMatches();
  }, [materialId, weight]);

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
      ? `${weight} किलो ${materialTitle}. सर्वोत्तम अधिकृत केंद्र: ${topOffer.name}, प्रकार: ${topOffer.facilityType}, दर ${topOffer.rate} रुपये प्रति किलो, एकूण ₹${Math.round(weight * topOffer.rate)}.`
      : `${weight} किलो ${materialTitle}। सर्वश्रेष्ठ अधिकृत केंद्र: ${topOffer.name}, प्रकार: ${topOffer.facilityType}, भाव ₹${topOffer.rate} प्रति किलो, कुल ₹${Math.round(weight * topOffer.rate)}।`;
    speakText(speech);
  };

  const handleAccept = (offer) => {
    const totalEst = Math.round(weight * offer.rate);
    onAcceptOffer({
      ...lotDraft,
      acceptedRecycler: {
        id: offer.id,
        name: offer.name,
        statutoryRef: offer.statutoryRef,
        cpcbNo: offer.cpcbNo,
        facilityType: offer.facilityType,
        capacityMta: offer.capacityMta,
        state: offer.state,
        distance: offer.distance,
        sourceDoc: offer.sourceDoc
      },
      recyclerId: offer.id,
      statutoryReference: offer.statutoryRef,
      cpcbRegistrationNo: offer.cpcbNo,
      facilityType: offer.facilityType,
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
            <p className="font-label-md text-secondary uppercase tracking-wider text-xs font-bold">Government-Authorised Buyer Quotes</p>
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
              <h3 className="font-headline-md text-on-surface font-bold text-base sm:text-lg">Authorised Facility Bids</h3>
              <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/20">
                {offers.length} Authorised Facilities Matched
              </span>
            </div>

            {/* Recycler Cards List */}
            {offers.map((offer, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={offer.id || idx}
                  className={`bg-surface rounded-2xl p-5 relative overflow-hidden transition-all ${
                    isTop ? 'border-2 border-primary shadow-md' : 'border border-outline-variant shadow-sm'
                  }`}
                >
                  {isTop && (
                    <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-md text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                      TOP MCDA MATCH
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2 pr-16">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-on-surface text-base sm:text-lg">{offer.name}</h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] filled">verified</span>
                          Authorised Facility (Source: CPCB Directory 2023)
                        </span>
                      </div>
                      <p className="text-on-surface-variant flex items-center gap-1 text-xs">
                        <span className="material-symbols-outlined text-[15px]">location_on</span>
                        <span>{offer.distance} km away • {offer.state}</span>
                        {offer.pickup && <span className="ml-1 text-primary font-semibold">• Vehicle Pickup Available</span>}
                      </p>
                    </div>
                  </div>

                  {/* Statutory Credentials Banner */}
                  <div className="mb-3 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-secondary">
                      <span><strong>Facility Type:</strong> <span className="text-on-surface font-semibold">{offer.facilityType}</span></span>
                      <span><strong>Capacity:</strong> <span className="text-on-surface font-semibold">{offer.capacityMta?.toLocaleString('en-IN')} MTA</span></span>
                    </div>
                    <div className="text-secondary font-mono text-[10px] truncate" title={offer.statutoryRef}>
                      <strong>Ref:</strong> {offer.statutoryRef}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                    <div>
                      <p className="text-secondary text-xs font-semibold">Offer Unit Rate</p>
                      <p className="text-primary font-extrabold text-2xl font-mono">
                        ₹{offer.rate} <span className="text-xs font-normal text-on-surface-variant">/kg</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-secondary text-xs font-semibold">Total Handover Payout</p>
                      <p className="text-on-surface font-extrabold text-2xl font-mono">
                        ₹{Math.round(weight * offer.rate).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccept(offer)}
                    className={`w-full h-12 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm sm:text-base cursor-pointer active:scale-[0.99] ${
                      isTop
                        ? 'bg-primary text-on-primary shadow-md hover:bg-primary-container'
                        : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40'
                    }`}
                  >
                    <span>Accept &amp; Generate QR Pass</span>
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </button>
                </div>
              );
            })}
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
