/* PANEL DE ADMINISTRACIÓN (demostración). Sin autenticación ni sincronización entre dispositivos.
   Usa store.js/data.js: los datos y su formato no cambian. */
'use strict';
(() => {
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const S=EnObraStore;
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const okMedia=u=>/^(assets\/[\w.\/-]+|https:\/\/\S+|data:image\/(png|jpeg|webp|gif);base64,[\w+\/=]+)$/i.test(u||'');
const Q=n=>'Q'+Number(n).toLocaleString('es-GT');
const IC={"home": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"5\" rx=\"1\"/><rect x=\"14\" y=\"12\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"3\" y=\"16\" width=\"7\" height=\"5\" rx=\"1\"/>", "projects": "<path d=\"M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h.01M15 10h.01M9 13h.01M15 13h.01\"/>", "properties": "<path d=\"M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10\"/>", "news": "<path d=\"M4 4h13v16H6a2 2 0 0 1-2-2zM17 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h3\"/>", "settings": "<path d=\"M4 6h8M16 6h4M4 12h2M10 12h10M4 18h10M18 18h2\"/><circle cx=\"14\" cy=\"6\" r=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"2\"/><circle cx=\"16\" cy=\"18\" r=\"2\"/>", "backup": "<path d=\"M12 4v11M7 11l5 5 5-5M4 20h16\"/>", "edit": "<path d=\"M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4\"/>", "trash": "<path d=\"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3\"/>", "grid": "<rect x=\"4\" y=\"4\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"13\" y=\"4\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"4\" y=\"13\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"13\" y=\"13\" width=\"7\" height=\"7\" rx=\"1\"/>", "list": "<path d=\"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01\"/>", "image": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"1.5\"/><path d=\"M21 16l-5-5-9 9\"/>", "tag": "<path d=\"M3 12V4h8l10 10-8 8z\"/><circle cx=\"7.5\" cy=\"8.5\" r=\"1\"/>", "plus": "<path d=\"M12 5v14M5 12h14\"/>"};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const KINDS={
  projects:{name:'Proyectos',one:'proyecto',icon:ic('projects'),hint:'Obras realizadas que se muestran en el portafolio.'},
  properties:{name:'Propiedades',one:'propiedad',icon:ic('properties'),hint:'Casas, apartamentos, terrenos y locales en venta o alquiler.'},
  news:{name:'Noticias',one:'noticia',icon:ic('news'),hint:'Anuncios y eventos de la empresa.'}
};
let user=null, view='home', query='', mode='cards';

/* ---------- utilidades ---------- */
function toast(msg,bad){const t=$('#toast');t.textContent=msg;t.className='show'+(bad?' bad':'');clearTimeout(toast.t);toast.t=setTimeout(()=>t.className='',3500);}
function save(msg){const ok=S.save();toast(ok?(msg||' Cambios guardados'):'No se pudo guardar. Exporta un respaldo antes de salir.',!ok);return ok;}
function openModal(html){const m=$('#modal');m.innerHTML=html;m.hidden=false;}
function closeModal(){$('#modal').hidden=true;$('#modal').innerHTML='';}
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);}
const img=i=>okMedia(i.images?.[0]||i.image)?(i.images?.[0]||i.image):'assets/estructura.jpg';

/* ---------- entrada ---------- */
$('#profiles').innerHTML=S.data.adminProfiles.map(p=>`<button class="profile" data-p="${E(p.id)}"><span class="avatar">${E(p.name[0])}</span><span><b>${E(p.name)}</b><small>${E(p.role)}</small></span></button>`).join('');
$$('[data-p]').forEach(b=>b.onclick=()=>{user=S.data.adminProfiles.find(p=>p.id===b.dataset.p);$('#login').hidden=true;$('#app').hidden=false;$('#av').textContent=user.name[0];$('#uname').textContent=user.name;$('#urole').textContent=user.role;go('home');});
$('#logout').onclick=()=>{$('#app').hidden=true;$('#login').hidden=false;};
$('#menu').onclick=()=>$('#sidebar').classList.toggle('open');
$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal();};
document.onkeydown=e=>{if(e.key==='Escape'&&!$('#modal').hidden)closeModal();};

