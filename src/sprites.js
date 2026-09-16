const PALETTE = {
  '.': null,
  k: '#241a2b',
  r: '#e0453e',
  R: '#a32b28',
  b: '#d9a441',
  B: '#a9762a',
  s: '#f0c090',
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

function buildDevSit(hair, hairDark, shirt, shirtDark) {
  return [
    [
      '................',
      '.....kkkkkk.....',
      '....k' + hairDark + rep(hair, 4) + hairDark + 'k....',
      '...k' + hairDark + rep(hair, 6) + hairDark + 'k...',
      '...k' + hair + 'ss' + rep(hair, 2) + 'ss' + hair + 'k...',
      '...k' + rep('s', 8) + 'k...',
      '...kss' + 'k' + 'ss' + 'k' + 'ss' + 'k...',
      '....k' + rep('s', 6) + 'k....',
      '.....k' + rep('s', 4) + 'k.....',
      '..kk' + rep(shirt, 8) + 'kk..',
      '.ks' + rep(shirt, 10) + 'sk.',
      '.ks' + rep(shirt, 10) + 'sk.',
      '.k' + shirtDark + rep(shirt, 10) + shirtDark + 'k.',
      '.kk' + rep(shirtDark, 10) + 'kk.',
      '..kk' + rep(shirtDark, 8) + 'kk..',
      '....' + rep('k', 8) + '....',
    ],
  ];
}

function buildDevStand(hair, hairDark, shirt, shirtDark) {
  return [
    '................',
    '.....kkkkkk.....',
    '....k' + hairDark + rep(hair, 4) + hairDark + 'k....',
    '...k' + hairDark + rep(hair, 6) + hairDark + 'k...',
    '...k' + hair + 'ss' + rep(hair, 2) + 'ss' + hair + 'k...',
    '...k' + rep('s', 8) + 'k...',
    '...kss' + 'k' + 'ss' + 'k' + 'ss' + 'k...',
    '....k' + rep('s', 6) + 'k....',
    '.....k' + rep('s', 5) + 'k....',
    '..kk' + rep(shirt, 8) + 'kk..',
    '.ks' + rep(shirt, 10) + 'sk.',
    '.ks' + rep(shirt, 10) + 'sk.',
    '.kk' + rep(shirtDark, 10) + 'kk.',
    '...k' + rep('C', 8) + 'k...',
    '...knnk..knnk...',
    '...kkk...kkk....',
  ];
}

const DEV_STYLES = {
  daniel: { hair: 'h', hairDark: 'H', shirt: 'c', shirtDark: 'C' },
  diana: { hair: 'e', hairDark: 'E', shirt: 'p', shirtDark: 'P' },
  nicolas: { hair: 'j', hairDark: 'J', shirt: 'g', shirtDark: 'G' },
  guillermo: { hair: 'n', hairDark: 'H', shirt: 'y', shirtDark: 'Y' },
  felipe: { hair: 'h', hairDark: 'H', shirt: 'e', shirtDark: 'E' },
};

const SPRITES = {
  spartanDown: [SPARTAN_DOWN_0, SPARTAN_DOWN_1],
  spartanUp: [SPARTAN_UP_0, SPARTAN_UP_1],
  spartanSide: [SPARTAN_SIDE_0, SPARTAN_SIDE_1],
};

Object.keys(DEV_STYLES).forEach(function (name) {
  const style = DEV_STYLES[name];
  SPRITES[name + 'Sit'] = buildDevSit(style.hair, style.hairDark, style.shirt, style.shirtDark);
  SPRITES[name + 'Stand'] = [buildDevStand(style.hair, style.hairDark, style.shirt, style.shirtDark)];
});

SPRITES.pingpongA = [buildDevStand('H', 'k', 'w', 'W')];
SPRITES.pingpongB = [buildDevStand('n', 'H', 't', 'T')];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PALETTE, SPRITES, DEV_STYLES };
}
