function openDocSummarizer(){const old=document.getElementById("__sumPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__sumPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const wordCount=ed?ed.innerText.trim().split(/\s+/).filter(w=>w).length:0;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4DD} Resumidor autom\xE1tico</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Documento: <strong>${wordCount} palabras</strong> \xB7 Groq LLaMA 3.3</div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de resumen</label>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${[["ejecutivo","\u{1F4CA} Resumen ejecutivo","Para directivos: puntos clave y conclusiones"],["bullets","\u2022 Puntos principales","Lista de ideas m\xE1s importantes"],["parrafo","\xB6 P\xE1rrafo \xFAnico","S\xEDntesis en 2-3 oraciones"],["academico","\u{1F393} Resumen acad\xE9mico","Introducci\xF3n, metodolog\xEDa, resultados"],["acta","\u{1F4CB} Estilo acta","Formato de acta con acuerdos"]].map(([v,l,desc],i)=>`
            <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid ${i===0?"#0084ff":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:10px;transition:all .15s">
              <input type="radio" name="__sumType" value="${v}" ${i===0?"checked":""} style="accent-color:#0084ff;margin-top:2px">
              <div>
                <div style="font-size:13px;font-weight:600;color:#1a1a1a">${l}</div>
                <div style="font-size:11px;color:#888">${desc}</div>
              </div>
            </label>`).join("")}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Extensi\xF3n</label>
          <select id="__sumLength" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="corto">Corto (50-100 palabras)</option>
            <option value="medio" selected>Medio (150-250 palabras)</option>
            <option value="largo">Largo (300-400 palabras)</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma de salida</label>
          <select id="__sumLang" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="espa\xF1ol" selected>\u{1F1E8}\u{1F1F7} Espa\xF1ol</option>
            <option value="ingl\xE9s">\u{1F1FA}\u{1F1F8} Ingl\xE9s</option>
            <option value="portugu\xE9s">\u{1F1E7}\u{1F1F7} Portugu\xE9s</option>
          </select>
        </div>
      </div>

      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
        <input type="checkbox" id="__sumInsert" checked style="accent-color:#0084ff"> Insertar al inicio del documento
      </label>
    </div>

    <div id="__sumProgress" style="display:none;background:#f0f7ff;border-radius:8px;padding:10px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
      \u23F3 Generando resumen...
    </div>
    <div id="__sumResult" style="display:none;background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px;max-height:200px;overflow-y:auto;font-size:12px;line-height:1.7;color:#333"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__sumPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runSummarizer()" id="__sumBtn" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4DD} Resumir documento</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runSummarizer(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const ed=document.getElementById("editor");if(!ed)return;const text=ed.innerText.trim().slice(0,6e3),type=document.querySelector('[name="__sumType"]:checked')?.value||"ejecutivo",length=document.getElementById("__sumLength")?.value||"medio",lang=document.getElementById("__sumLang")?.value||"espa\xF1ol",insert=document.getElementById("__sumInsert")?.checked,prog=document.getElementById("__sumProgress"),res=document.getElementById("__sumResult"),btn=document.getElementById("__sumBtn");prog&&(prog.style.display="block"),btn&&(btn.disabled=!0);const prompts={ejecutivo:`Gener\xE1 un resumen ejecutivo en ${lang} del siguiente texto. Incluye: puntos clave, conclusiones principales y recomendaciones. Extensi\xF3n ${length}.`,bullets:`Extra\xE9 los ${length==="corto"?5:length==="medio"?8:12} puntos m\xE1s importantes del siguiente texto en ${lang}. Formato: lista con vi\xF1etas.`,parrafo:`Resum\xED el siguiente texto en ${lang} en ${length==="corto"?"1 oraci\xF3n":length==="medio"?"2-3 oraciones":"un p\xE1rrafo"}.`,academico:`Gener\xE1 un resumen acad\xE9mico en ${lang} con las secciones: Objetivo, Metodolog\xEDa, Resultados y Conclusiones. Extensi\xF3n ${length}.`,acta:`Gener\xE1 un resumen en formato de acta en ${lang} con: Tema principal, Puntos discutidos y Conclusiones/Acuerdos. Extensi\xF3n ${length}.`};try{const summary=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:prompts[type]||prompts.ejecutivo},{role:"user",content:text}],temperature:.3,max_tokens:800})})).json())?.choices?.[0]?.message?.content?.trim()||"";prog&&(prog.style.display="none"),res&&(res.style.display="block",res.innerHTML=summary.replace(/\n/g,"<br>")),btn&&(btn.disabled=!1,btn.textContent="\u{1F4E5} Insertar resumen",btn.onclick=()=>__insertSummary(summary,insert))}catch(e){prog&&(prog.style.display="none"),btn&&(btn.disabled=!1),showToast("Error al resumir: "+e.message)}}function __insertSummary(summary,atTop){const ed=document.getElementById("editor"),html=`<div style="font-family:Calibri,Arial,sans-serif;background:#f0f7ff;border-left:4px solid #0084ff;border-radius:0 8px 8px 0;padding:14px 16px;margin:12px 0">
    <div style="font-size:10pt;font-weight:700;color:#0084ff;margin-bottom:8px">\u{1F4DD} RESUMEN AUTOM\xC1TICO \xB7 WC Corporate Editor \xB7 ${new Date().toLocaleDateString("es-CR")}</div>
    <div style="font-size:11pt;color:#333;line-height:1.7">${summary.replace(/\n/g,"<br>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/^• /gm,"<br>\u2022 ")}</div>
  </div>`;atTop&&ed?ed.insertAdjacentHTML("afterbegin",html):typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__sumPanel").remove(),showToast("\u{1F4DD} Resumen insertado \u2705")}function openPlagiarismDetector(){const old=document.getElementById("__plagPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__plagPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F50D} Detector de originalidad</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">An\xE1lisis de originalidad del texto \xB7 Groq IA</div>

    <div style="background:#fff9e6;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#856404;line-height:1.6">
      \u26A0\uFE0F Este es un an\xE1lisis de originalidad basado en IA, no un detector de plagio certificado. Para verificaci\xF3n acad\xE9mica oficial us\xE1 Turnitin u otras herramientas especializadas.
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de an\xE1lisis</label>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[["estilo","\u270D\uFE0F An\xE1lisis de estilo","Detecta incoherencias de voz o estilo que sugieren copia"],["frases","\u{1F50E} Frases sospechosas","Identifica frases que parecen tomadas de otras fuentes"],["completo","\u{1F4CA} An\xE1lisis completo","Evaluaci\xF3n general de originalidad con puntuaci\xF3n"]].map(([v,l,d],i)=>`
          <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid ${i===2?"#e74c3c":"#eee"};background:${i===2?"#fde8e8":"#fafafa"};border-radius:10px">
            <input type="radio" name="__plagType" value="${v}" ${i===2?"checked":""} style="accent-color:#e74c3c;margin-top:2px">
            <div><div style="font-size:12px;font-weight:600;color:#1a1a1a">${l}</div><div style="font-size:10px;color:#888">${d}</div></div>
          </label>`).join("")}
      </div>
    </div>

    <div id="__plagProgress" style="display:none;background:#fde8e8;border-radius:8px;padding:10px;text-align:center;color:#e74c3c;font-size:13px;margin-bottom:10px">\u{1F50D} Analizando originalidad...</div>
    <div id="__plagResult" style="display:none;margin-bottom:12px"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__plagPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runPlagCheck()" id="__plagBtn" style="flex:2;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F50D} Analizar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runPlagCheck(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const text=document.getElementById("editor")?.innerText?.trim().slice(0,4e3)||"";if(!text){showToast("El documento est\xE1 vac\xEDo");return}const type=document.querySelector('[name="__plagType"]:checked')?.value||"completo",prog=document.getElementById("__plagProgress"),res=document.getElementById("__plagResult"),btn=document.getElementById("__plagBtn");prog&&(prog.style.display="block"),btn&&(btn.disabled=!0);const sysPrompts={estilo:'Analiz\xE1 el estilo de escritura del siguiente texto. Identific\xE1 cambios abruptos de voz, tono o vocabulario que puedan indicar texto copiado de diferentes fuentes. Respond\xE9 en JSON: {"cambiosEstilo":[{"fragmento":"...","observacion":"..."}],"evaluacion":"...","score":0-100}',frases:'Identific\xE1 frases o p\xE1rrafos en el siguiente texto que suenen como texto acad\xE9mico, period\xEDstico o t\xE9cnico copiado, es decir, que no parecen escritos por el mismo autor. Respond\xE9 en JSON: {"frasesSospechosas":[{"texto":"...","razon":"..."}],"evaluacion":"...","score":0-100}',completo:'Realiz\xE1 un an\xE1lisis completo de originalidad del siguiente texto. Evalu\xE1: consistencia de estilo, uso de frases comunes/clich\xE9s, complejidad inusual, cambios de vocabulario. D\xE1 un score de originalidad del 0-100. Respond\xE9 en JSON: {"score":0-100,"nivel":"Alto/Medio/Bajo","observaciones":["..."],"fragmentosSospechosos":["..."],"recomendaciones":["..."]}'};try{const raw=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:sysPrompts[type]},{role:"user",content:text}],temperature:.1,max_tokens:600})})).json())?.choices?.[0]?.message?.content||"{}",data=JSON.parse(raw.replace(/```json|```/g,"").trim());prog&&(prog.style.display="none"),btn&&(btn.disabled=!1);const score=data.score??75,scoreColor=score>=75?"#27ae60":score>=50?"#f39c12":"#e74c3c",scoreLabel=score>=75?"Alta originalidad":score>=50?"Originalidad moderada":"Revisar contenido";res&&(res.style.display="block",res.innerHTML=`
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
          ${data.observaciones?.length?`<div style="font-size:11px;color:#555;margin-bottom:8px">${data.observaciones.map(o=>`<div style="margin-bottom:4px">\u2022 ${o}</div>`).join("")}</div>`:""}
          ${data.evaluacion?`<div style="font-size:11px;color:#666;font-style:italic">${data.evaluacion}</div>`:""}
          ${data.fragmentosSospechosos?.length||data.frasesSospechosas?.length?`
            <div style="margin-top:8px;padding:8px;background:#fff9e6;border-radius:8px;font-size:10px;color:#856404">
              \u26A0\uFE0F Fragmentos para revisar: ${(data.fragmentosSospechosos||data.frasesSospechosas||[]).length}
            </div>`:""}
        </div>`)}catch(e){prog&&(prog.style.display="none"),btn&&(btn.disabled=!1),showToast("Error en an\xE1lisis: "+e.message)}}function openQuestionGenerator(){const old=document.getElementById("__qgenPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__qgenPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:22px 22px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2753 Generador de preguntas</div>
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
              <option value="basico">B\xE1sico</option>
              <option value="intermedio" selected>Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de preguntas</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
            ${[["abiertas","Abiertas",!0],["opcion","Opci\xF3n m\xFAltiple",!0],["verdadero","Verdadero/Falso",!1],["completar","Completar",!1]].map(([v,l,checked])=>`
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;font-size:12px;font-weight:600;color:#555">
                <input type="checkbox" name="__qgenType" value="${v}" ${checked?"checked":""} style="accent-color:#9b59b6"> ${l}
              </label>`).join("")}
          </div>
        </div>

        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Contexto de uso</label>
          <select id="__qgenContext" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="examen">Examen / Evaluaci\xF3n</option>
            <option value="entrevista">Entrevista de trabajo</option>
            <option value="trivia">Trivia / Quiz</option>
            <option value="debate">Debate / Discusi\xF3n</option>
            <option value="reflexion">Reflexi\xF3n cr\xEDtica</option>
          </select>
        </div>
      </div>
    </div>

    <div id="__qgenResult" style="flex:1;overflow-y:auto;padding:0 22px;display:none"></div>

    <div style="padding:12px 22px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__qgenPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__runQuestionGen()" id="__qgenBtn" style="flex:2;padding:10px;border:none;background:#9b59b6;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2753 Generar preguntas</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runQuestionGen(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const text=document.getElementById("editor")?.innerText?.trim().slice(0,5e3)||"";if(!text){showToast("El documento est\xE1 vac\xEDo");return}const count=parseInt(document.getElementById("__qgenCount")?.value)||10,level=document.getElementById("__qgenLevel")?.value||"intermedio",context=document.getElementById("__qgenContext")?.value||"examen",types=Array.from(document.querySelectorAll('[name="__qgenType"]:checked')).map(cb=>cb.value);if(!types.length){showToast("Seleccion\xE1 al menos un tipo de pregunta");return}const btn=document.getElementById("__qgenBtn"),res=document.getElementById("__qgenResult");btn&&(btn.disabled=!0,btn.textContent="\u23F3 Generando..."),res&&(res.style.display="none");const typeLabels={abiertas:"preguntas abiertas",opcion:"preguntas de opci\xF3n m\xFAltiple (4 opciones, indic\xE1 cu\xE1l es correcta)",verdadero:"afirmaciones para decidir si son verdaderas o falsas",completar:"frases con espacios en blanco para completar"};try{const qs=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Gener\xE1 exactamente ${count} preguntas en espa\xF1ol de nivel ${level} para ${context} sobre el texto que se te da. Tipos a incluir: ${types.map(t=>typeLabels[t]).join(", ")}. Numeralas. Para opci\xF3n m\xFAltiple inclu\xED A,B,C,D y marc\xE1 la correcta con \u2713. Para completar us\xE1 ___. Respond\xE9 SOLO con las preguntas numeradas, sin texto adicional.`},{role:"user",content:text}],temperature:.5,max_tokens:1500})})).json())?.choices?.[0]?.message?.content?.trim()||"";if(btn&&(btn.disabled=!1,btn.textContent="\u2753 Generar nuevas"),res){res.style.display="block";const lines=qs.split(`
`).filter(l=>l.trim());res.innerHTML=`
        <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;font-weight:700;color:#9b59b6">${count} preguntas generadas</span>
          <button onclick="__insertQuestions('${encodeURIComponent(qs)}')" style="padding:6px 12px;border:none;background:#9b59b6;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4E5} Insertar en doc</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${lines.map((l,i)=>`
            <div style="background:${i%2?"#f8f0ff":"#fff"};border-radius:8px;padding:10px;border:1px solid #e8d5f5;font-size:12px;color:#333;line-height:1.6">
              ${l.replace(/✓/g,'<span style="color:#27ae60;font-weight:700">\u2713</span>')}
            </div>`).join("")}
        </div>`}}catch(e){btn&&(btn.disabled=!1,btn.textContent="\u2753 Generar preguntas"),showToast("Error: "+e.message)}}function __insertQuestions(encoded){const qs=decodeURIComponent(encoded),html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #9b59b6;border-radius:10px;overflow:hidden;margin:12px 0">
    <div style="background:#9b59b6;color:#fff;padding:10px 16px;font-weight:700">\u2753 Preguntas generadas con IA \xB7 WC Corporate Editor \xB7 ${new Date().toLocaleDateString("es-CR")}</div>
    <div style="padding:14px 16px;font-size:11pt;line-height:1.8">${qs.replace(/\n/g,"<br>").replace(/✓/g,'<span style="color:#27ae60;font-weight:700">\u2713</span>')}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__qgenPanel").remove(),showToast("\u2753 Preguntas insertadas \u2705")}function openAPACorrector(){const old=document.getElementById("__apaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__apaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:22px 22px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4DA} Corrector de estilo APA</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">American Psychological Association \xB7 7\xAA edici\xF3n</div>

      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${[["doc","Verificar documento"],["ref","Formatear referencia"],["cita","Formatear cita en texto"],["generar","Generar bibliograf\xEDa"]].map(([v,l],i)=>`
          <button onclick="__apaTab='${v}';document.querySelectorAll('.__apaTabBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555'});this.style.borderColor='#8e44ad';this.style.background='#f5eeff';this.style.color='#8e44ad';__buildAPATab()" class="__apaTabBtn"
            style="padding:7px 12px;border:1.5px solid ${i===0?"#8e44ad":"#eee"};background:${i===0?"#f5eeff":"#fafafa"};color:${i===0?"#8e44ad":"#555"};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s">
            ${l}
          </button>`).join("")}
      </div>
    </div>

    <div id="__apaContent" style="flex:1;overflow-y:auto;padding:0 22px"></div>

    <div style="padding:12px 22px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__apaPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__apaTab="doc",__buildAPATab()}function __buildAPATab(){const tab=window.__apaTab||"doc",box=document.getElementById("__apaContent");if(!box)return;const contents={doc:`
      <div style="margin-bottom:12px;font-size:12px;color:#555;line-height:1.7">Analiz\xE1 el documento actual con IA para detectar errores de formato APA 7\xAA edici\xF3n.</div>
      <div id="__apaDocResult" style="display:none;margin-bottom:12px"></div>
      <button onclick="__runAPACheck()" id="__apaDocBtn" style="width:100%;padding:11px;border:none;background:#8e44ad;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4DA} Verificar formato APA</button>`,ref:`
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Tipo de fuente</label>
          <select id="__apaRefType" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none" onchange="__buildRefFields()">
            <option value="libro">Libro</option><option value="articulo">Art\xEDculo de revista</option>
            <option value="web">Sitio web</option><option value="tesis">Tesis</option><option value="ley">Ley/Normativa CR</option>
          </select>
        </div>
        <div id="__apaRefFields"></div>
      </div>
      <div id="__apaRefResult" style="background:#f5eeff;border-radius:8px;padding:10px;font-size:12px;color:#333;display:none;margin-bottom:10px;font-style:italic"></div>
      <div style="display:flex;gap:6px">
        <button onclick="__generateAPARef()" style="flex:2;padding:10px;border:none;background:#8e44ad;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4DA} Formatear en APA</button>
        <button onclick="__insertAPARef()" id="__apaRefInsBtn" style="display:none;flex:1;padding:10px;border:1.5px solid #8e44ad;background:#fff;color:#8e44ad;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar</button>
      </div>`,cita:`
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Apellido del autor</label>
          <input type="text" id="__apaCitaAutor" placeholder="Garc\xEDa" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">A\xF1o</label>
          <input type="text" id="__apaCitaAnio" placeholder="2023" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">P\xE1gina (opcional)</label>
          <input type="text" id="__apaCitaPag" placeholder="45" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Tipo</label>
          <div style="display:flex;gap:6px">
            ${[["parentetica","Parent\xE9tica","(Autor, a\xF1o)"],["narrativa","Narrativa","Autor (a\xF1o)"]].map(([v,l,e],i)=>`
              <label style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?"#8e44ad":"#eee"};background:${i===0?"#f5eeff":"#fafafa"};border-radius:8px;font-size:11px;font-weight:600;color:#555;text-align:center">
                <input type="radio" name="__apaCitaTipo" value="${v}" ${i===0?"checked":""} style="accent-color:#8e44ad">
                <span>${l}</span><span style="font-size:10px;color:#aaa">${e}</span>
              </label>`).join("")}
          </div>
        </div>
      </div>
      <div id="__apaCitaResult" style="background:#f5eeff;border-radius:8px;padding:10px;font-size:14px;color:#8e44ad;display:none;margin-bottom:10px;text-align:center;font-weight:600"></div>
      <div style="display:flex;gap:6px">
        <button onclick="__generateAPACita()" style="flex:2;padding:10px;border:none;background:#8e44ad;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4DA} Formatear cita</button>
        <button onclick="__insertAPACita()" id="__apaCitaInsBtn" style="display:none;flex:1;padding:10px;border:1.5px solid #8e44ad;background:#fff;color:#8e44ad;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar</button>
      </div>`,generar:`
      <div style="font-size:12px;color:#555;margin-bottom:12px;line-height:1.7">Ingres\xE1 las fuentes y la IA genera la secci\xF3n de Referencias en formato APA 7 autom\xE1ticamente.</div>
      <textarea id="__apaBibInput" rows="6" placeholder="Peg\xE1 aqu\xED tus referencias en cualquier formato (con autor, t\xEDtulo, a\xF1o, URL) y la IA las convierte a APA 7..."
        style="width:100%;padding:10px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#8e44ad'" onblur="this.style.borderColor='#eee'"></textarea>
      <div id="__apaBibResult" style="display:none;background:#f5eeff;border-radius:8px;padding:10px;font-size:12px;color:#333;margin-bottom:10px;max-height:200px;overflow-y:auto"></div>
      <div style="display:flex;gap:6px">
        <button onclick="__generateBibliography()" id="__apaBibBtn" style="flex:2;padding:10px;border:none;background:#8e44ad;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4DA} Generar bibliograf\xEDa APA</button>
        <button onclick="__insertBibliography()" id="__apaBibInsBtn" style="display:none;flex:1;padding:10px;border:1.5px solid #8e44ad;background:#fff;color:#8e44ad;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar</button>
      </div>`};box.innerHTML=`<div style="padding-top:4px">${contents[tab]||""}</div>`,tab==="ref"&&__buildRefFields()}function __buildRefFields(){const type=document.getElementById("__apaRefType")?.value||"libro",box=document.getElementById("__apaRefFields");if(!box)return;const fields={libro:[["Autores (Apellido, N.)","Garc\xEDa, J. & L\xF3pez, M."],["A\xF1o","2023"],["T\xEDtulo del libro","Metodolog\xEDa de la investigaci\xF3n"],["Editorial","Editorial Universitaria"],["DOI / URL (opcional)",""]],articulo:[["Autores","Garc\xEDa, J."],["A\xF1o","2023"],["T\xEDtulo del art\xEDculo","El impacto de..."],["Nombre de la revista","Revista Latinoamericana"],["Volumen(N\xFAmero)","15(2)"],["P\xE1ginas","45-67"],["DOI","https://doi.org/..."]],web:[["Autor o instituci\xF3n","Ministerio de Salud CR"],["A\xF1o","2023"],["T\xEDtulo de la p\xE1gina","Datos de salud 2023"],["URL completa","https://www.ministeriodesalud.go.cr/..."],["Fecha de acceso","15 de enero de 2024"]],tesis:[["Autor","P\xE9rez, A."],["A\xF1o","2022"],["T\xEDtulo de la tesis","An\xE1lisis de..."],["Tipo","Tesis de licenciatura"],["Universidad","Universidad de Costa Rica"],["URL / Repositorio (opcional)",""]],ley:[["Nombre de la ley","Ley de Justicia Tributaria"],["N\xFAmero de ley","N\xB0 7531"],["A\xF1o","2023"],["Pa\xEDs","Costa Rica"],["URL oficial","https://www.hacienda.go.cr/..."]]};box.innerHTML=(fields[type]||[]).map(([l,ph])=>`
    <div style="margin-bottom:6px">
      <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
      <input type="text" class="__apaRefField" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none;box-sizing:border-box">
    </div>`).join("")}async function __generateAPARef(){const key=localStorage.getItem("wc-groq-key"),type=document.getElementById("__apaRefType")?.value||"libro",fields=Array.from(document.querySelectorAll(".__apaRefField")).map(f=>f.value.trim()),res=document.getElementById("__apaRefResult"),insBtn=document.getElementById("__apaRefInsBtn");if(!key){const formatted={libro:()=>`${fields[0]||"Autor"}. (${fields[1]||"s.f."}). <em>${fields[2]||"T\xEDtulo"}</em>. ${fields[3]||"Editorial"}.${fields[4]?" https://doi.org/"+fields[4]:""}`,articulo:()=>`${fields[0]}. (${fields[1]}). ${fields[2]}. <em>${fields[3]}, ${fields[4]}</em>, ${fields[5]}.${fields[6]?" "+fields[6]:""}`,web:()=>`${fields[0]}. (${fields[1]}). <em>${fields[2]}</em>. ${fields[3]}`,tesis:()=>`${fields[0]}. (${fields[1]}). <em>${fields[2]}</em> [${fields[3]||"Tesis de licenciatura"}, ${fields[4]||"Universidad"}].${fields[5]?" "+fields[5]:""}`,ley:()=>`${fields[0]||"Ley"} N\xB0 ${fields[1]||""}. (${fields[2]||"s.f."}). ${fields[3]||"Costa Rica"}.${fields[4]?" "+fields[4]:""}`}[type]?.()||fields.join(", ");res&&(res.style.display="block",res.innerHTML=formatted),insBtn&&(insBtn.style.display="block"),window.__apaRefText=formatted;return}try{const ref=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Gener\xE1 una referencia bibliogr\xE1fica en formato APA 7\xAA edici\xF3n. Solo devolv\xE9s la referencia formateada, sin explicaciones ni markdown extra."},{role:"user",content:`Tipo: ${type}
