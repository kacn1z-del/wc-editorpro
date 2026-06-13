/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.39 — 5 FEATURES DISEÑO Y FORMATO
   16. Editor de encabezado y pie de página visual
   17. Insertar formas y diagramas SVG
   18. Galería de plantillas premium
   19. Modo columnas estilo revista
   20. Fondo de página personalizado
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 16: ENCABEZADO Y PIE DE PÁGINA
   ═══════════════════════════════════ */

const WC_HEADER_FOOTER = {
  config: JSON.parse(localStorage.getItem('wc-hf-config') || 'null') || {
    header: { enabled:false, left:'', center:'', right:'', style:'simple', showLogo:false },
    footer: { enabled:false, left:'', center:'Página {n}', right:'', style:'simple' }
  },

  save() { localStorage.setItem('wc-hf-config', JSON.stringify(this.config)); },

  render() {
    // Eliminar anteriores
    document.getElementById('__wcHeader')?.remove();
    document.getElementById('__wcFooter')?.remove();

    const ed = document.getElementById('editor');
    if (!ed) return;

    if (this.config.header.enabled) {
      const h   = document.createElement('div');
      h.id      = '__wcHeader';
      const cfg = this.config.header;
      h.style.cssText = `border-bottom:${cfg.style==='line'?'2px solid #003da5':'1px solid #eee'};padding:8px 0;margin-bottom:12px;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;font-family:Calibri,Arial,sans-serif;font-size:9pt;color:#555;${cfg.style==='shaded'?'background:#f0f7ff;padding:8px;border-radius:4px':''};`;
      h.innerHTML = `
        <div style="text-align:left">${cfg.left||''}</div>
        <div style="text-align:center;font-weight:600">${cfg.center||''}</div>
        <div style="text-align:right">${cfg.right||''}</div>`;
      ed.insertBefore(h, ed.firstChild);
    }

    if (this.config.footer.enabled) {
      const f   = document.createElement('div');
      f.id      = '__wcFooter';
      const cfg = this.config.footer;
      const pageNum = cfg.center?.replace('{n}','1')||'';
      f.style.cssText = `border-top:${cfg.style==='line'?'2px solid #003da5':'1px solid #eee'};padding:8px 0;margin-top:20px;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;font-family:Calibri,Arial,sans-serif;font-size:9pt;color:#555;${cfg.style==='shaded'?'background:#f8f9fa;padding:8px;border-radius:4px':''}`;
      f.innerHTML = `
        <div style="text-align:left">${cfg.left||''}</div>
        <div style="text-align:center">${pageNum}</div>
        <div style="text-align:right">${cfg.right||''}</div>`;
      ed.appendChild(f);
    }
    this.save();
  }
};

setTimeout(() => { if (WC_HEADER_FOOTER.config.header.enabled || WC_HEADER_FOOTER.config.footer.enabled) WC_HEADER_FOOTER.render(); }, 2000);

