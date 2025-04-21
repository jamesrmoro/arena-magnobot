function tick() {
    if (gameOver) return;

    direction = nextDirection;
    const head = {
        ...snake[0]
    };

    if (direction === "right") head.x++;
    if (direction === "left") head.x--;
    if (direction === "up") head.y--;
    if (direction === "down") head.y++;

    const hitWall = head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
    const hitSelf = snake.some(part => part.x === head.x && part.y === head.y);
    const hitGhost = ghost && head.x === ghost.x && head.y === ghost.y;

    if (hitWall || hitSelf || hitGhost) {
        if (soundOn) sfx.gameover.play();
        const flash = new createjs.Shape();
        flash.graphics.beginFill("white").drawRect(0, 0, canvas.width, canvas.height);
        flash.alpha = 0.5;
        stage.addChild(flash);
        createjs.Tween.get(flash).to({
            alpha: 0
        }, 300).call(() => stage.removeChild(flash));
        endGame();
        return;
    }

    snake.unshift(head);

    if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
        document.querySelectorAll('.power-icon').forEach(icon => {
            if (parseInt(icon.dataset.index) === powerUp.index) {
                icon.classList.add("collected");
                icon.style.filter = "";
                icon.style.opacity = "";
            }
        });

        const allCollected = [...document.querySelectorAll('.power-icon')].every(icon =>
            icon.classList.contains("collected")
        );

        if (allCollected) {
            const leftIcons = document.querySelectorAll('#powerupLeft .power-icon');
            const rightIcons = document.querySelectorAll('#powerupRight .power-icon');

            leftIcons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.style.transition = "transform 0.8s ease, opacity 0.8s ease";
                    icon.style.transform = `translateX(-100px) translateY(${index * 12}px) scale(0.8)`;
                    icon.style.opacity = "0";
                    if (soundOn) new Audio("song-8.mp3").play();
                }, index * 1000);
            });

            rightIcons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.style.transition = "transform 0.8s ease, opacity 0.8s ease";
                    icon.style.transform = `translateX(100px) translateY(${index * 12}px) scale(0.8)`;
                    icon.style.opacity = "0";
                    if (soundOn) new Audio("song-8.mp3").play();
                }, index * 1000);
            });

            allPowerUpsCollected = true;
        }

        score += 3;
        if (soundOn) sfx.power.play();

        for (let i = 0; i < 10; i++) {
            const particle = new createjs.Shape();
            const px = head.x * tileSize + tileSize / 2;
            const py = head.y * tileSize + tileSize / 2;
            particle.graphics.beginFill("#fcd440").drawCircle(0, 0, 3);
            particle.x = px;
            particle.y = py;
            particle.shadow = new createjs.Shadow("#ff0", 0, 0, 10);
            stage.addChild(particle);
            createjs.Tween.get(particle)
                .to({
                    x: px + (Math.random() - 0.5) * 60,
                    y: py + (Math.random() - 0.5) * 60,
                    alpha: 0
                }, 600)
                .call(() => stage.removeChild(particle));
        }

        powerUp = null;
    }

    if (head.x === box.x && head.y === box.y) {
        score++;
        boxesCollected++;
        if (soundOn) sfx.point.play();
        box = generateBox();

        if (score % 3 === 0) {
            ghost = generateGhost(box);
            if (soundOn) {
                sfx.ghost.pause();
                sfx.ghost.currentTime = 0;
                sfx.ghost.play();
            }
        }
    } else {
        snake.pop();
    }

    if (!powerUp && boxesCollected > 0 && boxesCollected % 4 === 0 && powerUpDelayCounter <= 0 && !allPowerUpsCollected) {
        powerUp = generatePowerUp();
        powerUpDelayCounter = 20;
    }

    if (powerUpDelayCounter > 0) powerUpDelayCounter--;

    document.getElementById("score").textContent = score;
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("magnobot_highscore", highscore);
        document.getElementById("highscore").textContent = highscore;
    }

    render();
}

function endGame() {
    gameOver = true;
    createjs.Ticker.removeAllEventListeners();
    clearInterval(robotSequenceInterval);
    clearTimeout(robotSwitchTimeout);
    document.getElementById("gameOverScreen").style.display = "flex";
    if (soundOn) sfx.bg.pause();
}