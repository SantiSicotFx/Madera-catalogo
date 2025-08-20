const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Año footer */
const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

/* Menús hamburguesa */
function setupHamb(btnId, navId){
  const btn = $(btnId), nav = $(navId);
  if(!btn || !nav) return;
  btn.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    nav.classList.remove('open'); btn.setAttribute('aria-expanded','false');
  }));
}
setupHamb('#hambBtn','#mobNav');
setupHamb('#hambBtn2','#mobNav2');

/* Scroll suave anclas internas */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1), target=document.getElementById(id);
    if(!target) return; /* permite links a otras páginas */
    e.preventDefault();
    const y = target.getBoundingClientRect().top + scrollY - 8;
    animateScrollTo(y, 800);
  });
});
function animateScrollTo(targetY, duration=800){
  const startY = scrollY, dist = targetY - startY; let t0=null;
  function step(ts){ if(!t0) t0=ts; const t=Math.min((ts-t0)/duration,1);
    const eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    scrollTo(0, startY + dist*eased); if(t<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Flecha volver arriba */
const toTopBtn = $('#toTop');
if(toTopBtn){
  window.addEventListener('scroll',()=>{ if(scrollY>400) toTopBtn.classList.add('show'); else toTopBtn.classList.remove('show'); });
  toTopBtn.addEventListener('click',e=>{ e.preventDefault(); animateScrollTo(0,850); });
}

/* ===== Catálogo (solo si existe #grid) ===== */
const grid = $('#grid'), q = $('#q'), sortSel = $('#sort'), moreBtn = $('#more');
const modal = $('#modal'), mImg=$('#mImg'), mTitle=$('#mTitle'), mDesc=$('#mDesc'),
      mPrice=$('#mPrice'), mCat=$('#mCat'), mSku=$('#mSku'), mContact=$('#mContact');

const DATA = [
 {id:1, title:'Silla Nordic', cat:'sillas', price:129, sku:'S-NOR-01', desc:'Madera curvada, tapizado easy-clean.', img:'https://plus.unsplash.com/premium_photo-1683891069007-b374fcfb9c92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:2, title:'Mesa Roble 180', cat:'mesas', price:690, sku:'M-ROB-180', desc:'Roble macizo, 180×90, acabado al aceite.', img:'https://plus.unsplash.com/premium_photo-1722843459670-cc2560c22b36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:3, title:'Sofá Lino 3C', cat:'sofas', price:980, sku:'SO-LIN-3C', desc:'Estructura de madera, fundas lavables.', img:'https://plus.unsplash.com/premium_photo-1673548917477-4c0c8889b439?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:4, title:'Estantería Arc', cat:'estanterias', price:410, sku:'E-ARC-04', desc:'Fresno y acero, 5 estantes.', img:'https://images.unsplash.com/photo-1588111948296-83a8e036e004?q=80&w=711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:5, title:'Butaca Low', cat:'sillas', price:210, sku:'S-LOW-02', desc:'Asiento amplio, respaldo reclinado.', img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop'},
 {id:6, title:'Mesa Aux Round', cat:'mesas', price:160, sku:'M-AUX-RO', desc:'Mesa lateral redonda, petiribí.', img:'https://images.unsplash.com/photo-1511190404154-700f574540f2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:7, title:'Sofá Terra', cat:'sofas', price:1150, sku:'SO-TER-02', desc:'Tapizado chenille, patas de roble.', img:'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200&auto=format&fit=crop'},
 {id:8, title:'Banco Entrada', cat:'bancos', price:140, sku:'B-ENT-01', desc:'Banco de paso, 100 cm.', img:'https://plus.unsplash.com/premium_photo-1663076232399-887f2ca6c015?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:9, title:'Estantería Grid', cat:'estanterias', price:520, sku:'E-GRD-05', desc:'Módulos ajustables, fresno.', img:'https://images.unsplash.com/photo-1572734389279-e4fa423ca9db?q=80&w=684&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:10,title:'Silla Spindle', cat:'sillas', price:175, sku:'S-SPI-03', desc:'Estilo windsor, respaldo varillas.', img:'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop'},
 {id:11,title:'Mesa Café Trio', cat:'mesas', price:220, sku:'M-CAF-TR', desc:'Set de 3 nidos, roble.', img:'https://plus.unsplash.com/premium_photo-1711391585226-45a983eb8e70?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
 {id:12,title:'Sillón Lounge', cat:'sofas', price:640, sku:'SO-LOU-01', desc:'Estructura vista, cuero vegano.', img:'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
];

let PAGE = 0, PAGE_SIZE = 8, VIEW = [];

function render(list){
  if(!grid) return;
  grid.innerHTML = list.map(p=>`
    <article class="card" data-id="${p.id}" tabindex="0">
      <img class="thumb" src="${p.img}" alt="${p.title}" loading="lazy" decoding="async">
      <div class="body">
        <div class="tag">${p.cat}</div>
        <h3>${p.title}</h3>
        <p class="muted">${p.desc}</p>
        <div class="price"><span>USD ${p.price}</span><button class="btn" data-id="${p.id}">Ver</button></div>
      </div>
    </article>`).join('');
}

function paginate(){
  const end = Math.min(DATA.length, (PAGE+1)*PAGE_SIZE);
  VIEW = DATA.slice(0, end);
  render(VIEW);
  if(moreBtn) moreBtn.style.display = end >= DATA.length ? 'none' : 'inline-flex';
}

function searchAndSort(){
  if(!q || !sortSel) return;
  const term = (q.value||'').toLowerCase().trim();
  let list = DATA.filter(p => `${p.title} ${p.desc} ${p.cat} ${p.sku}`.toLowerCase().includes(term));
  const v = sortSel.value;
  if(v==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(v==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(v==='name-asc') list.sort((a,b)=>a.title.localeCompare(b.title));
  if(v==='name-desc') list.sort((a,b)=>b.title.localeCompare(a.title));
  VIEW = list.slice(0, (PAGE+1)*PAGE_SIZE);
  render(VIEW);
  if(moreBtn) moreBtn.style.display = VIEW.length >= list.length ? 'none' : 'inline-flex';
}

function openModal(p){
  if(!modal) return;
  mImg.src=p.img; mImg.alt=p.title;
  mTitle.textContent=p.title;
  mDesc.textContent=p.desc;
  mPrice.textContent=`USD ${p.price}`;
  mCat.textContent=p.cat;
  mSku.textContent=`SKU ${p.sku}`;
  mContact.href=`mailto:madera@gmail.com?subject=Consulta%20${encodeURIComponent(p.title)}&body=Hola,%20me%20interesa%20el%20${encodeURIComponent(p.title)}%20(SKU%20${p.sku}).`;
  modal.style.display='grid'; modal.setAttribute('aria-hidden','false');
}
function closeModal(){ if(!modal) return; modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }

if(grid){
  grid.addEventListener('click',e=>{
    const id=e.target.dataset.id || e.target.closest('.card')?.dataset.id;
    if(!id) return; const p=DATA.find(x=>x.id==id); if(!p) return; openModal(p);
  });
  grid.addEventListener('keydown',e=>{
    if(e.key==='Enter'){ const id=e.target.dataset.id || e.target.closest('.card')?.dataset.id;
      if(!id) return; const p=DATA.find(x=>x.id==id); if(!p) return; openModal(p);
    }
  });
  $('.close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });

  q?.addEventListener('input',()=>{ PAGE=0; searchAndSort(); });
  document.addEventListener('keydown',e=>{ if(e.key==='/'){ if(q){ q.focus(); e.preventDefault(); } }});
  sortSel?.addEventListener('change',()=>{ PAGE=0; searchAndSort(); });
  moreBtn?.addEventListener('click',()=>{ PAGE++; searchAndSort(); });

  PAGE=0; paginate();
}
