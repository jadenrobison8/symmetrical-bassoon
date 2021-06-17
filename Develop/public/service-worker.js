const APP_PREFIX = 'Budget-';
const VERSION = "verson_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
   "/",
   "/index.html",
   "/css/styles.css",
   "/js/index.js",
   "/js/idb.js",
   "/icons/icon-192x192.png",
   "/icons/icon-512x512.png",
   "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
   "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

self.addEventListener('install', function(e) {
   e.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
         console.log('installing cache : ' + CACHE_NAME)
         return cache.addAll(FILES_TO_CACHE)
      })
   )
})

self.addEventListener('activate', function (e) {
   e.waitUntil(
      caches.keys().then(function (keyList) {
         let cacheKeepList = keyList.filter(function (key) {
            return key.indexOf(APP_PREFIX);
         });
         cacheKeepList.push(CACHE_NAME);

         return Promise.all(
            keyList.map(function(key, i) {
               if (cacheKeepList.indexOf(key) === -1) {
                  console.log('deleting cache : ' + keyList[i]);
                  return caches.delete(keyList[i]);
               }
            })
         );
      })
   );
});

self.addEventListener("fetch", function(e) {
   // cache successful GET requests to the API
   if (e.request.url.includes("/api/") && e.request.method === "GET") {
     e.respondWith(
       caches
         .open(CACHE_NAME)
         .then((cache) => {
           return fetch(e.request)
             .then((response) => {
               // If the response was good, clone it and store it in the cache.
               if (response.status === 200) {
                 cache.put(e.request, response.clone());
               }
 
               return response;
             })
             .catch(() => {
               // Network request failed, try to get it from the cache.
               return cache.match(e.request);
             });
         })
         .catch((err) => console.log(err))
     );
 
     // stop execution of the fetch event callback
     return;
   }
 
   // if the request is not for the API, serve static assets using
   // "offline-first" approach.
   e.respondWith(
     caches.match(e.request).then((response) => {
       return response || fetch(e.request);
     })
   );
 });