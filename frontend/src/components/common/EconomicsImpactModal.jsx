import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EconomicsImpactModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-outline-variant overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">trending_up</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-on-surface">
                  {currentLang === 'mr' ? 'बाजार दर पारदर्शकता अहवाल' : (currentLang === 'hi' ? 'बाजार मूल्य पारदर्शिता रिपोर्ट' : 'Market Price Transparency Overview')}
                </h3>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  CPCB Verified Mandi
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Benchmark Rates across Authorized E-Waste Recyclers &amp; Dismantlers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-on-surface">
          {/* Top 2 Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Value Realization
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Fair Weight
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">100% Certified</span>
                <span className="text-on-surface-variant text-xs">Scale Accuracy</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Direct digital scale calibration and verified Mandi rates ensure fair remuneration for collected electronics.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Statutory Compliance
                </span>
                <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Form-6 Pass
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-primary">Zero Hassle</span>
                <span className="text-xs text-on-surface-variant">Legal Protection</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Every lot transferred to an authorized recycler receives statutory Form-6 protection under E-Waste Rules 2022.
              </p>
            </div>
          </div>

          {/* Benchmark Comparison Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-on-surface">Material Benchmark Comparison (Per Kilogram)</h4>
              <span className="text-[10px] text-on-surface-variant">Regional Industrial Average</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant uppercase text-[10px] font-bold">
                    <th className="p-3">Material Category</th>
                    <th className="p-3 text-right">Standard Unorganized Rate</th>
                    <th className="p-3 text-right font-bold text-primary">RE:LINK Authorized Mandi</th>
                    <th className="p-3 text-right text-emerald-700">Fair Value Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {[
                    { name: 'High-Grade PCB (Motherboards/RAM)', code: 'ITEW1-PCB-HG', unorg: '₹140.00', relink: '₹280.00', gain: '+₹140/kg' },
                    { name: 'Insulated Copper Cables', code: 'ITEW-CBL-CU', unorg: '₹240.00', relink: '₹380.00', gain: '+₹140/kg' },
                    { name: 'Lead-Acid Batteries', code: 'BATT-PB-ACID', unorg: '₹75.00', relink: '₹105.00', gain: '+₹30/kg' },
                    { name: 'CRT TV & Monitors', code: 'CEEW1-CRT', unorg: '₹8.00', relink: '₹16.00', gain: '+₹8/kg' },
                    { name: 'LCD / LED Panels', code: 'CEEW1-FPD', unorg: '₹25.00', relink: '₹45.00', gain: '+₹20/kg' },
                    { name: 'Electric Motors & Magnets', code: 'ITEW-MTR-MAG', unorg: '₹45.00', relink: '₹75.00', gain: '+₹30/kg' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3">
                        <strong className="block text-on-surface">{row.name}</strong>
                        <span className="text-[10px] font-mono text-on-surface-variant">{row.code}</span>
                      </td>
                      <td className="p-3 text-right text-on-surface-variant">{row.unorg}</td>
                      <td className="p-3 text-right font-bold text-primary">{row.relink}</td>
                      <td className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                        {row.gain}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs">
          <span className="text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            CPCB E-Waste (Management) Rules 2022 Framework
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-primary-container transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