function openHeaderFooterEditor() {
  const old = document.getElementById('__hfPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__hfPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';
  const cfg = WC_HEADER_FOOTER.config;

  const buildSection = (type, label, icon) => {
    const c = cfg[type];
    return `
    <div style="background:#f8f9fa;border-radius:12px;padding:14px;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:18px">${icon}</span>
        <div style="font-size:13px;font-weight:700;color:#1a2942;flex:1">${label}</div>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
          <input type="checkbox" id="__hf_${type}_en" ${c.enabled?'checked':''} style="accent-color:#003da5;width:14px;height:14px" onchange="WC_HEADER_FOOTER.config.${type}.enabled=this.checked;WC_HEADER_FOOTER.render()"> Activar
        </label>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px">
        ${['left','center','right'].map((pos,i)=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${['Izquierda','Centro','Derecha'][i]}</label>
            <input type="text" id="__hf_${type}_${pos}" value="${c[pos]||''}" placeholder="${pos==='center'&&type==='footer'?'Página {n}':'...'}"
              style="width:100%;padding:6px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:11px;outline:none;box-sizing:border-box"
              onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
              oninput="WC_HEADER_FOOTER.config.${type}.${pos}=this.value;WC_HEADER_FOOTER.render()">
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <label style="font-size:10px;font-weight:700;color:#555;align-self:center">Estilo:</label>
        ${[['simple','Simple'],['line','Línea'],['shaded','Sombreado']].map(([v,l])=>`
          <button onclick="WC_HEADER_FOOTER.config.${type}.style='${v}';WC_HEADER_FOOTER.render();document.querySelectorAll('.__hf_${type}_style').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fff';});this.style.borderColor='#003da5';this.style.background='#f0f7ff'" class="__hf_${type}_style"
            style="padding:4px 10px;border:1.5px solid ${c.style===v?'#003da5':'#eee'};background:${c.style===v?'#f0f7ff':'#fff'};border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;color:#555;transition:all .15s">
            ${l}
          </button>`).join('')}
        <button onclick="document.getElementById('__hf_${type}_center').value='{fecha}';WC_HEADER_FOOTER.config.${type}.center='{fecha}';WC_HEADER_FOOTER.render()" style="padding:4px 8px;border:1.5px solid #eee;border-radius:6px;cursor:pointer;font-size:10px;color:#555">📅 Fecha</button>
        ${type==='footer'?`<button onclick="document.getElementById('__hf_${type}_center').value='Página {n}';WC_HEADER_FOOTER.config.${type}.center='Página {n}';WC_HEADER_FOOTER.render()" style="padding:4px 8px;border:1.5px solid #eee;border-radius:6px;cursor:pointer;font-size:10px;color:#555"># Página</button>`:''}
      </div>
    </div>`;
  };

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📋 Encabezado y pie de página</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Editor visual · Estilo Word</div>
    ${buildSection('header','Encabezado','⬆️')}
    ${buildSection('footer','Pie de página','⬇️')}
    <button onclick="document.getElementById('__hfPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
}


/* ═══════════════════════════════════
   FEATURE 17: FORMAS Y DIAGRAMAS SVG
   ═══════════════════════════════════ */

function openShapesPanel() {
  const old = document.getElementById('__shapesPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__shapesPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center';

  const shapes = [
    // Formas básicas
    { name:'Rectángulo',  cat:'Básico', svg:(c,s)=>`<rect x="10" y="20" width="180" height="60" rx="4" fill="${c}" stroke="${s}" stroke-width="2"/>` },
    { name:'Círculo',     cat:'Básico', svg:(c,s)=>`<circle cx="100" cy="50" r="40" fill="${c}" stroke="${s}" stroke-width="2"/>` },
    { name:'Triángulo',   cat:'Básico', svg:(c,s)=>`<polygon points="100,10 10,90 190,90" fill="${c}" stroke="${s}" stroke-width="2"/>` },
    { name:'Diamante',    cat:'Básico', svg:(c,s)=>`<polygon points="100,10 190,50 100,90 10,50" fill="${c}" stroke="${s}" stroke-width="2"/>` },
    { name:'Estrella',    cat:'Básico', svg:(c,s)=>`<polygon points="100,10 120,40 155,40 130,60 140,90 100,70 60,90 70,60 45,40 80,40" fill="${c}" stroke="${s}" stroke-width="2"/>` },
    { name:'Flecha →',    cat:'Básico', svg:(c,s)=>`<polygon points="10,35 140,35 140,20 190,50 140,80 140,65 10,65" fill="${c}" stroke="${s}" stroke-width="2"/>` },
    // Diagramas
    { name:'Proceso',     cat:'Flujo',  svg:(c,s)=>`<rect x="10" y="25" width="80" height="50" rx="4" fill="${c}" stroke="${s}" stroke-width="2"/><text x="50" y="55" text-anchor="middle" font-size="11" fill="${s==='#fff'?'#fff':'#333'}">Inicio</text><line x1="90" y1="50" x2="120" y2="50" stroke="${s}" stroke-width="2" marker-end="url(#arr)"/><rect x="120" y="25" width="80" height="50" rx="4" fill="${c}" stroke="${s}" stroke-width="2"/><text x="160" y="55" text-anchor="middle" font-size="11" fill="${s==='#fff'?'#fff':'#333'}">Proceso</text><defs><marker id="arr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${s}"/></marker></defs>` },
    { name:'Decisión',    cat:'Flujo',  svg:(c,s)=>`<polygon points="100,5 195,50 100,95 5,50" fill="${c}" stroke="${s}" stroke-width="2"/><text x="100" y="55" text-anchor="middle" font-size="11" fill="${s==='#fff'?'#fff':'#333'}">¿Condición?</text>` },
    { name:'Terminator',  cat:'Flujo',  svg:(c,s)=>`<rect x="10" y="25" width="180" height="50" rx="25" fill="${c}" stroke="${s}" stroke-width="2"/><text x="100" y="55" text-anchor="middle" font-size="11" fill="${s==='#fff'?'#fff':'#333'}">FIN</text>` },
    // Callouts
    { name:'Globo',       cat:'Texto',  svg:(c,s)=>`<rect x="5" y="5" width="180" height="65" rx="10" fill="${c}" stroke="${s}" stroke-width="2"/><polygon points="30,70 50,70 40,90" fill="${c}" stroke="${s}" stroke-width="1" stroke-linejoin="round"/>` },
    { name:'Nota',        cat:'Texto',  svg:(c,s)=>`<polygon points="5,5 165,5 195,35 195,95 5,95" fill="${c}" stroke="${s}" stroke-width="2"/><polyline points="165,5 165,35 195,35" fill="none" stroke="${s}" stroke-width="2"/>` },
    { name:'Banner',      cat:'Texto',  svg:(c,s)=>`<polygon points="0,20 200,20 185,50 200,80 0,80 15,50" fill="${c}" stroke="${s}" stroke-width="2"/>` },
  ];

  const cats = [...new Set(shapes.map(s=>s.cat))];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">⬡ Formas y diagramas SVG</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Formas vectoriales escalables</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Color de relleno</label>
          <input type="color" id="__shpFill" value="#003da5" style="width:100%;height:36px;border:1.5px solid #eee;border-radius:8px;cursor:pointer">
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Color de borde</label>
          <input type="color" id="__shpStroke" value="#1a2942" style="width:100%;height:36px;border:1.5px solid #eee;border-radius:8px;cursor:pointer">
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tamaño</label>
          <select id="__shpSize" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="100">Pequeño (100px)</option>
            <option value="200" selected>Mediano (200px)</option>
            <option value="300">Grande (300px)</option>
            <option value="100%">Ancho completo</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Texto (opcional)</label>
          <input type="text" id="__shpText" placeholder="Texto en la forma"
            style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#eee'">
        </div>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 16px">
      ${cats.map(cat=>`
        <div style="margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${cat}</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
            ${shapes.filter(s=>s.cat===cat).map(s=>`
              <button onclick="__shpInsert(${shapes.indexOf(s)})"
                style="padding:8px;border:1.5px solid #eee;background:#fafafa;border-radius:10px;cursor:pointer;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:4px"
                onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'"
                onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
                <svg viewBox="0 0 200 100" width="80" height="40">${s.svg('#003da5','#1a2942')}</svg>
                <span style="font-size:10px;color:#555;font-weight:600">${s.name}</span>
              </button>`).join('')}
          </div>
        </div>`).join('')}
    </div>

    <div style="padding:10px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__shapesPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target===ov) ov.remove(); });
  window.__shapes = shapes;
}

function __shpInsert(idx) {
  const shape  = (window.__shapes||[])[idx];
  if (!shape) return;
  const fill   = document.getElementById('__shpFill')?.value   || '#003da5';
  const stroke = document.getElementById('__shpStroke')?.value || '#1a2942';
  const size   = document.getElementById('__shpSize')?.value   || '200';
  const text   = document.getElementById('__shpText')?.value.trim() || '';
  const w      = size === '100%' ? '100%' : size+'px';
  const h      = size === '100%' ? 'auto' : Math.round(parseInt(size)*0.5)+'px';

  let svgContent = shape.svg(fill, stroke);
  if (text) svgContent += `<text x="100" y="55" text-anchor="middle" font-size="13" font-weight="600" fill="${stroke}" font-family="Calibri,Arial,sans-serif">${text}</text>`;

  const html = `<div style="display:inline-block;margin:8px 4px"><svg viewBox="0 0 200 100" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg></div>`;
  if (typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__shapesPanel').remove();
  showToast(`⬡ ${shape.name} insertado ✅`);
}


/* ═══════════════════════════════════
   FEATURE 18: GALERÍA DE PLANTILLAS PREMIUM
   ═══════════════════════════════════ */

const WC_PREMIUM_TEMPLATES = [
  {
    cat:'Empresarial',
    name:'Informe ejecutivo CR',
    icon:'📊',
    color:'#003da5',
    html: (org,fecha) => `
    <div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <div style="background:linear-gradient(135deg,#003da5,#0084ff);color:#fff;padding:32px 36px;border-radius:0 0 20px 20px;margin-bottom:28px">
        <div style="font-size:9pt;opacity:.7;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">${org||'Empresa'} · ${fecha}</div>
        <h1 style="font-size:26pt;font-weight:900;margin:0 0 6px">INFORME EJECUTIVO</h1>
        <div style="font-size:11pt;opacity:.85">Período: ___________</div>
      </div>
      <h2 style="color:#003da5;font-size:14pt;border-left:4px solid #003da5;padding-left:12px;margin-bottom:10px">Resumen ejecutivo</h2>
      <p style="color:#555;line-height:1.8">Describir aquí los puntos más importantes del período analizado...</p>
      <h2 style="color:#003da5;font-size:14pt;border-left:4px solid #003da5;padding-left:12px;margin-top:20px;margin-bottom:10px">Resultados clave</h2>
      <table style="border-collapse:collapse;width:100%;font-size:11pt">
        <tr style="background:#003da5;color:#fff"><th style="padding:8px 12px;text-align:left">Indicador</th><th style="padding:8px 12px">Meta</th><th style="padding:8px 12px">Real</th><th style="padding:8px 12px">Variación</th></tr>
        <tr><td style="padding:7px 12px;border:1px solid #ddd">KPI 1</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center">100%</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center">95%</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center;color:#e74c3c">-5%</td></tr>
        <tr style="background:#f0f7ff"><td style="padding:7px 12px;border:1px solid #ddd">KPI 2</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center">₡500M</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center">₡520M</td><td style="padding:7px 12px;border:1px solid #ddd;text-align:center;color:#27ae60">+4%</td></tr>
      </table>
      <h2 style="color:#003da5;font-size:14pt;border-left:4px solid #003da5;padding-left:12px;margin-top:20px;margin-bottom:10px">Conclusiones y próximos pasos</h2>
      <p style="color:#555;line-height:1.8">[Conclusiones del período]</p>
    </div>`
  },
  {
    cat:'Académico',
    name:'Tesis UCR/TEC',
    icon:'🎓',
    color:'#003366',
    html: (org,fecha) => `
    <div style="font-family:'Times New Roman',serif;max-width:17cm;margin:0 auto;line-height:1.8">
      <div style="text-align:center;padding:40px 0 30px">
        <p style="font-size:11pt;font-weight:700;text-transform:uppercase">${org||'Universidad de Costa Rica'}</p>
        <p style="font-size:10pt">Facultad de _______________</p>
        <p style="font-size:10pt">Escuela de _______________</p>
        <br><br>
        <h1 style="font-size:16pt;font-weight:700;line-height:1.5">[TÍTULO DE LA TESIS EN MAYÚSCULAS]</h1>
        <br><br>
        <p style="font-size:11pt">Trabajo Final de Graduación sometido a la consideración de la Comisión del Programa de Estudios de Licenciatura en _____________ para optar al grado y título de Licenciatura en _____________</p>
        <br><br>
        <p style="font-size:11pt"><strong>Nombre del estudiante</strong></p>
        <br><br>
        <p style="font-size:11pt">Director: _____________, Ph.D.</p>
        <br><br>
        <p style="font-size:11pt">Ciudad Universitaria Rodrigo Facio, Costa Rica · ${fecha}</p>
      </div>
    </div>`
  },
  {
    cat:'Legal',
    name:'Contrato simple CR',
    icon:'⚖️',
    color:'#1a2942',
    html: (org,fecha) => `
    <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
      <h2 style="text-align:center;font-size:14pt;font-weight:700">CONTRATO</h2>
      <p>Entre <strong>${org||'[PARTE A]'}</strong>, en adelante <em>"EL CONTRATANTE"</em>; y <strong>[PARTE B]</strong>, en adelante <em>"EL CONTRATADO"</em>, se suscribe el presente contrato al tenor de las siguientes cláusulas:</p>
      <p><strong>PRIMERA (Objeto):</strong> [Describir el objeto del contrato]</p>
      <p><strong>SEGUNDA (Obligaciones):</strong> [Describir las obligaciones de cada parte]</p>
      <p><strong>TERCERA (Honorarios/Precio):</strong> El monto acordado es de ₡___________ pagadero en _____________.</p>
      <p><strong>CUARTA (Plazo):</strong> El presente contrato tendrá vigencia del ___ al ___.</p>
      <p><strong>QUINTA (Legislación):</strong> El presente contrato se rige por el ordenamiento jurídico de la República de Costa Rica.</p>
      <p style="text-align:right">San José, Costa Rica, a los ${fecha}.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:50px">
        <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">EL CONTRATANTE</div></div>
        <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px">EL CONTRATADO</div></div>
      </div>
    </div>`
  },
  {
    cat:'Comunicación',
    name:'Carta formal CR',
    icon:'✉️',
    color:'#27ae60',
    html: (org,fecha) => `
    <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
      <div style="text-align:right;margin-bottom:20px">
        <div style="font-weight:700">${org||'Mi Empresa S.A.'}</div>
        <div style="color:#555;font-size:10pt">San José, Costa Rica</div>
        <div style="color:#555;font-size:10pt">${fecha}</div>
      </div>
      <p><strong>Señor/Señora</strong><br>[Nombre del destinatario]<br>[Cargo]<br>[Institución]<br>Presente</p>
      <p><strong>Estimado/a señor/señora:</strong></p>
      <p>Por medio de la presente, [introducir el motivo de la carta].</p>
      <p>[Cuerpo principal de la carta].</p>
      <p>Sin otro particular, me suscribo de usted atentamente,</p>
      <div style="margin-top:40px">
        <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:200px">
          <div style="font-weight:700">[Nombre completo]</div>
          <div style="font-size:10pt;color:#555">[Cargo] · ${org||'Empresa'}</div>
        </div>
      </div>
    </div>`
  },
  {
    cat:'Marketing',
    name:'Propuesta comercial',
    icon:'💼',
    color:'#8e44ad',
    html: (org,fecha) => `
    <div style="font-family:Calibri,Arial,sans-serif;max-width:17cm;margin:0 auto">
      <div style="background:linear-gradient(135deg,#8e44ad,#9b59b6);color:#fff;padding:28px 32px;border-radius:12px;margin-bottom:24px;text-align:center">
        <div style="font-size:10pt;opacity:.7;margin-bottom:6px">${org||'Mi Empresa'} · ${fecha}</div>
        <h1 style="font-size:22pt;font-weight:900;margin:0 0 8px">PROPUESTA COMERCIAL</h1>
        <div style="font-size:11pt;opacity:.85">Preparada especialmente para: [Cliente]</div>
      </div>
      <h2 style="color:#8e44ad;font-size:13pt;margin-bottom:8px">¿Por qué elegirnos?</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px">
        ${['🏆 Experiencia','⚡ Rapidez','🎯 Resultados'].map(item=>`<div style="background:#f8f0ff;border-radius:10px;padding:12px;text-align:center;font-size:11pt;color:#8e44ad;font-weight:600">${item}</div>`).join('')}
      </div>
      <h2 style="color:#8e44ad;font-size:13pt;margin-bottom:8px">Nuestra propuesta</h2>
      <p style="color:#555;line-height:1.8">[Describir el producto o servicio ofrecido]</p>
      <h2 style="color:#8e44ad;font-size:13pt;margin-top:16px;margin-bottom:8px">Inversión</h2>
      <div style="background:#f8f0ff;border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:24pt;font-weight:900;color:#8e44ad">₡___________</div>
        <div style="font-size:10pt;color:#888">Precio especial · IVA incluido</div>
      </div>
    </div>`
  },
  {
    cat:'CR Gobierno',
    name:'Oficio institucional CR',
    icon:'🏛️',
    color:'#ce1126',
    html: (org,fecha) => `
    <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
      <div style="text-align:center;border-bottom:3px double #1a2942;padding-bottom:12px;margin-bottom:20px">
        <div style="font-size:11pt;font-weight:700;text-transform:uppercase">${org||'Nombre de la Institución'}</div>
        <div style="font-size:10pt;color:#555">República de Costa Rica</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:10pt">
        <div><strong>Oficio N°:</strong> ___-${new Date().getFullYear()}</div>
        <div>${fecha}</div>
      </div>
      <p><strong>Señor/Señora</strong><br>[Nombre]<br>[Cargo e institución]<br>Estimado/a señor/señora:</p>
      <p>En atención al oficio _____ de fecha _____, me permito comunicarle que [desarrollar el contenido del oficio].</p>
      <p>Lo anterior en cumplimiento de lo dispuesto en [base legal].</p>
      <p>Atentamente,</p>
      <div style="margin-top:40px;text-align:center">
        <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:220px">
          <strong>[Nombre del funcionario]</strong><br>
          <span style="font-size:10pt">[Cargo]</span>
        </div>
      </div>
    </div>`
  },
];

function openPremiumTemplates() {
  const old = document.getElementById('__premTplPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__premTplPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px';

  const cats = [...new Set(WC_PREMIUM_TEMPLATES.map(t=>t.cat))];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">✨ Plantillas premium</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Documentos profesionales listos para usar</div>
      <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;margin-bottom:12px">
        <button onclick="__premFilter('',this)" class="__premCatBtn" data-sel="1"
          style="padding:5px 12px;border:1.5px solid #1a2942;background:#f0f7ff;color:#1a2942;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0">Todas</button>
        ${cats.map(c=>`<button onclick="__premFilter('${c}',this)" class="__premCatBtn"
          style="padding:5px 12px;border:1.5px solid #eee;background:#fafafa;color:#555;border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0">${c}</button>`).join('')}
      </div>
    </div>

    <div id="__premGrid" style="flex:1;overflow-y:auto;padding:0 20px 16px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${WC_PREMIUM_TEMPLATES.map((t,i)=>`
        <button onclick="__premUse(${i})"
          style="padding:16px;border:2px solid ${t.color}22;background:linear-gradient(135deg,${t.color}10,${t.color}05);border-radius:14px;cursor:pointer;text-align:left;transition:all .15s"
          onmouseover="this.style.borderColor='${t.color}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px ${t.color}33'"
          onmouseout="this.style.borderColor='${t.color}22';this.style.transform='';this.style.boxShadow=''">
          <div style="font-size:24px;margin-bottom:6px">${t.icon}</div>
          <div style="font-size:12px;font-weight:700;color:#1a1a1a;margin-bottom:2px">${t.name}</div>
          <div style="font-size:10px;color:${t.color};font-weight:600">${t.cat}</div>
        </button>`).join('')}
    </div>

    <div style="padding:12px 20px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__premTplPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __premFilter(cat, btn) {
  document.querySelectorAll('.__premCatBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';delete b.dataset.sel;});
  btn.style.borderColor='#1a2942'; btn.style.background='#f0f7ff'; btn.style.color='#1a2942'; btn.dataset.sel='1';
  const grid = document.getElementById('__premGrid');
  if (!grid) return;
  const filtered = cat ? WC_PREMIUM_TEMPLATES.filter(t=>t.cat===cat) : WC_PREMIUM_TEMPLATES;
  grid.innerHTML = filtered.map((t,i)=>{
    const idx = WC_PREMIUM_TEMPLATES.indexOf(t);
    return `<button onclick="__premUse(${idx})" style="padding:16px;border:2px solid ${t.color}22;background:linear-gradient(135deg,${t.color}10,${t.color}05);border-radius:14px;cursor:pointer;text-align:left;transition:all .15s" onmouseover="this.style.borderColor='${t.color}'" onmouseout="this.style.borderColor='${t.color}22'"><div style="font-size:24px;margin-bottom:6px">${t.icon}</div><div style="font-size:12px;font-weight:700;color:#1a1a1a;margin-bottom:2px">${t.name}</div><div style="font-size:10px;color:${t.color};font-weight:600">${t.cat}</div></button>`;
  }).join('');
}

function __premUse(idx) {
  const tpl   = WC_PREMIUM_TEMPLATES[idx];
  if (!tpl) return;
  const org   = prompt('Nombre de tu organización (opcional):', '');
  const fecha = new Date().toLocaleDateString('es-CR', {day:'numeric',month:'long',year:'numeric'});
  const html  = tpl.html(org||'', fecha);
  if (typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__premTplPanel').remove();
  showToast(`✨ Plantilla "${tpl.name}" insertada ✅`);
}


/* ═══════════════════════════════════
   FEATURE 19: MODO COLUMNAS ESTILO REVISTA
   ═══════════════════════════════════ */

const WC_COLUMNS = {
  active: false,
  cols:   2,

  apply(n) {
    this.cols   = n;
    this.active = n > 1;
    const ed    = document.getElementById('editor');
    if (!ed) return;

    if (this.active) {
      ed.style.columnCount = n;
      ed.style.columnGap   = '24px';
      ed.style.columnRule  = '1px solid #e0e0e0';
    } else {
      ed.style.columnCount = '';
      ed.style.columnGap   = '';
      ed.style.columnRule  = '';
    }

    // Actualizar indicador
    const old = document.getElementById('__colIndicator'); if (old) old.remove();
    if (this.active) {
      const ind = document.createElement('div');
      ind.id    = '__colIndicator';
      ind.style.cssText = 'position:fixed;bottom:140px;left:12px;z-index:8000;background:#9b59b6;color:#fff;border-radius:8px;padding:4px 12px;font-size:11px;font-weight:600;font-family:-apple-system,sans-serif;cursor:pointer';
      ind.textContent   = `▥ ${n} columnas`;
      ind.onclick       = () => openColumnsPanel();
      document.body.appendChild(ind);
    }
    showToast(this.active ? `▥ ${n} columnas activadas` : 'Vista de 1 columna restaurada');
  }
};

function openColumnsPanel() {
  const old = document.getElementById('__colsPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__colsPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">▥ Columnas estilo revista</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Diseño editorial multipágina</div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
      ${[1,2,3,4].map(n=>`
        <button onclick="WC_COLUMNS.apply(${n});document.getElementById('__colsPanel').remove()"
          style="padding:14px 8px;border:2px solid ${WC_COLUMNS.cols===n&&WC_COLUMNS.active||(!WC_COLUMNS.active&&n===1)?'#9b59b6':'#eee'};background:${WC_COLUMNS.cols===n&&WC_COLUMNS.active||(!WC_COLUMNS.active&&n===1)?'#f8f0ff':'#fafafa'};border-radius:12px;cursor:pointer;text-align:center;transition:all .15s"
          onmouseover="this.style.borderColor='#9b59b6'" onmouseout="if(!this.classList.contains('sel'))this.style.borderColor='#eee'">
          <div style="display:flex;gap:3px;justify-content:center;margin-bottom:6px">
            ${Array(n).fill(0).map(()=>`<div style="width:${48/n}px;height:32px;background:#9b59b699;border-radius:2px"></div>`).join('')}
          </div>
          <div style="font-size:11px;font-weight:700;color:#555">${n} ${n===1?'columna':'columnas'}</div>
        </button>`).join('')}
    </div>

    <div style="background:#f8f0ff;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#555;line-height:1.7">
      ℹ️ El modo columnas usa CSS <code>column-count</code>. Los títulos H1 ocupan el ancho completo automáticamente.
    </div>

    <button onclick="document.getElementById('__colsPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}


/* ═══════════════════════════════════
   FEATURE 20: FONDO DE PÁGINA PERSONALIZADO
   ═══════════════════════════════════ */

const WC_PAGE_BG = {
  config: JSON.parse(localStorage.getItem('wc-page-bg')||'null') || { type:'none' },

  presets: [
    { name:'Blanco',       type:'solid',    value:'#ffffff' },
    { name:'Crema',        type:'solid',    value:'#fffef5' },
    { name:'Azul suave',   type:'solid',    value:'#f0f7ff' },
    { name:'Verde suave',  type:'solid',    value:'#f0fff4' },
    { name:'Gris papel',   type:'solid',    value:'#f5f5f0' },
    { name:'CR Azul',      type:'gradient', value:'linear-gradient(135deg,#f0f7ff,#e8f4ff)' },
    { name:'CR Verde',     type:'gradient', value:'linear-gradient(135deg,#f0fff4,#e8f8ee)' },
    { name:'Ejecutivo',    type:'gradient', value:'linear-gradient(135deg,#f8f9fa,#f0f0f0)' },
    { name:'Cuadrícula',   type:'pattern',  value:'#f0f0f0', pattern:'grid' },
    { name:'Puntos',       type:'pattern',  value:'#f5f5f5', pattern:'dots' },
    { name:'Líneas',       type:'pattern',  value:'#f8f8f8', pattern:'lines' },
  ],

  apply(preset) {
    this.config = preset;
    const ed = document.getElementById('editor');
    if (!ed) return;

    if (preset.type==='solid') {
      ed.style.background = preset.value;
    } else if (preset.type==='gradient') {
      ed.style.background = preset.value;
    } else if (preset.type==='pattern') {
      const patterns = {
        grid:  `${preset.value} url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23ddd' stroke-width='0.5'/></svg>")`,
        dots:  `${preset.value} url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><circle cx='8' cy='8' r='1' fill='%23ccc'/></svg>")`,
        lines: `${preset.value} url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='24'><line x1='0' y1='24' x2='0' y2='0' stroke='%23e0e0e0' stroke-width='1'/></svg>") repeat-y`,
      };
      ed.style.background = patterns[preset.pattern]||preset.value;
    } else {
      ed.style.background = '#fff';
    }
    localStorage.setItem('wc-page-bg', JSON.stringify(preset));
    showToast(`🎨 Fondo "${preset.name}" aplicado ✅`);
  },

  reset() {
    const ed = document.getElementById('editor');
    if (ed) ed.style.background = '';
    this.config = {type:'none'};
    localStorage.removeItem('wc-page-bg');
    showToast('Fondo reseteado');
  }
};

