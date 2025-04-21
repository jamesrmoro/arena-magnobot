function startCountdown() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("countdown").style.display = "flex";
    let count = 3;
    const text = document.getElementById("countdownText");
    text.textContent = count;
    if (soundOn) {
        sfx.start.play();
        sfx.bg.play();
    }
    const interval = setInterval(() => {
        count--;
        if (count === 0) {
            clearInterval(interval);
            document.getElementById("countdown").style.display = "none";
            if (soundOn) sfx.start.pause();
            initGame();
        } else {
            text.textContent = count;
            text.style.animation = 'none';
            void text.offsetWidth;
            text.style.animation = 'scale 0.3s ease-in-out';
        }
    }, 800);
}

function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    startCountdown();
}

function initGame() {
    boxesCollected = 0;
    powerUpDelayCounter = 0;
    direction = "right";
    nextDirection = "right";
    snake = [{
        x: 2,
        y: 4
    }];
    box = generateBox();
    powerUp = null;
    ghost = null;
    score = 0;
    gameOver = false;
    robotActive = false;
    robotState = "normal";
    clearInterval(robotSequenceInterval);
    clearTimeout(robotSwitchTimeout);

    robotSequenceInterval = setInterval(() => {
        let blinkCount = 0;
        robotState = "active1";
        if (soundOn) {
            sfx.activate.pause();
            sfx.activate.currentTime = 0;
            sfx.activate.play();
        }
        const blink = setInterval(() => {
            robotState = robotState === "active1" ? "active2" : "active1";
            render();
            blinkCount++;
            if (blinkCount >= 4) {
                clearInterval(blink);
                robotState = "normal";
                render();
            }
        }, 500);
    }, 8000);

    allPowerUpsCollected = false;

    document.querySelectorAll('.power-icon').forEach(icon => {
        icon.classList.remove("collected");
        icon.style.transition = "none";
        icon.style.transform = "none";
        icon.style.opacity = "0.4";
        icon.style.filter = "grayscale(100%)";
    });

    document.getElementById("score").textContent = score;
    highscore = localStorage.getItem("magnobot_highscore") || 0;
    document.getElementById("highscore").textContent = highscore;

    shufflePowerUps();
    createjs.Ticker.framerate = 5;
    createjs.Ticker.removeAllEventListeners();
    createjs.Ticker.addEventListener("tick", tick);
}