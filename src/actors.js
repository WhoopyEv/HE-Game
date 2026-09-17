const GRAVITY = 900;
const JUMP_V = -318;
const WALK_SPEED = 104;
const MAX_FALL = 430;
const COYOTE = 0.09;
const JUMP_BUFFER = 0.11;
const HITBOX = { ox: 3, oy: 2, w: 10, h: 14 };

function isSolidChar(ch) {
  return ch === '#';
}

function isOneWayChar(ch) {
  return ch === '=';
}

function createPlayer(x, y) {
  return {
    x: x,
    y: y,
    vx: 0,
    vy: 0,
    dir: 1,
    onGround: false,
    coyote: 0,
    buffer: 0,
    animTime: 0,
    frame: 0,
    hurtFlash: 0,
    jumpCut: true,
    justJumped: false,
    spawnX: x,
    spawnY: y,
  };
}

function boxOf(p) {
  return { x: p.x + HITBOX.ox, y: p.y + HITBOX.oy, w: HITBOX.w, h: HITBOX.h };
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function solidAtPixel(px_, py_) {
  return isSolidChar(tileAt(Math.floor(px_ / TILE), Math.floor(py_ / TILE)));
}

function blockedHorizontal(box, extraSolids) {
  const c0 = Math.floor(box.x / TILE);
  const c1 = Math.floor((box.x + box.w - 1) / TILE);
  const r0 = Math.floor(box.y / TILE);
  const r1 = Math.floor((box.y + box.h - 1) / TILE);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (isSolidChar(tileAt(c, r))) return true;
    }
  }
  return false;
}

function movePlayer(p, dt, input, extraSolids) {
  p.vx = 0;
  if (input.left) p.vx -= WALK_SPEED;
  if (input.right) p.vx += WALK_SPEED;
  if (p.vx !== 0) p.dir = p.vx > 0 ? 1 : -1;

  // --- eje X ---
  const stepX = p.vx * dt;
  if (stepX !== 0) {
    p.x += stepX;
    const box = boxOf(p);
    if (blockedHorizontal(box, extraSolids)) {
      const dirX = stepX > 0 ? 1 : -1;
      let guard = 0;
      while (blockedHorizontal(boxOf(p), extraSolids) && guard++ < 24) {
        p.x -= dirX;
      }
    }
  }
  if (p.x < 0) p.x = 0;
  if (p.x > LEVEL_W - 16) p.x = LEVEL_W - 16;

  // --- salto ---
  p.buffer -= dt;
  if (input.jumpPressed) p.buffer = JUMP_BUFFER;
  if (p.onGround) p.coyote = COYOTE;
  else p.coyote -= dt;

  if (p.buffer > 0 && p.coyote > 0) {
    p.vy = JUMP_V;
    p.buffer = 0;
    p.coyote = 0;
    p.onGround = false;
    p.jumpCut = false;
    p.justJumped = true;
  }

  // --- eje Y ---
  p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);
  const prevBottom = boxOf(p).y + HITBOX.h;
  p.y += p.vy * dt;
  p.onGround = false;

  const box = boxOf(p);
  const c0 = Math.floor(box.x / TILE);
  const c1 = Math.floor((box.x + box.w - 1) / TILE);

  if (p.vy >= 0) {
    const bottom = box.y + box.h;
    const row = Math.floor(bottom / TILE);
    for (let c = c0; c <= c1; c++) {
      const ch = tileAt(c, row);
      const top = row * TILE;
      const oneWayOk = isOneWayChar(ch) && prevBottom <= top + 1;
      if (isSolidChar(ch) || oneWayOk) {
        p.y = top - HITBOX.h - HITBOX.oy;
        p.vy = 0;
        p.onGround = true;
        break;
      }
    }
    if (!p.onGround) {
      for (let i = 0; i < extraSolids.length; i++) {
        const s = extraSolids[i];
        const overX = box.x < s.x + s.w && box.x + box.w > s.x;
        if (overX && bottom >= s.y && bottom <= s.y + 12 && prevBottom <= s.y + 1) {
          p.y = s.y - HITBOX.h - HITBOX.oy;
          p.vy = 0;
          p.onGround = true;
          break;
        }
      }
    }
  } else {
    const row = Math.floor(box.y / TILE);
    for (let c = c0; c <= c1; c++) {
      if (isSolidChar(tileAt(c, row))) {
        p.y = (row + 1) * TILE - HITBOX.oy;
        p.vy = 0;
        break;
      }
    }
  }

  if (p.y > VIEW_H + 40) {
    p.y = VIEW_H + 40;
    p.vy = 0;
  }

  if (Math.abs(p.vx) > 1 && p.onGround) {
    p.animTime += dt;
    p.frame = Math.floor(p.animTime * 9) % 2;
  } else {
    p.animTime = 0;
    p.frame = 0;
  }
  if (p.hurtFlash > 0) p.hurtFlash -= dt;
}

function drawPlayer(ctx, p, time) {
  if (p.hurtFlash > 0 && Math.floor(time * 20) % 2 === 0) return;
  const flip = p.dir < 0;
  if (!p.onGround) drawSprite(ctx, 'spartanJump', 0, p.x, p.y, flip);
  else drawSprite(ctx, 'spartanRun', p.frame, p.x, p.y, flip);
}

