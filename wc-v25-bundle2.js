const WC_SPELL={enabled:!1,timer:null,rules:[{pattern:/\bhabia\b/gi,fix:"hab\xEDa",type:"ortograf\xEDa"},{pattern:/\btenia\b/gi,fix:"ten\xEDa",type:"ortograf\xEDa"},{pattern:/\bestar\b ia\b/gi,fix:"estar\xEDa",type:"ortograf\xEDa"},{pattern:/\bdecia\b/gi,fix:"dec\xEDa",type:"ortograf\xEDa"},{pattern:/\bpodria\b/gi,fix:"podr\xEDa",type:"ortograf\xEDa"},{pattern:/\bdeberia\b/gi,fix:"deber\xEDa",type:"ortograf\xEDa"},{pattern:/\bqueria\b/gi,fix:"quer\xEDa",type:"ortograf\xEDa"},{pattern:/\bvenia\b/gi,fix:"ven\xEDa",type:"ortograf\xEDa"},{pattern:/\bsabia\b/gi,fix:"sab\xEDa",type:"ortograf\xEDa"},{pattern:/\bveia\b/gi,fix:"ve\xEDa",type:"ortograf\xEDa"},{pattern:/\bponia\b/gi,fix:"pon\xEDa",type:"ortograf\xEDa"},{pattern:/\bhacer\s+falta\b/gi,fix:"hace falta",type:"redacci\xF3n"},{pattern:/\ba ver\b/gi,fix:"a ver / haber",type:"confusi\xF3n"},{pattern:/\bporque\b.*\?/gi,fix:"\xBFpor qu\xE9?",type:"puntuaci\xF3n"},{pattern:/\bsi\b.*\!/gi,fix:"s\xED (con tilde)",type:"confusi\xF3n"},{pattern:/\bmas\s+sin\s+embargo\b/gi,fix:"mas / sin embargo",type:"redacci\xF3n"},{pattern:/\ben\s+base\s+a\b/gi,fix:"con base en",type:"redacci\xF3n"},{pattern:/\ba\s+nivel\s+de\b/gi,fix:"en cuanto a",type:"redacci\xF3n"},{pattern:/\bde\s+acuerdo\s+a\b/gi,fix:"de acuerdo con",type:"redacci\xF3n"},{pattern:/\bdonde\s+que\b/gi,fix:"donde",type:"gram\xE1tica"},{pattern:/  +/g,fix:" ",type:"formato"},{pattern:/,\s*\./g,fix:".",type:"puntuaci\xF3n"},{pattern:/\.\s*,/g,fix:".",type:"puntuaci\xF3n"}],check(){const ed=document.getElementById("editor");if(!ed||!this.enabled)return;ed.querySelectorAll(".wc-spell-err").forEach(el=>{el.replaceWith(document.createTextNode(el.textContent))});const walker=document.createTreeWalker(ed,NodeFilter.SHOW_TEXT),nodes=[];let node;for(;node=walker.nextNode();)!node.parentElement.closest(".wc-spell-err")&&!node.parentElement.closest("script")&&!node.parentElement.closest("style")&&nodes.push(node);let errCount=0;nodes.forEach(textNode=>{let text=textNode.textContent,found=!1;if(this.rules.forEach(rule=>{rule.pattern.test(text)&&(found=!0),rule.pattern.lastIndex=0}),!found)return;const span=document.createElement("span");span.innerHTML=text,this.rules.forEach(rule=>{span.innerHTML=span.innerHTML.replace(rule.pattern,match=>(errCount++,`<span class="wc-spell-err" data-fix="${rule.fix}" data-type="${rule.type}"
            style="border-bottom:2px ${rule.type==="ortograf\xEDa"?"wavy red":"wavy #e67e22"};cursor:pointer"
            title="${rule.type}: sugerencia \u2192 ${rule.fix}"
            onclick="__spellFix(this)">${match}</span>`)),rule.pattern.lastIndex=0}),textNode.parentNode.replaceChild(span,textNode)}),ed.normalize(),errCount>0&&showToast(`\u270F\uFE0F ${errCount} posible${errCount!==1?"s":""} error${errCount!==1?"es":""} detectado${errCount!==1?"s":""}`)},toggle(){if(this.enabled=!this.enabled,this.enabled){this.check();const ed=document.getElementById("editor");ed&&ed.addEventListener("input",()=>{clearTimeout(this.timer),this.timer=setTimeout(()=>this.check(),1500)}),showToast("\u270F\uFE0F Corrector activado")}else{const ed=document.getElementById("editor");ed&&ed.querySelectorAll(".wc-spell-err").forEach(el=>el.replaceWith(document.createTextNode(el.textContent))),showToast("Corrector desactivado")}}};function __spellFix(el){const fix=el.dataset.fix,fixes=fix.split(" / ");if(fixes.length===1)el.replaceWith(document.createTextNode(fix)),showToast('Corregido: "'+fix+'" \u2705');else{const menu=document.createElement("div");menu.style.cssText="position:fixed;z-index:99999;background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.25);padding:6px;min-width:140px";const rect=el.getBoundingClientRect();menu.style.left=rect.left+"px",menu.style.top=rect.bottom+4+"px",fixes.forEach(f=>{const btn=document.createElement("button");btn.style.cssText="display:block;width:100%;padding:8px 12px;border:none;background:none;text-align:left;cursor:pointer;font-size:13px;border-radius:7px",btn.textContent=f,btn.onmouseover=()=>btn.style.background="#f0f7ff",btn.onmouseout=()=>btn.style.background="none",btn.onclick=()=>{el.replaceWith(document.createTextNode(f)),menu.remove(),showToast("Corregido \u2705")},menu.appendChild(btn)}),document.body.appendChild(menu),setTimeout(()=>document.addEventListener("click",function d(e){menu.contains(e.target)||(menu.remove(),document.removeEventListener("click",d))}),50)}}function openSpellPanel(){const old=document.getElementById("__spellPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__spellPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const ed=document.getElementById("editor"),errors=ed?ed.querySelectorAll(".wc-spell-err").length:0;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u270F\uFE0F Corrector gramatical</div>

    <div style="background:${WC_SPELL.enabled?"#d4edda":"#f8f9fa"};border-radius:12px;padding:14px;margin-bottom:14px;text-align:center">
      <div style="font-size:28px;margin-bottom:6px">${WC_SPELL.enabled?"\u2705":"\u2B55"}</div>
      <div style="font-size:14px;font-weight:700;color:${WC_SPELL.enabled?"#155724":"#555"}">
        ${WC_SPELL.enabled?"Corrector activo":"Corrector inactivo"}
      </div>
      ${errors>0?`<div style="font-size:12px;color:#e74c3c;margin-top:4px">${errors} posibles errores encontrados</div>`:""}
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <button onclick="WC_SPELL.toggle();document.getElementById('__spellPanel').remove()"
        style="padding:12px;border:none;background:${WC_SPELL.enabled?"#f8d7da":"#0084ff"};color:${WC_SPELL.enabled?"#721c24":"#fff"};border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        ${WC_SPELL.enabled?"\u23F9 Desactivar corrector":"\u25B6\uFE0F Activar corrector"}
      </button>
      <button onclick="WC_SPELL.check();document.getElementById('__spellPanel').remove()"
        style="padding:12px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">
        \u{1F50D} Revisar ahora
      </button>
      <button onclick="__acceptAllSpell();document.getElementById('__spellPanel').remove()"
        style="padding:12px;border:1.5px solid #27ae60;background:#fff;color:#27ae60;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">
        \u2705 Aceptar todas las sugerencias
      </button>
    </div>

    <div style="font-size:11px;color:#888;background:#f8f9fa;border-radius:8px;padding:10px;line-height:1.7;margin-bottom:14px">
      <strong style="color:#555">Detecta:</strong> tildes faltantes, uso de "en base a" vs "con base en", "a nivel de", "de acuerdo a", dobles espacios, puntuaci\xF3n y m\xE1s.<br>
      <strong style="color:#e74c3c">Rojo</strong> = ortograf\xEDa \xB7 <strong style="color:#e67e22">Naranja</strong> = redacci\xF3n
    </div>

    <button onclick="document.getElementById('__spellPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __acceptAllSpell(){const ed=document.getElementById("editor");ed&&(ed.querySelectorAll(".wc-spell-err").forEach(el=>{const fix=el.dataset.fix.split(" / ")[0];el.replaceWith(document.createTextNode(fix))}),showToast("\u2705 Todas las sugerencias aplicadas"))}function openImageGenPanel(){const old=document.getElementById("__imgGenPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__imgGenPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const presets=["\u{1F1E8}\u{1F1F7} Paisaje costarricense","\u{1F98B} Mariposa Morpho azul","\u{1F30B} Volc\xE1n Arenal al atardecer","\u{1F422} Tortuga marina Pac\xEDfico","\u{1F99C} Lapa roja en selva","\u2615 Cafetal de Costa Rica","\u{1F30A} Playa caribe\xF1a costarricense","\u{1F406} Jaguar en selva tropical"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:22px 22px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
        \u{1F3A8} Generar imagen con IA
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Gratis \xB7 Pollinations AI \xB7 Sin API Key</div>

      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Ideas r\xE1pidas</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
        ${presets.map(p=>`
          <button onclick="document.getElementById('__imgPrompt').value='${p.replace(/^[^\s]+\s/,"")}';__imgPreview()"
            style="padding:5px 10px;border:1.5px solid #eee;background:#fafafa;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            ${p}
          </button>`).join("")}
      </div>

      <textarea id="__imgPrompt" rows="3"
        style="width:100%;padding:11px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;resize:vertical;box-sizing:border-box;margin-bottom:10px"
        placeholder="Describe la imagen que quer\xE9s generar... ej: 'Paisaje monta\xF1oso de Costa Rica al amanecer, estilo acuarela'"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
        <div>
          <label style="font-size:11px;color:#555;font-weight:600;display:block;margin-bottom:4px">Tama\xF1o</label>
          <select id="__imgSize" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="512x512">Cuadrado</option>
            <option value="768x512">Horizontal</option>
            <option value="512x768">Vertical</option>
            <option value="1024x512">Panor\xE1mico</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:#555;font-weight:600;display:block;margin-bottom:4px">Estilo</label>
          <select id="__imgStyle" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="">Autom\xE1tico</option>
            <option value="photorealistic">Foto real</option>
            <option value="watercolor">Acuarela</option>
            <option value="oil painting">\xD3leo</option>
            <option value="digital art">Arte digital</option>
            <option value="pencil sketch">L\xE1piz</option>
            <option value="flat design">Dise\xF1o plano</option>
            <option value="minimalist">Minimalista</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:#555;font-weight:600;display:block;margin-bottom:4px">Seed</label>
          <input type="number" id="__imgSeed" value="${Math.floor(Math.random()*9999)}" min="1" max="9999"
            style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>

      <div id="__imgPreviewBox" style="min-height:80px;background:#fafafa;border-radius:12px;margin-bottom:14px;overflow:hidden;border:1.5px solid #eee;display:flex;align-items:center;justify-content:center">
        <div style="color:#bbb;font-size:13px;padding:20px">La imagen aparecer\xE1 aqu\xED</div>
      </div>
    </div>
    <div style="padding:0 22px 22px;display:flex;gap:8px">
      <button onclick="document.getElementById('__imgGenPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__imgPreview()" style="flex:1;padding:11px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F441} Previsualizar</button>
      <button onclick="__imgInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3A8} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __imgBuildUrl(prompt2,size,style,seed){const fullPrompt=prompt2+(style?", "+style:"")+", high quality, detailed",[w,h]=(size||"512x512").split("x");return`https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true`}function __imgPreview(){const prompt2=document.getElementById("__imgPrompt").value.trim(),size=document.getElementById("__imgSize").value,style=document.getElementById("__imgStyle").value,seed=document.getElementById("__imgSeed").value,box=document.getElementById("__imgPreviewBox");if(!prompt2||!box){showToast("Escrib\xED una descripci\xF3n primero");return}box.innerHTML='<div style="padding:30px;color:#0084ff;text-align:center">\u{1F3A8} Generando imagen...</div>';const url=__imgBuildUrl(prompt2,size,style,seed),img=new Image;img.onload=()=>{box.innerHTML="",img.style.cssText="width:100%;border-radius:10px;display:block",box.appendChild(img),box._lastUrl=url,box._lastPrompt=prompt2},img.onerror=()=>{box.innerHTML='<div style="padding:20px;color:#e74c3c;text-align:center">\u26A0\uFE0F Error generando imagen. Verific\xE1 la conexi\xF3n.</div>'},img.src=url}function __imgInsert(){const prompt2=document.getElementById("__imgPrompt").value.trim(),size=document.getElementById("__imgSize").value,style=document.getElementById("__imgStyle").value,seed=document.getElementById("__imgSeed").value;if(!prompt2){showToast("Escrib\xED una descripci\xF3n primero");return}const html=`<p style="text-align:center">
    <img src="${__imgBuildUrl(prompt2,size,style,seed)}" style="max-width:100%;border-radius:10px;margin:8px 0" alt="${prompt2}" loading="lazy">
    <br><em style="font-size:10px;color:#aaa">IA: ${prompt2.substring(0,60)}${prompt2.length>60?"...":""}</em>
  </p>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__imgGenPanel").remove(),showToast("\u{1F3A8} Imagen insertada \u2705")}const WC_TTS={speaking:!1,paused:!1,utterance:null,chunks:[],currentChunk:0,highlightEl:null,speak(text,opts){if(!window.speechSynthesis){showToast("S\xEDntesis de voz no disponible");return}this.stop(),this.speaking=!0,this.paused=!1,this.chunks=text.split(/\n+/).filter(c=>c.trim().length>0),this.currentChunk=0,this._speakNext(opts||{}),this._updateUI()},_speakNext(opts){if(this.currentChunk>=this.chunks.length){this.stop();return}const utt=new SpeechSynthesisUtterance(this.chunks[this.currentChunk]);utt.lang=opts.lang||"es-CR",utt.rate=opts.rate||.9,utt.pitch=opts.pitch||1,utt.volume=opts.volume||1;const voices=window.speechSynthesis.getVoices(),esVoice=voices.find(v=>v.lang.startsWith("es")&&v.name.includes("Google"))||voices.find(v=>v.lang.startsWith("es"))||null;esVoice&&(utt.voice=esVoice),utt.onend=()=>{this.currentChunk++,this.speaking&&!this.paused&&this._speakNext(opts)},utt.onerror=()=>{this.currentChunk++,this.speaking&&this._speakNext(opts)},this.utterance=utt,window.speechSynthesis.speak(utt);const prog=document.getElementById("__ttsProgress");prog&&(prog.value=Math.round(this.currentChunk/this.chunks.length*100));const info=document.getElementById("__ttsInfo");info&&(info.textContent=`P\xE1rrafo ${this.currentChunk+1} de ${this.chunks.length}`)},pause(){window.speechSynthesis.pause(),this.paused=!0,this._updateUI()},resume(){window.speechSynthesis.resume(),this.paused=!1,this._updateUI()},stop(){window.speechSynthesis.cancel(),this.speaking=!1,this.paused=!1,this.currentChunk=0,this._updateUI();const prog=document.getElementById("__ttsProgress");prog&&(prog.value=0)},_updateUI(){const playBtn=document.getElementById("__ttsPlay"),pauseBtn=document.getElementById("__ttsPause"),stopBtn=document.getElementById("__ttsStop");playBtn&&(playBtn.style.display=this.speaking&&!this.paused?"none":"block"),pauseBtn&&(pauseBtn.style.display=this.speaking&&!this.paused?"block":"none"),stopBtn&&(stopBtn.style.display=this.speaking?"block":"none")}};function openTTSPanel(){const old=document.getElementById("__ttsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ttsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const ed=document.getElementById("editor"),words=(ed?ed.innerText.trim():"").split(/\s+/).filter(w=>w).length,mins=Math.round(words/150);ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:540px;padding:20px;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 16px"></div>
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u{1F50A} Lector en voz alta
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">${words} palabras \xB7 ~${mins} min de lectura</div>

    <!-- Controles principales -->
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px">
      <button id="__ttsPlay" onclick="__ttsStart()" style="width:56px;height:56px;border-radius:50%;border:none;background:#0084ff;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 4px 16px rgba(0,132,255,.4);transition:all .2s;display:block">\u25B6</button>
      <button id="__ttsPause" onclick="WC_TTS.paused?WC_TTS.resume():WC_TTS.pause()" style="width:56px;height:56px;border-radius:50%;border:none;background:#f39c12;color:#fff;font-size:22px;cursor:pointer;display:none">\u23F8</button>
      <button id="__ttsStop" onclick="WC_TTS.stop()" style="width:44px;height:44px;border-radius:50%;border:none;background:#e74c3c;color:#fff;font-size:18px;cursor:pointer;display:none">\u23F9</button>
    </div>

    <!-- Progreso -->
    <progress id="__ttsProgress" value="0" max="100" style="width:100%;height:6px;border-radius:3px;margin-bottom:6px;accent-color:#0084ff"></progress>
    <div id="__ttsInfo" style="text-align:center;font-size:11px;color:#aaa;margin-bottom:14px">Listo para leer</div>

    <!-- Configuraci\xF3n -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;color:#555;font-weight:600;display:block;margin-bottom:4px">Velocidad</label>
        <input type="range" id="__ttsRate" min="0.5" max="2" step="0.1" value="0.9"
          style="width:100%;accent-color:#0084ff"
          oninput="document.getElementById('__ttsRateVal').textContent=parseFloat(this.value).toFixed(1)+'x'">
        <span id="__ttsRateVal" style="font-size:11px;color:#888">0.9x</span>
      </div>
      <div>
        <label style="font-size:11px;color:#555;font-weight:600;display:block;margin-bottom:4px">Tono</label>
        <input type="range" id="__ttsPitch" min="0.5" max="2" step="0.1" value="1"
          style="width:100%;accent-color:#0084ff"
          oninput="document.getElementById('__ttsPitchVal').textContent=parseFloat(this.value).toFixed(1)">
        <span id="__ttsPitchVal" style="font-size:11px;color:#888">1.0</span>
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;color:#555;font-weight:600;display:block;margin-bottom:6px">Qu\xE9 leer</label>
      <div style="display:flex;gap:6px">
        <button onclick="__ttsSetScope('all',this)" class="__ttsScopeBtn" data-sel="1"
          style="flex:1;padding:7px;border:2px solid #0084ff;background:#f0f7ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#0084ff">
          \u{1F4C4} Todo
        </button>
        <button onclick="__ttsSetScope('sel',this)" class="__ttsScopeBtn"
          style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">
          \u270F\uFE0F Selecci\xF3n
        </button>
        <button onclick="__ttsSetScope('para',this)" class="__ttsScopeBtn"
          style="flex:1;padding:7px;border:2px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">
          \xB6 P\xE1rrafo
        </button>
      </div>
    </div>

    <button onclick="WC_TTS.stop();document.getElementById('__ttsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window._ttsScope="all"}function __ttsSetScope(scope,btn){window._ttsScope=scope,document.querySelectorAll(".__ttsScopeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.style.color="#0084ff",btn.dataset.sel="1"}function __ttsStart(){const ed=document.getElementById("editor"),rate=parseFloat(document.getElementById("__ttsRate").value),pitch=parseFloat(document.getElementById("__ttsPitch").value),scope=window._ttsScope||"all";let text="";if(scope==="sel"){const sel=window.getSelection();if(text=sel?sel.toString().trim():"",!text){showToast("Seleccion\xE1 texto primero");return}}else if(scope==="para"){const sel=window.getSelection();if(sel&&sel.rangeCount){const node=sel.getRangeAt(0).startContainer;let p=node.nodeType===3?node.parentElement:node;for(;p&&!/^(P|H[1-6]|LI|BLOCKQUOTE)$/.test(p.tagName);)p=p.parentElement;text=p?p.innerText:ed?ed.innerText:""}}else text=ed?ed.innerText:"";if(!text.trim()){showToast("No hay texto para leer");return}WC_TTS.speak(text,{rate,pitch})}function openCostaRicaMap(){const old=document.getElementById("__mapPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__mapPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px";const provinces={SJ:{name:"San Jos\xE9",capital:"San Jos\xE9",pop:"1,404,242",area:"4,966 km\xB2",color:"#003da5"},AL:{name:"Alajuela",capital:"Alajuela",pop:"969,125",area:"9,757 km\xB2",color:"#1565c0"},CA:{name:"Cartago",capital:"Cartago",pop:"536,986",area:"3,124 km\xB2",color:"#0288d1"},HE:{name:"Heredia",capital:"Heredia",pop:"477,331",area:"2,657 km\xB2",color:"#0097a7"},GU:{name:"Guanacaste",capital:"Liberia",pop:"361,200",area:"10,141 km\xB2",color:"#27ae60"},PU:{name:"Puntarenas",capital:"Puntarenas",pop:"408,169",area:"11,277 km\xB2",color:"#f39c12"},LI:{name:"Lim\xF3n",capital:"Lim\xF3n",pop:"388,326",area:"9,188 km\xB2",color:"#ce1126"}};ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
        \u{1F1E8}\u{1F1F7} Mapa de Costa Rica
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">7 provincias \xB7 Toca para ver info \xB7 Insertar en documento</div>

      <!-- SVG simplificado de Costa Rica -->
      <div style="background:linear-gradient(180deg,#87CEEB,#B0E2FF);border-radius:12px;padding:12px;margin-bottom:14px;position:relative">
        <svg viewBox="0 0 400 280" style="width:100%;display:block" id="__crMap">
          <!-- Guanacaste (NO) -->
          <path d="M40,40 L110,30 L130,60 L120,110 L80,120 L40,100 Z"
            fill="${provinces.GU.color}" opacity="0.85" stroke="#fff" stroke-width="2"
            class="__crProv" data-prov="GU" style="cursor:pointer;transition:opacity .2s"
            onmouseover="this.style.opacity='1';__crShowInfo('GU')"
            onmouseout="this.style.opacity='0.85'"/>
          <text x="75" y="80" text-anchor="middle" fill="white" font-size="10" font-weight="bold" pointer-events="none">GUA</text>

          <!-- Alajuela (N) -->
          <path d="M110,30 L200,20 L210,70 L170,90 L130,60 Z"
            fill="${provinces.AL.color}" opacity="0.85" stroke="#fff" stroke-width="2"
            class="__crProv" data-prov="AL" style="cursor:pointer;transition:opacity .2s"
            onmouseover="this.style.opacity='1';__crShowInfo('AL')"
            onmouseout="this.style.opacity='0.85'"/>
          <text x="160" y="50" text-anchor="middle" fill="white" font-size="10" font-weight="bold" pointer-events="none">ALA</text>

          <!-- Heredia (N-centro) -->
          <path d="M200,20 L250,25 L245,65 L210,70 Z"
            fill="${provinces.HE.color}" opacity="0.85" stroke="#fff" stroke-width="2"
            class="__crProv" data-prov="HE" style="cursor:pointer;transition:opacity .2s"
            onmouseover="this.style.opacity='1';__crShowInfo('HE')"
            onmouseout="this.style.opacity='0.85'"/>
          <text x="222" y="45" text-anchor="middle" fill="white" font-size="9" font-weight="bold" pointer-events="none">HER</text>

          <!-- San Jos\xE9 (centro) -->
          <path d="M130,60 L210,70 L245,65 L250,120 L200,140 L150,130 L120,110 Z"
            fill="${provinces.SJ.color}" opacity="0.85" stroke="#fff" stroke-width="2"
            class="__crProv" data-prov="SJ" style="cursor:pointer;transition:opacity .2s"
            onmouseover="this.style.opacity='1';__crShowInfo('SJ')"
            onmouseout="this.style.opacity='0.85'"/>
          <text x="185" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold" pointer-events="none">S.J.</text>

          <!-- Cartago (E-centro) -->
          <path d="M245,65 L310,60 L320,110 L250,120 Z"
            fill="${provinces.CA.color}" opacity="0.85" stroke="#fff" stroke-width="2"
            class="__crProv" data-prov="CA" style="cursor:pointer;transition:opacity .2s"
            onmouseover="this.style.opacity='1';__crShowInfo('CA')"
            onmouseout="this.style.opacity='0.85'"/>
          <text x="285" y="92" text-anchor="middle" fill="white" font-size="9" font-weight="bold" pointer-events="none">CAR</text>

          <!-- Puntarenas (O-S) -->
          <path d="M40,100 L80,120 L120,110 L150,130 L140,200 L100,230 L50,200 L30,150 Z"
            fill="${provinces.PU.color}" opacity="0.85" stroke="#fff" stroke-width="2"
            class="__crProv" data-prov="PU" style="cursor:pointer;transition:opacity .2s"
            onmouseover="this.style.opacity='1';__crShowInfo('PU')"
            onmouseout="this.style.opacity='0.85'"/>
          <text x="85" y="170" text-anchor="middle" fill="white" font-size="9" font-weight="bold" pointer-events="none">PUN</text>

          <!-- Lim\xF3n (E) -->
          <path d="M310,60 L370,50 L380,150 L330,200 L250,180 L200,140 L250,120 L320,110 Z"
            fill="${provinces.LI.color}" opacity="0.85" stroke="#fff" stroke-width="2"
            class="__crProv" data-prov="LI" style="cursor:pointer;transition:opacity .2s"
            onmouseover="this.style.opacity='1';__crShowInfo('LI')"
            onmouseout="this.style.opacity='0.85'"/>
          <text x="320" y="120" text-anchor="middle" fill="white" font-size="9" font-weight="bold" pointer-events="none">LIM</text>

          <!-- Oc\xE9anos -->
          <text x="15" y="150" fill="#5b9bd5" font-size="8" transform="rotate(-90,15,150)">Pac\xEDfico</text>
          <text x="390" y="100" fill="#5b9bd5" font-size="8" transform="rotate(90,390,100)">Atl\xE1ntico</text>
        </svg>
      </div>

      <!-- Info panel -->
      <div id="__crInfo" style="background:#f8f9ff;border-radius:12px;padding:14px;margin-bottom:14px;min-height:80px">
        <div style="color:#bbb;text-align:center;font-size:13px;padding:10px">Toca una provincia para ver informaci\xF3n</div>
      </div>

      <!-- Lista de provincias -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px">
        ${Object.entries(provinces).map(([id,p])=>`
          <button onclick="__crSelectProv('${id}')"
            style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1.5px solid #eee;border-radius:10px;cursor:pointer;background:#fafafa;transition:all .15s;text-align:left"
            onmouseover="this.style.borderColor='${p.color}';this.style.background='#f8f9ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            <div style="width:12px;height:12px;border-radius:3px;background:${p.color};flex-shrink:0"></div>
            <span style="font-size:12px;font-weight:600;color:#333">${p.name}</span>
          </button>`).join("")}
      </div>
    </div>
    <div style="padding:0 20px 20px;display:flex;gap:8px">
      <button onclick="document.getElementById('__mapPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__insertCRMap()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F1E8}\u{1F1F7} Insertar mapa</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__crProvinces=provinces}function __crShowInfo(id){const p=(window.__crProvinces||{})[id],info=document.getElementById("__crInfo");!p||!info||(info.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:16px;height:16px;border-radius:4px;background:${p.color};flex-shrink:0"></div>
      <div style="font-size:15px;font-weight:700;color:#1a2942">${p.name}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
      <div><span style="color:#888">Capital:</span> <strong>${p.capital}</strong></div>
      <div><span style="color:#888">Poblaci\xF3n:</span> <strong>${p.pop}</strong></div>
      <div><span style="color:#888">\xC1rea:</span> <strong>${p.area}</strong></div>
      <div><button onclick="__insertProvInfo('${id}')" style="padding:5px 10px;border:none;background:${p.color};color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4CB} Insertar info</button></div>
    </div>`)}function __crSelectProv(id){__crShowInfo(id),document.querySelectorAll(".__crProv").forEach(p=>{p.style.opacity=p.dataset.prov===id?"1":"0.85"})}function __insertProvInfo(id){const p=(window.__crProvinces||{})[id];if(!p)return;const html=`<div style="border-left:4px solid ${p.color};padding:10px 16px;background:#f8f9ff;border-radius:0 8px 8px 0;margin:8px 0">
    <strong style="color:${p.color}">${p.name}</strong> \u2014 Capital: ${p.capital} \xB7 Poblaci\xF3n: ${p.pop} \xB7 \xC1rea: ${p.area}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__mapPanel").remove(),showToast("Provincia "+p.name+" insertada \u2705")}function __insertCRMap(){const mapSVG=document.getElementById("__crMap");if(!mapSVG)return;const svgHTML=`<div style="text-align:center;margin:16px 0;padding:12px;background:linear-gradient(180deg,#e8f4ff,#f0f8ff);border-radius:12px;border:1px solid #c0d8f0">
    <div style="font-size:13pt;font-weight:700;color:#003da5;margin-bottom:8px">\u{1F1E8}\u{1F1F7} Costa Rica \u2014 7 Provincias</div>
    ${mapSVG.outerHTML.replace(/style="cursor:pointer[^"]*"/g,"").replace(/onmouseover="[^"]*"/g,"").replace(/onmouseout="[^"]*"/g,"").replace(/onclick="[^"]*"/g,"")}
    <div style="font-size:9px;color:#aaa;margin-top:6px">Rep\xFAblica de Costa Rica \xB7 Am\xE9rica Central</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(svgHTML),document.getElementById("__mapPanel").remove(),showToast("\u{1F1E8}\u{1F1F7} Mapa insertado \u2705")}const WC_CURRENCY={rate:null,lastUpdate:null,async fetchRate(){try{const data=await(await fetch("https://api.exchangerate-api.com/v4/latest/USD")).json();return this.rate=data.rates&&data.rates.CRC?data.rates.CRC:null,this.lastUpdate=new Date,this.rate}catch{return this.rate=519.5,this.lastUpdate=new Date,this.rate}}};function openCurrencyPanel(){const old=document.getElementById("__currPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__currPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u{1F4B1} Conversor \u20A1 / $
    </div>
    <div id="__currRate" style="font-size:12px;color:#888;margin-bottom:18px">Cargando tipo de cambio...</div>

    <!-- Convertidor -->
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
      <div style="background:#f0f7ff;border-radius:12px;padding:14px">
        <label style="font-size:11px;font-weight:700;color:#0084ff;display:block;margin-bottom:6px">D\xD3LARES ($)</label>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:20px;color:#0084ff;font-weight:700">$</span>
          <input type="number" id="__currUSD" value="100" min="0" step="0.01"
            style="flex:1;padding:10px;border:none;background:transparent;font-size:18px;font-weight:700;outline:none;color:#1a2942"
            oninput="__currConvert('usd')">
        </div>
      </div>

      <div style="text-align:center;font-size:20px;color:#888;cursor:pointer" onclick="__currSwap()" title="Invertir">\u21C5</div>

      <div style="background:#fff3e0;border-radius:12px;padding:14px">
        <label style="font-size:11px;font-weight:700;color:#e67e22;display:block;margin-bottom:6px">COLONES (\u20A1)</label>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:20px;color:#e67e22;font-weight:700">\u20A1</span>
          <input type="number" id="__currCRC" value="" min="0"
            style="flex:1;padding:10px;border:none;background:transparent;font-size:18px;font-weight:700;outline:none;color:#1a2942"
            placeholder="Calculando..."
            oninput="__currConvert('crc')">
        </div>
      </div>
    </div>

    <!-- Conversiones r\xE1pidas -->
    <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Conversiones comunes</div>
    <div id="__currQuick" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px">
      <div style="text-align:center;color:#bbb;font-size:12px;padding:10px">Cargando...</div>
    </div>

    <!-- Insertar en documento -->
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__currPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__currInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u20A1 Insertar conversi\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),WC_CURRENCY.fetchRate().then(rate=>{const rateEl=document.getElementById("__currRate");rateEl&&(rateEl.textContent=`Tipo de cambio: $1 = \u20A1${rate?rate.toFixed(2):"519.50"} \xB7 ${new Date().toLocaleDateString("es-CR")}`),__currConvert("usd"),__currBuildQuick(rate||519.5)})}function __currConvert(from){const rate=WC_CURRENCY.rate||519.5,usdEl=document.getElementById("__currUSD"),crcEl=document.getElementById("__currCRC");if(!(!usdEl||!crcEl))if(from==="usd"){const usd=parseFloat(usdEl.value)||0;crcEl.value=(usd*rate).toFixed(0)}else{const crc=parseFloat(crcEl.value)||0;usdEl.value=(crc/rate).toFixed(2)}}function __currSwap(){const usdEl=document.getElementById("__currUSD"),crcEl=document.getElementById("__currCRC");if(!usdEl||!crcEl)return;const tmp=usdEl.value;usdEl.value=(parseFloat(crcEl.value||0)/(WC_CURRENCY.rate||519.5)).toFixed(2),crcEl.value=(parseFloat(tmp||0)*(WC_CURRENCY.rate||519.5)).toFixed(0)}function __currBuildQuick(rate){const quick=document.getElementById("__currQuick");if(!quick)return;const amounts=[1,5,10,20,50,100,500,1e3];quick.innerHTML=amounts.map(usd=>`
    <div style="background:#f8f9fa;border-radius:8px;padding:8px;text-align:center;cursor:pointer;transition:background .15s"
      onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='#f8f9fa'"
      onclick="document.getElementById('__currUSD').value=${usd};__currConvert('usd')">
      <div style="font-size:12px;font-weight:700;color:#0084ff">$${usd}</div>
      <div style="font-size:11px;color:#888">\u20A1${(usd*rate).toLocaleString("es-CR",{maximumFractionDigits:0})}</div>
    </div>`).join("")}function __currInsert(){const usd=document.getElementById("__currUSD").value,crc=document.getElementById("__currCRC").value,rate=WC_CURRENCY.rate||519.5,html=`<span style="background:#f0f7ff;border-radius:4px;padding:1px 6px;font-weight:600;color:#003da5">$${parseFloat(usd).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} (\u20A1${parseFloat(crc).toLocaleString("es-CR",{maximumFractionDigits:0})})</span>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__currPanel").remove(),showToast("Conversi\xF3n insertada \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"spellCheck":openSpellPanel();break;case"imageAI":openImageGenPanel();break;case"tts":openTTSPanel();break;case"mapCR":openCostaRicaMap();break;case"currency":openCurrencyPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.8 \u2705 \u2014 Corrector, IA im\xE1genes, TTS, Mapa CR, Conversor \u20A1/$")},1600)})();function openFlowchartPanel(){const old=document.getElementById("__fcPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__fcPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:12px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:640px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2B21 Diagrama de flujo</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Escrib\xED los pasos, uno por l\xEDnea. Us\xE1 \u2192 para flechas y [] para decisiones</div>

      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        ${[["\u25AD Proceso","proceso"],["\u25C7 Decisi\xF3n","decision"],["\u2B2D Inicio/Fin","terminator"],["\u25B1 Datos","data"],["\u2192 Flecha","arrow"],["// Comentario","comment"]].map(([label,type])=>`
          <button onclick="__fcInsertSyntax('${type}')"
            style="padding:5px 10px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">${label}</button>`).join("")}
      </div>

      <textarea id="__fcCode" rows="8"
        style="width:100%;padding:12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;font-family:'Courier New',monospace;outline:none;resize:vertical;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__fcRender()"
        placeholder="Inicio
\u2193
[\xBFTiene cuenta?]
\u2192 S\xED \u2192 Iniciar sesi\xF3n
\u2192 No \u2192 Registrarse
\u2193
Bienvenido
\u2193
Fin">Inicio
\u2193
[\xBFEl proceso es correcto?]
\u2192 S\xED \u2192 Continuar al siguiente paso
\u2192 No \u2192 Revisar y corregir
\u2193
Finalizar proceso
\u2193
Fin</textarea>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Vista previa</div>
      <div id="__fcPreview" style="background:#f8f9ff;border-radius:12px;padding:16px;min-height:120px;overflow-x:auto"></div>
    </div>

    <div style="padding:14px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee">
      <button onclick="document.getElementById('__fcPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__fcInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2B21 Insertar diagrama</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(__fcRender,100)}function __fcInsertSyntax(type){const ta=document.getElementById("__fcCode");if(!ta)return;const snippets={proceso:`
Nombre del proceso`,decision:`
[\xBFCondici\xF3n?]
\u2192 S\xED \u2192 Acci\xF3n A
\u2192 No \u2192 Acci\xF3n B`,terminator:`
Inicio
...
Fin`,data:`
Datos de entrada/salida`,arrow:`
\u2193`,comment:`
// Este es un comentario`};ta.value+=snippets[type]||"",__fcRender()}function __fcRender(){const code=document.getElementById("__fcCode"),preview=document.getElementById("__fcPreview");if(!code||!preview)return;const lines=code.value.split(`
`).filter(l=>l.trim());let html=`<div style="display:flex;flex-direction:column;align-items:center;gap:0;font-family:-apple-system,'Segoe UI',sans-serif">`;lines.forEach(line=>{const l=line.trim();if(!(!l||l.startsWith("//")))if(l==="\u2193"||l==="v"||l==="|")html+='<div style="width:2px;height:24px;background:#0084ff;margin:0 auto"></div>';else if(l.startsWith("\u2192")||l.startsWith("->")){const parts=l.replace(/^→\s*|^->\s*/,"").split(/→|->/).map(s=>s.trim()),label=parts[0]||"",dest=parts[1]||"";html+=`<div style="display:flex;align-items:center;gap:8px;margin:4px 0;font-size:12px">
        <div style="width:24px;height:2px;background:#27ae60"></div>
        <div style="background:#e8f8ee;border:1.5px solid #27ae60;border-radius:4px;padding:2px 8px;color:#155724;font-weight:600">${label}</div>
        <div style="width:24px;height:2px;background:#27ae60"></div>
        <div style="font-size:11px;color:#555">${dest}</div>
      </div>`}else if(l.startsWith("[")&&l.endsWith("]")){const text=l.slice(1,-1);html+=`<div style="width:2px;height:12px;background:#0084ff;margin:0 auto"></div>
        <div style="background:#fff9e6;border:2px solid #f39c12;transform:rotate(0deg);padding:10px 20px;border-radius:4px;font-size:13px;font-weight:600;color:#856404;text-align:center;max-width:260px;clip-path:polygon(15px 0%,calc(100% - 15px) 0%,100% 50%,calc(100% - 15px) 100%,15px 100%,0% 50%)">${text}</div>`}else if(l.toLowerCase()==="inicio"||l.toLowerCase()==="fin"||l.toLowerCase()==="start"||l.toLowerCase()==="end"){const isStart=l.toLowerCase()==="inicio"||l.toLowerCase()==="start";html+=`<div style="background:${isStart?"#003da5":"#ce1126"};color:#fff;border-radius:50px;padding:10px 28px;font-size:13px;font-weight:700;text-align:center;letter-spacing:1px">${l}</div>`}else html+=`<div style="width:2px;height:12px;background:#0084ff;margin:0 auto"></div>
        <div style="background:#f0f7ff;border:2px solid #0084ff;border-radius:6px;padding:10px 20px;font-size:13px;font-weight:500;color:#1a2942;text-align:center;max-width:280px">${l}</div>`}),html+="</div>",preview.innerHTML=html}function __fcInsert(){const code=document.getElementById("__fcCode").value.trim(),preview=document.getElementById("__fcPreview");if(!preview||!code){showToast("Escrib\xED los pasos del diagrama");return}const html=`<div style="margin:16px 0;padding:16px;background:#f8f9ff;border:1.5px solid #c0d8f0;border-radius:14px;text-align:center">
    <div style="font-size:11px;color:#0084ff;font-weight:700;letter-spacing:1px;margin-bottom:12px;text-transform:uppercase">\u2B21 Diagrama de flujo</div>
    ${preview.innerHTML}
    <div style="font-size:9px;color:#bbb;margin-top:12px">WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__fcPanel").remove(),showToast("\u2B21 Diagrama insertado \u2705")}const WC_SIGN={certificates:JSON.parse(localStorage.getItem("wc-signatures")||"[]"),save(cert){this.certificates.unshift(cert),this.certificates.length>10&&this.certificates.pop(),localStorage.setItem("wc-signatures",JSON.stringify(this.certificates))},generate(name,role,org,signatureDataUrl){const now=new Date;return{id:this._simpleHash(name+now.toISOString()+Math.random()),name,role,org,timestamp:now.toISOString(),dateStr:now.toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),timeStr:now.toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),signature:signatureDataUrl,valid:!0}},_simpleHash(str){let h=0;for(let i=0;i<str.length;i++)h=Math.imul(31,h)+str.charCodeAt(i)|0;return Math.abs(h).toString(16).toUpperCase().padStart(8,"0")}};function openDigitalSignPanel(){const old=document.getElementById("__dsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__dsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      \u{1F510} Firma digital con timestamp
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
      <input type="text" id="__dsName" placeholder="Nombre completo *"
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        value="${WC_FIELDS&&WC_FIELDS.data.autor?WC_FIELDS.data.autor:""}">
      <input type="text" id="__dsRole" placeholder="Cargo / Funci\xF3n"
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        value="${WC_FIELDS&&WC_FIELDS.data.cargo?WC_FIELDS.data.cargo:""}">
      <input type="text" id="__dsOrg" placeholder="Organizaci\xF3n / Empresa"
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        value="${WC_FIELDS&&WC_FIELDS.data.empresa?WC_FIELDS.data.empresa:""}">
    </div>

    <div style="font-size:12px;font-weight:600;color:#555;margin-bottom:8px">Firma manuscrita (opcional)</div>
    <canvas id="__dsCanvas" style="width:100%;height:130px;border:2px dashed #0084ff;border-radius:10px;cursor:crosshair;touch-action:none;background:#fafafa;display:block;margin-bottom:8px"></canvas>
    <div style="display:flex;gap:6px;margin-bottom:16px">
      <button onclick="__dsClearCanvas()" style="padding:6px 14px;border:1.5px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F5D1} Limpiar</button>
      <button onclick="__dsDrawSample()" style="padding:6px 14px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u270D Muestra</button>
    </div>

    <div style="background:#f0fff4;border:1.5px solid #27ae60;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#155724">
      <div style="font-weight:700;margin-bottom:4px">\u{1F510} Timestamp autom\xE1tico</div>
      <div id="__dsTimestamp" style="font-family:'Courier New',monospace;font-size:11px">${new Date().toLocaleString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
    </div>

    ${WC_SIGN.certificates.length>0?`
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Firmas anteriores</div>
      ${WC_SIGN.certificates.slice(0,3).map(c=>`
        <div style="display:flex;align-items:center;gap:8px;padding:8px;background:#fafafa;border-radius:8px;margin-bottom:6px;cursor:pointer"
          onclick="__dsUsePrevious('${c.id}')">
          <div style="font-size:11px;flex:1;color:#555">${c.name} \xB7 ${c.dateStr.substring(0,15)}</div>
          <div style="font-size:10px;background:#f0f7ff;color:#0084ff;padding:2px 7px;border-radius:4px;font-weight:600">${c.id}</div>
        </div>`).join("")}
    </div>`:""}

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__dsPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__dsInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F510} Firmar documento</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(__dsInitCanvas,100),setInterval(()=>{const ts=document.getElementById("__dsTimestamp");ts&&(ts.textContent=new Date().toLocaleString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}))},1e3)}let __dsCtx=null,__dsDrawing=!1;function __dsInitCanvas(){const canvas=document.getElementById("__dsCanvas");if(!canvas)return;canvas.width=canvas.offsetWidth,canvas.height=130,__dsCtx=canvas.getContext("2d"),__dsCtx.strokeStyle="#1a2942",__dsCtx.lineWidth=2,__dsCtx.lineCap="round",__dsCtx.lineJoin="round";const getPos=(e,c)=>{const r=c.getBoundingClientRect(),src=e.touches?e.touches[0]:e;return{x:src.clientX-r.left,y:src.clientY-r.top}};canvas.addEventListener("mousedown",e=>{__dsDrawing=!0;const p=getPos(e,canvas);__dsCtx.beginPath(),__dsCtx.moveTo(p.x,p.y)}),canvas.addEventListener("mousemove",e=>{if(!__dsDrawing)return;const p=getPos(e,canvas);__dsCtx.lineTo(p.x,p.y),__dsCtx.stroke()}),canvas.addEventListener("mouseup",()=>__dsDrawing=!1),canvas.addEventListener("mouseleave",()=>__dsDrawing=!1),canvas.addEventListener("touchstart",e=>{e.preventDefault(),__dsDrawing=!0;const p=getPos(e,canvas);__dsCtx.beginPath(),__dsCtx.moveTo(p.x,p.y)},{passive:!1}),canvas.addEventListener("touchmove",e=>{if(e.preventDefault(),!__dsDrawing)return;const p=getPos(e,canvas);__dsCtx.lineTo(p.x,p.y),__dsCtx.stroke()},{passive:!1}),canvas.addEventListener("touchend",()=>__dsDrawing=!1)}function __dsClearCanvas(){const canvas=document.getElementById("__dsCanvas");canvas&&__dsCtx&&__dsCtx.clearRect(0,0,canvas.width,canvas.height)}function __dsDrawSample(){const canvas=document.getElementById("__dsCanvas"),name=document.getElementById("__dsName").value||"Firma";!canvas||!__dsCtx||(__dsCtx.clearRect(0,0,canvas.width,canvas.height),__dsCtx.font='italic 36px "Times New Roman", serif',__dsCtx.fillStyle="#1a2942",__dsCtx.fillText(name.split(" ").map(w=>w[0]).join("")+" "+(name.split(" ")[0]||""),20,80),__dsCtx.beginPath(),__dsCtx.moveTo(20,100),__dsCtx.lineTo(canvas.width-20,100),__dsCtx.strokeStyle="#1a2942",__dsCtx.lineWidth=1,__dsCtx.stroke())}function __dsInsert(){const name=document.getElementById("__dsName").value.trim();if(!name){showToast("Ingres\xE1 tu nombre");return}const role=document.getElementById("__dsRole").value.trim(),org=document.getElementById("__dsOrg").value.trim(),canvas=document.getElementById("__dsCanvas"),sigImg=canvas?canvas.toDataURL("image/png"):"",cert=WC_SIGN.generate(name,role,org,sigImg);WC_SIGN.save(cert);const html=`
  <div style="border:1.5px solid #27ae60;border-radius:12px;padding:16px;margin:16px 0;background:#f0fff4;max-width:400px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <span style="font-size:20px">\u{1F510}</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#155724">Documento firmado digitalmente</div>
        <div style="font-size:10px;color:#27ae60;font-weight:600">HASH: ${cert.id}</div>
      </div>
    </div>
    ${sigImg&&sigImg!=="data:,"?`<img src="${sigImg}" style="max-width:180px;max-height:60px;display:block;margin-bottom:8px;border-bottom:1px solid #27ae60;padding-bottom:4px">`:""}
    <div style="font-size:12px;color:#1a2942;line-height:1.8">
      <strong>${name}</strong>${role?"<br>"+role:""}${org?"<br>"+org:""}
    </div>
    <div style="font-size:10px;color:#888;margin-top:8px;font-family:'Courier New',monospace">
      \u{1F4C5} ${cert.dateStr}<br>\u23F0 ${cert.timeStr}<br>\u{1F511} ${cert.id}
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__dsPanel").remove(),showToast("\u{1F510} Firma digital insertada \u2705")}function __dsUsePrevious(id){const cert=WC_SIGN.certificates.find(c=>c.id===id);cert&&(document.getElementById("__dsName").value=cert.name,document.getElementById("__dsRole").value=cert.role||"",document.getElementById("__dsOrg").value=cert.org||"")}function openPlagiarismPanel(){const old=document.getElementById("__plagPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__plagPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const ed=document.getElementById("editor"),docText=ed?ed.innerText.trim():"";ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:6px">\u{1F50D} Detector de similitud</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Compara el documento con un texto de referencia y detecta frases similares</div>

    <div style="margin-bottom:14px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">Texto de referencia (pega aqu\xED el original)</label>
      <textarea id="__plagRef" rows="6"
        style="width:100%;padding:11px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;resize:vertical;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        placeholder="Pega aqu\xED el texto original con el que quer\xE9s comparar..."></textarea>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px">Sensibilidad</label>
        <select id="__plagSens" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          <option value="3">Alta (3+ palabras)</option>
          <option value="5" selected>Media (5+ palabras)</option>
          <option value="8">Baja (8+ palabras)</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px">Documento</label>
        <div style="padding:8px;background:#f8f9fa;border-radius:8px;font-size:12px;color:#555">
          ${docText.split(/\s+/).filter(w=>w).length} palabras
        </div>
      </div>
    </div>

    <div id="__plagResults" style="display:none"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__plagPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runPlagCheck()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F50D} Analizar similitud</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __runPlagCheck(){const refText=document.getElementById("__plagRef").value.trim(),minLen=parseInt(document.getElementById("__plagSens").value),ed=document.getElementById("editor"),docText=ed?ed.innerText.trim():"",results=document.getElementById("__plagResults");if(!refText){showToast("Peg\xE1 el texto de referencia");return}if(!docText){showToast("El documento est\xE1 vac\xEDo");return}const refWords=refText.toLowerCase().replace(/[^\wáéíóúñüÁÉÍÓÚÑÜ\s]/g," ").split(/\s+/).filter(w=>w.length>2),docWords=docText.toLowerCase().replace(/[^\wáéíóúñüÁÉÍÓÚÑÜ\s]/g," ").split(/\s+/).filter(w=>w.length>2),docSentences=docText.split(/[.!?]+/).filter(s=>s.trim().length>10),matches=[],refSet=new Set(refWords);let matchedWords=0;docSentences.forEach(sentence=>{const sWords=sentence.toLowerCase().replace(/[^\wáéíóúñüÁÉÍÓÚÑÜ\s]/g," ").split(/\s+/).filter(w=>w.length>2);let hits=sWords.filter(w=>refSet.has(w)).length;const pct=sWords.length>0?hits/sWords.length:0;pct>.4&&sWords.length>=minLen&&(matches.push({text:sentence.trim().substring(0,120),pct:Math.round(pct*100),words:sWords.length}),matchedWords+=hits)});const totalPct=docWords.length>0?Math.round(matchedWords/docWords.length*100):0,risk=totalPct>40?"Alto":totalPct>20?"Medio":"Bajo",riskColor=totalPct>40?"#e74c3c":totalPct>20?"#f39c12":"#27ae60";results.style.display="block",results.innerHTML=`
    <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:14px">
      <div style="font-size:14px;font-weight:700;color:#1a2942;margin-bottom:12px">\u{1F4CA} Resultado del an\xE1lisis</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="text-align:center;background:#fff;border-radius:10px;padding:10px">
          <div style="font-size:24px;font-weight:800;color:${riskColor}">${totalPct}%</div>
          <div style="font-size:11px;color:#888">Similitud</div>
        </div>
        <div style="text-align:center;background:#fff;border-radius:10px;padding:10px">
          <div style="font-size:24px;font-weight:800;color:${riskColor}">${risk}</div>
          <div style="font-size:11px;color:#888">Riesgo</div>
        </div>
        <div style="text-align:center;background:#fff;border-radius:10px;padding:10px">
          <div style="font-size:24px;font-weight:800;color:#555">${matches.length}</div>
          <div style="font-size:11px;color:#888">Frases similares</div>
        </div>
      </div>
      <div style="height:10px;background:#eee;border-radius:5px;overflow:hidden">
        <div style="height:100%;width:${Math.min(totalPct,100)}%;background:${riskColor};border-radius:5px;transition:width 1s"></div>
      </div>
    </div>
    ${matches.length>0?`
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">Frases similares encontradas</div>
      ${matches.slice(0,5).map(m=>`
        <div style="background:#fff9e6;border-left:3px solid ${m.pct>60?"#e74c3c":"#f39c12"};padding:8px 12px;margin-bottom:6px;border-radius:0 8px 8px 0;font-size:12px">
          <div style="color:#555">"${m.text}${m.text.length>=120?"...":""}"</div>
          <div style="font-size:10px;color:#e67e22;margin-top:4px;font-weight:600">Similitud: ${m.pct}% \xB7 ${m.words} palabras</div>
        </div>`).join("")}
    </div>`:'<div style="text-align:center;color:#27ae60;padding:12px;font-size:13px;font-weight:600">\u2705 No se encontraron frases altamente similares</div>'}`}function openCCSSCalendar(){const old=document.getElementById("__ccssPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ccssPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const year=new Date().getFullYear(),months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],rates={patrono:{salud:9.25,pension:3.84,riesgos:.5,garantias:3,ins:1,total:17.59},trabajador:{salud:5.5,pension:2.67,banco:1,total:9.17}};ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
        \u{1F3E5} Cargas Sociales CCSS ${year}
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">Tasas vigentes \xB7 Costa Rica</div>

      <!-- Tasas -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div style="background:#f0f7ff;border-radius:12px;padding:14px;border:1.5px solid #c0d8f0">
          <div style="font-size:11px;font-weight:700;color:#0084ff;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">\u{1F454} Patrono</div>
          ${Object.entries(rates.patrono).filter(([k])=>k!=="total").map(([k,v])=>`
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span style="color:#555">${k.charAt(0).toUpperCase()+k.slice(1)}</span>
              <span style="font-weight:600">${v}%</span>
            </div>`).join("")}
          <div style="border-top:1px solid #c0d8f0;margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700;color:#003da5">
            <span>TOTAL</span><span>${rates.patrono.total}%</span>
          </div>
        </div>
        <div style="background:#fff3e0;border-radius:12px;padding:14px;border:1.5px solid #ffcc80">
          <div style="font-size:11px;font-weight:700;color:#e67e22;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">\u{1F477} Trabajador</div>
          ${Object.entries(rates.trabajador).filter(([k])=>k!=="total").map(([k,v])=>`
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span style="color:#555">${k.charAt(0).toUpperCase()+k.slice(1)}</span>
              <span style="font-weight:600">${v}%</span>
            </div>`).join("")}
          <div style="border-top:1px solid #ffcc80;margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700;color:#e67e22">
            <span>TOTAL</span><span>${rates.trabajador.total}%</span>
          </div>
        </div>
      </div>

      <!-- Calculadora -->
      <div style="background:#f8f9fa;border-radius:12px;padding:14px;margin-bottom:16px">
        <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:10px">\u{1F4B0} Calculadora de cargas</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:16px;font-weight:700;color:#e67e22">\u20A1</span>
          <input type="number" id="__ccssSalary" placeholder="Salario bruto mensual"
            style="flex:1;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
            oninput="__ccssCalc()">
        </div>
        <div id="__ccssResult" style="font-size:12px;color:#555;line-height:1.8"></div>
      </div>

      <!-- Calendario de pagos -->
      <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px">\u{1F4C5} Fechas de pago ${year}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px">
        ${months.map((m,i)=>{const payDay=new Date(year,i+1,0);for(;payDay.getDay()===0||payDay.getDay()===6;)payDay.setDate(payDay.getDate()-1);const isPast=payDay<new Date;return`<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:${isPast?"#f8f9fa":"#f0fff4"};border:1px solid ${isPast?"#eee":"#27ae60"}">
            <div style="font-size:11px;font-weight:700;color:${isPast?"#aaa":"#27ae60"};min-width:20px">${(i+1).toString().padStart(2,"0")}</div>
            <div>
              <div style="font-size:11px;font-weight:600;color:${isPast?"#888":"#155724"}">${m}</div>
              <div style="font-size:10px;color:#aaa">Hasta: ${payDay.toLocaleDateString("es-CR",{day:"numeric",month:"short"})}</div>
            </div>
            ${isPast?'<span style="font-size:9px;color:#aaa;margin-left:auto">\u2713</span>':""}
          </div>`}).join("")}
      </div>
    </div>
    <div style="padding:0 20px 20px;display:flex;gap:8px">
      <button onclick="document.getElementById('__ccssPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__ccssInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar tabla CCSS</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __ccssCalc(){const salary=parseFloat(document.getElementById("__ccssSalary").value)||0,res=document.getElementById("__ccssResult");if(!res||!salary)return;const patrono=salary*.1759,trabajador=salary*.0917,total=patrono+trabajador,neto=salary-trabajador;res.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div><span style="color:#0084ff">Aporte patronal:</span><br><strong>\u20A1${patrono.toLocaleString("es-CR",{maximumFractionDigits:0})}</strong></div>
      <div><span style="color:#e67e22">Aporte trabajador:</span><br><strong>\u20A1${trabajador.toLocaleString("es-CR",{maximumFractionDigits:0})}</strong></div>
      <div><span style="color:#e74c3c">Costo total empresa:</span><br><strong>\u20A1${(salary+patrono).toLocaleString("es-CR",{maximumFractionDigits:0})}</strong></div>
      <div><span style="color:#27ae60">Salario neto:</span><br><strong>\u20A1${neto.toLocaleString("es-CR",{maximumFractionDigits:0})}</strong></div>
    </div>`}function __ccssInsert(){const year=new Date().getFullYear(),html=`<div style="margin:16px 0">
    <h3 style="color:#003da5;margin-bottom:10px">\u{1F3E5} Cargas Sociales CCSS \u2014 Costa Rica ${year}</h3>
    <table style="border-collapse:collapse;width:100%;font-size:11pt">
      <tr style="background:#003da5;color:#fff">
        <th style="padding:8px;border:1px solid #002080;text-align:left">Rubro</th>
        <th style="padding:8px;border:1px solid #002080;text-align:center">Patrono</th>
        <th style="padding:8px;border:1px solid #002080;text-align:center">Trabajador</th>
      </tr>
      <tr><td style="padding:7px 8px;border:1px solid #ddd">Seguro de Salud (SEM)</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">9.25%</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">5.50%</td></tr>
      <tr style="background:#f8f9fa"><td style="padding:7px 8px;border:1px solid #ddd">Pensi\xF3n IVM</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">3.84%</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">2.67%</td></tr>
      <tr><td style="padding:7px 8px;border:1px solid #ddd">Banco Popular</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">\u2014</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">1.00%</td></tr>
      <tr style="background:#f8f9fa"><td style="padding:7px 8px;border:1px solid #ddd">Riesgos del Trabajo (INS)</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">1.00%</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">\u2014</td></tr>
      <tr><td style="padding:7px 8px;border:1px solid #ddd">Fondo Garant\xEDas Sociales</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">3.00%</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">\u2014</td></tr>
      <tr><td style="padding:7px 8px;border:1px solid #ddd">ASFA / CCSS Adicional</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">0.50%</td><td style="padding:7px 8px;border:1px solid #ddd;text-align:center">\u2014</td></tr>
      <tr style="background:#003da5;color:#fff;font-weight:700">
        <td style="padding:8px;border:1px solid #002080">TOTAL</td>
        <td style="padding:8px;border:1px solid #002080;text-align:center">17.59%</td>
        <td style="padding:8px;border:1px solid #002080;text-align:center">9.17%</td>
      </tr>
    </table>
    <p style="font-size:9pt;color:#888;margin-top:6px">Fuente: CCSS Costa Rica ${year} \xB7 Total empleador + trabajador = 26.76%</p>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__ccssPanel").remove(),showToast("Tabla CCSS insertada \u2705")}function openInvoicePanel(){const old=document.getElementById("__invPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__invPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:12px";const now=new Date;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:94vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F9FE} Factura Electr\xF3nica CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">Formato Hacienda CR \xB7 v4.3</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">N\xB0 Factura</label>
          <input type="text" id="__invNum" value="FE-${now.getFullYear()}-${String(Math.floor(Math.random()*9e3)+1e3)}"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Fecha</label>
          <input type="date" id="__invDate" value="${now.toISOString().split("T")[0]}"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
      </div>

      <div style="font-size:11px;font-weight:700;color:#0084ff;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Emisor</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <input type="text" id="__invEmisor" placeholder="Nombre / Raz\xF3n social *"
          style="padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;grid-column:1/-1"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          value="${WC_FIELDS&&WC_FIELDS.data.empresa?WC_FIELDS.data.empresa:""}">
        <input type="text" id="__invCedulaE" placeholder="C\xE9dula / RUC *"
          style="padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__invActEco" placeholder="Actividad econ\xF3mica"
          style="padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="font-size:11px;font-weight:700;color:#e67e22;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Receptor</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <input type="text" id="__invReceptor" placeholder="Nombre del cliente"
          style="padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;grid-column:1/-1"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__invCedulaR" placeholder="C\xE9dula receptor"
          style="padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="email" id="__invEmail" placeholder="Correo electr\xF3nico"
          style="padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">L\xEDneas de detalle</div>
      <div id="__invLines">
        ${[1,2,3].map(i=>`
        <div style="display:grid;grid-template-columns:3fr 1fr 1fr;gap:6px;margin-bottom:6px">
          <input type="text" class="__invDesc" placeholder="Descripci\xF3n del servicio/producto"
            style="padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
          <input type="number" class="__invQty" placeholder="Cant." value="1" min="0" step="0.01"
            style="padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box;text-align:center"
            oninput="__invCalc()">
          <input type="number" class="__invPrice" placeholder="Precio \u20A1" min="0" step="1"
            style="padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box;text-align:right"
            oninput="__invCalc()">
        </div>`).join("")}
      </div>

      <div style="display:flex;gap:8px;margin-bottom:14px">
        <button onclick="__invAddLine()" style="padding:7px 14px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ L\xEDnea</button>
        <select id="__invIVA" onchange="__invCalc()" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="13">IVA 13% (general)</option>
          <option value="4">IVA 4% (medicamentos)</option>
          <option value="2">IVA 2% (canasta b\xE1sica)</option>
          <option value="1">IVA 1% (especial)</option>
          <option value="0">Exento (0%)</option>
        </select>
        <select id="__invMoneda" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="CRC">\u20A1 CRC</option>
          <option value="USD">$ USD</option>
        </select>
      </div>

      <div id="__invTotals" style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:16px;font-size:13px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Subtotal:</span><span id="__invSub">\u20A10</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>IVA:</span><span id="__invIVAamt">\u20A10</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;border-top:1px solid #ddd;margin-top:8px;padding-top:8px"><span>TOTAL:</span><span id="__invTotal" style="color:#003da5">\u20A10</span></div>
      </div>

      <textarea id="__invNotes" rows="2" placeholder="Condiciones de pago / Notas adicionales..."
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;margin-bottom:16px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
    </div>
    <div style="padding:0 20px 20px;display:flex;gap:8px">
      <button onclick="document.getElementById('__invPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__invGenerate()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F9FE} Generar factura</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __invAddLine(){const container=document.getElementById("__invLines");if(!container)return;const div=document.createElement("div");div.style.cssText="display:grid;grid-template-columns:3fr 1fr 1fr;gap:6px;margin-bottom:6px",div.innerHTML=`
    <input type="text" class="__invDesc" placeholder="Descripci\xF3n"
      style="padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
      onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    <input type="number" class="__invQty" placeholder="Cant." value="1" min="0" step="0.01"
      style="padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box;text-align:center"
      oninput="__invCalc()">
    <input type="number" class="__invPrice" placeholder="Precio" min="0"
      style="padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box;text-align:right"
      oninput="__invCalc()">`,container.appendChild(div)}function __invCalc(){const descs=document.querySelectorAll(".__invDesc"),qtys=document.querySelectorAll(".__invQty"),prices=document.querySelectorAll(".__invPrice"),ivaRate=parseFloat(document.getElementById("__invIVA").value)/100,sym=document.getElementById("__invMoneda").value==="USD"?"$":"\u20A1";let sub=0;qtys.forEach((q,i)=>{const qty=parseFloat(q.value)||0,price=parseFloat(prices[i].value)||0;sub+=qty*price});const iva=sub*ivaRate,total=sub+iva,fmt=n=>sym+n.toLocaleString("es-CR",{maximumFractionDigits:0}),subEl=document.getElementById("__invSub"),ivaEl=document.getElementById("__invIVAamt"),totalEl=document.getElementById("__invTotal");subEl&&(subEl.textContent=fmt(sub)),ivaEl&&(ivaEl.textContent=fmt(iva)),totalEl&&(totalEl.textContent=fmt(total))}function __invGenerate(){const num=document.getElementById("__invNum").value,date=document.getElementById("__invDate").value,emisor=document.getElementById("__invEmisor").value,cedulaE=document.getElementById("__invCedulaE").value,actEco=document.getElementById("__invActEco").value,receptor=document.getElementById("__invReceptor").value,cedulaR=document.getElementById("__invCedulaR").value,email=document.getElementById("__invEmail").value,notes=document.getElementById("__invNotes").value,ivaRate=parseFloat(document.getElementById("__invIVA").value),sym=document.getElementById("__invMoneda").value==="USD"?"$":"\u20A1";if(!emisor){showToast("Ingres\xE1 el nombre del emisor");return}const descs=document.querySelectorAll(".__invDesc"),qtys=document.querySelectorAll(".__invQty"),prices=document.querySelectorAll(".__invPrice"),fmt=n=>sym+n.toLocaleString("es-CR",{maximumFractionDigits:0});let sub=0,linesHTML="";descs.forEach((d,i)=>{const desc=d.value.trim();if(!desc)return;const qty=parseFloat(qtys[i].value)||1,price=parseFloat(prices[i].value)||0,line=qty*price;sub+=line,linesHTML+=`<tr>
      <td style="padding:7px 8px;border:1px solid #ddd;font-size:10pt">${desc}</td>
      <td style="padding:7px 8px;border:1px solid #ddd;text-align:center;font-size:10pt">${qty}</td>
      <td style="padding:7px 8px;border:1px solid #ddd;text-align:right;font-size:10pt">${fmt(price)}</td>
      <td style="padding:7px 8px;border:1px solid #ddd;text-align:right;font-size:10pt;font-weight:600">${fmt(line)}</td>
    </tr>`});const iva=sub*ivaRate/100,total=sub+iva,dateStr=new Date(date+"T12:00:00").toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"}),html=`
  <div style="font-family:Calibri,Arial,sans-serif;font-size:10pt;border:1px solid #ddd;border-radius:8px;overflow:hidden;margin:16px 0;max-width:600px">
    <!-- Header -->
    <div style="background:#003da5;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-size:16pt;font-weight:700">FACTURA ELECTR\xD3NICA</div>
        <div style="opacity:.8;font-size:10pt">Rep\xFAblica de Costa Rica \xB7 v4.3</div>
      </div>
      <div style="text-align:right;font-size:9pt;opacity:.9">
        <div style="font-size:13pt;font-weight:700">${num}</div>
        <div>${dateStr}</div>
      </div>
    </div>
    <!-- Emisor / Receptor -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border-bottom:1px solid #ddd">
      <div style="padding:12px 16px;border-right:1px solid #ddd">
        <div style="font-size:9pt;font-weight:700;color:#003da5;margin-bottom:4px;text-transform:uppercase">Emisor</div>
        <div style="font-weight:600;font-size:11pt">${emisor}</div>
        ${cedulaE?`<div style="color:#555;font-size:9pt">C\xE9dula: ${cedulaE}</div>`:""}
        ${actEco?`<div style="color:#555;font-size:9pt">${actEco}</div>`:""}
      </div>
      <div style="padding:12px 16px">
        <div style="font-size:9pt;font-weight:700;color:#e67e22;margin-bottom:4px;text-transform:uppercase">Receptor</div>
        <div style="font-weight:600;font-size:11pt">${receptor||"Consumidor final"}</div>
        ${cedulaR?`<div style="color:#555;font-size:9pt">C\xE9dula: ${cedulaR}</div>`:""}
        ${email?`<div style="color:#555;font-size:9pt">${email}</div>`:""}
      </div>
    </div>
    <!-- Detalle -->
    <table style="border-collapse:collapse;width:100%">
      <tr style="background:#f0f7ff">
        <th style="padding:8px;border:1px solid #ddd;text-align:left;font-size:9pt;color:#003da5">Descripci\xF3n</th>
        <th style="padding:8px;border:1px solid #ddd;text-align:center;font-size:9pt;color:#003da5">Cant.</th>
        <th style="padding:8px;border:1px solid #ddd;text-align:right;font-size:9pt;color:#003da5">P. Unit.</th>
        <th style="padding:8px;border:1px solid #ddd;text-align:right;font-size:9pt;color:#003da5">Total</th>
      </tr>
      ${linesHTML}
    </table>
    <!-- Totales -->
    <div style="padding:12px 16px;background:#f8f9fa;border-top:1px solid #ddd">
      <div style="display:flex;justify-content:flex-end;gap:20px;font-size:10pt">
        <div style="text-align:right">
          <div style="margin-bottom:4px">Subtotal: <strong>${fmt(sub)}</strong></div>
          <div style="margin-bottom:4px">IVA ${ivaRate}%: <strong>${fmt(iva)}</strong></div>
          <div style="font-size:13pt;font-weight:700;color:#003da5;border-top:1px solid #ccc;padding-top:6px">TOTAL: ${fmt(total)}</div>
        </div>
      </div>
    </div>
    ${notes?`<div style="padding:10px 16px;border-top:1px solid #ddd;font-size:9pt;color:#555;background:#fffef5">${notes}</div>`:""}
    <div style="padding:8px 16px;background:#003da5;color:rgba(255,255,255,.7);font-size:8pt;text-align:center">
      Documento electr\xF3nico generado por WC Corporate Editor \xB7 ${new Date().toLocaleString("es-CR")}
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__invPanel").remove(),showToast("\u{1F9FE} Factura electr\xF3nica generada \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"flowchart":openFlowchartPanel();break;case"digitalSign":openDigitalSignPanel();break;case"plagiarism":openPlagiarismPanel();break;case"ccssCalendar":openCCSSCalendar();break;case"invoice":openInvoicePanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.9 \u2705 \u2014 Diagrama flujo, Firma digital, Plagio, CCSS, Factura CR")},1700)})();const WC_FLOW={nodes:[],connections:[],selected:null,dragging:null,connecting:null,nodeCount:0,nodeTypes:{start:{label:"Inicio/Fin",shape:"pill",bg:"#003da5",color:"#fff",w:120,h:44},process:{label:"Proceso",shape:"rect",bg:"#f0f7ff",color:"#1a2942",border:"#0084ff",w:150,h:50},decision:{label:"Decisi\xF3n",shape:"diamond",bg:"#fff9e6",color:"#856404",border:"#f39c12",w:140,h:70},data:{label:"Datos",shape:"parallelogram",bg:"#f0fff4",color:"#155724",border:"#27ae60",w:140,h:50},document:{label:"Documento",shape:"document",bg:"#f5f0ff",color:"#4a235a",border:"#9b59b6",w:140,h:54},connector:{label:"Conector",shape:"circle",bg:"#fff3e0",color:"#856404",border:"#e67e22",w:60,h:60}},addNode(type,x,y){const t=this.nodeTypes[type];this.nodeCount++;const node={id:"n"+this.nodeCount,type,x,y,label:t.label+" "+this.nodeCount,w:t.w,h:t.h};return this.nodes.push(node),this.render(),node},addConnection(fromId,toId,label){this.connections.push({from:fromId,to:toId,label:label||""}),this.render()},deleteNode(id){this.nodes=this.nodes.filter(n=>n.id!==id),this.connections=this.connections.filter(c=>c.from!==id&&c.to!==id),this.selected=null,this.render()},render(){const canvas=document.getElementById("__fcCanvas");if(!canvas)return;const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height),ctx.strokeStyle="#f0f0f5",ctx.lineWidth=1;for(let x=0;x<canvas.width;x+=20)ctx.beginPath(),ctx.moveTo(x,0),ctx.lineTo(x,canvas.height),ctx.stroke();for(let y=0;y<canvas.height;y+=20)ctx.beginPath(),ctx.moveTo(0,y),ctx.lineTo(canvas.width,y),ctx.stroke();this.connections.forEach(c=>{const from=this.nodes.find(n=>n.id===c.from),to=this.nodes.find(n=>n.id===c.to);if(!from||!to)return;const x1=from.x+from.w/2,y1=from.y+from.h,x2=to.x+to.w/2,y2=to.y;ctx.strokeStyle="#0084ff",ctx.lineWidth=2,ctx.setLineDash([]),ctx.beginPath(),ctx.moveTo(x1,y1),ctx.bezierCurveTo(x1,y1+40,x2,y2-40,x2,y2),ctx.stroke();const angle=Math.atan2(y2-(y2-20),x2-x2);ctx.fillStyle="#0084ff",ctx.beginPath(),ctx.moveTo(x2,y2),ctx.lineTo(x2-6,y2-10),ctx.lineTo(x2+6,y2-10),ctx.closePath(),ctx.fill(),c.label&&(ctx.fillStyle="#e67e22",ctx.font="bold 11px -apple-system,sans-serif",ctx.fillText(c.label,(x1+x2)/2+4,(y1+y2)/2))}),this.nodes.forEach(node=>{const t=this.nodeTypes[node.type],x=node.x,y=node.y,w=node.w,h=node.h,isSelected=this.selected===node.id;if(ctx.save(),isSelected&&(ctx.shadowColor="#0084ff",ctx.shadowBlur=12),ctx.fillStyle=t.bg,ctx.strokeStyle=isSelected?"#0084ff":t.border||t.bg,ctx.lineWidth=isSelected?3:1.5,node.type==="start"){const r=h/2;ctx.beginPath(),ctx.moveTo(x+r,y),ctx.lineTo(x+w-r,y),ctx.arc(x+w-r,y+r,r,-Math.PI/2,Math.PI/2),ctx.lineTo(x+r,y+h),ctx.arc(x+r,y+r,r,Math.PI/2,-Math.PI/2),ctx.closePath()}else node.type==="decision"?(ctx.beginPath(),ctx.moveTo(x+w/2,y),ctx.lineTo(x+w,y+h/2),ctx.lineTo(x+w/2,y+h),ctx.lineTo(x,y+h/2),ctx.closePath()):node.type==="connector"?(ctx.beginPath(),ctx.arc(x+w/2,y+h/2,Math.min(w,h)/2,0,Math.PI*2)):node.type==="data"?(ctx.beginPath(),ctx.moveTo(x+12,y),ctx.lineTo(x+w,y),ctx.lineTo(x+w-12,y+h),ctx.lineTo(x,y+h),ctx.closePath()):node.type==="document"?(ctx.beginPath(),ctx.moveTo(x,y),ctx.lineTo(x+w,y),ctx.lineTo(x+w,y+h-8),ctx.bezierCurveTo(x+w*.75,y+h-8,x+w*.5,y+h+4,x+w*.25,y+h-8),ctx.bezierCurveTo(x,y+h-8,x,y+h-16,x,y+h-8),ctx.closePath()):(ctx.beginPath(),ctx.moveTo(x+8,y),ctx.lineTo(x+w-8,y),ctx.arc(x+w-8,y+8,8,-Math.PI/2,0),ctx.lineTo(x+w,y+h-8),ctx.arc(x+w-8,y+h-8,8,0,Math.PI/2),ctx.lineTo(x+8,y+h),ctx.arc(x+8,y+h-8,8,Math.PI/2,Math.PI),ctx.lineTo(x,y+8),ctx.arc(x+8,y+8,8,Math.PI,-Math.PI/2),ctx.closePath());ctx.fill(),ctx.stroke(),ctx.restore(),ctx.fillStyle=t.color,ctx.font="bold 12px -apple-system,sans-serif",ctx.textAlign="center",ctx.textBaseline="middle";const lines=node.label.split(`
`);lines.forEach((line,i)=>{ctx.fillText(line,x+w/2,y+h/2+(i-(lines.length-1)/2)*14,w-10)}),isSelected&&[[x+w/2,y],[x+w,y+h/2],[x+w/2,y+h],[x,y+h/2]].forEach(([px,py])=>{ctx.fillStyle="#0084ff",ctx.beginPath(),ctx.arc(px,py,5,0,Math.PI*2),ctx.fill()})})}};function openAdvancedFlowchart(){const old=document.getElementById("__fcAdvPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__fcAdvPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:12px",WC_FLOW.nodes=[],WC_FLOW.connections=[],WC_FLOW.selected=null,WC_FLOW.nodeCount=0,ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:700px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:14px 16px;border-bottom:1px solid #eee;flex-shrink:0">
      <div style="font-size:16px;font-weight:700;color:#1a2942;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">
        <span>\u2B21 Diagrama de flujo avanzado</span>
        <button onclick="document.getElementById('__fcAdvPanel').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#aaa">\u2715</button>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${Object.entries(WC_FLOW.nodeTypes).map(([type,t])=>`
          <button onclick="__fcAddNodeCenter('${type}')"
            style="padding:6px 12px;border:2px solid ${t.border||t.bg};background:${t.bg};color:${t.color};border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform=''">
            + ${t.label}
          </button>`).join("")}
        <span style="width:1px;background:#eee;margin:0 4px"></span>
        <button onclick="__fcConnectMode()" id="__fcConnBtn"
          style="padding:6px 12px;border:2px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600">
          \u{1F517} Conectar
        </button>
        <button onclick="__fcDeleteSelected()"
          style="padding:6px 12px;border:2px solid #fde8e8;background:#fde8e8;color:#e74c3c;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600">
          \u{1F5D1} Eliminar
        </button>
        <button onclick="__fcClear()"
          style="padding:6px 12px;border:2px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#888">
          \u2715 Limpiar
        </button>
      </div>
    </div>

    <div style="position:relative;flex:1;overflow:hidden;background:#f8f9ff">
      <canvas id="__fcCanvas" style="display:block;cursor:default"></canvas>
      <div id="__fcEditBox" style="display:none;position:absolute;background:#fff;border:2px solid #0084ff;border-radius:10px;padding:10px;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:10">
        <input type="text" id="__fcNodeLabel" style="width:160px;padding:6px 10px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter')__fcSaveLabel()">
        <button onclick="__fcSaveLabel()" style="padding:6px 10px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;margin-left:6px">\u2713</button>
      </div>
    </div>

    <div style="padding:12px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <div style="font-size:11px;color:#aaa;flex:1;display:flex;align-items:center">
        \u{1F4A1} Arrastr\xE1 los nodos \xB7 Doble toque para editar texto \xB7 Conectar para unir nodos
      </div>
      <button onclick="__fcInsertDiagram()" style="padding:10px 22px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">
        \u2B21 Insertar diagrama
      </button>
    </div>
  </div>`,document.body.appendChild(ov),setTimeout(()=>{const canvas=document.getElementById("__fcCanvas"),container=canvas.parentElement;canvas.width=container.offsetWidth,canvas.height=Math.max(400,container.offsetHeight),WC_FLOW.addNode("start",canvas.width/2-60,30),WC_FLOW.addNode("process",canvas.width/2-75,120),WC_FLOW.addNode("decision",canvas.width/2-70,220),WC_FLOW.addNode("start",canvas.width/2-60,350),WC_FLOW.nodes[3].label="Fin",WC_FLOW.addConnection("n1","n2",""),WC_FLOW.addConnection("n2","n3",""),WC_FLOW.addConnection("n3","n4","S\xED"),WC_FLOW.render(),__fcInitInteraction(canvas)},100)}function __fcInitInteraction(canvas){let dragNode=null,dragOffX=0,dragOffY=0,connectMode=!1,connectFrom=null,lastTap=0;function getNode(x,y){return WC_FLOW.nodes.slice().reverse().find(n=>x>=n.x&&x<=n.x+n.w&&y>=n.y&&y<=n.y+n.h)}function getXY(e){const r=canvas.getBoundingClientRect(),src=e.touches?e.touches[0]:e;return{x:src.clientX-r.left,y:src.clientY-r.top}}canvas.addEventListener("mousedown",e=>{const{x,y}=getXY(e),node=getNode(x,y);if(connectMode&&node){if(!connectFrom)connectFrom=node.id,canvas.style.cursor="crosshair";else if(connectFrom!==node.id){const label=prompt("Etiqueta de la flecha (opcional):","")||"";WC_FLOW.addConnection(connectFrom,node.id,label),connectFrom=null,connectMode=!1,canvas.style.cursor="default",document.getElementById("__fcConnBtn").style.background="#fafafa"}return}node?(WC_FLOW.selected=node.id,dragNode=node,dragOffX=x-node.x,dragOffY=y-node.y,WC_FLOW.render()):(WC_FLOW.selected=null,WC_FLOW.render())}),canvas.addEventListener("mousemove",e=>{if(!dragNode)return;const{x,y}=getXY(e);dragNode.x=Math.max(0,Math.min(canvas.width-dragNode.w,x-dragOffX)),dragNode.y=Math.max(0,Math.min(canvas.height-dragNode.h,y-dragOffY)),WC_FLOW.render()}),canvas.addEventListener("mouseup",()=>{dragNode=null}),canvas.addEventListener("mouseleave",()=>{dragNode=null}),canvas.addEventListener("dblclick",e=>{const{x,y}=getXY(e),node=getNode(x,y);if(!node)return;WC_FLOW.selected=node.id;const box=document.getElementById("__fcEditBox"),inp=document.getElementById("__fcNodeLabel");box.style.display="block",box.style.left=node.x+node.w+8+"px",box.style.top=node.y+"px",inp.value=node.label,inp.focus(),box.dataset.nodeId=node.id}),canvas.addEventListener("touchstart",e=>{e.preventDefault();const{x,y}=getXY(e),node=getNode(x,y),now=Date.now();if(node&&now-lastTap<300){const box=document.getElementById("__fcEditBox"),inp=document.getElementById("__fcNodeLabel");box.style.display="block",box.style.left=Math.min(node.x+node.w+8,canvas.width-180)+"px",box.style.top=node.y+"px",inp.value=node.label,inp.focus(),box.dataset.nodeId=node.id}else node&&(WC_FLOW.selected=node.id,dragNode=node,dragOffX=x-node.x,dragOffY=y-node.y,WC_FLOW.render());lastTap=now},{passive:!1}),canvas.addEventListener("touchmove",e=>{if(e.preventDefault(),!dragNode)return;const{x,y}=getXY(e);dragNode.x=Math.max(0,Math.min(canvas.width-dragNode.w,x-dragOffX)),dragNode.y=Math.max(0,Math.min(canvas.height-dragNode.h,y-dragOffY)),WC_FLOW.render()},{passive:!1}),canvas.addEventListener("touchend",()=>{dragNode=null})}function __fcAddNodeCenter(type){const canvas=document.getElementById("__fcCanvas");if(!canvas)return;const t=WC_FLOW.nodeTypes[type];WC_FLOW.addNode(type,canvas.width/2-t.w/2,canvas.height/2-t.h/2+(Math.random()*60-30))}function __fcConnectMode(){const btn=document.getElementById("__fcConnBtn"),connectMode=btn.style.background==="rgb(240, 247, 255)";btn.style.background=connectMode?"#fafafa":"#f0f7ff",btn.style.borderColor=connectMode?"#eee":"#0084ff",WC_FLOW._connectMode=!connectMode,showToast(connectMode?"Modo conexi\xF3n desactivado":"\u{1F517} Toca dos nodos para conectar")}function __fcDeleteSelected(){WC_FLOW.selected?(WC_FLOW.deleteNode(WC_FLOW.selected),showToast("Nodo eliminado")):showToast("Seleccion\xE1 un nodo primero")}function __fcClear(){confirm("\xBFLimpiar el diagrama?")&&(WC_FLOW.nodes=[],WC_FLOW.connections=[],WC_FLOW.selected=null,WC_FLOW.nodeCount=0,WC_FLOW.render())}function __fcSaveLabel(){const box=document.getElementById("__fcEditBox"),inp=document.getElementById("__fcNodeLabel"),node=WC_FLOW.nodes.find(n=>n.id===box.dataset.nodeId);node&&(node.label=inp.value,WC_FLOW.render()),box.style.display="none"}function __fcInsertDiagram(){const canvas=document.getElementById("__fcCanvas");if(!canvas||!WC_FLOW.nodes.length){showToast("Agreg\xE1 al menos un nodo");return}const html=`<div style="text-align:center;margin:16px 0;padding:12px;background:#f8f9ff;border:1.5px solid #c0d8f0;border-radius:14px">
    <div style="font-size:10px;color:#0084ff;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">\u2B21 Diagrama de flujo</div>
    <img src="${canvas.toDataURL("image/png")}" style="max-width:100%;border-radius:8px" alt="Diagrama de flujo">
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__fcAdvPanel").remove(),showToast("\u2B21 Diagrama insertado \u2705")}const WC_IMG_GALLERY=[{cat:"\u{1F33F} Naturaleza CR",items:[{icon:"\u{1F98B}",name:"Mariposa Morpho",prompt:"Blue Morpho butterfly Costa Rica rainforest, macro photography"},{icon:"\u{1F438}",name:"Rana venenosa",prompt:"Poison dart frog Costa Rica, bright colors, macro"},{icon:"\u{1F99C}",name:"Tuc\xE1n",prompt:"Toucan bird Costa Rica, tropical forest, colorful beak"},{icon:"\u{1F406}",name:"Jaguar",prompt:"Jaguar Costa Rica jungle, wild cat, dramatic lighting"},{icon:"\u{1F422}",name:"Tortuga baula",prompt:"Leatherback sea turtle nesting Costa Rica beach, night"},{icon:"\u{1F9A5}",name:"Perezoso",prompt:"Sloth hanging tree Costa Rica, cute, rainforest"},{icon:"\u{1F33A}",name:"Orqu\xEDdea Guaria",prompt:"Guaria Morada orchid Costa Rica, national flower, purple"},{icon:"\u{1F334}",name:"Palma real",prompt:"Royal palm tree Costa Rica, tropical, blue sky"}]},{cat:"\u{1F3D4}\uFE0F Paisajes CR",items:[{icon:"\u{1F30B}",name:"Arenal",prompt:"Arenal Volcano Costa Rica at sunset, lava glow, dramatic"},{icon:"\u{1F30A}",name:"Playa Caribe",prompt:"Caribbean beach Costa Rica, turquoise water, palm trees"},{icon:"\u{1F3D6}\uFE0F",name:"Playa Pac\xEDfico",prompt:"Pacific coast Costa Rica, sunset, waves, golden sand"},{icon:"\u2601\uFE0F",name:"Monteverde",prompt:"Monteverde cloud forest Costa Rica, misty, green, magical"},{icon:"\u{1F4A7}",name:"Catarata",prompt:"Waterfall Costa Rica jungle, La Paz, lush vegetation"},{icon:"\u{1F33F}",name:"Bosque lluvioso",prompt:"Costa Rica rainforest canopy, aerial view, biodiversity"},{icon:"\u2615",name:"Cafetal",prompt:"Coffee plantation Costa Rica, red berries, mountain"},{icon:"\u{1F3D8}\uFE0F",name:"Pueblo CR",prompt:"Traditional Costa Rica village, colonial architecture, colorful"}]},{cat:"\u{1F3A8} Arte y Cultura",items:[{icon:"\u{1F3AD}",name:"Diablitos Boruca",prompt:"Boruca indigenous mask dance Costa Rica, traditional, colorful"},{icon:"\u{1F3AA}",name:"Carreta t\xEDpica",prompt:"Costa Rica traditional oxcart carretas, painted, colorful wheels"},{icon:"\u{1F3DB}\uFE0F",name:"Teatro Nacional",prompt:"National Theater Costa Rica San Jose, neoclassical, gold"},{icon:"\u{1F33F}",name:"Arte Bribri",prompt:"Bribri indigenous art Costa Rica, geometric patterns, traditional"},{icon:"\u{1F37D}\uFE0F",name:"Gallo pinto",prompt:"Gallo pinto Costa Rica breakfast, rice beans, food photography"},{icon:"\u{1F3C6}",name:"Escudo CR",prompt:"Costa Rica coat of arms, detailed illustration, official"}]},{cat:"\u{1F4BC} Corporativo",items:[{icon:"\u{1F4CA}",name:"Reuni\xF3n",prompt:"Professional business meeting Costa Rica, modern office, diverse team"},{icon:"\u{1F4BB}",name:"Tecnolog\xEDa",prompt:"Tech startup Costa Rica, coding, modern workspace, innovation"},{icon:"\u{1F331}",name:"Sostenibilidad",prompt:"Green sustainability Costa Rica, eco business, solar panels forest"},{icon:"\u{1F91D}",name:"Negocios",prompt:"Business handshake professional Costa Rica, confident, modern"},{icon:"\u{1F4F1}",name:"Digital",prompt:"Digital transformation Costa Rica, smartphone, technology, future"},{icon:"\u{1F3D7}\uFE0F",name:"Infraestructura",prompt:"Infrastructure Costa Rica, construction, development, modern"}]}];function openImageGalleryPanel(){const old=document.getElementById("__imgGalPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__imgGalPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:12px";let catHTML="";WC_IMG_GALLERY.forEach(cat=>{catHTML+=`<div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px">${cat.cat}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        ${cat.items.map(item=>`
          <button onclick="__imgGalSelect(this,'${item.prompt.replace(/'/g,"\\'")}')"
            style="padding:10px 6px;border:2px solid #eee;border-radius:10px;cursor:pointer;background:#fafafa;transition:all .15s;text-align:center"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
            onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
            <div style="font-size:22px;margin-bottom:4px">${item.icon}</div>
            <div style="font-size:10px;font-weight:600;color:#555;line-height:1.2">${item.name}</div>
          </button>`).join("")}
      </div>
    </div>`}),ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 18px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3A8} Galer\xEDa IA \u2014 Costa Rica</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">${WC_IMG_GALLERY.reduce((a,c)=>a+c.items.length,0)} estilos \xB7 Pollinations AI \xB7 Sin API Key</div>
      <input type="text" id="__imgGalCustom" placeholder="O escrib\xED tu propio prompt..."
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:14px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 18px">
      ${catHTML}
    </div>
    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <div id="__imgGalSelected" style="font-size:12px;color:#0084ff;margin-bottom:10px;min-height:16px"></div>
      <div style="display:flex;gap:8px">
        <select id="__imgGalSize" style="padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="512x512">Cuadrado</option>
          <option value="768x512" selected>Horizontal</option>
          <option value="512x768">Vertical</option>
        </select>
        <select id="__imgGalStyle" style="flex:1;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="">Auto</option>
          <option value="photorealistic">Foto real</option>
          <option value="watercolor painting">Acuarela</option>
          <option value="oil painting">\xD3leo</option>
          <option value="digital art">Arte digital</option>
          <option value="pencil sketch">Boceto</option>
          <option value="flat design illustration">Ilustraci\xF3n</option>
        </select>
        <button onclick="__imgGalInsert()" style="padding:9px 18px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F3A8} Insertar</button>
      </div>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__imgGalPrompt=""}function __imgGalSelect(btn,prompt2){window.__imgGalPrompt=prompt2,document.querySelectorAll('[onclick^="__imgGalSelect"]').forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1";const sel=document.getElementById("__imgGalSelected");sel&&(sel.textContent="\u2713 "+prompt2.substring(0,60)+"...")}function __imgGalInsert(){const prompt2=document.getElementById("__imgGalCustom").value.trim()||window.__imgGalPrompt;if(!prompt2){showToast("Seleccion\xE1 una imagen o escrib\xED un prompt");return}const size=document.getElementById("__imgGalSize").value,style=document.getElementById("__imgGalStyle").value,full=prompt2+(style?", "+style:"")+", high quality",[w,h]=size.split("x"),seed=Math.floor(Math.random()*9999),html=`<p style="text-align:center"><img src="${`https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=${w}&height=${h}&seed=${seed}&nologo=true`}" style="max-width:100%;border-radius:10px;margin:8px 0" alt="${prompt2.substring(0,40)}" loading="lazy"><br><em style="font-size:9px;color:#aaa">${prompt2.substring(0,50)}...</em></p>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__imgGalPanel").remove(),showToast("\u{1F3A8} Imagen insertada \u2705")}async function translateInline(){const sel=window.getSelection(),text=sel?sel.toString().trim():"";if(!text){showToast("Seleccion\xE1 el texto a traducir");return}if(!localStorage.getItem("wc-groq-key")){showToast("Configur\xE1 tu API Key de Groq en el panel IA \u{1F999}");return}showToast("\u{1F310} Traduciendo...");const old=document.getElementById("__transPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__transPanel",ov.style.cssText="position:fixed;bottom:140px;left:50%;transform:translateX(-50%);z-index:100000;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.25);padding:16px;max-width:92vw;width:420px;",ov.innerHTML=`
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <div style="font-size:13px;font-weight:700;color:#1a2942">\u{1F310} Traducci\xF3n</div>
    <button onclick="document.getElementById('__transPanel').remove()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#aaa">\u2715</button>
  </div>
  <div style="font-size:12px;color:#888;background:#f8f9fa;border-radius:8px;padding:8px 10px;margin-bottom:10px;max-height:60px;overflow:hidden">${text.substring(0,120)}${text.length>120?"...":""}</div>
  <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
    ${[["\u{1F1EC}\u{1F1E7} Ingl\xE9s","English"],["\u{1F1F5}\u{1F1F9} Portugu\xE9s","Portuguese"],["\u{1F1EB}\u{1F1F7} Franc\xE9s","French"],["\u{1F1E9}\u{1F1EA} Alem\xE1n","German"],["\u{1F1EE}\u{1F1F9} Italiano","Italian"],["\u{1F33F} Bribri","Bribri indigenous language of Costa Rica"]].map(([label,lang])=>`
      <button onclick="__doTranslate('${lang}',this)"
        style="padding:5px 10px;border:1.5px solid #eee;background:#fafafa;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
        onmouseover="this.style.borderColor='#0084ff'" onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
        ${label}
      </button>`).join("")}
  </div>
  <div id="__transResult" style="font-size:13px;color:#1a2942;background:#f0f7ff;border-radius:8px;padding:10px;min-height:40px;margin-bottom:10px">
    Seleccion\xE1 un idioma...
  </div>
  <div style="display:flex;gap:6px">
    <button onclick="__transReplace()" style="flex:1;padding:8px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u21A9 Reemplazar</button>
    <button onclick="__transInsertAfter()" style="flex:1;padding:8px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Insertar abajo</button>
  </div>`,document.body.appendChild(ov),window.__transOriginal=text,window.__transResult=""}async function __doTranslate(lang,btn){document.querySelectorAll('[onclick^="__doTranslate"]').forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1";const res=document.getElementById("__transResult");res.textContent="\u23F3 Traduciendo...",res.style.color="#aaa";const key=localStorage.getItem("wc-groq-key");try{const translated=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Translate the following text to "+lang+". Return ONLY the translation, no explanations, no quotes."},{role:"user",content:window.__transOriginal}],temperature:.2,max_tokens:500})})).json())?.choices?.[0]?.message?.content||"";res.textContent=translated,res.style.color="#1a2942",window.__transResult=translated}catch(e){res.textContent="Error: "+e.message,res.style.color="#e74c3c"}}function __transReplace(){if(!window.__transResult){showToast("Seleccion\xE1 un idioma primero");return}document.execCommand("insertText",!1,window.__transResult),document.getElementById("__transPanel").remove(),showToast("Texto reemplazado \u2705")}function __transInsertAfter(){if(!window.__transResult){showToast("Seleccion\xE1 un idioma primero");return}const html=`<p style="color:#0066cc;border-left:3px solid #0084ff;padding-left:8px;font-style:italic">${window.__transResult}</p>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__transPanel").remove(),showToast("Traducci\xF3n insertada \u2705")}document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="T"&&(e.preventDefault(),translateInline())});const CR_CANTONES={"San Jos\xE9":["San Jos\xE9","Escaz\xFA","Desamparados","Puriscal","Tarraz\xFA","Aserr\xED","Mora","Goicoechea","Santa Ana","Alajuelita","V\xE1squez de Coronado","Acosta","Tib\xE1s","Moravia","Montes de Oca","Turrubares","Dota","Curridabat","P\xE9rez Zeled\xF3n","Le\xF3n Cort\xE9s"],Alajuela:["Alajuela","San Ram\xF3n","Grecia","San Mateo","Atenas","Naranjo","Palmares","Po\xE1s","Orotina","San Carlos","Zarcero","Sarch\xED","Upala","Los Chiles","Guatuso","R\xEDo Cuarto"],Cartago:["Cartago","Para\xEDso","La Uni\xF3n","Jim\xE9nez","Turrialba","Alvarado","Oreamuno","El Guarco"],Heredia:["Heredia","Barva","Santo Domingo","Santa B\xE1rbara","San Rafael","San Isidro","Bel\xE9n","Flores","San Pablo","Sarapiqu\xED"],Guanacaste:["Liberia","Nicoya","Santa Cruz","Bagaces","Carrillo","Ca\xF1as","Abangares","Tilar\xE1n","Nandayure","La Cruz","Hojancha"],Puntarenas:["Puntarenas","Esparza","Buenos Aires","Montes de Oro","Osa","Quepos","Golfito","Coto Brus","Parrita","Corredores","Garabito","Monteverde"],Lim\u00F3n:["Lim\xF3n","Pococ\xED","Siquirres","Talamanca","Matina","Gu\xE1cimo"]};function openCantonsMap(){const old=document.getElementById("__cantPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__cantPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px";const provColors={"San Jos\xE9":"#003da5",Alajuela:"#1565c0",Cartago:"#0288d1",Heredia:"#0097a7",Guanacaste:"#27ae60",Puntarenas:"#f39c12",Lim\u00F3n:"#ce1126"};let totalCantones=Object.values(CR_CANTONES).reduce((a,c)=>a+c.length,0),provListHTML=Object.entries(CR_CANTONES).map(([prov,cantones])=>`
    <div style="margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 10px;background:${provColors[prov]}15;border-radius:8px;margin-bottom:6px"
        onclick="__cantToggle('${prov}')">
        <div style="width:12px;height:12px;background:${provColors[prov]};border-radius:3px;flex-shrink:0"></div>
        <div style="font-weight:700;color:#1a2942;flex:1">${prov}</div>
        <div style="font-size:11px;color:#888">${cantones.length} cantones</div>
        <div id="__cantArrow_${prov.replace(/\s/g,"_")}" style="font-size:12px;color:#aaa;transition:transform .2s">\u25BC</div>
      </div>
      <div id="__cantList_${prov.replace(/\s/g,"_")}" style="display:none;padding:0 10px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
          ${cantones.map((c,i)=>`
            <div style="font-size:12px;color:#555;padding:4px 8px;border-radius:6px;cursor:pointer;transition:background .15s"
              onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background=''"
              onclick="__cantInsert('${c}','${prov}')">
              <span style="color:${provColors[prov]};font-weight:700;margin-right:4px">${i+1}.</span>${c}
            </div>`).join("")}
        </div>
      </div>
    </div>`).join("");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:520px;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 18px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F1E8}\u{1F1F7} Costa Rica \u2014 Cantones</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">7 provincias \xB7 ${totalCantones} cantones \xB7 Toca para insertar</div>
      <input type="text" id="__cantSearch" placeholder="Buscar cant\xF3n..."
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:14px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__cantSearch(this.value)">
    </div>
    <div id="__cantContent" style="flex:1;overflow-y:auto;padding:0 18px 18px">
      ${provListHTML}
    </div>
    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0;display:flex;gap:8px">
      <button onclick="document.getElementById('__cantPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__cantInsertTable()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar tabla completa</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __cantToggle(prov){const key=prov.replace(/\s/g,"_"),list=document.getElementById("__cantList_"+key),arr=document.getElementById("__cantArrow_"+key);if(!list)return;const isOpen=list.style.display!=="none";list.style.display=isOpen?"none":"block",arr&&(arr.style.transform=isOpen?"":"rotate(180deg)")}function __cantSearch(q){const query=q.toLowerCase(),content=document.getElementById("__cantContent");if(content){if(!query){content.querySelectorAll('[id^="__cantList_"]').forEach(el=>el.style.display="none");return}Object.entries(CR_CANTONES).forEach(([prov,cantones])=>{const key=prov.replace(/\s/g,"_"),list=document.getElementById("__cantList_"+key),arr=document.getElementById("__cantArrow_"+key);cantones.filter(c=>c.toLowerCase().includes(query)).length>0?(list&&(list.style.display="block"),arr&&(arr.style.transform="rotate(180deg)")):list&&(list.style.display="none")})}}function __cantInsert(canton,prov){const color={"San Jos\xE9":"#003da5",Alajuela:"#1565c0",Cartago:"#0288d1",Heredia:"#0097a7",Guanacaste:"#27ae60",Puntarenas:"#f39c12",Lim\u00F3n:"#ce1126"}[prov]||"#0084ff";typeof insertHTML=="function"&&insertHTML(`<span style="background:${color}18;border:1px solid ${color}44;border-radius:4px;padding:1px 7px;font-weight:600;color:${color}">${canton}, ${prov}</span>`),document.getElementById("__cantPanel").remove(),showToast(canton+" insertado \u2705")}function __cantInsertTable(){const provColors={"San Jos\xE9":"#003da5",Alajuela:"#1565c0",Cartago:"#0288d1",Heredia:"#0097a7",Guanacaste:"#27ae60",Puntarenas:"#f39c12",Lim\u00F3n:"#ce1126"};let rows="";Object.entries(CR_CANTONES).forEach(([prov,cantones])=>{const color=provColors[prov];rows+=`<tr><td style="padding:8px;border:1px solid #ddd;background:${color};color:#fff;font-weight:700">${prov}</td><td style="padding:8px;border:1px solid #ddd;font-size:11px">${cantones.join(", ")}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;font-weight:700">${cantones.length}</td></tr>`});const total=Object.values(CR_CANTONES).reduce((a,c)=>a+c.length,0),html=`<div style="margin:16px 0"><h3 style="color:#003da5;margin-bottom:8px">\u{1F1E8}\u{1F1F7} Divisi\xF3n Territorial de Costa Rica</h3>
    <table style="border-collapse:collapse;width:100%;font-size:11pt">
      <tr style="background:#003da5;color:#fff"><th style="padding:8px;border:1px solid #002080;text-align:left">Provincia</th><th style="padding:8px;border:1px solid #002080;text-align:left">Cantones</th><th style="padding:8px;border:1px solid #002080">N\xB0</th></tr>
      ${rows}
      <tr style="background:#f8f9fa;font-weight:700"><td colspan="2" style="padding:8px;border:1px solid #ddd">Total</td><td style="padding:8px;border:1px solid #ddd;text-align:center">${total}</td></tr>
    </table>
    <p style="font-size:9pt;color:#888;margin-top:4px">Fuente: Instituto Geogr\xE1fico Nacional \xB7 Costa Rica</p></div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__cantPanel").remove(),showToast("Tabla de cantones insertada \u2705")}async function exportInvoicePDF(){const ed=document.getElementById("editor");if(!ed)return;const invoice=ed.querySelector('[style*="Factura Electr\xF3nica"], [style*="003da5"]');showToast("Generando PDF de factura...");try{if(typeof html2canvas>"u"||typeof window.jspdf>"u"){const printHTML=`<!DOCTYPE html><html><head><meta charset="UTF-8">
        <style>
          body{font-family:Calibri,Arial;margin:1cm;font-size:10pt;}
          @media print{@page{margin:1.5cm;size:A4;}body{margin:0;}}
          table{border-collapse:collapse;width:100%;}
          td,th{border:1px solid #ddd;padding:6px 8px;}
        </style>
      </head><body>${invoice?invoice.outerHTML:ed.innerHTML}</body></html>`;typeof wcPrintHTML=="function"&&wcPrintHTML(printHTML),showToast("Imprim\xED como PDF desde el di\xE1logo");return}const jsPDF=window.jspdf.jsPDF,target=invoice||ed,canvas=await html2canvas(target,{scale:2,backgroundColor:"#ffffff",useCORS:!0,ignoreElements:el=>el.tagName==="BUTTON"}),img=canvas.toDataURL("image/jpeg",.95),pdf=new jsPDF("p","mm","a4"),pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight(),iw=pw-20,ih=canvas.height*iw/canvas.width;pdf.setFontSize(8),pdf.setTextColor(150,150,150),pdf.text("FACTURA ELECTR\xD3NICA \xB7 Rep\xFAblica de Costa Rica \xB7 WC Corporate Editor",pw/2,8,{align:"center"}),pdf.addImage(img,"JPEG",10,14,iw,ih),pdf.text(`Generado: ${new Date().toLocaleString("es-CR")} \xB7 Documento v\xE1lido para efectos fiscales`,pw/2,ph-6,{align:"center"});const numEl=target.querySelector?target.querySelector('[style*="font-size:13pt"]'):null,num=numEl?numEl.textContent.trim():"factura";pdf.save("factura-"+num+".pdf"),showToast("\u{1F4C4} PDF de factura generado \u2705")}catch(e){showToast("Error: "+e.message)}}function __addPDFButtonToInvoice(){const origGen=window.__invGenerate;origGen&&(window.__invGenerate=function(){origGen(),setTimeout(()=>{const ed=document.getElementById("editor");if(!ed)return;const lastInv=ed.querySelector('[style*="Factura Electr\xF3nica"]');if(lastInv&&!lastInv.querySelector(".__invPDFBtn")){const btn=document.createElement("button");btn.className="__invPDFBtn",btn.textContent="\u{1F4C4} Exportar PDF",btn.style.cssText="display:block;margin:8px auto;padding:8px 18px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;contenteditable:false",btn.onclick=exportInvoicePDF,btn.contentEditable="false",lastInv.appendChild(btn)}},500)})}(function(){setTimeout(function(){__addPDFButtonToInvoice();const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"advancedFlowchart":openAdvancedFlowchart();break;case"imageGallery":openImageGalleryPanel();break;case"translateInline":translateInline();break;case"cantonsMap":openCantonsMap();break;case"exportInvoicePDF":exportInvoicePDF();break;default:orig(a)}}),console.log("WC Corporate Editor v25.10 \u2705 \u2014 Diagrama avanzado, Galer\xEDa IA, Traducci\xF3n inline, Cantones CR, Factura PDF")},1800)})();function openCCSSExtended(){const old=document.getElementById("__ccssExtPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ccssExtPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const year=new Date().getFullYear();ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3E5} CCSS Ampliado \u2014 ${year}</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">Aguinaldo \xB7 Vacaciones \xB7 Preaviso \xB7 Cesant\xEDa \xB7 Calculadora</div>

      <!-- Tabs -->
      <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
        ${[["aguinaldo","\u{1F384} Aguinaldo"],["vacaciones","\u{1F3D6}\uFE0F Vacaciones"],["preaviso","\u{1F4CB} Preaviso"],["cesantia","\u{1F4B0} Cesant\xEDa"],["calc","\u{1F9EE} Calculadora"]].map(([id,label],i)=>`
          <button id="__ccssTab_${id}" onclick="__ccssShowTab('${id}')"
            style="padding:7px 14px;border:2px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s">
            ${label}
          </button>`).join("")}
      </div>

      <!-- Aguinaldo -->
      <div id="__ccssSection_aguinaldo">
        <div style="background:#f0fff4;border-radius:12px;padding:14px;margin-bottom:12px;border:1.5px solid #27ae60">
          <div style="font-size:13px;font-weight:700;color:#155724;margin-bottom:8px">\u{1F384} D\xE9cimo Tercer Mes (Aguinaldo)</div>
          <div style="font-size:12px;color:#555;line-height:1.8">
            <strong>Base legal:</strong> Art\xEDculo 4\xB0, Ley N\xB0 2412<br>
            <strong>Pago:</strong> Del 1\xB0 al 20 de diciembre de cada a\xF1o<br>
            <strong>C\xE1lculo:</strong> Suma de salarios recibidos entre el 1\xB0 de diciembre del a\xF1o anterior y el 30 de noviembre del a\xF1o en curso, dividida entre 12<br>
            <strong>Proporcional:</strong> Si trabaj\xF3 menos de 1 a\xF1o, se calcula proporcionalmente
          </div>
        </div>
        <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px">
          <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Calcular aguinaldo</div>
          <input type="number" id="__aguinSalario" placeholder="Salario mensual promedio \u20A1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcAguinaldo()">
          <input type="number" id="__aguinMeses" placeholder="Meses trabajados (1-12)" min="1" max="12" value="12"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcAguinaldo()">
          <div id="__aguinResult" style="font-size:13px;color:#27ae60;font-weight:700"></div>
        </div>
      </div>

      <!-- Vacaciones -->
      <div id="__ccssSection_vacaciones" style="display:none">
        <div style="background:#f0f7ff;border-radius:12px;padding:14px;margin-bottom:12px;border:1.5px solid #0084ff">
          <div style="font-size:13px;font-weight:700;color:#003da5;margin-bottom:8px">\u{1F3D6}\uFE0F Vacaciones \u2014 C\xF3digo de Trabajo CR</div>
          <div style="font-size:12px;color:#555;line-height:1.8">
            <strong>M\xEDnimo legal:</strong> 2 semanas por a\xF1o trabajado (Art. 153)<br>
            <strong>Proporcional:</strong> 1 d\xEDa por cada mes trabajado en el primer a\xF1o<br>
            <strong>Pago:</strong> Al inicio del per\xEDodo de vacaciones<br>
            <strong>Acumulaci\xF3n:</strong> Hasta 2 per\xEDodos (Art. 155)
          </div>
        </div>
        <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px">
          <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Calcular vacaciones</div>
          <input type="number" id="__vacSalario" placeholder="Salario diario \u20A1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcVacaciones()">
          <input type="number" id="__vacMeses" placeholder="Meses trabajados" min="1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcVacaciones()">
          <div id="__vacResult" style="font-size:13px;color:#0084ff;font-weight:700"></div>
        </div>
      </div>

      <!-- Preaviso -->
      <div id="__ccssSection_preaviso" style="display:none">
        <div style="background:#fff9e6;border-radius:12px;padding:14px;margin-bottom:12px;border:1.5px solid #f39c12">
          <div style="font-size:13px;font-weight:700;color:#856404;margin-bottom:8px">\u{1F4CB} Preaviso \u2014 Art. 28 C\xF3digo de Trabajo</div>
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <tr style="background:#f39c12;color:#fff"><th style="padding:6px 8px;text-align:left">Tiempo trabajado</th><th style="padding:6px 8px">Preaviso</th></tr>
            ${[["Menos de 3 meses","1 semana"],["3 meses a 6 meses","2 semanas"],["6 meses a 1 a\xF1o","1 mes"],["M\xE1s de 1 a\xF1o","1 mes"]].map(([t,p],i)=>`<tr style="background:${i%2?"#fff9e6":"#fff"}"><td style="padding:6px 8px;border:1px solid #fde8a0">${t}</td><td style="padding:6px 8px;border:1px solid #fde8a0;text-align:center;font-weight:700">${p}</td></tr>`).join("")}
          </table>
        </div>
        <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px">
          <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Calcular preaviso</div>
          <input type="number" id="__preSalario" placeholder="Salario mensual \u20A1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcPreaviso()">
          <input type="number" id="__preMeses" placeholder="Meses trabajados" min="1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcPreaviso()">
          <div id="__preResult" style="font-size:13px;color:#e67e22;font-weight:700"></div>
        </div>
      </div>

      <!-- Cesant\xEDa -->
      <div id="__ccssSection_cesantia" style="display:none">
        <div style="background:#fdf2f2;border-radius:12px;padding:14px;margin-bottom:12px;border:1.5px solid #e74c3c">
          <div style="font-size:13px;font-weight:700;color:#721c24;margin-bottom:8px">\u{1F4B0} Auxilio de Cesant\xEDa \u2014 Art. 29</div>
          <div style="font-size:12px;color:#555;line-height:1.8">
            <strong>Aplica:</strong> Despido sin justa causa o renuncia con justa causa<br>
            <strong>M\xE1ximo:</strong> 8 a\xF1os de salario escalonado<br>
            <strong>Escala:</strong> 7 d\xEDas/a\xF1o (1-3 a\xF1os) \xB7 14 d\xEDas/a\xF1o (3-6 a\xF1os) \xB7 19.5 d\xEDas/a\xF1o (6+ a\xF1os)
          </div>
        </div>
        <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px">
          <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Calcular cesant\xEDa</div>
          <input type="number" id="__cesSalario" placeholder="Salario mensual \u20A1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcCesantia()">
          <input type="number" id="__cesAnios" placeholder="A\xF1os trabajados" min="1" step="0.5"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcCesantia()">
          <div id="__cesResult" style="font-size:13px;color:#e74c3c;font-weight:700"></div>
        </div>
      </div>

      <!-- Calculadora completa -->
      <div id="__ccssSection_calc" style="display:none">
        <div style="background:#f8f9fa;border-radius:12px;padding:14px;margin-bottom:12px">
          <div style="font-size:13px;font-weight:700;color:#1a2942;margin-bottom:12px">\u{1F9EE} Calculadora integral de liquidaci\xF3n</div>
          <input type="number" id="__liqSalario" placeholder="Salario mensual bruto \u20A1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px"
            oninput="__calcLiquidacion()">
          <input type="number" id="__liqAnios" placeholder="A\xF1os trabajados" min="0" step="0.1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:12px"
            oninput="__calcLiquidacion()">
          <div id="__liqResult"></div>
        </div>
      </div>
    </div>
    <div style="padding:12px 20px 20px;display:flex;gap:8px">
      <button onclick="document.getElementById('__ccssExtPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__ccssInsertCalc()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar liquidaci\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __ccssShowTab(id){["aguinaldo","vacaciones","preaviso","cesantia","calc"].forEach(t=>{const sec=document.getElementById("__ccssSection_"+t),btn=document.getElementById("__ccssTab_"+t);sec&&(sec.style.display=t===id?"block":"none"),btn&&(btn.style.borderColor=t===id?"#003da5":"#eee",btn.style.background=t===id?"#f0f7ff":"#fafafa",btn.style.color=t===id?"#003da5":"#555")})}function __calcAguinaldo(){const sal=parseFloat(document.getElementById("__aguinSalario").value)||0,mes=parseFloat(document.getElementById("__aguinMeses").value)||12,res=document.getElementById("__aguinResult");if(!sal||!res)return;const aguinaldo=sal*Math.min(mes,12)/12;res.textContent=`Aguinaldo: \u20A1${aguinaldo.toLocaleString("es-CR",{maximumFractionDigits:0})}`}function __calcVacaciones(){const sal=parseFloat(document.getElementById("__vacSalario").value)||0,mes=parseFloat(document.getElementById("__vacMeses").value)||0,res=document.getElementById("__vacResult");if(!sal||!res)return;const dias=mes>=12?14:Math.floor(mes),pago=sal*dias;res.textContent=`D\xEDas de vacaciones: ${dias} \xB7 Pago: \u20A1${pago.toLocaleString("es-CR",{maximumFractionDigits:0})}`}function __calcPreaviso(){const sal=parseFloat(document.getElementById("__preSalario").value)||0,mes=parseFloat(document.getElementById("__preMeses").value)||0,res=document.getElementById("__preResult");if(!sal||!res)return;let dias=mes<3?7:mes<6?14:30;const pago=sal/30*dias;res.textContent=`Preaviso: ${dias} d\xEDas \xB7 \u20A1${pago.toLocaleString("es-CR",{maximumFractionDigits:0})}`}function __calcCesantia(){const sal=parseFloat(document.getElementById("__cesSalario").value)||0,anios=parseFloat(document.getElementById("__cesAnios").value)||0,res=document.getElementById("__cesResult");if(!sal||!res)return;const sdDia=sal/30;let total=0;const cap=Math.min(anios,8);cap<=3?total=sdDia*7*cap:cap<=6?total=sdDia*7*3+sdDia*14*(cap-3):total=sdDia*7*3+sdDia*14*3+sdDia*19.5*(cap-6),res.textContent=`Cesant\xEDa (${anios} a\xF1os): \u20A1${total.toLocaleString("es-CR",{maximumFractionDigits:0})}`}function __calcLiquidacion(){const sal=parseFloat(document.getElementById("__liqSalario").value)||0,anios=parseFloat(document.getElementById("__liqAnios").value)||0,res=document.getElementById("__liqResult");if(!sal||!res)return;const sdDia=sal/30,aguinaldo=sal*(anios%1||1/12),vac=sdDia*(anios>=1?14:Math.floor(anios*12)),pre=sdDia*(anios<.25?7:anios<.5?14:30),cap=Math.min(anios,8);let ces=0;cap<=3?ces=sdDia*7*cap:cap<=6?ces=sdDia*7*3+sdDia*14*(cap-3):ces=sdDia*7*3+sdDia*14*3+sdDia*19.5*(cap-6);const total=aguinaldo+vac+pre+ces,fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{maximumFractionDigits:0});res.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
      <div style="display:flex;justify-content:space-between"><span>\u{1F384} Aguinaldo:</span><strong>${fmt(aguinaldo)}</strong></div>
      <div style="display:flex;justify-content:space-between"><span>\u{1F3D6}\uFE0F Vacaciones:</span><strong>${fmt(vac)}</strong></div>
      <div style="display:flex;justify-content:space-between"><span>\u{1F4CB} Preaviso:</span><strong>${fmt(pre)}</strong></div>
      <div style="display:flex;justify-content:space-between"><span>\u{1F4B0} Cesant\xEDa:</span><strong>${fmt(ces)}</strong></div>
      <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:800;color:#003da5;border-top:2px solid #003da5;padding-top:8px;margin-top:4px"><span>TOTAL:</span><span>${fmt(total)}</span></div>
    </div>`,window.__liqData={sal,anios,aguinaldo,vac,pre,ces,total}}function __ccssInsertCalc(){const d=window.__liqData;if(!d){showToast("Complet\xE1 la calculadora primero");return}const fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{maximumFractionDigits:0}),html=`<div style="margin:16px 0;border:1px solid #003da5;border-radius:10px;overflow:hidden">
    <div style="background:#003da5;color:#fff;padding:10px 14px;font-weight:700">\u{1F4B0} Liquidaci\xF3n Laboral \u2014 Costa Rica ${new Date().getFullYear()}</div>
    <table style="border-collapse:collapse;width:100%;font-size:11pt">
      <tr><td style="padding:8px;border:1px solid #ddd">Salario mensual</td><td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(d.sal)}</td></tr>
      <tr style="background:#f8f9fa"><td style="padding:8px;border:1px solid #ddd">A\xF1os trabajados</td><td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:600">${d.anios}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd">\u{1F384} Aguinaldo proporcional</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${fmt(d.aguinaldo)}</td></tr>
      <tr style="background:#f8f9fa"><td style="padding:8px;border:1px solid #ddd">\u{1F3D6}\uFE0F Vacaciones</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${fmt(d.vac)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd">\u{1F4CB} Preaviso</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${fmt(d.pre)}</td></tr>
      <tr style="background:#f8f9fa"><td style="padding:8px;border:1px solid #ddd">\u{1F4B0} Auxilio de cesant\xEDa</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${fmt(d.ces)}</td></tr>
      <tr style="background:#003da5;color:#fff;font-weight:800;font-size:13pt"><td style="padding:10px 8px;border:1px solid #002080">TOTAL LIQUIDACI\xD3N</td><td style="padding:10px 8px;border:1px solid #002080;text-align:right">${fmt(d.total)}</td></tr>
    </table>
    <div style="padding:8px 14px;font-size:9pt;color:#888">Base: C\xF3digo de Trabajo CR \xB7 C\xE1lculo referencial</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__ccssExtPanel").remove(),showToast("Liquidaci\xF3n insertada \u2705")}let _lineNumEnabled=!1;function toggleLineNumbers(){_lineNumEnabled=!_lineNumEnabled;const ed=document.getElementById("editor");if(ed)if(_lineNumEnabled){ed.style.counterReset="line-number";let st=document.getElementById("__lineNumStyle");st||(st=document.createElement("style"),st.id="__lineNumStyle",st.textContent=`
        #editor { padding-left: 52px !important; position: relative; }
        #editor p::before, #editor div:not([class])::before,
        #editor h1::before, #editor h2::before, #editor h3::before,
        #editor li::before {
          counter-increment: wc-line;
          content: counter(wc-line);
          position: absolute;
          left: 0;
          width: 44px;
          text-align: right;
          color: #bbb;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          line-height: inherit;
          user-select: none;
          pointer-events: none;
          padding-right: 8px;
          border-right: 1px solid #eee;
        }
        #editor { counter-reset: wc-line; }
      `,document.head.appendChild(st)),showToast("Numeraci\xF3n de l\xEDneas activada")}else{const st=document.getElementById("__lineNumStyle");st&&st.remove(),ed.style.paddingLeft="",showToast("Numeraci\xF3n de l\xEDneas desactivada")}}function openFormControlsPanel(){const old=document.getElementById("__formPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__formPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const controls=[{icon:"\u2611\uFE0F",name:"Checkbox",desc:"Casilla de verificaci\xF3n",id:"checkbox"},{icon:"\u{1F518}",name:"Radio",desc:"Bot\xF3n de opci\xF3n",id:"radio"},{icon:"\u{1F4DD}",name:"Campo de texto",desc:"Entrada de texto corto",id:"input"},{icon:"\u{1F4C4}",name:"\xC1rea de texto",desc:"Entrada de texto largo",id:"textarea"},{icon:"\u{1F4CB}",name:"Dropdown",desc:"Lista desplegable",id:"select"},{icon:"\u{1F4C5}",name:"Fecha",desc:"Selector de fecha",id:"date"},{icon:"\u2B50",name:"Calificaci\xF3n",desc:"Estrellas de valoraci\xF3n",id:"rating"},{icon:"\u{1F4CA}",name:"Barra progreso",desc:"Indicador de progreso",id:"progress"},{icon:"\u{1F500}",name:"Toggle",desc:"Interruptor ON/OFF",id:"toggle"},{icon:"\u270D\uFE0F",name:"Firma",desc:"Campo de firma",id:"signature"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CB} Controles de formulario</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Insert\xE1 controles interactivos en el documento</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      ${controls.map(c=>`
        <button onclick="__insertFormControl('${c.id}')"
          style="display:flex;align-items:center;gap:10px;padding:12px;border:1.5px solid #eee;border-radius:12px;cursor:pointer;background:#fafafa;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
          <span style="font-size:22px">${c.icon}</span>
          <div>
            <div style="font-size:12px;font-weight:700;color:#1a1a1a">${c.name}</div>
            <div style="font-size:10px;color:#888">${c.desc}</div>
          </div>
        </button>`).join("")}
    </div>
    <button onclick="document.getElementById('__formPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __insertFormControl(type){const label=prompt("Etiqueta del campo:",type==="checkbox"?"Acepto los t\xE9rminos":"Campo");if(label===null)return;const controls={checkbox:`<label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;padding:6px 10px;background:#f8f9fa;border-radius:8px;border:1.5px solid #e0e0e0;margin:4px"><input type="checkbox" style="width:16px;height:16px;accent-color:#0084ff"> <span style="font-size:13px">${label}</span></label>`,radio:`<label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;padding:6px 10px;background:#f8f9fa;border-radius:8px;border:1.5px solid #e0e0e0;margin:4px"><input type="radio" name="wc-radio" style="width:16px;height:16px;accent-color:#0084ff"> <span style="font-size:13px">${label}</span></label>`,input:`<div style="margin:8px 0"><label style="font-size:12px;font-weight:600;color:#555;display:block;margin-bottom:4px">${label}</label><input type="text" placeholder="${label}..." style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;max-width:300px;box-sizing:border-box"></div>`,textarea:`<div style="margin:8px 0"><label style="font-size:12px;font-weight:600;color:#555;display:block;margin-bottom:4px">${label}</label><textarea placeholder="${label}..." rows="3" style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;max-width:400px;resize:vertical;box-sizing:border-box"></textarea></div>`,select:`<div style="margin:8px 0"><label style="font-size:12px;font-weight:600;color:#555;display:block;margin-bottom:4px">${label}</label><select style="padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;min-width:180px"><option>Opci\xF3n 1</option><option>Opci\xF3n 2</option><option>Opci\xF3n 3</option></select></div>`,date:`<div style="margin:8px 0"><label style="font-size:12px;font-weight:600;color:#555;display:block;margin-bottom:4px">${label}</label><input type="date" style="padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px"></div>`,rating:`<div style="margin:8px 0"><div style="font-size:12px;font-weight:600;color:#555;margin-bottom:4px">${label}</div><div style="font-size:28px;cursor:pointer" onclick="__rateClick(this)">${"\u2B50".repeat(5)}</div></div>`,progress:`<div style="margin:8px 0"><div style="font-size:12px;font-weight:600;color:#555;margin-bottom:4px">${label}</div><div style="background:#eee;border-radius:20px;height:12px;overflow:hidden"><div style="background:linear-gradient(90deg,#0084ff,#27ae60);height:100%;width:65%;border-radius:20px"></div></div><div style="font-size:10px;color:#888;margin-top:2px">65%</div></div>`,toggle:`<label style="display:inline-flex;align-items:center;gap:10px;cursor:pointer;padding:6px 10px;margin:4px"><span style="font-size:13px">${label}</span><div style="width:44px;height:24px;background:#0084ff;border-radius:12px;position:relative"><div style="width:20px;height:20px;background:#fff;border-radius:50%;position:absolute;top:2px;right:2px;box-shadow:0 1px 4px rgba(0,0,0,.2)"></div></div></label>`,signature:`<div style="margin:8px 0;border:2px dashed #0084ff;border-radius:10px;padding:12px;background:#f8f9ff;text-align:center;min-height:80px;cursor:pointer" onclick="this.style.background='#f0f7ff'"><div style="color:#aaa;font-size:12px;margin-top:20px">\u270D\uFE0F ${label||"Firma aqu\xED"}</div></div>`},html=controls[type]||controls.input;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__formPanel").remove(),showToast(label+" insertado \u2705")}function protectSection(){const sel=window.getSelection();if(!sel||sel.isCollapsed){showToast("Seleccion\xE1 el texto a proteger");return}const range=sel.getRangeAt(0),text=sel.toString(),span=document.createElement("span");span.className="wc-protected",span.dataset.protected="1",span.style.cssText="background:#fff9e6;border:1.5px solid #f39c12;border-radius:4px;padding:0 4px;cursor:not-allowed;user-select:none",span.title="\u{1F512} Secci\xF3n protegida \u2014 Solo lectura",span.contentEditable="false",span.textContent=text,range.deleteContents(),range.insertNode(span),sel.removeAllRanges(),showToast("\u{1F512} Secci\xF3n protegida \u2705")}function unprotectAll(){document.querySelectorAll(".wc-protected").forEach(el=>{el.replaceWith(document.createTextNode(el.textContent))}),showToast("\u{1F513} Todas las secciones desbloqueadas")}function openProtectPanel(){const ed=document.getElementById("editor"),locked=ed?ed.querySelectorAll(".wc-protected").length:0,old=document.getElementById("__protPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__protPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u{1F512} Secciones protegidas</div>
    <div style="background:#fff9e6;border-radius:12px;padding:14px;margin-bottom:16px;text-align:center">
      <div style="font-size:28px;margin-bottom:6px">\u{1F512}</div>
      <div style="font-size:20px;font-weight:800;color:#856404">${locked}</div>
      <div style="font-size:12px;color:#888">secci\xF3n${locked!==1?"es":""} protegida${locked!==1?"s":""}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <button onclick="protectSection();document.getElementById('__protPanel').remove()"
        style="padding:12px;border:none;background:#f39c12;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        \u{1F512} Proteger selecci\xF3n actual
      </button>
      <button onclick="unprotectAll();document.getElementById('__protPanel').remove()"
        style="padding:12px;border:1.5px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">
        \u{1F513} Desbloquear todo
      </button>
    </div>
    <div style="font-size:11px;color:#888;background:#f8f9fa;border-radius:8px;padding:10px;margin-bottom:14px;line-height:1.6">
      \u{1F4A1} Seleccion\xE1 texto en el documento y us\xE1 "Proteger selecci\xF3n" para evitar ediciones accidentales. El texto protegido se muestra con fondo amarillo.
    </div>
    <button onclick="document.getElementById('__protPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}let _vRulerEnabled=!1;function toggleVerticalRuler(){_vRulerEnabled=!_vRulerEnabled;const old=document.getElementById("__vRuler");if(old&&old.remove(),!_vRulerEnabled){showToast("Regla vertical ocultada");return}const ruler=document.createElement("div");ruler.id="__vRuler",ruler.style.cssText=`
    position:fixed;left:0;top:0;bottom:60px;width:22px;
    background:linear-gradient(#f0f0f5,#e8e8ec);
    border-right:1px solid #ccc;z-index:490;
    overflow:hidden;cursor:default;user-select:none;
  `;const ed=document.getElementById("editor"),pageH=1122;for(let y=0;y<3e3;y+=20){const cm=Math.round(y/37.79527559055118),tick=document.createElement("div");if(tick.style.cssText=`position:absolute;top:${y}px;left:${y%100===0?2:y%50===0?6:10}px;right:${y%100===0?2:y%50===0?8:12}px;height:1px;background:#aaa`,ruler.appendChild(tick),y%100===0&&y>0){const label=document.createElement("div");label.style.cssText=`position:absolute;top:${y+2}px;left:1px;font-size:7px;color:#888;width:20px;text-align:center`,label.textContent=cm+"cm",ruler.appendChild(label)}}const cursor=document.createElement("div");cursor.id="__vRulerCursor",cursor.style.cssText="position:absolute;left:0;right:0;height:2px;background:#0084ff;opacity:.7;pointer-events:none;z-index:1",ruler.appendChild(cursor),document.body.appendChild(ruler);const content=document.querySelector(".content");content&&(content.style.marginLeft="24px"),window.addEventListener("mousemove",__updateVRuler),window.addEventListener("scroll",__updateVRuler),showToast("Regla vertical activada")}function __updateVRuler(e){const cursor=document.getElementById("__vRulerCursor");if(!cursor)return;const y=e?e.clientY:window.scrollY%1122;cursor.style.top=y+window.scrollY+"px"}function openPasteSpecialPanel(){const old=document.getElementById("__pastePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pastePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CB} Pegar especial</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Eleg\xED c\xF3mo pegar el contenido del portapapeles</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      ${[["\u{1F4DD} Solo texto","Pega sin formato, solo el texto plano","text"],["\u{1F3A8} Con formato","Pega con todos los estilos originales","html"],["\u{1F524} Solo fuente","Pega el texto con solo la fuente actual","font"],["\u{1F4D0} Solo estructura","Conserva p\xE1rrafos pero sin colores ni fuentes","structure"],["\u{1F520} MAY\xDASCULAS","Pega el texto en may\xFAsculas","upper"],["\u{1F521} min\xFAsculas","Pega el texto en min\xFAsculas","lower"]].map(([label,desc,type])=>`
        <button onclick="__doPasteSpecial('${type}')"
          style="display:flex;align-items:center;gap:10px;padding:12px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
          <span style="font-size:20px">${label.split(" ")[0]}</span>
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1a1a">${label.substring(label.indexOf(" ")+1)}</div>
            <div style="font-size:11px;color:#888">${desc}</div>
          </div>
        </button>`).join("")}
    </div>
    <button onclick="document.getElementById('__pastePanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cancelar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __doPasteSpecial(type){document.getElementById("__pastePanel").remove();try{const text=await navigator.clipboard.readText();if(!text){showToast("Portapapeles vac\xEDo");return}let processed;switch(type){case"text":processed=text,document.execCommand("insertText",!1,text);return;case"html":document.execCommand("paste");return;case"font":document.execCommand("insertText",!1,text);return;case"structure":processed=text.replace(/\n\n+/g,"</p><p>").replace(/\n/g," ");break;case"upper":processed=text.toUpperCase();break;case"lower":processed=text.toLowerCase();break;default:processed=text}type==="structure"?typeof insertHTML=="function"&&insertHTML("<p>"+processed+"</p>"):document.execCommand("insertText",!1,processed),showToast("Pegado especial \u2705")}catch(e){showToast("Error: "+e.message)}}function openExportImagePanel(){const old=document.getElementById("__expImgPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__expImgPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:16px">\u{1F4F8} Exportar como imagen</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:12px;font-weight:600;color:#555;display:block;margin-bottom:4px">Formato</label>
        <select id="__expImgFmt" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          <option value="png">PNG (sin p\xE9rdida)</option>
          <option value="jpeg">JPG (comprimido)</option>
          <option value="webp">WebP (moderno)</option>
        </select>
      </div>
      <div>
        <label style="font-size:12px;font-weight:600;color:#555;display:block;margin-bottom:4px">Escala</label>
        <select id="__expImgScale" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none">
          <option value="1">1x (pantalla)</option>
          <option value="2" selected>2x (HD)</option>
          <option value="3">3x (retina)</option>
        </select>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="__expImgShadow" checked style="accent-color:#0084ff">
        <span style="font-size:13px;color:#555">Sombra alrededor</span>
      </label>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="__expImgBg" checked style="accent-color:#0084ff">
        <span style="font-size:13px;color:#555">Fondo blanco</span>
      </label>
    </div>
    <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#888;line-height:1.5">
      \u{1F4A1} La imagen capturar\xE1 el contenido visible del editor. Para capturar todo el documento, primero desplaz\xE1 hasta arriba.
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__expImgPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__doExportImage()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4F8} Exportar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __doExportImage(){const fmt=document.getElementById("__expImgFmt").value,scale=parseInt(document.getElementById("__expImgScale").value),shadow=document.getElementById("__expImgShadow").checked,bg=document.getElementById("__expImgBg").checked,ed=document.getElementById("editor");if(ed){document.getElementById("__expImgPanel").remove(),showToast("Generando imagen...");try{const canvas=document.createElement("canvas"),rect=ed.getBoundingClientRect();canvas.width=rect.width*scale,canvas.height=rect.height*scale;const ctx=canvas.getContext("2d");if(bg&&(ctx.fillStyle="#ffffff",ctx.fillRect(0,0,canvas.width,canvas.height)),shadow&&(ctx.shadowColor="rgba(0,0,0,.15)",ctx.shadowBlur=20*scale,ctx.fillStyle="#fff",ctx.fillRect(10*scale,10*scale,canvas.width-20*scale,canvas.height-20*scale),ctx.shadowColor="transparent"),typeof html2canvas<"u"){const c=await html2canvas(ed,{scale,backgroundColor:bg?"#ffffff":null,useCORS:!0}),a=document.createElement("a");a.href=c.toDataURL("image/"+fmt,.95),a.download="documento-wc."+fmt,a.click(),showToast("\u{1F4F8} Imagen exportada \u2705")}else window.print(),showToast('Us\xE1 "Guardar como PDF/imagen" en el di\xE1logo de impresi\xF3n')}catch(e){showToast("Error: "+e.message)}}}let _presentMode=!1;function togglePresentationMode(){_presentMode=!_presentMode;const ed=document.getElementById("editor");if(ed)if(_presentMode){document.querySelectorAll(".header,.menu-card,.bottom-nav,.statusbar,#ruler,#fabBtn,#communityBtn,#dictBox,#aiBox,.footer").forEach(el=>{el&&(el.dataset.presHidden="1",el.style.display="none")});const slides=[];let current="";Array.from(ed.children).forEach(child=>{/^H[12]$/.test(child.tagName)&&current.trim()&&(slides.push(current),current=""),current+=child.outerHTML}),current.trim()&&slides.push(current),slides.length||slides.push(ed.innerHTML),window.__presSlides=slides,window.__presIndex=0;const viewer=document.createElement("div");viewer.id="__presViewer",viewer.style.cssText="position:fixed;inset:0;z-index:9999;background:#1a1a2e;display:flex;flex-direction:column;align-items:center;justify-content:center",viewer.innerHTML=`
      <div id="__presSlide" style="background:#fff;border-radius:16px;padding:5vw;max-width:90vw;width:100%;max-height:80vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5);font-family:inherit"></div>
      <div style="display:flex;align-items:center;gap:20px;margin-top:24px">
        <button onclick="__presNav(-1)" style="padding:12px 20px;border:none;background:rgba(255,255,255,.15);color:#fff;border-radius:10px;cursor:pointer;font-size:18px;backdrop-filter:blur(10px)">\u25C0</button>
        <div id="__presCounter" style="color:rgba(255,255,255,.7);font-size:13px;min-width:80px;text-align:center">1 / ${slides.length}</div>
        <button onclick="__presNav(1)"  style="padding:12px 20px;border:none;background:rgba(255,255,255,.15);color:#fff;border-radius:10px;cursor:pointer;font-size:18px;backdrop-filter:blur(10px)">\u25B6</button>
      </div>
      <button onclick="togglePresentationMode()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:10px;padding:8px 14px;cursor:pointer;font-size:13px;backdrop-filter:blur(10px)">\u2715 Salir</button>
      <div style="position:absolute;bottom:16px;color:rgba(255,255,255,.4);font-size:11px">\u2190 \u2192 para navegar \xB7 Esc para salir</div>`,document.body.appendChild(viewer),__presShow(0),document.addEventListener("keydown",__presKeyHandler),showToast("\u{1F3AC} Modo presentaci\xF3n \u2014 Esc para salir")}else{document.querySelectorAll("[data-pres-hidden]").forEach(el=>{el.style.display="",delete el.dataset.presHidden});const v=document.getElementById("__presViewer");v&&v.remove(),document.removeEventListener("keydown",__presKeyHandler)}}function __presShow(idx){const slides=window.__presSlides||[];if(!slides.length)return;idx=Math.max(0,Math.min(slides.length-1,idx)),window.__presIndex=idx;const slide=document.getElementById("__presSlide"),counter=document.getElementById("__presCounter");slide&&(slide.innerHTML=slides[idx]),counter&&(counter.textContent=idx+1+" / "+slides.length)}function __presNav(dir){__presShow((window.__presIndex||0)+dir)}function __presKeyHandler(e){(e.key==="ArrowRight"||e.key==="ArrowDown")&&__presNav(1),(e.key==="ArrowLeft"||e.key==="ArrowUp")&&__presNav(-1),e.key==="Escape"&&togglePresentationMode()}const WC_COMMENTS={list:JSON.parse(localStorage.getItem("wc-comments")||"[]"),save(){localStorage.setItem("wc-comments",JSON.stringify(this.list))},add(text,author,range){const c={id:"c"+Date.now(),text,author:author||"An\xF3nimo",date:new Date().toLocaleString("es-CR"),resolved:!1,replies:[]};return this.list.push(c),this.save(),c},resolve(id){const c=this.list.find(c2=>c2.id===id);c&&(c.resolved=!0,this.save())},delete(id){this.list=this.list.filter(c=>c.id!==id),this.save()}};function addComment(){const sel=window.getSelection(),text=sel?sel.toString().trim():"",note=prompt("Agregar comentario"+(text?` a "${text.substring(0,30)}..."`:"")+":");if(!note)return;const author=prompt("Tu nombre (opcional):","")||"An\xF3nimo",c=WC_COMMENTS.add(note,author);if(text&&sel.rangeCount){const span=document.createElement("span");span.className="wc-comment-mark",span.dataset.cid=c.id,span.style.cssText="background:#fff9c4;border-bottom:2px solid #f39c12;cursor:pointer",span.title=`\u{1F4AC} ${author}: ${note}`,span.onclick=()=>openCommentsPanel();try{sel.getRangeAt(0).surroundContents(span)}catch{}}showToast("\u{1F4AC} Comentario agregado \u2705"),openCommentsPanel()}function openCommentsPanel(){const old=document.getElementById("__commPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__commPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const open=WC_COMMENTS.list.filter(c=>!c.resolved),resolved=WC_COMMENTS.list.filter(c=>c.resolved);ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:17px;font-weight:700;color:#1a2942">\u{1F4AC} Comentarios (${open.length})</div>
        <button onclick="addComment();document.getElementById('__commPanel').remove()" style="padding:7px 14px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar</button>
      </div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 18px 20px">
      ${open.length===0?'<div style="text-align:center;color:#bbb;padding:30px;font-size:13px">No hay comentarios abiertos</div>':open.map(c=>`
          <div style="background:#fff9e6;border:1.5px solid #fde68a;border-radius:12px;padding:14px;margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:12px;font-weight:700;color:#856404">\u{1F464} ${c.author}</span>
              <span style="font-size:10px;color:#aaa">${c.date}</span>
            </div>
            <div style="font-size:13px;color:#1a1a1a;margin-bottom:10px">${c.text}</div>
            <div style="display:flex;gap:6px">
              <button onclick="WC_COMMENTS.resolve('${c.id}');openCommentsPanel()" style="padding:5px 12px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u2705 Resolver</button>
              <button onclick="WC_COMMENTS.delete('${c.id}');openCommentsPanel()" style="padding:5px 10px;border:1.5px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F5D1}</button>
            </div>
          </div>`).join("")}
      ${resolved.length>0?`
        <div style="font-size:11px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin:12px 0 8px">\u2705 Resueltos (${resolved.length})</div>
        ${resolved.map(c=>`
          <div style="background:#f0fff4;border:1.5px solid #d4edda;border-radius:10px;padding:10px 14px;margin-bottom:6px;opacity:.7">
            <div style="font-size:12px;font-weight:600;color:#155724">\u{1F464} ${c.author} <span style="opacity:.6;font-weight:400">\u2014 ${c.date}</span></div>
            <div style="font-size:12px;color:#555;margin-top:4px;text-decoration:line-through">${c.text}</div>
          </div>`).join("")}`:""}
    </div>
    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__commPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}const WC_EMAIL_TEMPLATES=[{icon:"\u{1F4BC}",name:"Email corporativo",html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Calibri,Arial,sans-serif;margin:0;background:#f5f5f5;}
.wrap{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);}
.header{background:#003da5;color:#fff;padding:28px 32px;}.header h1{margin:0;font-size:22px;}
.body{padding:28px 32px;color:#333;line-height:1.7;font-size:14px;}.cta{display:inline-block;background:#003da5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:12px 0;}
.footer{background:#f0f0f0;padding:16px 32px;font-size:11px;color:#888;text-align:center;}</style></head><body>
<div class="wrap"><div class="header"><h1>\u{1F4E7} Asunto del correo</h1><div style="opacity:.8;font-size:13px;margin-top:4px">Nombre de la empresa</div></div>
<div class="body"><p>Estimado/a [Nombre],</p><p>Me dirijo a usted para...</p><p>Por lo anterior, le solicito respetuosamente...</p>
<a href="#" class="cta">Ver m\xE1s detalles</a><p>Quedo a su disposici\xF3n para cualquier consulta.</p>
<p style="margin-top:24px">Atentamente,<br><strong>[Tu nombre]</strong><br>[Cargo] \xB7 [Empresa]<br>[Tel] \xB7 [correo@empresa.cr]</p></div>
<div class="footer">\xA9 ${new Date().getFullYear()} [Empresa] \xB7 Costa Rica \xB7 <a href="#" style="color:#0084ff">Cancelar suscripci\xF3n</a></div></div></body></html>`},{icon:"\u{1F389}",name:"Invitaci\xF3n evento",html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;margin:0;background:#f0f4ff;}
.wrap{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;}
.header{background:linear-gradient(135deg,#003da5,#0084ff);color:#fff;padding:40px;text-align:center;}
.body{padding:32px;color:#333;text-align:center;}.detail{background:#f0f7ff;border-radius:10px;padding:16px;margin:16px 0;text-align:left;}
.cta{display:inline-block;background:#27ae60;color:#fff;padding:14px 32px;border-radius:30px;text-decoration:none;font-weight:700;font-size:16px;}
.footer{background:#fafafa;padding:16px;text-align:center;font-size:11px;color:#aaa;}</style></head><body>
<div class="wrap"><div class="header"><div style="font-size:48px;margin-bottom:12px">\u{1F389}</div><h1 style="margin:0;font-size:26px">\xA1Est\xE1s invitado!</h1><p style="opacity:.9;margin:8px 0 0">Nombre del evento</p></div>
<div class="body"><p style="font-size:16px;color:#555">Nos complace invitarte a nuestro evento especial</p>
<div class="detail"><div>\u{1F4C5} <strong>Fecha:</strong> [Fecha del evento]</div><div>\u23F0 <strong>Hora:</strong> [Hora]</div><div>\u{1F4CD} <strong>Lugar:</strong> [Direcci\xF3n], Costa Rica</div></div>
<p style="color:#555">[Descripci\xF3n del evento y detalles adicionales]</p><a href="#" class="cta">Confirmar asistencia</a></div>
<div class="footer">\xA9 ${new Date().getFullYear()} \xB7 Costa Rica</div></div></body></html>`},{icon:"\u{1F6CD}\uFE0F",name:"Promoci\xF3n / Oferta",html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;margin:0;background:#fff5f5;}
.wrap{max-width:600px;margin:20px auto;background:#fff;overflow:hidden;border-radius:8px;}
.header{background:#ce1126;color:#fff;padding:32px;text-align:center;}.badge{background:#fff;color:#ce1126;display:inline-block;padding:6px 20px;border-radius:30px;font-weight:800;font-size:24px;margin:10px 0;}
.body{padding:28px;text-align:center;}.price{font-size:42px;font-weight:900;color:#ce1126;}.old{font-size:18px;color:#aaa;text-decoration:line-through;}
.cta{display:inline-block;background:#ce1126;color:#fff;padding:14px 40px;border-radius:6px;text-decoration:none;font-weight:700;font-size:16px;margin:16px 0;}
.footer{background:#fafafa;padding:14px;text-align:center;font-size:11px;color:#aaa;}</style></head><body>
<div class="wrap"><div class="header"><div style="font-size:40px">\u{1F6CD}\uFE0F</div><h1 style="margin:4px 0;font-size:24px">\xA1OFERTA ESPECIAL!</h1><div class="badge">-50% DESC.</div><div style="opacity:.9;font-size:13px">Solo por tiempo limitado</div></div>
<div class="body"><h2 style="color:#333">[Nombre del producto/servicio]</h2><div class="old">\u20A199,900</div><div class="price">\u20A149,900</div>
<p style="color:#666">[Descripci\xF3n de la oferta y beneficios principales]</p><a href="#" class="cta">\xA1Aprovechar ahora!</a>
<p style="font-size:12px;color:#aaa">Oferta v\xE1lida hasta [fecha] \xB7 Sujeto a disponibilidad</p></div>
<div class="footer">\xA9 ${new Date().getFullYear()} [Empresa] \xB7 Costa Rica \xB7 <a href="#" style="color:#ce1126">Ver tienda</a></div></div></body></html>`},{icon:"\u{1F4CA}",name:"Newsletter informativo",html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;margin:0;background:#f5f5f5;}
.wrap{max-width:600px;margin:20px auto;background:#fff;}
.header{background:#1a2942;color:#fff;padding:24px 32px;display:flex;align-items:center;gap:12px;}
.tag{background:#0084ff;color:#fff;font-size:10px;padding:2px 8px;border-radius:3px;font-family:Arial;}
.body{padding:24px 32px;}.article{border-bottom:1px solid #eee;padding:18px 0;}.read-more{color:#0084ff;font-size:13px;text-decoration:none;font-weight:600;}
.sidebar{background:#f8f9fa;padding:16px;border-radius:8px;margin:20px 0;}
.footer{background:#1a2942;color:#fff;padding:20px 32px;text-align:center;font-size:12px;}</style></head><body>
<div class="wrap"><div class="header"><div><div style="font-size:10px;opacity:.6;letter-spacing:3px;text-transform:uppercase">NEWSLETTER</div><div style="font-size:20px;font-weight:700;margin-top:2px">\u{1F4F0} [Nombre Newsletter]</div></div><div style="margin-left:auto;font-size:11px;opacity:.7">${new Date().toLocaleDateString("es-CR",{month:"long",year:"numeric"})}</div></div>
<div class="body"><div class="article"><span class="tag">PRINCIPAL</span><h2 style="margin:8px 0;font-size:18px">[T\xEDtulo del art\xEDculo principal]</h2><p style="color:#555;font-size:14px;line-height:1.7">[Extracto del art\xEDculo principal...]</p><a href="#" class="read-more">Leer m\xE1s \u2192</a></div>
<div class="article"><span class="tag">TECNOLOG\xCDA</span><h3 style="margin:8px 0;font-size:16px">[Segundo art\xEDculo]</h3><p style="color:#555;font-size:13px">[Breve descripci\xF3n...]</p><a href="#" class="read-more">Leer m\xE1s \u2192</a></div>
<div class="sidebar"><strong style="font-size:13px">\u{1F1E8}\u{1F1F7} Costa Rica en cifras</strong><div style="font-size:13px;color:#555;margin-top:8px;line-height:1.8">\u2022 [Dato 1]<br>\u2022 [Dato 2]<br>\u2022 [Dato 3]</div></div></div>
<div class="footer"><div style="margin-bottom:8px">\xA9 ${new Date().getFullYear()} [Empresa] \xB7 Costa Rica</div><a href="#" style="color:#aaa;font-size:11px">Cancelar suscripci\xF3n</a></div></div></body></html>`},{icon:"\u2705",name:"Confirmaci\xF3n / Recibo",html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;margin:0;background:#f0fff4;}
.wrap{max-width:560px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;border:1.5px solid #27ae60;}
.header{background:#27ae60;color:#fff;padding:28px;text-align:center;}.check{font-size:52px;}
.body{padding:28px;}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;}
.total{background:#f0fff4;padding:14px;border-radius:8px;margin:14px 0;}
.footer{background:#f8f8f8;padding:16px;text-align:center;font-size:11px;color:#888;}</style></head><body>
<div class="wrap"><div class="header"><div class="check">\u2705</div><h1 style="margin:8px 0 0;font-size:22px">\xA1Confirmado!</h1><p style="opacity:.9;margin:4px 0 0;font-size:14px">Tu solicitud fue procesada exitosamente</p></div>
<div class="body"><h3 style="color:#27ae60;margin-bottom:16px">Detalles de la transacci\xF3n</h3>
<div class="row"><span style="color:#888">N\xB0 de referencia</span><strong>#[12345]</strong></div>
<div class="row"><span style="color:#888">Fecha</span><span>${new Date().toLocaleDateString("es-CR")}</span></div>
<div class="row"><span style="color:#888">Servicio</span><span>[Descripci\xF3n]</span></div>
<div class="row"><span style="color:#888">Cliente</span><span>[Nombre del cliente]</span></div>
<div class="total"><div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;color:#27ae60"><span>TOTAL PAGADO:</span><span>\u20A1[monto]</span></div></div>
<p style="font-size:13px;color:#555">Si ten\xE9s alguna consulta, escribinos a <a href="mailto:info@empresa.cr" style="color:#27ae60">info@empresa.cr</a></p></div>
<div class="footer">\xA9 ${new Date().getFullYear()} [Empresa] \xB7 Costa Rica</div></div></body></html>`}];function openEmailTemplatesPanel(){const old=document.getElementById("__emailPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__emailPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:580px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4E7} Plantillas de email HTML</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">${WC_EMAIL_TEMPLATES.length} plantillas profesionales \xB7 Listas para usar</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 18px;display:flex;flex-direction:column;gap:8px">
      ${WC_EMAIL_TEMPLATES.map((t,i)=>`
        <div style="display:flex;align-items:center;gap:12px;padding:14px;border-radius:14px;background:#fafafa;border:1.5px solid #eee;cursor:pointer;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'"
          onclick="__previewEmail(${i})">
          <div style="width:46px;height:46px;background:#f0f7ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">${t.icon}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;color:#1a1a1a">${t.name}</div>
            <div style="font-size:11px;color:#888;margin-top:2px">HTML profesional \xB7 Responsive</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button onclick="event.stopPropagation();__downloadEmail(${i})" style="padding:6px 10px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555">\u{1F4E5} HTML</button>
            <button onclick="event.stopPropagation();__insertEmail(${i})" style="padding:6px 10px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600">Insertar</button>
          </div>
        </div>`).join("")}
    </div>
    <div style="padding:12px 18px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__emailPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __previewEmail(idx){const t=WC_EMAIL_TEMPLATES[idx],win=window.open("","_blank","width=650,height=700");win.document.write(t.html),win.document.close()}function __downloadEmail(idx){const t=WC_EMAIL_TEMPLATES[idx],blob=new Blob([t.html],{type:"text/html;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download="email-"+t.name.toLowerCase().replace(/\s+/g,"-")+".html",a.click(),showToast("\u{1F4E5} "+t.name+" descargado \u2705")}function __insertEmail(idx){const t=WC_EMAIL_TEMPLATES[idx],html=`<div style="border:2px solid #0084ff;border-radius:12px;overflow:hidden;margin:16px 0;max-width:600px">
    <div style="background:#0084ff;color:#fff;padding:8px 14px;font-size:11px;font-weight:600;display:flex;justify-content:space-between;align-items:center">
      <span>${t.icon} ${t.name}</span>
      <span style="opacity:.7">Plantilla Email HTML</span>
    </div>
    <iframe srcdoc="${t.html.replace(/"/g,"&quot;")}" style="width:100%;height:400px;border:none;display:block"></iframe>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__emailPanel").remove(),showToast(t.icon+" "+t.name+" insertada \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"ccssExtended":openCCSSExtended();break;case"lineNumbers":toggleLineNumbers();break;case"formControls":openFormControlsPanel();break;case"protectSection":openProtectPanel();break;case"verticalRuler":toggleVerticalRuler();break;case"pasteSpecial":openPasteSpecialPanel();break;case"exportImage":openExportImagePanel();break;case"presentMode":togglePresentationMode();break;case"comments":openCommentsPanel();break;case"addComment":addComment();break;case"emailTemplates":openEmailTemplatesPanel();break;default:orig(a)}}),console.log("WC Corporate Editor v25.11 \u2705 \u2014 CCSS+, L\xEDneas, Formularios, Proteger, Regla V, Pegar, PNG, Presentaci\xF3n, Comentarios, Email")},1900)})();const WC_CHAT={open:!1,history:[],model:"llama-3.3-70b-versatile",toggle(){this.open=!this.open;const panel=document.getElementById("__chatSidebar");this.open?(panel?panel.style.transform="translateX(0)":this.render(),document.querySelector(".content")&&(document.querySelector(".content").style.marginRight="320px")):(panel&&(panel.style.transform="translateX(100%)"),document.querySelector(".content")&&(document.querySelector(".content").style.marginRight=""))},render(){const sidebar=document.createElement("div");sidebar.id="__chatSidebar",sidebar.style.cssText=`
      position:fixed;right:0;top:0;bottom:60px;width:310px;
      background:#fff;border-left:1px solid #e8e8ec;
      z-index:800;display:flex;flex-direction:column;
      box-shadow:-4px 0 20px rgba(0,0,0,.1);
      transform:translateX(0);transition:transform .3s cubic-bezier(.4,0,.2,1);
      font-family:-apple-system,'Segoe UI',sans-serif;
    `;const key=localStorage.getItem("wc-groq-key");sidebar.innerHTML=`
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0084ff,#0050cc);color:#fff;padding:14px 16px;flex-shrink:0;display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px">\u{1F999}</div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700">Asistente IA</div>
          <div style="font-size:10px;opacity:.8">Llama 3.3 \xB7 Groq</div>
        </div>
        <button onclick="WC_CHAT.toggle()" style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:13px">\u2715</button>
      </div>

      <!-- Acciones r\xE1pidas -->
      <div style="padding:10px;border-bottom:1px solid #f0f0f0;flex-shrink:0">
        <div style="font-size:10px;color:#aaa;font-weight:700;letter-spacing:.5px;margin-bottom:6px;text-transform:uppercase">Acciones r\xE1pidas</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
          ${[["\u2728 Mejorar","Mejora la redacci\xF3n del documento actual, haci\xE9ndola m\xE1s clara y profesional"],["\u{1F4DD} Resumir","Resume el documento en 3-5 puntos clave"],["\u{1F50D} Revisar","Revisa el documento e identifica posibles errores o mejoras"],["\u{1F4A1} Ideas","Dame 5 ideas para expandir o mejorar el contenido del documento"],["\u{1F1E8}\u{1F1F7} Formalizar","Adapta el texto al formato y estilo formal costarricense"],["\u{1F4E7} Email","Convierte el contenido en un email profesional"]].map(([label,prompt2])=>`
            <button onclick="WC_CHAT.quickAction('${prompt2.replace(/'/g,"\\'")}')"
              style="padding:6px 8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;text-align:left;transition:all .15s;line-height:1.3"
              onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
              onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
              ${label}
            </button>`).join("")}
        </div>
      </div>

      <!-- Mensajes -->
      <div id="__chatMessages" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth">
        <div style="text-align:center;color:#bbb;font-size:12px;padding:20px 10px">
          <div style="font-size:28px;margin-bottom:8px">\u{1F999}</div>
          Hola! Soy tu asistente IA.<br>Preguntame lo que necesit\xE9s o us\xE1 las acciones r\xE1pidas.
        </div>
      </div>

      <!-- Input -->
      <div style="padding:10px;border-top:1px solid #f0f0f0;flex-shrink:0">
        ${key?"":`<div style="background:#fff3cd;border-radius:8px;padding:10px;margin-bottom:8px;font-size:11px;color:#856404">
          \u26A0\uFE0F Configur\xE1 tu API Key de Groq en el men\xFA IA \u{1F999}
        </div>`}
        <div style="display:flex;gap-6px;align-items:flex-end;gap:6px">
          <textarea id="__chatInput" rows="2" placeholder="Pregunt\xE1 algo al asistente..."
            style="flex:1;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;resize:none;font-family:inherit;line-height:1.4"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();WC_CHAT.send();}"></textarea>
          <button onclick="WC_CHAT.send()" style="padding:9px 12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:16px;flex-shrink:0;align-self:flex-end">\u27A4</button>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px">
          <button onclick="WC_CHAT.useDocContext()" style="background:none;border:none;color:#0084ff;cursor:pointer;font-size:11px;font-weight:600">\u{1F4C4} Usar doc como contexto</button>
          <button onclick="WC_CHAT.clearHistory()" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:11px">\u{1F5D1} Limpiar</button>
        </div>
      </div>
    `,document.body.appendChild(sidebar)},async send(){const inp=document.getElementById("__chatInput"),msg=inp?inp.value.trim():"";if(!msg)return;inp.value="";const key=localStorage.getItem("wc-groq-key");if(!key){this.addMessage("assistant","\u26A0\uFE0F Necesit\xE1s configurar tu API Key de Groq en el men\xFA IA \u{1F999}");return}this.addMessage("user",msg),this.history.push({role:"user",content:msg});const typing=this.addMessage("assistant","\u23F3 Escribiendo...");try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:this.model,messages:[{role:"system",content:"Sos un asistente de escritura profesional para el WC Corporate Editor, especializado en documentos corporativos de Costa Rica. Respond\xE9s en espa\xF1ol, de forma concisa y \xFAtil. "+(this._docContext?"Contexto del documento actual: "+this._docContext.substring(0,1e3):"")},...this.history.slice(-8)],temperature:.7,max_tokens:800})})).json())?.choices?.[0]?.message?.content||"Sin respuesta";this.history.push({role:"assistant",content:reply}),typing.innerHTML=this.formatMsg(reply);const insertBtn=document.createElement("button");insertBtn.textContent="\u{1F4E5} Insertar en documento",insertBtn.style.cssText="display:block;margin-top:6px;padding:5px 10px;border:none;background:#f0f7ff;color:#0084ff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;width:100%",insertBtn.onclick=()=>{typeof insertHTML=="function"&&insertHTML("<p>"+reply.replace(/\n/g,"<br>")+"</p>"),showToast("Insertado \u2705")},typing.parentElement.appendChild(insertBtn)}catch(e){typing.textContent="Error: "+e.message}this.scrollDown()},async quickAction(prompt2){const inp=document.getElementById("__chatInput");inp&&(inp.value=prompt2),this.useDocContext(),await this.send()},useDocContext(){const ed=document.getElementById("editor");this._docContext=ed?ed.innerText.substring(0,2e3):"",showToast("\u{1F4C4} Contexto del documento cargado")},addMessage(role,text){const msgs=document.getElementById("__chatMessages");if(!msgs)return document.createElement("div");const div=document.createElement("div");return div.style.cssText=role==="user"?"background:#0084ff;color:#fff;border-radius:14px 14px 4px 14px;padding:10px 14px;font-size:13px;line-height:1.5;align-self:flex-end;max-width:90%":"background:#f0f0f5;color:#1a1a1a;border-radius:4px 14px 14px 14px;padding:10px 14px;font-size:13px;line-height:1.5;align-self:flex-start;max-width:95%",div.innerHTML=this.formatMsg(text),msgs.appendChild(div),this.scrollDown(),div},formatMsg(text){return text.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>")},scrollDown(){const msgs=document.getElementById("__chatMessages");msgs&&(msgs.scrollTop=msgs.scrollHeight)},clearHistory(){this.history=[],this._docContext="";const msgs=document.getElementById("__chatMessages");msgs&&(msgs.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:20px">Conversaci\xF3n limpiada \u{1F5D1}</div>')}};function openAIChat(){WC_CHAT.toggle()}function openContractGenerator(){const old=document.getElementById("__contractPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__contractPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const contractTypes=["\u{1F4CB} Servicios profesionales","\u{1F3E0} Arrendamiento","\u{1F4BC} Laboral","\u{1F91D} Compraventa","\u{1F512} Confidencialidad (NDA)","\u{1F91D} Sociedad/Joint Venture","\u{1F4F1} Desarrollo de software","\u{1F3A8} Derechos de autor","\u{1F697} Pr\xE9stamo de veh\xEDculo","\u2696\uFE0F Consultor\xEDa legal"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2696\uFE0F Generador de contratos IA</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">Genera contratos profesionales adaptados a la legislaci\xF3n costarricense</div>

      <div style="margin-bottom:14px">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de contrato</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${contractTypes.map((t,i)=>`
            <button onclick="__selectContractType(this,'${t.replace(/'/g,"\\'")}','${i}')"
              class="__contractTypeBtn"
              style="padding:8px 10px;border:1.5px solid #eee;background:#fafafa;border-radius:9px;cursor:pointer;font-size:11px;font-weight:600;color:#555;text-align:left;transition:all .15s"
              onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
              onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
              ${t}
            </button>`).join("")}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Parte A (Contratante)</label>
          <input type="text" id="__ctParteA" placeholder="Nombre o empresa"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Parte B (Contratado)</label>
          <input type="text" id="__ctParteB" placeholder="Nombre o empresa"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Objeto del contrato</label>
        <textarea id="__ctObjeto" rows="3" placeholder="Describ\xED brevemente qu\xE9 cubre el contrato..."
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Monto (\u20A1 o $)</label>
          <input type="text" id="__ctMonto" placeholder="Ej: \u20A1500,000"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Plazo</label>
          <input type="text" id="__ctPlazo" placeholder="Ej: 6 meses"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
      </div>

      <div id="__ctGenerating" style="display:none;background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:14px;text-align:center;color:#0084ff;font-size:13px">
        \u23F3 Generando contrato con IA...
      </div>
    </div>
    <div style="padding:0 20px 20px;display:flex;gap:8px">
      <button onclick="document.getElementById('__contractPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateContract()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2696\uFE0F Generar contrato</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__selectedContractType=contractTypes[0]}function __selectContractType(btn,type){window.__selectedContractType=type,document.querySelectorAll(".__contractTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"}async function __generateContract(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq en el men\xFA IA \u{1F999}");return}const tipo=window.__selectedContractType||"Servicios profesionales",parteA=document.getElementById("__ctParteA").value.trim()||"Parte A",parteB=document.getElementById("__ctParteB").value.trim()||"Parte B",objeto=document.getElementById("__ctObjeto").value.trim()||"Servicios profesionales",monto=document.getElementById("__ctMonto").value.trim()||"a convenir",plazo=document.getElementById("__ctPlazo").value.trim()||"6 meses",gen=document.getElementById("__ctGenerating");gen&&(gen.style.display="block");try{const contract=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un abogado especialista en derecho costarricense. Gener\xE1s contratos profesionales en espa\xF1ol formal, basados en el C\xF3digo Civil y C\xF3digo de Trabajo de Costa Rica cuando aplique."},{role:"user",content:`Gener\xE1 un contrato completo de "${tipo}" con estas caracter\xEDsticas:
- Parte A (Contratante): ${parteA}
- Parte B (Contratado/a): ${parteB}
- Objeto: ${objeto}
- Monto: ${monto}
- Plazo: ${plazo}
- Lugar: San Jos\xE9, Costa Rica

El contrato debe incluir: encabezado formal, comparecientes, antecedentes, cl\xE1usulas (objeto, obligaciones de ambas partes, precio y forma de pago, plazo, confidencialidad si aplica, causales de rescisi\xF3n, legislaci\xF3n aplicable), y espacio para firmas. Formato profesional costarricense.`}],temperature:.4,max_tokens:2e3})})).json())?.choices?.[0]?.message?.content||"";gen&&(gen.style.display="none"),document.getElementById("__contractPanel").remove();const html=`<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;max-width:16cm;margin:0 auto">
      ${contract.replace(/\n\n/g,'</p><p style="text-indent:1cm;text-align:justify">').replace(/\n/g,"<br>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}
    </div>`;typeof insertHTML=="function"&&insertHTML(html),showToast("\u2696\uFE0F Contrato generado \u2705")}catch(e){gen&&(gen.style.display="none"),showToast("Error: "+e.message)}}function openStyleCorrectorPanel(){const old=document.getElementById("__stylePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__stylePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u270D\uFE0F Corrector de estilo</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Adapta el texto a diferentes estilos y registros</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      ${[{id:"formal",icon:"\u{1F4BC}",name:"Formal CR",desc:"Estilo oficial costarricense"},{id:"informal",icon:"\u{1F60A}",name:"Informal",desc:"Tono amigable y cercano"},{id:"academico",icon:"\u{1F393}",name:"Acad\xE9mico",desc:"Estilo universitario formal"},{id:"periodistico",icon:"\u{1F4F0}",name:"Period\xEDstico",desc:"Claro y directo"},{id:"juridico",icon:"\u2696\uFE0F",name:"Jur\xEDdico",desc:"Lenguaje legal CR"},{id:"comercial",icon:"\u{1F6CD}\uFE0F",name:"Comercial",desc:"Persuasivo y vendedor"},{id:"simple",icon:"\u2705",name:"Simplificado",desc:"Lenguaje claro y sencillo"},{id:"inclusivo",icon:"\u{1F308}",name:"Inclusivo",desc:"Lenguaje inclusivo y neutro"}].map(s=>`
        <button onclick="__selectStyle('${s.id}',this)"
          class="__styleBtn"
          style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:18px;margin-bottom:4px">${s.icon}</div>
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${s.name}</div>
          <div style="font-size:10px;color:#888">${s.desc}</div>
        </button>`).join("")}
    </div>

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
      <input type="checkbox" id="__styleKeepStructure" checked style="accent-color:#0084ff;width:16px;height:16px">
      <label for="__styleKeepStructure" style="font-size:13px;color:#555">Mantener estructura y p\xE1rrafos</label>
    </div>

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
      <input type="checkbox" id="__styleSelOnly" style="accent-color:#0084ff;width:16px;height:16px">
      <label for="__styleSelOnly" style="font-size:13px;color:#555">Corregir solo la selecci\xF3n actual</label>
    </div>

    <div id="__styleGenerating" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:14px">
      \u270D\uFE0F Adaptando estilo con IA...
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__stylePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__applyStyleCorrection()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u270D\uFE0F Adaptar estilo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__selectedStyle="formal",setTimeout(()=>{const btn=document.querySelector(".__styleBtn");btn&&(btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1")},50)}function __selectStyle(id,btn){window.__selectedStyle=id,document.querySelectorAll(".__styleBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"}async function __applyStyleCorrection(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const selOnly=document.getElementById("__styleSelOnly").checked,keepStr=document.getElementById("__styleKeepStructure").checked,style=window.__selectedStyle||"formal",ed=document.getElementById("editor");let text="";if(selOnly){const sel=window.getSelection();if(text=sel?sel.toString().trim():"",!text){showToast("Seleccion\xE1 texto primero");return}}else text=ed?ed.innerText.trim():"";if(!text){showToast("No hay texto para corregir");return}const gen=document.getElementById("__styleGenerating");gen&&(gen.style.display="block");const stylePrompts={formal:"formal y oficial costarricense, usando usted/ustedes, vocabulario elevado y estructura clara",informal:"informal y amigable, usando vos/ustedes (costarricense), natural y cercano",academico:"acad\xE9mico universitario, con terminolog\xEDa t\xE9cnica, citas impl\xEDcitas y estructura anal\xEDtica",periodistico:"period\xEDstico claro y directo, pir\xE1mide invertida, oraciones cortas",juridico:"jur\xEDdico legal costarricense, lenguaje preciso, referencias normativas",comercial:"comercial persuasivo, beneficios claros, llamado a la acci\xF3n, positivo",simple:"simple y claro, palabras cotidianas, oraciones cortas, f\xE1cil de entender",inclusivo:"inclusivo y neutro, evitando marcadores de g\xE9nero cuando posible, respetuoso"};try{const corrected=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Sos un corrector de estilo especializado en espa\xF1ol costarricense. Reescrib\xEDs textos adapt\xE1ndolos al estilo solicitado. ${keepStr?"Manten\xE9s la estructura y p\xE1rrafos originales.":""} Devolv\xE9s SOLO el texto corregido, sin explicaciones ni comentarios.`},{role:"user",content:`Reescrib\xED este texto en estilo ${stylePrompts[style]}:

${text.substring(0,3e3)}`}],temperature:.5,max_tokens:2e3})})).json())?.choices?.[0]?.message?.content||"";gen&&(gen.style.display="none"),document.getElementById("__stylePanel").remove(),selOnly?document.execCommand("insertText",!1,corrected):ed.innerHTML=corrected.replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>"),showToast("\u270D\uFE0F Estilo adaptado \u2705")}catch(e){gen&&(gen.style.display="none"),showToast("Error: "+e.message)}}function openSalaryReceiptPanel(){const old=document.getElementById("__salPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__salPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const now=new Date,months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4B5} Recibo de salario CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px">Colillas de pago con deducciones CCSS autom\xE1ticas</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="grid-column:1/-1">
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Nombre del empleado *</label>
          <input type="text" id="__salNombre" placeholder="Nombre completo"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">C\xE9dula</label>
          <input type="text" id="__salCedula" placeholder="1-1234-5678"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Cargo</label>
          <input type="text" id="__salCargo" placeholder="Puesto de trabajo"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Empresa / Patrono</label>
          <input type="text" id="__salEmpresa" placeholder="Nombre de la empresa"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            value="${typeof WC_FIELDS<"u"&&WC_FIELDS.data.empresa||""}"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Per\xEDodo</label>
          <select id="__salMes" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            ${months.map((m,i)=>`<option value="${m}" ${i===now.getMonth()?"selected":""}>${m}</option>`).join("")}
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">A\xF1o</label>
          <input type="number" id="__salAnio" value="${now.getFullYear()}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tipo pago</label>
          <select id="__salTipo" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option>Mensual</option><option>Quincenal</option><option>Semanal</option>
          </select>
        </div>
      </div>

      <div style="background:#f8f9fa;border-radius:10px;padding:14px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:10px">\u{1F4B0} Salario e ingresos</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label style="font-size:10px;color:#888;display:block;margin-bottom:3px">Salario base \u20A1 *</label>
            <input type="number" id="__salBase" placeholder="0" min="0"
              style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
              oninput="__calcSalary()">
          </div>
          <div>
            <label style="font-size:10px;color:#888;display:block;margin-bottom:3px">Horas extra \u20A1</label>
            <input type="number" id="__salHExtra" placeholder="0" min="0" value="0"
              style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
              oninput="__calcSalary()">
          </div>
          <div>
            <label style="font-size:10px;color:#888;display:block;margin-bottom:3px">Incentivos / Plus \u20A1</label>
            <input type="number" id="__salPlus" placeholder="0" min="0" value="0"
              style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
              oninput="__calcSalary()">
          </div>
          <div>
            <label style="font-size:10px;color:#888;display:block;margin-bottom:3px">Otras deducciones \u20A1</label>
            <input type="number" id="__salDedOtras" placeholder="0" min="0" value="0"
              style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
              oninput="__calcSalary()">
          </div>
        </div>
      </div>

      <div id="__salCalcResult" style="background:#f0fff4;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;display:none">
        Calculando...
      </div>
    </div>
    <div style="padding:0 20px 20px;display:flex;gap:8px">
      <button onclick="document.getElementById('__salPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateSalaryReceipt()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4B5} Generar recibo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __calcSalary(){const base=parseFloat(document.getElementById("__salBase").value)||0,hExtra=parseFloat(document.getElementById("__salHExtra").value)||0,plus=parseFloat(document.getElementById("__salPlus").value)||0,dedOtras=parseFloat(document.getElementById("__salDedOtras").value)||0,res=document.getElementById("__salCalcResult");if(!base||!res)return;res.style.display="block";const bruto=base+hExtra+plus,ccssT=bruto*.055,ivmT=bruto*.0267,bpT=bruto*.01,totalDed=ccssT+ivmT+bpT+dedOtras,neto=bruto-totalDed,fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{maximumFractionDigits:0});res.innerHTML=`
    <div style="font-weight:700;color:#155724;margin-bottom:8px">Resumen de c\xE1lculo</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px">
      <span style="color:#555">Salario base:</span><span style="text-align:right;font-weight:600">${fmt(base)}</span>
      ${hExtra?`<span style="color:#555">Horas extra:</span><span style="text-align:right">${fmt(hExtra)}</span>`:""}
      ${plus?`<span style="color:#555">Incentivos:</span><span style="text-align:right">${fmt(plus)}</span>`:""}
      <span style="color:#555;font-weight:700">Salario bruto:</span><span style="text-align:right;font-weight:700">${fmt(bruto)}</span>
      <span style="color:#e74c3c">- CCSS Salud (5.50%):</span><span style="text-align:right;color:#e74c3c">-${fmt(ccssT)}</span>
      <span style="color:#e74c3c">- IVM (2.67%):</span><span style="text-align:right;color:#e74c3c">-${fmt(ivmT)}</span>
      <span style="color:#e74c3c">- Banco Popular (1%):</span><span style="text-align:right;color:#e74c3c">-${fmt(bpT)}</span>
      ${dedOtras?`<span style="color:#e74c3c">- Otras deducciones:</span><span style="text-align:right;color:#e74c3c">-${fmt(dedOtras)}</span>`:""}
      <span style="color:#003da5;font-weight:800;font-size:13px">SALARIO NETO:</span><span style="text-align:right;color:#003da5;font-weight:800;font-size:13px">${fmt(neto)}</span>
    </div>`,window.__salData={base,hExtra,plus,dedOtras,bruto,ccssT,ivmT,bpT,totalDed,neto}}function __generateSalaryReceipt(){const nombre=document.getElementById("__salNombre").value.trim();if(!nombre){showToast("Ingres\xE1 el nombre del empleado");return}if(!window.__salData){showToast("Ingres\xE1 el salario base primero");return}const cedula=document.getElementById("__salCedula").value.trim(),cargo=document.getElementById("__salCargo").value.trim(),empresa=document.getElementById("__salEmpresa").value.trim(),mes=document.getElementById("__salMes").value,anio=document.getElementById("__salAnio").value,tipo=document.getElementById("__salTipo").value,d=window.__salData,fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{maximumFractionDigits:0}),html=`
  <div style="border:1px solid #003da5;border-radius:10px;overflow:hidden;margin:16px 0;max-width:500px;font-family:Calibri,Arial,sans-serif;font-size:10pt">
    <div style="background:#003da5;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-size:13pt;font-weight:700">COLILLA DE PAGO</div><div style="opacity:.8;font-size:9pt">${empresa||"Empresa"}</div></div>
      <div style="text-align:right;font-size:9pt;opacity:.9"><div style="font-size:11pt;font-weight:700">${mes} ${anio}</div><div>${tipo}</div></div>
    </div>
    <div style="padding:12px 16px;border-bottom:1px solid #eee;display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10pt">
      <div><span style="color:#888">Empleado:</span> <strong>${nombre}</strong></div>
      ${cedula?`<div><span style="color:#888">C\xE9dula:</span> ${cedula}</div>`:""}
      ${cargo?`<div><span style="color:#888">Cargo:</span> ${cargo}</div>`:""}
      <div><span style="color:#888">Per\xEDodo:</span> ${mes} ${anio}</div>
    </div>
    <table style="border-collapse:collapse;width:100%">
      <tr style="background:#f0f7ff"><th colspan="2" style="padding:6px 16px;border:none;text-align:left;font-size:9pt;color:#003da5;text-transform:uppercase">INGRESOS</th></tr>
      <tr><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0">Salario base</td><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;text-align:right">${fmt(d.base)}</td></tr>
      ${d.hExtra?`<tr><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0">Horas extra</td><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;text-align:right">${fmt(d.hExtra)}</td></tr>`:""}
      ${d.plus?`<tr><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0">Incentivos</td><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;text-align:right">${fmt(d.plus)}</td></tr>`:""}
      <tr style="background:#f8f9fa"><td style="padding:6px 16px;font-weight:700">Total ingresos</td><td style="padding:6px 16px;text-align:right;font-weight:700">${fmt(d.bruto)}</td></tr>
      <tr style="background:#fff5f5"><th colspan="2" style="padding:6px 16px;border:none;text-align:left;font-size:9pt;color:#e74c3c;text-transform:uppercase">DEDUCCIONES</th></tr>
      <tr><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;color:#e74c3c">CCSS Salud (5.50%)</td><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;text-align:right;color:#e74c3c">-${fmt(d.ccssT)}</td></tr>
      <tr><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;color:#e74c3c">IVM (2.67%)</td><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;text-align:right;color:#e74c3c">-${fmt(d.ivmT)}</td></tr>
      <tr><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;color:#e74c3c">Banco Popular (1%)</td><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;text-align:right;color:#e74c3c">-${fmt(d.bpT)}</td></tr>
      ${d.dedOtras?`<tr><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;color:#e74c3c">Otras deducciones</td><td style="padding:5px 16px;border-bottom:1px solid #f0f0f0;text-align:right;color:#e74c3c">-${fmt(d.dedOtras)}</td></tr>`:""}
      <tr style="background:#003da5;color:#fff"><td style="padding:10px 16px;font-size:13pt;font-weight:800">SALARIO NETO</td><td style="padding:10px 16px;text-align:right;font-size:13pt;font-weight:800">${fmt(d.neto)}</td></tr>
    </table>
    <div style="padding:8px 16px;font-size:8pt;color:#888;text-align:center;background:#f8f9fa">
      Recibo de pago generado por WC Corporate Editor \xB7 Costa Rica \xB7 ${new Date().toLocaleDateString("es-CR")}
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__salPanel").remove(),showToast("\u{1F4B5} Recibo de salario generado \u2705")}function openIVACalculator(){const old=document.getElementById("__ivaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ivaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F9FE} Calculadora IVA \u2014 CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:18px">Impuesto al Valor Agregado \xB7 Ley N\xB0 9635</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[["13","General (13%)","#003da5"],["4","Medicamentos (4%)","#27ae60"],["2","Canasta b\xE1sica (2%)","#f39c12"],["1","Especial (1%)","#9b59b6"],["0","Exento (0%)","#888"]].map(([rate,label,color])=>`
        <button onclick="__ivaSetRate(${rate},this)"
          class="__ivaRateBtn"
          style="padding:9px 6px;border:2px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s;color:#555"
          onmouseover="this.style.borderColor='${color}'" onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
          <div style="font-size:16px;font-weight:800;color:${color}">${rate}%</div>
          <div style="font-size:10px;color:#888;line-height:1.2">${label.replace(" ("+rate+"%)")}</div>
        </button>`).join("")}
    </div>

    <div style="background:#f8f9fa;border-radius:12px;padding:14px;margin-bottom:16px">
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <button onclick="__ivaSetMode('sinIva',this)" id="__ivaModeBtn1"
          style="flex:1;padding:8px;border:2px solid #003da5;background:#f0f7ff;color:#003da5;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">
          Sin IVA \u2192 Con IVA
        </button>
        <button onclick="__ivaSetMode('conIva',this)" id="__ivaModeBtn2"
          style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">
          Con IVA \u2192 Sin IVA
        </button>
      </div>

      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px;font-weight:700;color:#e67e22;flex-shrink:0">\u20A1</span>
        <input type="number" id="__ivaAmount" placeholder="Monto" min="0" step="1"
          style="flex:1;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:16px;font-weight:700;outline:none"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__ivaCalc()">
      </div>
    </div>

    <div id="__ivaResult" style="margin-bottom:16px;min-height:80px"></div>

    <!-- Detector en texto -->
    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:#0084ff;margin-bottom:6px">\u{1F50D} Detectar montos en el documento</div>
      <div style="font-size:11px;color:#555;margin-bottom:8px">Busc\xE1 y calcul\xE1 IVA de todos los montos en \u20A1 del documento</div>
      <button onclick="__ivaDetectInDoc()" style="width:100%;padding:8px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">
        \u{1F50D} Detectar y calcular
      </button>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__ivaPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__ivaInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u20A1 Insertar c\xE1lculo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__ivaRate=13,window.__ivaMode="sinIva",setTimeout(()=>{const btn=document.querySelector(".__ivaRateBtn");btn&&(btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.dataset.sel="1")},50)}function __ivaSetRate(rate,btn){window.__ivaRate=rate,document.querySelectorAll(".__ivaRateBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.dataset.sel="1",__ivaCalc()}function __ivaSetMode(mode,btn){window.__ivaMode=mode,document.getElementById("__ivaModeBtn1").style.cssText="flex:1;padding:8px;border:2px solid "+(mode==="sinIva"?"#003da5":"#eee")+";background:"+(mode==="sinIva"?"#f0f7ff":"#fafafa")+";color:"+(mode==="sinIva"?"#003da5":"#555")+";border-radius:8px;cursor:pointer;font-size:12px;font-weight:600",document.getElementById("__ivaModeBtn2").style.cssText="flex:1;padding:8px;border:2px solid "+(mode==="conIva"?"#003da5":"#eee")+";background:"+(mode==="conIva"?"#f0f7ff":"#fafafa")+";color:"+(mode==="conIva"?"#003da5":"#555")+";border-radius:8px;cursor:pointer;font-size:12px;font-weight:600",__ivaCalc()}function __ivaCalc(){const amount=parseFloat(document.getElementById("__ivaAmount").value)||0,rate=window.__ivaRate||13,mode=window.__ivaMode||"sinIva",res=document.getElementById("__ivaResult");if(!res||!amount)return;const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR");let sinIva,ivaAmount,conIva;mode==="sinIva"?(sinIva=amount,ivaAmount=amount*rate/100,conIva=amount+ivaAmount):(conIva=amount,sinIva=amount/(1+rate/100),ivaAmount=conIva-sinIva),window.__ivaCalcData={sinIva,ivaAmount,conIva,rate},res.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
      <div style="background:#f8f9fa;border-radius:10px;padding:10px;text-align:center">
        <div style="font-size:10px;color:#888;font-weight:600;margin-bottom:4px">SIN IVA</div>
        <div style="font-size:14px;font-weight:800;color:#555">${fmt(sinIva)}</div>
      </div>
      <div style="background:#fff5f5;border-radius:10px;padding:10px;text-align:center">
        <div style="font-size:10px;color:#e74c3c;font-weight:600;margin-bottom:4px">IVA ${rate}%</div>
        <div style="font-size:14px;font-weight:800;color:#e74c3c">${fmt(ivaAmount)}</div>
      </div>
      <div style="background:#f0fff4;border-radius:10px;padding:10px;text-align:center">
        <div style="font-size:10px;color:#27ae60;font-weight:600;margin-bottom:4px">CON IVA</div>
        <div style="font-size:14px;font-weight:800;color:#27ae60">${fmt(conIva)}</div>
      </div>
    </div>`}function __ivaInsert(){const d=window.__ivaCalcData;if(!d){showToast("Ingres\xE1 un monto primero");return}const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),html=`<span style="background:#f0fff4;border:1px solid #27ae60;border-radius:4px;padding:1px 8px;font-size:10pt">
    ${fmt(d.sinIva)} + IVA ${d.rate}% (${fmt(d.ivaAmount)}) = <strong style="color:#003da5">${fmt(d.conIva)}</strong>
  </span>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__ivaPanel").remove(),showToast("IVA insertado \u2705")}function __ivaDetectInDoc(){const ed=document.getElementById("editor");if(!ed)return;const rate=window.__ivaRate||13,matches=[...ed.innerText.matchAll(/₡\s?([\d,]+(?:\.\d{2})?)/g)];if(!matches.length){showToast("No se encontraron montos en \u20A1 en el documento");return}const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR");let total=0,tableRows="";matches.slice(0,20).forEach(m=>{const val=parseFloat(m[1].replace(/,/g,"")),iva=val*rate/100,con=val+iva;total+=con,tableRows+=`<tr><td style="padding:6px 10px;border:1px solid #ddd">${m[0]}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${fmt(iva)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(con)}</td></tr>`}),document.getElementById("__ivaPanel").remove();const html=`<div style="margin:16px 0">
    <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px;text-transform:uppercase">\u{1F9FE} Resumen IVA ${rate}% \u2014 Montos detectados</div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#003da5;color:#fff"><th style="padding:7px 10px;border:1px solid #002080">Monto original</th><th style="padding:7px 10px;border:1px solid #002080">IVA ${rate}%</th><th style="padding:7px 10px;border:1px solid #002080">Total con IVA</th></tr>
      ${tableRows}
      <tr style="background:#003da5;color:#fff;font-weight:700"><td colspan="2" style="padding:7px 10px;border:1px solid #002080">TOTAL</td><td style="padding:7px 10px;border:1px solid #002080;text-align:right">${fmt(total)}</td></tr>
    </table>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),showToast(`${matches.length} montos procesados \u2705`)}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"aiChat":openAIChat();break;case"contractGen":openContractGenerator();break;case"styleCorrector":openStyleCorrectorPanel();break;case"salaryReceipt":openSalaryReceiptPanel();break;case"ivaCalculator":openIVACalculator();break;default:orig(a)}}),console.log("WC Corporate Editor v25.12 \u2705 \u2014 Chat IA, Contratos, Estilo, Recibo Salario, IVA CR")},2e3)})();const WC_HACIENDA={validateCedula(cedula){const clean=cedula.replace(/[-\s]/g,"");if(!/^\d{9}$/.test(clean))return{valid:!1,msg:"Debe tener 9 d\xEDgitos"};const prov=parseInt(clean[0]);return prov<1||prov>9?{valid:!1,msg:"Provincia inv\xE1lida (1-9)"}:{valid:!0,tipo:"F\xEDsica",formatted:`${clean[0]}-${clean.slice(1,5)}-${clean.slice(5)}`}},validateJuridica(cedula){const clean=cedula.replace(/[-\s]/g,"");if(!/^\d{10}$/.test(clean))return{valid:!1,msg:"Debe tener 10 d\xEDgitos"};const tipo=clean.slice(0,2);return{valid:!0,tipo:"Jur\xEDdica",subTipo:{30:"Sociedad An\xF3nima",31:"Sociedad de Responsabilidad Ltda",32:"Sociedad en Nombre Colectivo",33:"Sociedad en Comandita",34:"Sucursal extranjera",35:"Asociaci\xF3n",36:"Fundaci\xF3n",37:"Cooperativa",38:"Empresa Individual",39:"Empresa Estatal"}[tipo]||"Entidad jur\xEDdica",formatted:`${clean.slice(0,2)}-${clean.slice(2,7)}-${clean.slice(7)}`}},validateDIMEX(dimex){const clean=dimex.replace(/[-\s]/g,"");return/^\d{11,12}$/.test(clean)?{valid:!0,tipo:"DIMEX (Extranjero)",formatted:clean}:{valid:!1,msg:"DIMEX debe tener 11-12 d\xEDgitos"}},detect(value){const clean=value.replace(/[-\s]/g,"");return clean.length===9?this.validateCedula(value):clean.length===10?this.validateJuridica(value):clean.length>=11?this.validateDIMEX(value):{valid:!1,msg:"Longitud inv\xE1lida"}},digitoVerificador(cedula){const clean=cedula.replace(/[-\s]/g,"");if(clean.length!==9)return null;const factores=[2,7,8,4,3,6,9,1];let suma=0;for(let i=0;i<8;i++)suma+=parseInt(clean[i])*factores[i];const residuo=suma%10,digito=residuo===0?0:10-residuo;return{calculado:digito,documento:parseInt(clean[8]),coincide:digito===parseInt(clean[8])}}};function openHaciendaPanel(){const old=document.getElementById("__haciendaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__haciendaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u{1F3DB}\uFE0F Hacienda CR \u2014 Validador de c\xE9dulas
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:18px">C\xE9dula f\xEDsica \xB7 Jur\xEDdica \xB7 DIMEX \xB7 Verificaci\xF3n de d\xEDgito</div>

    <div style="position:relative;margin-bottom:12px">
      <input type="text" id="__hacInput"
        placeholder="Ej: 1-1234-5678 \xF3 3-101-12345"
        style="width:100%;padding:12px 44px 12px 14px;border:2px solid #e0e0e0;border-radius:12px;font-size:15px;outline:none;box-sizing:border-box;font-family:'Courier New',monospace;letter-spacing:1px"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__hacValidate(this.value)"
        onkeydown="if(event.key==='Enter')__hacValidate(this.value)">
      <span id="__hacIcon" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:20px"></span>
    </div>

    <div id="__hacResult" style="margin-bottom:16px;min-height:60px"></div>

    <!-- Formateo autom\xE1tico -->
    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Formatos aceptados</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;color:#555;line-height:2">
        <div>\u{1F4CB} <strong>F\xEDsica:</strong> 1-2345-6789</div>
        <div>\u{1F3E2} <strong>S.A.:</strong> 3-101-123456</div>
        <div>\u{1F30D} <strong>DIMEX:</strong> 11 d\xEDgitos</div>
        <div>\u{1F3DB}\uFE0F <strong>NITE:</strong> 10 d\xEDgitos</div>
      </div>
    </div>

    <!-- Detecci\xF3n en documento -->
    <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">\u{1F50D} Detectar c\xE9dulas en el documento</div>
      <div id="__hacDocResult" style="font-size:12px;color:#888;margin-bottom:8px">Toca el bot\xF3n para escanear</div>
      <button onclick="__hacScanDoc()" style="width:100%;padding:8px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">
        \u{1F50D} Escanear documento
      </button>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__haciendaPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__hacInsert()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar c\xE9dula formateada</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__hacValid=null}function __hacValidate(value){const res=document.getElementById("__hacResult"),icon=document.getElementById("__hacIcon"),inp=document.getElementById("__hacInput");if(!value.trim()){res.innerHTML="",icon.textContent="";return}const result=WC_HACIENDA.detect(value);if(window.__hacValid=result,result.valid){icon.textContent="\u2705",inp.style.borderColor="#27ae60";const dv=result.tipo==="F\xEDsica"?WC_HACIENDA.digitoVerificador(value):null;res.innerHTML=`
      <div style="background:#f0fff4;border:1.5px solid #27ae60;border-radius:10px;padding:14px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:24px">\u2705</span>
          <div>
            <div style="font-size:14px;font-weight:700;color:#155724">C\xE9dula v\xE1lida</div>
            <div style="font-size:12px;color:#27ae60">${result.tipo}${result.subTipo?" \u2014 "+result.subTipo:""}</div>
          </div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#003da5;letter-spacing:2px;margin-bottom:8px">${result.formatted}</div>
        ${dv?`<div style="font-size:11px;color:${dv.coincide?"#27ae60":"#e74c3c"}">
          D\xEDgito verificador: calculado=${dv.calculado} \xB7 documento=${dv.documento} \xB7 ${dv.coincide?"\u2705 Coincide":"\u26A0\uFE0F No coincide"}
        </div>`:""}
      </div>`}else icon.textContent="\u274C",inp.style.borderColor="#e74c3c",res.innerHTML=`
      <div style="background:#fdf2f2;border:1.5px solid #e74c3c;border-radius:10px;padding:12px;color:#721c24;font-size:13px">
        \u274C ${result.msg||"C\xE9dula inv\xE1lida"}
      </div>`}function __hacScanDoc(){const ed=document.getElementById("editor"),res=document.getElementById("__hacDocResult");if(!ed||!res)return;const text=ed.innerText,patterns=[/\b\d{1}-\d{4}-\d{4}\b/g,/\b3-\d{3}-\d{6}\b/g,/\b\d{11,12}\b/g],found=new Set;if(patterns.forEach(p=>{const m=text.match(p);m&&m.forEach(c=>found.add(c))}),!found.size){res.textContent="No se encontraron c\xE9dulas en el documento";return}const results=[...found].map(c=>{const r=WC_HACIENDA.detect(c);return`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #eee">
      <span>${r.valid?"\u2705":"\u26A0\uFE0F"}</span>
      <span style="font-family:'Courier New',monospace;font-size:12px;font-weight:600">${r.formatted||c}</span>
      <span style="font-size:11px;color:#888">${r.tipo||"?"}</span>
    </div>`});res.innerHTML=`<div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:6px">${found.size} c\xE9dula${found.size!==1?"s":""} encontrada${found.size!==1?"s":""}</div>${results.join("")}`}function __hacInsert(){const d=window.__hacValid;if(!d||!d.valid){showToast("Ingres\xE1 una c\xE9dula v\xE1lida primero");return}typeof insertHTML=="function"&&insertHTML(`<span style="font-family:'Courier New',monospace;font-weight:600;color:#003da5">${d.formatted}</span>`),document.getElementById("__haciendaPanel").remove(),showToast("C\xE9dula insertada \u2705")}const WC_COLLAB={active:!1,userName:localStorage.getItem("wc-collab-name")||"Usuario",color:localStorage.getItem("wc-collab-color")||"#0084ff",roomId:null,cursors:{},ws:null,toggle(){this.active?this.leave():this.join()},join(){const name=prompt("Tu nombre en la sesi\xF3n:",this.userName);if(!name)return;this.userName=name,localStorage.setItem("wc-collab-name",name);const room=prompt("ID de sala (compart\xED este c\xF3digo con tus colaboradores):","sala-"+Math.random().toString(36).slice(2,8));room&&(this.roomId=room,this.active=!0,this._showCollabBar(),this._initBroadcastChannel(),showToast("\u{1F465} Modo colaborativo activo \u2014 Sala: "+room))},leave(){this.active=!1,this.bc&&this.bc.close();const bar=document.getElementById("__collabBar");bar&&bar.remove(),document.querySelectorAll(".__collabCursor").forEach(el=>el.remove()),showToast("Modo colaborativo desactivado")},_showCollabBar(){const old=document.getElementById("__collabBar");old&&old.remove();const bar=document.createElement("div");bar.id="__collabBar",bar.style.cssText=`
      position:fixed;top:0;left:0;right:0;z-index:9500;
      background:linear-gradient(135deg,#27ae60,#1e8449);
      color:#fff;padding:8px 16px;
      display:flex;align-items:center;gap:10px;
      font-family:-apple-system,'Segoe UI',sans-serif;font-size:13px;
    `,bar.innerHTML=`
      <span style="font-size:16px">\u{1F465}</span>
      <strong>Colaborando</strong>
      <span style="opacity:.8">\xB7</span>
      <span>Sala: <strong>${this.roomId}</strong></span>
      <span id="__collabUsers" style="background:rgba(255,255,255,.2);border-radius:20px;padding:2px 10px;font-size:11px">1 usuario</span>
      <span style="flex:1"></span>
      <button onclick="navigator.clipboard.writeText('${this.roomId}').then(()=>showToast('ID copiado \u2705'))"
        style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px">
        \u{1F4CB} Copiar ID
      </button>
      <button onclick="WC_COLLAB.leave()"
        style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px">
        \u2715 Salir
      </button>
    `,document.body.appendChild(bar);const header=document.querySelector(".header");header&&(header.style.marginTop="42px")},_initBroadcastChannel(){try{this.bc=new BroadcastChannel("wc-collab-"+this.roomId),this.bc.onmessage=e=>this._handleMessage(e.data);const ed=document.getElementById("editor");if(ed){let timer;ed.addEventListener("input",()=>{clearTimeout(timer),timer=setTimeout(()=>{this.bc.postMessage({type:"content",user:this.userName,color:this.color,content:ed.innerHTML,time:Date.now()})},500)}),ed.addEventListener("keyup",()=>{const sel=window.getSelection();sel&&sel.rangeCount&&this.bc.postMessage({type:"cursor",user:this.userName,color:this.color})})}this.bc.postMessage({type:"join",user:this.userName,color:this.color})}catch{showToast("\u26A0\uFE0F BroadcastChannel no disponible en este navegador")}},_handleMessage(data){if(data.type==="join"&&(showToast("\u{1F464} "+data.user+" se uni\xF3 a la sesi\xF3n"),this.cursors[data.user]=data,this._updateUserCount()),data.type==="content"&&data.user!==this.userName){if(!document.getElementById("editor"))return;if(!document.getElementById("__collabRemoteEdit")){const ind=document.createElement("div");ind.id="__collabRemoteEdit",ind.style.cssText=`position:fixed;top:52px;right:16px;z-index:9501;background:${data.color};color:#fff;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;transition:opacity .3s`,ind.textContent="\u270F\uFE0F "+data.user+" est\xE1 editando...",document.body.appendChild(ind),setTimeout(()=>{ind.parentElement&&ind.remove()},3e3)}}data.type==="cursor"&&(this.cursors[data.user]=data,this._updateUserCount())},_updateUserCount(){const count=Object.keys(this.cursors).length+1,el=document.getElementById("__collabUsers");el&&(el.textContent=count+" usuario"+(count!==1?"s":""))}};function openCollabPanel(){if(WC_COLLAB.active){WC_COLLAB.leave();return}const old=document.getElementById("__collabPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__collabPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F465} Colaboraci\xF3n en tiempo real</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Edit\xE1 el documento con otras personas simult\xE1neamente</div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
      <div>
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tu nombre</label>
        <input type="text" id="__collabName" placeholder="Nombre visible para colaboradores"
          value="${WC_COLLAB.userName}"
          style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tu color</label>
        <div style="display:flex;gap:8px">
          ${["#0084ff","#27ae60","#e74c3c","#f39c12","#9b59b6","#1abc9c"].map(c=>`
            <div onclick="__collabSelectColor('${c}',this)"
              style="width:32px;height:32px;border-radius:50%;background:${c};cursor:pointer;border:3px solid ${WC_COLLAB.color===c?"#1a2942":"transparent"};transition:all .15s"
              data-color="${c}"></div>`).join("")}
        </div>
      </div>
      <div>
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">ID de sala</label>
        <div style="display:flex;gap:6px">
          <input type="text" id="__collabRoom" placeholder="Crear nueva o pegar c\xF3digo"
            value="sala-${Math.random().toString(36).slice(2,8)}"
            style="flex:1;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;font-family:'Courier New',monospace"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
          <button onclick="document.getElementById('__collabRoom').value='sala-'+Math.random().toString(36).slice(2,8)"
            style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px">\u{1F504}</button>
        </div>
      </div>
    </div>

    <div style="background:#f0fff4;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#155724;line-height:1.6">
      \u{1F4A1} <strong>C\xF3mo funciona:</strong> Compart\xED el ID de sala con tus colaboradores. Todos deben abrir el mismo documento y unirse con el mismo ID. Los cambios se sincronizan entre las pesta\xF1as del navegador.
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__collabPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__startCollab()" style="flex:2;padding:11px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F465} Iniciar colaboraci\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __collabSelectColor(color,el){WC_COLLAB.color=color,localStorage.setItem("wc-collab-color",color),document.querySelectorAll("[data-color]").forEach(d=>d.style.borderColor="transparent"),el.style.borderColor="#1a2942"}function __startCollab(){WC_COLLAB.userName=document.getElementById("__collabName").value.trim()||"Usuario",WC_COLLAB.roomId=document.getElementById("__collabRoom").value.trim(),localStorage.setItem("wc-collab-name",WC_COLLAB.userName),document.getElementById("__collabPanel").remove(),WC_COLLAB.active=!0,WC_COLLAB._showCollabBar(),WC_COLLAB._initBroadcastChannel(),showToast("\u{1F465} Colaboraci\xF3n iniciada \xB7 Sala: "+WC_COLLAB.roomId)}function openEquationEditor(){const old=document.getElementById("__eqPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__eqPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const symbols={B\u00E1sico:["\xD7","\xF7","\xB1","\u2260","\u2248","\u2264","\u2265","\u221E","\u221A","\u221B","\u03C0","\u2211","\u220F","\u222B","\u2202","\u2206"],Griego:["\u03B1","\u03B2","\u03B3","\u03B4","\u03B5","\u03B6","\u03B7","\u03B8","\u03BB","\u03BC","\u03BD","\u03BE","\u03C1","\u03C3","\u03C4","\u03C6","\u03C8","\u03C9","\u03A9","\u03A0","\u03A3","\u0394"],Flechas:["\u2192","\u2190","\u2191","\u2193","\u2194","\u21D2","\u21D0","\u21D4","\u21D1","\u21D3"],L\u00F3gica:["\u2200","\u2203","\u2208","\u2209","\u2282","\u2283","\u222A","\u2229","\u2295","\xAC","\u2227","\u2228"],Geometr\u00EDa:["\xB0","\u22A5","\u2225","\u2220","\u25B3","\u25A1","\u25C7","\u2299","\u2218"]},templates=[{name:"Fracci\xF3n",latex:"a/b",html:"<sup>a</sup>/<sub>b</sub>"},{name:"Potencia",latex:"x\xB2",html:"x<sup>2</sup>"},{name:"Ra\xEDz cuadrada",latex:"\u221Ax",html:"\u221Ax"},{name:"Suma \u03A3",latex:"\u03A3x",html:"\u03A3x"},{name:"Integral \u222B",latex:"\u222Bf(x)dx",html:"\u222Bf(x)dx"},{name:"L\xEDmite",latex:"lim x\u2192\u221E",html:"lim<sub>x\u2192\u221E</sub>"},{name:"Derivada",latex:"f'(x)",html:"f'(x)"},{name:"Vectores",latex:"\u2192v",html:'<span style="text-decoration:overline">v</span>'},{name:"Sistema ec.",latex:"{a+b=c;x+y=z}",html:"{a+b=c<br>&nbsp;x+y=z}"},{name:"Binomio",latex:"(a+b)\xB2=a\xB2+2ab+b\xB2",html:"(a+b)\xB2=a\xB2+2ab+b\xB2"}];let symHTML="";Object.entries(symbols).forEach(([cat,syms])=>{symHTML+=`<div style="margin-bottom:10px">
      <div style="font-size:10px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">${cat}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${syms.map(s=>`<button onclick="__eqInsertSymbol('${s}')" style="width:32px;height:32px;border:1.5px solid #eee;background:#fafafa;border-radius:6px;cursor:pointer;font-size:15px;transition:all .12s;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='#f0f7ff';this.style.borderColor='#0084ff'" onmouseout="this.style.background='#fafafa';this.style.borderColor='#eee'" title="${s}">${s}</button>`).join("")}
      </div>
    </div>`}),ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2211 Editor de ecuaciones</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">S\xEDmbolos matem\xE1ticos y plantillas</div>

      <!-- Preview -->
      <div style="background:#1a1a2e;border-radius:10px;padding:14px;margin-bottom:12px;text-align:center;min-height:60px;display:flex;align-items:center;justify-content:center">
        <div id="__eqPreview" style="font-size:22px;color:#fff;font-family:'Times New Roman',serif;letter-spacing:2px">Ecuaci\xF3n aqu\xED</div>
      </div>

      <!-- Input -->
      <input type="text" id="__eqInput" placeholder="Escrib\xED o toca los s\xEDmbolos..."
        style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;font-family:'Times New Roman',serif;margin-bottom:12px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__eqUpdate(this.value)">

      <!-- Plantillas -->
      <div style="font-size:10px;font-weight:700;color:#aaa;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">Plantillas r\xE1pidas</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${templates.map(t=>`<button onclick="__eqUseTemplate('${t.latex.replace(/'/g,"\\'")}')"
          style="padding:5px 10px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'" onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">${t.name}</button>`).join("")}
      </div>
    </div>

    <!-- S\xEDmbolos -->
    <div style="flex:1;overflow-y:auto;padding:0 20px">${symHTML}</div>

    <div style="padding:14px 20px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__eqPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__eqInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2211 Insertar ecuaci\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __eqInsertSymbol(sym){const inp=document.getElementById("__eqInput");inp&&(inp.value+=sym,__eqUpdate(inp.value),inp.focus())}function __eqUseTemplate(tmpl){const inp=document.getElementById("__eqInput");inp&&(inp.value=tmpl,__eqUpdate(tmpl))}function __eqUpdate(val){const prev=document.getElementById("__eqPreview");prev&&(prev.textContent=val||"Ecuaci\xF3n aqu\xED")}function __eqInsert(){const val=document.getElementById("__eqInput").value.trim();if(!val){showToast("Escrib\xED una ecuaci\xF3n");return}const html=`<span style="font-family:'Times New Roman',serif;font-size:14pt;background:#f8f9ff;border:1px solid #c0d0f0;border-radius:6px;padding:3px 10px;display:inline-block;margin:2px">${val}</span>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__eqPanel").remove(),showToast("\u2211 Ecuaci\xF3n insertada \u2705")}function openYouTubePanel(){const old=document.getElementById("__ytPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ytPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u25B6\uFE0F Insertar video de YouTube
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">El video se incrusta directamente en el documento</div>

    <input type="text" id="__ytUrl"
      placeholder="https://www.youtube.com/watch?v=... \xF3 youtu.be/..."
      style="width:100%;padding:11px 14px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:12px"
      onfocus="this.style.borderColor='#ff0000'" onblur="this.style.borderColor='#e0e0e0'"
      oninput="__ytPreview(this.value)">

    <div id="__ytPreviewBox" style="background:#000;border-radius:10px;overflow:hidden;margin-bottom:14px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center">
      <div style="color:#555;font-size:13px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">\u25B6\uFE0F</div>
        Peg\xE1 el link del video
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tama\xF1o</label>
        <select id="__ytSize" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="480x270">Peque\xF1o (480px)</option>
          <option value="640x360" selected>Mediano (640px)</option>
          <option value="854x480">Grande (854px)</option>
          <option value="100%x315">Ancho completo</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Inicio en</label>
        <input type="number" id="__ytStart" placeholder="Segundos (0)" min="0" value="0"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="__ytCaption" checked style="accent-color:#ff0000">
        <span style="font-size:13px;color:#555">Mostrar t\xEDtulo del video</span>
      </label>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="__ytAutoplay" style="accent-color:#ff0000">
        <span style="font-size:13px;color:#555">Reproducir autom\xE1ticamente</span>
      </label>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__ytPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__ytInsert()" style="flex:2;padding:11px;border:none;background:#ff0000;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u25B6\uFE0F Insertar video</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __ytExtractId(url){const patterns=[/youtube\.com\/watch\?v=([^&\s]+)/,/youtu\.be\/([^?\s]+)/,/youtube\.com\/embed\/([^?\s]+)/,/youtube\.com\/shorts\/([^?\s]+)/];for(const p of patterns){const m=url.match(p);if(m)return m[1]}return null}function __ytPreview(url){const id=__ytExtractId(url),box=document.getElementById("__ytPreviewBox");if(box){if(!id){box.innerHTML='<div style="color:#555;font-size:13px;text-align:center"><div style="font-size:40px;margin-bottom:8px">\u25B6\uFE0F</div>Peg\xE1 el link del video</div>';return}box.innerHTML=`<img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" style="width:100%;display:block" onerror="this.style.display='none'">`}}function __ytInsert(){const url=document.getElementById("__ytUrl").value.trim(),id=__ytExtractId(url);if(!id){showToast("URL de YouTube inv\xE1lida");return}const sizeVal=document.getElementById("__ytSize").value,[w,h]=sizeVal.split("x"),start=parseInt(document.getElementById("__ytStart").value)||0,caption=document.getElementById("__ytCaption").checked,autoplay=document.getElementById("__ytAutoplay").checked,src=`https://www.youtube.com/embed/${id}?${start?"start="+start+"&":""}${autoplay?"autoplay=1&":""}rel=0`,html=`
  <div style="margin:12px 0;text-align:center">
    <div style="position:relative;padding-bottom:${w==="100%"?"56.25%":"0"};${w==="100%"?"height:0;overflow:hidden;":""}border-radius:10px;overflow:hidden;background:#000;display:${w==="100%"?"block":"inline-block"};${w!=="100%"?"width:"+w+"px;":""}" >
      <iframe src="${src}"
        width="${w==="100%"?"100%":w}" height="${w==="100%"?"100%":h}"
        style="${w==="100%"?"position:absolute;top:0;left:0;":""};border:none;border-radius:10px"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
        allowfullscreen loading="lazy">
      </iframe>
    </div>
    ${caption?`<div style="font-size:10px;color:#888;margin-top:4px">\u{1F4FA} youtube.com/watch?v=${id}</div>`:""}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__ytPanel").remove(),showToast("\u25B6\uFE0F Video insertado \u2705")}function openDocxReader(){const old=document.getElementById("__docxPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__docxPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <span style="font-size:24px">\u{1F4C4}</span> Abrir documento Word
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:18px">Convierte archivos .docx al editor</div>

    <div style="border:2px dashed #c0d8f0;border-radius:14px;padding:30px;text-align:center;margin-bottom:16px;cursor:pointer;background:#f8f9ff;transition:all .2s"
      onclick="document.getElementById('__docxInput').click()"
      ondragover="event.preventDefault();this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
      ondragleave="this.style.borderColor='#c0d8f0';this.style.background='#f8f9ff'"
      ondrop="event.preventDefault();__docxLoad(event.dataTransfer.files[0]);this.style.borderColor='#c0d8f0'">
      <div style="font-size:48px;margin-bottom:10px">\u{1F4C4}</div>
      <div style="font-size:14px;font-weight:600;color:#1a2942;margin-bottom:4px">Toc\xE1 para seleccionar o arrastr\xE1</div>
      <div style="font-size:12px;color:#888">Archivos .docx \xB7 .doc</div>
    </div>
    <input type="file" id="__docxInput" accept=".docx,.doc" style="display:none" onchange="__docxLoad(this.files[0])">

    <div id="__docxProgress" style="display:none;background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:14px;text-align:center;color:#0084ff;font-size:13px">
      \u23F3 Convirtiendo documento...
    </div>

    <div id="__docxPreview" style="display:none;background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:14px;max-height:180px;overflow-y:auto;font-size:12px;color:#555"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__docxPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button id="__docxInsertBtn" onclick="__docxInsert()" disabled style="flex:2;padding:11px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:14px;font-weight:600">\u{1F4C4} Abrir en editor</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__docxContent=null}async function __docxLoad(file){if(!file)return;const prog=document.getElementById("__docxProgress"),preview=document.getElementById("__docxPreview"),btn=document.getElementById("__docxInsertBtn");prog&&(prog.style.display="block");try{if(typeof mammoth<"u"){const arrayBuffer=await file.arrayBuffer(),result=await mammoth.convertToHtml({arrayBuffer});window.__docxContent=result.value,prog&&(prog.style.display="none"),preview&&(preview.style.display="block",preview.innerHTML=result.value.substring(0,500)+"..."),btn&&(btn.disabled=!1,btn.style.background="#0084ff",btn.style.cursor="pointer"),showToast("\u{1F4C4} Documento cargado \u2705")}else{const script=document.createElement("script");script.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",script.onload=()=>__docxLoad(file),script.onerror=()=>{prog&&(prog.innerHTML="\u26A0\uFE0F Librer\xEDa no disponible. Intentando m\xE9todo alternativo...");const reader=new FileReader;reader.onload=e=>{const extracted=e.target.result.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();window.__docxContent="<p>"+extracted.substring(0,5e3)+"</p>",prog&&(prog.style.display="none"),preview&&(preview.style.display="block",preview.textContent=extracted.substring(0,300)+"..."),btn&&(btn.disabled=!1,btn.style.background="#f39c12",btn.style.cursor="pointer",btn.textContent="\u26A0\uFE0F Abrir (formato limitado)")},reader.readAsText(file)},document.head.appendChild(script)}}catch(e){prog&&(prog.innerHTML="\u274C Error: "+e.message),showToast("Error al leer el archivo: "+e.message)}}function __docxInsert(){if(!window.__docxContent)return;const ed=document.getElementById("editor");if(!ed)return;confirm(`\xBFReemplazar el contenido actual del editor?

Aceptar = reemplazar
Cancelar = agregar al final`)?ed.innerHTML=window.__docxContent:ed.innerHTML+=window.__docxContent,document.getElementById("__docxPanel").remove(),showToast("\u{1F4C4} Documento Word abierto \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"haciendaCR":openHaciendaPanel();break;case"collaborate":openCollabPanel();break;case"equations":openEquationEditor();break;case"youtubeEmbed":openYouTubePanel();break;case"openDocx":openDocxReader();break;default:orig(a)}}),console.log("WC Corporate Editor v25.13 \u2705 \u2014 Hacienda CR, Colaboraci\xF3n, Ecuaciones, YouTube, Word .docx")},2100)})();function exportToDocx(){const ed=document.getElementById("editor");if(!ed)return;showToast("Generando Word...");const title=ed.querySelector("h1")?.innerText?.slice(0,40)||"documento",html=ed.innerHTML,xmlContent=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 wp14">
  <w:body>
    ${__htmlToWordXML(html)}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800" w:header="720" w:footer="720"/>
    </w:sectPr>
  </w:body>
</w:document>`,styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="160"/></w:pPr><w:rPr><w:sz w:val="24"/><w:lang w:val="es-CR"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:pPr><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="1a2942"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:pPr><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="0084ff"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
</w:styles>`,rels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`,appRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;if(typeof JSZip<"u"){const zip=new JSZip;zip.file("[Content_Types].xml",contentTypes),zip.file("_rels/.rels",appRels),zip.file("word/document.xml",xmlContent),zip.file("word/styles.xml",styles),zip.file("word/_rels/document.xml.rels",rels),zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}).then(blob=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=title+".docx",a.click(),showToast("\u{1F4C4} Exportado a Word \u2705")})}else{const script=document.createElement("script");script.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",script.onload=exportToDocx,script.onerror=()=>{const rtf=__htmlToRTF(ed.innerHTML),blob=new Blob([rtf],{type:"application/rtf"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=title+".rtf",a.click(),showToast("\u{1F4C4} Exportado como RTF (compatible con Word) \u2705")},document.head.appendChild(script)}}function __htmlToWordXML(html){const div=document.createElement("div");div.innerHTML=html;let xml="";const processNode=node=>{if(node.nodeType===3)return`<w:r><w:t xml:space="preserve">${node.textContent.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</w:t></w:r>`;if(node.nodeType!==1)return"";const tag=node.tagName.toLowerCase(),children=Array.from(node.childNodes).map(processNode).join("");switch(tag){case"h1":return`<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="40"/></w:rPr><w:t>${node.innerText||""}</w:t></w:r></w:p>`;case"h2":return`<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>${node.innerText||""}</w:t></w:r></w:p>`;case"h3":return`<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>${node.innerText||""}</w:t></w:r></w:p>`;case"p":return`<w:p><w:pPr><w:spacing w:after="160"/></w:pPr>${children}</w:p>`;case"strong":case"b":return`<w:r><w:rPr><w:b/></w:rPr><w:t>${node.innerText||""}</w:t></w:r>`;case"em":case"i":return`<w:r><w:rPr><w:i/></w:rPr><w:t>${node.innerText||""}</w:t></w:r>`;case"u":return`<w:r><w:rPr><w:u w:val="single"/></w:rPr><w:t>${node.innerText||""}</w:t></w:r>`;case"br":return"<w:p/>";case"li":return`<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>${node.innerText||""}</w:t></w:r></w:p>`;case"blockquote":return`<w:p><w:pPr><w:ind w:left="720"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="555555"/></w:rPr><w:t>${node.innerText||""}</w:t></w:r></w:p>`;default:return children||`<w:p><w:r><w:t>${node.innerText||""}</w:t></w:r></w:p>`}};return Array.from(div.childNodes).forEach(n=>{xml+=processNode(n)}),xml||"<w:p><w:r><w:t> </w:t></w:r></w:p>"}function __htmlToRTF(html){const div=document.createElement("div");return div.innerHTML=html,`{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Calibri;}}\\f0\\fs24 ${div.innerText.replace(/\n/g,"\\par ")}}`}function exportToEPUB(){const ed=document.getElementById("editor");if(!ed)return;showToast("Generando EPUB...");const titleEl=ed.querySelector("h1"),title=titleEl?titleEl.innerText.trim():"Mi documento",author=typeof WC_FIELDS<"u"&&WC_FIELDS.data.autor||"Autor",uuid="wc-"+Date.now(),now=new Date().toISOString().split("T")[0],html=ed.innerHTML,contentOpf=`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:creator opf:role="aut">${author}</dc:creator>
    <dc:identifier id="bookid">urn:uuid:${uuid}</dc:identifier>
    <dc:language>es-CR</dc:language>
    <dc:date>${now}</dc:date>
    <dc:publisher>WC Corporate Editor</dc:publisher>
  </metadata>
  <manifest>
    <item id="content" href="content.html" media-type="application/xhtml+xml"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="style.css" media-type="text/css"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`,tocNcx=`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head><meta name="dtb:uid" content="urn:uuid:${uuid}"/></head>
  <docTitle><text>${title}</text></docTitle>
  <navMap><navPoint id="p1" playOrder="1"><navLabel><text>${title}</text></navLabel><content src="content.html"/></navPoint></navMap>
</ncx>`,contentHtml=`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${title}</title><link rel="stylesheet" href="style.css"/></head>
<body>${html.replace(/<script[^>]*>.*?<\/script>/gsi,"").replace(/style="[^"]*"/g,"")}</body></html>`,css=`body{font-family:Georgia,serif;font-size:1em;line-height:1.6;margin:1em;color:#333}
h1{font-size:2em;color:#003da5;border-bottom:2px solid #003da5;padding-bottom:.3em}
h2{font-size:1.5em;color:#0084ff}h3{font-size:1.2em}
p{margin:.8em 0;text-align:justify}
table{border-collapse:collapse;width:100%;margin:1em 0}
td,th{border:1px solid #ccc;padding:.4em .6em}
blockquote{border-left:4px solid #0084ff;padding:.5em 1em;color:#555;font-style:italic}`,container=`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`,mimeType="application/epub+zip";if(typeof JSZip<"u"){const zip=new JSZip;zip.file("mimetype",mimeType),zip.file("META-INF/container.xml",container),zip.file("OEBPS/content.opf",contentOpf),zip.file("OEBPS/toc.ncx",tocNcx),zip.file("OEBPS/content.html",contentHtml),zip.file("OEBPS/style.css",css),zip.generateAsync({type:"blob"}).then(blob=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=title+".epub",a.click(),showToast("\u{1F4DA} Exportado a EPUB \u2705")})}else{const script=document.createElement("script");script.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",script.onload=exportToEPUB,document.head.appendChild(script)}}function openSocialTemplates(){const old=document.getElementById("__socialPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__socialPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";const templates=[{id:"ig-post",name:"Instagram Post",w:1080,h:1080,icon:"\u{1F4F8}",net:"Instagram"},{id:"ig-story",name:"Instagram Story",w:1080,h:1920,icon:"\u{1F4F1}",net:"Instagram"},{id:"fb-post",name:"Facebook Post",w:1200,h:630,icon:"\u{1F464}",net:"Facebook"},{id:"fb-cover",name:"Facebook Portada",w:820,h:312,icon:"\u{1F5BC}\uFE0F",net:"Facebook"},{id:"tw-post",name:"Twitter/X Post",w:1200,h:675,icon:"\u{1F426}",net:"Twitter/X"},{id:"tw-header",name:"Twitter Header",w:1500,h:500,icon:"\u{1F3AF}",net:"Twitter/X"},{id:"li-post",name:"LinkedIn Post",w:1200,h:627,icon:"\u{1F4BC}",net:"LinkedIn"},{id:"li-banner",name:"LinkedIn Banner",w:1584,h:396,icon:"\u{1F3E2}",net:"LinkedIn"},{id:"yt-thumb",name:"YouTube Miniatura",w:1280,h:720,icon:"\u25B6\uFE0F",net:"YouTube"},{id:"wa-status",name:"WhatsApp Status",w:1080,h:1920,icon:"\u{1F4AC}",net:"WhatsApp"}],themes=[{id:"gradient-blue",name:"Azul CR",bg:"linear-gradient(135deg,#003da5,#0084ff)",text:"#fff"},{id:"gradient-green",name:"Verde",bg:"linear-gradient(135deg,#27ae60,#1abc9c)",text:"#fff"},{id:"dark-elegant",name:"Oscuro",bg:"linear-gradient(135deg,#1a1a2e,#16213e)",text:"#e0e0e0"},{id:"gold-premium",name:"Dorado",bg:"linear-gradient(135deg,#1a1a2e,#f39c12)",text:"#fff"},{id:"cr-flag",name:"Costa Rica",bg:"linear-gradient(180deg,#003da5 20%,#fff 20%,#fff 40%,#ce1126 40%,#ce1126 60%,#fff 60%,#fff 80%,#003da5 80%)",text:"#1a2942"},{id:"white-clean",name:"Blanco",bg:"#ffffff",text:"#1a2942"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:600px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4F1} Plantillas para redes sociales</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Crea im\xE1genes profesionales para publicar</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${templates.map(t=>`
          <button onclick="__socialSelect('${t.id}',this)"
            class="__socialTpl"
            style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:left;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
            onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
            <span style="font-size:18px">${t.icon}</span>
            <div>
              <div style="font-size:12px;font-weight:700;color:#1a1a1a">${t.name}</div>
              <div style="font-size:10px;color:#888">${t.w}\xD7${t.h}px</div>
            </div>
          </button>`).join("")}
      </div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${themes.map(t=>`
          <button onclick="__socialTheme('${t.id}',this)"
            class="__socialThemeBtn"
            style="padding:6px 12px;border:2px solid #eee;background:#fafafa;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff'" onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
            ${t.name}
          </button>`).join("")}
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
        <input type="text" id="__socialTitle" placeholder="T\xEDtulo principal"
          style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;font-weight:700;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__socialUpdatePreview()">
        <input type="text" id="__socialSubtitle" placeholder="Subt\xEDtulo o descripci\xF3n"
          style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__socialUpdatePreview()">
        <input type="text" id="__socialHandle" placeholder="@usuario o #hashtag"
          style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__socialUpdatePreview()">
      </div>
    </div>

    <!-- Preview -->
    <div style="padding:0 20px;flex-shrink:0">
      <div id="__socialPreview" style="border-radius:12px;overflow:hidden;aspect-ratio:1;background:linear-gradient(135deg,#003da5,#0084ff);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;text-align:center;color:#fff;transition:all .3s">
        <div id="__socialPrevTitle" style="font-size:24px;font-weight:900;line-height:1.2;margin-bottom:10px">Tu t\xEDtulo aqu\xED</div>
        <div id="__socialPrevSub" style="font-size:14px;opacity:.85;margin-bottom:16px"></div>
        <div id="__socialPrevHandle" style="font-size:12px;opacity:.7"></div>
        <div style="position:absolute;bottom:12px;right:14px;font-size:9px;opacity:.4">WC Corporate Editor</div>
      </div>
    </div>

    <div style="padding:14px 20px 20px;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__socialPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__socialInsert()" style="flex:1;padding:11px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4E5} Insertar</button>
      <button onclick="__socialExport()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4F8} Exportar imagen</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__socialConfig={tpl:"ig-post",theme:"gradient-blue",w:1080,h:1080,bg:"linear-gradient(135deg,#003da5,#0084ff)",textColor:"#fff"},setTimeout(()=>{const t1=document.querySelector(".__socialTpl");t1&&(t1.style.borderColor="#0084ff",t1.style.background="#f0f7ff",t1.dataset.sel="1");const t2=document.querySelector(".__socialThemeBtn");t2&&(t2.style.borderColor="#0084ff",t2.style.background="#f0f7ff",t2.dataset.sel="1")},50)}const __socialTemplates=[{id:"ig-post",w:1080,h:1080},{id:"ig-story",w:1080,h:1920},{id:"fb-post",w:1200,h:630},{id:"fb-cover",w:820,h:312},{id:"tw-post",w:1200,h:675},{id:"tw-header",w:1500,h:500},{id:"li-post",w:1200,h:627},{id:"li-banner",w:1584,h:396},{id:"yt-thumb",w:1280,h:720},{id:"wa-status",w:1080,h:1920}],__socialThemes=[{id:"gradient-blue",bg:"linear-gradient(135deg,#003da5,#0084ff)",text:"#fff"},{id:"gradient-green",bg:"linear-gradient(135deg,#27ae60,#1abc9c)",text:"#fff"},{id:"dark-elegant",bg:"linear-gradient(135deg,#1a1a2e,#16213e)",text:"#e0e0e0"},{id:"gold-premium",bg:"linear-gradient(135deg,#1a1a2e,#f39c12)",text:"#fff"},{id:"cr-flag",bg:"linear-gradient(180deg,#003da5 20%,#fff 20%,#fff 40%,#ce1126 40%,#ce1126 60%,#fff 60%,#fff 80%,#003da5 80%)",text:"#1a2942"},{id:"white-clean",bg:"#ffffff",text:"#1a2942"}];function __socialSelect(id,btn){const tpl=__socialTemplates.find(t=>t.id===id);tpl&&(window.__socialConfig.tpl=id,window.__socialConfig.w=tpl.w,window.__socialConfig.h=tpl.h),document.querySelectorAll(".__socialTpl").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1",__socialUpdatePreview()}function __socialTheme(id,btn){const th=__socialThemes.find(t=>t.id===id);th&&(window.__socialConfig.bg=th.bg,window.__socialConfig.textColor=th.text),document.querySelectorAll(".__socialThemeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1",__socialUpdatePreview()}function __socialUpdatePreview(){const c=window.__socialConfig||{},prev=document.getElementById("__socialPreview"),t=document.getElementById("__socialPrevTitle"),s=document.getElementById("__socialPrevSub"),h=document.getElementById("__socialPrevHandle"),ar=c.w&&c.h?c.w/c.h:1;prev&&(prev.style.background=c.bg||"",prev.style.color=c.textColor||"#fff",prev.style.aspectRatio=ar),t&&(t.style.color=c.textColor||"#fff"),s&&(s.style.color=c.textColor||"#fff",s.textContent=document.getElementById("__socialSubtitle")?.value||""),h&&(h.style.color=c.textColor||"#fff",h.textContent=document.getElementById("__socialHandle")?.value||""),t&&(t.textContent=document.getElementById("__socialTitle")?.value||"Tu t\xEDtulo aqu\xED")}function __socialInsert(){const c=window.__socialConfig||{},title=document.getElementById("__socialTitle")?.value||"T\xEDtulo",sub=document.getElementById("__socialSubtitle")?.value||"",hand=document.getElementById("__socialHandle")?.value||"",html=`<div style="background:${c.bg};border-radius:12px;padding:40px;text-align:center;color:${c.textColor};margin:12px 0;max-width:${Math.min(c.w,500)}px">
    <div style="font-size:22px;font-weight:900;line-height:1.2;margin-bottom:10px">${title}</div>
    ${sub?`<div style="font-size:14px;opacity:.85;margin-bottom:10px">${sub}</div>`:""}
    ${hand?`<div style="font-size:12px;opacity:.7">${hand}</div>`:""}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__socialPanel").remove(),showToast("Plantilla insertada \u2705")}function __socialExport(){const prev=document.getElementById("__socialPreview");if(!prev)return;const c=window.__socialConfig||{};showToast(`Generando imagen ${c.w}\xD7${c.h}px...`),typeof html2canvas<"u"?html2canvas(prev,{scale:2,backgroundColor:null,useCORS:!0}).then(canvas=>{const a=document.createElement("a");a.href=canvas.toDataURL("image/png"),a.download=`social-${c.tpl}-${Date.now()}.png`,a.click(),showToast("\u{1F4F8} Imagen exportada \u2705")}):showToast("Funci\xF3n disponible en la versi\xF3n completa. Insert\xE1 la plantilla y export\xE1 desde el men\xFA Exportar PNG.")}function openCoverEditor(){const old=document.getElementById("__coverEdPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__coverEdPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:12px";const elements=[{type:"title",label:"\u{1F4DD} T\xEDtulo",default:"MI DOCUMENTO"},{type:"subtitle",label:"\u{1F4C4} Subt\xEDtulo",default:"Subt\xEDtulo o descripci\xF3n"},{type:"author",label:"\u{1F464} Autor",default:"Nombre del autor"},{type:"date",label:"\u{1F4C5} Fecha",default:new Date().toLocaleDateString("es-CR",{month:"long",year:"numeric"})},{type:"org",label:"\u{1F3E2} Organizaci\xF3n",default:"Empresa o instituci\xF3n"},{type:"icon",label:"\u{1F3A8} \xCDcono/Emoji",default:"\u{1F4C4}"}],bgs=[{name:"Azul CR",val:"linear-gradient(135deg,#003da5 0%,#0084ff 100%)"},{name:"Verde",val:"linear-gradient(135deg,#1a472a 0%,#27ae60 100%)"},{name:"Noche",val:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)"},{name:"Dorado",val:"linear-gradient(135deg,#f6d365,#fda085)"},{name:"Marino",val:"linear-gradient(135deg,#2c3e50,#3498db)"},{name:"CR Bandera",val:"linear-gradient(180deg,#003da5 25%,#fff 25%,#fff 45%,#ce1126 45%,#ce1126 55%,#fff 55%,#fff 75%,#003da5 75%)"},{name:"Rojo",val:"linear-gradient(135deg,#8b0000,#c0392b)"},{name:"Blanco",val:"#ffffff"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;width:100%;max-width:640px;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:12px">\u{1F3A8} Editor de portada</div>

      <div style="display:flex;gap:12px">
        <!-- Controles -->
        <div style="flex:1;min-width:0">
          ${elements.map(el=>`
            <div style="margin-bottom:8px">
              <label style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">${el.label}</label>
              <input type="text" id="__cov_${el.type}" value="${el.default}"
                style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
                oninput="__covUpdate()">
            </div>`).join("")}

          <div style="margin-bottom:8px">
            <label style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px">\u{1F3A8} Fondo</label>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${bgs.map((b,i)=>`
                <div onclick="__covSetBg('${b.val.replace(/'/g,"\\'")}',this)"
                  class="__covBgBtn"
                  style="width:28px;height:28px;border-radius:6px;cursor:pointer;background:${b.val};border:3px solid ${i===0?"#1a2942":"transparent"};transition:all .15s"
                  title="${b.name}" ${i===0?'data-sel="1"':""}></div>`).join("")}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
            <div>
              <label style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">Color texto</label>
              <div style="display:flex;gap:4px">
                ${["#ffffff","#1a2942","#f8f9fa","#e2b96f","#74b9ff"].map(c=>`
                  <div onclick="__covSetText('${c}',this)" class="__covTextBtn"
                    style="width:24px;height:24px;border-radius:50%;background:${c};cursor:pointer;border:2px solid ${c==="#ffffff"?"#1a2942":"transparent"}"
                    data-color="${c}"></div>`).join("")}
              </div>
            </div>
            <div>
              <label style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">Estilo</label>
              <select id="__covStyle" onchange="__covUpdate()" style="width:100%;padding:5px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:11px;outline:none">
                <option value="centered">Centrado</option>
                <option value="left">Izquierda</option>
                <option value="bottom">Pie</option>
                <option value="split">Dividido</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div style="width:160px;flex-shrink:0">
          <div id="__covPreview" style="background:linear-gradient(135deg,#003da5,#0084ff);border-radius:10px;aspect-ratio:8.5/11;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;text-align:center;color:#fff;position:relative;overflow:hidden;transition:all .3s">
            <div id="__covPrevIcon" style="font-size:28px;margin-bottom:8px">\u{1F4C4}</div>
            <div id="__covPrevTitle" style="font-size:11px;font-weight:900;line-height:1.2;margin-bottom:4px">MI DOCUMENTO</div>
            <div id="__covPrevSub" style="font-size:8px;opacity:.8;margin-bottom:4px"></div>
            <div style="width:30px;height:2px;background:currentColor;opacity:.4;margin:4px 0"></div>
            <div id="__covPrevAuthor" style="font-size:7px;opacity:.7"></div>
            <div id="__covPrevDate" style="font-size:7px;opacity:.6"></div>
            <div id="__covPrevOrg" style="font-size:7px;opacity:.5;position:absolute;bottom:8px"></div>
          </div>
          <div style="font-size:9px;color:#aaa;text-align:center;margin-top:4px">Vista previa</div>
        </div>
      </div>
    </div>

    <div style="padding:14px 18px 18px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:12px">
      <button onclick="document.getElementById('__coverEdPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__covInsert()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3A8} Insertar portada</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__covConfig={bg:"linear-gradient(135deg,#003da5 0%,#0084ff 100%)",textColor:"#ffffff"},setTimeout(__covUpdate,100)}function __covSetBg(val,el){window.__covConfig.bg=val,document.querySelectorAll(".__covBgBtn").forEach(b=>{b.style.borderColor="transparent",delete b.dataset.sel}),el.style.borderColor="#1a2942",el.dataset.sel="1",__covUpdate()}function __covSetText(color,el){window.__covConfig.textColor=color,document.querySelectorAll(".__covTextBtn").forEach(b=>b.style.borderColor="transparent"),el.style.borderColor="#1a2942",__covUpdate()}function __covUpdate(){const c=window.__covConfig||{},prev=document.getElementById("__covPreview");prev&&(prev.style.background=c.bg,prev.style.color=c.textColor||"#fff"),["icon","title","sub","author","date","org"].forEach(k=>{const el=document.getElementById("__covPrev"+k.charAt(0).toUpperCase()+k.slice(1)),input=document.getElementById("__cov_"+(k==="sub"?"subtitle":k==="icon"?"icon":k));el&&input&&(el.textContent=input.value)})}function __covInsert(){const c=window.__covConfig||{},title=document.getElementById("__cov_title")?.value||"Documento",subtitle=document.getElementById("__cov_subtitle")?.value||"",author=document.getElementById("__cov_author")?.value||"",date=document.getElementById("__cov_date")?.value||"",org=document.getElementById("__cov_org")?.value||"",icon=document.getElementById("__cov_icon")?.value||"\u{1F4C4}",textColor=c.textColor||"#fff",html=`<div style="background:${c.bg};border-radius:0;min-height:26cm;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3cm 2cm;text-align:center;color:${textColor};page-break-after:always;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:48px;margin-bottom:1cm">${icon}</div>
    <div style="width:60px;height:3px;background:currentColor;opacity:.4;margin-bottom:1cm"></div>
    <h1 style="font-size:24pt;font-weight:900;color:${textColor};margin:0 0 0.5cm;line-height:1.2;letter-spacing:1px">${title}</h1>
    ${subtitle?`<p style="font-size:13pt;color:${textColor};opacity:.85;margin:0 0 1.5cm;font-style:italic">${subtitle}</p>`:'<div style="margin-bottom:1.5cm"></div>'}
    <div style="width:40px;height:2px;background:currentColor;opacity:.3;margin-bottom:1cm"></div>
    ${author?`<p style="font-size:12pt;color:${textColor};font-weight:600;margin:0 0 0.2cm">${author}</p>`:""}
    ${date?`<p style="font-size:11pt;color:${textColor};opacity:.7;margin:0">${date}</p>`:""}
    ${org?`<p style="font-size:10pt;color:${textColor};opacity:.5;position:absolute;bottom:1cm">${org}</p>`:""}
  </div><p></p>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__coverEdPanel").remove(),showToast("\u{1F3A8} Portada insertada \u2705")}function openBordersPanel(){const old=document.getElementById("__bordersPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__bordersPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const borders=[{name:"Cl\xE1sico",css:"4px solid #1a2942",extra:"border-radius:0"},{name:"Redondeado",css:"3px solid #0084ff",extra:"border-radius:12px"},{name:"Doble l\xEDnea",css:"4px double #1a2942",extra:""},{name:"Punteado",css:"3px dashed #0084ff",extra:""},{name:"Decorativo",css:"6px ridge #003da5",extra:""},{name:"Sombreado",css:"2px solid #eee",extra:"box-shadow:4px 4px 0 #1a2942"},{name:"Costa Rica",css:"4px solid #ce1126",extra:"border-left:8px solid #003da5;border-right:8px solid #003da5"},{name:"Elegante",css:"1px solid #e2b96f",extra:"box-shadow:0 0 0 4px #1a1a2e,0 0 0 6px #e2b96f;border-radius:4px"},{name:"Institucional",css:"2px solid #003da5",extra:"border-top:6px solid #003da5"},{name:"Moderno",css:"none",extra:"background:linear-gradient(white,white) padding-box,linear-gradient(135deg,#0084ff,#27ae60) border-box;border:3px solid transparent;border-radius:10px"},{name:"Retro",css:"3px solid #856404",extra:"box-shadow:inset 0 0 0 4px #fff9e6;border-radius:2px"},{name:"Sin marco",css:"none",extra:""}],sel=window.getSelection(),hasText=sel&&!sel.isCollapsed;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F5BC}\uFE0F Marcos y bordes decorativos</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Aplica marcos al texto seleccionado o a un p\xE1rrafo nuevo</div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
      ${borders.map((b,i)=>`
        <button onclick="__insertBorder(${i})"
          style="padding:12px 8px;border:${b.css};${b.extra};background:#fff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:#555;text-align:center;transition:all .15s;min-height:50px"
          onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">
          ${b.name}
        </button>`).join("")}
    </div>

    <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#555;line-height:1.6">
      ${hasText?"\u2705 Texto seleccionado \u2014 el marco se aplicar\xE1 al texto seleccionado":"\u{1F4A1} Seleccion\xE1 texto primero para enmarcar esa selecci\xF3n, o se insertar\xE1 un bloque de ejemplo"}
    </div>
    <button onclick="document.getElementById('__bordersPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__borderDefs=borders}function __insertBorder(idx){const b=(window.__borderDefs||[])[idx];if(!b)return;const sel=window.getSelection(),content=(sel?sel.toString().trim():"")||"Texto con marco decorativo. Seleccion\xE1 texto primero para enmarcar tu contenido.",html=`<div style="${`border:${b.css};${b.extra};padding:16px 20px;margin:12px 0;display:block;`}">${content}</div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__bordersPanel").remove(),showToast("Marco insertado \u2705")}function openInfographicPanel(){const old=document.getElementById("__infoPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__infoPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CA} Generador de infograf\xEDas</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Cre\xE1 infograf\xEDas visuales para insertar en el documento</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      ${[{id:"timeline",name:"\u{1F4C5} L\xEDnea de tiempo",desc:"Pasos cronol\xF3gicos"},{id:"stats",name:"\u{1F4CA} Estad\xEDsticas",desc:"N\xFAmeros destacados"},{id:"steps",name:"\u26A1 Proceso paso a paso",desc:"Flujo secuencial"},{id:"compare",name:"\u2696\uFE0F Comparaci\xF3n",desc:"Dos columnas"},{id:"list",name:"\u2705 Lista visual",desc:"Items con \xEDconos"},{id:"pyramid",name:"\u{1F53A} Pir\xE1mide",desc:"Jerarqu\xEDa de datos"}].map(t=>`
        <button onclick="__infoSelect('${t.id}',this)"
          class="__infoTypeBtn"
          style="padding:12px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if(!this.dataset.sel){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:2px">${t.name}</div>
          <div style="font-size:11px;color:#888">${t.desc}</div>
        </button>`).join("")}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">T\xEDtulo de la infograf\xEDa</label>
      <input type="text" id="__infoTitle" placeholder="Ej: Proceso de ventas CR"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
    </div>

    <div style="margin-bottom:16px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:6px">Items (uno por l\xEDnea, separ\xE1 con | para: \xEDcono|t\xEDtulo|descripci\xF3n)</label>
      <textarea id="__infoItems" rows="5"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:vertical;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
        placeholder="\u{1F680}|Paso 1|Descripci\xF3n del paso&#10;\u{1F4CB}|Paso 2|Segunda descripci\xF3n&#10;\u2705|Paso 3|Resultado final">\u{1F680}|Inicio|Primer paso del proceso
\u{1F4CB}|Desarrollo|Segunda etapa clave
\u{1F50D}|Revisi\xF3n|Control de calidad
\u2705|Finalizaci\xF3n|Entrega del resultado</textarea>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__infoPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateInfographic()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CA} Generar infograf\xEDa</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__infoType="steps",setTimeout(()=>{const btn=document.querySelectorAll(".__infoTypeBtn")[2];btn&&(btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1")},50)}function __infoSelect(id,btn){window.__infoType=id,document.querySelectorAll(".__infoTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor="#0084ff",btn.style.background="#f0f7ff",btn.dataset.sel="1"}function __generateInfographic(){const type=window.__infoType||"steps",title=document.getElementById("__infoTitle").value.trim()||"Infograf\xEDa",items=document.getElementById("__infoItems").value.trim().split(`
`).filter(l=>l.trim()).map(line=>{const parts=line.split("|").map(p=>p.trim());return{icon:parts[0]||"\u2022",title:parts[1]||parts[0]||"Item",desc:parts[2]||""}}),colors=["#003da5","#0084ff","#27ae60","#f39c12","#e74c3c","#9b59b6"];let innerHTML="";switch(type){case"steps":innerHTML=items.map((it,i)=>`
        <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:${i<items.length-1,"0"}">
          <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
            <div style="width:46px;height:46px;background:${colors[i%colors.length]};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;font-weight:700;flex-shrink:0">${it.icon}</div>
            ${i<items.length-1?`<div style="width:2px;height:28px;background:${colors[i%colors.length]}44;margin:3px 0"></div>`:""}
          </div>
          <div style="padding-top:10px;${i<items.length-1?"padding-bottom:20px":""}">
            <div style="font-size:13px;font-weight:700;color:${colors[i%colors.length]};margin-bottom:3px">Paso ${i+1}: ${it.title}</div>
            ${it.desc?`<div style="font-size:12px;color:#555;line-height:1.5">${it.desc}</div>`:""}
          </div>
        </div>`).join("");break;case"stats":innerHTML=`<div style="display:grid;grid-template-columns:repeat(${Math.min(items.length,3)},1fr);gap:12px">
        ${items.map((it,i)=>`
          <div style="background:${colors[i%colors.length]}15;border:2px solid ${colors[i%colors.length]}33;border-radius:12px;padding:16px;text-align:center">
            <div style="font-size:32px;margin-bottom:6px">${it.icon}</div>
            <div style="font-size:18px;font-weight:900;color:${colors[i%colors.length]};margin-bottom:4px">${it.title}</div>
            ${it.desc?`<div style="font-size:11px;color:#555">${it.desc}</div>`:""}
          </div>`).join("")}
      </div>`;break;case"timeline":innerHTML=`<div style="position:relative;padding-left:24px;border-left:3px solid #0084ff">
        ${items.map((it,i)=>`
          <div style="position:relative;margin-bottom:${i<items.length-1?"20px":"0"}">
            <div style="position:absolute;left:-33px;width:20px;height:20px;background:${colors[i%colors.length]};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;top:2px">${it.icon}</div>
            <div style="font-size:13px;font-weight:700;color:${colors[i%colors.length]};margin-bottom:3px">${it.title}</div>
            ${it.desc?`<div style="font-size:12px;color:#555">${it.desc}</div>`:""}
          </div>`).join("")}
      </div>`;break;case"compare":const half=Math.ceil(items.length/2),left=items.slice(0,half),right=items.slice(half);innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px">
        <div style="background:#f0f7ff;border-radius:10px 0 0 10px;padding:16px">
          <div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:12px;text-align:center;text-transform:uppercase;letter-spacing:.5px">Opci\xF3n A</div>
          ${left.map(it=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:16px">${it.icon}</span><div><div style="font-size:12px;font-weight:600">${it.title}</div>${it.desc?`<div style="font-size:11px;color:#888">${it.desc}</div>`:""}</div></div>`).join("")}
        </div>
        <div style="background:#fff3e0;border-radius:0 10px 10px 0;padding:16px">
          <div style="font-size:12px;font-weight:700;color:#e67e22;margin-bottom:12px;text-align:center;text-transform:uppercase;letter-spacing:.5px">Opci\xF3n B</div>
          ${right.map(it=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:16px">${it.icon}</span><div><div style="font-size:12px;font-weight:600">${it.title}</div>${it.desc?`<div style="font-size:11px;color:#888">${it.desc}</div>`:""}</div></div>`).join("")}
        </div>
      </div>`;break;case"list":innerHTML=items.map((it,i)=>`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:${i%2?"#f8f9fa":"#fff"};border-radius:8px;margin-bottom:4px;border-left:4px solid ${colors[i%colors.length]}">
          <span style="font-size:22px">${it.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#1a1a1a">${it.title}</div>
            ${it.desc?`<div style="font-size:11px;color:#888">${it.desc}</div>`:""}
          </div>
        </div>`).join("");break;case"pyramid":innerHTML=[...items].reverse().map((it,i)=>`<div style="width:${Math.round(40+i/(items.length-1||1)*60)}%;margin:0 auto 3px;background:${colors[(items.length-1-i)%colors.length]};border-radius:4px;padding:8px;text-align:center;color:#fff">
          <div style="font-size:12px;font-weight:700">${it.icon} ${it.title}</div>
          ${it.desc?`<div style="font-size:10px;opacity:.85">${it.desc}</div>`:""}
        </div>`).join("");break}const html=`<div style="margin:16px 0;padding:20px;background:#fff;border:1.5px solid #e8e8ec;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
    <div style="font-size:14px;font-weight:700;color:#1a2942;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #0084ff;display:flex;align-items:center;gap:8px">
      \u{1F4CA} ${title}
    </div>
    ${innerHTML}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__infoPanel").remove(),showToast("\u{1F4CA} Infograf\xEDa generada \u2705")}const WC_GIT={commits:JSON.parse(localStorage.getItem("wc-git-commits")||"[]"),branch:"main",commit(message){const ed=document.getElementById("editor");if(!ed)return;const commit={id:"c"+Date.now().toString(36),msg:message||"Cambios guardados",date:new Date().toLocaleString("es-CR"),ts:Date.now(),html:ed.innerHTML,words:ed.innerText.trim().split(/\s+/).filter(w=>w).length,branch:this.branch,author:localStorage.getItem("wc-collab-name")||"Autor"};return this.commits.unshift(commit),this.commits.length>30&&this.commits.pop(),localStorage.setItem("wc-git-commits",JSON.stringify(this.commits)),commit},checkout(id){const c=this.commits.find(c2=>c2.id===id);if(!c)return!1;const ed=document.getElementById("editor");return ed?(this.commit("Antes de restaurar "+id),ed.innerHTML=c.html,!0):!1},diff(id1,id2){const c1=this.commits.find(c=>c.id===id1),c2=this.commits.find(c=>c.id===id2);if(!c1||!c2)return null;const w1=c1.html.replace(/<[^>]+>/g," ").split(/\s+/).filter(w=>w),w2=c2.html.replace(/<[^>]+>/g," ").split(/\s+/).filter(w=>w),set1=new Set(w1),set2=new Set(w2),added=w2.filter(w=>!set1.has(w)),removed=w1.filter(w=>!set2.has(w));return{added,removed,w1len:w1.length,w2len:w2.length}}};function openGitPanel(){const old=document.getElementById("__gitPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__gitPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const commits=WC_GIT.commits;ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:580px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-size:17px;font-weight:700;color:#1a2942;display:flex;align-items:center;gap:8px">
            <span>\u{1F500}</span> Historial de versiones
          </div>
          <div style="font-size:11px;color:#888;margin-top:2px">Rama: <strong>${WC_GIT.branch}</strong> \xB7 ${commits.length} commit${commits.length!==1?"s":""}</div>
        </div>
        <button onclick="__gitCommit()" style="padding:8px 14px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600">+ Commit</button>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 20px">
      ${commits.length===0?'<div style="text-align:center;color:#bbb;padding:30px;font-size:13px"><div style="font-size:32px;margin-bottom:10px">\u{1F500}</div>No hay commits a\xFAn.<br>Hac\xE9 tu primer commit con el bot\xF3n +.</div>':commits.map((c,i)=>`
          <div style="display:flex;gap:12px;margin-bottom:12px;position:relative">
            ${i<commits.length-1?'<div style="position:absolute;left:20px;top:44px;bottom:-12px;width:2px;background:#eee;z-index:0"></div>':""}
            <div style="width:40px;height:40px;background:${c.branch==="main"?"#0084ff":"#27ae60"};border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;flex-shrink:0;position:relative;z-index:1">\u{1F500}</div>
            <div style="flex:1;background:#fafafa;border:1.5px solid #eee;border-radius:12px;padding:10px 14px">
              <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:4px">${c.msg}</div>
              <div style="font-size:10px;color:#888;margin-bottom:8px">${c.author} \xB7 ${c.date} \xB7 ${c.words} palabras \xB7 ID: ${c.id}</div>
              <div style="display:flex;gap:6px">
                <button onclick="__gitPreview('${c.id}')" style="padding:4px 10px;border:1.5px solid #eee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;color:#555">\u{1F441} Ver</button>
                ${i>0?`<button onclick="__gitDiff('${c.id}','${commits[i-1]?.id}')" style="padding:4px 10px;border:1.5px solid #eee;background:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;color:#555">\u{1F50D} Diff</button>`:""}
                <button onclick="__gitCheckout('${c.id}')" style="padding:4px 10px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u21A9 Restaurar</button>
              </div>
            </div>
          </div>`).join("")}
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__gitPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __gitCommit(){const msg=prompt("Mensaje del commit:","Actualizaci\xF3n del documento");if(!msg)return;const c=WC_GIT.commit(msg);document.getElementById("__gitPanel").remove(),openGitPanel(),showToast('\u{1F500} Commit: "'+msg+'" \xB7 ID: '+c.id)}function __gitPreview(id){const c=WC_GIT.commits.find(c2=>c2.id===id);if(!c)return;window.open("","_blank","width=700,height=600").document.write(`<html><head><title>${c.msg}</title><style>body{font-family:Calibri,Arial;margin:2cm;line-height:1.6;color:#333}</style></head><body><h2 style="color:#0084ff">\u{1F4C4} ${c.msg}</h2><p style="color:#888;font-size:12px">${c.date} \xB7 ${c.words} palabras</p><hr>${c.html}</body></html>`)}function __gitDiff(id1,id2){const diff=WC_GIT.diff(id1,id2);if(!diff)return;const c1=WC_GIT.commits.find(c=>c.id===id1),c2=WC_GIT.commits.find(c=>c.id===id2),fmt=n=>Math.round(n).toString(),old2=document.getElementById("__gitDiffPanel");old2&&old2.remove();const dv=document.createElement("div");dv.id="__gitDiffPanel",dv.style.cssText="position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px",dv.innerHTML=`
  <div style="background:#fff;border-radius:16px;max-width:500px;width:100%;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="font-size:15px;font-weight:700;color:#1a2942;margin-bottom:14px">\u{1F50D} Diferencias entre versiones</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;font-size:11px">
      <div style="background:#f8f9fa;border-radius:8px;padding:8px"><strong>Versi\xF3n anterior</strong><br><span style="color:#888">${c2?.msg||"?"}</span><br>${fmt(diff.w1len)} palabras</div>
      <div style="background:#f0f7ff;border-radius:8px;padding:8px"><strong>Versi\xF3n actual</strong><br><span style="color:#0084ff">${c1?.msg||"?"}</span><br>${fmt(diff.w2len)} palabras</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div style="background:#d4edda;border-radius:8px;padding:10px">
        <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:6px">+ ${diff.added.length} palabras a\xF1adidas</div>
        <div style="font-size:11px;line-height:1.8">${diff.added.slice(0,15).map(w=>`<span style="background:#c3e6cb;border-radius:3px;padding:1px 5px;margin:2px;display:inline-block">${w}</span>`).join("")}${diff.added.length>15?`<span style="color:#888"> +${diff.added.length-15} m\xE1s</span>`:""}</div>
      </div>
      <div style="background:#f8d7da;border-radius:8px;padding:10px">
        <div style="font-size:11px;font-weight:700;color:#e74c3c;margin-bottom:6px">- ${diff.removed.length} palabras eliminadas</div>
        <div style="font-size:11px;line-height:1.8">${diff.removed.slice(0,15).map(w=>`<span style="background:#f5c6cb;border-radius:3px;padding:1px 5px;margin:2px;display:inline-block;text-decoration:line-through">${w}</span>`).join("")}${diff.removed.length>15?`<span style="color:#888"> +${diff.removed.length-15} m\xE1s</span>`:""}</div>
      </div>
    </div>
    <button onclick="this.closest('[id]').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
  </div>`,document.body.appendChild(dv),dv.addEventListener("click",e=>{e.target===dv&&dv.remove()})}function __gitCheckout(id){confirm("\xBFRestaurar esta versi\xF3n? El estado actual se guardar\xE1 primero.")&&WC_GIT.checkout(id)&&(document.getElementById("__gitPanel").remove(),showToast("\u21A9 Versi\xF3n restaurada \u2705"))}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"exportDocx":exportToDocx();break;case"exportEpub":exportToEPUB();break;case"socialTemplates":openSocialTemplates();break;case"coverEditor":openCoverEditor();break;case"borders":openBordersPanel();break;case"infographic":openInfographicPanel();break;case"gitHistory":openGitPanel();break;case"gitCommit":__gitCommit();break;default:orig(a)}}),console.log("WC Corporate Editor v25.14 \u2705 \u2014 Word, EPUB, Social, Portadas, Bordes, Infograf\xEDas, Git")},2200)})();function openPDFExportPanel(){const old=document.getElementById("__pdfPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pdfPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const title=document.getElementById("editor")?.querySelector("h1")?.innerText?.slice(0,40)||"documento";ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4C4} Exportar a PDF</div>
    <div style="font-size:12px;color:#888;margin-bottom:18px">Genera un PDF profesional del documento</div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
      <div>
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Nombre del archivo</label>
        <input type="text" id="__pdfName" value="${title}"
          style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tama\xF1o</label>
          <select id="__pdfSize" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="a4" selected>A4 (210\xD7297mm)</option>
            <option value="letter">Carta (216\xD7279mm)</option>
            <option value="legal">Legal (216\xD7356mm)</option>
            <option value="a3">A3 (297\xD7420mm)</option>
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Orientaci\xF3n</label>
          <select id="__pdfOrient" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="portrait">Vertical</option>
            <option value="landscape">Horizontal</option>
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">M\xE1rgenes</label>
          <select id="__pdfMargin" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="normal" selected>Normal (2.5cm)</option>
            <option value="narrow">Estrecho (1.27cm)</option>
            <option value="wide">Amplio (3.81cm)</option>
            <option value="none">Sin m\xE1rgenes</option>
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Calidad</label>
          <select id="__pdfQuality" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option value="screen">Pantalla (72dpi)</option>
            <option value="print" selected>Impresi\xF3n (150dpi)</option>
            <option value="high">Alta (300dpi)</option>
          </select>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:6px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="__pdfHeader" checked style="accent-color:#0084ff;width:15px;height:15px">
          <span style="font-size:13px;color:#555">Incluir encabezado con t\xEDtulo</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="__pdfFooter" checked style="accent-color:#0084ff;width:15px;height:15px">
          <span style="font-size:13px;color:#555">Incluir pie con n\xFAmero de p\xE1gina</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" id="__pdfToc" style="accent-color:#0084ff;width:15px;height:15px">
          <span style="font-size:13px;color:#555">Incluir tabla de contenido</span>
        </label>
      </div>
    </div>

    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#0066cc;line-height:1.6">
      \u{1F4A1} Se abrir\xE1 el di\xE1logo de impresi\xF3n del navegador. Seleccion\xE1 <strong>"Guardar como PDF"</strong> para obtener el archivo.
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__pdfPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generatePDF()" style="flex:2;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4C4} Generar PDF</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generatePDF(){const name=document.getElementById("__pdfName").value.trim()||"documento",size=document.getElementById("__pdfSize").value,orient=document.getElementById("__pdfOrient").value,margin=document.getElementById("__pdfMargin").value,header=document.getElementById("__pdfHeader").checked,footer=document.getElementById("__pdfFooter").checked,toc=document.getElementById("__pdfToc").checked,ed=document.getElementById("editor");if(!ed)return;const margins={normal:"2.5cm",narrow:"1.27cm",wide:"3.81cm",none:"0"},sizes={a4:"210mm 297mm",letter:"216mm 279mm",legal:"216mm 356mm",a3:"297mm 420mm"};let tocHTML="";if(toc){const headings=ed.querySelectorAll("h1,h2,h3");headings.length&&(tocHTML=`<div style="margin-bottom:32px;page-break-after:always">
        <h2 style="font-size:16pt;color:#003da5;border-bottom:2px solid #003da5;padding-bottom:8px;margin-bottom:16px">Tabla de contenido</h2>
        <div style="font-family:Calibri,Arial,sans-serif">
          ${Array.from(headings).map((h,i)=>{const level=parseInt(h.tagName[1]);return`<div style="display:flex;align-items:baseline;gap:6px;margin-bottom:6px;padding-left:${level===1?"0":level===2?"20px":"40px"}">
              <span style="font-size:${level===1?"13pt":level===2?"12pt":"11pt"};font-weight:${level===1?"700":"400"}">${h.innerText}</span>
              <span style="flex:1;border-bottom:1px dotted #ccc;margin:0 6px"></span>
              <span style="font-size:11pt;color:#888">${i+1}</span>
            </div>`}).join("")}
        </div>
      </div>`)}const printHTML=`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
  <style>
    @page {
      size: ${orient==="landscape"?sizes[size].split(" ").reverse().join(" "):sizes[size]};
      margin: ${margins[margin]};
      ${header?`@top-center { content: "${name}"; font-family: Calibri, Arial; font-size: 9pt; color: #888; }`:""}
      ${footer?'@bottom-center { content: "P\xE1gina " counter(page) " de " counter(pages); font-family: Calibri, Arial; font-size: 9pt; color: #888; }':""}
    }
    * { box-sizing: border-box; }
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; margin: 0; }
    h1 { font-size: 18pt; color: #003da5; page-break-after: avoid; }
    h2 { font-size: 14pt; color: #0084ff; page-break-after: avoid; }
    h3 { font-size: 12pt; page-break-after: avoid; }
    p  { margin: 0.4cm 0; text-align: justify; }
    table { border-collapse: collapse; width: 100%; margin: 0.5cm 0; }
    td, th { border: 1px solid #ccc; padding: 6px 10px; }
    th { background: #f0f7ff; font-weight: 700; }
    img { max-width: 100%; }
    blockquote { border-left: 4px solid #0084ff; margin: 0.5cm 0; padding: 0.3cm 0.6cm; color: #555; font-style: italic; }
    @media print {
      .no-print { display: none !important; }
      button { display: none !important; }
    }
    ${header?".pdf-header { font-size:9pt;color:#888;text-align:center;padding-bottom:8px;border-bottom:1px solid #eee;margin-bottom:16px; }":""}
    ${footer?".pdf-footer { font-size:9pt;color:#888;text-align:center;padding-top:8px;border-top:1px solid #eee;margin-top:16px;position:fixed;bottom:0;left:0;right:0; }":""}
  </style>
</head>
<body>
  ${header?`<div class="pdf-header">${name}</div>`:""}
  ${tocHTML}
  ${ed.innerHTML.replace(/<button[^>]*>.*?<\/button>/gs,"").replace(/<script[^>]*>.*?<\/script>/gs,"")}
  ${footer?`<div class="pdf-footer">WC Corporate Editor \xB7 Costa Rica \xB7 ${new Date().toLocaleDateString("es-CR")}</div>`:""}
</body>
</html>`;document.getElementById("__pdfPanel").remove();const win=window.open("","_blank");win.document.write(printHTML),win.document.close(),win.addEventListener("load",()=>{setTimeout(()=>{win.document.title=name,win.print()},500)}),showToast('\u{1F4C4} Abriendo di\xE1logo PDF \u2014 Seleccion\xE1 "Guardar como PDF"')}function openCSVImporter(){const old=document.getElementById("__csvPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__csvPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:20px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CA} Importar CSV a tabla</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Convierte datos CSV en una tabla profesional</div>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button id="__csvTabPaste" onclick="__csvSwitchTab('paste')" style="flex:1;padding:8px;border:2px solid #0084ff;background:#f0f7ff;color:#0084ff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Pegar CSV</button>
        <button id="__csvTabFile" onclick="__csvSwitchTab('file')" style="flex:1;padding:8px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4C1} Subir archivo</button>
      </div>

      <div id="__csvPasteArea">
        <textarea id="__csvRaw" rows="6"
          style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:12px;font-family:'Courier New',monospace;outline:none;resize:vertical;box-sizing:border-box;margin-bottom:10px"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="__csvPreview()"
          placeholder="Nombre,Edad,Ciudad,Salario
Juan P\xE9rez,32,San Jos\xE9,\u20A1850000
Mar\xEDa L\xF3pez,28,Cartago,\u20A1920000
Carlos Mora,45,Heredia,\u20A11150000">Nombre,Departamento,Cargo,Salario \u20A1
Ana Garc\xEDa,Finanzas,Contadora,850000
Luis Rodr\xEDguez,TI,Desarrollador,1200000
Mar\xEDa Castro,RRHH,Coordinadora,920000
Pedro Mora,Ventas,Ejecutivo,780000</textarea>
      </div>

      <div id="__csvFileArea" style="display:none">
        <div style="border:2px dashed #c0d8f0;border-radius:12px;padding:24px;text-align:center;cursor:pointer;background:#f8f9ff;margin-bottom:10px"
          onclick="document.getElementById('__csvFileInput').click()">
          <div style="font-size:32px;margin-bottom:8px">\u{1F4CA}</div>
          <div style="font-size:13px;font-weight:600;color:#1a2942">Toc\xE1 para seleccionar archivo</div>
          <div style="font-size:11px;color:#888;margin-top:4px">.csv \xB7 .tsv \xB7 .txt</div>
        </div>
        <input type="file" id="__csvFileInput" accept=".csv,.tsv,.txt" style="display:none"
          onchange="__csvLoadFile(this.files[0])">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Separador</label>
          <select id="__csvSep" onchange="__csvPreview()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
            <option value=",">Coma (,)</option>
            <option value=";">Punto y coma (;)</option>
            <option value="	">Tabulaci\xF3n</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Estilo tabla</label>
          <select id="__csvStyle" onchange="__csvPreview()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
            <option value="blue">Azul CR</option>
            <option value="green">Verde</option>
            <option value="gray">Gris</option>
            <option value="minimal">Minimal</option>
            <option value="striped">Rayado</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Primera fila</label>
          <select id="__csvHeader" onchange="__csvPreview()" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
            <option value="1">Es encabezado</option>
            <option value="0">Es dato</option>
          </select>
        </div>
      </div>
    </div>

    <div id="__csvPreviewBox" style="flex:1;overflow:auto;padding:0 20px;min-height:100px"></div>

    <div style="padding:12px 20px 20px;display:flex;gap:8px;flex-shrink:0;border-top:1px solid #eee;margin-top:8px">
      <button onclick="document.getElementById('__csvPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__csvInsertTable()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CA} Insertar tabla</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(__csvPreview,100)}function __csvSwitchTab(tab){document.getElementById("__csvPasteArea").style.display=tab==="paste"?"block":"none",document.getElementById("__csvFileArea").style.display=tab==="file"?"block":"none",document.getElementById("__csvTabPaste").style.cssText=`flex:1;padding:8px;border:2px solid ${tab==="paste"?"#0084ff":"#eee"};background:${tab==="paste"?"#f0f7ff":"#fafafa"};color:${tab==="paste"?"#0084ff":"#555"};border-radius:8px;cursor:pointer;font-size:12px;font-weight:600`,document.getElementById("__csvTabFile").style.cssText=`flex:1;padding:8px;border:2px solid ${tab==="file"?"#0084ff":"#eee"};background:${tab==="file"?"#f0f7ff":"#fafafa"};color:${tab==="file"?"#0084ff":"#555"};border-radius:8px;cursor:pointer;font-size:12px;font-weight:600`}function __csvLoadFile(file){if(!file)return;const reader=new FileReader;reader.onload=e=>{const ta=document.getElementById("__csvRaw");ta&&(ta.value=e.target.result,__csvSwitchTab("paste"),__csvPreview())},reader.readAsText(file,"UTF-8")}function __csvParse(){const raw=document.getElementById("__csvRaw")?.value?.trim()||"",sep=document.getElementById("__csvSep")?.value||",",hasH=document.getElementById("__csvHeader")?.value==="1",rows=raw.split(`
`).filter(l=>l.trim()).map(l=>l.split(sep).map(c=>c.trim().replace(/^"|"$/g,""))),header=hasH?rows[0]:null,data=hasH?rows.slice(1):rows;return{header,data,total:rows.length}}function __csvPreview(){const box=document.getElementById("__csvPreviewBox"),style=document.getElementById("__csvStyle")?.value||"blue";if(!box)return;const{header,data}=__csvParse();if(!data.length){box.innerHTML='<div style="text-align:center;color:#bbb;padding:20px;font-size:12px">Peg\xE1 datos CSV arriba para previsualizar</div>';return}box.innerHTML='<div style="font-size:10px;color:#aaa;margin-bottom:6px;font-weight:700">VISTA PREVIA</div>'+__csvBuildTable(header,data,style)}function __csvBuildTable(header,data,style){const styles={blue:{header:"background:#003da5;color:#fff",odd:"background:#f0f7ff",border:"#c0d8f0"},green:{header:"background:#27ae60;color:#fff",odd:"background:#f0fff4",border:"#a8d8b8"},gray:{header:"background:#555;color:#fff",odd:"background:#f8f8f8",border:"#ddd"},minimal:{header:"background:none;color:#1a2942;border-bottom:2px solid #333",odd:"",border:"#eee"},striped:{header:"background:#f0f0f0;color:#1a2942",odd:"background:#f8f8f8",border:"#ddd"}},s=styles[style]||styles.blue;let rows="";return header&&(rows+=`<tr>${header.map(h=>`<th style="padding:8px 12px;border:1px solid ${s.border};${s.header};font-size:11px;font-weight:700;text-align:left">${h}</th>`).join("")}</tr>`),data.forEach((row,i)=>{const bg=i%2===0?s.odd:"";rows+=`<tr style="${bg}">${row.map(c=>`<td style="padding:7px 12px;border:1px solid ${s.border};font-size:11px">${c}</td>`).join("")}</tr>`}),`<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif">${rows}</table>`}function __csvInsertTable(){const style=document.getElementById("__csvStyle")?.value||"blue",{header,data,total}=__csvParse();if(!data.length){showToast("No hay datos para insertar");return}const html=`<div style="margin:12px 0;overflow-x:auto">
    ${__csvBuildTable(header,data,style)}
    <div style="font-size:9px;color:#aaa;margin-top:4px;text-align:right">${total} filas \xB7 Importado desde CSV \xB7 WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__csvPanel").remove(),showToast(`\u{1F4CA} Tabla con ${total} filas insertada \u2705`)}const WC_FIND={matches:[],currentIdx:-1,originalHTML:"",open(){const old=document.getElementById("__findPanel");if(old){old.remove();return}const panel=document.createElement("div");panel.id="__findPanel",panel.style.cssText=`
      position:fixed;top:60px;right:12px;z-index:9990;
      background:#fff;border-radius:16px;
      box-shadow:0 8px 32px rgba(0,0,0,.2);
      padding:16px;width:320px;
      font-family:-apple-system,'Segoe UI',sans-serif;
      border:1.5px solid #e0e0e0;
    `,panel.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:14px;font-weight:700;color:#1a2942">\u{1F50D} Buscar y reemplazar</div>
        <button onclick="WC_FIND.close()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#aaa;padding:0">\u2715</button>
      </div>

      <div style="margin-bottom:8px">
        <input type="text" id="__findQuery" placeholder="Buscar..."
          style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          oninput="WC_FIND.search(this.value)"
          onkeydown="if(event.key==='Enter')WC_FIND.next()">
      </div>

      <div style="margin-bottom:10px">
        <input type="text" id="__findReplace" placeholder="Reemplazar con..."
          style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter')WC_FIND.replaceCurrent()">
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px">
          <input type="checkbox" id="__findCase" onchange="WC_FIND.search(document.getElementById('__findQuery').value)" style="accent-color:#0084ff">
          May\xFAsc.
        </label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px">
          <input type="checkbox" id="__findWord" onchange="WC_FIND.search(document.getElementById('__findQuery').value)" style="accent-color:#0084ff">
          Palabra completa
        </label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px">
          <input type="checkbox" id="__findRegex" onchange="WC_FIND.search(document.getElementById('__findQuery').value)" style="accent-color:#0084ff">
          Regex
        </label>
      </div>

      <div id="__findStatus" style="font-size:11px;color:#888;margin-bottom:10px;text-align:center;min-height:16px"></div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">
        <button onclick="WC_FIND.prev()" style="padding:7px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">\u25C0 Anterior</button>
        <button onclick="WC_FIND.next()" style="padding:7px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">Siguiente \u25B6</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <button onclick="WC_FIND.replaceCurrent()" style="padding:7px;border:none;background:#f39c12;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Reemplazar</button>
        <button onclick="WC_FIND.replaceAll()" style="padding:7px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Reemplazar todo</button>
      </div>
    `,document.body.appendChild(panel),setTimeout(()=>document.getElementById("__findQuery")?.focus(),100),document.addEventListener("keydown",function esc(e){e.key==="Escape"&&(WC_FIND.close(),document.removeEventListener("keydown",esc))})},close(){this.clearHighlights();const panel=document.getElementById("__findPanel");panel&&panel.remove(),this.matches=[],this.currentIdx=-1},buildRegex(query){const isRegex=document.getElementById("__findRegex")?.checked,caseSens=document.getElementById("__findCase")?.checked,wholeWord=document.getElementById("__findWord")?.checked;let pattern=isRegex?query:query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return wholeWord&&(pattern="\\b"+pattern+"\\b"),new RegExp(pattern,caseSens?"g":"gi")},search(query){this.clearHighlights();const status=document.getElementById("__findStatus");if(!query.trim()){status&&(status.textContent="");return}const ed=document.getElementById("editor");if(ed)try{const regex=this.buildRegex(query);let count=0;this.matches=[];const walker=document.createTreeWalker(ed,NodeFilter.SHOW_TEXT),nodesToProcess=[];let node;for(;node=walker.nextNode();)node.parentElement.closest("script,style,[data-find-skip]")||nodesToProcess.push(node);nodesToProcess.forEach(textNode=>{const text=textNode.textContent;if(regex.lastIndex=0,!regex.test(text))return;regex.lastIndex=0;const span=document.createElement("span");span.innerHTML=text.replace(regex,match=>(count++,`<mark class="wc-find-highlight" style="background:#ffff00;border-radius:2px;padding:0 1px" data-match-idx="${count-1}">${match}</mark>`)),textNode.parentNode.replaceChild(span,textNode)}),this.matches=Array.from(ed.querySelectorAll(".wc-find-highlight")),status&&(status.textContent=count>0?`${count} resultado${count!==1?"s":""}`:"Sin resultados",status.style.color=count>0?"#27ae60":"#e74c3c"),count>0&&this.goTo(0)}catch(e){status&&(status.textContent="Regex inv\xE1lido: "+e.message,status.style.color="#e74c3c")}},goTo(idx){if(this.matches.forEach(m2=>m2.style.background="#ffff00"),!this.matches.length)return;this.currentIdx=(idx+this.matches.length)%this.matches.length;const m=this.matches[this.currentIdx];m.style.background="#ff9100",m.scrollIntoView({behavior:"smooth",block:"center"});const status=document.getElementById("__findStatus");status&&(status.textContent=`${this.currentIdx+1} de ${this.matches.length}`)},next(){this.goTo(this.currentIdx+1)},prev(){this.goTo(this.currentIdx-1)},replaceCurrent(){if(this.currentIdx<0||!this.matches.length)return;const repl=document.getElementById("__findReplace")?.value||"";this.matches[this.currentIdx].replaceWith(document.createTextNode(repl)),this.matches.splice(this.currentIdx,1),this.matches.length&&this.goTo(Math.min(this.currentIdx,this.matches.length-1));const status=document.getElementById("__findStatus");status&&(status.textContent=this.matches.length+" restante"+(this.matches.length!==1?"s":"")),showToast("Reemplazado \u2705")},replaceAll(){const repl=document.getElementById("__findReplace")?.value||"",count=this.matches.length;if(!count){showToast("No hay coincidencias");return}this.matches.forEach(m=>m.replaceWith(document.createTextNode(repl))),this.matches=[],this.currentIdx=-1;const status=document.getElementById("__findStatus");status&&(status.textContent=`${count} reemplazo${count!==1?"s":""} realizados \u2705`,status.style.color="#27ae60"),showToast(`${count} reemplazos \u2705`)},clearHighlights(){document.querySelectorAll(".wc-find-highlight").forEach(m=>{m.replaceWith(document.createTextNode(m.textContent))});const ed=document.getElementById("editor");ed&&ed.normalize()}};document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&(e.key==="f"||e.key==="h")&&(e.preventDefault(),WC_FIND.open())});const WC_I18N={current:localStorage.getItem("wc-lang")||"es",strings:{es:{save:"Guardar",undo:"Deshacer",redo:"Rehacer",bold:"Negrita",italic:"Cursiva",underline:"Subrayado",print:"Imprimir",export:"Exportar",insert:"Insertar",format:"Formato",tools:"Herramientas",ai:"Inteligencia Artificial",languages:"Lenguas Ind\xEDgenas CR",dictionary:"Diccionario",newDoc:"Nuevo documento",openDoc:"Abrir documento",saveDoc:"Guardar documento",exportPDF:"Exportar PDF",wordCount:"palabras",charCount:"caracteres",readTime:"min lectura",saved:"Guardado",saving:"Guardando...",author:"Autor",date:"Fecha",title:"T\xEDtulo",fontSize:"Tama\xF1o",fontFamily:"Fuente",color:"Color",align:"Alineaci\xF3n",left:"Izquierda",center:"Centro",right:"Derecha",justify:"Justificado",table:"Tabla",image:"Imagen",link:"Enlace",cancel:"Cancelar",apply:"Aplicar",close:"Cerrar",yes:"S\xED",no:"No",ok:"Aceptar",search:"Buscar",replace:"Reemplazar",find:"Buscar",next:"Siguiente",prev:"Anterior",all:"Todo",results:"resultados",settings:"Configuraci\xF3n",help:"Ayuda",about:"Acerca de"},en:{save:"Save",undo:"Undo",redo:"Redo",bold:"Bold",italic:"Italic",underline:"Underline",print:"Print",export:"Export",insert:"Insert",format:"Format",tools:"Tools",ai:"Artificial Intelligence",languages:"Costa Rica Indigenous Languages",dictionary:"Dictionary",newDoc:"New document",openDoc:"Open document",saveDoc:"Save document",exportPDF:"Export PDF",wordCount:"words",charCount:"characters",readTime:"min read",saved:"Saved",saving:"Saving...",author:"Author",date:"Date",title:"Title",fontSize:"Font size",fontFamily:"Font",color:"Color",align:"Alignment",left:"Left",center:"Center",right:"Right",justify:"Justified",table:"Table",image:"Image",link:"Link",cancel:"Cancel",apply:"Apply",close:"Close",yes:"Yes",no:"No",ok:"OK",search:"Search",replace:"Replace",find:"Find",next:"Next",prev:"Previous",all:"All",results:"results",settings:"Settings",help:"Help",about:"About"},fr:{save:"Enregistrer",undo:"Annuler",redo:"R\xE9tablir",bold:"Gras",italic:"Italique",underline:"Soulign\xE9",print:"Imprimer",export:"Exporter",insert:"Ins\xE9rer",format:"Format",tools:"Outils",ai:"Intelligence Artificielle",languages:"Langues Indig\xE8nes CR",dictionary:"Dictionnaire",newDoc:"Nouveau document",openDoc:"Ouvrir",saveDoc:"Enregistrer",exportPDF:"Exporter PDF",wordCount:"mots",charCount:"caract\xE8res",readTime:"min lecture",saved:"Enregistr\xE9",saving:"Enregistrement...",author:"Auteur",date:"Date",title:"Titre",fontSize:"Taille",fontFamily:"Police",color:"Couleur",align:"Alignement",left:"Gauche",center:"Centre",right:"Droite",justify:"Justifi\xE9",table:"Tableau",image:"Image",link:"Lien",cancel:"Annuler",apply:"Appliquer",close:"Fermer",yes:"Oui",no:"Non",ok:"OK",search:"Rechercher",replace:"Remplacer",find:"Trouver",next:"Suivant",prev:"Pr\xE9c\xE9dent",all:"Tout",results:"r\xE9sultats",settings:"Param\xE8tres",help:"Aide",about:"\xC0 propos"},pt:{save:"Salvar",undo:"Desfazer",redo:"Refazer",bold:"Negrito",italic:"It\xE1lico",underline:"Sublinhado",print:"Imprimir",export:"Exportar",insert:"Inserir",format:"Formato",tools:"Ferramentas",ai:"Intelig\xEAncia Artificial",languages:"L\xEDnguas Ind\xEDgenas CR",dictionary:"Dicion\xE1rio",newDoc:"Novo documento",openDoc:"Abrir documento",saveDoc:"Salvar documento",exportPDF:"Exportar PDF",wordCount:"palavras",charCount:"caracteres",readTime:"min leitura",saved:"Salvo",saving:"Salvando...",author:"Autor",date:"Data",title:"T\xEDtulo",fontSize:"Tamanho",fontFamily:"Fonte",color:"Cor",align:"Alinhamento",left:"Esquerda",center:"Centro",right:"Direita",justify:"Justificado",table:"Tabela",image:"Imagem",link:"Link",cancel:"Cancelar",apply:"Aplicar",close:"Fechar",yes:"Sim",no:"N\xE3o",ok:"OK",search:"Buscar",replace:"Substituir",find:"Localizar",next:"Pr\xF3ximo",prev:"Anterior",all:"Tudo",results:"resultados",settings:"Configura\xE7\xF5es",help:"Ajuda",about:"Sobre"}},t(key){return(this.strings[this.current]||this.strings.es)[key]||key},setLang(lang){this.strings[lang]&&(this.current=lang,localStorage.setItem("wc-lang",lang),this.applyToUI(),showToast("\u{1F310} Idioma: "+{es:"Espa\xF1ol",en:"English",fr:"Fran\xE7ais",pt:"Portugu\xEAs"}[lang]))},applyToUI(){document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;el.textContent=this.t(key)});const wc=document.getElementById("__sbWords"),ed=document.getElementById("editor");if(wc&&ed){const w=ed.innerText.trim().split(/\s+/).filter(x=>x).length;wc.innerHTML=`<span style="color:#0084ff">\u270E</span> <span>${w.toLocaleString()} ${this.t("wordCount")}</span>`}}};function openLanguagePanel(){const old=document.getElementById("__i18nPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__i18nPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const langs=[{code:"es",name:"Espa\xF1ol",flag:"\u{1F1E8}\u{1F1F7}",native:"Espa\xF1ol (Costa Rica)"},{code:"en",name:"English",flag:"\u{1F1EC}\u{1F1E7}",native:"English"},{code:"fr",name:"Fran\xE7ais",flag:"\u{1F1EB}\u{1F1F7}",native:"Fran\xE7ais"},{code:"pt",name:"Portugu\xEAs",flag:"\u{1F1E7}\u{1F1F7}",native:"Portugu\xEAs"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:380px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F310} Idioma de la interfaz</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Cambia el idioma de los men\xFAs y botones</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      ${langs.map(l=>`
        <button onclick="WC_I18N.setLang('${l.code}');document.getElementById('__i18nPanel').remove()"
          style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid ${WC_I18N.current===l.code?"#0084ff":"#eee"};background:${WC_I18N.current===l.code?"#f0f7ff":"#fafafa"};border-radius:12px;cursor:pointer;transition:all .15s;text-align:left"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="if('${WC_I18N.current}'!=='${l.code}'){this.style.borderColor='#eee';this.style.background='#fafafa'}">
          <span style="font-size:28px">${l.flag}</span>
          <div>
            <div style="font-size:14px;font-weight:700;color:#1a1a1a">${l.native}</div>
            <div style="font-size:11px;color:#888">${l.name}</div>
          </div>
          ${WC_I18N.current===l.code?'<span style="margin-left:auto;color:#0084ff;font-size:18px">\u2713</span>':""}
        </button>`).join("")}
    </div>
    <button onclick="document.getElementById('__i18nPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}const WC_MACRO={recording:!1,macros:JSON.parse(localStorage.getItem("wc-macros")||"[]"),current:[],startHTML:"",startRecording(){this.recording=!0,this.current=[],this.startHTML=document.getElementById("editor")?.innerHTML||"",this._showRecordingIndicator(),showToast("\u{1F534} Grabando macro \u2014 realiz\xE1 las acciones que quer\xE9s grabar")},stopRecording(){this.recording=!1;const endHTML=document.getElementById("editor")?.innerHTML||"";if(this._hideRecordingIndicator(),!this.current.length&&this.startHTML===endHTML){showToast("No se grabaron acciones");return}const name=prompt("Nombre de la macro:","Macro "+(this.macros.length+1));if(!name)return;const macro={id:"m"+Date.now(),name,date:new Date().toLocaleString("es-CR"),actions:this.current,htmlDiff:endHTML!==this.startHTML?{from:this.startHTML,to:endHTML}:null};this.macros.unshift(macro),this.macros.length>20&&this.macros.pop(),localStorage.setItem("wc-macros",JSON.stringify(this.macros)),this.current=[],showToast('\u23F9 Macro "'+name+'" guardada \u2705')},record(action){this.recording&&this.current.push({type:"action",value:action,time:Date.now()})},recordText(text){if(!this.recording||!text)return;const last=this.current[this.current.length-1];if(last&&last.type==="text"){last.value+=text;return}this.current.push({type:"text",value:text,time:Date.now()})},async play(id){const macro=this.macros.find(m=>m.id===id);if(macro){if(showToast('\u25B6\uFE0F Ejecutando: "'+macro.name+'"...'),macro.htmlDiff){const ed=document.getElementById("editor");if(ed&&macro.htmlDiff.to){ed.innerHTML=macro.htmlDiff.to,showToast('\u2705 Macro "'+macro.name+'" aplicada');return}}for(const action of macro.actions)await new Promise(r=>setTimeout(r,50)),action.type==="action"?typeof window.handleAction=="function"&&window.handleAction(action.value):action.type==="text"&&document.execCommand("insertText",!1,action.value);showToast('\u2705 Macro "'+macro.name+'" ejecutada')}},delete(id){this.macros=this.macros.filter(m=>m.id!==id),localStorage.setItem("wc-macros",JSON.stringify(this.macros))},_showRecordingIndicator(){const old=document.getElementById("__macroRec");old&&old.remove();const ind=document.createElement("div");ind.id="__macroRec",ind.style.cssText="position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:9990;background:#e74c3c;color:#fff;border-radius:20px;padding:6px 16px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;box-shadow:0 4px 16px rgba(231,76,60,.4);animation:wcPulse 1s infinite",ind.innerHTML='<span style="width:8px;height:8px;background:#fff;border-radius:50%;display:inline-block"></span> GRABANDO MACRO';const stopBtn=document.createElement("button");stopBtn.textContent="\u23F9 Detener",stopBtn.style.cssText="margin-left:8px;background:rgba(255,255,255,.3);border:none;color:#fff;border-radius:10px;padding:3px 10px;cursor:pointer;font-size:11px;font-weight:600",stopBtn.onclick=()=>WC_MACRO.stopRecording(),ind.appendChild(stopBtn),document.body.appendChild(ind)},_hideRecordingIndicator(){const ind=document.getElementById("__macroRec");ind&&ind.remove()}};function openMacroPanel(){const old=document.getElementById("__macroPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__macroPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center";const macros=WC_MACRO.macros;ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:16px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div>
          <div style="font-size:17px;font-weight:700;color:#1a2942">\u23FA Grabadora de macros</div>
          <div style="font-size:11px;color:#888;margin-top:2px">${macros.length} macro${macros.length!==1?"s":""} guardada${macros.length!==1?"s":""}</div>
        </div>
        <button onclick="WC_MACRO.startRecording();document.getElementById('__macroPanel').remove()"
          style="padding:9px 16px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px">
          \u25CF Grabar nueva
        </button>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 20px">
      ${macros.length===0?`
        <div style="text-align:center;padding:30px;color:#bbb">
          <div style="font-size:36px;margin-bottom:12px">\u23FA</div>
          <div style="font-size:13px">No hay macros guardadas</div>
          <div style="font-size:11px;margin-top:6px">Grab\xE1 una secuencia de acciones para repetirla con un toque</div>
        </div>`:macros.map(m=>`
          <div style="background:#fafafa;border:1.5px solid #eee;border-radius:12px;padding:14px;margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div>
                <div style="font-size:13px;font-weight:700;color:#1a1a1a">${m.name}</div>
                <div style="font-size:10px;color:#888;margin-top:2px">${m.date} \xB7 ${m.actions.length} acci\xF3n${m.actions.length!==1?"es":""}</div>
              </div>
              <button onclick="WC_MACRO.delete('${m.id}');openMacroPanel()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:16px;padding:0">\u{1F5D1}</button>
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="WC_MACRO.play('${m.id}')" style="flex:1;padding:8px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u25B6\uFE0F Ejecutar</button>
              <button onclick="navigator.clipboard.writeText('${m.id}').then(()=>showToast('ID copiado'))" style="padding:8px 12px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px">\u{1F4CB} ID</button>
            </div>
          </div>`).join("")}
    </div>

    <div style="padding:12px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__macroPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}(function(){const origHandle=window.handleAction;typeof origHandle=="function"&&(window.handleAction=function(a){WC_MACRO.record(a),origHandle(a)});const ed=document.getElementById("editor");ed&&ed.addEventListener("input",e=>{WC_MACRO.recording&&e.inputType==="insertText"&&WC_MACRO.recordText(e.data||"")})})(),(function(){setTimeout(function(){WC_I18N.applyToUI();const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(WC_MACRO.record(a),a){case"exportPDF":openPDFExportPanel();break;case"importCSV":openCSVImporter();break;case"findReplace":WC_FIND.open();break;case"uiLanguage":openLanguagePanel();break;case"macros":openMacroPanel();break;case"recordMacro":WC_MACRO.startRecording();break;case"stopMacro":WC_MACRO.stopRecording();break;default:orig(a)}}),console.log("WC Corporate Editor v25.15 \u2705 \u2014 PDF, CSV, Buscar/Reemplazar, Multiidioma, Macros")},2300)})();
