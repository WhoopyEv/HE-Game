const TILE = 16;
const MAP_W = 24;
const MAP_H = 14;

const MAP_ROWS = [
  '########################',
  '#BBB..BBB..BB#,VV.WW.F,#',
  '#P........XXP#,,,,,,,,,#',
  '#............#,,,ZZZZ,,#',
  '#.DDD..DDD...#,,,ZZZZ,,#',
  '#............###########',
  '#............#~~~~~~~~~#',
  '#.DDD..DDD...#~P~~~~~P~#',
  '#............#~~~MMM~~~#',
  '#............T~~~MMM~~~#',
  '#...DDD......#~~~~~~~~~#',
  '#P..........P#~P~~~~~P~#',
  '#............#~~~~~~~~~#',
  '########################',
];

const SOLID = '#BDPMKVWFXZ';
const NET_COL = 19;

const COLORS = {
  wallTop: '#2f2536',
  wallFace: '#463a52',
  wallEdge: '#241c2e',
  woodA: '#a9713f',
  woodB: '#9c6638',
  woodLine: '#8a5730',
  kitchenA: '#ddd3bd',
  kitchenB: '#d4c9b1',
  kitchenLine: '#c2b69c',
  rugA: '#3f7fae',
  rugB: '#3a76a2',
  rugEdge: '#2d5d82',
  deskTop: '#8a5a33',
  deskEdge: '#5e3b20',
  deskShade: '#74492a',
  shelf: '#7a4f2c',
  shelfDark: '#583721',
  book1: '#c9454a',
  book2: '#4a86c4',
  book3: '#4fa06a',
  book4: '#e0b33e',
  plantPot: '#b3703c',
  plantPotDark: '#8a5329',
  leaf: '#3f8a52',
  leafDark: '#2d6b3d',
  metal: '#c9cdd6',
  metalDark: '#9aa0ab',
  metalEdge: '#6f757f',
  glow: '#7fb2e8',
  glowSoft: '#5d86b5',
  pingTable: '#2f6ea8',
  pingTableDark: '#27587f',
  pingLine: '#f4f0e6',
  pingNet: '#e8eaf0',
  pingNetPost: '#7c828c',
  glass: '#2f3a4a',
  screen: '#4a8fd4',
  door: '#7a4f2c',
  doorGlow: '#e8c25a',
  tableTop: '#a9713f',
  tableEdge: '#6b4526',
};

function tileAt(col, row) {
  if (row < 0 || row >= MAP_H || col < 0 || col >= MAP_W) return '#';
  return MAP_ROWS[row][col];
}

function isSolidTile(ch, doorOpen) {
  if (ch === 'T') return !doorOpen;
  return SOLID.indexOf(ch) !== -1;
}

function isSolidAt(col, row, doorOpen) {
  return isSolidTile(tileAt(col, row), doorOpen);
}

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawFloorWood(ctx, x, y, col, row) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? COLORS.woodA : COLORS.woodB);
  px(ctx, x, y + (row % 2 === 0 ? 5 : 11), TILE, 1, COLORS.woodLine);
  px(ctx, x + ((col * 7 + row * 5) % TILE), y, 1, TILE, COLORS.woodLine);
}

function drawFloorKitchen(ctx, x, y, col, row) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? COLORS.kitchenA : COLORS.kitchenB);
  px(ctx, x, y, TILE, 1, COLORS.kitchenLine);
  px(ctx, x, y, 1, TILE, COLORS.kitchenLine);
}

function drawRug(ctx, x, y, col, row) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? COLORS.rugA : COLORS.rugB);
  px(ctx, x, y, TILE, 1, COLORS.rugEdge);
  px(ctx, x, y, 1, TILE, COLORS.rugEdge);
}

function drawWall(ctx, x, y, col, row) {
  const below = tileAt(col, row + 1);
  px(ctx, x, y, TILE, TILE, COLORS.wallTop);
  px(ctx, x, y, TILE, 2, COLORS.wallEdge);
  if (below !== '#' && below !== undefined) {
    px(ctx, x, y + 6, TILE, 10, COLORS.wallFace);
    px(ctx, x, y + 6, TILE, 1, COLORS.wallEdge);
    px(ctx, x, y + 15, TILE, 1, COLORS.wallEdge);
  }
}

