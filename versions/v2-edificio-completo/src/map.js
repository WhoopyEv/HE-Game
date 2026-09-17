const TILE = 16;

const COLORS = {
  void: '#15101d',
  wallTop: '#dcd8d1',
  wallFace: '#c6c0b7',
  wallEdge: '#a39c92',
  carpetA: '#cdab7d',
  carpetB: '#c3a073',
  carpetLine: '#b28e5e',
  bathA: '#9fb4bd',
  bathB: '#95aab3',
  bathLine: '#7f949c',
  grayA: '#c2c0ba',
  grayB: '#b9b7b0',
  grayLine: '#a8a69f',
  tileA: '#a8794e',
  tileB: '#9e7047',
  tileLine: '#875f3c',
  trainA: '#8a7f6b',
  trainB: '#807664',
  trainLine: '#6e6455',
  grassA: '#4f8f4a',
  grassB: '#478542',
  grassLine: '#3c7038',
  deskTop: '#e6e2d9',
  deskEdge: '#b2aca1',
  deskShade: '#d3cec4',
  deskLip: '#f4f1ea',
  woodTop: '#8a5a33',
  woodEdge: '#5e3b20',
  woodShade: '#74492a',
  woodLip: '#b8763f',
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
  glassPane: '#7fa8c4',
  glassFrame: '#4a5560',
  glassShine: '#b8d4e4',
  elevDoor: '#9aa4b0',
  elevDoorDark: '#6b747f',
  elevFrame: '#3f4854',
  elevLight: '#e8c25a',
  locker: '#5f7a8a',
  lockerDark: '#47606e',
  lockerLine: '#37505c',
  counterTop: '#c08850',
  counterFace: '#7a4f2c',
  counterDark: '#5e3b20',
  server: '#2a3038',
  serverDark: '#1c2128',
  serverLed: '#7ad87a',
  serverLed2: '#e8c25a',
  board: '#f0ece0',
  boardFrame: '#8a8f98',
  porcelain: '#eef2f4',
  porcelainDark: '#c3ccd1',
  hedge: '#3f7a3c',
  hedgeDark: '#2e5c2c',
  parapet: '#8a8578',
  parapetTop: '#a8a396',
  parapetDark: '#6b675d',
  screen: '#4a8fd4',
  door: '#7a4f2c',
  doorGlow: '#e8c25a',
  tableTop: '#a9713f',
  tableEdge: '#6b4526',
  glass: '#2f3a4a',
  balloon: '#e0453e',
  balloonLight: '#f2837e',
  balloonDark: '#a32b28',
  balloonShine: '#f7b0ac',
};

const SOLID = '#|LDdKcSRNAEYMmZVWFBPX ';

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function tileAt(floor, col, row) {
  if (row < 0 || row >= floor.h || col < 0 || col >= floor.w) return '#';
  return floor.rows[row][col];
}

function isSolidAt(floor, col, row) {
  return SOLID.indexOf(tileAt(floor, col, row)) !== -1;
}

function terrainAt(floor, col, row) {
  const zones = floor.zones || [];
  for (let i = 0; i < zones.length; i++) {
    const z = zones[i];
    if (col >= z[0] && col <= z[2] && row >= z[1] && row <= z[3]) return z[4];
  }
  return floor.base || '.';
}

function stripes(ctx, x, y, col, row, a, b, line) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? a : b);
  px(ctx, x, y + (row % 2 === 0 ? 5 : 11), TILE, 1, line);
  px(ctx, x + ((col * 7 + row * 5) % TILE), y, 1, TILE, line);
}

function squares(ctx, x, y, col, row, a, b, line) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? a : b);
  px(ctx, x, y, TILE, 1, line);
  px(ctx, x, y, 1, TILE, line);
}

function drawCarpet(ctx, x, y, col, row) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? COLORS.carpetA : COLORS.carpetB);
  px(ctx, x + ((col * 3 + row) % 8), y + ((row * 5 + col) % 9), 1, 1, COLORS.carpetLine);
  px(ctx, x + 8 + ((col + row * 3) % 7), y + 6 + ((col * 2) % 8), 1, 1, COLORS.carpetLine);
}

