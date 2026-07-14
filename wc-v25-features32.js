const WC_TOC={generate(maxLevel){const ed=document.getElementById("editor");if(!ed)return null;const headings=Array.from(ed.querySelectorAll("h1,h2,h3,h4,h5,h6"));if(!headings.length)return null;headings.forEach((h,i)=>{h.id||(h.id="wc-heading-"+i)});const max=maxLevel||3;let html=`
    <div id="wc-toc" style="font-family:Calibri,Arial,sans-serif;border:1px solid #ddd;border-radius:8px;padding:16px 20px;margin:16px 0;background:#fafafa;page-break-inside:avoid">
      <div style="font-size:12pt;font-weight:700;color:#1a2942;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #003da5">
        \u{1F4D1} Tabla de contenidos
      </div>
      <div style="display:flex;flex-direction:column;gap:3px">`;return headings.forEach(h=>{const level=parseInt(h.tagName[1]);if(level>max)return;const indent=(level-1)*20,fSize=level===1?"11pt":level===2?"10.5pt":"10pt",fWeight=level<=2?"600":"400",text=h.innerText.trim();html+=`
        <div style="display:flex;align-items:baseline;gap:6px;padding:2px 0;padding-left:${indent}px">
          <a href="#${h.id}" onclick="document.getElementById('${h.id}')?.scrollIntoView({behavior:'smooth'});return false;"
            style="font-size:${fSize};font-weight:${fWeight};color:#1a2942;text-decoration:none;flex:1;cursor:pointer"
            onmouseover="this.style.color='#003da5'" onmouseout="this.style.color='#1a2942'">
            ${text}
          </a>
          <div style="flex:1;border-bottom:1px dotted #ccc;min-width:20px;margin:0 6px"></div>
          <span style="font-size:10pt;color:#888;white-space:nowrap">\u2014\u2014</span>
        </div>`}),html+=`</div>
      <div style="font-size:8pt;color:#aaa;margin-top:8px;text-align:right">
        Generado autom\xE1ticamente \xB7 WC Corporate Editor \xB7 ${new Date().toLocaleDateString("es-CR")}
        <button onclick="WC_TOC.update()" style="margin-left:8px;padding:2px 8px;border:1px solid #ccc;background:#fff;border-radius:4px;cursor:pointer;font-size:8pt;color:#555">\u21BB Actualizar</button>
      </div>
    </div>`,html},insert(maxLevel){const html=this.generate(maxLevel);if(!html){showToast("No hay t\xEDtulos en el documento");return}const ed=document.getElementById("editor"),tmp=document.createElement("div");tmp.innerHTML=html,ed.insertBefore(tmp.firstChild,ed.firstChild),showToast("\u{1F4D1} Tabla de contenidos insertada \u2705")},update(){const old=document.getElementById("wc-toc");if(!old){showToast("No hay tabla de contenidos en el documento");return}const maxLevel=(old.querySelectorAll("a").length>0,3),html=this.generate(maxLevel);if(!html)return;const tmp=document.createElement("div");tmp.innerHTML=html,old.replaceWith(tmp.firstChild),showToast("\u{1F4D1} Tabla de contenidos actualizada \u2705")}};function openTOCPanel(){const old=document.getElementById("__tocPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__tocPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const ed=document.getElementById("editor"),headings=ed?Array.from(ed.querySelectorAll("h1,h2,h3,h4")).slice(0,8):[];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4D1} Tabla de contenidos</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Generaci\xF3n autom\xE1tica desde los t\xEDtulos del documento</div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Niveles a incluir</label>
      <div style="display:flex;gap:8px">
        ${[1,2,3,4].map(n=>`
          <label style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:8px 12px;border:1.5px solid ${n<=3?"#003da5":"#eee"};background:${n<=3?"#f0f7ff":"#fafafa"};border-radius:8px;font-size:12px;font-weight:600;color:${n<=3?"#003da5":"#555"}">
            <input type="checkbox" name="__tocLevel" value="${n}" ${n<=3?"checked":""} style="accent-color:#003da5"> H${n}
          </label>`).join("")}
      </div>
    </div>

    ${headings.length?`
    <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">Vista previa (${headings.length} t\xEDtulos)</div>
      ${headings.map(h=>{const level=parseInt(h.tagName[1]);return`<div style="padding:3px 0;padding-left:${(level-1)*16}px;font-size:${level===1?"13":"11"}px;font-weight:${level<=2?"600":"400"};color:#333">${h.innerText.slice(0,40)}</div>`}).join("")}
    </div>`:`
    <div style="background:#fff9e6;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#856404">
      \u26A0\uFE0F No hay t\xEDtulos (H1-H4) en el documento. Agreg\xE1 t\xEDtulos primero.
    </div>`}

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__tocPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__tocInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4D1} Insertar TOC</button>
    </div>
    ${document.getElementById("wc-toc")?`
    <button onclick="WC_TOC.update();document.getElementById('__tocPanel').remove()" style="width:100%;margin-top:8px;padding:10px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u21BB Actualizar TOC existente</button>`:""}
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __tocInsert(){const levels=Array.from(document.querySelectorAll('[name="__tocLevel"]:checked')).map(cb=>parseInt(cb.value)),maxLevel=levels.length?Math.max(...levels):3;WC_TOC.insert(maxLevel),document.getElementById("__tocPanel").remove()}const WC_PAGENUM={config:JSON.parse(localStorage.getItem("wc-pagenum")||"null")||{enabled:!1,position:"bottom-center",format:"P\xE1gina {n} de {total}",startFrom:1,style:"normal",firstPage:!0},positions:{"top-left":{top:"8px",left:"16px",right:"auto",bottom:"auto"},"top-center":{top:"8px",left:"50%",right:"auto",bottom:"auto",transform:"translateX(-50%)"},"top-right":{top:"8px",left:"auto",right:"16px",bottom:"auto"},"bottom-left":{bottom:"8px",left:"16px",right:"auto",top:"auto"},"bottom-center":{bottom:"8px",left:"50%",right:"auto",top:"auto",transform:"translateX(-50%)"},"bottom-right":{bottom:"8px",left:"auto",right:"16px",top:"auto"}},apply(){if(document.querySelectorAll(".wc-pagenum").forEach(el=>el.remove()),!this.config.enabled)return;const ed=document.getElementById("editor");if(!ed)return;const edHeight=ed.scrollHeight,pageHeight=1122,totalPages=Math.max(1,Math.ceil(edHeight/pageHeight)),pos=this.positions[this.config.position]||this.positions["bottom-center"];for(let i=1;i<=totalPages;i++){if(!this.config.firstPage&&i===1)continue;const pageN=i+this.config.startFrom-1,text=this.config.format.replace("{n}",pageN).replace("{total}",totalPages),div=document.createElement("div");div.className="wc-pagenum";const styles={position:"absolute",fontSize:"9pt",color:"#888",fontFamily:"Calibri,Arial,sans-serif",...pos};Object.assign(div.style,styles),div.style.top=pos.top||"auto",div.style.bottom=pos.bottom!==void 0?pos.bottom:"auto",div.style.left=pos.left||"auto",div.style.right=pos.right||"auto",pos.transform&&(div.style.transform=pos.transform),div.style.marginTop=(i-1)*pageHeight+"px",div.textContent=text,ed.style.position="relative",ed.appendChild(div)}localStorage.setItem("wc-pagenum",JSON.stringify(this.config))}};function openPageNumPanel(){const old=document.getElementById("__pnPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pnPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const cfg=WC_PAGENUM.config;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px"># Numeraci\xF3n de p\xE1ginas</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Configuraci\xF3n avanzada de n\xFAmeros de p\xE1gina</div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px;border:1.5px solid ${cfg.enabled?"#003da5":"#eee"};background:${cfg.enabled?"#f0f7ff":"#fafafa"};border-radius:10px">
        <input type="checkbox" id="__pnEnabled" ${cfg.enabled?"checked":""} style="accent-color:#003da5;width:16px;height:16px">
        <div><div style="font-size:13px;font-weight:600;color:#1a1a1a">Activar numeraci\xF3n</div><div style="font-size:11px;color:#888">Muestra el n\xFAmero en cada p\xE1gina</div></div>
      </label>

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Posici\xF3n</label>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
          ${Object.keys(WC_PAGENUM.positions).map(p=>`
            <button onclick="__pnSelectPos('${p}',this)" class="__pnPosBtn"
              style="padding:8px 4px;border:1.5px solid ${p===cfg.position?"#003da5":"#eee"};background:${p===cfg.position?"#f0f7ff":"#fafafa"};border-radius:8px;cursor:pointer;font-size:10px;font-weight:600;color:${p===cfg.position?"#003da5":"#555"};transition:all .15s"
              ${p===cfg.position?'data-sel="1"':""}>
              ${p.replace("top-","\u2191 ").replace("bottom-","\u2193 ").replace("left","Izq").replace("center","Cen").replace("right","Der")}
            </button>`).join("")}
        </div>
      </div>

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Formato</label>
        <select id="__pnFormat" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
          ${[["P\xE1gina {n} de {total}","P\xE1gina 1 de 5"],["{n}","Solo n\xFAmero: 1"],["- {n} -","Centrado: - 1 -"],["P\xE1g. {n}","Abreviado: P\xE1g. 1"],["{n} / {total}","Fracci\xF3n: 1 / 5"]].map(([v,l])=>`<option value="${v}" ${v===cfg.format?"selected":""}>${l}</option>`).join("")}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Empezar desde</label>
          <input type="number" id="__pnStart" value="${cfg.startFrom}" min="0" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box">
        </div>
        <div style="display:flex;align-items:center;padding-top:18px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:#555">
            <input type="checkbox" id="__pnFirstPage" ${cfg.firstPage?"checked":""} style="accent-color:#003da5"> Primera p\xE1gina
          </label>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__pnPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__pnApply()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600"># Aplicar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__pnPos=cfg.position}function __pnSelectPos(pos,btn){window.__pnPos=pos,document.querySelectorAll(".__pnPosBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.style.color="#003da5",btn.dataset.sel="1"}function __pnApply(){WC_PAGENUM.config.enabled=document.getElementById("__pnEnabled")?.checked||!1,WC_PAGENUM.config.position=window.__pnPos||"bottom-center",WC_PAGENUM.config.format=document.getElementById("__pnFormat")?.value||"P\xE1gina {n} de {total}",WC_PAGENUM.config.startFrom=parseInt(document.getElementById("__pnStart")?.value)||1,WC_PAGENUM.config.firstPage=document.getElementById("__pnFirstPage")?.checked||!0,WC_PAGENUM.apply(),document.getElementById("__pnPanel").remove(),showToast(WC_PAGENUM.config.enabled?"# Numeraci\xF3n de p\xE1ginas activada \u2705":"Numeraci\xF3n desactivada")}const WC_FOOTNOTES={notes:JSON.parse(localStorage.getItem("wc-footnotes")||"[]"),counter:0,save(){localStorage.setItem("wc-footnotes",JSON.stringify(this.notes))},insert(text,type){this.counter=this.notes.filter(n=>n.type===type).length+1;const id="fn-"+Date.now(),mark=type==="footnote"?this.counter:this.counter,sym=type==="footnote"?`<sup style="color:#003da5;font-size:8pt;cursor:pointer" onclick="document.getElementById('${id}')?.scrollIntoView({behavior:'smooth'})">${mark}</sup>`:`<sup style="color:#e74c3c;font-size:8pt;cursor:pointer" onclick="document.getElementById('${id}')?.scrollIntoView({behavior:'smooth'})">[${mark}]</sup>`;typeof insertHTML=="function"&&insertHTML(sym),this.notes.push({id,num:mark,text,type,created:Date.now()}),this.save(),this.renderSection(type),showToast(type==="footnote"?`Nota al pie ${mark} insertada \u2705`:`Nota final ${mark} insertada \u2705`)},renderSection(type){const ed=document.getElementById("editor");if(!ed)return;const notes=this.notes.filter(n=>n.type===type);if(!notes.length)return;const sectionId=type==="footnote"?"wc-footnotes-section":"wc-endnotes-section";let section=document.getElementById(sectionId);const title=type==="footnote"?"Notas al pie":"Notas finales",color=type==="footnote"?"#003da5":"#e74c3c",html=`
    <div id="${sectionId}" style="margin-top:40px;border-top:2px solid ${color};padding-top:12px;font-family:Calibri,Arial,sans-serif">
      <div style="font-size:9pt;font-weight:700;color:${color};margin-bottom:8px">${title}</div>
      ${notes.map(n=>`
        <div id="${n.id}" style="display:flex;gap:8px;margin-bottom:6px;font-size:9pt;color:#555;line-height:1.5">
          <span style="color:${color};font-weight:700;flex-shrink:0">${type==="footnote"?n.num:`[${n.num}]`}</span>
          <span>${n.text}</span>
        </div>`).join("")}
    </div>`;section?section.outerHTML=html:ed.insertAdjacentHTML("beforeend",html)},deleteAll(type){this.notes=this.notes.filter(n=>n.type!==type),this.save();const sectionId=type==="footnote"?"wc-footnotes-section":"wc-endnotes-section";document.getElementById(sectionId)?.remove(),showToast("Notas eliminadas")}};function openFootnotesPanel(){const old=document.getElementById("__fnPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__fnPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const fnCount=WC_FOOTNOTES.notes.filter(n=>n.type==="footnote").length,enCount=WC_FOOTNOTES.notes.filter(n=>n.type==="endnote").length;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\xB9 Notas al pie y finales</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">${fnCount} notas al pie \xB7 ${enCount} notas finales</div>

    <div style="display:flex;gap:6px;margin-bottom:14px">
      <button onclick="__fnTab('footnote',this)" class="__fnTabBtn"
        style="flex:1;padding:9px;border:2px solid #003da5;background:#f0f7ff;color:#003da5;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600"
        data-sel="1">
        \xB9 Nota al pie
      </button>
      <button onclick="__fnTab('endnote',this)" class="__fnTabBtn"
        style="flex:1;padding:9px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">
        \u2071 Nota final
      </button>
    </div>

    <div id="__fnSection_footnote">
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto de la nota al pie</label>
        <textarea id="__fnText_footnote" rows="3" placeholder="Ej: Ministerio de Hacienda, Costa Rica, 2025..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
      <button onclick="__fnInsert('footnote')" style="width:100%;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:8px">\xB9 Insertar nota al pie</button>
    </div>

    <div id="__fnSection_endnote" style="display:none">
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto de la nota final</label>
        <textarea id="__fnText_endnote" rows="3" placeholder="Ej: Para mayor informaci\xF3n ver bibliograf\xEDa..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
      <button onclick="__fnInsert('endnote')" style="width:100%;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:8px">\u2071 Insertar nota final</button>
    </div>

    ${fnCount||enCount?`
    <div style="background:#f8f9fa;border-radius:10px;padding:10px;margin-bottom:10px;max-height:150px;overflow-y:auto">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Notas existentes</div>
      ${WC_FOOTNOTES.notes.map(n=>`
        <div style="display:flex;gap:6px;padding:5px 0;border-bottom:1px solid #eee;font-size:11px">
          <span style="color:${n.type==="footnote"?"#003da5":"#e74c3c"};font-weight:700">${n.type==="footnote"?n.num:"["+n.num+"]"}</span>
          <span style="flex:1;color:#555;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${n.text}</span>
        </div>`).join("")}
    </div>`:""}

    <button onclick="document.getElementById('__fnPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __fnTab(type,btn){["footnote","endnote"].forEach(t=>{const sec=document.getElementById("__fnSection_"+t);sec&&(sec.style.display=t===type?"block":"none")}),document.querySelectorAll(".__fnTabBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel});const color=type==="footnote"?"#003da5":"#e74c3c";btn.style.borderColor=color,btn.style.background=color+"15",btn.style.color=color,btn.dataset.sel="1"}function __fnInsert(type){const text=document.getElementById("__fnText_"+type)?.value.trim();if(!text){showToast("Escrib\xED el texto de la nota");return}WC_FOOTNOTES.insert(text,type),document.getElementById("__fnPanel").remove()}const WC_BOOKMARKS={marks:JSON.parse(localStorage.getItem("wc-bookmarks")||"[]"),save(){localStorage.setItem("wc-bookmarks",JSON.stringify(this.marks))},add(name,text){const id="bm-"+name.toLowerCase().replace(/\s+/g,"-")+"-"+Date.now(),existing=this.marks.findIndex(m=>m.name===name);return existing>=0&&this.marks.splice(existing,1),this.marks.push({id,name,text:text||name,created:Date.now()}),this.save(),id},insert(name){const id=this.add(name,name);typeof insertHTML=="function"&&insertHTML(`<span id="${id}" style="background:#fff9c4;border:1px solid #f39c12;border-radius:3px;padding:1px 4px;font-size:inherit" title="Marcador: ${name}">\u{1F4CC} ${name}</span>`),showToast(`\u{1F4CC} Marcador "${name}" insertado \u2705`)},insertRef(markId,markName){typeof insertHTML=="function"&&insertHTML(`<a href="#${markId}" onclick="document.getElementById('${markId}')?.scrollIntoView({behavior:'smooth'});return false;" style="color:#003da5;text-decoration:none;border-bottom:1px dotted #003da5" title="Referencia a: ${markName}">${markName}</a>`),showToast(`\u{1F517} Referencia a "${markName}" insertada \u2705`)},delete(id){this.marks=this.marks.filter(m=>m.id!==id),document.getElementById(id)?.remove(),this.save()}};function openBookmarksPanel(){const old=document.getElementById("__bmPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__bmPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CC} Marcadores y referencias</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">${WC_BOOKMARKS.marks.length} marcadores guardados</div>

      <div style="display:flex;gap:6px;margin-bottom:12px">
        <input type="text" id="__bmName" placeholder="Nombre del marcador (ej: Introducci\xF3n)"
          style="flex:1;padding:9px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#f39c12'" onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter')__bmInsert()">
        <button onclick="__bmInsert()" style="padding:9px 14px;border:none;background:#f39c12;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CC} Marcar</button>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 20px">
      ${WC_BOOKMARKS.marks.length?`
      <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Marcadores guardados</div>
      ${WC_BOOKMARKS.marks.map(m=>`
        <div style="display:flex;align-items:center;gap:8px;padding:10px;border:1.5px solid #eee;border-radius:10px;margin-bottom:6px;transition:all .15s"
          onmouseover="this.style.borderColor='#f39c12'" onmouseout="this.style.borderColor='#eee'">
          <span style="font-size:18px">\u{1F4CC}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">${m.name}</div>
            <div style="font-size:10px;color:#aaa">${new Date(m.created).toLocaleDateString("es-CR")}</div>
          </div>
          <button onclick="WC_BOOKMARKS.insertRef('${m.id}','${m.name.replace(/'/g,"\\'")}')" style="padding:5px 10px;border:none;background:#003da5;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F517} Ref</button>
          <button onclick="document.getElementById('${m.id}')?.scrollIntoView({behavior:'smooth'})" style="padding:5px 8px;border:1.5px solid #eee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;color:#555">\u2197</button>
          <button onclick="WC_BOOKMARKS.delete('${m.id}');openBookmarksPanel()" style="padding:5px 8px;border:none;background:none;color:#e74c3c;cursor:pointer;font-size:14px">\xD7</button>
        </div>`).join("")}`:`
      <div style="text-align:center;padding:20px;color:#bbb">
        <div style="font-size:32px;margin-bottom:8px">\u{1F4CC}</div>
        <div style="font-size:13px">Sin marcadores a\xFAn. Agreg\xE1 uno con el campo de arriba.</div>
      </div>`}
    </div>

    <div style="padding:10px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__bmPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __bmInsert(){const name=document.getElementById("__bmName")?.value.trim();if(!name){showToast("Escrib\xED el nombre del marcador");return}WC_BOOKMARKS.insert(name),document.getElementById("__bmPanel").remove()}const WC_TRACK={active:!1,author:localStorage.getItem("wc-collab-name")||"Usuario",changes:[],original:"",toggle(){this.active=!this.active,this.active?(this.original=document.getElementById("editor")?.innerHTML||"",this.changes=[],this._attachObserver(),showToast("\u{1F534} Control de cambios activado")):(this._detachObserver(),showToast("Control de cambios desactivado")),this._updateIndicator()},_attachObserver(){const ed=document.getElementById("editor");ed&&(this._observer=new MutationObserver(mutations=>{this.active&&mutations.forEach(m=>{m.type==="characterData"&&this.changes.push({type:"edit",ts:Date.now(),author:this.author,old:m.oldValue,new:m.target.textContent})})}),this._observer.observe(ed,{childList:!0,subtree:!0,characterData:!0,characterDataOldValue:!0}))},_detachObserver(){this._observer&&(this._observer.disconnect(),this._observer=null)},_updateIndicator(){const old=document.getElementById("__trackIndicator");if(old&&old.remove(),!this.active)return;const ind=document.createElement("div");ind.id="__trackIndicator",ind.style.cssText="position:fixed;top:70px;right:12px;z-index:8500;background:#e74c3c;color:#fff;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;box-shadow:0 2px 10px rgba(231,76,60,.4)",ind.innerHTML="\u{1F534} Rastreando cambios",document.body.appendChild(ind)},acceptAll(){this.changes=[],document.querySelectorAll(".wc-change-ins").forEach(el=>{el.style.background="",el.style.textDecoration="",el.style.color=""}),document.querySelectorAll(".wc-change-del").forEach(el=>el.remove()),showToast("\u2705 Todos los cambios aceptados")},rejectAll(){const ed=document.getElementById("editor");ed&&this.original&&(ed.innerHTML=this.original,this.changes=[],showToast("\u21A9 Todos los cambios rechazados"))},markInsertion(text){this.active&&(typeof insertHTML=="function"&&insertHTML(`<ins class="wc-change-ins" style="background:#d4edda;text-decoration:none;border-bottom:2px solid #27ae60" title="Insertado por ${this.author}">${text}</ins>`),this.changes.push({type:"insert",ts:Date.now(),author:this.author,text}))},markDeletion(text){this.active&&(typeof insertHTML=="function"&&insertHTML(`<del class="wc-change-del" style="background:#fde8e8;color:#e74c3c;text-decoration:line-through" title="Eliminado por ${this.author}">${text}</del>`),this.changes.push({type:"delete",ts:Date.now(),author:this.author,text}))}};function openTrackChangesPanel(){const old=document.getElementById("__tcPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__tcPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F534} Control de cambios</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">${WC_TRACK.changes.length} cambios registrados</div>

    <div style="background:${WC_TRACK.active?"#fde8e8":"#f8f9fa"};border-radius:12px;padding:14px;margin-bottom:14px;text-align:center">
      <div style="font-size:14px;font-weight:700;color:${WC_TRACK.active?"#e74c3c":"#888"}">${WC_TRACK.active?"\u{1F534} Rastreando cambios":"\u23F8 Inactivo"}</div>
      <div style="font-size:11px;color:#aaa;margin-top:3px">Autor: ${WC_TRACK.author}</div>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Nombre del revisor</label>
      <input type="text" id="__tcAuthor" value="${WC_TRACK.author}"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <button onclick="WC_TRACK.author=document.getElementById('__tcAuthor').value||'Usuario';WC_TRACK.toggle();document.getElementById('__tcPanel').remove()"
        style="padding:11px;border:none;background:${WC_TRACK.active?"#555":"#e74c3c"};color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        ${WC_TRACK.active?"\u23F8 Pausar rastreo":"\u{1F534} Activar rastreo"}
      </button>
      ${WC_TRACK.changes.length?`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button onclick="WC_TRACK.acceptAll();document.getElementById('__tcPanel').remove()" style="padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u2705 Aceptar todo</button>
        <button onclick="WC_TRACK.rejectAll();document.getElementById('__tcPanel').remove()" style="padding:10px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u21A9 Rechazar todo</button>
      </div>`:""}
    </div>

    ${WC_TRACK.changes.length?`
    <div style="background:#f8f9fa;border-radius:10px;padding:10px;margin-bottom:12px;max-height:150px;overflow-y:auto">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Historial de cambios</div>
      ${WC_TRACK.changes.slice(-10).reverse().map(c=>`
        <div style="padding:5px 0;border-bottom:1px solid #eee;font-size:11px;display:flex;gap:6px;align-items:center">
          <span style="font-size:10px;background:${c.type==="insert"?"#d4edda":"#fde8e8"};color:${c.type==="insert"?"#155724":"#721c24"};border-radius:4px;padding:1px 5px">${c.type==="insert"?"+ Ins":"- Del"}</span>
          <span style="flex:1;color:#555;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${(c.text||c.new||"").slice(0,30)}</span>
          <span style="color:#aaa;font-size:9px">${c.author}</span>
        </div>`).join("")}
    </div>`:""}

    <button onclick="document.getElementById('__tcPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}(function(){setTimeout(()=>{WC_PAGENUM.config.enabled&&WC_PAGENUM.apply(),WC_FOOTNOTES.notes.forEach(n=>WC_FOOTNOTES.renderSection(n.type))},2e3),setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"tocPanel":openTOCPanel();break;case"pageNumbers":openPageNumPanel();break;case"footnotes":openFootnotesPanel();break;case"bookmarks":openBookmarksPanel();break;case"trackChanges":openTrackChangesPanel();break;case"tocUpdate":WC_TOC.update();break;case"tocInsert":WC_TOC.insert(3);break;default:orig(a)}}),console.log("WC Corporate Editor v25.32 \u2705 \u2014 TOC, Numeraci\xF3n, Notas al pie, Marcadores, Control cambios")},4e3)})();
