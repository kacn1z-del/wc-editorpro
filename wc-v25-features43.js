const WC_SPELL={active:!1,lang:localStorage.getItem("wc-spell-lang")||"es",timer:null,mistakes:[],commonErrors:{aver:"a ver",haber:"haber",haver:"haber",asia:"hacia",acia:"hacia",all\u00ED:"all\xED",porqu\u00E9:"por qu\xE9",porque:"porque",tambien:"tambi\xE9n",tb:"tambi\xE9n","q ":"que ",xq:"por qu\xE9",xk:"porque",hiba:"iba",habia:"hab\xEDa",estaba:"estaba",deveria:"deber\xEDa",havlar:"hablar",vuelta:"vuelta",bolver:"volver",travajo:"trabajo",travajar:"trabajar",mui:"muy",vien:"bien",saver:"saber",nesesito:"necesito",nesecito:"necesito",rreunion:"reuni\xF3n",reunon:"reuni\xF3n",prezidente:"presidente",presedente:"presidente",grasias:"gracias",gracas:"gracias",entonses:"entonces",entonce:"entonces",depsues:"despu\xE9s",despues:"despu\xE9s",siempre:"siempre",sienpre:"siempre",amvos:"ambos",ampbos:"ambos",coseguir:"conseguir",consiguir:"conseguir",devemos:"debemos",debenos:"debemos",faborito:"favorito",fabor:"favor",hechar:"echar",eshar:"echar",enrrollado:"enrollado",enrrollar:"enrollar",conosco:"conozco",conosko:"conozco"},toggle(){this.active=!this.active,this.active?this._attach():this._detach(),showToast(this.active?"\u{1F524} Corrector activado":"Corrector desactivado"),localStorage.setItem("wc-spell-active",this.active)},_attach(){const ed=document.getElementById("editor");ed&&(this._handler=()=>{clearTimeout(this.timer),this.timer=setTimeout(()=>this._check(),1e3)},ed.addEventListener("input",this._handler),this._check(),this._showIndicator())},_detach(){const ed=document.getElementById("editor");ed&&this._handler&&ed.removeEventListener("input",this._handler),clearTimeout(this.timer),ed?.querySelectorAll(".wc-spell-err").forEach(el=>{el.replaceWith(document.createTextNode(el.textContent))}),document.getElementById("__spellIndicator")?.remove()},_check(){const ed=document.getElementById("editor");if(!ed||!this.active)return;ed.querySelectorAll(".wc-spell-err,.wc-spell-sug").forEach(el=>{el.replaceWith(document.createTextNode(el.textContent))}),ed.spellcheck!==!1&&(ed.spellcheck=!0,ed.lang=this.lang),this.mistakes=[];const walker=document.createTreeWalker(ed,NodeFilter.SHOW_TEXT),nodes=[];let node;for(;node=walker.nextNode();)nodes.push(node);nodes.forEach(textNode=>{if(!textNode.parentNode||textNode.parentNode.classList?.contains("wc-spell-err"))return;let text=textNode.textContent,modified=!1,result=text;if(Object.entries(this.commonErrors).forEach(([wrong,right])=>{const regex=new RegExp("\\b"+wrong+"\\b","gi");regex.test(text)&&(result=result.replace(regex,`<mark class="wc-spell-err" style="background:none;border-bottom:2px solid #e74c3c;cursor:pointer;text-decoration:none" title="\xBFQuisiste decir: ${right}?" onclick="WC_SPELL._suggest(this,'${right}')">${wrong}</mark>`),modified=!0,this.mistakes.push({wrong,right}))}),modified){const span=document.createElement("span");span.innerHTML=result,textNode.parentNode.replaceChild(span,textNode)}}),this._updateIndicator()},_suggest(el,right){const old=document.getElementById("__spellSuggest");old&&old.remove();const rect=el.getBoundingClientRect(),tip=document.createElement("div");tip.id="__spellSuggest",tip.style.cssText=`position:fixed;top:${rect.bottom+4}px;left:${Math.min(rect.left,window.innerWidth-200)}px;z-index:9999;background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.2);padding:8px;font-family:-apple-system,sans-serif;min-width:160px`,tip.innerHTML=`
      <div style="font-size:11px;color:#888;margin-bottom:6px">\xBFQuisiste decir?</div>
      <div onclick="WC_SPELL._replace(document.querySelector('.wc-spell-err[title*=\\"${right}\\"]'),'${right}');this.closest('#__spellSuggest').remove()"
        style="padding:7px 10px;background:#f0f7ff;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;color:#003da5">
        \u2705 ${right}
      </div>
      <div onclick="this.closest('#__spellSuggest').remove()" style="padding:5px 10px;cursor:pointer;font-size:11px;color:#888;text-align:center;margin-top:4px">Ignorar</div>`,document.body.appendChild(tip),document.addEventListener("click",function handler(e){!tip.contains(e.target)&&e.target!==el&&(tip.remove(),document.removeEventListener("click",handler))})},_replace(el,right){el&&(el.replaceWith(document.createTextNode(right)),showToast(`\u2705 "${right}" corregido`),this._updateIndicator())},_showIndicator(){const old=document.getElementById("__spellIndicator");old&&old.remove();const ind=document.createElement("div");ind.id="__spellIndicator",ind.style.cssText="position:fixed;bottom:160px;right:12px;z-index:8000;background:#e74c3c;color:#fff;border-radius:20px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:-apple-system,sans-serif",ind.innerHTML="\u{1F524} 0 errores",ind.onclick=()=>openSpellPanel(),document.body.appendChild(ind)},_updateIndicator(){const ind=document.getElementById("__spellIndicator");if(!ind)return;const count=document.getElementById("editor")?.querySelectorAll(".wc-spell-err").length||0;ind.textContent=`\u{1F524} ${count} error${count!==1?"es":""}`,ind.style.background=count>0?"#e74c3c":"#27ae60"}};function openSpellPanel(){const old=document.getElementById("__spellPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__spellPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const errors=Array.from(document.getElementById("editor")?.querySelectorAll(".wc-spell-err")||[]);ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F524} Corrector ortogr\xE1fico</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">${errors.length} posibles errores detectados</div>

    <div style="display:flex;align-items:center;gap:10px;padding:12px;border:1.5px solid ${WC_SPELL.active?"#27ae60":"#eee"};background:${WC_SPELL.active?"#f0fff4":"#fafafa"};border-radius:12px;margin-bottom:14px">
      <div style="font-size:24px">${WC_SPELL.active?"\u{1F7E2}":"\u26AA"}</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:700">${WC_SPELL.active?"Corrector activo":"Corrector inactivo"}</div><div style="font-size:11px;color:#888">Marca errores comunes con l\xEDnea roja</div></div>
      <button onclick="WC_SPELL.toggle();document.getElementById('__spellPanel').remove()" style="padding:7px 14px;border:none;background:${WC_SPELL.active?"#e74c3c":"#27ae60"};color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">${WC_SPELL.active?"Apagar":"Activar"}</button>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Idioma</label>
      <div style="display:flex;gap:6px">
        ${[["es","\u{1F1E8}\u{1F1F7} Espa\xF1ol"],["en","\u{1F1FA}\u{1F1F8} English"],["pt","\u{1F1E7}\u{1F1F7} Portugu\xEAs"]].map(([v,l])=>`
          <button onclick="WC_SPELL.lang='${v}';localStorage.setItem('wc-spell-lang','${v}');document.querySelectorAll('.__spellLangBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa'});this.style.borderColor='#003da5';this.style.background='#f0f7ff'" class="__spellLangBtn"
            style="flex:1;padding:8px;border:1.5px solid ${WC_SPELL.lang===v?"#003da5":"#eee"};background:${WC_SPELL.lang===v?"#f0f7ff":"#fafafa"};border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">
            ${l}
          </button>`).join("")}
      </div>
    </div>

    ${errors.length?`
    <div style="max-height:200px;overflow-y:auto;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px">Errores encontrados</div>
      ${errors.map((el,i)=>`
        <div style="display:flex;align-items:center;gap:8px;padding:8px;border:1px solid #fde8e8;background:#fde8e800;border-radius:8px;margin-bottom:5px">
          <div style="flex:1">
            <span style="color:#e74c3c;font-weight:600">${el.textContent}</span>
            <span style="color:#888;font-size:11px"> \u2192 ${el.title?.replace("\xBFQuisiste decir: ","")?.replace("?","")}</span>
          </div>
          <button onclick="WC_SPELL._replace(document.querySelectorAll('.wc-spell-err')[${i}],'${el.title?.replace("\xBFQuisiste decir: ","")?.replace("?","")||""}');openSpellPanel()" style="padding:4px 10px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u2705</button>
        </div>`).join("")}
      <button onclick="WC_SPELL._fixAll();document.getElementById('__spellPanel').remove()" style="width:100%;padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-top:6px">\u2705 Corregir todos</button>
    </div>`:'<div style="text-align:center;color:#27ae60;padding:16px;font-size:13px">\u2705 Sin errores detectados</div>'}

    <button onclick="document.getElementById('__spellPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}WC_SPELL._fixAll=function(){document.getElementById("editor")?.querySelectorAll(".wc-spell-err").forEach(el=>{const right=el.title?.replace("\xBFQuisiste decir: ","")?.replace("?","");right&&el.replaceWith(document.createTextNode(right))}),showToast("\u2705 Todos los errores corregidos")},setTimeout(()=>{localStorage.getItem("wc-spell-active")==="true"&&WC_SPELL.toggle()},2500);const WC_AUTOCOMPLETE={active:!1,popup:null,words:[],custom:JSON.parse(localStorage.getItem("wc-autocomplete-words")||"[]"),vocab:["adem\xE1s","tambi\xE9n","aunque","porque","entonces","despu\xE9s","antes","durante","mediante","seg\xFAn","respecto","siguiente","anterior","posterior","importante","necesario","fundamental","espec\xEDfico","general","particular","especial","empresa","organizaci\xF3n","instituci\xF3n","departamento","gerencia","direcci\xF3n","documento","informe","reporte","an\xE1lisis","resultado","conclusi\xF3n","recomendaci\xF3n","proyecto","proceso","procedimiento","actividad","objetivo","estrategia","meta","presupuesto","inversi\xF3n","financiero","econ\xF3mico","administrativo","operativo","Costa Rica","costarricense","nacional","regional","municipal","provincial","Ministerio","Gobierno","Rep\xFAblica","decreto","resoluci\xF3n","acuerdo","circular","cliente","proveedor","contrato","servicio","producto","calidad","entrega","reuni\xF3n","sesi\xF3n","agenda","acta","minuta","convocatoria","asistentes","mediante","conforme","dispuesto","establecido","indicado","se\xF1alado","trabajador","empleado","patrono","salario","jornada","vacaciones","aguinaldo","contribuyente","declaraci\xF3n","impuesto","tributario","Hacienda","CCSS"],toggle(){this.active=!this.active,this.active?this._attach():this._detach(),showToast(this.active?"\u{1F4AD} Autocompletar activado":"Autocompletar desactivado")},_attach(){const ed=document.getElementById("editor");ed&&(this.words=[...new Set([...this.vocab,...this.custom])],this._handler=e=>this._onKey(e),ed.addEventListener("keyup",this._handler))},_detach(){const ed=document.getElementById("editor");ed&&this._handler&&ed.removeEventListener("keyup",this._handler),this._hidePopup()},_onKey(e){if(["ArrowDown","ArrowUp","Enter","Escape","Tab"].includes(e.key))return;const sel=window.getSelection();if(!sel?.rangeCount)return;const range=sel.getRangeAt(0),node=range.startContainer;if(node.nodeType!==3)return;const match=node.textContent.slice(0,range.startOffset).match(/\b(\w{3,})$/);if(!match){this._hidePopup();return}const query=match[1].toLowerCase(),matches=this.words.filter(w=>w.toLowerCase().startsWith(query)&&w.toLowerCase()!==query).slice(0,5);if(!matches.length){this._hidePopup();return}this._showPopup(matches,range,query)},_showPopup(matches,range,query){this._hidePopup();const rect=range.getBoundingClientRect(),pop=document.createElement("div");pop.id="__acPopup",pop.style.cssText=`position:fixed;top:${rect.bottom+4}px;left:${Math.min(rect.left,window.innerWidth-220)}px;z-index:9999;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.2);overflow:hidden;font-family:-apple-system,sans-serif;min-width:180px`,pop.innerHTML=matches.map((w,i)=>`
      <div class="__acItem" onclick="WC_AUTOCOMPLETE._accept('${w}','${query}')"
        style="padding:9px 14px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px;${i===0?"background:#f0f7ff;":""}"
        onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='${i===0?"#f0f7ff":""}'">
        <span style="color:#003da5;font-weight:700">${w.slice(0,query.length)}</span><span style="color:#555">${w.slice(query.length)}</span>
        ${i===0?'<span style="margin-left:auto;font-size:10px;color:#aaa">Tab</span>':""}
      </div>`).join(""),document.body.appendChild(pop),this.popup=pop,this._tabHandler=e=>{e.key==="Tab"&&(e.preventDefault(),this._accept(matches[0],query)),e.key==="Escape"&&this._hidePopup()},document.addEventListener("keydown",this._tabHandler)},_accept(word,query){const ed=document.getElementById("editor"),sel=window.getSelection();if(!sel?.rangeCount||!ed){this._hidePopup();return}const range=sel.getRangeAt(0);if(range.startContainer.nodeType!==3){this._hidePopup();return}const suffix=word.slice(query.length),newNode=document.createTextNode(suffix+" ");range.insertNode(newNode);const newRange=document.createRange();newRange.setStartAfter(newNode),newRange.collapse(!0),sel.removeAllRanges(),sel.addRange(newRange),this._hidePopup()},_hidePopup(){document.getElementById("__acPopup")?.remove(),this._tabHandler&&(document.removeEventListener("keydown",this._tabHandler),this._tabHandler=null),this.popup=null},addWord(word){!word||this.custom.includes(word)||(this.custom.push(word),this.words=[...new Set([...this.vocab,...this.custom])],localStorage.setItem("wc-autocomplete-words",JSON.stringify(this.custom)),showToast(`\u{1F4AD} "${word}" agregado al vocabulario`))}};function openAutocompletePanel(){const old=document.getElementById("__acPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__acPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4AD} Autocompletar palabras</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">${WC_AUTOCOMPLETE.vocab.length+WC_AUTOCOMPLETE.custom.length} palabras en vocabulario</div>

    <div style="display:flex;align-items:center;gap:10px;padding:12px;border:1.5px solid ${WC_AUTOCOMPLETE.active?"#9b59b6":"#eee"};background:${WC_AUTOCOMPLETE.active?"#f5eeff":"#fafafa"};border-radius:12px;margin-bottom:14px">
      <div style="font-size:24px">${WC_AUTOCOMPLETE.active?"\u{1F7E3}":"\u26AA"}</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:700">${WC_AUTOCOMPLETE.active?"Activo \u2014 Presion\xE1 Tab para aceptar":"Inactivo"}</div><div style="font-size:11px;color:#888">Sugiere palabras mientras escrib\xEDs</div></div>
      <button onclick="WC_AUTOCOMPLETE.toggle();document.getElementById('__acPanel').remove()" style="padding:7px 14px;border:none;background:${WC_AUTOCOMPLETE.active?"#e74c3c":"#9b59b6"};color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">${WC_AUTOCOMPLETE.active?"Apagar":"Activar"}</button>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Agregar palabra personalizada</label>
      <div style="display:flex;gap:6px">
        <input type="text" id="__acWordInput" placeholder="ej: costarricense"
          style="flex:1;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#9b59b6'" onblur="this.style.borderColor='#eee'"
          onkeydown="if(event.key==='Enter'){WC_AUTOCOMPLETE.addWord(this.value.trim());this.value=''}">
        <button onclick="WC_AUTOCOMPLETE.addWord(document.getElementById('__acWordInput').value.trim());document.getElementById('__acWordInput').value=''" style="padding:8px 14px;border:none;background:#9b59b6;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+</button>
      </div>
    </div>

    ${WC_AUTOCOMPLETE.custom.length?`
    <div style="background:#f5eeff;border-radius:10px;padding:10px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Palabras personalizadas (${WC_AUTOCOMPLETE.custom.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${WC_AUTOCOMPLETE.custom.map(w=>`<span style="background:#9b59b622;border:1px solid #9b59b644;border-radius:12px;padding:3px 10px;font-size:11px;color:#555">${w}</span>`).join("")}
      </div>
    </div>`:""}

    <div style="background:#f0f7ff;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.7">
      \u{1F4A1} <strong>C\xF3mo usar:</strong> Escrib\xED 3+ letras y aparecer\xE1n sugerencias. Presion\xE1 <strong>Tab</strong> para aceptar la primera, o hac\xE9 click en cualquier sugerencia.
    </div>

    <button onclick="document.getElementById('__acPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}const WC_VERSIONS={versions:JSON.parse(localStorage.getItem("wc-versions")||"[]"),maxVersions:20,save(label){const ed=document.getElementById("editor");if(!ed)return;const ver={id:Date.now(),label:label||"Versi\xF3n "+new Date().toLocaleString("es-CR"),content:ed.innerHTML,words:ed.innerText.trim().split(/\s+/).filter(w=>w).length,created:Date.now()};return this.versions.unshift(ver),this.versions.length>this.maxVersions&&this.versions.pop(),localStorage.setItem("wc-versions",JSON.stringify(this.versions)),showToast(`\u{1F4BE} Versi\xF3n "${ver.label}" guardada \u2705`),ver.id},restore(id){const ver=this.versions.find(v=>v.id===id),ed=document.getElementById("editor");!ver||!ed||(this.save("Auto-guardado antes de restaurar"),ed.innerHTML=ver.content,showToast(`\u21A9 Versi\xF3n "${ver.label}" restaurada`))},delete(id){this.versions=this.versions.filter(v=>v.id!==id),localStorage.setItem("wc-versions",JSON.stringify(this.versions))},autoSave(){const ed=document.getElementById("editor");!ed||ed.innerText.trim().split(/\s+/).filter(w=>w).length<10||this.save("Auto-guardado \xB7 "+new Date().toLocaleTimeString("es-CR"))}};setInterval(()=>WC_VERSIONS.autoSave(),300*1e3);function openVersionHistory(){const old=document.getElementById("__verPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__verPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2);font-family:-apple-system,sans-serif">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <div style="font-size:17px;font-weight:700;color:#1a2942;flex:1">\u{1F550} Historial de versiones</div>
        <button onclick="WC_VERSIONS.save(prompt('Nombre de esta versi\xF3n:','')||'Versi\xF3n manual');openVersionHistory()" style="padding:6px 12px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Guardar ahora</button>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 16px">
      ${WC_VERSIONS.versions.length?WC_VERSIONS.versions.map((v,i)=>`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:12px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fff"};border-radius:12px;margin-bottom:8px">
            <div style="width:36px;height:36px;border-radius:50%;background:${i===0?"#003da5":"#f0f0f0"};color:${i===0?"#fff":"#888"};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${WC_VERSIONS.versions.length-i}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v.label}</div>
              <div style="font-size:10px;color:#aaa;margin-top:2px">${new Date(v.created).toLocaleString("es-CR")} \xB7 ${v.words} palabras</div>
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0">
              <button onclick="WC_VERSIONS.restore(${v.id});document.getElementById('__verPanel').remove()" style="padding:5px 10px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u21A9 Restaurar</button>
              <button onclick="WC_VERSIONS.delete(${v.id});openVersionHistory()" style="padding:5px 8px;border:1px solid #eee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;color:#e74c3c">\xD7</button>
            </div>
          </div>`).join(""):'<div style="text-align:center;padding:30px;color:#bbb;font-size:13px">\u{1F550} Sin versiones guardadas.<br><small>Se guarda autom\xE1ticamente cada 5 minutos.</small></div>'}
    </div>

    <div style="padding:10px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__verPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function openVersionCompare(){const old=document.getElementById("__compPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__compPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;flex-direction:column;font-family:-apple-system,sans-serif",ov.innerHTML=`
    <div style="background:#1a2942;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">\u{1F500} Comparar versiones</div>
      <button onclick="document.getElementById('__compPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">\u2715</button>
    </div>

    <div style="background:#252540;padding:10px 16px;display:flex;gap:10px;align-items:center;flex-shrink:0">
      <div style="flex:1">
        <label style="font-size:10px;color:rgba(255,255,255,.5);display:block;margin-bottom:3px">VERSI\xD3N ANTERIOR</label>
        <select id="__compV1" style="width:100%;padding:7px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:7px;color:#fff;font-size:12px;outline:none">
          ${WC_VERSIONS.versions.map((v,i)=>`<option value="${i}">${v.label}</option>`).join("")}
        </select>
      </div>
      <div style="color:#aaa;font-size:20px;flex-shrink:0">\u27F7</div>
      <div style="flex:1">
        <label style="font-size:10px;color:rgba(255,255,255,.5);display:block;margin-bottom:3px">VERSI\xD3N NUEVA</label>
        <select id="__compV2" style="width:100%;padding:7px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:7px;color:#fff;font-size:12px;outline:none">
          <option value="current">Documento actual</option>
          ${WC_VERSIONS.versions.map((v,i)=>`<option value="${i}">${v.label}</option>`).join("")}
        </select>
      </div>
      <button onclick="__runCompare()" style="padding:8px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;flex-shrink:0">Comparar</button>
    </div>

    <div id="__compResult" style="flex:1;overflow:auto;padding:12px 16px;background:#1a1a2e;display:grid;grid-template-columns:1fr 1fr;gap:12px"></div>

    <div style="background:#252540;padding:8px 16px;font-size:11px;color:#666;flex-shrink:0">
      <span id="__compStats">Seleccion\xE1 dos versiones y hac\xE9 click en Comparar</span>
    </div>`,document.body.appendChild(ov),WC_VERSIONS.versions.length||(document.getElementById("__compResult").innerHTML='<div style="grid-column:1/-1;text-align:center;color:#666;padding:40px">Sin versiones guardadas. Guard\xE1 versiones desde el Historial.</div>')}function __runCompare(){const v1Idx=document.getElementById("__compV1")?.value,v2Val=document.getElementById("__compV2")?.value,ed=document.getElementById("editor"),result=document.getElementById("__compResult"),stats=document.getElementById("__compStats");if(!result)return;const v1=WC_VERSIONS.versions[parseInt(v1Idx)],v2=v2Val==="current"?{label:"Documento actual",content:ed?.innerHTML||""}:WC_VERSIONS.versions[parseInt(v2Val)];if(!v1||!v2){showToast("Seleccion\xE1 versiones v\xE1lidas");return}const text1=v1.content.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim(),text2=v2.content.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim(),words1=text1.split(/\s+/).length,words2=text2.split(/\s+/).length,diff=words2-words1;stats&&(stats.textContent=`${v1.label} (${words1} palabras) vs ${v2.label} (${words2} palabras) \xB7 Diferencia: ${diff>0?"+":""}${diff} palabras`);const paras1=text1.split(/\.\s+/).filter(p=>p.trim().length>10),paras2=text2.split(/\.\s+/).filter(p=>p.trim().length>10);result.innerHTML=`
    <div style="background:#1a2942;border-radius:10px;padding:12px;overflow-y:auto;max-height:calc(100vh - 200px)">
      <div style="font-size:11px;font-weight:700;color:#e74c3c;margin-bottom:8px;text-transform:uppercase">${v1.label}</div>
      ${paras1.map(p=>`<p style="font-size:12px;color:#ddd;line-height:1.6;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.05)">${p}.</p>`).join("")}
    </div>
    <div style="background:#1a2942;border-radius:10px;padding:12px;overflow-y:auto;max-height:calc(100vh - 200px)">
      <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:8px;text-transform:uppercase">${v2.label}</div>
      ${paras2.map((p,i)=>{const isNew=!paras1.some(p1=>p1.includes(p.slice(0,30)));return`<p style="font-size:12px;color:${isNew?"#2ecc71":"#ddd"};line-height:1.6;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.05);${isNew?"background:rgba(46,204,113,.1);border-radius:4px;padding:6px;":""}">${p}.</p>`}).join("")}
    </div>`}const WC_TTS={synth:window.speechSynthesis,utterance:null,playing:!1,paused:!1,voices:[],rate:parseFloat(localStorage.getItem("wc-tts-rate")||"1"),pitch:parseFloat(localStorage.getItem("wc-tts-pitch")||"1"),voiceIdx:parseInt(localStorage.getItem("wc-tts-voice")||"0"),init(){return this.synth?(this.voices=this.synth.getVoices().filter(v=>v.lang.startsWith("es")||v.lang.startsWith("en")),this.voices.length||this.synth.addEventListener("voiceschanged",()=>{this.voices=this.synth.getVoices().filter(v=>v.lang.startsWith("es")||v.lang.startsWith("en"))}),!0):!1},speak(text){if(!this.synth){showToast("Tu navegador no soporta texto a voz");return}this.stop(),this.utterance=new SpeechSynthesisUtterance(text),this.utterance.rate=this.rate,this.utterance.pitch=this.pitch,this.voices[this.voiceIdx]&&(this.utterance.voice=this.voices[this.voiceIdx]),this.utterance.onstart=()=>{this.playing=!0,this._updatePanel()},this.utterance.onend=()=>{this.playing=!1,this.paused=!1,this._updatePanel()},this.utterance.onerror=()=>{this.playing=!1,this._updatePanel()},this.synth.speak(this.utterance),this.playing=!0},pause(){this.playing&&!this.paused&&(this.synth.pause(),this.paused=!0,this._updatePanel())},resume(){this.paused&&(this.synth.resume(),this.paused=!1,this._updatePanel())},stop(){this.synth.cancel(),this.playing=!1,this.paused=!1,this._updatePanel()},toggle(){this.playing&&!this.paused?this.pause():this.paused?this.resume():this._startFromEditor()},_startFromEditor(){const ed=document.getElementById("editor"),text=window.getSelection()?.toString().trim()||ed?.innerText?.trim()||"";if(!text){showToast("El documento est\xE1 vac\xEDo");return}this.speak(text),this._showPlayerPanel()},_showPlayerPanel(){const old=document.getElementById("__ttsPlayer");old&&old.remove();const p=document.createElement("div");p.id="__ttsPlayer",p.style.cssText="position:fixed;bottom:160px;left:50%;transform:translateX(-50%);z-index:9000;background:#1a2942;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.3);padding:12px 20px;display:flex;align-items:center;gap:12px;font-family:-apple-system,sans-serif;min-width:240px",p.innerHTML=`
      <div style="font-size:16px">\u{1F50A}</div>
      <div style="flex:1">
        <div id="__ttsStatus" style="font-size:12px;font-weight:600;color:#fff">Leyendo...</div>
        <div style="font-size:10px;color:rgba(255,255,255,.5)">Velocidad: ${this.rate}x</div>
      </div>
      <button id="__ttsPlayBtn" onclick="WC_TTS.toggle()" style="width:36px;height:36px;border:none;background:#0084ff;color:#fff;border-radius:50%;cursor:pointer;font-size:16px">\u23F8</button>
      <button onclick="WC_TTS.stop();document.getElementById('__ttsPlayer').remove()" style="width:36px;height:36px;border:none;background:rgba(255,255,255,.1);color:#fff;border-radius:50%;cursor:pointer;font-size:14px">\u25A0</button>`,document.body.appendChild(p)},_updatePanel(){const btn=document.getElementById("__ttsPlayBtn"),sta=document.getElementById("__ttsStatus");btn&&(btn.textContent=this.paused?"\u25B6":this.playing?"\u23F8":"\u25B6"),sta&&(sta.textContent=this.paused?"Pausado":this.playing?"Leyendo...":"Detenido"),!this.playing&&!this.paused&&document.getElementById("__ttsPlayer")?.remove()}};WC_TTS.init();function openTTSPanel(){const old=document.getElementById("__ttsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ttsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const voices=WC_TTS.synth?WC_TTS.synth.getVoices().filter(v=>v.lang.startsWith("es")||v.lang.startsWith("en")):[];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F50A} Texto a voz</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Lee el documento en voz alta</div>

    ${window.speechSynthesis?`
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Voz (${voices.length} disponibles)</label>
        <select id="__ttsVoice" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none"
          onchange="WC_TTS.voiceIdx=this.selectedIndex;localStorage.setItem('wc-tts-voice',this.selectedIndex)">
          ${voices.map((v,i)=>`<option value="${i}" ${i===WC_TTS.voiceIdx?"selected":""}>${v.name} (${v.lang})</option>`).join("")}
          ${voices.length?"":"<option>Sin voces disponibles</option>"}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Velocidad: <span id="__ttsRateVal">${WC_TTS.rate}x</span></label>
        <input type="range" id="__ttsRate" min="0.5" max="2" step="0.1" value="${WC_TTS.rate}" style="width:100%;accent-color:#0084ff"
          oninput="WC_TTS.rate=parseFloat(this.value);localStorage.setItem('wc-tts-rate',this.value);document.getElementById('__ttsRateVal').textContent=parseFloat(this.value).toFixed(1)+'x'">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tono: <span id="__ttsPitchVal">${WC_TTS.pitch}</span></label>
        <input type="range" id="__ttsPitch" min="0.5" max="2" step="0.1" value="${WC_TTS.pitch}" style="width:100%;accent-color:#0084ff"
          oninput="WC_TTS.pitch=parseFloat(this.value);localStorage.setItem('wc-tts-pitch',this.value);document.getElementById('__ttsPitchVal').textContent=parseFloat(this.value).toFixed(1)">
      </div>
    </div>

    <div style="background:#f0f7ff;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.7">
      \u{1F4A1} Seleccion\xE1 texto para leer solo esa parte, o dej\xE1 sin selecci\xF3n para leer todo el documento.
    </div>

    <div style="display:flex;gap:8px;margin-bottom:8px">
      <button onclick="WC_TTS._startFromEditor();document.getElementById('__ttsPanel').remove()" style="flex:2;padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F50A} Leer documento</button>
      <button onclick="WC_TTS.stop()" style="flex:1;padding:12px;border:1.5px solid #eee;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">\u25A0 Detener</button>
    </div>`:'<div style="background:#fde8e8;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#721c24">\u26A0\uFE0F Tu navegador no soporta Text-to-Speech. Prob\xE1 con Safari o Chrome.</div>'}

    <button onclick="document.getElementById('__ttsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"spellCheck":openSpellPanel();break;case"autocomplete":openAutocompletePanel();break;case"versionHistory":openVersionHistory();break;case"compareVersions":openVersionCompare();break;case"textToSpeech":openTTSPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.43 \u2705 \u2014 Spell, Autocomplete, Versiones, Comparar, TTS")},5100)})();
