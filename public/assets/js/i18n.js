const translations = {
    pt: {
        start: "Começar",
        gameOver: "Game Over",
        restart: "Jogar Novamente",
        points: "Pontos",
        highscore: "Recorde",
        instructions: "Deslize entre as linhas: toque em cima ou embaixo",
        instructionsDesktop: "Use as setas do teclado para mover",
        about: "Sobre este game",
        aboutHtml: `<p><strong>Arena Magnobot</strong> é um web game feito especialmente para o <a href="https://dev.to/devteam/join-us-for-the-alibaba-cloud-web-game-challenge-3000-in-prizes-1n5d" target="_blank">Alibaba Cloud Web Game Challenge</a> no site <a href="https://dev.to" target="_blank" rel="nofollow">https://dev.to</a>.</p><p>Arena Magnobot é um jogo retrô onde você controla um robô magnético em uma arena futurista de alta demanda. Sua missão: coletar produtos com precisão e velocidade para abastecer a maior central de entregas da galáxia.</p><p>A cada caixa coletada, o desafio aumenta — exigindo reflexos rápidos e decisões certeiras. Mas fique esperto: alguns produtos estão danificados e podem colocar tudo a perder. Evite itens quebrados ou defeituosos para não comprometer sua missão!</p><p>Busque os bônus especiais como calçados, blusas e acessórios raros para turbinar sua pontuação e conquistar o título de robô mais eficiente do universo!</p><p><strong>Crédito de som:</strong> That Game Arcade Medium — disponível em <a href="https://pixabay.com/music/video-games-that-game-arcade-medium-236110/" target="_blank" rel="nofollow">Pixabay</a></p>`,
        close: "Fechar",
        soundOn: "🔊 Som: ON",
        soundOff: "🔇 Som: OFF",
        install: "Instalar o jogo |",
        tutorialCaption: "Deslize para cima, para baixo ou para os lados para mudar de linha",
        gotIt: "Entendi",
        loadingTutorial: "Carregando...",
        rotateWarning: "Vire seu celular para a vertical para jogar!"
    },
    en: {
        start: "Start",
        gameOver: "Game Over",
        restart: "Play Again",
        points: "Points",
        highscore: "Highscore",
        instructions: "Slide between the rows: tap above or below",
        instructionsDesktop: "Use the arrow keys to move",
        about: "About this game",
        aboutHtml: `<p><strong>Arena Magnobot</strong> is a web game specially created for the <a href="https://dev.to/devteam/join-us-for-the-alibaba-cloud-web-game-challenge-3000-in-prizes-1n5d" target="_blank">Alibaba Cloud Web Game Challenge</a> on the website <a href="https://dev.to" target="_blank" rel="nofollow">https://dev.to</a>.</p><p>Arena Magnobot is a retro-style game where you control a magnetic robot in a high-demand futuristic arena. Your mission: collect products with precision and speed to supply the galaxy’s largest delivery hub.</p><p>Each box collected increases the challenge — demanding quick reflexes and sharp decisions. Watch out: some items are damaged and can ruin everything. Avoid broken or defective items to keep your mission intact!</p><p>Look out for special bonuses like shoes, shirts, and rare accessories to boost your score and earn the title of the most efficient robot in the universe!</p><p><strong>Sound credit:</strong> That Game Arcade Medium — available on <a href="https://pixabay.com/music/video-games-that-game-arcade-medium-236110/" target="_blank" rel="nofollow">Pixabay</a></p>`,
        close: "Close",
        soundOn: "🔊 Sound: ON",
        soundOff: "🔇 Sound: OFF",
        install: "Install the game |",
        tutorialCaption: "Swipe up, down or sideways to change lanes",
        gotIt: "Got it",
        loadingTutorial: "Loading...",
        rotateWarning: "Rotate your device to portrait mode to play!"
    },
    zh: {
        start: "开始",
        gameOver: "游戏结束",
        restart: "再玩一次",
        points: "分数",
        highscore: "最高分",
        instructions: "在轨道间滑动：点击上下区域",
        instructionsDesktop: "使用键盘箭头键移动",
        about: "关于这个游戏",
        aboutHtml: `<p><strong>Arena Magnobot</strong> 是一个专为 <a href="https://dev.to/devteam/join-us-for-the-alibaba-cloud-web-game-challenge-3000-in-prizes-1n5d" target="_blank">Alibaba Cloud Web Game Challenge</a> 开发的网页游戏，发布在 <a href="https://dev.to" target="_blank" rel="nofollow">https://dev.to</a>。</p><p>Arena Magnobot 是一款复古风格的游戏，你将操控一个磁力机器人在一个高强度的未来竞技场中穿梭。你的任务是精准快速地收集物品，为银河中最大的配送中心补充物资。</p><p>每收集一个箱子，难度就会提升 — 需要更快的反应和更准确的判断。但要小心：有些物品是损坏的，会让你功亏一篑。请避开破损或有缺陷的物品，否则任务将失败！</p><p>寻找特殊奖励，如鞋子、上衣和稀有配饰，来提升你的得分，争夺宇宙中最强机器人的称号！</p><p><strong>音效来源：</strong>That Game Arcade Medium — 可在 <a href="https://pixabay.com/music/video-games-that-game-arcade-medium-236110/" target="_blank" rel="nofollow">Pixabay</a> 获取</p>`,
        close: "关闭",
        soundOn: "🔊 声音：开",
        soundOff: "🔇 声音：关",
        install: "安装游戏 |",
        tutorialCaption: "向上、向下或向左右滑动以切换轨道",
        gotIt: "我知道了",
        loadingTutorial: "加载中...",
        rotateWarning: "请将手机竖屏以开始游戏！"
    }
};

let currentLang = "en";
let languageChosen = false;