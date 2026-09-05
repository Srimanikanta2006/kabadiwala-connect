import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Screen00WelcomeRole({ onSelectRole }) {
  const { i18n } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const currentLang = i18n.language || 'hi';

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleCollectorLogin = () => {
    onSelectRole('collector', phoneNumber || '9845012891');
  };

  const handleRecyclerLogin = () => {
    onSelectRole('recycler');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body-md text-on-surface antialiased">
      <main className="w-full flex-1 px-4 sm:px-6 py-8 sm:py-12 flex justify-center items-center">
        <div className="flex flex-col w-full max-w-md mx-auto space-y-5">
          {/* Top Bar: Brand & Language Switcher */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm text-on-primary">
                <span className="material-symbols-outlined text-[24px]">recycling</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-headline-md text-xl tracking-tight text-on-surface font-bold">RE:LINK</span>
                <span className="font-label-md text-[10px] text-primary font-bold tracking-wider uppercase">Smart E-Waste Mandi</span>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-surface-container rounded-full p-0.5 shadow-sm border border-outline-variant/30">
              <button
                onClick={() => handleLangChange('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'hi' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLangChange('mr')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'mr' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                मराठी
              </button>
              <button
                onClick={() => handleLangChange('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'en' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                EN
              </button>
            </div>
          </div>

          {/* Hero Greeting & Tagline */}
          <div className="text-center py-2">
            <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
              Choose Your Portal
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
              Fair prices • Direct verification • Instant payout
            </p>
          </div>

          {/* Card 1: Collector / कबाड़ीवाला */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-primary/20 space-y-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[28px]">handshake</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-[10px] font-bold uppercase tracking-wider text-primary">
                    FIELD COLLECTION
                  </span>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                    AI PRICING
                  </span>
                </div>
                <h2 className="font-headline-md text-lg text-on-surface font-bold mt-0.5">
                  Collector / कबाड़ीवाला
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Scan scrap &amp; get highest verified live mandi rates
                </p>
              </div>
            </div>

            <div className="space-y-2.5 bg-surface-container-low p-3 rounded-xl">
              <label className="block font-label-md text-xs text-on-surface font-semibold" htmlFor="collectorPhoneClean">
                Quick Mobile Login / फ़ोन नंबर
              </label>
              <div className="flex items-center bg-surface-container-lowest rounded-lg px-3 py-2 shadow-sm border border-outline-variant/40">
                <span className="font-label-md text-sm text-on-surface-variant font-bold pr-2">+91</span>
                <input
                  id="collectorPhoneClean"
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10 digit number"
                  className="w-full bg-transparent font-label-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                />
                <span className="material-symbols-outlined text-primary text-[20px]">phone_android</span>
              </div>
              <button
                onClick={handleCollectorLogin}
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-action-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-container transition-all active:scale-[0.99] cursor-pointer"
                type="button"
              >
                <span>Continue as Collector</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Card 2: Recycler */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 space-y-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container">
                <span className="material-symbols-outlined text-[28px]">factory</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-[10px] font-bold uppercase tracking-wider text-secondary">
                    REGISTERED FACILITY
                  </span>
                  <span className="bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                    CPCB TIER-1
                  </span>
                </div>
                <h2 className="font-headline-md text-lg text-on-surface font-bold mt-0.5">
                  Authorized Recycler
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Source verified bulk e-waste lots &amp; auto-generate CPCB Form-6
                </p>
              </div>
            </div>

            <button
              onClick={handleRecyclerLogin}
              className="w-full h-11 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-action-xl text-sm font-bold flex items-center justify-between px-4 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              type="button"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
                <span>Recycler Portal Login</span>
              </div>
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </section>

          {/* Clean Trust Footer */}
          <footer className="pt-2 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-3 text-on-surface-variant text-[11px] font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[15px]">verified</span> CPCB Verified
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[15px]">cloud_off</span> Offline Ready
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[15px]">lock</span> 256-Bit Encrypted
              </span>
            </div>
            <p className="font-body-md text-[11px] text-on-surface-variant/70">
              Need help? Toll-free 1800-EW-RELINK
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
