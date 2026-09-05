import os
import base64
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

# Load env variables from backend/.env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
ROBOFLOW_MODEL_ID = os.getenv("ROBOFLOW_MODEL_ID", "e-waste-dataset-r0ojc/43")
ROBOFLOW_API_URL = os.getenv("ROBOFLOW_API_URL", "https://serverless.roboflow.com")

def test_roboflow_inference(image_path: str):
    print(f"Testing Roboflow model: {ROBOFLOW_MODEL_ID}")
    print(f"Reading image: {image_path}")

    with open(image_path, "rb") as f:
        image_bytes = f.read()
        b64_str = base64.b64encode(image_bytes).decode("utf-8")

    endpoint = f"{ROBOFLOW_API_URL}/{ROBOFLOW_MODEL_ID}"
    headers = {
        "Authorization": f"Bearer {ROBOFLOW_API_KEY}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    print(f"Posting to {endpoint} with Authorization: Bearer <API_KEY>...")
    with httpx.Client(timeout=30.0) as client:
        response = client.post(endpoint, content=b64_str, headers=headers)

    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print("Predictions JSON:")
        print(json.dumps(data, indent=2))
        return data
    except Exception:
        print("Raw response:")
        print(response.text)
        return None

if __name__ == "__main__":
    test_img = Path(__file__).resolve().parent.parent.parent / "datasets" / "real_ewaste" / "modified-dataset" / "test" / "Mobile" / "Mobile_106.jpg"
    test_roboflow_inference(str(test_img))
