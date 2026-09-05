import React, { useState } from 'react';

export function SignupModal({ isOpen, onClose, onCompleteSignup }) {
  const [role, setRole] = useState('collector');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Dharavi Scrap Cluster, Mumbai');
  const [cpcbNo, setCpcbNo] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP Verification
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onCompleteSignup(role, phone || '9820011223', name || 'New Registered Member');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">person_add</span>
            <div>
              <h3 className="font-bold text-base text-on-surface">New User Registration</h3>
              <p className="text-[11px] text-on-surface-variant">CPCB Registered E-Waste Formalization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('collector')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === 'collector'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">handshake</span>
                  <span>Collector / कबाड़ी</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recycler')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === 'recycler'
                      ? 'bg-secondary text-on-secondary border-secondary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">factory</span>
                  <span>Recycler Facility</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Full Name / Organization Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'collector' ? 'e.g. Ramesh Waghmare' : 'e.g. EcoGreen Recyclers Pvt Ltd'}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Mobile Phone Number (+91)
              </label>
              <div className="flex items-center bg-surface-container-lowest rounded-xl border border-outline-variant px-3 py-2 focus-within:border-primary">
                <span className="text-xs font-bold text-on-surface-variant mr-2">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-transparent text-xs text-on-surface outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Operating Location / Scrap Yard Cluster
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dharavi 13th Compound, Mumbai MMR"
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            {role === 'recycler' && (
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">
                  CPCB / SPCB Authorization Registration No.
                </label>
                <input
                  type="text"
                  required
                  value={cpcbNo}
                  onChange={(e) => setCpcbNo(e.target.value)}
                  placeholder="e.g. CPCB/E-WASTE/REG/MH/2026/XXXX"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-secondary font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-primary-container transition-all cursor-pointer mt-2"
            >
              <span>Send OTP Verification</span>
              <span className="material-symbols-outlined text-[16px]">sms</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-on-surface space-y-1">
              <p className="font-bold text-primary">SMS OTP Sent to +91 {phone}</p>
              <p className="text-[11px] text-on-surface-variant">
                Demo Auto-fill OTP: <strong className="font-mono text-primary">4821</strong>
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Enter 4-Digit OTP</label>
              <input
                type="text"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="4821"
                className="w-full px-3 py-2.5 bg-surface-container-lowest border-2 border-primary rounded-xl text-center text-lg tracking-widest font-bold text-on-surface focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 h-11 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:bg-primary-container transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isSubmitting ? 'Registering...' : 'Verify & Launch'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ForgotPasswordModal({ isOpen, onClose, onResetComplete }) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [newPin, setNewPin] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setStep(2);
  };

  const handleSetNewPin = (e) => {
    e.preventDefault();
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      if (onResetComplete) {
        onResetComplete(phone);
      }
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">lock_reset</span>
            <div>
              <h3 className="font-bold text-base text-on-surface">Reset PIN / Password</h3>
              <p className="text-[11px] text-on-surface-variant">Instant OTP Recovery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <p className="text-xs text-on-surface-variant">
              Enter your registered mobile number. We will send a secure verification code to reset your account PIN.
            </p>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Registered Phone Number</label>
              <div className="flex items-center bg-surface-container-lowest rounded-xl border border-outline-variant px-3 py-2 focus-within:border-primary">
                <span className="text-xs font-bold text-on-surface-variant mr-2">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-transparent text-xs text-on-surface outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-primary text-on-primary font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 hover:bg-primary-container transition-all cursor-pointer mt-2"
            >
              <span>Send Recovery Code</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetNewPin} className="space-y-3">
            <div className="bg-primary/10 rounded-xl p-2.5 text-xs text-primary font-semibold">
              Recovery OTP: <strong className="font-mono">7291</strong>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Enter New 4-Digit Login PIN</label>
              <input
                type="password"
                maxLength={4}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2 bg-surface-container-lowest border-2 border-primary rounded-xl text-center text-lg tracking-widest font-bold text-on-surface focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="w-full h-11 bg-primary text-on-primary font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 hover:bg-primary-container transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{isResetting ? 'Saving PIN...' : 'Save New PIN & Log In'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
