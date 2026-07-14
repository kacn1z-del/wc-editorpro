const WC_NEWS={feeds:[{name:"La Naci\xF3n",url:"https://www.nacion.com/arc/outboundfeeds/rss/",color:"#e74c3c",icon:"\u{1F4F0}"},{name:"CRHoy",url:"https://crhoy.com/feed/",color:"#003da5",icon:"\u{1F5DE}\uFE0F"},{name:"Tico Times",url:"https://ticotimes.net/feed",color:"#27ae60",icon:"\u{1F4CB}"},{name:"El Financiero",url:"https://www.elfinancierocr.com/arc/outboundfeeds/rss/",color:"#f39c12",icon:"\u{1F4BC}"},{name:"Semanario U",url:"https://semanariouniversidad.com/feed/",color:"#9b59b6",icon:"\u{1F393}"}],proxy:"https://api.rss2json.com/v1/api.json?rss_url="};function openNewsReader(){const old=document.getElementById("__newsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__newsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4F0} Noticias Costa Rica</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Medios nacionales \u2014 Toc\xE1 para insertar en el documento</div>
      <div style="display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">
        ${WC_NEWS.feeds.map((f,i)=>`
          <button onclick="__newsLoad(${i},this)"
            class="__newsFeedBtn"
            style="padding:6px 12px;border:2px solid ${i===0?f.color:"#eee"};background:${i===0?f.color+"15":"#fafafa"};color:${i===0?f.color:"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;transition:all .15s;flex-shrink:0"
            ${i===0?'data-sel="1"':""}>
            ${f.icon} ${f.name}
          </button>`).join("")}
      </div>
    </div>
    <div id="__newsContent" style="flex:1;overflow-y:auto;padding:0 20px 16px">
      <div style="text-align:center;padding:30px;color:#bbb">
        <div style="font-size:32px;margin-bottom:10px">\u{1F4F0}</div>
        <div style="font-size:13px">Seleccion\xE1 un medio para cargar noticias</div>
      </div>
    </div>
    <div style="padding:12px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__newsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),__newsLoad(0,document.querySelector(".__newsFeedBtn"))}async function __newsLoad(idx,btn){document.querySelectorAll(".__newsFeedBtn").forEach(b=>{const f=WC_NEWS.feeds[Array.from(document.querySelectorAll(".__newsFeedBtn")).indexOf(b)];b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel});const feed=WC_NEWS.feeds[idx];btn&&(btn.style.borderColor=feed.color,btn.style.background=feed.color+"15",btn.style.color=feed.color,btn.dataset.sel="1");const content=document.getElementById("__newsContent");content&&(content.innerHTML=`<div style="text-align:center;padding:24px;color:#0084ff;font-size:13px">\u23F3 Cargando ${feed.name}...</div>`);try{const items=(await(await fetch(WC_NEWS.proxy+encodeURIComponent(feed.url))).json()).items||[];if(!items.length){content.innerHTML='<div style="text-align:center;padding:20px;color:#bbb">No se pudieron cargar las noticias</div>';return}content.innerHTML=items.slice(0,15).map(item=>{const date=item.pubDate?new Date(item.pubDate).toLocaleDateString("es-CR",{day:"numeric",month:"short"}):"",preview=(item.description||"").replace(/<[^>]+>/g,"").slice(0,120);return`
      <div style="padding:12px;border-radius:12px;margin-bottom:8px;border:1.5px solid #eee;cursor:pointer;transition:all .15s"
        onmouseover="this.style.borderColor='${feed.color}';this.style.background='${feed.color}08'"
        onmouseout="this.style.borderColor='#eee';this.style.background='#fff'">
        <div style="display:flex;align-items:flex-start;gap:10px">
          <div style="flex:1">
            <div style="font-size:13px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:4px">${item.title||""}</div>
            <div style="font-size:11px;color:#aaa;margin-bottom:6px">${feed.name} \xB7 ${date}</div>
            <div style="font-size:11px;color:#666;line-height:1.5">${preview}...</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button onclick="__newsInsert('${(item.title||"").replace(/'/g,"\\'")}','${(preview+"...").replace(/'/g,"\\'")}','${feed.name}','${date}','${item.link||""}')"
            style="flex:1;padding:6px;border:none;background:${feed.color};color:#fff;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600">
            \u{1F4CB} Insertar
          </button>
          <a href="${item.link||"#"}" target="_blank" style="flex:1;padding:6px;border:1.5px solid #eee;background:#fff;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600;color:#555;text-decoration:none;text-align:center">
            \u{1F517} Abrir
          </a>
        </div>
      </div>`}).join("")}catch(e){content&&(content.innerHTML=`<div style="text-align:center;padding:20px;color:#bbb;font-size:13px">Error al cargar: ${e.message}<br><br>Verific\xE1 tu conexi\xF3n a internet</div>`)}}function __newsInsert(title,preview,source,date,url){const html=`
  <div style="border-left:4px solid #e74c3c;background:#fafafa;border-radius:0 8px 8px 0;padding:12px 16px;margin:10px 0;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:11pt;font-weight:700;color:#1a2942;margin-bottom:4px">${title}</div>
    <div style="font-size:10pt;color:#555;line-height:1.6;margin-bottom:6px">${preview}</div>
    <div style="font-size:9pt;color:#aaa">Fuente: <strong>${source}</strong> \xB7 ${date}${url?` \xB7 <a href="${url}" style="color:#0084ff">Ver art\xEDculo completo</a>`:""}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__newsPanel").remove(),showToast("\u{1F4F0} Noticia insertada \u2705")}function openLaborContract(){const old=document.getElementById("__laborPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__laborPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const tipos=[{id:"indefinido",icon:"\u267E\uFE0F",name:"Tiempo indefinido",desc:"Art\xEDculo 26 CT \u2014 La forma m\xE1s com\xFAn"},{id:"determinado",icon:"\u{1F4C5}",name:"Plazo determinado",desc:"Art\xEDculo 31 CT \u2014 Con fecha de fin"},{id:"obra",icon:"\u{1F3D7}\uFE0F",name:"Obra o servicio",desc:"Para proyectos espec\xEDficos"},{id:"parcial",icon:"\u23F0",name:"Tiempo parcial",desc:"Menos de 48h/semana"},{id:"servicio",icon:"\u{1F4BC}",name:"Servicios profesionales",desc:"Contratista independiente"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4BC} Contratos de trabajo CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">C\xF3digo de Trabajo \xB7 Rep\xFAblica de Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      ${tipos.map(t=>`
        <button onclick="__laborOpen('${t.id}')"
          style="padding:14px 16px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">${t.icon}</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#1a1a1a">${t.name}</div>
              <div style="font-size:11px;color:#888">${t.desc}</div>
            </div>
            <div style="margin-left:auto;color:#ccc;font-size:16px">\u203A</div>
          </div>
        </button>`).join("")}
    </div>
    <button onclick="document.getElementById('__laborPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __laborOpen(tipo){document.getElementById("__laborPanel").remove();const old=document.getElementById("__laborFormPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__laborFormPanel",ov.style.cssText="position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px";const nombres={indefinido:"Tiempo indefinido",determinado:"Plazo determinado",obra:"Obra o servicio",parcial:"Tiempo parcial",servicio:"Servicios profesionales"},fields=[["__lbEmpresa","Nombre / Raz\xF3n social empleadora *","Empresa XYZ S.A."],["__lbCedJur","C\xE9dula jur\xEDdica","3-101-123456"],["__lbRepLegal","Representante legal","Juan P\xE9rez L\xF3pez"],["__lbTrabajador","Nombre del trabajador *","Mar\xEDa Garc\xEDa Rodr\xEDguez"],["__lbCedTrab","C\xE9dula trabajador *","1-1234-5678"],["__lbPuesto","Puesto / cargo *","Asistente administrativo"],["__lbSalario","Salario mensual (\u20A1) *","500000"],["__lbJornada","Jornada (h/semana)","48"],["__lbHorario","Horario de trabajo","Lunes a Viernes 8:00-17:00"],["__lbInicio","Fecha de inicio *",new Date().toLocaleDateString("es-CR")],...tipo==="determinado"||tipo==="obra"?[["__lbFin","Fecha de fin / conclusi\xF3n de obra","31 de diciembre de 2025"]]:[],["__lbLugar","Lugar de trabajo","San Jos\xE9, Costa Rica"],["__lbBeneficios","Beneficios adicionales","Seguro m\xE9dico, parqueo"]];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4BC} Contrato \u2014 ${nombres[tipo]}</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Complet\xE1 los datos para generar el contrato</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      ${fields.map(([id,label,ph])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__laborFormPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__laborGenerate('${tipo}')" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4BC} Generar contrato</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __laborG(id){return document.getElementById(id)?.value?.trim()||""}function __laborGenerate(tipo){const empresa=__laborG("__lbEmpresa"),cedJur=__laborG("__lbCedJur"),repLegal=__laborG("__lbRepLegal"),trabajador=__laborG("__lbTrabajador"),cedTrab=__laborG("__lbCedTrab"),puesto=__laborG("__lbPuesto"),salario=__laborG("__lbSalario"),jornada=__laborG("__lbJornada")||"48",horario=__laborG("__lbHorario"),inicio=__laborG("__lbInicio"),fin=__laborG("__lbFin"),lugar=__laborG("__lbLugar")||"San Jos\xE9, Costa Rica",beneficios=__laborG("__lbBeneficios");if(!empresa||!trabajador||!puesto||!salario){showToast("Complet\xE1 los campos obligatorios *");return}const salNum=parseFloat(salario.replace(/[^\d.]/g,""))||0,salFmt="\u20A1"+salNum.toLocaleString("es-CR"),aguinaldo=salNum/12,ccssPatronal=salNum*.2683,nombres={indefinido:"TIEMPO INDEFINIDO",determinado:"PLAZO DETERMINADO",obra:"OBRA O SERVICIO ESPEC\xCDFICO",parcial:"TIEMPO PARCIAL",servicio:"SERVICIOS PROFESIONALES"},clausulas={indefinido:`
      <p><strong>CUARTA (Plazo):</strong> El presente contrato es por tiempo <strong>indefinido</strong>, de conformidad con el art\xEDculo 26 del C\xF3digo de Trabajo, con inicio el <strong>${inicio}</strong>.</p>
      <p><strong>QUINTA (Per\xEDodo de prueba):</strong> Las primeras tres (3) semanas se considerar\xE1n per\xEDodo de prueba, durante el cual cualquiera de las partes podr\xE1 dar por terminado el contrato sin responsabilidad.</p>`,determinado:`
      <p><strong>CUARTA (Plazo):</strong> El presente contrato tendr\xE1 vigencia desde el <strong>${inicio}</strong> hasta el <strong>${fin||"__/__/____"}</strong>, de conformidad con el art\xEDculo 31 del C\xF3digo de Trabajo.</p>
      <p><strong>QUINTA (Renovaci\xF3n):</strong> Vencido el plazo, el contrato podr\xE1 ser renovado por acuerdo escrito de las partes.</p>`,obra:`
      <p><strong>CUARTA (Objeto y plazo):</strong> El contrato inicia el <strong>${inicio}</strong> y concluir\xE1 con la terminaci\xF3n de: <em>${fin||"la obra o servicio descrito"}</em>.</p>`,parcial:`
      <p><strong>CUARTA (Jornada reducida):</strong> La jornada de trabajo es de <strong>${jornada} horas semanales</strong>, de conformidad con la legislaci\xF3n vigente sobre trabajo a tiempo parcial.</p>`,servicio:`
      <p><strong>CUARTA (Naturaleza):</strong> Las partes dejan constancia que la relaci\xF3n que origina este contrato es de naturaleza <strong>civil de servicios profesionales</strong>, y no implica relaci\xF3n laboral, v\xEDnculo de subordinaci\xF3n ni jornada determinada.</p>
      <p><strong>QUINTA (Honorarios):</strong> Los honorarios pactados son de <strong>${salFmt} mensuales</strong>, que incluyen el pago de cargas sociales a cargo del contratista.</p>`},html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:11pt;color:#888;margin-bottom:4px">REP\xDABLICA DE COSTA RICA</div>
      <h2 style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase;margin:0">CONTRATO DE TRABAJO</h2>
      <div style="font-size:11pt;font-weight:700;color:#1a2942">MODALIDAD: ${nombres[tipo]||tipo.toUpperCase()}</div>
      <div style="width:60px;height:3px;background:#003da5;margin:10px auto"></div>
    </div>

    <p style="text-align:justify">Entre <strong>${empresa}</strong>, con c\xE9dula jur\xEDdica <strong>${cedJur}</strong>, representada por <strong>${repLegal}</strong>, en adelante <em>"EL EMPLEADOR"</em>; y <strong>${trabajador}</strong>, mayor, portador/a de la c\xE9dula de identidad n\xFAmero <strong>${cedTrab}</strong>, en adelante <em>"EL TRABAJADOR"</em>, se suscribe el presente Contrato de Trabajo al tenor de las siguientes cl\xE1usulas:</p>

    <p><strong>PRIMERA (Objeto):</strong> El trabajador se compromete a desempe\xF1ar el cargo de <strong>${puesto}</strong>, realizando las funciones propias del puesto y las que razonablemente le sean asignadas por el empleador.</p>

    <p><strong>SEGUNDA (Salario):</strong> El empleador pagar\xE1 al trabajador la suma de <strong>${salFmt} mensuales</strong>, pagadera en tractos quincenales. El trabajador tendr\xE1 derecho al aguinaldo anual equivalente a un salario mensual (aproximadamente <strong>\u20A1${Math.round(aguinaldo).toLocaleString("es-CR")}</strong>), seg\xFAn el art\xEDculo 166 del C\xF3digo de Trabajo.</p>

    <p><strong>TERCERA (Jornada y horario):</strong> La jornada ordinaria ser\xE1 de <strong>${jornada} horas semanales</strong>. El horario de trabajo ser\xE1: <strong>${horario||"a definir por las partes"}</strong>. El tiempo extraordinario se pagar\xE1 con el 50% de recargo sobre el salario ordinario.</p>

    ${clausulas[tipo]||""}

    <p><strong>SEXTA (Cargas sociales):</strong> El empleador realizar\xE1 las deducciones y aportes correspondientes a la Caja Costarricense de Seguro Social (CCSS), Instituto Nacional de Seguros (INS), IMAS, FODESAF y dem\xE1s cargas sociales establecidas por ley. La carga patronal estimada es de <strong>\u20A1${Math.round(ccssPatronal).toLocaleString("es-CR")} mensuales</strong>.</p>

    <p><strong>S\xC9TIMA (Vacaciones):</strong> El trabajador tendr\xE1 derecho a dos semanas de vacaciones por cada 50 semanas de trabajo continuo, de conformidad con el art\xEDculo 153 del C\xF3digo de Trabajo.</p>

    <p><strong>OCTAVA (Preaviso y cesant\xEDa):</strong> La terminaci\xF3n del contrato se regir\xE1 por las disposiciones del C\xF3digo de Trabajo, incluyendo el derecho a preaviso y auxilio de cesant\xEDa cuando corresponda.</p>

    ${beneficios?`<p><strong>NOVENA (Beneficios adicionales):</strong> El empleador otorgar\xE1 adem\xE1s los siguientes beneficios: <strong>${beneficios}</strong>.</p>`:""}

    <p><strong>D\xC9CIMA (Legislaci\xF3n aplicable):</strong> Este contrato se rige por el C\xF3digo de Trabajo de la Rep\xFAblica de Costa Rica (Ley N\xB0 2) y sus reformas vigentes.</p>

    <p style="text-align:justify">En fe de lo anterior, se firma en ${lugar}, a los <strong>${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</strong>.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:50px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${empresa}</strong><br><small>Empleador \u2014 C\xE9dula Jur\xEDdica ${cedJur}</small><br><small>${repLegal||"Representante Legal"}</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${trabajador}</strong><br><small>Trabajador \u2014 C\xE9dula ${cedTrab}</small></div></div>
    </div>

    <div style="margin-top:30px;border:1px solid #aaa;padding:12px;border-radius:4px;font-size:10pt;color:#555">
      <strong>AUTENTICACI\xD3N:</strong> ________________________, Notario P\xFAblico. Tomo: _____ Folio: _____ Asiento: _____
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__laborFormPanel").remove(),showToast("\u{1F4BC} Contrato de trabajo generado \u2705")}function openLiquidationCalc(){const old=document.getElementById("__liqPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__liqPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F9EE} Liquidaci\xF3n laboral CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">C\xF3digo de Trabajo \xB7 CCSS \xB7 C\xE1lculo de derechos laborales</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__liqSalario","Salario mensual (\u20A1) *","500000","number"],["__liqFechaIn","Fecha de ingreso *","01/01/2020","text"],["__liqFechaOut","Fecha de salida *",new Date().toLocaleDateString("es-CR"),"text"],["__liqVacPend","D\xEDas de vacaciones pendientes","0","number"],["__liqHorasExtra","Horas extra pendientes","0","number"]].map(([id,label,ph,type])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="${type}" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Motivo de salida</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${[["despido","Despido sin causa"],["renuncia","Renuncia voluntaria"],["mutuo","Mutuo acuerdo"],["justa","Despido con causa justa"]].map(([v,l],i)=>`
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?"#003da5":"#eee"};border-radius:8px;background:${i===0?"#f0f7ff":"#fafafa"};font-size:12px;font-weight:600">
            <input type="radio" name="__liqMotivo" value="${v}" ${i===0?"checked":""} style="accent-color:#003da5"> ${l}
          </label>`).join("")}
      </div>
    </div>

    <button onclick="__calcLiquidation()" style="width:100%;padding:12px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;margin-bottom:12px">\u{1F9EE} Calcular liquidaci\xF3n</button>

    <div id="__liqResult" style="display:none"></div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __calcLiquidation(){const salario=parseFloat(document.getElementById("__liqSalario")?.value)||0,fechaIn=document.getElementById("__liqFechaIn")?.value||"",fechaOut=document.getElementById("__liqFechaOut")?.value||"",vacPend=parseFloat(document.getElementById("__liqVacPend")?.value)||0,horasExtra=parseFloat(document.getElementById("__liqHorasExtra")?.value)||0,motivo=document.querySelector('[name="__liqMotivo"]:checked')?.value||"despido";if(!salario){showToast("Ingres\xE1 el salario");return}const parseDate=str=>{const p=str.split("/");return p.length===3?new Date(parseInt(p[2]),parseInt(p[1])-1,parseInt(p[0])):new Date(str)},entrada=parseDate(fechaIn),salida=parseDate(fechaOut);if(isNaN(entrada)||isNaN(salida)){showToast("Fechas inv\xE1lidas \u2014 us\xE1 DD/MM/AAAA");return}const diffMs=salida-entrada,diffDays=Math.floor(diffMs/(1e3*60*60*24)),anios=Math.floor(diffDays/365),mesesR=Math.floor(diffDays%365/30),diasT=diffDays%30,salarioDiario=salario/30,salarioHora=salario/240;let preaviso=0;(motivo==="renuncia"||motivo==="despido")&&(anios<1?preaviso=7:anios<2?preaviso=14:anios<3?preaviso=21:preaviso=28);const montoPreaviso=preaviso*salarioDiario;let montoCesantia=0;(motivo==="despido"||motivo==="mutuo")&&(montoCesantia=Math.min(anios*20+mesesR/12*20,176)*salarioDiario);const mesActual=salida.getMonth()+1,mesesAguinal=mesActual<=11?(mesActual-11+12)%12:mesActual-11,mesesAgProp=(salida-new Date(salida.getFullYear(),10,1))/(1e3*60*60*24*30),aguinaldo=salario*Math.min(Math.abs(mesesAgProp),12)/12,vacPropDias=diffDays/350*14-vacPend,montoVac=Math.max(0,vacPropDias)*salarioDiario,montoVacPend=vacPend*salarioDiario,montoHorasExtra=horasExtra*salarioHora*1.5,total=montoPreaviso+montoCesantia+aguinaldo+montoVac+montoVacPend+montoHorasExtra,ccssDeduccion=salario*.1067,fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),motivoLabel={despido:"Despido sin causa",renuncia:"Renuncia voluntaria",mutuo:"Mutuo acuerdo",justa:"Despido con causa justa"},resultHTML=`
  <div style="background:#f0f7ff;border-radius:12px;padding:16px;font-size:12pt;font-family:Calibri,Arial">
    <div style="font-size:14px;font-weight:700;color:#1a2942;margin-bottom:12px">\u{1F4CA} Resultado de liquidaci\xF3n</div>

    <div style="background:#fff;border-radius:8px;padding:10px;margin-bottom:10px;font-size:11px;color:#555">
      <div>Empleado trabaj\xF3: <strong>${anios} a\xF1os, ${mesesR} meses y ${diasT} d\xEDas</strong></div>
      <div>Motivo: <strong>${motivoLabel[motivo]}</strong> \xB7 Salario: <strong>${fmt(salario)}/mes</strong></div>
    </div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
      ${[["Preaviso",montoPreaviso,preaviso+" d\xEDas",motivo==="justa"?"#aaa":"#1a2942"],["Cesant\xEDa",montoCesantia,anios+" a\xF1os",motivo==="renuncia"||motivo==="justa"?"#aaa":"#1a2942"],["Aguinaldo proporcional",aguinaldo,"","#1a2942"],["Vacaciones proporcionales",montoVac,Math.round(Math.max(0,vacPropDias))+" d\xEDas","#1a2942"],["Vacaciones pendientes",montoVacPend,vacPend+" d\xEDas","#1a2942"],["Horas extra",montoHorasExtra,horasExtra+" horas","#1a2942"]].map(([label,amount,detail,color])=>`
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e8f0fe">
          <span style="color:#555">${label}${detail?` <span style="color:#aaa;font-size:10px">(${detail})</span>`:""}</span>
          <strong style="color:${color}">${fmt(amount)}</strong>
        </div>`).join("")}
    </div>

    <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:800;color:#003da5;background:#fff;border-radius:8px;padding:10px 12px;margin-bottom:10px">
      <span>TOTAL BRUTO</span><span>${fmt(total)}</span>
    </div>

    <div style="font-size:10px;color:#888;line-height:1.6;margin-bottom:10px">
      * Deducci\xF3n CCSS trabajador (~10.67%): ${fmt(ccssDeduccion)}<br>
      * Esta calculadora es referencial. Consult\xE1 con un abogado laboral para casos espec\xEDficos.
    </div>

    <div style="display:flex;gap:6px">
      <button onclick="__insertLiquidation()" style="flex:2;padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Insertar liquidaci\xF3n</button>
      <button onclick="document.getElementById('__liqPanel').remove()" style="flex:1;padding:9px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px">Cerrar</button>
    </div>
  </div>`,resEl=document.getElementById("__liqResult");resEl&&(resEl.style.display="block",resEl.innerHTML=resultHTML),window.__liqData={salario,anios,mesesR,diasT,preaviso,montoPreaviso,montoCesantia,aguinaldo,montoVac,montoVacPend,montoHorasExtra,total,motivo,motivoLabel}}function __insertLiquidation(){const d=window.__liqData;if(!d)return;const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:2px solid #003da5;border-radius:10px;overflow:hidden;max-width:580px;margin:12px auto">
    <div style="background:#003da5;color:#fff;padding:12px 16px;font-weight:700;font-size:13pt">\u{1F9EE} LIQUIDACI\xD3N LABORAL \u2014 COSTA RICA</div>
    <div style="padding:14px 16px;font-size:11pt">
      <div style="margin-bottom:10px;font-size:10pt;color:#666">Per\xEDodo: ${d.anios} a\xF1os, ${d.mesesR} meses \xB7 Motivo: ${d.motivoLabel[d.motivo]}</div>
      <table style="border-collapse:collapse;width:100%">
        <tr style="background:#f0f7ff"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Rubro</th><th style="padding:7px 10px;border:1px solid #ddd;text-align:right">Monto</th></tr>
        ${[["Preaviso",d.montoPreaviso],["Cesant\xEDa",d.montoCesantia],["Aguinaldo proporcional",d.aguinaldo],["Vacaciones proporcionales",d.montoVac],["Vacaciones pendientes",d.montoVacPend],["Horas extra",d.montoHorasExtra]].map(([l,v])=>`<tr><td style="padding:6px 10px;border:1px solid #ddd">${l}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(v)}</td></tr>`).join("")}
        <tr style="background:#003da5;color:#fff"><td style="padding:8px 10px;font-weight:700;font-size:12pt">TOTAL</td><td style="padding:8px 10px;text-align:right;font-weight:700;font-size:12pt">${fmt(d.total)}</td></tr>
      </table>
      <div style="font-size:9pt;color:#aaa;margin-top:8px">Calculado seg\xFAn C\xF3digo de Trabajo CR \xB7 Solo de referencia</div>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__liqPanel").remove(),showToast("\u{1F9EE} Liquidaci\xF3n insertada \u2705")}function openDocStats(){const old=document.getElementById("__statsPanel");old&&old.remove();const ed=document.getElementById("editor");if(!ed)return;const text=ed.innerText.trim(),words=text.split(/\s+/).filter(w=>w),chars=text.length,charsNS=text.replace(/\s/g,"").length,sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>3).length,paragraphs=text.split(`

`).filter(p=>p.trim()).length,headings=ed.querySelectorAll("h1,h2,h3").length,images=ed.querySelectorAll("img").length,tables=ed.querySelectorAll("table").length,links=ed.querySelectorAll("a").length,stopwords=new Set(["de","la","el","en","y","a","los","del","las","un","una","que","por","con","se","su","al","es","no","lo","para","como","m\xE1s","pero","o","sin","sobre","este","entre","cuando","muy","tambi\xE9n","hasta","hay","donde","quien","desde","todo","nos","durante","ni","contra","sin","bajo","durante","ante","seg\xFAn","mediante","durante"]),freq={};words.forEach(w=>{const clean=w.toLowerCase().replace(/[^a-záéíóúüñ]/gi,"");clean.length>3&&!stopwords.has(clean)&&(freq[clean]=(freq[clean]||0)+1)});const topWords=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,10),readTime=Math.max(1,Math.round(words.length/250)),speakTime=Math.max(1,Math.round(words.length/130)),avgWordsPerSentence=sentences>0?words.length/sentences:0,legibility=avgWordsPerSentence<15?"F\xE1cil":avgWordsPerSentence<25?"Moderado":"Complejo",legColor=avgWordsPerSentence<15?"#27ae60":avgWordsPerSentence<25?"#f39c12":"#e74c3c",ov=document.createElement("div");ov.id="__statsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CA} Estad\xEDsticas del documento</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">An\xE1lisis completo del contenido</div>

    <!-- M\xE9tricas principales -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
      ${[["\u{1F4DD}","Palabras",words.length.toLocaleString(),"#0084ff"],["\u{1F524}","Caracteres",chars.toLocaleString(),"#9b59b6"],["\u{1F521}","Sin espacios",charsNS.toLocaleString(),"#27ae60"],["\u{1F4AC}","Oraciones",sentences,"#f39c12"],["\xB6","P\xE1rrafos",paragraphs,"#e74c3c"],["H","T\xEDtulos",headings,"#003da5"]].map(([icon,label,val,color])=>`
        <div style="background:#f8f9fa;border-radius:12px;padding:12px;text-align:center">
          <div style="font-size:20px;margin-bottom:4px">${icon}</div>
          <div style="font-size:16px;font-weight:800;color:${color}">${val}</div>
          <div style="font-size:10px;color:#aaa">${label}</div>
        </div>`).join("")}
    </div>

    <!-- Tiempo -->
    <div style="background:#f0f7ff;border-radius:12px;padding:14px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:#0084ff;margin-bottom:8px">\u23F1\uFE0F Tiempos estimados</div>
      <div style="display:flex;justify-content:space-around">
        <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#003da5">${readTime} min</div><div style="font-size:10px;color:#aaa">Lectura silenciosa</div></div>
        <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#003da5">${speakTime} min</div><div style="font-size:10px;color:#aaa">Lectura en voz alta</div></div>
        <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:${legColor}">${legibility}</div><div style="font-size:10px;color:#aaa">Legibilidad</div></div>
      </div>
    </div>

    <!-- Elementos multimedia -->
    ${images||tables||links?`
    <div style="background:#f8f9fa;border-radius:12px;padding:12px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">\u{1F5BC}\uFE0F Elementos</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${images?`<span style="font-size:12px;color:#555">\u{1F5BC}\uFE0F ${images} imagen${images!==1?"es":""}</span>`:""}
        ${tables?`<span style="font-size:12px;color:#555">\u{1F4CA} ${tables} tabla${tables!==1?"s":""}</span>`:""}
        ${links?`<span style="font-size:12px;color:#555">\u{1F517} ${links} enlace${links!==1?"s":""}</span>`:""}
      </div>
    </div>`:""}

    <!-- Top palabras -->
    ${topWords.length?`
    <div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">\u{1F524} Palabras m\xE1s frecuentes</div>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${topWords.map(([word,count],i)=>{const pct=Math.round(count/topWords[0][1]*100);return`<div style="display:flex;align-items:center;gap:8px">
            <div style="font-size:11px;color:#555;width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${word}</div>
            <div style="flex:1;background:#eee;border-radius:3px;height:10px;overflow:hidden"><div style="height:100%;background:#0084ff;width:${pct}%;border-radius:3px"></div></div>
            <div style="font-size:10px;color:#aaa;min-width:24px;text-align:right">${count}</div>
          </div>`}).join("")}
      </div>
    </div>`:""}

    <!-- Bot\xF3n insertar reporte -->
    <div style="display:flex;gap:8px">
      <button onclick="__insertDocStats(${words.length},${chars},${sentences},${paragraphs},${readTime},'${legibility}','${legColor}')" style="flex:2;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Insertar reporte</button>
      <button onclick="document.getElementById('__statsPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __insertDocStats(words,chars,sentences,paragraphs,readTime,legibility,legColor){const html=`
  <div style="background:#f0f7ff;border:2px solid #0084ff;border-radius:10px;padding:14px;margin:10px 0;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:11pt;font-weight:700;color:#003da5;margin-bottom:10px">\u{1F4CA} Estad\xEDsticas del documento</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:10pt;text-align:center">
      <div><strong style="color:#0084ff">${words.toLocaleString()}</strong><br><small>palabras</small></div>
      <div><strong style="color:#9b59b6">${chars.toLocaleString()}</strong><br><small>caracteres</small></div>
      <div><strong style="color:#27ae60">${sentences}</strong><br><small>oraciones</small></div>
      <div><strong style="color:#f39c12">${paragraphs}</strong><br><small>p\xE1rrafos</small></div>
      <div><strong style="color:#003da5">${readTime} min</strong><br><small>lectura</small></div>
      <div><strong style="color:${legColor}">${legibility}</strong><br><small>legibilidad</small></div>
    </div>
    <div style="font-size:9pt;color:#aaa;margin-top:8px;text-align:right">${new Date().toLocaleString("es-CR")} \xB7 WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__statsPanel").remove(),showToast("\u{1F4CA} Reporte insertado \u2705")}function openMessagingExport(){const old=document.getElementById("__msgPanel");old&&old.remove();const ed=document.getElementById("editor"),text=ed?ed.innerText.trim():"",ov=document.createElement("div");ov.id="__msgPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4F1} Exportar a mensajer\xEDa</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Formatea el documento para WhatsApp, Telegram o SMS</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[{id:"whatsapp",icon:"\u{1F4AC}",name:"WhatsApp",color:"#25d366",hint:"Negrita *texto*, cursiva _texto_"},{id:"telegram",icon:"\u2708\uFE0F",name:"Telegram",color:"#0088cc",hint:"Markdown completo"},{id:"sms",icon:"\u{1F4F1}",name:"SMS",color:"#555",hint:"Texto plano sin formato"},{id:"email",icon:"\u{1F4E7}",name:"Email HTML",color:"#0084ff",hint:"HTML con estilos inline"}].map((p,i)=>`
        <button onclick="__msgSelectPlatform('${p.id}',this)"
          class="__msgPlatBtn"
          style="padding:12px;border:2px solid ${i===0?p.color:"#eee"};background:${i===0?p.color+"15":"#fafafa"};border-radius:12px;cursor:pointer;text-align:left;transition:all .15s"
          ${i===0?'data-sel="1"':""}>
          <div style="font-size:20px;margin-bottom:4px">${p.icon}</div>
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${p.name}</div>
          <div style="font-size:9px;color:#aaa;margin-top:2px">${p.hint}</div>
        </button>`).join("")}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Opciones</label>
      <div style="display:flex;flex-direction:column;gap:6px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
          <input type="checkbox" id="__msgTruncate" style="accent-color:#0084ff;width:14px;height:14px"> Truncar a 500 caracteres (para SMS)
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
          <input type="checkbox" id="__msgEmojis" checked style="accent-color:#0084ff;width:14px;height:14px"> Mantener emojis
        </label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
          <input type="checkbox" id="__msgSignature" style="accent-color:#0084ff;width:14px;height:14px"> Agregar firma
        </label>
        <input type="text" id="__msgSignatureText" placeholder="Firma: Ej. \u2014 Juan P\xE9rez, UCR"
          style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:4px">Vista previa</label>
      <div id="__msgPreview" style="background:#f0f0f0;border-radius:10px;padding:12px;font-size:12px;min-height:80px;max-height:150px;overflow-y:auto;color:#333;white-space:pre-wrap;font-family:'Courier New',monospace;line-height:1.5">
        ${text.slice(0,200).replace(/</g,"&lt;")}...
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__msgPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__msgExport()" style="flex:2;padding:11px;border:none;background:#25d366;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600" id="__msgExportBtn">\u{1F4E4} Exportar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__msgPlatform="whatsapp",__msgUpdatePreview()}function __msgSelectPlatform(id,btn){window.__msgPlatform=id;const color={whatsapp:"#25d366",telegram:"#0088cc",sms:"#555",email:"#0084ff"}[id]||"#0084ff";document.querySelectorAll(".__msgPlatBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",delete b.dataset.sel}),btn.style.borderColor=color,btn.style.background=color+"15",btn.dataset.sel="1";const expBtn=document.getElementById("__msgExportBtn");expBtn&&(expBtn.style.background=color),__msgUpdatePreview()}function __msgConvert(platform){const ed=document.getElementById("editor");if(!ed)return"";let text=ed.innerText.trim();const keepEmojis=document.getElementById("__msgEmojis")?.checked,truncate=document.getElementById("__msgTruncate")?.checked,signature=document.getElementById("__msgSignature")?.checked,sigText=document.getElementById("__msgSignatureText")?.value.trim(),htmlContent=ed.innerHTML,doc=new DOMParser().parseFromString(htmlContent,"text/html");if(platform==="whatsapp")doc.querySelectorAll("h1,h2,h3").forEach(h=>{h.textContent="*"+h.innerText.toUpperCase()+"*"}),doc.querySelectorAll("strong,b").forEach(el=>{el.textContent="*"+el.innerText+"*"}),doc.querySelectorAll("em,i").forEach(el=>{el.textContent="_"+el.innerText+"_"}),doc.querySelectorAll("li").forEach(li=>{li.textContent="\u2022 "+li.innerText}),text=doc.body.innerText;else if(platform==="telegram")doc.querySelectorAll("h1,h2,h3").forEach(h=>{h.textContent="**"+h.innerText.toUpperCase()+"**"}),doc.querySelectorAll("strong,b").forEach(el=>{el.textContent="**"+el.innerText+"**"}),doc.querySelectorAll("em,i").forEach(el=>{el.textContent="__"+el.innerText+"__"}),doc.querySelectorAll("li").forEach(li=>{li.textContent="\u2022 "+li.innerText}),text=doc.body.innerText;else if(platform==="sms")text=doc.body.innerText.replace(/\s+/g," ").trim();else if(platform==="email")return htmlContent+(signature&&sigText?`<p>\u2014<br>${sigText}</p>`:"");return keepEmojis||(text=text.replace(/[\u{1F600}-\u{1F9FF}]/gu,"")),truncate&&(text=text.slice(0,500)+(text.length>500?"...":"")),signature&&sigText&&(text+=`

