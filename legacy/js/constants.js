const gridSize = 8;
let tileSize = 60;

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const canvas = document.getElementById("gameCanvas");

if (isMobile) {
    const horizontalMargin = 40;
    const availableWidth = window.innerWidth - horizontalMargin;
    tileSize = Math.floor(availableWidth / gridSize);
}

canvas.width = tileSize * gridSize;
canvas.height = tileSize * gridSize;
