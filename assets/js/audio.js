/* Gerenciador de áudio.
 * Problemas corrigidos do código antigo:
 *  - .play() sem .catch() gerava "Unhandled promise rejection" quando o
 *    navegador bloqueia autoplay (padrão no Chrome e no iOS);
 *  - a música de fundo (1,9 MB) era baixada no carregamento da página;
 *  - new Audio('song-8.mp3') apontava para um arquivo inexistente (404 x10);
 *  - o estado do botão de som não era guardado entre sessões;
 *  - sons curtos sobrepostos cortavam uns aos outros. */
'use strict';

const Sound = {
  muted: false,
  unlocked: false,
  _els: {},
  _bgReady: false,

  init() {
    this.muted = Store.getBool(CONFIG.storageKeys.muted, false);
    ['start', 'point', 'power', 'gameover', 'ghost', 'activate', 'final'].forEach(name => {
      const el = document.getElementById('sfx-' + name);
      if (el) { el.preload = 'auto'; this._els[name] = el; }
    });
    this.bg = document.getElementById('sfx-bg');

    // O áudio só é liberado depois de um gesto do usuário.
    const unlock = () => this.unlock();
    ['pointerdown', 'keydown', 'touchstart'].forEach(evt =>
      window.addEventListener(evt, unlock, { once: true, passive: true })
    );
  },

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this._loadBg();
  },

  /* A trilha só começa a baixar quando realmente vai tocar. */
  _loadBg() {
    if (this._bgReady || !this.bg) return;
    this._bgReady = true;
    this.bg.querySelectorAll('source[data-src]').forEach(s => { s.src = s.dataset.src; });
    this.bg.load();
  },

  play(name) {
    if (this.muted || !this.unlocked) return;
    const el = this._els[name];
    if (!el) return;
    try {
      // Clonar permite dois efeitos ao mesmo tempo sem cortar o anterior.
      const node = el.cloneNode(true);
      node.volume = el.volume;
      const p = node.play();
      if (p && p.catch) p.catch(() => {});
      node.addEventListener('ended', () => node.remove());
    } catch (_) { /* som nunca derruba o jogo */ }
  },

  startMusic() {
    if (this.muted || !this.bg) return;
    this._loadBg();
    this.bg.volume = 0.35;
    const p = this.bg.play();
    if (p && p.catch) p.catch(() => {});
  },

  stopMusic() {
    if (!this.bg) return;
    try { this.bg.pause(); } catch (_) {}
  },

  toggle() {
    this.muted = !this.muted;
    Store.set(CONFIG.storageKeys.muted, this.muted);
    if (this.muted) this.stopMusic();
    return !this.muted;
  }
};
