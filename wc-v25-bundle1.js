function initFloatBar(){const bar=document.getElementById("floatBar");if(!bar)return;let hideTimer=null;function positionBar(rect){const barW=bar.offsetWidth||380;let left=rect.left+rect.width/2-barW/2;left=Math.max(8,Math.min(left,window.innerWidth-barW-8));let top=rect.top-58+window.scrollY;rect.top<70&&(top=rect.bottom+window.scrollY+8),bar.style.left=left+"px",bar.style.top=top+"px"}function showBar(){clearTimeout(hideTimer);const sel=window.getSelection();if(!sel||sel.isCollapsed||!sel.toString().trim()){hideBar();return}const rect=sel.getRangeAt(0).getBoundingClientRect();if(!rect.width){hideBar();return}const anchor=sel.anchorNode,ed=document.getElementById("editor"),dw=document.getElementById("docWindowEditor");if(!ed.contains(anchor)&&!(dw&&dw.contains(anchor))){hideBar();return}positionBar(rect),bar.style.display="flex"}function hideBar(){hideTimer=setTimeout(()=>{bar.style.display="none"},150)}document.addEventListener("mouseup",()=>setTimeout(showBar,40)),document.addEventListener("keyup",()=>setTimeout(showBar,40)),document.addEventListener("touchend",()=>setTimeout(showBar,100)),document.addEventListener("mousedown",e=>{bar.contains(e.target)||hideBar()}),bar.addEventListener("mouseenter",()=>clearTimeout(hideTimer)),bar.addEventListener("mouseleave",hideBar)}function openFbColorPicker(){const inp=document.getElementById("fbColorPicker"),bar=document.getElementById("floatBar");if(inp&&bar){const r=bar.getBoundingClientRect();inp.style.left=r.left+"px",inp.style.top=r.bottom+4+"px"}inp&&inp.click()}function toggleSuperscript(){const sel=window.getSelection();if(!sel||sel.isCollapsed){showToast("Selecciona texto primero");return}const parent=sel.getRangeAt(0).commonAncestorContainer.parentElement;if(parent&&parent.tagName==="SUP"){const txt=document.createTextNode(parent.textContent);parent.replaceWith(txt),showToast("Super\xEDndice quitado")}else document.execCommand("superscript",!1,null),showToast("Super\xEDndice x\xB2 \u2705");saveSelection()}function toggleSubscript(){const sel=window.getSelection();if(!sel||sel.isCollapsed){showToast("Selecciona texto primero");return}const parent=sel.getRangeAt(0).commonAncestorContainer.parentElement;if(parent&&parent.tagName==="SUB"){const txt=document.createTextNode(parent.textContent);parent.replaceWith(txt),showToast("Sub\xEDndice quitado")}else document.execCommand("subscript",!1,null),showToast("Sub\xEDndice H\u2082O \u2705");saveSelection()}const hlColors=[{c:"#FFFF00",n:"Amarillo"},{c:"#90EE90",n:"Verde"},{c:"#ADD8E6",n:"Azul"},{c:"#FFB6C1",n:"Rosa"},{c:"#FFD580",n:"Naranja"},{c:"#E6CCFF",n:"Morado"},{c:"#FFDAB9",n:"Melocot\xF3n"},{c:"#B0FFF0",n:"Aqua"}];function applyHighlight(color){restoreSelection();const sel=window.getSelection();if(!sel||sel.isCollapsed){showToast("Selecciona texto primero");return}color==="none"||color==="transparent"?(document.execCommand("hiliteColor",!1,"transparent"),document.execCommand("backColor",!1,"transparent"),showToast("Resaltado quitado")):(document.execCommand("hiliteColor",!1,color),showToast("Resaltado aplicado \u{1F58D}\uFE0F")),saveSelection()}function buildHlGrid(){const grid=document.getElementById("hlGrid");grid&&grid.children.length===0&&hlColors.forEach(h=>{const btn=document.createElement("button");btn.className="hl-btn",btn.style.background=h.c,btn.title=h.n,btn.onmousedown=()=>saveSelection(),btn.onclick=()=>{applyHighlight(h.c),closeModal("modalHighlight")},grid.appendChild(btn)});const fabRow=document.getElementById("fabHlRow");if(fabRow&&fabRow.children.length===0){hlColors.forEach(h=>{const btn=document.createElement("button");btn.className="fabbtn",btn.style.cssText=`background:${h.c};color:#333;font-size:11px;padding:5px 8px;border-color:rgba(0,0,0,.15)`,btn.textContent=h.n,btn.onmousedown=()=>saveSelection(),btn.onclick=()=>{applyHighlight(h.c),showToast(h.n+" \u{1F58D}\uFE0F")},fabRow.appendChild(btn)});const qbtn=document.createElement("button");qbtn.className="fabbtn",qbtn.textContent="\u2715 Quitar",qbtn.onmousedown=()=>saveSelection(),qbtn.onclick=()=>applyHighlight("none"),fabRow.appendChild(qbtn)}}function applyCaseChange(tipo){restoreSelection();const sel=window.getSelection();if(!sel||sel.isCollapsed){showToast("Selecciona texto primero");return}const text=sel.getRangeAt(0).toString();let result;if(tipo==="upper")result=text.toUpperCase();else if(tipo==="lower")result=text.toLowerCase();else if(tipo==="title")result=text.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());else if(tipo==="sentence"){const s=text.toLowerCase();result=s.charAt(0).toUpperCase()+s.slice(1)}else result=text;document.execCommand("insertText",!1,result),closeModal("modalChangeCase"),showToast("May\xFAsculas cambiadas \u2705")}function initTableContext(){const ed=document.getElementById("editor");if(!ed)return;ed.addEventListener("contextmenu",function(e){const cell=e.target.closest("td,th");cell&&(e.preventDefault(),showTableMenu(e.clientX,e.clientY,cell))});let lpt=null;ed.addEventListener("touchstart",function(e){const cell=e.target.closest("td,th");cell&&(lpt=setTimeout(()=>{const t=e.touches[0];showTableMenu(t.clientX,t.clientY,cell)},600))},{passive:!0}),ed.addEventListener("touchmove",()=>clearTimeout(lpt),{passive:!0}),ed.addEventListener("touchend",()=>clearTimeout(lpt),{passive:!0})}function showTableMenu(x,y,cell){const old=document.getElementById("__tableCtx");old&&old.remove();const menu=document.createElement("div");menu.id="__tableCtx";const ml=Math.min(x,window.innerWidth-240),mt=Math.min(y,window.innerHeight-460);menu.style.cssText=`position:fixed;z-index:99990;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.25);padding:8px 0;min-width:228px;left:${ml}px;top:${mt}px;font-family:-apple-system,'Segoe UI',sans-serif;overflow:hidden;`;const table=cell.closest("table"),row=cell.closest("tr");[{ico:"\u2B06\uFE0F",l:"Insertar fila arriba",fn:()=>insertRowAbove(row)},{ico:"\u2B07\uFE0F",l:"Insertar fila abajo",fn:()=>insertRowBelow(row)},{ico:"\u2B05\uFE0F",l:"Insertar columna izquierda",fn:()=>insertColLeft(table,cell)},{ico:"\u27A1\uFE0F",l:"Insertar columna derecha",fn:()=>insertColRight(table,cell)},{sep:!0},{ico:"\u{1F5D1}\uFE0F",l:"Eliminar fila",fn:()=>deleteRow(row)},{ico:"\u{1F5D1}\uFE0F",l:"Eliminar columna",fn:()=>deleteCol(table,cell)},{ico:"\u{1F5D1}\uFE0F",l:"Eliminar tabla",fn:()=>{table.remove(),showToast("Tabla eliminada")}},{sep:!0},{ico:"\u2B1C",l:"Combinar celdas seleccionadas",fn:()=>mergeCells(table)},{ico:"\u2702\uFE0F",l:"Dividir celda combinada",fn:()=>splitCell(cell)},{sep:!0},{ico:"\u{1F3A8}",l:"Color de celda",fn:()=>setCellColor(cell)},{ico:"\u{1F4CF}",l:"Alto de fila (px)",fn:()=>setRowHeight(row)},{ico:"\u{1F4D0}",l:"Ancho de columna (%)",fn:()=>setColWidth(table,cell)},{ico:"\u{1F532}",l:"Estilo de bordes",fn:()=>setTableBorders(table)},{sep:!0},{ico:"\u2191",l:"Ordenar tabla ascendente",fn:()=>sortTable(table,!0)},{ico:"\u2193",l:"Ordenar tabla descendente",fn:()=>sortTable(table,!1)}].forEach(item=>{if(item.sep){const d=document.createElement("div");d.style.cssText="height:1px;background:#f0f0f0;margin:4px 0",menu.appendChild(d);return}const btn=document.createElement("button");btn.style.cssText="display:flex;align-items:center;gap:10px;width:100%;border:none;background:none;padding:10px 16px;font-size:13px;color:#1a1a1a;cursor:pointer;text-align:left;",btn.innerHTML=`<span style="font-size:15px;width:20px;text-align:center">${item.ico}</span><span>${item.l}</span>`,btn.onmouseover=()=>btn.style.background="#f0f7ff",btn.onmouseout=()=>btn.style.background="none",btn.onclick=()=>{menu.remove(),item.fn()},menu.appendChild(btn)}),document.body.appendChild(menu),document.addEventListener("mousedown",function dismiss(e){menu.contains(e.target)||(menu.remove(),document.removeEventListener("mousedown",dismiss))})}function insertRowAbove(row){const nr=row.cloneNode(!0);nr.querySelectorAll("td,th").forEach(c=>c.innerHTML=""),row.parentNode.insertBefore(nr,row),showToast("Fila insertada \u2B06\uFE0F")}function insertRowBelow(row){const nr=row.cloneNode(!0);nr.querySelectorAll("td,th").forEach(c=>c.innerHTML=""),row.parentNode.insertBefore(nr,row.nextSibling),showToast("Fila insertada \u2B07\uFE0F")}function deleteRow(row){if(row.parentNode.rows.length<=1){showToast("No se puede eliminar la \xFAnica fila");return}row.remove(),showToast("Fila eliminada \u{1F5D1}\uFE0F")}function getColIndex(table,cell){return Array.from(cell.closest("tr").cells).indexOf(cell)}function insertColLeft(table,cell){const idx=getColIndex(table,cell);Array.from(table.rows).forEach(r=>{const td=document.createElement(r.rowIndex===0?"th":"td");td.style.cssText=r.cells[idx]?r.cells[idx].style.cssText:"border:1px solid #ddd;padding:8px",r.insertBefore(td,r.cells[idx])}),showToast("Columna insertada \u2B05\uFE0F")}function insertColRight(table,cell){const idx=getColIndex(table,cell);Array.from(table.rows).forEach(r=>{const td=document.createElement(r.rowIndex===0?"th":"td");td.style.cssText=r.cells[idx]?r.cells[idx].style.cssText:"border:1px solid #ddd;padding:8px",r.insertBefore(td,r.cells[idx+1]||null)}),showToast("Columna insertada \u27A1\uFE0F")}function deleteCol(table,cell){const idx=getColIndex(table,cell);if(table.rows[0]&&table.rows[0].cells.length<=1){showToast("No se puede eliminar la \xFAnica columna");return}Array.from(table.rows).forEach(r=>{r.cells[idx]&&r.cells[idx].remove()}),showToast("Columna eliminada \u{1F5D1}\uFE0F")}function mergeCells(table){const sel=window.getSelection();if(!sel||sel.isCollapsed){showToast("Selecciona varias celdas primero");return}const range=sel.getRangeAt(0),cells=Array.from(table.querySelectorAll("td,th")).filter(c=>range.intersectsNode(c));if(cells.length<2){showToast("Selecciona al menos 2 celdas");return}cells[0].innerHTML=cells.map(c=>c.innerHTML).join(" "),cells[0].colSpan=cells.length,cells.slice(1).forEach(c=>c.remove()),showToast("Celdas combinadas \u2705")}function splitCell(cell){const cs=parseInt(cell.colSpan||1);if(cs<=1){showToast("La celda no est\xE1 combinada");return}cell.colSpan=1;const row=cell.closest("tr");for(let i=1;i<cs;i++){const nd=document.createElement(cell.tagName);nd.style.cssText=cell.style.cssText,nd.innerHTML="",row.insertBefore(nd,cell.nextSibling)}showToast("Celda dividida \u2705")}function setCellColor(cell){const inp=document.createElement("input");inp.type="color",inp.value="#BDD7EE",inp.style.display="none",document.body.appendChild(inp),inp.onchange=()=>{cell.style.background=inp.value,inp.remove(),showToast("Color de celda \u{1F3A8}")},inp.click()}function setRowHeight(row){const h=prompt("Alto de fila (px):","40");h&&!isNaN(h)&&(row.style.height=h+"px",showToast("Alto aplicado"))}function setColWidth(table,cell){const w=prompt("Ancho de columna (%):","20");if(w&&!isNaN(w)){const idx=getColIndex(table,cell);Array.from(table.rows).forEach(r=>{r.cells[idx]&&(r.cells[idx].style.width=w+"%")}),showToast("Ancho aplicado")}}function setTableBorders(table){const s=prompt("Estilo de borde (ej: 1px solid #000, none):","1px solid #ddd");s!==null&&(table.querySelectorAll("td,th").forEach(c=>c.style.border=s),showToast("Bordes aplicados \u{1F532}"))}function sortTable(table,asc){const tbody=table.tBodies[0]||table,rows=Array.from(tbody.querySelectorAll("tr")),header=rows.shift();rows.sort((a,b)=>{const av=a.cells[0]?a.cells[0].innerText.trim():"",bv=b.cells[0]?b.cells[0].innerText.trim():"",an=parseFloat(av),bn=parseFloat(bv);return!isNaN(an)&&!isNaN(bn)?asc?an-bn:bn-an:asc?av.localeCompare(bv):bv.localeCompare(av)}),rows.forEach(r=>tbody.appendChild(r)),showToast("Ordenado "+(asc?"\u2191":"\u2193"))}(function(){setTimeout(function(){initFloatBar(),initTableContext(),buildHlGrid(),typeof buildHlGrid=="function"&&buildHlGrid(),console.log("WC Corporate Editor v25 \u2705 \u2014 Barra flotante, super/sub\xEDndice, resaltado, tablas avanzadas")},900),document.addEventListener("keydown",function(e){e.ctrlKey&&e.shiftKey&&e.key==="V"&&(e.preventDefault(),navigator.clipboard.readText().then(function(t){const ed=document.getElementById("editor");ed&&(ed.focus(),document.execCommand("insertText",!1,t),typeof showToast=="function"&&showToast("Pegado sin formato \u2705"))}).catch(function(){typeof showToast=="function"&&showToast("Ctrl+Shift+V: pega sin formato")}))})})();function openParaSpacingPanel(){const old=document.getElementById("__paraSpPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__paraSpPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:18px";const sel=window.getSelection();let curBefore=0,curAfter=8,curLine=1.08;if(sel&&sel.rangeCount){const node=sel.getRangeAt(0).startContainer;let p=node.nodeType===3?node.parentElement:node;const ed=document.getElementById("editor");for(;p&&p!==ed&&!/^(P|DIV|H[1-6]|LI|BLOCKQUOTE)$/.test(p.tagName);)p=p.parentElement;p&&p!==ed&&(curBefore=parseFloat(p.style.marginTop)||0,curAfter=parseFloat(p.style.marginBottom)||8,curLine=parseFloat(p.style.lineHeight)||1.08)}ov.innerHTML=`
  <div style="background:#fff;border-radius:18px;max-width:400px;width:100%;padding:24px;box-shadow:0 16px 48px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:20px;display:flex;align-items:center;gap:8px">
      <span>\u21A8</span> Espacio entre p\xE1rrafos
    </div>

    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:13px;color:#555;font-weight:600">Espacio antes (pt)</label>
        <span id="__spBeforeVal" style="font-size:13px;color:#0084ff;font-weight:700">${curBefore}pt</span>
      </div>
      <input type="range" id="__spBefore" min="0" max="48" step="2" value="${curBefore}"
        style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__spBeforeVal').textContent=this.value+'pt'">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:#bbb;margin-top:2px">
        <span>0pt</span><span>12pt</span><span>24pt</span><span>36pt</span><span>48pt</span>
      </div>
    </div>

    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:13px;color:#555;font-weight:600">Espacio despu\xE9s (pt)</label>
        <span id="__spAfterVal" style="font-size:13px;color:#0084ff;font-weight:700">${curAfter}pt</span>
      </div>
      <input type="range" id="__spAfter" min="0" max="48" step="2" value="${curAfter}"
        style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__spAfterVal').textContent=this.value+'pt'">
    </div>

    <div style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <label style="font-size:13px;color:#555;font-weight:600">Interlineado</label>
        <span id="__spLineVal" style="font-size:13px;color:#0084ff;font-weight:700">${curLine}</span>
      </div>
      <input type="range" id="__spLine" min="1" max="3" step="0.1" value="${curLine}"
        style="width:100%;accent-color:#0084ff"
        oninput="document.getElementById('__spLineVal').textContent=parseFloat(this.value).toFixed(1)">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:#bbb;margin-top:2px">
        <span>1.0</span><span>1.5</span><span>2.0</span><span>2.5</span><span>3.0</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
      <button onclick="__applyParaPreset(0,8,1.08)" style="padding:10px 6px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:11px;font-weight:600;background:#fafafa;transition:all .15s" onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
        Normal<br><span style="color:#888;font-weight:400">0/8pt \xB7 1.08</span>
      </button>
      <button onclick="__applyParaPreset(0,12,1.15)" style="padding:10px 6px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:11px;font-weight:600;background:#fafafa;transition:all .15s" onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
        Compacto<br><span style="color:#888;font-weight:400">0/12pt \xB7 1.15</span>
      </button>
      <button onclick="__applyParaPreset(12,12,1.5)" style="padding:10px 6px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:11px;font-weight:600;background:#fafafa;transition:all .15s" onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
        Holgado<br><span style="color:#888;font-weight:400">12/12pt \xB7 1.5</span>
      </button>
      <button onclick="__applyParaPreset(0,0,2)" style="padding:10px 6px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:11px;font-weight:600;background:#fafafa;transition:all .15s" onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
        APA<br><span style="color:#888;font-weight:400">0/0pt \xB7 2.0</span>
      </button>
      <button onclick="__applyParaPreset(0,6,1.5)" style="padding:10px 6px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:11px;font-weight:600;background:#fafafa;transition:all .15s" onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
        Word<br><span style="color:#888;font-weight:400">0/6pt \xB7 1.5</span>
      </button>
      <button onclick="__applyParaPreset(0,10,1.6)" style="padding:10px 6px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:11px;font-weight:600;background:#fafafa;transition:all .15s" onmouseover="this.style.borderColor='#0084ff'" onmouseout="this.style.borderColor='#eee'">
        Editorial<br><span style="color:#888;font-weight:400">0/10pt \xB7 1.6</span>
      </button>
    </div>

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
      <input type="checkbox" id="__spAllParas" style="width:16px;height:16px;accent-color:#0084ff">
      <label for="__spAllParas" style="font-size:13px;color:#555">Aplicar a todos los p\xE1rrafos del documento</label>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button onclick="document.getElementById('__paraSpPanel').remove()" style="padding:10px 18px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">Cancelar</button>
      <button onclick="__commitParaSpacing()" style="padding:10px 22px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">Aplicar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __applyParaPreset(before,after,line){document.getElementById("__spBefore").value=before,document.getElementById("__spAfter").value=after,document.getElementById("__spLine").value=line,document.getElementById("__spBeforeVal").textContent=before+"pt",document.getElementById("__spAfterVal").textContent=after+"pt",document.getElementById("__spLineVal").textContent=line.toFixed(1)}function __commitParaSpacing(){const before=document.getElementById("__spBefore").value+"pt",after=document.getElementById("__spAfter").value+"pt",line=parseFloat(document.getElementById("__spLine").value).toFixed(1),allParas=document.getElementById("__spAllParas").checked,ed=document.getElementById("editor");if(allParas)ed.querySelectorAll("p,h1,h2,h3,h4,li,blockquote").forEach(el=>{el.style.marginTop=before,el.style.marginBottom=after,el.style.lineHeight=line}),showToast("Espaciado aplicado a todo el documento \u2705");else{const sel=window.getSelection();if(sel&&sel.rangeCount){const node=sel.getRangeAt(0).startContainer;let p=node.nodeType===3?node.parentElement:node;for(;p&&p!==ed&&!/^(P|DIV|H[1-6]|LI|BLOCKQUOTE)$/.test(p.tagName);)p=p.parentElement;p&&p!==ed?(p.style.marginTop=before,p.style.marginBottom=after,p.style.lineHeight=line):ed.style.lineHeight=line}else ed.style.lineHeight=line;showToast("Espaciado aplicado al p\xE1rrafo \u2705")}document.getElementById("__paraSpPanel").remove()}function openWatermarkPanel(){const old=document.getElementById("__wmPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__wmPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:18px",ov.innerHTML=`
  <div style="background:#fff;border-radius:18px;max-width:420px;width:100%;padding:24px;box-shadow:0 16px 48px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:18px">\u{1F4A7} Marca de agua</div>

    <div style="display:flex;gap:8px;margin-bottom:16px">
      <button id="__wmTabText" onclick="__wmTab('text')" style="flex:1;padding:9px;border:2px solid #0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;background:#f0f7ff;color:#0084ff">\u{1F4DD} Texto</button>
      <button id="__wmTabImg" onclick="__wmTab('img')" style="flex:1;padding:9px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;background:#fafafa;color:#666">\u{1F5BC}\uFE0F Imagen</button>
    </div>

    <div id="__wmTextOpts">
      <div style="margin-bottom:12px">
        <label style="font-size:12px;color:#555;display:block;margin-bottom:4px">Texto</label>
        <input type="text" id="__wmText" value="CONFIDENCIAL" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:12px;color:#555;display:block;margin-bottom:4px">Color</label>
          <input type="color" id="__wmColor" value="#cccccc" style="width:100%;height:36px;border:none;border-radius:8px;cursor:pointer">
        </div>
        <div>
          <label style="font-size:12px;color:#555;display:block;margin-bottom:4px">Opacidad</label>
          <input type="range" id="__wmOpacity" min="0.03" max="0.35" step="0.01" value="0.12" style="width:100%;margin-top:10px;accent-color:#0084ff">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:12px;color:#555;display:block;margin-bottom:4px">Tama\xF1o (px)</label>
          <input type="number" id="__wmSize" value="72" min="24" max="200" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none">
        </div>
        <div>
          <label style="font-size:12px;color:#555;display:block;margin-bottom:4px">Rotaci\xF3n (\xB0)</label>
          <input type="number" id="__wmRot" value="-45" min="-90" max="90" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <button onclick="__wmPreset('CONFIDENCIAL')" style="padding:8px;border:1.5px solid #eee;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:#fafafa">CONFIDENCIAL</button>
        <button onclick="__wmPreset('BORRADOR')" style="padding:8px;border:1.5px solid #eee;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:#fafafa">BORRADOR</button>
        <button onclick="__wmPreset('SOLO LECTURA')" style="padding:8px;border:1.5px solid #eee;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:#fafafa">SOLO LECTURA</button>
        <button onclick="__wmPreset('USO INTERNO')" style="padding:8px;border:1.5px solid #eee;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:#fafafa">USO INTERNO</button>
        <button onclick="__wmPreset('APROBADO')" style="padding:8px;border:1.5px solid #27ae60;color:#27ae60;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:#f0fff4">APROBADO \u2713</button>
        <button onclick="__wmPreset('RECHAZADO')" style="padding:8px;border:1.5px solid #e74c3c;color:#e74c3c;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:#fff5f5">RECHAZADO \u2717</button>
      </div>
    </div>

    <div id="__wmImgOpts" style="display:none">
      <div style="border:2px dashed #ccc;border-radius:12px;padding:20px;text-align:center;margin-bottom:12px;cursor:pointer;background:#fafafa" onclick="document.getElementById('__wmImgInput').click()">
        <div style="font-size:32px;margin-bottom:8px">\u{1F5BC}\uFE0F</div>
        <div style="font-size:13px;color:#888">Toca para seleccionar imagen<br><span style="font-size:11px">PNG, JPG, SVG</span></div>
      </div>
      <input type="file" id="__wmImgInput" accept="image/*" style="display:none" onchange="__wmLoadImg(this)">
      <div id="__wmImgPreview" style="text-align:center;margin-bottom:12px;display:none">
        <img id="__wmImgThumb" style="max-height:80px;max-width:100%;border-radius:8px;border:1px solid #eee">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <div>
          <label style="font-size:12px;color:#555;display:block;margin-bottom:4px">Opacidad</label>
          <input type="range" id="__wmImgOpacity" min="0.03" max="0.5" step="0.01" value="0.15" style="width:100%;accent-color:#0084ff">
        </div>
        <div>
          <label style="font-size:12px;color:#555;display:block;margin-bottom:4px">Tama\xF1o (%)</label>
          <input type="range" id="__wmImgSize" min="10" max="90" step="5" value="40" style="width:100%;accent-color:#0084ff">
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="removeWatermark()" style="padding:10px 14px;border:1.5px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Quitar</button>
      <button onclick="document.getElementById('__wmPanel').remove()" style="padding:10px 16px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="applyWatermark()" style="padding:10px 20px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">Aplicar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __wmTab(tab){document.getElementById("__wmTextOpts").style.display=tab==="text"?"block":"none",document.getElementById("__wmImgOpts").style.display=tab==="img"?"block":"none",document.getElementById("__wmTabText").style.cssText=tab==="text"?"flex:1;padding:9px;border:2px solid #0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;background:#f0f7ff;color:#0084ff":"flex:1;padding:9px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;background:#fafafa;color:#666",document.getElementById("__wmTabImg").style.cssText=tab==="img"?"flex:1;padding:9px;border:2px solid #0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;background:#f0f7ff;color:#0084ff":"flex:1;padding:9px;border:2px solid #eee;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;background:#fafafa;color:#666"}function __wmPreset(text){document.getElementById("__wmText").value=text}function __wmLoadImg(inp){const f=inp.files[0];if(!f)return;const r=new FileReader;r.onload=e=>{document.getElementById("__wmImgThumb").src=e.target.result,document.getElementById("__wmImgPreview").style.display="block",window.__wmImgData=e.target.result},r.readAsDataURL(f)}function applyWatermark(){removeWatermark();const wrap=document.getElementById("editorPageWrap");if(!wrap)return;wrap.style.position="relative";const panel=document.getElementById("__wmPanel"),isImg=panel&&document.getElementById("__wmImgOpts").style.display==="block",wm=document.createElement("div");if(wm.id="__wcWatermark",wm.style.cssText="position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden;",isImg&&window.__wmImgData){const opacity=document.getElementById("__wmImgOpacity").value,size=document.getElementById("__wmImgSize").value;wm.style.cssText+="display:flex;align-items:center;justify-content:center;",wm.innerHTML=`<img src="${window.__wmImgData}" style="width:${size}%;opacity:${opacity};max-width:100%">`}else{const text=document.getElementById("__wmText").value.trim()||"CONFIDENCIAL",color=document.getElementById("__wmColor").value,opacity=document.getElementById("__wmOpacity").value,size=document.getElementById("__wmSize").value,rot=document.getElementById("__wmRot").value;wm.style.cssText+="display:flex;align-items:center;justify-content:center;",wm.innerHTML=`<div style="font-size:${size}px;font-weight:900;color:${color};opacity:${opacity};transform:rotate(${rot}deg);white-space:nowrap;letter-spacing:6px;user-select:none;font-family:Arial,sans-serif">${text}</div>`}wrap.appendChild(wm),panel&&panel.remove(),showToast("Marca de agua aplicada \u{1F4A7}")}function removeWatermark(){const old=document.getElementById("__wcWatermark");old&&(old.remove(),showToast("Marca de agua quitada"))}let _darkMode=!1;const _darkCSS=`
  body.wc-dark{background:#1a1a2e!important;}
  body.wc-dark .header{background:linear-gradient(135deg,#0f3460,#533483)!important;}
  body.wc-dark .menu-card{background:rgba(30,30,50,.85)!important;border-color:rgba(255,255,255,.1)!important;}
  body.wc-dark .menu-btn{color:#e0e0e0!important;}
  body.wc-dark .menu-btn:hover{background:rgba(255,255,255,.1)!important;}
  body.wc-dark .content{background:#16213e!important;}
  body.wc-dark .tiptap{background:#1e1e2e!important;color:#e0e0e0!important;border-color:#333!important;box-shadow:0 2px 12px rgba(0,0,0,.4)!important;}
  body.wc-dark .tiptap h1,body.wc-dark .tiptap h2{color:#74b9ff!important;}
  body.wc-dark .tiptap h3{color:#a29bfe!important;}
  body.wc-dark .tiptap a{color:#74b9ff!important;}
  body.wc-dark .tiptap td,body.wc-dark .tiptap th{border-color:#444!important;color:#e0e0e0!important;}
  body.wc-dark .tiptap th{background:#2d2d44!important;}
  body.wc-dark .footer{background:#1e1e2e!important;border-color:#333!important;}
  body.wc-dark .footer .stats,body.wc-dark .footer .author{color:#888!important;}
  body.wc-dark .bottom-nav{background:#1e1e2e!important;box-shadow:0 -2px 10px rgba(0,0,0,.4)!important;}
  body.wc-dark .nav-btn{color:#e0e0e0!important;}
  body.wc-dark .nav-btn:hover{background:#2d2d44!important;}
  body.wc-dark .statusbar{background:#1e1e2e!important;border-color:#333!important;color:#666!important;}
  body.wc-dark .dropdown{background:#1e1e2e!important;}
  body.wc-dark .di{color:#e0e0e0!important;}
  body.wc-dark .di:hover{background:#2d2d44!important;}
  body.wc-dark .dib .tit{color:#e0e0e0!important;}
  body.wc-dark .dsec{color:#666!important;}
  body.wc-dark .dd{background:#333!important;}
  body.wc-dark .mb{background:#1e1e2e!important;}
  body.wc-dark .mb h3{color:#e0e0e0!important;}
  body.wc-dark .tcard{border-color:#444!important;color:#e0e0e0!important;background:#2d2d44!important;}
  body.wc-dark .tcard:hover{border-color:#0084ff!important;background:#1e3a5f!important;}
  body.wc-dark .fabbtn{background:#2d2d44!important;color:#e0e0e0!important;border-color:#444!important;}
  body.wc-dark .fabbtn:hover{background:#0084ff!important;color:#fff!important;}
  body.wc-dark .fbtn{background:#2d2d44!important;color:#e0e0e0!important;border-color:#444!important;}
  body.wc-dark #fabPanel,body.wc-dark #communityPanel{background:#1e1e2e!important;box-shadow:0 8px 40px rgba(0,0,0,.5)!important;}
  body.wc-dark #fabPanel h4{color:#666!important;}
  body.wc-dark .minput{background:#2d2d44!important;border-color:#444!important;color:#e0e0e0!important;}
  body.wc-dark #dictBox{background:#1e1e2e!important;border-color:#333!important;}
  body.wc-dark #dictHeader{background:#2d2d44!important;border-color:#333!important;}
  body.wc-dark #dictSearch{background:#2d2d44!important;border-color:#444!important;color:#e0e0e0!important;}
  body.wc-dark .dict-lang-tag{background:#2d2d44!important;color:#ccc!important;}
  body.wc-dark .dict-word{color:#74b9ff!important;}
  body.wc-dark #aiBox{background:#1e1e2e!important;}
  body.wc-dark .aib{background:#2d2d44!important;color:#e0e0e0!important;}
  body.wc-dark #aiInp{background:#2d2d44!important;border-color:#444!important;color:#e0e0e0!important;}
  body.wc-dark .doc-editor{background:#1e1e2e!important;color:#e0e0e0!important;border-color:#333!important;}
  body.wc-dark #docWindow{background:#1e1e2e!important;}
  body.wc-dark .doc-toolbar,body.wc-dark .doc-footer{background:#2d2d44!important;border-color:#333!important;}
  body.wc-dark .dw-fmt{background:#2d2d44!important;border-color:#444!important;color:#e0e0e0!important;}
  body.wc-dark .exp-item{color:#e0e0e0!important;}
  body.wc-dark .exp-item:hover{background:#2d2d44!important;}
  body.wc-dark #exportBox{background:#1e1e2e!important;}
  body.wc-dark .exp-title{color:#e0e0e0!important;border-color:#333!important;}
  body.wc-dark #ruler{background:linear-gradient(#1e1e2e,#16213e)!important;border-color:#333!important;}
`;function toggleDarkMode(){if(_darkMode=!_darkMode,_darkMode){let st=document.getElementById("__darkStyle");st||(st=document.createElement("style"),st.id="__darkStyle",document.head.appendChild(st)),st.textContent=_darkCSS,document.body.classList.add("wc-dark"),localStorage.setItem("wc-dark","1"),showToast("Modo oscuro activado \u{1F319}");const btn=document.getElementById("__darkBtn");btn&&(btn.textContent="\u2600\uFE0F Modo claro",btn.title="Cambiar a modo claro")}else{document.body.classList.remove("wc-dark"),localStorage.setItem("wc-dark","0"),showToast("Modo claro activado \u2600\uFE0F");const btn=document.getElementById("__darkBtn");btn&&(btn.textContent="\u{1F319} Modo oscuro",btn.title="Cambiar a modo oscuro")}}function addDarkModeButton(){if(document.getElementById("__darkBtn"))return;const btn=document.createElement("button");btn.id="__darkBtn",btn.title="Cambiar modo oscuro/claro",btn.textContent=_darkMode?"\u2600\uFE0F Modo claro":"\u{1F319} Modo oscuro",btn.style.cssText="position:fixed;top:14px;right:14px;z-index:9000;background:rgba(0,0,0,.35);color:#fff;border:none;border-radius:20px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;backdrop-filter:blur(10px);transition:all .2s",btn.onmouseover=()=>btn.style.background="rgba(0,0,0,.55)",btn.onmouseout=()=>btn.style.background="rgba(0,0,0,.35)",btn.onclick=toggleDarkMode,document.body.appendChild(btn)}(function(){localStorage.getItem("wc-dark")==="1"&&(_darkMode=!1,toggleDarkMode())})();async function openSynonymsPanel(){const sel=window.getSelection(),word=sel&&sel.toString().trim()||"",old=document.getElementById("__synPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__synPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:18px",ov.innerHTML=`
  <div style="background:#fff;border-radius:18px;max-width:420px;width:100%;padding:24px;box-shadow:0 16px 48px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      <span>\u{1F4DA}</span> Sin\xF3nimos y variantes
    </div>
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <input type="text" id="__synWord" value="${word.replace(/"/g,"&quot;")}" placeholder="Escribe una palabra..."
        style="flex:1;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none"
        onkeydown="if(event.key==='Enter')fetchSynonyms()">
      <button onclick="fetchSynonyms()" style="padding:10px 18px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">Buscar</button>
    </div>
    <div id="__synResults" style="min-height:80px;font-size:13px;color:#888;text-align:center;padding:20px 0">
      ${word?"Cargando...":"Escribe una palabra y presiona Buscar"}
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:14px">
      <button onclick="document.getElementById('__synPanel').remove()" style="padding:10px 18px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),word&&fetchSynonyms()}async function fetchSynonyms(){const word=document.getElementById("__synWord").value.trim(),results=document.getElementById("__synResults");if(!word){results.innerHTML='<span style="color:#e74c3c">Escribe una palabra primero</span>';return}const key=localStorage.getItem("wc-groq-key");if(!key){results.innerHTML=`<div style="background:#fff3cd;border-radius:10px;padding:12px;color:#856404;font-size:13px">
      \u26A0\uFE0F Necesitas configurar tu API Key de Groq en el panel IA (men\xFA IA \u{1F999})
    </div>`;return}results.innerHTML='<div style="color:#0084ff;text-align:center;padding:20px">\u{1F999} Buscando sin\xF3nimos...</div>';try{const data=await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Eres un diccionario de sin\xF3nimos en espa\xF1ol. Responde SOLO en JSON v\xE1lido, sin texto adicional, sin markdown."},{role:"user",content:`Dame sin\xF3nimos y variantes de la palabra "${word}". 
Responde SOLO con este JSON exacto (sin backticks, sin texto extra):
{
  "formales": ["s1","s2","s3","s4","s5"],
  "coloquiales": ["s1","s2","s3"],
  "literarios": ["s1","s2","s3"],
  "antonimos": ["a1","a2","a3"],
  "definicion": "definici\xF3n breve en 1 oraci\xF3n"
}`}],temperature:.3,max_tokens:400})})).json();if(data.error){results.innerHTML=`<span style="color:#e74c3c">Error: ${data.error.message}</span>`;return}const raw=data?.choices?.[0]?.message?.content||"{}";let syn;try{syn=JSON.parse(raw.replace(/```json|```/g,"").trim())}catch{syn=null}if(!syn){results.innerHTML=`<div style="white-space:pre-wrap;font-size:13px;color:#333;line-height:1.6">${raw}</div>`;return}const renderGroup=(label,color,words)=>!words||!words.length?"":`<div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;color:${color};letter-spacing:.5px;margin-bottom:6px;text-transform:uppercase">${label}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${words.map(w=>`<button onclick="__insertSynonym('${w.replace(/'/g,"\\'")}',this)" style="background:#f0f7ff;border:1.5px solid #c0d8f0;border-radius:20px;padding:5px 12px;font-size:13px;color:#0066cc;cursor:pointer;transition:all .15s;font-weight:500" onmouseover="this.style.background='#0084ff';this.style.color='#fff'" onmouseout="this.style.background='#f0f7ff';this.style.color='#0066cc'">${w}</button>`).join("")}
        </div>
      </div>`;results.innerHTML=`
      ${syn.definicion?`<div style="background:#f8f9fa;border-left:3px solid #0084ff;padding:10px 14px;border-radius:0 8px 8px 0;font-size:13px;color:#444;margin-bottom:14px;font-style:italic">${syn.definicion}</div>`:""}
      ${renderGroup("Formales","#0084ff",syn.formales)}
      ${renderGroup("Coloquiales","#f39c12",syn.coloquiales)}
      ${renderGroup("Literarios","#9b59b6",syn.literarios)}
      ${renderGroup("Ant\xF3nimos","#e74c3c",syn.antonimos)}
      <div style="font-size:11px;color:#bbb;text-align:center;margin-top:8px">Toca una palabra para insertarla en el documento</div>
    `}catch(e){results.innerHTML=`<span style="color:#e74c3c">Error de conexi\xF3n: ${e.message}</span>`}}function __insertSynonym(word,btn){const ed=document.getElementById("editor");if(!ed)return;const sel=window.getSelection();sel&&!sel.isCollapsed&&ed.contains(sel.anchorNode)?document.execCommand("insertText",!1,word):(ed.focus(),document.execCommand("insertText",!1," "+word+" ")),btn.style.background="#27ae60",btn.style.borderColor="#27ae60",btn.style.color="#fff",setTimeout(()=>{btn.style.background="#f0f7ff",btn.style.borderColor="#c0d8f0",btn.style.color="#0066cc"},800),showToast(`"${word}" insertado \u2705`)}let _mlListCounter={},_mlListActive=!1;function insertMultilevelList(){const old=document.getElementById("__mlPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__mlPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:18px",ov.innerHTML=`
  <div style="background:#fff;border-radius:18px;max-width:420px;width:100%;padding:24px;box-shadow:0 16px 48px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      <span>\u{1F4CB}</span> Lista multinivel
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${[{id:"ml1",label:"1. Num\xE9rico",preview:`1. Elemento
  1.1. Sub
    1.1.1. Sub-sub`,style:"numeric"},{id:"ml2",label:"\u2022 Vi\xF1etas mix",preview:`\u2022 Nivel 1
  \u25E6 Nivel 2
    \u25AA Nivel 3`,style:"bullets"},{id:"ml3",label:"A. Letras",preview:`A. Elemento
  a) Sub
    i. Sub-sub`,style:"alpha"},{id:"ml4",label:"I. Romano",preview:`I. Primero
  A. Sub
    1. Detalle`,style:"roman"},{id:"ml5",label:"\u2776 Encerrado",preview:`\u2776 Primero
  \u2777 Segundo
    \u2778 Tercero`,style:"circled"},{id:"ml6",label:"\u2192 Flechas",preview:`\u2192 Paso 1
  \u21D2 Paso 1.1
    \u27F9 Paso 1.1.1`,style:"arrows"}].map(t=>`<button onclick="__insertMLList('${t.style}')" style="padding:12px;border:2px solid #eee;border-radius:12px;cursor:pointer;text-align:left;background:#fafafa;transition:all .15s" onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'" onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
        <div style="font-size:12px;font-weight:700;color:#0084ff;margin-bottom:6px">${t.label}</div>
        <pre style="font-size:10px;color:#666;margin:0;font-family:'Courier New',monospace;line-height:1.5">${t.preview}</pre>
      </button>`).join("")}
    </div>

    <div style="background:#f8f9fa;border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:600;color:#555;margin-bottom:8px">Vista previa y edici\xF3n r\xE1pida</div>
      <textarea id="__mlCustom" rows="5" style="width:100%;padding:8px;border:1px solid #e0e0e0;border-radius:8px;font-size:12px;font-family:'Courier New',monospace;resize:vertical;outline:none;box-sizing:border-box" placeholder="Escribe los elementos (uno por l\xEDnea)&#10;Usa Tab para subniveles">Elemento 1
  Sub-elemento 1.1
  Sub-elemento 1.2
    Sub-sub 1.2.1
Elemento 2
Elemento 3</textarea>
    </div>

    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="document.getElementById('__mlPanel').remove()" style="padding:10px 18px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__insertCustomML()" style="padding:10px 22px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">Insertar lista</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}const _mlStyles={numeric:{0:n=>`${n}.`,1:(n,p)=>`${p}${n}.`,2:(n,p)=>`${p}${n}.`},bullets:{0:()=>"\u2022",1:()=>"\u25E6",2:()=>"\u25AA"},alpha:{0:n=>String.fromCharCode(64+n)+".",1:n=>String.fromCharCode(96+n)+")",2:n=>(["i","ii","iii","iv","v","vi","vii","viii","ix","x"][n-1]||n)+"."},roman:{0:n=>(["I","II","III","IV","V","VI","VII","VIII","IX","X"][n-1]||n)+".",1:n=>String.fromCharCode(64+n)+".",2:n=>`${n}.`},circled:{0:n=>["\u2776","\u2777","\u2778","\u2779","\u277A","\u277B","\u277C","\u277D","\u277E","\u277F"][n-1]||`${n}.`,1:n=>["\u2460","\u2461","\u2462","\u2463","\u2464","\u2465","\u2466","\u2467","\u2468","\u2469"][n-1]||`${n}.`,2:n=>["\u2474","\u2475","\u2476","\u2477","\u2478","\u2479","\u247A","\u247B","\u247C","\u247D"][n-1]||`${n}.`},arrows:{0:()=>"\u2192",1:()=>"\u21D2",2:()=>"\u27F9"}};function __insertMLList(style){const lines=document.getElementById("__mlCustom").value.split(`
`);__buildAndInsertML(lines,style),document.getElementById("__mlPanel").remove()}function __insertCustomML(){const lines=document.getElementById("__mlCustom").value.split(`
`);__buildAndInsertML(lines,"numeric"),document.getElementById("__mlPanel").remove()}function __buildAndInsertML(lines,style){const st=_mlStyles[style]||_mlStyles.numeric,counters=[0,0,0],paddings=["0.3cm","1.1cm","2.0cm"],colors=["#1a1a1a","#333","#555"];let html='<div style="margin:10px 0;line-height:1.7">';lines.forEach(raw=>{const trimmed=raw.trimEnd();if(!trimmed.trim())return;let level=0;trimmed.startsWith("		")||trimmed.startsWith("      ")?level=2:(trimmed.startsWith("	")||trimmed.startsWith("  ")||trimmed.startsWith("    "))&&(level=1);for(let i=level+1;i<3;i++)counters[i]=0;counters[level]++;const markerFn=st[level];let marker;if(typeof markerFn=="function")if(style==="numeric"&&level>0){const parts=[];for(let i=0;i<=level;i++)parts.push(counters[i]);marker=parts.join(".")+"."}else marker=markerFn(counters[level],counters.slice(0,level).join(".")+".");else marker="\u2022";const text=trimmed.trim(),fontWeight=level===0?"600":"400";html+=`<div style="display:flex;align-items:baseline;gap:8px;padding-left:${paddings[level]};color:${colors[level]};font-weight:${fontWeight}">
      <span style="min-width:${level===0?"1.8em":"1.4em"};color:#0084ff;font-weight:700;flex-shrink:0">${marker}</span>
      <span>${text}</span>
    </div>`}),html+="</div><p></p>",insertHTML(html),showToast("Lista multinivel insertada \u2705")}document.addEventListener("keydown",function(e){const ed=document.getElementById("editor");if(!(!ed||!ed.contains(document.activeElement)&&document.activeElement!==ed)&&e.key==="Tab"&&!e.ctrlKey&&!e.altKey){const sel=window.getSelection();if(sel&&sel.rangeCount){const node=sel.anchorNode;node&&(node.nodeType===3?node.parentElement:node).closest("li")&&(e.preventDefault(),document.execCommand(e.shiftKey?"outdent":"indent",!1,null))}}}),(function(){setTimeout(function(){addDarkModeButton();const origHandleAction=window.handleAction;typeof origHandleAction=="function"&&(window.handleAction=function(a){switch(a){case"paraSpacing":openParaSpacingPanel();break;case"watermark":openWatermarkPanel();break;case"darkMode":toggleDarkMode();break;case"synonyms":openSynonymsPanel();break;case"multilevelList":insertMultilevelList();break;case"removeWatermark":removeWatermark();break;default:origHandleAction(a)}}),console.log("WC Corporate Editor v25.2 \u2705 \u2014 Espaciado p\xE1rrafo, Marca de agua, Modo oscuro, Sin\xF3nimos IA, Lista multinivel")},1e3)})();const WC_THEMES={corporativo:{name:"Azul Corporativo",icon:"\u{1F4BC}",header:"linear-gradient(135deg, #0084ff 0%, #0050cc 100%)",accent:"#0084ff",accentDark:"#0050cc",accentLight:"#e8f4ff",editorBg:"#ffffff",pageBg:"#e8e8ec",menuCard:"rgba(255,255,255,.18)",text:"#1a1a1a",fab:"linear-gradient(135deg, #0084ff, #0050cc)",community:"linear-gradient(135deg, #27ae60, #1e8449)"},costarica:{name:"Verde Costa Rica",icon:"\u{1F1E8}\u{1F1F7}",header:"linear-gradient(135deg, #003da5 0%, #ce1126 50%, #003da5 100%)",accent:"#27ae60",accentDark:"#1e8449",accentLight:"#e8f8ee",editorBg:"#ffffff",pageBg:"#e8ede8",menuCard:"rgba(255,255,255,.18)",text:"#1a1a1a",fab:"linear-gradient(135deg, #27ae60, #003da5)",community:"linear-gradient(135deg, #ce1126, #003da5)"},elegante:{name:"Oscuro Elegante",icon:"\u{1F5A4}",header:"linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",accent:"#e2b96f",accentDark:"#c9a050",accentLight:"#2d2d1a",editorBg:"#1e1e2e",pageBg:"#16213e",menuCard:"rgba(30,30,50,.85)",text:"#e0e0e0",fab:"linear-gradient(135deg, #e2b96f, #c9a050)",community:"linear-gradient(135deg, #533483, #e2b96f)"},institucional:{name:"Rojo Institucional",icon:"\u{1F3DB}\uFE0F",header:"linear-gradient(135deg, #8b0000 0%, #c0392b 100%)",accent:"#c0392b",accentDark:"#8b0000",accentLight:"#fdf2f2",editorBg:"#ffffff",pageBg:"#f0e8e8",menuCard:"rgba(255,255,255,.18)",text:"#1a1a1a",fab:"linear-gradient(135deg, #c0392b, #8b0000)",community:"linear-gradient(135deg, #8b0000, #c0392b)"},premium:{name:"Dorado Premium",icon:"\u2728",header:"linear-gradient(135deg, #1a1a2e 0%, #2d2416 50%, #1a1a2e 100%)",accent:"#f39c12",accentDark:"#d68910",accentLight:"#fffbf0",editorBg:"#fffff8",pageBg:"#f5f0e8",menuCard:"rgba(255,248,220,.25)",text:"#2d1a00",fab:"linear-gradient(135deg, #f39c12, #d68910)",community:"linear-gradient(135deg, #d68910, #f39c12)"}};let _currentTheme=localStorage.getItem("wc-theme")||"corporativo";function openThemePanel(){const old=document.getElementById("__themePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__themePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const cards=Object.entries(WC_THEMES).map(([key,t])=>`
    <div onclick="applyTheme('${key}')" style="
      border:3px solid ${key===_currentTheme?t.accent:"#eee"};
      border-radius:16px;padding:16px 12px;cursor:pointer;text-align:center;
      background:${key===_currentTheme?t.accentLight:"#fafafa"};
      transition:all .2s;flex:1;min-width:120px;max-width:140px;
    " onmouseover="this.style.borderColor='${t.accent}';this.style.transform='translateY(-4px)'"
       onmouseout="this.style.borderColor='${key===_currentTheme?t.accent:"#eee"}';this.style.transform='translateY(0)'">
      <div style="font-size:28px;margin-bottom:8px">${t.icon}</div>
      <div style="
        height:28px;border-radius:8px;margin-bottom:8px;
        background:${t.header};
      "></div>
      <div style="font-size:11px;font-weight:700;color:#333;line-height:1.3">${t.name}</div>
      ${key===_currentTheme?`<div style="font-size:10px;color:${t.accent};font-weight:700;margin-top:4px">\u2713 Activo</div>`:""}
    </div>
  `).join("");ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:600px;padding:20px 16px 32px;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 16px"></div>
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px;text-align:center">\u{1F3A8} Temas ejecutivos</div>
    <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;justify-content:center;flex-wrap:wrap">
      ${cards}
    </div>
    <button onclick="document.getElementById('__themePanel').remove()" style="
      margin-top:16px;width:100%;padding:13px;border:none;
      background:#f0f0f0;border-radius:12px;font-size:15px;font-weight:600;
      cursor:pointer;color:#333
    ">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function applyTheme(key){const t=WC_THEMES[key];if(!t)return;_currentTheme=key,localStorage.setItem("wc-theme",key);const header=document.querySelector(".header");header&&(header.style.background=t.header);let styleEl=document.getElementById("__themeStyle");styleEl||(styleEl=document.createElement("style"),styleEl.id="__themeStyle",document.head.appendChild(styleEl)),styleEl.textContent=`
    .menu-btn:hover, .menu-btn.active { background: ${t.accentLight} !important; }
    .di:hover, .dib:hover { background: ${t.accentLight} !important; }
    #dictSearch:focus { border-color: ${t.accent} !important; }
    .tiptap:focus { border-color: ${t.accent} !important; box-shadow: 0 0 0 3px ${t.accent}22 !important; }
    .badge { background: ${t.accent} !important; }
    .btn1 { background: ${t.accent} !important; }
    #aiSend { background: ${t.accent} !important; }
    .ai-quick-btn { color: ${t.accentDark} !important; border-color: ${t.accent}44 !important; }
    .ai-quick-btn:hover { background: ${t.accent} !important; color: #fff !important; }
    #fabBtn { background: ${t.fab} !important; }
    #communityBtn { background: ${t.community} !important; }
    .dict-lang-tag b { color: ${t.accent} !important; }
    .dict-word { color: ${t.accentDark} !important; }
    #dictHeader h3 { color: ${t.accentDark} !important; }
    .fabbtn:hover { background: ${t.accent} !important; border-color: ${t.accent} !important; }
    .tcard:hover { border-color: ${t.accent} !important; background: ${t.accentLight} !important; }
    .aiu { background: ${t.accent} !important; }
    #aiInp:focus { border-color: ${t.accent} !important; }
    .content { background: ${t.pageBg} !important; }
    ${key==="elegante"?`
      body { background: #1a1a2e !important; }
      .tiptap { background: #1e1e2e !important; color: #e0e0e0 !important; }
      .footer { background: #1e1e2e !important; border-color: #333 !important; }
      .bottom-nav { background: #1e1e2e !important; }
      .dropdown { background: #1e1e2e !important; }
      .di, .dib .tit { color: #e0e0e0 !important; }
      .mb { background: #1e1e2e !important; }
      .mb h3 { color: #e0e0e0 !important; }
    `:`
      body { background: #f5f5f5 !important; }
      .tiptap { background: ${t.editorBg} !important; color: ${t.text} !important; }
      .footer { background: #fff !important; }
      .bottom-nav { background: #fff !important; }
    `}
  `;const old=document.getElementById("__themePanel");old&&old.remove(),showToast(`Tema "${t.name}" aplicado ${t.icon}`),wcAnimate(document.querySelector(".header"),"pulse")}(function(){const saved=localStorage.getItem("wc-theme");saved&&WC_THEMES[saved]&&setTimeout(()=>applyTheme(saved),600)})(),(function(){const st=document.createElement("style");st.id="__wcAnimCSS",st.textContent=`
    @keyframes wcFadeIn {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes wcSlideIn {
      from { opacity:0; transform:translateX(-12px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes wcPop {
      0%   { transform:scale(1); }
      40%  { transform:scale(1.06); }
      100% { transform:scale(1); }
    }
    @keyframes wcPulse {
      0%   { opacity:1; }
      50%  { opacity:.7; }
      100% { opacity:1; }
    }
    @keyframes wcShake {
      0%,100% { transform:translateX(0); }
      20%,60% { transform:translateX(-4px); }
      40%,80% { transform:translateX(4px); }
    }
    @keyframes wcGlow {
      0%,100% { box-shadow:0 0 0 0 rgba(0,132,255,.4); }
      50%     { box-shadow:0 0 0 8px rgba(0,132,255,.0); }
    }
    .wc-anim-fadein  { animation: wcFadeIn .25s ease both; }
    .wc-anim-slidein { animation: wcSlideIn .2s ease both; }
    .wc-anim-pop     { animation: wcPop .3s ease both; }
    .wc-anim-pulse   { animation: wcPulse .5s ease; }
    .wc-anim-shake   { animation: wcShake .35s ease; }
    .wc-anim-glow    { animation: wcGlow .6s ease; }

    /* Transiciones suaves globales */
    .menu-btn        { transition: all .2s cubic-bezier(.4,0,.2,1) !important; }
    .di, .dib        { transition: background .15s ease !important; }
    .fabbtn          { transition: all .18s cubic-bezier(.4,0,.2,1) !important; }
    .tcard           { transition: all .2s cubic-bezier(.4,0,.2,1) !important; }
    .nav-btn         { transition: all .15s ease !important; }
    .btn1, .btn2     { transition: all .18s ease !important; }
    .btn1:hover      { transform: translateY(-1px); box-shadow:0 4px 12px rgba(0,132,255,.3); }
    .btn2:hover      { transform: translateY(-1px); }
    .tiptap          { transition: border-color .2s ease, box-shadow .2s ease !important; }
    .toast           { transition: opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1) !important; }
    .toast.show      { transform:translateX(-50%) translateY(0) !important; }
    .toast:not(.show){ transform:translateX(-50%) translateY(10px) !important; }

    /* Inserci\xF3n de contenido en el editor */
    .tiptap *:last-child { animation: wcFadeIn .2s ease both; }

    /* Dropdown animado */
    .dropdown.show { animation: wcFadeIn .2s cubic-bezier(.32,.72,0,1) both !important; }

    /* Modales */
    .mo.show .mb { animation: wcFadeIn .22s cubic-bezier(.32,.72,0,1) both; }

    /* Bot\xF3n FAB */
    #fabBtn { transition: all .2s cubic-bezier(.4,0,.2,1) !important; }
    #fabBtn:hover { transform: scale(1.05) !important; }
    #fabBtn:active { transform: scale(0.96) !important; }
    #communityBtn:hover { transform: scale(1.05) !important; }
    #communityBtn:active { transform: scale(0.96) !important; }

    /* Barra flotante */
    #floatBar { transition: opacity .15s ease !important; }
    #floatBar button { transition: background .12s ease, transform .1s ease !important; }
    #floatBar button:active { transform: scale(0.9) !important; }

    /* Items del diccionario */
    .dict-entry { transition: background .15s ease; }
    .dict-entry:hover { background: #f8f9ff; border-radius: 8px; }
  `,document.head.appendChild(st)})();function wcAnimate(el,type){if(!el)return;const cls="wc-anim-"+type;el.classList.remove(cls),el.offsetWidth,el.classList.add(cls),setTimeout(()=>el.classList.remove(cls),600)}(function(){const ed=document.getElementById("editor");if(!ed)return;const orig=window.insertHTML;typeof orig=="function"&&(window.insertHTML=function(html){orig(html),wcAnimate(ed.lastElementChild,"fadein")});const origToast=window.showToast;typeof origToast=="function"&&(window.showToast=function(m){origToast(m),wcAnimate(document.getElementById("toast"),"pop")})})();const WC_FONTS=[{name:"Calibri",family:"'Calibri','Carlito',sans-serif",cat:"Ejecutiva",sample:"Aa"},{name:"Arial",family:"Arial,sans-serif",cat:"Ejecutiva",sample:"Aa"},{name:"Helvetica",family:"'Helvetica Neue',Helvetica,sans-serif",cat:"Ejecutiva",sample:"Aa"},{name:"Times New Roman",family:"'Times New Roman',Times,serif",cat:"Acad\xE9mica",sample:"Aa"},{name:"Georgia",family:"Georgia,serif",cat:"Acad\xE9mica",sample:"Aa"},{name:"Garamond",family:"'EB Garamond',Garamond,serif",cat:"Acad\xE9mica",sample:"Aa"},{name:"Palatino",family:"Palatino,'Palatino Linotype',serif",cat:"Acad\xE9mica",sample:"Aa"},{name:"Verdana",family:"Verdana,Geneva,sans-serif",cat:"Pantalla",sample:"Aa"},{name:"Trebuchet MS",family:"'Trebuchet MS',sans-serif",cat:"Pantalla",sample:"Aa"},{name:"Tahoma",family:"Tahoma,Geneva,sans-serif",cat:"Pantalla",sample:"Aa"},{name:"Courier New",family:"'Courier New',Courier,monospace",cat:"C\xF3digo",sample:"Aa"},{name:"Lucida Console",family:"'Lucida Console',Monaco,monospace",cat:"C\xF3digo",sample:"Aa"},{name:"Impact",family:"Impact,'Arial Narrow',sans-serif",cat:"T\xEDtulos",sample:"Aa"},{name:"Comic Sans MS",family:"'Comic Sans MS',cursive",cat:"Informal",sample:"Aa"},{name:"Rockwell",family:"Rockwell,'Courier Bold',serif",cat:"T\xEDtulos",sample:"Aa"}];let _fontSearch="";function openFontPanel(){const old=document.getElementById("__fontPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__fontPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:600px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 16px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:12px">\u{1F524} Tipo de letra</div>
      <input type="text" id="__fontSearch" placeholder="Buscar fuente..."
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px"
        oninput="__renderFontList(this.value)"
        onfocus="this.style.borderColor='#0084ff'"
        onblur="this.style.borderColor='#e0e0e0'">
    </div>
    <div id="__fontList" style="flex:1;overflow-y:auto;padding:0 12px 20px"></div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),__renderFontList("")}function __renderFontList(search){const container=document.getElementById("__fontList");if(!container)return;const q=search.toLowerCase(),filtered=WC_FONTS.filter(f=>!q||f.name.toLowerCase().includes(q)||f.cat.toLowerCase().includes(q)),cats={};filtered.forEach(f=>{cats[f.cat]||(cats[f.cat]=[]),cats[f.cat].push(f)});let html="";Object.entries(cats).forEach(([cat,fonts])=>{html+=`<div style="font-size:10px;font-weight:700;color:#aaa;letter-spacing:.8px;text-transform:uppercase;padding:12px 4px 6px">${cat}</div>`,fonts.forEach(f=>{html+=`
      <div onclick="__applyFont('${f.name}','${f.family.replace(/'/g,"\\'")}')"
        style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer;transition:background .15s;margin-bottom:2px"
        onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='none'">
        <div style="width:44px;height:44px;background:#f8f9fa;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;font-family:${f.family};flex-shrink:0;border:1.5px solid #eee">${f.sample}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:3px">${f.name}</div>
          <div style="font-size:12px;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:${f.family}">El r\xE1pido zorro marr\xF3n salta sobre el perro perezoso</div>
        </div>
        <div style="font-size:10px;background:#f0f7ff;color:#0084ff;border-radius:6px;padding:2px 8px;flex-shrink:0;font-weight:600">${f.cat}</div>
      </div>`})}),filtered.length||(html='<div style="text-align:center;color:#aaa;padding:30px">No se encontr\xF3 "'+search+'"</div>'),container.innerHTML=html}function __applyFont(name,family){restoreSelection&&restoreSelection(),document.execCommand("fontName",!1,name),document.getElementById("__fontPanel").remove(),showToast("Fuente: "+name+" \u2705"),wcAnimate(document.getElementById("editor"),"glow")}function initStatusBarPro(){const sb=document.getElementById("statusbar");if(!sb)return;sb.style.cssText=`
    position:fixed;bottom:60px;left:0;width:100%;
    background:#fff;padding:0;
    border-top:1px solid #e8e8ec;z-index:99;
    display:flex;align-items:center;overflow:hidden;
    font-family:-apple-system,'Segoe UI',sans-serif;
    box-shadow:0 -1px 8px rgba(0,0,0,.06);
  `,sb.innerHTML=`
    <div id="__sbScroll" style="display:flex;align-items:center;gap:0;overflow-x:auto;flex:1;scrollbar-width:none">
      <div class="__sbItem" id="__sbWords" style="padding:6px 12px;font-size:11px;color:#555;border-right:1px solid #eee;white-space:nowrap;display:flex;align-items:center;gap:5px">
        <span style="color:#0084ff">\u270E</span> <span>0 palabras</span>
      </div>
      <div class="__sbItem" id="__sbChars" style="padding:6px 10px;font-size:11px;color:#555;border-right:1px solid #eee;white-space:nowrap">
        0 caracteres
      </div>
      <div class="__sbItem" id="__sbTime" style="padding:6px 10px;font-size:11px;color:#555;border-right:1px solid #eee;white-space:nowrap;display:flex;align-items:center;gap:4px">
        <span>\u23F1</span> <span>~0 min lectura</span>
      </div>
      <div class="__sbItem" id="__sbParas" style="padding:6px 10px;font-size:11px;color:#555;border-right:1px solid #eee;white-space:nowrap">
        0 p\xE1rrafos
      </div>
      <div class="__sbItem" id="__sbLang" style="padding:6px 10px;font-size:11px;color:#555;border-right:1px solid #eee;white-space:nowrap;display:flex;align-items:center;gap:4px">
        <span>\u{1F310}</span> <span>ES</span>
      </div>
      <div class="__sbItem" id="__sbLevel" style="padding:6px 10px;font-size:11px;color:#555;border-right:1px solid #eee;white-space:nowrap">
        \u{1F4CA} \u2014
      </div>
      <div class="__sbItem" id="__sbSave" style="padding:6px 10px;font-size:11px;color:#27ae60;white-space:nowrap;display:flex;align-items:center;gap:4px">
        <span>\u{1F4BE}</span> <span>Guardado</span>
      </div>
    </div>
    <div id="__sbZoom" style="padding:6px 12px;font-size:11px;color:#555;border-left:1px solid #eee;white-space:nowrap;display:flex;align-items:center;gap:4px;flex-shrink:0;cursor:pointer" onclick="__sbCycleZoom()" title="Cambiar zoom">
      <span>\u{1F50D}</span><span id="__sbZoomVal">100%</span>
    </div>
  `,updateStatusBarPro();const ed=document.getElementById("editor");ed&&(ed.addEventListener("input",updateStatusBarPro),ed.addEventListener("keyup",updateStatusBarPro)),setInterval(()=>{const ed2=document.getElementById("editor");if(ed2){localStorage.setItem("wc-v25",ed2.innerHTML);const sv=document.getElementById("__sbSave");sv&&(sv.innerHTML='<span>\u{1F4BE}</span><span style="color:#27ae60">Guardado '+new Date().toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit"})+"</span>",wcAnimate(sv,"fadein"))}},3e4)}function updateStatusBarPro(){const ed=document.getElementById("editor");if(!ed)return;const text=ed.innerText||"",wordCount=text.trim().split(/\s+/).filter(w=>w.length>0).length,charCount=text.length,readTime=Math.max(1,Math.round(wordCount/200)),paraCount=ed.querySelectorAll("p, h1, h2, h3, li, blockquote").length,avgWordLen=wordCount>0?charCount/wordCount:0;let level="\u{1F4D7} B\xE1sico";avgWordLen>6.5?level="\u{1F4D5} Avanzado":avgWordLen>5.5&&(level="\u{1F4D8} Intermedio");const set=(id,html)=>{const el=document.getElementById(id);el&&(el.innerHTML=html)};set("__sbWords",`<span style="color:#0084ff">\u270E</span> <span>${wordCount.toLocaleString()} palabra${wordCount!==1?"s":""}</span>`),set("__sbChars",`${charCount.toLocaleString()} car.`),set("__sbTime",`<span>\u23F1</span> <span>~${readTime} min</span>`),set("__sbParas",`${paraCount} p\xE1rr.`),set("__sbLevel",level);const wc=document.getElementById("wordCount"),cc=document.getElementById("charCount");wc&&(wc.textContent=`\u2713 ${wordCount} palabras`),cc&&(cc.textContent=`\u2713 ${charCount} caracteres`)}let _zoomLevels=[75,100,125,150],_zoomIdx=1;function __sbCycleZoom(){_zoomIdx=(_zoomIdx+1)%_zoomLevels.length;const z=_zoomLevels[_zoomIdx],ed=document.getElementById("editor");ed&&(ed.style.transform=`scale(${z/100})`,ed.style.transformOrigin="top center");const zv=document.getElementById("__sbZoomVal");zv&&(zv.textContent=z+"%"),showToast("Zoom: "+z+"%")}function openCoverPanel(){const old=document.getElementById("__coverPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__coverPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const coverStyles=[{id:"ejecutiva",name:"Ejecutiva",icon:"\u{1F4BC}"},{id:"academica",name:"Acad\xE9mica",icon:"\u{1F393}"},{id:"creativa",name:"Creativa",icon:"\u{1F3A8}"},{id:"minimal",name:"Minimal",icon:"\u25FB\uFE0F"},{id:"costarica",name:"Costa Rica",icon:"\u{1F1E8}\u{1F1F7}"},{id:"juridica",name:"Jur\xEDdica",icon:"\u2696\uFE0F"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u{1F4C4} Portada autom\xE1tica</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
        ${coverStyles.map(s=>`
        <button onclick="__selectCoverStyle('${s.id}',this)"
          id="__covStyle_${s.id}"
          style="padding:12px 8px;border:2px solid #eee;border-radius:12px;cursor:pointer;background:#fafafa;font-size:12px;font-weight:600;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.classList.contains('sel')){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:22px;margin-bottom:6px">${s.icon}</div>
          ${s.name}
        </button>`).join("")}
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
        <div>
          <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">T\xEDtulo del documento *</label>
          <input id="__covTitle" type="text" placeholder="Informe Ejecutivo Q4 2025"
            style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Subt\xEDtulo</label>
          <input id="__covSub" type="text" placeholder="Per\xEDodo Octubre \u2014 Diciembre 2025"
            style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Autor</label>
            <input id="__covAuthor" type="text" placeholder="Nombre completo"
              style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box"
              onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
          </div>
          <div>
            <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Fecha</label>
            <input id="__covDate" type="text" placeholder="Junio 2025"
              value="${new Date().toLocaleDateString("es-CR",{month:"long",year:"numeric"})}"
              style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box"
              onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
          </div>
        </div>
        <div>
          <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Organizaci\xF3n / Empresa</label>
          <input id="__covOrg" type="text" placeholder="WC Corporate \xB7 Costa Rica"
            style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">N\xFAmero de documento / versi\xF3n</label>
          <input id="__covRef" type="text" placeholder="Doc. Ref: WC-2025-001 \xB7 v1.0"
            style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="checkbox" id="__covPrepend" checked style="width:16px;height:16px;accent-color:#0084ff">
          <label for="__covPrepend" style="font-size:13px;color:#555">Insertar al inicio del documento</label>
        </div>
      </div>
    </div>
    <div style="padding:0 20px 20px;display:flex;gap:8px">
      <button onclick="document.getElementById('__coverPanel').remove()" style="flex:1;padding:12px;border:1.5px solid #ddd;background:#fff;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600">Cancelar</button>
      <button onclick="generateCover()" style="flex:2;padding:12px;border:none;background:#0084ff;color:#fff;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600">\u2728 Generar portada</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(()=>__selectCoverStyle("ejecutiva",document.getElementById("__covStyle_ejecutiva")),50)}let _selectedCoverStyle="ejecutiva";function __selectCoverStyle(id,btn){_selectedCoverStyle=id,document.querySelectorAll('[id^="__covStyle_"]').forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.classList.remove("sel")}),btn&&(btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.classList.add("sel"))}function generateCover(){const title=document.getElementById("__covTitle").value.trim()||"Documento",sub=document.getElementById("__covSub").value.trim(),author=document.getElementById("__covAuthor").value.trim(),date=document.getElementById("__covDate").value.trim(),org=document.getElementById("__covOrg").value.trim(),ref=document.getElementById("__covRef").value.trim(),prepend=document.getElementById("__covPrepend").checked,style=_selectedCoverStyle,th=WC_THEMES[_currentTheme]||WC_THEMES.corporativo,accent=th.accent,covers={ejecutiva:`
      <div style="page-break-after:always;min-height:26cm;display:flex;flex-direction:column;background:#fff;border:none;margin:0;padding:0;font-family:'Calibri','Carlito',Arial,sans-serif;position:relative;overflow:hidden">
        <div style="background:${th.header};height:8px;width:100%"></div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:3cm 2cm">
          ${org?`<div style="font-size:12pt;color:#888;letter-spacing:3px;text-transform:uppercase;margin-bottom:1.5cm;font-weight:600">${org}</div>`:""}
          <div style="width:60px;height:3px;background:${accent};margin-bottom:1cm"></div>
          <h1 style="font-size:28pt;font-weight:700;color:#1a2942;margin:0 0 0.5cm;line-height:1.2;letter-spacing:-.5px">${title}</h1>
          ${sub?`<div style="font-size:14pt;color:#555;margin-bottom:1.5cm;font-style:italic">${sub}</div>`:'<div style="margin-bottom:1.5cm"></div>'}
          <div style="width:80px;height:2px;background:${accent}44;margin-bottom:1.5cm"></div>
          ${author?`<div style="font-size:12pt;color:#333;font-weight:600;margin-bottom:0.3cm">${author}</div>`:""}
          ${date?`<div style="font-size:11pt;color:#888">${date}</div>`:""}
        </div>
        <div style="padding:0.5cm 2cm;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
          ${ref?`<div style="font-size:9pt;color:#aaa">${ref}</div>`:"<div></div>"}
          <div style="font-size:9pt;color:#aaa">WC Corporate Editor</div>
        </div>
      </div>`,academica:`
      <div style="page-break-after:always;min-height:26cm;display:flex;flex-direction:column;background:#fff;font-family:'Times New Roman',Times,serif;text-align:center;padding:3cm 2.5cm;box-sizing:border-box">
        ${org?`<div style="font-size:13pt;font-weight:700;color:#1a1a1a;margin-bottom:0.3cm;text-transform:uppercase;letter-spacing:1px">${org}</div><div style="width:100%;height:1px;background:#1a1a1a;margin-bottom:2cm"></div>`:""}
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
          <h1 style="font-size:16pt;font-weight:700;color:#1a1a1a;margin:0 0 1cm;text-transform:uppercase;line-height:1.4;letter-spacing:1px">${title}</h1>
          ${sub?`<div style="font-size:12pt;color:#333;margin-bottom:2cm;font-style:italic">${sub}</div>`:'<div style="margin-bottom:2cm"></div>'}
          <div style="margin-top:2cm">
            ${author?`<div style="font-size:12pt;color:#1a1a1a;margin-bottom:0.3cm"><strong>Presentado por:</strong><br>${author}</div>`:""}
          </div>
        </div>
        <div style="margin-top:auto;padding-top:2cm">
          ${date?`<div style="font-size:11pt;color:#333">${date}</div>`:""}
          ${ref?`<div style="font-size:10pt;color:#666;margin-top:0.3cm">${ref}</div>`:""}
        </div>
      </div>`,creativa:`
      <div style="page-break-after:always;min-height:26cm;background:${th.header};display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2cm;font-family:Arial,sans-serif;position:relative;overflow:hidden">
        <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:rgba(255,255,255,.06);border-radius:50%"></div>
        <div style="position:absolute;bottom:-60px;left:-30px;width:250px;height:250px;background:rgba(255,255,255,.04);border-radius:50%"></div>
        <div style="position:relative;z-index:1">
          ${org?`<div style="font-size:11pt;color:rgba(255,255,255,.8);letter-spacing:4px;text-transform:uppercase;margin-bottom:1.5cm;font-weight:600">${org}</div>`:""}
          <h1 style="font-size:32pt;font-weight:900;color:#fff;margin:0 0 0.5cm;line-height:1.1;text-shadow:0 2px 20px rgba(0,0,0,.3)">${title}</h1>
          ${sub?`<div style="font-size:14pt;color:rgba(255,255,255,.85);margin-bottom:1.5cm">${sub}</div>`:'<div style="margin-bottom:1.5cm"></div>'}
          <div style="width:60px;height:3px;background:rgba(255,255,255,.6);margin:0 auto 1.5cm"></div>
          ${author?`<div style="font-size:13pt;color:rgba(255,255,255,.9);font-weight:600;margin-bottom:0.3cm">${author}</div>`:""}
          ${date?`<div style="font-size:11pt;color:rgba(255,255,255,.7)">${date}</div>`:""}
          ${ref?`<div style="font-size:9pt;color:rgba(255,255,255,.5);margin-top:1cm">${ref}</div>`:""}
        </div>
      </div>`,minimal:`
      <div style="page-break-after:always;min-height:26cm;background:#fff;display:flex;flex-direction:column;justify-content:center;padding:3cm 2.5cm;font-family:Arial,sans-serif;box-sizing:border-box">
        <div style="max-width:16cm">
          ${org?`<div style="font-size:10pt;color:#aaa;letter-spacing:2px;text-transform:uppercase;margin-bottom:2cm">${org}</div>`:""}
          <h1 style="font-size:30pt;font-weight:900;color:#1a1a1a;margin:0 0 0.8cm;line-height:1.1;letter-spacing:-1px">${title}</h1>
          ${sub?`<div style="font-size:13pt;color:#777;margin-bottom:2cm;line-height:1.5">${sub}</div>`:'<div style="margin-bottom:2cm"></div>'}
          <div style="width:30px;height:3px;background:#1a1a1a;margin-bottom:1.5cm"></div>
          <div style="font-size:11pt;color:#555">
            ${author?`<div style="margin-bottom:4px">${author}</div>`:""}
            ${date?`<div style="color:#aaa">${date}</div>`:""}
          </div>
          ${ref?`<div style="font-size:9pt;color:#ccc;margin-top:2cm">${ref}</div>`:""}
        </div>
      </div>`,costarica:`
      <div style="page-break-after:always;min-height:26cm;background:#fff;display:flex;flex-direction:column;font-family:'Calibri',Arial,sans-serif;text-align:center;overflow:hidden">
        <div style="height:12px;background:linear-gradient(90deg,#003da5 33.3%,#fff 33.3%,#fff 40%,#ce1126 40%,#ce1126 60%,#fff 60%,#fff 66.7%,#003da5 66.7%)"></div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2cm">
          <div style="font-size:40px;margin-bottom:0.8cm">\u{1F1E8}\u{1F1F7}</div>
          ${org?`<div style="font-size:12pt;color:#003da5;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:0.5cm">${org}</div>`:""}
          <div style="width:80%;height:1px;background:linear-gradient(90deg,transparent,#003da5,transparent);margin-bottom:1cm"></div>
          <h1 style="font-size:22pt;font-weight:700;color:#1a2942;margin:0 0 0.5cm;line-height:1.3">${title}</h1>
          ${sub?`<div style="font-size:12pt;color:#555;margin-bottom:1.5cm;font-style:italic">${sub}</div>`:'<div style="margin-bottom:1.5cm"></div>'}
          <div style="width:80%;height:1px;background:linear-gradient(90deg,transparent,#ce1126,transparent);margin-bottom:1.5cm"></div>
          ${author?`<div style="font-size:12pt;color:#003da5;font-weight:600;margin-bottom:0.3cm">${author}</div>`:""}
          ${date?`<div style="font-size:11pt;color:#888">${date}</div>`:""}
          ${ref?`<div style="font-size:9pt;color:#aaa;margin-top:1cm">${ref}</div>`:""}
        </div>
        <div style="height:8px;background:linear-gradient(90deg,#003da5 33.3%,#fff 33.3%,#fff 40%,#ce1126 40%,#ce1126 60%,#fff 60%,#fff 66.7%,#003da5 66.7%)"></div>
      </div>`,juridica:`
      <div style="page-break-after:always;min-height:26cm;background:#fff;display:flex;flex-direction:column;font-family:'Times New Roman',Times,serif;text-align:center;padding:2.5cm;box-sizing:border-box">
        <div style="border:2px solid #1a1a1a;padding:1cm;flex:1;display:flex;flex-direction:column">
          <div style="border-bottom:1px solid #1a1a1a;padding-bottom:0.5cm;margin-bottom:1cm">
            ${org?`<div style="font-size:13pt;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:0.3cm">${org}</div>`:""}
            <div style="font-size:10pt;color:#555">Rep\xFAblica de Costa Rica</div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
            <h1 style="font-size:18pt;font-weight:700;text-transform:uppercase;line-height:1.4;margin:0 0 0.8cm;letter-spacing:1px">${title}</h1>
            ${sub?`<div style="font-size:12pt;font-style:italic;color:#333;margin-bottom:1cm">${sub}</div>`:'<div style="margin-bottom:1cm"></div>'}
          </div>
          <div style="border-top:1px solid #1a1a1a;padding-top:0.8cm;margin-top:auto">
            ${author?`<div style="font-size:11pt;margin-bottom:0.3cm"><strong>${author}</strong></div>`:""}
            ${date?`<div style="font-size:10pt;color:#555">${date}</div>`:""}
            ${ref?`<div style="font-size:9pt;color:#888;margin-top:0.5cm">${ref}</div>`:""}
          </div>
        </div>
      </div>`},html=covers[style]||covers.ejecutiva,ed=document.getElementById("editor");ed&&(prepend?(ed.insertAdjacentHTML("afterbegin",html+"<p></p>"),ed.scrollTop=0):typeof insertHTML=="function"?insertHTML(html+"<p></p>"):ed.innerHTML+=html+"<p></p>",document.getElementById("__coverPanel").remove(),showToast("Portada generada \u2728"),wcAnimate(ed,"glow"))}(function(){setTimeout(function(){initStatusBarPro(),addThemeButton();const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"themes":openThemePanel();break;case"fontFamily":openFontPanel();break;case"coverPage":openCoverPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.3 \u2705 \u2014 Temas, Animaciones, Fuentes, Barra estado, Portada")},1100)})();function addThemeButton(){if(document.getElementById("__themeBtn"))return;const btn=document.createElement("button");btn.id="__themeBtn",btn.title="Cambiar tema de color";const t=WC_THEMES[_currentTheme]||WC_THEMES.corporativo;btn.textContent=t.icon+" Tema",btn.style.cssText="position:fixed;top:14px;left:14px;z-index:9000;background:rgba(0,0,0,.3);color:#fff;border:none;border-radius:20px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;backdrop-filter:blur(10px);transition:all .2s",btn.onmouseover=()=>btn.style.background="rgba(0,0,0,.5)",btn.onmouseout=()=>btn.style.background="rgba(0,0,0,.3)",btn.onclick=openThemePanel,document.body.appendChild(btn)}let _pageNumEnabled=!1,_pageNumStyle={format:"P\xE1gina {n}",position:"bottom-right",size:"9pt",color:"#aaa"};function togglePageNumbers(){_pageNumEnabled=!_pageNumEnabled,_pageNumEnabled?(renderPageNumbers(),showToast("Numeraci\xF3n activada \u{1F522}")):(document.querySelectorAll(".wc-page-num").forEach(el=>el.remove()),showToast("Numeraci\xF3n desactivada"))}function openPageNumberPanel(){const old=document.getElementById("__pnPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pnPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:18px;max-width:400px;width:100%;padding:22px;box-shadow:0 16px 48px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:18px">\u{1F522} Numeraci\xF3n de p\xE1ginas</div>

    <div style="margin-bottom:14px">
      <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:6px">Formato</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${[["P\xE1gina {n}","P\xE1gina 1"],["{n}","1"],["- {n} -","- 1 -"],["P\xE1g. {n} de {total}","P\xE1g. 1 de 5"],["{n} / {total}","1 / 5"],["{n}\xB0","1\xB0"]].map(([val,label])=>`
          <button onclick="__pnSetFormat('${val}',this)"
            class="__pnFmtBtn"
            style="padding:8px 10px;border:2px solid #eee;border-radius:9px;cursor:pointer;font-size:12px;font-weight:600;background:#fafafa;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff'"
            onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
            ${label}
          </button>`).join("")}
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:6px">Posici\xF3n</label>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        ${[["top-left","\u2196 Arr. Izq"],["top-center","\u2191 Arr. Centro"],["top-right","\u2197 Arr. Der"],["bottom-left","\u2199 Ab. Izq"],["bottom-center","\u2193 Ab. Centro"],["bottom-right","\u2198 Ab. Der"]].map(([val,label])=>`
          <button onclick="__pnSetPos('${val}',this)"
            class="__pnPosBtn"
            style="padding:8px 4px;border:2px solid #eee;border-radius:9px;cursor:pointer;font-size:11px;font-weight:600;background:#fafafa;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff'"
            onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
            ${label}
          </button>`).join("")}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
      <div>
        <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Tama\xF1o</label>
        <select id="__pnSize" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          <option value="8pt">8pt</option>
          <option value="9pt" selected>9pt</option>
          <option value="10pt">10pt</option>
          <option value="11pt">11pt</option>
          <option value="12pt">12pt</option>
        </select>
      </div>
      <div>
        <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Color</label>
        <input type="color" id="__pnColor" value="#aaaaaa" style="width:100%;height:36px;border:none;border-radius:8px;cursor:pointer">
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__pnPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__applyPageNumbers()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">Aplicar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(()=>{const fb=document.querySelector(".__pnFmtBtn");fb&&(fb.style.borderColor="#0084ff",fb.style.background="#f0f7ff",fb.dataset.sel="1");const pb=document.querySelectorAll(".__pnPosBtn")[5];pb&&(pb.style.borderColor="#0084ff",pb.style.background="#f0f7ff",pb.dataset.sel="1")},50)}function __pnSetFormat(val,btn){_pageNumStyle.format=val,document.querySelectorAll(".__pnFmtBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"}function __pnSetPos(val,btn){_pageNumStyle.position=val,document.querySelectorAll(".__pnPosBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"}function __applyPageNumbers(){_pageNumStyle.size=document.getElementById("__pnSize").value,_pageNumStyle.color=document.getElementById("__pnColor").value,_pageNumEnabled=!0,renderPageNumbers(),document.getElementById("__pnPanel").remove(),showToast("Numeraci\xF3n aplicada \u{1F522}")}function renderPageNumbers(){if(document.querySelectorAll(".wc-page-num").forEach(el=>el.remove()),!_pageNumEnabled)return;const wrap=document.getElementById("editorPageWrap"),ed=document.getElementById("editor");if(!wrap||!ed)return;const pageH=_cmToPxLocal(27.94);if(pageH<50)return;const totalH=ed.offsetHeight,totalPages=Math.max(1,Math.ceil(totalH/pageH)),edTop=ed.offsetTop,pos=_pageNumStyle.position,isTop=pos.startsWith("top"),isLeft=pos.endsWith("left"),isCenter=pos.endsWith("center");for(let p=1;p<=totalPages;p++){const num=document.createElement("div");num.className="wc-page-num";const text=_pageNumStyle.format.replace("{n}",p).replace("{total}",totalPages),topPos=isTop?edTop+pageH*(p-1)+8:edTop+pageH*p-22;num.style.cssText=`
      position:absolute;
      top:${topPos}px;
      ${isLeft?"left:8px":isCenter?"left:50%;transform:translateX(-50%)":"right:8px"};
      font-size:${_pageNumStyle.size};
      color:${_pageNumStyle.color};
      pointer-events:none;
      z-index:3;
      font-family:-apple-system,'Segoe UI',sans-serif;
      background:rgba(255,255,255,.85);
      padding:1px 6px;
      border-radius:4px;
    `,num.textContent=text,wrap.appendChild(num)}}function _cmToPxLocal(cm){const probe=document.createElement("div");probe.style.cssText="position:absolute;height:"+cm+"cm;visibility:hidden",document.body.appendChild(probe);const px=probe.offsetHeight;return probe.remove(),px}(function(){const ed=document.getElementById("editor");ed&&ed.addEventListener("input",()=>{_pageNumEnabled&&renderPageNumbers()})})();function initDraggableMargins(){const ruler=document.getElementById("ruler"),ed=document.getElementById("editor");if(!ruler||!ed)return;ruler.style.display==="none"&&(ruler.style.display="block");const track=document.getElementById("rulerTrack");if(!track)return;const leftZone=document.createElement("div");leftZone.id="__mleftZone",leftZone.style.cssText="position:absolute;left:0;top:0;bottom:0;width:12%;background:rgba(0,132,255,.07);pointer-events:none;border-right:2px solid rgba(0,132,255,.3);z-index:1";const rightZone=document.createElement("div");rightZone.id="__mrightZone",rightZone.style.cssText="position:absolute;right:0;top:0;bottom:0;width:12%;background:rgba(0,132,255,.07);pointer-events:none;border-left:2px solid rgba(0,132,255,.3);z-index:1",track.appendChild(leftZone),track.appendChild(rightZone);const tooltip=document.createElement("div");tooltip.id="__rulerTooltip",tooltip.style.cssText="position:absolute;top:-22px;background:#1a1a2e;color:#fff;font-size:10px;padding:2px 7px;border-radius:5px;pointer-events:none;display:none;z-index:10;white-space:nowrap",track.appendChild(tooltip),[{id:"mLeft",label:"Margen izq.",prop:"marginLeft",unit:"cm"},{id:"mRight",label:"Margen der.",prop:"marginRight",unit:"cm"},{id:"mFirst",label:"Sangr\xEDa",prop:"textIndent",unit:"cm"}].forEach(m=>{const el=document.getElementById(m.id);if(!el)return;el.style.cssText+=";background:#0084ff;color:#fff;font-size:10px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,132,255,.4);z-index:6";let dragging=!1,startX=0,startPct=0;el.addEventListener("mousedown",e=>{dragging=!0,startX=e.clientX,e.preventDefault()}),el.addEventListener("touchstart",e=>{dragging=!0,startX=e.touches[0].clientX,e.preventDefault()},{passive:!1}),document.addEventListener("mousemove",e=>{if(!dragging)return;const rect=track.getBoundingClientRect(),x=e.clientX-rect.left,pct=Math.max(0,Math.min(100,x/rect.width*100)),cm=(pct/100*16.5).toFixed(1);m.id==="mLeft"&&(el.style.left=pct+"%"),m.id==="mRight"&&(el.style.right=100-pct+"%",el.style.left="auto"),m.id==="mFirst"&&(el.style.left=pct+"%"),m.id==="mLeft"&&(leftZone.style.width=pct+"%"),m.id==="mRight"&&(rightZone.style.width=100-pct+"%");const tt=document.getElementById("__rulerTooltip");tt&&(tt.style.display="block",tt.style.left=Math.min(x,rect.width-60)+"px",tt.textContent=m.label+": "+cm+" cm");const sel=window.getSelection(),node=sel&&sel.rangeCount?sel.getRangeAt(0).startContainer:null;let p=node?node.nodeType===3?node.parentElement:node:null;for(;p&&p!==ed&&!/^(P|DIV|H[1-6]|LI|BLOCKQUOTE)$/.test(p.tagName);)p=p.parentElement;const target=p&&p!==ed?p:ed;m.id==="mLeft"&&(target.style.marginLeft=cm+"cm"),m.id==="mRight"&&(target.style.marginRight=cm+"cm"),m.id==="mFirst"&&(target.style.textIndent=cm+"cm")}),document.addEventListener("touchmove",e=>{if(!dragging)return;const touch=e.touches[0],rect=track.getBoundingClientRect(),x=touch.clientX-rect.left,pct=Math.max(0,Math.min(100,x/rect.width*100)),cm=(pct/100*16.5).toFixed(1);m.id==="mLeft"&&(el.style.left=pct+"%"),m.id==="mRight"&&(el.style.right=100-pct+"%",el.style.left="auto"),m.id==="mFirst"&&(el.style.left=pct+"%"),showToast(m.label+": "+cm+"cm",!0)},{passive:!0});const stopDrag=()=>{if(!dragging)return;dragging=!1;const tt=document.getElementById("__rulerTooltip");tt&&(tt.style.display="none")};document.addEventListener("mouseup",stopDrag),document.addEventListener("touchend",stopDrag)}),track.addEventListener("dblclick",e=>{const rect=track.getBoundingClientRect(),cm=((e.clientX-rect.left)/rect.width*100/100*16.5).toFixed(1),val=prompt("Posici\xF3n exacta (cm):",cm);val&&!isNaN(val)&&showToast("Posici\xF3n: "+parseFloat(val).toFixed(1)+" cm")})}let _thumbPanelOpen=!1;function togglePageThumbnails(){_thumbPanelOpen=!_thumbPanelOpen;const panel=document.getElementById("__thumbPanel");if(!_thumbPanelOpen){panel&&panel.remove(),document.querySelector(".content")&&(document.querySelector(".content").style.paddingLeft="");return}openPageThumbnailPanel()}function openPageThumbnailPanel(){const old=document.getElementById("__thumbPanel");old&&old.remove();const panel=document.createElement("div");panel.id="__thumbPanel",panel.style.cssText=`
    position:fixed;left:0;top:0;bottom:60px;width:90px;
    background:#2d2d44;z-index:500;
    overflow-y:auto;padding:50px 8px 16px;
    box-shadow:3px 0 16px rgba(0,0,0,.3);
    scrollbar-width:thin;scrollbar-color:#555 transparent;
    display:flex;flex-direction:column;gap:10px;
    transition:transform .3s ease;
  `;const hdr=document.createElement("div");hdr.style.cssText="position:absolute;top:0;left:0;right:0;background:#1e1e2e;padding:8px;text-align:center;font-size:10px;font-weight:700;color:#888;letter-spacing:1px;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between;padding:8px 10px",hdr.innerHTML='<span>\u{1F4C4} P\xC1GINAS</span><button onclick="togglePageThumbnails()" style="background:none;border:none;color:#666;cursor:pointer;font-size:14px;line-height:1">\u2715</button>',panel.appendChild(hdr),document.body.appendChild(panel);const content=document.querySelector(".content");content&&(content.style.paddingLeft="98px"),renderThumbnails();const ed=document.getElementById("editor");if(ed){let thumbTimer;ed.addEventListener("input",()=>{clearTimeout(thumbTimer),thumbTimer=setTimeout(renderThumbnails,1e3)})}}function renderThumbnails(){const panel=document.getElementById("__thumbPanel"),ed=document.getElementById("editor");if(!panel||!ed)return;panel.querySelectorAll(".wc-thumb").forEach(el=>el.remove());const pageH=_cmToPxLocal(27.94),totalH=ed.scrollHeight,total=Math.max(1,Math.ceil(totalH/pageH));for(let p=1;p<=total;p++){const thumb=document.createElement("div");thumb.className="wc-thumb",thumb.style.cssText=`
      background:#fff;border-radius:4px;cursor:pointer;
      box-shadow:0 2px 8px rgba(0,0,0,.3);
      overflow:hidden;aspect-ratio:8.5/11;
      position:relative;transition:all .2s;
      border:2px solid transparent;
    `;const ratio=74/ed.offsetWidth,inner=document.createElement("div");inner.style.cssText=`
      transform:scale(${ratio});transform-origin:top left;
      width:${ed.offsetWidth}px;height:${pageH}px;
      overflow:hidden;pointer-events:none;
    `,inner.innerHTML=ed.innerHTML,inner.style.marginTop=`-${(p-1)*pageH}px`;const num=document.createElement("div");num.style.cssText="position:absolute;bottom:2px;left:0;right:0;text-align:center;font-size:8px;color:#888;background:rgba(255,255,255,.8)",num.textContent=p,thumb.appendChild(inner),thumb.appendChild(num),thumb.onclick=()=>{const scrollTarget=(p-1)*pageH+ed.offsetTop;window.scrollTo({top:scrollTarget-80,behavior:"smooth"}),panel.querySelectorAll(".wc-thumb").forEach(t=>t.style.borderColor="transparent"),thumb.style.borderColor="#0084ff"},thumb.onmouseover=()=>{thumb.style.borderColor!=="#0084ff"&&(thumb.style.borderColor="#555")},thumb.onmouseout=()=>{thumb.style.borderColor!=="#0084ff"&&(thumb.style.borderColor="transparent")},panel.appendChild(thumb)}updateActiveThumbnail()}function updateActiveThumbnail(){const panel=document.getElementById("__thumbPanel"),ed=document.getElementById("editor");if(!panel||!ed)return;const pageH=_cmToPxLocal(27.94),scrollY=window.scrollY,edTop=ed.offsetTop,curPage=Math.max(1,Math.ceil((scrollY-edTop+100)/pageH));panel.querySelectorAll(".wc-thumb").forEach((t,i)=>{t.style.borderColor=i+1===curPage?"#0084ff":"transparent"})}window.addEventListener("scroll",updateActiveThumbnail);let _autocompleteEnabled=!0,_autocompleteTimer=null,_lastContext="";const _wordBank={res:["resultado","respuesta","resoluci\xF3n","respectivamente","responsable"],con:["conclusi\xF3n","considerando","conforme","conocimiento","contrato"],pro:["propuesta","procedimiento","proceso","programa","proyecto"],inf:["informe","informaci\xF3n","infraestructura","ingreso"],des:["descripci\xF3n","desarrollo","designaci\xF3n","determinaci\xF3n"],est:["estudio","establecimiento","estrategia","estructura"],imp:["implementaci\xF3n","importante","impacto","implicaci\xF3n"],org:["organizaci\xF3n","organismo","organizacional"],eje:["ejecuci\xF3n","ejecutivo","ejemplo"],rec:["recomendaci\xF3n","recurso","reconocimiento"],obj:["objetivo","objeto","objetivamente"],doc:["documento","documentaci\xF3n","documentar"],anu:["anual","anuario","anualmente"],pre:["presentaci\xF3n","presupuesto","proceso","previo"],ade:["adem\xE1s","adecuado","adecuaci\xF3n"],med:["mediante","medida","medio"],seg:["seg\xFAn","seguimiento","segunda"],per:["per\xEDodo","personal","perspectiva","permiso"],act:["actividad","actualmente","acuerdo"],ser:["servicio","ser\xE1","seg\xFAn"],gen:["general","gerencia","gesti\xF3n"],man:["manual","mantenimiento","manera"],req:["requisito","requerimiento","requerido"],tra:["trabajo","tramitar","tramitaci\xF3n","trasladar"]};function initAutocomplete(){const ed=document.getElementById("editor");if(!ed)return;const sug=document.createElement("div");sug.id="__acSuggest",sug.style.cssText=`
    position:fixed;z-index:9970;background:#fff;
    border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.2);
    padding:4px;display:none;min-width:180px;
    font-family:-apple-system,'Segoe UI',sans-serif;
  `,document.body.appendChild(sug),ed.addEventListener("keydown",e=>{const ac=document.getElementById("__acSuggest");if(ac&&ac.style.display!=="none"){if(e.key==="Escape"){ac.style.display="none";return}if(e.key==="Tab"){const first=ac.querySelector(".__acItem");first&&(e.preventDefault(),first.click());return}if(e.key==="ArrowDown"){e.preventDefault();const items=ac.querySelectorAll(".__acItem"),focused=ac.querySelector(".__acItem:focus")||ac.querySelector(".__acItem.__acHover"),idx=Array.from(items).indexOf(focused),next=items[idx+1]||items[0];next&&(items.forEach(i=>i.classList.remove("__acHover")),next.classList.add("__acHover"),next.focus());return}}}),ed.addEventListener("input",()=>{_autocompleteEnabled&&(clearTimeout(_autocompleteTimer),_autocompleteTimer=setTimeout(()=>{showAutocomplete()},400))}),document.addEventListener("click",e=>{const ac=document.getElementById("__acSuggest");ac&&!ac.contains(e.target)&&(ac.style.display="none")})}function showAutocomplete(){const ed=document.getElementById("editor"),ac=document.getElementById("__acSuggest");if(!ed||!ac)return;const sel=window.getSelection();if(!sel||!sel.rangeCount||!ed.contains(sel.anchorNode)){ac.style.display="none";return}const range=sel.getRangeAt(0),node=range.startContainer;if(node.nodeType!==3){ac.style.display="none";return}const match=node.textContent.substring(0,range.startOffset).match(/[\wáéíóúñÁÉÍÓÚÑ]+$/);if(!match||match[0].length<3){ac.style.display="none";return}const word=match[0].toLowerCase(),prefix=word.substring(0,3),suggestions=(_wordBank[prefix]||[]).filter(s=>s.toLowerCase().startsWith(word)&&s.toLowerCase()!==word).slice(0,5);if(!suggestions.length){ac.style.display="none";return}const rect=range.getBoundingClientRect();ac.style.left=Math.min(rect.left,window.innerWidth-200)+"px",ac.style.top=rect.bottom+window.scrollY+4+"px",ac.innerHTML=`
    <div style="font-size:9px;color:#aaa;padding:4px 10px 2px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;border-bottom:1px solid #f0f0f0;margin-bottom:2px">
      Autocompletar <span style="float:right;color:#ccc">Tab \u21B5</span>
    </div>
    ${suggestions.map((s,i)=>`
      <div class="__acItem" tabindex="0"
        style="padding:8px 12px;cursor:pointer;border-radius:8px;font-size:13px;color:#1a1a1a;display:flex;align-items:center;gap:8px;transition:background .1s"
        onmouseover="this.style.background='#f0f7ff';this.classList.add('__acHover')"
        onmouseout="this.style.background='';this.classList.remove('__acHover')"
        onclick="__insertAutocomplete('${word}','${s}')">
        <span style="color:#0084ff;font-size:11px;font-weight:700;min-width:12px">${i===0?"\u21B5":""}</span>
        <span><strong>${s.substring(0,word.length)}</strong>${s.substring(word.length)}</span>
      </div>`).join("")}
  `,ac.style.display="block"}function __insertAutocomplete(typed,full){const ed=document.getElementById("editor"),ac=document.getElementById("__acSuggest");if(ac&&(ac.style.display="none"),!ed)return;const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const range=sel.getRangeAt(0),node=range.startContainer;if(node.nodeType!==3)return;const offset=range.startOffset,start=node.textContent.lastIndexOf(typed,offset);if(start===-1)return;const newRange=document.createRange();newRange.setStart(node,start),newRange.setEnd(node,start+typed.length),sel.removeAllRanges(),sel.addRange(newRange),document.execCommand("insertText",!1,full),showToast('"'+full+'" completado \u2705')}function toggleAutocomplete(){_autocompleteEnabled=!_autocompleteEnabled,showToast("Autocompletado: "+(_autocompleteEnabled?"activado \u2705":"desactivado"))}(function(){const st=document.createElement("style");st.textContent=".__acItem.__acHover { background:#f0f7ff !important; outline:none; }",document.head.appendChild(st)})();const SLASH_COMMANDS=[{icon:"\u{1F4DD}",label:"Texto normal",desc:"P\xE1rrafo est\xE1ndar",cat:"Texto",action:()=>{document.execCommand("formatBlock",!1,"P")}},{icon:"H1",label:"T\xEDtulo 1",desc:"T\xEDtulo principal",cat:"Texto",action:()=>{document.execCommand("formatBlock",!1,"H1")}},{icon:"H2",label:"T\xEDtulo 2",desc:"Subt\xEDtulo",cat:"Texto",action:()=>{document.execCommand("formatBlock",!1,"H2")}},{icon:"H3",label:"T\xEDtulo 3",desc:"Secci\xF3n",cat:"Texto",action:()=>{document.execCommand("formatBlock",!1,"H3")}},{icon:"\u275D",label:"Cita",desc:"Bloque de cita",cat:"Texto",action:()=>{document.execCommand("formatBlock",!1,"BLOCKQUOTE")}},{icon:"\u2022",label:"Lista vi\xF1etas",desc:"Lista con puntos",cat:"Listas",action:()=>{document.execCommand("insertUnorderedList")}},{icon:"1.",label:"Lista numerada",desc:"Lista con n\xFAmeros",cat:"Listas",action:()=>{document.execCommand("insertOrderedList")}},{icon:"\u{1F4CB}",label:"Lista multinivel",desc:"1 \u2192 1.1 \u2192 1.1.1",cat:"Listas",action:()=>{typeof insertMultilevelList=="function"&&insertMultilevelList()}},{icon:"\u{1F5C3}\uFE0F",label:"Tabla 3\xD73",desc:"Tabla b\xE1sica",cat:"Insertar",action:()=>{typeof insertHTML=="function"&&insertHTML('<table style="border-collapse:collapse;width:100%;margin:8px 0"><tr><th style="border:1px solid #ddd;padding:8px;background:#f0f7ff">Col 1</th><th style="border:1px solid #ddd;padding:8px;background:#f0f7ff">Col 2</th><th style="border:1px solid #ddd;padding:8px;background:#f0f7ff">Col 3</th></tr><tr><td style="border:1px solid #ddd;padding:8px"> </td><td style="border:1px solid #ddd;padding:8px"> </td><td style="border:1px solid #ddd;padding:8px"> </td></tr></table><p></p>')}},{icon:"\u{1F4CA}",label:"Gr\xE1fico",desc:"Insertar gr\xE1fico",cat:"Insertar",action:()=>{typeof openModal=="function"&&openModal("modalCharts")}},{icon:"\u{1F5BC}\uFE0F",label:"Imagen",desc:"Subir imagen",cat:"Insertar",action:()=>{document.getElementById("fileInputImage")&&document.getElementById("fileInputImage").click()}},{icon:"\u2797",label:"Ecuaci\xF3n",desc:"Editor de ecuaciones",cat:"Insertar",action:()=>{typeof openModal=="function"&&openModal("modalEquation")}},{icon:"\u{1F4C4}",label:"Salto de p\xE1gina",desc:"Nueva p\xE1gina",cat:"Insertar",action:()=>{typeof insertHTML=="function"&&insertHTML('<hr style="border:none;border-top:2px dashed #aaa;margin:16px 0"><p></p>')}},{icon:"\u2014",label:"Separador",desc:"L\xEDnea divisoria",cat:"Insertar",action:()=>{typeof insertHTML=="function"&&insertHTML('<div style="text-align:center;margin:26px 0;color:#0084ff;font-size:20px;letter-spacing:10px">\u2014 \u2726 \u2014</div>')}},{icon:"\u{1F4BC}",label:"Portada",desc:"Portada profesional",cat:"Formato",action:()=>{typeof openCoverPanel=="function"&&openCoverPanel()}},{icon:"\u{1F3A8}",label:"Temas",desc:"Cambiar tema de color",cat:"Formato",action:()=>{typeof openThemePanel=="function"&&openThemePanel()}},{icon:"\u{1F4A7}",label:"Marca de agua",desc:"A\xF1adir marca de agua",cat:"Formato",action:()=>{typeof openWatermarkPanel=="function"&&openWatermarkPanel()}},{icon:"\u2728",label:"Mejorar texto",desc:"Mejorar con IA",cat:"IA",action:()=>{typeof toggleAI=="function"&&(toggleAI(),setTimeout(()=>{const i=document.getElementById("aiInp");i&&(i.value="Mejora el texto del documento"),typeof sendAI=="function"&&sendAI()},400))}},{icon:"\u{1F4DD}",label:"Resumir",desc:"Resumen del documento",cat:"IA",action:()=>{typeof aiQuick=="function"&&(typeof toggleAI=="function"&&toggleAI(),setTimeout(()=>aiQuick("resumen"),400))}},{icon:"\u{1F4DA}",label:"Sin\xF3nimos",desc:"Buscar sin\xF3nimos",cat:"IA",action:()=>{typeof openSynonymsPanel=="function"&&openSynonymsPanel()}},{icon:"\u{1F33F}",label:"Bribri",desc:"Insertar palabra en Bribri",cat:"Lenguas CR",action:()=>{typeof openModal=="function"?openModal("menu-lenguas"):typeof insertHTML=="function"&&insertHTML(" <em>[Bribri]</em> ")}}];let _slashActive=!1,_slashQuery="",_slashRange=null;function initSlashCommands(){const ed=document.getElementById("editor");if(!ed)return;const menu=document.createElement("div");menu.id="__slashMenu",menu.style.cssText=`
    position:fixed;z-index:9975;background:#fff;
    border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.2);
    padding:6px;display:none;width:280px;max-height:340px;
    overflow-y:auto;font-family:-apple-system,'Segoe UI',sans-serif;
  `,document.body.appendChild(menu),ed.addEventListener("keydown",e=>{if(e.key==="/"&&!_slashActive){const sel=window.getSelection();sel&&sel.rangeCount&&(_slashRange=sel.getRangeAt(0).cloneRange(),_slashActive=!0,_slashQuery="",setTimeout(()=>showSlashMenu(""),20))}if(_slashActive){if(e.key==="Escape"){hideSlashMenu();return}if(e.key==="Backspace"&&_slashQuery.length===0){hideSlashMenu();return}if(e.key==="Enter"){const first=menu.querySelector(".__slashItem");first&&menu.style.display!=="none"&&(e.preventDefault(),first.click());return}if(e.key==="ArrowDown"){e.preventDefault();const items=menu.querySelectorAll(".__slashItem"),active=menu.querySelector(".__slashItem.__slashActive"),idx=Array.from(items).indexOf(active),next=items[(idx+1)%items.length];next&&(items.forEach(i=>i.classList.remove("__slashActive")),next.classList.add("__slashActive"),next.scrollIntoView({block:"nearest"}));return}if(e.key==="ArrowUp"){e.preventDefault();const items=menu.querySelectorAll(".__slashItem"),active=menu.querySelector(".__slashItem.__slashActive"),idx=Array.from(items).indexOf(active),prev=items[(idx-1+items.length)%items.length];prev&&(items.forEach(i=>i.classList.remove("__slashActive")),prev.classList.add("__slashActive"),prev.scrollIntoView({block:"nearest"}));return}e.key.length===1&&!e.ctrlKey&&!e.metaKey&&setTimeout(()=>{const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const range=sel.getRangeAt(0),node=range.startContainer;if(node.nodeType===3){const text=node.textContent.substring(0,range.startOffset),slash=text.lastIndexOf("/");slash!==-1&&(_slashQuery=text.substring(slash+1),showSlashMenu(_slashQuery))}},10)}}),document.addEventListener("click",e=>{const m=document.getElementById("__slashMenu");m&&!m.contains(e.target)&&e.target!==ed&&hideSlashMenu()})}function showSlashMenu(query){const menu=document.getElementById("__slashMenu");if(!menu)return;const q=query.toLowerCase(),filtered=SLASH_COMMANDS.filter(c=>!q||c.label.toLowerCase().includes(q)||c.desc.toLowerCase().includes(q)||c.cat.toLowerCase().includes(q));if(!filtered.length){hideSlashMenu();return}const sel=window.getSelection();if(sel&&sel.rangeCount){const rect=sel.getRangeAt(0).getBoundingClientRect();let left=rect.left,top=rect.bottom+window.scrollY+6;left+280>window.innerWidth&&(left=window.innerWidth-290),rect.bottom+340>window.innerHeight&&(top=rect.top+window.scrollY-346),menu.style.left=left+"px",menu.style.top=top+"px"}const cats={};filtered.forEach(c=>{cats[c.cat]||(cats[c.cat]=[]),cats[c.cat].push(c)});let html="";query&&(html+=`<div style="font-size:10px;color:#aaa;padding:4px 10px 2px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">${filtered.length} resultado${filtered.length!==1?"s":""}</div>`),Object.entries(cats).forEach(([cat,cmds])=>{query||(html+=`<div style="font-size:10px;color:#aaa;padding:6px 10px 2px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;border-top:${cat!=="Texto"?"1px solid #f0f0f0":"none"};margin-top:${cat!=="Texto"?"4px":"0"}">${cat}</div>`),cmds.forEach((c,i)=>{html+=`
      <div class="__slashItem${i===0&&!query?" __slashActive":""}"
        style="display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:9px;cursor:pointer;transition:background .1s${i===0&&!query?";background:#f0f7ff":""}"
        onmouseover="document.querySelectorAll('.__slashItem').forEach(el=>el.classList.remove('__slashActive'));this.classList.add('__slashActive');this.style.background='#f0f7ff'"
        onmouseout="if(!this.classList.contains('__slashActive'))this.style.background=''"
        onclick="__executeSlashCommand(${SLASH_COMMANDS.indexOf(c)})">
        <div style="width:32px;height:32px;background:#f0f7ff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;color:#0084ff">${c.icon}</div>
        <div>
          <div style="font-size:13px;font-weight:600;color:#1a1a1a">${c.label}</div>
          <div style="font-size:11px;color:#aaa">${c.desc}</div>
        </div>
      </div>`})}),menu.innerHTML=html,menu.style.display="block"}function hideSlashMenu(){const menu=document.getElementById("__slashMenu");menu&&(menu.style.display="none"),_slashActive=!1,_slashQuery=""}function __executeSlashCommand(idx){const cmd=SLASH_COMMANDS[idx];if(!cmd)return;hideSlashMenu();const ed=document.getElementById("editor"),sel=window.getSelection();if(sel&&sel.rangeCount&&ed.contains(sel.anchorNode)){const range=sel.getRangeAt(0),node=range.startContainer;if(node.nodeType===3){const text=node.textContent,offset=range.startOffset,slash=text.lastIndexOf("/",offset);if(slash!==-1){const delRange=document.createRange();delRange.setStart(node,slash),delRange.setEnd(node,offset),sel.removeAllRanges(),sel.addRange(delRange),document.execCommand("delete")}}}try{cmd.action()}catch(e){console.error("Slash command error:",e)}showToast(cmd.icon+" "+cmd.label+" \u2705")}(function(){setTimeout(function(){initDraggableMargins(),initAutocomplete(),initSlashCommands();const ruler=document.getElementById("ruler");ruler&&(ruler.style.display="block");const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"pageNumbers":openPageNumberPanel();break;case"pageThumbnails":togglePageThumbnails();break;case"toggleAutocomplete":toggleAutocomplete();break;default:orig(a)}}),console.log("WC Corporate Editor v25.4 \u2705 \u2014 Numeraci\xF3n visual, M\xE1rgenes, Miniaturas, Autocompletado, Comandos /")},1200)})();const WC_HISTORY={snapshots:JSON.parse(localStorage.getItem("wc-history")||"[]"),maxSnapshots:20,save(label){const ed=document.getElementById("editor");if(!ed)return;const snap={id:Date.now(),label:label||"Versi\xF3n "+new Date().toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit"}),date:new Date().toLocaleDateString("es-CR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),words:ed.innerText.trim().split(/\s+/).filter(w=>w).length,html:ed.innerHTML,size:ed.innerHTML.length};return this.snapshots.unshift(snap),this.snapshots.length>this.maxSnapshots&&this.snapshots.pop(),localStorage.setItem("wc-history",JSON.stringify(this.snapshots)),snap},restore(id){const snap=this.snapshots.find(s=>s.id===id);if(!snap)return!1;const ed=document.getElementById("editor");return ed?(this.save("Antes de restaurar"),ed.innerHTML=snap.html,typeof updateStats=="function"&&updateStats(),!0):!1},delete(id){this.snapshots=this.snapshots.filter(s=>s.id!==id),localStorage.setItem("wc-history",JSON.stringify(this.snapshots))},clear(){this.snapshots=[],localStorage.removeItem("wc-history")}};setInterval(()=>{const ed=document.getElementById("editor");ed&&ed.innerText.trim().length>50&&WC_HISTORY.save()},300*1e3);function openHistoryPanel(){const old=document.getElementById("__histPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__histPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const snaps=WC_HISTORY.snapshots;ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:580px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div style="font-size:17px;font-weight:700;color:#1a2942">\u{1F550} Historial de versiones</div>
        <div style="display:flex;gap:8px">
          <button onclick="__saveNamedVersion()" style="padding:7px 14px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4BE} Guardar ahora</button>
          <button onclick="WC_HISTORY.clear();openHistoryPanel()" style="padding:7px 10px;border:1.5px solid #eee;background:#fff;color:#999;border-radius:10px;cursor:pointer;font-size:12px">\u{1F5D1}\uFE0F</button>
        </div>
      </div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 18px 20px">
      ${snaps.length===0?`
        <div style="text-align:center;padding:40px;color:#bbb">
          <div style="font-size:40px;margin-bottom:12px">\u{1F550}</div>
          <div style="font-size:14px">No hay versiones guardadas a\xFAn</div>
          <div style="font-size:12px;margin-top:6px">Se guardan autom\xE1ticamente cada 5 minutos</div>
        </div>`:snaps.map((s,i)=>`
        <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;margin-bottom:6px;background:${i===0?"#f0f7ff":"#fafafa"};border:1.5px solid ${i===0?"#c0d8f0":"#eee"}">
          <div style="width:42px;height:42px;background:${i===0?"#0084ff":"#e8e8ec"};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">
            ${i===0?"\u2B50":"\u{1F4C4}"}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.label}</div>
            <div style="font-size:11px;color:#888;margin-top:2px">${s.date} \xB7 ${s.words} palabras \xB7 ${(s.size/1024).toFixed(1)}KB</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button onclick="__previewVersion(${s.id})" style="padding:6px 10px;border:1.5px solid #e0e0e0;background:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555">\u{1F441} Ver</button>
            <button onclick="__restoreVersion(${s.id})" style="padding:6px 10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600">\u21A9 Restaurar</button>
          </div>
        </div>`).join("")}
    </div>
    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__histPanel').remove()" style="width:100%;padding:12px;border:none;background:#f0f0f0;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __saveNamedVersion(){const name=prompt("Nombre de esta versi\xF3n:","Versi\xF3n "+new Date().toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit"}));name&&(WC_HISTORY.save(name),openHistoryPanel(),showToast("Versi\xF3n guardada \u2705"))}function __previewVersion(id){const snap=WC_HISTORY.snapshots.find(s=>s.id===id);snap&&typeof openDocWindow=="function"&&openDocWindow(snap.html,"\u{1F441} "+snap.label)}function __restoreVersion(id){confirm("\xBFRestaurar esta versi\xF3n? El estado actual se guardar\xE1 como nueva versi\xF3n.")&&WC_HISTORY.restore(id)&&(document.getElementById("__histPanel").remove(),showToast("Versi\xF3n restaurada \u2705"))}function openStatsPanel(){const ed=document.getElementById("editor");if(!ed)return;const text=ed.innerText||"",html=ed.innerHTML||"",words=text.trim().split(/\s+/).filter(w=>w.length>0),wCount=words.length,cCount=text.length,cNoSp=text.replace(/\s/g,"").length,sCount=(text.match(/[.!?]+/g)||[]).length,pCount=ed.querySelectorAll("p,h1,h2,h3,li,blockquote").length,imgCount=ed.querySelectorAll("img").length,tblCount=ed.querySelectorAll("table").length,lnkCount=ed.querySelectorAll("a").length,readMin=Math.max(1,Math.round(wCount/200)),readSec=Math.round(wCount/200%1*60),htmlSize=(html.length/1024).toFixed(1),freq={};words.forEach(w=>{const clean=w.toLowerCase().replace(/[^\wáéíóúñü]/g,"");clean.length>3&&(freq[clean]=(freq[clean]||0)+1)});const topWords=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8).filter(([w])=>!["para","como","este","esta","esto","tambi\xE9n","pero","que","los","las","una","con","por","del","m\xE1s","muy","sus","son"].includes(w)),avgWL=wCount>0?cNoSp/wCount:0,avgSL=sCount>0?wCount/sCount:wCount;let readability,readColor;avgSL<10&&avgWL<5?(readability="Muy f\xE1cil",readColor="#27ae60"):avgSL<15&&avgWL<6?(readability="F\xE1cil",readColor="#2ecc71"):avgSL<20&&avgWL<7?(readability="Normal",readColor="#f39c12"):avgSL<25&&avgWL<8?(readability="Dif\xEDcil",readColor="#e67e22"):(readability="Muy dif\xEDcil",readColor="#e74c3c");const maxFreq=topWords.length>0?topWords[0][1]:1,old=document.getElementById("__statsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__statsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:18px;display:flex;align-items:center;gap:8px">
        \u{1F4CA} Estad\xEDsticas del documento
      </div>

      <!-- M\xE9tricas principales -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
        ${[["\u270E","Palabras",wCount.toLocaleString(),"#0084ff"],["Aa","Caracteres",cCount.toLocaleString(),"#9b59b6"],["Aa","Sin espacios",cNoSp.toLocaleString(),"#8e44ad"],[".","Oraciones",sCount.toLocaleString(),"#27ae60"],["\xB6","P\xE1rrafos",pCount.toLocaleString(),"#e67e22"],["\u23F1","Lectura",readMin+"m "+readSec+"s","#e74c3c"],["\u{1F5BC}","Im\xE1genes",imgCount.toLocaleString(),"#1abc9c"],["\u{1F5C3}","Tablas",tblCount.toLocaleString(),"#3498db"]].map(([icon,label,val,color])=>`
          <div style="background:#fafafa;border-radius:12px;padding:12px;border:1.5px solid #f0f0f0">
            <div style="font-size:11px;color:#aaa;font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">${label}</div>
            <div style="font-size:20px;font-weight:800;color:${color}">${val}</div>
          </div>`).join("")}
      </div>

      <!-- Legibilidad -->
      <div style="background:#fafafa;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #f0f0f0">
        <div style="font-size:11px;color:#aaa;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Nivel de legibilidad</div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:20px;font-weight:800;color:${readColor}">${readability}</div>
          <div style="flex:1;height:8px;background:#eee;border-radius:4px;overflow:hidden">
            <div style="height:100%;background:${readColor};width:${readability==="Muy f\xE1cil"?20:readability==="F\xE1cil"?40:readability==="Normal"?60:readability==="Dif\xEDcil"?80:100}%;border-radius:4px;transition:width .5s"></div>
          </div>
        </div>
        <div style="font-size:11px;color:#aaa;margin-top:6px">Longitud promedio: ${avgWL.toFixed(1)} car/palabra \xB7 ${avgSL.toFixed(1)} palabras/oraci\xF3n</div>
      </div>

      <!-- Palabras frecuentes -->
      ${topWords.length>0?`
      <div style="background:#fafafa;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #f0f0f0">
        <div style="font-size:11px;color:#aaa;font-weight:600;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Palabras m\xE1s usadas</div>
        <div style="display:flex;flex-direction:column;gap:5px">
          ${topWords.map(([w,n])=>`
            <div style="display:flex;align-items:center;gap:8px">
              <div style="font-size:12px;font-weight:600;color:#333;min-width:80px">${w}</div>
              <div style="flex:1;height:6px;background:#eee;border-radius:3px;overflow:hidden">
                <div style="height:100%;background:#0084ff;width:${Math.round(n/maxFreq*100)}%;border-radius:3px"></div>
              </div>
              <div style="font-size:11px;color:#aaa;min-width:20px;text-align:right">${n}</div>
            </div>`).join("")}
        </div>
      </div>`:""}

      <!-- Info t\xE9cnica -->
      <div style="background:#fafafa;border-radius:12px;padding:12px;margin-bottom:18px;border:1.5px solid #f0f0f0">
        <div style="font-size:11px;color:#aaa;font-weight:600;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Informaci\xF3n t\xE9cnica</div>
        <div style="font-size:12px;color:#555;line-height:1.8">
          Tama\xF1o HTML: <strong>${htmlSize} KB</strong> &nbsp;\xB7&nbsp;
          Im\xE1genes: <strong>${imgCount}</strong> &nbsp;\xB7&nbsp;
          Tablas: <strong>${tblCount}</strong> &nbsp;\xB7&nbsp;
          V\xEDnculos: <strong>${lnkCount}</strong>
        </div>
      </div>
    </div>
    <div style="padding:0 20px 20px">
      <button onclick="document.getElementById('__statsPanel').remove()" style="width:100%;padding:12px;border:none;background:#f0f0f0;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function openLenguasPanel(){const old=document.getElementById("__lenguasPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__lenguasPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const sel=window.getSelection(),word=sel&&sel.toString().trim()||"";ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:600px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F33F} Lenguas Ind\xEDgenas de Costa Rica</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">7 lenguas \xB7 Diccionario Thiel 1882 \xB7 2,515 palabras</div>

      <div style="display:flex;gap:8px;margin-bottom:14px">
        <input type="text" id="__lpWord" value="${word.replace(/"/g,"&quot;")}" placeholder="Buscar palabra en las 7 lenguas..."
          style="flex:1;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:12px;font-size:14px;outline:none"
          oninput="__lpSearch(this.value)"
          onfocus="this.style.borderColor='#27ae60'"
          onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter')__lpSearch(this.value)">
        <button onclick="__lpSearch(document.getElementById('__lpWord').value)" style="padding:10px 16px;border:none;background:#27ae60;color:#fff;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600">Buscar</button>
      </div>
    </div>

    <div id="__lpResults" style="flex:1;overflow-y:auto;padding:0 18px 20px">
      <div style="text-align:center;color:#bbb;padding:30px;font-size:13px">
        ${word?"Cargando...":"Escribe una palabra para buscar en todas las lenguas"}
      </div>
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        ${[["Hola","hola"],["Agua","agua"],["Casa","casa"],["Fuego","fuego"],["Tierra","tierra"],["Gracias","gracias"],["Dios","dios"],["Sol","sol"]].map(([label,word2])=>`
          <button onclick="document.getElementById('__lpWord').value='${word2}';__lpSearch('${word2}')"
            style="padding:5px 12px;border:1.5px solid #d4f0dc;background:#f0fff4;border-radius:20px;cursor:pointer;font-size:12px;color:#27ae60;font-weight:600;transition:all .15s"
            onmouseover="this.style.background='#27ae60';this.style.color='#fff'"
            onmouseout="this.style.background='#f0fff4';this.style.color='#27ae60'">
            ${label}
          </button>`).join("")}
      </div>
      <button onclick="document.getElementById('__lenguasPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),word&&setTimeout(()=>__lpSearch(word),100)}function __lpSearch(query){const q=query.trim().toLowerCase(),results=document.getElementById("__lpResults");if(!results)return;if(!q){results.innerHTML='<div style="text-align:center;color:#bbb;padding:30px;font-size:13px">Escribe una palabra para buscar</div>';return}const found=(window.dictData||[]).filter(e=>Object.values(e).some(v=>v&&typeof v=="string"&&v.toLowerCase().includes(q))).slice(0,15);if(!found.length){results.innerHTML=`<div style="text-align:center;color:#bbb;padding:30px;font-size:13px">No encontrado: "${q}"</div>`;return}const langs=[{key:"es",name:"Espa\xF1ol",flag:"\u{1F1EA}\u{1F1F8}",color:"#e74c3c"},{key:"bribri",name:"Bribri",flag:"\u{1F33F}",color:"#27ae60"},{key:"cabecar",name:"Cab\xE9car",flag:"\u{1F33F}",color:"#2980b9"},{key:"maleku",name:"Maleku",flag:"\u{1F33F}",color:"#8e44ad"},{key:"boruca",name:"Boruca",flag:"\u{1F33F}",color:"#e67e22"},{key:"ngabe",name:"Ng\xE4be",flag:"\u{1F33F}",color:"#16a085"},{key:"terraba",name:"T\xE9rraba",flag:"\u{1F33F}",color:"#c0392b"}];results.innerHTML=found.map(entry=>`
    <div style="background:#fafafa;border-radius:14px;padding:14px;margin-bottom:10px;border:1.5px solid #e8e8e8">
      <div style="font-size:15px;font-weight:700;color:#1a2942;margin-bottom:10px;display:flex;align-items:center;gap:8px">
        <span>\u{1F4D6}</span> ${entry.es||q}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${langs.filter(l=>l.key!=="es"&&entry[l.key]&&entry[l.key]!=="\u2014").map(l=>`
          <div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#fff;border-radius:9px;border:1px solid #eee">
            <div style="font-size:11px;font-weight:700;color:${l.color};min-width:60px">${l.flag} ${l.name}</div>
            <div style="flex:1;font-size:14px;color:#333;font-weight:500">${entry[l.key]}</div>
            <button onclick="__lpSpeak('${entry[l.key].replace(/'/g,"\\'")}','${l.key}')"
              style="background:none;border:1.5px solid ${l.color}33;border-radius:8px;padding:4px 8px;cursor:pointer;font-size:14px;transition:all .15s;flex-shrink:0"
              title="Escuchar pronunciaci\xF3n"
              onmouseover="this.style.background='${l.color}11'"
              onmouseout="this.style.background='none'">
              \u{1F50A}
            </button>
            <button onclick="__lpInsert('${entry[l.key].replace(/'/g,"\\'")}','${l.name}')"
              style="background:${l.color};color:#fff;border:none;border-radius:8px;padding:4px 10px;cursor:pointer;font-size:11px;font-weight:600;flex-shrink:0">
              Insertar
            </button>
          </div>`).join("")}
      </div>
    </div>`).join("")}function __lpSpeak(text,lang){if(!window.speechSynthesis){showToast("S\xEDntesis de voz no disponible");return}window.speechSynthesis.cancel();const utt=new SpeechSynthesisUtterance(text),langMap={bribri:"es-CR",cabecar:"es-CR",maleku:"es-CR",boruca:"es-CR",ngabe:"es-CR",terraba:"es-CR"};utt.lang=langMap[lang]||"es-CR",utt.rate=.7,utt.pitch=1.1,window.speechSynthesis.speak(utt),showToast("\u{1F50A} Reproduciendo: "+text)}function __lpInsert(text,lang){typeof insertHTML=="function"&&insertHTML(` <em style="color:#27ae60;font-style:normal;font-weight:600">${text}</em> `),showToast(lang+': "'+text+'" insertado \u2705'),document.getElementById("__lenguasPanel")&&document.getElementById("__lenguasPanel").remove()}const WC_TEMPLATES_CR=[{icon:"\u{1F3DB}\uFE0F",name:"Carta Oficial CR",desc:"Formato oficial institucional costarricense",content:`<div style="font-family:'Times New Roman',serif;max-width:16cm;margin:0 auto;font-size:12pt;line-height:1.5">
<p style="text-align:right;font-size:10pt;color:#555">San Jos\xE9, Costa Rica, ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</p>
<p style="text-align:right;font-size:10pt;color:#555">Referencia: CR-${new Date().getFullYear()}-001</p>
<br>
<p><strong>Se\xF1or(a):</strong><br>___________________________<br>___________________________<br><em>Presente</em></p>
<br>
<p><strong>Estimado(a) se\xF1or(a):</strong></p>
<br>
<p style="text-indent:1cm;text-align:justify">Me dirijo a usted en forma muy respetuosa, con el prop\xF3sito de...</p>
<br>
<p style="text-indent:1cm;text-align:justify">Por lo anterior, me permito solicitarle muy respetuosamente...</p>
<br>
<p>Sin otro particular, se despide,</p>
<br><br><br>
<p>_______________________________<br><strong>Nombre y Apellidos</strong><br>Cargo<br>Instituci\xF3n<br>Tel: ______ \xB7 Correo: ______</p>
</div>`},{icon:"\u2696\uFE0F",name:"Contrato CR",desc:"Contrato de servicios profesionales",content:`<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6">
<h2 style="text-align:center;text-transform:uppercase;font-size:14pt">CONTRATO DE SERVICIOS PROFESIONALES</h2>
<p style="text-align:center;font-size:10pt;color:#555">Rep\xFAblica de Costa Rica</p>
<hr style="margin:16px 0">
<p>Entre los suscritos, <strong>________________________</strong>, mayor de edad, portador de la c\xE9dula de identidad n\xFAmero <strong>___-____-____</strong>, en adelante denominado <strong>"EL CONTRATANTE"</strong>, y <strong>________________________</strong>, c\xE9dula <strong>___-____-____</strong>, en adelante <strong>"EL CONTRATADO"</strong>, ambos mayores de edad y vecinos de Costa Rica, se conviene el presente contrato bajo las siguientes cl\xE1usulas:</p>
<br>
<p><strong>CL\xC1USULA PRIMERA \u2014 OBJETO DEL CONTRATO:</strong><br>El presente contrato tiene por objeto...</p>
<br>
<p><strong>CL\xC1USULA SEGUNDA \u2014 PLAZO:</strong><br>El plazo del contrato ser\xE1 de ___ meses, a partir del ___ de ________ de 20___.</p>
<br>
<p><strong>CL\xC1USULA TERCERA \u2014 HONORARIOS:</strong><br>El CONTRATANTE pagar\xE1 al CONTRATADO la suma de \u20A1_______________ (colones exactos), mediante...</p>
<br>
<p><strong>CL\xC1USULA CUARTA \u2014 OBLIGACIONES:</strong><br>El CONTRATADO se obliga a...</p>
<br>
<p><strong>CL\xC1USULA QUINTA \u2014 CONFIDENCIALIDAD:</strong><br>El CONTRATADO se compromete a guardar absoluta confidencialidad sobre...</p>
<br>
<p><strong>CL\xC1USULA SEXTA \u2014 LEGISLACI\xD3N APLICABLE:</strong><br>El presente contrato se rige por las leyes de la Rep\xFAblica de Costa Rica.</p>
<br><br>
<p>Firmado en San Jos\xE9, Costa Rica, a los ___ d\xEDas del mes de ________ de 20___.</p>
<br><br>
<table style="width:100%;border:none"><tr>
<td style="border:none;text-align:center;padding:20px 0">_______________________<br><strong>EL CONTRATANTE</strong><br>C\xE9dula: ___-____-____</td>
<td style="border:none;text-align:center;padding:20px 0">_______________________<br><strong>EL CONTRATADO</strong><br>C\xE9dula: ___-____-____</td>
</tr></table>
</div>`},{icon:"\u{1F4CB}",name:"Acta Municipal CR",desc:"Acta de reuni\xF3n de \xF3rgano colegiado",content:`<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6">
<h2 style="text-align:center;text-transform:uppercase">ACTA DE SESI\xD3N ORDINARIA N\xB0 ___</h2>
<p style="text-align:center;font-size:10pt">________________, ${new Date().toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
<hr>
<p>Al ser las <strong>___:___ horas</strong> del d\xEDa indicado, se da inicio a la sesi\xF3n ordinaria n\xFAmero ___, en las instalaciones de ___________________________.</p>
<br>
<p><strong>CAP\xCDTULO I \u2014 ASISTENCIA</strong></p>
<p><strong>Presentes:</strong></p>
<p>1. _____________________________ \u2014 Presidente(a)<br>2. _____________________________<br>3. _____________________________</p>
<p><strong>Ausentes:</strong> Ninguno / ___________________________</p>
<br>
<p><strong>CAP\xCDTULO II \u2014 COMPROBACI\xD3N DEL QU\xD3RUM</strong></p>
<p>El(La) Presidente(a) comprueba la existencia del qu\xF3rum reglamentario y declara abierta la sesi\xF3n.</p>
<br>
<p><strong>CAP\xCDTULO III \u2014 ORDEN DEL D\xCDA</strong></p>
<p>1. Lectura y aprobaci\xF3n del acta anterior<br>2. Asuntos de tr\xE1mite<br>3. Asuntos varios</p>
<br>
<p><strong>ART\xCDCULO 1\xB0 \u2014 ACTA ANTERIOR</strong></p>
<p>Se lee el acta de la sesi\xF3n anterior. Se aprueba por unanimidad / con las siguientes modificaciones: ___</p>
<br>
<p><strong>ART\xCDCULO 2\xB0 \u2014 ASUNTOS DE TR\xC1MITE</strong></p>
<p>...</p>
<br>
<p>Sin m\xE1s asuntos que tratar, se da por concluida la sesi\xF3n al ser las <strong>___:___ horas</strong>.</p>
<br><br>
<p style="text-align:center">_______________________________<br><strong>SECRETARIO(A)</strong></p>
</div>`},{icon:"\u{1F4CA}",name:"Informe de Labores CR",desc:"Informe anual institucional",content:`<div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5">
<h1 style="text-align:center;color:#003da5;font-size:18pt;border-bottom:3px solid #ce1126;padding-bottom:10px">INFORME DE LABORES ${new Date().getFullYear()}</h1>
<p style="text-align:center;color:#555;margin-bottom:24px">___________________________<br>Costa Rica</p>
<h2 style="color:#003da5;font-size:13pt;border-left:4px solid #ce1126;padding-left:10px">I. PRESENTACI\xD3N</h2>
<p style="text-indent:1cm;text-align:justify">En cumplimiento con lo establecido en el art\xEDculo ___ de la Ley ___, me complace presentar el Informe de Labores correspondiente al per\xEDodo comprendido entre el 1\xB0 de enero y el 31 de diciembre del a\xF1o en curso.</p>
<br>
<h2 style="color:#003da5;font-size:13pt;border-left:4px solid #ce1126;padding-left:10px">II. OBJETIVOS INSTITUCIONALES</h2>
<p>2.1 Objetivo General</p>
<p style="text-indent:1cm">___________________________</p>
<p>2.2 Objetivos Espec\xEDficos</p>
<p style="text-indent:1cm">a) ___________________________<br>b) ___________________________<br>c) ___________________________</p>
<br>
<h2 style="color:#003da5;font-size:13pt;border-left:4px solid #ce1126;padding-left:10px">III. LOGROS Y RESULTADOS</h2>
<table style="border-collapse:collapse;width:100%;margin:10px 0">
<tr style="background:#003da5;color:#fff"><th style="padding:8px;border:1px solid #002080">Actividad</th><th style="padding:8px;border:1px solid #002080">Meta</th><th style="padding:8px;border:1px solid #002080">Alcanzado</th><th style="padding:8px;border:1px solid #002080">%</th></tr>
<tr><td style="padding:8px;border:1px solid #ddd">___</td><td style="padding:8px;border:1px solid #ddd">___</td><td style="padding:8px;border:1px solid #ddd">___</td><td style="padding:8px;border:1px solid #ddd">___%</td></tr>
</table>
<br>
<h2 style="color:#003da5;font-size:13pt;border-left:4px solid #ce1126;padding-left:10px">IV. CONCLUSIONES Y RECOMENDACIONES</h2>
<p style="text-indent:1cm;text-align:justify">Con base en los resultados obtenidos durante el per\xEDodo...</p>
<br>
<p style="text-align:right;margin-top:40px">_______________________________<br><strong>Firma autorizada</strong><br>___________________________<br>Costa Rica, ${new Date().toLocaleDateString("es-CR",{month:"long",year:"numeric"})}</p>
</div>`},{icon:"\u{1F4B0}",name:"Cotizaci\xF3n CR",desc:"Cotizaci\xF3n comercial con colones",content:`<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.4">
<table style="width:100%;border:none;margin-bottom:20px"><tr>
<td style="border:none;vertical-align:top">
<h2 style="color:#003da5;margin:0;font-size:16pt">COTIZACI\xD3N</h2>
<div style="font-size:10pt;color:#888">N\xB0 COT-${new Date().getFullYear()}-___</div>
</td>
<td style="border:none;text-align:right;vertical-align:top">
<div style="font-size:10pt;color:#555"><strong>Empresa / Nombre</strong><br>Tel: ______ <br>correo@empresa.cr<br>Costa Rica</div>
</td>
</tr></table>
<hr style="border-color:#003da5;border-width:2px;margin-bottom:16px">
<p><strong>Para:</strong> ___________________________<br><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}<br><strong>V\xE1lida hasta:</strong> ___________________________</p>
<br>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#003da5;color:#fff">
<th style="padding:8px;border:1px solid #002080;text-align:left">N\xB0</th>
<th style="padding:8px;border:1px solid #002080;text-align:left">Descripci\xF3n</th>
<th style="padding:8px;border:1px solid #002080;text-align:center">Cant.</th>
<th style="padding:8px;border:1px solid #002080;text-align:right">P. Unit. \u20A1</th>
<th style="padding:8px;border:1px solid #002080;text-align:right">Total \u20A1</th>
</tr>
<tr><td style="padding:8px;border:1px solid #ddd">1</td><td style="padding:8px;border:1px solid #ddd">___________________________</td><td style="padding:8px;border:1px solid #ddd;text-align:center">1</td><td style="padding:8px;border:1px solid #ddd;text-align:right">\u20A10</td><td style="padding:8px;border:1px solid #ddd;text-align:right">\u20A10</td></tr>
<tr><td style="padding:8px;border:1px solid #ddd">2</td><td style="padding:8px;border:1px solid #ddd">___________________________</td><td style="padding:8px;border:1px solid #ddd;text-align:center">1</td><td style="padding:8px;border:1px solid #ddd;text-align:right">\u20A10</td><td style="padding:8px;border:1px solid #ddd;text-align:right">\u20A10</td></tr>
<tr style="background:#f8f8f8"><td colspan="4" style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:600">Subtotal:</td><td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:600">\u20A10</td></tr>
<tr style="background:#f8f8f8"><td colspan="4" style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:600">IVA 13%:</td><td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:600">\u20A10</td></tr>
<tr style="background:#003da5;color:#fff"><td colspan="4" style="padding:8px;border:1px solid #002080;text-align:right;font-weight:700;font-size:13pt">TOTAL:</td><td style="padding:8px;border:1px solid #002080;text-align:right;font-weight:700;font-size:13pt">\u20A10</td></tr>
</table>
<br>
<p style="font-size:10pt;color:#555"><strong>Condiciones:</strong><br>\u2022 Forma de pago: ___________________________<br>\u2022 Tiempo de entrega: ___________________________<br>\u2022 Esta cotizaci\xF3n es v\xE1lida por ___ d\xEDas h\xE1biles</p>
</div>`},{icon:"\u{1F393}",name:"Tesis / Trabajo Final CR",desc:"Portada y estructura para trabajos acad\xE9micos UCR/TEC/UNA",content:`<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:2;text-align:center">
<p style="font-size:13pt;font-weight:700;text-transform:uppercase">UNIVERSIDAD DE COSTA RICA</p>
<p style="font-size:12pt">FACULTAD DE ___________________________</p>
<p style="font-size:12pt">ESCUELA DE ___________________________</p>
<br><br>
<p style="font-size:15pt;font-weight:700;text-transform:uppercase;line-height:1.4">T\xCDTULO DEL TRABAJO FINAL DE GRADUACI\xD3N<br>O TESIS</p>
<br><br>
<p style="font-size:12pt">Trabajo Final de Graduaci\xF3n sometido a consideraci\xF3n de la Comisi\xF3n del Programa de Estudios de Posgrado en ___________________________ para optar al grado y t\xEDtulo de <strong>Maestr\xEDa / Licenciatura en ___________________________</strong></p>
<br><br>
<p><strong>NOMBRE DEL ESTUDIANTE</strong></p>
<br><br>
<p>Ciudad Universitaria Rodrigo Facio<br>San Jos\xE9, Costa Rica</p>
<br>
<p>${new Date().toLocaleDateString("es-CR",{month:"long",year:"numeric"})}</p>
</div>
<br><br>
<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8">
<h2 style="font-size:13pt;text-transform:uppercase;text-align:center">\xCDNDICE GENERAL</h2>
<p>RESUMEN ...................................... iv<br>ABSTRACT ...................................... v<br>DEDICATORIA ...................................... vi<br>AGRADECIMIENTOS ...................................... vii<br>\xCDNDICE DE CUADROS ...................................... viii<br>\xCDNDICE DE FIGURAS ...................................... ix</p>
<p>CAP\xCDTULO I \u2014 INTRODUCCI\xD3N ...................................... 1<br>
&nbsp;&nbsp;1.1 Antecedentes ...................................... 2<br>
&nbsp;&nbsp;1.2 Justificaci\xF3n ...................................... 3<br>
&nbsp;&nbsp;1.3 Problema de investigaci\xF3n ...................................... 4<br>
&nbsp;&nbsp;1.4 Objetivos ...................................... 5</p>
<p>CAP\xCDTULO II \u2014 MARCO TE\xD3RICO ...................................... 7</p>
<p>CAP\xCDTULO III \u2014 METODOLOG\xCDA ...................................... 15</p>
<p>CAP\xCDTULO IV \u2014 RESULTADOS ...................................... 25</p>
<p>CAP\xCDTULO V \u2014 CONCLUSIONES ...................................... 45</p>
<p>REFERENCIAS BIBLIOGR\xC1FICAS ...................................... 50<br>ANEXOS ...................................... 55</p>
</div>`},{icon:"\u{1F4F0}",name:"Comunicado de Prensa CR",desc:"Bolet\xEDn oficial para medios de comunicaci\xF3n",content:`<div style="font-family:Arial,sans-serif;font-size:11pt;line-height:1.5">
<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #ce1126;padding-bottom:10px;margin-bottom:16px">
<div>
<div style="font-size:9pt;color:#888;font-weight:700;letter-spacing:2px;text-transform:uppercase">COMUNICADO DE PRENSA</div>
<div style="font-size:9pt;color:#555">Para publicaci\xF3n inmediata / Embargado hasta: ___________</div>
</div>
<div style="text-align:right;font-size:9pt;color:#555">
San Jos\xE9, ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}
</div>
</div>
<h2 style="font-size:16pt;line-height:1.3;margin-bottom:8px">T\xCDTULO PRINCIPAL DEL COMUNICADO EN MAY\xDASCULAS</h2>
<p style="font-size:12pt;color:#555;font-style:italic;margin-bottom:16px">Subt\xEDtulo o bajada que complementa y ampl\xEDa el titular</p>
<p><strong>SAN JOS\xC9, COSTA RICA</strong> \u2014 El/La ___________________________ inform\xF3 hoy que...</p>
<br>
<p style="text-align:justify">Primer p\xE1rrafo: la informaci\xF3n m\xE1s importante (qu\xE9, qui\xE9n, cu\xE1ndo, d\xF3nde, por qu\xE9, c\xF3mo).</p>
<br>
<p style="text-align:justify">Segundo p\xE1rrafo: contexto y antecedentes del tema.</p>
<br>
<p style="background:#f0f7ff;border-left:4px solid #003da5;padding:12px;font-style:italic">"Cita textual de un vocero oficial," indic\xF3 ___________________________.</p>
<br>
<p style="text-align:justify">Tercer p\xE1rrafo: datos adicionales, cifras, referencias.</p>
<br>
<p style="text-align:center;color:#555">\u2014 FIN \u2014</p>
<hr style="margin:16px 0">
<p style="font-size:9pt;color:#555"><strong>Contacto de prensa:</strong><br>Nombre: ___________________________<br>Tel\xE9fono: ___________________________<br>Correo: ___________________________@___.cr<br>Sitio web: www.___.go.cr / www.___.cr</p>
</div>`},{icon:"\u{1F33F}",name:"Documento Lenguas Ind\xEDgenas",desc:"Formato biling\xFCe espa\xF1ol-lengua ind\xEDgena CR",content:`<div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.6">
<div style="background:linear-gradient(135deg,#003da5,#27ae60);padding:20px;border-radius:8px;color:white;text-align:center;margin-bottom:20px">
<div style="font-size:22px;margin-bottom:8px">\u{1F33F} \u{1F98B} \u{1F33F}</div>
<h1 style="margin:0;font-size:16pt;letter-spacing:2px">T\xCDTULO DEL DOCUMENTO</h1>
<p style="margin:8px 0 0;opacity:.9;font-size:11pt">Documento Biling\xFCe \xB7 Espa\xF1ol / Bribri</p>
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
<tr style="background:#f0f7ff">
<th style="padding:10px;border:1px solid #c0d8f0;color:#003da5;width:50%">\u{1F1EA}\u{1F1F8} Espa\xF1ol</th>
<th style="padding:10px;border:1px solid #c0d8f0;color:#27ae60;width:50%">\u{1F33F} Bribri</th>
</tr>
<tr>
<td style="padding:10px;border:1px solid #eee;vertical-align:top">Texto en espa\xF1ol...</td>
<td style="padding:10px;border:1px solid #eee;vertical-align:top;color:#27ae60">Texto en Bribri...</td>
</tr>
<tr>
<td style="padding:10px;border:1px solid #eee;vertical-align:top">Agua</td>
<td style="padding:10px;border:1px solid #eee;vertical-align:top;color:#27ae60;font-weight:600">Aba</td>
</tr>
<tr>
<td style="padding:10px;border:1px solid #eee;vertical-align:top">Tierra</td>
<td style="padding:10px;border:1px solid #eee;vertical-align:top;color:#27ae60;font-weight:600">It\xF6</td>
</tr>
<tr>
<td style="padding:10px;border:1px solid #eee;vertical-align:top">Casa</td>
<td style="padding:10px;border:1px solid #eee;vertical-align:top;color:#27ae60;font-weight:600">Y\xF6</td>
</tr>
</table>
<p style="font-size:10pt;color:#888;text-align:center;border-top:1px solid #eee;padding-top:10px">
Fuente: Diccionario Thiel 1882 \xB7 WC Corporate Editor \xB7 Lenguas Ind\xEDgenas de Costa Rica
</p>
</div>`}];function openTemplatesCR(){const old=document.getElementById("__tplCRPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__tplCRPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:600px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F1E8}\u{1F1F7} Plantillas corporativas CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Formatos oficiales de Costa Rica \xB7 ${WC_TEMPLATES_CR.length} plantillas</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 18px 20px;display:flex;flex-direction:column;gap:8px">
      ${WC_TEMPLATES_CR.map((t,i)=>`
        <div style="display:flex;align-items:center;gap:12px;padding:14px;border-radius:14px;background:#fafafa;border:1.5px solid #eee;cursor:pointer;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'"
          onclick="__applyTemplateCR(${i})">
          <div style="width:46px;height:46px;background:linear-gradient(135deg,#003da5,#27ae60);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${t.icon}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;color:#1a1a1a">${t.name}</div>
            <div style="font-size:12px;color:#888;margin-top:2px">${t.desc}</div>
          </div>
          <div style="color:#0084ff;font-size:20px;flex-shrink:0">\u203A</div>
        </div>`).join("")}
    </div>
    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__tplCRPanel').remove()" style="width:100%;padding:12px;border:none;background:#f0f0f0;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __applyTemplateCR(idx){const t=WC_TEMPLATES_CR[idx];if(t){if(document.getElementById("__tplCRPanel").remove(),typeof openDocWindow=="function")openDocWindow(t.content,t.icon+" "+t.name);else{const ed=document.getElementById("editor");ed&&(ed.innerHTML=t.content)}showToast(t.icon+" Plantilla: "+t.name+" \u2705")}}let _focusMode=!1;function toggleFocusMode(){_focusMode=!_focusMode;const ed=document.getElementById("editor");if(_focusMode){[".header",".menu-card","#dictBox","#fabBtn","#communityBtn",".footer",".bottom-nav",".statusbar","#ruler","#mediaZone","#floatBar"].forEach(sel=>{const el=document.querySelector(sel);el&&(el.dataset.focusHidden="1",el.style.display="none")}),ed.style.cssText+=`;
      position:fixed;inset:0;z-index:9990;
      margin:0;max-width:none;width:100%;height:100%;
      border-radius:0;border:none;padding:8vh 15vw;
      overflow-y:auto;font-size:16pt;line-height:1.9;
      background:#fffef9;box-shadow:none;
    `;const exitBtn=document.createElement("button");exitBtn.id="__focusExitBtn",exitBtn.textContent="\u2715 Salir del modo enfoque",exitBtn.style.cssText="position:fixed;top:16px;right:16px;z-index:9991;background:rgba(0,0,0,.25);color:#fff;border:none;border-radius:20px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(10px)",exitBtn.onclick=toggleFocusMode,document.body.appendChild(exitBtn);const wc=document.createElement("div");wc.id="__focusWC",wc.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9991;background:rgba(0,0,0,.2);color:#fff;border-radius:20px;padding:6px 16px;font-size:12px;font-weight:600;backdrop-filter:blur(10px);pointer-events:none",document.body.appendChild(wc);const updateFocusWC=()=>{const w=ed.innerText.trim().split(/\s+/).filter(x=>x).length;wc.textContent=w+" palabras"};updateFocusWC(),ed.addEventListener("input",updateFocusWC),ed._focusWCListener=updateFocusWC,document.body.style.overflow="hidden",ed.focus(),showToast("Modo enfoque activado \u2014 Esc para salir"),document.addEventListener("keydown",function escListener(e){e.key==="Escape"&&(toggleFocusMode(),document.removeEventListener("keydown",escListener))})}else document.querySelectorAll("[data-focus-hidden]").forEach(el=>{el.style.display="",delete el.dataset.focusHidden}),ed.style.cssText="",document.getElementById("__focusExitBtn")&&document.getElementById("__focusExitBtn").remove(),document.getElementById("__focusWC")&&document.getElementById("__focusWC").remove(),ed._focusWCListener&&ed.removeEventListener("input",ed._focusWCListener),document.body.style.overflow="",showToast("Modo enfoque desactivado \u2600\uFE0F")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"history":openHistoryPanel();break;case"stats":openStatsPanel();break;case"lenguasPanel":openLenguasPanel();break;case"templatesCR":openTemplatesCR();break;case"focusMode":toggleFocusMode();break;default:orig(a)}}),console.log("WC Corporate Editor v25.5 \u2705 \u2014 Historial, Estad\xEDsticas, Lenguas CR+, Plantillas CR, Modo enfoque")},1300)})();function initGestures(){const ed=document.getElementById("editor");if(!ed)return;let touchStartX=0,touchStartY=0,touchStartTime=0,lastTap=0,initialDist=0,initialZoom=1,currentZoom=1,tapCount=0,tapTimer=null;ed.addEventListener("touchstart",e=>{if(e.touches.length===1&&(touchStartX=e.touches[0].clientX,touchStartY=e.touches[0].clientY,touchStartTime=Date.now()),e.touches.length===2){const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;initialDist=Math.sqrt(dx*dx+dy*dy),initialZoom=currentZoom}},{passive:!0}),ed.addEventListener("touchend",e=>{if(e.changedTouches.length!==1)return;const dx=e.changedTouches[0].clientX-touchStartX,dy=e.changedTouches[0].clientY-touchStartY,dt=Date.now()-touchStartTime,dist=Math.sqrt(dx*dx+dy*dy);if(dt<300&&Math.abs(dx)>80&&Math.abs(dy)<50){dx>0?(document.execCommand("undo"),showToast("\u21A9 Deshacer (swipe \u2192)")):(document.execCommand("redo"),showToast("\u21AA Rehacer (swipe \u2190)"));return}if(dt<400&&dy>100&&Math.abs(dx)<50&&touchStartY<ed.getBoundingClientRect().top+60){localStorage.setItem("wc-v25",ed.innerHTML),showToast("\u{1F4BE} Guardado (swipe \u2193)"),typeof WC_HISTORY<"u"&&WC_HISTORY.save("Guardado por gesto");return}const now=Date.now();if(dist<20&&dt<200){if(now-lastTap<300){const range=document.caretRangeFromPoint?document.caretRangeFromPoint(e.changedTouches[0].clientX,e.changedTouches[0].clientY):null;if(range){const sel=window.getSelection();sel.removeAllRanges(),sel.addRange(range),document.execCommand("selectWord"),showToast("Palabra seleccionada (doble tap)")}}lastTap=now}},{passive:!0}),ed.addEventListener("touchmove",e=>{if(e.touches.length!==2)return;const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY,scale=Math.sqrt(dx*dx+dy*dy)/initialDist*initialZoom;currentZoom=Math.max(.5,Math.min(2.5,scale)),ed.style.transform=`scale(${currentZoom})`,ed.style.transformOrigin="top center";const zv=document.getElementById("__sbZoomVal");zv&&(zv.textContent=Math.round(currentZoom*100)+"%")},{passive:!0});let threeFingerTimer=null;ed.addEventListener("touchstart",e=>{e.touches.length===3?threeFingerTimer=setTimeout(()=>{typeof toggleFab=="function"&&toggleFab(),showToast("\u26A1 Panel herramientas (3 dedos)")},400):clearTimeout(threeFingerTimer)},{passive:!0}),ed.addEventListener("touchend",()=>clearTimeout(threeFingerTimer),{passive:!0}),localStorage.getItem("wc-gestures-seen")||setTimeout(()=>{showToast("\u{1F446} Gestos: \u2192 deshacer \xB7 \u2190 rehacer \xB7 pellizcar zoom"),localStorage.setItem("wc-gestures-seen","1")},2e3)}function initKeyboardBar(){const isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)||window.innerWidth<768,bar=document.createElement("div");bar.id="__kbBar",bar.style.cssText=`
    position:fixed;bottom:0;left:0;right:0;
    background:#f0f0f3;border-top:1px solid #d0d0d5;
    display:none;z-index:9960;
    padding:6px 8px env(safe-area-inset-bottom);
    overflow-x:auto;white-space:nowrap;
    scrollbar-width:none;
    box-shadow:0 -2px 12px rgba(0,0,0,.1);
  `;const buttons=[{html:"<b>N</b>",title:"Negrita",action:"document.execCommand('bold')"},{html:"<i>C</i>",title:"Cursiva",action:"document.execCommand('italic')"},{html:"<u>S</u>",title:"Subrayado",action:"document.execCommand('underline')"},{html:"x\xB2",title:"Super\xEDndice",action:"if(typeof toggleSuperscript==='function')toggleSuperscript()"},{html:"x\u2082",title:"Sub\xEDndice",action:"if(typeof toggleSubscript==='function')toggleSubscript()"},{sep:!0},{html:"\u2B05",title:"Izquierda",action:"document.execCommand('justifyLeft')"},{html:"\u2261",title:"Centrar",action:"document.execCommand('justifyCenter')"},{html:"\u27A1",title:"Derecha",action:"document.execCommand('justifyRight')"},{html:"\u2630",title:"Justificar",action:"document.execCommand('justifyFull')"},{sep:!0},{html:"\u2022 Lista",title:"Lista vi\xF1etas",action:"document.execCommand('insertUnorderedList')"},{html:"1. Lista",title:"Lista numerada",action:"document.execCommand('insertOrderedList')"},{sep:!0},{html:"H1",title:"T\xEDtulo 1",action:"document.execCommand('formatBlock',false,'H1')"},{html:"H2",title:"T\xEDtulo 2",action:"document.execCommand('formatBlock',false,'H2')"},{html:"H3",title:"T\xEDtulo 3",action:"document.execCommand('formatBlock',false,'H3')"},{html:"\xB6",title:"Normal",action:"document.execCommand('formatBlock',false,'P')"},{sep:!0},{html:"\u21A9",title:"Deshacer",action:"document.execCommand('undo')"},{html:"\u21AA",title:"Rehacer",action:"document.execCommand('redo')"},{html:"\u{1F4BE}",title:"Guardar",action:"localStorage.setItem('wc-v25',document.getElementById('editor').innerHTML);showToast('Guardado \u{1F4BE}')"},{html:"\u{1F58D}\uFE0F",title:"Resaltar",action:"if(typeof applyHighlight==='function')applyHighlight('#FFFF00')"},{sep:!0},{html:"\u{1F5C3}\uFE0F",title:"Tabla",action:"if(typeof handleAction==='function')handleAction('insertTable')"},{html:"\u{1F5BC}\uFE0F",title:"Imagen",action:"document.getElementById('fileInputImage')&&document.getElementById('fileInputImage').click()"},{html:"/",title:"Comandos",action:"__triggerSlash()"},{html:"\u{1F999}",title:"IA Sib\xF6",action:"if(typeof toggleAI==='function')toggleAI()"}];bar.innerHTML=buttons.map(b=>b.sep?'<span style="display:inline-block;width:1px;height:24px;background:#ccc;margin:0 6px;vertical-align:middle"></span>':`<button
      onclick="${b.action};document.getElementById('editor').focus()"
      title="${b.title}"
      style="display:inline-block;padding:7px 12px;margin:0 2px;background:#fff;border:1px solid #d0d0d5;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#333;vertical-align:middle;transition:all .15s;white-space:nowrap;min-width:36px;text-align:center"
      onmousedown="e=>e.preventDefault()"
      ontouchstart="this.style.background='#e0e8ff'"
      ontouchend="this.style.background='#fff'">
      ${b.html}
    </button>`).join(""),document.body.appendChild(bar);const ed=document.getElementById("editor");ed&&(ed.addEventListener("focus",()=>{bar.style.display="block";const bn=document.querySelector(".bottom-nav");bn&&(bn.style.display="none")}),ed.addEventListener("blur",()=>{setTimeout(()=>{if(!bar.contains(document.activeElement)){bar.style.display="none";const bn=document.querySelector(".bottom-nav");bn&&(bn.style.display="")}},150)}));const pinBtn=document.createElement("button");pinBtn.style.cssText="display:inline-block;padding:7px 10px;margin:0 2px;background:#0084ff;border:none;border-radius:8px;cursor:pointer;font-size:13px;color:#fff;vertical-align:middle",pinBtn.textContent="\u{1F4CC}",pinBtn.title="Anclar barra",pinBtn.onclick=()=>{const pinned=bar.dataset.pinned==="1";bar.dataset.pinned=pinned?"0":"1",pinBtn.style.background=pinned?"#0084ff":"#27ae60",pinned||(bar.style.display="block"),showToast(pinned?"Barra desanclada":"Barra anclada \u{1F4CC}")},bar.appendChild(pinBtn)}function __triggerSlash(){const ed=document.getElementById("editor");ed&&(ed.focus(),document.execCommand("insertText",!1,"/"))}const WC_DRIVE={clientId:"",accessToken:localStorage.getItem("wc-drive-token")||"",fileName:"WC-Corporate-Document.html",isConnected(){return!!this.accessToken},async connect(){const CLIENT_ID=WC_DRIVE.clientId;if(!CLIENT_ID){this._showSetupPanel();return}const scope="https://www.googleapis.com/auth/drive.file",redirectUri=window.location.href.split("?")[0],authUrl=`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&prompt=consent`;window.open(authUrl,"_blank","width=500,height=600"),showToast("Abriendo Google Drive...")},_showSetupPanel(){const old=document.getElementById("__drivePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__drivePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
    <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:8px;display:flex;align-items:center;gap:8px">
        <img src="https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" style="width:28px;height:28px" onerror="this.style.display='none'">
        Guardar en Google Drive
      </div>
      <p style="font-size:13px;color:#666;margin-bottom:16px;line-height:1.5">
        Para sincronizar con Google Drive necesit\xE1s un Client ID de Google Cloud Console. Es gratis.
      </p>

      <div style="background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:16px;font-size:12px;color:#0066cc;line-height:1.7">
        <strong>Pasos:</strong><br>
        1. Ir a <a href="https://console.cloud.google.com" target="_blank" style="color:#0084ff">console.cloud.google.com</a><br>
        2. Crear proyecto \u2192 APIs \u2192 Drive API \u2192 Credenciales<br>
        3. Crear ID de cliente OAuth \u2192 Aplicaci\xF3n web<br>
        4. Copiar el Client ID aqu\xED \u2193
      </div>

      <input type="text" id="__driveClientId"
        placeholder="xxxx.apps.googleusercontent.com"
        value="${WC_DRIVE.clientId}"
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#0084ff'"
        onblur="this.style.borderColor='#e0e0e0'">

      <div style="margin-bottom:16px">
        <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Nombre del archivo</label>
        <input type="text" id="__driveFileName"
          value="${WC_DRIVE.fileName}"
          style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'"
          onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="display:flex;gap:8px">
        <button onclick="document.getElementById('__drivePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
        <button onclick="WC_DRIVE._saveConfig()" style="flex:2;padding:11px;border:none;background:#4285f4;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">Conectar Drive</button>
      </div>

      <div style="margin-top:14px;padding-top:14px;border-top:1px solid #eee">
        <div style="font-size:12px;color:#888;margin-bottom:8px;font-weight:600">O exportar directamente:</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button onclick="WC_DRIVE.exportAs('html');document.getElementById('__drivePanel').remove()" style="padding:8px 14px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} HTML</button>
          <button onclick="WC_DRIVE.exportAs('txt');document.getElementById('__drivePanel').remove()" style="padding:8px 14px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} TXT</button>
          <button onclick="WC_DRIVE.copyToClipboard();document.getElementById('__drivePanel').remove()" style="padding:8px 14px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Copiar</button>
        </div>
      </div>
    </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})},_saveConfig(){const cid=document.getElementById("__driveClientId").value.trim(),fn=document.getElementById("__driveFileName").value.trim();cid&&(WC_DRIVE.clientId=cid,localStorage.setItem("wc-drive-clientid",cid)),fn&&(WC_DRIVE.fileName=fn),document.getElementById("__drivePanel").remove(),cid?WC_DRIVE.connect():showToast("Configuraci\xF3n guardada")},async saveFile(){const ed=document.getElementById("editor");if(!ed)return;if(!this.accessToken){this._showSetupPanel();return}showToast("Guardando en Drive...");const content=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Calibri,Arial;margin:2.5cm;line-height:1.6}</style></head><body>${ed.innerHTML}</body></html>`,blob=new Blob([content],{type:"text/html"});try{const searchData=await(await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=drive`,{headers:{Authorization:"Bearer "+this.accessToken}})).json(),existingId=searchData.files&&searchData.files[0]?searchData.files[0].id:null;let url,method;if(existingId)url=`https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`,method="PATCH";else{url="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",method="POST";const meta=JSON.stringify({name:this.fileName,mimeType:"text/html"}),boundary="wc_boundary_"+Date.now(),body=`--${boundary}\r
Content-Type: application/json\r
\r
${meta}\r
--${boundary}\r
Content-Type: text/html\r
\r
${content}\r
--${boundary}--`;(await(await fetch(url,{method,headers:{Authorization:"Bearer "+this.accessToken,"Content-Type":`multipart/related; boundary="${boundary}"`},body})).json()).id?(showToast("\u2705 Guardado en Google Drive"),typeof WC_HISTORY<"u"&&WC_HISTORY.save("Google Drive sync")):showToast("\u26A0\uFE0F Error al guardar en Drive");return}(await(await fetch(url,{method,headers:{Authorization:"Bearer "+this.accessToken,"Content-Type":"text/html"},body:blob})).json()).id?(showToast("\u2705 Actualizado en Google Drive"),typeof WC_HISTORY<"u"&&WC_HISTORY.save("Google Drive sync")):(this.accessToken="",localStorage.removeItem("wc-drive-token"),showToast("\u26A0\uFE0F Sesi\xF3n expirada, reconect\xE1 Drive"))}catch(e){showToast("\u26A0\uFE0F Error Drive: "+e.message)}},exportAs(format){const ed=document.getElementById("editor");if(!ed)return;const title=ed.querySelector("h1")?ed.querySelector("h1").innerText.slice(0,40):"documento";if(format==="html"){const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Calibri,Arial;margin:2.5cm;line-height:1.6}</style></head><body>${ed.innerHTML}</body></html>`,a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html"})),a.download=title+".html",a.click()}else{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ed.innerText],{type:"text/plain"})),a.download=title+".txt",a.click()}showToast("Archivo descargado \u2705")},copyToClipboard(){const ed=document.getElementById("editor");ed&&navigator.clipboard.writeText(ed.innerText).then(()=>showToast("Texto copiado \u2705"))},checkCallback(){const hash=window.location.hash;if(hash.includes("access_token")){const token=new URLSearchParams(hash.substring(1)).get("access_token");token&&(this.accessToken=token,localStorage.setItem("wc-drive-token",token),window.location.hash="",showToast("\u2705 Google Drive conectado"))}}};WC_DRIVE.clientId=localStorage.getItem("wc-drive-clientid")||"",WC_DRIVE.checkCallback();function openDrivePanel(){WC_DRIVE._showSetupPanel()}function saveToDrive(){WC_DRIVE.saveFile()}function generateTOC(){const ed=document.getElementById("editor");if(!ed)return;const headings=ed.querySelectorAll("h1, h2, h3, h4");if(!headings.length){showToast("No hay t\xEDtulos en el documento. Usa H1, H2, H3.");return}headings.forEach((h,i)=>{h.id||(h.id="wc-heading-"+i)});let tocHTML=`
  <div id="wc-toc" style="
    background:linear-gradient(135deg,#f8f9ff,#fff);
    border:1.5px solid #c0d8f0;
    border-radius:14px;padding:20px;
    margin:16px 0;font-family:inherit;
    page-break-after:always;
  ">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="font-size:14pt;font-weight:700;color:#0084ff;display:flex;align-items:center;gap:8px">
        \u{1F4D1} Tabla de contenido
      </div>
      <button onclick="generateTOC()" style="background:none;border:1px solid #ccc;border-radius:6px;padding:3px 8px;cursor:pointer;font-size:11px;color:#888">\u21BB Actualizar</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:0">`,lastH1num=0,lastH2num=0,lastH3num=0;headings.forEach(h=>{const level=parseInt(h.tagName.substring(1)),text=h.innerText.trim(),id=h.id;level===1&&(lastH1num++,lastH2num=0,lastH3num=0),level===2&&(lastH2num++,lastH3num=0),level===3&&lastH3num++;const num=level===1?lastH1num+".":level===2?lastH1num+"."+lastH2num+".":level===3?lastH1num+"."+lastH2num+"."+lastH3num+".":"",indent={1:"0px",2:"20px",3:"40px",4:"56px"}[level]||"0px",fsize={1:"13px",2:"12px",3:"11px",4:"11px"}[level]||"12px",fweight=level<=2?"600":"400",color=level===1?"#1a2942":level===2?"#333":"#555";tocHTML+=`
      <a href="#${id}" onclick="__tocScroll('${id}');return false" style="
        display:flex;align-items:baseline;gap:6px;
        padding:5px 8px;margin-left:${indent};
        border-radius:6px;text-decoration:none;
        transition:background .15s;
      " onmouseover="this.style.background='#f0f7ff'"
         onmouseout="this.style.background='transparent'">
        ${num?`<span style="font-size:${fsize};color:#0084ff;font-weight:700;min-width:${level===1?"22px":level===2?"34px":"44px"};flex-shrink:0">${num}</span>`:'<span style="min-width:10px;flex-shrink:0"></span>'}
        <span style="font-size:${fsize};font-weight:${fweight};color:${color};flex:1">${text}</span>
        <span style="flex:1;border-bottom:1px dotted #ccc;margin:0 6px;min-width:20px"></span>
        <span style="font-size:11px;color:#aaa;flex-shrink:0">\u203A</span>
      </a>`}),tocHTML+=`</div>
    <div style="font-size:10px;color:#bbb;margin-top:12px;text-align:right">
      ${headings.length} secciones \xB7 Generado autom\xE1ticamente \xB7 WC Corporate Editor
    </div>
  </div>`;const firstH1=ed.querySelector("h1"),existing=ed.querySelector("#wc-toc");existing&&existing.remove(),firstH1&&firstH1.nextSibling?firstH1.insertAdjacentHTML("afterend",tocHTML):ed.insertAdjacentHTML("afterbegin",tocHTML),showToast("\u{1F4D1} Tabla de contenido generada \u2705"),typeof wcAnimate=="function"&&wcAnimate(ed.querySelector("#wc-toc"),"fadein")}function __tocScroll(id){const el=document.getElementById(id);el&&el.scrollIntoView({behavior:"smooth",block:"start"})}(function(){const ed=document.getElementById("editor");if(!ed)return;let tocTimer;ed.addEventListener("input",()=>{ed.querySelector("#wc-toc")&&(clearTimeout(tocTimer),tocTimer=setTimeout(()=>{ed.querySelector("#wc-toc")&&generateTOC()},3e3))})})();function updateFigureNumbers(){const ed=document.getElementById("editor");if(!ed)return;let figNum=0,tblNum=0,eqNum=0;ed.querySelectorAll("img").forEach(img=>{let next=img.closest("p")?img.closest("p").nextElementSibling:img.nextElementSibling;if(next&&(next.dataset.captionType==="fig"||next.tagName==="P"&&next.style.textAlign==="center"&&next.style.fontStyle==="italic")){figNum++;const text=next.innerText.replace(/^Figura \d+\.\s*/i,"");next.innerHTML=`<em style="color:#555;font-size:11px"><strong>Figura ${figNum}.</strong> ${text}</em>`,next.dataset.captionType="fig"}}),ed.querySelectorAll("table").forEach(tbl=>{let prev=tbl.previousElementSibling;if(prev&&(prev.dataset.captionType==="tbl"||prev.tagName==="P"&&prev.innerText.match(/^Tabla \d+/i))){tblNum++;const text=prev.innerText.replace(/^Tabla \d+\.\s*/i,"");prev.innerHTML=`<em style="color:#555;font-size:11px"><strong>Tabla ${tblNum}.</strong> ${text}</em>`,prev.dataset.captionType="tbl"}}),showToast(`Numeraci\xF3n actualizada: ${figNum} figura${figNum!==1?"s":""}, ${tblNum} tabla${tblNum!==1?"s":""} \u2705`)}function insertImageWithCaption(){document.getElementById("fileInputImage")&&document.getElementById("fileInputImage").click();const orig=document.getElementById("fileInputImage").onchange;document.getElementById("fileInputImage").addEventListener("change",function handler(){setTimeout(()=>{const lastImg=document.getElementById("editor").querySelector("img:last-of-type");if(lastImg){const caption=prompt("Descripci\xF3n de la figura:","Descripci\xF3n de la imagen");if(caption){const p=document.createElement("p");p.style.cssText="text-align:center;font-style:italic;font-size:11px;color:#555;margin-top:4px",p.dataset.captionType="fig",p.innerHTML=`<em><strong>Figura X.</strong> ${caption}</em>`,lastImg.closest("p")?lastImg.closest("p").insertAdjacentElement("afterend",p):lastImg.insertAdjacentElement("afterend",p),updateFigureNumbers()}}},500),document.getElementById("fileInputImage").removeEventListener("change",handler)})}function insertTableWithCaption(){const caption=prompt("T\xEDtulo de la tabla:","Datos del estudio");if(!caption)return;const tableHTML=`
  <p style="text-align:center;font-style:italic;font-size:11px;color:#555;margin-bottom:4px" data-caption-type="tbl">
    <em><strong>Tabla X.</strong> ${caption}</em>
  </p>
  <table style="border-collapse:collapse;width:100%;margin:4px 0 16px">
    <tr>
      <th style="border:1px solid #333;padding:8px;background:#f0f7ff;font-size:11px">Columna 1</th>
      <th style="border:1px solid #333;padding:8px;background:#f0f7ff;font-size:11px">Columna 2</th>
      <th style="border:1px solid #333;padding:8px;background:#f0f7ff;font-size:11px">Columna 3</th>
    </tr>
    <tr>
      <td style="border:1px solid #ddd;padding:8px;font-size:11px"> </td>
      <td style="border:1px solid #ddd;padding:8px;font-size:11px"> </td>
      <td style="border:1px solid #ddd;padding:8px;font-size:11px"> </td>
    </tr>
    <tr>
      <td style="border:1px solid #ddd;padding:8px;font-size:11px"> </td>
      <td style="border:1px solid #ddd;padding:8px;font-size:11px"> </td>
      <td style="border:1px solid #ddd;padding:8px;font-size:11px"> </td>
    </tr>
  </table>
  <p style="text-align:center;font-size:10px;color:#aaa;margin-top:-10px;font-style:italic">Fuente: Elaboraci\xF3n propia.</p>
  <p></p>`;typeof insertHTML=="function"&&insertHTML(tableHTML),setTimeout(updateFigureNumbers,200)}function openCaptionsPanel(){const ed=document.getElementById("editor");if(!ed)return;const figs=ed.querySelectorAll('[data-caption-type="fig"]'),tbls=ed.querySelectorAll('[data-caption-type="tbl"]'),old=document.getElementById("__captPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__captPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;max-height:85vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u{1F522} Figuras y tablas</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <button onclick="insertImageWithCaption();document.getElementById('__captPanel').remove()"
        style="padding:14px;border:2px solid #eee;border-radius:12px;cursor:pointer;background:#fafafa;font-size:13px;font-weight:600;transition:all .15s"
        onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
        onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
        \u{1F5BC}\uFE0F<br><span style="font-size:11px;color:#888;font-weight:400">Insertar figura<br>con t\xEDtulo</span>
      </button>
      <button onclick="insertTableWithCaption();document.getElementById('__captPanel').remove()"
        style="padding:14px;border:2px solid #eee;border-radius:12px;cursor:pointer;background:#fafafa;font-size:13px;font-weight:600;transition:all .15s"
        onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
        onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
        \u{1F5C3}\uFE0F<br><span style="font-size:11px;color:#888;font-weight:400">Insertar tabla<br>con t\xEDtulo</span>
      </button>
    </div>

    <button onclick="updateFigureNumbers();document.getElementById('__captPanel').remove()"
      style="width:100%;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:14px">
      \u{1F504} Renumerar todo (${figs.length} fig \xB7 ${tbls.length} tabla${tbls.length!==1?"s":""})
    </button>

    ${figs.length||tbls.length?`
    <div style="background:#fafafa;border-radius:10px;padding:14px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px">\xCDndice de figuras y tablas</div>
      ${Array.from(tbls).map((t,i)=>`<div style="font-size:12px;color:#333;padding:4px 0;border-bottom:1px dotted #eee">\u{1F4CA} Tabla ${i+1}. ${t.innerText.replace(/^Tabla \d+\.\s*/i,"")}</div>`).join("")}
      ${Array.from(figs).map((f,i)=>`<div style="font-size:12px;color:#333;padding:4px 0;border-bottom:1px dotted #eee">\u{1F5BC}\uFE0F Figura ${i+1}. ${f.innerText.replace(/^Figura \d+\.\s*/i,"")}</div>`).join("")}
    </div>`:""}

    <button onclick="document.getElementById('__captPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}(function(){setTimeout(function(){initGestures(),initKeyboardBar();const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"drivePanel":openDrivePanel();break;case"saveDrive":saveToDrive();break;case"generateTOC":generateTOC();break;case"captions":openCaptionsPanel();break;case"renumberFigs":updateFigureNumbers();break;default:orig(a)}}),console.log("WC Corporate Editor v25.6 \u2705 \u2014 Gestos, Teclado, Drive, TOC, Figuras/Tablas")},1400)})();const WC_FIELDS={data:JSON.parse(localStorage.getItem("wc-fields")||"{}"),defaults:{fecha:()=>new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"}),fechaCorta:()=>new Date().toLocaleDateString("es-CR"),a\u00F1o:()=>new Date().getFullYear().toString(),mes:()=>new Date().toLocaleDateString("es-CR",{month:"long"}),hora:()=>new Date().toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit"}),autor:()=>WC_FIELDS.data.autor||"Autor",empresa:()=>WC_FIELDS.data.empresa||"Empresa",cargo:()=>WC_FIELDS.data.cargo||"Cargo",telefono:()=>WC_FIELDS.data.telefono||"Tel\xE9fono",correo:()=>WC_FIELDS.data.correo||"correo@empresa.cr",ciudad:()=>WC_FIELDS.data.ciudad||"San Jos\xE9",pais:()=>WC_FIELDS.data.pais||"Costa Rica",documento:()=>WC_FIELDS.data.documento||"Sin t\xEDtulo",version:()=>WC_FIELDS.data.version||"v1.0",paginas:()=>{const ed=document.getElementById("editor");return ed?Math.max(1,Math.ceil(ed.offsetHeight/_cmToPxF(27.94))).toString():"1"},palabras:()=>{const ed=document.getElementById("editor");return ed?ed.innerText.trim().split(/\s+/).filter(w=>w).length.toString():"0"}},resolve(key){const k=key.trim();return this.defaults[k]?this.defaults[k]():this.data[k]?this.data[k]:"{{"+k+"}}"},updateAll(){const ed=document.getElementById("editor");if(!ed)return;let html=ed.innerHTML;html=html.replace(/\{\{([^}]+)\}\}/g,(match,key)=>{const val=this.resolve(key);return val===match?match:`<span class="wc-field" data-field="${key}" style="color:#0084ff;background:#f0f7ff;border-radius:3px;padding:0 3px;font-style:normal" title="Campo: {{${key}}}">${val}</span>`}),ed.innerHTML=html,showToast("Campos actualizados \u2705")},save(){localStorage.setItem("wc-fields",JSON.stringify(this.data))}};function _cmToPxF(cm){const p=document.createElement("div");p.style.cssText="position:absolute;height:"+cm+"cm;visibility:hidden",document.body.appendChild(p);const px=p.offsetHeight;return p.remove(),px}function openFieldsPanel(){const old=document.getElementById("__fieldsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__fieldsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const autoFields=["fecha","fechaCorta","a\xF1o","mes","hora","paginas","palabras"],userFields=["autor","empresa","cargo","telefono","correo","ciudad","pais","documento","version"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:22px 22px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:6px">\u26A1 Campos din\xE1micos</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">Escrib\xED <code style="background:#f0f0f0;padding:1px 6px;border-radius:4px">{{campo}}</code> en el documento y se reemplaza autom\xE1ticamente</div>

      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Campos autom\xE1ticos</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">
        ${autoFields.map(f=>`
          <button onclick="__insertField('${f}')"
            style="padding:6px 12px;border:1.5px solid #c0d8f0;background:#f0f7ff;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;color:#0066cc;transition:all .15s"
            onmouseover="this.style.background='#0084ff';this.style.color='#fff'"
            onmouseout="this.style.background='#f0f7ff';this.style.color='#0066cc'">
            {{${f}}} <span style="opacity:.6;font-weight:400">= ${WC_FIELDS.resolve(f)}</span>
          </button>`).join("")}
      </div>

      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Campos personales</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        ${userFields.map(f=>`
          <div style="display:flex;align-items:center;gap:8px">
            <div style="font-size:12px;font-weight:600;color:#0084ff;min-width:80px">{{${f}}}</div>
            <input type="text" id="__fld_${f}"
              value="${WC_FIELDS.data[f]||""}"
              placeholder="${WC_FIELDS.defaults[f]?WC_FIELDS.defaults[f]():f}"
              style="flex:1;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none"
              onfocus="this.style.borderColor='#0084ff'"
              onblur="this.style.borderColor='#e0e0e0'">
            <button onclick="__insertField('${f}')"
              style="padding:7px 10px;border:none;background:#f0f7ff;border-radius:8px;cursor:pointer;font-size:12px;color:#0084ff;font-weight:600;white-space:nowrap">
              Insertar
            </button>
          </div>`).join("")}
      </div>

      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Campo personalizado</div>
      <div style="display:flex;gap:8px;margin-bottom:18px">
        <input type="text" id="__fldCustomName" placeholder="nombre_campo"
          style="flex:1;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__fldCustomVal" placeholder="valor"
          style="flex:1;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <button onclick="__addCustomField()"
          style="padding:9px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">
          +
        </button>
      </div>
    </div>
    <div style="padding:0 22px 22px;display:flex;gap:8px">
      <button onclick="__saveFields();document.getElementById('__fieldsPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Guardar</button>
      <button onclick="__saveFields();WC_FIELDS.updateAll();document.getElementById('__fieldsPanel').remove()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u26A1 Actualizar todo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __insertField(key){typeof restoreSelection=="function"&&restoreSelection(),document.execCommand("insertHTML",!1,`<span class="wc-field" data-field="${key}" style="color:#0084ff;background:#f0f7ff;border-radius:3px;padding:0 3px" title="{{${key}}}">${WC_FIELDS.resolve(key)}</span>`),showToast("Campo {{"+key+"}} insertado \u2705")}function __saveFields(){document.querySelectorAll('[id^="__fld_"]').forEach(inp=>{const key=inp.id.replace("__fld_","");inp.value.trim()&&(WC_FIELDS.data[key]=inp.value.trim())}),WC_FIELDS.save()}function __addCustomField(){const name=document.getElementById("__fldCustomName").value.trim().replace(/\s+/g,"_"),val=document.getElementById("__fldCustomVal").value.trim();if(!name||!val){showToast("Escrib\xED nombre y valor");return}WC_FIELDS.data[name]=val,WC_FIELDS.save(),__insertField(name),showToast("Campo {{"+name+'}} = "'+val+'" \u2705')}setTimeout(()=>{const ed=document.getElementById("editor");ed&&ed.querySelectorAll(".wc-field").forEach(el=>{const key=el.dataset.field;key&&(el.textContent=WC_FIELDS.resolve(key))})},1500);function openMailMergePanel(){const old=document.getElementById("__mergePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__mergePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:22px 22px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:6px">\u{1F4EC} Combinar correspondencia</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px;line-height:1.5">
        Us\xE1 <code style="background:#f0f0f0;padding:1px 6px;border-radius:4px">{{nombre}}</code>, <code style="background:#f0f0f0;padding:1px 6px;border-radius:4px">{{correo}}</code>, etc. en el documento.<br>
        Luego peg\xE1 una lista de destinatarios para generar N documentos.
      </div>

      <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#0066cc">
        <strong>Campos disponibles en el documento:</strong><br>
        <span id="__mergeDetected" style="font-weight:600">Detectando...</span>
      </div>

      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">Lista de destinatarios (CSV o tabla)</div>
      <div style="font-size:11px;color:#888;margin-bottom:8px">
        Primera fila = nombres de campos. Separador: coma o punto y coma.<br>
        Ejemplo: <code style="background:#f0f0f0;padding:1px 5px;border-radius:3px">nombre,correo,empresa</code>
      </div>
      <textarea id="__mergeCSV" rows="6"
        style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:12px;font-family:'Courier New',monospace;outline:none;resize:vertical;box-sizing:border-box;margin-bottom:12px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        placeholder="nombre,correo,empresa&#10;Juan P\xE9rez,juan@email.com,ABC S.A.&#10;Mar\xEDa L\xF3pez,maria@email.com,XYZ Corp&#10;Carlos Mora,carlos@email.com,QRS Ltda">Nombre,Correo,Empresa
Juan P\xE9rez,juan@correo.cr,Empresa ABC S.A.
Mar\xEDa L\xF3pez,maria@correo.cr,Servicios XYZ
Carlos Mora,carlos@correo.cr,Corporaci\xF3n QRS</textarea>

      <div id="__mergePreview" style="background:#fafafa;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#555;display:none">
        Vista previa: cargando...
      </div>
    </div>
    <div style="padding:0 22px 22px;display:flex;gap:8px">
      <button onclick="document.getElementById('__mergePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__previewMerge()" style="flex:1;padding:11px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F441} Vista previa</button>
      <button onclick="__executeMerge()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4EC} Combinar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(()=>{const ed=document.getElementById("editor"),det=document.getElementById("__mergeDetected");if(ed&&det){const matches=[...new Set((ed.innerHTML.match(/\{\{([^}]+)\}\}/g)||[]).map(m=>m))];det.textContent=matches.length?matches.join(", "):"No se encontraron campos {{...}} en el documento"}},100)}function __parseCSV(csv){const lines=csv.trim().split(`
`).filter(l=>l.trim());if(lines.length<2)return[];const sep=lines[0].includes(";")?";":",",headers=lines[0].split(sep).map(h=>h.trim().toLowerCase());return lines.slice(1).map(line=>{const vals=line.split(sep),obj={};return headers.forEach((h,i)=>{obj[h]=(vals[i]||"").trim()}),obj})}function __applyMerge(template,data){return template.replace(/\{\{([^}]+)\}\}/g,(match,key)=>{const k=key.trim().toLowerCase();return data[k]||data[key.trim()]||match})}function __previewMerge(){const csv=document.getElementById("__mergeCSV").value,rows=__parseCSV(csv);if(!rows.length){showToast("Ingres\xE1 al menos un destinatario");return}const ed=document.getElementById("editor"),template=ed?ed.innerHTML:"",preview=__applyMerge(template,rows[0]),pDiv=document.getElementById("__mergePreview");pDiv.style.display="block",pDiv.innerHTML=`
    <div style="font-weight:700;color:#0084ff;margin-bottom:6px">Vista previa \u2014 Destinatario 1 de ${rows.length}:</div>
    <div style="max-height:120px;overflow:hidden;border:1px solid #eee;border-radius:6px;padding:8px;background:#fff;font-size:11px">${preview.substring(0,500)}...</div>
    <div style="color:#888;margin-top:6px">${rows.length} documento${rows.length!==1?"s":""} se generar\xE1n</div>`}function __executeMerge(){const csv=document.getElementById("__mergeCSV").value,rows=__parseCSV(csv);if(!rows.length){showToast("Ingres\xE1 al menos un destinatario");return}const ed=document.getElementById("editor"),template=ed?ed.innerHTML:"",fullHTML=`<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>body{font-family:Calibri,Arial;margin:2.5cm;font-size:12pt;line-height:1.5}
@media print{.page-break{page-break-after:always}}</style>
</head><body>${rows.map((row,i)=>{const merged=__applyMerge(template,row);return`<div style="page-break-after:${i<rows.length-1?"always":"auto"};margin-bottom:40px">${merged}</div>`}).join(`
`)}</body></html>`,blob=new Blob([fullHTML],{type:"text/html;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download="correspondencia-combinada.html",a.click(),document.getElementById("__mergePanel").remove(),showToast(`\u{1F4EC} ${rows.length} documentos generados \u2705`)}const WC_TRACK={enabled:!1,changes:[],originalHTML:"",enable(){this.enabled=!0,this.originalHTML=document.getElementById("editor")?.innerHTML||"",this._intercept(),showToast("\u{1F504} Control de cambios activado"),this._updateUI()},disable(){this.enabled=!1,this._removeIntercept(),showToast("Control de cambios desactivado"),this._updateUI()},toggle(){this.enabled?this.disable():this.enable()},_updateUI(){const btn=document.getElementById("__trackBtn");btn&&(btn.style.background=this.enabled?"#27ae60":"#f0f0f0",btn.style.color=this.enabled?"#fff":"#333",btn.textContent=this.enabled?"\u{1F504} Cambios ON":"\u{1F504} Cambios OFF");const ts=document.getElementById("trackStatus");ts&&(ts.textContent=this.enabled?"\u{1F504} Control de cambios ON":"\u2713 Auto-guardado activo")},_originalExecCommand:null,_intercept(){const self=this,orig=document.execCommand.bind(document);document.execCommand=function(cmd,ui,val){if(self.enabled){const sel=window.getSelection(),selectedText=sel?sel.toString():"";if(cmd==="insertText"||cmd==="insertHTML"){const result=orig(cmd,ui,val);return val&&typeof val=="string"&&val.length<500&&self.changes.push({type:"insert",text:val,time:Date.now()}),result}if(cmd==="delete"||cmd==="forwardDelete")return selectedText&&self.changes.push({type:"delete",text:selectedText,time:Date.now()}),orig(cmd,ui,val)}return orig(cmd,ui,val)},this._originalExecCommand=orig},_removeIntercept(){this._originalExecCommand&&(document.execCommand=this._originalExecCommand)},acceptAll(){const ed=document.getElementById("editor");ed&&(ed.querySelectorAll(".wc-ins").forEach(el=>{el.replaceWith(...el.childNodes)}),ed.querySelectorAll(".wc-del").forEach(el=>el.remove()),this.changes=[],showToast("\u2705 Todos los cambios aceptados"))},rejectAll(){const ed=document.getElementById("editor");ed&&(ed.querySelectorAll(".wc-ins").forEach(el=>el.remove()),ed.querySelectorAll(".wc-del").forEach(el=>{el.style.cssText="",el.removeAttribute("class")}),this.changes=[],showToast("\u274C Todos los cambios rechazados"))},showDiff(){const ed=document.getElementById("editor");if(!ed||!this.originalHTML){showToast("No hay versi\xF3n original para comparar");return}const origWords=this.originalHTML.replace(/<[^>]+>/g," ").split(/\s+/).filter(w=>w),currWords=ed.innerText.split(/\s+/).filter(w=>w),added=currWords.filter(w=>!origWords.includes(w)),removed=origWords.filter(w=>!currWords.includes(w));openDiffPanel(added,removed,origWords.length,currWords.length)}};function openDiffPanel(added,removed,origLen,currLen){const old=document.getElementById("__diffPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__diffPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u{1F504} Control de cambios</div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
      <div style="background:#d4edda;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:20px;font-weight:800;color:#27ae60">${added.length}</div>
        <div style="font-size:11px;color:#155724;font-weight:600">Palabras a\xF1adidas</div>
      </div>
      <div style="background:#f8d7da;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:20px;font-weight:800;color:#e74c3c">${removed.length}</div>
        <div style="font-size:11px;color:#721c24;font-weight:600">Palabras eliminadas</div>
      </div>
      <div style="background:#fff3cd;border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:20px;font-weight:800;color:#856404">${currLen-origLen>0?"+":""}${currLen-origLen}</div>
        <div style="font-size:11px;color:#856404;font-weight:600">Cambio neto</div>
      </div>
    </div>

    ${added.length?`
    <div style="background:#d4edda;border-radius:10px;padding:12px;margin-bottom:10px">
      <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:6px;text-transform:uppercase">\u2705 Palabras a\xF1adidas</div>
      <div style="font-size:12px;color:#155724;line-height:1.8">${added.slice(0,20).map(w=>`<span style="background:#c3e6cb;border-radius:3px;padding:1px 6px;margin:2px;display:inline-block">${w}</span>`).join("")}${added.length>20?`<span style="color:#888"> +${added.length-20} m\xE1s</span>`:""}</div>
    </div>`:""}

    ${removed.length?`
    <div style="background:#f8d7da;border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#e74c3c;margin-bottom:6px;text-transform:uppercase">\u274C Palabras eliminadas</div>
      <div style="font-size:12px;color:#721c24;line-height:1.8">${removed.slice(0,20).map(w=>`<span style="background:#f5c6cb;border-radius:3px;padding:1px 6px;margin:2px;display:inline-block;text-decoration:line-through">${w}</span>`).join("")}${removed.length>20?`<span style="color:#888"> +${removed.length-20} m\xE1s</span>`:""}</div>
    </div>`:""}

    <div style="display:flex;gap:8px">
      <button onclick="WC_TRACK.rejectAll();document.getElementById('__diffPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u274C Rechazar todo</button>
      <button onclick="WC_TRACK.acceptAll();document.getElementById('__diffPanel').remove()" style="flex:1;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u2705 Aceptar todo</button>
      <button onclick="document.getElementById('__diffPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function openTrackPanel(){const old=document.getElementById("__trackPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__trackPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u{1F504} Control de cambios</div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
      <button id="__trackBtn" onclick="WC_TRACK.toggle();__updateTrackPanel()"
        style="padding:13px;border:none;background:${WC_TRACK.enabled?"#27ae60":"#f0f0f0"};color:${WC_TRACK.enabled?"#fff":"#333"};border-radius:12px;cursor:pointer;font-size:14px;font-weight:700;transition:all .2s">
        ${WC_TRACK.enabled?"\u{1F504} Control de cambios: ON":"\u{1F504} Control de cambios: OFF"}
      </button>
      <button onclick="WC_TRACK.showDiff()" style="padding:12px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:12px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CA} Ver diferencias</button>
      <button onclick="WC_TRACK.acceptAll()" style="padding:12px;border:none;background:#d4edda;color:#155724;border-radius:12px;cursor:pointer;font-size:13px;font-weight:600">\u2705 Aceptar todos los cambios</button>
      <button onclick="WC_TRACK.rejectAll()" style="padding:12px;border:none;background:#f8d7da;color:#721c24;border-radius:12px;cursor:pointer;font-size:13px;font-weight:600">\u274C Rechazar todos los cambios</button>
    </div>
    <div style="font-size:11px;color:#888;background:#f8f9fa;border-radius:8px;padding:10px;margin-bottom:16px;line-height:1.6">
      \u{1F4A1} El control de cambios guarda una instant\xE1nea al activarse y compara con el estado actual al usar "Ver diferencias".
    </div>
    <button onclick="document.getElementById('__trackPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __updateTrackPanel(){const btn=document.getElementById("__trackBtn");btn&&(btn.style.background=WC_TRACK.enabled?"#27ae60":"#f0f0f0",btn.style.color=WC_TRACK.enabled?"#fff":"#333",btn.textContent=WC_TRACK.enabled?"\u{1F504} Control de cambios: ON":"\u{1F504} Control de cambios: OFF");const ts=document.getElementById("trackStatus");ts&&(ts.textContent=WC_TRACK.enabled?"\u{1F504} Control de cambios ON":"\u2713 Auto-guardado activo")}function initTableEditor(){const ed=document.getElementById("editor");if(!ed)return;ed.addEventListener("click",e=>{const cell=e.target.closest("td, th"),table=e.target.closest("table");if(!cell||!table){const old=document.getElementById("__tableToolbar");old&&old.remove();return}showTableToolbar(table,cell,e.clientX,e.clientY)}),ed.addEventListener("dragstart",e=>{const row=e.target.closest("tr");row&&row.closest("table")&&(e.dataTransfer.effectAllowed="move",row.style.opacity="0.4",ed._dragRow=row)}),ed.addEventListener("dragover",e=>{const row=e.target.closest("tr");row&&ed._dragRow&&row!==ed._dragRow&&(e.preventDefault(),row.style.background="#e8f4ff")}),ed.addEventListener("dragleave",e=>{const row=e.target.closest("tr");row&&(row.style.background="")}),ed.addEventListener("drop",e=>{e.preventDefault();const targetRow=e.target.closest("tr");targetRow&&ed._dragRow&&targetRow!==ed._dragRow&&(targetRow.style.background="",ed._dragRow.style.opacity="1",targetRow.parentNode.insertBefore(ed._dragRow,targetRow),showToast("Fila movida \u2705"))}),ed.addEventListener("dragend",e=>{ed._dragRow&&(ed._dragRow.style.opacity="1",ed._dragRow=null),ed.querySelectorAll("tr").forEach(r=>r.style.background="")}),new MutationObserver(()=>{ed.querySelectorAll("tr").forEach(row=>{row.draggable=!0})}).observe(ed,{childList:!0,subtree:!0}),ed.querySelectorAll("tr").forEach(row=>{row.draggable=!0})}function showTableToolbar(table,cell,x,y){const old=document.getElementById("__tableToolbar");old&&old.remove();const toolbar=document.createElement("div");toolbar.id="__tableToolbar";const left=Math.min(x-20,window.innerWidth-320),top=Math.max(y-50,10);toolbar.style.cssText=`
    position:fixed;z-index:9985;background:#1a1a2e;border-radius:12px;
    padding:6px 8px;display:flex;align-items:center;gap:3px;
    box-shadow:0 4px 20px rgba(0,0,0,.4);
    left:${left}px;top:${top}px;
  `;const row=cell.closest("tr");[{html:"\u2B06",title:"Fila arriba",fn:()=>{typeof insertRowAbove=="function"&&insertRowAbove(row)}},{html:"\u2B07",title:"Fila abajo",fn:()=>{typeof insertRowBelow=="function"&&insertRowBelow(row)}},{html:"\u2B05",title:"Col. izquierda",fn:()=>{typeof insertColLeft=="function"&&insertColLeft(table,cell)}},{html:"\u27A1",title:"Col. derecha",fn:()=>{typeof insertColRight=="function"&&insertColRight(table,cell)}},{sep:!0},{html:"\u{1F5D1}",title:"Eliminar fila",fn:()=>{typeof deleteRow=="function"&&deleteRow(row),toolbar.remove()}},{html:"\u2702",title:"Eliminar col.",fn:()=>{typeof deleteCol=="function"&&deleteCol(table,cell),toolbar.remove()}},{sep:!0},{html:"\u2B1C",title:"Combinar",fn:()=>{typeof mergeCells=="function"&&mergeCells(table)}},{html:"\u{1F3A8}",title:"Color celda",fn:()=>{typeof setCellColor=="function"&&setCellColor(cell)}},{sep:!0},{html:"\u2191\u2193",title:"Ordenar \u2191",fn:()=>{typeof sortTable=="function"&&sortTable(table,!0)}},{html:"\u229E",title:"Ampliar tabla",fn:()=>{table.style.width="100%",showToast("Tabla al 100%")}}].forEach(b=>{if(b.sep){const s=document.createElement("span");s.style.cssText="width:1px;height:18px;background:rgba(255,255,255,.2);margin:0 2px",toolbar.appendChild(s);return}const btn=document.createElement("button");btn.title=b.title,btn.innerHTML=b.html,btn.style.cssText="background:none;border:none;color:#fff;padding:5px 7px;border-radius:6px;cursor:pointer;font-size:13px;transition:background .12s",btn.onmouseover=()=>btn.style.background="rgba(255,255,255,.15)",btn.onmouseout=()=>btn.style.background="none",btn.onclick=()=>{b.fn()},toolbar.appendChild(btn)});const closeBtn=document.createElement("button");closeBtn.innerHTML="\u2715",closeBtn.style.cssText="background:none;border:none;color:rgba(255,255,255,.5);padding:5px;cursor:pointer;font-size:12px",closeBtn.onclick=()=>toolbar.remove(),toolbar.appendChild(closeBtn),document.body.appendChild(toolbar),setTimeout(()=>{document.addEventListener("click",function dismiss(e){toolbar.contains(e.target)||(toolbar.remove(),document.removeEventListener("click",dismiss))})},100)}function openQRPanel(){const old=document.getElementById("__qrPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__qrPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      \u2B1B Insertar c\xF3digo QR
    </div>

    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      ${[["URL","https://"],["WhatsApp","https://wa.me/506"],["Correo","mailto:"],["Tel\xE9fono","tel:+506"],["Texto",""],["WiFi","WIFI:S:NombreRed;T:WPA;P:Contrase\xF1a;;"]].map(([label,prefix])=>`
        <button onclick="__qrSetPrefix('${prefix}',this)"
          class="__qrTypeBtn"
          style="padding:6px 12px;border:1.5px solid #eee;background:#fafafa;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff'"
          onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
          ${label}
        </button>`).join("")}
    </div>

    <input type="text" id="__qrText"
      placeholder="https://ejemplo.cr"
      style="width:100%;padding:11px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:12px"
      onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
      oninput="__qrPreview()">

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Tama\xF1o</label>
        <select id="__qrSize" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          <option value="100">Peque\xF1o (100px)</option>
          <option value="150" selected>Mediano (150px)</option>
          <option value="200">Grande (200px)</option>
          <option value="300">Muy grande (300px)</option>
        </select>
      </div>
      <div>
        <label style="font-size:12px;color:#555;font-weight:600;display:block;margin-bottom:4px">Caption</label>
        <input type="text" id="__qrCaption" placeholder="Texto debajo del QR"
          style="width:100%;padding:8px 10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div id="__qrPreviewBox" style="text-align:center;min-height:80px;background:#fafafa;border-radius:10px;padding:12px;margin-bottom:16px;border:1.5px solid #eee">
      <div style="color:#bbb;font-size:13px;padding:20px">Escribe texto o URL para previsualizar</div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__qrPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__insertQR()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2B1B Insertar QR</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(()=>{const firstBtn=document.querySelector(".__qrTypeBtn");firstBtn&&(firstBtn.style.borderColor="#0084ff",firstBtn.style.background="#f0f7ff",firstBtn.dataset.sel="1")},50)}function __qrSetPrefix(prefix,btn){const inp=document.getElementById("__qrText");inp&&!inp.value.includes(prefix)&&(inp.value=prefix),document.querySelectorAll(".__qrTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1",__qrPreview(),inp&&inp.focus()}function __qrPreview(){const text=document.getElementById("__qrText").value.trim(),size=document.getElementById("__qrSize").value,box=document.getElementById("__qrPreviewBox");if(!box)return;if(!text){box.innerHTML='<div style="color:#bbb;font-size:13px;padding:20px">Escribe texto o URL para previsualizar</div>';return}const url=`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&qzone=1`;box.innerHTML=`<img src="${url}" style="max-width:100%;border-radius:8px" alt="QR Code" onerror="this.parentElement.innerHTML='<div style=color:#e74c3c;padding:10px>Error generando QR. Verific\xE1 la conexi\xF3n.</div>'">`}function __insertQR(){const text=document.getElementById("__qrText").value.trim(),size=document.getElementById("__qrSize").value,caption=document.getElementById("__qrCaption").value.trim();if(!text){showToast("Escrib\xED texto o URL primero");return}const url=`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&qzone=1`,html=`
  <div style="display:inline-block;text-align:center;margin:10px;padding:10px;border:1px solid #eee;border-radius:10px;background:#fafafa">
    ${text.startsWith("http")||text.startsWith("mailto")||text.startsWith("tel")?`<a href="${text}" target="_blank"><img src="${url}" style="width:${size}px;height:${size}px;display:block;border-radius:6px" alt="QR"></a>`:`<img src="${url}" style="width:${size}px;height:${size}px;display:block;border-radius:6px" alt="QR">`}
    ${caption?`<div style="font-size:10px;color:#888;margin-top:6px;max-width:${size}px">${caption}</div>`:""}
    <div style="font-size:9px;color:#bbb;margin-top:4px;max-width:${size}px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${text.substring(0,40)}${text.length>40?"...":""}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__qrPanel").remove(),showToast("\u2B1B C\xF3digo QR insertado \u2705")}(function(){setTimeout(function(){initTableEditor();const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"fields":openFieldsPanel();break;case"mailMerge":openMailMergePanel();break;case"trackChanges":openTrackPanel();break;case"insertQR":openQRPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.7 \u2705 \u2014 Campos din\xE1micos, Correspondencia, Control cambios, Tabla visual, QR")},1500)})();
