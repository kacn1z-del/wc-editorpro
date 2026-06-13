/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.34 — 5 FEATURES WORD-STYLE
   1. Comentarios estilo Word (globos en margen)
   2. Área de trabajo estilo Word (A4 con sombra)
   3. Regla horizontal con márgenes arrastrables
   4. Panel de estilos rápidos
   5. Vista de impresión / previsualización
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 1: COMENTARIOS ESTILO WORD
   ═══════════════════════════════════ */

const WC_COMMENTS = {
  comments: JSON.parse(localStorage.getItem('wc-comments') || '[]'),
  author:   localStorage.getItem('wc-collab-name') || 'Usuario',
  save()    { localStorage.setItem('wc-comments', JSON.stringify(this.comments)); },

  add(text, selectedText) {
    const id  = 'cm-' + Date.now();
    const num = this.comments.length + 1;
    this.comments.push({
      id, num, text, selectedText,
      author: this.author,
      date:   new Date().toLocaleString('es-CR'),
      resolved: false
    });
    this.save();

    // Marcar texto seleccionado en el editor
    if (selectedText && typeof insertHTML === 'function') {
      const sel = window.getSelection();
      if (sel && sel.toString().trim()) {
        const range = sel.getRangeAt(0);
        const mark  = document.createElement('mark');
        mark.id     = 'cm-mark-' + id;
        mark.style.cssText = 'background:#fff2cc;border-bottom:2px solid #f39c12;cursor:pointer;';
        mark.title  = `Comentario ${num}: ${text}`;
        mark.onclick = () => this.showBubble(id);
        range.surroundContents(mark);
        sel.removeAllRanges();
      }
    }
    this.renderPanel();
    showToast(`💬 Comentario ${num} agregado ✅`);
    return id;
  },

  resolve(id) {
    const c = this.comments.find(c => c.id === id);
    if (c) {
      c.resolved = true;
      this.save();
      const mark = document.getElementById('cm-mark-' + id);
      if (mark) { mark.style.background = '#e8f5e9'; mark.style.borderColor = '#27ae60'; }
      this.renderPanel();
      showToast('✅ Comentario resuelto');
    }
  },

  delete(id) {
    const mark = document.getElementById('cm-mark-' + id);
    if (mark) { mark.replaceWith(...mark.childNodes); }
    this.comments = this.comments.filter(c => c.id !== id);
    this.save();
    this.renderPanel();
    showToast('Comentario eliminado');
  },

  showBubble(id) {
    const c = this.comments.find(c => c.id === id);
    if (!c) return;
    document.querySelectorAll('.wc-cm-bubble').forEach(b => b.remove());
    const mark  = document.getElementById('cm-mark-' + id);
    if (!mark) return;
    const rect  = mark.getBoundingClientRect();
    const bubble= document.createElement('div');
    bubble.className = 'wc-cm-bubble';
    bubble.style.cssText = `position:fixed;top:${Math.min(rect.bottom+4, window.innerHeight-160)}px;left:${Math.min(rect.left, window.innerWidth-260)}px;z-index:9900;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.2);padding:12px;width:240px;border-top:3px solid #f39c12;font-family:-apple-system,sans-serif`;
    bubble.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div style="font-size:11px;font-weight:700;color:#1a2942">${c.author}</div>
        <div style="font-size:9px;color:#aaa">${c.date}</div>
      </div>
      ${c.selectedText?`<div style="font-size:10px;color:#888;background:#f8f9fa;border-radius:4px;padding:4px 6px;margin-bottom:6px;font-style:italic">"${c.selectedText.slice(0,60)}${c.selectedText.length>60?'...':''}"</div>`:''}
      <div style="font-size:12px;color:#333;line-height:1.5;margin-bottom:8px">${c.text}</div>
      <div style="display:flex;gap:5px">
        <button onclick="WC_COMMENTS.resolve('${id}');this.closest('.wc-cm-bubble').remove()" style="flex:1;padding:5px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">✅ Resolver</button>
        <button onclick="WC_COMMENTS.delete('${id}');this.closest('.wc-cm-bubble').remove()" style="flex:1;padding:5px;border:1px solid #eee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;color:#e74c3c">🗑 Eliminar</button>
        <button onclick="this.closest('.wc-cm-bubble').remove()" style="padding:5px 8px;border:1px solid #eee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;color:#aaa">✕</button>
      </div>`;
    document.body.appendChild(bubble);
    document.addEventListener('click', function handler(e) {
      if (!bubble.contains(e.target) && !mark?.contains(e.target)) {
        bubble.remove(); document.removeEventListener('click', handler);
      }
    }, { once: false });
  },

  renderPanel() {
    const panel = document.getElementById('__cmSidePanel');
    if (!panel) return;
    const active = this.comments.filter(c => !c.resolved);
    const resolved = this.comments.filter(c => c.resolved);
    panel.innerHTML = `
      <div style="padding:10px 12px;background:#1a2942;color:#fff;font-size:12px;font-weight:700;display:flex;justify-content:space-between;align-items:center">
        <span>💬 Comentarios (${active.length})</span>
        <button onclick="document.getElementById('__cmSidePanel').style.display='none'" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:16px">✕</button>
      </div>
      <div style="overflow-y:auto;flex:1;padding:8px">
        ${active.length ? active.map(c=>`
          <div style="background:#fff;border-radius:10px;padding:10px;margin-bottom:8px;border-left:3px solid #f39c12;box-shadow:0 1px 4px rgba(0,0,0,.08)">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;font-weight:700;color:#1a2942">${c.num}. ${c.author}</span>
              <span style="font-size:9px;color:#aaa">${c.date.split(',')[0]}</span>
            </div>
            ${c.selectedText?`<div style="font-size:9px;color:#888;font-style:italic;margin-bottom:4px">"${c.selectedText.slice(0,40)}..."</div>`:''}
            <div style="font-size:12px;color:#333;line-height:1.5;margin-bottom:6px">${c.text}</div>
            <div style="display:flex;gap:4px">
              <button onclick="WC_COMMENTS.resolve('${c.id}')" style="flex:1;padding:4px;border:none;background:#27ae60;color:#fff;border-radius:5px;cursor:pointer;font-size:10px">✅</button>
              <button onclick="WC_COMMENTS.delete('${c.id}')" style="flex:1;padding:4px;border:1px solid #eee;background:#fff;border-radius:5px;cursor:pointer;font-size:10px;color:#e74c3c">🗑</button>
            </div>
          </div>`).join('') : '<div style="text-align:center;color:#bbb;padding:16px;font-size:12px">Sin comentarios activos</div>'}
        ${resolved.length ? `<div style="font-size:10px;font-weight:700;color:#27ae60;margin:8px 0 4px">✅ Resueltos (${resolved.length})</div>
          ${resolved.map(c=>`<div style="background:#f0fff4;border-radius:8px;padding:8px;margin-bottom:4px;font-size:11px;color:#888;border-left:3px solid #27ae60">${c.num}. ${c.text.slice(0,40)}...</div>`).join('')}` : ''}
      </div>
      <div style="padding:8px;border-top:1px solid #eee">
        <button onclick="openCommentAdd()" style="width:100%;padding:9px;border:none;background:#f39c12;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+ Agregar comentario</button>
      </div>`;
  }
};

function openCommentAdd() {
  const sel   = window.getSelection()?.toString().trim() || '';
  const old   = document.getElementById('__cmAddPanel'); if (old) old.remove();
  const panel = document.createElement('div');
  panel.id    = '__cmAddPanel';
  panel.style.cssText = 'position:fixed;bottom:140px;right:12px;z-index:9901;background:#fff;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.2);padding:14px;width:260px;border-top:3px solid #f39c12;font-family:-apple-system,sans-serif';
  panel.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:#1a2942;margin-bottom:8px">💬 Nuevo comentario</div>
    ${sel?`<div style="font-size:10px;color:#888;background:#f8f9fa;border-radius:4px;padding:4px 6px;margin-bottom:8px;font-style:italic">"${sel.slice(0,60)}${sel.length>60?'...':''}"</div>`:''}
    <input type="text" id="__cmAuthorInp" value="${WC_COMMENTS.author}" placeholder="Tu nombre"
      style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box;margin-bottom:6px"
      onfocus="this.style.borderColor='#f39c12'" onblur="this.style.borderColor='#eee'">
    <textarea id="__cmTextInp" placeholder="Escribí tu comentario..." rows="3"
      style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none;resize:none;box-sizing:border-box;margin-bottom:8px"
      onfocus="this.style.borderColor='#f39c12'" onblur="this.style.borderColor='#eee'"></textarea>
    <div style="display:flex;gap:6px">
      <button onclick="document.getElementById('__cmAddPanel').remove()" style="flex:1;padding:8px;border:1px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px;color:#555">Cancelar</button>
      <button onclick="__cmSubmit('${sel.replace(/'/g,"\\'").slice(0,100)}')" style="flex:2;padding:8px;border:none;background:#f39c12;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">Comentar</button>
    </div>`;
  document.body.appendChild(panel);
  setTimeout(()=>document.getElementById('__cmTextInp')?.focus(),100);
}

function __cmSubmit(selectedText) {
  const author = document.getElementById('__cmAuthorInp')?.value.trim() || 'Usuario';
  const text   = document.getElementById('__cmTextInp')?.value.trim();
  if (!text) { showToast('Escribí el comentario'); return; }
  WC_COMMENTS.author = author;
  localStorage.setItem('wc-collab-name', author);
  WC_COMMENTS.add(text, selectedText);
  document.getElementById('__cmAddPanel').remove();
  __cmTogglePanel(true);
}

function __cmTogglePanel(forceOpen) {
  let panel = document.getElementById('__cmSidePanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = '__cmSidePanel';
    panel.style.cssText = 'position:fixed;top:70px;right:0;z-index:9000;width:240px;background:#f8f9fa;border-radius:16px 0 0 16px;box-shadow:-4px 4px 24px rgba(0,0,0,.15);display:flex;flex-direction:column;max-height:calc(100vh - 140px);font-family:-apple-system,sans-serif;overflow:hidden';
    document.body.appendChild(panel);
  }
  panel.style.display = (panel.style.display === 'none' || !panel.style.display) || forceOpen ? 'flex' : 'none';
  WC_COMMENTS.renderPanel();
}

function openCommentsPanel() { __cmTogglePanel(); }


/* ═══════════════════════════════════
   FEATURE 2: ÁREA DE TRABAJO ESTILO WORD
   ═══════════════════════════════════ */

const WC_WORDVIEW = {
  active: localStorage.getItem('wc-wordview') === 'true',

  apply() {
    const ed        = document.getElementById('editor');
    const container = ed?.parentElement;
    if (!ed || !container) return;

    if (this.active) {
      // Fondo gris estilo Word
      container.style.cssText += ';background:#e8e8e8;padding:24px 0;min-height:100vh;';
      // Página A4 con sombra
      ed.style.cssText += `
        background:#fff;
        width:21cm;
        max-width:21cm;
        min-height:29.7cm;
        margin:0 auto;
        padding:2.54cm;
        box-shadow:0 2px 12px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.08);
        border-radius:2px;
        box-sizing:border-box;
      `;
      // Añadir indicador de página
      this._addPageIndicator();
      showToast('📄 Vista Word activada');
    } else {
      container.style.background = '';
      container.style.padding    = '';
      ed.style.width    = '';
      ed.style.maxWidth = '';
      ed.style.margin   = '';
      ed.style.boxShadow= '';
      ed.style.borderRadius = '';
      document.getElementById('__wcPageIndicator')?.remove();
      showToast('Vista normal restaurada');
    }
    localStorage.setItem('wc-wordview', this.active);
  },

  toggle() {
    this.active = !this.active;
    this.apply();
  },

  _addPageIndicator() {
    const old = document.getElementById('__wcPageIndicator'); if (old) old.remove();
    const ind = document.createElement('div');
    ind.id = '__wcPageIndicator';
    ind.style.cssText = 'position:fixed;bottom:70px;left:12px;z-index:8000;background:rgba(0,0,0,.6);color:#fff;border-radius:6px;padding:4px 10px;font-size:10px;font-family:-apple-system,sans-serif;pointer-events:none';
    ind.textContent = 'A4 · 21×29.7cm';
    document.body.appendChild(ind);
  }
};

// Aplicar al cargar si estaba activo
setTimeout(() => { if (WC_WORDVIEW.active) WC_WORDVIEW.apply(); }, 1500);


/* ═══════════════════════════════════
   FEATURE 3: REGLA HORIZONTAL MEJORADA
   ═══════════════════════════════════ */

const WC_RULER = {
  leftMargin:  2.54, // cm
  rightMargin: 2.54,
  dragging:    null,
  visible:     localStorage.getItem('wc-ruler') !== 'false',

  init() {
    const old = document.getElementById('__wcRuler'); if (old) old.remove();
    if (!this.visible) return;

    const ruler = document.createElement('div');
    ruler.id    = '__wcRuler';
    ruler.style.cssText = 'position:sticky;top:0;z-index:500;background:#f0f0f0;border-bottom:1px solid #ccc;height:22px;overflow:hidden;user-select:none;font-family:-apple-system,sans-serif';

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:22px;display:block';
    canvas.width  = window.innerWidth;
    canvas.height = 22;
    ruler.appendChild(canvas);

    // Marcadores de margen arrastrables
    const leftHandle  = this._createHandle('left');
    const rightHandle = this._createHandle('right');
    ruler.appendChild(leftHandle);
    ruler.appendChild(rightHandle);

    const ed = document.getElementById('editor');
    if (ed) {
      const parent = ed.parentElement;
      if (parent) parent.insertBefore(ruler, ed);
    } else {
      document.body.insertBefore(ruler, document.body.firstChild);
    }

    this._drawRuler(canvas);
    this._updateHandles();
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      this._drawRuler(canvas);
      this._updateHandles();
    });
  },

  _drawRuler(canvas) {
    const ctx  = canvas.getContext('2d');
    const W    = canvas.width;
    const H    = canvas.height;
    const ppcm = W / 21; // píxeles por cm en A4
    ctx.clearRect(0, 0, W, H);

    // Fondo
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, W, H);

    // Área de márgenes en gris oscuro
    const lPx = this.leftMargin  * ppcm;
    const rPx = W - this.rightMargin * ppcm;
    ctx.fillStyle = '#d8d8d8';
    ctx.fillRect(0, 0, lPx, H);
    ctx.fillRect(rPx, 0, W-rPx, H);

    // Marcas
    ctx.strokeStyle = '#888';
    ctx.fillStyle   = '#666';
    ctx.font        = '8px -apple-system';
    ctx.textAlign   = 'center';

    for (let cm = 0; cm <= 21; cm += 0.5) {
      const x     = cm * ppcm;
      const major = cm % 1 === 0;
      const mid   = cm % 0.5 === 0;
      ctx.beginPath();
      ctx.moveTo(x, major ? 6 : mid ? 10 : 14);
      ctx.lineTo(x, H);
      ctx.stroke();
      if (major && cm > 0 && cm < 21) {
        ctx.fillText(cm.toString(), x, 9);
      }
    }
  },

  _createHandle(side) {
    const h = document.createElement('div');
    h.className      = 'wc-ruler-handle';
    h.dataset.side   = side;
    h.style.cssText  = `position:absolute;top:0;width:10px;height:22px;cursor:col-resize;z-index:10`;
    h.innerHTML      = `<div style="width:3px;height:100%;background:#003da5;margin:0 auto;opacity:.7"></div>`;

    h.addEventListener('mousedown', e => {
      this.dragging = side;
      e.preventDefault();
    });
    h.addEventListener('touchstart', e => {
      this.dragging = side;
    }, {passive:true});

    document.addEventListener('mousemove',  e => this._onDrag(e.clientX));
    document.addEventListener('touchmove',  e => this._onDrag(e.touches[0].clientX), {passive:true});
    document.addEventListener('mouseup',    () => { this.dragging=null; });
    document.addEventListener('touchend',   () => { this.dragging=null; });

    return h;
  },

  _onDrag(clientX) {
    if (!this.dragging) return;
    const ruler  = document.getElementById('__wcRuler');
    if (!ruler) return;
    const rect   = ruler.getBoundingClientRect();
    const ppcm   = rect.width / 21;
    const cm     = (clientX - rect.left) / ppcm;
    if (this.dragging === 'left')  this.leftMargin  = Math.max(0.5, Math.min(5, cm));
    if (this.dragging === 'right') this.rightMargin = Math.max(0.5, Math.min(5, 21 - cm));
    this._updateHandles();
    this._applyMargins();
  },

  _updateHandles() {
    const ruler = document.getElementById('__wcRuler');
    if (!ruler) return;
    const W    = ruler.offsetWidth;
    const ppcm = W / 21;
    const lH   = ruler.querySelector('[data-side="left"]');
    const rH   = ruler.querySelector('[data-side="right"]');
    if (lH) lH.style.left  = (this.leftMargin  * ppcm - 5) + 'px';
    if (rH) rH.style.left  = (W - this.rightMargin * ppcm - 5) + 'px';
    const canvas = ruler.querySelector('canvas');
    if (canvas) this._drawRuler(canvas);
  },

  _applyMargins() {
    const ed = document.getElementById('editor');
    if (ed) {
      ed.style.paddingLeft  = this.leftMargin  + 'cm';
      ed.style.paddingRight = this.rightMargin + 'cm';
    }
  },

  toggle() {
    this.visible = !this.visible;
    localStorage.setItem('wc-ruler', this.visible);
    this.visible ? this.init() : document.getElementById('__wcRuler')?.remove();
    showToast(this.visible ? 'Regla activada' : 'Regla desactivada');
  }
};

