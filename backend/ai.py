import requests
import os

HF_API_KEY = os.environ.get("HF_API_KEY")

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

def analyze_resume(text, job_role):
    # Keep text short for free tier
    text = text[:1800]

    response = requests.post(
        API_URL,
        headers=headers,
        json={"inputs": text},
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
