document.getElementById("instructions").textContent = isMobile ?
    translations.pt.instructions :
    translations.pt.instructionsDesktop;

document.querySelectorAll('.power-icon').forEach(icon => {
    icon.style.width = tileSize + 'px';
    icon.style.height = tileSize + 'px';
});

preloadImages(() => {
    document.getElementById("startScreen").style.display = "flex";
    highscore = localStorage.getItem("magnobot_highscore") || 0;
    document.getElementById("highscore").textContent = highscore;
});

function checkOrientation() {
    const warning = document.getElementById("rotateWarning");
    if (!warning) return;

    const isLandscape = window.innerWidth > window.innerHeight;
    warning.style.display = (isMobile && isLandscape) ? "flex" : "none";
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
document.addEventListener("DOMContentLoaded", checkOrientation);