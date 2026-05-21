function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const content = editor.innerText;
  doc.text(content, 10, 10);
  doc.save("documento.pdf");
}

function exportDOCX() {
  const content = editor.innerText;
  const doc = new window.docx.Document({
    sections: [{
      children: [ new window.docx.Paragraph(content) ]
    }]
  });
  window.docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, "documento.docx");
  });
}
