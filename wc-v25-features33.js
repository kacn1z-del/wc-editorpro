function openActaReunion(){const old=document.getElementById("__actaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__actaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const hoy=new Date().toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),hora=new Date().toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit"});ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CB} Acta de reuni\xF3n CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Formato oficial \xB7 Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__actaOrg","Organizaci\xF3n / Instituci\xF3n *","Empresa XYZ S.A."],["__actaTipo","Tipo de reuni\xF3n","Ordinaria / Extraordinaria / Junta Directiva"],["__actaNum","N\xFAmero de acta","001-2025"],["__actaLugar","Lugar de reuni\xF3n","Sala de Juntas, San Jos\xE9"],["__actaFecha","Fecha",hoy],["__actaHoraIn","Hora de inicio",hora],["__actaHoraFin","Hora de finalizaci\xF3n",""],["__actaPresidente","Presidente / Moderador *","Lic. Juan P\xE9rez Rodr\xEDguez"],["__actaSecretario","Secretario/a *","Lic. Mar\xEDa Garc\xEDa L\xF3pez"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" value="${ph.includes("/")||ph.includes("Sala")||ph.includes("Empresa")||ph.includes("001")?"":ph}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Asistentes (uno por l\xEDnea)</label>
        <textarea id="__actaAsistentes" rows="3" placeholder="Ing. Carlos L\xF3pez - Director&#10;Lic. Ana Vargas - Gerente&#10;Sr. Pedro Mora - Invitado"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Agenda (puntos, uno por l\xEDnea)</label>
        <textarea id="__actaAgenda" rows="3" placeholder="1. Apertura de la sesi\xF3n&#10;2. Aprobaci\xF3n del acta anterior&#10;3. Informe de la Gerencia&#10;4. Asuntos varios"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__actaPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateActa()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Generar acta</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),document.getElementById("__actaFecha").value=hoy,document.getElementById("__actaHoraIn").value=hora}function __actaG(id){return document.getElementById(id)?.value?.trim()||""}function __generateActa(){const org=__actaG("__actaOrg"),tipo=__actaG("__actaTipo")||"Ordinaria",num=__actaG("__actaNum")||"001-"+new Date().getFullYear(),lugar=__actaG("__actaLugar")||"San Jos\xE9, Costa Rica",fecha=__actaG("__actaFecha"),horaIn=__actaG("__actaHoraIn"),horaFin=__actaG("__actaHoraFin"),presidente=__actaG("__actaPresidente"),secretario=__actaG("__actaSecretario"),asistentes=__actaG("__actaAsistentes").split(`
`).filter(l=>l.trim()),agenda=__actaG("__actaAgenda").split(`
`).filter(l=>l.trim());if(!org||!presidente||!secretario){showToast("Complet\xE1 los campos obligatorios *");return}const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:11pt;font-weight:700;text-transform:uppercase">${org}</div>
      <div style="width:80%;height:2px;background:#1a2942;margin:8px auto"></div>
      <div style="font-size:14pt;font-weight:900;text-transform:uppercase;color:#1a2942">ACTA N\xB0 ${num}</div>
      <div style="font-size:11pt">Reuni\xF3n ${tipo}</div>
    </div>

    <p style="text-align:justify">En ${lugar}, siendo las <strong>${horaIn} horas</strong> del d\xEDa <strong>${fecha}</strong>, se reunieron en sesi\xF3n <strong>${tipo}</strong> las personas que se detallan en la lista de asistencia, bajo la presidencia de <strong>${presidente}</strong> y con la secretar\xEDa a cargo de <strong>${secretario}</strong>.</p>

    <p><strong>ART\xCDCULO I \u2014 VERIFICACI\xD3N DEL QU\xD3RUM</strong></p>
    <p>Se verifica la presencia del qu\xF3rum reglamentario con la asistencia de los siguientes miembros:</p>
    <ul style="margin:8px 0;padding-left:24px">
      ${asistentes.map(a=>`<li>${a}</li>`).join(`
      `)}
    </ul>

    <p><strong>ART\xCDCULO II \u2014 AGENDA</strong></p>
    <p>Se conoce y aprueba la siguiente agenda:</p>
    <ol style="margin:8px 0;padding-left:24px">
      ${agenda.map(a=>`<li>${a}</li>`).join(`
      `)}
    </ol>

    ${agenda.map((punto,i)=>`
    <p><strong>ART\xCDCULO ${["III","IV","V","VI","VII","VIII","IX","X"][i]||"X"+(i+1)} \u2014 ${punto.replace(/^\d+\.\s*/,"").toUpperCase()}</strong></p>
    <p>[Desarrollar aqu\xED los acuerdos y discusiones del punto ${i+1}]</p>
    <p style="margin-left:20px"><em><strong>ACUERDO ${String(i+1).padStart(2,"0")}-${num}:</strong> [Texto del acuerdo tomado]. Aprobado por [unanimidad / mayor\xEDa]. Votos a favor: ___. Votos en contra: ___. Abstenciones: ___.</em></p>`).join("")}

    <p><strong>CIERRE DE LA SESI\xD3N</strong></p>
    <p>No habiendo m\xE1s asuntos que tratar, se da por concluida la sesi\xF3n a las <strong>${horaFin||"___:___ horas"}</strong> del d\xEDa indicado.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${presidente}</strong><br><small>Presidente</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${secretario}</strong><br><small>Secretario/a</small></div></div>
    </div>

    <p style="margin-top:40px;font-size:10pt;color:#888;text-align:center">Acta generada con WC Corporate Editor \xB7 ${org} \xB7 ${fecha}</p>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__actaPanel").remove(),showToast("\u{1F4CB} Acta de reuni\xF3n generada \u2705")}function openCartaPoder(){const old=document.getElementById("__poderPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__poderPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4DC} Carta poder notarial CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Art\xEDculo 1251 C\xF3digo Civil \xB7 Rep\xFAblica de Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:2px">PODERDANTE (quien otorga el poder)</div>
      ${[["__pdNombre","Nombre completo *","Juan P\xE9rez Rodr\xEDguez"],["__pdCedula","N\xFAmero de c\xE9dula *","1-2345-6789"],["__pdDomicilio","Domicilio","San Jos\xE9, Costa Rica"],["__pdEstadoCivil","Estado civil","Soltero/a"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px;margin-bottom:2px">APODERADO (quien recibe el poder)</div>
      ${[["__apNombre","Nombre completo *","Mar\xEDa Garc\xEDa L\xF3pez"],["__apCedula","N\xFAmero de c\xE9dula *","2-3456-7890"],["__apDomicilio","Domicilio","Heredia, Costa Rica"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Facultades otorgadas *</label>
        <textarea id="__poderFacultades" rows="3" placeholder="Para que me represente ante la CCSS, Hacienda, y dem\xE1s instituciones p\xFAblicas y privadas..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Vigencia</label>
          <select id="__poderVigencia" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option>Indefinida</option><option>6 meses</option><option>1 a\xF1o</option><option>2 a\xF1os</option><option>Hasta revocaci\xF3n expresa</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Ciudad de firma</label>
          <input type="text" id="__poderCiudad" placeholder="San Jos\xE9" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__poderPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateCartaPoder()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4DC} Generar carta poder</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateCartaPoder(){const g=id=>document.getElementById(id)?.value?.trim()||"",pdNombre=g("__pdNombre"),pdCedula=g("__pdCedula"),pdDomicilio=g("__pdDomicilio")||"San Jos\xE9, Costa Rica",pdEstado=g("__pdEstadoCivil")||"",apNombre=g("__apNombre"),apCedula=g("__apCedula"),apDomicilio=g("__apDomicilio")||"Costa Rica",facultades=g("__poderFacultades"),vigencia=g("__poderVigencia")||"Indefinida",ciudad=g("__poderCiudad")||"San Jos\xE9",fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});if(!pdNombre||!pdCedula||!apNombre||!apCedula||!facultades){showToast("Complet\xE1 los campos obligatorios *");return}const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase">CARTA PODER</div>
      <div style="width:40px;height:3px;background:#1a2942;margin:8px auto"></div>
      <div style="font-size:10pt;color:#888">Rep\xFAblica de Costa Rica \xB7 Art\xEDculo 1251 C\xF3digo Civil</div>
    </div>

    <p style="text-align:right">${ciudad}, ${fecha}</p>

    <p style="text-align:justify">Yo, <strong>${pdNombre}</strong>, mayor de edad, ${pdEstado?pdEstado+",":""} portador(a) de la c\xE9dula de identidad n\xFAmero <strong>${pdCedula}</strong>, con domicilio en <strong>${pdDomicilio}</strong>, por medio de este documento OTORGO PODER ESPECIAL a:</p>

    <p style="text-align:center;margin:16px 0"><strong>${apNombre}</strong>, portador(a) de la c\xE9dula de identidad n\xFAmero <strong>${apCedula}</strong>, con domicilio en <strong>${apDomicilio}</strong>.</p>

    <p><strong>FACULTADES OTORGADAS:</strong></p>
    <p style="text-align:justify">${facultades}</p>

    <p><strong>VIGENCIA:</strong> El presente poder tendr\xE1 vigencia ${vigencia.toLowerCase()}, pudiendo ser revocado en cualquier momento mediante comunicaci\xF3n escrita.</p>

    <p style="text-align:justify">El apoderado queda facultado para sustituir este poder, total o parcialmente, cuando as\xED lo estime conveniente.</p>

    <p style="text-align:justify">En fe de lo anterior, firmo en ${ciudad} a los ${fecha}.</p>

    <div style="margin-top:60px;text-align:center">
      <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:200px">
        <strong>${pdNombre}</strong><br>
        <small>C\xE9dula ${pdCedula}</small><br>
        <small>PODERDANTE</small>
      </div>
    </div>

    <div style="margin-top:40px;border:1px solid #aaa;padding:12px;border-radius:4px;font-size:10pt;color:#555">
      <strong>AUTENTICACI\xD3N NOTARIAL:</strong><br>
      Ante m\xED, _________________________, Notario(a) P\xFAblico(a) con oficina en _________________________,
      comparece _________________________ y en mi presencia firma la anterior carta poder.
      Tomo: _____ Folio: _____ Asiento: _____ Fecha: _____________
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__poderPanel").remove(),showToast("\u{1F4DC} Carta poder generada \u2705")}function openDeclaracionJurada(){const old=document.getElementById("__djPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__djPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const tipos=[["general","\u{1F4CB} Declaraci\xF3n jurada general"],["ingresos","\u{1F4B0} Declaraci\xF3n de ingresos"],["residencia","\u{1F3E0} Declaraci\xF3n de residencia"],["solteria","\u{1F48D} Declaraci\xF3n de solter\xEDa"],["dependencia","\u{1F468}\u200D\u{1F469}\u200D\u{1F467} Declaraci\xF3n de dependencia econ\xF3mica"],["bienes","\u{1F3E6} Declaraci\xF3n de bienes y patrimonios"]];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u2696\uFE0F Declaraci\xF3n jurada CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Bajo fe de juramento \xB7 Rep\xFAblica de Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
      ${tipos.map(([v,l],i)=>`
        <button onclick="__djSelectType('${v}',this)" class="__djTypeBtn"
          style="padding:12px;border:1.5px solid ${i===0?"#1a2942":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:10px;cursor:pointer;text-align:left;font-size:13px;font-weight:600;color:${i===0?"#1a2942":"#555"};transition:all .15s"
          ${i===0?'data-sel="1"':""}>${l}
        </button>`).join("")}
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px" id="__djFields">
      ${[["__djNombre","Nombre completo *","Juan P\xE9rez Rodr\xEDguez"],["__djCedula","N\xFAmero de c\xE9dula *","1-2345-6789"],["__djDomicilio","Domicilio *","San Jos\xE9, Costa Rica"],["__djOcupacion","Ocupaci\xF3n / Profesi\xF3n","Comerciante"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Declaraci\xF3n (contenido espec\xEDfico) *</label>
        <textarea id="__djContenido" rows="4" placeholder="Describa aqu\xED el contenido espec\xEDfico de la declaraci\xF3n..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Instituci\xF3n destinataria</label>
        <input type="text" id="__djDestinatario" placeholder="CCSS / Hacienda / Municipalidad / etc."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__djPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateDeclaracion()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u2696\uFE0F Generar declaraci\xF3n</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__djType="general"}function __djSelectType(type,btn){window.__djType=type,document.querySelectorAll(".__djTypeBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#1a2942",btn.style.background="#f0f7ff",btn.style.color="#1a2942",btn.dataset.sel="1";const placeholders={ingresos:"Que mis ingresos mensuales aproximados son de \u20A1___________, provenientes de ___________.",residencia:"Que tengo mi domicilio habitual y permanente en ___________.",solteria:"Que soy soltero(a) y no tengo ning\xFAn v\xEDnculo matrimonial ni uni\xF3n de hecho declarada.",dependencia:"Que el/la se\xF1or(a) ___________, c\xE9dula ___________, depende econ\xF3micamente de mi persona.",bienes:"Que mis bienes patrimoniales consisten en: ___________. Que no tengo deudas pendientes mayores a ___________.",general:""},ta=document.getElementById("__djContenido");ta&&placeholders[type]&&(ta.placeholder=placeholders[type])}function __generateDeclaracion(){const g=id=>document.getElementById(id)?.value?.trim()||"",nombre=g("__djNombre"),cedula=g("__djCedula"),domicilio=g("__djDomicilio"),ocupacion=g("__djOcupacion"),contenido=g("__djContenido"),destino=g("__djDestinatario"),fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"}),tipo=window.__djType||"general";if(!nombre||!cedula||!domicilio||!contenido){showToast("Complet\xE1 los campos obligatorios *");return}const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase">${{general:"DECLARACI\xD3N JURADA",ingresos:"DECLARACI\xD3N JURADA DE INGRESOS",residencia:"DECLARACI\xD3N JURADA DE RESIDENCIA",solteria:"DECLARACI\xD3N JURADA DE SOLTER\xCDA",dependencia:"DECLARACI\xD3N JURADA DE DEPENDENCIA ECON\xD3MICA",bienes:"DECLARACI\xD3N JURADA DE BIENES Y PATRIMONIO"}[tipo]||"DECLARACI\xD3N JURADA"}</div>
      <div style="font-size:10pt;color:#888">Rep\xFAblica de Costa Rica</div>
    </div>

    ${destino?`<p style="text-align:right">Se\xF1ores<br><strong>${destino}</strong><br>Presente</p>`:""}

    <p style="text-align:justify">Yo, <strong>${nombre}</strong>, mayor de edad, ${ocupacion?ocupacion+",":""} portador(a) de la c\xE9dula de identidad n\xFAmero <strong>${cedula}</strong>, con domicilio en <strong>${domicilio}</strong>, con pleno conocimiento de las penas establecidas en el art\xEDculo 318 del C\xF3digo Penal de Costa Rica para el delito de perjurio y falso testimonio,</p>

    <p style="text-align:center"><strong>DECLARO BAJO FE DE JURAMENTO:</strong></p>

    <p style="text-align:justify">${contenido}</p>

    <p style="text-align:justify">Doy fe de que la anterior declaraci\xF3n es fiel expresi\xF3n de la verdad.</p>

    <p style="text-align:right">En ${domicilio.split(",")[0]}, a los ${fecha}.</p>

    <div style="margin-top:60px;text-align:center">
      <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:220px">
        <strong>${nombre}</strong><br>
        <small>C\xE9dula N\xB0 ${cedula}</small>
      </div>
    </div>

    <div style="margin-top:40px;border:1px solid #aaa;padding:12px;border-radius:4px;font-size:10pt;color:#555">
      <strong>AUTENTICACI\xD3N:</strong> Ante m\xED, _________________________, Notario P\xFAblico, se presenta _________________________ y en mi presencia suscribe la anterior declaraci\xF3n jurada.<br>
      Tomo: _____ Folio: _____ Asiento: _____ Fecha: _____________
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__djPanel").remove(),showToast("\u2696\uFE0F Declaraci\xF3n jurada generada \u2705")}function openNDA(){const old=document.getElementById("__ndaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ndaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F512} Contrato de confidencialidad (NDA)</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Non-Disclosure Agreement \xB7 Ley 7975 CR</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:2px">PARTE DIVULGADORA</div>
      ${[["__ndaDiv","Nombre / Empresa *","Empresa Innovadora S.A."],["__ndaDivCedula","C\xE9dula / C\xE9dula Jur\xEDdica","3-101-123456"]].map(([id,label,ph])=>`
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
        <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join("")}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px;margin-bottom:2px">PARTE RECEPTORA</div>
      ${[["__ndaRec","Nombre / Empresa *","Consultor ABC"],["__ndaRecCedula","C\xE9dula / C\xE9dula Jur\xEDdica","1-2345-6789"]].map(([id,label,ph])=>`
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
        <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join("")}

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Informaci\xF3n confidencial a proteger *</label>
        <textarea id="__ndaInfo" rows="3" placeholder="Planes de negocio, datos financieros, propiedad intelectual, secretos comerciales, listas de clientes..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Prop\xF3sito / Relaci\xF3n comercial</label>
        <input type="text" id="__ndaProposito" placeholder="Evaluaci\xF3n de posible alianza comercial / Contrataci\xF3n de servicios / etc."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Vigencia</label>
          <select id="__ndaVigencia" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option>1 a\xF1o</option><option>2 a\xF1os</option><option>3 a\xF1os</option><option>5 a\xF1os</option><option>Indefinida</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Penalidad por incumplimiento</label>
          <input type="text" id="__ndaPenalidad" placeholder="\u20A1500,000 o valor real del da\xF1o"
            style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__ndaPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateNDA()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F512} Generar NDA</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateNDA(){const g=id=>document.getElementById(id)?.value?.trim()||"",div_=g("__ndaDiv"),divCed=g("__ndaDivCedula"),rec=g("__ndaRec"),recCed=g("__ndaRecCedula"),info=g("__ndaInfo"),prop=g("__ndaProposito"),vigencia=g("__ndaVigencia")||"2 a\xF1os",penal=g("__ndaPenalidad")||"el valor real de los da\xF1os y perjuicios causados",fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});if(!div_||!rec||!info){showToast("Complet\xE1 los campos obligatorios *");return}const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase">ACUERDO DE CONFIDENCIALIDAD</div>
      <div style="font-size:11pt;font-style:italic">(Non-Disclosure Agreement \u2014 NDA)</div>
      <div style="font-size:10pt;color:#888;margin-top:4px">Ley N\xB0 7975 de Informaci\xF3n No Divulgada \xB7 Rep\xFAblica de Costa Rica</div>
    </div>

    <p style="text-align:justify">Entre <strong>${div_}</strong>${divCed?`, c\xE9dula/c\xE9dula jur\xEDdica ${divCed}`:""}, en adelante <em>"LA PARTE DIVULGADORA"</em>; y <strong>${rec}</strong>${recCed?`, c\xE9dula/c\xE9dula jur\xEDdica ${recCed}`:""}, en adelante <em>"LA PARTE RECEPTORA"</em>; se suscribe el presente Acuerdo de Confidencialidad al tenor de las siguientes cl\xE1usulas:</p>

    <p><strong>PRIMERA (Objeto):</strong> El presente acuerdo tiene como objeto proteger la informaci\xF3n confidencial que LA PARTE DIVULGADORA compartir\xE1 con LA PARTE RECEPTORA en el marco de: <em>${prop||"las relaciones comerciales entre las partes"}</em>.</p>

    <p><strong>SEGUNDA (Informaci\xF3n confidencial):</strong> Se considera informaci\xF3n confidencial toda aquella relacionada con: ${info}. Esta informaci\xF3n no es de dominio p\xFAblico y tiene valor comercial para LA PARTE DIVULGADORA.</p>

    <p><strong>TERCERA (Obligaciones de la Parte Receptora):</strong> LA PARTE RECEPTORA se obliga a: (a) Mantener absoluta confidencialidad sobre la informaci\xF3n recibida; (b) No divulgar, reproducir ni transmitir la informaci\xF3n a terceros sin autorizaci\xF3n escrita; (c) Utilizar la informaci\xF3n \xFAnicamente para el prop\xF3sito establecido en este acuerdo; (d) Implementar medidas de seguridad razonables para proteger la informaci\xF3n.</p>

    <p><strong>CUARTA (Excepciones):</strong> Las obligaciones de confidencialidad no aplican cuando la informaci\xF3n: (a) Sea de dominio p\xFAblico sin culpa de la Parte Receptora; (b) Sea requerida por orden judicial o autoridad competente; (c) Ya era conocida por la Parte Receptora con anterioridad.</p>

    <p><strong>QUINTA (Vigencia):</strong> Este acuerdo tendr\xE1 una vigencia de <strong>${vigencia}</strong> a partir de la fecha de firma.</p>

    <p><strong>SEXTA (Penalidades):</strong> El incumplimiento de este acuerdo dar\xE1 derecho a LA PARTE DIVULGADORA a exigir el pago de ${penal}, sin perjuicio de las acciones penales que correspondan seg\xFAn la Ley N\xB0 7975.</p>

    <p><strong>S\xC9TIMA (Jurisdicci\xF3n):</strong> Para la resoluci\xF3n de controversias, las partes se someten expresamente a los Tribunales de Justicia de la Rep\xFAblica de Costa Rica.</p>

    <p style="text-align:right">San Jos\xE9, Costa Rica, a los ${fecha}.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${div_}</strong><br><small>${divCed}</small><br><small>PARTE DIVULGADORA</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${rec}</strong><br><small>${recCed}</small><br><small>PARTE RECEPTORA</small></div></div>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__ndaPanel").remove(),showToast("\u{1F512} NDA generado \u2705")}function openReciboTimbre(){const old=document.getElementById("__timbrePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__timbrePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const num=String(parseInt(localStorage.getItem("wc-recibo-num")||"0")+1).padStart(5,"0");ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F9FE} Recibo con timbre fiscal CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">N\xB0 ${num} \xB7 C\xF3digo Fiscal \xB7 Rep\xFAblica de Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__tbRecibidor","Yo (quien recibe) *","Juan P\xE9rez Rodr\xEDguez"],["__tbCedRec","C\xE9dula quien recibe","1-2345-6789"],["__tbPagador","Recib\xED de (quien paga) *","Mar\xEDa Garc\xEDa L\xF3pez"],["__tbCedPag","C\xE9dula quien paga","2-3456-7890"],["__tbMonto","Monto (\u20A1 o $) *","50000"],["__tbMoneda","Moneda","\u20A1 Colones costarricenses"],["__tbConcepto","En concepto de *","Pago por servicios profesionales"],["__tbFormaPago","Forma de pago","Transferencia SINPE / Efectivo / Cheque"],["__tbBanco","Banco / N\xB0 comprobante",""]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Timbres fiscales</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[["__tbTimbreArch","Timbre de Archivo Nacional (\u20A120)"],["__tbTimbreBar","Timbre del Colegio de Abogados (\u20A15)"],["__tbTimbreMun","Timbre Municipal"],["__tbTimbreOtro","Sin timbre fiscal"]].map(([id,label],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:7px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};border-radius:8px;font-size:11px;font-weight:600;color:${i===0?"#003da5":"#555"}">
              <input type="radio" name="__tbTimbre" value="${id}" ${i===0?"checked":""} style="accent-color:#003da5"> ${label}
            </label>`).join("")}
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__timbrePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateReciboTimbre('${num}')" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F9FE} Generar recibo</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateReciboTimbre(num){const g=id=>document.getElementById(id)?.value?.trim()||"",recibidor=g("__tbRecibidor"),cedRec=g("__tbCedRec"),pagador=g("__tbPagador"),cedPag=g("__tbCedPag"),monto=g("__tbMonto"),moneda=g("__tbMoneda")||"\u20A1 Colones",concepto=g("__tbConcepto"),forma=g("__tbFormaPago"),banco=g("__tbBanco"),timbre=document.querySelector('[name="__tbTimbre"]:checked')?.value||"__tbTimbreArch",fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"}),hora=new Date().toLocaleTimeString("es-CR",{hour:"2-digit",minute:"2-digit"});if(!recibidor||!pagador||!monto||!concepto){showToast("Complet\xE1 los campos obligatorios *");return}localStorage.setItem("wc-recibo-num",String(parseInt(num)));const fmt="\u20A1"+(parseFloat(monto.replace(/[^\d.]/g,""))||0).toLocaleString("es-CR",{minimumFractionDigits:2}),timbreLabels={__tbTimbreArch:"Timbre del Archivo Nacional: \u20A120,00",__tbTimbreBar:"Timbre del Colegio de Abogados: \u20A15,00",__tbTimbreMun:"Timbre Municipal: seg\xFAn tarifa",__tbTimbreOtro:"Exento de timbre fiscal"},html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:2px solid #1a2942;border-radius:10px;overflow:hidden;max-width:520px;margin:12px auto">
    <!-- Header -->
    <div style="background:#1a2942;color:#fff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:16pt;font-weight:900;letter-spacing:1px">RECIBO</div>
        <div style="font-size:9pt;opacity:.7">N\xB0 ${num}</div>
      </div>
      <div style="text-align:right;font-size:9pt;opacity:.85">
        <div>${fecha}</div>
        <div>${hora} hrs</div>
      </div>
    </div>

    <!-- Monto destacado -->
    <div style="background:#f0f7ff;padding:16px 18px;text-align:center;border-bottom:1px solid #ddd">
      <div style="font-size:28pt;font-weight:900;color:#003da5">${fmt}</div>
      <div style="font-size:10pt;color:#888">${moneda}</div>
    </div>

    <!-- Datos -->
    <div style="padding:14px 18px;font-size:11pt">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:5px 0;color:#888;width:40%">Recib\xED de:</td><td style="padding:5px 0;font-weight:600"><strong>${pagador}</strong>${cedPag?` \xB7 C\xE9dula ${cedPag}`:""}</td></tr>
        <tr><td style="padding:5px 0;color:#888">Concepto:</td><td style="padding:5px 0">${concepto}</td></tr>
        ${forma?`<tr><td style="padding:5px 0;color:#888">Forma de pago:</td><td style="padding:5px 0">${forma}</td></tr>`:""}
        ${banco?`<tr><td style="padding:5px 0;color:#888">Comprobante:</td><td style="padding:5px 0">${banco}</td></tr>`:""}
      </table>
    </div>

    <!-- Timbre fiscal -->
    <div style="padding:8px 18px;background:#fffbf0;border-top:1px dashed #f39c12;border-bottom:1px dashed #f39c12;font-size:9pt;color:#856404">
      \u{1F4EE} <strong>${timbreLabels[timbre]||timbreLabels.__tbTimbreArch}</strong>
    </div>

    <!-- Firma -->
    <div style="padding:14px 18px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px;font-size:10pt"><strong>${recibidor}</strong><br><small>${cedRec?`C\xE9dula ${cedRec}`:""}</small><br><small>QUIEN RECIBE</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px;font-size:10pt"><strong>${pagador}</strong><br><small>${cedPag?`C\xE9dula ${cedPag}`:""}</small><br><small>QUIEN PAGA</small></div></div>
    </div>

    <div style="padding:6px 18px;background:#f8f9fa;font-size:8pt;color:#aaa;text-align:center">WC Corporate Editor \xB7 Costa Rica \xB7 Este recibo tiene validez legal con las firmas correspondientes</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__timbrePanel").remove(),showToast(`\u{1F9FE} Recibo N\xB0 ${num} generado \u2705`)}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"actaReunion":openActaReunion();break;case"cartaPoder":openCartaPoder();break;case"declaracionJurada":openDeclaracionJurada();break;case"ndaContract":openNDA();break;case"reciboTimbre":openReciboTimbre();break;default:orig(a)}}),console.log("WC Corporate Editor v25.33 \u2705 \u2014 Actas, Carta Poder, Dec. Jurada, NDA, Recibo Timbre CR")},4100)})();