setTimeout(() => WC_RULER.init(), 1800);


/* ═══════════════════════════════════
   FEATURE 4: PANEL DE ESTILOS RÁPIDOS
   ═══════════════════════════════════ */

const WC_STYLES = {
  styles: [
    { name:'Normal',    tag:'p',    css:'font-size:12pt;font-family:Calibri,Arial;color:#000;font-weight:normal;margin:0 0 8pt',            preview:'Texto normal' },
    { name:'Título 1',  tag:'h1',   css:'font-size:28pt;font-family:Calibri Light,Calibri;color:#1a2942;font-weight:700;margin:24pt 0 6pt', preview:'Título 1' },
    { name:'Título 2',  tag:'h2',   css:'font-size:16pt;font-family:Calibri Light,Calibri;color:#003da5;font-weight:600;margin:18pt 0 4pt', preview:'Título 2' },
    { name:'Título 3',  tag:'h3',   css:'font-size:13pt;font-family:Calibri,Arial;color:#1a2942;font-weight:600;margin:14pt 0 3pt',         preview:'Título 3' },
    { name:'Subtítulo', tag:'h4',   css:'font-size:11pt;font-family:Calibri,Arial;color:#666;font-weight:600;font-style:italic;margin:10pt 0 2pt', preview:'Subtítulo' },
    { name:'Cita',      tag:'blockquote', css:'font-size:11pt;font-family:Georgia,serif;color:#555;font-style:italic;border-left:3px solid #003da5;padding-left:12pt;margin:10pt 0 10pt 20pt', preview:'Cita destacada' },
    { name:'Código',    tag:'pre',   css:'font-size:10pt;font-family:"Courier New",monospace;background:#f0f0f0;padding:8pt;border-radius:4pt;color:#333;margin:8pt 0', preview:'Código fuente' },
    { name:'Énfasis',   tag:'p',    css:'font-size:12pt;font-family:Calibri;color:#003da5;font-style:italic;margin:0 0 8pt',                preview:'Texto con énfasis' },
    { name:'Importante',tag:'p',    css:'font-size:12pt;font-family:Calibri;font-weight:700;color:#ce1126;margin:0 0 8pt',                  preview:'Texto importante' },
  ],

  apply(idx) {
    const style = this.styles[idx];
    if (!style) return;
    const sel   = window.getSelection();
    if (!sel || !sel.rangeCount) { showToast('Seleccioná texto primero'); return; }
    const range = sel.getRangeAt(0);
    const el    = document.createElement(style.tag);
    el.style.cssText = style.css;
    try {
      range.surroundContents(el);
    } catch(e) {
      // Si hay elementos mixtos, envolver en un bloque
      const frag = range.extractContents();
      el.appendChild(frag);
      range.insertNode(el);
    }
    sel.removeAllRanges();
    showToast(`✅ Estilo "${style.name}" aplicado`);
  }
};

