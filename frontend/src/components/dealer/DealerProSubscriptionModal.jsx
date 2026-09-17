import React, { useState } from 'react';

const TRANSLATIONS = {
  en: {
    modalTitle: 'Subscription',
    modalSubtitle: 'RE:LINK Pro for Aggregators & Yards',
    yardName: 'Peenya Yard 04',
    tier: 'Tier 1 Aggregator',
    freeActive: 'Free Account Active',
    monthly: 'Monthly (₹499)',
    annual: 'Yearly (₹4,199)',
    monthlyLabel: 'Monthly',
    annualLabel: 'Yearly',
    perMonthShort: '/ month',
    perYearShort: '/ year',
    instantActivation: 'Instant 1-Click Activation • Cancel Anytime',
    saveTagShort: 'Save 30% with Yearly (2 Months Free)',
    securePay: '100% Secure Payment',
    saveTag: 'Save 30% with Annual (2 Months Free)',
    choiceBadge: 'SUPER DEALER CHOICE',
    proTitle: 'RE:LINK PRO',
    perMonth: '/ month',
    perYear: '/ year (Save ₹1,789)',
    dailyEquiv: 'Only ₹16 / day',
    annualEquiv: 'GST Invoice Available',
    b1Title: 'Higher Profit',
    b1Desc: 'Precision Mandi Margin Calculator',
    b2Title: '3x Buyer RFQs',
    b2Desc: 'Direct Smelter & Recycler Bids',
    b3Title: 'Bulk Demand Alerts',
    b3Desc: 'WhatsApp & SMS Instant Push',
    b4Title: 'Voice Mandi AI',
    b4Desc: 'Hands-free Price & Lot Dispatch',
    ctaMonthly: '₹499 / mo',
    ctaAnnual: '₹4,199 / yr',
    paymentMethods: 'UPI • GPay • PhonePe • Paytm • Cards • NetBanking',
    roiHeader: 'Pays for itself in 1 Deal',
    liveProof: 'LIVE PROOF',
    roiDealName: 'EcoRecycle CleanTech Consignment',
    roiDealSub: '2.5 MT PCB Grade-A • ₹205/kg (+₹11 Mandi Lead)',
    roiGain: '+₹2,750',
    roiGainSub: 'Extra Net Profit',
    freeForeverTitle: 'Free Forever Plan (₹0)',
    freeF1: 'Weighing Scale Integration (HX711 Bluetooth Scale)',
    freeF2: 'Collector Receipts (QR Verification & Cash Register)',
    freeF3: 'Daily In-Yard Inventory Ledger',
    freePromise: 'We will never charge for basic scale weighing or collector receipts.',
    needHelp: 'Have questions or need assistance?',
    whatsappHelp: 'Chat on WhatsApp (RE:LINK Helpdesk)',
    close: 'Close'
  },
  hi: {
    modalTitle: 'सदस्यता',
    modalSubtitle: 'यार्ड एग्रीगेटर्स के लिए RE:LINK Pro',
    yardName: 'पीन्या यार्ड 04',
    tier: 'टियर 1 एग्रीगेटर',
    freeActive: 'मुफ़्त खाता सक्रिय',
    monthly: 'मासिक (₹499)',
    annual: 'वार्षिक (₹4,199)',
    monthlyLabel: 'मासिक',
    annualLabel: 'वार्षिक',
    perMonthShort: '/ माह',
    perYearShort: '/ साल',
    instantActivation: 'तुरंत सक्रिय • कभी भी रद्द करें',
    saveTagShort: 'वार्षिक में 30% बचत (2 माह मुफ़्त)',
    securePay: '100% सुरक्षित भुगतान',
    saveTag: 'वार्षिक में 2 माह मुफ़्त (Save 30%)',
    choiceBadge: 'सुपर डीलर्स की पसंद',
    proTitle: 'RE:LINK PRO',
    perMonth: '/ महीना',
    perYear: '/ वर्ष (₹1,789 की बचत)',
    dailyEquiv: 'सिर्फ ₹16 / दिन',
    annualEquiv: 'जीएसटी इनपुट उपलब्ध',
    b1Title: 'ज़्यादा मुनाफा',
    b1Desc: 'सटीक मार्जिन कैलकुलेटर',
    b2Title: '3x खरीदार RFQ',
    b2Desc: 'डायरेक्ट रिसाइकलर रेट्स',
    b3Title: 'बल्क मांग अलर्ट',
    b3Desc: 'WhatsApp व SMS नोटिफिकेशन',
    b4Title: 'आवाज़ सहायक',
    b4Desc: 'बोलकर मंडी भाव व लॉट निपटारा',
    ctaMonthly: '₹499 / माह',
    ctaAnnual: '₹4,199 / साल',
    paymentMethods: 'UPI • GPay • PhonePe • Paytm • Cards • नेटबैंकिंग',
    roiHeader: '1 डील में पूरा पैसा वसूल',
    liveProof: 'लाइव प्रूफ',
    roiDealName: 'EcoRecycle CleanTech ऑफर',
    roiDealSub: '2.5 MT PCB Grade-A • ₹205/kg (+₹11 मंडी लीड)',
    roiGain: '+₹2,750',
    roiGainSub: 'अतिरिक्त लाभ',
    freeForeverTitle: 'हमेशा मुफ़्त रहेगा (Free Forever - ₹0)',
    freeF1: 'कांटा / Weighing Scale (HX711 ब्लूटूथ तोल)',
    freeF2: 'कबाड़ी रसीद (Collector QR कोड व कैश रजिस्टर)',
    freeF3: 'बुनियादी स्टॉक (Daily In-Yard Inventory)',
    freePromise: 'हम कभी भी बुनियादी तोल या रसीद के पैसे नहीं लेंगे।',
    needHelp: 'कोई सवाल है या मदद चाहिए?',
    whatsappHelp: 'WhatsApp पर बात करें (RE:LINK हेल्पडेस्क)',
    close: 'बंद करें'
  },
  mr: {
    modalTitle: 'सदस्यता',
    modalSubtitle: 'यार्ड एग्रीगेटर्ससाठी RE:LINK Pro',
    yardName: 'पीन्या यार्ड ०४',
    tier: 'टियर १ एग्रीगेटर',
    freeActive: 'मोफत खाते सक्रिय',
    monthly: 'मासिक (₹499)',
    annual: 'वार्षिक (₹4,199)',
    monthlyLabel: 'मासिक',
    annualLabel: 'वार्षिक',
    perMonthShort: '/ महिना',
    perYearShort: '/ वर्ष',
    instantActivation: 'तत्काळ सुरू • कधीही रद्द करा',
    saveTagShort: 'वार्षिक योजनेत ३०% बचत (२ महिने मोफत)',
    securePay: '100% सुरक्षित पेमेंट',
    saveTag: 'वार्षिक योजनेत २ महिने मोफत (३०% बचत)',
    choiceBadge: 'सुपर डीलर्सची पहिली पसंती',
    proTitle: 'RE:LINK PRO',
    perMonth: '/ महिना',
    perYear: '/ वर्ष (₹१,७८९ ची बचत)',
    dailyEquiv: 'फक्त ₹१६ / दिवस',
    annualEquiv: 'जीएसटी इनपुट उपलब्ध',
    b1Title: 'जास्त नफा',
    b1Desc: 'अचूक मार्जिन कॅल्क्युलेटर',
    b2Title: '3x खरेदीदार RFQ',
    b2Desc: 'थेट स्मेल्टर व रिसायकलर दर',
    b3Title: 'मोठ्या मागणीचे अलर्ट',
    b3Desc: 'WhatsApp व SMS तात्काळ सूचना',
    b4Title: 'व्हॉइस असिस्टंट',
    b4Desc: 'बोलून मंडी भाव व लॉट नोंदणी',
    ctaMonthly: '₹499 / महिना',
    ctaAnnual: '₹4,199 / वर्ष',
    paymentMethods: 'UPI • GPay • PhonePe • Paytm • Cards • नेटबँकिंग',
    roiHeader: 'एकाच सौद्यात सर्व पैसे वसूल',
    liveProof: 'थेट पुरावा',
    roiDealName: 'EcoRecycle CleanTech ऑफर',
    roiDealSub: '२.५ MT PCB Grade-A • ₹२०५/kg (+₹११ मंडी लीड)',
    roiGain: '+₹२,७५०',
    roiGainSub: 'अतिरिक्त निव्वळ नफा',
    freeForeverTitle: 'नेहमी मोफत राहील (Free Forever - ₹0)',
    freeF1: 'डिजिटल वजनकाटा (HX711 ब्लूटूथ तोलणी)',
    freeF2: 'कबाडी पावती (Collector QR कोड व कॅश रजिस्टर)',
    freeF3: 'दैनंदिन यार्ड साठा (In-Yard Inventory Ledger)',
    freePromise: 'आम्ही मूलभूत वजन किंवा पावतीसाठी कधीही शुल्क आकारणार नाही.',
    needHelp: 'काही शंका आहे किंवा मदत हवी आहे?',
    whatsappHelp: 'WhatsApp वर संपर्क साधा (RE:LINK हेल्पडेस्क)',
    close: 'बंद करा'
  }
};

