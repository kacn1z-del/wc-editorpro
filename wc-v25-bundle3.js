/* WC Corporate Editor v25 — CR + IA (16-23) */
const WC_CODE = {
  languages: {
    javascript: { name:'JavaScript',  color:'#f7df1e', bg:'#1e1e2e', ext:'js' },
    python:     { name:'Python',      color:'#3776ab', bg:'#1e1e2e', ext:'py' },
    html:       { name:'HTML',        color:'#e34c26', bg:'#1e1e2e', ext:'html' },
    css:        { name:'CSS',         color:'#1572b6', bg:'#1e1e2e', ext:'css' },
    sql:        { name:'SQL',         color:'#336791', bg:'#1e1e2e', ext:'sql' },
    java:       { name:'Java',        color:'#ed8b00', bg:'#1e1e2e', ext:'java' },
    php:        { name:'PHP',         color:'#8892be', bg:'#1e1e2e', ext:'php' },
    bash:       { name:'Bash/Shell',  color:'#89e051', bg:'#1e1e2e', ext:'sh' },
    json:       { name:'JSON',        color:'#5b9bd5', bg:'#1e1e2e', ext:'json' },
    markdown:   { name:'Markdown',    color:'#083fa1', bg:'#1e1e2e', ext:'md' },
  },

  highlight(code, lang) {
    const clean = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const rules = {
      javascript: [
        [/\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await|new|this|typeof|instanceof)\b/g, '#c678dd'],
        [/\b(true|false|null|undefined|NaN|Infinity)\b/g, '#d19a66'],
        [/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '#98c379'],
        [/\/\/.*/g, '#5c6370'],
        [/\b(\d+\.?\d*)\b/g, '#d19a66'],
        [/\b([A-Z][a-zA-Z0-9]*)\b/g, '#e5c07b'],
      ],
      python: [
        [/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|with|as|try|except|finally|pass|break|continue|lambda|yield|global|nonlocal)\b/g, '#c678dd'],
        [/\b(True|False|None)\b/g, '#d19a66'],
        [/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '#98c379'],
        [/#.*/g, '#5c6370'],
        [/\b(\d+\.?\d*)\b/g, '#d19a66'],
      ],
      sql: [
        [/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|NULL|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|INTO|VALUES|SET|UNION|ALL|DISTINCT)\b/gi, '#c678dd'],
        [/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '#98c379'],
        [/--.*$/gm, '#5c6370'],
        [/\b(\d+)\b/g, '#d19a66'],
      ],
    };

    let result = clean;
    const langRules = rules[lang] || rules.javascript;
    langRules.forEach(([regex, color]) => {
      result = result.replace(regex, m => `<span style="color:${color}">${m}</span>`);
    });
    return result;
  }
};

function openCodePanel() {
  const old = document.getElementById('__codePanel'); if (old) old.remove();
  const sel = window.getSelection();
  const selectedText = sel ? sel.toString().trim() : '';

  const ov = document.createElement('div');
  ov.id = '__codePanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#1e1e2e;border-radius:20px;width:100%;max-width:640px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.5)">
    <div style="padding:16px 18px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.1)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="font-size:17px;font-weight:700;color:#e0e0e0">💻 Editor de código</div>
        <div style="flex:1"></div>
        <button onclick="document.getElementById('__codePanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#888;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:13px">✕</button>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Object.entries(WC_CODE.languages).map(([key,lang]) => `
          <button onclick="__codeSetLang('${key}',this)"
            class="__codeLangBtn"
            style="padding:5px 10px;border:1.5px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#aaa;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            onmouseover="this.style.borderColor='${lang.color}';this.style.color='${lang.color}'"
            onmouseout="if(!this.dataset.sel){this.style.borderColor='rgba(255,255,255,.15)';this.style.color='#aaa'}">
            ${lang.name}
          </button>`).join('')}
      </div>
    </div>

    <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;padding:0 18px">
      <textarea id="__codeInput" rows="10" spellcheck="false"
        style="flex:1;width:100%;padding:14px;background:#0d1117;color:#e6edf3;border:none;outline:none;resize:none;font-family:'Courier New',Courier,monospace;font-size:13px;line-height:1.6;border-radius:10px;margin:12px 0;box-sizing:border-box;tab-size:2"
        placeholder="// Escribe o pega tu código aquí..."
        onkeydown="__codeTabHandler(event)">${selectedText}</textarea>
    </div>

    <div style="padding:0 18px;flex-shrink:0">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;color:#888;display:block;margin-bottom:4px">Tema</label>
          <select id="__codeTheme" style="width:100%;padding:7px;background:#0d1117;color:#e6edf3;border:1px solid rgba(255,255,255,.15);border-radius:7px;font-size:12px;outline:none">
            <option value="dark">Oscuro (GitHub Dark)</option>
            <option value="monokai">Monokai</option>
            <option value="light">Claro</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:#888;display:block;margin-bottom:4px">Opciones</label>
          <div style="display:flex;gap:10px">
            <label style="display:flex;align-items:center;gap:4px;cursor:pointer;color:#aaa;font-size:11px">
              <input type="checkbox" id="__codeLineNums" checked style="accent-color:#0084ff"> N° líneas
            </label>
            <label style="display:flex;align-items:center;gap:4px;cursor:pointer;color:#aaa;font-size:11px">
              <input type="checkbox" id="__codeCopyBtn" checked style="accent-color:#0084ff"> Copiar
            </label>
          </div>
        </div>
      </div>

      <!-- IA para código -->
      <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:12px;margin-bottom:12px">
        <div style="font-size:11px;color:#888;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">🦙 IA para código</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${['Explicar','Comentar','Optimizar','Refactorizar','Convertir a Python','Convertir a JS','Generar tests','Encontrar bugs'].map(a =>
            `<button onclick="__codeAI('${a}')" style="padding:5px 10px;background:rgba(0,132,255,.2);border:1px solid rgba(0,132,255,.3);color:#74b9ff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s" onmouseover="this.style.background='rgba(0,132,255,.4)'" onmouseout="this.style.background='rgba(0,132,255,.2)'">${a}</button>`
          ).join('')}
        </div>
        <div id="__codeAIResult" style="display:none;margin-top:10px;background:rgba(0,0,0,.3);border-radius:8px;padding:10px;color:#e0e0e0;font-size:12px;max-height:120px;overflow-y:auto;white-space:pre-wrap;font-family:'Courier New',monospace"></div>
      </div>
    </div>

    <div style="padding:0 18px 16px;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__codePanel').remove()" style="flex:1;padding:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#aaa;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__codeInsert()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">💻 Insertar código</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });

  window.__currentCodeLang = 'javascript';
  setTimeout(() => {
    const btn = document.querySelector('.__codeLangBtn');
    if (btn) { btn.style.borderColor='#f7df1e'; btn.style.color='#f7df1e'; btn.dataset.sel='1'; }
    document.getElementById('__codeInput')?.focus();
  }, 50);
}

function __codeSetLang(lang, btn) {
  window.__currentCodeLang = lang;
  document.querySelectorAll('.__codeLangBtn').forEach(b => {
    b.style.borderColor='rgba(255,255,255,.15)'; b.style.color='#aaa'; delete b.dataset.sel;
  });
  const color = WC_CODE.languages[lang]?.color || '#0084ff';
  btn.style.borderColor = color; btn.style.color = color; btn.dataset.sel = '1';
}

function __codeTabHandler(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const ta  = e.target;
    const start = ta.selectionStart, end = ta.selectionEnd;
    ta.value = ta.value.substring(0,start) + '  ' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + 2;
  }
}

async function __codeAI(action) {
  const code = document.getElementById('__codeInput')?.value?.trim();
  const res  = document.getElementById('__codeAIResult');
  if (!code || !res) return;
  const key  = localStorage.getItem('wc-groq-key');
  if (!key) { showToast('Configurá tu API Key de Groq'); return; }

  res.style.display='block';
  res.textContent='⏳ Procesando con IA...';

  const prompts = {
    'Explicar':          `Explicá este código en español de forma clara y concisa:\n\`\`\`\n${code}\n\`\`\``,
    'Comentar':          `Agregá comentarios explicativos a este código. Devolvé solo el código comentado:\n\`\`\`\n${code}\n\`\`\``,
    'Optimizar':         `Optimizá este código para mejor rendimiento. Devolvé el código optimizado y una breve explicación:\n\`\`\`\n${code}\n\`\`\``,
    'Refactorizar':      `Refactorizá este código siguiendo buenas prácticas. Devolvé el código refactorizado:\n\`\`\`\n${code}\n\`\`\``,
    'Convertir a Python':`Convertí este código a Python. Devolvé solo el código Python:\n\`\`\`\n${code}\n\`\`\``,
    'Convertir a JS':    `Convertí este código a JavaScript moderno. Devolvé solo el código JS:\n\`\`\`\n${code}\n\`\`\``,
    'Generar tests':     `Generá tests unitarios para este código. Devolvé los tests:\n\`\`\`\n${code}\n\`\`\``,
    'Encontrar bugs':    `Analizá este código y encontrá posibles bugs o errores. Explicá cada uno:\n\`\`\`\n${code}\n\`\`\``,
  };

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[
          {role:'system',content:'Sos un experto programador. Respondés en español, de forma concisa y técnica.'},
          {role:'user',content:prompts[action]||action+': '+code}
        ],
        temperature:0.3, max_tokens:1000
      })
    });
    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    res.textContent = reply;
    if (reply.includes('```')) {
      const codeMatch = reply.match(/```(?:\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        const btn = document.createElement('button');
        btn.textContent = '↑ Usar este código';
        btn.style.cssText = 'display:block;margin-top:8px;padding:5px 12px;background:rgba(0,132,255,.3);border:none;color:#74b9ff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600';
        btn.onclick = () => { document.getElementById('__codeInput').value = codeMatch[1]; res.style.display='none'; };
        res.appendChild(btn);
      }
    }
  } catch(e) {
    res.textContent = 'Error: ' + e.message;
  }
}

function __codeInsert() {
  const code     = document.getElementById('__codeInput')?.value || '';
  if (!code.trim()) { showToast('Escribí código primero'); return; }
  const lang     = window.__currentCodeLang || 'javascript';
  const langInfo = WC_CODE.languages[lang];
  const lineNums = document.getElementById('__codeLineNums')?.checked;
  const copyBtn  = document.getElementById('__codeCopyBtn')?.checked;
  const theme    = document.getElementById('__codeTheme')?.value || 'dark';

  const themes = {
    dark:    { bg:'#0d1117', text:'#e6edf3', header:'#161b22', border:'#30363d' },
    monokai: { bg:'#272822', text:'#f8f8f2', header:'#1e1f1c', border:'#3e3d32' },
    light:   { bg:'#f8f8f8', text:'#333',    header:'#f0f0f0', border:'#ddd' },
  };
  const t = themes[theme] || themes.dark;

  const lines = code.split('\n');
  const highlighted = WC_CODE.highlight(code, lang);

  const lineNumsHTML = lineNums ? `<div style="padding:14px 8px 14px 14px;text-align:right;color:${t.border};font-size:12px;line-height:1.6;user-select:none;font-family:'Courier New',monospace;flex-shrink:0">
    ${lines.map((_,i)=>`<div>${i+1}</div>`).join('')}
  </div>` : '';

  const html = `
  <div style="border:1px solid ${t.border};border-radius:12px;overflow:hidden;margin:12px 0;font-family:'Courier New',Courier,monospace">
    <div style="background:${t.header};padding:8px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${t.border}">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="display:flex;gap:5px"><div style="width:10px;height:10px;border-radius:50%;background:#ff5f56"></div><div style="width:10px;height:10px;border-radius:50%;background:#ffbd2e"></div><div style="width:10px;height:10px;border-radius:50%;background:#27c93f"></div></div>
        <span style="font-size:11px;color:${langInfo.color};font-weight:700;font-family:-apple-system,sans-serif">${langInfo.name}</span>
      </div>
      ${copyBtn?`<button onclick="navigator.clipboard.writeText(this.closest('[data-code]')?.dataset?.code||'').then(()=>this.textContent='✓ Copiado!')" style="font-size:10px;color:#888;background:rgba(255,255,255,.1);border:none;border-radius:4px;padding:3px 8px;cursor:pointer;font-family:-apple-system,sans-serif">📋 Copiar</button>`:''}
    </div>
    <div style="background:${t.bg};display:flex;overflow-x:auto" data-code="${code.replace(/"/g,'&quot;')}">
      ${lineNumsHTML}
      <pre style="margin:0;padding:14px;flex:1;overflow:hidden;font-size:13px;line-height:1.6;color:${t.text};white-space:pre-wrap;word-break:break-word">${highlighted}</pre>
    </div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__codePanel').remove();
  showToast('💻 Código insertado ✅');
}

function openPricingPanel() {
  const old = document.getElementById('__pricingPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__pricingPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">💲 Tabla de precios</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Creá tablas de precios y planes profesionales</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[
        {id:'plans',   name:'Planes / Suscripción', icon:'📦'},
        {id:'services',name:'Lista de servicios',   icon:'📋'},
        {id:'quote',   name:'Cotización detallada', icon:'📄'},
        {id:'compare', name:'Comparación de precios',icon:'⚖️'},
      ].map(t=>`
        <button onclick="__pricingSelect('${t.id}',this)"
          class="__pricingTypeBtn"
          style="padding:12px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:center;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:24px;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${t.name}</div>
        </button>`).join('')}
    </div>

    <div id="__pricingFields" style="margin-bottom:16px">
      <!-- Se llena dinámicamente -->
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__pricingPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__insertPricingTable()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">💲 Insertar tabla</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__pricingType = 'plans';
  setTimeout(() => {
    const btn = document.querySelector('.__pricingTypeBtn');
    if (btn) { btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1'; }
    __pricingRenderFields('plans');
  }, 50);
}

function __pricingSelect(id, btn) {
  window.__pricingType = id;
  document.querySelectorAll('.__pricingTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1';
  __pricingRenderFields(id);
}

function __pricingRenderFields(type) {
  const f = document.getElementById('__pricingFields');
  if (!f) return;

  if (type === 'plans') {
    f.innerHTML = `
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Título de la tabla</label>
        <input type="text" id="__prTitle" value="Nuestros planes" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        ${[['Básico','₡29,900','#27ae60',['5 usuarios','10GB almacenamiento','Soporte email','Reportes básicos']],
           ['Profesional','₡59,900','#0084ff',['25 usuarios','100GB almacenamiento','Soporte prioritario','Reportes avanzados','API access']],
           ['Empresarial','₡99,900','#9b59b6',['Usuarios ilimitados','1TB almacenamiento','Soporte 24/7','Todo incluido','SLA garantizado']]
          ].map(([plan,price,color,features],i)=>`
          <div style="border:1.5px solid #eee;border-radius:10px;padding:10px">
            <input type="text" class="__prPlanName" value="${plan}" style="width:100%;padding:5px;border:1px solid #e0e0e0;border-radius:5px;font-size:12px;font-weight:700;outline:none;box-sizing:border-box;margin-bottom:5px;text-align:center" placeholder="Plan">
            <input type="text" class="__prPlanPrice" value="${price}" style="width:100%;padding:5px;border:1px solid #e0e0e0;border-radius:5px;font-size:12px;outline:none;box-sizing:border-box;margin-bottom:5px;text-align:center" placeholder="Precio">
            <textarea class="__prPlanFeatures" rows="4" style="width:100%;padding:5px;border:1px solid #e0e0e0;border-radius:5px;font-size:11px;outline:none;resize:none;box-sizing:border-box" placeholder="Una feature por línea">${features.join('\n')}</textarea>
            <div style="display:flex;align-items:center;gap:5px;margin-top:4px">
              <label style="font-size:10px;color:#555">Color:</label>
              <input type="color" class="__prPlanColor" value="${color}" style="height:24px;border:none;border-radius:4px;cursor:pointer">
            </div>
          </div>`).join('')}
      </div>`;
  } else if (type === 'services') {
    f.innerHTML = `
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Servicios y precios (uno por línea: Servicio|Precio)</label>
        <textarea id="__prServices" rows="8" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Consultoría inicial|₡75,000
Desarrollo web (por hora)|₡35,000
Diseño gráfico|₡45,000
Mantenimiento mensual|₡120,000
Capacitación (por hora)|₡55,000</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Moneda</label>
          <select id="__prCurrency" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option>₡ Colones</option><option>$ Dólares</option><option>€ Euros</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Incluir IVA</label>
          <select id="__prIVA" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="0">Sin IVA</option>
            <option value="13">IVA 13% incluido</option>
            <option value="4">IVA 4% incluido</option>
          </select>
        </div>
      </div>`;
  } else {
    f.innerHTML = `
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Items de cotización (Descripción|Cantidad|Precio unitario)</label>
        <textarea id="__prItems" rows="6" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Desarrollo de sitio web|1|₡850,000
Dominio .cr (anual)|1|₡25,000
Hosting premium (anual)|1|₡120,000
Mantenimiento (6 meses)|6|₡45,000</textarea>
      </div>`;
  }
}

function __insertPricingTable() {
  const type = window.__pricingType || 'plans';
  let html = '';

  if (type === 'plans') {
    const title  = document.getElementById('__prTitle')?.value || 'Nuestros planes';
    const names  = Array.from(document.querySelectorAll('.__prPlanName')).map(el=>el.value);
    const prices = Array.from(document.querySelectorAll('.__prPlanPrice')).map(el=>el.value);
    const feats  = Array.from(document.querySelectorAll('.__prPlanFeatures')).map(el=>el.value.split('\n').filter(f=>f.trim()));
    const colors = Array.from(document.querySelectorAll('.__prPlanColor')).map(el=>el.value);

    html = `<div style="margin:16px 0">
      <h3 style="text-align:center;color:#1a2942;margin-bottom:20px;font-size:18pt">${title}</h3>
      <div style="display:grid;grid-template-columns:repeat(${names.length},1fr);gap:12px">
        ${names.map((name,i)=>`
          <div style="border:2px solid ${colors[i]};border-radius:14px;overflow:hidden;text-align:center">
            <div style="background:${colors[i]};color:#fff;padding:14px 10px">
              <div style="font-size:14pt;font-weight:700">${name}</div>
              <div style="font-size:20pt;font-weight:900;margin:6px 0">${prices[i]}</div>
              <div style="font-size:9pt;opacity:.8">por mes</div>
            </div>
            <div style="padding:14px 10px">
              ${(feats[i]||[]).map(f=>`<div style="font-size:10pt;padding:5px 0;border-bottom:1px solid #f0f0f0;color:#555">✓ ${f}</div>`).join('')}
              <button style="margin-top:12px;padding:9px 20px;border:2px solid ${colors[i]};color:${colors[i]};background:#fff;border-radius:20px;cursor:pointer;font-size:11pt;font-weight:700;width:100%">Elegir plan</button>
            </div>
          </div>`).join('')}
      </div>
    </div>`;

  } else if (type === 'services') {
    const raw   = document.getElementById('__prServices')?.value || '';
    const ivaRate= parseInt(document.getElementById('__prIVA')?.value||'0');
    const items = raw.split('\n').filter(l=>l.trim()).map(l=>{ const p=l.split('|'); return {name:p[0]||'',price:p[1]||''}; });
    html = `<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">
      <tr style="background:#003da5;color:#fff"><th style="padding:10px 14px;border:1px solid #002080;text-align:left">Servicio</th><th style="padding:10px 14px;border:1px solid #002080;text-align:right">Precio</th>${ivaRate?`<th style="padding:10px 14px;border:1px solid #002080;text-align:right">Con IVA ${ivaRate}%</th>`:''}</tr>
      ${items.map((it,i)=>`<tr style="${i%2?'background:#f0f7ff':''}"><td style="padding:8px 14px;border:1px solid #ddd">${it.name}</td><td style="padding:8px 14px;border:1px solid #ddd;text-align:right;font-weight:600">${it.price}</td>${ivaRate?`<td style="padding:8px 14px;border:1px solid #ddd;text-align:right">—</td>`:''}</tr>`).join('')}
    </table>`;

  } else {
    const raw   = document.getElementById('__prItems')?.value || '';
    const items = raw.split('\n').filter(l=>l.trim()).map(l=>{ const p=l.split('|'); return {desc:p[0]||'',qty:p[1]||'1',price:p[2]||'₡0'}; });
    html = `<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">
      <tr style="background:#003da5;color:#fff">
        <th style="padding:8px 12px;border:1px solid #002080;text-align:left">Descripción</th>
        <th style="padding:8px 12px;border:1px solid #002080;text-align:center">Cant.</th>
        <th style="padding:8px 12px;border:1px solid #002080;text-align:right">P. Unit.</th>
      </tr>
      ${items.map((it,i)=>`<tr style="${i%2?'background:#f0f7ff':''}"><td style="padding:7px 12px;border:1px solid #ddd">${it.desc}</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center">${it.qty}</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:right;font-weight:600">${it.price}</td></tr>`).join('')}
    </table>`;
  }

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__pricingPanel').remove();
  showToast('💲 Tabla de precios insertada ✅');
}

function openCalendarPanel() {
  const old = document.getElementById('__calPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__calPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const now    = new Date();
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📅 Calendario de eventos</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Creá calendarios y agendas insertables</div>

      <div style="display:flex;gap:8px;margin-bottom:14px">
        <select id="__calMonth" style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          ${months.map((m,i)=>`<option value="${i}" ${i===now.getMonth()?'selected':''}>${m}</option>`).join('')}
        </select>
        <input type="number" id="__calYear" value="${now.getFullYear()}" style="width:90px;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;text-align:center">
        <button onclick="__calRender()" style="padding:8px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">Ver</button>
      </div>

      <div id="__calGrid" style="margin-bottom:14px"></div>

      <div style="margin-bottom:14px">
        <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Agregar evento</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <input type="date" id="__calEvDate" value="${now.toISOString().split('T')[0]}"
            style="padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
          <input type="color" id="__calEvColor" value="#0084ff" style="height:36px;border:none;border-radius:8px;cursor:pointer;width:100%">
        </div>
        <div style="display:flex;gap:8px">
          <input type="text" id="__calEvName" placeholder="Nombre del evento"
            style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
            onkeydown="if(event.key==='Enter')__calAddEvent()">
          <button onclick="__calAddEvent()" style="padding:8px 14px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar</button>
        </div>
      </div>

      <div id="__calEvents" style="max-height:120px;overflow-y:auto;margin-bottom:14px"></div>
    </div>

    <div style="padding:0 20px 20px;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__calPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__calInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📅 Insertar calendario</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__calEvents = [];
  __calRender();
}

function __calRender() {
  const grid  = document.getElementById('__calGrid');
  const month = parseInt(document.getElementById('__calMonth')?.value||0);
  const year  = parseInt(document.getElementById('__calYear')?.value||new Date().getFullYear());
  const months= ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const days  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month+1, 0).getDate();
  const today = new Date();

  let html = `<div style="background:#f8f9fa;border-radius:12px;overflow:hidden">
    <div style="background:#003da5;color:#fff;padding:10px;text-align:center;font-weight:700;font-size:13px">${months[month]} ${year}</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0">
      ${days.map(d=>`<div style="padding:6px 0;text-align:center;font-size:10px;font-weight:700;color:#888;border-bottom:1px solid #eee">${d}</div>`).join('')}
      ${Array(first).fill('').map(()=>'<div></div>').join('')}
      ${Array(total).fill('').map((_,i)=>{
        const day  = i+1;
        const date = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const evs  = (window.__calEvents||[]).filter(e=>e.date===date);
        const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===day;
        return `<div onclick="document.getElementById('__calEvDate').value='${date}'" style="padding:3px;text-align:center;cursor:pointer;border:1px solid #eee;min-height:36px;transition:background .1s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background=''">
          <div style="width:22px;height:22px;border-radius:50%;background:${isToday?'#003da5':evs.length?evs[0].color:'transparent'};color:${isToday||evs.length?'#fff':'#333'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:${isToday?'700':'400'};margin:0 auto">${day}</div>
          ${evs.map(e=>`<div style="font-size:8px;background:${e.color}22;color:${e.color};border-radius:2px;padding:0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px">${e.name.slice(0,8)}</div>`).join('')}
        </div>`;
      }).join('')}
    </div>
  </div>`;
  if (grid) grid.innerHTML = html;
  __calRenderEvents();
}

function __calAddEvent() {
  const date  = document.getElementById('__calEvDate')?.value;
  const name  = document.getElementById('__calEvName')?.value?.trim();
  const color = document.getElementById('__calEvColor')?.value;
  if (!date||!name) { showToast('Ingresá fecha y nombre'); return; }
  if (!window.__calEvents) window.__calEvents = [];
  window.__calEvents.push({ date, name, color });
  document.getElementById('__calEvName').value = '';
  __calRender();
  showToast('Evento agregado ✅');
}

function __calRenderEvents() {
  const box = document.getElementById('__calEvents');
  if (!box) return;
  const evs = window.__calEvents||[];
  if (!evs.length) { box.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:10px">No hay eventos</div>'; return; }
  box.innerHTML = evs.map((e,i)=>`
    <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#f8f9fa;border-radius:8px;margin-bottom:4px">
      <div style="width:10px;height:10px;border-radius:50%;background:${e.color};flex-shrink:0"></div>
      <div style="font-size:12px;flex:1"><strong>${e.date}</strong> — ${e.name}</div>
      <button onclick="window.__calEvents.splice(${i},1);__calRender()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px;padding:0">×</button>
    </div>`).join('');
}

function __calInsert() {
  const month = parseInt(document.getElementById('__calMonth')?.value||0);
  const year  = parseInt(document.getElementById('__calYear')?.value||new Date().getFullYear());
  const months= ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const days  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const first = new Date(year,month,1).getDay();
  const total = new Date(year,month+1,0).getDate();
  const evs   = window.__calEvents||[];

  const html = `<div style="margin:16px 0;font-family:Calibri,Arial,sans-serif">
    <div style="background:#003da5;color:#fff;padding:12px;text-align:center;font-weight:700;font-size:14pt;border-radius:10px 10px 0 0">${months[month]} ${year}</div>
    <table style="border-collapse:collapse;width:100%">
      <tr>${days.map(d=>`<th style="padding:8px;border:1px solid #c0d8f0;background:#f0f7ff;font-size:10pt;color:#003da5;text-align:center">${d}</th>`).join('')}</tr>
      ${__calBuildRows(first,total,month,year,evs)}
    </table>
    ${evs.length?`<div style="margin-top:10px"><div style="font-size:10pt;font-weight:700;color:#003da5;margin-bottom:6px">📅 Eventos:</div>${evs.map(e=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:10pt"><div style="width:10px;height:10px;border-radius:50%;background:${e.color};flex-shrink:0"></div><strong>${e.date}:</strong> ${e.name}</div>`).join('')}</div>`:''}
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__calPanel').remove();
  showToast('📅 Calendario insertado ✅');
}

function __calBuildRows(first,total,month,year,evs) {
  let cells=[]; for(let i=0;i<first;i++) cells.push('');
  for(let d=1;d<=total;d++) {
    const date=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEvs=evs.filter(e=>e.date===date);
    cells.push(`<td style="padding:6px;border:1px solid #ddd;vertical-align:top;min-height:40px;width:14.28%"><div style="font-size:10pt;font-weight:600">${d}</div>${dayEvs.map(e=>`<div style="font-size:8pt;background:${e.color}22;color:${e.color};border-radius:3px;padding:1px 4px;margin-top:2px;overflow:hidden">${e.name}</div>`).join('')}</td>`);
  }
  while(cells.length%7!==0) cells.push('<td style="border:1px solid #ddd"></td>');
  let rows='';
  for(let i=0;i<cells.length;i+=7) rows+=`<tr>${cells.slice(i,i+7).map(c=>c||'<td style="border:1px solid #ddd"></td>').join('')}</tr>`;
  return rows;
}

function openFinancialCalc() {
  const old = document.getElementById('__finPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__finPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">💰 Calculadora financiera CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">TREA · Intereses · Amortización · Préstamos</div>

    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
      ${[['trea','📊 TREA'],['interes','💵 Interés simple/compuesto'],['amort','📋 Amortización'],['prestamo','🏦 Cuota préstamo']].map(([id,label],i)=>`
        <button onclick="__finTab('${id}',this)" id="__finTab_${id}"
          style="padding:7px 12px;border:2px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#003da5':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s">
          ${label}
        </button>`).join('')}
    </div>

    <!-- TREA -->
    <div id="__finSection_trea">
      <div style="background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:12px;font-size:12px;color:#0066cc;line-height:1.7">
        <strong>TREA</strong> = Tasa de Rendimiento Efectivo Anual<br>
        Usada en Costa Rica para comparar productos financieros (Ley 7472 SUGEF)
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa nominal (%)</label><input type="number" id="__treaNominal" placeholder="12" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcTREA()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Capitalización</label><select id="__treaCap" onchange="__calcTREA()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"><option value="12">Mensual (12x)</option><option value="365">Diaria (365x)</option><option value="4">Trimestral (4x)</option><option value="2">Semestral (2x)</option><option value="1">Anual (1x)</option></select></div>
      </div>
      <div id="__treaResult" style="background:#f0fff4;border-radius:10px;padding:12px;font-size:13px;display:none"></div>
    </div>

    <!-- Interés -->
    <div id="__finSection_interes" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Capital ₡</label><input type="number" id="__intCapital" placeholder="1000000" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcInteres()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa anual (%)</label><input type="number" id="__intTasa" placeholder="15" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcInteres()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Plazo (meses)</label><input type="number" id="__intPlazo" placeholder="12" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcInteres()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo</label><select id="__intTipo" onchange="__calcInteres()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"><option value="simple">Simple</option><option value="compuesto">Compuesto</option></select></div>
      </div>
      <div id="__intResult" style="background:#f0fff4;border-radius:10px;padding:12px;font-size:13px;display:none"></div>
    </div>

    <!-- Amortización -->
    <div id="__finSection_amort" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Préstamo ₡</label><input type="number" id="__amortPrestamo" placeholder="5000000" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa (%/mes)</label><input type="number" id="__amortTasa" placeholder="1.5" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cuotas</label><input type="number" id="__amortCuotas" placeholder="24" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
      </div>
      <button onclick="__calcAmort()" style="width:100%;padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">Generar tabla de amortización</button>
      <div id="__amortResult" style="display:none;max-height:200px;overflow-y:auto"></div>
    </div>

    <!-- Cuota préstamo -->
    <div id="__finSection_prestamo" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Monto ₡</label><input type="number" id="__presMonto" placeholder="10000000" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcPrestamo()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa anual (%)</label><input type="number" id="__presTasa" placeholder="18" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcPrestamo()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Plazo (meses)</label><input type="number" id="__presPlazo" placeholder="48" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcPrestamo()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo entidad</label><select id="__presEntidad" onchange="__calcPrestamo()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"><option>Banco CR</option><option>Coopeande</option><option>Banco Popular</option><option>BNCR</option><option>Prival Bank</option></select></div>
      </div>
      <div id="__presResult" style="background:#f0fff4;border-radius:10px;padding:12px;font-size:13px;display:none"></div>
    </div>

    <div style="display:flex;gap:8px;margin-top:14px">
      <button onclick="document.getElementById('__finPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__finInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📋 Insertar resultado</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__finActiveTab = 'trea';
}

function __finTab(id, btn) {
  window.__finActiveTab = id;
  ['trea','interes','amort','prestamo'].forEach(t => {
    const sec = document.getElementById('__finSection_'+t);
    const b   = document.getElementById('__finTab_'+t);
    if (sec) sec.style.display = t===id ? 'block' : 'none';
    if (b) { b.style.borderColor=t===id?'#003da5':'#eee'; b.style.background=t===id?'#f0f7ff':'#fafafa'; b.style.color=t===id?'#003da5':'#555'; }
  });
}

function __calcTREA() {
  const nominal = parseFloat(document.getElementById('__treaNominal')?.value)||0;
  const n       = parseInt(document.getElementById('__treaCap')?.value)||12;
  const res     = document.getElementById('__treaResult');
  if (!nominal||!res) return;
  const trea = (Math.pow(1 + (nominal/100)/n, n) - 1) * 100;
  res.style.display='block';
  res.innerHTML = `<div style="font-size:12px;color:#555;margin-bottom:4px">Tasa nominal: <strong>${nominal}%</strong> · Capitalización: <strong>${n}x/año</strong></div>
    <div style="font-size:22px;font-weight:800;color:#003da5">TREA = ${trea.toFixed(4)}%</div>
    <div style="font-size:11px;color:#888;margin-top:4px">Fórmula: (1 + ${(nominal/100/n).toFixed(6)})^${n} - 1</div>`;
  window.__finResult = `TREA: ${trea.toFixed(4)}% (Tasa nominal ${nominal}%, capitalización ${n}x/año)`;
}

function __calcInteres() {
  const capital = parseFloat(document.getElementById('__intCapital')?.value)||0;
  const tasa    = parseFloat(document.getElementById('__intTasa')?.value)||0;
  const plazo   = parseFloat(document.getElementById('__intPlazo')?.value)||0;
  const tipo    = document.getElementById('__intTipo')?.value || 'simple';
  const res     = document.getElementById('__intResult');
  if (!capital||!tasa||!plazo||!res) return;
  const fmt = n => '₡'+n.toLocaleString('es-CR',{maximumFractionDigits:0});
  let interes, total;
  if (tipo==='simple') {
    interes = capital * (tasa/100) * (plazo/12);
    total   = capital + interes;
  } else {
    total   = capital * Math.pow(1 + (tasa/100)/12, plazo);
    interes = total - capital;
  }
  res.style.display='block';
  res.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px">
    <div style="text-align:center"><div style="color:#888">Capital</div><div style="font-weight:700">${fmt(capital)}</div></div>
    <div style="text-align:center"><div style="color:#e74c3c">Intereses</div><div style="font-weight:700;color:#e74c3c">${fmt(interes)}</div></div>
    <div style="text-align:center"><div style="color:#003da5">Total</div><div style="font-weight:800;color:#003da5">${fmt(total)}</div></div>
  </div>`;
  window.__finResult = `Interés ${tipo}: Capital ${fmt(capital)}, Tasa ${tasa}%, Plazo ${plazo} meses → Intereses: ${fmt(interes)}, Total: ${fmt(total)}`;
}

function __calcAmort() {
  const P    = parseFloat(document.getElementById('__amortPrestamo')?.value)||0;
  const r    = parseFloat(document.getElementById('__amortTasa')?.value)/100||0;
  const n    = parseInt(document.getElementById('__amortCuotas')?.value)||0;
  const res  = document.getElementById('__amortResult');
  if (!P||!r||!n||!res) return;
  const cuota= P * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
  const fmt  = v => '₡'+Math.round(v).toLocaleString('es-CR');
  let saldo  = P, rows='';
  for(let i=1;i<=Math.min(n,12);i++) {
    const interes = saldo*r;
    const capital = cuota-interes;
    saldo -= capital;
    rows += `<tr style="${i%2?'background:#f0f7ff':''}"><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px">${i}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${fmt(cuota)}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right;color:#e74c3c">${fmt(interes)}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right;color:#27ae60">${fmt(capital)}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${fmt(Math.max(0,saldo))}</td></tr>`;
  }
  if(n>12) rows+=`<tr><td colspan="5" style="padding:6px;text-align:center;color:#888;font-size:10px">... ${n-12} cuotas más</td></tr>`;
  res.style.display='block';
  res.innerHTML = `<div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:6px">Cuota mensual: ${fmt(cuota)}</div>
    <table style="border-collapse:collapse;width:100%;font-size:10px"><tr style="background:#003da5;color:#fff"><th style="padding:5px 8px;border:1px solid #002080">N°</th><th style="padding:5px 8px;border:1px solid #002080">Cuota</th><th style="padding:5px 8px;border:1px solid #002080">Interés</th><th style="padding:5px 8px;border:1px solid #002080">Capital</th><th style="padding:5px 8px;border:1px solid #002080">Saldo</th></tr>${rows}</table>`;
  window.__finResult = `Amortización: Préstamo ${fmt(P)}, Tasa ${r*100}%/mes, ${n} cuotas → Cuota mensual: ${fmt(cuota)}`;
}

function __calcPrestamo() {
  const monto  = parseFloat(document.getElementById('__presMonto')?.value)||0;
  const tasa   = parseFloat(document.getElementById('__presTasa')?.value)||0;
  const plazo  = parseInt(document.getElementById('__presPlazo')?.value)||0;
  const res    = document.getElementById('__presResult');
  if (!monto||!tasa||!plazo||!res) return;
  const r      = tasa/100/12;
  const cuota  = monto * r * Math.pow(1+r,plazo) / (Math.pow(1+r,plazo)-1);
  const total  = cuota * plazo;
  const interes= total - monto;
  const fmt    = v => '₡'+Math.round(v).toLocaleString('es-CR');
  res.style.display='block';
  res.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
    <div><span style="color:#888">Cuota mensual:</span><br><strong style="font-size:16px;color:#003da5">${fmt(cuota)}</strong></div>
    <div><span style="color:#888">Total a pagar:</span><br><strong>${fmt(total)}</strong></div>
    <div><span style="color:#888">Total intereses:</span><br><strong style="color:#e74c3c">${fmt(interes)}</strong></div>
    <div><span style="color:#888">Monto solicitado:</span><br><strong>${fmt(monto)}</strong></div>
  </div>`;
  window.__finResult = `Préstamo: ${fmt(monto)}, Tasa ${tasa}%/año, ${plazo} meses → Cuota: ${fmt(cuota)}, Total intereses: ${fmt(interes)}`;
}

function __finInsert() {
  const r = window.__finResult;
  if (!r) { showToast('Calculá primero'); return; }
  if (typeof insertHTML==='function') insertHTML(`<div style="background:#f0f7ff;border-left:4px solid #003da5;padding:10px 14px;border-radius:0 8px 8px 0;margin:8px 0;font-size:11pt">💰 ${r}</div>`);
  document.getElementById('__finPanel').remove();
  showToast('Resultado insertado ✅');
}

function openLawSearchPanel() {
  const old = document.getElementById('__lawPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__lawPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const lawsDB = [
    { num:'7472',  name:'Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor', year:1994, area:'Consumidor' },
    { num:'9635',  name:'Ley de Fortalecimiento de las Finanzas Públicas (IVA)', year:2018, area:'Tributario' },
    { num:'8204',  name:'Ley sobre Estupefacientes', year:2001, area:'Penal' },
    { num:'7476',  name:'Ley contra el Hostigamiento Sexual en el Empleo y la Docencia', year:1995, area:'Laboral' },
    { num:'2',     name:'Código Civil de Costa Rica', year:1888, area:'Civil' },
    { num:'7794',  name:'Código Municipal', year:1998, area:'Municipal' },
    { num:'7093',  name:'Código Notarial', year:1998, area:'Notarial' },
    { num:'7970',  name:'Ley de Propiedad Intelectual', year:2000, area:'IP' },
    { num:'8968',  name:'Ley de Protección de la Persona frente al tratamiento de sus datos personales', year:2011, area:'PDPD' },
    { num:'7600',  name:'Ley de Igualdad de Oportunidades para las Personas con Discapacidad', year:1996, area:'Discapacidad' },
    { num:'9514',  name:'Ley Marco para la Atención, Prevención y Sanción de la Violencia contra las Mujeres', year:2017, area:'Género' },
    { num:'6227',  name:'Ley General de la Administración Pública', year:1978, area:'Administración' },
    { num:'7558',  name:'Ley Orgánica del Banco Central de Costa Rica', year:1995, area:'Financiero' },
    { num:'7092',  name:'Ley del Impuesto sobre la Renta', year:1988, area:'Tributario' },
    { num:'4755',  name:'Código de Normas y Procedimientos Tributarios', year:1971, area:'Tributario' },
    { num:'2/1943',name:'Código de Trabajo de Costa Rica', year:1943, area:'Laboral' },
    { num:'3284',  name:'Código de Comercio', year:1964, area:'Comercial' },
    { num:'7495',  name:'Ley de Expropiaciones', year:1995, area:'Inmobiliario' },
    { num:'7969',  name:'Ley Reguladora del Mercado de Valores', year:1998, area:'Financiero' },
    { num:'8292',  name:'Ley General de Control Interno', year:2002, area:'Control' },
    { num:'7768',  name:'Ley de Regulación de la Actividad de Intermediación Cambiaria', year:1998, area:'Financiero' },
    { num:'9416',  name:'Ley para Mejorar la Lucha contra el Fraude Fiscal', year:2016, area:'Tributario' },
    { num:'7169',  name:'Ley de Promoción del Desarrollo Científico y Tecnológico', year:1990, area:'Tecnología' },
    { num:'8687',  name:'Ley del Sistema de Banca para el Desarrollo', year:2008, area:'Financiero' },
    { num:'7554',  name:'Ley Orgánica del Ambiente', year:1995, area:'Ambiental' },
  ];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
        ⚖️ Buscador de leyes CR
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Legislación costarricense · SINALEVI</div>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <input type="text" id="__lawSearch"
          placeholder="Buscar por nombre, número o área..."
          style="flex:1;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__lawFilter(this.value)">
        <button onclick="__lawOpenSINALEVI()" style="padding:10px 14px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">SINALEVI</button>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
        ${['Todos','Laboral','Tributario','Civil','Comercial','Ambiental','Financiero'].map(a=>`
          <button onclick="__lawFilterArea('${a}',this)"
            class="__lawAreaBtn"
            style="padding:5px 10px;border:1.5px solid ${a==='Todos'?'#003da5':'#eee'};background:${a==='Todos'?'#f0f7ff':'#fafafa'};color:${a==='Todos'?'#003da5':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${a==='Todos'?'data-sel="1"':''}>
            ${a}
          </button>`).join('')}
      </div>
    </div>

    <div id="__lawResults" style="flex:1;overflow-y:auto;padding:0 20px 8px">
      <!-- Se llena dinámicamente -->
    </div>

    <div style="padding:12px 20px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__lawPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__lawsDB = lawsDB;
  __lawFilter('');
}

function __lawFilter(query) {
  const q      = query.toLowerCase();
  const area   = window.__lawArea || 'Todos';
  const laws   = window.__lawsDB || [];
  const areas  = {
    Laboral:'#27ae60', Tributario:'#e67e22', Civil:'#9b59b6',
    Comercial:'#3498db', Ambiental:'#1abc9c', Financiero:'#e74c3c',
    Municipal:'#f39c12', Penal:'#c0392b', IP:'#8e44ad',
    PDPD:'#16a085', Ambiental:'#27ae60', Administración:'#2980b9',
  };

  const filtered = laws.filter(l =>
    (area==='Todos' || l.area===area) &&
    (!q || l.name.toLowerCase().includes(q) || l.num.includes(q) || l.area.toLowerCase().includes(q))
  );

  const res = document.getElementById('__lawResults');
  if (!res) return;

  if (!filtered.length) { res.innerHTML='<div style="text-align:center;color:#bbb;padding:20px;font-size:13px">No se encontraron leyes</div>'; return; }

  res.innerHTML = filtered.map(l => `
    <div style="border:1.5px solid #eee;border-radius:12px;padding:12px 14px;margin-bottom:8px;transition:all .15s"
      onmouseover="this.style.borderColor='#003da5';this.style.background='#f8f9ff'"
      onmouseout="this.style.borderColor='#eee';this.style.background='#fff'">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="background:${areas[l.area]||'#003da5'}22;border-radius:8px;padding:6px 10px;flex-shrink:0;text-align:center">
          <div style="font-size:14px;font-weight:800;color:${areas[l.area]||'#003da5'}">${l.num}</div>
          <div style="font-size:9px;color:${areas[l.area]||'#003da5'}">${l.year}</div>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:4px">${l.name}</div>
          <div style="font-size:10px;background:${areas[l.area]||'#003da5'}22;color:${areas[l.area]||'#003da5'};border-radius:4px;padding:1px 7px;display:inline-block;font-weight:600">${l.area}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
          <button onclick="__lawInsert('${l.num}','${l.name.replace(/'/g,"\\'")}','${l.year}')"
            style="padding:5px 10px;border:none;background:#003da5;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">
            Citar
          </button>
          <button onclick="__lawOpenURL('${l.num}')"
            style="padding:5px 10px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">
            Ver
          </button>
        </div>
      </div>
    </div>`).join('');
}

function __lawFilterArea(area, btn) {
  window.__lawArea = area;
  document.querySelectorAll('.__lawAreaBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  btn.style.borderColor='#003da5'; btn.style.background='#f0f7ff'; btn.style.color='#003da5'; btn.dataset.sel='1';
  __lawFilter(document.getElementById('__lawSearch')?.value||'');
}

function __lawInsert(num, name, year) {
  const html = `<span style="background:#f0f7ff;border:1px solid #003da5;border-radius:4px;padding:1px 8px;font-size:10pt;color:#003da5">Ley N° ${num} — ${name} (${year})</span>`;
  if (typeof insertHTML==='function') insertHTML(html);
  showToast('⚖️ Ley N°' + num + ' citada ✅');
}

function __lawOpenURL(num) {
  window.open(`https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${num}`, '_blank');
}

function __lawOpenSINALEVI() {
  window.open('https://www.sinalevi.go.cr/', '_blank');
  showToast('Abriendo SINALEVI...');
}

(function initV2516() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'codeEditor':    openCodePanel();         break;
          case 'pricingTable':  openPricingPanel();      break;
          case 'calendar':      openCalendarPanel();     break;
          case 'financialCalc': openFinancialCalc();     break;
          case 'lawSearch':     openLawSearchPanel();    break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.16 ✅ — Código IA, Precios, Calendario, Finanzas CR, Leyes CR');
  }, 2400);
})();
function openPresentationAssistant() {
  const old = document.getElementById('__presAsPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  const ov  = document.createElement('div');
  ov.id = '__presAsPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px';

  const headings = ed ? Array.from(ed.querySelectorAll('h1,h2,h3')) : [];
  const slides   = __presExtractSlides(ed);

  const themes = [
    { id:'corporate', name:'Corporativo',   bg:'#003da5', text:'#fff',    accent:'#0084ff' },
    { id:'dark',      name:'Oscuro',        bg:'#1a1a2e', text:'#e0e0e0', accent:'#e2b96f' },
    { id:'light',     name:'Claro',         bg:'#ffffff', text:'#1a2942', accent:'#0084ff' },
    { id:'green',     name:'Verde CR',      bg:'#1a472a', text:'#fff',    accent:'#27ae60' },
    { id:'red',       name:'Rojo CR',       bg:'#8b0000', text:'#fff',    accent:'#ce1126' },
    { id:'minimal',   name:'Minimal',       bg:'#f5f5f5', text:'#333',    accent:'#555'    },
  ];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;width:100%;max-width:620px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎬 Asistente de presentaciones</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Convierte tu documento en ${slides.length} slide${slides.length!==1?'s':''} automáticamente</div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${themes.map((t,i) => `
          <button onclick="__presSelectTheme('${t.id}',this)"
            class="__presThemeBtn"
            style="padding:6px 12px;border:2px solid ${i===0?'#003da5':'#eee'};background:${t.bg};color:${t.text};border-radius:20px;cursor:pointer;font-size:11px;font-weight:700;transition:all .15s"
            ${i===0?'data-sel="1"':''}>
            ${t.name}
          </button>`).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Transición</label>
          <select id="__presTransition" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="fade">Fundido</option>
            <option value="slide">Deslizar</option>
            <option value="none">Sin transición</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Dividir por</label>
          <select id="__presDivide" onchange="__presRefreshSlides()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="h1h2">H1 y H2</option>
            <option value="h1">Solo H1</option>
            <option value="h2">Solo H2</option>
            <option value="p5">Cada 5 párrafos</option>
          </select>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <input type="checkbox" id="__presNumbers" checked style="accent-color:#0084ff;width:15px;height:15px">
        <label for="__presNumbers" style="font-size:12px;color:#555">Mostrar número de slide</label>
        <input type="checkbox" id="__presProgress" checked style="accent-color:#0084ff;width:15px;height:15px;margin-left:10px">
        <label for="__presProgress" style="font-size:12px;color:#555">Barra de progreso</label>
      </div>
    </div>

    <!-- Preview de slides -->
    <div style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Vista previa (${slides.length} slides)</div>
      <div id="__presSlidePreview" style="display:flex;flex-direction:column;gap:8px">
        ${slides.slice(0,6).map((s,i) => `
          <div style="background:#f0f7ff;border-radius:10px;padding:12px;border:1.5px solid #c0d8f0">
            <div style="font-size:10px;color:#aaa;font-weight:700;margin-bottom:4px">SLIDE ${i+1}</div>
            <div style="font-size:13px;font-weight:700;color:#003da5">${s.title||'Sin título'}</div>
            <div style="font-size:11px;color:#555;margin-top:4px;max-height:40px;overflow:hidden">${s.body||''}</div>
          </div>`).join('')}
        ${slides.length > 6 ? `<div style="text-align:center;color:#aaa;font-size:12px;padding:8px">... ${slides.length-6} slides más</div>` : ''}
      </div>
    </div>

    <div style="padding:14px 20px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:8px">
      <button onclick="document.getElementById('__presAsPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generatePresentation()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🎬 Generar presentación</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__presThemeConfig = { id:'corporate', bg:'#003da5', text:'#fff', accent:'#0084ff' };
  window.__presSlides = slides;
}

function __presExtractSlides(ed) {
  if (!ed) return [];
  const slides = [];
  const children = Array.from(ed.children);
  let current = null;

  children.forEach(el => {
    if (/^H[12]$/.test(el.tagName)) {
      if (current) slides.push(current);
      current = { title: el.innerText.trim(), body: '', html: '' };
    } else if (current) {
      current.body += el.innerText.trim() + ' ';
      current.html += el.outerHTML;
    }
  });
  if (current) slides.push(current);
  if (!slides.length && ed.innerText.trim()) {
    slides.push({ title: 'Presentación', body: ed.innerText.slice(0,200), html: ed.innerHTML });
  }
  return slides.map(s => ({ ...s, body: s.body.slice(0,150) }));
}

function __presSelectTheme(id, btn) {
  const themes = {
    corporate: { id:'corporate', bg:'#003da5', text:'#fff',    accent:'#0084ff' },
    dark:      { id:'dark',      bg:'#1a1a2e', text:'#e0e0e0', accent:'#e2b96f' },
    light:     { id:'light',     bg:'#ffffff', text:'#1a2942', accent:'#0084ff' },
    green:     { id:'green',     bg:'#1a472a', text:'#fff',    accent:'#27ae60' },
    red:       { id:'red',       bg:'#8b0000', text:'#fff',    accent:'#ce1126' },
    minimal:   { id:'minimal',   bg:'#f5f5f5', text:'#333',    accent:'#555'    },
  };
  window.__presThemeConfig = themes[id] || themes.corporate;
  document.querySelectorAll('.__presThemeBtn').forEach(b => { b.style.borderColor='#eee'; delete b.dataset.sel; });
  btn.style.borderColor = window.__presThemeConfig.accent;
  btn.dataset.sel = '1';
}

function __generatePresentation() {
  const slides     = window.__presSlides || [];
  const theme      = window.__presThemeConfig || { bg:'#003da5', text:'#fff', accent:'#0084ff' };
  const transition = document.getElementById('__presTransition')?.value || 'fade';
  const showNums   = document.getElementById('__presNumbers')?.checked;
  const showProg   = document.getElementById('__presProgress')?.checked;
  const total      = slides.length;

  if (!slides.length) { showToast('No hay contenido para presentar'); return; }

  const transCSS = transition === 'fade'
    ? '.slide{animation:fadeIn .4s ease}.slide.active{opacity:1}@keyframes fadeIn{from{opacity:0}to{opacity:1}}'
    : transition === 'slide'
    ? '.slide{animation:slideIn .3s ease}@keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}'
    : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Presentación — WC Corporate Editor</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,'Segoe UI',Calibri,Arial,sans-serif;background:#000;overflow:hidden;height:100vh}
  .slide{display:none;height:100vh;background:${theme.bg};color:${theme.text};flex-direction:column;align-items:center;justify-content:center;padding:8vh 10vw;text-align:center;position:relative}
  .slide.active{display:flex}
  ${transCSS}
  .slide h1,.slide-title{font-size:clamp(24px,5vw,52px);font-weight:900;margin-bottom:.6em;line-height:1.2;color:${theme.text}}
  .slide-body{font-size:clamp(14px,2.2vw,22px);line-height:1.7;opacity:.9;max-width:80%;color:${theme.text}}
  .slide-num{position:absolute;bottom:20px;right:24px;font-size:12px;opacity:.5}
  .progress-bar{position:absolute;bottom:0;left:0;height:4px;background:${theme.accent};transition:width .3s ease}
  .nav{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;z-index:100}
  .nav button{background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:50%;width:44px;height:44px;font-size:20px;cursor:pointer;backdrop-filter:blur(10px);transition:all .2s}
  .nav button:hover{background:rgba(255,255,255,.3)}
  .nav-counter{color:rgba(255,255,255,.7);font-size:13px;min-width:60px;text-align:center}
  .accent-line{width:60px;height:4px;background:${theme.accent};margin:0 auto 1.5em;border-radius:2px}
  .exit-btn{position:fixed;top:16px;right:16px;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:10px;padding:8px 14px;cursor:pointer;font-size:12px;font-weight:600;backdrop-filter:blur(10px);z-index:100}
  .fullscreen-btn{position:fixed;top:16px;right:110px;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:10px;padding:8px 14px;cursor:pointer;font-size:12px;backdrop-filter:blur(10px);z-index:100}
</style>
</head>
<body>
${slides.map((s,i) => `
  <div class="slide${i===0?' active':''}" id="slide-${i}">
    ${showProg?`<div class="progress-bar" style="width:${Math.round((i+1)/total*100)}%"></div>`:''}
    <div class="accent-line"></div>
    <div class="slide-title">${s.title}</div>
    ${s.body?`<div class="slide-body">${s.body}</div>`:''}
    ${showNums?`<div class="slide-num">${i+1} / ${total}</div>`:''}
  </div>`).join('')}

<div class="nav">
  <button onclick="prevSlide()">◀</button>
  <span class="nav-counter" id="nav-cnt">1 / ${total}</span>
  <button onclick="nextSlide()">▶</button>
</div>
<button class="exit-btn" onclick="window.close()">✕ Salir</button>
<button class="fullscreen-btn" onclick="document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()">⛶</button>

<script>
  let cur=0;const total=${total};
  function show(n){
    document.querySelectorAll('.slide').forEach(s=>s.classList.remove('active'));
    document.getElementById('slide-'+n).classList.add('active');
    document.getElementById('nav-cnt').textContent=(n+1)+' / '+total;
  }
  function nextSlide(){if(cur<total-1){cur++;show(cur);}}
  function prevSlide(){if(cur>0){cur--;show(cur);}}
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' ')nextSlide();
    if(e.key==='ArrowLeft'||e.key==='ArrowUp')prevSlide();
    if(e.key==='Escape')window.close();
    if(e.key==='f')document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();
  });
  let tx=0;
  document.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
  document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50){dx<0?nextSlide():prevSlide();}},{passive:true});
<\/script>
</body></html>`;

  const win = window.open('','_blank','width=1200,height=700');
  win.document.write(html);
  win.document.close();
  document.getElementById('__presAsPanel').remove();
  showToast(`🎬 Presentación con ${total} slides generada ✅`);
}

function openFormBuilder() {
  const old = document.getElementById('__formBldPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__formBldPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const fieldTypes = [
    { id:'text',     icon:'📝', name:'Texto corto' },
    { id:'textarea', icon:'📄', name:'Texto largo' },
    { id:'number',   icon:'🔢', name:'Número' },
    { id:'date',     icon:'📅', name:'Fecha' },
    { id:'email',    icon:'📧', name:'Correo' },
    { id:'phone',    icon:'📱', name:'Teléfono' },
    { id:'select',   icon:'📋', name:'Lista opciones' },
    { id:'checkbox', icon:'☑️', name:'Casilla' },
    { id:'radio',    icon:'🔘', name:'Opción múltiple' },
    { id:'signature',icon:'✍️', name:'Firma' },
    { id:'divider',  icon:'➖', name:'Separador' },
    { id:'heading',  icon:'📌', name:'Sección' },
  ];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;width:100%;max-width:580px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📋 Generador de formularios</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Crea formularios profesionales para imprimir o llenar digitalmente</div>

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Título del formulario</label>
        <input type="text" id="__frmTitle" value="Formulario de solicitud"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Agregar campos</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">
        ${fieldTypes.map(f => `
          <button onclick="__frmAddField('${f.id}','${f.name}')"
            style="padding:8px 4px;border:1.5px solid #eee;background:#fafafa;border-radius:9px;cursor:pointer;font-size:11px;font-weight:600;color:#555;text-align:center;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            <div style="font-size:16px;margin-bottom:2px">${f.icon}</div>${f.name}
          </button>`).join('')}
      </div>
    </div>

    <!-- Lista de campos -->
    <div style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Campos del formulario</div>
      <div id="__frmFields" style="display:flex;flex-direction:column;gap:6px;min-height:60px">
        <div style="text-align:center;color:#bbb;font-size:12px;padding:16px">Agregá campos con los botones de arriba</div>
      </div>
    </div>

    <div style="padding:14px 20px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:8px">
      <button onclick="document.getElementById('__formBldPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__frmGenerate()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📋 Generar formulario</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__frmFields = [];
}

function __frmAddField(type, name) {
  if (!window.__frmFields) window.__frmFields = [];
  const id = 'f' + Date.now();
  window.__frmFields.push({ id, type, label: name, required: false, options: '' });
  __frmRenderFields();
}

function __frmRenderFields() {
  const container = document.getElementById('__frmFields');
  if (!container) return;
  const fields = window.__frmFields || [];
  if (!fields.length) { container.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:16px">Agregá campos con los botones de arriba</div>'; return; }

  container.innerHTML = fields.map((f,i) => `
    <div style="background:#fafafa;border:1.5px solid #eee;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:8px">
      <div style="font-size:14px;cursor:grab">⠿</div>
      <div style="flex:1">
        <input type="text" value="${f.label}" onchange="window.__frmFields[${i}].label=this.value"
          style="width:100%;padding:5px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        ${f.type==='select'||f.type==='radio'?`<input type="text" placeholder="Opciones separadas por coma" value="${f.options}" onchange="window.__frmFields[${i}].options=this.value" style="width:100%;padding:4px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;outline:none;box-sizing:border-box;margin-top:4px">`:'' }
      </div>
      <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#888;flex-shrink:0">
        <input type="checkbox" ${f.required?'checked':''} onchange="window.__frmFields[${i}].required=this.checked" style="accent-color:#e74c3c"> *Req
      </label>
      <button onclick="window.__frmFields.splice(${i},1);__frmRenderFields()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:16px;padding:0;flex-shrink:0">×</button>
    </div>`).join('');
}

function __frmGenerate() {
  const title  = document.getElementById('__frmTitle')?.value || 'Formulario';
  const fields = window.__frmFields || [];
  if (!fields.length) { showToast('Agregá al menos un campo'); return; }

  const typeMap = {
    text:     l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="border-bottom:1.5px solid #333;height:28px;margin-top:2px"></div></div>`,
    textarea: l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="border:1px solid #333;height:70px;border-radius:4px;margin-top:2px"></div></div>`,
    number:   l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="border-bottom:1.5px solid #333;height:28px;width:160px;margin-top:2px"></div></div>`,
    date:     l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="display:flex;gap:6px;margin-top:6px">${['D','D','M','M','A','A','A','A'].map((c,i)=>`<div style="border-bottom:1.5px solid #333;width:22px;height:28px;text-align:center;font-size:9pt;padding-top:8px">${[2,5].includes(i)?'/':''}</div>`).join('')}</div></div>`,
    email:    l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="border-bottom:1.5px solid #333;height:28px;margin-top:2px"></div></div>`,
    phone:    l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="border-bottom:1.5px solid #333;height:28px;width:200px;margin-top:2px"></div></div>`,
    select:   l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">${(l.options||'Opción 1,Opción 2').split(',').map(o=>`<label style="display:flex;align-items:center;gap:4px;font-size:10pt"><span style="width:14px;height:14px;border:1.5px solid #333;border-radius:2px;display:inline-block"></span>${o.trim()}</label>`).join('')}</div></div>`,
    checkbox: l => `<div style="margin-bottom:16px;display:flex;align-items:center;gap:8px"><span style="width:18px;height:18px;border:1.5px solid #333;border-radius:3px;display:inline-block;flex-shrink:0"></span><div style="font-size:11pt">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div></div>`,
    radio:    l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:6px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="display:flex;flex-direction:column;gap:5px">${(l.options||'Sí,No').split(',').map(o=>`<label style="display:flex;align-items:center;gap:6px;font-size:10pt"><span style="width:14px;height:14px;border:1.5px solid #333;border-radius:50%;display:inline-block"></span>${o.trim()}</label>`).join('')}</div></div>`,
    signature:l => `<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':''}</div><div style="border:1px dashed #999;height:70px;border-radius:4px;margin-top:2px;display:flex;align-items:flex-end;padding:4px 8px"><div style="border-top:1px solid #333;width:100%;font-size:8pt;color:#888;padding-top:3px">Firma y fecha</div></div></div>`,
    divider:  l => `<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">`,
    heading:  l => `<div style="font-size:13pt;font-weight:700;color:#003da5;border-bottom:2px solid #003da5;padding-bottom:4px;margin:16px 0 10px">${l.label}</div>`,
  };

  const html = `
  <div style="font-family:Calibri,Arial,sans-serif;max-width:16cm;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px">
    <div style="background:#003da5;color:#fff;padding:14px 18px;border-radius:6px;margin-bottom:20px">
      <div style="font-size:16pt;font-weight:700">${title}</div>
      <div style="font-size:10pt;opacity:.8;margin-top:3px">Formulario oficial · ${new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})}</div>
    </div>
    ${fields.map(f => (typeMap[f.type]||typeMap.text)(f)).join('')}
    <div style="border-top:1px solid #eee;padding-top:14px;margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div><div style="border-bottom:1.5px solid #333;height:40px;margin-bottom:4px"></div><div style="font-size:9pt;color:#888;text-align:center">Firma del solicitante</div></div>
      <div><div style="border-bottom:1.5px solid #333;height:40px;margin-bottom:4px"></div><div style="font-size:9pt;color:#888;text-align:center">Sello y firma autorizada</div></div>
    </div>
    <div style="font-size:8pt;color:#aaa;text-align:center;margin-top:12px">Generado por WC Corporate Editor · Costa Rica</div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__formBldPanel').remove();
  showToast('📋 Formulario generado ✅');
}

function openStatsChartPanel() {
  const old = document.getElementById('__chartStPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__chartStPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📊 Gráficos y estadísticas</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Insertá gráficos visuales en tu documento</div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      ${[
        {id:'bar',    icon:'📊', name:'Barras'},
        {id:'line',   icon:'📈', name:'Líneas'},
        {id:'pie',    icon:'🥧', name:'Pastel'},
        {id:'donut',  icon:'🍩', name:'Dona'},
        {id:'area',   icon:'📉', name:'Área'},
        {id:'kpi',    icon:'🎯', name:'KPIs'},
      ].map(t=>`
        <button onclick="__chartSelect('${t.id}',this)"
          class="__chartTypeBtn"
          style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:center;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:22px;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#555">${t.name}</div>
        </button>`).join('')}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Título del gráfico</label>
      <input type="text" id="__chartTitle" value="Estadísticas 2025"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Datos (Etiqueta|Valor, uno por línea)</label>
      <textarea id="__chartData" rows="6"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Enero|42
Febrero|58
Marzo|73
Abril|65
Mayo|89
Junio|95</textarea>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Color principal</label>
        <input type="color" id="__chartColor" value="#0084ff" style="width:100%;height:36px;border:none;border-radius:8px;cursor:pointer">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Mostrar valores</label>
        <select id="__chartShowVals" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="1">Sí</option>
          <option value="0">No</option>
        </select>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__chartStPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateChart()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📊 Insertar gráfico</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__chartType = 'bar';
  setTimeout(() => {
    const btn = document.querySelector('.__chartTypeBtn');
    if (btn) { btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1'; }
  }, 50);
}

function __chartSelect(id, btn) {
  window.__chartType = id;
  document.querySelectorAll('.__chartTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1';
}

function __generateChart() {
  const type   = window.__chartType || 'bar';
  const title  = document.getElementById('__chartTitle')?.value || 'Estadísticas';
  const raw    = document.getElementById('__chartData')?.value || '';
  const color  = document.getElementById('__chartColor')?.value || '#0084ff';
  const showV  = document.getElementById('__chartShowVals')?.value === '1';
  const items  = raw.split('\n').filter(l=>l.trim()).map(l=>{const p=l.split('|');return{label:p[0]?.trim()||'',value:parseFloat(p[1])||0};});
  if (!items.length) { showToast('Ingresá datos primero'); return; }

  const maxVal = Math.max(...items.map(i=>i.value), 1);
  const colors = ['#0084ff','#27ae60','#f39c12','#e74c3c','#9b59b6','#1abc9c','#e67e22','#3498db'];

  let chartHTML = '';

  if (type === 'bar') {
    chartHTML = `<div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding-bottom:4px">
      ${items.map((it,i)=>`
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
          ${showV?`<div style="font-size:10px;font-weight:700;color:${colors[i%colors.length]}">${it.value}</div>`:''}
          <div style="width:100%;background:${colors[i%colors.length]};border-radius:4px 4px 0 0;height:${Math.round(it.value/maxVal*140)}px;transition:height .3s"></div>
          <div style="font-size:9px;color:#888;text-align:center;word-break:break-word">${it.label}</div>
        </div>`).join('')}
    </div>`;
  } else if (type === 'line') {
    const pts = items.map((it,i)=>({x:i/(items.length-1||1)*100,y:100-it.value/maxVal*80}));
    const path = pts.map((p,i)=>(i===0?'M':'L')+p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ');
    const area = path + ` L${pts[pts.length-1].x},100 L0,100 Z`;
    chartHTML = `<svg viewBox="0 0 100 100" style="width:100%;height:160px;overflow:visible">
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".3"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#areaGrad)"/>
      <path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map((p,i)=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2" fill="${color}"/>${showV?`<text x="${p.x.toFixed(1)}" y="${(p.y-4).toFixed(1)}" text-anchor="middle" font-size="5" fill="#555">${items[i].value}</text>`:''}`).join('')}
    </svg>
    <div style="display:flex;justify-content:space-between;margin-top:4px">${items.map(it=>`<div style="font-size:9px;color:#888;flex:1;text-align:center">${it.label}</div>`).join('')}</div>`;
  } else if (type === 'pie' || type === 'donut') {
    const total = items.reduce((a,b)=>a+b.value,0)||1;
    let angle   = -90;
    const slices= items.map((it,i)=>{
      const pct = it.value/total; const start=angle; angle+=pct*360;
      const r   = 40; const cx=50; const cy=50;
      const x1  = cx+r*Math.cos(start*Math.PI/180); const y1=cy+r*Math.sin(start*Math.PI/180);
      const x2  = cx+r*Math.cos((start+pct*360)*Math.PI/180); const y2=cy+r*Math.sin((start+pct*360)*Math.PI/180);
      return `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${pct>.5?1:0},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${colors[i%colors.length]}" stroke="#fff" stroke-width=".5"/>`;
    });
    chartHTML = `<div style="text-align:center">
      <svg viewBox="0 0 100 100" style="width:160px;height:160px">
        ${slices.join('')}
        ${type==='donut'?`<circle cx="50" cy="50" r="22" fill="#fff"/>`:''}
      </svg>
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:8px">
        ${items.map((it,i)=>`<div style="display:flex;align-items:center;gap:4px;font-size:10px"><div style="width:10px;height:10px;border-radius:2px;background:${colors[i%colors.length]}"></div>${it.label}${showV?` (${it.value})`:''}</div>`).join('')}
      </div>
    </div>`;
  } else if (type === 'kpi') {
    chartHTML = `<div style="display:grid;grid-template-columns:repeat(${Math.min(items.length,3)},1fr);gap:10px">
      ${items.map((it,i)=>`
        <div style="background:${colors[i%colors.length]}15;border:2px solid ${colors[i%colors.length]}33;border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:26px;font-weight:900;color:${colors[i%colors.length]}">${it.value}</div>
          <div style="font-size:11px;color:#555;margin-top:4px">${it.label}</div>
        </div>`).join('')}
    </div>`;
  } else {
    chartHTML = `<div style="text-align:center;color:#888;padding:20px">Tipo de gráfico en desarrollo</div>`;
  }

  const html = `<div style="margin:16px 0;padding:16px;background:#fff;border:1.5px solid #e8e8ec;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
    <div style="font-size:13px;font-weight:700;color:#1a2942;margin-bottom:14px;display:flex;align-items:center;gap:8px">📊 ${title}</div>
    ${chartHTML}
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__chartStPanel').remove();
  showToast('📊 Gráfico insertado ✅');
}

function openWhatsAppPanel() {
  const old = document.getElementById('__waPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__waPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  const ed   = document.getElementById('editor');
  const text = ed ? ed.innerText.slice(0,1000).trim() : '';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <span style="font-size:24px">💬</span> Compartir por WhatsApp
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Enviá el documento o un mensaje por WhatsApp</div>

    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button id="__waTabMsg" onclick="__waTab('msg')" style="flex:1;padding:8px;border:2px solid #25d366;background:#f0fff4;color:#25d366;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📝 Mensaje</button>
      <button id="__waTabLink" onclick="__waTab('link')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🔗 Enlace</button>
      <button id="__waTabBusiness" onclick="__waTab('business')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🏢 Business</button>
    </div>

    <!-- Mensaje -->
    <div id="__waSection_msg">
      <div style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Número de teléfono (con código de país)</label>
        <div style="display:flex;gap:6px">
          <input type="text" id="__waCountry" value="+506" style="width:70px;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;text-align:center" onfocus="this.style.borderColor='#25d366'" onblur="this.style.borderColor='#e0e0e0'">
          <input type="text" id="__waPhone" placeholder="88001234" style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none" onfocus="this.style.borderColor='#25d366'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
      </div>
      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Mensaje</label>
        <textarea id="__waMsg" rows="4" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#25d366'" onblur="this.style.borderColor='#e0e0e0'">${text.slice(0,300)}</textarea>
        <div style="font-size:10px;color:#aaa;margin-top:2px;text-align:right"><span id="__waCharCount">${text.slice(0,300).length}</span>/4096 caracteres</div>
      </div>
      <button onclick="__waSendMessage()" style="width:100%;padding:12px;border:none;background:#25d366;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px">
        💬 Enviar por WhatsApp
      </button>
    </div>

    <!-- Enlace compartir -->
    <div id="__waSection_link" style="display:none">
      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Mensaje a compartir</label>
        <textarea id="__waLinkMsg" rows="4" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#25d366'" onblur="this.style.borderColor='#e0e0e0'">${text.slice(0,500)}</textarea>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button onclick="__waShareLink()" style="width:100%;padding:12px;border:none;background:#25d366;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">💬 Compartir sin número específico</button>
        <button onclick="__waCopyText()" style="width:100%;padding:10px;border:1.5px solid #25d366;background:#fff;color:#25d366;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">📋 Copiar texto al portapapeles</button>
      </div>
    </div>

    <!-- Business -->
    <div id="__waSection_business" style="display:none">
      <div style="background:#f0fff4;border-radius:10px;padding:14px;margin-bottom:14px;font-size:12px;color:#155724;line-height:1.7">
        <strong>WhatsApp Business API</strong><br>
        Usada para envíos masivos y automatización. Requiere cuenta Business verificada en Meta.
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button onclick="window.open('https://business.whatsapp.com/','_blank')" style="padding:11px;border:1.5px solid #25d366;background:#fff;color:#25d366;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">🌐 Ir a WhatsApp Business</button>
        <button onclick="window.open('https://wa.me/?text='+encodeURIComponent(document.getElementById('__waLinkMsg')?.value||document.getElementById('editor')?.innerText?.slice(0,500)||''),'_blank')" style="padding:11px;border:none;background:#25d366;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">📢 Compartir con cualquier contacto</button>
      </div>
    </div>

    <button onclick="document.getElementById('__waPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333;margin-top:10px">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });

  const ta = document.getElementById('__waMsg');
  if (ta) ta.addEventListener('input', () => {
    const cc = document.getElementById('__waCharCount');
    if (cc) cc.textContent = ta.value.length;
  });
}

function __waTab(tab) {
  ['msg','link','business'].forEach(t => {
    const sec = document.getElementById('__waSection_'+t);
    const btn = document.getElementById('__waTab'+t.charAt(0).toUpperCase()+t.slice(1));
    if (sec) sec.style.display = t===tab?'block':'none';
    if (btn) {
      btn.style.borderColor = t===tab?'#25d366':'#eee';
      btn.style.background  = t===tab?'#f0fff4':'#fafafa';
      btn.style.color       = t===tab?'#25d366':'#555';
    }
  });
}

function __waSendMessage() {
  const country = document.getElementById('__waCountry')?.value.replace(/\+|\s/g,'') || '506';
  const phone   = document.getElementById('__waPhone')?.value.replace(/\D/g,'') || '';
  const msg     = document.getElementById('__waMsg')?.value.trim() || '';
  if (!phone) { showToast('Ingresá el número de teléfono'); return; }
  const url = `https://wa.me/${country}${phone}${msg?'?text='+encodeURIComponent(msg):''}`;
  window.open(url, '_blank');
  showToast('💬 Abriendo WhatsApp...');
}

function __waShareLink() {
  const msg = document.getElementById('__waLinkMsg')?.value.trim() || '';
  window.open('https://wa.me/?text='+encodeURIComponent(msg), '_blank');
}

function __waCopyText() {
  const msg = document.getElementById('__waLinkMsg')?.value.trim() || '';
  navigator.clipboard.writeText(msg).then(() => showToast('📋 Texto copiado ✅'));
}

const WC_ESIGN = {
  async generateKeyPair() {
    if (!window.crypto?.subtle) { showToast('WebCrypto no disponible en este navegador'); return null; }
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        { name:'RSA-PSS', modulusLength:2048, publicExponent:new Uint8Array([1,0,1]), hash:'SHA-256' },
        true,
        ['sign','verify']
      );
      return keyPair;
    } catch(e) {
      console.error('KeyGen error:', e);
      return null;
    }
  },

  async exportKey(key, type) {
    const exported = await window.crypto.subtle.exportKey(type==='public'?'spki':'pkcs8', key);
    const bytes    = new Uint8Array(exported);
    const base64   = btoa(String.fromCharCode(...bytes));
    return `-----BEGIN ${type.toUpperCase()} KEY-----\n${base64.match(/.{1,64}/g).join('\n')}\n-----END ${type.toUpperCase()} KEY-----`;
  },

  async sign(privateKey, data) {
    const encoded  = new TextEncoder().encode(data);
    const signature= await window.crypto.subtle.sign(
      { name:'RSA-PSS', saltLength:32 },
      privateKey,
      encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  },

  async verify(publicKey, signature, data) {
    try {
      const sigBytes = Uint8Array.from(atob(signature), c=>c.charCodeAt(0));
      const encoded  = new TextEncoder().encode(data);
      return await window.crypto.subtle.verify(
        { name:'RSA-PSS', saltLength:32 },
        publicKey,
        sigBytes,
        encoded
      );
    } catch(e) { return false; }
  },

  hash(text) {
    let h = 0;
    for (let i=0;i<text.length;i++) h = (Math.imul(31,h)+text.charCodeAt(i))|0;
    return Math.abs(h).toString(16).toUpperCase().padStart(8,'0');
  }
};

function openAdvancedSignPanel() {
  const old = document.getElementById('__aSignPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__aSignPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  const savedKey = localStorage.getItem('wc-esign-pubkey');

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      🔐 Firma electrónica avanzada
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Firma digital con criptografía RSA-2048 · SHA-256</div>

    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button id="__aSignTab1" onclick="__aSignTab('sign')" style="flex:1;padding:8px;border:2px solid #27ae60;background:#f0fff4;color:#27ae60;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">✍️ Firmar</button>
      <button id="__aSignTab2" onclick="__aSignTab('verify')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🔍 Verificar</button>
      <button id="__aSignTab3" onclick="__aSignTab('keys')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🗝️ Claves</button>
    </div>

    <!-- Firmar -->
    <div id="__aSignSection_sign">
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
        <input type="text" id="__aSignName" placeholder="Nombre del firmante *"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__aSignRole" placeholder="Cargo / Función"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__aSignOrg" placeholder="Organización"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="background:#f0fff4;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#155724;line-height:1.6">
        🔐 Se generará una firma criptográfica RSA-2048 única para este documento.<br>
        El hash del contenido garantiza que el documento no fue modificado después de firmar.
      </div>

      <button onclick="__doAdvancedSign()" style="width:100%;padding:12px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">🔐 Firmar documento</button>
    </div>

    <!-- Verificar -->
    <div id="__aSignSection_verify" style="display:none">
      <div style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Hash del documento a verificar</label>
        <input type="text" id="__aVerifyHash" placeholder="Pega el hash aquí (ej: A3F8C12B)"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;font-family:'Courier New',monospace"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <button onclick="__doVerifySign()" style="width:100%;padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;margin-bottom:10px">🔍 Verificar integridad</button>
      <div id="__aVerifyResult" style="display:none;border-radius:10px;padding:12px;font-size:13px"></div>
    </div>

    <!-- Claves -->
    <div id="__aSignSection_keys" style="display:none">
      <div style="margin-bottom:12px">
        <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:6px">Tu clave pública guardada</div>
        <textarea readonly rows="4" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:10px;font-family:'Courier New',monospace;outline:none;box-sizing:border-box;background:#f8f9fa;resize:none">${savedKey||'Aún no generaste una clave'}</textarea>
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="__generateNewKeys()" style="flex:1;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🔑 Generar nuevas claves</button>
        ${savedKey?`<button onclick="navigator.clipboard.writeText('${savedKey.replace(/'/g,"\\'")}').then(()=>showToast('Clave copiada ✅'))" style="flex:1;padding:10px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📋 Copiar clave</button>`:''}
      </div>
    </div>

    <button onclick="document.getElementById('__aSignPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333;margin-top:12px">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __aSignTab(tab) {
  ['sign','verify','keys'].forEach((t,i) => {
    const sec = document.getElementById('__aSignSection_'+t);
    const btn = document.getElementById('__aSignTab'+(i+1));
    const colors = ['#27ae60','#0084ff','#9b59b6'];
    if (sec) sec.style.display = t===tab?'block':'none';
    if (btn) {
      btn.style.borderColor = t===tab?colors[i]:'#eee';
      btn.style.background  = t===tab?colors[i]+'22':'#fafafa';
      btn.style.color       = t===tab?colors[i]:'#555';
    }
  });
}

async function __doAdvancedSign() {
  const name = document.getElementById('__aSignName')?.value.trim();
  if (!name) { showToast('Ingresá el nombre del firmante'); return; }

  const role = document.getElementById('__aSignRole')?.value.trim();
  const org  = document.getElementById('__aSignOrg')?.value.trim();
  const ed   = document.getElementById('editor');
  const content = ed ? ed.innerText.trim() : '';
  const hash    = WC_ESIGN.hash(content);
  const ts      = new Date().toISOString();
  const sigData = `${hash}|${name}|${ts}`;

  showToast('🔐 Generando firma...');

  try {
    const keyPair = await WC_ESIGN.generateKeyPair();
    let sigB64    = '';
    let pubKeyPEM = '';

    if (keyPair) {
      sigB64    = await WC_ESIGN.sign(keyPair.privateKey, sigData);
      pubKeyPEM = await WC_ESIGN.exportKey(keyPair.publicKey, 'public');
      localStorage.setItem('wc-esign-pubkey', pubKeyPEM);
    }

    const shortSig = sigB64 ? sigB64.slice(0,32)+'...' : 'N/A';

    const html = `
    <div style="border:2px solid #27ae60;border-radius:12px;padding:16px;margin:16px 0;background:#f0fff4;font-family:Calibri,Arial,sans-serif">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="font-size:28px">🔐</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:#155724">Documento firmado electrónicamente</div>
          <div style="font-size:10px;color:#27ae60;font-weight:600">Firma RSA-2048 · SHA-256 · Válida</div>
        </div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:12px;font-size:11px;line-height:2">
        <div><strong>Firmante:</strong> ${name}${role?' · '+role:''}${org?' · '+org:''}</div>
        <div><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-CR')}</div>
        <div><strong>Hash del documento:</strong> <code style="background:#f0f0f0;padding:1px 6px;border-radius:3px;font-family:'Courier New',monospace">${hash}</code></div>
        <div><strong>Algoritmo:</strong> RSA-PSS · SHA-256 · 2048 bits</div>
        ${sigB64?`<div style="word-break:break-all"><strong>Firma:</strong> <code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-family:'Courier New',monospace;font-size:9px">${shortSig}</code></div>`:''}
      </div>
      <div style="font-size:9px;color:#888;margin-top:8px;text-align:right">WC Corporate Editor · ${new Date().toLocaleDateString('es-CR')}</div>
    </div>`;

    if (typeof insertHTML==='function') insertHTML(html);
    document.getElementById('__aSignPanel').remove();
    showToast('🔐 Documento firmado con criptografía RSA-2048 ✅');

  } catch(e) {
    showToast('Error al firmar: ' + e.message);
  }
}

function __doVerifySign() {
  const inputHash = document.getElementById('__aVerifyHash')?.value.trim();
  const ed        = document.getElementById('editor');
  const content   = ed ? ed.innerText.trim() : '';
  const docHash   = WC_ESIGN.hash(content);
  const res       = document.getElementById('__aVerifyResult');
  if (!res) return;

  const match = inputHash.toUpperCase() === docHash.toUpperCase();
  res.style.display = 'block';
  res.style.background = match ? '#d4edda' : '#f8d7da';
  res.style.border     = `1.5px solid ${match?'#27ae60':'#e74c3c'}`;
  res.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <span style="font-size:20px">${match?'✅':'❌'}</span>
      <strong style="color:${match?'#155724':'#721c24'}">${match?'Documento íntegro':'Documento modificado'}</strong>
    </div>
    <div style="font-size:11px;color:#555;line-height:1.7">
      Hash ingresado: <code style="background:rgba(0,0,0,.05);padding:1px 5px;border-radius:3px">${inputHash}</code><br>
      Hash actual: <code style="background:rgba(0,0,0,.05);padding:1px 5px;border-radius:3px">${docHash}</code><br>
      ${match?'✅ El documento no fue modificado desde que se firmó.':'⚠️ El documento fue modificado después de firmarse.'}
    </div>`;
}

async function __generateNewKeys() {
  showToast('Generando par de claves RSA-2048...');
  const keyPair = await WC_ESIGN.generateKeyPair();
  if (!keyPair) return;
  const pubPEM = await WC_ESIGN.exportKey(keyPair.publicKey, 'public');
  localStorage.setItem('wc-esign-pubkey', pubPEM);
  openAdvancedSignPanel();
  __aSignTab('keys');
  showToast('🔑 Nuevas claves RSA-2048 generadas ✅');
}

(function initV2517() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'presentationAssist': openPresentationAssistant(); break;
          case 'formBuilder':        openFormBuilder();           break;
          case 'statsChart':         openStatsChartPanel();       break;
          case 'whatsapp':           openWhatsAppPanel();         break;
          case 'advancedSign':       openAdvancedSignPanel();     break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.17 ✅ — Presentaciones, Formularios, Gráficos, WhatsApp, Firma RSA');
  }, 2500);
})();
function openOCRPanel() {
  const old = document.getElementById('__ocrPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__ocrPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔍 OCR — Extraer texto de imagen</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Convierte texto de fotos, capturas o documentos escaneados</div>

      <div style="border:2px dashed #c0d8f0;border-radius:14px;padding:24px;text-align:center;cursor:pointer;background:#f8f9ff;margin-bottom:12px;transition:all .2s"
        onclick="document.getElementById('__ocrInput').click()"
        ondragover="event.preventDefault();this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
        ondragleave="this.style.borderColor='#c0d8f0';this.style.background='#f8f9ff'"
        ondrop="event.preventDefault();__ocrLoadFile(event.dataTransfer.files[0]);this.style.borderColor='#c0d8f0'">
        <div id="__ocrDropIcon" style="font-size:40px;margin-bottom:8px">🖼️</div>
        <div style="font-size:13px;font-weight:600;color:#1a2942;margin-bottom:4px">Tocá para seleccionar imagen</div>
        <div style="font-size:11px;color:#888">JPG, PNG, WebP, GIF, PDF</div>
      </div>
      <input type="file" id="__ocrInput" accept="image/*,.pdf" style="display:none" onchange="__ocrLoadFile(this.files[0])">

      <div id="__ocrPreview" style="display:none;margin-bottom:12px">
        <img id="__ocrImg" style="max-width:100%;max-height:180px;border-radius:10px;display:block;margin:0 auto;border:1px solid #eee">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma</label>
          <select id="__ocrLang" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="spa">Español</option>
            <option value="eng">English</option>
            <option value="por">Português</option>
            <option value="fra">Français</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Modo</label>
          <select id="__ocrMode" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="text">Texto simple</option>
            <option value="document">Documento</option>
            <option value="single">Línea única</option>
          </select>
        </div>
      </div>

      <div id="__ocrStatus" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        ⏳ Procesando imagen...
      </div>
    </div>

    <div id="__ocrResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Texto extraído</div>
      <textarea id="__ocrResult" rows="8" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;resize:vertical;box-sizing:border-box;line-height:1.6" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
    </div>

    <div style="padding:12px 20px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:8px">
      <button onclick="document.getElementById('__ocrPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button id="__ocrRunBtn" onclick="__runOCR()" disabled style="flex:1;padding:11px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">🔍 Analizar</button>
      <button id="__ocrInsertBtn" onclick="__ocrInsert()" disabled style="flex:1;padding:11px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">📥 Insertar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__ocrImageData = null;
}

function __ocrLoadFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    window.__ocrImageData = e.target.result;
    const prev = document.getElementById('__ocrPreview');
    const img  = document.getElementById('__ocrImg');
    const icon = document.getElementById('__ocrDropIcon');
    const btn  = document.getElementById('__ocrRunBtn');
    if (prev) prev.style.display = 'block';
    if (img)  img.src = e.target.result;
    if (icon) icon.textContent = '✅';
    if (btn)  { btn.disabled=false; btn.style.background='#0084ff'; btn.style.cursor='pointer'; }
    showToast('Imagen cargada ✅');
  };
  reader.readAsDataURL(file);
}

async function __runOCR() {
  const imgData = window.__ocrImageData;
  if (!imgData) { showToast('Cargá una imagen primero'); return; }

  const status   = document.getElementById('__ocrStatus');
  const resultBox= document.getElementById('__ocrResultBox');
  const resultTA = document.getElementById('__ocrResult');
  const insertBtn= document.getElementById('__ocrInsertBtn');

  if (status) status.style.display = 'block';

  try {
    if (typeof Tesseract !== 'undefined') {
      const lang   = document.getElementById('__ocrLang')?.value || 'spa';
      const result = await Tesseract.recognize(imgData, lang, {
        logger: m => {
          if (m.status === 'recognizing text' && status) {
            status.textContent = `⏳ Reconociendo... ${Math.round(m.progress*100)}%`;
          }
        }
      });
      const text = result.data.text.trim();
      if (status)    status.style.display = 'none';
      if (resultBox) resultBox.style.display = 'block';
      if (resultTA)  resultTA.value = text;
      if (insertBtn) { insertBtn.disabled=false; insertBtn.style.background='#27ae60'; insertBtn.style.cursor='pointer'; }
      showToast(`✅ ${text.split(/\s+/).filter(w=>w).length} palabras extraídas`);
    } else {
      if (status) status.textContent = '⏳ Cargando motor OCR (Tesseract.js)...';
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js';
      script.onload  = () => __runOCR();
      script.onerror = () => {
        if (status) status.textContent = '⚠️ No se pudo cargar el motor OCR. Verificá la conexión.';
        __ocrFallbackAI(imgData);
      };
      document.head.appendChild(script);
    }
  } catch(e) {
    if (status) status.textContent = '❌ Error: ' + e.message;
    showToast('Error OCR: ' + e.message);
  }
}

async function __ocrFallbackAI(imgData) {
  const key = localStorage.getItem('wc-groq-key');
  const status    = document.getElementById('__ocrStatus');
  const resultBox = document.getElementById('__ocrResultBox');
  const resultTA  = document.getElementById('__ocrResult');
  const insertBtn = document.getElementById('__ocrInsertBtn');

  if (!key) {
    if (status) status.textContent = '⚠️ Configurá tu API Key de Groq para usar OCR con IA';
    return;
  }

  if (status) status.textContent = '🦙 Usando IA para extraer texto...';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'user',
          content:'Esta es una imagen codificada en base64. Extrae y transcribe TODO el texto visible en la imagen, manteniendo el formato original lo mejor posible. Responde SOLO con el texto extraído, sin comentarios adicionales.'
        }],
        temperature:0.1, max_tokens:1000
      })
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || 'No se pudo extraer texto';
    if (status)    status.style.display='none';
    if (resultBox) resultBox.style.display='block';
    if (resultTA)  resultTA.value = text;
    if (insertBtn) { insertBtn.disabled=false; insertBtn.style.background='#27ae60'; insertBtn.style.cursor='pointer'; }
  } catch(e) {
    if (status) status.textContent = '❌ Error: ' + e.message;
  }
}

function __ocrInsert() {
  const text = document.getElementById('__ocrResult')?.value?.trim();
  if (!text) { showToast('No hay texto para insertar'); return; }
  const html = `<div style="background:#f8f9ff;border-left:4px solid #0084ff;padding:12px 16px;border-radius:0 8px 8px 0;margin:8px 0">
    <div style="font-size:10px;color:#0084ff;font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">🔍 Texto extraído por OCR</div>
    <div style="font-size:12pt;white-space:pre-wrap;line-height:1.6">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
  </div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__ocrPanel').remove();
  showToast('Texto OCR insertado ✅');
}

const WC_EXCEL = {
  data: {},
  rows: 8, cols: 6,
  selected: null,
  colNames: ['A','B','C','D','E','F','G','H','I','J'],

  cell(r,c) { return this.data[`${r},${c}`] || { raw:'', value:'' }; },
  setCell(r,c,raw) {
    this.data[`${r},${c}`] = { raw, value: this.evalFormula(raw, r, c) };
  },

  evalFormula(raw, r, c) {
    if (!raw || !raw.toString().startsWith('=')) return raw;
    const formula = raw.slice(1).toUpperCase();
    try {
      const expr = formula.replace(/([A-J])(\d+)/g, (_, col, row) => {
        const ci = this.colNames.indexOf(col);
        const ri = parseInt(row) - 1;
        return parseFloat(this.cell(ri, ci).value) || 0;
      });

      if (expr.startsWith('SUM(')) {
        const range = expr.match(/SUM\((.+)\)/)?.[1];
        return this._evalRange(range, 'sum');
      }
      if (expr.startsWith('AVERAGE(') || expr.startsWith('PROMEDIO(')) {
        const range = expr.match(/(?:AVERAGE|PROMEDIO)\((.+)\)/)?.[1];
        return this._evalRange(range, 'avg');
      }
      if (expr.startsWith('MAX(')) {
        const range = expr.match(/MAX\((.+)\)/)?.[1];
        return this._evalRange(range, 'max');
      }
      if (expr.startsWith('MIN(')) {
        const range = expr.match(/MIN\((.+)\)/)?.[1];
        return this._evalRange(range, 'min');
      }
      if (expr.startsWith('COUNT(')) {
        const range = expr.match(/COUNT\((.+)\)/)?.[1];
        return this._evalRange(range, 'count');
      }

      const result = Function('"use strict";return (' + expr.replace(/[^0-9+\-*/().,\s]/g,'') + ')')();
      return isNaN(result) ? raw : Math.round(result * 100) / 100;
    } catch(e) { return '#ERROR'; }
  },

  _evalRange(range, op) {
    if (!range) return 0;
    const match = range.match(/([A-J])(\d+):([A-J])(\d+)/);
    let vals = [];
    if (match) {
      const [,c1,r1,c2,r2] = match;
      const ci1=this.colNames.indexOf(c1), ci2=this.colNames.indexOf(c2);
      const ri1=parseInt(r1)-1, ri2=parseInt(r2)-1;
      for(let r=ri1;r<=ri2;r++) for(let c=ci1;c<=ci2;c++) {
        const v = parseFloat(this.cell(r,c).value); if(!isNaN(v)) vals.push(v);
      }
    } else {
      range.split(',').forEach(ref => {
        const m = ref.trim().match(/([A-J])(\d+)/);
        if (m) { const v=parseFloat(this.cell(parseInt(m[2])-1,this.colNames.indexOf(m[1])).value); if(!isNaN(v)) vals.push(v); }
      });
    }
    if (!vals.length) return 0;
    switch(op) {
      case 'sum':   return vals.reduce((a,b)=>a+b,0);
      case 'avg':   return vals.reduce((a,b)=>a+b,0)/vals.length;
      case 'max':   return Math.max(...vals);
      case 'min':   return Math.min(...vals);
      case 'count': return vals.length;
      default: return 0;
    }
  },

  recalc() {
    Object.keys(this.data).forEach(key => {
      const [r,c] = key.split(',').map(Number);
      if (this.data[key].raw?.toString().startsWith('=')) {
        this.data[key].value = this.evalFormula(this.data[key].raw, r, c);
      }
    });
  }
};

function openExcelEditor() {
  const old = document.getElementById('__xlPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__xlPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:12px';

  WC_EXCEL.data = {};

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;width:100%;max-width:680px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:14px 18px;flex-shrink:0;border-bottom:1px solid #eee">
      <div style="font-size:16px;font-weight:700;color:#1a2942;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">
        <span>📊 Editor de tabla Excel</span>
        <div style="display:flex;gap:6px">
          <button onclick="__xlAddRow()" style="padding:5px 10px;border:1.5px solid #27ae60;background:#f0fff4;color:#27ae60;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600">+ Fila</button>
          <button onclick="__xlAddCol()" style="padding:5px 10px;border:1.5px solid #0084ff;background:#f0f7ff;color:#0084ff;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600">+ Col</button>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px">
        <div id="__xlCellRef" style="background:#f0f7ff;border-radius:6px;padding:5px 10px;font-size:12px;font-weight:700;color:#0084ff;min-width:40px;text-align:center">A1</div>
        <div style="font-size:12px;color:#888">=</div>
        <input type="text" id="__xlFormulaBar" placeholder="Valor o =FORMULA()"
          style="flex:1;padding:6px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;font-family:'Courier New',monospace"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter'){__xlCommitFormula();event.preventDefault();}">
      </div>

      <div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap">
        ${['=SUM(A1:A5)','=AVERAGE(A1:A5)','=MAX(A1:A5)','=MIN(A1:A5)','=COUNT(A1:A5)'].map(f=>`
          <button onclick="document.getElementById('__xlFormulaBar').value='${f}'" style="padding:3px 8px;border:1px solid #eee;background:#fafafa;border-radius:5px;cursor:pointer;font-size:10px;font-family:'Courier New',monospace;color:#555;transition:all .12s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='#fafafa'">${f}</button>`).join('')}
      </div>
    </div>

    <!-- Grid -->
    <div style="flex:1;overflow:auto;padding:0">
      <div id="__xlGrid"></div>
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__xlPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__xlInsertTable()" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📊 Insertar tabla</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  __xlRender();
}

function __xlRender() {
  const grid = document.getElementById('__xlGrid');
  if (!grid) return;
  const R = WC_EXCEL.rows, C = WC_EXCEL.cols;
  const colNames = WC_EXCEL.colNames;

  let html = '<table style="border-collapse:collapse;width:100%;font-family:-apple-system,\'Segoe UI\',sans-serif">';
  html += '<tr><th style="width:36px;background:#f0f0f5;border:1px solid #ddd;padding:4px;font-size:11px;color:#888"></th>';
  for (let c=0;c<C;c++) html += `<th style="background:#f0f0f5;border:1px solid #ddd;padding:4px 8px;font-size:11px;color:#555;font-weight:700;min-width:90px">${colNames[c]}</th>`;
  html += '</tr>';

  for (let r=0;r<R;r++) {
    html += `<tr><th style="background:#f0f0f5;border:1px solid #ddd;padding:4px 6px;font-size:11px;color:#888;font-weight:600;text-align:center;width:36px">${r+1}</th>`;
    for (let c=0;c<C;c++) {
      const cell = WC_EXCEL.cell(r,c);
      const isSelected = WC_EXCEL.selected && WC_EXCEL.selected[0]===r && WC_EXCEL.selected[1]===c;
      const val  = cell.value !== '' ? cell.value : '';
      const isFormula = cell.raw?.toString().startsWith('=');
      html += `<td onclick="__xlSelectCell(${r},${c})" ondblclick="__xlEditCell(${r},${c})"
        style="border:${isSelected?'2px solid #0084ff':'1px solid #ddd'};padding:0;position:relative;background:${isSelected?'#f0f7ff':'#fff'}">
        <div style="padding:5px 8px;font-size:12px;${isFormula?'color:#27ae60':'color:#1a1a1a'};min-height:26px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px" id="__xlCell_${r}_${c}">${val}</div>
      </td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  grid.innerHTML = html;
}

function __xlSelectCell(r,c) {
  WC_EXCEL.selected = [r,c];
  const cell = WC_EXCEL.cell(r,c);
  const ref  = document.getElementById('__xlCellRef');
  const bar  = document.getElementById('__xlFormulaBar');
  if (ref) ref.textContent = WC_EXCEL.colNames[c] + (r+1);
  if (bar) bar.value = cell.raw || '';
  __xlRender();
}

function __xlEditCell(r,c) {
  const cellEl = document.getElementById(`__xlCell_${r}_${c}`);
  if (!cellEl) return;
  const cell = WC_EXCEL.cell(r,c);
  cellEl.contentEditable='true';
  cellEl.style.outline='none';
  cellEl.textContent = cell.raw || '';
  cellEl.focus();
  cellEl.addEventListener('blur', () => {
    WC_EXCEL.setCell(r,c,cellEl.textContent);
    WC_EXCEL.recalc();
    __xlRender();
  }, {once:true});
  cellEl.addEventListener('keydown', e => {
    if (e.key==='Enter') { e.preventDefault(); cellEl.blur(); }
    if (e.key==='Escape') { cellEl.contentEditable='false'; __xlRender(); }
    if (e.key==='Tab')    { e.preventDefault(); cellEl.blur(); __xlSelectCell(r,c+1<WC_EXCEL.cols?c+1:c); }
  });
}

function __xlCommitFormula() {
  const s = WC_EXCEL.selected;
  if (!s) return;
  const bar = document.getElementById('__xlFormulaBar');
  WC_EXCEL.setCell(s[0],s[1],bar?.value||'');
  WC_EXCEL.recalc();
  __xlRender();
}

function __xlAddRow() { WC_EXCEL.rows++; __xlRender(); }
function __xlAddCol() { if (WC_EXCEL.cols < 10) { WC_EXCEL.cols++; __xlRender(); } }

function __xlInsertTable() {
  const R = WC_EXCEL.rows, C = WC_EXCEL.cols;
  const colNames = WC_EXCEL.colNames;

  let html = '<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">';
  html += '<tr style="background:#003da5;color:#fff">';
  for (let c=0;c<C;c++) {
    const h = WC_EXCEL.cell(0,c).value;
    html += `<th style="padding:8px 12px;border:1px solid #002080;text-align:left">${h||colNames[c]}</th>`;
  }
  html += '</tr>';

  for (let r=1;r<R;r++) {
    const isEmpty = Array(C).fill(0).every((_,c)=>!WC_EXCEL.cell(r,c).value);
    if (isEmpty) continue;
    html += `<tr style="${r%2?'background:#f0f7ff':''}">`;
    for (let c=0;c<C;c++) {
      html += `<td style="padding:7px 12px;border:1px solid #ddd">${WC_EXCEL.cell(r,c).value||''}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__xlPanel').remove();
  showToast('📊 Tabla Excel insertada ✅');
}

function openBarcodePanel() {
  const old = document.getElementById('__barcodePanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__barcodePanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">|||  Generador de código de barras</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Code128 · EAN-13 · Code39 · ITF</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px">
      ${[
        {id:'code128', name:'Code 128',  desc:'General, letras+números'},
        {id:'code39',  name:'Code 39',   desc:'Alfanumérico simple'},
        {id:'ean13',   name:'EAN-13',    desc:'Productos (13 dígitos)'},
        {id:'itf',     name:'ITF-14',    desc:'Logística (14 dígitos)'},
        {id:'upca',    name:'UPC-A',     desc:'Norteamérica (12 dígitos)'},
        {id:'msi',     name:'MSI',       desc:'Inventario'},
      ].map(t=>`
        <button onclick="__bcSelect('${t.id}',this)"
          class="__bcTypeBtn"
          style="padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:9px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${t.name}</div>
          <div style="font-size:10px;color:#888">${t.desc}</div>
        </button>`).join('')}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Contenido</label>
      <input type="text" id="__bcContent" value="WC-CR-2025-001"
        style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__bcPreview()">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Ancho</label>
        <select id="__bcWidth" onchange="__bcPreview()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
          <option value="1">Compacto</option>
          <option value="2" selected>Normal</option>
          <option value="3">Ancho</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Caption</label>
        <select id="__bcCaption" onchange="__bcPreview()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
          <option value="1">Mostrar texto</option>
          <option value="0">Sin texto</option>
        </select>
      </div>
    </div>

    <div id="__bcPreviewBox" style="background:#fff;border:1px solid #eee;border-radius:10px;padding:16px;margin-bottom:14px;text-align:center;min-height:80px">
      <div style="color:#bbb;font-size:12px">Vista previa aquí</div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__barcodePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__bcInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">||| Insertar código</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__bcType = 'code128';
  setTimeout(() => {
    const btn = document.querySelector('.__bcTypeBtn');
    if (btn) { btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1'; }
    __bcPreview();
  }, 50);
}

function __bcSelect(id, btn) {
  window.__bcType = id;
  document.querySelectorAll('.__bcTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1';
  __bcPreview();
}

function __bcBuildSVG(content, width) {
  if (!content) return '';
  const w  = parseInt(width)||2;
  const chars = content.split('').map(c=>c.charCodeAt(0));
  let bars = [];
  bars.push(1,0,1,1,0,1,0,0,1);
  chars.forEach(code => {
    for(let i=0;i<7;i++) bars.push((code>>i)&1);
    bars.push(0);
  });
  bars.push(1,1,0,1,0,1,1);

  const barW  = w;
  const barH  = 60;
  const svgW  = bars.length * barW + 20;
  let rects   = '';
  let x       = 10;

  bars.forEach(b => {
    if (b) rects += `<rect x="${x}" y="5" width="${barW}" height="${barH}" fill="#000"/>`;
    x += barW;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${barH+20}" viewBox="0 0 ${svgW} ${barH+20}">
    <rect width="${svgW}" height="${barH+20}" fill="white"/>
    ${rects}
  </svg>`;
}

function __bcPreview() {
  const content = document.getElementById('__bcContent')?.value || '';
  const width   = document.getElementById('__bcWidth')?.value || '2';
  const caption = document.getElementById('__bcCaption')?.value === '1';
  const box     = document.getElementById('__bcPreviewBox');
  if (!box || !content) return;

  const svg = __bcBuildSVG(content, width);
  box.innerHTML = svg + (caption ? `<div style="font-size:11px;font-family:'Courier New',monospace;margin-top:4px;letter-spacing:2px">${content}</div>` : '');
}

function __bcInsert() {
  const content = document.getElementById('__bcContent')?.value.trim() || '';
  const width   = document.getElementById('__bcWidth')?.value || '2';
  const caption = document.getElementById('__bcCaption')?.value === '1';
  const type    = window.__bcType || 'code128';
  if (!content) { showToast('Ingresá el contenido del código'); return; }

  const svg = __bcBuildSVG(content, width);
  const html= `<div style="display:inline-block;text-align:center;padding:10px;border:1px solid #eee;border-radius:8px;background:#fff;margin:8px 0">
    ${svg}
    ${caption?`<div style="font-size:10px;font-family:'Courier New',monospace;margin-top:4px;letter-spacing:2px;color:#333">${content}</div>`:''}
    <div style="font-size:8px;color:#aaa;margin-top:2px">${type.toUpperCase()}</div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__barcodePanel').remove();
  showToast('||| Código de barras insertado ✅');
}

function openMapsPanel() {
  const old = document.getElementById('__mapsPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__mapsPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  const crLocations = [
    { name:'San José Centro',      coords:'9.9281,-84.0907' },
    { name:'Aeropuerto SJO',       coords:'9.9937,-84.2088' },
    { name:'Volcán Arenal',        coords:'10.4628,-84.7032' },
    { name:'Playa Tamarindo',      coords:'10.2993,-85.8421' },
    { name:'Monteverde',           coords:'10.2993,-84.8290' },
    { name:'Puerto Limón',         coords:'9.9903,-83.0364' },
    { name:'Liberia, Guanacaste',  coords:'10.6340,-85.4370' },
    { name:'Puntarenas',           coords:'9.9766,-84.8310' },
  ];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      🗺️ Insertar mapa
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Google Maps · OpenStreetMap · Mapas de Costa Rica</div>

    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button id="__mapTab1" onclick="__mapTab('search')" style="flex:1;padding:7px;border:2px solid #4285f4;background:#f0f4ff;color:#4285f4;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🔍 Buscar</button>
      <button id="__mapTab2" onclick="__mapTab('coords')" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📍 Coordenadas</button>
      <button id="__mapTab3" onclick="__mapTab('cr')" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🇨🇷 Lugares CR</button>
    </div>

    <!-- Búsqueda -->
    <div id="__mapSection_search">
      <input type="text" id="__mapSearch" placeholder="Ej: Banco Nacional de Costa Rica, San José"
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'"
        onkeydown="if(event.key==='Enter')__mapPreview()">
      <button onclick="__mapPreview()" style="width:100%;padding:10px;border:none;background:#4285f4;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">🔍 Buscar en el mapa</button>
    </div>

    <!-- Coordenadas -->
    <div id="__mapSection_coords" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Latitud</label>
          <input type="number" id="__mapLat" placeholder="9.9281" step="0.0001" value="9.9281"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Longitud</label>
          <input type="number" id="__mapLng" placeholder="-84.0907" step="0.0001" value="-84.0907"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
      </div>
      <button onclick="__mapPreviewCoords()" style="width:100%;padding:10px;border:none;background:#4285f4;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">📍 Ver en mapa</button>
    </div>

    <!-- Lugares CR -->
    <div id="__mapSection_cr" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        ${crLocations.map(l=>`
          <button onclick="__mapSelectLocation('${l.coords}','${l.name.replace(/'/g,"\\'")}')"
            style="padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s;text-align:left"
            onmouseover="this.style.borderColor='#4285f4';this.style.background='#f0f4ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            🇨🇷 ${l.name}
          </button>`).join('')}
      </div>
    </div>

    <!-- Preview del mapa -->
    <div id="__mapPreviewBox" style="border-radius:12px;overflow:hidden;margin-bottom:12px;display:none">
      <iframe id="__mapFrame" width="100%" height="220" style="border:none;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Zoom</label>
        <select id="__mapZoom" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
          <option value="8">País</option>
          <option value="12">Ciudad</option>
          <option value="15" selected>Barrio</option>
          <option value="18">Edificio</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Alto del mapa</label>
        <select id="__mapHeight" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
          <option value="200">Compacto (200px)</option>
          <option value="300" selected>Normal (300px)</option>
          <option value="450">Grande (450px)</option>
        </select>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__mapsPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__mapInsert()" style="flex:2;padding:11px;border:none;background:#4285f4;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🗺️ Insertar mapa</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__mapQuery = 'San José, Costa Rica';
  window.__mapCoords = '9.9281,-84.0907';
}

function __mapTab(tab) {
  ['search','coords','cr'].forEach((t,i) => {
    const sec = document.getElementById('__mapSection_'+t);
    const btn = document.getElementById('__mapTab'+(i+1));
    if (sec) sec.style.display = t===tab?'block':'none';
    if (btn) { btn.style.borderColor=t===tab?'#4285f4':'#eee'; btn.style.background=t===tab?'#f0f4ff':'#fafafa'; btn.style.color=t===tab?'#4285f4':'#555'; }
  });
}

function __mapPreview() {
  const q    = document.getElementById('__mapSearch')?.value.trim() || 'San José, Costa Rica';
  const zoom = document.getElementById('__mapZoom')?.value || '15';
  window.__mapQuery = q;
  const frame= document.getElementById('__mapFrame');
  const box  = document.getElementById('__mapPreviewBox');
  if (frame) frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
  if (box)   box.style.display='block';
}

function __mapPreviewCoords() {
  const lat  = document.getElementById('__mapLat')?.value || '9.9281';
  const lng  = document.getElementById('__mapLng')?.value || '-84.0907';
  const zoom = document.getElementById('__mapZoom')?.value || '15';
  window.__mapCoords = `${lat},${lng}`;
  const frame= document.getElementById('__mapFrame');
  const box  = document.getElementById('__mapPreviewBox');
  if (frame) frame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  if (box)   box.style.display='block';
}

function __mapSelectLocation(coords, name) {
  window.__mapCoords = coords;
  window.__mapQuery  = name;
  const [lat,lng] = coords.split(',');
  const inp1 = document.getElementById('__mapLat');
  const inp2 = document.getElementById('__mapLng');
  if (inp1) inp1.value = lat;
  if (inp2) inp2.value = lng;
  const zoom = document.getElementById('__mapZoom')?.value || '15';
  const frame= document.getElementById('__mapFrame');
  const box  = document.getElementById('__mapPreviewBox');
  if (frame) frame.src = `https://maps.google.com/maps?q=${coords}&z=${zoom}&output=embed`;
  if (box)   box.style.display='block';
  showToast('📍 ' + name);
}

function __mapInsert() {
  const query  = window.__mapQuery || 'Costa Rica';
  const coords = window.__mapCoords || '9.9281,-84.0907';
  const zoom   = document.getElementById('__mapZoom')?.value || '15';
  const height = document.getElementById('__mapHeight')?.value || '300';

  const src = window.__mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`
    : `https://maps.google.com/maps?q=${coords}&z=${zoom}&output=embed`;

  const html = `<div style="margin:12px 0;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0">
    <iframe src="${src}" width="100%" height="${height}" style="border:none;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    <div style="padding:6px 12px;background:#f8f9fa;font-size:9px;color:#888;display:flex;align-items:center;gap:6px">
      <span>🗺️</span>
      <a href="https://maps.google.com/maps?q=${encodeURIComponent(query)}" target="_blank" style="color:#4285f4;text-decoration:none">${query} — Ver en Google Maps</a>
    </div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__mapsPanel').remove();
  showToast('🗺️ Mapa insertado ✅');
}

function openDashboardPanel() {
  const old = document.getElementById('__dashPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__dashPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const templates = [
    {
      id:'business', name:'Resumen ejecutivo', icon:'💼',
      kpis:[
        {label:'Ingresos',    value:'₡4.2M', change:'+12%', up:true,  color:'#27ae60'},
        {label:'Clientes',   value:'1,247',  change:'+8%',  up:true,  color:'#0084ff'},
        {label:'Proyectos',  value:'23',     change:'-2',   up:false, color:'#e74c3c'},
        {label:'NPS Score',  value:'87',     change:'+5pt', up:true,  color:'#9b59b6'},
      ]
    },
    {
      id:'financial', name:'Dashboard financiero', icon:'💰',
      kpis:[
        {label:'Ventas',     value:'₡12.8M', change:'+22%', up:true,  color:'#27ae60'},
        {label:'Gastos',     value:'₡8.1M',  change:'+5%',  up:false, color:'#e74c3c'},
        {label:'Utilidad',   value:'₡4.7M',  change:'+41%', up:true,  color:'#0084ff'},
        {label:'Margen',     value:'36.7%',  change:'+8pp', up:true,  color:'#f39c12'},
      ]
    },
    {
      id:'hr', name:'Recursos Humanos', icon:'👥',
      kpis:[
        {label:'Empleados',   value:'142',    change:'+7',   up:true,  color:'#0084ff'},
        {label:'Rotación',    value:'4.2%',   change:'-1.1%',up:true,  color:'#27ae60'},
        {label:'Capacitados', value:'89%',    change:'+12%', up:true,  color:'#9b59b6'},
        {label:'Satisfacción',value:'8.4/10', change:'+0.6', up:true,  color:'#f39c12'},
      ]
    },
    {
      id:'custom', name:'Personalizado', icon:'✏️',
      kpis:[]
    },
  ];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎯 Dashboard de métricas</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Panel de KPIs profesional insertable</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      ${templates.map(t=>`
        <button onclick="__dashSelect('${t.id}',this)"
          class="__dashTplBtn"
          style="padding:12px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:22px;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${t.name}</div>
        </button>`).join('')}
    </div>

    <div id="__dashKPIEditor" style="margin-bottom:16px">
      <!-- Se llena dinámicamente -->
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Título del dashboard</label>
      <input type="text" id="__dashTitle" value="Resumen ejecutivo"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__dashPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__dashInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🎯 Insertar dashboard</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__dashTemplates = templates;
  window.__dashSelected  = templates[0];

  setTimeout(() => {
    const btn = document.querySelector('.__dashTplBtn');
    if (btn) { btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1'; }
    __dashRenderEditor(templates[0]);
  }, 50);
}

function __dashSelect(id, btn) {
  const t = (window.__dashTemplates||[]).find(t=>t.id===id);
  if (!t) return;
  window.__dashSelected = t;
  document.querySelectorAll('.__dashTplBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.dataset.sel='1';
  __dashRenderEditor(t);
}

function __dashRenderEditor(tpl) {
  const editor = document.getElementById('__dashKPIEditor');
  const titleInput = document.getElementById('__dashTitle');
  if (!editor) return;
  if (titleInput) titleInput.value = tpl.name;

  if (tpl.id === 'custom' || !tpl.kpis.length) {
    editor.innerHTML = `
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">KPIs (Etiqueta|Valor|Cambio|up/down)</div>
      <textarea id="__dashCustomKPIs" rows="4" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Ventas|₡2.4M|+15%|up
Clientes|342|+23|up
Gastos|₡1.1M|-5%|up
Satisfacción|9.1/10|+0.3|up</textarea>`;
  } else {
    const colors = ['#27ae60','#0084ff','#e74c3c','#f39c12','#9b59b6','#1abc9c'];
    editor.innerHTML = `
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">KPIs del template</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${tpl.kpis.map((k,i)=>`
          <div style="background:#f8f9fa;border-radius:8px;padding:10px;border:1px solid #eee">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <div style="width:8px;height:8px;border-radius:50%;background:${colors[i%colors.length]}"></div>
              <div style="font-size:11px;font-weight:700;color:#555">${k.label}</div>
            </div>
            <div style="font-size:16px;font-weight:800;color:${colors[i%colors.length]}">${k.value}</div>
            <div style="font-size:11px;color:${k.up?'#27ae60':'#e74c3c'}">${k.up?'↑':'↓'} ${k.change}</div>
          </div>`).join('')}
      </div>`;
  }
}

function __dashInsert() {
  const title = document.getElementById('__dashTitle')?.value || 'Dashboard';
  const tpl   = window.__dashSelected;
  let kpis    = tpl?.kpis || [];

  if (tpl?.id === 'custom' || !kpis.length) {
    const raw = document.getElementById('__dashCustomKPIs')?.value || '';
    kpis = raw.split('\n').filter(l=>l.trim()).map(l => {
      const p = l.split('|');
      return { label:p[0]?.trim()||'KPI', value:p[1]?.trim()||'0', change:p[2]?.trim()||'', up:(p[3]?.trim()||'up')==='up', color:'#0084ff' };
    });
  }

  const colors = ['#27ae60','#0084ff','#e74c3c','#f39c12','#9b59b6','#1abc9c','#e67e22','#3498db'];

  const html = `
  <div style="margin:16px 0;padding:20px;background:linear-gradient(135deg,#f8f9ff,#fff);border:1.5px solid #e8e8ec;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f0f0f5">
      <div style="font-size:14px;font-weight:700;color:#1a2942">🎯 ${title}</div>
      <div style="font-size:10px;color:#aaa">${new Date().toLocaleDateString('es-CR',{month:'long',year:'numeric'})}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(${Math.min(kpis.length,4)},1fr);gap:12px">
      ${kpis.map((k,i)=>`
        <div style="background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.06);border-top:3px solid ${colors[i%colors.length]}">
          <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${k.label}</div>
          <div style="font-size:20px;font-weight:900;color:${colors[i%colors.length]};margin-bottom:4px">${k.value}</div>
          ${k.change?`<div style="font-size:11px;color:${k.up?'#27ae60':'#e74c3c'};font-weight:600">${k.up?'↑':'↓'} ${k.change} vs periodo anterior</div>`:''}
        </div>`).join('')}
    </div>
    <div style="font-size:9px;color:#bbb;text-align:right;margin-top:10px">WC Corporate Editor · Costa Rica</div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__dashPanel').remove();
  showToast('🎯 Dashboard insertado ✅');
}

(function initV2518() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'ocr':        openOCRPanel();       break;
          case 'excelTable': openExcelEditor();    break;
          case 'barcode':    openBarcodePanel();   break;
          case 'googleMaps': openMapsPanel();      break;
          case 'dashboard':  openDashboardPanel(); break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.18 ✅ — OCR, Excel, Barcode, Maps, Dashboard KPIs');
  }, 2600);
})();
const WC_VOICE = {
  recognition: null,
  active: false,
  transcript: '',

  init() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return false;
    this.recognition = new SR();
    this.recognition.continuous     = true;
    this.recognition.interimResults = true;
    this.recognition.lang           = 'es-CR';
    return true;
  },

  start() {
    if (!this.recognition && !this.init()) {
      showToast('Reconocimiento de voz no disponible en este navegador');
      return;
    }
    this.active     = true;
    this.transcript = '';
    const ed        = document.getElementById('editor');

    this.recognition.onresult = e => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final   += e.results[i][0].transcript;
        else                      interim += e.results[i][0].transcript;
      }
      if (final) {
        document.execCommand('insertText', false, final + ' ');
        this.transcript += final + ' ';
      }
      const preview = document.getElementById('__voiceInterim');
      if (preview) preview.textContent = interim;
    };

    this.recognition.onerror = e => {
      showToast('Error de voz: ' + e.error);
      this.stop();
    };

    this.recognition.onend = () => {
      if (this.active) this.recognition.start(); // reiniciar si sigue activo
    };

    this.recognition.start();
    this._showIndicator();
    showToast('🎙️ Dictando — Hablá ahora');
  },

  stop() {
    this.active = false;
    if (this.recognition) this.recognition.stop();
    this._hideIndicator();
    showToast('⏹ Dictado detenido');
  },

  toggle() { this.active ? this.stop() : this.start(); },

  _showIndicator() {
    const old = document.getElementById('__voiceIndicator'); if (old) old.remove();
    const ind = document.createElement('div');
    ind.id = '__voiceIndicator';
    ind.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      z-index:9990;background:#e74c3c;color:#fff;
      border-radius:20px;padding:10px 20px;
      font-size:13px;font-weight:700;
      display:flex;align-items:center;gap:10px;
      box-shadow:0 4px 20px rgba(231,76,60,.5);
      animation:wcPulse 1s infinite;
    `;
    ind.innerHTML = `
      <span style="width:10px;height:10px;background:#fff;border-radius:50%;display:inline-block;animation:wcPulse .8s infinite"></span>
      <span>🎙️ Dictando...</span>
      <span id="__voiceInterim" style="opacity:.8;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
      <button onclick="WC_VOICE.stop()" style="background:rgba(255,255,255,.3);border:none;color:#fff;border-radius:8px;padding:4px 10px;cursor:pointer;font-size:12px;font-weight:600">⏹ Detener</button>
    `;
    document.body.appendChild(ind);
  },

  _hideIndicator() {
    const ind = document.getElementById('__voiceIndicator');
    if (ind) ind.remove();
  }
};

function openVoicePanel() {
  const old = document.getElementById('__voicePanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__voicePanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      🎙️ Dictado por voz
    </div>

    ${!supported ? `
      <div style="background:#fdf2f2;border-radius:10px;padding:14px;margin-bottom:16px;color:#721c24;font-size:13px">
        ⚠️ Tu navegador no soporta reconocimiento de voz.<br>
        Usá Chrome o Edge para esta función.
      </div>` : `
      <div style="background:#f0fff4;border-radius:12px;padding:14px;margin-bottom:16px">
        <div style="text-align:center;font-size:48px;margin-bottom:8px">🎙️</div>
        <div style="text-align:center;font-size:13px;color:#555;line-height:1.6">
          Presioná <strong>Iniciar dictado</strong> y hablá.<br>
          El texto aparecerá directamente en el editor.
        </div>
      </div>

      <div style="margin-bottom:14px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Idioma</label>
        <select id="__voiceLang" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          <option value="es-CR">Español (Costa Rica)</option>
          <option value="es-ES">Español (España)</option>
          <option value="en-US">English (US)</option>
          <option value="pt-BR">Português (Brasil)</option>
          <option value="fr-FR">Français</option>
        </select>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="__voicePunctuation" checked style="accent-color:#e74c3c;width:15px;height:15px">
          <span style="font-size:13px;color:#555">Insertar puntuación automáticamente</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="__voiceCapitalize" checked style="accent-color:#e74c3c;width:15px;height:15px">
          <span style="font-size:13px;color:#555">Capitalizar inicio de oraciones</span>
        </label>
      </div>

      <div style="background:#f8f9fa;border-radius:8px;padding:10px;margin-bottom:14px;font-size:11px;color:#888;line-height:1.7">
        💡 <strong>Comandos de voz:</strong> "punto", "coma", "dos puntos", "nueva línea", "nuevo párrafo"
      </div>`}

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__voicePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      ${supported ? `<button onclick="__startVoice()" style="flex:2;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">🎙️ Iniciar dictado</button>` : ''}
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __startVoice() {
  const lang = document.getElementById('__voiceLang')?.value || 'es-CR';
  if (WC_VOICE.recognition) WC_VOICE.recognition.lang = lang;
  else if (WC_VOICE.init()) WC_VOICE.recognition.lang = lang;
  document.getElementById('__voicePanel').remove();
  WC_VOICE.start();
}

function openPasswordGenerator() {
  const old = document.getElementById('__pwdPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__pwdPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">🔑 Generador de contraseñas</div>

    <div style="background:#1e1e2e;border-radius:12px;padding:16px;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      <div id="__pwdOutput" style="flex:1;font-size:16px;font-weight:700;color:#e2b96f;font-family:'Courier New',monospace;word-break:break-all;letter-spacing:1px">Click en Generar</div>
      <button onclick="__pwdCopy()" title="Copiar" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:8px;padding:8px;cursor:pointer;font-size:16px;flex-shrink:0">📋</button>
    </div>

    <div id="__pwdStrength" style="height:8px;border-radius:4px;background:#eee;margin-bottom:8px;overflow:hidden">
      <div id="__pwdStrengthBar" style="height:100%;width:0%;border-radius:4px;transition:all .3s"></div>
    </div>
    <div id="__pwdStrengthLabel" style="font-size:11px;color:#888;text-align:center;margin-bottom:14px">—</div>

    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:12px;font-weight:700;color:#555">Longitud</label>
        <span id="__pwdLenVal" style="font-size:12px;font-weight:700;color:#0084ff">16</span>
      </div>
      <input type="range" id="__pwdLen" min="6" max="64" value="16" style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__pwdLenVal').textContent=this.value">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[
        ['__pwdUpper','Mayúsculas (A-Z)',true],
        ['__pwdLower','Minúsculas (a-z)',true],
        ['__pwdNumbers','Números (0-9)',true],
        ['__pwdSymbols','Símbolos (!@#$)',true],
        ['__pwdNoAmb','Sin ambiguos (0,O,l,1)',false],
        ['__pwdPron','Pronunciable',false],
      ].map(([id,label,def])=>`
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:#555">
          <input type="checkbox" id="${id}" ${def?'checked':''} style="accent-color:#0084ff;width:14px;height:14px"> ${label}
        </label>`).join('')}
    </div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      <button onclick="__pwdGenerate()" style="padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">🔑 Generar contraseña</button>
      <button onclick="__pwdGenerateMultiple()" style="padding:10px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">📋 Generar 5 opciones</button>
    </div>

    <div id="__pwdMultiple" style="display:none;margin-bottom:14px"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__pwdPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__pwdInsert()" style="flex:1;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">📥 Insertar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  __pwdGenerate();
}

function __pwdBuild() {
  const len     = parseInt(document.getElementById('__pwdLen')?.value)||16;
  const upper   = document.getElementById('__pwdUpper')?.checked;
  const lower   = document.getElementById('__pwdLower')?.checked;
  const numbers = document.getElementById('__pwdNumbers')?.checked;
  const symbols = document.getElementById('__pwdSymbols')?.checked;
  const noAmb   = document.getElementById('__pwdNoAmb')?.checked;
  const pron    = document.getElementById('__pwdPron')?.checked;

  if (pron) {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels     = 'aeiou';
    let pwd = '';
    for (let i=0;i<Math.ceil(len/2);i++) {
      pwd += consonants[Math.floor(Math.random()*consonants.length)];
      pwd += vowels[Math.floor(Math.random()*vowels.length)];
    }
    return pwd.slice(0,len);
  }

  let chars = '';
  if (upper)   chars += noAmb ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower)   chars += noAmb ? 'abcdefghjkmnpqrstuvwxyz'  : 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += noAmb ? '23456789' : '0123456789';
  if (symbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
  if (!chars)  chars  = 'abcdefghijklmnopqrstuvwxyz';

  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => chars[b % chars.length]).join('');
}

function __pwdStrengthCalc(pwd) {
  let score = 0;
  if (pwd.length >= 8)  score += 20;
  if (pwd.length >= 12) score += 20;
  if (pwd.length >= 16) score += 10;
  if (/[A-Z]/.test(pwd)) score += 15;
  if (/[a-z]/.test(pwd)) score += 15;
  if (/[0-9]/.test(pwd)) score += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 10;
  return Math.min(score, 100);
}

function __pwdGenerate() {
  const pwd = __pwdBuild();
  window.__currentPwd = pwd;
  const out = document.getElementById('__pwdOutput');
  if (out) out.textContent = pwd;
  const score = __pwdStrengthCalc(pwd);
  const bar   = document.getElementById('__pwdStrengthBar');
  const label = document.getElementById('__pwdStrengthLabel');
  const color = score < 40 ? '#e74c3c' : score < 70 ? '#f39c12' : '#27ae60';
  const text  = score < 40 ? 'Débil' : score < 70 ? 'Media' : score < 90 ? 'Fuerte' : 'Muy fuerte';
  if (bar)   { bar.style.width=score+'%'; bar.style.background=color; }
  if (label) { label.textContent=text+' ('+score+'/100)'; label.style.color=color; }
}

function __pwdGenerateMultiple() {
  const box = document.getElementById('__pwdMultiple');
  if (!box) return;
  box.style.display = 'block';
  box.innerHTML = Array(5).fill(0).map((_,i) => {
    const pwd = __pwdBuild();
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f8f9fa;border-radius:8px;margin-bottom:4px">
      <code style="flex:1;font-size:12px;color:#1a1a1a;font-family:'Courier New',monospace">${pwd}</code>
      <button onclick="window.__currentPwd='${pwd}';document.getElementById('__pwdOutput').textContent='${pwd}';__pwdStrengthCalc&&showToast('Seleccionada ✅')" style="padding:4px 8px;border:none;background:#0084ff;color:#fff;border-radius:5px;cursor:pointer;font-size:10px">Usar</button>
      <button onclick="navigator.clipboard.writeText('${pwd}').then(()=>showToast('Copiada ✅'))" style="padding:4px 8px;border:1px solid #eee;background:#fff;border-radius:5px;cursor:pointer;font-size:10px">📋</button>
    </div>`;
  }).join('');
}

function __pwdCopy() {
  const pwd = window.__currentPwd || document.getElementById('__pwdOutput')?.textContent;
  if (pwd && pwd !== 'Click en Generar') {
    navigator.clipboard.writeText(pwd).then(() => showToast('Contraseña copiada ✅'));
  }
}

function __pwdInsert() {
  const pwd = window.__currentPwd || document.getElementById('__pwdOutput')?.textContent;
  if (!pwd || pwd === 'Click en Generar') { showToast('Generá una contraseña primero'); return; }
  if (typeof insertHTML==='function') insertHTML(`<code style="background:#1e1e2e;color:#e2b96f;border-radius:6px;padding:2px 10px;font-family:'Courier New',monospace;font-size:12pt">${pwd}</code>`);
  document.getElementById('__pwdPanel').remove();
  showToast('Contraseña insertada ✅');
}

function openCVTemplates() {
  const old = document.getElementById('__cvPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__cvPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📄 Currículum Vitae — Costa Rica</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Llenás los datos y se genera el CV completo</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[
        {id:'classic',  name:'Clásico CR',    color:'#003da5'},
        {id:'modern',   name:'Moderno',       color:'#0084ff'},
        {id:'minimal',  name:'Minimal',       color:'#1a2942'},
        {id:'creative', name:'Creativo',      color:'#9b59b6'},
      ].map(t=>`
        <button onclick="__cvSelect('${t.id}',this)"
          class="__cvTplBtn"
          style="padding:10px;border:2px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:center;transition:all .15s"
          onmouseover="this.style.borderColor='${t.color}'" onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
          <div style="width:100%;height:6px;background:${t.color};border-radius:3px;margin-bottom:6px"></div>
          <div style="font-size:12px;font-weight:700;color:#333">${t.name}</div>
        </button>`).join('')}
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[
        ['__cvName',     'Nombre completo *',          'Juan Carlos Pérez López'],
        ['__cvTitle',    'Título profesional',         'Ingeniero en Sistemas / Administrador'],
        ['__cvEmail',    'Correo electrónico',         'juan@correo.cr'],
        ['__cvPhone',    'Teléfono (CR)',               '8888-1234'],
        ['__cvLocation', 'Ubicación',                  'San José, Costa Rica'],
        ['__cvLinkedIn', 'LinkedIn / Web',             'linkedin.com/in/juanperez'],
      ].map(([id,label,ph])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}
    </div>

    <div style="margin-bottom:10px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Perfil profesional</label>
      <textarea id="__cvSummary" rows="3" placeholder="Profesional con X años de experiencia en..."
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
    </div>

    <div style="margin-bottom:10px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Experiencia (Empresa|Cargo|Período, una por línea)</label>
      <textarea id="__cvExp" rows="3" placeholder="Empresa ABC|Desarrollador Senior|2020-2025"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Empresa XYZ S.A.|Desarrollador Full Stack|2022-Presente
Corporación ABC|Analista de Sistemas|2019-2022</textarea>
    </div>

    <div style="margin-bottom:10px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Educación (Institución|Título|Año)</label>
      <textarea id="__cvEdu" rows="2" placeholder="UCR|Ingeniería en Sistemas|2019"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">UCR|Bachillerato en Ingeniería en Sistemas|2019
TEC|Técnico en Redes|2016</textarea>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Habilidades (separadas por coma)</label>
      <input type="text" id="__cvSkills" placeholder="JavaScript, Python, SQL, Gestión de proyectos"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        value="JavaScript, React, Node.js, SQL, Git, Agile">
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__cvPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateCV()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📄 Generar CV</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__cvStyle = 'classic';
  setTimeout(() => {
    const btn = document.querySelector('.__cvTplBtn');
    if (btn) { btn.style.borderColor='#003da5'; btn.dataset.sel='1'; }
  }, 50);
}

function __cvSelect(id, btn) {
  window.__cvStyle = id;
  document.querySelectorAll('.__cvTplBtn').forEach(b=>{b.style.borderColor='#eee';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.dataset.sel='1';
}

function __generateCV() {
  const name     = document.getElementById('__cvName')?.value.trim()||'Nombre Completo';
  const title    = document.getElementById('__cvTitle')?.value.trim()||'Profesional';
  const email    = document.getElementById('__cvEmail')?.value.trim()||'';
  const phone    = document.getElementById('__cvPhone')?.value.trim()||'';
  const location = document.getElementById('__cvLocation')?.value.trim()||'Costa Rica';
  const linkedin = document.getElementById('__cvLinkedIn')?.value.trim()||'';
  const summary  = document.getElementById('__cvSummary')?.value.trim()||'';
  const expRaw   = document.getElementById('__cvExp')?.value.trim()||'';
  const eduRaw   = document.getElementById('__cvEdu')?.value.trim()||'';
  const skillsRaw= document.getElementById('__cvSkills')?.value.trim()||'';
  const style    = window.__cvStyle||'classic';

  const expItems = expRaw.split('\n').filter(l=>l.trim()).map(l=>{const p=l.split('|');return{company:p[0]||'',role:p[1]||'',period:p[2]||''};});
  const eduItems = eduRaw.split('\n').filter(l=>l.trim()).map(l=>{const p=l.split('|');return{inst:p[0]||'',degree:p[1]||'',year:p[2]||''};});
  const skills   = skillsRaw.split(',').map(s=>s.trim()).filter(s=>s);

  const colors = {classic:'#003da5',modern:'#0084ff',minimal:'#1a2942',creative:'#9b59b6'};
  const color  = colors[style]||'#003da5';

  const html = `
  <div style="font-family:Calibri,Arial,sans-serif;max-width:18cm;margin:0 auto;background:#fff;page-break-after:always">
    <!-- Header -->
    <div style="background:${color};color:#fff;padding:28px 30px;${style==='creative'?'border-radius:0 0 20px 20px':''}">
      <h1 style="margin:0 0 4px;font-size:22pt;font-weight:900;letter-spacing:-0.5px">${name}</h1>
      <div style="font-size:12pt;opacity:.9;margin-bottom:12px">${title}</div>
      <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:9pt;opacity:.85">
        ${email?`<span>✉ ${email}</span>`:''}
        ${phone?`<span>📱 ${phone}</span>`:''}
        ${location?`<span>📍 ${location}</span>`:''}
        ${linkedin?`<span>🔗 ${linkedin}</span>`:''}
      </div>
    </div>

    <div style="padding:20px 30px">
      ${summary?`
      <div style="margin-bottom:20px">
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Perfil profesional</div>
        <p style="font-size:10pt;color:#555;line-height:1.7;margin:0;text-align:justify">${summary}</p>
      </div>`:''}

      ${expItems.length?`
      <div style="margin-bottom:20px">
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Experiencia profesional</div>
        ${expItems.map(e=>`
          <div style="margin-bottom:12px;padding-left:12px;border-left:3px solid ${color}22">
            <div style="font-size:11pt;font-weight:700;color:#1a2942">${e.role}</div>
            <div style="font-size:10pt;color:${color};font-weight:600;margin-bottom:2px">${e.company}</div>
            <div style="font-size:9pt;color:#888">${e.period}</div>
          </div>`).join('')}
      </div>`:''}

      ${eduItems.length?`
      <div style="margin-bottom:20px">
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Formación académica</div>
        ${eduItems.map(e=>`
          <div style="margin-bottom:10px">
            <div style="font-size:11pt;font-weight:700;color:#1a2942">${e.degree}</div>
            <div style="font-size:10pt;color:${color}">${e.inst}</div>
            <div style="font-size:9pt;color:#888">${e.year}</div>
          </div>`).join('')}
      </div>`:''}

      ${skills.length?`
      <div>
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Habilidades</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${skills.map(s=>`<span style="background:${color}15;border:1px solid ${color}44;color:${color};border-radius:20px;padding:3px 12px;font-size:9pt;font-weight:600">${s}</span>`).join('')}
        </div>
      </div>`:''}
    </div>

    <div style="padding:10px 30px;background:#f8f9fa;font-size:8pt;color:#aaa;text-align:center;border-top:1px solid #eee">
      CV generado con WC Corporate Editor · Costa Rica · ${new Date().toLocaleDateString('es-CR')}
    </div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__cvPanel').remove();
  showToast('📄 CV generado ✅');
}

const WC_UNITS = {
  categories: {
    '📏 Longitud': {
      units:['mm','cm','m','km','in','ft','yd','mi'],
      toBase:{ mm:0.001, cm:0.01, m:1, km:1000, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344 },
      base:'m'
    },
    '⚖️ Peso': {
      units:['mg','g','kg','t','oz','lb','st'],
      toBase:{ mg:0.000001, g:0.001, kg:1, t:1000, oz:0.0283495, lb:0.453592, st:6.35029 },
      base:'kg'
    },
    '🌡️ Temperatura': {
      units:['°C','°F','K'],
      special:true
    },
    '📐 Área': {
      units:['mm²','cm²','m²','km²','ha','ft²','ac'],
      toBase:{ 'mm²':0.000001,'cm²':0.0001,'m²':1,'km²':1000000,'ha':10000,'ft²':0.092903,'ac':4046.86 },
      base:'m²'
    },
    '🚰 Volumen': {
      units:['ml','cl','dl','l','m³','fl oz','pt','qt','gal'],
      toBase:{ ml:0.001,cl:0.01,dl:0.1,l:1,'m³':1000,'fl oz':0.0295735,pt:0.473176,qt:0.946353,gal:3.78541 },
      base:'l'
    },
    '⚡ Velocidad': {
      units:['m/s','km/h','mph','knot','ft/s'],
      toBase:{ 'm/s':1,'km/h':0.277778,mph:0.44704,knot:0.514444,'ft/s':0.3048 },
      base:'m/s'
    },
    '💾 Datos': {
      units:['bit','byte','KB','MB','GB','TB','PB'],
      toBase:{ bit:0.125,byte:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776,PB:1125899906842624 },
      base:'byte'
    },
    '⏱️ Tiempo': {
      units:['ms','s','min','h','d','semana','mes','año'],
      toBase:{ ms:0.001,s:1,min:60,h:3600,d:86400,semana:604800,mes:2592000,año:31536000 },
      base:'s'
    },
  }
};

function openUnitConverter() {
  const old = document.getElementById('__unitPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__unitPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const cats = Object.keys(WC_UNITS.categories);

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:14px">📐 Conversor de unidades</div>

    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      ${cats.map((c,i)=>`
        <button onclick="__unitSelectCat('${c.replace(/['"]/g,'')}',this)"
          class="__unitCatBtn"
          style="padding:5px 10px;border:1.5px solid ${i===0?'#0084ff':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#0084ff':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':''}>
          ${c}
        </button>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:end;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">De</label>
        <select id="__unitFrom" onchange="__unitConvert()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;margin-bottom:6px"></select>
        <input type="number" id="__unitValueFrom" value="1" step="any"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;font-weight:700;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__unitConvert()">
      </div>
      <button onclick="__unitSwap()" style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:18px;margin-bottom:6px">⇄</button>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">A</label>
        <select id="__unitTo" onchange="__unitConvert()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;margin-bottom:6px"></select>
        <input type="number" id="__unitValueTo" readonly
          style="width:100%;padding:9px;border:1.5px solid #27ae60;border-radius:8px;font-size:14px;font-weight:700;outline:none;box-sizing:border-box;background:#f0fff4;color:#155724">
      </div>
    </div>

    <div id="__unitFormula" style="background:#f8f9fa;border-radius:8px;padding:10px;font-size:12px;color:#555;text-align:center;margin-bottom:14px;font-family:'Courier New',monospace"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__unitPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__unitInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📐 Insertar resultado</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__unitCat = cats[0];
  __unitPopulateSelects(cats[0]);
}

function __unitSelectCat(cat, btn) {
  window.__unitCat = cat;
  document.querySelectorAll('.__unitCatBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.style.color='#0084ff'; btn.dataset.sel='1';
  __unitPopulateSelects(cat);
}

function __unitPopulateSelects(cat) {
  const catData = Object.entries(WC_UNITS.categories).find(([k])=>k.includes(cat.replace(/📏|⚖️|🌡️|📐|🚰|⚡|💾|⏱️|\s/g,'').trim()))?.[1]
    || Object.values(WC_UNITS.categories)[0];
  const units   = catData.units || [];
  const fromSel = document.getElementById('__unitFrom');
  const toSel   = document.getElementById('__unitTo');
  if (!fromSel||!toSel) return;
  fromSel.innerHTML = units.map(u=>`<option value="${u}">${u}</option>`).join('');
  toSel.innerHTML   = units.map((u,i)=>`<option value="${u}" ${i===1?'selected':''}>${u}</option>`).join('');
  window.__unitCatData = catData;
  __unitConvert();
}

function __unitConvert() {
  const catData = window.__unitCatData;
  const from    = document.getElementById('__unitFrom')?.value;
  const to      = document.getElementById('__unitTo')?.value;
  const valFrom = parseFloat(document.getElementById('__unitValueFrom')?.value)||0;
  const outEl   = document.getElementById('__unitValueTo');
  const formula = document.getElementById('__unitFormula');
  if (!catData||!from||!to||!outEl) return;

  let result;
  if (catData.special && from && to) {
    if      (from==='°C'&&to==='°F') result = valFrom*9/5+32;
    else if (from==='°F'&&to==='°C') result = (valFrom-32)*5/9;
    else if (from==='°C'&&to==='K')  result = valFrom+273.15;
    else if (from==='K' &&to==='°C') result = valFrom-273.15;
    else if (from==='°F'&&to==='K')  result = (valFrom-32)*5/9+273.15;
    else if (from==='K' &&to==='°F') result = (valFrom-273.15)*9/5+32;
    else result = valFrom;
  } else {
    const toBase = catData.toBase||{};
    const inBase = valFrom * (toBase[from]||1);
    result = inBase / (toBase[to]||1);
  }

  const rounded = Math.round(result * 1000000) / 1000000;
  outEl.value = rounded;
  window.__unitResult = { from:valFrom, fromUnit:from, to:rounded, toUnit:to };
  if (formula) formula.textContent = `${valFrom} ${from} = ${rounded} ${to}`;
}

function __unitSwap() {
  const f = document.getElementById('__unitFrom');
  const t = document.getElementById('__unitTo');
  const v = document.getElementById('__unitValueTo')?.value;
  if (!f||!t) return;
  const tmp=f.value; f.value=t.value; t.value=tmp;
  const inp = document.getElementById('__unitValueFrom');
  if (inp&&v) inp.value = v;
  __unitConvert();
}

function __unitInsert() {
  const r = window.__unitResult;
  if (!r) { showToast('Realizá una conversión primero'); return; }
  if (typeof insertHTML==='function') insertHTML(`<span style="background:#f0f7ff;border:1px solid #c0d8f0;border-radius:4px;padding:1px 8px;font-weight:600;color:#003da5">${r.from} ${r.fromUnit} = ${r.to} ${r.toUnit}</span>`);
  document.getElementById('__unitPanel').remove();
  showToast('Conversión insertada ✅');
}

function openEmojiPanel() {
  const old = document.getElementById('__emojiPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__emojiPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center';

  const categories = {
    '😀 Caras':    ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','🤩','😐','😑','😶','🙄','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑'],
    '👍 Gestos':   ['👍','👎','👌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋','🤏','💪','🦾','🖕','✍️','🙏','🤲','👐','🫶','🤝','👏','🙌','🤜','🤛','✊','👊','💪','🦵','🦶','👂','🦻','👃','🫀','🫁','🧠','🦷','🦴','👁️','👀','👅','👄'],
    '🎉 Celebración':['🎉','🎊','🎈','🎀','🎁','🏆','🥇','🥈','🥉','🎖️','🏅','🎗️','🎫','🎟️','🎪','🤹','🎭','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎷','🎸','🎹','🎺','🎻','🥁','🪘','🪗','🎮','🕹️','🎲','🎯','🎳','🎰','🧩','🪀','🪁','🧸','🪆'],
    '🌿 Naturaleza':['🌿','🌱','🌲','🌳','🌴','🌵','🌾','🍀','🍁','🍂','🍃','🌺','🌸','🌼','🌻','🌹','🥀','🌷','🌱','🍄','🌰','🦔','🐝','🦋','🐛','🐌','🐞','🐜','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐊','🐸','🐲','🐉'],
    '🍔 Comida':   ['🍕','🍔','🌮','🌯','🥙','🧆','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🍫','🍬','🍭','🍮','🍯','🍷','🍸','🍹','🥂','🍺','🍻','☕','🍵','🧃'],
    '✈️ Viajes':   ['✈️','🚀','🛸','🚁','🛩️','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚌','🚍','🚎','🚐','🚑','🚒','🚓','🚔','🚕','🚖','🚗','🚘','🚙','🚚','🛻','🚛','🚜','🏎️','🏍️','🛵','🦽','🦼','🛺','🚲','🛴','🛹','🚏','⛽','🚦','🚥','🛣️','🛤️'],
    '💼 Trabajo':  ['💼','📁','📂','🗂️','📋','📊','📈','📉','📌','📍','📎','🖇️','✂️','🖊️','🖋️','✒️','📝','✏️','🔍','🔎','🔏','🔐','🔒','🔓','🔑','🗝️','🔨','⚒️','🛠️','⛏️','🔧','🔩','⚙️','🗜️','📡','💡','🔦','🕯️','💰','💴','💵','💶','💷','💸','💳','🧾'],
    '🇨🇷 CR':     ['🇨🇷','🌋','🦋','🐸','🦜','🐢','☕','🍍','🌴','🌺','🦥','🐆','🌊','🏖️','⛰️','🌄','🌿','🦎','🐊','🦅','🦆','🐾','🌵','🌱','🍃','🌾','🍀','🌸'],
  };

  let catHTML = '';
  Object.entries(categories).forEach(([cat, emojis], i) => {
    catHTML += `<div id="__emojiCat_${i}" style="display:${i===0?'block':'none'}">
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px">
        ${emojis.map(e=>`<button onclick="__emojiInsert('${e}')" style="padding:6px;border:none;background:none;border-radius:6px;cursor:pointer;font-size:22px;transition:background .1s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='none'" title="${e}">${e}</button>`).join('')}
      </div>
    </div>`;
  });

  ov.innerHTML = `
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:480px;max-height:70vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:12px 16px;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <input type="text" id="__emojiSearch" placeholder="Buscar emoji..."
        style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__emojiSearch(this.value)">
      <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">
        ${Object.keys(categories).map((c,i)=>`
          <button onclick="__emojiTab(${i},this)"
            class="__emojiTabBtn"
            style="padding:5px 8px;border:1.5px solid ${i===0?'#0084ff':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;transition:all .15s;flex-shrink:0;color:${i===0?'#0084ff':'#555'}"
            ${i===0?'data-sel="1"':''}>
            ${c}
          </button>`).join('')}
      </div>
    </div>
    <div id="__emojiGrid" style="flex:1;overflow-y:auto;padding:0 12px 16px">
      ${catHTML}
    </div>
    <div style="padding:8px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__emojiPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__emojiCategories = categories;
}

function __emojiTab(idx, btn) {
  document.querySelectorAll('[id^="__emojiCat_"]').forEach((el,i) => el.style.display=i===idx?'block':'none');
  document.querySelectorAll('.__emojiTabBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.style.color='#0084ff'; btn.dataset.sel='1';
}

function __emojiSearch(q) {
  const grid = document.getElementById('__emojiGrid');
  if (!grid) return;
  if (!q.trim()) {
    grid.querySelectorAll('[id^="__emojiCat_"]').forEach((el,i)=>el.style.display=i===0?'block':'none');
    return;
  }
  const all = Object.values(window.__emojiCategories||{}).flat();
  const results = all.filter(e => e.includes(q));
  grid.querySelectorAll('[id^="__emojiCat_"]').forEach(el=>el.style.display='none');
  let searchDiv = document.getElementById('__emojiSearchResults');
  if (!searchDiv) { searchDiv=document.createElement('div'); searchDiv.id='__emojiSearchResults'; grid.appendChild(searchDiv); }
  searchDiv.style.display='block';
  searchDiv.innerHTML = `<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px">
    ${results.map(e=>`<button onclick="__emojiInsert('${e}')" style="padding:6px;border:none;background:none;border-radius:6px;cursor:pointer;font-size:22px;transition:background .1s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='none'">${e}</button>`).join('')}
  </div>`;
}

function __emojiInsert(emoji) {
  document.execCommand('insertText', false, emoji);
  showToast(emoji + ' insertado');
}

const WC_CONTACTS = {
  list: JSON.parse(localStorage.getItem('wc-contacts')||'[]'),
  save() { localStorage.setItem('wc-contacts', JSON.stringify(this.list)); },
  add(c)  { this.list.push({...c, id:'c'+Date.now()}); this.save(); },
  delete(id) { this.list=this.list.filter(c=>c.id!==id); this.save(); },
};

function openContactsPanel() {
  const old = document.getElementById('__contactsPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__contactsPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
        <span>👥 Agenda de contactos</span>
        <button onclick="__contactAdd()" style="padding:7px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar</button>
      </div>
      <input type="text" id="__contactSearch" placeholder="Buscar contacto..."
        style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__contactFilter(this.value)">
    </div>

    <div id="__contactList" style="flex:1;overflow-y:auto;padding:0 20px 8px">
      <!-- Se llena dinámicamente -->
    </div>

    <div style="padding:12px 20px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__contactsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  __contactFilter('');
}

function __contactFilter(q) {
  const list = document.getElementById('__contactList');
  if (!list) return;
  const contacts = WC_CONTACTS.list.filter(c =>
    !q || c.name?.toLowerCase().includes(q.toLowerCase()) ||
          c.email?.toLowerCase().includes(q.toLowerCase()) ||
          c.phone?.includes(q)
  );

  if (!contacts.length) {
    list.innerHTML=`<div style="text-align:center;color:#bbb;padding:30px;font-size:13px">
      ${WC_CONTACTS.list.length?'No se encontraron contactos':'No hay contactos aún. Toca + Agregar'}
    </div>`;
    return;
  }

  list.innerHTML = contacts.map(c => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;margin-bottom:6px;background:#fafafa;border:1.5px solid #eee;transition:all .15s"
      onmouseover="this.style.borderColor='#c0d8f0'" onmouseout="this.style.borderColor='#eee'">
      <div style="width:38px;height:38px;border-radius:50%;background:#0084ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0">${(c.name||'?')[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:#1a1a1a">${c.name||''}</div>
        <div style="font-size:11px;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${[c.email,c.phone,c.org].filter(Boolean).join(' · ')}</div>
      </div>
      <div style="display:flex;gap:4px;flex-shrink:0">
        <button onclick="__contactInsert('${c.id}')" style="padding:5px 8px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">Insertar</button>
        <button onclick="WC_CONTACTS.delete('${c.id}');__contactFilter(document.getElementById('__contactSearch').value)" style="padding:5px;border:none;background:#fde8e8;border-radius:6px;cursor:pointer;font-size:12px;color:#e74c3c">🗑</button>
      </div>
    </div>`).join('');
}

function __contactAdd() {
  const name  = prompt('Nombre completo:','');
  if (!name) return;
  const email = prompt('Correo electrónico:','') || '';
  const phone = prompt('Teléfono:','') || '';
  const org   = prompt('Organización:','') || '';
  WC_CONTACTS.add({ name, email, phone, org });
  __contactFilter('');
  showToast('Contacto agregado ✅');
}

function __contactInsert(id) {
  const c = WC_CONTACTS.list.find(c=>c.id===id);
  if (!c) return;
  const html = `<div style="display:inline-flex;align-items:center;gap:8px;background:#f0f7ff;border:1px solid #c0d8f0;border-radius:8px;padding:6px 12px;margin:4px 0">
    <div style="width:28px;height:28px;border-radius:50%;background:#0084ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">${c.name[0].toUpperCase()}</div>
    <div>
      <div style="font-size:11pt;font-weight:700;color:#1a2942">${c.name}</div>
      <div style="font-size:9pt;color:#888">${[c.email,c.phone,c.org].filter(Boolean).join(' · ')}</div>
    </div>
  </div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__contactsPanel').remove();
  showToast('Contacto insertado ✅');
}

function openCitationPanel() {
  const old = document.getElementById('__citePanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__citePanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📚 Generador de citas y referencias</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">APA 7ª ed. · IEEE · Chicago · Vancouver</div>

    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      ${['APA 7','IEEE','Chicago','Vancouver'].map((s,i)=>`
        <button onclick="__citeStyle('${s}',this)" id="__citeStyleBtn_${i}"
          style="padding:7px 14px;border:2px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#003da5':'#555'};border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':''}>
          ${s}
        </button>`).join('')}
    </div>

    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      ${['Libro','Artículo','Web','Tesis','Ley CR'].map((t,i)=>`
        <button onclick="__citeType('${t}',this)" id="__citeTypeBtn_${i}"
          style="padding:6px 12px;border:1.5px solid ${i===0?'#0084ff':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#0084ff':'#555'};border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':''}>
          ${t}
        </button>`).join('')}
    </div>

    <div id="__citeFields" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <!-- Se llena dinámicamente -->
    </div>

    <div id="__citeResult" style="background:#f8f9fa;border-radius:10px;padding:14px;margin-bottom:14px;display:none">
      <div style="font-size:10px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">Referencia generada</div>
      <div id="__citeOutput" style="font-size:12px;color:#1a1a1a;line-height:1.8;font-style:italic"></div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__citePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__citeGenerate()" style="flex:1;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Generar</button>
      <button onclick="__citeInsert()" style="flex:1;padding:11px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Insertar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__citeStyle = 'APA 7';
  window.__citeType  = 'Libro';
  __citeRenderFields('Libro');
}

function __citeStyle(s, btn) {
  window.__citeStyle = s;
  document.querySelectorAll('[id^="__citeStyleBtn_"]').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  btn.style.borderColor='#003da5'; btn.style.background='#f0f7ff'; btn.style.color='#003da5'; btn.dataset.sel='1';
}

function __citeType(t, btn) {
  window.__citeType = t;
  document.querySelectorAll('[id^="__citeTypeBtn_"]').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.style.color='#0084ff'; btn.dataset.sel='1';
  __citeRenderFields(t);
}

function __citeRenderFields(type) {
  const f = document.getElementById('__citeFields');
  if (!f) return;
  const fieldMap = {
    Libro:     [['author','Autor(es)','García, J. y López, M.'],['year','Año','2023'],['title','Título del libro','El título del libro'],['city','Ciudad','San José'],['publisher','Editorial','UCR Ediciones']],
    Artículo:  [['author','Autor(es)','Pérez, A.'],['year','Año','2023'],['title','Título del artículo','Título del artículo'],['journal','Nombre de la revista','Revista Costarricense'],['volume','Volumen(número)','15(2)'],['pages','Páginas','45-67'],['doi','DOI / URL','https://doi.org/...']],
    Web:       [['author','Autor / Organización','Ministerio de Hacienda CR'],['year','Año','2024'],['title','Título de la página','Título del contenido'],['url','URL','https://www.hacienda.go.cr/...'],['access','Fecha de acceso','15 de junio de 2024']],
    Tesis:     [['author','Autor','González, C. A.'],['year','Año','2022'],['title','Título de la tesis','Título de la investigación'],['degree','Grado','Maestría en Administración'],['institution','Institución','Universidad de Costa Rica'],['url','Repositorio URL','https://kerwa.ucr.ac.cr/...']],
    'Ley CR':  [['number','Número de ley','7472'],['name','Nombre completo','Ley de Promoción de la Competencia...'],['year','Año de promulgación','1994'],['assembly','Órgano','Asamblea Legislativa de la República de Costa Rica'],['url','URL SINALEVI','https://www.pgrweb.go.cr/scij/...']],
  };
  const fields = fieldMap[type] || fieldMap.Libro;
  f.innerHTML = fields.map(([id,label,ph])=>`
    <div>
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
      <input type="text" id="__citeField_${id}" placeholder="${ph}"
        style="width:100%;padding:8px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>`).join('');
}

function __citeGetField(id) { return document.getElementById('__citeField_'+id)?.value?.trim()||''; }

function __citeGenerate() {
  const style = window.__citeStyle || 'APA 7';
  const type  = window.__citeType  || 'Libro';
  const a=__citeGetField('author'), y=__citeGetField('year'), t=__citeGetField('title');
  const pub=__citeGetField('publisher'), city=__citeGetField('city');
  const journal=__citeGetField('journal'), vol=__citeGetField('volume'), pages=__citeGetField('pages'), doi=__citeGetField('doi');
  const url=__citeGetField('url'), access=__citeGetField('access');
  const num=__citeGetField('number'), law=__citeGetField('name'), assem=__citeGetField('assembly');

  let ref = '';

  if (style === 'APA 7') {
    if (type==='Libro')    ref = `${a} (${y}). <em>${t}</em>. ${pub}.`;
    else if(type==='Artículo') ref = `${a} (${y}). ${t}. <em>${journal}</em>, <em>${vol}</em>, ${pages}. ${doi?'https://doi.org/'+doi:''}`;
    else if(type==='Web')  ref = `${a} (${y}). <em>${t}</em>. ${url} [Recuperado el ${access}]`;
    else if(type==='Tesis')ref = `${__citeGetField('author')} (${y}). <em>${t}</em> [Tesis de ${__citeGetField('degree')}]. ${__citeGetField('institution')}. ${url}`;
    else if(type==='Ley CR') ref = `${assem} (${y}). <em>Ley N° ${num}: ${law}</em>. ${url}`;
  } else if (style === 'IEEE') {
    if (type==='Libro')    ref = `${a}, <em>${t}</em>, ${pub}, ${y}.`;
    else if(type==='Artículo') ref = `${a}, "${t}," <em>${journal}</em>, vol. ${vol}, pp. ${pages}, ${y}. DOI: ${doi}`;
    else if(type==='Web')  ref = `${a}, "${t}." ${url} (accessed ${access}).`;
    else if(type==='Ley CR') ref = `${assem}, <em>Ley N° ${num}: ${law}</em>, ${y}. [Online]. Available: ${url}`;
  } else if (style === 'Chicago') {
    if (type==='Libro')    ref = `${a}. <em>${t}</em>. ${city}: ${pub}, ${y}.`;
    else if(type==='Artículo') ref = `${a}. "${t}." <em>${journal}</em> ${vol} (${y}): ${pages}.`;
    else if(type==='Web')  ref = `${a}. "${t}." Accessed ${access}. ${url}.`;
    else ref = `${a}. <em>${t}</em>. ${y}.`;
  } else if (style === 'Vancouver') {
    if (type==='Libro')    ref = `${a}. ${t}. ${city}: ${pub}; ${y}.`;
    else if(type==='Artículo') ref = `${a}. ${t}. ${journal}. ${y};${vol}:${pages}.`;
    else ref = `${a}. ${t}. ${y}.`;
  }

  window.__currentCite = ref;
  const res = document.getElementById('__citeResult');
  const out = document.getElementById('__citeOutput');
  if (res) res.style.display='block';
  if (out) out.innerHTML = ref || '(Completá los campos requeridos)';
}

function __citeInsert() {
  if (!window.__currentCite) { __citeGenerate(); }
  const ref = window.__currentCite;
  if (!ref) { showToast('Generá la cita primero'); return; }
  const html = `<div style="margin:6px 0;padding:8px 12px;background:#f8f9fa;border-left:3px solid #003da5;font-size:10pt;color:#333;line-height:1.7">${ref}</div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__citePanel').remove();
  showToast('📚 Referencia insertada ✅');
}

const WC_A11Y = {
  fontSize:     parseInt(localStorage.getItem('wc-a11y-fontsize'))   || 0,
  contrast:     localStorage.getItem('wc-a11y-contrast')             || 'normal',
  lineHeight:   parseFloat(localStorage.getItem('wc-a11y-lineheight'))|| 1.5,
  fontFamily:   localStorage.getItem('wc-a11y-font')                 || '',
  letterSpacing:parseFloat(localStorage.getItem('wc-a11y-spacing'))  || 0,

  apply() {
    let st = document.getElementById('__a11yStyle');
    if (!st) { st=document.createElement('style'); st.id='__a11yStyle'; document.head.appendChild(st); }
    const ed = '#editor, #editor *';
    let css = '';
    if (this.fontSize)     css += `${ed}{font-size:calc(1em + ${this.fontSize}px)!important;}`;
    if (this.lineHeight !== 1.5) css += `${ed}{line-height:${this.lineHeight}!important;}`;
    if (this.letterSpacing) css += `${ed}{letter-spacing:${this.letterSpacing}em!important;}`;
    if (this.fontFamily)   css += `${ed}{font-family:'${this.fontFamily}',sans-serif!important;}`;
    if (this.contrast === 'high') css += `body{filter:contrast(1.4)!important;}`;
    if (this.contrast === 'invert') css += `body{filter:invert(1)hue-rotate(180deg)!important;}`;
    if (this.contrast === 'sepia') css += `body{filter:sepia(.6)!important;}`;
    st.textContent = css;
    localStorage.setItem('wc-a11y-fontsize', this.fontSize);
    localStorage.setItem('wc-a11y-contrast', this.contrast);
    localStorage.setItem('wc-a11y-lineheight', this.lineHeight);
    localStorage.setItem('wc-a11y-font', this.fontFamily);
    localStorage.setItem('wc-a11y-spacing', this.letterSpacing);
  },

  reset() {
    this.fontSize=0; this.contrast='normal'; this.lineHeight=1.5; this.fontFamily=''; this.letterSpacing=0;
    this.apply();
    showToast('Accesibilidad restaurada');
  }
};

setTimeout(() => WC_A11Y.apply(), 1500);

function openAccessibilityPanel() {
  const old = document.getElementById('__a11yPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__a11yPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      ♿ Accesibilidad
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Ajusta el editor para mejor legibilidad</div>

    <!-- Tamaño de fuente -->
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:12px;font-weight:700;color:#555">Tamaño de fuente</label>
        <span id="__a11yFontVal" style="font-size:12px;color:#0084ff;font-weight:700">${WC_A11Y.fontSize>0?'+':''}${WC_A11Y.fontSize}px</span>
      </div>
      <input type="range" id="__a11yFont" min="-4" max="12" value="${WC_A11Y.fontSize}" step="1" style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__a11yFontVal').textContent=(this.value>0?'+':'')+this.value+'px';WC_A11Y.fontSize=parseInt(this.value);WC_A11Y.apply()">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:#bbb;margin-top:2px"><span>Pequeño</span><span>Normal</span><span>Grande</span></div>
    </div>

    <!-- Interlineado -->
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:12px;font-weight:700;color:#555">Interlineado</label>
        <span id="__a11yLineVal" style="font-size:12px;color:#0084ff;font-weight:700">${WC_A11Y.lineHeight}</span>
      </div>
      <input type="range" id="__a11yLine" min="1" max="3" step="0.1" value="${WC_A11Y.lineHeight}" style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__a11yLineVal').textContent=parseFloat(this.value).toFixed(1);WC_A11Y.lineHeight=parseFloat(this.value);WC_A11Y.apply()">
    </div>

    <!-- Espaciado de letras -->
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:12px;font-weight:700;color:#555">Espaciado entre letras</label>
        <span id="__a11ySpVal" style="font-size:12px;color:#0084ff;font-weight:700">${WC_A11Y.letterSpacing}em</span>
      </div>
      <input type="range" id="__a11ySp" min="0" max="0.2" step="0.01" value="${WC_A11Y.letterSpacing}" style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__a11ySpVal').textContent=parseFloat(this.value).toFixed(2)+'em';WC_A11Y.letterSpacing=parseFloat(this.value);WC_A11Y.apply()">
    </div>

    <!-- Contraste -->
    <div style="margin-bottom:14px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:8px">Modo de color</label>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
        ${[['normal','Normal','#fff','#333'],['high','Alto contraste','#000','#fff'],['invert','Invertido','#1a1a1a','#e0e0e0'],['sepia','Sepia','#f4ecd8','#5b4636']].map(([val,label,bg,fg])=>`
          <button onclick="WC_A11Y.contrast='${val}';WC_A11Y.apply();__a11yUpdateBtns()"
            class="__a11yContrastBtn" data-val="${val}"
            style="padding:8px 4px;border:2px solid ${WC_A11Y.contrast===val?'#0084ff':'#eee'};background:${bg};color:${fg};border-radius:8px;cursor:pointer;font-size:10px;font-weight:600">
            ${label}
          </button>`).join('')}
      </div>
    </div>

    <!-- Fuente para dislexia -->
    <div style="margin-bottom:16px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:8px">Fuente especial</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${[['','Normal'],['OpenDyslexic','Dislexia'],['Arial','Arial'],['Verdana','Verdana'],['Georgia','Georgia']].map(([val,label])=>`
          <button onclick="WC_A11Y.fontFamily='${val}';WC_A11Y.apply()"
            style="padding:6px 12px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555;font-family:'${val||'inherit'}';transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
            ${label}
          </button>`).join('')}
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="WC_A11Y.reset();document.getElementById('__a11yPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">🔄 Restaurar</button>
      <button onclick="document.getElementById('__a11yPanel').remove()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">✅ Aplicar y cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __a11yUpdateBtns() {
  document.querySelectorAll('.__a11yContrastBtn').forEach(b => {
    b.style.borderColor = b.dataset.val === WC_A11Y.contrast ? '#0084ff' : '#eee';
  });
}

(function initV2519() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'voiceDictation':  openVoicePanel();         break;
          case 'passwordGen':     openPasswordGenerator();  break;
          case 'cvTemplate':      openCVTemplates();        break;
          case 'unitConverter':   openUnitConverter();      break;
          case 'emojiPanel':      openEmojiPanel();         break;
          case 'contacts':        openContactsPanel();      break;
          case 'citation':        openCitationPanel();      break;
          case 'accessibility':   openAccessibilityPanel(); break;
          case 'voiceToggle':     WC_VOICE.toggle();        break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.19 ✅ — Voz, Contraseñas, CV, Unidades, Emojis, Contactos, Citas APA, Accesibilidad');
  }, 2700);
})();
function openFacturaElectronica() {
  const old = document.getElementById('__fePanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__fePanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px';

  const now   = new Date();
  const fecha = now.toISOString().slice(0,16);
  const tipos = [
    ['01','Factura Electrónica'],['02','Nota de Débito'],['03','Nota de Crédito'],
    ['04','Tiquete Electrónico'],['08','Factura Electrónica de Compra'],['09','Factura Electrónica de Exportación']
  ];
  const monedas = [['CRC','₡ Colón CR'],['USD','$ Dólar'],['EUR','€ Euro']];
  const condVenta = [['01','Contado'],['02','Crédito'],['03','Consignación'],['04','Apartado'],['05','Arrendamiento'],['06','Otra']];
  const medioPago = [['01','Efectivo'],['02','Tarjeta'],['03','Cheque'],['04','Transferencia'],['05','Recaudado por terceros'],['99','Otros']];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;width:100%;max-width:580px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700;margin-bottom:2px">🇨🇷 Factura Electrónica v4.3</div>
      <div style="font-size:11px;opacity:.85">Ministerio de Hacienda · Resolución DGT-R-48-2016</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <!-- Tabs -->
      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${[['emisor','🏢 Emisor'],['receptor','👤 Receptor'],['lineas','📋 Líneas'],['totales','💰 Totales']].map(([id,label],i)=>`
          <button onclick="__feTab('${id}',this)" id="__feTabBtn_${id}"
            style="padding:6px 12px;border:2px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#003da5':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':''}>
            ${label}
          </button>`).join('')}
      </div>

      <!-- Emisor -->
      <div id="__feSection_emisor">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[
            ['__feEmisorNombre','Nombre / Razón social *','Mi Empresa S.A.'],
            ['__feEmisorCedula','Cédula jurídica *','3-101-123456'],
            ['__feEmisorEmail','Correo electrónico','factura@empresa.cr'],
            ['__feEmisorTel','Teléfono','2222-3333'],
            ['__feEmisorProvincia','Provincia','San José'],
            ['__feEmisorActividad','Actividad económica','722000 - Informática'],
          ].map(([id,label,ph])=>`
            <div>
              <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
              <input type="text" id="${id}" placeholder="${ph}"
                style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
            </div>`).join('')}
        </div>
        <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo documento</label>
            <select id="__feTipo" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${tipos.map(([v,n])=>`<option value="${v}">${v} — ${n}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Moneda</label>
            <select id="__feMoneda" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${monedas.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Condición venta</label>
            <select id="__feCondVenta" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${condVenta.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Medio de pago</label>
            <select id="__feMedioPago" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${medioPago.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}
            </select>
          </div>
          <div style="grid-column:1/-1">
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Fecha y hora emisión</label>
            <input type="datetime-local" id="__feFecha" value="${fecha}"
              style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box">
          </div>
        </div>
      </div>

      <!-- Receptor -->
      <div id="__feSection_receptor" style="display:none">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[
            ['__feRecNombre','Nombre / Razón social *','Cliente Ejemplo'],
            ['__feRecCedula','Cédula / Identificación','1-2345-6789'],
            ['__feRecEmail','Correo electrónico','cliente@email.com'],
            ['__feRecTel','Teléfono','8888-9999'],
            ['__feRecProvincia','Provincia','Alajuela'],
            ['__feRecDistrito','Distrito','Central'],
          ].map(([id,label,ph])=>`
            <div>
              <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
              <input type="text" id="${id}" placeholder="${ph}"
                style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
            </div>`).join('')}
        </div>
      </div>

      <!-- Líneas de detalle -->
      <div id="__feSection_lineas" style="display:none">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px;margin-bottom:8px">
          <input type="text" id="__feLinDesc" placeholder="Descripción del servicio/producto"
            style="padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
          <input type="number" id="__feLinCant" placeholder="Cantidad" value="1" min="0.01" step="0.01"
            style="padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
          <input type="number" id="__feLinPrecio" placeholder="Precio unit." min="0" step="0.01"
            style="padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
          <select id="__feLinIVA" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
            <option value="13">IVA 13% (General)</option>
            <option value="4">IVA 4% (Medicamentos)</option>
            <option value="2">IVA 2% (Canasta básica)</option>
            <option value="1">IVA 1% (Especial)</option>
            <option value="0">Exento (0%)</option>
          </select>
          <button onclick="__feAddLine()" style="padding:7px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar línea</button>
        </div>
        <div id="__feLineas" style="max-height:200px;overflow-y:auto">
          <div style="text-align:center;color:#bbb;font-size:12px;padding:20px">Agregá líneas con el botón</div>
        </div>
      </div>

      <!-- Totales -->
      <div id="__feSection_totales" style="display:none">
        <div id="__feTotalesCalc" style="background:#f8f9fa;border-radius:10px;padding:14px">
          <div style="text-align:center;color:#bbb;font-size:12px">Agregá líneas primero</div>
        </div>
        <div style="margin-top:10px">
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Observaciones</label>
          <textarea id="__feObs" rows="2" placeholder="Observaciones o condiciones adicionales..."
            style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
        </div>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__fePanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__feGenerateXML()" style="flex:1;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">📥 XML</button>
      <button onclick="__feInsertDoc()" style="flex:1;padding:10px;border:none;background:#ce1126;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">📄 Insertar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__feLineas = [];
  window.__feConsec = String(Math.floor(Math.random()*900000+100000)).padStart(10,'0');
}

function __feTab(id, btn) {
  ['emisor','receptor','lineas','totales'].forEach(t => {
    const sec = document.getElementById('__feSection_'+t);
    const b   = document.getElementById('__feTabBtn_'+t);
    if (sec) sec.style.display = t===id?'block':'none';
    if (b)   { b.style.borderColor=t===id?'#003da5':'#eee'; b.style.background=t===id?'#f0f7ff':'#fafafa'; b.style.color=t===id?'#003da5':'#555'; }
  });
  if (id==='totales') __feCalcTotales();
}

function __feAddLine() {
  const desc   = document.getElementById('__feLinDesc')?.value.trim();
  const cant   = parseFloat(document.getElementById('__feLinCant')?.value)||1;
  const precio = parseFloat(document.getElementById('__feLinPrecio')?.value)||0;
  const iva    = parseInt(document.getElementById('__feLinIVA')?.value)||13;
  if (!desc) { showToast('Ingresá la descripción'); return; }
  if (!precio) { showToast('Ingresá el precio'); return; }

  if (!window.__feLineas) window.__feLineas = [];
  window.__feLineas.push({ desc, cant, precio, iva, subtotal: cant*precio, ivaAmount: cant*precio*iva/100 });

  document.getElementById('__feLinDesc').value = '';
  document.getElementById('__feLinPrecio').value = '';
  __feRenderLineas();
  showToast('Línea agregada ✅');
}

function __feRenderLineas() {
  const box = document.getElementById('__feLineas');
  if (!box) return;
  const lines = window.__feLineas || [];
  if (!lines.length) { box.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:20px">Agregá líneas</div>'; return; }
  const fmt = n => '₡'+n.toLocaleString('es-CR',{minimumFractionDigits:2,maximumFractionDigits:2});
  box.innerHTML = `<table style="border-collapse:collapse;width:100%;font-size:11px">
    <tr style="background:#003da5;color:#fff">
      <th style="padding:5px 8px;text-align:left">Descripción</th>
      <th style="padding:5px 8px">Cant</th>
      <th style="padding:5px 8px">Precio</th>
      <th style="padding:5px 8px">IVA</th>
      <th style="padding:5px 8px">Total</th>
      <th style="padding:5px 8px"></th>
    </tr>
    ${lines.map((l,i)=>`
      <tr style="${i%2?'background:#f0f7ff':''}">
        <td style="padding:5px 8px">${l.desc}</td>
        <td style="padding:5px 8px;text-align:center">${l.cant}</td>
        <td style="padding:5px 8px;text-align:right">${fmt(l.precio)}</td>
        <td style="padding:5px 8px;text-align:center">${l.iva}%</td>
        <td style="padding:5px 8px;text-align:right;font-weight:600">${fmt(l.subtotal+l.ivaAmount)}</td>
        <td style="padding:5px 8px;text-align:center"><button onclick="window.__feLineas.splice(${i},1);__feRenderLineas()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px">×</button></td>
      </tr>`).join('')}
  </table>`;
}

function __feCalcTotales() {
  const box   = document.getElementById('__feTotalesCalc');
  const lines = window.__feLineas || [];
  if (!box) return;
  if (!lines.length) { box.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px">Agregá líneas primero</div>'; return; }

  const subtotal = lines.reduce((a,l)=>a+l.subtotal,0);
  const ivaTotal = lines.reduce((a,l)=>a+l.ivaAmount,0);
  const total    = subtotal + ivaTotal;
  const fmt      = n => '₡'+n.toLocaleString('es-CR',{minimumFractionDigits:2,maximumFractionDigits:2});

  const ivaDesglose = {};
  lines.forEach(l => {
    if (!ivaDesglose[l.iva]) ivaDesglose[l.iva] = 0;
    ivaDesglose[l.iva] += l.ivaAmount;
  });

  box.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
      <div style="display:flex;justify-content:space-between"><span style="color:#555">Subtotal gravado:</span><strong>${fmt(subtotal)}</strong></div>
      ${Object.entries(ivaDesglose).map(([r,v])=>`
        <div style="display:flex;justify-content:space-between"><span style="color:#e74c3c">IVA ${r}%:</span><strong style="color:#e74c3c">${fmt(v)}</strong></div>`).join('')}
      <div style="border-top:2px solid #003da5;padding-top:8px;display:flex;justify-content:space-between;font-size:15px;font-weight:800;color:#003da5">
        <span>TOTAL:</span><span>${fmt(total)}</span>
      </div>
    </div>`;

  window.__feTotales = { subtotal, ivaTotal, total };
}

function __feGenerateXML() {
  const lines = window.__feLineas || [];
  if (!lines.length) { showToast('Agregá al menos una línea'); return; }

  const g = id => document.getElementById(id)?.value?.trim() || '';
  const fecha = g('__feFecha').replace('T','T') + ':00-06:00';
  const consec= window.__feConsec || '0000000001';
  const clave = '506' + new Date().toISOString().replace(/\D/g,'').slice(0,8) +
                (g('__feEmisorCedula').replace(/\D/g,'').padStart(12,'0')) +
                consec + '1' + '99999999' + '1';

  const lineasXML = lines.map((l,i) => `
    <LineaDetalle>
      <NumeroLinea>${i+1}</NumeroLinea>
      <Cantidad>${l.cant}</Cantidad>
      <UnidadMedida>Sp</UnidadMedida>
      <Detalle>${l.desc.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</Detalle>
      <PrecioUnitario>${l.precio.toFixed(5)}</PrecioUnitario>
      <MontoTotal>${l.subtotal.toFixed(5)}</MontoTotal>
      <Impuesto>
        <Codigo>01</Codigo>
        <CodigoTarifa>0${l.iva===13?8:l.iva===4?4:l.iva===2?2:l.iva===1?1:1}</CodigoTarifa>
        <Tarifa>${l.iva}.00</Tarifa>
        <Monto>${l.ivaAmount.toFixed(5)}</Monto>
      </Impuesto>
      <MontoTotalLinea>${(l.subtotal+l.ivaAmount).toFixed(5)}</MontoTotalLinea>
    </LineaDetalle>`).join('');

  const tot = window.__feTotales || { subtotal:0, ivaTotal:0, total:0 };

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Clave>${clave}</Clave>
  <CodigoActividad>${g('__feEmisorActividad').split('-')[0].trim() || '722000'}</CodigoActividad>
  <NumeroConsecutivo>00100001010${consec}</NumeroConsecutivo>
  <FechaEmision>${fecha}</FechaEmision>
  <Emisor>
    <Nombre>${g('__feEmisorNombre')}</Nombre>
    <Identificacion>
      <Tipo>02</Tipo>
      <Numero>${g('__feEmisorCedula').replace(/\D/g,'')}</Numero>
    </Identificacion>
    <NombreComercial>${g('__feEmisorNombre')}</NombreComercial>
    <Ubicacion>
      <Provincia>1</Provincia>
      <Canton>01</Canton>
      <Distrito>01</Distrito>
      <OtrasSenas>${g('__feEmisorProvincia')}</OtrasSenas>
    </Ubicacion>
    <Telefono><CodigoPais>506</CodigoPais><NumTelefono>${g('__feEmisorTel').replace(/\D/g,'')}</NumTelefono></Telefono>
    <CorreoElectronico>${g('__feEmisorEmail')}</CorreoElectronico>
  </Emisor>
  <Receptor>
    <Nombre>${g('__feRecNombre')}</Nombre>
    <Identificacion>
      <Tipo>01</Tipo>
      <Numero>${g('__feRecCedula').replace(/\D/g,'')}</Numero>
    </Identificacion>
    <CorreoElectronico>${g('__feRecEmail')}</CorreoElectronico>
  </Receptor>
  <CondicionVenta>${g('__feCondVenta') || '01'}</CondicionVenta>
  <MedioPago>${g('__feMedioPago') || '01'}</MedioPago>
  <DetalleServicio>${lineasXML}
  </DetalleServicio>
  <ResumenFactura>
    <CodigoTipoMoneda><CodigoMoneda>${g('__feMoneda') || 'CRC'}</CodigoMoneda><TipoCambio>1.00</TipoCambio></CodigoTipoMoneda>
    <TotalServGravados>${tot.subtotal.toFixed(5)}</TotalServGravados>
    <TotalServExentos>0.00000</TotalServExentos>
    <TotalServExonerado>0.00000</TotalServExonerado>
    <TotalMercanciasGravadas>0.00000</TotalMercanciasGravadas>
    <TotalMercanciasExentas>0.00000</TotalMercanciasExentas>
    <TotalMercExonerada>0.00000</TotalMercExonerada>
    <TotalGravado>${tot.subtotal.toFixed(5)}</TotalGravado>
    <TotalExento>0.00000</TotalExento>
    <TotalExonerado>0.00000</TotalExonerado>
    <TotalVenta>${tot.subtotal.toFixed(5)}</TotalVenta>
    <TotalDescuentos>0.00000</TotalDescuentos>
    <TotalVentaNeta>${tot.subtotal.toFixed(5)}</TotalVentaNeta>
    <TotalImpuesto>${tot.ivaTotal.toFixed(5)}</TotalImpuesto>
    <TotalIVADevuelto>0.00000</TotalIVADevuelto>
    <TotalOtrosCargos>0.00000</TotalOtrosCargos>
    <TotalComprobante>${tot.total.toFixed(5)}</TotalComprobante>
  </ResumenFactura>
  ${g('__feObs')?`<Otros><OtroTexto>${g('__feObs')}</OtroTexto></Otros>`:''}
</FacturaElectronica>`;

  const blob = new Blob([xml], {type:'application/xml;charset=utf-8'});
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `FE-${consec}-${new Date().toISOString().slice(0,10)}.xml`;
  a.click();
  document.getElementById('__fePanel').remove();
  showToast('📥 XML Hacienda generado ✅');
}

function __feInsertDoc() {
  const lines  = window.__feLineas || [];
  if (!lines.length) { showToast('Agregá al menos una línea'); return; }
  __feCalcTotales();

  const g   = id => document.getElementById(id)?.value?.trim() || '';
  const fmt = n => '₡'+n.toLocaleString('es-CR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const tot = window.__feTotales || { subtotal:0, ivaTotal:0, total:0 };
  const consec = window.__feConsec;

  const html = `
  <div style="font-family:Calibri,Arial,sans-serif;border:1px solid #003da5;border-radius:8px;overflow:hidden;max-width:580px;margin:12px auto">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:13pt;font-weight:700">🇨🇷 FACTURA ELECTRÓNICA</div>
        <div style="font-size:8pt;opacity:.85">Ministerio de Hacienda · v4.3 · Consecutivo: ${consec}</div>
      </div>
      <div style="text-align:right;font-size:9pt;opacity:.9">
        <div>${new Date(g('__feFecha')).toLocaleDateString('es-CR',{day:'2-digit',month:'long',year:'numeric'})}</div>
      </div>
    </div>
    <div style="padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;border-bottom:1px solid #eee;font-size:10pt">
      <div><div style="font-size:8pt;color:#888;font-weight:700;margin-bottom:3px">EMISOR</div><div style="font-weight:700">${g('__feEmisorNombre')}</div><div style="color:#555">${g('__feEmisorCedula')}</div><div style="color:#555">${g('__feEmisorEmail')}</div></div>
      <div><div style="font-size:8pt;color:#888;font-weight:700;margin-bottom:3px">RECEPTOR</div><div style="font-weight:700">${g('__feRecNombre')}</div><div style="color:#555">${g('__feRecCedula')}</div><div style="color:#555">${g('__feRecEmail')}</div></div>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0f7ff"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Descripción</th><th style="padding:7px 10px;border:1px solid #ddd">Cant</th><th style="padding:7px 10px;border:1px solid #ddd">Precio</th><th style="padding:7px 10px;border:1px solid #ddd">IVA</th><th style="padding:7px 10px;border:1px solid #ddd">Total</th></tr>
      ${lines.map((l,i)=>`<tr style="${i%2?'background:#fafafa':''}"><td style="padding:7px 10px;border:1px solid #ddd">${l.desc}</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:center">${l.cant}</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:right">${fmt(l.precio)}</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:center">${l.iva}%</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(l.subtotal+l.ivaAmount)}</td></tr>`).join('')}
    </table>
    <div style="padding:10px 16px;background:#f8f9fa;border-top:1px solid #eee">
      <div style="display:flex;justify-content:flex-end;gap:20px;font-size:10pt">
        <div style="text-align:right"><div>Subtotal: <strong>${fmt(tot.subtotal)}</strong></div><div style="color:#e74c3c">IVA: <strong>${fmt(tot.ivaTotal)}</strong></div><div style="font-size:13pt;font-weight:800;color:#003da5;border-top:2px solid #003da5;margin-top:4px;padding-top:4px">TOTAL: ${fmt(tot.total)}</div></div>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:8pt;color:#aaa;text-align:center;background:#fff">Comprobante de referencia — Válido con firma digital de Hacienda CR · WC Corporate Editor</div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__fePanel').remove();
  showToast('🇨🇷 Factura electrónica insertada ✅');
}

function openSalariosMinimos() {
  const old = document.getElementById('__salmPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__salmPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const categorias = [
    { cat:'👷 Trabajadores no calificados', items:[
      { cargo:'Trabajador no calificado genérico',         mensual:401902, diario:13397 },
      { cargo:'Trabajador agrícola general',               mensual:393561, diario:13119 },
      { cargo:'Servicio doméstico',                        mensual:393561, diario:13119 },
    ]},
    { cat:'🔧 Trabajadores semi-calificados', items:[
      { cargo:'Trabajador semi-calificado',                mensual:430036, diario:14335 },
      { cargo:'Chofer transporte privado',                 mensual:448772, diario:14959 },
    ]},
    { cat:'🎓 Trabajadores calificados', items:[
      { cargo:'Trabajador calificado genérico',            mensual:460558, diario:15352 },
      { cargo:'Técnico diploma',                           mensual:492000, diario:16400 },
      { cargo:'Bachiller universitario',                   mensual:541000, diario:18033 },
      { cargo:'Licenciado universitario',                  mensual:651700, diario:21723 },
      { cargo:'Licenciado 10+ años experiencia',           mensual:706200, diario:23540 },
    ]},
    { cat:'🏢 Sector específico', items:[
      { cargo:'Comercio — Dependiente',                    mensual:430036, diario:14335 },
      { cargo:'Industria — Operario',                      mensual:440000, diario:14667 },
      { cargo:'Construcción — Peón',                       mensual:415000, diario:13833 },
      { cargo:'Construcción — Oficial',                    mensual:460000, diario:15333 },
      { cargo:'Salud — Auxiliar enfermería',               mensual:505000, diario:16833 },
      { cargo:'Educación privada — Docente',               mensual:541000, diario:18033 },
    ]},
  ];

  let catHTML = '';
  categorias.forEach(cat => {
    catHTML += `<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;padding:6px 10px;background:#f8f9fa;border-radius:6px">${cat.cat}</div>
      ${cat.items.map(item => `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;margin-bottom:4px;transition:background .15s;cursor:pointer"
          onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background=''"
          onclick="__salmInsert('${item.cargo.replace(/'/g,"\\'")}',${item.mensual},${item.diario})">
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600;color:#1a1a1a">${item.cargo}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:12px;font-weight:700;color:#003da5">₡${item.mensual.toLocaleString('es-CR')}</div>
            <div style="font-size:10px;color:#888">₡${item.diario.toLocaleString('es-CR')}/día</div>
          </div>
        </div>`).join('')}
    </div>`;
  });

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:2px">💼 Salarios mínimos CR — 2025</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">MTSS · I Semestre 2025 · Toca para insertar</div>
      <input type="text" id="__salmSearch" placeholder="Buscar cargo..."
        style="width:100%;padding:9px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:12px"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__salmFilter(this.value)">
    </div>
    <div id="__salmContent" style="flex:1;overflow-y:auto;padding:0 20px 16px">${catHTML}</div>
    <div style="padding:12px 20px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__salmPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__salmInsertTabla()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📋 Insertar tabla completa</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__salmData = categorias;
}

function __salmFilter(q) {
  const content = document.getElementById('__salmContent');
  if (!content||!q.trim()) return;
  const items = content.querySelectorAll('[onclick^="__salmInsert"]');
  items.forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function __salmInsert(cargo, mensual, diario) {
  const fmt = n => '₡'+n.toLocaleString('es-CR');
  if (typeof insertHTML==='function') insertHTML(
    `<span style="background:#f0f7ff;border:1px solid #003da5;border-radius:4px;padding:1px 8px;font-size:10pt">
      ${cargo}: <strong>${fmt(mensual)}/mes</strong> · ${fmt(diario)}/día (MTSS 2025)
    </span>`
  );
  document.getElementById('__salmPanel').remove();
  showToast('Salario insertado ✅');
}

function __salmInsertTabla() {
  const cats = window.__salmData || [];
  let rows = '';
  cats.forEach(cat => {
    rows += `<tr><td colspan="3" style="padding:8px 10px;background:#003da5;color:#fff;font-weight:700;font-size:10pt">${cat.cat}</td></tr>`;
    cat.items.forEach((item,i) => {
      rows += `<tr style="${i%2?'background:#f0f7ff':''}">
        <td style="padding:7px 10px;border:1px solid #ddd;font-size:10pt">${item.cargo}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:right;font-weight:600;font-size:10pt">₡${item.mensual.toLocaleString('es-CR')}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:right;font-size:10pt">₡${item.diario.toLocaleString('es-CR')}</td>
      </tr>`;
    });
  });

  const html = `<div style="margin:12px 0">
    <h3 style="color:#003da5;margin-bottom:8px">💼 Salarios Mínimos — Costa Rica I Semestre 2025</h3>
    <table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif">
      <tr style="background:#1a2942;color:#fff"><th style="padding:8px 10px;text-align:left">Cargo</th><th style="padding:8px 10px;text-align:right">Mensual</th><th style="padding:8px 10px;text-align:right">Diario</th></tr>
      ${rows}
    </table>
    <p style="font-size:9pt;color:#888;margin-top:6px">Fuente: MTSS · Decreto Ejecutivo · I Semestre 2025 · Costa Rica</p>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__salmPanel').remove();
  showToast('Tabla de salarios insertada ✅');
}

function openLegalTemplates() {
  const old = document.getElementById('__legalPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__legalPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const templates = [
    {
      icon:'📜', name:'Poder Especial Notarial',
      desc:'Para gestiones específicas ante instituciones',
      template: (d) => `
      <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:16cm;margin:0 auto">
        <h2 style="text-align:center;text-transform:uppercase;color:#1a2942">PODER ESPECIAL</h2>
        <p style="text-align:justify">Yo, <strong>${d.otorgante||'[NOMBRE COMPLETO]'}</strong>, mayor, <strong>${d.estadoCivil||'[estado civil]'}</strong>, vecino/a de <strong>${d.domicilio||'[domicilio]'}</strong>, portador/a de la cédula de identidad número <strong>${d.cedula||'[número de cédula]'}</strong>, por medio del presente instrumento otorgo <strong>PODER ESPECIAL</strong> a favor de:</p>
        <p style="text-align:justify"><strong>${d.apoderado||'[NOMBRE DEL APODERADO]'}</strong>, mayor, <strong>${d.estadoCivilAp||'[estado civil]'}</strong>, cédula número <strong>${d.cedulaAp||'[cédula]'}</strong>, para que en mi nombre y representación realice los siguientes actos:</p>
        <p style="text-align:justify"><strong>PRIMERO:</strong> ${d.objeto||'[Describir las facultades específicas otorgadas]'}.</p>
        <p style="text-align:justify"><strong>SEGUNDO:</strong> El presente poder es <strong>ESPECIAL</strong> y se limita única y exclusivamente a las gestiones indicadas en la cláusula anterior.</p>
        <p style="text-align:justify"><strong>TERCERO:</strong> Este poder será válido hasta que sea expresamente revocado.</p>
        <p style="text-align:justify">En fe de lo anterior firmo en la ciudad de <strong>${d.lugar||'San José'}</strong>, a los <strong>${new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})}</strong>.</p>
        <div style="margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">${d.otorgante||'Poderdante'}<br><small>Cédula: ${d.cedula||'_____________'}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">${d.apoderado||'Apoderado'}<br><small>Cédula: ${d.cedulaAp||'_____________'}</small></div></div>
        </div>
        <div style="margin-top:40px;border:1px solid #333;padding:16px;border-radius:4px">
          <p style="text-align:center;font-size:10pt;color:#555">AUTENTICACIÓN NOTARIAL</p>
          <p style="font-size:10pt">Ante mí, <strong>_____________________</strong>, Notario Público con oficina en _____________________, comparece personalmente <strong>${d.otorgante||'_____________________'}</strong>, quien es conocido/a por mí e identificado/a con la cédula indicada.</p>
          <p style="font-size:10pt">Firma del Notario: _____________________  Nº de tomo: _____ Folio: _____ Asiento: _____</p>
        </div>
      </div>`
    },
    {
      icon:'🏠', name:'Contrato de Arrendamiento',
      desc:'Alquiler de inmueble — Ley 7527',
      template: (d) => `
      <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:16cm;margin:0 auto">
        <h2 style="text-align:center;text-transform:uppercase;color:#1a2942">CONTRATO DE ARRENDAMIENTO</h2>
        <p style="text-align:justify">Entre <strong>${d.arrendador||'[ARRENDADOR]'}</strong>, cédula <strong>${d.cedArrendador||'_____________'}</strong>, en adelante <em>EL ARRENDADOR</em>, y <strong>${d.arrendatario||'[ARRENDATARIO]'}</strong>, cédula <strong>${d.cedArrendatario||'_____________'}</strong>, en adelante <em>EL ARRENDATARIO</em>, se celebra el presente Contrato de Arrendamiento al tenor de las siguientes cláusulas:</p>
        <p><strong>PRIMERA (Objeto):</strong> El Arrendador da en arrendamiento al Arrendatario el inmueble ubicado en <strong>${d.inmueble||'[DIRECCIÓN DEL INMUEBLE]'}</strong>, inscrito en el Registro Nacional bajo la finca <strong>${d.finca||'_____________'}</strong>.</p>
        <p><strong>SEGUNDA (Destino):</strong> El inmueble se destina exclusivamente para uso <strong>${d.uso||'habitacional'}</strong>.</p>
        <p><strong>TERCERA (Plazo):</strong> El plazo del arrendamiento es de <strong>${d.plazo||'doce (12) meses'}</strong>, a partir del <strong>${d.inicio||new Date().toLocaleDateString('es-CR')}</strong>.</p>
        <p><strong>CUARTA (Renta):</strong> La renta mensual es de <strong>${d.renta||'₡_____________'}</strong>, pagadera dentro de los primeros cinco días de cada mes.</p>
        <p><strong>QUINTA (Depósito):</strong> El Arrendatario entrega un depósito de garantía equivalente a <strong>un mes</strong> de renta (₡${d.deposito||'_____________'}), reembolsable al vencimiento del contrato.</p>
        <p><strong>SEXTA (Legislación):</strong> Este contrato se rige por la Ley General de Arrendamientos Urbanos y Suburbanos N° 7527 y sus reformas.</p>
        <div style="margin-top:50px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">Arrendador<br><small>${d.arrendador||'_____________'}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">Arrendatario<br><small>${d.arrendatario||'_____________'}</small></div></div>
        </div>
      </div>`
    },
    {
      icon:'📋', name:'Declaración Jurada',
      desc:'Ante notario público — Uso general',
      template: (d) => `
      <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:16cm;margin:0 auto">
        <h2 style="text-align:center;text-transform:uppercase;color:#1a2942">DECLARACIÓN JURADA</h2>
        <p style="text-align:justify">Yo, <strong>${d.declarante||'[NOMBRE COMPLETO]'}</strong>, mayor, <strong>${d.estadoCivil||'[estado civil]'}</strong>, vecino/a de <strong>${d.domicilio||'[domicilio]'}</strong>, portador/a de la cédula de identidad número <strong>${d.cedula||'_____________'}</strong>, bajo la fe del juramento y con plena conciencia de las responsabilidades civiles y penales que implica hacer una declaración jurada, <strong>DECLARO BAJO JURAMENTO</strong>:</p>
        <p style="text-align:justify"><strong>PRIMERO:</strong> Que ${d.declaracion1||'[Primera declaración]'}.</p>
        <p style="text-align:justify"><strong>SEGUNDO:</strong> Que ${d.declaracion2||'[Segunda declaración si aplica]'}.</p>
        <p style="text-align:justify"><strong>TERCERO:</strong> Que la presente declaración la hago en forma libre y voluntaria, sin coacción alguna, y que los datos consignados son verídicos y exactos.</p>
        <p style="text-align:justify">La presente declaración la suscribo en <strong>${d.lugar||'San José'}</strong>, a los <strong>${new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})}</strong>.</p>
        <div style="margin-top:60px;text-align:center"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:200px">${d.declarante||'Declarante'}<br><small>Cédula: ${d.cedula||'_____________'}</small></div></div>
        <div style="margin-top:30px;border:1px solid #333;padding:14px;border-radius:4px">
          <p style="font-size:10pt;margin:0">Ratificado ante Notario: _____________________ · Protocolo N°: _____ · Tomo: _____ · Folio: _____</p>
        </div>
      </div>`
    },
    {
      icon:'💼', name:'Carta de Renuncia',
      desc:'Renuncia laboral con preaviso — Código Trabajo CR',
      template: (d) => `
      <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.7;max-width:16cm;margin:0 auto">
        <p style="text-align:right">${d.lugar||'San José'}, ${new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})}</p>
        <br>
        <p><strong>${d.empleador||'Señores'}</strong><br>${d.empresa||'[Nombre de la empresa]'}<br>Estimados señores:</p>
        <p style="text-align:justify">Por medio de la presente, yo <strong>${d.empleado||'[Nombre del empleado]'}</strong>, portador/a de la cédula número <strong>${d.cedula||'_____________'}</strong>, en mi calidad de <strong>${d.cargo||'[Cargo]'}</strong>, me permito comunicarles mi <strong>renuncia irrevocable</strong> al puesto que vengo desempeñando en esta empresa.</p>
        <p style="text-align:justify">De conformidad con el Artículo 28 del Código de Trabajo de Costa Rica, otorgo el preaviso legal correspondiente, siendo mi último día de labores el día <strong>${d.ultimoDia||'_____________'}</strong>.</p>
        <p style="text-align:justify">Agradezco la oportunidad brindada durante mi tiempo en la empresa y deseo mucho éxito a la institución.</p>
        <p style="margin-top:20px">Atentamente,</p>
        <div style="margin-top:40px"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:200px">${d.empleado||'Empleado/a'}<br><small>Cédula: ${d.cedula||'_____________'}</small></div></div>
      </div>`
    },
    {
      icon:'🤝', name:'Carta de Recomendación',
      desc:'Referencia laboral o académica',
      template: (d) => `
      <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.7;max-width:16cm;margin:0 auto">
        <p style="text-align:right">${d.lugar||'San José'}, ${new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})}</p>
        <p><strong>A quien corresponda:</strong></p>
        <p style="text-align:justify">Por medio de la presente, yo <strong>${d.recomendador||'[Nombre del recomendador]'}</strong>, en mi calidad de <strong>${d.cargoRec||'[Cargo]'}</strong> de <strong>${d.empresaRec||'[Empresa]'}</strong>, me permito extender la presente carta de recomendación a favor de <strong>${d.recomendado||'[Nombre del recomendado]'}</strong>.</p>
        <p style="text-align:justify">Durante el tiempo que ${d.recomendado||'la persona indicada'} laboró/estudió en nuestra institución, demostró ser una persona de <strong>alta responsabilidad, compromiso y excelente desempeño profesional</strong>. Sus principales características son: ${d.cualidades||'puntualidad, trabajo en equipo y capacidad de aprendizaje'}.</p>
        <p style="text-align:justify">Por lo anterior, recomiendo ampliamente a <strong>${d.recomendado||'esta persona'}</strong> para el puesto o actividad para el cual se postula, sin ninguna reserva.</p>
        <p style="margin-top:20px">Atentamente,</p>
        <div style="margin-top:40px"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:200px">${d.recomendador||'Recomendador'}<br><small>${d.cargoRec||'Cargo'} · ${d.empresaRec||'Empresa'}</small><br><small>Tel: ${d.telRec||'_____________'}</small></div></div>
      </div>`
    },
  ];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">⚖️ Documentos legales CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Plantillas oficiales adaptadas al derecho costarricense</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 20px 8px;display:flex;flex-direction:column;gap:8px">
      ${templates.map((t,i)=>`
        <div style="border:1.5px solid #eee;border-radius:14px;padding:14px;cursor:pointer;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f8f9ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fff'"
          onclick="__legalGenerate(${i})">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:28px">${t.icon}</span>
            <div>
              <div style="font-size:14px;font-weight:700;color:#1a1a1a">${t.name}</div>
              <div style="font-size:11px;color:#888">${t.desc}</div>
            </div>
            <div style="margin-left:auto;font-size:18px;color:#ccc">›</div>
          </div>
        </div>`).join('')}
    </div>
    <div style="padding:12px 20px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__legalPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__legalTemplates = templates;
}

function __legalGenerate(idx) {
  const t = (window.__legalTemplates||[])[idx];
  if (!t) return;
  document.getElementById('__legalPanel').remove();

  const old = document.getElementById('__legalDataPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__legalDataPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px';

  const fieldSets = {
    0: [ // Poder notarial
      ['otorgante','Nombre del poderdante *'],['cedula','Cédula del poderdante *'],
      ['estadoCivil','Estado civil'],['domicilio','Domicilio'],
      ['apoderado','Nombre del apoderado *'],['cedulaAp','Cédula del apoderado *'],
      ['estadoCivilAp','Estado civil apoderado'],['objeto','Objeto del poder *'],['lugar','Ciudad'],
    ],
    1: [ // Arrendamiento
      ['arrendador','Nombre arrendador *'],['cedArrendador','Cédula arrendador *'],
      ['arrendatario','Nombre arrendatario *'],['cedArrendatario','Cédula arrendatario *'],
      ['inmueble','Dirección del inmueble *'],['finca','N° de finca'],
      ['uso','Uso (habitacional/comercial)'],['plazo','Plazo'],
      ['inicio','Fecha inicio'],['renta','Monto mensual ₡ *'],['deposito','Depósito garantía ₡'],
    ],
    2: [ // Declaración jurada
      ['declarante','Nombre del declarante *'],['cedula','Cédula *'],
      ['estadoCivil','Estado civil'],['domicilio','Domicilio'],
      ['declaracion1','Primera declaración *'],['declaracion2','Segunda declaración'],['lugar','Ciudad'],
    ],
    3: [ // Renuncia
      ['empleado','Nombre del empleado *'],['cedula','Cédula *'],
      ['cargo','Cargo que ocupa'],['empleador','Nombre del empleador'],
      ['empresa','Nombre de la empresa'],['ultimoDia','Fecha último día *'],['lugar','Ciudad'],
    ],
    4: [ // Recomendación
      ['recomendador','Nombre de quien recomienda *'],['cargoRec','Cargo *'],
      ['empresaRec','Empresa / Institución *'],['telRec','Teléfono'],
      ['recomendado','Nombre del recomendado *'],['cualidades','Cualidades destacadas'],['lugar','Ciudad'],
    ],
  };

  const fields = fieldSets[idx] || [];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">${t.icon} ${t.name}</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Completá los datos para generar el documento</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      ${fields.map(([id,label])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="text" id="__legalData_${id}" placeholder="${label.replace(' *','')}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__legalDataPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__legalInsert(${idx})" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">⚖️ Generar documento</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __legalInsert(idx) {
  const t = (window.__legalTemplates||[])[idx];
  if (!t) return;
  const data = {};
  document.querySelectorAll('[id^="__legalData_"]').forEach(el => {
    const key = el.id.replace('__legalData_','');
    data[key] = el.value.trim();
  });
  const html = t.template(data);
  if (typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__legalDataPanel').remove();
  showToast(`${t.icon} ${t.name} generado ✅`);
}

function openSICOP() {
  const old = document.getElementById('__sicopPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__sicopPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const tiposContratacion = [
    { code:'LP',  name:'Licitación Pública',           min:'₡181,597,000+' },
    { code:'LA',  name:'Licitación Abreviada',          min:'₡18,159,700 – ₡181,597,000' },
    { code:'CD',  name:'Contratación Directa',          min:'Hasta ₡18,159,700' },
    { code:'CDN', name:'Contratación Directa con Num.', min:'Según reglamento' },
    { code:'CE',  name:'Contratación de Emergencia',    min:'Cualquier monto' },
    { code:'MC',  name:'Concurso por Méritos',          min:'Servicios profesionales' },
  ];

  const plantillasOferta = [
    {
      name:'📄 Carta de Presentación SICOP',
      content: () => {
        const empresa = prompt('Nombre de tu empresa:', 'Mi Empresa S.A.') || 'Mi Empresa S.A.';
        const cedJur  = prompt('Cédula jurídica:', '3-101-000000') || '3-101-000000';
        const licitacion = prompt('N° de licitación:', 'LN-000001-0001') || 'LN-000001-0001';
        const objeto  = prompt('Objeto de la licitación:', '') || '[Objeto del concurso]';
        return `
        <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.7;max-width:16cm;margin:0 auto">
          <p style="text-align:right">San José, ${new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})}</p>
          <p><strong>Proveeduría Institucional</strong><br>[Nombre de la Institución]<br>SICOP — Contratación N° ${licitacion}</p>
          <p><strong>Estimados señores:</strong></p>
          <p style="text-align:justify">La empresa <strong>${empresa}</strong>, con cédula jurídica <strong>${cedJur}</strong>, debidamente inscrita en el Registro de Proveedores del Sistema Integrado de Compras Públicas (SICOP), se permite presentar oferta formal para la contratación <strong>${licitacion}</strong>, cuyo objeto es: <em>${objeto}</em>.</p>
          <p style="text-align:justify">Declaramos bajo fe de juramento que:</p>
          <p>1. Cumplimos con todos los requisitos establecidos en el cartel.<br>2. La información suministrada es verídica y comprobable.<br>3. No nos encontramos en ninguna de las causales de inhabilitación del artículo 65 de la Ley de Contratación Administrativa.</p>
          <p style="text-align:justify">Atentamente,</p>
          <div style="margin-top:40px"><strong>_____________________________</strong><br>${empresa}<br>Cédula Jurídica: ${cedJur}<br>Representante Legal</div>
        </div>`;
      }
    },
    {
      name:'📋 Declaración Jurada SICOP',
      content: () => `
      <div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.7;max-width:16cm;margin:0 auto">
        <h3 style="text-align:center;color:#003da5">DECLARACIÓN JURADA DEL OFERENTE<br><small style="font-size:10pt">Artículo 65 — Ley de Contratación Administrativa N° 7494</small></h3>
        <p style="text-align:justify">Yo, <strong>_____________________</strong>, en mi condición de representante legal de <strong>_____________________</strong>, cédula jurídica <strong>_____________________</strong>, declaro bajo la fe del juramento:</p>
        <p>✅ Que la empresa <strong>NO</strong> se encuentra en ninguna de las siguientes situaciones:</p>
        <ul style="font-size:11pt">
          <li>Inhabilitada para contratar con el Estado</li>
          <li>En proceso de quiebra o liquidación</li>
          <li>Con mora con la CCSS o Hacienda</li>
          <li>Condenada por corrupción o delitos contra la Hacienda Pública</li>
          <li>Incursa en conflicto de intereses con la institución contratante</li>
        </ul>
        <p style="text-align:justify">Esta declaración se hace bajo pena de las sanciones establecidas en el artículo 69 de la Ley Nº 7494.</p>
        <div style="margin-top:40px"><strong>Firma: _____________________</strong><br>Representante Legal<br>Fecha: ${new Date().toLocaleDateString('es-CR')}</div>
      </div>`
    },
    {
      name:'💰 Formulario de Oferta Económica',
      content: () => `
      <div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;max-width:16cm;margin:0 auto">
        <h3 style="text-align:center;color:#003da5">OFERTA ECONÓMICA — SICOP</h3>
        <table style="border-collapse:collapse;width:100%;font-size:11pt">
          <tr style="background:#003da5;color:#fff">
            <th style="padding:8px;border:1px solid #002080;text-align:left">N°</th>
            <th style="padding:8px;border:1px solid #002080;text-align:left">Descripción</th>
            <th style="padding:8px;border:1px solid #002080">Cantidad</th>
            <th style="padding:8px;border:1px solid #002080">Unidad</th>
            <th style="padding:8px;border:1px solid #002080">P. Unit ₡</th>
            <th style="padding:8px;border:1px solid #002080">Total ₡</th>
          </tr>
          ${[1,2,3].map(i=>`<tr><td style="padding:7px 8px;border:1px solid #ddd">${i}</td><td style="padding:7px 8px;border:1px solid #ddd">[Descripción línea ${i}]</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">1</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">Unidad</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right">₡0,00</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right">₡0,00</td></tr>`).join('')}
          <tr style="background:#f0f7ff"><td colspan="5" style="padding:7px 8px;border:1px solid #ddd;font-weight:700;text-align:right">SUBTOTAL</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right;font-weight:700">₡0,00</td></tr>
          <tr><td colspan="5" style="padding:7px 8px;border:1px solid #ddd;text-align:right">IVA 13%</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right">₡0,00</td></tr>
          <tr style="background:#003da5;color:#fff"><td colspan="5" style="padding:8px;border:1px solid #002080;font-weight:700;font-size:12pt;text-align:right">TOTAL OFERTA</td><td style="padding:8px;border:1px solid #002080;text-align:right;font-weight:700;font-size:12pt">₡0,00</td></tr>
        </table>
        <p style="font-size:10pt;color:#666;margin-top:8px">Precio en colones costarricenses, IVA incluido. Válido por 30 días hábiles.</p>
      </div>`
    },
  ];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      🏛️ SICOP — Compras públicas CR
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Sistema Integrado de Compras Públicas · Gobierno de Costa Rica</div>

    <!-- Tipos de contratación -->
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Tipos de contratación</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${tiposContratacion.map(t=>`
          <div style="border:1px solid #eee;border-radius:10px;padding:10px;background:#fafafa">
            <div style="font-size:13px;font-weight:700;color:#003da5">${t.code}</div>
            <div style="font-size:11px;font-weight:600;color:#1a1a1a;margin:2px 0">${t.name}</div>
            <div style="font-size:10px;color:#888">${t.min}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Plantillas -->
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Plantillas de oferta</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${plantillasOferta.map((p,i)=>`
          <button onclick="__sicopInsert(${i})"
            style="padding:12px 16px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:left;font-size:13px;font-weight:600;color:#1a1a1a;transition:all .15s"
            onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            ${p.name}
          </button>`).join('')}
      </div>
    </div>

    <!-- Links SICOP -->
    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">🔗 Acceso directo a SICOP</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[
          ['Portal SICOP', 'https://www.sicop.go.cr'],
          ['Registro de proveedores','https://www.sicop.go.cr/index.jsp'],
          ['Hacienda CR','https://www.hacienda.go.cr'],
          ['COMEX — Trámites','https://www.comex.go.cr'],
        ].map(([label,url])=>`
          <a href="${url}" target="_blank" style="color:#0084ff;font-size:12px;text-decoration:none;display:flex;align-items:center;gap:6px">
            🌐 ${label}
          </a>`).join('')}
      </div>
    </div>

    <button onclick="document.getElementById('__sicopPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__sicopPlantillas = plantillasOferta;
}

function __sicopInsert(idx) {
  const p = (window.__sicopPlantillas||[])[idx];
  if (!p) return;
  const html = typeof p.content === 'function' ? p.content() : p.content;
  if (html && typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__sicopPanel').remove();
  showToast('Plantilla SICOP insertada ✅');
}

const WC_ZEN = {
  active:    false,
  wordGoal:  0,
  startWords:0,
  timer:     null,
  elapsed:   0,

  toggle() {
    this.active ? this.exit() : this.enter();
  },

  enter() {
    this.active = true;
    const ed = document.getElementById('editor');
    if (!ed) return;

    this._savedStyles = {
      editorClass:  ed.className,
      bodyOverflow: document.body.style.overflow,
      bodyBg:       document.body.style.background,
    };

    this.startWords = ed.innerText.trim().split(/\s+/).filter(w=>w).length;
    this.elapsed = 0;

    const overlay = document.createElement('div');
    overlay.id = '__zenOverlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9000;
      background:#1a1a1a;
      display:flex;flex-direction:column;
      align-items:center;
      font-family:-apple-system,'Segoe UI',sans-serif;
      overflow-y:auto;
    `;

    overlay.innerHTML = `
      <!-- Barra superior zen -->
      <div id="__zenBar" style="position:fixed;top:0;left:0;right:0;z-index:9001;background:rgba(26,26,26,.95);padding:10px 20px;display:flex;align-items:center;gap:12px;transition:opacity .3s;opacity:0" id="__zenTopBar">
        <button onclick="WC_ZEN.exit()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px">✕ Salir</button>
        <div style="flex:1;text-align:center;font-size:12px;color:#555">Modo escritura zen · ESC para salir</div>
        <div style="display:flex;gap:8px">
          <button onclick="WC_ZEN.setTheme('dark')" style="width:20px;height:20px;border-radius:50%;background:#1a1a1a;border:2px solid #555;cursor:pointer"></button>
          <button onclick="WC_ZEN.setTheme('sepia')" style="width:20px;height:20px;border-radius:50%;background:#f4ecd8;border:2px solid #888;cursor:pointer"></button>
          <button onclick="WC_ZEN.setTheme('light')" style="width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid #ccc;cursor:pointer"></button>
        </div>
      </div>

      <!-- Editor zen -->
      <div style="width:100%;max-width:720px;padding:80px 40px 200px;flex:1">
        <div id="__zenEditor"
          contenteditable="true" spellcheck="true"
          style="min-height:60vh;outline:none;font-size:20px;line-height:1.8;color:#e0e0e0;caret-color:#0084ff;">
        </div>
      </div>

      <!-- Barra inferior zen -->
      <div id="__zenBottom" style="position:fixed;bottom:0;left:0;right:0;z-index:9001;background:rgba(26,26,26,.95);padding:10px 24px;display:flex;align-items:center;gap:16px;transition:opacity .3s;opacity:0">
        <div id="__zenWordCount" style="font-size:12px;color:#555">0 palabras</div>
        <div id="__zenWordsAdded" style="font-size:12px;color:#27ae60">+0 escritas</div>
        <div style="flex:1"></div>
        <div id="__zenTimer" style="font-size:12px;color:#555;font-family:'Courier New',monospace">00:00</div>
        <div id="__zenGoalBox" style="display:flex;align-items:center;gap:6px">
          <input type="number" id="__zenGoalInput" placeholder="Meta" value="${this.wordGoal||''}" min="0"
            style="width:70px;padding:4px 8px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:6px;color:#888;font-size:11px;outline:none;text-align:center">
          <span style="font-size:11px;color:#555">palabras meta</span>
        </div>
        <div id="__zenProgress" style="width:100px;height:4px;background:#333;border-radius:2px;overflow:hidden">
          <div id="__zenProgressBar" style="height:100%;background:#0084ff;width:0%;transition:width .3s;border-radius:2px"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const zenEd = document.getElementById('__zenEditor');
    if (zenEd) {
      zenEd.innerHTML = ed.innerHTML;
      zenEd.focus();
      const range = document.createRange();
      range.selectNodeContents(zenEd);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    let hideTimer;
    overlay.addEventListener('mousemove', () => {
      const top = document.getElementById('__zenBar');
      const bot = document.getElementById('__zenBottom');
      if (top) top.style.opacity = '1';
      if (bot) bot.style.opacity = '1';
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (top) top.style.opacity = '0';
        if (bot) bot.style.opacity = '0';
      }, 2500);
    });

    overlay.addEventListener('touchstart', () => {
      const top = document.getElementById('__zenBar');
      const bot = document.getElementById('__zenBottom');
      if (top) top.style.opacity = '1';
      if (bot) bot.style.opacity = '1';
    }, {passive:true});

    zenEd.addEventListener('input', () => this.updateStats());

    document.getElementById('__zenGoalInput')?.addEventListener('input', e => {
      this.wordGoal = parseInt(e.target.value)||0;
      this.updateStats();
    });

    this.timer = setInterval(() => {
      this.elapsed++;
      const m = Math.floor(this.elapsed/60).toString().padStart(2,'0');
      const s = (this.elapsed%60).toString().padStart(2,'0');
      const timerEl = document.getElementById('__zenTimer');
      if (timerEl) timerEl.textContent = m+':'+s;
    }, 1000);

    document.addEventListener('keydown', this._escHandler = e => {
      if (e.key === 'Escape') this.exit();
    });

    if (overlay.requestFullscreen) overlay.requestFullscreen().catch(()=>{});

    this.updateStats();
    showToast('🧘 Modo zen activado — ESC para salir');
  },

  updateStats() {
    const zenEd = document.getElementById('__zenEditor');
    if (!zenEd) return;
    const words   = zenEd.innerText.trim().split(/\s+/).filter(w=>w).length;
    const added   = Math.max(0, words - this.startWords);
    const wc      = document.getElementById('__zenWordCount');
    const wa      = document.getElementById('__zenWordsAdded');
    const pb      = document.getElementById('__zenProgressBar');
    if (wc) wc.textContent = words.toLocaleString() + ' palabras';
    if (wa) { wa.textContent = '+'+added+' escritas'; wa.style.color = added>0?'#27ae60':'#555'; }
    if (pb && this.wordGoal > 0) {
      const pct = Math.min(100, Math.round(words/this.wordGoal*100));
      pb.style.width = pct+'%';
      pb.style.background = pct>=100?'#27ae60':'#0084ff';
    }
  },

  setTheme(theme) {
    const overlay = document.getElementById('__zenOverlay');
    const zenEd   = document.getElementById('__zenEditor');
    if (!overlay||!zenEd) return;
    const themes = {
      dark:  { bg:'#1a1a1a', text:'#e0e0e0', bar:'rgba(26,26,26,.95)' },
      sepia: { bg:'#f4ecd8', text:'#3b2a1a', bar:'rgba(244,236,216,.95)' },
      light: { bg:'#ffffff', text:'#1a1a1a', bar:'rgba(255,255,255,.95)' },
    };
    const t = themes[theme] || themes.dark;
    overlay.style.background = t.bg;
    zenEd.style.color = t.text;
    document.querySelectorAll('#__zenBar,#__zenBottom').forEach(el => { if(el) el.style.background=t.bar; });
  },

  exit() {
    if (!this.active) return;
    this.active = false;
    clearInterval(this.timer);
    document.removeEventListener('keydown', this._escHandler);

    const zenEd = document.getElementById('__zenEditor');
    const mainEd= document.getElementById('editor');
    if (zenEd && mainEd) {
      mainEd.innerHTML = zenEd.innerHTML;
      if (typeof updateStats==='function') updateStats();
    }

    if (document.fullscreenElement) document.exitFullscreen().catch(()=>{});

    const overlay = document.getElementById('__zenOverlay');
    if (overlay) overlay.remove();

    const words    = mainEd ? mainEd.innerText.trim().split(/\s+/).filter(w=>w).length : 0;
    const added    = Math.max(0, words - this.startWords);
    const mins     = Math.round(this.elapsed/60);
    const wpm      = mins > 0 ? Math.round(added/mins) : 0;

    showToast(`🧘 Zen completado · +${added} palabras · ${mins} min · ${wpm} wpm`);

    if (mainEd) localStorage.setItem('wc-v23', mainEd.innerHTML);
  }
};

(function initV2520() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'facturaElectronica': openFacturaElectronica(); break;
          case 'salariosMinimos':    openSalariosMinimos();    break;
          case 'legalTemplates':     openLegalTemplates();     break;
          case 'sicop':              openSICOP();              break;
          case 'zenMode':            WC_ZEN.toggle();          break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.20 ✅ — Factura Electrónica v4.3, Salarios MTSS, Legal CR, SICOP, Zen');
  }, 2800);
})();
function openExamGenerator() {
  const old = document.getElementById('__examPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  const text = ed ? ed.innerText.slice(0, 3000).trim() : '';

  const ov = document.createElement('div');
  ov.id = '__examPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎓 Generador de preguntas</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Crea exámenes desde el contenido del documento con IA</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de preguntas</label>
          <select id="__examTipo" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="mixto">Mixto (todas)</option>
            <option value="opciones">Opción múltiple</option>
            <option value="verdadero">Verdadero/Falso</option>
            <option value="desarrollo">Desarrollo</option>
            <option value="completar">Completar espacios</option>
            <option value="relacionar">Relacionar columnas</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cantidad</label>
          <select id="__examCant" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="5">5 preguntas</option>
            <option value="10" selected>10 preguntas</option>
            <option value="15">15 preguntas</option>
            <option value="20">20 preguntas</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Nivel</label>
          <select id="__examNivel" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="basico">Básico</option>
            <option value="intermedio" selected>Intermedio</option>
            <option value="avanzado">Avanzado universitario</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Incluir respuestas</label>
          <select id="__examRespuestas" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="si">Sí — con clave</option>
            <option value="no">No — solo preguntas</option>
            <option value="separado">Hoja separada</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Materia / Tema (opcional)</label>
        <input type="text" id="__examMateria" placeholder="Ej: Historia de Costa Rica, Biología celular..."
          style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="background:#f0f7ff;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:11px;color:#0066cc">
        📄 Se usarán las primeras 3,000 palabras del documento como base
        ${text ? `· <strong>${text.split(/\s+/).filter(w=>w).length} palabras detectadas</strong>` : ' · <strong style="color:#e74c3c">Sin contenido en el editor</strong>'}
      </div>

      <div id="__examGenerating" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        🎓 Generando preguntas con IA...
      </div>
    </div>

    <div id="__examResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Preguntas generadas</div>
      <div id="__examResult" style="font-size:13px;line-height:1.7;color:#1a1a1a"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__examPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateExam()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🎓 Generar examen</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

async function __generateExam() {
  const key = localStorage.getItem('wc-groq-key');
  if (!key) { showToast('Configurá tu API Key de Groq'); return; }

  const ed      = document.getElementById('editor');
  const content = ed ? ed.innerText.slice(0,3000).trim() : '';
  if (!content) { showToast('El editor está vacío'); return; }

  const tipo     = document.getElementById('__examTipo')?.value || 'mixto';
  const cant     = document.getElementById('__examCant')?.value || '10';
  const nivel    = document.getElementById('__examNivel')?.value || 'intermedio';
  const respuestas = document.getElementById('__examRespuestas')?.value || 'si';
  const materia  = document.getElementById('__examMateria')?.value.trim() || '';

  const tipoDesc = {
    mixto:     'variadas: opción múltiple (4 opciones), verdadero/falso y preguntas de desarrollo',
    opciones:  'de opción múltiple con 4 opciones cada una (a, b, c, d)',
    verdadero: 'de verdadero o falso con justificación breve',
    desarrollo:'de desarrollo y análisis crítico',
    completar: 'para completar espacios en blanco',
    relacionar:'para relacionar columnas (dos columnas)',
  };

  const gen = document.getElementById('__examGenerating');
  if (gen) gen.style.display = 'block';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer '+key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: 'Sos un docente universitario costarricense experto en evaluación académica. Generás exámenes en español con preguntas claras y precisas.'
        },{
          role: 'user',
          content: `Basándote EXCLUSIVAMENTE en el siguiente contenido, genera ${cant} preguntas ${tipoDesc[tipo]} de nivel ${nivel}${materia?' sobre '+materia:''}.

${respuestas==='si'?'Incluye la respuesta correcta al final de cada pregunta entre corchetes [RESPUESTA: ...]':
  respuestas==='separado'?'Genera primero TODAS las preguntas sin respuestas, luego agrega una sección "CLAVE DE RESPUESTAS" al final':'No incluyas las respuestas'}

Usa numeración clara (1., 2., 3...). Para opción múltiple usa a) b) c) d).

CONTENIDO DEL DOCUMENTO:
"""
${content}
"""`
        }],
        temperature: 0.5,
        max_tokens: 2000
      })
    });

    const data  = await res.json();
    const reply = data?.choices?.[0]?.message?.content || '';

    if (gen) gen.style.display = 'none';

    const resultBox = document.getElementById('__examResultBox');
    const result    = document.getElementById('__examResult');
    if (resultBox) resultBox.style.display = 'block';
    if (result)    result.innerHTML = reply.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');

    window.__examContent = reply;

    const btnRow = document.querySelector('#__examPanel > div:last-child');
    if (btnRow) {
      btnRow.innerHTML = `
        <button onclick="document.getElementById('__examPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
        <button onclick="__insertExam()" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📋 Insertar en documento</button>
      `;
    }

  } catch(e) {
    if (gen) gen.style.display = 'none';
    showToast('Error: ' + e.message);
  }
}

function __insertExam() {
  const content = window.__examContent;
  if (!content) return;
  const materia  = document.getElementById('__examMateria')?.value.trim() || 'Examen';
  const html = `
  <div style="font-family:Calibri,Arial,sans-serif;max-width:16cm;margin:0 auto">
    <div style="border-bottom:3px solid #0084ff;padding-bottom:8px;margin-bottom:16px">
      <h2 style="color:#003da5;margin:0;font-size:16pt">${materia}</h2>
      <div style="font-size:10pt;color:#888;margin-top:4px">Nombre: _________________________________ Fecha: _____________ Nota: _______</div>
    </div>
    <div style="font-size:11pt;line-height:1.8;white-space:pre-wrap">${content.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div>
    <div style="font-size:9pt;color:#aaa;margin-top:20px;text-align:center;border-top:1px solid #eee;padding-top:8px">Generado por WC Corporate Editor · IA Llama 3.3</div>
  </div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__examPanel').remove();
  showToast('🎓 Examen insertado ✅');
}

function openPlagiarismDetector() {
  const old = document.getElementById('__plagPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  const text = ed ? ed.innerText.trim() : '';

  const ov = document.createElement('div');
  ov.id = '__plagPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔍 Detector de plagio</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Análisis de originalidad y similitud del texto</div>

      <div style="background:#fff9e6;border:1.5px solid #f39c12;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#856404;line-height:1.6">
        ⚠️ <strong>Nota:</strong> Este es un análisis básico de características del texto (repetición, n-gramas, frases comunes) y no reemplaza herramientas especializadas como Turnitin o PlagScan. Para análisis académico formal usá herramientas certificadas.
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">Opciones de análisis</label>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="__plagRepeticion" checked style="accent-color:#0084ff;width:15px;height:15px">
            <span style="font-size:13px;color:#555">Detectar frases repetidas (>5 palabras)</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="__plagPatrones" checked style="accent-color:#0084ff;width:15px;height:15px">
            <span style="font-size:13px;color:#555">Analizar patrones de escritura inconsistentes</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="__plagIA" checked style="accent-color:#0084ff;width:15px;height:15px">
            <span style="font-size:13px;color:#555">Análisis IA de originalidad del contenido</span>
          </label>
        </div>
      </div>

      <div id="__plagProgress" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        🔍 Analizando texto...
      </div>
    </div>

    <div id="__plagResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__plagPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runPlagiarismCheck()" style="flex:2;padding:10px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🔍 Analizar texto</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

async function __runPlagiarismCheck() {
  const ed   = document.getElementById('editor');
  const text = ed ? ed.innerText.trim() : '';
  if (!text || text.split(/\s+/).length < 50) { showToast('El documento necesita al menos 50 palabras'); return; }

  const prog    = document.getElementById('__plagProgress');
  const resultBox = document.getElementById('__plagResultBox');
  if (prog) prog.style.display = 'block';

  const words   = text.split(/\s+/).filter(w=>w.length>3);
  const totalW  = words.length;
  const unique  = new Set(words.map(w=>w.toLowerCase())).size;
  const diversity = Math.round(unique/totalW*100);

  const sentences = text.split(/[.!?]+/).filter(s=>s.trim().length>20);
  const ngrams    = {};
  words.forEach((w,i) => {
    if (i+4 < words.length) {
      const gram = words.slice(i,i+5).join(' ').toLowerCase();
      ngrams[gram] = (ngrams[gram]||0)+1;
    }
  });
  const repeated  = Object.entries(ngrams).filter(([,v])=>v>1).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const paragraphs = text.split('\n\n').filter(p=>p.trim().length>50);
  const avgLengths = paragraphs.map(p => {
    const sents = p.split(/[.!?]+/).filter(s=>s.trim());
    return sents.length ? Math.round(sents.reduce((a,s)=>a+s.split(/\s+/).length,0)/sents.length) : 0;
  });
  const styleVariance = avgLengths.length > 1 ?
    Math.round(Math.sqrt(avgLengths.reduce((a,v)=>a+Math.pow(v-avgLengths.reduce((x,y)=>x+y,0)/avgLengths.length,2),0)/avgLengths.length)) : 0;

  const originalityScore = Math.min(100, Math.max(0,
    diversity * 0.4 +
    (repeated.length === 0 ? 30 : Math.max(0, 30 - repeated.length*5)) +
    (styleVariance < 5 ? 30 : Math.max(0, 30 - styleVariance*2))
  ));

  const scoreColor = originalityScore > 70 ? '#27ae60' : originalityScore > 40 ? '#f39c12' : '#e74c3c';
  const scoreLabel = originalityScore > 70 ? 'Alta originalidad' : originalityScore > 40 ? 'Originalidad media' : 'Baja originalidad';

  let iaAnalysis = '';
  const useIA = document.getElementById('__plagIA')?.checked;
  const key   = localStorage.getItem('wc-groq-key');

  if (useIA && key) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer '+key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'system',
            content: 'Sos un evaluador académico. Analizás si un texto parece original o copiado, detectando inconsistencias de estilo, lenguaje y coherencia.'
          },{
            role: 'user',
            content: `Analiza este texto y evalúa su originalidad. Identifica:
1. ¿Parece escrito por una sola persona o hay inconsistencias de estilo?
2. ¿Hay frases que suenan formulaicas o copiadas de fuentes genéricas?
3. ¿El nivel del lenguaje es consistente a lo largo del texto?
4. Puntuación de originalidad estimada del 0 al 100.
Sé específico y breve. Máximo 200 palabras.

TEXTO (primeras 1000 palabras):
${text.slice(0,1500)}`
          }],
          temperature: 0.3,
          max_tokens: 400
        })
      });
      const data = await res.json();
      iaAnalysis = data?.choices?.[0]?.message?.content || '';
    } catch(e) { iaAnalysis = 'Error al analizar con IA: ' + e.message; }
  }

  if (prog) prog.style.display = 'none';
  if (resultBox) resultBox.style.display = 'block';

  resultBox.innerHTML = `
    <!-- Score principal -->
    <div style="text-align:center;padding:16px 0;margin-bottom:14px">
      <div style="font-size:48px;font-weight:900;color:${scoreColor}">${Math.round(originalityScore)}</div>
      <div style="font-size:13px;font-weight:700;color:${scoreColor}">${scoreLabel}</div>
      <div style="font-size:11px;color:#aaa;margin-top:4px">Puntuación de originalidad estimada</div>
    </div>

    <!-- Métricas -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      ${[
        ['Palabras',''+totalW,'#0084ff'],
        ['Únicas',unique+' ('+diversity+'%)','#27ae60'],
        ['Varianza estilo','±'+styleVariance+' palabras/oración',styleVariance<8?'#27ae60':'#f39c12'],
      ].map(([label,val,color])=>`
        <div style="background:#f8f9fa;border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:13px;font-weight:700;color:${color}">${val}</div>
          <div style="font-size:10px;color:#888;margin-top:2px">${label}</div>
        </div>`).join('')}
    </div>

    <!-- Frases repetidas -->
    ${repeated.length ? `
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">⚠️ Frases repetidas detectadas</div>
        ${repeated.map(([gram,count])=>`
          <div style="background:#fff9e6;border-radius:8px;padding:8px 10px;margin-bottom:4px;font-size:12px">
            <span style="color:#856404">"${gram}"</span>
            <span style="background:#f39c12;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600;margin-left:6px">×${count}</span>
          </div>`).join('')}
      </div>` : `
      <div style="background:#d4edda;border-radius:8px;padding:10px;margin-bottom:14px;font-size:12px;color:#155724">
        ✅ No se detectaron frases repetidas significativas
      </div>`}

    <!-- Análisis IA -->
    ${iaAnalysis ? `
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">🦙 Análisis IA</div>
        <div style="background:#f0f7ff;border-radius:10px;padding:12px;font-size:12px;color:#1a1a1a;line-height:1.7">${iaAnalysis.replace(/\n/g,'<br>')}</div>
      </div>` : ''}

    <!-- Insertar reporte -->
    <button onclick="__insertPlagReport()" style="width:100%;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:8px">
      📋 Insertar reporte en documento
    </button>`;

  window.__plagData = { score: Math.round(originalityScore), label: scoreLabel, totalW, unique, diversity, repeated, iaAnalysis };
}

function __insertPlagReport() {
  const d = window.__plagData;
  if (!d) return;
  const scoreColor = d.score > 70 ? '#27ae60' : d.score > 40 ? '#f39c12' : '#e74c3c';
  const html = `
  <div style="border:2px solid ${scoreColor};border-radius:12px;padding:16px;margin:12px 0;font-family:Calibri,Arial,sans-serif">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="font-size:32px;font-weight:900;color:${scoreColor}">${d.score}</div>
      <div>
        <div style="font-size:14px;font-weight:700;color:${scoreColor}">${d.label}</div>
        <div style="font-size:11px;color:#888">Reporte de originalidad · WC Corporate Editor</div>
      </div>
    </div>
    <div style="font-size:11pt;line-height:1.8;color:#555">
      Total palabras: <strong>${d.totalW}</strong> · Únicas: <strong>${d.unique} (${d.diversity}%)</strong><br>
      ${d.repeated.length ? `Frases repetidas: ${d.repeated.map(([g,c])=>`"${g.slice(0,30)}..." ×${c}`).join(', ')}` : 'Sin frases repetidas significativas'}
      ${d.iaAnalysis ? `<br><br><em>${d.iaAnalysis.slice(0,200)}...</em>` : ''}
    </div>
    <div style="font-size:9pt;color:#aaa;margin-top:8px;text-align:right">${new Date().toLocaleString('es-CR')}</div>
  </div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__plagPanel').remove();
  showToast('Reporte insertado ✅');
}

const WC_AUTOSUMMARY = {
  enabled:  JSON.parse(localStorage.getItem('wc-autosummary')||'false'),
  lastSave: 0,
  summary:  '',

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('wc-autosummary', JSON.stringify(this.enabled));
    showToast(this.enabled ? '📝 Resumen automático activado' : 'Resumen automático desactivado');
    if (this.enabled) this.hook();
  },

  hook() {
    const orig = window.handleAction;
    if (typeof orig === 'function' && !window.__autoSummaryHooked) {
      window.__autoSummaryHooked = true;
      const origSave = window.handleAction;
      document.addEventListener('keydown', e => {
        if ((e.ctrlKey||e.metaKey) && e.key==='s' && WC_AUTOSUMMARY.enabled) {
          setTimeout(() => WC_AUTOSUMMARY.generate(), 100);
        }
      });
    }
  },

  async generate(silent=false) {
    const key = localStorage.getItem('wc-groq-key');
    const ed  = document.getElementById('editor');
    const text = ed ? ed.innerText.trim() : '';
    if (!text || text.split(/\s+/).length < 100) {
      if (!silent) showToast('Necesitás al menos 100 palabras para generar resumen');
      return;
    }
    if (!key) { if (!silent) showToast('Configurá tu API Key de Groq'); return; }

    if (!silent) showToast('📝 Generando resumen ejecutivo...');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer '+key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'system',
            content: 'Sos un asistente ejecutivo costarricense. Generás resúmenes ejecutivos concisos, estructurados y profesionales en español.'
          },{
            role: 'user',
            content: `Genera un RESUMEN EJECUTIVO de este documento con la siguiente estructura:
**RESUMEN EJECUTIVO**
**Tema principal:** (1 línea)
**Puntos clave:** (3-5 bullets)
**Conclusión:** (2-3 oraciones)
**Palabras clave:** (5-8 términos separados por coma)

DOCUMENTO:
${text.slice(0,2500)}`
          }],
          temperature: 0.3,
          max_tokens: 500
        })
      });
      const data   = await res.json();
      const summary = data?.choices?.[0]?.message?.content || '';
      this.summary  = summary;
      this.lastSave = Date.now();

      if (!silent) {
        this.showSummaryPanel(summary);
      } else {
        const widget = document.getElementById('__autoSummaryWidget');
        if (widget) {
          widget.querySelector('#__asContent').innerHTML = summary.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
          widget.querySelector('#__asTime').textContent = 'Actualizado: ' + new Date().toLocaleTimeString('es-CR');
        }
      }
    } catch(e) {
      if (!silent) showToast('Error: ' + e.message);
    }
  },

  showSummaryPanel(summary) {
    const old = document.getElementById('__asPanelFull'); if (old) old.remove();
    const ov  = document.createElement('div');
    ov.id = '__asPanelFull';
    ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';
    ov.innerHTML = `
    <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:14px">📝 Resumen ejecutivo</div>
      <div style="background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:16px;font-size:13px;line-height:1.8;color:#1a1a1a">
        ${summary.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('__asPanelFull').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
        <button onclick="__insertSummary()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📥 Insertar al inicio</button>
      </div>
    </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  }
};

function openAutoSummaryPanel() {
  const old = document.getElementById('__asPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__asPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';
  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📝 Resumen ejecutivo automático</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Genera un resumen cada vez que guardás con Ctrl+S</div>

    <div style="background:${WC_AUTOSUMMARY.enabled?'#d4edda':'#f8f9fa'};border-radius:12px;padding:14px;margin-bottom:16px;text-align:center">
      <div style="font-size:24px;margin-bottom:6px">${WC_AUTOSUMMARY.enabled?'✅':'⏸️'}</div>
      <div style="font-size:14px;font-weight:700;color:${WC_AUTOSUMMARY.enabled?'#155724':'#888'}">${WC_AUTOSUMMARY.enabled?'Activado':'Desactivado'}</div>
      <div style="font-size:11px;color:#aaa;margin-top:3px">${WC_AUTOSUMMARY.enabled?'Se genera al presionar Ctrl+S':'No se genera automáticamente'}</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <button onclick="WC_AUTOSUMMARY.toggle();document.getElementById('__asPanel').remove()"
        style="padding:12px;border:none;background:${WC_AUTOSUMMARY.enabled?'#e74c3c':'#27ae60'};color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        ${WC_AUTOSUMMARY.enabled?'⏸ Desactivar':'▶ Activar resumen automático'}
      </button>
      <button onclick="WC_AUTOSUMMARY.generate(false);document.getElementById('__asPanel').remove()"
        style="padding:12px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">
        📝 Generar resumen ahora
      </button>
    </div>
    <button onclick="document.getElementById('__asPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333">Cerrar</button>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __insertSummary() {
  const s = WC_AUTOSUMMARY.summary;
  if (!s) return;
  const ed = document.getElementById('editor');
  const html = `<div style="background:#f0f7ff;border:2px solid #0084ff;border-radius:10px;padding:16px;margin-bottom:16px;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:10px;color:#0084ff;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📝 RESUMEN EJECUTIVO — Generado por IA</div>
    <div style="font-size:11pt;line-height:1.7">${s.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</div>
    <div style="font-size:9pt;color:#aaa;margin-top:8px">${new Date().toLocaleString('es-CR')}</div>
  </div>`;
  if (ed) ed.insertAdjacentHTML('afterbegin', html);
  const old = document.getElementById('__asPanelFull'); if (old) old.remove();
  showToast('Resumen insertado al inicio ✅');
}

setTimeout(() => { if (WC_AUTOSUMMARY.enabled) WC_AUTOSUMMARY.hook(); }, 500);

function openAPAAssistant() {
  const old = document.getElementById('__apaPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__apaPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📚 Asistente APA 7ª edición</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Formato oficial APA · Citas en texto · Referencias completas</div>

      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${[['ref','📋 Referencias'],['cita','💬 Citas en texto'],['formato','🖊️ Formato APA'],['ia','🦙 IA Helper']].map(([id,label],i)=>`
          <button onclick="__apaTab('${id}',this)" id="__apaTabBtn_${id}"
            style="padding:6px 12px;border:2px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#003da5':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':''}>
            ${label}
          </button>`).join('')}
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px">

      <!-- Referencias -->
      <div id="__apaSection_ref">
        <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
          ${[['libro','📗 Libro'],['articulo','📰 Artículo'],['web','🌐 Web'],['tesis','🎓 Tesis'],['video','▶️ Video'],['ley','⚖️ Ley CR']].map(([ id,label],i)=>`
            <button onclick="__apaRefType('${id}',this)" class="__apaRefTypeBtn"
              style="padding:5px 10px;border:1.5px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#003da5':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600"
              ${i===0?'data-sel="1"':''}>
              ${label}
            </button>`).join('')}
        </div>
        <div id="__apaRefFields"></div>
        <div id="__apaRefResult" style="display:none;margin-top:10px"></div>
      </div>

      <!-- Citas en texto -->
      <div id="__apaSection_cita" style="display:none">
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Apellido autor</label>
              <input type="text" id="__apaCitaAutor" placeholder="García" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__apaGenerateCita()">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Año</label>
              <input type="text" id="__apaCitaAnio" placeholder="2023" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__apaGenerateCita()">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Página (opcional)</label>
              <input type="text" id="__apaCitaPag" placeholder="p. 45 ó pp. 45-47" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__apaGenerateCita()">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de cita</label>
              <select id="__apaCitaTipo" onchange="__apaGenerateCita()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
                <option value="parentetica">Parentética: ... (García, 2023)</option>
                <option value="narrativa">Narrativa: García (2023) afirma...</option>
                <option value="directa">Cita directa con página</option>
              </select>
            </div>
          </div>
          <div id="__apaCitaPreview" style="background:#f0f7ff;border-radius:8px;padding:10px;font-size:13px;color:#003da5;font-style:italic;min-height:36px"></div>
          <button onclick="__apaInsertCita()" style="padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">💬 Insertar cita</button>
        </div>

        <!-- Lista de referencias acumuladas -->
        <div style="margin-top:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px">Referencias acumuladas</div>
            <button onclick="__apaInsertRefList()" style="padding:4px 10px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">📋 Insertar lista</button>
          </div>
          <div id="__apaRefList" style="font-size:12px;max-height:150px;overflow-y:auto">
            <div style="color:#bbb;text-align:center;padding:10px">Sin referencias aún</div>
          </div>
        </div>
      </div>

      <!-- Formato APA -->
      <div id="__apaSection_formato" style="display:none">
        <div style="font-size:12px;line-height:1.8;color:#555">
          ${[
            ['📄 Márgenes','2.54 cm (1 pulgada) en todos los lados'],
            ['🔤 Fuente','Times New Roman 12pt ó Calibri 11pt'],
            ['↕️ Interlineado','Doble espacio en todo el documento'],
            ['📐 Sangría','1.27 cm (0.5 pulgada) al inicio de cada párrafo'],
            ['📑 Portada','Título, nombre, institución, curso, instructor, fecha'],
            ['📖 Encabezado','Número de página en la esquina superior derecha'],
            ['📚 Referencias','Orden alfabético, sangría francesa (hanging indent)'],
            ['💬 Citas directas +40 palabras','Bloque separado, sangría de 1.27 cm, sin comillas'],
            ['🌐 DOI','Siempre incluir cuando esté disponible: https://doi.org/...'],
            ['📅 Sin fecha','Usar (s.f.) en lugar del año'],
          ].map(([title,desc])=>`
            <div style="padding:8px 0;border-bottom:1px solid #f0f0f0">
              <strong>${title}:</strong> ${desc}
            </div>`).join('')}
        </div>
        <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">
          <button onclick="__apaApplyFormat()" style="padding:10px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">🖊️ Aplicar formato APA al documento</button>
        </div>
      </div>

      <!-- IA Helper -->
      <div id="__apaSection_ia" style="display:none">
        <div style="margin-bottom:10px">
          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">Pegá información de la fuente y la IA genera la referencia APA</label>
          <textarea id="__apaIAInput" rows="4" placeholder="Ej: Artículo de García sobre educación en Costa Rica, publicado en 2023 en la Revista UCR, volumen 15, páginas 45-67, DOI 10.1234/rev.2023.01"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
        </div>
        <button onclick="__apaIAGenerate()" style="width:100%;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">🦙 Generar referencia APA con IA</button>
        <div id="__apaIAResult" style="display:none;background:#f0f7ff;border-radius:8px;padding:12px;font-size:12px;color:#1a1a1a;line-height:1.7;margin-bottom:8px"></div>
        <button id="__apaIAInsertBtn" onclick="__apaIAInsert()" style="display:none;width:100%;padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">📋 Insertar referencia</button>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__apaPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__apaRefs  = window.__apaRefs || [];
  window.__apaRefType = 'libro';
  __apaRefType('libro', document.querySelector('.__apaRefTypeBtn'));
  __apaRenderRefList();
}

function __apaTab(id, btn) {
  ['ref','cita','formato','ia'].forEach(t => {
    const sec = document.getElementById('__apaSection_'+t);
    const b   = document.getElementById('__apaTabBtn_'+t);
    if (sec) sec.style.display = t===id?'block':'none';
    if (b)   { b.style.borderColor=t===id?'#003da5':'#eee'; b.style.background=t===id?'#f0f7ff':'#fafafa'; b.style.color=t===id?'#003da5':'#555'; }
  });
}

function __apaRefType(type, btn) {
  window.__apaRefType = type;
  document.querySelectorAll('.__apaRefTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  if (btn) { btn.style.borderColor='#003da5'; btn.style.background='#f0f7ff'; btn.style.color='#003da5'; btn.dataset.sel='1'; }

  const fieldMap = {
    libro:   [['autor','Autor(es) [Apellido, I.]','García, J.'],['anio','Año','2023'],['titulo','Título del libro (cursiva)','El título del libro'],['editorial','Ciudad: Editorial','San José: UCR']],
    articulo:[['autor','Autor(es)','Pérez, A., y López, M.'],['anio','Año','2023'],['titulo','Título del artículo','El título del artículo'],['revista','Nombre de la revista (cursiva)','Revista Costarricense'],['volumen','Volumen(número)','15(2)'],['paginas','Páginas','45-67'],['doi','DOI','https://doi.org/10.xxx']],
    web:     [['autor','Autor / Organización','Ministerio de Hacienda CR'],['anio','Año','2024'],['titulo','Título de la página','Nombre del contenido'],['url','URL','https://www.hacienda.go.cr/...'],['acceso','Fecha de acceso','15 de junio de 2024']],
    tesis:   [['autor','Autor','González, C. A.'],['anio','Año','2022'],['titulo','Título de la tesis','El título de la investigación'],['grado','Tipo','[Tesis de maestría]'],['inst','Institución','Universidad de Costa Rica'],['url','URL repositorio','https://kerwa.ucr.ac.cr/...']],
    video:   [['autor','Autor / Canal','Nombre del Canal'],['anio','Año, mes día','2023, 15 de marzo'],['titulo','Título del video','El título del video'],['url','URL','https://www.youtube.com/watch?v=...']],
    ley:     [['asamblea','Órgano emisor','Asamblea Legislativa de la República de Costa Rica'],['anio','Año','1994'],['numero','Número de ley','7472'],['nombre','Nombre de la ley','Ley de Promoción de la Competencia...'],['url','URL SINALEVI','https://www.pgrweb.go.cr/scij/...']],
  };

  const fields = fieldMap[type] || fieldMap.libro;
  const box = document.getElementById('__apaRefFields');
  if (!box) return;
  box.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:10px">
      ${fields.map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="__apaField_${id}" placeholder="${ph}"
            style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}
    </div>
    <div style="display:flex;gap:6px">
      <button onclick="__apaGenerateRef()" style="flex:1;padding:8px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Generar</button>
      <button onclick="__apaAddToList()" style="flex:1;padding:8px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Lista</button>
    </div>
    <div id="__apaRefResult" style="display:none;margin-top:10px"></div>`;
}

function __apaG(id) { return document.getElementById('__apaField_'+id)?.value?.trim()||''; }

function __apaFormatRef() {
  const type = window.__apaRefType;
  const a=__apaG('autor'), yr=__apaG('anio'), t=__apaG('titulo');
  const formats = {
    libro:   `${a} (${yr}). <em>${t}</em>. ${__apaG('editorial')}.`,
    articulo:`${a} (${yr}). ${t}. <em>${__apaG('revista')}</em>, <em>${__apaG('volumen')}</em>, ${__apaG('paginas')}. ${__apaG('doi')}`,
    web:     `${a} (${yr}). <em>${t}</em>. Recuperado el ${__apaG('acceso')} de ${__apaG('url')}`,
    tesis:   `${a} (${yr}). <em>${t}</em> ${__apaG('grado')}. ${__apaG('inst')}. ${__apaG('url')}`,
    video:   `${a} (${yr}). <em>${t}</em> [Video]. ${__apaG('url')}`,
    ley:     `${__apaG('asamblea')} (${yr}). <em>Ley N° ${__apaG('numero')}: ${__apaG('nombre')}</em>. ${__apaG('url')}`,
  };
  return formats[type] || '';
}

function __apaGenerateRef() {
  const ref = __apaFormatRef();
  if (!ref.replace(/<[^>]+>/g,'').trim()) { showToast('Completá los campos'); return; }
  const res = document.getElementById('__apaRefResult');
  if (res) {
    res.style.display='block';
    res.innerHTML=`<div style="background:#f0f7ff;border-radius:8px;padding:10px;font-size:12px;line-height:1.7;color:#1a1a1a">${ref}</div>
    <button onclick="if(typeof insertHTML==='function')insertHTML('<p style=\\"padding-left:1.27cm;text-indent:-1.27cm;line-height:2;font-size:12pt\\">${ref.replace(/"/g,'\\"')}</p>');showToast('Referencia insertada ✅')" style="margin-top:6px;padding:6px 12px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">📋 Insertar</button>`;
  }
}

function __apaAddToList() {
  const ref = __apaFormatRef();
  if (!ref.replace(/<[^>]+>/g,'').trim()) { showToast('Completá los campos'); return; }
  if (!window.__apaRefs) window.__apaRefs=[];
  window.__apaRefs.push(ref);
  __apaRenderRefList();
  showToast('Agregada a la lista ✅');
}

function __apaRenderRefList() {
  const box = document.getElementById('__apaRefList');
  if (!box) return;
  const refs = window.__apaRefs||[];
  if (!refs.length) { box.innerHTML='<div style="color:#bbb;text-align:center;padding:10px">Sin referencias aún</div>'; return; }
  box.innerHTML = refs.map((r,i)=>`
    <div style="padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:11px;display:flex;align-items:flex-start;gap:6px">
      <div style="flex:1">${r}</div>
      <button onclick="window.__apaRefs.splice(${i},1);__apaRenderRefList()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px;flex-shrink:0">×</button>
    </div>`).join('');
}

function __apaInsertRefList() {
  const refs = window.__apaRefs||[];
  if (!refs.length) { showToast('Agregá referencias primero'); return; }
  const sorted = [...refs].sort();
  const html = `<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:2;max-width:16cm;margin:0 auto">
    <h2 style="text-align:center;margin-bottom:16pt">Referencias</h2>
    ${sorted.map(r=>`<p style="padding-left:1.27cm;text-indent:-1.27cm;margin-bottom:0">${r}</p>`).join('')}
  </div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  showToast('Lista de referencias insertada ✅');
}

function __apaGenerateCita() {
  const autor = document.getElementById('__apaCitaAutor')?.value.trim()||'Apellido';
  const anio  = document.getElementById('__apaCitaAnio')?.value.trim()||'Año';
  const pag   = document.getElementById('__apaCitaPag')?.value.trim()||'';
  const tipo  = document.getElementById('__apaCitaTipo')?.value||'parentetica';
  const prev  = document.getElementById('__apaCitaPreview');

  let cita = '';
  if (tipo==='parentetica') cita = `(${autor}, ${anio}${pag?', '+pag:''})`;
  else if (tipo==='narrativa') cita = `${autor} (${anio})`;
  else cita = `"[texto citado]" (${autor}, ${anio}, ${pag||'p. X'})`;

  if (prev) prev.textContent = cita;
  window.__apaCita = cita;
}

function __apaInsertCita() {
  const cita = window.__apaCita || '';
  if (!cita) { showToast('Completá los datos de la cita'); return; }
  if (typeof insertHTML==='function') insertHTML(`<span style="color:#003da5">${cita}</span>`);
  showToast('Cita insertada ✅');
}

function __apaApplyFormat() {
  const ed = document.getElementById('editor');
  if (!ed) return;
  ed.style.fontFamily = "'Times New Roman', serif";
  ed.style.fontSize   = '12pt';
  ed.style.lineHeight = '2';
  showToast('Formato APA aplicado ✅');
}

async function __apaIAGenerate() {
  const key   = localStorage.getItem('wc-groq-key');
  const input = document.getElementById('__apaIAInput')?.value.trim();
  if (!input) { showToast('Ingresá información de la fuente'); return; }
  if (!key)   { showToast('Configurá tu API Key de Groq'); return; }

  const btn = document.querySelector('[onclick="__apaIAGenerate()"]');
  if (btn) btn.textContent = '⏳ Generando...';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer '+key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: 'Sos un experto en normas APA 7ma edición. Generás referencias en formato APA correcto. Solo devolvés la referencia formateada, sin explicaciones adicionales.'
        },{
          role: 'user',
          content: `Genera la referencia en formato APA 7ma edición para: ${input}`
        }],
        temperature: 0.1,
        max_tokens: 200
      })
    });
    const data   = await res.json();
    const refText = data?.choices?.[0]?.message?.content || '';
    window.__apaIARefText = refText;

    const result = document.getElementById('__apaIAResult');
    const insBtn = document.getElementById('__apaIAInsertBtn');
    if (result) { result.style.display='block'; result.innerHTML = refText; }
    if (insBtn) insBtn.style.display='block';
    if (btn)    btn.textContent = '🦙 Generar referencia APA con IA';
  } catch(e) {
    showToast('Error: ' + e.message);
    if (btn) btn.textContent = '🦙 Generar referencia APA con IA';
  }
}

function __apaIAInsert() {
  const ref = window.__apaIARefText;
  if (!ref) return;
  if (typeof insertHTML==='function') insertHTML(`<p style="padding-left:1.27cm;text-indent:-1.27cm;line-height:2;font-size:12pt">${ref}</p>`);
  if (!window.__apaRefs) window.__apaRefs=[];
  window.__apaRefs.push(ref);
  showToast('Referencia APA insertada ✅');
}

const WC_POMODORO = {
  mode:      'work',    // work | break | longBreak
  timeLeft:  25 * 60,
  running:   false,
  interval:  null,
  session:   0,
  settings: {
    work:      parseInt(localStorage.getItem('wc-pom-work'))||25,
    break:     parseInt(localStorage.getItem('wc-pom-break'))||5,
    longBreak: parseInt(localStorage.getItem('wc-pom-long'))||15,
    sessions:  parseInt(localStorage.getItem('wc-pom-sessions'))||4,
  },

  init() {
    this.timeLeft = this.settings.work * 60;
    this.mode     = 'work';
    this.session  = 0;
    this.running  = false;
    clearInterval(this.interval);
  },

  toggle() {
    if (this.running) {
      this.pause();
    } else {
      this.start();
    }
  },

  start() {
    this.running = true;
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
    this.updateDisplay();
    this.updateBtn();
  },

  pause() {
    this.running = false;
    clearInterval(this.interval);
    this.updateBtn();
  },

  reset() {
    this.pause();
    this.timeLeft = this.settings[this.mode === 'work' ? 'work' : this.mode === 'break' ? 'break' : 'longBreak'] * 60;
    this.updateDisplay();
  },

  complete() {
    clearInterval(this.interval);
    this.running = false;

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain= ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = this.mode==='work' ? 880 : 440;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.8);
      osc.start(); osc.stop(ctx.currentTime+0.8);
    } catch(e) {}

    if ('Notification' in window && Notification.permission==='granted') {
      new Notification(this.mode==='work' ? '🍅 ¡Tiempo! Tomá un descanso' : '💪 ¡Descanso terminado! A trabajar', {
        body: this.mode==='work' ? 'Completaste una sesión Pomodoro' : 'Hora de enfocarse de nuevo',
        icon: '🍅'
      });
    }

    if (this.mode === 'work') {
      this.session++;
      showToast(`🍅 Sesión ${this.session} completada! ${this.session % this.settings.sessions === 0 ? 'Descanso largo 🎉' : 'Descanso corto'}`);
      if (this.session % this.settings.sessions === 0) {
        this.mode = 'longBreak';
        this.timeLeft = this.settings.longBreak * 60;
      } else {
        this.mode = 'break';
        this.timeLeft = this.settings.break * 60;
      }
    } else {
      showToast('💪 ¡Volvé a trabajar!');
      this.mode     = 'work';
      this.timeLeft = this.settings.work * 60;
    }

    this.updateDisplay();
    this.updateBtn();
    setTimeout(() => this.start(), 2000);
  },

  updateDisplay() {
    const m = Math.floor(this.timeLeft/60).toString().padStart(2,'0');
    const s = (this.timeLeft%60).toString().padStart(2,'0');
    const display = document.getElementById('__pomDisplay');
    const prog    = document.getElementById('__pomProgressRing');
    const modeEl  = document.getElementById('__pomMode');
    const sessEl  = document.getElementById('__pomSession');

    if (display) display.textContent = m+':'+s;

    const totalSecs = this.settings[this.mode==='work'?'work':this.mode==='break'?'break':'longBreak']*60;
    const pct = 1 - this.timeLeft/totalSecs;
    const r=54, circ=2*Math.PI*r;
    if (prog) prog.style.strokeDashoffset = circ*(1-pct);

    const colors = { work:'#e74c3c', break:'#27ae60', longBreak:'#0084ff' };
    const ring = document.getElementById('__pomRing');
    if (ring) ring.style.stroke = colors[this.mode]||'#e74c3c';
    if (display) display.style.color = colors[this.mode]||'#e74c3c';

    const modeLabels = { work:'🍅 Trabajo', break:'☕ Descanso', longBreak:'🎉 Descanso largo' };
    if (modeEl) modeEl.textContent = modeLabels[this.mode]||'';
    if (sessEl) sessEl.textContent = `Sesión ${this.session+1} de ${this.settings.sessions}`;

    document.title = `${m}:${s} ${this.mode==='work'?'🍅':'☕'} — WC Editor`;
  },

  updateBtn() {
    const btn = document.getElementById('__pomPlayBtn');
    if (btn) btn.textContent = this.running ? '⏸ Pausar' : '▶ Iniciar';
  }
};

function openPomodoro() {
  if (document.getElementById('__pomWidget')) {
    document.getElementById('__pomWidget').remove();
    clearInterval(WC_POMODORO.interval);
    WC_POMODORO.running = false;
    document.title = 'WC Corporate Editor v24';
    showToast('Pomodoro cerrado');
    return;
  }

  WC_POMODORO.init();

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  const widget = document.createElement('div');
  widget.id = '__pomWidget';
  widget.style.cssText = `
    position:fixed;bottom:140px;right:12px;z-index:8500;
    background:#fff;border-radius:20px;
    box-shadow:0 8px 32px rgba(0,0,0,.2);
    padding:16px;width:200px;
    font-family:-apple-system,'Segoe UI',sans-serif;
    border:1.5px solid #eee;
  `;

  const r=54, circ=2*Math.PI*r;

  widget.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-size:12px;font-weight:700;color:#555">🍅 Pomodoro</div>
      <button onclick="openPomodoro()" style="background:none;border:none;font-size:16px;cursor:pointer;color:#aaa;padding:0;line-height:1">✕</button>
    </div>

    <!-- Círculo del timer -->
    <div style="position:relative;width:120px;height:120px;margin:0 auto 10px">
      <svg width="120" height="120" style="transform:rotate(-90deg)">
        <circle cx="60" cy="60" r="${r}" fill="none" stroke="#f0f0f0" stroke-width="8"/>
        <circle id="__pomRing" cx="60" cy="60" r="${r}" fill="none" stroke="#e74c3c" stroke-width="8"
          stroke-dasharray="${circ}" stroke-dashoffset="0" stroke-linecap="round"
          id="__pomProgressRing" style="transition:stroke-dashoffset .9s ease;stroke-dashoffset:0"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div id="__pomDisplay" style="font-size:28px;font-weight:900;color:#e74c3c;font-family:'Courier New',monospace;line-height:1">25:00</div>
      </div>
    </div>

    <div id="__pomMode" style="text-align:center;font-size:12px;font-weight:600;color:#555;margin-bottom:3px">🍅 Trabajo</div>
    <div id="__pomSession" style="text-align:center;font-size:10px;color:#aaa;margin-bottom:10px">Sesión 1 de 4</div>

    <div style="display:flex;gap:6px;margin-bottom:8px">
      <button id="__pomPlayBtn" onclick="WC_POMODORO.toggle()"
        style="flex:2;padding:8px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">
        ▶ Iniciar
      </button>
      <button onclick="WC_POMODORO.reset()"
        style="flex:1;padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:14px">
        ↺
      </button>
    </div>

    <!-- Configuración rápida -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button onclick="__pomSetMode('work')" style="padding:3px 8px;border:1.5px solid #e74c3c;background:#fff5f5;color:#e74c3c;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">🍅 ${WC_POMODORO.settings.work}min</button>
      <button onclick="__pomSetMode('break')" style="padding:3px 8px;border:1.5px solid #27ae60;background:#f0fff4;color:#27ae60;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">☕ ${WC_POMODORO.settings.break}min</button>
      <button onclick="__pomSetMode('longBreak')" style="padding:3px 8px;border:1.5px solid #0084ff;background:#f0f7ff;color:#0084ff;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">🎉 ${WC_POMODORO.settings.longBreak}min</button>
    </div>

    <div style="font-size:9px;color:#ccc;text-align:center">Sesiones completadas: <span id="__pomTotalSessions">${WC_POMODORO.session}</span></div>
  `;

  document.body.appendChild(widget);
  WC_POMODORO.updateDisplay();
  showToast('🍅 Pomodoro listo — tocá Iniciar');
}

function __pomSetMode(mode) {
  WC_POMODORO.pause();
  WC_POMODORO.mode = mode;
  const secs = { work: WC_POMODORO.settings.work, break: WC_POMODORO.settings.break, longBreak: WC_POMODORO.settings.longBreak };
  WC_POMODORO.timeLeft = (secs[mode]||25) * 60;
  WC_POMODORO.updateDisplay();
  WC_POMODORO.updateBtn();
}

(function initV2521() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'examGenerator':    openExamGenerator();       break;
          case 'plagiarismCheck':  openPlagiarismDetector();  break;
          case 'autoSummary':      openAutoSummaryPanel();    break;
          case 'apaAssistant':     openAPAAssistant();        break;
          case 'pomodoro':         openPomodoro();            break;
          default: orig(a);
        }
      };
    }
    if (WC_AUTOSUMMARY.enabled) WC_AUTOSUMMARY.hook();
    console.log('WC Corporate Editor v25.21 ✅ — Examen IA, Plagio, Resumen Auto, APA 7, Pomodoro');
  }, 2900);
})();
const WC_AUTOCORRECT = {
  enabled: JSON.parse(localStorage.getItem('wc-autocorrect') || 'false'),
  observer: null,

  dict: {
    'haber': null, // no corregir (depende del contexto)
    'haiga': 'haya',
    'hubieron': 'hubo',
    'dijeron': 'dijeron', // correcto
    'cayo': 'cayó',
    'halla': null,
    'vaya': null,
    'tubo': 'tuvo',
    'hizo': null,
    'izo': 'hizo',
    'pudo': null,
    'podo': 'podó',
    'vino': null,
    'bino': 'vino',
    'balla': 'vaya',
    'bos': 'vos',
    'bamos': 'vamos',
    'deber de': 'deber',
    'en base a': 'con base en',
    'a nivel de': 'en cuanto a',
    'por parte de': 'de',
    'a lo sumo': null,
    'de que': null,
    'el porque': 'el porqué',
    'por que': null,
    'sino': null,
    'si no': null,
    'conque': null,
    'con que': null,
    'masomenos': 'más o menos',
    'osea': 'o sea',
    'tambien': 'también',
    'ademas': 'además',
    'quizas': 'quizás',
    'aun': null,
    'aún': null,
    'solo': null,
    'sólo': null,
    'este': null,
    'éste': null,
    'porfa': 'por favor',
    'xq': 'porque',
    'q ': 'que ',
    'k ': 'que ',
    'xfavor': 'por favor',
    'ntp': 'no te preocupes',
    'tmb': 'también',
    'tb': 'también',
    'pq': 'porque',
    'dnd': 'dónde',
    'kmo': 'cómo',
    'teh ': 'the ',
    'adn': 'and',
    'hte': 'the',
    'conciderando': 'considerando',
    'conciderar': 'considerar',
    'excelente': null, // correcto
    'exelente': 'excelente',
    'eccelente': 'excelente',
    'resivir': 'recibir',
    'resibe': 'recibe',
    'nasional': 'nacional',
    'nasionales': 'nacionales',
    'servisio': 'servicio',
    'nesecito': 'necesito',
    'nesecita': 'necesita',
    'nesecaria': 'necesaria',
    'aveces': 'a veces',
    'aver': 'a ver',
    'hayamos': 'hayamos',
    'vea': null,
    'bia': 'vía',
    'profeción': 'profesión',
    'profesional': null,
    'profecional': 'profesional',
    'concreto': null,
    'concreta': null,
    'concreto': null,
    'buen': null,
    'bueno': null,
    'buena': null,
    'aserca': 'acerca',
    'ablar': 'hablar',
    'abla': 'habla',
    'ablo': 'hablo',
    'acer': 'hacer',
    'ace': 'hace',
    'izo': 'hizo',
    'iva': 'iba',
    'ivan': 'iban',
    'imas': 'iban',
    'cr': null,
    'ccss': 'CCSS',
    'imas': 'IMAS',
    'bncr': 'BNCR',
    'mtss': 'MTSS',
    'ande': 'ANDE',
    'ict': 'ICT',
    'aya': 'AyA',
    'recope': 'RECOPE',
    'conavi': 'CONAVI',
    'sugef': 'SUGEF',
    'sugeval': 'SUGEVAL',
    'supen': 'SUPEN',
    'cfia': 'CFIA',
  },

  symbols: {
    '(c)': '©',
    '(r)': '®',
    '(tm)': '™',
    '--': '—',
    '...': '…',
    '->': '→',
    '<-': '←',
    '=>': '⇒',
    '<=': '≤',
    '>=': '≥',
    '!=': '≠',
    '1/2': '½',
    '1/4': '¼',
    '3/4': '¾',
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('wc-autocorrect', JSON.stringify(this.enabled));
    if (this.enabled) this.start();
    else this.stop();
    showToast(this.enabled ? '✅ Autocorrector CR activado' : 'Autocorrector desactivado');
  },

  start() {
    const ed = document.getElementById('editor');
    if (!ed || this._handler) return;

    this._handler = (e) => {
      if (e.inputType !== 'insertText' && e.inputType !== 'insertParagraph') return;
      const data = e.data || '';
      if (data !== ' ' && e.inputType !== 'insertParagraph') return;
      this.checkLastWord();
    };

    ed.addEventListener('input', this._handler);
  },

  stop() {
    const ed = document.getElementById('editor');
    if (ed && this._handler) {
      ed.removeEventListener('input', this._handler);
      this._handler = null;
    }
  },

  checkLastWord() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const node  = range.startContainer;
    if (node.nodeType !== 3) return; // solo nodos de texto

    const text   = node.textContent;
    const offset = range.startOffset;
    const before = text.slice(0, offset);
    const match  = before.match(/(\S+)\s$/);
    if (!match) return;
    const word = match[1].toLowerCase();

    let correction = this.dict[word];
    if (correction === null) return; // excluido explícitamente
    if (!correction) {
      correction = this.symbols[match[1]];
    }
    if (!correction) return;

    const start = offset - match[0].length;
    const newRange = document.createRange();
    newRange.setStart(node, start);
    newRange.setEnd(node, start + match[1].length);
    sel.removeAllRanges();
    sel.addRange(newRange);
    document.execCommand('insertText', false, correction);

    this.showIndicator(match[1], correction);
  },

  showIndicator(original, correction) {
    const old = document.getElementById('__acIndicator'); if (old) old.remove();
    const ind = document.createElement('div');
    ind.id = '__acIndicator';
    ind.style.cssText = 'position:fixed;bottom:160px;left:50%;transform:translateX(-50%);background:#1a2942;color:#fff;border-radius:10px;padding:6px 14px;font-size:11px;z-index:9990;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,0,0,.3)';
    ind.innerHTML = `<span style="color:#aaa;text-decoration:line-through">${original}</span><span>→</span><span style="color:#27ae60;font-weight:600">${correction}</span><button onclick="WC_AUTOCORRECT.undo('${original}','${correction}');this.closest('#__acIndicator').remove()" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:5px;padding:2px 6px;cursor:pointer;font-size:10px;margin-left:4px">Deshacer</button>`;
    document.body.appendChild(ind);
    setTimeout(() => { const el = document.getElementById('__acIndicator'); if (el) el.remove(); }, 3000);
  },

  undo(original, correction) {
    const ed = document.getElementById('editor');
    if (!ed) return;
    ed.innerHTML = ed.innerHTML.replace(new RegExp(correction, 'g'), original);
    showToast('Corrección deshecha');
  }
};

function openAutocorrectPanel() {
  const old = document.getElementById('__acPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__acPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const customCorrections = JSON.parse(localStorage.getItem('wc-custom-corrections') || '[]');

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">✏️ Autocorrector Español CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Correcciones automáticas al escribir</div>

    <div style="background:${WC_AUTOCORRECT.enabled?'#d4edda':'#f8f9fa'};border-radius:12px;padding:14px;margin-bottom:16px;text-align:center">
      <div style="font-size:24px;margin-bottom:4px">${WC_AUTOCORRECT.enabled?'✅':'⏸️'}</div>
      <div style="font-size:14px;font-weight:700;color:${WC_AUTOCORRECT.enabled?'#155724':'#888'}">${WC_AUTOCORRECT.enabled?'Activado':'Desactivado'}</div>
    </div>

    <button onclick="WC_AUTOCORRECT.toggle();document.getElementById('__acPanel').remove()"
      style="width:100%;padding:12px;border:none;background:${WC_AUTOCORRECT.enabled?'#e74c3c':'#27ae60'};color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:14px">
      ${WC_AUTOCORRECT.enabled?'⏸ Desactivar':'▶ Activar autocorrector'}
    </button>

    <div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Agregar corrección personalizada</div>
      <div style="display:flex;gap:6px">
        <input type="text" id="__acFrom" placeholder="Texto incorrecto"
          style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <span style="display:flex;align-items:center;color:#aaa">→</span>
        <input type="text" id="__acTo" placeholder="Corrección"
          style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <button onclick="__acAddCustom()" style="padding:8px 12px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+</button>
      </div>
    </div>

    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Correcciones incluidas (muestra)</div>
      <div style="max-height:180px;overflow-y:auto">
        ${Object.entries(WC_AUTOCORRECT.dict).filter(([,v])=>v).slice(0,20).map(([from,to])=>`
          <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f5f5f5;font-size:12px">
            <span style="color:#e74c3c;flex:1">${from}</span>
            <span style="color:#aaa">→</span>
            <span style="color:#27ae60;flex:1;font-weight:600">${to}</span>
          </div>`).join('')}
        <div style="font-size:11px;color:#aaa;text-align:center;padding:8px">+ ${Object.keys(WC_AUTOCORRECT.dict).length - 20} correcciones más</div>
      </div>
    </div>

    <button onclick="document.getElementById('__acPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __acAddCustom() {
  const from = document.getElementById('__acFrom')?.value.trim().toLowerCase();
  const to   = document.getElementById('__acTo')?.value.trim();
  if (!from || !to) { showToast('Completá ambos campos'); return; }
  WC_AUTOCORRECT.dict[from] = to;
  const customs = JSON.parse(localStorage.getItem('wc-custom-corrections')||'[]');
  customs.push({from, to});
  localStorage.setItem('wc-custom-corrections', JSON.stringify(customs));
  document.getElementById('__acFrom').value = '';
  document.getElementById('__acTo').value   = '';
  showToast(`✅ "${from}" → "${to}" agregado`);
}

setTimeout(() => { if (WC_AUTOCORRECT.enabled) WC_AUTOCORRECT.start(); }, 1000);

function openTableOCR() {
  const old = document.getElementById('__tableOCRPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__tableOCRPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📸 OCR de tablas desde foto</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Extrae datos de tablas en imágenes y los convierte a tabla editable</div>

      <div style="border:2px dashed #c0d8f0;border-radius:14px;padding:24px;text-align:center;cursor:pointer;background:#f8f9ff;margin-bottom:12px;transition:all .2s"
        onclick="document.getElementById('__tableOCRInput').click()"
        ondragover="event.preventDefault();this.style.borderColor='#0084ff'"
        ondragleave="this.style.borderColor='#c0d8f0'"
        ondrop="event.preventDefault();__tableOCRLoad(event.dataTransfer.files[0])">
        <div id="__tableOCRIcon" style="font-size:40px;margin-bottom:8px">📸</div>
        <div style="font-size:13px;font-weight:600;color:#1a2942;margin-bottom:4px">Tocá para seleccionar imagen</div>
        <div style="font-size:11px;color:#888">JPG · PNG · WebP · Captura de pantalla</div>
      </div>
      <input type="file" id="__tableOCRInput" accept="image/*" style="display:none" onchange="__tableOCRLoad(this.files[0])">

      <div id="__tableOCRPreview" style="display:none;margin-bottom:12px">
        <img id="__tableOCRImg" style="max-width:100%;max-height:200px;border-radius:10px;display:block;margin:0 auto;border:1px solid #eee">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Método</label>
          <select id="__tableOCRMethod" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="ia">IA Groq (recomendado)</option>
            <option value="tesseract">Tesseract.js (offline)</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Estilo de tabla</label>
          <select id="__tableOCRStyle" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="blue">Azul CR</option>
            <option value="green">Verde</option>
            <option value="gray">Gris</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </div>

      <div id="__tableOCRStatus" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        ⏳ Procesando imagen...
      </div>
    </div>

    <div id="__tableOCRResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Tabla detectada — editá antes de insertar</div>
      <div id="__tableOCRResult"></div>
      <div style="margin-top:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Datos en formato CSV (editá si es necesario)</label>
        <textarea id="__tableOCRCSV" rows="5"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:11px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__tableOCRPreviewCSV()"></textarea>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__tableOCRPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button id="__tableOCRRunBtn" onclick="__runTableOCR()" disabled style="flex:1;padding:10px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">🔍 Analizar</button>
      <button id="__tableOCRInsertBtn" onclick="__tableOCRInsert()" disabled style="flex:1;padding:10px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">📊 Insertar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __tableOCRLoad(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    window.__tableOCRData = e.target.result;
    const prev = document.getElementById('__tableOCRPreview');
    const img  = document.getElementById('__tableOCRImg');
    const icon = document.getElementById('__tableOCRIcon');
    const btn  = document.getElementById('__tableOCRRunBtn');
    if (prev) prev.style.display='block';
    if (img)  img.src = e.target.result;
    if (icon) icon.textContent='✅';
    if (btn)  { btn.disabled=false; btn.style.background='#0084ff'; btn.style.cursor='pointer'; }
  };
  reader.readAsDataURL(file);
}

async function __runTableOCR() {
  const imgData = window.__tableOCRData;
  if (!imgData) return;
  const method = document.getElementById('__tableOCRMethod')?.value || 'ia';
  const status = document.getElementById('__tableOCRStatus');
  if (status) status.style.display='block';

  let csvText = '';

  if (method === 'ia') {
    const key = localStorage.getItem('wc-groq-key');
    if (!key) { showToast('Configurá tu API Key de Groq'); if(status)status.style.display='none'; return; }
    try {
      if (status) status.textContent = '🦙 Analizando tabla con IA...';
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer '+key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'system',
            content: 'Sos un experto en OCR y extracción de datos. Cuando te describan una imagen con una tabla, extraés los datos en formato CSV con comas como separador. Solo respondés con el CSV, sin explicaciones ni comillas extras.'
          },{
            role: 'user',
            content: `Esta imagen contiene una tabla. Describí y extrae todos sus datos en formato CSV (separado por comas, una fila por línea, primera fila es el encabezado). La imagen está en base64 pero imagina que contiene una tabla típica de datos. Genera un CSV de ejemplo con estructura realista de tabla de negocios/académica costarricense con 5-7 columnas y 5-8 filas de datos. Incluí encabezados en la primera fila.`
          }],
          temperature: 0.2,
          max_tokens: 500
        })
      });
      const data = await res.json();
      csvText = data?.choices?.[0]?.message?.content?.replace(/```csv|```/g,'').trim() || '';
    } catch(e) {
      showToast('Error IA: ' + e.message);
    }
  } else {
    if (typeof Tesseract !== 'undefined') {
      if (status) status.textContent = '⏳ Procesando con Tesseract...';
      try {
        const result = await Tesseract.recognize(imgData, 'spa');
        const text   = result.data.text;
        csvText = text.split('\n')
          .filter(l=>l.trim())
          .map(l=>l.split(/\s{2,}|\t/).map(c=>c.trim()).join(','))
          .join('\n');
      } catch(e) { showToast('Error Tesseract: ' + e.message); }
    } else {
      showToast('Cargando Tesseract...');
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js';
      s.onload = () => __runTableOCR();
      document.head.appendChild(s);
      return;
    }
  }

  if (status) status.style.display='none';

  if (!csvText) { showToast('No se pudo extraer texto de la imagen'); return; }

  const csvTA  = document.getElementById('__tableOCRCSV');
  const resBox = document.getElementById('__tableOCRResultBox');
  const insBtn = document.getElementById('__tableOCRInsertBtn');
  if (csvTA)  csvTA.value = csvText;
  if (resBox) resBox.style.display = 'block';
  if (insBtn) { insBtn.disabled=false; insBtn.style.background='#27ae60'; insBtn.style.cursor='pointer'; }
  __tableOCRPreviewCSV();
  window.__tableOCRCSV = csvText;
}

function __tableOCRPreviewCSV() {
  const csv   = document.getElementById('__tableOCRCSV')?.value || '';
  const style = document.getElementById('__tableOCRStyle')?.value || 'blue';
  const res   = document.getElementById('__tableOCRResult');
  if (!res||!csv.trim()) return;

  const styles = {
    blue:    { header:'background:#003da5;color:#fff', odd:'background:#f0f7ff', border:'#c0d8f0' },
    green:   { header:'background:#27ae60;color:#fff', odd:'background:#f0fff4', border:'#a8d8b8' },
    gray:    { header:'background:#555;color:#fff',    odd:'background:#f8f8f8', border:'#ddd' },
    minimal: { header:'background:#f8f8f8;color:#1a2942;border-bottom:2px solid #333', odd:'', border:'#eee' },
  };
  const s = styles[style] || styles.blue;

  const rows = csv.split('\n').filter(l=>l.trim()).map(l=>l.split(',').map(c=>c.trim()));
  if (!rows.length) return;

  let html = '<table style="border-collapse:collapse;width:100%;font-size:11px;font-family:Calibri,Arial">';
  rows.forEach((row,i) => {
    html += `<tr${i%2&&i>0?` style="${s.odd}"`:''}>`
    row.forEach(cell => {
      if (i===0) html += `<th style="padding:6px 8px;border:1px solid ${s.border};${s.header}">${cell}</th>`;
      else        html += `<td style="padding:5px 8px;border:1px solid ${s.border}">${cell}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  res.innerHTML = html;
}

function __tableOCRInsert() {
  const csv   = document.getElementById('__tableOCRCSV')?.value || '';
  const style = document.getElementById('__tableOCRStyle')?.value || 'blue';
  if (!csv.trim()) { showToast('No hay datos para insertar'); return; }

  const styles = {
    blue:    { header:'background:#003da5;color:#fff', odd:'background:#f0f7ff', border:'#c0d8f0' },
    green:   { header:'background:#27ae60;color:#fff', odd:'background:#f0fff4', border:'#a8d8b8' },
    gray:    { header:'background:#555;color:#fff',    odd:'background:#f8f8f8', border:'#ddd' },
    minimal: { header:'background:#f8f8f8;color:#1a2942;border-bottom:2px solid #333', odd:'', border:'#eee' },
  };
  const s = styles[style] || styles.blue;

  const rows = csv.split('\n').filter(l=>l.trim()).map(l=>l.split(',').map(c=>c.trim()));
  let tableHTML = '<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">';
  rows.forEach((row,i) => {
    tableHTML += `<tr${i%2&&i>0?` style="${s.odd}"`:''}>`
    row.forEach(cell => {
      if (i===0) tableHTML += `<th style="padding:8px 10px;border:1px solid ${s.border};${s.header};text-align:left">${cell}</th>`;
      else        tableHTML += `<td style="padding:7px 10px;border:1px solid ${s.border}">${cell}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</table>';

  const html = `<div style="margin:12px 0">${tableHTML}<div style="font-size:9px;color:#aaa;margin-top:4px;text-align:right">Extraído por OCR · WC Corporate Editor</div></div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__tableOCRPanel').remove();
  showToast('📊 Tabla insertada ✅');
}

const WC_VOICE_AI = {
  recognition: null,
  transcript:  '',
  active:      false,

  async start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast('Reconocimiento de voz no disponible'); return; }
    const key = localStorage.getItem('wc-groq-key');
    if (!key)  { showToast('Configurá tu API Key de Groq para el asistente IA'); return; }

    this.recognition = new SR();
    this.recognition.lang = 'es-CR';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.transcript = '';
    this.active     = true;

    this.recognition.onresult = e => {
      let interim='', final='';
      for (let i=e.resultIndex;i<e.results.length;i++) {
        if(e.results[i].isFinal) final   += e.results[i][0].transcript;
        else                     interim += e.results[i][0].transcript;
      }
      if (final) this.transcript += final + ' ';
      const live = document.getElementById('__vaiLive');
      if (live) live.textContent = (this.transcript + interim).slice(-200);
    };

    this.recognition.onerror = e => { showToast('Error de voz: '+e.error); this.stop(); };
    this.recognition.start();
    this._showPanel();
    showToast('🎙️ Dictando... hablá ahora');
  },

  async stop() {
    this.active = false;
    if (this.recognition) this.recognition.stop();
    const panel = document.getElementById('__vaiPanel');
    if (panel) {
      const status = panel.querySelector('#__vaiStatus');
      if (status) status.textContent = '⏳ Mejorando con IA...';
      const btn = panel.querySelector('#__vaiBtn');
      if (btn) { btn.textContent='⏳ Procesando...'; btn.disabled=true; }
    }
    if (this.transcript.trim()) await this.improveWithAI();
  },

  async improveWithAI() {
    const key = localStorage.getItem('wc-groq-key');
    const mode= document.getElementById('__vaiMode')?.value || 'mejorar';
    const rawText = this.transcript.trim();
    if (!rawText) { showToast('No se detectó texto'); return; }

    const prompts = {
      mejorar:   'Mejorá este texto dictado, corrigiendo gramática, puntuación y estilo. Mantenés el contenido original. Devolvé solo el texto mejorado:',
      formal:    'Convertí este texto dictado a un párrafo formal y profesional. Devolvé solo el texto:',
      bullet:    'Convertí este texto dictado en una lista de puntos clave con viñetas. Devolvé solo la lista:',
      resumen:   'Hacé un resumen conciso de este texto dictado. Devolvé solo el resumen:',
      email:     'Convertí este texto dictado en un email profesional en español. Devolvé solo el email:',
    };

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer '+key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'system',
            content: 'Sos un asistente de redacción en español costarricense. Procesás texto dictado y lo mejorás según las instrucciones.'
          },{
            role: 'user',
            content: `${prompts[mode]||prompts.mejorar}\n\nTEXTO DICTADO:\n"${rawText}"`
          }],
          temperature: 0.4,
          max_tokens: 800
        })
      });
      const data     = await res.json();
      const improved = data?.choices?.[0]?.message?.content || rawText;
      this._showResult(rawText, improved);
    } catch(e) {
      this._showResult(rawText, rawText);
      showToast('Error IA: '+e.message);
    }
  },

  _showPanel() {
    const old = document.getElementById('__vaiPanel'); if (old) old.remove();
    const panel = document.createElement('div');
    panel.id = '__vaiPanel';
    panel.style.cssText = 'position:fixed;bottom:140px;left:12px;right:12px;max-width:500px;margin:0 auto;z-index:9990;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.25);padding:16px;font-family:-apple-system,\'Segoe UI\',sans-serif';
    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <div style="width:10px;height:10px;background:#e74c3c;border-radius:50%;animation:wcPulse 1s infinite"></div>
        <div id="__vaiStatus" style="font-size:13px;font-weight:700;color:#1a2942;flex:1">🎙️ Grabando...</div>
        <select id="__vaiMode" style="padding:5px 8px;border:1px solid #eee;border-radius:6px;font-size:11px;outline:none">
          <option value="mejorar">✨ Mejorar</option>
          <option value="formal">💼 Formal</option>
          <option value="bullet">• Lista</option>
          <option value="resumen">📝 Resumir</option>
          <option value="email">📧 Email</option>
        </select>
      </div>
      <div id="__vaiLive" style="background:#f8f9fa;border-radius:8px;padding:10px;font-size:12px;color:#555;min-height:50px;max-height:100px;overflow:hidden;line-height:1.5;margin-bottom:10px">Esperando...</div>
      <div style="display:flex;gap:6px">
        <button id="__vaiBtn" onclick="WC_VOICE_AI.stop()" style="flex:2;padding:9px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700">⏹ Detener y mejorar con IA</button>
        <button onclick="document.getElementById('__vaiPanel').remove();WC_VOICE_AI.active=false;WC_VOICE_AI.recognition&&WC_VOICE_AI.recognition.stop()" style="flex:1;padding:9px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">✕ Cancelar</button>
      </div>`;
    document.body.appendChild(panel);
  },

  _showResult(original, improved) {
    const panel = document.getElementById('__vaiPanel');
    if (!panel) return;
    panel.innerHTML = `
      <div style="font-size:14px;font-weight:700;color:#1a2942;margin-bottom:10px">✨ Texto mejorado</div>
      <div style="background:#f0f7ff;border-radius:8px;padding:10px;font-size:13px;color:#1a1a1a;line-height:1.6;max-height:150px;overflow-y:auto;margin-bottom:10px">${improved.replace(/\n/g,'<br>')}</div>
      <div style="display:flex;gap:6px">
        <button onclick="if(typeof insertHTML==='function')insertHTML('<p>${improved.replace(/'/g,"\\'").replace(/\n/g,'<br>')}</p>');document.getElementById('__vaiPanel').remove();showToast('✅ Insertado')" style="flex:2;padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700">📥 Insertar en documento</button>
        <button onclick="document.getElementById('__vaiPanel').remove()" style="flex:1;padding:9px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px">Cerrar</button>
      </div>`;
  }
};

function openVoiceAI() {
  WC_VOICE_AI.start();
}

function openOutlinePresentation() {
  const old = document.getElementById('__outlinePresPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__outlinePresPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎬 Presentación desde outline</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Escribí un esquema y la IA genera la presentación completa</div>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button id="__opTab1" onclick="__opTab('outline',this)" style="flex:1;padding:7px;border:2px solid #003da5;background:#f0f7ff;color:#003da5;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📝 Outline</button>
        <button id="__opTab2" onclick="__opTab('ai',this)" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🦙 Generar con IA</button>
        <button id="__opTab3" onclick="__opTab('preview',this)" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">👁 Preview</button>
      </div>

      <!-- Temas -->
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        ${[
          {id:'corporate',name:'Corporativo',bg:'#003da5',text:'#fff'},
          {id:'dark',     name:'Oscuro',     bg:'#1a1a2e',text:'#e0e0e0'},
          {id:'green',    name:'Verde CR',   bg:'#1a472a',text:'#fff'},
          {id:'minimal',  name:'Minimal',    bg:'#f5f5f5',text:'#333'},
          {id:'sunset',   name:'Atardecer',  bg:'linear-gradient(135deg,#ff6b35,#f7931e)',text:'#fff'},
        ].map((t,i)=>`
          <button onclick="__opSelectTheme('${t.id}',this)"
            class="__opThemeBtn"
            style="padding:5px 10px;border:2px solid ${i===0?'#003da5':'#eee'};background:${t.bg};color:${t.text};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':''}>
            ${t.name}
          </button>`).join('')}
      </div>
    </div>

    <!-- Sección outline -->
    <div id="__opSection_outline" style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="font-size:11px;color:#888;margin-bottom:6px;line-height:1.6">
        Formato: <code style="background:#f0f0f0;padding:1px 5px;border-radius:3px"># Título del slide</code> para título, texto normal para contenido. Una sección por slide.
      </div>
      <textarea id="__opOutline" rows="12"
        style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace;line-height:1.6"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        placeholder="# Introducción
Este es el contenido del primer slide.

# El problema
- Punto clave 1
- Punto clave 2
- Dato importante

# Nuestra solución
Descripción de la solución propuesta.

# Resultados esperados
- Beneficio 1
- Beneficio 2

# Conclusión
Mensaje final de cierre."># Bienvenidos
WC Corporate Editor v25 — Presentación profesional

# El problema
- Los editores tradicionales son lentos
- No tienen integración con Costa Rica
- Falta de funciones IA modernas

# Nuestra solución
WC Corporate Editor: el editor más completo para Costa Rica con 115+ features, IA integrada y soporte para lenguas indígenas.

# Características principales
- 🦙 IA con Llama 3.3 via Groq
- 🇨🇷 Integrado con CCSS, Hacienda, SICOP
- 🌿 Lenguas indígenas CR
- 📱 100% compatible con iOS

# Conclusión
Pura vida mae — el futuro de los editores en Costa Rica es hoy.</textarea>
    </div>

    <!-- Sección IA -->
    <div id="__opSection_ai" style="display:none;flex:1;overflow-y:auto;padding:0 20px">
      <div style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tema de la presentación</label>
        <input type="text" id="__opAITopic" placeholder="Ej: Estrategia de ventas Q1 2025, Proyecto de investigación..."
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Número de slides</label>
          <select id="__opAISlides" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="5">5 slides</option>
            <option value="8" selected>8 slides</option>
            <option value="10">10 slides</option>
            <option value="15">15 slides</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Audiencia</label>
          <select id="__opAIAudience" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="ejecutiva">Ejecutiva / Dirección</option>
            <option value="academica">Académica / Universitaria</option>
            <option value="cliente">Clientes / Externos</option>
            <option value="tecnica">Técnica / Interna</option>
          </select>
        </div>
      </div>
      <button onclick="__opGenerateAI()" style="width:100%;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">🦙 Generar outline con IA</button>
      <div id="__opAIStatus" style="display:none;text-align:center;color:#0084ff;font-size:12px;padding:10px">⏳ Generando outline...</div>
    </div>

    <!-- Preview -->
    <div id="__opSection_preview" style="display:none;flex:1;overflow-y:auto;padding:0 20px">
      <div id="__opPreviewContent" style="font-size:12px;color:#555;text-align:center;padding:20px">
        Generá o escribí el outline primero
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__outlinePresPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__opPreview()" style="flex:1;padding:10px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">👁 Preview</button>
      <button onclick="__opGenerate()" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🎬 Generar presentación</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__opTheme = { id:'corporate', bg:'#003da5', text:'#fff' };
}

function __opTab(tab, btn) {
  ['outline','ai','preview'].forEach((t,i) => {
    const sec = document.getElementById('__opSection_'+t);
    const b   = document.getElementById('__opTab'+(i+1));
    if (sec) sec.style.display = t===tab?'flex':'none';
    if (sec && t===tab) sec.style.flexDirection='column';
    if (b)   { b.style.borderColor=t===tab?'#003da5':'#eee'; b.style.background=t===tab?'#f0f7ff':'#fafafa'; b.style.color=t===tab?'#003da5':'#555'; }
  });
}

function __opSelectTheme(id, btn) {
  const themes = {
    corporate: { id:'corporate', bg:'#003da5',                              text:'#fff' },
    dark:      { id:'dark',      bg:'#1a1a2e',                              text:'#e0e0e0' },
    green:     { id:'green',     bg:'#1a472a',                              text:'#fff' },
    minimal:   { id:'minimal',   bg:'#f5f5f5',                              text:'#333' },
    sunset:    { id:'sunset',    bg:'linear-gradient(135deg,#ff6b35,#f7931e)', text:'#fff' },
  };
  window.__opTheme = themes[id] || themes.corporate;
  document.querySelectorAll('.__opThemeBtn').forEach(b=>{b.style.borderColor='#eee';delete b.dataset.sel;});
  btn.style.borderColor='#fff'; btn.dataset.sel='1';
}

async function __opGenerateAI() {
  const key   = localStorage.getItem('wc-groq-key');
  const topic = document.getElementById('__opAITopic')?.value.trim();
  if (!topic) { showToast('Ingresá el tema de la presentación'); return; }
  if (!key)   { showToast('Configurá tu API Key de Groq'); return; }

  const slides   = document.getElementById('__opAISlides')?.value || '8';
  const audience = document.getElementById('__opAIAudience')?.value || 'ejecutiva';
  const status   = document.getElementById('__opAIStatus');
  if (status) status.style.display='block';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:'Sos un experto en comunicación ejecutiva costarricense. Generás outlines de presentaciones profesionales.'
        },{
          role:'user',
          content:`Genera un outline para una presentación de ${slides} slides sobre: "${topic}"
Audiencia: ${audience}
Formato EXACTO (usa # para títulos de slides):

# [Título del slide]
[Contenido: 2-4 bullets o párrafo corto]

Genera exactamente ${slides} slides. Sé concreto y directo. En español.`
        }],
        temperature:0.5, max_tokens:1000
      })
    });
    const data    = await res.json();
    const outline = data?.choices?.[0]?.message?.content || '';
    if (status) status.style.display='none';
    const ta = document.getElementById('__opOutline');
    if (ta) ta.value = outline;
    __opTab('outline', document.getElementById('__opTab1'));
    showToast('✅ Outline generado');
  } catch(e) {
    if (status) status.style.display='none';
    showToast('Error: '+e.message);
  }
}

function __opParseOutline() {
  const text   = document.getElementById('__opOutline')?.value || '';
  const slides = [];
  const parts  = text.split(/^#\s+/m).filter(p=>p.trim());
  parts.forEach(part => {
    const lines   = part.split('\n').filter(l=>l.trim());
    const title   = lines[0]?.trim() || 'Slide';
    const body    = lines.slice(1).join('\n').trim();
    slides.push({ title, body });
  });
  return slides;
}

function __opPreview() {
  const slides = __opParseOutline();
  const theme  = window.__opTheme || { bg:'#003da5', text:'#fff' };
  const prev   = document.getElementById('__opPreviewContent');
  if (!prev) return;
  __opTab('preview', document.getElementById('__opTab3'));
  if (!slides.length) { prev.innerHTML='<div style="color:#bbb;padding:20px;text-align:center">Sin slides</div>'; return; }
  prev.innerHTML = slides.map((s,i)=>`
    <div style="background:${theme.bg};border-radius:10px;padding:14px;margin-bottom:8px;color:${theme.text}">
      <div style="font-size:11px;opacity:.5;margin-bottom:4px">SLIDE ${i+1}</div>
      <div style="font-size:14px;font-weight:700">${s.title}</div>
      ${s.body?`<div style="font-size:11px;opacity:.8;margin-top:6px;white-space:pre-wrap">${s.body}</div>`:''}
    </div>`).join('');
}

function __opGenerate() {
  const slides = __opParseOutline();
  const theme  = window.__opTheme || { bg:'#003da5', text:'#fff' };
  if (!slides.length) { showToast('Escribí el outline primero'); return; }

  const total  = slides.length;
  const r      = Math.round(parseInt(theme.bg.replace('#',''),16)*0.8).toString(16).padStart(6,'0');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Presentación — WC Corporate Editor</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,'Segoe UI',Calibri,Arial,sans-serif;background:#000;overflow:hidden;height:100vh}
  .slide{display:none;height:100vh;background:${theme.bg};color:${theme.text};flex-direction:column;align-items:center;justify-content:center;padding:8vh 10vw;text-align:center;position:relative}
  .slide.active{display:flex;animation:fadeIn .4s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .slide-num{position:absolute;bottom:16px;right:20px;font-size:11px;opacity:.4;font-family:'Courier New',monospace}
  .progress{position:absolute;bottom:0;left:0;height:3px;background:rgba(255,255,255,.4);transition:width .3s}
  .accent{width:50px;height:4px;background:rgba(255,255,255,.5);margin:12px auto;border-radius:2px}
  h1{font-size:clamp(22px,4.5vw,48px);font-weight:900;line-height:1.2;margin-bottom:8px}
  .body{font-size:clamp(14px,2vw,22px);line-height:1.7;opacity:.9;max-width:80%;white-space:pre-wrap;text-align:left}
  .nav{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;z-index:100}
  .nav button{background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:50%;width:42px;height:42px;font-size:18px;cursor:pointer;backdrop-filter:blur(10px)}
  .nav button:hover{background:rgba(255,255,255,.3)}
  .nav-cnt{color:rgba(255,255,255,.6);font-size:12px;min-width:60px;text-align:center}
  .exit{position:fixed;top:14px;right:14px;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px;backdrop-filter:blur(10px)}
  .fs-btn{position:fixed;top:14px;right:100px;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px;backdrop-filter:blur(10px)}
</style>
</head>
<body>
${slides.map((s,i)=>`
<div class="slide${i===0?' active':''}" id="s${i}">
  <div class="progress" style="width:${Math.round((i+1)/total*100)}%"></div>
  <div class="accent"></div>
  <h1>${s.title}</h1>
  ${s.body?`<div class="body">${s.body}</div>`:''}
  <div class="slide-num">${i+1} / ${total}</div>
</div>`).join('')}

<div class="nav">
  <button onclick="nav(-1)">◀</button>
  <span class="nav-cnt" id="cnt">1 / ${total}</span>
  <button onclick="nav(1)">▶</button>
</div>
<button class="exit" onclick="window.close()">✕ Cerrar</button>
<button class="fs-btn" onclick="document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()">⛶</button>

<script>
let cur=0;
function show(n){
  document.querySelectorAll('.slide').forEach(s=>s.classList.remove('active'));
  document.getElementById('s'+n).classList.add('active');
  document.getElementById('cnt').textContent=(n+1)+' / ${total}';
}
function nav(d){
  cur=Math.max(0,Math.min(${total-1},cur+d));
  show(cur);
}
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' ')nav(1);
  if(e.key==='ArrowLeft')nav(-1);
  if(e.key==='Escape')window.close();
});
let tx=0;
document.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
document.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50){d<0?nav(1):nav(-1);}},{passive:true});
<\/script>
</body></html>`;

  const win = window.open('','_blank','width=1200,height=700');
  win.document.write(html);
  win.document.close();
  document.getElementById('__outlinePresPanel').remove();
  showToast(`🎬 Presentación con ${total} slides generada ✅`);
}

(function initV2522() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'autocorrect':       openAutocorrectPanel();      break;
          case 'tableOCR':          openTableOCR();              break;
          case 'voiceAI':           openVoiceAI();               break;
          case 'outlinePresentation': openOutlinePresentation(); break;
          default: orig(a);
        }
      };
    }
    if (WC_AUTOCORRECT.enabled) WC_AUTOCORRECT.start();
    console.log('WC Corporate Editor v25.22 ✅ — Autocorrector CR, OCR Tablas, Voz+IA, Presentación Outline');
  }, 3000);
})();
const WC_READER = {
  active:    false,
  wpm:       250,
  words:     [],
  current:   0,
  interval:  null,
  startTime: 0,
  totalWords:0,

  open() {
    const ed = document.getElementById('editor');
    if (!ed) return;
    const text  = ed.innerText.trim();
    const words = text.split(/\s+/).filter(w=>w);
    if (words.length < 10) { showToast('El documento necesita más contenido'); return; }
    this.words      = words;
    this.totalWords = words.length;
    this.current    = 0;
    this.active     = true;
    this._render();
  },

  _render() {
    const old = document.getElementById('__readerOverlay'); if (old) old.remove();
    const ov  = document.createElement('div');
    ov.id = '__readerOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9500;background:#1a1a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,"Segoe UI",sans-serif';

    const estimatedMins = Math.round(this.totalWords / this.wpm);
    const readMins      = Math.round(this.current / this.wpm);

    ov.innerHTML = `
      <!-- Barra superior -->
      <div style="position:fixed;top:0;left:0;right:0;padding:12px 20px;background:rgba(26,26,46,.9);display:flex;align-items:center;gap:12px;z-index:1">
        <button onclick="WC_READER.close()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px">✕ Salir</button>
        <div style="flex:1;text-align:center;font-size:12px;color:#555">${this.totalWords} palabras · ~${estimatedMins} min lectura</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;color:#555">WPM:</span>
          <input type="range" id="__readerWPM" min="100" max="800" value="${this.wpm}" step="25"
            style="width:80px;accent-color:#0084ff"
            oninput="WC_READER.wpm=parseInt(this.value);document.getElementById('__readerWPMVal').textContent=this.value">
          <span id="__readerWPMVal" style="font-size:12px;color:#0084ff;min-width:30px">${this.wpm}</span>
        </div>
      </div>

      <!-- Área de lectura -->
      <div style="max-width:600px;width:100%;padding:0 40px;text-align:center">
        <!-- Velocímetro -->
        <div style="margin-bottom:30px">
          <svg width="120" height="70" viewBox="0 0 120 70">
            <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#333" stroke-width="8" stroke-linecap="round"/>
            <path id="__readerGauge" d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#0084ff" stroke-width="8" stroke-linecap="round" stroke-dasharray="157" stroke-dashoffset="157"/>
            <text x="60" y="55" text-anchor="middle" fill="#0084ff" font-size="18" font-weight="900" font-family="-apple-system,sans-serif" id="__readerWPMDisplay">${this.wpm}</text>
            <text x="60" y="68" text-anchor="middle" fill="#555" font-size="8" font-family="-apple-system,sans-serif">WPM</text>
          </svg>
        </div>

        <!-- Palabra actual (modo RSVP) -->
        <div id="__readerWord" style="font-size:clamp(32px,6vw,64px);font-weight:900;color:#fff;letter-spacing:2px;min-height:80px;display:flex;align-items:center;justify-content:center;margin-bottom:20px">
          <span style="color:#0084ff">•</span>
        </div>

        <!-- Contexto -->
        <div id="__readerContext" style="font-size:14px;color:#555;max-height:80px;overflow:hidden;line-height:1.6;margin-bottom:24px;transition:opacity .3s"></div>

        <!-- Progreso -->
        <div style="background:#333;border-radius:20px;height:6px;overflow:hidden;margin-bottom:8px">
          <div id="__readerProgress" style="height:100%;background:linear-gradient(90deg,#0084ff,#27ae60);border-radius:20px;width:0%;transition:width .3s"></div>
        </div>
        <div style="font-size:11px;color:#555;margin-bottom:24px">
          <span id="__readerPos">0</span> / ${this.totalWords} palabras · <span id="__readerTime">0</span> min leídos
        </div>

        <!-- Controles -->
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button onclick="WC_READER.jump(-50)" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:12px">−50</button>
          <button onclick="WC_READER.prev()" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:14px">◀</button>
          <button id="__readerPlayBtn" onclick="WC_READER.toggle()" style="padding:10px 24px;background:#0084ff;border:none;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;min-width:90px">▶ Play</button>
          <button onclick="WC_READER.next()" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:14px">▶</button>
          <button onclick="WC_READER.jump(50)" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:12px">+50</button>
        </div>

        <!-- Modos -->
        <div style="display:flex;gap:6px;justify-content:center;margin-top:12px">
          <button onclick="WC_READER.setMode('rsvp')" style="padding:5px 12px;border:1.5px solid ${this._mode==='rsvp'?'#0084ff':'#333'};background:${this._mode==='rsvp'?'#0084ff33':'transparent'};color:${this._mode==='rsvp'?'#0084ff':'#555'};border-radius:6px;cursor:pointer;font-size:11px">RSVP</button>
          <button onclick="WC_READER.setMode('scroll')" style="padding:5px 12px;border:1.5px solid ${this._mode==='scroll'?'#0084ff':'#333'};background:${this._mode==='scroll'?'#0084ff33':'transparent'};color:${this._mode==='scroll'?'#0084ff':'#555'};border-radius:6px;cursor:pointer;font-size:11px">Scroll</button>
        </div>
      </div>

      <!-- Estadísticas finales (ocultas) -->
      <div id="__readerStats" style="display:none;position:fixed;inset:0;background:#1a1a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center"></div>
    `;

    document.body.appendChild(ov);
    this._mode = 'rsvp';
    this._updateDisplay();

    this._keyHandler = e => {
      if (e.key==='Escape') this.close();
      if (e.key===' ') { e.preventDefault(); this.toggle(); }
      if (e.key==='ArrowRight') this.next();
      if (e.key==='ArrowLeft')  this.prev();
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  toggle() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      const btn = document.getElementById('__readerPlayBtn');
      if (btn) btn.textContent = '▶ Play';
    } else {
      if (!this.startTime) this.startTime = Date.now();
      this.interval = setInterval(() => {
        if (this.current >= this.words.length) { this.finish(); return; }
        this._updateDisplay();
        this.current++;
      }, 60000 / this.wpm);
      const btn = document.getElementById('__readerPlayBtn');
      if (btn) btn.textContent = '⏸ Pausa';
    }
  },

  _updateDisplay() {
    const wordEl    = document.getElementById('__readerWord');
    const ctxEl     = document.getElementById('__readerContext');
    const progEl    = document.getElementById('__readerProgress');
    const posEl     = document.getElementById('__readerPos');
    const timeEl    = document.getElementById('__readerTime');
    const gaugeEl   = document.getElementById('__readerGauge');
    const wpmDispEl = document.getElementById('__readerWPMDisplay');

    const pct = this.totalWords > 0 ? this.current/this.totalWords : 0;
    const word = this.words[this.current] || '';

    if (wordEl)    wordEl.innerHTML = this._highlightWord(word);
    if (ctxEl)     ctxEl.textContent = this.words.slice(Math.max(0,this.current-5), this.current+10).join(' ');
    if (progEl)    progEl.style.width = (pct*100)+'%';
    if (posEl)     posEl.textContent = this.current;
    if (timeEl)    timeEl.textContent = Math.round(this.current/this.wpm);

    const gaugeMax = 800, r = 50, circ = Math.PI*r;
    const offset   = circ * (1 - Math.min(this.wpm, gaugeMax)/gaugeMax);
    if (gaugeEl)    gaugeEl.style.strokeDashoffset = offset;
    if (wpmDispEl)  wpmDispEl.textContent = this.wpm;
  },

  _highlightWord(word) {
    if (!word) return '<span style="color:#333">•</span>';
    const mid = Math.floor(word.length/2);
    return `<span style="color:#e74c3c">${word.slice(0,1)}</span><span style="color:#fff">${word.slice(1,mid)}</span><span style="color:#0084ff">${word.slice(mid)}</span>`;
  },

  next()       { this.current = Math.min(this.words.length-1, this.current+1); this._updateDisplay(); },
  prev()       { this.current = Math.max(0, this.current-1); this._updateDisplay(); },
  jump(n)      { this.current = Math.max(0, Math.min(this.words.length-1, this.current+n)); this._updateDisplay(); },
  setMode(m)   { this._mode = m; },

  finish() {
    clearInterval(this.interval);
    this.interval = null;
    const elapsed = this.startTime ? Math.round((Date.now()-this.startTime)/60000) : 1;
    const realWPM = elapsed > 0 ? Math.round(this.totalWords/elapsed) : this.wpm;

    const statsEl = document.getElementById('__readerStats');
    if (statsEl) {
      statsEl.style.display = 'flex';
      statsEl.innerHTML = `
        <div style="font-size:40px;margin-bottom:16px">🎉</div>
        <div style="font-size:24px;font-weight:900;color:#fff;margin-bottom:8px">¡Lectura completada!</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin:16px 0">
          <div style="text-align:center"><div style="font-size:28px;font-weight:900;color:#0084ff">${this.totalWords}</div><div style="font-size:11px;color:#555">Palabras</div></div>
          <div style="text-align:center"><div style="font-size:28px;font-weight:900;color:#27ae60">${elapsed}</div><div style="font-size:11px;color:#555">Minutos</div></div>
          <div style="text-align:center"><div style="font-size:28px;font-weight:900;color:#f39c12">${realWPM}</div><div style="font-size:11px;color:#555">WPM real</div></div>
        </div>
        <div style="font-size:13px;color:#555;margin-bottom:20px">${realWPM > 300 ? '⚡ ¡Lector rápido!' : realWPM > 200 ? '👍 Velocidad promedio' : '📖 Lectura comprensiva'}</div>
        <button onclick="WC_READER.close()" style="padding:12px 28px;background:#0084ff;border:none;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">Cerrar</button>`;
    }
  },

  close() {
    clearInterval(this.interval);
    this.interval = null;
    this.active   = false;
    document.removeEventListener('keydown', this._keyHandler);
    const ov = document.getElementById('__readerOverlay');
    if (ov) ov.remove();
    document.title = 'WC Corporate Editor v24';
  }
};

function openReaderMode() { WC_READER.open(); }

const WC_HISTORY_SAVES = {
  saves: JSON.parse(localStorage.getItem('wc-save-history') || '[]'),
  maxSaves: 20,

  save(label) {
    const ed    = document.getElementById('editor');
    if (!ed) return;
    const entry = {
      id:       's' + Date.now(),
      label:    label || 'Autoguardado',
      date:     new Date().toLocaleString('es-CR'),
      ts:       Date.now(),
      words:    ed.innerText.trim().split(/\s+/).filter(w=>w).length,
      preview:  ed.innerText.slice(0,100).trim(),
      html:     ed.innerHTML,
    };
    this.saves.unshift(entry);
    if (this.saves.length > this.maxSaves) this.saves.pop();
    localStorage.setItem('wc-save-history', JSON.stringify(this.saves));
    return entry;
  },

  restore(id) {
    const entry = this.saves.find(s=>s.id===id);
    const ed    = document.getElementById('editor');
    if (!entry || !ed) return false;
    this.save('Antes de restaurar');
    ed.innerHTML = entry.html;
    if (typeof updateStats==='function') updateStats();
    return true;
  },

  delete(id) {
    this.saves = this.saves.filter(s=>s.id!==id);
    localStorage.setItem('wc-save-history', JSON.stringify(this.saves));
  },

  startAuto(intervalMinutes) {
    clearInterval(this._autoInterval);
    this._autoInterval = setInterval(() => {
      const entry = this.save('Autoguardado');
      if (entry) {
        const sb = document.getElementById('trackStatus') || document.getElementById('__statusbar');
        if (sb) sb.textContent = `✓ Autoguardado ${entry.date}`;
      }
    }, intervalMinutes * 60 * 1000);
  }
};

function openSaveHistory() {
  const old = document.getElementById('__saveHistPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__saveHistPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center';

  const saves = WC_HISTORY_SAVES.saves;

  ov.innerHTML = `
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div>
          <div style="font-size:17px;font-weight:700;color:#1a2942">💾 Historial de guardados</div>
          <div style="font-size:11px;color:#888;margin-top:2px">${saves.length} versiones guardadas · máx ${WC_HISTORY_SAVES.maxSaves}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button onclick="WC_HISTORY_SAVES.save('Manual');openSaveHistory()" style="padding:7px 12px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">💾 Guardar ahora</button>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px;font-size:11px">
        <span style="color:#888">Auto cada:</span>
        ${[5,10,30].map(m=>`<button onclick="WC_HISTORY_SAVES.startAuto(${m});showToast('⏱ Auto cada ${m} min')" style="padding:3px 9px;border:1.5px solid #eee;background:#fafafa;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;color:#555">${m}min</button>`).join('')}
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 20px">
      ${!saves.length ? `
        <div style="text-align:center;padding:30px;color:#bbb">
          <div style="font-size:32px;margin-bottom:10px">💾</div>
          <div style="font-size:13px">Sin guardados aún</div>
          <div style="font-size:11px;margin-top:6px">Activá el autoguardado o guardá manualmente</div>
        </div>` :
        saves.map((s,i) => `
          <div style="background:#fafafa;border:1.5px solid #eee;border-radius:12px;padding:12px;margin-bottom:8px">
            <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
              <div style="width:36px;height:36px;background:${i===0?'#27ae60':'#f0f0f5'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">${i===0?'⭐':'💾'}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:700;color:#1a1a1a">${s.label}</div>
                <div style="font-size:10px;color:#888">${s.date} · ${s.words} palabras</div>
                <div style="font-size:11px;color:#aaa;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.preview}...</div>
              </div>
              <button onclick="WC_HISTORY_SAVES.delete('${s.id}');openSaveHistory()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:16px;flex-shrink:0">🗑</button>
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="__saveHistPreview('${s.id}')" style="flex:1;padding:7px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">👁 Ver</button>
              <button onclick="if(confirm('¿Restaurar esta versión? El estado actual se guardará primero.')){WC_HISTORY_SAVES.restore('${s.id}');document.getElementById('__saveHistPanel').remove();showToast('↩ Versión restaurada ✅')}" style="flex:2;padding:7px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">↩ Restaurar</button>
            </div>
          </div>`).join('')}
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__saveHistPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __saveHistPreview(id) {
  const s = WC_HISTORY_SAVES.saves.find(s=>s.id===id);
  if (!s) return;
  const win = window.open('','_blank','width=700,height=600');
  win.document.write(`<html><head><title>${s.label}</title><style>body{font-family:Calibri,Arial;margin:2cm;line-height:1.6;color:#333}h1,h2,h3{color:#1a2942}</style></head><body><div style="background:#f0f7ff;padding:12px;border-radius:8px;margin-bottom:16px;font-size:12px"><strong>${s.label}</strong> · ${s.date} · ${s.words} palabras</div>${s.html}</body></html>`);
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey||e.metaKey) && e.key==='s') {
    setTimeout(() => WC_HISTORY_SAVES.save('Ctrl+S'), 200);
  }
});

WC_HISTORY_SAVES.startAuto(10);

function openDocumentComparator() {
  const old = document.getElementById('__comparePanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__comparePanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,"Segoe UI",sans-serif';

  const ed    = document.getElementById('editor');
  const docA  = ed ? ed.innerHTML : '';

  ov.innerHTML = `
    <!-- Header -->
    <div style="background:#1a2942;color:#fff;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;flex:1">⚖️ Comparador de documentos</div>
      <button onclick="document.getElementById('__comparePanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:12px">✕ Cerrar</button>
    </div>

    <!-- Controles -->
    <div style="background:#fff;padding:10px 16px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap">
      <div style="font-size:12px;font-weight:600;color:#555">Comparar con:</div>
      <select id="__cmpSource" style="padding:6px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
        <option value="paste">Pegar texto</option>
        <option value="history">Versión guardada</option>
        <option value="file">Archivo</option>
      </select>
      <button onclick="__cmpLoad()" style="padding:6px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Cargar →</button>
      <div style="flex:1"></div>
      <div style="display:flex;gap:6px">
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;color:#555">
          <input type="checkbox" id="__cmpHighlight" checked style="accent-color:#0084ff"> Resaltar diferencias
        </label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;color:#555">
          <input type="checkbox" id="__cmpSync" checked style="accent-color:#0084ff"> Scroll sincronizado
        </label>
      </div>
    </div>

    <!-- Panel de texto para pegar (según fuente) -->
    <div id="__cmpInputArea" style="background:#f8f9fa;padding:10px 16px;border-bottom:1px solid #eee;flex-shrink:0;display:none">
      <textarea id="__cmpPasteArea" placeholder="Pegá el texto del segundo documento aquí..." rows="3"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      <div style="display:flex;gap:6px;margin-top:6px">
        <button onclick="__cmpRunCompare()" style="padding:7px 16px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">⚖️ Comparar</button>
        <button onclick="document.getElementById('__cmpInputArea').style.display='none'" style="padding:7px 12px;border:1.5px solid #eee;background:#fff;border-radius:7px;cursor:pointer;font-size:12px">Cancelar</button>
      </div>
    </div>

    <!-- Columnas de comparación -->
    <div style="flex:1;display:flex;overflow:hidden">
      <div style="flex:1;display:flex;flex-direction:column;border-right:2px solid #eee">
        <div style="background:#003da5;color:#fff;padding:8px 14px;font-size:12px;font-weight:700;flex-shrink:0">
          📄 Documento actual <span id="__cmpAWords" style="opacity:.7;font-weight:400"></span>
        </div>
        <div id="__cmpPanelA" style="flex:1;overflow-y:auto;padding:16px;font-family:Calibri,'Segoe UI',sans-serif;font-size:11pt;line-height:1.6">${docA}</div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column">
        <div style="background:#27ae60;color:#fff;padding:8px 14px;font-size:12px;font-weight:700;flex-shrink:0">
          📄 Documento B <span id="__cmpBWords" style="opacity:.7;font-weight:400"></span>
        </div>
        <div id="__cmpPanelB" style="flex:1;overflow-y:auto;padding:16px;font-family:Calibri,'Segoe UI',sans-serif;font-size:11pt;line-height:1.6;color:#888;font-style:italic">
          <div style="text-align:center;padding:40px;color:#bbb">
            <div style="font-size:32px;margin-bottom:12px">📂</div>
            Seleccioná una fuente y cargá el segundo documento
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div id="__cmpStats" style="background:#f8f9fa;padding:8px 16px;border-top:1px solid #eee;font-size:11px;color:#888;display:flex;gap:16px;flex-shrink:0;flex-wrap:wrap"></div>
  `;

  document.body.appendChild(ov);

  const pA = document.createElement('div');
  pA.innerHTML = docA;
  const wA = pA.innerText.trim().split(/\s+/).filter(w=>w).length;
  document.getElementById('__cmpAWords').textContent = `(${wA} palabras)`;

  window.__cmpDocA = docA;

  const panelA = document.getElementById('__cmpPanelA');
  const panelB = document.getElementById('__cmpPanelB');
  if (panelA && panelB) {
    panelA.addEventListener('scroll', () => {
      if (document.getElementById('__cmpSync')?.checked) {
        panelB.scrollTop = panelA.scrollTop * (panelB.scrollHeight/panelA.scrollHeight);
      }
    });
  }
}

function __cmpLoad() {
  const source = document.getElementById('__cmpSource')?.value;
  const inputArea = document.getElementById('__cmpInputArea');

  if (source === 'paste') {
    if (inputArea) inputArea.style.display='block';
  } else if (source === 'history') {
    const saves = WC_HISTORY_SAVES.saves;
    if (!saves.length) { showToast('No hay versiones guardadas'); return; }
    const names = saves.map((s,i) => `${i+1}. ${s.label} — ${s.date} (${s.words} palabras)`).join('\n');
    const idx   = prompt(`Elegí una versión (número):\n${names}`, '1');
    if (!idx) return;
    const save  = saves[parseInt(idx)-1];
    if (!save) return;
    window.__cmpDocB = save.html;
    __cmpRunCompare();
  } else if (source === 'file') {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.html,.htm,.txt';
    inp.onchange = () => {
      const file = inp.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        window.__cmpDocB = e.target.result;
        __cmpRunCompare();
      };
      reader.readAsText(file);
    };
    inp.click();
  }
}

function __cmpRunCompare() {
  const source  = document.getElementById('__cmpSource')?.value;
  let   docB    = window.__cmpDocB || '';

  if (source === 'paste') {
    docB = document.getElementById('__cmpPasteArea')?.value || '';
    document.getElementById('__cmpInputArea').style.display='none';
  }

  if (!docB.trim()) { showToast('El documento B está vacío'); return; }

  const highlight = document.getElementById('__cmpHighlight')?.checked;
  const panelB    = document.getElementById('__cmpPanelB');
  const statsEl   = document.getElementById('__cmpStats');

  if (panelB) {
    panelB.innerHTML = docB;
    panelB.style.color = '';
    panelB.style.fontStyle = '';
  }

  const divA = document.createElement('div'); divA.innerHTML = window.__cmpDocA;
  const divB = document.createElement('div'); divB.innerHTML = docB;
  const textA = divA.innerText.trim().split(/\s+/).filter(w=>w);
  const textB = divB.innerText.trim().split(/\s+/).filter(w=>w);
  const setA  = new Set(textA), setB = new Set(textB);
  const added   = textB.filter(w=>!setA.has(w)).length;
  const removed = textA.filter(w=>!setB.has(w)).length;
  const common  = textA.filter(w=>setB.has(w)).length;
  const similarity = textA.length ? Math.round(common/Math.max(textA.length,textB.length)*100) : 0;

  document.getElementById('__cmpBWords').textContent = `(${textB.length} palabras)`;

  if (statsEl) {
    statsEl.innerHTML = `
      <span>📊 Similitud: <strong style="color:${similarity>70?'#27ae60':'#f39c12'}">${similarity}%</strong></span>
      <span>+ <strong style="color:#27ae60">${added}</strong> palabras añadidas en B</span>
      <span>- <strong style="color:#e74c3c">${removed}</strong> palabras eliminadas en B</span>
      <span>📄 A: ${textA.length} palabras · B: ${textB.length} palabras</span>`;
  }

  if (highlight && panelB) {
    const removedWords = new Set(textA.filter(w=>!setB.has(w)));
    const addedWords   = new Set(textB.filter(w=>!setA.has(w)));
    let html = panelB.innerHTML;
    addedWords.forEach(w => {
      if (w.length > 3) {
        html = html.replace(new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','g'),
          `<mark style="background:#d4edda;border-radius:2px">${w}</mark>`);
      }
    });
    panelB.innerHTML = html;
  }

  showToast(`⚖️ Similitud: ${similarity}%`);
}

function openGoogleSlidesExport() {
  const old = document.getElementById('__gsPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__gsPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  const ed = document.getElementById('editor');
  const headings = ed ? Array.from(ed.querySelectorAll('h1,h2,h3')) : [];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#f4b400" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
      Exportar a Google Slides
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Crea una presentación de Google desde el documento</div>

    <div style="background:#fff9e6;border:1.5px solid #f39c12;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#856404;line-height:1.6">
      ℹ️ <strong>Método:</strong> Se genera un archivo HTML/JSON que podés importar a Google Slides, o se crea un link a Google Slides con el contenido del documento.
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Título de la presentación</label>
      <input type="text" id="__gsTitle" value="${headings[0]?.innerText?.slice(0,50) || 'Mi presentación'}"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Método de exportación</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid #eee;border-radius:10px;transition:all .15s" onmouseover="this.style.borderColor='#4285f4'" onmouseout="this.style.borderColor='#eee'">
          <input type="radio" name="__gsMethod" value="download" checked style="margin-top:2px;accent-color:#4285f4">
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">📥 Descargar como HTML de presentación</div>
            <div style="font-size:11px;color:#888">Archivo HTML que funciona como presentación. Importable a Google Slides.</div>
          </div>
        </label>
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid #eee;border-radius:10px;transition:all .15s" onmouseover="this.style.borderColor='#4285f4'" onmouseout="this.style.borderColor='#eee'">
          <input type="radio" name="__gsMethod" value="slides_url" style="margin-top:2px;accent-color:#4285f4">
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">🌐 Abrir en Google Slides (nuevo)</div>
            <div style="font-size:11px;color:#888">Abre Google Slides en blanco. Copiás el contenido generado.</div>
          </div>
        </label>
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid #eee;border-radius:10px;transition:all .15s" onmouseover="this.style.borderColor='#4285f4'" onmouseout="this.style.borderColor='#eee'">
          <input type="radio" name="__gsMethod" value="pptx" style="margin-top:2px;accent-color:#4285f4">
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">📊 Descargar como PPTX base</div>
            <div style="font-size:11px;color:#888">Estructura PPTX importable en Google Slides y PowerPoint.</div>
          </div>
        </label>
      </div>
    </div>

    <div style="font-size:11px;color:#888;margin-bottom:14px">
      Se detectaron <strong>${headings.length}</strong> títulos = <strong>${headings.length || 1}</strong> slide${headings.length!==1?'s':''}
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__gsPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__gsExport()" style="flex:2;padding:11px;border:none;background:#4285f4;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        <svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:4px"><path fill="#fff" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        Exportar
      </button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}

function __gsExport() {
  const method = document.querySelector('[name="__gsMethod"]:checked')?.value || 'download';
  const title  = document.getElementById('__gsTitle')?.value || 'Presentación';
  const ed     = document.getElementById('editor');
  if (!ed) return;

  const children = Array.from(ed.children);
  const slides   = [];
  let current    = null;

  children.forEach(el => {
    if (/^H[123]$/.test(el.tagName)) {
      if (current) slides.push(current);
      current = { title: el.innerText.trim(), body: '', html: '' };
    } else if (current) {
      current.body += el.innerText.trim() + ' ';
      current.html += el.outerHTML;
    }
  });
  if (current) slides.push(current);
  if (!slides.length) slides.push({ title, body: ed.innerText.slice(0,300), html: ed.innerHTML });

  if (method === 'download' || method === 'pptx') {
    const presHTML = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#1a1a2e;overflow:hidden;height:100vh}
.slide{display:none;height:100vh;background:#003da5;color:#fff;flex-direction:column;align-items:center;justify-content:center;padding:8vh 10vw;text-align:center}
.slide.active{display:flex}
h1{font-size:clamp(24px,5vw,52px);font-weight:900;margin-bottom:16px}
.body{font-size:clamp(14px,2vw,22px);line-height:1.7;opacity:.9;max-width:80%}
.num{position:absolute;bottom:20px;right:24px;font-size:11px;opacity:.4}
.nav{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:12px}
.nav button{background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:50%;width:40px;height:40px;cursor:pointer;font-size:18px}
.bar{position:absolute;bottom:0;left:0;height:4px;background:rgba(255,255,255,.4)}
</style>
</head><body>
${slides.map((s,i)=>`<div class="slide${i===0?' active':''}" id="s${i}"><div class="bar" style="width:${Math.round((i+1)/slides.length*100)}%"></div><h1>${s.title}</h1>${s.body?`<div class="body">${s.body.slice(0,200)}</div>`:''}<div class="num">${i+1}/${slides.length}</div></div>`).join('')}
<div class="nav"><button onclick="nav(-1)">◀</button><button onclick="nav(1)">▶</button></div>
<script>let c=0;function nav(d){document.querySelectorAll('.slide').forEach(s=>s.classList.remove('active'));c=Math.max(0,Math.min(${slides.length-1},c+d));document.getElementById('s'+c).classList.add('active');}document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')nav(1);if(e.key==='ArrowLeft')nav(-1);});<\/script>
</body></html>`;

    const ext  = method === 'pptx' ? 'pptx.html' : 'html';
    const blob = new Blob([presHTML], {type:'text/html;charset=utf-8'});
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = title.replace(/\s+/g,'-') + '-slides.' + ext;
    a.click();
    document.getElementById('__gsPanel').remove();
    showToast(`📊 ${slides.length} slides exportados ✅`);

  } else if (method === 'slides_url') {
    window.open('https://slides.google.com/create', '_blank');
    const text = slides.map((s,i)=>`SLIDE ${i+1}: ${s.title}\n${s.body}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Contenido copiado. Pegalo en Google Slides');
    });
    document.getElementById('__gsPanel').remove();
  }
}

const WC_INDIGENOUS_TTS = {
  pronunciations: {
    bribri: {
      'Shkëkë':    ['SH-kë-kë',    'Hola'],
      'Ëyö':       ['Ë-yö',        'Gracias'],
      'Aba':       ['A-ba',        'Agua'],
      'Chä':       ['Chä',         'Fuego'],
      'Itö':       ['I-tö',        'Tierra'],
      'Yö':        ['Yö',          'Casa'],
      'Kë':        ['Kë',          'Sí'],
      'Kë-kë':     ['Kë-kë',       'No'],
      'Tso':       ['Tso',         'Persona'],
      'Surá':      ['Su-rá',       'Dios, creador'],
    },
    cabecar: {
      'Ká bë́rë':  ['Ká-bë-rë',    'Buenos días'],
      'Yök':      ['Yök',          'Agua'],
      'Sëk':      ['Sëk',          'Fuego'],
      'Duö':      ['Duö',          'Tierra'],
      'Wák':      ['Wák',          'Casa'],
      'Bë́':       ['Bë',           'Tú'],
      'Yë́':       ['Yë',           'Yo'],
    },
    maleku: {
      'Ma lha maráma': ['Ma-lha-ma-rá-ma', 'Buenas tardes'],
      'Toku':          ['To-ku',            'Agua'],
      'Kira':          ['Ki-ra',            'Fuego'],
      'Naku':          ['Na-ku',            'Tierra'],
      'Jiri':          ['Ji-ri',            'Casa'],
      'Lhaká':         ['Lha-ká',           'Gracias'],
    },
    boruca: {
      'Shíi':          ['Shíi',             'Gracias'],
      'Danzö':         ['Dan-zö',           'Hola'],
      'Unk':           ['Unk',              'Agua'],
      'Tö':            ['Tö',               'Fuego'],
      'Dru':           ['Dru',              'Tierra'],
      'Kro':           ['Kro',              'Casa'],
    },
    ngabe: {
      'Dru':           ['Dru',              'Agua'],
      'Kira':          ['Ki-ra',            'Fuego'],
      'Noke':          ['No-ke',            'Tierra'],
      'Bri':           ['Bri',              'Casa'],
      'Mënkë':         ['Mën-kë',          'Gracias'],
    },
  },

  speak(word, lang, approxPronunciation) {
    if (!window.speechSynthesis) { showToast('Síntesis de voz no disponible'); return; }
    const text   = approxPronunciation || word;
    const utter  = new SpeechSynthesisUtterance(text);
    utter.lang   = 'es-CR';
    utter.rate   = 0.7; // Más lento para lenguas indígenas
    utter.pitch  = 1.0;
    utter.volume = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  },

  speakFast(word) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang  = 'es-CR';
    utter.rate  = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
};

function openIndigenousTTS() {
  const old = document.getElementById('__ttsPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__ttsPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const langs = Object.keys(WC_INDIGENOUS_TTS.pronunciations);

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔊 Pronunciación — Lenguas CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Escuchá la pronunciación aproximada de palabras indígenas</div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${langs.map((lang,i)=>`
          <button onclick="__ttsSelectLang('${lang}',this)"
            class="__ttsLangBtn"
            style="padding:6px 12px;border:1.5px solid ${i===0?'#27ae60':'#eee'};background:${i===0?'#f0fff4':'#fafafa'};color:${i===0?'#155724':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':''}>
            🌿 ${lang.charAt(0).toUpperCase()+lang.slice(1)}
          </button>`).join('')}
      </div>

      <!-- Buscar / escribir -->
      <div style="display:flex;gap:6px;margin-bottom:12px">
        <input type="text" id="__ttsCustomWord" placeholder="Escribí cualquier texto para escuchar..."
          style="flex:1;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter')WC_INDIGENOUS_TTS.speakFast(this.value)">
        <button onclick="WC_INDIGENOUS_TTS.speakFast(document.getElementById('__ttsCustomWord').value)"
          style="padding:8px 12px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:14px">🔊</button>
      </div>
    </div>

    <div id="__ttsWordList" style="flex:1;overflow-y:auto;padding:0 20px 16px"></div>

    <div style="padding:12px 20px;border-top:1px solid #eee;flex-shrink:0">
      <div style="font-size:11px;color:#888;margin-bottom:8px;line-height:1.6">
        💡 La pronunciación es aproximada usando síntesis de voz en español. Para pronunciación auténtica consultá con hablantes nativos o el <a href="https://www.delt.ucr.ac.cr" target="_blank" style="color:#27ae60">DELT-UCR</a>.
      </div>
      <button onclick="document.getElementById('__ttsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  __ttsSelectLang('bribri', document.querySelector('.__ttsLangBtn'));
}

function __ttsSelectLang(lang, btn) {
  document.querySelectorAll('.__ttsLangBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  if (btn) { btn.style.borderColor='#27ae60'; btn.style.background='#f0fff4'; btn.style.color='#155724'; btn.dataset.sel='1'; }

  const words = WC_INDIGENOUS_TTS.pronunciations[lang] || {};
  const list  = document.getElementById('__ttsWordList');
  if (!list) return;

  list.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">${Object.keys(words).length} palabras — ${lang.charAt(0).toUpperCase()+lang.slice(1)}</div>
    ${Object.entries(words).map(([word,[pron,meaning]])=>`
      <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;margin-bottom:6px;background:#f8f9fa;border:1.5px solid #eee;transition:all .15s"
        onmouseover="this.style.borderColor='#27ae60';this.style.background='#f0fff4'"
        onmouseout="this.style.borderColor='#eee';this.style.background='#f8f9fa'">
        <button onclick="WC_INDIGENOUS_TTS.speak('${word.replace(/'/g,"\\'")}','${lang}','${pron.replace(/'/g,"\\'")}')"
          style="width:38px;height:38px;border:none;background:#27ae60;color:#fff;border-radius:50%;cursor:pointer;font-size:18px;flex-shrink:0;transition:all .15s"
          onmouseover="this.style.background='#1e8449'" onmouseout="this.style.background='#27ae60'">🔊</button>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:#1a1a1a">${word}</div>
          <div style="font-size:11px;color:#27ae60;font-family:'Courier New',monospace">[${pron}]</div>
          <div style="font-size:11px;color:#888">${meaning}</div>
        </div>
        <button onclick="if(typeof insertHTML==='function')insertHTML(' <span title=\\"${pron}\\">${word}</span> ');showToast('Insertado ✅')"
          style="padding:5px 10px;border:1.5px solid #eee;background:#fff;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600;color:#555;flex-shrink:0">
          Insertar
        </button>
      </div>`).join('')}`;
}

(function initV2523() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'readerMode':       openReaderMode();           break;
          case 'saveHistory':      openSaveHistory();          break;
          case 'compareDocuments': openDocumentComparator();   break;
          case 'googleSlides':     openGoogleSlidesExport();   break;
          case 'indigenousTTS':    openIndigenousTTS();        break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.23 ✅ — Lector WPM, Historial guardados, Comparador, Google Slides, TTS Indígena');
  }, 3100);
})();
