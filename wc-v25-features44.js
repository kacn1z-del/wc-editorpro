/* ═══════════════════════════════════════════════════════════════
   WC CORPORATE EDITOR v25.44 — 5 FEATURES COSTA RICA
   6. Generador de facturas electrónicas CR (Hacienda 4.3)
   7. Calculadora de liquidación laboral CR
   8. Contrato de arrendamiento CR
   9. Estatutos de sociedad anónima CR
   10. Plantilla de licitación pública CR
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════
   FEATURE 6: FACTURA ELECTRÓNICA CR
   ═══════════════════════════════════ */

function openFacturaElectronica() {
  const old = document.getElementById('__fePanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__fePanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const num = String(parseInt(localStorage.getItem('wc-fe-num')||'0')+1).padStart(10,'0');
  const hoy = new Date().toISOString().split('T')[0];

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#ce1126,#003da5);color:#fff;padding:14px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:15px;font-weight:700">🧾 Factura Electrónica CR</div>
      <div style="font-size:11px;opacity:.8">Esquema XML v4.3 · Ministerio de Hacienda · Costa Rica</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">EMISOR</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${[['__feEmisorNombre','Nombre del emisor *','Mi Empresa S.A.'],['__feEmisorCedula','Cédula jurídica *','3-101-123456'],['__feEmisorTel','Teléfono','2222-3333'],['__feEmisorEmail','Correo electrónico','facturacion@empresa.cr'],['__feEmisorDireccion','Dirección','San José, Costa Rica',''],['__feEmisorActividad','Actividad económica','Venta de servicios profesionales']].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#ce1126'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join('')}
      </div>

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">RECEPTOR</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${[['__feRecNombre','Nombre del receptor *','Cliente XYZ'],['__feRecCedula','Cédula / Pasaporte','1-2345-6789'],['__feRecEmail','Correo receptor','cliente@email.cr']].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join('')}
      </div>

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">DETALLES DE LA FACTURA</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Número de factura</label><input type="text" id="__feNum" value="${num}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Fecha</label><input type="date" id="__feFecha" value="${hoy}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Condición de venta</label>
          <select id="__feCondicion" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="01">01 - Contado</option><option value="02">02 - Crédito</option><option value="03">03 - Consignación</option>
          </select>
        </div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Medio de pago</label>
          <select id="__feMedio" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="01">01 - Efectivo</option><option value="02">02 - Tarjeta</option><option value="04">04 - Transferencia</option><option value="05">05 - SINPE</option>
          </select>
        </div>
      </div>

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:6px">LÍNEAS DE DETALLE</div>
      <div style="display:grid;grid-template-columns:3fr 1fr 1fr auto;gap:5px;margin-bottom:6px">
        <input type="text" id="__feLineDesc" placeholder="Descripción del servicio/producto" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none;box-sizing:border-box">
        <input type="number" id="__feLineCant" placeholder="Cant" value="1" min="1" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none">
        <input type="number" id="__feLinePrice" placeholder="Precio ₡" min="0" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none">
        <button onclick="__feAddLine()" style="padding:7px 10px;border:none;background:#003da5;color:#fff;border-radius:7px;cursor:pointer;font-size:13px">+</button>
      </div>
      <select id="__feLineIVA" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none;margin-bottom:8px">
        <option value="13">IVA 13% — General</option><option value="4">IVA 4% — Medicina</option>
        <option value="2">IVA 2% — Canasta básica</option><option value="1">IVA 1% — Seguros</option><option value="0">Exento 0%</option>
      </select>
      <div id="__feLines" style="max-height:120px;overflow-y:auto;margin-bottom:8px"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__fePanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateFE('html','${num}')" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">🧾 Generar factura</button>
      <button onclick="__generateFE('xml','${num}')" style="flex:1;padding:10px;border:1.5px solid #ce1126;background:#fff;color:#ce1126;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600">⬇ XML</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
  window.__feLineas = [];
}

function __feAddLine() {
  const desc  = document.getElementById('__feLineDesc')?.value.trim();
  const cant  = parseFloat(document.getElementById('__feLineCant')?.value)||1;
  const price = parseFloat(document.getElementById('__feLinePrice')?.value)||0;
  const iva   = parseInt(document.getElementById('__feLineIVA')?.value)||13;
  if (!desc||!price) { showToast('Ingresá descripción y precio'); return; }
  if (!window.__feLineas) window.__feLineas=[];
  const sub   = cant*price;
  const ivaM  = sub*iva/100;
  window.__feLineas.push({desc,cant,price,iva,sub,ivaM,total:sub+ivaM});
  document.getElementById('__feLineDesc').value='';
  document.getElementById('__feLinePrice').value='';
  __feRenderLines();
}

function __feRenderLines() {
  const box  = document.getElementById('__feLines');
  const lines= window.__feLineas||[];
  const fmt  = n=>'₡'+Math.round(n).toLocaleString('es-CR');
  if (!box) return;
  const subTotal= lines.reduce((s,l)=>s+l.sub,0);
  const ivaTotal= lines.reduce((s,l)=>s+l.ivaM,0);
  box.innerHTML = lines.map((l,i)=>`
    <div style="display:flex;gap:6px;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:11px;align-items:center">
      <div style="flex:2;color:#333">${l.desc} (×${l.cant})</div>
      <div style="color:#888">IVA ${l.iva}%</div>
      <div style="font-weight:600;color:#003da5">${fmt(l.total)}</div>
      <button onclick="window.__feLineas.splice(${i},1);__feRenderLines()" style="background:none;border:none;color:#e74c3c;cursor:pointer">×</button>
    </div>`).join('')
  + (lines.length?`<div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;font-size:12px;border-top:2px solid #003da5;margin-top:4px"><span>TOTAL</span><span style="color:#003da5">${fmt(subTotal+ivaTotal)}</span></div>`:'');
  window.__feTotals={subTotal,ivaTotal,total:subTotal+ivaTotal};
}

function __generateFE(type, num) {
  const lines = window.__feLineas||[];
  if (!lines.length) { showToast('Agregá al menos una línea'); return; }
  const g   = id=>document.getElementById(id)?.value?.trim()||'';
  const fmt = n=>'₡'+Math.round(n).toLocaleString('es-CR');
  const t   = window.__feTotals||{};
  const fecha = new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});
  localStorage.setItem('wc-fe-num', String(parseInt(num)));

  if (type==='xml') {
    const xml=`<?xml version="1.0" encoding="UTF-8"?>
<FacturaElectronica xmlns="https://tribunet.hacienda.go.cr/docs/esquemas/2017/v4.3/facturaElectronica" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Clave>506${new Date().toISOString().replace(/[-T:.Z]/g,'').slice(0,14)}${g('__feEmisorCedula').replace(/-/g,'')}1${num}1</Clave>
  <NumeroConsecutivo>${num}</NumeroConsecutivo>
  <FechaEmision>${new Date().toISOString()}</FechaEmision>
  <Emisor>
    <Nombre>${g('__feEmisorNombre')}</Nombre>
    <Identificacion><Tipo>02</Tipo><Numero>${g('__feEmisorCedula').replace(/-/g,'')}</Numero></Identificacion>
    <Telefono><NumTelefono>${g('__feEmisorTel').replace(/-/g,'')}</NumTelefono></Telefono>
    <CorreoElectronico>${g('__feEmisorEmail')}</CorreoElectronico>
    <Ubicacion><Provincia>1</Provincia><Canton>01</Canton><Distrito>01</Distrito></Ubicacion>
  </Emisor>
  <Receptor>
    <Nombre>${g('__feRecNombre')}</Nombre>
    <Identificacion><Tipo>01</Tipo><Numero>${g('__feRecCedula').replace(/-/g,'')}</Numero></Identificacion>
    <CorreoElectronico>${g('__feRecEmail')}</CorreoElectronico>
  </Receptor>
  <CondicionVenta>${g('__feCondicion')}</CondicionVenta>
  <MedioPago>${g('__feMedio')}</MedioPago>
  <DetalleServicio>
    ${lines.map((l,i)=>`<LineaDetalle>
      <NumeroLinea>${i+1}</NumeroLinea>
      <Cantidad>${l.cant}</Cantidad>
      <UnidadMedida>Sp</UnidadMedida>
      <Detalle>${l.desc}</Detalle>
      <PrecioUnitario>${l.price.toFixed(2)}</PrecioUnitario>
      <MontoTotal>${l.sub.toFixed(2)}</MontoTotal>
      <Impuesto><Codigo>01</Codigo><CodigoTarifa>0${l.iva===13?'8':l.iva===4?'4':l.iva===2?'2':'1'}</CodigoTarifa><Tarifa>${l.iva}</Tarifa><Monto>${l.ivaM.toFixed(2)}</Monto></Impuesto>
      <MontoTotalLinea>${l.total.toFixed(2)}</MontoTotalLinea>
    </LineaDetalle>`).join('')}
  </DetalleServicio>
  <ResumenFactura>
    <CodigoTipoMoneda><CodigoMoneda>CRC</CodigoMoneda><TipoCambio>1</TipoCambio></CodigoTipoMoneda>
    <TotalGravado>${t.subTotal?.toFixed(2)||'0'}</TotalGravado>
    <TotalImpuesto>${t.ivaTotal?.toFixed(2)||'0'}</TotalImpuesto>
    <TotalComprobante>${t.total?.toFixed(2)||'0'}</TotalComprobante>
  </ResumenFactura>
</FacturaElectronica>`;
    const blob=new Blob([xml],{type:'application/xml'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`FE-${num}.xml`;
    a.click();
    document.getElementById('__fePanel').remove();
    showToast('⬇️ XML Factura Electrónica descargado ✅');
    return;
  }

  const html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:580px;margin:12px auto;border:2px solid #003da5;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#ce1126,#003da5);color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-size:18pt;font-weight:900">FACTURA ELECTRÓNICA</div><div style="font-size:9pt;opacity:.8">N° ${num} · Esquema v4.3 · Hacienda CR</div></div>
      <div style="text-align:right;font-size:9pt;opacity:.85"><div>${fecha}</div><div>🇨🇷 República de Costa Rica</div></div>
    </div>
    <div style="padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;border-bottom:1px solid #eee;font-size:10pt">
      <div><div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:3px">EMISOR:</div><div style="font-weight:700">${g('__feEmisorNombre')}</div><div style="color:#555">Cédula: ${g('__feEmisorCedula')}</div><div style="color:#555">${g('__feEmisorEmail')}</div></div>
      <div><div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:3px">RECEPTOR:</div><div style="font-weight:700">${g('__feRecNombre')}</div><div style="color:#555">Cédula: ${g('__feRecCedula')}</div><div style="color:#555">${g('__feRecEmail')}</div></div>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0f7ff"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Descripción</th><th style="padding:7px 10px;border:1px solid #ddd">Cant</th><th style="padding:7px 10px;border:1px solid #ddd">Precio</th><th style="padding:7px 10px;border:1px solid #ddd">IVA</th><th style="padding:7px 10px;border:1px solid #ddd">Total</th></tr>
      ${lines.map((l,i)=>`<tr style="${i%2?'background:#fafafa':''}"><td style="padding:6px 10px;border:1px solid #ddd">${l.desc}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${l.cant}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${fmt(l.price)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${l.iva}%</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(l.total)}</td></tr>`).join('')}
      <tr style="background:#f8f9fa"><td colspan="4" style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#888">Subtotal</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${fmt(t.subTotal||0)}</td></tr>
      <tr style="background:#f8f9fa"><td colspan="4" style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">IVA</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">${fmt(t.ivaTotal||0)}</td></tr>
      <tr style="background:linear-gradient(135deg,#ce1126,#003da5);color:#fff"><td colspan="4" style="padding:8px 10px;font-weight:700">TOTAL</td><td style="padding:8px 10px;text-align:right;font-weight:700;font-size:13pt">${fmt(t.total||0)}</td></tr>
    </table>
    <div style="padding:8px 16px;font-size:8pt;color:#aaa;text-align:center;background:#f8f9fa">Factura Electrónica generada con WC Corporate Editor · ${g('__feEmisorActividad')||'Costa Rica'} · Este documento es una representación gráfica</div>
  </div>`;

  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__fePanel').remove();
  showToast(`🧾 Factura N° ${num} generada ✅`);
}


/* ═══════════════════════════════════
   FEATURE 7: LIQUIDACIÓN LABORAL CR
   ═══════════════════════════════════ */

function openLiquidacionLaboral() {
  const old = document.getElementById('__liqPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__liqPanel';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML = `
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#e67e22,#f39c12);color:#fff;padding:14px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:15px;font-weight:700">💼 Calculadora de liquidación CR</div>
      <div style="font-size:11px;opacity:.8">Código de Trabajo · Costa Rica</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${[['__liqNombre','Nombre del trabajador *','Juan Pérez'],['__liqSalario','Salario mensual bruto (₡) *','600000'],['__liqIngreso','Fecha de ingreso *','2020-01-15'],['__liqSalida','Fecha de salida *',new Date().toISOString().split('T')[0]]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="${id.includes('fecha')||id.includes('Ingreso')||id.includes('Salida')?'date':'text'}" id="${id}" placeholder="${ph}" oninput="__calcLiq()"
              style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
              onfocus="this.style.borderColor='#e67e22'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join('')}
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Tipo de cese</label>
          <select id="__liqTipo" onchange="__calcLiq()" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="despido">Despido sin causa justificada</option>
            <option value="renuncia">Renuncia voluntaria</option>
            <option value="mutual">Mutuo acuerdo</option>
            <option value="caducidad">Caducidad del contrato</option>
          </select>
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Días de preaviso dados</label>
          <input type="number" id="__liqPreaviso" value="0" min="0" oninput="__calcLiq()" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Vacaciones pendientes (días)</label>
          <input type="number" id="__liqVacaciones" value="0" min="0" oninput="__calcLiq()" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>
      <div id="__liqResult" style="display:none"></div>
    </div>
    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__liqPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__calcLiq()" style="flex:1;padding:10px;border:1.5px solid #e67e22;background:#fff;color:#e67e22;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">🧮 Calcular</button>
      <button onclick="__insertLiqReport()" style="flex:2;padding:10px;border:none;background:#e67e22;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">💼 Insertar</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __calcLiq() {
  const g = id=>document.getElementById(id)?.value?.trim()||'';
  const salario   = parseFloat(g('__liqSalario'))||0;
  const ingreso   = new Date(g('__liqIngreso'));
  const salida    = new Date(g('__liqSalida'));
  const tipo      = g('__liqTipo');
  const vacDias   = parseFloat(g('__liqVacaciones'))||0;
  const preavDias = parseFloat(g('__liqPreaviso'))||0;
  const res       = document.getElementById('__liqResult');
  if (!salario||!g('__liqIngreso')||!g('__liqSalida')||!res) return;

  const diasTotal = Math.max(0,(salida-ingreso)/(1000*60*60*24));
  const años      = diasTotal/365;
  const fmt       = n=>'₡'+Math.round(n).toLocaleString('es-CR');

  // Cálculos según Código de Trabajo CR
  const salarioDia  = salario/30;
  const salarioSem  = salario/7 * (7/30*30/4.33); // Aproximación

  // Preaviso: según años (Art. 28 CT)
  let preависoLegal = 0;
  if (años < 0.25)    preависoLegal = 7;
  else if (años < 0.5) preависoLegal = 14;
  else if (años < 1)   preависoLegal = 21;
  else                  preависoLegal = 30; // Máximo legal
  const preависoPend = Math.max(0, preависoLegal - preavDias);
  const montoPreaviso = tipo==='despido' ? salarioDia * preависoPend : (tipo==='renuncia'? salarioDia * preависoPend : 0);

  // Cesantía: 19.5 días por año (máxima = 8 años) Art. 29 CT
  let montoCesantia = 0;
  if (tipo==='despido'||tipo==='mutual') {
    const diasCesantia = Math.min(años, 8) * 19.5;
    montoCesantia = salarioDia * diasCesantia;
  }

  // Vacaciones proporcionales (2% salario por mes trabajado ≈ 1 día cada 50)
  const vacPropDias  = Math.floor(diasTotal/50) - vacDias;
  const montoVac     = Math.max(0, vacPropDias) * salarioDia;
  const montoVacPend = vacDias * salarioDia;

  // Aguinaldo proporcional (1/12 del salario anual por mes trabajado en período)
  const mesesPeriodo = ((salida.getMonth()+1) - 12 + 12) % 12 || 1; // Meses desde dic anterior
  const montoAguinaldo = salario * Math.min(mesesPeriodo, 12) / 12;

  const total = montoPreaviso + montoCesantia + montoVac + montoVacPend + montoAguinaldo;
  window.__liqData = {
    nombre:g('__liqNombre'), salario, diasTotal:Math.round(diasTotal), años:años.toFixed(2),
    tipo, preависoLegal, preависoPend, montoPreaviso, montoCesantia,
    vacPropDias:Math.max(0,vacPropDias), montoVac, vacDias, montoVacPend,
    montoAguinaldo, total
  };

  res.style.display='block';
  res.innerHTML=`
    <div style="background:#fff9e6;border-radius:12px;padding:14px;margin-bottom:10px">
      <div style="font-size:12px;font-weight:700;color:#e67e22;margin-bottom:10px">💼 Liquidación · ${g('__liqNombre')||'Trabajador'} · ${años.toFixed(2)} años</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11pt">
        ${montoPreaviso?`<div style="display:flex;justify-content:space-between"><span>Preaviso (${preависoPend} días)</span><span style="font-weight:600">${fmt(montoPreaviso)}</span></div>`:''}
        ${montoCesantia?`<div style="display:flex;justify-content:space-between"><span>Cesantía (${(Math.min(años,8)*19.5).toFixed(1)} días)</span><span style="font-weight:600">${fmt(montoCesantia)}</span></div>`:''}
        ${montoVac?`<div style="display:flex;justify-content:space-between"><span>Vacaciones proporcionales (${Math.max(0,vacPropDias)} días)</span><span style="font-weight:600">${fmt(montoVac)}</span></div>`:''}
        ${montoVacPend?`<div style="display:flex;justify-content:space-between"><span>Vacaciones pendientes (${vacDias} días)</span><span style="font-weight:600">${fmt(montoVacPend)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between"><span>Aguinaldo proporcional</span><span style="font-weight:600">${fmt(montoAguinaldo)}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13pt;color:#e67e22;border-top:2px solid #e67e22;padding-top:6px;margin-top:4px"><span>TOTAL LIQUIDACIÓN</span><span>${fmt(total)}</span></div>
      </div>
      <div style="font-size:9px;color:#aaa;margin-top:8px">Calculado según Código de Trabajo CR · Solo referencial · Consultá con un abogado laboral</div>
    </div>`;
}

function __insertLiqReport() {
  const d = window.__liqData;
  if (!d) { showToast('Calculá primero'); return; }
  const fmt = n=>'₡'+Math.round(n).toLocaleString('es-CR');
  const fecha = new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});
  const tipoLabel = {despido:'Despido sin causa justificada',renuncia:'Renuncia voluntaria',mutual:'Mutuo acuerdo',caducidad:'Caducidad del contrato'}[d.tipo];

  const html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #e67e22;border-radius:10px;overflow:hidden;max-width:500px;margin:12px auto">
    <div style="background:#e67e22;color:#fff;padding:10px 16px;font-weight:700">💼 LIQUIDACIÓN LABORAL · ${fecha}</div>
    <div style="padding:12px 16px;font-size:10pt">
      <p><strong>Trabajador:</strong> ${d.nombre} · <strong>Motivo:</strong> ${tipoLabel}</p>
      <p><strong>Tiempo laborado:</strong> ${d.años} años (${d.diasTotal} días) · <strong>Salario mensual:</strong> ${fmt(d.salario)}</p>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      ${[['Preaviso',d.montoPreaviso],['Cesantía',d.montoCesantia],['Vacaciones proporcionales',d.montoVac],['Vacaciones pendientes',d.montoVacPend],['Aguinaldo proporcional',d.montoAguinaldo]].filter(([,v])=>v>0).map(([l,v],i)=>`<tr style="${i%2?'background:#fafafa':''}"><td style="padding:6px 10px;border:1px solid #ddd">${l}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(v)}</td></tr>`).join('')}
      <tr style="background:#e67e22;color:#fff"><td style="padding:8px 10px;font-weight:700">TOTAL LIQUIDACIÓN</td><td style="padding:8px 10px;text-align:right;font-weight:700;font-size:13pt">${fmt(d.total)}</td></tr>
    </table>
    <div style="padding:8px 16px;font-size:8pt;color:#aaa;text-align:center">Código de Trabajo CR · Solo referencial · WC Corporate Editor</div>
  </div>`;
  if(typeof insertHTML==='function') insertHTML(html);
  document.getElementById('__liqPanel').remove();
  showToast('💼 Liquidación insertada ✅');
}


/* ═══════════════════════════════════
   FEATURE 8: CONTRATO DE ARRENDAMIENTO CR
   ═══════════════════════════════════ */

function openContratoArrendamiento() {
  const old = document.getElementById('__arrPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__arrPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🏠 Contrato de arrendamiento CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Ley General de Arrendamientos Urbanos y Suburbanos N° 7527</div>

    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5">ARRENDANTE (Propietario)</div>
      ${[['__arrPropNombre','Nombre completo *','Juan Pérez Rodríguez'],['__arrPropCedula','Cédula *','1-2345-6789'],['__arrPropTel','Teléfono','8888-1234']].map(([id,l,ph])=>`<div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label><input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join('')}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px">ARRENDATARIO (Inquilino)</div>
      ${[['__arrInqNombre','Nombre completo *','María García López'],['__arrInqCedula','Cédula *','2-3456-7890'],['__arrInqTel','Teléfono','8888-5678']].map(([id,l,ph])=>`<div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label><input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join('')}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px">INMUEBLE Y CONDICIONES</div>
      ${[['__arrDireccion','Dirección exacta del inmueble *','Barrio Los Yoses, San José, frente al parque, casa #123'],['__arrUso','Uso del inmueble','Habitacional / Comercial / Mixto'],['__arrMonto','Monto mensual del alquiler (₡) *','250000'],['__arrDeposito','Depósito de garantía (₡)','500000'],['__arrInicio','Fecha de inicio del contrato *',new Date().toISOString().split('T')[0]],['__arrPlazo','Plazo del contrato','1 año (prorrogable automáticamente)'],['__arrPago','Día de pago mensual','1° de cada mes']].map(([id,l,ph])=>`<div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label><input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join('')}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__arrPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateArrendamiento()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🏠 Generar contrato</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __generateArrendamiento() {
  const g = id=>document.getElementById(id)?.value?.trim()||'';
  const propNombre=g('__arrPropNombre'),propCed=g('__arrPropCedula');
  const inqNombre =g('__arrInqNombre'), inqCed =g('__arrInqCedula');
  const dir=g('__arrDireccion'),uso=g('__arrUso')||'Habitacional';
  const monto=parseInt(g('__arrMonto').replace(/\D/g,''))||0;
  const deposito=parseInt(g('__arrDeposito').replace(/\D/g,''))||monto*2;
  const inicio=g('__arrInicio'),plazo=g('__arrPlazo')||'1 año';
  const pago=g('__arrPago')||'1° de cada mes';
  const fmt=n=>'₡'+n.toLocaleString('es-CR');
  const fecha=new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});

  if (!propNombre||!inqNombre||!dir||!monto) { showToast('Completá los campos obligatorios *'); return; }

  const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <h2 style="font-size:14pt;font-weight:900;text-transform:uppercase;color:#1a2942">CONTRATO DE ARRENDAMIENTO</h2>
      <div style="font-size:10pt;color:#888">Ley N° 7527 · República de Costa Rica</div>
    </div>

    <p style="text-align:justify">Entre <strong>${propNombre}</strong>, cédula <strong>${propCed}</strong>, en adelante <em>"EL ARRENDANTE"</em>; y <strong>${inqNombre}</strong>, cédula <strong>${inqCed}</strong>, en adelante <em>"EL ARRENDATARIO"</em>, se suscribe el presente contrato de arrendamiento bajo las siguientes cláusulas:</p>

    <p><strong>PRIMERA (Objeto):</strong> El arrendante da en arrendamiento al arrendatario el inmueble ubicado en: <strong>${dir}</strong>, para uso <strong>${uso}</strong>.</p>

    <p><strong>SEGUNDA (Plazo):</strong> El presente contrato tendrá una vigencia de <strong>${plazo}</strong> a partir del <strong>${inicio}</strong>, prorrogándose automáticamente salvo que alguna de las partes notifique su deseo de no renovarlo con al menos tres meses de anticipación.</p>

    <p><strong>TERCERA (Precio):</strong> El canon mensual de arrendamiento es de <strong>${fmt(monto)}</strong> (${monto.toLocaleString('es-CR')} colones exactos), pagadero el <strong>${pago}</strong>, mediante depósito bancario o SINPE Móvil a la cuenta indicada por el arrendante.</p>

    <p><strong>CUARTA (Depósito de garantía):</strong> El arrendatario entrega en este acto la suma de <strong>${fmt(deposito)}</strong> como depósito de garantía, el cual será devuelto al finalizar el contrato descontando daños si los hubiere, conforme al artículo 74 de la Ley N° 7527.</p>

    <p><strong>QUINTA (Servicios públicos):</strong> Los servicios de electricidad, agua, teléfono, cable e internet correrán por cuenta del arrendatario, salvo pacto en contrario.</p>

    <p><strong>SEXTA (Mantenimiento):</strong> El arrendatario se compromete a mantener el inmueble en buenas condiciones, realizar reparaciones menores y notificar al arrendante sobre daños mayores.</p>

    <p><strong>SÉTIMA (Prohibiciones):</strong> Queda expresamente prohibido subarrendar, realizar modificaciones estructurales sin autorización escrita, y cambiar el uso del inmueble establecido en este contrato.</p>

    <p><strong>OCTAVA (Desahucio):</strong> En caso de incumplimiento en el pago por más de un mes, el arrendante podrá iniciar proceso de desahucio conforme a los artículos 93 y siguientes de la Ley N° 7527.</p>

    <p><strong>NOVENA (Legislación):</strong> El presente contrato se rige por la Ley General de Arrendamientos Urbanos y Suburbanos N° 7527 y el Código Civil de Costa Rica.</p>

    <p style="text-align:right">En San José, Costa Rica, a los ${fecha}.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:50px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${propNombre}</strong><br><small>Cédula ${propCed}</small><br><small>ARRENDANTE</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${inqNombre}</strong><br><small>Cédula ${inqCed}</small><br><small>ARRENDATARIO</small></div></div>
    </div>
  </div>`;

  if(typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__arrPanel').remove();
  showToast('🏠 Contrato de arrendamiento generado ✅');
}


/* ═══════════════════════════════════
   FEATURE 9: ESTATUTOS SOCIEDAD ANÓNIMA CR
   ═══════════════════════════════════ */

function openEstatutosSA() {
  const old = document.getElementById('__saPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__saPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">🏛️ Estatutos Sociedad Anónima CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Código de Comercio · Arts. 102-166 · Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px">
      ${[
        ['__saNombre','Nombre de la sociedad *','ABC Soluciones Empresariales S.A.'],
        ['__saDomicilio','Domicilio social *','San José, Costa Rica'],
        ['__saObjeto','Objeto social *','Desarrollo de software, consultoría empresarial y servicios tecnológicos'],
        ['__saCapital','Capital social (₡) *','100000'],
        ['__saAcciones','Número de acciones *','100'],
        ['__saValorAccion','Valor por acción (₡)','1000'],
        ['__saDuracion','Duración de la sociedad','Indefinida'],
        ['__saPresidente','Presidente de la Junta Directiva *','Lic. Juan Pérez Rodríguez, cédula 1-2345-6789'],
        ['__saSecretario','Secretario/a *','Lic. María García López, cédula 2-3456-7890'],
        ['__saTesorero','Tesorero/a *','Sr. Carlos Mora Jiménez, cédula 3-4567-8901'],
        ['__saFiscal','Fiscal *','Lic. Ana Vargas Solís, cédula 4-5678-9012'],
        ['__saNotario','Notario autorizante','Lic. Roberto Chaves, Notario Público'],
      ].map(([id,l,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__saPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateEstatutosSA()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">🏛️ Generar estatutos</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __generateEstatutosSA() {
  const g = id=>document.getElementById(id)?.value?.trim()||'';
  const nombre=g('__saNombre'),domicilio=g('__saDomicilio'),objeto=g('__saObjeto');
  const capital=parseInt(g('__saCapital').replace(/\D/g,''))||100000;
  const acciones=parseInt(g('__saAcciones'))||100;
  const valorAcc=Math.round(capital/acciones);
  const duracion=g('__saDuracion')||'Indefinida';
  const presidente=g('__saPresidente'),secretario=g('__saSecretario');
  const tesorero=g('__saTesorero'),fiscal=g('__saFiscal'),notario=g('__saNotario');
  const fmt=n=>'₡'+n.toLocaleString('es-CR');
  const fecha=new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});

  if (!nombre||!objeto||!presidente) { showToast('Completá los campos obligatorios *'); return; }

  const articulos=[
    ['DENOMINACIÓN Y NATURALEZA',`La sociedad se denominará <strong>${nombre}</strong>, organizada como Sociedad Anónima conforme al Código de Comercio de la República de Costa Rica.`],
    ['DOMICILIO',`El domicilio social de la compañía es <strong>${domicilio}</strong>, sin perjuicio de establecer sucursales, agencias o representaciones en cualquier lugar del territorio nacional o del extranjero.`],
    ['OBJETO SOCIAL',`El objeto de la sociedad es: <strong>${objeto}</strong>. La sociedad podrá realizar toda clase de actos y contratos relacionados directa o indirectamente con su objeto social.`],
    ['DURACIÓN',`La duración de la sociedad es <strong>${duracion}</strong>, contada a partir de la fecha de su inscripción en el Registro Mercantil.`],
    ['CAPITAL SOCIAL',`El capital social es de <strong>${fmt(capital)}</strong> representado por <strong>${acciones.toLocaleString('es-CR')} acciones</strong> comunes y nominativas de <strong>${fmt(valorAcc)}</strong> cada una, totalmente suscritas y pagadas.`],
    ['ACCIONES',`Las acciones son nominativas, indivisibles y de igual valor. La transmisión de acciones deberá constar en el libro de Registro de Accionistas. Habrá derecho de tanteo a favor de los socios en caso de venta.`],
    ['JUNTA DIRECTIVA',`La sociedad será administrada por una Junta Directiva compuesta de Presidente, Secretario y Tesorero, electos por la Asamblea General de Accionistas por períodos de ${duracion==='Indefinida'?'un año':'el plazo social'}, reelegibles.`],
    ['PRESIDENCIA Y REPRESENTACIÓN',`El Presidente tendrá la representación judicial y extrajudicial de la sociedad con facultades de apoderado generalísimo sin límite de suma. El Presidente electo es: <strong>${presidente}</strong>.`],
    ['SECRETARÍA Y TESORERÍA',`El Secretario llevará las actas y certificará los acuerdos. El Tesorero custodiará los fondos. Secretario: <strong>${secretario}</strong>. Tesorero: <strong>${tesorero}</strong>.`],
    ['FISCALÍA',`La vigilancia de la sociedad estará a cargo de un Fiscal nombrado por la Asamblea General. Fiscal electo: <strong>${fiscal}</strong>.`],
    ['ASAMBLEAS DE ACCIONISTAS',`La Asamblea General Ordinaria se celebrará dentro de los tres meses siguientes al cierre del ejercicio económico. Las Asambleas Extraordinarias se convocarán cuando lo requieran los intereses sociales.`],
    ['EJERCICIO ECONÓMICO Y UTILIDADES',`El ejercicio económico cerrará el 31 de diciembre de cada año. Las utilidades netas se distribuirán conforme lo acuerde la Asamblea General, reservando el 5% para el fondo de reserva legal hasta alcanzar el 10% del capital social.`],
    ['DISOLUCIÓN Y LIQUIDACIÓN',`La sociedad se disolverá por las causas establecidas en el Código de Comercio. En caso de disolución, la liquidación se hará por una Comisión Liquidadora nombrada por la última Asamblea General.`],
  ];

  const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <h2 style="font-size:14pt;font-weight:900;text-transform:uppercase;color:#1a2942">PACTO CONSTITUTIVO Y ESTATUTOS</h2>
      <h3 style="font-size:12pt;font-weight:700">${nombre}</h3>
      <div style="font-size:10pt;color:#888">Sociedad Anónima · Código de Comercio CR · Arts. 102-166</div>
    </div>

    ${articulos.map(([t,c],i)=>`<p><strong>ARTÍCULO ${['PRIMERO','SEGUNDO','TERCERO','CUARTO','QUINTO','SEXTO','SÉTIMO','OCTAVO','NOVENO','DÉCIMO','UNDÉCIMO','DUODÉCIMO','DÉCIMO TERCERO'][i]||`${i+1}`} (${t}):</strong> ${c}</p>`).join('')}

    <p style="text-align:center;margin-top:20px">En ${domicilio}, a los ${fecha}, ante mí, <strong>${notario||'Notario Público'}</strong>, comparecen los socios fundadores y manifiestan su acuerdo con los presentes estatutos, procediendo a firmar.</p>

    <div style="margin-top:40px;text-align:center;font-size:10pt">
      <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:200px">${notario||'Notario Público'}<br><small>Autorizante</small></div>
    </div>
    <div style="margin-top:16px;font-size:9pt;color:#888;text-align:center">Generado con WC Corporate Editor · Solo es un borrador · Debe ser protocolizado ante Notario Público para su inscripción en el Registro Mercantil</div>
  </div>`;

  if(typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__saPanel').remove();
  showToast('🏛️ Estatutos S.A. generados ✅');
}


/* ═══════════════════════════════════
   FEATURE 10: LICITACIÓN PÚBLICA CR
   ═══════════════════════════════════ */

function openLicitacionPublica() {
  const old = document.getElementById('__licitPanel'); if (old) old.remove();
  const ov  = document.createElement('div');
  ov.id = '__licitPanel';
  ov.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px';

  const tipos=[['LN','Licitación Nacional'],['LP','Licitación Pública'],['LC','Licitación por Cotización'],['CD','Contratación Directa'],['PM','Procedimiento de Mínima Cuantía']];

  ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">📋 Licitación pública CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Ley de Contratación Administrativa N° 7494 · SICOP</div>

    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px">
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de procedimiento</label>
        <select id="__licitTipo" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
          ${tipos.map(([v,l])=>`<option value="${v}">${v} — ${l}</option>`).join('')}
        </select>
      </div>
      ${[
        ['__licitNum','Número de licitación *','LN-000001-2025'],
        ['__licitInst','Institución contratante *','Ministerio de Salud'],
        ['__licitProveedor','Nombre del oferente/proveedor *','Empresa Oferente S.A.'],
        ['__licitCedOferente','Cédula Jurídica oferente','3-101-123456'],
        ['__licitObjeto','Objeto de la contratación *','Suministro de equipos médicos para hospitales públicos'],
        ['__licitMonto','Monto estimado del contrato (₡) *','25000000'],
        ['__licitPlazo','Plazo de entrega','30 días hábiles'],
        ['__licitGarantia','Garantía de cumplimiento','5% del monto adjudicado'],
        ['__licitApertura','Fecha y hora de apertura de ofertas','15 de agosto de 2025 a las 10:00 horas'],
        ['__licitContacto','Contacto para consultas','licitaciones@institución.go.cr · 2222-3333'],
      ].map(([id,l,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join('')}
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Requisitos habilitantes (uno por línea)</label>
        <textarea id="__licitRequisitos" rows="3" placeholder="Estar inscrito en SICOP&#10;Tener cédula jurídica vigente&#10;No tener deudas con la CCSS ni Tributación" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__licitPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateLicitacion()" style="flex:2;padding:11px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">📋 Generar cartel</button>
    </div>
  </div>`;

  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{if(e.target===ov)ov.remove();});
}

function __generateLicitacion() {
  const g = id=>document.getElementById(id)?.value?.trim()||'';
  const tipo=document.getElementById('__licitTipo')?.options[document.getElementById('__licitTipo')?.selectedIndex]?.text||'Licitación';
  const num=g('__licitNum'),inst=g('__licitInst'),proveedor=g('__licitProveedor');
  const cedOfer=g('__licitCedOferente'),objeto=g('__licitObjeto');
  const monto=parseInt(g('__licitMonto').replace(/\D/g,''))||0;
  const plazo=g('__licitPlazo'),garantia=g('__licitGarantia');
  const apertura=g('__licitApertura'),contacto=g('__licitContacto');
  const requisitos=g('__licitRequisitos').split('\n').filter(r=>r.trim());
  const fmt=n=>'₡'+n.toLocaleString('es-CR');
  const fecha=new Date().toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'});

  if (!num||!inst||!objeto||!monto) { showToast('Completá los campos obligatorios *'); return; }

  const html=`
  <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="background:#1a2942;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;text-align:center">
      <div style="font-size:10pt;opacity:.7;margin-bottom:4px">REPÚBLICA DE COSTA RICA</div>
      <div style="font-size:16pt;font-weight:900">${inst.toUpperCase()}</div>
      <div style="font-size:12pt;font-weight:600;margin-top:4px">CARTEL DE ${tipo.toUpperCase()}</div>
      <div style="font-size:11pt;opacity:.85">N° ${num}</div>
    </div>
    <div style="border:2px solid #1a2942;border-top:none;padding:20px;border-radius:0 0 8px 8px">
      <p><strong>OBJETO:</strong> ${objeto}</p>
      <p><strong>MONTO ESTIMADO:</strong> ${fmt(monto)} (IVA incluido)</p>
      ${proveedor?`<p><strong>OFERENTE:</strong> ${proveedor}${cedOfer?` · Cédula Jurídica ${cedOfer}`:''}</p>`:''}
      <p><strong>PLAZO DE ENTREGA:</strong> ${plazo||'A convenir'}</p>
      <p><strong>GARANTÍA DE CUMPLIMIENTO:</strong> ${garantia||'5% del monto adjudicado'}</p>
      <p><strong>APERTURA DE OFERTAS:</strong> ${apertura||'A definir'}</p>

      ${requisitos.length?`
      <p><strong>REQUISITOS HABILITANTES:</strong></p>
      <ol>${requisitos.map(r=>`<li>${r}</li>`).join('')}</ol>`:''}

      <p><strong>ESPECIFICACIONES TÉCNICAS:</strong></p>
      <p>[Describir aquí las especificaciones técnicas detalladas del bien o servicio]</p>

      <p><strong>CRITERIOS DE EVALUACIÓN:</strong></p>
      <table style="border-collapse:collapse;width:100%;font-size:11pt">
        <tr style="background:#f0f7ff"><th style="padding:6px 10px;border:1px solid #ddd">Criterio</th><th style="padding:6px 10px;border:1px solid #ddd">Puntaje</th></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd">Precio</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">60 puntos</td></tr>
        <tr style="background:#f8f9fa"><td style="padding:6px 10px;border:1px solid #ddd">Experiencia</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">20 puntos</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd">Calidad técnica</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">20 puntos</td></tr>
      </table>

      <p><strong>INFORMACIÓN Y CONSULTAS:</strong> ${contacto||'Ver plataforma SICOP'}</p>
      <p style="font-size:10pt;color:#888">Todo lo no previsto en este cartel se regirá por la Ley N° 7494, su Reglamento y el ordenamiento jurídico costarricense.</p>
      <p style="text-align:right">${inst}, ${fecha}</p>
    </div>
    <div style="font-size:8pt;color:#aaa;text-align:center;margin-top:4px">Generado con WC Corporate Editor · Este es un borrador · Verificar con SICOP oficial</div>
  </div>`;

  if(typeof insertHTML==='function') insertHTML(html+'<p></p>');
  document.getElementById('__licitPanel').remove();
  showToast('📋 Cartel de licitación generado ✅');
}


/* ═══════════════════════════════════
   INTEGRACIÓN FINAL
   ═══════════════════════════════════ */
(function initV2544() {
  setTimeout(function() {
    const orig = window.handleAction;
    if (typeof orig === 'function') {
      window.handleAction = function(a) {
        switch(a) {
          case 'facturaElectronica':  openFacturaElectronica();    break;
          case 'liquidacionLaboral':  openLiquidacionLaboral();    break;
          case 'contratoArrendamiento': openContratoArrendamiento(); break;
          case 'estatutosSA':         openEstatutosSA();           break;
          case 'licitacionPublica':   openLicitacionPublica();     break;
          default: orig(a);
        }
      };
    }
    console.log('WC Corporate Editor v25.44 ✅ — FE CR, Liquidación, Arrendamiento, SA, Licitación');
  }, 5200);
})();
