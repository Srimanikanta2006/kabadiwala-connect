"""
Test script to verify Supabase storage upload to 'lot-photos'.
"""

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def test_upload():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Missing SUPABASE_URL or SUPABASE_KEY in .env")
        return False

    client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 1x1 transparent PNG byte payload
    dummy_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

    try:
        res = client.storage.from_("lot-photos").upload(
            file=dummy_png,
            path="test_handover_sample.png",
            file_options={"content-type": "image/png", "upsert": "true"}
        )
        print("Upload Successful! Result:", res)
        public_url = client.storage.from_("lot-photos").get_public_url("test_handover_sample.png")
        print(f"Public URL: {public_url}")
        return True
    except Exception as e:
        print(f"Upload failed: {e}")
        return False

if __name__ == "__main__":
    test_upload()
