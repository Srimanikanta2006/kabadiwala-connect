import os
import sys
import zipfile
import hashlib
from pathlib import Path
from PIL import Image
import json

BASE_DIR = Path(r"C:\Users\srima\Documents\Web Experiments\Kabadiwala Connect")
ZIP_PATH = Path(r"C:\Users\srima\Downloads\archive.zip")
EXTRACT_DIR = BASE_DIR / "datasets" / "real_ewaste"

def extract_all():
    print(f"Extracting {ZIP_PATH} -> {EXTRACT_DIR} ...")
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ZIP_PATH, 'r') as zf:
        zf.extractall(EXTRACT_DIR)
    print("Extraction complete.")

def audit_dataset():
    root = EXTRACT_DIR / "modified-dataset"
    if not root.exists():
        # Fallback to search if root is named differently
        for p in EXTRACT_DIR.glob("**/train"):
            root = p.parent
            break

    print(f"Auditing dataset at: {root}")
    splits = ["train", "val", "test"]
    stats = {}
    corrupted_files = []
    file_hashes = {}
    duplicates = []
    
    total_images = 0

    for split in splits:
        split_dir = root / split
        if not split_dir.exists():
            print(f"Warning: {split_dir} does not exist!")
            continue
        
        stats[split] = {}
        for class_dir in sorted(split_dir.iterdir()):
            if class_dir.is_dir():
                class_name = class_dir.name
                files = list(class_dir.glob("*.*"))
                stats[split][class_name] = len(files)
                total_images += len(files)
                
                for f in files:
                    # 1. Integrity check
                    try:
                        with Image.open(f) as img:
                            img.verify()
                    except Exception as e:
                        corrupted_files.append({"file": str(f.relative_to(root)), "error": str(e)})

                    # 2. Duplicate check via SHA-256
                    try:
                        with open(f, "rb") as fp:
                            fhash = hashlib.sha256(fp.read()).hexdigest()
                            if fhash in file_hashes:
                                duplicates.append({
                                    "original": file_hashes[fhash],
                                    "duplicate": str(f.relative_to(root))
                                })
                            else:
                                file_hashes[fhash] = str(f.relative_to(root))
                    except Exception as e:
                        pass

    # Check for license or readme
    license_files = []
    for f in EXTRACT_DIR.glob("**/*"):
        if f.is_file() and f.suffix.lower() in [".txt", ".md", ".json", ".csv"] and not f.name.endswith(".jpg"):
            license_files.append(str(f.relative_to(EXTRACT_DIR)))

    report = {
        "dataset_root": str(root),
        "total_images": total_images,
        "splits": stats,
        "corrupted_images_count": len(corrupted_files),
        "corrupted_images": corrupted_files,
        "duplicate_images_count": len(duplicates),
        "duplicates_sample": duplicates[:10],
        "license_or_metadata_files": license_files
    }

    out_json = BASE_DIR / "datasets" / "dataset_audit_report.json"
    with open(out_json, "w", encoding="utf-8") as fp:
        json.dump(report, fp, indent=2)

    print("\n--- DATASET AUDIT SUMMARY ---")
    print(f"Total Images: {total_images}")
    print(f"Corrupted Images: {len(corrupted_files)}")
    print(f"Duplicates: {len(duplicates)}")
    print("\nSplit Class Counts:")
    for s, c_dict in stats.items():
        print(f"\n[{s.upper()} - Total: {sum(c_dict.values())}]")
        for c, count in c_dict.items():
            print(f"  - {c}: {count}")

    print(f"\nAudit report written to: {out_json}")
    return report

if __name__ == "__main__":
    extract_all()
    audit_dataset()
