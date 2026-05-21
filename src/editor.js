/* =========================
   EDITOR CORE
========================= */
const editor = document.getElementById("editor");

function execCmd(cmd, value = null) {
  document.execCommand(cmd, false, value);
  editor.focus();
}

/* =========================
   TABS
========================= */
function changeTab(btn) {
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

/* =========================
   INSERTS
========================= */
function insertTable() {
  editor.innerHTML += `
    <table border="1" style="width:100%;border-collapse:collapse">
      <tr><td>Col 1</td><td>Col 2</td></tr>
    </table>`;
}

function insertImage() {
  const url = prompt("URL de imagen:");
  if (url) {
    editor.innerHTML += `<img src="${url}" style="max-width:100%">`;
  }
}

/* =========================
   IA SIMPLE (placeholder)
========================= */
function askAI() {
  const input = document.getElementById("aiInput").value;
  const out = document.getElementById("aiOut");

  out.innerHTML = "Pensando...";

  setTimeout(() => {
    out.innerHTML = "🤖 Respuesta simulada: " + input;
  }, 1000);
}