Datos: ${fields.join(" | ")}`}],temperature:.1,max_tokens:200})})).json())?.choices?.[0]?.message?.content?.trim()||"";res&&(res.style.display="block",res.innerHTML=ref),insBtn&&(insBtn.style.display="block"),window.__apaRefText=ref}catch(e){showToast("Error: "+e.message)}}function __insertAPARef(){const t=window.__apaRefText;t&&(typeof insertHTML=="function"&&insertHTML(`<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;padding-left:40px;text-indent:-40px;line-height:1.8">${t}</p>`),document.getElementById("__apaPanel").remove(),showToast("\u{1F4DA} Referencia APA insertada \u2705"))}function __generateAPACita(){const autor=document.getElementById("__apaCitaAutor")?.value.trim()||"Autor",anio=document.getElementById("__apaCitaAnio")?.value.trim()||"s.f.",pag=document.getElementById("__apaCitaPag")?.value.trim(),tipo=document.querySelector('[name="__apaCitaTipo"]:checked')?.value||"parentetica",res=document.getElementById("__apaCitaResult"),ins=document.getElementById("__apaCitaInsBtn"),cita=tipo==="parentetica"?`(${autor}, ${anio}${pag?", p. "+pag:""})`:`${autor} (${anio}${pag?", p. "+pag:""})`;res&&(res.style.display="block",res.textContent=cita),ins&&(ins.style.display="block"),window.__apaCitaText=cita}function __insertAPACita(){const t=window.__apaCitaText;t&&(typeof insertHTML=="function"&&insertHTML(`<span style="color:#8e44ad">${t}</span>`),document.getElementById("__apaPanel").remove(),showToast("\u{1F4DA} Cita APA insertada \u2705"))}async function __generateBibliography(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const input=document.getElementById("__apaBibInput")?.value.trim();if(!input){showToast("Ingres\xE1 las referencias a formatear");return}const btn=document.getElementById("__apaBibBtn"),res=document.getElementById("__apaBibResult"),ins=document.getElementById("__apaBibInsBtn");btn&&(btn.disabled=!0,btn.textContent="\u23F3 Formateando...");try{const bib=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Convert\xED las siguientes referencias al formato APA 7\xAA edici\xF3n. Ordenalas alfab\xE9ticamente por apellido del primer autor. Solo devolv\xE9s las referencias formateadas, una por l\xEDnea, sin numeraci\xF3n, sin texto adicional."},{role:"user",content:input}],temperature:.1,max_tokens:1e3})})).json())?.choices?.[0]?.message?.content?.trim()||"";res&&(res.style.display="block",res.innerHTML=bib.replace(/\n/g,"<br>")),ins&&(ins.style.display="block"),btn&&(btn.disabled=!1,btn.textContent="\u{1F4DA} Generar bibliograf\xEDa APA"),window.__apaBibText=bib}catch(e){btn&&(btn.disabled=!1,btn.textContent="\u{1F4DA} Generar bibliograf\xEDa APA"),showToast("Error: "+e.message)}}async function __runAPACheck(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const text=document.getElementById("editor")?.innerText?.trim().slice(0,4e3)||"";if(!text){showToast("El documento est\xE1 vac\xEDo");return}const btn=document.getElementById("__apaDocBtn"),res=document.getElementById("__apaDocResult");btn&&(btn.disabled=!0,btn.textContent="\u23F3 Verificando...");try{const raw=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:'Analiz\xE1 el siguiente texto para detectar errores o inconsistencias con el formato APA 7\xAA edici\xF3n. Respond\xE9 en JSON: {"errores":[{"tipo":"...","descripcion":"...","sugerencia":"..."}],"puntaje":0-100,"observaciones":"..."}'},{role:"user",content:text}],temperature:.2,max_tokens:600})})).json())?.choices?.[0]?.message?.content||"{}",data=JSON.parse(raw.replace(/```json|```/g,"").trim());if(btn&&(btn.disabled=!1,btn.textContent="\u{1F4DA} Verificar de nuevo"),res){res.style.display="block";const score=data.puntaje??70,sc=score>=80?"#27ae60":score>=60?"#f39c12":"#e74c3c";res.innerHTML=`
        <div style="background:#f5eeff;border-radius:10px;padding:12px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <div style="font-size:28px;font-weight:900;color:${sc}">${score}</div>
            <div style="flex:1"><div style="height:8px;background:#eee;border-radius:4px;overflow:hidden"><div style="height:100%;width:${score}%;background:${sc};border-radius:4px"></div></div>
            <div style="font-size:11px;color:${sc};font-weight:700;margin-top:4px">Cumplimiento APA 7</div></div>
          </div>
          ${data.observaciones?`<div style="font-size:11px;color:#555">${data.observaciones}</div>`:""}
        </div>
        ${(data.errores||[]).map(e=>`<div style="background:#fff;border:1px solid #e8d5f5;border-radius:8px;padding:10px;margin-bottom:6px">
          <div style="font-size:11px;font-weight:700;color:#8e44ad">${e.tipo}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${e.descripcion}</div>
          ${e.sugerencia?`<div style="font-size:10px;color:#27ae60;margin-top:3px">\u{1F4A1} ${e.sugerencia}</div>`:""}
        </div>`).join("")}`}}catch(e){btn&&(btn.disabled=!1,btn.textContent="\u{1F4DA} Verificar formato APA"),showToast("Error: "+e.message)}}function __insertBibliography(){const t=window.__apaBibText;if(!t)return;const html=`<div style="font-family:Calibri,Arial,sans-serif;margin:20px 0"><h2 style="font-size:14pt;font-weight:700;color:#1a2942;text-align:center;margin-bottom:16px">Referencias</h2>${t.split(`
`).filter(l=>l.trim()).map(l=>`<p style="font-size:11pt;padding-left:40px;text-indent:-40px;line-height:1.8;margin-bottom:8px">${l}</p>`).join("")}</div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__apaPanel").remove(),showToast("\u{1F4DA} Bibliograf\xEDa APA insertada \u2705")}const WC_CHATBOT={history:[],active:!1,open(){const old=document.getElementById("__chatbotPanel");if(old){old.remove(),this.active=!1;return}const ed=document.getElementById("editor");this.docText=ed?.innerText?.trim().slice(0,6e3)||"",this.history=[],this.active=!0;const panel=document.createElement("div");panel.id="__chatbotPanel",panel.style.cssText="position:fixed;bottom:140px;right:12px;z-index:9500;width:320px;max-height:500px;background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;flex-direction:column;font-family:-apple-system,sans-serif;overflow:hidden",panel.innerHTML=`
      <div style="background:linear-gradient(135deg,#1a2942,#003da5);color:#fff;padding:12px 16px;display:flex;align-items:center;gap:8px;flex-shrink:0">
        <div style="width:32px;height:32px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px">\u{1F999}</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700">Sib\xF6 IA</div>
          <div style="font-size:10px;opacity:.7">Entrenado en tu documento</div>
        </div>
        <button onclick="WC_CHATBOT.open()" style="background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:16px">\u2715</button>
      </div>

      <div id="__chatLog" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:200px;max-height:340px">
        <div style="background:#f0f7ff;border-radius:12px 12px 12px 4px;padding:10px 12px;font-size:12px;color:#333;line-height:1.6;max-width:85%;align-self:flex-start">
          \u{1F44B} \xA1Hola! Soy <strong>Sib\xF6 IA</strong>. He le\xEDdo tu documento (${this.docText.split(/\s+/).length} palabras). Pod\xE9s preguntarme cualquier cosa sobre \xE9l.
        </div>
      </div>

      <div style="padding:8px;border-top:1px solid #eee;display:flex;gap:6px;flex-shrink:0">
        <input type="text" id="__chatInput" placeholder="Pregunt\xE1 sobre el documento..."
          style="flex:1;padding:8px 12px;border:1.5px solid #eee;border-radius:20px;font-size:12px;outline:none"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#eee'"
          onkeydown="if(event.key==='Enter')WC_CHATBOT.send()">
        <button onclick="WC_CHATBOT.send()" style="width:36px;height:36px;border:none;background:#003da5;color:#fff;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">\u2192</button>
      </div>

      <div style="padding:6px 8px 8px;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;flex-shrink:0">
        ${["\xBFDe qu\xE9 trata?","Resume en 3 puntos","\xBFCu\xE1l es la conclusi\xF3n?","\xBFQu\xE9 datos hay?","Explic\xE1 mejor"].map(q=>`
          <button onclick="document.getElementById('__chatInput').value='${q}';WC_CHATBOT.send()"
            style="flex-shrink:0;padding:4px 10px;border:1px solid #e0e0e0;background:#f8f9fa;border-radius:12px;cursor:pointer;font-size:10px;color:#555;white-space:nowrap">
            ${q}
          </button>`).join("")}
      </div>`,document.body.appendChild(panel),setTimeout(()=>document.getElementById("__chatInput")?.focus(),100)},async send(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const input=document.getElementById("__chatInput"),query=input?.value.trim();if(!query)return;input&&(input.value="");const log=document.getElementById("__chatLog");if(log){const userMsg=document.createElement("div");userMsg.style.cssText="background:#003da5;color:#fff;border-radius:12px 12px 4px 12px;padding:8px 12px;font-size:12px;max-width:80%;align-self:flex-end;line-height:1.5",userMsg.textContent=query,log.appendChild(userMsg);const thinking=document.createElement("div");thinking.id="__chatThinking",thinking.style.cssText="background:#f0f0f0;border-radius:12px 12px 12px 4px;padding:8px 12px;font-size:12px;max-width:80%;align-self:flex-start;color:#aaa",thinking.textContent="\u{1F999} Pensando...",log.appendChild(thinking),log.scrollTop=99999}this.history.push({role:"user",content:query});try{const ans=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Sos Sib\xF6 IA, asistente de WC Corporate Editor. Solo pod\xE9s responder sobre el siguiente documento. Si la pregunta no se puede responder con el documento, decilo. Respond\xE9 en espa\xF1ol, de forma clara y concisa.

DOCUMENTO:
${this.docText}`},...this.history],temperature:.3,max_tokens:500})})).json())?.choices?.[0]?.message?.content?.trim()||"(sin respuesta)";this.history.push({role:"assistant",content:ans});const thinking=document.getElementById("__chatThinking");thinking&&(thinking.id="",thinking.style.cssText="background:#f0f7ff;border-radius:12px 12px 12px 4px;padding:8px 12px;font-size:12px;max-width:85%;align-self:flex-start;color:#333;line-height:1.6",thinking.innerHTML=ans.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>"),log&&(log.scrollTop=99999))}catch(e){const thinking=document.getElementById("__chatThinking");thinking&&(thinking.textContent="Error al responder: "+e.message)}}};function openDocChatbot(){WC_CHATBOT.open()}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"docSummarizer":openDocSummarizer();break;case"plagDetector":openPlagiarismDetector();break;case"questionGen":openQuestionGenerator();break;case"apaCorrector":openAPACorrector();break;case"docChatbot":openDocChatbot();break;default:orig(a)}}),console.log("WC Corporate Editor v25.41 \u2705 \u2014 Resumidor, Plagio, Preguntas, APA, Chatbot Sib\xF6 IA")},4900)})();
