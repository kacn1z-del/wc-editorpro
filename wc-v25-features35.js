const WC_CLOUD_SAVE={timer:null,lastSaved:null,docId:localStorage.getItem("wc-cloud-docid")||"doc-"+Math.random().toString(36).slice(2,10),init(){localStorage.setItem("wc-cloud-docid",this.docId);const ed=document.getElementById("editor");ed&&(ed.addEventListener("input",()=>{clearTimeout(this.timer),this._updateStatus("\u23F3 Guardando..."),this.timer=setTimeout(()=>this.save(),3e3)}),window.addEventListener("beforeunload",()=>this.save()),this._showStatus(),showToast("\u2601\uFE0F Autoguardado en la nube activado"))},async save(){const ed=document.getElementById("editor");if(!ed)return;const db=window.__wcFirebaseDB||window.firebase?.database?.();if(!db){localStorage.setItem("wc-cloud-"+this.docId,ed.innerHTML),this.lastSaved=new Date,this._updateStatus("\u{1F4BE} Guardado local "+this.lastSaved.toLocaleTimeString("es-CR"));return}try{await db.ref("documents/"+this.docId).set({content:ed.innerHTML,savedAt:Date.now(),wordCount:ed.innerText.split(/\s+/).filter(w=>w).length}),this.lastSaved=new Date,this._updateStatus("\u2601\uFE0F Guardado "+this.lastSaved.toLocaleTimeString("es-CR"))}catch{this._updateStatus("\u26A0\uFE0F Error al guardar")}},async load(){const db=window.__wcFirebaseDB||window.firebase?.database?.();if(!db){const saved=localStorage.getItem("wc-cloud-"+this.docId);if(saved){const ed=document.getElementById("editor");ed&&(ed.innerHTML=saved,showToast("\u{1F4C2} Documento cargado desde local"))}return}try{const data=(await db.ref("documents/"+this.docId).once("value")).val();if(data?.content){const ed=document.getElementById("editor");if(ed){ed.innerHTML=data.content;const date=new Date(data.savedAt).toLocaleString("es-CR");showToast("\u2601\uFE0F Documento cargado \xB7 Guardado: "+date)}}}catch(e){showToast("Error al cargar: "+e.message)}},_showStatus(){if(document.getElementById("__cloudStatus"))return;const el=document.createElement("div");el.id="__cloudStatus",el.style.cssText="position:fixed;bottom:66px;left:12px;z-index:8000;background:rgba(0,0,0,.6);color:#fff;border-radius:6px;padding:3px 10px;font-size:10px;font-family:-apple-system,sans-serif;pointer-events:none",el.textContent="\u2601\uFE0F Autoguardado activo",document.body.appendChild(el)},_updateStatus(msg){const el=document.getElementById("__cloudStatus");el&&(el.textContent=msg)}};function openCloudSavePanel(){const old=document.getElementById("__cloudPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__cloudPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2601\uFE0F Guardado en la nube</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Firebase \xB7 Sync autom\xE1tico</div>

    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:4px">ID del documento</div>
      <div style="font-size:12px;color:#555;font-family:'Courier New',monospace;word-break:break-all">${WC_CLOUD_SAVE.docId}</div>
      <button onclick="navigator.clipboard.writeText('${WC_CLOUD_SAVE.docId}').then(()=>showToast('ID copiado \u2705'))" style="margin-top:6px;padding:4px 10px;border:1px solid #003da5;background:#fff;color:#003da5;border-radius:5px;cursor:pointer;font-size:10px">\u{1F4CB} Copiar ID</button>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Cargar documento por ID</label>
      <div style="display:flex;gap:6px">
        <input type="text" id="__cloudLoadId" placeholder="doc-xxxxxxxx"
          style="flex:1;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        <button onclick="WC_CLOUD_SAVE.docId=document.getElementById('__cloudLoadId').value.trim()||WC_CLOUD_SAVE.docId;WC_CLOUD_SAVE.load();document.getElementById('__cloudPanel').remove()" style="padding:8px 12px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4C2} Cargar</button>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
      <button onclick="WC_CLOUD_SAVE.save();document.getElementById('__cloudPanel').remove()" style="padding:11px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2601\uFE0F Guardar ahora</button>
      <button onclick="WC_CLOUD_SAVE.init();document.getElementById('__cloudPanel').remove()" style="padding:10px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u26A1 Activar autoguardado</button>
    </div>

    <button onclick="document.getElementById('__cloudPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}const WC_IMMERSIVE={active:!1,fontSize:18,lineHeight:1.8,width:680,theme:"light",themes:{light:{bg:"#fafafa",text:"#1a1a1a",overlay:"#f0f0f0"},sepia:{bg:"#f4ecd8",text:"#3d2b1f",overlay:"#e8dcc8"},dark:{bg:"#1a1a2e",text:"#e0e0e0",overlay:"#16213e"},night:{bg:"#0d0d0d",text:"#cccccc",overlay:"#111111"}},open(){const ed=document.getElementById("editor");if(!ed)return;const old=document.getElementById("__immersivePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__immersivePanel";const t=this.themes[this.theme];ov.style.cssText=`position:fixed;inset:0;z-index:100000;background:${t.bg};overflow-y:auto;font-family:Georgia,'Times New Roman',serif;transition:background .3s`,ov.innerHTML=`
      <!-- Barra de control -->
      <div style="position:fixed;top:0;left:0;right:0;background:${t.overlay};padding:8px 16px;display:flex;align-items:center;gap:10px;z-index:1;opacity:0;transition:opacity .3s" id="__immBar"
        onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
        <button onclick="WC_IMMERSIVE.close()" style="background:rgba(0,0,0,.1);border:none;color:${t.text};border-radius:6px;padding:5px 10px;cursor:pointer;font-size:12px">\u2715 Salir</button>
        <span style="font-size:11px;color:${t.text};opacity:.6">Modo lectura \xB7 ESC para salir</span>
        <div style="flex:1"></div>
        <span style="font-size:11px;color:${t.text};opacity:.6">Fuente:</span>
        <button onclick="WC_IMMERSIVE.fontSize=Math.max(14,WC_IMMERSIVE.fontSize-2);WC_IMMERSIVE._updateContent()" style="background:rgba(0,0,0,.1);border:none;color:${t.text};border-radius:4px;padding:4px 8px;cursor:pointer">A-</button>
        <span style="font-size:12px;color:${t.text}" id="__immFontSize">${this.fontSize}px</span>
        <button onclick="WC_IMMERSIVE.fontSize=Math.min(28,WC_IMMERSIVE.fontSize+2);WC_IMMERSIVE._updateContent()" style="background:rgba(0,0,0,.1);border:none;color:${t.text};border-radius:4px;padding:4px 8px;cursor:pointer">A+</button>
        <div style="display:flex;gap:4px">
          ${Object.keys(this.themes).map(th=>`<button onclick="WC_IMMERSIVE.theme='${th}';WC_IMMERSIVE.close();WC_IMMERSIVE.open()" style="width:20px;height:20px;border-radius:50%;background:${this.themes[th].bg};border:2px solid ${th===this.theme?"#0084ff":"#ccc"};cursor:pointer"></button>`).join("")}
        </div>
      </div>

      <!-- Contenido -->
      <div id="__immContent" style="max-width:${this.width}px;margin:48px auto;padding:32px 24px;color:${t.text};font-size:${this.fontSize}px;line-height:${this.lineHeight};word-spacing:0.05em">
        ${ed.innerHTML}
      </div>

      <!-- Progreso de lectura -->
      <div id="__immProgress" style="position:fixed;top:0;left:0;height:3px;background:#0084ff;width:0%;transition:width .1s;z-index:2"></div>
    `,document.body.appendChild(ov),this.active=!0,ov.addEventListener("scroll",()=>{const pct=ov.scrollTop/(ov.scrollHeight-ov.clientHeight)*100,pr=document.getElementById("__immProgress");pr&&(pr.style.width=pct+"%")}),this._keyHandler=e=>{e.key==="Escape"&&this.close()},document.addEventListener("keydown",this._keyHandler),ov.addEventListener("touchstart",()=>{const bar=document.getElementById("__immBar");bar&&(bar.style.opacity="1",clearTimeout(this._barTimer),this._barTimer=setTimeout(()=>{bar.style.opacity="0"},3e3))},{passive:!0})},_updateContent(){const c=document.getElementById("__immContent"),f=document.getElementById("__immFontSize");c&&(c.style.fontSize=this.fontSize+"px"),f&&(f.textContent=this.fontSize+"px")},close(){this.active=!1,document.removeEventListener("keydown",this._keyHandler),document.getElementById("__immersivePanel")?.remove()}};function openImmersiveMode(){WC_IMMERSIVE.open()}function openFreeImages(){const old=document.getElementById("__imgSearchPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__imgSearchPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,sans-serif",ov.innerHTML=`
    <div style="background:#1a2942;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">\u{1F5BC}\uFE0F Im\xE1genes sin copyright</div>
      <div style="display:flex;gap:6px">
        ${[["unsplash","Unsplash"],["pixabay","Pixabay"],["pexels","Pexels"]].map(([v,l])=>`
          <button onclick="__imgSource='${v}';__imgSearch()" class="__imgSrcBtn"
            style="padding:5px 10px;border:1.5px solid ${v==="unsplash"?"#0084ff":"rgba(255,255,255,.2)"};background:${v==="unsplash"?"rgba(0,132,255,.2)":"transparent"};color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">
            ${l}
          </button>`).join("")}
      </div>
      <button onclick="document.getElementById('__imgSearchPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">\u2715</button>
    </div>
    <div style="padding:10px 16px;background:#252540;flex-shrink:0">
      <div style="display:flex;gap:6px">
        <input type="text" id="__imgQuery" placeholder="Buscar im\xE1genes... (ej: costa rica, naturaleza, ciudad)"
          style="flex:1;padding:10px 14px;border:none;border-radius:10px;font-size:14px;outline:none;background:rgba(255,255,255,.1);color:#fff"
          onkeydown="if(event.key==='Enter')__imgSearch()"
          placeholder="Buscar im\xE1genes...">
        <button onclick="__imgSearch()" style="padding:10px 16px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F50D}</button>
      </div>
    </div>
    <div id="__imgGrid" style="flex:1;overflow-y:auto;padding:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;align-content:start;background:#1a1a2e">
      <div style="grid-column:1/-1;text-align:center;color:#888;padding:40px;font-size:13px">
        Busc\xE1 im\xE1genes libres de derechos de autor \u2705<br>
        <small style="color:#555">Fuentes: Unsplash, Pixabay, Pexels</small>
      </div>
    </div>
    <div style="padding:8px 16px;background:#252540;font-size:10px;color:#555;text-align:center;flex-shrink:0">
      Im\xE1genes bajo licencia Creative Commons / Dominio p\xFAblico \xB7 Libre para uso comercial
    </div>`,document.body.appendChild(ov),window.__imgSource="unsplash",window.__imgPage=1,document.getElementById("__imgQuery")?.focus()}async function __imgSearch(){const q=document.getElementById("__imgQuery")?.value.trim();if(!q)return;const grid=document.getElementById("__imgGrid");grid&&(grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#888;padding:40px;font-size:13px">\u23F3 Buscando im\xE1genes...</div>');const src=window.__imgSource||"unsplash";let images=[];try{src==="unsplash"?images=((await(await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=18&client_id=TBl6sN9OmLxIh9GFkOCPF9JE9Zfsd5AecNFMHxuNUeg`)).json()).results||[]).map(img=>({thumb:img.urls.small,full:img.urls.regular,author:img.user.name,link:img.links.html,desc:img.alt_description||q,w:img.width,h:img.height})):src==="pixabay"?images=((await(await fetch(`https://pixabay.com/api/?key=42291503-f74c4e69c5a6b72e5e8a3b8e4&q=${encodeURIComponent(q)}&image_type=photo&per_page=18&safesearch=true`)).json()).hits||[]).map(img=>({thumb:img.previewURL,full:img.webformatURL,author:img.user,link:img.pageURL,desc:q,w:img.imageWidth,h:img.imageHeight})):images=((await(await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=18`,{headers:{Authorization:"a3W9JovKz7WrSqP5VDzxMhGGPbzPmkFxPLYN3sW2Bs1p3DRaHrpNdBjn"}})).json()).photos||[]).map(img=>({thumb:img.src.medium,full:img.src.large,author:img.photographer,link:img.url,desc:img.alt||q,w:img.width,h:img.height}))}catch{images=Array.from({length:9},(_,i)=>({thumb:`https://image.pollinations.ai/prompt/${encodeURIComponent(q+" "+i)}?width=300&height=200&nologo=1`,full:`https://image.pollinations.ai/prompt/${encodeURIComponent(q+" photo")}?width=800&height=600&nologo=1`,author:"Pollinations AI",link:"#",desc:q+" (generada con IA)"}))}if(grid){if(!images.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#888;padding:40px">Sin resultados para "'+q+'"</div>';return}grid.innerHTML=images.map(img=>`
    <div style="border-radius:10px;overflow:hidden;cursor:pointer;position:relative;aspect-ratio:4/3;background:#333"
      onclick="__imgInsert('${img.full.replace(/'/g,"\\'")}','${(img.desc||q).replace(/'/g,"\\'")}','${(img.author||"").replace(/'/g,"\\'")}')">
      <img src="${img.thumb}" alt="${img.desc||q}" loading="lazy"
        style="width:100%;height:100%;object-fit:cover;transition:transform .2s"
        onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.7));padding:8px;font-size:9px;color:#fff;opacity:0;transition:opacity .2s"
        onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
        \u{1F4F8} ${img.author}
      </div>
    </div>`).join("")}}function __imgInsert(url,desc,author){typeof insertHTML=="function"&&insertHTML(`<figure style="margin:12px 0;text-align:center"><img src="${url}" alt="${desc}" style="max-width:100%;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.15)"><figcaption style="font-size:9pt;color:#888;margin-top:4px">${desc}${author?" \xB7 Foto: "+author:""} \xB7 Libre de derechos</figcaption></figure>`),document.getElementById("__imgSearchPanel").remove(),showToast("\u{1F5BC}\uFE0F Imagen insertada \u2705")}function openCVGenerator(){const old=document.getElementById("__cvPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__cvPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const estilos=[{id:"moderno",icon:"\u{1F3A8}",name:"Moderno",color:"#003da5"},{id:"clasico",icon:"\u{1F4C4}",name:"Cl\xE1sico",color:"#1a2942"},{id:"ejecutivo",icon:"\u{1F4BC}",name:"Ejecutivo",color:"#2c3e50"},{id:"creativo",icon:"\u2728",name:"Creativo",color:"#8e44ad"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F464} Generador de CV \xB7 Costa Rica</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Curr\xEDculum vitae profesional formato CR</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${estilos.map((e,i)=>`
          <button onclick="__cvStyle='${e.id}';document.querySelectorAll('.__cvStyleBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';});this.style.borderColor='${e.color}';this.style.background='${e.color}15';" class="__cvStyleBtn"
            style="padding:10px;border:2px solid ${i===0?e.color:"#eee"};background:${i===0?e.color+"15":"#fafafa"};border-radius:10px;cursor:pointer;text-align:left;transition:all .15s">
            <div style="font-size:18px">${e.icon}</div>
            <div style="font-size:12px;font-weight:700;color:#1a1a1a">${e.name}</div>
          </button>`).join("")}
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px 16px">
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[["__cvNombre","Nombre completo *","Juan Carlos P\xE9rez Rodr\xEDguez"],["__cvProfesion","Profesi\xF3n / T\xEDtulo *","Ingeniero en Sistemas \xB7 Lic. en Administraci\xF3n"],["__cvEmail","Correo electr\xF3nico","juan.perez@email.cr"],["__cvTel","Tel\xE9fono","8888-1234"],["__cvDireccion","Direcci\xF3n","San Jos\xE9, Costa Rica"],["__cvLinkedin","LinkedIn / Portfolio","linkedin.com/in/juanperez"],["__cvPerfil","Perfil profesional","Profesional con X a\xF1os de experiencia en..."],["__cvExp","Experiencia (empresa | cargo | a\xF1os | descripci\xF3n, separados por ;)","Empresa ABC | Desarrollador Senior | 2020-2024 | Desarrollo de aplicaciones web"],["__cvEduc","Educaci\xF3n (instituci\xF3n | t\xEDtulo | a\xF1o, separados por ;)","UCR | Ingenier\xEDa en Sistemas | 2019;TEC | Maestr\xEDa en IA | 2022"],["__cvHabilidades","Habilidades (separadas por coma)","JavaScript, React, Node.js, SQL, Ingl\xE9s C1, Trabajo en equipo"],["__cvIdiomas","Idiomas","Espa\xF1ol (nativo), Ingl\xE9s (avanzado), Portugu\xE9s (b\xE1sico)"],["__cvReferencias","Referencias","Disponibles a solicitud"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join("")}
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__cvPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateCV()" style="flex:2;padding:10px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F464} Generar CV</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__cvStyle="moderno"}function __generateCV(){const g=id=>document.getElementById(id)?.value?.trim()||"",nombre=g("__cvNombre"),profesion=g("__cvProfesion"),email=g("__cvEmail"),tel=g("__cvTel"),dir=g("__cvDireccion"),linkedin=g("__cvLinkedin"),perfil=g("__cvPerfil"),expRaw=g("__cvExp").split(";").filter(e=>e.trim()),educRaw=g("__cvEduc").split(";").filter(e=>e.trim()),habilidades=g("__cvHabilidades").split(",").map(h=>h.trim()).filter(h=>h),idiomas=g("__cvIdiomas"),refs=g("__cvReferencias")||"Disponibles a solicitud",style=window.__cvStyle||"moderno";if(!nombre||!profesion){showToast("Complet\xE1 nombre y profesi\xF3n");return}const color={moderno:"#003da5",clasico:"#1a2942",ejecutivo:"#2c3e50",creativo:"#8e44ad"}[style]||"#003da5",expHTML=expRaw.map(e=>{const[empresa,cargo,periodo,desc]=e.split("|").map(s=>s.trim());return`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between"><strong style="color:#1a1a1a">${cargo||e}</strong><span style="font-size:10pt;color:#888">${periodo||""}</span></div>${empresa?`<div style="font-size:10pt;color:${color};font-weight:600">${empresa}</div>`:""}<div style="font-size:10pt;color:#555;margin-top:2px">${desc||""}</div></div>`}).join(""),educHTML=educRaw.map(e=>{const[inst,titulo,anio]=e.split("|").map(s=>s.trim());return`<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between"><strong style="color:#1a1a1a">${titulo||e}</strong><span style="font-size:10pt;color:#888">${anio||""}</span></div>${inst?`<div style="font-size:10pt;color:${color}">${inst}</div>`:""}</div>`}).join(""),html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
    <!-- Header -->
    <div style="background:${color};color:#fff;padding:24px 28px;border-radius:8px 8px 0 0;margin-bottom:0">
      <div style="font-size:22pt;font-weight:900;letter-spacing:.5px">${nombre}</div>
      <div style="font-size:12pt;opacity:.9;margin-top:4px">${profesion}</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;font-size:9pt;opacity:.85">
        ${email?`<span>\u2709\uFE0F ${email}</span>`:""}${tel?`<span>\u{1F4F1} ${tel}</span>`:""}
        ${dir?`<span>\u{1F4CD} ${dir}</span>`:""}${linkedin?`<span>\u{1F517} ${linkedin}</span>`:""}
      </div>
    </div>

    <div style="border:1px solid ${color}33;border-top:none;border-radius:0 0 8px 8px;overflow:hidden">
      <div style="display:grid;grid-template-columns:2fr 1fr">
        <!-- Columna principal -->
        <div style="padding:20px 20px 20px 24px;border-right:1px solid #eee">
          ${perfil?`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Perfil profesional</div><div style="font-size:10pt;color:#555;line-height:1.6">${perfil}</div></div>`:""}
          ${expHTML?`<div style="margin-bottom:16px"><div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Experiencia profesional</div>${expHTML}</div>`:""}
          ${educHTML?`<div><div style="font-size:11pt;font-weight:700;color:${color};border-bottom:2px solid ${color};padding-bottom:4px;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Educaci\xF3n</div>${educHTML}</div>`:""}
        </div>
        <!-- Columna lateral -->
        <div style="padding:20px 16px;background:#f8f9fa">
          ${habilidades.length?`<div style="margin-bottom:14px"><div style="font-size:10pt;font-weight:700;color:${color};margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Habilidades</div>${habilidades.map(h=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></div><span style="font-size:10pt;color:#555">${h}</span></div>`).join("")}</div>`:""}
          ${idiomas?`<div style="margin-bottom:14px"><div style="font-size:10pt;font-weight:700;color:${color};margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Idiomas</div><div style="font-size:10pt;color:#555;line-height:1.7">${idiomas.replace(/,\s*/g,"<br>")}</div></div>`:""}
          <div><div style="font-size:10pt;font-weight:700;color:${color};margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Referencias</div><div style="font-size:10pt;color:#555">${refs}</div></div>
        </div>
      </div>
    </div>
    <div style="text-align:center;font-size:8pt;color:#aaa;margin-top:6px">CV generado con WC Corporate Editor \xB7 Costa Rica \xB7 ${new Date().getFullYear()}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__cvPanel").remove(),showToast("\u{1F464} CV generado \u2705")}function openIVACalc(){const old=document.getElementById("__ivaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ivaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;padding:20px;box-shadow:0 -8px 40px rgba(0,0,0,.2);font-family:-apple-system,sans-serif">
    <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F9EE} Calculadora IVA \xB7 CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Ley N\xB0 9635 \xB7 Impuesto al Valor Agregado</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Monto *</label>
        <input type="number" id="__ivaMonto" placeholder="0" min="0" step="100"
          style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;font-weight:600"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__calcIVA()">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tarifa IVA</label>
        <select id="__ivaTarifa" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none" onchange="__calcIVA()">
          <option value="13">13% \u2014 General</option>
          <option value="4">4% \u2014 Medicina</option>
          <option value="2">2% \u2014 Canasta b\xE1sica</option>
          <option value="1">1% \u2014 Seguros</option>
          <option value="0">0% \u2014 Exento</option>
        </select>
      </div>
      <div style="grid-column:1/-1">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">El monto ingresado es:</label>
        <div style="display:flex;gap:6px">
          <label style="flex:1;display:flex;align-items:center;gap:6px;cursor:pointer;padding:9px;border:1.5px solid #003da5;background:#f0f7ff;border-radius:8px;font-size:12px;font-weight:600;color:#003da5">
            <input type="radio" name="__ivaTipo" value="sinIVA" checked style="accent-color:#003da5" onchange="__calcIVA()"> Sin IVA (base)
          </label>
          <label style="flex:1;display:flex;align-items:center;gap:6px;cursor:pointer;padding:9px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;font-size:12px;font-weight:600;color:#555">
            <input type="radio" name="__ivaTipo" value="conIVA" style="accent-color:#003da5" onchange="__calcIVA()"> Con IVA incluido
          </label>
        </div>
      </div>
    </div>

    <div id="__ivaResult" style="background:#f0f7ff;border-radius:12px;padding:14px;margin-bottom:14px;display:none">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center;margin-bottom:10px">
        <div><div id="__ivaBase" style="font-size:16px;font-weight:800;color:#1a2942">\u20A10</div><div style="font-size:10px;color:#888">Base imponible</div></div>
        <div><div id="__ivaMontoIVA" style="font-size:16px;font-weight:800;color:#e74c3c">\u20A10</div><div style="font-size:10px;color:#888">Monto IVA</div></div>
        <div><div id="__ivaTotal" style="font-size:16px;font-weight:800;color:#003da5">\u20A10</div><div style="font-size:10px;color:#888">Total con IVA</div></div>
      </div>
      <button onclick="__ivaInsert()" style="width:100%;padding:8px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Insertar desglose en documento</button>
    </div>

    <!-- Tabla de tarifas CR -->
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Tarifas IVA Costa Rica (Ley 9635)</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        ${[["13%","Bienes y servicios generales"],["4%","Servicios m\xE9dicos y medicamentos"],["2%","Canasta b\xE1sica tributaria"],["1%","Seguros (ISN)"],["0%","Exportaciones y exentos"]].map(([t,d],i)=>`
          <tr style="${i%2?"background:#f8f9fa":""}"><td style="padding:5px 8px;border:1px solid #eee;color:${t==="13%"?"#e74c3c":"#1a2942"};font-weight:700">${t}</td><td style="padding:5px 8px;border:1px solid #eee;color:#555">${d}</td></tr>`).join("")}
      </table>
    </div>

    <button onclick="document.getElementById('__ivaPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __calcIVA(){const monto=parseFloat(document.getElementById("__ivaMonto")?.value)||0,tarifa=parseInt(document.getElementById("__ivaTarifa")?.value)||13,tipo=document.querySelector('[name="__ivaTipo"]:checked')?.value||"sinIVA",res=document.getElementById("__ivaResult");if(!monto||!res)return;res.style.display="block";const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR");let base,montoIVA,total;tipo==="sinIVA"?(base=monto,montoIVA=monto*tarifa/100,total=monto+montoIVA):(total=monto,base=monto/(1+tarifa/100),montoIVA=total-base),document.getElementById("__ivaBase").textContent=fmt(base),document.getElementById("__ivaMontoIVA").textContent=fmt(montoIVA),document.getElementById("__ivaTotal").textContent=fmt(total),window.__ivaData={base,montoIVA,total,tarifa}}function __ivaInsert(){const d=window.__ivaData;if(!d)return;const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),html=`<table style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;font-size:10pt;margin:8px 0;min-width:280px">
    <tr style="background:#003da5;color:#fff"><th colspan="2" style="padding:6px 10px;text-align:left">Desglose IVA \xB7 Costa Rica (${d.tarifa}%)</th></tr>
    <tr><td style="padding:5px 10px;border:1px solid #ddd">Base imponible</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${fmt(d.base)}</td></tr>
    <tr style="background:#f0f0f0"><td style="padding:5px 10px;border:1px solid #ddd">IVA ${d.tarifa}%</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">${fmt(d.montoIVA)}</td></tr>
    <tr style="background:#003da5;color:#fff"><td style="padding:6px 10px;font-weight:700">TOTAL</td><td style="padding:6px 10px;text-align:right;font-weight:700">${fmt(d.total)}</td></tr>
  </table>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__ivaPanel").remove(),showToast("\u{1F9EE} Desglose IVA insertado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"cloudSave":openCloudSavePanel();break;case"immersive":openImmersiveMode();break;case"freeImages":openFreeImages();break;case"cvGenerator":openCVGenerator();break;case"ivaCalc":openIVACalc();break;default:orig(a)}}),console.log("WC Corporate Editor v25.35 \u2705 \u2014 Cloud Save, Inmersiva, Im\xE1genes, CV, IVA CR")},4300)})();
