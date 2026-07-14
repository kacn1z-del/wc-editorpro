const WC_MEETING_TIMER={agenda:[],current:-1,elapsed:0,total:0,running:!1,interval:null,open(){const old=document.getElementById("__meetPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__meetPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
    <div style="background:#1a2942;border-radius:20px;max-width:460px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4);overflow:hidden;font-family:-apple-system,sans-serif">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#003da5,#0084ff);padding:16px 20px;display:flex;align-items:center;gap:10px">
        <div style="font-size:22px">\u23F1\uFE0F</div>
        <div>
          <div style="font-size:15px;font-weight:700;color:#fff">Temporizador de reuni\xF3n</div>
          <div id="__meetStatus" style="font-size:11px;color:rgba(255,255,255,.7)">Sin iniciar</div>
        </div>
        <button onclick="WC_MEETING_TIMER.close()" style="margin-left:auto;background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:12px">\u2715</button>
      </div>

      <!-- Display principal -->
      <div style="background:#0a1628;padding:20px;text-align:center">
        <div id="__meetCurrentItem" style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:6px">\u2014</div>
        <div id="__meetClock" style="font-size:52px;font-weight:900;color:#0084ff;letter-spacing:2px;font-variant-numeric:tabular-nums">00:00</div>
        <div id="__meetTotal" style="font-size:11px;color:rgba(255,255,255,.4);margin-top:4px">Tiempo total: 00:00</div>
        <!-- Barra de progreso del \xEDtem actual -->
        <div style="background:rgba(255,255,255,.1);border-radius:4px;height:6px;margin-top:12px;overflow:hidden">
          <div id="__meetItemBar" style="height:100%;background:#0084ff;width:0%;transition:width .5s;border-radius:4px"></div>
        </div>
      </div>

      <!-- Controles -->
      <div style="display:flex;gap:8px;padding:12px 16px;background:#0f1f3d">
        <button onclick="WC_MEETING_TIMER.toggle()" id="__meetPlayBtn"
          style="flex:2;padding:12px;border:none;background:#0084ff;color:#fff;border-radius:10px;cursor:pointer;font-size:15px;font-weight:700">\u25B6 Iniciar</button>
        <button onclick="WC_MEETING_TIMER.nextItem()"
          style="flex:1;padding:12px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Siguiente \u2192</button>
        <button onclick="WC_MEETING_TIMER.reset()"
          style="flex:1;padding:12px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u21BA Reset</button>
      </div>

      <!-- Agenda -->
      <div style="flex:1;overflow-y:auto;padding:12px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Agenda</div>
          <button onclick="WC_MEETING_TIMER.addItemUI()" style="padding:4px 10px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#fff;border-radius:6px;cursor:pointer;font-size:11px">+ Agregar</button>
        </div>
        <div id="__meetAgendaList"></div>

        <!-- Formulario agregar \xEDtem -->
        <div id="__meetAddForm" style="display:none;background:rgba(255,255,255,.05);border-radius:10px;padding:10px;margin-top:8px">
          <input type="text" id="__meetItemName" placeholder="Nombre del punto (ej: Informe financiero)"
            style="width:100%;padding:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:7px;color:#fff;font-size:12px;outline:none;box-sizing:border-box;margin-bottom:6px">
          <div style="display:flex;gap:6px">
            <input type="number" id="__meetItemMins" placeholder="Minutos" min="1" max="120" value="5"
              style="flex:1;padding:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:7px;color:#fff;font-size:12px;outline:none">
            <button onclick="WC_MEETING_TIMER.addItem()"
              style="flex:2;padding:8px;border:none;background:#0084ff;color:#fff;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600">Agregar punto</button>
          </div>
        </div>
      </div>

      <!-- Insertar resumen -->
      <div style="padding:10px 16px;border-top:1px solid rgba(255,255,255,.1)">
        <button onclick="WC_MEETING_TIMER.insertSummary()"
          style="width:100%;padding:10px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#fff;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">
          \u{1F4CB} Insertar resumen de reuni\xF3n
        </button>
      </div>
    </div>`,document.body.appendChild(ov),this._renderAgenda()},addItemUI(){const f=document.getElementById("__meetAddForm");f&&(f.style.display=f.style.display==="none"?"block":"none"),document.getElementById("__meetItemName")?.focus()},addItem(){const name=document.getElementById("__meetItemName")?.value.trim(),mins=parseInt(document.getElementById("__meetItemMins")?.value)||5;if(!name){showToast("Escrib\xED el nombre del punto");return}this.agenda.push({name,mins,elapsed:0,done:!1}),document.getElementById("__meetItemName").value="",document.getElementById("__meetItemMins").value="5",document.getElementById("__meetAddForm").style.display="none",this._renderAgenda()},removeItem(idx){this.agenda.splice(idx,1),this.current>=this.agenda.length&&(this.current=this.agenda.length-1),this._renderAgenda()},_renderAgenda(){const list=document.getElementById("__meetAgendaList");if(!list)return;const totalMins=this.agenda.reduce((s,a)=>s+a.mins,0);list.innerHTML=this.agenda.length?this.agenda.map((item,i)=>`
          <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;margin-bottom:6px;background:${i===this.current?"rgba(0,132,255,.25)":item.done?"rgba(39,174,96,.15)":"rgba(255,255,255,.05)"};border:1.5px solid ${i===this.current?"#0084ff":item.done?"#27ae60":"rgba(255,255,255,.1)"}">
            <div style="width:24px;height:24px;border-radius:50%;background:${item.done?"#27ae60":i===this.current?"#0084ff":"rgba(255,255,255,.2)"};display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700;flex-shrink:0">${item.done?"\u2713":i+1}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.name}</div>
              <div style="font-size:10px;color:rgba(255,255,255,.5)">${item.mins} min${i===this.current?` \xB7 ${this._fmt(item.elapsed)} transcurrido`:""}</div>
            </div>
            <button onclick="WC_MEETING_TIMER.removeItem(${i})" style="background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:14px">\xD7</button>
          </div>`).join("")+`<div style="text-align:center;font-size:11px;color:rgba(255,255,255,.4);margin-top:6px">Total: ${totalMins} minutos</div>`:'<div style="text-align:center;color:rgba(255,255,255,.3);font-size:12px;padding:16px">Agreg\xE1 puntos de agenda arriba</div>'},toggle(){if(!this.agenda.length){showToast("Agreg\xE1 puntos de agenda primero");return}this.running=!this.running,this.running?(this.current<0&&(this.current=0),this.interval=setInterval(()=>this._tick(),1e3),document.getElementById("__meetPlayBtn").textContent="\u23F8 Pausar",document.getElementById("__meetStatus").textContent="En curso..."):(clearInterval(this.interval),document.getElementById("__meetPlayBtn").textContent="\u25B6 Reanudar",document.getElementById("__meetStatus").textContent="Pausado")},_tick(){const item=this.agenda[this.current];if(!item)return;item.elapsed++,this.elapsed++;const pct=Math.min(100,Math.round(item.elapsed/(item.mins*60)*100)),clock=document.getElementById("__meetClock"),bar=document.getElementById("__meetItemBar"),cur=document.getElementById("__meetCurrentItem"),tot=document.getElementById("__meetTotal");clock&&(clock.textContent=this._fmt(item.elapsed)),bar&&(bar.style.width=pct+"%"),bar&&(bar.style.background=pct>=90?"#e74c3c":pct>=75?"#f39c12":"#0084ff"),cur&&(cur.textContent=`${this.current+1}/${this.agenda.length} \xB7 ${item.name}`),tot&&(tot.textContent=`Total: ${this._fmt(this.elapsed)}`),item.elapsed>=item.mins*60&&this._itemDone(),this._renderAgenda()},_itemDone(){this.agenda[this.current].done=!0,this._beep(),showToast(`\u2705 "${this.agenda[this.current].name}" completado`),this.nextItem()},nextItem(){this.current<this.agenda.length-1?(this.agenda[this.current].done=!0,this.current++,this.agenda[this.current].elapsed=0,document.getElementById("__meetItemBar").style.width="0%"):(clearInterval(this.interval),this.running=!1,document.getElementById("__meetPlayBtn").textContent="\u2705 Finalizado",document.getElementById("__meetStatus").textContent="Reuni\xF3n completada",this._beep(),this._beep(),showToast("\u{1F389} Reuni\xF3n completada")),this._renderAgenda()},reset(){clearInterval(this.interval),this.running=!1,this.current=-1,this.elapsed=0,this.agenda.forEach(a=>{a.elapsed=0,a.done=!1}),document.getElementById("__meetClock").textContent="00:00",document.getElementById("__meetItemBar").style.width="0%",document.getElementById("__meetPlayBtn").textContent="\u25B6 Iniciar",document.getElementById("__meetStatus").textContent="Sin iniciar",document.getElementById("__meetCurrentItem").textContent="\u2014",this._renderAgenda()},_fmt(s){const m=Math.floor(s/60),sec=s%60;return`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`},_beep(){try{const ctx=new(window.AudioContext||window.webkitAudioContext),osc=ctx.createOscillator();osc.connect(ctx.destination),osc.frequency.value=880,osc.start(),setTimeout(()=>osc.stop(),300)}catch{}},insertSummary(){const total=this._fmt(this.elapsed),html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #003da5;border-radius:10px;overflow:hidden;max-width:500px;margin:12px auto">
      <div style="background:#003da5;color:#fff;padding:10px 16px;font-weight:700">\u23F1\uFE0F Resumen de reuni\xF3n \xB7 ${new Date().toLocaleString("es-CR")}</div>
      <table style="border-collapse:collapse;width:100%;font-size:10pt">
        <tr style="background:#f0f7ff"><th style="padding:7px 10px;border:1px solid #ddd;text-align:left">Punto</th><th style="padding:7px 10px;border:1px solid #ddd">Asignado</th><th style="padding:7px 10px;border:1px solid #ddd">Real</th><th style="padding:7px 10px;border:1px solid #ddd">Estado</th></tr>
        ${this.agenda.map(a=>`<tr><td style="padding:6px 10px;border:1px solid #ddd">${a.name}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${a.mins} min</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${this._fmt(a.elapsed)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${a.done?"\u2705":"\u23F3"}</td></tr>`).join("")}
        <tr style="background:#003da5;color:#fff"><td colspan="2" style="padding:7px 10px;font-weight:700">Tiempo total</td><td colspan="2" style="padding:7px 10px;text-align:center;font-weight:700">${total}</td></tr>
      </table>
    </div>`;typeof insertHTML=="function"&&insertHTML(html),this.close(),showToast("\u{1F4CB} Resumen insertado \u2705")},close(){clearInterval(this.interval),this.running=!1,document.getElementById("__meetPanel")?.remove()}};function openMeetingTimer(){WC_MEETING_TIMER.open()}function openOrgChart(){const old=document.getElementById("__orgPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__orgPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:14px",ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:540px;width:100%;max-height:94vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="padding:18px 20px 0;flex-shrink:0">
      <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F3E2} Generador de organigrama SVG</div>
      <div style="font-size:12px;color:#888;margin-bottom:14px">Crea organigramas profesionales exportables</div>

      <div style="display:flex;gap:8px;margin-bottom:10px">
        <div style="flex:1">
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Color principal</label>
          <input type="color" id="__orgColor" value="#003da5" style="width:100%;height:34px;border:1.5px solid #eee;border-radius:8px;cursor:pointer">
        </div>
        <div style="flex:1">
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Estilo</label>
          <select id="__orgStyle" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="rect">Rect\xE1ngulos</option>
            <option value="round">Redondeados</option>
            <option value="pill">P\xEDldoras</option>
          </select>
        </div>
        <div style="flex:1">
          <label style="font-size:10px;font-weight:700;color:#555;display:block;margin-bottom:2px">Direcci\xF3n</label>
          <select id="__orgDir" style="width:100%;padding:7px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
      </div>

      <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px">Nodos del organigrama</div>
      <div style="font-size:10px;color:#aaa;margin-bottom:8px">Formato: Nombre del nodo | Cargo/descripci\xF3n | ID padre (0=ra\xEDz)</div>
      <textarea id="__orgNodes" rows="7" style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:11px;outline:none;resize:none;box-sizing:border-box;font-family:'Courier New',monospace"
        onfocus="this.style.borderColor='#003da5'" onblur="this.style.borderColor='#e0e0e0'">Gerencia General | CEO | 0
Finanzas | Director Financiero | 1
Operaciones | Director de Ops | 1
Marketing | Director de Mkt | 1
Contabilidad | Jefe de Contabilidad | 2
Tesorer\xEDa | Tesorero | 2
Producci\xF3n | Jefe de Producci\xF3n | 3
Log\xEDstica | Jefe de Log\xEDstica | 3
Dise\xF1o | Dise\xF1ador Sr | 4
Redes Sociales | Community Mgr | 4</textarea>
    </div>

    <div id="__orgPreview" style="flex:1;overflow:auto;padding:12px 20px;background:#f8f9fa;min-height:100px"></div>

    <div style="padding:12px 20px 16px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0">
      <button onclick="document.getElementById('__orgPanel').remove()" style="flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__previewOrg()" style="flex:1;padding:10px;border:1.5px solid #003da5;background:#fff;color:#003da5;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\u{1F441} Vista previa</button>
      <button onclick="__insertOrg()" style="flex:2;padding:10px;border:none;background:#003da5;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F3E2} Insertar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()}),setTimeout(__previewOrg,200)}function __parseOrgNodes(){return(document.getElementById("__orgNodes")?.value||"").split(`
`).filter(l=>l.trim()).map((l,i)=>{const[name="",sub="",parentStr="0"]=l.split("|").map(s=>s.trim());return{id:i+1,name,sub,parent:parseInt(parentStr)||0}})}function __buildOrgSVG(nodes,color,style,dir){if(!nodes.length)return'<p style="color:#aaa">Sin nodos</p>';const rx=style==="pill"?25:style==="round"?8:2,nW=160,nH=52,hGap=20,vGap=40,root=nodes.find(n=>n.parent===0);if(!root)return'<p style="color:#aaa">Defin\xED un nodo ra\xEDz (padre=0)</p>';const levels={},setLevel=(id,lv)=>{nodes.find(n2=>n2.id===id)&&(levels[id]=lv,nodes.filter(c=>c.parent===id).forEach(c=>setLevel(c.id,lv+1)))};setLevel(root.id,0);const maxLv=Math.max(...Object.values(levels)),byLv={};nodes.forEach(n=>{const lv=levels[n.id]??0;byLv[lv]||(byLv[lv]=[]),byLv[lv].push(n)});const positions={};for(let lv=0;lv<=maxLv;lv++){const row=byLv[lv]||[],rowW=row.length*(nW+hGap)-hGap;row.forEach((n,i)=>{if(dir==="horizontal")positions[n.id]={x:lv*(nW+vGap)+10,y:i*(nH+hGap)+10};else{const startX=(800-rowW)/2;positions[n.id]={x:startX+i*(nW+hGap),y:lv*(nH+vGap)+10}}})}const svgW=dir==="horizontal"?(maxLv+1)*(nW+vGap)+20:820,svgH=dir==="horizontal"?Math.max(...Object.values(byLv).map(r=>r.length))*(nH+hGap)+20:(maxLv+1)*(nH+vGap)+20;let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" style="max-width:100%;font-family:Calibri,Arial,sans-serif">`;return nodes.forEach(n=>{if(!n.parent||!positions[n.id]||!positions[n.parent])return;const from=positions[n.parent],to=positions[n.id],fx=from.x+nW/2,fy=from.y+nH,tx=to.x+nW/2,ty=to.y,my=(fy+ty)/2;svg+=`<path d="M ${fx} ${fy} C ${fx} ${my} ${tx} ${my} ${tx} ${ty}" fill="none" stroke="${color}" stroke-width="1.5" opacity=".4"/>`}),nodes.forEach(n=>{if(!positions[n.id])return;const{x,y}=positions[n.id],isRoot=n.parent===0,bg=isRoot?color:`${color}22`,tc=isRoot?"#fff":color;svg+=`<rect x="${x}" y="${y}" width="${nW}" height="${nH}" rx="${rx}" ry="${rx}" fill="${bg}" stroke="${color}" stroke-width="${isRoot?2:1.5}"/>`,svg+=`<text x="${x+nW/2}" y="${y+20}" text-anchor="middle" font-size="13" font-weight="700" fill="${tc}" dominant-baseline="middle">${n.name.slice(0,20)}</text>`,svg+=`<text x="${x+nW/2}" y="${y+36}" text-anchor="middle" font-size="10" fill="${tc}" opacity=".8" dominant-baseline="middle">${n.sub.slice(0,24)}</text>`}),svg+="</svg>",svg}function __previewOrg(){const nodes=__parseOrgNodes(),color=document.getElementById("__orgColor")?.value||"#003da5",style=document.getElementById("__orgStyle")?.value||"rect",dir=document.getElementById("__orgDir")?.value||"vertical",prev=document.getElementById("__orgPreview");prev&&(prev.innerHTML=__buildOrgSVG(nodes,color,style,dir))}function __insertOrg(){const nodes=__parseOrgNodes(),color=document.getElementById("__orgColor")?.value||"#003da5",style=document.getElementById("__orgStyle")?.value||"rect",dir=document.getElementById("__orgDir")?.value||"vertical",svg=__buildOrgSVG(nodes,color,style,dir);typeof insertHTML=="function"&&insertHTML(`<div style="text-align:center;margin:12px 0">${svg}</div>`),document.getElementById("__orgPanel").remove(),showToast("\u{1F3E2} Organigrama insertado \u2705")}const WC_TASKS={tasks:JSON.parse(localStorage.getItem("wc-tasks")||"[]"),save(){localStorage.setItem("wc-tasks",JSON.stringify(this.tasks))},add(title,date,priority){this.tasks.push({id:Date.now(),title,date,priority,done:!1,created:Date.now()}),this.save(),this._checkNotifications()},toggle(id){const t=this.tasks.find(t2=>t2.id===id);t&&(t.done=!t.done,this.save())},delete(id){this.tasks=this.tasks.filter(t=>t.id!==id),this.save()},_checkNotifications(){if(!("Notification"in window))return;const today=new Date().toISOString().split("T")[0],due=this.tasks.filter(t=>!t.done&&t.date===today);due.length&&Notification.permission==="granted"&&new Notification("WC Editor \u2014 Tareas vencidas hoy",{body:due.map(t=>t.title).join(", "),icon:"\u{1F4CB}"})}};function openTasksPanel(){const old=document.getElementById("__tasksPanel");old&&old.remove();const ov=document.createElement("div");ov.id="__tasksPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center","Notification"in window&&Notification.permission==="default"&&Notification.requestPermission();const today=new Date().toISOString().split("T")[0],pending=WC_TASKS.tasks.filter(t=>!t.done),done=WC_TASKS.tasks.filter(t=>t.done);ov.innerHTML=`
  <div style="background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.2);font-family:-apple-system,sans-serif">
    <div style="padding:14px 18px 0;flex-shrink:0">
      <div style="width:40px;height:5px;background:#ddd;border-radius:3px;margin:0 auto 12px"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <div style="font-size:17px;font-weight:700;color:#1a2942;flex:1">\u2705 Tareas del documento</div>
        <div style="background:#e74c3c;color:#fff;border-radius:12px;padding:3px 10px;font-size:12px;font-weight:700">${pending.length} pendientes</div>
      </div>

      <!-- Formulario nueva tarea -->
      <div style="background:#f8f9fa;border-radius:12px;padding:12px;margin-bottom:14px">
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <input type="text" id="__taskTitle" placeholder="Nueva tarea..."
            style="flex:1;padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none"
            onfocus="this.style.borderColor='#9b59b6'" onblur="this.style.borderColor='#e0e0e0'"
            onkeydown="if(event.key==='Enter')__addTask()">
        </div>
        <div style="display:flex;gap:6px">
          <input type="date" id="__taskDate" value="${today}"
            style="flex:2;padding:7px;border:1.5px solid #eee;border-radius:8px;font-size:12px;outline:none">
          <select id="__taskPriority" style="flex:1;padding:7px;border:1.5px solid #eee;border-radius:8px;font-size:11px;outline:none">
            <option value="alta">\u{1F534} Alta</option>
            <option value="media" selected>\u{1F7E1} Media</option>
            <option value="baja">\u{1F7E2} Baja</option>
          </select>
          <button onclick="__addTask()" style="padding:7px 14px;border:none;background:#9b59b6;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+</button>
        </div>
      </div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:0 18px 16px">
      <!-- Pendientes -->
      <div id="__taskList">
        ${pending.length?pending.sort((a,b)=>{const po={alta:0,media:1,baja:2};return po[a.priority]-po[b.priority]||new Date(a.date)-new Date(b.date)}).map(t=>{const overdue=t.date&&t.date<today&&!t.done,dueToday=t.date===today,prColors={alta:"#e74c3c",media:"#f39c12",baja:"#27ae60"};return`<div style="display:flex;align-items:flex-start;gap:10px;padding:12px;border:1.5px solid ${overdue?"#fde8e8":dueToday?"#fff9e6":"#eee"};background:${overdue?"#fde8e800":dueToday?"#fffde700":"#fff"};border-radius:12px;margin-bottom:8px">
                <button onclick="WC_TASKS.toggle(${t.id});openTasksPanel()" style="width:22px;height:22px;border:2px solid ${prColors[t.priority]};background:none;border-radius:50%;cursor:pointer;flex-shrink:0;margin-top:1px"></button>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:600;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</div>
                  <div style="font-size:10px;color:${overdue?"#e74c3c":dueToday?"#f39c12":"#aaa"};margin-top:2px">
                    ${overdue?"\u26A0\uFE0F Vencida \xB7 ":dueToday?"\u{1F4C5} Hoy \xB7 ":"\u{1F4C5} "}${t.date||"Sin fecha"} \xB7 ${t.priority}
                  </div>
                </div>
                <button onclick="WC_TASKS.delete(${t.id});openTasksPanel()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:16px;padding:0">\xD7</button>
              </div>`}).join(""):'<div style="text-align:center;color:#bbb;padding:20px;font-size:13px">\u2705 Sin tareas pendientes</div>'}
      </div>

      <!-- Completadas -->
      ${done.length?`
        <div style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 8px;display:flex;justify-content:space-between">
          <span>Completadas (${done.length})</span>
          <button onclick="WC_TASKS.tasks=WC_TASKS.tasks.filter(t=>!t.done);WC_TASKS.save();openTasksPanel()" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:10px">Limpiar</button>
        </div>
        ${done.slice(0,5).map(t=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f0fff4;border-radius:8px;margin-bottom:6px;opacity:.7">
          <span style="color:#27ae60;font-size:16px">\u2705</span>
          <span style="font-size:12px;color:#555;text-decoration:line-through;flex:1">${t.title}</span>
          <button onclick="WC_TASKS.delete(${t.id});openTasksPanel()" style="background:none;border:none;color:#bbb;cursor:pointer;font-size:13px">\xD7</button>
        </div>`).join("")}`:""}
    </div>

    <div style="padding:10px 18px;border-top:1px solid #eee;flex-shrink:0">
      <button onclick="__insertTaskList()" style="width:100%;padding:10px;border:none;background:#9b59b6;color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;margin-bottom:6px">\u{1F4CB} Insertar lista de tareas</button>
      <button onclick="document.getElementById('__tasksPanel').remove()" style="width:100%;padding:10px;border:none;background:#f0f0f0;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#333">Cerrar</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()})}function __addTask(){const title=document.getElementById("__taskTitle")?.value.trim(),date=document.getElementById("__taskDate")?.value,priority=document.getElementById("__taskPriority")?.value||"media";if(!title){showToast("Escrib\xED la tarea");return}WC_TASKS.add(title,date,priority),openTasksPanel()}function __insertTaskList(){const pending=WC_TASKS.tasks.filter(t=>!t.done);if(!pending.length){showToast("No hay tareas pendientes");return}const prIcons={alta:"\u{1F534}",media:"\u{1F7E1}",baja:"\u{1F7E2}"},html=`<div style="font-family:Calibri,Arial,sans-serif;border:2px solid #9b59b6;border-radius:10px;overflow:hidden;max-width:500px;margin:12px auto">
    <div style="background:#9b59b6;color:#fff;padding:10px 16px;font-weight:700">\u2705 Lista de tareas \xB7 ${new Date().toLocaleDateString("es-CR")}</div>
    <div style="padding:12px 16px">
      ${pending.map(t=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0e6ff">
        <span>${prIcons[t.priority]}</span>
        <span style="flex:1;font-size:11pt">${t.title}</span>
        <span style="font-size:9pt;color:#888">${t.date||"Sin fecha"}</span>
        <span style="font-size:11pt">\u2610</span>
      </div>`).join("")}
    </div>
  </div>`;typeof insertHTML=="function"&&insertHTML(html),document.getElementById("__tasksPanel").remove(),showToast("\u{1F4CB} Lista de tareas insertada \u2705")}setTimeout(()=>WC_TASKS._checkNotifications(),3e3);const WC_TABS={docs:JSON.parse(localStorage.getItem("wc-tabs-docs")||"[]"),current:parseInt(localStorage.getItem("wc-tabs-cur")||"0"),bar:null,init(){if(!this.docs.length){const ed=document.getElementById("editor");this.docs=[{id:1,title:"Documento 1",content:ed?.innerHTML||""}],this.current=0}this._renderBar()},save(){const ed=document.getElementById("editor");ed&&this.docs[this.current]&&(this.docs[this.current].content=ed.innerHTML,this.docs[this.current].title=ed.innerText.trim().split(`
