# Arena Magnobot

Arena Magnobot is a fast-paced, retro-style online game where you control a magnetic robot in a futuristic arena. Your mission is to dodge dangerous goods, collect valuable product power-ups, and survive as long as possible.

![Game running in browser](https://arena-magnobot.jamesrmoro.me/assets/images/cover.jpg)

> A high-speed retro arena game where you control a magnetic robot and dodge dangerous products while collecting power-ups — built entirely with JavaScript and HTML5 Canvas!

- **Playable online, on desktop and mobile, portrait and landscape**
- Zero dependencies — plain Canvas 2D, ~100 KB first load
- Keyboard, swipe, on-screen D-pad and tap-to-turn
- Hosted on **HostGator**
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
- HostGator (hospedagem estática)

The whole game loads in about **100 KB**. There is no engine dependency:
rendering, input, audio and state are each a small module under
`assets/js/`.

---

## Publicação

### HostGator (hospedagem atual)

O jogo agora fica diretamente na raiz do projeto. Envie estes itens para a pasta
configurada no cPanel para `arena-magnobot.sprintcodes.com.br`:

- `index.html` (a página completa do jogo)
- `assets/`
- `manifest.json`
- `service-worker.js`
- `privacy/` (política de privacidade, em `/privacy` — use esta URL na Google Play)
- `.htaccess` (substitua a versão anterior com regras para `public/`)

Substitua o antigo `index.html` da hospedagem. O endereço abre o jogo diretamente,
sem link intermediário e sem `/public/`. Não envie `.git/`, `.github/`, `legacy/`,
`store/` ou `tools/`. Use HTTPS para o PWA funcionar.

### Android / Bubblewrap

O identificador Android está em `twa-manifest.json`, no campo `packageId`:
`br.com.sprintcodes.arenamagnobot.app`. Bubblewrap utiliza esse arquivo, não
`package.json`. O app abre a raiz de `https://arena-magnobot.sprintcodes.com.br/`.

Esta é uma configuração inicial: não há projeto Android nem chave de assinatura
neste repositório. Antes de gerar o app, ajuste `signingKey.path` e
`signingKey.alias` para sua chave real. Se já existe uma versão publicada,
preserve a chave e use os números de versão do projeto Android existente.
Não substitua sua chave existente pela configuração padrão `android.keystore`.

No projeto Android gerenciado pelo Bubblewrap, aplique o `packageId` acima no
`twa-manifest.json` usado pelo build e execute `bubblewrap update` e
`bubblewrap build`. A configuração deste repositório não altera um build feito
em outra pasta automaticamente. A associação Digital Asset Links também precisa
usar o mesmo pacote e o fingerprint real do certificado de assinatura.

As prévias ficam no campo `screenshots` de `manifest.json`: 6 de celular e 8 de
tablet, com as dimensões reais e os formatos `narrow` e `wide`. Os arquivos públicos
estão em `assets/screenshots/`; envie essa pasta junto com os demais assets.
Os originais para a Google Play ficam em `store/phone`, `store/tablet7` e
`store/tablet10`. Essas imagens são materiais promocionais gerados por
`tools/gen_store_assets.py`, não capturas automatizadas do navegador.
Elas são metadados de apresentação/instalação, não a tela de splash do Android.
O upload na Google Play Console é separado.

Não há integração de deploy com Alibaba OSS neste repositório.

---

## Project Structure

```plaintext
/
├── index.html               # página completa do jogo
├── assets/                  # CSS, JavaScript, imagens, ícones e sons
├── manifest.json
├── service-worker.js
├── .htaccess                # entrada padrão do Apache
├── tools/                   # geradores dos materiais da Google Play
├── store/                   # materiais da loja
├── legacy/                  # versão anterior (não publicar)
├── twa-manifest.json        # configuração Android / Bubblewrap
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

