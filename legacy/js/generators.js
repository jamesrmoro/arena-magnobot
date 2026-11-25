function generateBox() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while (
        snake.some(part => part.x === x && part.y === y) ||
        (ghost && ghost.x === x && ghost.y === y) ||
        (powerUp && powerUp.x === x && powerUp.y === y)
    );
    return {
        x,
        y
    };
}

function generateGhost(currentBox) {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while (
        snake.some(part => part.x === x && part.y === y) ||
        (currentBox && currentBox.x === x && currentBox.y === y) ||
        (powerUp && powerUp.x === x && powerUp.y === y)
    );
    return {
        x,
        y
    };
}

function generatePowerUp() {
    if (powerUpQueue.length === 0) shufflePowerUps();

    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while (snake.some(part => part.x === x && part.y === y));

    const img = powerUpQueue.pop();
    const index = powerUpImages.findIndex(i => i.src === img.src) + 1;

    return {
        x,
        y,
        img,
        index
    };
}