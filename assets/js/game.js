/* Núcleo do jogo: máquina de estados + laço de tempo fixo.
 *
 * Mudanças estruturais em relação à versão anterior:
 *  - createjs.Ticker.framerate = 5 era fixo: o jogo nunca ficava mais difícil,
 *    apesar de a descrição prometer progressão. Agora o intervalo do passo
 *    diminui conforme a pontuação, com piso definido em CONFIG.
 *  - geradores de caixa/fantasma/power-up podiam cair na mesma célula uns dos
 *    outros: um power-up sobre um fantasma era impossível de pegar e uma caixa
 *    sobre o power-up contava duas coisas de uma vez. Agora há um conjunto
 *    único de células ocupadas, e o sorteio é feito sobre as células livres —
 *    o que também elimina o `do...while` que podia girar para sempre com o
 *    tabuleiro cheio.
 *  - os fantasmas nasciam letais, do nada, às vezes à frente do robô em
 *    movimento: morte impossível de evitar. Agora nascem "armando", piscando
 *    e inofensivos por CONFIG.ghost.armingMs.
 *  - a animação de "robô ativado" rodava a cada 8 s, tocava som e chamava
 *    render() fora do laço, sem efeito nenhum no jogo. Virou o escudo
 *    magnético, que absorve uma batida.
 *  - o jogo continuava rodando com a aba em segundo plano e o jogador voltava
 *    morto. Agora pausa sozinho ao perder o foco. */
'use strict';

