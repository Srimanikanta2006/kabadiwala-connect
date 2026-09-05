import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './RecyclerDashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AUTHORIZED_FACILITIES = [
  {
    id: 'rec_ecorecycle_01',
    name: 'EcoRecycle India Pvt Ltd (Ecoreco)',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1042',
    location: 'Andheri East, Mumbai',
    materials: ['PCB', 'Cables', 'Batteries', 'Displays', 'Appliances']
  },
  {
    id: 'rec_greencircle_02',
    name: 'GreenCircle Urban Recyclers',
    reg_no: 'CPCB/E-WASTE/REG/MH/2022/0891',
    location: 'Dharavi Link Road, Mumbai',
    materials: ['PCB', 'Cables', 'Batteries']
  },
  {
    id: 'rec_cerebra_03',
    name: 'Cerebra Integrated Technologies Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2021/0432',
    location: 'TTC Industrial Area, Navi Mumbai',
    materials: ['PCB', 'Displays', 'Appliances']
  },
  {
    id: 'rec_greenscape_04',
    name: 'Greenscape Eco Management Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2023/1187',
    location: 'Taloja MIDC, Navi Mumbai',
    materials: ['Batteries', 'Motors', 'Plastics']
  },
  {
    id: 'rec_envirocare_05',
    name: 'Enviro-Care Recycling Pvt Ltd',
    reg_no: 'CPCB/E-WASTE/REG/MH/2020/0219',
    location: 'Bhosari MIDC, Pune',
    materials: ['PCB', 'Cables', 'Displays']
  }
];

