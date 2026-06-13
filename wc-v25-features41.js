/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.41 — 5 FEATURES IA AVANZADA
   6. Resumidor automático de documentos largos
   7. Detector de plagio básico
   8. Generador de preguntas desde el texto
   9. Corrector de estilo APA avanzado
   10. Chatbot entrenado en el documento
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 6: RESUMIDOR AUTOMÁTICO
   ═══════════════════════════════════ */

function openDocSummarizer() {
  const old = document.getElementById('__sumPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  const ov  = document.createElement('div');
  ov.id = '__sumPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const wordCount = ed ? ed.innerText.trim().split(/\s+/).filter(w=>w).length : 0;

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📝 Resumidor automático</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Documento: <strong>${wordCount} palabras</strong> · Groq LLaMA 3.3</div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de resumen</label>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${[
            ['ejecutivo',  '📊 Resumen ejecutivo',     'Para directivos: puntos clave y conclusiones'],
            ['bullets',    '• Puntos principales',      'Lista de ideas más importantes'],
            ['parrafo',    '¶ Párrafo único',           'Síntesis en 2-3 oraciones'],
            ['academico',  '🎓 Resumen académico',      'Introducción, metodología, resultados'],
            ['acta',       '📋 Estilo acta',            'Formato de acta con acuerdos'],
          ].map(([v,l,desc],i)=>`
            <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid ${i===0?'#0084ff':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};border-radius:10px;transition:all .15s">
              <input type="radio" name="__sumType" value="${v}" ${i===0?'checked':''} style="accent-color:#0084ff;margin-top:2px">
              <div>
                <div style="font-size:13px;font-weight:600;color:#1a1a1a">${l}</div>
                <div style="font-size:11px;color:#888">${desc}</div>
              </div>
            </label>`).join('')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Extensión</label>
          <select id="__sumLength" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="corto">Corto (50-100 palabras)</option>
            <option value="medio" selected>Medio (150-250 palabras)</option>
            <option value="largo">Largo (300-400 palabras)</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma de salida</label>
          <select id="__sumLang" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="español" selected>🇨🇷 Español</option>
            <option value="inglés">🇺🇸 Inglés</option>
            <option value="portugués">🇧🇷 Portugués</option>
          </select>
        </div>
      </div>

      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
        <input type="checkbox" id="__sumInsert" checked style="accent-color:#0084ff"> Insertar al inicio del documento
      </label>
    </div>

    <div id="__sumProgress" style="display:none;background:#f0f7ff;border-radius:8px;padding:10px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
      ⏳ Generando resumen...
    </div>
    <div id="__sumResult" style="display:none;background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px;max-height:200px;overflow-y:auto;font-size:12px;line-height:1.7;color:#333"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__sumPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runSummarizer()" id="__sumBtn" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📝 Resumir documento</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runSummarizer() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const ed   = document.getElementById('editor');
  if (!ed)   return;

  const text   = ed.innerText.trim().slice(0, 6000);
  const type   = document.querySelector('[name="__sumType"]:checked')?.value || 'ejecutivo';
  const length = document.getElementById('__sumLength')?.value || 'medio';
  const lang   = document.getElementById('__sumLang')?.value || 'español';
  const insert = document.getElementById('__sumInsert')?.checked;

  const prog = document.getElementById('__sumProgress');
  const res  = document.getElementById('__sumResult');
  const btn  = document.getElementById('__sumBtn');
  if (prog) prog.style.display='block';
  if (btn)  btn.disabled=true;

  const prompts = {
    ejecutivo: `Generá un resumen ejecutivo en ${lang} del siguiente texto. Incluye: puntos clave, conclusiones principales y recomendaciones. Extensión ${length}.`,
    bullets:   `Extraé los ${length==='corto'?5:length==='medio'?8:12} puntos más importantes del siguiente texto en ${lang}. Formato: lista con viñetas.`,
    parrafo:   `Resumí el siguiente texto en ${lang} en ${length==='corto'?'1 oración':length==='medio'?'2-3 oraciones':'un párrafo'}.`,
    academico: `Generá un resumen académico en ${lang} con las secciones: Objetivo, Metodología, Resultados y Conclusiones. Extensión ${length}.`,
    acta:      `Generá un resumen en formato de acta en ${lang} con: Tema principal, Puntos discutidos y Conclusiones/Acuerdos. Extensión ${length}.`,
  };

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization':'Bearer '+key, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role:'system', content: prompts[type] || prompts.ejecutivo },
          { role:'user',   content: text }
        ],
        temperature: 0.3, max_tokens: 800
      })
    });
    const d    = await r.json();
    const summary = d?.choices?.[0]?.message?.content?.trim() || '';

    if (prog) prog.style.display='none';
    if (res)  { res.style.display='block'; res.innerHTML = summary.replace(/\n/g,'<br>'); }
    if (btn)  { btn.disabled=false; btn.textContent='📥 Insertar resumen'; btn.onclick=()=>__insertSummary(summary,insert); }

  } catch(e) {
    if (prog) prog.style.display='none';
    if (btn)  btn.disabled=false;
    showToast('Error al resumir: ' + e.message);
  }
}

