# Ficha da Google Play — Arena Magnobot

## Título do app (limite 30 caracteres)

```
Arena Magnobot: Arcade Retrô
```
28 caracteres.

**Alternativas**, caso queira testar variações de busca:
- `Arena Magnobot` — 14 caracteres
- `Arena Magnobot - Robô Arcade` — 28 caracteres
- `Arena Magnobot: Jogo Offline` — 28 caracteres

---

## Descrição curta (limite 80 caracteres)

```
Colete caixas, desvie das quebradas e bata seu recorde. Joga offline.
```
69 caracteres.

**Alternativas:**
- `Arcade retrô de reflexo: colete, desvie e sobreviva. Sem internet.` — 66
- `Robô magnético, caixas, fantasmas e recorde. Leve, rápido e offline.` — 68

---

## Descrição longa (limite 4000 caracteres)

```
Você comanda um robô magnético na maior central de entregas da galáxia. A esteira nunca para, as caixas não param de chegar e cada segundo de distração custa a partida.

Arena Magnobot é um arcade retrô de reflexo puro: fácil de entender nos primeiros dez segundos, difícil de largar depois do primeiro recorde.

COMO FUNCIONA
• Colete as caixas laranjas para pontuar.
• Cada caixa deixa o robô mais rápido — a partida vai apertando sozinha.
• Cargas avariadas, em vermelho, são fatais. Elas piscam antes de ativar: você tem um instante para desviar.
• Produtos raros valem o triplo e preenchem sua coleção nas laterais da arena.
• A cada oito caixas você ganha um escudo magnético, que absorve uma batida.
• Caixas pegas em sequência rápida acionam o combo e multiplicam os pontos em até 5x.

CONTROLES QUE FUNCIONAM NOS DOIS MUNDOS
No celular, arraste o dedo para onde quiser ir ou use o direcional na tela. No computador, setas ou W A S D, com P para pausar. O jogo gira junto com o aparelho: joga na vertical e na horizontal.

LEVE E RÁPIDO
O jogo inteiro carrega em menos de 150 KB. Abre em um segundo mesmo em conexão fraca e em aparelho antigo, sem tela de espera e sem download gigante.

JOGUE SEM INTERNET
Depois da primeira abertura, Arena Magnobot fica disponível offline. Fila de banco, avião, metrô, sinal ruim: a partida acontece do mesmo jeito.

SEU RECORDE É SEU
A melhor pontuação fica guardada no próprio aparelho. Sem cadastro, sem login, sem conta para criar.

SEM ANÚNCIOS E SEM COMPRAS
Nenhum anúncio no meio da partida, nenhuma compra dentro do app, nenhuma vida para esperar recarregar. Você abre e joga.

EM QUATRO IDIOMAS
Português, inglês, espanhol e chinês. O jogo escolhe sozinho o idioma do seu aparelho e você troca quando quiser.

FEITO PARA SESSÕES CURTAS
Uma partida dura o tempo de um café. Mas o recorde na tela inicial costuma pedir só mais uma.

PERFEITO PARA QUEM GOSTA DE
Jogos arcade clássicos, jogos de reflexo, jogos retrô em pixel art, jogos offline leves, jogos casuais rápidos, jogos sem anúncios, jogos de pontuação e recorde.

Baixe, colete, desvie e descubra até onde seu reflexo aguenta.
```

Cerca de 2.140 caracteres — bem dentro do limite de 4.000.

---

## Outros campos da ficha

| Campo | Valor sugerido |
|---|---|
| Categoria | Jogos → Arcade |
| Tags | arcade, casual, offline, retrô, reflexo |
| Classificação de conteúdo | Livre para todos (sem violência, sem conteúdo sensível) |
| Anúncios | Não contém anúncios |
| Compras no app | Não |
| E-mail de contato | (preencher) |
| Política de privacidade | Obrigatória — ver nota abaixo |

### Nota sobre a seção "Segurança dos dados"

O jogo usa **Google Analytics (GA4, id `G-356GJ1VDJM`)**, configurado com `anonymize_ip`. Na declaração de segurança dos dados da Play, isso precisa ser informado como coleta de dados de uso/diagnóstico. Além disso:

- A pontuação máxima é gravada apenas no `localStorage` do aparelho — não sai do dispositivo.
- Nenhum dado pessoal, login ou permissão de sistema é solicitado.
- Se preferir publicar sem nenhuma coleta, basta remover o bloco do Analytics no fim do `public/index.html` e declarar "nenhum dado coletado".

---

## Arquivos gráficos entregues

| Arquivo | Formato | Onde usar na Play Console |
|---|---|---|
| `icone-512.png` | 512×512 PNG | Ícone do app (quadrado cheio — a Play aplica o arredondamento) |
| `icone-512-arredondado.png` | 512×512 PNG | Uso geral fora da loja (site, redes) |
| `grafico-destaque-1024x500.png` | 1024×500 PNG | Gráfico de destaque |
| `phone/01` a `phone/06` | 1080×1920 PNG | Capturas de celular (mínimo 2, máximo 8) |
| `tablet7/01` a `tablet7/04` | 1920×1200 PNG | Capturas de tablet de 7" |
| `tablet10/01` a `tablet10/04` | 2560×1600 PNG | Capturas de tablet de 10" |

Para regerar qualquer um deles depois de mexer na arte do jogo:

```
python3 tools/gen_store_assets.py
```