\u2014
`+sigText),text}function __msgUpdatePreview(){const prev=document.getElementById("__msgPreview");if(!prev)return;const platform=window.__msgPlatform||"whatsapp",text=__msgConvert(platform).slice(0,300);prev.textContent=text+(text.length>=300?"...":"")}function __msgExport(){const platform=window.__msgPlatform||"whatsapp",content=__msgConvert(platform),urls={whatsapp:"https://wa.me/?text=",telegram:"https://t.me/share/url?url=&text="};if(platform==="email"){const blob=new Blob([content],{type:"text/html;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download="documento-email.html",a.click(),document.getElementById("__msgPanel").remove(),showToast("\u{1F4E7} HTML de email descargado \u2705");return}if(platform==="sms"){navigator.clipboard.writeText(content).then(()=>{document.getElementById("__msgPanel").remove(),showToast("\u{1F4F1} Texto copiado para SMS \u2705")});return}navigator.clipboard.writeText(content).then(()=>{const appName=platform==="whatsapp"?"WhatsApp":"Telegram",appUrl=platform==="whatsapp"?"https://wa.me/?text="+encodeURIComponent(content.slice(0,1e3)):"https://telegram.me/share/url?url=%20&text="+encodeURIComponent(content.slice(0,1e3));document.getElementById("__msgPanel").remove();const conf=document.createElement("div");conf.style.cssText="position:fixed;bottom:140px;left:12px;right:12px;max-width:400px;margin:0 auto;z-index:9990;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.2);padding:14px",conf.innerHTML=`
      <div style="font-size:13px;font-weight:700;color:#1a2942;margin-bottom:8px">\u2705 Texto copiado al portapapeles</div>
      <div style="font-size:12px;color:#555;margin-bottom:10px">Abr\xED ${appName} y peg\xE1 el mensaje, o us\xE1 el bot\xF3n:</div>
      <div style="display:flex;gap:8px">
        <a href="${appUrl}" target="_blank" style="flex:2;padding:9px;border:none;background:${platform==="whatsapp"?"#25d366":"#0088cc"};color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;text-decoration:none;text-align:center">Abrir ${appName}</a>
        <button onclick="this.closest('div[style]').remove()" style="flex:1;padding:9px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px">Cerrar</button>
      </div>`,document.body.appendChild(conf),setTimeout(()=>conf.remove(),8e3),showToast(`\u{1F4E4} Listo para ${appName} \u2705`)})}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"newsReader":openNewsReader();break;case"laborContract":openLaborContract();break;case"liquidationCalc":openLiquidationCalc();break;case"docStats":openDocStats();break;case"messagingExport":openMessagingExport();break;default:orig(a)}}),console.log("WC Corporate Editor v25.24 \u2705 \u2014 Noticias CR, Contratos Trabajo, Liquidaci\xF3n, Estad\xEDsticas, WhatsApp/Telegram")},3200)})();function openInvoicePro(){const old=document.getElementById("__invPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__invPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px";const num=String(parseInt(localStorage.getItem("wc-inv-num")||"0")+1).padStart(4,"0");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#1a2942,#003da5);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700">\u{1F9FE} Factura de servicios profesionales</div>
      <div style="font-size:11px;opacity:.8;margin-top:2px">N\xB0 ${num} \xB7 Costa Rica</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="grid-column:1/-1">
          <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">\u{1F464} Datos del profesional</div>
        </div>
        ${[["__invProfNombre","Nombre / Empresa *","Juan P\xE9rez Rodr\xEDguez"],["__invProfCedula","C\xE9dula / C\xE9dula Jur\xEDdica","1-2345-6789"],["__invProfEmail","Correo electr\xF3nico","juan@profesional.cr"],["__invProfTel","Tel\xE9fono","8888-1234"],["__invProfDir","Direcci\xF3n","San Jos\xE9, Costa Rica"],["__invProfActividad","Actividad profesional","Consultor\xEDa en tecnolog\xEDa"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join("")}

        <div style="grid-column:1/-1;margin-top:8px">
          <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">\u{1F3E2} Datos del cliente</div>
        </div>
        ${[["__invCliNombre","Nombre / Empresa *","Empresa Cliente S.A."],["__invCliCedula","C\xE9dula / C\xE9dula Jur\xEDdica","3-101-456789"],["__invCliEmail","Correo electr\xF3nico","cliente@empresa.cr"],["__invCliDir","Direcci\xF3n","Heredia, Costa Rica"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join("")}

        <div style="grid-column:1/-1;margin-top:8px">
          <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">\u{1F4CB} Servicios</div>
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px;margin-bottom:6px">
            <input type="text" id="__invSvcDesc" placeholder="Descripci\xF3n del servicio" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
            <input type="number" id="__invSvcCant" placeholder="Cantidad" value="1" step="0.5" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
            <input type="number" id="__invSvcPrecio" placeholder="Precio \u20A1" step="100" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
            <select id="__invSvcIVA" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
              <option value="13">IVA 13%</option>
              <option value="0" selected>Exento (servicios prof.)</option>
              <option value="4">IVA 4%</option>
            </select>
            <button onclick="__invAddLine()" style="padding:7px;border:none;background:#003da5;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar</button>
          </div>
          <div id="__invLines" style="max-height:120px;overflow-y:auto"></div>
        </div>

        <div style="grid-column:1/-1;margin-top:8px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Forma de pago</label>
              <select id="__invPago" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
                <option>Transferencia bancaria</option>
                <option>SINPE M\xF3vil</option>
                <option>Efectivo</option>
                <option>Cheque</option>
                <option>Tarjeta de cr\xE9dito</option>
              </select>
            </div>
            <div>
              <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Vencimiento</label>
              <select id="__invVence" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
                <option value="0">Al recibir</option>
                <option value="8">8 d\xEDas</option>
                <option value="15" selected>15 d\xEDas</option>
                <option value="30">30 d\xEDas</option>
                <option value="60">60 d\xEDas</option>
              </select>
            </div>
          </div>
        </div>

        <div style="grid-column:1/-1">
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Notas / condiciones</label>
          <textarea id="__invNotas" rows="2" placeholder="SINPE: 8888-1234 \xB7 Banco Nacional cuenta: 100-01-000-012345-6" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
        </div>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__invPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateInvoice()" style="flex:2;padding:10px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F9FE} Generar factura</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__invLines=[],window.__invNum=num}function __invAddLine(){const desc=document.getElementById("__invSvcDesc")?.value.trim(),cant=parseFloat(document.getElementById("__invSvcCant")?.value)||1,precio=parseFloat(document.getElementById("__invSvcPrecio")?.value)||0,iva=parseInt(document.getElementById("__invSvcIVA")?.value)||0;if(!desc||!precio){showToast("Ingres\xE1 descripci\xF3n y precio");return}window.__invLines||(window.__invLines=[]),window.__invLines.push({desc,cant,precio,iva,sub:cant*precio}),__invRenderLines(),document.getElementById("__invSvcDesc").value="",document.getElementById("__invSvcPrecio").value="",showToast("L\xEDnea agregada \u2705")}function __invRenderLines(){const box=document.getElementById("__invLines"),lines=window.__invLines||[];if(!box)return;if(!lines.length){box.innerHTML='<div style="text-align:center;color:#bbb;font-size:12px;padding:10px">Sin servicios a\xFAn</div>';return}const fmt=n=>"\u20A1"+n.toLocaleString("es-CR",{minimumFractionDigits:0});let total=0;box.innerHTML=`<div style="font-size:11px">
    ${lines.map((l,i)=>{const lineTotal=l.sub+l.sub*l.iva/100;return total+=lineTotal,`<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid #f0f0f0">
        <div style="flex:1;font-size:11px;color:#333">${l.desc} (\xD7${l.cant})</div>
        <div style="color:#555;font-size:10px">${l.iva?`+IVA ${l.iva}%`:""}</div>
        <div style="font-weight:600;color:#003da5;white-space:nowrap">${fmt(lineTotal)}</div>
        <button onclick="window.__invLines.splice(${i},1);__invRenderLines()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px;padding:0">\xD7</button>
      </div>`}).join("")}
    <div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;font-size:12px;color:#003da5">
      <span>TOTAL</span><span>\u20A1${total.toLocaleString("es-CR",{minimumFractionDigits:0})}</span>
    </div>
  </div>`,window.__invTotal=total}function __generateInvoice(){const lines=window.__invLines||[];if(!lines.length){showToast("Agreg\xE1 al menos un servicio");return}const g=id=>document.getElementById(id)?.value?.trim()||"",fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),total=window.__invTotal||0,ivaTotal=lines.reduce((a,l)=>a+l.sub*l.iva/100,0),subtotal=total-ivaTotal,num=window.__invNum,vence=parseInt(g("__invVence"))||0,fechaVence=new Date(Date.now()+vence*864e5).toLocaleDateString("es-CR");localStorage.setItem("wc-inv-num",String(parseInt(num)));const html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:580px;margin:12px auto;border:1px solid #ddd;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#1a2942,#003da5);color:#fff;padding:20px 24px;display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-size:20pt;font-weight:900;letter-spacing:1px">FACTURA</div>
        <div style="font-size:10pt;opacity:.8">N\xB0 ${num}</div>
      </div>
      <div style="text-align:right;font-size:10pt;opacity:.9">
        <div>${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</div>
        ${vence?`<div>Vence: ${fechaVence}</div>`:"<div>Pago al recibir</div>"}
      </div>
    </div>

    <div style="padding:16px 24px;display:grid;grid-template-columns:1fr 1fr;gap:16px;border-bottom:1px solid #eee;font-size:10pt">
      <div>
        <div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:4px">DE:</div>
        <div style="font-weight:700;color:#1a2942">${g("__invProfNombre")}</div>
        <div style="color:#555">${g("__invProfCedula")}</div>
        <div style="color:#555">${g("__invProfActividad")}</div>
        <div style="color:#555">${g("__invProfEmail")}</div>
        <div style="color:#555">${g("__invProfTel")}</div>
      </div>
      <div>
        <div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:4px">PARA:</div>
        <div style="font-weight:700;color:#1a2942">${g("__invCliNombre")}</div>
        <div style="color:#555">${g("__invCliCedula")}</div>
        <div style="color:#555">${g("__invCliEmail")}</div>
        <div style="color:#555">${g("__invCliDir")}</div>
      </div>
    </div>

    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0f7ff"><th style="padding:8px 12px;border:1px solid #ddd;text-align:left">Servicio</th><th style="padding:8px 12px;border:1px solid #ddd;text-align:center">Cant</th><th style="padding:8px 12px;border:1px solid #ddd;text-align:right">P.Unit</th><th style="padding:8px 12px;border:1px solid #ddd;text-align:right">Total</th></tr>
      ${lines.map((l,i)=>`<tr style="${i%2?"background:#fafafa":""}"><td style="padding:7px 12px;border:1px solid #ddd">${l.desc}${l.iva?` <span style="font-size:9px;color:#888">(+IVA ${l.iva}%)</span>`:' <span style="font-size:9px;color:#27ae60">(Exento)</span>'}</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center">${l.cant}</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:right">${fmt(l.precio)}</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(l.sub+l.sub*l.iva/100)}</td></tr>`).join("")}
    </table>

    <div style="padding:12px 24px;background:#f8f9fa;border-top:1px solid #eee">
      <div style="display:flex;justify-content:flex-end">
        <div style="text-align:right;font-size:10pt">
          ${ivaTotal?`<div style="color:#555;margin-bottom:4px">Subtotal: <strong>${fmt(subtotal)}</strong></div><div style="color:#e74c3c;margin-bottom:4px">IVA: <strong>${fmt(ivaTotal)}</strong></div>`:""}
          <div style="font-size:14pt;font-weight:800;color:#003da5;border-top:2px solid #003da5;padding-top:6px;margin-top:4px">TOTAL: ${fmt(total)}</div>
        </div>
      </div>
    </div>

    ${g("__invNotas")||g("__invPago")?`
    <div style="padding:12px 24px;border-top:1px solid #eee;font-size:10pt">
      <div style="color:#555"><strong>Forma de pago:</strong> ${g("__invPago")}</div>
      ${g("__invNotas")?`<div style="color:#555;margin-top:4px">${g("__invNotas")}</div>`:""}
    </div>`:""}

    <div style="padding:8px 24px;background:#1a2942;color:rgba(255,255,255,.5);font-size:8pt;text-align:center">
      Generado con WC Corporate Editor \xB7 ${new Date().toLocaleDateString("es-CR")}
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__invPanel").remove(),showToast(`\u{1F9FE} Factura N\xB0 ${num} generada \u2705`)}function openThesisAssistant(){const old=document.getElementById("__thesisPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__thesisPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const secciones=[{id:"portada",icon:"\u{1F4C4}",name:"Portada universitaria",desc:"UCR, TEC, UNA, UNED, ULatina..."},{id:"indice",icon:"\u{1F4D1}",name:"Tabla de contenidos",desc:"Estructura autom\xE1tica con TOC"},{id:"intro",icon:"\u{1F680}",name:"Introducci\xF3n completa",desc:"Antecedentes, justificaci\xF3n, objetivos"},{id:"marco",icon:"\u{1F4DA}",name:"Marco te\xF3rico",desc:"Con IA: conceptos y referencias APA"},{id:"metodo",icon:"\u{1F52C}",name:"Marco metodol\xF3gico",desc:"Tipo, enfoque, poblaci\xF3n, instrumentos"},{id:"hipotesis",icon:"\u{1F4A1}",name:"Hip\xF3tesis y variables",desc:"Variables dependientes e independientes"},{id:"cronograma",icon:"\u{1F4C5}",name:"Cronograma de actividades",desc:"Tabla por semanas/meses"},{id:"biblio",icon:"\u{1F4D6}",name:"Bibliograf\xEDa APA 7",desc:"Lista de referencias en formato APA"},{id:"estructura",icon:"\u{1F3D7}\uFE0F",name:"Estructura completa",desc:"Genera toda la estructura de una vez"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F393} Asistente de tesis</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Estructura y redacci\xF3n para trabajos finales de graduaci\xF3n</div>
      <input type="text" id="__thesisTopic" placeholder="Tema de tu tesis (ej: Impacto del turismo en Guanacaste 2025)"
        style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        <select id="__thesisUniv" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="UCR">Universidad de Costa Rica</option>
          <option value="TEC">Instituto Tecnol\xF3gico CR</option>
          <option value="UNA">Universidad Nacional</option>
          <option value="UNED">UNED</option>
          <option value="ULatina">U Latina</option>
          <option value="ULACIT">ULACIT</option>
          <option value="otra">Otra universidad</option>
        </select>
        <select id="__thesisGrado" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          <option value="bachillerato">Bachillerato</option>
          <option value="licenciatura" selected>Licenciatura</option>
          <option value="maestria">Maestr\xEDa</option>
          <option value="doctorado">Doctorado</option>
        </select>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px 16px;display:flex;flex-direction:column;gap:6px">
      ${secciones.map(s=>`
        <button onclick="__thesisGenerate('${s.id}')"
          style="padding:12px 14px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">${s.icon}</span>
            <div><div style="font-size:13px;font-weight:700;color:#1a1a1a">${s.name}</div><div style="font-size:11px;color:#888">${s.desc}</div></div>
            <div style="margin-left:auto;color:#ccc">\u203A</div>
          </div>
        </button>`).join("")}
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__thesisPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __thesisGenerate(seccion){const topic=document.getElementById("__thesisTopic")?.value.trim()||"Tema de investigaci\xF3n",univ=document.getElementById("__thesisUniv")?.value||"UCR",grado=document.getElementById("__thesisGrado")?.value||"licenciatura",gradoLabel={bachillerato:"Bachillerato",licenciatura:"Licenciatura",maestria:"Maestr\xEDa",doctorado:"Doctorado"},key=localStorage.getItem("wc-groq-key"),templates={portada:`
    <div style="font-family:'Times New Roman',serif;text-align:center;line-height:2;max-width:16cm;margin:0 auto;page-break-after:always">
      <p style="font-size:12pt">${univ==="UCR"?"UNIVERSIDAD DE COSTA RICA":univ==="TEC"?"INSTITUTO TECNOL\xD3GICO DE COSTA RICA":univ==="UNA"?"UNIVERSIDAD NACIONAL":univ+" DE COSTA RICA"}</p>
      <p style="font-size:11pt">FACULTAD DE ___________________</p>
      <p style="font-size:11pt">ESCUELA DE ___________________</p>
      <br><br>
      <p style="font-size:14pt;font-weight:700;line-height:1.5">${topic.toUpperCase()}</p>
      <br><br>
      <p style="font-size:12pt">Trabajo Final de Graduaci\xF3n sometido a la consideraci\xF3n de la Comisi\xF3n del Programa de Estudios de ${gradoLabel[grado]} en _____________________ para optar al grado y t\xEDtulo de ${gradoLabel[grado]} en _____________________</p>
      <br><br>
      <p style="font-size:12pt"><strong>Nombre del estudiante</strong></p>
      <p style="font-size:11pt">Carn\xE9: A12345</p>
      <br><br>
      <p style="font-size:12pt">Director/a: ______________________, Ph.D.</p>
      <br><br>
      <p style="font-size:12pt">Ciudad Universitaria Rodrigo Facio, Costa Rica</p>
      <p style="font-size:12pt">${new Date().getFullYear()}</p>
    </div>`,cronograma:`
    <div style="font-family:Calibri,Arial,sans-serif;max-width:16cm;margin:0 auto">
      <h2 style="color:#1a2942;margin-bottom:12px">Cronograma de actividades</h2>
      <table style="border-collapse:collapse;width:100%;font-size:10pt">
        <tr style="background:#003da5;color:#fff">
          <th style="padding:7px 10px;border:1px solid #002080;text-align:left">Actividad</th>
          ${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic"].map(m=>`<th style="padding:7px 5px;border:1px solid #002080;text-align:center;font-size:9pt">${m}</th>`).join("")}
        </tr>
        ${["Revisi\xF3n de literatura","Elaboraci\xF3n del marco te\xF3rico","Dise\xF1o metodol\xF3gico","Recolecci\xF3n de datos","An\xE1lisis de resultados","Redacci\xF3n del documento","Revisi\xF3n y correcciones","Defensa oral"].map((act,i)=>`
          <tr style="${i%2?"background:#f0f7ff":""}">
            <td style="padding:6px 10px;border:1px solid #ddd;font-size:10pt">${act}</td>
            ${Array(12).fill(0).map((_,j)=>`<td style="padding:6px 5px;border:1px solid #ddd;text-align:center">${j>=i&&j<=i+2?"\u25CF":""}</td>`).join("")}
          </tr>`).join("")}
      </table>
    </div>`,indice:`
    <div style="font-family:'Times New Roman',serif;max-width:16cm;margin:0 auto">
      <h2 style="text-align:center;margin-bottom:16px">\xCDNDICE GENERAL</h2>
      ${[["Dedicatoria","ii"],["Agradecimientos","iii"],["Resumen","iv"],["Abstract","v"],["Lista de cuadros","vi"],["Lista de figuras","vii"],["CAP\xCDTULO I. INTRODUCCI\xD3N","1"],["&nbsp;&nbsp;&nbsp;1.1 Antecedentes","2"],["&nbsp;&nbsp;&nbsp;1.2 Planteamiento del problema","4"],["&nbsp;&nbsp;&nbsp;1.3 Justificaci\xF3n","6"],["&nbsp;&nbsp;&nbsp;1.4 Objetivos","8"],["CAP\xCDTULO II. MARCO TE\xD3RICO","10"],["CAP\xCDTULO III. MARCO METODOL\xD3GICO","20"],["CAP\xCDTULO IV. RESULTADOS Y DISCUSI\xD3N","30"],["CAP\xCDTULO V. CONCLUSIONES Y RECOMENDACIONES","45"],["Referencias bibliogr\xE1ficas","50"],["Ap\xE9ndices","55"],["Anexos","60"]].map(([t,p])=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dotted #ccc;font-size:11pt">${t.startsWith("CAP\xCDTULO")?`<strong>${t}</strong>`:`<span>${t}</span>`}<span>${p}</span></div>`).join("")}
    </div>`};if(templates[seccion]){typeof insertHTML=="function"&&insertHTML(templates[seccion]+"<p></p>"),document.getElementById("__thesisPanel").remove(),showToast(`\u{1F393} ${seccion} generado \u2705`);return}if(!key){showToast("Configur\xE1 tu API Key de Groq para esta secci\xF3n");return}const prompts={intro:`Genera la secci\xF3n de INTRODUCCI\xD3N para una tesis de ${gradoLabel[grado]} sobre: "${topic}". Incluye: antecedentes (1 p\xE1rrafo), planteamiento del problema (1 p\xE1rrafo), justificaci\xF3n (1 p\xE1rrafo), objetivo general y 3 objetivos espec\xEDficos. Formato acad\xE9mico universitario costarricense. HTML con h2, h3, p.`,marco:`Genera el MARCO TE\xD3RICO para una tesis de ${gradoLabel[grado]} sobre: "${topic}". Incluye 3-4 conceptos clave definidos con referencias APA 7 (citas entre par\xE9ntesis). Formato acad\xE9mico. HTML con h2, h3, p.`,metodo:`Genera el MARCO METODOL\xD3GICO para una tesis de ${gradoLabel[grado]} sobre: "${topic}". Incluye: tipo de investigaci\xF3n, enfoque (cuantitativo/cualitativo), poblaci\xF3n y muestra, t\xE9cnicas e instrumentos de recolecci\xF3n, procedimiento de an\xE1lisis. HTML con h2, h3, p.`,hipotesis:`Genera las HIP\xD3TESIS Y VARIABLES para una tesis sobre: "${topic}". Incluye hip\xF3tesis de investigaci\xF3n, hip\xF3tesis nula, variable dependiente e independiente con definici\xF3n conceptual y operacional. HTML.`,biblio:`Genera una BIBLIOGRAF\xCDA de referencia en formato APA 7ma edici\xF3n con 10 fuentes acad\xE9micas relevantes sobre: "${topic}". Incluir libros, art\xEDculos de revista y fuentes electr\xF3nicas. Solo devolv\xE9 la lista HTML con <p> por referencia.`,estructura:`Genera la ESTRUCTURA COMPLETA de una tesis de ${gradoLabel[grado]} en ${univ} sobre: "${topic}". Incluye: t\xEDtulo, resumen (200 palabras), palabras clave, introducci\xF3n, objetivos, marco te\xF3rico (outline), metodolog\xEDa, cronograma texto, bibliograf\xEDa. Formato acad\xE9mico. HTML.`};document.getElementById("__thesisPanel").remove(),showToast("\u23F3 Generando con IA...");try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un asesor acad\xE9mico universitario costarricense. Gener\xE1s contenido para tesis siguiendo las normas de redacci\xF3n acad\xE9mica y APA 7."},{role:"user",content:prompts[seccion]||prompts.intro}],temperature:.4,max_tokens:1500})})).json())?.choices?.[0]?.message?.content||"";typeof insertHTML=="function"&&insertHTML(reply+"<p></p>"),showToast("\u{1F393} Secci\xF3n generada \u2705")}catch(e){showToast("Error: "+e.message)}}function openAcademicCalendar(){const old=document.getElementById("__calPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__calPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const events=[{date:"2025-02-10",name:"Inicio ciclo I-2025 UCR",type:"ucr",color:"#003da5"},{date:"2025-06-07",name:"Fin ciclo I-2025 UCR",type:"ucr",color:"#003da5"},{date:"2025-08-04",name:"Inicio ciclo II-2025 UCR",type:"ucr",color:"#003da5"},{date:"2025-11-29",name:"Fin ciclo II-2025 UCR",type:"ucr",color:"#003da5"},{date:"2025-01-01",name:"A\xF1o Nuevo",type:"feriado",color:"#e74c3c"},{date:"2025-04-11",name:"D\xEDa de Juan Santamar\xEDa",type:"feriado",color:"#e74c3c"},{date:"2025-04-17",name:"Jueves Santo",type:"feriado",color:"#e74c3c"},{date:"2025-04-18",name:"Viernes Santo",type:"feriado",color:"#e74c3c"},{date:"2025-05-01",name:"D\xEDa del Trabajo",type:"feriado",color:"#e74c3c"},{date:"2025-07-25",name:"Anexi\xF3n de Guanacaste",type:"feriado",color:"#e74c3c"},{date:"2025-08-02",name:"D\xEDa de la Madre",type:"feriado",color:"#e74c3c"},{date:"2025-08-15",name:"D\xEDa de la Madre (festivo)",type:"feriado",color:"#e74c3c"},{date:"2025-09-15",name:"Independencia de Costa Rica",type:"feriado",color:"#ce1126"},{date:"2025-10-12",name:"D\xEDa de las Culturas",type:"feriado",color:"#e74c3c"},{date:"2025-12-25",name:"Navidad",type:"feriado",color:"#e74c3c"},{date:"2025-02-03",name:"Inicio cursos MEP",type:"mep",color:"#27ae60"},{date:"2025-07-04",name:"Fin I semestre MEP",type:"mep",color:"#27ae60"},{date:"2025-07-21",name:"Inicio II semestre MEP",type:"mep",color:"#27ae60"},{date:"2025-11-14",name:"Fin II semestre MEP",type:"mep",color:"#27ae60"}],months={};events.forEach(e=>{const m=e.date.slice(0,7);months[m]||(months[m]=[]),months[m].push(e)});const monthNames=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4C5} Calendario acad\xE9mico CR 2025</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">UCR \xB7 MEP \xB7 Feriados nacionales</div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        ${[["#003da5","UCR"],["#27ae60","MEP"],["#e74c3c","Feriado"],["#ce1126","Independencia"]].map(([c,l])=>`
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#555">
            <div style="width:10px;height:10px;border-radius:50%;background:${c}"></div>${l}
          </div>`).join("")}
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px 16px">
      ${Object.entries(months).map(([ym,evs])=>{const[y,m]=ym.split("-");return`<div style="margin-bottom:14px">
          <div style="font-size:12px;font-weight:700;color:#555;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;padding:4px 8px;background:#f8f9fa;border-radius:6px">${monthNames[parseInt(m)-1]} ${y}</div>
          ${evs.sort((a,b)=>a.date.localeCompare(b.date)).map(e=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;margin-bottom:4px;border:1px solid ${e.color}22;cursor:pointer;transition:all .15s"
              onmouseover="this.style.background='${e.color}10'" onmouseout="this.style.background=''"
              onclick="__calInsert('${e.date}','${e.name.replace(/'/g,"\\'")}','${e.color}')">
              <div style="width:34px;height:34px;border-radius:8px;background:${e.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${e.date.slice(8)}</div>
              <div style="flex:1;font-size:12px;font-weight:600;color:#1a1a1a">${e.name}</div>
              <div style="font-size:10px;color:#aaa">+</div>
            </div>`).join("")}
        </div>`}).join("")}
    </div>

    <div style="padding:12px 20px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="__calInsertFull()" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Insertar calendario completo</button>
      <button onclick="document.getElementById('__calPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__calEvents=events}function __calInsert(date,name,color){const fmt=new Date(date+"T12:00:00").toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});typeof insertHTML=="function"&&insertHTML(`<span style="background:${color}15;border:1px solid ${color}55;border-radius:6px;padding:2px 10px;font-size:10pt">\u{1F4C5} ${fmt} \u2014 <strong>${name}</strong></span> `),document.getElementById("__calPanel").remove(),showToast("\u{1F4C5} Fecha insertada \u2705")}function __calInsertFull(){const events=window.__calEvents||[],months={};events.forEach(e=>{const m=e.date.slice(0,7);months[m]||(months[m]=[]),months[m].push(e)});const mNames=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];let html='<div style="font-family:Calibri,Arial,sans-serif;max-width:16cm;margin:0 auto"><h2 style="color:#003da5;margin-bottom:16px;text-align:center">\u{1F4C5} Calendario Acad\xE9mico CR 2025</h2>';Object.entries(months).forEach(([ym,evs])=>{const[y,m]=ym.split("-");html+=`<div style="margin-bottom:14px"><div style="background:#003da5;color:#fff;padding:6px 12px;border-radius:6px;font-size:11pt;font-weight:700;margin-bottom:8px">${mNames[parseInt(m)-1]} ${y}</div>`,evs.sort((a,b)=>a.date.localeCompare(b.date)).forEach(e=>{const d=new Date(e.date+"T12:00:00");html+=`<div style="display:flex;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid #f0f0f0"><div style="width:28px;height:28px;border-radius:6px;background:${e.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${e.date.slice(8)}</div><div style="font-size:10pt;color:#333">${e.name}</div></div>`}),html+="</div>"}),html+='<p style="font-size:9pt;color:#aaa;text-align:right">Fuente: UCR, MEP, Gobierno CR \xB7 WC Corporate Editor</p></div>',typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__calPanel").remove(),showToast("\u{1F4C5} Calendario completo insertado \u2705")}function openFormatConverter(){const old=document.getElementById("__convPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__convPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const conversions=[{from:"HTML",to:"Markdown",icon:"\u{1F4DD}",fn:"__convHtmlToMd"},{from:"Markdown",to:"HTML",icon:"\u{1F310}",fn:"__convMdToHtml"},{from:"HTML",to:"Texto",icon:"\u{1F4C3}",fn:"__convHtmlToTxt"},{from:"Texto",to:"HTML",icon:"\u{1F524}",fn:"__convTxtToHtml"},{from:"HTML",to:"RTF",icon:"\u{1F4CB}",fn:"__convHtmlToRtf"},{from:"CSV",to:"Tabla HTML",icon:"\u{1F4CA}",fn:"__convCsvToTable"},{from:"JSON",to:"Tabla HTML",icon:"\u{1F527}",fn:"__convJsonToTable"},{from:"HTML",to:"LaTeX",icon:"\u2211",fn:"__convHtmlToLatex"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F504} Conversor de formatos</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Convert\xED entre formatos de documento</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${conversions.map(c=>`
          <button onclick="__convOpen('${c.fn}','${c.from}','${c.to}')"
            style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:left;transition:all .15s;display:flex;align-items:center;gap:8px"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
            <span style="font-size:18px">${c.icon}</span>
            <div>
              <div style="font-size:12px;font-weight:700;color:#1a1a1a">${c.from} \u2192 ${c.to}</div>
            </div>
          </button>`).join("")}
      </div>
    </div>

    <div id="__convWorkArea" style="flex:1;overflow-y:auto;padding:0 20px;display:none">
      <div id="__convTitle" style="font-size:13px;font-weight:700;color:#555;margin-bottom:8px"></div>
      <textarea id="__convInput" rows="6" placeholder="Peg\xE1 el contenido a convertir..."
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace;margin-bottom:8px"
        onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      <button onclick="__convRun()" style="width:100%;padding:9px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:8px">\u{1F504} Convertir</button>
      <textarea id="__convOutput" rows="6" readonly placeholder="Resultado..."
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace;background:#f8f9fa;margin-bottom:8px"></textarea>
      <div style="display:flex;gap:6px">
        <button onclick="navigator.clipboard.writeText(document.getElementById('__convOutput').value).then(()=>showToast('Copiado \u2705'))" style="flex:1;padding:8px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Copiar</button>
        <button onclick="__convInsertResult()" style="flex:2;padding:8px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar en doc</button>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__convPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __convOpen(fn,from,to){window.__convFn=fn;const work=document.getElementById("__convWorkArea"),title=document.getElementById("__convTitle"),input=document.getElementById("__convInput");if(work&&(work.style.display="block"),title&&(title.textContent=`${from} \u2192 ${to}`),input&&(input.placeholder=`Peg\xE1 el contenido en formato ${from}...`,input.value=""),document.getElementById("__convOutput").value="",from==="HTML"){const ed=document.getElementById("editor");ed&&input&&(input.value=ed.innerHTML.slice(0,2e3))}}function __convRun(){const input=document.getElementById("__convInput")?.value||"",output=document.getElementById("__convOutput");if(!input.trim()||!output)return;let result="";const fn=window.__convFn;if(fn==="__convHtmlToMd")result=input.replace(/<h1[^>]*>(.*?)<\/h1>/gi,`# $1
`).replace(/<h2[^>]*>(.*?)<\/h2>/gi,`## $1
`).replace(/<h3[^>]*>(.*?)<\/h3>/gi,`### $1
`).replace(/<strong[^>]*>(.*?)<\/strong>/gi,"**$1**").replace(/<b[^>]*>(.*?)<\/b>/gi,"**$1**").replace(/<em[^>]*>(.*?)<\/em>/gi,"_$1_").replace(/<i[^>]*>(.*?)<\/i>/gi,"_$1_").replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,"[$2]($1)").replace(/<li[^>]*>(.*?)<\/li>/gi,`- $1
`).replace(/<br\s*\/?>/gi,`
`).replace(/<p[^>]*>(.*?)<\/p>/gi,`$1

`).replace(/<[^>]+>/g,"").trim();else if(fn==="__convMdToHtml")result=input.replace(/^### (.+)$/gm,"<h3>$1</h3>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/_(.+?)_/g,"<em>$1</em>").replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>').replace(/^- (.+)$/gm,"<li>$1</li>").replace(/(<li>.*<\/li>)/s,"<ul>$1</ul>").replace(/\n\n/g,"</p><p>").replace(/^(.+)$/gm,"$1"),result="<p>"+result+"</p>";else if(fn==="__convHtmlToTxt"){const d=document.createElement("div");d.innerHTML=input,result=d.innerText}else if(fn==="__convTxtToHtml")result=input.split(`

`).map(p=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join(`
`);else if(fn==="__convHtmlToRtf"){const d=document.createElement("div");d.innerHTML=input,result=`{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Calibri;}}
\\f0\\fs23
`+d.innerText.replace(/\n/g,`\\par
`)+`
}`}else if(fn==="__convCsvToTable"){const rows=input.split(`
`).filter(l=>l.trim()).map(l=>l.split(",").map(c=>c.trim()));result=`<table style="border-collapse:collapse;width:100%">
`,rows.forEach((row,i)=>{result+=`  <tr>
`,row.forEach(cell=>{result+=i===0?`    <th style="padding:8px;border:1px solid #ddd;background:#003da5;color:#fff">${cell}</th>
`:`    <td style="padding:7px;border:1px solid #ddd">${cell}</td>
`}),result+=`  </tr>
`}),result+="</table>"}else if(fn==="__convJsonToTable")try{const data=JSON.parse(input),arr=Array.isArray(data)?data:[data],keys=Object.keys(arr[0]||{});result=`<table style="border-collapse:collapse;width:100%">
`,result+="  <tr>"+keys.map(k=>`<th style="padding:8px;border:1px solid #ddd;background:#003da5;color:#fff">${k}</th>`).join("")+`</tr>
`,arr.forEach(row=>{result+="  <tr>"+keys.map(k=>`<td style="padding:7px;border:1px solid #ddd">${row[k]??""}</td>`).join("")+`</tr>
`}),result+="</table>"}catch(e){result="Error: JSON inv\xE1lido \u2014 "+e.message}else fn==="__convHtmlToLatex"&&(result=input.replace(/<h1[^>]*>(.*?)<\/h1>/gi,`\\chapter{$1}
`).replace(/<h2[^>]*>(.*?)<\/h2>/gi,`\\section{$1}
`).replace(/<h3[^>]*>(.*?)<\/h3>/gi,`\\subsection{$1}
`).replace(/<strong[^>]*>(.*?)<\/strong>/gi,"\\textbf{$1}").replace(/<em[^>]*>(.*?)<\/em>/gi,"\\textit{$1}").replace(/<p[^>]*>(.*?)<\/p>/gi,`$1

`).replace(/<[^>]+>/g,"").replace(/&amp;/g,"\\&").replace(/&lt;/g,"<").replace(/&gt;/g,">"),result=`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[spanish]{babel}
\\begin{document}

