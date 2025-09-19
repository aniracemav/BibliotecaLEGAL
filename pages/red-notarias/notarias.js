
const RN_ENDPOINT = 'https://api.pulppo.com/legals/events';
window.addEventListener('DOMContentLoaded', async () => {
  try { await fetch(RN_ENDPOINT, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ type:'visit' })
  }); } catch(e) { /* silent */ }
});
