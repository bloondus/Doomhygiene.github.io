const CACHE_NAME = 'doom-hygiene-v1';
const STATIC_CACHE = [
    '/Doomhygiene.github.io/',
    '/Doomhygiene.github.io/index.html',
    '/Doomhygiene.github.io/styles.css',
    '/Doomhygiene.github.io/app.js',
    '/Doomhygiene.github.io/feeds.js',
    '/Doomhygiene.github.io/storage.js',
    '/Doomhygiene.github.io/i18n.js',
    '/Doomhygiene.github.io/config.js',
    '/Doomhygiene.github.io/icon.svg',
    '/Doomhygiene.github.io/favicon.svg'
];

// Install - Cache static files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone response and cache it
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(event.request);
            })
    );
});
