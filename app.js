var u = [], r = [], pp = '', vozActiva = false, recognition, margenActivo = false, pagNum = true, idiomaAct = 'bribri';

var db = {
  bribri: {
    'hola': 'i shka', 'adiós': 'i shkëna', 'buenos días': 'i bua´ra',
    'gracias': 'wëstela', 'sí': 'jë´', 'no': 'ãã', 'agua': 'di´', 'fuego': 'bök',
    'tierra': 'irìria', 'sol': 'dí', 'luna': 'si´wa', 'cielo': 'káñí', 'montaña': 'ká',
    'río': 'di´wo', 'mar': 'di´pla', 'árbol': 'kàl', 'flor': 'wö', 'casa': 'u',
    'comida': 'chkè', 'persona': 'se´', 'niño': 'alà', 'mujer': 'aláköl',
    'hombre': 'wëm', 'mamá': 'mì', 'papá': 'yë', 'amigo': 'yàmipa',
    'corazón': 'wöbla', 'cabeza': 'tsa', 'mano': 'ulà', 'pie': 'klö',
    'perro': 'tsí', 'gato': 'mis', 'pájaro': 'dulù', 'pez': 'namà',
    'serpiente': 'tkabè', 'tigre': 'nàmu', 'uno': 'éköl', 'dos': 'böl',
    'tres': 'mañàt', 'blanco': 'surù', 'negro': 'dulè', 'rojo': 'to',
    'verde': 'sà', 'bueno': 'bua´ë', 'malo': 'sĩ´', 'grande': 'butsè', 'pequeño': 'tsirì',
    'costa rica': 'tso´ irìria', 'chileras': 'bua´ë', 'chonete': 'kà tsirì'
  },
  cabecar: {
    'hola': 'ishkje', 'adiós': 'ishkjena', 'gracias': 'wëstela',
    'sí': 'jë´', 'no': 'ãã', 'agua': 'di´', 'fuego': 'böjk',
    'tierra': 'irìria', 'sol': 'dí', 'luna': 'si´wa', 'árbol': 'kàl', 'casa': 'u',
    'comida': 'chkè', 'persona': 'se´', 'niño': 'alà', 'mujer': 'aláköl',
    'hombre': 'wëm', 'mamá': 'mì', 'papá': 'yë', 'amigo': 'yàmipa',
    'corazón': 'wöbla', 'cabeza': 'tsa', 'mano': 'ulà', 'pie': 'klö',
    'perro': 'tsí', 'gato': 'mis', 'pájaro': 'dulù', 'pez': 'namà',
    'serpiente': 'tkabè', 'tigre': 'nàmu', 'uno': 'éköl', 'dos': 'böl',
    'tres': 'mañàt', 'blanco': 'surù', 'negro': 'dulè', 'rojo': 'to',
    'verde': 'sà', 'bueno': 'bua´ë', 'malo': 'sĩ´', 'grande': 'butsè', 'pequeño': 'tsirì',
    'costa rica': 'tso´ irìria', 'chileras': 'bua´ë', 'chonete': 'kà tsirì'
  }
};

var plantillas = {
  blanco:  '<p>Escribí aquí, usá 🎙️ para dictar, 🤖 para IA o 🎨 WC ARTE...</p>',
  ensayo: '<h1 style="text-align:center;color:#002B7F;">Ensayo Universitario</h1><h2>Introducción</h2><p>El presente ensayo...</p><h2>Desarrollo</h2><p>...</p><h2>Conclusión</h2><p>...</p>',
  contrato: '<h1 style="text-align:center;color:#002B7F;">CONTRATO SIMPLE</h1><p>Entre las partes...</p><p><strong>PRIMERA:</strong>...</p><p><strong>SEGUNDA:</strong>...</p><p><br><br></p><div class="firma" onclick="ifm()">[Click para firmar]</div><p>Firma: _________________</p>',
  indigena: '<h1 style="text-align:center;color:#006847;">🌿 Texto Indígena</h1><p><strong>Bribri:</strong> I shka tso´ irìria</p><p><strong>Español:</strong> Hola Costa Rica</p><p><strong>Cabécar:</strong> Ishkje tso´ irìria</p>',
  chonete: '<h1 style="text-align:center;" class="wc-arte-chonete">Chileras el chonete</h1><p style="text-align:center;font-size:20px;">La expresión más tica 🇨🇷</p><p>Este documento está dedicado a la cultura costarricense y sus expresiones únicas como "chileras el chonete", que significa algo muy bueno, excelente, de calidad.</p>'
};

