/* Documentación visual del prototipo EnObra. Ejecutar: node capturas.js
   Dependencias: npm install --prefix capturas
   Todo lo generado queda en capturas/; el prototipo no se modifica. */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { createRequire } = require('module');
const ROOT = __dirname;
const OUT = path.join(ROOT, 'capturas');
const fromDeps = createRequire(path.join(OUT, 'package.json'));
const BUNDLED = path.join(process.env.USERPROFILE||'', '.cache','codex-runtimes','codex-primary-runtime','dependencies','node','node_modules');
const dep = name => {try{return fromDeps(name)}catch{return require(path.join(BUNDLED,name))}};
const { chromium } = dep('playwright');
const { PDFDocument, StandardFonts, rgb } = dep('pdf-lib');
const BASE = 'http://127.0.0.1:3000';
const PROTOTYPE_FILES = ['index.html','nosotros.html','servicios.html','proyectos.html','bienes-raices.html','noticias.html','contacto.html','proyecto.html','propiedad.html','noticia.html','admin.html'];

// Lista editable. Cada registro produce exactamente una captura por vista.
const S = [];
const add = (key, title, url, action='Abrir la URL.', state='Página normal', opts={}) => S.push({ key, title, url, action, state, ...opts });
add('inicio','Inicio','index.html');
add('nosotros','Nosotros','nosotros.html');
add('servicios','Servicios','servicios.html');
add('proyectos','Proyectos','proyectos.html');
add('bienes-raices','Bienes raíces','bienes-raices.html');
add('noticias','Noticias','noticias.html');
add('contacto','Contacto','contacto.html');
for (const [id,title] of [['cumbres','Proyecto: Residencia Las Cumbres'],['reforma','Proyecto: Edificio Vista Reforma'],['oficina','Proyecto: Remodelación Oficina Central']]) add(`proyecto-${id}`,title,`proyecto.html?id=${id}`);
for (const [id,title] of [[1,'Residencia Las Cumbres'],[2,'Apartamento Vista Norte'],[3,'Casa Jardines del Valle'],[4,'Terreno Los Pinos'],[5,'Local Rivera'],[6,'Apartamento Horizonte']]) add(`propiedad-${id}`,`Propiedad: ${title}`,`propiedad.html?id=${id}`);
for (const [id,title] of [['proximo-proyecto','Un espacio para nuestros próximos proyectos'],['eventos','Encuentros y novedades de EnObra']]) add(`noticia-${id}`,`Noticia: ${title}`,`noticia.html?id=${id}`);
add('admin-perfiles','Administración: elegir perfil','admin.html','Abrir admin.html; no elegir perfil.','Selector de perfiles');
add('menu-sitio','Menú de navegación','index.html','En móvil, pulsar #menu-toggle. En escritorio la navegación ya está visible.','Menú móvil abierto',{op:'menuPublic',modal:true});
add('busqueda-abierta','Buscador abierto','index.html','Pulsar #search-open.','Modal de búsqueda abierto',{op:'searchOpen',modal:true});
add('busqueda-resultados','Buscador con resultados','index.html','Pulsar #search-open; escribir “cumbres” en #global-search.','Resultados de búsqueda',{op:'searchResults',modal:true});
add('busqueda-vacia','Buscador sin coincidencias','index.html','Pulsar #search-open; escribir “xyzsinresultado”.','Búsqueda sin coincidencias',{op:'searchEmpty',modal:true});
for (const year of [2026,2025]) add(`proyectos-${year}`,`Proyectos: año ${year}`,'proyectos.html',`Seleccionar ${year} en #project-year.`,`Filtro por año: ${year}`,{op:`projectYear:${year}`});
add('catalogo-venta','Catálogo: venta','bienes-raices.html','Pulsar [data-operation="Venta"].','Filtro operación: Venta',{op:'operation:Venta'});
add('catalogo-alquiler','Catálogo: alquiler','bienes-raices.html','Pulsar [data-operation="Alquiler"].','Filtro operación: Alquiler',{op:'operation:Alquiler'});
add('catalogo-casas','Catálogo: casas','bienes-raices.html','Seleccionar Casa en #type.','Filtro tipo: Casa',{op:'type:Casa'});
add('catalogo-zona-3','Catálogo: zona 3','bienes-raices.html','Seleccionar Zona 3 en #zone.','Filtro zona: Zona 3',{op:'zone:Zona 3'});
add('catalogo-precio','Catálogo: precio y orden','bienes-raices.html','Indicar Q 800000 en #price-min y ordenar de mayor a menor en #sort.','Precio mínimo y orden',{op:'priceSort'});
add('catalogo-busqueda','Catálogo: búsqueda textual','bienes-raices.html','Escribir “Horizonte” en #property-search.','Filtro por texto',{op:'propertySearch'});
add('favorito-activo','Catálogo: favorito activo','bienes-raices.html','Pulsar el primer [data-favorite].','Favorito marcado',{op:'favorite'});
add('solo-favoritos','Catálogo: solo favoritos','bienes-raices.html','Marcar la primera propiedad como favorita y activar #favorites-only.','Filtro de favoritos',{op:'favoriteOnly'});
add('catalogo-vacio','Catálogo: sin resultados','bienes-raices.html','Escribir “xyzsinresultado” en #property-search.','Sin coincidencias',{op:'propertyEmpty'});
add('filtros-movil','Panel de filtros','bienes-raices.html','En móvil, abrir details.filters; en escritorio ya se muestra abierto.','Filtros expandidos',{op:'openFilters'});
add('compartir-busqueda','Compartir búsqueda','bienes-raices.html','Denegar el portapapeles y pulsar #share-filters.','Modal de enlace para compartir',{op:'share',modal:true});
add('galeria-proyecto','Galería de proyecto: imagen 2','proyecto.html?id=cumbres','Pulsar #image-next.','Segunda fotografía',{op:'gallery'});
add('galeria-propiedad','Galería de propiedad: imagen 2','propiedad.html?id=1','Pulsar #image-next.','Segunda fotografía',{op:'gallery'});
add('visita-modal','Solicitud de visita','propiedad.html?id=1','Pulsar #request-visit.','Modal de solicitud de visita',{op:'visitOpen',modal:true});
add('visita-validacion','Solicitud de visita: validación','propiedad.html?id=1','Abrir solicitud y enviarla vacía.','Errores de validación',{op:'visitInvalid',modal:true});
add('visita-exito','Solicitud de visita: simulación completada','propiedad.html?id=1','Llenar datos de prueba y simular envío local.','Confirmación de simulación',{op:'visitSuccess',modal:true});
add('contacto-asunto','Contacto: asunto preseleccionado','contacto.html?asunto=Construcci%C3%B3n','Abrir la URL con ?asunto=Construcción.','Asunto Construcción');
add('contacto-validacion','Contacto: validación','contacto.html','Enviar formulario vacío.','Errores de validación',{op:'contactInvalid'});
add('contacto-exito','Contacto: simulación completada','contacto.html','Llenar datos de prueba y simular envío local.','Confirmación de simulación',{op:'contactSuccess'});
add('proyecto-no-encontrado','Proyecto no encontrado','proyecto.html?id=no-existe','Abrir URL con ID no existente.','Estado de error');
add('propiedad-no-encontrada','Propiedad no encontrada','propiedad.html?id=999','Abrir URL con ID no existente.','Estado de error');
add('noticia-no-encontrada','Noticia no encontrada','noticia.html?id=no-existe','Abrir URL con ID no existente.','Estado de error');
add('admin-bernardo','Administración: resumen de Bernardo','admin.html','Elegir perfil Bernardo.','Resumen',{admin:'bernardo'});
add('admin-arquitecta','Administración: resumen de Arquitecta','admin.html','Elegir perfil Arquitecta.','Resumen',{admin:'arquitecta'});
add('admin-menu','Administración: menú móvil','admin.html','Elegir Bernardo; en móvil, pulsar #menu.','Menú lateral abierto',{admin:'bernardo',op:'adminMenu',modal:true});
for (const [kind,es] of [['projects','proyectos'],['properties','propiedades'],['news','noticias']]) {
  add(`admin-${kind}-tarjetas`,`Administración: ${es} en tarjetas`,'admin.html',`Elegir Bernardo; abrir sección ${es}.`,'Vista de tarjetas',{admin:'bernardo',section:kind});
  add(`admin-${kind}-tabla`,`Administración: ${es} en tabla`,'admin.html',`Elegir Bernardo; abrir ${es}; pulsar [data-m="table"].`,'Vista de tabla',{admin:'bernardo',section:kind,op:'table'});
  add(`admin-${kind}-nuevo`,`Administración: añadir ${es==='propiedades'?'propiedad':es==='noticias'?'noticia':'proyecto'}`,'admin.html',`Elegir Bernardo; abrir ${es}; pulsar #add.`,'Modal de creación',{admin:'bernardo',section:kind,op:'add',modal:true});
  add(`admin-${kind}-editar`,`Administración: editar ${es==='propiedades'?'propiedad':es==='noticias'?'noticia':'proyecto'}`,'admin.html',`Elegir Bernardo; abrir ${es}; pulsar el primer [data-e].`,'Modal de edición',{admin:'bernardo',section:kind,op:'edit',modal:true});
  add(`admin-${kind}-eliminar`,`Administración: confirmar eliminación de ${es}`,'admin.html',`Elegir Bernardo; abrir ${es}; pulsar el primer [data-d].`,'Modal de confirmación',{admin:'bernardo',section:kind,op:'delete',modal:true});
}
add('admin-proyectos-vacio','Administración: búsqueda sin resultados','admin.html','Elegir Bernardo; abrir Proyectos; escribir “xyzsinresultado” en #q.','Sin coincidencias',{admin:'bernardo',section:'projects',op:'adminEmpty'});
add('admin-media-error','Administración: dirección de imagen inválida','admin.html','Elegir Bernardo; Proyectos > Añadir; escribir http://invalida en [data-url="images"] y pulsar Añadir.','Error de validación de medio',{admin:'bernardo',section:'projects',op:'mediaError',modal:true});
add('admin-mensajes-vacio','Administración: mensajes vacíos','admin.html','Elegir Bernardo; abrir Mensajes.','Bandeja sin mensajes',{admin:'bernardo',section:'inbox'});
add('admin-mensajes-ejemplo','Administración: mensajes de ejemplo','admin.html','Elegir Bernardo; Mensajes; pulsar #demo.','Mensajes pendientes',{admin:'bernardo',section:'inbox',op:'demoMsgs'});
add('admin-historial','Administración: historial','admin.html','Elegir Bernardo; Mensajes; cargar ejemplos; abrir Historial.','Mensajes atendidos',{admin:'bernardo',section:'history',op:'demoMsgs'});
add('admin-eliminar-mensaje','Administración: confirmar eliminación de mensaje','admin.html','Elegir Bernardo; Mensajes; cargar ejemplos; pulsar primer [data-x].','Modal de confirmación',{admin:'bernardo',section:'inbox',op:'deleteMsg',modal:true});
add('admin-contacto-marca','Administración: contacto y marca','admin.html','Elegir Bernardo; abrir Contacto y marca.','Configuración de empresa',{admin:'bernardo',section:'settings'});
add('admin-contacto-error','Administración: WhatsApp inválido','admin.html','Elegir Bernardo; Contacto y marca; escribir 123 en WhatsApp y guardar.','Error de validación',{admin:'bernardo',section:'settings',op:'settingsError'});
add('admin-respaldo','Administración: respaldo','admin.html','Elegir Bernardo; abrir Respaldo.','Exportar o restaurar',{admin:'bernardo',section:'backup'});
add('admin-respaldo-error','Administración: respaldo inválido','admin.html','Elegir Bernardo; Respaldo; cargar JSON inválido.','Error de importación',{admin:'bernardo',section:'backup',op:'backupError'});
for (const [kind,es] of [['projects','proyectos'],['properties','propiedades'],['news','noticias']]) {
  add(`admin-${kind}-tabla-derecha`,`Administración: ${es}, tabla desplazada`,'admin.html',`Elegir Bernardo; abrir ${es}; activar Tabla; en móvil desplazar la tabla horizontalmente hasta el extremo derecho.`,'Acciones de tabla visibles',{admin:'bernardo',section:kind,op:'tableRight'});
  add(`admin-${kind}-nuevo-inferior`,`Administración: añadir ${es}, campos inferiores`,'admin.html',`Elegir Bernardo; abrir ${es}; pulsar Añadir; desplazar el modal hasta el final.`,'Modal de creación: sección inferior',{admin:'bernardo',section:kind,op:'addBottom',modal:true});
}

