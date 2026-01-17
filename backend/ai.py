import requests
import os

HF_API_KEY = os.environ.get("HF_API_KEY")

if not HF_API_KEY:
    raise RuntimeError("HF_API_KEY not set")

API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "application/json"
}

def analyze_resume(text):
    text = text[:2500]

    prompt = f"""
Analyze the following resume and return:

1. Skills
2. Suitable job roles
3. Improvement tips
4. Placement readiness score (0-100)

Resume:
{text}
"""

    response = requests.post(
        API_URL,
        headers=headers,
        json={"inputs": prompt},
        timeout=60
    )

    # 🔍 DEBUG: print raw response in Render logs
    print("HF RAW RESPONSE:", response.text)

    if response.status_code != 200:
        raise RuntimeError(response.text)

    data = response.json()

    # ✅ HANDLE ALL RESPONSE SHAPES SAFELY
    if isinstance(data, list) and len(data) > 0:
        if "summary_text" in data[0]:
            return data[0]["summary_text"]
        if "generated_text" in data[0]:
            return data[0]["generated_text"]

    if isinstance(data, dict):
        if "summary_text" in data:
            return data["summary_text"]
        if "generated_text" in data:
            return data["generated_text"]
        if "error" in data:
            raise RuntimeError(data["error"])

    raise RuntimeError("Unexpected AI response format")
