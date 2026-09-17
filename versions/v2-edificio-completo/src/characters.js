const SPRITE_SIZE = 16;
const WALK_SPEED = 58;
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
  return def.npcs.map(function (n) {
    return {
      id: n.id,
      kind: n.kind,
      style: n.style,
      col: n.col,
      row: n.row,
      x: n.col * TILE,
      y: n.row * TILE + (n.dy || 0),
      role: n.role,
      monitor: n.monitor || null,
      item: n.item || null,
      stand: !!n.stand,
      still: !!n.still,
      flip: !!n.flip,
      talked: false,
    };
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

  const nextX = player.x + dx * WALK_SPEED * dt;
  if (!boxBlocked(floor, nextX, player.y) && !npcBlocked(npcs, nextX, player.y)) player.x = nextX;
  const nextY = player.y + dy * WALK_SPEED * dt;
  if (!boxBlocked(floor, player.x, nextY) && !npcBlocked(npcs, player.x, nextY)) player.y = nextY;

  if (player.moving) {
    player.animTime += dt;
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
  const pc = centerOf(player);
  let best = null;
  let bestDist = BUBBLE_RANGE;
  npcs.forEach(function (n) {
    if (n.role !== 'optional') return;
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
    if (!canTalkTo(n)) return;
    const nc = centerOf(n);
    const dist = Math.hypot(pc.x - nc.x, pc.y - nc.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = n;
    }
  });
  return best;
}

function nearElevator(player) {
  const pc = centerOf(player);
  const ex = (ELEV.col + 1) * TILE;
  const ey = ELEV.row * TILE + SPRITE_SIZE / 2;
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

function drawPlayer(ctx, player) {
  const frame = player.moving ? player.frame : 0;
  if (player.dir === 'up') drawSprite(ctx, 'spartanUp', frame, player.x, player.y, false);
  else if (player.dir === 'down') drawSprite(ctx, 'spartanDown', frame, player.x, player.y, false);
  else drawSprite(ctx, 'spartanSide', frame, player.x, player.y, player.dir === 'left');
}

function drawNpc(ctx, npc, time) {
  const bob = npc.stand || npc.still ? 0 : Math.floor(time * 4 + npc.col) % 2 === 0 ? 0 : 1;
  drawSprite(ctx, spriteOf(npc), 0, npc.x, npc.y + bob, npc.flip);
}

function drawHeart(ctx, x, y, t) {
  const bounce = Math.round(Math.sin(t * 4) * 1.5);
  const cy = y - 8 + bounce;
  ctx.fillStyle = '#e0453e';
  ctx.fillRect(x + 4, cy + 1, 2, 1);
  ctx.fillRect(x + 8, cy + 1, 2, 1);
  ctx.fillRect(x + 3, cy + 2, 4, 2);
  ctx.fillRect(x + 7, cy + 2, 4, 2);
  ctx.fillRect(x + 4, cy + 4, 6, 1);
  ctx.fillRect(x + 5, cy + 5, 4, 1);
  ctx.fillRect(x + 6, cy + 6, 2, 1);
  ctx.fillStyle = '#f2837e';
  ctx.fillRect(x + 4, cy + 2, 1, 1);
}

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

function drawQuestMark(ctx, x, y, t) {
  const bounce = Math.round(Math.sin(t * 5) * 1.5);
  const py = y - 12 + bounce;
  ctx.fillStyle = '#241a2b';
  ctx.fillRect(x + 6, py, 4, 11);
  ctx.fillStyle = '#e8c25a';
  ctx.fillRect(x + 7, py + 1, 2, 6);
  ctx.fillRect(x + 7, py + 8, 2, 2);
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
