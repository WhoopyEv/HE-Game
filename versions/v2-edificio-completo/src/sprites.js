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
  S: '#c68f5e',
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
  q: '#3fa89a',
  Q: '#27766e',
  z: '#3b4a63',
  Z: '#222b3b',
  v: '#8a8f98',
  V: '#5a5f68',
  a: '#dcd6c8',
  A: '#a9a293',
  x: '#2c3e6b',
  X: '#1b2847',
  f: '#2e2e34',
  F: '#1a1a1e',
  l: '#1c1a24',
  L: '#0f0e14',
  d: '#8fd4e8',
  D: '#5aa6c0',
};

const SPARTAN_DOWN_0 = [
  '......RrrR....m.',
  '......RrrR...mMm',
  '.....RrrrrR..mMm',
  '...kkbbbbbbkk.M.',
  '...kbbbbbbbbk.n.',
  '...kbkkbbkkbk.n.',
  '...kbkkbbkkbk.n.',
  '...kbbbkkbbbk.n.',
  '....kbbkkbbk..n.',
  '....kkTTTTkk..n.',
  '.kOOkTTTTTTk..n.',
  'kOooOkTTTTTkssn.',
  'kOoyoOTTTTTk..n.',
  'kOooOkssssk...n.',
  '.kOOknnkknnk..n.',
  '..kk.kk..kk.....',
];

const SPARTAN_DOWN_1 = [
  '......RrrR....m.',
  '......RrrR...mMm',
  '.....RrrrrR..mMm',
  '...kkbbbbbbkk.M.',
  '...kbbbbbbbbk.n.',
  '...kbkkbbkkbk.n.',
  '...kbkkbbkkbk.n.',
  '...kbbbkkbbbk.n.',
  '....kbbkkbbk..n.',
  '....kkTTTTkk..n.',
  '.kOOkTTTTTTk..n.',
  'kOooOkTTTTTkssn.',
  'kOoyoOTTTTTk..n.',
  'kOooOkssssk...n.',
  '.kOOnnk.knnk..n.',
  '..kkk.....kk....',
];

const SPARTAN_UP_0 = [
  '......RrrR....m.',
  '......RrrR...mMm',
  '.....RrrrrR..mMm',
  '...kkbbbbbbkk.M.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbbbbk.n.',
  '...kBbbbbbbBk.n.',
  '...kBBBBBBBBk.n.',
  '....kBBBBBBk..n.',
  '....kkTTTTkk..n.',
  '.kOOkTTTTTTk..n.',
  'kOooOkTTTTTkssn.',
  'kOoyoOTTTTTk..n.',
  'kOooOkssssk...n.',
  '.kOOknnkknnk..n.',
  '..kk.kk..kk.....',
];

const SPARTAN_UP_1 = [
  '......RrrR....m.',
  '......RrrR...mMm',
  '.....RrrrrR..mMm',
  '...kkbbbbbbkk.M.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbbbbk.n.',
  '...kBbbbbbbBk.n.',
  '...kBBBBBBBBk.n.',
  '....kBBBBBBk..n.',
  '....kkTTTTkk..n.',
  '.kOOkTTTTTTk..n.',
  'kOooOkTTTTTkssn.',
  'kOoyoOTTTTTk..n.',
  'kOooOkssssk...n.',
  '.kOOnnk.knnk..n.',
  '..kkk.....kk....',
];

const SPARTAN_SIDE_0 = [
  '....RrrrrrR...m.',
  '...RrrrrrrrR.mMm',
  '..RrrrrrrrrRmMm.',
  '..kRrrrrrrrRk.M.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbkksk.n.',
  '...kbbbbbkksk.n.',
  '...kbbbbbbbsk.n.',
  '....kbbbbbbk..n.',
  '...kkkTTTTkk..n.',
  '..kOkTTTTTTTk.n.',
  '.kOokTTTTTTTksn.',
  '.kOokkTTTTTk..n.',
  '..kOkksssskk..n.',
  '....knnkknnk..n.',
  '.....kk..kk.....',
];

