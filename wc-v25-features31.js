/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.31 — 5 FEATURES
   1. Chatbot legislación CR
   2. Panel de tareas con recordatorios
   3. Análisis de sentimiento del texto
   4. Transcriptor de audio a texto
   5. Integración Trello/Notion style
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 1: CHATBOT LEGISLACIÓN CR
   ═══════════════════════════════════ */

const WC_LEGBOT = {
  history: [],
  leyes: {
    'codigo trabajo': { num:'2', nombre:'Código de Trabajo', url:'https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=8045' },
    'ley arrendamiento': { num:'7527', nombre:'Ley General de Arrendamientos Urbanos y Suburbanos' },
    'codigo civil': { num:'63', nombre:'Código Civil de Costa Rica' },
    'ley contratacion': { num:'7494', nombre:'Ley de Contratación Administrativa' },
    'ley iva': { num:'9635', nombre:'Ley de Fortalecimiento de las Finanzas Públicas (IVA 13%)' },
    'ley pyme': { num:'8262', nombre:'Ley de Fortalecimiento de las Pequeñas y Medianas Empresas' },
    'codigo comercio': { num:'3284', nombre:'Código de Comercio de Costa Rica' },
    'ley consumidor': { num:'7472', nombre:'Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor' },
    'ley datos': { num:'8968', nombre:'Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales' },
    'constitucion': { num:'7', nombre:'Constitución Política de la República de Costa Rica' },
  }
};

function openLegBot() {
  const old = document.getElementById('__legPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__legPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:600px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:14px 18px;border-radius:24px 24px 0 0;flex-shrink:0">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px">⚖️</div>
        <div>
          <div style="font-size:14px;font-weight:700">LexBot CR</div>
          <div style="font-size:10px;opacity:.8">Asistente jurídico · Legislación costarricense</div>
        </div>
        <button onclick="document.getElementById('__legPanel').remove()" style="margin-left:auto;background:none;border:none;color:rgba(255,255,255,.7);font-size:20px;cursor:pointer">✕</button>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <div style="padding:10px 14px;border-bottom:1px solid #eee;flex-shrink:0;overflow-x:auto;scrollbar-width:none">
      <div style="display:flex;gap:6px;white-space:nowrap">
        ${['Código Trabajo','IVA y tributos','Arrendamiento','Contratación pública','Datos personales','PYME CR','Consumidor'].map(t=>`
          <button onclick="__legQuick('${t}')" style="padding:5px 12px;border:1.5px solid #003da5;background:#f0f7ff;color:#003da5;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;flex-shrink:0;transition:all .15s"
            onmouseover="this.style.background='#003da5';this.style.color='#fff'" onmouseout="this.style.background='#f0f7ff';this.style.color='#003da5'">
            ${t}
          </button>`).join('')}
      </div>
    </div>

    <!-- Mensajes -->
    <div id="__legMsgs" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px">
      <div style="align-self:flex-start;background:#f0f7ff;border-radius:14px 14px 14px 4px;padding:12px 14px;max-width:85%;font-size:13px;line-height:1.6;color:#1a1a1a">
        ⚖️ Hola, soy <strong>LexBot CR</strong>. Estoy entrenado en la legislación costarricense.<br>
        Podés preguntarme sobre el <strong>Código de Trabajo, Ley de Arrendamiento, IVA, PYMES, Contratos</strong> y más.<br>
        <small style="color:#888">⚠️ No sustituye asesoría legal profesional.</small>
      </div>
    </div>

    <!-- Input -->
    <div style="padding:10px 14px;border-top:1px solid #eee;flex-shrink:0;display:flex;gap:8px;align-items:flex-end">
      <textarea id="__legInput" placeholder="Preguntá sobre legislación CR..." rows="1"
        style="flex:1;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:20px;font-size:13px;outline:none;resize:none;max-height:80px;font-family:inherit;overflow-y:auto"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();__legSend()}"
        oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,80)+'px'"></textarea>
      <button onclick="__legSend()" style="width:40px;height:40px;border:none;background:#003da5;color:#fff;border-radius:50%;cursor:pointer;font-size:18px;flex-shrink:0">→</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  WC_LEGBOT.history = [];
}

function __legQuick(topic) {
  const inp = document.getElementById('__legInput');
  if (inp) { inp.value = `¿Qué dice la ley costarricense sobre ${topic}?`; }
  __legSend();
}

