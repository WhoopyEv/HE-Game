const TILE = 16;
const VIEW_W = 320;
const VIEW_H = 176;
const SCENE_H = 11;
const GROUND_ROW = 9;

// Cada escenario define su ancho en tiles, su paleta, sus plataformas y sus entidades.
// El nivel completo es la concatenación horizontal de todos.
//   platforms: { col, row, w, type: 'solid' | 'oneway' }
//   entities:  patrol | shooter | crumble | piece
const SCENES = [
  {
    id: 'recepcion',
    label: 'RECEPCIÓN',
    width: 42,
    theme: {
      back: '#d8cdbb',
      backFar: '#c6bba8',
      floorTop: '#cdab7d',
      floorBody: '#9e7a52',
      floorLine: '#b28e5e',
    },
    platforms: [
      { col: 9, row: 7, w: 6, type: 'solid', art: 'counter' },
      { col: 24, row: 7, w: 3, type: 'solid', art: 'bench' },
      { col: 34, row: 7, w: 2, type: 'solid', art: 'bench' },
    ],
    decor: [
      { art: 'logoWall', col: 10, row: 2 },
      { art: 'plant', col: 6, row: 8 },
      { art: 'plant', col: 16, row: 8 },
      { art: 'plant', col: 31, row: 8 },
      { art: 'plant', col: 40, row: 8 },
      { art: 'deskChair', col: 22, row: 8 },
      { art: 'printer', col: 32, row: 8 },
      { art: 'boxes', col: 38, row: 8 },
      { art: 'cooler', col: 7, row: 9 },
      // { art: 'thermos', col: 23, row: 6 }, -- objeto que nos representa, desactivado por ahora
    ],
    entities: [
      { type: 'shooter', col: 19, row: 8, skin: 'coffee', interval: 3.4, dir: -1, power: 48, lift: -235 },
      { type: 'patrol', col: 27, row: 8, range: 6, speed: 36, skin: 'vacuum' },
    ],
  },
  {
    id: 'parqueadero',
    label: 'PARQUEADERO',
    width: 34,
    theme: {
      back: '#2b3140',
      backFar: '#232936',
      floorTop: '#4d525c',
      floorBody: '#383d47',
      floorLine: '#2c313a',
      outdoor: true,
    },
    platforms: [
      { col: 12, row: 7, w: 3, type: 'solid', art: 'pallet' },
      { col: 19, row: 6, w: 3, type: 'solid', art: 'pallet' },
      { col: 26, row: 7, w: 2, type: 'solid', art: 'pallet' },
    ],
    decor: [
      { art: 'car', col: 3, row: 8, tint: '#c9454a' },
      { art: 'car', col: 29, row: 8, tint: '#4a86c4' },
      { art: 'parkSign', col: 8, row: 7 },
      // { art: 'duck', col: 20, row: 5 }, -- objeto que nos representa, desactivado por ahora
    ],
    entities: [
      { type: 'piece', col: 20, row: 4, value: 'oportunidad' },
    ],
  },
  {
    id: 'bienestar',
    label: 'BIENESTAR',
    width: 42,
    theme: {
      back: '#dbd9d2',
      backFar: '#c8c6bf',
      floorTop: '#c2c0ba',
      floorBody: '#9a9892',
      floorLine: '#a8a69f',
    },
    platforms: [
      { col: 4, row: 6, w: 4, type: 'solid', art: 'lockers' },
      { col: 10, row: 7, w: 2, type: 'solid', art: 'bench' },
      { col: 15, row: 7, w: 5, type: 'solid', art: 'pingpong' },
      { col: 25, row: 6, w: 5, type: 'solid', art: 'lockers' },
      { col: 33, row: 6, w: 4, type: 'solid', art: 'lockers' },
    ],
    decor: [
      { art: 'cooler', col: 39, row: 9 },
      // { art: 'ball', col: 27, row: 5 }, -- objeto que nos representa, desactivado por ahora
      { art: 'plant', col: 22, row: 8 },
    ],
    entities: [
      { type: 'shooter', col: 21, row: 8, skin: 'pingball', interval: 2.1, dir: -1, power: 62, lift: -215 },
      { type: 'piece', col: 17, row: 5, value: 'equipo' },
    ],
  },
  {
    id: 'operaciones',
    label: 'OPERACIONES',
    width: 46,
    theme: {
      back: '#ccd3dc',
      backFar: '#b9c1cc',
      floorTop: '#cdab7d',
      floorBody: '#9e7a52',
      floorLine: '#b28e5e',
    },
    // Sin plataformas: el piso es plano y el reto es esquivar las sillas que ruedan.
    platforms: [],
    decor: [
      { art: 'plant', col: 5, row: 8 },
      { art: 'desk', col: 9, row: 8 },
      { art: 'desk', col: 17, row: 8 },
      { art: 'desk', col: 25, row: 8 },
      { art: 'desk', col: 33, row: 8 },
      { art: 'desk', col: 41, row: 8 },
      { art: 'deskChair', col: 12, row: 8 },
      { art: 'deskChair', col: 36, row: 8 },
      { art: 'printer', col: 20, row: 8 },
      { art: 'printer', col: 30, row: 8 },
      { art: 'boxes', col: 44, row: 8 },
      // { art: 'headphones', col: 15, row: 5 }, -- objeto que nos representa, desactivado por ahora
    ],
    entities: [
      { type: 'patrol', col: 11, row: 8, range: 4, speed: 38, skin: 'chair' },
      { type: 'patrol', col: 21, row: 8, range: 5, speed: 44, skin: 'chair' },
      { type: 'patrol', col: 34, row: 8, range: 4, speed: 40, skin: 'chair' },
      { type: 'piece', col: 28, row: 6, value: 'confianza' },
    ],
  },
  {
    id: 'ti',
    label: 'TI',
    width: 48,
    theme: {
      back: '#2f3a4a',
      backFar: '#26303d',
      floorTop: '#4a5260',
      floorBody: '#39404c',
      floorLine: '#313843',
      dark: true,
    },
    platforms: [
      // Torre de racks apoyada en el piso todo el camino -- se sube, no flota nada.
      // Un tile por escalon, mismo patron que la escalera de la terraza (ya probado).
      { col: 8, row: 8, w: 2, type: 'solid', art: 'rack' },
      { col: 13, row: 7, w: 2, type: 'solid', art: 'rack' },
      { col: 18, row: 6, w: 2, type: 'solid', art: 'rack' },
      // Todos los servidores tienen colision, no solo los tres de la subida.
      { col: 24, row: 7, w: 3, type: 'solid', art: 'rack' },
      { col: 34, row: 7, w: 3, type: 'solid', art: 'rack' },
    ],
    decor: [
      { art: 'cables', col: 4, row: 8 },
      { art: 'cables', col: 44, row: 8 },
      { art: 'printer', col: 29, row: 8 },
      { art: 'printer', col: 39, row: 8 },
      { art: 'deskChair', col: 40, row: 8 },
      // { art: 'pineapple', col: 22, row: 2 }, -- objeto que nos representa, desactivado por ahora
    ],
    entities: [
      { type: 'patrol', col: 30, row: 8, range: 5, speed: 46, skin: 'chair' },
      { type: 'shooter', col: 42, row: 8, skin: 'printer', interval: 2.3, dir: -1, power: 70, lift: -235 },
      { type: 'crumble', col: 21, row: 6, w: 2 },
      { type: 'piece', col: 24, row: 5, value: 'aprendizaje' },
    ],
  },
  {
    id: 'terraza',
    label: 'TERRAZA',
    width: 44,
    theme: {
      back: '#7fb2e8',
      backFar: '#6a9fd8',
      floorTop: '#4f8f4a',
      floorBody: '#3c7038',
      floorLine: '#458040',
      outdoor: true,
    },
    platforms: [
      { col: 6, row: 8, w: 3, type: 'solid', art: 'step' },
      { col: 11, row: 7, w: 3, type: 'solid', art: 'step' },
      { col: 16, row: 6, w: 3, type: 'solid', art: 'step' },
      { col: 21, row: 5, w: 3, type: 'solid', art: 'step' },
      { col: 27, row: 4, w: 12, type: 'solid', art: 'terrace' },
    ],
    decor: [
      { art: 'arch', col: 31, row: -1 },
      { art: 'terraceTable', col: 35, row: 3 },
      { art: 'plant', col: 29, row: 3 },
      { art: 'plant', col: 41, row: 3 },
    ],
    entities: [
      // A la misma altura que la terraza: si se falla, se cae sobre ella, no al vacio.
      { type: 'crumble', col: 25, row: 4, w: 3 },
      { type: 'piece', col: 29, row: 2, value: 'respaldo' },
      { type: 'goal', col: 33, row: 2 },
    ],
  },
];

