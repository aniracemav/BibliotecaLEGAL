(function(){
  function postEvent(payload){
    try{
      fetch('https://api.pulppo.com/legals/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      }).then(function(r){ /* optional logging */ }).catch(function(e){ /* silent */ });
    }catch(e){/*noop*/}
  }
  // Auto-visit on load if attribute present
  document.addEventListener('DOMContentLoaded', function(){
    if(document.body && document.body.getAttribute('data-track-visit')==='true'){
      postEvent({type:'visit'});
    }
    // attach to any element with data-download
    document.querySelectorAll('[data-download]').forEach(function(btn){
      btn.addEventListener('click', function(ev){
        var email = this.getAttribute('data-email') || '';
        if(!email){
          var maybe = prompt('Ingresa tu correo para continuar con la descarga:');
          if(maybe){ email = maybe.trim(); this.setAttribute('data-email', email); }
        }
        if(email){
          postEvent({type:'download', email: email});
        }
      });
    });
  });
})();