function verifyInventory() {
  const d = {window:{}};
  const vm = require('vm');
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'data.js'),'utf8'), d);
  const data = d.window.ENOBRA;
  for (const [kind,prefix] of [['projects','proyecto'],['properties','propiedad'],['news','noticia']]) {
    for (const item of data[kind]) if (!S.some(s=>s.key===`${prefix}-${item.id}`)) throw new Error(`Falta ${kind}: ${item.id}`);
  }
  for (const f of PROTOTYPE_FILES) if (!fs.existsSync(path.join(ROOT,f))) throw new Error(`Falta ${f}`);
  const keys = S.map(s=>s.key); if (new Set(keys).size!==keys.length) throw new Error('IDs duplicados en inventario');
}
const pad=n=>String(n).padStart(2,'0');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function startServer() {
  const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.woff':'font/woff','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm'};
  const server=http.createServer((req,res)=>{
    let pathname; try{pathname=decodeURIComponent(new URL(req.url,BASE).pathname)}catch{res.writeHead(400).end();return}
    const file=path.resolve(ROOT,'.'+pathname);
    if(!file.startsWith(ROOT+path.sep)){res.writeHead(403).end();return}
    fs.readFile(file,(e,data)=>{if(e){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream'}).end(data)});
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(3000,'127.0.0.1',resolve)});
  return server;
}
async function act(page,s,view) {
  if (s.admin) {
    await page.locator(`[data-p="${s.admin}"]`).click();
    if (s.section) {
      if (view==='movil') await page.locator('#menu').click();
      await page.locator(`#nav [data-v="${s.section}"]`).click();
    }
  }
  const op=s.op||'';
  if(view==='movil' && /^(type:|zone:|priceSort|propertySearch|propertyEmpty|share$)/.test(op)) {
    if(!(await page.locator('details.filters').evaluate(e=>e.open))) await page.locator('details.filters summary').click();
  }
  if (op==='menuPublic') { if (view==='movil') await page.locator('#menu-toggle').click(); return; }
  if (op==='adminMenu') { if (view==='movil') await page.locator('#menu').click(); return; }
  if (op.startsWith('search')) {
    await page.locator('#search-open').click();
    if (op==='searchResults') await page.locator('#global-search').fill('cumbres');
    if (op==='searchEmpty') await page.locator('#global-search').fill('xyzsinresultado');
    return;
  }
  if (op.startsWith('projectYear:')) { await page.locator('#project-year').selectOption(op.split(':')[1]); return; }
  if (op.startsWith('operation:')) { await page.locator(`[data-operation="${op.split(':')[1]}"]`).click(); return; }
  if (op.startsWith('type:')) { await page.locator('#type').selectOption(op.split(':')[1]); return; }
  if (op.startsWith('zone:')) { await page.locator('#zone').selectOption(op.split(':')[1]); return; }
  if (op==='priceSort') { await page.locator('#price-min').fill('800000'); await page.locator('#sort').selectOption('desc'); return; }
  if (op==='propertySearch') { await page.locator('#property-search').fill('Horizonte'); return; }
  if (op==='propertyEmpty') { await page.locator('#property-search').fill('xyzsinresultado'); return; }
  if (op==='favorite'||op==='favoriteOnly') { await page.locator('[data-favorite]').first().click(); if (op==='favoriteOnly') await page.locator('#favorites-only').check(); return; }
  if (op==='openFilters') { if (view==='movil') await page.locator('details.filters summary').click(); return; }
  if (op==='share') { await page.locator('#share-filters').click(); await page.locator('#modal[open]').waitFor({timeout:3000}); return; }
  if (op==='gallery') { await page.locator('#image-next').click(); return; }
  if (op.startsWith('visit')) {
    await page.locator('#request-visit').click();
    if (op==='visitInvalid') await page.locator('#modal button[type=submit]').click();
    if (op==='visitSuccess') {
      await page.locator('#visit-name').fill('Persona de prueba');
      await page.locator('#visit-phone').fill('55551234');
      const today=await page.evaluate(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`});
      await page.locator('#visit-date').fill(today);
      await page.locator('#modal button[type=submit]').click();
      await page.locator('#modal .form-success').waitFor();
    }
    return;
  }
  if (op==='contactInvalid') { await page.locator('.request-form button[type=submit]').click(); return; }
  if (op==='contactSuccess') {
    await page.locator('#contact-name').fill('Persona de prueba');
    await page.locator('#contact-email').fill('prueba@example.invalid');
    await page.locator('#contact-phone').fill('55551234');
    await page.locator('#contact-message').fill('Consulta de prueba para documentar el prototipo.');
    await page.locator('.request-form button[type=submit]').click();
    await page.locator('.form-success').waitFor(); return;
  }
  if (op==='table'||op==='tableRight') { await page.locator('[data-m="table"]').click(); if(op==='tableRight') await page.locator('.tw').evaluate(e=>e.scrollLeft=e.scrollWidth); return; }
  if (op==='add') { await page.locator('#add').click(); return; }
  if (op==='addBottom') { await page.locator('#add').click(); await page.locator('#modal .modal').evaluate(e=>e.scrollTop=e.scrollHeight); return; }
  if (op==='edit') { await page.locator('[data-e]').first().click(); return; }
  if (op==='delete') { await page.locator('[data-d]').first().click(); return; }
  if (op==='adminEmpty') { await page.locator('#q').fill('xyzsinresultado'); return; }
  if (op==='mediaError') { await page.locator('#add').click(); await page.locator('[data-url="images"]').fill('http://invalida'); await page.locator('[data-au="images"]').click(); return; }
  if (op==='demoMsgs'||op==='deleteMsg') { await page.locator('#demo').click(); if (op==='deleteMsg') await page.locator('[data-x]').first().click(); return; }
  if (op==='settingsError') { await page.locator('#sf [name="whatsapp"]').fill('123'); await page.locator('#sf button').click(); return; }
  if (op==='backupError') { await page.locator('#im').setInputFiles({name:'invalido.json',mimeType:'application/json',buffer:Buffer.from('{')}); await page.locator('#ims').getByText('No se restauró', {exact:false}).waitFor(); return; }
}
async function scrollAll(page) {
  const h=await page.evaluate(()=>Math.max(document.documentElement.scrollHeight,document.body.scrollHeight));
  for (let y=0;y<h;y+=680) { await page.evaluate(v=>scrollTo(0,v),y); await sleep(18); }
  await page.evaluate(()=>{document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager'); scrollTo(0,0);});
  await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.complete?null:new Promise(r=>{i.addEventListener('load',r,{once:true});i.addEventListener('error',r,{once:true});setTimeout(r,6000)})));});
  await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});
  await page.evaluate(()=>scrollTo(0,0));
}
async function capture(browser,s,number,view,warnings) {
  const mobile=view==='movil';
  const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},deviceScaleFactor:mobile?2:1,isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce',locale:'es-GT',serviceWorkers:'block'});
  if (s.op==='share') await ctx.grantPermissions([],{origin:BASE});
  const page=await ctx.newPage();
  page.setDefaultTimeout(10000);
  const bad=[];
  page.on('requestfailed',r=>bad.push(`${r.url()} (${r.failure()?.errorText||'falló'})`));
  page.on('response',r=>{if(r.status()>=400)bad.push(`${r.url()} (HTTP ${r.status()})`)});
  await page.route('**/*',route=>{const u=new URL(route.request().url()); if(u.origin===BASE) route.continue(); else {bad.push(`Bloqueado recurso externo: ${u.href}`);route.abort();}});
  try {
    await page.goto(BASE+'/'+s.url,{waitUntil:'networkidle'});
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'});
    await scrollAll(page);
    await act(page,s,view);
    if (!s.modal) await scrollAll(page);
    else { await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.complete?null:new Promise(r=>{i.addEventListener('load',r,{once:true});i.addEventListener('error',r,{once:true});setTimeout(r,6000)})))}); await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{}); }
    if (s.modal && !['menuPublic','adminMenu'].includes(s.op) && await page.locator('#modal').count()) {
      const modalOpen=await page.locator('#modal').evaluate(e=>e.open||!e.hidden);
      if(!modalOpen) warnings.push(`${number} ${view}: modal esperado no abrió (${s.key}).`);
    }
    const broken=await page.evaluate(()=>[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.currentSrc||i.src));
    for(const x of broken) warnings.push(`${number} ${view}: imagen rota ${x}`);
    for(const x of bad) warnings.push(`${number} ${view}: ${x}`);
    const file=path.join(OUT,view,`${pad(number)}-${s.key}.png`);
    await page.screenshot({path:file,fullPage:!s.modal,animations:'disabled',caret:'hide'});
    if(fs.statSync(file).size<5000) warnings.push(`${number} ${view}: captura sospechosamente pequeña ${file}`);
    return file;
  } finally { await ctx.close(); }
}
function fitText(t,font,size,maxWidth) {
  if(font.widthOfTextAtSize(t,size)<=maxWidth)return t;
  let a=t;while(a.length&&font.widthOfTextAtSize(a+'…',size)>maxWidth)a=a.slice(0,-1);return a+'…';
}
async function makePDF(rows) {
  const pdf=await PDFDocument.create();
  const arial=await pdf.embedFont(StandardFonts.Helvetica);
  const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
  const W=900,H=1050, ink=rgb(.07,.13,.24), orange=rgb(.97,.38,.08), gray=rgb(.38,.43,.50);
  const cover=pdf.addPage([W,H]);
  cover.drawRectangle({x:0,y:H-30,width:W,height:30,color:orange});
  cover.drawText('EnObra – Documentación de pantallas',{x:66,y:650,size:38,font:bold,color:ink});
  const date=new Date().toLocaleDateString('es-GT',{timeZone:'America/Guatemala',day:'numeric',month:'long',year:'numeric'});
  cover.drawText(date,{x:68,y:603,size:20,font:arial,color:gray});
  cover.drawText(`${S.length} pantallas · ${rows.length} capturas · escritorio y móvil`,{x:68,y:550,size:19,font:arial,color:ink});
  cover.drawText('Prototipo estático de EnObra · documentación visual',{x:68,y:80,size:16,font:arial,color:gray});
  const perIndex=43, indexCount=Math.ceil(S.length/perIndex), indexes=Array.from({length:indexCount},()=>pdf.addPage([W,H]));
  const firstPages=new Map();
  for(const row of rows) {
    const img=await pdf.embedPng(fs.readFileSync(row.file));
    const scale=row.view==='movil'?1:Math.min(810/img.width,1);
    const contentBottom=55,contentTop=H-115, usable=contentTop-contentBottom;
    const slicePx=usable/scale;
    const count=Math.ceil(img.height/slicePx);
    firstPages.set(`${row.number}:${row.view}`,pdf.getPageCount()+1);
    for(let part=0;part<count;part++) {
      const p=pdf.addPage([W,H]);
      const offset=part*slicePx, ix=(W-img.width*scale)/2;
      p.drawImage(img,{x:ix,y:contentTop-(img.height-offset)*scale,width:img.width*scale,height:img.height*scale});
      p.drawRectangle({x:0,y:contentTop,width:W,height:H-contentTop,color:rgb(1,1,1)});
      p.drawRectangle({x:0,y:0,width:W,height:contentBottom,color:rgb(1,1,1)});
      p.drawRectangle({x:35,y:contentTop-1,width:W-70,height:1,color:gray,opacity:.25});
      const title=`${pad(row.number)} · ${row.title}${count>1&&part>0?` (continuación ${part}/${count-1})`:''}`;
      p.drawText(fitText(title,bold,24,W-110),{x:45,y:H-51,size:24,font:bold,color:ink});
      p.drawText(fitText(`${row.view==='movil'?'Móvil':'Escritorio'} · ${row.url} · ${row.state}`,arial,12,W-105),{x:46,y:H-78,size:12,font:arial,color:gray});
      p.drawText(`Página ${pdf.getPageCount()} · ${part+1}/${count}`,{x:46,y:25,size:11,font:arial,color:gray});
    }
  }
  indexes.forEach((p,ix)=>{
    p.drawText(`Índice de pantallas${indexCount>1?` · ${ix+1}/${indexCount}`:''}`,{x:50,y:H-70,size:28,font:bold,color:ink});
    const subset=S.slice(ix*perIndex,(ix+1)*perIndex);
    subset.forEach((s,j)=>{
      const n=ix*perIndex+j+1,y=H-112-j*21;
      p.drawText(fitText(`${pad(n)}  ${s.title}`,arial,12,590),{x:55,y,size:12,font:arial,color:ink});
      p.drawText(`E ${firstPages.get(`${n}:escritorio`)} · M ${firstPages.get(`${n}:movil`)}`,{x:710,y,size:11,font:arial,color:gray});
    });
    p.drawText('E = escritorio · M = móvil. Las capturas largas continúan en páginas consecutivas.',{x:55,y:42,size:11,font:arial,color:gray});
  });
  const output=path.join(OUT,'EnObra-pantallas.pdf');
  fs.writeFileSync(output,await pdf.save({useObjectStreams:true}));
  return {output,pages:pdf.getPageCount()};
}
async function main() {
  verifyInventory();
  for(const d of ['escritorio','movil']) fs.mkdirSync(path.join(OUT,d),{recursive:true});
  fs.writeFileSync(path.join(OUT,'inventario.md'),'# Inventario de pantallas\n\n'+S.map((s,i)=>`${pad(i+1)}. **${s.title}** — \`${s.url}\`. Estado: ${s.state}. Acciones: ${s.action}`).join('\n')+'\n');
  const server=await startServer();
  let browser;
  try {
    const exe=chromium.executablePath();
    browser=await chromium.launch({headless:true,...(fs.existsSync(exe)?{}:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})});
    const rows=[];
    const reportFile=path.join(OUT,'reporte.json');
    const warnings=process.argv.includes('--resume')&&fs.existsSync(reportFile)?JSON.parse(fs.readFileSync(reportFile,'utf8')).warnings:[];
    for(let i=0;i<S.length;i++) for(const view of ['escritorio','movil']) {
      const s=S[i],n=i+1;
      const existing=path.join(OUT,view,`${pad(n)}-${s.key}.png`);
      if(process.argv.includes('--resume')&&fs.existsSync(existing)&&fs.statSync(existing).size>=5000){rows.push({...s,number:n,view,file:existing});continue}
      process.stdout.write(`[${pad(n)}/${S.length}] ${view}: ${s.title}\n`);
      try { const file=await capture(browser,s,n,view,warnings);rows.push({...s,number:n,view,file}); }
      catch(e) { warnings.push(`${n} ${view}: no se pudo reproducir ${s.key}: ${e.message}`); }
    }
    fs.writeFileSync(path.join(OUT,'reporte.json'),JSON.stringify({screens:S.length,images:rows.length,warnings},null,2));
    if(rows.length!==S.length*2) throw new Error(`Capturas incompletas: ${rows.length} de ${S.length*2}. Consulta capturas/reporte.json.`);
    const {output,pages}=await makePDF(rows);
    fs.writeFileSync(path.join(OUT,'reporte.json'),JSON.stringify({screens:S.length,images:rows.length,pdfPages:pages,warnings},null,2));
    console.log(`LISTO: ${rows.length} imágenes, ${pages} páginas PDF, ${warnings.length} advertencias. ${output}`);
  } finally {if(browser)await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