const LEVEL = (function build() {
  let width = 0;
  const scenes = SCENES.map(function (s) {
    const start = width;
    width += s.width;
    return Object.assign({}, s, { start: start, end: width - 1 });
  });

  const grid = [];
  for (let r = 0; r < SCENE_H; r++) grid.push(new Array(width).fill(' '));
  for (let c = 0; c < width; c++) {
    grid[GROUND_ROW][c] = '#';
    grid[GROUND_ROW + 1][c] = '#';
  }

  const entities = [];
  scenes.forEach(function (s) {
    (s.platforms || []).forEach(function (p) {
      const ch = p.type === 'oneway' ? '=' : '#';
      for (let i = 0; i < p.w; i++) grid[p.row][s.start + p.col + i] = ch;
      // Todo mueble baja hasta el piso por defecto -- nada flota sin apoyo visible.
      if (p.type === 'solid') {
        for (let r = p.row + 1; r <= GROUND_ROW - 1; r++) {
          for (let i = 0; i < p.w; i++) grid[r][s.start + p.col + i] = '#';
        }
      }
    });
    (s.entities || []).forEach(function (e) {
      entities.push(Object.assign({}, e, { col: s.start + e.col, scene: s.id }));
    });
  });

  return { width: width, grid: grid, scenes: scenes, entities: entities };
})();

