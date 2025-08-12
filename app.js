// Google Sheets endpoint (Apps Script Web App)
const GS_ENDPOINT = window.GS_ENDPOINT || 'https://script.google.com/macros/s/AKfycbzhLb2e7-WZN5lyGDmglWX0Qd_AD4ZIoHL6qytShtMDXDWcbXmOYD8GHbMIBcXwzLne/exec';

// Data bootstrap
async function loadDocs(){
  try{
    const res = await fetch('docs.json', {cache:'no-store'});
    if(res.ok){
      const j = await res.json();
      if(Array.isArray(j) && j.length) return j;
    }
  }catch(e){ console.warn('docs.json no disponible, uso fallback embebido'); }
  // Fallback
  return Array.isArray(window.DOCS) ? window.DOCS : [];
}

const state = { docs: [], currentIndex: 0, perView: 4 };

function computePerView(){
  const w = window.innerWidth;
  if(w < 520) return 1.15;
  if(w < 768) return 2.2;
  if(w < 1024) return 3.2;
  return 4.2;
}

function renderSlides(){
  const track = document.getElementById('slider-track');
  const dots = document.getElementById('slider-dots');
  track.innerHTML = '';
  dots.innerHTML = '';
  state.docs.forEach((d, i) => {
    const slide = document.createElement('article');
    slide.className = 'slide';
    slide.innerHTML = `
      <img alt="Preview ${d.title}" src="${d.preview}"/>
      <div class="card-body">
        <h4>${d.title}</h4>
        <div class="actions">
          <span class="badge">PDF</span>
          <button class="btn btn-primary download-btn" data-pdf="${d.pdf}">Descargar</button>
        </div>
      </div>
    `;
    track.appendChild(slide);
  });
  const totalPages = Math.ceil(state.docs.length / Math.floor(state.perView));
  for(let i=0; i<totalPages; i++){
    const b = document.createElement('button');
    if(i===0) b.classList.add('active');
    b.addEventListener('click', ()=>{
      const slideWidth = track.querySelector('.slide').offsetWidth + 12;
      track.scrollTo({left: i * slideWidth * Math.floor(state.perView), behavior:'smooth'});
      [...dots.children].forEach(dot => dot.classList.remove('active'));
      b.classList.add('active');
    });
    dots.appendChild(b);
  }
}

function bindSliderNav(){
  const track = document.getElementById('slider-track');
  const prev = document.querySelector('.nav.prev');
  const next = document.querySelector('.nav.next');
  prev.addEventListener('click', ()=> track.scrollBy({left: -track.clientWidth, behavior:'smooth'}));
  next.addEventListener('click', ()=> track.scrollBy({left: track.clientWidth, behavior:'smooth'}));
  // Drag to scroll
  let isDown=false,startX,scrollLeft;
  track.addEventListener('mousedown', (e)=>{ isDown=true; startX=e.pageX-track.offsetLeft; scrollLeft=track.scrollLeft; });
  track.addEventListener('mouseleave', ()=> isDown=false);
  track.addEventListener('mouseup', ()=> isDown=false);
  track.addEventListener('mousemove', (e)=>{
    if(!isDown) return;
    e.preventDefault();
    const x=e.pageX-track.offsetLeft;
    const walk=(x-startX)*1.4;
    track.scrollLeft=scrollLeft-walk;
  });
}

function openModal(pdfPath){
  const modal = document.getElementById('email-modal');
  document.getElementById('requested-pdf').value = pdfPath;
  modal.setAttribute('aria-hidden','false');

  // Always show the modal. If email exists, just prefill.
  const saved = localStorage.getItem('pulppo_email');
  if(saved){
    document.getElementById('email').value = saved;
  }
  setTimeout(()=> document.getElementById('email').focus(), 50);
}

function closeModal(){
  document.getElementById('email-modal').setAttribute('aria-hidden','true');
}

function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function triggerDownload(pdfPath){
  const a = document.createElement('a');
  a.href = pdfPath;
  a.download = pdfPath.split('/').pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function bindModal(){
  const form = document.getElementById('email-form');
  const closeBtn = document.getElementById('modal-close');
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if(!validateEmail(email)){ alert('Ingresa un correo válido (email@dominio.com)'); return; }
    const pdf = document.getElementById('requested-pdf').value;

    // Log to Google Sheets (non-blocking)
    try{
      if(GS_ENDPOINT && GS_ENDPOINT.startsWith('http')){
        await fetch(GS_ENDPOINT, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ email, pdf, ts:new Date().toISOString(), ua:navigator.userAgent }),
          mode:'cors', cache:'no-cache'
        });
      }
    }catch(err){ console.warn('No se pudo registrar en Sheets:', err); }

    localStorage.setItem('pulppo_email', email);
    triggerDownload(pdf);
    closeModal();
  });
}

function bindDownloadButtons(){
  document.getElementById('slider-track').addEventListener('click', (e)=>{
    const btn = e.target.closest('.download-btn');
    if(!btn) return;
    openModal(btn.getAttribute('data-pdf'));
  });
}

function updateYear(){ document.getElementById('year').textContent = new Date().getFullYear(); }

async function bootstrap(){
  // Helper: ?resetEmail=1 borra el correo recordado
  try{ if(new URLSearchParams(location.search).get('resetEmail')==='1'){ localStorage.removeItem('pulppo_email'); } }catch(e){}
  state.docs = await loadDocs();
  state.perView = computePerView();
  renderSlides();
  bindSliderNav();
  bindDownloadButtons();
  bindModal();
  updateYear();
  window.addEventListener('resize', ()=>{ state.perView = computePerView(); renderSlides(); });
}
bootstrap();
