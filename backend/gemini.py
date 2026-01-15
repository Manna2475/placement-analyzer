import google.generativeai as genai
import os

# Configure Gemini using environment variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use supported model
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_resume(text):
    prompt = f"""
    Analyze this resume for placements:
    1. Extract skills
    2. Identify suitable job roles
    3. Give improvement tips
    4. Give placement readiness score (0-100)

    Resume:
    {text}
    """
    response = model.generate_content(prompt)
    return response.text