function __insertSummary(summary, atTop) {
  const ed  = document.getElementById('editor');
  const html= `<div style="font-family:Calibri,Arial,sans-serif;background:#f0f7ff;border-left:4px solid #0084ff;border-radius:0 8px 8px 0;padding:14px 16px;margin:12px 0">
    <div style="font-size:10pt;font-weight:700;color:#0084ff;margin-bottom:8px">📝 RESUMEN AUTOMÁTICO · WC Corporate Editor · ${new Date().toLocaleDateString('es-CR')}</div>
    <div style="font-size:11pt;color:#333;line-height:1.7">${summary.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/^• /gm,'<br>• ')}</div>
  </div>`;
  if (atTop && ed) ed.insertAdjacentHTML('afterbegin', html);
  else if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__sumPanel').remove();
  showToast('📝 Resumen insertado ✅');
}


/* ═══════════════════════════════════
   FEATURE 7: DETECTOR DE PLAGIO BÁSICO
   ═══════════════════════════════════ */

function openPlagiarismDetector() {
  const old = document.getElementById('__plagPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  const ov  = document.createElement('div');
  ov.id = '__plagPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔍 Detector de originalidad</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Análisis de originalidad del texto · Groq IA</div>

    <div style="background:#fff9e6;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#856404;line-height:1.6">
      ⚠️ Este es un análisis de originalidad basado en IA, no un detector de plagio certificado. Para verificación académica oficial usá Turnitin u otras herramientas especializadas.
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de análisis</label>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[
          ['estilo',   '✍️ Análisis de estilo',     'Detecta incoherencias de voz o estilo que sugieren copia'],
          ['frases',   '🔎 Frases sospechosas',      'Identifica frases que parecen tomadas de otras fuentes'],
          ['completo', '📊 Análisis completo',       'Evaluación general de originalidad con puntuación'],
        ].map(([v,l,d],i)=>`
          <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid ${i===2?'#e74c3c':'#eee'};background:${i===2?'#fde8e8':'#fafafa'};border-radius:10px">
            <input type="radio" name="__plagType" value="${v}" ${i===2?'checked':''} style="accent-color:#e74c3c;margin-top:2px">
            <div><div style="font-size:12px;font-weight:600;color:#1a1a1a">${l}</div><div style="font-size:10px;color:#888">${d}</div></div>
          </label>`).join('')}
      </div>
    </div>

    <div id="__plagProgress" style="display:none;background:#fde8e8;border-radius:8px;padding:10px;text-align:center;color:#e74c3c;font-size:13px;margin-bottom:10px">🔍 Analizando originalidad...</div>
    <div id="__plagResult" style="display:none;margin-bottom:12px"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__plagPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runPlagCheck()" id="__plagBtn" style="flex:2;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🔍 Analizar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runPlagCheck() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const ed   = document.getElementById('editor');
  const text = ed?.innerText?.trim().slice(0,4000) || '';
  if (!text) { showToast('El documento está vacío'); return; }

  const type = document.querySelector('[name="__plagType"]:checked')?.value || 'completo';
  const prog = document.getElementById('__plagProgress');
  const res  = document.getElementById('__plagResult');
  const btn  = document.getElementById('__plagBtn');
  if (prog) prog.style.display='block';
  if (btn)  btn.disabled=true;

  const sysPrompts = {
    estilo:   'Analizá el estilo de escritura del siguiente texto. Identificá cambios abruptos de voz, tono o vocabulario que puedan indicar texto copiado de diferentes fuentes. Respondé en JSON: {"cambiosEstilo":[{"fragmento":"...","observacion":"..."}],"evaluacion":"...","score":0-100}',
    frases:   'Identificá frases o párrafos en el siguiente texto que suenen como texto académico, periodístico o técnico copiado, es decir, que no parecen escritos por el mismo autor. Respondé en JSON: {"frasesSospechosas":[{"texto":"...","razon":"..."}],"evaluacion":"...","score":0-100}',
    completo: 'Realizá un análisis completo de originalidad del siguiente texto. Evaluá: consistencia de estilo, uso de frases comunes/clichés, complejidad inusual, cambios de vocabulario. Dá un score de originalidad del 0-100. Respondé en JSON: {"score":0-100,"nivel":"Alto/Medio/Bajo","observaciones":["..."],"fragmentosSospechosos":["..."],"recomendaciones":["..."]}',
  };

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{role:'system',content:sysPrompts[type]},{role:'user',content:text}],
        temperature:0.1, max_tokens:600
      })
    });
    const d    = await r.json();
    const raw  = d?.choices?.[0]?.message?.content || '{}';
    const data = JSON.parse(raw.replace(/```json|```/g,'').trim());

    if (prog) prog.style.display='none';
    if (btn)  btn.disabled=false;

    const score    = data.score ?? 75;
    const scoreColor = score>=75?'#27ae60':score>=50?'#f39c12':'#e74c3c';
    const scoreLabel = score>=75?'Alta originalidad':score>=50?'Originalidad moderada':'Revisar contenido';

    if (res) {
      res.style.display='block';
      res.innerHTML=`
        <div style="background:#f8f9fa;border-radius:12px;padding:14px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="text-align:center">
              <div style="font-size:32px;font-weight:900;color:${scoreColor}">${score}</div>
              <div style="font-size:9px;color:#aaa">Score</div>
            </div>
            <div style="flex:1">
              <div style="height:10px;background:#eee;border-radius:5px;overflow:hidden;margin-bottom:6px">
                <div style="height:100%;width:${score}%;background:${scoreColor};border-radius:5px"></div>
              </div>
              <div style="font-size:13px;font-weight:700;color:${scoreColor}">${data.nivel||scoreLabel}</div>
            </div>
          </div>
          ${data.observaciones?.length?`<div style="font-size:11px;color:#555;margin-bottom:8px">${data.observaciones.map(o=>`<div style="margin-bottom:4px">• ${o}</div>`).join('')}</div>`:''}
          ${data.evaluacion?`<div style="font-size:11px;color:#666;font-style:italic">${data.evaluacion}</div>`:''}
          ${(data.fragmentosSospechosos?.length||data.frasesSospechosas?.length)?`
            <div style="margin-top:8px;padding:8px;background:#fff9e6;border-radius:8px;font-size:10px;color:#856404">
              ⚠️ Fragmentos para revisar: ${(data.fragmentosSospechosos||data.frasesSospechosas||[]).length}
            </div>`:''}
        </div>`;
    }
  } catch(e) {
    if (prog) prog.style.display='none';
    if (btn)  btn.disabled=false;
    showToast('Error en análisis: ' + e.message);
  }
}


