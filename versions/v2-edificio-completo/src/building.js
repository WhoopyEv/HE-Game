const FLOOR_W = 32;
const FLOOR_H = 19;
const TERRACE_H = 15;

const ELEV = { col: 15, row: 1 };
const ELEV_SPAWN = { col: 15, row: 2 };
const OFFICE_DOOR_ROWS = [6, 7];
const REQUIRED_TOTAL = 6;
const MONITOR_KINDS = ['crt', 'flat', 'laptop'];

function grid(w, h, ch) {
  const rows = [];
  for (let r = 0; r < h; r++) {
    const row = [];
    for (let c = 0; c < w; c++) row.push(ch);
    rows.push(row);
  }
  return rows;
}

function put(g, col, row, ch) {
  if (g[row] && col >= 0 && col < g[row].length) g[row][col] = ch;
}

function fill(g, x0, y0, x1, y1, ch) {
  for (let r = y0; r <= y1; r++) {
    for (let c = x0; c <= x1; c++) put(g, c, r, ch);
  }
}

function shell() {
  const g = grid(FLOOR_W, FLOOR_H, ' ');
  fill(g, 0, 0, 31, 14, '.');
  fill(g, 0, 0, 31, 0, '#');
  fill(g, 0, 14, 31, 14, '#');
  fill(g, 0, 0, 0, 14, '#');
  fill(g, 31, 0, 31, 14, '#');
  fill(g, 13, 0, 13, 14, '#');
  fill(g, 18, 0, 18, 14, '#');
  OFFICE_DOOR_ROWS.forEach(function (r) {
    put(g, 13, r, 'T');
    put(g, 18, r, 'T');
  });
  put(g, ELEV.col, ELEV.row, 'L');
  put(g, ELEV.col + 1, ELEV.row, 'L');
  fill(g, 13, 15, 18, 18, '#');
  fill(g, 14, 15, 17, 17, '.');
  put(g, 15, 14, 'T');
  put(g, 16, 14, 'T');
  put(g, 14, 15, 'N');
  put(g, 17, 15, 'A');
  return g;
}

function baseZones() {
  return [
    [14, 1, 17, 13, ','],
    [14, 14, 17, 17, ';'],
  ];
}

function room(g, x0, x1, doorCol, y0, y1) {
  for (let c = x0; c <= x1; c++) if (g[y0 - 1][c] !== '#') put(g, c, y0 - 1, '|');
  for (let r = y0; r <= y1; r++) {
    if (g[r][x0] !== '#') put(g, x0, r, '|');
    if (g[r][x1] !== '#') put(g, x1, r, '|');
  }
  fill(g, x0 + 1, y0, x1 - 1, y1, '.');
  put(g, doorCol, y0 - 1, 'T');
}

function agentAt(floorN, col, row) {
  const s = (col * 5 + row * 3 + floorN * 7) % 12;
  const npc = {
    kind: 'agent',
    style: 'agent' + s,
    col: col,
    row: row,
    role: 'none',
    monitor: MONITOR_KINDS[(col + row) % 3],
  };
  if ((col * 3 + row + floorN) % 5 === 0) npc.item = 'mug';
  return npc;
}

function supervisorAt(floorN, col, row, i) {
  return {
    kind: 'supervisor',
    style: 'sup' + ((i + floorN) % 4),
    col: col,
    row: row,
    role: 'none',
    monitor: 'flat',
  };
}

// Una persona de logistica en el pasillo, cerca de la puerta de la oficina.
function corridorStaff(g, floorN) {
  return {
    id: 'logistica',
    kind: 'logistica',
    style: floorN % 2 === 0 ? 'logistica' : 'logistica2',
    col: 16,
    row: 8,
    role: 'none',
    stand: true,
  };
}

const OFFICE_VARIANTS = [
  [[1, 13, 'X'], [19, 1, 'B'], [30, 1, 'W'], [30, 13, 'P']],
  [[1, 1, 'P'], [12, 13, 'X'], [19, 1, 'P'], [30, 1, 'B']],
  [[1, 13, 'B'], [19, 1, 'W'], [30, 1, 'P'], [30, 13, 'X']],
  [[1, 1, 'X'], [12, 13, 'P'], [19, 1, 'B'], [30, 1, 'W']],
  [[1, 13, 'P'], [19, 1, 'X'], [30, 1, 'W'], [30, 13, 'W']],
];

