import requests
import os

HF_API_KEY = os.environ.get("HF_API_KEY")

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

def analyze_resume(text, job_role):
    text = text[:2000]

    prompt = f"""
Analyze the following resume for the role of {job_role}.
Give a short professional analysis and improvement suggestions.

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

    return {
        "ats_score": 70,
        "hiring_chance_percent": 65,
        "matched_skills": [],
        "missing_skills": [],
        "improvement_areas": ["Improve formatting", "Add measurable achievements"],
        "resume_strengths": ["Relevant experience"],
        "final_verdict": data[0]["summary_text"]
    }
