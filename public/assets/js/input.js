/* Entrada: teclado, gesto de arraste e direcional na tela.
 *
 * Bug sério corrigido: o código antigo validava a tecla contra `direction`,
 * que só era atualizada no tick. Duas teclas no mesmo quadro (indo para a
 * direita, apertar "cima" e depois "esquerda") passavam as duas validações e
 * o robô invertia 180° sobre o próprio corpo — morte instantânea sem erro do
 * jogador. Agora existe uma fila de até duas curvas e cada nova entrada é
 * validada contra a última já enfileirada.
 *
 * O toque também passou a ser habilitado por capacidade do aparelho e não por
 * user-agent, e o gesto cancela o scroll/pull-to-refresh da página. */
'use strict';

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

const Input = {
  queue: [],
  _lastQueued: 'right',
  onPause: null,
  onConfirm: null,

  reset(dir = 'right') {
    this.queue.length = 0;
    this._lastQueued = dir;
  },

  push(dir) {
    if (!dir || this.queue.length >= 2) return;
    if (dir === this._lastQueued || dir === OPPOSITE[this._lastQueued]) return;
    this.queue.push(dir);
    this._lastQueued = dir;
  },

  take(current) {
    if (this.queue.length) return this.queue.shift();
    return current;
  },

  init() {
    const KEYS = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', a: 'left', s: 'down', d: 'right',
      W: 'up', A: 'left', S: 'down', D: 'right'
    };

    window.addEventListener('keydown', e => {
      if (e.repeat) return;
      const dir = KEYS[e.key];
      if (dir) {
        this.push(dir);
        e.preventDefault();          // evita rolar a página com as setas
        return;
      }
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (this.onPause) this.onPause();
        e.preventDefault();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (this.onConfirm) this.onConfirm();
        e.preventDefault();
      }
    });

    this._initTouch();
    this._initPad();
  },

  _initTouch() {
    if (!ENV.hasTouch) return;
    const surface = document.getElementById('boardWrap') || document.body;
    let sx = 0, sy = 0, st = 0, tracking = false;
    const MIN = 18;      // px — gesto curto já conta, resposta mais ágil

    surface.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      tracking = true;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      st = performance.now();
    }, { passive: true });

    surface.addEventListener('touchmove', e => {
      if (!tracking) return;
      e.preventDefault();           // sem scroll nem pull-to-refresh
      const dx = e.touches[0].clientX - sx;
      const dy = e.touches[0].clientY - sy;
      if (Math.abs(dx) < MIN && Math.abs(dy) < MIN) return;
      this.push(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left')
                                            : (dy > 0 ? 'down' : 'up'));
      // Reinicia a origem: um arraste longo pode encadear curvas.
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      tracking = true;
    }, { passive: false });

    surface.addEventListener('touchend', e => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      const quick = performance.now() - st < 250;
      if (Math.abs(dx) >= MIN || Math.abs(dy) >= MIN) {
        this.push(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left')
                                              : (dy > 0 ? 'down' : 'up'));
      } else if (quick) {
        // Toque simples: vira na direção do toque em relação ao robô.
        if (this.onTap) this.onTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    }, { passive: true });

    surface.addEventListener('touchcancel', () => { tracking = false; }, { passive: true });
  },

  /* Direcional na tela: alguns jogadores não gostam de gesto, e o gesto
   * falha com o aparelho apoiado. O antigo só tinha swipe. */
  _initPad() {
    const pad = document.getElementById('dpad');
    if (!pad) return;
    pad.querySelectorAll('[data-dir]').forEach(btn => {
      const fire = e => {
        e.preventDefault();
        this.push(btn.dataset.dir);
        if (window.navigator.vibrate) navigator.vibrate(8);
      };
      btn.addEventListener('pointerdown', fire);
      btn.addEventListener('contextmenu', e => e.preventDefault());
    });
  }
};
