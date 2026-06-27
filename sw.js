const CACHE='coco-jewel-garden-v26';
const PATCH=`<script>
(function(){
  if(window.__cocoHomeScreenFix26) return;
  window.__cocoHomeScreenFix26=true;
  var patchAudio=null;
  function ctx(){
    try{
      if(typeof window.unlockAudio==='function') window.unlockAudio();
      if(!patchAudio) patchAudio=new (window.AudioContext||window.webkitAudioContext)();
      if(patchAudio.state==='suspended') patchAudio.resume();
      return patchAudio;
    }catch(e){return null;}
  }
  function chirp(f,d){
    try{
      var c=ctx();
      if(!c||c.state!=='running') return;
      var o=c.createOscillator(),g=c.createGain();
      o.type='triangle'; o.frequency.value=f||520;
      g.gain.value=.001; o.connect(g); g.connect(c.destination);
      o.start();
      g.gain.setValueAtTime(.001,c.currentTime);
      g.gain.linearRampToValueAtTime(.055,c.currentTime+.01);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+(d||.08));
      o.stop(c.currentTime+(d||.08)+.02);
    }catch(e){}
  }
  function soundStart(){
    ctx();
    if(typeof window.beep==='function'){window.beep(520,.08);setTimeout(function(){window.beep(660,.08)},90);setTimeout(function(){window.beep(784,.10)},180)}
    chirp(520,.08); setTimeout(function(){chirp(784,.10)},170);
  }
  function makeGate(){
    if(document.getElementById('cocoSoundGate')) return;
    var st=document.createElement('style');
    st.textContent='#cocoSoundGate{position:fixed;inset:0;z-index:999999;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 20%,rgba(255,235,170,.28),transparent 24%),linear-gradient(160deg,#5a210a,#210803 72%);font-family:Trebuchet MS,system-ui,sans-serif}#cocoSoundGate.hide{display:none}.cocoSoundCard{width:min(88vw,520px);border-radius:34px;border:4px solid #ffd98b;background:linear-gradient(#fff5dc,#c77a35);box-shadow:0 22px 50px rgba(0,0,0,.5);padding:28px;text-align:center;color:#542008}.cocoSoundCard h1{margin:4px 0 10px;font-size:clamp(34px,8vw,58px);line-height:.92;color:#ffc45c;-webkit-text-stroke:3px #5b2108;text-shadow:0 4px 0 #ffe28a,0 8px 0 #7b350c}.cocoSoundCard p{font-size:18px;font-weight:900}.cocoStartBtn{min-height:60px;border:0;border-radius:25px;padding:0 34px;background:linear-gradient(#9bea4b,#45b908);color:white;font-size:26px;font-weight:1000;text-shadow:0 2px 0 rgba(0,0,0,.28);box-shadow:0 7px 0 rgba(76,31,8,.36),0 14px 18px rgba(31,9,2,.22)}.cocoMiniDog{width:112px;height:96px;margin:4px auto 14px;border-radius:50% 50% 42% 42%;background:radial-gradient(circle at 35% 25%,#ffe6ad,#c98335 65%,#8e4a1b);position:relative;box-shadow:0 12px 18px rgba(45,14,3,.28)}.cocoMiniDog:before,.cocoMiniDog:after{content:"";position:absolute;top:38%;width:12px;height:12px;border-radius:50%;background:#2b0d03}.cocoMiniDog:before{left:38%}.cocoMiniDog:after{right:38%}';
    document.head.appendChild(st);
    var gate=document.createElement('div');
    gate.id='cocoSoundGate';
    gate.innerHTML='<div class="cocoSoundCard"><div class="cocoMiniDog"></div><h1>Coco\'s<br>Jewel Garden</h1><p>Tap start so sound works in the Home Screen app.</p><button class="cocoStartBtn" type="button">Start Game</button></div>';
    document.body.appendChild(gate);
    gate.querySelector('button').addEventListener('click',function(){soundStart();gate.classList.add('hide')},{passive:true});
  }
  function cellFromPoint(board,x,y){
    var r=board.getBoundingClientRect();
    if(!r.width||!r.height) return null;
    var cx=Math.floor((x-r.left)/(r.width/8));
    var cy=Math.floor((y-r.top)/(r.height/8));
    if(cx<0||cx>7||cy<0||cy>7) return null;
    return {x:cx,y:cy};
  }
  function adj(a,b){return !!a&&!!b&&Math.abs(a.x-b.x)+Math.abs(a.y-b.y)===1}
  function patchBoard(){
    var board=document.getElementById('board');
    if(!board||board.__cocoPointerFix) return;
    board.__cocoPointerFix=true;
    var selected=null,active=null,dragged=false,ownBoost=null;
    document.querySelectorAll('[data-boost]').forEach(function(btn){
      btn.addEventListener('click',function(){ownBoost=btn.dataset.boost;chirp(700,.05)},true);
    });
    board.addEventListener('pointerdown',function(e){
      e.preventDefault(); e.stopImmediatePropagation(); ctx();
      var c=cellFromPoint(board,e.clientX,e.clientY); if(!c) return;
      if(ownBoost&&typeof window.applyBoost==='function'){
        window.applyBoost(ownBoost,c.x,c.y); ownBoost=null; chirp(760,.07); return;
      }
      if(selected&&adj(selected,c)&&typeof window.attemptSwap==='function'){
        var a=selected; selected=null; dragged=true; window.attemptSwap(a,c); chirp(560,.05); return;
      }
      selected=c; active=e.pointerId; dragged=false; chirp(520,.04);
      try{board.setPointerCapture(e.pointerId)}catch(err){}
    },true);
    board.addEventListener('pointermove',function(e){
      if(active!==e.pointerId||!selected) return;
      e.preventDefault(); e.stopImmediatePropagation();
      var c=cellFromPoint(board,e.clientX,e.clientY); if(!adj(selected,c)) return;
      var a=selected; selected=null; active=null; dragged=true;
      if(typeof window.attemptSwap==='function') window.attemptSwap(a,c);
      chirp(560,.05);
    },true);
    board.addEventListener('pointerup',function(e){
      e.preventDefault(); e.stopImmediatePropagation();
      try{board.releasePointerCapture(e.pointerId)}catch(err){}
      active=null; dragged=false;
    },true);
    board.addEventListener('pointercancel',function(){active=null;dragged=false},true);
  }
  document.addEventListener('pointerdown',ctx,true);
  document.addEventListener('click',function(e){if(e.target.closest('button')) chirp(480,.04)},true);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){makeGate();patchBoard()});
  else {makeGate();patchBoard()}
  setInterval(patchBoard,1000);
})();
<\/script>`;
function patchHtml(html){
  if(!html || html.includes('__cocoHomeScreenFix26')) return html;
  return html.replace('</body>', PATCH+'</body>');
}
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./?v=26','index.html','manifest.json'])));
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
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>response.text()).then(html=>new Response(patchHtml(html),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});
