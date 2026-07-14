function openSignatureCanvas(){const old=document.getElementById("__sigPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__sigPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u270D\uFE0F Firma electr\xF3nica</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Dibuj\xE1 tu firma con el dedo o el mouse</div>

    <div style="margin-bottom:10px">
      <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
        <label style="font-size:11px;font-weight:700;color:#555;align-self:center">Color:</label>
        ${["#000000","#003da5","#1a2942","#27ae60","#e74c3c"].map(c=>`
          <button onclick="window.__sigColor='${c}';document.querySelectorAll('.__sigColorBtn').forEach(b=>b.style.outline='none');this.style.outline='3px solid ${c}'" class="__sigColorBtn"
            style="width:24px;height:24px;border-radius:50%;background:${c};border:none;cursor:pointer;${c==="#000000"?"outline:3px solid #000":""};transition:all .15s"></button>`).join("")}
        <label style="font-size:11px;font-weight:700;color:#555;align-self:center;margin-left:8px">Grosor:</label>
        <input type="range" id="__sigSize" min="1" max="6" value="2" style="width:80px;accent-color:#003da5">
      </div>
      <canvas id="__sigCanvas" width="436" height="180"
        style="border:2px solid #e0e0e0;border-radius:10px;cursor:crosshair;touch-action:none;width:100%;background:#fafafa;display:block"></canvas>
      <div style="font-size:10px;color:#bbb;text-align:center;margin-top:4px">Dibuj\xE1 tu firma arriba</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Nombre (opcional)</label>
        <input type="text" id="__sigName" placeholder="Juan P\xE9rez"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cargo</label>
        <input type="text" id="__sigCargo" placeholder="Gerente General"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="__sigClear()" style="flex:1;padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">\u{1F5D1} Borrar</button>
      <button onclick="document.getElementById('__sigPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__sigInsert()" style="flex:2;padding:10px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u270D\uFE0F Insertar firma</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__sigColor="#000000",window.__sigDrawing=!1,setTimeout(()=>{const canvas=document.getElementById("__sigCanvas");if(!canvas)return;const ctx=canvas.getContext("2d");ctx.strokeStyle=window.__sigColor,ctx.lineWidth=2,ctx.lineCap="round",ctx.lineJoin="round";const getPos=e=>{const rect=canvas.getBoundingClientRect(),scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height,client=e.touches?e.touches[0]:e;return{x:(client.clientX-rect.left)*scaleX,y:(client.clientY-rect.top)*scaleY}};canvas.addEventListener("mousedown",e=>{window.__sigDrawing=!0;const p=getPos(e);ctx.beginPath(),ctx.moveTo(p.x,p.y)}),canvas.addEventListener("mousemove",e=>{if(!window.__sigDrawing)return;const p=getPos(e);ctx.strokeStyle=window.__sigColor,ctx.lineWidth=parseInt(document.getElementById("__sigSize")?.value||2),ctx.lineTo(p.x,p.y),ctx.stroke()}),canvas.addEventListener("mouseup",()=>{window.__sigDrawing=!1}),canvas.addEventListener("touchstart",e=>{e.preventDefault(),window.__sigDrawing=!0;const p=getPos(e);ctx.beginPath(),ctx.moveTo(p.x,p.y)},{passive:!1}),canvas.addEventListener("touchmove",e=>{if(e.preventDefault(),!window.__sigDrawing)return;const p=getPos(e);ctx.strokeStyle=window.__sigColor,ctx.lineWidth=parseInt(document.getElementById("__sigSize")?.value||2),ctx.lineTo(p.x,p.y),ctx.stroke()},{passive:!1}),canvas.addEventListener("touchend",()=>{window.__sigDrawing=!1})},100)}function __sigClear(){const canvas=document.getElementById("__sigCanvas");canvas&&canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height)}function __sigInsert(){const canvas=document.getElementById("__sigCanvas");if(!canvas)return;const dataURL=canvas.toDataURL("image/png"),name=document.getElementById("__sigName")?.value.trim()||"",cargo=document.getElementById("__sigCargo")?.value.trim()||"",fecha=new Date().toLocaleDateString("es-CR"),html=`
  <div style="display:inline-block;border-top:1px solid #333;padding-top:8px;margin-top:30px;text-align:center;font-family:Calibri,Arial,sans-serif">
    <img src="${dataURL}" alt="Firma electr\xF3nica" style="max-width:200px;max-height:80px;display:block;margin:0 auto 4px">
    ${name?`<div style="font-size:11pt;font-weight:600">${name}</div>`:""}
    ${cargo?`<div style="font-size:10pt;color:#555">${cargo}</div>`:""}
    <div style="font-size:9pt;color:#aaa">${fecha}</div>
    <div style="font-size:8pt;color:#bbb">Firma electr\xF3nica \xB7 WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__sigPanel").remove(),showToast("\u270D\uFE0F Firma insertada \u2705")}function openQRGenerator(){const old=document.getElementById("__qrGenPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__qrGenPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4F1} Generador de QR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">C\xF3digos QR personalizados</div>

    <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
      ${[["url","\u{1F517} URL"],["whatsapp","\u{1F4AC} WhatsApp"],["email","\u{1F4E7} Email"],["tel","\u{1F4DE} Tel\xE9fono"],["texto","\u{1F4DD} Texto"],["vcard","\u{1F464} vCard"]].map(([v,l],i)=>`
        <button onclick="__qrType='${v}';document.querySelectorAll('.__qrTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';});this.style.borderColor='#1a2942';this.style.background='#f0f7ff';__qrUpdatePlaceholder()" class="__qrTypeBtn"
          style="padding:5px 10px;border:1.5px solid ${i===0?"#1a2942":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s">
          ${l}
        </button>`).join("")}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Contenido del QR *</label>
      <input type="text" id="__qrContent" placeholder="https://kacn1z-del.github.io/wc-editorpro"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__qrGenerate()">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Color del QR</label>
        <input type="color" id="__qrColor" value="#000000" style="width:100%;height:36px;border:1.5px solid #eee;border-radius:8px;cursor:pointer" oninput="__qrGenerate()">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tama\xF1o</label>
        <select id="__qrSize" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none" onchange="__qrGenerate()">
          <option value="150">Peque\xF1o (150px)</option>
          <option value="200" selected>Mediano (200px)</option>
          <option value="300">Grande (300px)</option>
        </select>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:14px;min-height:210px;display:flex;align-items:center;justify-content:center">
      <div id="__qrPreview" style="background:#f8f9fa;border-radius:12px;padding:16px;display:inline-block">
        <div style="color:#bbb;font-size:12px">Ingres\xE1 contenido para generar</div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__qrGenPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__qrDownload()" style="flex:1;padding:10px;border:1.5px solid #1a2942;background:#fff;color:#1a2942;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4BE} Descargar</button>
      <button onclick="__qrInsertDoc()" style="flex:1;padding:10px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4E5} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__qrType="url"}function __qrUpdatePlaceholder(){const inp=document.getElementById("__qrContent");if(!inp)return;const placeholders={url:"https://kacn1z-del.github.io/wc-editorpro",whatsapp:"50688881234",email:"contacto@empresa.cr",tel:"+50688881234",texto:"Tu mensaje aqu\xED",vcard:`BEGIN:VCARD
FN:Juan P\xE9rez
TEL:+50688881234
END:VCARD`};inp.placeholder=placeholders[window.__qrType]||""}function __qrGenerate(){const content=document.getElementById("__qrContent")?.value.trim(),color=document.getElementById("__qrColor")?.value||"#000000",size=parseInt(document.getElementById("__qrSize")?.value)||200,prev=document.getElementById("__qrPreview");if(!content||!prev)return;let qrData=content;window.__qrType==="whatsapp"&&(qrData="https://wa.me/"+content.replace(/\D/g,"")),window.__qrType==="email"&&(qrData="mailto:"+content),window.__qrType==="tel"&&(qrData="tel:"+content);const colorHex=color.replace("#",""),url=`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}&color=${colorHex}&bgcolor=ffffff&qzone=1&format=png`;prev.innerHTML=`<img id="__qrImg" src="${url}" alt="QR Code" style="border-radius:8px;display:block" width="${size}" height="${size}" crossorigin="anonymous">`,window.__qrURL=url,window.__qrData=qrData}function __qrDownload(){const url=window.__qrURL;if(!url){showToast("Gener\xE1 un QR primero");return}const a=document.createElement("a");a.href=url,a.download="qr-code.png",a.target="_blank",a.click(),showToast("\u{1F4BE} QR descargado \u2705")}function __qrInsertDoc(){const url=window.__qrURL,data=window.__qrData;if(!url){showToast("Gener\xE1 un QR primero");return}const size=parseInt(document.getElementById("__qrSize")?.value)||200,html=`<figure style="display:inline-block;text-align:center;margin:10px"><img src="${url}" alt="QR Code" style="border-radius:6px;display:block" width="${size}"><figcaption style="font-size:9pt;color:#888;margin-top:4px">\u{1F4F1} ${data.slice(0,40)}${data.length>40?"...":""}</figcaption></figure>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__qrGenPanel").remove(),showToast("\u{1F4F1} QR insertado \u2705")}const WC_SEARCH_HIST={history:JSON.parse(localStorage.getItem("wc-search-hist")||"[]"),save(){localStorage.setItem("wc-search-hist",JSON.stringify(this.history.slice(0,50)))},add(q){this.history=[q,...this.history.filter(h=>h!==q)].slice(0,50),this.save()},clear(){this.history=[],this.save()}};function openSearchHistory(){const old=document.getElementById("__srchHistPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__srchHistPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const ed=document.getElementById("editor");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F50D} B\xFAsqueda en el documento</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Buscar y resaltar texto</div>

      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input type="text" id="__srchInput" placeholder="Buscar..."
          style="flex:1;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__srchLive(this.value)" onkeydown="if(event.key==='Enter')__srchFind()">
        <button onclick="__srchFind()" style="padding:10px 16px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F50D}</button>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:12px;align-items:center">
        <input type="text" id="__srchReplace" placeholder="Reemplazar con..."
          style="flex:1;padding:8px 12px;border:1.5px solid #eee;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#eee'">
        <button onclick="__srchReplaceOne()" style="padding:8px 10px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;white-space:nowrap">1 vez</button>
        <button onclick="__srchReplaceAll()" style="padding:8px 10px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap">Todo</button>
      </div>

      <div id="__srchResults" style="font-size:11px;color:#888;margin-bottom:10px"></div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#555"><input type="checkbox" id="__srchCase" style="accent-color:#0084ff"> May\xFAsculas</label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#555"><input type="checkbox" id="__srchWord" style="accent-color:#0084ff"> Palabra exacta</label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#555"><input type="checkbox" id="__srchRegex" style="accent-color:#0084ff"> Regex</label>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px">
      ${WC_SEARCH_HIST.history.length?`
      <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;display:flex;justify-content:space-between">
        <span>Historial</span>
        <button onclick="WC_SEARCH_HIST.clear();openSearchHistory()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:10px;font-weight:600">Limpiar</button>
      </div>
      ${WC_SEARCH_HIST.history.map(h=>`
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f5f5f5;cursor:pointer"
          onclick="document.getElementById('__srchInput').value='${h.replace(/'/g,"\\'")}';__srchFind()">
          <span style="color:#bbb;font-size:14px">\u{1F550}</span>
          <span style="flex:1;font-size:13px;color:#333">${h}</span>
          <span style="font-size:12px;color:#aaa">\u2192</span>
        </div>`).join("")}`:'<div style="text-align:center;padding:20px;color:#bbb;font-size:13px">Sin historial de b\xFAsquedas</div>'}
    </div>

    <div style="padding:12px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="__srchClear();document.getElementById('__srchHistPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&(__srchClear(),ov.remove())}),setTimeout(()=>document.getElementById("__srchInput")?.focus(),100),window.__srchMatches=[],window.__srchIdx=0}function __srchLive(q){if(q.length<2){__srchClear();return}clearTimeout(window.__srchTimer),window.__srchTimer=setTimeout(()=>__srchFind(!0),400)}function __srchFind(live){const q=document.getElementById("__srchInput")?.value,cs=document.getElementById("__srchCase")?.checked,wd=document.getElementById("__srchWord")?.checked,rx=document.getElementById("__srchRegex")?.checked,res=document.getElementById("__srchResults"),ed=document.getElementById("editor");if(!q||!ed)return;live||WC_SEARCH_HIST.add(q),__srchClear();let pattern;try{let p=rx?q:q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");wd&&(p=`\\b${p}\\b`),pattern=new RegExp(p,cs?"g":"gi")}catch{res&&(res.textContent="Regex inv\xE1lido");return}let count=0;const walk=node=>{if(node.nodeType===3){const matches=[...node.textContent.matchAll(pattern)];if(!matches.length)return;const frag=document.createDocumentFragment();let last=0;matches.forEach(m=>{frag.appendChild(document.createTextNode(node.textContent.slice(last,m.index)));const mark=document.createElement("mark");mark.className="__srchMark",mark.style.cssText="background:#fff176;border-radius:2px;",mark.textContent=m[0],frag.appendChild(mark),last=m.index+m[0].length,count++}),frag.appendChild(document.createTextNode(node.textContent.slice(last))),node.parentNode.replaceChild(frag,node)}else node.nodeType===1&&!["SCRIPT","STYLE","MARK"].includes(node.tagName)&&Array.from(node.childNodes).forEach(walk)};walk(ed),window.__srchMatches=Array.from(ed.querySelectorAll(".__srchMark")),res&&(res.textContent=count?`${count} resultado${count!==1?"s":""}`:"Sin resultados"),window.__srchMatches[0]&&window.__srchMatches[0].scrollIntoView({behavior:"smooth",block:"center"})}function __srchClear(){const ed=document.getElementById("editor");ed&&ed.querySelectorAll(".__srchMark").forEach(m=>m.replaceWith(document.createTextNode(m.textContent)))}function __srchReplaceOne(){const marks=document.querySelectorAll(".__srchMark"),replace=document.getElementById("__srchReplace")?.value||"";if(!marks.length){showToast("Busc\xE1 primero");return}marks[0].replaceWith(document.createTextNode(replace)),showToast("\u2705 1 reemplazo hecho")}function __srchReplaceAll(){const marks=document.querySelectorAll(".__srchMark"),replace=document.getElementById("__srchReplace")?.value||"",count=marks.length;marks.forEach(m=>m.replaceWith(document.createTextNode(replace))),showToast(`\u2705 ${count} reemplazos hechos`),document.getElementById("__srchHistPanel").remove()}function openPDFReader(){const old=document.getElementById("__pdfReadPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pdfReadPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,sans-serif",ov.innerHTML=`
    <div style="background:#323639;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">\u{1F4C4} Lector de PDF</div>
      <button onclick="document.getElementById('__pdfReadPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">\u2715</button>
    </div>

    <div id="__pdfDrop" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#525659;cursor:pointer"
      onclick="document.getElementById('__pdfFileInp').click()"
      ondragover="event.preventDefault();this.style.background='#3a3d3f'"
      ondragleave="this.style.background='#525659'"
      ondrop="event.preventDefault();__pdfLoad(event.dataTransfer.files[0])">
      <div style="font-size:48px;margin-bottom:14px">\u{1F4C4}</div>
      <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px">Abr\xED un PDF</div>
      <div style="font-size:12px;color:rgba(255,255,255,.5)">Toc\xE1 o arrastr\xE1 un archivo PDF</div>
      <input type="file" id="__pdfFileInp" accept=".pdf" style="display:none" onchange="__pdfLoad(this.files[0])">
    </div>

    <div id="__pdfContent" style="display:none;flex:1;overflow-y:auto;background:#525659;padding:16px"></div>

    <div id="__pdfToolbar" style="display:none;background:#323639;padding:8px 16px;display:none;align-items:center;gap:10px;flex-shrink:0">
      <button onclick="__pdfPrev()" style="padding:6px 12px;border:none;background:rgba(255,255,255,.1);color:#fff;border-radius:6px;cursor:pointer">\u2190 Anterior</button>
      <span id="__pdfPageInfo" style="flex:1;text-align:center;color:#fff;font-size:12px"></span>
      <button onclick="__pdfNext()" style="padding:6px 12px;border:none;background:rgba(255,255,255,.1);color:#fff;border-radius:6px;cursor:pointer">Siguiente \u2192</button>
      <button onclick="__pdfExtractText()" style="padding:6px 14px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Extraer texto</button>
    </div>`,document.body.appendChild(ov),window.__pdfPage=1,window.__pdfPages=0,window.__pdfDoc=null}async function __pdfLoad(file){if(!file||file.type!=="application/pdf"){showToast("Seleccion\xE1 un archivo PDF");return}const drop=document.getElementById("__pdfDrop"),content=document.getElementById("__pdfContent"),toolbar=document.getElementById("__pdfToolbar");drop&&(drop.style.display="none"),content&&(content.style.display="block",content.innerHTML='<div style="text-align:center;color:#fff;padding:40px">\u23F3 Cargando PDF...</div>'),window.pdfjsLib||(await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",s.onload=res,s.onerror=rej,document.head.appendChild(s)}),window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js");const arrayBuffer=await file.arrayBuffer(),pdfDoc=await window.pdfjsLib.getDocument(arrayBuffer).promise;window.__pdfDoc=pdfDoc,window.__pdfPages=pdfDoc.numPages,window.__pdfPage=1,toolbar&&(toolbar.style.display="flex"),await __pdfRenderPage(1),showToast(`\u{1F4C4} PDF cargado: ${pdfDoc.numPages} p\xE1ginas`)}async function __pdfRenderPage(num){if(!window.__pdfDoc)return;const page=await window.__pdfDoc.getPage(num),viewport=page.getViewport({scale:window.innerWidth<600?.8:1.2}),canvas=document.createElement("canvas");canvas.width=viewport.width,canvas.height=viewport.height,canvas.style.cssText="max-width:100%;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:block;margin:0 auto";const ctx=canvas.getContext("2d");await page.render({canvasContext:ctx,viewport}).promise;const content=document.getElementById("__pdfContent");content&&(content.innerHTML=""),content?.appendChild(canvas);const info=document.getElementById("__pdfPageInfo");info&&(info.textContent=`P\xE1gina ${num} de ${window.__pdfPages}`)}function __pdfPrev(){window.__pdfPage>1&&(window.__pdfPage--,__pdfRenderPage(window.__pdfPage))}function __pdfNext(){window.__pdfPage<window.__pdfPages&&(window.__pdfPage++,__pdfRenderPage(window.__pdfPage))}async function __pdfExtractText(){if(!window.__pdfDoc)return;showToast("\u23F3 Extrayendo texto...");let fullText="";for(let i=1;i<=Math.min(window.__pdfPages,10);i++){const content=await(await window.__pdfDoc.getPage(i)).getTextContent();fullText+=content.items.map(item=>item.str).join(" ")+`

`}typeof insertHTML=="function"&&insertHTML('<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.6">'+fullText.replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>")+"</div>"),document.getElementById("__pdfReadPanel").remove(),showToast("\u{1F4CB} Texto del PDF extra\xEDdo \u2705")}function openMarkdownExport(){const old=document.getElementById("__mdExPanel");old&&old.remove();const ed=document.getElementById("editor");if(!ed)return;const markdown=(html=>{let md=html;return md=md.replace(/<h1[^>]*>(.*?)<\/h1>/gi,`# $1

`),md=md.replace(/<h2[^>]*>(.*?)<\/h2>/gi,`## $1

`),md=md.replace(/<h3[^>]*>(.*?)<\/h3>/gi,`### $1

`),md=md.replace(/<h4[^>]*>(.*?)<\/h4>/gi,`#### $1

`),md=md.replace(/<strong[^>]*>(.*?)<\/strong>/gi,"**$1**"),md=md.replace(/<b[^>]*>(.*?)<\/b>/gi,"**$1**"),md=md.replace(/<em[^>]*>(.*?)<\/em>/gi,"*$1*"),md=md.replace(/<i[^>]*>(.*?)<\/i>/gi,"*$1*"),md=md.replace(/<u[^>]*>(.*?)<\/u>/gi,"__$1__"),md=md.replace(/<del[^>]*>(.*?)<\/del>/gi,"~~$1~~"),md=md.replace(/<code[^>]*>(.*?)<\/code>/gi,"`$1`"),md=md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi,"```\n$1\n```\n\n"),md=md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,"[$2]($1)"),md=md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi,"![$2]($1)"),md=md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,(m,p1)=>"> "+p1.replace(/<[^>]+>/g,"").trim().replace(/\n/g,`
> `)+`

`),md=md.replace(/<li[^>]*>(.*?)<\/li>/gi,`- $1
`),md=md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi,`$1
`),md=md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi,(m,p1)=>{let i=0;return p1.replace(/- /g,()=>`${++i}. `)+`
`}),md=md.replace(/<br\s*\/?>/gi,`
`),md=md.replace(/<p[^>]*>(.*?)<\/p>/gi,`$1

`),md=md.replace(/<hr[^>]*>/gi,`
---

`),md=md.replace(/<[^>]+>/g,""),md=md.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," "),md=md.replace(/\n{3,}/g,`

`).trim(),md})(ed.innerHTML),ov=document.createElement("div");ov.id="__mdExPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;flex-direction:column;font-family:-apple-system,sans-serif",ov.innerHTML=`
    <div style="background:#1a2942;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1"># Exportar a Markdown</div>
      <button onclick="__mdCopy()" style="padding:6px 12px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Copiar</button>
      <button onclick="__mdDownload()" style="padding:6px 12px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4BE} Descargar</button>
      <button onclick="document.getElementById('__mdExPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">\u2715</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px;background:#0d1117">
      <pre id="__mdContent" style="color:#e6edf3;font-size:13px;font-family:'Courier New',monospace;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;margin:0">${markdown.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
    </div>
    <div style="background:#1a2942;padding:8px 16px;font-size:11px;color:#555;display:flex;justify-content:space-between">
      <span>${markdown.split(/\s+/).filter(w=>w).length} palabras \xB7 ${markdown.length} caracteres</span>
      <span>GitHub Flavored Markdown (GFM)</span>
    </div>`,document.body.appendChild(ov),window.__mdContent=markdown}function __mdCopy(){navigator.clipboard.writeText(window.__mdContent||"").then(()=>showToast("\u{1F4CB} Markdown copiado \u2705"))}function __mdDownload(){const blob=new Blob([window.__mdContent||""],{type:"text/markdown;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download="documento.md",a.click(),document.getElementById("__mdExPanel").remove(),showToast("\u{1F4BE} Markdown descargado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"signatureCanvas":openSignatureCanvas();break;case"qrGenerator":openQRGenerator();break;case"searchHistory":openSearchHistory();break;case"pdfReader":openPDFReader();break;case"mdExport":openMarkdownExport();break;default:orig(a)}}),console.log("WC Corporate Editor v25.38 \u2705 \u2014 Firma Canvas, QR, B\xFAsqueda, PDF, Markdown")},4600)})();

