let robotImg, boxImg, ghostImg;
let robotActive1Img, robotActive2Img;
let powerUpImages = [];

function preloadImages(callback) {
    let loaded = 0;
    const total = 5 + 10; // 5 imagens fixas + 10 power-ups

    const check = () => {
        loaded++;
        if (loaded === total) callback();
    };

    robotImg = new Image();
    robotImg.src = "./assets/images/robot.png";
    robotImg.onload = check;

    robotActive1Img = new Image();
    robotActive1Img.src = "./assets/images/robot-actived-1.png";
    robotActive1Img.onload = check;

    robotActive2Img = new Image();
    robotActive2Img.src = "./assets/images/robot-actived-2.png";
    robotActive2Img.onload = check;

    boxImg = new Image();
    boxImg.src = "./assets/images/box.png";
    boxImg.onload = check;

    ghostImg = new Image();
    ghostImg.src = "./assets/images/ghost.png";
    ghostImg.onload = check;

    for (let i = 1; i <= 10; i++) {
        const img = new Image();
        img.src = `./assets/images/power-up-${i}.jpg`;
        img.onload = check;
        powerUpImages.push(img);
    }
}

function shufflePowerUps() {
    powerUpQueue = [...powerUpImages];
    for (let i = powerUpQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [powerUpQueue[i], powerUpQueue[j]] = [powerUpQueue[j], powerUpQueue[i]];
    }
}