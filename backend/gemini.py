import google.generativeai as genai
import os

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")

def analyze_resume(text):
    # Limit input to avoid Gemini failures
    text = text[:3000]

    prompt = f"""
    Analyze this resume for placements:

    1. Skills
    2. Suitable job roles
    3. Improvement tips
    4. Placement readiness score (0-100)

    Resume:
    {text}
    """

    response = model.generate_content(prompt)
    return response.text
