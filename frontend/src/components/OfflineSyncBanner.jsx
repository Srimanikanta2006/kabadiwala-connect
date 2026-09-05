import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { syncEngine } from '../services/syncEngine';
import { getAllLocalLots } from '../db/offlineDb';
import './OfflineSyncBanner.css';

export default function OfflineSyncBanner() {
  const { t } = useTranslation();
  const [syncState, setSyncState] = useState(syncEngine.getState());
  const [showDrawer, setShowDrawer] = useState(false);
  const [localLots, setLocalLots] = useState([]);

  useEffect(() => {
    syncEngine.init();
    const unsubscribe = syncEngine.subscribe((state) => {
      setSyncState({ ...state });
      loadLocalRecords();
    });
    loadLocalRecords();
    return () => unsubscribe();
  }, []);

  const loadLocalRecords = async () => {
    try {
      const lots = await getAllLocalLots();
      setLocalLots(lots);
    } catch (e) {
      console.error('Error fetching local lots:', e);
    }
  };

  const handleToggleAirplaneMode = (e) => {
    const enabled = e.target.checked;
    syncEngine.setSimulatedAirplaneMode(enabled);
  };

  const handleManualSync = () => {
    syncEngine.syncNow();
  };

  const isOffline = !syncState.isEffectivelyOnline;
  const isSyncing = syncState.isSyncing;
  const pendingCount = syncState.unsyncedCount.total;

  return (
    <div className={`sync-banner-container ${isOffline ? 'is-offline' : isSyncing ? 'is-syncing' : 'is-online'}`}>
      <div className="sync-banner-main">
        <div className="sync-banner-status">
          {isOffline ? (
            <span className="status-pill offline">
              <span className="pulse-dot red"></span>
              <strong>{t('offline_airplane_mode')}</strong>
            </span>
          ) : isSyncing ? (
            <span className="status-pill syncing">
              <span className="spin-icon">🔄</span>
              <strong>{t('syncing_data')}</strong>
            </span>
          ) : (
            <span className="status-pill online">
              <span className="pulse-dot green"></span>
              <strong>{t('online_connected')}</strong>
            </span>
          )}

          {pendingCount > 0 && (
            <span className="pending-badge">
              📦 {pendingCount} {t('waiting_to_sync')}
            </span>
          )}
        </div>

        <div className="sync-banner-actions">
          {/* Airplane Mode Toggle for live jury testing */}
          <label className="airplane-toggle-label" title="Toggle offline mode to test airplane behavior">
            <input
              type="checkbox"
              checked={syncState.isSimulatedAirplaneMode}
              onChange={handleToggleAirplaneMode}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">✈️ {t('simulate_airplane_mode')}</span>
          </label>

          {/* Manual Sync Button */}
          {!isOffline && (
            <button
              className="btn-sync-action"
              onClick={handleManualSync}
              disabled={isSyncing}
            >
              {isSyncing ? '🔄...' : t('sync_now')}
            </button>
          )}

          {/* Local records inspector */}
          <button
            className="btn-drawer-toggle"
            onClick={() => setShowDrawer(!showDrawer)}
          >
            📋 {t('local_offline_records')} ({localLots.length})
          </button>
        </div>
      </div>

      {isOffline && (
        <div className="offline-notice">
          <span>ℹ️ {t('saved_locally_msg')}</span>
        </div>
      )}

      {/* Drawer showing IndexedDB records */}
      {showDrawer && (
        <div className="local-records-drawer">
          <div className="drawer-header">
            <h4>📱 Local IndexedDB (Dexie.js) Cache</h4>
            <button className="btn-close-drawer" onClick={() => setShowDrawer(false)}>✕</button>
          </div>
          {localLots.length === 0 ? (
            <p className="empty-drawer-text">No lots recorded in local database yet.</p>
          ) : (
            <div className="drawer-list">
              {localLots.map((lot) => (
                <div key={lot.id} className="drawer-item">
                  <div className="item-photo">
                    {lot.photo_base64 ? (
                      <img src={lot.photo_base64} alt="Lot preview" />
                    ) : (
                      <span className="photo-placeholder">📸</span>
                    )}
                  </div>
                  <div className="item-details">
                    <strong>{lot.material_category} • {lot.approximate_weight} kg</strong>
                    <div className="item-sub">₹{lot.quoted_price?.toFixed(2)} | GPS: {lot.gps_lat?.toFixed(3)}, {lot.gps_lng?.toFixed(3)}</div>
                    <div className="item-time">{new Date(lot.created_at).toLocaleTimeString()}</div>
                  </div>
                  <div className="item-badge">
                    {lot.sync_status === 'UNSYNCED' ? (
                      <span className="badge-unsynced">⏳ UNSYNCED</span>
                    ) : (
                      <span className="badge-synced">✅ SYNCED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