/* ---------- navegación ---------- */
function go(v){view=v;query='';$('#sidebar').classList.remove('open');render();scrollTo(0,0);}
function render(){
  const items=[['lbl','Principal'],['home',ic('home'),'Resumen'],['lbl','Contenido del sitio'],...Object.entries(KINDS).map(([k,v])=>[k,v.icon,v.name,S.data[k].length]),['lbl','Sistema'],['settings',ic('settings'),'Contacto y marca'],['backup',ic('backup'),'Respaldo']];
  $('#nav').innerHTML=items.map(i=>i[0]==='lbl'?`<div class="lbl">${i[1]}</div>`:`<button class="nav${view===i[0]?' on':''}" data-v="${i[0]}"><i>${i[1]}</i>${i[2]}${i[3]!==undefined?`<em>${i[3]}</em>`:''}</button>`).join('')+`<a class="nav" href="index.html" target="_blank" rel="noopener">Ver el sitio ↗</a>`;
  $$('[data-v]').forEach(b=>b.onclick=()=>go(b.dataset.v));
  const titles={home:'Resumen',settings:'Contacto y marca',backup:'Respaldo'};
  $('#title').textContent=titles[view]||KINDS[view].name;
  $('#top-act').innerHTML=KINDS[view]?`<button class="btn" id="add">${ic('plus')}Añadir ${KINDS[view].one}</button>`:'';
  if(KINDS[view])$('#add').onclick=()=>editor();
  ({home,settings,backup}[view]||list)();
}

/* ---------- resumen ---------- */
function home(){
  const demos=Object.keys(KINDS).reduce((n,k)=>n+S.data[k].filter(x=>x.demo).length,0);
  $('#content').innerHTML=`<section class="hero"><p class="eyebrow">HOLA, ${E(user.name.toUpperCase())}</p><h1>Tu contenido,<br>en un solo lugar.</h1><p>Administra lo que se ve en el sitio web de EnObra: proyectos, propiedades y noticias.</p><div class="quick">${Object.values(KINDS).map((v,i)=>`<button class="btn${i?' ghost':''}" data-new="${Object.keys(KINDS)[i]}">${v.icon}Añadir ${v.one}</button>`).join('')}<button class="btn ghost" data-v="settings"> Cambiar teléfono o datos de contacto</button></div></section>
  <div class="stats">${Object.entries(KINDS).map(([k,v],i)=>`<button class="stat${i%2?' o':''}" data-v="${k}"><span>${v.icon}</span><b>${S.data[k].length}</b><small>${v.name}</small></button>`).join('')}<div class="stat o"><span>${ic('tag')}</span><b>${demos}</b><small>Ejemplos por reemplazar</small></div></div>
  <div class="box"><div class="box-h"><h3>Cómo publicar en 3 pasos</h3></div><div class="box-b"><ol class="steps"><li><b>1</b>Elige <strong>Proyectos</strong>, <strong>Propiedades</strong> o <strong>Noticias</strong> en el menú de la izquierda.</li><li><b>2</b>Pulsa <strong>Añadir</strong>, llena los datos y sube las fotos desde tu equipo.</li><li><b>3</b>Pulsa <strong>Guardar</strong> y revisa el resultado con <strong>Ver el sitio</strong>.</li></ol></div></div>`;
  $$('[data-v]',$('#content')).forEach(b=>b.onclick=()=>go(b.dataset.v));
  $$('[data-new]').forEach(b=>b.onclick=()=>{view=b.dataset.new;render();editor();});
}

