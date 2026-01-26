import requests
import os

HF_API_KEY = os.environ.get("HF_API_KEY")

API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "application/json"
}

KEY_SKILLS = [
    "python", "java", "sql", "javascript",
    "react", "node", "machine learning",
    "data analysis", "flask", "django"
]

def calculate_ats(text):
    text_lower = text.lower()
    matched = [s for s in KEY_SKILLS if s in text_lower]
    missing = [s for s in KEY_SKILLS if s not in text_lower]
    score = min(100, int((len(matched) / len(KEY_SKILLS)) * 100))
    return score, matched, missing

def analyze_resume(text, job_role):
    text = text[:1800]

    response = requests.post(
        API_URL,
        headers=headers,
        json={"inputs": text},
        timeout=60
    )

    if response.status_code != 200:
        raise RuntimeError("HuggingFace API failed")

    summary = response.json()[0]["summary_text"]

    ats_score, matched, missing = calculate_ats(text)

    return {
        "ats_score": ats_score,
        "hiring_chance_percent": max(40, ats_score - 5),
        "matched_skills": matched,
        "missing_skills": missing,
        "improvement_areas": [
            "Add quantified achievements",
            "Include role-specific keywords",
            "Improve resume formatting"
        ],
        "resume_strengths": [
            "Relevant technical background",
            "Good academic foundation"
        ],
        "final_verdict": summary
    }