// Guarda estado para deshacer/rehacer
function gs() {
  var e = document.getElementById('editor');
  u.push(e.innerHTML);
  if (u.length > 50) u.shift();
  r = [];
}

function ac() {
  var t = document.getElementById('editor').innerText || '';
  var p = t.trim().split(/\s+/).filter(function(p){ return p.length > 0; }).length;
  document.getElementById('cp').innerText = 'Palabras: ' + p;
}

function ap() {
  if (!pagNum) return;
  var e = document.getElementById('editor');
  var h = e.scrollHeight;
  var p = Math.ceil(h / 1056);
  document.getElementById('pg').innerText = 'Página: ' + p;
  var nums = e.querySelectorAll('.pag-num');
  nums.forEach(function(n){ n.remove(); });
  for (var i = 1; i <= p; i++) {
    var pn = document.createElement('div');
    pn.className = 'pag-num';
    pn.innerText = i;
    pn.style.top = (i * 1056 - 60) + 'px';
    e.appendChild(pn);
  }
}

function ud() {
  if (u.length > 0) {
    var e = document.getElementById('editor');
    r.push(e.innerHTML);
    e.innerHTML = u.pop();
    ac();
    ap();
  }
}

function rd() {
  if (r.length > 0) {
    var e = document.getElementById('editor');
    u.push(e.innerHTML);
    e.innerHTML = r.pop();
    ac();
    ap();
  }
}

function cb() {
  document.getElementById('backstage').style.display = 'flex';
  document.getElementById('editor-view').style.display = 'none';
}

function ab() {
  document.getElementById('backstage').style.display = 'flex';
  document.getElementById('editor-view').style.display = 'none';
  document.getElementById('vn').style.display = 'none';
  document.getElementById('va').style.display = 'block';
  cd();
}

function ae(tipo) {
  document.getElementById('backstage').style.display = 'none';
  document.getElementById('editor-view').style.display = 'flex';
  var tipo = tipo || 'blanco';
  var plantilla = plantillas[tipo] || plantillas['blanco'];
  document.getElementById('editor').innerHTML = plantilla;
  document.getElementById('nd').innerText = tipo || 'Documento1';
  gs();
  ac();
  ap();
  setTimeout(function(){
    document.getElementById('editor').focus();
  }, 100);
}

function g() {
  var n = document.getElementById('nd').innerText;
  var c = document.getElementById('editor').innerHTML;
  var d = JSON.parse(localStorage.getItem('wcd') || '{}');
  d[n] = { c: c, f: new Date().toLocaleString('es-CR') };
  localStorage.setItem('wcd', JSON.stringify(d));
  alert('✅ Guardado: ' + n);
}

function gc() {
  var n = prompt('Nombre:', document.getElementById('nd').innerText);
  if (n) {
    document.getElementById('nd').innerText = n;
    g();
  }
}

function gn(srv) {
  var n = document.getElementById('nd').innerText;
  var c = document.getElementById('editor').innerHTML;
  var b = new Blob([c], {type: 'text/html'});
  var url = URL.createObjectURL(b);
  var a = document.createElement('a');
  a.href = url;
  a.download = n + '.html';
  a.click();
  if (srv === 'onedrive') {
    alert('☁️ OneDrive: Archivo descargado. Abrí onedrive.live.com → Cargar');
  } else if (srv === 'icloud') {
    alert('🍎 iCloud: Archivo descargado. Abrí icloud.com/iclouddrive → Cargar');
  }
}

function wa() {
  var n = document.getElementById('nd').innerText;
  var t = document.getElementById('editor').innerText;
  var m = '*' + n + '*%0A%0A' + encodeURIComponent(t.substring(0, 1000));
  window.open('https://wa.me/?text=' + m, '_blank');
}

function cd() {
  var l = document.getElementById('ld');
  var d = JSON.parse(localStorage.getItem('wcd') || '{}');
  l.innerHTML = '';
  Object.keys(d).forEach(function(n) {
    var dv = document.createElement('div');
    dv.className = 'doc';
    dv.innerHTML =
      '<div><b>' + n + '</b><br><small>' + d[n].f + '</small></div>' +
      '<button onclick="dd(\'' + n + '\');event.stopPropagation()">Borrar</button>';
    dv.onclick = function() {
      document.getElementById('nd').innerText = n;
      document.getElementById('editor').innerHTML = d[n].c;
      cb();
      ac();
      ap();
    };
    l.appendChild(dv);
  });
}

