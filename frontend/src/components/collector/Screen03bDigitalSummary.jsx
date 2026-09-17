import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SUMMARY_TRANSLATIONS = {
  hi: {
    digitalScrapLot: 'डिजिटल कबाड़ लॉट',
    pageTitle: 'लॉट सारांश एवं तात्कालिक भाव',
    verifiableRef: 'सत्यापनीय लॉट संदर्भ',
    readyForBids: 'भाव के लिए तैयार',
    items: 'घटक',
    item: 'घटक',
    consignmentItems: 'कंसाइनमेंट घटक',
    totalEquiv: 'कुल समतुल्य वजन',
    verified: 'सत्यापित',
    match: 'सटीकता',
    totalItems: 'कुल घटक',
    netWeight: 'शुद्ध वजन',
    quantity: 'मात्रा',
    condition: 'स्थिति',
    collectionHub: 'संग्रह केंद्र',
    addAnotherItem: '➕ और कबाड़ सामान जोड़ें • Add Another Item',
    envImpact: 'पर्यावरणीय प्रभाव',
    esgVerified: '100% पर्यावरण सुरक्षा',
    co2Saved: 'CO₂ उत्सर्जन की बचत',
    toxicsDiverted: 'जमीन से बचाए गए जहरीले पदार्थ',
    form6Assurance: 'सुरक्षित एवं वैध हस्तांतरण: पंजीकृत डीलर को प्रत्यक्ष बिक्री, तुरंत कांटा तौल व पूरी सुरक्षा।',
    estimatedMandiVal: 'अनुमानित मंडी मूल्य',
    liveMandiIndex: 'लाइव मंडी सूचकांक',
    calculatedAt: 'के भाव पर परिकलित',
    forVerifiedScrap: 'सत्यापित कबाड़ हेतु',
    recyclersReady: '14 अधिकृत स्क्रैप डीलर एवं यार्ड 10 किमी के भीतर',
    pickupReadiness: 'पिकअप तत्परता',
    highDemand: 'उच्च मांग',
    fastestBuyer: 'निकटतम अधिकृत डीलर:',
    averageHandover: 'औसत कांटा हस्तांतरण:',
    settlementGuarantee: 'भुगतान गारंटी:',
    guaranteeDetail: '100% नकद / UPI तुरंत कांटे पर',
    findOffers: 'पास के अधिकृत डीलर देखें (14 उपलब्ध)',
    saveDraftOffline: 'फ़ोन में ड्राफ्ट सहेजें (ऑफलाइन)',
    savedToOffline: 'ऑफ़लाइन कतार में सहेजा गया',
    navScan: 'स्कैन',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSupport: 'सुरक्षा'
  },
  mr: {
    digitalScrapLot: 'डिजिटल स्क्रॅप लॉट',
    pageTitle: 'लॉट तपशील व तात्काळ मूल्यांकन',
    verifiableRef: 'सत्यापित लॉट संदर्भ',
    readyForBids: 'बोलीसाठी तयार',
    items: 'घटक',
    item: 'घटक',
    consignmentItems: 'लॉटमधील एकूण घटक',
    totalEquiv: 'एकूण समतुल्य वजन',
    verified: 'सत्यापित',
    match: 'अचूकता',
    totalItems: 'एकूण घटक',
    netWeight: 'निव्वळ वजन',
    quantity: 'प्रमाण / संख्या',
    condition: 'स्थिती',
    collectionHub: 'संकलन केंद्र',
    addAnotherItem: '➕ आणि कबाड सामान जोडा • Add Another Item',
    envImpact: 'पर्यावरणीय प्रभाव',
    esgVerified: '100% पर्यावरणपूरक पुनर्वापर',
    co2Saved: 'CO₂ उत्सर्जनात बचत',
    toxicsDiverted: 'मातीचे प्रदूषण टाळलेले धातू',
    form6Assurance: 'सुरक्षित आणि कायदेशीर विक्री: नोंदणीकृत डीलरकडे कायदेशीर हस्तांतरण, थेट वजनकाटा व पूर्ण देयक.',
    estimatedMandiVal: 'अंदाजे बाजार हमीभाव',
    liveMandiIndex: 'थेट बाजार निर्देशांक',
    calculatedAt: 'या दराने अंदाजित',
    forVerifiedScrap: 'सत्यापित भंगारासाठी',
    recyclersReady: '14 अधिकृत स्क्रॅप डीलर्स व यार्ड 10 किमी परिसरात',
    pickupReadiness: 'पिकअप तत्परता',
    highDemand: 'मोठी मागणी',
    fastestBuyer: 'जवळचे अधिकृत डीलर:',
    averageHandover: 'काटा तपासणी वेळ:',
    settlementGuarantee: 'देयक हमी:',
    guaranteeDetail: '100% रोख / UPI तत्काळ वजनकाट्यावर',
    findOffers: 'जवळचे अधिकृत डीलर्स शोधा (14 उपलब्ध)',
    saveDraftOffline: 'फोनमध्ये मसुदा सेव्ह करा (ऑफलाइन)',
    savedToOffline: 'ऑफलाइन रांगेत जतन केले',
    navScan: 'स्कॅन',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSupport: 'सुरक्षा'
  },
  en: {
    digitalScrapLot: 'Digital Scrap Lot',
    pageTitle: 'Lot Summary & Instant Valuation',
    verifiableRef: 'Verifiable Lot Reference',
    readyForBids: 'Ready for Bids',
    items: 'Items',
    item: 'Item',
    consignmentItems: 'Consignment Items',
    totalEquiv: 'Total Equiv. Weight',
    verified: 'Verified',
    match: 'Match',
    totalItems: 'Total Items',
    netWeight: 'Net Weight',
    quantity: 'Quantity',
    condition: 'Condition',
    collectionHub: 'Collection Hub',
    addAnotherItem: '➕ Add Another Item to Lot',
    envImpact: 'Environmental Impact',
    esgVerified: 'Eco-Friendly Verified',
    co2Saved: 'CO₂ Emissions Saved',
    toxicsDiverted: 'Toxics Kept from Soil',
    form6Assurance: 'Safe & Legal Handover: Sold directly to verified licensed dealers. 100% legal, zero dispute or fraud.',
    estimatedMandiVal: 'Estimated Mandi Value',
    liveMandiIndex: 'Live Mandi Index',
    calculatedAt: 'Calculated at',
    forVerifiedScrap: 'for verified scrap',
    recyclersReady: '14 verified scrap dealers & yards nearby (< 10 km)',
    pickupReadiness: 'Pickup Readiness',
    highDemand: 'High Demand',
    fastestBuyer: 'Fastest Nearby Dealer:',
    averageHandover: 'Average Scale Handover:',
    settlementGuarantee: 'Settlement Guarantee:',
    guaranteeDetail: '100% Cash / UPI on scale',
    findOffers: 'Find Nearby Dealers (14 Available)',
    saveDraftOffline: 'Save Draft to Phone (Offline Queue)',
    savedToOffline: 'Saved to Offline Queue',
    navScan: 'Scan',
    navMyLots: 'My Lots',
    navEarnings: 'Earnings',
    navSupport: 'Safety'
  }
};

