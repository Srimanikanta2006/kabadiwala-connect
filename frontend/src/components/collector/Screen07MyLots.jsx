import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Screen07MyLots({
  lots = [],
  onSelectLot,
  onNewScan,
  onNavigate,
  syncStatus = { isOnline: true }
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';
  const [filter, setFilter] = useState('ALL');

  // Standard demo lots if none created yet
  const canonicalLots = [
    {
      id: 'lot_stitch_00482',
      handover_ref: 'RL-2026-00482',
      material_category: 'Printed Circuit Board (Grade A)',
      material_id: 'mat_pcb_high',
      approximate_weight: 12.0,
      condition: 'Good / Intact',
      quoted_price: 9360,
      agreedRate: 780,
      ai_confidence: 0.92,
      status: 'AWAITING_OFFERS',
      photo_url: 'https://lh3.googleusercontent.com/aida/AEtjO1Uibj7iPqmg9YKdnMYAfgjprFLErbb0FcOdAiLVCHgIpkj7gbP3YTmKP8zFMrg1kaOj63apJEhpOtxdLXe-93ri5nb5eVArP4y3X_auotJ1wePJz5s4YibZAvhuz-KAXyzC05MmFpsIy-yBUY4Mqu5yd0ohBBU3_J9_aC-nPfLKrNm8V66IvtxKehIH0e-8jnBWhBN-DbfYt6LisI-TlJcyw1QSl4R5LDqnipESfPn5rrrJ6LyUFidtmQ',
      acceptedRecycler: {
        name: 'EcoRecycle India Pvt Ltd',
        cpcbNo: 'CPCB/E-WASTE/REG/MH/2023/1042',
        rate: 780
      },
      created_at: 'Today, 14:15 IST'
    },
    {
      id: 'lot_stitch_00479',
      handover_ref: 'RL-2026-00479',
      material_category: 'Insulated Copper Cables',
      material_id: 'mat_cables_copper',
      approximate_weight: 25.0,
      condition: 'Good / Intact',
      quoted_price: 10500,
      agreedRate: 420,
      ai_confidence: 0.89,
      status: 'OFFER_ACCEPTED',
      photo_url: 'https://lh3.googleusercontent.com/aida/AEtjO1WgXxj3PTs-7lfhFp-JK48EFoiQ6J122eiWOD5bFME_YW39QqWjSOtecSCCok96UgeiWft9i-8N-b4CLTLOt2TKYJpTgjDclW5fZ8pW2Ao12n1xdcxpIMTthmcakRwFYe5pJNiNHbEvQXiTZ6Dg62wI00Pp4LCfvkBxSm5ebeUHSLS26HhnhDK3yHfN-r9YHbPLIFxigyiHuXbRjgJuBMMKwgaWB7DxGJ8xsxedgkY1tTjZMRuMCZsxeAQ',
      acceptedRecycler: {
        name: 'GreenCircle Urban Recyclers',
        cpcbNo: 'CPCB/E-WASTE/REG/MH/2022/0891',
        rate: 420
      },
      created_at: 'Today, 11:30 IST'
    },
    {
      id: 'lot_stitch_00475',
      handover_ref: 'RL-2026-00475',
      material_category: 'Li-ion Battery Packs',
      material_id: 'mat_batteries_li_ion',
      approximate_weight: 10.0,
      condition: 'Used / Mixed',
      quoted_price: 1100,
      agreedRate: 110,
      ai_confidence: 0.94,
      status: 'READY_FOR_PICKUP',
      photo_url: 'https://lh3.googleusercontent.com/aida/AEtjO1UPtZp9W1V_v4d6u-w1k0p-x0',
      acceptedRecycler: {
        name: 'EcoRecycle India Pvt Ltd',
        cpcbNo: 'CPCB/E-WASTE/REG/MH/2023/1042',
        rate: 110
      },
      created_at: 'Yesterday, 16:45 IST'
    },
    {
      id: 'lot_stitch_00470',
      handover_ref: 'RL-2026-00470',
      material_category: 'Printed Circuit Board (Server Grade)',
      material_id: 'mat_pcb_high',
      approximate_weight: 8.0,
      condition: 'Good / Intact',
      quoted_price: 6240,
      agreedRate: 780,
      ai_confidence: 0.96,
      status: 'COMPLETED',
      photo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnrXAynZNALXyOl8wueunxDavXvrvwno8ShM4qL4CTD3UnF4MmWJ4LuV71LlqCfufAD8qkP3HoAHlCEuL7qoWrLSB0I4vFLT1hUpey49XO7COePpM-6at6f5FTV23fkqAjMDEO9Jg1r5sjRFSPBVvgkjtNYGN8HeK8__5iQzaZgcica5tUIT_hal2cwOajIdRrMqTOBd9zGHioWKGJwwIlmo-VT4oy01MOUIeUVPTlHh1ywxpynama',
      acceptedRecycler: {
        name: 'Cerebra Integrated Technologies',
        cpcbNo: 'CPCB/E-WASTE/REG/MH/2021/0432',
        rate: 780
      },
      created_at: '03 Sep 2026, 10:20 IST'
    }
  ];

  // Merge dynamic lots with canonical demos
  const allLots = [...(lots || []), ...canonicalLots.filter(c => !(lots || []).some(l => l.id === c.id || l.handover_ref === c.handover_ref))];

  const filteredLots = allLots.filter((lot) => {
    if (filter === 'ALL') return true;
    if (filter === 'AWAITING_OFFERS') return lot.status === 'AWAITING_OFFERS' || lot.status === 'CREATED' || lot.status === 'PENDING';
    if (filter === 'OFFER_ACCEPTED') return lot.status === 'OFFER_ACCEPTED' || lot.status === 'PENDING_CONFIRMATION';
    if (filter === 'READY_FOR_PICKUP') return lot.status === 'READY_FOR_PICKUP' || lot.status === 'DISPATCHED';
    if (filter === 'COMPLETED') return lot.status === 'COMPLETED' || lot.status === 'VERIFIED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AWAITING_OFFERS':
      case 'CREATED':
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Awaiting Offers</span>
          </span>
        );
      case 'OFFER_ACCEPTED':
      case 'PENDING_CONFIRMATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Offer Accepted</span>
          </span>
        );
      case 'READY_FOR_PICKUP':
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            <span>Pickup Scheduled</span>
          </span>
        );
      case 'COMPLETED':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/30">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Completed &amp; Paid</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">
            <span>{status}</span>
          </span>
        );
    }
  };

  const handleCardClick = (lot) => {
    if (onSelectLot) {
      onSelectLot(lot);
    } else {
      if (lot.status === 'AWAITING_OFFERS' || lot.status === 'CREATED') {
        onNavigate('offers');
      } else if (lot.status === 'OFFER_ACCEPTED' || lot.status === 'READY_FOR_PICKUP') {
        onNavigate('receipt');
      } else {
        onNavigate('earnings');
      }
    }
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen pb-[90px]">
      {/* Top App Bar */}
      <header className="bg-surface border-b border-outline-variant/40 sticky top-0 z-40 px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
              aria-label="Back to home"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="font-headline-md font-bold text-lg text-on-surface">
                {currentLang === 'mr' ? 'माझे स्क्रॅप लॉट्स' : (currentLang === 'hi' ? 'मेरे स्क्रैप लॉट्स' : 'My Scrap Lots')}
              </h1>
              <p className="text-[11px] text-on-surface-variant font-medium">
                {allLots.length} {currentLang === 'mr' ? 'एकूण लॉट्स नोंदणीकृत' : (currentLang === 'hi' ? 'कुल लॉट्स पंजीकृत' : 'Total Lots Tracked')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] filled">cloud_done</span>
              <span>{syncStatus.isOnline ? 'Synced' : 'Offline'}</span>
            </div>
            <button
              onClick={onNewScan}
              className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>+ New Lot</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Filter Navigation Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Lots' },
            { id: 'AWAITING_OFFERS', label: '🟡 Awaiting Offers' },
            { id: 'OFFER_ACCEPTED', label: '🟢 Accepted' },
            { id: 'READY_FOR_PICKUP', label: '🚚 Pickup Scheduled' },
            { id: 'COMPLETED', label: '✅ Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-on-surface text-surface font-bold shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lots List */}
        {filteredLots.length === 0 ? (
          <div className="bg-surface rounded-2xl p-8 text-center border border-outline-variant/40 space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px]">inventory_2</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-on-surface">No Lots Found</h3>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                No scrap lots match this filter. Take a photo of your scrap to generate a new verifiable lot.
              </p>
            </div>
            <button
              onClick={onNewScan}
              className="bg-primary text-on-primary font-bold text-xs px-5 py-2.5 rounded-xl shadow inline-flex items-center gap-2 hover:bg-primary-container cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>Scan Scrap Photo</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLots.map((lot) => {
              const displayId = lot.handover_ref || (lot.id ? `RL-${lot.id.slice(-5).toUpperCase()}` : 'RL-84920');
              const weightVal = lot.approximate_weight || lot.weight || 12.0;
              const priceVal = lot.quoted_price || lot.totalEst || 9360;
              const title = lot.material_category || lot.materialTitle || 'Printed Circuit Board';
              const imgUrl = lot.photo_url || lot.photoUrl || lot.image_data_url || '/assets/icons/pcb_high.svg';
              const confPct = Math.round((lot.ai_confidence || 0.92) * 100);

              return (
                <div
                  key={lot.id}
                  onClick={() => handleCardClick(lot)}
                  className="bg-surface border border-outline-variant/50 hover:border-primary rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30 relative">
                      <img
                        src={imgUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 right-0 bg-inverse-surface/85 text-white text-[9px] font-bold px-1 rounded-tl">
                        {confPct}% AI
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-primary font-mono tracking-wide">
                          #{displayId}
                        </span>
                        {getStatusBadge(lot.status)}
                      </div>

                      <h3 className="font-bold text-sm text-on-surface truncate mt-1">
                        {title}
                      </h3>

                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {weightVal} kg • {lot.condition || 'Used / Mixed'}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant mt-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                        <span>{lot.created_at || 'Today'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="pt-2.5 border-t border-outline-variant/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">
                        {lot.status === 'COMPLETED' ? 'Final Settled Payout' : 'Estimated Mandi Value'}
                      </span>
                      <span className="font-extrabold text-base text-primary">
                        ₹{Number(priceVal).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-bold text-primary hover:text-primary-container flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>
                        {lot.status === 'AWAITING_OFFERS' || lot.status === 'CREATED'
                          ? 'View Offers'
                          : (lot.status === 'COMPLETED' ? 'View Receipt' : 'Track Handover')}
                      </span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => onNavigate('my_lots')}
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined filled">inventory_2</span>
          <span className="font-label-md text-xs font-bold mt-1">My Lots</span>
        </button>
        <button
          onClick={() => onNavigate('earnings')}
          className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer"
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-xs mt-1">Earnings</span>
        </button>
        <button
          onClick={() => onNavigate('safety')}
          className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer"
        >
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">Safety</span>
        </button>
      </nav>
    </div>
  );
}