const LEVEL_W = LEVEL.width * TILE;

function tileAt(col, row) {
  if (row < 0 || row >= SCENE_H) return ' ';
  if (col < 0 || col >= LEVEL.width) return '#';
  return LEVEL.grid[row][col];
}

function sceneAtCol(col) {
  const list = LEVEL.scenes;
  for (let i = 0; i < list.length; i++) {
    if (col >= list[i].start && col <= list[i].end) return list[i];
  }
  return list[list.length - 1];
}

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

// ---------- arte de decoración ----------

function artCar(ctx, x, y, d) {
  const body = d.tint || '#c9454a';
  px(ctx, x, y + 6, 32, 9, body);
  px(ctx, x + 4, y + 1, 22, 6, body);
  px(ctx, x + 6, y + 2, 8, 4, '#8fd4e8');
  px(ctx, x + 16, y + 2, 8, 4, '#8fd4e8');
  px(ctx, x, y + 13, 32, 3, '#241a2b');
  px(ctx, x + 4, y + 14, 5, 4, '#241a2b');
  px(ctx, x + 23, y + 14, 5, 4, '#241a2b');
  px(ctx, x + 5, y + 15, 3, 2, '#55555f');
  px(ctx, x + 24, y + 15, 3, 2, '#55555f');
}

function artParkSign(ctx, x, y) {
  px(ctx, x + 7, y + 6, 2, 26, '#8a8f98');
  px(ctx, x + 1, y, 14, 12, '#3f6fb5');
  px(ctx, x + 2, y + 1, 12, 10, '#4a86c4');
  px(ctx, x + 5, y + 3, 6, 2, '#f4f0e6');
  px(ctx, x + 5, y + 3, 2, 6, '#f4f0e6');
  px(ctx, x + 9, y + 5, 2, 2, '#f4f0e6');
}