function dd(n) {
  if (confirm('¿Borrar ' + n + '?')) {
    var d = JSON.parse(localStorage.getItem('wcd') || '{}');
    delete d[n];
    localStorage.setItem('wcd', JSON.stringify(d));
    cd();
  }
}

function cp() {
  var s = window.getSelection();
  if (!s.rangeCount) return;
  pp = s.toString();
  if (pp) {
    alert('📋 Copiado');
  }
}

function pt() {
  if (pp) {
    gs();
    document.execCommand('insertText', false, pp);
    ac();
    ap();
  } else {
    alert('Vacío');
  }
}

function f(tag) {
  var s = window.getSelection();
  if (!s.rangeCount) return;
  gs();
  var r = s.getRangeAt(0);
  if (r.collapsed) return;
  var e = document.createElement(tag);
  e.appendChild(r.extractContents());
  r.insertNode(e);
  ac();
}

function cc() {
  var c = document.getElementById('ct').value;
  var s = window.getSelection();
  if (!s.rangeCount) return;
  gs();
  var r = s.getRangeAt(0);
  if (r.collapsed) return;
  var sp = document.createElement('span');
  sp.style.color = c;
  sp.appendChild(r.extractContents());
  r.insertNode(sp);
  ac();
}

function cs() {
  var c = document.getElementById('cr').value;
  var s = window.getSelection();
  if (!s.rangeCount) return;
  gs();
  var r = s.getRangeAt(0);
  if (r.collapsed) return;
  var m = document.createElement('mark');
  m.style.backgroundColor = c;
  m.appendChild(r.extractContents());
  r.insertNode(m);
  ac();
}

function l() {
  var s = window.getSelection();
  if (!s.rangeCount) return;
  gs();
  var r = s.getRangeAt(0);
  var ul = document.createElement('ul');
  var li = document.createElement('li');
  li.innerHTML = r.toString() || '&nbsp;';
  ul.appendChild(li);
  r.deleteContents();
  r.insertNode(ul);
  ac();
}

function a(d) {
  var s = window.getSelection();
  if (!s.rangeCount) return;
  gs();
  var r = s.getRangeAt(0);
  var n = r.commonAncestorContainer;
  while (n && n.nodeType !== 1) n = n.parentNode;
  while (n && n.tagName !== 'P' && n.tagName !== 'DIV' && n.tagName !== 'H1' && n.tagName !== 'H2') {
    n = n.parentNode;
  }
  if (n && n !== document.getElementById('editor')) {
    n.style.textAlign = d;
  } else {
    var dv = document.createElement('div');
    dv.style.textAlign = d;
    dv.appendChild(r.extractContents());
    r.insertNode(dv);
  }
  ac();
}

function ii() {
  document.getElementById('ii').click();
}

document.getElementById('ii').onchange = function(e) {
  var f = e.target.files[0];
  if (!f) return;
  var rd = new FileReader();
  rd.onload = function(e) {
    gs();
    var i = document.createElement('img');
    i.src = e.target.result;
    i.style.maxWidth = '100%';
    var ed = document.getElementById('editor');
    ed.focus();
    var s = window.getSelection();
    if (s.rangeCount) {
      var r = s.getRangeAt(0);
      r.insertNode(i);
      r.setStartAfter(i);
      r.collapse(true);
      s.removeAllRanges();
      s.addRange(r);
    }
    ac();
  };
  rd.readAsDataURL(f);
};

function it() {
  gs();
  var h = '<table><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>';
  var ed = document.getElementById('editor');
  ed.focus();
  var s = window.getSelection();
  if (s.rangeCount) {
    var r = s.getRangeAt(0);
    var d = document.createElement('div');
    d.innerHTML = h;
    r.insertNode(d.firstChild);
  }
  ac();
}

function rg() {
  margenActivo = !margenActivo;
  document.getElementById('regla').classList.toggle('active');
  document.getElementById('editor').style.padding = margenActivo ? '96px 80px' : '40px';
}

function np() {
  pagNum = !pagNum;
  ap();
}

