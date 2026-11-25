# Arena Magnobot

Arena Magnobot is a fast-paced, retro-style online game where you control a magnetic robot in a futuristic arena. Your mission is to dodge dangerous goods, collect valuable product power-ups, and survive as long as possible.

![Game running in browser](https://arena-magnobot.jamesrmoro.me/assets/images/cover.jpg)

> A high-speed retro arena game where you control a magnetic robot and dodge dangerous products while collecting power-ups — built entirely with JavaScript and HTML5 Canvas!

- **Playable online, on desktop and mobile, portrait and landscape**
- Zero dependencies — plain Canvas 2D, ~100 KB first load
- Keyboard, swipe, on-screen D-pad and tap-to-turn
- Deployed automatically to **Alibaba Cloud OSS** using **GitHub Actions**
- Four languages (PT 🇧🇷 / EN 🇺🇸 / ES 🇪🇸 / ZH 🇨🇳), auto-detected and remembered
- PWA — install the game on your device and play offline

---

## About this project

This repository contains the full source code and deployment workflow for **Arena Magnobot**, a retro-inspired arena-style web game developed for the [Alibaba Cloud Web Game Challenge](https://dev.to/challenges/alibaba).

In the game, you command a magnetic robot that must collect power-ups and avoid hazardous products in a fast-paced arena. The robot switches lines based on player input, and the gameplay progressively becomes more intense.

The project runs fully in the browser and is optimized for both desktop and mobile play. It is also a **Progressive Web App (PWA)**, meaning it can be installed to your home screen and played offline.

---

## Technologies Used

- HTML5 + CSS3
- JavaScript (vanilla, no framework, no external library)
- Canvas 2D with a fixed-timestep loop and interpolated movement
- GitHub Actions (CI/CD)
- Alibaba Cloud OSS (Object Storage Service)

The whole game loads in about **100 KB**. There is no engine dependency:
rendering, input, audio and state are each a small module under
`public/assets/js/`.

---

## Automatic Deployment

Every push to the `main` branch triggers a GitHub Actions workflow that:

1. Downloads and configures `ossutil` (Alibaba OSS CLI)
2. Uploads the contents of the `public/` folder to the OSS bucket
3. Publishes your static game site online

> No local CLI commands needed — everything runs in the cloud!

---

## Project Structure

```plaintext
/
├── public/                  # tudo o que vai para o ar
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   └── assets/
│       ├── css/style.css
│       ├── js/              # config, storage, i18n, audio, assets,
│       │                    # renderer, input, ui, game, main
│       ├── images/
│       ├── sounds/
│       ├── icons/
│       └── favicon/
├── tools/                   # geradores dos materiais da Google Play
│   ├── scene.py
│   └── gen_store_assets.py
├── store/                   # ícone, gráfico de destaque, capturas e ficha
├── legacy/                  # código e assets da versão anterior (não publicados)
├── .github/workflows/deploy.yml
├── RELATORIO-MELHORIAS.md   # o que mudou e por quê
└── README.md
```

## Materiais da Google Play

Ícone, gráfico de destaque e capturas de celular e tablet ficam em `store/`,
junto com o texto da ficha (`store/ficha-google-play.md`). Para regerar tudo
depois de mexer na arte:

```bash
python3 tools/gen_store_assets.py
```

---

## 📸 Preview

![Game running in browser](https://arena-magnobot.jamesrmoro.me/assets/images/cover-2.jpg)
*Screenshot of "Arena Magnobot" running live in the browser.*

---

## 🔗 Related Links

- 🌐 [Play the game (live)](https://arena-magnobot.jamesrmoro.me)
- 📖 [Challenge page](https://dev.to/challenges/alibaba)
- ☁️ [Alibaba Cloud OSS](https://www.alibabacloud.com/product/oss)

---

## 🧠 Author

Made by [James Moro](https://www.youtube.com/@jamesmoro)

🎥 Check out my [YouTube channel](https://www.youtube.com/@jamesmoro) for more dev content, game projects, and tutorials.
👍 Don’t forget to **subscribe** and support the journey!

