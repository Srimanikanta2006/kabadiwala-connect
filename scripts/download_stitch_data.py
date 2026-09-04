import os
import json
import urllib.request
import urllib.error

OUTPUT_DIR = r"C:\Users\srima\Documents\Web Experiments\Kabadiwala Connect\stitch-designs"
SCREENS_DIR = os.path.join(OUTPUT_DIR, "screens")
ASSETS_DIR = os.path.join(OUTPUT_DIR, "assets")

os.makedirs(SCREENS_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

screens = [
    {
        "id": "52e1254c2add4b3db4165f3bd36ea5e6",
        "folder": "01_collector_home",
        "title": "RE:LINK - Collector Home",
        "screenshot": "https://lh3.googleusercontent.com/aida/AEtjO1XBnA4p_loZR5YF38431f_a02XnetZejjkMkfQU8nzAQjYyiL9l1GBal6AM6uxIXj_pemPehrkjGCuuhHJqrpTqORZOeLx7kHuV9EUin68_vN8d1bVdUSmJ9oEePKUe3Fy2hKFDUKjfMowK7_1tNYFW2Vys9p9cCOirfsqo669URajiWzXprypqPZPcSY7nGGRWIJSIVAO_Aa446I5e8YUGkdzIaVJrxaxvuCEPIujt2BNxatxrfjLdmb0",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWE3MmI4NGM0ZDQwMWI0ZGVmZGQ1MDNjY2JjEgsSBxDfgZfAjQEYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTY3NjAzNDAzNzAxMTM1MTk0&filename=&opi=89354086"
    },
    {
        "id": "18dbd292833144a1957c29efe42d6033",
        "folder": "02_ai_material_identification",
        "title": "AI Material Identification & Confidence",
        "screenshot": "https://lh3.googleusercontent.com/aida/AEtjO1Vd_N3tXtGqbhNw9bxsRFt2x1cYXDzXWfE_JIjRVriiXzuxMSVE9n94AJgtjMevbnfJMoxtAPG-GzxIYwg3I8fzvMCQg753wz-jb4V9IbpZ8FA9uhMZt6qvgx7nocOVzSIF4mMfd01_TypWanAr5o-SB-8eoRPCkRMCXDZJWmMd7UVvFj9NwcG0Xo7B5wIpZ1JB_viYiMrw-DfGLYPnirdiEvZpfo2NsYpUuwu5MXRMSv923JaqL5Gib6g",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWE3MjM5ZmQ4M2QwN2M0ZWRiNDY0MmMzODU4EgsSBxDfgZfAjQEYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTY3NjAzNDAzNzAxMTM1MTk0&filename=&opi=89354086"
    },
    {
        "id": "28ea278cfa4e42f3a32f0abe3b425cca",
        "folder": "03_create_lot_select_category",
        "title": "Create Lot - Select Category",
        "screenshot": "https://lh3.googleusercontent.com/aida/AEtjO1Wk5AxZHg_Mb0PCAH58cnsick-tc7DvrSid-1z_mxmtIj2AOl_N-aa0S7KRVCZKred1jlZIxXnDglse5D1GoJt3Q8bS8mqdcJZXq39RznybKhyb6ZjrF6H0gsENqHzVbUon0Pz_pPWzaDZzcHDKjqYteE2HdGYaknzel0ERo4_D3yZtQpyoAashDkie5Xs2wvggnOowqTdu9nfkJgpQnei6e6BIUsd7nEWaPL23A9A3Rnfe0XRx-jG9b7k",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWE3MmJiZGFmNjUwMmE5YWE0MmNkMDdmMTg1EgsSBxDfgZfAjQEYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTY3NjAzNDAzNzAxMTM1MTk0&filename=&opi=89354086"
    },
    {
        "id": "75bc3fb1e55e4504ab8debc6cee5561b",
        "folder": "04_price_discovery_offers",
        "title": "Price Discovery & Offers",
        "screenshot": "https://lh3.googleusercontent.com/aida/AEtjO1Xl94tt47MKmVw3MlABAi-iwnIw-Mo4d_8crJHEQJJ8icLr-P0eQ5zdgczIRh0jYIY6Mkqotx1DAy7eGMVpGu4UKMm_6qsOyIR6U8DPv6T0118sl00On6nNxiQvH5kfaLPW1y5O2gHs-aJEjvX8NPLFtGXe6wvgyagJo2-XDiow-SEvcSZNJyU2KGwpcfXygwVMN6RkddyanwHuIdYlyb9N5V3Ihuyb741wnYVUwVjVmDUt03hfb9ddUQ",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YTM0YTIzZjJlOWYwMWE2MDJiMGY2MTk0MjcyEgsSBxDfgZfAjQEYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTY3NjAzNDAzNzAxMTM1MTk0&filename=&opi=89354086"
    },
    {
        "id": "55c80b20fa9a40d2b05b2e29055e0604",
        "folder": "05_digital_handover_receipt",
        "title": "Digital Handover & Traceability Receipt",
        "screenshot": "https://lh3.googleusercontent.com/aida/AEtjO1UmHljUFvbgransditrBbXllGOVaCyI-TWZ40geaE1DXrE2Z51A-Ryx8CF9KCe-WcasS3La8aSOSOazw6cM7m_O2uTFwqt_OJKtn_nrSd3K7JGJcpSMkSrTBu0Enn7IyvrSgLdp_-9ObvWNZ4HvFFAqajp_9Bp_xt_s2y5SDyuQamU-7zT_7GBrOMW-uzndmBozt6Bx8x8rZ4hvH6-MDfP-I97O_gtby-gJCsyRQ1tE3LLzxjhxqX--LDU",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YWE3MjM4ZjgyZmEwN2M0ZGU5NGQ4MjI3MGZkEgsSBxDfgZfAjQEYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTY3NjAzNDAzNzAxMTM1MTk0&filename=&opi=89354086"
    },
    {
        "id": "0ecf9cefd2a64adc9c242d39388c0eac",
        "folder": "06_my_earnings_history",
        "title": "My Earnings History",
        "screenshot": "https://lh3.googleusercontent.com/aida/AEtjO1WaJ3Vf-9haKdeneEs3_EFZ5ERZkK5nE8vOtiRaKJtOQ5rF0NpxPXpArRu7uNzE4k6ZzBGrjbwMPzyYqlrdGun7Ai7-PS0dTOJlbufxLC0z43LcHcefFmRBn_jZtBu8io2YUBCDKGuFgH7G595rMBezEAQIj-1HBsxukBlwMGlt98r6RhyT8p0AlCyLz8T83xNLFxDEZnp2Qi2uGKOxKW3PVvnJXVpKNk1IJ6kjXKnpVXyraX47kPFoegU",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YTM0YTJhZjM5NjMwNDczNmMxNDRkMTI4YTcwEgsSBxDfgZfAjQEYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTY3NjAzNDAzNzAxMTM1MTk0&filename=&opi=89354086"
    }
]

assets = [
    {
        "filename": "pcb_motherboards.png",
        "title": "PCB Scrap Motherboards",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1Uibj7iPqmg9YKdnMYAfgjprFLErbb0FcOdAiLVCHgIpkj7gbP3YTmKP8zFMrg1kaOj63apJEhpOtxdLXe-93ri5nb5eVArP4y3X_auotJ1wePJz5s4YibZAvhuz-KAXyzC05MmFpsIy-yBUY4Mqu5yd0ohBBU3_J9_aC-nPfLKrNm8V66IvtxKehIH0e-8jnBWhBN-DbfYt6LisI-TlJcyw1QSl4R5LDqnipESfPn5rrrJ6LyUFidtmQ"
    },
    {
        "filename": "copper_cables_wire.png",
        "title": "Copper Electrical Cables & Insulated Wire",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1WgXxj3PTs-7lfhFp-JK48EFoiQ6J122eiWOD5bFME_YW39QqWjSOtecSCCok96UgeiWft9i-8N-b4CLTLOt2TKYJpTgjDclW5fZ8pW2Ao12n1xdcxpIMTthmcakRwFYe5pJNiNHbEvQXiTZ6Dg62wI00Pp4LCfvkBxSm5ebeUHSLS26HhnhDK3yHfN-r9YHbPLIFxigyiHuXbRjgJuBMMKwgaWB7DxGJ8xsxedgkY1tTjZMRuMCZsxeAQ"
    },
    {
        "filename": "scrap_batteries.png",
        "title": "Lead-Acid and Lithium Scrap Batteries",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1V-RyTcOmamLffE3rPRCnOFJFqeX89hrpxyDTJHKg8C1YrrSLW0PYx__6oaYx55HsSnI8iOk5VioXK9IrhiP_6w2d3N7r2jeRljSDzHCd3_yvQ6E4NJbBdO0lJoTPm2EfOHnFS9c1X_yMui1hCKcGeEhK8-KQqDyW5b4CeMcHt9-n1IPzym8V89M7T1p19ZYCs9Q9fBpmUWSgmpwwPTUQJDfkYM9E9Jg7LY7kUxFZJv__ha6Kkcet5ffA"
    },
    {
        "filename": "crt_monitor_scrap.png",
        "title": "Vintage CRT Television Monitor Scrap",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1VayPBU-C8Fvg0-_gqO8eUTTbsRj_AE9jOm79VuEtbfgUWmhnE82uun3BkRoT9dyjmmEqoaUptyPgZOA0WUF4imIFLszOc3LVoKTsXBGExBPfEQm3fiCyNVRsvFZq7nIklSmV0CgSaaZ_qM3lzZg72Jq6jru3rlqSbfcsVtvKTMwgnP4-qEez4bea8hnPksSQh_y1_pGTgVLnFeiwIpZaMrSwYFVHv45t6UG7wUwzxyQu8LNOd-xElazw"
    }
]

def download_file(url, dest_path):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            with open(dest_path, "wb") as f:
                f.write(data)
        print(f"Downloaded: {dest_path} ({len(data)} bytes)")
    except Exception as e:
        print(f"Error downloading {url} -> {dest_path}: {e}")

print("--- Downloading Screens ---")
for s in screens:
    s_dir = os.path.join(SCREENS_DIR, s["folder"])
    os.makedirs(s_dir, exist_ok=True)
    
    # Screenshot
    ss_path = os.path.join(s_dir, "screenshot.png")
    print(f"Fetching screenshot for {s['title']}...")
    download_file(s["screenshot"], ss_path)
    
    # HTML
    html_path = os.path.join(s_dir, "index.html")
    print(f"Fetching HTML for {s['title']}...")
    download_file(s["html"], html_path)
    
    # Meta
    with open(os.path.join(s_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(s, f, indent=2)

print("\n--- Downloading Image Assets ---")
for a in assets:
    a_path = os.path.join(ASSETS_DIR, a["filename"])
    print(f"Fetching asset {a['title']}...")
    download_file(a["url"], a_path)

print("\nAll Stitch downloads complete!")
