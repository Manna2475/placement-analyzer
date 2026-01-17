import requests
import os

HF_API_KEY = os.environ.get("HF_API_KEY")

if not HF_API_KEY:
    raise RuntimeError("HF_API_KEY not set")

# ✅ NEW SUPPORTED ENDPOINT
API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "application/json"
}

def analyze_resume(text):
    text = text[:3000]  # safety limit

    prompt = f"""
Analyze the following resume and return clearly:

1. Skills
2. Suitable job roles
3. Improvement tips
4. Placement readiness score (0-100)

Resume:
{text}
"""

    payload = {
        "inputs": prompt
    }

    response = requests.post(
        API_URL,
        headers=headers,
        json=payload,
        timeout=60
    )

    if response.status_code != 200:
        raise RuntimeError(response.text)

    data = response.json()

    # bart-large-cnn returns summary_text
    return data[0]["summary_text"]
