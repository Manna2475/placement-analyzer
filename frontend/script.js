async function analyze() {
  const fileInput = document.getElementById("resume");
  const output = document.getElementById("output");
  const jobRoleInput = document.getElementById("jobRole");

  if (!fileInput.files.length) {
    output.innerText = "Please upload a resume PDF first.";
    return;
  }

  output.innerText = "Analyzing resume... Please wait ⏳";

  // ✅ FIX 1: Create FormData
  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("jobRole", jobRoleInput.value || "Software Engineer");

  try {
    // ✅ FIX 2: Fetch FIRST
    const res = await fetch(
      "https://placement-analyzer-backend.onrender.com/analyze",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json(); // ✅ data defined HERE

    if (!data.success) {
      output.innerText = data.error || "Analysis failed.";
      return;
    }

    const r = data.result; // ✅ SAFE to use now

    output.innerText = `
ATS Score: ${r.ats_score}/100
Hiring Chance: ${r.hiring_chance_percent}%

Matched Skills:
- ${r.matched_skills.join("\n- ")}

Missing / Weak Skills:
- ${r.missing_skills.join("\n- ")}

Areas to Improve:
- ${r.improvement_areas.join("\n- ")}

Strengths:
- ${r.resume_strengths.join("\n- ")}

Final Verdict:
${r.final_verdict}
`;

  } catch (error) {
    console.error(error);
    output.innerText = "❌ Error connecting to backend.";
  }
}
