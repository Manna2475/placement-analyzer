from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )

    return response.text