async function __legSend() {
  const key  = localStorage.getItem('wc-groq-key');
  const inp  = document.getElementById('__legInput');
  const msgs = document.getElementById('__legMsgs');
  const text = inp?.value.trim();
  if (!text||!msgs) return;
  if (!key) { showToast('Configurá tu API Key de Groq'); return; }
  inp.value = '';
  inp.style.height = 'auto';

  // Mensaje del usuario
  const userDiv = document.createElement('div');
  userDiv.style.cssText = 'align-self:flex-end;background:#003da5;color:#fff;border-radius:14px 14px 4px 14px;padding:10px 14px;max-width:80%;font-size:13px;line-height:1.6';
  userDiv.textContent = text;
  msgs.appendChild(userDiv);
  msgs.scrollTop = 99999;

  // Indicador de escritura
  const typing = document.createElement('div');
  typing.style.cssText = 'align-self:flex-start;background:#f0f7ff;border-radius:14px;padding:10px 14px;font-size:13px;color:#aaa';
  typing.textContent = '⚖️ Consultando legislación CR...';
  msgs.appendChild(typing);
  msgs.scrollTop = 99999;

  // Detectar leyes mencionadas
  const textLow = text.toLowerCase();
  const leyMencionada = Object.entries(WC_LEGBOT.leyes).find(([key]) => textLow.includes(key.split(' ')[0]));
  const contextoLey = leyMencionada ? `Ley N° ${leyMencionada[1].num}: ${leyMencionada[1].nombre}.` : '';

  WC_LEGBOT.history.push({ role:'user', content:text });

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST', headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[
          { role:'system', content:`Sos LexBot CR, un asistente jurídico especializado en la legislación de Costa Rica. Conocés a fondo:
- Código de Trabajo (Ley N° 2): preaviso, cesantía, jornadas, vacaciones, aguinaldo
- Ley de Arrendamiento N° 7527: derechos del inquilino y arrendador
- Código Civil N° 63: contratos, obligaciones, propiedad
- Ley de Contratación Administrativa N° 7494 y SICOP
- Ley IVA (Ley N° 9635): tarifas 13%, 4%, 2%, exenciones
- Ley PYME N° 8262: beneficios, MEIC, registro
- Ley de Protección de Datos N° 8968: PRODHAB
- Código de Comercio N° 3284: sociedades, comerciantes
- Constitución Política
- Resoluciones de la Sala Constitucional, Sala Segunda, Sala Tercera

Respondés en español costarricense. Citás el artículo específico cuando es posible. Aclarás siempre que no sustituís asesoría legal profesional.${contextoLey?' Contexto específico: '+contextoLey:''}`
          },
          ...WC_LEGBOT.history.slice(-6)
        ],
        temperature:0.2, max_tokens:800
      })
    });
    const d    = await r.json();
    const reply= d?.choices?.[0]?.message?.content||'No pude procesar tu consulta.';

    typing.remove();
    WC_LEGBOT.history.push({ role:'assistant', content:reply });

    const botDiv = document.createElement('div');
    botDiv.style.cssText='align-self:flex-start;background:#f0f7ff;border-radius:14px 14px 14px 4px;padding:12px 14px;max-width:88%;font-size:13px;line-height:1.7;color:#1a1a1a';
    botDiv.innerHTML = reply.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');

    // Botón insertar
    const insBtn = document.createElement('button');
    insBtn.textContent='📥 Insertar en documento';
    insBtn.style.cssText='margin-top:8px;padding:5px 12px;border:none;background:#003da5;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;display:block';
    insBtn.onclick=()=>{
      if(typeof insertHTML==='function') insertHTML(`<div style="background:#f0f7ff;border-left:4px solid #003da5;border-radius:0 8px 8px 0;padding:12px 16px;margin:10px 0;font-size:11pt"><strong>⚖️ Consulta jurídica CR:</strong> ${text}<br><br>${reply.replace(/\n/g,'<br>')}<br><small style="color:#aaa">LexBot CR — No sustituye asesoría legal</small></div>`);
      showToast('Respuesta insertada ✅');
    };
    botDiv.appendChild(insBtn);
    msgs.appendChild(botDiv);
    msgs.scrollTop=99999;
  } catch(e) {
    typing.remove();
    showToast('Error: '+e.message);
  }
}


/* ═══════════════════════════════════
   FEATURE 2: PANEL DE TAREAS CON RECORDATORIOS
   ═══════════════════════════════════ */

const WC_TASKS = {
  tasks: JSON.parse(localStorage.getItem('wc-tasks')||'[]'),
  save() { localStorage.setItem('wc-tasks', JSON.stringify(this.tasks)); },
  add(task) { this.tasks.unshift({...task, id:'tk'+Date.now(), done:false, created:Date.now()}); this.save(); },
  toggle(id) { const t=this.tasks.find(t=>t.id===id); if(t){t.done=!t.done; this.save();} },
  delete(id) { this.tasks=this.tasks.filter(t=>t.id!==id); this.save(); },
  overdue() { const now=Date.now(); return this.tasks.filter(t=>!t.done&&t.due&&new Date(t.due).getTime()<now); },
  today() { const d=new Date().toDateString(); return this.tasks.filter(t=>!t.done&&t.due&&new Date(t.due).toDateString()===d); },
  checkReminders() {
    const due = this.today();
    if (due.length && 'Notification' in window && Notification.permission==='granted') {
      due.forEach(t=>{
        if(!t._notified){
          new Notification('📋 Tarea pendiente hoy — WC Editor',{body:t.text,icon:'📋'});
          t._notified=true;
        }
      });
    }
  }
};

