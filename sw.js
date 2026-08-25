// Service worker: zorgt dat de app ook zonder internet opent.
// Strategie: netwerk eerst, cache als terugval. Online krijg je dus altijd de
// nieuwste inhoud (belangrijk bij richtlijnteksten), offline de laatste versie
// die je hebt gezien.
//
// Let op bij wijzigen: verhoog CACHE_VERSIE, anders blijven oude bestanden hangen.
const CACHE_VERSIE = 'krn-v11';

const APP_BESTANDEN = [
  './',
  './index.html',
  './app.js',
  './fotos.js',
  './style.css',
  './beslisboom-heup.html',
  './gmfcs.html',
  './myotomen.html',
  './zenuwen.html',
  './zenuwherstel.html',
  './hipscreen.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSIE)
      .then(cache => cache.addAll(APP_BESTANDEN))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(namen => Promise.all(
        namen.filter(n => n !== CACHE_VERSIE).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Alleen gewone ophaalacties van deze site; YouTube-embeds, richtlijnlinks en
  // externe afbeeldingen laten we met rust — die horen niet in de cache en
  // werken sowieso niet offline.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        // geslaagde ophaalactie ook bewaren voor de volgende keer
        if (res && res.status === 200 && res.type === 'basic') {
          const kopie = res.clone();
          caches.open(CACHE_VERSIE).then(cache => cache.put(req, kopie));
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => {
        if (hit) return hit;
        // onbekende pagina zonder verbinding: val terug op de startpagina
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'Offline' });
      }))
  );
});
