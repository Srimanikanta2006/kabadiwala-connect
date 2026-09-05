import Dexie from 'dexie';

// Initialize local IndexedDB database using Dexie
export const db = new Dexie('KabadiwalaOfflineDB');

// Define Schema for offline-first replication
db.version(1).stores({
  // Indexed fields: id (PK), sync_status, material_category, created_at
  offline_lots: 'id, collector_id, material_category, sync_status, created_at',
  // Indexed fields: id (PK), handover_ref, lot_id, sync_status, created_at
  offline_handovers: 'id, handover_ref, lot_id, sync_status, created_at',
  // Cached scrap prices for offline valuation
  cached_prices: 'category, updated_at'
});

/**
 * Save a newly created lot into local IndexedDB.
 * Defaults to 'UNSYNCED' status so it queues for background sync.
 */
export async function saveOfflineLot(lotData) {
  const lot = {
    id: lotData.id || crypto.randomUUID(),
    collector_id: lotData.collector_id || 'col_8832a',
    material_category: lotData.material_category || 'PCB',
    material_id: lotData.material_id || 'mat_pcb_high',
    approximate_weight: parseFloat(lotData.approximate_weight || 1.0),
    condition: lotData.condition || 'CLEAN_INTACT',
    quoted_price: parseFloat(lotData.quoted_price || 0),
    image_url: lotData.image_url || '',
    photo_base64: lotData.photo_base64 || '',
    gps_lat: lotData.gps_lat || 19.0435,
    gps_lng: lotData.gps_lng || 72.8566,
    ai_prediction: lotData.ai_prediction || { detected_id: 'mat_pcb_high', confidence: 0.91 },
    sync_status: 'UNSYNCED',
    created_at: lotData.created_at || new Date().toISOString(),
    synced_at: null
  };

  await db.offline_lots.put(lot);
  return lot;
}

/**
 * Fetch all lots currently queued and pending synchronization.
 */
export async function getUnsyncedLots() {
  return await db.offline_lots.where('sync_status').equals('UNSYNCED').toArray();
}

/**
 * Mark an offline lot as successfully synchronized with backend / Supabase.
 */
export async function markLotSynced(id, serverData = {}) {
  await db.offline_lots.update(id, {
    sync_status: 'SYNCED',
    synced_at: new Date().toISOString(),
    ...(serverData.image_url ? { image_url: serverData.image_url } : {})
  });
}

/**
 * Get all local lots (both synced and unsynced), ordered by newest first.
 */
export async function getAllLocalLots() {
  const lots = await db.offline_lots.toArray();
  return lots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Get most recent local lots up to limit.
 */
export async function getRecentOfflineLots(limit = 10) {
  const lots = await getAllLocalLots();
  return lots.slice(0, limit);
}

/**
 * Save an offline handover record with unique reference & QR payload.
 */
export async function saveOfflineHandover(handoverData) {
  const handover = {
    id: handoverData.id || crypto.randomUUID(),
    handover_ref: handoverData.handover_ref || ('KC-TRACE-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-MH-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
    lot_id: handoverData.lot_id,
    recycler_id: handoverData.recycler_id || 'rec_ecorecycle_01',
    collector_id: handoverData.collector_id || 'col_8832a',
    weight: parseFloat(handoverData.weight || 1.0),
    material_category: handoverData.material_category || 'PCB',
    gps_lat: handoverData.gps_lat || 19.0435,
    gps_lng: handoverData.gps_lng || 72.8566,
    status: handoverData.status || 'PENDING_CONFIRMATION',
    sync_status: 'UNSYNCED',
    created_at: handoverData.created_at || new Date().toISOString(),
    synced_at: null
  };

  await db.offline_handovers.put(handover);
  return handover;
}

/**
 * Fetch all handovers currently pending sync.
 */
export async function getUnsyncedHandovers() {
  return await db.offline_handovers.where('sync_status').equals('UNSYNCED').toArray();
}

/**
 * Mark an offline handover record as synced.
 */
export async function markHandoverSynced(id, serverData = {}) {
  await db.offline_handovers.update(id, {
    sync_status: 'SYNCED',
    synced_at: new Date().toISOString(),
    ...(serverData.status ? { status: serverData.status } : {})
  });
}

/**
 * Cache current market benchmark prices for offline price valuation.
 */
export async function cachePriceRates(pricesList) {
  if (!Array.isArray(pricesList)) return;
  for (const item of pricesList) {
    if (item.category) {
      await db.cached_prices.put({
        category: item.category,
        buying_price: parseFloat(item.buying_price || item.current_rate || 0),
        updated_at: new Date().toISOString()
      });
    }
  }
}

/**
 * Retrieve cached price per kg for offline pricing when disconnected.
 */
export async function getCachedPrice(category) {
  const cached = await db.cached_prices.get(category);
  if (cached) return cached.buying_price;
  
  // Default baseline fallbacks if cache is empty
  const defaults = {
    'PCB': 240.0,
    'BATTERIES': 80.0,
    'CABLES': 380.0,
    'DISPLAYS': 11.0,
    'APPLIANCES': 45.0,
    'MOTORS_MAGNETS': 110.0
  };
  return defaults[category] || 50.0;
}

/**
 * Get count of items awaiting sync.
 */
export async function getUnsyncedCount() {
  const unsyncedLots = await db.offline_lots.where('sync_status').equals('UNSYNCED').count();
  const unsyncedHandovers = await db.offline_handovers.where('sync_status').equals('UNSYNCED').count();
  return {
    lots: unsyncedLots,
    handovers: unsyncedHandovers,
    total: unsyncedLots + unsyncedHandovers
  };
}
