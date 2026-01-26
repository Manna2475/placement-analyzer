async function analyze() {
  // ===== SAFE ELEMENT REFERENCES =====
  const fileInput = document.getElementById("resume");
  const jobRoleInput = document.getElementById("jobRole"); // may or may not exist
  const output = document.getElementById("output");

  const atsScoreEl = document.getElementById("atsScore");
  const hiringChanceEl = document.getElementById("hiringChance");
  const finalVerdictEl = document.getElementById("finalVerdict");

  // ===== VALIDATION =====
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert("Please upload a resume file.");
    return;
  }

  // If jobRole input does not exist, use default
  const jobRole = jobRoleInput && jobRoleInput.value
    ? jobRoleInput.value
    : "Software Engineer";

  // Show result container safely
  if (output) output.classList.remove("hidden");

  // Loading state
  if (finalVerdictEl) {
    finalVerdictEl.innerText =
      "🧠 AI is analyzing your resume… Please wait (first run may take some time)";
  }

  // ===== FORM DATA =====
  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("jobRole", jobRole);

  // ===== API CALL =====
  try {
    const response = await fetch(
      "https://placement-analyzer-backend.onrender.com/analyze",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!data.success) {
      if (finalVerdictEl) finalVerdictEl.innerText = data.error || "Analysis failed.";
      return;
    }

    const r = data.result;

    // ===== SCORE RENDERING =====
    if (atsScoreEl) atsScoreEl.innerText = `${r.ats_score}/100`;
    if (hiringChanceEl) hiringChanceEl.innerText = `${r.hiring_chance_percent}%`;

    // ===== LIST SECTIONS =====
    fillList("matchedSkills", r.matched_skills);
    fillList("missingSkills", r.missing_skills);
    fillList("improvements", r.improvement_areas);
    fillList("strengths", r.resume_strengths);

    // ===== FINAL VERDICT =====
    if (finalVerdictEl) finalVerdictEl.innerText = r.final_verdict;

  } catch (error) {
    console.error("Frontend Error:", error);
    if (finalVerdictEl) {
      finalVerdictEl.innerText =
        "❌ Unable to connect to the server. Please try again.";
    }
  }
}

// ===== SAFE LIST RENDER FUNCTION =====
function fillList(id, items) {
  const ul = document.getElementById(id);
  if (!ul) return;

  ul.innerHTML = "";

  if (!items || items.length === 0) {
    ul.innerHTML = "<li>Not specified</li>";
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    ul.appendChild(li);
  });
}

// ===== PDF DOWNLOAD =====
function downloadPDF() {
  const output = document.getElementById("output");
  if (!output) return;

  const options = {
    margin: 0.5,
    filename: "AI_Resume_Analysis.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  html2pdf().set(options).from(output).save();
}
