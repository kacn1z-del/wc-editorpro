/* ============================================================
   WC Corporate Editor v25 — PATCH
   Conecta todos los botones de los menús nuevos:
   📝 Revisión | 🎨 Diseño | ⚡ Productividad | 🦙 Sibö IA | 🇨🇷 CR Legal
   Por Keny Chinchilla Navarro
   ============================================================ */

(function() {
  var _orig = window.handleAction;
  window.handleAction = function(a) {
    switch(a) {

      /* ── 📝 REVISIÓN ── */
      case 'tocPanel':
        var heads = document.getElementById('editor').querySelectorAll('h1,h2,h3,h4');
        if (!heads.length) { showToast('No hay títulos en el documento'); break; }
        var toc = '<div style="border:1px solid #ddd;border-radius:10px;padding:16px;margin:12px 0;background:#f8f9fa"><h3 style="color:#0084ff;margin-bottom:10px">📑 Tabla de contenidos</h3>';
        heads.forEach(function(h, i) {
          var level = parseInt(h.tagName[1]);
          var pad = (level - 1) * 16;
          toc += '<div style="padding:4px 0 4px '+pad+'px;font-size:'+(15-level)+'px;color:#333;border-bottom:1px dotted #ddd">'+h.innerText+'</div>';
        });
        toc += '</div>';
        insertHTML(toc);
        showToast('Tabla de contenidos insertada ✅');
        break;

      case 'bookmarks':
        var bm = prompt('Nombre del marcador:');
        if (bm) {
          insertHTML('<span id="bm-'+bm.replace(/\s/g,'-')+'" style="background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:1px 8px;font-size:12px">📌 '+bm+'</span>');
          showToast('Marcador "'+bm+'" creado ✅');
        }
        break;

      case 'pageNumbers':
        abrirConfigEncabezado('pagenum');
        break;

      case 'headerFooter':
        abrirConfigEncabezado('header');
        break;

      case 'comments':
        var c = prompt('Comentario:');
        if (c) {
          insertHTML('<span style="background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:1px 6px;font-size:12px;cursor:help" title="'+c+'">💬 '+c+'</span>');
          showToast('Comentario agregado ✅');
        }
        break;

      case 'footnotes':
        var fn = prompt('Nota al pie:');
        if (fn) insertHTML('<hr style="border:none;border-top:1px solid #ddd;margin:20px 0 4px"><p style="font-size:11px;color:#666">¹ '+fn+'</p>');
        showToast('Nota al pie agregada ✅');
        break;

      case 'spellCheck':
        document.getElementById('editor').spellcheck = true;
        showToast('Corrector ortográfico activado ✅');
        break;

      case 'autocomplete':
        showToast('Autocompletar: escribe 3+ letras y el navegador sugerirá ✅');
        break;

      case 'versionHistory':
        var saved = localStorage.getItem('wc-v23');
        if (saved) {
          openDocWindow(saved, 'Versión guardada');
          showToast('Versión anterior abierta ✅');
        } else {
          showToast('No hay versión guardada aún');
        }
        break;

      case 'compareVersions':
        showToast('Guarda con Archivo → Guardar para comparar versiones');
        break;

      case 'textToSpeech':
        var txt = window.getSelection().toString() || document.getElementById('editor').innerText.substring(0, 500);
        if (!txt.trim()) { showToast('Selecciona texto primero'); break; }
        var utt = new SpeechSynthesisUtterance(txt);
        utt.lang = 'es-CR';
        window.speechSynthesis.speak(utt);
        showToast('Leyendo texto... 🔊');
        break;

      /* ── 🎨 DISEÑO ── */
      case 'wordView':
        var ed = document.getElementById('editor');
        ed.style.maxWidth = '21.59cm';
        ed.style.margin = '24px auto';
        ed.style.padding = '2.54cm';
        ed.style.background = '#fff';
        ed.style.boxShadow = '0 1px 3px rgba(0,0,0,0.13),0 6px 24px rgba(0,0,0,0.10)';
        showToast('Vista estilo Word ✅');
        break;

      case 'ruler':
        var r = document.getElementById('ruler');
        r.style.display = r.style.display === 'none' ? 'block' : 'none';
        showToast('Regla ' + (r.style.display === 'none' ? 'oculta' : 'visible'));
        break;

      case 'columnsMode':
        insertHTML('<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:14px 0"><div style="border:1px dashed #ccc;padding:12px;border-radius:8px;min-height:100px">Columna 1...</div><div style="border:1px dashed #ccc;padding:12px;border-radius:8px;min-height:100px">Columna 2...</div></div><p></p>');
        showToast('Modo columnas activado ✅');
        break;

      case 'printPreview':
        window.print();
        break;

      case 'stylesPanel':
        var estilos = [
          {n:'Profesional',css:'font-family:Arial,sans-serif;font-size:14px;line-height:1.15;color:#1a1a1a'},
          {n:'Académico',css:"font-family:'Times New Roman',serif;font-size:14px;line-height:2;color:#000"},
          {n:'Creativo',css:'font-family:Georgia,serif;font-size:15px;line-height:1.5;color:#2c3e50'},
          {n:'Ejecutivo',css:"font-family:'Calibri',sans-serif;font-size:13px;line-height:1.3;color:#1a2942"},
          {n:'Moderno',css:'font-family:Verdana,sans-serif;font-size:13px;line-height:1.6;color:#333'}
        ];
        var html = '<div style="border:1px solid #ddd;border-radius:12px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#0084ff;margin-bottom:10px">🎨 Estilos rápidos</h4>';
        estilos.forEach(function(e) {
          html += '<button onclick="document.getElementById(\'editor\').style.cssText+=\''+e.css+'\';showToast(\'Estilo '+e.n+' ✅\')" style="display:block;width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:13px">'+e.n+'</button>';
        });
        html += '</div>';
        insertHTML(html);
        showToast('Estilos rápidos insertados ✅');
        break;

      case 'docTheme':
        var temas = [
          {n:'🔵 Corporativo',h:'#003da5',a:'#0084ff'},
          {n:'🟢 Natural',h:'#27ae60',a:'#2ecc71'},
          {n:'🔴 Institucional',h:'#ce1126',a:'#e74c3c'},
          {n:'🟣 Creativo',h:'#6c5ce7',a:'#9b59b6'},
          {n:'⭐ Dorado',h:'#f39c12',a:'#ffd700'}
        ];
        var selTema = prompt('Tema (1-5):\n1. Corporativo\n2. Natural\n3. Institucional\n4. Creativo\n5. Dorado', '1');
        var t = temas[(parseInt(selTema)||1)-1] || temas[0];
        document.getElementById('editor').querySelectorAll('h1,h2,h3').forEach(function(h){ h.style.color = t.h; });
        document.getElementById('editor').querySelectorAll('a').forEach(function(a){ a.style.color = t.a; });
        showToast('Tema '+t.n+' aplicado ✅');
        break;

      case 'pageBG':
        openModal('modalBackground');
        break;

      case 'shapesPanel':
        openModal('modalShapes');
        break;

      case 'tableGen':
        var rows = parseInt(prompt('Número de filas:', '3')) || 3;
        var cols = parseInt(prompt('Número de columnas:', '3')) || 3;
        var tbl = '<table style="border-collapse:collapse;width:100%;margin:8px 0">';
        var headerRow = '<tr>';
        for (var c2=0; c2<cols; c2++) headerRow += '<th style="border:1px solid #ddd;padding:10px;background:#0084ff;color:#fff;font-size:13px">Col '+(c2+1)+'</th>';
        headerRow += '</tr>'; tbl += headerRow;
        for (var r2=0; r2<rows; r2++) {
          tbl += '<tr>';
          for (var c3=0; c3<cols; c3++) tbl += '<td style="border:1px solid #ddd;padding:8px;font-size:13px"></td>';
          tbl += '</tr>';
        }
        tbl += '</table><p></p>';
        insertHTML(tbl);
        showToast('Tabla '+rows+'×'+cols+' creada ✅');
        break;

      case 'orgChart':
        insertHTML('<div style="text-align:center;padding:16px;margin:10px 0;border:1px solid #ddd;border-radius:10px"><div style="display:inline-block;background:#0084ff;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;margin-bottom:16px">Director General</div><div style="display:flex;justify-content:center;gap:16px"><div style="background:#e3f2fd;border:1px solid #0084ff;padding:8px 16px;border-radius:8px;font-size:13px">Dept. A</div><div style="background:#e3f2fd;border:1px solid #0084ff;padding:8px 16px;border-radius:8px;font-size:13px">Dept. B</div><div style="background:#e3f2fd;border:1px solid #0084ff;padding:8px 16px;border-radius:8px;font-size:13px">Dept. C</div></div></div><p></p>');
        showToast('Organigrama insertado ✅');
        break;

      case 'signatureCanvas':
        openAnnotation();
        break;

      case 'qrGenerator':
        var qrUrl = prompt('URL o texto para el QR:', 'https://');
        if (qrUrl) {
          var qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+encodeURIComponent(qrUrl);
          insertHTML('<p style="text-align:center"><img src="'+qrSrc+'" style="border-radius:8px;border:1px solid #ddd;padding:6px" alt="QR Code"><br><span style="font-size:11px;color:#888">'+qrUrl+'</span></p>');
          showToast('QR generado ✅');
        }
        break;

      /* ── ⚡ PRODUCTIVIDAD ── */
      case 'zenMode':
        var body = document.body;
        var ed2 = document.getElementById('editor');
        if (!body.dataset.zen) {
          body.dataset.zen = '1';
          document.querySelector('.header').style.display = 'none';
          document.querySelector('.menu-card').style.display = 'none';
          document.querySelector('.footer').style.display = 'none';
          document.querySelector('.bottom-nav').style.display = 'none';
          document.getElementById('fabBtn').style.display = 'none';
          document.getElementById('communityBtn').style.display = 'none';
          ed2.style.cssText += 'max-width:700px;margin:40px auto;padding:3cm;box-shadow:none;';
          showToast('Modo Zen activado — toca aquí para salir');
          ed2.addEventListener('dblclick', function exitZen() {
            delete body.dataset.zen;
            document.querySelector('.header').style.display = '';
            document.querySelector('.menu-card').style.display = '';
            document.querySelector('.footer').style.display = '';
            document.querySelector('.bottom-nav').style.display = '';
            document.getElementById('fabBtn').style.display = '';
            document.getElementById('communityBtn').style.display = '';
            ed2.style.cssText = '';
            showToast('Modo Zen desactivado');
            ed2.removeEventListener('dblclick', exitZen);
          });
        }
        break;

      case 'immersive':
        document.getElementById('editor').style.fontSize = '17px';
        document.getElementById('editor').style.lineHeight = '1.9';
        document.getElementById('editor').style.maxWidth = '65ch';
        document.getElementById('editor').style.margin = '32px auto';
        showToast('Modo lectura inmersiva ✅ — doble clic para salir');
        break;

      case 'presMode':
        openDocWindow(document.getElementById('editor').innerHTML, 'Presentación');
        showToast('Modo presentación abierto ✅');
        break;

      case 'advancedStats':
        var txt2 = document.getElementById('editor').innerText;
        var words = txt2.trim().split(/\s+/).filter(function(w){ return w.length > 0; }).length;
        var chars = txt2.length;
        var paras = document.getElementById('editor').querySelectorAll('p').length;
        var heads2 = document.getElementById('editor').querySelectorAll('h1,h2,h3').length;
        var readMin = Math.ceil(words / 200);
        insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#0084ff;margin-bottom:10px">📊 Estadísticas del documento</h4><p style="font-size:13px;line-height:2">📝 Palabras: <strong>'+words+'</strong><br>📄 Caracteres: <strong>'+chars+'</strong><br>¶ Párrafos: <strong>'+paras+'</strong><br>🔤 Títulos: <strong>'+heads2+'</strong><br>⏱️ Tiempo de lectura: <strong>~'+readMin+' min</strong></p></div>');
        showToast('Estadísticas insertadas ✅');
        break;

      case 'meetingTimer':
        document.getElementById('wcToolsFab') && document.getElementById('wcToolsFab').click();
        showToast('Abriendo temporizador ⏱️');
        break;

      case 'tasksPanel':
        document.getElementById('wcToolsFab') && document.getElementById('wcToolsFab').click();
        showToast('Abriendo panel Kanban ✅');
        break;

      case 'tabsMode':
        openDocWindow('<p>Documento 2 — escribe aquí...</p>', 'Documento 2');
        showToast('Multidocumento abierto ✅');
        break;

      case 'searchHistory':
        var q = prompt('Buscar en el documento:');
        if (!q) break;
        var txt3 = document.getElementById('editor').innerHTML;
        var count = (txt3.match(new RegExp(q, 'gi')) || []).length;
        showToast('"'+q+'" encontrado '+count+' vez(ces)');
        break;

      case 'freeImages':
        var tema2 = prompt('¿Qué imagen buscás? (en inglés):', 'nature costa rica');
        if (tema2) {
          var imgUrl = 'https://source.unsplash.com/800x400/?'+encodeURIComponent(tema2);
          insertHTML('<p><img src="'+imgUrl+'" style="max-width:100%;border-radius:8px;margin:4px 0" alt="'+tema2+'"></p>');
          showToast('Imagen sin copyright insertada ✅');
        }
        break;

      case 'pdfReader':
        wcAbrirArchivo('editor');
        showToast('Abrí un archivo PDF ✅');
        break;

      case 'audioTranscript':
        var SRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SRec) { showToast('Reconocimiento de voz no disponible en este navegador'); break; }
        var rec2 = new SRec();
        rec2.lang = 'es-CR';
        rec2.continuous = true;
        rec2.interimResults = false;
        rec2.onresult = function(e) {
          var text = e.results[e.results.length-1][0].transcript;
          insertHTML('<p>'+text+'</p>');
        };
        rec2.onerror = function() { showToast('Error al transcribir'); };
        rec2.start();
        showToast('Escuchando... habla ahora 🎙️ (recarga para detener)');
        break;

      case 'htmlExport':
        exportAs('html');
        break;

      case 'mdExport':
        var md = document.getElementById('editor').innerHTML
          .replace(/<h1[^>]*>(.*?)<\/h1>/gi,'# $1\n')
          .replace(/<h2[^>]*>(.*?)<\/h2>/gi,'## $1\n')
          .replace(/<h3[^>]*>(.*?)<\/h3>/gi,'### $1\n')
          .replace(/<strong[^>]*>(.*?)<\/strong>/gi,'**$1**')
          .replace(/<em[^>]*>(.*?)<\/em>/gi,'_$1_')
          .replace(/<br\s*\/?>/gi,'\n')
          .replace(/<p[^>]*>(.*?)<\/p>/gi,'$1\n\n')
          .replace(/<[^>]+>/g,'')
          .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
        a.download = 'documento.md';
        a.click();
        showToast('Markdown exportado ✅');
        break;

      case 'epubExport':
        exportAs('epub');
        break;

      case 'cloudSave':
        localStorage.setItem('wc-v23', document.getElementById('editor').innerHTML);
        showToast('Guardado localmente ☁️ (Firebase activo)');
        break;

      case 'docTranslator':
        toggleAI();
        setTimeout(function(){ document.getElementById('aiInp').value = 'Traducí al inglés el contenido del documento'; }, 300);
        break;

      case 'whatsappBiz':
        var msg = prompt('Mensaje para WhatsApp Business CR:', document.getElementById('editor').innerText.substring(0,200));
        if (msg) {
          var tel = prompt('Número de teléfono CR (ej: 50688888888):', '506');
          window.open('https://wa.me/'+tel+'?text='+encodeURIComponent(msg), '_blank');
        }
        break;

      /* ── 🦙 SIBÖ IA ── */
      case 'docChatbot':
        toggleAI();
        showToast('Sibö IA abierto 🦙');
        break;

      case 'aiAssist':
        toggleAI();
        setTimeout(function(){ document.getElementById('aiInp').value = 'Analizá mi documento y sugerí mejoras'; sendAI(); }, 400);
        break;

      case 'docSummarizer':
        toggleAI();
        setTimeout(function(){ aiQuick('resumen'); }, 300);
        break;

      case 'plagDetector':
        toggleAI();
        setTimeout(function(){
          document.getElementById('aiInp').value = 'Analizá el siguiente texto y decime si podría tener problemas de originalidad o plagio académico. Sugerí cómo mejorarlo:\n' + document.getElementById('editor').innerText.substring(0,800);
          sendAI();
        }, 400);
        break;

      case 'questionGen':
        toggleAI();
        setTimeout(function(){
          document.getElementById('aiInp').value = 'Generá 10 preguntas de comprensión académica sobre el siguiente texto, con respuesta incluida:\n' + document.getElementById('editor').innerText.substring(0,800);
          sendAI();
        }, 400);
        break;

      case 'sentimentDetector':
        toggleAI();
        setTimeout(function(){
          document.getElementById('aiInp').value = 'Analizá el tono y sentimiento del siguiente texto (positivo/negativo/formal/informal/urgente). Dame un análisis detallado:\n' + document.getElementById('editor').innerText.substring(0,600);
          sendAI();
        }, 400);
        break;

      case 'factChecker':
        toggleAI();
        setTimeout(function(){
          document.getElementById('aiInp').value = 'Revisá el siguiente texto y señalá cualquier afirmación que pueda ser incorrecta, imprecisa o necesite verificación. Explicá por qué:\n' + document.getElementById('editor').innerText.substring(0,800);
          sendAI();
        }, 400);
        break;

      case 'imagenIA':
        var prompt2 = prompt('Describí la imagen que querés generar (en inglés):', 'beautiful costa rica landscape');
        if (prompt2) {
          var pollUrl = 'https://image.pollinations.ai/prompt/'+encodeURIComponent(prompt2)+'?width=800&height=500&nologo=true';
          insertHTML('<p style="text-align:center"><img src="'+pollUrl+'" style="max-width:100%;border-radius:10px;margin:8px 0" alt="'+prompt2+'"><br><span style="font-size:11px;color:#888">🎨 IA: '+prompt2+'</span></p>');
          showToast('Imagen IA insertada ✅ (puede tardar unos segundos)');
        }
        break;

      case 'contractAI':
        toggleAI();
        setTimeout(function(){
          var tipo = prompt('¿Qué tipo de contrato necesitás?', 'servicios profesionales');
          if (tipo) {
            document.getElementById('aiInp').value = 'Redactá un contrato profesional de '+tipo+' para Costa Rica, con todas las cláusulas legales necesarias según el Código Civil costarricense. Incluí: partes, objeto, duración, precio, obligaciones, resolución de conflictos y firmas. Formato HTML con h2, h3 y p.';
            sendAI();
          }
        }, 400);
        break;

      case 'emailAssistant':
        toggleAI();
        setTimeout(function(){
          var asunto = prompt('¿Sobre qué es el correo?', 'reunión de trabajo');
          if (asunto) {
            document.getElementById('aiInp').value = 'Escribí un correo electrónico profesional en español costarricense sobre: '+asunto+'. Tono formal pero amigable, como se usa en empresas de Costa Rica. Incluí asunto, saludo, cuerpo y despedida.';
            sendAI();
          }
        }, 400);
        break;

      case 'speechGen':
        toggleAI();
        setTimeout(function(){
          var tema3 = prompt('¿Tema del discurso?', 'emprendimiento en Costa Rica');
          var min = prompt('¿Duración aproximada (minutos)?', '5');
          if (tema3) {
            document.getElementById('aiInp').value = 'Escribí un discurso de '+min+' minutos sobre "'+tema3+'" para una audiencia costarricense. Incluí introducción impactante, 3 puntos principales con ejemplos locales, y conclusión motivadora. Formato HTML.';
            sendAI();
          }
        }, 400);
        break;

      case 'correctorRedaccion':
        toggleAI();
        setTimeout(function(){
          var sel2 = window.getSelection().toString() || document.getElementById('editor').innerText.substring(0,800);
          document.getElementById('aiInp').value = 'Corregí la redacción del siguiente texto para que sea formal y correcto en español costarricense. Mantené el contenido pero mejorá la gramática, puntuación, coherencia y estilo formal (oficio, carta o informe):\n\n'+sel2;
          sendAI();
        }, 400);
        break;

      case 'traductorIndigena':
        toggleAI();
        setTimeout(function(){
          var pal = prompt('¿Qué palabra o frase querés traducir?', '');
          var lang = prompt('¿A qué lengua? (bribri / cabecar / maleku / boruca / ngabe)', 'bribri');
          if (pal && lang) {
            document.getElementById('aiInp').value = 'Traducí "'+pal+'" al '+lang+' (lengua indígena de Costa Rica). Si tenés variantes dialectales, mostralas. También explicá el origen y significado cultural si es relevante.';
            sendAI();
          }
        }, 400);
        break;

      case 'hashtagSEO':
        toggleAI();
        setTimeout(function(){
          var tema4 = prompt('¿Sobre qué es tu publicación?', 'emprendimiento Costa Rica');
          var red = prompt('¿Para qué red social?', 'Instagram');
          if (tema4) {
            document.getElementById('aiInp').value = 'Generá 20 hashtags SEO optimizados para '+red+' sobre "'+tema4+'" enfocados en Costa Rica y Centroamérica. También sugerí 3 títulos SEO y 2 descripciones cortas. Formato de lista.';
            sendAI();
          }
        }, 400);
        break;

      case 'ivaCalc':
        var monto = parseFloat(prompt('Monto sin IVA (₡):', '10000'));
        if (!isNaN(monto)) {
          var iva = monto * 0.13;
          var total = monto + iva;
          insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#0084ff;margin-bottom:8px">🧮 Calculadora IVA CR (13%)</h4><p style="font-size:13px;line-height:2">Subtotal: <strong>₡'+monto.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>IVA 13%: <strong>₡'+iva.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Total: <strong style="color:#27ae60;font-size:15px">₡'+total.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong></p></div>');
          showToast('IVA calculado ✅');
        }
        break;

      case 'apaCorrector':
        toggleAI();
        setTimeout(function(){
          var citas = prompt('Pegá tus citas o referencias para corregir:', '');
          if (citas) {
            document.getElementById('aiInp').value = 'Corregí las siguientes citas y referencias bibliográficas al formato APA 7ma edición correctamente. Mostrá el antes y después de cada una:\n\n'+citas;
            sendAI();
          }
        }, 400);
        break;

      /* ── 🇨🇷 CR LEGAL ── */
      case 'actaReunion':
        var fecha = new Date().toLocaleDateString('es-CR');
        openDocWindow('<h2 style="text-align:center">ACTA DE REUNIÓN</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica</p><hr><p><strong>Fecha:</strong> '+fecha+'</p><p><strong>Hora de inicio:</strong> ___:___ a.m./p.m.</p><p><strong>Lugar:</strong> _______________</p><p><strong>Tipo de reunión:</strong> _______________</p><h3>PARTICIPANTES:</h3><p>1. _______________<br>2. _______________<br>3. _______________</p><h3>ORDEN DEL DÍA:</h3><p>1. Lectura y aprobación del acta anterior<br>2. _______________<br>3. Asuntos varios</p><h3>DESARROLLO:</h3><p>Se dio inicio a la sesión a las ___ horas, con la presencia de los miembros indicados.</p><p><strong>Punto 1:</strong> _______________</p><p><strong>Punto 2:</strong> _______________</p><h3>ACUERDOS:</h3><p>Acuerdo N°1: _______________<br>Acuerdo N°2: _______________</p><p>No habiendo más asuntos que tratar, se levanta la sesión a las ___ horas.</p><br><br><p style="text-align:center">_______________________<br><strong>Secretario/a</strong></p><p style="text-align:center">_______________________<br><strong>Presidente/a</strong></p>', 'Acta de Reunión CR');
        showToast('Acta de reunión CR ✅');
        break;

      case 'cartaPoder':
        openDocWindow('<h2 style="text-align:center">CARTA PODER NOTARIAL</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica</p><hr><p>Yo, <strong>_______________</strong>, mayor de edad, con cédula de identidad N° _______________, vecino/a de _______________, por medio de la presente otorgo poder especial a:</p><p><strong>_______________</strong>, con cédula N° _______________, para que en mi nombre y representación realice los siguientes actos:</p><p>1. _______________<br>2. _______________</p><p>Este poder es válido por _______________ a partir de la fecha de firma.</p><br><p style="text-align:right">San José, Costa Rica, '+new Date().toLocaleDateString('es-CR')+'</p><br><br><p>_______________________<br>Firma del poderdante<br>Cédula: _______________</p><br><p style="font-size:11px;color:#888;text-align:center">Ante mí: Notario Público N° _______</p>', 'Carta Poder Notarial CR');
        showToast('Carta poder notarial CR ✅');
        break;

      case 'declaracionJurada':
        openDocWindow('<h2 style="text-align:center">DECLARACIÓN JURADA</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica</p><hr><p>Yo, <strong>_______________</strong>, mayor de edad, con cédula de identidad N° _______________, vecino/a de _______________, bajo juramento de ley DECLARO:</p><p>1. Que _______________</p><p>2. Que _______________</p><p>3. Que la presente declaración la hago en pleno uso de mis facultades mentales y sin coacción alguna.</p><p>Que esta declaración la suscribo para los fines legales que corresponda.</p><br><p style="text-align:right">'+new Date().toLocaleDateString('es-CR')+'</p><br><br><p>_______________________<br>Firma y cédula</p><br><p style="font-size:11px;color:#888;text-align:center">Autenticado ante Notario Público N° _______</p>', 'Declaración Jurada CR');
        showToast('Declaración jurada CR ✅');
        break;

      case 'ndaContract':
        openDocWindow('<h2 style="text-align:center">ACUERDO DE CONFIDENCIALIDAD (NDA)</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica</p><hr><p>Entre <strong>_______________</strong> ("La Empresa") y <strong>_______________</strong> ("La Parte"), se suscribe el presente Acuerdo de Confidencialidad:</p><h3>CLÁUSULA PRIMERA: OBJETO</h3><p>Las partes acuerdan mantener en estricta confidencialidad toda la información comercial, técnica, financiera o de cualquier otra naturaleza que sea compartida entre sí.</p><h3>CLÁUSULA SEGUNDA: OBLIGACIONES</h3><p>La Parte se compromete a: no divulgar, reproducir ni utilizar la información confidencial para fines distintos a los acordados.</p><h3>CLÁUSULA TERCERA: DURACIÓN</h3><p>Este acuerdo tendrá vigencia por ___ años a partir de la fecha de firma.</p><h3>CLÁUSULA CUARTA: PENALIDADES</h3><p>El incumplimiento dará derecho a la parte afectada a reclamar daños y perjuicios conforme al Código Civil de Costa Rica.</p><br><p>San José, '+new Date().toLocaleDateString('es-CR')+'</p><br><p>_______________________<br>La Empresa</p><br><p>_______________________<br>La Parte</p>', 'Contrato NDA CR');
        showToast('Contrato NDA CR ✅');
        break;

      case 'reciboTimbre':
        var monto2 = prompt('Monto del recibo (₡):', '');
        var concepto = prompt('Concepto:', '');
        if (monto2 && concepto) {
          openDocWindow('<div style="border:2px solid #333;border-radius:8px;padding:24px;max-width:500px;margin:auto"><h2 style="text-align:center;color:#003da5">RECIBO CON TIMBRE FISCAL</h2><p style="text-align:center;font-size:11px;color:#666">República de Costa Rica · Ministerio de Hacienda</p><hr><p><strong>Recibí de:</strong> _______________</p><p><strong>La suma de:</strong> ₡'+parseFloat(monto2).toLocaleString('es-CR',{minimumFractionDigits:2})+'</p><p><strong>Concepto:</strong> '+concepto+'</p><p><strong>Fecha:</strong> '+new Date().toLocaleDateString('es-CR')+'</p><div style="border:1px solid #333;padding:10px;margin:16px 0;text-align:center;font-size:12px;background:#f5f5f5">TIMBRE FISCAL<br>₡ ___</div><br><p>_______________________<br>Firma y cédula</p></div>', 'Recibo Timbre Fiscal');
          showToast('Recibo timbre fiscal CR ✅');
        }
        break;

      case 'contratoHoras':
        openDocWindow('<h2 style="text-align:center">CONTRATO DE SERVICIOS POR HORAS</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica</p><hr><p>Entre <strong>_______________</strong> (el Contratante) y <strong>_______________</strong> (el Prestador), se acuerda:</p><h3>CLÁUSULA PRIMERA: SERVICIOS</h3><p>El Prestador realizará los siguientes servicios: _______________</p><h3>CLÁUSULA SEGUNDA: TARIFA</h3><p>La tarifa acordada es de ₡_______________ por hora.</p><h3>CLÁUSULA TERCERA: HORARIO</h3><p>Los servicios se prestarán los días _______________, de ___ a ___ horas.</p><h3>CLÁUSULA CUARTA: PAGO</h3><p>El pago se realizará de forma _______________ (semanal/quincenal/mensual).</p><h3>CLÁUSULA QUINTA: DURACIÓN</h3><p>El presente contrato inicia el _______________ y finaliza el _______________.</p><br><p>San José, '+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>El Contratante</p><br><p>_______________________<br>El Prestador</p>', 'Contrato por Horas CR');
        showToast('Contrato por horas CR ✅');
        break;

      case 'denunciaLaboral':
        openDocWindow('<h2 style="text-align:center">DENUNCIA LABORAL</h2><p style="text-align:center;color:#666;font-size:12px">Ministerio de Trabajo y Seguridad Social (MTSS) — Costa Rica</p><hr><p><strong>Denunciante:</strong> _______________<br><strong>Cédula:</strong> _______________<br><strong>Teléfono:</strong> _______________<br><strong>Correo:</strong> _______________</p><p><strong>Empleador denunciado:</strong> _______________<br><strong>Dirección del empleador:</strong> _______________</p><h3>HECHOS DENUNCIADOS:</h3><p>1. _______________<br>2. _______________<br>3. _______________</p><h3>DERECHOS VIOLENTADOS:</h3><p>☐ Salario mínimo<br>☐ Horas extra<br>☐ Vacaciones<br>☐ Aguinaldo<br>☐ CCSS<br>☐ Otro: _______________</p><h3>PRUEBAS ADJUNTAS:</h3><p>_______________</p><br><p style="text-align:right">'+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>Firma del denunciante</p><p style="font-size:11px;color:#888">Presentar en oficinas MTSS o en línea: www.mtss.go.cr</p>', 'Denuncia Laboral MTSS CR');
        showToast('Denuncia laboral MTSS CR ✅');
        break;

      case 'facturaElectronica':
        openDocWindow('<h2 style="text-align:center">FACTURA ELECTRÓNICA</h2><p style="text-align:center;color:#666;font-size:12px">Esquema XML v4.3 · Ministerio de Hacienda CR</p><hr><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px"><div><p><strong>Emisor:</strong><br>Nombre: _______________<br>Cédula Jurídica: _______________<br>Actividad económica: _______________<br>Correo: _______________</p></div><div><p><strong>Receptor:</strong><br>Nombre: _______________<br>Cédula: _______________<br>Correo: _______________</p></div></div><table style="border-collapse:collapse;width:100%;margin:10px 0"><tr style="background:#003da5;color:#fff"><th style="border:1px solid #ddd;padding:8px">Descripción</th><th style="border:1px solid #ddd;padding:8px">Cant.</th><th style="border:1px solid #ddd;padding:8px">Precio Unit.</th><th style="border:1px solid #ddd;padding:8px">Total</th></tr><tr><td style="border:1px solid #ddd;padding:8px">_______________</td><td style="border:1px solid #ddd;padding:8px;text-align:center">1</td><td style="border:1px solid #ddd;padding:8px;text-align:right">₡0.00</td><td style="border:1px solid #ddd;padding:8px;text-align:right">₡0.00</td></tr></table><div style="text-align:right"><p>Subtotal: ₡_______________<br>IVA 13%: ₡_______________<br><strong>Total: ₡_______________</strong></p></div><p style="font-size:11px;color:#888;text-align:center;margin-top:16px">Clave numérica: _______________ · Consecutivo: _______________<br>Código de seguridad: _______________ · Fecha emisión: '+new Date().toLocaleDateString('es-CR')+'</p>', 'Factura Electrónica CR v4.3');
        showToast('Factura electrónica CR ✅');
        break;

      case 'liquidacionLaboral':
        var salario = parseFloat(prompt('Salario mensual bruto (₡):', '')) || 0;
        var mesesTrab = parseFloat(prompt('Meses trabajados:', '')) || 0;
        var vacPend = parseFloat(prompt('Días de vacaciones pendientes:', '0')) || 0;
        if (salario && mesesTrab) {
          var anios = mesesTrab / 12;
          var preaviso = Math.min(anios, 1) * salario;
          var cesantia = Math.min(anios * salario, 8 * salario);
          var aguinaldo = (salario / 12) * (mesesTrab % 12 || 12);
          var vacaciones = (salario / 30) * vacPend;
          var total2 = preaviso + cesantia + aguinaldo + vacaciones;
          openDocWindow('<h2 style="text-align:center">LIQUIDACIÓN LABORAL</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica · Código de Trabajo</p><hr><p><strong>Trabajador:</strong> _______________<br><strong>Empresa:</strong> _______________<br><strong>Período:</strong> '+mesesTrab.toFixed(0)+' meses<br><strong>Salario mensual:</strong> ₡'+salario.toLocaleString('es-CR',{minimumFractionDigits:2})+'</p><table style="border-collapse:collapse;width:100%;margin:12px 0"><tr style="background:#003da5;color:#fff"><th style="padding:8px;border:1px solid #ddd;text-align:left">Rubro</th><th style="padding:8px;border:1px solid #ddd;text-align:right">Monto</th></tr><tr><td style="padding:8px;border:1px solid #ddd">Preaviso</td><td style="padding:8px;border:1px solid #ddd;text-align:right">₡'+preaviso.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr><td style="padding:8px;border:1px solid #ddd">Auxilio de cesantía</td><td style="padding:8px;border:1px solid #ddd;text-align:right">₡'+cesantia.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr><td style="padding:8px;border:1px solid #ddd">Aguinaldo proporcional</td><td style="padding:8px;border:1px solid #ddd;text-align:right">₡'+aguinaldo.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr><td style="padding:8px;border:1px solid #ddd">Vacaciones pendientes ('+vacPend+' días)</td><td style="padding:8px;border:1px solid #ddd;text-align:right">₡'+vacaciones.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr style="background:#d4edda"><td style="padding:10px;border:1px solid #ddd;font-weight:700">TOTAL A PAGAR</td><td style="padding:10px;border:1px solid #ddd;text-align:right;font-weight:700;font-size:16px">₡'+total2.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr></table><p style="font-size:11px;color:#888">Cálculo estimado según Código de Trabajo CR. Consulte con un abogado laboral.</p>', 'Liquidación Laboral CR');
          showToast('Liquidación calculada ✅');
        }
        break;

      case 'contratoArrendamiento':
        openDocWindow('<h2 style="text-align:center">CONTRATO DE ARRENDAMIENTO</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica · Ley N° 7527 (Ley General de Arrendamientos)</p><hr><p>Entre <strong>_______________</strong> (el Arrendante) y <strong>_______________</strong> (el Arrendatario):</p><h3>CLÁUSULA PRIMERA: OBJETO</h3><p>El Arrendante da en arrendamiento al Arrendatario el inmueble ubicado en: _______________</p><h3>CLÁUSULA SEGUNDA: PLAZO</h3><p>El plazo mínimo es de 3 años conforme a la Ley 7527. Inicia el _______________ y vence el _______________.</p><h3>CLÁUSULA TERCERA: PRECIO</h3><p>El canon mensual es de ₡_______________, pagadero los primeros 5 días de cada mes.</p><h3>CLÁUSULA CUARTA: DEPÓSITO</h3><p>El Arrendatario entrega un depósito de garantía equivalente a ___ mensualidades (₡_______________).</p><h3>CLÁUSULA QUINTA: USO</h3><p>El inmueble se destinará exclusivamente para uso: ☐ Habitacional ☐ Comercial</p><h3>CLÁUSULA SEXTA: SERVICIOS</h3><p>El Arrendatario pagará los servicios públicos (agua, luz, teléfono) a su cargo.</p><h3>CLÁUSULA SÉTIMA: RESOLUCIÓN</h3><p>Cualquier controversia se resolverá ante los Tribunales de Justicia de Costa Rica.</p><br><p>San José, '+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>El Arrendante · Cédula: ___</p><br><p>_______________________<br>El Arrendatario · Cédula: ___</p>', 'Contrato Arrendamiento CR');
        showToast('Contrato arrendamiento CR ✅');
        break;

      case 'estatutosSA':
        openDocWindow('<h2 style="text-align:center">ESTATUTOS DE SOCIEDAD ANÓNIMA</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica · Código de Comercio Art. 18-260</p><hr><h3>ARTÍCULO 1: DENOMINACIÓN</h3><p>La sociedad se denomina <strong>_______________ SOCIEDAD ANÓNIMA</strong>, o abreviado <strong>_______________ S.A.</strong></p><h3>ARTÍCULO 2: DOMICILIO</h3><p>El domicilio social se establece en la provincia de _______________, cantón de _______________, Costa Rica.</p><h3>ARTÍCULO 3: OBJETO</h3><p>La sociedad tiene por objeto: _______________</p><h3>ARTÍCULO 4: CAPITAL SOCIAL</h3><p>El capital social es de ₡_______________, dividido en _______________ acciones comunes de ₡_______________ cada una.</p><h3>ARTÍCULO 5: ADMINISTRACIÓN</h3><p>La sociedad será administrada por una Junta Directiva compuesta por:<br>• Presidente: _______________<br>• Secretario: _______________<br>• Tesorero: _______________</p><h3>ARTÍCULO 6: REPRESENTACIÓN</h3><p>La representación judicial y extrajudicial corresponde al Presidente, con facultades de apoderado generalísimo sin límite de suma.</p><h3>ARTÍCULO 7: FISCALÍA</h3><p>La Fiscalía estará a cargo de: _______________</p><h3>ARTÍCULO 8: ASAMBLEAS</h3><p>La Asamblea General Ordinaria se celebrará dentro de los tres meses siguientes al cierre del ejercicio fiscal (31 de diciembre).</p><h3>ARTÍCULO 9: DURACIÓN</h3><p>La sociedad tendrá una duración de 99 años a partir de su inscripción en el Registro Mercantil.</p>', 'Estatutos S.A. CR');
        showToast('Estatutos S.A. CR ✅');
        break;

      case 'licitacionPublica':
        openDocWindow('<h2 style="text-align:center">CARTEL DE LICITACIÓN PÚBLICA</h2><p style="text-align:center;color:#666;font-size:12px">República de Costa Rica · Ley N° 7494 (Contratación Administrativa) · SICOP</p><hr><p><strong>Institución:</strong> _______________<br><strong>N° de licitación:</strong> _______________<br><strong>Fecha de publicación:</strong> '+new Date().toLocaleDateString('es-CR')+'<br><strong>Fecha límite de ofertas:</strong> _______________</p><h3>ARTÍCULO 1: OBJETO DE LA CONTRATACIÓN</h3><p>La _______________ requiere contratar: _______________</p><h3>ARTÍCULO 2: ESPECIFICACIONES TÉCNICAS</h3><p>1. _______________<br>2. _______________</p><h3>ARTÍCULO 3: PRESUPUESTO</h3><p>El presupuesto estimado es de ₡_______________.</p><h3>ARTÍCULO 4: REQUISITOS DE ADMISIBILIDAD</h3><p>• Estar al día con CCSS<br>• Estar al día con Tributación<br>• Personería jurídica vigente<br>• _______________</p><h3>ARTÍCULO 5: EVALUACIÓN</h3><p>Precio: ___% · Experiencia: ___% · Técnico: ___%</p><h3>ARTÍCULO 6: GARANTÍAS</h3><p>Garantía de participación: ___% del monto ofertado.<br>Garantía de cumplimiento: ___% del monto adjudicado.</p><p style="font-size:11px;color:#888;text-align:center;margin-top:20px">Publicado en SICOP: www.sicop.go.cr · Registro N° _______________</p>', 'Cartel Licitación Pública CR');
        showToast('Cartel licitación pública CR ✅');
        break;

      case 'rentaCalc':
        var renta = parseFloat(prompt('Renta bruta anual (₡):', '')) || 0;
        if (renta) {
          var imp = 0;
          var detalle = '';
          if (renta <= 3891000) { imp = 0; detalle = 'Exento (hasta ₡3.891.000)'; }
          else if (renta <= 5788000) { imp = (renta - 3891000) * 0.10; detalle = '10% sobre exceso de ₡3.891.000'; }
          else if (renta <= 9678000) { imp = (5788000-3891000)*0.10 + (renta-5788000)*0.15; detalle = '10% + 15%'; }
          else if (renta <= 19357000) { imp = (5788000-3891000)*0.10 + (9678000-5788000)*0.15 + (renta-9678000)*0.20; detalle = '10%+15%+20%'; }
          else { imp = (5788000-3891000)*0.10 + (9678000-5788000)*0.15 + (19357000-9678000)*0.20 + (renta-19357000)*0.25; detalle = '10%+15%+20%+25%'; }
          insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#003da5;margin-bottom:8px">🏛️ Impuesto sobre la Renta 2025 CR</h4><p style="font-size:13px;line-height:2">Renta bruta anual: <strong>₡'+renta.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Tramos aplicados: '+detalle+'<br>Impuesto estimado: <strong style="color:#ce1126">₡'+imp.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Renta neta estimada: <strong style="color:#27ae60">₡'+(renta-imp).toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong></p><p style="font-size:10px;color:#888">Cálculo estimado. Consulte con un contador autorizado CR.</p></div>');
          showToast('Renta calculada ✅');
        }
        break;

      case 'ccssPlanilla':
        var salPlanilla = parseFloat(prompt('Salario bruto mensual (₡):', '')) || 0;
        if (salPlanilla) {
          var trabCCSSPct = 0.1067, patronCCSSPct = 0.2667;
          var trabCCSS = salPlanilla * trabCCSSPct;
          var patronCCSS = salPlanilla * patronCCSSPct;
          var salNeto = salPlanilla - trabCCSS;
          insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#003da5;margin-bottom:8px">🏥 Planilla CCSS CR</h4><p style="font-size:13px;line-height:2">Salario bruto: <strong>₡'+salPlanilla.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Deducción trabajador (10.67%): <strong style="color:#ce1126">-₡'+trabCCSS.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Salario neto: <strong style="color:#27ae60">₡'+salNeto.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Aporte patronal (26.67%): <strong style="color:#e67e22">₡'+patronCCSS.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Costo total empleador: <strong>₡'+(salPlanilla+patronCCSS).toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong></p><p style="font-size:10px;color:#888">Tarifas 2025. Verificar en www.ccss.sa.cr</p></div>');
          showToast('Planilla CCSS calculada ✅');
        }
        break;

      case 'premTemplates':
        openModal('modalPlantillas');
        showToast('Plantillas premium CR ✅');
        break;

      case 'correosInst':
        toggleAI();
        setTimeout(function(){
          var tipo2 = prompt('¿Qué tipo de correo institucional necesitás?', 'solicitud de información a institución pública');
          if (tipo2) {
            document.getElementById('aiInp').value = 'Redactá un correo institucional formal para Costa Rica sobre: '+tipo2+'. Seguí el formato oficial costarricense: asunto, saludo protocolario, cuerpo, despedida formal, firma con puesto. Nivel ejecutivo.';
            sendAI();
          }
        }, 400);
        break;

      case 'cvGenerator':
        var nombre = prompt('Tu nombre completo:', '');
        var puesto = prompt('Puesto al que aplicás:', '');
        if (nombre) {
          openDocWindow('<h1 style="text-align:center;color:#003da5">'+nombre+'</h1><p style="text-align:center;color:#666">'+puesto+' · 📧 correo@email.com · 📱 8888-8888 · San José, Costa Rica</p><hr style="border-color:#003da5"><h3 style="color:#003da5">PERFIL PROFESIONAL</h3><p>Profesional con experiencia en _______________, con sólidas competencias en _______________. Comprometido con la excelencia y el desarrollo profesional continuo.</p><h3 style="color:#003da5">EXPERIENCIA LABORAL</h3><p><strong>_______________</strong> | _______________<br><em>Fecha inicio – Fecha fin</em><br>• _______________<br>• _______________</p><h3 style="color:#003da5">EDUCACIÓN</h3><p><strong>_______________</strong> | _______________<br><em>Año</em></p><h3 style="color:#003da5">HABILIDADES</h3><p>• _______________<br>• _______________<br>• _______________</p><h3 style="color:#003da5">IDIOMAS</h3><p>Español: Nativo · Inglés: _______________</p><p style="font-size:10px;color:#888;text-align:center;margin-top:20px">© '+new Date().getFullYear()+' '+nombre+' · Costa Rica</p>', 'CV - '+nombre);
          showToast('CV generado ✅');
        }
        break;

      case 'budgetGen':
        var empresa = prompt('Nombre de tu empresa:', '');
        var cliente = prompt('Nombre del cliente:', '');
        if (empresa && cliente) {
          openDocWindow('<div style="border-top:6px solid #003da5;padding:20px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><div><h2 style="color:#003da5;margin:0">PRESUPUESTO COMERCIAL</h2><p style="color:#666;font-size:12px;margin:4px 0">N° _____ · '+new Date().toLocaleDateString('es-CR')+'</p></div><div style="text-align:right"><strong>'+empresa+'</strong><br><span style="font-size:11px;color:#666">Cédula jurídica: ___<br>Tel: ___ · correo@empresa.com</span></div></div><hr><p><strong>Cliente:</strong> '+cliente+'<br><strong>Correo:</strong> _______________<br><strong>Teléfono:</strong> _______________<br><strong>Válido hasta:</strong> _______________</p><table style="border-collapse:collapse;width:100%;margin:16px 0"><tr style="background:#003da5;color:#fff"><th style="padding:10px;border:1px solid #ddd;text-align:left">Descripción</th><th style="padding:10px;border:1px solid #ddd">Cant.</th><th style="padding:10px;border:1px solid #ddd">Precio unit.</th><th style="padding:10px;border:1px solid #ddd">Total</th></tr><tr><td style="padding:8px;border:1px solid #ddd">_______________</td><td style="padding:8px;border:1px solid #ddd;text-align:center">1</td><td style="padding:8px;border:1px solid #ddd;text-align:right">₡0.00</td><td style="padding:8px;border:1px solid #ddd;text-align:right">₡0.00</td></tr></table><div style="text-align:right;margin-top:10px"><p>Subtotal: ₡_________<br>IVA 13%: ₡_________<br><strong style="font-size:16px">Total: ₡_________</strong></p></div><p style="font-size:12px;color:#666;margin-top:20px"><strong>Términos y condiciones:</strong><br>• Pago: ___% adelanto, ___% contra entrega<br>• Tiempo de entrega: ___ días hábiles<br>• Garantía: _______________</p><p style="text-align:center;margin-top:30px">_______________________<br><strong>'+empresa+'</strong><br>Autorizado por: _______________</p></div>', 'Presupuesto - '+cliente);
          showToast('Presupuesto comercial CR ✅');
        }
        break;

      default:
        if (_orig) _orig(a);
        else showToast(a + ' — disponible próximamente');
        break;
    }
  };
})();
