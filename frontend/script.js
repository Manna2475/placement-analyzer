async function analyze() {
  const fileInput = document.getElementById("resume");
  const jobRoleInput = document.getElementById("jobRole");
  const output = document.getElementById("output");

  if (!fileInput.files.length) {
    alert("Please upload a resume PDF.");
    return;
  }

  output.classList.remove("hidden");
  document.getElementById("finalVerdict").innerText =
    "🧠 AI is analyzing your resume... Please wait";

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("jobRole", jobRoleInput.value || "Software Engineer");

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
      document.getElementById("finalVerdict").innerText = data.error;
      return;
    }

    const r = data.result;

    document.getElementById("atsScore").innerText = `${r.ats_score}/100`;
    document.getElementById("hiringChance").innerText = `${r.hiring_chance_percent}%`;

    document.getElementById("atsBar").style.width = `${r.ats_score}%`;
    document.getElementById("hiringBar").style.width = `${r.hiring_chance_percent}%`;

    fillList("matchedSkills", r.matched_skills);
    fillList("missingSkills", r.missing_skills);
    fillList("improvements", r.improvement_areas);
    fillList("strengths", r.resume_strengths);

    document.getElementById("finalVerdict").innerText = r.final_verdict;

  } catch (err) {
    console.error(err);
    document.getElementById("finalVerdict").innerText =
      "❌ Error connecting to backend.";
  }
}

function fillList(id, items) {
  const ul = document.getElementById(id);
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

  const opt = {
    margin: 0.5,
    filename: 'AI_Resume_Analysis.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}