const Game = {
  state: 'menu',          // menu | countdown | playing | paused | over
  body: [],
  prevBody: [],
  direction: 'right',
  box: null,
  ghosts: [],
  powerUp: null,
  score: 0,
  boxes: 0,
  highscore: 0,
  shield: 0,
  combo: 0,
  comboUntil: 0,
  collected: new Set(),
  powerBag: [],
  _acc: 0,
  _last: 0,
  _tickMs: CONFIG.tick.start,
  _raf: null,
  _deathAt: 0,

  /* ---------- ciclo de vida ---------- */
  init() {
    this.highscore = Store.getNumber(CONFIG.storageKeys.highscore, 0);
    Input.onPause = () => this.togglePause();
    Input.onConfirm = () => UI.confirm();
    Input.onTap = (cx, cy) => this._tapTurn(cx, cy);

    // Pausa automática quando a aba/janela sai de foco.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') this.pause();
    });
    window.addEventListener('blur', () => {
      if (this.state === 'playing') this.pause();
    });

    this._loop = this._loop.bind(this);
    this._raf = requestAnimationFrame(this._loop);
  },

  reset() {
    const mid = Math.floor(CONFIG.grid / 2);
    // Começa colado na parede esquerda: o jogador ganha a largura inteira do
    // tabuleiro para reagir antes da primeira parede.
    this.body = [{ x: 0, y: mid }];
    this.prevBody = [{ x: -1, y: mid }];
    this._bestAtStart = this.highscore;
    this.direction = 'right';
    this.score = 0;
    this.boxes = 0;
    this.shield = 0;
    this.combo = 0;
    this.comboUntil = 0;
    this.ghosts = [];
    this.powerUp = null;
    this.collected.clear();
    this.powerBag = [];
    this._tickMs = CONFIG.tick.start;
    this._acc = 0;
    Input.reset('right');
    this.box = this._spawn();
    UI.resetCollection();
    UI.syncHud(this);
  },

  start() {
    this.reset();
    this.state = 'countdown';
    UI.countdown(() => {
      this.state = 'playing';
      this._last = performance.now();
      Sound.startMusic();
    });
  },

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    Sound.stopMusic();
    UI.show('pause');
  },

  resume() {
    if (this.state !== 'paused') return;
    UI.hide('pause');
    this.state = 'playing';
    this._last = performance.now();
    this._acc = 0;
    Sound.startMusic();
  },

  togglePause() {
    if (this.state === 'playing') this.pause();
    else if (this.state === 'paused') this.resume();
  },

  /* ---------- utilidades de tabuleiro ---------- */
  _occupied() {
    const set = new Set();
    for (const p of this.body) set.add(p.x + ',' + p.y);
    for (const g of this.ghosts) set.add(g.x + ',' + g.y);
    if (this.box) set.add(this.box.x + ',' + this.box.y);
    if (this.powerUp) set.add(this.powerUp.x + ',' + this.powerUp.y);
    return set;
  },

  /* Sorteia entre as células livres, com margem de segurança: nada nasce
   * imediatamente à frente do robô, onde não daria tempo de reagir. */
  _spawn(avoidAhead = true) {
    const taken = this._occupied();
    const head = this.body[0];
    const ahead = [];
    if (avoidAhead && head) {
      const d = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }[this.direction] || [1, 0];
      for (let k = 1; k <= 2; k++) ahead.push((head.x + d[0] * k) + ',' + (head.y + d[1] * k));
    }
    const free = [];
    for (let x = 0; x < CONFIG.grid; x++) {
      for (let y = 0; y < CONFIG.grid; y++) {
        const key = x + ',' + y;
        if (!taken.has(key) && !ahead.includes(key)) free.push({ x, y });
      }
    }
    if (!free.length) return null;
    return free[(Math.random() * free.length) | 0];
  },

  _nextPower() {
    // Saco embaralhado: garante que os 10 produtos apareçam antes de repetir.
    if (!this.powerBag.length) {
      this.powerBag = Assets.powerUps.filter(p => !this.collected.has(p.index));
      if (!this.powerBag.length) this.powerBag = Assets.powerUps.slice();
      for (let i = this.powerBag.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [this.powerBag[i], this.powerBag[j]] = [this.powerBag[j], this.powerBag[i]];
      }
    }
    const cell = this._spawn();
    if (!cell) return null;
    const pick = this.powerBag.pop();
    return { x: cell.x, y: cell.y, img: pick.img, index: pick.index, expiresAt: performance.now() + CONFIG.powerUp.lifeMs };
  },

  _tapTurn(clientX, clientY) {
    const r = Renderer.canvas.getBoundingClientRect();
    const head = this.body[0];
    if (!head) return;
    const hx = r.left + (head.x + 0.5) * Renderer.tile;
    const hy = r.top + (head.y + 0.5) * Renderer.tile;
    const dx = clientX - hx, dy = clientY - hy;
    Input.push(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  },

  /* ---------- um passo da simulação ---------- */
  step() {
    this.direction = Input.take(this.direction);
    const head = { ...this.body[0] };
    if (this.direction === 'right') head.x++;
    else if (this.direction === 'left') head.x--;
    else if (this.direction === 'up') head.y--;
    else head.y++;

    const now = performance.now();
    const hitWall = head.x < 0 || head.x >= CONFIG.grid || head.y < 0 || head.y >= CONFIG.grid;
    // A última peça sai da célula neste mesmo passo, então não é colisão.
    const tail = this.body[this.body.length - 1];
    const willGrow = this.box && head.x === this.box.x && head.y === this.box.y;
    const hitSelf = this.body.some((p, i) =>
      p.x === head.x && p.y === head.y && !(!willGrow && i === this.body.length - 1 && tail)
    );
    const ghostHit = this.ghosts.find(g => g.x === head.x && g.y === head.y && now >= g.armedAt);

    if (hitWall || hitSelf) {
      // Parede e corpo são erro de pilotagem: o escudo não cobre.
      return this._die();
    }

    if (ghostHit) {
      if (this.shield > 0) {
        this.shield--;
        this.ghosts = this.ghosts.filter(g => g !== ghostHit);
        Sound.play('activate');
        Renderer.burst((head.x + 0.5) * Renderer.tile, (head.y + 0.5) * Renderer.tile, CONFIG.colors.shield, 22);
        Renderer.kick(10);
        UI.toast(I18n.t('shieldUsed'));
      } else {
        return this._die();
      }
    }

    this.prevBody = this.body.map(p => ({ ...p }));
    this.body.unshift(head);

    const cx = (head.x + 0.5) * Renderer.tile;
    const cy = (head.y + 0.5) * Renderer.tile;

    // Power-up
    if (this.powerUp && head.x === this.powerUp.x && head.y === this.powerUp.y) {
      const gain = CONFIG.powerUp.points * this._multiplier();
      this.score += gain;
      this.collected.add(this.powerUp.index);
      UI.markCollected(this.powerUp.index);
      Sound.play('power');
      Renderer.burst(cx, cy, CONFIG.colors.accentSoft, 20);
      Renderer.floatText(cx, cy, '+' + gain, CONFIG.colors.accentSoft);
      if (this.collected.size === 10) {
        Sound.play('final');
        UI.celebrateCollection();
        this.collected.clear();
        UI.resetCollection();
        this.score += 10;
        Renderer.floatText(cx, cy - Renderer.tile, '+10', '#fff');
      }
      this.powerUp = null;
    } else if (this.powerUp && performance.now() > this.powerUp.expiresAt) {
      this.powerUp = null;      // expirou: o antigo ficava eternamente na tela
    }

    // Caixa
    if (willGrow) {
      this.boxes++;
      const mult = this._multiplier();
      const gain = 1 * mult;
      this.score += gain;
      this.combo = Math.min(this.combo + 1, 99);
      this.comboUntil = now + CONFIG.combo.windowMs;
      Sound.play('point');
      Renderer.burst(cx, cy, '#f0c070', 10);
      Renderer.floatText(cx, cy, '+' + gain + (mult > 1 ? ' x' + mult : ''), mult > 1 ? CONFIG.colors.accentSoft : '#ffffff');

      this.box = this._spawn();

      // Fantasmas
      if (this.boxes >= CONFIG.ghost.firstAt &&
          this.boxes % CONFIG.ghost.everyBoxes === 0 &&
          this.ghosts.length < CONFIG.ghost.max) {
        const cell = this._spawn();
        if (cell) {
          this.ghosts.push({ x: cell.x, y: cell.y, armedAt: now + CONFIG.ghost.armingMs });
          Sound.play('ghost');
        }
      }

      // Power-up
      if (!this.powerUp && this.boxes % CONFIG.powerUp.everyBoxes === 0) {
        this.powerUp = this._nextPower();
      }

      // Escudo
      if (this.boxes % CONFIG.shield.everyBoxes === 0 && this.shield < CONFIG.shield.max) {
        this.shield = CONFIG.shield.max;
        Sound.play('activate');
        UI.toast(I18n.t('shieldReady'));
      }

      // Velocidade acompanha a pontuação
      this._tickMs = Math.max(CONFIG.tick.min, CONFIG.tick.start - this.score * CONFIG.tick.stepPerPoint);
    } else {
      this.body.pop();
    }

    if (now > this.comboUntil) this.combo = 0;

    if (this.score > this.highscore) {
      this.highscore = this.score;
      Store.set(CONFIG.storageKeys.highscore, this.highscore);
    }
    UI.syncHud(this);
  },

  _multiplier() {
    return Math.min(CONFIG.combo.maxMultiplier, 1 + Math.floor(this.combo / 3));
  },

  _die() {
    this.state = 'over';
    this._deathAt = performance.now();
    Sound.stopMusic();
    Sound.play('gameover');
    Renderer.kick(18);
    const head = this.body[0];
    if (head) Renderer.burst((head.x + 0.5) * Renderer.tile, (head.y + 0.5) * Renderer.tile, CONFIG.colors.danger, 26);
    Store.set(CONFIG.storageKeys.games, Store.getNumber(CONFIG.storageKeys.games, 0) + 1);
    setTimeout(() => UI.gameOver(this), 450);   // deixa o efeito aparecer
  },

  /* ---------- laço ---------- */
  _loop(ts) {
    const dt = Math.min(0.05, (ts - (this._last || ts)) / 1000);
    this._last = ts;

    if (this.state === 'playing') {
      this._acc += dt * 1000;
      let guard = 0;
      while (this._acc >= this._tickMs && this.state === 'playing' && guard++ < 4) {
        this._acc -= this._tickMs;
        this.step();
      }
    }

    const alpha = this.state === 'playing' ? Math.min(1, this._acc / this._tickMs) : 1;
    if (this.state !== 'menu' || this._everStarted) {
      Renderer.draw(this, alpha, dt);
    } else {
      Renderer.draw(this, 1, dt);
    }
    this._raf = requestAnimationFrame(this._loop);
  }
};
