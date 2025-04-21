document.addEventListener("keydown", (e) => {
    if (!languageChosen) return;

    if (e.key === "ArrowUp" && direction !== "down") nextDirection = "up";
    if (e.key === "ArrowDown" && direction !== "up") nextDirection = "down";
    if (e.key === "ArrowLeft" && direction !== "right") nextDirection = "left";
    if (e.key === "ArrowRight" && direction !== "left") nextDirection = "right";

    if (gameOver && (e.key === "Enter" || e.key === "Return")) {
        restartGame();
    }
});

if (isMobile) {
    let touchStartX = 0,
        touchStartY = 0;

    document.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    });

    document.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 20 && direction !== "left") nextDirection = "right";
            else if (dx < -20 && direction !== "right") nextDirection = "left";
        } else {
            if (dy > 20 && direction !== "up") nextDirection = "down";
            else if (dy < -20 && direction !== "down") nextDirection = "up";
        }
    });
}

document.getElementById("soundToggle").onclick = () => {
    soundOn = !soundOn;
    const text = soundOn ? translations[currentLang].soundOn : translations[currentLang].soundOff;
    document.getElementById("soundToggle").textContent = text;

    if (soundOn) {
        sfx.bg.play();
    } else {
        sfx.bg.pause();
        Object.values(sfx).forEach(audio => {
            if (!audio.loop) audio.pause();
        });
    }
};