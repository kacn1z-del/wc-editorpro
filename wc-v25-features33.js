/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.33 — 5 FEATURES COSTA RICA
   1. Actas de reunión CR
   2. Carta poder notarial
   3. Declaración jurada ante notario
   4. Contrato de confidencialidad (NDA) CR
   5. Recibo de dinero con timbre fiscal
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 1: ACTAS DE REUNIÓN CR
   ═══════════════════════════════════ */

function openActaReunion() {
  const old = document.getElementById('__actaPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__actaPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const hoy = new Date().toLocaleDateString('es-CR', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const hora = new Date().toLocaleTimeString('es-CR', {hour:'2-digit',minute:'2-digit'});

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📋 Acta de reunión CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Formato oficial · Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[
        ['__actaOrg',      'Organización / Institución *',   'Empresa XYZ S.A.'],
        ['__actaTipo',     'Tipo de reunión',                 'Ordinaria / Extraordinaria / Junta Directiva'],
        ['__actaNum',      'Número de acta',                  '001-2025'],
        ['__actaLugar',    'Lugar de reunión',                'Sala de Juntas, San José'],
        ['__actaFecha',    'Fecha',                           hoy],
        ['__actaHoraIn',   'Hora de inicio',                  hora],
        ['__actaHoraFin',  'Hora de finalización',            ''],
        ['__actaPresidente','Presidente / Moderador *',       'Lic. Juan Pérez Rodríguez'],
        ['__actaSecretario','Secretario/a *',                 'Lic. María García López'],
      ].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" value="${ph.includes('/')||ph.includes('Sala')||ph.includes('Empresa')||ph.includes('001')?'':ph}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Asistentes (uno por línea)</label>
        <textarea id="__actaAsistentes" rows="3" placeholder="Ing. Carlos López - Director&#10;Lic. Ana Vargas - Gerente&#10;Sr. Pedro Mora - Invitado"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Agenda (puntos, uno por línea)</label>
        <textarea id="__actaAgenda" rows="3" placeholder="1. Apertura de la sesión&#10;2. Aprobación del acta anterior&#10;3. Informe de la Gerencia&#10;4. Asuntos varios"
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__actaPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateActa()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📋 Generar acta</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});

  // Pre-llenar fecha y hora
  document.getElementById('__actaFecha').value = hoy;
  document.getElementById('__actaHoraIn').value = hora;
}

function __actaG(id){ return document.getElementById(id)?.value?.trim()||''; }

