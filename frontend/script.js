async function analyze() {
  const file = document.getElementById("resume").files[0];
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch("YOUR_BACKEND_LINK/analyze", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  document.getElementById("output").innerText = data.result;
}
