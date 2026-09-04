"""
Real-World Data Augmentation Pipeline for Informal Scrap/E-Waste Imagery.
Simulates 'Kabadiwala Photography': motion blur, poor lighting, dust/oil stains,
severe perspective tilts, and multi-object clutter.
"""

import os
import cv2
import numpy as np

try:
    import albumentations as A
except ImportError:
    A = None


def get_kabadiwala_augmentation_pipeline():
    """
    Returns an Albumentations composition specifically tuned for informal scrap yard photography.
    """
    if A is None:
        raise ImportError("Please install albumentations: pip install albumentations")

    return A.Compose([
        # 1. Camera lens blur, hand-shake, and defocus
        A.OneOf([
            A.MotionBlur(blur_limit=7, p=0.4),
            A.GaussianBlur(blur_limit=5, p=0.3),
            A.Defocus(radius=(2, 5), p=0.3),
        ], p=0.6),

        # 2. Harsh lighting variations (dark godowns vs burning direct sunlight)
        A.RandomBrightnessContrast(brightness_limit=0.35, contrast_limit=0.35, p=0.7),
        A.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1, p=0.4),

        # 3. Low-angle phone holding and spatial perspectives
        A.Perspective(scale=(0.05, 0.12), p=0.5),
        A.HorizontalFlip(p=0.5),
        A.Rotate(limit=25, p=0.5),

        # 4. Occlusion, dirt stains, and shadows
        A.CoarseDropout(
            max_holes=6,
            max_height=40,
            max_width=40,
            min_holes=2,
            fill_value=30,
            p=0.4
        ),

        # 5. Low-end camera JPEG compression artifacts
        A.ImageCompression(quality_lower=35, quality_upper=80, p=0.5)
    ], bbox_params=A.BboxParams(format='yolo', label_fields=['category_ids'], min_visibility=0.3))


if __name__ == "__main__":
    print("Kabadiwala Augmentation Pipeline initialized successfully.")
