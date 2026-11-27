/* Service worker.
 * Problemas do anterior:
 *  - nunca era registrado por nenhuma página: o PWA não funcionava offline;
 *  - a lista continha caminhos inexistentes (/icons/icon-192.png) e um nome
 *    com erro de digitação (langue-select.js). cache.addAll() falha inteiro se
 *    UM item falhar, então a instalação nunca completava;
 *  - a estratégia era cache-first para tudo, inclusive o HTML: depois do
 *    primeiro acesso o jogador ficava preso numa versão velha para sempre. */
const VERSION = 'v6';
const SHELL = 'magnobot-shell-' + VERSION;
const RUNTIME = 'magnobot-runtime-' + VERSION;

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css?v=6',
  './assets/js/config.js?v=6',
  './assets/js/storage.js?v=6',
  './assets/js/i18n.js?v=6',
  './assets/js/audio.js?v=6',
  './assets/js/assets.js?v=6',
  './assets/js/renderer.js?v=6',
  './assets/js/input.js?v=6',
  './assets/js/ui.js?v=6',
  './assets/js/game.js?v=6',
  './assets/js/main.js?v=6',
  './assets/images/robot.png',
  './assets/images/robot-actived-1.png',
  './assets/images/robot-actived-2.png',
  './assets/images/box.png',
  './assets/images/ghost.png',
  './assets/images/arena-mobile.webp',
  './assets/images/arena.webp',
  './assets/images/logo-360.webp',
  './assets/images/logo-360.jpg',
  './assets/favicon/favicon-96x96.png'
];
for (let i = 1; i <= 10; i++) SHELL_FILES.push('./assets/images/power-up-' + i + '.jpg');

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // Um por um: um arquivo ausente não impede a instalação dos outros.
    await Promise.all(SHELL_FILES.map(url =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // HTML: rede primeiro, para o jogador receber atualizações.
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith((async () => {
      // Só a página do jogo vai para o slot './index.html'. Antes, qualquer
      // página aberta (ex.: /privacy) sobrescrevia a cópia offline do jogo.
      const path = new URL(req.url).pathname;
      const scope = new URL(self.registration.scope).pathname;
      const isGame = path === scope || path === scope + 'index.html';
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const cache = await caches.open(isGame ? SHELL : RUNTIME);
          cache.put(isGame ? './index.html' : req, fresh.clone());
        }
        return fresh;
      } catch (_) {
        if (!isGame) {
          const page = await caches.match(req, { ignoreSearch: true });
          if (page) return page;
        }
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // Resto: cache primeiro, com atualização em segundo plano.
  event.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: false });
    if (hit) {
      fetch(req).then(res => {
        if (res && res.ok) caches.open(RUNTIME).then(c => c.put(req, res));
      }).catch(() => {});
      return hit;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok && res.type === 'basic') {
        const cache = await caches.open(RUNTIME);
        cache.put(req, res.clone());
      }
      return res;
    } catch (_) {
      return Response.error();
    }
  })());
});