/* ═══════════════════════════════════
   FEATURE 8: GENERADOR DE PREGUNTAS
   ═══════════════════════════════════ */

function openQuestionGenerator() {
  const old = document.getElementById('__qgenPanel'); if (old) old.remove();
  const ed  = document.getElementById('editor');
  const ov  = document.createElement('div');
  ov.id = '__qgenPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:22px 22px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">❓ Generador de preguntas</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">Genera preguntas desde el texto del documento</div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cantidad</label>
            <select id="__qgenCount" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
              <option value="5">5 preguntas</option>
              <option value="10" selected>10 preguntas</option>
              <option value="15">15 preguntas</option>
              <option value="20">20 preguntas</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Nivel</label>
            <select id="__qgenLevel" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
              <option value="basico">Básico</option>
              <option value="intermedio" selected>Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de preguntas</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
            ${[['abiertas','Abiertas',true],['opcion','Opción múltiple',true],['verdadero','Verdadero/Falso',false],['completar','Completar',false]].map(([v,l,checked])=>`
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;font-size:12px;font-weight:600;color:#555">
                <input type="checkbox" name="__qgenType" value="${v}" ${checked?'checked':''} style="accent-color:#9b59b6"> ${l}
              </label>`).join('')}
          </div>
        </div>

        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Contexto de uso</label>
          <select id="__qgenContext" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="examen">Examen / Evaluación</option>
            <option value="entrevista">Entrevista de trabajo</option>
            <option value="trivia">Trivia / Quiz</option>
            <option value="debate">Debate / Discusión</option>
            <option value="reflexion">Reflexión crítica</option>
          </select>
        </div>
      </div>
    </div>

    <div id="__qgenResult" style="flex:1;overflow-y:auto;padding:0 22px;display:none"></div>

    <div style="padding:12px 22px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__qgenPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__runQuestionGen()" id="__qgenBtn" style="flex:2;padding:10px;border:none;background:#9b59b6;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">❓ Generar preguntas</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runQuestionGen() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const ed   = document.getElementById('editor');
  const text = ed?.innerText?.trim().slice(0,5000) || '';
  if (!text) { showToast('El documento está vacío'); return; }

  const count   = parseInt(document.getElementById('__qgenCount')?.value)||10;
  const level   = document.getElementById('__qgenLevel')?.value || 'intermedio';
  const context = document.getElementById('__qgenContext')?.value || 'examen';
  const types   = Array.from(document.querySelectorAll('[name="__qgenType"]:checked')).map(cb=>cb.value);
  if (!types.length) { showToast('Seleccioná al menos un tipo de pregunta'); return; }

  const btn  = document.getElementById('__qgenBtn');
  const res  = document.getElementById('__qgenResult');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Generando...'; }
  if (res) res.style.display='none';

  const typeLabels = {abiertas:'preguntas abiertas',opcion:'preguntas de opción múltiple (4 opciones, indicá cuál es correcta)',verdadero:'afirmaciones para decidir si son verdaderas o falsas',completar:'frases con espacios en blanco para completar'};

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:`Generá exactamente ${count} preguntas en español de nivel ${level} para ${context} sobre el texto que se te da. Tipos a incluir: ${types.map(t=>typeLabels[t]).join(', ')}. Numeralas. Para opción múltiple incluí A,B,C,D y marcá la correcta con ✓. Para completar usá ___. Respondé SOLO con las preguntas numeradas, sin texto adicional.`
        },{role:'user',content:text}],
        temperature:0.5, max_tokens:1500
      })
    });
    const d   = await r.json();
    const qs  = d?.choices?.[0]?.message?.content?.trim()||'';

    if (btn) { btn.disabled=false; btn.textContent='❓ Generar nuevas'; }
    if (res) {
      res.style.display='block';
      const lines = qs.split('\n').filter(l=>l.trim());
      res.innerHTML=`
        <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;font-weight:700;color:#9b59b6">${count} preguntas generadas</span>
          <button onclick="__insertQuestions('${encodeURIComponent(qs)}')" style="padding:6px 12px;border:none;background:#9b59b6;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">📥 Insertar en doc</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${lines.map((l,i)=>`
            <div style="background:${i%2?'#f8f0ff':'#fff'};border-radius:8px;padding:10px;border:1px solid #e8d5f5;font-size:12px;color:#333;line-height:1.6">
              ${l.replace(/✓/g,'<span style="color:#27ae60;font-weight:700">✓</span>')}
            </div>`).join('')}
        </div>`;
    }
  } catch(e) {
    if (btn) { btn.disabled=false; btn.textContent='❓ Generar preguntas'; }
    showToast('Error: '+e.message);
  }
}