`)[0].slice(0,30)||"Sin t\xEDtulo"),localStorage.setItem("wc-tabs-docs",JSON.stringify(this.docs)),localStorage.setItem("wc-tabs-cur",String(this.current))},newDoc(){this.save();const id=Date.now();this.docs.push({id,title:"Nuevo documento",content:"<p></p>"}),this.current=this.docs.length-1,this._load(this.current),this._renderBar(),showToast("\u{1F4C4} Nuevo documento creado")},switchTo(idx){this.save(),this.current=idx,this._load(idx),this._renderBar()},closeDoc(idx){if(this.docs.length<=1){showToast("No pod\xE9s cerrar el \xFAnico documento");return}this.docs.splice(idx,1),this.current=Math.min(this.current,this.docs.length-1),this._load(this.current),this._renderBar(),this.save()},_load(idx){const ed=document.getElementById("editor");ed&&this.docs[idx]&&(ed.innerHTML=this.docs[idx].content,showToast(`\u{1F4C4} ${this.docs[idx].title}`))},_renderBar(){const old=document.getElementById("__wcTabsBar");old&&old.remove();const bar=document.createElement("div");bar.id="__wcTabsBar",bar.style.cssText="position:sticky;top:0;z-index:600;background:#f0f0f0;border-bottom:2px solid #ddd;display:flex;align-items:center;overflow-x:auto;scrollbar-width:none;font-family:-apple-system,sans-serif;min-height:36px",bar.innerHTML=this.docs.map((d,i)=>`
      <div onclick="WC_TABS.switchTo(${i})" style="display:flex;align-items:center;gap:4px;padding:6px 14px;cursor:pointer;border-right:1px solid #ddd;white-space:nowrap;font-size:12px;font-weight:${i===this.current?"700":"400"};color:${i===this.current?"#003da5":"#555"};background:${i===this.current?"#fff":"transparent"};border-top:2px solid ${i===this.current?"#003da5":"transparent"};flex-shrink:0;min-width:80px;max-width:140px">
        <span style="overflow:hidden;text-overflow:ellipsis;flex:1">\u{1F4C4} ${d.title}</span>
        <button onclick="event.stopPropagation();WC_TABS.closeDoc(${i})" style="background:none;border:none;color:#bbb;cursor:pointer;font-size:12px;padding:0;margin-left:2px;flex-shrink:0">\xD7</button>
      </div>`).join("")+'<button onclick="WC_TABS.newDoc()" style="padding:6px 12px;border:none;background:none;cursor:pointer;font-size:16px;color:#888;flex-shrink:0" title="Nuevo documento">+</button>';const ed=document.getElementById("editor"),par=ed?.parentElement;par&&par.insertBefore(bar,ed),this.bar=bar,ed?.removeEventListener("input",this._saveHandler),this._saveHandler=()=>{clearTimeout(this._saveTimer),this._saveTimer=setTimeout(()=>this.save(),2e3)},ed?.addEventListener("input",this._saveHandler)}};function openTabsMode(){WC_TABS.bar?(document.getElementById("__wcTabsBar")?.remove(),WC_TABS.bar=null,showToast("Modo multidocumento desactivado")):(WC_TABS.init(),showToast("\u{1F4D1} Modo multidocumento activado"))}function openEPUBExport(){const old=document.getElementById("__epubPanel");old&&old.remove();const ed=document.getElementById("editor"),ov=document.createElement("div");ov.id="__epubPanel",ov.style.cssText="position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px";const wordCount=ed?ed.innerText.trim().split(/\s+/).filter(w=>w).length:0;ov.innerHTML=`
  <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="font-size:17px;font-weight:700;color:#1a2942;margin-bottom:4px">\u{1F4DA} Exportar a EPUB</div>
    <div style="font-size:12px;color:#888;margin-bottom:16px">Formato de libro digital \xB7 ${wordCount} palabras</div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${[["__epubTitle","T\xEDtulo del libro *","Mi documento"],["__epubAuthor","Autor *","Keny Chinchilla Navarro"],["__epubDesc","Descripci\xF3n (synopsis)",""],["__epubLang","Idioma","es-CR"],["__epubPublisher","Editorial / Publisher","WC Corporate Editor"]].map(([id,label,ph])=>`
        <div>
          <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:2px">${label}</label>
          <input type="text" id="${id}" placeholder="${ph}"
            style="width:100%;padding:8px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#27ae60'" onblur="this.style.borderColor='#e0e0e0'">
        </div>`).join("")}

      <div>
        <label style="font-size:11px;font-weight:700;color:#555;display:block;margin-bottom:6px">Opciones</label>
        <div style="display:flex;flex-direction:column;gap:5px">
          ${[["__epubTOC","Incluir tabla de contenidos"],["__epubCover","Portada autom\xE1tica"],["__epubCSS","Estilos tipogr\xE1ficos"]].map(([id,label])=>`
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#555">
              <input type="checkbox" id="${id}" checked style="accent-color:#27ae60;width:14px;height:14px"> ${label}
            </label>`).join("")}
        </div>
      </div>
    </div>

    <div style="background:#f0fff4;border-radius:10px;padding:10px;margin-bottom:14px;font-size:11px;color:#155724;line-height:1.7">
      \u{1F4DA} Genera un archivo <strong>.epub</strong> compatible con Apple Books, Kindle (via conversi\xF3n) y lectores EPUB. Los t\xEDtulos H1/H2 se convierten en cap\xEDtulos autom\xE1ticamente.
    </div>

    <div style="display:flex;gap:8px">
      <button onclick="document.getElementById('__epubPanel').remove()" style="flex:1;padding:11px;border:1.5px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">Cancelar</button>
      <button onclick="__generateEPUB()" style="flex:2;padding:11px;border:none;background:#27ae60;color:#fff;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600">\u{1F4DA} Descargar EPUB</button>
    </div>
  </div>`,document.body.appendChild(ov),ov.addEventListener("click",e=>{e.target===ov&&ov.remove()});const firstH=ed?.querySelector("h1,h2");firstH&&(document.getElementById("__epubTitle").value=firstH.innerText.trim().slice(0,60))}async function __generateEPUB(){const ed=document.getElementById("editor");if(!ed)return;const title=document.getElementById("__epubTitle")?.value.trim()||"Documento",author=document.getElementById("__epubAuthor")?.value.trim()||"Autor",desc=document.getElementById("__epubDesc")?.value.trim()||"",lang=document.getElementById("__epubLang")?.value.trim()||"es",publisher=document.getElementById("__epubPublisher")?.value.trim()||"WC Corporate Editor",inclTOC=document.getElementById("__epubTOC")?.checked,inclCover=document.getElementById("__epubCover")?.checked,inclCSS=document.getElementById("__epubCSS")?.checked,uuid="wc-"+Date.now(),fecha=new Date().toISOString().split("T")[0],chapters=[];let cur={title:"Introducci\xF3n",content:""};Array.from(ed.childNodes).forEach(node=>{const tag=node.tagName?.toLowerCase();tag==="h1"||tag==="h2"?(cur.content.trim()&&chapters.push(cur),cur={title:node.innerText||node.textContent||"Cap\xEDtulo",content:node.outerHTML}):node.nodeType===1&&(cur.content+=node.outerHTML)}),cur.content.trim()&&chapters.push(cur),chapters.length||chapters.push({title:"Contenido",content:ed.innerHTML});const css=inclCSS?`
    body{font-family:Georgia,"Times New Roman",serif;font-size:1em;line-height:1.8;margin:5% 8%;color:#1a1a1a;}
    h1{font-size:1.8em;color:#003da5;border-bottom:2px solid #003da5;padding-bottom:.3em;margin-top:1.5em;}
    h2{font-size:1.4em;color:#1a2942;margin-top:1.2em;}
    h3{font-size:1.1em;color:#333;}
    p{margin:.8em 0;text-align:justify;}
    table{border-collapse:collapse;width:100%;margin:1em 0;}
    th{background:#003da5;color:#fff;padding:.5em .8em;}
    td{padding:.4em .8em;border:1px solid #ddd;}
    blockquote{border-left:3px solid #003da5;margin-left:0;padding-left:1em;color:#555;font-style:italic;}
    img{max-width:100%;height:auto;}
    .page-break{page-break-after:always;}
  `:"body{font-family:serif;line-height:1.6;margin:5%;}",files={};files.mimetype="application/epub+zip",files["META-INF/container.xml"]=`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,files["OEBPS/style.css"]=css,inclCover&&(files["OEBPS/cover.xhtml"]=`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">
<head><title>${title}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body style="text-align:center;padding:20%">
  <h1 style="font-size:2em;color:#003da5;border:none">${title}</h1>
  <p style="color:#555;font-size:1.2em">${author}</p>
  <p style="color:#888;font-size:.9em">${publisher} \xB7 ${fecha}</p>
  ${desc?`<p style="margin-top:2em;font-style:italic;color:#666">${desc}</p>`:""}
</body>
</html>`);let tocItems="";inclTOC&&(tocItems=chapters.map((c,i)=>`<li><a href="chapter${i+1}.xhtml">${c.title}</a></li>`).join(`
    `),files["OEBPS/toc.xhtml"]=`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">
<head><title>Tabla de contenidos</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body><h1>Contenidos</h1><ol>${tocItems}</ol></body>
</html>`),chapters.forEach((c,i)=>{const clean=c.content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi,"").replace(/style="[^"]*"/g,"").replace(/class="[^"]*"/g,"").replace(/<(div|span)([^>]*)>/g,"<p$2>").replace(/<\/(div|span)>/g,"</p>");files[`OEBPS/chapter${i+1}.xhtml`]=`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">
<head><title>${c.title}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>${clean}</body>
</html>`}),files["OEBPS/toc.ncx"]=`<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head><meta name="dtb:uid" content="${uuid}"/></head>
  <docTitle><text>${title}</text></docTitle>
  <navMap>
    ${inclCover?'<navPoint id="cover" playOrder="0"><navLabel><text>Portada</text></navLabel><content src="cover.xhtml"/></navPoint>':""}
    ${inclTOC?'<navPoint id="toc" playOrder="1"><navLabel><text>Contenidos</text></navLabel><content src="toc.xhtml"/></navPoint>':""}
    ${chapters.map((c,i)=>`<navPoint id="ch${i+1}" playOrder="${i+2}"><navLabel><text>${c.title}</text></navLabel><content src="chapter${i+1}.xhtml"/></navPoint>`).join(`
    `)}
  </navMap>
</ncx>`;const manifestItems=['<item id="style" href="style.css" media-type="text/css"/>','<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',inclCover?'<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>':"",inclTOC?'<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml"/>':"",...chapters.map((_,i)=>`<item id="ch${i+1}" href="chapter${i+1}.xhtml" media-type="application/xhtml+xml"/>`)].filter(Boolean).join(`
    `),spineItems=[inclCover?'<itemref idref="cover"/>':"",inclTOC?'<itemref idref="toc"/>':"",...chapters.map((_,i)=>`<itemref idref="ch${i+1}"/>`)].filter(Boolean).join(`
    `);files["OEBPS/content.opf"]=`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${title}</dc:title>
    <dc:creator>${author}</dc:creator>
    <dc:language>${lang}</dc:language>
    <dc:identifier id="BookId">${uuid}</dc:identifier>
    <dc:publisher>${publisher}</dc:publisher>
    <dc:date>${fecha}</dc:date>
    ${desc?`<dc:description>${desc}</dc:description>`:""}
  </metadata>
  <manifest>${manifestItems}</manifest>
  <spine toc="ncx">${spineItems}</spine>
</package>`,showToast("\u23F3 Generando EPUB..."),window.JSZip||await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",s.onload=res,s.onerror=rej,document.head.appendChild(s)});const zip=new window.JSZip;zip.file("mimetype",files.mimetype,{compression:"STORE"}),delete files.mimetype,Object.entries(files).forEach(([path,content])=>{zip.file(path,content)});const blob=await zip.generateAsync({type:"blob",mimeType:"application/epub+zip"}),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=title.replace(/\s+/g,"-").toLowerCase().slice(0,40)+".epub",a.click(),document.getElementById("__epubPanel").remove(),showToast(`\u{1F4DA} EPUB "${title}" descargado \u2705 \xB7 ${chapters.length} cap\xEDtulos`)}(function(){setTimeout(function(){const orig=window.handleAction;typeof orig=="function"&&(window.handleAction=function(a){switch(a){case"meetingTimer":openMeetingTimer();break;case"orgChart":openOrgChart();break;case"tasksPanel":openTasksPanel();break;case"tabsMode":openTabsMode();break;case"epubExport":openEPUBExport();break;default:orig(a)}}),console.log("WC Corporate Editor v25.42 \u2705 \u2014 Temporizador, Organigrama, Tareas, Pesta\xF1as, EPUB")},5e3)})();