function openTasksPanel() {
  const old = document.getElementById('__taskPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__taskPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center';

  if ('Notification' in window && Notification.permission==='default') Notification.requestPermission();

  ov.innerHTML = `
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div>
          <div style="font-size:17px;font-weight:700;color:#1a2942">📋 Tareas</div>
          <div style="font-size:11px;color:#888">${WC_TASKS.tasks.filter(t=>!t.done).length} pendientes · ${WC_TASKS.overdue().length} vencidas</div>
        </div>
        <button onclick="__taskAdd()" style="padding:8px 14px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">+ Agregar</button>
      </div>

      <!-- Filtros -->
      <div style="display:flex;gap:6px;margin-bottom:12px">
        ${[['all','Todas'],['today','Hoy'],['overdue','Vencidas'],['done','Hechas']].map(([v,l],i)=>`
          <button onclick="__taskFilter('${v}',this)" class="__taskFilterBtn"
            style="padding:5px 12px;border:1.5px solid ${i===0?'#0084ff':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};color:${i===0?'#0084ff':'#555'};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':''}>
            ${l}
          </button>`).join('')}
      </div>
    </div>

    <div id="__taskList" style="flex:1;overflow-y:auto;padding:0 18px 20px"></div>

    <div style="padding:10px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__taskPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  __taskRender('all');
}

function __taskRender(filter) {
  const list = document.getElementById('__taskList');
  if (!list) return;
  let tasks = WC_TASKS.tasks;
  const now = Date.now();
  if (filter==='today')   tasks=WC_TASKS.today();
  if (filter==='overdue') tasks=WC_TASKS.overdue();
  if (filter==='done')    tasks=tasks.filter(t=>t.done);
  if (filter==='all')     tasks=tasks.filter(t=>!t.done);

  const prioColors={high:'#e74c3c',medium:'#f39c12',low:'#27ae60'};
  const prioLabel ={high:'Alta',medium:'Media',low:'Baja'};

  if (!tasks.length) {
    list.innerHTML='<div style="text-align:center;padding:30px;color:#bbb"><div style="font-size:32px;margin-bottom:8px">✅</div><div style="font-size:13px">'+(filter==='done'?'Sin tareas completadas':'Sin tareas pendientes')+'</div></div>';
    return;
  }

  list.innerHTML = tasks.map(t => {
    const isOverdue = !t.done && t.due && new Date(t.due).getTime() < now;
    const dueStr    = t.due ? new Date(t.due).toLocaleDateString('es-CR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
    return `
    <div style="display:flex;align-items:flex-start;gap:10px;padding:11px;border-radius:12px;margin-bottom:6px;border:1.5px solid ${isOverdue?'#fde8e8':t.done?'#d4edda':'#eee'};background:${isOverdue?'#fff8f8':t.done?'#f8fff9':'#fff'};transition:all .15s">
      <button onclick="WC_TASKS.toggle('${t.id}');__taskFilter(document.querySelector('[data-sel]')?.__taskFilter||'all',document.querySelector('.__taskFilterBtn[data-sel]'))" style="width:22px;height:22px;border:2px solid ${t.done?'#27ae60':prioColors[t.priority]||'#ddd'};border-radius:50%;background:${t.done?'#27ae60':'transparent'};cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;margin-top:1px">
        ${t.done?'✓':''}
      </button>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:${t.done?'#aaa':'#1a1a1a'};${t.done?'text-decoration:line-through':''};line-height:1.4">${t.text}</div>
        <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
          ${t.priority?`<span style="font-size:9px;background:${prioColors[t.priority]}22;color:${prioColors[t.priority]};border-radius:4px;padding:1px 6px;font-weight:600">${prioLabel[t.priority]}</span>`:''}
          ${t.category?`<span style="font-size:9px;background:#f0f0f0;color:#888;border-radius:4px;padding:1px 6px">${t.category}</span>`:''}
          ${dueStr?`<span style="font-size:9px;color:${isOverdue?'#e74c3c':'#888'};font-weight:${isOverdue?'700':'400'}">⏰ ${dueStr}${isOverdue?' (vencida)':''}</span>`:''}
        </div>
      </div>
      <button onclick="WC_TASKS.delete('${t.id}');__taskFilter('all',document.querySelector('.__taskFilterBtn[data-sel]'))" style="background:none;border:none;color:#ddd;cursor:pointer;font-size:16px;flex-shrink:0;padding:0" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#ddd'">×</button>
    </div>`;
  }).join('');

  window.__taskCurrentFilter = filter;
}

function __taskFilter(filter, btn) {
  document.querySelectorAll('.__taskFilterBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  if (btn) { btn.style.borderColor='#0084ff'; btn.style.background='#f0f7ff'; btn.style.color='#0084ff'; btn.dataset.sel='1'; btn.__taskFilter=filter; }
  __taskRender(filter);
}

function __taskAdd() {
  const old = document.getElementById('__taskAddPanel'); if (old) old.remove();
  const panel = document.createElement('div');
  panel.id = '__taskAddPanel';
  panel.style.cssText='position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:560px;z-index:100001;background:#fff;border-radius:20px 20px 0 0;padding:20px;box-shadow:0 -8px 30px rgba(0,0,0,.15)';
  panel.innerHTML=`
    <div style="font-size:15px;font-weight:700;color:#1a2942;margin-bottom:12px">Nueva tarea</div>
    <input type="text" id="__taskNewText" placeholder="¿Qué tenés que hacer?" autofocus
      style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px"
      onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
      onkeydown="if(event.key==='Enter')__taskSave()">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Prioridad</label>
        <select id="__taskNewPrio" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
          <option value="high">Alta</option>
          <option value="medium" selected>Media</option>
          <option value="low">Baja</option>
        </select>
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Categoría</label>
        <select id="__taskNewCat" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
          <option>Personal</option><option>Trabajo</option><option>Estudio</option><option>CR Trámites</option><option>Proyecto</option>
        </select>
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Vencimiento</label>
        <input type="datetime-local" id="__taskNewDue" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:8px;font-size:11px;outline:none;box-sizing:border-box">
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__taskAddPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__taskSave()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">+ Agregar tarea</button>
    </div>`;
  document.body.appendChild(panel);
  setTimeout(()=>document.getElementById('__taskNewText')?.focus(),100);
}

function __taskSave() {
  const text = document.getElementById('__taskNewText')?.value.trim();
  const prio = document.getElementById('__taskNewPrio')?.value || 'medium';
  const cat  = document.getElementById('__taskNewCat')?.value  || '';
  const due  = document.getElementById('__taskNewDue')?.value  || '';
  if (!text) { showToast('Ingresá el texto de la tarea'); return; }
  WC_TASKS.add({ text, priority:prio, category:cat, due });
  document.getElementById('__taskAddPanel').remove();
  __taskRender(window.__taskCurrentFilter||'all');
  showToast('✅ Tarea agregada');
}

// Verificar recordatorios cada minuto
setInterval(()=>WC_TASKS.checkReminders(), 60000);


/* ═══════════════════════════════════
   FEATURE 3: ANÁLISIS DE SENTIMIENTO
   ═══════════════════════════════════ */

function openSentimentAnalysis() {
  const old = document.getElementById('__sentPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  const text = ed ? ed.innerText.trim() : '';
  const ov  = document.createElement('div');
  ov.id = '__sentPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎭 Análisis de sentimiento</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Tono, emoción y estilo del texto</div>
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto a analizar</label>
        <textarea id="__sentText" rows="5"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">${text.slice(0,1000)}</textarea>
      </div>
      <div id="__sentProgress" style="display:none;text-align:center;color:#0084ff;font-size:13px;padding:8px">🎭 Analizando...</div>
    </div>
    <div id="__sentResults" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>
    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__sentPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runSentiment(false)" style="flex:1;padding:10px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">🔍 Local</button>
      <button onclick="__runSentiment(true)" style="flex:1;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">🦙 IA</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runSentiment(useAI) {
  const text  = document.getElementById('__sentText')?.value.trim();
  const prog  = document.getElementById('__sentProgress');
  const res   = document.getElementById('__sentResults');
  if (!text||text.length<20) { showToast('Ingresá texto para analizar'); return; }
  if (prog) prog.style.display='block';

  // Análisis local
  const words   = text.toLowerCase().split(/\s+/);
  const positivos=['bueno','excelente','feliz','alegre','bien','perfecto','maravilloso','increíble','éxito','logro','oportunidad','gracias','amor','esperanza','positivo','favorable','beneficio','mejora'];
  const negativos=['malo','terrible','difícil','problema','fracaso','error','falla','negativo','peor','crisis','conflicto','preocupación','riesgo','daño','pérdida','miedo','triste','dolor'];
  const formales=['mediante','por tanto','en virtud','considerando','en consecuencia','por lo anterior','con base en','en atención','se hace constar','de conformidad'];
  const informales=['mae','pura vida','tuanis','birra','jupa','chiva','chunche'];

  let posCount=0, negCount=0, formalCount=0, informalCount=0;
  words.forEach(w=>{
    const clean=w.replace(/[^a-záéíóúüñ]/gi,'');
    if(positivos.some(p=>clean.includes(p))) posCount++;
    if(negativos.some(n=>clean.includes(n))) negCount++;
  });
  formales.forEach(f=>{ if(text.toLowerCase().includes(f)) formalCount++; });
  informales.forEach(f=>{ if(text.toLowerCase().includes(f)) informalCount++; });

  const total   = Math.max(1, posCount+negCount);
  const sentScore = posCount/(total)*100;
  const sentLabel = sentScore>60?'Positivo':sentScore<40?'Negativo':'Neutral';
  const sentColor = sentScore>60?'#27ae60':sentScore<40?'#e74c3c':'#f39c12';
  const sentEmoji = sentScore>60?'😊':sentScore<40?'😔':'😐';
  const tono      = formalCount>2?'Formal/Académico':informalCount>1?'Informal/Coloquial':'Neutro';
  const wCount    = words.length;
  const sCount    = text.split(/[.!?]+/).filter(s=>s.trim()).length;
  const avgSentLen= sCount?Math.round(wCount/sCount):0;

  let aiResult='';
  if (useAI) {
    const key = localStorage.getItem('wc-groq-key');
    if (key) {
      try {
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
          method:'POST', headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
          body:JSON.stringify({
            model:'llama-3.3-70b-versatile',
            messages:[{role:'system',content:'Analizás el sentimiento, tono y emoción de textos en español. Respondés en JSON con: sentimiento (positivo/negativo/neutral), confianza (0-100), emociones (array), tono (formal/informal/neutro), sugerencias (array de mejoras). Solo JSON, sin markdown.'},{role:'user',content:'Analizá: '+text.slice(0,1500)}],
            temperature:0.1, max_tokens:400
          })
        });
        const d=await r.json();
        const raw=d?.choices?.[0]?.message?.content||'{}';
        try { aiResult=JSON.parse(raw.replace(/```json|```/g,'').trim()); } catch(e){ aiResult={}; }
      } catch(e){}
    }
  }

  if (prog) prog.style.display='none';
  if (res)  res.style.display='block';

  res.innerHTML=`
    <div style="padding:10px 0">
      <!-- Score principal -->
      <div style="text-align:center;padding:16px;background:${sentColor}10;border-radius:12px;margin-bottom:12px">
        <div style="font-size:40px;margin-bottom:6px">${sentEmoji}</div>
        <div style="font-size:22px;font-weight:900;color:${sentColor}">${aiResult.sentimiento||sentLabel}</div>
        <div style="font-size:12px;color:#888;margin-top:3px">Confianza: ${aiResult.confianza||Math.round(Math.abs(sentScore-50)*2)}%</div>
      </div>

      <!-- Métricas -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        ${[['😊 Positivas',posCount,'#27ae60'],['😔 Negativas',negCount,'#e74c3c'],['📝 Tono',tono,'#0084ff']].map(([l,v,c])=>`
          <div style="background:#f8f9fa;border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:14px;font-weight:700;color:${c}">${v}</div>
            <div style="font-size:9px;color:#aaa;margin-top:2px">${l}</div>
          </div>`).join('')}
      </div>

      <!-- Emociones IA -->
      ${aiResult.emociones?.length?`
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Emociones detectadas</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${aiResult.emociones.map(e=>`<span style="background:#f0f7ff;border:1px solid #c0d8f0;border-radius:20px;padding:3px 10px;font-size:11px;color:#003da5">${e}</span>`).join('')}
          </div>
        </div>`:''
      }

      <!-- Estadísticas -->
      <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px;font-size:12px;line-height:1.8;color:#555">
        Palabras: <strong>${wCount}</strong> · Oraciones: <strong>${sCount}</strong> · Promedio/oración: <strong>${avgSentLen}</strong>
        ${formalCount>0?`<br>Expresiones formales detectadas: <strong>${formalCount}</strong>`:''}
        ${informalCount>0?`<br>Expresiones coloquiales CR: <strong>${informalCount}</strong>`:''}
      </div>

      <!-- Sugerencias IA -->
      ${aiResult.sugerencias?.length?`
        <div style="margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">💡 Sugerencias</div>
          ${aiResult.sugerencias.map(s=>`<div style="background:#fff9e6;border-radius:8px;padding:8px 10px;margin-bottom:4px;font-size:12px;color:#856404">• ${s}</div>`).join('')}
        </div>`:''
      }

      <button onclick="__sentInsert()" style="width:100%;padding:9px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📋 Insertar reporte</button>
    </div>`;

  window.__sentData = { sentLabel:aiResult.sentimiento||sentLabel, sentColor, sentEmoji, posCount, negCount, tono, wCount, aiResult };
}

function __sentInsert() {
  const d = window.__sentData;
  if (!d) return;
  const html=`<div style="background:${d.sentColor}10;border:2px solid ${d.sentColor};border-radius:10px;padding:12px;margin:10px 0;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:13pt;font-weight:700;color:${d.sentColor}">${d.sentEmoji} Análisis de sentimiento: ${d.sentLabel}</div>
    <div style="font-size:10pt;color:#555;margin-top:4px">Palabras positivas: ${d.posCount} · Negativas: ${d.negCount} · Tono: ${d.tono} · ${d.wCount} palabras</div>
    ${d.aiResult?.emociones?.length?`<div style="font-size:10pt;color:#555">Emociones: ${d.aiResult.emociones.join(', ')}</div>`:''}
    <div style="font-size:8pt;color:#aaa;margin-top:6px">WC Corporate Editor · ${new Date().toLocaleString('es-CR')}</div>
  </div>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__sentPanel').remove();
  showToast('🎭 Reporte insertado ✅');
}


/* ═══════════════════════════════════
   FEATURE 4: TRANSCRIPTOR DE AUDIO
   ═══════════════════════════════════ */

const WC_TRANSCRIBER = {
  recognition: null,
  transcript:  '',
  active:      false,
  chunks:      [],

  init(lang) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return false;
    this.recognition = new SR();
    this.recognition.lang = lang || 'es-CR';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    return true;
  },

  start(lang) {
    if (!this.init(lang)) { showToast('Reconocimiento de voz no disponible'); return false; }
    this.active = true;
    this.transcript = '';
    this.chunks = [];

    this.recognition.onresult = e => {
      let interim='', final='';
      for (let i=e.resultIndex;i<e.results.length;i++) {
        if (e.results[i].isFinal) { final+=e.results[i][0].transcript; this.chunks.push(e.results[i][0].transcript); }
        else interim+=e.results[i][0].transcript;
      }
      if (final) this.transcript+=final+' ';
      const liveEl = document.getElementById('__transcLive');
      if (liveEl) liveEl.textContent=(this.transcript+interim).slice(-300);
      const countEl = document.getElementById('__transcCount');
      if (countEl) countEl.textContent=this.transcript.trim().split(/\s+/).filter(w=>w).length+' palabras';
    };

    this.recognition.onerror = e => { showToast('Error: '+e.error); this.stop(); };
    this.recognition.onend = () => { if (this.active) this.recognition.start(); };
    this.recognition.start();
    return true;
  },

  stop() {
    this.active=false;
    if (this.recognition) this.recognition.stop();
  },

  getFormatted(format) {
    const text = this.transcript.trim();
    if (!text) return '';
    if (format==='raw')    return text;
    if (format==='parrafos') {
      return text.split(/\.\s+/).filter(s=>s.trim()).map(s=>s.charAt(0).toUpperCase()+s.slice(1)+'.').join('\n\n');
    }
    if (format==='bullets') {
      return text.split(/[.!?]+/).filter(s=>s.trim().length>5).map(s=>'• '+s.trim()).join('\n');
    }
    return text;
  }
};

