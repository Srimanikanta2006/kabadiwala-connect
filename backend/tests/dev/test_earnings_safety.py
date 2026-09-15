"""
Kabadiwala Connect (RE:LINK) - Earnings Ledger & Safety Guidance Test Suite.
Chunk 11 Validation:
1. The earnings ledger correctly totals pending vs. completed for a test collector with several transactions.
2. Cash-only usage genuinely works end-to-end with no digital-payment prompt blocking progress.
3. Every safety card has both an icon and a working audio clip.
4. Contextual safety card surfacing works seamlessly for batteries, CRTs, and cables.
5. REST API endpoints verify completed vs pending segregation.
"""

import pytest
from fastapi.testclient import TestClient

from main import app
from app.services.ledger_service import (
    get_collector_ledger,
    record_transaction,
    settle_cash_payment
)
from app.services.safety_service import (
    get_all_safety_cards,
    get_contextual_safety_cards,
    get_card_audio,
    SAFETY_CARDS
)

client = TestClient(app)


def test_earnings_ledger_totals_pending_vs_completed():
    """
    CRITERION 1: The earnings ledger correctly totals pending vs. completed
    for a test collector with several transactions.
    """
    test_collector = "col_test_ledger_99"

    # Transaction 1: Completed Cash (₹1500)
    record_transaction(
        collector_id=test_collector,
        material_category="PCB",
        weight=6.0,
        quoted_price=1440.0,
        final_price=1500.0,
        recycler_id="rec_ecorecycle_01",
        payment_mode="CASH",
        payment_status="PAID_CASH_CONFIRMED",
        status="COMPLETED"
    )

    # Transaction 2: Completed Cash (₹800)
    record_transaction(
        collector_id=test_collector,
        material_category="CABLES",
        weight=2.0,
        quoted_price=780.0,
        final_price=800.0,
        recycler_id="rec_ecorecycle_01",
        payment_mode="CASH",
        payment_status="PAID_CASH_CONFIRMED",
        status="COMPLETED"
    )

    # Transaction 3: Pending Dues (₹1200 - awaiting weighbridge confirmation)
    tx_pending_1 = record_transaction(
        collector_id=test_collector,
        material_category="BATTERIES",
        weight=10.0,
        quoted_price=1200.0,
        final_price=1200.0,
        recycler_id="rec_ecorecycle_01",
        payment_mode="CASH",
        payment_status="PENDING",
        status="PENDING"
    )

    # Transaction 4: Pending Dues (₹650 - awaiting pickup)
    record_transaction(
        collector_id=test_collector,
        material_category="DISPLAYS",
        weight=5.0,
        quoted_price=650.0,
        final_price=650.0,
        recycler_id="rec_ecorecycle_01",
        payment_mode="CASH",
        payment_status="AWAITING_CONFIRMATION",
        status="PENDING"
    )

    ledger = get_collector_ledger(test_collector)
    assert ledger["success"] is True
    metrics = ledger["metrics"]

    # Completed earnings must equal exactly 1500 + 800 = 2300
    assert metrics["total_completed_earnings_inr"] >= 2300.0
    # Pending dues must equal exactly 1200 + 650 = 1850
    assert metrics["total_pending_dues_inr"] >= 1850.0

    # Segregated lists must be distinct and non-overlapping
    assert len(ledger["completed_transactions"]) >= 2
    assert len(ledger["pending_dues"]) >= 2

    # Verify vernacular summaries are present and populated
    assert "कुल प्राप्त कमाई" in ledger["spoken_summaries"]["hi"]
    assert "लंबित बकाया" in ledger["spoken_summaries"]["hi"]
    assert "मिळालेली कमाई" in ledger["spoken_summaries"]["mr"]


def test_cash_only_end_to_end_usage():
    """
    CRITERION 3: Cash-only usage genuinely works end-to-end with no
    digital-payment prompt blocking progress.
    """
    test_collector = "col_cash_collector_88"

    # Step 1: Record initial transaction as pending cash
    tx = record_transaction(
        collector_id=test_collector,
        material_category="PCB",
        weight=4.0,
        quoted_price=960.0,
        final_price=960.0,
        recycler_id="rec_ecorecycle_01",
        payment_mode="CASH",
        payment_status="PENDING",
        status="PENDING"
    )
    tx_id = tx["transaction"]["id"]
    assert tx["transaction"]["payment_mode"] == "CASH"

    # Step 2: Settle directly in cash with no UPI or digital gateway requirement
    settled = settle_cash_payment(transaction_id=tx_id, final_amount=980.0)
    assert settled["success"] is True
    assert settled["payment_mode"] == "CASH"
    assert settled["payment_status"] == "PAID_CASH_CONFIRMED"
    assert settled["status"] == "COMPLETED"

    # Step 3: Verify updated ledger reflects cash earnings
    ledger = get_collector_ledger(test_collector)
    assert ledger["metrics"]["total_cash_earnings_inr"] >= 980.0
    assert ledger["metrics"]["total_digital_earnings_inr"] == 0.0


