const CACHE_NAME = 'spanish-app-debug-' + Date.now();
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/srs.js',
  '/data/items.json',
  '/manifest.webmanifest'
];

console.log('?? Service Worker: DEBUG BUILD');
console.log('Cache key:', CACHE_NAME);

// Install
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('SW: Installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('spanish-app-debug-') && cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('SW: Cache hit for', event.request.url);
          return response;
        }
        console.log('SW: Fetching', event.request.url);
        return fetch(event.request).then(fetchResponse => {
          // Don't cache if not ok
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          
          // Clone and cache
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return fetchResponse;
        });
      })
      .catch(error => {
        console.error('SW: Fetch failed', error);
        throw error;
      })
  );
});

// Message handler (for hard reload)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('SW: Clearing all caches...');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('SW: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('SW: All caches cleared');
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});
