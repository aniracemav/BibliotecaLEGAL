
// === Google Sheets endpoint (Apps Script Web App) ===
// REEMPLAZA esta URL tras desplegar tu Apps Script como Web App (ver google-sheets-setup.md)
const GS_ENDPOINT = window.GS_ENDPOINT || 'YOUR_APPS_SCRIPT_WEB_APP_URL';

// Data bootstrap
async function loadDocs(){
  const res = await fetch('docs.json');
  return await res.json();
}

const state = {
  docs: [],
  currentIndex: 0,
  perView: 4
};

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
  // Touch drag
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
  const saved = localStorage.getItem('pulppo_email');
  if(saved){
    // if already saved, bypass and download immediately
    triggerDownload(pdfPath);
    closeModal();
  } else {
    setTimeout(()=> document.getElementById('email').focus(), 50);
  }
}

function closeModal(){
  const modal = document.getElementById('email-modal');
  modal.setAttribute('aria-hidden','true');
}

function validateEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

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
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if(!validateEmail(email)){
      alert('Ingresa un correo válido (email@dominio.com)');
      return;
    }
    // Intenta registrar en Google Sheets
    const pdf = document.getElementById('requested-pdf').value;
    try {
      if(GS_ENDPOINT && GS_ENDPOINT.startsWith('http')){
        const payload = { email, pdf, ts: new Date().toISOString(), ua: navigator.userAgent };
        const resp = await fetch(GS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'cors',
          cache: 'no-cache'
        });
        // No bloqueamos la descarga si hay error de red; seguimos adelante
      }
    } catch(err) {
      console.warn('No se pudo registrar en Sheets:', err);
    }
    localStorage.setItem('pulppo_email', email);
    triggerDownload(pdf);
    closeModal();
  });
}

function bindDownloadButtons(){
  document.getElementById('slider-track').addEventListener('click', (e)=>{
    const btn = e.target.closest('.download-btn');
    if(!btn) return;
    const pdf = btn.getAttribute('data-pdf');
    openModal(pdf);
  });
}

function updateYear(){
  document.getElementById('year').textContent = new Date().getFullYear();
}

async function bootstrap(){
  state.docs = await loadDocs();
  state.perView = computePerView();
  renderSlides();
  bindSliderNav();
  bindDownloadButtons();
  bindModal();
  updateYear();
  window.addEventListener('resize', ()=>{
    state.perView = computePerView();
    renderSlides();
  });
}
bootstrap();