`+result+`
\\end{document}`);output.value=result,window.__convResult=result}function __convInsertResult(){const result=window.__convResult||document.getElementById("__convOutput")?.value;result&&(result.includes("<")&&result.includes(">")?typeof insertHTML=="function"&&insertHTML(result):typeof insertHTML=="function"&&insertHTML('<pre style="background:#f8f9fa;padding:12px;border-radius:8px;font-size:10pt;white-space:pre-wrap">'+result+"</pre>"),document.getElementById("__convPanel").remove(),showToast("\u{1F504} Contenido insertado \u2705"))}const WC_SHORTCUTS={defaults:[{key:"ctrl+b",action:"bold",label:"Negrita",category:"Formato"},{key:"ctrl+i",action:"italic",label:"Cursiva",category:"Formato"},{key:"ctrl+u",action:"underline",label:"Subrayado",category:"Formato"},{key:"ctrl+s",action:"save",label:"Guardar",category:"Archivo"},{key:"ctrl+z",action:"undo",label:"Deshacer",category:"Editar"},{key:"ctrl+y",action:"redo",label:"Rehacer",category:"Editar"},{key:"ctrl+f",action:"findReplace",label:"Buscar/Reemplazar",category:"Editar"},{key:"ctrl+p",action:"export",label:"Imprimir/PDF",category:"Archivo"},{key:"ctrl+shift+t",action:"translateInline",label:"Traducir",category:"Herramientas"},{key:"ctrl+shift+z",action:"zenMode",label:"Modo zen",category:"Vista"},{key:"ctrl+shift+p",action:"pomodoro",label:"Pomodoro",category:"Herramientas"},{key:"ctrl+shift+s",action:"docStats",label:"Estad\xEDsticas",category:"Ver"},{key:"ctrl+shift+a",action:"apaAssistant",label:"Asistente APA",category:"Herramientas"},{key:"ctrl+shift+v",action:"voiceAI",label:"Voz + IA",category:"IA"},{key:"f1",action:"openAI",label:"Asistente Sib\xF6",category:"IA"}],custom:JSON.parse(localStorage.getItem("wc-shortcuts-custom")||"[]"),all(){return[...this.defaults,...this.custom]},save(){localStorage.setItem("wc-shortcuts-custom",JSON.stringify(this.custom))},add(key,action,label){this.custom.push({key,action,label,category:"Personalizado"}),this.save()},remove(idx){this.custom.splice(idx,1),this.save()},formatKey(k){return k.split("+").map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(" + ")},install(){document.addEventListener("keydown",e=>{const parts=[];(e.ctrlKey||e.metaKey)&&parts.push("ctrl"),e.shiftKey&&parts.push("shift"),e.altKey&&parts.push("alt");const k=e.key.toLowerCase();k!=="control"&&k!=="shift"&&k!=="alt"&&k!=="meta"&&parts.push(k);const combo=parts.join("+"),sc=this.all().find(s=>s.key===combo);sc&&typeof window.handleAction=="function"&&(["ctrl+b","ctrl+i","ctrl+u","ctrl+z","ctrl+y","ctrl+s","ctrl+c","ctrl+v","ctrl+x","ctrl+a"].includes(combo)||(e.preventDefault(),window.handleAction(sc.action)))})}};function openShortcutsPanel(){const old=document.getElementById("__scPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__scPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const categories=[...new Set(WC_SHORTCUTS.all().map(s=>s.category))];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2328\uFE0F Atajos de teclado</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Personaliz\xE1 tus combinaciones de teclas</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px">
        <input type="text" id="__scKey" placeholder="ej: ctrl+shift+k"
          style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <input type="text" id="__scAction" placeholder="action (ej: zenMode)"
          style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        <button onclick="__scAdd()" style="padding:7px;border:none;background:#0084ff;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">+ Agregar</button>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 20px 16px">
      ${categories.map(cat=>`
        <div style="margin-bottom:14px">
          <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${cat}</div>
          ${WC_SHORTCUTS.all().filter(s=>s.category===cat).map((s,i)=>`
            <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #f5f5f5">
              <kbd style="background:#f0f0f0;border:1px solid #ddd;border-radius:4px;padding:2px 8px;font-size:11px;font-family:'Courier New',monospace;white-space:nowrap;flex-shrink:0">${WC_SHORTCUTS.formatKey(s.key)}</kbd>
              <span style="flex:1;font-size:12px;color:#333">${s.label}</span>
              <button onclick="window.handleAction&&window.handleAction('${s.action}');document.getElementById('__scPanel').remove()" style="padding:3px 8px;border:none;background:#f0f7ff;color:#0084ff;border-radius:5px;cursor:pointer;font-size:10px;font-weight:600">\u25B6</button>
              ${s.category==="Personalizado"?`<button onclick="WC_SHORTCUTS.remove(${WC_SHORTCUTS.custom.indexOf(s)});openShortcutsPanel()" style="padding:3px 6px;border:none;background:none;color:#e74c3c;border-radius:5px;cursor:pointer;font-size:12px">\xD7</button>`:""}
            </div>`).join("")}
        </div>`).join("")}

      <div style="background:#f0f7ff;border-radius:10px;padding:12px;font-size:11px;color:#555;line-height:1.7">
        \u{1F4A1} <strong>Tip:</strong> Los atajos Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z son manejados directamente por el navegador. Los atajos personalizados con Ctrl+Shift+[letra] son los m\xE1s seguros para agregar.
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__scPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __scAdd(){const key=document.getElementById("__scKey")?.value.trim().toLowerCase(),action=document.getElementById("__scAction")?.value.trim();if(!key||!action){showToast("Complet\xE1 atajo y acci\xF3n");return}WC_SHORTCUTS.add(key,action,action),openShortcutsPanel(),showToast("Atajo agregado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"invoicePro":openInvoicePro();break;case"thesisAssistant":openThesisAssistant();break;case"academicCalendar":openAcademicCalendar();break;case"formatConverter":openFormatConverter();break;case"shortcuts":openShortcutsPanel();break;default:orig(a)}}),WC_SHORTCUTS.install(),console.log("WC Corporate Editor v25.25 \u2705 \u2014 Facturas Pro, Tesis, Calendario CR, Conversor, Atajos")},3300)})();const WC_AUTOTRANSLATE={enabled:!1,srcLang:"es",tgtLang:"en",delay:1500,timer:null,lastText:"",langs:{es:"Espa\xF1ol",en:"English",fr:"Fran\xE7ais",pt:"Portugu\xEAs",de:"Deutsch",it:"Italiano",bribri:"Bribri CR",cabecar:"Cab\xE9car CR"},toggle(){this.enabled=!this.enabled,this.enabled?this.start():this.stop(),showToast(this.enabled?`\u{1F310} Traducci\xF3n autom\xE1tica activada (${this.langs[this.srcLang]} \u2192 ${this.langs[this.tgtLang]})`:"Traducci\xF3n autom\xE1tica desactivada")},start(){const ed=document.getElementById("editor");!ed||this._handler||(this._handler=()=>{clearTimeout(this.timer),this.timer=setTimeout(()=>this.translateSelection(),this.delay)},ed.addEventListener("input",this._handler),this._showWidget())},stop(){const ed=document.getElementById("editor");ed&&this._handler&&(ed.removeEventListener("input",this._handler),this._handler=null),clearTimeout(this.timer);const w=document.getElementById("__atWidget");w&&w.remove()},async translateSelection(){const key=localStorage.getItem("wc-groq-key");if(!key)return;const sel=window.getSelection(),text=sel&&sel.toString().trim();if(!text||text.length<5||text===this.lastText)return;this.lastText=text;const widget=document.getElementById("__atWidget");widget&&(widget.querySelector("#__atContent").textContent="\u23F3 Traduciendo...");try{const trans=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Sos un traductor experto. Traduc\xEDs \xDANICAMENTE el texto dado de ${this.langs[this.srcLang]} a ${this.langs[this.tgtLang]}. Solo devolv\xE9s la traducci\xF3n, sin explicaciones ni comillas.`},{role:"user",content:text}],temperature:.1,max_tokens:500})})).json())?.choices?.[0]?.message?.content?.trim()||"";if(!trans)return;const w=document.getElementById("__atWidget");w&&(w.querySelector("#__atContent").textContent=trans,w.querySelector("#__atOriginal").textContent=text.slice(0,80)+(text.length>80?"...":""),w.querySelector("#__atInsertBtn").style.display="block",window.__atTranslation=trans)}catch{}},_showWidget(){const old=document.getElementById("__atWidget");old&&old.remove();const w=document.createElement("div");w.id="__atWidget",w.style.cssText='position:fixed;bottom:160px;right:12px;z-index:9000;background:#fff;border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,.15);padding:12px;width:220px;border:1.5px solid #e0e0e0;font-family:-apple-system,"Segoe UI",sans-serif',w.innerHTML=`
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <div style="width:8px;height:8px;background:#27ae60;border-radius:50%;animation:wcPulse 1.5s infinite"></div>
        <div style="font-size:11px;font-weight:700;color:#555;flex:1">\u{1F310} Auto-traducci\xF3n</div>
        <select id="__atTgtLang" style="padding:2px 4px;border:1px solid #eee;border-radius:4px;font-size:10px;outline:none" onchange="WC_AUTOTRANSLATE.tgtLang=this.value">
          ${Object.entries(this.langs).map(([k,v])=>`<option value="${k}" ${k===this.tgtLang?"selected":""}>${v}</option>`).join("")}
        </select>
        <button onclick="WC_AUTOTRANSLATE.stop();WC_AUTOTRANSLATE.enabled=false" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:14px;padding:0">\u2715</button>
      </div>
      <div id="__atOriginal" style="font-size:10px;color:#aaa;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Seleccion\xE1 texto para traducir</div>
      <div id="__atContent" style="font-size:12px;color:#1a1a1a;line-height:1.5;min-height:24px"></div>
      <button id="__atInsertBtn" onclick="if(window.__atTranslation&&typeof insertHTML==='function'){insertHTML(' <span style=\\"background:#f0fff4;border:1px solid #27ae60;border-radius:4px;padding:1px 6px;font-size:10pt\\">'+window.__atTranslation+'</span> ');showToast('Traducci\xF3n insertada \u2705')}" style="display:none;margin-top:8px;width:100%;padding:6px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4E5} Insertar traducci\xF3n</button>
    `,document.body.appendChild(w)}};function openAutoTranslatePanel(){const old=document.getElementById("__atPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__atPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F310} Traducci\xF3n autom\xE1tica</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Traduc\xED texto seleccionado autom\xE1ticamente mientras escrib\xEDs</div>

    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:16px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma origen</label>
        <select id="__atSrc" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          ${Object.entries(WC_AUTOTRANSLATE.langs).map(([k,v])=>`<option value="${k}" ${k===WC_AUTOTRANSLATE.srcLang?"selected":""}>${v}</option>`).join("")}
        </select>
      </div>
      <div style="font-size:18px;color:#aaa;text-align:center">\u2192</div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Idioma destino</label>
        <select id="__atTgt" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
          ${Object.entries(WC_AUTOTRANSLATE.langs).map(([k,v])=>`<option value="${k}" ${k===WC_AUTOTRANSLATE.tgtLang?"selected":""}>${v}</option>`).join("")}
        </select>
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Traducci\xF3n r\xE1pida \u2014 Peg\xE1 texto</label>
      <textarea id="__atQuickInput" rows="3" placeholder="Peg\xE1 aqu\xED texto para traducir..."
        style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      <button onclick="__atQuickTranslate()" style="width:100%;margin-top:6px;padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F310} Traducir ahora</button>
      <div id="__atQuickResult" style="display:none;margin-top:8px;background:#f0fff4;border-radius:8px;padding:10px;font-size:13px;color:#1a1a1a;line-height:1.6"></div>
    </div>

    <div style="background:${WC_AUTOTRANSLATE.enabled?"#d4edda":"#f8f9fa"};border-radius:10px;padding:12px;margin-bottom:14px;text-align:center">
      <div style="font-size:13px;font-weight:700;color:${WC_AUTOTRANSLATE.enabled?"#155724":"#888"}">
        ${WC_AUTOTRANSLATE.enabled?"\u2705 Modo autom\xE1tico activo":"\u23F8 Modo autom\xE1tico inactivo"}
      </div>
      <div style="font-size:11px;color:#aaa;margin-top:3px">Seleccion\xE1 texto en el editor para traducir autom\xE1ticamente</div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__atPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="WC_AUTOTRANSLATE.srcLang=document.getElementById('__atSrc').value;WC_AUTOTRANSLATE.tgtLang=document.getElementById('__atTgt').value;WC_AUTOTRANSLATE.toggle();document.getElementById('__atPanel').remove()"
        style="flex:2;padding:11px;border:none;background:${WC_AUTOTRANSLATE.enabled?"#e74c3c":"#27ae60"};color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        ${WC_AUTOTRANSLATE.enabled?"\u23F8 Desactivar":"\u25B6 Activar autom\xE1tico"}
      </button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __atQuickTranslate(){const key=localStorage.getItem("wc-groq-key"),text=document.getElementById("__atQuickInput")?.value.trim(),src=document.getElementById("__atSrc")?.value||"es",tgt=document.getElementById("__atTgt")?.value||"en",resEl=document.getElementById("__atQuickResult");if(!text){showToast("Ingres\xE1 texto para traducir");return}if(!key){showToast("Configur\xE1 tu API Key de Groq");return}resEl&&(resEl.style.display="block",resEl.textContent="\u23F3 Traduciendo...");try{const trans=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Traduc\xEDs de ${WC_AUTOTRANSLATE.langs[src]||src} a ${WC_AUTOTRANSLATE.langs[tgt]||tgt}. Solo devolv\xE9s la traducci\xF3n.`},{role:"user",content:text}],temperature:.1,max_tokens:600})})).json())?.choices?.[0]?.message?.content?.trim()||"";resEl&&(resEl.innerHTML=`<div style="margin-bottom:6px">${trans}</div>
        <button onclick="if(typeof insertHTML==='function')insertHTML('<p>${trans.replace(/'/g,"\\'")}</p>');document.getElementById('__atPanel').remove();showToast('Insertado \u2705')"
          style="padding:5px 12px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4E5} Insertar</button>`)}catch(e){resEl&&(resEl.textContent="Error: "+e.message)}}const WC_GDRIVE={clientId:localStorage.getItem("wc-gdrive-client-id")||"",token:localStorage.getItem("wc-gdrive-token")||"",scopes:"https://www.googleapis.com/auth/drive.file",isConnected(){return!!this.token},async connect(){const clientId=document.getElementById("__gdriveClientId")?.value.trim();if(!clientId){showToast("Ingres\xE1 tu Client ID de Google");return}localStorage.setItem("wc-gdrive-client-id",clientId),this.clientId=clientId;const url=`https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=token&scope=${encodeURIComponent(this.scopes)}`;window.open(url,"_blank","width=500,height=600"),showToast("\u23F3 Complet\xE1 la autenticaci\xF3n en la ventana que se abri\xF3...")},setToken(token){this.token=token,localStorage.setItem("wc-gdrive-token",token),showToast("\u2705 Google Drive conectado")},disconnect(){this.token="",localStorage.removeItem("wc-gdrive-token"),showToast("Google Drive desconectado")},async saveFile(name,content,mimeType){if(!this.token){showToast("Conect\xE1 Google Drive primero");return}const meta={name,mimeType:"application/vnd.google-apps.document",parents:["root"]},boundary="-------314159265358979323846",body=`--${boundary}\r
Content-Type: application/json\r
\r
${JSON.stringify(meta)}\r
--${boundary}\r
Content-Type: ${mimeType}\r
\r
${content}\r
--${boundary}--`;try{const data=await(await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{Authorization:"Bearer "+this.token,"Content-Type":`multipart/related; boundary="${boundary}"`},body})).json();if(data.id)return showToast("\u2601\uFE0F Guardado en Google Drive \u2705"),data.id;data.error?.code===401&&(this.token="",localStorage.removeItem("wc-gdrive-token"),showToast("Token expirado \u2014 reconect\xE1 Google Drive"))}catch(e){showToast("Error Google Drive: "+e.message)}},async listFiles(){if(!this.token)return[];try{return(await(await fetch("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'&fields=files(id,name,modifiedTime)&orderBy=modifiedTime+desc&pageSize=20",{headers:{Authorization:"Bearer "+this.token}})).json()).files||[]}catch{return[]}}};(function(){const match=window.location.hash.match(/access_token=([^&]+)/);match&&(WC_GDRIVE.setToken(match[1]),window.location.hash="")})();function openGDrivePanel(){const old=document.getElementById("__gdrivePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__gdrivePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const connected=WC_GDRIVE.isConnected();ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <svg width="20" height="20" viewBox="0 0 87.3 78" style="flex-shrink:0"><path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/><path d="M43.65 25L29.9 0c-1.35.8-2.5 1.9-3.3 3.3L1.2 48.5A9.06 9.06 0 000 53h27.5z" fill="#00ac47"/><path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.65 9.5z" fill="#ea4335"/><path d="M43.65 25L57.4 0H14.0c-1.55 0-3.1.4-4.5 1.2z" fill="#00832d"/><path d="M59.8 53H27.5L13.75 76.8c1.4.8 2.95 1.2 4.5 1.2h50.8c1.55 0 3.1-.4 4.5-1.2z" fill="#2684fc"/><path d="M73.4 26.5l-12.75-22.2C59.85 2.9 58.7 1.8 57.35 1L43.6 25l16.2 28H87.3c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/></svg>
      Google Drive
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Guard\xE1 y carg\xE1 documentos desde tu Drive</div>

    ${connected?`
      <div style="background:#d4edda;border-radius:10px;padding:12px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">\u2705</span>
        <div><div style="font-size:13px;font-weight:700;color:#155724">Conectado a Google Drive</div><div style="font-size:11px;color:#27ae60">Token activo</div></div>
        <button onclick="WC_GDRIVE.disconnect();document.getElementById('__gdrivePanel').remove();showToast('Desconectado')" style="margin-left:auto;padding:5px 10px;border:1px solid #27ae60;background:#fff;color:#e74c3c;border-radius:6px;cursor:pointer;font-size:11px">Desconectar</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Nombre del archivo</label>
          <input type="text" id="__gdriveFileName" value="Documento WC ${new Date().toLocaleDateString("es-CR")}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        <button onclick="__gdriveSave()" style="padding:11px;border:none;background:#4285f4;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2601\uFE0F Guardar en Drive</button>
        <button onclick="__gdriveListFiles()" style="padding:10px;border:1.5px solid #4285f4;background:#fff;color:#4285f4;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4C2} Ver archivos en Drive</button>
      </div>
      <div id="__gdriveFiles" style="display:none;max-height:180px;overflow-y:auto"></div>
    `:`
      <div style="background:#fff9e6;border:1.5px solid #f39c12;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#856404;line-height:1.6">
        \u2139\uFE0F Para usar Google Drive necesit\xE1s un <strong>Client ID</strong> de Google Cloud Console.<br>
        1. Ir a <a href="https://console.cloud.google.com" target="_blank" style="color:#4285f4">console.cloud.google.com</a><br>
        2. Crear proyecto \u2192 Credenciales \u2192 OAuth 2.0<br>
        3. Tipo: "Aplicaci\xF3n web" \u2192 Origen: <code style="background:#f0f0f0;padding:1px 4px;border-radius:3px">${window.location.origin}</code>
      </div>
      <div style="margin-bottom:14px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Client ID de Google OAuth 2.0</label>
        <input type="text" id="__gdriveClientId" value="${WC_GDRIVE.clientId}"
          placeholder="xxxxxxxx.apps.googleusercontent.com"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#4285f4'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <button onclick="WC_GDRIVE.connect()" style="width:100%;padding:12px;border:none;background:#4285f4;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;margin-bottom:10px">
        Conectar con Google Drive
      </button>
    `}

    <button onclick="document.getElementById('__gdrivePanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __gdriveSave(){const name=document.getElementById("__gdriveFileName")?.value.trim()||"Documento WC",ed=document.getElementById("editor");if(!ed)return;showToast("\u2601\uFE0F Guardando en Drive..."),await WC_GDRIVE.saveFile(name,ed.innerHTML,"text/html")&&(document.getElementById("__gdrivePanel").remove(),showToast("\u2601\uFE0F Guardado en Google Drive \u2705"))}async function __gdriveListFiles(){const box=document.getElementById("__gdriveFiles");if(!box)return;box.style.display="block",box.innerHTML='<div style="text-align:center;color:#aaa;font-size:12px;padding:10px">\u23F3 Cargando archivos...</div>';const files=await WC_GDRIVE.listFiles();if(!files.length){box.innerHTML='<div style="text-align:center;color:#aaa;font-size:12px;padding:10px">Sin documentos en Drive</div>';return}box.innerHTML=files.map(f=>`
    <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f0f0f0">
      <div style="font-size:16px">\u{1F4C4}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.name}</div>
        <div style="font-size:10px;color:#aaa">${new Date(f.modifiedTime).toLocaleDateString("es-CR")}</div>
      </div>
      <a href="https://docs.google.com/document/d/${f.id}/edit" target="_blank" style="padding:4px 8px;border:1px solid #4285f4;color:#4285f4;border-radius:5px;font-size:10px;font-weight:600;text-decoration:none">Abrir</a>
    </div>`).join("")}const WC_COLLAB={channel:null,roomId:"",userName:localStorage.getItem("wc-collab-name")||"Usuario",users:{},active:!1,syncTimer:null,lastHash:"",join(roomId){this.active&&this.leave(),this.roomId=roomId||"wc-room-"+Math.random().toString(36).slice(2,8),this.channel=new BroadcastChannel("wc-collab-"+this.roomId),this.active=!0,this.channel.onmessage=e=>{const msg=e.data;if(msg?.type)switch(msg.type){case"content":this._receiveContent(msg);break;case"cursor":this._receiveCursor(msg);break;case"join":this._receiveJoin(msg);break;case"leave":this._receiveLeave(msg);break;case"chat":this._receiveChat(msg);break}},this.broadcast({type:"join",user:this.userName,ts:Date.now()}),this.syncTimer=setInterval(()=>this._syncContent(),2e3),this._showPanel(),showToast(`\u{1F465} Sala ${this.roomId} \u2014 Conectado`)},leave(){if(!this.active)return;this.broadcast({type:"leave",user:this.userName}),this.channel&&this.channel.close(),clearInterval(this.syncTimer),this.active=!1,this.users={},this.lastHash="";const p=document.getElementById("__collabPanel");p&&p.remove(),showToast("Saliste de la sala colaborativa")},broadcast(msg){this.channel&&this.channel.postMessage({...msg,from:this.userName,ts:Date.now()})},_syncContent(){const ed=document.getElementById("editor");if(!ed)return;const hash=ed.innerHTML.length+ed.innerHTML.slice(0,50);hash!==this.lastHash&&(this.lastHash=hash,this.broadcast({type:"content",html:ed.innerHTML,user:this.userName}))},_receiveContent(msg){if(msg.from===this.userName)return;const ed=document.getElementById("editor");if(!ed)return;const hash=ed.innerHTML.length+ed.innerHTML.slice(0,50),newHash=msg.html.length+msg.html.slice(0,50);hash!==newHash&&(ed.innerHTML=msg.html,this._logChat(`\u270F\uFE0F ${msg.from} edit\xF3 el documento`))},_receiveJoin(msg){this.users[msg.from]={name:msg.from,color:this._userColor(msg.from),ts:msg.ts},this._updateUserList(),this._logChat(`\u{1F44B} ${msg.from} se uni\xF3 a la sala`)},_receiveLeave(msg){delete this.users[msg.from],this._updateUserList(),this._logChat(`\u{1F44B} ${msg.from} sali\xF3 de la sala`)},_receiveCursor(msg){this.users[msg.from]={...this.users[msg.from],cursor:msg.pos}},_receiveChat(msg){this._logChat(`\u{1F4AC} ${msg.from}: ${msg.text}`)},_logChat(text){const log=document.getElementById("__collabLog");if(!log)return;const entry=document.createElement("div");entry.style.cssText="font-size:11px;padding:4px 0;border-bottom:1px solid #f0f0f0;color:#555",entry.textContent=text,log.appendChild(entry),log.scrollTop=99999},_updateUserList(){const ul=document.getElementById("__collabUsers");if(!ul)return;const allUsers=[{name:this.userName,color:this._userColor(this.userName)},...Object.values(this.users)];ul.innerHTML=allUsers.map(u=>`
      <div style="display:flex;align-items:center;gap:6px;padding:4px 0">
        <div style="width:24px;height:24px;border-radius:50%;background:${u.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${u.name[0].toUpperCase()}</div>
        <div style="font-size:12px;color:#333">${u.name}${u.name===this.userName?" (t\xFA)":""}</div>
        <div style="width:7px;height:7px;background:#27ae60;border-radius:50%;margin-left:auto"></div>
      </div>`).join("")},_userColor(name){const colors=["#e74c3c","#3498db","#2ecc71","#9b59b6","#f39c12","#1abc9c","#e67e22","#e91e63"];let h=0;for(let i=0;i<name.length;i++)h=name.charCodeAt(i)+((h<<5)-h);return colors[Math.abs(h)%colors.length]},sendChat(text){text.trim()&&(this.broadcast({type:"chat",text}),this._logChat(`\u{1F4AC} T\xFA: ${text}`))},_showPanel(){const old=document.getElementById("__collabPanel");old&&old.remove();const panel=document.createElement("div");panel.id="__collabPanel",panel.style.cssText='position:fixed;top:80px;right:12px;z-index:9000;background:#fff;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.15);width:220px;border:1.5px solid #eee;font-family:-apple-system,"Segoe UI",sans-serif;overflow:hidden',panel.innerHTML=`
      <div style="background:#1a2942;color:#fff;padding:10px 12px;display:flex;align-items:center;gap:8px">
        <div style="width:8px;height:8px;background:#27ae60;border-radius:50%;animation:wcPulse 1.5s infinite"></div>
        <div style="font-size:12px;font-weight:700;flex:1">\u{1F465} Sala: ${this.roomId}</div>
        <button onclick="WC_COLLAB.leave()" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:10px">Salir</button>
      </div>
      <div style="padding:8px 10px">
        <div style="font-size:10px;font-weight:700;color:#aaa;margin-bottom:6px">USUARIOS EN L\xCDNEA</div>
        <div id="__collabUsers"></div>
      </div>
      <div style="padding:6px 10px;border-top:1px solid #eee">
        <div style="font-size:10px;font-weight:700;color:#aaa;margin-bottom:4px">ACTIVIDAD</div>
        <div id="__collabLog" style="max-height:80px;overflow-y:auto"></div>
      </div>
      <div style="padding:6px 10px;border-top:1px solid #eee;display:flex;gap:4px">
        <input type="text" id="__collabChatInput" placeholder="Mensaje..."
          style="flex:1;padding:5px 7px;border:1.5px solid #eee;border-radius:6px;font-size:11px;outline:none"
          onkeydown="if(event.key==='Enter'){WC_COLLAB.sendChat(this.value);this.value=''}"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#eee'">
        <button onclick="const inp=document.getElementById('__collabChatInput');WC_COLLAB.sendChat(inp.value);inp.value=''" style="padding:5px 8px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:12px">\u2192</button>
      </div>`,document.body.appendChild(panel),this._updateUserList(),this._logChat(`\u2705 Conectado como ${this.userName}`)}};function openCollabPanel(){const old=document.getElementById("__collabConfigPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__collabConfigPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F465} Colaboraci\xF3n en tiempo real</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Edit\xE1 con otros en la misma red o navegador</div>

    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#555;line-height:1.6">
      \u2139\uFE0F Usa <strong>BroadcastChannel</strong> \u2014 funciona entre pesta\xF1as y ventanas del mismo navegador. Para colaboraci\xF3n entre dispositivos necesit\xE1s el mismo servidor/red local.
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tu nombre</label>
        <input type="text" id="__collabName" value="${WC_COLLAB.userName}"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">ID de sala (o dej\xE1 vac\xEDo para crear nueva)</label>
        <input type="text" id="__collabRoom" placeholder="ej: sala-equipo-alpha" value="${WC_COLLAB.roomId||""}"
          style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    ${WC_COLLAB.active?`
      <div style="background:#d4edda;border-radius:10px;padding:10px;margin-bottom:12px;text-align:center;font-size:13px;font-weight:700;color:#155724">
        \u2705 Conectado en sala: ${WC_COLLAB.roomId}
      </div>
      <button onclick="WC_COLLAB.leave();document.getElementById('__collabConfigPanel').remove()" style="width:100%;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:8px">
        \u{1F6AA} Salir de la sala
      </button>`:`
      <button onclick="WC_COLLAB.userName=document.getElementById('__collabName').value||'Usuario';localStorage.setItem('wc-collab-name',WC_COLLAB.userName);WC_COLLAB.join(document.getElementById('__collabRoom').value.trim());document.getElementById('__collabConfigPanel').remove()"
        style="width:100%;padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:8px">
        \u{1F465} Unirse / Crear sala
      </button>`}

    <button onclick="document.getElementById('__collabConfigPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cancelar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}const WC_BORUCA_THIEL={words:[{es:"uno",boruca:"k\xF9p\xFA",thiel:!0,cat:"N\xFAmeros"},{es:"dos",boruca:"k\xF9w\xE1",thiel:!0,cat:"N\xFAmeros"},{es:"tres",boruca:"k\xF9m\xE1",thiel:!0,cat:"N\xFAmeros"},{es:"cuatro",boruca:"k\xF9k\xED",thiel:!0,cat:"N\xFAmeros"},{es:"cinco",boruca:"s\xF9b\xFAr\xFA",thiel:!0,cat:"N\xFAmeros"},{es:"agua",boruca:"\xF9nk\xFA",thiel:!0,cat:"Naturaleza"},{es:"fuego",boruca:"t\xF6",thiel:!0,cat:"Naturaleza"},{es:"tierra",boruca:"dr\xF9",thiel:!0,cat:"Naturaleza"},{es:"sol",boruca:"chirr\xED",thiel:!0,cat:"Naturaleza"},{es:"luna",boruca:"\xF1\xE1mb\xFA",thiel:!0,cat:"Naturaleza"},{es:"estrella",boruca:"kuap\xF6",thiel:!0,cat:"Naturaleza"},{es:"piedra",boruca:"k\xFAr\xF6",thiel:!0,cat:"Naturaleza"},{es:"\xE1rbol",boruca:"g\xF9\xE1r\xF6",thiel:!0,cat:"Naturaleza"},{es:"monte",boruca:"br\xFAkr\xF6",thiel:!0,cat:"Naturaleza"},{es:"r\xEDo",boruca:"\xF9rb\xFAr\xF6",thiel:!0,cat:"Naturaleza"},{es:"lluvia",boruca:"k\xF9\xE1r\xF6",thiel:!0,cat:"Naturaleza"},{es:"viento",boruca:"si\xE1r\xF6",thiel:!0,cat:"Naturaleza"},{es:"cabeza",boruca:"g\xF9k\xF6",thiel:!0,cat:"Cuerpo"},{es:"ojo",boruca:"n\xF9\xE9r\xF6",thiel:!0,cat:"Cuerpo"},{es:"mano",boruca:"g\xF9b\xF6",thiel:!0,cat:"Cuerpo"},{es:"pie",boruca:"g\xF9k\xE1r\xF6",thiel:!0,cat:"Cuerpo"},{es:"coraz\xF3n",boruca:"g\xF9k\xF9r\xF6",thiel:!0,cat:"Cuerpo"},{es:"boca",boruca:"g\xF9m\xF6",thiel:!0,cat:"Cuerpo"},{es:"nariz",boruca:"g\xF9s\xF6",thiel:!0,cat:"Cuerpo"},{es:"hombre",boruca:"br\xF6m",thiel:!0,cat:"Personas"},{es:"mujer",boruca:"m\xF9r\xE1",thiel:!0,cat:"Personas"},{es:"ni\xF1o",boruca:"kr\xF9r\xFA",thiel:!0,cat:"Personas"},{es:"padre",boruca:"g\xF9p\xE1",thiel:!0,cat:"Personas"},{es:"madre",boruca:"g\xF9m\xE1",thiel:!0,cat:"Personas"},{es:"hijo",boruca:"g\xF9kr\xFAr\xFA",thiel:!0,cat:"Personas"},{es:"casa",boruca:"kr\xF6",thiel:!0,cat:"Vivienda"},{es:"hola",boruca:"danz\xF6",thiel:!1,cat:"Frases"},{es:"gracias",boruca:"sh\xEDi",thiel:!1,cat:"Frases"},{es:"s\xED",boruca:"\xF6",thiel:!1,cat:"Frases"},{es:"no",boruca:"ka",thiel:!1,cat:"Frases"},{es:"bueno",boruca:"chirr\xF6",thiel:!0,cat:"Frases"},{es:"malo",boruca:"k\xE0mb\xF6",thiel:!0,cat:"Frases"},{es:"jaguar",boruca:"br\xF6m k\xF9ndr\xF6",thiel:!0,cat:"Animales"},{es:"serpiente",boruca:"n\xF9s\xF6",thiel:!0,cat:"Animales"},{es:"ave",boruca:"si\xF6",thiel:!0,cat:"Animales"},{es:"venado",boruca:"k\xFCmb\xF6",thiel:!0,cat:"Animales"},{es:"perro",boruca:"\xE0\xFAr\xF6",thiel:!0,cat:"Animales"},{es:"ma\xEDz",boruca:"br\xFAk\xF6",thiel:!0,cat:"Comida"},{es:"frijol",boruca:"k\xF9r\xF9m\xF6",thiel:!0,cat:"Comida"},{es:"carne",boruca:"g\xF9n\xF6",thiel:!0,cat:"Comida"},{es:"sal",boruca:"\xF9r\xF6",thiel:!0,cat:"Comida"}]};function openBorucaThiel(){const old=document.getElementById("__borucaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__borucaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const cats=[...new Set(WC_BORUCA_THIEL.words.map(w=>w.cat))];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:2px">\u{1F4D6} Diccionario Boruca \u2014 Thiel 1905</div>
      <div style="font-size:11px;color:#888;margin-bottom:2px">Fuente: <em>Lenguas Ind\xEDgenas de Costa Rica</em> \u2014 Bernardo A. Thiel</div>
      <div style="font-size:11px;color:#27ae60;margin-bottom:12px;display:flex;align-items:center;gap:4px">\u{1F33F} ${WC_BORUCA_THIEL.words.filter(w=>w.thiel).length} palabras aut\xE9nticas del Diccionario Thiel 1905</div>

      <input type="text" id="__borucaSearch" placeholder="Buscar en espa\xF1ol o boruca..."
        style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__borucaFilter(this.value)">

      <div style="display:flex;gap:6px;margin-bottom:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px">
        <button onclick="__borucaFilterCat('',this)" class="__borucaCatBtn" data-sel="1"
          style="padding:5px 12px;border:2px solid #27ae60;background:#f0fff4;color:#155724;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0">
          Todo
        </button>
        ${cats.map(c=>`
          <button onclick="__borucaFilterCat('${c}',this)" class="__borucaCatBtn"
            style="padding:5px 12px;border:2px solid #eee;background:#fafafa;color:#555;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0;transition:all .15s">
            ${c}
          </button>`).join("")}
      </div>
    </div>

    <div id="__borucaList" style="flex:1;overflow-y:auto;padding:0 20px 16px"></div>

    <div style="padding:12px 20px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="__borucaInsertTable()" style="flex:2;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Insertar glosario completo</button>
      <button onclick="document.getElementById('__borucaPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__borucaCat="",__borucaRender(WC_BORUCA_THIEL.words)}function __borucaRender(words){const list=document.getElementById("__borucaList");if(list){if(!words.length){list.innerHTML='<div style="text-align:center;color:#bbb;padding:20px;font-size:13px">Sin resultados</div>';return}list.innerHTML=words.map(w=>`
    <div style="display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;margin-bottom:4px;border:1px solid #eee;cursor:pointer;transition:all .15s"
      onmouseover="this.style.borderColor='#27ae60';this.style.background='#f0fff4'"
      onmouseout="this.style.borderColor='#eee';this.style.background=''"
      onclick="__borucaInsertWord('${w.boruca.replace(/'/g,"\\'")}','${w.es}','${w.cat}')">
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;color:#1a472a">${w.boruca}</div>
        <div style="font-size:12px;color:#555">${w.es} <span style="color:#aaa;font-size:10px">\xB7 ${w.cat}</span></div>
      </div>
      ${w.thiel?'<div style="font-size:9px;background:#f0fff4;border:1px solid #27ae60;color:#155724;border-radius:4px;padding:2px 5px;flex-shrink:0">Thiel 1905</div>':""}
      <button onclick="event.stopPropagation();if(window.WC_INDIGENOUS_TTS){WC_INDIGENOUS_TTS.speakFast('${w.boruca.replace(/'/g,"\\'")}')}else{const u=new SpeechSynthesisUtterance('${w.boruca.replace(/'/g,"\\'")}');u.lang='es-CR';u.rate=0.7;speechSynthesis.speak(u)}"
        style="width:30px;height:30px;border:none;background:#27ae60;color:#fff;border-radius:50%;cursor:pointer;font-size:14px;flex-shrink:0">\u{1F50A}</button>
    </div>`).join("")}}function __borucaFilter(q){const cat=window.__borucaCat||"";let words=WC_BORUCA_THIEL.words;cat&&(words=words.filter(w=>w.cat===cat)),q.trim()&&(words=words.filter(w=>w.es.includes(q.toLowerCase())||w.boruca.includes(q.toLowerCase()))),__borucaRender(words)}function __borucaFilterCat(cat,btn){window.__borucaCat=cat,document.querySelectorAll(".__borucaCatBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#27ae60",btn.style.background="#f0fff4",btn.style.color="#155724",btn.dataset.sel="1",__borucaFilter(document.getElementById("__borucaSearch")?.value||"")}function __borucaInsertWord(boruca,es,cat){typeof insertHTML=="function"&&insertHTML(`<span style="background:#f0fff4;border:1px solid #27ae60;border-radius:4px;padding:1px 8px;font-size:10pt"><strong style="color:#1a472a">${boruca}</strong> <span style="color:#888;font-size:9pt">(${es} \u2014 Boruca/Brunca, Thiel 1905)</span></span> `),document.getElementById("__borucaPanel").remove(),showToast("\u{1F33F} Palabra Boruca insertada \u2705")}function __borucaInsertTable(){const cats=[...new Set(WC_BORUCA_THIEL.words.map(w=>w.cat))];let html=`<div style="font-family:Calibri,Arial,sans-serif;max-width:16cm;margin:0 auto">
    <h2 style="color:#1a472a;margin-bottom:4px">\u{1F33F} Glosario Boruca (Brunca)</h2>
    <p style="font-size:10pt;color:#888;margin-bottom:14px">Fuente: Diccionario Thiel 1905 \u2014 <em>Lenguas Ind\xEDgenas de Costa Rica</em> \u2014 Bernardo A. Thiel</p>`;cats.forEach(cat=>{const words=WC_BORUCA_THIEL.words.filter(w=>w.cat===cat);html+=`<div style="margin-bottom:14px"><div style="background:#1a472a;color:#fff;padding:5px 10px;border-radius:5px;font-size:10pt;font-weight:700;margin-bottom:6px">${cat}</div>
      <table style="border-collapse:collapse;width:100%;font-size:10pt">
        <tr style="background:#f0fff4"><th style="padding:5px 8px;border:1px solid #c8e6c9;text-align:left">Espa\xF1ol</th><th style="padding:5px 8px;border:1px solid #c8e6c9;text-align:left">Boruca (Brunca)</th><th style="padding:5px 8px;border:1px solid #c8e6c9">Fuente</th></tr>
        ${words.map((w,i)=>`<tr style="${i%2?"background:#f9fbe7":""}"><td style="padding:5px 8px;border:1px solid #ddd">${w.es}</td><td style="padding:5px 8px;border:1px solid #ddd;font-weight:600;color:#1a472a">${w.boruca}</td><td style="padding:5px 8px;border:1px solid #ddd;text-align:center;font-size:9pt;color:#888">${w.thiel?"Thiel 1905":"Tradicional"}</td></tr>`).join("")}
      </table></div>`}),html+="</div>",typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__borucaPanel").remove(),showToast("\u{1F4D6} Glosario Boruca insertado \u2705")}function openQRReader(){const old=document.getElementById("__qrPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__qrPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4F7} Lector de QR</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Escane\xE1 un c\xF3digo QR con la c\xE1mara o sub\xED una imagen</div>

    <div style="position:relative;background:#000;border-radius:12px;overflow:hidden;margin-bottom:14px;aspect-ratio:1">
      <video id="__qrVideo" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover;display:none"></video>
      <canvas id="__qrCanvas" style="display:none"></canvas>
      <div id="__qrPlaceholder" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff">
        <div style="font-size:48px;margin-bottom:12px">\u{1F4F7}</div>
        <div style="font-size:13px;text-align:center;opacity:.7">Toc\xE1 "Iniciar c\xE1mara"<br>o sub\xED una imagen</div>
        <!-- Marco de escaneo -->
        <div style="position:absolute;width:60%;height:60%;border:3px solid rgba(255,255,255,.5);border-radius:8px;pointer-events:none">
          <div style="position:absolute;top:-2px;left:-2px;width:20px;height:20px;border-top:3px solid #0084ff;border-left:3px solid #0084ff;border-radius:4px 0 0 0"></div>
          <div style="position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-top:3px solid #0084ff;border-right:3px solid #0084ff;border-radius:0 4px 0 0"></div>
          <div style="position:absolute;bottom:-2px;left:-2px;width:20px;height:20px;border-bottom:3px solid #0084ff;border-left:3px solid #0084ff;border-radius:0 0 0 4px"></div>
          <div style="position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;border-bottom:3px solid #0084ff;border-right:3px solid #0084ff;border-radius:0 0 4px 0"></div>
          <div id="__qrScanLine" style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#0084ff,transparent);animation:__qrScan 2s linear infinite"></div>
        </div>
      </div>
      <div id="__qrResult" style="display:none;position:absolute;inset:0;background:rgba(0,200,100,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:16px;text-align:center"></div>
    </div>

    <style>@keyframes __qrScan{0%{top:0}100%{top:calc(100% - 2px)}}</style>

    <div id="__qrResultText" style="display:none;background:#f0fff4;border:1.5px solid #27ae60;border-radius:10px;padding:12px;margin-bottom:12px;font-size:13px;word-break:break-all"></div>

    <div style="display:flex;gap:6px;margin-bottom:12px">
      <button id="__qrCameraBtn" onclick="__qrStartCamera()" style="flex:1;padding:10px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4F7} C\xE1mara</button>
      <button onclick="document.getElementById('__qrFileInput').click()" style="flex:1;padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">\u{1F5BC}\uFE0F Imagen</button>
    </div>
    <input type="file" id="__qrFileInput" accept="image/*" style="display:none" onchange="__qrReadFile(this.files[0])">

    <div style="display:flex;gap:8px">
      <button onclick="__qrStop();document.getElementById('__qrPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button id="__qrInsertBtn" onclick="__qrInsert()" disabled style="flex:2;padding:10px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">\u{1F4E5} Insertar contenido</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&(__qrStop(),ov.remove())}),window.__qrDetected=null}async function __qrStartCamera(){const video=document.getElementById("__qrVideo"),ph=document.getElementById("__qrPlaceholder"),btn=document.getElementById("__qrCameraBtn");if(video)try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});window.__qrStream=stream,video.srcObject=stream,video.style.display="block",ph&&(ph.style.display="none"),btn&&(btn.textContent="\u23F9 Detener",btn.onclick=__qrStop,btn.style.background="#e74c3c"),__qrScanLoop()}catch(e){showToast("No se pudo acceder a la c\xE1mara: "+e.message)}}function __qrStop(){window.__qrStream&&(window.__qrStream.getTracks().forEach(t=>t.stop()),window.__qrStream=null),window.__qrAnimFrame&&(cancelAnimationFrame(window.__qrAnimFrame),window.__qrAnimFrame=null);const video=document.getElementById("__qrVideo");video&&(video.style.display="none")}function __qrScanLoop(){const video=document.getElementById("__qrVideo"),canvas=document.getElementById("__qrCanvas");if(!video||!canvas||!video.videoWidth){window.__qrAnimFrame=requestAnimationFrame(__qrScanLoop);return}canvas.width=video.videoWidth,canvas.height=video.videoHeight;const ctx=canvas.getContext("2d");ctx.drawImage(video,0,0);try{const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);if(typeof jsQR<"u"){const code=jsQR(imageData.data,canvas.width,canvas.height);if(code?.data){__qrFound(code.data);return}}else if(!window.__qrLibLoading){window.__qrLibLoading=!0;const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js",document.head.appendChild(s)}}catch{}window.__qrAnimFrame=requestAnimationFrame(__qrScanLoop)}function __qrReadFile(file){if(!file)return;const reader=new FileReader;reader.onload=e=>{const img=new Image;img.onload=()=>{const canvas=document.createElement("canvas");canvas.width=img.width,canvas.height=img.height;const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);if(typeof jsQR<"u"){const code=jsQR(imageData.data,canvas.width,canvas.height);code?.data?__qrFound(code.data):showToast("No se detect\xF3 c\xF3digo QR en la imagen")}else{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js",s.onload=()=>{const code=jsQR(imageData.data,canvas.width,canvas.height);code?.data?__qrFound(code.data):showToast("No se detect\xF3 c\xF3digo QR")},document.head.appendChild(s)}},img.src=e.target.result},reader.readAsDataURL(file)}function __qrFound(data){__qrStop(),window.__qrDetected=data;const resText=document.getElementById("__qrResultText"),insBtn=document.getElementById("__qrInsertBtn");if(resText){resText.style.display="block";const isUrl=/^https?:\/\//.test(data);resText.innerHTML=`
      <div style="font-size:10px;font-weight:700;color:#27ae60;margin-bottom:6px">\u2705 QR detectado</div>
      <div style="font-size:13px;color:#1a1a1a;word-break:break-all;margin-bottom:8px">${data}</div>
      ${isUrl?`<a href="${data}" target="_blank" style="color:#0084ff;font-size:11px;text-decoration:none">\u{1F517} Abrir enlace</a>`:""}
      <button onclick="navigator.clipboard.writeText('${data.replace(/'/g,"\\'")}').then(()=>showToast('Copiado \u2705'))" style="margin-left:${isUrl?"10px":"0"};padding:4px 10px;border:1px solid #27ae60;background:#fff;color:#27ae60;border-radius:5px;cursor:pointer;font-size:11px">\u{1F4CB} Copiar</button>`}insBtn&&(insBtn.disabled=!1,insBtn.style.background="#27ae60",insBtn.style.cursor="pointer"),showToast("\u2705 QR escaneado: "+data.slice(0,40))}function __qrInsert(){const data=window.__qrDetected;if(!data)return;const html=/^https?:\/\//.test(data)?`<a href="${data}" style="color:#0084ff;text-decoration:underline">${data}</a>`:`<span style="background:#f0fff4;border:1px solid #27ae60;border-radius:4px;padding:2px 8px;font-size:10pt">${data}</span>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__qrPanel").remove(),showToast("\u{1F4E5} Contenido QR insertado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"autoTranslate":openAutoTranslatePanel();break;case"googleDrive":openGDrivePanel();break;case"collaborate":openCollabPanel();break;case"borucaThiel":openBorucaThiel();break;case"qrReader":openQRReader();break;default:orig(a)}}),console.log("WC Corporate Editor v25.26 \u2705 \u2014 AutoTraducci\xF3n, Google Drive, Colaboraci\xF3n, Boruca Thiel, QR")},3400)})();const WC_DIGISIGN={keyPair:null,publicKeyPem:localStorage.getItem("wc-dsign-pubkey")||"",async generateKeys(){const pair=await window.crypto.subtle.generateKey({name:"RSA-PSS",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["sign","verify"]);this.keyPair=pair;const pubRaw=await window.crypto.subtle.exportKey("spki",pair.publicKey),privRaw=await window.crypto.subtle.exportKey("pkcs8",pair.privateKey),pubPem=this._toPem(pubRaw,"PUBLIC KEY"),privPem=this._toPem(privRaw,"PRIVATE KEY");return this.publicKeyPem=pubPem,localStorage.setItem("wc-dsign-pubkey",pubPem),{pubPem,privPem}},async sign(text){if(!this.keyPair)throw new Error("Gener\xE1 un par de claves primero");const data=new TextEncoder().encode(text),sig=await window.crypto.subtle.sign({name:"RSA-PSS",saltLength:32},this.keyPair.privateKey,data);return btoa(String.fromCharCode(...new Uint8Array(sig)))},async verify(text,sigB64,pubKeyPem){const pubKey=await this._importPubKey(pubKeyPem||this.publicKeyPem),data=new TextEncoder().encode(text),sigBuf=Uint8Array.from(atob(sigB64),c=>c.charCodeAt(0));return window.crypto.subtle.verify({name:"RSA-PSS",saltLength:32},pubKey,sigBuf,data)},_toPem(buf,label){const lines=btoa(String.fromCharCode(...new Uint8Array(buf))).match(/.{1,64}/g).join(`
