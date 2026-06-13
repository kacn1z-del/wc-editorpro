/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.46 — 5 FEATURES IA
   1. Generador de contratos con IA
   2. Asistente de respuesta a correos
   3. Generador de discursos
   4. Detector de información falsa
   5. Transcriptor de audio a texto
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 1: GENERADOR DE CONTRATOS CON IA
   ═══════════════════════════════════ */

function openContractAI() {
  const old = document.getElementById('__contractAIPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__contractAIPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#1a2942,#003da5);color:#fff;padding:14px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:15px;font-weight:700">🤖 Generador de contratos con IA</div>
      <div style="font-size:11px;opacity:.8">Describí lo que necesitás · Groq LLaMA lo genera</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de contrato</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[
            ['servicios','🔧 Servicios profesionales'],
            ['compraventa','🛒 Compraventa'],
            ['trabajo','👷 Trabajo/empleo'],
            ['consultoria','💼 Consultoría'],
            ['software','💻 Desarrollo de software'],
            ['otro','📝 Describir libremente'],
          ].map(([v,l],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};border-radius:8px;font-size:11px;font-weight:600;color:#555">
              <input type="radio" name="__contractType" value="${v}" ${i===0?'checked':''} style="accent-color:#003da5"> ${l}
            </label>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Describí el contrato que necesitás *</label>
        <textarea id="__contractDesc" rows="5" placeholder="Ej: Contrato de servicios de diseño gráfico entre mi empresa ABC S.A. y el diseñador Juan Pérez por ₡150,000 mensuales durante 6 meses, con entrega de 3 artes por mes, pagos los 15 de cada mes, ley costarricense..." style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Jurisdicción</label>
          <select id="__contractJuris" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="costarica" selected>🇨🇷 Costa Rica</option>
            <option value="internacional">🌎 Internacional</option>
            <option value="eeuu">🇺🇸 Estados Unidos</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Nivel de detalle</label>
          <select id="__contractDetail" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="basico">Básico (5-7 cláusulas)</option>
            <option value="completo" selected>Completo (10-12 cláusulas)</option>
            <option value="extenso">Extenso (15+ cláusulas)</option>
          </select>
        </div>
      </div>

      <div id="__contractProgress" style="display:none;background:#f0f7ff;border-radius:8px;padding:10px;text-align:center;color:#003da5;font-size:13px">
        🤖 Generando contrato... Esto puede tomar unos segundos
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__contractAIPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runContractAI()" id="__contractBtn" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🤖 Generar contrato</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runContractAI() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const desc = document.getElementById('__contractDesc')?.value.trim();
  if (!desc) { showToast('Describí el contrato que necesitás'); return; }

  const type   = document.querySelector('[name="__contractType"]:checked')?.value||'servicios';
  const juris  = document.getElementById('__contractJuris')?.value||'costarica';
  const detail = document.getElementById('__contractDetail')?.value||'completo';
  const prog   = document.getElementById('__contractProgress');
  const btn    = document.getElementById('__contractBtn');
  if (prog) prog.style.display='block';
  if (btn)  { btn.disabled=true; btn.textContent='⏳ Generando...'; }

  const jurTexts = {costarica:'Costa Rica (Código Civil, Código de Comercio y Código de Trabajo de Costa Rica)',internacional:'derecho internacional comercial',eeuu:'derecho estadounidense'};
  const detailTexts = {basico:'5-7 cláusulas esenciales',completo:'10-12 cláusulas completas',extenso:'15 o más cláusulas con máximo detalle'};

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:`Sos un abogado experto en ${jurTexts[juris]}. Generá un contrato de ${type} profesional y completo con ${detailTexts[detail]}. 
El contrato debe:
- Usar lenguaje jurídico formal en español
- Incluir todas las cláusulas necesarias numeradas
- Terminar con espacios para firmas de ambas partes con fecha en ${juris==='costarica'?'Costa Rica':juris}
- Ser listo para usar (solo rellenar datos en blanco si faltan)
Solo devolvés el contrato completo en HTML con etiquetas <p>, <strong>, <h2> y <h3>. Sin explicaciones previas.`
        },{role:'user',content:`Descripción del contrato: ${desc}`}],
        temperature:0.2,max_tokens:2500
      })
    });
    const d    = await r.json();
    const html = d?.choices?.[0]?.message?.content?.trim()||'';

    if (prog) prog.style.display='none';
    if (btn)  { btn.disabled=false; btn.textContent='🤖 Generar otro'; }

    if (html && typeof insertHTML==='function') {
      const wrapped = `<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">${html}</div>`;
      insertHTML(wrapped+'<p></p>');
      document.getElementById('__contractAIPanel').remove();
      showToast('🤖 Contrato generado con IA ✅');
    }
  } catch(e) {
    if (prog) prog.style.display='none';
    if (btn)  { btn.disabled=false; btn.textContent='🤖 Generar contrato'; }
    showToast('Error: '+e.message);
  }
}