/* ---------- listados ---------- */
function meta(k,i){return k==='projects'?`${E(i.category)} · ${E(i.year)}`:k==='properties'?`${E(i.operation)} · ${E(i.type)} · ${E(i.zone)}<small>${Q(i.price)}</small>`:`${E(i.category)} · ${E(i.date)}`;}
function list(){
  const k=view,all=S.data[k],items=all.filter(i=>(i.title+' '+(i.category||'')+(i.zone||'')).toLowerCase().includes(query.toLowerCase()));
  const badge=i=>`<span class="badge ${i.demo?'b-o':'b-g'}">${i.demo?'Ejemplo':'Publicado'}</span>`,acts=i=>`<button class="ib" data-e="${E(i.id)}">${ic('edit')}Editar</button><button class="ib del" data-d="${E(i.id)}" aria-label="Eliminar">${ic('trash')}</button>`;
  const body=!items.length?`<div class="box"><div class="empty"><span>${KINDS[k].icon}</span>${all.length?'Nada coincide con tu búsqueda.':'Aún no hay nada aquí. ¡Añade el primero!'}</div></div>`:mode==='cards'?`<div class="cards">${items.map(i=>`<article class="card"><div class="ph"><img src="${E(img(i))}" alt="">${badge(i)}</div><div class="cb"><h4>${E(i.title)}</h4><p>${meta(k,i)}</p><div class="acts">${acts(i)}</div></div></article>`).join('')}</div>`:`<div class="box tw"><table><thead><tr><th></th><th>Título</th><th class="hide-m">Detalle</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${items.map(i=>`<tr><td><img src="${E(img(i))}" alt=""></td><td><b>${E(i.title)}</b></td><td class="hide-m">${meta(k,i)}</td><td>${badge(i)}</td><td class="acts">${acts(i)}</td></tr>`).join('')}</tbody></table></div>`;
  $('#content').innerHTML=`<p class="intro">${KINDS[k].hint} Pulsa <b>Editar</b> para cambiar algo o <b>Añadir</b> para crear uno nuevo.</p><div class="bar"><h3>${KINDS[k].name} (${all.length})</h3><input class="search" id="q" placeholder="Buscar…" value="${E(query)}" aria-label="Buscar"><div class="seg"><button data-m="cards" class="${mode==='cards'?'on':''}">${ic('grid')}Tarjetas</button><button data-m="table" class="${mode==='table'?'on':''}">${ic('list')}Tabla</button></div></div>${body}`;
  const q=$('#q');q.oninput=()=>{query=q.value;const p=q.selectionStart;list();$('#q').focus();$('#q').setSelectionRange(p,p);};
  const find=id=>S.data[k].find(x=>String(x.id)===id);
  $$('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;list();});
  $$('[data-e]').forEach(b=>b.onclick=()=>editor(find(b.dataset.e)));
  $$('[data-d]').forEach(b=>b.onclick=()=>{const it=find(b.dataset.d);openModal(`<div class="modal sm"><div class="empty" style="padding:0 0 8px">${ic('trash')}</div><h2>¿Eliminar?</h2><p class="intro" style="margin:8px 0 20px">“${E(it.title)}” dejará de mostrarse en el sitio.</p><div class="quick" style="justify-content:center"><button class="btn ghost" id="no">Cancelar</button><button class="btn danger" id="yes">Sí, eliminar</button></div></div>`);$('#no').onclick=closeModal;$('#yes').onclick=()=>{S.data[k]=S.data[k].filter(x=>x!==it);closeModal();save(' Eliminado');render();};});
}

/* ---------- editor ---------- */
const fld=(n,l,v='',t='text',o={})=>`<div class="fg${o.full?' full':''}"><label>${l}${o.req===false?'':' *'}</label>${t==='area'?`<textarea name="${n}"${o.req===false?'':' required'}>${E(v)}</textarea>`:t==='sel'?`<select name="${n}">${o.opts.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join('')}</select>`:`<input name="${n}" type="${t}" value="${E(v)}"${o.req===false?'':' required'}${t==='number'?' min="0" step="any"':''}>`}${o.help?`<small>${o.help}</small>`:''}</div>`;
const mediaBox=(id,l,help)=>`<div class="fg full"><label>${l}</label><div class="thumbs" id="t-${id}"></div><div class="am"><label class="btn ghost">${ic('image')}Subir desde tu equipo<input type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif" multiple data-up="${id}"></label><input placeholder="…o pega una dirección https://" data-url="${id}"><button type="button" class="btn ghost" data-au="${id}">Añadir</button></div>${help?`<small>${help}</small>`:''}</div>`;
function editor(item){
  const k=view,p=item||{},today=new Date().toISOString().slice(0,10);
  const st={images:[...(p.images||(p.image?[p.image]:[]))],renders:[...(p.renders||[])]};
  let f=fld('title','Título',p.title||'','text',{full:true});
  if(k==='projects')f+=fld('year','Año',p.year||new Date().getFullYear(),'number')+fld('category','Categoría',p.category||'')+fld('country','País',p.country||'Guatemala');
  if(k==='news')f+=fld('category','Categoría',p.category||'Anuncios','sel',{opts:['Anuncios','Eventos','Proyectos']})+fld('date','Fecha',p.date||today,'date');
  if(k==='properties')f+=fld('operation','Operación',p.operation||'Venta','sel',{opts:['Venta','Alquiler']})+fld('type','Tipo',p.type||'Casa','sel',{opts:['Casa','Apartamento','Terreno','Local']})+fld('zone','Zona',p.zone||'')+fld('location','Ciudad o ubicación',p.location||'')+fld('price','Precio (Q)',p.price??'','number')+fld('area','Superficie (m²)',p.area??'','number')+fld('rooms','Habitaciones',p.rooms??0,'number')+fld('baths','Baños',p.baths??0,'number')+fld('parking','Parqueos',p.parking??0,'number')+fld('date','Fecha',p.date||today,'date');
  f+=fld('description','Descripción',p.description||'','area',{full:true});
  if(k==='properties')f+=fld('commercial','Condiciones comerciales',p.commercial||'','area',{full:true,help:'Precio final, disponibilidad, documentación.'});
  f+=`<div class="sec">${k==='news'?'Imagen':'Fotografías'}</div>`+mediaBox('images',k==='news'?'Imagen de la noticia':'Fotos (la primera es la portada)','JPG, PNG, WebP o GIF, hasta 2 MB cada una.');
  if(k==='projects'||k==='properties')f+=mediaBox('renders','Renders (opcional)')+fld('video','Video MP4/WebM (opcional)',p.video||'','text',{req:false,full:true,help:'Ruta assets/… o dirección https:// terminada en .mp4 o .webm'});
  f+=`<label class="full"><input type="checkbox" name="demo"${item?(p.demo?' checked':''):' checked'}> Marcar como <b>ejemplo</b> (quítalo cuando el contenido sea real)</label>`;
  openModal(`<div class="modal"><div class="mh"><h2>${item?'Editar':'Nueva'} ${KINDS[k].one}</h2><button id="x" aria-label="Cerrar">×</button></div><form class="mb" id="form"><div class="grid">${f}<p class="err" id="err" role="alert"></p><div class="mf"><button type="button" class="btn ghost" id="cancel">Cancelar</button><button class="btn">Guardar</button></div></div></form></div>`);
  const draw=()=>['images','renders'].forEach(id=>{const t=$('#t-'+id);if(!t)return;t.innerHTML=st[id].length?st[id].map((u,i)=>`<div class="th"><img src="${E(okMedia(u)?u:'assets/estructura.jpg')}" alt="">${id==='images'&&!i?'<span>Portada</span>':''}<button type="button" data-rm="${id}:${i}" aria-label="Quitar">×</button></div>`).join(''):'<div class="noimg">Sin imágenes todavía</div>';$$('[data-rm]',t).forEach(b=>b.onclick=()=>{const[a,i]=b.dataset.rm.split(':');st[a].splice(+i,1);draw();});});
  const add=(id,u)=>{if(k==='news'&&id==='images')st.images=[u];else st[id].push(u);draw();};
  $$('[data-up]').forEach(inp=>inp.onchange=async()=>{const fs=[...inp.files];inp.value='';try{if(fs.some(x=>!/^image\/(jpeg|png|webp|gif)$/.test(x.type)||x.size>2*1024*1024))throw Error('Usa imágenes válidas de hasta 2 MB.');for(const x of fs)add(inp.dataset.up,await new Promise((r,j)=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=j;fr.readAsDataURL(x);}));$('#err').textContent='';}catch(e){$('#err').textContent=e.message;}});
  $$('[data-au]').forEach(b=>b.onclick=()=>{const i=$(`[data-url="${b.dataset.au}"]`),u=i.value.trim();if(!u)return;if(!okMedia(u)){$('#err').textContent='La dirección debe empezar con https:// o assets/.';return;}add(b.dataset.au,u);i.value='';$('#err').textContent='';});
  draw();$('#x').onclick=$('#cancel').onclick=closeModal;
  $('#form').onsubmit=e=>{e.preventDefault();const fm=e.target,o=Object.fromEntries(new FormData(fm)),err=m=>{$('#err').textContent=m;};
    if(!st.images.length)return err(k==='news'?'Añade una imagen.':'Añade al menos una fotografía.');
    if(o.video&&!/^(assets\/[\w.\/-]+\.(mp4|webm)|https:\/\/\S+\.(mp4|webm)(\?\S*)?)$/i.test(o.video))return err('El video debe ser MP4 o WebM (ruta assets/… o https://).');
    ['year','price','rooms','baths','parking','area'].forEach(n=>{if(n in o)o[n]=Number(o[n]);});
    const obj={...p,...o,demo:fm.elements.demo.checked,id:p.id||(k==='properties'?Date.now():k+'-'+Date.now()),updatedBy:user.id,updatedAt:new Date().toISOString()};
    if(k==='news')obj.image=st.images[0];else{obj.images=st.images;obj.renders=st.renders;obj.video=o.video||'';}
    if(item)S.data[k][S.data[k].indexOf(item)]=obj;else S.data[k].unshift(obj);
    closeModal();save(' Guardado. Ya puedes verlo en el sitio');render();};
}

