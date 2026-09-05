import React from 'react';

export default function NotificationsModal({ isOpen, onClose, onSelectNotification }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif_01',
      type: 'OFFER',
      title: 'New Recycler Offer Received',
      desc: 'EcoRecycle India Pvt Ltd offered ₹780/kg (+5% above mandi) on Lot #RL-84920 (High-Grade PCB).',
      time: '5 mins ago',
      icon: 'local_offer',
      unread: true,
      actionScreen: 'offers'
    },
    {
      id: 'notif_02',
      type: 'PICKUP',
      title: 'Collection Vehicle Dispatched',
      desc: 'Driver Suresh M. (Vehicle KA-04-E-2091) is en route to Peenya Aggregation Yard. ETA: 18 mins.',
      time: '25 mins ago',
      icon: 'local_shipping',
      unread: true,
      actionScreen: 'receipt'
    },
    {
      id: 'notif_03',
      type: 'PAYMENT',
      title: 'Payment Received & Verified',
      desc: '₹9,360 settled via UPI. CPCB EPR Certificate #CPCB-EPR-2026-MH-994102 issued.',
      time: '2 hours ago',
      icon: 'payments',
      unread: false,
      actionScreen: 'earnings'
    },
    {
      id: 'notif_04',
      type: 'MANDI',
      title: 'Mandi Price Spike Alert',
      desc: 'Copper Cables benchmark increased by +8.4% this morning across Mumbai MMR & Pune yards.',
      time: 'Today 08:30 AM',
      icon: 'trending_up',
      unread: false,
      actionScreen: 'home'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-outline-variant space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">notifications_active</span>
            <div>
              <h3 className="font-bold text-base text-on-surface">Notifications &amp; Activity</h3>
              <p className="text-[11px] text-on-surface-variant">Live Scrap Offers, Pickups &amp; Payment Receipts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (onSelectNotification) onSelectNotification(n.actionScreen);
                onClose();
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                n.unread
                  ? 'bg-primary/5 border-primary/30 hover:border-primary'
                  : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    n.type === 'OFFER'
                      ? 'bg-primary text-on-primary'
                      : n.type === 'PICKUP'
                      ? 'bg-secondary text-on-secondary'
                      : n.type === 'PAYMENT'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                  </div>
                  <h4 className="font-bold text-xs text-on-surface">{n.title}</h4>
                </div>
                <span className="text-[10px] text-on-surface-variant whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant pl-9 leading-relaxed">
                {n.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-outline-variant/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-primary-container"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
