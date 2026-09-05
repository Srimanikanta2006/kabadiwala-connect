import React, { useState, useEffect } from 'react';
import { getRecentOfflineLots } from '../db/offlineDb';
import Form6ManifestModal from './recycler/Form6ManifestModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const INITIAL_FACILITIES = [
  {
    id: 'rec_ecorecycle_01',
    name: 'EcoRecycle India Pvt Ltd (Ecoreco)',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1042',
    location: 'Andheri East / Mumbai MMR',
    materials: ['PCB', 'Cables', 'Batteries', 'Displays', 'Appliances'],
    tier: 'Tier-1'
  },
  {
    id: 'rec_greencircle_02',
    name: 'GreenCircle Urban Recyclers',
    reg_no: 'CPCB/E-WASTE/REG/MH/2022/0891',
    location: 'Dharavi Link Road / Mumbai',
    materials: ['PCB', 'Cables', 'Batteries'],
    tier: 'Tier-1'
  },
  {
    id: 'rec_cerebra_03',
    name: 'Cerebra Integrated Technologies Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2021/0432',
    location: 'TTC Industrial Area / Navi Mumbai',
    materials: ['PCB', 'Displays', 'Appliances'],
    tier: 'Tier-1'
  },
  {
    id: 'rec_greenscape_04',
    name: 'Greenscape Eco Management Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1187',
    location: 'Taloja MIDC / Navi Mumbai',
    materials: ['Batteries', 'Motors', 'Plastics'],
    tier: 'Tier-2'
  },
  {
    id: 'rec_envirocare_05',
    name: 'Enviro-Care Recycling Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2020/0219',
    location: 'Bhosari MIDC / Pune',
    materials: ['PCB', 'Cables', 'Displays'],
    tier: 'Tier-1'
  }
];

