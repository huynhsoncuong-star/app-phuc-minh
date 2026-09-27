const CACHE='pm-r3995tc-20260928';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png','./favicon.png'];
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(
  ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin!==self.location.origin)return;            // máy chủ API, bản đồ, CDN: để trình duyệt tự lo, không cache
  if(/\/api\/|hieu-luc\.json/.test(u.pathname))return;
  if(e.request.mode==='navigate'){                       // trang app: ưu tiên mạng để luôn lấy bản mới, mất mạng mới dùng cache
    e.respondWith(fetch(e.request).then(r=>{if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));}return r;})
      .catch(()=>caches.match('./index.html').then(h=>h||caches.match('./'))));return;}
  e.respondWith(caches.match(e.request).then(h=>{
    const n=fetch(e.request).then(r=>{if(r&&r.status===200&&r.type==='basic'){
      const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;}).catch(()=>h);
    return h||n;}));});
