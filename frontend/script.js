async function analyze() {
  const fileInput = document.getElementById("resume");
  const jobRoleInput = document.getElementById("jobRole");
  const output = document.getElementById("output");

  const atsScoreEl = document.getElementById("atsScore");
  const hiringChanceEl = document.getElementById("hiringChance");
  const atsBar = document.getElementById("atsBar");
  const hiringBar = document.getElementById("hiringBar");

  const finalVerdictEl = document.getElementById("finalVerdict");

  if (!fileInput || !fileInput.files.length) {
    alert("Please upload a resume PDF.");
    return;
  }

  // Show result container
  if (output) output.classList.remove("hidden");

  // Safe loading message
  if (finalVerdictEl) {
    finalVerdictEl.innerText =
      "🧠 AI is analyzing your resume... Please wait (first run may take 10–15 seconds)";
  }

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("jobRole", jobRoleInput?.value || "Software Engineer");

  try {
    const res = await fetch(
      "https://placement-analyzer-backend.onrender.com/analyze",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (!data.success) {
      if (finalVerdictEl) finalVerdictEl.innerText = data.error;
      return;
    }

    const r = data.result;

    // Scores
    if (atsScoreEl) atsScoreEl.innerText = `${r.ats_score}/100`;
    if (hiringChanceEl) hiringChanceEl.innerText = `${r.hiring_chance_percent}%`;

    if (atsBar) atsBar.style.width = `${r.ats_score}%`;
    if (hiringBar) hiringBar.style.width = `${r.hiring_chance_percent}%`;

    // Lists
    fillList("matchedSkills", r.matched_skills);
    fillList("missingSkills", r.missing_skills);
    fillList("improvements", r.improvement_areas);
    fillList("strengths", r.resume_strengths);

    // Final verdict
    if (finalVerdictEl) finalVerdictEl.innerText = r.final_verdict;

  } catch (error) {
    console.error(error);
    if (finalVerdictEl) {
      finalVerdictEl.innerText =
        "❌ Error connecting to backend. Please try again.";
    }
  }
}

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

function downloadPDF() {
  const element = document.getElementById("output");
  if (!element) return;

  const options = {
    margin: 0.5,
    filename: "AI_Resume_Analysis.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  html2pdf().set(options).from(element).save();
}
