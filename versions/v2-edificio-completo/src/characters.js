const SPRITE_SIZE = 16;
const WALK_SPEED = 58;
const RUN_MULT = 1.7;
const ANIM_FPS = 7;
const INTERACT_RANGE = 26;
const BUBBLE_RANGE = 34;
const HITBOX = { ox: 3, oy: 9, w: 10, h: 6 };

function createPlayer(spawn) {
  return {
    x: spawn.col * TILE,
    y: spawn.row * TILE,
    dir: 'down',
    moving: false,
    animTime: 0,
    frame: 0,
  };
}

function createNpcs(def) {
  let cloudIndex = 0;
  return def.npcs.map(function (n) {
    const npc = {
      id: n.id,
      kind: n.kind,
      style: n.style,
      col: n.col,
      row: n.row,
      x: n.col * TILE,
      y: n.row * TILE + (n.dy || 0),
      role: n.role,
      piece: n.piece || null,
      monitor: n.monitor || null,
      item: n.item || null,
      side: n.side || null,
      ghost: !!n.ghost,
      notes: !!n.notes,
      cloud: n.cloud || null,
      party: !!n.party,
      // Antes solo "party" podía empezar escondido; ahora también un npc
      // suelto que arranca oculto hasta que algo lo revele (ver breakGuy).
      hidden: !!n.party || !!n.hidden,
      cloudPhase: 0,
      stand: !!n.stand,
      still: !!n.still,
      flip: !!n.flip,
      talked: false,
      bounce: !!n.bounce,
      hipSway: !!n.hipSway,
      shine: !!n.shine,
      counterFront: !!n.counterFront,
      scale: n.scale || null,
    };
    // Los globos se reparten salteados en el ciclo para que no salgan dos vecinos a la vez.
    if (n.cloud) {
      npc.cloudPhase = ((cloudIndex * 7) % 15) * 0.8;
      cloudIndex += 1;
    }
    return npc;
  });
}

function spriteOf(npc) {
  return npc.style + (npc.stand ? 'Stand' : 'Sit');
}

function boxBlocked(floor, x, y) {
  const left = x + HITBOX.ox;
  const top = y + HITBOX.oy;
  const right = left + HITBOX.w - 1;
  const bottom = top + HITBOX.h - 1;
  const c0 = Math.floor(left / TILE);
  const c1 = Math.floor(right / TILE);
  const r0 = Math.floor(top / TILE);
  const r1 = Math.floor(bottom / TILE);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (isSolidAt(floor, c, r)) return true;
    }
  }
  return false;
}

function npcBlocked(npcs, x, y) {
  const left = x + HITBOX.ox;
  const top = y + HITBOX.oy;
  const right = left + HITBOX.w;
  const bottom = top + HITBOX.h;
  return npcs.some(function (n) {
    if (n.ghost || n.hidden) return false;
    return left < n.x + 13 && right > n.x + 3 && top < n.y + 15 && bottom > n.y + 4;
  });
}

function movePlayer(player, dt, input, floor, npcs) {
  let dx = 0;
  let dy = 0;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;

  player.moving = dx !== 0 || dy !== 0;

  if (dy < 0) player.dir = 'up';
  else if (dy > 0) player.dir = 'down';
  else if (dx < 0) player.dir = 'left';
  else if (dx > 0) player.dir = 'right';

  if (dx !== 0 && dy !== 0) {
    const inv = Math.SQRT1_2;
    dx *= inv;
    dy *= inv;
  }

  const speed = WALK_SPEED * (input.run ? RUN_MULT : 1);
  const nextX = player.x + dx * speed * dt;
  if (!boxBlocked(floor, nextX, player.y) && !npcBlocked(npcs, nextX, player.y)) player.x = nextX;
  const nextY = player.y + dy * speed * dt;
  if (!boxBlocked(floor, player.x, nextY) && !npcBlocked(npcs, player.x, nextY)) player.y = nextY;

  if (player.moving) {
    player.animTime += dt * (input.run ? RUN_MULT : 1);
    player.frame = Math.floor(player.animTime * ANIM_FPS) % 2;
  } else {
    player.animTime = 0;
    player.frame = 0;
  }
}

