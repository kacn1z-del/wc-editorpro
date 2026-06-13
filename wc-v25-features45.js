/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.45 — 5 FEATURES IA AVANZADA
   11. Generador de imágenes con IA (Pollinations)
   12. Corrector de redacción formal CR
   13. Traductor de lenguas indígenas CR
   14. Detector de tono y sentimiento
   15. Generador de hashtags y SEO
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 11: GENERADOR DE IMÁGENES IA
   ═══════════════════════════════════ */

function openImagenIA() {
  const old = document.getElementById('__imgIAPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__imgIAPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,sans-serif';

  ov.innerHTML = `
    <div style="background:#1a1a2e;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">🎨 Generador de imágenes con IA</div>
      <button onclick="document.getElementById('__imgIAPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">✕</button>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#0d0d1a">
      <div style="background:rgba(255,255,255,.05);border-radius:14px;padding:14px">
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.6);display:block;margin-bottom:6px">DESCRIPCIÓN DE LA IMAGEN *</label>
        <textarea id="__imgIAPrompt" rows="3" placeholder="Ej: Vista aérea de San José Costa Rica al amanecer, ciudad moderna con volcanes al fondo, fotografía profesional, 4K"
          style="width:100%;padding:10px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;color:#fff;font-size:13px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='rgba(138,43,226,.8)'" onblur="this.style.borderColor='rgba(255,255,255,.15)'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:rgba(255,255,255,.05);border-radius:12px;padding:10px">
          <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:4px">Estilo</label>
          <select id="__imgIAStyle" style="width:100%;padding:7px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:7px;color:#fff;font-size:12px;outline:none">
            <option value="">Fotorrealista</option>
            <option value="digital art">Arte digital</option>
            <option value="watercolor">Acuarela</option>
            <option value="oil painting">Pintura al óleo</option>
            <option value="3D render">Render 3D</option>
            <option value="minimalist">Minimalista</option>
            <option value="anime">Anime</option>
            <option value="pencil sketch">Boceto a lápiz</option>
            <option value="vintage">Vintage retro</option>
            <option value="corporate professional">Corporativo</option>
          </select>
        </div>
        <div style="background:rgba(255,255,255,.05);border-radius:12px;padding:10px">
          <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:4px">Resolución</label>
          <select id="__imgIASize" style="width:100%;padding:7px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:7px;color:#fff;font-size:12px;outline:none">
            <option value="512x512">512×512 (Cuadrado)</option>
            <option value="768x512">768×512 (Horizontal)</option>
            <option value="512x768">512×768 (Vertical)</option>
            <option value="1024x768" selected>1024×768 (HD)</option>
            <option value="1280x720">1280×720 (Widescreen)</option>
          </select>
        </div>
      </div>

      <!-- Sugerencias rápidas CR -->
      <div style="background:rgba(255,255,255,.05);border-radius:12px;padding:10px">
        <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:8px">SUGERENCIAS COSTA RICA</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${[
            'Volcán Arenal con lago al atardecer',
            'Playa Manuel Antonio con monos',
            'Quetzal en bosque nuboso Monteverde',
            'Centro histórico San José colonial',
            'Mariposa Morpho azul en selva',
            'Carreta típica costarricense colorida',
            'Tortuga marina en playa Tortuguero',
            'Cafetal en zona de Los Santos',
            'Edificio corporativo moderno San José',
            'Logo empresarial abstracto verde azul',
          ].map(s=>`<button onclick="document.getElementById('__imgIAPrompt').value='${s}, fotografía profesional, alta calidad'"
            style="padding:5px 10px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);border-radius:20px;cursor:pointer;font-size:10px;transition:all .15s"
            onmouseover="this.style.background='rgba(138,43,226,.3)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">${s}</button>`).join('')}
        </div>
      </div>

      <!-- Resultado -->
      <div id="__imgIAResult" style="display:none;background:rgba(255,255,255,.05);border-radius:14px;padding:14px;text-align:center">
        <img id="__imgIAImg" src="" alt="" style="max-width:100%;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:block;margin:0 auto">
        <div style="display:flex;gap:8px;margin-top:10px;justify-content:center">
          <button onclick="__imgIAInsert()" style="padding:8px 16px;border:none;background:#8b2be2;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar en doc</button>
          <button onclick="__imgIADownload()" style="padding:8px 16px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:8px;cursor:pointer;font-size:12px">💾 Descargar</button>
          <button onclick="__imgIAGenerate()" style="padding:8px 16px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:8px;cursor:pointer;font-size:12px">🔄 Regenerar</button>
        </div>
      </div>
    </div>

    <div style="padding:12px 16px;background:#1a1a2e;flex-shrink:0">
      <button onclick="__imgIAGenerate()" id="__imgIABtn" style="width:100%;padding:13px;border:none;background:linear-gradient(135deg,#8b2be2,#0084ff);color:#fff;border-radius:12px;cursor:pointer;font-size:15px;font-weight:700">
        🎨 Generar imagen con IA
      </button>
      <div style="text-align:center;font-size:9px;color:rgba(255,255,255,.3);margin-top:6px">Powered by Pollinations AI · Gratis · Sin límites</div>
    </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __imgIAGenerate() {
  const prompt = document.getElementById('__imgIAPrompt')?.value.trim();
  if (!prompt) { showToast('Escribí una descripción para la imagen'); return; }

  const style  = document.getElementById('__imgIAStyle')?.value || '';
  const size   = document.getElementById('__imgIASize')?.value || '1024x768';
  const [w, h] = size.split('x').map(Number);
  const btn    = document.getElementById('__imgIABtn');
  const result = document.getElementById('__imgIAResult');
  const img    = document.getElementById('__imgIAImg');

  if (btn) { btn.textContent='⏳ Generando imagen...'; btn.disabled=true; }

  const fullPrompt = [prompt, style, 'high quality', 'professional'].filter(Boolean).join(', ');
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${w}&height=${h}&nologo=1&seed=${Math.floor(Math.random()*9999)}`;

  window.__imgIACurrentUrl   = url;
  window.__imgIACurrentPrompt= prompt;

  if (img) {
    img.onload = () => {
      if (result) result.style.display='block';
      if (btn) { btn.textContent='🎨 Generar nueva imagen'; btn.disabled=false; }
      showToast('🎨 Imagen generada ✅');
    };
    img.onerror = () => {
      if (btn) { btn.textContent='🎨 Generar imagen con IA'; btn.disabled=false; }
      showToast('Error al generar. Intentá de nuevo.');
    };
    img.src = url;
    img.alt = prompt;
  }
}

function __imgIAInsert() {
  const url    = window.__imgIACurrentUrl;
  const prompt = window.__imgIACurrentPrompt || 'Imagen generada con IA';
  if (!url) return;
  const html = `<figure style="text-align:center;margin:12px 0"><img src="${url}" alt="${prompt}" style="max-width:100%;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.15)"><figcaption style="font-size:9pt;color:#888;margin-top:4px">🎨 ${prompt} · Generado con IA · Pollinations</figcaption></figure>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__imgIAPanel').remove();
  showToast('🎨 Imagen insertada ✅');
}

function __imgIADownload() {
  const url = window.__imgIACurrentUrl;
  if (!url) return;
  const a   = document.createElement('a');
  a.href    = url; a.download='imagen-ia.jpg'; a.target='_blank'; a.click();
}


/* ═══════════════════════════════════
   FEATURE 12: CORRECTOR DE REDACCIÓN FORMAL CR
   ═══════════════════════════════════ */

function openCorrectorRedaccion() {
  const old = document.getElementById('__redPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__redPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">✍️ Corrector de redacción formal CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Español formal · Estilo institucional costarricense · Groq IA</div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de documento</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[['oficio','🏛️ Oficio/Circular'],['carta','✉️ Carta formal'],['informe','📊 Informe técnico'],['academico','🎓 Académico'],['legal','⚖️ Jurídico/Legal'],['general','📝 General']].map(([v,l],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid ${i===5?'#27ae60':'#eee'};background:${i===5?'#f0fff4':'#fafafa'};border-radius:8px;font-size:12px;font-weight:600;color:#555">
              <input type="radio" name="__redType" value="${v}" ${i===5?'checked':''} style="accent-color:#27ae60"> ${l}
            </label>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto a corregir (o dejá vacío para corregir el documento completo)</label>
        <textarea id="__redText" rows="5" placeholder="Pegá el texto aquí, o dejá vacío para mejorar todo el documento..."
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
    </div>

    <div id="__redResult" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__redPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runRedaccionCorrector()" id="__redBtn" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">✍️ Corregir redacción</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runRedaccionCorrector() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const ed   = document.getElementById('editor');
  const input= document.getElementById('__redText')?.value.trim();
  const text = input || ed?.innerText?.trim().slice(0,4000) || '';
  if (!text) { showToast('No hay texto para corregir'); return; }

  const type = document.querySelector('[name="__redType"]:checked')?.value || 'general';
  const btn  = document.getElementById('__redBtn');
  const res  = document.getElementById('__redResult');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Corrigiendo...'; }

  const typeGuides = {
    oficio:   'Documento oficial costarricense: tratamiento de "Estimado señor/señora", fórmulas de cortesía institucional, lenguaje formal y directo, estructuras como "me permito comunicarle", "en atención a".',
    carta:    'Carta formal de negocios: saludo y despedida formales, párrafos bien estructurados, tono profesional y respetuoso.',
    informe:  'Informe técnico: lenguaje objetivo y preciso, uso de tercera persona, estructura lógica, términos técnicos correctos.',
    academico:'Español académico formal: evitar coloquialismos, usar conectores argumentativos, voz pasiva donde corresponda, citas correctamente integradas.',
    legal:    'Redacción jurídica costarricense: términos legales precisos, estructura de cláusulas, referencias normativas correctas, lenguaje de la Ley.',
    general:  'Español formal costarricense: claridad, concisión, corrección gramatical, eliminación de redundancias y uso de vocabulario apropiado.',
  };

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:`Sos un experto en redacción formal costarricense. Corregí y mejorá el siguiente texto según estas pautas: ${typeGuides[type]}

Respondé en JSON con este formato exacto:
{"textoCorregido":"...","cambios":[{"original":"...","corregido":"...","razon":"..."}],"puntaje":0-100,"observaciones":"..."}`
        },{role:'user',content:text}],
        temperature:0.2,max_tokens:1500
      })
    });
    const d    = await r.json();
    const raw  = d?.choices?.[0]?.message?.content||'{}';
    const data = JSON.parse(raw.replace(/```json|```/g,'').trim());

    if (btn) { btn.disabled=false; btn.textContent='✍️ Corregir de nuevo'; }
    if (res) {
      res.style.display='block';
      const score = data.puntaje??70;
      const sc    = score>=80?'#27ae60':score>=60?'#f39c12':'#e74c3c';
      res.innerHTML=`
        <div style="background:#f0fff4;border-radius:12px;padding:12px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <div style="font-size:28px;font-weight:900;color:${sc}">${score}</div>
            <div style="flex:1"><div style="height:8px;background:#eee;border-radius:4px;overflow:hidden"><div style="height:100%;width:${score}%;background:${sc};border-radius:4px"></div></div>
            <div style="font-size:11px;color:${sc};font-weight:700;margin-top:3px">Calidad de redacción</div></div>
          </div>
          ${data.observaciones?`<div style="font-size:11px;color:#555">${data.observaciones}</div>`:''}
        </div>
        ${data.textoCorregido?`
        <div style="background:#fff;border:1.5px solid #27ae60;border-radius:10px;padding:12px;margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:6px">TEXTO CORREGIDO</div>
          <div style="font-size:12px;color:#333;line-height:1.7;white-space:pre-wrap">${data.textoCorregido}</div>
          <button onclick="__insertRedaccion('${encodeURIComponent(data.textoCorregido)}')" style="width:100%;margin-top:8px;padding:8px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar texto corregido</button>
        </div>`:''}
        ${data.cambios?.length?`
        <div style="margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">CAMBIOS REALIZADOS (${data.cambios.length})</div>
          ${data.cambios.slice(0,8).map(c=>`<div style="background:#f8f9fa;border-radius:8px;padding:8px;margin-bottom:5px;font-size:11px"><div style="color:#e74c3c;text-decoration:line-through">${c.original}</div><div style="color:#27ae60;font-weight:600">→ ${c.corregido}</div><div style="color:#888;margin-top:2px">${c.razon}</div></div>`).join('')}
        </div>`:''}`;
    }
  } catch(e) {
    if (btn) { btn.disabled=false; btn.textContent='✍️ Corregir redacción'; }
    showToast('Error: '+e.message);
  }
}

function __insertRedaccion(encoded) {
  const text = decodeURIComponent(encoded);
  if(typeof insertHTML==='function') insertHTML(`<div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8">${text.replace(/\n/g,'<br>')}</div>`);
  document.getElementById('__redPanel').remove();
  showToast('✍️ Texto corregido insertado ✅');
}


/* ═══════════════════════════════════
   FEATURE 13: TRADUCTOR LENGUAS INDÍGENAS CR
   ═══════════════════════════════════ */

function openTraductorIndigena() {
  const old = document.getElementById('__indigPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__indigPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px';

  // Diccionario expandido de lenguas indígenas CR
  const diccionario = {
    bribri: {
      'agua':'dë', 'fuego':'cha', 'tierra':'yë', 'sol':'alà', 'luna':'nia',
      'casa':'ú', 'árbol':'bë', 'montaña':'sur', 'río':'di', 'jaguar':'bi',
      'serpiente':'köl', 'pájaro':'tsuru', 'maíz':'këpa', 'cacao':'sula',
      'madre':'sa', 'padre':'papa', 'hijo':'ba', 'mujer':'kapo', 'hombre':'iru',
      'bueno':'ì', 'malo':'bë', 'grande':'këkë', 'pequeño':'klë',
      'comer':'i', 'beber':'kö', 'caminar':'kal', 'hablar':'ulà',
      'uno':'étse', 'dos':'bö', 'tres':'mën', 'cuatro':'ki', 'cinco':'kë',
      'hola':'pë', 'gracias':'sulà', 'adiós':'tsö', 'sí':'ë', 'no':'kë',
      'costarricense':'bribri', 'indígena':'bribri shula', 'naturaleza':'yë ú',
    },
    cabecar: {
      'agua':'yök', 'fuego':'sëk', 'tierra':'duö', 'sol':'alë', 'luna':'nià',
      'casa':'ú', 'árbol':'bë', 'río':'diö', 'jaguar':'bö',
      'madre':'sa', 'padre':'papa', 'bueno':'ì', 'malo':'shö',
      'hola':'ë', 'gracias':'sulë', 'sí':'ë', 'no':'kë',
      'uno':'éts', 'dos':'bök', 'tres':'mën', 'cuatro':'ki', 'cinco':'kök',
    },
    maleku: {
      'agua':'toku', 'fuego':'kira', 'tierra':'nafé', 'sol':'jafé', 'luna':'mácu',
      'casa':'nácu', 'árbol':'jaré', 'río':'toku', 'pájaro':'járë',
      'madre':'málë', 'padre':'palë', 'hola':'málë', 'gracias':'mácuji',
      'sí':'jafé', 'no':'ni', 'bueno':'fáci', 'grande':'mácu',
      'uno':'ajú', 'dos':'asá', 'tres':'ajkí', 'cuatro':'ajkú', 'cinco':'ácuë',
    },
    ngabe: {
      'agua':'dru', 'fuego':'kira', 'tierra':'nok', 'sol':'ngöbe', 'luna':'ni',
      'casa':'krë', 'árbol':'ni', 'río':'drüm', 'jaguar':'tö',
      'madre':'nga', 'padre':'baba', 'bueno':'jire', 'malo':'kue',
      'hola':'ndabë', 'gracias':'jire', 'sí':'ën', 'no':'kue',
      'uno':'kädri', 'dos':'kö', 'tres':'mën', 'cuatro':'köti', 'cinco':'kätë',
    },
    boruca: {
      'agua':'unk', 'fuego':'tö', 'tierra':'dru', 'sol':'alá', 'luna':'cunú',
      'casa':'ú', 'árbol':'bë', 'jaguar':'bi', 'pájaro':'tsuru',
      'madre':'sa', 'padre':'pa', 'bueno':'ikë', 'malo':'kë',
      'hola':'ë', 'gracias':'ikë', 'sí':'ë', 'no':'kë',
      'uno':'etso', 'dos':'bö', 'tres':'mën', 'cuatro':'ki', 'cinco':'kë',
    },
    mekatelyu: {
      'agua':'wata', 'fuego':'faia', 'tierra':'gron', 'sol':'son', 'luna':'muun',
      'casa':'ous', 'árbol':'chrii', 'río':'ribba', 'pájaro':'bord',
      'madre':'mama', 'padre':'papa', 'bueno':'gud', 'malo':'bad',
      'hola':'elo', 'gracias':'tenk yu', 'sí':'yes', 'no':'no',
      'uno':'wan', 'dos':'tu', 'tres':'chrii', 'cuatro':'fuor', 'cinco':'faiv',
      'comida':'fuud', 'trabajo':'wok', 'dinero':'moni', 'amor':'luv',
    },
  };

  const langNames = {bribri:'Bribri',cabecar:'Cabécar',maleku:'Maleku/Maléku',ngabe:'Ngäbe (Guaymí)',boruca:'Boruca/Brunca',mekatelyu:'Mekatelyu (Criollo Limonense)'};

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#27ae60,#1a2942);color:#fff;padding:14px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:15px;font-weight:700">🌿 Traductor lenguas indígenas CR</div>
      <div style="font-size:11px;opacity:.8">Bribri · Cabécar · Maleku · Ngäbe · Boruca · Mekatelyu</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Lengua indígena</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
          ${Object.entries(langNames).map(([k,v],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?'#27ae60':'#eee'};background:${i===0?'#f0fff4':'#fafafa'};border-radius:8px;font-size:11px;font-weight:600;color:#555;transition:all .15s">
              <input type="radio" name="__indigLang" value="${k}" ${i===0?'checked':''} style="accent-color:#27ae60"> 🌿 ${v}
            </label>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Palabras en español (separadas por coma o espacio)</label>
        <textarea id="__indigInput" rows="3" placeholder="agua, fuego, tierra, sol, madre, padre, casa, árbol, hola, gracias..."
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <!-- Palabras rápidas -->
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Palabras frecuentes</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${['agua','fuego','tierra','sol','luna','casa','árbol','madre','padre','hola','gracias','bueno','sí','no','uno','dos','tres'].map(w=>`<button onclick="document.getElementById('__indigInput').value+='${w}, '"
            style="padding:4px 10px;border:1px solid #e0e0e0;background:#fafafa;border-radius:12px;cursor:pointer;font-size:11px;color:#555">${w}</button>`).join('')}
        </div>
      </div>

      <div id="__indigResult" style="display:none;background:#f0fff4;border-radius:12px;padding:12px;margin-bottom:10px">
        <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:8px">TRADUCCIÓN</div>
        <div id="__indigResultTable"></div>
        <button onclick="__insertIndigTraduccion()" style="width:100%;margin-top:8px;padding:8px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar glosario en documento</button>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__indigPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__runIndigTraduccion()" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🌿 Traducir</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
  window.__indigDic = diccionario;
  window.__indigLangNames = langNames;
}

function __runIndigTraduccion() {
  const lang  = document.querySelector('[name="__indigLang"]:checked')?.value || 'bribri';
  const input = document.getElementById('__indigInput')?.value.trim();
  if (!input) { showToast('Ingresá palabras para traducir'); return; }

  const words  = input.split(/[\s,;]+/).map(w=>w.toLowerCase().trim()).filter(w=>w.length>1);
  const dic    = window.__indigDic?.[lang] || {};
  const res    = document.getElementById('__indigResult');
  const table  = document.getElementById('__indigResultTable');
  if (!res||!table) return;

  const rows = words.map(w=>({ esp:w, trad:dic[w]||'—', found:!!dic[w] }));
  const found= rows.filter(r=>r.found).length;

  table.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:11pt">
      <tr style="background:#27ae60;color:#fff"><th style="padding:6px 10px;text-align:left">Español</th><th style="padding:6px 10px;text-align:left">${window.__indigLangNames?.[lang]||lang}</th></tr>
      ${rows.map((r,i)=>`<tr style="${i%2?'background:#f8fff8':''}"><td style="padding:5px 10px;border:1px solid #c8e6c9">${r.esp}</td><td style="padding:5px 10px;border:1px solid #c8e6c9;font-weight:${r.found?'700':'400'};color:${r.found?'#1b5e20':'#aaa'}">${r.trad}</td></tr>`).join('')}
    </table>
    <div style="font-size:10px;color:#888;margin-top:6px">${found} de ${rows.length} palabras encontradas · Diccionario WC Corporate Editor</div>`;

  res.style.display='block';
  window.__indigRows = rows;
  window.__indigLangCurrent = lang;
  showToast(`🌿 ${found}/${words.length} palabras traducidas`);
}

function __insertIndigTraduccion() {
  const rows = window.__indigRows||[];
  const lang = window.__indigLangNames?.[window.__indigLangCurrent]||'Lengua indígena';
  const html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #27ae60;border-radius:10px;overflow:hidden;max-width:400px;margin:10px auto">
    <div style="background:#27ae60;color:#fff;padding:8px 14px;font-weight:700">🌿 Glosario ${lang} · WC Corporate Editor</div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0fff4"><th style="padding:5px 10px;border:1px solid #c8e6c9;text-align:left">Español</th><th style="padding:5px 10px;border:1px solid #c8e6c9;text-align:left">${lang}</th></tr>
      ${rows.filter(r=>r.found).map((r,i)=>`<tr style="${i%2?'background:#f8fff8':''}"><td style="padding:4px 10px;border:1px solid #c8e6c9">${r.esp}</td><td style="padding:4px 10px;border:1px solid #c8e6c9;font-weight:700;color:#1b5e20">${r.trad}</td></tr>`).join('')}
    </table>
  </div>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__indigPanel').remove();
  showToast('🌿 Glosario insertado ✅');
}


/* ═══════════════════════════════════
   FEATURE 14: DETECTOR DE TONO Y SENTIMIENTO
   ═══════════════════════════════════ */

function openSentimentDetector() {
  const old = document.getElementById('__sentPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__sentPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎭 Detector de tono y sentimiento</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Análisis de tono · Sentimiento · Emoción dominante</div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto a analizar (o dejá vacío para el documento)</label>
      <textarea id="__sentText" rows="4" placeholder="Pegá texto aquí o dejá vacío para analizar el documento completo..."
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#8e44ad'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
    </div>

    <div id="__sentProgress" style="display:none;background:#f5eeff;border-radius:8px;padding:10px;text-align:center;color:#8e44ad;font-size:13px;margin-bottom:10px">🎭 Analizando tono...</div>
    <div id="__sentResult" style="display:none;margin-bottom:12px"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__sentPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runSentimentAnalysis()" id="__sentBtn" style="flex:2;padding:11px;border:none;background:#8e44ad;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🎭 Analizar tono</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runSentimentAnalysis() {
  const key  = localStorage.getItem('wc-groq-key');
  if (!key)  { showToast('Configurá tu API Key de Groq'); return; }
  const ed   = document.getElementById('editor');
  const input= document.getElementById('__sentText')?.value.trim();
  const text = input || ed?.innerText?.trim().slice(0,3000) || '';
  if (!text) { showToast('No hay texto para analizar'); return; }

  const prog = document.getElementById('__sentProgress');
  const res  = document.getElementById('__sentResult');
  const btn  = document.getElementById('__sentBtn');
  if (prog) prog.style.display='block';
  if (btn)  btn.disabled=true;

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:'Analizá el tono y sentimiento del texto en español. Respondé en JSON: {"sentimiento":"Positivo/Negativo/Neutro/Mixto","tono":"formal/informal/urgente/persuasivo/informativo/emocional/agresivo/empático","emocionDominante":"alegría/tristeza/ira/miedo/sorpresa/confianza/anticipación/neutral","intensidad":0-100,"palabrasClave":["..."],"resumen":"...","sugerencias":["..."]}'
        },{role:'user',content:text}],
        temperature:0.2,max_tokens:500
      })
    });
    const d    = await r.json();
    const raw  = d?.choices?.[0]?.message?.content||'{}';
    const data = JSON.parse(raw.replace(/```json|```/g,'').trim());

    if (prog) prog.style.display='none';
    if (btn)  btn.disabled=false;

    const sentColors = {'Positivo':'#27ae60','Negativo':'#e74c3c','Neutro':'#888','Mixto':'#f39c12'};
    const emojiMap   = {'alegría':'😊','tristeza':'😢','ira':'😠','miedo':'😨','sorpresa':'😲','confianza':'💪','anticipación':'🎯','neutral':'😐'};
    const sc  = sentColors[data.sentimiento]||'#888';
    const emo = emojiMap[data.emocionDominante]||'🎭';

    if (res) {
      res.style.display='block';
      res.innerHTML=`
        <div style="background:#f5eeff;border-radius:12px;padding:14px;margin-bottom:8px">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;margin-bottom:12px">
            <div style="background:#fff;border-radius:8px;padding:8px">
              <div style="font-size:22px;margin-bottom:2px">${emo}</div>
              <div style="font-size:11px;font-weight:700;color:${sc}">${data.sentimiento||'—'}</div>
              <div style="font-size:9px;color:#aaa">Sentimiento</div>
            </div>
            <div style="background:#fff;border-radius:8px;padding:8px">
              <div style="font-size:18px;font-weight:900;color:#8e44ad">${data.intensidad||50}%</div>
              <div style="font-size:11px;font-weight:700;color:#555">${data.tono||'—'}</div>
              <div style="font-size:9px;color:#aaa">Tono/Intensidad</div>
            </div>
            <div style="background:#fff;border-radius:8px;padding:8px">
              <div style="font-size:22px;margin-bottom:2px">🎭</div>
              <div style="font-size:11px;font-weight:700;color:#555">${data.emocionDominante||'—'}</div>
              <div style="font-size:9px;color:#aaa">Emoción</div>
            </div>
          </div>
          ${data.resumen?`<div style="font-size:11px;color:#555;margin-bottom:8px">${data.resumen}</div>`:''}
          ${data.palabrasClave?.length?`<div style="display:flex;flex-wrap:wrap;gap:4px">${data.palabrasClave.map(p=>`<span style="background:#8e44ad22;border:1px solid #8e44ad44;border-radius:10px;padding:2px 8px;font-size:10px;color:#8e44ad">${p}</span>`).join('')}</div>`:''}
        </div>
        ${data.sugerencias?.length?`
        <div style="background:#f8f9fa;border-radius:10px;padding:10px">
          <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">💡 Sugerencias para mejorar el tono</div>
          ${data.sugerencias.map(s=>`<div style="font-size:11px;color:#555;padding:3px 0">• ${s}</div>`).join('')}
        </div>`:''}`;
    }
  } catch(e) {
    if (prog) prog.style.display='none';
    if (btn)  btn.disabled=false;
    showToast('Error: '+e.message);
  }
}


/* ═══════════════════════════════════
   FEATURE 15: GENERADOR HASHTAGS Y SEO
   ═══════════════════════════════════ */

function openHashtagSEO() {
  const old = document.getElementById('__seoPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__seoPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">#️⃣ Generador de hashtags y SEO</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Instagram · LinkedIn · Twitter · Meta description · SEO</div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Plataforma</label>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${[['instagram','📸 Instagram'],['linkedin','💼 LinkedIn'],['twitter','🐦 Twitter/X'],['facebook','👥 Facebook'],['tiktok','🎵 TikTok'],['seo','🔍 SEO Web']].map(([v,l],i)=>`
            <label style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:6px 10px;border:1.5px solid ${i===0?'#e1306c':'#eee'};background:${i===0?'#fff0f5':'#fafafa'};border-radius:20px;font-size:11px;font-weight:600;color:#555">
              <input type="radio" name="__seoPlatform" value="${v}" ${i===0?'checked':''} style="accent-color:#e1306c"> ${l}
            </label>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tema / Descripción del contenido *</label>
        <textarea id="__seoInput" rows="3" placeholder="Ej: Artículo sobre los beneficios del café costarricense de altura para la salud y el emprendimiento"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#e1306c'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma</label>
          <select id="__seoLang" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="es" selected>🇨🇷 Español</option>
            <option value="en">🇺🇸 English</option>
            <option value="pt">🇧🇷 Português</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cantidad</label>
          <select id="__seoCount" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="10">10 hashtags</option>
            <option value="20" selected>20 hashtags</option>
            <option value="30">30 hashtags</option>
          </select>
        </div>
      </div>
    </div>

    <div id="__seoResult" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__seoPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runHashtagSEO()" id="__seoBtn" style="flex:2;padding:10px;border:none;background:#e1306c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">#️⃣ Generar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

async function __runHashtagSEO() {
  const key      = localStorage.getItem('wc-groq-key');
  if (!key)      { showToast('Configurá tu API Key de Groq'); return; }
  const input    = document.getElementById('__seoInput')?.value.trim();
  if (!input)    { showToast('Describí el contenido'); return; }

  const platform = document.querySelector('[name="__seoPlatform"]:checked')?.value||'instagram';
  const lang     = document.getElementById('__seoLang')?.value||'es';
  const count    = parseInt(document.getElementById('__seoCount')?.value)||20;
  const btn      = document.getElementById('__seoBtn');
  const res      = document.getElementById('__seoResult');
  if (btn) { btn.disabled=true; btn.textContent='⏳ Generando...'; }

  const platformGuides = {
    instagram:'hashtags populares y de nicho para Instagram, mezcla de alto y bajo volumen, incluí algunos en español CR',
    linkedin: 'hashtags profesionales para LinkedIn, máximo 10, enfocados en industria y carrera',
    twitter:  'hashtags trending para Twitter/X, cortos y directos, máximo 3-5',
    facebook: 'hashtags relevantes para Facebook, moderados en cantidad',
    tiktok:   'hashtags virales para TikTok, incluí #fyp #parati y variantes en español',
    seo:      'palabras clave SEO (keywords), meta description, título SEO y palabras LSI relacionadas',
  };

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[{
          role:'system',
          content:`Generá ${count} ${platformGuides[platform]} para el siguiente tema en idioma ${lang}. 
${platform==='seo'?'Respondé en JSON: {"keywords":["..."],"metaTitle":"...","metaDescription":"...","lsiKeywords":["..."],"slug":"..."}':`Respondé en JSON: {"hashtags":["#tag1","#tag2"],"populares":["#tag1"],"nicho":["#tag2"],"consejo":"..."}`}`
        },{role:'user',content:input}],
        temperature:0.5,max_tokens:800
      })
    });
    const d    = await r.json();
    const raw  = d?.choices?.[0]?.message?.content||'{}';
    const data = JSON.parse(raw.replace(/```json|```/g,'').trim());

    if (btn) { btn.disabled=false; btn.textContent='#️⃣ Generar de nuevo'; }
    if (res) {
      res.style.display='block';
      if (platform==='seo') {
        res.innerHTML=`
          <div style="display:flex;flex-direction:column;gap:8px;padding-bottom:8px">
            ${data.metaTitle?`<div style="background:#f0f7ff;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#003da5;margin-bottom:4px">TÍTULO SEO</div><div style="font-size:13px;font-weight:600;color:#1a1a1a">${data.metaTitle}</div><div style="font-size:10px;color:#888">${data.metaTitle.length} caracteres (ideal: 50-60)</div></div>`:''}
            ${data.metaDescription?`<div style="background:#f0fff4;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#27ae60;margin-bottom:4px">META DESCRIPTION</div><div style="font-size:12px;color:#333">${data.metaDescription}</div><div style="font-size:10px;color:#888">${data.metaDescription.length} caracteres (ideal: 150-160)</div></div>`:''}
            ${data.slug?`<div style="background:#f5eeff;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#8e44ad;margin-bottom:4px">URL SLUG</div><div style="font-size:12px;color:#333;font-family:'Courier New',monospace">/${data.slug}</div></div>`:''}
            ${data.keywords?.length?`<div style="background:#f8f9fa;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#555;margin-bottom:6px">PALABRAS CLAVE (${data.keywords.length})</div><div style="display:flex;flex-wrap:wrap;gap:5px">${data.keywords.map(k=>`<span style="background:#003da522;border:1px solid #003da544;border-radius:10px;padding:3px 9px;font-size:11px;color:#003da5;cursor:pointer" onclick="navigator.clipboard.writeText('${k}')">${k}</span>`).join('')}</div></div>`:''}
            ${data.lsiKeywords?.length?`<div style="background:#f8f9fa;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#555;margin-bottom:6px">PALABRAS LSI RELACIONADAS</div><div style="display:flex;flex-wrap:wrap;gap:5px">${data.lsiKeywords.map(k=>`<span style="background:#88888822;border:1px solid #88888844;border-radius:10px;padding:3px 9px;font-size:11px;color:#555">${k}</span>`).join('')}</div></div>`:''}
            <button onclick="__insertSEO(${JSON.stringify(data).replace(/"/g,"'")})" style="padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar SEO en documento</button>
          </div>`;
      } else {
        const allTags = data.hashtags||[];
        const tagStr  = allTags.join(' ');
        res.innerHTML=`
          <div style="display:flex;flex-direction:column;gap:8px;padding-bottom:8px">
            <div style="background:#f0f7ff;border-radius:10px;padding:10px">
              <div style="font-size:10px;font-weight:700;color:#555;margin-bottom:6px">TODOS LOS HASHTAGS (${allTags.length})</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">
                ${allTags.map(h=>`<span style="background:#e1306c22;border:1px solid #e1306c44;border-radius:12px;padding:3px 10px;font-size:12px;color:#e1306c;cursor:pointer" onclick="navigator.clipboard.writeText('${h}').then(()=>showToast('Copiado'))">${h}</span>`).join('')}
              </div>
              ${data.consejo?`<div style="font-size:10px;color:#888;font-style:italic">💡 ${data.consejo}</div>`:''}
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="navigator.clipboard.writeText('${tagStr}').then(()=>showToast('✅ Hashtags copiados'))" style="flex:1;padding:9px;border:none;background:#e1306c;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📋 Copiar todos</button>
              <button onclick="__insertHashtags('${encodeURIComponent(tagStr)}')" style="flex:1;padding:9px;border:1.5px solid #e1306c;background:#fff;color:#e1306c;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">📥 Insertar</button>
            </div>
          </div>`;
      }
    }
  } catch(e) {
    if (btn) { btn.disabled=false; btn.textContent='#️⃣ Generar'; }
    showToast('Error: '+e.message);
  }
}

