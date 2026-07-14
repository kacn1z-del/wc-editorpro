const WC_AI_ASSIST={active:!1,timer:null,lastText:"",panel:null,toggle(){this.active=!this.active,this.active?this._start():this._stop()},_start(){const ed=document.getElementById("editor");ed&&(this._handler=()=>{clearTimeout(this.timer),this.timer=setTimeout(()=>this._analyze(),2e3)},ed.addEventListener("input",this._handler),this._showPanel(),showToast("\u{1F999} Asistente IA activado"))},_stop(){const ed=document.getElementById("editor");ed&&this._handler&&ed.removeEventListener("input",this._handler),clearTimeout(this.timer),document.getElementById("__aiAssistPanel")?.remove(),showToast("Asistente IA desactivado")},async _analyze(){const key=localStorage.getItem("wc-groq-key");if(!key)return;const ed=document.getElementById("editor"),text=ed?ed.innerText.trim().slice(-800):"";if(!text||text===this.lastText)return;this.lastText=text;const panel=document.getElementById("__aiAssistContent");panel&&(panel.innerHTML='<div style="color:#aaa;font-size:11px;padding:4px">\u{1F999} Analizando...</div>');try{const raw=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:'Sos un asistente de escritura. Analiz\xE1s el texto y das 2-3 sugerencias muy breves (m\xE1ximo 10 palabras cada una) para mejorar la continuaci\xF3n. Tambi\xE9n suger\xEDs la siguiente oraci\xF3n si el texto parece incompleto. Respond\xE9s en JSON: {"sugerencias":["...","..."],"siguiente":"..."}'},{role:"user",content:`Texto actual:
`+text}],temperature:.4,max_tokens:200})})).json())?.choices?.[0]?.message?.content||"{}",data=JSON.parse(raw.replace(/```json|```/g,"").trim());panel&&(panel.innerHTML=`
          ${data.sugerencias?.length?`
            <div style="font-size:10px;font-weight:700;color:#aaa;margin-bottom:4px">SUGERENCIAS</div>
            ${data.sugerencias.map(s=>`
              <div onclick="WC_AI_ASSIST._applySuggestion('${s.replace(/'/g,"\\'")}')"
                style="background:#f0f7ff;border-radius:6px;padding:6px 8px;margin-bottom:4px;font-size:11px;color:#003da5;cursor:pointer;transition:all .15s"
                onmouseover="this.style.background='#003da5';this.style.color='#fff'"
                onmouseout="this.style.background='#f0f7ff';this.style.color='#003da5'">
                \u{1F4A1} ${s}
              </div>`).join("")}`:""}
          ${data.siguiente?`
            <div style="font-size:10px;font-weight:700;color:#aaa;margin:6px 0 4px">CONTINUAR</div>
            <div onclick="WC_AI_ASSIST._applyContinuation('${data.siguiente.replace(/'/g,"\\'")}')"
              style="background:#d4edda;border-radius:6px;padding:6px 8px;font-size:11px;color:#155724;cursor:pointer"
              onmouseover="this.style.background='#27ae60';this.style.color='#fff'"
              onmouseout="this.style.background='#d4edda';this.style.color='#155724'">
              \u270D\uFE0F ${data.siguiente}
            </div>`:""}`)}catch{}},_applySuggestion(text){showToast("\u{1F4A1} Sugerencia: "+text.slice(0,40))},_applyContinuation(text){typeof insertHTML=="function"&&insertHTML(" "+text),showToast("\u270D\uFE0F Continuaci\xF3n insertada \u2705")},_showPanel(){const old=document.getElementById("__aiAssistPanel");old&&old.remove();const p=document.createElement("div");p.id="__aiAssistPanel",p.style.cssText="position:fixed;bottom:160px;left:12px;z-index:9000;background:#1a2942;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,.3);width:220px;overflow:hidden;font-family:-apple-system,sans-serif",p.innerHTML=`
      <div style="background:#003da5;padding:8px 12px;display:flex;align-items:center;gap:6px">
        <div style="width:7px;height:7px;background:#2ecc71;border-radius:50%;animation:wcPulse 1.5s infinite"></div>
        <div style="font-size:11px;font-weight:700;color:#fff;flex:1">\u{1F999} Asistente IA</div>
        <button onclick="WC_AI_ASSIST.toggle()" style="background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;font-size:13px">\u2715</button>
      </div>
      <div id="__aiAssistContent" style="padding:8px;min-height:60px;max-height:200px;overflow-y:auto">
        <div style="color:#666;font-size:11px;text-align:center;padding:10px">Escrib\xED para recibir sugerencias...</div>
      </div>`,document.body.appendChild(p)}};function openAIAssistPanel(){const old=document.getElementById("__aiTogglePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__aiTogglePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:380px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F999} Asistente IA en tiempo real</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Sugerencias mientras escrib\xEDs \xB7 Groq LLaMA</div>

    <div style="background:${WC_AI_ASSIST.active?"#d4edda":"#f8f9fa"};border-radius:12px;padding:14px;margin-bottom:16px;text-align:center">
      <div style="font-size:14px;font-weight:700;color:${WC_AI_ASSIST.active?"#155724":"#888"}">${WC_AI_ASSIST.active?"\u{1F7E2} Activo":"\u26AA Inactivo"}</div>
      <div style="font-size:11px;color:#aaa;margin-top:3px">Analiza cada 2 segundos de inactividad</div>
    </div>

    <div style="background:#f0f7ff;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.7">
      \u{1F999} Usa Groq LLaMA 3.3. Requiere API Key configurada. El panel aparece en la esquina inferior izquierda.
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__aiTogglePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="WC_AI_ASSIST.toggle();document.getElementById('__aiTogglePanel').remove()"
        style="flex:2;padding:11px;border:none;background:${WC_AI_ASSIST.active?"#e74c3c":"#003da5"};color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        ${WC_AI_ASSIST.active?"\u23F8 Desactivar":"\u{1F999} Activar asistente"}
      </button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function openTableGenerator(){const old=document.getElementById("__tblPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__tblPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const estilos=[{id:"word",name:"Word cl\xE1sico",header:"#003da5",odd:"#f0f7ff",border:"#c0d4e8"},{id:"verde",name:"Verde CR",header:"#27ae60",odd:"#f0fff4",border:"#a8d8b8"},{id:"dark",name:"Oscuro",header:"#1a2942",odd:"#f5f5f5",border:"#ccc"},{id:"rojo",name:"Rojo ejecutivo",header:"#ce1126",odd:"#fff5f5",border:"#f5c6c6"},{id:"minima",name:"Minimal",header:"#fff;color:#333;border-bottom:2px solid #333",odd:"",border:"#eee"},{id:"rayas",name:"Rayado",header:"#555",odd:"#f0f0f0",border:"#ddd"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CA} Generador de tablas avanzado</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Tablas profesionales con estilos predefinidos</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Columnas</label>
        <input type="number" id="__tblCols" value="3" min="1" max="10"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;text-align:center"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__tblPreview()">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Filas</label>
        <input type="number" id="__tblRows" value="3" min="1" max="20"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;text-align:center"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__tblPreview()">
      </div>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Encabezados (separados por coma)</label>
      <input type="text" id="__tblHeaders" placeholder="Nombre, Cargo, Departamento, Salario"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__tblPreview()">
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Estilo de tabla</label>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        ${estilos.map((e,i)=>`
          <button onclick="window.__tblStyle='${e.id}';document.querySelectorAll('.__tblStyleBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';});this.style.borderColor='#003da5';this.style.background='#f0f7ff';__tblPreview()" class="__tblStyleBtn"
            style="padding:8px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s">
            ${e.name}
          </button>`).join("")}
      </div>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Opciones</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${[["__tblBold","Encabezados en negrita"],["__tblAlt","Filas alternadas"],["__tblBorder","Bordes completos"],["__tblWidth","Ancho completo"]].map(([id,label])=>`
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12px;color:#555">
            <input type="checkbox" id="${id}" checked style="accent-color:#003da5"> ${label}
          </label>`).join("")}
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Vista previa</label>
      <div id="__tblPreview" style="border:1px solid #eee;border-radius:8px;overflow:hidden;font-size:10px"></div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__tblPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__tblInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CA} Insertar tabla</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__tblStyle="word",window.__tblEstilos=estilos,setTimeout(__tblPreview,100)}function __tblBuildHTML(cols,rows,headers,style,opts){const est=(window.__tblEstilos||[]).find(e=>e.id===style)||{header:"#003da5",odd:"#f0f7ff",border:"#ddd"},w=opts.width?"width:100%;":"",brd=opts.border?`border:1px solid ${est.border};`:`border:none;border-bottom:1px solid ${est.border};`;let html=`<table style="border-collapse:collapse;${w}font-family:Calibri,Arial,sans-serif;font-size:11pt">`;html+="<tr>";for(let c=0;c<cols;c++){const hText=headers[c]||`Col ${c+1}`,hStyle=est.header.includes(";")?est.header:`background:${est.header};color:#fff`;html+=`<th style="padding:8px 12px;${brd}${hStyle};${opts.bold?"font-weight:700":"font-weight:500"};text-align:left">${hText}</th>`}html+="</tr>";for(let r=0;r<rows;r++){const bg=opts.alt&&r%2===0&&est.odd?`background:${est.odd}`:"";html+="<tr>";for(let c=0;c<cols;c++)html+=`<td style="padding:7px 12px;${brd}${bg}">&nbsp;</td>`;html+="</tr>"}return html+="</table>",html}function __tblPreview(){const cols=parseInt(document.getElementById("__tblCols")?.value)||3,rows=parseInt(document.getElementById("__tblRows")?.value)||3,hdrs=(document.getElementById("__tblHeaders")?.value||"").split(",").map(h=>h.trim()),style=window.__tblStyle||"word",opts={bold:document.getElementById("__tblBold")?.checked,alt:document.getElementById("__tblAlt")?.checked,border:document.getElementById("__tblBorder")?.checked,width:document.getElementById("__tblWidth")?.checked},prev=document.getElementById("__tblPreview");prev&&(prev.innerHTML=__tblBuildHTML(Math.min(cols,6),Math.min(rows,4),hdrs,style,opts))}function __tblInsert(){const cols=parseInt(document.getElementById("__tblCols")?.value)||3,rows=parseInt(document.getElementById("__tblRows")?.value)||3,hdrs=(document.getElementById("__tblHeaders")?.value||"").split(",").map(h=>h.trim()),style=window.__tblStyle||"word",opts={bold:document.getElementById("__tblBold")?.checked,alt:document.getElementById("__tblAlt")?.checked,border:document.getElementById("__tblBorder")?.checked,width:document.getElementById("__tblWidth")?.checked},html=__tblBuildHTML(cols,rows,hdrs,style,opts);typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__tblPanel").remove(),showToast(`\u{1F4CA} Tabla ${cols}\xD7${rows} insertada \u2705`)}const WC_THEME_DOC={themes:[{name:"CR Azul",primary:"#003da5",secondary:"#0084ff",accent:"#27ae60",bg:"#fff",text:"#1a1a1a"},{name:"CR Verde",primary:"#27ae60",secondary:"#2ecc71",accent:"#003da5",bg:"#fff",text:"#1a1a1a"},{name:"Ejecutivo",primary:"#1a2942",secondary:"#2c3e50",accent:"#e74c3c",bg:"#fff",text:"#1a1a1a"},{name:"Moderno",primary:"#8e44ad",secondary:"#9b59b6",accent:"#f39c12",bg:"#fff",text:"#1a1a1a"},{name:"C\xE1lido",primary:"#e67e22",secondary:"#f39c12",accent:"#003da5",bg:"#fffef9",text:"#2c1810"},{name:"Oscuro",primary:"#0084ff",secondary:"#00b4d8",accent:"#2ecc71",bg:"#1a1a2e",text:"#e0e0e0"},{name:"Minimalista",primary:"#333",secondary:"#555",accent:"#0084ff",bg:"#fff",text:"#222"},{name:"UCR",primary:"#003366",secondary:"#0055a5",accent:"#ffcc00",bg:"#fff",text:"#1a1a1a"}],apply(idx){const t=this.themes[idx],ed=document.getElementById("editor");if(!ed)return;ed.style.background=t.bg,ed.style.color=t.text,ed.querySelectorAll("h1,h2").forEach(h=>{h.style.color=t.primary}),ed.querySelectorAll("h3,h4").forEach(h=>{h.style.color=t.secondary});const oldStyle=document.getElementById("__wcDocTheme");oldStyle&&oldStyle.remove();const style=document.createElement("style");style.id="__wcDocTheme",style.textContent=`
      #editor { background: ${t.bg} !important; color: ${t.text} !important; }
      #editor h1, #editor h2 { color: ${t.primary} !important; }
      #editor h3, #editor h4 { color: ${t.secondary} !important; }
      #editor a { color: ${t.accent} !important; }
      #editor blockquote { border-color: ${t.primary} !important; }
      #editor table th { background: ${t.primary} !important; color: #fff !important; }
    `,document.head.appendChild(style),localStorage.setItem("wc-doc-theme",JSON.stringify(t)),showToast(`\u{1F3A8} Tema "${t.name}" aplicado \u2705`)},reset(){document.getElementById("__wcDocTheme")?.remove();const ed=document.getElementById("editor");ed&&(ed.style.background="",ed.style.color=""),localStorage.removeItem("wc-doc-theme"),showToast("Tema reseteado")}};setTimeout(()=>{const saved=localStorage.getItem("wc-doc-theme");if(saved)try{const t=JSON.parse(saved),idx=WC_THEME_DOC.themes.findIndex(th=>th.name===t.name);idx>=0&&WC_THEME_DOC.apply(idx)}catch{}},2e3);function openDocThemePanel(){const old=document.getElementById("__themeDocPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__themeDocPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;padding:20px;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3A8} Temas del documento</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Colores para t\xEDtulos, fondos y acentos</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${WC_THEME_DOC.themes.map((t,i)=>`
        <button onclick="WC_THEME_DOC.apply(${i});document.getElementById('__themeDocPanel').remove()"
          style="padding:14px;border:2px solid ${t.primary}22;background:${t.bg};border-radius:12px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='${t.primary}'" onmouseout="this.style.borderColor='${t.primary}22'">
          <div style="display:flex;gap:6px;margin-bottom:6px">
            <div style="width:16px;height:16px;border-radius:50%;background:${t.primary}"></div>
            <div style="width:16px;height:16px;border-radius:50%;background:${t.secondary}"></div>
            <div style="width:16px;height:16px;border-radius:50%;background:${t.accent}"></div>
          </div>
          <div style="font-size:12px;font-weight:700;color:${t.text==="#e0e0e0"?"#333":t.text}">${t.name}</div>
        </button>`).join("")}
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="WC_THEME_DOC.reset();document.getElementById('__themeDocPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">\u21BA Resetear</button>
      <button onclick="document.getElementById('__themeDocPanel').remove()" style="flex:1;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function openPresentationMode(){const ed=document.getElementById("editor");if(!ed)return;const sections=[];let current={title:"Portada",content:[]};if(Array.from(ed.childNodes).forEach(node=>{const tag=node.tagName?.toLowerCase();tag==="h2"||tag==="h1"?(current.content.length>0&&sections.push(current),current={title:node.innerText||node.textContent,content:[]}):node.nodeType===1&&current.content.push(node.outerHTML)}),(current.content.length>0||sections.length===0)&&sections.push(current),!sections.length){showToast("Agreg\xE1 t\xEDtulos H2 para crear diapositivas");return}const old=document.getElementById("__presPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__presPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:#0a0a0a;display:flex;flex-direction:column;font-family:-apple-system,sans-serif";let slide=0;const total=sections.length,render=idx=>{const s=sections[idx],pct=Math.round((idx+1)/total*100);ov.innerHTML=`
      <!-- Barra de control -->
      <div style="background:rgba(0,0,0,.8);padding:10px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0">
        <button onclick="document.getElementById('__presPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px">\u2715 Salir</button>
        <span style="font-size:11px;color:#666">${idx+1} / ${total}</span>
        <div style="flex:1;background:rgba(255,255,255,.1);border-radius:3px;height:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:#0084ff;transition:width .3s"></div>
        </div>
        <button onclick="if(window.__presSlide>0){window.__presSlide--;__presRender(window.__presSlide)}" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:14px">\u2190</button>
        <button onclick="if(window.__presSlide<${total-1}){window.__presSlide++;__presRender(window.__presSlide)}" style="background:#0084ff;border:none;color:#fff;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:14px">\u2192</button>
      </div>

      <!-- Diapositiva -->
      <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px;overflow:auto">
        <div style="background:#fff;border-radius:16px;max-width:800px;width:100%;min-height:450px;padding:48px 56px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:32pt;font-weight:900;color:#003da5;margin-bottom:24px;line-height:1.2">${s.title}</div>
          <div style="font-size:13pt;color:#333;line-height:1.8">${s.content.slice(0,3).join("")}</div>
          <div style="margin-top:auto;padding-top:20px;font-size:9pt;color:#ddd;text-align:right">WC Corporate Editor \xB7 ${idx+1}/${total}</div>
        </div>
      </div>

      <!-- Miniaturas -->
      <div style="background:rgba(0,0,0,.8);padding:8px;display:flex;gap:6px;overflow-x:auto;flex-shrink:0;scrollbar-width:none">
        ${sections.map((sec,i)=>`
          <div onclick="window.__presSlide=${i};__presRender(${i})"
            style="flex-shrink:0;width:80px;height:50px;background:${i===idx?"#003da5":"rgba(255,255,255,.1)"};border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;border:2px solid ${i===idx?"#0084ff":"transparent"}">
            <div style="font-size:7px;color:#fff;text-align:center;overflow:hidden;text-overflow:ellipsis;line-height:1.3">${sec.title.slice(0,30)}</div>
          </div>`).join("")}
      </div>`};window.__presSlide=0,window.__presRender=render,window.__presSections=sections,document.body.appendChild(ov),render(0);const handler=e=>{e.key==="Escape"&&(ov.remove(),document.removeEventListener("keydown",handler)),e.key==="ArrowRight"&&window.__presSlide<total-1&&(window.__presSlide++,render(window.__presSlide)),e.key==="ArrowLeft"&&window.__presSlide>0&&(window.__presSlide--,render(window.__presSlide))};document.addEventListener("keydown",handler)}function openWhatsAppBusiness(){const old=document.getElementById("__waPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__waPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const templates=[{name:"Cotizaci\xF3n",icon:"\u{1F4B0}",text:`Estimado/a cliente,

Le adjunto nuestra cotizaci\xF3n por los servicios solicitados:

`},{name:"Seguimiento",icon:"\u{1F514}",text:`Buenos d\xEDas,

Le escribo para dar seguimiento a nuestra propuesta enviada anteriormente. \xBFTuvo oportunidad de revisarla?

`},{name:"Confirmaci\xF3n",icon:"\u2705",text:`Estimado/a,

Confirmamos la recepci\xF3n de su pedido/solicitud. Le estaremos contactando en las pr\xF3ximas 24 horas h\xE1biles.

`},{name:"Recordatorio",icon:"\u23F0",text:`Le recordamos que tiene una cita/reuni\xF3n programada para:

Fecha: ___
Hora: ___
Lugar: ___

`},{name:"Factura",icon:"\u{1F9FE}",text:`Estimado/a cliente,

Adjunto encontrar\xE1 la factura N\xB0 ___ por un monto de \u20A1___.

Forma de pago: SINPE M\xF3vil al ___

`},{name:"Personalizado",icon:"\u270F\uFE0F",text:""}];ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2);font-family:-apple-system,sans-serif">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp Business CR
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Mensajes profesionales con formato WhatsApp</div>

      <div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:12px;scrollbar-width:none;padding-bottom:2px">
        ${templates.map((t,i)=>`
          <button onclick="__waTemplate(${i})" class="__waTemplBtn"
            style="flex-shrink:0;padding:6px 12px;border:1.5px solid ${i===0?"#25d366":"#eee"};background:${i===0?"#f0fff4":"#fafafa"};color:${i===0?"#155724":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            ${t.icon} ${t.name}
          </button>`).join("")}
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px">
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">N\xFAmero de destino</label>
        <div style="display:flex;gap:6px">
          <select id="__waPais" style="padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;background:#fafafa">
            <option value="506">\u{1F1E8}\u{1F1F7} +506</option>
            <option value="1">\u{1F1FA}\u{1F1F8} +1</option>
            <option value="52">\u{1F1F2}\u{1F1FD} +52</option>
            <option value="57">\u{1F1E8}\u{1F1F4} +57</option>
          </select>
          <input type="tel" id="__waNum" placeholder="8888-1234"
            style="flex:1;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:13px;outline:none"
            onfocus="this.style.borderColor='#25d366'" onblur="this.style.borderColor='#eee'">
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Mensaje</label>
        <textarea id="__waMsg" rows="6"
          style="width:100%;padding:10px;border:1.5px solid #eee;border-radius:8px;font-size:13px;outline:none;resize:none;box-sizing:border-box;line-height:1.6"
          onfocus="this.style.borderColor='#25d366'" onblur="this.style.borderColor='#eee'"></textarea>
        <div style="display:flex;justify-content:space-between;margin-top:3px">
          <button onclick="document.getElementById('__waMsg').value=document.getElementById('editor')?.innerText?.slice(0,1000)||''" style="font-size:10px;color:#25d366;background:none;border:none;cursor:pointer">\u{1F4C4} Usar doc</button>
          <span id="__waCharCount" style="font-size:10px;color:#aaa">0 caracteres</span>
        </div>
      </div>
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__waPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__waSend()" style="flex:2;padding:10px;border:none;background:#25d366;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" style="vertical-align:middle;margin-right:4px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Enviar por WhatsApp
      </button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()});const waMsg=document.getElementById("__waMsg"),waTemplates=templates;waMsg&&(waMsg.addEventListener("input",()=>{const cnt=document.getElementById("__waCharCount");cnt&&(cnt.textContent=waMsg.value.length+" caracteres")}),waMsg.value=waTemplates[0].text),window.__waTemplates=templates}function __waTemplate(idx){const t=(window.__waTemplates||[])[idx],msg=document.getElementById("__waMsg"),btns=document.querySelectorAll(".__waTemplBtn");btns.forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel});const btn=btns[idx];btn&&(btn.style.borderColor="#25d366",btn.style.background="#f0fff4",btn.style.color="#155724",btn.dataset.sel="1"),msg&&t&&(t.text?msg.value=t.text:msg.value=document.getElementById("editor")?.innerText?.slice(0,1e3)||"")}function __waSend(){const pais=document.getElementById("__waPais")?.value||"506",num=(document.getElementById("__waNum")?.value||"").replace(/\D/g,""),msg=document.getElementById("__waMsg")?.value.trim();if(!num){showToast("Ingres\xE1 el n\xFAmero de WhatsApp");return}if(!msg){showToast("Escrib\xED el mensaje");return}const url=`https://wa.me/${pais}${num}?text=${encodeURIComponent(msg)}`;navigator.clipboard.writeText(msg).catch(()=>{}),window.open(url,"_blank"),document.getElementById("__waPanel").remove(),showToast("\u{1F4F1} Abriendo WhatsApp \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"aiAssist":openAIAssistPanel();break;case"tableGen":openTableGenerator();break;case"docTheme":openDocThemePanel();break;case"presMode":openPresentationMode();break;case"whatsappBiz":openWhatsAppBusiness();break;default:orig(a)}}),console.log("WC Corporate Editor v25.37 \u2705 \u2014 IA Asistente, Tablas, Temas, Presentaci\xF3n, WhatsApp")},4500)})();
