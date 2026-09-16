const SPRITE_SIZE = 16;
const WALK_SPEED = 52;
const ANIM_FPS = 7;
const INTERACT_RANGE = 26;

const HITBOX = { ox: 3, oy: 9, w: 10, h: 6 };

const DEV_LIST = [
  { key: 'daniel', col: 3, row: 3, monitor: 'crt' },
  { key: 'diana', col: 8, row: 3, monitor: 'flat' },
  { key: 'nicolas', col: 3, row: 6, monitor: 'laptop' },
  { key: 'felipe', col: 8, row: 6, monitor: 'flat' },
  { key: 'guillermo', col: 5, row: 9, monitor: 'crt' },
];

const FINALE_SPOTS = [
  { key: 'daniel', col: 16, row: 7 },
  { key: 'diana', col: 18, row: 7 },
  { key: 'nicolas', col: 20, row: 7 },
  { key: 'guillermo', col: 17, row: 10 },
  { key: 'felipe', col: 19, row: 10 },
];

const SPAWN = { col: 11, row: 10 };
const DOOR = { col: 13, row: 9 };

const spriteCache = {};

function makeSpriteCanvas(frame) {
  const c = document.createElement('canvas');
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
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
  const img = getSprite(name, frame);
  if (!flip) {
    ctx.drawImage(img, Math.round(x), Math.round(y));
    return;
  }
  ctx.save();
  ctx.translate(Math.round(x) + SPRITE_SIZE, Math.round(y));
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function createPlayer() {
  return {
    x: SPAWN.col * TILE,
    y: SPAWN.row * TILE,
    dir: 'down',
    moving: false,
    animTime: 0,
    frame: 0,
  };
}

function createDevs() {
  return DEV_LIST.map(function (d) {
    return {
      key: d.key,
      col: d.col,
      row: d.row,
      monitor: d.monitor,
      x: d.col * TILE,
      y: d.row * TILE,
      talked: false,
    };
  });
}

function boxBlocked(x, y, doorOpen) {
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
      if (isSolidAt(c, r, doorOpen)) return true;
    }
  }
  return false;
}

function devBlocked(x, y, devs) {
  const left = x + HITBOX.ox;
  const top = y + HITBOX.oy;
  const right = left + HITBOX.w;
  const bottom = top + HITBOX.h;
  return devs.some(function (d) {
    return left < d.x + 13 && right > d.x + 3 && top < d.y + 15 && bottom > d.y + 4;
  });
}

function movePlayer(player, dt, input, devs, doorOpen) {
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

  const stepX = dx * WALK_SPEED * dt;
  const stepY = dy * WALK_SPEED * dt;

  const nextX = player.x + stepX;
  if (!boxBlocked(nextX, player.y, doorOpen) && !devBlocked(nextX, player.y, devs)) {
    player.x = nextX;
  }
  const nextY = player.y + stepY;
  if (!boxBlocked(player.x, nextY, doorOpen) && !devBlocked(player.x, nextY, devs)) {
    player.y = nextY;
  }

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

function nearestDev(player, devs) {
  const pc = centerOf(player);
  let best = null;
  let bestDist = INTERACT_RANGE;
  devs.forEach(function (d) {
    if (d.talked) return;
    const dc = centerOf(d);
    const dist = Math.hypot(pc.x - dc.x, pc.y - dc.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  });
  return best;
}

function drawPlayer(ctx, player) {
  const frame = player.moving ? player.frame : 0;
  if (player.dir === 'up') drawSprite(ctx, 'spartanUp', frame, player.x, player.y, false);
  else if (player.dir === 'down') drawSprite(ctx, 'spartanDown', frame, player.x, player.y, false);
  else drawSprite(ctx, 'spartanSide', frame, player.x, player.y, player.dir === 'left');
}

function drawDevSitting(ctx, dev, time) {
  const bob = Math.floor(time * 4 + dev.col) % 2 === 0 ? 0 : 1;
  drawSprite(ctx, dev.key + 'Sit', 0, dev.x, dev.y + bob, false);
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
