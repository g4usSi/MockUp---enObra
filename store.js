/* Adaptador local del prototipo. Sustituir por una API autenticada en producción. */
(() => {
 const key='enobra-cms-v2', defaults=JSON.parse(JSON.stringify(window.ENOBRA));
 const memory={};
 function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f;}catch{return memory[k]??f;}}
 function write(k,v){memory[k]=v;try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}}
 const saved=read(key,null);
 const valid=d=>d&&typeof d==='object'&&['properties','projects','news','services'].every(k=>Array.isArray(d[k]))&&d.company&&d.institution;
 window.EnObraStore={defaults,read,write,valid,data:valid(saved)?saved:JSON.parse(JSON.stringify(defaults)),save(){return write(key,this.data);},reset(){this.data=JSON.parse(JSON.stringify(defaults));return this.save();}};
})();
