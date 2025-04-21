window.enableTutorialRotation = false;

const orientations = [
    "rotate(0deg)",
    "rotate(180deg)",
    "rotate(90deg)",
    "rotate(-90deg)"
];

let tutorialRotationIndex = 0;
let cssRotationInterval;

function startTutorialRotation() {
    if (!window.enableTutorialRotation) {
        stopTutorialRotation();
        return;
    }

    const img = document.getElementById("tutorialImage");
    if (!img) return;

    img.style.transform = orientations[tutorialRotationIndex];

    cssRotationInterval = setInterval(() => {
        if (!window.enableTutorialRotation) {
            stopTutorialRotation();
            return;
        }

        tutorialRotationIndex = (tutorialRotationIndex + 1) % orientations.length;
        img.style.transform = orientations[tutorialRotationIndex];
    }, 3000);
}

function stopTutorialRotation() {
    clearInterval(cssRotationInterval);
    cssRotationInterval = null;
    tutorialRotationIndex = 0;

    const img = document.getElementById("tutorialImage");
    if (!img) return;

    img.style.transform = orientations[0];
}

document.addEventListener("DOMContentLoaded", () => {
    const img = document.getElementById("tutorialImage");
    const wrapper = document.getElementById("tutorialImageWrapper");
    const loadingText = document.getElementById("loadingText");

    const showImage = () => {
        if (wrapper) wrapper.classList.remove("skeleton");
        if (loadingText) loadingText.style.display = "none";
        if (img) img.style.display = "block";
    };

    if (img && wrapper) {
        if (img.complete) {
            showImage();
        } else {
            img.onload = showImage;
        }
    }
});