async function analyze() {
  const fileInput = document.getElementById("resume");
  const output = document.getElementById("output");

  // Safety check
  if (!fileInput.files.length) {
    output.innerText = "Please upload a resume PDF first.";
    return;
  }

  output.innerText = "Analyzing resume... Please wait ⏳";

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);

  try {
    const res = await fetch(
      "https://placement-analyzer-backend.onrender.com/analyze",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();
    output.innerText = data.result;

  } catch (error) {
    console.error(error);
    output.innerText = "Error connecting to backend.";
  }
}
