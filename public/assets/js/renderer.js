/* Renderizador em Canvas 2D puro.
 * O jogo usava CreateJS (242 KB) e recriava todos os objetos do palco a cada
 * quadro, chamando stage.removeAllChildren(): isso apagava as partículas e as
 * animações de tween logo depois de criá-las — o efeito nunca aparecia.
 * Aqui o desenho é imediato, as partículas têm vida própria em dt e o canvas
 * acompanha o devicePixelRatio (nítido em telas retina) e o redimensionamento
 * da janela, que antes era calculado uma única vez no carregamento. */
'use strict';

const Renderer = {
  canvas: null,
  ctx: null,
  size: 0,        // lado do tabuleiro em px CSS
  tile: 0,
  dpr: 1,
  particles: [],
  shake: 0,
  floaters: [],

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.resize();
    let raf = null;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => this.resize());
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', onResize);
  },

  /* Tabuleiro quadrado que cabe em qualquer tela, retrato ou paisagem. */
  resize() {
    const wrap = document.getElementById('boardWrap');
    if (!wrap) return;
    const avail = wrap.getBoundingClientRect();
    /* Teto de tamanho: sem ele, numa tela larga o tabuleiro ocupava a altura
     * inteira e a arena do fundo — refletores e tudo — sumia atrás dele.
     * No celular a largura já é menor que o teto, então nada muda lá. */
    const side = Math.max(160, Math.min(CONFIG.boardMaxPx,
                          Math.floor(Math.min(avail.width, avail.height))));
    this.size = side;
    this.tile = side / CONFIG.grid;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.canvas.style.width = side + 'px';
    this.canvas.style.height = side + 'px';
    this.canvas.width = Math.round(side * this.dpr);
    this.canvas.height = Math.round(side * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    document.documentElement.style.setProperty('--tile', this.tile.toFixed(2) + 'px');
    document.dispatchEvent(new CustomEvent('board:resized'));
  },

  /* ---------- efeitos ---------- */
  burst(cx, cy, color, count = 14) {
    if (ENV.reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 150;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, r: 2 + Math.random() * 3, color
      });
    }
  },

  floatText(cx, cy, text, color) {
    this.floaters.push({ x: cx, y: cy, text, color, life: 1 });
  },

  kick(amount = 8) {
    if (!ENV.reducedMotion) this.shake = Math.max(this.shake, amount);
  },

  _stepEffects(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vy += 180 * dt;
      p.life -= dt * 1.6;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i];
      f.y -= 42 * dt;
      f.life -= dt * 1.1;
      if (f.life <= 0) this.floaters.splice(i, 1);
    }
    this.shake *= Math.pow(0.0015, dt);
    if (this.shake < 0.3) this.shake = 0;
  },

  /* ---------- desenho ---------- */
  _sprite(img, cx, cy, scale, rotation) {
    const ctx = this.ctx;
    const s = this.tile * scale;
    ctx.save();
    ctx.translate(cx, cy);
    if (rotation) ctx.rotate(rotation);
    ctx.drawImage(img, -s / 2, -s / 2, s, s);
    ctx.restore();
  },

  /* O sprite do fantasma é uma caixa quebrada na mesma paleta laranja da
   * caixa boa: no tamanho de um tile de celular os dois ficam quase iguais e
   * o jogador morre sem entender por quê. Aqui ele é recolorido em vermelho
   * uma única vez e guardado em cache. */
  _tinted(img, color) {
    if (!img) return null;
    this._tintCache = this._tintCache || new Map();
    const key = img.src + '|' + color;
    if (this._tintCache.has(key)) return this._tintCache.get(key);
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    x.globalCompositeOperation = 'source-atop';
    x.fillStyle = color;
    x.globalAlpha = 0.62;
    x.fillRect(0, 0, c.width, c.height);
    this._tintCache.set(key, c);
    return c;
  },

  _fallback(cx, cy, color, scale = 0.8) {
    const ctx = this.ctx;
    const s = this.tile * scale;
    ctx.fillStyle = color;
    ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
  },

  draw(g, alpha, dt) {
    const ctx = this.ctx;
    const T = this.tile;
    this._stepEffects(dt);

    ctx.save();
    if (this.shake > 0) {
      ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    }

    // Tabuleiro
    for (let x = 0; x < CONFIG.grid; x++) {
      for (let y = 0; y < CONFIG.grid; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? CONFIG.colors.tileA : CONFIG.colors.tileB;
        ctx.fillRect(x * T, y * T, T + 1, T + 1);
      }
    }

    const center = c => (c + 0.5) * T;

    // Caixa, com leve pulsação para chamar atenção
    if (g.box) {
      const pulse = 0.78 + Math.sin(performance.now() / 260) * 0.05;
      const cx = center(g.box.x), cy = center(g.box.y);
      if (Assets.img.box) this._sprite(Assets.img.box, cx, cy, pulse, 0);
      else this._fallback(cx, cy, '#c79a5b', pulse);
    }

    // Power-up: anel de tempo restante, para o jogador saber que vai expirar
    if (g.powerUp) {
      const cx = center(g.powerUp.x), cy = center(g.powerUp.y);
      const left = Math.max(0, g.powerUp.expiresAt - performance.now()) / CONFIG.powerUp.lifeMs;
      ctx.save();
      ctx.strokeStyle = CONFIG.colors.accentSoft;
      ctx.lineWidth = Math.max(2, T * 0.07);
      ctx.beginPath();
      ctx.arc(cx, cy, T * 0.46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left);
      ctx.stroke();
      ctx.restore();
      const im = g.powerUp.img;
      if (im) this._sprite(im, cx, cy, 0.72, 0);
      else this._fallback(cx, cy, CONFIG.colors.accent, 0.72);
    }

    // Fantasmas: enquanto "armando" ficam translúcidos e piscando (não matam)
    const now = performance.now();
    for (const gh of g.ghosts) {
      const cx = center(gh.x), cy = center(gh.y);
      const arming = now < gh.armedAt;
      ctx.save();
      if (arming) {
        ctx.globalAlpha = 0.35 + Math.abs(Math.sin(now / 90)) * 0.45;
        ctx.strokeStyle = CONFIG.colors.danger;
        ctx.lineWidth = 2;
        ctx.strokeRect(gh.x * T + 2, gh.y * T + 2, T - 4, T - 4);
      }
      // Aura vermelha pulsante + sprite recolorido: perigo legível de relance.
      if (!arming) {
        const pulse = 0.5 + Math.sin(now / 220) * 0.18;
        const grd = ctx.createRadialGradient(cx, cy, T * 0.12, cx, cy, T * 0.56);
        grd.addColorStop(0, 'rgba(234,62,62,' + (0.45 * pulse + 0.2).toFixed(3) + ')');
        grd.addColorStop(1, 'rgba(234,62,62,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(cx - T * 0.6, cy - T * 0.6, T * 1.2, T * 1.2);
      }
      const ghostSprite = this._tinted(Assets.img.ghost, '#e01d1d');
      if (ghostSprite) this._sprite(ghostSprite, cx, cy, 0.82, 0);
      else this._fallback(cx, cy, CONFIG.colors.danger, 0.8);
      ctx.restore();
    }

    // Robô e vagões — posição interpolada entre as células (movimento suave)
    const body = g.body, prev = g.prevBody;
    for (let i = body.length - 1; i >= 0; i--) {
      const cur = body[i];
      const old = prev[i] || cur;
      const x = center(old.x + (cur.x - old.x) * alpha);
      const y = center(old.y + (cur.y - old.y) * alpha);

      if (i === 0) {
        let img = Assets.img.robot;
        if (g.shield > 0) {
          img = (Math.floor(now / 160) % 2 === 0 ? Assets.img.robotActive1 : Assets.img.robotActive2) || img;
          ctx.save();
          ctx.strokeStyle = CONFIG.colors.shield;
          ctx.lineWidth = Math.max(2, T * 0.08);
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.arc(x, y, T * 0.52, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        const rot = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[g.direction] || 0;
        if (img) this._sprite(img, x, y, 0.92, rot);
        else this._fallback(x, y, CONFIG.colors.accent, 0.92);
      } else {
        if (Assets.img.box) this._sprite(Assets.img.box, x, y, 0.74, 0);
        else this._fallback(x, y, '#9d7b48', 0.74);
      }
    }

    // Partículas
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Textos flutuantes (+1, +3, combo)
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.max(12, T * 0.42)}px system-ui, sans-serif`;
    for (const f of this.floaters) {
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
};