export default function Screen03bDigitalSummary({
  lotDraft = {},
  onNavigate,
  onNavigateBack,
  activeScreen = 'lot_summary',
  onSaveOffline,
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
  const t = SUMMARY_TRANSLATIONS[safeLang] || SUMMARY_TRANSLATIONS.hi;
  const [saveMessage, setSaveMessage] = useState(null);

  const unit = lotDraft?.unit || 'kg';
  const weight = lotDraft?.weight || (unit === 'piece' ? 5 : 12.0);
  const condition = lotDraft?.condition || 'Good / Intact';
  const confidence = lotDraft?.confidence || 92;
  const materialTitle = lotDraft?.materialTitle || 'Printed Circuit Board (PCB)';
  const materialSub = lotDraft?.materialSub || 'Grade A Telecom / Server Grade';
  const handoverRef = lotDraft?.handoverRef || `RL-MH-2026-00482`;

  // Dynamic baseline CPCB market rate lookup
  const getBaseRate = (matId, u) => {
    if (u === 'piece') {
      return matId === 'mat_pcb_high' ? 280 : (matId === 'mat_crt_monitor' ? 250 : (matId === 'mat_batteries_li_ion' ? 120 : (matId === 'mat_motors_magnets' ? 180 : 200)));
    }
    return matId === 'mat_pcb_high' ? 240 : (matId === 'mat_cables_copper' ? 380 : (matId === 'mat_batteries_li_ion' ? 185 : (matId === 'mat_batteries_lead' ? 88 : (matId === 'mat_motors_magnets' ? 145 : 105))));
  };

  const baseRate = getBaseRate(lotDraft?.materialId, unit);
  const conditionMult = condition.includes('Good') || condition.includes('Intact') ? 1.05 : (condition.includes('Damaged') ? 0.75 : 0.95);
  const baseVal = Math.round(weight * baseRate * conditionMult);

  // Multi-item consignment aggregation
  const items = (lotDraft?.items && lotDraft.items.length > 0)
    ? lotDraft.items
    : [{
        id: 'item_1',
        materialId: lotDraft?.materialId || 'mat_pcb_high',
        materialTitle,
        materialSub,
        weight,
        unit,
        condition,
        lowEst: lotDraft?.lowEst || Math.round(baseVal * 0.95),
        highEst: lotDraft?.highEst || Math.round(baseVal * 1.05)
      }];

  const totalLowEst = items.reduce((sum, item) => sum + (item.lowEst || Math.round((item.weight || 1) * getBaseRate(item.materialId, item.unit) * 0.95)), 0);
  const totalHighEst = items.reduce((sum, item) => sum + (item.highEst || Math.round((item.weight || 1) * getBaseRate(item.materialId, item.unit) * 1.05)), 0);
  
  // Total equivalent weight in kg for ESG environmental metrics
  const totalWeightKg = items.reduce((sum, item) => {
    const itemKg = item.unit === 'piece' ? (item.weight * 0.8) : item.weight;
    return sum + (Number(itemKg) || 0);
  }, 0);

  const co2AvoidedKg = (totalWeightKg * 1.45).toFixed(1);
  const toxicDivertedKg = (totalWeightKg * 0.08).toFixed(2);

  const handleSaveDraft = async () => {
    if (onSaveOffline) {
      await onSaveOffline({
        ...lotDraft,
        lowEst: totalLowEst,
        highEst: totalHighEst,
        handoverRef,
        items
      });
    }
    setSaveMessage(`✓ Saved to Offline Queue (#${handoverRef}) 💾`);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="collector-shell bg-background font-body-md text-on-surface antialiased min-h-screen pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[18px]">recycling</span>
            </div>
            <span className="font-headline-md text-base text-primary font-bold tracking-tight">RE:LINK</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLanguageChange ? onLanguageChange : () => {
                const nextLang = safeLang === 'hi' ? 'mr' : (safeLang === 'mr' ? 'en' : 'hi');
                i18n.changeLanguage(nextLang);
                localStorage.setItem('relink_lang', nextLang);
              }}
              className="flex items-center gap-1 h-8 px-2.5 bg-surface-container rounded-full text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-primary">language</span>
              <span>{safeLang === 'hi' ? 'हिन्दी' : (safeLang === 'mr' ? 'मराठी' : 'EN')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-4 px-4 sm:px-6 flex-1 max-w-5xl mx-auto space-y-6">
        {/* Back Nav & Title Bar */}
        <div className="flex items-center justify-between py-1">
          <button
            onClick={() => (onNavigateBack ? onNavigateBack() : onNavigate('home'))}
            aria-label="Go Back"
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center text-center">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              {t.digitalScrapLot}
            </span>
            <h1 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface leading-tight">
              {t.pageTitle}
            </h1>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Save Offline Banner Toast if triggered */}
        {saveMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-md animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {saveMessage}
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">{t.savedToOffline}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout on Desktop/Tablet */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Lot Identifier, Visual, Multi-Item List, Specs (md:col-span-7) */}
          <div className="md:col-span-7 space-y-4">
            {/* Prominent Lot Identifier Banner */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between border border-surface-container-high">
              <div className="flex flex-col">
                <span className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t.verifiableRef}
                </span>
                <span className="font-headline-md text-base sm:text-lg text-on-surface font-bold tracking-tight mt-0.5 font-mono text-primary">
                  #{handoverRef}
                </span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-md text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                {t.readyForBids} ({items.length} {items.length > 1 ? t.items : t.item})
              </span>
            </div>

            {/* Multi-Item Breakdown List if multi-item */}
            {items.length > 1 && (
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
                    {t.consignmentItems} ({items.length})
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {t.totalEquiv}: {totalWeightKg.toFixed(1)} kg
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={it.id || idx} className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs">
                      <div>
                        <p className="font-bold text-on-surface">{it.materialTitle}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          {it.weight} {it.unit === 'piece' ? (safeLang === 'en' ? 'pcs' : 'नग') : (safeLang === 'hi' ? 'किग्रा' : (safeLang === 'mr' ? 'किलो' : 'kg'))} • {it.condition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary font-mono">₹{it.lowEst?.toLocaleString('en-IN')} - ₹{it.highEst?.toLocaleString('en-IN')}</p>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">{t.verified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hero Visual & AI Card (Shows first/primary item) */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high">
              <div className="relative w-full h-56 sm:h-64 bg-surface-container overflow-hidden flex items-center justify-center">
                <img
                  alt={materialTitle}
                  className="w-full h-full object-cover"
                  src={lotDraft.photoUrl || '/assets/icons/pcb_high.svg'}
                />
                <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-on-surface text-xs font-bold flex items-center gap-1.5 shadow-sm border border-outline-variant/30">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {confidence}% {t.match}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-headline-md text-lg font-bold text-on-surface">{materialTitle}</h2>
                  <span className="font-body-md text-xs text-on-surface-variant">{materialSub}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">memory</span>
                </div>
              </div>
            </div>

            {/* Specs Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-lowest p-3.5 rounded-xl text-center border border-surface-container-high">
                <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">
                  {items.length > 1 ? t.totalItems : (unit === 'piece' ? t.quantity : t.netWeight)}
                </span>
                <span className="font-headline-md text-xl text-on-surface font-extrabold block">
                  {items.length > 1 ? `${items.length} ${t.items}` : weight}
                </span>
                <span className="font-body-md text-[11px] text-on-surface-variant">
                  {items.length > 1 ? `~${totalWeightKg.toFixed(1)} kg` : (unit === 'piece' ? (safeLang === 'en' ? 'pcs' : 'नग') : (safeLang === 'hi' ? 'किग्रा' : (safeLang === 'mr' ? 'किलो' : 'kg')))}
                </span>
              </div>
              <div className="bg-surface-container-lowest p-3.5 rounded-xl text-center border border-surface-container-high">
                <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">{t.condition}</span>
                <span className="font-headline-md text-sm text-primary font-bold block truncate mt-1">{condition}</span>
                <span className="font-body-md text-[11px] text-on-surface-variant">{t.verified}</span>
              </div>
              <div className="bg-surface-container-lowest p-3.5 rounded-xl text-center border border-surface-container-high">
                <span className="font-label-md text-[10px] uppercase text-on-surface-variant font-bold block mb-0.5">{t.collectionHub}</span>
                <span className="font-label-lg text-sm text-on-surface font-bold block truncate mt-1">Dharavi</span>
                <span className="font-body-md text-[11px] text-on-surface-variant truncate block">Mumbai MMR</span>
              </div>
            </div>

            {/* Add Another Item Button */}
            <button
              type="button"
              onClick={() => onNavigate('ai_scan')}
              className="w-full py-2.5 px-4 bg-surface hover:bg-surface-container text-primary font-bold text-xs sm:text-sm rounded-xl border border-primary/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              <span>{t.addAnotherItem}</span>
            </button>

            {/* Circular Economy & Environmental Impact Card */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">eco</span>
                  <span>{t.envImpact}</span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  {t.esgVerified}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-white/80 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="text-secondary text-[11px] block">{t.co2Saved}</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base font-mono">
                    ~{co2AvoidedKg} kg CO₂e
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="text-secondary text-[11px] block">{t.toxicsDiverted}</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base font-mono">
                    ~{toxicDivertedKg} kg Metals
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant pt-1">
                {safeLang === 'mr'
                  ? 'स्वच्छ व्यवस्था: तुमचा स्थानिक स्क्रॅप डीलर हे सर्व भंगार गोळा करून प्रमाणित रिसायकलिंग प्रकल्पांकडे सुरक्षितपणे पाठवतो.'
                  : (safeLang === 'hi'
                      ? 'पारदर्शी व्यवस्था: आपका स्थानीय डीलर आपके कबाड़ को एकत्र कर सुरक्षित रूप से अधिकृत रीसाइक्लिंग संयंत्रों तक पहुंचाता है।'
                      : 'Clean & Fair Ecosystem: Your verified local dealer aggregates your scrap lots and safely transports them to certified recycling plants.')}
              </p>
            </div>

            {/* Safe Handover Guarantee Card */}
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-3 flex items-center gap-2.5 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
              <span><strong>{safeLang === 'mr' ? 'कायदेशीर पावती:' : (safeLang === 'hi' ? 'वैध रसीद व सुरक्षा:' : 'Safe Handover:')}</strong> {t.form6Assurance}</span>
            </div>
          </div>

          {/* Right Column: High-Impact Valuation & Dealer Actions (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            {/* Clean High-Impact Value Card */}
            <div className="bg-primary text-on-primary rounded-2xl p-5 sm:p-6 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-on-primary/80 uppercase tracking-wider font-semibold">
                  {t.estimatedMandiVal}
                </span>
                <span className="bg-white/20 text-on-primary text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {t.liveMandiIndex}
                </span>
              </div>
              <div className="font-headline-lg text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">
                ₹{totalLowEst.toLocaleString('en-IN')} – ₹{totalHighEst.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-on-primary/80">
                {t.calculatedAt} {unit === 'piece' ? `~₹${baseRate}/${safeLang === 'en' ? 'pc' : 'नग'}` : `₹${Math.round(baseRate * 0.95)} – ₹${Math.round(baseRate * 1.05)}/${safeLang === 'en' ? 'kg' : (safeLang === 'mr' ? 'किलो' : 'किग्रा')}`} {items.length > 1 ? `(${items.length} ${t.items}, ~${totalWeightKg.toFixed(1)}kg)` : `(${weight} ${unit === 'piece' ? (safeLang === 'en' ? 'pieces' : 'नग') : (safeLang === 'hi' ? 'किग्रा' : (safeLang === 'mr' ? 'किलो' : 'kg'))})`} {t.forVerifiedScrap}.
              </p>
              <div className="flex items-center gap-1.5 pt-2 text-on-primary text-xs font-semibold border-t border-white/20">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>{t.recyclersReady}</span>
              </div>
            </div>

            {/* Dealer Field Readiness Notice */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-on-surface">
                <span>{t.pickupReadiness}</span>
                <span className="text-emerald-700">{t.highDemand}</span>
              </div>
              <div className="space-y-1 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>{t.fastestBuyer}</span>
                  <strong className="text-on-surface">Peenya Scrap Yard #04 - Dilip Bhai (1.2 km)</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t.averageHandover}</span>
                  <strong className="text-on-surface">{safeLang === 'mr' ? '< ४५ मिनिटे' : (safeLang === 'hi' ? '< 45 मिनट' : '< 45 minutes')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t.settlementGuarantee}</span>
                  <strong className="text-emerald-700">{t.guaranteeDetail}</strong>
                </div>
              </div>
            </div>

            {/* Streamlined Primary Actions */}
            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={() => onNavigate('offers')}
                className="w-full h-13 py-3.5 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-action-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                type="button"
              >
                <span>{t.findOffers}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full h-11 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-outline-variant/30"
                type="button"
              >
                <span className="material-symbols-outlined text-secondary text-[18px]">cloud_download</span>
                <span>{t.saveDraftOffline}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
