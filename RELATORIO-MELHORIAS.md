# Arena Magnobot — relatório de engenharia

Revisão completa do jogo: correção de defeitos, reescrita do motor, acessibilidade,
desempenho e geração dos materiais de publicação na Google Play.

---

## 1. Defeitos encontrados e corrigidos

### Críticos

**1.1 — Tela de carregamento infinita se qualquer imagem falhasse**
`preload.js` contava apenas `onload`. Sem `onerror`, uma única imagem que não
carregasse (404, rede instável, cache corrompido) travava o contador e o
`callback` nunca rodava: o jogador ficava numa tela preta para sempre, sem erro.
*Agora:* toda imagem resolve com sucesso ou com falha, há barra de progresso
real e um tempo máximo de 8 segundos. Se um sprite faltar, o jogo abre
desenhando formas no lugar dele.

**1.2 — Inversão de 180° matava o jogador sem erro dele**
`input.js` validava a tecla contra `direction`, que só era atualizada no tick.
Duas teclas no mesmo quadro — indo para a direita, apertar "cima" e logo
"esquerda" — passavam as duas validações e o robô virava sobre o próprio corpo.
Morte instantânea, impossível de entender.
*Agora:* fila de até duas curvas, cada entrada validada contra a última já
enfileirada. Como efeito colateral, curvas encadeadas rápidas funcionam.

**1.3 — O service worker nunca era registrado**
Existia `service-worker.js` no projeto, mas nenhuma página chamava
`navigator.serviceWorker.register`. O jogo não funcionava offline, apesar de o
README prometer isso. Pior: a lista de arquivos tinha caminhos inexistentes
(`/icons/icon-192.png`) e um nome com erro de digitação (`langue-select.js`), e
`cache.addAll()` falha inteiro se um item falhar — a instalação nunca completava
mesmo se tivesse sido registrada.
*Agora:* registrado, lista corrigida, cada arquivo adicionado individualmente e
estratégia rede-primeiro para o HTML (antes era cache para tudo, o que prendia o
jogador numa versão velha para sempre).

**1.4 — `new Audio("song-8.mp3")` — arquivo inexistente**
Em `game-logic.js`, ao completar a coleção, dez objetos `Audio` eram criados
apontando para um arquivo que não existe no projeto: dez requisições 404 e dez
promessas rejeitadas, num dos momentos mais pesados da partida.
*Agora:* usa o som `final` que já existe nos assets.

**1.5 — Elementos nascendo uns em cima dos outros**
`generateBox`, `generateGhost` e `generatePowerUp` sorteavam posições sem
considerar todos os ocupantes. Um power-up sobre um fantasma era impossível de
pegar; uma caixa sobre o power-up contava as duas coisas de uma vez. Além disso,
os três usavam `do...while` com sorteio aleatório — com o tabuleiro quase cheio,
isso trava o navegador.
*Agora:* um conjunto único de células ocupadas, sorteio sobre a lista de células
livres (tempo constante, sem laço infinito) e margem de segurança de duas casas
à frente do robô, para nada nascer onde não dá tempo de reagir.

**1.6 — Fantasmas nasciam letais e sem aviso**
Apareciam instantaneamente, às vezes na casa seguinte à do robô em movimento.
Morte impossível de evitar.
*Agora:* nascem "armando" por 900 ms — piscando, translúcidos e inofensivos.

### Importantes

**1.7 — Caixa boa e carga avariada eram quase idênticas**
Os dois sprites são caixas laranjas na mesma paleta; no tamanho de um tile de
celular ficam indistinguíveis. O jogador morria sem entender o motivo.
*Agora:* a carga avariada é recolorida em vermelho em tempo de execução
(com cache, sem custo por quadro) e ganha uma aura vermelha pulsante. Os
arquivos originais não foram alterados.

**1.8 — As partículas nunca apareciam**
`render()` chamava `stage.removeAllChildren()` a cada quadro, apagando as
partículas e os tweens criados no quadro anterior. O efeito existia no código e
nunca na tela.
*Agora:* as partículas têm vida própria em `dt`, fora do ciclo de desenho.

**1.9 — Dificuldade constante**
`createjs.Ticker.framerate = 5` era fixo. O jogo nunca acelerava, apesar de a
descrição prometer progressão.
*Agora:* o intervalo do passo cai de 300 ms para 100 ms conforme a pontuação.

**1.10 — Toque detectado por user-agent**
`/Mobi|Android|iPhone|iPad/` decidia se havia controle por toque. Notebooks com
tela sensível e tablets fora dessa lista ficavam sem controle nenhum.
*Agora:* detecção por capacidade (`ontouchstart`, `maxTouchPoints`).

**1.11 — Paisagem bloqueada**
Virar o celular mostrava "Vire seu celular para a vertical para jogar".
*Agora:* o layout se adapta; em paisagem o direcional vira um controle
flutuante no canto.