// Personalizacion de cubiculos. Todos tienen el mismo espacio de mesa; solo
// algunas personas tienen objeto o mensaje propio.
//   item: pineapple | headphones | duck | ball | mug | plant
//   id:   si se pone, la persona habla; el texto va en MESSAGES.extras[id]
const PERSONAL = {
  3: [
    { col: 20, row: 1, item: 'pineapple' },
    { col: 21, row: 1, item: 'headphones' },
    { col: 22, row: 1, item: 'duck' },
    { col: 23, row: 1, item: 'ball' },
  ],
};

function officeFloor(n) {
  const g = shell();
  const npcs = [];

  [2, 5, 8, 11].forEach(function (agentRow, i) {
    const deskRow = agentRow + 1;
    fill(g, 2, deskRow, 8, deskRow, 'D');
    fill(g, 10, deskRow, 11, deskRow, 'D');
    for (let c = 2; c <= 8; c++) npcs.push(agentAt(n, c, agentRow));
    npcs.push(supervisorAt(n, 10, agentRow, i));
  });

  [1, 4, 7].forEach(function (agentRow, i) {
    const deskRow = agentRow + 1;
    fill(g, 20, deskRow, 26, deskRow, 'D');
    fill(g, 28, deskRow, 29, deskRow, 'D');
    for (let c = 20; c <= 26; c++) npcs.push(agentAt(n, c, agentRow));
    npcs.push(supervisorAt(n, 28, agentRow, i + 1));
  });

  room(g, 19, 24, 21, 11, 13);
  room(g, 25, 30, 27, 11, 13);
  fill(g, 21, 13, 22, 13, 'd');
  fill(g, 27, 13, 28, 13, 'd');

  npcs.push({
    id: 'mgr' + n,
    kind: 'manager',
    style: 'mgr' + n,
    col: 21,
    row: 12,
    role: 'required',
  });

  npcs.push(corridorStaff(g, n));

  OFFICE_VARIANTS[(n - 3) % OFFICE_VARIANTS.length].forEach(function (v) {
    put(g, v[0], v[1], v[2]);
  });
  put(g, 12, 1, 'V');

  (PERSONAL[n] || []).forEach(function (o) {
    npcs.forEach(function (np) {
      if (np.col !== o.col || np.row !== o.row) return;
      if (o.item) np.item = o.item;
      if (o.style) np.style = o.style;
      if (o.id) {
        np.id = o.id;
        np.role = 'optional';
      }
    });
  });

  return {
    n: n,
    w: FLOOR_W,
    h: FLOOR_H,
    rows: g,
    base: '.',
    zones: baseZones().concat([
      [20, 11, 23, 13, '"'],
      [26, 11, 29, 13, '"'],
    ]),
    npcs: npcs,
    decor: [{ art: 'chairDown', col: 27, row: 12 }],
    decorTop: [
      { art: 'mug', col: 22, row: 13 },
      { art: 'tableItems', col: 27, row: 13 },
    ],
    label: 'PISO ' + n,
    elevLabel: '',
    spawn: ELEV_SPAWN,
  };
}