function drawDesk(ctx, x, y, col, row) {
  const left = tileAt(col - 1, row) !== 'D';
  const right = tileAt(col + 1, row) !== 'D';
  px(ctx, x, y, TILE, 3, COLORS.deskShade);
  px(ctx, x, y + 3, TILE, 10, COLORS.deskTop);
  px(ctx, x, y + 13, TILE, 3, COLORS.deskEdge);
  px(ctx, x, y + 3, TILE, 1, '#b8763f');
  if (left) px(ctx, x, y, 1, TILE, COLORS.deskEdge);
  if (right) px(ctx, x + 15, y, 1, TILE, COLORS.deskEdge);
}

function drawMonitor(ctx, x, y, kind) {
  if (kind === 'laptop') {
    px(ctx, x + 4, y - 4, 8, 1, COLORS.glowSoft);
    px(ctx, x + 3, y - 2, 10, 8, COLORS.metalEdge);
    px(ctx, x + 4, y - 1, 8, 6, COLORS.metalDark);
    px(ctx, x + 4, y - 1, 8, 1, COLORS.metal);
    px(ctx, x + 7, y + 1, 3, 2, COLORS.metalEdge);
    px(ctx, x + 2, y + 6, 12, 3, COLORS.metal);
    px(ctx, x + 2, y + 8, 12, 1, COLORS.metalEdge);
    return;
  }
  px(ctx, x + 4, y - 5, 8, 1, COLORS.glow);
  px(ctx, x + 3, y - 4, 10, 1, COLORS.glowSoft);
  px(ctx, x + 2, y - 3, 12, 11, COLORS.metalEdge);
  px(ctx, x + 3, y - 2, 10, 9, COLORS.metalDark);
  px(ctx, x + 3, y - 2, 10, 1, COLORS.metal);
  px(ctx, x + 5, y, 6, 1, COLORS.metalEdge);
  px(ctx, x + 5, y + 2, 6, 1, COLORS.metalEdge);
  px(ctx, x + 5, y + 4, 6, 1, COLORS.metalEdge);
  px(ctx, x + 11, y + 5, 1, 1, '#7ad87a');
  px(ctx, x + 6, y + 8, 4, 2, COLORS.metalEdge);
  px(ctx, x + 4, y + 10, 8, 2, COLORS.metalDark);
}

function drawShelf(ctx, x, y) {
  px(ctx, x, y, TILE, TILE, COLORS.shelfDark);
  px(ctx, x + 1, y + 1, 14, 6, COLORS.shelf);
  px(ctx, x + 1, y + 9, 14, 6, COLORS.shelf);
  const books = [COLORS.book1, COLORS.book2, COLORS.book3, COLORS.book4];
  for (let i = 0; i < 5; i++) {
    px(ctx, x + 2 + i * 3, y + 2, 2, 4, books[i % 4]);
    px(ctx, x + 2 + i * 3, y + 10, 2, 4, books[(i + 2) % 4]);
  }
}

function drawPlant(ctx, x, y) {
  px(ctx, x + 5, y + 10, 6, 5, COLORS.plantPot);
  px(ctx, x + 5, y + 10, 6, 1, '#c9854b');
  px(ctx, x + 5, y + 14, 6, 1, COLORS.plantPotDark);
  px(ctx, x + 7, y + 4, 2, 7, COLORS.leafDark);
  px(ctx, x + 3, y + 5, 4, 2, COLORS.leaf);
  px(ctx, x + 9, y + 5, 4, 2, COLORS.leaf);
  px(ctx, x + 4, y + 2, 3, 3, COLORS.leaf);
  px(ctx, x + 9, y + 2, 3, 3, COLORS.leaf);
  px(ctx, x + 6, y + 1, 4, 3, COLORS.leafDark);
}

function drawVending(ctx, x, y) {
  px(ctx, x, y - 6, TILE, 22, COLORS.metalEdge);
  px(ctx, x + 1, y - 5, 14, 14, '#c9454a');
  px(ctx, x + 2, y - 4, 8, 12, COLORS.glass);
  for (let i = 0; i < 3; i++) {
    px(ctx, x + 3, y - 3 + i * 4, 6, 2, i % 2 ? '#e0b33e' : '#4fa06a');
  }
  px(ctx, x + 11, y - 3, 3, 5, '#f4f0e6');
  px(ctx, x + 11, y + 3, 3, 3, COLORS.metalDark);
}