function drawBathFloor(ctx, x, y, col, row) {
  px(ctx, x, y, TILE, TILE, COLORS.bathA);
  px(ctx, x, y, 8, 8, COLORS.bathB);
  px(ctx, x + 8, y + 8, 8, 8, COLORS.bathB);
  px(ctx, x, y, TILE, 1, COLORS.bathLine);
  px(ctx, x, y, 1, TILE, COLORS.bathLine);
  px(ctx, x, y + 8, TILE, 1, COLORS.bathLine);
  px(ctx, x + 8, y, 1, TILE, COLORS.bathLine);
}

function drawGrayFloor(ctx, x, y, col, row) {
  stripes(ctx, x, y, col, row, COLORS.grayA, COLORS.grayB, COLORS.grayLine);
}

function drawBaldosa(ctx, x, y, col, row) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? COLORS.tileA : COLORS.tileB);
  px(ctx, x, y, TILE, 1, COLORS.tileLine);
  px(ctx, x, y, 1, TILE, COLORS.tileLine);
  px(ctx, x, y + 8, TILE, 1, COLORS.tileLine);
  px(ctx, x + 8, y, 1, TILE, COLORS.tileLine);
}

function drawTrainFloor(ctx, x, y, col, row) {
  stripes(ctx, x, y, col, row, COLORS.trainA, COLORS.trainB, COLORS.trainLine);
}

function drawGrass(ctx, x, y, col, row) {
  px(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? COLORS.grassA : COLORS.grassB);
  const seed = (col * 13 + row * 7) % 5;
  px(ctx, x + 2 + seed, y + 3, 1, 2, COLORS.grassLine);
  px(ctx, x + 9, y + 8 + (seed % 3), 1, 2, COLORS.grassLine);
  px(ctx, x + 5 + (seed % 4), y + 12, 1, 2, COLORS.grassLine);
}

const TERRAIN_DRAW = {
  '.': drawCarpet,
  ',': drawCarpet,
  '+': drawCarpet,
  '"': drawCarpet,
  ';': drawBathFloor,
  '~': drawGrayFloor,
  ':': drawTrainFloor,
  '%': drawBaldosa,
  g: drawGrass,
};

function drawWall(ctx, x, y, col, row, floor) {
  const below = tileAt(floor, col, row + 1);
  px(ctx, x, y, TILE, TILE, COLORS.wallTop);
  px(ctx, x, y, TILE, 2, COLORS.wallEdge);
  if (below !== '#' && below !== ' ') {
    px(ctx, x, y + 6, TILE, 10, COLORS.wallFace);
    px(ctx, x, y + 6, TILE, 1, COLORS.wallEdge);
    px(ctx, x, y + 15, TILE, 1, COLORS.wallEdge);
  }
}

function drawGlassWall(ctx, x, y, col, row, floor) {
  const vertical = tileAt(floor, col, row - 1) === '|' || tileAt(floor, col, row + 1) === '|';
  px(ctx, x, y, TILE, TILE, COLORS.glassFrame);
  if (vertical) {
    px(ctx, x + 4, y, 8, TILE, COLORS.glassPane);
    px(ctx, x + 5, y + 2, 2, 12, COLORS.glassShine);
  } else {
    px(ctx, x, y + 4, TILE, 8, COLORS.glassPane);
    px(ctx, x + 2, y + 5, 12, 2, COLORS.glassShine);
  }
}

function drawElevator(ctx, x, y, col, row, floor) {
  const left = tileAt(floor, col - 1, row) !== 'L';
  const right = tileAt(floor, col + 1, row) !== 'L';
  px(ctx, x, y, TILE, TILE, COLORS.elevFrame);
  px(ctx, x, y + 2, TILE, 13, COLORS.elevDoor);
  px(ctx, x, y + 2, TILE, 1, '#c3cbd4');
  px(ctx, x, y + 14, TILE, 1, COLORS.elevDoorDark);
  if (left) {
    px(ctx, x, y, 2, TILE, COLORS.elevFrame);
    px(ctx, x + 14, y + 2, 2, 13, COLORS.elevDoorDark);
  }
  if (right) {
    px(ctx, x + 14, y, 2, TILE, COLORS.elevFrame);
    px(ctx, x, y + 2, 2, 13, COLORS.elevDoorDark);
    px(ctx, x + 11, y + 5, 3, 4, COLORS.elevFrame);
    px(ctx, x + 12, y + 6, 1, 2, COLORS.elevLight);
  }
  if (left && right) px(ctx, x + 7, y + 2, 1, 13, COLORS.elevDoorDark);
}

