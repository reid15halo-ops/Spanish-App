/**
 * Service Worker for Spanish Learning App
 *
 * Provides offline functionality, caching, and background sync
 */

const CACHE_VERSION = 'v1.2.0';
const CACHE_NAME = `spanish-app-${CACHE_VERSION}`;
const DATA_CACHE = `spanish-app-data-${CACHE_VERSION}`;

// Files to cache immediately on install
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',

    // Core JavaScript (aktuelle Dateien)
    '/js/app-core.js',
    '/js/exercise-data.js',
    '/js/utils.js',
    '/js/config/environment.js',

    // Adaptive Learning System (aktuelle Dateien)
    '/js/adaptive-learning.js',
    '/js/adaptive-practice-system.js',

    // Core Systems
    '/js/data-manager.js',
    '/js/error-handling.js',
    '/js/monitoring.js',
    '/js/production-config.js',
    '/js/performance-optimizations.js',

    // Enhanced Features
    '/js/level-test-system.js',
    '/js/improved-feedback.js',
    '/js/tolerant-validator.js',

    // Styles
    '/css/styles.css',
    '/css/ux-enhancements.css',

    // Data files
    '/data/phase1-vocabulary.json',
    '/data/items.json',
    '/data/verbs.json',

    // Exercise data
    '/data/phase1-exercises/unit1-pronouns.json',
    '/data/phase1-exercises/unit2-ser.json',
    '/data/phase1-exercises/unit3-estar.json',
    '/data/phase1-exercises/unit4-ser-estar-contrast.json',
    '/data/phase1-exercises/unit5-tener.json',
    '/data/phase1-exercises/unit6-vocabulary.json',
    '/data/phase1-exercises/unit7-integration.json',

    // Icons (will be created)
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Skip waiting');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Cache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('spanish-app-') &&
                                   cacheName !== CACHE_NAME &&
                                   cacheName !== DATA_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
        return;
    }

    // Handle data requests (cache-first strategy)
    if (request.url.includes('/data/')) {
        event.respondWith(cacheFirstStrategy(request, DATA_CACHE));
        return;
    }

    // Handle API requests (network-first strategy)
    if (request.url.includes('/api/')) {
        event.respondWith(networkFirstStrategy(request, DATA_CACHE));
        return;
    }

    // Handle static assets (cache-first strategy)
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});

/**
 * Cache-first strategy: Check cache first, fallback to network
 */
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            console.log('[Service Worker] Serving from cache:', request.url);
            return cachedResponse;
        }

        console.log('[Service Worker] Fetching from network:', request.url);
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);

        // Return offline page if available
        if (request.destination === 'document') {
            const cache = await caches.open(CACHE_NAME);
            const offlinePage = await cache.match('/offline.html');
            if (offlinePage) {
                return offlinePage;
            }
        }

        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Network-first strategy: Try network first, fallback to cache
 */
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[Service Worker] Network failed, trying cache:', request.url);

        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Background sync for saving progress
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

async function syncProgress() {
    console.log('[Service Worker] Syncing progress...');

    // If cloud sync is enabled, sync with server
    // For now, just log
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'PROGRESS_SYNCED',
            timestamp: Date.now()
        });
    });
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Spanish Learning App';
    const options = {
        body: data.body || 'Time to practice your Spanish!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: [
            {
                action: 'open',
                title: 'Start Learning'
            },
            {
                action: 'close',
                title: 'Later'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handler for commands from main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }
});

console.log('[Service Worker] Loaded, version:', CACHE_VERSION);
