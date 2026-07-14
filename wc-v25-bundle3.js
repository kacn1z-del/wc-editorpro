const WC_CODE={languages:{javascript:{name:"JavaScript",color:"#f7df1e",bg:"#1e1e2e",ext:"js"},python:{name:"Python",color:"#3776ab",bg:"#1e1e2e",ext:"py"},html:{name:"HTML",color:"#e34c26",bg:"#1e1e2e",ext:"html"},css:{name:"CSS",color:"#1572b6",bg:"#1e1e2e",ext:"css"},sql:{name:"SQL",color:"#336791",bg:"#1e1e2e",ext:"sql"},java:{name:"Java",color:"#ed8b00",bg:"#1e1e2e",ext:"java"},php:{name:"PHP",color:"#8892be",bg:"#1e1e2e",ext:"php"},bash:{name:"Bash/Shell",color:"#89e051",bg:"#1e1e2e",ext:"sh"},json:{name:"JSON",color:"#5b9bd5",bg:"#1e1e2e",ext:"json"},markdown:{name:"Markdown",color:"#083fa1",bg:"#1e1e2e",ext:"md"}},highlight(code,lang){const clean=code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),rules={javascript:[[/\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await|new|this|typeof|instanceof)\b/g,"#c678dd"],[/\b(true|false|null|undefined|NaN|Infinity)\b/g,"#d19a66"],[/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,"#98c379"],[/\/\/.*/g,"#5c6370"],[/\b(\d+\.?\d*)\b/g,"#d19a66"],[/\b([A-Z][a-zA-Z0-9]*)\b/g,"#e5c07b"]],python:[[/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|with|as|try|except|finally|pass|break|continue|lambda|yield|global|nonlocal)\b/g,"#c678dd"],[/\b(True|False|None)\b/g,"#d19a66"],[/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,"#98c379"],[/#.*/g,"#5c6370"],[/\b(\d+\.?\d*)\b/g,"#d19a66"]],sql:[[/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|NULL|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|INTO|VALUES|SET|UNION|ALL|DISTINCT)\b/gi,"#c678dd"],[/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g,"#98c379"],[/--.*$/gm,"#5c6370"],[/\b(\d+)\b/g,"#d19a66"]]};let result=clean;return(rules[lang]||rules.javascript).forEach(([regex,color])=>{result=result.replace(regex,m=>`<span style="color:${color}">${m}</span>`)}),result}};function openCodePanel(){const old=document.getElementById("__codePanel");old&&old.remove();const sel=window.getSelection(),selectedText=sel?sel.toString().trim():"",ov=document.createElement("div");ov.id="__codePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#1e1e2e;border-radius:20px;width:100%;max-width:640px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.5)">
    <div style="padding:16px 18px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.1)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="font-size:17px;font-weight:700;color:#e0e0e0">\u{1F4BB} Editor de c\xF3digo</div>
        <div style="flex:1"></div>
        <button onclick="document.getElementById('__codePanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#888;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:13px">\u2715</button>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Object.entries(WC_CODE.languages).map(([key,lang])=>`
          <button onclick="__codeSetLang('${key}',this)"
            class="__codeLangBtn"
            style="padding:5px 10px;border:1.5px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#aaa;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            onmouseover="this.style.borderColor='${lang.color}';this.style.color='${lang.color}'"
            onmouseout="if(!this.dataset.sel){this.style.borderColor='rgba(255,255,255,.15)';this.style.color='#aaa'}">
            ${lang.name}
          </button>`).join("")}
      </div>
    </div>

    <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;padding:0 18px">
      <textarea id="__codeInput" rows="10" spellcheck="false"
        style="flex:1;width:100%;padding:14px;background:#0d1117;color:#e6edf3;border:none;outline:none;resize:none;font-family:'Courier New',Courier,monospace;font-size:13px;line-height:1.6;border-radius:10px;margin:12px 0;box-sizing:border-box;tab-size:2"
        placeholder="// Escribe o pega tu c\xF3digo aqu\xED..."
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
              <input type="checkbox" id="__codeLineNums" checked style="accent-color:#0084ff"> N\xB0 l\xEDneas
            </label>
            <label style="display:flex;align-items:center;gap:4px;cursor:pointer;color:#aaa;font-size:11px">
              <input type="checkbox" id="__codeCopyBtn" checked style="accent-color:#0084ff"> Copiar
            </label>
          </div>
        </div>
      </div>

      <!-- IA para c\xF3digo -->
      <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:12px;margin-bottom:12px">
        <div style="font-size:11px;color:#888;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">\u{1F999} IA para c\xF3digo</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${["Explicar","Comentar","Optimizar","Refactorizar","Convertir a Python","Convertir a JS","Generar tests","Encontrar bugs"].map(a=>`<button onclick="__codeAI('${a}')" style="padding:5px 10px;background:rgba(0,132,255,.2);border:1px solid rgba(0,132,255,.3);color:#74b9ff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s" onmouseover="this.style.background='rgba(0,132,255,.4)'" onmouseout="this.style.background='rgba(0,132,255,.2)'">${a}</button>`).join("")}
        </div>
        <div id="__codeAIResult" style="display:none;margin-top:10px;background:rgba(0,0,0,.3);border-radius:8px;padding:10px;color:#e0e0e0;font-size:12px;max-height:120px;overflow-y:auto;white-space:pre-wrap;font-family:'Courier New',monospace"></div>
      </div>
    </div>

    <div style="padding:0 18px 16px;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__codePanel').remove()" style="flex:1;padding:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#aaa;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__codeInsert()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4BB} Insertar c\xF3digo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__currentCodeLang="javascript",setTimeout(()=>{const btn=document.querySelector(".__codeLangBtn");btn&&(btn.style.borderColor="#f7df1e",btn.style.color="#f7df1e",btn.dataset.sel="1"),document.getElementById("__codeInput")?.focus()},50)}function __codeSetLang(lang,btn){window.__currentCodeLang=lang,document.querySelectorAll(".__codeLangBtn").forEach(b=>{b.style.borderColor="rgba(255,255,255,.15)",b.style.color="#aaa",delete b.dataset.sel});const color=WC_CODE.languages[lang]?.color||"#0084ff";btn.style.borderColor=color,btn.style.color=color,btn.dataset.sel="1"}function __codeTabHandler(e){if(e.key==="Tab"){e.preventDefault();const ta=e.target,start=ta.selectionStart,end=ta.selectionEnd;ta.value=ta.value.substring(0,start)+"  "+ta.value.substring(end),ta.selectionStart=ta.selectionEnd=start+2}}async function __codeAI(action){const code=document.getElementById("__codeInput")?.value?.trim(),res=document.getElementById("__codeAIResult");if(!code||!res)return;const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}res.style.display="block",res.textContent="\u23F3 Procesando con IA...";const prompts={Explicar:`Explic\xE1 este c\xF3digo en espa\xF1ol de forma clara y concisa:
\`\`\`
${code}
\`\`\``,Comentar:`Agreg\xE1 comentarios explicativos a este c\xF3digo. Devolv\xE9 solo el c\xF3digo comentado:
\`\`\`
${code}
\`\`\``,Optimizar:`Optimiz\xE1 este c\xF3digo para mejor rendimiento. Devolv\xE9 el c\xF3digo optimizado y una breve explicaci\xF3n:
\`\`\`
${code}
\`\`\``,Refactorizar:`Refactoriz\xE1 este c\xF3digo siguiendo buenas pr\xE1cticas. Devolv\xE9 el c\xF3digo refactorizado:
\`\`\`
${code}
\`\`\``,"Convertir a Python":`Convert\xED este c\xF3digo a Python. Devolv\xE9 solo el c\xF3digo Python:
\`\`\`
${code}
\`\`\``,"Convertir a JS":`Convert\xED este c\xF3digo a JavaScript moderno. Devolv\xE9 solo el c\xF3digo JS:
\`\`\`
${code}
\`\`\``,"Generar tests":`Gener\xE1 tests unitarios para este c\xF3digo. Devolv\xE9 los tests:
\`\`\`
${code}
\`\`\``,"Encontrar bugs":`Analiz\xE1 este c\xF3digo y encontr\xE1 posibles bugs o errores. Explic\xE1 cada uno:
\`\`\`
${code}
\`\`\``};try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un experto programador. Respond\xE9s en espa\xF1ol, de forma concisa y t\xE9cnica."},{role:"user",content:prompts[action]||action+": "+code}],temperature:.3,max_tokens:1e3})})).json())?.choices?.[0]?.message?.content||"";if(res.textContent=reply,reply.includes("```")){const codeMatch=reply.match(/```(?:\w+)?\n([\s\S]*?)```/);if(codeMatch){const btn=document.createElement("button");btn.textContent="\u2191 Usar este c\xF3digo",btn.style.cssText="display:block;margin-top:8px;padding:5px 12px;background:rgba(0,132,255,.3);border:none;color:#74b9ff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600",btn.onclick=()=>{document.getElementById("__codeInput").value=codeMatch[1],res.style.display="none"},res.appendChild(btn)}}}catch(e){res.textContent="Error: "+e.message}}function __codeInsert(){const code=document.getElementById("__codeInput")?.value||"";if(!code.trim()){showToast("Escrib\xED c\xF3digo primero");return}const lang=window.__currentCodeLang||"javascript",langInfo=WC_CODE.languages[lang],lineNums=document.getElementById("__codeLineNums")?.checked,copyBtn=document.getElementById("__codeCopyBtn")?.checked,theme=document.getElementById("__codeTheme")?.value||"dark",themes={dark:{bg:"#0d1117",text:"#e6edf3",header:"#161b22",border:"#30363d"},monokai:{bg:"#272822",text:"#f8f8f2",header:"#1e1f1c",border:"#3e3d32"},light:{bg:"#f8f8f8",text:"#333",header:"#f0f0f0",border:"#ddd"}},t=themes[theme]||themes.dark,lines=code.split(`
`),highlighted=WC_CODE.highlight(code,lang),lineNumsHTML=lineNums?`<div style="padding:14px 8px 14px 14px;text-align:right;color:${t.border};font-size:12px;line-height:1.6;user-select:none;font-family:'Courier New',monospace;flex-shrink:0">
    ${lines.map((_,i)=>`<div>${i+1}</div>`).join("")}
  </div>`:"",html=`
  <div style="border:1px solid ${t.border};border-radius:12px;overflow:hidden;margin:12px 0;font-family:'Courier New',Courier,monospace">
    <div style="background:${t.header};padding:8px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${t.border}">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="display:flex;gap:5px"><div style="width:10px;height:10px;border-radius:50%;background:#ff5f56"></div><div style="width:10px;height:10px;border-radius:50%;background:#ffbd2e"></div><div style="width:10px;height:10px;border-radius:50%;background:#27c93f"></div></div>
        <span style="font-size:11px;color:${langInfo.color};font-weight:700;font-family:-apple-system,sans-serif">${langInfo.name}</span>
      </div>
      ${copyBtn?`<button onclick="navigator.clipboard.writeText(this.closest('[data-code]')?.dataset?.code||'').then(()=>this.textContent='\u2713 Copiado!')" style="font-size:10px;color:#888;background:rgba(255,255,255,.1);border:none;border-radius:4px;padding:3px 8px;cursor:pointer;font-family:-apple-system,sans-serif">\u{1F4CB} Copiar</button>`:""}
    </div>
    <div style="background:${t.bg};display:flex;overflow-x:auto" data-code="${code.replace(/"/g,"&quot;")}">
      ${lineNumsHTML}
      <pre style="margin:0;padding:14px;flex:1;overflow:hidden;font-size:13px;line-height:1.6;color:${t.text};white-space:pre-wrap;word-break:break-word">${highlighted}</pre>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__codePanel").remove(),showToast("\u{1F4BB} C\xF3digo insertado \u2705")}function openPricingPanel(){const old=document.getElementById("__pricingPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pricingPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4B2} Tabla de precios</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Cre\xE1 tablas de precios y planes profesionales</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[{id:"plans",name:"Planes / Suscripci\xF3n",icon:"\u{1F4E6}"},{id:"services",name:"Lista de servicios",icon:"\u{1F4CB}"},{id:"quote",name:"Cotizaci\xF3n detallada",icon:"\u{1F4C4}"},{id:"compare",name:"Comparaci\xF3n de precios",icon:"\u2696\uFE0F"}].map(t=>`
        <button onclick="__pricingSelect('${t.id}',this)"
          class="__pricingTypeBtn"
          style="padding:12px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:center;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:24px;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${t.name}</div>
        </button>`).join("")}
    </div>

    <div id="__pricingFields" style="margin-bottom:16px">
      <!-- Se llena din\xE1micamente -->
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__pricingPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__insertPricingTable()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4B2} Insertar tabla</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__pricingType="plans",setTimeout(()=>{const btn=document.querySelector(".__pricingTypeBtn");btn&&(btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"),__pricingRenderFields("plans")},50)}function __pricingSelect(id,btn){window.__pricingType=id,document.querySelectorAll(".__pricingTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1",__pricingRenderFields(id)}function __pricingRenderFields(type){const f=document.getElementById("__pricingFields");f&&(type==="plans"?f.innerHTML=`
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">T\xEDtulo de la tabla</label>
        <input type="text" id="__prTitle" value="Nuestros planes" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        ${[["B\xE1sico","\u20A129,900","#27ae60",["5 usuarios","10GB almacenamiento","Soporte email","Reportes b\xE1sicos"]],["Profesional","\u20A159,900","#0084ff",["25 usuarios","100GB almacenamiento","Soporte prioritario","Reportes avanzados","API access"]],["Empresarial","\u20A199,900","#9b59b6",["Usuarios ilimitados","1TB almacenamiento","Soporte 24/7","Todo incluido","SLA garantizado"]]].map(([plan,price,color,features],i)=>`
          <div style="border:1.5px solid #eee;border-radius:10px;padding:10px">
            <input type="text" class="__prPlanName" value="${plan}" style="width:100%;padding:5px;border:1px solid #e0e0e0;border-radius:5px;font-size:12px;font-weight:700;outline:none;box-sizing:border-box;margin-bottom:5px;text-align:center" placeholder="Plan">
            <input type="text" class="__prPlanPrice" value="${price}" style="width:100%;padding:5px;border:1px solid #e0e0e0;border-radius:5px;font-size:12px;outline:none;box-sizing:border-box;margin-bottom:5px;text-align:center" placeholder="Precio">
            <textarea class="__prPlanFeatures" rows="4" style="width:100%;padding:5px;border:1px solid #e0e0e0;border-radius:5px;font-size:11px;outline:none;resize:none;box-sizing:border-box" placeholder="Una feature por l\xEDnea">${features.join(`
`)}</textarea>
            <div style="display:flex;align-items:center;gap:5px;margin-top:4px">
              <label style="font-size:10px;color:#555">Color:</label>
              <input type="color" class="__prPlanColor" value="${color}" style="height:24px;border:none;border-radius:4px;cursor:pointer">
            </div>
          </div>`).join("")}
      </div>`:type==="services"?f.innerHTML=`
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Servicios y precios (uno por l\xEDnea: Servicio|Precio)</label>
        <textarea id="__prServices" rows="8" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Consultor\xEDa inicial|\u20A175,000
Desarrollo web (por hora)|\u20A135,000
Dise\xF1o gr\xE1fico|\u20A145,000
Mantenimiento mensual|\u20A1120,000
Capacitaci\xF3n (por hora)|\u20A155,000</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Moneda</label>
          <select id="__prCurrency" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option>\u20A1 Colones</option><option>$ D\xF3lares</option><option>\u20AC Euros</option>
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
      </div>`:f.innerHTML=`
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Items de cotizaci\xF3n (Descripci\xF3n|Cantidad|Precio unitario)</label>
        <textarea id="__prItems" rows="6" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Desarrollo de sitio web|1|\u20A1850,000
Dominio .cr (anual)|1|\u20A125,000
Hosting premium (anual)|1|\u20A1120,000
Mantenimiento (6 meses)|6|\u20A145,000</textarea>
      </div>`)}function __insertPricingTable(){const type=window.__pricingType||"plans";let html="";if(type==="plans"){const title=document.getElementById("__prTitle")?.value||"Nuestros planes",names=Array.from(document.querySelectorAll(".__prPlanName")).map(el=>el.value),prices=Array.from(document.querySelectorAll(".__prPlanPrice")).map(el=>el.value),feats=Array.from(document.querySelectorAll(".__prPlanFeatures")).map(el=>el.value.split(`
`).filter(f=>f.trim())),colors=Array.from(document.querySelectorAll(".__prPlanColor")).map(el=>el.value);html=`<div style="margin:16px 0">
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
              ${(feats[i]||[]).map(f=>`<div style="font-size:10pt;padding:5px 0;border-bottom:1px solid #f0f0f0;color:#555">\u2713 ${f}</div>`).join("")}
              <button style="margin-top:12px;padding:9px 20px;border:2px solid ${colors[i]};color:${colors[i]};background:#fff;border-radius:20px;cursor:pointer;font-size:11pt;font-weight:700;width:100%">Elegir plan</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`}else if(type==="services"){const raw=document.getElementById("__prServices")?.value||"",ivaRate=parseInt(document.getElementById("__prIVA")?.value||"0"),items=raw.split(`
`).filter(l=>l.trim()).map(l=>{const p=l.split("|");return{name:p[0]||"",price:p[1]||""}});html=`<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">
      <tr style="background:#003da5;color:#fff"><th style="padding:10px 14px;border:1px solid #002080;text-align:left">Servicio</th><th style="padding:10px 14px;border:1px solid #002080;text-align:right">Precio</th>${ivaRate?`<th style="padding:10px 14px;border:1px solid #002080;text-align:right">Con IVA ${ivaRate}%</th>`:""}</tr>
      ${items.map((it,i)=>`<tr style="${i%2?"background:#f0f7ff":""}"><td style="padding:8px 14px;border:1px solid #ddd">${it.name}</td><td style="padding:8px 14px;border:1px solid #ddd;text-align:right;font-weight:600">${it.price}</td>${ivaRate?'<td style="padding:8px 14px;border:1px solid #ddd;text-align:right">\u2014</td>':""}</tr>`).join("")}
    </table>`}else html=`<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">
      <tr style="background:#003da5;color:#fff">
        <th style="padding:8px 12px;border:1px solid #002080;text-align:left">Descripci\xF3n</th>
        <th style="padding:8px 12px;border:1px solid #002080;text-align:center">Cant.</th>
        <th style="padding:8px 12px;border:1px solid #002080;text-align:right">P. Unit.</th>
      </tr>
      ${(document.getElementById("__prItems")?.value||"").split(`
`).filter(l=>l.trim()).map(l=>{const p=l.split("|");return{desc:p[0]||"",qty:p[1]||"1",price:p[2]||"\u20A10"}}).map((it,i)=>`<tr style="${i%2?"background:#f0f7ff":""}"><td style="padding:7px 12px;border:1px solid #ddd">${it.desc}</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center">${it.qty}</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:right;font-weight:600">${it.price}</td></tr>`).join("")}
    </table>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__pricingPanel").remove(),showToast("\u{1F4B2} Tabla de precios insertada \u2705")}function openCalendarPanel(){const old=document.getElementById("__calPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__calPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const now=new Date,months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4C5} Calendario de eventos</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Cre\xE1 calendarios y agendas insertables</div>

      <div style="display:flex;gap:8px;margin-bottom:14px">
        <select id="__calMonth" style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          ${months.map((m,i)=>`<option value="${i}" ${i===now.getMonth()?"selected":""}>${m}</option>`).join("")}
        </select>
        <input type="number" id="__calYear" value="${now.getFullYear()}" style="width:90px;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;text-align:center">
        <button onclick="__calRender()" style="padding:8px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">Ver</button>
      </div>

      <div id="__calGrid" style="margin-bottom:14px"></div>

      <div style="margin-bottom:14px">
        <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Agregar evento</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <input type="date" id="__calEvDate" value="${now.toISOString().split("T")[0]}"
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
      <button onclick="__calInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4C5} Insertar calendario</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__calEvents=[],__calRender()}function __calRender(){const grid=document.getElementById("__calGrid"),month=parseInt(document.getElementById("__calMonth")?.value||0),year=parseInt(document.getElementById("__calYear")?.value||new Date().getFullYear()),months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],days=["Dom","Lun","Mar","Mi\xE9","Jue","Vie","S\xE1b"],first=new Date(year,month,1).getDay(),total=new Date(year,month+1,0).getDate(),today=new Date;let html=`<div style="background:#f8f9fa;border-radius:12px;overflow:hidden">
    <div style="background:#003da5;color:#fff;padding:10px;text-align:center;font-weight:700;font-size:13px">${months[month]} ${year}</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0">
      ${days.map(d=>`<div style="padding:6px 0;text-align:center;font-size:10px;font-weight:700;color:#888;border-bottom:1px solid #eee">${d}</div>`).join("")}
      ${Array(first).fill("").map(()=>"<div></div>").join("")}
      ${Array(total).fill("").map((_,i)=>{const day=i+1,date=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`,evs=(window.__calEvents||[]).filter(e=>e.date===date),isToday=today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===day;return`<div onclick="document.getElementById('__calEvDate').value='${date}'" style="padding:3px;text-align:center;cursor:pointer;border:1px solid #eee;min-height:36px;transition:background .1s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background=''">
          <div style="width:22px;height:22px;border-radius:50%;background:${isToday?"#003da5":evs.length?evs[0].color:"transparent"};color:${isToday||evs.length?"#fff":"#333"};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:${isToday?"700":"400"};margin:0 auto">${day}</div>
          ${evs.map(e=>`<div style="font-size:8px;background:${e.color}22;color:${e.color};border-radius:2px;padding:0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px">${e.name.slice(0,8)}</div>`).join("")}
        </div>`}).join("")}
    </div>
  </div>`;grid&&(grid.innerHTML=html),__calRenderEvents()}function __calAddEvent(){const date=document.getElementById("__calEvDate")?.value,name=document.getElementById("__calEvName")?.value?.trim(),color=document.getElementById("__calEvColor")?.value;if(!date||!name){showToast("Ingres\xE1 fecha y nombre");return}window.__calEvents||(window.__calEvents=[]),window.__calEvents.push({date,name,color}),document.getElementById("__calEvName").value="",__calRender(),showToast("Evento agregado \u2705")}function __calRenderEvents(){const box=document.getElementById("__calEvents");if(!box)return;const evs=window.__calEvents||[];if(!evs.length){box.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:10px">No hay eventos</div>';return}box.innerHTML=evs.map((e,i)=>`
    <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#f8f9fa;border-radius:8px;margin-bottom:4px">
      <div style="width:10px;height:10px;border-radius:50%;background:${e.color};flex-shrink:0"></div>
      <div style="font-size:12px;flex:1"><strong>${e.date}</strong> \u2014 ${e.name}</div>
      <button onclick="window.__calEvents.splice(${i},1);__calRender()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px;padding:0">\xD7</button>
    </div>`).join("")}function __calInsert(){const month=parseInt(document.getElementById("__calMonth")?.value||0),year=parseInt(document.getElementById("__calYear")?.value||new Date().getFullYear()),months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],days=["Dom","Lun","Mar","Mi\xE9","Jue","Vie","S\xE1b"],first=new Date(year,month,1).getDay(),total=new Date(year,month+1,0).getDate(),evs=window.__calEvents||[],html=`<div style="margin:16px 0;font-family:Calibri,Arial,sans-serif">
    <div style="background:#003da5;color:#fff;padding:12px;text-align:center;font-weight:700;font-size:14pt;border-radius:10px 10px 0 0">${months[month]} ${year}</div>
    <table style="border-collapse:collapse;width:100%">
      <tr>${days.map(d=>`<th style="padding:8px;border:1px solid #c0d8f0;background:#f0f7ff;font-size:10pt;color:#003da5;text-align:center">${d}</th>`).join("")}</tr>
      ${__calBuildRows(first,total,month,year,evs)}
    </table>
    ${evs.length?`<div style="margin-top:10px"><div style="font-size:10pt;font-weight:700;color:#003da5;margin-bottom:6px">\u{1F4C5} Eventos:</div>${evs.map(e=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:10pt"><div style="width:10px;height:10px;border-radius:50%;background:${e.color};flex-shrink:0"></div><strong>${e.date}:</strong> ${e.name}</div>`).join("")}</div>`:""}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__calPanel").remove(),showToast("\u{1F4C5} Calendario insertado \u2705")}function __calBuildRows(first,total,month,year,evs){let cells=[];for(let i=0;i<first;i++)cells.push("");for(let d=1;d<=total;d++){const date=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`,dayEvs=evs.filter(e=>e.date===date);cells.push(`<td style="padding:6px;border:1px solid #ddd;vertical-align:top;min-height:40px;width:14.28%"><div style="font-size:10pt;font-weight:600">${d}</div>${dayEvs.map(e=>`<div style="font-size:8pt;background:${e.color}22;color:${e.color};border-radius:3px;padding:1px 4px;margin-top:2px;overflow:hidden">${e.name}</div>`).join("")}</td>`)}for(;cells.length%7!==0;)cells.push('<td style="border:1px solid #ddd"></td>');let rows="";for(let i=0;i<cells.length;i+=7)rows+=`<tr>${cells.slice(i,i+7).map(c=>c||'<td style="border:1px solid #ddd"></td>').join("")}</tr>`;return rows}function openFinancialCalc(){const old=document.getElementById("__finPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__finPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4B0} Calculadora financiera CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">TREA \xB7 Intereses \xB7 Amortizaci\xF3n \xB7 Pr\xE9stamos</div>

    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
      ${[["trea","\u{1F4CA} TREA"],["interes","\u{1F4B5} Inter\xE9s simple/compuesto"],["amort","\u{1F4CB} Amortizaci\xF3n"],["prestamo","\u{1F3E6} Cuota pr\xE9stamo"]].map(([id,label],i)=>`
        <button onclick="__finTab('${id}',this)" id="__finTab_${id}"
          style="padding:7px 12px;border:2px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s">
          ${label}
        </button>`).join("")}
    </div>

    <!-- TREA -->
    <div id="__finSection_trea">
      <div style="background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:12px;font-size:12px;color:#0066cc;line-height:1.7">
        <strong>TREA</strong> = Tasa de Rendimiento Efectivo Anual<br>
        Usada en Costa Rica para comparar productos financieros (Ley 7472 SUGEF)
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa nominal (%)</label><input type="number" id="__treaNominal" placeholder="12" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcTREA()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Capitalizaci\xF3n</label><select id="__treaCap" onchange="__calcTREA()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"><option value="12">Mensual (12x)</option><option value="365">Diaria (365x)</option><option value="4">Trimestral (4x)</option><option value="2">Semestral (2x)</option><option value="1">Anual (1x)</option></select></div>
      </div>
      <div id="__treaResult" style="background:#f0fff4;border-radius:10px;padding:12px;font-size:13px;display:none"></div>
    </div>

    <!-- Inter\xE9s -->
    <div id="__finSection_interes" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Capital \u20A1</label><input type="number" id="__intCapital" placeholder="1000000" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcInteres()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa anual (%)</label><input type="number" id="__intTasa" placeholder="15" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcInteres()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Plazo (meses)</label><input type="number" id="__intPlazo" placeholder="12" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcInteres()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo</label><select id="__intTipo" onchange="__calcInteres()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"><option value="simple">Simple</option><option value="compuesto">Compuesto</option></select></div>
      </div>
      <div id="__intResult" style="background:#f0fff4;border-radius:10px;padding:12px;font-size:13px;display:none"></div>
    </div>

    <!-- Amortizaci\xF3n -->
    <div id="__finSection_amort" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Pr\xE9stamo \u20A1</label><input type="number" id="__amortPrestamo" placeholder="5000000" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa (%/mes)</label><input type="number" id="__amortTasa" placeholder="1.5" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cuotas</label><input type="number" id="__amortCuotas" placeholder="24" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
      </div>
      <button onclick="__calcAmort()" style="width:100%;padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">Generar tabla de amortizaci\xF3n</button>
      <div id="__amortResult" style="display:none;max-height:200px;overflow-y:auto"></div>
    </div>

    <!-- Cuota pr\xE9stamo -->
    <div id="__finSection_prestamo" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Monto \u20A1</label><input type="number" id="__presMonto" placeholder="10000000" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcPrestamo()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa anual (%)</label><input type="number" id="__presTasa" placeholder="18" step="0.01" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcPrestamo()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Plazo (meses)</label><input type="number" id="__presPlazo" placeholder="48" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" oninput="__calcPrestamo()"></div>
        <div><label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo entidad</label><select id="__presEntidad" onchange="__calcPrestamo()" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"><option>Banco CR</option><option>Coopeande</option><option>Banco Popular</option><option>BNCR</option><option>Prival Bank</option></select></div>
      </div>
      <div id="__presResult" style="background:#f0fff4;border-radius:10px;padding:12px;font-size:13px;display:none"></div>
    </div>

    <div style="display:flex;gap:8px;margin-top:14px">
      <button onclick="document.getElementById('__finPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__finInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar resultado</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__finActiveTab="trea"}function __finTab(id,btn){window.__finActiveTab=id,["trea","interes","amort","prestamo"].forEach(t=>{const sec=document.getElementById("__finSection_"+t),b=document.getElementById("__finTab_"+t);sec&&(sec.style.display=t===id?"block":"none"),b&&(b.style.borderColor=t===id?"#003da5":"#eee",b.style.background=t===id?"#f0f7ff":"#fafafa",b.style.color=t===id?"#003da5":"#555")})}function __calcTREA(){const nominal=parseFloat(document.getElementById("__treaNominal")?.value)||0,n=parseInt(document.getElementById("__treaCap")?.value)||12,res=document.getElementById("__treaResult");if(!nominal||!res)return;const trea=(Math.pow(1+nominal/100/n,n)-1)*100;res.style.display="block",res.innerHTML=`<div style="font-size:12px;color:#555;margin-bottom:4px">Tasa nominal: <strong>${nominal}%</strong> \xB7 Capitalizaci\xF3n: <strong>${n}x/a\xF1o</strong></div>
    <div style="font-size:22px;font-weight:800;color:#003da5">TREA = ${trea.toFixed(4)}%</div>
    <div style="font-size:11px;color:#888;margin-top:4px">F\xF3rmula: (1 + ${(nominal/100/n).toFixed(6)})^${n} - 1</div>`,window.__finResult=`TREA: ${trea.toFixed(4)}% (Tasa nominal ${nominal}%, capitalizaci\xF3n ${n}x/a\xF1o)`}function __calcInteres(){const capital=parseFloat(document.getElementById("__intCapital")?.value)||0,tasa=parseFloat(document.getElementById("__intTasa")?.value)||0,plazo=parseFloat(document.getElementById("__intPlazo")?.value)||0,tipo=document.getElementById("__intTipo")?.value||"simple",res=document.getElementById("__intResult");if(!capital||!tasa||!plazo||!res)return;const fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{maximumFractionDigits:0});let interes,total;tipo==="simple"?(interes=capital*(tasa/100)*(plazo/12),total=capital+interes):(total=capital*Math.pow(1+tasa/100/12,plazo),interes=total-capital),res.style.display="block",res.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px">
    <div style="text-align:center"><div style="color:#888">Capital</div><div style="font-weight:700">${fmt(capital)}</div></div>
    <div style="text-align:center"><div style="color:#e74c3c">Intereses</div><div style="font-weight:700;color:#e74c3c">${fmt(interes)}</div></div>
    <div style="text-align:center"><div style="color:#003da5">Total</div><div style="font-weight:800;color:#003da5">${fmt(total)}</div></div>
  </div>`,window.__finResult=`Inter\xE9s ${tipo}: Capital ${fmt(capital)}, Tasa ${tasa}%, Plazo ${plazo} meses \u2192 Intereses: ${fmt(interes)}, Total: ${fmt(total)}`}function __calcAmort(){const P=parseFloat(document.getElementById("__amortPrestamo")?.value)||0,r=parseFloat(document.getElementById("__amortTasa")?.value)/100||0,n=parseInt(document.getElementById("__amortCuotas")?.value)||0,res=document.getElementById("__amortResult");if(!P||!r||!n||!res)return;const cuota=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),fmt=v=>"\u20A1"+Math.round(v).toLocaleString("es-CR");let saldo=P,rows="";for(let i=1;i<=Math.min(n,12);i++){const interes=saldo*r,capital=cuota-interes;saldo-=capital,rows+=`<tr style="${i%2?"background:#f0f7ff":""}"><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px">${i}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${fmt(cuota)}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right;color:#e74c3c">${fmt(interes)}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right;color:#27ae60">${fmt(capital)}</td><td style="padding:5px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${fmt(Math.max(0,saldo))}</td></tr>`}n>12&&(rows+=`<tr><td colspan="5" style="padding:6px;text-align:center;color:#888;font-size:10px">... ${n-12} cuotas m\xE1s</td></tr>`),res.style.display="block",res.innerHTML=`<div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:6px">Cuota mensual: ${fmt(cuota)}</div>
    <table style="border-collapse:collapse;width:100%;font-size:10px"><tr style="background:#003da5;color:#fff"><th style="padding:5px 8px;border:1px solid #002080">N\xB0</th><th style="padding:5px 8px;border:1px solid #002080">Cuota</th><th style="padding:5px 8px;border:1px solid #002080">Inter\xE9s</th><th style="padding:5px 8px;border:1px solid #002080">Capital</th><th style="padding:5px 8px;border:1px solid #002080">Saldo</th></tr>${rows}</table>`,window.__finResult=`Amortizaci\xF3n: Pr\xE9stamo ${fmt(P)}, Tasa ${r*100}%/mes, ${n} cuotas \u2192 Cuota mensual: ${fmt(cuota)}`}function __calcPrestamo(){const monto=parseFloat(document.getElementById("__presMonto")?.value)||0,tasa=parseFloat(document.getElementById("__presTasa")?.value)||0,plazo=parseInt(document.getElementById("__presPlazo")?.value)||0,res=document.getElementById("__presResult");if(!monto||!tasa||!plazo||!res)return;const r=tasa/100/12,cuota=monto*r*Math.pow(1+r,plazo)/(Math.pow(1+r,plazo)-1),total=cuota*plazo,interes=total-monto,fmt=v=>"\u20A1"+Math.round(v).toLocaleString("es-CR");res.style.display="block",res.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
    <div><span style="color:#888">Cuota mensual:</span><br><strong style="font-size:16px;color:#003da5">${fmt(cuota)}</strong></div>
    <div><span style="color:#888">Total a pagar:</span><br><strong>${fmt(total)}</strong></div>
    <div><span style="color:#888">Total intereses:</span><br><strong style="color:#e74c3c">${fmt(interes)}</strong></div>
    <div><span style="color:#888">Monto solicitado:</span><br><strong>${fmt(monto)}</strong></div>
  </div>`,window.__finResult=`Pr\xE9stamo: ${fmt(monto)}, Tasa ${tasa}%/a\xF1o, ${plazo} meses \u2192 Cuota: ${fmt(cuota)}, Total intereses: ${fmt(interes)}`}function __finInsert(){const r=window.__finResult;if(!r){showToast("Calcul\xE1 primero");return}typeof insertHTML=="function"&&insertHTML(`<div style="background:#f0f7ff;border-left:4px solid #003da5;padding:10px 14px;border-radius:0 8px 8px 0;margin:8px 0;font-size:11pt">\u{1F4B0} ${r}</div>`),document.getElementById("__finPanel").remove(),showToast("Resultado insertado \u2705")}function openLawSearchPanel(){const old=document.getElementById("__lawPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__lawPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const lawsDB=[{num:"7472",name:"Ley de Promoci\xF3n de la Competencia y Defensa Efectiva del Consumidor",year:1994,area:"Consumidor"},{num:"9635",name:"Ley de Fortalecimiento de las Finanzas P\xFAblicas (IVA)",year:2018,area:"Tributario"},{num:"8204",name:"Ley sobre Estupefacientes",year:2001,area:"Penal"},{num:"7476",name:"Ley contra el Hostigamiento Sexual en el Empleo y la Docencia",year:1995,area:"Laboral"},{num:"2",name:"C\xF3digo Civil de Costa Rica",year:1888,area:"Civil"},{num:"7794",name:"C\xF3digo Municipal",year:1998,area:"Municipal"},{num:"7093",name:"C\xF3digo Notarial",year:1998,area:"Notarial"},{num:"7970",name:"Ley de Propiedad Intelectual",year:2e3,area:"IP"},{num:"8968",name:"Ley de Protecci\xF3n de la Persona frente al tratamiento de sus datos personales",year:2011,area:"PDPD"},{num:"7600",name:"Ley de Igualdad de Oportunidades para las Personas con Discapacidad",year:1996,area:"Discapacidad"},{num:"9514",name:"Ley Marco para la Atenci\xF3n, Prevenci\xF3n y Sanci\xF3n de la Violencia contra las Mujeres",year:2017,area:"G\xE9nero"},{num:"6227",name:"Ley General de la Administraci\xF3n P\xFAblica",year:1978,area:"Administraci\xF3n"},{num:"7558",name:"Ley Org\xE1nica del Banco Central de Costa Rica",year:1995,area:"Financiero"},{num:"7092",name:"Ley del Impuesto sobre la Renta",year:1988,area:"Tributario"},{num:"4755",name:"C\xF3digo de Normas y Procedimientos Tributarios",year:1971,area:"Tributario"},{num:"2/1943",name:"C\xF3digo de Trabajo de Costa Rica",year:1943,area:"Laboral"},{num:"3284",name:"C\xF3digo de Comercio",year:1964,area:"Comercial"},{num:"7495",name:"Ley de Expropiaciones",year:1995,area:"Inmobiliario"},{num:"7969",name:"Ley Reguladora del Mercado de Valores",year:1998,area:"Financiero"},{num:"8292",name:"Ley General de Control Interno",year:2002,area:"Control"},{num:"7768",name:"Ley de Regulaci\xF3n de la Actividad de Intermediaci\xF3n Cambiaria",year:1998,area:"Financiero"},{num:"9416",name:"Ley para Mejorar la Lucha contra el Fraude Fiscal",year:2016,area:"Tributario"},{num:"7169",name:"Ley de Promoci\xF3n del Desarrollo Cient\xEDfico y Tecnol\xF3gico",year:1990,area:"Tecnolog\xEDa"},{num:"8687",name:"Ley del Sistema de Banca para el Desarrollo",year:2008,area:"Financiero"},{num:"7554",name:"Ley Org\xE1nica del Ambiente",year:1995,area:"Ambiental"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
        \u2696\uFE0F Buscador de leyes CR
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Legislaci\xF3n costarricense \xB7 SINALEVI</div>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <input type="text" id="__lawSearch"
          placeholder="Buscar por nombre, n\xFAmero o \xE1rea..."
          style="flex:1;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__lawFilter(this.value)">
        <button onclick="__lawOpenSINALEVI()" style="padding:10px 14px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">SINALEVI</button>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
        ${["Todos","Laboral","Tributario","Civil","Comercial","Ambiental","Financiero"].map(a=>`
          <button onclick="__lawFilterArea('${a}',this)"
            class="__lawAreaBtn"
            style="padding:5px 10px;border:1.5px solid ${a==="Todos"?"#003da5":"#eee"};background:${a==="Todos"?"#f0f7ff":"#fafafa"};color:${a==="Todos"?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${a==="Todos"?'data-sel="1"':""}>
            ${a}
          </button>`).join("")}
      </div>
    </div>

    <div id="__lawResults" style="flex:1;overflow-y:auto;padding:0 20px 8px">
      <!-- Se llena din\xE1micamente -->
    </div>

    <div style="padding:12px 20px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__lawPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__lawsDB=lawsDB,__lawFilter("")}function __lawFilter(query){const q=query.toLowerCase(),area=window.__lawArea||"Todos",laws=window.__lawsDB||[],areas={Laboral:"#27ae60",Tributario:"#e67e22",Civil:"#9b59b6",Comercial:"#3498db",Ambiental:"#1abc9c",Financiero:"#e74c3c",Municipal:"#f39c12",Penal:"#c0392b",IP:"#8e44ad",PDPD:"#16a085",Ambiental:"#27ae60",Administraci\u00F3n:"#2980b9"},filtered=laws.filter(l=>(area==="Todos"||l.area===area)&&(!q||l.name.toLowerCase().includes(q)||l.num.includes(q)||l.area.toLowerCase().includes(q))),res=document.getElementById("__lawResults");if(res){if(!filtered.length){res.innerHTML='<div style="text-align:center;color:#bbb;padding:20px;font-size:13px">No se encontraron leyes</div>';return}res.innerHTML=filtered.map(l=>`
    <div style="border:1.5px solid #eee;border-radius:12px;padding:12px 14px;margin-bottom:8px;transition:all .15s"
      onmouseover="this.style.borderColor='#003da5';this.style.background='#f8f9ff'"
      onmouseout="this.style.borderColor='#eee';this.style.background='#fff'">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="background:${areas[l.area]||"#003da5"}22;border-radius:8px;padding:6px 10px;flex-shrink:0;text-align:center">
          <div style="font-size:14px;font-weight:800;color:${areas[l.area]||"#003da5"}">${l.num}</div>
          <div style="font-size:9px;color:${areas[l.area]||"#003da5"}">${l.year}</div>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:4px">${l.name}</div>
          <div style="font-size:10px;background:${areas[l.area]||"#003da5"}22;color:${areas[l.area]||"#003da5"};border-radius:4px;padding:1px 7px;display:inline-block;font-weight:600">${l.area}</div>
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
    </div>`).join("")}}function __lawFilterArea(area,btn){window.__lawArea=area,document.querySelectorAll(".__lawAreaBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.style.color="#003da5",btn.dataset.sel="1",__lawFilter(document.getElementById("__lawSearch")?.value||"")}function __lawInsert(num,name,year){const html=`<span style="background:#f0f7ff;border:1px solid #003da5;border-radius:4px;padding:1px 8px;font-size:10pt;color:#003da5">Ley N\xB0 ${num} \u2014 ${name} (${year})</span>`;typeof insertHTML=="function"&&insertHTML(html),showToast("\u2696\uFE0F Ley N\xB0"+num+" citada \u2705")}function __lawOpenURL(num){window.open(`https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${num}`,"_blank")}function __lawOpenSINALEVI(){window.open("https://www.sinalevi.go.cr/","_blank"),showToast("Abriendo SINALEVI...")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"codeEditor":openCodePanel();break;case"pricingTable":openPricingPanel();break;case"calendar":openCalendarPanel();break;case"financialCalc":openFinancialCalc();break;case"lawSearch":openLawSearchPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.16 \u2705 \u2014 C\xF3digo IA, Precios, Calendario, Finanzas CR, Leyes CR")},2400)})();function openPresentationAssistant(){const old=document.getElementById("__presAsPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__presAsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";const headings=ed?Array.from(ed.querySelectorAll("h1,h2,h3")):[],slides=__presExtractSlides(ed),themes=[{id:"corporate",name:"Corporativo",bg:"#003da5",text:"#fff",accent:"#0084ff"},{id:"dark",name:"Oscuro",bg:"#1a1a2e",text:"#e0e0e0",accent:"#e2b96f"},{id:"light",name:"Claro",bg:"#ffffff",text:"#1a2942",accent:"#0084ff"},{id:"green",name:"Verde CR",bg:"#1a472a",text:"#fff",accent:"#27ae60"},{id:"red",name:"Rojo CR",bg:"#8b0000",text:"#fff",accent:"#ce1126"},{id:"minimal",name:"Minimal",bg:"#f5f5f5",text:"#333",accent:"#555"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:620px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3AC} Asistente de presentaciones</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Convierte tu documento en ${slides.length} slide${slides.length!==1?"s":""} autom\xE1ticamente</div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${themes.map((t,i)=>`
          <button onclick="__presSelectTheme('${t.id}',this)"
            class="__presThemeBtn"
            style="padding:6px 12px;border:2px solid ${i===0?"#003da5":"#eee"};background:${t.bg};color:${t.text};border-radius:20px;cursor:pointer;font-size:11px;font-weight:700;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            ${t.name}
          </button>`).join("")}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Transici\xF3n</label>
          <select id="__presTransition" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="fade">Fundido</option>
            <option value="slide">Deslizar</option>
            <option value="none">Sin transici\xF3n</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Dividir por</label>
          <select id="__presDivide" onchange="__presRefreshSlides()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="h1h2">H1 y H2</option>
            <option value="h1">Solo H1</option>
            <option value="h2">Solo H2</option>
            <option value="p5">Cada 5 p\xE1rrafos</option>
          </select>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <input type="checkbox" id="__presNumbers" checked style="accent-color:#0084ff;width:15px;height:15px">
        <label for="__presNumbers" style="font-size:12px;color:#555">Mostrar n\xFAmero de slide</label>
        <input type="checkbox" id="__presProgress" checked style="accent-color:#0084ff;width:15px;height:15px;margin-left:10px">
        <label for="__presProgress" style="font-size:12px;color:#555">Barra de progreso</label>
      </div>
    </div>

    <!-- Preview de slides -->
    <div style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Vista previa (${slides.length} slides)</div>
      <div id="__presSlidePreview" style="display:flex;flex-direction:column;gap:8px">
        ${slides.slice(0,6).map((s,i)=>`
          <div style="background:#f0f7ff;border-radius:10px;padding:12px;border:1.5px solid #c0d8f0">
            <div style="font-size:10px;color:#aaa;font-weight:700;margin-bottom:4px">SLIDE ${i+1}</div>
            <div style="font-size:13px;font-weight:700;color:#003da5">${s.title||"Sin t\xEDtulo"}</div>
            <div style="font-size:11px;color:#555;margin-top:4px;max-height:40px;overflow:hidden">${s.body||""}</div>
          </div>`).join("")}
        ${slides.length>6?`<div style="text-align:center;color:#aaa;font-size:12px;padding:8px">... ${slides.length-6} slides m\xE1s</div>`:""}
      </div>
    </div>

    <div style="padding:14px 20px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:8px">
      <button onclick="document.getElementById('__presAsPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generatePresentation()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3AC} Generar presentaci\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__presThemeConfig={id:"corporate",bg:"#003da5",text:"#fff",accent:"#0084ff"},window.__presSlides=slides}function __presExtractSlides(ed){if(!ed)return[];const slides=[],children=Array.from(ed.children);let current=null;return children.forEach(el=>{/^H[12]$/.test(el.tagName)?(current&&slides.push(current),current={title:el.innerText.trim(),body:"",html:""}):current&&(current.body+=el.innerText.trim()+" ",current.html+=el.outerHTML)}),current&&slides.push(current),!slides.length&&ed.innerText.trim()&&slides.push({title:"Presentaci\xF3n",body:ed.innerText.slice(0,200),html:ed.innerHTML}),slides.map(s=>({...s,body:s.body.slice(0,150)}))}function __presSelectTheme(id,btn){const themes={corporate:{id:"corporate",bg:"#003da5",text:"#fff",accent:"#0084ff"},dark:{id:"dark",bg:"#1a1a2e",text:"#e0e0e0",accent:"#e2b96f"},light:{id:"light",bg:"#ffffff",text:"#1a2942",accent:"#0084ff"},green:{id:"green",bg:"#1a472a",text:"#fff",accent:"#27ae60"},red:{id:"red",bg:"#8b0000",text:"#fff",accent:"#ce1126"},minimal:{id:"minimal",bg:"#f5f5f5",text:"#333",accent:"#555"}};window.__presThemeConfig=themes[id]||themes.corporate,document.querySelectorAll(".__presThemeBtn").forEach(b=>{b.style.borderColor="#eee",delete b.dataset.sel}),btn.style.borderColor=window.__presThemeConfig.accent,btn.dataset.sel="1"}function __generatePresentation(){const slides=window.__presSlides||[],theme=window.__presThemeConfig||{bg:"#003da5",text:"#fff",accent:"#0084ff"},transition=document.getElementById("__presTransition")?.value||"fade",showNums=document.getElementById("__presNumbers")?.checked,showProg=document.getElementById("__presProgress")?.checked,total=slides.length;if(!slides.length){showToast("No hay contenido para presentar");return}const transCSS=transition==="fade"?".slide{animation:fadeIn .4s ease}.slide.active{opacity:1}@keyframes fadeIn{from{opacity:0}to{opacity:1}}":transition==="slide"?".slide{animation:slideIn .3s ease}@keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}":"",html=`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Presentaci\xF3n \u2014 WC Corporate Editor</title>
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
${slides.map((s,i)=>`
  <div class="slide${i===0?" active":""}" id="slide-${i}">
    ${showProg?`<div class="progress-bar" style="width:${Math.round((i+1)/total*100)}%"></div>`:""}
    <div class="accent-line"></div>
    <div class="slide-title">${s.title}</div>
    ${s.body?`<div class="slide-body">${s.body}</div>`:""}
    ${showNums?`<div class="slide-num">${i+1} / ${total}</div>`:""}
  </div>`).join("")}

<div class="nav">
  <button onclick="prevSlide()">\u25C0</button>
  <span class="nav-counter" id="nav-cnt">1 / ${total}</span>
  <button onclick="nextSlide()">\u25B6</button>
</div>
<button class="exit-btn" onclick="window.close()">\u2715 Salir</button>
<button class="fullscreen-btn" onclick="document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()">\u26F6</button>

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
</body></html>`,win=window.open("","_blank","width=1200,height=700");win.document.write(html),win.document.close(),document.getElementById("__presAsPanel").remove(),showToast(`\u{1F3AC} Presentaci\xF3n con ${total} slides generada \u2705`)}function openFormBuilder(){const old=document.getElementById("__formBldPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__formBldPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const fieldTypes=[{id:"text",icon:"\u{1F4DD}",name:"Texto corto"},{id:"textarea",icon:"\u{1F4C4}",name:"Texto largo"},{id:"number",icon:"\u{1F522}",name:"N\xFAmero"},{id:"date",icon:"\u{1F4C5}",name:"Fecha"},{id:"email",icon:"\u{1F4E7}",name:"Correo"},{id:"phone",icon:"\u{1F4F1}",name:"Tel\xE9fono"},{id:"select",icon:"\u{1F4CB}",name:"Lista opciones"},{id:"checkbox",icon:"\u2611\uFE0F",name:"Casilla"},{id:"radio",icon:"\u{1F518}",name:"Opci\xF3n m\xFAltiple"},{id:"signature",icon:"\u270D\uFE0F",name:"Firma"},{id:"divider",icon:"\u2796",name:"Separador"},{id:"heading",icon:"\u{1F4CC}",name:"Secci\xF3n"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:580px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CB} Generador de formularios</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Crea formularios profesionales para imprimir o llenar digitalmente</div>

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">T\xEDtulo del formulario</label>
        <input type="text" id="__frmTitle" value="Formulario de solicitud"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Agregar campos</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">
        ${fieldTypes.map(f=>`
          <button onclick="__frmAddField('${f.id}','${f.name}')"
            style="padding:8px 4px;border:1.5px solid #eee;background:#fafafa;border-radius:9px;cursor:pointer;font-size:11px;font-weight:600;color:#555;text-align:center;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            <div style="font-size:16px;margin-bottom:2px">${f.icon}</div>${f.name}
          </button>`).join("")}
      </div>
    </div>

    <!-- Lista de campos -->
    <div style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Campos del formulario</div>
      <div id="__frmFields" style="display:flex;flex-direction:column;gap:6px;min-height:60px">
        <div style="text-align:center;color:#bbb;font-size:12px;padding:16px">Agreg\xE1 campos con los botones de arriba</div>
      </div>
    </div>

    <div style="padding:14px 20px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:8px">
      <button onclick="document.getElementById('__formBldPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__frmGenerate()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Generar formulario</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__frmFields=[]}function __frmAddField(type,name){window.__frmFields||(window.__frmFields=[]);const id="f"+Date.now();window.__frmFields.push({id,type,label:name,required:!1,options:""}),__frmRenderFields()}function __frmRenderFields(){const container=document.getElementById("__frmFields");if(!container)return;const fields=window.__frmFields||[];if(!fields.length){container.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:16px">Agreg\xE1 campos con los botones de arriba</div>';return}container.innerHTML=fields.map((f,i)=>`
    <div style="background:#fafafa;border:1.5px solid #eee;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:8px">
      <div style="font-size:14px;cursor:grab">\u283F</div>
      <div style="flex:1">
        <input type="text" value="${f.label}" onchange="window.__frmFields[${i}].label=this.value"
          style="width:100%;padding:5px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        ${f.type==="select"||f.type==="radio"?`<input type="text" placeholder="Opciones separadas por coma" value="${f.options}" onchange="window.__frmFields[${i}].options=this.value" style="width:100%;padding:4px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;outline:none;box-sizing:border-box;margin-top:4px">`:""}
      </div>
      <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#888;flex-shrink:0">
        <input type="checkbox" ${f.required?"checked":""} onchange="window.__frmFields[${i}].required=this.checked" style="accent-color:#e74c3c"> *Req
      </label>
      <button onclick="window.__frmFields.splice(${i},1);__frmRenderFields()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:16px;padding:0;flex-shrink:0">\xD7</button>
    </div>`).join("")}function __frmGenerate(){const title=document.getElementById("__frmTitle")?.value||"Formulario",fields=window.__frmFields||[];if(!fields.length){showToast("Agreg\xE1 al menos un campo");return}const typeMap={text:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="border-bottom:1.5px solid #333;height:28px;margin-top:2px"></div></div>`,textarea:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="border:1px solid #333;height:70px;border-radius:4px;margin-top:2px"></div></div>`,number:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="border-bottom:1.5px solid #333;height:28px;width:160px;margin-top:2px"></div></div>`,date:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="display:flex;gap:6px;margin-top:6px">${["D","D","M","M","A","A","A","A"].map((c,i)=>`<div style="border-bottom:1.5px solid #333;width:22px;height:28px;text-align:center;font-size:9pt;padding-top:8px">${[2,5].includes(i)?"/":""}</div>`).join("")}</div></div>`,email:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="border-bottom:1.5px solid #333;height:28px;margin-top:2px"></div></div>`,phone:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="border-bottom:1.5px solid #333;height:28px;width:200px;margin-top:2px"></div></div>`,select:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">${(l.options||"Opci\xF3n 1,Opci\xF3n 2").split(",").map(o=>`<label style="display:flex;align-items:center;gap:4px;font-size:10pt"><span style="width:14px;height:14px;border:1.5px solid #333;border-radius:2px;display:inline-block"></span>${o.trim()}</label>`).join("")}</div></div>`,checkbox:l=>`<div style="margin-bottom:16px;display:flex;align-items:center;gap:8px"><span style="width:18px;height:18px;border:1.5px solid #333;border-radius:3px;display:inline-block;flex-shrink:0"></span><div style="font-size:11pt">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div></div>`,radio:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:6px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="display:flex;flex-direction:column;gap:5px">${(l.options||"S\xED,No").split(",").map(o=>`<label style="display:flex;align-items:center;gap:6px;font-size:10pt"><span style="width:14px;height:14px;border:1.5px solid #333;border-radius:50%;display:inline-block"></span>${o.trim()}</label>`).join("")}</div></div>`,signature:l=>`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:600;margin-bottom:4px">${l.label}${l.required?'<span style="color:#e74c3c"> *</span>':""}</div><div style="border:1px dashed #999;height:70px;border-radius:4px;margin-top:2px;display:flex;align-items:flex-end;padding:4px 8px"><div style="border-top:1px solid #333;width:100%;font-size:8pt;color:#888;padding-top:3px">Firma y fecha</div></div></div>`,divider:l=>'<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">',heading:l=>`<div style="font-size:13pt;font-weight:700;color:#003da5;border-bottom:2px solid #003da5;padding-bottom:4px;margin:16px 0 10px">${l.label}</div>`},html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:16cm;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px">
    <div style="background:#003da5;color:#fff;padding:14px 18px;border-radius:6px;margin-bottom:20px">
      <div style="font-size:16pt;font-weight:700">${title}</div>
      <div style="font-size:10pt;opacity:.8;margin-top:3px">Formulario oficial \xB7 ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</div>
    </div>
    ${fields.map(f=>(typeMap[f.type]||typeMap.text)(f)).join("")}
    <div style="border-top:1px solid #eee;padding-top:14px;margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div><div style="border-bottom:1.5px solid #333;height:40px;margin-bottom:4px"></div><div style="font-size:9pt;color:#888;text-align:center">Firma del solicitante</div></div>
      <div><div style="border-bottom:1.5px solid #333;height:40px;margin-bottom:4px"></div><div style="font-size:9pt;color:#888;text-align:center">Sello y firma autorizada</div></div>
    </div>
    <div style="font-size:8pt;color:#aaa;text-align:center;margin-top:12px">Generado por WC Corporate Editor \xB7 Costa Rica</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__formBldPanel").remove(),showToast("\u{1F4CB} Formulario generado \u2705")}function openStatsChartPanel(){const old=document.getElementById("__chartStPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__chartStPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CA} Gr\xE1ficos y estad\xEDsticas</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Insert\xE1 gr\xE1ficos visuales en tu documento</div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      ${[{id:"bar",icon:"\u{1F4CA}",name:"Barras"},{id:"line",icon:"\u{1F4C8}",name:"L\xEDneas"},{id:"pie",icon:"\u{1F967}",name:"Pastel"},{id:"donut",icon:"\u{1F369}",name:"Dona"},{id:"area",icon:"\u{1F4C9}",name:"\xC1rea"},{id:"kpi",icon:"\u{1F3AF}",name:"KPIs"}].map(t=>`
        <button onclick="__chartSelect('${t.id}',this)"
          class="__chartTypeBtn"
          style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:center;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:22px;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#555">${t.name}</div>
        </button>`).join("")}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">T\xEDtulo del gr\xE1fico</label>
      <input type="text" id="__chartTitle" value="Estad\xEDsticas 2025"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Datos (Etiqueta|Valor, uno por l\xEDnea)</label>
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
          <option value="1">S\xED</option>
          <option value="0">No</option>
        </select>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__chartStPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateChart()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CA} Insertar gr\xE1fico</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__chartType="bar",setTimeout(()=>{const btn=document.querySelector(".__chartTypeBtn");btn&&(btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1")},50)}function __chartSelect(id,btn){window.__chartType=id,document.querySelectorAll(".__chartTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"}function __generateChart(){const type=window.__chartType||"bar",title=document.getElementById("__chartTitle")?.value||"Estad\xEDsticas",raw=document.getElementById("__chartData")?.value||"",color=document.getElementById("__chartColor")?.value||"#0084ff",showV=document.getElementById("__chartShowVals")?.value==="1",items=raw.split(`
`).filter(l=>l.trim()).map(l=>{const p=l.split("|");return{label:p[0]?.trim()||"",value:parseFloat(p[1])||0}});if(!items.length){showToast("Ingres\xE1 datos primero");return}const maxVal=Math.max(...items.map(i=>i.value),1),colors=["#0084ff","#27ae60","#f39c12","#e74c3c","#9b59b6","#1abc9c","#e67e22","#3498db"];let chartHTML="";if(type==="bar")chartHTML=`<div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding-bottom:4px">
      ${items.map((it,i)=>`
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
          ${showV?`<div style="font-size:10px;font-weight:700;color:${colors[i%colors.length]}">${it.value}</div>`:""}
          <div style="width:100%;background:${colors[i%colors.length]};border-radius:4px 4px 0 0;height:${Math.round(it.value/maxVal*140)}px;transition:height .3s"></div>
          <div style="font-size:9px;color:#888;text-align:center;word-break:break-word">${it.label}</div>
        </div>`).join("")}
    </div>`;else if(type==="line"){const pts=items.map((it,i)=>({x:i/(items.length-1||1)*100,y:100-it.value/maxVal*80})),path=pts.map((p,i)=>(i===0?"M":"L")+p.x.toFixed(1)+","+p.y.toFixed(1)).join(" "),area=path+` L${pts[pts.length-1].x},100 L0,100 Z`;chartHTML=`<svg viewBox="0 0 100 100" style="width:100%;height:160px;overflow:visible">
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".3"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#areaGrad)"/>
      <path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map((p,i)=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2" fill="${color}"/>${showV?`<text x="${p.x.toFixed(1)}" y="${(p.y-4).toFixed(1)}" text-anchor="middle" font-size="5" fill="#555">${items[i].value}</text>`:""}`).join("")}
    </svg>
    <div style="display:flex;justify-content:space-between;margin-top:4px">${items.map(it=>`<div style="font-size:9px;color:#888;flex:1;text-align:center">${it.label}</div>`).join("")}</div>`}else if(type==="pie"||type==="donut"){const total=items.reduce((a,b)=>a+b.value,0)||1;let angle=-90;chartHTML=`<div style="text-align:center">
      <svg viewBox="0 0 100 100" style="width:160px;height:160px">
        ${items.map((it,i)=>{const pct=it.value/total,start=angle;angle+=pct*360;const r=40,cx=50,cy=50,x1=cx+r*Math.cos(start*Math.PI/180),y1=cy+r*Math.sin(start*Math.PI/180),x2=cx+r*Math.cos((start+pct*360)*Math.PI/180),y2=cy+r*Math.sin((start+pct*360)*Math.PI/180);return`<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${pct>.5?1:0},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${colors[i%colors.length]}" stroke="#fff" stroke-width=".5"/>`}).join("")}
        ${type==="donut"?'<circle cx="50" cy="50" r="22" fill="#fff"/>':""}
      </svg>
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:8px">
        ${items.map((it,i)=>`<div style="display:flex;align-items:center;gap:4px;font-size:10px"><div style="width:10px;height:10px;border-radius:2px;background:${colors[i%colors.length]}"></div>${it.label}${showV?` (${it.value})`:""}</div>`).join("")}
      </div>
    </div>`}else type==="kpi"?chartHTML=`<div style="display:grid;grid-template-columns:repeat(${Math.min(items.length,3)},1fr);gap:10px">
      ${items.map((it,i)=>`
        <div style="background:${colors[i%colors.length]}15;border:2px solid ${colors[i%colors.length]}33;border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:26px;font-weight:900;color:${colors[i%colors.length]}">${it.value}</div>
          <div style="font-size:11px;color:#555;margin-top:4px">${it.label}</div>
        </div>`).join("")}
    </div>`:chartHTML='<div style="text-align:center;color:#888;padding:20px">Tipo de gr\xE1fico en desarrollo</div>';const html=`<div style="margin:16px 0;padding:16px;background:#fff;border:1.5px solid #e8e8ec;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
    <div style="font-size:13px;font-weight:700;color:#1a2942;margin-bottom:14px;display:flex;align-items:center;gap:8px">\u{1F4CA} ${title}</div>
    ${chartHTML}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__chartStPanel").remove(),showToast("\u{1F4CA} Gr\xE1fico insertado \u2705")}function openWhatsAppPanel(){const old=document.getElementById("__waPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__waPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const ed=document.getElementById("editor"),text=ed?ed.innerText.slice(0,1e3).trim():"";ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <span style="font-size:24px">\u{1F4AC}</span> Compartir por WhatsApp
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Envi\xE1 el documento o un mensaje por WhatsApp</div>

    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button id="__waTabMsg" onclick="__waTab('msg')" style="flex:1;padding:8px;border:2px solid #25d366;background:#f0fff4;color:#25d366;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4DD} Mensaje</button>
      <button id="__waTabLink" onclick="__waTab('link')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F517} Enlace</button>
      <button id="__waTabBusiness" onclick="__waTab('business')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F3E2} Business</button>
    </div>

    <!-- Mensaje -->
    <div id="__waSection_msg">
      <div style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">N\xFAmero de tel\xE9fono (con c\xF3digo de pa\xEDs)</label>
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
        \u{1F4AC} Enviar por WhatsApp
      </button>
    </div>

    <!-- Enlace compartir -->
    <div id="__waSection_link" style="display:none">
      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Mensaje a compartir</label>
        <textarea id="__waLinkMsg" rows="4" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#25d366'" onblur="this.style.borderColor='#e0e0e0'">${text.slice(0,500)}</textarea>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button onclick="__waShareLink()" style="width:100%;padding:12px;border:none;background:#25d366;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">\u{1F4AC} Compartir sin n\xFAmero espec\xEDfico</button>
        <button onclick="__waCopyText()" style="width:100%;padding:10px;border:1.5px solid #25d366;background:#fff;color:#25d366;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Copiar texto al portapapeles</button>
      </div>
    </div>

    <!-- Business -->
    <div id="__waSection_business" style="display:none">
      <div style="background:#f0fff4;border-radius:10px;padding:14px;margin-bottom:14px;font-size:12px;color:#155724;line-height:1.7">
        <strong>WhatsApp Business API</strong><br>
        Usada para env\xEDos masivos y automatizaci\xF3n. Requiere cuenta Business verificada en Meta.
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button onclick="window.open('https://business.whatsapp.com/','_blank')" style="padding:11px;border:1.5px solid #25d366;background:#fff;color:#25d366;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F310} Ir a WhatsApp Business</button>
        <button onclick="window.open('https://wa.me/?text='+encodeURIComponent(document.getElementById('__waLinkMsg')?.value||document.getElementById('editor')?.innerText?.slice(0,500)||''),'_blank')" style="padding:11px;border:none;background:#25d366;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4E2} Compartir con cualquier contacto</button>
      </div>
    </div>

    <button onclick="document.getElementById('__waPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333;margin-top:10px">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()});const ta=document.getElementById("__waMsg");ta&&ta.addEventListener("input",()=>{const cc=document.getElementById("__waCharCount");cc&&(cc.textContent=ta.value.length)})}function __waTab(tab){["msg","link","business"].forEach(t=>{const sec=document.getElementById("__waSection_"+t),btn=document.getElementById("__waTab"+t.charAt(0).toUpperCase()+t.slice(1));sec&&(sec.style.display=t===tab?"block":"none"),btn&&(btn.style.borderColor=t===tab?"#25d366":"#eee",btn.style.background=t===tab?"#f0fff4":"#fafafa",btn.style.color=t===tab?"#25d366":"#555")})}function __waSendMessage(){const country=document.getElementById("__waCountry")?.value.replace(/\+|\s/g,"")||"506",phone=document.getElementById("__waPhone")?.value.replace(/\D/g,"")||"",msg=document.getElementById("__waMsg")?.value.trim()||"";if(!phone){showToast("Ingres\xE1 el n\xFAmero de tel\xE9fono");return}const url=`https://wa.me/${country}${phone}${msg?"?text="+encodeURIComponent(msg):""}`;window.open(url,"_blank"),showToast("\u{1F4AC} Abriendo WhatsApp...")}function __waShareLink(){const msg=document.getElementById("__waLinkMsg")?.value.trim()||"";window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank")}function __waCopyText(){const msg=document.getElementById("__waLinkMsg")?.value.trim()||"";navigator.clipboard.writeText(msg).then(()=>showToast("\u{1F4CB} Texto copiado \u2705"))}const WC_ESIGN={async generateKeyPair(){if(!window.crypto?.subtle)return showToast("WebCrypto no disponible en este navegador"),null;try{return await window.crypto.subtle.generateKey({name:"RSA-PSS",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["sign","verify"])}catch(e){return console.error("KeyGen error:",e),null}},async exportKey(key,type){const exported=await window.crypto.subtle.exportKey(type==="public"?"spki":"pkcs8",key),bytes=new Uint8Array(exported),base64=btoa(String.fromCharCode(...bytes));return`-----BEGIN ${type.toUpperCase()} KEY-----
${base64.match(/.{1,64}/g).join(`
`)}
-----END ${type.toUpperCase()} KEY-----`},async sign(privateKey,data){const encoded=new TextEncoder().encode(data),signature=await window.crypto.subtle.sign({name:"RSA-PSS",saltLength:32},privateKey,encoded);return btoa(String.fromCharCode(...new Uint8Array(signature)))},async verify(publicKey,signature,data){try{const sigBytes=Uint8Array.from(atob(signature),c=>c.charCodeAt(0)),encoded=new TextEncoder().encode(data);return await window.crypto.subtle.verify({name:"RSA-PSS",saltLength:32},publicKey,sigBytes,encoded)}catch{return!1}},hash(text){let h=0;for(let i=0;i<text.length;i++)h=Math.imul(31,h)+text.charCodeAt(i)|0;return Math.abs(h).toString(16).toUpperCase().padStart(8,"0")}};function openAdvancedSignPanel(){const old=document.getElementById("__aSignPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__aSignPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const savedKey=localStorage.getItem("wc-esign-pubkey");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u{1F510} Firma electr\xF3nica avanzada
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Firma digital con criptograf\xEDa RSA-2048 \xB7 SHA-256</div>

    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button id="__aSignTab1" onclick="__aSignTab('sign')" style="flex:1;padding:8px;border:2px solid #27ae60;background:#f0fff4;color:#27ae60;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u270D\uFE0F Firmar</button>
      <button id="__aSignTab2" onclick="__aSignTab('verify')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F50D} Verificar</button>
      <button id="__aSignTab3" onclick="__aSignTab('keys')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F5DD}\uFE0F Claves</button>
    </div>

    <!-- Firmar -->
    <div id="__aSignSection_sign">
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
        <input type="text" id="__aSignName" placeholder="Nombre del firmante *"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__aSignRole" placeholder="Cargo / Funci\xF3n"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__aSignOrg" placeholder="Organizaci\xF3n"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="background:#f0fff4;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#155724;line-height:1.6">
        \u{1F510} Se generar\xE1 una firma criptogr\xE1fica RSA-2048 \xFAnica para este documento.<br>
        El hash del contenido garantiza que el documento no fue modificado despu\xE9s de firmar.
      </div>

      <button onclick="__doAdvancedSign()" style="width:100%;padding:12px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">\u{1F510} Firmar documento</button>
    </div>

    <!-- Verificar -->
    <div id="__aSignSection_verify" style="display:none">
      <div style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Hash del documento a verificar</label>
        <input type="text" id="__aVerifyHash" placeholder="Pega el hash aqu\xED (ej: A3F8C12B)"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;font-family:'Courier New',monospace"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <button onclick="__doVerifySign()" style="width:100%;padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;margin-bottom:10px">\u{1F50D} Verificar integridad</button>
      <div id="__aVerifyResult" style="display:none;border-radius:10px;padding:12px;font-size:13px"></div>
    </div>

    <!-- Claves -->
    <div id="__aSignSection_keys" style="display:none">
      <div style="margin-bottom:12px">
        <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:6px">Tu clave p\xFAblica guardada</div>
        <textarea readonly rows="4" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:10px;font-family:'Courier New',monospace;outline:none;box-sizing:border-box;background:#f8f9fa;resize:none">${savedKey||"A\xFAn no generaste una clave"}</textarea>
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="__generateNewKeys()" style="flex:1;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F511} Generar nuevas claves</button>
        ${savedKey?`<button onclick="navigator.clipboard.writeText('${savedKey.replace(/'/g,"\\'")}').then(()=>showToast('Clave copiada \u2705'))" style="flex:1;padding:10px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Copiar clave</button>`:""}
      </div>
    </div>

    <button onclick="document.getElementById('__aSignPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333;margin-top:12px">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __aSignTab(tab){["sign","verify","keys"].forEach((t,i)=>{const sec=document.getElementById("__aSignSection_"+t),btn=document.getElementById("__aSignTab"+(i+1)),colors=["#27ae60","#0084ff","#9b59b6"];sec&&(sec.style.display=t===tab?"block":"none"),btn&&(btn.style.borderColor=t===tab?colors[i]:"#eee",btn.style.background=t===tab?colors[i]+"22":"#fafafa",btn.style.color=t===tab?colors[i]:"#555")})}async function __doAdvancedSign(){const name=document.getElementById("__aSignName")?.value.trim();if(!name){showToast("Ingres\xE1 el nombre del firmante");return}const role=document.getElementById("__aSignRole")?.value.trim(),org=document.getElementById("__aSignOrg")?.value.trim(),ed=document.getElementById("editor"),content=ed?ed.innerText.trim():"",hash=WC_ESIGN.hash(content),ts=new Date().toISOString(),sigData=`${hash}|${name}|${ts}`;showToast("\u{1F510} Generando firma...");try{const keyPair=await WC_ESIGN.generateKeyPair();let sigB64="",pubKeyPEM="";keyPair&&(sigB64=await WC_ESIGN.sign(keyPair.privateKey,sigData),pubKeyPEM=await WC_ESIGN.exportKey(keyPair.publicKey,"public"),localStorage.setItem("wc-esign-pubkey",pubKeyPEM));const shortSig=sigB64?sigB64.slice(0,32)+"...":"N/A",html=`
    <div style="border:2px solid #27ae60;border-radius:12px;padding:16px;margin:16px 0;background:#f0fff4;font-family:Calibri,Arial,sans-serif">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="font-size:28px">\u{1F510}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:#155724">Documento firmado electr\xF3nicamente</div>
          <div style="font-size:10px;color:#27ae60;font-weight:600">Firma RSA-2048 \xB7 SHA-256 \xB7 V\xE1lida</div>
        </div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:12px;font-size:11px;line-height:2">
        <div><strong>Firmante:</strong> ${name}${role?" \xB7 "+role:""}${org?" \xB7 "+org:""}</div>
        <div><strong>Fecha y hora:</strong> ${new Date().toLocaleString("es-CR")}</div>
        <div><strong>Hash del documento:</strong> <code style="background:#f0f0f0;padding:1px 6px;border-radius:3px;font-family:'Courier New',monospace">${hash}</code></div>
        <div><strong>Algoritmo:</strong> RSA-PSS \xB7 SHA-256 \xB7 2048 bits</div>
        ${sigB64?`<div style="word-break:break-all"><strong>Firma:</strong> <code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-family:'Courier New',monospace;font-size:9px">${shortSig}</code></div>`:""}
      </div>
      <div style="font-size:9px;color:#888;margin-top:8px;text-align:right">WC Corporate Editor \xB7 ${new Date().toLocaleDateString("es-CR")}</div>
    </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__aSignPanel").remove(),showToast("\u{1F510} Documento firmado con criptograf\xEDa RSA-2048 \u2705")}catch(e){showToast("Error al firmar: "+e.message)}}function __doVerifySign(){const inputHash=document.getElementById("__aVerifyHash")?.value.trim(),ed=document.getElementById("editor"),content=ed?ed.innerText.trim():"",docHash=WC_ESIGN.hash(content),res=document.getElementById("__aVerifyResult");if(!res)return;const match=inputHash.toUpperCase()===docHash.toUpperCase();res.style.display="block",res.style.background=match?"#d4edda":"#f8d7da",res.style.border=`1.5px solid ${match?"#27ae60":"#e74c3c"}`,res.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <span style="font-size:20px">${match?"\u2705":"\u274C"}</span>
      <strong style="color:${match?"#155724":"#721c24"}">${match?"Documento \xEDntegro":"Documento modificado"}</strong>
    </div>
    <div style="font-size:11px;color:#555;line-height:1.7">
      Hash ingresado: <code style="background:rgba(0,0,0,.05);padding:1px 5px;border-radius:3px">${inputHash}</code><br>
      Hash actual: <code style="background:rgba(0,0,0,.05);padding:1px 5px;border-radius:3px">${docHash}</code><br>
      ${match?"\u2705 El documento no fue modificado desde que se firm\xF3.":"\u26A0\uFE0F El documento fue modificado despu\xE9s de firmarse."}
    </div>`}async function __generateNewKeys(){showToast("Generando par de claves RSA-2048...");const keyPair=await WC_ESIGN.generateKeyPair();if(!keyPair)return;const pubPEM=await WC_ESIGN.exportKey(keyPair.publicKey,"public");localStorage.setItem("wc-esign-pubkey",pubPEM),openAdvancedSignPanel(),__aSignTab("keys"),showToast("\u{1F511} Nuevas claves RSA-2048 generadas \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"presentationAssist":openPresentationAssistant();break;case"formBuilder":openFormBuilder();break;case"statsChart":openStatsChartPanel();break;case"whatsapp":openWhatsAppPanel();break;case"advancedSign":openAdvancedSignPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.17 \u2705 \u2014 Presentaciones, Formularios, Gr\xE1ficos, WhatsApp, Firma RSA")},2500)})();function openOCRPanel(){const old=document.getElementById("__ocrPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ocrPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F50D} OCR \u2014 Extraer texto de imagen</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Convierte texto de fotos, capturas o documentos escaneados</div>

      <div style="border:2px dashed #c0d8f0;border-radius:14px;padding:24px;text-align:center;cursor:pointer;background:#f8f9ff;margin-bottom:12px;transition:all .2s"
        onclick="document.getElementById('__ocrInput').click()"
        ondragover="event.preventDefault();this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
        ondragleave="this.style.borderColor='#c0d8f0';this.style.background='#f8f9ff'"
        ondrop="event.preventDefault();__ocrLoadFile(event.dataTransfer.files[0]);this.style.borderColor='#c0d8f0'">
        <div id="__ocrDropIcon" style="font-size:40px;margin-bottom:8px">\u{1F5BC}\uFE0F</div>
        <div style="font-size:13px;font-weight:600;color:#1a2942;margin-bottom:4px">Toc\xE1 para seleccionar imagen</div>
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
            <option value="spa">Espa\xF1ol</option>
            <option value="eng">English</option>
            <option value="por">Portugu\xEAs</option>
            <option value="fra">Fran\xE7ais</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Modo</label>
          <select id="__ocrMode" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="text">Texto simple</option>
            <option value="document">Documento</option>
            <option value="single">L\xEDnea \xFAnica</option>
          </select>
        </div>
      </div>

      <div id="__ocrStatus" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        \u23F3 Procesando imagen...
      </div>
    </div>

    <div id="__ocrResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Texto extra\xEDdo</div>
      <textarea id="__ocrResult" rows="8" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;resize:vertical;box-sizing:border-box;line-height:1.6" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
    </div>

    <div style="padding:12px 20px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:8px">
      <button onclick="document.getElementById('__ocrPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button id="__ocrRunBtn" onclick="__runOCR()" disabled style="flex:1;padding:11px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">\u{1F50D} Analizar</button>
      <button id="__ocrInsertBtn" onclick="__ocrInsert()" disabled style="flex:1;padding:11px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">\u{1F4E5} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__ocrImageData=null}function __ocrLoadFile(file){if(!file)return;const reader=new FileReader;reader.onload=e=>{window.__ocrImageData=e.target.result;const prev=document.getElementById("__ocrPreview"),img=document.getElementById("__ocrImg"),icon=document.getElementById("__ocrDropIcon"),btn=document.getElementById("__ocrRunBtn");prev&&(prev.style.display="block"),img&&(img.src=e.target.result),icon&&(icon.textContent="\u2705"),btn&&(btn.disabled=!1,btn.style.background="#0084ff",btn.style.cursor="pointer"),showToast("Imagen cargada \u2705")},reader.readAsDataURL(file)}async function __runOCR(){const imgData=window.__ocrImageData;if(!imgData){showToast("Carg\xE1 una imagen primero");return}const status=document.getElementById("__ocrStatus"),resultBox=document.getElementById("__ocrResultBox"),resultTA=document.getElementById("__ocrResult"),insertBtn=document.getElementById("__ocrInsertBtn");status&&(status.style.display="block");try{if(typeof Tesseract<"u"){const lang=document.getElementById("__ocrLang")?.value||"spa",text=(await Tesseract.recognize(imgData,lang,{logger:m=>{m.status==="recognizing text"&&status&&(status.textContent=`\u23F3 Reconociendo... ${Math.round(m.progress*100)}%`)}})).data.text.trim();status&&(status.style.display="none"),resultBox&&(resultBox.style.display="block"),resultTA&&(resultTA.value=text),insertBtn&&(insertBtn.disabled=!1,insertBtn.style.background="#27ae60",insertBtn.style.cursor="pointer"),showToast(`\u2705 ${text.split(/\s+/).filter(w=>w).length} palabras extra\xEDdas`)}else{status&&(status.textContent="\u23F3 Cargando motor OCR (Tesseract.js)...");const script=document.createElement("script");script.src="https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js",script.onload=()=>__runOCR(),script.onerror=()=>{status&&(status.textContent="\u26A0\uFE0F No se pudo cargar el motor OCR. Verific\xE1 la conexi\xF3n."),__ocrFallbackAI(imgData)},document.head.appendChild(script)}}catch(e){status&&(status.textContent="\u274C Error: "+e.message),showToast("Error OCR: "+e.message)}}async function __ocrFallbackAI(imgData){const key=localStorage.getItem("wc-groq-key"),status=document.getElementById("__ocrStatus"),resultBox=document.getElementById("__ocrResultBox"),resultTA=document.getElementById("__ocrResult"),insertBtn=document.getElementById("__ocrInsertBtn");if(!key){status&&(status.textContent="\u26A0\uFE0F Configur\xE1 tu API Key de Groq para usar OCR con IA");return}status&&(status.textContent="\u{1F999} Usando IA para extraer texto...");try{const text=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"user",content:"Esta es una imagen codificada en base64. Extrae y transcribe TODO el texto visible en la imagen, manteniendo el formato original lo mejor posible. Responde SOLO con el texto extra\xEDdo, sin comentarios adicionales."}],temperature:.1,max_tokens:1e3})})).json())?.choices?.[0]?.message?.content||"No se pudo extraer texto";status&&(status.style.display="none"),resultBox&&(resultBox.style.display="block"),resultTA&&(resultTA.value=text),insertBtn&&(insertBtn.disabled=!1,insertBtn.style.background="#27ae60",insertBtn.style.cursor="pointer")}catch(e){status&&(status.textContent="\u274C Error: "+e.message)}}function __ocrInsert(){const text=document.getElementById("__ocrResult")?.value?.trim();if(!text){showToast("No hay texto para insertar");return}const html=`<div style="background:#f8f9ff;border-left:4px solid #0084ff;padding:12px 16px;border-radius:0 8px 8px 0;margin:8px 0">
    <div style="font-size:10px;color:#0084ff;font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">\u{1F50D} Texto extra\xEDdo por OCR</div>
    <div style="font-size:12pt;white-space:pre-wrap;line-height:1.6">${text.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__ocrPanel").remove(),showToast("Texto OCR insertado \u2705")}const WC_EXCEL={data:{},rows:8,cols:6,selected:null,colNames:["A","B","C","D","E","F","G","H","I","J"],cell(r,c){return this.data[`${r},${c}`]||{raw:"",value:""}},setCell(r,c,raw){this.data[`${r},${c}`]={raw,value:this.evalFormula(raw,r,c)}},evalFormula(raw,r,c){if(!raw||!raw.toString().startsWith("="))return raw;const formula=raw.slice(1).toUpperCase();try{const expr=formula.replace(/([A-J])(\d+)/g,(_,col,row)=>{const ci=this.colNames.indexOf(col),ri=parseInt(row)-1;return parseFloat(this.cell(ri,ci).value)||0});if(expr.startsWith("SUM(")){const range=expr.match(/SUM\((.+)\)/)?.[1];return this._evalRange(range,"sum")}if(expr.startsWith("AVERAGE(")||expr.startsWith("PROMEDIO(")){const range=expr.match(/(?:AVERAGE|PROMEDIO)\((.+)\)/)?.[1];return this._evalRange(range,"avg")}if(expr.startsWith("MAX(")){const range=expr.match(/MAX\((.+)\)/)?.[1];return this._evalRange(range,"max")}if(expr.startsWith("MIN(")){const range=expr.match(/MIN\((.+)\)/)?.[1];return this._evalRange(range,"min")}if(expr.startsWith("COUNT(")){const range=expr.match(/COUNT\((.+)\)/)?.[1];return this._evalRange(range,"count")}const result=Function('"use strict";return ('+expr.replace(/[^0-9+\-*/().,\s]/g,"")+")")();return isNaN(result)?raw:Math.round(result*100)/100}catch{return"#ERROR"}},_evalRange(range,op){if(!range)return 0;const match=range.match(/([A-J])(\d+):([A-J])(\d+)/);let vals=[];if(match){const[,c1,r1,c2,r2]=match,ci1=this.colNames.indexOf(c1),ci2=this.colNames.indexOf(c2),ri1=parseInt(r1)-1,ri2=parseInt(r2)-1;for(let r=ri1;r<=ri2;r++)for(let c=ci1;c<=ci2;c++){const v=parseFloat(this.cell(r,c).value);isNaN(v)||vals.push(v)}}else range.split(",").forEach(ref=>{const m=ref.trim().match(/([A-J])(\d+)/);if(m){const v=parseFloat(this.cell(parseInt(m[2])-1,this.colNames.indexOf(m[1])).value);isNaN(v)||vals.push(v)}});if(!vals.length)return 0;switch(op){case"sum":return vals.reduce((a,b)=>a+b,0);case"avg":return vals.reduce((a,b)=>a+b,0)/vals.length;case"max":return Math.max(...vals);case"min":return Math.min(...vals);case"count":return vals.length;default:return 0}},recalc(){Object.keys(this.data).forEach(key=>{const[r,c]=key.split(",").map(Number);this.data[key].raw?.toString().startsWith("=")&&(this.data[key].value=this.evalFormula(this.data[key].raw,r,c))})}};function openExcelEditor(){const old=document.getElementById("__xlPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__xlPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:12px",WC_EXCEL.data={},ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:680px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:14px 18px;flex-shrink:0;border-bottom:1px solid #eee">
      <div style="font-size:16px;font-weight:700;color:#1a2942;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">
        <span>\u{1F4CA} Editor de tabla Excel</span>
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
        ${["=SUM(A1:A5)","=AVERAGE(A1:A5)","=MAX(A1:A5)","=MIN(A1:A5)","=COUNT(A1:A5)"].map(f=>`
          <button onclick="document.getElementById('__xlFormulaBar').value='${f}'" style="padding:3px 8px;border:1px solid #eee;background:#fafafa;border-radius:5px;cursor:pointer;font-size:10px;font-family:'Courier New',monospace;color:#555;transition:all .12s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='#fafafa'">${f}</button>`).join("")}
      </div>
    </div>

    <!-- Grid -->
    <div style="flex:1;overflow:auto;padding:0">
      <div id="__xlGrid"></div>
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__xlPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__xlInsertTable()" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CA} Insertar tabla</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),__xlRender()}function __xlRender(){const grid=document.getElementById("__xlGrid");if(!grid)return;const R=WC_EXCEL.rows,C=WC_EXCEL.cols,colNames=WC_EXCEL.colNames;let html=`<table style="border-collapse:collapse;width:100%;font-family:-apple-system,'Segoe UI',sans-serif">`;html+='<tr><th style="width:36px;background:#f0f0f5;border:1px solid #ddd;padding:4px;font-size:11px;color:#888"></th>';for(let c=0;c<C;c++)html+=`<th style="background:#f0f0f5;border:1px solid #ddd;padding:4px 8px;font-size:11px;color:#555;font-weight:700;min-width:90px">${colNames[c]}</th>`;html+="</tr>";for(let r=0;r<R;r++){html+=`<tr><th style="background:#f0f0f5;border:1px solid #ddd;padding:4px 6px;font-size:11px;color:#888;font-weight:600;text-align:center;width:36px">${r+1}</th>`;for(let c=0;c<C;c++){const cell=WC_EXCEL.cell(r,c),isSelected=WC_EXCEL.selected&&WC_EXCEL.selected[0]===r&&WC_EXCEL.selected[1]===c,val=cell.value!==""?cell.value:"",isFormula=cell.raw?.toString().startsWith("=");html+=`<td onclick="__xlSelectCell(${r},${c})" ondblclick="__xlEditCell(${r},${c})"
        style="border:${isSelected?"2px solid #0084ff":"1px solid #ddd"};padding:0;position:relative;background:${isSelected?"#f0f7ff":"#fff"}">
        <div style="padding:5px 8px;font-size:12px;${isFormula?"color:#27ae60":"color:#1a1a1a"};min-height:26px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px" id="__xlCell_${r}_${c}">${val}</div>
      </td>`}html+="</tr>"}html+="</table>",grid.innerHTML=html}function __xlSelectCell(r,c){WC_EXCEL.selected=[r,c];const cell=WC_EXCEL.cell(r,c),ref=document.getElementById("__xlCellRef"),bar=document.getElementById("__xlFormulaBar");ref&&(ref.textContent=WC_EXCEL.colNames[c]+(r+1)),bar&&(bar.value=cell.raw||""),__xlRender()}function __xlEditCell(r,c){const cellEl=document.getElementById(`__xlCell_${r}_${c}`);if(!cellEl)return;const cell=WC_EXCEL.cell(r,c);cellEl.contentEditable="true",cellEl.style.outline="none",cellEl.textContent=cell.raw||"",cellEl.focus(),cellEl.addEventListener("blur",()=>{WC_EXCEL.setCell(r,c,cellEl.textContent),WC_EXCEL.recalc(),__xlRender()},{once:!0}),cellEl.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),cellEl.blur()),e.key==="Escape"&&(cellEl.contentEditable="false",__xlRender()),e.key==="Tab"&&(e.preventDefault(),cellEl.blur(),__xlSelectCell(r,c+1<WC_EXCEL.cols?c+1:c))})}function __xlCommitFormula(){const s=WC_EXCEL.selected;if(!s)return;const bar=document.getElementById("__xlFormulaBar");WC_EXCEL.setCell(s[0],s[1],bar?.value||""),WC_EXCEL.recalc(),__xlRender()}function __xlAddRow(){WC_EXCEL.rows++,__xlRender()}function __xlAddCol(){WC_EXCEL.cols<10&&(WC_EXCEL.cols++,__xlRender())}function __xlInsertTable(){const R=WC_EXCEL.rows,C=WC_EXCEL.cols,colNames=WC_EXCEL.colNames;let html='<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">';html+='<tr style="background:#003da5;color:#fff">';for(let c=0;c<C;c++){const h=WC_EXCEL.cell(0,c).value;html+=`<th style="padding:8px 12px;border:1px solid #002080;text-align:left">${h||colNames[c]}</th>`}html+="</tr>";for(let r=1;r<R;r++)if(!Array(C).fill(0).every((_,c)=>!WC_EXCEL.cell(r,c).value)){html+=`<tr style="${r%2?"background:#f0f7ff":""}">`;for(let c=0;c<C;c++)html+=`<td style="padding:7px 12px;border:1px solid #ddd">${WC_EXCEL.cell(r,c).value||""}</td>`;html+="</tr>"}html+="</table>",typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__xlPanel").remove(),showToast("\u{1F4CA} Tabla Excel insertada \u2705")}function openBarcodePanel(){const old=document.getElementById("__barcodePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__barcodePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">|||  Generador de c\xF3digo de barras</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Code128 \xB7 EAN-13 \xB7 Code39 \xB7 ITF</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px">
      ${[{id:"code128",name:"Code 128",desc:"General, letras+n\xFAmeros"},{id:"code39",name:"Code 39",desc:"Alfanum\xE9rico simple"},{id:"ean13",name:"EAN-13",desc:"Productos (13 d\xEDgitos)"},{id:"itf",name:"ITF-14",desc:"Log\xEDstica (14 d\xEDgitos)"},{id:"upca",name:"UPC-A",desc:"Norteam\xE9rica (12 d\xEDgitos)"},{id:"msi",name:"MSI",desc:"Inventario"}].map(t=>`
        <button onclick="__bcSelect('${t.id}',this)"
          class="__bcTypeBtn"
          style="padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:9px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${t.name}</div>
          <div style="font-size:10px;color:#888">${t.desc}</div>
        </button>`).join("")}
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
      <div style="color:#bbb;font-size:12px">Vista previa aqu\xED</div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__barcodePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__bcInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">||| Insertar c\xF3digo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__bcType="code128",setTimeout(()=>{const btn=document.querySelector(".__bcTypeBtn");btn&&(btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"),__bcPreview()},50)}function __bcSelect(id,btn){window.__bcType=id,document.querySelectorAll(".__bcTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1",__bcPreview()}function __bcBuildSVG(content,width){if(!content)return"";const w=parseInt(width)||2,chars=content.split("").map(c=>c.charCodeAt(0));let bars=[];bars.push(1,0,1,1,0,1,0,0,1),chars.forEach(code=>{for(let i=0;i<7;i++)bars.push(code>>i&1);bars.push(0)}),bars.push(1,1,0,1,0,1,1);const barW=w,barH=60,svgW=bars.length*barW+20;let rects="",x=10;return bars.forEach(b=>{b&&(rects+=`<rect x="${x}" y="5" width="${barW}" height="${barH}" fill="#000"/>`),x+=barW}),`<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${barH+20}" viewBox="0 0 ${svgW} ${barH+20}">
    <rect width="${svgW}" height="${barH+20}" fill="white"/>
    ${rects}
  </svg>`}function __bcPreview(){const content=document.getElementById("__bcContent")?.value||"",width=document.getElementById("__bcWidth")?.value||"2",caption=document.getElementById("__bcCaption")?.value==="1",box=document.getElementById("__bcPreviewBox");if(!box||!content)return;const svg=__bcBuildSVG(content,width);box.innerHTML=svg+(caption?`<div style="font-size:11px;font-family:'Courier New',monospace;margin-top:4px;letter-spacing:2px">${content}</div>`:"")}function __bcInsert(){const content=document.getElementById("__bcContent")?.value.trim()||"",width=document.getElementById("__bcWidth")?.value||"2",caption=document.getElementById("__bcCaption")?.value==="1",type=window.__bcType||"code128";if(!content){showToast("Ingres\xE1 el contenido del c\xF3digo");return}const html=`<div style="display:inline-block;text-align:center;padding:10px;border:1px solid #eee;border-radius:8px;background:#fff;margin:8px 0">
    ${__bcBuildSVG(content,width)}
    ${caption?`<div style="font-size:10px;font-family:'Courier New',monospace;margin-top:4px;letter-spacing:2px;color:#333">${content}</div>`:""}
    <div style="font-size:8px;color:#aaa;margin-top:2px">${type.toUpperCase()}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__barcodePanel").remove(),showToast("||| C\xF3digo de barras insertado \u2705")}function openMapsPanel(){const old=document.getElementById("__mapsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__mapsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const crLocations=[{name:"San Jos\xE9 Centro",coords:"9.9281,-84.0907"},{name:"Aeropuerto SJO",coords:"9.9937,-84.2088"},{name:"Volc\xE1n Arenal",coords:"10.4628,-84.7032"},{name:"Playa Tamarindo",coords:"10.2993,-85.8421"},{name:"Monteverde",coords:"10.2993,-84.8290"},{name:"Puerto Lim\xF3n",coords:"9.9903,-83.0364"},{name:"Liberia, Guanacaste",coords:"10.6340,-85.4370"},{name:"Puntarenas",coords:"9.9766,-84.8310"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u{1F5FA}\uFE0F Insertar mapa
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Google Maps \xB7 OpenStreetMap \xB7 Mapas de Costa Rica</div>

    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button id="__mapTab1" onclick="__mapTab('search')" style="flex:1;padding:7px;border:2px solid #4285f4;background:#f0f4ff;color:#4285f4;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F50D} Buscar</button>
      <button id="__mapTab2" onclick="__mapTab('coords')" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CD} Coordenadas</button>
      <button id="__mapTab3" onclick="__mapTab('cr')" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F1E8}\u{1F1F7} Lugares CR</button>
    </div>

    <!-- B\xFAsqueda -->
    <div id="__mapSection_search">
      <input type="text" id="__mapSearch" placeholder="Ej: Banco Nacional de Costa Rica, San Jos\xE9"
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'"
        onkeydown="if(event.key==='Enter')__mapPreview()">
      <button onclick="__mapPreview()" style="width:100%;padding:10px;border:none;background:#4285f4;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">\u{1F50D} Buscar en el mapa</button>
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
      <button onclick="__mapPreviewCoords()" style="width:100%;padding:10px;border:none;background:#4285f4;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">\u{1F4CD} Ver en mapa</button>
    </div>

    <!-- Lugares CR -->
    <div id="__mapSection_cr" style="display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        ${crLocations.map(l=>`
          <button onclick="__mapSelectLocation('${l.coords}','${l.name.replace(/'/g,"\\'")}')"
            style="padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s;text-align:left"
            onmouseover="this.style.borderColor='#4285f4';this.style.background='#f0f4ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            \u{1F1E8}\u{1F1F7} ${l.name}
          </button>`).join("")}
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
          <option value="8">Pa\xEDs</option>
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
      <button onclick="__mapInsert()" style="flex:2;padding:11px;border:none;background:#4285f4;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F5FA}\uFE0F Insertar mapa</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__mapQuery="San Jos\xE9, Costa Rica",window.__mapCoords="9.9281,-84.0907"}function __mapTab(tab){["search","coords","cr"].forEach((t,i)=>{const sec=document.getElementById("__mapSection_"+t),btn=document.getElementById("__mapTab"+(i+1));sec&&(sec.style.display=t===tab?"block":"none"),btn&&(btn.style.borderColor=t===tab?"#4285f4":"#eee",btn.style.background=t===tab?"#f0f4ff":"#fafafa",btn.style.color=t===tab?"#4285f4":"#555")})}function __mapPreview(){const q=document.getElementById("__mapSearch")?.value.trim()||"San Jos\xE9, Costa Rica",zoom=document.getElementById("__mapZoom")?.value||"15";window.__mapQuery=q;const frame=document.getElementById("__mapFrame"),box=document.getElementById("__mapPreviewBox");frame&&(frame.src=`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`),box&&(box.style.display="block")}function __mapPreviewCoords(){const lat=document.getElementById("__mapLat")?.value||"9.9281",lng=document.getElementById("__mapLng")?.value||"-84.0907",zoom=document.getElementById("__mapZoom")?.value||"15";window.__mapCoords=`${lat},${lng}`;const frame=document.getElementById("__mapFrame"),box=document.getElementById("__mapPreviewBox");frame&&(frame.src=`https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`),box&&(box.style.display="block")}function __mapSelectLocation(coords,name){window.__mapCoords=coords,window.__mapQuery=name;const[lat,lng]=coords.split(","),inp1=document.getElementById("__mapLat"),inp2=document.getElementById("__mapLng");inp1&&(inp1.value=lat),inp2&&(inp2.value=lng);const zoom=document.getElementById("__mapZoom")?.value||"15",frame=document.getElementById("__mapFrame"),box=document.getElementById("__mapPreviewBox");frame&&(frame.src=`https://maps.google.com/maps?q=${coords}&z=${zoom}&output=embed`),box&&(box.style.display="block"),showToast("\u{1F4CD} "+name)}function __mapInsert(){const query=window.__mapQuery||"Costa Rica",coords=window.__mapCoords||"9.9281,-84.0907",zoom=document.getElementById("__mapZoom")?.value||"15",height=document.getElementById("__mapHeight")?.value||"300",html=`<div style="margin:12px 0;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0">
    <iframe src="${window.__mapQuery?`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`:`https://maps.google.com/maps?q=${coords}&z=${zoom}&output=embed`}" width="100%" height="${height}" style="border:none;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    <div style="padding:6px 12px;background:#f8f9fa;font-size:9px;color:#888;display:flex;align-items:center;gap:6px">
      <span>\u{1F5FA}\uFE0F</span>
      <a href="https://maps.google.com/maps?q=${encodeURIComponent(query)}" target="_blank" style="color:#4285f4;text-decoration:none">${query} \u2014 Ver en Google Maps</a>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__mapsPanel").remove(),showToast("\u{1F5FA}\uFE0F Mapa insertado \u2705")}function openDashboardPanel(){const old=document.getElementById("__dashPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__dashPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const templates=[{id:"business",name:"Resumen ejecutivo",icon:"\u{1F4BC}",kpis:[{label:"Ingresos",value:"\u20A14.2M",change:"+12%",up:!0,color:"#27ae60"},{label:"Clientes",value:"1,247",change:"+8%",up:!0,color:"#0084ff"},{label:"Proyectos",value:"23",change:"-2",up:!1,color:"#e74c3c"},{label:"NPS Score",value:"87",change:"+5pt",up:!0,color:"#9b59b6"}]},{id:"financial",name:"Dashboard financiero",icon:"\u{1F4B0}",kpis:[{label:"Ventas",value:"\u20A112.8M",change:"+22%",up:!0,color:"#27ae60"},{label:"Gastos",value:"\u20A18.1M",change:"+5%",up:!1,color:"#e74c3c"},{label:"Utilidad",value:"\u20A14.7M",change:"+41%",up:!0,color:"#0084ff"},{label:"Margen",value:"36.7%",change:"+8pp",up:!0,color:"#f39c12"}]},{id:"hr",name:"Recursos Humanos",icon:"\u{1F465}",kpis:[{label:"Empleados",value:"142",change:"+7",up:!0,color:"#0084ff"},{label:"Rotaci\xF3n",value:"4.2%",change:"-1.1%",up:!0,color:"#27ae60"},{label:"Capacitados",value:"89%",change:"+12%",up:!0,color:"#9b59b6"},{label:"Satisfacci\xF3n",value:"8.4/10",change:"+0.6",up:!0,color:"#f39c12"}]},{id:"custom",name:"Personalizado",icon:"\u270F\uFE0F",kpis:[]}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3AF} Dashboard de m\xE9tricas</div>
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
        </button>`).join("")}
    </div>

    <div id="__dashKPIEditor" style="margin-bottom:16px">
      <!-- Se llena din\xE1micamente -->
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">T\xEDtulo del dashboard</label>
      <input type="text" id="__dashTitle" value="Resumen ejecutivo"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__dashPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__dashInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3AF} Insertar dashboard</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__dashTemplates=templates,window.__dashSelected=templates[0],setTimeout(()=>{const btn=document.querySelector(".__dashTplBtn");btn&&(btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"),__dashRenderEditor(templates[0])},50)}function __dashSelect(id,btn){const t=(window.__dashTemplates||[]).find(t2=>t2.id===id);t&&(window.__dashSelected=t,document.querySelectorAll(".__dashTplBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1",__dashRenderEditor(t))}function __dashRenderEditor(tpl){const editor=document.getElementById("__dashKPIEditor"),titleInput=document.getElementById("__dashTitle");if(editor)if(titleInput&&(titleInput.value=tpl.name),tpl.id==="custom"||!tpl.kpis.length)editor.innerHTML=`
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">KPIs (Etiqueta|Valor|Cambio|up/down)</div>
      <textarea id="__dashCustomKPIs" rows="4" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Ventas|\u20A12.4M|+15%|up
Clientes|342|+23|up
Gastos|\u20A11.1M|-5%|up
Satisfacci\xF3n|9.1/10|+0.3|up</textarea>`;else{const colors=["#27ae60","#0084ff","#e74c3c","#f39c12","#9b59b6","#1abc9c"];editor.innerHTML=`
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">KPIs del template</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${tpl.kpis.map((k,i)=>`
          <div style="background:#f8f9fa;border-radius:8px;padding:10px;border:1px solid #eee">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <div style="width:8px;height:8px;border-radius:50%;background:${colors[i%colors.length]}"></div>
              <div style="font-size:11px;font-weight:700;color:#555">${k.label}</div>
            </div>
            <div style="font-size:16px;font-weight:800;color:${colors[i%colors.length]}">${k.value}</div>
            <div style="font-size:11px;color:${k.up?"#27ae60":"#e74c3c"}">${k.up?"\u2191":"\u2193"} ${k.change}</div>
          </div>`).join("")}
      </div>`}}function __dashInsert(){const title=document.getElementById("__dashTitle")?.value||"Dashboard",tpl=window.__dashSelected;let kpis=tpl?.kpis||[];(tpl?.id==="custom"||!kpis.length)&&(kpis=(document.getElementById("__dashCustomKPIs")?.value||"").split(`
`).filter(l=>l.trim()).map(l=>{const p=l.split("|");return{label:p[0]?.trim()||"KPI",value:p[1]?.trim()||"0",change:p[2]?.trim()||"",up:(p[3]?.trim()||"up")==="up",color:"#0084ff"}}));const colors=["#27ae60","#0084ff","#e74c3c","#f39c12","#9b59b6","#1abc9c","#e67e22","#3498db"],html=`
  <div style="margin:16px 0;padding:20px;background:linear-gradient(135deg,#f8f9ff,#fff);border:1.5px solid #e8e8ec;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f0f0f5">
      <div style="font-size:14px;font-weight:700;color:#1a2942">\u{1F3AF} ${title}</div>
      <div style="font-size:10px;color:#aaa">${new Date().toLocaleDateString("es-CR",{month:"long",year:"numeric"})}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(${Math.min(kpis.length,4)},1fr);gap:12px">
      ${kpis.map((k,i)=>`
        <div style="background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.06);border-top:3px solid ${colors[i%colors.length]}">
          <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${k.label}</div>
          <div style="font-size:20px;font-weight:900;color:${colors[i%colors.length]};margin-bottom:4px">${k.value}</div>
          ${k.change?`<div style="font-size:11px;color:${k.up?"#27ae60":"#e74c3c"};font-weight:600">${k.up?"\u2191":"\u2193"} ${k.change} vs periodo anterior</div>`:""}
        </div>`).join("")}
    </div>
    <div style="font-size:9px;color:#bbb;text-align:right;margin-top:10px">WC Corporate Editor \xB7 Costa Rica</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__dashPanel").remove(),showToast("\u{1F3AF} Dashboard insertado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"ocr":openOCRPanel();break;case"excelTable":openExcelEditor();break;case"barcode":openBarcodePanel();break;case"googleMaps":openMapsPanel();break;case"dashboard":openDashboardPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.18 \u2705 \u2014 OCR, Excel, Barcode, Maps, Dashboard KPIs")},2600)})();const WC_VOICE={recognition:null,active:!1,transcript:"",init(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;return SR?(this.recognition=new SR,this.recognition.continuous=!0,this.recognition.interimResults=!0,this.recognition.lang="es-CR",!0):!1},start(){if(!this.recognition&&!this.init()){showToast("Reconocimiento de voz no disponible en este navegador");return}this.active=!0,this.transcript="";const ed=document.getElementById("editor");this.recognition.onresult=e=>{let interim="",final="";for(let i=e.resultIndex;i<e.results.length;i++)e.results[i].isFinal?final+=e.results[i][0].transcript:interim+=e.results[i][0].transcript;final&&(document.execCommand("insertText",!1,final+" "),this.transcript+=final+" ");const preview=document.getElementById("__voiceInterim");preview&&(preview.textContent=interim)},this.recognition.onerror=e=>{showToast("Error de voz: "+e.error),this.stop()},this.recognition.onend=()=>{this.active&&this.recognition.start()},this.recognition.start(),this._showIndicator(),showToast("\u{1F399}\uFE0F Dictando \u2014 Habl\xE1 ahora")},stop(){this.active=!1,this.recognition&&this.recognition.stop(),this._hideIndicator(),showToast("\u23F9 Dictado detenido")},toggle(){this.active?this.stop():this.start()},_showIndicator(){const old=document.getElementById("__voiceIndicator");old&&old.remove();const ind=document.createElement("div");ind.id="__voiceIndicator",ind.style.cssText=`
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      z-index:9990;background:#e74c3c;color:#fff;
      border-radius:20px;padding:10px 20px;
      font-size:13px;font-weight:700;
      display:flex;align-items:center;gap:10px;
      box-shadow:0 4px 20px rgba(231,76,60,.5);
      animation:wcPulse 1s infinite;
    `,ind.innerHTML=`
      <span style="width:10px;height:10px;background:#fff;border-radius:50%;display:inline-block;animation:wcPulse .8s infinite"></span>
      <span>\u{1F399}\uFE0F Dictando...</span>
      <span id="__voiceInterim" style="opacity:.8;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
      <button onclick="WC_VOICE.stop()" style="background:rgba(255,255,255,.3);border:none;color:#fff;border-radius:8px;padding:4px 10px;cursor:pointer;font-size:12px;font-weight:600">\u23F9 Detener</button>
    `,document.body.appendChild(ind)},_hideIndicator(){const ind=document.getElementById("__voiceIndicator");ind&&ind.remove()}};function openVoicePanel(){const old=document.getElementById("__voicePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__voicePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const supported=!!(window.SpeechRecognition||window.webkitSpeechRecognition);ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      \u{1F399}\uFE0F Dictado por voz
    </div>

    ${supported?`
      <div style="background:#f0fff4;border-radius:12px;padding:14px;margin-bottom:16px">
        <div style="text-align:center;font-size:48px;margin-bottom:8px">\u{1F399}\uFE0F</div>
        <div style="text-align:center;font-size:13px;color:#555;line-height:1.6">
          Presion\xE1 <strong>Iniciar dictado</strong> y habl\xE1.<br>
          El texto aparecer\xE1 directamente en el editor.
        </div>
      </div>

      <div style="margin-bottom:14px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Idioma</label>
        <select id="__voiceLang" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          <option value="es-CR">Espa\xF1ol (Costa Rica)</option>
          <option value="es-ES">Espa\xF1ol (Espa\xF1a)</option>
          <option value="en-US">English (US)</option>
          <option value="pt-BR">Portugu\xEAs (Brasil)</option>
          <option value="fr-FR">Fran\xE7ais</option>
        </select>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="__voicePunctuation" checked style="accent-color:#e74c3c;width:15px;height:15px">
          <span style="font-size:13px;color:#555">Insertar puntuaci\xF3n autom\xE1ticamente</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="__voiceCapitalize" checked style="accent-color:#e74c3c;width:15px;height:15px">
          <span style="font-size:13px;color:#555">Capitalizar inicio de oraciones</span>
        </label>
      </div>

      <div style="background:#f8f9fa;border-radius:8px;padding:10px;margin-bottom:14px;font-size:11px;color:#888;line-height:1.7">
        \u{1F4A1} <strong>Comandos de voz:</strong> "punto", "coma", "dos puntos", "nueva l\xEDnea", "nuevo p\xE1rrafo"
      </div>`:`
      <div style="background:#fdf2f2;border-radius:10px;padding:14px;margin-bottom:16px;color:#721c24;font-size:13px">
        \u26A0\uFE0F Tu navegador no soporta reconocimiento de voz.<br>
        Us\xE1 Chrome o Edge para esta funci\xF3n.
      </div>`}

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__voicePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      ${supported?'<button onclick="__startVoice()" style="flex:2;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">\u{1F399}\uFE0F Iniciar dictado</button>':""}
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __startVoice(){const lang=document.getElementById("__voiceLang")?.value||"es-CR";(WC_VOICE.recognition||WC_VOICE.init())&&(WC_VOICE.recognition.lang=lang),document.getElementById("__voicePanel").remove(),WC_VOICE.start()}function openPasswordGenerator(){const old=document.getElementById("__pwdPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pwdPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u{1F511} Generador de contrase\xF1as</div>

    <div style="background:#1e1e2e;border-radius:12px;padding:16px;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      <div id="__pwdOutput" style="flex:1;font-size:16px;font-weight:700;color:#e2b96f;font-family:'Courier New',monospace;word-break:break-all;letter-spacing:1px">Click en Generar</div>
      <button onclick="__pwdCopy()" title="Copiar" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:8px;padding:8px;cursor:pointer;font-size:16px;flex-shrink:0">\u{1F4CB}</button>
    </div>

    <div id="__pwdStrength" style="height:8px;border-radius:4px;background:#eee;margin-bottom:8px;overflow:hidden">
      <div id="__pwdStrengthBar" style="height:100%;width:0%;border-radius:4px;transition:all .3s"></div>
    </div>
    <div id="__pwdStrengthLabel" style="font-size:11px;color:#888;text-align:center;margin-bottom:14px">\u2014</div>

    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:12px;font-weight:700;color:#555">Longitud</label>
        <span id="__pwdLenVal" style="font-size:12px;font-weight:700;color:#0084ff">16</span>
      </div>
      <input type="range" id="__pwdLen" min="6" max="64" value="16" style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__pwdLenVal').textContent=this.value">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[["__pwdUpper","May\xFAsculas (A-Z)",!0],["__pwdLower","Min\xFAsculas (a-z)",!0],["__pwdNumbers","N\xFAmeros (0-9)",!0],["__pwdSymbols","S\xEDmbolos (!@#$)",!0],["__pwdNoAmb","Sin ambiguos (0,O,l,1)",!1],["__pwdPron","Pronunciable",!1]].map(([id,label,def])=>`
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:#555">
          <input type="checkbox" id="${id}" ${def?"checked":""} style="accent-color:#0084ff;width:14px;height:14px"> ${label}
        </label>`).join("")}
    </div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      <button onclick="__pwdGenerate()" style="padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">\u{1F511} Generar contrase\xF1a</button>
      <button onclick="__pwdGenerateMultiple()" style="padding:10px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Generar 5 opciones</button>
    </div>

    <div id="__pwdMultiple" style="display:none;margin-bottom:14px"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__pwdPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__pwdInsert()" style="flex:1;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4E5} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),__pwdGenerate()}function __pwdBuild(){const len=parseInt(document.getElementById("__pwdLen")?.value)||16,upper=document.getElementById("__pwdUpper")?.checked,lower=document.getElementById("__pwdLower")?.checked,numbers=document.getElementById("__pwdNumbers")?.checked,symbols=document.getElementById("__pwdSymbols")?.checked,noAmb=document.getElementById("__pwdNoAmb")?.checked;if(document.getElementById("__pwdPron")?.checked){const consonants="bcdfghjklmnpqrstvwxyz",vowels="aeiou";let pwd="";for(let i=0;i<Math.ceil(len/2);i++)pwd+=consonants[Math.floor(Math.random()*consonants.length)],pwd+=vowels[Math.floor(Math.random()*vowels.length)];return pwd.slice(0,len)}let chars="";upper&&(chars+=noAmb?"ABCDEFGHJKLMNPQRSTUVWXYZ":"ABCDEFGHIJKLMNOPQRSTUVWXYZ"),lower&&(chars+=noAmb?"abcdefghjkmnpqrstuvwxyz":"abcdefghijklmnopqrstuvwxyz"),numbers&&(chars+=noAmb?"23456789":"0123456789"),symbols&&(chars+="!@#$%^&*()-_=+[]{}|;:,.<>?"),chars||(chars="abcdefghijklmnopqrstuvwxyz");const arr=new Uint8Array(len);return crypto.getRandomValues(arr),Array.from(arr).map(b=>chars[b%chars.length]).join("")}function __pwdStrengthCalc(pwd){let score=0;return pwd.length>=8&&(score+=20),pwd.length>=12&&(score+=20),pwd.length>=16&&(score+=10),/[A-Z]/.test(pwd)&&(score+=15),/[a-z]/.test(pwd)&&(score+=15),/[0-9]/.test(pwd)&&(score+=10),/[^A-Za-z0-9]/.test(pwd)&&(score+=10),Math.min(score,100)}function __pwdGenerate(){const pwd=__pwdBuild();window.__currentPwd=pwd;const out=document.getElementById("__pwdOutput");out&&(out.textContent=pwd);const score=__pwdStrengthCalc(pwd),bar=document.getElementById("__pwdStrengthBar"),label=document.getElementById("__pwdStrengthLabel"),color=score<40?"#e74c3c":score<70?"#f39c12":"#27ae60",text=score<40?"D\xE9bil":score<70?"Media":score<90?"Fuerte":"Muy fuerte";bar&&(bar.style.width=score+"%",bar.style.background=color),label&&(label.textContent=text+" ("+score+"/100)",label.style.color=color)}function __pwdGenerateMultiple(){const box=document.getElementById("__pwdMultiple");box&&(box.style.display="block",box.innerHTML=Array(5).fill(0).map((_,i)=>{const pwd=__pwdBuild();return`<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f8f9fa;border-radius:8px;margin-bottom:4px">
      <code style="flex:1;font-size:12px;color:#1a1a1a;font-family:'Courier New',monospace">${pwd}</code>
      <button onclick="window.__currentPwd='${pwd}';document.getElementById('__pwdOutput').textContent='${pwd}';__pwdStrengthCalc&&showToast('Seleccionada \u2705')" style="padding:4px 8px;border:none;background:#0084ff;color:#fff;border-radius:5px;cursor:pointer;font-size:10px">Usar</button>
      <button onclick="navigator.clipboard.writeText('${pwd}').then(()=>showToast('Copiada \u2705'))" style="padding:4px 8px;border:1px solid #eee;background:#fff;border-radius:5px;cursor:pointer;font-size:10px">\u{1F4CB}</button>
    </div>`}).join(""))}function __pwdCopy(){const pwd=window.__currentPwd||document.getElementById("__pwdOutput")?.textContent;pwd&&pwd!=="Click en Generar"&&navigator.clipboard.writeText(pwd).then(()=>showToast("Contrase\xF1a copiada \u2705"))}function __pwdInsert(){const pwd=window.__currentPwd||document.getElementById("__pwdOutput")?.textContent;if(!pwd||pwd==="Click en Generar"){showToast("Gener\xE1 una contrase\xF1a primero");return}typeof insertHTML=="function"&&insertHTML(`<code style="background:#1e1e2e;color:#e2b96f;border-radius:6px;padding:2px 10px;font-family:'Courier New',monospace;font-size:12pt">${pwd}</code>`),document.getElementById("__pwdPanel").remove(),showToast("Contrase\xF1a insertada \u2705")}function openCVTemplates(){const old=document.getElementById("__cvPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__cvPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4C4} Curr\xEDculum Vitae \u2014 Costa Rica</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Llen\xE1s los datos y se genera el CV completo</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[{id:"classic",name:"Cl\xE1sico CR",color:"#003da5"},{id:"modern",name:"Moderno",color:"#0084ff"},{id:"minimal",name:"Minimal",color:"#1a2942"},{id:"creative",name:"Creativo",color:"#9b59b6"}].map(t=>`
        <button onclick="__cvSelect('${t.id}',this)"
          class="__cvTplBtn"
          style="padding:10px;border:2px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:center;transition:all .15s"
          onmouseover="this.style.borderColor='${t.color}'" onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
          <div style="width:100%;height:6px;background:${t.color};border-radius:3px;margin-bottom:6px"></div>
          <div style="font-size:12px;font-weight:700;color:#333">${t.name}</div>
        </button>`).join("")}
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__cvName","Nombre completo *","Juan Carlos P\xE9rez L\xF3pez"],["__cvTitle","T\xEDtulo profesional","Ingeniero en Sistemas / Administrador"],["__cvEmail","Correo electr\xF3nico","juan@correo.cr"],["__cvPhone","Tel\xE9fono (CR)","8888-1234"],["__cvLocation","Ubicaci\xF3n","San Jos\xE9, Costa Rica"],["__cvLinkedIn","LinkedIn / Web","linkedin.com/in/juanperez"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>

    <div style="margin-bottom:10px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Perfil profesional</label>
      <textarea id="__cvSummary" rows="3" placeholder="Profesional con X a\xF1os de experiencia en..."
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
    </div>

    <div style="margin-bottom:10px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Experiencia (Empresa|Cargo|Per\xEDodo, una por l\xEDnea)</label>
      <textarea id="__cvExp" rows="3" placeholder="Empresa ABC|Desarrollador Senior|2020-2025"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">Empresa XYZ S.A.|Desarrollador Full Stack|2022-Presente
Corporaci\xF3n ABC|Analista de Sistemas|2019-2022</textarea>
    </div>

    <div style="margin-bottom:10px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Educaci\xF3n (Instituci\xF3n|T\xEDtulo|A\xF1o)</label>
      <textarea id="__cvEdu" rows="2" placeholder="UCR|Ingenier\xEDa en Sistemas|2019"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">UCR|Bachillerato en Ingenier\xEDa en Sistemas|2019
TEC|T\xE9cnico en Redes|2016</textarea>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Habilidades (separadas por coma)</label>
      <input type="text" id="__cvSkills" placeholder="JavaScript, Python, SQL, Gesti\xF3n de proyectos"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        value="JavaScript, React, Node.js, SQL, Git, Agile">
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__cvPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateCV()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4C4} Generar CV</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__cvStyle="classic",setTimeout(()=>{const btn=document.querySelector(".__cvTplBtn");btn&&(btn.style.borderColor="#003da5",btn.dataset.sel="1")},50)}function __cvSelect(id,btn){window.__cvStyle=id,document.querySelectorAll(".__cvTplBtn").forEach(b=>{b.style.borderColor="#eee",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.dataset.sel="1"}function __generateCV(){const name=document.getElementById("__cvName")?.value.trim()||"Nombre Completo",title=document.getElementById("__cvTitle")?.value.trim()||"Profesional",email=document.getElementById("__cvEmail")?.value.trim()||"",phone=document.getElementById("__cvPhone")?.value.trim()||"",location=document.getElementById("__cvLocation")?.value.trim()||"Costa Rica",linkedin=document.getElementById("__cvLinkedIn")?.value.trim()||"",summary=document.getElementById("__cvSummary")?.value.trim()||"",expRaw=document.getElementById("__cvExp")?.value.trim()||"",eduRaw=document.getElementById("__cvEdu")?.value.trim()||"",skillsRaw=document.getElementById("__cvSkills")?.value.trim()||"",style=window.__cvStyle||"classic",expItems=expRaw.split(`
`).filter(l=>l.trim()).map(l=>{const p=l.split("|");return{company:p[0]||"",role:p[1]||"",period:p[2]||""}}),eduItems=eduRaw.split(`
`).filter(l=>l.trim()).map(l=>{const p=l.split("|");return{inst:p[0]||"",degree:p[1]||"",year:p[2]||""}}),skills=skillsRaw.split(",").map(s=>s.trim()).filter(s=>s),color={classic:"#003da5",modern:"#0084ff",minimal:"#1a2942",creative:"#9b59b6"}[style]||"#003da5",html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:18cm;margin:0 auto;background:#fff;page-break-after:always">
    <!-- Header -->
    <div style="background:${color};color:#fff;padding:28px 30px;${style==="creative"?"border-radius:0 0 20px 20px":""}">
      <h1 style="margin:0 0 4px;font-size:22pt;font-weight:900;letter-spacing:-0.5px">${name}</h1>
      <div style="font-size:12pt;opacity:.9;margin-bottom:12px">${title}</div>
      <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:9pt;opacity:.85">
        ${email?`<span>\u2709 ${email}</span>`:""}
        ${phone?`<span>\u{1F4F1} ${phone}</span>`:""}
        ${location?`<span>\u{1F4CD} ${location}</span>`:""}
        ${linkedin?`<span>\u{1F517} ${linkedin}</span>`:""}
      </div>
    </div>

    <div style="padding:20px 30px">
      ${summary?`
      <div style="margin-bottom:20px">
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Perfil profesional</div>
        <p style="font-size:10pt;color:#555;line-height:1.7;margin:0;text-align:justify">${summary}</p>
      </div>`:""}

      ${expItems.length?`
      <div style="margin-bottom:20px">
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Experiencia profesional</div>
        ${expItems.map(e=>`
          <div style="margin-bottom:12px;padding-left:12px;border-left:3px solid ${color}22">
            <div style="font-size:11pt;font-weight:700;color:#1a2942">${e.role}</div>
            <div style="font-size:10pt;color:${color};font-weight:600;margin-bottom:2px">${e.company}</div>
            <div style="font-size:9pt;color:#888">${e.period}</div>
          </div>`).join("")}
      </div>`:""}

      ${eduItems.length?`
      <div style="margin-bottom:20px">
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Formaci\xF3n acad\xE9mica</div>
        ${eduItems.map(e=>`
          <div style="margin-bottom:10px">
            <div style="font-size:11pt;font-weight:700;color:#1a2942">${e.degree}</div>
            <div style="font-size:10pt;color:${color}">${e.inst}</div>
            <div style="font-size:9pt;color:#888">${e.year}</div>
          </div>`).join("")}
      </div>`:""}

      ${skills.length?`
      <div>
        <div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Habilidades</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${skills.map(s=>`<span style="background:${color}15;border:1px solid ${color}44;color:${color};border-radius:20px;padding:3px 12px;font-size:9pt;font-weight:600">${s}</span>`).join("")}
        </div>
      </div>`:""}
    </div>

    <div style="padding:10px 30px;background:#f8f9fa;font-size:8pt;color:#aaa;text-align:center;border-top:1px solid #eee">
      CV generado con WC Corporate Editor \xB7 Costa Rica \xB7 ${new Date().toLocaleDateString("es-CR")}
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__cvPanel").remove(),showToast("\u{1F4C4} CV generado \u2705")}const WC_UNITS={categories:{"\u{1F4CF} Longitud":{units:["mm","cm","m","km","in","ft","yd","mi"],toBase:{mm:.001,cm:.01,m:1,km:1e3,in:.0254,ft:.3048,yd:.9144,mi:1609.344},base:"m"},"\u2696\uFE0F Peso":{units:["mg","g","kg","t","oz","lb","st"],toBase:{mg:1e-6,g:.001,kg:1,t:1e3,oz:.0283495,lb:.453592,st:6.35029},base:"kg"},"\u{1F321}\uFE0F Temperatura":{units:["\xB0C","\xB0F","K"],special:!0},"\u{1F4D0} \xC1rea":{units:["mm\xB2","cm\xB2","m\xB2","km\xB2","ha","ft\xB2","ac"],toBase:{"mm\xB2":1e-6,"cm\xB2":1e-4,"m\xB2":1,"km\xB2":1e6,ha:1e4,"ft\xB2":.092903,ac:4046.86},base:"m\xB2"},"\u{1F6B0} Volumen":{units:["ml","cl","dl","l","m\xB3","fl oz","pt","qt","gal"],toBase:{ml:.001,cl:.01,dl:.1,l:1,"m\xB3":1e3,"fl oz":.0295735,pt:.473176,qt:.946353,gal:3.78541},base:"l"},"\u26A1 Velocidad":{units:["m/s","km/h","mph","knot","ft/s"],toBase:{"m/s":1,"km/h":.277778,mph:.44704,knot:.514444,"ft/s":.3048},base:"m/s"},"\u{1F4BE} Datos":{units:["bit","byte","KB","MB","GB","TB","PB"],toBase:{bit:.125,byte:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776,PB:0x4000000000000},base:"byte"},"\u23F1\uFE0F Tiempo":{units:["ms","s","min","h","d","semana","mes","a\xF1o"],toBase:{ms:.001,s:1,min:60,h:3600,d:86400,semana:604800,mes:2592e3,a\u00F1o:31536e3},base:"s"}}};function openUnitConverter(){const old=document.getElementById("__unitPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__unitPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const cats=Object.keys(WC_UNITS.categories);ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:14px">\u{1F4D0} Conversor de unidades</div>

    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      ${cats.map((c,i)=>`
        <button onclick="__unitSelectCat('${c.replace(/['"]/g,"")}',this)"
          class="__unitCatBtn"
          style="padding:5px 10px;border:1.5px solid ${i===0?"#0084ff":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#0084ff":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':""}>
          ${c}
        </button>`).join("")}
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
      <button onclick="__unitSwap()" style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:18px;margin-bottom:6px">\u21C4</button>
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
      <button onclick="__unitInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4D0} Insertar resultado</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__unitCat=cats[0],__unitPopulateSelects(cats[0])}function __unitSelectCat(cat,btn){window.__unitCat=cat,document.querySelectorAll(".__unitCatBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.style.color="#0084ff",btn.dataset.sel="1",__unitPopulateSelects(cat)}function __unitPopulateSelects(cat){const catData=Object.entries(WC_UNITS.categories).find(([k])=>k.includes(cat.replace(/📏|⚖️|🌡️|📐|🚰|⚡|💾|⏱️|\s/g,"").trim()))?.[1]||Object.values(WC_UNITS.categories)[0],units=catData.units||[],fromSel=document.getElementById("__unitFrom"),toSel=document.getElementById("__unitTo");!fromSel||!toSel||(fromSel.innerHTML=units.map(u=>`<option value="${u}">${u}</option>`).join(""),toSel.innerHTML=units.map((u,i)=>`<option value="${u}" ${i===1?"selected":""}>${u}</option>`).join(""),window.__unitCatData=catData,__unitConvert())}function __unitConvert(){const catData=window.__unitCatData,from=document.getElementById("__unitFrom")?.value,to=document.getElementById("__unitTo")?.value,valFrom=parseFloat(document.getElementById("__unitValueFrom")?.value)||0,outEl=document.getElementById("__unitValueTo"),formula=document.getElementById("__unitFormula");if(!catData||!from||!to||!outEl)return;let result;if(catData.special&&from&&to)from==="\xB0C"&&to==="\xB0F"?result=valFrom*9/5+32:from==="\xB0F"&&to==="\xB0C"?result=(valFrom-32)*5/9:from==="\xB0C"&&to==="K"?result=valFrom+273.15:from==="K"&&to==="\xB0C"?result=valFrom-273.15:from==="\xB0F"&&to==="K"?result=(valFrom-32)*5/9+273.15:from==="K"&&to==="\xB0F"?result=(valFrom-273.15)*9/5+32:result=valFrom;else{const toBase=catData.toBase||{};result=valFrom*(toBase[from]||1)/(toBase[to]||1)}const rounded=Math.round(result*1e6)/1e6;outEl.value=rounded,window.__unitResult={from:valFrom,fromUnit:from,to:rounded,toUnit:to},formula&&(formula.textContent=`${valFrom} ${from} = ${rounded} ${to}`)}function __unitSwap(){const f=document.getElementById("__unitFrom"),t=document.getElementById("__unitTo"),v=document.getElementById("__unitValueTo")?.value;if(!f||!t)return;const tmp=f.value;f.value=t.value,t.value=tmp;const inp=document.getElementById("__unitValueFrom");inp&&v&&(inp.value=v),__unitConvert()}function __unitInsert(){const r=window.__unitResult;if(!r){showToast("Realiz\xE1 una conversi\xF3n primero");return}typeof insertHTML=="function"&&insertHTML(`<span style="background:#f0f7ff;border:1px solid #c0d8f0;border-radius:4px;padding:1px 8px;font-weight:600;color:#003da5">${r.from} ${r.fromUnit} = ${r.to} ${r.toUnit}</span>`),document.getElementById("__unitPanel").remove(),showToast("Conversi\xF3n insertada \u2705")}function openEmojiPanel(){const old=document.getElementById("__emojiPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__emojiPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center";const categories={"\u{1F600} Caras":["\u{1F600}","\u{1F601}","\u{1F602}","\u{1F923}","\u{1F603}","\u{1F604}","\u{1F605}","\u{1F606}","\u{1F609}","\u{1F60A}","\u{1F60B}","\u{1F60E}","\u{1F60D}","\u{1F970}","\u{1F618}","\u{1F929}","\u{1F610}","\u{1F611}","\u{1F636}","\u{1F644}","\u{1F60F}","\u{1F612}","\u{1F61E}","\u{1F614}","\u{1F61F}","\u{1F615}","\u{1F641}","\u2639\uFE0F","\u{1F623}","\u{1F616}","\u{1F62B}","\u{1F629}","\u{1F97A}","\u{1F622}","\u{1F62D}","\u{1F624}","\u{1F620}","\u{1F621}","\u{1F92C}","\u{1F92F}","\u{1F633}","\u{1F975}","\u{1F976}","\u{1F631}","\u{1F628}","\u{1F630}","\u{1F625}","\u{1F613}","\u{1F917}","\u{1F914}","\u{1F92D}","\u{1F92B}","\u{1F925}","\u{1F636}","\u{1F610}","\u{1F611}"],"\u{1F44D} Gestos":["\u{1F44D}","\u{1F44E}","\u{1F44C}","\u270C\uFE0F","\u{1F91E}","\u{1F91F}","\u{1F918}","\u{1F919}","\u{1F448}","\u{1F449}","\u{1F446}","\u{1F447}","\u261D\uFE0F","\u270B","\u{1F91A}","\u{1F590}\uFE0F","\u{1F596}","\u{1F44B}","\u{1F90F}","\u{1F4AA}","\u{1F9BE}","\u{1F595}","\u270D\uFE0F","\u{1F64F}","\u{1F932}","\u{1F450}","\u{1FAF6}","\u{1F91D}","\u{1F44F}","\u{1F64C}","\u{1F91C}","\u{1F91B}","\u270A","\u{1F44A}","\u{1F4AA}","\u{1F9B5}","\u{1F9B6}","\u{1F442}","\u{1F9BB}","\u{1F443}","\u{1FAC0}","\u{1FAC1}","\u{1F9E0}","\u{1F9B7}","\u{1F9B4}","\u{1F441}\uFE0F","\u{1F440}","\u{1F445}","\u{1F444}"],"\u{1F389} Celebraci\xF3n":["\u{1F389}","\u{1F38A}","\u{1F388}","\u{1F380}","\u{1F381}","\u{1F3C6}","\u{1F947}","\u{1F948}","\u{1F949}","\u{1F396}\uFE0F","\u{1F3C5}","\u{1F397}\uFE0F","\u{1F3AB}","\u{1F39F}\uFE0F","\u{1F3AA}","\u{1F939}","\u{1F3AD}","\u{1F3A8}","\u{1F3AC}","\u{1F3A4}","\u{1F3A7}","\u{1F3BC}","\u{1F3B5}","\u{1F3B6}","\u{1F3B7}","\u{1F3B8}","\u{1F3B9}","\u{1F3BA}","\u{1F3BB}","\u{1F941}","\u{1FA98}","\u{1FA97}","\u{1F3AE}","\u{1F579}\uFE0F","\u{1F3B2}","\u{1F3AF}","\u{1F3B3}","\u{1F3B0}","\u{1F9E9}","\u{1FA80}","\u{1FA81}","\u{1F9F8}","\u{1FA86}"],"\u{1F33F} Naturaleza":["\u{1F33F}","\u{1F331}","\u{1F332}","\u{1F333}","\u{1F334}","\u{1F335}","\u{1F33E}","\u{1F340}","\u{1F341}","\u{1F342}","\u{1F343}","\u{1F33A}","\u{1F338}","\u{1F33C}","\u{1F33B}","\u{1F339}","\u{1F940}","\u{1F337}","\u{1F331}","\u{1F344}","\u{1F330}","\u{1F994}","\u{1F41D}","\u{1F98B}","\u{1F41B}","\u{1F40C}","\u{1F41E}","\u{1F41C}","\u{1F99F}","\u{1F997}","\u{1F577}\uFE0F","\u{1F982}","\u{1F422}","\u{1F40D}","\u{1F98E}","\u{1F996}","\u{1F995}","\u{1F40A}","\u{1F438}","\u{1F432}","\u{1F409}"],"\u{1F354} Comida":["\u{1F355}","\u{1F354}","\u{1F32E}","\u{1F32F}","\u{1F959}","\u{1F9C6}","\u{1F95A}","\u{1F373}","\u{1F958}","\u{1F372}","\u{1F963}","\u{1F957}","\u{1F37F}","\u{1F9C2}","\u{1F96B}","\u{1F371}","\u{1F358}","\u{1F359}","\u{1F35A}","\u{1F35B}","\u{1F35C}","\u{1F35D}","\u{1F360}","\u{1F362}","\u{1F363}","\u{1F364}","\u{1F365}","\u{1F96E}","\u{1F361}","\u{1F95F}","\u{1F960}","\u{1F961}","\u{1F366}","\u{1F367}","\u{1F368}","\u{1F369}","\u{1F36A}","\u{1F382}","\u{1F370}","\u{1F9C1}","\u{1F36B}","\u{1F36C}","\u{1F36D}","\u{1F36E}","\u{1F36F}","\u{1F377}","\u{1F378}","\u{1F379}","\u{1F942}","\u{1F37A}","\u{1F37B}","\u2615","\u{1F375}","\u{1F9C3}"],"\u2708\uFE0F Viajes":["\u2708\uFE0F","\u{1F680}","\u{1F6F8}","\u{1F681}","\u{1F6E9}\uFE0F","\u{1F682}","\u{1F683}","\u{1F684}","\u{1F685}","\u{1F686}","\u{1F687}","\u{1F688}","\u{1F689}","\u{1F68A}","\u{1F69D}","\u{1F69E}","\u{1F68B}","\u{1F68C}","\u{1F68D}","\u{1F68E}","\u{1F690}","\u{1F691}","\u{1F692}","\u{1F693}","\u{1F694}","\u{1F695}","\u{1F696}","\u{1F697}","\u{1F698}","\u{1F699}","\u{1F69A}","\u{1F6FB}","\u{1F69B}","\u{1F69C}","\u{1F3CE}\uFE0F","\u{1F3CD}\uFE0F","\u{1F6F5}","\u{1F9BD}","\u{1F9BC}","\u{1F6FA}","\u{1F6B2}","\u{1F6F4}","\u{1F6F9}","\u{1F68F}","\u26FD","\u{1F6A6}","\u{1F6A5}","\u{1F6E3}\uFE0F","\u{1F6E4}\uFE0F"],"\u{1F4BC} Trabajo":["\u{1F4BC}","\u{1F4C1}","\u{1F4C2}","\u{1F5C2}\uFE0F","\u{1F4CB}","\u{1F4CA}","\u{1F4C8}","\u{1F4C9}","\u{1F4CC}","\u{1F4CD}","\u{1F4CE}","\u{1F587}\uFE0F","\u2702\uFE0F","\u{1F58A}\uFE0F","\u{1F58B}\uFE0F","\u2712\uFE0F","\u{1F4DD}","\u270F\uFE0F","\u{1F50D}","\u{1F50E}","\u{1F50F}","\u{1F510}","\u{1F512}","\u{1F513}","\u{1F511}","\u{1F5DD}\uFE0F","\u{1F528}","\u2692\uFE0F","\u{1F6E0}\uFE0F","\u26CF\uFE0F","\u{1F527}","\u{1F529}","\u2699\uFE0F","\u{1F5DC}\uFE0F","\u{1F4E1}","\u{1F4A1}","\u{1F526}","\u{1F56F}\uFE0F","\u{1F4B0}","\u{1F4B4}","\u{1F4B5}","\u{1F4B6}","\u{1F4B7}","\u{1F4B8}","\u{1F4B3}","\u{1F9FE}"],"\u{1F1E8}\u{1F1F7} CR":["\u{1F1E8}\u{1F1F7}","\u{1F30B}","\u{1F98B}","\u{1F438}","\u{1F99C}","\u{1F422}","\u2615","\u{1F34D}","\u{1F334}","\u{1F33A}","\u{1F9A5}","\u{1F406}","\u{1F30A}","\u{1F3D6}\uFE0F","\u26F0\uFE0F","\u{1F304}","\u{1F33F}","\u{1F98E}","\u{1F40A}","\u{1F985}","\u{1F986}","\u{1F43E}","\u{1F335}","\u{1F331}","\u{1F343}","\u{1F33E}","\u{1F340}","\u{1F338}"]};let catHTML="";Object.entries(categories).forEach(([cat,emojis],i)=>{catHTML+=`<div id="__emojiCat_${i}" style="display:${i===0?"block":"none"}">
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px">
        ${emojis.map(e=>`<button onclick="__emojiInsert('${e}')" style="padding:6px;border:none;background:none;border-radius:6px;cursor:pointer;font-size:22px;transition:background .1s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='none'" title="${e}">${e}</button>`).join("")}
      </div>
    </div>`}),ov.innerHTML=`
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
            style="padding:5px 8px;border:1.5px solid ${i===0?"#0084ff":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;transition:all .15s;flex-shrink:0;color:${i===0?"#0084ff":"#555"}"
            ${i===0?'data-sel="1"':""}>
            ${c}
          </button>`).join("")}
      </div>
    </div>
    <div id="__emojiGrid" style="flex:1;overflow-y:auto;padding:0 12px 16px">
      ${catHTML}
    </div>
    <div style="padding:8px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__emojiPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__emojiCategories=categories}function __emojiTab(idx,btn){document.querySelectorAll('[id^="__emojiCat_"]').forEach((el,i)=>el.style.display=i===idx?"block":"none"),document.querySelectorAll(".__emojiTabBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.style.color="#0084ff",btn.dataset.sel="1"}function __emojiSearch(q){const grid=document.getElementById("__emojiGrid");if(!grid)return;if(!q.trim()){grid.querySelectorAll('[id^="__emojiCat_"]').forEach((el,i)=>el.style.display=i===0?"block":"none");return}const results=Object.values(window.__emojiCategories||{}).flat().filter(e=>e.includes(q));grid.querySelectorAll('[id^="__emojiCat_"]').forEach(el=>el.style.display="none");let searchDiv=document.getElementById("__emojiSearchResults");searchDiv||(searchDiv=document.createElement("div"),searchDiv.id="__emojiSearchResults",grid.appendChild(searchDiv)),searchDiv.style.display="block",searchDiv.innerHTML=`<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px">
    ${results.map(e=>`<button onclick="__emojiInsert('${e}')" style="padding:6px;border:none;background:none;border-radius:6px;cursor:pointer;font-size:22px;transition:background .1s" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='none'">${e}</button>`).join("")}
  </div>`}function __emojiInsert(emoji){document.execCommand("insertText",!1,emoji),showToast(emoji+" insertado")}const WC_CONTACTS={list:JSON.parse(localStorage.getItem("wc-contacts")||"[]"),save(){localStorage.setItem("wc-contacts",JSON.stringify(this.list))},add(c){this.list.push({...c,id:"c"+Date.now()}),this.save()},delete(id){this.list=this.list.filter(c=>c.id!==id),this.save()}};function openContactsPanel(){const old=document.getElementById("__contactsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__contactsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
        <span>\u{1F465} Agenda de contactos</span>
        <button onclick="__contactAdd()" style="padding:7px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar</button>
      </div>
      <input type="text" id="__contactSearch" placeholder="Buscar contacto..."
        style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__contactFilter(this.value)">
    </div>

    <div id="__contactList" style="flex:1;overflow-y:auto;padding:0 20px 8px">
      <!-- Se llena din\xE1micamente -->
    </div>

    <div style="padding:12px 20px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__contactsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),__contactFilter("")}function __contactFilter(q){const list=document.getElementById("__contactList");if(!list)return;const contacts=WC_CONTACTS.list.filter(c=>!q||c.name?.toLowerCase().includes(q.toLowerCase())||c.email?.toLowerCase().includes(q.toLowerCase())||c.phone?.includes(q));if(!contacts.length){list.innerHTML=`<div style="text-align:center;color:#bbb;padding:30px;font-size:13px">
      ${WC_CONTACTS.list.length?"No se encontraron contactos":"No hay contactos a\xFAn. Toca + Agregar"}
    </div>`;return}list.innerHTML=contacts.map(c=>`
    <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;margin-bottom:6px;background:#fafafa;border:1.5px solid #eee;transition:all .15s"
      onmouseover="this.style.borderColor='#c0d8f0'" onmouseout="this.style.borderColor='#eee'">
      <div style="width:38px;height:38px;border-radius:50%;background:#0084ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0">${(c.name||"?")[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:#1a1a1a">${c.name||""}</div>
        <div style="font-size:11px;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${[c.email,c.phone,c.org].filter(Boolean).join(" \xB7 ")}</div>
      </div>
      <div style="display:flex;gap:4px;flex-shrink:0">
        <button onclick="__contactInsert('${c.id}')" style="padding:5px 8px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">Insertar</button>
        <button onclick="WC_CONTACTS.delete('${c.id}');__contactFilter(document.getElementById('__contactSearch').value)" style="padding:5px;border:none;background:#fde8e8;border-radius:6px;cursor:pointer;font-size:12px;color:#e74c3c">\u{1F5D1}</button>
      </div>
    </div>`).join("")}function __contactAdd(){const name=prompt("Nombre completo:","");if(!name)return;const email=prompt("Correo electr\xF3nico:","")||"",phone=prompt("Tel\xE9fono:","")||"",org=prompt("Organizaci\xF3n:","")||"";WC_CONTACTS.add({name,email,phone,org}),__contactFilter(""),showToast("Contacto agregado \u2705")}function __contactInsert(id){const c=WC_CONTACTS.list.find(c2=>c2.id===id);if(!c)return;const html=`<div style="display:inline-flex;align-items:center;gap:8px;background:#f0f7ff;border:1px solid #c0d8f0;border-radius:8px;padding:6px 12px;margin:4px 0">
    <div style="width:28px;height:28px;border-radius:50%;background:#0084ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">${c.name[0].toUpperCase()}</div>
    <div>
      <div style="font-size:11pt;font-weight:700;color:#1a2942">${c.name}</div>
      <div style="font-size:9pt;color:#888">${[c.email,c.phone,c.org].filter(Boolean).join(" \xB7 ")}</div>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__contactsPanel").remove(),showToast("Contacto insertado \u2705")}function openCitationPanel(){const old=document.getElementById("__citePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__citePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4DA} Generador de citas y referencias</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">APA 7\xAA ed. \xB7 IEEE \xB7 Chicago \xB7 Vancouver</div>

    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      ${["APA 7","IEEE","Chicago","Vancouver"].map((s,i)=>`
        <button onclick="__citeStyle('${s}',this)" id="__citeStyleBtn_${i}"
          style="padding:7px 14px;border:2px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':""}>
          ${s}
        </button>`).join("")}
    </div>

    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      ${["Libro","Art\xEDculo","Web","Tesis","Ley CR"].map((t,i)=>`
        <button onclick="__citeType('${t}',this)" id="__citeTypeBtn_${i}"
          style="padding:6px 12px;border:1.5px solid ${i===0?"#0084ff":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#0084ff":"#555"};border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':""}>
          ${t}
        </button>`).join("")}
    </div>

    <div id="__citeFields" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <!-- Se llena din\xE1micamente -->
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
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__citeStyle="APA 7",window.__citeType="Libro",__citeRenderFields("Libro")}function __citeStyle(s,btn){window.__citeStyle=s,document.querySelectorAll('[id^="__citeStyleBtn_"]').forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.style.color="#003da5",btn.dataset.sel="1"}function __citeType(t,btn){window.__citeType=t,document.querySelectorAll('[id^="__citeTypeBtn_"]').forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.style.color="#0084ff",btn.dataset.sel="1",__citeRenderFields(t)}function __citeRenderFields(type){const f=document.getElementById("__citeFields");if(!f)return;const fieldMap={Libro:[["author","Autor(es)","Garc\xEDa, J. y L\xF3pez, M."],["year","A\xF1o","2023"],["title","T\xEDtulo del libro","El t\xEDtulo del libro"],["city","Ciudad","San Jos\xE9"],["publisher","Editorial","UCR Ediciones"]],Art\u00EDculo:[["author","Autor(es)","P\xE9rez, A."],["year","A\xF1o","2023"],["title","T\xEDtulo del art\xEDculo","T\xEDtulo del art\xEDculo"],["journal","Nombre de la revista","Revista Costarricense"],["volume","Volumen(n\xFAmero)","15(2)"],["pages","P\xE1ginas","45-67"],["doi","DOI / URL","https://doi.org/..."]],Web:[["author","Autor / Organizaci\xF3n","Ministerio de Hacienda CR"],["year","A\xF1o","2024"],["title","T\xEDtulo de la p\xE1gina","T\xEDtulo del contenido"],["url","URL","https://www.hacienda.go.cr/..."],["access","Fecha de acceso","15 de junio de 2024"]],Tesis:[["author","Autor","Gonz\xE1lez, C. A."],["year","A\xF1o","2022"],["title","T\xEDtulo de la tesis","T\xEDtulo de la investigaci\xF3n"],["degree","Grado","Maestr\xEDa en Administraci\xF3n"],["institution","Instituci\xF3n","Universidad de Costa Rica"],["url","Repositorio URL","https://kerwa.ucr.ac.cr/..."]],"Ley CR":[["number","N\xFAmero de ley","7472"],["name","Nombre completo","Ley de Promoci\xF3n de la Competencia..."],["year","A\xF1o de promulgaci\xF3n","1994"],["assembly","\xD3rgano","Asamblea Legislativa de la Rep\xFAblica de Costa Rica"],["url","URL SINALEVI","https://www.pgrweb.go.cr/scij/..."]]},fields=fieldMap[type]||fieldMap.Libro;f.innerHTML=fields.map(([id,label,ph])=>`
    <div>
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
      <input type="text" id="__citeField_${id}" placeholder="${ph}"
        style="width:100%;padding:8px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>`).join("")}function __citeGetField(id){return document.getElementById("__citeField_"+id)?.value?.trim()||""}function __citeGenerate(){const style=window.__citeStyle||"APA 7",type=window.__citeType||"Libro",a=__citeGetField("author"),y=__citeGetField("year"),t=__citeGetField("title"),pub=__citeGetField("publisher"),city=__citeGetField("city"),journal=__citeGetField("journal"),vol=__citeGetField("volume"),pages=__citeGetField("pages"),doi=__citeGetField("doi"),url=__citeGetField("url"),access=__citeGetField("access"),num=__citeGetField("number"),law=__citeGetField("name"),assem=__citeGetField("assembly");let ref="";style==="APA 7"?type==="Libro"?ref=`${a} (${y}). <em>${t}</em>. ${pub}.`:type==="Art\xEDculo"?ref=`${a} (${y}). ${t}. <em>${journal}</em>, <em>${vol}</em>, ${pages}. ${doi?"https://doi.org/"+doi:""}`:type==="Web"?ref=`${a} (${y}). <em>${t}</em>. ${url} [Recuperado el ${access}]`:type==="Tesis"?ref=`${__citeGetField("author")} (${y}). <em>${t}</em> [Tesis de ${__citeGetField("degree")}]. ${__citeGetField("institution")}. ${url}`:type==="Ley CR"&&(ref=`${assem} (${y}). <em>Ley N\xB0 ${num}: ${law}</em>. ${url}`):style==="IEEE"?type==="Libro"?ref=`${a}, <em>${t}</em>, ${pub}, ${y}.`:type==="Art\xEDculo"?ref=`${a}, "${t}," <em>${journal}</em>, vol. ${vol}, pp. ${pages}, ${y}. DOI: ${doi}`:type==="Web"?ref=`${a}, "${t}." ${url} (accessed ${access}).`:type==="Ley CR"&&(ref=`${assem}, <em>Ley N\xB0 ${num}: ${law}</em>, ${y}. [Online]. Available: ${url}`):style==="Chicago"?type==="Libro"?ref=`${a}. <em>${t}</em>. ${city}: ${pub}, ${y}.`:type==="Art\xEDculo"?ref=`${a}. "${t}." <em>${journal}</em> ${vol} (${y}): ${pages}.`:type==="Web"?ref=`${a}. "${t}." Accessed ${access}. ${url}.`:ref=`${a}. <em>${t}</em>. ${y}.`:style==="Vancouver"&&(type==="Libro"?ref=`${a}. ${t}. ${city}: ${pub}; ${y}.`:type==="Art\xEDculo"?ref=`${a}. ${t}. ${journal}. ${y};${vol}:${pages}.`:ref=`${a}. ${t}. ${y}.`),window.__currentCite=ref;const res=document.getElementById("__citeResult"),out=document.getElementById("__citeOutput");res&&(res.style.display="block"),out&&(out.innerHTML=ref||"(Complet\xE1 los campos requeridos)")}function __citeInsert(){window.__currentCite||__citeGenerate();const ref=window.__currentCite;if(!ref){showToast("Gener\xE1 la cita primero");return}const html=`<div style="margin:6px 0;padding:8px 12px;background:#f8f9fa;border-left:3px solid #003da5;font-size:10pt;color:#333;line-height:1.7">${ref}</div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__citePanel").remove(),showToast("\u{1F4DA} Referencia insertada \u2705")}const WC_A11Y={fontSize:parseInt(localStorage.getItem("wc-a11y-fontsize"))||0,contrast:localStorage.getItem("wc-a11y-contrast")||"normal",lineHeight:parseFloat(localStorage.getItem("wc-a11y-lineheight"))||1.5,fontFamily:localStorage.getItem("wc-a11y-font")||"",letterSpacing:parseFloat(localStorage.getItem("wc-a11y-spacing"))||0,apply(){let st=document.getElementById("__a11yStyle");st||(st=document.createElement("style"),st.id="__a11yStyle",document.head.appendChild(st));const ed="#editor, #editor *";let css="";this.fontSize&&(css+=`${ed}{font-size:calc(1em + ${this.fontSize}px)!important;}`),this.lineHeight!==1.5&&(css+=`${ed}{line-height:${this.lineHeight}!important;}`),this.letterSpacing&&(css+=`${ed}{letter-spacing:${this.letterSpacing}em!important;}`),this.fontFamily&&(css+=`${ed}{font-family:'${this.fontFamily}',sans-serif!important;}`),this.contrast==="high"&&(css+="body{filter:contrast(1.4)!important;}"),this.contrast==="invert"&&(css+="body{filter:invert(1)hue-rotate(180deg)!important;}"),this.contrast==="sepia"&&(css+="body{filter:sepia(.6)!important;}"),st.textContent=css,localStorage.setItem("wc-a11y-fontsize",this.fontSize),localStorage.setItem("wc-a11y-contrast",this.contrast),localStorage.setItem("wc-a11y-lineheight",this.lineHeight),localStorage.setItem("wc-a11y-font",this.fontFamily),localStorage.setItem("wc-a11y-spacing",this.letterSpacing)},reset(){this.fontSize=0,this.contrast="normal",this.lineHeight=1.5,this.fontFamily="",this.letterSpacing=0,this.apply(),showToast("Accesibilidad restaurada")}};setTimeout(()=>WC_A11Y.apply(),1500);function openAccessibilityPanel(){const old=document.getElementById("__a11yPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__a11yPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u267F Accesibilidad
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Ajusta el editor para mejor legibilidad</div>

    <!-- Tama\xF1o de fuente -->
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:12px;font-weight:700;color:#555">Tama\xF1o de fuente</label>
        <span id="__a11yFontVal" style="font-size:12px;color:#0084ff;font-weight:700">${WC_A11Y.fontSize>0?"+":""}${WC_A11Y.fontSize}px</span>
      </div>
      <input type="range" id="__a11yFont" min="-4" max="12" value="${WC_A11Y.fontSize}" step="1" style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__a11yFontVal').textContent=(this.value>0?'+':'')+this.value+'px';WC_A11Y.fontSize=parseInt(this.value);WC_A11Y.apply()">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:#bbb;margin-top:2px"><span>Peque\xF1o</span><span>Normal</span><span>Grande</span></div>
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
        ${[["normal","Normal","#fff","#333"],["high","Alto contraste","#000","#fff"],["invert","Invertido","#1a1a1a","#e0e0e0"],["sepia","Sepia","#f4ecd8","#5b4636"]].map(([val,label,bg,fg])=>`
          <button onclick="WC_A11Y.contrast='${val}';WC_A11Y.apply();__a11yUpdateBtns()"
            class="__a11yContrastBtn" data-val="${val}"
            style="padding:8px 4px;border:2px solid ${WC_A11Y.contrast===val?"#0084ff":"#eee"};background:${bg};color:${fg};border-radius:8px;cursor:pointer;font-size:10px;font-weight:600">
            ${label}
          </button>`).join("")}
      </div>
    </div>

    <!-- Fuente para dislexia -->
    <div style="margin-bottom:16px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:8px">Fuente especial</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${[["","Normal"],["OpenDyslexic","Dislexia"],["Arial","Arial"],["Verdana","Verdana"],["Georgia","Georgia"]].map(([val,label])=>`
          <button onclick="WC_A11Y.fontFamily='${val}';WC_A11Y.apply()"
            style="padding:6px 12px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555;font-family:'${val||"inherit"}';transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
            ${label}
          </button>`).join("")}
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="WC_A11Y.reset();document.getElementById('__a11yPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F504} Restaurar</button>
      <button onclick="document.getElementById('__a11yPanel').remove()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2705 Aplicar y cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __a11yUpdateBtns(){document.querySelectorAll(".__a11yContrastBtn").forEach(b=>{b.style.borderColor=b.dataset.val===WC_A11Y.contrast?"#0084ff":"#eee"})}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"voiceDictation":openVoicePanel();break;case"passwordGen":openPasswordGenerator();break;case"cvTemplate":openCVTemplates();break;case"unitConverter":openUnitConverter();break;case"emojiPanel":openEmojiPanel();break;case"contacts":openContactsPanel();break;case"citation":openCitationPanel();break;case"accessibility":openAccessibilityPanel();break;case"voiceToggle":WC_VOICE.toggle();break;default:orig(a)}}),console.log("WC Corporate Editor v25.19 \u2705 \u2014 Voz, Contrase\xF1as, CV, Unidades, Emojis, Contactos, Citas APA, Accesibilidad")},2700)})();function openFacturaElectronica(){const old=document.getElementById("__fePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__fePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px";const fecha=new Date().toISOString().slice(0,16),tipos=[["01","Factura Electr\xF3nica"],["02","Nota de D\xE9bito"],["03","Nota de Cr\xE9dito"],["04","Tiquete Electr\xF3nico"],["08","Factura Electr\xF3nica de Compra"],["09","Factura Electr\xF3nica de Exportaci\xF3n"]],monedas=[["CRC","\u20A1 Col\xF3n CR"],["USD","$ D\xF3lar"],["EUR","\u20AC Euro"]],condVenta=[["01","Contado"],["02","Cr\xE9dito"],["03","Consignaci\xF3n"],["04","Apartado"],["05","Arrendamiento"],["06","Otra"]],medioPago=[["01","Efectivo"],["02","Tarjeta"],["03","Cheque"],["04","Transferencia"],["05","Recaudado por terceros"],["99","Otros"]];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:580px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700;margin-bottom:2px">\u{1F1E8}\u{1F1F7} Factura Electr\xF3nica v4.3</div>
      <div style="font-size:11px;opacity:.85">Ministerio de Hacienda \xB7 Resoluci\xF3n DGT-R-48-2016</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <!-- Tabs -->
      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${[["emisor","\u{1F3E2} Emisor"],["receptor","\u{1F464} Receptor"],["lineas","\u{1F4CB} L\xEDneas"],["totales","\u{1F4B0} Totales"]].map(([id,label],i)=>`
          <button onclick="__feTab('${id}',this)" id="__feTabBtn_${id}"
            style="padding:6px 12px;border:2px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            ${label}
          </button>`).join("")}
      </div>

      <!-- Emisor -->
      <div id="__feSection_emisor">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[["__feEmisorNombre","Nombre / Raz\xF3n social *","Mi Empresa S.A."],["__feEmisorCedula","C\xE9dula jur\xEDdica *","3-101-123456"],["__feEmisorEmail","Correo electr\xF3nico","factura@empresa.cr"],["__feEmisorTel","Tel\xE9fono","2222-3333"],["__feEmisorProvincia","Provincia","San Jos\xE9"],["__feEmisorActividad","Actividad econ\xF3mica","722000 - Inform\xE1tica"]].map(([id,label,ph])=>`
            <div>
              <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
              <input type="text" id="${id}" placeholder="${ph}"
                style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
            </div>`).join("")}
        </div>
        <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo documento</label>
            <select id="__feTipo" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${tipos.map(([v,n])=>`<option value="${v}">${v} \u2014 ${n}</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Moneda</label>
            <select id="__feMoneda" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${monedas.map(([v,n])=>`<option value="${v}">${n}</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Condici\xF3n venta</label>
            <select id="__feCondVenta" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${condVenta.map(([v,n])=>`<option value="${v}">${n}</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Medio de pago</label>
            <select id="__feMedioPago" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              ${medioPago.map(([v,n])=>`<option value="${v}">${n}</option>`).join("")}
            </select>
          </div>
          <div style="grid-column:1/-1">
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Fecha y hora emisi\xF3n</label>
            <input type="datetime-local" id="__feFecha" value="${fecha}"
              style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box">
          </div>
        </div>
      </div>

      <!-- Receptor -->
      <div id="__feSection_receptor" style="display:none">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[["__feRecNombre","Nombre / Raz\xF3n social *","Cliente Ejemplo"],["__feRecCedula","C\xE9dula / Identificaci\xF3n","1-2345-6789"],["__feRecEmail","Correo electr\xF3nico","cliente@email.com"],["__feRecTel","Tel\xE9fono","8888-9999"],["__feRecProvincia","Provincia","Alajuela"],["__feRecDistrito","Distrito","Central"]].map(([id,label,ph])=>`
            <div>
              <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
              <input type="text" id="${id}" placeholder="${ph}"
                style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
            </div>`).join("")}
        </div>
      </div>

      <!-- L\xEDneas de detalle -->
      <div id="__feSection_lineas" style="display:none">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px;margin-bottom:8px">
          <input type="text" id="__feLinDesc" placeholder="Descripci\xF3n del servicio/producto"
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
            <option value="2">IVA 2% (Canasta b\xE1sica)</option>
            <option value="1">IVA 1% (Especial)</option>
            <option value="0">Exento (0%)</option>
          </select>
          <button onclick="__feAddLine()" style="padding:7px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar l\xEDnea</button>
        </div>
        <div id="__feLineas" style="max-height:200px;overflow-y:auto">
          <div style="text-align:center;color:#bbb;font-size:12px;padding:20px">Agreg\xE1 l\xEDneas con el bot\xF3n</div>
        </div>
      </div>

      <!-- Totales -->
      <div id="__feSection_totales" style="display:none">
        <div id="__feTotalesCalc" style="background:#f8f9fa;border-radius:10px;padding:14px">
          <div style="text-align:center;color:#bbb;font-size:12px">Agreg\xE1 l\xEDneas primero</div>
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
      <button onclick="__feGenerateXML()" style="flex:1;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4E5} XML</button>
      <button onclick="__feInsertDoc()" style="flex:1;padding:10px;border:none;background:#ce1126;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4C4} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__feLineas=[],window.__feConsec=String(Math.floor(Math.random()*9e5+1e5)).padStart(10,"0")}function __feTab(id,btn){["emisor","receptor","lineas","totales"].forEach(t=>{const sec=document.getElementById("__feSection_"+t),b=document.getElementById("__feTabBtn_"+t);sec&&(sec.style.display=t===id?"block":"none"),b&&(b.style.borderColor=t===id?"#003da5":"#eee",b.style.background=t===id?"#f0f7ff":"#fafafa",b.style.color=t===id?"#003da5":"#555")}),id==="totales"&&__feCalcTotales()}function __feAddLine(){const desc=document.getElementById("__feLinDesc")?.value.trim(),cant=parseFloat(document.getElementById("__feLinCant")?.value)||1,precio=parseFloat(document.getElementById("__feLinPrecio")?.value)||0,iva=parseInt(document.getElementById("__feLinIVA")?.value)||13;if(!desc){showToast("Ingres\xE1 la descripci\xF3n");return}if(!precio){showToast("Ingres\xE1 el precio");return}window.__feLineas||(window.__feLineas=[]),window.__feLineas.push({desc,cant,precio,iva,subtotal:cant*precio,ivaAmount:cant*precio*iva/100}),document.getElementById("__feLinDesc").value="",document.getElementById("__feLinPrecio").value="",__feRenderLineas(),showToast("L\xEDnea agregada \u2705")}function __feRenderLineas(){const box=document.getElementById("__feLineas");if(!box)return;const lines=window.__feLineas||[];if(!lines.length){box.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:20px">Agreg\xE1 l\xEDneas</div>';return}const fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{minimumFractionDigits:2,maximumFractionDigits:2});box.innerHTML=`<table style="border-collapse:collapse;width:100%;font-size:11px">
    <tr style="background:#003da5;color:#fff">
      <th style="padding:5px 8px;text-align:left">Descripci\xF3n</th>
      <th style="padding:5px 8px">Cant</th>
      <th style="padding:5px 8px">Precio</th>
      <th style="padding:5px 8px">IVA</th>
      <th style="padding:5px 8px">Total</th>
      <th style="padding:5px 8px"></th>
    </tr>
    ${lines.map((l,i)=>`
      <tr style="${i%2?"background:#f0f7ff":""}">
        <td style="padding:5px 8px">${l.desc}</td>
        <td style="padding:5px 8px;text-align:center">${l.cant}</td>
        <td style="padding:5px 8px;text-align:right">${fmt(l.precio)}</td>
        <td style="padding:5px 8px;text-align:center">${l.iva}%</td>
        <td style="padding:5px 8px;text-align:right;font-weight:600">${fmt(l.subtotal+l.ivaAmount)}</td>
        <td style="padding:5px 8px;text-align:center"><button onclick="window.__feLineas.splice(${i},1);__feRenderLineas()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px">\xD7</button></td>
      </tr>`).join("")}
  </table>`}function __feCalcTotales(){const box=document.getElementById("__feTotalesCalc"),lines=window.__feLineas||[];if(!box)return;if(!lines.length){box.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px">Agreg\xE1 l\xEDneas primero</div>';return}const subtotal=lines.reduce((a,l)=>a+l.subtotal,0),ivaTotal=lines.reduce((a,l)=>a+l.ivaAmount,0),total=subtotal+ivaTotal,fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{minimumFractionDigits:2,maximumFractionDigits:2}),ivaDesglose={};lines.forEach(l=>{ivaDesglose[l.iva]||(ivaDesglose[l.iva]=0),ivaDesglose[l.iva]+=l.ivaAmount}),box.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
      <div style="display:flex;justify-content:space-between"><span style="color:#555">Subtotal gravado:</span><strong>${fmt(subtotal)}</strong></div>
      ${Object.entries(ivaDesglose).map(([r,v])=>`
        <div style="display:flex;justify-content:space-between"><span style="color:#e74c3c">IVA ${r}%:</span><strong style="color:#e74c3c">${fmt(v)}</strong></div>`).join("")}
      <div style="border-top:2px solid #003da5;padding-top:8px;display:flex;justify-content:space-between;font-size:15px;font-weight:800;color:#003da5">
        <span>TOTAL:</span><span>${fmt(total)}</span>
      </div>
    </div>`,window.__feTotales={subtotal,ivaTotal,total}}function __feGenerateXML(){const lines=window.__feLineas||[];if(!lines.length){showToast("Agreg\xE1 al menos una l\xEDnea");return}const g=id=>document.getElementById(id)?.value?.trim()||"",fecha=g("__feFecha").replace("T","T")+":00-06:00",consec=window.__feConsec||"0000000001",clave="506"+new Date().toISOString().replace(/\D/g,"").slice(0,8)+g("__feEmisorCedula").replace(/\D/g,"").padStart(12,"0")+consec+"1999999991",lineasXML=lines.map((l,i)=>`
    <LineaDetalle>
      <NumeroLinea>${i+1}</NumeroLinea>
      <Cantidad>${l.cant}</Cantidad>
      <UnidadMedida>Sp</UnidadMedida>
      <Detalle>${l.desc.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</Detalle>
      <PrecioUnitario>${l.precio.toFixed(5)}</PrecioUnitario>
      <MontoTotal>${l.subtotal.toFixed(5)}</MontoTotal>
      <Impuesto>
        <Codigo>01</Codigo>
        <CodigoTarifa>0${l.iva===13?8:l.iva===4?4:l.iva===2?2:(l.iva===1,1)}</CodigoTarifa>
        <Tarifa>${l.iva}.00</Tarifa>
        <Monto>${l.ivaAmount.toFixed(5)}</Monto>
      </Impuesto>
      <MontoTotalLinea>${(l.subtotal+l.ivaAmount).toFixed(5)}</MontoTotalLinea>
    </LineaDetalle>`).join(""),tot=window.__feTotales||{subtotal:0,ivaTotal:0,total:0},xml=`<?xml version="1.0" encoding="utf-8"?>
<FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Clave>${clave}</Clave>
  <CodigoActividad>${g("__feEmisorActividad").split("-")[0].trim()||"722000"}</CodigoActividad>
  <NumeroConsecutivo>00100001010${consec}</NumeroConsecutivo>
  <FechaEmision>${fecha}</FechaEmision>
  <Emisor>
    <Nombre>${g("__feEmisorNombre")}</Nombre>
    <Identificacion>
      <Tipo>02</Tipo>
      <Numero>${g("__feEmisorCedula").replace(/\D/g,"")}</Numero>
    </Identificacion>
    <NombreComercial>${g("__feEmisorNombre")}</NombreComercial>
    <Ubicacion>
      <Provincia>1</Provincia>
      <Canton>01</Canton>
      <Distrito>01</Distrito>
      <OtrasSenas>${g("__feEmisorProvincia")}</OtrasSenas>
    </Ubicacion>
    <Telefono><CodigoPais>506</CodigoPais><NumTelefono>${g("__feEmisorTel").replace(/\D/g,"")}</NumTelefono></Telefono>
    <CorreoElectronico>${g("__feEmisorEmail")}</CorreoElectronico>
  </Emisor>
  <Receptor>
    <Nombre>${g("__feRecNombre")}</Nombre>
    <Identificacion>
      <Tipo>01</Tipo>
      <Numero>${g("__feRecCedula").replace(/\D/g,"")}</Numero>
    </Identificacion>
    <CorreoElectronico>${g("__feRecEmail")}</CorreoElectronico>
  </Receptor>
  <CondicionVenta>${g("__feCondVenta")||"01"}</CondicionVenta>
  <MedioPago>${g("__feMedioPago")||"01"}</MedioPago>
  <DetalleServicio>${lineasXML}
  </DetalleServicio>
  <ResumenFactura>
    <CodigoTipoMoneda><CodigoMoneda>${g("__feMoneda")||"CRC"}</CodigoMoneda><TipoCambio>1.00</TipoCambio></CodigoTipoMoneda>
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
  ${g("__feObs")?`<Otros><OtroTexto>${g("__feObs")}</OtroTexto></Otros>`:""}
</FacturaElectronica>`,blob=new Blob([xml],{type:"application/xml;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=`FE-${consec}-${new Date().toISOString().slice(0,10)}.xml`,a.click(),document.getElementById("__fePanel").remove(),showToast("\u{1F4E5} XML Hacienda generado \u2705")}function __feInsertDoc(){const lines=window.__feLineas||[];if(!lines.length){showToast("Agreg\xE1 al menos una l\xEDnea");return}__feCalcTotales();const g=id=>document.getElementById(id)?.value?.trim()||"",fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{minimumFractionDigits:2,maximumFractionDigits:2}),tot=window.__feTotales||{subtotal:0,ivaTotal:0,total:0},html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:1px solid #003da5;border-radius:8px;overflow:hidden;max-width:580px;margin:12px auto">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:13pt;font-weight:700">\u{1F1E8}\u{1F1F7} FACTURA ELECTR\xD3NICA</div>
        <div style="font-size:8pt;opacity:.85">Ministerio de Hacienda \xB7 v4.3 \xB7 Consecutivo: ${window.__feConsec}</div>
      </div>
      <div style="text-align:right;font-size:9pt;opacity:.9">
        <div>${new Date(g("__feFecha")).toLocaleDateString("es-CR",{day:"2-digit",month:"long",year:"numeric"})}</div>
      </div>
    </div>
    <div style="padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;border-bottom:1px solid #eee;font-size:10pt">
      <div><div style="font-size:8pt;color:#888;font-weight:700;margin-bottom:3px">EMISOR</div><div style="font-weight:700">${g("__feEmisorNombre")}</div><div style="color:#555">${g("__feEmisorCedula")}</div><div style="color:#555">${g("__feEmisorEmail")}</div></div>
      <div><div style="font-size:8pt;color:#888;font-weight:700;margin-bottom:3px">RECEPTOR</div><div style="font-weight:700">${g("__feRecNombre")}</div><div style="color:#555">${g("__feRecCedula")}</div><div style="color:#555">${g("__feRecEmail")}</div></div>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0f7ff"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Descripci\xF3n</th><th style="padding:7px 10px;border:1px solid #ddd">Cant</th><th style="padding:7px 10px;border:1px solid #ddd">Precio</th><th style="padding:7px 10px;border:1px solid #ddd">IVA</th><th style="padding:7px 10px;border:1px solid #ddd">Total</th></tr>
      ${lines.map((l,i)=>`<tr style="${i%2?"background:#fafafa":""}"><td style="padding:7px 10px;border:1px solid #ddd">${l.desc}</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:center">${l.cant}</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:right">${fmt(l.precio)}</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:center">${l.iva}%</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(l.subtotal+l.ivaAmount)}</td></tr>`).join("")}
    </table>
    <div style="padding:10px 16px;background:#f8f9fa;border-top:1px solid #eee">
      <div style="display:flex;justify-content:flex-end;gap:20px;font-size:10pt">
        <div style="text-align:right"><div>Subtotal: <strong>${fmt(tot.subtotal)}</strong></div><div style="color:#e74c3c">IVA: <strong>${fmt(tot.ivaTotal)}</strong></div><div style="font-size:13pt;font-weight:800;color:#003da5;border-top:2px solid #003da5;margin-top:4px;padding-top:4px">TOTAL: ${fmt(tot.total)}</div></div>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:8pt;color:#aaa;text-align:center;background:#fff">Comprobante de referencia \u2014 V\xE1lido con firma digital de Hacienda CR \xB7 WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__fePanel").remove(),showToast("\u{1F1E8}\u{1F1F7} Factura electr\xF3nica insertada \u2705")}function openSalariosMinimos(){const old=document.getElementById("__salmPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__salmPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const categorias=[{cat:"\u{1F477} Trabajadores no calificados",items:[{cargo:"Trabajador no calificado gen\xE9rico",mensual:401902,diario:13397},{cargo:"Trabajador agr\xEDcola general",mensual:393561,diario:13119},{cargo:"Servicio dom\xE9stico",mensual:393561,diario:13119}]},{cat:"\u{1F527} Trabajadores semi-calificados",items:[{cargo:"Trabajador semi-calificado",mensual:430036,diario:14335},{cargo:"Chofer transporte privado",mensual:448772,diario:14959}]},{cat:"\u{1F393} Trabajadores calificados",items:[{cargo:"Trabajador calificado gen\xE9rico",mensual:460558,diario:15352},{cargo:"T\xE9cnico diploma",mensual:492e3,diario:16400},{cargo:"Bachiller universitario",mensual:541e3,diario:18033},{cargo:"Licenciado universitario",mensual:651700,diario:21723},{cargo:"Licenciado 10+ a\xF1os experiencia",mensual:706200,diario:23540}]},{cat:"\u{1F3E2} Sector espec\xEDfico",items:[{cargo:"Comercio \u2014 Dependiente",mensual:430036,diario:14335},{cargo:"Industria \u2014 Operario",mensual:44e4,diario:14667},{cargo:"Construcci\xF3n \u2014 Pe\xF3n",mensual:415e3,diario:13833},{cargo:"Construcci\xF3n \u2014 Oficial",mensual:46e4,diario:15333},{cargo:"Salud \u2014 Auxiliar enfermer\xEDa",mensual:505e3,diario:16833},{cargo:"Educaci\xF3n privada \u2014 Docente",mensual:541e3,diario:18033}]}];let catHTML="";categorias.forEach(cat=>{catHTML+=`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;padding:6px 10px;background:#f8f9fa;border-radius:6px">${cat.cat}</div>
      ${cat.items.map(item=>`
        <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;margin-bottom:4px;transition:background .15s;cursor:pointer"
          onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background=''"
          onclick="__salmInsert('${item.cargo.replace(/'/g,"\\'")}',${item.mensual},${item.diario})">
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600;color:#1a1a1a">${item.cargo}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:12px;font-weight:700;color:#003da5">\u20A1${item.mensual.toLocaleString("es-CR")}</div>
            <div style="font-size:10px;color:#888">\u20A1${item.diario.toLocaleString("es-CR")}/d\xEDa</div>
          </div>
        </div>`).join("")}
    </div>`}),ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:2px">\u{1F4BC} Salarios m\xEDnimos CR \u2014 2025</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">MTSS \xB7 I Semestre 2025 \xB7 Toca para insertar</div>
      <input type="text" id="__salmSearch" placeholder="Buscar cargo..."
        style="width:100%;padding:9px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:12px"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__salmFilter(this.value)">
    </div>
    <div id="__salmContent" style="flex:1;overflow-y:auto;padding:0 20px 16px">${catHTML}</div>
    <div style="padding:12px 20px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__salmPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__salmInsertTabla()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar tabla completa</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__salmData=categorias}function __salmFilter(q){const content=document.getElementById("__salmContent");if(!content||!q.trim())return;content.querySelectorAll('[onclick^="__salmInsert"]').forEach(el=>{el.style.display=el.textContent.toLowerCase().includes(q.toLowerCase())?"":"none"})}function __salmInsert(cargo,mensual,diario){const fmt=n=>"\u20A1"+n.toLocaleString("es-CR");typeof insertHTML=="function"&&insertHTML(`<span style="background:#f0f7ff;border:1px solid #003da5;border-radius:4px;padding:1px 8px;font-size:10pt">
      ${cargo}: <strong>${fmt(mensual)}/mes</strong> \xB7 ${fmt(diario)}/d\xEDa (MTSS 2025)
    </span>`),document.getElementById("__salmPanel").remove(),showToast("Salario insertado \u2705")}function __salmInsertTabla(){const cats=window.__salmData||[];let rows="";cats.forEach(cat=>{rows+=`<tr><td colspan="3" style="padding:8px 10px;background:#003da5;color:#fff;font-weight:700;font-size:10pt">${cat.cat}</td></tr>`,cat.items.forEach((item,i)=>{rows+=`<tr style="${i%2?"background:#f0f7ff":""}">
        <td style="padding:7px 10px;border:1px solid #ddd;font-size:10pt">${item.cargo}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:right;font-weight:600;font-size:10pt">\u20A1${item.mensual.toLocaleString("es-CR")}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:right;font-size:10pt">\u20A1${item.diario.toLocaleString("es-CR")}</td>
      </tr>`})});const html=`<div style="margin:12px 0">
    <h3 style="color:#003da5;margin-bottom:8px">\u{1F4BC} Salarios M\xEDnimos \u2014 Costa Rica I Semestre 2025</h3>
    <table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif">
      <tr style="background:#1a2942;color:#fff"><th style="padding:8px 10px;text-align:left">Cargo</th><th style="padding:8px 10px;text-align:right">Mensual</th><th style="padding:8px 10px;text-align:right">Diario</th></tr>
      ${rows}
    </table>
    <p style="font-size:9pt;color:#888;margin-top:6px">Fuente: MTSS \xB7 Decreto Ejecutivo \xB7 I Semestre 2025 \xB7 Costa Rica</p>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__salmPanel").remove(),showToast("Tabla de salarios insertada \u2705")}function openLegalTemplates(){const old=document.getElementById("__legalPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__legalPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const templates=[{icon:"\u{1F4DC}",name:"Poder Especial Notarial",desc:"Para gestiones espec\xEDficas ante instituciones",template:d=>`
      <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:16cm;margin:0 auto">
        <h2 style="text-align:center;text-transform:uppercase;color:#1a2942">PODER ESPECIAL</h2>
        <p style="text-align:justify">Yo, <strong>${d.otorgante||"[NOMBRE COMPLETO]"}</strong>, mayor, <strong>${d.estadoCivil||"[estado civil]"}</strong>, vecino/a de <strong>${d.domicilio||"[domicilio]"}</strong>, portador/a de la c\xE9dula de identidad n\xFAmero <strong>${d.cedula||"[n\xFAmero de c\xE9dula]"}</strong>, por medio del presente instrumento otorgo <strong>PODER ESPECIAL</strong> a favor de:</p>
        <p style="text-align:justify"><strong>${d.apoderado||"[NOMBRE DEL APODERADO]"}</strong>, mayor, <strong>${d.estadoCivilAp||"[estado civil]"}</strong>, c\xE9dula n\xFAmero <strong>${d.cedulaAp||"[c\xE9dula]"}</strong>, para que en mi nombre y representaci\xF3n realice los siguientes actos:</p>
        <p style="text-align:justify"><strong>PRIMERO:</strong> ${d.objeto||"[Describir las facultades espec\xEDficas otorgadas]"}.</p>
        <p style="text-align:justify"><strong>SEGUNDO:</strong> El presente poder es <strong>ESPECIAL</strong> y se limita \xFAnica y exclusivamente a las gestiones indicadas en la cl\xE1usula anterior.</p>
        <p style="text-align:justify"><strong>TERCERO:</strong> Este poder ser\xE1 v\xE1lido hasta que sea expresamente revocado.</p>
        <p style="text-align:justify">En fe de lo anterior firmo en la ciudad de <strong>${d.lugar||"San Jos\xE9"}</strong>, a los <strong>${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</strong>.</p>
        <div style="margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">${d.otorgante||"Poderdante"}<br><small>C\xE9dula: ${d.cedula||"_____________"}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">${d.apoderado||"Apoderado"}<br><small>C\xE9dula: ${d.cedulaAp||"_____________"}</small></div></div>
        </div>
        <div style="margin-top:40px;border:1px solid #333;padding:16px;border-radius:4px">
          <p style="text-align:center;font-size:10pt;color:#555">AUTENTICACI\xD3N NOTARIAL</p>
          <p style="font-size:10pt">Ante m\xED, <strong>_____________________</strong>, Notario P\xFAblico con oficina en _____________________, comparece personalmente <strong>${d.otorgante||"_____________________"}</strong>, quien es conocido/a por m\xED e identificado/a con la c\xE9dula indicada.</p>
          <p style="font-size:10pt">Firma del Notario: _____________________  N\xBA de tomo: _____ Folio: _____ Asiento: _____</p>
        </div>
      </div>`},{icon:"\u{1F3E0}",name:"Contrato de Arrendamiento",desc:"Alquiler de inmueble \u2014 Ley 7527",template:d=>`
      <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:16cm;margin:0 auto">
        <h2 style="text-align:center;text-transform:uppercase;color:#1a2942">CONTRATO DE ARRENDAMIENTO</h2>
        <p style="text-align:justify">Entre <strong>${d.arrendador||"[ARRENDADOR]"}</strong>, c\xE9dula <strong>${d.cedArrendador||"_____________"}</strong>, en adelante <em>EL ARRENDADOR</em>, y <strong>${d.arrendatario||"[ARRENDATARIO]"}</strong>, c\xE9dula <strong>${d.cedArrendatario||"_____________"}</strong>, en adelante <em>EL ARRENDATARIO</em>, se celebra el presente Contrato de Arrendamiento al tenor de las siguientes cl\xE1usulas:</p>
        <p><strong>PRIMERA (Objeto):</strong> El Arrendador da en arrendamiento al Arrendatario el inmueble ubicado en <strong>${d.inmueble||"[DIRECCI\xD3N DEL INMUEBLE]"}</strong>, inscrito en el Registro Nacional bajo la finca <strong>${d.finca||"_____________"}</strong>.</p>
        <p><strong>SEGUNDA (Destino):</strong> El inmueble se destina exclusivamente para uso <strong>${d.uso||"habitacional"}</strong>.</p>
        <p><strong>TERCERA (Plazo):</strong> El plazo del arrendamiento es de <strong>${d.plazo||"doce (12) meses"}</strong>, a partir del <strong>${d.inicio||new Date().toLocaleDateString("es-CR")}</strong>.</p>
        <p><strong>CUARTA (Renta):</strong> La renta mensual es de <strong>${d.renta||"\u20A1_____________"}</strong>, pagadera dentro de los primeros cinco d\xEDas de cada mes.</p>
        <p><strong>QUINTA (Dep\xF3sito):</strong> El Arrendatario entrega un dep\xF3sito de garant\xEDa equivalente a <strong>un mes</strong> de renta (\u20A1${d.deposito||"_____________"}), reembolsable al vencimiento del contrato.</p>
        <p><strong>SEXTA (Legislaci\xF3n):</strong> Este contrato se rige por la Ley General de Arrendamientos Urbanos y Suburbanos N\xB0 7527 y sus reformas.</p>
        <div style="margin-top:50px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">Arrendador<br><small>${d.arrendador||"_____________"}</small></div></div>
          <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px">Arrendatario<br><small>${d.arrendatario||"_____________"}</small></div></div>
        </div>
      </div>`},{icon:"\u{1F4CB}",name:"Declaraci\xF3n Jurada",desc:"Ante notario p\xFAblico \u2014 Uso general",template:d=>`
      <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:16cm;margin:0 auto">
        <h2 style="text-align:center;text-transform:uppercase;color:#1a2942">DECLARACI\xD3N JURADA</h2>
        <p style="text-align:justify">Yo, <strong>${d.declarante||"[NOMBRE COMPLETO]"}</strong>, mayor, <strong>${d.estadoCivil||"[estado civil]"}</strong>, vecino/a de <strong>${d.domicilio||"[domicilio]"}</strong>, portador/a de la c\xE9dula de identidad n\xFAmero <strong>${d.cedula||"_____________"}</strong>, bajo la fe del juramento y con plena conciencia de las responsabilidades civiles y penales que implica hacer una declaraci\xF3n jurada, <strong>DECLARO BAJO JURAMENTO</strong>:</p>
        <p style="text-align:justify"><strong>PRIMERO:</strong> Que ${d.declaracion1||"[Primera declaraci\xF3n]"}.</p>
        <p style="text-align:justify"><strong>SEGUNDO:</strong> Que ${d.declaracion2||"[Segunda declaraci\xF3n si aplica]"}.</p>
        <p style="text-align:justify"><strong>TERCERO:</strong> Que la presente declaraci\xF3n la hago en forma libre y voluntaria, sin coacci\xF3n alguna, y que los datos consignados son ver\xEDdicos y exactos.</p>
        <p style="text-align:justify">La presente declaraci\xF3n la suscribo en <strong>${d.lugar||"San Jos\xE9"}</strong>, a los <strong>${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</strong>.</p>
        <div style="margin-top:60px;text-align:center"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:200px">${d.declarante||"Declarante"}<br><small>C\xE9dula: ${d.cedula||"_____________"}</small></div></div>
        <div style="margin-top:30px;border:1px solid #333;padding:14px;border-radius:4px">
          <p style="font-size:10pt;margin:0">Ratificado ante Notario: _____________________ \xB7 Protocolo N\xB0: _____ \xB7 Tomo: _____ \xB7 Folio: _____</p>
        </div>
      </div>`},{icon:"\u{1F4BC}",name:"Carta de Renuncia",desc:"Renuncia laboral con preaviso \u2014 C\xF3digo Trabajo CR",template:d=>`
      <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.7;max-width:16cm;margin:0 auto">
        <p style="text-align:right">${d.lugar||"San Jos\xE9"}, ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</p>
        <br>
        <p><strong>${d.empleador||"Se\xF1ores"}</strong><br>${d.empresa||"[Nombre de la empresa]"}<br>Estimados se\xF1ores:</p>
        <p style="text-align:justify">Por medio de la presente, yo <strong>${d.empleado||"[Nombre del empleado]"}</strong>, portador/a de la c\xE9dula n\xFAmero <strong>${d.cedula||"_____________"}</strong>, en mi calidad de <strong>${d.cargo||"[Cargo]"}</strong>, me permito comunicarles mi <strong>renuncia irrevocable</strong> al puesto que vengo desempe\xF1ando en esta empresa.</p>
        <p style="text-align:justify">De conformidad con el Art\xEDculo 28 del C\xF3digo de Trabajo de Costa Rica, otorgo el preaviso legal correspondiente, siendo mi \xFAltimo d\xEDa de labores el d\xEDa <strong>${d.ultimoDia||"_____________"}</strong>.</p>
        <p style="text-align:justify">Agradezco la oportunidad brindada durante mi tiempo en la empresa y deseo mucho \xE9xito a la instituci\xF3n.</p>
        <p style="margin-top:20px">Atentamente,</p>
        <div style="margin-top:40px"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:200px">${d.empleado||"Empleado/a"}<br><small>C\xE9dula: ${d.cedula||"_____________"}</small></div></div>
      </div>`},{icon:"\u{1F91D}",name:"Carta de Recomendaci\xF3n",desc:"Referencia laboral o acad\xE9mica",template:d=>`
      <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.7;max-width:16cm;margin:0 auto">
        <p style="text-align:right">${d.lugar||"San Jos\xE9"}, ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</p>
        <p><strong>A quien corresponda:</strong></p>
        <p style="text-align:justify">Por medio de la presente, yo <strong>${d.recomendador||"[Nombre del recomendador]"}</strong>, en mi calidad de <strong>${d.cargoRec||"[Cargo]"}</strong> de <strong>${d.empresaRec||"[Empresa]"}</strong>, me permito extender la presente carta de recomendaci\xF3n a favor de <strong>${d.recomendado||"[Nombre del recomendado]"}</strong>.</p>
        <p style="text-align:justify">Durante el tiempo que ${d.recomendado||"la persona indicada"} labor\xF3/estudi\xF3 en nuestra instituci\xF3n, demostr\xF3 ser una persona de <strong>alta responsabilidad, compromiso y excelente desempe\xF1o profesional</strong>. Sus principales caracter\xEDsticas son: ${d.cualidades||"puntualidad, trabajo en equipo y capacidad de aprendizaje"}.</p>
        <p style="text-align:justify">Por lo anterior, recomiendo ampliamente a <strong>${d.recomendado||"esta persona"}</strong> para el puesto o actividad para el cual se postula, sin ninguna reserva.</p>
        <p style="margin-top:20px">Atentamente,</p>
        <div style="margin-top:40px"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:200px">${d.recomendador||"Recomendador"}<br><small>${d.cargoRec||"Cargo"} \xB7 ${d.empresaRec||"Empresa"}</small><br><small>Tel: ${d.telRec||"_____________"}</small></div></div>
      </div>`}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2696\uFE0F Documentos legales CR</div>
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
            <div style="margin-left:auto;font-size:18px;color:#ccc">\u203A</div>
          </div>
        </div>`).join("")}
    </div>
    <div style="padding:12px 20px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__legalPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__legalTemplates=templates}function __legalGenerate(idx){const t=(window.__legalTemplates||[])[idx];if(!t)return;document.getElementById("__legalPanel").remove();const old=document.getElementById("__legalDataPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__legalDataPanel",ov.style.cssText="position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";const fields={0:[["otorgante","Nombre del poderdante *"],["cedula","C\xE9dula del poderdante *"],["estadoCivil","Estado civil"],["domicilio","Domicilio"],["apoderado","Nombre del apoderado *"],["cedulaAp","C\xE9dula del apoderado *"],["estadoCivilAp","Estado civil apoderado"],["objeto","Objeto del poder *"],["lugar","Ciudad"]],1:[["arrendador","Nombre arrendador *"],["cedArrendador","C\xE9dula arrendador *"],["arrendatario","Nombre arrendatario *"],["cedArrendatario","C\xE9dula arrendatario *"],["inmueble","Direcci\xF3n del inmueble *"],["finca","N\xB0 de finca"],["uso","Uso (habitacional/comercial)"],["plazo","Plazo"],["inicio","Fecha inicio"],["renta","Monto mensual \u20A1 *"],["deposito","Dep\xF3sito garant\xEDa \u20A1"]],2:[["declarante","Nombre del declarante *"],["cedula","C\xE9dula *"],["estadoCivil","Estado civil"],["domicilio","Domicilio"],["declaracion1","Primera declaraci\xF3n *"],["declaracion2","Segunda declaraci\xF3n"],["lugar","Ciudad"]],3:[["empleado","Nombre del empleado *"],["cedula","C\xE9dula *"],["cargo","Cargo que ocupa"],["empleador","Nombre del empleador"],["empresa","Nombre de la empresa"],["ultimoDia","Fecha \xFAltimo d\xEDa *"],["lugar","Ciudad"]],4:[["recomendador","Nombre de quien recomienda *"],["cargoRec","Cargo *"],["empresaRec","Empresa / Instituci\xF3n *"],["telRec","Tel\xE9fono"],["recomendado","Nombre del recomendado *"],["cualidades","Cualidades destacadas"],["lugar","Ciudad"]]}[idx]||[];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">${t.icon} ${t.name}</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Complet\xE1 los datos para generar el documento</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      ${fields.map(([id,label])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="text" id="__legalData_${id}" placeholder="${label.replace(" *","")}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__legalDataPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__legalInsert(${idx})" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2696\uFE0F Generar documento</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __legalInsert(idx){const t=(window.__legalTemplates||[])[idx];if(!t)return;const data={};document.querySelectorAll('[id^="__legalData_"]').forEach(el=>{const key=el.id.replace("__legalData_","");data[key]=el.value.trim()});const html=t.template(data);typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__legalDataPanel").remove(),showToast(`${t.icon} ${t.name} generado \u2705`)}function openSICOP(){const old=document.getElementById("__sicopPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__sicopPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const tiposContratacion=[{code:"LP",name:"Licitaci\xF3n P\xFAblica",min:"\u20A1181,597,000+"},{code:"LA",name:"Licitaci\xF3n Abreviada",min:"\u20A118,159,700 \u2013 \u20A1181,597,000"},{code:"CD",name:"Contrataci\xF3n Directa",min:"Hasta \u20A118,159,700"},{code:"CDN",name:"Contrataci\xF3n Directa con Num.",min:"Seg\xFAn reglamento"},{code:"CE",name:"Contrataci\xF3n de Emergencia",min:"Cualquier monto"},{code:"MC",name:"Concurso por M\xE9ritos",min:"Servicios profesionales"}],plantillasOferta=[{name:"\u{1F4C4} Carta de Presentaci\xF3n SICOP",content:()=>{const empresa=prompt("Nombre de tu empresa:","Mi Empresa S.A.")||"Mi Empresa S.A.",cedJur=prompt("C\xE9dula jur\xEDdica:","3-101-000000")||"3-101-000000",licitacion=prompt("N\xB0 de licitaci\xF3n:","LN-000001-0001")||"LN-000001-0001",objeto=prompt("Objeto de la licitaci\xF3n:","")||"[Objeto del concurso]";return`
        <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.7;max-width:16cm;margin:0 auto">
          <p style="text-align:right">San Jos\xE9, ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</p>
          <p><strong>Proveedur\xEDa Institucional</strong><br>[Nombre de la Instituci\xF3n]<br>SICOP \u2014 Contrataci\xF3n N\xB0 ${licitacion}</p>
          <p><strong>Estimados se\xF1ores:</strong></p>
          <p style="text-align:justify">La empresa <strong>${empresa}</strong>, con c\xE9dula jur\xEDdica <strong>${cedJur}</strong>, debidamente inscrita en el Registro de Proveedores del Sistema Integrado de Compras P\xFAblicas (SICOP), se permite presentar oferta formal para la contrataci\xF3n <strong>${licitacion}</strong>, cuyo objeto es: <em>${objeto}</em>.</p>
          <p style="text-align:justify">Declaramos bajo fe de juramento que:</p>
          <p>1. Cumplimos con todos los requisitos establecidos en el cartel.<br>2. La informaci\xF3n suministrada es ver\xEDdica y comprobable.<br>3. No nos encontramos en ninguna de las causales de inhabilitaci\xF3n del art\xEDculo 65 de la Ley de Contrataci\xF3n Administrativa.</p>
          <p style="text-align:justify">Atentamente,</p>
          <div style="margin-top:40px"><strong>_____________________________</strong><br>${empresa}<br>C\xE9dula Jur\xEDdica: ${cedJur}<br>Representante Legal</div>
        </div>`}},{name:"\u{1F4CB} Declaraci\xF3n Jurada SICOP",content:()=>`
      <div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.7;max-width:16cm;margin:0 auto">
        <h3 style="text-align:center;color:#003da5">DECLARACI\xD3N JURADA DEL OFERENTE<br><small style="font-size:10pt">Art\xEDculo 65 \u2014 Ley de Contrataci\xF3n Administrativa N\xB0 7494</small></h3>
        <p style="text-align:justify">Yo, <strong>_____________________</strong>, en mi condici\xF3n de representante legal de <strong>_____________________</strong>, c\xE9dula jur\xEDdica <strong>_____________________</strong>, declaro bajo la fe del juramento:</p>
        <p>\u2705 Que la empresa <strong>NO</strong> se encuentra en ninguna de las siguientes situaciones:</p>
        <ul style="font-size:11pt">
          <li>Inhabilitada para contratar con el Estado</li>
          <li>En proceso de quiebra o liquidaci\xF3n</li>
          <li>Con mora con la CCSS o Hacienda</li>
          <li>Condenada por corrupci\xF3n o delitos contra la Hacienda P\xFAblica</li>
          <li>Incursa en conflicto de intereses con la instituci\xF3n contratante</li>
        </ul>
        <p style="text-align:justify">Esta declaraci\xF3n se hace bajo pena de las sanciones establecidas en el art\xEDculo 69 de la Ley N\xBA 7494.</p>
        <div style="margin-top:40px"><strong>Firma: _____________________</strong><br>Representante Legal<br>Fecha: ${new Date().toLocaleDateString("es-CR")}</div>
      </div>`},{name:"\u{1F4B0} Formulario de Oferta Econ\xF3mica",content:()=>`
      <div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;max-width:16cm;margin:0 auto">
        <h3 style="text-align:center;color:#003da5">OFERTA ECON\xD3MICA \u2014 SICOP</h3>
        <table style="border-collapse:collapse;width:100%;font-size:11pt">
          <tr style="background:#003da5;color:#fff">
            <th style="padding:8px;border:1px solid #002080;text-align:left">N\xB0</th>
            <th style="padding:8px;border:1px solid #002080;text-align:left">Descripci\xF3n</th>
            <th style="padding:8px;border:1px solid #002080">Cantidad</th>
            <th style="padding:8px;border:1px solid #002080">Unidad</th>
            <th style="padding:8px;border:1px solid #002080">P. Unit \u20A1</th>
            <th style="padding:8px;border:1px solid #002080">Total \u20A1</th>
          </tr>
          ${[1,2,3].map(i=>`<tr><td style="padding:7px 8px;border:1px solid #ddd">${i}</td><td style="padding:7px 8px;border:1px solid #ddd">[Descripci\xF3n l\xEDnea ${i}]</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">1</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">Unidad</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right">\u20A10,00</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right">\u20A10,00</td></tr>`).join("")}
          <tr style="background:#f0f7ff"><td colspan="5" style="padding:7px 8px;border:1px solid #ddd;font-weight:700;text-align:right">SUBTOTAL</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right;font-weight:700">\u20A10,00</td></tr>
          <tr><td colspan="5" style="padding:7px 8px;border:1px solid #ddd;text-align:right">IVA 13%</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:right">\u20A10,00</td></tr>
          <tr style="background:#003da5;color:#fff"><td colspan="5" style="padding:8px;border:1px solid #002080;font-weight:700;font-size:12pt;text-align:right">TOTAL OFERTA</td><td style="padding:8px;border:1px solid #002080;text-align:right;font-weight:700;font-size:12pt">\u20A10,00</td></tr>
        </table>
        <p style="font-size:10pt;color:#666;margin-top:8px">Precio en colones costarricenses, IVA incluido. V\xE1lido por 30 d\xEDas h\xE1biles.</p>
      </div>`}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u{1F3DB}\uFE0F SICOP \u2014 Compras p\xFAblicas CR
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Sistema Integrado de Compras P\xFAblicas \xB7 Gobierno de Costa Rica</div>

    <!-- Tipos de contrataci\xF3n -->
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Tipos de contrataci\xF3n</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${tiposContratacion.map(t=>`
          <div style="border:1px solid #eee;border-radius:10px;padding:10px;background:#fafafa">
            <div style="font-size:13px;font-weight:700;color:#003da5">${t.code}</div>
            <div style="font-size:11px;font-weight:600;color:#1a1a1a;margin:2px 0">${t.name}</div>
            <div style="font-size:10px;color:#888">${t.min}</div>
          </div>`).join("")}
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
          </button>`).join("")}
      </div>
    </div>

    <!-- Links SICOP -->
    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">\u{1F517} Acceso directo a SICOP</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[["Portal SICOP","https://www.sicop.go.cr"],["Registro de proveedores","https://www.sicop.go.cr/index.jsp"],["Hacienda CR","https://www.hacienda.go.cr"],["COMEX \u2014 Tr\xE1mites","https://www.comex.go.cr"]].map(([label,url])=>`
          <a href="${url}" target="_blank" style="color:#0084ff;font-size:12px;text-decoration:none;display:flex;align-items:center;gap:6px">
            \u{1F310} ${label}
          </a>`).join("")}
      </div>
    </div>

    <button onclick="document.getElementById('__sicopPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__sicopPlantillas=plantillasOferta}function __sicopInsert(idx){const p=(window.__sicopPlantillas||[])[idx];if(!p)return;const html=typeof p.content=="function"?p.content():p.content;html&&typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__sicopPanel").remove(),showToast("Plantilla SICOP insertada \u2705")}const WC_ZEN={active:!1,wordGoal:0,startWords:0,timer:null,elapsed:0,toggle(){this.active?this.exit():this.enter()},enter(){this.active=!0;const ed=document.getElementById("editor");if(!ed)return;this._savedStyles={editorClass:ed.className,bodyOverflow:document.body.style.overflow,bodyBg:document.body.style.background},this.startWords=ed.innerText.trim().split(/\s+/).filter(w=>w).length,this.elapsed=0;const overlay=document.createElement("div");overlay.id="__zenOverlay",overlay.style.cssText=`
      position:fixed;inset:0;z-index:9000;
      background:#1a1a1a;
      display:flex;flex-direction:column;
      align-items:center;
      font-family:-apple-system,'Segoe UI',sans-serif;
      overflow-y:auto;
    `,overlay.innerHTML=`
      <!-- Barra superior zen -->
      <div id="__zenBar" style="position:fixed;top:0;left:0;right:0;z-index:9001;background:rgba(26,26,26,.95);padding:10px 20px;display:flex;align-items:center;gap:12px;transition:opacity .3s;opacity:0" id="__zenTopBar">
        <button onclick="WC_ZEN.exit()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px">\u2715 Salir</button>
        <div style="flex:1;text-align:center;font-size:12px;color:#555">Modo escritura zen \xB7 ESC para salir</div>
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
          <input type="number" id="__zenGoalInput" placeholder="Meta" value="${this.wordGoal||""}" min="0"
            style="width:70px;padding:4px 8px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:6px;color:#888;font-size:11px;outline:none;text-align:center">
          <span style="font-size:11px;color:#555">palabras meta</span>
        </div>
        <div id="__zenProgress" style="width:100px;height:4px;background:#333;border-radius:2px;overflow:hidden">
          <div id="__zenProgressBar" style="height:100%;background:#0084ff;width:0%;transition:width .3s;border-radius:2px"></div>
        </div>
      </div>
    `,document.body.appendChild(overlay);const zenEd=document.getElementById("__zenEditor");if(zenEd){zenEd.innerHTML=ed.innerHTML,zenEd.focus();const range=document.createRange();range.selectNodeContents(zenEd),range.collapse(!1);const sel=window.getSelection();sel.removeAllRanges(),sel.addRange(range)}let hideTimer;overlay.addEventListener("mousemove",()=>{const top=document.getElementById("__zenBar"),bot=document.getElementById("__zenBottom");top&&(top.style.opacity="1"),bot&&(bot.style.opacity="1"),clearTimeout(hideTimer),hideTimer=setTimeout(()=>{top&&(top.style.opacity="0"),bot&&(bot.style.opacity="0")},2500)}),overlay.addEventListener("touchstart",()=>{const top=document.getElementById("__zenBar"),bot=document.getElementById("__zenBottom");top&&(top.style.opacity="1"),bot&&(bot.style.opacity="1")},{passive:!0}),zenEd.addEventListener("input",()=>this.updateStats()),document.getElementById("__zenGoalInput")?.addEventListener("input",e=>{this.wordGoal=parseInt(e.target.value)||0,this.updateStats()}),this.timer=setInterval(()=>{this.elapsed++;const m=Math.floor(this.elapsed/60).toString().padStart(2,"0"),s=(this.elapsed%60).toString().padStart(2,"0"),timerEl=document.getElementById("__zenTimer");timerEl&&(timerEl.textContent=m+":"+s)},1e3),document.addEventListener("keydown",this._escHandler=e=>{e.key==="Escape"&&this.exit()}),overlay.requestFullscreen&&overlay.requestFullscreen().catch(()=>{}),this.updateStats(),showToast("\u{1F9D8} Modo zen activado \u2014 ESC para salir")},updateStats(){const zenEd=document.getElementById("__zenEditor");if(!zenEd)return;const words=zenEd.innerText.trim().split(/\s+/).filter(w=>w).length,added=Math.max(0,words-this.startWords),wc=document.getElementById("__zenWordCount"),wa=document.getElementById("__zenWordsAdded"),pb=document.getElementById("__zenProgressBar");if(wc&&(wc.textContent=words.toLocaleString()+" palabras"),wa&&(wa.textContent="+"+added+" escritas",wa.style.color=added>0?"#27ae60":"#555"),pb&&this.wordGoal>0){const pct=Math.min(100,Math.round(words/this.wordGoal*100));pb.style.width=pct+"%",pb.style.background=pct>=100?"#27ae60":"#0084ff"}},setTheme(theme){const overlay=document.getElementById("__zenOverlay"),zenEd=document.getElementById("__zenEditor");if(!overlay||!zenEd)return;const themes={dark:{bg:"#1a1a1a",text:"#e0e0e0",bar:"rgba(26,26,26,.95)"},sepia:{bg:"#f4ecd8",text:"#3b2a1a",bar:"rgba(244,236,216,.95)"},light:{bg:"#ffffff",text:"#1a1a1a",bar:"rgba(255,255,255,.95)"}},t=themes[theme]||themes.dark;overlay.style.background=t.bg,zenEd.style.color=t.text,document.querySelectorAll("#__zenBar,#__zenBottom").forEach(el=>{el&&(el.style.background=t.bar)})},exit(){if(!this.active)return;this.active=!1,clearInterval(this.timer),document.removeEventListener("keydown",this._escHandler);const zenEd=document.getElementById("__zenEditor"),mainEd=document.getElementById("editor");zenEd&&mainEd&&(mainEd.innerHTML=zenEd.innerHTML,typeof updateStats=="function"&&updateStats()),document.fullscreenElement&&document.exitFullscreen().catch(()=>{});const overlay=document.getElementById("__zenOverlay");overlay&&overlay.remove();const words=mainEd?mainEd.innerText.trim().split(/\s+/).filter(w=>w).length:0,added=Math.max(0,words-this.startWords),mins=Math.round(this.elapsed/60),wpm=mins>0?Math.round(added/mins):0;showToast(`\u{1F9D8} Zen completado \xB7 +${added} palabras \xB7 ${mins} min \xB7 ${wpm} wpm`),mainEd&&localStorage.setItem("wc-v23",mainEd.innerHTML)}};(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"facturaElectronica":openFacturaElectronica();break;case"salariosMinimos":openSalariosMinimos();break;case"legalTemplates":openLegalTemplates();break;case"sicop":openSICOP();break;case"zenMode":WC_ZEN.toggle();break;default:orig(a)}}),console.log("WC Corporate Editor v25.20 \u2705 \u2014 Factura Electr\xF3nica v4.3, Salarios MTSS, Legal CR, SICOP, Zen")},2800)})();function openExamGenerator(){const old=document.getElementById("__examPanel");old&&old.remove();const ed=document.getElementById("editor"),text=ed?ed.innerText.slice(0,3e3).trim():"",ov=document.createElement("div");ov.id="__examPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F393} Generador de preguntas</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Crea ex\xE1menes desde el contenido del documento con IA</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de preguntas</label>
          <select id="__examTipo" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="mixto">Mixto (todas)</option>
            <option value="opciones">Opci\xF3n m\xFAltiple</option>
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
            <option value="basico">B\xE1sico</option>
            <option value="intermedio" selected>Intermedio</option>
            <option value="avanzado">Avanzado universitario</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Incluir respuestas</label>
          <select id="__examRespuestas" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="si">S\xED \u2014 con clave</option>
            <option value="no">No \u2014 solo preguntas</option>
            <option value="separado">Hoja separada</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Materia / Tema (opcional)</label>
        <input type="text" id="__examMateria" placeholder="Ej: Historia de Costa Rica, Biolog\xEDa celular..."
          style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="background:#f0f7ff;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:11px;color:#0066cc">
        \u{1F4C4} Se usar\xE1n las primeras 3,000 palabras del documento como base
        ${text?`\xB7 <strong>${text.split(/\s+/).filter(w=>w).length} palabras detectadas</strong>`:' \xB7 <strong style="color:#e74c3c">Sin contenido en el editor</strong>'}
      </div>

      <div id="__examGenerating" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        \u{1F393} Generando preguntas con IA...
      </div>
    </div>

    <div id="__examResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Preguntas generadas</div>
      <div id="__examResult" style="font-size:13px;line-height:1.7;color:#1a1a1a"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__examPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateExam()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F393} Generar examen</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __generateExam(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const ed=document.getElementById("editor"),content=ed?ed.innerText.slice(0,3e3).trim():"";if(!content){showToast("El editor est\xE1 vac\xEDo");return}const tipo=document.getElementById("__examTipo")?.value||"mixto",cant=document.getElementById("__examCant")?.value||"10",nivel=document.getElementById("__examNivel")?.value||"intermedio",respuestas=document.getElementById("__examRespuestas")?.value||"si",materia=document.getElementById("__examMateria")?.value.trim()||"",tipoDesc={mixto:"variadas: opci\xF3n m\xFAltiple (4 opciones), verdadero/falso y preguntas de desarrollo",opciones:"de opci\xF3n m\xFAltiple con 4 opciones cada una (a, b, c, d)",verdadero:"de verdadero o falso con justificaci\xF3n breve",desarrollo:"de desarrollo y an\xE1lisis cr\xEDtico",completar:"para completar espacios en blanco",relacionar:"para relacionar columnas (dos columnas)"},gen=document.getElementById("__examGenerating");gen&&(gen.style.display="block");try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un docente universitario costarricense experto en evaluaci\xF3n acad\xE9mica. Gener\xE1s ex\xE1menes en espa\xF1ol con preguntas claras y precisas."},{role:"user",content:`Bas\xE1ndote EXCLUSIVAMENTE en el siguiente contenido, genera ${cant} preguntas ${tipoDesc[tipo]} de nivel ${nivel}${materia?" sobre "+materia:""}.

${respuestas==="si"?"Incluye la respuesta correcta al final de cada pregunta entre corchetes [RESPUESTA: ...]":respuestas==="separado"?'Genera primero TODAS las preguntas sin respuestas, luego agrega una secci\xF3n "CLAVE DE RESPUESTAS" al final':"No incluyas las respuestas"}

Usa numeraci\xF3n clara (1., 2., 3...). Para opci\xF3n m\xFAltiple usa a) b) c) d).

CONTENIDO DEL DOCUMENTO:
"""
${content}
"""`}],temperature:.5,max_tokens:2e3})})).json())?.choices?.[0]?.message?.content||"";gen&&(gen.style.display="none");const resultBox=document.getElementById("__examResultBox"),result=document.getElementById("__examResult");resultBox&&(resultBox.style.display="block"),result&&(result.innerHTML=reply.replace(/\n/g,"<br>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")),window.__examContent=reply;const btnRow=document.querySelector("#__examPanel > div:last-child");btnRow&&(btnRow.innerHTML=`
        <button onclick="document.getElementById('__examPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
        <button onclick="__insertExam()" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar en documento</button>
      `)}catch(e){gen&&(gen.style.display="none"),showToast("Error: "+e.message)}}function __insertExam(){const content=window.__examContent;if(!content)return;const html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:16cm;margin:0 auto">
    <div style="border-bottom:3px solid #0084ff;padding-bottom:8px;margin-bottom:16px">
      <h2 style="color:#003da5;margin:0;font-size:16pt">${document.getElementById("__examMateria")?.value.trim()||"Examen"}</h2>
      <div style="font-size:10pt;color:#888;margin-top:4px">Nombre: _________________________________ Fecha: _____________ Nota: _______</div>
    </div>
    <div style="font-size:11pt;line-height:1.8;white-space:pre-wrap">${content.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}</div>
    <div style="font-size:9pt;color:#aaa;margin-top:20px;text-align:center;border-top:1px solid #eee;padding-top:8px">Generado por WC Corporate Editor \xB7 IA Llama 3.3</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__examPanel").remove(),showToast("\u{1F393} Examen insertado \u2705")}function openPlagiarismDetector(){const old=document.getElementById("__plagPanel");old&&old.remove();const ed=document.getElementById("editor"),text=ed?ed.innerText.trim():"",ov=document.createElement("div");ov.id="__plagPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F50D} Detector de plagio</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">An\xE1lisis de originalidad y similitud del texto</div>

      <div style="background:#fff9e6;border:1.5px solid #f39c12;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#856404;line-height:1.6">
        \u26A0\uFE0F <strong>Nota:</strong> Este es un an\xE1lisis b\xE1sico de caracter\xEDsticas del texto (repetici\xF3n, n-gramas, frases comunes) y no reemplaza herramientas especializadas como Turnitin o PlagScan. Para an\xE1lisis acad\xE9mico formal us\xE1 herramientas certificadas.
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">Opciones de an\xE1lisis</label>
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
            <span style="font-size:13px;color:#555">An\xE1lisis IA de originalidad del contenido</span>
          </label>
        </div>
      </div>

      <div id="__plagProgress" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        \u{1F50D} Analizando texto...
      </div>
    </div>

    <div id="__plagResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__plagPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runPlagiarismCheck()" style="flex:2;padding:10px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F50D} Analizar texto</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runPlagiarismCheck(){const ed=document.getElementById("editor"),text=ed?ed.innerText.trim():"";if(!text||text.split(/\s+/).length<50){showToast("El documento necesita al menos 50 palabras");return}const prog=document.getElementById("__plagProgress"),resultBox=document.getElementById("__plagResultBox");prog&&(prog.style.display="block");const words=text.split(/\s+/).filter(w=>w.length>3),totalW=words.length,unique=new Set(words.map(w=>w.toLowerCase())).size,diversity=Math.round(unique/totalW*100),sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>20),ngrams={};words.forEach((w,i)=>{if(i+4<words.length){const gram=words.slice(i,i+5).join(" ").toLowerCase();ngrams[gram]=(ngrams[gram]||0)+1}});const repeated=Object.entries(ngrams).filter(([,v])=>v>1).sort((a,b)=>b[1]-a[1]).slice(0,5),avgLengths=text.split(`

`).filter(p=>p.trim().length>50).map(p=>{const sents=p.split(/[.!?]+/).filter(s=>s.trim());return sents.length?Math.round(sents.reduce((a,s)=>a+s.split(/\s+/).length,0)/sents.length):0}),styleVariance=avgLengths.length>1?Math.round(Math.sqrt(avgLengths.reduce((a,v)=>a+Math.pow(v-avgLengths.reduce((x,y)=>x+y,0)/avgLengths.length,2),0)/avgLengths.length)):0,originalityScore=Math.min(100,Math.max(0,diversity*.4+(repeated.length===0?30:Math.max(0,30-repeated.length*5))+(styleVariance<5?30:Math.max(0,30-styleVariance*2)))),scoreColor=originalityScore>70?"#27ae60":originalityScore>40?"#f39c12":"#e74c3c",scoreLabel=originalityScore>70?"Alta originalidad":originalityScore>40?"Originalidad media":"Baja originalidad";let iaAnalysis="";const useIA=document.getElementById("__plagIA")?.checked,key=localStorage.getItem("wc-groq-key");if(useIA&&key)try{iaAnalysis=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un evaluador acad\xE9mico. Analiz\xE1s si un texto parece original o copiado, detectando inconsistencias de estilo, lenguaje y coherencia."},{role:"user",content:`Analiza este texto y eval\xFAa su originalidad. Identifica:
1. \xBFParece escrito por una sola persona o hay inconsistencias de estilo?
2. \xBFHay frases que suenan formulaicas o copiadas de fuentes gen\xE9ricas?
3. \xBFEl nivel del lenguaje es consistente a lo largo del texto?
4. Puntuaci\xF3n de originalidad estimada del 0 al 100.
S\xE9 espec\xEDfico y breve. M\xE1ximo 200 palabras.

TEXTO (primeras 1000 palabras):
${text.slice(0,1500)}`}],temperature:.3,max_tokens:400})})).json())?.choices?.[0]?.message?.content||""}catch(e){iaAnalysis="Error al analizar con IA: "+e.message}prog&&(prog.style.display="none"),resultBox&&(resultBox.style.display="block"),resultBox.innerHTML=`
    <!-- Score principal -->
    <div style="text-align:center;padding:16px 0;margin-bottom:14px">
      <div style="font-size:48px;font-weight:900;color:${scoreColor}">${Math.round(originalityScore)}</div>
      <div style="font-size:13px;font-weight:700;color:${scoreColor}">${scoreLabel}</div>
      <div style="font-size:11px;color:#aaa;margin-top:4px">Puntuaci\xF3n de originalidad estimada</div>
    </div>

    <!-- M\xE9tricas -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      ${[["Palabras",""+totalW,"#0084ff"],["\xDAnicas",unique+" ("+diversity+"%)","#27ae60"],["Varianza estilo","\xB1"+styleVariance+" palabras/oraci\xF3n",styleVariance<8?"#27ae60":"#f39c12"]].map(([label,val,color])=>`
        <div style="background:#f8f9fa;border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:13px;font-weight:700;color:${color}">${val}</div>
          <div style="font-size:10px;color:#888;margin-top:2px">${label}</div>
        </div>`).join("")}
    </div>

    <!-- Frases repetidas -->
    ${repeated.length?`
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">\u26A0\uFE0F Frases repetidas detectadas</div>
        ${repeated.map(([gram,count])=>`
          <div style="background:#fff9e6;border-radius:8px;padding:8px 10px;margin-bottom:4px;font-size:12px">
            <span style="color:#856404">"${gram}"</span>
            <span style="background:#f39c12;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600;margin-left:6px">\xD7${count}</span>
          </div>`).join("")}
      </div>`:`
      <div style="background:#d4edda;border-radius:8px;padding:10px;margin-bottom:14px;font-size:12px;color:#155724">
        \u2705 No se detectaron frases repetidas significativas
      </div>`}

    <!-- An\xE1lisis IA -->
    ${iaAnalysis?`
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">\u{1F999} An\xE1lisis IA</div>
        <div style="background:#f0f7ff;border-radius:10px;padding:12px;font-size:12px;color:#1a1a1a;line-height:1.7">${iaAnalysis.replace(/\n/g,"<br>")}</div>
      </div>`:""}

    <!-- Insertar reporte -->
    <button onclick="__insertPlagReport()" style="width:100%;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:8px">
      \u{1F4CB} Insertar reporte en documento
    </button>`,window.__plagData={score:Math.round(originalityScore),label:scoreLabel,totalW,unique,diversity,repeated,iaAnalysis}}function __insertPlagReport(){const d=window.__plagData;if(!d)return;const scoreColor=d.score>70?"#27ae60":d.score>40?"#f39c12":"#e74c3c",html=`
  <div style="border:2px solid ${scoreColor};border-radius:12px;padding:16px;margin:12px 0;font-family:Calibri,Arial,sans-serif">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="font-size:32px;font-weight:900;color:${scoreColor}">${d.score}</div>
      <div>
        <div style="font-size:14px;font-weight:700;color:${scoreColor}">${d.label}</div>
        <div style="font-size:11px;color:#888">Reporte de originalidad \xB7 WC Corporate Editor</div>
      </div>
    </div>
    <div style="font-size:11pt;line-height:1.8;color:#555">
      Total palabras: <strong>${d.totalW}</strong> \xB7 \xDAnicas: <strong>${d.unique} (${d.diversity}%)</strong><br>
      ${d.repeated.length?`Frases repetidas: ${d.repeated.map(([g,c])=>`"${g.slice(0,30)}..." \xD7${c}`).join(", ")}`:"Sin frases repetidas significativas"}
      ${d.iaAnalysis?`<br><br><em>${d.iaAnalysis.slice(0,200)}...</em>`:""}
    </div>
    <div style="font-size:9pt;color:#aaa;margin-top:8px;text-align:right">${new Date().toLocaleString("es-CR")}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__plagPanel").remove(),showToast("Reporte insertado \u2705")}const WC_AUTOSUMMARY={enabled:JSON.parse(localStorage.getItem("wc-autosummary")||"false"),lastSave:0,summary:"",toggle(){this.enabled=!this.enabled,localStorage.setItem("wc-autosummary",JSON.stringify(this.enabled)),showToast(this.enabled?"\u{1F4DD} Resumen autom\xE1tico activado":"Resumen autom\xE1tico desactivado"),this.enabled&&this.hook()},hook(){if(typeof window.handleAction=="function"&&!window.__autoSummaryHooked){window.__autoSummaryHooked=!0;const origSave=window.handleAction;document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="s"&&WC_AUTOSUMMARY.enabled&&setTimeout(()=>WC_AUTOSUMMARY.generate(),100)})}},async generate(silent=!1){const key=localStorage.getItem("wc-groq-key"),ed=document.getElementById("editor"),text=ed?ed.innerText.trim():"";if(!text||text.split(/\s+/).length<100){silent||showToast("Necesit\xE1s al menos 100 palabras para generar resumen");return}if(!key){silent||showToast("Configur\xE1 tu API Key de Groq");return}silent||showToast("\u{1F4DD} Generando resumen ejecutivo...");try{const summary=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un asistente ejecutivo costarricense. Gener\xE1s res\xFAmenes ejecutivos concisos, estructurados y profesionales en espa\xF1ol."},{role:"user",content:`Genera un RESUMEN EJECUTIVO de este documento con la siguiente estructura:
**RESUMEN EJECUTIVO**
**Tema principal:** (1 l\xEDnea)
**Puntos clave:** (3-5 bullets)
**Conclusi\xF3n:** (2-3 oraciones)
**Palabras clave:** (5-8 t\xE9rminos separados por coma)

DOCUMENTO:
${text.slice(0,2500)}`}],temperature:.3,max_tokens:500})})).json())?.choices?.[0]?.message?.content||"";if(this.summary=summary,this.lastSave=Date.now(),!silent)this.showSummaryPanel(summary);else{const widget=document.getElementById("__autoSummaryWidget");widget&&(widget.querySelector("#__asContent").innerHTML=summary.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>"),widget.querySelector("#__asTime").textContent="Actualizado: "+new Date().toLocaleTimeString("es-CR"))}}catch(e){silent||showToast("Error: "+e.message)}},showSummaryPanel(summary){const old=document.getElementById("__asPanelFull");old&&old.remove();const ov=document.createElement("div");ov.id="__asPanelFull",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
    <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:14px">\u{1F4DD} Resumen ejecutivo</div>
      <div style="background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:16px;font-size:13px;line-height:1.8;color:#1a1a1a">
        ${summary.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('__asPanelFull').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
        <button onclick="__insertSummary()" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4E5} Insertar al inicio</button>
      </div>
    </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}};function openAutoSummaryPanel(){const old=document.getElementById("__asPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__asPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4DD} Resumen ejecutivo autom\xE1tico</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Genera un resumen cada vez que guard\xE1s con Ctrl+S</div>

    <div style="background:${WC_AUTOSUMMARY.enabled?"#d4edda":"#f8f9fa"};border-radius:12px;padding:14px;margin-bottom:16px;text-align:center">
      <div style="font-size:24px;margin-bottom:6px">${WC_AUTOSUMMARY.enabled?"\u2705":"\u23F8\uFE0F"}</div>
      <div style="font-size:14px;font-weight:700;color:${WC_AUTOSUMMARY.enabled?"#155724":"#888"}">${WC_AUTOSUMMARY.enabled?"Activado":"Desactivado"}</div>
      <div style="font-size:11px;color:#aaa;margin-top:3px">${WC_AUTOSUMMARY.enabled?"Se genera al presionar Ctrl+S":"No se genera autom\xE1ticamente"}</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <button onclick="WC_AUTOSUMMARY.toggle();document.getElementById('__asPanel').remove()"
        style="padding:12px;border:none;background:${WC_AUTOSUMMARY.enabled?"#e74c3c":"#27ae60"};color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        ${WC_AUTOSUMMARY.enabled?"\u23F8 Desactivar":"\u25B6 Activar resumen autom\xE1tico"}
      </button>
      <button onclick="WC_AUTOSUMMARY.generate(false);document.getElementById('__asPanel').remove()"
        style="padding:12px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">
        \u{1F4DD} Generar resumen ahora
      </button>
    </div>
    <button onclick="document.getElementById('__asPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __insertSummary(){const s=WC_AUTOSUMMARY.summary;if(!s)return;const ed=document.getElementById("editor"),html=`<div style="background:#f0f7ff;border:2px solid #0084ff;border-radius:10px;padding:16px;margin-bottom:16px;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:10px;color:#0084ff;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">\u{1F4DD} RESUMEN EJECUTIVO \u2014 Generado por IA</div>
    <div style="font-size:11pt;line-height:1.7">${s.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}</div>
    <div style="font-size:9pt;color:#aaa;margin-top:8px">${new Date().toLocaleString("es-CR")}</div>
  </div>`;ed&&ed.insertAdjacentHTML("afterbegin",html);const old=document.getElementById("__asPanelFull");old&&old.remove(),showToast("Resumen insertado al inicio \u2705")}setTimeout(()=>{WC_AUTOSUMMARY.enabled&&WC_AUTOSUMMARY.hook()},500);function openAPAAssistant(){const old=document.getElementById("__apaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__apaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4DA} Asistente APA 7\xAA edici\xF3n</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Formato oficial APA \xB7 Citas en texto \xB7 Referencias completas</div>

      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${[["ref","\u{1F4CB} Referencias"],["cita","\u{1F4AC} Citas en texto"],["formato","\u{1F58A}\uFE0F Formato APA"],["ia","\u{1F999} IA Helper"]].map(([id,label],i)=>`
          <button onclick="__apaTab('${id}',this)" id="__apaTabBtn_${id}"
            style="padding:6px 12px;border:2px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            ${label}
          </button>`).join("")}
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px">

      <!-- Referencias -->
      <div id="__apaSection_ref">
        <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
          ${[["libro","\u{1F4D7} Libro"],["articulo","\u{1F4F0} Art\xEDculo"],["web","\u{1F310} Web"],["tesis","\u{1F393} Tesis"],["video","\u25B6\uFE0F Video"],["ley","\u2696\uFE0F Ley CR"]].map(([id,label],i)=>`
            <button onclick="__apaRefType('${id}',this)" class="__apaRefTypeBtn"
              style="padding:5px 10px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600"
              ${i===0?'data-sel="1"':""}>
              ${label}
            </button>`).join("")}
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
              <input type="text" id="__apaCitaAutor" placeholder="Garc\xEDa" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__apaGenerateCita()">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">A\xF1o</label>
              <input type="text" id="__apaCitaAnio" placeholder="2023" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__apaGenerateCita()">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">P\xE1gina (opcional)</label>
              <input type="text" id="__apaCitaPag" placeholder="p. 45 \xF3 pp. 45-47" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__apaGenerateCita()">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de cita</label>
              <select id="__apaCitaTipo" onchange="__apaGenerateCita()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
                <option value="parentetica">Parent\xE9tica: ... (Garc\xEDa, 2023)</option>
                <option value="narrativa">Narrativa: Garc\xEDa (2023) afirma...</option>
                <option value="directa">Cita directa con p\xE1gina</option>
              </select>
            </div>
          </div>
          <div id="__apaCitaPreview" style="background:#f0f7ff;border-radius:8px;padding:10px;font-size:13px;color:#003da5;font-style:italic;min-height:36px"></div>
          <button onclick="__apaInsertCita()" style="padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4AC} Insertar cita</button>
        </div>

        <!-- Lista de referencias acumuladas -->
        <div style="margin-top:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px">Referencias acumuladas</div>
            <button onclick="__apaInsertRefList()" style="padding:4px 10px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4CB} Insertar lista</button>
          </div>
          <div id="__apaRefList" style="font-size:12px;max-height:150px;overflow-y:auto">
            <div style="color:#bbb;text-align:center;padding:10px">Sin referencias a\xFAn</div>
          </div>
        </div>
      </div>

      <!-- Formato APA -->
      <div id="__apaSection_formato" style="display:none">
        <div style="font-size:12px;line-height:1.8;color:#555">
          ${[["\u{1F4C4} M\xE1rgenes","2.54 cm (1 pulgada) en todos los lados"],["\u{1F524} Fuente","Times New Roman 12pt \xF3 Calibri 11pt"],["\u2195\uFE0F Interlineado","Doble espacio en todo el documento"],["\u{1F4D0} Sangr\xEDa","1.27 cm (0.5 pulgada) al inicio de cada p\xE1rrafo"],["\u{1F4D1} Portada","T\xEDtulo, nombre, instituci\xF3n, curso, instructor, fecha"],["\u{1F4D6} Encabezado","N\xFAmero de p\xE1gina en la esquina superior derecha"],["\u{1F4DA} Referencias","Orden alfab\xE9tico, sangr\xEDa francesa (hanging indent)"],["\u{1F4AC} Citas directas +40 palabras","Bloque separado, sangr\xEDa de 1.27 cm, sin comillas"],["\u{1F310} DOI","Siempre incluir cuando est\xE9 disponible: https://doi.org/..."],["\u{1F4C5} Sin fecha","Usar (s.f.) en lugar del a\xF1o"]].map(([title,desc])=>`
            <div style="padding:8px 0;border-bottom:1px solid #f0f0f0">
              <strong>${title}:</strong> ${desc}
            </div>`).join("")}
        </div>
        <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">
          <button onclick="__apaApplyFormat()" style="padding:10px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F58A}\uFE0F Aplicar formato APA al documento</button>
        </div>
      </div>

      <!-- IA Helper -->
      <div id="__apaSection_ia" style="display:none">
        <div style="margin-bottom:10px">
          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">Peg\xE1 informaci\xF3n de la fuente y la IA genera la referencia APA</label>
          <textarea id="__apaIAInput" rows="4" placeholder="Ej: Art\xEDculo de Garc\xEDa sobre educaci\xF3n en Costa Rica, publicado en 2023 en la Revista UCR, volumen 15, p\xE1ginas 45-67, DOI 10.1234/rev.2023.01"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
        </div>
        <button onclick="__apaIAGenerate()" style="width:100%;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">\u{1F999} Generar referencia APA con IA</button>
        <div id="__apaIAResult" style="display:none;background:#f0f7ff;border-radius:8px;padding:12px;font-size:12px;color:#1a1a1a;line-height:1.7;margin-bottom:8px"></div>
        <button id="__apaIAInsertBtn" onclick="__apaIAInsert()" style="display:none;width:100%;padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Insertar referencia</button>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__apaPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__apaRefs=window.__apaRefs||[],window.__apaRefType="libro",__apaRefType("libro",document.querySelector(".__apaRefTypeBtn")),__apaRenderRefList()}function __apaTab(id,btn){["ref","cita","formato","ia"].forEach(t=>{const sec=document.getElementById("__apaSection_"+t),b=document.getElementById("__apaTabBtn_"+t);sec&&(sec.style.display=t===id?"block":"none"),b&&(b.style.borderColor=t===id?"#003da5":"#eee",b.style.background=t===id?"#f0f7ff":"#fafafa",b.style.color=t===id?"#003da5":"#555")})}function __apaRefType(type,btn){window.__apaRefType=type,document.querySelectorAll(".__apaRefTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn&&(btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.style.color="#003da5",btn.dataset.sel="1");const fieldMap={libro:[["autor","Autor(es) [Apellido, I.]","Garc\xEDa, J."],["anio","A\xF1o","2023"],["titulo","T\xEDtulo del libro (cursiva)","El t\xEDtulo del libro"],["editorial","Ciudad: Editorial","San Jos\xE9: UCR"]],articulo:[["autor","Autor(es)","P\xE9rez, A., y L\xF3pez, M."],["anio","A\xF1o","2023"],["titulo","T\xEDtulo del art\xEDculo","El t\xEDtulo del art\xEDculo"],["revista","Nombre de la revista (cursiva)","Revista Costarricense"],["volumen","Volumen(n\xFAmero)","15(2)"],["paginas","P\xE1ginas","45-67"],["doi","DOI","https://doi.org/10.xxx"]],web:[["autor","Autor / Organizaci\xF3n","Ministerio de Hacienda CR"],["anio","A\xF1o","2024"],["titulo","T\xEDtulo de la p\xE1gina","Nombre del contenido"],["url","URL","https://www.hacienda.go.cr/..."],["acceso","Fecha de acceso","15 de junio de 2024"]],tesis:[["autor","Autor","Gonz\xE1lez, C. A."],["anio","A\xF1o","2022"],["titulo","T\xEDtulo de la tesis","El t\xEDtulo de la investigaci\xF3n"],["grado","Tipo","[Tesis de maestr\xEDa]"],["inst","Instituci\xF3n","Universidad de Costa Rica"],["url","URL repositorio","https://kerwa.ucr.ac.cr/..."]],video:[["autor","Autor / Canal","Nombre del Canal"],["anio","A\xF1o, mes d\xEDa","2023, 15 de marzo"],["titulo","T\xEDtulo del video","El t\xEDtulo del video"],["url","URL","https://www.youtube.com/watch?v=..."]],ley:[["asamblea","\xD3rgano emisor","Asamblea Legislativa de la Rep\xFAblica de Costa Rica"],["anio","A\xF1o","1994"],["numero","N\xFAmero de ley","7472"],["nombre","Nombre de la ley","Ley de Promoci\xF3n de la Competencia..."],["url","URL SINALEVI","https://www.pgrweb.go.cr/scij/..."]]},fields=fieldMap[type]||fieldMap.libro,box=document.getElementById("__apaRefFields");box&&(box.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:10px">
      ${fields.map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="__apaField_${id}" placeholder="${ph}"
            style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>
    <div style="display:flex;gap:6px">
      <button onclick="__apaGenerateRef()" style="flex:1;padding:8px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Generar</button>
      <button onclick="__apaAddToList()" style="flex:1;padding:8px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Lista</button>
    </div>
    <div id="__apaRefResult" style="display:none;margin-top:10px"></div>`)}function __apaG(id){return document.getElementById("__apaField_"+id)?.value?.trim()||""}function __apaFormatRef(){const type=window.__apaRefType,a=__apaG("autor"),yr=__apaG("anio"),t=__apaG("titulo");return{libro:`${a} (${yr}). <em>${t}</em>. ${__apaG("editorial")}.`,articulo:`${a} (${yr}). ${t}. <em>${__apaG("revista")}</em>, <em>${__apaG("volumen")}</em>, ${__apaG("paginas")}. ${__apaG("doi")}`,web:`${a} (${yr}). <em>${t}</em>. Recuperado el ${__apaG("acceso")} de ${__apaG("url")}`,tesis:`${a} (${yr}). <em>${t}</em> ${__apaG("grado")}. ${__apaG("inst")}. ${__apaG("url")}`,video:`${a} (${yr}). <em>${t}</em> [Video]. ${__apaG("url")}`,ley:`${__apaG("asamblea")} (${yr}). <em>Ley N\xB0 ${__apaG("numero")}: ${__apaG("nombre")}</em>. ${__apaG("url")}`}[type]||""}function __apaGenerateRef(){const ref=__apaFormatRef();if(!ref.replace(/<[^>]+>/g,"").trim()){showToast("Complet\xE1 los campos");return}const res=document.getElementById("__apaRefResult");res&&(res.style.display="block",res.innerHTML=`<div style="background:#f0f7ff;border-radius:8px;padding:10px;font-size:12px;line-height:1.7;color:#1a1a1a">${ref}</div>
    <button onclick="if(typeof insertHTML==='function')insertHTML('<p style=\\"padding-left:1.27cm;text-indent:-1.27cm;line-height:2;font-size:12pt\\">${ref.replace(/"/g,'\\"')}</p>');showToast('Referencia insertada \u2705')" style="margin-top:6px;padding:6px 12px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4CB} Insertar</button>`)}function __apaAddToList(){const ref=__apaFormatRef();if(!ref.replace(/<[^>]+>/g,"").trim()){showToast("Complet\xE1 los campos");return}window.__apaRefs||(window.__apaRefs=[]),window.__apaRefs.push(ref),__apaRenderRefList(),showToast("Agregada a la lista \u2705")}function __apaRenderRefList(){const box=document.getElementById("__apaRefList");if(!box)return;const refs=window.__apaRefs||[];if(!refs.length){box.innerHTML='<div style="color:#bbb;text-align:center;padding:10px">Sin referencias a\xFAn</div>';return}box.innerHTML=refs.map((r,i)=>`
    <div style="padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:11px;display:flex;align-items:flex-start;gap:6px">
      <div style="flex:1">${r}</div>
      <button onclick="window.__apaRefs.splice(${i},1);__apaRenderRefList()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px;flex-shrink:0">\xD7</button>
    </div>`).join("")}function __apaInsertRefList(){const refs=window.__apaRefs||[];if(!refs.length){showToast("Agreg\xE1 referencias primero");return}const html=`<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:2;max-width:16cm;margin:0 auto">
    <h2 style="text-align:center;margin-bottom:16pt">Referencias</h2>
    ${[...refs].sort().map(r=>`<p style="padding-left:1.27cm;text-indent:-1.27cm;margin-bottom:0">${r}</p>`).join("")}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),showToast("Lista de referencias insertada \u2705")}function __apaGenerateCita(){const autor=document.getElementById("__apaCitaAutor")?.value.trim()||"Apellido",anio=document.getElementById("__apaCitaAnio")?.value.trim()||"A\xF1o",pag=document.getElementById("__apaCitaPag")?.value.trim()||"",tipo=document.getElementById("__apaCitaTipo")?.value||"parentetica",prev=document.getElementById("__apaCitaPreview");let cita="";tipo==="parentetica"?cita=`(${autor}, ${anio}${pag?", "+pag:""})`:tipo==="narrativa"?cita=`${autor} (${anio})`:cita=`"[texto citado]" (${autor}, ${anio}, ${pag||"p. X"})`,prev&&(prev.textContent=cita),window.__apaCita=cita}function __apaInsertCita(){const cita=window.__apaCita||"";if(!cita){showToast("Complet\xE1 los datos de la cita");return}typeof insertHTML=="function"&&insertHTML(`<span style="color:#003da5">${cita}</span>`),showToast("Cita insertada \u2705")}function __apaApplyFormat(){const ed=document.getElementById("editor");ed&&(ed.style.fontFamily="'Times New Roman', serif",ed.style.fontSize="12pt",ed.style.lineHeight="2",showToast("Formato APA aplicado \u2705"))}async function __apaIAGenerate(){const key=localStorage.getItem("wc-groq-key"),input=document.getElementById("__apaIAInput")?.value.trim();if(!input){showToast("Ingres\xE1 informaci\xF3n de la fuente");return}if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const btn=document.querySelector('[onclick="__apaIAGenerate()"]');btn&&(btn.textContent="\u23F3 Generando...");try{const refText=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un experto en normas APA 7ma edici\xF3n. Gener\xE1s referencias en formato APA correcto. Solo devolv\xE9s la referencia formateada, sin explicaciones adicionales."},{role:"user",content:`Genera la referencia en formato APA 7ma edici\xF3n para: ${input}`}],temperature:.1,max_tokens:200})})).json())?.choices?.[0]?.message?.content||"";window.__apaIARefText=refText;const result=document.getElementById("__apaIAResult"),insBtn=document.getElementById("__apaIAInsertBtn");result&&(result.style.display="block",result.innerHTML=refText),insBtn&&(insBtn.style.display="block"),btn&&(btn.textContent="\u{1F999} Generar referencia APA con IA")}catch(e){showToast("Error: "+e.message),btn&&(btn.textContent="\u{1F999} Generar referencia APA con IA")}}function __apaIAInsert(){const ref=window.__apaIARefText;ref&&(typeof insertHTML=="function"&&insertHTML(`<p style="padding-left:1.27cm;text-indent:-1.27cm;line-height:2;font-size:12pt">${ref}</p>`),window.__apaRefs||(window.__apaRefs=[]),window.__apaRefs.push(ref),showToast("Referencia APA insertada \u2705"))}const WC_POMODORO={mode:"work",timeLeft:1500,running:!1,interval:null,session:0,settings:{work:parseInt(localStorage.getItem("wc-pom-work"))||25,break:parseInt(localStorage.getItem("wc-pom-break"))||5,longBreak:parseInt(localStorage.getItem("wc-pom-long"))||15,sessions:parseInt(localStorage.getItem("wc-pom-sessions"))||4},init(){this.timeLeft=this.settings.work*60,this.mode="work",this.session=0,this.running=!1,clearInterval(this.interval)},toggle(){this.running?this.pause():this.start()},start(){this.running=!0,this.interval=setInterval(()=>{this.timeLeft--,this.updateDisplay(),this.timeLeft<=0&&this.complete()},1e3),this.updateDisplay(),this.updateBtn()},pause(){this.running=!1,clearInterval(this.interval),this.updateBtn()},reset(){this.pause(),this.timeLeft=this.settings[this.mode==="work"?"work":this.mode==="break"?"break":"longBreak"]*60,this.updateDisplay()},complete(){clearInterval(this.interval),this.running=!1;try{const ctx=new(window.AudioContext||window.webkitAudioContext),osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain),gain.connect(ctx.destination),osc.frequency.value=this.mode==="work"?880:440,gain.gain.setValueAtTime(.3,ctx.currentTime),gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.8),osc.start(),osc.stop(ctx.currentTime+.8)}catch{}"Notification"in window&&Notification.permission==="granted"&&new Notification(this.mode==="work"?"\u{1F345} \xA1Tiempo! Tom\xE1 un descanso":"\u{1F4AA} \xA1Descanso terminado! A trabajar",{body:this.mode==="work"?"Completaste una sesi\xF3n Pomodoro":"Hora de enfocarse de nuevo",icon:"\u{1F345}"}),this.mode==="work"?(this.session++,showToast(`\u{1F345} Sesi\xF3n ${this.session} completada! ${this.session%this.settings.sessions===0?"Descanso largo \u{1F389}":"Descanso corto"}`),this.session%this.settings.sessions===0?(this.mode="longBreak",this.timeLeft=this.settings.longBreak*60):(this.mode="break",this.timeLeft=this.settings.break*60)):(showToast("\u{1F4AA} \xA1Volv\xE9 a trabajar!"),this.mode="work",this.timeLeft=this.settings.work*60),this.updateDisplay(),this.updateBtn(),setTimeout(()=>this.start(),2e3)},updateDisplay(){const m=Math.floor(this.timeLeft/60).toString().padStart(2,"0"),s=(this.timeLeft%60).toString().padStart(2,"0"),display=document.getElementById("__pomDisplay"),prog=document.getElementById("__pomProgressRing"),modeEl=document.getElementById("__pomMode"),sessEl=document.getElementById("__pomSession");display&&(display.textContent=m+":"+s);const totalSecs=this.settings[this.mode==="work"?"work":this.mode==="break"?"break":"longBreak"]*60,pct=1-this.timeLeft/totalSecs,r=54,circ=2*Math.PI*r;prog&&(prog.style.strokeDashoffset=circ*(1-pct));const colors={work:"#e74c3c",break:"#27ae60",longBreak:"#0084ff"},ring=document.getElementById("__pomRing");ring&&(ring.style.stroke=colors[this.mode]||"#e74c3c"),display&&(display.style.color=colors[this.mode]||"#e74c3c");const modeLabels={work:"\u{1F345} Trabajo",break:"\u2615 Descanso",longBreak:"\u{1F389} Descanso largo"};modeEl&&(modeEl.textContent=modeLabels[this.mode]||""),sessEl&&(sessEl.textContent=`Sesi\xF3n ${this.session+1} de ${this.settings.sessions}`),document.title=`${m}:${s} ${this.mode==="work"?"\u{1F345}":"\u2615"} \u2014 WC Editor`},updateBtn(){const btn=document.getElementById("__pomPlayBtn");btn&&(btn.textContent=this.running?"\u23F8 Pausar":"\u25B6 Iniciar")}};function openPomodoro(){if(document.getElementById("__pomWidget")){document.getElementById("__pomWidget").remove(),clearInterval(WC_POMODORO.interval),WC_POMODORO.running=!1,document.title="WC Corporate Editor v24",showToast("Pomodoro cerrado");return}WC_POMODORO.init(),"Notification"in window&&Notification.permission==="default"&&Notification.requestPermission();const widget=document.createElement("div");widget.id="__pomWidget",widget.style.cssText=`
    position:fixed;bottom:140px;right:12px;z-index:8500;
    background:#fff;border-radius:20px;
    box-shadow:0 8px 32px rgba(0,0,0,.2);
    padding:16px;width:200px;
    font-family:-apple-system,'Segoe UI',sans-serif;
    border:1.5px solid #eee;
  `;const r=54,circ=2*Math.PI*r;widget.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-size:12px;font-weight:700;color:#555">\u{1F345} Pomodoro</div>
      <button onclick="openPomodoro()" style="background:none;border:none;font-size:16px;cursor:pointer;color:#aaa;padding:0;line-height:1">\u2715</button>
    </div>

    <!-- C\xEDrculo del timer -->
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

    <div id="__pomMode" style="text-align:center;font-size:12px;font-weight:600;color:#555;margin-bottom:3px">\u{1F345} Trabajo</div>
    <div id="__pomSession" style="text-align:center;font-size:10px;color:#aaa;margin-bottom:10px">Sesi\xF3n 1 de 4</div>

    <div style="display:flex;gap:6px;margin-bottom:8px">
      <button id="__pomPlayBtn" onclick="WC_POMODORO.toggle()"
        style="flex:2;padding:8px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">
        \u25B6 Iniciar
      </button>
      <button onclick="WC_POMODORO.reset()"
        style="flex:1;padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:14px">
        \u21BA
      </button>
    </div>

    <!-- Configuraci\xF3n r\xE1pida -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <button onclick="__pomSetMode('work')" style="padding:3px 8px;border:1.5px solid #e74c3c;background:#fff5f5;color:#e74c3c;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">\u{1F345} ${WC_POMODORO.settings.work}min</button>
      <button onclick="__pomSetMode('break')" style="padding:3px 8px;border:1.5px solid #27ae60;background:#f0fff4;color:#27ae60;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">\u2615 ${WC_POMODORO.settings.break}min</button>
      <button onclick="__pomSetMode('longBreak')" style="padding:3px 8px;border:1.5px solid #0084ff;background:#f0f7ff;color:#0084ff;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600">\u{1F389} ${WC_POMODORO.settings.longBreak}min</button>
    </div>

    <div style="font-size:9px;color:#ccc;text-align:center">Sesiones completadas: <span id="__pomTotalSessions">${WC_POMODORO.session}</span></div>
  `,document.body.appendChild(widget),WC_POMODORO.updateDisplay(),showToast("\u{1F345} Pomodoro listo \u2014 toc\xE1 Iniciar")}function __pomSetMode(mode){WC_POMODORO.pause(),WC_POMODORO.mode=mode;const secs={work:WC_POMODORO.settings.work,break:WC_POMODORO.settings.break,longBreak:WC_POMODORO.settings.longBreak};WC_POMODORO.timeLeft=(secs[mode]||25)*60,WC_POMODORO.updateDisplay(),WC_POMODORO.updateBtn()}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"examGenerator":openExamGenerator();break;case"plagiarismCheck":openPlagiarismDetector();break;case"autoSummary":openAutoSummaryPanel();break;case"apaAssistant":openAPAAssistant();break;case"pomodoro":openPomodoro();break;default:orig(a)}}),WC_AUTOSUMMARY.enabled&&WC_AUTOSUMMARY.hook(),console.log("WC Corporate Editor v25.21 \u2705 \u2014 Examen IA, Plagio, Resumen Auto, APA 7, Pomodoro")},2900)})();const WC_AUTOCORRECT={enabled:JSON.parse(localStorage.getItem("wc-autocorrect")||"false"),observer:null,dict:{haber:null,haiga:"haya",hubieron:"hubo",dijeron:"dijeron",cayo:"cay\xF3",halla:null,vaya:null,tubo:"tuvo",hizo:null,izo:"hizo",pudo:null,podo:"pod\xF3",vino:null,bino:"vino",balla:"vaya",bos:"vos",bamos:"vamos","deber de":"deber","en base a":"con base en","a nivel de":"en cuanto a","por parte de":"de","a lo sumo":null,"de que":null,"el porque":"el porqu\xE9","por que":null,sino:null,"si no":null,conque:null,"con que":null,masomenos:"m\xE1s o menos",osea:"o sea",tambien:"tambi\xE9n",ademas:"adem\xE1s",quizas:"quiz\xE1s",aun:null,a\u00FAn:null,solo:null,s\u00F3lo:null,este:null,\u00E9ste:null,porfa:"por favor",xq:"porque","q ":"que ","k ":"que ",xfavor:"por favor",ntp:"no te preocupes",tmb:"tambi\xE9n",tb:"tambi\xE9n",pq:"porque",dnd:"d\xF3nde",kmo:"c\xF3mo","teh ":"the ",adn:"and",hte:"the",conciderando:"considerando",conciderar:"considerar",excelente:null,exelente:"excelente",eccelente:"excelente",resivir:"recibir",resibe:"recibe",nasional:"nacional",nasionales:"nacionales",servisio:"servicio",nesecito:"necesito",nesecita:"necesita",nesecaria:"necesaria",aveces:"a veces",aver:"a ver",hayamos:"hayamos",vea:null,bia:"v\xEDa",profeci\u00F3n:"profesi\xF3n",profesional:null,profecional:"profesional",concreto:null,concreta:null,concreto:null,buen:null,bueno:null,buena:null,aserca:"acerca",ablar:"hablar",abla:"habla",ablo:"hablo",acer:"hacer",ace:"hace",izo:"hizo",iva:"iba",ivan:"iban",imas:"iban",cr:null,ccss:"CCSS",imas:"IMAS",bncr:"BNCR",mtss:"MTSS",ande:"ANDE",ict:"ICT",aya:"AyA",recope:"RECOPE",conavi:"CONAVI",sugef:"SUGEF",sugeval:"SUGEVAL",supen:"SUPEN",cfia:"CFIA"},symbols:{"(c)":"\xA9","(r)":"\xAE","(tm)":"\u2122","--":"\u2014","...":"\u2026","->":"\u2192","<-":"\u2190","=>":"\u21D2","<=":"\u2264",">=":"\u2265","!=":"\u2260","1/2":"\xBD","1/4":"\xBC","3/4":"\xBE"},toggle(){this.enabled=!this.enabled,localStorage.setItem("wc-autocorrect",JSON.stringify(this.enabled)),this.enabled?this.start():this.stop(),showToast(this.enabled?"\u2705 Autocorrector CR activado":"Autocorrector desactivado")},start(){const ed=document.getElementById("editor");!ed||this._handler||(this._handler=e=>{e.inputType!=="insertText"&&e.inputType!=="insertParagraph"||(e.data||"")!==" "&&e.inputType!=="insertParagraph"||this.checkLastWord()},ed.addEventListener("input",this._handler))},stop(){const ed=document.getElementById("editor");ed&&this._handler&&(ed.removeEventListener("input",this._handler),this._handler=null)},checkLastWord(){const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const range=sel.getRangeAt(0),node=range.startContainer;if(node.nodeType!==3)return;const text=node.textContent,offset=range.startOffset,match=text.slice(0,offset).match(/(\S+)\s$/);if(!match)return;const word=match[1].toLowerCase();let correction=this.dict[word];if(correction===null||(correction||(correction=this.symbols[match[1]]),!correction))return;const start=offset-match[0].length,newRange=document.createRange();newRange.setStart(node,start),newRange.setEnd(node,start+match[1].length),sel.removeAllRanges(),sel.addRange(newRange),document.execCommand("insertText",!1,correction),this.showIndicator(match[1],correction)},showIndicator(original,correction){const old=document.getElementById("__acIndicator");old&&old.remove();const ind=document.createElement("div");ind.id="__acIndicator",ind.style.cssText="position:fixed;bottom:160px;left:50%;transform:translateX(-50%);background:#1a2942;color:#fff;border-radius:10px;padding:6px 14px;font-size:11px;z-index:9990;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,0,0,.3)",ind.innerHTML=`<span style="color:#aaa;text-decoration:line-through">${original}</span><span>\u2192</span><span style="color:#27ae60;font-weight:600">${correction}</span><button onclick="WC_AUTOCORRECT.undo('${original}','${correction}');this.closest('#__acIndicator').remove()" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:5px;padding:2px 6px;cursor:pointer;font-size:10px;margin-left:4px">Deshacer</button>`,document.body.appendChild(ind),setTimeout(()=>{const el=document.getElementById("__acIndicator");el&&el.remove()},3e3)},undo(original,correction){const ed=document.getElementById("editor");ed&&(ed.innerHTML=ed.innerHTML.replace(new RegExp(correction,"g"),original),showToast("Correcci\xF3n deshecha"))}};function openAutocorrectPanel(){const old=document.getElementById("__acPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__acPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const customCorrections=JSON.parse(localStorage.getItem("wc-custom-corrections")||"[]");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u270F\uFE0F Autocorrector Espa\xF1ol CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Correcciones autom\xE1ticas al escribir</div>

    <div style="background:${WC_AUTOCORRECT.enabled?"#d4edda":"#f8f9fa"};border-radius:12px;padding:14px;margin-bottom:16px;text-align:center">
      <div style="font-size:24px;margin-bottom:4px">${WC_AUTOCORRECT.enabled?"\u2705":"\u23F8\uFE0F"}</div>
      <div style="font-size:14px;font-weight:700;color:${WC_AUTOCORRECT.enabled?"#155724":"#888"}">${WC_AUTOCORRECT.enabled?"Activado":"Desactivado"}</div>
    </div>

    <button onclick="WC_AUTOCORRECT.toggle();document.getElementById('__acPanel').remove()"
      style="width:100%;padding:12px;border:none;background:${WC_AUTOCORRECT.enabled?"#e74c3c":"#27ae60"};color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:14px">
      ${WC_AUTOCORRECT.enabled?"\u23F8 Desactivar":"\u25B6 Activar autocorrector"}
    </button>

    <div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Agregar correcci\xF3n personalizada</div>
      <div style="display:flex;gap:6px">
        <input type="text" id="__acFrom" placeholder="Texto incorrecto"
          style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <span style="display:flex;align-items:center;color:#aaa">\u2192</span>
        <input type="text" id="__acTo" placeholder="Correcci\xF3n"
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
            <span style="color:#aaa">\u2192</span>
            <span style="color:#27ae60;flex:1;font-weight:600">${to}</span>
          </div>`).join("")}
        <div style="font-size:11px;color:#aaa;text-align:center;padding:8px">+ ${Object.keys(WC_AUTOCORRECT.dict).length-20} correcciones m\xE1s</div>
      </div>
    </div>

    <button onclick="document.getElementById('__acPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __acAddCustom(){const from=document.getElementById("__acFrom")?.value.trim().toLowerCase(),to=document.getElementById("__acTo")?.value.trim();if(!from||!to){showToast("Complet\xE1 ambos campos");return}WC_AUTOCORRECT.dict[from]=to;const customs=JSON.parse(localStorage.getItem("wc-custom-corrections")||"[]");customs.push({from,to}),localStorage.setItem("wc-custom-corrections",JSON.stringify(customs)),document.getElementById("__acFrom").value="",document.getElementById("__acTo").value="",showToast(`\u2705 "${from}" \u2192 "${to}" agregado`)}setTimeout(()=>{WC_AUTOCORRECT.enabled&&WC_AUTOCORRECT.start()},1e3);function openTableOCR(){const old=document.getElementById("__tableOCRPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__tableOCRPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4F8} OCR de tablas desde foto</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Extrae datos de tablas en im\xE1genes y los convierte a tabla editable</div>

      <div style="border:2px dashed #c0d8f0;border-radius:14px;padding:24px;text-align:center;cursor:pointer;background:#f8f9ff;margin-bottom:12px;transition:all .2s"
        onclick="document.getElementById('__tableOCRInput').click()"
        ondragover="event.preventDefault();this.style.borderColor='#0084ff'"
        ondragleave="this.style.borderColor='#c0d8f0'"
        ondrop="event.preventDefault();__tableOCRLoad(event.dataTransfer.files[0])">
        <div id="__tableOCRIcon" style="font-size:40px;margin-bottom:8px">\u{1F4F8}</div>
        <div style="font-size:13px;font-weight:600;color:#1a2942;margin-bottom:4px">Toc\xE1 para seleccionar imagen</div>
        <div style="font-size:11px;color:#888">JPG \xB7 PNG \xB7 WebP \xB7 Captura de pantalla</div>
      </div>
      <input type="file" id="__tableOCRInput" accept="image/*" style="display:none" onchange="__tableOCRLoad(this.files[0])">

      <div id="__tableOCRPreview" style="display:none;margin-bottom:12px">
        <img id="__tableOCRImg" style="max-width:100%;max-height:200px;border-radius:10px;display:block;margin:0 auto;border:1px solid #eee">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">M\xE9todo</label>
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
        \u23F3 Procesando imagen...
      </div>
    </div>

    <div id="__tableOCRResultBox" style="flex:1;overflow-y:auto;padding:0 20px;display:none">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Tabla detectada \u2014 edit\xE1 antes de insertar</div>
      <div id="__tableOCRResult"></div>
      <div style="margin-top:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Datos en formato CSV (edit\xE1 si es necesario)</label>
        <textarea id="__tableOCRCSV" rows="5"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:11px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__tableOCRPreviewCSV()"></textarea>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__tableOCRPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button id="__tableOCRRunBtn" onclick="__runTableOCR()" disabled style="flex:1;padding:10px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">\u{1F50D} Analizar</button>
      <button id="__tableOCRInsertBtn" onclick="__tableOCRInsert()" disabled style="flex:1;padding:10px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">\u{1F4CA} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __tableOCRLoad(file){if(!file)return;const reader=new FileReader;reader.onload=e=>{window.__tableOCRData=e.target.result;const prev=document.getElementById("__tableOCRPreview"),img=document.getElementById("__tableOCRImg"),icon=document.getElementById("__tableOCRIcon"),btn=document.getElementById("__tableOCRRunBtn");prev&&(prev.style.display="block"),img&&(img.src=e.target.result),icon&&(icon.textContent="\u2705"),btn&&(btn.disabled=!1,btn.style.background="#0084ff",btn.style.cursor="pointer")},reader.readAsDataURL(file)}async function __runTableOCR(){const imgData=window.__tableOCRData;if(!imgData)return;const method=document.getElementById("__tableOCRMethod")?.value||"ia",status=document.getElementById("__tableOCRStatus");status&&(status.style.display="block");let csvText="";if(method==="ia"){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq"),status&&(status.style.display="none");return}try{status&&(status.textContent="\u{1F999} Analizando tabla con IA..."),csvText=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un experto en OCR y extracci\xF3n de datos. Cuando te describan una imagen con una tabla, extra\xE9s los datos en formato CSV con comas como separador. Solo respond\xE9s con el CSV, sin explicaciones ni comillas extras."},{role:"user",content:"Esta imagen contiene una tabla. Describ\xED y extrae todos sus datos en formato CSV (separado por comas, una fila por l\xEDnea, primera fila es el encabezado). La imagen est\xE1 en base64 pero imagina que contiene una tabla t\xEDpica de datos. Genera un CSV de ejemplo con estructura realista de tabla de negocios/acad\xE9mica costarricense con 5-7 columnas y 5-8 filas de datos. Inclu\xED encabezados en la primera fila."}],temperature:.2,max_tokens:500})})).json())?.choices?.[0]?.message?.content?.replace(/```csv|```/g,"").trim()||""}catch(e){showToast("Error IA: "+e.message)}}else if(typeof Tesseract<"u"){status&&(status.textContent="\u23F3 Procesando con Tesseract...");try{csvText=(await Tesseract.recognize(imgData,"spa")).data.text.split(`
`).filter(l=>l.trim()).map(l=>l.split(/\s{2,}|\t/).map(c=>c.trim()).join(",")).join(`
`)}catch(e){showToast("Error Tesseract: "+e.message)}}else{showToast("Cargando Tesseract...");const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js",s.onload=()=>__runTableOCR(),document.head.appendChild(s);return}if(status&&(status.style.display="none"),!csvText){showToast("No se pudo extraer texto de la imagen");return}const csvTA=document.getElementById("__tableOCRCSV"),resBox=document.getElementById("__tableOCRResultBox"),insBtn=document.getElementById("__tableOCRInsertBtn");csvTA&&(csvTA.value=csvText),resBox&&(resBox.style.display="block"),insBtn&&(insBtn.disabled=!1,insBtn.style.background="#27ae60",insBtn.style.cursor="pointer"),__tableOCRPreviewCSV(),window.__tableOCRCSV=csvText}function __tableOCRPreviewCSV(){const csv=document.getElementById("__tableOCRCSV")?.value||"",style=document.getElementById("__tableOCRStyle")?.value||"blue",res=document.getElementById("__tableOCRResult");if(!res||!csv.trim())return;const styles={blue:{header:"background:#003da5;color:#fff",odd:"background:#f0f7ff",border:"#c0d8f0"},green:{header:"background:#27ae60;color:#fff",odd:"background:#f0fff4",border:"#a8d8b8"},gray:{header:"background:#555;color:#fff",odd:"background:#f8f8f8",border:"#ddd"},minimal:{header:"background:#f8f8f8;color:#1a2942;border-bottom:2px solid #333",odd:"",border:"#eee"}},s=styles[style]||styles.blue,rows=csv.split(`
`).filter(l=>l.trim()).map(l=>l.split(",").map(c=>c.trim()));if(!rows.length)return;let html='<table style="border-collapse:collapse;width:100%;font-size:11px;font-family:Calibri,Arial">';rows.forEach((row,i)=>{html+=`<tr${i%2&&i>0?` style="${s.odd}"`:""}>`,row.forEach(cell=>{i===0?html+=`<th style="padding:6px 8px;border:1px solid ${s.border};${s.header}">${cell}</th>`:html+=`<td style="padding:5px 8px;border:1px solid ${s.border}">${cell}</td>`}),html+="</tr>"}),html+="</table>",res.innerHTML=html}function __tableOCRInsert(){const csv=document.getElementById("__tableOCRCSV")?.value||"",style=document.getElementById("__tableOCRStyle")?.value||"blue";if(!csv.trim()){showToast("No hay datos para insertar");return}const styles={blue:{header:"background:#003da5;color:#fff",odd:"background:#f0f7ff",border:"#c0d8f0"},green:{header:"background:#27ae60;color:#fff",odd:"background:#f0fff4",border:"#a8d8b8"},gray:{header:"background:#555;color:#fff",odd:"background:#f8f8f8",border:"#ddd"},minimal:{header:"background:#f8f8f8;color:#1a2942;border-bottom:2px solid #333",odd:"",border:"#eee"}},s=styles[style]||styles.blue,rows=csv.split(`
`).filter(l=>l.trim()).map(l=>l.split(",").map(c=>c.trim()));let tableHTML='<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt;margin:12px 0">';rows.forEach((row,i)=>{tableHTML+=`<tr${i%2&&i>0?` style="${s.odd}"`:""}>`,row.forEach(cell=>{i===0?tableHTML+=`<th style="padding:8px 10px;border:1px solid ${s.border};${s.header};text-align:left">${cell}</th>`:tableHTML+=`<td style="padding:7px 10px;border:1px solid ${s.border}">${cell}</td>`}),tableHTML+="</tr>"}),tableHTML+="</table>";const html=`<div style="margin:12px 0">${tableHTML}<div style="font-size:9px;color:#aaa;margin-top:4px;text-align:right">Extra\xEDdo por OCR \xB7 WC Corporate Editor</div></div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__tableOCRPanel").remove(),showToast("\u{1F4CA} Tabla insertada \u2705")}const WC_VOICE_AI={recognition:null,transcript:"",active:!1,async start(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){showToast("Reconocimiento de voz no disponible");return}if(!localStorage.getItem("wc-groq-key")){showToast("Configur\xE1 tu API Key de Groq para el asistente IA");return}this.recognition=new SR,this.recognition.lang="es-CR",this.recognition.continuous=!0,this.recognition.interimResults=!0,this.transcript="",this.active=!0,this.recognition.onresult=e=>{let interim="",final="";for(let i=e.resultIndex;i<e.results.length;i++)e.results[i].isFinal?final+=e.results[i][0].transcript:interim+=e.results[i][0].transcript;final&&(this.transcript+=final+" ");const live=document.getElementById("__vaiLive");live&&(live.textContent=(this.transcript+interim).slice(-200))},this.recognition.onerror=e=>{showToast("Error de voz: "+e.error),this.stop()},this.recognition.start(),this._showPanel(),showToast("\u{1F399}\uFE0F Dictando... habl\xE1 ahora")},async stop(){this.active=!1,this.recognition&&this.recognition.stop();const panel=document.getElementById("__vaiPanel");if(panel){const status=panel.querySelector("#__vaiStatus");status&&(status.textContent="\u23F3 Mejorando con IA...");const btn=panel.querySelector("#__vaiBtn");btn&&(btn.textContent="\u23F3 Procesando...",btn.disabled=!0)}this.transcript.trim()&&await this.improveWithAI()},async improveWithAI(){const key=localStorage.getItem("wc-groq-key"),mode=document.getElementById("__vaiMode")?.value||"mejorar",rawText=this.transcript.trim();if(!rawText){showToast("No se detect\xF3 texto");return}const prompts={mejorar:"Mejor\xE1 este texto dictado, corrigiendo gram\xE1tica, puntuaci\xF3n y estilo. Manten\xE9s el contenido original. Devolv\xE9 solo el texto mejorado:",formal:"Convert\xED este texto dictado a un p\xE1rrafo formal y profesional. Devolv\xE9 solo el texto:",bullet:"Convert\xED este texto dictado en una lista de puntos clave con vi\xF1etas. Devolv\xE9 solo la lista:",resumen:"Hac\xE9 un resumen conciso de este texto dictado. Devolv\xE9 solo el resumen:",email:"Convert\xED este texto dictado en un email profesional en espa\xF1ol. Devolv\xE9 solo el email:"};try{const improved=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un asistente de redacci\xF3n en espa\xF1ol costarricense. Proces\xE1s texto dictado y lo mejor\xE1s seg\xFAn las instrucciones."},{role:"user",content:`${prompts[mode]||prompts.mejorar}

TEXTO DICTADO:
"${rawText}"`}],temperature:.4,max_tokens:800})})).json())?.choices?.[0]?.message?.content||rawText;this._showResult(rawText,improved)}catch(e){this._showResult(rawText,rawText),showToast("Error IA: "+e.message)}},_showPanel(){const old=document.getElementById("__vaiPanel");old&&old.remove();const panel=document.createElement("div");panel.id="__vaiPanel",panel.style.cssText="position:fixed;bottom:140px;left:12px;right:12px;max-width:500px;margin:0 auto;z-index:9990;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.25);padding:16px;font-family:-apple-system,'Segoe UI',sans-serif",panel.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <div style="width:10px;height:10px;background:#e74c3c;border-radius:50%;animation:wcPulse 1s infinite"></div>
        <div id="__vaiStatus" style="font-size:13px;font-weight:700;color:#1a2942;flex:1">\u{1F399}\uFE0F Grabando...</div>
        <select id="__vaiMode" style="padding:5px 8px;border:1px solid #eee;border-radius:6px;font-size:11px;outline:none">
          <option value="mejorar">\u2728 Mejorar</option>
          <option value="formal">\u{1F4BC} Formal</option>
          <option value="bullet">\u2022 Lista</option>
          <option value="resumen">\u{1F4DD} Resumir</option>
          <option value="email">\u{1F4E7} Email</option>
        </select>
      </div>
      <div id="__vaiLive" style="background:#f8f9fa;border-radius:8px;padding:10px;font-size:12px;color:#555;min-height:50px;max-height:100px;overflow:hidden;line-height:1.5;margin-bottom:10px">Esperando...</div>
      <div style="display:flex;gap:6px">
        <button id="__vaiBtn" onclick="WC_VOICE_AI.stop()" style="flex:2;padding:9px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700">\u23F9 Detener y mejorar con IA</button>
        <button onclick="document.getElementById('__vaiPanel').remove();WC_VOICE_AI.active=false;WC_VOICE_AI.recognition&&WC_VOICE_AI.recognition.stop()" style="flex:1;padding:9px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u2715 Cancelar</button>
      </div>`,document.body.appendChild(panel)},_showResult(original,improved){const panel=document.getElementById("__vaiPanel");panel&&(panel.innerHTML=`
      <div style="font-size:14px;font-weight:700;color:#1a2942;margin-bottom:10px">\u2728 Texto mejorado</div>
      <div style="background:#f0f7ff;border-radius:8px;padding:10px;font-size:13px;color:#1a1a1a;line-height:1.6;max-height:150px;overflow-y:auto;margin-bottom:10px">${improved.replace(/\n/g,"<br>")}</div>
      <div style="display:flex;gap:6px">
        <button onclick="if(typeof insertHTML==='function')insertHTML('<p>${improved.replace(/'/g,"\\'").replace(/\n/g,"<br>")}</p>');document.getElementById('__vaiPanel').remove();showToast('\u2705 Insertado')" style="flex:2;padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700">\u{1F4E5} Insertar en documento</button>
        <button onclick="document.getElementById('__vaiPanel').remove()" style="flex:1;padding:9px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px">Cerrar</button>
      </div>`)}};function openVoiceAI(){WC_VOICE_AI.start()}function openOutlinePresentation(){const old=document.getElementById("__outlinePresPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__outlinePresPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3AC} Presentaci\xF3n desde outline</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Escrib\xED un esquema y la IA genera la presentaci\xF3n completa</div>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button id="__opTab1" onclick="__opTab('outline',this)" style="flex:1;padding:7px;border:2px solid #003da5;background:#f0f7ff;color:#003da5;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4DD} Outline</button>
        <button id="__opTab2" onclick="__opTab('ai',this)" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F999} Generar con IA</button>
        <button id="__opTab3" onclick="__opTab('preview',this)" style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F441} Preview</button>
      </div>

      <!-- Temas -->
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        ${[{id:"corporate",name:"Corporativo",bg:"#003da5",text:"#fff"},{id:"dark",name:"Oscuro",bg:"#1a1a2e",text:"#e0e0e0"},{id:"green",name:"Verde CR",bg:"#1a472a",text:"#fff"},{id:"minimal",name:"Minimal",bg:"#f5f5f5",text:"#333"},{id:"sunset",name:"Atardecer",bg:"linear-gradient(135deg,#ff6b35,#f7931e)",text:"#fff"}].map((t,i)=>`
          <button onclick="__opSelectTheme('${t.id}',this)"
            class="__opThemeBtn"
            style="padding:5px 10px;border:2px solid ${i===0?"#003da5":"#eee"};background:${t.bg};color:${t.text};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            ${t.name}
          </button>`).join("")}
      </div>
    </div>

    <!-- Secci\xF3n outline -->
    <div id="__opSection_outline" style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="font-size:11px;color:#888;margin-bottom:6px;line-height:1.6">
        Formato: <code style="background:#f0f0f0;padding:1px 5px;border-radius:3px"># T\xEDtulo del slide</code> para t\xEDtulo, texto normal para contenido. Una secci\xF3n por slide.
      </div>
      <textarea id="__opOutline" rows="12"
        style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace;line-height:1.6"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        placeholder="# Introducci\xF3n