const SPARTAN_SIDE_1 = [
  '....RrrrrrR...m.',
  '...RrrrrrrrR.mMm',
  '..RrrrrrrrrRmMm.',
  '..kRrrrrrrrRk.M.',
  '...kbbbbbbbbk.n.',
  '...kbbbbbkksk.n.',
  '...kbbbbbkksk.n.',
  '...kbbbbbbbsk.n.',
  '....kbbbbbbk..n.',
  '...kkkTTTTkk..n.',
  '..kOkTTTTTTTk.n.',
  '.kOokTTTTTTTksn.',
  '.kOokkTTTTTk..n.',
  '..kOkksssskk..n.',
  '...knnkk.knnk.n.',
  '...kkk.....kk...',
];

function rep(ch, n) {
  return new Array(n + 1).join(ch);
}

function buildSit(st) {
  const s = st.skin || 's';
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
    '.....k' + rep(s, 4) + 'k.....',
    '..kk' + rep(sh, 8) + 'kk..',
    '.k' + s + rep(sh, 10) + s + 'k.',
    '.k' + s + rep(sh, 10) + s + 'k.',
    '.k' + shD + rep(sh, 10) + shD + 'k.',
    '.kk' + rep(shD, 10) + 'kk.',
    '..kk' + rep(shD, 8) + 'kk..',
    '....' + rep('k', 8) + '....',
  ];
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


function buildSitLong(st) {
  const s = st.skin || 's';
  const hair = st.hair;
  const hD = st.hairDark;
  const sh = st.shirt;
  const shD = st.shirtDark;
  return [
    '................',
    '..' + rep(hD, 12) + '..',
    '..' + hD + rep(hair, 10) + hD + '..',
    '..' + hD + rep(hair, 10) + hD + '..',
    '..' + hair + 'k' + rep(s, 2) + rep(hair, 4) + rep(s, 2) + 'k' + hair + '..',
    '..' + hair + 'k' + rep(s, 8) + 'k' + hair + '..',
    '..' + hair + 'k' + s + 'k' + rep(s, 4) + 'k' + s + 'k' + hair + '..',
    '..' + hair + 'k' + rep(s, 8) + 'k' + hair + '..',
    '...' + hair + 'k' + rep(s, 6) + 'k' + hair + '...',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '..k' + rep(shD, 10) + 'k..',
    '..kk' + rep(shD, 8) + 'kk..',
    '....' + rep('k', 8) + '....',
  ];
}

function buildStandLong(st) {
  const s = st.skin || 's';
  const skirt = st.pants || 'C';
  const hair = st.hair;
  const hD = st.hairDark;
  const sh = st.shirt;
  const shD = st.shirtDark;
  return [
    '................',
    '..' + rep(hD, 12) + '..',
    '..' + hD + rep(hair, 10) + hD + '..',
    '..' + hair + 'k' + rep(s, 2) + rep(hair, 4) + rep(s, 2) + 'k' + hair + '..',
    '..' + hair + 'k' + rep(s, 8) + 'k' + hair + '..',
    '..' + hair + 'k' + s + 'k' + rep(s, 4) + 'k' + s + 'k' + hair + '..',
    '..' + hair + 'k' + rep(s, 8) + 'k' + hair + '..',
    '...' + hair + 'k' + rep(s, 6) + 'k' + hair + '...',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    // el pelo sigue cayendo hasta la cadera, para que se note largo y no a la altura del hombro.
    '.' + hair + 'k' + rep(shD, 10) + 'k' + hair + '.',
    '.k' + rep(skirt, 12) + 'k.',
    'k' + rep(skirt, 14) + 'k',
    '...k' + rep(s, 3) + 'kk' + rep(s, 3) + 'k...',
    '...knnk..knnk...',
  ];
}

