let quill = new Quill('#editor', { modules: { toolbar: '#toolbar' }, theme: 'snow', placeholder: 'Escriba su texto aquí...' });

// Historial local
let historyStack = [];
let historyIndex = -1;

function pushHistory() {
  let snapshot = quill.getContents();
  historyStack = historyStack.slice(0, historyIndex + 1);
  historyStack.push(snapshot);
  historyIndex++;
  logChange('Cambio registrado');
}

quill.on('text-change', function(delta, oldDelta, source) {
  if (source === 'user') {
    pushHistory();
    updateWordCount();
  }
});

function updateWordCount() {
  const text = quill.getText().trim();
  const words = text.length > 0 ? text.split(/\s+/).filter(w => w.length > 0) : [];
  document.getElementById('wordCount').textContent = words.length;
}

function undoChange() {
  if (historyIndex > 0) {
    historyIndex--;
    quill.setContents(historyStack[historyIndex]);
    logChange('Deshacer');
  }
}

function redoChange() {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    quill.setContents(historyStack[historyIndex]);
    logChange('Rehacer');
  }
}

function logChange(msg) {
  const el = document.getElementById('changeLog');
  const time = new Date().toLocaleTimeString();
  el.innerHTML = `<div>[${time}] ${msg}</div>` + el.innerHTML;
}

// Diccionarios locales
const diccionarios = {
  'es-CR': ['este', 'es', 'un', 'ejemplo', 'correcto', 'texto', 'palabras', 'editor', 'resalta', 'hola', 'mundo', 'costa', 'rica'],
  'bribri': ['ñöme', 'bitó', 'brö', 'sitri', 'wak'],
  'cabecar': ['kè', 'tö', 'brö', 'së', 'wak'],
  'en': ['this', 'is', 'a', 'correct', 'example', 'text', 'hello', 'world']
};

function checkSpelling() {
  const text = quill.getText();
  const lang = document.getElementById('languageSelector').value;
  const diccionario = diccionarios[lang] || []; // Corrección aplicada
  const palabras = text.toLowerCase().split(/\s+/).filter(p => p.length > 0);
  const errores = palabras.filter(p => !diccionario.includes(p) && p.match(/[a-zñáéíóúü]/i));

  quill.removeFormat(0, quill.getLength());

  errores.forEach(error => {
    let startIndex = 0;
    let idx = text.toLowerCase().indexOf(error.toLowerCase(), startIndex);
    while (idx !== -1) {
      quill.formatText(idx, error.length, { color: 'red', underline: true });
      startIndex = idx + error.length;
      idx = text.toLowerCase().indexOf(error.toLowerCase(), startIndex);
    }
  });
  logChange('Revisión ortográfica: ' + errores.length + ' posibles errores');
}

function exportPDF() {
  const docDefinition = { content: quill.getText() };
  pdfMake.createPdf(docDefinition).download('documento.pdf');
  logChange('PDF exportado');
}

async function exportDocx() {
  const { Document, Packer, Paragraph } = window.docx;
  const doc = new Document({ sections: [{ children: [new Paragraph(quill.getText())] }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'documento.docx');
  logChange('DOCX exportado');
}

function exportHTML() {
  const htmlContent = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Documento WC EditorPro Suite</title></head><body><h1>WC EditorPro Suite</h1>${quill.root.innerHTML}</body></html>`; // Corrección aplicada
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, 'documento.html');
  logChange('HTML exportado');
}

async function guardarLocal() {
  const htmlContent = quill.root.innerHTML;
  const filename = 'documento_' + Date.now() + '.html';
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, filename);
  logChange('Documento descargado: ' + filename);
}

function runMacro() {
  quill.format('font', 'serif');
  quill.format('size', 'large');
  quill.format('align', 'justify');
  logChange('Macro: formato automático aplicado');
}

function changeLanguage(lang) {
  logChange('Idioma cambiado a: ' + lang);
}

// Inicializar
pushHistory();
updateWordCount();