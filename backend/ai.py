import requests
import os
import json

HF_API_KEY = os.environ.get("HF_API_KEY")

API_URL = "https://router.huggingface.co/hf-inference/models/google/flan-t5-large"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "application/json"
}

def analyze_resume(text, job_role):
    text = text[:2500]

    prompt = f"""
You are an ATS system and a senior technical recruiter.

Target Job Role: {job_role}

Analyze the resume and return the result STRICTLY in JSON format with the following keys:

- ats_score (number 0-100)
- hiring_chance_percent (number 0-100)
- matched_skills (list)
- missing_skills (list)
- improvement_areas (list)
- resume_strengths (list)
- final_verdict (short paragraph)

Evaluation criteria:
- Skill match with job role
- Project relevance
- Technical depth
- Resume clarity
- Industry readiness

Resume:
{text}

Return ONLY valid JSON. No explanation. No markdown.
"""

    response = requests.post(
        API_URL,
        headers=headers,
        json={"inputs": prompt},
        timeout=60
    )

    if response.status_code != 200:
        raise RuntimeError(response.text)

    raw = response.json()

    # flan-t5 returns generated_text
    if isinstance(raw, list) and "generated_text" in raw[0]:
        output_text = raw[0]["generated_text"]
    else:
        raise RuntimeError("Unexpected AI response")

    # Parse JSON safely
    try:
        parsed = json.loads(output_text)
        return parsed
    except Exception:
        # fallback if model slightly breaks JSON
        return {
            "ats_score": "N/A",
            "hiring_chance_percent": "N/A",
            "matched_skills": [],
            "missing_skills": [],
            "improvement_areas": ["Improve resume formatting and add measurable impact"],
            "resume_strengths": [],
            "final_verdict": output_text
        }