function artPallet(ctx, x, y, d, w, h) {
  const cols = w || 3;
  const height = (h || 1) * TILE;
  for (let i = 0; i < cols; i++) {
    const bx = x + i * TILE;
    px(ctx, bx, y + 6, TILE, height - 6, '#7a5228');
    px(ctx, bx, y, TILE, 4, '#a8783f');
    px(ctx, bx, y + 4, TILE, 2, '#8a5f30');
    px(ctx, bx + 2, y + 8, 3, height - 10, '#96683a');
    px(ctx, bx + 11, y + 8, 3, height - 10, '#96683a');
  }
}

function artCounter(ctx, x, y, d, w, h) {
  const width = (w || 6) * TILE;
  const height = (h || 1) * TILE;
  px(ctx, x, y + 4, width, height - 4, '#7a4f2c');
  px(ctx, x, y, width, 4, '#c08850');
  px(ctx, x, y + height - 2, width, 2, '#5e3b20');
  for (let i = 0; i < width; i += 8) px(ctx, x + i, y + 8, 1, height - 12, '#5e3b20');
}

function artBench(ctx, x, y, d, w, h) {
  const width = (w || 3) * TILE;
  const height = (h || 1) * TILE;
  px(ctx, x, y, width, 4, '#8a5a33');
  px(ctx, x, y + 4, width, 2, '#5e3b20');
  px(ctx, x + 2, y + 6, 3, height - 6, '#5e3b20');
  px(ctx, x + width - 5, y + 6, 3, height - 6, '#5e3b20');
  px(ctx, x + 6, y + 6, width - 12, 2, '#6b4526');
}

function artShelf(ctx, x, y, d, w) {
  const width = (w || 3) * TILE;
  px(ctx, x, y, width, 3, '#b2aca1');
  px(ctx, x, y + 3, width, 2, '#7a746b');
  px(ctx, x + 3, y + 5, 2, 10, '#7a746b');
  px(ctx, x + width - 5, y + 5, 2, 10, '#7a746b');
}

function artDesk(ctx, x, y, d, w, h) {
  const width = (w || 3) * TILE;
  const height = (h || 1) * TILE;
  px(ctx, x, y, width, 4, '#e6e2d9');
  px(ctx, x, y + 4, width, 2, '#b2aca1');
  px(ctx, x + 2, y + 6, 3, height - 6, '#b2aca1');
  px(ctx, x + width - 5, y + 6, 3, height - 6, '#b2aca1');
  px(ctx, x + 5, y + 6, width - 10, 3, '#d3cec4');
  px(ctx, x + width / 2 - 5, y - 9, 10, 8, '#6f757f');
  px(ctx, x + width / 2 - 4, y - 8, 8, 6, '#2f5f96');
  px(ctx, x + width / 2 - 1, y - 1, 2, 2, '#6f757f');
}

function artRack(ctx, x, y, d, w, h) {
  const width = (w || 3) * TILE;
  const height = (h || 2) * TILE;
  px(ctx, x, y, width, height, '#1c2128');
  px(ctx, x + 1, y + 1, width - 2, height - 2, '#2a3038');
  for (let r = 0; r < Math.floor(height / 6); r++) {
    px(ctx, x + 3, y + 3 + r * 6, width - 6, 2, '#1c2128');
    px(ctx, x + 4, y + 3 + r * 6, 1, 1, r % 2 ? '#7ad87a' : '#e8c25a');
    px(ctx, x + 7, y + 3 + r * 6, 1, 1, '#7ad87a');
  }
}

function artStep(ctx, x, y, d, w, h) {
  const width = (w || 3) * TILE;
  const height = (h || 1) * TILE;
  px(ctx, x, y, width, height, '#8a7f6b');
  px(ctx, x, y, width, 3, '#a89a80');
  px(ctx, x, y + 3, width, 1, '#6e6455');
}

