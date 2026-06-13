/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.38 — 5 FEATURES
   1. Firma electrónica con canvas
   2. Generador de códigos QR personalizados
   3. Panel de historial de búsquedas
   4. Lector de documentos PDF
   5. Exportar a Markdown
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 1: FIRMA ELECTRÓNICA CANVAS
   ═══════════════════════════════════ */

function openSignatureCanvas() {
  const old = document.getElementById('__sigPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__sigPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">✍️ Firma electrónica</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Dibujá tu firma con el dedo o el mouse</div>

    <div style="margin-bottom:10px">
      <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
        <label style="font-size:11px;font-weight:700;color:#555;align-self:center">Color:</label>
        ${['#000000','#003da5','#1a2942','#27ae60','#e74c3c'].map(c=>`
          <button onclick="window.__sigColor='${c}';document.querySelectorAll('.__sigColorBtn').forEach(b=>b.style.outline='none');this.style.outline='3px solid ${c}'" class="__sigColorBtn"
            style="width:24px;height:24px;border-radius:50%;background:${c};border:none;cursor:pointer;${c==='#000000'?'outline:3px solid #000':''};transition:all .15s"></button>`).join('')}
        <label style="font-size:11px;font-weight:700;color:#555;align-self:center;margin-left:8px">Grosor:</label>
        <input type="range" id="__sigSize" min="1" max="6" value="2" style="width:80px;accent-color:#003da5">
      </div>
      <canvas id="__sigCanvas" width="436" height="180"
        style="border:2px solid #e0e0e0;border-radius:10px;cursor:crosshair;touch-action:none;width:100%;background:#fafafa;display:block"></canvas>
      <div style="font-size:10px;color:#bbb;text-align:center;margin-top:4px">Dibujá tu firma arriba</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Nombre (opcional)</label>
        <input type="text" id="__sigName" placeholder="Juan Pérez"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cargo</label>
        <input type="text" id="__sigCargo" placeholder="Gerente General"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="__sigClear()" style="flex:1;padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">🗑 Borrar</button>
      <button onclick="document.getElementById('__sigPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__sigInsert()" style="flex:2;padding:10px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">✍️ Insertar firma</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  window.__sigColor   = '#000000';
  window.__sigDrawing = false;

  setTimeout(() => {
    const canvas = document.getElementById('__sigCanvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    ctx.strokeStyle = window.__sigColor;
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const client = e.touches ? e.touches[0] : e;
      return { x: (client.clientX - rect.left) * scaleX, y: (client.clientY - rect.top) * scaleY };
    };

    canvas.addEventListener('mousedown',  e => { window.__sigDrawing=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); });
    canvas.addEventListener('mousemove',  e => { if(!window.__sigDrawing) return; const p=getPos(e); ctx.strokeStyle=window.__sigColor; ctx.lineWidth=parseInt(document.getElementById('__sigSize')?.value||2); ctx.lineTo(p.x,p.y); ctx.stroke(); });
    canvas.addEventListener('mouseup',    () => { window.__sigDrawing=false; });
    canvas.addEventListener('touchstart', e => { e.preventDefault(); window.__sigDrawing=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); }, {passive:false});
    canvas.addEventListener('touchmove',  e => { e.preventDefault(); if(!window.__sigDrawing) return; const p=getPos(e); ctx.strokeStyle=window.__sigColor; ctx.lineWidth=parseInt(document.getElementById('__sigSize')?.value||2); ctx.lineTo(p.x,p.y); ctx.stroke(); }, {passive:false});
    canvas.addEventListener('touchend',   () => { window.__sigDrawing=false; });
  }, 100);
}

