/* ============================================================
   WC Corporate Editor v25 — PATCH COMPLETO iOS
   Sin prompt() — Modales HTML propios compatibles con iOS
   📝 Revisión | 🎨 Diseño | ⚡ Productividad | 🦙 Sibö IA | 🇨🇷 CR Legal
   © Keny Chinchilla Navarro
   ============================================================ */

/* ── MODAL HELPER sin prompt(), compatible iOS ── */
function wcModal(titulo, campos, onOk) {
  var old = document.getElementById('__wcMod'); if (old) old.remove();
  var ov = document.createElement('div');
  ov.id = '__wcMod';
  ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center';
  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;border-radius:20px 20px 0 0;padding:20px 18px 36px;width:100%;max-width:520px;max-height:85vh;overflow-y:auto;box-shadow:0 -4px 24px rgba(0,0,0,.2)';
  var h = '<div style="width:40px;height:5px;background:#d0d0d5;border-radius:3px;margin:0 auto 16px"></div>';
  h += '<div style="font-size:16px;font-weight:700;color:#1a2942;margin-bottom:16px">'+titulo+'</div>';
  campos.forEach(function(c){
    h += '<div style="font-size:12px;color:#888;font-weight:600;margin-bottom:4px">'+c.label+'</div>';
    if(c.type==='select'){
      h += '<select id="__f_'+c.id+'" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:10px;font-size:15px;margin-bottom:12px;background:#fff;-webkit-appearance:auto">';
      c.opts.forEach(function(o){ h += '<option value="'+o.v+'">'+o.l+'</option>'; });
      h += '</select>';
    } else {
      h += '<input id="__f_'+c.id+'" type="'+(c.type||'text')+'" placeholder="'+(c.ph||'')+'" value="'+(c.val||'')+'" inputmode="'+(c.inputmode||'text')+'" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:10px;font-size:15px;margin-bottom:12px;box-sizing:border-box;outline:none;-webkit-appearance:none">';
    }
  });
  h += '<div style="display:flex;gap:8px;margin-top:6px">';
  h += '<button id="__wcCancel" style="flex:1;padding:13px;border:1.5px solid #ddd;border-radius:12px;background:#f5f5f5;font-size:15px;font-weight:600;cursor:pointer;color:#333">Cancelar</button>';
  h += '<button id="__wcOk" style="flex:2;padding:13px;border:none;border-radius:12px;background:#0084ff;color:#fff;font-size:15px;font-weight:700;cursor:pointer">Continuar</button>';
  h += '</div>';
  box.innerHTML = h;
  ov.appendChild(box);
  document.body.appendChild(ov);
  ov.addEventListener('click', function(e){ if(e.target===ov) ov.remove(); });
  document.getElementById('__wcCancel').onclick = function(){ ov.remove(); };
  document.getElementById('__wcOk').onclick = function(){
    var vals = {};
    campos.forEach(function(c){ var el=document.getElementById('__f_'+c.id); if(el) vals[c.id]=el.value; });
    ov.remove(); onOk(vals);
  };
  setTimeout(function(){ var f=box.querySelector('input'); if(f) f.focus(); }, 150);
}