function __insertQuestions(encoded) {
  const qs   = decodeURIComponent(encoded);
  const html = `<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #9b59b6;border-radius:10px;overflow:hidden;margin:12px 0">
    <div style="background:#9b59b6;color:#fff;padding:10px 16px;font-weight:700">❓ Preguntas generadas con IA · WC Corporate Editor · ${new Date().toLocaleDateString('es-CR')}</div>
    <div style="padding:14px 16px;font-size:11pt;line-height:1.8">${qs.replace(/\n/g,'<br>').replace(/✓/g,'<span style="color:#27ae60;font-weight:700">✓</span>')}</div>
  </div>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__qgenPanel').remove();
  showToast('❓ Preguntas insertadas ✅');
}


/* ═══════════════════════════════════
   FEATURE 9: CORRECTOR APA AVANZADO
   ═══════════════════════════════════ */

function openAPACorrector() {
  const old = document.getElementById('__apaPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__apaPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:22px 22px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📚 Corrector de estilo APA</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">American Psychological Association · 7ª edición</div>

      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${[['doc','Verificar documento'],['ref','Formatear referencia'],['cita','Formatear cita en texto'],['generar','Generar bibliografía']].map(([v,l],i)=>`
          <button onclick="__apaTab='${v}';document.querySelectorAll('.__apaTabBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555'});this.style.borderColor='#8e44ad';this.style.background='#f5eeff';this.style.color='#8e44ad';__buildAPATab()" class="__apaTabBtn"
            style="padding:7px 12px;border:1.5px solid ${i===0?'#8e44ad':'#eee'};background:${i===0?'#f5eeff':'#fafafa'};color:${i===0?'#8e44ad':'#555'};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s">
            ${l}
          </button>`).join('')}
      </div>
    </div>

    <div id="__apaContent" style="flex:1;overflow-y:auto;padding:0 22px"></div>

    <div style="padding:12px 22px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__apaPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
  window.__apaTab = 'doc';
  __buildAPATab();
}

function __buildAPATab() {
  const tab = window.__apaTab || 'doc';
  const box = document.getElementById('__apaContent');
  if (!box) return;

  const contents = {
    doc: `
      <div style="margin-bottom:12px;font-size:12px;color:#555;line-height:1.7">Analizá el documento actual con IA para detectar errores de formato APA 7ª edición.</div>
      <div id="__apaDocResult" style="display:none;margin-bottom:12px"></div>
      <button onclick="__runAPACheck()" id="__apaDocBtn" style="width:100%;padding:11px;border:none;background:#8e44ad;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📚 Verificar formato APA</button>`,

    ref: `
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Tipo de fuente</label>
          <select id="__apaRefType" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none" onchange="__buildRefFields()">
            <option value="libro">Libro</option><option value="articulo">Artículo de revista</option>
            <option value="web">Sitio web</option><option value="tesis">Tesis</option><option value="ley">Ley/Normativa CR</option>
          </select>
        </div>
        <div id="__apaRefFields"></div>
      </div>
      <div id="__apaRefResult" style="background:#f5eeff;border-radius:8px;padding:10px;font-size:12px;color:#333;display:none;margin-bottom:10px;font-style:italic"></div>
      <div style="display:flex;gap:6px">
        <button onclick="__generateAPARef()" style="flex:2;padding:10px;border:none;background:#8e44ad;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">📚 Formatear en APA</button>
        <button onclick="__insertAPARef()" id="__apaRefInsBtn" style="display:none;flex:1;padding:10px;border:1.5px solid #8e44ad;background:#fff;color:#8e44ad;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar</button>
      </div>`,

    cita: `
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Apellido del autor</label>
          <input type="text" id="__apaCitaAutor" placeholder="García" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Año</label>
          <input type="text" id="__apaCitaAnio" placeholder="2023" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Página (opcional)</label>
          <input type="text" id="__apaCitaPag" placeholder="45" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Tipo</label>
          <div style="display:flex;gap:6px">
            ${[['parentetica','Parentética','(Autor, año)'],['narrativa','Narrativa','Autor (año)']].map(([v,l,e],i)=>`
              <label style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?'#8e44ad':'#eee'};background:${i===0?'#f5eeff':'#fafafa'};border-radius:8px;font-size:11px;font-weight:600;color:#555;text-align:center">
                <input type="radio" name="__apaCitaTipo" value="${v}" ${i===0?'checked':''} style="accent-color:#8e44ad">
                <span>${l}</span><span style="font-size:10px;color:#aaa">${e}</span>
              </label>`).join('')}
          </div>
        </div>
      </div>
      <div id="__apaCitaResult" style="background:#f5eeff;border-radius:8px;padding:10px;font-size:14px;color:#8e44ad;display:none;margin-bottom:10px;text-align:center;font-weight:600"></div>
      <div style="display:flex;gap:6px">
        <button onclick="__generateAPACita()" style="flex:2;padding:10px;border:none;background:#8e44ad;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">📚 Formatear cita</button>
        <button onclick="__insertAPACita()" id="__apaCitaInsBtn" style="display:none;flex:1;padding:10px;border:1.5px solid #8e44ad;background:#fff;color:#8e44ad;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar</button>
      </div>`,

    generar: `
      <div style="font-size:12px;color:#555;margin-bottom:12px;line-height:1.7">Ingresá las fuentes y la IA genera la sección de Referencias en formato APA 7 automáticamente.</div>
      <textarea id="__apaBibInput" rows="6" placeholder="Pegá aquí tus referencias en cualquier formato (con autor, título, año, URL) y la IA las convierte a APA 7..."
        style="width:100%;padding:10px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#8e44ad'" onblur="this.style.borderColor='#eee'"></textarea>
      <div id="__apaBibResult" style="display:none;background:#f5eeff;border-radius:8px;padding:10px;font-size:12px;color:#333;margin-bottom:10px;max-height:200px;overflow-y:auto"></div>
      <div style="display:flex;gap:6px">
        <button onclick="__generateBibliography()" id="__apaBibBtn" style="flex:2;padding:10px;border:none;background:#8e44ad;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">📚 Generar bibliografía APA</button>
        <button onclick="__insertBibliography()" id="__apaBibInsBtn" style="display:none;flex:1;padding:10px;border:1.5px solid #8e44ad;background:#fff;color:#8e44ad;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar</button>
      </div>`
  };

  box.innerHTML = `<div style="padding-top:4px">${contents[tab]||''}</div>`;
  if (tab==='ref') __buildRefFields();
}