function floor1() {
  const g = shell();
  const npcs = [];

  // entrada del edificio en la pared izquierda
  fill(g, 0, 7, 0, 9, '|');
  // unica mesa de recepcion, arriba a la izquierda
  fill(g, 2, 3, 6, 3, 'c');
  put(g, 1, 1, 'P');
  put(g, 12, 1, 'P');
  put(g, 12, 13, 'P');

  npcs.push({ id: 'recep', kind: 'staff', style: 'staff2', col: 4, row: 2, role: 'none', monitor: 'flat' });
  npcs.push({ id: 'marce', kind: 'marce', style: 'marce', col: 7, row: 7, role: 'mission', stand: true });
  npcs.push({ id: 'brandon', kind: 'manager', style: 'brandon', col: 10, row: 5, role: 'optional', stand: true });
  npcs.push({ id: 'porteria', kind: 'portero', style: 'portero', col: 2, row: 7, role: 'optional', stand: true });

  // servicios generales, reunidos junto a la entrada
  [[3, 10, 'aseo'], [4, 10, 'aseo2'], [3, 11, 'aseo3'], [4, 11, 'aseo4']].forEach(function (a) {
    npcs.push({
      id: 'aseo',
      kind: 'aseo',
      style: a[2],
      col: a[0],
      row: a[1],
      role: 'optional',
      stand: true,
    });
  });

  fill(g, 20, 1, 27, 1, 'K');
  put(g, 28, 1, 'W');
  put(g, 29, 1, 'V');
  put(g, 30, 1, 'F');
  put(g, 19, 1, 'P');
  put(g, 30, 13, 'P');
  fill(g, 21, 5, 25, 6, 'Z');
  fill(g, 20, 9, 21, 10, 'M');
  fill(g, 24, 9, 25, 10, 'M');
  fill(g, 28, 9, 29, 10, 'M');

  npcs.push({ id: 'ping1', kind: 'ping', style: 'pingpongA', col: 20, row: 5, dy: 8, role: 'none', stand: true });
  npcs.push({ id: 'ping2', kind: 'ping', style: 'pingpongB', col: 26, row: 5, dy: 8, role: 'none', stand: true, flip: true });

  npcs.push(corridorStaff(g, 1));

  return {
    n: 1,
    w: FLOOR_W,
    h: FLOOR_H,
    rows: g,
    base: '.',
    zones: baseZones().concat([[19, 1, 30, 13, '~']]),
    npcs: npcs,
    ping: { aCol: 20, bCol: 26, row: 5 },
    decor: [
      { art: 'chairDown', col: 8, row: 9 },
      { art: 'chairDown', col: 9, row: 9 },
      { art: 'chairUp', col: 20, row: 8 },
      { art: 'chairUp', col: 24, row: 8 },
      { art: 'chairUp', col: 28, row: 8 },
      { art: 'chairDown', col: 20, row: 11 },
      { art: 'chairDown', col: 24, row: 11 },
      { art: 'chairDown', col: 28, row: 11 },
    ],
    decorTop: [
      { art: 'logo', col: 3, row: 1 },
      { art: 'clock', col: 10, row: 0 },
      { art: 'mop', col: 5, row: 11 },
      { art: 'pingNet', col: 23, row: 5 },
      { art: 'mug', col: 21, row: 9 },
      { art: 'tableItems', col: 25, row: 9 },
    ],
    label: 'PISO 1 · RECEPCIÓN Y BIENESTAR',
    elevLabel: 'RECEPCIÓN · BIENESTAR',
    spawn: { col: 1, row: 8 },
  };
}