/* ═══════════════════════════════════
   FEATURE 2: ASISTENTE DE RESPUESTA A CORREOS
   ═══════════════════════════════════ */

function openEmailAssistant() {
  const old = document.getElementById('__emailAIPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__emailAIPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📧 Asistente de respuesta a correos</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Pegá el correo recibido · IA genera la respuesta perfecta</div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Correo recibido *</label>
        <textarea id="__emailOriginal" rows="5" placeholder="Pegá aquí el correo al que querés responder..." style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tono de respuesta</label>
          <select id="__emailTone" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="formal">Formal y profesional</option>
            <option value="amable">Amable y cordial</option>
            <option value="directo">Directo y conciso</option>
            <option value="empatico">Empático y comprensivo</option>
            <option value="firme">Firme pero respetuoso</option>
            <option value="negociacion">Negociación</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Intención</label>
          <select id="__emailIntent" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="aceptar">Aceptar / Confirmar</option>
            <option value="rechazar">Rechazar / Declinar</option>
            <option value="solicitar">Solicitar más info</option>
            <option value="agradecer">Agradecer</option>
            <option value="disculpar">Disculparse</option>
            <option value="seguimiento">Dar seguimiento</option>
            <option value="proponer">Proponer alternativa</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Instrucciones adicionales (opcional)</label>
        <input type="text" id="__emailExtra" placeholder="Ej: Mencionar que necesito más tiempo, proponer reunión el viernes..." style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tu nombre / cargo</label>
        <input type="text" id="__emailSender" placeholder="Lic. Ana García · Gerente de Proyectos" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div id="__emailResult" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__emailAIPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runEmailAI()" id="__emailBtn" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📧 Generar respuesta</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runEmailAI() {
  const key    = localStorage.getItem('wc-groq-key');
  if (!key)    { showToast('Configurá tu API Key de Groq'); return; }
  const original= document.getElementById('__emailOriginal')?.value.trim();
  if (!original){ showToast('Pegá el correo al que querés responder'); return; }

  const tone   = document.getElementById('__emailTone')?.value||'formal';
  const intent = document.getElementById('__emailIntent')?.value||'aceptar';
  const extra  = document.getElementById('__emailExtra')?.value.trim()||'';
  const sender = document.getElementById('__emailSender')?.value.trim()||'';
  const btn    = document.getElementById('__emailBtn');
  const res    = document.getElementById('__emailResult');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Generando...'; }

  const toneMap = {formal:'muy formal y profesional',amable:'amable y cordial',directo:'directo y conciso',empatico:'empático y comprensivo',firme:'firme pero respetuoso',negociacion:'orientado a la negociación'};
  const intentMap = {aceptar:'aceptar o confirmar lo solicitado',rechazar:'rechazar o declinar respetuosamente',solicitar:'solicitar más información o clarificación',agradecer:'agradecer',disculpar:'disculparse o pedir disculpas',seguimiento:'dar seguimiento o actualización de estado',proponer:'proponer una alternativa'};

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:`Sos un asistente experto en comunicación empresarial costarricense. Generá UNA respuesta al correo electrónico con tono ${toneMap[tone]} y con la intención de ${intentMap[intent]}.${extra?' Instrucciones adicionales: '+extra:''}${sender?' La respuesta es de: '+sender:''}
La respuesta debe:
- Tener asunto (Subject) sugerido
- Saludo apropiado
- Cuerpo bien estructurado
- Despedida formal costarricense
- Ser natural y no robótica
Respondé en JSON: {"asunto":"...","respuesta":"..."}`
        },{role:'user',content:`Correo original:\n${original}`}],
        temperature:0.4,max_tokens:800
      })
    });
    const d    = await r.json();
    const raw  = d?.choices?.[0]?.message?.content||'{}';
    const data = JSON.parse(raw.replace(/```json|```/g,'').trim());

    if (btn) { btn.disabled=false; btn.textContent='📧 Regenerar'; }
    if (res && data.respuesta) {
      res.style.display='block';
      res.innerHTML=`
        <div style="background:#f0f7ff;border-radius:12px;padding:12px;margin-bottom:10px">
          <div style="font-size:10px;font-weight:700;color:#0084ff;margin-bottom:4px">ASUNTO SUGERIDO</div>
          <div style="font-size:13px;font-weight:600;color:#1a1a1a">${data.asunto||'RE: '+original.split('\n')[0].slice(0,50)}</div>
        </div>
        <div style="background:#fff;border:1.5px solid #0084ff;border-radius:12px;padding:14px;margin-bottom:10px">
          <div style="font-size:10px;font-weight:700;color:#0084ff;margin-bottom:8px">RESPUESTA GENERADA</div>
          <div style="font-size:12px;color:#333;line-height:1.8;white-space:pre-line">${data.respuesta}</div>
        </div>
        <div id="__speechTextContent" style="display:none"></div>
        <div style="display:flex;gap:6px">
          <button onclick="navigator.clipboard.writeText(document.getElementById('__emailCopyText').textContent).then(()=>showToast('📋 Copiado'))" style="flex:1;padding:9px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📋 Copiar</button>
          <button onclick="__insertEmailResponse('${encodeURIComponent(data.asunto||'')}','${encodeURIComponent(data.respuesta||'')}')" style="flex:2;padding:9px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar en doc</button>
        </div>
        <div id="__emailCopyText" style="display:none">${data.respuesta}</div>`;
    }
  } catch(e) {
    if (btn) { btn.disabled=false; btn.textContent='📧 Generar respuesta'; }
    showToast('Error: '+e.message);
  }
}

