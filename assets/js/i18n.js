/* Textos. Idioma detectado do navegador e guardado entre sessões:
 * antes era obrigatório escolher a bandeira a cada partida. */
'use strict';

const TRANSLATIONS = {
  pt: {
    tagline: 'Colete, desvie, sobreviva.',
    play: 'Jogar',
    howTo: 'Como jogar',
    points: 'Pontos',
    best: 'Recorde',
    gameOver: 'Fim de jogo',
    newRecord: 'Novo recorde!',
    yourScore: 'Sua pontuação',
    boxes: 'Caixas',
    playAgain: 'Jogar de novo',
    home: 'Início',
    paused: 'Pausado',
    resume: 'Continuar',
    quit: 'Sair',
    sound: 'Som',
    on: 'ligado',
    off: 'desligado',
    install: 'Instalar',
    about: 'Sobre',
    close: 'Fechar',
    gotIt: 'Entendi',
    loading: 'Carregando',
    tapToStart: 'Toque para começar',
    pressToStart: 'Pressione Espaço para começar',
    helpMoveTouch: 'Arraste o dedo na direção que quiser ir, ou use o direcional na tela.',
    helpMoveKeys: 'Use as setas ou W A S D para virar. P pausa.',
    helpGoal: 'Pegue as caixas para pontuar. Cada caixa acelera o robô.',
    helpGhost: 'Fantasmas são fatais. Eles piscam antes de ativar — use esse tempo.',
    helpPower: 'Produtos raros valem 3 pontos e enchem a coleção nas laterais.',
    helpShield: 'A cada 8 caixas você ganha um escudo magnético: ele absorve uma batida.',
    helpCombo: 'Caixas em sequência rápida multiplicam os pontos.',
    shieldReady: 'Escudo pronto',
    shieldUsed: 'Escudo consumido',
    combo: 'Combo',
    aboutHtml: `<p><strong>Arena Magnobot</strong> é um arcade retrô: você comanda um robô magnético na maior central de entregas da galáxia.</p>
      <p>Colete caixas para pontuar — cada uma deixa o robô mais rápido. Produtos raros valem o triplo e preenchem sua coleção. Fantasmas de carga avariada são fatais, mas piscam antes de ativar.</p>
      <p>A cada oito caixas você ganha um escudo magnético que absorve uma batida. Sequências rápidas multiplicam a pontuação.</p>
      <p><strong>Crédito de som:</strong> That Game Arcade Medium — <a href="https://pixabay.com/music/video-games-that-game-arcade-medium-236110/" target="_blank" rel="noopener nofollow">Pixabay</a>.</p>
      <p><a href="./privacy?lang=pt" target="_blank" rel="noopener">Política de Privacidade</a></p>`
  },
  en: {
    tagline: 'Collect, dodge, survive.',
    play: 'Play',
    howTo: 'How to play',
    points: 'Score',
    best: 'Best',
    gameOver: 'Game over',
    newRecord: 'New record!',
    yourScore: 'Your score',
    boxes: 'Boxes',
    playAgain: 'Play again',
    home: 'Home',
    paused: 'Paused',
    resume: 'Resume',
    quit: 'Quit',
    sound: 'Sound',
    on: 'on',
    off: 'off',
    install: 'Install',
    about: 'About',
    close: 'Close',
    gotIt: 'Got it',
    loading: 'Loading',
    tapToStart: 'Tap to start',
    pressToStart: 'Press Space to start',
    helpMoveTouch: 'Swipe in the direction you want to go, or use the on-screen pad.',
    helpMoveKeys: 'Arrow keys or W A S D to turn. P pauses.',
    helpGoal: 'Grab boxes to score. Every box speeds the robot up.',
    helpGhost: 'Ghosts are fatal. They blink before arming — use that window.',
    helpPower: 'Rare products are worth 3 points and fill the side collection.',
    helpShield: 'Every 8 boxes you earn a magnetic shield: it absorbs one hit.',
    helpCombo: 'Boxes picked up in quick succession multiply your points.',
    shieldReady: 'Shield ready',
    shieldUsed: 'Shield spent',
    combo: 'Combo',
    aboutHtml: `<p><strong>Arena Magnobot</strong> is a retro arcade game: you command a magnetic robot inside the galaxy's busiest delivery hub.</p>
      <p>Collect boxes to score — each one makes the robot faster. Rare products are worth triple and fill your collection. Damaged-cargo ghosts are fatal, but they blink before arming.</p>
      <p>Every eight boxes you earn a magnetic shield that absorbs one hit. Fast streaks multiply your score.</p>
      <p><strong>Sound credit:</strong> That Game Arcade Medium — <a href="https://pixabay.com/music/video-games-that-game-arcade-medium-236110/" target="_blank" rel="noopener nofollow">Pixabay</a>.</p>
      <p><a href="./privacy?lang=en" target="_blank" rel="noopener">Privacy Policy</a></p>`
  },
  es: {
    tagline: 'Recoge, esquiva, sobrevive.',
    play: 'Jugar',
    howTo: 'Cómo jugar',
    points: 'Puntos',
    best: 'Récord',
    gameOver: 'Fin del juego',
    newRecord: '¡Nuevo récord!',
    yourScore: 'Tu puntuación',
    boxes: 'Cajas',
    playAgain: 'Jugar otra vez',
    home: 'Inicio',
    paused: 'En pausa',
    resume: 'Continuar',
    quit: 'Salir',
    sound: 'Sonido',
    on: 'activado',
    off: 'desactivado',
    install: 'Instalar',
    about: 'Acerca de',
    close: 'Cerrar',
    gotIt: 'Entendido',
    loading: 'Cargando',
    tapToStart: 'Toca para empezar',
    pressToStart: 'Pulsa Espacio para empezar',
    helpMoveTouch: 'Desliza el dedo hacia donde quieras ir, o usa el mando en pantalla.',
    helpMoveKeys: 'Flechas o W A S D para girar. P pausa.',
    helpGoal: 'Recoge cajas para puntuar. Cada caja acelera al robot.',
    helpGhost: 'Los fantasmas son mortales. Parpadean antes de activarse.',
    helpPower: 'Los productos raros valen 3 puntos y llenan la colección lateral.',
    helpShield: 'Cada 8 cajas ganas un escudo magnético: absorbe un golpe.',
    helpCombo: 'Las cajas seguidas multiplican tus puntos.',
    shieldReady: 'Escudo listo',
    shieldUsed: 'Escudo gastado',
    combo: 'Combo',
    aboutHtml: `<p><strong>Arena Magnobot</strong> es un arcade retro: controlas un robot magnético en el mayor centro de entregas de la galaxia.</p>
      <p>Recoge cajas para puntuar — cada una acelera al robot. Los productos raros valen el triple. Los fantasmas de carga dañada son mortales, pero parpadean antes de activarse.</p>
      <p>Cada ocho cajas ganas un escudo magnético que absorbe un golpe. Las rachas rápidas multiplican la puntuación.</p>
      <p><strong>Crédito de sonido:</strong> That Game Arcade Medium — <a href="https://pixabay.com/music/video-games-that-game-arcade-medium-236110/" target="_blank" rel="noopener nofollow">Pixabay</a>.</p>
      <p><a href="./privacy?lang=es" target="_blank" rel="noopener">Política de Privacidad</a></p>`
  },
  zh: {
    tagline: '收集、躲避、生存。',
    play: '开始游戏',
    howTo: '玩法说明',
    points: '分数',
    best: '最高分',
    gameOver: '游戏结束',
    newRecord: '新纪录！',
    yourScore: '你的分数',
    boxes: '箱子',
    playAgain: '再玩一次',
    home: '主页',
    paused: '已暂停',
    resume: '继续',
    quit: '退出',
    sound: '声音',
    on: '开',
    off: '关',
    install: '安装',
    about: '关于',
    close: '关闭',
    gotIt: '我知道了',
    loading: '加载中',
    tapToStart: '点击开始',
    pressToStart: '按空格键开始',
    helpMoveTouch: '朝想去的方向滑动，或使用屏幕方向键。',
    helpMoveKeys: '方向键或 W A S D 转向，P 暂停。',
    helpGoal: '收集箱子得分，每个箱子都会让机器人更快。',
    helpGhost: '幽灵是致命的。它们激活前会闪烁。',
    helpPower: '稀有物品值 3 分，并填满两侧的收藏。',
    helpShield: '每 8 个箱子可获得磁力护盾，能抵挡一次撞击。',
    helpCombo: '连续快速收集箱子可获得分数倍率。',
    shieldReady: '护盾就绪',
    shieldUsed: '护盾已用',
    combo: '连击',
    aboutHtml: `<p><strong>Arena Magnobot</strong> 是一款复古街机游戏：你操控一个磁力机器人，在银河系最繁忙的配送中心中穿梭。</p>
      <p>收集箱子得分，每个箱子都会加快机器人的速度。稀有物品价值三倍。受损货物幽灵是致命的，但它们在激活前会闪烁。</p>
      <p>每八个箱子可获得一次磁力护盾，能抵挡一次撞击。快速连击可提升分数倍率。</p>
      <p><strong>音效来源：</strong>That Game Arcade Medium — <a href="https://pixabay.com/music/video-games-that-game-arcade-medium-236110/" target="_blank" rel="noopener nofollow">Pixabay</a>。</p>
      <p><a href="./privacy?lang=zh" target="_blank" rel="noopener">隐私政策</a></p>`
  }
};

const I18n = {
  lang: 'en',
  supported: ['pt', 'en', 'es', 'zh'],

  detect() {
    const saved = Store.get(CONFIG.storageKeys.lang);
    if (saved && TRANSLATIONS[saved]) return saved;
    const nav = (navigator.languages || [navigator.language || 'en']);
    for (const raw of nav) {
      const code = String(raw).toLowerCase().split('-')[0];
      if (TRANSLATIONS[code]) return code;
    }
    return 'en';
  },

  set(lang) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    this.lang = lang;
    Store.set(CONFIG.storageKeys.lang, lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
    this.apply();
  },

  t(key) {
    return (TRANSLATIONS[this.lang] && TRANSLATIONS[this.lang][key]) || TRANSLATIONS.en[key] || key;
  },

  /* Qualquer elemento com data-i18n recebe o texto; data-i18n-html recebe HTML.
   * Evita a lista manual de IDs do código anterior, que esquecia elementos. */
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', this.t(el.dataset.i18nAria));
    });
    document.dispatchEvent(new CustomEvent('i18n:changed'));
  }
};
