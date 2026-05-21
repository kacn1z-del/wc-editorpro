#!/bin/bash

# 🚀 Script de inicialización para WC EditorPro Suite

# 1. Crear carpetas
mkdir -p public/assets src docs config

# 2. Crear archivos mínimos
echo "/* estilos corporativos */" > public/estilo-corporativo.css

cat > src/editor.js <<'EOF'
// funciones editor
const editor = document.getElementById("editor");

function execCmd(cmd, value = null) {
  document.execCommand(cmd, false, value);
  editor.focus();
}

function changeTab(btn) {
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function insertTable() {
  editor.innerHTML += "<table border='1'><tr><td>Col 1</td><td>Col 2</td></tr></table>";
}

function insertImage() {
  const url = prompt("URL de imagen:");
  if (url) editor.innerHTML += `<img src="${url}" style="max-width:100%">`;
}

function askAI() {
  const input = document.getElementById("aiInput").value;
  const out = document.getElementById("aiOut");
  out.innerHTML = "Pensando...";
  setTimeout(() => { out.innerHTML = "🤖 Respuesta simulada: " + input; }, 1000);
}
EOF

cat > src/export.js <<'EOF'
// exportación PDF/DOCX
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const content = editor.innerText || "Documento vacío";
  doc.text(content, 10, 10);
  doc.save("documento.pdf");
}

function exportDOCX() {
  const content = editor.innerText || "Documento vacío";
  const doc = new window.docx.Document({
    sections: [{ children: [ new window.docx.Paragraph(content) ] }]
  });
  window.docx.Packer.toBlob(doc).then(blob => { saveAs(blob, "documento.docx"); });
}
EOF

echo "// multilingüe" > src/i18n.js
echo "// colaboración" > src/collaboration.js

echo "# WC EditorPro Suite" > docs/README.md
echo "# Manual corporativo" > docs/MANUAL_CORPORATIVO.md
echo "# Packaging Guide" > docs/PACKAGING_GUIDE.md
echo "# Build Android/iOS" > docs/BUILD_FOR_ANDROID_IOS.md

cat > config/github-actions.yml <<'EOF'
name: Deploy to GitHub Pages
on:
  push:
    branches: [ "main" ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Build and Deploy
        run: echo "No build step, deploying static files"
      - name: Deploy to Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
EOF

# 3. Git add + commit + push
git add .
git commit -m "Inicialización de repo con estructura modular"
git pull origin main --rebase
git push origin main
