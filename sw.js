var CACHE="wq-shell-v2";
self.addEventListener("install",function(e){
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
/* Network-first: this app changes frequently and talks to a live backend, so
   correctness matters more than instant-from-cache. The cache only serves as
   an offline fallback, never as the default answer. */
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(
    fetch(e.request).then(function(res){
      caches.open(CACHE).then(function(c){c.put(e.request,res.clone());});
      return res;
    }).catch(function(){return caches.match(e.request);})
  );
});