function __insertEmailResponse(asuntoEnc, textEnc) {
  const asunto = decodeURIComponent(asuntoEnc);
  const text   = decodeURIComponent(textEnc);
  const html   = `<div style="font-family:Calibri,Arial,sans-serif;border:1.5px solid #eee;border-radius:8px;padding:14px;margin:10px 0">
    <div style="background:#f0f7ff;padding:8px 12px;border-radius:6px;margin-bottom:12px;font-size:10pt"><strong>Asunto:</strong> ${asunto}</div>
    <div style="font-size:12pt;line-height:1.8;color:#1a1a1a;white-space:pre-line">${text}</div>
  </div>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__emailAIPanel').remove();
  showToast('📧 Respuesta insertada ✅');
}


/* ═══════════════════════════════════
   FEATURE 3: GENERADOR DE DISCURSOS
   ═══════════════════════════════════ */

function openSpeechGenerator() {
  const old = document.getElementById('__speechPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__speechPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎤 Generador de discursos</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Discursos y presentaciones orales con IA</div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de discurso</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
          ${[
            ['bienvenida','👋 Bienvenida/apertura'],
            ['clausura','🏁 Clausura/cierre'],
            ['motivacional','💪 Motivacional'],
            ['graduacion','🎓 Graduación'],
            ['aniversario','🎂 Aniversario/celebración'],
            ['empresarial','💼 Empresarial/corporativo'],
            ['politico','🏛️ Político/institucional'],
            ['funeral','🕊️ Homenaje/funeral'],
          ].map(([v,l],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:7px;border:1.5px solid ${i===0?'#9b59b6':'#eee'};background:${i===0?'#f5eeff':'#fafafa'};border-radius:8px;font-size:11px;font-weight:600;color:#555">
              <input type="radio" name="__speechType" value="${v}" ${i===0?'checked':''} style="accent-color:#9b59b6"> ${l}
            </label>`).join('')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Duración</label>
          <select id="__speechDuration" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="2">2 minutos (~300 palabras)</option>
            <option value="5" selected>5 minutos (~750 palabras)</option>
            <option value="10">10 minutos (~1500 palabras)</option>
            <option value="15">15 minutos (~2250 palabras)</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Orador</label>
          <input type="text" id="__speechSpeaker" placeholder="Nombre del orador" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tema y contexto *</label>
        <textarea id="__speechTopic" rows="4" placeholder="Ej: Discurso de apertura para el 25 aniversario de la empresa TechCR en San José, ante 200 empleados. Destacar logros del año, agradecer al equipo y motivar para el futuro..." style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#9b59b6'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;align-self:center">Incluir:</label>
        ${[['__speechHumor','Humor sutil'],['__speechQuote','Cita inspiradora'],['__speechCR','Referencias CR'],['__speechCall','Llamada a la acción']].map(([id,l])=>`
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:11px;color:#555;padding:5px 10px;border:1px solid #eee;border-radius:20px;background:#fafafa">
            <input type="checkbox" id="${id}" style="accent-color:#9b59b6"> ${l}
          </label>`).join('')}
      </div>
    </div>

    <div id="__speechResult" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__speechPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runSpeechGen()" id="__speechBtn" style="flex:2;padding:10px;border:none;background:#9b59b6;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🎤 Generar discurso</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runSpeechGen() {
  const key   = localStorage.getItem('wc-groq-key');
  if (!key)   { showToast('Configurá tu API Key de Groq'); return; }
  const topic = document.getElementById('__speechTopic')?.value.trim();
  if (!topic) { showToast('Describí el tema del discurso'); return; }

  const type     = document.querySelector('[name="__speechType"]:checked')?.value||'bienvenida';
  const duration = parseInt(document.getElementById('__speechDuration')?.value)||5;
  const speaker  = document.getElementById('__speechSpeaker')?.value.trim()||'';
  const humor    = document.getElementById('__speechHumor')?.checked;
  const quote    = document.getElementById('__speechQuote')?.checked;
  const cr       = document.getElementById('__speechCR')?.checked;
  const call     = document.getElementById('__speechCall')?.checked;
  const words    = duration * 150;
  const btn      = document.getElementById('__speechBtn');
  const res      = document.getElementById('__speechResult');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Escribiendo discurso...'; }

  const extras = [humor&&'incluí un toque de humor sutil y apropiado',quote&&'incluí una cita inspiradora relevante',cr&&'incluí referencias a Costa Rica, su cultura o naturaleza',call&&'terminá con una poderosa llamada a la acción'].filter(Boolean).join('. ');

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:`Sos un speechwriter profesional especializado en discursos en español costarricense. Escribí un discurso de ${type} de aproximadamente ${words} palabras (${duration} minutos hablando).${speaker?' El orador se llama: '+speaker+'.':''} ${extras?'Requerimientos especiales: '+extras+'.':''}
El discurso debe:
- Tener una apertura impactante que capture la atención
- Fluir naturalmente al ser leído en voz alta  
- Tener momentos marcados para pausas dramáticas [PAUSA]
- Incluir indicaciones de [ÉNFASIS] en palabras clave
- Terminar de forma memorable
- Ser auténtico y emotivo, no corporativo genérico
Devolvés solo el discurso formateado, sin explicaciones.`
        },{role:'user',content:`Tema y contexto: ${topic}`}],
        temperature:0.6,max_tokens:2500
      })
    });
    const d      = await r.json();
    const speech = d?.choices?.[0]?.message?.content?.trim()||'';

    if (btn) { btn.disabled=false; btn.textContent='🎤 Generar otro'; }
    window.__lastSpeechText = speech;
    if (res && speech) {
      const wordCount = speech.split(/\s+/).length;
      const mins      = Math.round(wordCount/150);
      res.style.display='block';
      res.innerHTML=`
        <div style="background:#f5eeff;border-radius:10px;padding:10px;margin-bottom:10px;display:flex;gap:12px;font-size:11px;color:#555">
          <span>📝 ${wordCount} palabras</span><span>⏱️ ~${mins} min</span><span>🎤 ${type}</span>
        </div>
        <div style="background:#fff;border:1.5px solid #9b59b6;border-radius:12px;padding:16px;margin-bottom:10px;font-size:12px;line-height:1.9;color:#1a1a1a;white-space:pre-wrap">
          ${speech.replace(/\[PAUSA\]/g,'<span style="color:#e74c3c;font-size:10px">[PAUSA]</span>').replace(/\[ÉNFASIS\]/g,'<span style="color:#9b59b6;font-size:10px">[ÉNFASIS]</span>')}
        </div>
        <div id="__speechTextContent" style="display:none"></div>
        <div style="display:flex;gap:6px">
          <button onclick="navigator.clipboard.writeText('${encodeURIComponent(speech)}').then(()=>showToast('📋 Discurso copiado'))" style="flex:1;padding:9px;border:1.5px solid #9b59b6;background:#fff;color:#9b59b6;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📋 Copiar</button>
          <button onclick="__insertSpeech()" style="flex:2;padding:9px;border:none;background:#9b59b6;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar</button>
        </div>`;
    }
  } catch(e) {
    if (btn) { btn.disabled=false; btn.textContent='🎤 Generar discurso'; }
    showToast('Error: '+e.message);
  }
}