function drawWaterCooler(ctx, x, y) {
  px(ctx, x + 4, y - 5, 8, 8, '#8fd4e8');
  px(ctx, x + 5, y - 4, 6, 6, '#b8e8f4');
  px(ctx, x + 3, y + 3, 10, 12, COLORS.metal);
  px(ctx, x + 3, y + 3, 10, 1, '#e4e8ef');
  px(ctx, x + 6, y + 7, 4, 2, COLORS.metalEdge);
  px(ctx, x + 3, y + 14, 10, 1, COLORS.metalEdge);
}

function drawFridge(ctx, x, y) {
  px(ctx, x + 1, y - 6, 14, 22, COLORS.metalDark);
  px(ctx, x + 2, y - 5, 12, 20, COLORS.metal);
  px(ctx, x + 2, y + 3, 12, 1, COLORS.metalEdge);
  px(ctx, x + 11, y - 2, 2, 4, COLORS.metalEdge);
  px(ctx, x + 11, y + 6, 2, 4, COLORS.metalEdge);
}

function drawTable(ctx, x, y, col, row) {
  const top = tileAt(col, row - 1) !== 'M';
  const bottom = tileAt(col, row + 1) !== 'M';
  const left = tileAt(col - 1, row) !== 'M';
  const right = tileAt(col + 1, row) !== 'M';
  px(ctx, x, y, TILE, TILE, COLORS.tableTop);
  if (top) px(ctx, x, y, TILE, 2, '#c08850');
  if (bottom) px(ctx, x, y + 13, TILE, 3, COLORS.tableEdge);
  if (left) px(ctx, x, y, 2, TILE, COLORS.tableEdge);
  if (right) px(ctx, x + 14, y, 2, TILE, COLORS.tableEdge);
}

function drawDoor(ctx, x, y, open) {
  px(ctx, x, y, TILE, TILE, COLORS.wallTop);
  if (open) {
    px(ctx, x + 1, y, 14, TILE, '#5a4a30');
    px(ctx, x + 2, y + 2, 12, 12, COLORS.doorGlow);
    px(ctx, x + 3, y + 3, 10, 10, '#f4dd8a');
  } else {
    px(ctx, x + 1, y + 1, 14, 14, COLORS.door);
    px(ctx, x + 2, y + 2, 12, 12, COLORS.shelfDark);
    px(ctx, x + 12, y + 7, 2, 2, COLORS.doorGlow);
  }
}

function drawClock(ctx, x, y) {
  px(ctx, x + 5, y + 7, 6, 8, COLORS.metalEdge);
  px(ctx, x + 4, y + 8, 8, 6, COLORS.metalEdge);
  px(ctx, x + 5, y + 8, 6, 6, '#f4f0e6');
  px(ctx, x + 6, y + 9, 4, 4, '#f4f0e6');
  px(ctx, x + 7, y + 9, 1, 3, '#241a2b');
  px(ctx, x + 8, y + 11, 2, 1, '#241a2b');
}

function drawPainting(ctx, x, y) {
  px(ctx, x + 2, y + 7, 12, 9, '#7a4f2c');
  px(ctx, x + 3, y + 8, 10, 7, '#8fd4e8');
  px(ctx, x + 3, y + 12, 10, 3, COLORS.leafDark);
  px(ctx, x + 5, y + 9, 3, 3, '#f4dd8a');
}

function drawPingPong(ctx, x, y, col, row) {
  const top = tileAt(col, row - 1) !== 'Z';
  const bottom = tileAt(col, row + 1) !== 'Z';
  const left = tileAt(col - 1, row) !== 'Z';
  const right = tileAt(col + 1, row) !== 'Z';

  px(ctx, x, y, TILE, TILE, COLORS.pingTable);
  px(ctx, x, y + 13, TILE, 3, COLORS.pingTableDark);

  if (top) {
    px(ctx, x, y, TILE, 1, COLORS.pingLine);
    px(ctx, x, y + 15, TILE, 1, COLORS.pingLine);
  }
  if (bottom) px(ctx, x, y + 12, TILE, 1, COLORS.pingLine);
  if (left) px(ctx, x, y, 1, TILE, COLORS.pingLine);
  if (right) px(ctx, x + 15, y, 1, TILE, COLORS.pingLine);

  if (col === NET_COL) {
    px(ctx, x - 1, y - 1, 2, TILE + 2, COLORS.pingNet);
    px(ctx, x - 2, y - 2, 4, 2, COLORS.pingNetPost);
  }
}

