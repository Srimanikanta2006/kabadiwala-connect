import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

client = create_client(SUPABASE_URL, SUPABASE_KEY)
tables = ['collectors', 'materials', 'recyclers', 'prices', 'material_lots', 'transactions', 'traceability']

print("--- Supabase Table Row Counts ---")
for t in tables:
    data = client.table(t).select("*").execute().data
    print(f"{t:15}: {len(data)} rows")

print("\n--- Testing Single Row Reads ---")
print("Collector ID:", client.table("collectors").select("id, preferred_language").limit(1).execute().data)
print("Material ID:", client.table("materials").select("id, sub_category, cpcb_e_waste_code").limit(1).execute().data)
print("Recycler:", client.table("recyclers").select("name, cpcb_registration_no").limit(1).execute().data)
print("Price sample:", client.table("prices").select("category, buying_price").limit(1).execute().data)
print("Material Lot:", client.table("material_lots").select("id, material_category, quoted_price").limit(1).execute().data)
print("Transaction:", client.table("transactions").select("id, final_price, payment_mode").limit(1).execute().data)
print("Traceability:", client.table("traceability").select("handover_ref, status").limit(1).execute().data)
