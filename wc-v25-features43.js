/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.43 — 5 FEATURES WORD-LEVEL
   1. Corrector ortográfico en tiempo real
   2. Autocompletar palabras
   3. Historial de versiones
   4. Comparar versiones
   5. Texto a voz (Text-to-Speech)
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 1: CORRECTOR ORTOGRÁFICO
   ═══════════════════════════════════ */

const WC_SPELL = {
  active:   false,
  lang:     localStorage.getItem('wc-spell-lang') || 'es',
  timer:    null,
  mistakes: [],

  // Diccionario básico de errores comunes en español
  commonErrors: {
    'aver': 'a ver', 'haber': 'haber', 'haver': 'haber',
    'asia': 'hacia', 'acia': 'hacia', 'allí': 'allí',
    'porqué': 'por qué', 'porque': 'porque',
    'tambien': 'también', 'tb': 'también',
    'q ': 'que ', 'xq': 'por qué', 'xk': 'porque',
    'hiba': 'iba', 'habia': 'había', 'estaba': 'estaba',
    'deveria': 'debería', 'havlar': 'hablar',
    'vuelta': 'vuelta', 'bolver': 'volver',
    'travajo': 'trabajo', 'travajar': 'trabajar',
    'mui': 'muy', 'vien': 'bien', 'saver': 'saber',
    'nesesito': 'necesito', 'nesecito': 'necesito',
    'rreunion': 'reunión', 'reunon': 'reunión',
    'prezidente': 'presidente', 'presedente': 'presidente',
    'grasias': 'gracias', 'gracas': 'gracias',
    'entonses': 'entonces', 'entonce': 'entonces',
    'depsues': 'después', 'despues': 'después',
    'siempre': 'siempre', 'sienpre': 'siempre',
    'amvos': 'ambos', 'ampbos': 'ambos',
    'coseguir': 'conseguir', 'consiguir': 'conseguir',
    'devemos': 'debemos', 'debenos': 'debemos',
    'faborito': 'favorito', 'fabor': 'favor',
    'hechar': 'echar', 'eshar': 'echar',
    'enrrollado': 'enrollado', 'enrrollar': 'enrollar',
    'conosco': 'conozco', 'conosko': 'conozco',
  },

  toggle() {
    this.active = !this.active;
    if (this.active) this._attach();
    else             this._detach();
    showToast(this.active ? '🔤 Corrector activado' : 'Corrector desactivado');
    localStorage.setItem('wc-spell-active', this.active);
  },

  _attach() {
    const ed = document.getElementById('editor');
    if (!ed) return;
    this._handler = () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this._check(), 1000);
    };
    ed.addEventListener('input', this._handler);
    this._check();
    this._showIndicator();
  },

  _detach() {
    const ed = document.getElementById('editor');
    if (ed && this._handler) ed.removeEventListener('input', this._handler);
    clearTimeout(this.timer);
    // Quitar subrayados
    ed?.querySelectorAll('.wc-spell-err').forEach(el => {
      el.replaceWith(document.createTextNode(el.textContent));
    });
    document.getElementById('__spellIndicator')?.remove();
  },

  _check() {
    const ed = document.getElementById('editor');
    if (!ed || !this.active) return;

    // Quitar marcas anteriores
    ed.querySelectorAll('.wc-spell-err,.wc-spell-sug').forEach(el => {
      el.replaceWith(document.createTextNode(el.textContent));
    });

    // Usar la API nativa del navegador si está disponible
    if (ed.spellcheck !== false) {
      ed.spellcheck = true;
      ed.lang       = this.lang;
    }

    // Detectar errores comunes
    this.mistakes = [];
    const walker = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
    const nodes  = [];
    let node;
    while (node = walker.nextNode()) nodes.push(node);

    nodes.forEach(textNode => {
      if (!textNode.parentNode || textNode.parentNode.classList?.contains('wc-spell-err')) return;
      let text = textNode.textContent;
      let modified = false;
      let result   = text;

      Object.entries(this.commonErrors).forEach(([wrong, right]) => {
        const regex = new RegExp('\\b' + wrong + '\\b', 'gi');
        if (regex.test(text)) {
          result   = result.replace(regex, `<mark class="wc-spell-err" style="background:none;border-bottom:2px solid #e74c3c;cursor:pointer;text-decoration:none" title="¿Quisiste decir: ${right}?" onclick="WC_SPELL._suggest(this,'${right}')">${wrong}</mark>`);
          modified = true;
          this.mistakes.push({ wrong, right });
        }
      });

      if (modified) {
        const span  = document.createElement('span');
        span.innerHTML = result;
        textNode.parentNode.replaceChild(span, textNode);
      }
    });

    this._updateIndicator();
  },

  _suggest(el, right) {
    const old = document.getElementById('__spellSuggest'); if (old) old.remove();
    const rect= el.getBoundingClientRect();
    const tip = document.createElement('div');
    tip.id    = '__spellSuggest';
    tip.style.cssText = `position:fixed;top:${rect.bottom+4}px;left:${Math.min(rect.left,window.innerWidth-200)}px;z-index:9999;background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.2);padding:8px;font-family:-apple-system,sans-serif;min-width:160px`;
    tip.innerHTML = `
      <div style="font-size:11px;color:#888;margin-bottom:6px">¿Quisiste decir?</div>
      <div onclick="WC_SPELL._replace(document.querySelector('.wc-spell-err[title*=\\"${right}\\"]'),'${right}');this.closest('#__spellSuggest').remove()"
        style="padding:7px 10px;background:#f0f7ff;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;color:#003da5">
        ✅ ${right}
      </div>
      <div onclick="this.closest('#__spellSuggest').remove()" style="padding:5px 10px;cursor:pointer;font-size:11px;color:#888;text-align:center;margin-top:4px">Ignorar</div>`;
    document.body.appendChild(tip);
    document.addEventListener('click', function handler(e) {
      if (!tip.contains(e.target) && e.target!==el) { tip.remove(); document.removeEventListener('click',handler); }
    });
  },

  _replace(el, right) {
    if (!el) return;
    el.replaceWith(document.createTextNode(right));
    showToast(`✅ "${right}" corregido`);
    this._updateIndicator();
  },

  _showIndicator() {
    const old = document.getElementById('__spellIndicator'); if (old) old.remove();
    const ind = document.createElement('div');
    ind.id    = '__spellIndicator';
    ind.style.cssText = 'position:fixed;bottom:160px;right:12px;z-index:8000;background:#e74c3c;color:#fff;border-radius:20px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:-apple-system,sans-serif';
    ind.innerHTML = '🔤 0 errores';
    ind.onclick   = () => openSpellPanel();
    document.body.appendChild(ind);
  },

  _updateIndicator() {
    const ind = document.getElementById('__spellIndicator');
    if (!ind) return;
    const count = document.getElementById('editor')?.querySelectorAll('.wc-spell-err').length || 0;
    ind.textContent = `🔤 ${count} error${count!==1?'es':''}`;
    ind.style.background = count>0?'#e74c3c':'#27ae60';
  }
};