function __generateActa() {
  const org        = __actaG('__actaOrg');
  const tipo       = __actaG('__actaTipo') || 'Ordinaria';
  const num        = __actaG('__actaNum')  || '001-'+new Date().getFullYear();
  const lugar      = __actaG('__actaLugar')|| 'San José, Costa Rica';
  const fecha      = __actaG('__actaFecha');
  const horaIn     = __actaG('__actaHoraIn');
  const horaFin    = __actaG('__actaHoraFin');
  const presidente = __actaG('__actaPresidente');
  const secretario = __actaG('__actaSecretario');
  const asistentes = __actaG('__actaAsistentes').split('\n').filter(l=>l.trim());
  const agenda     = __actaG('__actaAgenda').split('\n').filter(l=>l.trim());

  if (!org||!presidente||!secretario) { showToast('Completá los campos obligatorios *'); return; }

  const html = `
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:11pt;font-weight:700;text-transform:uppercase">${org}</div>
      <div style="width:80%;height:2px;background:#1a2942;margin:8px auto"></div>
      <div style="font-size:14pt;font-weight:900;text-transform:uppercase;color:#1a2942">ACTA N° ${num}</div>
      <div style="font-size:11pt">Reunión ${tipo}</div>
    </div>

    <p style="text-align:justify">En ${lugar}, siendo las <strong>${horaIn} horas</strong> del día <strong>${fecha}</strong>, se reunieron en sesión <strong>${tipo}</strong> las personas que se detallan en la lista de asistencia, bajo la presidencia de <strong>${presidente}</strong> y con la secretaría a cargo de <strong>${secretario}</strong>.</p>

    <p><strong>ARTÍCULO I — VERIFICACIÓN DEL QUÓRUM</strong></p>
    <p>Se verifica la presencia del quórum reglamentario con la asistencia de los siguientes miembros:</p>
    <ul style="margin:8px 0;padding-left:24px">
      ${asistentes.map(a=>`<li>${a}</li>`).join('\n      ')}
    </ul>

    <p><strong>ARTÍCULO II — AGENDA</strong></p>
    <p>Se conoce y aprueba la siguiente agenda:</p>
    <ol style="margin:8px 0;padding-left:24px">
      ${agenda.map(a=>`<li>${a}</li>`).join('\n      ')}
    </ol>

    ${agenda.map((punto, i) => `
    <p><strong>ARTÍCULO ${['III','IV','V','VI','VII','VIII','IX','X'][i]||'X'+(i+1)} — ${punto.replace(/^\d+\.\s*/,'').toUpperCase()}</strong></p>
    <p>[Desarrollar aquí los acuerdos y discusiones del punto ${i+1}]</p>
    <p style="margin-left:20px"><em><strong>ACUERDO ${String(i+1).padStart(2,'0')}-${num}:</strong> [Texto del acuerdo tomado]. Aprobado por [unanimidad / mayoría]. Votos a favor: ___. Votos en contra: ___. Abstenciones: ___.</em></p>`).join('')}

    <p><strong>CIERRE DE LA SESIÓN</strong></p>
    <p>No habiendo más asuntos que tratar, se da por concluida la sesión a las <strong>${horaFin||'___:___ horas'}</strong> del día indicado.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${presidente}</strong><br><small>Presidente</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${secretario}</strong><br><small>Secretario/a</small></div></div>
    </div>

    <p style="margin-top:40px;font-size:10pt;color:#888;text-align:center">Acta generada con WC Corporate Editor · ${org} · ${fecha}</p>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__actaPanel').remove();
  showToast('📋 Acta de reunión generada ✅');
}


/* ═══════════════════════════════════
   FEATURE 2: CARTA PODER NOTARIAL CR
   ═══════════════════════════════════ */

function openCartaPoder() {
  const old = document.getElementById('__poderPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__poderPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📜 Carta poder notarial CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Artículo 1251 Código Civil · República de Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:2px">PODERDANTE (quien otorga el poder)</div>
      ${[['__pdNombre','Nombre completo *','Juan Pérez Rodríguez'],['__pdCedula','Número de cédula *','1-2345-6789'],['__pdDomicilio','Domicilio','San José, Costa Rica'],['__pdEstadoCivil','Estado civil','Soltero/a']].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px;margin-bottom:2px">APODERADO (quien recibe el poder)</div>
      ${[['__apNombre','Nombre completo *','María García López'],['__apCedula','Número de cédula *','2-3456-7890'],['__apDomicilio','Domicilio','Heredia, Costa Rica']].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Facultades otorgadas *</label>
        <textarea id="__poderFacultades" rows="3" placeholder="Para que me represente ante la CCSS, Hacienda, y demás instituciones públicas y privadas..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Vigencia</label>
          <select id="__poderVigencia" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option>Indefinida</option><option>6 meses</option><option>1 año</option><option>2 años</option><option>Hasta revocación expresa</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Ciudad de firma</label>
          <input type="text" id="__poderCiudad" placeholder="San José" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__poderPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateCartaPoder()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📜 Generar carta poder</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __generateCartaPoder() {
  const g = id => document.getElementById(id)?.value?.trim()||'';
  const pdNombre    = g('__pdNombre'); const pdCedula  = g('__pdCedula');
  const pdDomicilio = g('__pdDomicilio')||'San José, Costa Rica';
  const pdEstado    = g('__pdEstadoCivil')||'';
  const apNombre    = g('__apNombre'); const apCedula  = g('__apCedula');
  const apDomicilio = g('__apDomicilio')||'Costa Rica';
  const facultades  = g('__poderFacultades');
  const vigencia    = g('__poderVigencia')||'Indefinida';
  const ciudad      = g('__poderCiudad')||'San José';
  const fecha       = new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});

  if (!pdNombre||!pdCedula||!apNombre||!apCedula||!facultades) { showToast('Completá los campos obligatorios *'); return; }

  const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase">CARTA PODER</div>
      <div style="width:40px;height:3px;background:#1a2942;margin:8px auto"></div>
      <div style="font-size:10pt;color:#888">República de Costa Rica · Artículo 1251 Código Civil</div>
    </div>

    <p style="text-align:right">${ciudad}, ${fecha}</p>

    <p style="text-align:justify">Yo, <strong>${pdNombre}</strong>, mayor de edad, ${pdEstado?pdEstado+',':''} portador(a) de la cédula de identidad número <strong>${pdCedula}</strong>, con domicilio en <strong>${pdDomicilio}</strong>, por medio de este documento OTORGO PODER ESPECIAL a:</p>

    <p style="text-align:center;margin:16px 0"><strong>${apNombre}</strong>, portador(a) de la cédula de identidad número <strong>${apCedula}</strong>, con domicilio en <strong>${apDomicilio}</strong>.</p>

    <p><strong>FACULTADES OTORGADAS:</strong></p>
    <p style="text-align:justify">${facultades}</p>

    <p><strong>VIGENCIA:</strong> El presente poder tendrá vigencia ${vigencia.toLowerCase()}, pudiendo ser revocado en cualquier momento mediante comunicación escrita.</p>

    <p style="text-align:justify">El apoderado queda facultado para sustituir este poder, total o parcialmente, cuando así lo estime conveniente.</p>

    <p style="text-align:justify">En fe de lo anterior, firmo en ${ciudad} a los ${fecha}.</p>

    <div style="margin-top:60px;text-align:center">
      <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:200px">
        <strong>${pdNombre}</strong><br>
        <small>Cédula ${pdCedula}</small><br>
        <small>PODERDANTE</small>
      </div>
    </div>

    <div style="margin-top:40px;border:1px solid #aaa;padding:12px;border-radius:4px;font-size:10pt;color:#555">
      <strong>AUTENTICACIÓN NOTARIAL:</strong><br>
      Ante mí, _________________________, Notario(a) Público(a) con oficina en _________________________,
      comparece _________________________ y en mi presencia firma la anterior carta poder.
      Tomo: _____ Folio: _____ Asiento: _____ Fecha: _____________
    </div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__poderPanel').remove();
  showToast('📜 Carta poder generada ✅');
}


/* ═══════════════════════════════════
   FEATURE 3: DECLARACIÓN JURADA CR
   ═══════════════════════════════════ */

function openDeclaracionJurada() {
  const old = document.getElementById('__djPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__djPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const tipos=[
    ['general',     '📋 Declaración jurada general'],
    ['ingresos',    '💰 Declaración de ingresos'],
    ['residencia',  '🏠 Declaración de residencia'],
    ['solteria',    '💍 Declaración de soltería'],
    ['dependencia', '👨‍👩‍👧 Declaración de dependencia económica'],
    ['bienes',      '🏦 Declaración de bienes y patrimonios'],
  ];

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">⚖️ Declaración jurada CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Bajo fe de juramento · República de Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
      ${tipos.map(([v,l],i)=>`
        <button onclick="__djSelectType('${v}',this)" class="__djTypeBtn"
          style="padding:12px;border:1.5px solid ${i===0?'#1a2942':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};border-radius:10px;cursor:pointer;text-align:left;font-size:13px;font-weight:600;color:${i===0?'#1a2942':'#555'};transition:all .15s"
          ${i===0?'data-sel="1"':''}>${l}
        </button>`).join('')}
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px" id="__djFields">
      ${[['__djNombre','Nombre completo *','Juan Pérez Rodríguez'],['__djCedula','Número de cédula *','1-2345-6789'],['__djDomicilio','Domicilio *','San José, Costa Rica'],['__djOcupacion','Ocupación / Profesión','Comerciante']].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Declaración (contenido específico) *</label>
        <textarea id="__djContenido" rows="4" placeholder="Describa aquí el contenido específico de la declaración..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Institución destinataria</label>
        <input type="text" id="__djDestinatario" placeholder="CCSS / Hacienda / Municipalidad / etc."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__djPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateDeclaracion()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">⚖️ Generar declaración</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
  window.__djType = 'general';
}

function __djSelectType(type, btn) {
  window.__djType = type;
  document.querySelectorAll('.__djTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  btn.style.borderColor='#1a2942'; btn.style.background='#f0f7ff'; btn.style.color='#1a2942'; btn.dataset.sel='1';

  const placeholders = {
    ingresos: 'Que mis ingresos mensuales aproximados son de ₡___________, provenientes de ___________.',
    residencia:'Que tengo mi domicilio habitual y permanente en ___________.',
    solteria:  'Que soy soltero(a) y no tengo ningún vínculo matrimonial ni unión de hecho declarada.',
    dependencia:'Que el/la señor(a) ___________, cédula ___________, depende económicamente de mi persona.',
    bienes:    'Que mis bienes patrimoniales consisten en: ___________. Que no tengo deudas pendientes mayores a ___________.',
    general:   '',
  };
  const ta = document.getElementById('__djContenido');
  if (ta && placeholders[type]) ta.placeholder = placeholders[type];
}

function __generateDeclaracion() {
  const g = id => document.getElementById(id)?.value?.trim()||'';
  const nombre  = g('__djNombre'); const cedula = g('__djCedula');
  const domicilio= g('__djDomicilio'); const ocupacion=g('__djOcupacion');
  const contenido= g('__djContenido'); const destino=g('__djDestinatario');
  const fecha   = new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});
  const tipo    = window.__djType||'general';

  if (!nombre||!cedula||!domicilio||!contenido) { showToast('Completá los campos obligatorios *'); return; }

  const tipLabels = { general:'DECLARACIÓN JURADA', ingresos:'DECLARACIÓN JURADA DE INGRESOS', residencia:'DECLARACIÓN JURADA DE RESIDENCIA', solteria:'DECLARACIÓN JURADA DE SOLTERÍA', dependencia:'DECLARACIÓN JURADA DE DEPENDENCIA ECONÓMICA', bienes:'DECLARACIÓN JURADA DE BIENES Y PATRIMONIO' };

  const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase">${tipLabels[tipo]||'DECLARACIÓN JURADA'}</div>
      <div style="font-size:10pt;color:#888">República de Costa Rica</div>
    </div>

    ${destino?`<p style="text-align:right">Señores<br><strong>${destino}</strong><br>Presente</p>`:''}

    <p style="text-align:justify">Yo, <strong>${nombre}</strong>, mayor de edad, ${ocupacion?ocupacion+',':''} portador(a) de la cédula de identidad número <strong>${cedula}</strong>, con domicilio en <strong>${domicilio}</strong>, con pleno conocimiento de las penas establecidas en el artículo 318 del Código Penal de Costa Rica para el delito de perjurio y falso testimonio,</p>

    <p style="text-align:center"><strong>DECLARO BAJO FE DE JURAMENTO:</strong></p>

    <p style="text-align:justify">${contenido}</p>

    <p style="text-align:justify">Doy fe de que la anterior declaración es fiel expresión de la verdad.</p>

    <p style="text-align:right">En ${domicilio.split(',')[0]}, a los ${fecha}.</p>

    <div style="margin-top:60px;text-align:center">
      <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:220px">
        <strong>${nombre}</strong><br>
        <small>Cédula N° ${cedula}</small>
      </div>
    </div>

    <div style="margin-top:40px;border:1px solid #aaa;padding:12px;border-radius:4px;font-size:10pt;color:#555">
      <strong>AUTENTICACIÓN:</strong> Ante mí, _________________________, Notario Público, se presenta _________________________ y en mi presencia suscribe la anterior declaración jurada.<br>
      Tomo: _____ Folio: _____ Asiento: _____ Fecha: _____________
    </div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__djPanel').remove();
  showToast('⚖️ Declaración jurada generada ✅');
}


/* ═══════════════════════════════════
   FEATURE 4: NDA / CONTRATO CONFIDENCIALIDAD CR
   ═══════════════════════════════════ */

function openNDA() {
  const old = document.getElementById('__ndaPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__ndaPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🔒 Contrato de confidencialidad (NDA)</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Non-Disclosure Agreement · Ley 7975 CR</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:2px">PARTE DIVULGADORA</div>
      ${[['__ndaDiv','Nombre / Empresa *','Empresa Innovadora S.A.'],['__ndaDivCedula','Cédula / Cédula Jurídica','3-101-123456']].map(([id,label,ph])=>`
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
        <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join('')}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px;margin-bottom:2px">PARTE RECEPTORA</div>
      ${[['__ndaRec','Nombre / Empresa *','Consultor ABC'],['__ndaRecCedula','Cédula / Cédula Jurídica','1-2345-6789']].map(([id,label,ph])=>`
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
        <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join('')}

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Información confidencial a proteger *</label>
        <textarea id="__ndaInfo" rows="3" placeholder="Planes de negocio, datos financieros, propiedad intelectual, secretos comerciales, listas de clientes..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>

      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Propósito / Relación comercial</label>
        <input type="text" id="__ndaProposito" placeholder="Evaluación de posible alianza comercial / Contratación de servicios / etc."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Vigencia</label>
          <select id="__ndaVigencia" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option>1 año</option><option>2 años</option><option>3 años</option><option>5 años</option><option>Indefinida</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Penalidad por incumplimiento</label>
          <input type="text" id="__ndaPenalidad" placeholder="₡500,000 o valor real del daño"
            style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__ndaPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateNDA()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🔒 Generar NDA</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __generateNDA() {
  const g = id => document.getElementById(id)?.value?.trim()||'';
  const div_    = g('__ndaDiv'); const divCed = g('__ndaDivCedula');
  const rec     = g('__ndaRec'); const recCed = g('__ndaRecCedula');
  const info    = g('__ndaInfo'); const prop  = g('__ndaProposito');
  const vigencia= g('__ndaVigencia')||'2 años';
  const penal   = g('__ndaPenalidad')||'el valor real de los daños y perjuicios causados';
  const fecha   = new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});

  if (!div_||!rec||!info) { showToast('Completá los campos obligatorios *'); return; }

  const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase">ACUERDO DE CONFIDENCIALIDAD</div>
      <div style="font-size:11pt;font-style:italic">(Non-Disclosure Agreement — NDA)</div>
      <div style="font-size:10pt;color:#888;margin-top:4px">Ley N° 7975 de Información No Divulgada · República de Costa Rica</div>
    </div>

    <p style="text-align:justify">Entre <strong>${div_}</strong>${divCed?`, cédula/cédula jurídica ${divCed}`:''}, en adelante <em>"LA PARTE DIVULGADORA"</em>; y <strong>${rec}</strong>${recCed?`, cédula/cédula jurídica ${recCed}`:''}, en adelante <em>"LA PARTE RECEPTORA"</em>; se suscribe el presente Acuerdo de Confidencialidad al tenor de las siguientes cláusulas:</p>

    <p><strong>PRIMERA (Objeto):</strong> El presente acuerdo tiene como objeto proteger la información confidencial que LA PARTE DIVULGADORA compartirá con LA PARTE RECEPTORA en el marco de: <em>${prop||'las relaciones comerciales entre las partes'}</em>.</p>

    <p><strong>SEGUNDA (Información confidencial):</strong> Se considera información confidencial toda aquella relacionada con: ${info}. Esta información no es de dominio público y tiene valor comercial para LA PARTE DIVULGADORA.</p>

    <p><strong>TERCERA (Obligaciones de la Parte Receptora):</strong> LA PARTE RECEPTORA se obliga a: (a) Mantener absoluta confidencialidad sobre la información recibida; (b) No divulgar, reproducir ni transmitir la información a terceros sin autorización escrita; (c) Utilizar la información únicamente para el propósito establecido en este acuerdo; (d) Implementar medidas de seguridad razonables para proteger la información.</p>

    <p><strong>CUARTA (Excepciones):</strong> Las obligaciones de confidencialidad no aplican cuando la información: (a) Sea de dominio público sin culpa de la Parte Receptora; (b) Sea requerida por orden judicial o autoridad competente; (c) Ya era conocida por la Parte Receptora con anterioridad.</p>

    <p><strong>QUINTA (Vigencia):</strong> Este acuerdo tendrá una vigencia de <strong>${vigencia}</strong> a partir de la fecha de firma.</p>

    <p><strong>SEXTA (Penalidades):</strong> El incumplimiento de este acuerdo dará derecho a LA PARTE DIVULGADORA a exigir el pago de ${penal}, sin perjuicio de las acciones penales que correspondan según la Ley N° 7975.</p>

    <p><strong>SÉTIMA (Jurisdicción):</strong> Para la resolución de controversias, las partes se someten expresamente a los Tribunales de Justicia de la República de Costa Rica.</p>

    <p style="text-align:right">San José, Costa Rica, a los ${fecha}.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${div_}</strong><br><small>${divCed}</small><br><small>PARTE DIVULGADORA</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${rec}</strong><br><small>${recCed}</small><br><small>PARTE RECEPTORA</small></div></div>
    </div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__ndaPanel').remove();
  showToast('🔒 NDA generado ✅');
}


/* ═══════════════════════════════════
   FEATURE 5: RECIBO DE DINERO CON TIMBRE FISCAL CR
   ═══════════════════════════════════ */

function openReciboTimbre() {
  const old = document.getElementById('__timbrePanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__timbrePanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';
  const num = String(parseInt(localStorage.getItem('wc-recibo-num')||'0')+1).padStart(5,'0');

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🧾 Recibo con timbre fiscal CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">N° ${num} · Código Fiscal · República de Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[
        ['__tbRecibidor','Yo (quien recibe) *',  'Juan Pérez Rodríguez'],
        ['__tbCedRec',   'Cédula quien recibe',  '1-2345-6789'],
        ['__tbPagador',  'Recibí de (quien paga) *','María García López'],
        ['__tbCedPag',   'Cédula quien paga',    '2-3456-7890'],
        ['__tbMonto',    'Monto (₡ o $) *',       '50000'],
        ['__tbMoneda',   'Moneda',                '₡ Colones costarricenses'],
        ['__tbConcepto', 'En concepto de *',      'Pago por servicios profesionales'],
        ['__tbFormaPago','Forma de pago',         'Transferencia SINPE / Efectivo / Cheque'],
        ['__tbBanco',    'Banco / N° comprobante',''],
      ].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Timbres fiscales</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[['__tbTimbreArch','Timbre de Archivo Nacional (₡20)'],['__tbTimbreBar','Timbre del Colegio de Abogados (₡5)'],['__tbTimbreMun','Timbre Municipal'],['__tbTimbreOtro','Sin timbre fiscal']].map(([id,label],i)=>`
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:7px;border:1.5px solid ${i===0?'#003da5':'#eee'};background:${i===0?'#f0f7ff':'#fafafa'};border-radius:8px;font-size:11px;font-weight:600;color:${i===0?'#003da5':'#555'}">
              <input type="radio" name="__tbTimbre" value="${id}" ${i===0?'checked':''} style="accent-color:#003da5"> ${label}
            </label>`).join('')}
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__timbrePanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateReciboTimbre('${num}')" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🧾 Generar recibo</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __generateReciboTimbre(num) {
  const g       = id => document.getElementById(id)?.value?.trim()||'';
  const recibidor= g('__tbRecibidor'); const cedRec = g('__tbCedRec');
  const pagador  = g('__tbPagador');   const cedPag = g('__tbCedPag');
  const monto    = g('__tbMonto');     const moneda = g('__tbMoneda')||'₡ Colones';
  const concepto = g('__tbConcepto');  const forma  = g('__tbFormaPago');
  const banco    = g('__tbBanco');
  const timbre   = document.querySelector('[name="__tbTimbre"]:checked')?.value||'__tbTimbreArch';
  const fecha    = new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});
  const hora     = new Date().toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'});

  if (!recibidor||!pagador||!monto||!concepto) { showToast('Completá los campos obligatorios *'); return; }
  localStorage.setItem('wc-recibo-num', String(parseInt(num)));

  // Convertir monto a letras (básico)
  const montoNum = parseFloat(monto.replace(/[^\d.]/g,''))||0;
  const fmt      = '₡'+montoNum.toLocaleString('es-CR',{minimumFractionDigits:2});

  const timbreLabels = {
    __tbTimbreArch:'Timbre del Archivo Nacional: ₡20,00',
    __tbTimbreBar: 'Timbre del Colegio de Abogados: ₡5,00',
    __tbTimbreMun: 'Timbre Municipal: según tarifa',
    __tbTimbreOtro:'Exento de timbre fiscal'
  };

  const html=`
  <div style="font-family:Calibri,Arial,sans-serif;border:2px solid #1a2942;border-radius:10px;overflow:hidden;max-width:520px;margin:12px auto">
    <!-- Header -->
    <div style="background:#1a2942;color:#fff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:16pt;font-weight:900;letter-spacing:1px">RECIBO</div>
        <div style="font-size:9pt;opacity:.7">N° ${num}</div>
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
        <tr><td style="padding:5px 0;color:#888;width:40%">Recibí de:</td><td style="padding:5px 0;font-weight:600"><strong>${pagador}</strong>${cedPag?` · Cédula ${cedPag}`:''}</td></tr>
        <tr><td style="padding:5px 0;color:#888">Concepto:</td><td style="padding:5px 0">${concepto}</td></tr>
        ${forma?`<tr><td style="padding:5px 0;color:#888">Forma de pago:</td><td style="padding:5px 0">${forma}</td></tr>`:''}
        ${banco?`<tr><td style="padding:5px 0;color:#888">Comprobante:</td><td style="padding:5px 0">${banco}</td></tr>`:''}
      </table>
    </div>

    <!-- Timbre fiscal -->
    <div style="padding:8px 18px;background:#fffbf0;border-top:1px dashed #f39c12;border-bottom:1px dashed #f39c12;font-size:9pt;color:#856404">
      📮 <strong>${timbreLabels[timbre]||timbreLabels.__tbTimbreArch}</strong>
    </div>

    <!-- Firma -->
    <div style="padding:14px 18px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px;font-size:10pt"><strong>${recibidor}</strong><br><small>${cedRec?`Cédula ${cedRec}`:''}</small><br><small>QUIEN RECIBE</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:6px;font-size:10pt"><strong>${pagador}</strong><br><small>${cedPag?`Cédula ${cedPag}`:''}</small><br><small>QUIEN PAGA</small></div></div>
    </div>

    <div style="padding:6px 18px;background:#f8f9fa;font-size:8pt;color:#aaa;text-align:center">WC Corporate Editor · Costa Rica · Este recibo tiene validez legal con las firmas correspondientes</div>
  </div>`;

  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__timbrePanel').remove();
  showToast(`🧾 Recibo N° ${num} generado ✅`);
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2533() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'actaReunion':      openActaReunion();       break;
          case 'cartaPoder':       openCartaPoder();        break;
          case 'declaracionJurada':openDeclaracionJurada(); break;
          case 'ndaContract':      openNDA();               break;
          case 'reciboTimbre':     openReciboTimbre();      break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.33 ✅ — Actas, Carta Poder, Dec. Jurada, NDA, Recibo Timbre CR');
  }, 4100);
})();
