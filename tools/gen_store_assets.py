# -*- coding: utf-8 -*-
"""Gera todos os materiais graficos exigidos pela Google Play Console.
    python3 gen_store_assets.py
Saida em ../store/"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFilter
from scene import *

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'store')

# ---------------------------------------------------------------- cenas
SCENES = [
    dict(key='01-arena', title=u'Colete. Desvie.\nSobreviva.',
         sub=u'Arcade retrô de reflexo puro',
         score='12', best='48', combo=None, shield=False,
         body=[(4,4),(3,4),(2,4)], dir='right', box=(7,2),
         ghosts=[{'cell':(2,7)},{'cell':(8,6)}],
         powerup=None, collected={1,2}, float=None),

    dict(key='02-combo', title=u'Sequências rápidas\nmultiplicam tudo',
         sub=u'Combo de até 5x',
         score='37', best='48', combo='x3', shield=False,
         body=[(5,5),(4,5),(4,6),(3,6),(2,6)], dir='right', box=(6,5),
         ghosts=[{'cell':(1,2)},{'cell':(8,8)},{'cell':(3,1)}],
         powerup=None, collected={1,2,3,4},
         float=((5,5), '+3 x3'),
         particles=[(5.5,5.5,9,(255,196,80,255)),(5.9,5.2,6,(255,220,120,255)),(5.2,5.8,7,(255,174,66,255))]),

    dict(key='03-powerup', title=u'Produtos raros\nvalem o triplo',
         sub=u'Complete a coleção e ganhe bônus',
         score='54', best='54', combo='x2', shield=False,
         body=[(3,6),(3,5),(3,4),(2,4),(1,4)], dir='down', box=(8,1),
         ghosts=[{'cell':(6,3)},{'cell':(1,8)},{'cell':(9,5)}],
         powerup={'cell':(5,6),'index':7,'left':0.62},
         collected={1,2,3,4,5,6}, float=None),

    dict(key='04-shield', title=u'Escudo magnético\nabsorve uma batida',
         sub=u'Uma chance a cada 8 caixas',
         score='71', best='71', combo=None, shield=True,
         body=[(4,3),(5,3),(6,3),(6,4),(6,5),(5,5)], dir='left', box=(1,7),
         ghosts=[{'cell':(3,3),'arming':True},{'cell':(8,2)},{'cell':(2,6)}],
         powerup=None, collected={1,2,3,4,5,6,7,8}, float=None),

    dict(key='05-ghosts', title=u'Fantasmas piscam\nantes de ativar',
         sub=u'Dá tempo de desviar — se você for rápido',
         score='96', best='96', combo='x4', shield=False,
         body=[(5,7),(5,6),(5,5),(4,5),(4,4),(4,3),(3,3)], dir='down', box=(2,9),
         ghosts=[{'cell':(5,9),'arming':True},{'cell':(1,1)},{'cell':(8,4)}],
         powerup={'cell':(9,2),'index':3,'left':0.35},
         collected={1,2,3,4,5,6,7,8,9}, float=None),

    dict(key='06-record', title=u'Jogue offline,\nbata seu recorde',
         sub=u'Instale e jogue sem internet',
         score='124', best='124', combo='x5', shield=True,
         body=[(6,4),(6,5),(7,5),(8,5),(8,6),(8,7),(7,7),(6,7)], dir='up', box=(3,2),
         ghosts=[{'cell':(1,4)},{'cell':(4,8)},{'cell':(9,1)},{'cell':(2,0)}],
         powerup={'cell':(2,5),'index':10,'left':0.85},
         collected=set(range(1,11)), float=((6,4), '+1 x5'),
         particles=[(6.5,4.5,8,(255,196,80,255)),(6.1,4.2,5,(255,230,150,255))]),
]

# ---------------------------------------------------------------- telas
def render_phone(sc, W=1080, H=1920):
    """Layout retrato. O espaco e repartido de baixo para cima para que
    direcional, colecao e tabuleiro sempre caibam na tela."""
    img = gradient_bg(W, H)
    d = ImageDraw.Draw(img)
    M = int(W * 0.055)

    # --- medidas fixas, calculadas antes de desenhar ---
    btn = int(W * 0.092)
    dpad_h = btn * 3 + int(btn * 0.2)
    cw = int(W * 0.42)
    item = int(cw / (5 + 4 * 0.16))
    coll_h = int((item * 1.16) * 2)
    hud_h = int(W * 0.062)
    pad = int(H * 0.017)

    bottom_block = dpad_h + coll_h + pad * 3
    # altura real do bloco de titulo, medida em vez de chutada: antes o HUD
    # era posicionado num percentual fixo e passava por cima do subtitulo
    nlines = len(sc['title'].split('\n'))
    title_h = int(H * 0.036) + nlines * int(W * 0.098) + int(W * 0.014) \
              + int(W * 0.036 * 1.5) + int(H * 0.018)
    bsize = min(W - M * 2, H - title_h - hud_h - bottom_block - pad * 2)
    bx = (W - bsize) // 2

    # --- titulo ---
    y = int(H * 0.036)
    ft = font(int(W * 0.082), 'Bold')
    for line in sc['title'].split('\n'):
        d.text((W / 2, y), line, font=ft, fill=TEXT, anchor='ma',
               stroke_width=max(2, int(W * 0.006)), stroke_fill=(3, 8, 16, 230))
        y += int(W * 0.098)
    d.text((W / 2, y + int(W * 0.014)), sc['sub'], font=font(int(W * 0.036), 'Medium'),
           fill=ACCENT2, anchor='ma',
           stroke_width=max(2, int(W * 0.005)), stroke_fill=(3, 8, 16, 230))

    hud_y = title_h
    h1 = int(W * 0.062)

    # --- tabuleiro + bandeirinhas dos cantos ---
    by = hud_y + h1 + pad
    img.alpha_composite(draw_board(bsize, sc), (bx, by))
    fs_ = int(bsize * 0.15)
    for ox, oy, ang in ((0.08, -0.03, -45), (0.92, -0.03, 45),
                        (0.08, 1.03, -135), (0.92, 1.03, 135)):
        corner_flag(img, bx + bsize * ox, by + bsize * oy, fs_, ang)

    # --- HUD, desenhado por ultimo para ficar acima das bandeirinhas ---
    w1, _ = chip(d, (M, hud_y), u'Pontos', sc['score'])
    chip(d, (M + w1 + int(W * 0.022), hud_y), u'Recorde', sc['best'], bold_value=False)
    bxr = W - M
    if sc.get('shield'):
        bw, bh = badge(d, (0, -999), u'\u25C9', SHIELD, (1, 32, 43), int(W * 0.03))
        bxr -= bw
        badge(d, (bxr, hud_y + (h1 - bh) // 2), u'\u25C9', SHIELD, (1, 32, 43), int(W * 0.03))
        bxr -= int(W * 0.02)
    if sc.get('combo'):
        bw, bh = badge(d, (0, -999), sc['combo'], ACCENT, (34, 20, 0), int(W * 0.032))
        bxr -= bw
        badge(d, (bxr, hud_y + (h1 - bh) // 2), sc['combo'], ACCENT, (34, 20, 0), int(W * 0.032))

    # --- colecao ---
    cy = by + bsize + pad
    draw_collection(d, img, (W - cw) // 2, cy, cw, sc['collected'])

    # --- direcional ---
    dy = cy + coll_h + pad
    draw_dpad(img, W // 2, dy + btn + int(btn * 0.1), btn)

    return img.convert('RGB')


def render_tablet(sc, W=1920, H=1200):
    """Layout paisagem — mostra que o jogo gira, coisa que a versão antiga bloqueava."""
    img = gradient_bg(W, H)
    d = ImageDraw.Draw(img)
    M = int(H * 0.055)

    bsize = int(H * 0.72)
    bx = (W - bsize) // 2
    by = int(H * 0.19)
    img.alpha_composite(draw_board(bsize, sc), (bx, by))
    fs_ = int(bsize * 0.15)
    for ox, oy, ang in ((0.08, -0.03, -45), (0.92, -0.03, 45),
                        (0.08, 1.03, -135), (0.92, 1.03, 135)):
        corner_flag(img, bx + bsize * ox, by + bsize * oy, fs_, ang)

    ft = font(int(H * 0.062), 'Bold')
    line = sc['title'].replace('\n', ' ')
    d.text((W / 2, int(H * 0.035)), line, font=ft, fill=TEXT, anchor='ma',
           stroke_width=max(2, int(H * 0.008)), stroke_fill=(3, 8, 16, 230))
    fs = font(int(H * 0.028), 'Medium')
    d.text((W / 2, int(H * 0.115)), sc['sub'], font=fs, fill=ACCENT2, anchor='ma',
           stroke_width=max(2, int(H * 0.006)), stroke_fill=(3, 8, 16, 230))


    # colecao nas laterais
    item = int(bsize * 0.085)
    gap = int(item * 0.18)
    for i in range(10):
        side = 0 if i < 5 else 1
        k = i % 5
        x = bx - int(H * 0.03) - item if side == 0 else bx + bsize + int(H * 0.03)
        y = by + int(bsize / 2 - (5 * item + 4 * gap) / 2) + k * (item + gap)
        spr = scaled('power-up-%d.jpg' % (i + 1), item)
        if (i + 1) in sc['collected']:
            img.alpha_composite(spr, (x, y))
        else:
            g = spr.convert('L').convert('RGBA'); g.putalpha(90)
            img.alpha_composite(g, (x, y))

    # HUD por ultimo, acima das bandeirinhas
    w1, h1 = chip(d, (M, by), u'Pontos', sc['score'], fs=int(H * 0.026))
    chip(d, (M, by + h1 + int(H * 0.018)), u'Recorde', sc['best'], bold_value=False, fs=int(H * 0.026))

    return img.convert('RGB')


# ---------------------------------------------------------------- icone e destaque
def render_icon(size=512, rounded=True):
    """Icone do app. Camadas desenhadas em overlays separados e combinadas com
    alpha_composite: ImageDraw em RGBA substitui o pixel em vez de misturar,
    e desenhar direto furava o fundo."""
    base = gradient_bg(size, size).convert('RGBA')

    # halo laranja atras do robo
    halo = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    steps = 26
    for i in range(steps, 0, -1):
        r = int(size * 0.46 * i / steps)
        a = int(70 * (1 - i / float(steps)) ** 1.5)
        hd.ellipse([size / 2 - r, size / 2 - r, size / 2 + r, size / 2 + r],
                   fill=ACCENT + (a,))
    base.alpha_composite(halo.filter(ImageFilter.GaussianBlur(size * 0.05)))

    # piso quadriculado discreto
    grid_layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid_layer)
    t = size / 8.0
    for x in range(8):
        for y in range(8):
            if (x + y) % 2 == 0:
                gd.rectangle([x * t, y * t, (x + 1) * t, (y + 1) * t], fill=(255, 255, 255, 10))
    base.alpha_composite(grid_layer)

    rob = scaled('robot.png', int(size * 0.58))
    base.alpha_composite(rob, ((size - rob.width) // 2, (size - rob.height) // 2))

    # A Play Console quer um quadrado cheio: ela mesma aplica a mascara e o
    # arredondamento. Um icone ja arredondado fica com cantos duplos.
    if not rounded:
        return base
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1],
                                           radius=int(size * 0.22), fill=255)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.paste(base, (0, 0), mask)
    edge = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(edge).rounded_rectangle([2, 2, size - 3, size - 3], radius=int(size * 0.22),
                                           outline=ACCENT + (170,), width=max(2, int(size * 0.014)))
    out.alpha_composite(edge)
    return out


def render_feature(W=1024, H=500):
    """Grafico de destaque com a logo original do jogo sobre a arena."""
    img = gradient_bg(W, H)

    bs = int(H * 0.70)
    bxp = W - bs - int(W * 0.045)
    byp = (H - bs) // 2
    img.alpha_composite(draw_board(bs, SCENES[1]), (bxp, byp))
    fs_ = int(bs * 0.16)
    for ox, oy, ang in ((0.08, -0.04, -45), (0.92, -0.04, 45),
                        (0.08, 1.04, -135), (0.92, 1.04, 135)):
        corner_flag(img, bxp + bs * ox, byp + bs * oy, fs_, ang)

    logo = Image.open(os.path.join(IMG, 'logo.jpg')).convert('RGBA')
    ls = int(H * 0.50)
    logo = logo.resize((ls, ls), Image.LANCZOS)
    lx, ly = int(W * 0.055), (H - ls) // 2
    # moldura suave
    frame = Image.new('RGBA', (ls + 8, ls + 8), (0, 0, 0, 0))
    ImageDraw.Draw(frame).rounded_rectangle([0, 0, ls + 7, ls + 7], radius=18,
                                            fill=(0, 0, 0, 120))
    img.alpha_composite(frame, (lx - 4, ly - 4))
    mask = Image.new('L', (ls, ls), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, ls - 1, ls - 1], radius=16, fill=255)
    img.paste(logo.convert('RGB'), (lx, ly), mask)

    d = ImageDraw.Draw(img)
    tx = lx + ls + int(W * 0.035)
    st = dict(stroke_width=3, stroke_fill=(3, 8, 16, 230))
    d.text((tx, H * 0.42), u'Colete. Desvie.', font=font(int(H * 0.072), 'Bold'),
           fill=TEXT, anchor='ls', **st)
    d.text((tx, H * 0.535), u'Sobreviva.', font=font(int(H * 0.072), 'Bold'),
           fill=ACCENT, anchor='ls', **st)
    d.text((tx, H * 0.645), u'Arcade retrô • joga offline',
           font=font(int(H * 0.044), 'Medium'), fill=ACCENT2, anchor='ls', **st)
    return img.convert('RGB')


# ---------------------------------------------------------------- execucao
def save(img, path, quality=92):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if path.endswith('.png'):
        img.save(path, optimize=True)
    else:
        img.save(path, quality=quality, optimize=True, progressive=True)
    print('%-52s %5d x %-5d %6.0f KB' % (os.path.relpath(path, OUT), img.width, img.height,
                                         os.path.getsize(path) / 1024))

if __name__ == '__main__':
    render_icon(512, rounded=False).save(os.path.join(OUT, 'icone-512.png'), optimize=True)
    print('icone-512.png (quadrado, para a Play Console)        512 x 512')
    render_icon(512, rounded=True).save(os.path.join(OUT, 'icone-512-arredondado.png'), optimize=True)
    print('icone-512-arredondado.png (uso geral)                512 x 512')
    save(render_feature(), os.path.join(OUT, 'grafico-destaque-1024x500.png'))

    for sc in SCENES:
        save(render_phone(sc), os.path.join(OUT, 'phone', '%s.png' % sc['key']))
    for sc in SCENES[:4]:
        save(render_tablet(sc, 1920, 1200), os.path.join(OUT, 'tablet7', '%s.png' % sc['key']))
        save(render_tablet(sc, 2560, 1600), os.path.join(OUT, 'tablet10', '%s.png' % sc['key']))
