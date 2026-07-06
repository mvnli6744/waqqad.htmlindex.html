var CACHE="wq-shell-v1";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(["./","./index.html"]);}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var fetchPromise=fetch(e.request).then(function(res){
        caches.open(CACHE).then(function(c){c.put(e.request,res.clone());});
        return res;
      }).catch(function(){return cached;});
      return cached||fetchPromise;
    })
  );
});
