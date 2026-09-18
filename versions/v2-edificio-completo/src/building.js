const FLOOR_W = 40;
const FLOOR_H = 19;
const TERRACE_H = 15;

const ELEV = { col: 15, row: 1 };
const ELEV_SPAWN = { col: 15, row: 2 };
const OFFICE_DOOR_ROWS = [6, 7];
const MONITOR_KINDS = ['crt', 'flat', 'laptop'];

// El piso de la terraza dentro de BUILDING (se desbloquea con las cinco piezas).
const TERRACE_IDX = 2;

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

// Baño + ascensor + muros exteriores: lo que comparten todos los pisos.
function baseShell() {
  const g = grid(FLOOR_W, FLOOR_H, ' ');
  fill(g, 0, 0, FLOOR_W - 1, 14, '.');
  fill(g, 0, 0, FLOOR_W - 1, 0, '#');
  fill(g, 0, 14, FLOOR_W - 1, 14, '#');
  fill(g, 0, 0, 0, 14, '#');
  fill(g, FLOOR_W - 1, 0, FLOOR_W - 1, 14, '#');
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

// Recepción: mantiene los dos muros que separan recepción, pasillo y bienestar.
function shell() {
  const g = baseShell();
  fill(g, 13, 0, 13, 14, '#');
  fill(g, 18, 0, 18, 14, '#');
  OFFICE_DOOR_ROWS.forEach(function (r) {
    put(g, 13, r, 'T');
    put(g, 18, r, 'T');
  });
  return g;
}

function baseZones() {
  return [
    [14, 1, 17, 13, ','],
    [14, 14, 17, 17, ';'],
  ];
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

// Cuarto cerrado (la sala de juntas). Deja la pared de vidrio y una puerta.
function room(g, x0, x1, doorCol, y0, y1) {
  for (let c = x0; c <= x1; c++) if (g[y0 - 1][c] !== '#') put(g, c, y0 - 1, '|');
  for (let r = y0; r <= y1; r++) {
    if (g[r][x0] !== '#') put(g, x0, r, '|');
    if (g[r][x1] !== '#') put(g, x1, r, '|');
  }
  fill(g, x0 + 1, y0, x1 - 1, y1, '.');
  put(g, doorCol, y0 - 1, 'T');
}

// Logística en el pasillo, pegado a la pared.
function corridorStaff(floorN) {
  return {
    id: 'logistica',
    kind: 'logistica',
    style: floorN % 2 === 0 ? 'logistica' : 'logistica2',
    col: 14,
    row: 8,
    role: 'none',
    stand: true,
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

  npcs.push({ id: 'recep', kind: 'staff', style: 'recep', col: 4, row: 2, role: 'none', monitor: 'flat' });
  npcs.push({ id: 'sergio', kind: 'boss', style: 'sergioBoss', col: 7, row: 7, role: 'mission', stand: true, side: 'bow' });
  // Yesica siempre al lado de Sergio: hablarle a él es hablarles a los dos.
  npcs.push({ id: 'yesica', kind: 'boss', style: 'yesica', col: 8, row: 7, role: 'none', stand: true });
  npcs.push({ id: 'brandon', kind: 'manager', style: 'brandon', col: 8, row: 4, role: 'optional', stand: true });
  // el de la entrada tambien es de logistica
  npcs.push({ id: 'porteria', kind: 'logistica', style: 'logistica2', col: 2, row: 7, role: 'optional', stand: true });
  // Danilo, de perfil, caminando por recepción con su propio contoneo.
  npcs.push({ id: 'danilo', kind: 'guest', style: 'danilo', col: 2, row: 9, role: 'optional', stand: true, hipSway: true, shine: true });

  // servicios generales, en la esquina de abajo a la derecha del lobby
  [[10, 10, 'aseo'], [11, 10, 'aseo2'], [10, 11, 'aseo3'], [11, 11, 'aseo4']].forEach(function (a) {
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

  // bienestar: casilleros arriba y abajo, y mesas para más gente
  fill(g, 20, 1, 32, 1, 'K');
  fill(g, 21, 13, 32, 13, 'K');
  // casilleros también contra la pared del pasillo (dejando libres las puertas)
  fill(g, 19, 2, 19, 5, 'K');
  fill(g, 19, 9, 19, 12, 'K');
  put(g, 33, 1, 'W');
  put(g, 35, 1, 'V');
  put(g, 37, 1, 'F');
  put(g, 38, 13, 'P');
  put(g, 31, 7, 'P');
  fill(g, 21, 5, 25, 6, 'Z');
  // mesas blancas de bienestar
  fill(g, 20, 9, 21, 10, 'm');
  fill(g, 24, 9, 25, 10, 'm');
  fill(g, 28, 9, 29, 10, 'm');
  fill(g, 33, 9, 34, 10, 'm');
  fill(g, 37, 9, 38, 10, 'm');
  fill(g, 33, 4, 34, 5, 'm');
  fill(g, 37, 4, 38, 5, 'm');

  npcs.push({ id: 'ping1', kind: 'ping', style: 'pingpongA', col: 20, row: 5, dy: 8, role: 'none', stand: true });
  npcs.push({ id: 'josue', kind: 'logistica', style: 'josue', col: 26, row: 5, dy: 8, role: 'optional', stand: true, flip: true });

  npcs.push({ id: 'robot', kind: 'robot', style: 'robot', col: 2, row: 12, role: 'optional', stand: true, ghost: true });

  // Gente de bienestar en sus propias actividades: sentados almorzando, con
  // audífonos o de pie conversando, repartidos por las mesas del piso.
  npcs.push({ id: 'wel1', kind: 'bienestar', style: 'agent3', col: 20, row: 8, role: 'none', notes: true });
  npcs.push({ id: 'wel2', kind: 'bienestar', style: 'agent5', col: 24, row: 8, role: 'none', side: 'pineapple' });
  npcs.push({ id: 'wel3', kind: 'bienestar', style: 'agent7', col: 28, row: 11, role: 'none', side: 'mug' });
  npcs.push({ id: 'wel4', kind: 'bienestar', style: 'staff2', col: 33, row: 11, role: 'none', stand: true });
  npcs.push({ id: 'wel5', kind: 'bienestar', style: 'sup1', col: 37, row: 8, role: 'none' });
  npcs.push({ id: 'wel6', kind: 'bienestar', style: 'agent9', col: 35, row: 12, role: 'none', stand: true });
  npcs.push({ id: 'wel7', kind: 'bienestar', style: 'agent0', col: 33, row: 3, role: 'none', notes: true });
  npcs.push({ id: 'wel8', kind: 'bienestar', style: 'staff0', col: 37, row: 6, role: 'none', side: 'mug' });

  // Personas comiendo dorilocos, mismo mensaje para las tres (como aseo).
  npcs.push({ id: 'dorilocos', kind: 'bienestar', style: 'agent1', col: 28, row: 8, role: 'optional', side: 'chips' });
  npcs.push({ id: 'dorilocos', kind: 'bienestar', style: 'agent4', col: 20, row: 11, role: 'optional', side: 'chips' });
  npcs.push({ id: 'dorilocos', kind: 'bienestar', style: 'agent8', col: 37, row: 11, role: 'optional', side: 'chips' });

  npcs.push(corridorStaff(1));

  return {
    n: 1,
    w: FLOOR_W,
    h: FLOOR_H,
    rows: g,
    base: '.',
    zones: baseZones().concat([[19, 1, 38, 13, '~']]),
    npcs: npcs,
    ping: { aCol: 20, bCol: 26, row: 5 },
    robot: { col0: 2, col1: 7, row: 12, speed: 11 },
    patrols: [
      {
        id: 'danilo',
        points: [
          { col: 2, row: 9 },
          { col: 11, row: 9 },
        ],
        speed: 24,
      },
    ],
    decor: [
      { art: 'chairWu', col: 20, row: 8 },
      { art: 'chairYu', col: 24, row: 8 },
      { art: 'chairBu', col: 28, row: 8 },
      { art: 'chairWu', col: 33, row: 8 },
      { art: 'chairYu', col: 37, row: 8 },
      { art: 'chairBd', col: 20, row: 11 },
      { art: 'chairWd', col: 24, row: 11 },
      { art: 'chairYd', col: 28, row: 11 },
      { art: 'chairBd', col: 33, row: 11 },
      { art: 'chairWd', col: 37, row: 11 },
      { art: 'chairYu', col: 33, row: 3 },
      { art: 'chairBu', col: 37, row: 3 },
      { art: 'chairWd', col: 33, row: 6 },
      { art: 'chairYd', col: 37, row: 6 },
    ],
    decorTop: [
      { art: 'logo', col: 3, row: 1 },
      { art: 'clock', col: 10, row: 0 },
      { art: 'mop', col: 9, row: 10 },
      { art: 'pingNet', col: 23, row: 5 },
      { art: 'mug', col: 21, row: 9 },
      { art: 'tableItems', col: 25, row: 9 },
      { art: 'cups', col: 33, row: 9 },
      { art: 'mug', col: 37, row: 4 },
    ],
    label: 'PISO 1 · RECEPCIÓN Y BIENESTAR',
    elevLabel: 'RECEPCIÓN · BIENESTAR',
    spawn: { col: 1, row: 8 },
  };
}

// Operaciones es más grande que los otros pisos, sobre todo a lo alto.
const OPS_W = 40;
const OPS_BOTTOM = 20;
const OPS_H = OPS_BOTTOM + 5;

// Mesones largos: todos en la misma fila, sin puestos aparte para nadie.
const OPS_BANKS = [
  { col0: 2, col1: 12, row: 3 },
  { col0: 19, col1: 30, row: 3 },
  { col0: 2, col1: 12, row: 8 },
  { col0: 19, col1: 30, row: 8 },
  { col0: 2, col1: 10, row: 13 },
  { col0: 19, col1: 27, row: 13 },
];

// Los cinco del equipo, repartidos por todo el piso, lejos de la salida del
// ascensor para no taparle el paso a nadie; Felipe está dentro de la sala de juntas.
const OPS_DEVS = [
  { id: 'diana', col: 9, row: 2, piece: 'oportunidad', side: 'pineapple' },
  { id: 'nicolas', col: 36, row: 7, piece: 'aprendizaje', side: 'duck' },
  { id: 'daniel', col: 18, row: 11, piece: 'confianza', notes: true },
  { id: 'guillermo', col: 6, row: 17, piece: 'equipo', side: 'ball' },
  { id: 'felipe', col: 36, row: 17, piece: 'respaldo', side: 'phone' },
];

// Compañeros con mensaje opcional: [id, col, fila, estilo opcional]
const OPS_EXTRAS = [
  ['ops1', 4, 3],
  ['danielPardo', 12, 3],
  ['ops2', 25, 3],
  ['sebastian', 12, 8, 'sebastian'],
  ['frehynner', 30, 8, 'frehynner'],
  ['ops3', 29, 8],
  ['ops4', 5, 13],
  ['jonathan', 8, 13, 'jonathan'],
  ['ops5', 26, 13],
];

function opsShell() {
  const g = grid(OPS_W, OPS_H, ' ');
  fill(g, 0, 0, OPS_W - 1, OPS_BOTTOM, '.');
  fill(g, 0, 0, OPS_W - 1, 0, '#');
  fill(g, 0, OPS_BOTTOM, OPS_W - 1, OPS_BOTTOM, '#');
  fill(g, 0, 0, 0, OPS_BOTTOM, '#');
  fill(g, OPS_W - 1, 0, OPS_W - 1, OPS_BOTTOM, '#');
  put(g, ELEV.col, ELEV.row, 'L');
  put(g, ELEV.col + 1, ELEV.row, 'L');
  fill(g, 13, OPS_BOTTOM + 1, 18, OPS_BOTTOM + 4, '#');
  fill(g, 14, OPS_BOTTOM + 1, 17, OPS_BOTTOM + 3, '.');
  put(g, 15, OPS_BOTTOM, 'T');
  put(g, 16, OPS_BOTTOM, 'T');
  put(g, 14, OPS_BOTTOM + 1, 'N');
  put(g, 17, OPS_BOTTOM + 1, 'A');
  return g;
}

// Operaciones: una sola oficina grande y abierta, con la sala de juntas en la esquina.
function operaciones() {
  const g = opsShell();
  const npcs = [];
  const decor = [];

  OPS_BANKS.forEach(function (bank) {
    fill(g, bank.col0, bank.row + 1, bank.col1, bank.row + 1, 'D');
    for (let c = bank.col0; c <= bank.col1; c++) npcs.push(agentAt(2, c, bank.row));
  });

  OPS_DEVS.forEach(function (d) {
    npcs.push({
      id: d.id,
      kind: 'dev',
      style: d.id,
      col: d.col,
      row: d.row,
      role: 'required',
      piece: d.piece,
      side: d.side || null,
      notes: !!d.notes,
      stand: true,
    });
  });

  OPS_EXTRAS.forEach(function (o) {
    npcs.forEach(function (n) {
      if (n.col === o[1] && n.row === o[2]) {
        n.id = o[0];
        n.role = 'optional';
        if (o[3]) n.style = o[3];
      }
    });
  });

  // el de logística saluda al lado del ascensor
  npcs.push({ id: 'logisticaOps', kind: 'logistica', style: 'logistica', col: 17, row: 1, role: 'optional', stand: true });
  // el de la cara de zorro anda de ronda por todo el piso, arrancando abajo (ver zorroPatrol más abajo)
  npcs.push({ id: 'zorro', kind: 'logistica', style: 'zorro', col: 14, row: 11, role: 'optional', stand: true });

  // rincón del café, arriba a la izquierda
  fill(g, 1, 1, 4, 1, 'c');
  // zona de máquinas, arriba a la derecha
  put(g, 35, 1, 'V');
  put(g, 36, 1, 'F');
  put(g, 38, 1, 'P');
  // dispensadores de agua repartidos por el piso
  [[6, 1], [14, 1], [21, 1], [28, 1], [1, 6], [38, 11], [1, 16]].forEach(function (w) {
    put(g, w[0], w[1], 'W');
  });

  // sala de juntas en la esquina de abajo a la derecha
  room(g, 30, 38, 34, 16, 19);
  fill(g, 32, 18, 35, 18, 'M');
  [32, 33, 34, 35].forEach(function (c) {
    decor.push({ art: 'chairUp', col: c, row: 17 });
    decor.push({ art: 'chairDown', col: c, row: 19 });
  });

  // detalles sueltos por el piso
  fill(g, 2, 19, 4, 19, 'R');
  fill(g, 21, 19, 23, 19, 'R');
  put(g, 1, 11, 'B');
  put(g, 12, 19, 'P');
  put(g, 8, 19, 'X');
  put(g, 22, 16, 'P');
  put(g, 22, 12, 'X');
  put(g, 19, 1, 'P');
  put(g, 28, 19, 'P');
  put(g, 38, 6, 'B');

  return {
    n: 2,
    w: OPS_W,
    h: OPS_H,
    rows: g,
    base: '.',
    zones: [
      [14, 1, 17, 19, ','],
      [14, OPS_BOTTOM, 17, OPS_H - 1, ';'],
      [1, 1, 5, 2, '%'],
      [31, 16, 37, 19, '"'],
    ],
    npcs: npcs,
    decor: decor,
    // Ronda de Zorro: un circuito por los pasillos abiertos del piso, sin cruzar
    // mesones ni la sala de juntas. Empieza abajo y sube.
    patrols: [
      {
        id: 'zorro',
        points: [
          { col: 14, row: 11 },
          { col: 14, row: 2 },
          { col: 37, row: 2 },
          { col: 37, row: 11 },
        ],
        speed: 42,
      },
    ],
    decorTop: [
      { art: 'menu', col: 2, row: 0 },
      { art: 'coffee', col: 1, row: 1 },
      { art: 'pastry', col: 3, row: 1 },
      { art: 'cups', col: 4, row: 1 },
      { art: 'logo', col: 24, row: 1 },
      { art: 'clock', col: 10, row: 0 },
      { art: 'banner', col: 8, row: 0 },
      { art: 'banner', col: 30, row: 0 },
      { art: 'heart', col: 5, row: 0 },
      { art: 'heart', col: 33, row: 0 },
      { art: 'tableItems', col: 33, row: 18 },
      { art: 'mug', col: 34, row: 18 },
      { art: 'nameplate', col: 34, row: 15 },
    ],
    label: 'PISO 2 · OPERACIONES',
    elevLabel: 'OPERACIONES',
    spawn: ELEV_SPAWN,
  };
}

// Toda la empresa arriba celebrando.
const TERRACE_PARTY = [
  { id: 'dianaT', style: 'diana', col: 8, row: 6, cloud: 'diana' },
  { id: 'danielT', style: 'daniel', col: 12, row: 6, cloud: 'daniel' },
  { id: 'nicolasT', style: 'nicolas', col: 16, row: 6, cloud: 'nicolas' },
  { id: 'guillermoT', style: 'guillermo', col: 20, row: 6, cloud: 'guillermo' },
  { id: 'felipeT', style: 'felipe', col: 24, row: 6, cloud: 'felipe' },
  { id: 'pt06', style: 'agent1', col: 28, row: 6 },
  { id: 'brandonT', style: 'brandon', col: 10, row: 9, cloud: 'brandon' },
  { id: 'aseoT', style: 'aseo', col: 14, row: 9, cloud: 'aseoT' },
  { id: 'porteroT', style: 'logistica2', col: 18, row: 9, cloud: 'porteroT' },
  { id: 'logisticaT', style: 'logistica', col: 22, row: 9, cloud: 'logisticaT' },
  { id: 'pt09a', style: 'agent4', col: 26, row: 9 },
  { id: 'pt09b', style: 'agent6', col: 30, row: 9 },
  { id: 'josueT', style: 'josue', col: 8, row: 11, cloud: 'josueT' },
  { id: 'pt11a', style: 'agent0', col: 12, row: 11 },
  { id: 'pt11b', style: 'agent3', col: 16, row: 11, cloud: 'agenteT' },
  { id: 'pt11c', style: 'staff1', col: 20, row: 11 },
  { id: 'pt11d', style: 'agent7', col: 24, row: 11 },
  { id: 'pt11e', style: 'aseo2', col: 28, row: 11 },
  { id: 'zorroT', style: 'zorro', col: 20, row: 3, cloud: 'zorroT' },
  { id: 'sebastianT', style: 'sebastian', col: 23, row: 3, cloud: 'sebastianT' },
  { id: 'pt03a', style: 'staff3', col: 26, row: 3 },
  { id: 'pt03b', style: 'agent11', col: 11, row: 3 },
  { id: 'pt03c', style: 'agent5', col: 8, row: 3 },
  { id: 'recepT', style: 'recep', col: 17, row: 3, cloud: 'recepT' },
  { id: 'pt13a', style: 'agent2', col: 11, row: 13 },
  { id: 'pt13b', style: 'agent8', col: 17, row: 13 },
  { id: 'pt13c', style: 'agent10', col: 23, row: 13 },
  { id: 'pt13d', style: 'sup0', col: 5, row: 13 },
  { id: 'pt13e', style: 'sup1', col: 20, row: 13 },
  { id: 'pt13f', style: 'sup2', col: 29, row: 13 },
  { id: 'pt03d', style: 'staff0', col: 3, row: 3 },
  { id: 'pt03e', style: 'agent9', col: 29, row: 3 },
  { id: 'pt06b', style: 'staff2', col: 3, row: 6 },
  { id: 'pt09c', style: 'sup3', col: 3, row: 9 },
  { id: 'pt11f', style: 'aseo3', col: 3, row: 11 },
];

function terraza() {
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

  // mesas a la derecha, lejos de donde se arma la celebración
  const RIGHT_TABLES = [[28, 3], [28, 8]];
  RIGHT_TABLES.forEach(function (t) {
    fill(g, t[0], t[1], t[0], t[1] + 1, 'm');
  });
  const SMALL_TABLES = [[2, 7], [4, 11]];
  SMALL_TABLES.forEach(function (t) {
    put(g, t[0], t[1], 'm');
  });

  [
    [9, 1], [12, 1], [19, 1], [30, 1],
    [1, 5], [1, 12], [30, 7], [30, 13],
    [8, 13], [14, 13], [21, 13], [26, 13],
  ].forEach(function (pos) {
    put(g, pos[0], pos[1], 'P');
  });

  const npcs = [
    { id: 'sergio', kind: 'boss', style: 'sergioBoss', col: 5, row: 4, role: 'mission', stand: true, side: 'bow' },
    { id: 'yesica', kind: 'boss', style: 'yesica', col: 6, row: 4, role: 'none', stand: true },
    // Marce, detrás de su propia tienda.
    { id: 'marce', kind: 'staff', style: 'marce', col: 4, row: 1, role: 'optional', stand: true },
    // Gente ya sentada en las mesas, para que la terraza no se vea vacía
    // mientras no se ha hablado con Sergio.
    { id: 'guest1', kind: 'guest', style: 'agent2', col: 1, row: 7, role: 'none' },
    { id: 'guest2', kind: 'guest', style: 'agent6', col: 5, row: 11, role: 'none' },
    { id: 'guest3', kind: 'guest', style: 'staff1', col: 27, row: 3, role: 'none' },
    { id: 'guest4', kind: 'guest', style: 'agent10', col: 29, row: 8, role: 'none' },
  ];

  TERRACE_PARTY.forEach(function (p) {
    npcs.push({
      id: p.id,
      kind: 'party',
      style: p.style,
      col: p.col,
      row: p.row,
      role: 'none',
      stand: true,
      party: true,
      cloud: p.cloud || null,
    });
  });

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
    n: 3,
    w: FLOOR_W,
    h: TERRACE_H,
    rows: g,
    base: 'g',
    arch: { x: 16, y: 4, scale: 1.9 },
    zones: [
      [1, 1, 7, 4, '%'],
      [14, 1, 17, 4, '%'],
    ],
    npcs: npcs,
    decor: chairs,
    decorTop: hearts.concat([
      { art: 'mural', col: 22, row: 1 },
      { art: 'menu', col: 3, row: 0 },
      { art: 'coffee', col: 2, row: 1 },
      { art: 'pastry', col: 5, row: 1 },
      { art: 'cups', col: 3, row: 2 },
      { art: 'mug', col: 5, row: 2 },
      { art: 'mug', col: 28, row: 3 },
      { art: 'cups', col: 28, row: 8 },
    ]),
    label: 'PISO 3 · TERRAZA',
    elevLabel: 'TERRAZA',
    spawn: ELEV_SPAWN,
  };
}

const BUILDING = [floor1(), operaciones(), terraza()];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BUILDING, ELEV, ELEV_SPAWN, TERRACE_IDX };
}
