# -*- coding: utf-8 -*-
"""Desenha uma cena do Arena Magnobot em qualquer resolucao.
Usado para gerar os materiais da Google Play sem depender de captura de tela.
Os sprites sao os mesmos arquivos que o jogo carrega."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
IMG = os.path.join(ROOT, 'images')
GF = '/usr/share/fonts/truetype/google-fonts/'

BG = (18, 13, 26)
BG2 = (42, 28, 59)
PANEL = (28, 20, 37)
ACCENT = (251, 140, 0)
ACCENT2 = (255, 174, 66)
SHIELD = (79, 211, 255)
DANGER = (234, 62, 62)
TEXT = (244, 241, 247)
MUTED = (166, 158, 179)
TILE_A = (67, 84, 61)
TILE_B = (83, 113, 76)

_font_cache = {}
def font(size, weight='Bold'):
    key = (size, weight)
    if key not in _font_cache:
        _font_cache[key] = ImageFont.truetype(GF + 'Poppins-%s.ttf' % weight, size)
    return _font_cache[key]

_spr_cache = {}
def sprite(name):
    if name not in _spr_cache:
        p = os.path.join(IMG, name)
        _spr_cache[name] = Image.open(p).convert('RGBA')
    return _spr_cache[name]

def scaled(name, size):
    key = (name, size)
    if key not in _spr_cache:
        _spr_cache[key] = sprite(name).resize((size, size), Image.NEAREST)
    return _spr_cache[key]


def tinted(name, size, color=(224, 29, 29), strength=0.62):
    """Mesma recoloracao que o jogo aplica no fantasma, para a arte da loja
    bater com o que o jogador ve na tela."""
    key = (name, size, color, strength)
    if key not in _spr_cache:
        base = scaled(name, size).copy()
        overlay = Image.new('RGBA', base.size, color + (255,))
        rgb = Image.blend(base.convert('RGBA'), overlay, strength)
        rgb.putalpha(base.getchannel('A'))
        _spr_cache[key] = rgb
    return _spr_cache[key]


def gradient_bg(w, h):
    """Fundo = a arena do designer, em tela cheia, igual ao jogo.
    Antes isto era um degrade roxo inventado e a arte original sumia."""
    name = 'arena.webp' if w >= h else 'arena-mobile.webp'
    try:
        tex = Image.open(os.path.join(IMG, name)).convert('RGB')
    except Exception:
        tex = Image.open(os.path.join(IMG, 'arena.webp')).convert('RGB')

    # recorte "cover": preenche sem distorcer
    sc = max(w / tex.width, h / tex.height)
    nw, nh = int(tex.width * sc + 1), int(tex.height * sc + 1)
    tex = tex.resize((nw, nh), Image.LANCZOS)
    left, top = (nw - w) // 2, (nh - h) // 2
    bg = tex.crop((left, top, left + w, top + h)).convert('RGBA')

    # véu escuro no topo e na base, para o texto da loja ficar legível
    veil = Image.new('L', (1, h))
    for y in range(h):
        t = y / float(h - 1)
        if t < 0.30:
            a = int(190 * (1 - t / 0.30) ** 0.9)
        elif t > 0.80:
            a = int(170 * ((t - 0.80) / 0.20) ** 0.9)
        else:
            a = 0
        veil.putpixel((0, y), a)
    veil = veil.resize((w, h))
    dark = Image.new('RGBA', (w, h), (4, 10, 20, 255))
    dark.putalpha(veil)
    bg.alpha_composite(dark)
    return bg


def corner_flag(img, cx, cy, size, angle):
    """Bandeirinha vermelha dos cantos da arena, aproximada em poligono."""
    f = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(f)
    s = size / 100.0
    d.polygon([(22 * s, 88 * s), (28 * s, 88 * s), (31 * s, 20 * s), (25 * s, 20 * s)],
              fill=(84, 60, 36, 255))
    d.polygon([(28 * s, 26 * s), (56 * s, 34 * s), (78 * s, 30 * s), (92 * s, 38 * s),
               (70 * s, 44 * s), (48 * s, 56 * s), (29 * s, 52 * s)],
              fill=(234, 62, 62, 255))
    f = f.rotate(-angle, resample=Image.BICUBIC, expand=True)
    img.alpha_composite(f, (int(cx - f.width / 2), int(cy - f.height / 2)))


def chip(d, xy, label, value, muted_label=True, bold_value=True, fs=None):
    x, y = xy
    fs = fs or 26
    fl, fv = font(fs, 'Medium'), font(int(fs * 1.18), 'Bold')
    pad_x, pad_y = int(fs * 0.7), int(fs * 0.42)
    wl = d.textlength(label, font=fl)
    wv = d.textlength(value, font=fv)
    w = int(wl + wv + pad_x * 2 + fs * 0.5)
    h = int(fs * 1.18 + pad_y * 2)
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=(0, 0, 0, 150),
                        outline=(255, 255, 255, 28), width=2)
    d.text((x + pad_x, y + h / 2), label, font=fl, fill=MUTED, anchor='lm')
    d.text((x + pad_x + wl + fs * 0.42, y + h / 2), value, font=fv,
           fill=ACCENT2 if not bold_value else TEXT, anchor='lm')
    return w, h


def badge(d, xy, text, bg, fg, fs=24):
    x, y = xy
    f = font(fs, 'Bold')
    w = int(d.textlength(text, font=f) + fs * 1.3)
    h = int(fs * 1.9)
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=bg)
    d.text((x + w / 2, y + h / 2), text, font=f, fill=fg, anchor='mm')
    return w, h


def draw_board(size, scene, grid=10):
    """Tabuleiro quadrado com os elementos da cena."""
    board = Image.new('RGBA', (size, size), TILE_A)
    d = ImageDraw.Draw(board)
    t = size / grid
    for x in range(grid):
        for y in range(grid):
            col = TILE_A if (x + y) % 2 == 0 else TILE_B
            d.rectangle([x * t, y * t, (x + 1) * t, (y + 1) * t], fill=col)

    def put(name, cell, scale=0.9, rot=0, tint=False):
        s = max(4, int(t * scale))
        im = tinted(name, s) if tint else scaled(name, s)
        if rot:
            im = im.rotate(-rot, expand=False, resample=Image.NEAREST)
        cx = int((cell[0] + 0.5) * t - s / 2)
        cy = int((cell[1] + 0.5) * t - s / 2)
        board.alpha_composite(im, (cx, cy))

    if scene.get('box'):
        put('box.png', scene['box'], 0.8)

    for g in scene.get('ghosts', []):
        arming = isinstance(g, dict) and g.get('arming')
        cell = g['cell'] if isinstance(g, dict) else g
        if arming:
            d.rounded_rectangle([cell[0] * t + 3, cell[1] * t + 3,
                                 (cell[0] + 1) * t - 3, (cell[1] + 1) * t - 3],
                                radius=int(t * 0.18), outline=DANGER, width=max(2, int(t * 0.05)))
        else:
            # aura vermelha, igual a do jogo
            glow = Image.new('RGBA', (int(t * 1.4), int(t * 1.4)), (0, 0, 0, 0))
            gd = ImageDraw.Draw(glow)
            steps = 14
            for i in range(steps, 0, -1):
                rr = int(t * 0.62 * i / steps)
                a = int(52 * (1 - i / float(steps)) ** 1.2) + 6
                gd.ellipse([glow.width // 2 - rr, glow.height // 2 - rr,
                            glow.width // 2 + rr, glow.height // 2 + rr], fill=DANGER + (a,))
            glow = glow.filter(ImageFilter.GaussianBlur(t * 0.09))
            board.alpha_composite(glow, (int((cell[0] + 0.5) * t - glow.width / 2),
                                         int((cell[1] + 0.5) * t - glow.height / 2)))
        put('ghost.png', cell, 0.82, tint=True)

    pu = scene.get('powerup')
    if pu:
        cell, idx = pu['cell'], pu['index']
        # anel de tempo restante
        pad = t * 0.04
        d.arc([cell[0] * t + pad, cell[1] * t + pad, (cell[0] + 1) * t - pad, (cell[1] + 1) * t - pad],
              -90, -90 + 360 * pu.get('left', 0.7), fill=ACCENT2, width=max(3, int(t * 0.07)))
        put('power-up-%d.jpg' % idx, cell, 0.72)

    body = scene.get('body', [])
    rot = {'right': 0, 'down': 90, 'left': 180, 'up': -90}.get(scene.get('dir', 'right'), 0)
    for i in range(len(body) - 1, -1, -1):
        if i == 0:
            if scene.get('shield'):
                cx, cy = (body[0][0] + 0.5) * t, (body[0][1] + 0.5) * t
                r = t * 0.54
                d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=SHIELD, width=max(3, int(t * 0.08)))
                put('robot-actived-1.png', body[0], 0.92, rot)
            else:
                put('robot.png', body[0], 0.92, rot)
        else:
            put('box.png', body[i], 0.74)

    for p in scene.get('particles', []):
        cx, cy, r, col = p
        d.ellipse([cx * t - r, cy * t - r, cx * t + r, cy * t + r], fill=col)

    if scene.get('float'):
        cell, txt = scene['float']
        f = font(int(t * 0.46), 'Bold')
        x, y = (cell[0] + 0.5) * t, (cell[1] + 0.1) * t
        d.text((x, y), txt, font=f, fill=(0, 0, 0, 180), anchor='mm',
               stroke_width=max(2, int(t * 0.05)), stroke_fill=(0, 0, 0, 180))
        d.text((x, y), txt, font=f, fill=ACCENT2, anchor='mm')

    # moldura
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.025), fill=255)
    out.paste(board, (0, 0), mask)
    ImageDraw.Draw(out).rounded_rectangle([1, 1, size - 2, size - 2], radius=int(size * 0.025),
                                          outline=ACCENT, width=max(3, int(size * 0.008)))
    return out


def draw_collection(d, img, x, y, w, collected, count=10, per_row=5, gap_ratio=0.16):
    """Duas faixas de produtos colecionaveis."""
    item = int(w / (per_row + (per_row - 1) * gap_ratio))
    gap = int(item * gap_ratio)
    for i in range(count):
        row, col = divmod(i, per_row)
        ix = x + col * (item + gap)
        iy = y + row * (item + gap)
        spr = scaled('power-up-%d.jpg' % (i + 1), item)
        if (i + 1) in collected:
            img.alpha_composite(spr, (ix, iy))
        else:
            grey = spr.convert('L').convert('RGBA')
            grey.putalpha(90)
            img.alpha_composite(grey, (ix, iy))
    return (item + gap) * ((count + per_row - 1) // per_row)


def draw_dpad(img, cx, cy, btn):
    d = ImageDraw.Draw(img)
    gap = int(btn * 0.1)
    step = btn + gap
    for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1)):
        x = cx + dx * step - btn // 2
        y = cy + dy * step - btn // 2
        d.rounded_rectangle([x, y, x + btn, y + btn], radius=int(btn * 0.27),
                            fill=(0, 0, 0, 150), outline=(255, 255, 255, 45), width=2)
        # seta desenhada como poligono
        mx, my = x + btn / 2, y + btn / 2
        r = btn * 0.2
        if dy == -1:
            pts = [(mx, my - r), (mx - r, my + r * 0.75), (mx + r, my + r * 0.75)]
        elif dy == 1:
            pts = [(mx, my + r), (mx - r, my - r * 0.75), (mx + r, my - r * 0.75)]
        elif dx == -1:
            pts = [(mx - r, my), (mx + r * 0.75, my - r), (mx + r * 0.75, my + r)]
        else:
            pts = [(mx + r, my), (mx - r * 0.75, my - r), (mx - r * 0.75, my + r)]
        d.polygon(pts, fill=ACCENT2)