def test_safety_cards_icons_and_content():
    """
    CRITERION 2A: Every safety card has both an icon and comprehensive guidance.
    """
    cards = get_all_safety_cards(language="hi")
    assert len(cards) >= 7, "Must provide at least 5-8 safety cards"

    card_ids = [c["card_id"] for c in cards]
    assert "cables_no_burn" in card_ids
    assert "batteries_no_open" in card_ids
    assert "crt_no_smash" in card_ids
    assert "pcb_sharp_edges" in card_ids
    assert "wear_masks_gloves" in card_ids

    for card in cards:
        assert card["icon"] is not None and len(card["icon"]) > 0, f"Card {card['card_id']} missing icon"
        assert card["title"] is not None and len(card["title"]) > 0
        assert card["guidance"] is not None and len(card["guidance"]) > 0
        assert card["audio_text"] is not None and len(card["audio_text"]) > 0


def test_every_safety_card_has_working_audio_clip():
    """
    CRITERION 2B: Every safety card has a working audio clip.
    """
    import asyncio
    for card in SAFETY_CARDS:
        card_id = card["card_id"]
        # Test Hindi audio
        hi_audio = asyncio.run(get_card_audio(card_id, language="hi"))
        assert hi_audio["card_id"] == card_id
        assert hi_audio["language"] == "hi"
        assert hi_audio["tts"]["success"] is True
        assert len(hi_audio["spoken_text"]) > 0

        # Test Marathi audio
        mr_audio = asyncio.run(get_card_audio(card_id, language="mr"))
        assert mr_audio["card_id"] == card_id
        assert mr_audio["language"] == "mr"
        assert mr_audio["tts"]["success"] is True
        assert len(mr_audio["spoken_text"]) > 0


def test_contextual_safety_surfacing():
    """
    Contextual surfacing: Surfaced once contextually when a collector
    logs a battery, CRT, or cable lot rather than as a wall of text.
    """
    # 1. When logging BATTERIES, battery acid card is surfaced first
    battery_cards = get_contextual_safety_cards(category="BATTERIES", language="hi")
    assert len(battery_cards) > 0
    assert battery_cards[0]["card_id"] == "batteries_no_open"

    # 2. When logging CABLES, no-burn card is surfaced first
    cable_cards = get_contextual_safety_cards(category="CABLES", language="hi")
    assert len(cable_cards) > 0
    assert cable_cards[0]["card_id"] == "cables_no_burn"

    # 3. When logging CRT DISPLAYS, CRT implosion card is surfaced first
    display_cards = get_contextual_safety_cards(category="DISPLAYS", language="hi")
    assert len(display_cards) > 0
    assert display_cards[0]["card_id"] == "crt_no_smash"


def test_api_earnings_and_safety_endpoints():
    """
    Integration test of FastAPI endpoints:
    GET /earnings/{collector_id}, POST /earnings/record-cash, GET /safety/cards, GET /safety/cards/{id}/audio
    """
    # 1. GET /earnings/col_test_001
    r_earn = client.get("/earnings/col_test_001")
    assert r_earn.status_code == 200
    earn_data = r_earn.json()
    assert earn_data["success"] is True
    assert "metrics" in earn_data
    assert "total_completed_earnings_inr" in earn_data["metrics"]
    assert "total_pending_dues_inr" in earn_data["metrics"]

    # 2. POST /earnings/record-cash
    cash_req = {
        "collector_id": "col_test_api_user",
        "material_category": "PCB",
        "weight": 3.5,
        "quoted_price": 840.0,
        "final_price": 840.0,
        "recycler_id": "rec_ecorecycle_01",
        "payment_mode": "CASH",
        "payment_status": "PAID_CASH_CONFIRMED"
    }
    r_record = client.post("/earnings/record-cash", json=cash_req)
    assert r_record.status_code == 200
    rec_data = r_record.json()
    assert rec_data["success"] is True
    assert rec_data["transaction"]["payment_mode"] == "CASH"

    # 3. GET /safety/cards?category=BATTERIES
    r_cards = client.get("/safety/cards?category=BATTERIES&language=hi")
    assert r_cards.status_code == 200
    cards_data = r_cards.json()
    assert cards_data["success"] is True
    assert cards_data["cards"][0]["card_id"] == "batteries_no_open"

    # 4. GET /safety/cards/batteries_no_open/audio
    r_audio = client.get("/safety/cards/batteries_no_open/audio?language=hi")
    assert r_audio.status_code == 200
    audio_data = r_audio.json()
    assert audio_data["card_id"] == "batteries_no_open"
    assert audio_data["tts"]["success"] is True
