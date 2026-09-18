const PALETTE = {
  '.': null,
  k: '#241a2b',
  r: '#e0453e',
  R: '#a32b28',
  b: '#d9a441',
  B: '#a9762a',
  s: '#f0c090',
  u: '#c98c5a',
  i: '#8a5a34',
  t: '#c94f4f',
  T: '#96343a',
  o: '#e8c25a',
  O: '#8a5f1e',
  n: '#6b4a2a',
  w: '#f4f0e6',
  h: '#4a3626',
  H: '#2a1d13',
  j: '#463c56',
  J: '#2a2333',
  m: '#dfe3ea',
  M: '#9aa0ab',
  W: '#c9c4b6',
  c: '#4a8fd4',
  C: '#2f5f96',
  g: '#4fa06a',
  G: '#2f6b46',
  p: '#b061c0',
  P: '#7a3d8a',
  y: '#e8c84a',
  Y: '#a88a1e',
  e: '#e07a3e',
  E: '#a04f22',
  z: '#3b4a63',
  Z: '#222b3b',
  x: '#2e2e34',
  X: '#1a1a1e',
};

const SPARTAN_RUN_0 = [
  '....RrrrrrR...m.',
  '...RrrrrrrrR.mMm',
  '..RrrrrrrrrRmMm.',
  '..kRrrrrrrrRk.M.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbkkkk.n.',
  '...kbbbbbbbbk.n.',
  '....kbbbbbbk..n.',
  '...kkkTTTTkk..n.',
  '..kOkTTTTTTTk.n.',
  '.kOokTTTTTTTksn.',
  '.kOokkTTTTTk..n.',
  '..kOkksssskk..n.',
  '....knnkknnk..n.',
  '.....kk..kk.....',
];

const SPARTAN_RUN_1 = [
  '....RrrrrrR...m.',
  '...RrrrrrrrR.mMm',
  '..RrrrrrrrrRmMm.',
  '..kRrrrrrrrRk.M.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbkkkk.n.',
  '...kbbbbbbbbk.n.',
  '....kbbbbbbk..n.',
  '...kkkTTTTkk..n.',
  '..kOkTTTTTTTk.n.',
  '.kOokTTTTTTTksn.',
  '.kOokkTTTTTk..n.',
  '..kOkksssskk..n.',
  '...knnkk.knnk.n.',
  '...kkk.....kk...',
];

// De frente (quieto): la cresta se ve de canto (una linea vertical, no la silueta
// de perfil) y se ve la ranura en T del casco corintio (ojos + nariz).
const SPARTAN_FRONT = [
  '.......RR.....m.',
  '.......rr....mMm',
  '......Rrrr..mMm.',
  '......rrrr....M.',
  '.....kbbbbk...n.',
  '....kbbbbbbk..n.',
  '....kkkkkkkk..n.',
  '....bbbkkbbb..n.',
  '....bbbkkbbb..n.',
  '...kkBBBBBBkk.n.',
  '.mkBBBBBBBBBBkn.',
  '.skTtytTtttk.sn.',
  '.skTtttTtttk..n.',
  '..kOOOOOOOOk.sn.',
  '..ksssssssssk.n.',
  '..knnnk..knnnk..',
];

const SPARTAN_JUMP = [
  '....RrrrrrR.....',
  '...RrrrrrrrR.m..',
  '..RrrrrrrrrRmMm.',
  '..kRrrrrrrrRkMm.',
  '...kbbbbbbbbkM..',
  '...kbbbbbbbbkn..',
  '...kbbbbbkkkkn..',
  '...kbbbbbbbbkn..',
  '....kbbbbbbk.n..',
  '...kkkTTTTkkn...',
  '..kOkTTTTTTTk...',
  '.kOokTTTTTTTks..',
  '.kOokkTTTTTk....',
  '..kOkkssssk.....',
  '..knnk..knnk....',
  '.kkk......kkk...',
];

function rep(ch, n) {
  return new Array(n + 1).join(ch);
}

function buildStand(st) {
  const s = st.skin || 's';
  const pants = st.pants || 'C';
  const hair = st.hair;
  const hD = st.hairDark;
  const sh = st.shirt;
  const shD = st.shirtDark;
  return [
    '................',
    '.....kkkkkk.....',
    '....k' + hD + rep(hair, 4) + hD + 'k....',
    '...k' + hD + rep(hair, 6) + hD + 'k...',
    '...k' + hair + rep(s, 2) + rep(hair, 2) + rep(s, 2) + hair + 'k...',
    '...k' + rep(s, 8) + 'k...',
    '...k' + rep(s, 2) + 'k' + rep(s, 2) + 'k' + rep(s, 2) + 'k...',
    '....k' + rep(s, 6) + 'k....',
    '.....k' + rep(s, 5) + 'k....',
    '..kk' + rep(sh, 8) + 'kk..',
    '.k' + s + rep(sh, 10) + s + 'k.',
    '.k' + s + rep(sh, 10) + s + 'k.',
    '.kk' + rep(shD, 10) + 'kk.',
    '...k' + rep(pants, 8) + 'k...',
    '...knnk..knnk...',
    '...kkk...kkk....',
  ];
}