setTimeout(()=>{ if(WC_PAGE_BG.config.type!=='none') WC_PAGE_BG.apply(WC_PAGE_BG.config); }, 2000);

function openPageBGPanel() {
  const old = document.getElementById('__pageBGPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__pageBGPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;padding:20px;box-shadow:0 -8px 40px rgba(0,0,0,.2)">
    <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 14px"></div>
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🎨 Fondo de página</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Colores, degradados y patrones</div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
      ${WC_PAGE_BG.presets.map((p,i)=>{
        let bg='';
        if(p.type==='solid') bg=p.value;
        else if(p.type==='gradient') bg=p.value;
        else bg=p.value;
        return `
        <button onclick="WC_PAGE_BG.apply(${JSON.stringify(p).replace(/"/g,"'")});document.getElementById('__pageBGPanel').remove()"
          style="padding:12px 6px;border:2px solid #eee;border-radius:12px;cursor:pointer;text-align:center;transition:all .15s;background:${bg}"
          onmouseover="this.style.borderColor='#003da5';this.style.transform='scale(1.05)'"
          onmouseout="this.style.borderColor='#eee';this.style.transform=''">
          <div style="height:32px;border-radius:6px;margin-bottom:6px;background:${bg};border:1px solid rgba(0,0,0,.08)${p.type==='pattern'?';background-image:url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'><circle cx=\'5\' cy=\'5\' r=\'1\' fill=\'%23ccc\'/></svg>")':''}"></div>
          <div style="font-size:10px;font-weight:600;color:#555">${p.name}</div>
        </button>`}).join('')}
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Color personalizado</label>
      <div style="display:flex;gap:8px">
        <input type="color" id="__bgCustomColor" value="#ffffff" style="width:60px;height:40px;border:1.5px solid #eee;border-radius:8px;cursor:pointer">
        <button onclick="WC_PAGE_BG.apply({name:'Personalizado',type:'solid',value:document.getElementById('__bgCustomColor').value});document.getElementById('__pageBGPanel').remove()"
          style="flex:1;padding:10px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">Aplicar color</button>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="WC_PAGE_BG.reset();document.getElementById('__pageBGPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#555">↺ Resetear</button>
      <button onclick="document.getElementById('__pageBGPanel').remove()" style="flex:1;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2539() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'headerFooter':  openHeaderFooterEditor(); break;
          case 'shapesPanel':   openShapesPanel();        break;
          case 'premTemplates': openPremiumTemplates();   break;
          case 'columnsMode':   openColumnsPanel();       break;
          case 'pageBG':        openPageBGPanel();        break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.39 ✅ — Encabezado/Pie, Formas SVG, Plantillas Premium, Columnas, Fondo');
  }, 4700);
})();
