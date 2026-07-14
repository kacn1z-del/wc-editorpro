function openFacturaElectronica(){const old=document.getElementById("__fePanel");old&&old.remove();const ov=document.createElement("div");ov.id="__fePanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const num=String(parseInt(localStorage.getItem("wc-fe-num")||"0")+1).padStart(10,"0"),hoy=new Date().toISOString().split("T")[0];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#ce1126,#003da5);color:#fff;padding:14px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:15px;font-weight:700">\u{1F9FE} Factura Electr\xF3nica CR</div>
      <div style="font-size:11px;opacity:.8">Esquema XML v4.3 \xB7 Ministerio de Hacienda \xB7 Costa Rica</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">EMISOR</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${[["__feEmisorNombre","Nombre del emisor *","Mi Empresa S.A."],["__feEmisorCedula","C\xE9dula jur\xEDdica *","3-101-123456"],["__feEmisorTel","Tel\xE9fono","2222-3333"],["__feEmisorEmail","Correo electr\xF3nico","facturacion@empresa.cr"],["__feEmisorDireccion","Direcci\xF3n","San Jos\xE9, Costa Rica",""],["__feEmisorActividad","Actividad econ\xF3mica","Venta de servicios profesionales"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#ce1126'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join("")}
      </div>

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">RECEPTOR</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
        ${[["__feRecNombre","Nombre del receptor *","Cliente XYZ"],["__feRecCedula","C\xE9dula / Pasaporte","1-2345-6789"],["__feRecEmail","Correo receptor","cliente@email.cr"]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join("")}
      </div>

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:8px">DETALLES DE LA FACTURA</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">N\xFAmero de factura</label><input type="text" id="__feNum" value="${num}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Fecha</label><input type="date" id="__feFecha" value="${hoy}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box"></div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Condici\xF3n de venta</label>
          <select id="__feCondicion" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="01">01 - Contado</option><option value="02">02 - Cr\xE9dito</option><option value="03">03 - Consignaci\xF3n</option>
          </select>
        </div>
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Medio de pago</label>
          <select id="__feMedio" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:12px;outline:none">
            <option value="01">01 - Efectivo</option><option value="02">02 - Tarjeta</option><option value="04">04 - Transferencia</option><option value="05">05 - SINPE</option>
          </select>
        </div>
      </div>

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:6px">L\xCDNEAS DE DETALLE</div>
      <div style="display:grid;grid-template-columns:3fr 1fr 1fr auto;gap:5px;margin-bottom:6px">
        <input type="text" id="__feLineDesc" placeholder="Descripci\xF3n del servicio/producto" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none;box-sizing:border-box">
        <input type="number" id="__feLineCant" placeholder="Cant" value="1" min="1" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none">
        <input type="number" id="__feLinePrice" placeholder="Precio \u20A1" min="0" style="padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none">
        <button onclick="__feAddLine()" style="padding:7px 10px;border:none;background:#003da5;color:#fff;border-radius:7px;cursor:pointer;font-size:13px">+</button>
      </div>
      <select id="__feLineIVA" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:7px;font-size:11px;outline:none;margin-bottom:8px">
        <option value="13">IVA 13% \u2014 General</option><option value="4">IVA 4% \u2014 Medicina</option>
        <option value="2">IVA 2% \u2014 Canasta b\xE1sica</option><option value="1">IVA 1% \u2014 Seguros</option><option value="0">Exento 0%</option>
      </select>
      <div id="__feLines" style="max-height:120px;overflow-y:auto;margin-bottom:8px"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__fePanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateFE('html','${num}')" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F9FE} Generar factura</button>
      <button onclick="__generateFE('xml','${num}')" style="flex:1;padding:10px;border:1.5px solid #ce1126;background:#fff;color:#ce1126;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600">\u2B07 XML</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__feLineas=[]}function __feAddLine(){const desc=document.getElementById("__feLineDesc")?.value.trim(),cant=parseFloat(document.getElementById("__feLineCant")?.value)||1,price=parseFloat(document.getElementById("__feLinePrice")?.value)||0,iva=parseInt(document.getElementById("__feLineIVA")?.value)||13;if(!desc||!price){showToast("Ingres\xE1 descripci\xF3n y precio");return}window.__feLineas||(window.__feLineas=[]);const sub=cant*price,ivaM=sub*iva/100;window.__feLineas.push({desc,cant,price,iva,sub,ivaM,total:sub+ivaM}),document.getElementById("__feLineDesc").value="",document.getElementById("__feLinePrice").value="",__feRenderLines()}function __feRenderLines(){const box=document.getElementById("__feLines"),lines=window.__feLineas||[],fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR");if(!box)return;const subTotal=lines.reduce((s,l)=>s+l.sub,0),ivaTotal=lines.reduce((s,l)=>s+l.ivaM,0);box.innerHTML=lines.map((l,i)=>`
    <div style="display:flex;gap:6px;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:11px;align-items:center">
      <div style="flex:2;color:#333">${l.desc} (\xD7${l.cant})</div>
      <div style="color:#888">IVA ${l.iva}%</div>
      <div style="font-weight:600;color:#003da5">${fmt(l.total)}</div>
      <button onclick="window.__feLineas.splice(${i},1);__feRenderLines()" style="background:none;border:none;color:#e74c3c;cursor:pointer">\xD7</button>
    </div>`).join("")+(lines.length?`<div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;font-size:12px;border-top:2px solid #003da5;margin-top:4px"><span>TOTAL</span><span style="color:#003da5">${fmt(subTotal+ivaTotal)}</span></div>`:""),window.__feTotals={subTotal,ivaTotal,total:subTotal+ivaTotal}}function __generateFE(type,num){const lines=window.__feLineas||[];if(!lines.length){showToast("Agreg\xE1 al menos una l\xEDnea");return}const g=id=>document.getElementById(id)?.value?.trim()||"",fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),t=window.__feTotals||{},fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});if(localStorage.setItem("wc-fe-num",String(parseInt(num))),type==="xml"){const xml=`<?xml version="1.0" encoding="UTF-8"?>
<FacturaElectronica xmlns="https://tribunet.hacienda.go.cr/docs/esquemas/2017/v4.3/facturaElectronica" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Clave>506${new Date().toISOString().replace(/[-T:.Z]/g,"").slice(0,14)}${g("__feEmisorCedula").replace(/-/g,"")}1${num}1</Clave>
  <NumeroConsecutivo>${num}</NumeroConsecutivo>
  <FechaEmision>${new Date().toISOString()}</FechaEmision>
  <Emisor>
    <Nombre>${g("__feEmisorNombre")}</Nombre>
    <Identificacion><Tipo>02</Tipo><Numero>${g("__feEmisorCedula").replace(/-/g,"")}</Numero></Identificacion>
    <Telefono><NumTelefono>${g("__feEmisorTel").replace(/-/g,"")}</NumTelefono></Telefono>
    <CorreoElectronico>${g("__feEmisorEmail")}</CorreoElectronico>
    <Ubicacion><Provincia>1</Provincia><Canton>01</Canton><Distrito>01</Distrito></Ubicacion>
  </Emisor>
  <Receptor>
    <Nombre>${g("__feRecNombre")}</Nombre>
    <Identificacion><Tipo>01</Tipo><Numero>${g("__feRecCedula").replace(/-/g,"")}</Numero></Identificacion>
    <CorreoElectronico>${g("__feRecEmail")}</CorreoElectronico>
  </Receptor>
  <CondicionVenta>${g("__feCondicion")}</CondicionVenta>
  <MedioPago>${g("__feMedio")}</MedioPago>
  <DetalleServicio>
    ${lines.map((l,i)=>`<LineaDetalle>
      <NumeroLinea>${i+1}</NumeroLinea>
      <Cantidad>${l.cant}</Cantidad>
      <UnidadMedida>Sp</UnidadMedida>
      <Detalle>${l.desc}</Detalle>
      <PrecioUnitario>${l.price.toFixed(2)}</PrecioUnitario>
      <MontoTotal>${l.sub.toFixed(2)}</MontoTotal>
      <Impuesto><Codigo>01</Codigo><CodigoTarifa>0${l.iva===13?"8":l.iva===4?"4":l.iva===2?"2":"1"}</CodigoTarifa><Tarifa>${l.iva}</Tarifa><Monto>${l.ivaM.toFixed(2)}</Monto></Impuesto>
      <MontoTotalLinea>${l.total.toFixed(2)}</MontoTotalLinea>
    </LineaDetalle>`).join("")}
  </DetalleServicio>
  <ResumenFactura>
    <CodigoTipoMoneda><CodigoMoneda>CRC</CodigoMoneda><TipoCambio>1</TipoCambio></CodigoTipoMoneda>
    <TotalGravado>${t.subTotal?.toFixed(2)||"0"}</TotalGravado>
    <TotalImpuesto>${t.ivaTotal?.toFixed(2)||"0"}</TotalImpuesto>
    <TotalComprobante>${t.total?.toFixed(2)||"0"}</TotalComprobante>
  </ResumenFactura>
</FacturaElectronica>`,blob=new Blob([xml],{type:"application/xml"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=`FE-${num}.xml`,a.click(),document.getElementById("__fePanel").remove(),showToast("\u2B07\uFE0F XML Factura Electr\xF3nica descargado \u2705");return}const html=`
  <div style="font-family:Calibri,Arial,sans-serif;max-width:580px;margin:12px auto;border:2px solid #003da5;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#ce1126,#003da5);color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-size:18pt;font-weight:900">FACTURA ELECTR\xD3NICA</div><div style="font-size:9pt;opacity:.8">N\xB0 ${num} \xB7 Esquema v4.3 \xB7 Hacienda CR</div></div>
      <div style="text-align:right;font-size:9pt;opacity:.85"><div>${fecha}</div><div>\u{1F1E8}\u{1F1F7} Rep\xFAblica de Costa Rica</div></div>
    </div>
    <div style="padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;border-bottom:1px solid #eee;font-size:10pt">
      <div><div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:3px">EMISOR:</div><div style="font-weight:700">${g("__feEmisorNombre")}</div><div style="color:#555">C\xE9dula: ${g("__feEmisorCedula")}</div><div style="color:#555">${g("__feEmisorEmail")}</div></div>
      <div><div style="font-size:9pt;color:#888;font-weight:700;margin-bottom:3px">RECEPTOR:</div><div style="font-weight:700">${g("__feRecNombre")}</div><div style="color:#555">C\xE9dula: ${g("__feRecCedula")}</div><div style="color:#555">${g("__feRecEmail")}</div></div>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0f7ff"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Descripci\xF3n</th><th style="padding:7px 10px;border:1px solid #ddd">Cant</th><th style="padding:7px 10px;border:1px solid #ddd">Precio</th><th style="padding:7px 10px;border:1px solid #ddd">IVA</th><th style="padding:7px 10px;border:1px solid #ddd">Total</th></tr>
      ${lines.map((l,i)=>`<tr style="${i%2?"background:#fafafa":""}"><td style="padding:6px 10px;border:1px solid #ddd">${l.desc}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${l.cant}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${fmt(l.price)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${l.iva}%</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(l.total)}</td></tr>`).join("")}
      <tr style="background:#f8f9fa"><td colspan="4" style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#888">Subtotal</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right">${fmt(t.subTotal||0)}</td></tr>
      <tr style="background:#f8f9fa"><td colspan="4" style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">IVA</td><td style="padding:5px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">${fmt(t.ivaTotal||0)}</td></tr>
      <tr style="background:linear-gradient(135deg,#ce1126,#003da5);color:#fff"><td colspan="4" style="padding:8px 10px;font-weight:700">TOTAL</td><td style="padding:8px 10px;text-align:right;font-weight:700;font-size:13pt">${fmt(t.total||0)}</td></tr>
    </table>
    <div style="padding:8px 16px;font-size:8pt;color:#aaa;text-align:center;background:#f8f9fa">Factura Electr\xF3nica generada con WC Corporate Editor \xB7 ${g("__feEmisorActividad")||"Costa Rica"} \xB7 Este documento es una representaci\xF3n gr\xE1fica</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__fePanel").remove(),showToast(`\u{1F9FE} Factura N\xB0 ${num} generada \u2705`)}function openLiquidacionLaboral(){const old=document.getElementById("__liqPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__liqPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#e67e22,#f39c12);color:#fff;padding:14px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:15px;font-weight:700">\u{1F4BC} Calculadora de liquidaci\xF3n CR</div>
      <div style="font-size:11px;opacity:.8">C\xF3digo de Trabajo \xB7 Costa Rica</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${[["__liqNombre","Nombre del trabajador *","Juan P\xE9rez"],["__liqSalario","Salario mensual bruto (\u20A1) *","600000"],["__liqIngreso","Fecha de ingreso *","2020-01-15"],["__liqSalida","Fecha de salida *",new Date().toISOString().split("T")[0]]].map(([id,label,ph])=>`
          <div>
            <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
            <input type="${id.includes("fecha")||id.includes("Ingreso")||id.includes("Salida")?"date":"text"}" id="${id}" placeholder="${ph}" oninput="__calcLiq()"
              style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
              onfocus="this.style.borderColor='#e67e22'" onblur="this.style.borderColor='#e0e0e0'">
          </div>`).join("")}
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
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">D\xEDas de preaviso dados</label>
          <input type="number" id="__liqPreaviso" value="0" min="0" oninput="__calcLiq()" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Vacaciones pendientes (d\xEDas)</label>
          <input type="number" id="__liqVacaciones" value="0" min="0" oninput="__calcLiq()" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
        </div>
      </div>
      <div id="__liqResult" style="display:none"></div>
    </div>
    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__liqPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__calcLiq()" style="flex:1;padding:10px;border:1.5px solid #e67e22;background:#fff;color:#e67e22;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F9EE} Calcular</button>
      <button onclick="__insertLiqReport()" style="flex:2;padding:10px;border:none;background:#e67e22;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4BC} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __calcLiq(){const g=id=>document.getElementById(id)?.value?.trim()||"",salario=parseFloat(g("__liqSalario"))||0,ingreso=new Date(g("__liqIngreso")),salida=new Date(g("__liqSalida")),tipo=g("__liqTipo"),vacDias=parseFloat(g("__liqVacaciones"))||0,preavDias=parseFloat(g("__liqPreaviso"))||0,res=document.getElementById("__liqResult");if(!salario||!g("__liqIngreso")||!g("__liqSalida")||!res)return;const diasTotal=Math.max(0,(salida-ingreso)/(1e3*60*60*24)),a\u00F1os=diasTotal/365,fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),salarioDia=salario/30,salarioSem=salario/7*(7/30*30/4.33);let pre\u0430\u0432\u0438\u0441oLegal=0;a\u00F1os<.25?pre\u0430\u0432\u0438\u0441oLegal=7:a\u00F1os<.5?pre\u0430\u0432\u0438\u0441oLegal=14:a\u00F1os<1?pre\u0430\u0432\u0438\u0441oLegal=21:pre\u0430\u0432\u0438\u0441oLegal=30;const pre\u0430\u0432\u0438\u0441oPend=Math.max(0,pre\u0430\u0432\u0438\u0441oLegal-preavDias),montoPreaviso=tipo==="despido"||tipo==="renuncia"?salarioDia*pre\u0430\u0432\u0438\u0441oPend:0;let montoCesantia=0;if(tipo==="despido"||tipo==="mutual"){const diasCesantia=Math.min(a\u00F1os,8)*19.5;montoCesantia=salarioDia*diasCesantia}const vacPropDias=Math.floor(diasTotal/50)-vacDias,montoVac=Math.max(0,vacPropDias)*salarioDia,montoVacPend=vacDias*salarioDia,mesesPeriodo=(salida.getMonth()+1-12+12)%12||1,montoAguinaldo=salario*Math.min(mesesPeriodo,12)/12,total=montoPreaviso+montoCesantia+montoVac+montoVacPend+montoAguinaldo;window.__liqData={nombre:g("__liqNombre"),salario,diasTotal:Math.round(diasTotal),a\u00F1os:a\u00F1os.toFixed(2),tipo,pre\u0430\u0432\u0438\u0441oLegal,pre\u0430\u0432\u0438\u0441oPend,montoPreaviso,montoCesantia,vacPropDias:Math.max(0,vacPropDias),montoVac,vacDias,montoVacPend,montoAguinaldo,total},res.style.display="block",res.innerHTML=`
    <div style="background:#fff9e6;border-radius:12px;padding:14px;margin-bottom:10px">
      <div style="font-size:12px;font-weight:700;color:#e67e22;margin-bottom:10px">\u{1F4BC} Liquidaci\xF3n \xB7 ${g("__liqNombre")||"Trabajador"} \xB7 ${a\u00F1os.toFixed(2)} a\xF1os</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11pt">
        ${montoPreaviso?`<div style="display:flex;justify-content:space-between"><span>Preaviso (${pre\u0430\u0432\u0438\u0441oPend} d\xEDas)</span><span style="font-weight:600">${fmt(montoPreaviso)}</span></div>`:""}
        ${montoCesantia?`<div style="display:flex;justify-content:space-between"><span>Cesant\xEDa (${(Math.min(a\u00F1os,8)*19.5).toFixed(1)} d\xEDas)</span><span style="font-weight:600">${fmt(montoCesantia)}</span></div>`:""}
        ${montoVac?`<div style="display:flex;justify-content:space-between"><span>Vacaciones proporcionales (${Math.max(0,vacPropDias)} d\xEDas)</span><span style="font-weight:600">${fmt(montoVac)}</span></div>`:""}
        ${montoVacPend?`<div style="display:flex;justify-content:space-between"><span>Vacaciones pendientes (${vacDias} d\xEDas)</span><span style="font-weight:600">${fmt(montoVacPend)}</span></div>`:""}
        <div style="display:flex;justify-content:space-between"><span>Aguinaldo proporcional</span><span style="font-weight:600">${fmt(montoAguinaldo)}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13pt;color:#e67e22;border-top:2px solid #e67e22;padding-top:6px;margin-top:4px"><span>TOTAL LIQUIDACI\xD3N</span><span>${fmt(total)}</span></div>
      </div>
      <div style="font-size:9px;color:#aaa;margin-top:8px">Calculado seg\xFAn C\xF3digo de Trabajo CR \xB7 Solo referencial \xB7 Consult\xE1 con un abogado laboral</div>
    </div>`}function __insertLiqReport(){const d=window.__liqData;if(!d){showToast("Calcul\xE1 primero");return}const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"}),tipoLabel={despido:"Despido sin causa justificada",renuncia:"Renuncia voluntaria",mutual:"Mutuo acuerdo",caducidad:"Caducidad del contrato"}[d.tipo],html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #e67e22;border-radius:10px;overflow:hidden;max-width:500px;margin:12px auto">
    <div style="background:#e67e22;color:#fff;padding:10px 16px;font-weight:700">\u{1F4BC} LIQUIDACI\xD3N LABORAL \xB7 ${fecha}</div>
    <div style="padding:12px 16px;font-size:10pt">
      <p><strong>Trabajador:</strong> ${d.nombre} \xB7 <strong>Motivo:</strong> ${tipoLabel}</p>
      <p><strong>Tiempo laborado:</strong> ${d.a\u00F1os} a\xF1os (${d.diasTotal} d\xEDas) \xB7 <strong>Salario mensual:</strong> ${fmt(d.salario)}</p>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      ${[["Preaviso",d.montoPreaviso],["Cesant\xEDa",d.montoCesantia],["Vacaciones proporcionales",d.montoVac],["Vacaciones pendientes",d.montoVacPend],["Aguinaldo proporcional",d.montoAguinaldo]].filter(([,v])=>v>0).map(([l,v],i)=>`<tr style="${i%2?"background:#fafafa":""}"><td style="padding:6px 10px;border:1px solid #ddd">${l}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(v)}</td></tr>`).join("")}
      <tr style="background:#e67e22;color:#fff"><td style="padding:8px 10px;font-weight:700">TOTAL LIQUIDACI\xD3N</td><td style="padding:8px 10px;text-align:right;font-weight:700;font-size:13pt">${fmt(d.total)}</td></tr>
    </table>
    <div style="padding:8px 16px;font-size:8pt;color:#aaa;text-align:center">C\xF3digo de Trabajo CR \xB7 Solo referencial \xB7 WC Corporate Editor</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__liqPanel").remove(),showToast("\u{1F4BC} Liquidaci\xF3n insertada \u2705")}function openContratoArrendamiento(){const old=document.getElementById("__arrPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__arrPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3E0} Contrato de arrendamiento CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Ley General de Arrendamientos Urbanos y Suburbanos N\xB0 7527</div>

    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5">ARRENDANTE (Propietario)</div>
      ${[["__arrPropNombre","Nombre completo *","Juan P\xE9rez Rodr\xEDguez"],["__arrPropCedula","C\xE9dula *","1-2345-6789"],["__arrPropTel","Tel\xE9fono","8888-1234"]].map(([id,l,ph])=>`<div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label><input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join("")}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px">ARRENDATARIO (Inquilino)</div>
      ${[["__arrInqNombre","Nombre completo *","Mar\xEDa Garc\xEDa L\xF3pez"],["__arrInqCedula","C\xE9dula *","2-3456-7890"],["__arrInqTel","Tel\xE9fono","8888-5678"]].map(([id,l,ph])=>`<div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label><input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join("")}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px">INMUEBLE Y CONDICIONES</div>
      ${[["__arrDireccion","Direcci\xF3n exacta del inmueble *","Barrio Los Yoses, San Jos\xE9, frente al parque, casa #123"],["__arrUso","Uso del inmueble","Habitacional / Comercial / Mixto"],["__arrMonto","Monto mensual del alquiler (\u20A1) *","250000"],["__arrDeposito","Dep\xF3sito de garant\xEDa (\u20A1)","500000"],["__arrInicio","Fecha de inicio del contrato *",new Date().toISOString().split("T")[0]],["__arrPlazo","Plazo del contrato","1 a\xF1o (prorrogable autom\xE1ticamente)"],["__arrPago","D\xEDa de pago mensual","1\xB0 de cada mes"]].map(([id,l,ph])=>`<div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label><input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join("")}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__arrPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateArrendamiento()" style="flex:2;padding:11px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3E0} Generar contrato</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateArrendamiento(){const g=id=>document.getElementById(id)?.value?.trim()||"",propNombre=g("__arrPropNombre"),propCed=g("__arrPropCedula"),inqNombre=g("__arrInqNombre"),inqCed=g("__arrInqCedula"),dir=g("__arrDireccion"),uso=g("__arrUso")||"Habitacional",monto=parseInt(g("__arrMonto").replace(/\D/g,""))||0,deposito=parseInt(g("__arrDeposito").replace(/\D/g,""))||monto*2,inicio=g("__arrInicio"),plazo=g("__arrPlazo")||"1 a\xF1o",pago=g("__arrPago")||"1\xB0 de cada mes",fmt=n=>"\u20A1"+n.toLocaleString("es-CR"),fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});if(!propNombre||!inqNombre||!dir||!monto){showToast("Complet\xE1 los campos obligatorios *");return}const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <h2 style="font-size:14pt;font-weight:900;text-transform:uppercase;color:#1a2942">CONTRATO DE ARRENDAMIENTO</h2>
      <div style="font-size:10pt;color:#888">Ley N\xB0 7527 \xB7 Rep\xFAblica de Costa Rica</div>
    </div>

    <p style="text-align:justify">Entre <strong>${propNombre}</strong>, c\xE9dula <strong>${propCed}</strong>, en adelante <em>"EL ARRENDANTE"</em>; y <strong>${inqNombre}</strong>, c\xE9dula <strong>${inqCed}</strong>, en adelante <em>"EL ARRENDATARIO"</em>, se suscribe el presente contrato de arrendamiento bajo las siguientes cl\xE1usulas:</p>

    <p><strong>PRIMERA (Objeto):</strong> El arrendante da en arrendamiento al arrendatario el inmueble ubicado en: <strong>${dir}</strong>, para uso <strong>${uso}</strong>.</p>

    <p><strong>SEGUNDA (Plazo):</strong> El presente contrato tendr\xE1 una vigencia de <strong>${plazo}</strong> a partir del <strong>${inicio}</strong>, prorrog\xE1ndose autom\xE1ticamente salvo que alguna de las partes notifique su deseo de no renovarlo con al menos tres meses de anticipaci\xF3n.</p>

    <p><strong>TERCERA (Precio):</strong> El canon mensual de arrendamiento es de <strong>${fmt(monto)}</strong> (${monto.toLocaleString("es-CR")} colones exactos), pagadero el <strong>${pago}</strong>, mediante dep\xF3sito bancario o SINPE M\xF3vil a la cuenta indicada por el arrendante.</p>

    <p><strong>CUARTA (Dep\xF3sito de garant\xEDa):</strong> El arrendatario entrega en este acto la suma de <strong>${fmt(deposito)}</strong> como dep\xF3sito de garant\xEDa, el cual ser\xE1 devuelto al finalizar el contrato descontando da\xF1os si los hubiere, conforme al art\xEDculo 74 de la Ley N\xB0 7527.</p>

    <p><strong>QUINTA (Servicios p\xFAblicos):</strong> Los servicios de electricidad, agua, tel\xE9fono, cable e internet correr\xE1n por cuenta del arrendatario, salvo pacto en contrario.</p>

    <p><strong>SEXTA (Mantenimiento):</strong> El arrendatario se compromete a mantener el inmueble en buenas condiciones, realizar reparaciones menores y notificar al arrendante sobre da\xF1os mayores.</p>

    <p><strong>S\xC9TIMA (Prohibiciones):</strong> Queda expresamente prohibido subarrendar, realizar modificaciones estructurales sin autorizaci\xF3n escrita, y cambiar el uso del inmueble establecido en este contrato.</p>

    <p><strong>OCTAVA (Desahucio):</strong> En caso de incumplimiento en el pago por m\xE1s de un mes, el arrendante podr\xE1 iniciar proceso de desahucio conforme a los art\xEDculos 93 y siguientes de la Ley N\xB0 7527.</p>

    <p><strong>NOVENA (Legislaci\xF3n):</strong> El presente contrato se rige por la Ley General de Arrendamientos Urbanos y Suburbanos N\xB0 7527 y el C\xF3digo Civil de Costa Rica.</p>

    <p style="text-align:right">En San Jos\xE9, Costa Rica, a los ${fecha}.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:50px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${propNombre}</strong><br><small>C\xE9dula ${propCed}</small><br><small>ARRENDANTE</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${inqNombre}</strong><br><small>C\xE9dula ${inqCed}</small><br><small>ARRENDATARIO</small></div></div>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__arrPanel").remove(),showToast("\u{1F3E0} Contrato de arrendamiento generado \u2705")}function openEstatutosSA(){const old=document.getElementById("__saPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__saPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3DB}\uFE0F Estatutos Sociedad An\xF3nima CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">C\xF3digo de Comercio \xB7 Arts. 102-166 \xB7 Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px">
      ${[["__saNombre","Nombre de la sociedad *","ABC Soluciones Empresariales S.A."],["__saDomicilio","Domicilio social *","San Jos\xE9, Costa Rica"],["__saObjeto","Objeto social *","Desarrollo de software, consultor\xEDa empresarial y servicios tecnol\xF3gicos"],["__saCapital","Capital social (\u20A1) *","100000"],["__saAcciones","N\xFAmero de acciones *","100"],["__saValorAccion","Valor por acci\xF3n (\u20A1)","1000"],["__saDuracion","Duraci\xF3n de la sociedad","Indefinida"],["__saPresidente","Presidente de la Junta Directiva *","Lic. Juan P\xE9rez Rodr\xEDguez, c\xE9dula 1-2345-6789"],["__saSecretario","Secretario/a *","Lic. Mar\xEDa Garc\xEDa L\xF3pez, c\xE9dula 2-3456-7890"],["__saTesorero","Tesorero/a *","Sr. Carlos Mora Jim\xE9nez, c\xE9dula 3-4567-8901"],["__saFiscal","Fiscal *","Lic. Ana Vargas Sol\xEDs, c\xE9dula 4-5678-9012"],["__saNotario","Notario autorizante","Lic. Roberto Chaves, Notario P\xFAblico"]].map(([id,l,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#1a2942'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__saPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateEstatutosSA()" style="flex:2;padding:11px;border:none;background:#1a2942;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3DB}\uFE0F Generar estatutos</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateEstatutosSA(){const g=id=>document.getElementById(id)?.value?.trim()||"",nombre=g("__saNombre"),domicilio=g("__saDomicilio"),objeto=g("__saObjeto"),capital=parseInt(g("__saCapital").replace(/\D/g,""))||1e5,acciones=parseInt(g("__saAcciones"))||100,valorAcc=Math.round(capital/acciones),duracion=g("__saDuracion")||"Indefinida",presidente=g("__saPresidente"),secretario=g("__saSecretario"),tesorero=g("__saTesorero"),fiscal=g("__saFiscal"),notario=g("__saNotario"),fmt=n=>"\u20A1"+n.toLocaleString("es-CR"),fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});if(!nombre||!objeto||!presidente){showToast("Complet\xE1 los campos obligatorios *");return}const articulos=[["DENOMINACI\xD3N Y NATURALEZA",`La sociedad se denominar\xE1 <strong>${nombre}</strong>, organizada como Sociedad An\xF3nima conforme al C\xF3digo de Comercio de la Rep\xFAblica de Costa Rica.`],["DOMICILIO",`El domicilio social de la compa\xF1\xEDa es <strong>${domicilio}</strong>, sin perjuicio de establecer sucursales, agencias o representaciones en cualquier lugar del territorio nacional o del extranjero.`],["OBJETO SOCIAL",`El objeto de la sociedad es: <strong>${objeto}</strong>. La sociedad podr\xE1 realizar toda clase de actos y contratos relacionados directa o indirectamente con su objeto social.`],["DURACI\xD3N",`La duraci\xF3n de la sociedad es <strong>${duracion}</strong>, contada a partir de la fecha de su inscripci\xF3n en el Registro Mercantil.`],["CAPITAL SOCIAL",`El capital social es de <strong>${fmt(capital)}</strong> representado por <strong>${acciones.toLocaleString("es-CR")} acciones</strong> comunes y nominativas de <strong>${fmt(valorAcc)}</strong> cada una, totalmente suscritas y pagadas.`],["ACCIONES","Las acciones son nominativas, indivisibles y de igual valor. La transmisi\xF3n de acciones deber\xE1 constar en el libro de Registro de Accionistas. Habr\xE1 derecho de tanteo a favor de los socios en caso de venta."],["JUNTA DIRECTIVA",`La sociedad ser\xE1 administrada por una Junta Directiva compuesta de Presidente, Secretario y Tesorero, electos por la Asamblea General de Accionistas por per\xEDodos de ${duracion==="Indefinida"?"un a\xF1o":"el plazo social"}, reelegibles.`],["PRESIDENCIA Y REPRESENTACI\xD3N",`El Presidente tendr\xE1 la representaci\xF3n judicial y extrajudicial de la sociedad con facultades de apoderado general\xEDsimo sin l\xEDmite de suma. El Presidente electo es: <strong>${presidente}</strong>.`],["SECRETAR\xCDA Y TESORER\xCDA",`El Secretario llevar\xE1 las actas y certificar\xE1 los acuerdos. El Tesorero custodiar\xE1 los fondos. Secretario: <strong>${secretario}</strong>. Tesorero: <strong>${tesorero}</strong>.`],["FISCAL\xCDA",`La vigilancia de la sociedad estar\xE1 a cargo de un Fiscal nombrado por la Asamblea General. Fiscal electo: <strong>${fiscal}</strong>.`],["ASAMBLEAS DE ACCIONISTAS","La Asamblea General Ordinaria se celebrar\xE1 dentro de los tres meses siguientes al cierre del ejercicio econ\xF3mico. Las Asambleas Extraordinarias se convocar\xE1n cuando lo requieran los intereses sociales."],["EJERCICIO ECON\xD3MICO Y UTILIDADES","El ejercicio econ\xF3mico cerrar\xE1 el 31 de diciembre de cada a\xF1o. Las utilidades netas se distribuir\xE1n conforme lo acuerde la Asamblea General, reservando el 5% para el fondo de reserva legal hasta alcanzar el 10% del capital social."],["DISOLUCI\xD3N Y LIQUIDACI\xD3N","La sociedad se disolver\xE1 por las causas establecidas en el C\xF3digo de Comercio. En caso de disoluci\xF3n, la liquidaci\xF3n se har\xE1 por una Comisi\xF3n Liquidadora nombrada por la \xFAltima Asamblea General."]],html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <h2 style="font-size:14pt;font-weight:900;text-transform:uppercase;color:#1a2942">PACTO CONSTITUTIVO Y ESTATUTOS</h2>
      <h3 style="font-size:12pt;font-weight:700">${nombre}</h3>
      <div style="font-size:10pt;color:#888">Sociedad An\xF3nima \xB7 C\xF3digo de Comercio CR \xB7 Arts. 102-166</div>
    </div>

    ${articulos.map(([t,c],i)=>`<p><strong>ART\xCDCULO ${["PRIMERO","SEGUNDO","TERCERO","CUARTO","QUINTO","SEXTO","S\xC9TIMO","OCTAVO","NOVENO","D\xC9CIMO","UND\xC9CIMO","DUOD\xC9CIMO","D\xC9CIMO TERCERO"][i]||`${i+1}`} (${t}):</strong> ${c}</p>`).join("")}

    <p style="text-align:center;margin-top:20px">En ${domicilio}, a los ${fecha}, ante m\xED, <strong>${notario||"Notario P\xFAblico"}</strong>, comparecen los socios fundadores y manifiestan su acuerdo con los presentes estatutos, procediendo a firmar.</p>

    <div style="margin-top:40px;text-align:center;font-size:10pt">
      <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:200px">${notario||"Notario P\xFAblico"}<br><small>Autorizante</small></div>
    </div>
    <div style="margin-top:16px;font-size:9pt;color:#888;text-align:center">Generado con WC Corporate Editor \xB7 Solo es un borrador \xB7 Debe ser protocolizado ante Notario P\xFAblico para su inscripci\xF3n en el Registro Mercantil</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__saPanel").remove(),showToast("\u{1F3DB}\uFE0F Estatutos S.A. generados \u2705")}function openLicitacionPublica(){const old=document.getElementById("__licitPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__licitPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const tipos=[["LN","Licitaci\xF3n Nacional"],["LP","Licitaci\xF3n P\xFAblica"],["LC","Licitaci\xF3n por Cotizaci\xF3n"],["CD","Contrataci\xF3n Directa"],["PM","Procedimiento de M\xEDnima Cuant\xEDa"]];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4CB} Licitaci\xF3n p\xFAblica CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Ley de Contrataci\xF3n Administrativa N\xB0 7494 \xB7 SICOP</div>

    <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px">
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:3px">Tipo de procedimiento</label>
        <select id="__licitTipo" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
          ${tipos.map(([v,l])=>`<option value="${v}">${v} \u2014 ${l}</option>`).join("")}
        </select>
      </div>
      ${[["__licitNum","N\xFAmero de licitaci\xF3n *","LN-000001-2025"],["__licitInst","Instituci\xF3n contratante *","Ministerio de Salud"],["__licitProveedor","Nombre del oferente/proveedor *","Empresa Oferente S.A."],["__licitCedOferente","C\xE9dula Jur\xEDdica oferente","3-101-123456"],["__licitObjeto","Objeto de la contrataci\xF3n *","Suministro de equipos m\xE9dicos para hospitales p\xFAblicos"],["__licitMonto","Monto estimado del contrato (\u20A1) *","25000000"],["__licitPlazo","Plazo de entrega","30 d\xEDas h\xE1biles"],["__licitGarantia","Garant\xEDa de cumplimiento","5% del monto adjudicado"],["__licitApertura","Fecha y hora de apertura de ofertas","15 de agosto de 2025 a las 10:00 horas"],["__licitContacto","Contacto para consultas","licitaciones@instituci\xF3n.go.cr \xB7 2222-3333"]].map(([id,l,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
          <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
      <div>
        <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Requisitos habilitantes (uno por l\xEDnea)</label>
        <textarea id="__licitRequisitos" rows="3" placeholder="Estar inscrito en SICOP&#10;Tener c\xE9dula jur\xEDdica vigente&#10;No tener deudas con la CCSS ni Tributaci\xF3n" style="width:100%;padding:7px;border:1.5px solid #e0e0e0;border-radius:7px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__licitPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateLicitacion()" style="flex:2;padding:11px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Generar cartel</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateLicitacion(){const g=id=>document.getElementById(id)?.value?.trim()||"",tipo=document.getElementById("__licitTipo")?.options[document.getElementById("__licitTipo")?.selectedIndex]?.text||"Licitaci\xF3n",num=g("__licitNum"),inst=g("__licitInst"),proveedor=g("__licitProveedor"),cedOfer=g("__licitCedOferente"),objeto=g("__licitObjeto"),monto=parseInt(g("__licitMonto").replace(/\D/g,""))||0,plazo=g("__licitPlazo"),garantia=g("__licitGarantia"),apertura=g("__licitApertura"),contacto=g("__licitContacto"),requisitos=g("__licitRequisitos").split(`
`).filter(r=>r.trim()),fmt=n=>"\u20A1"+n.toLocaleString("es-CR"),fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});if(!num||!inst||!objeto||!monto){showToast("Complet\xE1 los campos obligatorios *");return}const html=`
  <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="background:#1a2942;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;text-align:center">
      <div style="font-size:10pt;opacity:.7;margin-bottom:4px">REP\xDABLICA DE COSTA RICA</div>
      <div style="font-size:16pt;font-weight:900">${inst.toUpperCase()}</div>
      <div style="font-size:12pt;font-weight:600;margin-top:4px">CARTEL DE ${tipo.toUpperCase()}</div>
      <div style="font-size:11pt;opacity:.85">N\xB0 ${num}</div>
    </div>
    <div style="border:2px solid #1a2942;border-top:none;padding:20px;border-radius:0 0 8px 8px">
      <p><strong>OBJETO:</strong> ${objeto}</p>
      <p><strong>MONTO ESTIMADO:</strong> ${fmt(monto)} (IVA incluido)</p>
      ${proveedor?`<p><strong>OFERENTE:</strong> ${proveedor}${cedOfer?` \xB7 C\xE9dula Jur\xEDdica ${cedOfer}`:""}</p>`:""}
      <p><strong>PLAZO DE ENTREGA:</strong> ${plazo||"A convenir"}</p>
      <p><strong>GARANT\xCDA DE CUMPLIMIENTO:</strong> ${garantia||"5% del monto adjudicado"}</p>
      <p><strong>APERTURA DE OFERTAS:</strong> ${apertura||"A definir"}</p>

      ${requisitos.length?`
      <p><strong>REQUISITOS HABILITANTES:</strong></p>
      <ol>${requisitos.map(r=>`<li>${r}</li>`).join("")}</ol>`:""}

      <p><strong>ESPECIFICACIONES T\xC9CNICAS:</strong></p>
      <p>[Describir aqu\xED las especificaciones t\xE9cnicas detalladas del bien o servicio]</p>

      <p><strong>CRITERIOS DE EVALUACI\xD3N:</strong></p>
      <table style="border-collapse:collapse;width:100%;font-size:11pt">
        <tr style="background:#f0f7ff"><th style="padding:6px 10px;border:1px solid #ddd">Criterio</th><th style="padding:6px 10px;border:1px solid #ddd">Puntaje</th></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd">Precio</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">60 puntos</td></tr>
        <tr style="background:#f8f9fa"><td style="padding:6px 10px;border:1px solid #ddd">Experiencia</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">20 puntos</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd">Calidad t\xE9cnica</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">20 puntos</td></tr>
      </table>

      <p><strong>INFORMACI\xD3N Y CONSULTAS:</strong> ${contacto||"Ver plataforma SICOP"}</p>
      <p style="font-size:10pt;color:#888">Todo lo no previsto en este cartel se regir\xE1 por la Ley N\xB0 7494, su Reglamento y el ordenamiento jur\xEDdico costarricense.</p>
      <p style="text-align:right">${inst}, ${fecha}</p>
    </div>
    <div style="font-size:8pt;color:#aaa;text-align:center;margin-top:4px">Generado con WC Corporate Editor \xB7 Este es un borrador \xB7 Verificar con SICOP oficial</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__licitPanel").remove(),showToast("\u{1F4CB} Cartel de licitaci\xF3n generado \u2705")}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"facturaElectronica":openFacturaElectronica();break;case"liquidacionLaboral":openLiquidacionLaboral();break;case"contratoArrendamiento":openContratoArrendamiento();break;case"estatutosSA":openEstatutosSA();break;case"licitacionPublica":openLicitacionPublica();break;default:orig(a)}}),console.log("WC Corporate Editor v25.44 \u2705 \u2014 FE CR, Liquidaci\xF3n, Arrendamiento, SA, Licitaci\xF3n")},5200)})();
