# Arena Magnobot

Arena Magnobot is a fast-paced, retro-style online game where you control a magnetic robot in a futuristic arena. Your mission is to dodge dangerous goods, collect valuable product power-ups, and survive as long as possible.

![Game running in browser](https://arena-magnobot.jamesrmoro.me/assets/images/cover.jpg)

> A high-speed retro arena game where you control a magnetic robot and dodge dangerous products while collecting power-ups — built entirely with JavaScript and HTML5 Canvas!

- **Playable online & mobile-friendly**
- Built with [CreateJS](https://createjs.com/)
- Deployed automatically to **Alibaba Cloud OSS** using **GitHub Actions**
- Supports multiple languages (PT 🇧🇷 / EN 🇺🇸 / ZH 🇨🇳)
- PWA ready — install the game on your device and play offline!

---

## About this project

This repository contains the full source code and deployment workflow for **Arena Magnobot**, a retro-inspired arena-style web game developed for the [Alibaba Cloud Web Game Challenge](https://dev.to/challenges/alibaba).

In the game, you command a magnetic robot that must collect power-ups and avoid hazardous products in a fast-paced arena. The robot switches lines based on player input, and the gameplay progressively becomes more intense.

The project runs fully in the browser and is optimized for both desktop and mobile play. It is also a **Progressive Web App (PWA)**, meaning it can be installed to your home screen and played offline.

---

## Technologies Used

- HTML5 + CSS3
- JavaScript (vanilla)
- [CreateJS](https://createjs.com/) for canvas animation
- GitHub Actions (CI/CD)
- Alibaba Cloud OSS (Object Storage Service)

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
├── public/
│   ├── index.html
│   ├── assets/
│   └── ...
├── .github/workflows/
│   └── deploy.yml
└── README.md
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