`);return`-----BEGIN ${label}-----
${lines}
-----END ${label}-----`},async _importPubKey(pem){const b64=pem.replace(/-----[^-]+-----/g,"").replace(/\s/g,""),buf=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));return window.crypto.subtle.importKey("spki",buf,{name:"RSA-PSS",hash:"SHA-256"},!1,["verify"])}};function openDigitalSignPanel(){const old=document.getElementById("__dsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__dsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const hasKey=!!WC_DIGISIGN.publicKeyPem;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F510} Firma digital CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">RSA-PSS 2048-bit \xB7 SHA-256 \xB7 Compatible con est\xE1ndares CR</div>

    <div style="display:flex;gap:6px;margin-bottom:14px">
      ${["\u{1F511} Claves","\u270D\uFE0F Firmar","\u2705 Verificar"].map((t,i)=>`
        <button onclick="__dsTab(${i},this)" class="__dsTabBtn"
          style="flex:1;padding:8px;border:2px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:10px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':""}>
          ${t}
        </button>`).join("")}
    </div>

    <!-- Tab Claves -->
    <div id="__dsSection_0">
      ${hasKey?`
        <div style="background:#d4edda;border-radius:10px;padding:12px;margin-bottom:12px;font-size:12px;color:#155724">
          \u2705 Par de claves generado y guardado
        </div>`:`
        <div style="background:#fff9e6;border-radius:10px;padding:12px;margin-bottom:12px;font-size:12px;color:#856404;line-height:1.6">
          \u2139\uFE0F Gener\xE1 un par de claves RSA-2048. La <strong>clave privada</strong> solo se muestra una vez \u2014 guardala en un lugar seguro. La <strong>clave p\xFAblica</strong> se guarda en el navegador para verificar firmas.
        </div>`}
      <button onclick="__dsGenerateKeys()" style="width:100%;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;margin-bottom:10px">
        ${hasKey?"\u{1F504} Regenerar par de claves":"\u{1F511} Generar par de claves RSA-2048"}
      </button>
      <div id="__dsKeyResult" style="display:none"></div>
    </div>

    <!-- Tab Firmar -->
    <div id="__dsSection_1" style="display:none">
      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Texto / contenido a firmar</label>
        <textarea id="__dsSignText" rows="4" placeholder="El texto del documento o hash a firmar..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <button onclick="__dsFillFromDoc()" style="flex:1;padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">\u{1F4C4} Usar doc actual</button>
        <button onclick="__dsSignText()" style="flex:2;padding:8px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F510} Firmar</button>
      </div>
      <div id="__dsSignResult" style="display:none;background:#f0f7ff;border-radius:8px;padding:10px;font-size:11px">
        <div style="font-weight:700;color:#003da5;margin-bottom:4px">Firma digital generada:</div>
        <div id="__dsSigValue" style="font-family:'Courier New',monospace;word-break:break-all;color:#555;max-height:80px;overflow-y:auto"></div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button onclick="navigator.clipboard.writeText(document.getElementById('__dsSigValue').textContent).then(()=>showToast('Copiado \u2705'))" style="padding:5px 10px;border:1px solid #eee;background:#fff;border-radius:5px;cursor:pointer;font-size:11px">\u{1F4CB} Copiar</button>
          <button onclick="__dsInsertSignature()" style="padding:5px 12px;border:none;background:#27ae60;color:#fff;border-radius:5px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4E5} Insertar bloque</button>
        </div>
      </div>
    </div>

    <!-- Tab Verificar -->
    <div id="__dsSection_2" style="display:none">
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Texto original</label>
          <textarea id="__dsVerifyText" rows="3" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Firma (Base64)</label>
          <textarea id="__dsVerifySig" rows="2" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
        </div>
      </div>
      <button onclick="__dsVerify()" style="width:100%;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:10px">\u2705 Verificar firma</button>
      <div id="__dsVerifyResult" style="display:none"></div>
    </div>

    <div style="margin-top:12px">
      <button onclick="document.getElementById('__dsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __dsTab(idx,btn){[0,1,2].forEach(i=>{const s=document.getElementById("__dsSection_"+i),b=document.querySelectorAll(".__dsTabBtn")[i];s&&(s.style.display=i===idx?"block":"none"),b&&(b.style.borderColor=i===idx?"#003da5":"#eee",b.style.background=i===idx?"#f0f7ff":"#fafafa",b.style.color=i===idx?"#003da5":"#555")})}async function __dsGenerateKeys(){const res=document.getElementById("__dsKeyResult");res&&(res.style.display="block",res.innerHTML='<div style="color:#0084ff;font-size:12px">\u23F3 Generando claves RSA-2048...</div>');try{const{pubPem,privPem}=await WC_DIGISIGN.generateKeys();res&&(res.innerHTML=`
      <div style="background:#d4edda;border-radius:8px;padding:10px;margin-bottom:8px;font-size:11px;color:#155724;font-weight:700">\u2705 Par de claves generado</div>
      <div style="margin-bottom:8px">
        <div style="font-size:10px;font-weight:700;color:#e74c3c;margin-bottom:3px">\u{1F512} CLAVE PRIVADA \u2014 guard\xE1 esto en lugar seguro, no se volver\xE1 a mostrar:</div>
        <textarea readonly rows="4" style="width:100%;padding:6px;border:1px solid #e74c3c;border-radius:6px;font-size:9px;font-family:'Courier New',monospace;background:#fdf2f2;box-sizing:border-box">${privPem}</textarea>
        <button onclick="navigator.clipboard.writeText('${privPem.replace(/'/g,"\\'")}').then(()=>showToast('Clave privada copiada \u2705'))" style="padding:4px 10px;border:none;background:#e74c3c;color:#fff;border-radius:5px;cursor:pointer;font-size:11px;margin-top:4px">\u{1F4CB} Copiar clave privada</button>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#27ae60;margin-bottom:3px">\u{1F513} Clave p\xFAblica (guardada en navegador):</div>
        <textarea readonly rows="3" style="width:100%;padding:6px;border:1px solid #27ae60;border-radius:6px;font-size:9px;font-family:'Courier New',monospace;background:#f0fff4;box-sizing:border-box">${pubPem}</textarea>
      </div>`),showToast("\u{1F511} Claves RSA-2048 generadas \u2705")}catch(e){res&&(res.innerHTML='<div style="color:#e74c3c;font-size:12px">Error: '+e.message+"</div>")}}function __dsFillFromDoc(){const ed=document.getElementById("editor"),ta=document.getElementById("__dsSignText");ed&&ta&&(ta.value=ed.innerText.slice(0,500).trim())}async function __dsSignText(){const text=document.getElementById("__dsSignText")?.value.trim();if(!text){showToast("Ingres\xE1 texto para firmar");return}if(!WC_DIGISIGN.keyPair){showToast("Gener\xE1 un par de claves primero");return}try{const sig=await WC_DIGISIGN.sign(text);window.__dsCurrentSig=sig,window.__dsCurrentText=text;const res=document.getElementById("__dsSignResult"),val=document.getElementById("__dsSigValue");res&&(res.style.display="block"),val&&(val.textContent=sig),showToast("\u{1F510} Documento firmado \u2705")}catch(e){showToast("Error al firmar: "+e.message)}}async function __dsVerify(){const text=document.getElementById("__dsVerifyText")?.value.trim(),sig=document.getElementById("__dsVerifySig")?.value.trim(),res=document.getElementById("__dsVerifyResult");if(!text||!sig){showToast("Complet\xE1 texto y firma");return}if(!WC_DIGISIGN.publicKeyPem){showToast("No hay clave p\xFAblica guardada");return}try{const valid=await WC_DIGISIGN.verify(text,sig);res&&(res.style.display="block",res.innerHTML=valid?'<div style="background:#d4edda;border-radius:8px;padding:12px;text-align:center;font-size:14px;font-weight:700;color:#155724">\u2705 Firma v\xE1lida \u2014 Documento aut\xE9ntico</div>':'<div style="background:#fde8e8;border-radius:8px;padding:12px;text-align:center;font-size:14px;font-weight:700;color:#721c24">\u274C Firma inv\xE1lida \u2014 Documento alterado</div>')}catch(e){showToast("Error verificando: "+e.message)}}function __dsInsertSignature(){const sig=window.__dsCurrentSig,text=window.__dsCurrentText;if(!sig)return;const ts=new Date().toLocaleString("es-CR"),hash=btoa(text||"").slice(0,20)+"...",html=`
  <div style="border:2px solid #003da5;border-radius:10px;padding:14px;margin:12px 0;font-family:Calibri,Arial,sans-serif;background:#f8f9ff">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="font-size:24px">\u{1F510}</div>
      <div>
        <div style="font-size:13pt;font-weight:700;color:#003da5">FIRMA DIGITAL RSA-PSS</div>
        <div style="font-size:9pt;color:#888">Algoritmo: RSA-PSS 2048-bit \xB7 Hash: SHA-256 \xB7 ${ts}</div>
      </div>
    </div>
    <div style="font-size:9pt;color:#555;margin-bottom:6px">Hash del documento: <code style="background:#f0f0f0;padding:1px 6px;border-radius:3px">${hash}</code></div>
    <div style="font-size:8pt;font-family:'Courier New',monospace;word-break:break-all;background:#fff;border:1px solid #eee;border-radius:6px;padding:8px;max-height:60px;overflow:hidden;color:#555">${sig.slice(0,120)}...</div>
    <div style="font-size:9pt;color:#27ae60;margin-top:8px;font-weight:600">\u2705 Documento firmado digitalmente \xB7 WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__dsPanel").remove(),showToast("\u{1F510} Bloque de firma insertado \u2705")}function openReceiptGenerator(){const old=document.getElementById("__rcbPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__rcbPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const num=String(parseInt(localStorage.getItem("wc-rcb-num")||"0")+1).padStart(4,"0");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F9FE} Generador de recibos CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Recibo N\xB0 ${num} \xB7 Costa Rica</div>

    <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
      ${[["simple","Recibo simple"],["alquiler","Alquiler"],["honorarios","Honorarios"],["salario","Pago de salario"],["deposito","Dep\xF3sito garant\xEDa"]].map(([id,name],i)=>`
        <button onclick="__rcbType('${id}',this)" class="__rcbTypeBtn"
          style="padding:5px 12px;border:2px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
          ${i===0?'data-sel="1"':""}>
          ${name}
        </button>`).join("")}
    </div>

    <div id="__rcbFields" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px"></div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__rcbPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__rcbGenerate()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F9FE} Generar recibo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__rcbNum=num,window.__rcbType_val="simple",__rcbType("simple",document.querySelector(".__rcbTypeBtn"))}function __rcbType(type,btn){window.__rcbType_val=type,document.querySelectorAll(".__rcbTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn&&(btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.style.color="#003da5",btn.dataset.sel="1");const fieldSets={simple:[["quien","Recib\xED de (nombre/empresa) *","Juan P\xE9rez Rodr\xEDguez"],["cedula","C\xE9dula","1-2345-6789"],["monto","Monto (\u20A1 o $) *","50000"],["moneda","Moneda","\u20A1 Colones"],["concepto","En concepto de *","Pago por servicios"],["forma","Forma de pago","SINPE M\xF3vil / Efectivo"]],alquiler:[["inquilino","Nombre del inquilino *","Mar\xEDa Garc\xEDa"],["propietario","Propietario *","Carlos L\xF3pez"],["inmueble","Direcci\xF3n del inmueble *","Barrio Los Yoses, San Jos\xE9"],["mes","Mes de pago *","Enero 2025"],["monto","Monto mensual (\u20A1) *","350000"],["deposito","Incluye dep\xF3sito","No"]],honorarios:[["profesional","Nombre del profesional *","Arq. Laura Sol\xEDs"],["cedula","C\xE9dula profesional","1-3456-7890"],["cliente","Nombre del cliente *","Constructora ABC S.A."],["servicio","Servicio prestado *","Dise\xF1o arquitect\xF3nico fase 1"],["monto","Honorarios (\u20A1) *","750000"],["periodo","Per\xEDodo","Enero 2025"]],salario:[["empresa","Empresa empleadora *","Empresa XYZ S.A."],["empleado","Nombre del empleado *","Pedro Mora Castro"],["cedula","C\xE9dula empleado","2-3456-7890"],["cargo","Cargo","Analista de sistemas"],["periodo","Per\xEDodo de pago *","Quincena del 1 al 15 de enero 2025"],["bruto","Salario bruto (\u20A1) *","600000"],["deducciones","Deducciones CCSS (\u20A1)","72000"]],deposito:[["depositante","Nombre del depositante *","Ana Vargas"],["propietario","Nombre del propietario *","Roberto Salas"],["inmueble","Inmueble *","Apartamento #3, Heredia"],["monto","Monto del dep\xF3sito (\u20A1) *","350000"],["equivale","Equivale a","Un mes de alquiler"],["condicion","Condici\xF3n de devoluci\xF3n","Al finalizar el contrato sin da\xF1os"]]},fields=fieldSets[type]||fieldSets.simple,box=document.getElementById("__rcbFields");box&&(box.innerHTML=fields.map(([id,label,ph])=>`
    <div>
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
      <input type="text" id="__rcb_${id}" placeholder="${ph}"
        style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
    </div>`).join(""))}function __rcbG(id){return document.getElementById("__rcb_"+id)?.value?.trim()||""}function __rcbGenerate(){const type=window.__rcbType_val||"simple",num=window.__rcbNum,date=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"}),fmt=n=>{const v=parseFloat(n.toString().replace(/[^\d.]/g,""));return isNaN(v)?n:"\u20A1"+v.toLocaleString("es-CR")};localStorage.setItem("wc-rcb-num",String(parseInt(num)));let body="";if(type==="simple"){const monto=fmt(__rcbG("monto"));body=`<p>Recib\xED de <strong>${__rcbG("quien")}</strong>${__rcbG("cedula")?`, c\xE9dula <strong>${__rcbG("cedula")}</strong>`:""}, la suma de <strong>${monto}</strong> (${__rcbG("moneda")||"colones costarricenses"}) en concepto de: <em>${__rcbG("concepto")}</em>.</p>${__rcbG("forma")?`<p><strong>Forma de pago:</strong> ${__rcbG("forma")}</p>`:""}`}else if(type==="alquiler")body=`<p>Recib\xED de <strong>${__rcbG("inquilino")}</strong> la suma de <strong>${fmt(__rcbG("monto"))}</strong> por concepto de <strong>alquiler correspondiente al mes de ${__rcbG("mes")}</strong> del inmueble ubicado en: <em>${__rcbG("inmueble")}</em>.${__rcbG("deposito")&&__rcbG("deposito")!=="No"?` Incluye dep\xF3sito de garant\xEDa: ${__rcbG("deposito")}.`:""}</p>`;else if(type==="honorarios")body=`<p>Recib\xED de <strong>${__rcbG("cliente")}</strong> la suma de <strong>${fmt(__rcbG("monto"))}</strong> por concepto de honorarios profesionales correspondientes a: <em>${__rcbG("servicio")}</em>${__rcbG("periodo")?`, per\xEDodo ${__rcbG("periodo")}`:""}.${__rcbG("cedula")?`<br>C\xE9dula profesional: ${__rcbG("cedula")}`:""}</p>`;else if(type==="salario"){const bruto=parseFloat(__rcbG("bruto").replace(/[^\d.]/g,""))||0,ded=parseFloat(__rcbG("deducciones").replace(/[^\d.]/g,""))||0,neto=bruto-ded;body=`<p>La empresa <strong>${__rcbG("empresa")}</strong> cancela al colaborador <strong>${__rcbG("empleado")}</strong>${__rcbG("cedula")?`, c\xE9dula ${__rcbG("cedula")}`:""}, que desempe\xF1a el cargo de <strong>${__rcbG("cargo")}</strong>, el pago correspondiente al per\xEDodo: <em>${__rcbG("periodo")}</em>.<br>Salario bruto: <strong>${fmt(__rcbG("bruto"))}</strong> \xB7 Deducciones: <strong>${fmt(__rcbG("deducciones"))}</strong> \xB7 <strong>Salario neto: ${fmt(String(neto))}</strong></p>`}else type==="deposito"&&(body=`<p>Recib\xED de <strong>${__rcbG("depositante")}</strong> la suma de <strong>${fmt(__rcbG("monto"))}</strong> (${__rcbG("equivale")||"dep\xF3sito de garant\xEDa"}) por concepto de dep\xF3sito de garant\xEDa del inmueble: <em>${__rcbG("inmueble")}</em>.<br><strong>Condici\xF3n de devoluci\xF3n:</strong> ${__rcbG("condicion")||"Seg\xFAn lo acordado en el contrato de arrendamiento."}</p>`);const html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:2px solid #1a2942;border-radius:10px;max-width:500px;margin:12px auto;overflow:hidden">
    <div style="background:#1a2942;color:#fff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-size:16pt;font-weight:900">RECIBO</div><div style="font-size:9pt;opacity:.7">N\xB0 ${num}</div></div>
      <div style="text-align:right;font-size:9pt;opacity:.85">${date}</div>
    </div>
    <div style="padding:16px 18px;font-size:11pt;line-height:1.8;color:#333">${body}</div>
    <div style="padding:12px 18px;border-top:1px solid #eee;display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:10pt">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:140px">Quien recibe<br><small>Firma / sello</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px;display:inline-block;min-width:140px">Quien paga<br><small>Firma</small></div></div>
    </div>
    <div style="padding:6px 18px;background:#f8f9fa;font-size:8pt;color:#aaa;text-align:center">WC Corporate Editor \xB7 Costa Rica \xB7 ${date}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__rcbPanel").remove(),showToast(`\u{1F9FE} Recibo N\xB0 ${num} generado \u2705`)}const WC_SNIPPETS={list:JSON.parse(localStorage.getItem("wc-snippets")||"[]"),defaults:[{id:"s0",name:"Encabezado carta formal",shortcut:"carta",html:'<p style="text-align:right">[Ciudad], [fecha]</p><p><strong>[Destinatario]</strong><br>[Cargo]<br>[Instituci\xF3n]</p><p><strong>Estimado se\xF1or/se\xF1ora:</strong></p>'},{id:"s1",name:"Cierre carta formal",shortcut:"cierre",html:'<p>Sin otro particular, me despido atentamente,</p><div style="margin-top:40px"><strong>_____________________</strong><br>[Nombre completo]<br>[Cargo] \xB7 [Tel\xE9fono]</div>'},{id:"s2",name:"Cita APA gen\xE9rica",shortcut:"apa",html:'<sup style="color:#0084ff">[Apellido, A\xF1o, p. X]</sup>'},{id:"s3",name:"Tabla 3x3 b\xE1sica",shortcut:"tabla3",html:'<table style="border-collapse:collapse;width:100%"><tr><th style="padding:8px;border:1px solid #ddd;background:#003da5;color:#fff">Col 1</th><th style="padding:8px;border:1px solid #ddd;background:#003da5;color:#fff">Col 2</th><th style="padding:8px;border:1px solid #ddd;background:#003da5;color:#fff">Col 3</th></tr><tr><td style="padding:7px;border:1px solid #ddd">A</td><td style="padding:7px;border:1px solid #ddd">B</td><td style="padding:7px;border:1px solid #ddd">C</td></tr><tr><td style="padding:7px;border:1px solid #ddd;background:#f0f7ff">D</td><td style="padding:7px;border:1px solid #ddd;background:#f0f7ff">E</td><td style="padding:7px;border:1px solid #ddd;background:#f0f7ff">F</td></tr></table>'},{id:"s4",name:"Nota al pie CR",shortcut:"nota",html:'<hr style="border:none;border-top:1px solid #ddd;margin:20px 0 4px"><p style="font-size:9pt;color:#666">\xB9 [Nota al pie de p\xE1gina]</p>'},{id:"s5",name:"Separador elegante",shortcut:"sep",html:'<div style="text-align:center;margin:20px 0;color:#003da5;font-size:18px;letter-spacing:10px">\u2014 \u2726 \u2014</div>'},{id:"s6",name:"Firma con datos",shortcut:"firma",html:'<div style="margin-top:30px"><strong>_____________________</strong><br><small>[Nombre] \xB7 C\xE9dula [X-XXXX-XXXX]<br>[Correo] \xB7 Tel: [XXXX-XXXX]<br>San Jos\xE9, Costa Rica</small></div>'},{id:"s7",name:"Advertencia/nota",shortcut:"aviso",html:'<div style="background:#fff9e6;border-left:4px solid #f39c12;border-radius:0 8px 8px 0;padding:10px 14px;margin:10px 0;font-size:11pt">\u26A0\uFE0F <strong>Nota importante:</strong> [Texto de la advertencia]</div>'}],save(){localStorage.setItem("wc-snippets",JSON.stringify(this.list))},all(){return[...this.defaults,...this.list]},add(name,shortcut,html){this.list.push({id:"u"+Date.now(),name,shortcut,html}),this.save()},delete(id){this.list=this.list.filter(s=>s.id!==id),this.save()}};function openSnippetsPanel(){const old=document.getElementById("__snipPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__snipPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center",ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:86vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div><div style="font-size:17px;font-weight:700;color:#1a2942">\u{1F4CC} Snippets reutilizables</div><div style="font-size:11px;color:#888">Fragmentos de texto para insertar r\xE1pido</div></div>
        <button onclick="__snipAddNew()" style="padding:7px 14px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">+ Nuevo</button>
      </div>
      <input type="text" id="__snipSearch" placeholder="Buscar snippet..."
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:10px"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__snipFilter(this.value)">
    </div>
    <div id="__snipList" style="flex:1;overflow-y:auto;padding:0 18px 20px"></div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),__snipRender(WC_SNIPPETS.all())}function __snipRender(snippets){const list=document.getElementById("__snipList");list&&(list.innerHTML=snippets.map(s=>`
    <div style="border:1.5px solid #eee;border-radius:12px;padding:12px;margin-bottom:8px;transition:all .15s"
      onmouseover="this.style.borderColor='#003da5'" onmouseout="this.style.borderColor='#eee'">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="flex:1"><div style="font-size:13px;font-weight:700;color:#1a1a1a">${s.name}</div><div style="font-size:10px;color:#aaa">Atajo: <code style="background:#f0f0f0;padding:1px 4px;border-radius:3px">${s.shortcut}</code></div></div>
        <div style="display:flex;gap:4px">
          <button onclick="if(typeof insertHTML==='function')insertHTML('${s.html.replace(/'/g,"\\'").replace(/\n/g,"")}');document.getElementById('__snipPanel').remove();showToast('\u{1F4CC} Snippet insertado \u2705')" style="padding:6px 12px;border:none;background:#003da5;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">Insertar</button>
          ${s.id.startsWith("s")?"":`<button onclick="WC_SNIPPETS.delete('${s.id}');openSnippetsPanel()" style="padding:6px;border:none;background:#fde8e8;border-radius:7px;cursor:pointer;font-size:12px;color:#e74c3c">\u{1F5D1}</button>`}
        </div>
      </div>
      <div style="font-size:11px;color:#888;background:#f8f9fa;border-radius:6px;padding:6px 8px;max-height:40px;overflow:hidden">${s.html.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,100)}...</div>
    </div>`).join(""))}function __snipFilter(q){const filtered=WC_SNIPPETS.all().filter(s=>!q.trim()||s.name.toLowerCase().includes(q.toLowerCase())||s.shortcut.toLowerCase().includes(q.toLowerCase()));__snipRender(filtered)}function __snipAddNew(){const name=prompt("Nombre del snippet:","Mi snippet");if(!name)return;const shortcut=prompt("Atajo (texto corto):","mis")||"new",ed=document.getElementById("editor");let html=window.getSelection()?.toString().trim()||"";if(html||(html=prompt("HTML o texto del snippet (o dej\xE1 vac\xEDo para usar selecci\xF3n del editor):","<p>Mi texto</p>")||""),!html){showToast("Sin contenido");return}WC_SNIPPETS.add(name,shortcut,html),__snipRender(WC_SNIPPETS.all()),showToast("\u{1F4CC} Snippet guardado \u2705")}document.addEventListener("keydown",e=>{if(e.key!=="Tab")return;const ed=document.getElementById("editor");if(!ed||document.activeElement!==ed)return;const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const range=sel.getRangeAt(0),node=range.startContainer;if(node.nodeType!==3)return;const words=node.textContent.slice(0,range.startOffset).split(/\s+/),last=words[words.length-1],snip=WC_SNIPPETS.all().find(s=>s.shortcut===last);if(snip){e.preventDefault();const newRange=document.createRange();newRange.setStart(node,range.startOffset-last.length),newRange.setEnd(node,range.startOffset),sel.removeAllRanges(),sel.addRange(newRange),document.execCommand("delete"),typeof insertHTML=="function"&&insertHTML(snip.html),showToast("\u{1F4CC} "+snip.name)}});function openSCIJ(){const old=document.getElementById("__scijPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__scijPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const ejemplos=["despido injustificado","libertad de expresi\xF3n","contrato arrendamiento","responsabilidad civil","acoso laboral","tutela derecho a salud","habeas corpus","recurso amparo","pensi\xF3n alimentaria","derecho propiedad"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:2px;display:flex;align-items:center;gap:8px">
        \u2696\uFE0F SCIJ \u2014 Sistema Costarricense de Informaci\xF3n Jur\xEDdica
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Poder Judicial de Costa Rica \xB7 Jurisprudencia y legislaci\xF3n</div>

      <div style="display:flex;gap:6px;margin-bottom:10px">
        <input type="text" id="__scijQuery" placeholder="Buscar jurisprudencia, ley, expediente..."
          style="flex:1;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:10px;font-size:13px;outline:none"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
          onkeydown="if(event.key==='Enter')__scijSearch()">
        <button onclick="__scijSearch()" style="padding:9px 16px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F50D}</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px">
        ${[["sala2","Sala II Laboral"],["sala3","Sala III Penal"],["salaConst","Sala Constitucional"],["tribCont","Tribunal Contencioso"],["tribFam","Tribunal de Familia"],["scij","SCIJ Legislaci\xF3n"]].map(([id,name])=>`
          <button onclick="__scijFilter('${id}',this)" class="__scijFiltBtn"
            style="padding:6px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:10px;font-weight:600;color:#555;transition:all .15s"
            onmouseover="this.style.borderColor='#003da5'" onmouseout="if(!this.dataset.sel)this.style.borderColor='#eee'">
            ${name}
          </button>`).join("")}
      </div>

      <div style="font-size:11px;color:#888;margin-bottom:10px">Ejemplos: ${ejemplos.slice(0,5).map(e=>`<span onclick="document.getElementById('__scijQuery').value='${e}';__scijSearch()" style="color:#003da5;cursor:pointer;text-decoration:underline">${e}</span>`).join(" \xB7 ")}</div>
    </div>

    <div id="__scijResults" style="flex:1;overflow-y:auto;padding:0 20px">
      <div style="text-align:center;padding:30px;color:#bbb">
        <div style="font-size:32px;margin-bottom:10px">\u2696\uFE0F</div>
        <div style="font-size:13px">Busc\xE1 jurisprudencia del Poder Judicial CR</div>
        <div style="font-size:11px;margin-top:6px">Se abrir\xE1 el SCIJ con tu b\xFAsqueda para consultar los resultados reales</div>
      </div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__scijPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__scijFilter_val=""}function __scijFilter(type,btn){window.__scijFilter_val=type,document.querySelectorAll(".__scijFiltBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn&&(btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.style.color="#003da5",btn.dataset.sel="1")}function __scijSearch(){const q=document.getElementById("__scijQuery")?.value.trim();if(!q){showToast("Ingres\xE1 un t\xE9rmino de b\xFAsqueda");return}const filter=window.__scijFilter_val||"",results=document.getElementById("__scijResults"),links=[{name:"\u{1F50D} Buscar en SCIJ (Legislaci\xF3n)",url:"https://www.pgrweb.go.cr/scij/Busqueda/Normativa/normas_busqueda_texto.aspx?param1="+encodeURIComponent(q),desc:"Sistema Costarricense de Informaci\xF3n Jur\xEDdica \xB7 PGR"},{name:"\u2696\uFE0F Buscar en Nexus PJ (Jurisprudencia)",url:"https://nexuspj.poder-judicial.go.cr/search#/search?q="+encodeURIComponent(q),desc:"Poder Judicial \xB7 Sala II, III, Constitucional, etc."},{name:"\u{1F4CB} Sala Constitucional",url:"https://nexuspj.poder-judicial.go.cr/search#/search?q="+encodeURIComponent(q)+"&tipo=sala+constitucional",desc:"Recursos de amparo, h\xE1beas corpus, inconstitucionalidad"},{name:"\u{1F4BC} Sala Segunda (Laboral)",url:"https://nexuspj.poder-judicial.go.cr/search#/search?q="+encodeURIComponent(q)+"&tipo=sala+segunda",desc:"Derecho laboral \xB7 C\xF3digo de Trabajo CR"},{name:"\u{1F3DB}\uFE0F Sala Tercera (Penal)",url:"https://nexuspj.poder-judicial.go.cr/search#/search?q="+encodeURIComponent(q)+"&tipo=sala+tercera",desc:"Derecho penal \xB7 C\xF3digo Procesal Penal CR"},{name:"\u{1F4DA} Biblioteca Jur\xEDdica Virtual",url:"https://www.bvnj.poder-judicial.go.cr/",desc:"Libros, revistas y documentos jur\xEDdicos"},{name:"\u{1F4F0} Gaceta Digital",url:"https://www.imprentanacional.go.cr/gaceta/",desc:"La Gaceta \xB7 Diario Oficial CR"}];results.innerHTML=`
    <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding:0 0 6px;border-bottom:1px solid #eee">
      Resultados de b\xFAsqueda: <span style="color:#003da5">"${q}"</span>
    </div>
    ${links.map(l=>`
      <div style="border:1.5px solid #eee;border-radius:12px;padding:12px;margin-bottom:8px;transition:all .15s"
        onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'"
        onmouseout="this.style.borderColor='#eee';this.style.background=''">
        <div style="display:flex;align-items:flex-start;gap:10px">
          <div style="flex:1">
            <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:2px">${l.name}</div>
            <div style="font-size:11px;color:#888">${l.desc}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0">
            <a href="${l.url}" target="_blank" style="padding:6px 10px;border:none;background:#003da5;color:#fff;border-radius:7px;cursor:pointer;font-size:11px;font-weight:600;text-decoration:none">Abrir \u2192</a>
            <button onclick="__scijInsertRef('${l.name.replace(/'/g,"\\'").replace(/[^\x20-\x7E]/g,"")}','${q}')" style="padding:6px 8px;border:1.5px solid #eee;background:#fff;border-radius:7px;cursor:pointer;font-size:11px">\u{1F4CB}</button>
          </div>
        </div>
      </div>`).join("")}
    <div style="font-size:11px;color:#aaa;text-align:center;padding:8px;line-height:1.6">
      Para acceder a resoluciones espec\xEDficas, abr\xED los enlaces y busc\xE1 en el sitio oficial del Poder Judicial
    </div>`}function __scijInsertRef(source,query){const html=`<p style="font-size:10pt;color:#555">V\xE9ase jurisprudencia sobre <em>"${query}"</em> en: <a href="https://nexuspj.poder-judicial.go.cr" style="color:#003da5">${source}</a>. Poder Judicial de Costa Rica. Consultado: ${new Date().toLocaleDateString("es-CR")}.</p>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__scijPanel").remove(),showToast("\u2696\uFE0F Referencia insertada \u2705")}function openGoogleSheets(){const old=document.getElementById("__sheetsPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__sheetsPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <svg width="20" height="20" viewBox="0 0 48 48"><path d="M29 1H7C5.34 1 4 2.34 4 4v40c0 1.66 1.34 3 3 3h34c1.66 0 3-1.34 3-3V15L29 1z" fill="#0f9d58"/><path d="M29 1l15 14H29z" fill="#87ceac"/><path d="M14 22h20v2H14zm0 4h20v2H14zm0 4h14v2H14z" fill="#fff"/></svg>
      Google Sheets
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Import\xE1 / export\xE1 datos entre el editor y Sheets</div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">

      <div style="border:1.5px solid #eee;border-radius:12px;padding:14px">
        <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:4px">\u{1F4E4} Exportar tabla del editor a Sheets</div>
        <div style="font-size:11px;color:#888;margin-bottom:10px">Seleccion\xE1 una tabla en el editor y se exporta como CSV para Sheets</div>
        <button onclick="__sheetsExportTable()" style="width:100%;padding:9px;border:none;background:#0f9d58;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4E4} Exportar tabla seleccionada</button>
      </div>

      <div style="border:1.5px solid #eee;border-radius:12px;padding:14px">
        <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:4px">\u{1F4E5} Importar CSV de Sheets al editor</div>
        <div style="font-size:11px;color:#888;margin-bottom:8px">Peg\xE1 el CSV copiado de Google Sheets</div>
        <textarea id="__sheetsCsvInput" rows="4" placeholder="Pegar CSV desde Sheets (Ctrl+C en Sheets copia los datos como CSV)..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace"
          onfocus="this.style.borderColor='#0f9d58'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px">
          <select id="__sheetsStyle" style="padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none">
            <option value="green">Verde Sheets</option>
            <option value="blue">Azul CR</option>
            <option value="gray">Gris</option>
            <option value="minimal">Minimal</option>
          </select>
          <button onclick="__sheetsImport()" style="padding:7px;border:none;background:#0f9d58;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Importar como tabla</button>
        </div>
      </div>

      <div style="border:1.5px solid #eee;border-radius:12px;padding:14px">
        <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:4px">\u{1F517} Abrir / crear en Google Sheets</div>
        <div style="font-size:11px;color:#888;margin-bottom:8px">Abr\xED Sheets con el contenido del editor o cre\xE1 una hoja nueva</div>
        <input type="text" id="__sheetsUrl" placeholder="URL de Google Sheets existente (opcional)"
          style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box;margin-bottom:6px"
          onfocus="this.style.borderColor='#0f9d58'" onblur="this.style.borderColor='#e0e0e0'">
        <div style="display:flex;gap:6px">
          <button onclick="window.open('https://sheets.new','_blank');showToast('\u{1F4CA} Sheets abierto')" style="flex:1;padding:7px;border:1.5px solid #0f9d58;background:#fff;color:#0f9d58;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">Hoja nueva</button>
          <button onclick="const u=document.getElementById('__sheetsUrl').value.trim();if(u)window.open(u,'_blank');else{__sheetsOpenWithData()}" style="flex:1;padding:7px;border:none;background:#0f9d58;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">Abrir Sheets</button>
        </div>
      </div>
    </div>

    <button onclick="document.getElementById('__sheetsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __sheetsExportTable(){const ed=document.getElementById("editor"),tables=ed?ed.querySelectorAll("table"):[];if(!tables.length){showToast("No hay tablas en el editor");return}const table=tables[tables.length-1],csv=Array.from(table.querySelectorAll("tr")).map(row=>Array.from(row.querySelectorAll("td,th")).map(c=>'"'+c.innerText.replace(/"/g,'""')+'"').join(",")).join(`
`);navigator.clipboard.writeText(csv).then(()=>{showToast("\u{1F4E4} CSV copiado \u2014 peg\xE1 en Google Sheets \u2705"),window.open("https://sheets.new","_blank"),document.getElementById("__sheetsPanel").remove()})}function __sheetsImport(){const csv=document.getElementById("__sheetsCsvInput")?.value.trim(),style=document.getElementById("__sheetsStyle")?.value||"green";if(!csv){showToast("Peg\xE1 datos CSV primero");return}const styles={green:{header:"background:#0f9d58;color:#fff",odd:"background:#e8f5e9",border:"#a5d6a7"},blue:{header:"background:#003da5;color:#fff",odd:"background:#f0f7ff",border:"#c0d8f0"},gray:{header:"background:#555;color:#fff",odd:"background:#f5f5f5",border:"#ddd"},minimal:{header:"background:#f8f8f8;color:#333;border-bottom:2px solid #333",odd:"",border:"#eee"}},s=styles[style]||styles.green,rows=csv.split(`
`).filter(l=>l.trim()).map(l=>{const cells=[];let cur="",inQ=!1;for(const c of l)c==='"'?inQ=!inQ:c===","&&!inQ?(cells.push(cur.trim()),cur=""):cur+=c;return cells.push(cur.trim()),cells});let html='<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:10pt;margin:10px 0">';rows.forEach((row,i)=>{html+=`<tr${i%2&&i>0?` style="${s.odd}"`:""}>`,row.forEach(cell=>{i===0?html+=`<th style="padding:7px 10px;border:1px solid ${s.border};${s.header};text-align:left">${cell}</th>`:html+=`<td style="padding:6px 10px;border:1px solid ${s.border}">${cell}</td>`}),html+="</tr>"}),html+="</table>",typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__sheetsPanel").remove(),showToast(`\u{1F4CA} Tabla de ${rows.length} filas importada \u2705`)}function __sheetsOpenWithData(){const ed=document.getElementById("editor");if((ed?ed.querySelectorAll("table"):[]).length){__sheetsExportTable();return}window.open("https://sheets.new","_blank"),showToast("\u{1F4CA} Creando nueva hoja en Sheets"),document.getElementById("__sheetsPanel").remove()}const WC_TELEPROMPTER={active:!1,speed:2,timer:null,pos:0,open(){const ed=document.getElementById("editor");if(!ed)return;const text=ed.innerText.trim();if(!text||text.split(/\s+/).length<20){showToast("El documento necesita m\xE1s contenido");return}this.active=!0,this.pos=0,this._render(text)},_render(text){const old=document.getElementById("__tpOverlay");old&&old.remove();const ov=document.createElement("div");ov.id="__tpOverlay",ov.style.cssText='position:fixed;inset:0;z-index:9800;background:#000;display:flex;flex-direction:column;font-family:-apple-system,"Segoe UI",Calibri,sans-serif;overflow:hidden',ov.innerHTML=`
      <!-- Barra de control superior (se oculta) -->
      <div id="__tpBar" style="position:fixed;top:0;left:0;right:0;z-index:9801;background:rgba(0,0,0,.9);padding:10px 16px;display:flex;align-items:center;gap:12px;transition:opacity .3s;opacity:0">
        <button onclick="WC_TELEPROMPTER.close()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:12px">\u2715 Salir</button>
        <div style="flex:1;text-align:center;font-size:12px;color:#555">Teleprompter \u2014 ESC para salir</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;color:#555">Vel:</span>
          <input type="range" id="__tpSpeed" min="1" max="10" value="${this.speed}" style="width:80px;accent-color:#e74c3c"
            oninput="WC_TELEPROMPTER.setSpeed(parseInt(this.value))">
          <span id="__tpSpeedVal" style="font-size:12px;color:#e74c3c;min-width:16px">${this.speed}</span>
        </div>
        <div style="display:flex;gap:6px">
          ${["Normal","Espejo","Invertido"].map((m,i)=>`<button onclick="__tpSetMode(${i})" class="__tpModeBtn" style="padding:4px 8px;border:1.5px solid ${i===0?"#e74c3c":"#333"};background:${i===0?"rgba(231,76,60,.2)":"transparent"};color:${i===0?"#e74c3c":"#555"};border-radius:5px;cursor:pointer;font-size:10px">${m}</button>`).join("")}
        </div>
      </div>

      <!-- M\xE1scara superior -->
      <div style="position:fixed;top:0;left:0;right:0;height:35%;background:linear-gradient(to bottom,#000 40%,transparent);pointer-events:none;z-index:9800"></div>

      <!-- Indicador de posici\xF3n central -->
      <div style="position:fixed;top:50%;left:0;right:0;height:3px;background:rgba(231,76,60,.4);z-index:9802;pointer-events:none;transform:translateY(-50%)"></div>

      <!-- Texto con scroll -->
      <div id="__tpContent" style="flex:1;overflow:hidden;position:relative">
        <div id="__tpText" style="padding:50vh 10vw;font-size:clamp(24px,4vw,52px);line-height:1.6;color:#fff;text-align:center;will-change:transform;transform:translateY(0)">
          ${text.split(`
`).filter(l=>l.trim()).map(l=>`<div style="margin-bottom:1em">${l}</div>`).join("")}
        </div>
      </div>

      <!-- M\xE1scara inferior -->
      <div style="position:fixed;bottom:0;left:0;right:0;height:35%;background:linear-gradient(to top,#000 40%,transparent);pointer-events:none;z-index:9800"></div>

      <!-- Barra inferior de controles -->
      <div id="__tpBottomBar" style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9803;display:flex;gap:10px;transition:opacity .3s;opacity:0">
        <button id="__tpPlayBtn" onclick="WC_TELEPROMPTER.togglePlay()" style="padding:12px 24px;border:none;background:#e74c3c;color:#fff;border-radius:12px;cursor:pointer;font-size:15px;font-weight:700;min-width:100px">\u25B6 Play</button>
        <button onclick="WC_TELEPROMPTER.reset()" style="padding:12px 16px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#aaa;border-radius:12px;cursor:pointer;font-size:15px">\u21BA</button>
      </div>
    `,document.body.appendChild(ov),this.pos=0;let hideTimer;ov.addEventListener("mousemove",()=>{["__tpBar","__tpBottomBar"].forEach(id=>{const el=document.getElementById(id);el&&(el.style.opacity="1")}),clearTimeout(hideTimer),hideTimer=setTimeout(()=>{["__tpBar","__tpBottomBar"].forEach(id=>{const el=document.getElementById(id);el&&(el.style.opacity="0")})},3e3)}),ov.addEventListener("touchstart",()=>{["__tpBar","__tpBottomBar"].forEach(id=>{const el=document.getElementById(id);el&&(el.style.opacity="1")})},{passive:!0}),document.getElementById("__tpContent")?.addEventListener("click",()=>this.togglePlay()),this._keyHandler=e=>{e.key==="Escape"&&this.close(),e.key===" "&&(e.preventDefault(),this.togglePlay()),e.key==="ArrowUp"&&(this.pos=Math.max(0,this.pos-50)),e.key==="ArrowDown"&&(this.pos+=50)},document.addEventListener("keydown",this._keyHandler),ov.requestFullscreen&&ov.requestFullscreen().catch(()=>{})},togglePlay(){if(this.timer){clearInterval(this.timer),this.timer=null;const btn=document.getElementById("__tpPlayBtn");btn&&(btn.textContent="\u25B6 Play")}else{this.timer=setInterval(()=>{this.pos+=this.speed*.5;const el=document.getElementById("__tpText");if(el){el.style.transform=`translateY(-${this.pos}px)`;const max=el.offsetHeight-window.innerHeight*.5;this.pos>=max&&(this.togglePlay(),showToast("\u{1F4D6} Fin del texto"))}},50);const btn=document.getElementById("__tpPlayBtn");btn&&(btn.textContent="\u23F8 Pausa")}},setSpeed(s){this.speed=s;const el=document.getElementById("__tpSpeedVal");el&&(el.textContent=s)},reset(){this.pos=0;const el=document.getElementById("__tpText");el&&(el.style.transform="translateY(0)"),this.timer&&(clearInterval(this.timer),this.timer=null);const btn=document.getElementById("__tpPlayBtn");btn&&(btn.textContent="\u25B6 Play")},close(){this.timer&&clearInterval(this.timer),this.timer=null,this.active=!1,document.removeEventListener("keydown",this._keyHandler),document.fullscreenElement&&document.exitFullscreen().catch(()=>{});const ov=document.getElementById("__tpOverlay");ov&&ov.remove(),showToast("Teleprompter cerrado")}};function __tpSetMode(idx){document.querySelectorAll(".__tpModeBtn").forEach((b,i)=>{b.style.borderColor=i===idx?"#e74c3c":"#333",b.style.background=i===idx?"rgba(231,76,60,.2)":"transparent",b.style.color=i===idx?"#e74c3c":"#555"});const el=document.getElementById("__tpText");el&&(idx===1?(el.style.transform="translateY(0) scaleX(-1)",el.style.direction="ltr"):idx===2?el.style.filter="invert(1)":(el.style.transform="translateY(0)",el.style.filter="none"))}function openTeleprompter(){WC_TELEPROMPTER.open()}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"digitalSign":openDigitalSignPanel();break;case"receiptGen":openReceiptGenerator();break;case"snippets":openSnippetsPanel();break;case"scij":openSCIJ();break;case"googleSheets":openGoogleSheets();break;case"teleprompter":openTeleprompter();break;default:orig(a)}}),console.log("WC Corporate Editor v25.27 \u2705 \u2014 Firma Digital, Recibos, Snippets, SCIJ, Sheets, Teleprompter")},3500)})();function openLoanCalculator(){const old=document.getElementById("__loanPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__loanPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const banks=[{name:"BCR",tasaCol:13.5,tasaUSD:8.5,color:"#003da5"},{name:"BNCR",tasaCol:14,tasaUSD:9,color:"#27ae60"},{name:"BAC",tasaCol:15.5,tasaUSD:9.5,color:"#e74c3c"},{name:"Davivienda",tasaCol:15,tasaUSD:9.25,color:"#ce1126"},{name:"Scotiabank",tasaCol:14.5,tasaUSD:8.75,color:"#f39c12"},{name:"Coopealianza",tasaCol:12.5,tasaUSD:8,color:"#9b59b6"},{name:"Personalizada",tasaCol:0,tasaUSD:0,color:"#555"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#003da5,#0084ff);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700">\u{1F3E6} Calculadora de pr\xE9stamos CR</div>
      <div style="font-size:11px;opacity:.8;margin-top:2px">BCR \xB7 BNCR \xB7 BAC \xB7 Davivienda \xB7 Scotiabank \xB7 Coopealianza</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Banco / Entidad financiera</label>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${banks.map((b,i)=>`
            <button onclick="__loanSelectBank(${i},this)" class="__loanBankBtn"
              style="padding:5px 10px;border:2px solid ${i===0?b.color:"#eee"};background:${i===0?b.color+"15":"#fafafa"};color:${i===0?b.color:"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
              ${i===0?'data-sel="1"':""}>
              ${b.name}
            </button>`).join("")}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Monto del pr\xE9stamo *</label>
          <input type="number" id="__loanMonto" placeholder="5000000" min="100000" step="100000"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
            oninput="__loanCalc()">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Moneda</label>
          <select id="__loanMoneda" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none" onchange="__loanCalc()">
            <option value="CRC">\u20A1 Colones</option>
            <option value="USD">$ D\xF3lares</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Plazo (a\xF1os) *</label>
          <input type="number" id="__loanPlazo" placeholder="10" min="1" max="30" value="10"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
            oninput="__loanCalc()">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tasa anual (%)</label>
          <input type="number" id="__loanTasa" placeholder="13.5" min="1" max="50" step="0.1"
            style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
            oninput="__loanCalc()">
        </div>
        <div style="grid-column:1/-1">
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de pr\xE9stamo</label>
          <div style="display:flex;gap:6px">
            ${[["hipotecario","\u{1F3E0} Hipotecario"],["vehiculo","\u{1F697} Veh\xEDculo"],["personal","\u{1F4BC} Personal"],["pyme","\u{1F3ED} PYME"]].map(([v,l],i)=>`
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:6px 10px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:8px;font-size:11px;font-weight:600;color:${i===0?"#003da5":"#555"}">
                <input type="radio" name="__loanTipo" value="${v}" ${i===0?"checked":""} style="accent-color:#003da5" onchange="__loanCalc()"> ${l}
              </label>`).join("")}
          </div>
        </div>
      </div>

      <div id="__loanResult" style="display:none"></div>
      <div id="__loanAmortTable" style="display:none;margin-top:12px;max-height:200px;overflow-y:auto"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__loanPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__loanCalc(true)" style="flex:1;padding:10px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CA} Tabla amort.</button>
      <button onclick="__loanInsert()" style="flex:1;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__loanBanks=banks,window.__loanBankIdx=0,document.getElementById("__loanTasa").value=banks[0].tasaCol}function __loanSelectBank(idx,btn){window.__loanBankIdx=idx;const bank=window.__loanBanks[idx];document.querySelectorAll(".__loanBankBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor=bank.color,btn.style.background=bank.color+"15",btn.style.color=bank.color,btn.dataset.sel="1";const tasa=document.getElementById("__loanMoneda")?.value==="USD"?bank.tasaUSD:bank.tasaCol;tasa>0&&(document.getElementById("__loanTasa").value=tasa),__loanCalc()}function __loanCalc(showAmort=!1){const monto=parseFloat(document.getElementById("__loanMonto")?.value)||0,plazo=parseInt(document.getElementById("__loanPlazo")?.value)||10,tasa=parseFloat(document.getElementById("__loanTasa")?.value)||13.5,moneda=document.getElementById("__loanMoneda")?.value||"CRC",tipo=document.querySelector('[name="__loanTipo"]:checked')?.value||"hipotecario",res=document.getElementById("__loanResult");if(!monto||!res)return;const r=tasa/100/12,n=plazo*12,cuota=r===0?monto/n:monto*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),total=cuota*n,intereses=total-monto,sym=moneda==="USD"?"$":"\u20A1",fmt=v=>sym+(moneda==="USD"?v.toFixed(2):Math.round(v).toLocaleString("es-CR")),bank=(window.__loanBanks||[])[window.__loanBankIdx||0];window.__loanData={monto,plazo,tasa,moneda,cuota,total,intereses,tipo,bank:bank?.name||"",r,n,sym,fmt},res.style.display="block",res.innerHTML=`
    <div style="background:#f0f7ff;border-radius:12px;padding:14px;margin-bottom:10px">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center;margin-bottom:12px">
        <div><div style="font-size:18px;font-weight:900;color:#003da5">${fmt(cuota)}</div><div style="font-size:10px;color:#888">Cuota mensual</div></div>
        <div><div style="font-size:18px;font-weight:900;color:#e74c3c">${fmt(intereses)}</div><div style="font-size:10px;color:#888">Total intereses</div></div>
        <div><div style="font-size:18px;font-weight:900;color:#1a2942">${fmt(total)}</div><div style="font-size:10px;color:#888">Total a pagar</div></div>
      </div>
      <div style="height:8px;background:#eee;border-radius:4px;overflow:hidden;margin-bottom:4px">
        <div style="height:100%;background:linear-gradient(90deg,#003da5 ${Math.round(monto/total*100)}%,#e74c3c 0%);border-radius:4px"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:#888">
        <span>Capital: ${Math.round(monto/total*100)}%</span>
        <span>Intereses: ${Math.round(intereses/total*100)}%</span>
      </div>
    </div>
    <div style="font-size:11px;color:#888;text-align:center">${bank?.name||""} \xB7 ${tipo} \xB7 ${tasa}% anual \xB7 ${plazo} a\xF1os \xB7 ${n} cuotas</div>`,showAmort&&__loanShowAmort()}function __loanShowAmort(){const d=window.__loanData;if(!d)return;const box=document.getElementById("__loanAmortTable");if(!box)return;box.style.display="block";let saldo=d.monto,rows="";for(let i=1;i<=Math.min(d.n,24);i++){const intMes=saldo*d.r,capMes=d.cuota-intMes;saldo=Math.max(0,saldo-capMes),rows+=`<tr style="${i%2?"background:#f0f7ff":""}"><td style="padding:4px 8px;border:1px solid #ddd;font-size:10px">${i}</td><td style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${d.fmt(d.cuota)}</td><td style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${d.fmt(capMes)}</td><td style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${d.fmt(intMes)}</td><td style="padding:4px 8px;border:1px solid #ddd;font-size:10px;text-align:right">${d.fmt(saldo)}</td></tr>`}box.innerHTML=`<div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Tabla de amortizaci\xF3n (primeras 24 cuotas)</div>
    <table style="border-collapse:collapse;width:100%;font-size:10px">
      <tr style="background:#003da5;color:#fff"><th style="padding:5px 8px;border:1px solid #002080">Cuota</th><th style="padding:5px 8px;border:1px solid #002080">Pago</th><th style="padding:5px 8px;border:1px solid #002080">Capital</th><th style="padding:5px 8px;border:1px solid #002080">Inter\xE9s</th><th style="padding:5px 8px;border:1px solid #002080">Saldo</th></tr>
      ${rows}
    </table>`}function __loanInsert(){const d=window.__loanData;if(!d){showToast("Calcul\xE1 primero un pr\xE9stamo");return}const html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:2px solid #003da5;border-radius:10px;overflow:hidden;max-width:500px;margin:12px auto">
    <div style="background:#003da5;color:#fff;padding:10px 16px;font-weight:700;font-size:13pt">\u{1F3E6} Simulaci\xF3n de pr\xE9stamo \u2014 ${d.bank}</div>
    <div style="padding:14px 16px">
      <table style="border-collapse:collapse;width:100%;font-size:11pt">
        ${[["Monto solicitado",d.fmt(d.monto)],["Plazo",d.plazo+" a\xF1os ("+d.n+" cuotas)"],["Tasa anual",d.tasa+"%"],["Cuota mensual",d.fmt(d.cuota)],["Total intereses",d.fmt(d.intereses)],["Total a pagar",d.fmt(d.total)]].map(([l,v],i)=>`<tr style="${i%2?"background:#f0f7ff":""}"><td style="padding:7px 10px;border:1px solid #ddd">${l}</td><td style="padding:7px 10px;border:1px solid #ddd;font-weight:600;text-align:right">${v}</td></tr>`).join("")}
      </table>
      <p style="font-size:9pt;color:#aaa;margin-top:8px">Simulaci\xF3n referencial \u2014 consult\xE1 condiciones actuales con el banco \xB7 WC Corporate Editor</p>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__loanPanel").remove(),showToast("\u{1F3E6} Simulaci\xF3n de pr\xE9stamo insertada \u2705")}function openD101Generator(){const old=document.getElementById("__d101Panel");old&&old.remove();const ov=document.createElement("div");ov.id="__d101Panel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700">\u{1F3DB}\uFE0F Declaraci\xF3n D-101 \u2014 Renta CR</div>
      <div style="font-size:11px;opacity:.8;margin-top:2px">Ministerio de Hacienda \xB7 Impuesto sobre la Renta \xB7 Formulario D-101</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="background:#fff9e6;border:1.5px solid #f39c12;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#856404;line-height:1.6">
        \u26A0\uFE0F <strong>Aviso:</strong> Este generador crea un borrador de referencia del D-101. Para la declaraci\xF3n oficial us\xE1 <a href="https://www.hacienda.go.cr" target="_blank" style="color:#003da5">ATV de Hacienda</a>. Consult\xE1 con un contador certificado.
      </div>

      <div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #003da5">SECCI\xD3N I \u2014 DATOS DEL DECLARANTE</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${[["__d101Nombre","Nombre / Raz\xF3n social *","Juan P\xE9rez S.A."],["__d101Cedula","C\xE9dula / C\xE9dula Jur\xEDdica *","3-101-123456"],["__d101Periodo","Per\xEDodo fiscal *","2024"],["__d101Actividad","Actividad econ\xF3mica","Servicios profesionales"],["__d101Email","Correo ATV","contribuyente@email.cr"],["__d101Contador","Nombre del contador","Lic. Mar\xEDa Garc\xEDa CPA"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__d101Calc()">
          </div>`).join("")}
      </div>

      <div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #003da5">SECCI\xD3N II \u2014 INGRESOS BRUTOS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${[["__d101IngVentas","Ventas / ingresos por servicios","0"],["__d101IngOtros","Otros ingresos gravables","0"],["__d101IngExentos","Ingresos exentos","0"],["__d101IngExtranj","Ingresos del exterior","0"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label} (\u20A1)</label>
            <input type="number" id="${id}" placeholder="${ph}" min="0" step="1000" value="0" style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__d101Calc()">
          </div>`).join("")}
      </div>

      <div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #003da5">SECCI\xD3N III \u2014 COSTOS Y GASTOS DEDUCIBLES</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${[["__d101GastSalarios","Sueldos y salarios","0"],["__d101GastAlquiler","Alquileres","0"],["__d101GastServicios","Servicios profesionales","0"],["__d101GastPublic","Publicidad","0"],["__d101GastDepreciac","Depreciaci\xF3n","0"],["__d101GastOtros","Otros gastos deducibles","0"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label} (\u20A1)</label>
            <input type="number" id="${id}" placeholder="${ph}" min="0" step="1000" value="0" style="width:100%;padding:7px 10px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'" oninput="__d101Calc()">
          </div>`).join("")}
      </div>

      <div id="__d101Result" style="display:none"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__d101Panel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__d101Calc()" style="flex:1;padding:10px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F9EE} Calcular</button>
      <button onclick="__d101Insert()" style="flex:1;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4CB} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __d101G(id){return parseFloat(document.getElementById(id)?.value)||0}function __d101GStr(id){return document.getElementById(id)?.value?.trim()||""}function __d101Calc(){const ingVentas=__d101G("__d101IngVentas"),ingOtros=__d101G("__d101IngOtros"),ingExentos=__d101G("__d101IngExentos"),ingExtranj=__d101G("__d101IngExtranj"),totalIng=ingVentas+ingOtros+ingExentos+ingExtranj,ingGravable=ingVentas+ingOtros+ingExtranj,gastSal=__d101G("__d101GastSalarios"),gastAlq=__d101G("__d101GastAlquiler"),gastSrv=__d101G("__d101GastServicios"),gastPub=__d101G("__d101GastPublic"),gastDep=__d101G("__d101GastDepreciac"),gastOtr=__d101G("__d101GastOtros"),totalGast=gastSal+gastAlq+gastSrv+gastPub+gastDep+gastOtr,utilidad=Math.max(0,ingGravable-totalGast);let impuesto=0;utilidad<=5616e3?impuesto=0:utilidad<=8424e3?impuesto=(utilidad-5616e3)*.1:utilidad<=11232e3?impuesto=2808e3*.1+(utilidad-8424e3)*.15:utilidad<=16848e3?impuesto=2808e3*.1+2808e3*.15+(utilidad-11232e3)*.2:impuesto=2808e3*.1+2808e3*.15+5616e3*.2+(utilidad-16848e3)*.25,window.__d101Data={ingGravable,ingExentos,totalIng,totalGast,utilidad,impuesto};const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),res=document.getElementById("__d101Result");res&&(res.style.display="block",res.innerHTML=`
    <div style="background:#f0f7ff;border-radius:12px;padding:14px">
      <div style="font-size:13px;font-weight:700;color:#003da5;margin-bottom:10px">\u{1F4CA} Resumen D-101</div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:12px">
        ${[["Ingresos gravables",ingGravable,"#1a2942"],["Ingresos exentos",ingExentos,"#27ae60"],["Total ingresos",totalIng,"#1a2942"],["Total costos y gastos",totalGast,"#e74c3c"],["Utilidad imponible",utilidad,"#003da5","font-weight:700"],["Impuesto sobre la renta",impuesto,"#ce1126","font-weight:700;font-size:14px"]].map(([l,v,c,extra=""])=>`
          <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #e0eef8">
            <span style="color:#555">${l}</span>
            <strong style="color:${c};${extra}">${fmt(v)}</strong>
          </div>`).join("")}
      </div>
      <div style="margin-top:10px;font-size:10px;color:#888;line-height:1.6">
        Tarifas ISR 2024: 0% hasta \u20A15.6M \xB7 10% hasta \u20A18.4M \xB7 15% hasta \u20A111.2M \xB7 20% hasta \u20A116.8M \xB7 25% resto
      </div>
    </div>`)}function __d101Insert(){window.__d101Data||__d101Calc();const d=window.__d101Data,nombre=__d101GStr("__d101Nombre"),cedula=__d101GStr("__d101Cedula"),periodo=__d101GStr("__d101Periodo")||new Date().getFullYear(),fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:2px solid #003da5;border-radius:10px;overflow:hidden;max-width:580px;margin:12px auto">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:12px 16px">
      <div style="font-weight:700;font-size:14pt">DECLARACI\xD3N D-101 \u2014 IMPUESTO SOBRE LA RENTA</div>
      <div style="font-size:9pt;opacity:.85">Ministerio de Hacienda \xB7 Rep\xFAblica de Costa Rica \xB7 Per\xEDodo ${periodo}</div>
    </div>
    <div style="padding:14px 16px">
      <p style="font-size:10pt;color:#555;margin-bottom:10px"><strong>Contribuyente:</strong> ${nombre} \xB7 C\xE9dula: ${cedula}</p>
      <table style="border-collapse:collapse;width:100%;font-size:10pt">
        <tr style="background:#f0f7ff"><th colspan="2" style="padding:6px 10px;border:1px solid #ddd;text-align:left;color:#003da5">RESUMEN DE LA DECLARACI\xD3N</th></tr>
        ${[["Ingresos gravables",d.ingGravable],["Ingresos exentos",d.ingExentos],["Total costos y gastos deducibles",d.totalGast],["Utilidad neta imponible",d.utilidad],["IMPUESTO DETERMINADO",d.impuesto]].map(([l,v],i)=>`<tr style="${i%2?"background:#fafafa":""};${i===4?"font-weight:700;background:#fde8e8":""}}"><td style="padding:6px 10px;border:1px solid #ddd">${l}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:${i===4?"700":"normal"};color:${i===4?"#ce1126":"#333"}">${fmt(v)}</td></tr>`).join("")}
      </table>
      <p style="font-size:8pt;color:#aaa;margin-top:8px">Borrador de referencia \u2014 use ATV Hacienda para la declaraci\xF3n oficial \xB7 WC Corporate Editor</p>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__d101Panel").remove(),showToast("\u{1F3DB}\uFE0F D-101 borrador insertado \u2705")}function openSICOPTemplates(){const old=document.getElementById("__sicopTplPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__sicopTplPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const templates=[{icon:"\u{1F4C4}",name:"Oferta t\xE9cnica completa",desc:"Experiencia, equipo, metodolog\xEDa, cronograma"},{icon:"\u{1F4B0}",name:"Oferta econ\xF3mica detallada",desc:"Desglose por l\xEDnea, IVA, condiciones"},{icon:"\u{1F3E2}",name:"Personer\xEDa jur\xEDdica",desc:"Documentaci\xF3n de la empresa para SICOP"},{icon:"\u{1F4CB}",name:"Especificaciones t\xE9cnicas",desc:"Cartel de licitaci\xF3n: objeto, requisitos, criterios"},{icon:"\u2705",name:"Lista de verificaci\xF3n SICOP",desc:"Checklist completo de documentos requeridos"},{icon:"\u{1F4DD}",name:"Recurso de objeci\xF3n al cartel",desc:"Art\xEDculo 81 Ley 7494 \u2014 fundamento legal"}];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3DB}\uFE0F Plantillas SICOP completas</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Sistema Integrado de Compras P\xFAblicas \xB7 Ley 7494</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 20px 16px;display:flex;flex-direction:column;gap:8px">
      ${templates.map((t,i)=>`
        <button onclick="__sicopTplGenerate(${i})"
          style="padding:14px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">${t.icon}</span>
            <div><div style="font-size:13px;font-weight:700;color:#1a1a1a">${t.name}</div><div style="font-size:11px;color:#888">${t.desc}</div></div>
            <div style="margin-left:auto;color:#ccc">\u203A</div>
          </div>
        </button>`).join("")}
    </div>
    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__sicopTplPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __sicopTplGenerate(idx){const empresa=prompt("Nombre de tu empresa:","Mi Empresa S.A.")||"Mi Empresa S.A.",licit=prompt("N\xB0 de licitaci\xF3n:","LP-000001-0001")||"LP-000001-0001",objeto=prompt("Objeto de la licitaci\xF3n:","")||"[Objeto del concurso]",html=[()=>`<div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <h2 style="text-align:center;color:#003da5">OFERTA T\xC9CNICA</h2>
      <p style="text-align:center;font-size:10pt;color:#888">${empresa} \xB7 Licitaci\xF3n ${licit}</p>
      <h3 style="color:#003da5;margin-top:20px">1. EXPERIENCIA DE LA EMPRESA</h3>
      <p>La empresa <strong>${empresa}</strong> cuenta con __ a\xF1os de experiencia en el sector, habiendo ejecutado los siguientes proyectos similares:</p>
      <table style="border-collapse:collapse;width:100%;font-size:10pt"><tr style="background:#003da5;color:#fff"><th style="padding:7px">Cliente</th><th style="padding:7px">Proyecto</th><th style="padding:7px">Monto</th><th style="padding:7px">A\xF1o</th></tr><tr><td style="padding:6px;border:1px solid #ddd">[Cliente 1]</td><td style="padding:6px;border:1px solid #ddd">[Descripci\xF3n]</td><td style="padding:6px;border:1px solid #ddd">\u20A1___</td><td style="padding:6px;border:1px solid #ddd">20__</td></tr></table>
      <h3 style="color:#003da5;margin-top:16px">2. EQUIPO DE TRABAJO</h3>
      <table style="border-collapse:collapse;width:100%;font-size:10pt"><tr style="background:#003da5;color:#fff"><th style="padding:7px">Nombre</th><th style="padding:7px">Cargo</th><th style="padding:7px">Experiencia</th></tr><tr><td style="padding:6px;border:1px solid #ddd">[Nombre]</td><td style="padding:6px;border:1px solid #ddd">Director de proyecto</td><td style="padding:6px;border:1px solid #ddd">__ a\xF1os</td></tr></table>
      <h3 style="color:#003da5;margin-top:16px">3. METODOLOG\xCDA</h3>
      <p>La metodolog\xEDa propuesta para la ejecuci\xF3n de <em>${objeto}</em> consiste en:</p>
      <p><strong>Fase 1:</strong> Planificaci\xF3n y an\xE1lisis (semanas 1-2)<br><strong>Fase 2:</strong> Ejecuci\xF3n (semanas 3-8)<br><strong>Fase 3:</strong> Entrega y cierre (semanas 9-10)</p>
      <h3 style="color:#003da5;margin-top:16px">4. CRONOGRAMA</h3>
      <p>Plazo de entrega estimado: <strong>__ d\xEDas h\xE1biles</strong> a partir de la firma del contrato.</p>
    </div>`,()=>`<div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <h2 style="text-align:center;color:#003da5">OFERTA ECON\xD3MICA</h2>
      <p style="text-align:center;font-size:10pt;color:#888">${empresa} \xB7 Licitaci\xF3n ${licit}</p>
      <h3 style="color:#003da5;margin-top:16px">Desglose de precios</h3>
      <table style="border-collapse:collapse;width:100%;font-size:10pt">
        <tr style="background:#003da5;color:#fff"><th style="padding:8px">N\xB0</th><th style="padding:8px;text-align:left">Descripci\xF3n</th><th style="padding:8px">Cant</th><th style="padding:8px">P.Unit</th><th style="padding:8px">Total</th></tr>
        ${[1,2,3].map(i=>`<tr><td style="padding:7px;border:1px solid #ddd;text-align:center">${i}</td><td style="padding:7px;border:1px solid #ddd">[L\xEDnea ${i}]</td><td style="padding:7px;border:1px solid #ddd;text-align:center">1</td><td style="padding:7px;border:1px solid #ddd;text-align:right">\u20A10</td><td style="padding:7px;border:1px solid #ddd;text-align:right">\u20A10</td></tr>`).join("")}
        <tr style="background:#f0f0f0"><td colspan="4" style="padding:7px;border:1px solid #ddd;font-weight:700;text-align:right">SUBTOTAL</td><td style="padding:7px;border:1px solid #ddd;font-weight:700;text-align:right">\u20A10</td></tr>
        <tr><td colspan="4" style="padding:7px;border:1px solid #ddd;text-align:right">IVA 13%</td><td style="padding:7px;border:1px solid #ddd;text-align:right">\u20A10</td></tr>
        <tr style="background:#003da5;color:#fff"><td colspan="4" style="padding:8px;font-weight:700;text-align:right">TOTAL OFERTA</td><td style="padding:8px;font-weight:700;text-align:right">\u20A10</td></tr>
      </table>
      <p style="font-size:10pt;margin-top:12px"><strong>Forma de pago:</strong> Seg\xFAn lo estipulado en el cartel</p>
      <p style="font-size:10pt"><strong>Vigencia de la oferta:</strong> 30 d\xEDas h\xE1biles</p>
    </div>`,()=>`<div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <h2 style="text-align:center;color:#003da5">DECLARACI\xD3N DE PERSONER\xCDA JUR\xCDDICA</h2>
      <p>Para la licitaci\xF3n <strong>${licit}</strong>, la empresa <strong>${empresa}</strong> declara:</p>
      <p><strong>C\xE9dula Jur\xEDdica:</strong> ___________</p>
      <p><strong>Representante Legal:</strong> ___________ \xB7 C\xE9dula: ___________</p>
      <p><strong>Inscripci\xF3n Registro Nacional:</strong> Folio: ___ \xB7 Asiento: ___</p>
      <p><strong>Domicilio social:</strong> ___________</p>
      <p>Declaro bajo fe de juramento que la empresa se encuentra al d\xEDa con: CCSS ( ), Hacienda ( ), FODESAF ( )</p>
      <div style="margin-top:40px;text-align:center"><div style="border-top:1px solid #333;display:inline-block;padding-top:6px;min-width:200px">Representante Legal<br><small>${empresa}</small></div></div>
    </div>`,()=>`<div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <h2 style="text-align:center;color:#003da5">ESPECIFICACIONES T\xC9CNICAS</h2>
      <p style="text-align:center">Cartel de licitaci\xF3n ${licit}</p>
      <h3 style="color:#003da5">1. OBJETO DE LA CONTRATACI\xD3N</h3>
      <p>${objeto}</p>
      <h3 style="color:#003da5">2. REQUISITOS M\xCDNIMOS</h3>
      <p>2.1 El oferente deber\xE1 estar inscrito en el Registro de Proveedores del SICOP<br>2.2 Experiencia m\xEDnima de __ a\xF1os en actividades similares<br>2.3 Personal t\xE9cnico calificado: ___ profesionales con grado m\xEDnimo de ___</p>
      <h3 style="color:#003da5">3. CRITERIOS DE EVALUACI\xD3N</h3>
      <table style="border-collapse:collapse;width:100%;font-size:10pt"><tr style="background:#003da5;color:#fff"><th style="padding:7px">Criterio</th><th style="padding:7px">Puntaje</th></tr><tr><td style="padding:6px;border:1px solid #ddd">Precio</td><td style="padding:6px;border:1px solid #ddd;text-align:center">60 puntos</td></tr><tr style="background:#f0f7ff"><td style="padding:6px;border:1px solid #ddd">Experiencia</td><td style="padding:6px;border:1px solid #ddd;text-align:center">25 puntos</td></tr><tr><td style="padding:6px;border:1px solid #ddd">Plazo de entrega</td><td style="padding:6px;border:1px solid #ddd;text-align:center">15 puntos</td></tr></table>
    </div>`,()=>`<div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <h2 style="color:#003da5">\u2705 Lista de verificaci\xF3n SICOP</h2>
      <p style="font-size:10pt;color:#888">Licitaci\xF3n ${licit} \xB7 ${empresa}</p>
      ${[["DOCUMENTOS OBLIGATORIOS",[["Inscripci\xF3n activa en Registro de Proveedores SICOP"],["Certificaci\xF3n de personer\xEDa jur\xEDdica vigente (< 3 meses)"],["Declaraci\xF3n jurada Art. 65 Ley 7494 (firmada y autenticada)"],["Certificaci\xF3n CCSS al d\xEDa (< 30 d\xEDas)"],["Certificaci\xF3n Tributaria Hacienda al d\xEDa (< 30 d\xEDas)"],["Oferta t\xE9cnica seg\xFAn especificaciones del cartel"],["Oferta econ\xF3mica en formato requerido"],["Garant\xEDa de participaci\xF3n (si aplica)"]]],["DOCUMENTOS ADICIONALES",[["Curr\xEDculos del equipo de trabajo propuesto"],["Cartas de referencia de proyectos similares"],["Contratos de proyectos ejecutados (si se requiere experiencia acreditable)"],["Declaraci\xF3n de no conflicto de intereses"]]]].map(([sec,items])=>`
        <h3 style="color:#003da5;margin-top:14px;font-size:11pt">${sec}</h3>
        ${items.map(([item])=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f0f0f0"><div style="width:16px;height:16px;border:2px solid #003da5;border-radius:3px;flex-shrink:0"></div><div style="font-size:10pt">${item}</div></div>`).join("")}`).join("")}
    </div>`,()=>`<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:16cm;margin:0 auto">
      <p style="text-align:right">San Jos\xE9, ${new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"})}</p>
      <p><strong>Se\xF1ores<br>Proveedur\xEDa Institucional<br>[Nombre de la Instituci\xF3n]</strong></p>
      <p><strong>Asunto: Recurso de Objeci\xF3n al Cartel \xB7 Licitaci\xF3n ${licit}</strong></p>
      <p>Yo, _______________, en mi condici\xF3n de representante legal de <strong>${empresa}</strong>, con base en el art\xEDculo 81 de la Ley de Contrataci\xF3n Administrativa N\xB0 7494 y los art\xEDculos 170 y siguientes del Reglamento a dicha Ley, interpongo <strong>RECURSO DE OBJECI\xD3N</strong> contra el cartel de la licitaci\xF3n referida, por las siguientes razones:</p>
      <p><strong>I. HECHOS:</strong></p>
      <p>1. Con fecha ____________, se public\xF3 en SICOP el cartel de la licitaci\xF3n ${licit}.</p>
      <p>2. El punto _____ del cartel establece _____________, lo cual es contrario a ____________.</p>
      <p><strong>II. FUNDAMENTO JUR\xCDDICO:</strong></p>
      <p>El requisito impugnado viola el principio de igualdad y libre concurrencia establecido en el art\xEDculo 4 de la Ley de Contrataci\xF3n Administrativa, toda vez que ___________.</p>
      <p><strong>III. PETITORIA:</strong></p>
      <p>Se solicita respetuosamente: Acoger el presente recurso y modificar el cartel en los t\xE9rminos indicados.</p>
      <div style="margin-top:40px"><strong>_____________________</strong><br>Representante Legal \xB7 ${empresa}</div>
    </div>`][idx]?.();html&&typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__sicopTplPanel").remove(),showToast("\u{1F3DB}\uFE0F Plantilla SICOP generada \u2705")}function openAcademicStyleChecker(){const old=document.getElementById("__stylePanel");old&&old.remove();const ed=document.getElementById("editor"),text=ed?ed.innerText.trim():"",ov=document.createElement("div");ov.id="__stylePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F393} Corrector de estilo acad\xE9mico</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">APA 7\xAA \xB7 Normas UCR \xB7 Estilo universitario costarricense</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${[["apa","APA 7\xAA ed."],["ucr","Normas UCR"],["ieee","IEEE"],["chicago","Chicago"]].map(([v,l],i)=>`
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:8px;font-size:12px;font-weight:600;color:${i===0?"#003da5":"#555"}">
            <input type="radio" name="__styleNorm" value="${v}" ${i===0?"checked":""} style="accent-color:#003da5"> ${l}
          </label>`).join("")}
      </div>

      <div style="margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Verificar aspectos</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[["__stCitas","Citas y referencias"],["__stTitulos","Formato de t\xEDtulos"],["__stParrafos","Extensi\xF3n de p\xE1rrafos"],["__stVocab","Vocabulario acad\xE9mico"],["__stPersona","Uso de primera persona"],["__stRepeticion","Palabras repetidas"]].map(([id,label])=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:#555">
              <input type="checkbox" id="${id}" checked style="accent-color:#003da5;width:14px;height:14px"> ${label}
            </label>`).join("")}
        </div>
      </div>

      <div id="__styleAnalyzing" style="display:none;background:#f0f7ff;border-radius:8px;padding:10px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
        \u{1F393} Analizando estilo acad\xE9mico...
      </div>
    </div>

    <div id="__styleResults" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__stylePanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runStyleCheck()" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F50D} Analizar documento</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __runStyleCheck(){const ed=document.getElementById("editor"),text=ed?ed.innerText.trim():"",norm=document.querySelector('[name="__styleNorm"]:checked')?.value||"apa",key=localStorage.getItem("wc-groq-key"),anal=document.getElementById("__styleAnalyzing"),res=document.getElementById("__styleResults");if(!text||text.split(/\s+/).length<30){showToast("El documento necesita m\xE1s contenido");return}anal&&(anal.style.display="block");const words=text.split(/\s+/).filter(w=>w),sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>10),avgSentLen=sentences.length?Math.round(words.length/sentences.length):0,paragraphs=text.split(`

`).filter(p=>p.trim().length>20),avgParLen=paragraphs.length?Math.round(words.length/paragraphs.length):0,primeraPersona=(text.match(/\b(yo|nosotros|mi|mis|mío|nuestro|creo|pienso|considero|opino)\b/gi)||[]).length,infCount=["cosa","cosas","muy","mucho","bastante","super","bueno","malo","grande","peque\xF1o","hacer","tener","haber","poner","decir"].filter(w=>new RegExp("\\b"+w+"\\b","gi").test(text)).length,freq={};words.forEach(w=>{const c=w.toLowerCase().replace(/[^a-záéíóúüñ]/gi,"");c.length>5&&(freq[c]=(freq[c]||0)+1)});const topRep=Object.entries(freq).filter(([,v])=>v>3).sort((a,b)=>b[1]-a[1]).slice(0,5),citasAPA=(text.match(/\([A-Za-záéíóúñ]+,\s*\d{4}\)/g)||[]).length,citasNoCor=(text.match(/\([A-Za-záéíóúñ]+\s+\d{4}\)/g)||[]).length,issues=[];avgSentLen>30&&issues.push({level:"warning",msg:`Oraciones muy largas (promedio ${avgSentLen} palabras). Lo ideal es menos de 25 palabras por oraci\xF3n para claridad acad\xE9mica.`}),avgParLen>150&&issues.push({level:"warning",msg:`P\xE1rrafos extensos (promedio ${avgParLen} palabras). Consider\xE1 dividirlos en p\xE1rrafos de 100-150 palabras.`}),primeraPersona>2&&norm==="apa"&&issues.push({level:"error",msg:`Uso de primera persona detectado (${primeraPersona} veces). En APA se prefiere redacci\xF3n impersonal: "Se analiz\xF3..." en vez de "Yo analic\xE9..."`}),infCount>3&&issues.push({level:"warning",msg:`${infCount} palabras informales detectadas (cosa, muy, bueno...). Us\xE1 vocabulario m\xE1s preciso y acad\xE9mico.`}),citasAPA===0&&norm==="apa"&&issues.push({level:"info",msg:"No se detectaron citas en formato APA (Apellido, a\xF1o). Asegur\xE1te de citar todas las fuentes."}),citasNoCor>0&&issues.push({level:"error",msg:`${citasNoCor} citas posiblemente mal formateadas (sin coma). Formato correcto: (Garc\xEDa, 2023)`}),topRep.length&&issues.push({level:"info",msg:`Palabras muy repetidas: ${topRep.map(([w,c])=>`"${w}" (${c}x)`).join(", ")}. Consider\xE1 usar sin\xF3nimos.`});let iaAnalysis="";if(key)try{iaAnalysis=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Sos un corrector de estilo acad\xE9mico universitario costarricense especializado en normas ${norm.toUpperCase()}. Analiz\xE1s textos y das 3-5 sugerencias espec\xEDficas de mejora de estilo, cohesi\xF3n y academicidad. S\xE9 concreto y breve.`},{role:"user",content:`Analiz\xE1 este texto acad\xE9mico y d\xE1 3-5 sugerencias de mejora:

${text.slice(0,1500)}`}],temperature:.3,max_tokens:400})})).json())?.choices?.[0]?.message?.content||""}catch{}anal&&(anal.style.display="none"),res&&(res.style.display="block");const score=Math.max(0,100-issues.filter(i=>i.level==="error").length*20-issues.filter(i=>i.level==="warning").length*10-issues.filter(i=>i.level==="info").length*5),scoreColor=score>=80?"#27ae60":score>=60?"#f39c12":"#e74c3c",levelColors={error:"#fde8e8",warning:"#fff9e6",info:"#f0f7ff"},levelIcons={error:"\u274C",warning:"\u26A0\uFE0F",info:"\u2139\uFE0F"};res.innerHTML=`
    <div style="text-align:center;padding:12px 0;margin-bottom:12px">
      <div style="font-size:42px;font-weight:900;color:${scoreColor}">${score}</div>
      <div style="font-size:13px;font-weight:700;color:${scoreColor}">${score>=80?"Excelente":score>=60?"Bueno":"Necesita mejoras"}</div>
      <div style="font-size:10px;color:#aaa">Puntuaci\xF3n de estilo acad\xE9mico</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      <div style="background:#f8f9fa;border-radius:8px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:700;color:#003da5">${avgSentLen}</div><div style="font-size:9px;color:#aaa">Palabras/oraci\xF3n</div></div>
      <div style="background:#f8f9fa;border-radius:8px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:700;color:#003da5">${citasAPA}</div><div style="font-size:9px;color:#aaa">Citas APA</div></div>
      <div style="background:#f8f9fa;border-radius:8px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:700;color:${primeraPersona?"#e74c3c":"#27ae60"}">${primeraPersona}</div><div style="font-size:9px;color:#aaa">1\xAA persona</div></div>
    </div>
    ${issues.length?issues.map(i=>`<div style="background:${levelColors[i.level]};border-radius:8px;padding:10px;margin-bottom:6px;font-size:12px;line-height:1.6">${levelIcons[i.level]} ${i.msg}</div>`).join(""):'<div style="background:#d4edda;border-radius:8px;padding:10px;color:#155724;font-size:12px">\u2705 Sin problemas de estilo detectados</div>'}
    ${iaAnalysis?`<div style="margin-top:12px"><div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">\u{1F999} Sugerencias IA</div><div style="background:#f0f7ff;border-radius:8px;padding:12px;font-size:12px;line-height:1.7">${iaAnalysis.replace(/\n/g,"<br>")}</div></div>`:""}
    <button onclick="__styleInsertReport(${score})" style="width:100%;margin-top:12px;padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Insertar reporte de estilo</button>`}function __styleInsertReport(score){const html=`<div style="background:#f0f7ff;border:2px solid #003da5;border-radius:8px;padding:12px;margin:10px 0;font-family:Calibri,Arial,sans-serif">
    <div style="font-size:12pt;font-weight:700;color:#003da5;margin-bottom:6px">\u{1F393} Reporte de estilo acad\xE9mico</div>
    <div style="font-size:11pt;color:#555">Puntuaci\xF3n: <strong style="color:${score>=80?"#27ae60":score>=60?"#f39c12":"#e74c3c"}">${score}/100</strong> \xB7 Norma analizada: ${document.querySelector('[name="__styleNorm"]:checked')?.value?.toUpperCase()||"APA"} \xB7 ${new Date().toLocaleString("es-CR")}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__stylePanel").remove(),showToast("\u{1F4CB} Reporte insertado \u2705")}function openScreenplayMode(){const old=document.getElementById("__scrnPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__scrnPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3AC} Modo guion cinematogr\xE1fico</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Formato Hollywood est\xE1ndar \xB7 Courier Prime 12pt</div>

    <div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:16px;font-size:11px;color:#555;line-height:1.8">
      <strong>Elementos de guion:</strong><br>
      \u{1F3AC} <strong>Acotaci\xF3n</strong> \u2014 Descripci\xF3n de escena (INT./EXT.)<br>
      \u{1F4AC} <strong>Di\xE1logo</strong> \u2014 Lo que dice el personaje<br>
      \u{1F464} <strong>Personaje</strong> \u2014 Nombre que habla<br>
      \u{1F4CD} <strong>Transici\xF3n</strong> \u2014 CORTE A:, FUNDIDO A:<br>
      \u2139\uFE0F <strong>Par\xE9ntesis</strong> \u2014 Instrucci\xF3n de actuaci\xF3n
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">T\xEDtulo del guion</label>
        <input type="text" id="__scrnTitle" placeholder="MI GUION" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Autor</label>
        <input type="text" id="__scrnAuthor" placeholder="Por: Tu nombre" style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Insertar elemento</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px">
      ${[["__scrnScene","\u{1F3AC} Acotaci\xF3n","INT. LUGAR - D\xCDA"],["__scrnAction","\u{1F4DD} Acci\xF3n","El personaje hace algo..."],["__scrnChar","\u{1F464} Personaje","JUAN"],["__scrnDialog","\u{1F4AC} Di\xE1logo","Lo que dice el personaje."],["__scrnParen","\u2139\uFE0F Par\xE9ntesis","(con emoci\xF3n)"],["__scrnTrans","\u{1F4CD} Transici\xF3n","CORTE A:"]].map(([id,label,ph])=>`
        <button onclick="__scrnInsertElement('${id}')"
          style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='#1a2942';this.style.background='#f8f9fa'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
          <div style="font-size:12px;font-weight:700;color:#1a1a1a">${label}</div>
          <div style="font-size:10px;color:#aaa">${ph}</div>
        </button>`).join("")}
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__scrnPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__scrnInsertPortada()" style="flex:1;padding:11px;border:1.5px solid #1a2942;background:#fff;color:#1a2942;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F4C4} Portada</button>
      <button onclick="__scrnActivateMode()" style="flex:1;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3AC} Activar modo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __scrnInsertElement(type){const styles={__scrnScene:'font-family:"Courier New",Courier,monospace;font-size:12pt;font-weight:700;text-transform:uppercase;background:#f0f0f0;padding:4px 8px;display:block;margin:16px 0 4px',__scrnAction:'font-family:"Courier New",Courier,monospace;font-size:12pt;display:block;margin:6px 0;padding:0 0 0 0',__scrnChar:'font-family:"Courier New",Courier,monospace;font-size:12pt;font-weight:700;text-transform:uppercase;text-align:center;display:block;margin:12px 0 0;padding-left:40%',__scrnDialog:'font-family:"Courier New",Courier,monospace;font-size:12pt;text-align:left;display:block;margin:0 0 8px;padding:0 20% 0 25%',__scrnParen:'font-family:"Courier New",Courier,monospace;font-size:12pt;font-style:italic;text-align:center;display:block;margin:2px 0;padding:0 35%',__scrnTrans:'font-family:"Courier New",Courier,monospace;font-size:12pt;text-align:right;display:block;margin:12px 0;font-weight:700'},placeholders={__scrnScene:"INT. LUGAR - D\xCDA",__scrnAction:"Descripci\xF3n de la acci\xF3n...",__scrnChar:"NOMBRE DEL PERSONAJE",__scrnDialog:"Lo que dice el personaje.",__scrnParen:"(instrucci\xF3n de actuaci\xF3n)",__scrnTrans:"CORTE A:"},content=prompt(`Contenido para ${type.replace("__scrn","")}:`,placeholders[type]||"");if(!content)return;const html=`<div style="${styles[type]}">${content}</div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__scrnPanel").remove(),showToast("\u{1F3AC} Elemento insertado \u2705")}function __scrnInsertPortada(){const title=document.getElementById("__scrnTitle")?.value.trim()||"MI GUION",author=document.getElementById("__scrnAuthor")?.value.trim()||"Por el autor",html=`
  <div style="font-family:'Courier New',Courier,monospace;font-size:12pt;line-height:2;max-width:16cm;margin:0 auto;min-height:20cm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <br><br><br><br><br>
    <p style="font-size:16pt;font-weight:700;letter-spacing:2px">${title.toUpperCase()}</p>
    <br>
    <p>Escrito por</p>
    <p>${author}</p>
    <br><br><br><br><br><br>
    <p style="font-size:10pt;color:#888">${new Date().toLocaleDateString("es-CR")} \xB7 WC Corporate Editor</p>
  </div><p style="page-break-after:always"></p>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__scrnPanel").remove(),showToast("\u{1F4C4} Portada de guion insertada \u2705")}function __scrnActivateMode(){const ed=document.getElementById("editor");ed&&(ed.style.fontFamily='"Courier New", Courier, monospace',ed.style.fontSize="12pt",ed.style.lineHeight="2",ed.style.maxWidth="16cm",ed.style.background="#fff",showToast("\u{1F3AC} Modo guion activado \u2014 Courier Prime 12pt")),document.getElementById("__scrnPanel").remove();const old=document.getElementById("__scrnToolbar");old&&old.remove();const tb=document.createElement("div");tb.id="__scrnToolbar",tb.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:8500;background:#1a2942;border-radius:10px;padding:6px 12px;display:flex;gap:6px;box-shadow:0 4px 16px rgba(0,0,0,.3)",tb.innerHTML=`
    <span style="color:#aaa;font-size:10px;align-self:center">\u{1F3AC}</span>
    ${[["INT/EXT","__scrnScene"],["Acci\xF3n","__scrnAction"],["Personaje","__scrnChar"],["Di\xE1logo","__scrnDialog"],["(  )","__scrnParen"],["CORTE","__scrnTrans"]].map(([l,t])=>`
      <button onclick="__scrnQuickInsert('${t}')" style="padding:4px 8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;border-radius:5px;cursor:pointer;font-size:10px;font-weight:600">${l}</button>`).join("")}
    <button onclick="document.getElementById('__scrnToolbar').remove();const ed=document.getElementById('editor');if(ed){ed.style.fontFamily='';ed.style.fontSize='';ed.style.lineHeight='';}" style="padding:4px 8px;border:none;background:rgba(231,76,60,.3);color:#e74c3c;border-radius:5px;cursor:pointer;font-size:10px">\u2715</button>`,document.body.appendChild(tb)}function __scrnQuickInsert(type){const placeholders={__scrnScene:"INT. LUGAR - D\xCDA",__scrnAction:"Descripci\xF3n...",__scrnChar:"PERSONAJE",__scrnDialog:"Di\xE1logo.",__scrnParen:"(instrucci\xF3n)",__scrnTrans:"CORTE A:"},styles={__scrnScene:'font-family:"Courier New",monospace;font-size:12pt;font-weight:700;text-transform:uppercase;background:#f0f0f0;padding:4px 8px;display:block;margin:14px 0 4px',__scrnAction:'font-family:"Courier New",monospace;font-size:12pt;display:block;margin:6px 0',__scrnChar:'font-family:"Courier New",monospace;font-size:12pt;font-weight:700;text-transform:uppercase;text-align:center;display:block;margin:12px 0 0;padding-left:40%',__scrnDialog:'font-family:"Courier New",monospace;font-size:12pt;display:block;margin:0 0 8px;padding:0 20% 0 25%',__scrnParen:'font-family:"Courier New",monospace;font-size:12pt;font-style:italic;text-align:center;display:block;padding:0 35%',__scrnTrans:'font-family:"Courier New",monospace;font-size:12pt;text-align:right;display:block;margin:12px 0;font-weight:700'},content=placeholders[type]||"";typeof insertHTML=="function"&&insertHTML(`<div style="${styles[type]}">${content}</div>`)}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"loanCalc":openLoanCalculator();break;case"d101Generator":openD101Generator();break;case"sicopTemplates":openSICOPTemplates();break;case"styleChecker":openAcademicStyleChecker();break;case"screenplay":openScreenplayMode();break;default:orig(a)}}),console.log("WC Corporate Editor v25.28 \u2705 \u2014 Pr\xE9stamos CR, D-101, SICOP, Estilo Acad\xE9mico, Guion")},3600)})();const WC_SPELLCHECK={dict:{haiga:"haya",hubieron:"hubo",habian:"hab\xEDan",dijon:"dijeron",vien:"bien",tamien:"tambi\xE9n",despues:"despu\xE9s",aqui:"aqu\xED",ahi:"ah\xED",asi:"as\xED",mas:"m\xE1s",el:"\xE9l",tu:"t\xFA",mi:"m\xED",si:"s\xED",se:"s\xE9",de:"d\xE9",te:"t\xE9",solo:"s\xF3lo",qye:"que",ques:"que es",porp:"por",pata:"para",eso:"eso",tuanis:"tuanis",upe:"upe",mae:"mae",birra:"birra",analisis:"an\xE1lisis",sintesis:"s\xEDntesis",hipotesis:"hip\xF3tesis",tesis:"tesis",indice:"\xEDndice",articulo:"art\xEDculo",publico:"p\xFAblico",practico:"pr\xE1ctico",teorico:"te\xF3rico",metodo:"m\xE9todo",especifico:"espec\xEDfico",juridico:"jur\xEDdico",tecnico:"t\xE9cnico",economico:"econ\xF3mico",politico:"pol\xEDtico",historico:"hist\xF3rico",geografico:"geogr\xE1fico",matematico:"matem\xE1tico",fisico:"f\xEDsico",quimico:"qu\xEDmico",biologico:"biol\xF3gico",sociologico:"sociol\xF3gico",hacienda:"Hacienda",ccss:"CCSS",bncr:"BNCR",bcr:"BCR",mep:"MEP",mopt:"MOPT",imas:"IMAS",mtss:"MTSS","etc.":"etc.","dr.":"Dr.","ing.":"Ing.","lic.":"Lic.","msc.":"M.Sc."},rules:[{pattern:/\b(\w+)\s+\1\b/gi,msg:"Palabra repetida",type:"error"},{pattern:/[,;]\s*[,;]/g,msg:"Puntuaci\xF3n doble",type:"error"},{pattern:/\s{2,}/g,msg:"Espacios m\xFAltiples",type:"warning"},{pattern:/[.!?]{2,}/g,msg:"Puntuaci\xF3n m\xFAltiple",type:"warning"},{pattern:/\b(y|o|e|u|ni|pero|sino|aunque|porque|como|cuando|donde|que)\s*[,;]/gi,msg:"Coma antes de conjunci\xF3n",type:"info"},{pattern:/^\s*[a-z]/gm,msg:"Oraci\xF3n sin may\xFAscula inicial",type:"warning"}],analyze(text){const issues=[];return text.split(/\s+/).forEach((word,idx)=>{const clean=word.toLowerCase().replace(/[^a-záéíóúüñ]/gi,""),correct=this.dict[clean];if(correct&&correct!==clean){const pos=text.indexOf(word);issues.push({type:"spelling",original:word,suggestion:correct,pos,msg:`"${word}" \u2192 "${correct}"`})}}),this.rules.forEach(rule=>{let m;const re=new RegExp(rule.pattern.source,rule.pattern.flags);for(;(m=re.exec(text))!==null;)issues.push({type:rule.type,original:m[0],suggestion:"",pos:m.index,msg:rule.msg+': "'+m[0].slice(0,30)+'"'})}),issues},fixAll(text,issues){let result=text;return issues.filter(i=>i.suggestion).forEach(i=>{result=result.replace(new RegExp("\\b"+i.original+"\\b","g"),i.suggestion)}),result}};function openSpellChecker(){const old=document.getElementById("__spellPanel");old&&old.remove();const ed=document.getElementById("editor"),text=ed?ed.innerText:"",ov=document.createElement("div");ov.id="__spellPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u270F\uFE0F Corrector ortogr\xE1fico avanzado</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Espa\xF1ol CR \xB7 Reglas gramaticales \xB7 Sugerencias IA</div>
      <div style="display:flex;gap:6px;margin-bottom:12px">
        <button onclick="__spellRun(false)" style="flex:1;padding:9px;border:none;background:#0084ff;color:#fff;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600">\u{1F50D} Analizar</button>
        <button onclick="__spellRun(true)" style="flex:1;padding:9px;border:1.5px solid #0084ff;background:#fff;color:#0084ff;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600">\u{1F999} Analizar con IA</button>
      </div>
      <div id="__spellProgress" style="display:none;text-align:center;color:#0084ff;font-size:13px;padding:8px">\u23F3 Analizando...</div>
    </div>
    <div id="__spellResults" style="flex:1;overflow-y:auto;padding:0 20px 16px"></div>
    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__spellPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button id="__spellFixBtn" onclick="__spellFixAll()" disabled style="flex:2;padding:10px;border:none;background:#ccc;color:#fff;border-radius:10px;cursor:not-allowed;font-size:13px;font-weight:600">\u2705 Corregir todo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __spellRun(useAI){const ed=document.getElementById("editor"),text=ed?ed.innerText:"",prog=document.getElementById("__spellProgress"),res=document.getElementById("__spellResults");prog&&(prog.style.display="block");const issues=WC_SPELLCHECK.analyze(text);let iaIssues=[];if(useAI){const key=localStorage.getItem("wc-groq-key");if(key&&text.length>20)try{iaIssues=((await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:'Sos un corrector ortogr\xE1fico de espa\xF1ol costarricense. Analiz\xE1s texto y list\xE1s los errores ortogr\xE1ficos, gramaticales y de estilo. Para cada error indic\xE1s: el texto incorrecto y la correcci\xF3n sugerida. M\xE1ximo 10 errores. Formato: ERROR: "texto" \u2192 CORRECCI\xD3N: "texto correcto" \u2014 RAZ\xD3N: explicaci\xF3n breve'},{role:"user",content:`Correg\xED este texto:
`+text.slice(0,2e3)}],temperature:.1,max_tokens:600})})).json())?.choices?.[0]?.message?.content||"").split(`
`).filter(l=>l.includes("ERROR:")).map(l=>({type:"ia",msg:l.replace(/ERROR:|CORRECCIÓN:|RAZÓN:/g,"").trim(),original:"",suggestion:""}))}catch{}}prog&&(prog.style.display="none"),window.__spellIssues=issues,window.__spellText=text;const fixBtn=document.getElementById("__spellFixBtn"),fixable=issues.filter(i=>i.suggestion).length;fixable>0&&fixBtn&&(fixBtn.disabled=!1,fixBtn.style.background="#27ae60",fixBtn.style.cursor="pointer",fixBtn.textContent=`\u2705 Corregir ${fixable} errores autom\xE1ticamente`);const levelColors={spelling:"#fde8e8",error:"#fde8e8",warning:"#fff9e6",info:"#f0f7ff",ia:"#f0fff4"},levelIcons={spelling:"\u{1F534}",error:"\u274C",warning:"\u26A0\uFE0F",info:"\u2139\uFE0F",ia:"\u{1F999}"},allIssues=[...issues,...iaIssues];res&&(allIssues.length?res.innerHTML=`<div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;margin-bottom:10px">${allIssues.length} problema${allIssues.length!==1?"s":""} encontrado${allIssues.length!==1?"s":""}</div>`+allIssues.map((iss,i)=>`
          <div style="background:${levelColors[iss.type]||"#f8f8f8"};border-radius:8px;padding:10px;margin-bottom:6px;display:flex;align-items:center;gap:8px">
            <span style="font-size:14px">${levelIcons[iss.type]||"\u2022"}</span>
            <div style="flex:1;font-size:12px;line-height:1.5">${iss.msg}</div>
            ${iss.suggestion?`<button onclick="__spellFixOne(${i})" style="padding:4px 10px;border:none;background:#27ae60;color:#fff;border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;flex-shrink:0">Fix</button>`:""}
          </div>`).join(""):res.innerHTML='<div style="text-align:center;padding:20px;color:#27ae60;font-size:14px;font-weight:700">\u2705 Sin errores detectados</div>')}function __spellFixOne(idx){const iss=(window.__spellIssues||[])[idx],ed=document.getElementById("editor");!iss||!ed||!iss.suggestion||(ed.innerHTML=ed.innerHTML.replace(new RegExp("\\b"+iss.original+"\\b","g"),iss.suggestion),showToast(`\u2705 "${iss.original}" \u2192 "${iss.suggestion}"`))}function __spellFixAll(){const issues=window.__spellIssues||[],ed=document.getElementById("editor");if(!ed)return;let html=ed.innerHTML;issues.filter(i=>i.suggestion).forEach(i=>{html=html.replace(new RegExp("\\b"+i.original+"\\b","g"),i.suggestion)}),ed.innerHTML=html,document.getElementById("__spellPanel").remove(),showToast(`\u2705 ${issues.filter(i=>i.suggestion).length} correcciones aplicadas`)}const WC_GITHUB={token:localStorage.getItem("wc-gh-token")||"",repo:localStorage.getItem("wc-gh-repo")||"",branch:localStorage.getItem("wc-gh-branch")||"main",path:localStorage.getItem("wc-gh-path")||"index.html",sha:localStorage.getItem("wc-gh-sha")||"",isConfigured(){return!!(this.token&&this.repo)},save(){localStorage.setItem("wc-gh-token",this.token),localStorage.setItem("wc-gh-repo",this.repo),localStorage.setItem("wc-gh-branch",this.branch),localStorage.setItem("wc-gh-path",this.path)},async getFileSHA(){const[owner,repoName]=this.repo.split("/"),url=`https://api.github.com/repos/${owner}/${repoName}/contents/${this.path}?ref=${this.branch}`,res=await fetch(url,{headers:{Authorization:"token "+this.token,Accept:"application/vnd.github.v3+json"}});if(res.ok){const data=await res.json();return this.sha=data.sha,localStorage.setItem("wc-gh-sha",this.sha),data.sha}return""},async push(content,message){const[owner,repoName]=this.repo.split("/");await this.getFileSHA();const body={message:message||`WC Editor: auto-save ${new Date().toLocaleString("es-CR")}`,content:btoa(unescape(encodeURIComponent(content))),branch:this.branch};this.sha&&(body.sha=this.sha);const res=await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${this.path}`,{method:"PUT",headers:{Authorization:"token "+this.token,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify(body)}),data=await res.json();return data.content?.sha&&(this.sha=data.content.sha,localStorage.setItem("wc-gh-sha",this.sha)),res.ok?data:null},async pull(){const[owner,repoName]=this.repo.split("/"),res=await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${this.path}?ref=${this.branch}`,{headers:{Authorization:"token "+this.token,Accept:"application/vnd.github.v3+json"}});if(!res.ok)return null;const data=await res.json(),decoded=decodeURIComponent(escape(atob(data.content.replace(/\n/g,""))));return this.sha=data.sha,localStorage.setItem("wc-gh-sha",this.sha),decoded},async listCommits(){const[owner,repoName]=this.repo.split("/"),res=await fetch(`https://api.github.com/repos/${owner}/${repoName}/commits?path=${this.path}&per_page=10`,{headers:{Authorization:"token "+this.token,Accept:"application/vnd.github.v3+json"}});return res.ok?await res.json():[]}};function openGitHubSync(){const old=document.getElementById("__ghPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ghPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const configured=WC_GITHUB.isConfigured();ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a2942"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      GitHub Sync
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Sincroniz\xE1 el editor directamente con tu repo</div>

    ${configured?`
      <div style="background:#d4edda;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#155724">
        \u2705 Conectado a <strong>${WC_GITHUB.repo}</strong> \xB7 rama <strong>${WC_GITHUB.branch}</strong>
      </div>`:`
      <div style="background:#fff9e6;border:1.5px solid #f39c12;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#856404;line-height:1.6">
        \u2139\uFE0F Necesit\xE1s un <strong>Personal Access Token</strong> de GitHub con permiso <code>repo</code>.<br>
        Generalo en: <a href="https://github.com/settings/tokens" target="_blank" style="color:#003da5">github.com/settings/tokens</a>
      </div>`}

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__ghToken","Token de GitHub (ghp_...)","ghp_xxxxxxxxxxxx","password"],["__ghRepo","Repositorio (usuario/repo)","kacn1z-del/wc-editorpro","text"],["__ghBranch","Rama","main","text"],["__ghPath","Archivo a sincronizar","index.html","text"]].map(([id,label,ph,type])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="${type}" id="${id}" placeholder="${ph}" value="${id==="__ghToken"?WC_GITHUB.token:id==="__ghRepo"?WC_GITHUB.repo:id==="__ghBranch"?WC_GITHUB.branch:WC_GITHUB.path}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
      <button onclick="__ghSaveConfig()" style="padding:10px;border:none;background:#1a2942;color:#fff;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600">&#128190; Guardar configuraci&#243;n</button>
      ${configured?'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px"><button onclick="__ghPush()" style="padding:9px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Push</button><button onclick="__ghPull()" style="padding:9px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Pull</button><button onclick="__ghHistory()" style="padding:9px;border:1.5px solid #eee;background:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#555">Historial</button></div><button onclick="__ghAutoPush()" style="padding:9px;border:1.5px solid #eee;background:#fafafa;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Auto-push</button>':""}
    </div>

    <div id="__ghLog" style="display:none;background:#1a2942;border-radius:8px;padding:10px;margin-bottom:12px;font-size:11px;color:#a8d8a8;font-family:'Courier New',monospace;max-height:100px;overflow-y:auto"></div>

    <div id="__ghCommits" style="display:none;margin-bottom:12px"></div>

    <button onclick="document.getElementById('__ghPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __ghSaveConfig(){WC_GITHUB.token=document.getElementById("__ghToken")?.value.trim()||"",WC_GITHUB.repo=document.getElementById("__ghRepo")?.value.trim()||"",WC_GITHUB.branch=document.getElementById("__ghBranch")?.value.trim()||"main",WC_GITHUB.path=document.getElementById("__ghPath")?.value.trim()||"index.html",WC_GITHUB.save(),document.getElementById("__ghPanel").remove(),openGitHubSync(),showToast("\u2699\uFE0F Configuraci\xF3n guardada \u2705")}function __ghLog(msg){const log=document.getElementById("__ghLog");if(!log)return;log.style.display="block";const ts=new Date().toLocaleTimeString("es-CR");log.innerHTML+=`<div>[${ts}] ${msg}</div>`,log.scrollTop=99999}async function __ghPush(){if(!WC_GITHUB.isConfigured()){showToast("Configur\xE1 GitHub primero");return}const msg=prompt("Mensaje del commit:","WC Editor: actualizaci\xF3n "+new Date().toLocaleDateString("es-CR"));if(!msg)return;__ghLog("\u2B06\uFE0F Enviando a GitHub..."),showToast("\u2B06\uFE0F Subiendo a GitHub...");const ed=document.getElementById("editor"),content=ed?ed.innerHTML:"";await WC_GITHUB.push(content,msg)?(__ghLog("\u2705 Push exitoso: "+msg),showToast("\u2B06\uFE0F Push a GitHub exitoso \u2705")):(__ghLog("\u274C Error en push"),showToast("Error al hacer push \u2014 verific\xE1 el token y permisos"))}async function __ghPull(){if(!WC_GITHUB.isConfigured()){showToast("Configur\xE1 GitHub primero");return}__ghLog("\u2B07\uFE0F Obteniendo desde GitHub..."),showToast("\u2B07\uFE0F Bajando desde GitHub...");const content=await WC_GITHUB.pull();if(content){const ed=document.getElementById("editor");if(ed){if(content.includes("<html")){const doc=new DOMParser().parseFromString(content,"text/html"),editorEl=doc.getElementById("editor");editorEl?ed.innerHTML=editorEl.innerHTML:ed.innerHTML=doc.body.innerHTML}else ed.innerHTML=content;typeof updateStats=="function"&&updateStats()}__ghLog("\u2705 Pull exitoso desde "+WC_GITHUB.repo),showToast("\u2B07\uFE0F Pull desde GitHub exitoso \u2705")}else __ghLog("\u274C Error en pull"),showToast("Error al hacer pull")}async function __ghHistory(){const commits=await WC_GITHUB.listCommits(),box=document.getElementById("__ghCommits");if(box){if(box.style.display="block",!commits.length){box.innerHTML='<div style="font-size:12px;color:#aaa">Sin commits</div>';return}box.innerHTML='<div style="font-size:11px;font-weight:700;color:#aaa;margin-bottom:6px">\xDAltimos commits</div>'+commits.map(c=>`
      <div style="padding:6px 8px;border-radius:6px;margin-bottom:4px;background:#f8f9fa;font-size:11px">
        <div style="font-weight:600;color:#1a2942">${c.commit.message.slice(0,60)}</div>
        <div style="color:#aaa">${c.commit.author.name} \xB7 ${new Date(c.commit.author.date).toLocaleDateString("es-CR")}</div>
      </div>`).join("")}}function __ghAutoPush(){WC_GITHUB._autoPush?(clearInterval(WC_GITHUB._autoPush),WC_GITHUB._autoPush=null,showToast("Auto-push desactivado")):(WC_GITHUB._autoPush=setInterval(async()=>{const ed=document.getElementById("editor");ed&&(await WC_GITHUB.push(ed.innerHTML,"Auto-save "+new Date().toLocaleString("es-CR")),showToast("\u2601\uFE0F Auto-guardado en GitHub \u2705"))},300*1e3),showToast("\u23F1\uFE0F Auto-push activado (cada 5 min)")),document.getElementById("__ghPanel").remove(),openGitHubSync()}const WC_PWA={deferredPrompt:null,init(){"serviceWorker"in navigator&&this.registerSW(),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),this.deferredPrompt=e,this._showInstallBanner()}),window.addEventListener("appinstalled",()=>{showToast("\u2705 WC Corporate Editor instalado como app"),this.deferredPrompt=null;const banner=document.getElementById("__pwaBanner");banner&&banner.remove()})},registerSW(){const swCode=`
const CACHE = 'wc-editor-v25';
const ASSETS = ['./', './index.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.url.includes(location.origin)) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => cached || new Response('Offline', {status:503})))
  );
});`,blob=new Blob([swCode],{type:"application/javascript"}),swUrl=URL.createObjectURL(blob);navigator.serviceWorker.register(swUrl).then(reg=>{console.log("SW registrado:",reg.scope)}).catch(e=>console.log("SW error:",e))},injectManifest(){const manifest={name:"WC Corporate Editor",short_name:"WC Editor",description:"Editor corporativo profesional para Costa Rica \u2014 150+ features",start_url:"./",display:"standalone",orientation:"portrait-primary",background_color:"#1a2942",theme_color:"#0084ff",lang:"es-CR",categories:["productivity","business","education"],icons:[{src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%231a2942"/><text y=".9em" font-size="80" x="10">\u{1F4DD}</text></svg>',sizes:"any",type:"image/svg+xml",purpose:"any maskable"}],screenshots:[],shortcuts:[{name:"Nuevo documento",url:"./",description:"Abrir el editor"},{name:"Sib\xF6 IA",url:"./#ai",description:"Asistente IA"}]},blob=new Blob([JSON.stringify(manifest)],{type:"application/manifest+json"}),url=URL.createObjectURL(blob),link=document.createElement("link");return link.rel="manifest",link.href=url,document.head.appendChild(link),[["mobile-web-app-capable","yes"],["apple-mobile-web-app-capable","yes"],["apple-mobile-web-app-status-bar-style","black-translucent"],["apple-mobile-web-app-title","WC Editor"],["theme-color","#0084ff"]].forEach(([name,content])=>{if(!document.querySelector(`meta[name="${name}"]`)){const m=document.createElement("meta");m.name=name,m.content=content,document.head.appendChild(m)}}),!0},async install(){if(!this.deferredPrompt)return showToast("La instalaci\xF3n no est\xE1 disponible en este momento"),!1;this.deferredPrompt.prompt();const result=await this.deferredPrompt.userChoice;return this.deferredPrompt=null,result.outcome==="accepted"},_showInstallBanner(){if(document.getElementById("__pwaBanner"))return;const b=document.createElement("div");b.id="__pwaBanner",b.style.cssText='position:fixed;bottom:140px;left:12px;right:12px;max-width:400px;margin:0 auto;z-index:9000;background:#1a2942;border-radius:14px;padding:14px 16px;box-shadow:0 6px 24px rgba(0,0,0,.3);display:flex;align-items:center;gap:10px;font-family:-apple-system,"Segoe UI",sans-serif',b.innerHTML=`
      <div style="font-size:28px">\u{1F4F1}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700;color:#fff">Instalar WC Editor</div>
        <div style="font-size:11px;color:rgba(255,255,255,.7)">Instal\xE1 como app en tu dispositivo</div>
      </div>
      <button onclick="WC_PWA.install().then(ok=>{if(ok)document.getElementById('__pwaBanner').remove()})" style="padding:7px 14px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">Instalar</button>
      <button onclick="document.getElementById('__pwaBanner').remove()" style="background:none;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:18px;padding:0">\u2715</button>`,document.body.appendChild(b)}};function openPWAPanel(){const old=document.getElementById("__pwaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__pwaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const isInstalled=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px;display:flex;align-items:center;gap:8px">
      \u{1F4F1} WC Editor como app instalable
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Progressive Web App \u2014 funciona offline</div>

    <div style="background:${isInstalled?"#d4edda":"#f0f7ff"};border-radius:12px;padding:14px;margin-bottom:16px;text-align:center">
      <div style="font-size:32px;margin-bottom:8px">${isInstalled?"\u2705":"\u{1F4F1}"}</div>
      <div style="font-size:14px;font-weight:700;color:${isInstalled?"#155724":"#003da5"}">${isInstalled?"App instalada":"Lista para instalar"}</div>
      <div style="font-size:11px;color:#888;margin-top:4px">${isInstalled?"WC Editor est\xE1 instalado en tu dispositivo":"Instal\xE1 para acceso r\xE1pido y modo offline"}</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px">
        <span style="font-size:20px">\u26A1</span>
        <div style="font-size:12px;color:#555"><strong>Modo offline:</strong> Acced\xE9 sin internet gracias al Service Worker</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px">
        <span style="font-size:20px">\u{1F3E0}</span>
        <div style="font-size:12px;color:#555"><strong>Icono en pantalla:</strong> Acceso directo desde la pantalla de inicio</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px">
        <span style="font-size:20px">\u{1F680}</span>
        <div style="font-size:12px;color:#555"><strong>Carga instant\xE1nea:</strong> Sin esperar la descarga de archivos</div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
      <button onclick="WC_PWA.install().then(ok=>{if(ok){showToast('\u2705 App instalada');document.getElementById('__pwaPanel').remove();}else showToast('Instalaci\xF3n cancelada')})"
        style="padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">
        \u{1F4F1} Instalar WC Editor como app
      </button>
      <button onclick="WC_PWA.injectManifest();showToast('\u2705 Manifest PWA inyectado');document.getElementById('__pwaPanel').remove()"
        style="padding:10px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">
        \u2699\uFE0F Inyectar manifest PWA
      </button>
    </div>

    <div style="background:#f0f7ff;border-radius:8px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.6">
      \u{1F4A1} <strong>En iOS/Safari:</strong> Toc\xE1 el bot\xF3n compartir \u2B06\uFE0F \u2192 "Agregar a pantalla de inicio"<br>
      \u{1F4A1} <strong>En Chrome:</strong> Men\xFA \u22EE \u2192 "Instalar aplicaci\xF3n"
    </div>

    <button onclick="document.getElementById('__pwaPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function openMindMap(){const old=document.getElementById("__mmPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__mmPanel",ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,"Segoe UI",sans-serif',ov.innerHTML=`
    <div style="background:#1a2942;color:#fff;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;flex:1">\u{1F9E0} Mapa mental</div>
      <input type="text" id="__mmRoot" placeholder="Tema central..." value="${ed&&ed.querySelector("h1,h2")?.innerText?.slice(0,30)||"Tema central"}"
        style="padding:6px 12px;border:none;border-radius:8px;font-size:13px;outline:none;background:rgba(255,255,255,.15);color:#fff;width:200px"
        oninput="__mmRender()">
      <select id="__mmLayout" onchange="__mmRender()" style="padding:6px;border:none;border-radius:6px;font-size:12px;outline:none;background:rgba(255,255,255,.15);color:#fff">
        <option value="radial">Radial</option>
        <option value="tree">\xC1rbol</option>
        <option value="horizontal">Horizontal</option>
      </select>
      <button onclick="__mmFromDoc()" style="padding:6px 12px;border:none;background:#0084ff;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4C4} Desde doc</button>
      <button onclick="__mmInsert()" style="padding:6px 12px;border:none;background:#27ae60;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar</button>
      <button onclick="document.getElementById('__mmPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:6px 10px;cursor:pointer">\u2715</button>
    </div>

    <!-- Canvas del mapa mental -->
    <div style="flex:1;background:#0f1923;overflow:hidden;position:relative">
      <svg id="__mmSVG" style="width:100%;height:100%" viewBox="0 0 800 600"></svg>
    </div>

    <!-- Panel de edici\xF3n -->
    <div style="background:#1a2942;padding:10px 16px;display:flex;gap:8px;flex-shrink:0;overflow-x:auto">
      <div style="font-size:11px;color:#aaa;align-self:center;white-space:nowrap">Nodos:</div>
      <div id="__mmNodeList" style="display:flex;gap:6px;flex-wrap:wrap"></div>
      <button onclick="__mmAddNode()" style="padding:5px 12px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0">+ Nodo</button>
    </div>
  `,document.body.appendChild(ov),window.__mmNodes=[{id:"root",label:"Tema central",color:"#003da5",parent:null,children:[]},{id:"n1",label:"Rama 1",color:"#e74c3c",parent:"root",children:[]},{id:"n2",label:"Rama 2",color:"#27ae60",parent:"root",children:[]},{id:"n3",label:"Rama 3",color:"#f39c12",parent:"root",children:[]},{id:"n4",label:"Rama 4",color:"#9b59b6",parent:"root",children:[]},{id:"n1a",label:"Sub 1.1",color:"#e74c3c",parent:"n1",children:[]},{id:"n1b",label:"Sub 1.2",color:"#e74c3c",parent:"n1",children:[]},{id:"n2a",label:"Sub 2.1",color:"#27ae60",parent:"n2",children:[]},{id:"n3a",label:"Sub 3.1",color:"#f39c12",parent:"n3",children:[]}],setTimeout(()=>{const rootLabel=document.getElementById("__mmRoot")?.value||"Tema central";window.__mmNodes[0].label=rootLabel,__mmRender(),__mmRenderNodeList()},100)}function __mmFromDoc(){const ed=document.getElementById("editor");if(!ed)return;const headings=Array.from(ed.querySelectorAll("h1,h2,h3"));if(!headings.length){showToast("Sin t\xEDtulos en el documento");return}const colors=["#e74c3c","#27ae60","#f39c12","#9b59b6","#0084ff","#e67e22","#1abc9c"],nodes=[{id:"root",label:headings[0].innerText.slice(0,30),color:"#003da5",parent:null}];let colorIdx=0;headings.slice(1).forEach((h,i)=>{const id="h"+i,color=colors[colorIdx++%colors.length],parent=h.tagName==="H3"&&nodes.length>1?nodes[nodes.length-1].id:"root";nodes.push({id,label:h.innerText.slice(0,25),color,parent})}),window.__mmNodes=nodes,__mmRender(),__mmRenderNodeList(),showToast("\u{1F9E0} Mapa generado desde el documento \u2705")}function __mmRender(){const svg=document.getElementById("__mmSVG");if(!svg)return;const nodes=window.__mmNodes||[],layout=document.getElementById("__mmLayout")?.value||"radial",rootLabel=document.getElementById("__mmRoot")?.value;rootLabel&&nodes[0]&&(nodes[0].label=rootLabel);const W=800,H=600,cx=W/2,cy=H/2,positions={};if(layout==="radial"){positions.root={x:cx,y:cy};const children=nodes.filter(n=>n.parent==="root");children.forEach((n,i)=>{const angle=i/children.length*2*Math.PI-Math.PI/2,r=160;positions[n.id]={x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)};const subs=nodes.filter(s=>s.parent===n.id);subs.forEach((s,j)=>{const a2=angle+(j-(subs.length-1)/2)*.4;positions[s.id]={x:positions[n.id].x+90*Math.cos(a2),y:positions[n.id].y+90*Math.sin(a2)}})})}else if(layout==="tree"){const levels={};nodes.forEach(n=>{const d=n.parent?2:0;levels[n.id]=n.parent==="root"?1:n.parent?2:0});const byLevel={};nodes.forEach(n=>{const l=levels[n.id]||0;byLevel[l]||(byLevel[l]=[]),byLevel[l].push(n)}),Object.entries(byLevel).forEach(([l,ns])=>{ns.forEach((n,i)=>{positions[n.id]={x:100+i/(ns.length-1||1)*600,y:80+parseInt(l)*160}})})}else{positions.root={x:80,y:cy};const children=nodes.filter(n=>n.parent==="root"),step=H/(children.length+1);children.forEach((n,i)=>{positions[n.id]={x:280,y:step*(i+1)};const subs=nodes.filter(s=>s.parent===n.id),step2=40;subs.forEach((s,j)=>{positions[s.id]={x:480,y:positions[n.id].y+(j-(subs.length-1)/2)*step2}})})}let svgContent="";nodes.forEach(n=>{if(!n.parent||!positions[n.id]||!positions[n.parent])return;const from=positions[n.parent],to=positions[n.id],mx=(from.x+to.x)/2;svgContent+=`<path d="M${from.x},${from.y} C${mx},${from.y} ${mx},${to.y} ${to.x},${to.y}" fill="none" stroke="${n.color||"#666"}" stroke-width="2" stroke-opacity="0.6"/>`}),nodes.forEach(n=>{const pos=positions[n.id];if(!pos)return;const isRoot=!n.parent,r=isRoot?50:40,fs=isRoot?13:11,fw=isRoot?700:500,words=(n.label||n.id).split(" "),lines=[];let cur="";words.forEach(w=>{(cur+" "+w).length>14?(lines.push(cur),cur=w):cur=(cur?cur+" ":"")+w}),cur&&lines.push(cur),svgContent+=`<g class="mm-node" onclick="__mmEditNode('${n.id}')" style="cursor:pointer">`,svgContent+=`<ellipse cx="${pos.x}" cy="${pos.y}" rx="${r}" ry="${isRoot?30:22}" fill="${n.color||"#003da5"}" opacity="0.9"/>`,lines.forEach((line,i)=>{const yOff=(i-(lines.length-1)/2)*14;svgContent+=`<text x="${pos.x}" y="${pos.y+yOff+4}" text-anchor="middle" fill="#fff" font-size="${fs}" font-weight="${fw}" font-family="-apple-system,sans-serif">${line}</text>`}),svgContent+="</g>"}),svg.innerHTML=svgContent,svg.setAttribute("viewBox","0 0 "+W+" "+H)}function __mmRenderNodeList(){const box=document.getElementById("__mmNodeList"),nodes=window.__mmNodes||[];box&&(box.innerHTML=nodes.map(n=>`
    <button onclick="__mmEditNode('${n.id}')"
      style="padding:4px 10px;border:1.5px solid ${n.color};background:${n.color}22;color:${n.color};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap">
      ${n.label.slice(0,15)}
    </button>`).join(""))}function __mmEditNode(id){const node=(window.__mmNodes||[]).find(n=>n.id===id);if(!node)return;const label=prompt("Texto del nodo:",node.label);label!==null&&(node.label=label,__mmRender(),__mmRenderNodeList())}function __mmAddNode(){const parent=prompt("ID del nodo padre (ej: root, n1, n2):","root")||"root",label=prompt("Texto del nuevo nodo:","Nuevo nodo")||"Nuevo nodo",colors=["#e74c3c","#27ae60","#f39c12","#9b59b6","#0084ff","#e67e22"],color=(window.__mmNodes||[]).find(n=>n.id===parent)?.color||colors[Math.floor(Math.random()*colors.length)],id="n"+Date.now();(window.__mmNodes||[]).push({id,label,color,parent}),__mmRender(),__mmRenderNodeList(),showToast("Nodo agregado \u2705")}function __mmInsert(){const svg=document.getElementById("__mmSVG");if(!svg)return;const root=(window.__mmNodes||[])[0]?.label||"Mapa mental",svgHtml=`<div style="margin:12px 0;text-align:center"><svg viewBox="0 0 800 600" style="width:100%;max-width:600px;border-radius:12px;background:#0f1923">${svg.innerHTML}</svg><p style="font-size:9pt;color:#aaa;margin-top:4px">\u{1F9E0} Mapa mental: ${root} \xB7 WC Corporate Editor</p></div>`;typeof insertHTML=="function"&&insertHTML(svgHtml),document.getElementById("__mmPanel").remove(),showToast("\u{1F9E0} Mapa mental insertado \u2705")}function openContractAnalyzer(){const old=document.getElementById("__contractPanel");old&&old.remove();const ed=document.getElementById("editor"),text=ed?ed.innerText.slice(0,4e3).trim():"",ov=document.createElement("div");ov.id="__contractPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2696\uFE0F Analizador de contratos IA</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Detecta cl\xE1usulas abusivas, vac\xEDos legales y riesgos \u2014 Derecho CR</div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${[["general","General"],["laboral","Laboral CR"],["arrendamiento","Arrendamiento"],["servicios","Servicios"],["compraventa","Compraventa"]].map(([v,l],i)=>`
          <button onclick="__caType('${v}',this)" class="__caTypeBtn"
            style="padding:5px 12px;border:2px solid ${i===0?"#e74c3c":"#eee"};background:${i===0?"#fde8e8":"#fafafa"};color:${i===0?"#e74c3c":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            ${l}
          </button>`).join("")}
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:4px">Contrato a analizar</label>
        <textarea id="__caText" rows="5" placeholder="Peg\xE1 el texto del contrato o us\xE1 el contenido del editor..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#e0e0e0'">${text}</textarea>
        <button onclick="document.getElementById('__caText').value=document.getElementById('editor')?.innerText?.slice(0,4000)||''" style="font-size:10px;color:#0084ff;cursor:pointer;background:none;border:none;padding:2px 0">\u{1F4C4} Usar documento actual</button>
      </div>

      <div id="__caProgress" style="display:none;background:#fde8e8;border-radius:8px;padding:10px;text-align:center;color:#e74c3c;font-size:13px;margin-bottom:8px">
        \u2696\uFE0F Analizando cl\xE1usulas con IA...
      </div>
    </div>

    <div id="__caResults" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__contractPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__runContractAnalysis()" style="flex:2;padding:10px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2696\uFE0F Analizar contrato</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__caContractType="general"}function __caType(type,btn){window.__caContractType=type,document.querySelectorAll(".__caTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#e74c3c",btn.style.background="#fde8e8",btn.style.color="#e74c3c",btn.dataset.sel="1"}async function __runContractAnalysis(){const text=document.getElementById("__caText")?.value.trim(),type=window.__caContractType||"general",key=localStorage.getItem("wc-groq-key"),prog=document.getElementById("__caProgress"),res=document.getElementById("__caResults");if(!text||text.length<50){showToast("Ingres\xE1 el texto del contrato");return}if(!key){showToast("Configur\xE1 tu API Key de Groq");return}prog&&(prog.style.display="block");const typeContext={general:"An\xE1lisis general de contrato",laboral:"Contrato laboral bajo el C\xF3digo de Trabajo de Costa Rica (Ley N\xB0 2)",arrendamiento:"Contrato de arrendamiento bajo la Ley 7527 de Costa Rica",servicios:"Contrato de servicios profesionales",compraventa:"Contrato de compraventa bajo el C\xF3digo Civil de Costa Rica"};try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Sos un abogado costarricense especialista en ${typeContext[type]}. Analiz\xE1s contratos y detect\xE1s:
1. CL\xC1USULAS ABUSIVAS o desproporcionadas
2. VAC\xCDOS LEGALES o ambig\xFCedades peligrosas
3. RIESGOS para el contratante d\xE9bil
4. INCUMPLIMIENTO de leyes CR (C\xF3digo de Trabajo, Ley 7527, C\xF3digo Civil, etc.)
5. RECOMENDACIONES de mejora

Para cada hallazgo indic\xE1:
\u26A0\uFE0F RIESGO ALTO / \u2139\uFE0F RIESGO MEDIO / \u2705 SIN PROBLEMA
Nivel: [alto/medio/bajo]
Cl\xE1usula: [extracto del texto]
Problema: [explicaci\xF3n]
Recomendaci\xF3n: [qu\xE9 hacer]

S\xE9 espec\xEDfico y pr\xE1ctico. En espa\xF1ol. M\xE1ximo 8 hallazgos.`},{role:"user",content:`Analiz\xE1 este ${typeContext[type]}:

${text}`}],temperature:.2,max_tokens:1500})})).json())?.choices?.[0]?.message?.content||"";prog&&(prog.style.display="none"),res&&(res.style.display="block");const sections=reply.split(/\n(?=⚠️|ℹ️|✅)/),riskColors={"\u26A0\uFE0F":"#fde8e8","\u2139\uFE0F":"#fff9e6","\u2705":"#d4edda"},riskBorders={"\u26A0\uFE0F":"#e74c3c","\u2139\uFE0F":"#f39c12","\u2705":"#27ae60"};res.innerHTML=`
      <div style="font-size:12px;font-weight:700;color:#e74c3c;margin-bottom:10px">\u2696\uFE0F Resultado del an\xE1lisis \u2014 ${sections.length-1} hallazgos</div>
      ${sections.filter(s=>s.trim()).map(s=>{const icon=s.startsWith("\u26A0\uFE0F")?"\u26A0\uFE0F":s.startsWith("\u2139\uFE0F")?"\u2139\uFE0F":"\u2705";return`<div style="background:${riskColors[icon]||"#f8f8f8"};border-left:4px solid ${riskBorders[icon]||"#ddd"};border-radius:0 8px 8px 0;padding:10px 12px;margin-bottom:8px;font-size:12px;line-height:1.7">
          ${s.replace(/\n/g,"<br>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}
        </div>`}).join("")}
      <button onclick="__caInsertReport()" style="width:100%;margin-top:8px;padding:9px;border:none;background:#e74c3c;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Insertar reporte en documento</button>`,window.__caReply=reply}catch(e){prog&&(prog.style.display="none"),showToast("Error IA: "+e.message)}}function __caInsertReport(){const reply=window.__caReply;if(!reply)return;const type=window.__caContractType||"general",html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:2px solid #e74c3c;border-radius:10px;overflow:hidden;margin:12px 0;max-width:580px">
    <div style="background:#e74c3c;color:#fff;padding:10px 16px;font-weight:700;font-size:13pt">\u2696\uFE0F AN\xC1LISIS DE CONTRATO \u2014 IA Jur\xEDdica CR</div>
    <div style="padding:14px 16px;font-size:10pt;line-height:1.7;color:#333">
      ${reply.replace(/\n/g,"<br>").replace(/⚠️/g,'<strong style="color:#e74c3c">\u26A0\uFE0F</strong>').replace(/ℹ️/g,'<strong style="color:#f39c12">\u2139\uFE0F</strong>').replace(/✅/g,'<strong style="color:#27ae60">\u2705</strong>')}
    </div>
    <div style="padding:8px 16px;background:#f8f9fa;font-size:8pt;color:#aaa">An\xE1lisis generado por IA \u2014 No sustituye asesor\xEDa legal profesional \xB7 WC Corporate Editor \xB7 ${new Date().toLocaleDateString("es-CR")}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__contractPanel").remove(),showToast("\u2696\uFE0F Reporte insertado \u2705")}(function(){setTimeout(()=>WC_PWA.init(),1e3),setTimeout(()=>WC_PWA.injectManifest(),1500),setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"spellCheck":openSpellChecker();break;case"githubSync":openGitHubSync();break;case"pwaInstall":openPWAPanel();break;case"mindMap":openMindMap();break;case"contractAnalyzer":openContractAnalyzer();break;default:orig(a)}}),console.log("WC Corporate Editor v25.29 \u2705 \u2014 Spellcheck, GitHub Sync, PWA, Mapa Mental, Analizador Contratos")},3700)})();const WC_CODE={themes:{dark:{bg:"#1e1e2e",text:"#cdd6f4",lineNum:"#585b70",keyword:"#cba6f7",string:"#a6e3a1",comment:"#585b70",number:"#fab387",func:"#89b4fa",type:"#f5c2e7"},light:{bg:"#fff",text:"#383a42",lineNum:"#a0a1a7",keyword:"#a626a4",string:"#50a14f",comment:"#a0a1a7",number:"#986801",func:"#4078f2",type:"#0184bc"},night:{bg:"#0d1117",text:"#e6edf3",lineNum:"#484f58",keyword:"#ff7b72",string:"#a5d6ff",comment:"#8b949e",number:"#79c0ff",func:"#d2a8ff",type:"#ffa657"}},langs:{javascript:{ext:"js",name:"JavaScript"},python:{ext:"py",name:"Python"},html:{ext:"html",name:"HTML"},css:{ext:"css",name:"CSS"},sql:{ext:"sql",name:"SQL"},bash:{ext:"sh",name:"Bash"},java:{ext:"java",name:"Java"},php:{ext:"php",name:"PHP"}},highlight(code,lang){let h=code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");h=h.replace(/(\/\/[^\n]*)/g,'<span style="color:var(--cc)">$1</span>'),h=h.replace(/(\/\*[\s\S]*?\*\/)/g,'<span style="color:var(--cc)">$1</span>'),h=h.replace(/(#[^\n]*)/g,'<span style="color:var(--cc)">$1</span>'),h=h.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,'<span style="color:var(--cs)">$1</span>'),h=h.replace(/\b(\d+\.?\d*)\b/g,'<span style="color:var(--cn)">$1</span>');const kws="function|const|let|var|if|else|for|while|return|class|import|export|from|async|await|try|catch|finally|new|this|typeof|instanceof|null|undefined|true|false|def|print|lambda|yield|pass|break|continue|in|not|and|or|SELECT|FROM|WHERE|JOIN|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP";return h=h.replace(new RegExp(`\\b(${kws})\\b`,"g"),'<span style="color:var(--ck)">$1</span>'),h}};function openCodeEditor(){const old=document.getElementById("__codePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__codePanel",ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.7);display:flex;flex-direction:column;font-family:-apple-system,"Segoe UI",sans-serif';const defaultCode=`// WC Corporate Editor \u2014 Editor de c\xF3digo

function saludar(nombre) {
  const mensaje = \`\xA1Hola, \${nombre}! Pura vida \u{1F1E8}\u{1F1F7}\`;
  console.log(mensaje);
  return mensaje;
}

saludar("Mae");`;ov.innerHTML=`
    <div style="background:#1a2942;padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:14px;font-weight:700;color:#fff;flex:1">\u{1F4BB} Editor de c\xF3digo</div>
      <select id="__codeLang" style="padding:5px 8px;border:none;border-radius:6px;font-size:12px;outline:none;background:rgba(255,255,255,.15);color:#fff" onchange="__codeRender()">
        ${Object.entries(WC_CODE.langs).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join("")}
      </select>
      <select id="__codeTheme" style="padding:5px 8px;border:none;border-radius:6px;font-size:12px;outline:none;background:rgba(255,255,255,.15);color:#fff" onchange="__codeApplyTheme()">
        <option value="dark">Oscuro</option>
        <option value="light">Claro</option>
        <option value="night">Noche</option>
      </select>
      <button onclick="__codeFormat()" style="padding:5px 10px;border:none;background:rgba(255,255,255,.1);color:#aaa;border-radius:6px;cursor:pointer;font-size:11px">\u26A1 Formatear</button>
      <button onclick="__codeRunIA()" style="padding:5px 10px;border:none;background:#9b59b6;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F999} IA</button>
      <button onclick="document.getElementById('__codePanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:13px">\u2715</button>
    </div>

    <div style="flex:1;display:flex;overflow:hidden">
      <!-- Editor -->
      <div style="flex:1;display:flex;flex-direction:column;border-right:2px solid #333">
        <div style="background:#252540;padding:6px 12px;font-size:11px;color:#666;display:flex;justify-content:space-between">
          <span id="__codeFileName">archivo.js</span>
          <span id="__codeCursor">L\xEDnea 1, Col 1</span>
        </div>
        <div style="flex:1;display:flex;overflow:hidden" id="__codeEditorArea">
          <div id="__codeLineNums" style="background:#1a1a2e;padding:10px 8px;font-size:13px;font-family:'Courier New',monospace;line-height:1.6;text-align:right;color:#585b70;min-width:40px;user-select:none;overflow:hidden"></div>
          <textarea id="__codeTextarea" spellcheck="false"
            style="flex:1;background:#1e1e2e;color:#cdd6f4;border:none;outline:none;padding:10px;font-size:13px;font-family:'Courier New',Courier,monospace;line-height:1.6;resize:none;tab-size:2;overflow-y:auto"
            oninput="__codeRender()" onkeydown="__codeKeyDown(event)" onscroll="__codeSyncScroll()" onclick="__codeCursorPos()">${defaultCode}</textarea>
        </div>
      </div>

      <!-- Preview con syntax highlight -->
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
        <div style="background:#252540;padding:6px 12px;font-size:11px;color:#666">Vista previa con colores</div>
        <div style="flex:1;overflow:auto;background:#1e1e2e;padding:10px">
          <pre id="__codePreview" style="margin:0;font-size:13px;font-family:'Courier New',Courier,monospace;line-height:1.6;--ck:#cba6f7;--cs:#a6e3a1;--cc:#585b70;--cn:#fab387;--cf:#89b4fa"></pre>
        </div>
      </div>
    </div>

    <!-- Panel IA -->
    <div id="__codeIAPanel" style="display:none;background:#1a1a2e;border-top:2px solid #333;padding:10px 16px;max-height:200px;overflow-y:auto">
      <div id="__codeIAResult" style="font-size:12px;color:#cdd6f4;font-family:'Courier New',monospace;white-space:pre-wrap;line-height:1.5"></div>
    </div>

    <div style="background:#1a2942;padding:8px 16px;display:flex;gap:8px;flex-shrink:0">
      <span id="__codeStats" style="font-size:11px;color:#555;flex:1;align-self:center"></span>
      <button onclick="__codeCopy()" style="padding:6px 12px;border:1.5px solid rgba(255,255,255,.1);background:transparent;color:#aaa;border-radius:6px;cursor:pointer;font-size:12px">\u{1F4CB} Copiar</button>
      <button onclick="__codeDownload()" style="padding:6px 12px;border:1.5px solid rgba(255,255,255,.1);background:transparent;color:#aaa;border-radius:6px;cursor:pointer;font-size:12px">\u{1F4BE} Descargar</button>
      <button onclick="__codeInsert()" style="padding:6px 16px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar</button>
    </div>
  `,document.body.appendChild(ov),setTimeout(()=>{__codeRender(),__codeUpdateLineNums()},100)}function __codeRender(){const ta=document.getElementById("__codeTextarea"),prev=document.getElementById("__codePreview"),lang=document.getElementById("__codeLang")?.value||"javascript",fn=document.getElementById("__codeFileName");if(!ta||!prev)return;const code=ta.value;prev.innerHTML=WC_CODE.highlight(code,lang),fn&&(fn.textContent="archivo."+WC_CODE.langs[lang]?.ext);const lines=code.split(`
`).length,words=code.split(/\s+/).filter(w=>w).length,stats=document.getElementById("__codeStats");stats&&(stats.textContent=`${lines} l\xEDneas \xB7 ${words} palabras \xB7 ${code.length} chars`),__codeUpdateLineNums()}function __codeUpdateLineNums(){const ta=document.getElementById("__codeTextarea"),lns=document.getElementById("__codeLineNums");if(!ta||!lns)return;const lines=ta.value.split(`
`).length;lns.innerHTML=Array.from({length:lines},(_,i)=>`<div style="line-height:1.6">${i+1}</div>`).join("")}function __codeSyncScroll(){const ta=document.getElementById("__codeTextarea"),lns=document.getElementById("__codeLineNums");ta&&lns&&(lns.scrollTop=ta.scrollTop)}function __codeCursorPos(){const ta=document.getElementById("__codeTextarea"),cur=document.getElementById("__codeCursor");if(!ta||!cur)return;const lines=ta.value.substring(0,ta.selectionStart).split(`
`);cur.textContent=`L\xEDnea ${lines.length}, Col ${lines[lines.length-1].length+1}`}function __codeKeyDown(e){if(e.key==="Tab"){e.preventDefault();const ta=document.getElementById("__codeTextarea"),start=ta.selectionStart;ta.value=ta.value.slice(0,start)+"  "+ta.value.slice(ta.selectionEnd),ta.selectionStart=ta.selectionEnd=start+2,__codeRender()}}function __codeApplyTheme(){const theme=document.getElementById("__codeTheme")?.value||"dark",t=WC_CODE.themes[theme],prev=document.getElementById("__codePreview"),ta=document.getElementById("__codeTextarea"),area=document.getElementById("__codeEditorArea")?.parentElement;ta&&(ta.style.background=t.bg,ta.style.color=t.text),prev&&(prev.parentElement.style.background=t.bg,prev.style.setProperty("--ck",t.keyword),prev.style.setProperty("--cs",t.string),prev.style.setProperty("--cc",t.comment),prev.style.setProperty("--cn",t.number))}function __codeFormat(){const ta=document.getElementById("__codeTextarea"),lang=document.getElementById("__codeLang")?.value||"javascript";if(!ta)return;let code=ta.value;if(lang==="javascript"||lang==="java"||lang==="php"){let indent=0,result="";code.split(`
`).forEach(line=>{const t=line.trim();t.endsWith("}")&&(indent=Math.max(0,indent-1)),result+="  ".repeat(indent)+t+`
`,t.endsWith("{")&&indent++}),ta.value=result.trim()}__codeRender(),showToast("\u26A1 C\xF3digo formateado \u2705")}async function __codeRunIA(){const key=localStorage.getItem("wc-groq-key"),ta=document.getElementById("__codeTextarea"),lang=document.getElementById("__codeLang")?.value||"javascript",panel=document.getElementById("__codeIAPanel"),res=document.getElementById("__codeIAResult");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}if(!ta||!panel||!res)return;panel.style.display="block",res.textContent="\u{1F999} Analizando c\xF3digo...";const action=prompt("\xBFQu\xE9 quer\xE9s que la IA haga con este c\xF3digo?","Explicar \xB7 Mejorar \xB7 Comentar \xB7 Buscar bugs \xB7 Convertir a Python");if(!action){panel.style.display="none";return}try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:`Sos un experto desarrollador de ${WC_CODE.langs[lang]?.name||lang}. Respond\xE9s en espa\xF1ol.`},{role:"user",content:`${action}:
\`\`\`${lang}
${ta.value}
\`\`\``}],temperature:.3,max_tokens:1e3})})).json())?.choices?.[0]?.message?.content||"";res.textContent=reply;const codeMatch=reply.match(/```(?:\w+)?\n([\s\S]+?)```/);if(codeMatch){const applyBtn=document.createElement("button");applyBtn.textContent="\u2705 Aplicar c\xF3digo sugerido",applyBtn.style.cssText="margin-top:8px;padding:6px 12px;border:none;background:#27ae60;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;display:block",applyBtn.onclick=()=>{ta.value=codeMatch[1],__codeRender(),applyBtn.remove(),showToast("C\xF3digo aplicado \u2705")},panel.appendChild(applyBtn)}}catch(e){res.textContent="Error: "+e.message}}function __codeCopy(){const ta=document.getElementById("__codeTextarea");ta&&navigator.clipboard.writeText(ta.value).then(()=>showToast("\u{1F4CB} C\xF3digo copiado \u2705"))}function __codeDownload(){const ta=document.getElementById("__codeTextarea"),lang=document.getElementById("__codeLang")?.value||"javascript";if(!ta)return;const ext=WC_CODE.langs[lang]?.ext||"txt",blob=new Blob([ta.value],{type:"text/plain"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download="codigo."+ext,a.click(),showToast("\u{1F4BE} Archivo descargado \u2705")}function __codeInsert(){const ta=document.getElementById("__codeTextarea"),lang=document.getElementById("__codeLang")?.value||"javascript";if(!ta)return;const code=ta.value.replace(/</g,"&lt;").replace(/>/g,"&gt;"),html=`<pre style="background:#1e1e2e;color:#cdd6f4;border-radius:10px;padding:14px;font-size:10pt;font-family:'Courier New',Courier,monospace;overflow-x:auto;margin:10px 0"><code class="${lang}">${code}</code></pre>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__codePanel").remove(),showToast("\u{1F4BB} C\xF3digo insertado \u2705")}function openInterviewAssistant(){const old=document.getElementById("__intPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__intPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const areas=["Tecnolog\xEDa / Sistemas","Administraci\xF3n / Negocios","Contabilidad / Finanzas","Derecho / Legal","Educaci\xF3n / Docencia","Salud / Medicina","Ingenier\xEDa","Marketing / Ventas","Recursos Humanos","Otra \xE1rea"];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4BC} Asistente de entrevistas CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Preparaci\xF3n para entrevistas laborales en Costa Rica</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">\xC1rea profesional</label>
          <select id="__intArea" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            ${areas.map(a=>`<option value="${a}">${a}</option>`).join("")}
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de entrevista</label>
          <select id="__intTipo" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none">
            <option>Primera entrevista (RH)</option>
            <option>Entrevista t\xE9cnica</option>
            <option>Panel directivo</option>
            <option>Entrevista virtual</option>
            <option>Prueba psicom\xE9trica</option>
          </select>
        </div>
        <div style="grid-column:1/-1">
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Puesto al que aplic\xE1s</label>
          <input type="text" id="__intPuesto" placeholder="Ej: Desarrollador Full Stack, Contador, Docente..."
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${[["preguntas","\u2753 Preguntas t\xEDpicas"],["respuestas","\u2705 Respuestas modelo"],["salario","\u{1F4B0} Negociaci\xF3n salario CR"],["trampa","\u26A0\uFE0F Preguntas trampa"],["preguntar","\u{1F4AC} Qu\xE9 preguntar vos"],["checklist","\u{1F4CB} Checklist pre-entrevista"]].map(([v,l])=>`
          <button onclick="__intGenerate('${v}')"
            style="padding:7px 12px;border:1.5px solid #eee;background:#fafafa;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;color:#555;transition:all .15s"
            onmouseover="this.style.borderColor='#0084ff';this.style.background='#f0f7ff';this.style.color='#003da5'"
            onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa';this.style.color='#555'">
            ${l}
          </button>`).join("")}
      </div>

      <div id="__intProgress" style="display:none;text-align:center;color:#0084ff;font-size:13px;padding:8px">\u23F3 Generando con IA...</div>
    </div>

    <div id="__intResults" style="flex:1;overflow-y:auto;padding:0 20px;display:none"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__intPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __intGenerate(type){const key=localStorage.getItem("wc-groq-key"),area=document.getElementById("__intArea")?.value||"",tipo=document.getElementById("__intTipo")?.value||"",puesto=document.getElementById("__intPuesto")?.value.trim()||area,prog=document.getElementById("__intProgress"),res=document.getElementById("__intResults");if(!key){showToast("Configur\xE1 tu API Key de Groq");return}prog&&(prog.style.display="block");const prompts={preguntas:`Gener\xE1 10 preguntas t\xEDpicas de ${tipo} para un puesto de ${puesto} en una empresa costarricense. Inclu\xED preguntas t\xE9cnicas y conductuales. En espa\xF1ol CR.`,respuestas:`Gener\xE1 respuestas modelo usando la t\xE9cnica STAR (Situaci\xF3n, Tarea, Acci\xF3n, Resultado) para las 5 preguntas m\xE1s comunes en entrevistas de ${puesto} en Costa Rica. Adaptadas al contexto empresarial CR.`,salario:`Explic\xE1 c\xF3mo negociar salario para un puesto de ${puesto} en Costa Rica en 2025. Inclu\xED: rangos salariales aproximados seg\xFAn el MTSS y mercado CR, t\xE9cnicas de negociaci\xF3n, cu\xE1ndo y c\xF3mo pedir aumento, qu\xE9 beneficios pedir adem\xE1s del salario (CCSS, vacaciones, aguinaldo).`,trampa:`List\xE1 las 8 preguntas trampa m\xE1s comunes en entrevistas en Costa Rica para ${puesto} y c\xF3mo responderlas correctamente sin caer en la trampa. Inclu\xED ejemplos de respuestas adecuadas.`,preguntar:`Gener\xE1 8 preguntas inteligentes que debe hacer un candidato a ${puesto} al entrevistador en una empresa costarricense. Preguntas que demuestren inter\xE9s, inteligencia y conocimiento del mercado CR.`,checklist:`Cre\xE1 un checklist completo de preparaci\xF3n para una ${tipo} para ${puesto} en Costa Rica. Inclu\xED: documentos a llevar, investigaci\xF3n previa sobre la empresa, vestimenta adecuada para el contexto CR, puntualidad y log\xEDstica, preguntas a preparar, seguimiento post-entrevista.`};try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un experto en recursos humanos y coach de carrera costarricense. D\xE1s consejos pr\xE1cticos adaptados al mercado laboral de Costa Rica. En espa\xF1ol."},{role:"user",content:prompts[type]||prompts.preguntas}],temperature:.5,max_tokens:1200})})).json())?.choices?.[0]?.message?.content||"";prog&&(prog.style.display="none"),res&&(res.style.display="block",res.innerHTML=`
        <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-top:10px">${{preguntas:"Preguntas t\xEDpicas",respuestas:"Respuestas STAR",salario:"Negociaci\xF3n salarial CR",trampa:"Preguntas trampa",preguntar:"Qu\xE9 preguntar",checklist:"Checklist"}[type]}</div>
        <div style="font-size:13px;line-height:1.8;color:#333">${reply.replace(/\n/g,"<br>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/^(\d+\.\s)/gm,"<br><strong>$1</strong>")}</div>
        <button onclick="if(typeof insertHTML==='function'){insertHTML('<div style=\\"font-family:Calibri,Arial,sans-serif;padding:14px;border:1px solid #eee;border-radius:8px;margin:10px 0\\">${reply.replace(/'/g,"\\'").replace(/\n/g,"<br>").replace(/"/g,"&quot;")}</div>');document.getElementById('__intPanel').remove();showToast('Insertado \u2705')}" style="margin-top:10px;padding:8px 16px;border:none;background:#0084ff;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4E5} Insertar en documento</button>`)}catch(e){prog&&(prog.style.display="none"),showToast("Error: "+e.message)}}function openBusinessPlan(){const old=document.getElementById("__bpPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__bpPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4C8} Generador de plan de negocio</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Plan de negocio completo para emprendimientos en Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__bpNombre","Nombre del negocio *","Mi Empresa CR"],["__bpIdea","Idea o producto/servicio *","App de delivery de comida casera en San Jos\xE9"],["__bpMercado","Mercado objetivo","Trabajadores entre 25-45 a\xF1os en GAM"],["__bpInversion","Inversi\xF3n inicial estimada (\u20A1)","2000000"],["__bpSector","Sector","Tecnolog\xEDa / Alimentaci\xF3n / Servicios / Comercio"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Secciones a incluir</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${[["__bpResumen","Resumen ejecutivo"],["__bpMision","Misi\xF3n y visi\xF3n"],["__bpMercadoSec","An\xE1lisis de mercado CR"],["__bpCompetencia","An\xE1lisis de competencia"],["__bpProducto","Producto / Servicio"],["__bpMarketing","Plan de marketing"],["__bpFinanciero","Proyecci\xF3n financiera"],["__bpOperaciones","Plan operacional"],["__bpLegal","Aspectos legales CR"],["__bpRiesgos","An\xE1lisis de riesgos"]].map(([id,label])=>`
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:#555">
            <input type="checkbox" id="${id}" checked style="accent-color:#0084ff;width:14px;height:14px"> ${label}
          </label>`).join("")}
      </div>
    </div>

    <div id="__bpProgress" style="display:none;background:#f0f7ff;border-radius:8px;padding:10px;text-align:center;color:#0084ff;font-size:13px;margin-bottom:10px">
      \u{1F4C8} Generando plan de negocio con IA...
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__bpPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateBusinessPlan()" style="flex:2;padding:11px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4C8} Generar plan completo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}async function __generateBusinessPlan(){const key=localStorage.getItem("wc-groq-key"),nombre=document.getElementById("__bpNombre")?.value.trim()||"Mi Negocio",idea=document.getElementById("__bpIdea")?.value.trim()||"",mercado=document.getElementById("__bpMercado")?.value.trim()||"",inversion=document.getElementById("__bpInversion")?.value.trim()||"",sector=document.getElementById("__bpSector")?.value.trim()||"";if(!idea){showToast("Describ\xED tu idea de negocio");return}if(!key){showToast("Configur\xE1 tu API Key de Groq");return}const secciones=[];document.getElementById("__bpResumen")?.checked&&secciones.push("RESUMEN EJECUTIVO"),document.getElementById("__bpMision")?.checked&&secciones.push("MISI\xD3N Y VISI\xD3N"),document.getElementById("__bpMercadoSec")?.checked&&secciones.push("AN\xC1LISIS DE MERCADO (contexto costarricense, GAM, demograf\xEDa CR 2025)"),document.getElementById("__bpCompetencia")?.checked&&secciones.push("AN\xC1LISIS DE COMPETENCIA (empresas CR del sector)"),document.getElementById("__bpProducto")?.checked&&secciones.push("DESCRIPCI\xD3N DEL PRODUCTO/SERVICIO con propuesta de valor"),document.getElementById("__bpMarketing")?.checked&&secciones.push("PLAN DE MARKETING (estrategia digital, redes sociales, WhatsApp Business)"),document.getElementById("__bpFinanciero")?.checked&&secciones.push("PROYECCI\xD3N FINANCIERA 12 meses (en colones CR, con IVA 13%, CCSS)"),document.getElementById("__bpOperaciones")?.checked&&secciones.push("PLAN OPERACIONAL"),document.getElementById("__bpLegal")?.checked&&secciones.push("ASPECTOS LEGALES CR (tipo societario, permisos municipales, PYME, MEIC)"),document.getElementById("__bpRiesgos")?.checked&&secciones.push("AN\xC1LISIS DE RIESGOS y mitigaci\xF3n");const prog=document.getElementById("__bpProgress");prog&&(prog.style.display="block");try{const reply=(await(await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:"Sos un consultor de negocios costarricense con 20 a\xF1os de experiencia en emprendimientos, PYMES y startups en Costa Rica. Conoc\xE9s el mercado local, la legislaci\xF3n CR, el contexto econ\xF3mico y las oportunidades del pa\xEDs. Gener\xE1s planes de negocio profesionales y realistas adaptados a Costa Rica."},{role:"user",content:`Gener\xE1 un PLAN DE NEGOCIO COMPLETO y profesional para:

Nombre: ${nombre}
Idea/Producto: ${idea}
Mercado objetivo: ${mercado||"Por definir"}
Inversi\xF3n inicial: ${inversion?"\u20A1"+inversion:"Por definir"}
Sector: ${sector||"Por definir"}

Incluir estas secciones con formato HTML (h2, h3, p, ul, table):
${secciones.map((s,i)=>`${i+1}. ${s}`).join(`
`)}

El plan debe ser PR\xC1CTICO y REALISTA para Costa Rica 2025. Usar colones (\u20A1). Referencias a leyes, instituciones y mercado costarricense.`}],temperature:.4,max_tokens:2e3})})).json())?.choices?.[0]?.message?.content||"";prog&&(prog.style.display="none");const html=`
    <div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <div style="background:linear-gradient(135deg,#003da5,#27ae60);color:#fff;padding:24px 28px;border-radius:12px;margin-bottom:20px">
        <div style="font-size:22pt;font-weight:900;margin-bottom:4px">${nombre}</div>
        <div style="font-size:11pt;opacity:.85">Plan de Negocio \xB7 Costa Rica \xB7 ${new Date().getFullYear()}</div>
        <div style="font-size:10pt;opacity:.7;margin-top:6px">${idea}</div>
      </div>
      ${reply}
      <div style="margin-top:20px;font-size:9pt;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:8px">
        Plan de negocio generado con IA \xB7 WC Corporate Editor \xB7 ${new Date().toLocaleDateString("es-CR")}
      </div>
    </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__bpPanel").remove(),showToast("\u{1F4C8} Plan de negocio generado \u2705")}catch(e){prog&&(prog.style.display="none"),showToast("Error: "+e.message)}}const WC_KANBAN={boards:JSON.parse(localStorage.getItem("wc-kanban")||"null")||{"Por hacer":[{id:"t1",text:"Revisar documentos",priority:"high",due:""},{id:"t2",text:"Reuni\xF3n de equipo",priority:"medium",due:""}],"En progreso":[{id:"t3",text:"Redactar informe",priority:"high",due:""}],Revisi\u00F3n:[],Completado:[{id:"t4",text:"Enviar propuesta",priority:"low",due:""}]},save(){localStorage.setItem("wc-kanban",JSON.stringify(this.boards))},addTask(col,text,priority){this.boards[col]||(this.boards[col]=[]),this.boards[col].push({id:"t"+Date.now(),text,priority:priority||"medium",due:""}),this.save()},moveTask(taskId,toCol){let task=null;Object.keys(this.boards).forEach(col=>{const idx=this.boards[col].findIndex(t=>t.id===taskId);idx>=0&&(task=this.boards[col].splice(idx,1)[0])}),task&&(this.boards[toCol]||(this.boards[toCol]=[]),this.boards[toCol].push(task),this.save())},deleteTask(taskId){Object.keys(this.boards).forEach(col=>{this.boards[col]=this.boards[col].filter(t=>t.id!==taskId)}),this.save()}};function openKanban(){const old=document.getElementById("__kanbanPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__kanbanPanel",ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;flex-direction:column;font-family:-apple-system,"Segoe UI",sans-serif';const colColors={"Por hacer":"#e74c3c","En progreso":"#f39c12",Revisi\u00F3n:"#0084ff",Completado:"#27ae60"},prioColors={high:"#e74c3c",medium:"#f39c12",low:"#27ae60"},renderBoards=()=>Object.entries(WC_KANBAN.boards).map(([col,tasks])=>`
      <div style="background:#f0f0f5;border-radius:14px;min-width:220px;max-width:260px;flex-shrink:0;display:flex;flex-direction:column;max-height:100%">
        <div style="padding:12px 14px;font-size:13px;font-weight:700;color:#1a2942;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
          <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${colColors[col]||"#888"};margin-right:6px"></span>${col}</span>
          <span style="background:#ddd;border-radius:10px;padding:2px 8px;font-size:10px;color:#555">${tasks.length}</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:0 10px 10px;display:flex;flex-direction:column;gap:6px">
          ${tasks.map(t=>`
            <div style="background:#fff;border-radius:10px;padding:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);border-left:3px solid ${prioColors[t.priority]||"#ddd"}">
              <div style="font-size:12px;color:#1a1a1a;margin-bottom:6px;line-height:1.4">${t.text}</div>
              <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">
                <span style="font-size:9px;background:${prioColors[t.priority]||"#eee"}22;color:${prioColors[t.priority]||"#888"};border-radius:4px;padding:1px 5px;font-weight:600">${t.priority==="high"?"Alta":t.priority==="medium"?"Media":"Baja"}</span>
                <div style="flex:1"></div>
                ${Object.keys(WC_KANBAN.boards).filter(c=>c!==col).map(c=>`<button onclick="WC_KANBAN.moveTask('${t.id}','${c}');__kanbanRerender()" style="padding:2px 5px;border:1px solid #eee;background:#fff;border-radius:4px;cursor:pointer;font-size:9px;color:#555">${c==="Completado"?"\u2705":c==="En progreso"?"\u25B6":c==="Revisi\xF3n"?"\u{1F441}":"\u21A9"}</button>`).join("")}
                <button onclick="WC_KANBAN.deleteTask('${t.id}');__kanbanRerender()" style="padding:2px 5px;border:none;background:none;cursor:pointer;font-size:12px;color:#e74c3c">\xD7</button>
              </div>
            </div>`).join("")}
          <button onclick="__kanbanAddTask('${col}')" style="width:100%;padding:8px;border:2px dashed #ccc;background:transparent;border-radius:8px;cursor:pointer;font-size:12px;color:#888;transition:all .15s" onmouseover="this.style.borderColor='${colColors[col]||"#888"}';this.style.color='${colColors[col]||"#888"}'" onmouseout="this.style.borderColor='#ccc';this.style.color='#888'">+ Agregar tarea</button>
        </div>
      </div>`).join("");ov.innerHTML=`
    <div style="background:#1a2942;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">
      <div style="font-size:15px;font-weight:700;color:#fff;flex:1">\u{1F4CB} Kanban \u2014 Gesti\xF3n de tareas</div>
      <button onclick="__kanbanAddCol()" style="padding:5px 12px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#aaa;border-radius:6px;cursor:pointer;font-size:11px">+ Columna</button>
      <button onclick="__kanbanInsertDoc()" style="padding:5px 12px;border:none;background:#0084ff;color:#fff;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600">\u{1F4CB} Insertar en doc</button>
      <button onclick="document.getElementById('__kanbanPanel').remove()" style="background:rgba(255,255,255,.1);border:none;color:#aaa;border-radius:6px;padding:5px 10px;cursor:pointer">\u2715</button>
    </div>
    <div id="__kanbanBoards" style="flex:1;overflow-x:auto;overflow-y:hidden;padding:16px;display:flex;gap:12px;align-items:flex-start">
      ${renderBoards()}
    </div>`,document.body.appendChild(ov),window.__kanbanRerender=()=>{const boards=document.getElementById("__kanbanBoards");boards&&(boards.innerHTML=renderBoards())}}function __kanbanAddTask(col){const text=prompt("Nueva tarea:","");if(!text)return;const priority=prompt("Prioridad (high/medium/low):","medium")||"medium";WC_KANBAN.addTask(col,text,priority),window.__kanbanRerender&&window.__kanbanRerender()}function __kanbanAddCol(){const name=prompt("Nombre de la nueva columna:","");name&&(WC_KANBAN.boards[name]=[],WC_KANBAN.save(),window.__kanbanRerender&&window.__kanbanRerender())}function __kanbanInsertDoc(){const boards=WC_KANBAN.boards,colColors={"Por hacer":"#e74c3c","En progreso":"#f39c12",Revisi\u00F3n:"#0084ff",Completado:"#27ae60"},prioColors={high:"#fde8e8",medium:"#fff9e6",low:"#d4edda"};let html=`<div style="font-family:Calibri,Arial,sans-serif;margin:12px 0">
    <h3 style="color:#1a2942;margin-bottom:12px">\u{1F4CB} Tablero Kanban \u2014 ${new Date().toLocaleDateString("es-CR")}</h3>
    <div style="display:grid;grid-template-columns:${Object.keys(boards).map(()=>"1fr").join(" ")};gap:10px">`;Object.entries(boards).forEach(([col,tasks])=>{html+=`<div style="background:#f5f5f5;border-radius:10px;padding:10px">
      <div style="font-weight:700;font-size:11pt;color:${colColors[col]||"#888"};margin-bottom:8px;border-bottom:2px solid ${colColors[col]||"#eee"};padding-bottom:4px">${col} (${tasks.length})</div>
      ${tasks.map(t=>`<div style="background:${prioColors[t.priority]||"#fff"};border-radius:6px;padding:7px;margin-bottom:5px;font-size:10pt">${t.text}</div>`).join("")}
    </div>`}),html+="</div></div>",typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__kanbanPanel").remove(),showToast("\u{1F4CB} Kanban insertado \u2705")}function openExportStandalone(){const old=document.getElementById("__standalonePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__standalonePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4E6} Exportar versi\xF3n standalone</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Genera un archivo HTML aut\xF3nomo con todo incluido</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      ${[["__stTitle","T\xEDtulo de la app","WC Corporate Editor v25"],["__stAuthor","Autor","Keny Chinchilla Navarro"],["__stVersion","Versi\xF3n","25.0"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" value="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#0084ff'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Incluir en el paquete</label>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[["__stFeatures","Scripts de features (wc-v25-features*.js)"],["__stOffline","Service Worker para modo offline"],["__stManifest","Manifest PWA"],["__stReadme","README.md con instrucciones"]].map(([id,label])=>`
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
            <input type="checkbox" id="${id}" checked style="accent-color:#0084ff;width:14px;height:14px"> ${label}
          </label>`).join("")}
      </div>
    </div>

    <div style="background:#f0f7ff;border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:#555;line-height:1.7">
      \u{1F4E6} Genera un <strong>index.html aut\xF3nomo</strong> optimizado con:
      <ul style="margin:6px 0 0;padding-left:18px">
        <li>Todo el contenido del editor actual</li>
        <li>Script de instrucciones de instalaci\xF3n</li>
        <li>Metadata PWA completa</li>
        <li>Lista de features incluidas</li>
      </ul>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__standalonePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateStandalone()" style="flex:2;padding:11px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4E6} Generar paquete</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateStandalone(){const title=document.getElementById("__stTitle")?.value||"WC Corporate Editor v25",author=document.getElementById("__stAuthor")?.value||"Keny Chinchilla Navarro",version=document.getElementById("__stVersion")?.value||"25.0",ed=document.getElementById("editor"),content=ed?ed.innerHTML:"<p>Contenido del editor</p>",scripts=[];for(let i=1;i<=29;i++)scripts.push(i===1?"wc-v25-features.js":`wc-v25-features${i}.js`);const readme=`# ${title}

**Autor:** ${author}  
**Versi\xF3n:** ${version}  
**Fecha:** ${new Date().toLocaleDateString("es-CR")}

## Instalaci\xF3n

1. Descarg\xE1 todos los archivos JS de la carpeta del repo
2. Abr\xED \`index.html\` en Chrome/Safari
3. Para instalar como app: Men\xFA \u2192 "Instalar aplicaci\xF3n" (Chrome) o Compartir \u2192 "Agregar a pantalla de inicio" (iOS)

## Scripts incluidos

${scripts.map(s=>`- ${s}`).join(`
`)}

## Features (155+)

Ver documentaci\xF3n completa en el repositorio.

## Repositorio

https://github.com/kacn1z-del/wc-editorpro
`,blobReadme=new Blob([readme],{type:"text/markdown"}),aReadme=document.createElement("a");aReadme.href=URL.createObjectURL(blobReadme),aReadme.download="README.md",aReadme.click();const pkg={name:"wc-corporate-editor",version,author,description:`${title} \u2014 Editor corporativo profesional para Costa Rica con 155+ features`,main:"index.html",scripts:{start:"open index.html"},keywords:["editor","costa-rica","cr","pwa","ia","lenguas-indigenas"],license:"MIT",repository:{type:"git",url:"https://github.com/kacn1z-del/wc-editorpro"},features:scripts},blobPkg=new Blob([JSON.stringify(pkg,null,2)],{type:"application/json"});setTimeout(()=>{const aPkg=document.createElement("a");aPkg.href=URL.createObjectURL(blobPkg),aPkg.download="package.json",aPkg.click()},500),document.getElementById("__standalonePanel").remove(),showToast("\u{1F4E6} README.md y package.json generados \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"codeEditor":openCodeEditor();break;case"interviewAssist":openInterviewAssistant();break;case"businessPlan":openBusinessPlan();break;case"kanban":openKanban();break;case"exportStandalone":openExportStandalone();break;default:orig(a)}}),console.log("WC Corporate Editor v25.30 \u2705 \u2014 C\xF3digo, Entrevistas CR, Plan Negocio, Kanban, Standalone")},3800)})();
