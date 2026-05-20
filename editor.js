const quill = new Quill('#editor', { modules: { toolbar: '#toolbar' }, theme: 'snow' });
const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.type === 'text-change') quill.updateContents(data.delta);
  if (data.type === 'spell-check-result') highlightErrors(data.errores);
};

quill.on('text-change', function(delta, oldDelta, source) {
  if (source === 'user') {
    socket.send(JSON.stringify({ type: 'text-change', delta }));
    updateWordCount();
  }
});

function updateWordCount() {
  const words = quill.getText().trim().split(/\s+/).filter(w => w.length > 0);
  document.getElementById("wordCount").textContent = words.length;
}

function exportPDF() {
  const docDefinition = { content: quill.getText() };
  pdfMake.createPdf(docDefinition).download("documento.pdf");
}

async function exportDocx() {
  const { Document, Packer, Paragraph } = window.docx;
  const doc = new Document({
    sections: [{ properties: {}, children: [new Paragraph(quill.getText())] }]
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, "documento.docx");
}

function exportHTML() {
  const htmlContent = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Documento WC EditorPro Suite</title>
<link rel="stylesheet" href="estilo-corporativo.css"></head>
<body>
<header><img src="tu_logo.jpeg" style="height:60px;"><h1>WC EditorPro Suite</h1></header>
${quill.root.innerHTML}
</body></html>`;
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  saveAs(blob, "documento.html");
}

function guardarServidor() {
  fetch("http://localhost:3000/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenido: quill.root.innerHTML })
  }).then(r => alert("Documento guardado en servidor."));
}

function checkSpelling() {
  socket.send(JSON.stringify({
    type: 'spell-check',
    text: quill.getText(),
    lang: document.getElementById("languageSelector").value
  }));
}

function highlightErrors(errores) {
  const text = quill.getText();
  errores.forEach(error => {
    let index = text.toLowerCase().indexOf(error.toLowerCase());
    while (index !== -1) {
      quill.formatText(index, error.length, { color: 'red', underline: true });
      index = text.toLowerCase().indexOf(error.toLowerCase(), index + error.length);
    }
  });
}

function runMacro() {
  quill.format('font', 'Calibri');
  quill.format('size', 'medium');
  quill.format('align', 'justify');
}
function undoChange() { quill.history.undo(); }
function redoChange() { quill.history.redo(); }
function changeLanguage(lang) { alert("Idioma cambiado a: " + lang); }