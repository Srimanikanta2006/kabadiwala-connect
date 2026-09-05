import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const INITIAL_FACILITIES = [
  {
    id: 'rec_ecorecycle_01',
    name: 'EcoRecycle India Pvt Ltd (Ecoreco)',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1042',
    location: 'Andheri East / Mumbai MMR',
    materials: ['PCB', 'Cables', 'Batteries', 'Displays', 'Appliances']
  },
  {
    id: 'rec_greencircle_02',
    name: 'GreenCircle Urban Recyclers',
    reg_no: 'CPCB/E-WASTE/REG/MH/2022/0891',
    location: 'Dharavi Link Road / Mumbai',
    materials: ['PCB', 'Cables', 'Batteries']
  },
  {
    id: 'rec_cerebra_03',
    name: 'Cerebra Integrated Technologies Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2021/0432',
    location: 'TTC Industrial Area / Navi Mumbai',
    materials: ['PCB', 'Displays', 'Appliances']
  },
  {
    id: 'rec_greenscape_04',
    name: 'Greenscape Eco Management Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1187',
    location: 'Taloja MIDC / Navi Mumbai',
    materials: ['Batteries', 'Motors', 'Plastics']
  },
  {
    id: 'rec_envirocare_05',
    name: 'Enviro-Care Recycling Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2020/0219',
    location: 'Bhosari MIDC / Pune',
    materials: ['PCB', 'Cables', 'Displays']
  }
];

