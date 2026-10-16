"""
Membuat aset awal template: tileset, spritesheet Jack, dan 3 peta Tiled (JSON).
Jalankan:  python3 tools/generate_assets.py
Hasilnya ada di public/assets/. Peta bisa dibuka & diedit di Tiled (https://www.mapeditor.org).
Setelah itu skrip ini tidak wajib dipakai lagi: edit saja file .json di Tiled.
"""
import json, os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets')
T = 32

# ------------------------------------------------------------ tileset
# indeks (0-based). gid di Tiled = indeks + 1
GRASS, ROAD, SIDEWALK, WOOD, WALL, STOREFLOOR = 0, 1, 2, 3, 4, 5
FURN, BED, SOFA, YELLOW, HOUSEWALL, ROOF = 6, 7, 8, 9, 10, 11
STOREWALL, STOREROOF, DOOR, RACK, COUNTER, BUSH = 12, 13, 14, 15, 16, 17
ROADDASH, RUG, CABINET, REDSTRIPE, YELSTRIPE, COLLISION = 18, 19, 20, 21, 22, 23
COLS, ROWS = 8, 3

def hexc(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def tile_img(i):
    im = Image.new('RGBA', (T, T), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    def fill(c, border=None):
        d.rectangle([0, 0, 31, 31], fill=hexc(c))
        if border:
            d.rectangle([0, 0, 31, 31], outline=hexc(border))
    if i == GRASS:
        fill('#6abe45')
        for x, y in [(4, 6), (20, 14), (11, 25)]: d.rectangle([x, y, x + 2, y + 2], fill=hexc('#5aab39'))
        for x, y in [(25, 4), (8, 17)]: d.rectangle([x, y, x + 1, y + 1], fill=hexc('#7ccd55'))
    elif i in (ROAD, ROADDASH):
        fill('#4b5563')
        for x, y in [(6, 8), (22, 20)]: d.rectangle([x, y, x + 2, y + 2], fill=hexc('#434c5a'))
        if i == ROADDASH: d.rectangle([4, 14, 28, 17], fill=hexc('#facc15'))
    elif i == SIDEWALK:
        fill('#d6d3cb'); d.line([0, 0, 31, 0], fill=hexc('#b9b5aa')); d.line([0, 0, 0, 31], fill=hexc('#b9b5aa'))
    elif i in (WOOD, RUG):
        fill('#c99a68')
        d.rectangle([0, 0, 31, 1], fill=hexc('#b5865a')); d.rectangle([0, 16, 31, 17], fill=hexc('#b5865a'))
        d.rectangle([10, 0, 11, 15], fill=hexc('#a87750')); d.rectangle([22, 16, 23, 31], fill=hexc('#a87750'))
        if i == RUG:
            ov = Image.new('RGBA', (T, T), (127, 29, 29, 105)); im.alpha_composite(ov)
    elif i == WALL:
        fill('#f3e5c8'); d.rectangle([0, 26, 31, 31], fill=hexc('#cdb48a')); d.rectangle([15, 0, 16, 25], fill=hexc('#e6d3ae'))
    elif i == STOREFLOOR:
        fill('#f8fafc'); d.rectangle([0, 0, 15, 15], fill=hexc('#e2e8f0')); d.rectangle([16, 16, 31, 31], fill=hexc('#e2e8f0'))
    elif i == FURN:
        fill('#78350f', '#4a2209')
    elif i == BED:
        fill('#93c5fd', '#3b6fb5'); d.rectangle([3, 3, 28, 12], fill=hexc('#ffffff'))
    elif i == SOFA:
        fill('#ef4444', '#991b1b')
    elif i == YELLOW:
        fill('#facc15', '#a16207')
    elif i == HOUSEWALL:
        fill('#fde68a'); d.rectangle([0, 28, 31, 31], fill=hexc('#e0c870'))
    elif i == ROOF:
        fill('#92400e', '#5b2808')
    elif i == STOREWALL:
        fill('#e0f2fe'); d.rectangle([0, 28, 31, 31], fill=hexc('#bcd9ee'))
    elif i == STOREROOF:
        fill('#1d4ed8', '#1e3a8a')
    elif i == DOOR:
        fill('#7c4a1e', '#4a2a0f'); d.rectangle([4, 4, 27, 31], outline=hexc('#a8672c'))
    elif i == RACK:
        fill('#e5e7eb', '#9ca3af')
    elif i == COUNTER:
        fill('#2563eb', '#1e3a8a')
    elif i == BUSH:
        fill('#3f8f2e', '#2c6a20')
    elif i == CABINET:
        fill('#854d0e', '#4d2c06')
    elif i == REDSTRIPE:
        fill('#dc2626', '#991b1b')
    elif i == YELSTRIPE:
        fill('#facc15')
    elif i == COLLISION:
        # penanda tabrakan (layer "blocked" disembunyikan di game)
        d.rectangle([0, 0, 31, 31], fill=(255, 0, 0, 90), outline=(255, 0, 0, 200))
    return im

sheet = Image.new('RGBA', (COLS * T, ROWS * T), (0, 0, 0, 0))
for i in range(COLS * ROWS):
    sheet.paste(tile_img(i), ((i % COLS) * T, (i // COLS) * T))
sheet.save(os.path.join(OUT, 'tilesets', 'town.png'))

# ------------------------------------------------------------ sprite Jack
SKIN, HAIR, SHIRT, PANTS, EYE = '#f1c27d', '#2b2b2b', '#3b82f6', '#1f2937', '#000000'

def jack(direction, step=0, bell=None):
    """step 0..3 untuk jalan; bell = 0/1 untuk animasi lonceng (None = tidak)."""
    im = Image.new('RGBA', (24, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    bob = -1 if step in (1, 3) else 0
    # kaki
    l_off = -1 if step == 1 else 0
    r_off = -1 if step == 3 else 0
    d.rectangle([6, 24 + l_off, 10, 31 + l_off], fill=hexc(PANTS))
    d.rectangle([13, 24 + r_off, 17, 31 + r_off], fill=hexc(PANTS))
    # badan
    d.rounded_rectangle([3, 14 + bob, 20, 24 + bob], radius=3, fill=hexc(SHIRT))
    # kepala
    if direction == 'down':
        d.rounded_rectangle([5, 0 + bob, 18, 7 + bob], radius=3, fill=hexc(HAIR))
        d.rounded_rectangle([6, 4 + bob, 17, 13 + bob], radius=3, fill=hexc(SKIN))
        d.rectangle([9, 8 + bob, 10, 9 + bob], fill=hexc(EYE)); d.rectangle([13, 8 + bob, 14, 9 + bob], fill=hexc(EYE))
    elif direction == 'up':
        d.rounded_rectangle([5, 0 + bob, 18, 13 + bob], radius=4, fill=hexc(HAIR))
    else:
        flip = direction == 'right'
        x0 = 7 if flip else 5
        d.rounded_rectangle([x0 - 1, 0 + bob, x0 + 13, 8 + bob], radius=3, fill=hexc(HAIR))
        d.rounded_rectangle([x0 + (3 if flip else 1), 4 + bob, x0 + (11 if flip else 9), 13 + bob], radius=3, fill=hexc(SKIN))
        ex = x0 + (9 if flip else 3)
        d.rectangle([ex, 8 + bob, ex + 1, 9 + bob], fill=hexc(EYE))
    # lengan + lonceng
    if bell is not None:
        d.rectangle([19, 7 + bob, 21, 15 + bob], fill=hexc(SKIN))
        by = 3 if bell else 5
        d.ellipse([18, by, 23, by + 5], fill=hexc('#facc15'), outline=hexc('#a16207'))
    return im

DIRS = ['down', 'up', 'left', 'right']
stand = Image.new('RGBA', (24 * 4, 32), (0, 0, 0, 0))
for i, dr in enumerate(DIRS): stand.paste(jack(dr), (i * 24, 0))
stand.save(os.path.join(OUT, 'sprites', 'jack-standing.png'))

walk = Image.new('RGBA', (24 * 4, 32 * 4), (0, 0, 0, 0))
for r, dr in enumerate(DIRS):
    for c in range(4): walk.paste(jack(dr, c), (c * 24, r * 32))
walk.save(os.path.join(OUT, 'sprites', 'jack-walking.png'))

ring = Image.new('RGBA', (24 * 2, 32 * 4), (0, 0, 0, 0))
for r, dr in enumerate(DIRS):
    for c in range(2): ring.paste(jack(dr, 0, bell=c), (c * 24, r * 32))
ring.save(os.path.join(OUT, 'sprites', 'jack-cowbell.png'))

# ------------------------------------------------------------ peta Tiled
class TiledMap:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.bg = [0] * (w * h)
        self.blocked = [0] * (w * h)
        self.objects = {}   # nama layer -> daftar objek
        self.oid = 1

    def fill_bg(self, tx, ty, tw, th, idx):
        for y in range(ty, ty + th):
            for x in range(tx, tx + tw):
                self.bg[y * self.w + x] = idx + 1

    def block(self, tx, ty, tw, th):
        for y in range(ty, ty + th):
            for x in range(tx, tx + tw):
                self.blocked[y * self.w + x] = COLLISION + 1

    def solid(self, tx, ty, tw, th, idx):
        self.fill_bg(tx, ty, tw, th, idx); self.block(tx, ty, tw, th)

    def add(self, layer, tx, ty, tw, th, name='', **props):
        plist = [{'name': k, 'type': ('int' if isinstance(v, int) and not isinstance(v, bool) else 'float' if isinstance(v, float) else 'string'), 'value': v} for k, v in props.items()]
        obj = {'id': self.oid, 'name': name, 'type': '', 'x': tx * T, 'y': ty * T, 'width': tw * T, 'height': th * T,
               'rotation': 0, 'visible': True, 'properties': plist}
        self.oid += 1
        self.objects.setdefault(layer, []).append(obj)

    def save(self, name):
        layers = []
        lid = 1
        for lname, data in (('background', self.bg), ('blocked', self.blocked)):
            layers.append({'id': lid, 'name': lname, 'type': 'tilelayer', 'width': self.w, 'height': self.h,
                           'x': 0, 'y': 0, 'opacity': 1, 'visible': True, 'data': data})
            lid += 1
        for lname in ('decor', 'labels', 'interactions', 'exits', 'vehicles'):
            layers.append({'id': lid, 'name': lname, 'type': 'objectgroup', 'draworder': 'topdown', 'x': 0, 'y': 0,
                           'opacity': 1, 'visible': True, 'objects': self.objects.get(lname, [])})
            lid += 1
        doc = {
            'compressionlevel': -1, 'width': self.w, 'height': self.h, 'tilewidth': T, 'tileheight': T,
            'infinite': False, 'orientation': 'orthogonal', 'renderorder': 'right-down', 'type': 'map',
            'version': '1.10', 'tiledversion': '1.10.2', 'nextlayerid': lid, 'nextobjectid': self.oid,
            'layers': layers,
            'tilesets': [{'firstgid': 1, 'name': 'town', 'image': '../tilesets/town.png', 'imagewidth': COLS * T,
                          'imageheight': ROWS * T, 'columns': COLS, 'tilecount': COLS * ROWS,
                          'tilewidth': T, 'tileheight': T, 'margin': 0, 'spacing': 0}],
        }
        with open(os.path.join(OUT, 'maps', name + '.json'), 'w') as f:
            json.dump(doc, f)

def info(m, tx, ty, tw, th, tile, id_, label, emoji, size=None):
    m.solid(tx, ty, tw, th, tile)
    props = dict(kind='info', id=id_, label=label, emoji=emoji)
    if size: props['fontSize'] = size
    m.add('interactions', tx, ty, tw, th, id_, **props)

# ---- RUMAH (20 x 15)
h = TiledMap(20, 15)
h.fill_bg(0, 0, 20, 15, WOOD)
h.fill_bg(6, 9, 8, 4, RUG)
h.solid(0, 0, 20, 2, WALL)
info(h, 1, 2, 2, 3, BED, 'bed', 'Tempat tidur: tentang saya', '🛏️')
info(h, 5, 2, 3, 1, FURN, 'shelf', 'Rak buku: pendidikan', '📚', 24)
info(h, 12, 2, 3, 2, FURN, 'desk', 'Meja kerja: skill', '💻')
info(h, 17, 2, 2, 2, CABINET, 'trophy', 'Lemari piala: pencapaian', '🏆')
info(h, 2, 10, 3, 2, SOFA, 'sofa', 'Sofa: hobi', '🛋️')
h.solid(18, 8, 1, 1, YELLOW)
h.add('interactions', 18, 8, 1, 1, 'meter', kind='meter', id='meter', label='Cek meteran listrik', emoji='⚡', fontSize=22)
h.solid(13, 6, 3, 2, FURN); h.add('decor', 13, 6, 3, 2, 'meja-makan', emoji='🍽️')
h.solid(9, 2, 1, 1, WOOD); h.add('decor', 9, 2, 1, 1, 'tanaman', emoji='🪴', fontSize=26)
h.add('decor', 10, 1, 1, 1, 'lukisan', emoji='🖼️', fontSize=26)
h.fill_bg(9, 14, 2, 1, DOOR)
h.add('labels', 9, 14, 2, 1, 'label-pintu', text='KELUAR', color='#fde68a', fontSize=11)
h.add('exits', 9, 14, 2, 1, 'ke-jalan', target='street', direction='down')
h.save('house')

# ---- JALAN (40 x 15)
s = TiledMap(40, 15)
s.fill_bg(0, 0, 40, 15, GRASS)
s.fill_bg(0, 7, 40, 1, SIDEWALK); s.fill_bg(0, 8, 40, 3, ROAD); s.fill_bg(0, 11, 40, 1, SIDEWALK)
for x in range(0, 40, 2): s.fill_bg(x, 9, 1, 1, ROADDASH)
s.fill_bg(5, 5, 1, 2, SIDEWALK); s.fill_bg(33, 5, 1, 2, SIDEWALK)

def building(tx, ty, tw, th, wall, roof, name, door_tx, label_color='#ffffff'):
    s.solid(tx, ty, tw, th, wall)
    s.fill_bg(tx, ty, tw, 1, roof)
    s.fill_bg(door_tx, ty + th - 1, 1, 1, DOOR)
    s.add('labels', tx, ty, tw, 1, 'label-' + name, text=name, color=label_color, fontSize=16, bold=1)

building(2, 1, 7, 4, HOUSEWALL, ROOF, 'RUMAH SAYA', 5)
building(29, 1, 9, 4, STOREWALL, STOREROOF, 'INDOMARET', 33, '#fde047')
s.fill_bg(29, 2, 9, 1, REDSTRIPE)
s.add('decor', 33, 3, 2, 1, 'troli', emoji='🛒', fontSize=26)
s.add('exits', 5, 5, 1, 1, 'ke-rumah', target='house', direction='up')
s.add('exits', 33, 5, 1, 1, 'ke-indomaret', target='store', direction='up')

for tx, ty in [(11, 2), (12, 4), (15, 1), (16, 5), (20, 2), (23, 4), (26, 2), (27, 5), (1, 6), (1, 13), (6, 13),
               (10, 13), (15, 12), (19, 13), (24, 13), (28, 12), (34, 13), (38, 12), (39, 6)]:
    s.block(tx, ty, 1, 1)
    s.add('decor', tx, ty, 1, 1, 'pohon', emoji='🌳', fontSize=40)

s.block(7, 6, 1, 1); s.add('interactions', 7, 6, 1, 1, 'sign', kind='info', id='sign', label='Baca papan petunjuk', emoji='🪧', fontSize=28)
s.block(20, 12, 1, 1); s.add('interactions', 20, 12, 1, 1, 'cat', kind='info', id='cat', label='Elus kucing', emoji='🐈', fontSize=26)
for emoji, row, d_, delay in [('🚗', 8.55, 'left', 0), ('🚙', 8.55, 'left', 5200), ('🚕', 10.45, 'right', 1800), ('🚌', 10.45, 'right', 6500)]:
    s.add('vehicles', 0, row - 0.5, 1, 1, 'kendaraan', emoji=emoji, direction=d_, delay=delay, duration=11000)
s.save('street')

# ---- INDOMARET (20 x 15)
r = TiledMap(20, 15)
r.fill_bg(0, 0, 20, 15, STOREFLOOR)
r.solid(0, 0, 20, 2, STOREROOF); r.fill_bg(0, 1, 20, 1, REDSTRIPE)
r.add('labels', 0, 0, 20, 1, 'label-toko', text='INDOMARET', color='#fde047', fontSize=22, bold=1)
# 12 slot rak: id p1..p12, diisi dari items di src/data/content.ts
for i in range(12):
    col = 2 + (i % 6) * 3
    row = 2 if i < 6 else 6
    r.solid(col, row, 2, 1, RACK)
    r.add('interactions', col, row, 2, 1, 'rak-p%d' % (i + 1), kind='item', id='p%d' % (i + 1))
r.solid(2, 9, 6, 1, RACK); r.add('decor', 2, 9, 6, 1, 'minuman', emoji='🥤', fontSize=22)
r.solid(14, 10, 5, 2, COUNTER)
r.add('interactions', 14, 10, 5, 2, 'kasir', kind='kasir', id='kasir', label='Bayar di kasir', emoji='🧾')
r.add('decor', 16, 8.7, 1, 1, 'kasir-orang', emoji='🧑‍💼', fontSize=30)
r.fill_bg(9, 14, 2, 1, DOOR)
r.add('labels', 9, 14, 2, 1, 'label-pintu', text='KELUAR', color='#e5e7eb', fontSize=11)
r.add('exits', 9, 14, 2, 1, 'ke-jalan', target='street', direction='down')
r.save('store')
print('selesai')
