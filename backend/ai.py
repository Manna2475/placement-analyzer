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

def analyze_resume(text, job_role):
    text = text[:1800]  # free-tier safe length

    response = requests.post(
        API_URL,
        headers=headers,
        json={
            "inputs": text,
            "parameters": {
                "max_length": 200,
                "min_length": 60,
                "do_sample": False
            }
        },
        timeout=60
    )

    if response.status_code != 200:
        print("HF ERROR:", response.text)
        raise RuntimeError("HuggingFace API failed")

    data = response.json()

    summary = data[0]["summary_text"]

    return {
        "ats_score": 65,
        "hiring_chance_percent": 60,
        "matched_skills": [],
        "missing_skills": [],
        "improvement_areas": [
            "Add measurable project outcomes",
            "Improve resume formatting"
        ],
        "resume_strengths": [
            "Relevant technical background"
        ],
        "final_verdict": summary
    }