function drawBox(ctx, x, y) {
  px(ctx, x + 1, y + 4, 14, 11, '#a8783f');
  px(ctx, x + 1, y + 4, 14, 1, '#c08850');
  px(ctx, x + 1, y + 14, 14, 1, '#7a5228');
  px(ctx, x + 7, y + 4, 2, 11, '#8a5f30');
  px(ctx, x + 1, y + 8, 14, 1, '#8a5f30');
  px(ctx, x + 3, y - 1, 10, 6, '#b8854a');
  px(ctx, x + 3, y - 1, 10, 1, '#cf9a5c');
  px(ctx, x + 7, y - 1, 2, 6, '#96683a');
}

function drawChair(ctx, x, y, facingDown) {
  const seatY = facingDown ? y + 4 : y + 2;
  px(ctx, x + 3, seatY, 10, 9, '#4a3c52');
  px(ctx, x + 4, seatY + 1, 8, 7, '#5e4c68');
  if (facingDown) px(ctx, x + 3, seatY - 3, 10, 4, '#3a2f42');
  else px(ctx, x + 3, seatY + 9, 10, 4, '#3a2f42');
}

function drawTableItems(ctx, x, y) {
  px(ctx, x + 2, y + 4, 7, 5, '#f4f0e6');
  px(ctx, x + 3, y + 5, 5, 1, '#b9b3a6');
  px(ctx, x + 3, y + 7, 4, 1, '#b9b3a6');
  px(ctx, x + 10, y + 3, 5, 4, COLORS.metalDark);
  px(ctx, x + 11, y + 4, 3, 2, COLORS.screen);
  px(ctx, x + 10, y + 8, 5, 1, COLORS.metal);
}

function drawHeadphones(ctx, x, y) {
  px(ctx, x + 5, y + 3, 6, 2, '#4a8fd4');
  px(ctx, x + 4, y + 4, 1, 3, '#4a8fd4');
  px(ctx, x + 11, y + 4, 1, 3, '#4a8fd4');
  px(ctx, x + 3, y + 6, 3, 5, '#2f5f96');
  px(ctx, x + 10, y + 6, 3, 5, '#2f5f96');
  px(ctx, x + 4, y + 7, 1, 3, '#7ab0e8');
  px(ctx, x + 11, y + 7, 1, 3, '#7ab0e8');
  px(ctx, x + 3, y + 11, 3, 1, '#1f4270');
  px(ctx, x + 10, y + 11, 3, 1, '#1f4270');
}

function drawPineapple(ctx, x, y) {
  px(ctx, x + 7, y + 1, 2, 2, '#3f8a52');
  px(ctx, x + 5, y + 2, 2, 2, '#4fa06a');
  px(ctx, x + 9, y + 2, 2, 2, '#4fa06a');
  px(ctx, x + 6, y + 3, 4, 1, '#3f8a52');
  px(ctx, x + 5, y + 4, 6, 9, '#e8c84a');
  px(ctx, x + 5, y + 4, 6, 1, '#f2dc7a');
  px(ctx, x + 6, y + 6, 1, 1, '#a88a1e');
  px(ctx, x + 9, y + 6, 1, 1, '#a88a1e');
  px(ctx, x + 7, y + 8, 1, 1, '#a88a1e');
  px(ctx, x + 6, y + 10, 1, 1, '#a88a1e');
  px(ctx, x + 9, y + 10, 1, 1, '#a88a1e');
  px(ctx, x + 5, y + 12, 6, 1, '#a88a1e');
}

function drawBottle(ctx, x, y) {
  px(ctx, x + 6, y + 2, 4, 2, '#55555f');
  px(ctx, x + 5, y + 4, 6, 9, '#26262c');
  px(ctx, x + 6, y + 5, 1, 6, '#474751');
  px(ctx, x + 5, y + 8, 6, 1, '#3a3a42');
  px(ctx, x + 5, y + 12, 6, 1, '#141418');
}

