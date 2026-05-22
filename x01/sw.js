/* ==========================================================================
   OFFLINE SERVICE WORKER (Cache-First Strategy)
   ========================================================================== */

const CACHE_NAME = 'prahladraj-portfolio-v3';
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'style.css',
    'app.js'
];

// 1. Install Phase - Cache critical site files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching site shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting()) // Force activation
    );
});

// 2. Activation Phase - Clean up deprecated cache versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache storage:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Immediately take control of all open pages
    );
});

// 3. Fetch Phase - Serve cached resources first, falling back to network
self.addEventListener('fetch', (event) => {
    // Avoid caching non-HTTP/HTTPS protocols (like chrome-extension or file URLs)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse; // Return cache match instantly
                }

                // If not in cache, fetch from the network
                return fetch(event.request).then((networkResponse) => {
                    // Check if response is valid
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Dynamically cache new local resources
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                }).catch(() => {
                    // Fail gracefully offline for resources not in cache
                    console.log('[Service Worker] Resource fetch failed (offline and uncached):', event.request.url);
                });
            })
    );
});
