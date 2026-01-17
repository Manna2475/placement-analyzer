import requests
import os

HF_API_KEY = os.environ.get("HF_API_KEY")

if not HF_API_KEY:
    raise RuntimeError("HF_API_KEY not set")

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

def analyze_resume(text):
    text = text[:3000]  # safety limit

    prompt = f"""
Analyze the following resume and return:

1. Key skills
2. Suitable job roles
3. Improvement suggestions
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

    if response.status_code != 200:
        raise RuntimeError(response.text)

    data = response.json()

    return data[0]["summary_text"]
