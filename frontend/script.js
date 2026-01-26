async function analyze() {
  const fileInput = document.getElementById("resume");
  const jobRoleInput = document.getElementById("jobRole");
  const status = document.getElementById("status");
  const output = document.getElementById("output");

  if (!fileInput.files.length) {
    alert("Please upload a resume");
    return;
  }

  status.innerText = "⏳ Analyzing resume…";
  output.classList.add("hidden");

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append(
    "jobRole",
    jobRoleInput && jobRoleInput.value ? jobRoleInput.value : "Software Engineer"
  );

  const res = await fetch(
    "https://placement-analyzer-backend.onrender.com/analyze",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await res.json();

  if (!data.success) {
    status.innerText = "❌ Analysis failed";
    return;
  }

  // ===== ATS =====
  const score = data.result.ats_score;
  document.getElementById("atsScore").innerText = `${score}%`;
  document.getElementById("atsProgress").style.width = `${score}%`;

  const atsStatus = document.getElementById("atsStatus");
  if (score >= 80) {
    atsStatus.innerText = "Excellent";
    atsStatus.className = "status-text good";
  } else if (score >= 60) {
    atsStatus.innerText = "Good";
    atsStatus.className = "status-text avg";
  } else {
    atsStatus.innerText = "Needs Work";
    atsStatus.className = "status-text bad";
  }

  // ===== MATCHES (from backend OR mock) =====
  const matches = data.result.matches || mockMatches();
  renderMatches(matches);

  status.innerText = "✅ Analysis completed";
  output.classList.remove("hidden");
}

// ===== DYNAMIC MATCH CARDS =====
function renderMatches(matches) {
  const container = document.getElementById("matchesContainer");
  container.innerHTML = "";

  matches.forEach((m, i) => {
    const fitClass =
      m.fitScore >= 80 ? "good" : m.fitScore >= 60 ? "avg" : "bad";

    const card = document.createElement("div");
    card.className = "match-card";

    card.innerHTML = `
      <div class="match-header">
        <h4>#${i + 1} ${m.company}</h4>
        <span class="fit ${fitClass}">
          ${m.fitScore}/100 • ${m.fitLabel}
        </span>
      </div>

      <p class="muted">${m.role}</p>

      <div class="section">
        <h5>Strengths</h5>
        <ul>${m.strengths.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>

      <div class="section">
        <h5>Areas to Develop</h5>
        <ul>${m.improvements.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>

      <div class="section">
        <h5>AI Summary</h5>
        <p class="ai-summary">${cleanText(m.summary)}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// ===== CLEAN AI TEXT =====
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// ===== FALLBACK MOCK DATA =====
function mockMatches() {
  return [
    {
      company: "Google",
      role: "Software Engineer I",
      fitScore: 68,
      fitLabel: "Good Match",
      strengths: [
        "Strong DSA foundation",
        "Java proficiency with certification"
      ],
      improvements: [
        "Distributed systems experience missing",
        "Python usage not clearly highlighted"
      ],
      summary:
        "Strong fundamentals and backend exposure, but lacks distributed systems experience."
    },
    {
      company: "Pinterest",
      role: "Full Stack Engineer",
      fitScore: 93,
      fitLabel: "Excellent Match",
      strengths: [
        "Extensive MERN stack experience",
        "Strong database management skills"
      ],
      improvements: [
        "No explicit cloud platform experience",
        "Testing frameworks not mentioned"
      ],
      summary:
        "Excellent full-stack profile with minor gaps in cloud and testing."
    }
  ];
}