function drawDuck(ctx, x, y) {
  px(ctx, x + 3, y + 8, 7, 4, '#e8c84a');
  px(ctx, x + 4, y + 7, 5, 1, '#e8c84a');
  px(ctx, x + 7, y + 4, 4, 4, '#e8c84a');
  px(ctx, x + 8, y + 3, 2, 1, '#f2dc7a');
  px(ctx, x + 11, y + 6, 2, 2, '#e07a3e');
  px(ctx, x + 9, y + 5, 1, 1, '#241a2b');
  px(ctx, x + 3, y + 11, 7, 1, '#a88a1e');
}

function drawToyBall(ctx, x, y) {
  px(ctx, x + 5, y + 4, 4, 1, '#f4f0e6');
  px(ctx, x + 4, y + 5, 6, 1, '#f4f0e6');
  px(ctx, x + 3, y + 6, 8, 4, '#f4f0e6');
  px(ctx, x + 4, y + 10, 6, 1, '#f4f0e6');
  px(ctx, x + 5, y + 11, 4, 1, '#d8d2c4');
  px(ctx, x + 6, y + 5, 2, 2, '#241a2b');
  px(ctx, x + 3, y + 8, 2, 2, '#241a2b');
  px(ctx, x + 9, y + 8, 2, 2, '#241a2b');
  px(ctx, x + 6, y + 10, 2, 1, '#241a2b');
}

function drawMug(ctx, x, y) {
  px(ctx, x + 6, y + 6, 5, 5, '#f4f0e6');
  px(ctx, x + 7, y + 7, 3, 3, '#6b4a2a');
  px(ctx, x + 11, y + 7, 2, 2, '#d8d2c4');
}

const DECOR = [
  { col: 19, row: 0, draw: drawClock },
  { col: 18, row: 5, draw: drawPainting },
  { col: 17, row: 7, draw: function (c, x, y) { drawChair(c, x, y, true); } },
  { col: 19, row: 7, draw: function (c, x, y) { drawChair(c, x, y, true); } },
  { col: 17, row: 10, draw: function (c, x, y) { drawChair(c, x, y, false); } },
  { col: 19, row: 10, draw: function (c, x, y) { drawChair(c, x, y, false); } },
];

const DECOR_TOP = [
  { col: 17, row: 8, draw: drawTableItems },
  { col: 19, row: 9, draw: drawMug },
  { col: 2, row: 4, draw: drawHeadphones },
  { col: 7, row: 4, draw: drawPineapple },
  { col: 2, row: 7, draw: drawDuck },
  { col: 7, row: 7, draw: drawBottle },
  { col: 4, row: 10, draw: drawToyBall },
];

function floorAt(col, row) {
  if (col >= 14 && col <= 22) {
    if (row >= 1 && row <= 4) return ',';
    if (row >= 6 && row <= 12) return '~';
  }
  return '.';
}

const FLOOR_DRAW = {
  ',': drawFloorKitchen,
  '~': drawRug,
  '.': drawFloorWood,
};

const OBJECT_DRAW = {
  B: drawShelf,
  P: drawPlant,
  D: drawDesk,
  M: drawTable,
  V: drawVending,
  W: drawWaterCooler,
  F: drawFridge,
  X: drawBox,
  Z: drawPingPong,
};

function eachTile(fn) {
  for (let row = 0; row < MAP_H; row++) {
    for (let col = 0; col < MAP_W; col++) {
      fn(MAP_ROWS[row][col], col * TILE, row * TILE, col, row);
    }
  }
}

function drawDecor(ctx, list) {
  list.forEach(function (d) {
    d.draw(ctx, d.col * TILE, d.row * TILE);
  });
}

function drawBackground(ctx) {
  eachTile(function (ch, x, y, col, row) {
    if (ch === '#') drawWall(ctx, x, y, col, row);
    else FLOOR_DRAW[floorAt(col, row)](ctx, x, y, col, row);
  });

  drawDecor(ctx, DECOR);

  eachTile(function (ch, x, y, col, row) {
    const draw = OBJECT_DRAW[ch];
    if (draw) draw(ctx, x, y, col, row);
  });

  drawDecor(ctx, DECOR_TOP);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TILE,
    MAP_W,
    MAP_H,
    MAP_ROWS,
    COLORS,
    tileAt,
    isSolidAt,
    drawBackground,
    drawDoor,
    drawMonitor,
  };
}
