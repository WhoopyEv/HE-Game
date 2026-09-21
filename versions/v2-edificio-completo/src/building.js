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

// Cuarto cerrado (la sala de juntas). Deja la pared de vidrio y una puerta de
// dos casillas (doorCol y doorCol + 1).
function room(g, x0, x1, doorCol, y0, y1) {
  for (let c = x0; c <= x1; c++) if (g[y0 - 1][c] !== '#') put(g, c, y0 - 1, '|');
  for (let r = y0; r <= y1; r++) {
    if (g[r][x0] !== '#') put(g, x0, r, '|');
    if (g[r][x1] !== '#') put(g, x1, r, '|');
  }
  fill(g, x0 + 1, y0, x1 - 1, y1, '.');
  put(g, doorCol, y0 - 1, 'T');
  put(g, doorCol + 1, y0 - 1, 'T');
}

// Oficina independiente colgada de un lado del rectángulo principal (derecho
// o izquierdo), igual que el baño cuelga de su pared de abajo: la pared
// compartida (wallCol) ya viene sólida de afuera, acá solo se le abre una
// puerta. x1 puede caer a cualquier lado de wallCol -- a la derecha (TI) o
// a la izquierda (RH) -- el relleno usa el rango sin importar el sentido.
// wide: puerta de dos casillas (doorRow y doorRow + 1) en vez de una sola.
function sidePod(g, wallCol, x1, y0, y1, doorRow, wide) {
  const lo = Math.min(wallCol, x1);
  const hi = Math.max(wallCol, x1);
  fill(g, lo, y0, hi, y0, '#');
  fill(g, lo, y1, hi, y1, '#');
  fill(g, x1, y0, x1, y1, '#');
  fill(g, lo + 1, y0 + 1, hi - 1, y1 - 1, '.');
  put(g, wallCol, doorRow, 'T');
  if (wide) put(g, wallCol, doorRow + 1, 'T');
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
  // más plantas recostadas a las paredes de recepción
  put(g, 1, 13, 'P');
  put(g, 9, 1, 'P');
  put(g, 12, 8, 'P');

  // Al lado del mostrador, no detrás -- así no la tapa el mueble.
  npcs.push({ id: 'recep', kind: 'staff', style: 'recep', col: 7, row: 3, role: 'none', stand: true });
  npcs.push({ id: 'sergio', kind: 'boss', style: 'sergioBoss', col: 7, row: 7, role: 'mission', stand: true, side: 'bow', flip: true });
  // Yesica siempre al lado de Sergio: hablarle a él es hablarles a los dos.
  npcs.push({ id: 'yesica', kind: 'boss', style: 'yesica', col: 8, row: 7, role: 'none', stand: true });
  npcs.push({ id: 'brandon', kind: 'manager', style: 'brandon', col: 11, row: 4, role: 'optional', stand: true });
  // el de la entrada tambien es de logistica
  npcs.push({ id: 'porteria', kind: 'logistica', style: 'porteria', col: 1, row: 6, role: 'optional', stand: true, scale: 1.15 });

  // servicios generales, en la esquina de abajo a la derecha del lobby
  [[10, 11, 'aseo'], [11, 11, 'aseo2'], [10, 12, 'aseo3'], [11, 12, 'aseo4']].forEach(function (a) {
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

  // alguien de aseo justo en la entrada del baño, con el mensaje del cuidado
  // de los baños -- acá y en operaciones (mismo baño, mismo lugar).
  npcs.push({ id: 'aseoBanos', kind: 'aseo', style: 'aseo2', col: 14, row: 13, role: 'optional', stand: true });

  // bienestar: casilleros arriba y abajo, y mesas para más gente
  fill(g, 20, 1, 32, 1, 'K');
  fill(g, 21, 13, 32, 13, 'K');
  // casilleros también contra la pared del pasillo (dejando libres las puertas)
  fill(g, 19, 2, 19, 5, 'K');
  put(g, 33, 1, 'W');
  put(g, 35, 1, 'V');
  put(g, 37, 1, 'F');
  put(g, 38, 13, 'P');
  // la maceta que quedaba suelta en la mitad del piso -- lejos de las puertas
  // del pasillo (filas 6 y 7) y de las canecas nuevas.
  put(g, 20, 12, 'P');
  fill(g, 24, 3, 28, 4, 'Z');
  // mesas blancas de bienestar -- las tres de abajo, un puesto a la derecha.
  fill(g, 21, 9, 22, 10, 'm');
  fill(g, 25, 9, 26, 10, 'm');
  fill(g, 29, 9, 30, 10, 'm');
  fill(g, 33, 9, 34, 10, 'm');
  fill(g, 37, 9, 38, 10, 'm');
  fill(g, 33, 4, 34, 5, 'm');
  fill(g, 37, 4, 38, 5, 'm');

  npcs.push({ id: 'ping1', kind: 'ping', style: 'pingpongA', col: 23, row: 3, dy: 8, role: 'none', stand: true, bounce: true });
  npcs.push({ id: 'josue', kind: 'logistica', style: 'josue', col: 29, row: 3, dy: 8, role: 'optional', stand: true, flip: true, bounce: true });

  npcs.push({ id: 'robot', kind: 'robot', style: 'robot', col: 2, row: 11, role: 'optional', stand: true, ghost: true });

  // Se ve desde antes de entrar a bienestar, junto al casillero; sale
  // corriendo hacia el ascensor si te quedás leyendo su mensaje (ver
  // updateBreakGuy en game.js), y ahí sí desaparece.
  npcs.push({ id: 'breakGuy', kind: 'bienestar', style: 'agent4', col: 20, row: 3, role: 'optional', stand: true });

  // Gente de bienestar en sus propias actividades: sentados almorzando, con
  // audífonos o de pie conversando, repartidos por las mesas del piso.
  // Las 3 mesas junto a donde estaban los casilleros: toda su gente, un puesto a la derecha.
  npcs.push({ id: 'wel1', kind: 'bienestar', style: 'agent3', col: 21, row: 8, role: 'none', notes: true });
  npcs.push({ id: 'wel2', kind: 'bienestar', style: 'agent5', col: 25, row: 8, role: 'none', side: 'pineapple' });
  npcs.push({ id: 'wel3', kind: 'bienestar', style: 'agent7', col: 29, row: 11, role: 'none', side: 'mug' });
  npcs.push({ id: 'wel4', kind: 'bienestar', style: 'staff2', col: 29, row: 8, role: 'none', stand: true });
  npcs.push({ id: 'wel5', kind: 'bienestar', style: 'sup1', col: 37, row: 8, role: 'none' });
  npcs.push({ id: 'wel6', kind: 'bienestar', style: 'agent9', col: 35, row: 12, role: 'none', stand: true });
  npcs.push({ id: 'wel7', kind: 'bienestar', style: 'agent0', col: 33, row: 3, role: 'none', notes: true });
  npcs.push({ id: 'wel8', kind: 'bienestar', style: 'staff0', col: 37, row: 6, role: 'none', side: 'mug' });
  npcs.push({ id: 'wel9', kind: 'bienestar', style: 'agent2', col: 21, row: 11, role: 'none', side: 'mug' });
  npcs.push({ id: 'wel10', kind: 'bienestar', style: 'agent6', col: 25, row: 11, role: 'none', notes: true });
  npcs.push({ id: 'wel11', kind: 'bienestar', style: 'agent10', col: 37, row: 11, role: 'none', side: 'pineapple' });
  npcs.push({ id: 'wel12', kind: 'bienestar', style: 'staff1', col: 37, row: 3, role: 'none' });
  npcs.push({ id: 'wel13', kind: 'bienestar', style: 'sup2', col: 33, row: 6, role: 'none', stand: true });

  // Los tres de los dorilocos, ahora todos en la mesa de la columna 33
  // (mismo mensaje para los tres, como servicios generales).
  npcs.push({ id: 'dorilocos', kind: 'bienestar', style: 'agent1', col: 33, row: 8, role: 'optional', side: 'chips' });
  npcs.push({ id: 'dorilocos', kind: 'bienestar', style: 'agent4', col: 33, row: 11, role: 'optional', side: 'chips' });
  npcs.push({ id: 'dorilocos', kind: 'bienestar', style: 'agent8', col: 35, row: 9, role: 'optional', stand: true, side: 'chips' });

  npcs.push(corridorStaff(1));

  return {
    n: 1,
    w: FLOOR_W,
    h: FLOOR_H,
    rows: g,
    base: '.',
    zones: baseZones().concat([[19, 1, 38, 13, '~']]),
    npcs: npcs,
    ping: { aCol: 23, bCol: 29, row: 3 },
    robot: { col0: 2, col1: 7, row: 11, speed: 11 },
    decor: [
      { art: 'chairWu', col: 21, row: 8 },
      { art: 'chairYu', col: 25, row: 8 },
      { art: 'chairBu', col: 29, row: 8 },
      { art: 'chairWu', col: 33, row: 8 },
      { art: 'chairYu', col: 37, row: 8 },
      { art: 'chairBd', col: 21, row: 11 },
      { art: 'chairWd', col: 25, row: 11 },
      { art: 'chairYd', col: 29, row: 11 },
      { art: 'chairBd', col: 33, row: 11 },
      { art: 'chairWd', col: 37, row: 11 },
      { art: 'chairYu', col: 33, row: 3 },
      { art: 'chairBu', col: 37, row: 3 },
      { art: 'chairWd', col: 33, row: 6 },
      { art: 'chairYd', col: 37, row: 6 },
    ],
    decorTop: [
      { art: 'clock', col: 1, row: 0 },
      { art: 'logo', col: 10, row: 2 },
      // tres canecas juntas (verde, negra, blanca) contra la pared de abajo
      { art: 'trashCans', col: 4, row: 13 },
      // donde estaban los casilleros de la parte baja izquierda de bienestar,
      // en vertical porque esa es una pared que corre de arriba a abajo.
      { art: 'trashCansV', col: 19, row: 9 },
      // dos pantallas en el mostrador de recepción, como dos computadores
      { art: 'deskMonitor', col: 3, row: 3 },
      { art: 'deskMonitor', col: 5, row: 3 },
      { art: 'mop', col: 9, row: 11 },
      { art: 'pingNet', col: 26, row: 3 },
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
// El rectángulo abierto creció un poco hacia abajo y hacia la derecha
// (antes terminaba en la col. 39 / fila 20); a partir de OPS_MAIN_RIGHT
// cuelga TI y a partir de OPS_MAIN_LEFT cuelga RH, cada una como oficina
// propia por fuera del rectángulo, igual que el baño cuelga de la pared de
// abajo (ver sidePod más arriba). El ascensor (ELEV.col = 15) es la misma
// columna en todos los pisos, así que no se mueve -- por eso lo que sí se
// corrió 9 columnas a la derecha es TODO lo demás del open space (mismo
// tamaño, mismo layout, solo con otros números de columna), para dejarle
// sitio real a RH a la izquierda sin tocar el ascensor ni el baño.
const OPS_PAD = 15;
const OPS_MAIN_LEFT = OPS_PAD;
const OPS_MAIN_RIGHT = 45 + OPS_PAD;
const OPS_BOTTOM = 27;
const OPS_W = 55 + OPS_PAD;
// +3 filas de aire entre el ascensor/la pared de arriba y el primer mesón --
// antes quedaban casi pegados. Todo lo que no es "bienvenida junto al
// ascensor" (café, máquinas, logística) se corrió hacia abajo ese mismo
// tanto, y el piso creció lo necesario para que siga cabiendo todo.
const OPS_H = OPS_BOTTOM + 5;

// El ascensor de este piso no es el mismo ELEV global (col. 15) de los otros
// dos pisos -- acá está en la mitad del mesón del centro (ver OPS_BANKS_X),
// así que operaciones lleva su propio punto de ascensor/llegada.
const OPS_ELEV = { col: 37, row: 1 };
const OPS_ELEV_SPAWN = { col: OPS_ELEV.col, row: OPS_ELEV.row + 1 };
// El baño de este piso tampoco queda en la columna fija de los otros dos
// pisos (13-18) -- acá se recentró para quedar alineado con el ascensor,
// justo en la mitad del open space.
const OPS_BATH = { col0: 35, col1: 40, doorCol: 37 };

// Tres columnas de mesones, mismo ancho (10 -- un puesto menos de cada lado
// que antes, para que no quedaran tan pegados) y mismo espacio entre ellas y
// contra las paredes, repartidas parejo en todo el ancho del open space
// (col. 10 a 53): 3 + 10 + 4 + 10 + 4 + 10 + 3 = 44.
const OPS_BANKS_X = [
  { col0: 19, col1: 28 }, // izquierda
  { col0: 33, col1: 42 }, // centro -- acá está el ascensor, en la mitad
  { col0: 47, col1: 56 }, // derecha
];

// Mesones largos: todos en la misma fila, sin puestos aparte para nadie.
const OPS_BANKS = [
  Object.assign({ row: 6 }, OPS_BANKS_X[0]),
  Object.assign({ row: 6 }, OPS_BANKS_X[1]),
  Object.assign({ row: 11 }, OPS_BANKS_X[0]),
  Object.assign({ row: 11 }, OPS_BANKS_X[1]),
  Object.assign({ row: 16 }, OPS_BANKS_X[0]),
  Object.assign({ row: 16 }, OPS_BANKS_X[1]),
  // Mesón nuevo en la franja que ganó el piso al crecer hacia abajo.
  Object.assign({ row: 21 }, OPS_BANKS_X[0]),
  Object.assign({ row: 21 }, OPS_BANKS_X[1]),
  // Tercera columna de mesones a la derecha: quedaba mucho espacio libre
  // entre el mesón de la derecha y la pared de TI. No se repite en la fila
  // 21 porque ahí ya está la sala de juntas, ni en la 16 porque ese mesón
  // quedaba justo encima de la sala de juntas.
  Object.assign({ row: 6 }, OPS_BANKS_X[2]),
  Object.assign({ row: 11 }, OPS_BANKS_X[2]),
];

// TI: oficina cerrada, colgada del lado derecho del rectángulo principal
// (no adentro de él), con su propia puerta hacia el open space.
const TI_OFFICE = { x1: OPS_W - 1, y0: 2, y1: 14, doorRow: 6 };
const TI_RACKS = { col0: OPS_MAIN_RIGHT + 1, col1: OPS_W - 2, row: 3 }; // pared del fondo, toda en servidores
const TI_RACKS_SIDE = { col: OPS_W - 2, row0: 4, row1: 11 }; // pared derecha, más servidores
// Puestos pegados unos a otros contra la pared de abajo, sin huecos.
const TI_SEATS = [46, 47, 48, 49, 50, 51, 52, 53].map(function (c) { return c + OPS_PAD; });
// RH: oficina cerrada, colgada del lado IZQUIERDO del rectángulo principal
// -- misma técnica que TI (y que el baño): la pared compartida ya viene
// sólida de afuera, acá solo se le abre una puerta de dos casillas.
// A propósito bastante más baja que el rectángulo principal (como TI, como
// el baño): si ocupara casi toda la pared, se vería como una continuación
// del mismo open space en vez de un cuarto aparte pegado por fuera.
const RH_OFFICE = { x1: 0, y0: 10, y1: 24, doorRow: 17 };
// Menos gente que antes de ensanchar la oficina: los mesones quedan
// centrados, con tres columnas libres a cada lado (contra las paredes).
const RH_BANKS = [
  { col0: 4, col1: 11, row: 13 },
  { col0: 4, col1: 11, row: 19 },
];

// Frases sueltas de RH, sin nombre propio -- cualquiera del piso.
const RH_EXTRAS = [
  ['rhLine1', 4, 13],
  ['rhLine2', 6, 13],
  ['rhLine3', 9, 13],
  ['rhLine4', 11, 13],
  ['rhLine5', 5, 19],
  ['rhLine6', 9, 19],
  ['rhLine7', 8, 13],
];

// Los cinco del equipo, repartidos por todo el piso, lejos de la salida del
// ascensor para no taparle el paso a nadie; Felipe está dentro de la sala de juntas.
const OPS_DEVS = [
  // Cerca de RH, justo afuera de su puerta (col. OPS_MAIN_LEFT / fila 17-18).
  { id: 'diana', col: 16, row: 21, piece: 'oportunidad', side: 'pineapple' },
  // Arriba a la derecha, cerca del logo de la empresa (col. 56 / fila 1).
  { id: 'nicolas', col: 55, row: 3, piece: 'aprendizaje', side: 'duck' },
  // En el pasillo entre el mesón de la izquierda y el del centro.
  // Abajo, cerca del reloj de la pared que da con la entrada del baño.
  { id: 'daniel', col: 30, row: 25, piece: 'confianza', notes: true },
  // Adentro de la sala de juntas, donde antes estaba Felipe.
  { id: 'guillermo', col: 40 + OPS_PAD, row: 22, piece: 'equipo', side: 'ball' },
  // Por fuera de la sala de juntas, a la izquierda de la puerta.
  { id: 'felipe', col: 31 + OPS_PAD, row: 20, piece: 'respaldo', side: 'phone' },
];

// Compañeros con mensaje opcional: [id, col, fila, estilo opcional] --
// columnas recalculadas para caer dentro de los mesones ya redistribuidos
// (ver OPS_BANKS_X).
// Los ops1-ops5 (mensajes genéricos de relleno) se quitaron: ya no quedan
// agentes con ese id, vuelven a ser gente anónima de los mesones.
const OPS_EXTRAS = [
  // Se corrió un puesto a la izquierda: su silla de siempre quedó fuera del
  // mesón al achicarlo.
  ['danielPardo', 28, 6, 'danielPardo'],
  ['sebastian', 28, 11, 'sebastian'],
  // Ídem: un puesto a la izquierda para que no quede fuera del mesón.
  ['frehynner', 41, 11, 'frehynner'],
  // Jorge, supervisor: primera posición de la fila 16, igual que Sebastián y
  // Daniel Pardo en las suyas (la más cercana al pasillo del ascensor).
  ['jorge', 27, 16, 'jorge'],
  // Diego G., en el mesón de la derecha.
  ['diegoG', 50, 6, 'diegoG'],
  // Frases sueltas de operaciones, sin nombre propio -- cualquiera del piso.
  ['ops6', 20, 6],
  ['ops7', 35, 6],
  ['ops8', 20, 11],
  ['ops9', 35, 16],
  ['ops10', 48, 11],
  ['ops11', 24, 11],
  ['ops12', 39, 16],
  ['ops13', 24, 21],
  ['ops14', 39, 11],
  ['ops15', 24, 6],
  ['ops16', 39, 21],
  ['ops17', 48, 6],
];

function opsShell() {
  const g = grid(OPS_W, OPS_H, ' ');
  // El piso base solo se pinta ENTRE las dos paredes compartidas (el
  // rectángulo principal). Lo que queda por fuera de esas paredes -- donde
  // cuelgan TI y RH -- se deja vacío (negro), y cada oficina pinta su propio
  // piso ahí adentro (ver sidePod). Así quedan rodeadas de negro arriba y
  // abajo, igual que el baño se ve rodeado de negro a los lados.
  fill(g, OPS_MAIN_LEFT, 0, OPS_MAIN_RIGHT, OPS_BOTTOM, '.');
  fill(g, OPS_MAIN_LEFT, 0, OPS_MAIN_RIGHT, 0, '#');
  fill(g, OPS_MAIN_LEFT, OPS_BOTTOM, OPS_MAIN_RIGHT, OPS_BOTTOM, '#');
  // Paredes del rectángulo principal: separan el open space de TI (derecha)
  // y RH (izquierda), que cuelgan por fuera (ver sidePod, en operaciones()).
  fill(g, OPS_MAIN_RIGHT, 0, OPS_MAIN_RIGHT, OPS_BOTTOM, '#');
  fill(g, OPS_MAIN_LEFT, 0, OPS_MAIN_LEFT, OPS_BOTTOM, '#');
  // El ascensor de operaciones no es el ELEV global -- ver OPS_ELEV.
  put(g, OPS_ELEV.col, OPS_ELEV.row, 'L');
  put(g, OPS_ELEV.col + 1, OPS_ELEV.row, 'L');
  // Paredes que lo abrazan, igual que el ascensor de la terraza.
  put(g, OPS_ELEV.col - 1, 1, '#');
  put(g, OPS_ELEV.col + 2, 1, '#');
  put(g, OPS_ELEV.col - 1, 2, '#');
  put(g, OPS_ELEV.col + 2, 2, '#');
  fill(g, OPS_BATH.col0, OPS_BOTTOM + 1, OPS_BATH.col1, OPS_BOTTOM + 4, '#');
  fill(g, OPS_BATH.col0 + 1, OPS_BOTTOM + 1, OPS_BATH.col1 - 1, OPS_BOTTOM + 3, '.');
  put(g, OPS_BATH.doorCol, OPS_BOTTOM, 'T');
  put(g, OPS_BATH.doorCol + 1, OPS_BOTTOM, 'T');
  put(g, OPS_BATH.col0 + 1, OPS_BOTTOM + 1, 'N');
  put(g, OPS_BATH.col1 - 1, OPS_BOTTOM + 1, 'A');
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

  // alguien de aseo en la entrada del baño de este piso también (ver OPS_BATH).
  npcs.push({ id: 'aseoBanos', kind: 'aseo', style: 'aseo4', col: OPS_BATH.col0 + 1, row: OPS_BOTTOM - 1, role: 'optional', stand: true });
  // el de logística saluda al lado del ascensor (que en este piso está
  // reposicionado -- ver OPS_ELEV).
  // Dos filas más abajo: en la fila del ascensor (y una más) ahora hay
  // pared, por las que lo abrazan (ver arriba).
  npcs.push({ id: 'logisticaOps', kind: 'logistica', style: 'logistica', col: OPS_ELEV.col + 2, row: OPS_ELEV.row + 2, role: 'optional', stand: true });
  // el de la cara de zorro anda de ronda por todo el piso, arrancando abajo
  // (ver patrols más abajo) -- por los pasillos entre mesones, ya
  // recalculados para el nuevo acomodo de los tres mesones.
  npcs.push({ id: 'zorro', kind: 'logistica', style: 'zorro', col: 31, row: 23, role: 'optional', stand: true });
  // Danilo, caminando por la parte baja del piso con su contoneo.
  npcs.push({ id: 'danilo', kind: 'guest', style: 'danilo', col: 54, row: 15, role: 'optional', stand: true, hipSway: true, shine: true });

  // ---- TI: oficina cerrada, colgada por fuera del rectángulo principal ----
  // Puerta de dos casillas, igual que la de RH.
  sidePod(g, OPS_MAIN_RIGHT, TI_OFFICE.x1, TI_OFFICE.y0, TI_OFFICE.y1, TI_OFFICE.doorRow, true);
  // pared de racks al fondo -- ya no es toda servidor: se mezcla con un
  // par de estantes y un archivador, como cualquier cuarto de TI real.
  fill(g, TI_RACKS.col0, TI_RACKS.row, TI_RACKS.col1, TI_RACKS.row, 'S');
  put(g, TI_RACKS.col0 + 2, TI_RACKS.row, 'B');
  put(g, TI_RACKS.col0 + 5, TI_RACKS.row, 'C');
  // lateral derecho, mismo criterio: casi todo servidor, un estante colado.
  for (let r = TI_RACKS_SIDE.row0; r <= TI_RACKS_SIDE.row1; r++) put(g, TI_RACKS_SIDE.col, r, 'S');
  put(g, TI_RACKS_SIDE.col, TI_RACKS_SIDE.row1 - 1, 'B');
  // tablero y cajas de equipo, contra la pared izquierda -- la biblioteca
  // que quedaba pegada a la puerta se quitó (justo lo primero que se veía
  // al entrar, y no aportaba nada distinto al resto de la pared).
  put(g, TI_RACKS.col0, 4, 'R');
  put(g, 48 + OPS_PAD, 4, 'X');
  put(g, 52 + OPS_PAD, 4, 'X');
  const TI_ROW = TI_OFFICE.y1 - 2;
  // Puestos pegados unos a otros contra la pared de abajo, sin huecos entre
  // escritorios (antes había uno sí, uno no).
  TI_SEATS.forEach(function (c) {
    put(g, c, TI_ROW + 1, 'D');
  });
  // Menos gente trabajando que puestos: los 8 escritorios y sus
  // computadores se quedan (ver TI_SEATS más arriba), pero solo 4 tienen
  // alguien sentado -- los otros quedan con el computador prendido y la
  // silla vacía (mismo truco que la aspiradora-fantasma: un NPC sin estilo
  // no dibuja a nadie, pero sigue trayendo su monitor).
  TI_SEATS.forEach(function (c, i) {
    if (i === 3) {
      // Marco, el único con diálogo propio de este grupo.
      npcs.push(Object.assign(agentAt(2, c, TI_ROW), { kind: 'staff', style: 'marco', id: 'marco', role: 'optional' }));
      return;
    }
    if (i === 6) {
      // La pelirroja -- estilo dedicado, no genérico.
      npcs.push(Object.assign(agentAt(2, c, TI_ROW), { style: 'agent12' }));
      return;
    }
    if (i === 0) {
      npcs.push(Object.assign(agentAt(2, c, TI_ROW), { id: 'tiLine1', role: 'optional' }));
      return;
    }
    if (i === 5) {
      npcs.push(Object.assign(agentAt(2, c, TI_ROW), { id: 'tiLine2', role: 'optional' }));
      return;
    }
    // Puesto vacío: se queda el computador, se va la persona.
    npcs.push(Object.assign(agentAt(2, c, TI_ROW), { style: '' }));
  });
  // Jonathan, parado a mitad de la oficina de TI (mismo tipo de cuerpo que
  // Guillermo), lejos de la pared de servidores y de los puestos.
  npcs.push({ id: 'jonathan', kind: 'staff', style: 'jonathan', col: 64, row: 8, role: 'optional', stand: true });

  // ---- RH: oficina cerrada, colgada del lado izquierdo del rectángulo
  // principal, por fuera -- misma técnica que TI, en espejo.
  sidePod(g, OPS_MAIN_LEFT, RH_OFFICE.x1, RH_OFFICE.y0, RH_OFFICE.y1, RH_OFFICE.doorRow, true);
  // Las dos paredes largas, llenas de archivadores y estantes (con un par
  // de plantas metidas para que no se sienta solo de oficina): fila por
  // fila, esquivando los dos mesones (filas 14/15 y 20/21).
  const rhLeftWall = RH_OFFICE.x1 + 1;
  const rhRightWall = OPS_MAIN_LEFT - 1;
  // Toda la fila de arriba (la primera del interior), de pared a pared,
  // llena de archivadores.
  fill(g, rhLeftWall, 11, rhRightWall, 11, 'C');
  [
    [rhLeftWall, 12, 'C'], [rhLeftWall, 13, 'B'],
    [rhLeftWall, 16, 'C'], [rhLeftWall, 18, 'B'], [rhLeftWall, 19, 'C'],
    [rhLeftWall, 22, 'B'], [rhLeftWall, 23, 'C'],
  ].forEach(function (t) { put(g, t[0], t[1], t[2]); });
  // Filas 17-18 (el ancho de la puerta) se dejan libres a propósito --
  // nada bloqueando la entrada. La planta y el dispensador que quedaban ahí
  // se corrieron más abajo, lejos de la puerta.
  [
    [rhRightWall, 12, 'B'], [rhRightWall, 13, 'P'],
    [rhRightWall, 16, 'B'],
    [rhRightWall, 19, 'C'],
    [rhRightWall, 22, 'W'], [rhRightWall, 23, 'P'],
  ].forEach(function (t) { put(g, t[0], t[1], t[2]); });
  // Impresoras de RH, contra las paredes -- dos mudas, y una que sí tiene
  // algo que decir.
  npcs.push({ id: 'printerRH1', kind: 'printer', style: 'printer', col: rhLeftWall, row: 14, role: 'none' });
  npcs.push({ id: 'printerRH2', kind: 'printer', style: 'printer', col: rhRightWall, row: 14, role: 'none' });
  npcs.push({ id: 'printerRH3', kind: 'printer', style: 'printer', col: rhLeftWall, row: 20, role: 'optional' });
  // La mayoría de los puestos de RH son mujeres: se cicla un estilo corto
  // cada dos o tres largos, en vez de dejarlo a la suerte de agentAt().
  const RH_STYLE_CYCLE = ['agent1', 'agent3', 'agent0', 'agent6', 'agent8', 'agent9', 'agent5', 'agent11'];
  let rhSeatIndex = 0;
  RH_BANKS.forEach(function (bank) {
    fill(g, bank.col0, bank.row + 1, bank.col1, bank.row + 1, 'D');
    for (let c = bank.col0; c <= bank.col1; c++) {
      const style = RH_STYLE_CYCLE[rhSeatIndex % RH_STYLE_CYCLE.length];
      rhSeatIndex++;
      npcs.push(Object.assign(agentAt(2, c, bank.row), { style: style }));
    }
  });
  // Puesto del medio del segundo mesón de RH: reclutadora, con línea propia.
  const rhReclutaCol = RH_BANKS[1].col0 + Math.floor((RH_BANKS[1].col1 - RH_BANKS[1].col0) / 2);
  npcs.forEach(function (n) {
    if (n.col === rhReclutaCol && n.row === RH_BANKS[1].row) {
      n.id = 'rhRecluta';
      n.style = 'rhRecluta';
      n.role = 'optional';
    }
  });
  RH_EXTRAS.forEach(function (o) {
    npcs.forEach(function (n) {
      if (n.col === o[1] && n.row === o[2]) {
        n.id = o[0];
        n.role = 'optional';
      }
    });
  });
  // rincón de plantas, arriba a la izquierda del open space (antes era la cafetería)
  put(g, 1 + OPS_PAD, 1, 'P');
  put(g, 2 + OPS_PAD, 1, 'P');
  put(g, 4 + OPS_PAD, 1, 'X');
  // zona de máquinas, arriba a la derecha
  put(g, 35 + OPS_PAD, 1, 'V');
  put(g, 36 + OPS_PAD, 1, 'F');
  put(g, 38 + OPS_PAD, 1, 'P');
  // dispensadores de agua: los de la entrada se quedan cerca del ascensor
  // (que no se mueve), separados de las columnas L del ascensor mismo.
  [[12, 1], [23, 1], [30, 1], [40, 1]].forEach(function (w) {
    put(g, w[0], w[1], 'W');
  });
  // (el que había en col. 10 / fila 9 quedaba flotando en el vacío: esa
  // columna es de RH, que empieza en la fila 10 -- ya no existe.)
  put(g, OPS_MAIN_RIGHT - 1, 17, 'W');

  // sala de juntas, pegada a la esquina de abajo a la derecha del rectángulo
  // principal, con dos casillas de aire alrededor de la mesa y las sillas
  // por los cuatro lados, y puerta de dos casillas.
  room(g, 33 + OPS_PAD, OPS_MAIN_RIGHT, 39 + OPS_PAD, 20, OPS_BOTTOM - 1);
  fill(g, 36 + OPS_PAD, 23, 42 + OPS_PAD, 23, 'M');
  [36, 37, 38, 39, 40, 41, 42].forEach(function (c) {
    decor.push({ art: 'chairUp', col: c + OPS_PAD, row: 22 });
    decor.push({ art: 'chairDown', col: c + OPS_PAD, row: 24 });
  });
  // Más gente en la reunión, en las sillas que quedaban vacías (col. 55 /
  // fila 22 sigue siendo de Guillermo -- ver OPS_DEVS). Columnas relativas
  // a la mesa (36 a 42) + OPS_PAD, igual que la mesa y las sillas mismas:
  // se habían quedado con el número de antes de ensanchar RH y quedaron
  // sueltas en la mitad del cuarto, lejos de la mesa.
  // Estilos "Plain": los de la reunión van sin diadema, no están en llamada.
  [
    [36 + OPS_PAD, 22, 'agent2Plain'],
    [38 + OPS_PAD, 22, 'agent5Plain'],
    [42 + OPS_PAD, 22, 'agent9Plain'],
    [37 + OPS_PAD, 24, 'agent1Plain'],
    [39 + OPS_PAD, 24, 'agent7Plain'],
    [41 + OPS_PAD, 24, 'agent11Plain'],
  ].forEach(function (m, i) {
    npcs.push({ id: 'juntas' + i, kind: 'agent', style: m[2], col: m[0], row: m[1], role: 'none' });
  });
  // vida en las paredes: tablero y agua subidos una posición (quedan
  // pegados a la pared de arriba de la sala); planta y biblioteca todo lo
  // abajo que da el cuarto (pegadas a la pared de abajo).
  put(g, 34 + OPS_PAD, 20, 'R');
  put(g, 44 + OPS_PAD, 20, 'W');
  put(g, 34 + OPS_PAD, 26, 'P');
  put(g, 44 + OPS_PAD, 26, 'B');

  // detalles sueltos por el piso -- la fila 22 (justo debajo de Danilo) se
  // dejó libre a propósito: eran cosas que antes estaban contra la pared de
  // abajo, y al agrandar el piso quedaron sueltas en la mitad.
  put(g, 1 + OPS_PAD, 14, 'B');
  put(g, 22 + OPS_PAD, 15, 'X');
  put(g, 19 + OPS_PAD, 1, 'P');
  put(g, 44 + OPS_PAD, 9, 'B');
  // Más vida contra la pared de abajo del open space -- plantas en el piso,
  // esquivando las canecas, la puerta del baño y la sala de juntas.
  put(g, OPS_MAIN_LEFT + 1, 26, 'P');
  put(g, 24, 26, 'P');
  put(g, 28, 26, 'P');
  put(g, 32, 26, 'P');
  put(g, 41, 26, 'P');
  put(g, 45, 26, 'B');

  return {
    n: 2,
    w: OPS_W,
    h: OPS_H,
    rows: g,
    base: '.',
    zones: [
      [OPS_BATH.col0 + 1, 1, OPS_BATH.col1 - 1, 22, ','],
      [OPS_BATH.col0 + 1, OPS_BOTTOM, OPS_BATH.col1 - 1, OPS_H - 1, ';'],
      [34 + OPS_PAD, 20, 44 + OPS_PAD, 26, '"'],
      [TI_RACKS.col0, TI_OFFICE.y0, TI_OFFICE.x1 - 1, TI_OFFICE.y1, '~'],
    ],
    npcs: npcs,
    decor: decor,
    // Ronda de Zorro: un circuito por los pasillos abiertos del piso, sin cruzar
    // mesones ni la sala de juntas. Empieza abajo y sube. Usa los dos
    // pasillos que quedan entre los tres mesones (columnas 23-26 y 37-40).
    patrols: [
      {
        id: 'zorro',
        points: [
          { col: 31, row: 23 },
          { col: 31, row: 4 },
          { col: 45, row: 4 },
          { col: 45, row: 23 },
        ],
        speed: 42,
      },
      // Danilo baja hasta la puerta de la sala de juntas, entra un poco,
      // sale otra vez y camina un tramo a la izquierda antes de repetir.
      {
        id: 'danilo',
        points: [
          { col: 54, row: 15 },
          { col: 54, row: 19 },
          { col: 54, row: 21 },
          { col: 54, row: 19 },
          { col: 54, row: 15 },
          { col: 50, row: 15 },
        ],
        speed: 34,
      },
    ],
    decorTop: [
      // El logo se corrió lejos del ascensor -- antes quedaba encima de él.
      { art: 'logo', col: 47, row: 1 },
      { art: 'clock', col: 10 + OPS_PAD, row: 0 },
      { art: 'banner', col: 8 + OPS_PAD, row: 0 },
      { art: 'banner', col: 30 + OPS_PAD, row: 0 },
      // Cajas de galletas, al lado derecho del ascensor de operaciones.
      { art: 'cookies', col: OPS_ELEV.col + 6, row: 1 },
      // tres canecas juntas, lejos de la sala de juntas
      { art: 'trashCans', col: OPS_MAIN_LEFT + 4, row: 26 },
      // otras tres canecas contra la pared derecha, entre el estante y el dispensador de agua.
      { art: 'trashCansV', col: OPS_MAIN_RIGHT - 1, row: 13 },
      // Letreros pequeños en la entrada de cada oficina cerrada, del lado
      // del open space -- a la altura de la puerta.
      { art: 'doorSignRH', col: OPS_MAIN_LEFT, row: RH_OFFICE.doorRow - 1 },
      { art: 'doorSignTI', col: OPS_MAIN_RIGHT, row: TI_OFFICE.doorRow - 1 },
      // Corazones también en las paredes de arriba y de abajo de RH -- ya
      // tiene las de siempre, pero le faltaba vida en su propio cuarto.
      { art: 'heart', col: 3, row: RH_OFFICE.y0 },
      { art: 'heart', col: 7, row: RH_OFFICE.y0 },
      { art: 'heart', col: 11, row: RH_OFFICE.y0 },
      { art: 'painting', col: 2, row: RH_OFFICE.y0 },
      { art: 'nameplate', col: 5, row: RH_OFFICE.y0 },
      { art: 'painting', col: 9, row: RH_OFFICE.y0 },
      { art: 'clock', col: 13, row: RH_OFFICE.y0 },
      { art: 'heart', col: 3, row: RH_OFFICE.y1 },
      { art: 'heart', col: 7, row: RH_OFFICE.y1 },
      { art: 'heart', col: 11, row: RH_OFFICE.y1 },
      { art: 'painting', col: 2, row: RH_OFFICE.y1 },
      { art: 'clock', col: 5, row: RH_OFFICE.y1 },
      { art: 'painting', col: 9, row: RH_OFFICE.y1 },
      { art: 'nameplate', col: 13, row: RH_OFFICE.y1 },
      // Más corazones por las paredes -- decoración de amor y amistad.
      { art: 'heart', col: 5 + OPS_PAD, row: 0 },
      // Se quitó el corazón que quedaba encima del logo (se corrió a col. 47).
      { art: 'heart', col: 28, row: 0 },
      { art: 'heart', col: 33, row: 0 },
      { art: 'heart', col: 38, row: 0 },
      // Se quitó el corazón que quedaba encima del letrero de COOKIES.
      { art: 'heart', col: 52, row: 0 },
      { art: 'heart', col: 56, row: 0 },
      // También contra las otras tres paredes del rectángulo principal, no
      // solo la de arriba -- que se vean corazones por todo el piso.
      { art: 'heart', col: OPS_MAIN_LEFT, row: 4 },
      { art: 'heart', col: OPS_MAIN_LEFT, row: 9 },
      { art: 'heart', col: OPS_MAIN_LEFT, row: 13 },
      { art: 'heart', col: OPS_MAIN_LEFT, row: 22 },
      { art: 'heart', col: OPS_MAIN_LEFT, row: 25 },
      // Más vida contra la pared izquierda -- antes solo tenía corazones.
      { art: 'painting', col: OPS_MAIN_LEFT, row: 6 },
      { art: 'clock', col: OPS_MAIN_LEFT, row: 20 },
      { art: 'banner', col: OPS_MAIN_LEFT, row: 2 },
      // Canecas en vertical, igual que las de la pared derecha.
      { art: 'trashCansV', col: OPS_MAIN_LEFT + 1, row: 4 },
      { art: 'heart', col: OPS_MAIN_RIGHT, row: 3 },
      { art: 'heart', col: OPS_MAIN_RIGHT, row: 10 },
      { art: 'heart', col: OPS_MAIN_RIGHT, row: 14 },
      { art: 'heart', col: OPS_MAIN_RIGHT, row: 19 },
      { art: 'heart', col: OPS_MAIN_RIGHT, row: 24 },
      { art: 'heart', col: 26, row: OPS_BOTTOM },
      { art: 'heart', col: 34, row: OPS_BOTTOM },
      { art: 'heart', col: 42, row: OPS_BOTTOM },
      { art: 'heart', col: 50, row: OPS_BOTTOM },
      // Más vida contra esta pared -- es la que da con el baño de abajo --
      // repartida entre los corazones y esquivando la puerta (col. 37-38).
      { art: 'painting', col: 20, row: OPS_BOTTOM },
      { art: 'clock', col: 30, row: OPS_BOTTOM },
      { art: 'painting', col: 46, row: OPS_BOTTOM },
      { art: 'netSwitch', col: 55, row: OPS_BOTTOM },
      { art: 'tableItems', col: 38 + OPS_PAD, row: 23 },
      { art: 'mug', col: 41 + OPS_PAD, row: 23 },
      { art: 'nameplate', col: 39 + OPS_PAD, row: 19 },
      { art: 'nameplate', col: OPS_MAIN_RIGHT, row: TI_OFFICE.doorRow },
      { art: 'nameplate', col: OPS_MAIN_LEFT, row: RH_OFFICE.doorRow },
      { art: 'netSwitch', col: 49 + OPS_PAD, row: 4 },
      { art: 'netSwitch', col: 49 + OPS_PAD, row: 7 },
    ],
    label: 'PISO 2 · OPERACIONES',
    elevLabel: 'OPERACIONES',
    spawn: OPS_ELEV_SPAWN,
    elev: OPS_ELEV,
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
  const TR = FLOOR_W - 1;
  fill(g, 0, 0, TR, 0, 'Y');
  fill(g, 0, 14, TR, 14, 'Y');
  fill(g, 0, 0, 0, 14, 'Y');
  fill(g, TR, 0, TR, 14, 'Y');

  // El ascensor de este piso queda en la mitad de la terraza en X (ancho
  // real: col. 0 a 39, con este ascensor ocupando 19-20 quedan 19 columnas
  // libres a cada lado) -- no es el mismo ELEV global de recepción/bienestar.
  const TERRACE_ELEV = { col: 19, row: 1 };
  fill(g, 18, 0, 21, 0, '#');
  put(g, 18, 1, '#');
  put(g, 21, 1, '#');
  put(g, 18, 2, '#');
  put(g, 21, 2, '#');
  put(g, TERRACE_ELEV.col, TERRACE_ELEV.row, 'L');
  put(g, TERRACE_ELEV.col + 1, TERRACE_ELEV.row, 'L');

  // tienda de Marce, pegada a la esquina superior izquierda (un renglón
  // más abajo que antes -- mesa y lo que va encima, todo junto).
  fill(g, 2, 3, 6, 3, 'c');
  put(g, 1, 1, 'F');
  put(g, 6, 1, 'B');

  // mesas a la derecha, lejos de donde se arma la celebración
  // Cuadrícula pareja (columnas 32 y 37, filas 2/7/12): dos columnas y tres
  // filas libres de aire entre una mesa y la siguiente, en vez de las ocho
  // de antes que casi se tocaban entre sí.
  const RIGHT_TABLES = [
    [30, 2], [30, 7], [30, 12],
    [35, 2], [35, 7], [35, 12],
    // Mismo patrón del lado izquierdo (col. 10 y 14), esquivando la tienda
    // de Marce y a los que ya están celebrando por esa zona. Sin las dos de
    // arriba -- quedaban muy cerca de la tienda.
    [10, 7], [10, 12],
    [14, 7],
  ];
  RIGHT_TABLES.forEach(function (t) {
    fill(g, t[0], t[1], t[0], t[1] + 1, 'm');
  });
  const SMALL_TABLES = [
    [2, 7], [4, 11],
    // parte baja de la terraza
    [10, 12], [16, 13], [24, 12],
  ];
  SMALL_TABLES.forEach(function (t) {
    put(g, t[0], t[1], 'm');
  });

  [
    [9, 1], [12, 1], [25, 1], [30, 1],
    [1, 5], [1, 12], [30, 7], [30, 13],
    [8, 13], [14, 13], [21, 13], [26, 13],
  ].forEach(function (pos) {
    put(g, pos[0], pos[1], 'P');
  });

  const npcs = [
    // A mitad de la terraza (ancho real: col. 0 a 39).
    { id: 'sergio', kind: 'boss', style: 'sergioBoss', col: 19, row: 7, role: 'mission', stand: true, side: 'bow', flip: true },
    { id: 'yesica', kind: 'boss', style: 'yesica', col: 20, row: 7, role: 'none', stand: true },
    // Marce se corrió al puesto donde antes estaba Sergio.
    { id: 'marce', kind: 'staff', style: 'marce', col: 5, row: 4, role: 'optional', stand: true },
    { id: 'mafe', kind: 'staff', style: 'mafe', col: 3, row: 2, role: 'optional', stand: true, counterFront: true },
    // Gente ya sentada en las mesas, para que la terraza no se vea vacía
    // mientras no se ha hablado con Sergio.
    { id: 'guest1', kind: 'guest', style: 'agent2', col: 1, row: 7, role: 'none' },
    { id: 'guest2', kind: 'guest', style: 'agent6', col: 5, row: 11, role: 'none' },
    { id: 'guest3', kind: 'guest', style: 'staff1', col: 30, row: 4, role: 'none', stand: true },
    { id: 'guest4', kind: 'guest', style: 'agent10', col: 30, row: 10, role: 'none', stand: true },
    // Las mesas de la derecha, con gente sentada de verdad -- antes eran
    // solo sillas vacías. Dos personas por mesa, en las sillas de la
    // izquierda (col. t0-1); las de la derecha quedan libres para que no
    // se vea forzado.
    { id: 'guest5', kind: 'guest', style: 'agent1', col: 29, row: 2, role: 'none' },
    { id: 'guest7', kind: 'guest', style: 'agent3', col: 29, row: 7, role: 'none' },
    { id: 'guest8', kind: 'guest', style: 'agent8', col: 29, row: 8, role: 'none' },
    { id: 'guest9', kind: 'guest', style: 'agent5', col: 29, row: 12, role: 'none' },
    { id: 'guest11', kind: 'guest', style: 'agent11', col: 34, row: 2, role: 'none' },
    { id: 'guest12', kind: 'guest', style: 'agent7', col: 34, row: 3, role: 'none' },
    { id: 'guest13', kind: 'guest', style: 'agent9', col: 34, row: 7, role: 'none' },
    { id: 'guest14', kind: 'guest', style: 'staff1', col: 34, row: 8, role: 'none' },
    { id: 'guest15', kind: 'guest', style: 'agent0', col: 34, row: 12, role: 'none' },
    { id: 'guest16', kind: 'guest', style: 'agent6', col: 34, row: 13, role: 'none' },
    // Sillas de la derecha de esas mismas seis mesas (antes se dejaban
    // vacías a propósito; ahora también llevan gente).
    { id: 'guest17', kind: 'guest', style: 'agent4', col: 31, row: 2, role: 'none' },
    { id: 'guest19', kind: 'guest', style: 'staff3', col: 31, row: 7, role: 'none' },
    { id: 'guest21', kind: 'guest', style: 'agent7', col: 31, row: 12, role: 'none' },
    { id: 'guest23', kind: 'guest', style: 'agent1', col: 36, row: 2, role: 'none' },
    { id: 'guest25', kind: 'guest', style: 'agent3', col: 36, row: 7, role: 'none' },
    { id: 'guest27', kind: 'guest', style: 'agent5', col: 36, row: 12, role: 'none' },
    // Las cinco mesas nuevas del lado izquierdo (espejo de las de la
    // derecha), con gente a los dos lados. Col. 11/fila 3 y col. 11/fila 13
    // se saltan porque ya había alguien de la celebración justo ahí.
    { id: 'guest32', kind: 'guest', style: 'staff2', col: 9, row: 7, role: 'none' },
    { id: 'guest33', kind: 'guest', style: 'agent1', col: 9, row: 8, role: 'none' },
    { id: 'guest34', kind: 'guest', style: 'agent4', col: 11, row: 7, role: 'none' },
    { id: 'guest36', kind: 'guest', style: 'agent2', col: 9, row: 12, role: 'none' },
    { id: 'guest37', kind: 'guest', style: 'agent9', col: 11, row: 12, role: 'none' },
    { id: 'guest42', kind: 'guest', style: 'agent3', col: 13, row: 7, role: 'none' },
    { id: 'guest43', kind: 'guest', style: 'agent8', col: 13, row: 8, role: 'none' },
    { id: 'guest44', kind: 'guest', style: 'staff1', col: 15, row: 7, role: 'none' },
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
  [[0, 5], [0, 9], [0, 13], [TR, 4], [TR, 8], [TR, 12]].forEach(function (p) {
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
    arch: { x: 19.5, y: 4, scale: 1.9 },
    zones: [
      [1, 1, 7, 4, '%'],
      [18, 1, 21, 4, '%'],
    ],
    npcs: npcs,
    decor: chairs,
    decorTop: hearts.concat([
      { art: 'trashCans', col: 2, row: 12 },
      { art: 'logo', col: 23, row: 1 },
      { art: 'menu', col: 3, row: 0 },
      { art: 'coffee', col: 2, row: 1 },
      { art: 'pastry', col: 5, row: 1 },
      { art: 'cups', col: 3, row: 3 },
      { art: 'mug', col: 5, row: 3 },
    ]),
    label: 'PISO 3 · TERRAZA',
    elevLabel: 'TERRAZA',
    spawn: { col: TERRACE_ELEV.col, row: TERRACE_ELEV.row + 1 },
    elev: TERRACE_ELEV,
  };
}

const BUILDING = [floor1(), operaciones(), terraza()];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BUILDING, ELEV, ELEV_SPAWN, TERRACE_IDX };
}
