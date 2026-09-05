import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './EarningsLedger.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function EarningsLedger() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const [collectorId, setCollectorId] = useState('col_test_001');
  const [ledger, setLedger] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    fetchLedger(collectorId);
  }, [collectorId]);

  const fetchLedger = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/earnings/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLedger(data);
    } catch (err) {
      console.warn('Backend unavailable, using resilient fallback ledger:', err);
      setLedger({
        success: true,
        collector_id: id,
        metrics: {
          total_completed_earnings_inr: 4945.5,
          total_pending_dues_inr: 1850.0,
          total_cash_earnings_inr: 4945.5,
          total_digital_earnings_inr: 0.0,
          total_volume_kg: 25.8,
          completed_transaction_count: 3,
          pending_transaction_count: 2,
          all_transaction_count: 5
        },
        completed_transactions: [
          {
            id: 'tx-001',
            material_category: 'PCB',
            weight: 14.5,
            quoted_price: 3552.5,
            final_price: 3697.5,
            payment_mode: 'CASH',
            payment_status: 'PAID_CASH_CONFIRMED',
            status: 'COMPLETED',
            recycler_name: 'EcoRecycle India Pvt Ltd (Ecoreco)',
            created_at: '2026-09-04T13:46:15Z'
          },
          {
            id: 'tx-002',
            material_category: 'PCB',
            weight: 5.2,
            quoted_price: 1200.0,
            final_price: 1248.0,
            payment_mode: 'CASH',
            payment_status: 'PAID_CASH_CONFIRMED',
            status: 'COMPLETED',
            recycler_name: 'EcoRecycle India Pvt Ltd (Ecoreco)',
            created_at: '2026-09-05T09:13:54Z'
          }
        ],
        pending_dues: [
          {
            id: 'tx-pen-001',
            material_category: 'BATTERIES',
            weight: 8.5,
            quoted_price: 1200.0,
            final_price: 1200.0,
            payment_mode: 'CASH',
            payment_status: 'PENDING',
            status: 'PENDING',
            recycler_name: 'GreenCircle Urban Recyclers',
            created_at: '2026-09-05T09:30:00Z'
          },
          {
            id: 'tx-pen-002',
            material_category: 'CABLES',
            weight: 2.0,
            quoted_price: 650.0,
            final_price: 650.0,
            payment_mode: 'CASH',
            payment_status: 'AWAITING_CONFIRMATION',
            status: 'PENDING',
            recycler_name: 'EcoRecycle India Pvt Ltd',
            created_at: '2026-09-05T09:45:00Z'
          }
        ],
        spoken_summaries: {
          hi: 'कुल प्राप्त कमाई ₹4,945 है। ₹1,850 का बकाया बाकी है जो नकद मिलेगा।',
          mr: 'एकूण मिळालेली कमाई ₹4,945 आहे. ₹1,850 येणे बाकी आहे.'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettleCash = async (txId, amount) => {
    try {
      const res = await fetch(`${API_BASE}/earnings/settle-cash/${txId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ final_amount: amount })
      });
      if (!res.ok) throw new Error('Cash settlement failed');
      setActionMessage({ type: 'success', text: `💵 ₹${amount} ${t('cash_paid')}!` });
      fetchLedger(collectorId);
    } catch (err) {
      console.warn('Local fallback cash settlement:', err);
      setActionMessage({ type: 'success', text: `💵 ₹${amount} ${t('cash_paid')} (Local Mode)!` });
      setLedger((prev) => {
        if (!prev) return prev;
        const pendingItem = prev.pending_dues.find((t) => t.id === txId);
        if (!pendingItem) return prev;
        const updatedPending = prev.pending_dues.filter((t) => t.id !== txId);
        const settledItem = {
          ...pendingItem,
          status: 'COMPLETED',
          payment_status: 'PAID_CASH_CONFIRMED',
          payment_mode: 'CASH',
          final_price: amount
        };
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            total_completed_earnings_inr: prev.metrics.total_completed_earnings_inr + amount,
            total_pending_dues_inr: Math.max(0, prev.metrics.total_pending_dues_inr - amount),
            total_cash_earnings_inr: prev.metrics.total_cash_earnings_inr + amount
          },
          completed_transactions: [settledItem, ...prev.completed_transactions],
          pending_dues: updatedPending
        };
      });
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const metrics = ledger?.metrics || {
    total_completed_earnings_inr: 0,
    total_pending_dues_inr: 0,
    total_cash_earnings_inr: 0,
    total_volume_kg: 0
  };

  const displayedTransactions = (() => {
    if (!ledger) return [];
    if (filter === 'completed') return ledger.completed_transactions || [];
    if (filter === 'pending') return ledger.pending_dues || [];
    return [...(ledger.pending_dues || []), ...(ledger.completed_transactions || [])];
  })();

  const summarySpeech = currentLang === 'mr'
    ? (ledger?.spoken_summaries?.mr || `एकूण कमाई ₹${metrics.total_completed_earnings_inr}.`)
    : (ledger?.spoken_summaries?.hi || `कुल कमाई ₹${metrics.total_completed_earnings_inr}.`);

  return (
    <div className="ledger-container">
      {/* Header */}
      <header className="ledger-header">
        <div className="ledger-badge">💰 {t('ledger_badge')}</div>
        <h1 className="ledger-title">{t('ledger_title')}</h1>
        <p className="ledger-subtitle">{t('ledger_subtitle')}</p>

        <div className="collector-switch-row">
          <label>{t('collector_profile')}:</label>
          <select value={collectorId} onChange={(e) => setCollectorId(e.target.value)}>
            <option value="col_test_001">Ramzan Ali (Dharavi 13th Compound) - col_test_001</option>
            <option value="col_test_002">Suresh Shinde (Kurla Scrap Mandi) - col_test_002</option>
          </select>
        </div>
      </header>

      {actionMessage && (
        <div className={`ledger-alert ${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="metrics-grid">
        {/* Completed Earnings */}
        <div className="metric-card completed-card">
          <div className="metric-icon">💵</div>
          <div className="metric-content">
            <span className="metric-label">{t('completed_earnings')}</span>
            <div className="metric-val">₹{metrics.total_completed_earnings_inr.toLocaleString('en-IN')}</div>
            <span className="metric-sub">{t('completed_earnings_sub')}</span>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="metric-card pending-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <span className="metric-label">{t('pending_dues')}</span>
            <div className="metric-val text-amber">₹{metrics.total_pending_dues_inr.toLocaleString('en-IN')}</div>
            <span className="metric-sub">{t('pending_dues_sub')}</span>
          </div>
        </div>

        {/* Cash Volume */}
        <div className="metric-card cash-card">
          <div className="metric-icon">🤝</div>
          <div className="metric-content">
            <span className="metric-label">{t('cash_settled')}</span>
            <div className="metric-val text-emerald">₹{metrics.total_cash_earnings_inr.toLocaleString('en-IN')}</div>
            <span className="metric-sub">{t('cash_settled_sub')}</span>
          </div>
        </div>

        {/* Total Weight */}
        <div className="metric-card weight-card">
          <div className="metric-icon">⚖️</div>
          <div className="metric-content">
            <span className="metric-label">{t('total_volume')}</span>
            <div className="metric-val">{metrics.total_volume_kg} kg</div>
            <span className="metric-sub">{t('total_volume_sub')}</span>
          </div>
        </div>
      </div>

      {/* Voice Summary Ribbon */}
      <div className="voice-summary-ribbon">
        <div className="voice-text">
          <span>🔊 <strong>{t('ledger_summary_label')}:</strong></span>
          <em>{summarySpeech}</em>
        </div>
        <button
          className="voice-play-btn"
          onClick={() => speakText(summarySpeech)}
        >
          {t('btn_listen')}
        </button>
      </div>

      {/* Filter Tabs & Transactions Table */}
      <div className="ledger-card">
        <div className="table-nav-row">
          <h2 className="section-title">{t('tx_history_title')}</h2>

          <div className="filter-pill-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('filter_all')} ({ledger?.metrics?.all_transaction_count || 0})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              {t('filter_completed')} ({ledger?.metrics?.completed_transaction_count || 0})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              {t('filter_pending')} ({ledger?.metrics?.pending_transaction_count || 0})
            </button>
          </div>
        </div>

        {displayedTransactions.length === 0 ? (
          <div className="empty-ledger">
            <p>{t('no_tx_found')}</p>
          </div>
        ) : (
          <div className="tx-list">
            {displayedTransactions.map((tx) => {
              const isPending = tx.status === 'PENDING' || tx.payment_status === 'PENDING' || tx.payment_status === 'AWAITING_CONFIRMATION';
              return (
                <div key={tx.id} className={`tx-item ${isPending ? 'pending-border' : ''}`}>
                  <div className="tx-left">
                    <div className="tx-cat-badge">{tx.material_category || 'SCRAP'}</div>
                    <div>
                      <div className="tx-recycler">{tx.recycler_name || 'Authorized Recycler Hub'}</div>
                      <div className="tx-date">
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'Today'}
                      </div>
                    </div>
                  </div>

                  <div className="tx-mid">
                    <div>{t('weight_kg')}: <strong>{tx.weight} kg</strong></div>
                    <div>{t('estimated_inr')}: ₹{tx.quoted_price}</div>
                  </div>

                  <div className="tx-right">
                    <div className="tx-amount">
                      ₹{tx.final_price || tx.quoted_price}
                    </div>

                    <div className="tx-status-col">
                      <span className={`status-tag ${isPending ? 'pending-tag' : 'paid-tag'}`}>
                        {isPending ? t('status_pending') : t('cash_paid')}
                      </span>

                      {/* Cash-first One-Click Settlement for pending dues */}
                      {isPending && (
                        <button
                          className="settle-cash-btn"
                          onClick={() => handleSettleCash(tx.id, tx.final_price || tx.quoted_price)}
                        >
                          {t('btn_receive_cash')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