// ---------- entidades ----------

function createEntities() {
  return LEVEL.entities.map(function (def) {
    const x = def.col * TILE;
    const y = def.row * TILE;
    if (def.type === 'patrol') {
      return {
        type: 'patrol',
        skin: def.skin,
        x: x,
        y: y,
        w: 16,
        h: 16,
        dir: 1,
        speed: def.speed || 44,
        minX: x,
        maxX: x + (def.range || 12) * TILE,
      };
    }
    if (def.type === 'shooter') {
      return {
        type: 'shooter',
        skin: def.skin,
        x: x,
        y: y,
        dir: def.dir || -1,
        power: def.power || 60,
        lift: def.lift || -240,
        interval: def.interval || 2.4,
        timer: Math.random() * (def.interval || 2.4),
        telegraph: 0,
        shots: [],
      };
    }
    if (def.type === 'crumble') {
      return {
        type: 'crumble',
        x: x,
        y: y,
        w: (def.w || 2) * TILE,
        h: 6,
        state: 'idle',
        timer: 0,
      };
    }
    if (def.type === 'piece') {
      return { type: 'piece', x: x, y: y, w: 16, h: 16, value: def.value, taken: false };
    }
    return { type: 'goal', x: x, y: y, w: 24, h: 3 * TILE };
  });
}

function activeSolids(entities) {
  const out = [];
  entities.forEach(function (e) {
    if (e.type === 'crumble' && e.state !== 'gone') {
      out.push({ x: e.x, y: e.y, w: e.w, h: e.h });
    }
  });
  return out;
}

function updateEntities(entities, dt, player, hooks) {
  const pbox = boxOf(player);

  entities.forEach(function (e) {
    if (e.type === 'patrol') {
      e.x += e.dir * e.speed * dt;
      if (e.x <= e.minX) {
        e.x = e.minX;
        e.dir = 1;
      }
      if (e.x >= e.maxX) {
        e.x = e.maxX;
        e.dir = -1;
      }
      if (overlaps(pbox, { x: e.x + 2, y: e.y + 4, w: 12, h: 12 })) hooks.onHit();
      return;
    }

    if (e.type === 'shooter') {
      e.timer -= dt;
      if (e.timer <= 0.4 && e.telegraph <= 0 && e.timer > 0) e.telegraph = e.timer;
      if (e.timer <= 0) {
        e.timer = e.interval;
        e.telegraph = 0;
        e.shots.push({
          x: e.x + 8,
          y: e.y + 2,
          vx: e.dir * e.power,
          vy: e.lift,
        });
      }
      e.shots = e.shots.filter(function (s) {
        s.vy += GRAVITY * 0.55 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (overlaps(pbox, { x: s.x - 3, y: s.y - 3, w: 6, h: 6 })) {
          hooks.onHit();
          return false;
        }
        return s.y < VIEW_H + 20 && s.x > e.x - 300 && s.x < e.x + 300;
      });
      return;
    }

    if (e.type === 'crumble') {
      if (e.state === 'shaking') {
        e.timer -= dt;
        if (e.timer <= 0) {
          e.state = 'gone';
          e.timer = 2.2;
        }
      } else if (e.state === 'gone') {
        e.timer -= dt;
        if (e.timer <= 0) e.state = 'idle';
      } else {
        const standing =
          player.onGround &&
          pbox.x < e.x + e.w &&
          pbox.x + pbox.w > e.x &&
          Math.abs(pbox.y + pbox.h - e.y) < 3;
        if (standing) {
          e.state = 'shaking';
          e.timer = 0.75;
        }
      }
      return;
    }

    if (e.type === 'piece' && !e.taken) {
      if (overlaps(pbox, { x: e.x + 2, y: e.y + 2, w: 12, h: 12 })) {
        e.taken = true;
        hooks.onPiece(e.value);
      }
      return;
    }

    if (e.type === 'goal') {
      if (overlaps(pbox, { x: e.x, y: e.y, w: e.w, h: e.h })) hooks.onGoal();
    }
  });
}

// ---------- arte de entidades ----------

function drawChairHazard(ctx, x, y, t) {
  const wob = Math.round(Math.sin(t * 8) * 1);
  px(ctx, x + 3, y + 3 + wob, 10, 7, '#3f4a5c');
  px(ctx, x + 4, y + 4 + wob, 8, 5, '#55627a');
  px(ctx, x + 2, y + 1 + wob, 3, 9, '#2f3a4a');
  px(ctx, x + 6, y + 10, 4, 3, '#6f757f');
  px(ctx, x + 2, y + 12, 4, 4, '#241a2b');
  px(ctx, x + 10, y + 12, 4, 4, '#241a2b');
  px(ctx, x + 3, y + 13, 2, 2, '#55555f');
  px(ctx, x + 11, y + 13, 2, 2, '#55555f');
}