function buildStandLong(st) {
  const s = st.skin || 's';
  const pants = st.pants || 'C';
  const hair = st.hair;
  const hD = st.hairDark;
  const sh = st.shirt;
  const shD = st.shirtDark;
  return [
    '................',
    '.....kkkkkk.....',
    '....k' + hD + rep(hair, 4) + hD + 'k....',
    '...k' + hD + rep(hair, 6) + hD + 'k...',
    '...k' + hair + rep(s, 2) + rep(hair, 2) + rep(s, 2) + hair + 'k...',
    '...k' + hair + rep(s, 6) + hair + 'k...',
    '...k' + hair + s + 'k' + rep(s, 2) + 'k' + s + hair + 'k...',
    '...k' + hair + rep(s, 6) + hair + 'k...',
    '....k' + hair + rep(s, 3) + hair + 'k.....',
    '..k' + hair + rep(sh, 8) + hair + 'k..',
    '.k' + hair + rep(sh, 10) + hair + 'k.',
    '.k' + s + rep(sh, 10) + s + 'k.',
    '.kk' + rep(shD, 10) + 'kk.',
    '...k' + rep(pants, 8) + 'k...',
    '...knnk..knnk...',
    '...kkk...kkk....',
  ];
}

// Retoques para personalizar a cada dev: parado (Felipe), crespo (Nicolas),
// lentes (Felipe), audifonos (Daniel). Se aplican sobre las filas ya armadas.
function spikyHair(rows, hair, hD) {
  rows[0] = '..' + hD + '.' + hair + '.' + hD + '.' + hair + '.' + hD + '.....';
  return rows;
}

function curlyHair(rows, hair, hD) {
  rows[0] = '..' + hair + hD + '.' + hD + hair + '.' + hair + hD + '......';
  rows[2] = '...' + hD + hair + hair + hD + hair + hair + hD + hair + 'k....';
  return rows;
}

function addGlasses(rows) {
  rows[6] = '...ksMMMsMMMk...';
  return rows;
}

function addHeadset(rows) {
  rows[0] = '....WWWWWWWW....';
  rows[3] = 'W..' + rows[3].slice(3, 13) + '..W';
  rows[4] = 'W..' + rows[4].slice(3, 13) + '..W';
  return rows;
}

// Los 5 del equipo de desarrollo, para la escena final.
// Rasgos genéricos por ahora; Diana es la del pelo largo.
const DEV_STYLES = {
  // Todos castaños (h/H). Daniel: mas ancho, headset, piel blanca.
  // Diana: mas alta, morena. Felipe: lentes, pelo parado. Guillermo: saco negro.
  // Nicolas: crespo. El ancho/alto de Daniel y Diana se aplica al dibujar en el final.
  daniel: { hair: 'h', hairDark: 'H', shirt: 'c', shirtDark: 'C', skin: 's', pants: 'Z', headset: true, wide: true },
  diana: { hair: 'h', hairDark: 'H', shirt: 'p', shirtDark: 'P', skin: 'u', pants: 'Z', long: true, tall: true },
  nicolas: { hair: 'h', hairDark: 'H', shirt: 'g', shirtDark: 'G', skin: 's', pants: 'Z', curly: true },
  guillermo: { hair: 'h', hairDark: 'H', shirt: 'x', shirtDark: 'X', skin: 'i', pants: 'X' },
  felipe: { hair: 'h', hairDark: 'H', shirt: 't', shirtDark: 'T', skin: 'u', pants: 'Z', glasses: true, spiky: true },
};

const SPRITES = {
  spartanRun: [SPARTAN_RUN_0, SPARTAN_RUN_1],
  spartanFront: [SPARTAN_FRONT],
  spartanJump: [SPARTAN_JUMP],
};

Object.keys(DEV_STYLES).forEach(function (key) {
  const st = DEV_STYLES[key];
  let rows = st.long ? buildStandLong(st) : buildStand(st);
  if (st.spiky) rows = spikyHair(rows, st.hair, st.hairDark);
  if (st.curly) rows = curlyHair(rows, st.hair, st.hairDark);
  if (st.glasses) rows = addGlasses(rows);
  if (st.headset) rows = addHeadset(rows);
  SPRITES[key] = [rows];
});

const spriteCache = {};

function makeSpriteCanvas(frame) {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const g = c.getContext('2d');
  frame.forEach(function (row, y) {
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (!color) continue;
      g.fillStyle = color;
      g.fillRect(x, y, 1, 1);
    }
  });
  return c;
}

function getSprite(name, frame) {
  const id = name + ':' + frame;
  if (!spriteCache[id]) spriteCache[id] = makeSpriteCanvas(SPRITES[name][frame]);
  return spriteCache[id];
}

function drawSprite(ctx, name, frame, x, y, flip) {
  if (!SPRITES[name]) return;
  const img = getSprite(name, frame);
  if (!flip) {
    ctx.drawImage(img, Math.round(x), Math.round(y));
    return;
  }
  ctx.save();
  ctx.translate(Math.round(x) + 16, Math.round(y));
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PALETTE, SPRITES, DEV_STYLES };
}