function openSpellPanel() {
  const old = document.getElementById('__spellPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__spellPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const errors = Array.from(document.getElementById('editor')?.querySelectorAll('.wc-spell-err')||[]);

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔤 Corrector ortográfico</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">${errors.length} posibles errores detectados</div>

    <div style="display:flex;align-items:center;gap:10px;padding:12px;border:1.5px solid ${WC_SPELL.active?'#27ae60':'#eee'};background:${WC_SPELL.active?'#f0fff4':'#fafafa'};border-radius:12px;margin-bottom:14px">
      <div style="font-size:24px">${WC_SPELL.active?'🟢':'⚪'}</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:700">${WC_SPELL.active?'Corrector activo':'Corrector inactivo'}</div><div style="font-size:11px;color:#888">Marca errores comunes con línea roja</div></div>
      <button onclick="WC_SPELL.toggle();document.getElementById('__spellPanel').remove()" style="padding:7px 14px;border:none;background:${WC_SPELL.active?'#e74c3c':'#27ae60'};color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">${WC_SPELL.active?'Apagar':'Activar'}</button>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Idioma</label>
      <div style="display:flex;gap:6px">
        ${[['es','🇨🇷 Español'],['en','🇺🇸 English'],['pt','🇧🇷 Português']].map(([v,l])=>`
          <button onclick="WC_SPELL.lang='${v}';localStorage.setItem('wc-spell-lang','${v}');document.querySelectorAll('.__spellLangBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa'});this.style.borderColor='#003da5';this.style.background='#f0f7ff'" class="__spellLangBtn"
            style="flex:1;padding:8px;border:1.5px solid ${WC_SPELL.lang===v?'#003da5':'#eee'};background:${WC_SPELL.lang===v?'#f0f7ff':'#fafafa'};border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">
            ${l}
          </button>`).join('')}
      </div>
    </div>

    ${errors.length ? `
    <div style="max-height:200px;overflow-y:auto;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">Errores encontrados</div>
      ${errors.map((el,i)=>`
        <div style="display:flex;align-items:center;gap:8px;padding:8px;border:1px solid #fde8e8;background:#fde8e800;border-radius:8px;margin-bottom:5px">
          <div style="flex:1">
            <span style="color:#e74c3c;font-weight:600">${el.textContent}</span>
            <span style="color:#888;font-size:11px"> → ${el.title?.replace('¿Quisiste decir: ','')?.replace('?','')}</span>
          </div>
          <button onclick="WC_SPELL._replace(document.querySelectorAll('.wc-spell-err')[${i}],'${el.title?.replace('¿Quisiste decir: ','')?.replace('?','')||''}');openSpellPanel()" style="padding:4px 10px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">✅</button>
        </div>`).join('')}
      <button onclick="WC_SPELL._fixAll();document.getElementById('__spellPanel').remove()" style="width:100%;padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-top:6px">✅ Corregir todos</button>
    </div>` : '<div style="text-align:center;color:#27ae60;padding:16px;font-size:13px">✅ Sin errores detectados</div>'}

    <button onclick="document.getElementById('__spellPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

WC_SPELL._fixAll = function() {
  document.getElementById('editor')?.querySelectorAll('.wc-spell-err').forEach(el => {
    const right = el.title?.replace('¿Quisiste decir: ','')?.replace('?','');
    if (right) el.replaceWith(document.createTextNode(right));
  });
  showToast('✅ Todos los errores corregidos');
};

// Auto-activar si estaba activo
setTimeout(()=>{ if(localStorage.getItem('wc-spell-active')==='true') WC_SPELL.toggle(); }, 2500);


/* ═══════════════════════════════════
   FEATURE 2: AUTOCOMPLETAR PALABRAS
   ═══════════════════════════════════ */

const WC_AUTOCOMPLETE = {
  active:   false,
  popup:    null,
  words:    [],
  custom:   JSON.parse(localStorage.getItem('wc-autocomplete-words')||'[]'),

  // Vocabulario base español/CR
  vocab: [
    'además','también','aunque','porque','entonces','después','antes','durante',
    'mediante','según','respecto','siguiente','anterior','posterior','importante',
    'necesario','fundamental','específico','general','particular','especial',
    'empresa','organización','institución','departamento','gerencia','dirección',
    'documento','informe','reporte','análisis','resultado','conclusión','recomendación',
    'proyecto','proceso','procedimiento','actividad','objetivo','estrategia','meta',
    'presupuesto','inversión','financiero','económico','administrativo','operativo',
    'Costa Rica','costarricense','nacional','regional','municipal','provincial',
    'Ministerio','Gobierno','República','decreto','resolución','acuerdo','circular',
    'cliente','proveedor','contrato','servicio','producto','calidad','entrega',
    'reunión','sesión','agenda','acta','minuta','convocatoria','asistentes',
    'mediante','conforme','dispuesto','establecido','indicado','señalado',
    'trabajador','empleado','patrono','salario','jornada','vacaciones','aguinaldo',
    'contribuyente','declaración','impuesto','tributario','Hacienda','CCSS',
  ],

  toggle() {
    this.active = !this.active;
    if (this.active) this._attach();
    else             this._detach();
    showToast(this.active ? '💭 Autocompletar activado' : 'Autocompletar desactivado');
  },

  _attach() {
    const ed = document.getElementById('editor');
    if (!ed) return;
    this.words = [...new Set([...this.vocab, ...this.custom])];
    this._handler = (e) => this._onKey(e);
    ed.addEventListener('keyup', this._handler);
  },

  _detach() {
    const ed = document.getElementById('editor');
    if (ed && this._handler) ed.removeEventListener('keyup', this._handler);
    this._hidePopup();
  },

  _onKey(e) {
    if (['ArrowDown','ArrowUp','Enter','Escape','Tab'].includes(e.key)) return;
    const sel  = window.getSelection();
    if (!sel?.rangeCount) return;
    const range= sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType!==3) return;

    const text  = node.textContent.slice(0, range.startOffset);
    const match = text.match(/\b(\w{3,})$/);
    if (!match) { this._hidePopup(); return; }

    const query   = match[1].toLowerCase();
    const matches = this.words.filter(w => w.toLowerCase().startsWith(query) && w.toLowerCase()!==query).slice(0,5);

    if (!matches.length) { this._hidePopup(); return; }
    this._showPopup(matches, range, query);
  },

  _showPopup(matches, range, query) {
    this._hidePopup();
    const rect = range.getBoundingClientRect();
    const pop  = document.createElement('div');
    pop.id     = '__acPopup';
    pop.style.cssText = `position:fixed;top:${rect.bottom+4}px;left:${Math.min(rect.left, window.innerWidth-220)}px;z-index:9999;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.2);overflow:hidden;font-family:-apple-system,sans-serif;min-width:180px`;
    pop.innerHTML = matches.map((w,i)=>`
      <div class="__acItem" onclick="WC_AUTOCOMPLETE._accept('${w}','${query}')"
        style="padding:9px 14px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px;${i===0?'background:#f0f7ff;':''}"
        onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='${i===0?'#f0f7ff':''}'">
        <span style="color:#003da5;font-weight:700">${w.slice(0,query.length)}</span><span style="color:#555">${w.slice(query.length)}</span>
        ${i===0?'<span style="margin-left:auto;font-size:10px;color:#aaa">Tab</span>':''}
      </div>`).join('');
    document.body.appendChild(pop);
    this.popup = pop;

    // Tab para aceptar primera sugerencia
    this._tabHandler = (e) => {
      if (e.key==='Tab') { e.preventDefault(); this._accept(matches[0], query); }
      if (e.key==='Escape') this._hidePopup();
    };
    document.addEventListener('keydown', this._tabHandler);
  },

  _accept(word, query) {
    const ed  = document.getElementById('editor');
    const sel = window.getSelection();
    if (!sel?.rangeCount || !ed) { this._hidePopup(); return; }
    const range = sel.getRangeAt(0);
    const node  = range.startContainer;
    if (node.nodeType!==3) { this._hidePopup(); return; }

    // Reemplazar solo el sufijo que falta
    const suffix = word.slice(query.length);
    const newNode= document.createTextNode(suffix + ' ');
    range.insertNode(newNode);
    // Mover cursor al final
    const newRange = document.createRange();
    newRange.setStartAfter(newNode);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    this._hidePopup();
  },

  _hidePopup() {
    document.getElementById('__acPopup')?.remove();
    if (this._tabHandler) { document.removeEventListener('keydown', this._tabHandler); this._tabHandler=null; }
    this.popup = null;
  },

  addWord(word) {
    if (!word||this.custom.includes(word)) return;
    this.custom.push(word);
    this.words = [...new Set([...this.vocab, ...this.custom])];
    localStorage.setItem('wc-autocomplete-words', JSON.stringify(this.custom));
    showToast(`💭 "${word}" agregado al vocabulario`);
  }
};

function openAutocompletePanel() {
  const old = document.getElementById('__acPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__acPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">💭 Autocompletar palabras</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">${WC_AUTOCOMPLETE.vocab.length + WC_AUTOCOMPLETE.custom.length} palabras en vocabulario</div>

    <div style="display:flex;align-items:center;gap:10px;padding:12px;border:1.5px solid ${WC_AUTOCOMPLETE.active?'#9b59b6':'#eee'};background:${WC_AUTOCOMPLETE.active?'#f5eeff':'#fafafa'};border-radius:12px;margin-bottom:14px">
      <div style="font-size:24px">${WC_AUTOCOMPLETE.active?'🟣':'⚪'}</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:700">${WC_AUTOCOMPLETE.active?'Activo — Presioná Tab para aceptar':'Inactivo'}</div><div style="font-size:11px;color:#888">Sugiere palabras mientras escribís</div></div>
      <button onclick="WC_AUTOCOMPLETE.toggle();document.getElementById('__acPanel').remove()" style="padding:7px 14px;border:none;background:${WC_AUTOCOMPLETE.active?'#e74c3c':'#9b59b6'};color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">${WC_AUTOCOMPLETE.active?'Apagar':'Activar'}</button>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Agregar palabra personalizada</label>
      <div style="display:flex;gap:6px">
        <input type="text" id="__acWordInput" placeholder="ej: costarricense"
          style="flex:1;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#9b59b6'" onblur="this.style.borderColor='#eee'"
          onkeydown="if(event.key==='Enter'){WC_AUTOCOMPLETE.addWord(this.value.trim());this.value=''}">
        <button onclick="WC_AUTOCOMPLETE.addWord(document.getElementById('__acWordInput').value.trim());document.getElementById('__acWordInput').value=''" style="padding:8px 14px;border:none;background:#9b59b6;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+</button>
      </div>
    </div>

    ${WC_AUTOCOMPLETE.custom.length?`
    <div style="background:#f5eeff;border-radius:10px;padding:10px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Palabras personalizadas (${WC_AUTOCOMPLETE.custom.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${WC_AUTOCOMPLETE.custom.map(w=>`<span style="background:#9b59b622;border:1px solid #9b59b644;border-radius:12px;padding:3px 10px;font-size:11px;color:#555">${w}</span>`).join('')}
      </div>
    </div>`:''}

    <div style="background:#f0f7ff;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.7">
      💡 <strong>Cómo usar:</strong> Escribí 3+ letras y aparecerán sugerencias. Presioná <strong>Tab</strong> para aceptar la primera, o hacé click en cualquier sugerencia.
    </div>

    <button onclick="document.getElementById('__acPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}


/* ═══════════════════════════════════
   FEATURE 3: HISTORIAL DE VERSIONES
   ═══════════════════════════════════ */

const WC_VERSIONS = {
  versions: JSON.parse(localStorage.getItem('wc-versions')||'[]'),
  maxVersions: 20,

  save(label) {
    const ed  = document.getElementById('editor');
    if (!ed)  return;
    const ver = {
      id:       Date.now(),
      label:    label || 'Versión ' + new Date().toLocaleString('es-CR'),
      content:  ed.innerHTML,
      words:    ed.innerText.trim().split(/\s+/).filter(w=>w).length,
      created:  Date.now()
    };
    this.versions.unshift(ver);
    if (this.versions.length > this.maxVersions) this.versions.pop();
    localStorage.setItem('wc-versions', JSON.stringify(this.versions));
    showToast(`💾 Versión "${ver.label}" guardada ✅`);
    return ver.id;
  },

  restore(id) {
    const ver = this.versions.find(v=>v.id===id);
    const ed  = document.getElementById('editor');
    if (!ver||!ed) return;
    // Guardar versión actual antes de restaurar
    this.save('Auto-guardado antes de restaurar');
    ed.innerHTML = ver.content;
    showToast(`↩ Versión "${ver.label}" restaurada`);
  },

  delete(id) {
    this.versions = this.versions.filter(v=>v.id!==id);
    localStorage.setItem('wc-versions', JSON.stringify(this.versions));
  },

  autoSave() {
    const ed = document.getElementById('editor');
    if (!ed) return;
    const words = ed.innerText.trim().split(/\s+/).filter(w=>w).length;
    if (words < 10) return;
    this.save('Auto-guardado · ' + new Date().toLocaleTimeString('es-CR'));
  }
};

// Autoguardar cada 5 minutos
setInterval(()=>WC_VERSIONS.autoSave(), 5*60*1000);

function openVersionHistory() {
  const old = document.getElementById('__verPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__verPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2);font-family:-apple-system,sans-serif">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <div style="font-size:17px;font-weight:700;color:#1a2942;flex:1">🕐 Historial de versiones</div>
        <button onclick="WC_VERSIONS.save(prompt('Nombre de esta versión:','')||'Versión manual');openVersionHistory()" style="padding:6px 12px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Guardar ahora</button>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 16px">
      ${WC_VERSIONS.versions.length
        ? WC_VERSIONS.versions.map((v,i)=>`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:12px;border:1.5px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fff'};border-radius:12px;margin-bottom:8px">
            <div style="width:36px;height:36px;border-radius:50%;background:${i===0?'#003da5':'#f0f0f0'};color:${i===0?'#fff':'#888'};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${WC_VERSIONS.versions.length-i}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v.label}</div>
              <div style="font-size:10px;color:#aaa;margin-top:2px">${new Date(v.created).toLocaleString('es-CR')} · ${v.words} palabras</div>
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0">
              <button onclick="WC_VERSIONS.restore(${v.id});document.getElementById('__verPanel').remove()" style="padding:5px 10px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">↩ Restaurar</button>
              <button onclick="WC_VERSIONS.delete(${v.id});openVersionHistory()" style="padding:5px 8px;border:1px solid #eee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;color:#e74c3c">×</button>
            </div>
          </div>`).join('')
        : '<div style="text-align:center;padding:30px;color:#bbb;font-size:13px">🕐 Sin versiones guardadas.<br><small>Se guarda automáticamente cada 5 minutos.</small></div>'}
    </div>

    <div style="padding:10px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__verPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}


/* ═══════════════════════════════════
   FEATURE 4: COMPARAR VERSIONES
   ═══════════════════════════════════ */

function openVersionCompare() {
  const old = document.getElementById('__compPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__compPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;flex-direction:column;font-family:-apple-system,sans-serif';

  ov.innerHTML = `
    <div style="background:#1a2942;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">🔀 Comparar versiones</div>
      <button onclick="document.getElementById('__compPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">✕</button>
    </div>

    <div style="background:#252540;padding:10px 16px;display:flex;gap:10px;align-items:center;flex-shrink:0">
      <div style="flex:1">
        <label style="font-size:10px;color:rgba(255,255,255,.5);display:block;margin-bottom:3px">VERSIÓN ANTERIOR</label>
        <select id="__compV1" style="width:100%;padding:7px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:7px;color:#fff;font-size:12px;outline:none">
          ${WC_VERSIONS.versions.map((v,i)=>`<option value="${i}">${v.label}</option>`).join('')}
        </select>
      </div>
      <div style="color:#aaa;font-size:20px;flex-shrink:0">⟷</div>
      <div style="flex:1">
        <label style="font-size:10px;color:rgba(255,255,255,.5);display:block;margin-bottom:3px">VERSIÓN NUEVA</label>
        <select id="__compV2" style="width:100%;padding:7px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:7px;color:#fff;font-size:12px;outline:none">
          <option value="current">Documento actual</option>
          ${WC_VERSIONS.versions.map((v,i)=>`<option value="${i}">${v.label}</option>`).join('')}
        </select>
      </div>
      <button onclick="__runCompare()" style="padding:8px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;flex-shrink:0">Comparar</button>
    </div>

    <div id="__compResult" style="flex:1;overflow:auto;padding:12px 16px;background:#1a1a2e;display:grid;grid-template-columns:1fr 1fr;gap:12px"></div>

    <div style="background:#252540;padding:8px 16px;font-size:11px;color:#666;flex-shrink:0">
      <span id="__compStats">Seleccioná dos versiones y hacé click en Comparar</span>
    </div>`;

  document.body.appendChild(ov);
  if (!WC_VERSIONS.versions.length) {
    document.getElementById('__compResult').innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#666;padding:40px">Sin versiones guardadas. Guardá versiones desde el Historial.</div>';
  }
}

function __runCompare() {
  const v1Idx  = document.getElementById('__compV1')?.value;
  const v2Val  = document.getElementById('__compV2')?.value;
  const ed     = document.getElementById('editor');
  const result = document.getElementById('__compResult');
  const stats  = document.getElementById('__compStats');
  if (!result) return;

  const v1 = WC_VERSIONS.versions[parseInt(v1Idx)];
  const v2 = v2Val==='current'
    ? { label:'Documento actual', content:ed?.innerHTML||'' }
    : WC_VERSIONS.versions[parseInt(v2Val)];

  if (!v1||!v2) { showToast('Seleccioná versiones válidas'); return; }

  const text1 = v1.content.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const text2 = v2.content.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

  const words1 = text1.split(/\s+/).length;
  const words2 = text2.split(/\s+/).length;
  const diff   = words2 - words1;

  if (stats) stats.textContent = `${v1.label} (${words1} palabras) vs ${v2.label} (${words2} palabras) · Diferencia: ${diff>0?'+':''}${diff} palabras`;

  // Diff simple por párrafos
  const paras1 = text1.split(/\.\s+/).filter(p=>p.trim().length>10);
  const paras2 = text2.split(/\.\s+/).filter(p=>p.trim().length>10);

  result.innerHTML = `
    <div style="background:#1a2942;border-radius:10px;padding:12px;overflow-y:auto;max-height:calc(100vh - 200px)">
      <div style="font-size:11px;font-weight:700;color:#e74c3c;margin-bottom:8px;text-transform:uppercase">${v1.label}</div>
      ${paras1.map(p=>`<p style="font-size:12px;color:#ddd;line-height:1.6;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.05)">${p}.</p>`).join('')}
    </div>
    <div style="background:#1a2942;border-radius:10px;padding:12px;overflow-y:auto;max-height:calc(100vh - 200px)">
      <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:8px;text-transform:uppercase">${v2.label}</div>
      ${paras2.map((p,i)=>{
        const isNew = !paras1.some(p1=>p1.includes(p.slice(0,30)));
        return `<p style="font-size:12px;color:${isNew?'#2ecc71':'#ddd'};line-height:1.6;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.05);${isNew?'background:rgba(46,204,113,.1);border-radius:4px;padding:6px;':''}">${p}.</p>`;
      }).join('')}
    </div>`;
}


/* ═══════════════════════════════════
   FEATURE 5: TEXTO A VOZ (TTS)
   ═══════════════════════════════════ */

const WC_TTS = {
  synth:    window.speechSynthesis,
  utterance:null,
  playing:  false,
  paused:   false,
  voices:   [],
  rate:     parseFloat(localStorage.getItem('wc-tts-rate')||'1'),
  pitch:    parseFloat(localStorage.getItem('wc-tts-pitch')||'1'),
  voiceIdx: parseInt(localStorage.getItem('wc-tts-voice')||'0'),

  init() {
    if (!this.synth) return false;
    this.voices = this.synth.getVoices().filter(v=>v.lang.startsWith('es')||v.lang.startsWith('en'));
    if (!this.voices.length) {
      this.synth.addEventListener('voiceschanged', ()=>{
        this.voices = this.synth.getVoices().filter(v=>v.lang.startsWith('es')||v.lang.startsWith('en'));
      });
    }
    return true;
  },

  speak(text) {
    if (!this.synth) { showToast('Tu navegador no soporta texto a voz'); return; }
    this.stop();
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate  = this.rate;
    this.utterance.pitch = this.pitch;
    if (this.voices[this.voiceIdx]) this.utterance.voice = this.voices[this.voiceIdx];
    this.utterance.onstart  = ()=>{ this.playing=true; this._updatePanel(); };
    this.utterance.onend    = ()=>{ this.playing=false; this.paused=false; this._updatePanel(); };
    this.utterance.onerror  = ()=>{ this.playing=false; this._updatePanel(); };
    this.synth.speak(this.utterance);
    this.playing = true;
  },

  pause() {
    if (this.playing && !this.paused) { this.synth.pause(); this.paused=true; this._updatePanel(); }
  },

  resume() {
    if (this.paused) { this.synth.resume(); this.paused=false; this._updatePanel(); }
  },

  stop() {
    this.synth.cancel(); this.playing=false; this.paused=false; this._updatePanel();
  },

  toggle() {
    if (this.playing && !this.paused) this.pause();
    else if (this.paused) this.resume();
    else this._startFromEditor();
  },

  _startFromEditor() {
    const ed   = document.getElementById('editor');
    const sel  = window.getSelection()?.toString().trim();
    const text = sel || ed?.innerText?.trim() || '';
    if (!text) { showToast('El documento está vacío'); return; }
    this.speak(text);
    this._showPlayerPanel();
  },

  _showPlayerPanel() {
    const old = document.getElementById('__ttsPlayer'); if (old) old.remove();
    const p   = document.createElement('div');
    p.id      = '__ttsPlayer';
    p.style.cssText = 'position:fixed;bottom:160px;left:50%;transform:translateX(-50%);z-index:9000;background:#1a2942;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.3);padding:12px 20px;display:flex;align-items:center;gap:12px;font-family:-apple-system,sans-serif;min-width:240px';
    p.innerHTML = `
      <div style="font-size:16px">🔊</div>
      <div style="flex:1">
        <div id="__ttsStatus" style="font-size:12px;font-weight:600;color:#fff">Leyendo...</div>
        <div style="font-size:10px;color:rgba(255,255,255,.5)">Velocidad: ${this.rate}x</div>
      </div>
      <button id="__ttsPlayBtn" onclick="WC_TTS.toggle()" style="width:36px;height:36px;border:none;background:#0084ff;color:#fff;border-radius:50%;cursor:pointer;font-size:16px">⏸</button>
      <button onclick="WC_TTS.stop();document.getElementById('__ttsPlayer').remove()" style="width:36px;height:36px;border:none;background:rgba(255,255,255,.1);color:#fff;border-radius:50%;cursor:pointer;font-size:14px">■</button>`;
    document.body.appendChild(p);
  },

  _updatePanel() {
    const btn = document.getElementById('__ttsPlayBtn');
    const sta = document.getElementById('__ttsStatus');
    if (btn) btn.textContent = this.paused ? '▶' : this.playing ? '⏸' : '▶';
    if (sta) sta.textContent = this.paused ? 'Pausado' : this.playing ? 'Leyendo...' : 'Detenido';
    if (!this.playing && !this.paused) document.getElementById('__ttsPlayer')?.remove();
  }
};

WC_TTS.init();

function openTTSPanel() {
  const old = document.getElementById('__ttsPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__ttsPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const voices = WC_TTS.synth ? WC_TTS.synth.getVoices().filter(v=>v.lang.startsWith('es')||v.lang.startsWith('en')) : [];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔊 Texto a voz</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Lee el documento en voz alta</div>

    ${!window.speechSynthesis?`<div style="background:#fde8e8;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#721c24">⚠️ Tu navegador no soporta Text-to-Speech. Probá con Safari o Chrome.</div>`:`
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Voz (${voices.length} disponibles)</label>
        <select id="__ttsVoice" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none"
          onchange="WC_TTS.voiceIdx=this.selectedIndex;localStorage.setItem('wc-tts-voice',this.selectedIndex)">
          ${voices.map((v,i)=>`<option value="${i}" ${i===WC_TTS.voiceIdx?'selected':''}>${v.name} (${v.lang})</option>`).join('')}
          ${!voices.length?'<option>Sin voces disponibles</option>':''}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Velocidad: <span id="__ttsRateVal">${WC_TTS.rate}x</span></label>
        <input type="range" id="__ttsRate" min="0.5" max="2" step="0.1" value="${WC_TTS.rate}" style="width:100%;accent-color:#0084ff"
          oninput="WC_TTS.rate=parseFloat(this.value);localStorage.setItem('wc-tts-rate',this.value);document.getElementById('__ttsRateVal').textContent=parseFloat(this.value).toFixed(1)+'x'">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tono: <span id="__ttsPitchVal">${WC_TTS.pitch}</span></label>
        <input type="range" id="__ttsPitch" min="0.5" max="2" step="0.1" value="${WC_TTS.pitch}" style="width:100%;accent-color:#0084ff"
          oninput="WC_TTS.pitch=parseFloat(this.value);localStorage.setItem('wc-tts-pitch',this.value);document.getElementById('__ttsPitchVal').textContent=parseFloat(this.value).toFixed(1)">
      </div>
    </div>

    <div style="background:#f0f7ff;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.7">
      💡 Seleccioná texto para leer solo esa parte, o dejá sin selección para leer todo el documento.
    </div>

    <div style="display:flex;gap:8px;margin-bottom:8px">
      <button onclick="WC_TTS._startFromEditor();document.getElementById('__ttsPanel').remove()" style="flex:2;padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🔊 Leer documento</button>
      <button onclick="WC_TTS.stop()" style="flex:1;padding:12px;border:1.5px solid #eee;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">■ Detener</button>
    </div>`}

    <button onclick="document.getElementById('__ttsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2543() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'spellCheck':      openSpellPanel();       break;
          case 'autocomplete':    openAutocompletePanel(); break;
          case 'versionHistory':  openVersionHistory();   break;
          case 'compareVersions': openVersionCompare();   break;
          case 'textToSpeech':    openTTSPanel();         break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.43 ✅ — Spell, Autocomplete, Versiones, Comparar, TTS');
  }, 5100);
})();