function artTerrace(ctx, x, y, d, w, h) {
  const width = (w || 12) * TILE;
  const height = (h || 5) * TILE;
  px(ctx, x, y, width, height, '#3c7038');
  px(ctx, x, y, width, 4, '#4f8f4a');
  for (let i = 0; i < width; i += 7) px(ctx, x + i + 2, y + 5, 1, 2, '#458040');
  px(ctx, x, y + 4, width, 1, '#2f5c2c');
}

function artPingpong(ctx, x, y, d, w, h) {
  const width = (w || 5) * TILE;
  const height = (h || 1) * TILE;
  px(ctx, x, y, width, 4, '#2f6ea8');
  px(ctx, x, y + 1, width, 1, '#f4f0e6');
  px(ctx, x, y + 4, width, 2, '#27587f');
  px(ctx, x + width / 2 - 1, y - 6, 2, 6, '#e8eaf0');
  px(ctx, x + 3, y + 6, 3, height - 6, '#27587f');
  px(ctx, x + width - 6, y + 6, 3, height - 6, '#27587f');
  px(ctx, x + 8, y + 6, width - 16, 2, '#245073');
}

function artLockers(ctx, x, y, d, w, h) {
  const width = (w || 3) * TILE;
  const height = (h || 3) * TILE;
  px(ctx, x, y, width, height, '#47606e');
  for (let i = 0; i < width; i += 12) {
    px(ctx, x + i + 1, y + 1, 10, height - 2, '#5f7a8a');
    px(ctx, x + i + 3, y + 3, 6, 2, '#37505c');
    px(ctx, x + i + 8, y + 9, 1, 3, '#37505c');
  }
}

function artVending(ctx, x, y) {
  px(ctx, x, y - 16, TILE, 32, '#6f757f');
  px(ctx, x + 1, y - 15, 14, 22, '#c9454a');
  px(ctx, x + 2, y - 14, 9, 19, '#2f3a4a');
  for (let i = 0; i < 4; i++) px(ctx, x + 3, y - 13 + i * 5, 7, 2, i % 2 ? '#e0b33e' : '#4fa06a');
  px(ctx, x + 12, y - 13, 2, 6, '#f4f0e6');
}

function artCooler(ctx, x, y) {
  px(ctx, x + 4, y - 14, 8, 9, '#8fd4e8');
  px(ctx, x + 5, y - 13, 6, 7, '#b8e8f4');
  px(ctx, x + 3, y - 5, 10, 21, '#c9cdd6');
  px(ctx, x + 6, y, 4, 2, '#6f757f');
}

function artPlant(ctx, x, y) {
  px(ctx, x + 5, y + 8, 7, 8, '#b3703c');
  px(ctx, x + 5, y + 8, 7, 1, '#c9854b');
  px(ctx, x + 8, y, 2, 9, '#2d6b3d');
  px(ctx, x + 3, y + 1, 5, 3, '#3f8a52');
  px(ctx, x + 9, y + 1, 5, 3, '#3f8a52');
  px(ctx, x + 5, y - 3, 4, 4, '#4fa06a');
  px(ctx, x + 9, y - 2, 4, 3, '#3f8a52');
}

function artBoxes(ctx, x, y) {
  px(ctx, x, y + 6, 15, 10, '#a8783f');
  px(ctx, x, y + 6, 15, 1, '#c08850');
  px(ctx, x + 7, y + 6, 1, 10, '#7a5228');
  px(ctx, x + 2, y - 2, 11, 8, '#b8854a');
  px(ctx, x + 7, y - 2, 1, 8, '#96683a');
}

function artCables(ctx, x, y) {
  px(ctx, x, y + 12, 16, 2, '#1c2128');
  px(ctx, x + 3, y + 10, 8, 2, '#2f5f96');
  px(ctx, x + 6, y + 8, 9, 2, '#a32b28');
}

function artPrinter(ctx, x, y) {
  px(ctx, x, y + 2, TILE, 14, '#8a8f98');
  px(ctx, x + 1, y + 3, 14, 8, '#c9cdd6');
  px(ctx, x + 3, y, 10, 3, '#f4f0e6');
  px(ctx, x + 3, y + 12, 10, 2, '#5a5f68');
  px(ctx, x + 11, y + 5, 2, 2, '#7ad87a');
}