function drawDesk(ctx, x, y, col, row, floor) {
  const ch = tileAt(floor, col, row);
  const wood = ch === 'd';
  const top = wood ? COLORS.woodTop : COLORS.deskTop;
  const edge = wood ? COLORS.woodEdge : COLORS.deskEdge;
  const shade = wood ? COLORS.woodShade : COLORS.deskShade;
  const lip = wood ? COLORS.woodLip : COLORS.deskLip;
  const left = tileAt(floor, col - 1, row) !== ch;
  const right = tileAt(floor, col + 1, row) !== ch;
  px(ctx, x, y, TILE, 3, shade);
  px(ctx, x, y + 3, TILE, 10, top);
  px(ctx, x, y + 13, TILE, 3, edge);
  px(ctx, x, y + 3, TILE, 1, lip);
  if (left) px(ctx, x, y, 1, TILE, edge);
  if (right) px(ctx, x + 15, y, 1, TILE, edge);
}

function drawLockers(ctx, x, y) {
  px(ctx, x, y - 6, TILE, 22, COLORS.lockerDark);
  px(ctx, x + 1, y - 5, 6, 20, COLORS.locker);
  px(ctx, x + 9, y - 5, 6, 20, COLORS.locker);
  px(ctx, x + 2, y - 4, 4, 2, COLORS.lockerLine);
  px(ctx, x + 10, y - 4, 4, 2, COLORS.lockerLine);
  px(ctx, x + 5, y + 2, 1, 3, COLORS.lockerLine);
  px(ctx, x + 13, y + 2, 1, 3, COLORS.lockerLine);
  px(ctx, x, y + 14, TILE, 2, COLORS.lockerLine);
}

function drawCounter(ctx, x, y, col, row, floor) {
  const left = tileAt(floor, col - 1, row) !== 'c';
  const right = tileAt(floor, col + 1, row) !== 'c';
  px(ctx, x, y - 2, TILE, 4, COLORS.counterTop);
  px(ctx, x, y + 2, TILE, 12, COLORS.counterFace);
  px(ctx, x, y + 13, TILE, 3, COLORS.counterDark);
  px(ctx, x, y + 5, TILE, 1, COLORS.counterDark);
  if (left) px(ctx, x, y - 2, 1, 18, COLORS.counterDark);
  if (right) px(ctx, x + 15, y - 2, 1, 18, COLORS.counterDark);
}

function drawServerRack(ctx, x, y) {
  px(ctx, x + 1, y - 8, 14, 24, COLORS.serverDark);
  px(ctx, x + 2, y - 7, 12, 22, COLORS.server);
  for (let i = 0; i < 6; i++) {
    px(ctx, x + 3, y - 6 + i * 4, 10, 2, COLORS.serverDark);
    px(ctx, x + 4, y - 6 + i * 4, 1, 1, i % 2 ? COLORS.serverLed : COLORS.serverLed2);
    px(ctx, x + 6, y - 6 + i * 4, 1, 1, COLORS.serverLed);
  }
  px(ctx, x + 1, y + 14, 14, 2, COLORS.serverDark);
}

function drawWhiteboard(ctx, x, y) {
  px(ctx, x, y + 2, TILE, 12, COLORS.boardFrame);
  px(ctx, x + 1, y + 3, 14, 9, COLORS.board);
  px(ctx, x + 3, y + 5, 8, 1, COLORS.screen);
  px(ctx, x + 3, y + 7, 5, 1, '#c9454a');
  px(ctx, x + 3, y + 9, 9, 1, COLORS.leafDark);
}

function drawToilet(ctx, x, y) {
  px(ctx, x + 4, y + 1, 8, 6, COLORS.porcelainDark);
  px(ctx, x + 5, y + 2, 6, 4, COLORS.porcelain);
  px(ctx, x + 4, y + 7, 8, 7, COLORS.porcelain);
  px(ctx, x + 5, y + 8, 6, 5, COLORS.porcelainDark);
  px(ctx, x + 4, y + 14, 8, 1, COLORS.metalEdge);
}

