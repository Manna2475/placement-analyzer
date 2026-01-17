from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_parser import extract_text
from gemini import analyze_resume

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend is running"})

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "resume" not in request.files:
            return jsonify({"success": False, "error": "No resume file uploaded"}), 400

        file = request.files["resume"]
        text = extract_text(file)

        if not text:
            return jsonify({"success": False, "error": "Could not extract text from PDF"}), 400

        analysis = analyze_resume(text)

        return jsonify({
            "success": True,
            "result": analysis
        })

    except Exception as e:
        print("BACKEND ERROR:", str(e))
        return jsonify({
            "success": False,
            "error": "AI analysis failed"
        }), 500


if __name__ == "__main__":
    app.run()
