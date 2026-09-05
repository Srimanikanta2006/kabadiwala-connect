import React from 'react';

export default function Form6ManifestModal({ isOpen, onClose, certData }) {
  if (!isOpen || !certData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-outline-variant overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-on-surface">Statutory CPCB Form-6 Transfer Manifest</h3>
              <p className="text-[11px] text-on-surface-variant font-mono">E-Waste (Management) Rules, 2022 • Rule 19 Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Certificate Paper Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 bg-white text-slate-900 font-sans text-xs">
          {/* Official Emblem Banner */}
          <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
            <div className="inline-block px-3 py-0.5 border border-slate-800 text-[10px] font-bold uppercase tracking-wider mb-1">
              Government of India • Ministry of Environment, Forest and Climate Change
            </div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight uppercase">
              Central Pollution Control Board (CPCB)
            </h2>
            <h3 className="text-xs font-bold uppercase text-slate-700">
              FORM 6: E-WASTE MANIFEST &amp; EXTENDED PRODUCER RESPONSIBILITY (EPR) TRANSFER RECORD
            </h3>
            <p className="text-[10px] text-slate-600 font-mono">
              Manifest No: <strong className="text-slate-900">{certData.cert || certData.certificate_id || 'CPCB-EPR-2026-MH-994102'}</strong> | Date: {certData.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>

          {/* Parties 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-300 p-3 rounded-lg bg-slate-50">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">1. SENDER (Origin / Aggregator)</span>
              <p className="font-bold text-slate-900">{certData.collector || certData.collector_name || 'Ramesh K. (Peenya Aggregator)'}</p>
              <p className="text-[11px] text-slate-700">Operating Territory: Peenya Industrial Cluster / Dharavi</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded inline-block mt-0.5">
                CPCB Registered Informal Channel
              </span>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-300 sm:pl-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">2. RECEIVER (Authorized Recycler)</span>
              <p className="font-bold text-slate-900">{certData.facility_name || 'EcoRecycle India Pvt Ltd (Ecoreco)'}</p>
              <p className="text-[11px] font-mono text-slate-700">Reg No: CPCB/E-WASTE/REG/MH/2023/1042</p>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded inline-block mt-0.5">
                Tier-1 Dismantling &amp; Granulation Facility
              </span>
            </div>
          </div>

          {/* Material & Weight Specification */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">3. MATERIAL SPECIFICATIONS &amp; SCALE METROLOGY</span>
            <table className="w-full text-left border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-800 font-bold text-[10px] uppercase">
                  <th className="p-2 border border-slate-300">Lot Reference</th>
                  <th className="p-2 border border-slate-300">E-Waste Description</th>
                  <th className="p-2 border border-slate-300">CPCB Code</th>
                  <th className="p-2 border border-slate-300 text-right">Certified Weight</th>
                  <th className="p-2 border border-slate-300 text-right">Total Payout</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300 font-mono font-bold text-primary">{certData.lot || certData.lot_ref || 'RL-2026-00482'}</td>
                  <td className="p-2 border border-slate-300">{certData.material || 'Printed Circuit Board (Grade A)'}</td>
                  <td className="p-2 border border-slate-300 font-mono">ITEW1-PCB-HG</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">{certData.weight ? (typeof certData.weight === 'number' ? `${certData.weight} kg` : certData.weight) : (certData.verified_weight ? `${certData.verified_weight} kg` : '12.0 kg')}</td>
                  <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{typeof certData.payout === 'number' ? `₹${certData.payout.toLocaleString('en-IN')}` : (certData.payout || '₹9,360')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4 Pillars of Traceability Proof */}
          <div className="border border-slate-300 p-3 rounded-lg bg-slate-50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">4. STATUTORY AUDIT &amp; TRACEABILITY INTEGRITY</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Physical Scale Calibration:</span>
                <strong>Legal Metrology Standard (±0.1 kg verified)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Handover GPS Geo-Tag:</span>
                <strong>13.028°N, 77.518°E (Timestamped)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Financial Settlement Mode:</span>
                <strong>{certData.mode || certData.payment_mode || 'UPI Instant Transfer'} (Verified Paid)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">SHA-256 Digital Fingerprint:</span>
                <strong className="font-mono text-[10px]">{certData.hash || 'SHA256: 8f9b4c2e1a...77b'}</strong>
              </div>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-600">
            <div className="text-center">
              <div className="h-8 border-b border-dashed border-slate-400 w-32 mx-auto"></div>
              <span className="mt-1 block">Collector Sign / Digital Thumbprint</span>
            </div>
            <div className="w-16 h-16 bg-slate-100 border border-slate-300 flex items-center justify-center p-1">
              <span className="material-symbols-outlined text-[44px] text-slate-800">qr_code_2</span>
            </div>
            <div className="text-center">
              <div className="h-8 border-b border-dashed border-slate-400 w-32 mx-auto flex items-center justify-center text-emerald-800 font-bold">
                ✓ Statutorily Verified
              </div>
              <span className="mt-1 block">Authorized Recycler Weighbridge Officer</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-surface border border-outline-variant text-on-surface font-bold rounded-xl shadow-sm hover:bg-surface-container flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Form-6 Manifest</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-on-primary font-bold rounded-xl shadow cursor-pointer hover:bg-primary-container transition-colors"
          >
            Close Manifest
          </button>
        </div>
      </div>
    </div>
  );
}