function artCoffee(ctx, x, y) {
  px(ctx, x + 2, y - 4, 12, 20, '#4a4650');
  px(ctx, x + 3, y - 3, 10, 8, '#6b6675');
  px(ctx, x + 4, y - 2, 8, 4, '#241a2b');
  px(ctx, x + 5, y - 1, 3, 2, '#7ad87a');
  px(ctx, x + 6, y + 6, 4, 3, '#c9c4b6');
  px(ctx, x + 5, y + 9, 6, 4, '#f4f0e6');
  px(ctx, x + 2, y + 13, 12, 3, '#333039');
}

function artLogoWall(ctx, x, y) {
  px(ctx, x, y, 32, 22, '#0d0a12');
  px(ctx, x, y, 32, 1, '#3a3244');
  px(ctx, x, y + 21, 32, 1, '#3a3244');
  px(ctx, x + 22, y + 2, 8, 3, '#8f2fd4');
  px(ctx, x + 4, y + 6, 3, 9, '#f4f0e6');
  px(ctx, x + 11, y + 3, 3, 12, '#f4f0e6');
  px(ctx, x + 7, y + 9, 4, 3, '#f4f0e6');
  px(ctx, x + 17, y + 6, 3, 9, '#f4f0e6');
  px(ctx, x + 20, y + 6, 7, 3, '#f4f0e6');
  px(ctx, x + 20, y + 12, 7, 3, '#f4f0e6');
  px(ctx, x + 2, y + 11, 4, 4, '#e0453e');
  px(ctx, x + 3, y + 17, 26, 3, '#f2c50a');
}

function artArch(ctx, x, y) {
  const cx = x + 8;
  const cy = y + 40;
  for (let i = 0; i < 54; i++) {
    const t = (i / 54) * Math.PI * 2;
    const sin = Math.sin(t);
    const hx = 16 * sin * sin * sin;
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const bx = Math.round(cx + hx * 2.6);
    const by = Math.round(cy + hy * 2.6);
    const tone = i % 4;
    const color = tone === 0 ? '#f2837e' : tone === 2 ? '#a32b28' : '#e0453e';
    px(ctx, bx - 1, by - 2, 3, 1, color);
    px(ctx, bx - 2, by - 1, 5, 3, color);
    px(ctx, bx - 1, by + 2, 3, 1, color);
  }
}

function artTerraceTable(ctx, x, y) {
  px(ctx, x + 1, y + 2, 14, 4, '#e6e2d9');
  px(ctx, x + 1, y + 6, 14, 2, '#b2aca1');
  px(ctx, x + 7, y + 8, 2, 8, '#b2aca1');
  px(ctx, x - 6, y + 4, 5, 4, '#f2c50a');
  px(ctx, x + 17, y + 4, 5, 4, '#8fd4e8');
}

function artPineapple(ctx, x, y) {
  px(ctx, x + 6, y, 3, 2, '#3f8a52');
  px(ctx, x + 4, y + 2, 2, 2, '#4fa06a');
  px(ctx, x + 9, y + 2, 2, 2, '#4fa06a');
  px(ctx, x + 5, y + 4, 6, 10, '#e8c84a');
  px(ctx, x + 5, y + 4, 6, 1, '#f2dc7a');
  px(ctx, x + 6, y + 7, 1, 1, '#a88a1e');
  px(ctx, x + 9, y + 9, 1, 1, '#a88a1e');
  px(ctx, x + 5, y + 13, 6, 1, '#a88a1e');
}

function artBall(ctx, x, y) {
  px(ctx, x + 5, y + 4, 6, 1, '#f4f0e6');
  px(ctx, x + 3, y + 5, 10, 7, '#f4f0e6');
  px(ctx, x + 5, y + 12, 6, 1, '#d8d2c4');
  px(ctx, x + 6, y + 6, 3, 3, '#241a2b');
  px(ctx, x + 3, y + 9, 3, 2, '#241a2b');
  px(ctx, x + 10, y + 9, 3, 2, '#241a2b');
}

