const CACHE = "glass-invite-final-v4"; // bump version untuk memaksa update
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./data/config.json",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE ? caches.delete(k) : null)))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (e)=>{
  e.respondWith(
    caches.match(e.request).then((cached)=>{
      if(cached) return cached;
      return fetch(e.request).then((res)=>{
        const copy = res.clone();
        try{
          if(e.request.method==="GET" && new URL(e.request.url).origin===self.location.origin){
            caches.open(CACHE).then(c=>c.put(e.request, copy)).catch(()=>{});
          }
        }catch(_){}
        return res;
      }).catch(()=>cached);
    })
  );
});
