
/* RED NOTARÍAS | PULPPO — notarias.js
   - Registra 'visit' al cargar la página
   - Maneja 'download' con captura de email obligatoria
*/
const RN_ENDPOINT = 'https://api.pulppo.com/legals/events';

// Utils
const rnPost = (payload) => fetch(RN_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Modal logic
const modal = {
  backdrop: null,
  init(){
    this.backdrop = document.querySelector('.rn-modal-backdrop');
    document.querySelectorAll('[data-rn-close]').forEach(el=>{
      el.addEventListener('click', ()=>this.hide());
    });
  },
  askEmail({title='Descarga', subtitle='Ingresa tu correo para continuar', onSubmit}){
    const backdrop = this.backdrop;
    const emailInput = backdrop.querySelector('#rn-email');
    const titleEl = backdrop.querySelector('#rn-modal-title');
    const subEl = backdrop.querySelector('#rn-modal-sub');
    titleEl.textContent = title;
    subEl.textContent = subtitle;
    emailInput.value='';
    backdrop.style.display='flex';
    emailInput.focus();
    const confirmBtn = backdrop.querySelector('#rn-confirm');
    const cancelBtn = backdrop.querySelector('#rn-cancel');
    const handler = async ()=>{
      const email = emailInput.value.trim();
      if(!emailRegex.test(email)){ alert('Ingresa un correo válido.'); return; }
      await onSubmit(email);
      this.hide();
    };
    confirmBtn.onclick = handler;
    cancelBtn.onclick = ()=>this.hide();
  },
  hide(){ this.backdrop.style.display='none'; }
};

// Register visit on load
window.addEventListener('DOMContentLoaded', async () => {
  modal.init();
  try{
    await rnPost({ type:'visit' });
    // console.log('Visit registered');
  }catch(e){ /* fail silently */ }
  
  // Bind download buttons
  document.querySelectorAll('[data-rn-download]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const label = btn.getAttribute('data-rn-label') || 'Descarga';
      const payload = btn.getAttribute('data-rn-payload') || '';
      modal.askEmail({
        title: label,
        subtitle: 'Tu correo se usará para registrar la descarga.',
        onSubmit: async (email)=>{
          try{
            await rnPost({ type:'download', email });
          }catch(e){ /* fail silently */ }
          // Trigger file generation & download (static text file as placeholder)
          rnGenerateAndDownloadText(`${label}.txt`, payload + `\nCorreo: ${email}`);
        }
      });
    });
  });
});

function rnGenerateAndDownloadText(filename, content){
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}