function __buildRefFields() {
  const type = document.getElementById('__apaRefType')?.value||'libro';
  const box  = document.getElementById('__apaRefFields');
  if (!box) return;
  const fields = {
    libro:    [['Autores (Apellido, N.)','García, J. & López, M.'],['Año','2023'],['Título del libro','Metodología de la investigación'],['Editorial','Editorial Universitaria'],['DOI / URL (opcional)','']],
    articulo: [['Autores','García, J.'],['Año','2023'],['Título del artículo','El impacto de...'],['Nombre de la revista','Revista Latinoamericana'],['Volumen(Número)','15(2)'],['Páginas','45-67'],['DOI','https://doi.org/...']],
    web:      [['Autor o institución','Ministerio de Salud CR'],['Año','2023'],['Título de la página','Datos de salud 2023'],['URL completa','https://www.ministeriodesalud.go.cr/...'],['Fecha de acceso','15 de enero de 2024']],
    tesis:    [['Autor','Pérez, A.'],['Año','2022'],['Título de la tesis','Análisis de...'],['Tipo','Tesis de licenciatura'],['Universidad','Universidad de Costa Rica'],['URL / Repositorio (opcional)','']],
    ley:      [['Nombre de la ley','Ley de Justicia Tributaria'],['Número de ley','N° 7531'],['Año','2023'],['País','Costa Rica'],['URL oficial','https://www.hacienda.go.cr/...']],
  };
  box.innerHTML = (fields[type]||[]).map(([l,ph])=>`
    <div style="margin-bottom:6px">
      <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
      <input type="text" class="__apaRefField" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none;box-sizing:border-box">
    </div>`).join('');
}