function openStylesPanel() {
  const old = document.getElementById('__stylesPanel'); if (old) { old.remove(); return; }
  const panel = document.createElement('div');
  panel.id    = '__stylesPanel';
  panel.style.cssText = 'position:fixed;top:70px;left:12px;z-index:9000;background:#fff;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.15);width:180px;padding:10px;font-family:-apple-system,sans-serif;max-height:70vh;overflow-y:auto';

  panel.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:#1a2942;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee">🎨 Estilos</div>
    ${WC_STYLES.styles.map((s, i) => `
      <button onclick="WC_STYLES.apply(${i})"
        style="width:100%;padding:7px 8px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;text-align:left;margin-bottom:4px;transition:all .15s"
        onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'"
        onmouseout="this.style.borderColor='#eee';this.style.background='#fff'">
        <div style="${s.css.split(';').filter(r=>r.includes('font-size')||r.includes('color')||r.includes('font-weight')||r.includes('font-style')||r.includes('font-family')).join(';')};display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">
          ${s.preview}
        </div>
        <div style="font-size:9px;color:#aaa;margin-top:2px">${s.name} · &lt;${s.tag}&gt;</div>
      </button>`).join('')}
    <button onclick="document.getElementById('__stylesPanel').remove()" style="width:100%;margin-top:4px;padding:7px;border:none;background:#f0f0f0;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">Cerrar</button>`;

  document.body.appendChild(panel);
  document.addEventListener('click', function handler(e) {
    const p = document.getElementById('__stylesPanel');
    if (p && !p.contains(e.target)) { p.remove(); document.removeEventListener('click', handler); }
  });
}


/* ═══════════════════════════════════
   FEATURE 5: VISTA DE IMPRESIÓN
   ═══════════════════════════════════ */

function openPrintPreview() {
  const old = document.getElementById('__printPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  if (!ed)  return;

  const ov  = document.createElement('div');
  ov.id     = '__printPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#525659;display:flex;flex-direction:column;font-family:-apple-system,sans-serif;overflow:auto';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'background:#323639;color:#fff;padding:10px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;position:sticky;top:0;z-index:1';
  toolbar.innerHTML = `
    <button onclick="document.getElementById('__printPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:13px">✕ Cerrar</button>
    <span style="flex:1;text-align:center;font-size:13px;opacity:.7">Vista previa de impresión · A4</span>
    <select id="__printZoom" onchange="__printZoom(this.value)" style="padding:5px 8px;border:none;border-radius:6px;background:rgba(255,255,255,.15);color:#fff;font-size:12px;outline:none">
      <option value="50">50%</option>
      <option value="75">75%</option>
      <option value="100" selected>100%</option>
      <option value="125">125%</option>
    </select>
    <button onclick="window.print()" style="background:#27ae60;border:none;color:#fff;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:13px;font-weight:600">🖨️ Imprimir</button>`;
  ov.appendChild(toolbar);

  // Contenido
  const content = document.createElement('div');
  content.style.cssText = 'flex:1;padding:24px;display:flex;justify-content:center;overflow-y:auto';

  const page = document.createElement('div');
  page.id    = '__printPage';
  page.style.cssText = 'background:#fff;width:21cm;min-height:29.7cm;padding:2.54cm;box-shadow:0 4px 24px rgba(0,0,0,.4);border-radius:2px;box-sizing:border-box;transform-origin:top center;';
  page.innerHTML = ed.innerHTML;
  content.appendChild(page);
  ov.appendChild(content);
  document.body.appendChild(ov);

  // Agregar estilos de impresión
  const style = document.createElement('style');
  style.id = '__printStyles';
  style.textContent = `
    @media print {
      body > *:not(#__printPanel) { display: none !important; }
      #__printPanel { position: static !important; background: #fff !important; }
      #__printPanel > div:first-child { display: none !important; }
      #__printPage { box-shadow: none !important; width: 100% !important; }
    }`;
  document.head.appendChild(style);
}

function __printZoom(pct) {
  const page = document.getElementById('__printPage');
  if (page) page.style.transform = `scale(${parseInt(pct)/100})`;
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2534() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'comments':      openCommentsPanel(); break;
          case 'addComment':    openCommentAdd();    break;
          case 'wordView':      WC_WORDVIEW.toggle(); break;
          case 'ruler':         WC_RULER.toggle();   break;
          case 'stylesPanel':   openStylesPanel();   break;
          case 'printPreview':  openPrintPreview();  break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.34 ✅ — Comentarios, Vista Word, Regla, Estilos, Vista Impresión');
  }, 4200);
})();