function openTranscriber() {
  const old = document.getElementById('__transcPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__transcPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px';

  const langs=[['es-CR','🇨🇷 Español CR'],['es-ES','🇪🇸 Español ES'],['en-US','🇺🇸 English'],['pt-BR','🇧🇷 Português'],['fr-FR','🇫🇷 Français'],['de-DE','🇩🇪 Deutsch']];

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎙️ Transcriptor de audio</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Hablá y el texto aparece automáticamente</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma</label>
        <select id="__transcLang" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          ${langs.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Formato de salida</label>
        <select id="__transcFormat" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="parrafos">Párrafos</option>
          <option value="raw">Texto continuo</option>
          <option value="bullets">Lista de puntos</option>
        </select>
      </div>
    </div>

    <!-- Área de transcripción en vivo -->
    <div style="background:#f8f9fa;border-radius:12px;padding:14px;margin-bottom:14px;min-height:120px;position:relative">
      <div id="__transcLive" style="font-size:13px;color:#555;line-height:1.7;min-height:80px">Presioná Iniciar y empezá a hablar...</div>
      <div style="position:absolute;bottom:8px;right:10px;font-size:10px;color:#aaa" id="__transcCount">0 palabras</div>
    </div>

    <!-- Controles -->
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button id="__transcStartBtn" onclick="__transcStart()" style="flex:2;padding:12px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">🎙️ Iniciar</button>
      <button onclick="__transcStop()" style="flex:1;padding:12px;border:1.5px solid #e0e0e0;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">⏹ Detener</button>
      <button onclick="WC_TRANSCRIBER.transcript='';WC_TRANSCRIBER.chunks=[];document.getElementById('__transcLive').textContent='Limpiar...';document.getElementById('__transcCount').textContent='0 palabras'" style="flex:1;padding:12px;border:1.5px solid #eee;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#aaa">🗑</button>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__transcPanel').remove();WC_TRANSCRIBER.stop()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__transcInsert()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📥 Insertar texto</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov){WC_TRANSCRIBER.stop();ov.remove();}});
}

function __transcStart() {
  const lang = document.getElementById('__transcLang')?.value||'es-CR';
  const btn  = document.getElementById('__transcStartBtn');
  if (WC_TRANSCRIBER.active) {
    WC_TRANSCRIBER.stop();
    if(btn){btn.textContent='🎙️ Iniciar';btn.style.background='#e74c3c';}
    return;
  }
  if (WC_TRANSCRIBER.start(lang)) {
    if(btn){btn.textContent='⏸ Pausar';btn.style.background='#f39c12';}
    showToast('🎙️ Transcribiendo — hablá ahora');
  }
}

function __transcStop() {
  WC_TRANSCRIBER.stop();
  const btn=document.getElementById('__transcStartBtn');
  if(btn){btn.textContent='🎙️ Iniciar';btn.style.background='#e74c3c';}
}

function __transcInsert() {
  const format = document.getElementById('__transcFormat')?.value||'parrafos';
  const text   = WC_TRANSCRIBER.getFormatted(format);
  if (!text) { showToast('Sin transcripción — iniciá y hablá primero'); return; }
  WC_TRANSCRIBER.stop();
  if(typeof insertHTML==='function') {
    const html=format==='bullets'
      ?'<ul>'+text.split('\n').filter(l=>l.trim()).map(l=>`<li>${l.replace('• ','')}</li>`).join('')+'</ul>'
      :text.split('\n\n').filter(p=>p.trim()).map(p=>`<p>${p}</p>`).join('');
    insertHTML(html);
  }
  document.getElementById('__transcPanel').remove();
  showToast('📝 Transcripción insertada ✅');
}


/* ═══════════════════════════════════
   FEATURE 5: INTEGRACIÓN TRELLO STYLE
   ═══════════════════════════════════ */

const WC_PROJECTS = {
  data: JSON.parse(localStorage.getItem('wc-projects')||'null') || {
    projects: [
      { id:'p1', name:'WC Editor v25', color:'#003da5', tasks:[
        {id:'pt1',text:'Publicar en GitHub Pages',done:true},
        {id:'pt2',text:'Agregar features 31',done:false},
        {id:'pt3',text:'Optimizar bundles',done:false},
      ]},
      { id:'p2', name:'Cliente ABC', color:'#27ae60', tasks:[
        {id:'pt4',text:'Entregar propuesta',done:false},
        {id:'pt5',text:'Reunión de seguimiento',done:false},
      ]},
    ]
  },
  save() { localStorage.setItem('wc-projects',JSON.stringify(this.data)); },
  addProject(name,color){ this.data.projects.push({id:'p'+Date.now(),name,color:color||'#0084ff',tasks:[]}); this.save(); },
  addTask(pid,text){ const p=this.data.projects.find(p=>p.id===pid); if(p){p.tasks.push({id:'pt'+Date.now(),text,done:false});} this.save(); },
  toggleTask(pid,tid){ const p=this.data.projects.find(p=>p.id===pid); const t=p?.tasks.find(t=>t.id===tid); if(t)t.done=!t.done; this.save(); },
  deleteTask(pid,tid){ const p=this.data.projects.find(p=>p.id===pid); if(p)p.tasks=p.tasks.filter(t=>t.id!==tid); this.save(); },
  deleteProject(pid){ this.data.projects=this.data.projects.filter(p=>p.id!==pid); this.save(); },
};

function openProjects() {
  const old = document.getElementById('__projPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__projPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,"Segoe UI",sans-serif';

  const render=()=>{
    const box=document.getElementById('__projBoards');
    if(!box) return;
    box.innerHTML=WC_PROJECTS.data.projects.map(p=>{
      const done=p.tasks.filter(t=>t.done).length;
      const pct=p.tasks.length?Math.round(done/p.tasks.length*100):0;
      return `
      <div style="background:#fff;border-radius:16px;min-width:240px;max-width:280px;flex-shrink:0;box-shadow:0 2px 12px rgba(0,0,0,.1);overflow:hidden">
        <div style="background:${p.color};padding:12px 14px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:13px;font-weight:700;color:#fff">${p.name}</div>
          <div style="display:flex;gap:4px;align-items:center">
            <span style="background:rgba(255,255,255,.2);color:#fff;font-size:10px;border-radius:10px;padding:2px 7px">${done}/${p.tasks.length}</span>
            <button onclick="WC_PROJECTS.deleteProject('${p.id}');__projRender()" style="background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;font-size:14px;padding:0">×</button>
          </div>
        </div>
        <!-- Barra de progreso -->
        <div style="height:4px;background:#f0f0f0"><div style="height:100%;width:${pct}%;background:${p.color};transition:width .3s"></div></div>
        <div style="padding:10px;max-height:300px;overflow-y:auto">
          ${p.tasks.map(t=>`
            <div style="display:flex;align-items:center;gap:8px;padding:7px;border-radius:8px;margin-bottom:4px;background:${t.done?'#f0fff4':'#fafafa'};border:1px solid ${t.done?'#a8d8b8':'#eee'}">
              <button onclick="WC_PROJECTS.toggleTask('${p.id}','${t.id}');__projRender()" style="width:18px;height:18px;border:2px solid ${t.done?p.color:'#ddd'};border-radius:50%;background:${t.done?p.color:'transparent'};cursor:pointer;flex-shrink:0;font-size:10px;color:#fff">${t.done?'✓':''}</button>
              <span style="flex:1;font-size:12px;color:${t.done?'#aaa':'#333'};${t.done?'text-decoration:line-through':''}">${t.text}</span>
              <button onclick="WC_PROJECTS.deleteTask('${p.id}','${t.id}');__projRender()" style="background:none;border:none;color:#ddd;cursor:pointer;font-size:13px;padding:0" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#ddd'">×</button>
            </div>`).join('')}
          <button onclick="__projAddTask('${p.id}')" style="width:100%;padding:7px;border:2px dashed #ddd;background:transparent;border-radius:8px;cursor:pointer;font-size:11px;color:#aaa;transition:all .15s" onmouseover="this.style.borderColor='${p.color}';this.style.color='${p.color}'" onmouseout="this.style.borderColor='#ddd';this.style.color='#aaa'">+ Agregar tarea</button>
        </div>
      </div>`;
    }).join('')+`
    <div style="min-width:220px;display:flex;flex-direction:column;justify-content:center">
      <button onclick="__projAddProject()" style="padding:14px;border:2px dashed rgba(255,255,255,.3);background:transparent;border-radius:14px;cursor:pointer;color:rgba(255,255,255,.6);font-size:13px;transition:all .15s" onmouseover="this.style.borderColor='rgba(255,255,255,.6)';this.style.color='#fff'" onmouseout="this.style.borderColor='rgba(255,255,255,.3)';this.style.color='rgba(255,255,255,.6)'">+ Nuevo proyecto</button>
    </div>`;
  };

  ov.innerHTML=`
    <div style="background:#1a2942;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">🗂️ Proyectos</div>
      <button onclick="__projInsert()" style="padding:5px 12px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">📋 Insertar en doc</button>
      <button onclick="document.getElementById('__projPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">✕</button>
    </div>
    <div id="__projBoards" style="flex:1;overflow-x:auto;overflow-y:hidden;padding:16px;display:flex;gap:12px;align-items:flex-start;background:linear-gradient(135deg,#1a2942,#003da5)"></div>`;

  document.body.appendChild(ov);
  window.__projRender = render;
  render();
}

function __projAddTask(pid) {
  const t=prompt('Nueva tarea:','');
  if(!t) return;
  WC_PROJECTS.addTask(pid,t);
  if(window.__projRender) window.__projRender();
}

function __projAddProject() {
  const name=prompt('Nombre del proyecto:','');
  if(!name) return;
  const colors=['#003da5','#27ae60','#e74c3c','#9b59b6','#f39c12','#0084ff'];
  WC_PROJECTS.addProject(name,colors[Math.floor(Math.random()*colors.length)]);
  if(window.__projRender) window.__projRender();
}

function __projInsert() {
  let html=`<div style="font-family:Calibri,Arial,sans-serif;margin:12px 0"><h3 style="color:#1a2942;margin-bottom:12px">🗂️ Estado de proyectos — ${new Date().toLocaleDateString('es-CR')}</h3>`;
  WC_PROJECTS.data.projects.forEach(p=>{
    const done=p.tasks.filter(t=>t.done).length;
    const pct=p.tasks.length?Math.round(done/p.tasks.length*100):0;
    html+=`<div style="margin-bottom:14px;border:1px solid #eee;border-radius:10px;overflow:hidden">
      <div style="background:${p.color};color:#fff;padding:8px 12px;font-weight:700">${p.name} — ${done}/${p.tasks.length} (${pct}%)</div>
      <div style="height:4px;background:#f0f0f0"><div style="height:100%;width:${pct}%;background:${p.color}"></div></div>
      <ul style="margin:8px 0;padding-left:24px">${p.tasks.map(t=>`<li style="color:${t.done?'#aaa':'#333'};${t.done?'text-decoration:line-through':''}">${t.text}</li>`).join('')}</ul>
    </div>`;
  });
  html+='</div>';
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__projPanel').remove();
  showToast('🗂️ Proyectos insertados ✅');
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2531() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'legBot':          openLegBot();              break;
          case 'tasksPanel':      openTasksPanel();          break;
          case 'sentiment':       openSentimentAnalysis();   break;
          case 'transcriber':     openTranscriber();         break;
          case 'projects':        openProjects();            break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.31 ✅ — LexBot CR, Tareas, Sentimiento, Transcriptor, Proyectos');
  }, 3900);
})();
