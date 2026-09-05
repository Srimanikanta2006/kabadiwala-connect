"""
Kabadiwala Connect (RE:LINK) - Collector Earnings Ledger Service.
Chunk 11: Transaction history, pending dues calculation, and cash-first settlement ledger.
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from app.db.supabase_client import get_supabase, get_recyclers

logger = logging.getLogger("kabadiwala.ledger")

# In-memory transactions cache for offline resilience and tests
_LOCAL_TRANSACTIONS: Dict[str, Dict[str, Any]] = {}


def get_collector_ledger(collector_id: str) -> Dict[str, Any]:
    """
    Step 1 & 2: List each collector's transactions with quoted price, final price, payment status, and date.
    Shows a running total of pending dues (unpaid/awaiting-confirmation transactions) separately from completed earnings.
    """
    client = get_supabase()
    db_transactions: List[Dict[str, Any]] = []

    if client:
        try:
            res = client.table("transactions").select("*").eq("collector_id", collector_id).order("created_at", desc=True).execute()
            if res.data:
                db_transactions = res.data
        except Exception as e:
            logger.warning(f"Error fetching transactions from Supabase: {e}")

    # Combine with in-memory transactions for this collector
    seen_ids = set()
    combined_transactions: List[Dict[str, Any]] = []

    for tx in db_transactions:
        tx_id = tx.get("id")
        if tx_id:
            seen_ids.add(tx_id)
        combined_transactions.append(tx)

    for tx_id, tx in _LOCAL_TRANSACTIONS.items():
        if tx.get("collector_id") == collector_id and tx_id not in seen_ids:
            seen_ids.add(tx_id)
            combined_transactions.append(tx)

    # Lookup recycler names and statutory references map
    recyclers = get_recyclers()
    rec_name_map = {r["id"]: (r.get("facility_name") or r.get("name", r["id"])) for r in recyclers if "id" in r}
    rec_ref_map = {r["id"]: (r.get("statutory_reference") or r.get("cpcb_registration_no", "")) for r in recyclers if "id" in r}

    completed_txs: List[Dict[str, Any]] = []
    pending_txs: List[Dict[str, Any]] = []

    for tx in combined_transactions:
        status = (tx.get("status") or "").upper()
        p_status = (tx.get("payment_status") or "").upper()
        
        # Enrich recycler display name and statutory reference
        r_id = tx.get("recycler_id", "")
        tx["recycler_name"] = rec_name_map.get(r_id, r_id or "Authorized Recycler Hub")
        tx["statutory_reference"] = tx.get("statutory_reference") or rec_ref_map.get(r_id, "")

        # Segregate into completed vs pending dues
        if status == "COMPLETED" or p_status.startswith("PAID_"):
            completed_txs.append(tx)
        else:
            pending_txs.append(tx)

    # Fetch pending lots from material_lots that are awaiting handover/payment
    pending_lots: List[Dict[str, Any]] = []
    if client:
        try:
            lres = client.table("material_lots").select("*").eq("collector_id", collector_id).in_("status", ["CREATED", "MATCHED", "PENDING_CONFIRMATION"]).execute()
            if lres.data:
                pending_lots = lres.data
        except Exception as e:
            logger.warning(f"Error fetching pending lots from Supabase: {e}")

    # Calculate pending dues: sum of pending transactions final/quoted prices + pending lots quoted prices
    pending_tx_dues = sum(float(tx.get("final_price") or tx.get("quoted_price", 0)) for tx in pending_txs)
    pending_lot_dues = sum(float(lot.get("quoted_price", 0)) for lot in pending_lots)
    total_pending_dues = round(pending_tx_dues + pending_lot_dues, 2)

    total_completed_earnings = round(sum(float(tx.get("final_price", 0)) for tx in completed_txs), 2)
    total_cash_earnings = round(
        sum(float(tx.get("final_price", 0)) for tx in completed_txs if tx.get("payment_mode", "CASH").upper() == "CASH"),
        2
    )
    total_digital_earnings = round(
        sum(float(tx.get("final_price", 0)) for tx in completed_txs if tx.get("payment_mode", "").upper() in ["UPI", "DIGITAL", "BANK"]),
        2
    )
    total_weight = round(
        sum(float(tx.get("weight", 0)) for tx in completed_txs) + sum(float(lot.get("approximate_weight", 0)) for lot in pending_lots),
        2
    )

    # Vernacular voice summaries
    summary_hi = (
        f"कुल प्राप्त कमाई ₹{int(total_completed_earnings)} है। "
        f"लंबित बकाया राशि ₹{int(total_pending_dues)} है जो रीसायकलर सत्यापन के बाद नकद मिलेगी।"
    )
    summary_mr = (
        f"एकूण मिळालेली कमाई ₹{int(total_completed_earnings)} आहे. "
        f"येणे बाकी ₹{int(total_pending_dues)} आहे जे लवकरच रोख स्वरूपात मिळेल."
    )

    return {
        "success": True,
        "collector_id": collector_id,
        "metrics": {
            "total_completed_earnings_inr": total_completed_earnings,
            "total_pending_dues_inr": total_pending_dues,
            "total_cash_earnings_inr": total_cash_earnings,
            "total_digital_earnings_inr": total_digital_earnings,
            "total_volume_kg": total_weight,
            "completed_transaction_count": len(completed_txs),
            "pending_transaction_count": len(pending_txs) + len(pending_lots),
            "all_transaction_count": len(combined_transactions)
        },
        "completed_transactions": completed_txs,
        "pending_dues": pending_txs,
        "pending_lots": pending_lots,
        "spoken_summaries": {
            "hi": summary_hi,
            "mr": summary_mr
        }
    }


def record_transaction(
    collector_id: str,
    material_category: str,
    weight: float,
    quoted_price: float,
    final_price: float,
    recycler_id: str,
    lot_id: Optional[str] = None,
    payment_mode: str = "CASH",
    payment_status: str = "PAID_CASH_CONFIRMED",
    status: str = "COMPLETED"
) -> Dict[str, Any]:
    """
    Step 3: Keep payment status simple: cash (default), or marked digital.
    Never require a digital payment method to proceed.
    """
    client = get_supabase()
    tx_id = str(uuid.uuid4())
    actual_lot_id = lot_id or str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()

    tx_row = {
        "id": tx_id,
        "lot_id": actual_lot_id,
        "collector_id": collector_id,
        "material_category": material_category,
        "weight": float(weight),
        "quoted_price": float(quoted_price),
        "final_price": float(final_price),
        "recycler_id": recycler_id,
        "status": status,
        "payment_status": payment_status,
        "payment_mode": payment_mode.upper(),
        "created_at": now_iso
    }

    saved_to_db = False
    if client:
        try:
            res = client.table("transactions").insert(tx_row).execute()
            if res.data:
                tx_row = res.data[0]
                saved_to_db = True
        except Exception as e:
            logger.warning(f"Error inserting transaction into Supabase: {e}")

    # Always maintain in-memory cache
    _LOCAL_TRANSACTIONS[tx_id] = {**tx_row, "saved_to_db": saved_to_db}

    return {
        "success": True,
        "transaction": tx_row,
        "saved_to_db": saved_to_db
    }


def settle_cash_payment(transaction_id: str, final_amount: Optional[float] = None) -> Dict[str, Any]:
    """
    Settles a pending transaction in cash with zero digital requirement.
    """
    client = get_supabase()
    now_iso = datetime.now(timezone.utc).isoformat()
    updated = False

    # Check local cache
    tx = _LOCAL_TRANSACTIONS.get(transaction_id)
    if tx:
        tx["status"] = "COMPLETED"
        tx["payment_status"] = "PAID_CASH_CONFIRMED"
        tx["payment_mode"] = "CASH"
        if final_amount is not None:
            tx["final_price"] = float(final_amount)
        updated = True

    if client:
        try:
            update_data = {
                "status": "COMPLETED",
                "payment_status": "PAID_CASH_CONFIRMED",
                "payment_mode": "CASH"
            }
            if final_amount is not None:
                update_data["final_price"] = float(final_amount)
            res = client.table("transactions").update(update_data).eq("id", transaction_id).execute()
            if res.data:
                tx = res.data[0]
                updated = True
        except Exception as e:
            logger.warning(f"Error updating cash settlement in Supabase: {e}")

    if not updated and not tx:
        raise ValueError(f"Transaction '{transaction_id}' not found")

    return {
        "success": True,
        "message": "नकद भुगतान सफलतापूर्वक दर्ज किया गया (Cash Settlement Confirmed)",
        "transaction_id": transaction_id,
        "payment_mode": "CASH",
        "payment_status": "PAID_CASH_CONFIRMED",
        "status": "COMPLETED"
    }