function drawLauncher(ctx, x, y) {
  px(ctx, x + 2, y + 4, 12, 12, '#2f6ea8');
  px(ctx, x + 3, y + 5, 10, 6, '#27587f');
  px(ctx, x + 4, y + 1, 8, 4, '#c9c4b6');
  px(ctx, x + 6, y + 2, 4, 2, '#f4f0e6');
}

function drawVacuum(ctx, x, y, t) {
  const wob = Math.floor(t * 9) % 2;
  px(ctx, x + 1, y + 7, 14, 7, '#2f3a4a');
  px(ctx, x + 2, y + 6, 12, 2, '#55627a');
  px(ctx, x + 3, y + 8, 10, 3, '#3f4a5c');
  px(ctx, x + 5, y + 9, 3, 1, '#7ad87a');
  px(ctx, x + 10, y + 4, 3, 4, '#6f757f');
  px(ctx, x + 11, y + 1, 2, 4, '#8a8f98');
  px(ctx, x + 1, y + 14, 4, 2, '#241a2b');
  px(ctx, x + 11, y + 14, 4, 2, '#241a2b');
  px(ctx, x + 2 + wob, y + 12, 2, 2, '#55555f');
  px(ctx, x + 11 + wob, y + 12, 2, 2, '#55555f');
}

const HAZARD_ART = {
  chair: drawChairHazard,
  vacuum: drawVacuum,
  coffee: function (ctx, x, y) {
    artCoffee(ctx, x, y);
  },
  printer: function (ctx, x, y) {
    artPrinter(ctx, x, y);
  },
  pingball: drawLauncher,
};

function drawShot(ctx, s, skin) {
  if (skin === 'printer') {
    px(ctx, s.x - 3, s.y - 3, 6, 6, '#f4f0e6');
    px(ctx, s.x - 2, s.y - 2, 3, 2, '#d8d2c4');
    return;
  }
  if (skin === 'pingball') {
    px(ctx, s.x - 2, s.y - 2, 5, 5, '#f4f0e6');
    px(ctx, s.x - 1, s.y - 1, 2, 2, '#d8d2c4');
    return;
  }
  px(ctx, s.x - 3, s.y - 4, 7, 6, '#f4f0e6');
  px(ctx, s.x - 2, s.y - 3, 5, 3, '#6b4a2a');
  px(ctx, s.x + 4, s.y - 3, 2, 2, '#d8d2c4');
}

function drawPieceIcon(ctx, x, y, color, bob) {
  const py = y + bob;
  px(ctx, x + 1, py + 1, 14, 14, '#241a2b');
  px(ctx, x + 2, py + 2, 12, 12, color);
  px(ctx, x + 14, py + 5, 3, 6, '#241a2b');
  px(ctx, x + 14, py + 6, 2, 4, color);
  px(ctx, x + 1, py + 6, 2, 4, '#241a2b');
  px(ctx, x + 3, py + 3, 4, 2, '#f4f0e6');
  px(ctx, x + 3, py + 5, 2, 2, '#f4f0e6');
}

function drawEntities(ctx, entities, time) {
  entities.forEach(function (e) {
    if (e.type === 'patrol') {
      const art = HAZARD_ART[e.skin] || drawChairHazard;
      art(ctx, e.x, e.y, time);
      return;
    }
    if (e.type === 'shooter') {
      const art = HAZARD_ART[e.skin];
      if (art) art(ctx, e.x, e.y, time);
      if (e.timer <= 0.4 && Math.floor(time * 16) % 2 === 0) {
        px(ctx, e.x + 5, e.y - 6, 6, 4, '#e8c25a');
      }
      e.shots.forEach(function (s) {
        drawShot(ctx, s, e.skin);
      });
      return;
    }
    if (e.type === 'crumble') {
      if (e.state === 'gone') return;
      const shake = e.state === 'shaking' && Math.floor(time * 18) % 2 === 0 ? 1 : 0;
      px(ctx, e.x, e.y + shake, e.w, 5, '#8a7f6b');
      px(ctx, e.x, e.y + shake, e.w, 2, '#a89a80');
      px(ctx, e.x, e.y + 5 + shake, e.w, 1, '#6e6455');
      for (let i = 0; i < e.w; i += 8) px(ctx, e.x + i + 3, e.y + 2 + shake, 1, 2, '#6e6455');
      return;
    }
    if (e.type === 'piece' && !e.taken) {
      const value = VALUE_BY_ID[e.value];
      drawPieceIcon(ctx, e.x, e.y, value ? value.color : '#f4f0e6', Math.round(Math.sin(time * 3) * 2));
      return;
    }
    if (e.type === 'goal') {
      px(ctx, e.x, e.y, 24, 3 * TILE, '#6b4a2a');
      px(ctx, e.x + 2, e.y + 2, 20, 3 * TILE - 4, '#c9854b');
      px(ctx, e.x + 4, e.y + 5, 16, 20, '#b8e8f4');
      px(ctx, e.x + 17, e.y + 24, 3, 3, '#e8c25a');
      px(ctx, e.x - 2, e.y - 6, 28, 6, '#e0453e');
      px(ctx, e.x + 2, e.y - 5, 6, 4, '#f4f0e6');
      px(ctx, e.x + 12, e.y - 5, 6, 4, '#f4f0e6');
    }
  });
}