function drawSink(ctx, x, y) {
  px(ctx, x + 3, y + 4, 10, 7, COLORS.porcelain);
  px(ctx, x + 4, y + 5, 8, 4, COLORS.porcelainDark);
  px(ctx, x + 7, y + 2, 2, 3, COLORS.metalDark);
  px(ctx, x + 7, y + 1, 3, 1, COLORS.metal);
  px(ctx, x + 5, y + 11, 6, 2, COLORS.metalEdge);
}

function drawHedge(ctx, x, y) {
  px(ctx, x, y + 2, TILE, 13, COLORS.hedgeDark);
  px(ctx, x + 1, y + 1, 14, 12, COLORS.hedge);
  px(ctx, x + 3, y + 3, 3, 2, '#4f9349');
  px(ctx, x + 9, y + 6, 3, 2, '#4f9349');
  px(ctx, x + 5, y + 9, 4, 2, COLORS.hedgeDark);
}

function drawParapet(ctx, x, y, col, row, floor) {
  const below = tileAt(floor, col, row + 1);
  px(ctx, x, y, TILE, TILE, COLORS.parapet);
  px(ctx, x, y, TILE, 3, COLORS.parapetTop);
  px(ctx, x, y + 3, TILE, 1, COLORS.parapetDark);
  if (below !== 'Y' && below !== ' ') {
    px(ctx, x, y + 11, TILE, 5, COLORS.parapetDark);
  }
  px(ctx, x + ((col * 5) % 12) + 2, y + 6, 1, 4, COLORS.parapetDark);
}

function drawRoundTable(ctx, x, y, surface, edge, lip) {
  px(ctx, x + 4, y + 1, 8, 1, edge);
  px(ctx, x + 2, y + 2, 12, 2, edge);
  px(ctx, x + 1, y + 4, 14, 7, edge);
  px(ctx, x + 2, y + 11, 12, 2, edge);
  px(ctx, x + 4, y + 13, 8, 1, edge);
  px(ctx, x + 4, y + 2, 8, 1, surface);
  px(ctx, x + 2, y + 3, 12, 8, surface);
  px(ctx, x + 4, y + 11, 8, 1, surface);
  px(ctx, x + 5, y + 3, 6, 1, lip);
  px(ctx, x + 3, y + 4, 3, 1, lip);
}

function drawTable(ctx, x, y, col, row, floor) {
  const ch = tileAt(floor, col, row);
  const white = ch === 'm';
  const surface = white ? '#e6e2d9' : COLORS.tableTop;
  const edge = white ? '#b2aca1' : COLORS.tableEdge;
  const lip = white ? '#f4f1ea' : '#c08850';
  const top = tileAt(floor, col, row - 1) !== ch;
  const bottom = tileAt(floor, col, row + 1) !== ch;
  const left = tileAt(floor, col - 1, row) !== ch;
  const right = tileAt(floor, col + 1, row) !== ch;
  if (top && bottom && left && right) {
    drawRoundTable(ctx, x, y, surface, edge, lip);
    return;
  }
  px(ctx, x, y, TILE, TILE, surface);
  if (top) px(ctx, x, y, TILE, 2, lip);
  if (bottom) px(ctx, x, y + 13, TILE, 3, edge);
  if (left) px(ctx, x, y, 2, TILE, edge);
  if (right) px(ctx, x + 14, y, 2, TILE, edge);
}