/* ---------- contacto y marca ---------- */
function settings(){
  const c=S.data.company;
  $('#content').innerHTML=`<p class="intro">Estos datos aparecen en el pie de página y en la página de contacto. Llena solo lo que esté confirmado.</p><form id="sf"><div class="cols"><div class="box"><div class="box-h"><h3>Contacto</h3></div><div class="box-b grid" style="grid-template-columns:1fr">${fld('person','Responsable',c.person)+fld('address','Dirección',c.address)+fld('phone1','Teléfono',c.phones[0]||'')+fld('phone2','Teléfono adicional',c.phones[1]||'','text',{req:false})+fld('whatsapp','WhatsApp',c.whatsapp,'text',{help:'Con código de país: 502 y 8 dígitos.'})+fld('email','Correo institucional',c.email,'email',{req:false})}</div></div><div class="box"><div class="box-h"><h3>Marca y redes</h3></div><div class="box-b grid" style="grid-template-columns:1fr">${fld('instagram','Instagram',c.instagram,'url',{req:false,help:'Dirección completa con https://'})+fld('facebook','Facebook',c.facebook,'url',{req:false})+fld('domain','Dominio',c.domain,'url',{req:false,help:'Solo de referencia; no configura el dominio.'})+fld('logo','Logo',c.logo,'text',{req:false,help:'Ruta assets/… o dirección https://'})}</div></div></div><p class="err" id="serr" role="alert"></p><button class="btn">Guardar cambios</button></form>`;
  $('#sf').onsubmit=e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target)),err=m=>{$('#serr').textContent=m;};
    if(!/^502\d{8}$/.test(x.whatsapp))return err('El WhatsApp debe ser 502 seguido de 8 dígitos.');
    if(['instagram','facebook','domain'].some(n=>x[n]&&!x[n].startsWith('https://')))return err('Los enlaces deben comenzar con https://');
    if(x.logo&&!okMedia(x.logo))return err('La ruta del logo no es válida.');
    Object.assign(S.data.company,x,{phones:[x.phone1,x.phone2].filter(Boolean)});delete S.data.company.phone1;delete S.data.company.phone2;err('');save();};
}

