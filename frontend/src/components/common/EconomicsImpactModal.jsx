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
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">trending_up</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-on-surface">
                  {currentLang === 'mr' ? 'अर्थशास्त्र आणि सामाजिक प्रभाव' : (currentLang === 'hi' ? 'अर्थशास्त्र एवं ज़मीनी प्रभाव' : 'Unit Economics & Ground Impact Report')}
                </h3>
                <span className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600/20">
                  Field Validated
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Field Research across Dharavi (Mumbai) &amp; Bhosari MIDC (Pune) with 2 Working Collectors
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
                  Collector Income Uplift
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  +97.6% Uplift
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">₹16,355</span>
                <span className="text-on-surface-variant line-through text-xs">from ₹8,275/mo</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                By bypassing informal middlemen (*seths*) and eliminating 15% tare deductions, itinerant collectors nearly double their monthly e-waste earnings.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Platform Sustainability
                </span>
                <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  98.8% Margin
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-primary">2.0% EPR Fee</span>
                <span className="text-xs text-on-surface-variant">Paid by Recyclers</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                <strong>100% Free for Collectors.</strong> Recyclers happily pay 2% because verified EPR audit certificates fulfill their statutory CPCB quota without intermediary markups.
              </p>
            </div>
          </div>

          {/* Benchmark Comparison Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-on-surface">Material Buying Benchmark Comparison (Per Kilogram)</h4>
              <span className="text-[10px] text-on-surface-variant">Mumbai &amp; Pune Industrial Belt</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant uppercase text-[10px] font-bold">
                    <th className="p-3">Material Category</th>
                    <th className="p-3 text-right">Informal Middleman</th>
                    <th className="p-3 text-right font-bold text-primary">RE:LINK Direct Rate</th>
                    <th className="p-3 text-right text-emerald-700">Direct Uplift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {[
                    { name: 'High-Grade PCB (Motherboards/RAM)', code: 'ITEW1-PCB-HG', middle: '₹110.00', relink: '₹280.00', uplift: '+154.5%', gain: '+₹170/kg' },
                    { name: 'Insulated Copper Cables', code: 'ITEW-CBL-CU', middle: '₹210.00 (burnt)', relink: '₹380.00 (granulator)', uplift: '+81.0%', gain: '+₹170/kg' },
                    { name: 'Lead-Acid Batteries', code: 'BATT-PB-ACID', middle: '₹65.00', relink: '₹105.00', uplift: '+61.5%', gain: '+₹40/kg' },
                    { name: 'CRT TV & Monitors', code: 'CEEW1-CRT', middle: '₹5.00', relink: '₹15.00', uplift: '+200.0%', gain: '+₹10/kg' },
                    { name: 'LCD / LED Panels', code: 'CEEW1-FPD', middle: '₹18.00', relink: '₹45.00', uplift: '+150.0%', gain: '+₹27/kg' },
                    { name: 'Electric Motors & Magnets', code: 'ITEW-MTR-MAG', middle: '₹35.00', relink: '₹72.00', uplift: '+105.7%', gain: '+₹37/kg' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3">
                        <strong className="block text-on-surface">{row.name}</strong>
                        <span className="text-[10px] font-mono text-on-surface-variant">{row.code}</span>
                      </td>
                      <td className="p-3 text-right text-on-surface-variant line-through">{row.middle}</td>
                      <td className="p-3 text-right font-bold text-primary">{row.relink}</td>
                      <td className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                        {row.gain} ({row.uplift})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">
              * Note: Informal buyers penalize burnt cables due to carbon char. Formal recyclers pay ₹380/kg for clean unburnt cables, creating a direct economic incentive against toxic open burning.
            </p>
          </div>

          {/* Unit Economics P&L Model */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/40 space-y-2">
            <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider">Per-Transaction Platform Unit Economics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-surface p-2.5 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant block">Avg Lot Size</span>
                <strong className="text-sm font-bold text-on-surface">45 kg (Mixed)</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant block">Avg Transaction Value</span>
                <strong className="text-sm font-bold text-primary">₹11,500</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant block">Platform Revenue (2%)</span>
                <strong className="text-sm font-bold text-emerald-700">₹230.00</strong>
              </div>
              <div className="bg-surface p-2.5 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant block">Cloud &amp; SMS Cost</span>
                <strong className="text-sm font-bold text-on-surface">₹2.70 / lot</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs">
          <span className="text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            CPCB E-Waste Management Rules 2022 Statutory Framework
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-primary-container transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
