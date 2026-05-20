# WC EditorPro Suite

WC EditorPro Suite es un editor de texto multilingüe diseñado para soportar varias características modernas como colaboración en tiempo real, exportación en múltiples formatos y soporte para idiomas regionales como Bribri y Cabécar.

## Características

- **Colaboración en tiempo real**: Edición compartida a través de WebSockets.
- **Exportación**: Convierte documentos a PDF, DOCX, y HTML.
- **Revisión ortográfica**: Resaltado de errores basado en diccionarios dinámicos.
- **Idiomas soportados**:
  - Español (Costa Rica)
  - Bribri
  - Cabécar
  - Inglés

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/kacn1z-del/Wc-editorpro.git
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Ejecuta el servidor:
   ```bash
   node server.js
   ```

4. Abre el archivo `index.html` en tu navegador.

## Dependencias

- [Quill.js](https://quilljs.com/)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
- [pdfmake](http://pdfmake.org/)
- [docx](https://github.com/dolanmiu/docx/)

## Contribuciones
Si deseas contribuir al proyecto, envía un pull request con tus cambios o mejoras.

---
© 2026 WC EditorPro.