/* ═══════════════════════════════════
   FEATURE 4: DETECTOR DE INFORMACIÓN FALSA
   ═══════════════════════════════════ */

function openFactChecker() {
  const old = document.getElementById('__factPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__factPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔎 Detector de información falsa</div>
      <div style="font-size:12px;color:#888;margin-bottom:8px">Fact-checking asistido por IA · Groq LLaMA</div>

      <div style="background:#fff9e6;border-radius:10px;padding:10px;margin-bottom:12px;font-size:11px;color:#856404;line-height:1.6">
        ⚠️ Este es un análisis basado en IA hasta su fecha de entrenamiento. Para verificación definitiva consultá fuentes primarias, periodistas y fact-checkers especializados.
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto o afirmaciones a verificar *</label>
        <textarea id="__factText" rows="5" placeholder="Pegá aquí el texto, noticia, afirmación o información que querés verificar..." style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
    </div>

    <div id="__factResult" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__factPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runFactCheck()" id="__factBtn" style="flex:2;padding:10px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🔎 Verificar información</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runFactCheck() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const text = document.getElementById('__factText')?.value.trim();
  if (!text) { showToast('Pegá el texto a verificar'); return; }

  const btn  = document.getElementById('__factBtn');
  const res  = document.getElementById('__factResult');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Verificando...'; }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:`Sos un fact-checker experto. Analizá el texto dado e identificá afirmaciones verificables. Para cada una, evaluá su veracidad según tu conocimiento. Respondé en JSON:
{"veredictoGeneral":"Verdadero/Falso/Mixto/Imposible verificar","confianza":0-100,"afirmaciones":[{"texto":"...","veredicto":"Verdadero/Falso/Parcial/No verificable","explicacion":"...","fuentes_sugeridas":["..."]}],"resumen":"...","recomendaciones":["..."]}`
        },{role:'user',content:text}],
        temperature:0.1,max_tokens:1200
      })
    });
    const d    = await r.json();
    const raw  = d?.choices?.[0]?.message?.content||'{}';
    const data = JSON.parse(raw.replace(/```json|```/g,'').trim());

    if (btn) { btn.disabled=false; btn.textContent='🔎 Verificar de nuevo'; }

    const vColors= {'Verdadero':'#27ae60','Falso':'#e74c3c','Mixto':'#f39c12','Imposible verificar':'#888','Parcial':'#f39c12','No verificable':'#888'};
    const vIcons = {'Verdadero':'✅','Falso':'❌','Mixto':'⚠️','Imposible verificar':'❓','Parcial':'⚠️','No verificable':'❓'};
    const sc     = vColors[data.veredictoGeneral]||'#888';

    if (res) {
      res.style.display='block';
      res.innerHTML=`
        <div style="background:#f8f9fa;border-radius:12px;padding:14px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <div style="font-size:36px">${vIcons[data.veredictoGeneral]||'❓'}</div>
            <div>
              <div style="font-size:16px;font-weight:900;color:${sc}">${data.veredictoGeneral||'Sin veredicto'}</div>
              <div style="font-size:11px;color:#888">Confianza: ${data.confianza||50}%</div>
              <div style="height:6px;background:#eee;border-radius:3px;width:120px;margin-top:4px;overflow:hidden"><div style="height:100%;width:${data.confianza||50}%;background:${sc};border-radius:3px"></div></div>
            </div>
          </div>
          ${data.resumen?`<div style="font-size:11px;color:#555;line-height:1.6">${data.resumen}</div>`:''}
        </div>

        ${(data.afirmaciones||[]).map(a=>`
          <div style="background:#fff;border:1.5px solid ${vColors[a.veredicto]||'#eee'}22;border-left:4px solid ${vColors[a.veredicto]||'#eee'};border-radius:8px;padding:10px;margin-bottom:8px">
            <div style="font-size:11px;font-weight:700;color:${vColors[a.veredicto]||'#888'};margin-bottom:4px">${vIcons[a.veredicto]||'❓'} ${a.veredicto}</div>
            <div style="font-size:12px;font-weight:600;color:#1a1a1a;margin-bottom:4px">"${a.texto}"</div>
            <div style="font-size:11px;color:#555;line-height:1.5">${a.explicacion}</div>
            ${a.fuentes_sugeridas?.length?`<div style="font-size:10px;color:#888;margin-top:4px">Fuentes sugeridas: ${a.fuentes_sugeridas.join(', ')}</div>`:''}
          </div>`).join('')}

        ${data.recomendaciones?.length?`
          <div style="background:#f0f7ff;border-radius:10px;padding:10px;margin-bottom:8px">
            <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:6px">💡 Recomendaciones</div>
            ${data.recomendaciones.map(r=>`<div style="font-size:11px;color:#555;padding:2px 0">• ${r}</div>`).join('')}
          </div>`:''}`;
    }
  } catch(e) {
    if (btn) { btn.disabled=false; btn.textContent='🔎 Verificar información'; }
    showToast('Error: '+e.message);
  }
}


/* ═══════════════════════════════════
   FEATURE 5: TRANSCRIPTOR DE AUDIO
   ═══════════════════════════════════ */

const WC_TRANSCRIPTOR = {
  recognition: null,
  active:      false,
  transcript:  '',
  language:    localStorage.getItem('wc-transcript-lang')||'es-CR',

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return false;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous     = true;
    this.recognition.interimResults = true;
    this.recognition.lang           = this.language;
    return true;
  },

  start(onResult, onEnd) {
    if (!this.recognition) {
      if (!this.init()) { showToast('Tu navegador no soporta reconocimiento de voz. Usá Chrome o Safari.'); return false; }
    }
    this.recognition.lang = this.language;
    this.recognition.onresult = (e) => {
      let interim='', final='';
      for (let i=e.resultIndex; i<e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) { final+=t+' '; this.transcript+=t+' '; }
        else interim=t;
      }
      onResult?.(this.transcript, interim);
    };
    this.recognition.onend = () => { if(this.active) this.recognition.start(); else onEnd?.(); };
    this.recognition.onerror= (e) => { if(e.error!=='no-speech') showToast('Error: '+e.error); };
    this.active=true;
    this.recognition.start();
    return true;
  },

  stop() {
    this.active=false;
    this.recognition?.stop();
  },

  reset() {
    this.stop();
    this.transcript='';
  }
};

function openTranscriptorAudio() {
  const old = document.getElementById('__transcrPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__transcrPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;font-family:-apple-system,sans-serif';

  ov.innerHTML = `
  <div style="background:#1a2942;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.4)">
    <!-- Header -->
    <div style="padding:14px 20px 0">
      <div style="width:40px;height:5px;background:rgba(255,255,255,.2);border-radius:3px;margin:0 auto 12px"></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <div style="font-size:17px;font-weight:700;color:#fff;flex:1">🎙️ Transcriptor de audio</div>
        <select id="__transcrLang" style="padding:6px 10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:8px;color:#fff;font-size:11px;outline:none"
          onchange="WC_TRANSCRIPTOR.language=this.value;localStorage.setItem('wc-transcript-lang',this.value)">
          <option value="es-CR" ${WC_TRANSCRIPTOR.language==='es-CR'?'selected':''}>🇨🇷 Español CR</option>
          <option value="es-ES" ${WC_TRANSCRIPTOR.language==='es-ES'?'selected':''}>🇪🇸 Español ES</option>
          <option value="en-US" ${WC_TRANSCRIPTOR.language==='en-US'?'selected':''}>🇺🇸 English</option>
          <option value="pt-BR" ${WC_TRANSCRIPTOR.language==='pt-BR'?'selected':''}>🇧🇷 Português</option>
        </select>
        <button onclick="WC_TRANSCRIPTOR.reset();document.getElementById('__transcrPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:13px">✕</button>
      </div>
    </div>

    <!-- Display -->
    <div style="flex:1;overflow-y:auto;padding:0 20px;min-height:150px;max-height:300px">
      <div id="__transcrFinal" style="font-size:14px;color:#fff;line-height:1.8;white-space:pre-wrap;min-height:60px"></div>
      <div id="__transcrInterim" style="font-size:14px;color:rgba(255,255,255,.4);line-height:1.8"></div>
    </div>

    <!-- Stats -->
    <div style="padding:8px 20px;display:flex;gap:14px">
      <div style="font-size:11px;color:rgba(255,255,255,.4)">Palabras: <span id="__transcrWords" style="color:#fff;font-weight:700">0</span></div>
      <div style="font-size:11px;color:rgba(255,255,255,.4)">Tiempo: <span id="__transcrTime" style="color:#fff;font-weight:700">0:00</span></div>
      <div id="__transcrStatus" style="font-size:11px;color:#aaa;flex:1;text-align:right">Listo para grabar</div>
    </div>

    <!-- Controles -->
    <div style="padding:12px 20px 20px;display:flex;gap:8px">
      <button id="__transcrRecBtn" onclick="__transcrToggle()"
        style="flex:2;padding:14px;border:none;background:#e74c3c;color:#fff;border-radius:12px;cursor:pointer;font-size:16px;font-weight:700;transition:all .2s">
        🎙️ Grabar
      </button>
      <button onclick="WC_TRANSCRIPTOR.reset();document.getElementById('__transcrFinal').textContent='';document.getElementById('__transcrInterim').textContent='';document.getElementById('__transcrWords').textContent='0'" style="flex:1;padding:14px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#fff;border-radius:12px;cursor:pointer;font-size:13px">
        ↺ Borrar
      </button>
      <button onclick="__transcrInsert()" style="flex:2;padding:14px;border:none;background:#27ae60;color:#fff;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600">
        📥 Insertar
      </button>
    </div>

    <div style="padding:0 20px 16px;font-size:10px;color:rgba(255,255,255,.3);text-align:center">
      Habla claramente cerca del micrófono · Funciona con Chrome y Safari · Web Speech API
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov){WC_TRANSCRIPTOR.reset();ov.remove();}});

  window.__transcrStartTime = null;
  window.__transcrTimerInt  = null;
}