// Igual que la anterior pero con el torso más largo y la cabeza más arriba:
// se ve más alta sin agrandarle la cabeza.
function buildStandTall(st) {
  const s = st.skin || 's';
  const skirt = st.pants || 'C';
  const hair = st.hair;
  const hD = st.hairDark;
  const sh = st.shirt;
  const shD = st.shirtDark;
  return [
    '..' + rep(hD, 12) + '..',
    '..' + hD + rep(hair, 10) + hD + '..',
    '..' + hair + 'k' + rep(s, 2) + rep(hair, 4) + rep(s, 2) + 'k' + hair + '..',
    '..' + hair + 'k' + rep(s, 8) + 'k' + hair + '..',
    '..' + hair + 'k' + s + 'k' + rep(s, 4) + 'k' + s + 'k' + hair + '..',
    '..' + hair + 'k' + rep(s, 8) + 'k' + hair + '..',
    '...' + hair + 'k' + rep(s, 6) + 'k' + hair + '...',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(sh, 10) + 'k' + hair + '.',
    '.' + hair + 'k' + rep(shD, 10) + 'k' + hair + '.',
    '.k' + rep(skirt, 12) + 'k.',
    'k' + rep(skirt, 14) + 'k',
    '...k' + rep(s, 3) + 'kk' + rep(s, 3) + 'k...',
    '...knnk..knnk...',
  ];
}

function personSit(st) {
  return st.long ? buildSitLong(st) : buildSit(st);
}

function personStand(st) {
  if (st.tallBody) return buildStandTall(st);
  return st.long ? buildStandLong(st) : buildStand(st);
}

function buildAgentSit(st) {
  const s = st.skin || 's';
  const rows = personSit(st);
  rows[2] = '....k' + rep('c', 6) + 'k....';
  if (st.long) {
    rows[5] = '...c' + st.hair + rep(s, 6) + st.hair + 'c...';
    rows[6] = '...k' + st.hair + s + 'k' + rep(s, 2) + 'k' + s + st.hair + 'c...';
  } else {
    rows[5] = '...c' + rep(s, 8) + 'c...';
    rows[6] = '...k' + rep(s, 2) + 'k' + rep(s, 2) + 'k' + rep(s, 2) + 'c...';
  }
  return rows;
}

function buildCapPerson(st) {
  const s = st.skin || 's';
  const cap = st.cap;
  const capD = st.capDark;
  const sh = st.shirt;
  const shD = st.shirtDark;
  return [
    '................',
    '.....kkkkkk.....',
    '....k' + capD + rep(cap, 4) + capD + 'k....',
    '...k' + capD + rep(cap, 6) + capD + 'k...',
    '..k' + rep(cap, 10) + 'k..',
    '...k' + rep(s, 8) + 'k...',
    '...k' + rep(s, 2) + 'k' + rep(s, 2) + 'k' + rep(s, 2) + 'k...',
    '....k' + rep(s, 6) + 'k....',
    '.....k' + rep(s, 5) + 'k....',
    '..kk' + rep(sh, 8) + 'kk..',
    '.k' + s + rep(sh, 10) + s + 'k.',
    '.k' + s + rep(sh, 10) + s + 'k.',
    '.kk' + rep(shD, 10) + 'kk.',
    '...k' + rep(shD, 8) + 'k...',
    '...knnk..knnk...',
    '...kkk...kkk....',
  ];
}

