const CACHE='coco-jewel-garden-v30';
const ASSETS=['./?v=30','index.html','manifest.json','css/game.css?v=30','js/game.js?v=30'];
function bustHtml(html){
  return html
    .replaceAll('css/game.css?v=29','css/game.css?v=30')
    .replaceAll('js/game.js?v=29','js/game.js?v=30')
    .replaceAll('Rocket</b><i class="count">3</i>','Rocket</b><i class="count">5</i>')
    .replaceAll('Bomb</b><i class="count">3</i>','Bomb</b><i class="count">4</i>')
    .replaceAll('Rainbow</b><i class="count">1</i>','Rainbow</b><i class="count">2</i>')
    .replaceAll('Moves +5</b><i class="count">2</i>','Moves +5</b><i class="count">3</i>');
}
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
  ]));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const accept=event.request.headers.get('accept')||'';
  const isHtml=event.request.mode==='navigate'||accept.includes('text/html');
  if(isHtml){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>r.text()).then(html=>new Response(bustHtml(html),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});