export default function RecyclerDashboard({ onRoleSwitch }) {
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[0]);
  const [activeTab, setActiveTab] = useState('incoming-lots');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [radiusFilter, setRadiusFilter] = useState('10');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const [selectedManifestData, setSelectedManifestData] = useState(null);

  useEffect(() => {
    loadFacilityData(selectedFacility.id);
  }, [selectedFacility, categoryFilter]);

  const loadFacilityData = async (facilityId) => {
    setIsLoading(true);
    try {
      // 1. Fetch lots from backend
      let fetchedLots = [];
      try {
        const resLots = await fetch(`${API_BASE}/recyclers/${facilityId}/lots`);
        if (resLots.ok) {
          const dataLots = await resLots.json();
          fetchedLots = dataLots.lots || [];
        }
      } catch (e) {
        console.log('Backend lots fetch skipped/offline:', e);
      }

      // Also get any newly created lots from local offlineDb (instant cross-portal handshake)
      try {
        const localLots = await getRecentOfflineLots(10);
        if (localLots && localLots.length > 0) {
          for (const ll of localLots) {
            if (!fetchedLots.some(fl => fl.id === ll.id || fl.handover_ref === ll.handover_ref)) {
              fetchedLots.unshift({
                id: ll.id,
                handover_ref: ll.handover_ref || `RL-2026-${ll.id.slice(0, 5).toUpperCase()}`,
                material_category: ll.material_category || 'PCB',
                material_id: ll.material_id || 'mat_pcb_high',
                approximate_weight: ll.approximate_weight || 12.0,
                condition: ll.condition || 'Good / Intact',
                quoted_price: ll.quoted_price || 8400,
                image_url: ll.photo_base64 || ll.image_url || ll.image_data_url || 'https://lh3.googleusercontent.com/aida/AEtjO1Uibj7iPqmg9YKdnMYAfgjprFLErbb0FcOdAiLVCHgIpkj7gbP3YTmKP8zFMrg1kaOj63apJEhpOtxdLXe-93ri5nb5eVArP4y3X_auotJ1wePJz5s4YibZAvhuz-KAXyzC05MmFpsIy-yBUY4Mqu5yd0ohBBU3_J9_aC-nPfLKrNm8V66IvtxKehIH0e-8jnBWhBN-DbfYt6LisI-TlJcyw1QSl4R5LDqnipESfPn5rrrJ6LyUFidtmQ',
                ai_confidence: ll.ai_confidence || 0.92,
                status: ll.status || 'PENDING',
                created_at: ll.created_at || new Date().toISOString(),
                general_location: 'Peenya / Dharavi Aggregation Yard'
              });
            }
          }
        }
      } catch (dbErr) {
        console.log('Local lots merge notice:', dbErr);
      }

      // Merge backend & local lots with rich Stitch prototype cards
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
        ai_badge: '92% AI Vision Verified',
        location_label: 'Peenya Ind. Cluster (13.028°N, 77.518°E)',
        distance_km: 4.8,
        collector_name: 'Ramesh K. (Peenya Aggregator)',
        collector_rating: 4.8,
        collector_history: 'CPCB Registered Aggregator • 42 Handover Batches',
        net_weight_kg: 12.0,
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
        ai_badge: '89% AI Vision Verified',
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
        ai_badge: '86% AI Vision Verified',
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
    const formattedBackend = backendLots.slice(0, 10).map((b, idx) => {
      const lotId = b.id || b.lot_id || `lot_backend_${idx}`;
      return {
        id: lotId,
        handover_ref: b.handover_ref || `KC-${lotId.slice(0, 8)}`,
        title: `${b.material_category || 'Scrap Material'} (${b.condition || 'Clean'})`,
        subtitle: `Collector Lot #${lotId.slice(0, 6)} • Direct Field Submission`,
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
      };
    });

    const seenIds = new Set();
    const uniqueLots = [];
    for (const lot of [...formattedBackend, ...stitchLots]) {
      if (lot.id && !seenIds.has(lot.id)) {
        seenIds.add(lot.id);
        uniqueLots.push(lot);
      }
    }

    return uniqueLots;
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

  const navItems = [
    { id: 'incoming-lots', label: 'Incoming Lots', icon: 'inbox', badge: filteredLots.length },
    { id: 'active-pickups', label: 'Active Pickups', icon: 'local_shipping', badge: '8' },
    { id: 'material-inventory', label: 'Material Inventory', icon: 'inventory_2', badge: null },
    { id: 'price-quotes', label: 'Price & Quotes', icon: 'currency_rupee', badge: null },
    { id: 'traceability-epr', label: 'Traceability & EPR', icon: 'policy', badge: 'CPCB' },
    { id: 'facility-settings', label: 'Facility Settings', icon: 'tune', badge: null }
  ];

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between py-4 shadow-sm border-r border-outline-variant/30 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[20px]">recycling</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md tracking-tight text-primary font-bold leading-none">
                  RE:LINK
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Recycler Enterprise
                </span>
              </div>
            </div>
            {/* Close button for mobile drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Authorization Badge */}
          <div className="px-4 my-3">
            <div className="bg-surface-container rounded-lg p-2.5 flex items-center justify-between border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold text-xs">
                  Authorized Facility
                </span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {selectedFacility.tier || 'Tier-1'}
              </span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col gap-1 px-3 mt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer font-label-lg text-sm ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-on-primary-container'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Monthly Quota Card */}
        <div className="px-4">
          <div className="bg-surface-container-highest rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                Monthly Quota
              </span>
              <span className="font-label-md text-xs text-primary font-bold">85.6%</span>
            </div>
            <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '85.6%' }}></div>
            </div>
            <span className="font-body-md text-[11px] text-on-surface-variant leading-tight">
              Target: {metrics.total_verified_tonnage_mt || 42.8} / 50 MT
            </span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.03)] z-30 flex items-center justify-between px-4 sm:px-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              title="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Facility Selector Dropdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant/40 max-w-[200px] sm:max-w-[280px] md:max-w-[360px]">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified_user</span>
              <select
                value={selectedFacility.id}
                onChange={(e) => {
                  const fac = facilities.find((f) => f.id === e.target.value);
                  if (fac) setSelectedFacility(fac);
                }}
                className="bg-transparent font-label-md text-xs text-on-surface font-semibold outline-none cursor-pointer truncate w-full"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name}
                  </option>
                ))}
              </select>
            </div>

            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary-fixed/40 text-on-primary-fixed-variant rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Online • CPCB Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher to Collector Mobile App */}
            <button
              onClick={onRoleSwitch}
              className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary/20 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Switch back to Collector Mobile View"
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              <span className="hidden sm:inline">Collector App</span>
            </button>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors relative cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                OP
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="font-label-md text-xs text-on-surface font-semibold leading-tight">Plant Ops</span>
                <span className="font-body-md text-[10px] text-on-surface-variant">Weighbridge Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workdesk Content */}
        <main className="w-full pt-20 px-4 sm:px-6 pb-12 flex-1 max-w-7xl mx-auto space-y-6">
          {/* Top Overview Metrics Strip */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Incoming Lots */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">Incoming Lots</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                      {filteredLots.length}
                    </span>
                    <span className="font-label-md text-xs text-primary font-semibold">Active</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                  <span className="material-symbols-outlined text-[22px]">move_to_inbox</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/20">
                <span className="flex items-center gap-1 text-primary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  5 urgent &lt; 10 km
                </span>
                <span>Active Clusters</span>
              </div>
            </div>

            {/* Metric 2: Pending Quotes */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">Pending Quotes</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                      {metrics.pending_verification_count || 6}
                    </span>
                    <span className="font-label-md text-xs text-tertiary font-semibold">In Bidding</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/20">
                <span>Avg response: 12m</span>
                <span className="text-primary font-medium">Negotiation Open</span>
              </div>
            </div>

            {/* Metric 3: Scheduled Pickups */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">Pickups Scheduled</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">8</span>
                    <span className="font-label-md text-xs text-secondary font-semibold">Runs Today</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/20">
                <span>5 Vans, 3 Dropoffs</span>
                <span className="text-primary font-semibold">4 Completed</span>
              </div>
            </div>

            {/* Metric 4: Monthly Sourced Material */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-md text-xs text-on-surface-variant font-medium">Monthly Sourced</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                      {metrics.total_verified_tonnage_mt || 42.8}
                    </span>
                    <span className="font-label-md text-xs text-on-surface-variant">/ 50 MT</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[22px]">scale</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex flex-col gap-1 border-t border-outline-variant/20">
                <div className="flex justify-between items-center text-on-surface-variant text-[10px]">
                  <span>Facility Quota</span>
                  <span className="font-bold text-primary">85.6%</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '85.6%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Confirmation Notice Banner if issued */}
          {confirmationNotice && (
            <div className="bg-emerald-600/10 border-2 border-emerald-600 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm sm:text-base">
                    Weighbridge Handover Confirmed • CPCB Certificate Issued
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Cert ID: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{confirmationNotice.certificate_id}</strong> | Lot: {confirmationNotice.lot_ref} | Net: {confirmationNotice.verified_weight} kg | Payout: ₹{confirmationNotice.payout.toLocaleString('en-IN')} ({confirmationNotice.payment_mode})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedManifestData(confirmationNotice)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>View Form-6 Manifest</span>
                </button>
                <button
                  onClick={() => setConfirmationNotice(null)}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: INCOMING LOTS (CORE WORKFLOW) */}
          {activeTab === 'incoming-lots' && (
            <div className="space-y-6">
              {/* Filter Toolbar */}
              <section className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 border border-outline-variant/30">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-lg text-xs font-bold text-on-surface mr-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">filter_list</span>
                    Category:
                  </span>
                  {[
                    { id: 'ALL', label: `All Lots (${lots.length})` },
                    { id: 'PCB', label: 'Circuit Boards' },
                    { id: 'CABLES', label: 'Copper Cables' },
                    { id: 'BATTERIES', label: 'Batteries' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        categoryFilter === cat.id
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      type="button"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[16px] mr-1.5">near_me</span>
                    <select
                      value={radiusFilter}
                      onChange={(e) => setRadiusFilter(e.target.value)}
                      className="bg-transparent text-xs text-on-surface font-medium outline-none cursor-pointer"
                    >
                      <option value="10">Within 10 km Radius</option>
                      <option value="5">Within 5 km Radius</option>
                      <option value="25">Within 25 km Radius</option>
                      <option value="ALL">All Territory</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Main Two-Column Workdesk Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Lots Queue (8 Columns) */}
                <div className="lg:col-span-8 space-y-4">
                  {filteredLots.length === 0 ? (
                    <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/30">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">inbox</span>
                      <p className="mt-2 text-sm font-semibold text-on-surface">No lots matching your filter</p>
                      <button
                        onClick={() => {
                          setCategoryFilter('ALL');
                          setRadiusFilter('ALL');
                        }}
                        className="mt-3 px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredLots.map((lot) => {
                      const currentRate = rates[lot.id] || lot.suggested_rate;
                      const totalPayout = Math.round(currentRate * lot.net_weight_kg);
                      const fulfillment = fulfillments[lot.id] || 'van';

                      return (
                        <article
                          key={lot.id}
                          className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 border border-outline-variant/30 relative overflow-hidden"
                        >
                          {/* Accent Top Color Stripe */}
                          <div
                            className={`absolute top-0 left-0 right-0 h-1.5 ${
                              lot.status === 'CONFIRMED' ? 'bg-emerald-600' : 'bg-primary'
                            }`}
                          ></div>

                          {/* Header Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {lot.priority_label || 'Grade A'}
                              </span>
                              <span className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
                                Lot #{lot.handover_ref}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-md text-xs text-on-surface-variant font-medium">
                              <span className="material-symbols-outlined text-primary text-[15px]">schedule</span>
                              <span>{lot.time_posted}</span>
                            </div>
                          </div>

                          {/* Responsive Card Body: Side-by-Side on sm+, stacked on tiny */}
                          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                            {/* Left Image Column */}
                            <div className="w-full sm:w-52 shrink-0 flex flex-col gap-2">
                              <div className="relative rounded-lg overflow-hidden bg-surface-container-high h-44 sm:h-auto sm:flex-1 min-h-[160px] flex items-center justify-center border border-outline-variant/20">
                                <img
                                  alt={lot.title}
                                  className="w-full h-full object-cover"
                                  src={lot.image_url}
                                />
                                <div className="absolute bottom-2 left-2 right-2 bg-inverse-surface/90 backdrop-blur-md rounded px-2 py-1 flex items-center justify-between text-inverse-on-surface text-[10px]">
                                  <span className="flex items-center gap-1 font-medium">
                                    <span className="material-symbols-outlined text-primary-fixed text-[14px]">psychology</span>
                                    AI Vision
                                  </span>
                                  <span className="font-bold text-primary-fixed">{lot.ai_badge}</span>
                                </div>
                              </div>
                              <div className="bg-surface-container-low rounded-md px-2 py-1 flex items-center justify-between text-on-surface-variant text-[11px]">
                                <span className="flex items-center gap-1 truncate mr-1">
                                  <span className="material-symbols-outlined text-primary text-[14px]">location_on</span>
                                  <span className="truncate">{lot.location_label}</span>
                                </span>
                                <span className="font-bold text-on-surface shrink-0">{lot.distance_km} km</span>
                              </div>
                            </div>

                            {/* Right Details Column */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                              <div>
                                <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-tight">
                                  {lot.title}
                                </h3>
                                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                                  {lot.subtitle}
                                </p>

                                {/* Collector Profile Card */}
                                <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between mt-2.5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface font-bold text-xs flex items-center justify-center shrink-0">
                                      {lot.collector_name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-on-surface truncate">
                                          {lot.collector_name}
                                        </span>
                                        <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                                      </div>
                                      <span className="text-[10px] text-on-surface-variant block truncate">
                                        {lot.collector_history}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-0.5 bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm shrink-0">
                                    <span className="material-symbols-outlined text-amber-500 text-[13px]">star</span>
                                    <span className="text-xs font-bold text-on-surface">{lot.collector_rating}</span>
                                  </div>
                                </div>

                                {/* 3-Metric Matrix */}
                                <div className="grid grid-cols-3 gap-1 bg-surface-container rounded-lg p-2 mt-2.5 text-center">
                                  <div className="border-r border-outline-variant/30">
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                                      Net Weight
                                    </span>
                                    <p className="text-sm font-bold text-on-surface">
                                      {lot.net_weight_kg} <span className="text-[11px] font-normal text-on-surface-variant">kg</span>
                                    </p>
                                  </div>
                                  <div className="border-r border-outline-variant/30">
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                                      Collector Asking
                                    </span>
                                    <p className="text-sm font-bold text-on-surface">
                                      ₹{lot.collector_asking_rate} <span className="text-[11px] font-normal text-on-surface-variant">/kg</span>
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                                      Market Range
                                    </span>
                                    <p className="text-sm font-bold text-primary">
                                      ₹{lot.benchmark_min}–{lot.benchmark_max} <span className="text-[11px] font-normal text-on-surface-variant">/kg</span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Quotation Procurement Terminal */}
                              <div className="bg-surface-container-low rounded-xl p-3 space-y-2.5 border border-outline-variant/20">
                                {/* Fulfillment Switcher */}
                                <div className="flex items-center justify-between flex-wrap gap-1.5">
                                  <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                                    <span className="material-symbols-outlined text-primary text-[16px]">calculate</span>
                                    Quote Procurement Rate:
                                  </label>
                                  <div className="flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded-lg border border-outline-variant/30">
                                    <button
                                      onClick={() => handleFulfillmentToggle(lot.id, 'van')}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                        fulfillment === 'van'
                                          ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                          : 'text-on-surface-variant hover:text-on-surface'
                                      }`}
                                      type="button"
                                    >
                                      Van Pickup
                                    </button>
                                    <button
                                      onClick={() => handleFulfillmentToggle(lot.id, 'dropoff')}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                        fulfillment === 'dropoff'
                                          ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                          : 'text-on-surface-variant hover:text-on-surface'
                                      }`}
                                      type="button"
                                    >
                                      Self Dropoff
                                    </button>
                                  </div>
                                </div>

                                {/* Price Input & Binding Total Display */}
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                  <div className="relative w-full sm:w-1/2">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">₹</span>
                                    <input
                                      type="number"
                                      value={currentRate}
                                      onChange={(e) => handleRateChange(lot.id, e.target.value)}
                                      className="w-full bg-surface-container-lowest text-on-surface font-bold text-base pl-7 pr-12 py-1.5 rounded-lg shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary h-10"
                                      placeholder="0.00"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-medium">/ kg</span>
                                  </div>

                                  <div className="w-full sm:w-1/2 bg-surface-container-lowest rounded-lg h-10 px-3 flex items-center justify-between shadow-sm border border-outline-variant/30">
                                    <span className="text-xs text-on-surface-variant font-medium">Total Value:</span>
                                    <span className="text-base font-bold text-primary font-mono">
                                      ₹{totalPayout.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <button
                                    onClick={() => alert(`Counter-offer of ₹${currentRate}/kg (Total ₹${totalPayout.toLocaleString('en-IN')}) sent to ${lot.collector_name}.`)}
                                    className="h-10 bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">reply</span>
                                    Counter-Offer
                                  </button>
                                  <button
                                    onClick={() => handleOpenWeighbridgeModal(lot)}
                                    className={`h-10 text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer ${
                                      lot.status === 'CONFIRMED'
                                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                        : 'bg-primary hover:bg-primary-container text-on-primary'
                                    }`}
                                    type="button"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      {lot.status === 'CONFIRMED' ? 'verified' : 'check_circle'}
                                    </span>
                                    {lot.status === 'CONFIRMED' ? 'View CPCB Cert' : 'Accept & Weighbridge'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer Checklist */}
                          <div className="mt-3 pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant border-t border-outline-variant/20">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1 text-primary font-medium">
                                <span className="material-symbols-outlined text-[14px]">fact_check</span>
                                Digital Log Ready
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">tag</span>
                                CPCB Code: #{lot.category_code}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                Scale Calibrated
                              </span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant">EPR Verification Standard</span>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>

                {/* Right Column: Logistics & Audit Panel (4 Columns) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Today's Dispatch Line */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 space-y-3 border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">route</span>
                        <h3 className="font-headline-md text-sm font-bold text-on-surface">Today's Dispatch Line</h3>
                      </div>
                      <span className="bg-primary-fixed font-bold text-on-primary-fixed-variant text-[10px] px-2 py-0.5 rounded-full">
                        8 Scheduled
                      </span>
                    </div>

                    {/* Schedule 1 */}
                    <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1 border-l-4 border-primary">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[16px]">local_shipping</span>
                          Van #KA-04-E-2091
                        </span>
                        <span className="text-[10px] font-bold text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded">
                          15:30 IST Target
                        </span>
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        <p><strong className="text-on-surface">Driver:</strong> Suresh M. (+91 98450 12891)</p>
                        <p><strong className="text-on-surface">Destination:</strong> Ramesh K. / Peenya Industrial</p>
                      </div>
                      <div className="mt-1 pt-1 flex items-center justify-between text-[10px] text-on-surface-variant border-t border-outline-variant/20">
                        <span className="text-primary font-medium flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">scale</span>
                          Calibrated Scale on-board
                        </span>
                        <span>Est. 18m transit</span>
                      </div>
                    </div>

                    {/* Schedule 2 */}
                    <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1 border-l-4 border-secondary">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[16px]">fire_truck</span>
                          Truck #KA-02-B-9912
                        </span>
                        <span className="text-[10px] font-semibold text-on-surface-variant">17:00 IST</span>
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        <p><strong className="text-on-surface">Driver:</strong> Anil Gowda (+91 94481 00214)</p>
                        <p><strong className="text-on-surface">Mission:</strong> Yeshwanthpur Scrap Aggregators</p>
                      </div>
                      <div className="mt-1 pt-1 flex items-center justify-between text-[10px] text-on-surface-variant border-t border-outline-variant/20">
                        <span>Payload: 1,200 kg</span>
                        <span className="text-secondary font-medium">Outer Ring Route</span>
                      </div>
                    </div>

                    {/* Settlement Mode Picker */}
                    <div className="bg-surface-container rounded-lg p-2.5 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block">
                        Settlement &amp; Payment Method
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'CASH', label: '💵 Cash' },
                          { id: 'UPI', label: '📱 UPI' },
                          { id: 'BANK', label: '🏦 Bank' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSettlementMode(m.id)}
                            className={`py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                              settlementMode === m.id
                                ? 'bg-surface-container-lowest shadow-sm text-primary border border-primary/30'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-lowest'
                            }`}
                            type="button"
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-on-surface-variant block text-center mt-1">
                        Payment signed off on physical weighbridge
                      </span>
                    </div>
                  </div>

                  {/* Traceability & Audit Verification */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 space-y-3 border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                        <h4 className="font-headline-md text-sm font-bold text-on-surface">Traceability &amp; Audit</h4>
                      </div>
                      <span className="bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        CPCB Audit Ready
                      </span>
                    </div>

                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">📍</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">1. Verified GPS Origin</span>
                          <p className="text-[11px] text-on-surface-variant">Handover coordinates locked at aggregator site.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">⚖️</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">2. Calibrated Weighbridge</span>
                          <p className="text-[11px] text-on-surface-variant">Gross and net weight stamped under Metrology Act.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">📷</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">3. Digital Handover Photos</span>
                          <p className="text-[11px] text-on-surface-variant">Lot evidence captured before payout disbursement.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 bg-surface-container-low p-2 rounded-lg">
                        <span className="text-base mt-0.5">📄</span>
                        <div>
                          <span className="text-xs font-bold text-on-surface block">4. CPCB EPR Certificate</span>
                          <p className="text-[11px] text-on-surface-variant">Instant EPR credit compliance issuance.</p>
                        </div>
                      </li>
                    </ul>

                    <button
                      onClick={handleDownloadLedger}
                      className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      Download Transaction Ledger (CSV)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE PICKUPS LOGISTICS */}
          {activeTab === 'active-pickups' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Active Fleet &amp; Collection Routes</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Real-time tracking of 8 collection vehicles assigned to {selectedFacility.name}
                  </p>
                </div>
                <button className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-sm">
                  + Dispatch New Vehicle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'KA-04-E-2091',
                    driver: 'Suresh M.',
                    phone: '+91 98450 12891',
                    dest: 'Ramesh K. (Peenya Aggregator)',
                    payload: '480 / 800 kg',
                    status: 'In Transit',
                    eta: '18 mins',
                    scale: 'Calibrated Scale Certified'
                  },
                  {
                    id: 'KA-02-B-9912',
                    driver: 'Anil Gowda',
                    phone: '+91 94481 00214',
                    dest: 'Yeshwanthpur Industrial Aggregators',
                    payload: '950 / 1200 kg',
                    status: 'Loading at Yard',
                    eta: 'On Site',
                    scale: 'Digital Crane Scale Attached'
                  },
                  {
                    id: 'MH-03-CB-4410',
                    driver: 'Vikram Jadhav',
                    phone: '+91 98200 44102',
                    dest: 'Dharavi Link Road Scrap Market',
                    payload: '620 / 1000 kg',
                    status: 'En Route to Facility',
                    eta: '25 mins',
                    scale: 'Calibrated Scale Certified'
                  },
                  {
                    id: 'KA-05-AB-7721',
                    driver: 'Raju Narain',
                    phone: '+91 97410 77219',
                    dest: 'Rajajinagar Industrial E-Waste Hub',
                    payload: '320 / 600 kg',
                    status: 'Dispatched',
                    eta: '40 mins',
                    scale: 'Calibrated Scale Certified'
                  }
                ].map((v) => (
                  <div key={v.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-on-surface">Vehicle #{v.id}</h4>
                          <span className="text-[11px] text-on-surface-variant">{v.driver} ({v.phone})</span>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {v.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2 rounded-lg text-xs">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">Destination</span>
                        <strong className="text-on-surface truncate block">{v.dest}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">Current Payload</span>
                        <strong className="text-primary">{v.payload}</strong>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/20">
                      <span className="flex items-center gap-1 text-primary font-medium text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">scale</span>
                        {v.scale}
                      </span>
                      <span className="font-bold text-on-surface">ETA: {v.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MATERIAL INVENTORY */}
          {activeTab === 'material-inventory' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Plant Material Inventory &amp; Scrap Stock</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Live bay allocations and scrap inventory ready for valorization &amp; smelting
                  </p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary-fixed/50 px-3 py-1 rounded-full">
                  Total Stock: 42.8 MT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { cat: 'Printed Circuit Boards (Grade A/B)', code: 'ITEW1-PCB', stock: '14.2 MT', bay: 'Bay 03-A', val: '₹1,06,50,000', icon: 'memory' },
                  { cat: 'Telecom Copper Wire & Cable', code: 'ITEW-CBL-CU', stock: '18.4 MT', bay: 'Bay 01-C', val: '₹75,44,000', icon: 'electrical_services' },
                  { cat: 'Li-ion Battery Modules', code: 'BATT-LI-ION', stock: '6.8 MT', bay: 'Hazardous Vault B', val: '₹7,48,000', icon: 'battery_charging_full' },
                  { cat: 'CRT & Monitor Display Glass', code: 'ITEW2-DISP', stock: '2.1 MT', bay: 'Bay 04-D', val: '₹84,000', icon: 'tv' },
                  { cat: 'Shredded Aluminum & Ferrous Frames', code: 'FERR-MET-01', stock: '1.3 MT', bay: 'Yard Silo 2', val: '₹65,000', icon: 'precision_manufacturing' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-surface-container px-2 py-0.5 rounded font-mono">
                        {item.code}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{item.cat}</h4>
                      <p className="text-xs text-on-surface-variant">Storage Location: {item.bay}</p>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-low p-2 rounded-lg text-xs">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">Available Stock</span>
                        <strong className="text-sm font-bold text-primary">{item.stock}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-on-surface-variant block">Inventory Valuation</span>
                        <strong className="text-xs font-bold text-on-surface">{item.val}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRICE ENGINE & QUOTES */}
          {activeTab === 'price-quotes' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30">
                <h3 className="text-lg font-bold text-on-surface">Spot Price Engine &amp; Procurement Rates</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  CPCB-aligned benchmark pricing bands for regional aggregators &amp; door-to-door pickers
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/40 text-on-surface-variant uppercase text-[10px] font-bold">
                      <th className="pb-3">Material Category</th>
                      <th className="pb-3">CPCB Code</th>
                      <th className="pb-3">Spot Benchmark</th>
                      <th className="pb-3">Min Floor Rate</th>
                      <th className="pb-3">Recycler Offer</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {[
                      { cat: 'Printed Circuit Boards (Grade A)', code: 'ITEW1-PCB-HG', spot: '₹700 – ₹766/kg', floor: '₹650/kg', offer: '₹780/kg', status: 'Active Offer' },
                      { cat: 'Printed Circuit Boards (Grade B/C)', code: 'ITEW1-PCB-MG', spot: '₹350 – ₹420/kg', floor: '₹300/kg', offer: '₹390/kg', status: 'Active Offer' },
                      { cat: 'Insulated Copper Cables', code: 'ITEW-CBL-CU', spot: '₹400 – ₹430/kg', floor: '₹380/kg', offer: '₹420/kg', status: 'Active Offer' },
                      { cat: 'Li-ion Battery Modules', code: 'BATT-LI-ION', spot: '₹95 – ₹120/kg', floor: '₹85/kg', offer: '₹110/kg', status: 'Active Offer' },
                      { cat: 'Lead Acid Smelter Plates', code: 'BATT-LEAD-01', spot: '₹80 – ₹95/kg', floor: '₹72/kg', offer: '₹88/kg', status: 'Active Offer' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 font-bold text-on-surface">{row.cat}</td>
                        <td className="py-3 font-mono text-on-surface-variant">{row.code}</td>
                        <td className="py-3 text-primary font-semibold">{row.spot}</td>
                        <td className="py-3 text-on-surface-variant">{row.floor}</td>
                        <td className="py-3 font-bold text-primary">{row.offer}</td>
                        <td className="py-3">
                          <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: TRACEABILITY & EPR REPORTS */}
          {activeTab === 'traceability-epr' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">CPCB EPR Certificate Registry</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Official e-waste recycling certificates issued for national EPR target fulfillment
                  </p>
                </div>
                <button
                  onClick={handleDownloadLedger}
                  className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export EPR Ledger (CSV)
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    cert: 'CPCB-EPR-2026-MH-994102',
                    lot: 'RL-2026-00479',
                    collector: 'Dilip S. (Yard Manager)',
                    material: 'Copper Cables (Heavy Metals)',
                    weight: '35.0 kg',
                    payout: '₹14,700',
                    mode: 'CASH',
                    date: '2026-09-05 11:20 IST',
                    hash: 'SHA256: 8f9b4c2...e41a'
                  },
                  {
                    cert: 'CPCB-EPR-2026-MH-994088',
                    lot: 'RL-2026-00475',
                    collector: 'Ramesh K. (Peenya Aggregator)',
                    material: 'High-Grade PCB Motherboards',
                    weight: '12.0 kg',
                    payout: '₹9,360',
                    mode: 'UPI',
                    date: '2026-09-05 09:45 IST',
                    hash: 'SHA256: 3a71f09...b11c'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">verified</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            {item.cert}
                          </span>
                          <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-mono">
                            {item.hash}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface mt-0.5">
                          <strong>{item.material}</strong> • {item.weight} from {item.collector}
                        </p>
                        <span className="text-[10px] text-on-surface-variant">
                          Settled: {item.payout} via {item.mode} on {item.date}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedManifestData(item)}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg shrink-0 cursor-pointer flex items-center gap-1 transition-colors border border-primary/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      <span>View Form-6 Manifest</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FACILITY SETTINGS */}
          {activeTab === 'facility-settings' && (
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30">
                <h3 className="text-lg font-bold text-on-surface">Plant Authorization &amp; Calibration Settings</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Regulated facility parameters for {selectedFacility.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 space-y-3">
                  <h4 className="font-bold text-sm text-on-surface">CPCB Registration Profile</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Registration Number</span>
                      <strong className="text-primary font-mono">{selectedFacility.reg_no}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Plant Operating Territory</span>
                      <strong>{selectedFacility.location}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Authorized E-Waste Categories</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedFacility.materials.map((m, idx) => (
                          <span key={idx} className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 space-y-3">
                  <h4 className="font-bold text-sm text-on-surface">Weighbridge Metrology Calibration</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Scale Calibrated On</span>
                      <strong>2026-08-15 (Legal Metrology Dept, MH)</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Next Recalibration Due</span>
                      <strong className="text-emerald-700">2027-02-15 (Valid)</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Acceptable Weight Tolerance</span>
                      <strong>±0.1 kg standard field variance</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Weighbridge Verification & CPCB Confirmation Modal */}
      {inspectLot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-primary tracking-wider">
                  Weighbridge Scale Verification
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface mt-0.5">{inspectLot.title}</h3>
                <span className="text-xs text-on-surface-variant font-mono">Ref: {inspectLot.handover_ref}</span>
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
                <span className="text-[10px] text-on-surface-variant font-medium">Collector / Origin</span>
                <p className="font-bold text-xs sm:text-sm text-on-surface truncate">{inspectLot.collector_name}</p>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-medium">Assigned Recycler</span>
                <p className="font-bold text-xs sm:text-sm text-primary truncate">{selectedFacility.name}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Calibrated Scale Actual Net Weight (kg):
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weighbridgeInput}
                  onChange={(e) => setWeighbridgeInput(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-lowest border-2 border-primary rounded-xl font-bold text-lg text-on-surface focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-sm font-bold text-on-surface-variant">kg</span>
              </div>
              <span className="text-[10px] text-on-surface-variant mt-1 block">
                Stated Collector Weight: {inspectLot.net_weight_kg} kg | Scale Variance: ±
                {Math.abs((parseFloat(weighbridgeInput) || 0) - inspectLot.net_weight_kg).toFixed(1)} kg
              </span>

              {/* Anomaly Detection Banner for Variance > 15% */}
              {(() => {
                const enteredW = parseFloat(weighbridgeInput) || 0;
                const statedW = inspectLot.net_weight_kg || 1;
                const diffKg = Math.abs(enteredW - statedW);
                const variancePct = statedW > 0 ? (diffKg / statedW) * 100 : 0;
                if (variancePct > 15) {
                  return (
                    <div className="mt-2 p-3 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
                      <span className="material-symbols-outlined text-[20px] text-red-600 shrink-0">error</span>
                      <div className="space-y-0.5">
                        <p className="font-bold">🚨 CPCB Weight Variance Anomaly ({variancePct.toFixed(1)}% deviation)</p>
                        <p className="text-[11px] opacity-90 leading-tight">
                          Scale weight deviates by more than the statutory ±15% threshold from collector self-claim ({statedW} kg vs {enteredW} kg). Supervisor review and metrology recalibration required before final EPR credit sign-off.
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">Settlement Amount ({settlementMode}):</span>
              <span className="text-lg font-bold text-primary font-mono">
                ₹
                {Math.round(
                  (parseFloat(weighbridgeInput) || inspectLot.net_weight_kg) *
                    (rates[inspectLot.id] || inspectLot.suggested_rate)
                ).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                <span>Dual visual signoff completed between collector &amp; weighbridge operator</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" />
                <span>Physical scale calibrated according to Legal Metrology Standards</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/30">
              <button
                onClick={() => setInspectLot(null)}
                className="h-10 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWeighbridge}
                disabled={isSubmittingConfirm}
                className="h-10 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>{isSubmittingConfirm ? 'Issuing...' : 'Issue CPCB Certificate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory CPCB Form-6 Manifest Modal */}
      <Form6ManifestModal
        isOpen={Boolean(selectedManifestData)}
        onClose={() => setSelectedManifestData(null)}
        certData={selectedManifestData}
      />
    </div>
  );
}