const AGENT_STYLES = [
  { hair: 'h', hairDark: 'H', shirt: 'c', shirtDark: 'C', skin: 's' },
  { hair: 'H', hairDark: 'k', shirt: 't', shirtDark: 'T', skin: 'u', long: true },
  { hair: 'e', hairDark: 'E', shirt: 'g', shirtDark: 'G', skin: 's' },
  { hair: 'n', hairDark: 'H', shirt: 'p', shirtDark: 'P', skin: 'u', long: true },
  { hair: 'j', hairDark: 'J', shirt: 'y', shirtDark: 'Y', skin: 'i' },
  { hair: 'h', hairDark: 'H', shirt: 'q', shirtDark: 'Q', skin: 'i', long: true },
  { hair: 'b', hairDark: 'B', shirt: 'c', shirtDark: 'C', skin: 's', long: true },
  { hair: 'H', hairDark: 'k', shirt: 'w', shirtDark: 'W', skin: 'u' },
  { hair: 'n', hairDark: 'H', shirt: 'e', shirtDark: 'E', skin: 's', long: true },
  { hair: 'H', hairDark: 'k', shirt: 'g', shirtDark: 'G', skin: 'i' },
  { hair: 'e', hairDark: 'E', shirt: 'p', shirtDark: 'P', skin: 'u' },
  { hair: 'h', hairDark: 'H', shirt: 'y', shirtDark: 'Y', skin: 's', long: true },
];

const STAFF_STYLES = [
  { hair: 'h', hairDark: 'H', shirt: 'w', shirtDark: 'W', skin: 's' },
  { hair: 'H', hairDark: 'k', shirt: 'p', shirtDark: 'P', skin: 'u', long: true },
  { hair: 'e', hairDark: 'E', shirt: 'c', shirtDark: 'C', skin: 's', long: true },
  { hair: 'j', hairDark: 'J', shirt: 't', shirtDark: 'T', skin: 'i' },
];

const SUP_STYLES = [
  { hair: 'H', hairDark: 'k', shirt: 'z', shirtDark: 'Z', skin: 's', pants: 'Z' },
  { hair: 'h', hairDark: 'H', shirt: 'a', shirtDark: 'A', skin: 'u', pants: 'Z', long: true },
  { hair: 'n', hairDark: 'H', shirt: 'v', shirtDark: 'V', skin: 'i', pants: 'Z' },
  { hair: 'e', hairDark: 'E', shirt: 'w', shirtDark: 'W', skin: 's', pants: 'Z', long: true },
];

const NAMED_STYLES = {
  marce: { hair: 'b', hairDark: 'B', shirt: 'x', shirtDark: 'X', skin: 's', pants: 'X', long: true },
  recep: { hair: 'c', hairDark: 'C', shirt: 'c', shirtDark: 'C', skin: 's', long: true },
  josue: { hair: 'h', hairDark: 'H', shirt: 'r', shirtDark: 'R', skin: 'i', pants: 'Z' },
  sebastian: { hair: 'b', hairDark: 'B', shirt: 'y', shirtDark: 'Y', skin: 's' },
  sergio: { hair: 'H', hairDark: 'k', shirt: 'w', shirtDark: 'W', skin: 's', pants: 'Z' },
  mgr3: { hair: 'h', hairDark: 'H', shirt: 'c', shirtDark: 'C', skin: 's', pants: 'Z' },
  mgr4: { hair: 'e', hairDark: 'E', shirt: 'p', shirtDark: 'P', skin: 'u', pants: 'Z', long: true },
  mgr5: { hair: 'H', hairDark: 'k', shirt: 'g', shirtDark: 'G', skin: 'i', pants: 'Z' },
  mgr6: { hair: 'j', hairDark: 'J', shirt: 'y', shirtDark: 'Y', skin: 's', pants: 'Z', long: true },
  mgr7: { hair: 'n', hairDark: 'H', shirt: 't', shirtDark: 'T', skin: 'u', pants: 'Z' },
  mgrTi: { hair: 'H', hairDark: 'k', shirt: 'q', shirtDark: 'Q', skin: 'u', pants: 'Z' },
  mgrRh1: { hair: 'e', hairDark: 'E', shirt: 'w', shirtDark: 'W', skin: 's', pants: 'Z', long: true },
  mgrRh2: { hair: 'h', hairDark: 'H', shirt: 'p', shirtDark: 'P', skin: 'i', pants: 'Z' },
  mgrRh3: { hair: 'j', hairDark: 'J', shirt: 'c', shirtDark: 'C', skin: 'u', pants: 'Z', long: true },
  brandon: { hair: 'H', hairDark: 'k', shirt: 'o', shirtDark: 'O', skin: 'u', pants: 'Z' },
};