function __sigClear() {
  const canvas = document.getElementById('__sigCanvas');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function __sigInsert() {
  const canvas = document.getElementById('__sigCanvas');
  if (!canvas) return;
  const dataURL = canvas.toDataURL('image/png');
  const name    = document.getElementById('__sigName')?.value.trim() || '';
  const cargo   = document.getElementById('__sigCargo')?.value.trim() || '';
  const fecha   = new Date().toLocaleDateString('es-CR');

  const html = `
  <div style="display:inline-block;border-top:1px solid #333;padding-top:8px;margin-top:30px;text-align:center;font-family:Calibri,Arial,sans-serif">
    <img src="${dataURL}" alt="Firma electrónica" style="max-width:200px;max-height:80px;display:block;margin:0 auto 4px">
    ${name?`<div style="font-size:11pt;font-weight:600">${name}</div>`:''}
    ${cargo?`<div style="font-size:10pt;color:#555">${cargo}</div>`:''}
    <div style="font-size:9pt;color:#aaa">${fecha}</div>
    <div style="font-size:8pt;color:#bbb">Firma electrónica · WC Corporate Editor</div>
  </div>`;

  if (typeof insertHTML === 'function') insertHTML(html);
  document.getElementById('__sigPanel').remove();
  showToast('✍️ Firma insertada ✅');
}


/* ═══════════════════════════════════
   FEATURE 2: GENERADOR QR PERSONALIZADO
   ═══════════════════════════════════ */

function openQRGenerator() {
  const old = document.getElementById('__qrGenPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__qrGenPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📱 Generador de QR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Códigos QR personalizados</div>

    <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
      ${[['url','🔗 URL'],['whatsapp','💬 WhatsApp'],['email','📧 Email'],['tel','📞 Teléfono'],['texto','📝 Texto'],['vcard','👤 vCard']].map(([v,l],i)=>`
        <button onclick="__qrType='${v}';document.querySelectorAll('.__qrTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';});this.style.borderColor='#1a2942';this.style.background='#f0f7ff';__qrUpdatePlaceholder()" class="__qrTypeBtn"
          style="padding:5px 10px;border:1.5px solid ${i===0?'#1a2942':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s">
          ${l}
        </button>`).join('')}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Contenido del QR *</label>
      <input type="text" id="__qrContent" placeholder="https://kacn1z-del.github.io/wc-editorpro"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__qrGenerate()">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Color del QR</label>
        <input type="color" id="__qrColor" value="#000000" style="width:100%;height:36px;border:1.5px solid #eee;border-radius:8px;cursor:pointer" oninput="__qrGenerate()">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tamaño</label>
        <select id="__qrSize" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none" onchange="__qrGenerate()">
          <option value="150">Pequeño (150px)</option>
          <option value="200" selected>Mediano (200px)</option>
          <option value="300">Grande (300px)</option>
        </select>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:14px;min-height:210px;display:flex;align-items:center;justify-content:center">
      <div id="__qrPreview" style="background:#f8f9fa;border-radius:12px;padding:16px;display:inline-block">
        <div style="color:#bbb;font-size:12px">Ingresá contenido para generar</div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__qrGenPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__qrDownload()" style="flex:1;padding:10px;border:1.5px solid #1a2942;background:#fff;color:#1a2942;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">💾 Descargar</button>
      <button onclick="__qrInsertDoc()" style="flex:1;padding:10px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">📥 Insertar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  window.__qrType = 'url';
}

function __qrUpdatePlaceholder() {
  const inp = document.getElementById('__qrContent');
  if (!inp) return;
  const placeholders = {
    url:'https://kacn1z-del.github.io/wc-editorpro', whatsapp:'50688881234',
    email:'contacto@empresa.cr', tel:'+50688881234',
    texto:'Tu mensaje aquí', vcard:'BEGIN:VCARD\nFN:Juan Pérez\nTEL:+50688881234\nEND:VCARD'
  };
  inp.placeholder = placeholders[window.__qrType]||'';
}

function __qrGenerate() {
  const content = document.getElementById('__qrContent')?.value.trim();
  const color   = document.getElementById('__qrColor')?.value || '#000000';
  const size    = parseInt(document.getElementById('__qrSize')?.value)||200;
  const prev    = document.getElementById('__qrPreview');
  if (!content || !prev) return;

  let qrData = content;
  if (window.__qrType==='whatsapp') qrData = 'https://wa.me/' + content.replace(/\D/g,'');
  if (window.__qrType==='email')    qrData = 'mailto:' + content;
  if (window.__qrType==='tel')      qrData = 'tel:' + content;

  const colorHex = color.replace('#','');
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}&color=${colorHex}&bgcolor=ffffff&qzone=1&format=png`;

  prev.innerHTML = `<img id="__qrImg" src="${url}" alt="QR Code" style="border-radius:8px;display:block" width="${size}" height="${size}" crossorigin="anonymous">`;
  window.__qrURL = url;
  window.__qrData= qrData;
}

function __qrDownload() {
  const url = window.__qrURL;
  if (!url) { showToast('Generá un QR primero'); return; }
  const a   = document.createElement('a');
  a.href    = url; a.download = 'qr-code.png'; a.target='_blank'; a.click();
  showToast('💾 QR descargado ✅');
}

function __qrInsertDoc() {
  const url  = window.__qrURL;
  const data = window.__qrData;
  if (!url) { showToast('Generá un QR primero'); return; }
  const size = parseInt(document.getElementById('__qrSize')?.value)||200;
  const html = `<figure style="display:inline-block;text-align:center;margin:10px"><img src="${url}" alt="QR Code" style="border-radius:6px;display:block" width="${size}"><figcaption style="font-size:9pt;color:#888;margin-top:4px">📱 ${data.slice(0,40)}${data.length>40?'...':''}</figcaption></figure>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__qrGenPanel').remove();
  showToast('📱 QR insertado ✅');
}


/* ═══════════════════════════════════
   FEATURE 3: HISTORIAL DE BÚSQUEDAS
   ═══════════════════════════════════ */

const WC_SEARCH_HIST = {
  history: JSON.parse(localStorage.getItem('wc-search-hist')||'[]'),
  save()   { localStorage.setItem('wc-search-hist', JSON.stringify(this.history.slice(0,50))); },
  add(q)   { this.history = [q,...this.history.filter(h=>h!==q)].slice(0,50); this.save(); },
  clear()  { this.history=[]; this.save(); }
};

function openSearchHistory() {
  const old = document.getElementById('__srchHistPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__srchHistPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const ed = document.getElementById('editor');

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔍 Búsqueda en el documento</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Buscar y resaltar texto</div>

      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input type="text" id="__srchInput" placeholder="Buscar..."
          style="flex:1;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__srchLive(this.value)" onkeydown="if(event.key==='Enter')__srchFind()">
        <button onclick="__srchFind()" style="padding:10px 16px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🔍</button>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:12px;align-items:center">
        <input type="text" id="__srchReplace" placeholder="Reemplazar con..."
          style="flex:1;padding:8px 12px;border:1.5px solid #eee;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#eee'">
        <button onclick="__srchReplaceOne()" style="padding:8px 10px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;white-space:nowrap">1 vez</button>
        <button onclick="__srchReplaceAll()" style="padding:8px 10px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap">Todo</button>
      </div>

      <div id="__srchResults" style="font-size:11px;color:#888;margin-bottom:10px"></div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#555"><input type="checkbox" id="__srchCase" style="accent-color:#0084ff"> Mayúsculas</label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#555"><input type="checkbox" id="__srchWord" style="accent-color:#0084ff"> Palabra exacta</label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#555"><input type="checkbox" id="__srchRegex" style="accent-color:#0084ff"> Regex</label>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px">
      ${WC_SEARCH_HIST.history.length ? `
      <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;display:flex;justify-content:space-between">
        <span>Historial</span>
        <button onclick="WC_SEARCH_HIST.clear();openSearchHistory()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:10px;font-weight:600">Limpiar</button>
      </div>
      ${WC_SEARCH_HIST.history.map(h=>`
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f5f5f5;cursor:pointer"
          onclick="document.getElementById('__srchInput').value='${h.replace(/'/g,"\\'")}';__srchFind()">
          <span style="color:#bbb;font-size:14px">🕐</span>
          <span style="flex:1;font-size:13px;color:#333">${h}</span>
          <span style="font-size:12px;color:#aaa">→</span>
        </div>`).join('')}` : '<div style="text-align:center;padding:20px;color:#bbb;font-size:13px">Sin historial de búsquedas</div>'}
    </div>

    <div style="padding:12px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="__srchClear();document.getElementById('__srchHistPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) { __srchClear(); ov.remove(); } });
  setTimeout(() => document.getElementById('__srchInput')?.focus(), 100);
  window.__srchMatches = [];
  window.__srchIdx     = 0;
}

function __srchLive(q) {
  if (q.length < 2) { __srchClear(); return; }
  clearTimeout(window.__srchTimer);
  window.__srchTimer = setTimeout(() => __srchFind(true), 400);
}

function __srchFind(live) {
  const q      = document.getElementById('__srchInput')?.value;
  const cs     = document.getElementById('__srchCase')?.checked;
  const wd     = document.getElementById('__srchWord')?.checked;
  const rx     = document.getElementById('__srchRegex')?.checked;
  const res    = document.getElementById('__srchResults');
  const ed     = document.getElementById('editor');
  if (!q||!ed) return;
  if (!live) WC_SEARCH_HIST.add(q);

  __srchClear();

  let pattern;
  try {
    let p = rx ? q : q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    if (wd) p = `\\b${p}\\b`;
    pattern = new RegExp(p, cs?'g':'gi');
  } catch(e) { if (res) res.textContent='Regex inválido'; return; }

  let count = 0;
  const walk = (node) => {
    if (node.nodeType===3) {
      const matches = [...node.textContent.matchAll(pattern)];
      if (!matches.length) return;
      const frag = document.createDocumentFragment();
      let last   = 0;
      matches.forEach(m => {
        frag.appendChild(document.createTextNode(node.textContent.slice(last, m.index)));
        const mark = document.createElement('mark');
        mark.className = '__srchMark';
        mark.style.cssText = 'background:#fff176;border-radius:2px;';
        mark.textContent   = m[0];
        frag.appendChild(mark);
        last = m.index + m[0].length;
        count++;
      });
      frag.appendChild(document.createTextNode(node.textContent.slice(last)));
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType===1 && !['SCRIPT','STYLE','MARK'].includes(node.tagName)) {
      Array.from(node.childNodes).forEach(walk);
    }
  };
  walk(ed);

  window.__srchMatches = Array.from(ed.querySelectorAll('.__srchMark'));
  if (res) res.textContent = count ? `${count} resultado${count!==1?'s':''}` : 'Sin resultados';
  if (window.__srchMatches[0]) window.__srchMatches[0].scrollIntoView({behavior:'smooth',block:'center'});
}

function __srchClear() {
  const ed = document.getElementById('editor');
  if (!ed) return;
  ed.querySelectorAll('.__srchMark').forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
}

function __srchReplaceOne() {
  const marks   = document.querySelectorAll('.__srchMark');
  const replace = document.getElementById('__srchReplace')?.value||'';
  if (!marks.length) { showToast('Buscá primero'); return; }
  marks[0].replaceWith(document.createTextNode(replace));
  showToast(`✅ 1 reemplazo hecho`);
}

function __srchReplaceAll() {
  const marks   = document.querySelectorAll('.__srchMark');
  const replace = document.getElementById('__srchReplace')?.value||'';
  const count   = marks.length;
  marks.forEach(m => m.replaceWith(document.createTextNode(replace)));
  showToast(`✅ ${count} reemplazos hechos`);
  document.getElementById('__srchHistPanel').remove();
}


/* ═══════════════════════════════════
   FEATURE 4: LECTOR PDF
   ═══════════════════════════════════ */

function openPDFReader() {
  const old = document.getElementById('__pdfReadPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__pdfReadPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,sans-serif';

  ov.innerHTML = `
    <div style="background:#323639;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">📄 Lector de PDF</div>
      <button onclick="document.getElementById('__pdfReadPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">✕</button>
    </div>

    <div id="__pdfDrop" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#525659;cursor:pointer"
      onclick="document.getElementById('__pdfFileInp').click()"
      ondragover="event.preventDefault();this.style.background='#3a3d3f'"
      ondragleave="this.style.background='#525659'"
      ondrop="event.preventDefault();__pdfLoad(event.dataTransfer.files[0])">
      <div style="font-size:48px;margin-bottom:14px">📄</div>
      <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px">Abrí un PDF</div>
      <div style="font-size:12px;color:rgba(255,255,255,.5)">Tocá o arrastrá un archivo PDF</div>
      <input type="file" id="__pdfFileInp" accept=".pdf" style="display:none" onchange="__pdfLoad(this.files[0])">
    </div>

    <div id="__pdfContent" style="display:none;flex:1;overflow-y:auto;background:#525659;padding:16px"></div>

    <div id="__pdfToolbar" style="display:none;background:#323639;padding:8px 16px;display:none;align-items:center;gap:10px;flex-shrink:0">
      <button onclick="__pdfPrev()" style="padding:6px 12px;border:none;background:rgba(255,255,255,.1);color:#fff;border-radius:6px;cursor:pointer">← Anterior</button>
      <span id="__pdfPageInfo" style="flex:1;text-align:center;color:#fff;font-size:12px"></span>
      <button onclick="__pdfNext()" style="padding:6px 12px;border:none;background:rgba(255,255,255,.1);color:#fff;border-radius:6px;cursor:pointer">Siguiente →</button>
      <button onclick="__pdfExtractText()" style="padding:6px 14px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">📋 Extraer texto</button>
    </div>`;

  document.body.appendChild(ov);

  window.__pdfPage  = 1;
  window.__pdfPages = 0;
  window.__pdfDoc   = null;
}

async function __pdfLoad(file) {
  if (!file || file.type !== 'application/pdf') { showToast('Seleccioná un archivo PDF'); return; }

  const drop    = document.getElementById('__pdfDrop');
  const content = document.getElementById('__pdfContent');
  const toolbar = document.getElementById('__pdfToolbar');
  if (drop) drop.style.display = 'none';
  if (content) { content.style.display='block'; content.innerHTML='<div style="text-align:center;color:#fff;padding:40px">⏳ Cargando PDF...</div>'; }

  // Cargar PDF.js desde CDN
  if (!window.pdfjsLib) {
    await new Promise((res,rej) => {
      const s = document.createElement('script');
      s.src   = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload= res; s.onerror=rej;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc      = await window.pdfjsLib.getDocument(arrayBuffer).promise;
  window.__pdfDoc   = pdfDoc;
  window.__pdfPages = pdfDoc.numPages;
  window.__pdfPage  = 1;

  if (toolbar) { toolbar.style.display='flex'; }
  await __pdfRenderPage(1);
  showToast(`📄 PDF cargado: ${pdfDoc.numPages} páginas`);
}

async function __pdfRenderPage(num) {
  if (!window.__pdfDoc) return;
  const page    = await window.__pdfDoc.getPage(num);
  const viewport= page.getViewport({scale: window.innerWidth < 600 ? 0.8 : 1.2});
  const canvas  = document.createElement('canvas');
  canvas.width  = viewport.width;
  canvas.height = viewport.height;
  canvas.style.cssText = 'max-width:100%;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:block;margin:0 auto';
  const ctx     = canvas.getContext('2d');
  await page.render({canvasContext:ctx, viewport}).promise;
  const content = document.getElementById('__pdfContent');
  if (content) content.innerHTML = '';
  content?.appendChild(canvas);
  const info = document.getElementById('__pdfPageInfo');
  if (info) info.textContent = `Página ${num} de ${window.__pdfPages}`;
}

function __pdfPrev() { if(window.__pdfPage>1){ window.__pdfPage--; __pdfRenderPage(window.__pdfPage); } }
function __pdfNext() { if(window.__pdfPage<window.__pdfPages){ window.__pdfPage++; __pdfRenderPage(window.__pdfPage); } }

async function __pdfExtractText() {
  if (!window.__pdfDoc) return;
  showToast('⏳ Extrayendo texto...');
  let fullText = '';
  for (let i=1; i<=Math.min(window.__pdfPages,10); i++) {
    const page    = await window.__pdfDoc.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item=>item.str).join(' ') + '\n\n';
  }
  if (typeof insertHTML==='function') insertHTML('<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.6">' + fullText.replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>') + '</div>');
  document.getElementById('__pdfReadPanel').remove();
  showToast('📋 Texto del PDF extraído ✅');
}


/* ═══════════════════════════════════
   FEATURE 5: EXPORTAR A MARKDOWN
   ═══════════════════════════════════ */

function openMarkdownExport() {
  const old = document.getElementById('__mdExPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  if (!ed) return;

  // Convertir HTML a Markdown
  const htmlToMd = (html) => {
    let md = html;
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__');
    md = md.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '```\n$1\n```\n\n');
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
    md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (m,p1)=>'> '+p1.replace(/<[^>]+>/g,'').trim().replace(/\n/g,'\n> ')+'\n\n');
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '$1\n');
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (m,p1)=>{let i=0;return p1.replace(/- /g,()=>`${++i}. `)+'\n';});
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<hr[^>]*>/gi, '\n---\n\n');
    md = md.replace(/<[^>]+>/g, '');
    md = md.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ');
    md = md.replace(/\n{3,}/g, '\n\n').trim();
    return md;
  };

  const markdown = htmlToMd(ed.innerHTML);

  const ov = document.createElement('div');
  ov.id    = '__mdExPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;flex-direction:column;font-family:-apple-system,sans-serif';

  ov.innerHTML = `
    <div style="background:#1a2942;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1"># Exportar a Markdown</div>
      <button onclick="__mdCopy()" style="padding:6px 12px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">📋 Copiar</button>
      <button onclick="__mdDownload()" style="padding:6px 12px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">💾 Descargar</button>
      <button onclick="document.getElementById('__mdExPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">✕</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px;background:#0d1117">
      <pre id="__mdContent" style="color:#e6edf3;font-size:13px;font-family:'Courier New',monospace;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;margin:0">${markdown.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
    </div>
    <div style="background:#1a2942;padding:8px 16px;font-size:11px;color:#555;display:flex;justify-content:space-between">
      <span>${markdown.split(/\s+/).filter(w=>w).length} palabras · ${markdown.length} caracteres</span>
      <span>GitHub Flavored Markdown (GFM)</span>
    </div>`;

  document.body.appendChild(ov);
  window.__mdContent = markdown;
}

function __mdCopy() {
  navigator.clipboard.writeText(window.__mdContent||'').then(()=>showToast('📋 Markdown copiado ✅'));
}

function __mdDownload() {
  const blob = new Blob([window.__mdContent||''], {type:'text/markdown;charset=utf-8'});
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'documento.md';
  a.click();
  document.getElementById('__mdExPanel').remove();
  showToast('💾 Markdown descargado ✅');
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2538() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'signatureCanvas': openSignatureCanvas(); break;
          case 'qrGenerator':    openQRGenerator();     break;
          case 'searchHistory':  openSearchHistory();   break;
          case 'pdfReader':      openPDFReader();        break;
          case 'mdExport':       openMarkdownExport();  break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.38 ✅ — Firma Canvas, QR, Búsqueda, PDF, Markdown');
  }, 4600);
})();