async function __generateAPARef() {
  const key  = localStorage.getItem('wc-groq-key');
  const type = document.getElementById('__apaRefType')?.value||'libro';
  const fields= Array.from(document.querySelectorAll('.__apaRefField')).map(f=>f.value.trim());
  const res  = document.getElementById('__apaRefResult');
  const insBtn=document.getElementById('__apaRefInsBtn');

  if (!key) {
    // Generación local sin IA para casos básicos
    const fmts = {
      libro: ()=>`${fields[0]||'Autor'}. (${fields[1]||'s.f.'}). <em>${fields[2]||'Título'}</em>. ${fields[3]||'Editorial'}.${fields[4]?' https://doi.org/'+fields[4]:''}`,
      articulo: ()=>`${fields[0]}. (${fields[1]}). ${fields[2]}. <em>${fields[3]}, ${fields[4]}</em>, ${fields[5]}.${fields[6]?' '+fields[6]:''}`,
      web: ()=>`${fields[0]}. (${fields[1]}). <em>${fields[2]}</em>. ${fields[3]}`,
      tesis: ()=>`${fields[0]}. (${fields[1]}). <em>${fields[2]}</em> [${fields[3]||'Tesis de licenciatura'}, ${fields[4]||'Universidad'}].${fields[5]?' '+fields[5]:''}`,
      ley: ()=>`${fields[0]||'Ley'} N° ${fields[1]||''}. (${fields[2]||'s.f.'}). ${fields[3]||'Costa Rica'}.${fields[4]?' '+fields[4]:''}`,
    };
    const formatted = fmts[type]?.() || fields.join(', ');
    if (res) { res.style.display='block'; res.innerHTML=formatted; }
    if (insBtn) insBtn.style.display='block';
    window.__apaRefText = formatted;
    return;
  }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'system',content:'Generá una referencia bibliográfica en formato APA 7ª edición. Solo devolvés la referencia formateada, sin explicaciones ni markdown extra.'},{role:'user',content:`Tipo: ${type}\nDatos: ${fields.join(' | ')}`}],temperature:0.1,max_tokens:200})
    });
    const d = await r.json();
    const ref = d?.choices?.[0]?.message?.content?.trim()||'';
    if (res) { res.style.display='block'; res.innerHTML=ref; }
    if (insBtn) insBtn.style.display='block';
    window.__apaRefText = ref;
  } catch(e) { showToast('Error: '+e.message); }
}

function __insertAPARef() {
  const t = window.__apaRefText;
  if (!t) return;
  if(typeof insertHTML==='function') insertHTML(`<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;padding-left:40px;text-indent:-40px;line-height:1.8">${t}</p>`);
  document.getElementById('__apaPanel').remove();
  showToast('📚 Referencia APA insertada ✅');
}

function __generateAPACita() {
  const autor = document.getElementById('__apaCitaAutor')?.value.trim()||'Autor';
  const anio  = document.getElementById('__apaCitaAnio')?.value.trim()||'s.f.';
  const pag   = document.getElementById('__apaCitaPag')?.value.trim();
  const tipo  = document.querySelector('[name="__apaCitaTipo"]:checked')?.value||'parentetica';
  const res   = document.getElementById('__apaCitaResult');
  const ins   = document.getElementById('__apaCitaInsBtn');
  const cita  = tipo==='parentetica' ? `(${autor}, ${anio}${pag?', p. '+pag:''})` : `${autor} (${anio}${pag?', p. '+pag:''})`;
  if (res) { res.style.display='block'; res.textContent=cita; }
  if (ins) ins.style.display='block';
  window.__apaCitaText = cita;
}

function __insertAPACita() {
  const t=window.__apaCitaText;
  if(!t) return;
  if(typeof insertHTML==='function') insertHTML(`<span style="color:#8e44ad">${t}</span>`);
  document.getElementById('__apaPanel').remove();
  showToast('📚 Cita APA insertada ✅');
}

