import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EconomicsImpactModal from '../common/EconomicsImpactModal';
import { SignupModal, ForgotPasswordModal } from '../common/AuthModals';
import AdminToolsModal from '../common/AdminToolsModal';

export default function Screen00WelcomeRole({ onSelectRole }) {
  const { i18n } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showEconomicsModal, setShowEconomicsModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
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
    <div className="flex flex-col min-h-screen bg-background font-body-md text-on-surface antialiased w-full">
      {/* Top Header Bar */}
      <header className="w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm text-on-primary">
              <span className="material-symbols-outlined text-[24px]">recycling</span>
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-xl tracking-tight text-on-surface font-bold">RE:LINK</span>
                <span className="hidden sm:inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  CPCB RECOGNISED
                </span>
              </div>
              <span className="font-label-md text-[11px] text-primary font-bold tracking-wider uppercase">
                Smart E-Waste Mandi • डिजिटल कबाड़ीबाज़ार
              </span>
            </div>
          </div>

          {/* Right Controls: Economics, Live Mandi Indicator & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowEconomicsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
              title="View Field Research & Unit Economics Model"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-emerald-600">bar_chart</span>
              <span className="hidden sm:inline">Economics &amp; Impact</span>
              <span className="sm:hidden">Impact</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full text-xs font-semibold text-primary border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Live Mandi Index 2026</span>
            </div>

            <div className="flex items-center bg-surface-container rounded-full p-1 shadow-sm border border-outline-variant/30">
              <button
                onClick={() => handleLangChange('hi')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'hi' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLangChange('mr')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'mr' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                मराठी
              </button>
              <button
                onClick={() => handleLangChange('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  currentLang === 'en' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero & Portals Container */}
      <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Hero Greeting & Tagline */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide mb-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>National E-Waste Circular Economy Gateway</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Choose Your Portal
            </h1>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
              Fair Mandi Prices • Direct Physical Scale Verification • Instant Cash &amp; Bank Settlement
            </p>
          </div>

          {/* Role Selection Cards: Responsive 2-Column Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Collector / Kabadiwala */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 shadow-sm border-2 border-primary/30 flex flex-col justify-between hover:shadow-md hover:border-primary transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center shrink-0 text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">handshake</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-primary text-on-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      FIELD COLLECTION
                    </span>
                    <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Instant AI Valuation
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    Collector / कबाड़ीवाला
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Designed for doorstep collectors and informal aggregators. Scan scrap, check live mandi rates, and receive verified payment.
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-2 py-2 border-t border-b border-surface-container-high text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                    <span><strong>AI Scrap Recognition:</strong> Instant categorization &amp; weight guidance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">record_voice_over</span>
                    <span><strong>Spoken Mandi Rates:</strong> Real-time audio voice in Hindi &amp; Marathi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                    <span><strong>Guaranteed Payout:</strong> 100% verified cash/UPI at weighbridge scale</span>
                  </div>
                </div>
              </div>

              {/* Login Action Area */}
              <div className="mt-5 space-y-3 bg-surface-container-low p-4 rounded-xl">
                <label className="block font-label-md text-xs text-on-surface font-semibold" htmlFor="collectorPhoneClean">
                  Mobile Login / फ़ोन नंबर से जुड़ें
                </label>
                <div className="flex items-center bg-surface-container-lowest rounded-lg px-3 py-2.5 shadow-sm border border-outline-variant/40 focus-within:border-primary">
                  <span className="font-label-md text-sm text-on-surface-variant font-bold pr-2">+91</span>
                  <input
                    id="collectorPhoneClean"
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10 digit mobile number"
                    className="w-full bg-transparent font-label-md text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                  />
                  <span className="material-symbols-outlined text-primary text-[20px]">phone_android</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5 px-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Forgot PIN?
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignupModal(true)}
                    className="text-primary font-bold hover:underline transition-colors cursor-pointer"
                  >
                    New Collector? Register
                  </button>
                </div>
                  <button
                    onClick={handleCollectorLogin}
                    className="w-full h-12 rounded-xl bg-primary text-on-primary font-action-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all active:scale-[0.99] cursor-pointer"
                    type="button"
                  >
                    <span>Launch Collector App</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <div className="pt-1">
                    <button
                      onClick={() => onSelectRole('collector', '9845012891')}
                      type="button"
                      className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-primary/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>⚡ Quick Demo Login: Ramesh K. (+91 98450 12891)</span>
                    </button>
                  </div>
                </div>
              </section>

            {/* Card 2: Recycler */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 shadow-sm border-2 border-outline-variant/40 flex flex-col justify-between hover:shadow-md hover:border-secondary transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">factory</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-secondary text-on-secondary text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      REGISTERED FACILITY
                    </span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold px-2 py-0.5 rounded-full">
                      CPCB TIER-1 / TIER-2
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    Authorized Recycler
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Designed for CPCB-registered formal recyclers, dismantling facilities, and PROs. Source aggregated scrap lots with automated EPR audit trails.
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-2 py-2 border-t border-b border-surface-container-high text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">inbox</span>
                    <span><strong>Live Lot Stream:</strong> Inspect verified scrap lots within your radius</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">scale</span>
                    <span><strong>Weighbridge Integration:</strong> Scan lot QR &amp; record calibrated scale weights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">description</span>
                    <span><strong>Form-6 &amp; EPR Credits:</strong> Auto-generate statutory transfer manifests</span>
                  </div>
                </div>
              </div>

              {/* Recycler Launch Button */}
              <div className="mt-5 space-y-3 bg-surface-container-low p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="font-semibold">Facility Authentication:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 5 Facilities Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5 px-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="hover:text-secondary transition-colors cursor-pointer"
                  >
                    Facility Password Help
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignupModal(true)}
                    className="text-secondary font-bold hover:underline transition-colors cursor-pointer"
                  >
                    Register New Plant
                  </button>
                </div>
                <button
                  onClick={handleRecyclerLogin}
                  className="w-full h-12 rounded-xl bg-on-surface text-surface hover:bg-black font-action-xl text-sm sm:text-base font-bold flex items-center justify-between px-5 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                    <span>Access Recycler Portal</span>
                  </div>
                  <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                </button>
                <div className="pt-1">
                  <button
                    onClick={handleRecyclerLogin}
                    type="button"
                    className="w-full py-2 px-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-secondary/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>⚡ Quick Demo Login: EcoRecycle India (Tier-1)</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Underneath Stats Strip */}
          <div className="grid grid-cols-3 gap-4 bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/30 text-center">
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-primary">1,420+</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">Informal Collectors</p>
            </div>
            <div className="border-x border-outline-variant/40">
              <p className="text-lg sm:text-2xl font-extrabold text-on-surface">42.8 MT</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">Formalized This Month</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-extrabold text-secondary">100%</p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">CPCB Form-6 Traceable</p>
            </div>
          </div>

          {/* Clean Trust & Compliance Footer */}
          <footer className="pt-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-on-surface-variant text-xs font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span> CPCB Authorized Network
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">cloud_sync</span> Offline-Ready PWA
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">security</span> Form-6 Statutory Audit Trail
              </span>
              <span className="text-on-surface-variant/40">•</span>
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                className="flex items-center gap-1.5 text-primary hover:underline font-bold cursor-pointer transition-colors"
                title="Access Master Admin Tools & AI Feedback Queue"
              >
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>Admin Console</span>
              </button>
            </div>
            <p className="font-body-md text-xs text-on-surface-variant/70">
              National Toll-Free Assistance: <strong>1800-EW-RELINK</strong> (8 AM – 8 PM)
            </p>
          </footer>
        </div>
      </main>

      {/* Field Research & Unit Economics Impact Modal */}
      <EconomicsImpactModal
        isOpen={showEconomicsModal}
        onClose={() => setShowEconomicsModal(false)}
      />

      {/* Sign Up Registration Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onCompleteSignup={(role, phone) => onSelectRole(role, phone)}
      />

      {/* Forgot PIN / Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onResetComplete={(phone) => onSelectRole('collector', phone)}
      />

      {/* Master Admin Tools Modal */}
      <AdminToolsModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
