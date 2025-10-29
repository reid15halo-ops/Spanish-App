// Service Worker für Spanish Learning App
// Version 1.0.0 - Mobile-optimiert

const CACHE_VERSION = 'spanish-app-v1';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/demo.html',
  // JavaScript Core Files
  '/js/app-controller.js',
  '/js/ui-controller.js',
  '/js/phase1-controller.js',
  '/js/conjugator.js',
  '/js/srs.js',
  '/js/phase1-exercise-generator.js',
  '/js/adaptive-knowledge-tracker-v2.js',
  '/js/adaptive-learning-orchestrator.js',
  '/js/sentence-analyzer.js',
  '/js/error-pattern-detector.js',
  '/js/explanation-generator.js',
  '/js/explain.js',
  '/js/conversation-builder.js',
  '/js/practical-scenarios.js',
  '/js/csv-importer.js',
  // Data Files
  '/data/phase1-vocabulary.json',
  '/data/items.json',
  '/data/verbs.json',
  // Utility Files
  '/js/utils/a11y-perf-hardening.js',
  '/js/utils/ascii-normalization.js',
  // German Bridge System
  '/js/german-spanish-contrastive-system.js',
  '/js/german-bridge-explanation-generator.js',
  '/js/german-cognitive-load-optimizer.js',
  '/js/german-spanish-learning-system.js'
];

// Install Event - Cache Assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[SW] Caching app shell and content');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((err) => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_VERSION)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        console.log('[SW] Fetching from network:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_VERSION)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.error('[SW] Fetch failed:', err);

            // Return offline fallback for HTML pages
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }

            throw err;
          });
      })
  );
});

// Background Sync (für zukünftige Features)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-learning-data') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(syncLearningData());
  }
});

async function syncLearningData() {
  // Placeholder für zukünftigen Cloud-Sync
  console.log('[SW] Syncing learning data...');
  return Promise.resolve();
}

// Push Notifications (für zukünftige Features)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Zeit zum Lernen!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [200, 100, 200],
    tag: 'learning-reminder',
    actions: [
      {
        action: 'start',
        title: 'Jetzt lernen'
      },
      {
        action: 'later',
        title: 'Später'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Spanish Learning App', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'start') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message Handler (für Kommunikation mit der App)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
