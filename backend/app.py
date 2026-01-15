from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_parser import extract_text
from gemini import analyze_resume

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files["resume"]
    text = extract_text(file)
    analysis = analyze_resume(text)
    return jsonify({"result": analysis})

if __name__ == "__main__":
    app.run()
