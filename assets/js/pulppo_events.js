
(function(){
  function postEvent(payload){
    try{
      fetch('https://api.pulppo.com/legals/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', function(){
    if(document.body && document.body.getAttribute('data-track-visit')==='true'){
      postEvent({type:'visit'});
    }
    document.querySelectorAll('[data-track]').forEach(function(el){
      el.addEventListener('click', function(){
        var t = this.getAttribute('data-track') || 'visit';
        var ctx = this.getAttribute('data-track-context') || '';
        postEvent({type: t, context: ctx});
      });
    });
  });
})();