// --- el equipo de desarrollo ---
// Retoques sobre las filas ya armadas para que cada uno se reconozca:
// pelo parado (Felipe), crespo (Nicolás), lentes (Felipe), diadema (Daniel).
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

// Bigote de Felipe: una barra oscura justo debajo de la nariz.
function addMustache(rows) {
  rows[7] = rows[7].slice(0, 6) + 'kkkk' + rows[7].slice(10);
  return rows;
}

function addHeadset(rows, band, shade) {
  const b = band || 'c';
  const d = shade || 'C';
  rows[1] = '...' + rep(b, 10) + '...';
  rows[2] = '..' + b + d + rows[2].slice(4, 12) + d + b + '..';
  rows[4] = '.' + b + d + rows[4].slice(3, 13) + d + b + '.';
  rows[5] = '.' + b + d + rows[5].slice(3, 13) + d + b + '.';
  rows[6] = '.' + b + d + rows[6].slice(3, 13) + d + b + '.';
  return rows;
}

// Diana es más alta y Daniel más ancho: eso se aplica al dibujar (characters.js),
// no en el sprite, para no deformar la cuadrícula de 16x16.
const DEV_STYLES = {
  daniel: { hair: 'h', hairDark: 'H', shirt: 'c', shirtDark: 'C', skin: 's', pants: 'Z', headset: 'd', headsetShade: 'D', wide: true },
  diana: { hair: 'l', hairDark: 'L', shirt: 'p', shirtDark: 'P', skin: 's', pants: 'Z', long: true, tallBody: true },
  nicolas: { hair: 'h', hairDark: 'H', shirt: 'g', shirtDark: 'G', skin: 's', pants: 'Z', curly: true },
  guillermo: { hair: 'l', hairDark: 'L', shirt: 'f', shirtDark: 'F', skin: 'u', pants: 'F' },
  // Calvo: el pelo se pinta del mismo tono de piel, así queda liso y sin
  // silueta de cabello (con lentes y bigote para reconocerlo igual).
  felipe: { hair: 's', hairDark: 'u', shirt: 't', shirtDark: 'T', skin: 's', pants: 'Z', glasses: true, mustache: true },
};

function devFrame(st, sitting) {
  let rows = sitting ? personSit(st) : personStand(st);
  if (st.spiky) rows = spikyHair(rows, st.hair, st.hairDark);
  if (st.curly) rows = curlyHair(rows, st.hair, st.hairDark);
  if (st.glasses) rows = addGlasses(rows);
  if (st.mustache) rows = addMustache(rows);
  if (st.headset) rows = addHeadset(rows, st.headset, st.headsetShade);
  return rows;
}

const SPRITES = {
  spartanDown: [SPARTAN_DOWN_0, SPARTAN_DOWN_1],
  spartanUp: [SPARTAN_UP_0, SPARTAN_UP_1],
  spartanSide: [SPARTAN_SIDE_0, SPARTAN_SIDE_1],
};

Object.keys(DEV_STYLES).forEach(function (key) {
  SPRITES[key + 'Sit'] = [devFrame(DEV_STYLES[key], true)];
  SPRITES[key + 'Stand'] = [devFrame(DEV_STYLES[key], false)];
});

AGENT_STYLES.forEach(function (st, i) {
  SPRITES['agent' + i + 'Sit'] = [buildAgentSit(st)];
  SPRITES['agent' + i + 'Stand'] = [personStand(st)];
});

STAFF_STYLES.forEach(function (st, i) {
  SPRITES['staff' + i + 'Sit'] = [personSit(st)];
  SPRITES['staff' + i + 'Stand'] = [personStand(st)];
});

