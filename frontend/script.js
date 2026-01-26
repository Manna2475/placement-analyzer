async function analyze() {
  const fileInput = document.getElementById("resume");
  const jobRole = document.getElementById("jobRole").value || "Software Engineer";
  const output = document.getElementById("output");

  if (!fileInput.files.length) {
    alert("Please upload a resume PDF");
    return;
  }

  output.classList.remove("hidden");
  document.getElementById("finalVerdict").innerText =
    "🧠 Analyzing resume… please wait";

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("jobRole", jobRole);

  try {
    const res = await fetch(
      "https://placement-analyzer-backend.onrender.com/analyze",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!data.success) {
      document.getElementById("finalVerdict").innerText = data.error;
      return;
    }

    const r = data.result;

    document.getElementById("atsScore").innerText = r.ats_score;
    document.getElementById("hiringChance").innerText =
      r.hiring_chance_percent + "%";

    fillList("matchedSkills", r.matched_skills);
    fillList("missingSkills", r.missing_skills);
    fillList("improvements", r.improvement_areas);
    fillList("strengths", r.resume_strengths);

    document.getElementById("finalVerdict").innerText = r.final_verdict;

  } catch (e) {
    document.getElementById("finalVerdict").innerText =
      "❌ Server error. Please try again.";
  }
}

function fillList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  if (!items || items.length === 0) {
    ul.innerHTML = "<li>Not specified</li>";
    return;
  }
  items.forEach(i => {
    const li = document.createElement("li");
    li.innerText = i;
    ul.appendChild(li);
  });
}

function downloadPDF() {
  html2pdf().from(document.getElementById("output")).save("AI_Resume_Report.pdf");
}
