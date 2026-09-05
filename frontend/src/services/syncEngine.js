/**
 * Kabadiwala Connect - Offline Sync Engine
 * Manages connectivity state, Dexie IndexedDB sync queue, photo uploads,
 * and automatic synchronization upon regaining internet connectivity.
 */

import {
  getUnsyncedLots,
  getUnsyncedHandovers,
  markLotSynced,
  markHandoverSynced,
  getUnsyncedCount
} from '../db/offlineDb';

const API_BASE = 'http://localhost:8000';

class SyncEngine {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.isSimulatedAirplaneMode = false;
    this.isSyncing = false;
    this.unsyncedCount = { lots: 0, handovers: 0, total: 0 };
    this.lastSyncTime = null;
    this.lastSyncResult = null;
    this.listeners = new Set();
    this.initialized = false;
  }

  /**
   * Initialize browser event listeners and queue counter
   */
  async init() {
    if (this.initialized) return;
    this.initialized = true;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }

    await this.refreshCounts();
    
    // If online on start and unsynced items exist, attempt sync
    if (this.isEffectivelyOnline() && this.unsyncedCount.total > 0) {
      this.syncNow();
    }
  }

  /**
   * Determine effective network status (considering simulated airplane mode)
   */
  isEffectivelyOnline() {
    return this.isOnline && !this.isSimulatedAirplaneMode;
  }

  /**
   * Handle physical network event
   */
  async handleNetworkChange(online) {
    this.isOnline = online;
    await this.refreshCounts();
    this.notify();

    if (this.isEffectivelyOnline()) {
      console.log('[SyncEngine] Connection restored! Triggering automatic background sync...');
      await this.syncNow();
    } else {
      console.log('[SyncEngine] Device went offline. Local writes queued to IndexedDB.');
    }
  }

  /**
   * Toggle simulated airplane mode (for SIH jury demo & desktop testing)
   */
  async setSimulatedAirplaneMode(enabled) {
    this.isSimulatedAirplaneMode = enabled;
    await this.refreshCounts();
    this.notify();

    if (!enabled && this.isOnline) {
      console.log('[SyncEngine] Airplane Mode disabled! Triggering automatic sync to Supabase...');
      await this.syncNow();
    }
  }

  /**
   * Subscribe React components to sync status updates
   */
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all active subscribers of state change
   */
  notify() {
    const state = this.getState();
    this.listeners.forEach(cb => {
      try { cb(state); } catch (e) { console.error(e); }
    });
  }

  /**
   * Current snapshot of sync engine state
   */
  getState() {
    return {
      isOnline: this.isOnline,
      isSimulatedAirplaneMode: this.isSimulatedAirplaneMode,
      isEffectivelyOnline: this.isEffectivelyOnline(),
      isSyncing: this.isSyncing,
      unsyncedCount: this.unsyncedCount,
      lastSyncTime: this.lastSyncTime,
      lastSyncResult: this.lastSyncResult
    };
  }

  /**
   * Refresh pending count from Dexie.js IndexedDB
   */
  async refreshCounts() {
    try {
      this.unsyncedCount = await getUnsyncedCount();
      this.notify();
    } catch (e) {
      console.error('[SyncEngine] Error counting unsynced records:', e);
    }
  }

  /**
   * Core Sync Function:
   * Pushes all unsynced local records (lots + handovers + photo blobs) to backend.
   */
  async syncNow() {
    if (!this.isEffectivelyOnline()) {
      console.warn('[SyncEngine] Cannot sync: currently offline / airplane mode active.');
      return { success: false, reason: 'offline' };
    }

    if (this.isSyncing) {
      console.log('[SyncEngine] Sync already in progress.');
      return { inProgress: true };
    }

    this.isSyncing = true;
    this.notify();

    let syncedLots = 0;
    let syncedHandovers = 0;
    const errors = [];

    try {
      // 1. Sync Material Lots (including offline captured photo blobs)
      const pendingLots = await getUnsyncedLots();
      for (const lot of pendingLots) {
        try {
          const payload = {
            id: lot.id,
            collector_id: lot.collector_id,
            material_category: lot.material_category,
            material_id: lot.material_id,
            approximate_weight: lot.approximate_weight,
            condition: lot.condition,
            quoted_price: lot.quoted_price,
            photo_base64: lot.photo_base64 || '',
            image_url: lot.image_url || '',
            gps_lat: lot.gps_lat,
            gps_lng: lot.gps_lng,
            ai_prediction: lot.ai_prediction,
            created_at: lot.created_at
          };

          const res = await fetch(API_BASE + '/lots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            const data = await res.json();
            await markLotSynced(lot.id, data.data || {});
            syncedLots++;
          } else {
            errors.push('Lot ' + lot.id + ' sync failed: HTTP ' + res.status);
          }
        } catch (lotErr) {
          errors.push('Lot ' + lot.id + ' error: ' + lotErr.message);
        }
      }

      // 2. Sync Offline Handovers
      const pendingHandovers = await getUnsyncedHandovers();
      for (const ho of pendingHandovers) {
        try {
          const payload = {
            lot_id: ho.lot_id,
            collector_id: ho.collector_id,
            recycler_id: ho.recycler_id,
            weight: ho.weight,
            material_category: ho.material_category,
            gps_lat: ho.gps_lat,
            gps_lng: ho.gps_lng,
            handover_ref: ho.handover_ref
          };

          const res = await fetch(API_BASE + '/handover/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            const data = await res.json();
            await markHandoverSynced(ho.id, data.data || {});
            syncedHandovers++;
          } else {
            errors.push('Handover ' + ho.handover_ref + ' failed: HTTP ' + res.status);
          }
        } catch (hoErr) {
          errors.push('Handover ' + ho.id + ' error: ' + hoErr.message);
        }
      }

      this.lastSyncTime = new Date().toISOString();
      this.lastSyncResult = {
        success: errors.length === 0,
        syncedLots,
        syncedHandovers,
        errors
      };

      // Voice notification if speech synthesis available
      if ((syncedLots + syncedHandovers) > 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance('डेटा क्लाउडवर सिंक झाला');
          utterance.lang = 'mr-IN';
          window.speechSynthesis.speak(utterance);
        } catch (_) {}
      }

    } catch (globalErr) {
      console.error('[SyncEngine] Global sync error:', globalErr);
      errors.push(globalErr.message);
    } finally {
      this.isSyncing = false;
      await this.refreshCounts();
      this.notify();
    }

    return {
      success: errors.length === 0,
      syncedLots,
      syncedHandovers,
      errors
    };
  }
}

// Export singleton instance
export const syncEngine = new SyncEngine();
