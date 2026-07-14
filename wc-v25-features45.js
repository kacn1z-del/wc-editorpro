function openImagenIA(){const old=document.getElementById("__imgIAPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__imgIAPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,sans-serif",ov.innerHTML=`
    <div style="background:#1a1a2e;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">\u{1F3A8} Generador de im\xE1genes con IA</div>
      <button onclick="document.getElementById('__imgIAPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">\u2715</button>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#0d0d1a">
      <div style="background:rgba(255,255,255,.05);border-radius:14px;padding:14px">
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.6);display:block;margin-bottom:6px">DESCRIPCI\xD3N DE LA IMAGEN *</label>
        <textarea id="__imgIAPrompt" rows="3" placeholder="Ej: Vista a\xE9rea de San Jos\xE9 Costa Rica al amanecer, ciudad moderna con volcanes al fondo, fotograf\xEDa profesional, 4K"
          style="width:100%;padding:10px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;color:#fff;font-size:13px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='rgba(138,43,226,.8)'" onblur="this.style.borderColor='rgba(255,255,255,.15)'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:rgba(255,255,255,.05);border-radius:12px;padding:10px">
          <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:4px">Estilo</label>
          <select id="__imgIAStyle" style="width:100%;padding:7px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:7px;color:#fff;font-size:12px;outline:none">
            <option value="">Fotorrealista</option>
            <option value="digital art">Arte digital</option>
            <option value="watercolor">Acuarela</option>
            <option value="oil painting">Pintura al \xF3leo</option>
            <option value="3D render">Render 3D</option>
            <option value="minimalist">Minimalista</option>
            <option value="anime">Anime</option>
            <option value="pencil sketch">Boceto a l\xE1piz</option>
            <option value="vintage">Vintage retro</option>
            <option value="corporate professional">Corporativo</option>
          </select>
        </div>
        <div style="background:rgba(255,255,255,.05);border-radius:12px;padding:10px">
          <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:4px">Resoluci\xF3n</label>
          <select id="__imgIASize" style="width:100%;padding:7px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:7px;color:#fff;font-size:12px;outline:none">
            <option value="512x512">512\xD7512 (Cuadrado)</option>
            <option value="768x512">768\xD7512 (Horizontal)</option>
            <option value="512x768">512\xD7768 (Vertical)</option>
            <option value="1024x768" selected>1024\xD7768 (HD)</option>
            <option value="1280x720">1280\xD7720 (Widescreen)</option>
          </select>
        </div>
      </div>

      <!-- Sugerencias r\xE1pidas CR -->
      <div style="background:rgba(255,255,255,.05);border-radius:12px;padding:10px">
        <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:8px">SUGERENCIAS COSTA RICA</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${["Volc\xE1n Arenal con lago al atardecer","Playa Manuel Antonio con monos","Quetzal en bosque nuboso Monteverde","Centro hist\xF3rico San Jos\xE9 colonial","Mariposa Morpho azul en selva","Carreta t\xEDpica costarricense colorida","Tortuga marina en playa Tortuguero","Cafetal en zona de Los Santos","Edificio corporativo moderno San Jos\xE9","Logo empresarial abstracto verde azul"].map(s=>`<button onclick="document.getElementById('__imgIAPrompt').value='${s}, fotograf\xEDa profesional, alta calidad'"
            style="padding:5px 10px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);border-radius:20px;cursor:pointer;font-size:10px;transition:all .15s"
            onmouseover="this.style.background='rgba(138,43,226,.3)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">${s}</button>`).join("")}
        </div>
      </div>

      <!-- Resultado -->
      <div id="__imgIAResult" style="display:none;background:rgba(255,255,255,.05);border-radius:14px;padding:14px;text-align:center">
        <img id="__imgIAImg" src="" alt="" style="max-width:100%;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.4);display:block;margin:0 auto">
        <div style="display:flex;gap:8px;margin-top:10px;justify-content:center">
          <button onclick="__imgIAInsert()" style="padding:8px 16px;border:none;background:#8b2be2;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar en doc</button>
          <button onclick="__imgIADownload()" style="padding:8px 16px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:8px;cursor:pointer;font-size:12px">\u{1F4BE} Descargar</button>
          <button onclick="__imgIAGenerate()" style="padding:8px 16px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:8px;cursor:pointer;font-size:12px">\u{1F504} Regenerar</button>
        </div>
      </div>
    </div>

    <div style="padding:12px 16px;background:#1a1a2e;flex-shrink:0">
      <button onclick="__imgIAGenerate()" id="__imgIABtn" style="width:100%;padding:13px;border:none;background:linear-gradient(135deg,#8b2be2,#0084ff);color:#fff;border-radius:12px;cursor:pointer;font-size:15px;font-weight:700">
        \u{1F3A8} Generar imagen con IA
      </button>
      <div style="text-align:center;font-size:9px;color:rgba(255,255,255,.3);margin-top:6px">Powered by Pollinations AI \xB7 Gratis \xB7 Sin l\xEDmites</div>
    </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __imgIAGenerate(){const prompt=document.getElementById("__imgIAPrompt")?.value.trim();if(!prompt){showToast("Escrib\xED una descripci\xF3n para la imagen");return}const style=document.getElementById("__imgIAStyle")?.value||"",size=document.getElementById("__imgIASize")?.value||"1024x768",[w,h]=size.split("x").map(Number),btn=document.getElementById("__imgIABtn"),result=document.getElementById("__imgIAResult"),img=document.getElementById("__imgIAImg");btn&&(btn.textContent="\u23F3 Generando imagen...",btn.disabled=!0);const fullPrompt=[prompt,style,"high quality","professional"].filter(Boolean).join(", "),url=`https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${w}&height=${h}&nologo=1&seed=${Math.floor(Math.random()*9999)}`;window.__imgIACurrentUrl=url,window.__imgIACurrentPrompt=prompt,img&&(img.onload=()=>{result&&(result.style.display="block"),btn&&(btn.textContent="\u{1F3A8} Generar nueva imagen",btn.disabled=!1),showToast("\u{1F3A8} Imagen generada \u2705")},img.onerror=()=>{btn&&(btn.textContent="\u{1F3A8} Generar imagen con IA",btn.disabled=!1),showToast("Error al generar. Intent\xE1 de nuevo.")},img.src=url,img.alt=prompt)}function __imgIAInsert(){const url=window.__imgIACurrentUrl,prompt=window.__imgIACurrentPrompt||"Imagen generada con IA";if(!url)return;const html=`<figure style="text-align:center;margin:12px 0"><img src="${url}" alt="${prompt}" style="max-width:100%;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.15)"><figcaption style="font-size:9pt;color:#888;margin-top:4px">\u{1F3A8} ${prompt} \xB7 Generado con IA \xB7 Pollinations</figcaption></figure>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__imgIAPanel").remove(),showToast("\u{1F3A8} Imagen insertada \u2705")}function __imgIADownload(){const url=window.__imgIACurrentUrl;if(!url)return;const a=document.createElement("a");a.href=url,a.download="imagen-ia.jpg",a.target="_blank",a.click()}function openCorrectorRedaccion(){const old=document.getElementById("__redPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__redPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u270D\uFE0F Corrector de redacci\xF3n formal CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Espa\xF1ol formal \xB7 Estilo institucional costarricense \xB7 Groq IA</div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Tipo de documento</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[["oficio","\u{1F3DB}\uFE0F Oficio/Circular"],["carta","\u2709\uFE0F Carta formal"],["informe","\u{1F4CA} Informe t\xE9cnico"],["academico","\u{1F393} Acad\xE9mico"],["legal","\u2696\uFE0F Jur\xEDdico/Legal"],["general","\u{1F4DD} General"]].map(([v,l],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid ${i===5?"#27ae60":"#eee"};background:${i===5?"#f0fff4":"#fafafa"};border-radius:8px;font-size:12px;font-weight:600;color:#555">
              <input type="radio" name="__redType" value="${v}" ${i===5?"checked":""} style="accent-color:#27ae60"> ${l}
            </label>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto a corregir (o dej\xE1 vac\xEDo para corregir el documento completo)</label>
        <textarea id="__redText" rows="5" placeholder="Peg\xE1 el texto aqu\xED, o dej\xE1 vac\xEDo para mejorar todo el documento..."
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
    </div>

    <div id="__redResult" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__redPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runRedaccionCorrector()" id="__redBtn" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u270D\uFE0F Corregir redacci\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runRedaccionCorrector(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const ed=document.getElementById("editor"),text=document.getElementById("__redText")?.value.trim()||ed?.innerText?.trim().slice(0,4e3)||"";if(!text){showToast("No hay texto para corregir");return}const type=document.querySelector('[name="__redType"]:checked')?.value||"general",btn=document.getElementById("__redBtn"),res=document.getElementById("__redResult");btn&&(btn.disabled=!0,btn.textContent="\u23F3 Corrigiendo...");const typeGuides={oficio:'Documento oficial costarricense: tratamiento de "Estimado se\xF1or/se\xF1ora", f\xF3rmulas de cortes\xEDa institucional, lenguaje formal y directo, estructuras como "me permito comunicarle", "en atenci\xF3n a".',carta:"Carta formal de negocios: saludo y despedida formales, p\xE1rrafos bien estructurados, tono profesional y respetuoso.",informe:"Informe t\xE9cnico: lenguaje objetivo y preciso, uso de tercera persona, estructura l\xF3gica, t\xE9rminos t\xE9cnicos correctos.",academico:"Espa\xF1ol acad\xE9mico formal: evitar coloquialismos, usar conectores argumentativos, voz pasiva donde corresponda, citas correctamente integradas.",legal:"Redacci\xF3n jur\xEDdica costarricense: t\xE9rminos legales precisos, estructura de cl\xE1usulas, referencias normativas correctas, lenguaje de la Ley.",general:"Espa\xF1ol formal costarricense: claridad, concisi\xF3n, correcci\xF3n gramatical, eliminaci\xF3n de redundancias y uso de vocabulario apropiado."};try{const raw=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Sos un experto en redacci\xF3n formal costarricense. Correg\xED y mejor\xE1 el siguiente texto seg\xFAn estas pautas: ${typeGuides[type]}

Respond\xE9 en JSON con este formato exacto:
{"textoCorregido":"...","cambios":[{"original":"...","corregido":"...","razon":"..."}],"puntaje":0-100,"observaciones":"..."}`},{role:"user",content:text}],temperature:.2,max_tokens:1500})})).json())?.choices?.[0]?.message?.content||"{}",data=JSON.parse(raw.replace(/```json|```/g,"").trim());if(btn&&(btn.disabled=!1,btn.textContent="\u270D\uFE0F Corregir de nuevo"),res){res.style.display="block";const score=data.puntaje??70,sc=score>=80?"#27ae60":score>=60?"#f39c12":"#e74c3c";res.innerHTML=`
        <div style="background:#f0fff4;border-radius:12px;padding:12px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <div style="font-size:28px;font-weight:900;color:${sc}">${score}</div>
            <div style="flex:1"><div style="height:8px;background:#eee;border-radius:4px;overflow:hidden"><div style="height:100%;width:${score}%;background:${sc};border-radius:4px"></div></div>
            <div style="font-size:11px;color:${sc};font-weight:700;margin-top:3px">Calidad de redacci\xF3n</div></div>
          </div>
          ${data.observaciones?`<div style="font-size:11px;color:#555">${data.observaciones}</div>`:""}
        </div>
        ${data.textoCorregido?`
        <div style="background:#fff;border:1.5px solid #27ae60;border-radius:10px;padding:12px;margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:6px">TEXTO CORREGIDO</div>
          <div style="font-size:12px;color:#333;line-height:1.7;white-space:pre-wrap">${data.textoCorregido}</div>
          <button onclick="__insertRedaccion('${encodeURIComponent(data.textoCorregido)}')" style="width:100%;margin-top:8px;padding:8px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar texto corregido</button>
        </div>`:""}
        ${data.cambios?.length?`
        <div style="margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">CAMBIOS REALIZADOS (${data.cambios.length})</div>
          ${data.cambios.slice(0,8).map(c=>`<div style="background:#f8f9fa;border-radius:8px;padding:8px;margin-bottom:5px;font-size:11px"><div style="color:#e74c3c;text-decoration:line-through">${c.original}</div><div style="color:#27ae60;font-weight:600">\u2192 ${c.corregido}</div><div style="color:#888;margin-top:2px">${c.razon}</div></div>`).join("")}
        </div>`:""}`}}catch(e){btn&&(btn.disabled=!1,btn.textContent="\u270D\uFE0F Corregir redacci\xF3n"),showToast("Error: "+e.message)}}function __insertRedaccion(encoded){const text=decodeURIComponent(encoded);typeof insertHTML=="function"&&insertHTML(`<div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8">${text.replace(/\n/g,"<br>")}</div>`),document.getElementById("__redPanel").remove(),showToast("\u270D\uFE0F Texto corregido insertado \u2705")}function openTraductorIndigena(){const old=document.getElementById("__indigPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__indigPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px";const diccionario={bribri:{agua:"d\xEB",fuego:"cha",tierra:"y\xEB",sol:"al\xE0",luna:"nia",casa:"\xFA",\u00E1rbol:"b\xEB",monta\u00F1a:"sur",r\u00EDo:"di",jaguar:"bi",serpiente:"k\xF6l",p\u00E1jaro:"tsuru",ma\u00EDz:"k\xEBpa",cacao:"sula",madre:"sa",padre:"papa",hijo:"ba",mujer:"kapo",hombre:"iru",bueno:"\xEC",malo:"b\xEB",grande:"k\xEBk\xEB",peque\u00F1o:"kl\xEB",comer:"i",beber:"k\xF6",caminar:"kal",hablar:"ul\xE0",uno:"\xE9tse",dos:"b\xF6",tres:"m\xEBn",cuatro:"ki",cinco:"k\xEB",hola:"p\xEB",gracias:"sul\xE0",adi\u00F3s:"ts\xF6",s\u00ED:"\xEB",no:"k\xEB",costarricense:"bribri",ind\u00EDgena:"bribri shula",naturaleza:"y\xEB \xFA"},cabecar:{agua:"y\xF6k",fuego:"s\xEBk",tierra:"du\xF6",sol:"al\xEB",luna:"ni\xE0",casa:"\xFA",\u00E1rbol:"b\xEB",r\u00EDo:"di\xF6",jaguar:"b\xF6",madre:"sa",padre:"papa",bueno:"\xEC",malo:"sh\xF6",hola:"\xEB",gracias:"sul\xEB",s\u00ED:"\xEB",no:"k\xEB",uno:"\xE9ts",dos:"b\xF6k",tres:"m\xEBn",cuatro:"ki",cinco:"k\xF6k"},maleku:{agua:"toku",fuego:"kira",tierra:"naf\xE9",sol:"jaf\xE9",luna:"m\xE1cu",casa:"n\xE1cu",\u00E1rbol:"jar\xE9",r\u00EDo:"toku",p\u00E1jaro:"j\xE1r\xEB",madre:"m\xE1l\xEB",padre:"pal\xEB",hola:"m\xE1l\xEB",gracias:"m\xE1cuji",s\u00ED:"jaf\xE9",no:"ni",bueno:"f\xE1ci",grande:"m\xE1cu",uno:"aj\xFA",dos:"as\xE1",tres:"ajk\xED",cuatro:"ajk\xFA",cinco:"\xE1cu\xEB"},ngabe:{agua:"dru",fuego:"kira",tierra:"nok",sol:"ng\xF6be",luna:"ni",casa:"kr\xEB",\u00E1rbol:"ni",r\u00EDo:"dr\xFCm",jaguar:"t\xF6",madre:"nga",padre:"baba",bueno:"jire",malo:"kue",hola:"ndab\xEB",gracias:"jire",s\u00ED:"\xEBn",no:"kue",uno:"k\xE4dri",dos:"k\xF6",tres:"m\xEBn",cuatro:"k\xF6ti",cinco:"k\xE4t\xEB"},boruca:{agua:"unk",fuego:"t\xF6",tierra:"dru",sol:"al\xE1",luna:"cun\xFA",casa:"\xFA",\u00E1rbol:"b\xEB",jaguar:"bi",p\u00E1jaro:"tsuru",madre:"sa",padre:"pa",bueno:"ik\xEB",malo:"k\xEB",hola:"\xEB",gracias:"ik\xEB",s\u00ED:"\xEB",no:"k\xEB",uno:"etso",dos:"b\xF6",tres:"m\xEBn",cuatro:"ki",cinco:"k\xEB"},mekatelyu:{agua:"wata",fuego:"faia",tierra:"gron",sol:"son",luna:"muun",casa:"ous",\u00E1rbol:"chrii",r\u00EDo:"ribba",p\u00E1jaro:"bord",madre:"mama",padre:"papa",bueno:"gud",malo:"bad",hola:"elo",gracias:"tenk yu",s\u00ED:"yes",no:"no",uno:"wan",dos:"tu",tres:"chrii",cuatro:"fuor",cinco:"faiv",comida:"fuud",trabajo:"wok",dinero:"moni",amor:"luv"}},langNames={bribri:"Bribri",cabecar:"Cab\xE9car",maleku:"Maleku/Mal\xE9ku",ngabe:"Ng\xE4be (Guaym\xED)",boruca:"Boruca/Brunca",mekatelyu:"Mekatelyu (Criollo Limonense)"};ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#27ae60,#1a2942);color:#fff;padding:14px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:15px;font-weight:700">\u{1F33F} Traductor lenguas ind\xEDgenas CR</div>
      <div style="font-size:11px;opacity:.8">Bribri \xB7 Cab\xE9car \xB7 Maleku \xB7 Ng\xE4be \xB7 Boruca \xB7 Mekatelyu</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Lengua ind\xEDgena</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
          ${Object.entries(langNames).map(([k,v],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?"#27ae60":"#eee"};background:${i===0?"#f0fff4":"#fafafa"};border-radius:8px;font-size:11px;font-weight:600;color:#555;transition:all .15s">
              <input type="radio" name="__indigLang" value="${k}" ${i===0?"checked":""} style="accent-color:#27ae60"> \u{1F33F} ${v}
            </label>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Palabras en espa\xF1ol (separadas por coma o espacio)</label>
        <textarea id="__indigInput" rows="3" placeholder="agua, fuego, tierra, sol, madre, padre, casa, \xE1rbol, hola, gracias..."
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <!-- Palabras r\xE1pidas -->
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Palabras frecuentes</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${["agua","fuego","tierra","sol","luna","casa","\xE1rbol","madre","padre","hola","gracias","bueno","s\xED","no","uno","dos","tres"].map(w=>`<button onclick="document.getElementById('__indigInput').value+='${w}, '"
            style="padding:4px 10px;border:1px solid #e0e0e0;background:#fafafa;border-radius:12px;cursor:pointer;font-size:11px;color:#555">${w}</button>`).join("")}
        </div>
      </div>

      <div id="__indigResult" style="display:none;background:#f0fff4;border-radius:12px;padding:12px;margin-bottom:10px">
        <div style="font-size:11px;font-weight:700;color:#27ae60;margin-bottom:8px">TRADUCCI\xD3N</div>
        <div id="__indigResultTable"></div>
        <button onclick="__insertIndigTraduccion()" style="width:100%;margin-top:8px;padding:8px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar glosario en documento</button>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__indigPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__runIndigTraduccion()" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F33F} Traducir</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__indigDic=diccionario,window.__indigLangNames=langNames}function __runIndigTraduccion(){const lang=document.querySelector('[name="__indigLang"]:checked')?.value||"bribri",input=document.getElementById("__indigInput")?.value.trim();if(!input){showToast("Ingres\xE1 palabras para traducir");return}const words=input.split(/[\s,;]+/).map(w=>w.toLowerCase().trim()).filter(w=>w.length>1),dic=window.__indigDic?.[lang]||{},res=document.getElementById("__indigResult"),table=document.getElementById("__indigResultTable");if(!res||!table)return;const rows=words.map(w=>({esp:w,trad:dic[w]||"\u2014",found:!!dic[w]})),found=rows.filter(r=>r.found).length;table.innerHTML=`
    <table style="width:100%;border-collapse:collapse;font-size:11pt">
      <tr style="background:#27ae60;color:#fff"><th style="padding:6px 10px;text-align:left">Espa\xF1ol</th><th style="padding:6px 10px;text-align:left">${window.__indigLangNames?.[lang]||lang}</th></tr>
      ${rows.map((r,i)=>`<tr style="${i%2?"background:#f8fff8":""}"><td style="padding:5px 10px;border:1px solid #c8e6c9">${r.esp}</td><td style="padding:5px 10px;border:1px solid #c8e6c9;font-weight:${r.found?"700":"400"};color:${r.found?"#1b5e20":"#aaa"}">${r.trad}</td></tr>`).join("")}
    </table>
    <div style="font-size:10px;color:#888;margin-top:6px">${found} de ${rows.length} palabras encontradas \xB7 Diccionario WC Corporate Editor</div>`,res.style.display="block",window.__indigRows=rows,window.__indigLangCurrent=lang,showToast(`\u{1F33F} ${found}/${words.length} palabras traducidas`)}function __insertIndigTraduccion(){const rows=window.__indigRows||[],lang=window.__indigLangNames?.[window.__indigLangCurrent]||"Lengua ind\xEDgena",html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #27ae60;border-radius:10px;overflow:hidden;max-width:400px;margin:10px auto">
    <div style="background:#27ae60;color:#fff;padding:8px 14px;font-weight:700">\u{1F33F} Glosario ${lang} \xB7 WC Corporate Editor</div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0fff4"><th style="padding:5px 10px;border:1px solid #c8e6c9;text-align:left">Espa\xF1ol</th><th style="padding:5px 10px;border:1px solid #c8e6c9;text-align:left">${lang}</th></tr>
      ${rows.filter(r=>r.found).map((r,i)=>`<tr style="${i%2?"background:#f8fff8":""}"><td style="padding:4px 10px;border:1px solid #c8e6c9">${r.esp}</td><td style="padding:4px 10px;border:1px solid #c8e6c9;font-weight:700;color:#1b5e20">${r.trad}</td></tr>`).join("")}
    </table>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__indigPanel").remove(),showToast("\u{1F33F} Glosario insertado \u2705")}function openSentimentDetector(){const old=document.getElementById("__sentPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__sentPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3AD} Detector de tono y sentimiento</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">An\xE1lisis de tono \xB7 Sentimiento \xB7 Emoci\xF3n dominante</div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Texto a analizar (o dej\xE1 vac\xEDo para el documento)</label>
      <textarea id="__sentText" rows="4" placeholder="Peg\xE1 texto aqu\xED o dej\xE1 vac\xEDo para analizar el documento completo..."
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#8e44ad'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
    </div>

    <div id="__sentProgress" style="display:none;background:#f5eeff;border-radius:8px;padding:10px;text-align:center;color:#8e44ad;font-size:13px;margin-bottom:10px">\u{1F3AD} Analizando tono...</div>
    <div id="__sentResult" style="display:none;margin-bottom:12px"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__sentPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runSentimentAnalysis()" id="__sentBtn" style="flex:2;padding:11px;border:none;background:#8e44ad;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3AD} Analizar tono</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runSentimentAnalysis(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const ed=document.getElementById("editor"),text=document.getElementById("__sentText")?.value.trim()||ed?.innerText?.trim().slice(0,3e3)||"";if(!text){showToast("No hay texto para analizar");return}const prog=document.getElementById("__sentProgress"),res=document.getElementById("__sentResult"),btn=document.getElementById("__sentBtn");prog&&(prog.style.display="block"),btn&&(btn.disabled=!0);try{const raw=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:'Analiz\xE1 el tono y sentimiento del texto en espa\xF1ol. Respond\xE9 en JSON: {"sentimiento":"Positivo/Negativo/Neutro/Mixto","tono":"formal/informal/urgente/persuasivo/informativo/emocional/agresivo/emp\xE1tico","emocionDominante":"alegr\xEDa/tristeza/ira/miedo/sorpresa/confianza/anticipaci\xF3n/neutral","intensidad":0-100,"palabrasClave":["..."],"resumen":"...","sugerencias":["..."]}'},{role:"user",content:text}],temperature:.2,max_tokens:500})})).json())?.choices?.[0]?.message?.content||"{}",data=JSON.parse(raw.replace(/```json|```/g,"").trim());prog&&(prog.style.display="none"),btn&&(btn.disabled=!1);const sentColors={Positivo:"#27ae60",Negativo:"#e74c3c",Neutro:"#888",Mixto:"#f39c12"},emojiMap={alegr\u00EDa:"\u{1F60A}",tristeza:"\u{1F622}",ira:"\u{1F620}",miedo:"\u{1F628}",sorpresa:"\u{1F632}",confianza:"\u{1F4AA}",anticipaci\u00F3n:"\u{1F3AF}",neutral:"\u{1F610}"},sc=sentColors[data.sentimiento]||"#888",emo=emojiMap[data.emocionDominante]||"\u{1F3AD}";res&&(res.style.display="block",res.innerHTML=`
        <div style="background:#f5eeff;border-radius:12px;padding:14px;margin-bottom:8px">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;margin-bottom:12px">
            <div style="background:#fff;border-radius:8px;padding:8px">
              <div style="font-size:22px;margin-bottom:2px">${emo}</div>
              <div style="font-size:11px;font-weight:700;color:${sc}">${data.sentimiento||"\u2014"}</div>
              <div style="font-size:9px;color:#aaa">Sentimiento</div>
            </div>
            <div style="background:#fff;border-radius:8px;padding:8px">
              <div style="font-size:18px;font-weight:900;color:#8e44ad">${data.intensidad||50}%</div>
              <div style="font-size:11px;font-weight:700;color:#555">${data.tono||"\u2014"}</div>
              <div style="font-size:9px;color:#aaa">Tono/Intensidad</div>
            </div>
            <div style="background:#fff;border-radius:8px;padding:8px">
              <div style="font-size:22px;margin-bottom:2px">\u{1F3AD}</div>
              <div style="font-size:11px;font-weight:700;color:#555">${data.emocionDominante||"\u2014"}</div>
              <div style="font-size:9px;color:#aaa">Emoci\xF3n</div>
            </div>
          </div>
          ${data.resumen?`<div style="font-size:11px;color:#555;margin-bottom:8px">${data.resumen}</div>`:""}
          ${data.palabrasClave?.length?`<div style="display:flex;flex-wrap:wrap;gap:4px">${data.palabrasClave.map(p=>`<span style="background:#8e44ad22;border:1px solid #8e44ad44;border-radius:10px;padding:2px 8px;font-size:10px;color:#8e44ad">${p}</span>`).join("")}</div>`:""}
        </div>
        ${data.sugerencias?.length?`
        <div style="background:#f8f9fa;border-radius:10px;padding:10px">
          <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">\u{1F4A1} Sugerencias para mejorar el tono</div>
          ${data.sugerencias.map(s=>`<div style="font-size:11px;color:#555;padding:3px 0">\u2022 ${s}</div>`).join("")}
        </div>`:""}`)}catch(e){prog&&(prog.style.display="none"),btn&&(btn.disabled=!1),showToast("Error: "+e.message)}}function openHashtagSEO(){const old=document.getElementById("__seoPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__seoPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">#\uFE0F\u20E3 Generador de hashtags y SEO</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Instagram \xB7 LinkedIn \xB7 Twitter \xB7 Meta description \xB7 SEO</div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Plataforma</label>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${[["instagram","\u{1F4F8} Instagram"],["linkedin","\u{1F4BC} LinkedIn"],["twitter","\u{1F426} Twitter/X"],["facebook","\u{1F465} Facebook"],["tiktok","\u{1F3B5} TikTok"],["seo","\u{1F50D} SEO Web"]].map(([v,l],i)=>`
            <label style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:6px 10px;border:1.5px solid ${i===0?"#e1306c":"#eee"};background:${i===0?"#fff0f5":"#fafafa"};border-radius:20px;font-size:11px;font-weight:600;color:#555">
              <input type="radio" name="__seoPlatform" value="${v}" ${i===0?"checked":""} style="accent-color:#e1306c"> ${l}
            </label>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Tema / Descripci\xF3n del contenido *</label>
        <textarea id="__seoInput" rows="3" placeholder="Ej: Art\xEDculo sobre los beneficios del caf\xE9 costarricense de altura para la salud y el emprendimiento"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#e1306c'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma</label>
          <select id="__seoLang" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="es" selected>\u{1F1E8}\u{1F1F7} Espa\xF1ol</option>
            <option value="en">\u{1F1FA}\u{1F1F8} English</option>
            <option value="pt">\u{1F1E7}\u{1F1F7} Portugu\xEAs</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Cantidad</label>
          <select id="__seoCount" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="10">10 hashtags</option>
            <option value="20" selected>20 hashtags</option>
            <option value="30">30 hashtags</option>
          </select>
        </div>
      </div>
    </div>

    <div id="__seoResult" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__seoPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runHashtagSEO()" id="__seoBtn" style="flex:2;padding:10px;border:none;background:#e1306c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">#\uFE0F\u20E3 Generar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runHashtagSEO(){const key=localStorage.getItem("wc-groq-key");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const input=document.getElementById("__seoInput")?.value.trim();if(!input){showToast("Describ\xED el contenido");return}const platform=document.querySelector('[name="__seoPlatform"]:checked')?.value||"instagram",lang=document.getElementById("__seoLang")?.value||"es",count=parseInt(document.getElementById("__seoCount")?.value)||20,btn=document.getElementById("__seoBtn"),res=document.getElementById("__seoResult");btn&&(btn.disabled=!0,btn.textContent="\u23F3 Generando...");const platformGuides={instagram:"hashtags populares y de nicho para Instagram, mezcla de alto y bajo volumen, inclu\xED algunos en espa\xF1ol CR",linkedin:"hashtags profesionales para LinkedIn, m\xE1ximo 10, enfocados en industria y carrera",twitter:"hashtags trending para Twitter/X, cortos y directos, m\xE1ximo 3-5",facebook:"hashtags relevantes para Facebook, moderados en cantidad",tiktok:"hashtags virales para TikTok, inclu\xED #fyp #parati y variantes en espa\xF1ol",seo:"palabras clave SEO (keywords), meta description, t\xEDtulo SEO y palabras LSI relacionadas"};try{const raw=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Gener\xE1 ${count} ${platformGuides[platform]} para el siguiente tema en idioma ${lang}. 
${platform==="seo"?'Respond\xE9 en JSON: {"keywords":["..."],"metaTitle":"...","metaDescription":"...","lsiKeywords":["..."],"slug":"..."}':'Respond\xE9 en JSON: {"hashtags":["#tag1","#tag2"],"populares":["#tag1"],"nicho":["#tag2"],"consejo":"..."}'}`},{role:"user",content:input}],temperature:.5,max_tokens:800})})).json())?.choices?.[0]?.message?.content||"{}",data=JSON.parse(raw.replace(/```json|```/g,"").trim());if(btn&&(btn.disabled=!1,btn.textContent="#\uFE0F\u20E3 Generar de nuevo"),res)if(res.style.display="block",platform==="seo")res.innerHTML=`
          <div style="display:flex;flex-direction:column;gap:8px;padding-bottom:8px">
            ${data.metaTitle?`<div style="background:#f0f7ff;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#003da5;margin-bottom:4px">T\xCDTULO SEO</div><div style="font-size:13px;font-weight:600;color:#1a1a1a">${data.metaTitle}</div><div style="font-size:10px;color:#888">${data.metaTitle.length} caracteres (ideal: 50-60)</div></div>`:""}
            ${data.metaDescription?`<div style="background:#f0fff4;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#27ae60;margin-bottom:4px">META DESCRIPTION</div><div style="font-size:12px;color:#333">${data.metaDescription}</div><div style="font-size:10px;color:#888">${data.metaDescription.length} caracteres (ideal: 150-160)</div></div>`:""}
            ${data.slug?`<div style="background:#f5eeff;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#8e44ad;margin-bottom:4px">URL SLUG</div><div style="font-size:12px;color:#333;font-family:'Courier New',monospace">/${data.slug}</div></div>`:""}
            ${data.keywords?.length?`<div style="background:#f8f9fa;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#555;margin-bottom:6px">PALABRAS CLAVE (${data.keywords.length})</div><div style="display:flex;flex-wrap:wrap;gap:5px">${data.keywords.map(k=>`<span style="background:#003da522;border:1px solid #003da544;border-radius:10px;padding:3px 9px;font-size:11px;color:#003da5;cursor:pointer" onclick="navigator.clipboard.writeText('${k}')">${k}</span>`).join("")}</div></div>`:""}
            ${data.lsiKeywords?.length?`<div style="background:#f8f9fa;border-radius:10px;padding:10px"><div style="font-size:10px;font-weight:700;color:#555;margin-bottom:6px">PALABRAS LSI RELACIONADAS</div><div style="display:flex;flex-wrap:wrap;gap:5px">${data.lsiKeywords.map(k=>`<span style="background:#88888822;border:1px solid #88888844;border-radius:10px;padding:3px 9px;font-size:11px;color:#555">${k}</span>`).join("")}</div></div>`:""}
            <button onclick="__insertSEO(${JSON.stringify(data).replace(/"/g,"'")})" style="padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar SEO en documento</button>
          </div>`;else{const allTags=data.hashtags||[],tagStr=allTags.join(" ");res.innerHTML=`
          <div style="display:flex;flex-direction:column;gap:8px;padding-bottom:8px">
            <div style="background:#f0f7ff;border-radius:10px;padding:10px">
              <div style="font-size:10px;font-weight:700;color:#555;margin-bottom:6px">TODOS LOS HASHTAGS (${allTags.length})</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">
                ${allTags.map(h=>`<span style="background:#e1306c22;border:1px solid #e1306c44;border-radius:12px;padding:3px 10px;font-size:12px;color:#e1306c;cursor:pointer" onclick="navigator.clipboard.writeText('${h}').then(()=>showToast('Copiado'))">${h}</span>`).join("")}
              </div>
              ${data.consejo?`<div style="font-size:10px;color:#888;font-style:italic">\u{1F4A1} ${data.consejo}</div>`:""}
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="navigator.clipboard.writeText('${tagStr}').then(()=>showToast('\u2705 Hashtags copiados'))" style="flex:1;padding:9px;border:none;background:#e1306c;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Copiar todos</button>
              <button onclick="__insertHashtags('${encodeURIComponent(tagStr)}')" style="flex:1;padding:9px;border:1.5px solid #e1306c;background:#fff;color:#e1306c;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar</button>
            </div>
          </div>`}}catch(e){btn&&(btn.disabled=!1,btn.textContent="#\uFE0F\u20E3 Generar"),showToast("Error: "+e.message)}}function __insertHashtags(encoded){const text=decodeURIComponent(encoded);typeof insertHTML=="function"&&insertHTML(`<p style="font-family:Calibri,Arial,sans-serif;font-size:10pt;color:#e1306c;line-height:1.8">${text}</p>`),document.getElementById("__seoPanel").remove(),showToast("#\uFE0F\u20E3 Hashtags insertados \u2705")}function __insertSEO(data){const html=`<div style="font-family:Calibri,Arial,sans-serif;background:#f0f7ff;border:2px solid #003da5;border-radius:8px;padding:12px;margin:10px 0;font-size:10pt">
    <div style="font-weight:700;color:#003da5;margin-bottom:6px">\u{1F50D} Metadatos SEO</div>
    ${data.metaTitle?`<p><strong>T\xEDtulo:</strong> ${data.metaTitle}</p>`:""}
    ${data.metaDescription?`<p><strong>Descripci\xF3n:</strong> ${data.metaDescription}</p>`:""}
    ${data.slug?`<p><strong>URL:</strong> /${data.slug}</p>`:""}
    ${data.keywords?.length?`<p><strong>Palabras clave:</strong> ${data.keywords.join(", ")}</p>`:""}
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__seoPanel").remove(),showToast("\u{1F50D} SEO insertado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"imagenIA":openImagenIA();break;case"correctorRedaccion":openCorrectorRedaccion();break;case"traductorIndigena":openTraductorIndigena();break;case"sentimentDetector":openSentimentDetector();break;case"hashtagSEO":openHashtagSEO();break;default:orig(a)}}),console.log("WC Corporate Editor v25.45 \u2705 \u2014 Imagen IA, Redacci\xF3n CR, Ind\xEDgenas, Sentimiento, SEO")},5300)})();
