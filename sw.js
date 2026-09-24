// ==============================================
// Shadow-Evolve — Service Worker (offline / PWA)
// ==============================================

const CACHE = 'shadow-evolve-v2';

// App shell: tudo que o app precisa pra funcionar offline.
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Navegações (a página em si): network-first.
// Garante que a versão mais recente sempre abre; o cache entra só como fallback offline,
// evitando que o app instalado fique "preso" numa versão antiga.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // fontes externas etc.

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() =>
          caches.match(e.request, { ignoreSearch: true }).then(
            (cached) => cached || caches.match('./index.html')
          )
        )
    );
    return;
  }

  // Demais assets: cache-first com fallback pra rede (e cacheia o que vier da rede).
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(e.request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
    )
  );
});