function floor2() {
  const g = shell();
  const npcs = [];

  fill(g, 1, 2, 1, 6, 'S');
  fill(g, 4, 3, 7, 3, 'D');
  fill(g, 4, 6, 7, 6, 'D');
  put(g, 12, 1, 'V');
  put(g, 1, 8, 'P');
  put(g, 2, 8, 'X');

  npcs.push({ id: 'ti1', kind: 'staff', style: 'staff2', col: 4, row: 2, role: 'none', monitor: 'crt' });
  npcs.push({ id: 'ti2', kind: 'staff', style: 'staff3', col: 6, row: 2, role: 'none', monitor: 'flat', item: 'plant' });
  npcs.push({ id: 'ti3', kind: 'staff', style: 'staff1', col: 5, row: 5, role: 'none', monitor: 'laptop' });
  npcs.push({ id: 'ti4', kind: 'staff', style: 'staff0', col: 7, row: 5, role: 'none', monitor: 'flat', item: 'mug' });

  room(g, 0, 5, 2, 11, 13);
  room(g, 5, 9, 7, 11, 13);
  room(g, 9, 13, 11, 11, 13);
  fill(g, 2, 13, 3, 13, 'd');
  fill(g, 6, 13, 8, 13, 'R');
  fill(g, 6, 12, 7, 12, 'M');
  fill(g, 10, 13, 12, 13, 'R');
  fill(g, 10, 12, 11, 12, 'M');

  npcs.push({ id: 'mgrTi', kind: 'manager', style: 'mgrTi', col: 2, row: 12, role: 'optional' });

  fill(g, 25, 1, 25, 5, '|');
  fill(g, 25, 5, 30, 5, '|');
  put(g, 27, 5, 'T');
  fill(g, 26, 1, 30, 4, '.');
  fill(g, 26, 2, 29, 2, 'd');
  put(g, 30, 4, 'P');

  npcs.push({ id: 'sergio', kind: 'manager', style: 'sergio', col: 27, row: 3, role: 'required' });

  fill(g, 20, 3, 22, 3, 'D');
  fill(g, 20, 7, 22, 7, 'D');
  put(g, 24, 1, 'B');
  put(g, 30, 7, 'P');

  npcs.push({ id: 'rh1', kind: 'staff', style: 'staff1', col: 20, row: 2, role: 'none', monitor: 'flat' });
  npcs.push({ id: 'rh2', kind: 'staff', style: 'staff0', col: 22, row: 2, role: 'none', monitor: 'laptop', item: 'mug' });
  npcs.push({ id: 'rh3', kind: 'staff', style: 'staff3', col: 21, row: 6, role: 'none', monitor: 'flat' });

  room(g, 18, 23, 20, 11, 13);
  room(g, 23, 27, 25, 11, 13);
  room(g, 27, 31, 29, 11, 13);
  fill(g, 20, 13, 21, 13, 'd');
  fill(g, 25, 13, 26, 13, 'd');
  fill(g, 29, 13, 30, 13, 'd');

  npcs.push({ id: 'mgrRh1', kind: 'manager', style: 'mgrRh1', col: 20, row: 12, role: 'optional' });
  npcs.push({ id: 'mgrRh2', kind: 'manager', style: 'mgrRh2', col: 25, row: 12, role: 'optional' });
  npcs.push({ id: 'mgrRh3', kind: 'manager', style: 'mgrRh3', col: 29, row: 12, role: 'optional' });

  npcs.push(corridorStaff(g, 2));

  return {
    n: 2,
    w: FLOOR_W,
    h: FLOOR_H,
    rows: g,
    base: '.',
    zones: baseZones().concat([
      [1, 11, 4, 13, '"'],
      [6, 11, 8, 13, ':'],
      [10, 11, 12, 13, ':'],
      [26, 1, 30, 4, '"'],
      [19, 11, 22, 13, '"'],
      [24, 11, 26, 13, '"'],
      [28, 11, 30, 13, '"'],
    ]),
    npcs: npcs,
    decor: [
      { art: 'chairUp', col: 6, row: 11 },
      { art: 'chairUp', col: 10, row: 11 },
      { art: 'chairDown', col: 27, row: 7 },
      { art: 'chairDown', col: 28, row: 7 },
      { art: 'chairUp', col: 27, row: 8 },
      { art: 'chairUp', col: 28, row: 8 },
    ],
    decorTop: [
      { art: 'painting', col: 29, row: 0 },
      { art: 'nameplate', col: 26, row: 5 },
      { art: 'mug', col: 26, row: 2 },
      { art: 'tableItems', col: 7, row: 12 },
      { art: 'clock', col: 19, row: 0 },
    ],
    label: 'PISO 2 · TI Y RECURSOS HUMANOS',
    elevLabel: 'TI · RECURSOS HUMANOS',
    spawn: ELEV_SPAWN,
  };
}

