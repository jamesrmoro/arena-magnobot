/* Inicialização. */
'use strict';

(function boot() {
  I18n.set(I18n.detect());
  Sound.init();
  Renderer.init(document.getElementById('gameCanvas'));
  UI.init();
  Input.init();

  Assets.load(p => UI.setProgress(p)).then(() => {
    UI.hideLoader();
    UI.show('menu');
    Game.init();
    Game.reset();
    if (Assets.failed.length) {
      console.warn('[magnobot] imagens que falharam:', Assets.failed);
    }
  });

  // PWA: a versão anterior tinha service-worker.js no projeto mas nunca o
  // registrava — o jogo não funcionava offline e não era instalável de fato.
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }

  // Botão de instalar
  let deferredPrompt = null;
  const installBtn = document.getElementById('btnInstall');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (_) {}
      deferredPrompt = null;
      installBtn.hidden = true;
    });
  }
  window.addEventListener('appinstalled', () => { if (installBtn) installBtn.hidden = true; });
})();
