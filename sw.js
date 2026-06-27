const CACHE='coco-jewel-garden-v29';
const ASSETS=['./?v=29','index.html','manifest.json','css/game.css?v=29','js/game.js?v=29'];
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
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});
