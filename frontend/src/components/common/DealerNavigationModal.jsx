import React, { useState, useEffect } from 'react';

export default function DealerNavigationModal({
  isOpen,
  onClose,
  mode = 'INBOUND_PICKUP', // 'INBOUND_PICKUP' | 'OUTBOUND_DISPATCH'
  lotData = null,
  batchData = null,
  onArrivedAtCollector,
  onDeliveryConfirmed,
  currentLang = 'hi'
}) {
  const [navProgress, setNavProgress] = useState(25);
  const [isLiveGps, setIsLiveGps] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setNavProgress(25);
      return;
    }
    const interval = setInterval(() => {
      setNavProgress(prev => (prev >= 90 ? 90 : prev + 5));
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isInbound = mode === 'INBOUND_PICKUP';

  // Inbound Data Defaults
  const collectorName = lotData?.collector_name || 'Ramesh Kumar';
  const lotRef = lotData?.lot_ref || 'RL-2026-00482';
  const materialName = lotData?.material_name || 'PCB Grade-A Motherboards';
  const weightKg = lotData?.net_weight || 12.0;
  const distanceKm = 1.8;
  const etaMinutes = 6;
  const collectorLocation = 'Peenya Cluster 3, Near 4th Cross Arch, Bengaluru';

  // Outbound Data Defaults
  const batchRef = batchData?.batch_number || 'BATCH-KA-PCB-104';
  const batchWeight = batchData?.weight_kg || 350.0;
  const recyclerName = batchData?.recycler_name || 'M/s. Cerebra Integrated Smelter';
  const recyclerLocation = 'Plot 41-43, Dabaspet Industrial Area, NH 48, Bengaluru Rural';
  const outboundDistanceKm = 14.8;
  const outboundEtaMinutes = 28;
  const form6Ref = 'KA-FORM6-2026-0091';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* MODAL TOP HEADER */}
        <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center text-emerald-200 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">
                {isInbound ? 'directions_car' : 'local_shipping'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  {isInbound ? 'Dealer → Collector Doorstep Navigation' : 'Dealer → Recycler Bulk Dispatch Route'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
                  GPS LIVE
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 font-mono mt-0.5">
                {isInbound ? `Pickup: Lot #${lotRef} • ${collectorName}` : `Consignment #${batchRef} • ${recyclerName}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Route Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* SCROLLABLE ROUTE BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">

          {/* ROUTE ORIGIN & DESTINATION CARD */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider pb-2 border-b border-slate-100">
              <span>{isInbound ? 'Inbound Collection Route' : 'Outbound Heavy Freight Manifest'}</span>
              <span className="text-emerald-700 font-bold font-mono">
                {isInbound ? `${distanceKm} km • ~${etaMinutes} mins` : `${outboundDistanceKm} km • ~${outboundEtaMinutes} mins`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Origin */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  A
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Origin: Peenya Yard #04</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    Dilip Bhai Scrap Yard Desk • Gate #02
                  </span>
                  <span className="inline-block text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded mt-1 border border-emerald-200">
                    CPCB #KA-AGG-2024-118
                  </span>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0">
                  B
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block">
                    {isInbound ? `Destination: ${collectorName}` : `Destination: ${recyclerName}`}
                  </span>
                  <span className="text-emerald-800 text-[11px] block mt-0.5">
                    {isInbound ? collectorLocation : recyclerLocation}
                  </span>
                  <span className="inline-block text-[9px] font-mono bg-white text-slate-700 px-1.5 py-0.2 rounded mt-1 border border-emerald-300">
                    {isInbound ? `E-Waste Lot: ${weightKg} kg ${materialName}` : `Form-6 Manifest #${form6Ref}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE VECTOR ROUTE MAP */}
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner h-52 sm:h-60 flex flex-col justify-between p-4">
            {/* Top Map HUD */}
            <div className="flex items-center justify-between z-10">
              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white flex items-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-[18px] text-emerald-400 animate-spin">navigation</span>
                <span className="text-xs font-bold font-mono">
                  {isInbound ? 'Next: Turn Right at 4th Cross (450m)' : 'Next: Nelamangala Tollway Plaza (8.2km)'}
                </span>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-emerald-400 font-mono text-[11px] font-bold">
                SPEED: {isInbound ? '24 km/h' : '48 km/h'}
              </div>
            </div>

            {/* SVG MAP GRAPHIC */}
            <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 600 240" fill="none">
              {/* Background Grid Roads */}
              <path d="M 0 160 L 600 160" stroke="#1e293b" strokeWidth="8" />
              <path d="M 180 0 L 180 240" stroke="#1e293b" strokeWidth="6" />
              <path d="M 420 0 L 420 240" stroke="#1e293b" strokeWidth="6" />
              <path d="M 0 80 L 600 80" stroke="#1e293b" strokeWidth="4" strokeDasharray="6 6" />

              {/* Active Route Path */}
              {isInbound ? (
                <path
                  d="M 60 160 L 180 160 L 180 80 L 420 80 L 520 80"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M 60 160 L 220 160 L 340 100 L 520 100"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Waypoints */}
              {/* Origin Marker A */}
              <circle cx="60" cy="160" r="10" fill="#047857" stroke="#ffffff" strokeWidth="2.5" />
              <text x="60" y="164" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>
              <text x="60" y="185" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">Peenya Yard #04</text>

              {/* Intermediate Truck Pulse */}
              <circle cx={isInbound ? "260" : "320"} cy={isInbound ? "80" : "108"} r="14" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
              <circle cx={isInbound ? "260" : "320"} cy={isInbound ? "80" : "108"} r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

              {/* Destination Marker B */}
              <circle cx="520" cy={isInbound ? "80" : "100"} r="10" fill="#065f46" stroke="#34d399" strokeWidth="2.5" />
              <text x="520" y={isInbound ? "84" : "104"} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">B</text>
              <text x="520" y={isInbound ? "105" : "125"} fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">
                {isInbound ? collectorName : 'Cerebra Smelter'}
              </text>
            </svg>

            {/* Bottom Route Progress Bar */}
            <div className="z-10 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-[11px] text-slate-300 font-semibold mb-1">
                  <span>En Route ({navProgress}% Completed)</span>
                  <span className="text-emerald-400 font-mono">
                    {isInbound ? `${(distanceKm * (1 - navProgress / 100)).toFixed(1)} km remaining` : `${(outboundDistanceKm * (1 - navProgress / 100)).toFixed(1)} km remaining`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${navProgress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => {
                  const url = isInbound
                    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(collectorLocation)}`
                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(recyclerLocation)}`;
                  window.open(url, '_blank');
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[14px] text-emerald-400">map</span>
                <span>Open GPS</span>
              </button>
            </div>
          </div>

          {/* DRIVER & HARDWARE INTEGRATION BADGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Vehicle & Driver Card */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0">
                {isInbound ? '🛺' : '🚛'}
              </div>
              <div className="flex-1 leading-tight">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  {isInbound ? 'Assigned Doorstep Driver' : 'Heavy Logistics Fleet'}
                </span>
                <span className="font-bold text-xs text-slate-900 block mt-0.5">
                  {isInbound ? 'Rajesh Kumar • E-Rickshaw #KA-02-ER-4412' : 'Manjunath • Eicher Pro 2049 (#KA-04-TR-9921)'}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  📱 Call: +91 98450 12891
                </span>
              </div>
            </div>

            {/* Scale / Form-6 Permit Card */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                {isInbound ? '⚖️' : '📜'}
              </div>
              <div className="flex-1 leading-tight">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  {isInbound ? 'Digital Sensor Verification' : 'Statutory Compliance'}
                </span>
                <span className="font-bold text-xs text-slate-900 block mt-0.5">
                  {isInbound ? 'HX711 Mobile Calibrated Scale Onboard' : `CPCB Form-6 Manifest #${form6Ref}`}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  {isInbound ? 'Zero tare discrepancy guarantee' : 'Electronic transit permit authorized'}
                </span>
              </div>
            </div>
          </div>

          {/* TURN BY TURN STEPS LIST */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">alt_route</span>
              <span>Turn-by-Turn Waypoints</span>
            </h4>

            <div className="space-y-2 text-xs text-slate-700">
              {isInbound ? (
                <>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">straight</span>
                    <div>
                      <span className="font-semibold block">1. Head East from Yard #04 toward Peenya 2nd Cross (400m)</span>
                      <span className="text-[11px] text-slate-500">Passing Peenya Metro Depot</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="material-symbols-outlined text-[16px] text-emerald-700 mt-0.5">turn_right</span>
                    <div>
                      <span className="font-bold text-emerald-950 block">2. Turn Right onto 4th Cross Industrial Road (900m)</span>
                      <span className="text-[11px] text-emerald-800">Clear paved arterial route</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">location_on</span>
                    <div>
                      <span className="font-semibold block">3. Arrive at Ramesh Kumar Doorstep Workshop (500m)</span>
                      <span className="text-[11px] text-slate-500">Near Peenya Cluster 3 Arch</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">straight</span>
                    <div>
                      <span className="font-semibold block">1. Exit Peenya Yard onto Tumkur Road / NH 48 North (2.4 km)</span>
                      <span className="text-[11px] text-slate-500">6-lane expressway commercial lane</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="material-symbols-outlined text-[16px] text-emerald-700 mt-0.5">toll</span>
                    <div>
                      <span className="font-bold text-emerald-950 block">2. Pass Nelamangala Toll Plaza (8.2 km)</span>
                      <span className="text-[11px] text-emerald-800">Fastag &amp; CPCB E-Way Bill Auto-Cleared</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">factory</span>
                    <div>
                      <span className="font-semibold block">3. Take Dabaspet Industrial Exit to Cerebra Gate #01 (4.2 km)</span>
                      <span className="text-[11px] text-slate-500">Smelter weighbridge check-in</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-900 block">
              {isInbound ? `Collector: ${collectorName}` : `Smelter: ${recyclerName}`}
            </span>
            <span className="text-[11px] text-slate-500">
              {isInbound ? `${weightKg} kg ${materialName} awaiting intake` : `${batchWeight} kg Grade-A PCB Batch in transit`}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
            >
              Minimize Route
            </button>

            {isInbound ? (
              <button
                onClick={() => {
                  if (onArrivedAtCollector) {
                    onArrivedAtCollector(lotData);
                  }
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-300">scale</span>
                <span>⚡ Arrived at Collector - Weigh &amp; Pay</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onDeliveryConfirmed) {
                    onDeliveryConfirmed(batchData);
                  }
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-300">task_alt</span>
                <span>🚚 Confirm Smelter Delivery &amp; Form-6</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