export default function RecyclerDashboard({ onRoleSwitch }) {
  const { t } = useTranslation();
  const [selectedFacility, setSelectedFacility] = useState(AUTHORIZED_FACILITIES[0]);
  const [lots, setLots] = useState([]);
  const [metrics, setMetrics] = useState({
    total_incoming_lots: 0,
    pending_verification_count: 0,
    confirmed_count: 0,
    total_verified_weight_kg: 0,
    total_verified_tonnage_mt: 0,
    total_payout_settled_inr: 0,
    cpcb_certificates_issued: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, CONFIRMED
  const [quickRefInput, setQuickRefInput] = useState('');
  const [weighbridgeInput, setWeighbridgeInput] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [confirmationNotice, setConfirmationNotice] = useState(null);
  const [inspectCert, setInspectCert] = useState(null);

  useEffect(() => {
    loadRecyclerData(selectedFacility.id);
  }, [selectedFacility, filterStatus]);

  const loadRecyclerData = async (facilityId) => {
    setIsLoading(true);
    try {
      // 1. Fetch matched incoming lots
      const statusParam = filterStatus === 'ALL' ? '' : `?status_filter=${filterStatus}`;
      const resLots = await fetch(`${API_BASE}/recyclers/${facilityId}/lots${statusParam}`);
      if (resLots.ok) {
        const dataLots = await resLots.json();
        setLots(dataLots.lots || []);
      }

      // 2. Fetch facility metrics
      const resMetrics = await fetch(`${API_BASE}/recyclers/${facilityId}/metrics`);
      if (resMetrics.ok) {
        const dataMetrics = await resMetrics.json();
        setMetrics(dataMetrics.metrics || {});
      }
    } catch (err) {
      console.error('Error fetching recycler data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLot = async (lot) => {
    const refToConfirm = quickRefInput.trim() || lot.handover_ref;
    const finalWeight = weighbridgeInput ? parseFloat(weighbridgeInput) : lot.approximate_weight;

    if (!refToConfirm) {
      alert('Please provide a valid Handover Reference token (e.g. KC-TRACE-...)');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/handover/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handover_ref: refToConfirm,
          recycler_id: selectedFacility.id,
          verified_weight: finalWeight,
          payment_mode: paymentMode
        })
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmationNotice({
          success: true,
          ref: refToConfirm,
          certId: data.cpcb_certificate_id,
          weight: data.verified_weight || finalWeight,
          message: 'Receipt Verified! Official CPCB EPR Certificate generated.'
        });
        setQuickRefInput('');
        setWeighbridgeInput('');
        // Reload dashboard
        loadRecyclerData(selectedFacility.id);
      } else {
        const errData = await res.json();
        setConfirmationNotice({
          success: false,
          message: errData.detail || 'Failed to confirm handover receipt.'
        });
      }
    } catch (err) {
      setConfirmationNotice({
        success: false,
        message: err.message || 'Network error confirming receipt.'
      });
    }
  };

  return (
    <div className="recycler-dashboard-layout">
      {/* Top Banner: Facility Identity & Quick Actions */}
      <header className="recycler-header-card">
        <div className="facility-identity-block">
          <div className="facility-icon">🏭</div>
          <div className="facility-info">
            <div className="facility-picker-row">
              <label htmlFor="facility-select">Facility:</label>
              <select
                id="facility-select"
                className="facility-dropdown"
                value={selectedFacility.id}
                onChange={(e) => {
                  const fac = AUTHORIZED_FACILITIES.find(f => f.id === e.target.value);
                  if (fac) setSelectedFacility(fac);
                }}
              >
                {AUTHORIZED_FACILITIES.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
                ))}
              </select>
            </div>
            <div className="facility-meta">
              <span className="badge cpcb-badge">🛡️ CPCB Registration: {selectedFacility.reg_no}</span>
              <span className="badge auth-badge">✅ Authorization: ACTIVE</span>
              <span className="facility-addr">📍 {selectedFacility.location}</span>
            </div>
          </div>
        </div>

        <div className="role-return-block">
          <button className="btn-switch-to-collector" onClick={onRoleSwitch}>
            👷‍♂️ Switch to Collector View
          </button>
        </div>
      </header>

      {/* Confirmation Notification Banner */}
      {confirmationNotice && (
        <div className={`confirm-alert-banner ${confirmationNotice.success ? 'success' : 'error'}`}>
          <div className="alert-content">
            <strong>{confirmationNotice.success ? '✅ Verified & Certified' : '⚠️ Confirmation Warning'}</strong>
            <p>{confirmationNotice.message}</p>
            {confirmationNotice.certId && (
              <div className="cert-pill-box">
                <span>Official CPCB Certificate ID:</span>
                <code>{confirmationNotice.certId}</code>
              </div>
            )}
          </div>
          <button className="btn-close-alert" onClick={() => setConfirmationNotice(null)}>✕</button>
        </div>
      )}

      {/* KPI Metrics Dashboard Grid */}
      <section className="metrics-summary-grid">
        <div className="kpi-card incoming">
          <span className="kpi-icon">📥</span>
          <div className="kpi-body">
            <span className="kpi-title">Incoming Lots Matched</span>
            <strong className="kpi-val">{metrics.total_incoming_lots}</strong>
            <span className="kpi-sub">{selectedFacility.materials.join(', ')}</span>
          </div>
        </div>

        <div className="kpi-card pending">
          <span className="kpi-icon">⏳</span>
          <div className="kpi-body">
            <span className="kpi-title">Awaiting Verification</span>
            <strong className="kpi-val">{metrics.pending_verification_count}</strong>
            <span className="kpi-sub">Ready for weighbridge</span>
          </div>
        </div>

        <div className="kpi-card tonnage">
          <span className="kpi-icon">⚖️</span>
          <div className="kpi-body">
            <span className="kpi-title">Verified Tonnage</span>
            <strong className="kpi-val">{metrics.total_verified_weight_kg} kg</strong>
            <span className="kpi-sub">({metrics.total_verified_tonnage_mt} Metric Tons)</span>
          </div>
        </div>

        <div className="kpi-card certificates">
          <span className="kpi-icon">📜</span>
          <div className="kpi-body">
            <span className="kpi-title">CPCB EPR Certificates</span>
            <strong className="kpi-val">{metrics.cpcb_certificates_issued}</strong>
            <span className="kpi-sub">Audit-compliant trail</span>
          </div>
        </div>

        <div className="kpi-card payout">
          <span className="kpi-icon">💰</span>
          <div className="kpi-body">
            <span className="kpi-title">Settled Payouts</span>
            <strong className="kpi-val">₹{metrics.total_payout_settled_inr?.toLocaleString('en-IN')}</strong>
            <span className="kpi-sub">Direct cash & verified</span>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Content: Left = Quick Confirm Box, Right = Matched Lots Table */}
      <div className="dashboard-content-split">
        {/* Quick Verification / QR Scanner Panel */}
        <div className="quick-verify-panel">
          <h3 className="panel-heading">⚡ Quick Handover Verification</h3>
          <p className="panel-desc">Enter the collector's digital handover reference or scan their QR token to certify weight and issue EPR compliance.</p>

          <div className="verify-form-group">
            <label>Handover Reference Token:</label>
            <input
              type="text"
              placeholder="e.g. KC-TRACE-20260905-MH-XXXXXX"
              value={quickRefInput}
              onChange={(e) => setQuickRefInput(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="verify-form-row">
            <div className="verify-form-group">
              <label>Weighbridge Weight (kg):</label>
              <input
                type="number"
                step="0.1"
                placeholder="Scale gross weight"
                value={weighbridgeInput}
                onChange={(e) => setWeighbridgeInput(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="verify-form-group">
              <label>Payment Settlement:</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="form-input"
              >
                <option value="CASH">💵 Cash at Gate</option>
                <option value="UPI">📱 UPI Digital</option>
              </select>
            </div>
          </div>

          <button
            className="btn-confirm-receipt-action"
            onClick={() => handleConfirmLot({ handover_ref: quickRefInput, approximate_weight: parseFloat(weighbridgeInput) || 2.5 })}
            disabled={!quickRefInput.trim()}
          >
            🛡️ Verify Receipt & Issue CPCB Certificate
          </button>
        </div>

        {/* Incoming Matched Lots Table */}
        <div className="matched-lots-panel">
          <div className="lots-panel-header">
            <div className="panel-title-group">
              <h3>📦 Matched Lots Queue ({lots.length})</h3>
              <span className="text-muted">Showing only material lots matching {selectedFacility.name}'s authorized categories</span>
            </div>

            {/* Filter Tabs */}
            <div className="filter-button-group">
              <button
                className={`btn-filter ${filterStatus === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterStatus('ALL')}
              >
                All ({lots.length})
              </button>
              <button
                className={`btn-filter ${filterStatus === 'PENDING' ? 'active' : ''}`}
                onClick={() => setFilterStatus('PENDING')}
              >
                ⏳ Pending ({metrics.pending_verification_count})
              </button>
              <button
                className={`btn-filter ${filterStatus === 'CONFIRMED' ? 'active' : ''}`}
                onClick={() => setFilterStatus('CONFIRMED')}
              >
                ✅ Confirmed ({metrics.confirmed_count})
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner-box">🔄 Loading incoming lots...</div>
          ) : lots.length === 0 ? (
            <div className="empty-lots-card">
              <span>📭 No lots currently in this queue.</span>
            </div>
          ) : (
            <div className="lots-table-wrapper">
              <table className="desktop-lots-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Reference</th>
                    <th>Category</th>
                    <th>Weight</th>
                    <th>Value</th>
                    <th>Collector / GPS</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot) => {
                    const isConfirmed = lot.recycler_confirmation;
                    return (
                      <tr key={lot.lot_id} className={isConfirmed ? 'row-confirmed' : 'row-pending'}>
                        <td className="cell-photo">
                          {lot.image_url ? (
                            <img src={lot.image_url} alt="Lot" className="table-thumbnail" />
                          ) : (
                            <div className="thumbnail-fallback">📦</div>
                          )}
                        </td>
                        <td className="cell-ref">
                          <code className="ref-badge">{lot.handover_ref}</code>
                          <span className="cell-timestamp">{new Date(lot.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="cell-category">
                          <strong>{lot.material_category}</strong>
                          <div className="sub-grade">{lot.material_id}</div>
                        </td>
                        <td className="cell-weight">
                          <strong>{lot.approximate_weight} kg</strong>
                        </td>
                        <td className="cell-value">
                          <strong>₹{lot.estimated_value?.toFixed(2)}</strong>
                        </td>
                        <td className="cell-collector">
                          <div>{lot.collector_id}</div>
                          <span className="gps-tag">📍 {lot.gps_lat?.toFixed(3)}, {lot.gps_lng?.toFixed(3)}</span>
                        </td>
                        <td className="cell-status">
                          {isConfirmed ? (
                            <div className="status-confirmed-block">
                              <span className="status-tag confirmed">✅ CONFIRMED</span>
                              {lot.cpcb_certificate_id && (
                                <button
                                  className="btn-cert-link"
                                  onClick={() => setInspectCert(lot)}
                                >
                                  📜 {lot.cpcb_certificate_id.slice(0, 14)}...
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="status-tag pending">⏳ PENDING</span>
                          )}
                        </td>
                        <td className="cell-action">
                          {isConfirmed ? (
                            <span className="text-settled">Settled ✓</span>
                          ) : (
                            <button
                              className="btn-quick-verify-row"
                              onClick={() => {
                                setQuickRefInput(lot.handover_ref);
                                setWeighbridgeInput(lot.approximate_weight);
                                handleConfirmLot(lot);
                              }}
                            >
                              Confirm Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CPCB EPR Certificate Modal / Audit View */}
      {inspectCert && (
        <div className="cert-modal-backdrop" onClick={() => setInspectCert(null)}>
          <div className="cert-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <h3>📜 CPCB Extended Producer Responsibility Certificate</h3>
              <button className="btn-close-modal" onClick={() => setInspectCert(null)}>✕</button>
            </div>
            <div className="cert-paper">
              <div className="cert-national-emblem">🇮🇳</div>
              <h4>CENTRAL POLLUTION CONTROL BOARD</h4>
              <h5>E-WASTE (MANAGEMENT) RULES, 2022 • FORM 1(b)</h5>
              <div className="cert-id-stamp">
                <span>CERTIFICATE NO:</span>
                <strong>{inspectCert.cpcb_certificate_id}</strong>
              </div>

              <div className="cert-details-grid">
                <div className="cert-field">
                  <span className="field-name">Recycler Name:</span>
                  <span className="field-val">{selectedFacility.name}</span>
                </div>
                <div className="cert-field">
                  <span className="field-name">CPCB Registration:</span>
                  <span className="field-val">{selectedFacility.reg_no}</span>
                </div>
                <div className="cert-field">
                  <span className="field-name">Material Handover Reference:</span>
                  <span className="field-val">{inspectCert.handover_ref}</span>
                </div>
                <div className="cert-field">
                  <span className="field-name">E-Waste Category:</span>
                  <span className="field-val">{inspectCert.material_category} ({inspectCert.material_id})</span>
                </div>
                <div className="cert-field">
                  <span className="field-name">Verified Net Weight:</span>
                  <span className="field-val">{inspectCert.approximate_weight} kg</span>
                </div>
                <div className="cert-field">
                  <span className="field-name">Traceability Timestamp:</span>
                  <span className="field-val">{new Date(inspectCert.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="cert-footer-stamp">
                <div className="qr-audit-stamp">
                  <span>✅ Digitally Authenticated</span>
                  <code>RE:LINK TRACEABILITY PROTOCOL V1</code>
                </div>
                <div className="sign-stamp">
                  <span>Authorized Signatory</span>
                  <small>Environmental Compliance Division</small>
                </div>
              </div>
            </div>
            <div className="cert-modal-actions">
              <button className="btn-print" onClick={() => window.print()}>🖨️ Print Audit Copy</button>
              <button className="btn-done" onClick={() => setInspectCert(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