/* ---------- respaldo ---------- */
const validImport=d=>S.valid(d)&&Array.isArray(d.company?.phones)&&Array.isArray(d.adminProfiles)&&d.adminProfiles.length===2&&d.projects.every(p=>p.id&&Array.isArray(p.images))&&d.properties.every(p=>p.id&&Array.isArray(p.images)&&Number.isFinite(p.price))&&d.news.every(n=>n.id&&typeof n.image==='string');
function backup(){
  $('#content').innerHTML=`<p class="intro">Los cambios viven solo en este navegador. Descarga una copia para no perderlos o para pasarlos a otra computadora.</p><div class="cols"><div class="box"><div class="box-h"><h3>Guardar una copia</h3></div><div class="box-b"><p class="intro">Recomendado: haz una copia después de cada sesión de trabajo.</p><button class="btn" id="ej">Descargar respaldo (JSON)</button></div></div><div class="box"><div class="box-h"><h3>Restaurar una copia</h3></div><div class="box-b"><p class="intro">Reemplaza los datos actuales con un respaldo anterior.</p><label class="btn ghost">Elegir archivo<input type="file" id="im" accept=".json,application/json" hidden></label><p class="err" id="ims" role="status"></p></div></div></div><div class="box"><div class="box-h"><h3>Actualizar el sitio publicado</h3></div><div class="box-b"><p class="intro">Este panel no publica en Internet. Para que los cambios lleguen al sitio, descarga <b>data.js</b> y reemplaza ese archivo en la carpeta del sitio.</p><button class="btn ghost" id="ejs">Descargar data.js</button></div></div>`;
  $('#ej').onclick=()=>download('enobra-respaldo.json',JSON.stringify(S.data,null,2),'application/json');
  $('#ejs').onclick=()=>download('data.js','/* Datos exportados desde el prototipo local de EnObra. */\nwindow.ENOBRA = '+JSON.stringify(S.data,null,2)+';\n','text/javascript');
  $('#im').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{if(f.size>15*1024*1024)throw Error('El archivo supera 15 MB.');const d=JSON.parse(await f.text());if(!validImport(d))throw Error('No parece un respaldo de EnObra.');if(!confirm('¿Reemplazar los datos actuales con este respaldo?'))return;S.data=d;save(' Respaldo restaurado');render();}catch(er){$('#ims').textContent='No se restauró: '+er.message;}};
}
})();