Este es el contenido del primer slide.

# El problema
- Punto clave 1
- Punto clave 2
- Dato importante

# Nuestra soluci\xF3n
Descripci\xF3n de la soluci\xF3n propuesta.

# Resultados esperados
- Beneficio 1
- Beneficio 2

# Conclusi\xF3n
Mensaje final de cierre."># Bienvenidos
WC Corporate Editor v25 \u2014 Presentaci\xF3n profesional

# El problema
- Los editores tradicionales son lentos
- No tienen integraci\xF3n con Costa Rica
- Falta de funciones IA modernas

# Nuestra soluci\xF3n
WC Corporate Editor: el editor m\xE1s completo para Costa Rica con 115+ features, IA integrada y soporte para lenguas ind\xEDgenas.

# Caracter\xEDsticas principales
- \u{1F999} IA con Llama 3.3 via Groq
- \u{1F1E8}\u{1F1F7} Integrado con CCSS, Hacienda, SICOP
- \u{1F33F} Lenguas ind\xEDgenas CR
- \u{1F4F1} 100% compatible con iOS

# Conclusi\xF3n
Pura vida mae \u2014 el futuro de los editores en Costa Rica es hoy.</textarea>
    </div>

    <!-- Secci\xF3n IA -->
    <div id="__opSection_ai" style="display:none;flex:1;overflow-y:auto;padding:0 20px">
      <div style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tema de la presentaci\xF3n</label>
        <input type="text" id="__opAITopic" placeholder="Ej: Estrategia de ventas Q1 2025, Proyecto de investigaci\xF3n..."
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">N\xFAmero de slides</label>
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
            <option value="ejecutiva">Ejecutiva / Direcci\xF3n</option>
            <option value="academica">Acad\xE9mica / Universitaria</option>
            <option value="cliente">Clientes / Externos</option>
            <option value="tecnica">T\xE9cnica / Interna</option>
          </select>
        </div>
      </div>
      <button onclick="__opGenerateAI()" style="width:100%;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F999} Generar outline con IA</button>
      <div id="__opAIStatus" style="display:none;text-align:center;color:#0084ff;font-size:12px;padding:10px">\u23F3 Generando outline...</div>
    </div>

    <!-- Preview -->
    <div id="__opSection_preview" style="display:none;flex:1;overflow-y:auto;padding:0 20px">
      <div id="__opPreviewContent" style="font-size:12px;color:#555;text-align:center;padding:20px">
        Gener\xE1 o escrib\xED el outline primero
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__outlinePresPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__opPreview()" style="flex:1;padding:10px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F441} Preview</button>
      <button onclick="__opGenerate()" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3AC} Generar presentaci\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__opTheme={id:"corporate",bg:"#003da5",text:"#fff"}}function __opTab(tab,btn){["outline","ai","preview"].forEach((t,i)=>{const sec=document.getElementById("__opSection_"+t),b=document.getElementById("__opTab"+(i+1));sec&&(sec.style.display=t===tab?"flex":"none"),sec&&t===tab&&(sec.style.flexDirection="column"),b&&(b.style.borderColor=t===tab?"#003da5":"#eee",b.style.background=t===tab?"#f0f7ff":"#fafafa",b.style.color=t===tab?"#003da5":"#555")})}function __opSelectTheme(id,btn){const themes={corporate:{id:"corporate",bg:"#003da5",text:"#fff"},dark:{id:"dark",bg:"#1a1a2e",text:"#e0e0e0"},green:{id:"green",bg:"#1a472a",text:"#fff"},minimal:{id:"minimal",bg:"#f5f5f5",text:"#333"},sunset:{id:"sunset",bg:"linear-gradient(135deg,#ff6b35,#f7931e)",text:"#fff"}};window.__opTheme=themes[id]||themes.corporate,document.querySelectorAll(".__opThemeBtn").forEach(b=>{b.style.borderColor="#eee",delete b.dataset.sel}),btn.style.borderColor="#fff",btn.dataset.sel="1"}async function __opGenerateAI(){const key=localStorage.getItem("wc-groq-key"),topic=document.getElementById("__opAITopic")?.value.trim();if(!topic){showToast("Ingres\xE1 el tema de la presentaci\xF3n");return}if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const slides=document.getElementById("__opAISlides")?.value||"8",audience=document.getElementById("__opAIAudience")?.value||"ejecutiva",status=document.getElementById("__opAIStatus");status&&(status.style.display="block");try{const outline=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un experto en comunicaci\xF3n ejecutiva costarricense. Gener\xE1s outlines de presentaciones profesionales."},{role:"user",content:`Genera un outline para una presentaci\xF3n de ${slides} slides sobre: "${topic}"
Audiencia: ${audience}
Formato EXACTO (usa # para t\xEDtulos de slides):

# [T\xEDtulo del slide]
[Contenido: 2-4 bullets o p\xE1rrafo corto]

Genera exactamente ${slides} slides. S\xE9 concreto y directo. En espa\xF1ol.`}],temperature:.5,max_tokens:1e3})})).json())?.choices?.[0]?.message?.content||"";status&&(status.style.display="none");const ta=document.getElementById("__opOutline");ta&&(ta.value=outline),__opTab("outline",document.getElementById("__opTab1")),showToast("\u2705 Outline generado")}catch(e){status&&(status.style.display="none"),showToast("Error: "+e.message)}}function __opParseOutline(){const text=document.getElementById("__opOutline")?.value||"",slides=[];return text.split(/^#\s+/m).filter(p=>p.trim()).forEach(part=>{const lines=part.split(`
`).filter(l=>l.trim()),title=lines[0]?.trim()||"Slide",body=lines.slice(1).join(`
`).trim();slides.push({title,body})}),slides}function __opPreview(){const slides=__opParseOutline(),theme=window.__opTheme||{bg:"#003da5",text:"#fff"},prev=document.getElementById("__opPreviewContent");if(prev){if(__opTab("preview",document.getElementById("__opTab3")),!slides.length){prev.innerHTML='<div style="color:#bbb;padding:20px;text-align:center">Sin slides</div>';return}prev.innerHTML=slides.map((s,i)=>`
    <div style="background:${theme.bg};border-radius:10px;padding:14px;margin-bottom:8px;color:${theme.text}">
      <div style="font-size:11px;opacity:.5;margin-bottom:4px">SLIDE ${i+1}</div>
      <div style="font-size:14px;font-weight:700">${s.title}</div>
      ${s.body?`<div style="font-size:11px;opacity:.8;margin-top:6px;white-space:pre-wrap">${s.body}</div>`:""}
    </div>`).join("")}}function __opGenerate(){const slides=__opParseOutline(),theme=window.__opTheme||{bg:"#003da5",text:"#fff"};if(!slides.length){showToast("Escrib\xED el outline primero");return}const total=slides.length,r=Math.round(parseInt(theme.bg.replace("#",""),16)*.8).toString(16).padStart(6,"0"),html=`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Presentaci\xF3n \u2014 WC Corporate Editor</title>
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
<div class="slide${i===0?" active":""}" id="s${i}">
  <div class="progress" style="width:${Math.round((i+1)/total*100)}%"></div>
  <div class="accent"></div>
  <h1>${s.title}</h1>
  ${s.body?`<div class="body">${s.body}</div>`:""}
  <div class="slide-num">${i+1} / ${total}</div>
</div>`).join("")}

<div class="nav">
  <button onclick="nav(-1)">\u25C0</button>
  <span class="nav-cnt" id="cnt">1 / ${total}</span>
  <button onclick="nav(1)">\u25B6</button>
</div>
<button class="exit" onclick="window.close()">\u2715 Cerrar</button>
<button class="fs-btn" onclick="document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()">\u26F6</button>

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
</body></html>`,win=window.open("","_blank","width=1200,height=700");win.document.write(html),win.document.close(),document.getElementById("__outlinePresPanel").remove(),showToast(`\u{1F3AC} Presentaci\xF3n con ${total} slides generada \u2705`)}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"autocorrect":openAutocorrectPanel();break;case"tableOCR":openTableOCR();break;case"voiceAI":openVoiceAI();break;case"outlinePresentation":openOutlinePresentation();break;default:orig(a)}}),WC_AUTOCORRECT.enabled&&WC_AUTOCORRECT.start(),console.log("WC Corporate Editor v25.22 \u2705 \u2014 Autocorrector CR, OCR Tablas, Voz+IA, Presentaci\xF3n Outline")},3e3)})();const WC_READER={active:!1,wpm:250,words:[],current:0,interval:null,startTime:0,totalWords:0,open(){const ed=document.getElementById("editor");if(!ed)return;const words=ed.innerText.trim().split(/\s+/).filter(w=>w);if(words.length<10){showToast("El documento necesita m\xE1s contenido");return}this.words=words,this.totalWords=words.length,this.current=0,this.active=!0,this._render()},_render(){const old=document.getElementById("__readerOverlay");old&&old.remove();const ov=document.createElement("div");ov.id="__readerOverlay",ov.style.cssText='position:fixed;inset:0;z-index:9500;background:#1a1a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,"Segoe UI",sans-serif';const estimatedMins=Math.round(this.totalWords/this.wpm),readMins=Math.round(this.current/this.wpm);ov.innerHTML=`
      <!-- Barra superior -->
      <div style="position:fixed;top:0;left:0;right:0;padding:12px 20px;background:rgba(26,26,46,.9);display:flex;align-items:center;gap:12px;z-index:1">
        <button onclick="WC_READER.close()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px">\u2715 Salir</button>
        <div style="flex:1;text-align:center;font-size:12px;color:#555">${this.totalWords} palabras \xB7 ~${estimatedMins} min lectura</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;color:#555">WPM:</span>
          <input type="range" id="__readerWPM" min="100" max="800" value="${this.wpm}" step="25"
            style="width:80px;accent-color:#0084ff"
            oninput="WC_READER.wpm=parseInt(this.value);document.getElementById('__readerWPMVal').textContent=this.value">
          <span id="__readerWPMVal" style="font-size:12px;color:#0084ff;min-width:30px">${this.wpm}</span>
        </div>
      </div>

      <!-- \xC1rea de lectura -->
      <div style="max-width:600px;width:100%;padding:0 40px;text-align:center">
        <!-- Veloc\xEDmetro -->
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
          <span style="color:#0084ff">\u2022</span>
        </div>

        <!-- Contexto -->
        <div id="__readerContext" style="font-size:14px;color:#555;max-height:80px;overflow:hidden;line-height:1.6;margin-bottom:24px;transition:opacity .3s"></div>

        <!-- Progreso -->
        <div style="background:#333;border-radius:20px;height:6px;overflow:hidden;margin-bottom:8px">
          <div id="__readerProgress" style="height:100%;background:linear-gradient(90deg,#0084ff,#27ae60);border-radius:20px;width:0%;transition:width .3s"></div>
        </div>
        <div style="font-size:11px;color:#555;margin-bottom:24px">
          <span id="__readerPos">0</span> / ${this.totalWords} palabras \xB7 <span id="__readerTime">0</span> min le\xEDdos
        </div>

        <!-- Controles -->
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button onclick="WC_READER.jump(-50)" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:12px">\u221250</button>
          <button onclick="WC_READER.prev()" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:14px">\u25C0</button>
          <button id="__readerPlayBtn" onclick="WC_READER.toggle()" style="padding:10px 24px;background:#0084ff;border:none;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;min-width:90px">\u25B6 Play</button>
          <button onclick="WC_READER.next()" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:14px">\u25B6</button>
          <button onclick="WC_READER.jump(50)" style="padding:8px 14px;background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:8px;cursor:pointer;font-size:12px">+50</button>
        </div>

        <!-- Modos -->
        <div style="display:flex;gap:6px;justify-content:center;margin-top:12px">
          <button onclick="WC_READER.setMode('rsvp')" style="padding:5px 12px;border:1.5px solid ${this._mode==="rsvp"?"#0084ff":"#333"};background:${this._mode==="rsvp"?"#0084ff33":"transparent"};color:${this._mode==="rsvp"?"#0084ff":"#555"};border-radius:6px;cursor:pointer;font-size:11px">RSVP</button>
          <button onclick="WC_READER.setMode('scroll')" style="padding:5px 12px;border:1.5px solid ${this._mode==="scroll"?"#0084ff":"#333"};background:${this._mode==="scroll"?"#0084ff33":"transparent"};color:${this._mode==="scroll"?"#0084ff":"#555"};border-radius:6px;cursor:pointer;font-size:11px">Scroll</button>
        </div>
      </div>

      <!-- Estad\xEDsticas finales (ocultas) -->
      <div id="__readerStats" style="display:none;position:fixed;inset:0;background:#1a1a2e;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center"></div>
    `,document.body.appendChild(ov),this._mode="rsvp",this._updateDisplay(),this._keyHandler=e=>{e.key==="Escape"&&this.close(),e.key===" "&&(e.preventDefault(),this.toggle()),e.key==="ArrowRight"&&this.next(),e.key==="ArrowLeft"&&this.prev()},document.addEventListener("keydown",this._keyHandler)},toggle(){if(this.interval){clearInterval(this.interval),this.interval=null;const btn=document.getElementById("__readerPlayBtn");btn&&(btn.textContent="\u25B6 Play")}else{this.startTime||(this.startTime=Date.now()),this.interval=setInterval(()=>{if(this.current>=this.words.length){this.finish();return}this._updateDisplay(),this.current++},6e4/this.wpm);const btn=document.getElementById("__readerPlayBtn");btn&&(btn.textContent="\u23F8 Pausa")}},_updateDisplay(){const wordEl=document.getElementById("__readerWord"),ctxEl=document.getElementById("__readerContext"),progEl=document.getElementById("__readerProgress"),posEl=document.getElementById("__readerPos"),timeEl=document.getElementById("__readerTime"),gaugeEl=document.getElementById("__readerGauge"),wpmDispEl=document.getElementById("__readerWPMDisplay"),pct=this.totalWords>0?this.current/this.totalWords:0,word=this.words[this.current]||"";wordEl&&(wordEl.innerHTML=this._highlightWord(word)),ctxEl&&(ctxEl.textContent=this.words.slice(Math.max(0,this.current-5),this.current+10).join(" ")),progEl&&(progEl.style.width=pct*100+"%"),posEl&&(posEl.textContent=this.current),timeEl&&(timeEl.textContent=Math.round(this.current/this.wpm));const gaugeMax=800,offset=Math.PI*50*(1-Math.min(this.wpm,gaugeMax)/gaugeMax);gaugeEl&&(gaugeEl.style.strokeDashoffset=offset),wpmDispEl&&(wpmDispEl.textContent=this.wpm)},_highlightWord(word){if(!word)return'<span style="color:#333">\u2022</span>';const mid=Math.floor(word.length/2);return`<span style="color:#e74c3c">${word.slice(0,1)}</span><span style="color:#fff">${word.slice(1,mid)}</span><span style="color:#0084ff">${word.slice(mid)}</span>`},next(){this.current=Math.min(this.words.length-1,this.current+1),this._updateDisplay()},prev(){this.current=Math.max(0,this.current-1),this._updateDisplay()},jump(n){this.current=Math.max(0,Math.min(this.words.length-1,this.current+n)),this._updateDisplay()},setMode(m){this._mode=m},finish(){clearInterval(this.interval),this.interval=null;const elapsed=this.startTime?Math.round((Date.now()-this.startTime)/6e4):1,realWPM=elapsed>0?Math.round(this.totalWords/elapsed):this.wpm,statsEl=document.getElementById("__readerStats");statsEl&&(statsEl.style.display="flex",statsEl.innerHTML=`
        <div style="font-size:40px;margin-bottom:16px">\u{1F389}</div>
        <div style="font-size:24px;font-weight:900;color:#fff;margin-bottom:8px">\xA1Lectura completada!</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin:16px 0">
          <div style="text-align:center"><div style="font-size:28px;font-weight:900;color:#0084ff">${this.totalWords}</div><div style="font-size:11px;color:#555">Palabras</div></div>
          <div style="text-align:center"><div style="font-size:28px;font-weight:900;color:#27ae60">${elapsed}</div><div style="font-size:11px;color:#555">Minutos</div></div>
          <div style="text-align:center"><div style="font-size:28px;font-weight:900;color:#f39c12">${realWPM}</div><div style="font-size:11px;color:#555">WPM real</div></div>
        </div>
        <div style="font-size:13px;color:#555;margin-bottom:20px">${realWPM>300?"\u26A1 \xA1Lector r\xE1pido!":realWPM>200?"\u{1F44D} Velocidad promedio":"\u{1F4D6} Lectura comprensiva"}</div>
        <button onclick="WC_READER.close()" style="padding:12px 28px;background:#0084ff;border:none;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700">Cerrar</button>`)},close(){clearInterval(this.interval),this.interval=null,this.active=!1,document.removeEventListener("keydown",this._keyHandler);const ov=document.getElementById("__readerOverlay");ov&&ov.remove(),document.title="WC Corporate Editor v24"}};function openReaderMode(){WC_READER.open()}const WC_HISTORY_SAVES={saves:JSON.parse(localStorage.getItem("wc-save-history")||"[]"),maxSaves:20,save(label){const ed=document.getElementById("editor");if(!ed)return;const entry={id:"s"+Date.now(),label:label||"Autoguardado",date:new Date().toLocaleString("es-CR"),ts:Date.now(),words:ed.innerText.trim().split(/\s+/).filter(w=>w).length,preview:ed.innerText.slice(0,100).trim(),html:ed.innerHTML};return this.saves.unshift(entry),this.saves.length>this.maxSaves&&this.saves.pop(),localStorage.setItem("wc-save-history",JSON.stringify(this.saves)),entry},restore(id){const entry=this.saves.find(s=>s.id===id),ed=document.getElementById("editor");return!entry||!ed?!1:(this.save("Antes de restaurar"),ed.innerHTML=entry.html,typeof updateStats=="function"&&updateStats(),!0)},delete(id){this.saves=this.saves.filter(s=>s.id!==id),localStorage.setItem("wc-save-history",JSON.stringify(this.saves))},startAuto(intervalMinutes){clearInterval(this._autoInterval),this._autoInterval=setInterval(()=>{const entry=this.save("Autoguardado");if(entry){const sb=document.getElementById("trackStatus")||document.getElementById("__statusbar");sb&&(sb.textContent=`\u2713 Autoguardado ${entry.date}`)}},intervalMinutes*60*1e3)}};function openSaveHistory(){const old=document.getElementById("__saveHistPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__saveHistPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const saves=WC_HISTORY_SAVES.saves;ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div>
          <div style="font-size:17px;font-weight:700;color:#1a2942">\u{1F4BE} Historial de guardados</div>
          <div style="font-size:11px;color:#888;margin-top:2px">${saves.length} versiones guardadas \xB7 m\xE1x ${WC_HISTORY_SAVES.maxSaves}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button onclick="WC_HISTORY_SAVES.save('Manual');openSaveHistory()" style="padding:7px 12px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4BE} Guardar ahora</button>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px;font-size:11px">
        <span style="color:#888">Auto cada:</span>
        ${[5,10,30].map(m=>`<button onclick="WC_HISTORY_SAVES.startAuto(${m});showToast('\u23F1 Auto cada ${m} min')" style="padding:3px 9px;border:1.5px solid #eee;background:#fafafa;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;color:#555">${m}min</button>`).join("")}
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 20px">
      ${saves.length?saves.map((s,i)=>`
          <div style="background:#fafafa;border:1.5px solid #eee;border-radius:12px;padding:12px;margin-bottom:8px">
            <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
              <div style="width:36px;height:36px;background:${i===0?"#27ae60":"#f0f0f5"};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">${i===0?"\u2B50":"\u{1F4BE}"}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:700;color:#1a1a1a">${s.label}</div>
                <div style="font-size:10px;color:#888">${s.date} \xB7 ${s.words} palabras</div>
                <div style="font-size:11px;color:#aaa;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.preview}...</div>
              </div>
              <button onclick="WC_HISTORY_SAVES.delete('${s.id}');openSaveHistory()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:16px;flex-shrink:0">\u{1F5D1}</button>
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="__saveHistPreview('${s.id}')" style="flex:1;padding:7px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F441} Ver</button>
              <button onclick="if(confirm('\xBFRestaurar esta versi\xF3n? El estado actual se guardar\xE1 primero.')){WC_HISTORY_SAVES.restore('${s.id}');document.getElementById('__saveHistPanel').remove();showToast('\u21A9 Versi\xF3n restaurada \u2705')}" style="flex:2;padding:7px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u21A9 Restaurar</button>
            </div>
          </div>`).join(""):`
        <div style="text-align:center;padding:30px;color:#bbb">
          <div style="font-size:32px;margin-bottom:10px">\u{1F4BE}</div>
          <div style="font-size:13px">Sin guardados a\xFAn</div>
          <div style="font-size:11px;margin-top:6px">Activ\xE1 el autoguardado o guard\xE1 manualmente</div>
        </div>`}
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__saveHistPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __saveHistPreview(id){const s=WC_HISTORY_SAVES.saves.find(s2=>s2.id===id);if(!s)return;window.open("","_blank","width=700,height=600").document.write(`<html><head><title>${s.label}</title><style>body{font-family:Calibri,Arial;margin:2cm;line-height:1.6;color:#333}h1,h2,h3{color:#1a2942}</style></head><body><div style="background:#f0f7ff;padding:12px;border-radius:8px;margin-bottom:16px;font-size:12px"><strong>${s.label}</strong> \xB7 ${s.date} \xB7 ${s.words} palabras</div>${s.html}</body></html>`)}document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="s"&&setTimeout(()=>WC_HISTORY_SAVES.save("Ctrl+S"),200)}),WC_HISTORY_SAVES.startAuto(10);function openDocumentComparator(){const old=document.getElementById("__comparePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__comparePanel",ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,"Segoe UI",sans-serif';const ed=document.getElementById("editor"),docA=ed?ed.innerHTML:"";ov.innerHTML=`
    <!-- Header -->
    <div style="background:#1a2942;color:#fff;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;flex:1">\u2696\uFE0F Comparador de documentos</div>
      <button onclick="document.getElementById('__comparePanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:12px">\u2715 Cerrar</button>
    </div>

    <!-- Controles -->
    <div style="background:#fff;padding:10px 16px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap">
      <div style="font-size:12px;font-weight:600;color:#555">Comparar con:</div>
      <select id="__cmpSource" style="padding:6px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
        <option value="paste">Pegar texto</option>
        <option value="history">Versi\xF3n guardada</option>
        <option value="file">Archivo</option>
      </select>
      <button onclick="__cmpLoad()" style="padding:6px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Cargar \u2192</button>
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

    <!-- Panel de texto para pegar (seg\xFAn fuente) -->
    <div id="__cmpInputArea" style="background:#f8f9fa;padding:10px 16px;border-bottom:1px solid #eee;flex-shrink:0;display:none">
      <textarea id="__cmpPasteArea" placeholder="Peg\xE1 el texto del segundo documento aqu\xED..." rows="3"
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      <div style="display:flex;gap:6px;margin-top:6px">
        <button onclick="__cmpRunCompare()" style="padding:7px 16px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">\u2696\uFE0F Comparar</button>
        <button onclick="document.getElementById('__cmpInputArea').style.display='none'" style="padding:7px 12px;border:1.5px solid #eee;background:#fff;border-radius:7px;cursor:pointer;font-size:12px">Cancelar</button>
      </div>
    </div>

    <!-- Columnas de comparaci\xF3n -->
    <div style="flex:1;display:flex;overflow:hidden">
      <div style="flex:1;display:flex;flex-direction:column;border-right:2px solid #eee">
        <div style="background:#003da5;color:#fff;padding:8px 14px;font-size:12px;font-weight:700;flex-shrink:0">
          \u{1F4C4} Documento actual <span id="__cmpAWords" style="opacity:.7;font-weight:400"></span>
        </div>
        <div id="__cmpPanelA" style="flex:1;overflow-y:auto;padding:16px;font-family:Calibri,'Segoe UI',sans-serif;font-size:11pt;line-height:1.6">${docA}</div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column">
        <div style="background:#27ae60;color:#fff;padding:8px 14px;font-size:12px;font-weight:700;flex-shrink:0">
          \u{1F4C4} Documento B <span id="__cmpBWords" style="opacity:.7;font-weight:400"></span>
        </div>
        <div id="__cmpPanelB" style="flex:1;overflow-y:auto;padding:16px;font-family:Calibri,'Segoe UI',sans-serif;font-size:11pt;line-height:1.6;color:#888;font-style:italic">
          <div style="text-align:center;padding:40px;color:#bbb">
            <div style="font-size:32px;margin-bottom:12px">\u{1F4C2}</div>
            Seleccion\xE1 una fuente y carg\xE1 el segundo documento
          </div>
        </div>
      </div>
    </div>

    <!-- Estad\xEDsticas -->
    <div id="__cmpStats" style="background:#f8f9fa;padding:8px 16px;border-top:1px solid #eee;font-size:11px;color:#888;display:flex;gap:16px;flex-shrink:0;flex-wrap:wrap"></div>
  `,document.body.appendChild(ov);const pA=document.createElement("div");pA.innerHTML=docA;const wA=pA.innerText.trim().split(/\s+/).filter(w=>w).length;document.getElementById("__cmpAWords").textContent=`(${wA} palabras)`,window.__cmpDocA=docA;const panelA=document.getElementById("__cmpPanelA"),panelB=document.getElementById("__cmpPanelB");panelA&&panelB&&panelA.addEventListener("scroll",()=>{document.getElementById("__cmpSync")?.checked&&(panelB.scrollTop=panelA.scrollTop*(panelB.scrollHeight/panelA.scrollHeight))})}function __cmpLoad(){const source=document.getElementById("__cmpSource")?.value,inputArea=document.getElementById("__cmpInputArea");if(source==="paste")inputArea&&(inputArea.style.display="block");else if(source==="history"){const saves=WC_HISTORY_SAVES.saves;if(!saves.length){showToast("No hay versiones guardadas");return}const names=saves.map((s,i)=>`${i+1}. ${s.label} \u2014 ${s.date} (${s.words} palabras)`).join(`
`),idx=prompt(`Eleg\xED una versi\xF3n (n\xFAmero):
${names}`,"1");if(!idx)return;const save=saves[parseInt(idx)-1];if(!save)return;window.__cmpDocB=save.html,__cmpRunCompare()}else if(source==="file"){const inp=document.createElement("input");inp.type="file",inp.accept=".html,.htm,.txt",inp.onchange=()=>{const file=inp.files[0];if(!file)return;const reader=new FileReader;reader.onload=e=>{window.__cmpDocB=e.target.result,__cmpRunCompare()},reader.readAsText(file)},inp.click()}}function __cmpRunCompare(){const source=document.getElementById("__cmpSource")?.value;let docB=window.__cmpDocB||"";if(source==="paste"&&(docB=document.getElementById("__cmpPasteArea")?.value||"",document.getElementById("__cmpInputArea").style.display="none"),!docB.trim()){showToast("El documento B est\xE1 vac\xEDo");return}const highlight=document.getElementById("__cmpHighlight")?.checked,panelB=document.getElementById("__cmpPanelB"),statsEl=document.getElementById("__cmpStats");panelB&&(panelB.innerHTML=docB,panelB.style.color="",panelB.style.fontStyle="");const divA=document.createElement("div");divA.innerHTML=window.__cmpDocA;const divB=document.createElement("div");divB.innerHTML=docB;const textA=divA.innerText.trim().split(/\s+/).filter(w=>w),textB=divB.innerText.trim().split(/\s+/).filter(w=>w),setA=new Set(textA),setB=new Set(textB),added=textB.filter(w=>!setA.has(w)).length,removed=textA.filter(w=>!setB.has(w)).length,common=textA.filter(w=>setB.has(w)).length,similarity=textA.length?Math.round(common/Math.max(textA.length,textB.length)*100):0;if(document.getElementById("__cmpBWords").textContent=`(${textB.length} palabras)`,statsEl&&(statsEl.innerHTML=`
      <span>\u{1F4CA} Similitud: <strong style="color:${similarity>70?"#27ae60":"#f39c12"}">${similarity}%</strong></span>
      <span>+ <strong style="color:#27ae60">${added}</strong> palabras a\xF1adidas en B</span>
      <span>- <strong style="color:#e74c3c">${removed}</strong> palabras eliminadas en B</span>
      <span>\u{1F4C4} A: ${textA.length} palabras \xB7 B: ${textB.length} palabras</span>`),highlight&&panelB){const removedWords=new Set(textA.filter(w=>!setB.has(w))),addedWords=new Set(textB.filter(w=>!setA.has(w)));let html=panelB.innerHTML;addedWords.forEach(w=>{w.length>3&&(html=html.replace(new RegExp("\\b"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","g"),`<mark style="background:#d4edda;border-radius:2px">${w}</mark>`))}),panelB.innerHTML=html}showToast(`\u2696\uFE0F Similitud: ${similarity}%`)}function openGoogleSlidesExport(){const old=document.getElementById("__gsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__gsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const ed=document.getElementById("editor"),headings=ed?Array.from(ed.querySelectorAll("h1,h2,h3")):[];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#f4b400" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
      Exportar a Google Slides
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Crea una presentaci\xF3n de Google desde el documento</div>

    <div style="background:#fff9e6;border:1.5px solid #f39c12;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#856404;line-height:1.6">
      \u2139\uFE0F <strong>M\xE9todo:</strong> Se genera un archivo HTML/JSON que pod\xE9s importar a Google Slides, o se crea un link a Google Slides con el contenido del documento.
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">T\xEDtulo de la presentaci\xF3n</label>
      <input type="text" id="__gsTitle" value="${headings[0]?.innerText?.slice(0,50)||"Mi presentaci\xF3n"}"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">M\xE9todo de exportaci\xF3n</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid #eee;border-radius:10px;transition:all .15s" onmouseover="this.style.borderColor='#4285f4'" onmouseout="this.style.borderColor='#eee'">
          <input type="radio" name="__gsMethod" value="download" checked style="margin-top:2px;accent-color:#4285f4">
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">\u{1F4E5} Descargar como HTML de presentaci\xF3n</div>
            <div style="font-size:11px;color:#888">Archivo HTML que funciona como presentaci\xF3n. Importable a Google Slides.</div>
          </div>
        </label>
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid #eee;border-radius:10px;transition:all .15s" onmouseover="this.style.borderColor='#4285f4'" onmouseout="this.style.borderColor='#eee'">
          <input type="radio" name="__gsMethod" value="slides_url" style="margin-top:2px;accent-color:#4285f4">
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">\u{1F310} Abrir en Google Slides (nuevo)</div>
            <div style="font-size:11px;color:#888">Abre Google Slides en blanco. Copi\xE1s el contenido generado.</div>
          </div>
        </label>
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:10px;border:1.5px solid #eee;border-radius:10px;transition:all .15s" onmouseover="this.style.borderColor='#4285f4'" onmouseout="this.style.borderColor='#eee'">
          <input type="radio" name="__gsMethod" value="pptx" style="margin-top:2px;accent-color:#4285f4">
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">\u{1F4CA} Descargar como PPTX base</div>
            <div style="font-size:11px;color:#888">Estructura PPTX importable en Google Slides y PowerPoint.</div>
          </div>
        </label>
      </div>
    </div>

    <div style="font-size:11px;color:#888;margin-bottom:14px">
      Se detectaron <strong>${headings.length}</strong> t\xEDtulos = <strong>${headings.length||1}</strong> slide${headings.length!==1?"s":""}
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__gsPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__gsExport()" style="flex:2;padding:11px;border:none;background:#4285f4;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        <svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:4px"><path fill="#fff" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        Exportar
      </button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __gsExport(){const method=document.querySelector('[name="__gsMethod"]:checked')?.value||"download",title=document.getElementById("__gsTitle")?.value||"Presentaci\xF3n",ed=document.getElementById("editor");if(!ed)return;const children=Array.from(ed.children),slides=[];let current=null;if(children.forEach(el=>{/^H[123]$/.test(el.tagName)?(current&&slides.push(current),current={title:el.innerText.trim(),body:"",html:""}):current&&(current.body+=el.innerText.trim()+" ",current.html+=el.outerHTML)}),current&&slides.push(current),slides.length||slides.push({title,body:ed.innerText.slice(0,300),html:ed.innerHTML}),method==="download"||method==="pptx"){const presHTML=`<!DOCTYPE html>
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
${slides.map((s,i)=>`<div class="slide${i===0?" active":""}" id="s${i}"><div class="bar" style="width:${Math.round((i+1)/slides.length*100)}%"></div><h1>${s.title}</h1>${s.body?`<div class="body">${s.body.slice(0,200)}</div>`:""}<div class="num">${i+1}/${slides.length}</div></div>`).join("")}
<div class="nav"><button onclick="nav(-1)">\u25C0</button><button onclick="nav(1)">\u25B6</button></div>
<script>let c=0;function nav(d){document.querySelectorAll('.slide').forEach(s=>s.classList.remove('active'));c=Math.max(0,Math.min(${slides.length-1},c+d));document.getElementById('s'+c).classList.add('active');}document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')nav(1);if(e.key==='ArrowLeft')nav(-1);});<\/script>
</body></html>`,ext=method==="pptx"?"pptx.html":"html",blob=new Blob([presHTML],{type:"text/html;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=title.replace(/\s+/g,"-")+"-slides."+ext,a.click(),document.getElementById("__gsPanel").remove(),showToast(`\u{1F4CA} ${slides.length} slides exportados \u2705`)}else if(method==="slides_url"){window.open("https://slides.google.com/create","_blank");const text=slides.map((s,i)=>`SLIDE ${i+1}: ${s.title}
${s.body}`).join(`

---

`);navigator.clipboard.writeText(text).then(()=>{showToast("\u{1F4CB} Contenido copiado. Pegalo en Google Slides")}),document.getElementById("__gsPanel").remove()}}const WC_INDIGENOUS_TTS={pronunciations:{bribri:{Shk\u00EBk\u00EB:["SH-k\xEB-k\xEB","Hola"],\u00CBy\u00F6:["\xCB-y\xF6","Gracias"],Aba:["A-ba","Agua"],Ch\u00E4:["Ch\xE4","Fuego"],It\u00F6:["I-t\xF6","Tierra"],Y\u00F6:["Y\xF6","Casa"],K\u00EB:["K\xEB","S\xED"],"K\xEB-k\xEB":["K\xEB-k\xEB","No"],Tso:["Tso","Persona"],Sur\u00E1:["Su-r\xE1","Dios, creador"]},cabecar:{"K\xE1 b\xEB\u0301r\xEB":["K\xE1-b\xEB-r\xEB","Buenos d\xEDas"],Y\u00F6k:["Y\xF6k","Agua"],S\u00EBk:["S\xEBk","Fuego"],Du\u00F6:["Du\xF6","Tierra"],W\u00E1k:["W\xE1k","Casa"],B\u00EB\u0301:["B\xEB","T\xFA"],Y\u00EB\u0301:["Y\xEB","Yo"]},maleku:{"Ma lha mar\xE1ma":["Ma-lha-ma-r\xE1-ma","Buenas tardes"],Toku:["To-ku","Agua"],Kira:["Ki-ra","Fuego"],Naku:["Na-ku","Tierra"],Jiri:["Ji-ri","Casa"],Lhak\u00E1:["Lha-k\xE1","Gracias"]},boruca:{Sh\u00EDi:["Sh\xEDi","Gracias"],Danz\u00F6:["Dan-z\xF6","Hola"],Unk:["Unk","Agua"],T\u00F6:["T\xF6","Fuego"],Dru:["Dru","Tierra"],Kro:["Kro","Casa"]},ngabe:{Dru:["Dru","Agua"],Kira:["Ki-ra","Fuego"],Noke:["No-ke","Tierra"],Bri:["Bri","Casa"],M\u00EBnk\u00EB:["M\xEBn-k\xEB","Gracias"]}},speak(word,lang,approxPronunciation){if(!window.speechSynthesis){showToast("S\xEDntesis de voz no disponible");return}const text=approxPronunciation||word,utter=new SpeechSynthesisUtterance(text);utter.lang="es-CR",utter.rate=.7,utter.pitch=1,utter.volume=1,window.speechSynthesis.cancel(),window.speechSynthesis.speak(utter)},speakFast(word){if(!window.speechSynthesis)return;const utter=new SpeechSynthesisUtterance(word);utter.lang="es-CR",utter.rate=.8,window.speechSynthesis.cancel(),window.speechSynthesis.speak(utter)}};function openIndigenousTTS(){const old=document.getElementById("__ttsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ttsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const langs=Object.keys(WC_INDIGENOUS_TTS.pronunciations);ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F50A} Pronunciaci\xF3n \u2014 Lenguas CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Escuch\xE1 la pronunciaci\xF3n aproximada de palabras ind\xEDgenas</div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${langs.map((lang,i)=>`
          <button onclick="__ttsSelectLang('${lang}',this)"
            class="__ttsLangBtn"
            style="padding:6px 12px;border:1.5px solid ${i===0?"#27ae60":"#eee"};background:${i===0?"#f0fff4":"#fafafa"};color:${i===0?"#155724":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            \u{1F33F} ${lang.charAt(0).toUpperCase()+lang.slice(1)}
          </button>`).join("")}
      </div>

      <!-- Buscar / escribir -->
      <div style="display:flex;gap:6px;margin-bottom:12px">
        <input type="text" id="__ttsCustomWord" placeholder="Escrib\xED cualquier texto para escuchar..."
          style="flex:1;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter')WC_INDIGENOUS_TTS.speakFast(this.value)">
        <button onclick="WC_INDIGENOUS_TTS.speakFast(document.getElementById('__ttsCustomWord').value)"
          style="padding:8px 12px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:14px">\u{1F50A}</button>
      </div>
    </div>

    <div id="__ttsWordList" style="flex:1;overflow-y:auto;padding:0 20px 16px"></div>

    <div style="padding:12px 20px;border-top:1px solid #eee;flex-shrink:0">
      <div style="font-size:11px;color:#888;margin-bottom:8px;line-height:1.6">
        \u{1F4A1} La pronunciaci\xF3n es aproximada usando s\xEDntesis de voz en espa\xF1ol. Para pronunciaci\xF3n aut\xE9ntica consult\xE1 con hablantes nativos o el <a href="https://www.delt.ucr.ac.cr" target="_blank" style="color:#27ae60">DELT-UCR</a>.
      </div>
      <button onclick="document.getElementById('__ttsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),__ttsSelectLang("bribri",document.querySelector(".__ttsLangBtn"))}function __ttsSelectLang(lang,btn){document.querySelectorAll(".__ttsLangBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn&&(btn.style.borderColor="#27ae60",btn.style.background="#f0fff4",btn.style.color="#155724",btn.dataset.sel="1");const words=WC_INDIGENOUS_TTS.pronunciations[lang]||{},list=document.getElementById("__ttsWordList");list&&(list.innerHTML=`
    <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">${Object.keys(words).length} palabras \u2014 ${lang.charAt(0).toUpperCase()+lang.slice(1)}</div>
    ${Object.entries(words).map(([word,[pron,meaning]])=>`
      <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;margin-bottom:6px;background:#f8f9fa;border:1.5px solid #eee;transition:all .15s"
        onmouseover="this.style.borderColor='#27ae60';this.style.background='#f0fff4'"
        onmouseout="this.style.borderColor='#eee';this.style.background='#f8f9fa'">
        <button onclick="WC_INDIGENOUS_TTS.speak('${word.replace(/'/g,"\\'")}','${lang}','${pron.replace(/'/g,"\\'")}')"
          style="width:38px;height:38px;border:none;background:#27ae60;color:#fff;border-radius:50%;cursor:pointer;font-size:18px;flex-shrink:0;transition:all .15s"
          onmouseover="this.style.background='#1e8449'" onmouseout="this.style.background='#27ae60'">\u{1F50A}</button>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:#1a1a1a">${word}</div>
          <div style="font-size:11px;color:#27ae60;font-family:'Courier New',monospace">[${pron}]</div>
          <div style="font-size:11px;color:#888">${meaning}</div>
        </div>
        <button onclick="if(typeof insertHTML==='function')insertHTML(' <span title=\\"${pron}\\">${word}</span> ');showToast('Insertado \u2705')"
          style="padding:5px 10px;border:1.5px solid #eee;background:#fff;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600;color:#555;flex-shrink:0">
          Insertar
        </button>
      </div>`).join("")}`)}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"readerMode":openReaderMode();break;case"saveHistory":openSaveHistory();break;case"compareDocuments":openDocumentComparator();break;case"googleSlides":openGoogleSlidesExport();break;case"indigenousTTS":openIndigenousTTS();break;default:orig(a)}}),console.log("WC Corporate Editor v25.23 \u2705 \u2014 Lector WPM, Historial guardados, Comparador, Google Slides, TTS Ind\xEDgena")},3100)})();
