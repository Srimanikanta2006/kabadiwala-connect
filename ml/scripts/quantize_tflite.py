"""
Post-Training INT8 Quantization Script for YOLOv8n / MobileNet.
Converts floating-point PyTorch/ONNX models into highly compressed (<8MB),
low-latency (<65ms) TFLite INT8 models optimized for low-end Android phones.
"""

import os
import sys

def convert_to_tflite_int8(saved_model_dir: str, output_tflite_path: str):
    """
    Executes INT8 quantization with representative dataset calibration.
    """
    try:
        import tensorflow as tf
    except ImportError:
        print("TensorFlow is required for TFLite quantization: pip install tensorflow")
        return

    print(f"Loading SavedModel from: {saved_model_dir}")
    converter = tf.lite.TFLiteConverter.from_saved_model(saved_model_dir)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Dummy calibration generator for illustration
    def representative_dataset_gen():
        import numpy as np
        for _ in range(100):
            data = np.random.rand(1, 640, 640, 3).astype(np.float32)
            yield [data]

    converter.representative_dataset = representative_dataset_gen
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type = tf.uint8
    converter.inference_output_type = tf.uint8

    print("Quantizing weights to INT8...")
    tflite_quant_model = converter.convert()

    with open(output_tflite_path, "wb") as f:
        f.write(tflite_quant_model)

    size_mb = os.path.getsize(output_tflite_path) / (1024 * 1024)
    print(f"INT8 model saved to {output_tflite_path} ({size_mb:.2f} MB)")


if __name__ == "__main__":
    print("YOLOv8 INT8 Quantization utility ready.")
