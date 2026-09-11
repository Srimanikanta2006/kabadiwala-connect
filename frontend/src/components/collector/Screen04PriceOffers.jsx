import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const OFFERS_TRANSLATIONS = {
  hi: {
    govQuotes: 'सरकारी मान्यता प्राप्त खरीदार दरें',
    authorisedBids: 'अधिकृत रीसाइक्लर बोलियां',
    facilitiesMatched: 'अधिकृत केंद्र उपलब्ध',
    matchingRecyclers: 'अधिकृत रीसाइक्लर केंद्र खोज रहे हैं...',
    bestValue: '⭐ सर्वोत्तम भाव एवं निकटतम',
    authorisedFacility: 'अधिकृत केंद्र (सीपीसीबी 2023 सूची)',
    away: 'किमी दूर',
    freePickup: '• 🚚 निःशुल्क वाहन पिकअप (गाड़ी आएगी)',
    selfDropoff: '• 🏭 स्वयं केंद्र पर जमा करें',
    facilityType: 'केंद्र प्रकार:',
    capacity: 'वार्षिक क्षमता:',
    ref: 'पंजीकरण:',
    offerUnitRate: 'प्रस्तावित दर',
    totalHandoverPayout: 'कुल हस्तांतरण भुगतान',
    acceptVoucher: 'पर्ची बनाएं • Accept & Generate Cash Voucher',
    mandiBand: 'सरकारी मंडी भाव सीमा',
    calculatedFor: 'हेतु सीपीसीबी दर सूचकांक पर परिकलित',
    settlementGuarantees: 'भुगतान एवं वजन गारंटी',
    scaleWeighbridge: 'कांटा तौल:',
    scaleWeighbridgeDesc: 'प्रमाणित इलेक्ट्रॉनिक वजनकांटा एवं मुद्रित पर्ची।',
    instantPayment: 'तुरंत भुगतान:',
    instantPaymentDesc: '100% नकद हाथ में या तुरंत UPI बैंक ट्रांसफर।',
    statutoryForm6: 'सीपीसीबी फॉर्म-6:',
    statutoryForm6Desc: 'अवैध डंपिंग के जोखिम से पूर्ण कानूनी सुरक्षा।',
    navHome: 'होम',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  mr: {
    govQuotes: 'शासकीय मान्यताप्राप्त खरेदीदार दर',
    authorisedBids: 'अधिकृत रीसायकलर्सचे थेट भाव',
    facilitiesMatched: 'अधिकृत केंद्र उपलब्ध',
    matchingRecyclers: 'अधिकृत रीसायकलर्स शोधत आहोत...',
    bestValue: '⭐ सर्वोत्तम दर आणि सर्वात जवळ',
    authorisedFacility: 'अधिकृत केंद्र (सीपीसीबी सूची)',
    away: 'किमी अंतरावर',
    freePickup: '• 🚚 मोफत गाडी पिकअप (गाडी येईल)',
    selfDropoff: '• 🏭 स्वतः केंद्रावर जमा करा',
    facilityType: 'केंद्राचा प्रकार:',
    capacity: 'वार्षिक क्षमता:',
    ref: 'नोंदणी क्रमांक:',
    offerUnitRate: 'दिलेला दर',
    totalHandoverPayout: 'एकूण देयक रक्कम',
    acceptVoucher: 'पावती बनवा • Accept & Generate Cash Voucher',
    mandiBand: 'शासकीय हमीभाव श्रेणी',
    calculatedFor: 'साठी सीपीसीबी दर सूचीनुसार अंदाजित',
    settlementGuarantees: 'देयक व वजन हमी',
    scaleWeighbridge: 'वजनकाटा:',
    scaleWeighbridgeDesc: 'प्रमाणित इलेक्ट्रॉनिक काटा व छापील पावती.',
    instantPayment: 'तात्काळ देयक:',
    instantPaymentDesc: '100% रोख हातात किंवा थेट UPI बँक जमा.',
    statutoryForm6: 'सीपीसीबी फॉर्म-6:',
    statutoryForm6Desc: 'बेकायदेशीर डंपिंगच्या जबाबदारीपासून संपूर्ण कायदेशीर संरक्षण.',
    navHome: 'मुख्य',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  en: {
    govQuotes: 'Government-Authorised Buyer Quotes',
    authorisedBids: 'Authorised Facility Bids',
    facilitiesMatched: 'Authorised Facilities Matched',
    matchingRecyclers: 'Matching CPCB Authorized Recyclers...',
    bestValue: '⭐ BEST VALUE & PROXIMITY',
    authorisedFacility: 'Authorised Facility (Source: CPCB Directory 2023)',
    away: 'km away',
    freePickup: '• 🚚 Free Vehicle Pickup',
    selfDropoff: '• 🏭 Self Drop-off',
    facilityType: 'Facility Type:',
    capacity: 'Capacity:',
    ref: 'Ref:',
    offerUnitRate: 'Offer Unit Rate',
    totalHandoverPayout: 'Total Handover Payout',
    acceptVoucher: 'Accept & Generate Cash Voucher',
    mandiBand: 'Fair Mandi Valuation Band',
    calculatedFor: 'Calculated at CPCB Mandi Index',
    settlementGuarantees: 'Settlement Guarantees',
    scaleWeighbridge: 'Scale Weighbridge:',
    scaleWeighbridgeDesc: 'Calibrated electronic scale with printed slip.',
    instantPayment: 'Instant Payment:',
    instantPaymentDesc: '100% Cash in hand or immediate UPI bank transfer.',
    statutoryForm6: 'Statutory Form-6:',
    statutoryForm6Desc: 'Complete CPCB regulatory protection from illegal dumping liabilities.',
    navHome: 'Home',
    navMyLots: 'My Lots',
    navEarnings: 'Earnings',
    navSafety: 'Safety'
  }
};

export default function Screen04PriceOffers({
  lotDraft,
  onAcceptOffer,
  onNavigate,
  syncStatus = { isOnline: true },
  currentLang: propLang,
  onLanguageChange
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
  const t = OFFERS_TRANSLATIONS[safeLang] || OFFERS_TRANSLATIONS.hi;

  const unit = lotDraft.unit || 'kg';
  const weight = lotDraft.weight || (unit === 'piece' ? 5 : 12);
  const materialTitle = lotDraft.materialTitle || 'Printed Circuit Boards (PCB)';
  const materialId = lotDraft.materialId || 'mat_pcb_high';

  const getBaseRate = (matId, u) => {
    if (u === 'piece') {
      return matId === 'mat_pcb_high' ? 280 : (matId === 'mat_crt_monitor' ? 250 : (matId === 'mat_batteries_li_ion' ? 120 : (matId === 'mat_motors_magnets' ? 180 : 200)));
    }
    return matId === 'mat_pcb_high' ? 265 : (matId === 'mat_cables_copper' ? 385 : (matId === 'mat_batteries_li_ion' ? 190 : (matId === 'mat_batteries_lead' ? 88 : (matId === 'mat_motors_magnets' ? 145 : 105))));
  };

  const baseRate = getBaseRate(materialId, unit);
  const mandiLow = Math.round(weight * baseRate * 0.95);
  const mandiHigh = Math.round(weight * baseRate * 1.05);

  const [isLoading, setIsLoading] = useState(true);
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
      rate: unit === 'piece' ? 280 : 275,
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
      rate: unit === 'piece' ? 270 : 264,
      pickup: false,
      topMatch: false,
      sourceDoc: 'CPCB Directory 2023'
    }
  ]);

  // Query backend recycler matching endpoint for genuine CPCB facilities
  useEffect(() => {
    async function fetchMatches() {
      setIsLoading(true);
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
              rate: unit === 'piece' ? baseRate : Math.round(rec.offered_rate_per_kg || baseRate),
              pickup: rec.pickup_available ?? true,
              topMatch: idx === 0,
              sourceDoc: rec.source_document ? 'CPCB Directory 2023' : 'Government Authorized'
            })));
          }
        }
      } catch (err) {
        console.log('Using local CPCB authorized recycler offers', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatches();
  }, [materialId, weight, unit]);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = safeLang === 'mr' ? 'mr-IN' : (safeLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakOffers = () => {
    const topOffer = offers[0];
    const speech = safeLang === 'mr'
      ? `${weight} किलो ${materialTitle}. सर्वोत्तम अधिकृत केंद्र: ${topOffer.name}, प्रकार: ${topOffer.facilityType}, दर ${topOffer.rate} रुपये प्रति किलो, एकूण ₹${Math.round(weight * topOffer.rate)}.`
      : (safeLang === 'hi'
          ? `${weight} किलो ${materialTitle}। सर्वश्रेष्ठ अधिकृत केंद्र: ${topOffer.name}, प्रकार: ${topOffer.facilityType}, भाव ₹${topOffer.rate} प्रति किलो, कुल ₹${Math.round(weight * topOffer.rate)}।`
          : `Identified ${weight} kg ${materialTitle}. Best authorized recycler: ${topOffer.name}, offered rate ₹${topOffer.rate} per kg, estimated total payout ₹${Math.round(weight * topOffer.rate)}.`);
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
        <div className="flex items-center gap-2">
          {onLanguageChange && (
            <button
              onClick={onLanguageChange}
              className="flex items-center gap-1 h-9 px-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-bold cursor-pointer shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-primary">language</span>
              <span>{safeLang === 'hi' ? 'हिन्दी' : (safeLang === 'mr' ? 'मराठी' : 'EN')}</span>
            </button>
          )}
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
            <p className="font-label-md text-secondary uppercase tracking-wider text-xs font-bold">{t.govQuotes}</p>
            <h2 className="text-xl sm:text-2xl text-on-background font-extrabold">
              {weight}{unit === 'piece' ? (safeLang === 'en' ? ' pcs' : ' नग') : (safeLang === 'hi' ? ' किग्रा' : (safeLang === 'mr' ? ' किलो' : ' kg'))} • {materialTitle}
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
              <h3 className="font-headline-md text-on-surface font-bold text-base sm:text-lg">{t.authorisedBids}</h3>
              <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/20">
                {offers.length} {t.facilitiesMatched}
              </span>
            </div>

            {/* Recycler Cards List or Loading Skeleton */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm animate-pulse space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-surface-container-high rounded w-2/3"></div>
                      <div className="h-4 bg-surface-container-high rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-surface-container-low rounded w-1/2"></div>
                    <div className="h-14 bg-surface-container-low rounded-xl"></div>
                    <div className="h-11 bg-primary/20 rounded-xl"></div>
                  </div>
                ))}
                <p className="text-center text-xs text-primary font-semibold flex items-center justify-center gap-1.5 pt-2">
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>{t.matchingRecyclers}</span>
                </p>
              </div>
            ) : (
              offers.map((offer, idx) => {
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
                        {t.bestValue}
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2 pr-16">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-on-surface text-base sm:text-lg">{offer.name}</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] filled">verified</span>
                            {t.authorisedFacility}
                          </span>
                        </div>
                        <p className="text-on-surface-variant flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[15px]">location_on</span>
                          <span>{offer.distance} {t.away} • {offer.state}</span>
                          {offer.pickup ? (
                            <span className="ml-1 text-emerald-700 font-bold">{t.freePickup}</span>
                          ) : (
                            <span className="ml-1 text-secondary font-medium">{t.selfDropoff}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Statutory Credentials Banner */}
                    <div className="mb-3 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-secondary">
                        <span><strong>{t.facilityType}</strong> <span className="text-on-surface font-semibold">{offer.facilityType}</span></span>
                        <span><strong>{t.capacity}</strong> <span className="text-on-surface font-semibold">{offer.capacityMta?.toLocaleString('en-IN')} MTA</span></span>
                      </div>
                      <div className="text-secondary font-mono text-[10px] truncate" title={offer.statutoryRef}>
                        <strong>{t.ref}</strong> {offer.statutoryRef}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                      <div>
                        <p className="text-secondary text-xs font-semibold">{t.offerUnitRate}</p>
                        <p className="text-primary font-extrabold text-2xl font-mono">
                          ₹{offer.rate} <span className="text-xs font-normal text-on-surface-variant">/{unit === 'piece' ? (safeLang === 'en' ? 'pc' : 'नग') : (safeLang === 'hi' ? 'किग्रा' : (safeLang === 'mr' ? 'किलो' : 'kg'))}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-secondary text-xs font-semibold">{t.totalHandoverPayout}</p>
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
                      <span>{t.acceptVoucher}</span>
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Mandi Valuation & Buyer Trust (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            {/* Valuation Card */}
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-5 sm:p-6 shadow-md border border-outline-variant relative overflow-hidden flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-on-primary-container/80">
                {t.mandiBand}
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                ₹{mandiLow.toLocaleString('en-IN')} – ₹{mandiHigh.toLocaleString('en-IN')}
              </p>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                {t.calculatedFor} {weight} {unit === 'piece' ? (safeLang === 'en' ? 'pcs' : 'नग') : (safeLang === 'hi' ? 'किग्रा' : (safeLang === 'mr' ? 'किलो' : 'kg'))} (~₹{baseRate}/{unit === 'piece' ? 'pc' : 'kg'})
              </p>
            </div>

            {/* Recycler Guarantee Card */}
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm space-y-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-on-surface block">{t.settlementGuarantees}</span>
              <div className="space-y-2 text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span><strong>{t.scaleWeighbridge}</strong> {t.scaleWeighbridgeDesc}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">payments</span>
                  <span><strong>{t.instantPayment}</strong> {t.instantPaymentDesc}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                  <span><strong>{t.statutoryForm6}</strong> {t.statutoryForm6Desc}</span>
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
          <span className="font-label-md text-xs mt-1">{t.navHome}</span>
        </button>
        <button onClick={() => onNavigate('ai_scan')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
          <span className="material-symbols-outlined filled">inventory_2</span>
          <span className="font-label-md text-xs font-bold mt-1">{t.navMyLots}</span>
        </button>
        <button onClick={() => onNavigate('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-xs mt-1">{t.navEarnings}</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">{t.navSafety}</span>
        </button>
      </nav>
    </div>
  );
}