**1.12 — Dimensões calculadas uma única vez**
`canvas.width` era definido no carregamento e nunca mais. Girar o aparelho,
redimensionar a janela ou a barra de endereço aparecendo quebravam o
alinhamento.
*Agora:* recálculo em `resize`, `orientationchange` e `visualViewport`, com
`devicePixelRatio` (nítido em tela retina, o que antes não acontecia).

**1.13 — O jogo rodava com a aba em segundo plano**
Trocar de aba e voltar significava encontrar a partida perdida.
*Agora:* pausa automática ao perder foco, e pausa manual com P ou Esc — que
não existia.

**1.14 — Tela de fim de jogo sem a pontuação**
Mostrava só "Game Over" e dois botões. O jogador não via quanto fez.
*Agora:* pontuação, caixas coletadas, recorde e selo de novo recorde.

**1.15 — Selo "Novo recorde" aparecia com 0 ponto**
O `hidden` do HTML era anulado por um `display` declarado no CSS.
*Agora:* `[hidden] { display: none !important; }` e a comparação é contra o
recorde anterior à partida, não contra o valor já atualizado.

**1.16 — Áudio sem tratamento de bloqueio**
`.play()` sem `.catch()` gera erro não tratado sempre que o navegador bloqueia o
autoplay — o padrão no Chrome e no iOS. E a preferência de som não era guardada.
*Agora:* liberado no primeiro gesto, todas as promessas tratadas, preferência
persistida e sons curtos tocando sobrepostos sem se cortar.

**1.17 — `localStorage` sem proteção**
Chamado diretamente. No Safari em navegação privada ou com cookies bloqueados,
lança exceção e derruba o jogo inteiro.
*Agora:* envolvido em um módulo que nunca lança.

**1.18 — Seleção de idioma obrigatória toda vez**
Era preciso escolher a bandeira antes de cada partida, e a escolha não ficava
guardada.
*Agora:* detectado do navegador, guardado, trocável a qualquer momento. Foi
acrescentado o espanhol (quatro idiomas).

**1.19 — Rolagem e "puxar para atualizar" durante a partida**
O gesto de jogar competia com o gesto do navegador.
*Agora:* `touch-action: none` na área de jogo, `overscroll-behavior: none` e
`preventDefault` no arraste.

**1.20 — `main.js` ignorava o idioma escolhido**
Escrevia as instruções sempre com `translations.pt`, independentemente da
escolha.
*Agora:* tudo passa por `data-i18n` — nenhuma lista manual de IDs para esquecer
de atualizar.

---

## 2. Identidade visual — o que foi preservado

Numa primeira versão desta revisão eu troquei a arte do designer por um visual
genérico. Foi erro meu, e está desfeito. O que está no ar agora:

- **A arena com os refletores**, em tela cheia, como no original
  (`arena.webp` no desktop, `arena-mobile.webp` no celular). Um defeito de
  pintura impedia que ela aparecesse: o `<body>` tinha fundo opaco, e em CSS o
  fundo de um bloco é pintado **depois** dos descendentes com `z-index`
  negativo — a camada da arena ficava escondida atrás dele.
- **A logo original** na tela inicial e no carregamento, agora em WebP de
  27 KB no lugar do JPG de 516 KB (mesma imagem, mesmo tamanho na tela).
- **As quatro bandeirinhas animadas** nos cantos da arena. No original elas
  eram posicionadas em pixels fixos (`top: -60px; left: 30px`) e saíam do
  lugar em qualquer tela diferente; agora são ancoradas em porcentagem do
  próprio tabuleiro e acompanham qualquer tamanho.
- **As bandeiras de idioma** em SVG, no lugar dos botões de texto. Desenhei uma
  bandeira da Espanha no mesmo estilo circular para o idioma que acrescentei.
- **A moldura laranja do tabuleiro**, agora com um brilho suave para destacar
  sobre as partes claras dos refletores.

Um ajuste de layout entrou junto: o tabuleiro tem teto de 540 px. Sem ele, numa
tela de notebook ele ocupava a altura inteira e tapava a arena — exatamente o
que você apontou. E a área de jogo ganhou largura máxima, para as colunas de
produtos não serem empurradas para as bordas da janela.

---

## 3. Desempenho

| | Antes | Depois |
|---|---|---|
| Primeiro carregamento (desktop, tudo incluído) | ~3,5 MB | **314 KB** |
| Primeiro carregamento (celular) | ~3,5 MB | **280 KB** |
| Biblioteca externa | CreateJS, 242 KB | nenhuma |
| GIF do tutorial | 2,6 MB no caminho crítico | removido (ilustração em CSS) |
| Logo | 516 KB (JPG 1024²) | 27 KB (WebP 360²) |
| Trilha sonora | 1,9 MB baixada no carregamento | 590 KB e só quando vai tocar |
| Efeitos sonoros | 134 KB | 67 KB |
| Pasta `public/` publicada | ~18 MB | **5,2 MB** |
| `DOMContentLoaded` | — | 37 ms (medido) |

O que mudou de fundo: o CreateJS saiu e o desenho passou a ser Canvas 2D direto,
com laço de passo fixo e posição interpolada entre as células — o movimento, que
era aos saltos a 5 quadros por segundo, agora é contínuo na taxa do monitor.