function artDuck(ctx, x, y) {
  px(ctx, x + 2, y + 8, 9, 5, '#e8c84a');
  px(ctx, x + 3, y + 7, 6, 1, '#e8c84a');
  px(ctx, x + 7, y + 3, 5, 5, '#e8c84a');
  px(ctx, x + 8, y + 2, 3, 1, '#f2dc7a');
  px(ctx, x + 12, y + 5, 3, 2, '#e07a3e');
  px(ctx, x + 10, y + 4, 1, 1, '#241a2b');
  px(ctx, x + 2, y + 13, 9, 1, '#a88a1e');
}

function artHeadphones(ctx, x, y) {
  px(ctx, x + 4, y + 3, 8, 2, '#4a8fd4');
  px(ctx, x + 3, y + 5, 2, 3, '#4a8fd4');
  px(ctx, x + 11, y + 5, 2, 3, '#4a8fd4');
  px(ctx, x + 1, y + 7, 4, 6, '#2f5f96');
  px(ctx, x + 11, y + 7, 4, 6, '#2f5f96');
  px(ctx, x + 2, y + 9, 2, 3, '#7ab0e8');
  px(ctx, x + 12, y + 9, 2, 3, '#7ab0e8');
}

function artThermos(ctx, x, y) {
  px(ctx, x + 5, y + 1, 6, 3, '#55555f');
  px(ctx, x + 4, y + 4, 8, 11, '#c9cdd6');
  px(ctx, x + 5, y + 6, 2, 7, '#e4e8ef');
  px(ctx, x + 4, y + 8, 8, 2, '#a32b28');
  px(ctx, x + 4, y + 14, 8, 2, '#6f757f');
}

// Misma silla que la que rueda (la del obstaculo), pero quieta.
function artDeskChair(ctx, x, y) {
  px(ctx, x + 3, y + 3, 10, 7, '#3f4a5c');
  px(ctx, x + 4, y + 4, 8, 5, '#55627a');
  px(ctx, x + 2, y + 1, 3, 9, '#2f3a4a');
  px(ctx, x + 6, y + 10, 4, 3, '#6f757f');
  px(ctx, x + 2, y + 12, 4, 4, '#241a2b');
  px(ctx, x + 10, y + 12, 4, 4, '#241a2b');
  px(ctx, x + 3, y + 13, 2, 2, '#55555f');
  px(ctx, x + 11, y + 13, 2, 2, '#55555f');
}

const DECOR_ART = {
  car: artCar,
  parkSign: artParkSign,
  plant: artPlant,
  boxes: artBoxes,
  cables: artCables,
  logoWall: artLogoWall,
  arch: artArch,
  terraceTable: artTerraceTable,
  vending: artVending,
  cooler: artCooler,
  pineapple: artPineapple,
  ball: artBall,
  duck: artDuck,
  headphones: artHeadphones,
  thermos: artThermos,
  deskChair: artDeskChair,
  rack: artRack,
  printer: artPrinter,
  desk: artDesk,
};

const PLATFORM_ART = {
  pallet: artPallet,
  counter: artCounter,
  bench: artBench,
  shelf: artShelf,
  desk: artDesk,
  rack: artRack,
  step: artStep,
  terrace: artTerrace,
  pingpong: artPingpong,
  lockers: artLockers,
};

// ---------- dibujo del nivel ----------

