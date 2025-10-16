const CACHE_NAME = `v0.0-${new Date().getTime()}`;
const PRECACHE_ASSETS = [
    '/',
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/srs.js',
    'js/utils/ascii.js',
    'js/utils/migrator.js',
    'js/utils/performance.js',
    'js/utils/a11y-perf-hardening.js',
    'js/normalize-es.js',
    'js/conjugator.js',
    'data/items.json',
    'data/verbs.json'
];

self.addEventListener('install', event => {
    console.log('?? Installing Service Worker v0.0');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
            .catch(error => console.error('Cache installation failed:', error))
    );
});

self.addEventListener('activate', event => {
    console.log('? Activating Service Worker v0.0');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName.startsWith('v') && cacheName !== CACHE_NAME) {
                        console.log('??? Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
            .catch(error => {
                console.error('Fetch failed:', error);
                return new Response('Network error', { status: 503 });
            })
    );
});

// ASCII compliance check for service worker
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'ASCII_CHECK') {
        // Validate that service worker code contains no German umlauts
        const swCode = self.toString();
        const violations = (swCode.match(/[‰ˆ¸ƒ÷‹ﬂ]/g) || []);
        
        event.ports[0].postMessage({
            type: 'ASCII_CHECK_RESULT',
            violations,
            clean: violations.length === 0,
            timestamp: new Date().toISOString()
        });
    }
});
