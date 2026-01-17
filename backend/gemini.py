import google.generativeai as genai
import os

API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-pro")

def analyze_resume(text):
    text = text[:2500]  # VERY IMPORTANT: input limit

    prompt = f"""
    Analyze the following resume and return:

    1. Key skills
    2. Suitable job roles
    3. Improvement suggestions
    4. Placement readiness score (0-100)

    Resume:
    {text}
    """

    response = model.generate_content(prompt)

    if not response or not response.text:
        raise RuntimeError("Empty response from Gemini")

    return response.text