function __insertHashtags(encoded) {
  const text = decodeURIComponent(encoded);
  if(typeof insertHTML==='function') insertHTML(`<p style="font-family:Calibri,Arial,sans-serif;font-size:10pt;color:#e1306c;line-height:1.8">${text}</p>`);
  document.getElementById('__seoPanel').remove();
  showToast('#️⃣ Hashtags insertados ✅');
}

function __insertSEO(data) {
  const html=`<div style="font-family:Calibri,Arial,sans-serif;background:#f0f7ff;border:2px solid #003da5;border-radius:8px;padding:12px;margin:10px 0;font-size:10pt">
    <div style="font-weight:700;color:#003da5;margin-bottom:6px">🔍 Metadatos SEO</div>
    ${data.metaTitle?`<p><strong>Título:</strong> ${data.metaTitle}</p>`:''}
    ${data.metaDescription?`<p><strong>Descripción:</strong> ${data.metaDescription}</p>`:''}
    ${data.slug?`<p><strong>URL:</strong> /${data.slug}</p>`:''}
    ${data.keywords?.length?`<p><strong>Palabras clave:</strong> ${data.keywords.join(', ')}</p>`:''}
  </div>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__seoPanel').remove();
  showToast('🔍 SEO insertado ✅');
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2545() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'imagenIA':           openImagenIA();            break;
          case 'correctorRedaccion': openCorrectorRedaccion();  break;
          case 'traductorIndigena':  openTraductorIndigena();   break;
          case 'sentimentDetector':  openSentimentDetector();   break;
          case 'hashtagSEO':         openHashtagSEO();          break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.45 ✅ — Imagen IA, Redacción CR, Indígenas, Sentimiento, SEO');
  }, 5300);
})();
