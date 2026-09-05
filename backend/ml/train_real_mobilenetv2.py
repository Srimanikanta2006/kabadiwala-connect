"""
MobileNetV2 Training and Independent Evaluation on Real 10-Class E-Waste Dataset.
Kabadiwala Connect (RE:LINK).

Dataset: 3,000 real e-waste images
Official Splits: 2,400 Train | 300 Validation | 300 Test (Zero split leakage)
Architecture: MobileNetV2 with Transfer Learning
"""

import os
import sys
import time
import json
from pathlib import Path
import numpy as np
from PIL import Image

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support

BASE_DIR = Path(r"C:\Users\srima\Documents\Web Experiments\Kabadiwala Connect")
DATASET_ROOT = BASE_DIR / "datasets" / "real_ewaste" / "modified-dataset"
OUTPUT_DIR = BASE_DIR / "backend" / "ml"
OUTPUT_MODEL_PATH = OUTPUT_DIR / "mobilenetv2_real_ewaste.pt"
OUTPUT_METRICS_PATH = OUTPUT_DIR / "evaluation_metrics_real.json"

BATCH_SIZE = 32
NUM_CLASSES = 10
NUM_EPOCHS = 6
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def get_transforms():
    # 1. Heavy realistic augmentation ONLY on training set
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomResizedCrop(224, scale=(0.85, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.2),
        transforms.GaussianBlur(kernel_size=(3, 3), sigma=(0.1, 1.2)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # 2. Strict evaluation transforms on validation and test (NO augmentation)
    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return train_transform, eval_transform

def train_and_evaluate():
    print(f"Using device: {DEVICE}")
    print(f"Dataset root: {DATASET_ROOT}")

    train_tf, eval_tf = get_transforms()

    train_dataset = datasets.ImageFolder(str(DATASET_ROOT / "train"), transform=train_tf)
    val_dataset = datasets.ImageFolder(str(DATASET_ROOT / "val"), transform=eval_tf)
    test_dataset = datasets.ImageFolder(str(DATASET_ROOT / "test"), transform=eval_tf)

    class_names = train_dataset.classes
    print(f"Classes ({len(class_names)}): {class_names}")
    print(f"Sample counts: Train={len(train_dataset)}, Val={len(val_dataset)}, Test={len(test_dataset)}")

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    # Load MobileNetV2 with pretrained ImageNet weights
    print("Loading pretrained MobileNetV2 backbone...")
    weights = models.MobileNet_V2_Weights.DEFAULT
    model = models.mobilenet_v2(weights=weights)

    # Freeze base feature extractor initially
    for param in model.features.parameters():
        param.requires_grad = False

    # Replace classifier head for 10 classes
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(256, NUM_CLASSES)
    )

    model = model.to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.classifier.parameters(), lr=1e-3, weight_decay=1e-4)

    history = {
        "train_loss": [],
        "train_acc": [],
        "val_loss": [],
        "val_acc": []
    }

    best_val_acc = 0.0
    start_train_time = time.time()

    print("\n--- Starting Phase 1: Warmup Classifier Head (3 epochs) ---")
    for epoch in range(1, NUM_EPOCHS + 1):
        if epoch == 4:
            print("\n--- Phase 2: Fine-Tuning Top Feature Layers ---")
            # Unfreeze top layers of feature backbone (layers 14 to 18)
            for param in model.features[14:].parameters():
                param.requires_grad = True
            optimizer = torch.optim.Adam([
                {"params": model.features[14:].parameters(), "lr": 1e-4},
                {"params": model.classifier.parameters(), "lr": 3e-4}
            ], weight_decay=1e-4)

        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += torch.sum(preds == labels.data).item()
            total += labels.size(0)

        epoch_train_loss = running_loss / total
        epoch_train_acc = correct / total

        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += torch.sum(preds == labels.data).item()
                val_total += labels.size(0)

        epoch_val_loss = val_loss / val_total
        epoch_val_acc = val_correct / val_total

        history["train_loss"].append(round(epoch_train_loss, 4))
        history["train_acc"].append(round(epoch_train_acc, 4))
        history["val_loss"].append(round(epoch_val_loss, 4))
        history["val_acc"].append(round(epoch_val_acc, 4))

        print(f"Epoch {epoch}/{NUM_EPOCHS} -> Train Loss: {epoch_train_loss:.4f}, Train Acc: {epoch_train_acc*100:.2f}% | Val Loss: {epoch_val_loss:.4f}, Val Acc: {epoch_val_acc*100:.2f}%")

        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save({
                "model_state_dict": model.state_dict(),
                "class_names": class_names,
                "val_acc": best_val_acc,
                "epoch": epoch
            }, OUTPUT_MODEL_PATH)
            print(f"  * Saved new best model checkpoint (Val Acc: {best_val_acc*100:.2f}%)")

    total_train_duration = time.time() - start_train_time
    print(f"\nTraining completed in {total_train_duration:.2f} seconds.")

    # 3. Independent Evaluation on official TEST set
    print("\n--- Independent Evaluation on TEST Split (300 images) ---")
    checkpoint = torch.load(OUTPUT_MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    all_preds = []
    all_labels = []
    all_probs = []

    test_start = time.time()
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(DEVICE)
            outputs = model(images)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())
            all_probs.extend(probs.cpu().numpy())

    test_duration = time.time() - test_start
    avg_inference_latency_ms = (test_duration / len(test_dataset)) * 1000

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)

    test_acc = np.mean(all_preds == all_labels)
    precision_macro, recall_macro, f1_macro, _ = precision_recall_fscore_support(all_labels, all_preds, average='macro')
    precision_weighted, recall_weighted, f1_weighted, _ = precision_recall_fscore_support(all_labels, all_preds, average='weighted')

    prec_per_class, rec_per_class, f1_per_class, support_per_class = precision_recall_fscore_support(all_labels, all_preds, average=None)

    cm = confusion_matrix(all_labels, all_preds)

    model_size_mb = os.path.getsize(OUTPUT_MODEL_PATH) / (1024 * 1024)

    per_class_metrics = {}
    for idx, cname in enumerate(class_names):
        per_class_metrics[cname] = {
            "precision": round(float(prec_per_class[idx]), 4),
            "recall": round(float(rec_per_class[idx]), 4),
            "f1_score": round(float(f1_per_class[idx]), 4),
            "support": int(support_per_class[idx])
        }

    evaluation_report = {
        "model_architecture": "MobileNetV2 (1.0x alpha)",
        "dataset": {
            "source": "Kaggle Real E-Waste Image Dataset",
            "classes": class_names,
            "train_samples": len(train_dataset),
            "val_samples": len(val_dataset),
            "test_samples": len(test_dataset)
        },
        "test_metrics": {
            "overall_accuracy": round(float(test_acc), 4),
            "macro_precision": round(float(precision_macro), 4),
            "macro_recall": round(float(recall_macro), 4),
            "macro_f1_score": round(float(f1_macro), 4),
            "weighted_f1_score": round(float(f1_weighted), 4)
        },
        "per_class_metrics": per_class_metrics,
        "confusion_matrix": cm.tolist(),
        "training_curves": history,
        "performance_profile": {
            "mean_inference_latency_ms": round(float(avg_inference_latency_ms), 2),
            "model_size_mb": round(float(model_size_mb), 2),
            "total_train_time_sec": round(float(total_train_duration), 2)
        }
    }

    with open(OUTPUT_METRICS_PATH, "w", encoding="utf-8") as fp:
        json.dump(evaluation_report, fp, indent=2)

    print("\n================ FINAL BENCHMARK RESULTS ================")
    print(f"Test Accuracy:         {test_acc * 100:.2f}%")
    print(f"Macro F1-Score:        {f1_macro * 100:.2f}%")
    print(f"Weighted F1-Score:     {f1_weighted * 100:.2f}%")
    print(f"Mean Inference Time:   {avg_inference_latency_ms:.2f} ms / image (CPU)")
    print(f"Model Checkpoint Size: {model_size_mb:.2f} MB")
    print("\nPer-Class Breakdown:")
    for cname, m in per_class_metrics.items():
        print(f"  - {cname:15s}: Prec={m['precision']*100:5.1f}%, Rec={m['recall']*100:5.1f}%, F1={m['f1_score']*100:5.1f}% (N={m['support']})")

    print("\nConfusion Matrix (10x10):")
    print(cm)
    print(f"\nReport written to: {OUTPUT_METRICS_PATH}")
    return evaluation_report

if __name__ == "__main__":
    train_and_evaluate()
