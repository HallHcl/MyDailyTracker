const CACHE_NAME = 'daily-tracker-v10';
const ASSETS = [
  './',
  './money.html',
  './style.css',
  './script.js',
  './manifest.json',
  './favicon.svg'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Never intercept Firebase / Firestore network calls
  if (e.request.url.includes('firebase') || e.request.url.includes('firestore') || e.request.url.includes('googleapis.com')) {
    return;
  }

  if (e.request.url.includes('script.js') || e.request.url.includes('money.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
