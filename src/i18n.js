const translations = {
  es: "Escribe aquí tu documento...",
  en: "Write your document here...",
  bribri: "Tsa̱ ñi̱ ña̱...",
  cabecar: "Tsa̱ ñi̱ ña̱..."
};

function changeLanguage(lang) {
  editor.innerHTML = translations[lang] || translations["es"];
}