function ifm() {
  document.getElementById('mfm').classList.add('active');
  initFirma();
}

function cmfm() {
  document.getElementById('mfm').classList.remove('active');
}

function lfm() {
  var c = document.getElementById('cfm');
  var ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
}

function initFirma() {
  var c = document.getElementById('cfm');
  var ctx = c.getContext('2d');
  var d = false;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  c.ontouchstart = function(e) {
    d = true;
    var t = e.touches[0];
    var r = c.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(t.clientX - r.left, t.clientY - r.top);
    e.preventDefault();
  };
  c.ontouchmove = function(e) {
    if (d) {
      var t = e.touches[0];
      var r = c.getBoundingClientRect();
      ctx.lineTo(t.clientX - r.left, t.clientY - r.top);
      ctx.stroke();
      e.preventDefault();
    }
  };
  c.ontouchend = function() {
    d = false;
  };
}

function sfm() {
  var c = document.getElementById('cfm');
  var d = c.toDataURL();
  var i = document.createElement('img');
  i.src = d;
  i.style.maxWidth = '300px';
  i.style.display = 'block';
  i.style.margin = '10px auto';
  var ed = document.getElementById('editor');
  ed.focus();
  var s = window.getSelection();
  if (s.rangeCount) {
    var r = s.getRangeAt(0);
    r.insertNode(i);
  }
  cmfm();
  ac();
}

function tr() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Tu navegador no soporta dictado. Usá Chrome.');
    return;
  }
  if (!vozActiva) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-CR';
    recognition.onresult = function(e) {
      var t = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      if (t) {
        gs();
        document.execCommand('insertText', false, t + ' ');
        ac();
      }
    };
    recognition.onend = function() {
      vozActiva = false;
      document.getElementById('btnVoz').classList.remove('grabando');
    };
    recognition.start();
    vozActiva = true;
    document.getElementById('btnVoz').classList.add('grabando');
    alert('🎙️ Dictado activado. Hablá...');
  } else {
    recognition.stop();
    vozActiva = false;
    document.getElementById('btnVoz').classList.remove('grabando');
  }
}

function mb() {
  document.getElementById('mb').classList.add('active');
  document.getElementById('iai').value = '';
  document.getElementById('ib').focus();
}

function cmb() {
  document.getElementById('mb').classList.remove('active');
}

function eb() {
  var t = document.getElementById('ib').value;
  if (!t) return;
  var e = document.getElementById('editor');
  var h = e.innerHTML;
  var r = new RegExp(t, 'gi');
  var c = (h.match(r) || []).length;
  e.innerHTML = h.replace(r, '<mark>$&</mark>');
  cmb();
  alert('🔍 Encontradas: ' + c);
  setTimeout(function() {
    e.innerHTML = e.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
  }, 3000);
}

function mid() {
  document.getElementById('mid').classList.add('active');
  fb();
}

function cmid() {
  document.getElementById('mid').classList.remove('active');
}

function ci(id) {
  idiomaAct = id;
  document.querySelectorAll('.idioma-tab').forEach(function(t) {
    t.classList.remove('active');
  });
  if (event && event.target) {
    event.target.classList.add('active');
  }
  fb();
}

function fb() {
  var t = document.getElementById('ibr').value.toLowerCase();
  var l = document.getElementById('lb');
  var dic = db[idiomaAct];
  l.innerHTML = '';
  Object.keys(dic).forEach(function(k) {
    if (!t || k.includes(t) || dic[k].includes(t)) {
      var d = document.createElement('div');
      d.className = 'idioma-item';
      d.innerHTML = '<span><b>' + k + '</b></span><span>' + dic[k] + '</span>';
      d.onclick = function() {
        document.getElementById('ibr').value = k;
      };
      l.appendChild(d);
    }
  });
}

function ib() {
  var t = document.getElementById('ibr').value;
  if (t && db[idiomaAct]) {
    gs();
    document.execCommand('insertText', false, t + ' (' + db[idiomaAct][t] + ') ');
    ac();
    cmid();
  } else {
    alert('Seleccioná una palabra del diccionario');
  }
}

function mia() {
  document.getElementById('mia').classList.add('active');
  document.getElementById('iaux').focus();
}

function cmia() {
  document.getElementById('mia').classList.remove('active');
}

