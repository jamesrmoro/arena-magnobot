const CACHE_NAME = "arena-magnobot-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/assets/css/style.css",
  "/assets/js/constants.js",
  "/assets/js/createjs.min.js",
  "/assets/js/game-init.js",
  "/assets/js/game-logic.js",
  "/assets/js/game-render.js",
  "/assets/js/game-state.js",
  "/assets/js/generators.js",
  "/assets/js/i18n.js",
  "/assets/js/input.js",
  "/assets/js/langue-select.js",
  "/assets/js/main.js",
  "/assets/js/preload.js",
  "/assets/js/sound.js",
];

// Instala o Service Worker e adiciona arquivos ao cache
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Armazenando arquivos no cache");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Ativa o novo Service Worker e remove caches antigos
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Ativado");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Intercepta requisições e responde com cache se disponível
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // fallback para index.html em navegação offline
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