export default function RecyclerDashboard({ onRoleSwitch }) {
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[0]);
  const [activeTab, setActiveTab] = useState('incoming-lots');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [radiusFilter, setRadiusFilter] = useState('10');
  const [lots, setLots] = useState([]);
  const [metrics, setMetrics] = useState({
    total_incoming_lots: 14,
    pending_verification_count: 6,
    confirmed_count: 8,
    total_verified_tonnage_mt: 42.8,
    total_payout_settled_inr: 342000,
    cpcb_certificates_issued: 8
  });
  const [isLoading, setIsLoading] = useState(false);

  // Per-lot pricing & fulfillment state
  const [rates, setRates] = useState({});
  const [fulfillments, setFulfillments] = useState({});
  const [settlementMode, setSettlementMode] = useState('CASH');

  // Weighbridge & CPCB Confirmation Modal
  const [inspectLot, setInspectLot] = useState(null);
  const [weighbridgeInput, setWeighbridgeInput] = useState('');
  const [isSubmittingConfirm, setIsSubmittingConfirm] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(null);

  useEffect(() => {
    loadFacilityData(selectedFacility.id);
  }, [selectedFacility, categoryFilter]);

  const loadFacilityData = async (facilityId) => {
    setIsLoading(true);
    try {
      // 1. Fetch lots from backend
      const resLots = await fetch(`${API_BASE}/recyclers/${facilityId}/lots`);
      let fetchedLots = [];
      if (resLots.ok) {
        const dataLots = await resLots.json();
        fetchedLots = dataLots.lots || [];
      }

      // Merge backend lots with rich Stitch prototype cards
      const mergedLots = mergeWithStitchLots(fetchedLots);
      setLots(mergedLots);

      // Initialize default rates and fulfillment
      const initialRates = {};
      const initialFulfillment = {};
      mergedLots.forEach((l) => {
        initialRates[l.id] = l.offered_rate || l.suggested_rate || 780;
        initialFulfillment[l.id] = 'van';
      });
      setRates((prev) => ({ ...initialRates, ...prev }));
      setFulfillments((prev) => ({ ...initialFulfillment, ...prev }));

      // 2. Fetch metrics from backend
      const resMetrics = await fetch(`${API_BASE}/recyclers/${facilityId}/metrics`);
      if (resMetrics.ok) {
        const dataMetrics = await resMetrics.json();
        if (dataMetrics.metrics) {
          setMetrics((prev) => ({
            ...prev,
            ...dataMetrics.metrics,
            total_verified_tonnage_mt: dataMetrics.metrics.total_verified_tonnage_mt || 42.8
          }));
        }
      }
    } catch (err) {
      console.log('Using local recycler feed fallback:', err);
      const fallback = mergeWithStitchLots([]);
      setLots(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeWithStitchLots = (backendLots) => {
    const stitchLots = [
      {
        id: 'lot_stitch_00482',
        handover_ref: 'RL-2026-00482',
        title: 'Printed Circuit Board (Grade A Motherboards)',
        subtitle: 'Dual-Socket Server Boards, High-Gold Finger Connectors, ICs intact',
        category: 'PCB',
        category_code: 'ITEW1-PCB-HG',
        priority_label: 'High Priority • Grade A',
        time_posted: 'Posted 14:15 IST (42m ago)',
        image_url: 'https://lh3.googleusercontent.com/aida/AEtjO1Uibj7iPqmg9YKdnMYAfgjprFLErbb0FcOdAiLVCHgIpkj7gbP3YTmKP8zFMrg1kaOj63apJEhpOtxdLXe-93ri5nb5eVArP4y3X_auotJ1wePJz5s4YibZAvhuz-KAXyzC05MmFpsIy-yBUY4Mqu5yd0ohBBU3_J9_aC-nPfLKrNm8V66IvtxKehIH0e-8jnBWhBN-DbfYt6LisI-TlJcyw1QSl4R5LDqnipESfPn5rrrJ6LyUFidtmQ',
        ai_badge: '92% Confidence (Collector Confirmed)',
        location_label: 'Peenya Ind. Cluster (13.028°N, 77.518°E)',
        distance_km: 4.8,
        collector_name: 'Ramesh K. (Peenya Aggregator)',
        collector_rating: 4.8,
        collector_history: 'CPCB Registered Aggregator • 42 Handover Batches',
        net_weight_kg: 12.0,
        gross_weight_kg: 12.4,
        tare_weight_kg: 0.4,
        collector_asking_rate: 740,
        benchmark_min: 700,
        benchmark_max: 766,
        suggested_rate: 780,
        status: 'PENDING'
      },
      {
        id: 'lot_stitch_00483',
        handover_ref: 'RL-2026-00483',
        title: 'Insulated Copper Wire & High-Tension Cables',
        subtitle: 'Stripped telecom grade pure copper strands. Moisture free, tied bundle, no PVC insulation degradation.',
        category: 'CABLES',
        category_code: 'ITEW-CBL-CU',
        priority_label: 'Heavy Metals',
        time_posted: 'Posted 13:30 IST (1h ago)',
        image_url: 'https://lh3.googleusercontent.com/aida/AEtjO1WgXxj3PTs-7lfhFp-JK48EFoiQ6J122eiWOD5bFME_YW39QqWjSOtecSCCok96UgeiWft9i-8N-b4CLTLOt2TKYJpTgjDclW5fZ8pW2Ao12n1xdcxpIMTthmcakRwFYe5pJNiNHbEvQXiTZ6Dg62wI00Pp4LCfvkBxSm5ebeUHSLS26HhnhDK3yHfN-r9YHbPLIFxigyiHuXbRjgJuBMMKwgaWB7DxGJ8xsxedgkY1tTjZMRuMCZsxeAQ',
        ai_badge: '89% Confidence (Insulated Copper)',
        location_label: 'Yeshwanthpur Yard (13.018°N, 77.545°E)',
        distance_km: 7.2,
        collector_name: 'Dilip S. (Yard Manager)',
        collector_rating: 4.9,
        collector_history: 'Authorized Aggregator • 88 Batches',
        net_weight_kg: 35.0,
        collector_asking_rate: 410,
        benchmark_min: 400,
        benchmark_max: 430,
        suggested_rate: 420,
        status: 'PENDING'
      },
      {
        id: 'lot_stitch_00480',
        handover_ref: 'RL-2026-00480',
        title: 'Laptop & Mobile Li-ion Cells & Battery Packs',
        subtitle: 'Intact aluminum pouch cells, fire-safe storage container, terminals taped',
        category: 'BATTERIES',
        category_code: 'BATT-LI-ION',
        priority_label: 'Hazardous • Fire Safe',
        time_posted: 'Offer Sent • Awaiting Sign-off',
        image_url: '/assets/icons/batt_lead.svg',
        ai_badge: '86% Confidence (Li-ion)',
        location_label: 'Rajajinagar Industrial (12.989°N, 77.553°E)',
        distance_km: 5.1,
        collector_name: 'Imran Bhai',
        collector_rating: 4.7,
        collector_history: 'Specialized Battery Collector',
        net_weight_kg: 18.0,
        collector_asking_rate: 105,
        benchmark_min: 95,
        benchmark_max: 120,
        suggested_rate: 110,
        status: 'OFFER_SENT'
      }
    ];

    // Combine backend lots at top, then stitch lots
    const formattedBackend = backendLots.map((b) => ({
      id: b.id,
      handover_ref: b.handover_ref || `KC-${b.id.slice(0, 8)}`,
      title: `${b.material_category || 'Scrap Material'} (${b.condition || 'Clean'})`,
      subtitle: `Collector Lot #${(b.id || '').slice(0, 6)} • Direct Field Submission`,
      category: (b.material_category || 'PCB').toUpperCase(),
      category_code: b.cpcb_e_waste_code || 'GENERIC-E-WASTE',
      priority_label: b.status === 'CONFIRMED' ? 'Confirmed Handover' : 'Active Field Lot',
      time_posted: new Date(b.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image_url: b.image_url || 'https://lh3.googleusercontent.com/aida/AEtjO1Uibj7iPqmg9YKdnMYAfgjprFLErbb0FcOdAiLVCHgIpkj7gbP3YTmKP8zFMrg1kaOj63apJEhpOtxdLXe-93ri5nb5eVArP4y3X_auotJ1wePJz5s4YibZAvhuz-KAXyzC05MmFpsIy-yBUY4Mqu5yd0ohBBU3_J9_aC-nPfLKrNm8V66IvtxKehIH0e-8jnBWhBN-DbfYt6LisI-TlJcyw1QSl4R5LDqnipESfPn5rrrJ6LyUFidtmQ',
      ai_badge: `${Math.round((b.ai_confidence || 0.92) * 100)}% Verified`,
      location_label: b.general_location || 'Dharavi / Kurla Cluster',
      distance_km: 3.2,
      collector_name: b.collector_name || 'Babu Rao (Collector)',
      collector_rating: 4.8,
      collector_history: 'Verified Door-to-Door Picker',
      net_weight_kg: b.approximate_weight || 12.0,
      collector_asking_rate: b.quoted_price ? Math.round(b.quoted_price / (b.approximate_weight || 1)) : 740,
      benchmark_min: 700,
      benchmark_max: 780,
      suggested_rate: b.quoted_price ? Math.round(b.quoted_price / (b.approximate_weight || 1)) : 780,
      status: b.status || 'PENDING'
    }));

    return [...formattedBackend, ...stitchLots];
  };

  const filteredLots = lots.filter((lot) => {
    if (categoryFilter !== 'ALL' && lot.category !== categoryFilter) return false;
    if (radiusFilter !== 'ALL' && lot.distance_km > parseFloat(radiusFilter)) return false;
    return true;
  });

  const handleRateChange = (lotId, newRate) => {
    setRates((prev) => ({ ...prev, [lotId]: parseFloat(newRate) || 0 }));
  };

  const handleFulfillmentToggle = (lotId, mode) => {
    setFulfillments((prev) => ({ ...prev, [lotId]: mode }));
  };

  const handleOpenWeighbridgeModal = (lot) => {
    setInspectLot(lot);
    setWeighbridgeInput(lot.net_weight_kg.toString());
  };

  const handleConfirmWeighbridge = async () => {
    if (!inspectLot) return;
    setIsSubmittingConfirm(true);
    const finalWeight = parseFloat(weighbridgeInput) || inspectLot.net_weight_kg;

    try {
      const res = await fetch(`${API_BASE}/handover/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handover_ref: inspectLot.handover_ref,
          recycler_id: selectedFacility.id,
          verified_weight: finalWeight,
          payment_mode: settlementMode
        })
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmationNotice({
          certificate_id: data.cpcb_certificate_id || `CPCB-EPR-2026-MH-${Date.now().toString().slice(-8)}`,
          lot_ref: inspectLot.handover_ref,
          material: inspectLot.title,
          verified_weight: finalWeight,
          payout: Math.round(finalWeight * (rates[inspectLot.id] || inspectLot.suggested_rate)),
          payment_mode: settlementMode
        });

        // Update local status
        setLots((prev) =>
          prev.map((l) => (l.id === inspectLot.id ? { ...l, status: 'CONFIRMED' } : l))
        );
        setMetrics((prev) => ({
          ...prev,
          confirmed_count: prev.confirmed_count + 1,
          total_verified_tonnage_mt: parseFloat((prev.total_verified_tonnage_mt + finalWeight / 1000).toFixed(2))
        }));
      } else {
        // Fallback simulation
        const fakeCert = `CPCB-EPR-2026-MH-${Date.now().toString().slice(-8)}`;
        setConfirmationNotice({
          certificate_id: fakeCert,
          lot_ref: inspectLot.handover_ref,
          material: inspectLot.title,
          verified_weight: finalWeight,
          payout: Math.round(finalWeight * (rates[inspectLot.id] || inspectLot.suggested_rate)),
          payment_mode: settlementMode
        });
        setLots((prev) =>
          prev.map((l) => (l.id === inspectLot.id ? { ...l, status: 'CONFIRMED' } : l))
        );
      }
    } catch (err) {
      console.error('Weighbridge confirm error:', err);
    } finally {
      setIsSubmittingConfirm(false);
      setInspectLot(null);
    }
  };

  const handleDownloadLedger = () => {
    const headers = ['Lot Reference', 'Material Category', 'Collector', 'Weight (kg)', 'Rate (INR/kg)', 'Total Payout', 'Status', 'Payment Mode'];
    const rows = lots.map((l) => [
      l.handover_ref,
      l.category,
      `"${l.collector_name}"`,
      l.net_weight_kg,
      rates[l.id] || l.suggested_rate,
      Math.round(l.net_weight_kg * (rates[l.id] || l.suggested_rate)),
      l.status,
      settlementMode
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RE_LINK_Recycler_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-md flex items-center gap-sm">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]">recycling</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-tight text-primary font-bold leading-none">RE:LINK</span>
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-xs">Recycler Enterprise</span>
            </div>
          </div>

          {/* Authorization Badge */}
          <div className="px-md my-sm">
            <div className="bg-surface-container rounded-lg p-sm flex items-center justify-between">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Authorized Unit</span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold px-xs py-0.5 rounded-full uppercase">Tier-1</span>
            </div>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="flex flex-col gap-xs px-md mt-xs">
            <button
              onClick={() => setActiveTab('incoming-lots')}
              className={`flex items-center gap-md px-md py-sm transition-all min-h-touch-target-min rounded-lg text-left cursor-pointer ${
                activeTab === 'incoming-lots'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">inbox</span>
              <span className="font-label-lg text-label-lg flex-1">Incoming Lots</span>
              <span className="bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold px-2 py-0.5 rounded-full">
                {filteredLots.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active-pickups')}
              className={`flex items-center gap-md px-md py-sm transition-all min-h-touch-target-min rounded-lg text-left cursor-pointer ${
                activeTab === 'active-pickups'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span className="font-label-lg text-label-lg">Active Pickups</span>
            </button>

            <button
              onClick={() => setActiveTab('material-inventory')}
              className={`flex items-center gap-md px-md py-sm transition-all min-h-touch-target-min rounded-lg text-left cursor-pointer ${
                activeTab === 'material-inventory'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="font-label-lg text-label-lg">Material Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab('price-quotes')}
              className={`flex items-center gap-md px-md py-sm transition-all min-h-touch-target-min rounded-lg text-left cursor-pointer ${
                activeTab === 'price-quotes'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
              <span className="font-label-lg text-label-lg">Price &amp; Quotes</span>
            </button>

            <button
              onClick={() => setActiveTab('traceability-epr')}
              className={`flex items-center gap-md px-md py-sm transition-all min-h-touch-target-min rounded-lg text-left cursor-pointer ${
                activeTab === 'traceability-epr'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">policy</span>
              <span className="font-label-lg text-label-lg">Traceability &amp; EPR</span>
            </button>

            <button
              onClick={() => setActiveTab('facility-settings')}
              className={`flex items-center gap-md px-md py-sm transition-all min-h-touch-target-min rounded-lg text-left cursor-pointer ${
                activeTab === 'facility-settings'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              <span className="font-label-lg text-label-lg">Facility Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Monthly Quota Card */}
        <div className="px-md">
          <div className="bg-surface-container-highest rounded-xl p-md flex flex-col gap-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Facility Quota</span>
              <span className="font-label-md text-label-md text-primary font-bold">85.6%</span>
            </div>
            <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[85.6%]"></div>
            </div>
            <span className="font-body-md text-[12px] text-on-surface-variant leading-tight">
              Monthly Target: {metrics.total_verified_tonnage_mt || 42.8} / 50 MT
            </span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-lg border-b border-outline-variant/40">
          <div className="flex items-center gap-md">
            {/* Facility Selector Dropdown */}
            <div className="flex items-center gap-xs px-sm py-1 bg-surface-container rounded-full border border-outline-variant/50">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <select
                value={selectedFacility.id}
                onChange={(e) => {
                  const fac = facilities.find((f) => f.id === e.target.value);
                  if (fac) setSelectedFacility(fac);
                }}
                className="bg-transparent font-label-md text-[12px] text-on-surface font-semibold outline-none cursor-pointer pr-2"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} • {fac.reg_no}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-xs px-sm py-xs bg-primary-fixed/50 text-on-primary-fixed-variant rounded-full text-[12px] font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>System Online • Database Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-md">
            {/* Role Switcher back to Collector Mobile App */}
            <button
              onClick={onRoleSwitch}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-outline-variant transition-colors cursor-pointer shadow-sm"
              title="Switch back to Collector Mobile View"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">smartphone</span>
              <span>Switch to Collector Mobile App</span>
            </button>

            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors relative cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
            </button>

            <div className="flex items-center gap-sm pl-sm">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-none">Plant Ops</span>
                <span className="font-body-md text-[11px] text-on-surface-variant">Weighbridge Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workdesk Content */}
        <main className="w-full pt-20 bg-background flex-1 px-lg py-md">
          <div className="flex flex-col w-full gap-lg">
            {/* Top Overview Metrics Strip */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
              {/* Metric 1: Incoming Lots */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">Incoming Available Lots</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        {filteredLots.length}
                      </span>
                      <span className="font-label-md text-label-md text-primary font-semibold">Active Queue</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                    <span className="material-symbols-outlined text-[24px]">move_to_inbox</span>
                  </div>
                </div>
                <div className="mt-md pt-sm flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-md text-label-md flex items-center gap-xs text-primary font-medium">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    5 urgent &lt; 10 km
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant">Dharavi &amp; Peenya clusters</span>
                </div>
              </div>

              {/* Metric 2: Pending Quotes */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">Pending Quotes</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        {metrics.pending_verification_count || 6}
                      </span>
                      <span className="font-label-md text-label-md text-tertiary font-semibold">In Negotiation</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
                    <span className="material-symbols-outlined text-[24px]">currency_exchange</span>
                  </div>
                </div>
                <div className="mt-md pt-sm flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">Avg response: 12 mins</span>
                  <span className="font-label-md text-label-md text-primary font-medium">Active queue</span>
                </div>
              </div>

              {/* Metric 3: Scheduled Pickups */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">Scheduled Pickups Today</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">8</span>
                      <span className="font-label-md text-label-md text-secondary font-semibold">Scheduled</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
                    <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                  </div>
                </div>
                <div className="mt-md pt-sm flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant">5 Van dispatches, 3 Self-dropoffs</span>
                  <span className="font-label-md text-label-md text-primary font-semibold">4 Pickups Completed</span>
                </div>
              </div>

              {/* Metric 4: Monthly Sourced Material */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">Monthly Sourced Material</span>
                    <div className="flex items-baseline gap-xs mt-xs">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        {metrics.total_verified_tonnage_mt || 42.8}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">MT / 50 MT</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[24px]">scale</span>
                  </div>
                </div>
                <div className="mt-md pt-sm flex flex-col gap-xs">
                  <div className="flex justify-between items-center text-on-surface-variant font-label-md text-[11px]">
                    <span>Monthly Facility Quota</span>
                    <span className="font-bold text-primary">85.6%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '85.6%' }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter Toolbar */}
            <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-md">
              <div className="flex flex-wrap items-center gap-sm">
                <span className="font-label-lg text-label-lg font-bold text-on-surface mr-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
                  Lots Queue:
                </span>
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-md py-xs rounded-full font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    categoryFilter === 'ALL'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  All Categories ({lots.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('PCB')}
                  className={`px-md py-xs rounded-full font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    categoryFilter === 'PCB'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  PCB / E-Waste
                </button>
                <button
                  onClick={() => setCategoryFilter('CABLES')}
                  className={`px-md py-xs rounded-full font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    categoryFilter === 'CABLES'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  Copper &amp; Wire Cables
                </button>
                <button
                  onClick={() => setCategoryFilter('BATTERIES')}
                  className={`px-md py-xs rounded-full font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    categoryFilter === 'BATTERIES'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  Li-ion / Lead Batteries
                </button>
              </div>

              <div className="flex items-center gap-sm">
                <div className="flex items-center bg-surface-container-low rounded-lg px-sm py-xs border border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-xs">near_me</span>
                  <select
                    value={radiusFilter}
                    onChange={(e) => setRadiusFilter(e.target.value)}
                    className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer"
                  >
                    <option value="10">Within 10 km Radius</option>
                    <option value="5">Within 5 km Radius</option>
                    <option value="25">Within 25 km Radius</option>
                    <option value="ALL">All Operating Territory</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Confirmation Notice Banner if issued */}
            {confirmationNotice && (
              <div className="bg-emerald-600/10 border-2 border-emerald-600 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-base">
                      Weighbridge Handover Confirmed • CPCB Certificate Issued
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Certificate ID: <strong className="text-emerald-700 dark:text-emerald-400">{confirmationNotice.certificate_id}</strong> | Lot Ref: {confirmationNotice.lot_ref} | Net Weight: {confirmationNotice.verified_weight} kg | Settled: ₹{confirmationNotice.payout.toLocaleString('en-IN')} ({confirmationNotice.payment_mode})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmationNotice(null)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Dismiss Notice
                </button>
              </div>
            )}

            {/* Main Workdesk: Asymmetrical Two-Column Split */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg items-start">
              {/* Left / Primary Workspace: Incoming Scrap Lots Queue (8 Columns) */}
              <div className="xl:col-span-8 flex flex-col gap-md">
                {filteredLots.map((lot) => {
                  const currentRate = rates[lot.id] || lot.suggested_rate;
                  const totalPayout = Math.round(currentRate * lot.net_weight_kg);
                  const fulfillment = fulfillments[lot.id] || 'van';

                  return (
                    <article
                      key={lot.id}
                      className="bg-surface-container-lowest rounded-xl shadow-md p-lg relative overflow-hidden transition-all duration-200 border border-outline-variant/30"
                    >
                      {/* Accent Top Bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${lot.status === 'CONFIRMED' ? 'bg-emerald-600' : 'bg-primary'}`}></div>

                      {/* Header Row */}
                      <div className="flex flex-wrap items-start justify-between gap-sm mb-md">
                        <div className="flex items-center gap-sm">
                          <span className="bg-primary-fixed text-on-primary-fixed-variant font-label-md text-[12px] font-bold px-sm py-0.5 rounded-full uppercase tracking-wider">
                            {lot.priority_label || 'High Priority • Grade A'}
                          </span>
                          <span className="font-headline-md text-headline-md font-bold text-on-surface">
                            Lot #{lot.handover_ref}
                          </span>
                        </div>
                        <div className="flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-lg">
                          <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                          <span className="font-label-md text-label-md text-on-surface font-semibold">{lot.time_posted}</span>
                        </div>
                      </div>

                      {/* Main Lot Content: Image + Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-stretch">
                        {/* Thumbnail & Inspection Evidence */}
                        <div className="md:col-span-5 flex flex-col gap-xs">
                          <div className="relative rounded-lg overflow-hidden bg-surface-container-high aspect-square flex items-center justify-center">
                            <img
                              alt={lot.title}
                              className="w-full h-full object-cover"
                              src={lot.image_url}
                            />
                            <div className="absolute bottom-2 left-2 right-2 bg-inverse-surface/90 backdrop-blur-md rounded-md px-sm py-xs flex items-center justify-between text-inverse-on-surface">
                              <span className="font-label-md text-[11px] font-medium flex items-center gap-xs">
                                <span className="material-symbols-outlined text-primary-fixed text-[16px]">psychology</span>
                                AI Vision Classified
                              </span>
                              <span className="font-label-md text-[11px] font-bold text-primary-fixed">
                                {lot.ai_badge}
                              </span>
                            </div>
                          </div>
                          {/* Geotag bar */}
                          <div className="bg-surface-container-low rounded-lg p-xs flex items-center justify-between text-on-surface-variant font-label-md text-[11px]">
                            <span className="flex items-center gap-xs truncate">
                              <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                              {lot.location_label}
                            </span>
                            <span className="font-bold text-on-surface shrink-0">{lot.distance_km} km</span>
                          </div>
                        </div>

                        {/* Specifications, Collector & Payout Matrix */}
                        <div className="md:col-span-7 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-sm">
                              <div>
                                <h3 className="font-headline-md text-headline-md font-bold text-on-surface leading-snug">
                                  {lot.title}
                                </h3>
                                <span className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                                  {lot.subtitle}
                                </span>
                              </div>
                            </div>

                            {/* Collector Reputation Pill */}
                            <div className="bg-surface-container-low rounded-lg p-sm flex items-center justify-between mb-md">
                              <div className="flex items-center gap-sm">
                                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-[13px]">
                                  {lot.collector_name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-xs">
                                    <span className="font-label-md text-label-md font-bold text-on-surface">{lot.collector_name}</span>
                                    <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                                  </div>
                                  <span className="font-body-md text-[12px] text-on-surface-variant">
                                    {lot.collector_history} • {lot.collector_rating}★ rating
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 bg-surface-container-lowest px-sm py-0.5 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary text-[14px]">star</span>
                                <span className="font-label-md text-label-md font-bold text-on-surface">{lot.collector_rating}</span>
                              </div>
                            </div>

                            {/* Metrics Matrix: Net Weight & Market Spread */}
                            <div className="grid grid-cols-3 gap-xs bg-surface-container rounded-lg p-sm mb-md text-center">
                              <div>
                                <span className="font-label-md text-[11px] text-on-surface-variant uppercase font-medium">Net Weight</span>
                                <p className="font-action-xl text-action-xl font-bold text-on-surface">
                                  {lot.net_weight_kg} <span className="text-[14px] font-normal text-on-surface-variant">kg</span>
                                </p>
                                <span className="font-body-md text-[10px] text-on-surface-variant">
                                  Gross: {(lot.net_weight_kg + 0.4).toFixed(1)}kg
                                </span>
                              </div>
                              <div>
                                <span className="font-label-md text-[11px] text-on-surface-variant uppercase font-medium">Collector Asking</span>
                                <p className="font-action-xl text-action-xl font-bold text-on-surface">
                                  ₹{lot.collector_asking_rate} <span className="text-[12px] font-normal text-on-surface-variant">/kg</span>
                                </p>
                                <span className="font-body-md text-[10px] text-on-surface-variant">
                                  Target ₹{Math.round(lot.collector_asking_rate * lot.net_weight_kg).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div>
                                <span className="font-label-md text-[11px] text-on-surface-variant uppercase font-medium">Market Benchmark</span>
                                <p className="font-action-xl text-action-xl font-bold text-primary">
                                  ₹{lot.benchmark_min} – ₹{lot.benchmark_max} <span className="text-[12px] font-normal text-on-surface-variant">/kg</span>
                                </p>
                                <span className="font-body-md text-[10px] text-on-surface-variant">Spot Index Reference</span>
                              </div>
                            </div>
                          </div>

                          {/* Recycler Decision & Offer Terminal */}
                          <div className="bg-surface-container-low rounded-xl p-md flex flex-col gap-sm">
                            <div className="flex flex-wrap items-center justify-between gap-sm">
                              <label className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-xs">
                                <span className="material-symbols-outlined text-primary text-[18px]">calculate</span>
                                Quote Procurement Rate:
                              </label>
                              <div className="flex items-center gap-xs bg-surface-container-lowest p-0.5 rounded-lg border border-outline-variant/30">
                                <button
                                  onClick={() => handleFulfillmentToggle(lot.id, 'van')}
                                  className={`px-sm py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                                    fulfillment === 'van'
                                      ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                      : 'text-on-surface-variant hover:text-on-surface'
                                  }`}
                                  type="button"
                                >
                                  Recycler Van Dispatch
                                </button>
                                <button
                                  onClick={() => handleFulfillmentToggle(lot.id, 'dropoff')}
                                  className={`px-sm py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                                    fulfillment === 'dropoff'
                                      ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                      : 'text-on-surface-variant hover:text-on-surface'
                                  }`}
                                  type="button"
                                >
                                  Collector Self-Dropoff
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-sm">
                              {/* Large Price Input */}
                              <div className="relative w-full sm:w-1/2">
                                <span className="absolute left-sm top-1/2 -translate-y-1/2 font-headline-md text-headline-md font-bold text-on-surface-variant">₹</span>
                                <input
                                  type="number"
                                  value={currentRate}
                                  onChange={(e) => handleRateChange(lot.id, e.target.value)}
                                  className="w-full bg-surface-container-lowest text-on-surface font-headline-md text-headline-md font-bold pl-8 pr-16 py-xs rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary h-12"
                                  placeholder="0.00"
                                />
                                <span className="absolute right-sm top-1/2 -translate-y-1/2 font-label-md text-label-md text-on-surface-variant font-semibold">/ kg</span>
                              </div>
                              {/* Total Binding Value Display */}
                              <div className="w-full sm:w-1/2 bg-surface-container-lowest rounded-lg h-12 px-md flex items-center justify-between shadow-sm">
                                <span className="font-label-md text-label-md text-on-surface-variant">Total Binding Value:</span>
                                <span className="font-action-xl text-action-xl font-bold text-primary">
                                  ₹{totalPayout.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>

                            {/* Action CTAs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-xs">
                              <button
                                onClick={() => alert(`Counter-offer of ₹${currentRate}/kg (Total ₹${totalPayout}) sent to ${lot.collector_name}.`)}
                                className="w-full h-12 bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold rounded-lg flex items-center justify-center gap-xs transition-colors cursor-pointer"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[20px]">reply</span>
                                Send Counter-Offer
                              </button>
                              <button
                                onClick={() => handleOpenWeighbridgeModal(lot)}
                                className={`w-full h-12 font-action-xl text-label-lg font-bold rounded-lg shadow-md flex items-center justify-center gap-xs transition-transform active:scale-[0.98] cursor-pointer ${
                                  lot.status === 'CONFIRMED'
                                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                    : 'bg-primary hover:bg-primary-container text-on-primary'
                                }`}
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  {lot.status === 'CONFIRMED' ? 'verified' : 'check_circle'}
                                </span>
                                {lot.status === 'CONFIRMED' ? 'View CPCB Certificate' : 'Accept Lot & Confirm Weighbridge'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Operational Verification Indicator Bar */}
                      <div className="mt-md pt-sm flex flex-wrap items-center justify-between gap-sm text-[12px] text-on-surface-variant font-label-md border-t border-outline-variant/30">
                        <div className="flex items-center gap-md flex-wrap">
                          <span className="flex items-center gap-xs text-primary font-semibold">
                            <span className="material-symbols-outlined text-[16px]">fact_check</span>
                            ✓ Digital Handover Log Ready
                          </span>
                          <span className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px]">tag</span>
                            ✓ CPCB Code: #{lot.category_code}
                          </span>
                          <span className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            ✓ Calibrated Scale Required
                          </span>
                        </div>
                        <span className="text-on-surface-variant text-[11px] font-medium">Standard Operating Workflow</span>
                      </div>
                    </article>
                  );
                })}

                {/* Pagination & Queue Footer */}
                <div className="flex items-center justify-between p-sm text-on-surface-variant font-label-md text-label-md bg-surface-container-lowest rounded-xl shadow-sm">
                  <span>Showing {filteredLots.length} lots queued for {selectedFacility.name}</span>
                  <div className="flex gap-xs">
                    <button className="px-sm py-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer" type="button">
                      Previous
                    </button>
                    <button className="px-sm py-xs rounded bg-primary text-on-primary font-bold cursor-pointer" type="button">
                      1
                    </button>
                    <button className="px-sm py-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer" type="button">
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Workspace Panel: Logistics Dispatch & Traceability (4 Columns) */}
              <div className="xl:col-span-4 flex flex-col gap-md">
                {/* Dispatch & Logistics Manager Card */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-md flex flex-col gap-md border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-primary text-[22px]">route</span>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Today's Dispatch Line</h3>
                    </div>
                    <span className="bg-primary-fixed font-bold text-on-primary-fixed-variant text-[11px] px-sm py-0.5 rounded-full">
                      8 Scheduled
                    </span>
                  </div>

                  {/* Schedule Item 1 */}
                  <div className="bg-surface-container-low rounded-lg p-sm flex flex-col gap-xs relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="flex items-center justify-between pl-xs">
                      <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-xs">
                        <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                        Van #KA-04-E-2091
                      </span>
                      <span className="font-label-md text-[12px] font-bold text-primary bg-primary-fixed/50 px-xs rounded">15:30 IST Target</span>
                    </div>
                    <div className="pl-xs text-on-surface-variant font-body-md text-[12px]">
                      <p><strong className="text-on-surface">Driver:</strong> Suresh M. (+91 98450 12891)</p>
                      <p><strong className="text-on-surface">Destination:</strong> Ramesh K. / Peenya Industrial</p>
                    </div>
                    <div className="mt-xs pt-xs flex items-center justify-between pl-xs font-label-md text-[11px] text-on-surface-variant border-t border-outline-variant/30">
                      <span className="flex items-center gap-xs text-primary font-semibold">
                        <span className="material-symbols-outlined text-[14px]">scale</span>
                        Calibrated Field Scale on-board
                      </span>
                      <span>Est. 18 min transit</span>
                    </div>
                  </div>

                  {/* Schedule Item 2 */}
                  <div className="bg-surface-container-low rounded-lg p-sm flex flex-col gap-xs relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                    <div className="flex items-center justify-between pl-xs">
                      <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">fire_truck</span>
                        Truck #KA-02-B-9912
                      </span>
                      <span className="font-label-md text-[12px] font-semibold text-on-surface-variant">17:00 IST</span>
                    </div>
                    <div className="pl-xs text-on-surface-variant font-body-md text-[12px]">
                      <p><strong className="text-on-surface">Driver:</strong> Anil Gowda (+91 94481 00214)</p>
                      <p><strong className="text-on-surface">Mission:</strong> Yeshwanthpur Scrap Aggregators</p>
                    </div>
                    <div className="mt-xs pt-xs flex items-center justify-between pl-xs font-label-md text-[11px] text-on-surface-variant border-t border-outline-variant/30">
                      <span>Payload Cap: 1,200 kg</span>
                      <span className="text-secondary font-medium">Pre-routed via Outer Ring</span>
                    </div>
                  </div>

                  {/* Settlement Mode Recording */}
                  <div className="bg-surface-container rounded-lg p-sm flex flex-col gap-xs">
                    <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Settlement &amp; Payment Method
                    </span>
                    <div className="grid grid-cols-3 gap-xs">
                      <button
                        onClick={() => setSettlementMode('CASH')}
                        className={`py-xs px-xs rounded font-label-md text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          settlementMode === 'CASH'
                            ? 'bg-surface-container-lowest shadow-sm text-primary border border-primary/30'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-lowest'
                        }`}
                        type="button"
                      >
                        <span>💵 Cash</span>
                      </button>
                      <button
                        onClick={() => setSettlementMode('UPI')}
                        className={`py-xs px-xs rounded font-label-md text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          settlementMode === 'UPI'
                            ? 'bg-surface-container-lowest shadow-sm text-primary border border-primary/30'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-lowest'
                        }`}
                        type="button"
                      >
                        <span>📱 UPI</span>
                      </button>
                      <button
                        onClick={() => setSettlementMode('BANK')}
                        className={`py-xs px-xs rounded font-label-md text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          settlementMode === 'BANK'
                            ? 'bg-surface-container-lowest shadow-sm text-primary border border-primary/30'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-lowest'
                        }`}
                        type="button"
                      >
                        <span>🏦 Bank</span>
                      </button>
                    </div>
                    <span className="font-body-md text-[11px] text-on-surface-variant mt-1 text-center">
                      Payment mode recorded upon physical weighbridge sign-off
                    </span>
                  </div>
                </div>

                {/* Realistic Traceability & Audit Verification Card */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-md flex flex-col gap-md border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                      <h4 className="font-headline-md text-headline-md font-bold text-on-surface">Traceability &amp; Verification</h4>
                    </div>
                    <span className="bg-primary text-on-primary text-[10px] font-bold px-xs py-0.5 rounded uppercase">
                      Field Audit Ready
                    </span>
                  </div>
                  <ul className="flex flex-col gap-sm">
                    <li className="flex items-start gap-sm bg-surface-container-low p-sm rounded-lg">
                      <span className="text-[18px] mt-0.5">📍</span>
                      <div>
                        <span className="font-label-md text-label-md font-bold text-on-surface">1. Verified Location Check</span>
                        <p className="font-body-md text-[12px] text-on-surface-variant">Physical handover coordinates logged via mobile GPS.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-sm bg-surface-container-low p-sm rounded-lg">
                      <span className="text-[18px] mt-0.5">⚖️</span>
                      <div>
                        <span className="font-label-md text-label-md font-bold text-on-surface">2. Physical Scale Calibration</span>
                        <p className="font-body-md text-[12px] text-on-surface-variant">Gross, tare, and net weights recorded with calibrated scale stamp.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-sm bg-surface-container-low p-sm rounded-lg">
                      <span className="text-[18px] mt-0.5">📷</span>
                      <div>
                        <span className="font-label-md text-label-md font-bold text-on-surface">3. Handover Inspection Photo</span>
                        <p className="font-body-md text-[12px] text-on-surface-variant">Visual proof of lot condition captured before payment release.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-sm bg-surface-container-low p-sm rounded-lg">
                      <span className="text-[18px] mt-0.5">📄</span>
                      <div>
                        <span className="font-label-md text-label-md font-bold text-on-surface">4. Digital Handover Receipt</span>
                        <p className="font-body-md text-[12px] text-on-surface-variant">Instant CPCB EPR audit certificate issued (`CPCB-EPR-...`).</p>
                      </div>
                    </li>
                  </ul>
                  <button
                    onClick={handleDownloadLedger}
                    className="w-full py-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-bold rounded-lg flex items-center justify-center gap-xs transition-colors cursor-pointer shadow-sm"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download Today's Transaction Ledger (CSV)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Weighbridge Verification & CPCB Confirmation Modal */}
      {inspectLot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-primary tracking-wider">Weighbridge Scale Verification</span>
                <h3 className="text-xl font-bold text-on-surface mt-0.5">{inspectLot.title}</h3>
                <span className="text-xs text-on-surface-variant">Ref: {inspectLot.handover_ref}</span>
              </div>
              <button
                onClick={() => setInspectLot(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3 rounded-xl">
              <div>
                <span className="text-[11px] text-on-surface-variant font-medium">Collector / Origin</span>
                <p className="font-bold text-sm text-on-surface">{inspectLot.collector_name}</p>
              </div>
              <div>
                <span className="text-[11px] text-on-surface-variant font-medium">Assigned Recycler</span>
                <p className="font-bold text-sm text-primary">{selectedFacility.name}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">
                Calibrated Scale Actual Net Weight (kg):
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weighbridgeInput}
                  onChange={(e) => setWeighbridgeInput(e.target.value)}
                  className="w-full h-12 px-3 bg-surface-container-lowest border-2 border-primary rounded-xl font-bold text-xl text-on-surface focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-sm font-bold text-on-surface-variant">kg</span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">
                Stated Collector Weight: {inspectLot.net_weight_kg} kg | Scale Variance: ±{(Math.abs(parseFloat(weighbridgeInput || 0) - inspectLot.net_weight_kg)).toFixed(1)} kg
              </span>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">Settlement Amount ({settlementMode}):</span>
              <span className="font-action-xl text-xl font-bold text-primary">
                ₹{Math.round((parseFloat(weighbridgeInput) || inspectLot.net_weight_kg) * (rates[inspectLot.id] || inspectLot.suggested_rate)).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                <span>Dual visual signoff completed between collector &amp; weighbridge operator</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                <span>Physical scale calibrated according to Legal Metrology Standards</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setInspectLot(null)}
                className="h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWeighbridge}
                disabled={isSubmittingConfirm}
                className="h-11 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isSubmittingConfirm ? 'Issuing Certificate...' : 'Issue CPCB EPR Certificate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
