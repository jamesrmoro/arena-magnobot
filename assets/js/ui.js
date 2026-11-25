/* Telas, HUD e modais.
 * A versão anterior misturava estilo em linha, innerHTML e uma lista manual de
 * IDs para traduzir — o placar era recriado via innerHTML a cada troca de
 * idioma, o game over não mostrava a pontuação e não havia pausa. */
'use strict';

const UI = {
  el: {},

  init() {
    const byId = id => document.getElementById(id);
    this.el = {
      menu: byId('screen-menu'),
      countdown: byId('screen-countdown'),
      countdownText: byId('countdownText'),
      over: byId('screen-over'),
      pause: byId('screen-pause'),
      help: byId('modal-help'),
      about: byId('modal-about'),
      score: byId('hudScore'),
      best: byId('hudBest'),
      combo: byId('hudCombo'),
      shield: byId('hudShield'),
      overScore: byId('overScore'),
      overBoxes: byId('overBoxes'),
      overBest: byId('overBest'),
      overRecord: byId('overRecord'),
      toast: byId('toast'),
      loader: byId('loader'),
      loaderBar: byId('loaderBar')
    };

    // Botões
    byId('btnPlay').addEventListener('click', () => this.startFlow());
    byId('btnPlayAgain').addEventListener('click', () => { this.hide('over'); Game.start(); });
    byId('btnHome').addEventListener('click', () => { this.hide('over'); this.show('menu'); this.syncHud(Game); });
    byId('btnResume').addEventListener('click', () => Game.resume());
    byId('btnQuit').addEventListener('click', () => { this.hide('pause'); Game.state = 'menu'; this.show('menu'); });
    byId('btnPause').addEventListener('click', () => Game.togglePause());
    byId('btnHelp').addEventListener('click', () => this.show('help'));
    byId('btnCloseHelp').addEventListener('click', () => {
      Store.set(CONFIG.storageKeys.tutorial, true);
      this.hide('help');
      if (this._afterHelp) { const f = this._afterHelp; this._afterHelp = null; f(); }
    });
    byId('btnAbout').addEventListener('click', () => this.show('about'));
    byId('btnCloseAbout').addEventListener('click', () => this.hide('about'));

    // Som
    const soundBtn = byId('btnSound');
    const syncSound = () => {
      const on = !Sound.muted;
      soundBtn.setAttribute('aria-pressed', String(on));
      soundBtn.textContent = on ? '🔊' : '🔇';
      soundBtn.setAttribute('aria-label', I18n.t('sound') + ': ' + I18n.t(on ? 'on' : 'off'));
    };
    soundBtn.addEventListener('click', () => {
      const on = Sound.toggle();
      if (on && Game.state === 'playing') Sound.startMusic();
      syncSound();
    });
    document.addEventListener('i18n:changed', syncSound);
    syncSound();

    // Idioma
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        I18n.set(btn.dataset.lang);
        this.syncLangButtons();
        this.syncHud(Game);
      });
    });
    this.syncLangButtons();

    // Fechar modal com Esc / clique fora
    [this.el.help, this.el.about].forEach(m => {
      if (!m) return;
      m.addEventListener('click', e => { if (e.target === m) m.classList.remove('is-open'); });
    });

    this.buildCollection();
    this.buildCornerFlags();
  },

  /* As quatro bandeirinhas animadas da arena, clonadas de um <template> para
   * não repetir o SVG inteiro quatro vezes no HTML. */
  buildCornerFlags() {
    const tpl = document.getElementById('tplCornerFlag');
    if (!tpl) return;
    ['flag-tl', 'flag-tr', 'flag-bl', 'flag-br'].forEach(id => {
      const slot = document.getElementById(id);
      if (slot && !slot.firstElementChild) slot.appendChild(tpl.content.cloneNode(true));
    });
  },

  syncLangButtons() {
    document.querySelectorAll('[data-lang]').forEach(b =>
      b.classList.toggle('is-active', b.dataset.lang === I18n.lang));
  },

  /* Espaço/Enter: o que fazer depende da tela visível. */
  confirm() {
    if (this.el.over.classList.contains('is-open')) { this.hide('over'); Game.start(); }
    else if (this.el.menu.classList.contains('is-open')) this.startFlow();
    else if (Game.state === 'paused') Game.resume();
  },

  startFlow() {
    Sound.unlock();
    const seen = Store.getBool(CONFIG.storageKeys.tutorial, false);
    if (!seen) {
      this._afterHelp = () => Game.start();
      this.show('help');
      return;
    }
    this.hide('menu');
    Game.start();
  },

  show(key) {
    const el = this.el[key];
    if (!el) return;
    el.classList.add('is-open');
    const focusable = el.querySelector('button');
    if (focusable) focusable.focus({ preventScroll: true });
  },

  hide(key) {
    const el = this.el[key];
    if (el) el.classList.remove('is-open');
  },

  countdown(done) {
    this.hide('menu');
    this.hide('over');
    const el = this.el.countdown;
    const txt = this.el.countdownText;
    el.classList.add('is-open');
    let n = 3;
    txt.textContent = n;
    Sound.play('start');
    const iv = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(iv);
        el.classList.remove('is-open');
        done();
        return;
      }
      txt.textContent = n;
      txt.style.animation = 'none';
      void txt.offsetWidth;
      txt.style.animation = 'pop .32s ease-out';
    }, 700);
  },

  gameOver(g) {
    this.el.overScore.textContent = g.score;
    this.el.overBoxes.textContent = g.boxes;
    this.el.overBest.textContent = g.highscore;
    // Recorde de verdade: superar a melhor marca anterior à partida.
    const isRecord = g.score > 0 && g.score > (g._bestAtStart || 0);
    this.el.overRecord.hidden = !isRecord;
    this.show('over');
  },

  syncHud(g) {
    if (this.el.score) this.el.score.textContent = g.score;
    if (this.el.best) this.el.best.textContent = g.highscore;
    const m = g._multiplier ? g._multiplier() : 1;
    if (this.el.combo) {
      this.el.combo.hidden = m <= 1;
      this.el.combo.textContent = 'x' + m;
    }
    if (this.el.shield) this.el.shield.hidden = !(g.shield > 0);
  },

  toast(msg) {
    const t = this.el.toast;
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-open');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => t.classList.remove('is-open'), 1400);
  },

  /* Coleção lateral montada por código: antes eram 10 <img> no HTML com
   * style="filter:... !important", impossível de reverter sem reescrever. */
  buildCollection() {
    const left = document.getElementById('collectLeft');
    const right = document.getElementById('collectRight');
    if (!left || !right) return;
    left.innerHTML = ''; right.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
      const img = document.createElement('img');
      img.className = 'collect-item';
      img.src = './assets/images/power-up-' + i + '.jpg';
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.dataset.index = i;
      (i <= 5 ? left : right).appendChild(img);
    }
  },

  markCollected(index) {
    const el = document.querySelector('.collect-item[data-index="' + index + '"]');
    if (el) el.classList.add('is-collected');
  },

  resetCollection() {
    document.querySelectorAll('.collect-item').forEach(el => {
      el.classList.remove('is-collected', 'is-celebrating');
    });
  },

  celebrateCollection() {
    document.querySelectorAll('.collect-item').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-celebrating'), i * 55);
    });
  },

  setProgress(p) {
    if (this.el.loaderBar) this.el.loaderBar.style.width = Math.round(p * 100) + '%';
  },

  hideLoader() {
    if (this.el.loader) this.el.loader.classList.add('is-gone');
  }
};
