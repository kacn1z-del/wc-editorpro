function openRentaCalc(){const old=document.getElementById("__rentaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__rentaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700">\u{1F3DB}\uFE0F Impuesto sobre la Renta CR 2025</div>
      <div style="font-size:11px;opacity:.8;margin-top:2px">Ley N\xB0 7092 \xB7 Ministerio de Hacienda \xB7 Tarifas 2025</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="display:flex;gap:6px;margin-bottom:14px">
        ${[["asalariado","\u{1F464} Asalariado"],["empresa","\u{1F3E2} Empresa/PYME"],["independiente","\u{1F4BC} Independiente"]].map(([v,l],i)=>`
          <button onclick="__rentaType='${v}';document.querySelectorAll('.__rentaTypeBtn').forEach(b=>{b.style.borderColor='#eee';b.style.background='#fafafa';b.style.color='#555';});this.style.borderColor='#003da5';this.style.background='#f0f7ff';this.style.color='#003da5';__buildRentaFields()"
            class="__rentaTypeBtn" style="flex:1;padding:8px 4px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:9px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s">
            ${l}
          </button>`).join("")}
      </div>

      <div id="__rentaFields" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px"></div>
      <div id="__rentaResult" style="display:none"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__rentaPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__calcRenta()" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F9EE} Calcular renta</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__rentaType="asalariado",__buildRentaFields()}function __buildRentaFields(){const type=window.__rentaType||"asalariado",box=document.getElementById("__rentaFields");if(!box)return;const fields={asalariado:[["__rentaSalario","Salario bruto mensual (\u20A1) *","500000","number"],["__rentaOtrosIng","Otros ingresos mensuales (\u20A1)","0","number"],["__rentaDeducciones","Deducciones autorizadas (\u20A1)","0","number"]],empresa:[["__rentaUtilidad","Utilidad neta anual (\u20A1) *","5000000","number"],["__rentaGastos","Gastos deducibles ya aplicados (\u20A1)","0","number"]],independiente:[["__rentaIngBruto","Ingresos brutos anuales (\u20A1) *","8000000","number"],["__rentaGastosInd","Gastos deducibles anuales (\u20A1)","2000000","number"]]};box.innerHTML=(fields[type]||[]).map(([id,label,ph,type2])=>`
    <div>
      <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">${label}</label>
      <input type="${type2}" id="${id}" placeholder="${ph}" value="0" min="0"
        style="width:100%;padding:9px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'"
        oninput="__calcRenta()">
    </div>`).join("")}function __calcRenta(){const type=window.__rentaType||"asalariado",fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),g=id=>parseFloat(document.getElementById(id)?.value)||0,res=document.getElementById("__rentaResult");if(!res)return;let impuesto=0,base=0,detalles=[];if(type==="asalariado"){const salario=g("__rentaSalario"),otros=g("__rentaOtrosIng"),deducciones=g("__rentaDeducciones"),ingTotal=salario+otros;base=Math.max(0,ingTotal-deducciones);const tramos=[{hasta:941e3,tasa:0},{hasta:1381e3,tasa:.1},{hasta:2423e3,tasa:.15},{hasta:4845e3,tasa:.2},{hasta:1/0,tasa:.25}];let ant=0;tramos.forEach(t=>{if(base>ant){const imp=(Math.min(base,t.hasta)-ant)*t.tasa;impuesto+=imp,t.tasa>0&&detalles.push({rango:`\u20A1${Math.round(ant).toLocaleString("es-CR")} - \u20A1${t.hasta===1/0?"\u221E":Math.round(t.hasta).toLocaleString("es-CR")}`,tasa:`${t.tasa*100}%`,monto:imp}),ant=t.hasta}});const ccss=salario*.1067;window.__rentaData={tipo:"Asalariado",ingTotal,ccss,base,impuesto,neto:salario-ccss-impuesto,mensual:!0}}else if(type==="empresa"){const util=g("__rentaUtilidad");base=util,util<=5616e3?impuesto=0:util<=8108e3?impuesto=(util-5616e3)*.05:util<=106e5?impuesto=2492e3*.05+(util-8108e3)*.1:util<=53103e3?impuesto=2492e3*.05+2492e3*.1+(util-106e5)*.15:impuesto=2492e3*.05+2492e3*.1+42503e3*.15+(util-53103e3)*.3,detalles=[{rango:"Tarifa progresiva empresas",tasa:"5-30%",monto:impuesto}],window.__rentaData={tipo:"Empresa/PYME",ingTotal:util,base,impuesto,mensual:!1}}else{const ingBruto=g("__rentaIngBruto"),gastos=g("__rentaGastosInd");base=Math.max(0,ingBruto-gastos);const tramos=[{h:5616e3,r:0},{h:11232e3,r:.1},{h:16848e3,r:.15},{h:1/0,r:.25}];let ant=0;tramos.forEach(t=>{if(base>ant){const tr=Math.min(base,t.h)-ant;impuesto+=tr*t.r,ant=t.h}}),detalles=[{rango:"Tarifa progresiva persona f\xEDsica",tasa:"10-25%",monto:impuesto}],window.__rentaData={tipo:"Trabajador independiente",ingTotal:ingBruto,base,impuesto,mensual:!1}}const d=window.__rentaData;res.style.display="block",res.innerHTML=`
    <div style="background:#f0f7ff;border-radius:12px;padding:14px;margin-bottom:10px">
      <div style="font-size:12px;font-weight:700;color:#003da5;margin-bottom:10px">\u{1F4CA} Resultado \u2014 ${d.tipo} \xB7 ${d.mensual?"Mensual":"Anual"}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        ${[["Ingresos totales",fmt(d.ingTotal),"#1a2942"],["Base imponible",fmt(d.base),"#555"],d.ccss?["CCSS (~10.67%)",fmt(d.ccss),"#e74c3c"]:null,["Impuesto s/renta",fmt(d.impuesto),"#ce1126"],d.neto!==void 0?["Salario neto estimado",fmt(d.neto),"#27ae60"]:null].filter(Boolean).map(([l,v,c])=>`
          <div style="background:#fff;border-radius:8px;padding:8px;text-align:center">
            <div style="font-size:13px;font-weight:800;color:${c}">${v}</div>
            <div style="font-size:9px;color:#aaa">${l}</div>
          </div>`).join("")}
      </div>
      <div style="font-size:11px;color:#888;text-align:center">Tarifas ISR CR 2025 \xB7 Solo referencial \xB7 Consult\xE1 con contador</div>
    </div>
    <button onclick="__insertRentaReport()" style="width:100%;padding:9px;border:none;background:#003da5;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">\u{1F4CB} Insertar reporte</button>`}function __insertRentaReport(){const d=window.__rentaData;if(!d)return;const fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #003da5;border-radius:10px;overflow:hidden;max-width:500px;margin:12px auto">
    <div style="background:linear-gradient(135deg,#003da5,#ce1126);color:#fff;padding:10px 16px;font-weight:700">\u{1F3DB}\uFE0F C\xC1LCULO ISR CR 2025 \u2014 ${d.tipo}</div>
    <div style="padding:14px 16px">
      <table style="border-collapse:collapse;width:100%;font-size:10pt">
        <tr><td style="padding:6px 8px;border:1px solid #ddd">Ingresos totales</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:right">${fmt(d.ingTotal)}</td></tr>
        <tr style="background:#f0f7ff"><td style="padding:6px 8px;border:1px solid #ddd">Base imponible</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:right">${fmt(d.base)}</td></tr>
        ${d.ccss?`<tr><td style="padding:6px 8px;border:1px solid #ddd">CCSS trabajador</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:right;color:#e74c3c">${fmt(d.ccss)}</td></tr>`:""}
        <tr style="background:#fde8e8"><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">Impuesto sobre la renta</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:right;font-weight:700;color:#ce1126">${fmt(d.impuesto)}</td></tr>
        ${d.neto!==void 0?`<tr style="background:#d4edda"><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">Neto estimado</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:right;font-weight:700;color:#27ae60">${fmt(d.neto)}</td></tr>`:""}
      </table>
      <p style="font-size:8pt;color:#aaa;margin-top:8px">Calculado con tarifas ISR CR 2025 \xB7 Solo referencial \xB7 WC Corporate Editor</p>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__rentaPanel").remove(),showToast("\u{1F3DB}\uFE0F Reporte de renta insertado \u2705")}function openCCSSPlanilla(){const old=document.getElementById("__ccssPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__ccssPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:560px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="background:linear-gradient(135deg,#27ae60,#1e8449);color:#fff;padding:16px 20px;border-radius:20px 20px 0 0;flex-shrink:0">
      <div style="font-size:16px;font-weight:700">\u{1F3E5} Planilla CCSS</div>
      <div style="font-size:11px;opacity:.8;margin-top:2px">Caja Costarricense de Seguro Social \xB7 Cargas sociales 2025</div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:16px 20px">
      <div style="background:#f0fff4;border-radius:10px;padding:12px;margin-bottom:14px;font-size:11px;color:#155724;line-height:1.7">
        <strong>Cargas sociales 2025:</strong><br>
        Patrono: 26.83% (SEM 9.25% + IVM 4.92% + Riesgos 1% + ASFA 0.5% + FODESAF 0.5% + IMAS 0.5% + INA 1.5% + Bco Popular 0.5% + Asignaciones 5.33% + LPT 3.33%)<br>
        Trabajador: 10.67% (SEM 5.5% + IVM 4.17% + Bco Popular 1%)
      </div>

      <div style="margin-bottom:12px">
        <div style="font-size:12px;font-weight:700;color:#555;margin-bottom:8px">Empleados</div>
        <div id="__ccssEmpleados" style="display:flex;flex-direction:column;gap:6px"></div>
        <div style="display:grid;grid-template-columns:2fr 1fr auto;gap:6px;margin-top:6px">
          <input type="text" id="__ccssNombreNew" placeholder="Nombre del empleado"
            style="padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box">
          <input type="number" id="__ccssSalarioNew" placeholder="Salario \u20A1" min="0" step="1000"
            style="padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
          <button onclick="__ccssAddEmp()" style="padding:8px 12px;border:none;background:#27ae60;color:#fff;border-radius:8px;cursor:pointer;font-size:13px">+</button>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:3px">Empresa / Empleador</label>
        <input type="text" id="__ccssEmpresa" placeholder="Nombre de la empresa"
          style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
          onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#eee'">
      </div>

      <div id="__ccssResumen" style="display:none"></div>
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__ccssPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cerrar</button>
      <button onclick="__calcCCSS()" style="flex:1;padding:10px;border:1.5px solid #27ae60;background:#fff;color:#27ae60;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F9EE} Calcular</button>
      <button onclick="__insertCCSS()" style="flex:1;padding:10px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4CB} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__ccssEmpleados=[],__ccssRender()}function __ccssAddEmp(){const nombre=document.getElementById("__ccssNombreNew")?.value.trim(),salario=parseFloat(document.getElementById("__ccssSalarioNew")?.value)||0;if(!nombre||!salario){showToast("Ingres\xE1 nombre y salario");return}window.__ccssEmpleados||(window.__ccssEmpleados=[]),window.__ccssEmpleados.push({nombre,salario}),document.getElementById("__ccssNombreNew").value="",document.getElementById("__ccssSalarioNew").value="",__ccssRender(),__calcCCSS()}function __ccssRender(){const box=document.getElementById("__ccssEmpleados"),emps=window.__ccssEmpleados||[],fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR");box&&(box.innerHTML=emps.length?emps.map((e,i)=>`
    <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#f0fff4;border-radius:8px;font-size:12px">
      <div style="flex:1;font-weight:600">${e.nombre}</div>
      <div style="color:#27ae60">${fmt(e.salario)}</div>
      <button onclick="window.__ccssEmpleados.splice(${i},1);__ccssRender();__calcCCSS()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:14px">\xD7</button>
    </div>`).join(""):'<div style="text-align:center;color:#bbb;font-size:12px;padding:10px">Agreg\xE1 empleados con el formulario de abajo</div>')}function __calcCCSS(){const emps=window.__ccssEmpleados||[],res=document.getElementById("__ccssResumen");if(!res||!emps.length)return;const PATRON_PCT=.2683,TRABAJ_PCT=.1067,fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR");let totalSalarios=0,totalPatron=0,totalTrabaj=0;const rows=emps.map(e=>{const patron=e.salario*PATRON_PCT,trabaj=e.salario*TRABAJ_PCT;return totalSalarios+=e.salario,totalPatron+=patron,totalTrabaj+=trabaj,{...e,patron,trabaj,total:e.salario+patron}});window.__ccssData={rows,totalSalarios,totalPatron,totalTrabaj,totalCosto:totalSalarios+totalPatron},res.style.display="block",res.innerHTML=`
    <div style="background:#f0fff4;border-radius:10px;padding:12px;margin-top:10px">
      <div style="font-size:12px;font-weight:700;color:#27ae60;margin-bottom:8px">Resumen planilla</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;margin-bottom:10px">
        <div><div style="font-size:14px;font-weight:800;color:#27ae60">${fmt(totalSalarios)}</div><div style="font-size:9px;color:#aaa">Total salarios</div></div>
        <div><div style="font-size:14px;font-weight:800;color:#003da5">${fmt(totalPatron)}</div><div style="font-size:9px;color:#aaa">Carga patronal</div></div>
        <div><div style="font-size:14px;font-weight:800;color:#1a2942">${fmt(totalSalarios+totalPatron)}</div><div style="font-size:9px;color:#aaa">Costo total empresa</div></div>
      </div>
    </div>`}function __insertCCSS(){const d=window.__ccssData;if(!d||!d.rows.length){showToast("Calcul\xE1 primero la planilla");return}const empresa=document.getElementById("__ccssEmpresa")?.value.trim()||"Empresa",fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),fecha=new Date().toLocaleDateString("es-CR",{month:"long",year:"numeric"}),html=`<div style="font-family:Calibri,Arial,sans-serif;max-width:600px;margin:12px auto;border:2px solid #27ae60;border-radius:10px;overflow:hidden">
    <div style="background:#27ae60;color:#fff;padding:10px 16px;font-weight:700">\u{1F3E5} Planilla CCSS \u2014 ${empresa} \xB7 ${fecha}</div>
    <table style="border-collapse:collapse;width:100%;font-size:10pt">
      <tr style="background:#f0fff4"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Empleado</th><th style="padding:7px 10px;border:1px solid #ddd">Salario</th><th style="padding:7px 10px;border:1px solid #ddd">Patronal 26.83%</th><th style="padding:7px 10px;border:1px solid #ddd">Trabajador 10.67%</th><th style="padding:7px 10px;border:1px solid #ddd">Costo total</th></tr>
      ${d.rows.map((r,i)=>`<tr style="${i%2?"background:#fafafa":""}"><td style="padding:6px 10px;border:1px solid #ddd">${r.nombre}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${fmt(r.salario)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;color:#003da5">${fmt(r.patron)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;color:#e74c3c">${fmt(r.trabaj)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right;font-weight:600">${fmt(r.total)}</td></tr>`).join("")}
      <tr style="background:#27ae60;color:#fff"><td style="padding:7px 10px;font-weight:700">TOTALES</td><td style="padding:7px 10px;text-align:right;font-weight:700">${fmt(d.totalSalarios)}</td><td style="padding:7px 10px;text-align:right;font-weight:700">${fmt(d.totalPatron)}</td><td style="padding:7px 10px;text-align:right;font-weight:700">${fmt(d.totalTrabaj)}</td><td style="padding:7px 10px;text-align:right;font-weight:700">${fmt(d.totalCosto)}</td></tr>
    </table>
    <div style="padding:8px 16px;font-size:8pt;color:#aaa;text-align:center">Planilla generada con WC Corporate Editor \xB7 Tarifas CCSS 2025</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__ccssPanel").remove(),showToast("\u{1F3E5} Planilla CCSS insertada \u2705")}function openContratoHoras(){const old=document.getElementById("__horasPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__horasPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u23F0 Contrato de trabajo por horas CR</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Art\xEDculo 138 bis C\xF3digo de Trabajo \xB7 Costa Rica</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__hEmpresa","Empresa empleadora *","Empresa XYZ S.A."],["__hCedJur","C\xE9dula jur\xEDdica","3-101-123456"],["__hTrabajador","Nombre del trabajador *","Juan P\xE9rez Rodr\xEDguez"],["__hCedTrab","C\xE9dula trabajador *","1-2345-6789"],["__hPuesto","Puesto / cargo *","Asistente de ventas"],["__hHorasPorSemana","Horas acordadas por semana *","20"],["__hPrecioHora","Precio por hora (\u20A1) *","3500"],["__hHorario","D\xEDas y horario acordado","Lunes y Mi\xE9rcoles 8:00-18:00"],["__hInicio","Fecha de inicio *",new Date().toLocaleDateString("es-CR")],["__hLugar","Lugar de trabajo","San Jos\xE9, Costa Rica"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#f39c12'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__horasPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateContratoHoras()" style="flex:2;padding:11px;border:none;background:#f39c12;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u23F0 Generar contrato</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateContratoHoras(){const g=id=>document.getElementById(id)?.value?.trim()||"",empresa=g("__hEmpresa"),cedJur=g("__hCedJur"),trabajador=g("__hTrabajador"),cedTrab=g("__hCedTrab"),puesto=g("__hPuesto"),horas=parseFloat(g("__hHorasPorSemana"))||0,precioHora=parseFloat(g("__hPrecioHora"))||0,horario=g("__hHorario"),inicio=g("__hInicio"),lugar=g("__hLugar")||"San Jos\xE9, Costa Rica";if(!empresa||!trabajador||!puesto||!horas||!precioHora){showToast("Complet\xE1 los campos obligatorios *");return}const salarioSemanal=horas*precioHora,salarioMensual=salarioSemanal*4.33,fmt=n=>"\u20A1"+Math.round(n).toLocaleString("es-CR"),fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"}),html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <h2 style="font-size:14pt;font-weight:900;color:#1a2942;text-transform:uppercase">CONTRATO DE TRABAJO POR TIEMPO PARCIAL</h2>
      <div style="font-size:10pt;color:#888">Art\xEDculo 138 bis \xB7 C\xF3digo de Trabajo \xB7 Rep\xFAblica de Costa Rica</div>
    </div>

    <p style="text-align:justify">Entre <strong>${empresa}</strong>, c\xE9dula jur\xEDdica <strong>${cedJur}</strong>, en adelante <em>"EL EMPLEADOR"</em>; y <strong>${trabajador}</strong>, c\xE9dula <strong>${cedTrab}</strong>, en adelante <em>"EL TRABAJADOR"</em>, convenimos el siguiente contrato de trabajo a tiempo parcial:</p>

    <p><strong>PRIMERA (Objeto):</strong> El trabajador se desempe\xF1ar\xE1 en el puesto de <strong>${puesto}</strong>, realizando las funciones propias del cargo.</p>

    <p><strong>SEGUNDA (Jornada por horas):</strong> La jornada de trabajo ser\xE1 de <strong>${horas} horas por semana</strong>, distribuidas seg\xFAn el siguiente horario: <strong>${horario||"a acordar entre las partes"}</strong>. La jornada no exceder\xE1 los l\xEDmites legales del art\xEDculo 136 del C\xF3digo de Trabajo.</p>

    <p><strong>TERCERA (Remuneraci\xF3n):</strong> El empleador pagar\xE1 al trabajador la suma de <strong>${fmt(precioHora)} por hora trabajada</strong>, equivalente a <strong>${fmt(salarioSemanal)} semanales</strong> y aproximadamente <strong>${fmt(salarioMensual)} mensuales</strong>, pagaderos seg\xFAn el per\xEDodo acordado.</p>

    <p><strong>CUARTA (Cargas sociales):</strong> El empleador realizar\xE1 las deducciones y aportes a la CCSS sobre las horas efectivamente laboradas, de conformidad con la legislaci\xF3n vigente.</p>

    <p><strong>QUINTA (Vacaciones y aguinaldo):</strong> El trabajador tendr\xE1 derecho a vacaciones y aguinaldo proporcionales a las horas trabajadas, seg\xFAn los art\xEDculos 153 y 166 del C\xF3digo de Trabajo.</p>

    <p><strong>SEXTA (Inicio):</strong> El contrato inicia el <strong>${inicio}</strong> en <strong>${lugar}</strong>.</p>

    <p><strong>S\xC9TIMA (Legislaci\xF3n):</strong> Este contrato se rige por el C\xF3digo de Trabajo de Costa Rica y sus reformas.</p>

    <p style="text-align:right">En ${lugar}, a los ${fecha}.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:50px">
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${empresa}</strong><br><small>Empleador</small></div></div>
      <div style="text-align:center"><div style="border-top:1px solid #333;padding-top:8px"><strong>${trabajador}</strong><br><small>Trabajador \xB7 C\xE9dula ${cedTrab}</small></div></div>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__horasPanel").remove(),showToast("\u23F0 Contrato por horas generado \u2705")}function openDenunciaLaboral(){const old=document.getElementById("__denunciaPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__denunciaPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const tipos=[["incumplimiento","Incumplimiento de pago"],["despido","Despido injustificado"],["acoso","Acoso laboral / hostigamiento"],["horas","Exceso de jornada"],["vacaciones","Negaci\xF3n de vacaciones"],["ccss","Incumplimiento CCSS"],["discriminacion","Discriminaci\xF3n laboral"],["otro","Otro"]];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;max-height:92vh;overflow-y:auto;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F6A8} Formulario de denuncia laboral</div>
    <div style="font-size:12px;color:#888;margin-bottom:14px">Ministerio de Trabajo y Seguridad Social \xB7 Costa Rica</div>

    <div style="background:#fff9e6;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#856404;line-height:1.6">
      \u26A0\uFE0F Este formulario genera un borrador de denuncia. Para presentarla oficialmente visit\xE1 el <a href="https://www.mtss.go.cr" target="_blank" style="color:#003da5">MTSS</a> o llam\xE1 al <strong>800-200-8780</strong>.
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:#003da5;margin-bottom:2px">DATOS DEL DENUNCIANTE</div>
      ${[["__denNombre","Nombre completo *","Juan P\xE9rez Rodr\xEDguez"],["__denCedula","C\xE9dula *","1-2345-6789"],["__denTel","Tel\xE9fono","8888-1234"],["__denEmail","Correo electr\xF3nico","juan@email.cr"]].map(([id,l,ph])=>`
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
        <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join("")}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px;margin-bottom:2px">DATOS DEL PATRONO DENUNCIADO</div>
      ${[["__denEmpresa","Empresa / Patrono *","Empresa Denunciada S.A."],["__denCedEmp","C\xE9dula Jur\xEDdica","3-101-123456"],["__denDirEmp","Direcci\xF3n de la empresa","San Jos\xE9, Costa Rica"]].map(([id,l,ph])=>`
        <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">${l}</label>
        <input type="text" id="${id}" placeholder="${ph}" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#e0e0e0'"></div>`).join("")}

      <div style="font-size:11px;font-weight:700;color:#003da5;margin-top:6px;margin-bottom:4px">TIPO DE DENUNCIA</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:8px">
        ${tipos.map(([v,l],i)=>`
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:7px;border:1.5px solid ${i===0?"#e74c3c":"#eee"};background:${i===0?"#fde8e8":"#fafafa"};border-radius:8px;font-size:11px;font-weight:600;color:#555">
            <input type="radio" name="__denTipo" value="${v}" ${i===0?"checked":""} style="accent-color:#e74c3c"> ${l}
          </label>`).join("")}
      </div>

      <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Descripci\xF3n de los hechos *</label>
        <textarea id="__denHechos" rows="4" placeholder="Describir detalladamente los hechos que motivan la denuncia, incluyendo fechas, montos, testigos..."
          style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:12px;outline:none;resize:none;box-sizing:border-box" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
      </div>
      <div><label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Monto reclamado (\u20A1)</label>
        <input type="text" id="__denMonto" placeholder="Ej: \u20A1500,000 por salarios pendientes" style="width:100%;padding:8px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none;box-sizing:border-box"></div>
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__denunciaPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateDenuncia()" style="flex:2;padding:11px;border:none;background:#e74c3c;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F6A8} Generar denuncia</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __generateDenuncia(){const g=id=>document.getElementById(id)?.value?.trim()||"",nombre=g("__denNombre"),cedula=g("__denCedula"),tel=g("__denTel"),email=g("__denEmail"),empresa=g("__denEmpresa"),cedEmp=g("__denCedEmp"),dirEmp=g("__denDirEmp"),hechos=g("__denHechos"),monto=g("__denMonto"),tipo=document.querySelector('[name="__denTipo"]:checked')?.value||"",tipoLabel={incumplimiento:"Incumplimiento de pago",despido:"Despido injustificado",acoso:"Acoso laboral",horas:"Exceso de jornada",vacaciones:"Negaci\xF3n de vacaciones",ccss:"Incumplimiento CCSS",discriminacion:"Discriminaci\xF3n laboral",otro:"Otro"}[tipo]||tipo,fecha=new Date().toLocaleDateString("es-CR",{day:"numeric",month:"long",year:"numeric"});if(!nombre||!cedula||!empresa||!hechos){showToast("Complet\xE1 los campos obligatorios *");return}const html=`
  <div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;max-width:17cm;margin:0 auto">
    <div style="text-align:center;margin-bottom:20px">
      <h2 style="font-size:14pt;font-weight:700;text-transform:uppercase;color:#ce1126">FORMULARIO DE DENUNCIA LABORAL</h2>
      <div style="font-size:10pt;color:#888">Ministerio de Trabajo y Seguridad Social \xB7 Rep\xFAblica de Costa Rica</div>
      <div style="font-size:10pt;color:#888">Direcci\xF3n Nacional de Inspecci\xF3n de Trabajo</div>
    </div>

    <p><strong>Fecha:</strong> ${fecha}</p>

    <p><strong>I. DATOS DEL DENUNCIANTE</strong><br>
    Nombre: <strong>${nombre}</strong> \xB7 C\xE9dula: <strong>${cedula}</strong><br>
    Tel\xE9fono: ${tel||"___"} \xB7 Correo: ${email||"___"}</p>

    <p><strong>II. DATOS DEL PATRONO DENUNCIADO</strong><br>
    Empresa: <strong>${empresa}</strong> \xB7 C\xE9dula Jur\xEDdica: ${cedEmp||"___"}<br>
    Direcci\xF3n: ${dirEmp||"___"}</p>

    <p><strong>III. TIPO DE DENUNCIA:</strong> <strong>${tipoLabel}</strong></p>

    <p><strong>IV. DESCRIPCI\xD3N DE LOS HECHOS</strong></p>
    <p style="text-align:justify">${hechos}</p>

    ${monto?`<p><strong>V. MONTO RECLAMADO:</strong> ${monto}</p>`:""}

    <p><strong>VI. PETITORIA</strong><br>
    Solicito respetuosamente al Ministerio de Trabajo y Seguridad Social que investigue los hechos denunciados y tome las acciones pertinentes seg\xFAn la legislaci\xF3n laboral vigente.</p>

    <p style="text-align:justify">Declaro bajo juramento que los datos proporcionados son ver\xEDdicos y asumo responsabilidad por la veracidad de los mismos.</p>

    <div style="margin-top:40px;text-align:center">
      <div style="border-top:1px solid #333;padding-top:8px;display:inline-block;min-width:200px">
        <strong>${nombre}</strong><br><small>C\xE9dula ${cedula}</small><br><small>Denunciante</small>
      </div>
    </div>

    <div style="margin-top:20px;background:#f8f9fa;border-radius:8px;padding:12px;font-size:9pt;color:#555;line-height:1.7">
      \u{1F4CC} <strong>Para presentar esta denuncia:</strong> Visit\xE1 las oficinas del MTSS m\xE1s cercanas \xB7 Llam\xE1 al 800-200-8780 \xB7 Sitio web: <a href="https://www.mtss.go.cr" style="color:#003da5">www.mtss.go.cr</a>
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__denunciaPanel").remove(),showToast("\u{1F6A8} Formulario de denuncia generado \u2705")}function openCorreosInstitucionales(){const old=document.getElementById("__correoPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__correoPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px";const plantillas=[{icon:"\u{1F4CB}",name:"Solicitud de informaci\xF3n",cat:"Gesti\xF3n",asunto:"Solicitud de informaci\xF3n \u2014 [Referencia]",cuerpo:`Estimado/a se\xF1or/se\xF1ora:

Por medio del presente, me permito solicitarle respetuosamente informaci\xF3n relacionada con [tema o tr\xE1mite], en virtud de [base legal o justificaci\xF3n].

El plazo legal para atender esta solicitud es de [X] d\xEDas h\xE1biles, seg\xFAn lo establecido en la Ley de Acceso a la Informaci\xF3n P\xFAblica.

Sin otro particular, quedo a su disposici\xF3n.

Atentamente,
[Nombre]
[Cargo] \xB7 [Instituci\xF3n]
[Tel\xE9fono] \xB7 [Correo]`},{icon:"\u2705",name:"Acuse de recibo",cat:"Gesti\xF3n",asunto:"Acuse de recibo \u2014 [Referencia]",cuerpo:`Estimado/a se\xF1or/se\xF1ora:

Por medio del presente, confirmamos la recepci\xF3n del documento/solicitud referenciado(a) como [referencia], recibido(a) el [fecha].

Le informamos que su tr\xE1mite ha sido asignado con el n\xFAmero de expediente [N\xB0] y ser\xE1 atendido en un plazo de [X] d\xEDas h\xE1biles.

Para cualquier consulta, puede comunicarse al [tel\xE9fono] o al correo [email].

Atentamente,
[Nombre]
[Cargo] \xB7 [Instituci\xF3n]`},{icon:"\u{1F514}",name:"Convocatoria a reuni\xF3n",cat:"Comunicaci\xF3n",asunto:"Convocatoria \u2014 Reuni\xF3n [Tema] \xB7 [Fecha]",cuerpo:`Estimado/a se\xF1or/se\xF1ora:

Me permito convocarle a la reuni\xF3n que se llevar\xE1 a cabo:

Fecha: [d\xEDa, fecha]
Hora: [hora]
Lugar: [lugar / enlace Teams/Zoom]
Agenda:
1. [Punto 1]
2. [Punto 2]
3. Asuntos varios

Su asistencia es de suma importancia.

Por favor confirmar asistencia a [correo] a m\xE1s tardar el [fecha].

Atentamente,
[Nombre]
[Cargo] \xB7 [Instituci\xF3n]`},{icon:"\u{1F4CA}",name:"Remisi\xF3n de informe",cat:"Reportes",asunto:"Remisi\xF3n de informe \u2014 [Per\xEDodo]",cuerpo:`Estimado/a se\xF1or/se\xF1ora:

Adjunto al presente correo, remito el informe de [tipo de informe] correspondiente al per\xEDodo [per\xEDodo], para su revisi\xF3n y aprobaci\xF3n.

El informe incluye:
\u2022 [Secci\xF3n 1]
\u2022 [Secci\xF3n 2]
\u2022 Conclusiones y recomendaciones

Quedo a disposici\xF3n para cualquier aclaraci\xF3n.

Atentamente,
[Nombre]
[Cargo] \xB7 [Instituci\xF3n]`},{icon:"\u26A0\uFE0F",name:"Comunicado urgente",cat:"Comunicaci\xF3n",asunto:"URGENTE \u2014 [Tema]",cuerpo:`Estimado/a se\xF1or/se\xF1ora:

Por medio del presente, le informamos con car\xE1cter urgente que [describir la situaci\xF3n].

Se requiere atenci\xF3n inmediata en los siguientes aspectos:
1. [Acci\xF3n requerida 1]
2. [Acci\xF3n requerida 2]

Por favor confirmar recepci\xF3n de este mensaje y las acciones a tomar.

Atentamente,
[Nombre]
[Cargo] \xB7 [Instituci\xF3n]
[Tel\xE9fono directo]`},{icon:"\u{1F393}",name:"Felicitaci\xF3n institucional",cat:"Protocolo",asunto:"Felicitaciones \u2014 [Motivo]",cuerpo:`Estimado/a [Nombre]:

En nombre de [Instituci\xF3n] y en el m\xEDo propio, me es grato extenderle mis m\xE1s sinceras felicitaciones con motivo de [motivo: ascenso, logro, aniversario, etc.].

Su compromiso y dedicaci\xF3n son un ejemplo para toda la instituci\xF3n.

Muy atentamente,
[Nombre]
[Cargo] \xB7 [Instituci\xF3n]`}],cats=[...new Set(plantillas.map(p=>p.cat))];ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4E7} Correos institucionales CR</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">Plantillas para comunicaci\xF3n oficial</div>
      <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;margin-bottom:10px">
        ${["Todas",...cats].map((c,i)=>`
          <button onclick="__correoFilter('${c==="Todas"?"":c}',this)" class="__correoCatBtn"
            style="flex-shrink:0;padding:5px 12px;border:1.5px solid ${i===0?"#003da5":"#eee"};background:${i===0?"#f0f7ff":"#fafafa"};color:${i===0?"#003da5":"#555"};border-radius:20px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s"
            ${i===0?'data-sel="1"':""}>
            ${c}
          </button>`).join("")}
      </div>
    </div>

    <div id="__correoGrid" style="flex:1;overflow-y:auto;padding:0 20px 16px;display:flex;flex-direction:column;gap:8px">
      ${plantillas.map((p,i)=>`
        <button onclick="__correoUse(${i})"
          style="padding:14px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:left;transition:all .15s;display:flex;align-items:center;gap:12px"
          onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'"
          onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'">
          <span style="font-size:24px">${p.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#1a1a1a">${p.name}</div>
            <div style="font-size:11px;color:#888">${p.cat} \xB7 ${p.asunto.slice(0,40)}...</div>
          </div>
          <div style="margin-left:auto;color:#ccc;font-size:16px">\u203A</div>
        </button>`).join("")}
    </div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="document.getElementById('__correoPanel').remove()" style="width:100%;padding:11px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),window.__correoPlantillas=plantillas}function __correoFilter(cat,btn){document.querySelectorAll(".__correoCatBtn").forEach(b=>{b.style.borderColor="#eee",b.style.background="#fafafa",b.style.color="#555",delete b.dataset.sel}),btn.style.borderColor="#003da5",btn.style.background="#f0f7ff",btn.style.color="#003da5",btn.dataset.sel="1";const grid=document.getElementById("__correoGrid");if(!grid)return;const plantillas=window.__correoPlantillas||[],filtered=cat?plantillas.filter(p=>p.cat===cat):plantillas;grid.innerHTML=filtered.map(p=>`<button onclick="__correoUse(${plantillas.indexOf(p)})" style="padding:14px;border:1.5px solid #eee;background:#fafafa;border-radius:12px;cursor:pointer;text-align:left;transition:all .15s;display:flex;align-items:center;gap:12px" onmouseover="this.style.borderColor='#003da5';this.style.background='#f0f7ff'" onmouseout="this.style.borderColor='#eee';this.style.background='#fafafa'"><span style="font-size:24px">${p.icon}</span><div><div style="font-size:13px;font-weight:700;color:#1a1a1a">${p.name}</div><div style="font-size:11px;color:#888">${p.cat}</div></div><div style="margin-left:auto;color:#ccc">\u203A</div></button>`).join("")}function __correoUse(idx){const p=(window.__correoPlantillas||[])[idx];if(!p)return;const html=`
  <div style="font-family:Calibri,Arial,sans-serif;font-size:12pt;max-width:17cm;margin:0 auto">
    <div style="background:#f8f9fa;border:1px solid #ddd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:10pt">
      <div style="display:grid;grid-template-columns:80px 1fr;gap:4px">
        <strong>Para:</strong><span>[Direcci\xF3n de correo del destinatario]</span>
        <strong>Asunto:</strong><span>${p.asunto}</span>
        <strong>Fecha:</strong><span>${new Date().toLocaleString("es-CR")}</span>
      </div>
    </div>
    <div style="line-height:1.8;white-space:pre-line">${p.cuerpo}</div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html+"<p></p>"),document.getElementById("__correoPanel").remove(),showToast(`\u{1F4E7} Correo "${p.name}" insertado \u2705`)}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"rentaCalc":openRentaCalc();break;case"ccssPlanilla":openCCSSPlanilla();break;case"contratoHoras":openContratoHoras();break;case"denunciaLaboral":openDenunciaLaboral();break;case"correosInst":openCorreosInstitucionales();break;default:orig(a)}}),console.log("WC Corporate Editor v25.40 \u2705 \u2014 Renta 2025, CCSS, Contrato Horas, Denuncia MTSS, Correos CR")},4800)})();