function drawPingPong(ctx, x, y, col, row, floor) {
  const top = tileAt(floor, col, row - 1) !== 'Z';
  const bottom = tileAt(floor, col, row + 1) !== 'Z';
  const left = tileAt(floor, col - 1, row) !== 'Z';
  const right = tileAt(floor, col + 1, row) !== 'Z';
  px(ctx, x, y, TILE, TILE, COLORS.pingTable);
  px(ctx, x, y + 13, TILE, 3, COLORS.pingTableDark);
  if (top) {
    px(ctx, x, y, TILE, 1, COLORS.pingLine);
    px(ctx, x, y + 15, TILE, 1, COLORS.pingLine);
  }
  if (bottom) px(ctx, x, y + 12, TILE, 1, COLORS.pingLine);
  if (left) px(ctx, x, y, 1, TILE, COLORS.pingLine);
  if (right) px(ctx, x + 15, y, 1, TILE, COLORS.pingLine);
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

function drawDoorway(ctx, x, y, col, row, floor) {
  const vertical = tileAt(floor, col, row - 1) === '#' || tileAt(floor, col, row - 1) === '|';
  if (vertical) {
    px(ctx, x, y, 2, TILE, COLORS.wallEdge);
    px(ctx, x + 14, y, 2, TILE, COLORS.wallEdge);
  } else {
    px(ctx, x, y, TILE, 2, COLORS.wallEdge);
    px(ctx, x, y + 14, TILE, 2, COLORS.wallEdge);
  }
}

const OBJECT_DRAW = {
  '|': drawGlassWall,
  L: drawElevator,
  D: drawDesk,
  d: drawDesk,
  K: drawLockers,
  c: drawCounter,
  S: drawServerRack,
  R: drawWhiteboard,
  N: drawToilet,
  A: drawSink,
  E: drawHedge,
  Y: drawParapet,
  M: drawTable,
  m: drawTable,
  Z: drawPingPong,
  V: drawVending,
  W: drawWaterCooler,
  F: drawFridge,
  B: drawShelf,
  P: drawPlant,
  X: drawBox,
  T: drawDoorway,
};

function drawChair(ctx, x, y, facingDown) {
  const seatY = facingDown ? y + 4 : y + 2;
  px(ctx, x + 3, seatY, 10, 9, '#4a3c52');
  px(ctx, x + 4, seatY + 1, 8, 7, '#5e4c68');
  if (facingDown) px(ctx, x + 3, seatY - 3, 10, 4, '#3a2f42');
  else px(ctx, x + 3, seatY + 9, 10, 4, '#3a2f42');
}

function drawChairDown(ctx, x, y) {
  drawChair(ctx, x, y, true);
}

function drawChairUp(ctx, x, y) {
  drawChair(ctx, x, y, false);
}

function colorChair(body, shade, facingDown) {
  return function (ctx, x, y) {
    const seatY = facingDown ? y + 4 : y + 2;
    px(ctx, x + 3, seatY, 10, 9, shade);
    px(ctx, x + 4, seatY + 1, 8, 7, body);
    if (facingDown) px(ctx, x + 3, seatY - 3, 10, 4, shade);
    else px(ctx, x + 3, seatY + 9, 10, 4, shade);
  };
}

function drawHeartDecor(ctx, x, y) {
  const cy = y + 4;
  px(ctx, x + 4, cy + 1, 2, 1, '#e0453e');
  px(ctx, x + 8, cy + 1, 2, 1, '#e0453e');
  px(ctx, x + 3, cy + 2, 4, 2, '#e0453e');
  px(ctx, x + 7, cy + 2, 4, 2, '#e0453e');
  px(ctx, x + 4, cy + 4, 6, 1, '#e0453e');
  px(ctx, x + 5, cy + 5, 4, 1, '#e0453e');
  px(ctx, x + 6, cy + 6, 2, 1, '#a32b28');
  px(ctx, x + 4, cy + 2, 1, 1, '#f2837e');
}

function drawTableItems(ctx, x, y) {
  px(ctx, x + 2, y + 4, 7, 5, '#f4f0e6');
  px(ctx, x + 3, y + 5, 5, 1, '#b9b3a6');
  px(ctx, x + 3, y + 7, 4, 1, '#b9b3a6');
  px(ctx, x + 10, y + 3, 5, 4, COLORS.metalDark);
  px(ctx, x + 11, y + 4, 3, 2, COLORS.screen);
  px(ctx, x + 10, y + 8, 5, 1, COLORS.metal);
}

function drawMug(ctx, x, y) {
  px(ctx, x + 6, y + 6, 5, 5, '#f4f0e6');
  px(ctx, x + 7, y + 7, 3, 3, '#6b4a2a');
  px(ctx, x + 11, y + 7, 2, 2, '#d8d2c4');
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

function drawMop(ctx, x, y) {
  px(ctx, x + 4, y + 8, 8, 7, '#4a86c4');
  px(ctx, x + 4, y + 8, 8, 1, '#7fb2e8');
  px(ctx, x + 5, y + 10, 6, 3, '#8fd4e8');
  px(ctx, x + 11, y - 2, 1, 12, COLORS.shelf);
  px(ctx, x + 9, y + 9, 5, 4, '#d8d2c4');
}

function drawCoffeeMachine(ctx, x, y) {
  px(ctx, x + 2, y - 5, 12, 19, '#4a4650');
  px(ctx, x + 3, y - 4, 10, 8, '#6b6675');
  px(ctx, x + 4, y - 3, 8, 4, '#241a2b');
  px(ctx, x + 5, y - 2, 3, 2, '#7ad87a');
  px(ctx, x + 6, y + 5, 4, 3, '#c9c4b6');
  px(ctx, x + 5, y + 8, 6, 3, '#f4f0e6');
  px(ctx, x + 2, y + 12, 12, 2, '#333039');
}

function drawPastryCase(ctx, x, y) {
  px(ctx, x + 1, y - 3, 14, 15, '#c9c4b6');
  px(ctx, x + 2, y - 2, 12, 8, '#b8e8f4');
  px(ctx, x + 3, y + 1, 4, 4, '#e0b33e');
  px(ctx, x + 8, y + 1, 4, 4, '#c9454a');
  px(ctx, x + 2, y + 6, 12, 2, '#8a8f98');
  px(ctx, x + 1, y + 9, 14, 3, '#6f757f');
}

function drawMenuBoard(ctx, x, y) {
  px(ctx, x + 1, y + 4, 14, 11, '#3a2f42');
  px(ctx, x + 2, y + 5, 12, 9, '#241a2b');
  px(ctx, x + 3, y + 6, 8, 1, '#e8c25a');
  px(ctx, x + 3, y + 8, 6, 1, '#f4f0e6');
  px(ctx, x + 3, y + 10, 7, 1, '#f4f0e6');
  px(ctx, x + 3, y + 12, 5, 1, '#e8c25a');
}

function drawCups(ctx, x, y) {
  px(ctx, x + 2, y + 5, 4, 4, '#f4f0e6');
  px(ctx, x + 3, y + 6, 2, 2, '#6b4a2a');
  px(ctx, x + 8, y + 4, 4, 5, '#f4f0e6');
  px(ctx, x + 9, y + 5, 2, 2, '#6b4a2a');
  px(ctx, x + 12, y + 5, 1, 2, '#d8d2c4');
}

function drawPingNet(ctx, x, y) {
  px(ctx, x - 1, y - 1, 2, TILE + 2, COLORS.pingNet);
  px(ctx, x - 2, y - 2, 4, 2, COLORS.pingNetPost);
}

function drawNameplate(ctx, x, y) {
  px(ctx, x + 3, y + 6, 10, 5, COLORS.metalDark);
  px(ctx, x + 4, y + 7, 8, 3, COLORS.metal);
  px(ctx, x + 5, y + 8, 6, 1, COLORS.metalEdge);
}

function drawBanner(ctx, x, y) {
  px(ctx, x, y + 2, TILE, 9, COLORS.balloonDark);
  px(ctx, x, y + 3, TILE, 7, COLORS.balloon);
  px(ctx, x + 2, y + 5, 3, 3, '#f4f0e6');
  px(ctx, x + 7, y + 5, 3, 3, '#f4f0e6');
  px(ctx, x + 12, y + 5, 2, 3, '#f4f0e6');
}

function drawBalloonHeart(ctx, cx, cy, scale) {
  const count = 76;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const sin = Math.sin(t);
    const hx = 16 * sin * sin * sin;
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const bx = Math.round(cx + hx * scale);
    const by = Math.round(cy + hy * scale);
    const tone = i % 4;
    const color = tone === 0 ? COLORS.balloonLight : tone === 2 ? COLORS.balloonDark : COLORS.balloon;
    px(ctx, bx - 2, by - 4, 5, 1, color);
    px(ctx, bx - 3, by - 3, 7, 6, color);
    px(ctx, bx - 2, by + 3, 5, 1, color);
    px(ctx, bx - 2, by - 3, 2, 2, COLORS.balloonShine);
  }
}

function itemPineapple(ctx, x, y) {
  px(ctx, x + 4, y, 2, 1, '#3f8a52');
  px(ctx, x + 3, y + 1, 1, 1, '#4fa06a');
  px(ctx, x + 6, y + 1, 1, 1, '#4fa06a');
  px(ctx, x + 4, y + 1, 2, 1, '#3f8a52');
  px(ctx, x + 3, y + 2, 4, 6, '#e8c84a');
  px(ctx, x + 3, y + 2, 4, 1, '#f2dc7a');
  px(ctx, x + 4, y + 4, 1, 1, '#a88a1e');
  px(ctx, x + 5, y + 6, 1, 1, '#a88a1e');
  px(ctx, x + 3, y + 7, 4, 1, '#a88a1e');
}

function itemHeadphones(ctx, x, y) {
  px(ctx, x + 2, y + 1, 6, 1, '#4a8fd4');
  px(ctx, x + 1, y + 2, 1, 2, '#4a8fd4');
  px(ctx, x + 8, y + 2, 1, 2, '#4a8fd4');
  px(ctx, x, y + 3, 3, 4, '#2f5f96');
  px(ctx, x + 7, y + 3, 3, 4, '#2f5f96');
  px(ctx, x + 1, y + 4, 1, 2, '#7ab0e8');
  px(ctx, x + 8, y + 4, 1, 2, '#7ab0e8');
}

function itemDuck(ctx, x, y) {
  px(ctx, x + 1, y + 4, 6, 3, '#e8c84a');
  px(ctx, x + 2, y + 3, 4, 1, '#e8c84a');
  px(ctx, x + 5, y + 1, 3, 3, '#e8c84a');
  px(ctx, x + 6, y, 2, 1, '#f2dc7a');
  px(ctx, x + 8, y + 2, 2, 1, '#e07a3e');
  px(ctx, x + 7, y + 2, 1, 1, '#241a2b');
  px(ctx, x + 1, y + 7, 6, 1, '#a88a1e');
}

function itemBall(ctx, x, y) {
  px(ctx, x + 3, y + 1, 4, 1, '#f4f0e6');
  px(ctx, x + 2, y + 2, 6, 4, '#f4f0e6');
  px(ctx, x + 3, y + 6, 4, 1, '#d8d2c4');
  px(ctx, x + 4, y + 2, 2, 2, '#241a2b');
  px(ctx, x + 2, y + 4, 2, 1, '#241a2b');
  px(ctx, x + 6, y + 4, 2, 1, '#241a2b');
}

function itemMug(ctx, x, y) {
  px(ctx, x + 2, y + 2, 5, 5, '#f4f0e6');
  px(ctx, x + 3, y + 3, 3, 2, '#6b4a2a');
  px(ctx, x + 7, y + 3, 2, 2, '#d8d2c4');
  px(ctx, x + 2, y + 7, 5, 1, '#c9c4b6');
}

function itemPlant(ctx, x, y) {
  px(ctx, x + 3, y + 4, 4, 4, '#b3703c');
  px(ctx, x + 4, y + 1, 2, 3, '#2d6b3d');
  px(ctx, x + 2, y + 2, 2, 1, '#3f8a52');
  px(ctx, x + 6, y + 2, 2, 1, '#3f8a52');
}

const DESK_ITEMS = {
  pineapple: itemPineapple,
  headphones: itemHeadphones,
  duck: itemDuck,
  ball: itemBall,
  mug: itemMug,
  plant: itemPlant,
};

function drawDeskItem(ctx, x, y, kind) {
  const fn = DESK_ITEMS[kind];
  if (fn) fn(ctx, x + 3, y + 8);
}

function drawLogo(ctx, x, y) {
  const by = y - 8;
  px(ctx, x, by, 32, 22, '#0d0a12');
  px(ctx, x, by, 32, 1, '#3a3244');
  px(ctx, x, by + 21, 32, 1, '#3a3244');
  px(ctx, x + 22, by + 2, 8, 3, '#8f2fd4');
  px(ctx, x + 4, by + 6, 3, 9, '#f4f0e6');
  px(ctx, x + 11, by + 3, 3, 12, '#f4f0e6');
  px(ctx, x + 7, by + 9, 4, 3, '#f4f0e6');
  px(ctx, x + 17, by + 6, 3, 9, '#f4f0e6');
  px(ctx, x + 20, by + 6, 7, 3, '#f4f0e6');
  px(ctx, x + 20, by + 12, 7, 3, '#f4f0e6');
  px(ctx, x + 2, by + 11, 4, 4, '#e0453e');
  px(ctx, x + 3, by + 17, 26, 3, '#f2c50a');
}

const monitorCache = {};

function drawMonitorArt(ctx, x, y, kind) {
  if (kind === 'laptop') {
    px(ctx, x + 4, y - 7, 8, 1, COLORS.glowSoft);
    px(ctx, x + 3, y - 6, 10, 7, COLORS.metalEdge);
    px(ctx, x + 4, y - 5, 8, 5, COLORS.metalDark);
    px(ctx, x + 4, y - 5, 8, 1, COLORS.metal);
    px(ctx, x + 7, y - 3, 3, 2, COLORS.metalEdge);
    px(ctx, x + 2, y + 1, 12, 3, COLORS.metal);
    px(ctx, x + 2, y + 3, 12, 1, COLORS.metalEdge);
    return;
  }
  px(ctx, x + 4, y - 9, 8, 1, COLORS.glow);
  px(ctx, x + 3, y - 8, 10, 1, COLORS.glowSoft);
  px(ctx, x + 2, y - 7, 12, 9, COLORS.metalEdge);
  px(ctx, x + 3, y - 6, 10, 7, COLORS.metalDark);
  px(ctx, x + 3, y - 6, 10, 1, COLORS.metal);
  px(ctx, x + 5, y - 4, 6, 1, COLORS.metalEdge);
  px(ctx, x + 5, y - 2, 6, 1, COLORS.metalEdge);
  px(ctx, x + 11, y, 1, 1, '#7ad87a');
  px(ctx, x + 6, y + 2, 4, 2, COLORS.metalEdge);
  px(ctx, x + 4, y + 4, 8, 2, COLORS.metalDark);
}

function drawMonitor(ctx, x, y, kind) {
  if (!monitorCache[kind]) {
    const c = document.createElement('canvas');
    c.width = TILE;
    c.height = 24;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    drawMonitorArt(g, 0, 8, kind);
    monitorCache[kind] = c;
  }
  ctx.drawImage(monitorCache[kind], Math.round(x), Math.round(y) - 8);
}

const DECOR_DRAW = {
  chairDown: drawChairDown,
  chairUp: drawChairUp,
  tableItems: drawTableItems,
  mug: drawMug,
  clock: drawClock,
  painting: drawPainting,
  mop: drawMop,
  pingNet: drawPingNet,
  nameplate: drawNameplate,
  banner: drawBanner,
  logo: drawLogo,
  heart: drawHeartDecor,
  coffee: drawCoffeeMachine,
  pastry: drawPastryCase,
  menu: drawMenuBoard,
  cups: drawCups,
  chairYd: colorChair('#e8c84a', '#a88a1e', true),
  chairYu: colorChair('#e8c84a', '#a88a1e', false),
  chairWd: colorChair('#f4f0e6', '#c9c4b6', true),
  chairWu: colorChair('#f4f0e6', '#c9c4b6', false),
  chairBd: colorChair('#8fd4e8', '#5aa6c0', true),
  chairBu: colorChair('#8fd4e8', '#5aa6c0', false),
};

function drawDecorList(ctx, list, floor) {
  (list || []).forEach(function (d) {
    const fn = DECOR_DRAW[d.art];
    if (fn) fn(ctx, d.col * TILE, d.row * TILE, d.col, d.row, floor);
  });
}

function eachTile(floor, fn) {
  for (let row = 0; row < floor.h; row++) {
    for (let col = 0; col < floor.w; col++) {
      fn(floor.rows[row][col], col * TILE, row * TILE, col, row);
    }
  }
}

function drawFloorBackground(ctx, floor) {
  px(ctx, 0, 0, floor.w * TILE, floor.h * TILE, COLORS.void);

  eachTile(floor, function (ch, x, y, col, row) {
    if (ch === ' ') return;
    if (ch === '#') {
      drawWall(ctx, x, y, col, row, floor);
      return;
    }
    const draw = TERRAIN_DRAW[terrainAt(floor, col, row)] || drawCarpet;
    draw(ctx, x, y, col, row, floor);
  });

  if (floor.arch) drawBalloonHeart(ctx, floor.arch.x * TILE, floor.arch.y * TILE, floor.arch.scale);

  drawDecorList(ctx, floor.decor, floor);

  eachTile(floor, function (ch, x, y, col, row) {
    const draw = OBJECT_DRAW[ch];
    if (draw) draw(ctx, x, y, col, row, floor);
  });

  drawDecorList(ctx, floor.decorTop, floor);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TILE, COLORS, tileAt, isSolidAt, terrainAt, drawFloorBackground, drawMonitor };
}