function drawSceneBackground(ctx, scene, camX) {
  const x0 = scene.start * TILE;
  const w = scene.width * TILE;
  px(ctx, x0, 0, w, VIEW_H, scene.theme.back);

  if (scene.theme.outdoor) {
    for (let i = 0; i < w; i += 64) {
      px(ctx, x0 + i + 8, 30, 38, 14, scene.theme.backFar);
      px(ctx, x0 + i + 20, 18, 18, 14, scene.theme.backFar);
    }
  } else {
    // techo con lámparas, para que el aire de arriba no quede vacío
    px(ctx, x0, 0, w, 10, scene.theme.backFar);
    px(ctx, x0, 10, w, 2, scene.theme.dark ? '#1b232e' : '#a89c88');
    for (let i = 0; i < w; i += 56) {
      px(ctx, x0 + i + 22, 12, 4, 5, scene.theme.dark ? '#1b232e' : '#a89c88');
      px(ctx, x0 + i + 16, 17, 16, 5, scene.theme.dark ? '#2b3644' : '#cfc6b4');
      px(ctx, x0 + i + 18, 19, 12, 3, scene.theme.dark ? '#5f7d8f' : '#fff6d8');
    }
    for (let i = 0; i < w; i += 48) {
      px(ctx, x0 + i + 10, 34, 26, 22, scene.theme.backFar);
      px(ctx, x0 + i + 12, 36, 22, 18, scene.theme.dark ? '#1f2833' : '#e8e3d8');
      px(ctx, x0 + i + 22, 36, 2, 18, scene.theme.backFar);
    }
  }
  px(ctx, x0, GROUND_ROW * TILE - 2, w, 2, scene.theme.backFar);
}

function drawTiles(ctx, camX) {
  const c0 = Math.max(0, Math.floor(camX / TILE) - 1);
  const c1 = Math.min(LEVEL.width - 1, Math.floor((camX + VIEW_W) / TILE) + 1);
  for (let col = c0; col <= c1; col++) {
    const scene = sceneAtCol(col);
    for (let row = 0; row < SCENE_H; row++) {
      const ch = LEVEL.grid[row][col];
      if (ch === ' ') continue;
      const x = col * TILE;
      const y = row * TILE;
      if (row >= GROUND_ROW) {
        px(ctx, x, y, TILE, TILE, scene.theme.floorBody);
        if (row === GROUND_ROW) {
          px(ctx, x, y, TILE, 4, scene.theme.floorTop);
          px(ctx, x, y + 4, TILE, 1, scene.theme.floorLine);
        }
        if (scene.theme.outdoor && row === GROUND_ROW && col % 4 === 0) {
          px(ctx, x + 6, y + 8, 4, 2, '#8a8f98');
        }
      }
    }
  }
}

function drawPlatforms(ctx, camX) {
  LEVEL.scenes.forEach(function (scene) {
    const sx = scene.start * TILE;
    if (sx + scene.width * TILE < camX - 32 || sx > camX + VIEW_W + 32) return;
    (scene.platforms || []).forEach(function (p) {
      const art = PLATFORM_ART[p.art];
      if (!art) return;
      const x = (scene.start + p.col) * TILE;
      const y = p.row * TILE;
      const h = p.type === 'solid' ? Math.max(1, GROUND_ROW - p.row) : 1;
      art(ctx, x, y, p, p.w, h);
    });
  });
}

// La decoracion se dibuja atenuada a proposito: si se ve apagada, no tiene colision.
function drawDecor(ctx, camX) {
  ctx.save();
  ctx.globalAlpha = 0.5;
  LEVEL.scenes.forEach(function (scene) {
    const sx = scene.start * TILE;
    if (sx + scene.width * TILE < camX - 64 || sx > camX + VIEW_W + 64) return;
    (scene.decor || []).forEach(function (d) {
      const art = DECOR_ART[d.art];
      if (!art) return;
      art(ctx, (scene.start + d.col) * TILE, d.row * TILE, d);
    });
  });
  ctx.restore();
}

function drawLevel(ctx, camX) {
  LEVEL.scenes.forEach(function (scene) {
    const sx = scene.start * TILE;
    if (sx + scene.width * TILE < camX - 32 || sx > camX + VIEW_W + 32) return;
    drawSceneBackground(ctx, scene, camX);
  });
  drawDecor(ctx, camX);
  drawTiles(ctx, camX);
  drawPlatforms(ctx, camX);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TILE, VIEW_W, VIEW_H, SCENE_H, GROUND_ROW, LEVEL, LEVEL_W, tileAt, sceneAtCol };
}