function floor8() {
  const g = grid(FLOOR_W, TERRACE_H, 'g');
  fill(g, 0, 0, 31, 0, 'Y');
  fill(g, 0, 14, 31, 14, 'Y');
  fill(g, 0, 0, 0, 14, 'Y');
  fill(g, 31, 0, 31, 14, 'Y');

  fill(g, 14, 0, 17, 0, '#');
  put(g, 14, 1, '#');
  put(g, 17, 1, '#');
  put(g, 14, 2, '#');
  put(g, 17, 2, '#');
  put(g, ELEV.col, ELEV.row, 'L');
  put(g, ELEV.col + 1, ELEV.row, 'L');

  // tienda de Marce, pegada a la esquina superior izquierda
  fill(g, 2, 2, 6, 2, 'c');
  put(g, 1, 1, 'F');
  put(g, 6, 1, 'B');

  // mesas verticales a la derecha
  const RIGHT_TABLES = [[21, 3], [24, 3], [27, 3], [21, 7], [24, 7], [27, 7], [27, 11]];
  RIGHT_TABLES.forEach(function (t) {
    fill(g, t[0], t[1], t[0], t[1] + 1, 'm');
  });
  // mesitas debajo de la tienda
  const SMALL_TABLES = [[2, 7], [6, 9]];
  SMALL_TABLES.forEach(function (t) {
    put(g, t[0], t[1], 'm');
  });

  [
    [9, 1], [12, 1], [19, 1], [30, 1],
    [1, 6], [1, 10], [30, 7], [30, 10],
    [9, 13], [13, 13], [19, 13], [24, 13], [30, 13],
  ].forEach(function (pos) {
    put(g, pos[0], pos[1], 'P');
  });

  const npcs = [
    { id: 'marce', kind: 'marce', style: 'marce', col: 4, row: 3, role: 'mission', stand: true },
  ];

  // sillas a los lados de cada mesa
  const CHAIR_COLORS = ['Y', 'W', 'B'];
  const chairs = [];
  RIGHT_TABLES.forEach(function (t, i) {
    const c = CHAIR_COLORS[i % CHAIR_COLORS.length];
    const alt = CHAIR_COLORS[(i + 1) % CHAIR_COLORS.length];
    chairs.push({ art: 'chair' + c + 'd', col: t[0] - 1, row: t[1] });
    chairs.push({ art: 'chair' + alt + 'd', col: t[0] - 1, row: t[1] + 1 });
    chairs.push({ art: 'chair' + alt + 'd', col: t[0] + 1, row: t[1] });
    chairs.push({ art: 'chair' + c + 'd', col: t[0] + 1, row: t[1] + 1 });
  });
  SMALL_TABLES.forEach(function (t, i) {
    const c = CHAIR_COLORS[i % CHAIR_COLORS.length];
    chairs.push({ art: 'chair' + c + 'd', col: t[0] - 1, row: t[1] });
    chairs.push({ art: 'chairWd', col: t[0] + 1, row: t[1] });
  });

  const hearts = [];
  [[3, 0], [8, 0], [12, 0], [20, 0], [25, 0], [29, 0]].forEach(function (p) {
    hearts.push({ art: 'heart', col: p[0], row: p[1] });
  });
  [[0, 5], [0, 9], [0, 13], [31, 4], [31, 8], [31, 12]].forEach(function (p) {
    hearts.push({ art: 'heart', col: p[0], row: p[1] });
  });
  [[6, 14], [13, 14], [20, 14], [26, 14]].forEach(function (p) {
    hearts.push({ art: 'heart', col: p[0], row: p[1] });
  });

  return {
    n: 8,
    w: FLOOR_W,
    h: TERRACE_H,
    rows: g,
    base: 'g',
    zones: [
      [1, 1, 7, 4, '%'],
      [14, 1, 17, 4, '%'],
    ],
    npcs: npcs,
    decor: chairs,
    decorTop: hearts.concat([
      { art: 'menu', col: 3, row: 0 },
      { art: 'coffee', col: 2, row: 1 },
      { art: 'pastry', col: 5, row: 1 },
      { art: 'cups', col: 3, row: 2 },
      { art: 'mug', col: 5, row: 2 },
      { art: 'mug', col: 27, row: 3 },
      { art: 'cups', col: 21, row: 7 },
    ]),
    label: 'PISO 8 · TERRAZA',
    elevLabel: 'TERRAZA',
    spawn: ELEV_SPAWN,
  };
}

const FINALE_CROWD = [
  { style: 'sergioStand', col: 16, row: 10 },
  { style: 'mgr7Stand', col: 11, row: 11 },
  { style: 'mgr3Stand', col: 13, row: 11 },
  { style: 'mgr4Stand', col: 15, row: 11 },
  { style: 'mgr5Stand', col: 17, row: 11 },
  { style: 'mgr6Stand', col: 19, row: 11 },
  { style: 'agent0Stand', col: 9, row: 11 },
  { style: 'agent3Stand', col: 21, row: 11 },
  { style: 'mgrRh1Stand', col: 10, row: 12 },
  { style: 'aseoStand', col: 12, row: 12 },
  { style: 'brandonStand', col: 14, row: 12 },
  { style: 'mgrTiStand', col: 18, row: 12 },
  { style: 'aseo2Stand', col: 20, row: 12 },
  { style: 'mgrRh2Stand', col: 22, row: 12 },
  { style: 'agent5Stand', col: 8, row: 12 },
  { style: 'logisticaStand', col: 24, row: 12 },
];

const MARCE_FINALE_SPOT = { col: 16, row: 12 };

const BUILDING = [floor1(), floor2()];
for (let n = 3; n <= 7; n++) BUILDING.push(officeFloor(n));
BUILDING.push(floor8());

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BUILDING, ELEV, ELEV_SPAWN, REQUIRED_TOTAL, FINALE_CROWD, MARCE_FINALE_SPOT };
}