function eia() {
  var i = document.getElementById('iai');
  var t = i.value.trim();
  if (!t) return;
  var c = document.getElementById('iac');
  c.innerHTML += '<div class="ia-msg ia-user">' + t + '</div>';
  i.value = '';
  var r = '';
  var txt = t.toLowerCase();
  if (txt.includes('resum') || txt.includes('resume') || txt.includes('resumir')) {
    r = 'Para resumir tu texto: seleccioná el texto en el editor y te ayudo a crear un resumen conciso.';
  } else if (txt.includes('ortogra') || txt.includes('gramatica') || txt.includes('ortografía') || txt.includes('corrector')) {
    r = 'Puedo revisar ortografía. Copiá tu texto en el editor y te ayudo a detectar errores.';
  } else if (txt.includes('expand') || txt.includes('desarrolla') || txt.includes('desarrollar')) {
    r = 'Decime qué idea querés expandir y te ayudo a desarrollarla con más detalle.';
  } else if (txt.includes('traduc') || txt.includes('traducir') || txt.includes('bribri') || txt.includes('cabecar')) {
    r = 'Puedo traducir entre español, bribri y cabécar. ¿Qué frase quieres traducir?';
  } else if (txt.includes('ensayo') || txt.includes('texto') || txt.includes('genera')) {
    r = 'Puedo ayudarte a escribir un ensayo, carta o texto. Dime el tema y el nivel de extensión.';
  } else {
    r = 'Pura vida mae. Soy tu asistente tico. Puedo ayudarte a: corregir ortografía, resumir, expandir texto, traducir a bribri/cabécar, crear ensayos o responder preguntas. ¿Qué ocupás específicamente?';
  }
  setTimeout(function(){
    c.innerHTML += '<div class="ia-msg ia-bot">' + r + '</div>';
    c.scrollTop = c.scrollHeight;
  }, 500);
}

function mwc() {
  document.getElementById('mwc').classList.add('active');
}

function cmwc() {
  document.getElementById('mwc').classList.remove('active');
}

function wcc(txt, est) {
  var c = {
    fuego: 'linear-gradient(45deg,#FF6B35,#F7931E,#FFD23F)',
    tico: 'linear-gradient(45deg,#002B7F,#CE1126,#FFD700)',
    neon: 'linear-gradient(45deg,#5C2D91,#9B59B6,#E91E63)',
    selva: 'linear-gradient(45deg,#006847,#00A651,#8BC34A)',
    metal: 'linear-gradient(45deg,#000,#434343,#999)',
    fiesta: 'linear-gradient(45deg,#FF006E,#FB5607,#FFBE0B)'
  };
  var g = c[est] || c['tico'];
  gs();
  var s = '<span class="wc-arte" style="background:' + g + ';-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">' + txt + '</span>';
  document.execCommand('insertHTML', false, s);
  ac();
  cmwc();
}

function cf() {
  var f = document.getElementById('sf').value;
  var s = window.getSelection();
  if (!s.rangeCount) return;
  gs();
  var r = s.getRangeAt(0);
  if (r.collapsed) return;
  var sp = document.createElement('span');
  sp.style.fontFamily = f;
  sp.appendChild(r.extractContents());
  r.insertNode(sp);
  ac();
}

function ctm() {
  var t = document.getElementById('st').value;
  var s = window.getSelection();
  if (!s.rangeCount) return;
  gs();
  var r = s.getRangeAt(0);
  if (r.collapsed) return;
  var f = document.createElement('font');
  f.size = t;
  f.appendChild(r.extractContents());
  r.insertNode(f);
  ac();
}

function ac() {
  var t = document.getElementById('editor').innerText || '';
  var p = t.trim().split(/\s+/).filter(function(p){ return p.length > 0; }).length;
  document.getElementById('cp').innerText = 'Palabras: ' + p;
}

window.onload = function() {
  document.getElementById('editor').addEventListener('input', function() {
    ac();
    ap();
  });
  ac();
  ap();
  fb();

  document.querySelectorAll('.tab').forEach(function(t) {
    t.onclick = function() {
      document.querySelectorAll('.tab').forEach(function(x){
        x.classList.remove('active');
      });
      document.querySelectorAll('.tools').forEach(function(x){
        x.classList.remove('active');
      });
      t.classList.add('active');
      document.getElementById('tab-' + t.dataset.tab).classList.add('active');
    };
  });
};