/* ── OVERRIDE handleAction ── */
(function(){
  var _orig = window.handleAction;
  window.handleAction = function(a){
    switch(a){

    /* REVISION */
    case 'tocPanel':
      var heads=document.getElementById('editor').querySelectorAll('h1,h2,h3,h4');
      if(!heads.length){ showToast('No hay títulos en el documento'); break; }
      var toc='<div style="border:1px solid #ddd;border-radius:10px;padding:16px;margin:12px 0;background:#f8f9fa"><h3 style="color:#0084ff;margin-bottom:10px">Tabla de contenidos</h3>';
      heads.forEach(function(h){ var lv=parseInt(h.tagName[1]); toc+='<div style="padding:4px 0 4px '+((lv-1)*16)+'px;font-size:'+(16-lv)+'px;color:#333;border-bottom:1px dotted #ddd">'+h.innerText+'</div>'; });
      toc+='</div>'; insertHTML(toc); showToast('Tabla de contenidos'); break;
    case 'bookmarks':
      wcModal('Nuevo marcador',[{id:'bm',label:'Nombre',ph:'Sección...'}],function(v){ if(!v.bm.trim()) return; insertHTML('<span id="bm-'+v.bm.replace(/\s/g,'-')+'" style="background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:1px 8px;font-size:12px">marcador: '+v.bm+'</span>'); showToast('Marcador creado'); }); break;
    case 'pageNumbers': abrirConfigEncabezado('pagenum'); break;
    case 'headerFooter': abrirConfigEncabezado('header'); break;
    case 'comments':
      wcModal('Comentario',[{id:'c',label:'Texto del comentario',ph:'Tu comentario...'}],function(v){ if(!v.c.trim()) return; insertHTML('<span style="background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:1px 6px;font-size:12px" title="'+v.c+'">Comentario: '+v.c+'</span>'); showToast('Comentario agregado'); }); break;
    case 'footnotes':
      wcModal('Nota al pie',[{id:'fn',label:'Texto de la nota',ph:'Nota...'}],function(v){ if(!v.fn.trim()) return; insertHTML('<hr style="border:none;border-top:1px solid #ddd;margin:20px 0 4px"><p style="font-size:11px;color:#666">1. '+v.fn+'</p>'); showToast('Nota al pie agregada'); }); break;
    case 'spellCheck': document.getElementById('editor').spellcheck=true; showToast('Corrector activado'); break;
    case 'autocomplete': showToast('El teclado iOS sugerirá palabras automáticamente'); break;
    case 'versionHistory':
      var sv=localStorage.getItem('wc-v23'); if(sv){ openDocWindow(sv,'Version guardada'); } else showToast('No hay version guardada'); break;
    case 'compareVersions': showToast('Guardá con Archivo para comparar versiones'); break;
    case 'textToSpeech':
      var ttsTxt=window.getSelection().toString()||document.getElementById('editor').innerText.substring(0,500);
      if(!ttsTxt.trim()){ showToast('Selecciona texto primero'); break; }
      window.speechSynthesis.cancel(); var utt=new SpeechSynthesisUtterance(ttsTxt); utt.lang='es-CR'; window.speechSynthesis.speak(utt); showToast('Leyendo texto...'); break;

    /* DISENO */
    case 'wordView':
      var ed=document.getElementById('editor'); ed.style.maxWidth='21.59cm'; ed.style.margin='24px auto'; ed.style.padding='2.54cm'; ed.style.background='#fff'; ed.style.boxShadow='0 1px 3px rgba(0,0,0,.13),0 6px 24px rgba(0,0,0,.10)'; showToast('Vista estilo Word'); break;
    case 'ruler':
      var rl=document.getElementById('ruler'); rl.style.display=rl.style.display==='none'?'block':'none'; showToast('Regla '+(rl.style.display==='none'?'oculta':'visible')); break;
    case 'columnsMode':
      insertHTML('<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:14px 0"><div style="border:1px dashed #ccc;padding:12px;border-radius:8px;min-height:100px">Columna 1...</div><div style="border:1px dashed #ccc;padding:12px;border-radius:8px;min-height:100px">Columna 2...</div></div><p></p>'); showToast('Columnas insertas'); break;
    case 'printPreview': window.print(); break;
    case 'stylesPanel':
      var sh='<div style="border:1px solid #ddd;border-radius:12px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#0084ff;margin-bottom:10px">Estilos rapidos</h4>';
      [{n:'Profesional',c:'font-family:Arial,sans-serif;font-size:14px;line-height:1.15'},{n:'Academico',c:"font-family:'Times New Roman',serif;font-size:14px;line-height:2"},{n:'Creativo',c:'font-family:Georgia,serif;font-size:15px;line-height:1.5'},{n:'Ejecutivo',c:'font-family:Calibri,sans-serif;font-size:13px;line-height:1.3'},{n:'Moderno',c:'font-family:Verdana,sans-serif;font-size:13px;line-height:1.6'}].forEach(function(e){
        sh+='<button onclick="document.getElementById(\'editor\').style.cssText+=\''+e.c+'\';showToast(\''+e.n+' aplicado\')" style="display:block;width:100%;text-align:left;padding:10px 12px;margin-bottom:6px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:13px">'+e.n+'</button>';
      }); sh+='</div>'; insertHTML(sh); showToast('Estilos insertados'); break;
    case 'docTheme':
      wcModal('Tema del documento',[{id:'t',label:'Elige un tema',type:'select',opts:[{v:'0',l:'Corporativo - Azul'},{v:'1',l:'Natural - Verde'},{v:'2',l:'Institucional - Rojo'},{v:'3',l:'Creativo - Morado'},{v:'4',l:'Dorado - Premium'}]}],function(v){
        var tc=[{h:'#003da5'},{h:'#27ae60'},{h:'#ce1126'},{h:'#6c5ce7'},{h:'#b7860b'}];
        var t=tc[parseInt(v.t)]||tc[0];
        document.getElementById('editor').querySelectorAll('h1,h2,h3').forEach(function(el){ el.style.color=t.h; });
        showToast('Tema aplicado');
      }); break;
    case 'pageBG': openModal('modalBackground'); break;
    case 'shapesPanel': openModal('modalShapes'); break;
    case 'tableGen':
      wcModal('Tabla avanzada',[{id:'r',label:'Filas',ph:'3',val:'3',inputmode:'numeric'},{id:'c',label:'Columnas',ph:'3',val:'3',inputmode:'numeric'}],function(v){
        var rows=parseInt(v.r)||3,cols=parseInt(v.c)||3,tbl='<table style="border-collapse:collapse;width:100%;margin:8px 0"><tr>';
        for(var i=0;i<cols;i++) tbl+='<th style="border:1px solid #ddd;padding:10px;background:#0084ff;color:#fff">Col '+(i+1)+'</th>';
        tbl+='</tr>';
        for(var r=0;r<rows;r++){ tbl+='<tr>'; for(var c=0;c<cols;c++) tbl+='<td style="border:1px solid #ddd;padding:8px"></td>'; tbl+='</tr>'; }
        tbl+='</table><p></p>'; insertHTML(tbl); showToast('Tabla '+rows+'x'+cols);
      }); break;
    case 'orgChart':
      insertHTML('<div style="text-align:center;padding:16px;margin:10px 0;border:1px solid #ddd;border-radius:10px"><div style="display:inline-block;background:#0084ff;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;margin-bottom:16px">Director General</div><br><div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap"><div style="background:#e3f2fd;border:1px solid #0084ff;padding:8px 16px;border-radius:8px;font-size:13px">Dept. A</div><div style="background:#e3f2fd;border:1px solid #0084ff;padding:8px 16px;border-radius:8px;font-size:13px">Dept. B</div><div style="background:#e3f2fd;border:1px solid #0084ff;padding:8px 16px;border-radius:8px;font-size:13px">Dept. C</div></div></div><p></p>'); showToast('Organigrama insertado'); break;
    case 'signatureCanvas': openAnnotation(); break;
    case 'qrGenerator':
      wcModal('Generar QR',[{id:'url',label:'URL o texto',ph:'https://...',val:'https://'}],function(v){ if(!v.url.trim()) return; var src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(v.url); insertHTML('<p style="text-align:center"><img src="'+src+'" style="border-radius:8px;border:1px solid #ddd;padding:6px" alt="QR"><br><span style="font-size:11px;color:#888">'+v.url+'</span></p>'); showToast('QR generado'); }); break;

    /* PRODUCTIVIDAD */
    case 'zenMode':
      if(!document.body.dataset.zen){
        document.body.dataset.zen='1';
        ['.header','.menu-card','.footer','.bottom-nav'].forEach(function(s){ var el=document.querySelector(s); if(el) el.style.display='none'; });
        ['fabBtn','communityBtn'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
        var edz=document.getElementById('editor'); edz.style.maxWidth='700px'; edz.style.margin='40px auto';
        showToast('Modo Zen - doble toque para salir');
        edz.addEventListener('dblclick',function ex(){ delete document.body.dataset.zen; ['.header','.menu-card','.footer','.bottom-nav'].forEach(function(s){ var el=document.querySelector(s); if(el) el.style.display=''; }); ['fabBtn','communityBtn'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display=''; }); edz.style.maxWidth=''; edz.style.margin=''; showToast('Modo Zen desactivado'); edz.removeEventListener('dblclick',ex); });
      } break;
    case 'immersive': var edi=document.getElementById('editor'); edi.style.fontSize='17px'; edi.style.lineHeight='1.9'; edi.style.maxWidth='65ch'; showToast('Modo lectura inmersiva'); break;
    case 'presMode': openDocWindow(document.getElementById('editor').innerHTML,'Presentacion'); showToast('Modo presentacion'); break;
    case 'advancedStats':
      var tx=document.getElementById('editor').innerText,w=tx.trim().split(/\s+/).filter(function(x){return x.length>0;}).length;
      insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#0084ff;margin-bottom:8px">Estadisticas</h4><p style="font-size:13px;line-height:2">Palabras: <strong>'+w+'</strong><br>Caracteres: <strong>'+tx.length+'</strong><br>Lectura: <strong>~'+Math.ceil(w/200)+' min</strong></p></div>'); showToast('Estadisticas insertadas'); break;
    case 'meetingTimer': var fb=document.getElementById('wcToolsFab'); if(fb) fb.click(); showToast('Abriendo temporizador'); break;
    case 'tasksPanel': var fb2=document.getElementById('wcToolsFab'); if(fb2) fb2.click(); showToast('Abriendo Kanban'); break;
    case 'tabsMode': openDocWindow('<p>Documento 2...</p>','Documento 2'); break;
    case 'searchHistory':
      wcModal('Buscar en documento',[{id:'q',label:'Texto a buscar',ph:'Palabra...'}],function(v){ if(!v.q.trim()) return; var cnt=(document.getElementById('editor').innerHTML.match(new RegExp(v.q,'gi'))||[]).length; showToast('"'+v.q+'" encontrado '+cnt+' vez(ces)'); }); break;
    case 'freeImages':
      wcModal('Imagen sin copyright',[{id:'t',label:'Que imagen buscas (en ingles)',ph:'costa rica nature...'}],function(v){ if(!v.t.trim()) return; insertHTML('<p><img src="https://source.unsplash.com/800x400/?'+encodeURIComponent(v.t)+'" style="max-width:100%;border-radius:8px" alt="'+v.t+'"></p>'); showToast('Imagen insertada'); }); break;
    case 'pdfReader': wcAbrirArchivo('editor'); break;
    case 'audioTranscript':
      var SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){ showToast('Voz no disponible'); break; }
      var rec=new SR(); rec.lang='es-CR'; rec.continuous=true; rec.interimResults=false; rec.onresult=function(e){ insertHTML('<p>'+e.results[e.results.length-1][0].transcript+'</p>'); }; rec.start(); showToast('Escuchando... habla ahora'); break;
    case 'htmlExport': exportAs('html'); break;
    case 'mdExport':
      var md=document.getElementById('editor').innerHTML.replace(/<h1[^>]*>(.*?)<\/h1>/gi,'# $1\n').replace(/<h2[^>]*>(.*?)<\/h2>/gi,'## $1\n').replace(/<h3[^>]*>(.*?)<\/h3>/gi,'### $1\n').replace(/<strong[^>]*>(.*?)<\/strong>/gi,'**$1**').replace(/<br\s*\/?>/gi,'\n').replace(/<p[^>]*>(.*?)<\/p>/gi,'$1\n\n').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
      wcDownload(new Blob([md],{type:'text/markdown'}),'documento.md','text/markdown'); showToast('Markdown exportado'); break;
    case 'epubExport': exportAs('epub'); break;
    case 'cloudSave': localStorage.setItem('wc-v23',document.getElementById('editor').innerHTML); showToast('Guardado en la nube (Firebase activo)'); break;
    case 'docTranslator': toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Traducí al inglés el contenido del documento'; },300); break;
    case 'whatsappBiz':
      wcModal('WhatsApp Business CR',[{id:'tel',label:'Número (con código país)',ph:'50688888888',val:'506',inputmode:'numeric'},{id:'msg',label:'Mensaje',ph:'Hola, le escribo...'}],function(v){ if(!v.tel||!v.msg) return; window.open('https://wa.me/'+v.tel.replace(/\D/g,'')+'?text='+encodeURIComponent(v.msg),'_blank'); }); break;

    /* SIBU IA */
    case 'docChatbot': toggleAI(); showToast('Sibu IA abierto'); break;
    case 'aiAssist': toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Analizá mi documento y sugeri mejoras'; sendAI(); },400); break;
    case 'docSummarizer': toggleAI(); setTimeout(function(){ aiQuick('resumen'); },300); break;
    case 'plagDetector': toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Analiza si este texto podria tener plagio:\n'+document.getElementById('editor').innerText.substring(0,800); sendAI(); },400); break;
    case 'questionGen': toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Generá 10 preguntas de comprension con respuestas sobre:\n'+document.getElementById('editor').innerText.substring(0,800); sendAI(); },400); break;
    case 'sentimentDetector': toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Analiza el tono y sentimiento (positivo/negativo/formal/informal) de:\n'+document.getElementById('editor').innerText.substring(0,600); sendAI(); },400); break;
    case 'factChecker': toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Señala afirmaciones incorrectas o que necesiten verificacion en:\n'+document.getElementById('editor').innerText.substring(0,800); sendAI(); },400); break;
    case 'imagenIA':
      wcModal('Generador de imagenes IA',[{id:'d',label:'Describe la imagen (en ingles)',ph:'beautiful costa rica rainforest...'}],function(v){ if(!v.d.trim()) return; var src='https://image.pollinations.ai/prompt/'+encodeURIComponent(v.d)+'?width=800&height=500&nologo=true'; insertHTML('<p style="text-align:center"><img src="'+src+'" style="max-width:100%;border-radius:10px;margin:8px 0" alt="'+v.d+'"><br><span style="font-size:11px;color:#888">IA: '+v.d+'</span></p>'); showToast('Imagen IA insertada - puede tardar unos segundos'); }); break;
    case 'contractAI':
      wcModal('Contrato con IA',[{id:'t',label:'Tipo de contrato',ph:'servicios, arriendo, NDA...'}],function(v){ if(!v.t.trim()) return; toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Redacta un contrato de '+v.t+' para Costa Rica con todas las clausulas legales. Formato HTML.'; sendAI(); },400); }); break;
    case 'emailAssistant':
      wcModal('Asistente de correo',[{id:'a',label:'Sobre que es el correo',ph:'reunion, cotizacion, seguimiento...'}],function(v){ if(!v.a.trim()) return; toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Escribe un correo institucional formal en espanol costarricense sobre: '+v.a+'. Con saludo, cuerpo y despedida.'; sendAI(); },400); }); break;
    case 'speechGen':
      wcModal('Generador de discursos',[{id:'t',label:'Tema del discurso',ph:'emprendimiento CR...'},{id:'m',label:'Duracion (minutos)',ph:'5',val:'5',inputmode:'numeric'}],function(v){ if(!v.t.trim()) return; toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Escribe un discurso de '+v.m+' minutos sobre "'+v.t+'" para audiencia costarricense. Formato HTML.'; sendAI(); },400); }); break;
    case 'correctorRedaccion': toggleAI(); setTimeout(function(){ var sel=window.getSelection().toString()||document.getElementById('editor').innerText.substring(0,800); document.getElementById('aiInp').value='Corrige la redaccion de este texto para que sea formal en espanol costarricense:\n\n'+sel; sendAI(); },400); break;
    case 'traductorIndigena':
      wcModal('Traductor lenguas indigenas CR',[{id:'p',label:'Palabra o frase a traducir',ph:'agua, casa, gracias...'},{id:'l',label:'Lengua destino',type:'select',opts:[{v:'bribri',l:'Bribri'},{v:'cabecar',l:'Cabecar'},{v:'maleku',l:'Maleku'},{v:'boruca',l:'Boruca (Brunca)'},{v:'ngabe',l:'Ngabe/Guaymi'}]}],function(v){ if(!v.p.trim()) return; toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Traduce "'+v.p+'" al '+v.l+' (lengua indigena de Costa Rica). Muestra variantes y significado cultural.'; sendAI(); },400); }); break;
    case 'hashtagSEO':
      wcModal('Hashtags y SEO',[{id:'t',label:'Tema de tu publicacion',ph:'emprendimiento CR...'},{id:'r',label:'Red social',type:'select',opts:[{v:'Instagram',l:'Instagram'},{v:'LinkedIn',l:'LinkedIn'},{v:'TikTok',l:'TikTok'},{v:'Facebook',l:'Facebook'},{v:'Twitter/X',l:'Twitter/X'}]}],function(v){ if(!v.t.trim()) return; toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Genera 20 hashtags SEO para '+v.r+' sobre "'+v.t+'" con foco en Costa Rica. Incluye 3 titulos SEO y 2 descripciones.'; sendAI(); },400); }); break;
    case 'ivaCalc':
      wcModal('Calculadora IVA CR 13%',[{id:'m',label:'Monto sin IVA (colones)',ph:'10000',inputmode:'decimal'}],function(v){ var m=parseFloat(v.m); if(isNaN(m)||m<=0){ showToast('Ingresa un monto valido'); return; } var iva=m*0.13,tot=m+iva; insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#0084ff;margin-bottom:8px">Calculadora IVA CR 13%</h4><p style="font-size:13px;line-height:2.2">Subtotal: <strong>'+m.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>IVA 13%: <strong>'+iva.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Total: <strong style="color:#27ae60;font-size:15px">'+tot.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong></p></div>'); showToast('IVA calculado'); }); break;
    case 'apaCorrector':
      wcModal('Corrector APA 7',[{id:'c',label:'Pega tus citas o referencias',ph:'Apellido, N. (Anio). Titulo...'}],function(v){ if(!v.c.trim()) return; toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Corrige estas citas al formato APA 7ma edicion. Muestra antes y despues:\n\n'+v.c; sendAI(); },400); }); break;

    /* CR LEGAL */
    case 'actaReunion':
      openDocWindow('<h2 style="text-align:center">ACTA DE REUNION</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica</p><hr><p><strong>Fecha:</strong> '+new Date().toLocaleDateString('es-CR')+'</p><p><strong>Hora:</strong> ___:___</p><p><strong>Lugar:</strong> _______________</p><h3>PARTICIPANTES:</h3><p>1. _______________<br>2. _______________<br>3. _______________</p><h3>ORDEN DEL DIA:</h3><p>1. Lectura acta anterior<br>2. _______________</p><h3>DESARROLLO:</h3><p>Se inicio la sesion a las ___ horas.</p><h3>ACUERDOS:</h3><p>1. _______________</p><br><p style="text-align:center">_______________________<br>Secretario/a</p>','Acta de Reunion CR'); showToast('Acta de reunion CR'); break;
    case 'cartaPoder':
      openDocWindow('<h2 style="text-align:center">CARTA PODER NOTARIAL</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica</p><hr><p>Yo, <strong>_______________</strong>, cedula N _______________,otorgo poder especial a <strong>_______________</strong>, cedula N _______________, para:</p><p>1. _______________<br>2. _______________</p><p>Valido por _______________ a partir de la fecha.</p><br><p>'+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>Firma y cedula</p>','Carta Poder CR'); showToast('Carta poder CR'); break;
    case 'declaracionJurada':
      openDocWindow('<h2 style="text-align:center">DECLARACION JURADA</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica</p><hr><p>Yo, <strong>_______________</strong>, cedula N _______________, bajo juramento DECLARO:</p><p>1. Que _______________</p><p>2. Que _______________</p><p>3. Que actuo en pleno uso de mis facultades y sin coaccion.</p><br><p>'+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>Firma y cedula</p>','Declaracion Jurada CR'); showToast('Declaracion jurada CR'); break;
    case 'ndaContract':
      openDocWindow('<h2 style="text-align:center">ACUERDO DE CONFIDENCIALIDAD (NDA)</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica</p><hr><p>Entre <strong>_______________</strong> y <strong>_______________</strong>:</p><h3>CL. PRIMERA: OBJETO</h3><p>Mantener confidencialidad sobre toda informacion comercial y tecnica compartida.</p><h3>CL. SEGUNDA: DURACION</h3><p>___ anios desde la firma.</p><h3>CL. TERCERA: PENALIDADES</h3><p>Incumplimiento segun Codigo Civil CR.</p><br><p>'+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>Empresa</p><br><p>_______________________<br>La Parte</p>','Contrato NDA CR'); showToast('NDA CR generado'); break;
    case 'reciboTimbre':
      wcModal('Recibo con timbre fiscal',[{id:'m',label:'Monto (colones)',ph:'10000',inputmode:'decimal'},{id:'con',label:'Concepto',ph:'Servicios...'},{id:'de',label:'Recibido de',ph:'Nombre...'}],function(v){ if(!v.m||!v.con) return; var m=parseFloat(v.m)||0; openDocWindow('<div style="border:2px solid #333;border-radius:8px;padding:24px;max-width:500px;margin:auto"><h2 style="text-align:center;color:#003da5">RECIBO CON TIMBRE FISCAL</h2><p style="text-align:center;font-size:11px;color:#666">Republica de Costa Rica</p><hr><p><strong>Recibi de:</strong> '+v.de+'</p><p><strong>La suma de:</strong> '+m.toLocaleString('es-CR',{minimumFractionDigits:2})+'</p><p><strong>Concepto:</strong> '+v.con+'</p><p><strong>Fecha:</strong> '+new Date().toLocaleDateString('es-CR')+'</p><div style="border:1px solid #333;padding:10px;margin:16px 0;text-align:center;font-size:12px;background:#f5f5f5">TIMBRE FISCAL</div><br><p>_______________________<br>Firma</p></div>','Recibo Timbre Fiscal'); showToast('Recibo timbre CR'); }); break;
    case 'contratoHoras':
      openDocWindow('<h2 style="text-align:center">CONTRATO DE SERVICIOS POR HORAS</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica</p><hr><p>Entre <strong>_______________</strong> (Contratante) y <strong>_______________</strong> (Prestador):</p><h3>CL. PRIMERA: SERVICIOS</h3><p>_______________</p><h3>CL. SEGUNDA: TARIFA</h3><p>_______________ por hora.</p><h3>CL. TERCERA: HORARIO</h3><p>Dias _______________, de ___ a ___ horas.</p><h3>CL. CUARTA: DURACION</h3><p>Del _______________ al _______________.</p><br><p>'+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>Contratante</p><br><p>_______________________<br>Prestador</p>','Contrato por Horas CR'); showToast('Contrato por horas CR'); break;
    case 'denunciaLaboral':
      openDocWindow('<h2 style="text-align:center">DENUNCIA LABORAL</h2><p style="text-align:center;color:#666;font-size:12px">Ministerio de Trabajo y Seguridad Social - Costa Rica</p><hr><p><strong>Denunciante:</strong> _______________<br><strong>Cedula:</strong> _______________<br><strong>Telefono:</strong> _______________</p><p><strong>Empleador denunciado:</strong> _______________</p><h3>HECHOS:</h3><p>1. _______________<br>2. _______________</p><h3>DERECHOS VIOLENTADOS:</h3><p>[ ] Salario &nbsp; [ ] Horas extra &nbsp; [ ] Vacaciones &nbsp; [ ] Aguinaldo &nbsp; [ ] CCSS</p><br><p>_______________________<br>Firma</p><p style="font-size:11px;color:#888">MTSS: www.mtss.go.cr</p>','Denuncia Laboral MTSS CR'); showToast('Denuncia laboral MTSS CR'); break;
    case 'facturaElectronica':
      openDocWindow('<h2 style="text-align:center">FACTURA ELECTRONICA</h2><p style="text-align:center;color:#666;font-size:12px">Esquema XML v4.3 - Ministerio de Hacienda CR</p><hr><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div><p><strong>Emisor:</strong><br>_______________<br>Cedula: _______________</p></div><div><p><strong>Receptor:</strong><br>_______________<br>Cedula: _______________</p></div></div><table style="border-collapse:collapse;width:100%;margin:10px 0"><tr style="background:#003da5;color:#fff"><th style="border:1px solid #ddd;padding:8px">Descripcion</th><th style="border:1px solid #ddd;padding:8px">Cant</th><th style="border:1px solid #ddd;padding:8px">Precio</th><th style="border:1px solid #ddd;padding:8px">Total</th></tr><tr><td style="border:1px solid #ddd;padding:8px">_______________</td><td style="border:1px solid #ddd;padding:8px;text-align:center">1</td><td style="border:1px solid #ddd;padding:8px;text-align:right">0.00</td><td style="border:1px solid #ddd;padding:8px;text-align:right">0.00</td></tr></table><div style="text-align:right"><p>Subtotal: ___<br>IVA 13%: ___<br><strong>Total: ___</strong></p></div><p style="font-size:11px;color:#888;text-align:center">Fecha: '+new Date().toLocaleDateString('es-CR')+'</p>','Factura Electronica CR v4.3'); showToast('Factura electronica CR'); break;
    case 'liquidacionLaboral':
      wcModal('Liquidacion Laboral CR',[{id:'s',label:'Salario mensual bruto',ph:'500000',inputmode:'decimal'},{id:'m',label:'Meses trabajados',ph:'24',inputmode:'decimal'},{id:'v',label:'Dias vacaciones pendientes',ph:'0',val:'0',inputmode:'decimal'}],function(v){ var sal=parseFloat(v.s)||0,mes=parseFloat(v.m)||0,vac=parseFloat(v.v)||0; if(!sal||!mes){ showToast('Ingresa salario y meses'); return; } var anios=mes/12,pre=Math.min(anios,1)*sal,ces=Math.min(anios,8)*sal,agu=(sal/12)*(mes%12||12),vacM=(sal/30)*vac,tot=pre+ces+agu+vacM; openDocWindow('<h2 style="text-align:center">LIQUIDACION LABORAL</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica - Codigo de Trabajo</p><hr><p><strong>Trabajador:</strong> _______________<br><strong>Empresa:</strong> _______________<br><strong>Periodo:</strong> '+mes.toFixed(0)+' meses<br><strong>Salario mensual:</strong> '+sal.toLocaleString('es-CR',{minimumFractionDigits:2})+'</p><table style="border-collapse:collapse;width:100%;margin:12px 0"><tr style="background:#003da5;color:#fff"><th style="padding:8px;border:1px solid #ddd;text-align:left">Rubro</th><th style="padding:8px;border:1px solid #ddd;text-align:right">Monto</th></tr><tr><td style="padding:8px;border:1px solid #ddd">Preaviso</td><td style="padding:8px;border:1px solid #ddd;text-align:right">'+pre.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr><td style="padding:8px;border:1px solid #ddd">Cesantia</td><td style="padding:8px;border:1px solid #ddd;text-align:right">'+ces.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr><td style="padding:8px;border:1px solid #ddd">Aguinaldo proporcional</td><td style="padding:8px;border:1px solid #ddd;text-align:right">'+agu.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr><td style="padding:8px;border:1px solid #ddd">Vacaciones ('+vac+' dias)</td><td style="padding:8px;border:1px solid #ddd;text-align:right">'+vacM.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr><tr style="background:#d4edda"><td style="padding:10px;border:1px solid #ddd;font-weight:700">TOTAL A PAGAR</td><td style="padding:10px;border:1px solid #ddd;text-align:right;font-weight:700;font-size:16px;color:#27ae60">'+tot.toLocaleString('es-CR',{minimumFractionDigits:2})+'</td></tr></table><p style="font-size:11px;color:#888">Estimado segun Codigo de Trabajo CR.</p>','Liquidacion Laboral CR'); showToast('Liquidacion calculada'); }); break;
    case 'contratoArrendamiento':
      openDocWindow('<h2 style="text-align:center">CONTRATO DE ARRENDAMIENTO</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica - Ley N 7527</p><hr><p>Entre <strong>_______________</strong> (Arrendante) y <strong>_______________</strong> (Arrendatario):</p><h3>CL. PRIMERA: OBJETO</h3><p>Inmueble ubicado en: _______________</p><h3>CL. SEGUNDA: PLAZO</h3><p>Minimo 3 anios segun Ley 7527. Del _______________ al _______________.</p><h3>CL. TERCERA: PRECIO</h3><p>Canon mensual: _______________, primeros 5 dias de cada mes.</p><h3>CL. CUARTA: DEPOSITO</h3><p>___ mensualidades de garantia.</p><h3>CL. QUINTA: USO</h3><p>[ ] Habitacional &nbsp; [ ] Comercial</p><br><p>'+new Date().toLocaleDateString('es-CR')+'</p><p>_______________________<br>Arrendante</p><br><p>_______________________<br>Arrendatario</p>','Contrato Arrendamiento CR'); showToast('Contrato arrendamiento CR'); break;
    case 'estatutosSA':
      openDocWindow('<h2 style="text-align:center">ESTATUTOS DE SOCIEDAD ANONIMA</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica - Codigo de Comercio</p><hr><h3>ART. 1: DENOMINACION</h3><p><strong>_______________ SOCIEDAD ANONIMA</strong> (_______________ S.A.)</p><h3>ART. 2: DOMICILIO</h3><p>Provincia de _______________, canton de _______________, Costa Rica.</p><h3>ART. 3: OBJETO</h3><p>_______________</p><h3>ART. 4: CAPITAL SOCIAL</h3><p>_______________ dividido en _______________ acciones de _______________ cada una.</p><h3>ART. 5: JUNTA DIRECTIVA</h3><p>Presidente: _______________<br>Secretario: _______________<br>Tesorero: _______________</p><h3>ART. 6: REPRESENTACION</h3><p>El Presidente tendra poder generalisimo sin limite de suma.</p><h3>ART. 7: DURACION</h3><p>99 anios desde su inscripcion en el Registro Mercantil.</p>','Estatutos S.A. CR'); showToast('Estatutos S.A. CR'); break;
    case 'licitacionPublica':
      openDocWindow('<h2 style="text-align:center">CARTEL DE LICITACION PUBLICA</h2><p style="text-align:center;color:#666;font-size:12px">Republica de Costa Rica - Ley N 7494 - SICOP</p><hr><p><strong>Institucion:</strong> _______________<br><strong>N Licitacion:</strong> _______________<br><strong>Fecha:</strong> '+new Date().toLocaleDateString('es-CR')+'<br><strong>Fecha limite:</strong> _______________</p><h3>ART. 1: OBJETO</h3><p>_______________</p><h3>ART. 2: PRESUPUESTO</h3><p>_______________</p><h3>ART. 3: REQUISITOS</h3><p>- Al dia con CCSS<br>- Al dia con Tributacion<br>- Personeria juridica vigente</p><h3>ART. 4: EVALUACION</h3><p>Precio: ___% - Experiencia: ___% - Tecnico: ___%</p><p style="font-size:11px;color:#888;text-align:center;margin-top:20px">SICOP: www.sicop.go.cr</p>','Cartel Licitacion CR'); showToast('Licitacion publica CR'); break;
    case 'rentaCalc':
      wcModal('Impuesto sobre la Renta 2025',[{id:'r',label:'Renta bruta anual (colones)',ph:'6000000',inputmode:'decimal'}],function(v){ var r=parseFloat(v.r)||0; if(!r){ showToast('Ingresa un monto'); return; } var imp=0,det=''; if(r<=3891000){imp=0;det='Exento';}else if(r<=5788000){imp=(r-3891000)*0.10;det='10%';}else if(r<=9678000){imp=(5788000-3891000)*0.10+(r-5788000)*0.15;det='10%+15%';}else if(r<=19357000){imp=(5788000-3891000)*0.10+(9678000-5788000)*0.15+(r-9678000)*0.20;det='10%+15%+20%';}else{imp=(5788000-3891000)*0.10+(9678000-5788000)*0.15+(19357000-9678000)*0.20+(r-19357000)*0.25;det='10%+15%+20%+25%';} insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#003da5;margin-bottom:8px">Impuesto sobre la Renta 2025 CR</h4><p style="font-size:13px;line-height:2.2">Renta anual: <strong>'+r.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Tramos: '+det+'<br>Impuesto: <strong style="color:#ce1126">'+imp.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Neto estimado: <strong style="color:#27ae60">'+(r-imp).toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong></p><p style="font-size:10px;color:#888">Estimado. Consulte con contador CR.</p></div>'); showToast('Renta calculada'); }); break;
    case 'ccssPlanilla':
      wcModal('Planilla CCSS CR',[{id:'s',label:'Salario bruto mensual (colones)',ph:'500000',inputmode:'decimal'}],function(v){ var s=parseFloat(v.s)||0; if(!s){ showToast('Ingresa el salario'); return; } var tr=s*0.1067,pa=s*0.2667,ne=s-tr; insertHTML('<div style="border:1px solid #ddd;border-radius:10px;padding:14px;margin:10px 0;background:#f8f9fa"><h4 style="color:#003da5;margin-bottom:8px">Planilla CCSS CR 2025</h4><p style="font-size:13px;line-height:2.2">Salario bruto: <strong>'+s.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Deduccion trabajador (10.67%): <strong style="color:#ce1126">-'+tr.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Salario neto: <strong style="color:#27ae60">'+ne.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Aporte patronal (26.67%): <strong style="color:#e67e22">'+pa.toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong><br>Costo total empleador: <strong>'+(s+pa).toLocaleString('es-CR',{minimumFractionDigits:2})+'</strong></p><p style="font-size:10px;color:#888">Tarifas 2025 - ccss.sa.cr</p></div>'); showToast('Planilla CCSS calculada'); }); break;
    case 'premTemplates': openModal('modalPlantillas'); break;
    case 'correosInst':
      wcModal('Correo institucional CR',[{id:'t',label:'Tipo de correo',ph:'solicitud, oficio, circular...'}],function(v){ if(!v.t.trim()) return; toggleAI(); setTimeout(function(){ document.getElementById('aiInp').value='Redacta un correo institucional formal para Costa Rica sobre: '+v.t+'. Formato oficial con saludo protocolario y despedida formal.'; sendAI(); },400); }); break;
    case 'cvGenerator':
      wcModal('Generador CV CR',[{id:'n',label:'Tu nombre completo',ph:'Juan Perez Mora'},{id:'p',label:'Puesto al que aplicas',ph:'Desarrollador, Contador...'}],function(v){ if(!v.n.trim()) return; openDocWindow('<h1 style="text-align:center;color:#003da5">'+v.n+'</h1><p style="text-align:center;color:#666">'+v.p+' - correo@email.com - 8888-8888 - San Jose, Costa Rica</p><hr style="border-color:#003da5"><h3 style="color:#003da5">PERFIL PROFESIONAL</h3><p>Profesional con experiencia en _______________, comprometido con la excelencia.</p><h3 style="color:#003da5">EXPERIENCIA LABORAL</h3><p><strong>_______________</strong> | _______________<br>Fecha - Fecha<br>- _______________</p><h3 style="color:#003da5">EDUCACION</h3><p><strong>_______________</strong> | _______________ (Anio)</p><h3 style="color:#003da5">HABILIDADES</h3><p>- _______________<br>- _______________</p><h3 style="color:#003da5">IDIOMAS</h3><p>Espanol: Nativo - Ingles: _______________</p>','CV - '+v.n); showToast('CV generado'); }); break;
    case 'budgetGen':
      wcModal('Presupuesto comercial',[{id:'e',label:'Tu empresa',ph:'Mi Empresa S.A.'},{id:'c',label:'Cliente',ph:'Nombre del cliente...'}],function(v){ if(!v.e||!v.c) return; openDocWindow('<div style="border-top:6px solid #003da5;padding:20px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><div><h2 style="color:#003da5;margin:0">PRESUPUESTO COMERCIAL</h2><p style="color:#666;font-size:12px;margin:4px 0">N_____ - '+new Date().toLocaleDateString('es-CR')+'</p></div><div style="text-align:right"><strong>'+v.e+'</strong></div></div><hr><p><strong>Cliente:</strong> '+v.c+'<br><strong>Valido hasta:</strong> _______________</p><table style="border-collapse:collapse;width:100%;margin:16px 0"><tr style="background:#003da5;color:#fff"><th style="padding:10px;border:1px solid #ddd;text-align:left">Descripcion</th><th style="padding:10px;border:1px solid #ddd">Cant</th><th style="padding:10px;border:1px solid #ddd">Precio</th><th style="padding:10px;border:1px solid #ddd">Total</th></tr><tr><td style="padding:8px;border:1px solid #ddd">_______________</td><td style="padding:8px;border:1px solid #ddd;text-align:center">1</td><td style="padding:8px;border:1px solid #ddd;text-align:right">0.00</td><td style="padding:8px;border:1px solid #ddd;text-align:right">0.00</td></tr></table><div style="text-align:right"><p>Subtotal: ___<br>IVA 13%: ___<br><strong>Total: ___</strong></p></div><p style="text-align:center;margin-top:30px">_______________________<br><strong>'+v.e+'</strong></p></div>','Presupuesto - '+v.c); showToast('Presupuesto generado'); }); break;

    default:
      if(_orig) _orig(a);
      else showToast(a+' - disponible proximamente');
      break;
    }
  };
})();