export default function DealerProSubscriptionModal({ isOpen, onClose, currentLang = 'en' }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [checkoutSimulated, setCheckoutSimulated] = useState(false);

  const langKey = currentLang === 'mr' ? 'mr' : currentLang === 'hi' ? 'hi' : 'en';
  const t = TRANSLATIONS[langKey] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const handleTriggerCheckout = () => {
    setCheckoutSimulated(true);
    setTimeout(() => {
      setCheckoutSimulated(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface font-body-md text-on-surface w-full max-w-md max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/40">
        
        {/* Header (Matching Stitch Design) */}
        <div className="h-16 px-4 bg-surface/95 border-b border-outline-variant/30 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer border border-outline-variant/40"
              title={t.close}
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg text-primary font-bold leading-tight">
                {t.modalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-[11px] font-bold">Live Sync</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Compact Yard Status Pill */}
          <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between shadow-2xs border border-outline-variant/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">warehouse</span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm text-on-surface">{t.yardName}</div>
                <span className="text-xs text-on-surface-variant font-medium">{t.tier}</span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-surface-container-highest text-primary text-[11px] font-bold flex items-center gap-1 border border-primary/20">
              <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
              <span>{t.freeActive}</span>
            </div>
          </div>

          {/* Enhanced Segmented Billing Toggle */}
          <div className="bg-surface-container-high/90 p-1.5 rounded-2xl border border-outline-variant/40 shadow-xs">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-emerald-700 via-primary to-emerald-800 text-white shadow-md shadow-emerald-950/20 border border-emerald-500/30'
                    : 'text-on-surface hover:text-primary hover:bg-surface-container transition-colors'
                }`}
              >
                <span>{t.monthlyLabel}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  billingCycle === 'monthly' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-primary'
                }`}>
                  ₹499
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-emerald-700 via-primary to-emerald-800 text-white shadow-md shadow-emerald-950/20 border border-emerald-500/30'
                    : 'text-on-surface hover:text-primary hover:bg-surface-container transition-colors'
                }`}
              >
                <span>{t.annualLabel}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  billingCycle === 'annual' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-primary'
                }`}>
                  ₹4,199
                </span>
                <span className="absolute -top-2 right-1 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[9.5px] rounded-full uppercase tracking-wider shadow-xs">
                  -30%
                </span>
              </button>
            </div>
            <div className="text-center pt-1.5 pb-0.5">
              <span className="inline-flex items-center gap-1 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[15px] text-amber-600">local_fire_department</span>
                <span>{t.saveTag}</span>
              </span>
            </div>
          </div>

          {/* Visual Dealer Pro Hero Card */}
          <div className="relative bg-surface rounded-2xl p-4 sm:p-5 shadow-md border-2 border-primary/30">
            {/* Top Badge */}
            <div className="absolute -top-3 right-3 bg-secondary text-white px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-xs flex items-center gap-1 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>{t.choiceBadge}</span>
            </div>

            {/* Price Header */}
            <div className="flex items-baseline justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[22px] text-amber-600">stars</span>
                <h3 className="font-headline-sm text-lg font-black text-on-surface tracking-tight">
                  {t.proTitle}
                </h3>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-2xl sm:text-3xl font-black text-primary font-mono">
                    {billingCycle === 'annual' ? '₹4,199' : '₹499'}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {billingCycle === 'annual' ? t.perYear : t.perMonth}
                  </span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10.5px] font-bold mt-0.5">
                  {billingCycle === 'annual' ? t.annualEquiv : t.dailyEquiv}
                </span>
              </div>
            </div>

            {/* 4 Visual Benefit Badges */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/30">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                </div>
                <div className="font-bold text-xs text-on-surface leading-tight">{t.b1Title}</div>
                <div className="text-[11px] text-on-surface-variant leading-tight">{t.b1Desc}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/30">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                </div>
                <div className="font-bold text-xs text-on-surface leading-tight">{t.b2Title}</div>
                <div className="text-[11px] text-on-surface-variant leading-tight">{t.b2Desc}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/30">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                </div>
                <div className="font-bold text-xs text-on-surface leading-tight">{t.b3Title}</div>
                <div className="text-[11px] text-on-surface-variant leading-tight">{t.b3Desc}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/30">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                </div>
                <div className="font-bold text-xs text-on-surface leading-tight">{t.b4Title}</div>
                <div className="text-[11px] text-on-surface-variant leading-tight">{t.b4Desc}</div>
              </div>
            </div>

            {/* Prominent High-Conversion Primary CTA Button */}
            <div className="mt-5 pt-1">
              <button
                type="button"
                onClick={handleTriggerCheckout}
                className="group relative w-full overflow-hidden rounded-2xl p-[2px] shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:shadow-emerald-900/35 active:scale-[0.98] transition-all cursor-pointer bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"
              >
                <div className="w-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 transition-all rounded-[14px] py-3.5 px-4 sm:px-5 flex items-center justify-between gap-3 text-white">
                  
                  {/* Left: Premium Icon badge */}
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px] text-emerald-200">
                      workspace_premium
                    </span>
                  </div>

                  {/* Center: Large High-Contrast Amount & Reassurance */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-mono font-black text-2xl sm:text-3xl text-white tracking-tight leading-none drop-shadow-xs">
                        {billingCycle === 'annual' ? '₹4,199' : '₹499'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-100/90">
                        {billingCycle === 'annual' ? t.perYearShort : t.perMonthShort}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                      <span className="text-[11px] font-medium text-emerald-100/90 truncate">
                        {billingCycle === 'annual' ? t.saveTagShort : t.instantActivation}
                      </span>
                    </div>
                  </div>

                  {/* Right: Modern Arrow Pill */}
                  <div className="w-10 h-10 rounded-xl bg-white/15 group-hover:bg-white/25 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-all shadow-inner">
                    <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                  </div>
                </div>
              </button>

              <div className="mt-2.5 flex items-center justify-center gap-2 text-on-surface-variant text-[11px] font-medium text-center flex-wrap">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  <span>{t.securePay}</span>
                </span>
                <span className="text-outline-variant">•</span>
                <span>{t.paymentMethods}</span>
              </div>
            </div>

            {/* Razorpay Pop-up Feedback Simulation */}
            {checkoutSimulated && (
              <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl shadow-xl flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-emerald-400">lock_clock</span>
                  <div className="text-left">
                    <div className="font-bold text-xs">Opening Razorpay Gateway...</div>
                    <div className="text-[10px] text-slate-300">
                      {billingCycle === 'annual' ? 'RE:LINK Pro (Annual) • ₹4,199' : 'RE:LINK Pro (Monthly) • ₹499'}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] animate-spin text-emerald-400">progress_activity</span>
              </div>
            )}
          </div>

          {/* 1-Tap ROI Visual Snippet */}
          <div className="bg-surface-container-low rounded-xl p-3.5 shadow-2xs border border-secondary/20">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px] text-amber-700">payments</span>
                <span className="font-bold text-xs text-secondary">{t.roiHeader}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[10px] font-bold">
                {t.liveProof}
              </span>
            </div>
            <div className="bg-surface p-2.5 rounded-lg flex items-center justify-between border border-outline-variant/20">
              <div className="min-w-0 pr-2">
                <div className="font-bold text-xs text-on-surface truncate">{t.roiDealName}</div>
                <div className="text-[11px] text-on-surface-variant truncate">{t.roiDealSub}</div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-primary block font-mono">{t.roiGain}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">{t.roiGainSub}</span>
              </div>
            </div>
          </div>

          {/* Simple Free Plan Assurance */}
          <div className="bg-surface rounded-xl p-4 shadow-2xs border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-on-surface">{t.freeForeverTitle}</h4>
              <span className="font-extrabold text-sm text-on-surface font-mono">₹0</span>
            </div>
            <div className="space-y-1.5 text-xs text-on-surface">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>{t.freeF1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>{t.freeF2}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>{t.freeF3}</span>
              </div>
            </div>
            <div className="pt-2 text-on-surface-variant text-[11px] flex items-center gap-1.5 border-t border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[15px]">handshake</span>
              <span>{t.freePromise}</span>
            </div>
          </div>

          {/* Support Footer */}
          <div className="text-center pt-1 pb-2">
            <p className="text-xs text-on-surface-variant">{t.needHelp}</p>
            <a
              href="https://wa.me/919876543210?text=Hello%20RE:LINK%20Support%20I%20want%20to%20know%20more%20about%20Dealer%20Pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-bold inline-flex items-center gap-1 mt-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>{t.whatsappHelp}</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
