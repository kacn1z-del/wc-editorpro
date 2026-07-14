function openDocTranslator(){const old=document.getElementById("__transPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__transPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px";const langs=[["es","\u{1F1E8}\u{1F1F7} Espa\xF1ol"],["en","\u{1F1FA}\u{1F1F8} English"],["pt","\u{1F1E7}\u{1F1F7} Portugu\xEAs"],["fr","\u{1F1EB}\u{1F1F7} Fran\xE7ais"],["de","\u{1F1E9}\u{1F1EA} Deutsch"],["it","\u{1F1EE}\u{1F1F9} Italiano"],["ja","\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E"],["zh","\u{1F1E8}\u{1F1F3} \u4E2D\u6587"]],wordCount=ed?ed.innerText.trim().split(/\s+/).filter(w=>w).length:0;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F310} Traductor de documentos</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Documento actual: <strong>${wordCount} palabras</strong></div>

    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:16px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">De</label>
        <select id="__transFrom" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:9px;font-size:13px;outline:none">
          ${langs.map(([v,l])=>`<option value="${v}" ${v==="es"?"selected":""}>${l}</option>`).join("")}
        </select>
      </div>
      <button onclick="const f=document.getElementById('__transFrom'),t=document.getElementById('__transTo');const tmp=f.value;f.value=t.value;t.value=tmp" style="padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:16px;margin-top:16px">\u21C4</button>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">A</label>
        <select id="__transTo" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:9px;font-size:13px;outline:none">
          ${langs.map(([v,l])=>`<option value="${v}" ${v==="en"?"selected":""}>${l}</option>`).join("")}
        </select>
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Modo de traducci\xF3n</label>
      <div style="display:flex;gap:6px">
        ${[["replace","\u{1F504} Reemplazar documento"],["append","\u2795 Agregar al final"],["side","\u{1F4C4} Documento nuevo"]].map(([v,l],i)=>`
          <label style="flex:1;display:flex;align-items:center;gap:5px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:8px;font-size:11px;font-weight:600;color:${i===0?"#003da5":"#555"}">
            <input type="radio" name="__transMode" value="${v}" ${i===0?"checked":""} style="accent-color:#003da5"> ${l}
          </label>`).join("")}
      </div>
    </div>

    <div style="background:#fff9e6;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#856404;line-height:1.6">
      \u26A1 La traducci\xF3n se hace por p\xE1rrafos para mantener el formato. Requiere API Key de Groq.
    </div>

    <div id="__transProgress" style="display:none;background:#f0f7ff;border-radius:8px;padding:10px;margin-bottom:10px;text-align:center;color:#003da5;font-size:13px">
      \u{1F310} Traduciendo... <span id="__transProgressNum">0</span>%
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__transPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runDocTranslation()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F310} Traducir</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runDocTranslation(){const key=localStorage.getItem("wc-groq-key"),from=document.getElementById("__transFrom")?.value||"es",to=document.getElementById("__transTo")?.value||"en",mode=document.querySelector('[name="__transMode"]:checked')?.value||"replace",ed=document.getElementById("editor"),prog=document.getElementById("__transProgress"),num=document.getElementById("__transProgressNum");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}if(!ed)return;const langNames={es:"espa\xF1ol",en:"ingl\xE9s",pt:"portugu\xE9s",fr:"franc\xE9s",de:"alem\xE1n",it:"italiano",ja:"japon\xE9s",zh:"chino"},paragraphs=Array.from(ed.querySelectorAll("p,h1,h2,h3,h4,li")).filter(el=>el.innerText.trim().length>3);if(!paragraphs.length){showToast("No hay texto para traducir");return}prog&&(prog.style.display="block");const translated=[];for(let i=0;i<paragraphs.length;i++){const pct=Math.round(i/paragraphs.length*100);num&&(num.textContent=pct);const text=paragraphs[i].innerText.trim();try{const d=await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Traduc\xEDs de ${langNames[from]||from} a ${langNames[to]||to}. Solo devolv\xE9s la traducci\xF3n, sin explicaciones.`},{role:"user",content:text}],temperature:.1,max_tokens:500})})).json();translated.push({el:paragraphs[i],text:d?.choices?.[0]?.message?.content?.trim()||text})}catch{translated.push({el:paragraphs[i],text})}await new Promise(r=>setTimeout(r,200))}if(num&&(num.textContent="100"),prog&&(prog.style.display="none"),mode==="replace")translated.forEach(({el,text})=>{el.textContent=text}),document.getElementById("__transPanel").remove(),showToast(`\u2705 Documento traducido al ${langNames[to]||to}`);else if(mode==="append"){const sep=document.createElement("hr");sep.style.cssText="border:none;border-top:2px solid #003da5;margin:24px 0",ed.appendChild(sep);const title=document.createElement("h3");title.style.color="#003da5",title.textContent=`Traducci\xF3n al ${langNames[to]||to}`,ed.appendChild(title),translated.forEach(({el,text})=>{const clone=el.cloneNode(!1);clone.textContent=text,ed.appendChild(clone)}),document.getElementById("__transPanel").remove(),showToast("\u2705 Traducci\xF3n agregada al documento")}else{const html=translated.map(({el,text})=>{const tag=el.tagName.toLowerCase();return`<${tag}>${text}</${tag}>`}).join(`
`);typeof insertHTML=="function"&&insertHTML('<hr style="border-top:2px solid #003da5;margin:20px 0">'+html),document.getElementById("__transPanel").remove(),showToast("\u2705 Traducci\xF3n insertada")}}function openBudgetGenerator(){const old=document.getElementById("__budgPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__budgPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const num=String(parseInt(localStorage.getItem("wc-budg-num")||"0")+1).padStart(4,"0");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#27ae60,#2ecc71);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700">\u{1F4B0} Presupuesto N\xB0 ${num}</div>
      <div style="font-size:11px;opacity:.8;margin-top:2px">Costa Rica \xB7 IVA 13%</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${[["__budgProf","Empresa / Profesional *","Mi Empresa S.A."],["__budgCed","C\xE9dula Jur\xEDdica","3-101-123456"],["__budgClient","Cliente *","Empresa Cliente"],["__budgCedClient","C\xE9dula cliente","1-2345-6789"],["__budgValido","V\xE1lido por","30 d\xEDas"],["__budgPago","Condiciones de pago","50% inicio \xB7 50% entrega"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join("")}
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">L\xEDneas del presupuesto</label>
        <div style="display:grid;grid-template-columns:3fr 1fr 1fr auto;gap:6px;margin-bottom:6px">
          <input type="text" id="__budgLineDesc" placeholder="Descripci\xF3n del servicio" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box">
          <input type="number" id="__budgLineCant" placeholder="Cant" value="1" min="1" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
          <input type="number" id="__budgLinePrice" placeholder="Precio \u20A1" step="100" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
          <button onclick="__budgAddLine()" style="padding:7px 10px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:13px">+</button>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:8px">
          <select id="__budgIVA" style="flex:1;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="13">IVA 13%</option>
            <option value="0" selected>Sin IVA</option>
            <option value="4">IVA 4%</option>
          </select>
          <select id="__budgUnit" style="flex:1;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option>Unidad</option><option>Hora</option><option>Mes</option><option>Proyecto</option><option>m\xB2</option>
          </select>
        </div>
        <div id="__budgLines" style="max-height:150px;overflow-y:auto"></div>
      </div>

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Notas / T\xE9rminos</label>
        <textarea id="__budgNotas" rows="2" placeholder="Este presupuesto no incluye... \xB7 Los precios est\xE1n sujetos a..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"></textarea>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__budgPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateBudget('${num}')" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4B0} Generar presupuesto</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__budgLines=[]}function __budgAddLine(){const desc=document.getElementById("__budgLineDesc")?.value.trim(),cant=parseFloat(document.getElementById("__budgLineCant")?.value)||1,price=parseFloat(document.getElementById("__budgLinePrice")?.value)||0,iva=parseInt(document.getElementById("__budgIVA")?.value)||0,unit=document.getElementById("__budgUnit")?.value||"Unidad";if(!desc||!price){showToast("Complet\xE1 descripci\xF3n y precio");return}window.__budgLines||(window.__budgLines=[]),window.__budgLines.push({desc,cant,price,iva,unit,sub:cant*price}),__budgRenderLines(),document.getElementById("__budgLineDesc").value="",document.getElementById("__budgLinePrice").value=""}function __budgRenderLines(){const box=document.getElementById("__budgLines"),lines=window.__budgLines||[];if(!box)return;const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR");let subtotal=0,ivaTotal=0;box.innerHTML=lines.map((l,i)=>{const lineIVA=l.sub*l.iva/100;return subtotal+=l.sub,ivaTotal+=lineIVA,`<div style="display:flex;gap:6px;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:11px;align-items:center">
      <div style="flex:2;color:#333">${l.desc} (\xD7${l.cant} ${l.unit})</div>
      <div style="color:#555">${l.iva?`+${l.iva}%`:""}</div>
      <div style="font-weight:600;color:#27ae60">${fmt(l.sub+lineIVA)}</div>
      <button onclick="window.__budgLines.splice(${i},1);__budgRenderLines()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:13px;padding:0">\xD7</button>
    </div>`}).join("")+(lines.length?`<div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;font-size:12px;color:#27ae60"><span>TOTAL</span><span>${fmt(subtotal+ivaTotal)}</span></div>`:""),window.__budgTotals={subtotal,ivaTotal,total:subtotal+ivaTotal}}function __generateBudget(num){const lines=window.__budgLines||[];if(!lines.length){showToast("Agreg\xE1 al menos una l\xEDnea");return}const g=id=>document.getElementById(id)?.value?.trim()||"",fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),t=window.__budgTotals||{},fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});localStorage.setItem("wc-budg-num",String(parseInt(num)));const html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:580px;margin:12px auto;border:2px solid #27ae60;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#27ae60,#2ecc71);color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-size:18pt;font-weight:900">PRESUPUESTO</div><div style="font-size:9pt;opacity:.8">N\xB0 ${num}</div></div>
      <div style="text-align:right;font-size:9pt;opacity:.85"><div>${fecha}</div><div>V\xE1lido: ${g("__budgValido")||"30 d\xEDas"}</div></div>
    </div>
    <div style="padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;border-bottom:1px solid #eee;font-size:10pt">
      <div><div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:3px">DE:</div><div style="font-weight:700">${g("__budgProf")}</div><div style="color:#555">${g("__budgCed")}</div></div>
      <div><div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:3px">PARA:</div><div style="font-weight:700">${g("__budgClient")}</div><div style="color:#555">${g("__budgCedClient")}</div></div>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0fff4"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Descripci\xF3n</th><th style="padding:7px 10px;border:1px solid #ddd">Cant</th><th style="padding:7px 10px;border:1px solid #ddd">Precio</th><th style="padding:7px 10px;border:1px solid #ddd">IVA</th><th style="padding:7px 10px;border:1px solid #ddd">Total</th></tr>
      ${lines.map((l,i)=>`<tr style="${i%2?"background:#fafafa":""}"><td style="padding:6px 10px;border:1px solid #ddd">${l.desc}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${l.cant} ${l.unit}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${fmt(l.price)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${l.iva?l.iva+"%":"\u2014"}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(l.sub+l.sub*l.iva/100)}</td></tr>`).join("")}
      ${t.ivaTotal?`<tr style="background:#f8f9fa"><td colspan="4" style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#888">Subtotal</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${fmt(t.subtotal)}</td></tr><tr style="background:#f8f9fa"><td colspan="4" style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">IVA</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">${fmt(t.ivaTotal)}</td></tr>`:""}
      <tr style="background:#27ae60;color:#fff"><td colspan="4" style="padding:8px 10px;font-weight:700">TOTAL</td><td style="padding:8px 10px;text-align:right;font-weight:700;font-size:13pt">${fmt(t.total||0)}</td></tr>
    </table>
    ${g("__budgPago")||g("__budgNotas")?`<div style="padding:10px 16px;font-size:9pt;color:#555;border-top:1px solid #eee">${g("__budgPago")?`<div><strong>Pago:</strong> ${g("__budgPago")}</div>`:""}${g("__budgNotas")?`<div style="margin-top:4px">${g("__budgNotas")}</div>`:""}</div>`:""}
    <div style="padding:6px 16px;background:#f8f9fa;font-size:8pt;color:#aaa;text-align:center">WC Corporate Editor \xB7 Costa Rica \xB7 Este presupuesto no es una factura</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__budgPanel").remove(),showToast(`\u{1F4B0} Presupuesto N\xB0 ${num} generado \u2705`)}function openAdvancedStats(){const old=document.getElementById("__advStatsPanel");old&&old.remove();const ed=document.getElementById("editor");if(!ed)return;const text=ed.innerText.trim(),words=text.split(/\s+/).filter(w=>w),chars=text.length,sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>3).length,paragraphs=text.split(`

`).filter(p=>p.trim()).length,headings=ed.querySelectorAll("h1,h2,h3").length,images=ed.querySelectorAll("img").length,links=ed.querySelectorAll("a").length,tables=ed.querySelectorAll("table").length,readTime=Math.max(1,Math.round(words.length/250)),speakTime=Math.max(1,Math.round(words.length/130)),stopwords=new Set(["de","la","el","en","y","a","los","del","las","un","una","que","por","con","se","su","al","es","no","lo","para","como","m\xE1s","pero","o","sin","sobre","este","entre","cuando","muy","tambi\xE9n","hasta","hay","donde","quien","desde","todo","nos","durante","ni","contra","bajo","ante","seg\xFAn","mediante","fue","ser","han","era","son","est\xE1","su","si"]),freq={};words.forEach(w=>{const c=w.toLowerCase().replace(/[^a-záéíóúüñ]/gi,"");c.length>3&&!stopwords.has(c)&&(freq[c]=(freq[c]||0)+1)});const topWords=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8),avgWords=sentences>0?Math.round(words.length/sentences):0,avgChars=words.length>0?Math.round(chars/words.length):0,flesch=Math.max(0,Math.min(100,206.835-1.015*avgWords-84.6*avgChars/5)),legLevel=flesch>70?"F\xE1cil":flesch>50?"Moderado":flesch>30?"Dif\xEDcil":"Muy dif\xEDcil",legColor=flesch>70?"#27ae60":flesch>50?"#f39c12":"#e74c3c",ov=document.createElement("div");ov.id="__advStatsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CA} Estad\xEDsticas avanzadas</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">An\xE1lisis completo del documento</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px 16px">
      <!-- M\xE9tricas -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
        ${[["\u{1F4DD}",words.length.toLocaleString(),"palabras","#0084ff"],["\u{1F524}",chars.toLocaleString(),"caracteres","#9b59b6"],["\u{1F4AC}",sentences,"oraciones","#27ae60"],["\xB6",paragraphs,"p\xE1rrafos","#f39c12"]].map(([icon,val,label,color])=>`
          <div style="background:#f8f9fa;border-radius:12px;padding:10px;text-align:center">
            <div style="font-size:18px;margin-bottom:2px">${icon}</div>
            <div style="font-size:16px;font-weight:800;color:${color}">${val}</div>
            <div style="font-size:9px;color:#aaa">${label}</div>
          </div>`).join("")}
      </div>

      <!-- Legibilidad -->
      <div style="background:#f0f7ff;border-radius:12px;padding:14px;margin-bottom:14px">
        <div style="font-size:12px;font-weight:700;color:#0084ff;margin-bottom:10px">\u{1F4D6} Legibilidad</div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
          <div style="text-align:center">
            <div style="font-size:28px;font-weight:900;color:${legColor}">${Math.round(flesch)}</div>
            <div style="font-size:10px;color:#aaa">Flesch</div>
          </div>
          <div style="flex:1">
            <div style="height:10px;background:#eee;border-radius:5px;overflow:hidden;margin-bottom:6px">
              <div style="height:100%;width:${flesch}%;background:${legColor};border-radius:5px;transition:width .5s"></div>
            </div>
            <div style="font-size:13px;font-weight:700;color:${legColor}">${legLevel}</div>
            <div style="font-size:10px;color:#888">Promedio ${avgWords} palabras/oraci\xF3n</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center">
          <div style="background:#fff;border-radius:8px;padding:8px"><div style="font-size:14px;font-weight:700;color:#003da5">${readTime} min</div><div style="font-size:9px;color:#aaa">Lectura</div></div>
          <div style="background:#fff;border-radius:8px;padding:8px"><div style="font-size:14px;font-weight:700;color:#003da5">${speakTime} min</div><div style="font-size:9px;color:#aaa">Voz alta</div></div>
          <div style="background:#fff;border-radius:8px;padding:8px"><div style="font-size:14px;font-weight:700;color:#003da5">${headings}</div><div style="font-size:9px;color:#aaa">T\xEDtulos</div></div>
        </div>
      </div>

      <!-- Elementos -->
      ${images||tables||links?`
      <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">\u{1F5BC}\uFE0F Elementos multimedia</div>
        <div style="display:flex;gap:14px;flex-wrap:wrap">
          ${images?`<div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#e74c3c">${images}</div><div style="font-size:10px;color:#aaa">im\xE1genes</div></div>`:""}
          ${tables?`<div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#27ae60">${tables}</div><div style="font-size:10px;color:#aaa">tablas</div></div>`:""}
          ${links?`<div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#0084ff">${links}</div><div style="font-size:10px;color:#aaa">enlaces</div></div>`:""}
        </div>
      </div>`:""}

      <!-- Top palabras -->
      ${topWords.length?`
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">\u{1F524} Palabras m\xE1s usadas</div>
        ${topWords.map(([word,count])=>`
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <div style="font-size:11px;color:#333;min-width:100px">${word}</div>
            <div style="flex:1;background:#eee;border-radius:3px;height:8px;overflow:hidden"><div style="height:100%;background:#0084ff;width:${Math.round(count/topWords[0][1]*100)}%;border-radius:3px"></div></div>
            <div style="font-size:10px;color:#aaa;min-width:20px;text-align:right">${count}</div>
          </div>`).join("")}
      </div>`:""}

      <button onclick="__statsInsertReport(${Math.round(flesch)},'${legLevel}','${legColor}',${words.length},${chars},${readTime})" style="width:100%;padding:9px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Insertar reporte</button>
    </div>

    <div style="padding:10px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__advStatsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __statsInsertReport(flesch,legLevel,legColor,words,chars,readTime){const html=`<div style="background:#f0f7ff;border:2px solid #0084ff;border-radius:8px;padding:12px;margin:10px 0;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:12pt;font-weight:700;color:#003da5;margin-bottom:8px">\u{1F4CA} Estad\xEDsticas del documento</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;font-size:10pt">
      <div><strong style="color:#0084ff">${words.toLocaleString()}</strong><br><small>palabras</small></div>
      <div><strong style="color:#9b59b6">${chars.toLocaleString()}</strong><br><small>caracteres</small></div>
      <div><strong style="color:#27ae60">${readTime} min</strong><br><small>lectura</small></div>
      <div><strong style="color:${legColor}">${legLevel}</strong><br><small>legibilidad</small></div>
    </div>
    <div style="font-size:8pt;color:#aaa;margin-top:6px;text-align:right">${new Date().toLocaleString("es-CR")} \xB7 WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__advStatsPanel").remove(),showToast("\u{1F4CA} Reporte insertado \u2705")}const WC_ZEN={active:!1,wordGoal:0,startWords:0,timer:null,elapsed:0,open(){const ed=document.getElementById("editor");if(!ed)return;const old=document.getElementById("__zenPanel");old&&old.remove(),this.startWords=ed.innerText.split(/\s+/).filter(w=>w).length,this.active=!0,this.elapsed=0,this.timer=setInterval(()=>{this.elapsed++,this._updateHUD()},1e3);const ov=document.createElement("div");ov.id="__zenPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:#1a1a1a;display:flex;flex-direction:column;align-items:center;justify-content:center";const goalInput=this.wordGoal||500;ov.innerHTML=`
      <!-- HUD superior -->
      <div id="__zenHUD" style="position:fixed;top:0;left:0;right:0;padding:8px 20px;display:flex;justify-content:space-between;align-items:center;opacity:0;transition:opacity .3s;background:rgba(0,0,0,.5)">
        <button onclick="WC_ZEN.close()" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px">\u2715 Salir</button>
        <div style="display:flex;gap:16px;font-size:12px;color:rgba(255,255,255,.7)">
          <span id="__zenWords">0 palabras escritas</span>
          <span id="__zenTime">00:00</span>
          <span id="__zenWPM">0 wpm</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="number" id="__zenGoal" value="${goalInput}" placeholder="Meta" min="0"
            style="width:70px;padding:4px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:5px;color:#fff;font-size:11px;outline:none;text-align:center"
            onchange="WC_ZEN.wordGoal=parseInt(this.value)||0;WC_ZEN._updateHUD()">
          <span style="font-size:11px;color:rgba(255,255,255,.5)">meta</span>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div id="__zenProgress" style="position:fixed;top:0;left:0;height:3px;background:#0084ff;width:0%;transition:width .5s;z-index:1"></div>

      <!-- \xC1rea de escritura -->
      <div style="width:100%;max-width:720px;padding:20px;height:100vh;display:flex;flex-direction:column;justify-content:center">
        <div id="__zenEditor" contenteditable="true"
          style="color:#fff;font-size:18px;line-height:1.8;outline:none;min-height:200px;caret-color:#0084ff;font-family:Georgia,'Times New Roman',serif"
          placeholder="Empez\xE1 a escribir..."
          oninput="WC_ZEN._onInput(this)">
          ${ed.innerHTML}
        </div>
      </div>

      <!-- Indicador de meta -->
      <div id="__zenGoalBadge" style="position:fixed;bottom:20px;right:20px;background:rgba(0,132,255,.2);border:1px solid rgba(0,132,255,.4);border-radius:20px;padding:6px 14px;font-size:12px;color:#0084ff;display:none"></div>
    `,document.body.appendChild(ov),ov.addEventListener("mousemove",()=>{const h=document.getElementById("__zenHUD");h&&(h.style.opacity="1"),clearTimeout(this._hudTimer),this._hudTimer=setTimeout(()=>{const h2=document.getElementById("__zenHUD");h2&&(h2.style.opacity="0")},3e3)}),ov.addEventListener("touchstart",()=>{const h=document.getElementById("__zenHUD");h&&(h.style.opacity="1"),clearTimeout(this._hudTimer),this._hudTimer=setTimeout(()=>{const h2=document.getElementById("__zenHUD");h2&&(h2.style.opacity="0")},3e3)},{passive:!0}),document.getElementById("__zenEditor")?.focus(),this._keyHandler=e=>{e.key==="Escape"&&this.close()},document.addEventListener("keydown",this._keyHandler)},_onInput(el){const words=el.innerText.split(/\s+/).filter(w=>w).length,written=Math.max(0,words-this.startWords);if(this.wordGoal>0){const pct=Math.min(100,Math.round(written/this.wordGoal*100)),pr=document.getElementById("__zenProgress");pr&&(pr.style.width=pct+"%");const badge=document.getElementById("__zenGoalBadge");badge&&(badge.style.display="block",badge.textContent=`${written}/${this.wordGoal} palabras`),written>=this.wordGoal&&showToast("\u{1F389} \xA1Meta alcanzada!")}this._updateHUD()},_updateHUD(){const zenEd=document.getElementById("__zenEditor"),words=zenEd?zenEd.innerText.split(/\s+/).filter(w=>w).length:0,written=Math.max(0,words-this.startWords),mins=Math.floor(this.elapsed/60),secs=this.elapsed%60,wpm=this.elapsed>10?Math.round(written/(this.elapsed/60)):0,wEl=document.getElementById("__zenWords"),tEl=document.getElementById("__zenTime"),pEl=document.getElementById("__zenWPM");wEl&&(wEl.textContent=`${written} palabras escritas`),tEl&&(tEl.textContent=`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`),pEl&&(pEl.textContent=`${wpm} wpm`)},close(){clearInterval(this.timer),document.removeEventListener("keydown",this._keyHandler);const zenEd=document.getElementById("__zenEditor"),ed=document.getElementById("editor");zenEd&&ed&&(ed.innerHTML=zenEd.innerHTML),document.getElementById("__zenPanel")?.remove(),this.active=!1,showToast("\u{1F9D8} Modo zen cerrado \xB7 Contenido guardado")}};function openZenMode(){WC_ZEN.open()}function openHTMLExport(){const old=document.getElementById("__htmlExPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__htmlExPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4E6} Exportar HTML standalone</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Genera un archivo HTML que funciona sin conexi\xF3n</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">T\xEDtulo del documento</label>
        <input type="text" id="__htmlTitle" placeholder="Mi documento" value="${document.title||"Documento WC"}"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[["__htmlInclCSS","Incluir estilos CSS del editor"],["__htmlInclMeta","Metadatos (autor, fecha, descripci\xF3n)"],["__htmlInclPrint","Estilos de impresi\xF3n"],["__htmlInclResponsive","Dise\xF1o responsive (m\xF3vil)"]].map(([id,label])=>`
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
            <input type="checkbox" id="${id}" checked style="accent-color:#0084ff;width:14px;height:14px"> ${label}
          </label>`).join("")}
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Color de acento</label>
        <div style="display:flex;gap:6px">
          ${["#003da5","#1a2942","#27ae60","#e74c3c","#9b59b6","#f39c12"].map(c=>`
            <button onclick="window.__htmlAccent='${c}';document.querySelectorAll('.__htmlColorBtn').forEach(b=>b.style.outline='none');this.style.outline='3px solid ${c}'"
              class="__htmlColorBtn"
              style="width:28px;height:28px;border-radius:50%;background:${c};border:none;cursor:pointer;${c==="#003da5"?"outline:3px solid #003da5":""}"></button>`).join("")}
        </div>
      </div>
    </div>

    <div style="background:#f0f7ff;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.7">
      \u{1F4C4} Genera un archivo <strong>.html</strong> aut\xF3nomo que pod\xE9s abrir en cualquier navegador sin necesidad de internet.
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__htmlExPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateHTMLStandalone()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4E5} Descargar HTML</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__htmlAccent="#003da5"}function __generateHTMLStandalone(){const ed=document.getElementById("editor");if(!ed)return;const title=document.getElementById("__htmlTitle")?.value.trim()||"Documento",accent=window.__htmlAccent||"#003da5",inclCSS=document.getElementById("__htmlInclCSS")?.checked,inclMeta=document.getElementById("__htmlInclMeta")?.checked,inclPrint=document.getElementById("__htmlInclPrint")?.checked,inclResp=document.getElementById("__htmlInclResponsive")?.checked,fecha=new Date().toLocaleString("es-CR"),css=inclCSS?`
    body { font-family: Calibri, Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; max-width: 21cm; margin: 0 auto; padding: 2.54cm; }
    h1 { font-size: 28pt; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 8px; }
    h2 { font-size: 16pt; color: ${accent}; }
    h3 { font-size: 13pt; color: #1a2942; }
    table { border-collapse: collapse; width: 100%; }
    td, th { padding: 8px; border: 1px solid #ddd; }
    th { background: ${accent}; color: #fff; }
    a { color: ${accent}; }
    blockquote { border-left: 4px solid ${accent}; margin-left: 0; padding-left: 16px; color: #555; }
    img { max-width: 100%; border-radius: 4px; }
    ${inclResp?"@media(max-width:600px){body{padding:16px;}}":""}
    ${inclPrint?"@media print{body{max-width:none;padding:1cm;}h1,h2,h3{page-break-after:avoid;}table{page-break-inside:avoid;}}":""}
  `:"",meta=inclMeta?`
    <meta name="author" content="Keny Chinchilla Navarro \xB7 WC Corporate Editor">
    <meta name="description" content="${title}">
    <meta name="date" content="${fecha}">
    <meta property="og:title" content="${title}">
  `:"",html=`<!DOCTYPE html>
<html lang="es-CR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${meta}
  <style>${css}
    /* Generado con WC Corporate Editor \xB7 Costa Rica \xB7 ${fecha} */
  </style>
</head>
<body>
  ${ed.innerHTML}
  <footer style="margin-top:40px;padding-top:12px;border-top:1px solid #eee;font-size:9pt;color:#aaa;text-align:center">
    Generado con WC Corporate Editor \xB7 Costa Rica \xB7 ${fecha}
  </footer>
</body>
</html>`,blob=new Blob([html],{type:"text/html;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=title.replace(/\s+/g,"-").toLowerCase()+".html",a.click(),document.getElementById("__htmlExPanel").remove(),showToast("\u{1F4E5} HTML standalone descargado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"docTranslator":openDocTranslator();break;case"budgetGen":openBudgetGenerator();break;case"advancedStats":openAdvancedStats();break;case"zenMode":openZenMode();break;case"htmlExport":openHTMLExport();break;default:orig(a)}}),console.log("WC Corporate Editor v25.36 \u2705 \u2014 Traductor, Presupuesto, Stats, Zen, HTML Export")},4400)})();
