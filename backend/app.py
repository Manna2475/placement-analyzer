from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_parser import extract_text
from ai import analyze_resume

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend is running"})


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        # 1. Check file
        if "resume" not in request.files:
            return jsonify({
                "success": False,
                "error": "No resume uploaded"
            }), 400

        # 2. Extract text from PDF
        resume_file = request.files["resume"]
        text = extract_text(resume_file)

        if not text:
            return jsonify({
                "success": False,
                "error": "PDF text extraction failed"
            }), 400

        # 3. Get job role (optional, dynamic)
        job_role = request.form.get("jobRole", "Software Engineer")

        # 4. AI analysis
        result = analyze_resume(text, job_role)

        # 5. Success response
        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:
        print("BACKEND ERROR:", e)
        return jsonify({
            "success": False,
            "error": "AI analysis failed"
        }), 500


if __name__ == "__main__":
    app.run()