function __transcrToggle() {
  const btn    = document.getElementById('__transcrRecBtn');
  const status = document.getElementById('__transcrStatus');

  if (!WC_TRANSCRIPTOR.active) {
    const ok = WC_TRANSCRIPTOR.start(
      (final, interim) => {
        const fd = document.getElementById('__transcrFinal');
        const id = document.getElementById('__transcrInterim');
        const wd = document.getElementById('__transcrWords');
        if (fd) fd.textContent = final;
        if (id) id.textContent = interim;
        if (wd) wd.textContent = final.trim().split(/\s+/).filter(w=>w).length;
      },
      () => {
        if (btn) { btn.textContent='🎙️ Grabar'; btn.style.background='#e74c3c'; }
        if (status) status.textContent='Transcripción completa';
      }
    );
    if (ok) {
      if (btn) { btn.textContent='⏹ Detener'; btn.style.background='#555'; }
      if (status) status.innerHTML='<span style="color:#e74c3c">● Grabando...</span>';
      window.__transcrStartTime = Date.now();
      window.__transcrTimerInt  = setInterval(()=>{
        const el = document.getElementById('__transcrTime');
        if (el) {
          const s = Math.floor((Date.now()-window.__transcrStartTime)/1000);
          el.textContent = `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
        }
      },1000);
    }
  } else {
    WC_TRANSCRIPTOR.stop();
    clearInterval(window.__transcrTimerInt);
    if (btn) { btn.textContent='🎙️ Grabar'; btn.style.background='#e74c3c'; }
    if (status) status.textContent='Detenido';
  }
}

function __transcrInsert() {
  const text = WC_TRANSCRIPTOR.transcript.trim();
  if (!text) { showToast('No hay texto transcripto aún'); return; }
  if (typeof insertHTML==='function') insertHTML(`<p style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8">${text}</p>`);
  WC_TRANSCRIPTOR.reset();
  document.getElementById('__transcrPanel').remove();
  showToast('🎙️ Transcripción insertada ✅');
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */

function __insertSpeechDoc() {
  const text = window.__lastSpeechText || '';
  if (!text) return;
  if(typeof insertHTML==='function') insertHTML('<div style="font-family:Georgia,serif;font-size:13pt;line-height:2;max-width:17cm;margin:0 auto">'+text+'</div>');
  document.getElementById('__speechPanel').remove();
  showToast('🎤 Discurso insertado ✅');
}

(function initV2546() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'contractAI':     openContractAI();         break;
          case 'emailAssistant': openEmailAssistant();     break;
          case 'speechGen':      openSpeechGenerator();    break;
          case 'factChecker':    openFactChecker();        break;
          case 'audioTranscript':openTranscriptorAudio();  break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.46 ✅ — Contratos IA, Email IA, Discursos, Fact-check, Transcriptor');
  }, 5400);
})();
