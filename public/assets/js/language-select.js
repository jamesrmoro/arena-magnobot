function setLanguage(lang, startGame = false) {
    currentLang = lang;
    const t = translations[lang];

    const instructionsEl = document.getElementById("instructions");
    if (instructionsEl) {
        instructionsEl.textContent = isMobile ? t.instructions : t.instructionsDesktop;
    }

    const ids = {
        aboutTitle: t.about,
        closeAboutBtn: t.close,
        tutorialCaption: t.tutorialCaption,
        closeTutorialBtn: t.gotIt,
        aboutLink: t.about,
        installBtn: t.install,
        gameOverTitle: t.gameOver,
        restartButton: t.restart,
        loadingText: t.loadingTutorial,
    };

    for (const id in ids) {
        const el = document.getElementById(id);
        if (el) el.textContent = ids[id];
    }

    const aboutContent = document.getElementById("aboutContent");
    if (aboutContent && t.aboutHtml) {
        aboutContent.innerHTML = t.aboutHtml;
    }

    const ui = document.querySelector('#ui');
    if (ui) {
        ui.innerHTML = `${t.points}: <span id="score">${score}</span> | ${t.highscore}: <span id="highscore">${highscore}</span>`;
    }

    const soundBtn = document.getElementById("soundToggle");
    if (soundBtn) {
        soundBtn.textContent = soundOn ? t.soundOn : t.soundOff;
    }

    document.getElementById("rotateWarning").textContent = t.rotateWarning;

    if (!languageChosen && startGame) {
        languageChosen = true;

        if (isMobile) {
            const tutorialAlreadySeen = localStorage.getItem("tutorialShown") === "true";

            if (!tutorialAlreadySeen) {
                const tutorialModal = document.getElementById("tutorialModal");
                if (tutorialModal) tutorialModal.style.display = "flex";

                startTutorialRotation();

                const closeBtn = document.getElementById("closeTutorialBtn");
                if (closeBtn) {
                    closeBtn.addEventListener("click", () => {
                        localStorage.setItem("tutorialShown", "true");
                        if (tutorialModal) tutorialModal.style.display = "none";
                        stopTutorialRotation();
                        startCountdown();
                    });
                }
            } else {
                startCountdown();
            }
        } else {
            startCountdown();
        }
    }
}

let selectedLangIndex = 0;
const langButtons = document.querySelectorAll("#langSelect .flag-btn");

function updateLangSelection() {
    langButtons.forEach((btn, i) => {
        btn.classList.toggle("selected-lang", i === selectedLangIndex);
    });
}

langButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        selectedLangIndex = index;
        updateLangSelection();
        const lang = btn.getAttribute("onclick").match(/'(.*?)'/)[1];
        setLanguage(lang, true);
    });
});

document.addEventListener("keydown", (e) => {
    if (!languageChosen) {
        if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
            selectedLangIndex = (selectedLangIndex + 1) % langButtons.length;
            updateLangSelection();
        } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
            selectedLangIndex = (selectedLangIndex - 1 + langButtons.length) % langButtons.length;
            updateLangSelection();
        } else if (e.key === "Enter") {
            langButtons[selectedLangIndex].click();
        }
    }
});

updateLangSelection();

document.addEventListener("DOMContentLoaded", () => {
    setLanguage("en", false);
});