function centerOf(entity) {
  return { x: entity.x + SPRITE_SIZE / 2, y: entity.y + SPRITE_SIZE / 2 };
}

// Los opcionales ya no se hablan con E: su mensaje sale solo en un globo al acercarse.
function canTalkTo(npc) {
  if (npc.role === 'required') return !npc.talked;
  return npc.role === 'mission';
}

function nearestBubbleNpc(player, npcs) {
  // forceBubble se lo pone game.js a mano (breakGuy, mientras camina al
  // ascensor) para que el mensaje se quede fijo sin importar la distancia.
  const forced = npcs.filter(function (n) {
    return n.forceBubble;
  })[0];
  if (forced) return forced;
  const pc = centerOf(player);
  let best = null;
  let bestDist = BUBBLE_RANGE;
  npcs.forEach(function (n) {
    if (n.role !== 'optional' || n.hidden) return;
    const nc = centerOf(n);
    const dist = Math.hypot(pc.x - nc.x, pc.y - nc.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = n;
    }
  });
  return best;
}

function nearestInteractive(player, npcs) {
  const pc = centerOf(player);
  let best = null;
  let bestDist = INTERACT_RANGE;
  npcs.forEach(function (n) {
    if (n.hidden || !canTalkTo(n)) return;
    const nc = centerOf(n);
    const dist = Math.hypot(pc.x - nc.x, pc.y - nc.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = n;
    }
  });
  return best;
}

function nearElevator(player, elev) {
  const e = elev || ELEV;
  const pc = centerOf(player);
  const ex = (e.col + 1) * TILE;
  const ey = e.row * TILE + SPRITE_SIZE / 2;
  return Math.hypot(pc.x - ex, pc.y - ey) < INTERACT_RANGE + 4;
}

function cameraFor(player, floor, viewW, viewH) {
  const mapW = floor.w * TILE;
  const mapH = floor.h * TILE;
  let cx = player.x + SPRITE_SIZE / 2 - viewW / 2;
  let cy = player.y + SPRITE_SIZE / 2 - viewH / 2;
  cx = mapW <= viewW ? (mapW - viewW) / 2 : Math.max(0, Math.min(mapW - viewW, cx));
  cy = mapH <= viewH ? (mapH - viewH) / 2 : Math.max(0, Math.min(mapH - viewH, cy));
  return { x: cx, y: cy };
}

// Marca bajo los pies para identificar al Espartano (el personaje que se
// controla) entre el resto de la gente. Siempre visible, quieto o caminando,
// y parpadea para que se note más.
function drawStandMarker(ctx, x, y, t) {
  const cx = x + 8;
  const cy = y + 15;
  const blink = (Math.sin(t * 4) + 1) / 2;
  ctx.save();
  ctx.globalAlpha = 0.35 + blink * 0.4;
  ctx.fillStyle = '#8f2fd4';
  ctx.fillRect(cx - 6, cy, 12, 3);
  ctx.globalAlpha = 0.6 + blink * 0.4;
  ctx.fillRect(cx - 4, cy, 8, 1);
  ctx.restore();
}

function drawPlayer(ctx, player, t) {
  drawStandMarker(ctx, player.x, player.y, t);
  const frame = player.moving ? player.frame : 0;
  if (player.dir === 'up') drawSprite(ctx, 'spartanUp', frame, player.x, player.y, false);
  else if (player.dir === 'down') drawSprite(ctx, 'spartanDown', frame, player.x, player.y, false);
  else drawSprite(ctx, 'spartanSide', frame, player.x, player.y, player.dir === 'left');
}

// La paleta del que juega ping pong: se dibuja pegada al propio personaje
// (no como una entidad aparte con su propia posición, como antes) usando el
// mismo valor "t" que mueve el cuerpo, así que siempre van sincronizados.
function drawHeldPaddle(ctx, npc, t) {
  const x = npc.flip ? npc.x - 2 : npc.x + 14;
  const y = npc.y + 4 + t * 6;
  ctx.fillStyle = '#6b4a2a';
  ctx.fillRect(x + (npc.flip ? 4 : 1), y + 6, 3, 3);
  ctx.fillStyle = '#c9454a';
  ctx.fillRect(x + (npc.flip ? 0 : 3), y, 4, 7);
  ctx.fillStyle = '#e06a6a';
  ctx.fillRect(x + (npc.flip ? 1 : 4), y + 1, 2, 3);
}

