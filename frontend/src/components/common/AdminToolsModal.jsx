import React, { useState, useEffect } from 'react';

export default function AdminToolsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('prices'); // 'prices' | 'recyclers' | 'users' | 'ai_queue'
  const [priceOverrides, setPriceOverrides] = useState({
    mat_pcb_high: 780,
    mat_cables_copper: 420,
    mat_batteries_li_ion: 110,
    mat_batteries_lead: 88,
    mat_motors_magnets: 75,
    mat_mixed_plastics: 24,
    mat_crt_monitor: 16
  });

  const [recyclersList, setRecyclersList] = useState([
    { id: 'rec_ecorecycle_01', name: 'EcoRecycle India Pvt Ltd', cpcb: 'CPCB/E-WASTE/REG/MH/2023/1042', tier: 'Tier-1', status: 'ACTIVE' },
    { id: 'rec_greencircle_02', name: 'GreenCircle Urban Recyclers', cpcb: 'CPCB/E-WASTE/REG/MH/2022/0891', tier: 'Tier-1', status: 'ACTIVE' },
    { id: 'rec_cerebra_03', name: 'Cerebra Integrated Technologies', cpcb: 'CPCB/E-WASTE/REG/MH/2021/0432', tier: 'Tier-1', status: 'ACTIVE' },
    { id: 'rec_greenscape_04', name: 'Greenscape Eco Management', cpcb: 'CPCB/E-WASTE/REG/MH/2023/1187', tier: 'Tier-2', status: 'ACTIVE' },
    { id: 'rec_envirocare_05', name: 'Enviro-Care Recycling Pvt Ltd', cpcb: 'CPCB/E-WASTE/REG/MH/2020/0219', tier: 'Tier-1', status: 'ACTIVE' }
  ]);

  const [collectorsList, setCollectorsList] = useState([
    { id: 'col_9845012891', name: 'Ramesh K. Waghmare', location: 'Dharavi 13th Compound', phone: '+91 98450 12891', lots: 42, kyc: 'VERIFIED' },
    { id: 'col_9820044102', name: 'Dilip S. (Yard Aggregator)', location: 'Yeshwanthpur Scrap Hub', phone: '+91 98200 44102', lots: 88, kyc: 'VERIFIED' },
    { id: 'col_9741077219', name: 'Imran Bhai', location: 'Rajajinagar Industrial E-Waste', phone: '+91 97410 77219', lots: 19, kyc: 'VERIFIED' }
  ]);

  const [aiQueue, setAiQueue] = useState([
    { id: 'scan_881a', dhash: 'cc036586cd250bca', guess: 'mat_pcb_high', conf: 0.42, user_correct: 'High-Grade PCB', status: 'PENDING_REVIEW' },
    { id: 'scan_882b', dhash: '0000000000000000', guess: 'mat_cables_copper', conf: 0.45, user_correct: 'Copper Cables', status: 'PENDING_REVIEW' },
    { id: 'scan_883c', dhash: '0000000000000000', guess: 'mat_batteries_li_ion', conf: 0.43, user_correct: 'Li-Ion Cells', status: 'APPROVED' }
  ]);

  const [savedToast, setSavedToast] = useState(null);

  if (!isOpen) return null;

  const handlePriceChange = (catId, val) => {
    setPriceOverrides((prev) => ({ ...prev, [catId]: parseFloat(val) || 0 }));
  };

  const handleToggleRecycler = (recId) => {
    setRecyclersList((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, status: r.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : r))
    );
    triggerToast('Recycler authorization updated.');
  };

  const handleApproveAi = (scanId) => {
    setAiQueue((prev) =>
      prev.map((q) => (q.id === scanId ? { ...q, status: 'APPROVED' } : q))
    );
    triggerToast('AI training sample approved & queued.');
  };

  const triggerToast = (msg) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-outline-variant overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/60 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-on-surface">RE:LINK Master Admin Tools</h3>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  CPCB GOV SUPERVISOR
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">System Configuration, User Management &amp; AI Feedback Queue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/50 bg-surface-container px-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('prices')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prices' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">price_change</span>
            <span>Mandi Prices</span>
          </button>
          <button
            onClick={() => setActiveTab('recyclers')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'recyclers' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>Recyclers Registry</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span>Collectors &amp; Users</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_queue')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai_queue' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">model_training</span>
            <span>AI Retraining Queue</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {savedToast && (
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{savedToast}</span>
            </div>
          )}

          {/* TAB 1: Mandi Prices Manager */}
          {activeTab === 'prices' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">CPCB Regulated Spot Mandi Prices</h4>
                  <p className="text-on-surface-variant text-[11px]">Override or calibrate baseline buying prices across scrap yards</p>
                </div>
                <button
                  onClick={() => triggerToast('Mandi benchmark prices published to all clients!')}
                  className="px-3 py-1.5 bg-primary text-on-primary font-bold rounded-lg shadow cursor-pointer hover:bg-primary-container"
                >
                  Publish Rates
                </button>
              </div>

              <div className="border border-outline-variant rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Category</th>
                      <th className="p-3">Statutory CPCB Code</th>
                      <th className="p-3">Spot Rate (₹/kg)</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {[
                      { id: 'mat_pcb_high', name: 'High-Grade PCB', code: 'ITEW1-PCB-HG' },
                      { id: 'mat_cables_copper', name: 'Copper Cables', code: 'ITEW-CBL-CU' },
                      { id: 'mat_batteries_li_ion', name: 'Li-Ion Batteries', code: 'BATT-LI-ION' },
                      { id: 'mat_batteries_lead', name: 'Lead-Acid Battery', code: 'BATT-LEAD-01' },
                      { id: 'mat_motors_magnets', name: 'Motors & Magnets', code: 'FERR-MOT-01' },
                      { id: 'mat_mixed_plastics', name: 'Mixed Plastics (ABS)', code: 'PLAST-ABS-01' },
                      { id: 'mat_crt_monitor', name: 'CRT Monitor Glass', code: 'CEEW1-CRT' }
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-surface-container-low">
                        <td className="p-3 font-bold text-on-surface">{row.name}</td>
                        <td className="p-3 font-mono text-on-surface-variant">{row.code}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={priceOverrides[row.id] || 0}
                            onChange={(e) => handlePriceChange(row.id, e.target.value)}
                            className="w-24 px-2 py-1 bg-surface border border-outline-variant rounded font-mono font-bold text-primary focus:outline-none focus:border-primary"
                          />
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            Live Mandi Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Recyclers Registry */}
          {activeTab === 'recyclers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Registered Recyclers &amp; Facility Authorizations</h4>
                  <p className="text-on-surface-variant text-[11px]">Enforce CPCB Tier-1 and Tier-2 licensing under E-Waste Rules 2022</p>
                </div>
              </div>

              <div className="space-y-2">
                {recyclersList.map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-on-surface">{rec.name}</strong>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                          {rec.tier}
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant font-mono block mt-0.5">{rec.cpcb}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        rec.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rec.status}
                      </span>
                      <button
                        onClick={() => handleToggleRecycler(rec.id)}
                        className="px-3 py-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high rounded text-xs font-semibold cursor-pointer"
                      >
                        {rec.status === 'ACTIVE' ? 'Suspend' : 'Reinstate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Users & Collectors */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Doorstep Collectors &amp; Aggregator Profiles</h4>
                  <p className="text-on-surface-variant text-[11px]">Informal sector members registered into formal CPCB chain</p>
                </div>
              </div>

              <div className="space-y-2">
                {collectorsList.map((col) => (
                  <div key={col.id} className="p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <strong className="text-sm text-on-surface">{col.name}</strong>
                      <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant text-[11px]">
                        <span>{col.phone}</span>
                        <span>•</span>
                        <span>{col.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-primary">{col.lots} Lots Submitted</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {col.kyc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI Feedback & Retraining Queue */}
          {activeTab === 'ai_queue' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Active Learning Retraining Queue</h4>
                  <p className="text-on-surface-variant text-[11px]">Scans where confidence was &lt; 60% awaiting supervisor verification</p>
                </div>
              </div>

              <div className="space-y-2">
                {aiQueue.map((item) => (
                  <div key={item.id} className="p-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-on-surface">{item.id}</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          Confidence: {Math.round(item.conf * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Model Guess: <strong className="text-on-surface">{item.guess}</strong> | Corrected Label: <strong className="text-primary">{item.user_correct}</strong>
                      </p>
                      <span className="text-[10px] font-mono text-on-surface-variant">dHash: {item.dhash}</span>
                    </div>
                    <div>
                      {item.status === 'APPROVED' ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded text-[11px] font-bold">
                          ✓ Retraining Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveAi(item.id)}
                          className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-bold shadow hover:bg-primary-container cursor-pointer"
                        >
                          Approve Label
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-primary-container"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