async function __generateBibliography() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const input= document.getElementById('__apaBibInput')?.value.trim();
  if (!input) { showToast('Ingresá las referencias a formatear'); return; }
  const btn  = document.getElementById('__apaBibBtn');
  const res  = document.getElementById('__apaBibResult');
  const ins  = document.getElementById('__apaBibInsBtn');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Formateando...'; }
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'system',content:'Convertí las siguientes referencias al formato APA 7ª edición. Ordenalas alfabéticamente por apellido del primer autor. Solo devolvés las referencias formateadas, una por línea, sin numeración, sin texto adicional.'},{role:'user',content:input}],temperature:0.1,max_tokens:1000})
    });
    const d   = await r.json();
    const bib = d?.choices?.[0]?.message?.content?.trim()||'';
    if (res)  { res.style.display='block'; res.innerHTML=bib.replace(/\n/g,'<br>'); }
    if (ins)  ins.style.display='block';
    if (btn)  { btn.disabled=false; btn.textContent='📚 Generar bibliografía APA'; }
    window.__apaBibText = bib;
  } catch(e) { if(btn){btn.disabled=false;btn.textContent='📚 Generar bibliografía APA';} showToast('Error: '+e.message); }
}

async function __runAPACheck() {
  const key = localStorage.getItem('wc-groq-key');
  if (!key) { showToast('Configurá tu API Key de Groq'); return; }
  const ed  = document.getElementById('editor');
  const text= ed?.innerText?.trim().slice(0,4000)||'';
  if (!text){ showToast('El documento está vacío'); return; }
  const btn = document.getElementById('__apaDocBtn');
  const res = document.getElementById('__apaDocResult');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Verificando...'; }
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'system',content:'Analizá el siguiente texto para detectar errores o inconsistencias con el formato APA 7ª edición. Respondé en JSON: {"errores":[{"tipo":"...","descripcion":"...","sugerencia":"..."}],"puntaje":0-100,"observaciones":"..."}'},{role:'user',content:text}],temperature:0.2,max_tokens:600})
    });
    const d   = await r.json();
    const raw = d?.choices?.[0]?.message?.content||'{}';
    const data= JSON.parse(raw.replace(/```json|```/g,'').trim());
    if (btn) { btn.disabled=false; btn.textContent='📚 Verificar de nuevo'; }
    if (res) {
      res.style.display='block';
      const score=data.puntaje??70;
      const sc=score>=80?'#27ae60':score>=60?'#f39c12':'#e74c3c';
      res.innerHTML=`
        <div style="background:#f5eeff;border-radius:10px;padding:12px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <div style="font-size:28px;font-weight:900;color:${sc}">${score}</div>
            <div style="flex:1"><div style="height:8px;background:#eee;border-radius:4px;overflow:hidden"><div style="height:100%;width:${score}%;background:${sc};border-radius:4px"></div></div>
            <div style="font-size:11px;color:${sc};font-weight:700;margin-top:4px">Cumplimiento APA 7</div></div>
          </div>
          ${data.observaciones?`<div style="font-size:11px;color:#555">${data.observaciones}</div>`:''}
        </div>
        ${(data.errores||[]).map(e=>`<div style="background:#fff;border:1px solid #e8d5f5;border-radius:8px;padding:10px;margin-bottom:6px">
          <div style="font-size:11px;font-weight:700;color:#8e44ad">${e.tipo}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${e.descripcion}</div>
          ${e.sugerencia?`<div style="font-size:10px;color:#27ae60;margin-top:3px">💡 ${e.sugerencia}</div>`:''}
        </div>`).join('')}`;
    }
  } catch(e) { if(btn){btn.disabled=false;btn.textContent='📚 Verificar formato APA';} showToast('Error: '+e.message); }
}