// Diana es más alta y Daniel más ancho: se estira el dibujo desde los pies,
// sin tocar la casilla que ocupan.
function drawNpc(ctx, npc, time) {
  let bob = npc.stand || npc.still ? 0 : Math.floor(time * 4 + npc.col) % 2 === 0 ? 0 : 1;
  // bounce: true -- la persona y su paleta comparten el mismo "t" (0 a 1),
  // así que ya no son dos cosas separadas que hay que sincronizar a mano.
  // flip distingue de qué lado de la mesa está, para que no salten juntos.
  if (npc.bounce) {
    // Sin Math.round: se mueve suave (punto flotante), igual que la paleta,
    // en vez de dar saltos de a 1px -- para que las dos cosas se sientan
    // como el mismo movimiento y no dos animaciones distintas.
    const phase = npc.flip ? Math.PI : 0;
    const t = Math.max(0, Math.sin(time * 6 + phase));
    bob = t * 3;
    drawHeldPaddle(ctx, npc, t);
  }
  if (npc.party) bob = -Math.round(Math.abs(Math.sin(time * 3.4 + npc.col * 0.7)) * 3);
  // Contoneo de cadera: solo Danilo. El de ping pong ya no se mueve en
  // diagonal (sin vaivén horizontal) -- nada más de arriba hacia abajo.
  const sway = npc.hipSway ? Math.sin(time * 6 + npc.col) * 1.6 : 0;
  const px = npc.x + sway;
  const frame = npc.frame || 0;
  const st = DEV_STYLES[npc.style];
  let scaleX = 1;
  let scaleY = 1;
  if (st && st.wide) {
    scaleX = 1.18;
  } else if (st && st.tallBody) {
    scaleX = 0.94;
    scaleY = 1.3;
  } else if (npc.scale) {
    // Escala pareja (mismo alto y ancho) -- para alguien que se ve un poco
    // más grande que el resto, sin estirarlo ni ensancharlo como a Diana o Daniel.
    scaleX = npc.scale;
    scaleY = npc.scale;
  }
  if (scaleX === 1 && scaleY === 1) {
    drawSprite(ctx, spriteOf(npc), frame, px, npc.y + bob, npc.flip);
    return;
  }
  // Diana (tallBody) se estira desde los pies hacia arriba: queda más alta y
  // más esbelta, con piernas largas, sin moverse de su casilla.
  const cx = npc.x + 8;
  const cy = npc.y + 16;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scaleX, scaleY);
  ctx.translate(-cx, -cy);
  drawSprite(ctx, spriteOf(npc), frame, px, npc.y + bob, npc.flip);
  ctx.restore();
}

// Brillito que titila sobre una cabeza calva (Danilo).
function drawHeadShine(ctx, x, y, t) {
  const p = (Math.sin(t * 3) + 1) / 2;
  if (p < 0.55) return;
  ctx.save();
  ctx.globalAlpha = (p - 0.55) / 0.45;
  ctx.fillStyle = '#f4f0e6';
  ctx.fillRect(x + 9, y - 3, 1, 5);
  ctx.fillRect(x + 7, y - 1, 5, 1);
  ctx.restore();
}

// Ficha flotando sobre quien todavía no la ha entregado.
function drawPieceMark(ctx, x, y, t, color) {
  const bounce = Math.round(Math.sin(t * 4) * 1.5);
  const py = y - 18 + bounce;
  ctx.fillStyle = '#f4f0e6';
  ctx.fillRect(x - 1, py - 1, 18, 16);
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x, py, 16, 14);
  ctx.fillStyle = color;
  ctx.fillRect(x + 2, py + 2, 12, 10);
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x + 15, py + 4, 4, 6);
  ctx.fillStyle = color;
  ctx.fillRect(x + 15, py + 5, 3, 4);
  ctx.fillStyle = '#f4f0e6';
  ctx.fillRect(x + 3, py + 3, 4, 2);
}

