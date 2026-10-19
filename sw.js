/**
 * ============================================================================
 * SERVICE WORKER: sw.js (Soporte Offline y PWA para Android, iOS y Desktop)
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * Arquitectura Offline-First:
 * Permite que la aplicación funcione en el celular sin conexión a internet
 * (por ejemplo, en el bus, metro o zonas sin Wi-Fi).
 * Intercepta peticiones de red y sirve archivos desde la memoria caché local.
 */

const CACHE_NAME = 'adso-focus-v1.2';

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

// 1. Evento Install: Descarga y guarda en caché los recursos esenciales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// 2. Evento Activate: Limpia versiones antiguas de caché para liberar memoria
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
        }).then(() => self.clients.claim())
    );
});

// 3. Evento Fetch: Estrategia Cache First con Network Fallback
self.addEventListener('fetch', (event) => {
    // Solo manejamos peticiones GET (no mutaciones ni llamadas externas complejas)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Si está en caché, lo servimos de inmediato
                return cachedResponse;
            }

            // Si no está en caché, intentamos descargarlo por red
            return fetch(event.request).then((networkResponse) => {
                // Si la respuesta es válida, la guardamos dinámicamente en caché
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Si no hay red y la petición busca un recurso HTML, podemos mostrar la página principal
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