function __insertBibliography() {
  const t=window.__apaBibText;
  if(!t) return;
  const lines=t.split('\n').filter(l=>l.trim());
  const html=`<div style="font-family:Calibri,Arial,sans-serif;margin:20px 0"><h2 style="font-size:14pt;font-weight:700;color:#1a2942;text-align:center;margin-bottom:16px">Referencias</h2>${lines.map(l=>`<p style="font-size:11pt;padding-left:40px;text-indent:-40px;line-height:1.8;margin-bottom:8px">${l}</p>`).join('')}</div>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__apaPanel').remove();
  showToast('📚 Bibliografía APA insertada ✅');
}


/* ═══════════════════════════════════
   FEATURE 10: CHATBOT DEL DOCUMENTO
   ═══════════════════════════════════ */

const WC_CHATBOT = {
  history: [],
  active:  false,

  open() {
    const old = document.getElementById('__chatbotPanel'); if (old) { old.remove(); this.active=false; return; }
    const ed  = document.getElementById('editor');
    this.docText = ed?.innerText?.trim().slice(0,6000) || '';
    this.history = [];
    this.active  = true;

    const panel = document.createElement('div');
    panel.id    = '__chatbotPanel';
    panel.style.cssText = 'position:fixed;bottom:140px;right:12px;z-index:9500;width:320px;max-height:500px;background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;flex-direction:column;font-family:-apple-system,sans-serif;overflow:hidden';

    panel.innerHTML = `
      <div style="background:linear-gradient(135deg,#1a2942,#003da5);color:#fff;padding:12px 16px;display:flex;align-items:center;gap:8px;flex-shrink:0">
        <div style="width:32px;height:32px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px">🦙</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700">Sibö IA</div>
          <div style="font-size:10px;opacity:.7">Entrenado en tu documento</div>
        </div>
        <button onclick="WC_CHATBOT.open()" style="background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:16px">✕</button>
      </div>

      <div id="__chatLog" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:200px;max-height:340px">
        <div style="background:#f0f7ff;border-radius:12px 12px 12px 4px;padding:10px 12px;font-size:12px;color:#333;line-height:1.6;max-width:85%;align-self:flex-start">
          👋 ¡Hola! Soy <strong>Sibö IA</strong>. He leído tu documento (${this.docText.split(/\s+/).length} palabras). Podés preguntarme cualquier cosa sobre él.
        </div>
      </div>

      <div style="padding:8px;border-top:1px solid #eee;display:flex;gap:6px;flex-shrink:0">
        <input type="text" id="__chatInput" placeholder="Preguntá sobre el documento..."
          style="flex:1;padding:8px 12px;border:1.5px solid #eee;border-radius:20px;font-size:12px;outline:none"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#eee'"
          onkeydown="if(event.key==='Enter')WC_CHATBOT.send()">
        <button onclick="WC_CHATBOT.send()" style="width:36px;height:36px;border:none;background:#003da5;color:#fff;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">→</button>
      </div>

      <div style="padding:6px 8px 8px;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;flex-shrink:0">
        ${['¿De qué trata?','Resume en 3 puntos','¿Cuál es la conclusión?','¿Qué datos hay?','Explicá mejor'].map(q=>`
          <button onclick="document.getElementById('__chatInput').value='${q}';WC_CHATBOT.send()"
            style="flex-shrink:0;padding:4px 10px;border:1px solid #e0e0e0;background:#f8f9fa;border-radius:12px;cursor:pointer;font-size:10px;color:#555;white-space:nowrap">
            ${q}
          </button>`).join('')}
      </div>`;

    document.body.appendChild(panel);
    setTimeout(()=>document.getElementById('__chatInput')?.focus(), 100);
  },

  async send() {
    const key   = localStorage.getItem('wc-groq-key');
    if (!key)   { showToast('Configurá tu API Key de Groq'); return; }
    const input = document.getElementById('__chatInput');
    const query = input?.value.trim();
    if (!query) return;
    if (input)  input.value = '';

    const log   = document.getElementById('__chatLog');
    if (log) {
      const userMsg = document.createElement('div');
      userMsg.style.cssText = 'background:#003da5;color:#fff;border-radius:12px 12px 4px 12px;padding:8px 12px;font-size:12px;max-width:80%;align-self:flex-end;line-height:1.5';
      userMsg.textContent = query;
      log.appendChild(userMsg);

      const thinking = document.createElement('div');
      thinking.id    = '__chatThinking';
      thinking.style.cssText = 'background:#f0f0f0;border-radius:12px 12px 12px 4px;padding:8px 12px;font-size:12px;max-width:80%;align-self:flex-start;color:#aaa';
      thinking.textContent = '🦙 Pensando...';
      log.appendChild(thinking);
      log.scrollTop = 99999;
    }

    this.history.push({ role:'user', content:query });

    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'llama-3.3-70b-versatile',
          messages:[
            { role:'system', content:`Sos Sibö IA, asistente de WC Corporate Editor. Solo podés responder sobre el siguiente documento. Si la pregunta no se puede responder con el documento, decilo. Respondé en español, de forma clara y concisa.\n\nDOCUMENTO:\n${this.docText}` },
            ...this.history
          ],
          temperature:0.3, max_tokens:500
        })
      });
      const d   = await r.json();
      const ans = d?.choices?.[0]?.message?.content?.trim() || '(sin respuesta)';
      this.history.push({ role:'assistant', content:ans });

      const thinking = document.getElementById('__chatThinking');
      if (thinking) {
        thinking.id = '';
        thinking.style.cssText = 'background:#f0f7ff;border-radius:12px 12px 12px 4px;padding:8px 12px;font-size:12px;max-width:85%;align-self:flex-start;color:#333;line-height:1.6';
        thinking.innerHTML = ans.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
        if (log) log.scrollTop = 99999;
      }
    } catch(e) {
      const thinking = document.getElementById('__chatThinking');
      if (thinking) { thinking.textContent='Error al responder: '+e.message; }
    }
  }
};

function openDocChatbot() { WC_CHATBOT.open(); }


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2541() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'docSummarizer':  openDocSummarizer();      break;
          case 'plagDetector':   openPlagiarismDetector(); break;
          case 'questionGen':    openQuestionGenerator();  break;
          case 'apaCorrector':   openAPACorrector();       break;
          case 'docChatbot':     openDocChatbot();         break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.41 ✅ — Resumidor, Plagio, Preguntas, APA, Chatbot Sibö IA');
  }, 4900);
})();
