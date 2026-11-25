/* Arena Magnobot — configuração central
 * Todos os números que afetam o balanceamento ficam aqui. */
'use strict';

const CONFIG = {
  grid: 10,                 // 10x10 (antes 8x8) — mais espaço para manobra
  boardMaxPx: 540,          // teto do tabuleiro, para a arena do fundo aparecer

  // Velocidade: intervalo entre passos, em ms. Diminui conforme a pontuação.
  tick: {
    start: 300,             // começa calmo (antes: 200ms fixo e sem progressão)
    min: 100,               // teto de dificuldade
    stepPerPoint: 3.2       // quanto acelera por ponto
  },

  ghost: {
    firstAt: 4,             // primeira ameaça só depois de 4 caixas
    everyBoxes: 4,          // uma nova a cada N caixas
    max: 7,                 // limite para o tabuleiro não travar
    armingMs: 900           // tempo piscando antes de ficar letal (justiça)
  },

  powerUp: {
    everyBoxes: 3,          // aparece a cada N caixas
    lifeMs: 7000,           // desaparece se não for pego
    points: 3
  },

  shield: {
    everyBoxes: 8,          // escudo magnético ganho a cada N caixas
    max: 1
  },

  combo: {
    windowMs: 2600,         // pegar outra caixa dentro da janela aumenta o combo
    maxMultiplier: 5
  },

  colors: {
    tileA: '#43543d',
    tileB: '#53714c',
    gridLine: 'rgba(0,0,0,0.12)',
    accent: '#fb8c00',
    accentSoft: '#ffae42',
    danger: '#ea3e3e',
    shield: '#4fd3ff'
  },

  storageKeys: {
    highscore: 'magnobot.highscore',
    lang: 'magnobot.lang',
    muted: 'magnobot.muted',
    tutorial: 'magnobot.tutorialSeen',
    games: 'magnobot.gamesPlayed'
  }
};

/* Detecção de capacidade, não de user-agent.
 * O jogo antigo usava /Mobi|Android|iPhone/ no UA: notebooks com tela de
 * toque não recebiam controle por toque e tablets novos ficavam de fora. */
const ENV = {
  hasTouch: (('ontouchstart' in window) || navigator.maxTouchPoints > 0),
  hasPointerFine: window.matchMedia('(pointer: fine)').matches,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};