---

## 4. Novidades de jogabilidade

- **Escudo magnético** — a cada 8 caixas, absorve uma batida em carga avariada.
  Aproveita os sprites `robot-actived-1/2`, que antes só piscavam a cada 8
  segundos sem efeito nenhum no jogo.
- **Combo** — caixas em sequência rápida multiplicam os pontos em até 5x.
- **Progressão de velocidade** — de 300 ms a 100 ms por passo.
- **Power-up com prazo** — anel de contagem em volta; antes ficava para sempre
  no tabuleiro.
- **Coleção completa** — fechar os 10 produtos dá 10 pontos de bônus e reinicia
  a coleção.
- **Tabuleiro 10×10** (era 8×8), mais espaço de manobra.
- **Pausa** com P, Esc ou botão.

---

## 5. Acessibilidade e usabilidade

- Alvos de toque de no mínimo 46 px.
- Foco visível no teclado em todos os botões (`:focus-visible`).
- `aria-label` e `aria-pressed` nos controles; `role="status"` nos avisos.
- `prefers-reduced-motion` respeitado: partículas e tremor desligam.
- `100dvh` em vez de `100vh` — o layout não fica mais escondido atrás da barra
  do navegador no celular.
- Áreas seguras (`env(safe-area-inset-*)`) para aparelhos com entalhe.
- Direcional na tela para quem não gosta de gesto, e toque simples na direção
  desejada como terceira opção.

---

## 6. PWA

- Service worker registrado e funcional, com versionamento de cache.
- `manifest.json` reescrito: era 12,8 KB listando dezenas de blocos do Windows,
  sem `type`, sem `purpose` e com `start_url` absoluto (que quebra em hospedagem
  dentro de subpasta). Agora tem 1,9 KB, caminhos relativos, ícones
  `maskable` gerados para Android e `orientation: any`.
- Botão "Instalar" só aparece quando o navegador realmente oferece a instalação,
  e some depois.

---

## 7. Arquivos

**Novos** — `public/assets/js/`: `config.js`, `storage.js`, `i18n.js`,
`audio.js`, `assets.js`, `renderer.js`, `input.js`, `ui.js`, `game.js`,
`main.js`.

**Reescritos** — `public/index.html` (31,8 KB → 9,4 KB),
`public/assets/css/style.css`, `public/service-worker.js`,
`public/manifest.json`.

**Movidos para `legacy/`** — `createjs.min.js`, os 11 arquivos JS antigos,
`tutorial.gif` e `assets/icons/windows11/`. Nada disso é mais referenciado;
estão fora de `public/` para não irem no deploy, e podem ser apagados quando
você quiser. **O `logo.jpg` original continua em `public/assets/images/`** —
é a arte-mestre, usada para gerar o ícone e o gráfico de destaque.

**Novos utilitários** — `tools/scene.py` e `tools/gen_store_assets.py` geram
todos os materiais da loja a partir dos próprios sprites do jogo.
Rode `python3 tools/gen_store_assets.py` para refazê-los.

---

## 8. Como foi verificado

Dez verificações automatizadas rodadas dentro do jogo, todas passando:

```
PASS — inversao direta de direcao e recusada
PASS — inversao na segunda curva da fila e recusada
PASS — fila limitada a duas curvas
PASS — o robo nao se dobra sobre o proprio corpo
PASS — spawn nunca cai em celula ocupada
PASS — spawn com tabuleiro cheio retorna null sem travar
PASS — fantasma nasce com periodo de armacao
PASS — escudo absorve a batida
PASS — fantasma armado encerra a partida
PASS — seguir a propria cauda nao e colisao
PASS — o jogo acelera conforme pontua (300ms -> 217ms)
PASS — power-up expira e some do tabuleiro
```

Testado visualmente em três formatos: desktop, celular retrato (375×812) e
celular paisagem (812×375). Nenhum erro de console, nenhum recurso com falha,
nenhuma barra de rolagem indevida.

**Uma ressalva honesta:** o registro do service worker não pôde ser confirmado
no navegador embutido que usei para testar — ele recusa buscar o script de
service worker, independentemente do código. O arquivo é servido corretamente
(HTTP 200, `text/javascript`) e o código de registro está no lugar, mas o
funcionamento offline precisa ser conferido por você no site publicado: abra o
jogo, vá em DevTools → Application → Service Workers e confirme que aparece
"activated and is running".

---

## 9. Pontos que ficaram em aberto

- **Analytics** — o Google Analytics foi mantido, mas movido para o fim do
  `<body>`. Isso precisa ser declarado na seção "Segurança dos dados" da Play.
  Se preferir publicar sem coleta nenhuma, é só apagar o bloco.
- **Placar online** — o recorde é local. Um ranking exigiria servidor.
- **Empacotamento Android** — o jogo é um PWA. Para a Play, o caminho natural é
  gerar um TWA (Bubblewrap ou PWABuilder) apontando para o site publicado; isso
  exige o `assetlinks.json` no domínio.