// Corazoncito que sube desde la gente en la celebración.
function drawTinyHeart(ctx, x, y, bright) {
  ctx.fillStyle = bright ? '#f2837e' : '#e0453e';
  ctx.fillRect(x + 1, y, 1, 1);
  ctx.fillRect(x + 3, y, 1, 1);
  ctx.fillRect(x, y + 1, 5, 2);
  ctx.fillRect(x + 1, y + 3, 3, 1);
  ctx.fillRect(x + 2, y + 4, 1, 1);
}

// Notas de música: se le salen a quien está con audífonos.
function drawMusicNotes(ctx, x, y, t) {
  for (let i = 0; i < 2; i++) {
    const p = (t * 0.7 + i * 0.5) % 1;
    const nx = Math.round(x + i * 6 + Math.sin((p + i) * 6) * 2);
    const ny = Math.round(y - p * 14);
    ctx.fillStyle = i === 0 ? '#4a8fd4' : '#8fd4e8';
    ctx.fillRect(nx + 2, ny, 3, 1);
    ctx.fillRect(nx + 4, ny + 1, 1, 4);
    ctx.fillRect(nx + 2, ny + 4, 3, 2);
  }
}

function arrowTriangle(ctx, x, y, dir, size, color) {
  ctx.fillStyle = color;
  for (let i = 0; i < size; i++) {
    if (dir === 'right') ctx.fillRect(x - i, y - i, 1, i * 2 + 1);
    else if (dir === 'left') ctx.fillRect(x + i, y - i, 1, i * 2 + 1);
    else if (dir === 'down') ctx.fillRect(x - i, y - i, i * 2 + 1, 1);
    else ctx.fillRect(x - i, y + i, i * 2 + 1, 1);
  }
}

// Flecha en el borde de la pantalla: apunta hacia quien falta por visitar.
// Late y se empuja hacia donde apunta para que se note entre tanta gente.
function drawEdgeArrow(ctx, x, y, dir, color, t) {
  const pulse = (Math.sin(t * 5) + 1) / 2;
  const size = 6 + Math.round(pulse * 3);
  const push = Math.round(pulse * 4);
  const ax = Math.round(x) + (dir === 'right' ? push : dir === 'left' ? -push : 0);
  const ay = Math.round(y) + (dir === 'down' ? push : dir === 'up' ? -push : 0);
  const off = dir === 'right' ? 1 : dir === 'left' ? -1 : 0;
  const offY = dir === 'down' ? 1 : dir === 'up' ? -1 : 0;
  ctx.save();
  ctx.globalAlpha = 0.65 + pulse * 0.35;
  arrowTriangle(ctx, ax + off, ay + offY, dir, size + 1, '#241a2b');
  arrowTriangle(ctx, ax, ay, dir, size, color);
  ctx.restore();
}

// Globito de "tengo algo que decirte" sobre los mensajes opcionales.
function drawTalkDots(ctx, x, y, t) {
  const bounce = Math.round(Math.sin(t * 3) * 1);
  const py = y - 7 + bounce;
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x + 3, py, 10, 7);
  ctx.fillStyle = '#f4f0e6';
  ctx.fillRect(x + 4, py + 1, 8, 5);
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x + 5, py + 3, 1, 1);
  ctx.fillRect(x + 7, py + 3, 1, 1);
  ctx.fillRect(x + 9, py + 3, 1, 1);
}

function drawQuestMark(ctx, x, y, t, color) {
  const bounce = Math.round(Math.sin(t * 5) * 1.5);
  const py = y - 16 + bounce;
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x + 4, py, 8, 15);
  ctx.fillStyle = color || '#e8c25a';
  ctx.fillRect(x + 6, py + 2, 4, 8);
  ctx.fillRect(x + 6, py + 11, 4, 3);
}

function drawPrompt(ctx, x, y, t) {
  const bounce = Math.round(Math.sin(t * 6) * 1.5);
  const py = y - 10 + bounce;
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x + 4, py, 8, 10);
  ctx.fillStyle = '#e8c25a';
  ctx.fillRect(x + 5, py + 1, 6, 8);
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x + 6, py + 2, 4, 1);
  ctx.fillRect(x + 6, py + 4, 3, 1);
  ctx.fillRect(x + 6, py + 6, 4, 1);
  ctx.fillRect(x + 6, py + 2, 1, 5);
}
