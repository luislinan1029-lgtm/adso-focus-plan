/**
 * ============================================================================
 * SERVICE WORKER: sw.js (Soporte Offline y PWA para Android, iOS y Desktop)
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * Estrategia Network-First para HTML (permite ver cambios inmediatamente al recargar)
 * y Cache-First para recursos estáticos (imágenes, CSS, JS).
 */

const CACHE_NAME = 'adso-focus-v3.0';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/styles.css',
    './js/storage.js',
    './js/streak.js',
    './js/notifications.js',
    './js/mascot.js',
    './js/timer.js',
    './js/tasks.js',
    './js/app.js',
    './manifest.json',
    './icons/icon.svg',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// 1. Evento Install: Descarga recursos y fuerza la activación inmediata
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Reemplaza de inmediato el Service Worker anterior
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Evento Activate: Elimina cachés antiguas automáticamente
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma control de todas las pestañas de inmediato
    );
});

// 3. Evento Fetch: Network-First para index.html para que los cambios se vean siempre al recargar
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const isHTML = event.request.mode === 'navigate' || 
                   (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

    if (isHTML) {
        // Para páginas HTML: Intentar red primero; si no hay red, usar caché
        event.respondWith(
            fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                return caches.match('./index.html');
            })
        );
        return;
    }

    // Para otros recursos (CSS, JS, iconos): Stale-While-Revalidate
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