SUP_STYLES.forEach(function (st, i) {
  SPRITES['sup' + i + 'Sit'] = [personSit(st)];
  SPRITES['sup' + i + 'Stand'] = [personStand(st)];
});

Object.keys(NAMED_STYLES).forEach(function (key) {
  SPRITES[key + 'Sit'] = [personSit(NAMED_STYLES[key])];
  SPRITES[key + 'Stand'] = [personStand(NAMED_STYLES[key])];
});

SPRITES.aseoStand = [
  buildCapPerson({ cap: 'x', capDark: 'X', shirt: 'x', shirtDark: 'X', skin: 's' }),
];
SPRITES.aseo2Stand = [
  buildCapPerson({ cap: 'x', capDark: 'X', shirt: 'x', shirtDark: 'X', skin: 'u' }),
];
SPRITES.aseo3Stand = [
  buildCapPerson({ cap: 'x', capDark: 'X', shirt: 'x', shirtDark: 'X', skin: 'i' }),
];
SPRITES.aseo4Stand = [
  buildCapPerson({ cap: 'x', capDark: 'X', shirt: 'x', shirtDark: 'X', skin: 's' }),
];
SPRITES.porteroStand = [
  buildCapPerson({ cap: 'v', capDark: 'V', shirt: 'v', shirtDark: 'V', skin: 'u' }),
];
SPRITES.logisticaStand = [
  buildStandLong({ hair: 'e', hairDark: 'E', shirt: 'r', shirtDark: 'R', skin: 's', pants: 'Z' }),
];
SPRITES.logistica2Stand = [
  buildStand({ hair: 'H', hairDark: 'k', shirt: 'r', shirtDark: 'R', skin: 's', pants: 'Z' }),
];

// Sergio de cupido: todo de blanco y con alas doradas grandes a los lados
// (de la nuca a la cadera, más anchas que las alitas blancas originales).
function buildCupid(st) {
  const rows = buildStand(st);
  rows[8] = 'O' + rows[8].slice(1, 15) + 'O';
  rows[9] = 'Oo' + rows[9].slice(2, 14) + 'oO';
  rows[10] = 'ooo' + rows[10].slice(3, 13) + 'ooo';
  rows[11] = 'ooo' + rows[11].slice(3, 13) + 'ooo';
  rows[12] = 'Oo' + rows[12].slice(2, 14) + 'oO';
  rows[13] = 'O' + rows[13].slice(1, 15) + 'O';
  return rows;
}

SPRITES.sergioBossStand = [
  buildCupid({ hair: 'l', hairDark: 'L', shirt: 'w', shirtDark: 'W', skin: 's', pants: 'W' }),
];
SPRITES.sergioBossSit = SPRITES.sergioBossStand;

SPRITES.pingpongAStand = [buildStand({ hair: 'H', hairDark: 'k', shirt: 'w', shirtDark: 'W', skin: 's' })];
SPRITES.pingpongBStand = [buildStand({ hair: 'n', hairDark: 'H', shirt: 't', shirtDark: 'T', skin: 'i' })];

// El de logística con cara de zorro: mismo cuerpo, cabeza de zorro.
function buildFox(st) {
  const rows = buildStand(st);
  rows[1] = '..kek......kek..';
  rows[2] = '..keek....keek..';
  rows[3] = '...keeeeeeeek...';
  rows[4] = '...eeeeeeeeee...';
  rows[5] = '...ekkeeeekke...';
  rows[6] = '...eewwwwwwee...';
  rows[7] = '....ewwkkwwe....';
  rows[8] = '.....wwwwww.....';
  return rows;
}

SPRITES.zorroStand = [
  buildFox({ hair: 'e', hairDark: 'E', shirt: 'r', shirtDark: 'R', skin: 'e', pants: 'Z' }),
];

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
  module.exports = { PALETTE, SPRITES };
}
