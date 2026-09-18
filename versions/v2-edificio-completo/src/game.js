(function () {
  const VIEW_W = 384;
  const VIEW_H = 224;
  const CULL = 24;

  // Animación final (tomada de la v3): las piezas recogidas vuelan hasta armar
  // el logo de Hired Experts antes del mensaje del equipo.
  const LOGO_SLOTS = {
    respaldo: { x: 16, y: 11 },
    oportunidad: { x: 26, y: 3 },
    aprendizaje: { x: 15, y: 9 },
    confianza: { x: 4, y: 13 },
    equipo: { x: 16, y: 18 },
  };
  const LOGO_SCALE = 3;
  const LOGO_X = Math.round((VIEW_W - 32 * LOGO_SCALE) / 2);
  const LOGO_Y = 18;

  const STATE = {
    TITLE: 'title',
    HOWTO: 'howto',
    INTRO: 'intro',
    PLAYING: 'playing',
    DIALOGUE: 'dialogue',
    ELEVATOR: 'elevator',
    FINALE_TALK: 'finaleTalk',
    FINALE_END: 'finaleEnd',
  };

  const IDS = [
    'title-screen', 'howto-screen', 'howto-btn', 'end-screen', 'hud', 'hud-count', 'hud-slots', 'mute', 'end-credits',
    'end-dedication', 'elevator', 'elev-list', 'floor-label', 'value-flash',
    'bubble', 'bubble-name', 'bubble-text', 'clouds', 'help', 'help-modal', 'help-close', 'stage',
  ];

  let ctx = null;
  let state = STATE.TITLE;
  let player = null;
  let time = 0;
  let collected = [];
  let missionGiven = false;
  let finaleTriggered = false;
  let partyOn = false;
  let floorIdx = 0;
  let elevSel = 0;
  let labelTimer = 0;
  let flashTimer = 0;
  let confetti = [];
  let parade = null;
  let celebrateTimer = 0;
  let finaleLogo = null;
  let logoCanvas = null;
  let bubbleFor = null;
  let bubbleW = 0;
  let bubbleH = 0;
  const floors = [];
  const cloudEls = [];
  const el = {};

  function complete() {
    return collected.length >= VALUES.length;
  }

  function cacheElements() {
    IDS.forEach(function (id) {
      el[id] = document.getElementById(id);
    });
  }

  function floorState(i) {
    if (!floors[i]) {
      floors[i] = { def: BUILDING[i], npcs: createNpcs(BUILDING[i]), bg: null };
    }
    return floors[i];
  }

  function backgroundFor(fs) {
    if (!fs.bg) {
      const c = document.createElement('canvas');
      c.width = fs.def.w * TILE;
      c.height = fs.def.h * TILE;
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = false;
      drawFloorBackground(g, fs.def);
      fs.bg = c;
    }
    return fs.bg;
  }

  function current() {
    return floorState(floorIdx);
  }

  function buildHudSlots() {
    el['hud-slots'].innerHTML = '';
    VALUES.forEach(function () {
      el['hud-slots'].appendChild(document.createElement('span'));
    });
  }

  function updateHud() {
    el['hud-count'].textContent = collected.length + '/' + VALUES.length;
    el.hud.classList.toggle('is-complete', complete());
    const slots = el['hud-slots'].children;
    VALUES.forEach(function (v, i) {
      const slot = slots[i];
      if (!slot) return;
      const has = collected.indexOf(v.id) !== -1;
      slot.className = has ? 'piece-slot is-on' : 'piece-slot';
      slot.style.background = has ? v.color : '';
    });
  }

  // El negro de "Respaldo" desaparece sobre fondo oscuro: para textos y marcas
  // se reemplaza por un gris claro.
  function flashColorFor(color) {
    return color === '#0d0a12' ? '#c9c4b6' : color;
  }

  function showValueFlash(label, color) {
    el['value-flash'].style.setProperty('--flash-color', color);
    el['value-flash'].querySelector('span').textContent = '¡' + label + '!';
    el['value-flash'].classList.add('is-visible');
    flashTimer = 1.6;
  }

  function showLabel(text) {
    el['floor-label'].textContent = text;
    el['floor-label'].classList.add('is-visible');
    labelTimer = 3.8;
  }

  function hideLabel() {
    el['floor-label'].classList.remove('is-visible');
  }

  function helpOpen() {
    return el['help-modal'].classList.contains('is-visible');
  }

  function hideBubble() {
    el.bubble.classList.remove('is-visible');
    bubbleFor = null;
  }

  function updateBubble(fs, cam) {
    if (state !== STATE.PLAYING || helpOpen()) {
      hideBubble();
      return null;
    }
    const npc = nearestBubbleNpc(player, fs.npcs);
    const msg = npc ? MESSAGES.extras[npc.id] : null;
    if (!msg) {
      hideBubble();
      return null;
    }
    if (bubbleFor !== npc.id) {
      bubbleFor = npc.id;
      el['bubble-name'].textContent = msg.name;
      el['bubble-text'].textContent = msg.lines.join(' ');
      bubbleW = el.bubble.offsetWidth;
      bubbleH = el.bubble.offsetHeight;
    }
    const scale = Engine.getScale();
    const stageW = el.stage.clientWidth || VIEW_W * scale;
    const anchorX = (npc.x + 8 - cam.x) * scale;
    const half = bubbleW / 2;
    const left = Math.max(half + 8, Math.min(stageW - half - 8, anchorX));
    const top = Math.max(bubbleH + 18, (npc.y - cam.y) * scale);
    el.bubble.style.left = Math.round(left) + 'px';
    el.bubble.style.top = Math.round(top) + 'px';
    el.bubble.style.setProperty('--tail', Math.round(anchorX - left + half) + 'px');
    el.bubble.classList.add('is-visible');
    return npc;
  }

  function openDialogue(name, lines, done) {
    state = STATE.DIALOGUE;
    Dialogue.open(name, lines, function () {
      if (done) done();
      else state = STATE.PLAYING;
    });
  }

  function showHowto() {
    el['title-screen'].classList.remove('is-visible');
    el['howto-screen'].classList.add('is-visible');
    state = STATE.HOWTO;
  }

  function startGame() {
    el['title-screen'].classList.remove('is-visible');
    el['howto-screen'].classList.remove('is-visible');
    el.hud.classList.add('is-visible');
    Audio8.startMusic();
    updateHud();
    showLabel(BUILDING[0].label);
    state = STATE.INTRO;
    Dialogue.open(MESSAGES.intro.name, MESSAGES.intro.lines, function () {
      state = STATE.PLAYING;
    });
  }

  function renderElevator() {
    const list = el['elev-list'];
    list.innerHTML = '';
    BUILDING.forEach(function (def, i) {
      const row = document.createElement('li');
      row.className = 'elev-row';
      if (i === elevSel) row.classList.add('is-sel');
      if (i === floorIdx) row.classList.add('is-here');

      const num = document.createElement('span');
      num.className = 'elev-num';
      num.textContent = def.n;

      const name = document.createElement('span');
      name.className = 'elev-name';
      name.textContent = def.elevLabel || 'PISO ' + def.n;

      const mark = document.createElement('span');
      mark.className = 'elev-mark';
      if (i === TERRACE_IDX) {
        mark.textContent = complete() ? '★' : '🔒';
        if (!complete()) row.classList.add('is-locked');
      } else if (i === 1) {
        mark.textContent = complete() ? '✓' : collected.length + '/' + VALUES.length;
      } else {
        mark.textContent = '';
      }

      row.appendChild(num);
      row.appendChild(name);
      row.appendChild(mark);
      row.addEventListener('click', function () {
        elevSel = i;
        confirmElevator();
      });
      list.appendChild(row);
    });
  }

  function openElevator() {
    elevSel = floorIdx;
    state = STATE.ELEVATOR;
    renderElevator();
    el.elevator.classList.add('is-visible');
    Audio8.confirm();
  }

  function closeElevator() {
    el.elevator.classList.remove('is-visible');
    state = STATE.PLAYING;
  }

  function goToFloor(i) {
    floorIdx = i;
    const fs = current();
    player.x = ELEV_SPAWN.col * TILE;
    player.y = ELEV_SPAWN.row * TILE;
    player.dir = 'down';
    player.moving = false;
    backgroundFor(fs);
    Audio8.ding();
    showLabel(fs.def.label);
  }

  // La aspiradora va y vuelve por su tramo, sin pasar por encima de nadie.
  function moveRobot(fs) {
    const cfg = fs.def.robot;
    if (!cfg) return;
    const span = (cfg.col1 - cfg.col0) * TILE;
    const t = (time * cfg.speed) % (span * 2);
    const rx = cfg.col0 * TILE + (t <= span ? t : span * 2 - t);
    fs.npcs.forEach(function (n) {
      if (n.kind === 'robot') n.x = rx;
    });
  }

  // Zorro recorre en bucle los puntos de zorroPatrol, cambiando de dirección al
  // llegar a cada uno; se voltea el sprite según hacia dónde camina.
  function moveZorro(fs, dt) {
    const cfg = fs.def.zorroPatrol;
    if (!cfg) return;
    const npc = fs.npcs.filter(function (n) {
      return n.id === 'zorro';
    })[0];
    if (!npc) return;
    if (npc.wp === undefined) npc.wp = 0;
    const target = cfg.points[(npc.wp + 1) % cfg.points.length];
    const tx = target.col * TILE;
    const ty = target.row * TILE;
    const dx = tx - npc.x;
    const dy = ty - npc.y;
    const dist = Math.hypot(dx, dy);
    const step = cfg.speed * dt;
    if (dist <= step) {
      npc.x = tx;
      npc.y = ty;
      npc.wp = (npc.wp + 1) % cfg.points.length;
    } else {
      npc.x += (dx / dist) * step;
      npc.y += (dy / dist) * step;
      if (dx !== 0) npc.flip = dx < 0;
    }
  }

  // Después de hablar con Marce: todos van saliendo del ascensor y se reparten
  // por la terraza. Cuando el último llega, viene el mensaje del equipo.
  function startParade() {
    const fs = current();
    const fromX = ELEV.col * TILE + 8;
    const fromY = (ELEV.row + 1) * TILE;
    let i = 0;
    fs.npcs.forEach(function (n) {
      if (!n.party) return;
      n.fromX = fromX;
      n.fromY = fromY;
      n.toX = n.col * TILE;
      n.toY = n.row * TILE + (n.dy || 0);
      n.x = fromX;
      n.y = fromY;
      n.delay = i * 0.1;
      n.hidden = true;
      i += 1;
    });
    parade = { t: 0, total: i * 0.1 + 1.3 };
    partyOn = true;
    state = STATE.FINALE_TALK;
    spawnConfetti();
    Audio8.fanfare();
  }

  function updateParade(dt) {
    const fs = current();
    parade.t += dt;
    fs.npcs.forEach(function (n) {
      if (!n.party) return;
      const p = Math.max(0, Math.min(1, (parade.t - n.delay) / 1.1));
      if (p <= 0) return;
      n.hidden = false;
      const e = 1 - Math.pow(1 - p, 3);
      n.x = n.fromX + (n.toX - n.fromX) * e;
      n.y = n.fromY + (n.toY - n.fromY) * e;
    });
    if (parade.t < parade.total) return;
    parade = null;
    startLogoGather();
  }

  // Ícono de pieza (de la v3): un rombo del color del valor con un brillito.
  function drawPieceIcon(x, y, color, bob) {
    const py = y + bob;
    px(ctx, x + 1, py + 1, 14, 14, '#241a2b');
    px(ctx, x + 2, py + 2, 12, 12, color);
    px(ctx, x + 14, py + 5, 3, 6, '#241a2b');
    px(ctx, x + 14, py + 6, 2, 4, color);
    px(ctx, x + 1, py + 6, 2, 4, '#241a2b');
    px(ctx, x + 3, py + 3, 4, 2, '#f4f0e6');
    px(ctx, x + 3, py + 5, 2, 2, '#f4f0e6');
  }

  function drawLogoParts(g, x, y, have) {
    const has = function (id) {
      return have.indexOf(id) !== -1;
    };
    if (has('respaldo')) {
      px(g, x, y, 32, 22, '#0d0a12');
      px(g, x, y, 32, 1, '#3a3244');
      px(g, x, y + 21, 32, 1, '#3a3244');
    }
    if (has('oportunidad')) px(g, x + 22, y + 2, 8, 3, '#8f2fd4');
    if (has('aprendizaje')) {
      px(g, x + 4, y + 6, 3, 9, '#f4f0e6');
      px(g, x + 11, y + 3, 3, 12, '#f4f0e6');
      px(g, x + 7, y + 9, 4, 3, '#f4f0e6');
      px(g, x + 17, y + 6, 3, 9, '#f4f0e6');
      px(g, x + 20, y + 6, 7, 3, '#f4f0e6');
      px(g, x + 20, y + 12, 7, 3, '#f4f0e6');
    }
    if (has('confianza')) px(g, x + 2, y + 11, 4, 4, '#e0453e');
    if (has('equipo')) px(g, x + 3, y + 17, 26, 3, '#f2c50a');
  }

  function buildLogoCanvas(have) {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 22;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    drawLogoParts(g, 0, 0, have);
    return c;
  }

  function easeOutFinale(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Las piezas recogidas vuelan desde abajo hasta su lugar en el logo, el logo
  // se voltea para mostrarse armado y luego aparece el equipo de desarrollo.
  function startLogoGather() {
    state = STATE.FINALE_TALK;
    hideLabel();
    const order = ['respaldo'].concat(
      VALUES.map(function (v) {
        return v.id;
      }).filter(function (id) {
        return id !== 'respaldo';
      })
    );
    const mine = order.filter(function (id) {
      return collected.indexOf(id) !== -1;
    });
    const n = Math.max(1, mine.length);
    finaleLogo = {
      t: 0,
      phase: 'gather',
      flipped: false,
      triggered: false,
      pieces: mine.map(function (id, i) {
        const slot = LOGO_SLOTS[id] || { x: 16, y: 11 };
        return {
          id: id,
          color: flashColorFor((VALUE_BY_ID[id] || {}).color || '#f4f0e6'),
          fromX: VIEW_W / 2 - (n * 22) / 2 + i * 22,
          fromY: VIEW_H - 40,
          toX: LOGO_X + slot.x * LOGO_SCALE - 8,
          toY: LOGO_Y + slot.y * LOGO_SCALE - 8,
          delay: i * 0.2,
        };
      }),
      have: collected.slice(),
    };
  }

  function updateFinaleLogo(dt) {
    const f = finaleLogo;
    if (!f || f.triggered) return;
    f.t += dt;

    if (f.phase === 'gather') {
      const last = f.pieces.length ? f.pieces[f.pieces.length - 1].delay + 0.75 : 0.5;
      if (f.t >= last + 0.35) {
        f.phase = 'flip';
        f.t = 0;
        Audio8.ding();
      }
      return;
    }

    if (f.phase === 'flip') {
      if (!f.flipped && f.t >= 0.35) {
        f.flipped = true;
        logoCanvas = buildLogoCanvas(f.have);
      }
      if (f.t >= 0.75) {
        f.phase = 'devs';
        f.t = 0;
        Audio8.unlocked();
      }
      return;
    }

    if (f.phase === 'devs' && f.t >= 1.1) {
      f.triggered = true;
      triggerFinale();
    }
  }

  // Se dibuja en coordenadas de pantalla (fuera de la cámara del piso), igual
  // que el confeti, para que quede fija encima de la terraza.
  function drawFinaleLogo() {
    const f = finaleLogo;
    if (!f) return;
    ctx.fillStyle = 'rgba(13, 10, 18, 0.72)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    if (f.phase === 'gather') {
      f.pieces.forEach(function (p) {
        const t = Math.max(0, Math.min(1, (f.t - p.delay) / 0.75));
        const e = easeOutFinale(t);
        drawPieceIcon(p.fromX + (p.toX - p.fromX) * e, p.fromY + (p.toY - p.fromY) * e, p.color, 0);
      });
      return;
    }

    const cx = LOGO_X + (32 * LOGO_SCALE) / 2;
    let sx = 1;
    if (f.phase === 'flip' && !f.flipped) {
      sx = f.t < 0.35 ? 1 - f.t / 0.35 : (f.t - 0.35) / 0.4;
      sx = Math.max(0.02, Math.min(1, sx));
    }

    ctx.save();
    ctx.translate(cx, 0);
    ctx.scale(sx, 1);
    ctx.translate(-cx, 0);
    if (f.flipped || f.phase !== 'flip') {
      if (!logoCanvas) logoCanvas = buildLogoCanvas(f.have);
      ctx.drawImage(logoCanvas, LOGO_X, LOGO_Y, 32 * LOGO_SCALE, 22 * LOGO_SCALE);
    } else {
      f.pieces.forEach(function (p) {
        drawPieceIcon(p.toX, p.toY, p.color, 0);
      });
    }
    ctx.restore();

    if (f.phase === 'devs' || f.triggered) {
      const names = ['daniel', 'diana', 'nicolas', 'guillermo', 'felipe'];
      const baseY = LOGO_Y + 22 * LOGO_SCALE + 8;
      names.forEach(function (name, i) {
        const appear = f.triggered ? 1 : Math.max(0, Math.min(1, (f.t - i * 0.12) / 0.25));
        if (appear <= 0) return;
        const x = VIEW_W / 2 - names.length * 11 + i * 22;
        const y = baseY - Math.round((1 - appear) * 8);
        const st = DEV_STYLES[name] || {};
        const scaleX = st.wide ? 1.18 : 1;
        const scaleY = st.tallBody ? 1.3 : 1;
        if (scaleX !== 1 || scaleY !== 1) {
          const cx2 = x + 8;
          const cy2 = y + 16;
          ctx.save();
          ctx.translate(cx2, cy2);
          ctx.scale(scaleX, scaleY);
          ctx.translate(-cx2, -cy2);
          drawSprite(ctx, name + 'Stand', 0, x, y, false);
          ctx.restore();
        } else {
          drawSprite(ctx, name + 'Stand', 0, x, y, false);
        }
      });
    }
  }

  function confirmElevator() {
    const target = elevSel;
    closeElevator();
    if (target === TERRACE_IDX && !complete()) {
      Audio8.confirm();
      openDialogue(MESSAGES.terraceLocked.name, MESSAGES.terraceLocked.lines);
      return;
    }
    if (target !== floorIdx) goToFloor(target);
  }

  function moveElevatorSelection(delta) {
    elevSel = (elevSel + delta + BUILDING.length) % BUILDING.length;
    renderElevator();
  }

  function spawnConfetti() {
    confetti = [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#e0453e', '#e8c25a', '#4a8fd4', '#4fa06a', '#b061c0', '#f4f0e6'];
    for (let i = 0; i < 90; i++) {
      confetti.push({
        x: Math.random() * VIEW_W,
        y: -Math.random() * VIEW_H,
        vy: 18 + Math.random() * 34,
        vx: (Math.random() - 0.5) * 16,
        size: 1 + Math.floor(Math.random() * 2),
        color: colors[Math.floor(Math.random() * colors.length)],
        sway: Math.random() * Math.PI * 2,
      });
    }
  }

  function updateConfetti(dt) {
    confetti.forEach(function (p) {
      p.sway += dt * 3;
      p.y += p.vy * dt;
      p.x += (p.vx + Math.sin(p.sway) * 10) * dt;
      if (p.y > VIEW_H) {
        p.y = -4;
        p.x = Math.random() * VIEW_W;
      }
    });
  }

  function drawConfetti() {
    confetti.forEach(function (p) {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size + 1);
    });
  }

  function showEndScreen() {
    el['end-credits'].textContent = MESSAGES.credits.join('  ·  ');
    el['end-dedication'].textContent = MESSAGES.dedication;
    el['end-screen'].classList.add('is-visible');
    el.hud.classList.remove('is-visible');
  }

  function triggerFinale() {
    finaleTriggered = true;
    state = STATE.FINALE_TALK;
    hideLabel();
    Dialogue.open(MESSAGES.finale.name, MESSAGES.finale.lines, function () {
      // un momento de pura celebración antes de los créditos
      celebrateTimer = 4;
    });
  }

  function talkToSergio(fs) {
    const m = MESSAGES.sergio;
    Audio8.confirm();
    // En la terraza solo se entra con las cinco piezas, así que siempre es el final.
    if (floorIdx === TERRACE_IDX) {
      state = STATE.DIALOGUE;
      Dialogue.open(m.name, m.ready, startParade);
      return;
    }
    const first = !missionGiven;
    openDialogue(m.name, first ? m.mission : m.again, function () {
      missionGiven = true;
      state = STATE.PLAYING;
    });
  }

  function givePiece(id) {
    if (collected.indexOf(id) !== -1) return;
    collected.push(id);
    updateHud();
    const value = VALUE_BY_ID[id];
    if (value) showValueFlash(value.label, flashColorFor(value.color));
    Audio8.unlocked();
    if (complete()) showLabel('LA TERRAZA SE ABRIÓ');
  }

  function talkTo(npc, fs) {
    if (npc.role === 'mission') {
      talkToSergio(fs);
      return;
    }
    const msg = npc.piece ? MESSAGES.devs[npc.id] : MESSAGES.extras[npc.id];
    if (!msg) return;
    Audio8.confirm();
    openDialogue(msg.name, msg.lines, function () {
      if (npc.piece && !npc.talked) {
        npc.talked = true;
        givePiece(npc.piece);
      }
      state = STATE.PLAYING;
    });
  }

  function tryInteract() {
    const fs = current();
    const npc = nearestInteractive(player, fs.npcs);
    if (npc) {
      talkTo(npc, fs);
      return;
    }
    if (!nearElevator(player)) return;
    if (!missionGiven) {
      Audio8.confirm();
      openDialogue(MESSAGES.elevatorLocked.name, MESSAGES.elevatorLocked.lines);
      return;
    }
    openElevator();
  }

  function drawPaddle(x, y, flip) {
    ctx.fillStyle = '#6b4a2a';
    ctx.fillRect(x + (flip ? 3 : 1), y + 4, 2, 2);
    ctx.fillStyle = '#c9454a';
    ctx.fillRect(x + (flip ? 0 : 2), y, 3, 5);
    ctx.fillStyle = '#e06a6a';
    ctx.fillRect(x + (flip ? 1 : 3), y + 1, 1, 2);
  }

  function drawPingScene(fs) {
    const ping = fs.def.ping;
    if (!ping) return;
    const centerY = (ping.row + 1) * TILE;
    const ax = ping.aCol * TILE;
    const bx = ping.bCol * TILE;
    const beat = Math.floor(time * 4) % 2;
    drawPaddle(ax + 14, centerY - 5 + beat, false);
    drawPaddle(bx - 2, centerY - 5 + (1 - beat), true);
    const rally = 0.85;
    const cycle = (time % (rally * 2)) / rally;
    const p = cycle < 1 ? cycle : 2 - cycle;
    const from = (ping.aCol + 1) * TILE + 6;
    const to = (ping.bCol - 1) * TILE + 8;
    const ballX = from + (to - from) * p;
    const ballY = centerY - 2 - Math.sin(p * Math.PI) * 9;
    ctx.fillStyle = '#c9c4b6';
    ctx.fillRect(Math.round(ballX), centerY - 1, 2, 1);
    ctx.fillStyle = '#f4f0e6';
    ctx.fillRect(Math.round(ballX), Math.round(ballY), 2, 2);
  }

  function visible(x, y, cam) {
    return x > cam.x - CULL && x < cam.x + VIEW_W + CULL && y > cam.y - CULL && y < cam.y + VIEW_H + CULL;
  }

  function drawEntities(fs, cam) {
    const drawables = [];

    fs.npcs.forEach(function (n) {
      if (n.hidden || !visible(n.x, n.y, cam)) return;
      drawables.push({
        y: n.y,
        draw: function () {
          if (n.kind === 'robot') drawRobotVac(ctx, n.x, n.y);
          else drawNpc(ctx, n, time);
        },
      });
      if (n.monitor) {
        drawables.push({
          y: (n.row + 1) * TILE,
          draw: function () {
            drawMonitor(ctx, n.col * TILE, (n.row + 1) * TILE, n.monitor);
          },
        });
      }
      if (n.item) {
        drawables.push({
          y: (n.row + 1) * TILE + 1,
          draw: function () {
            drawDeskItem(ctx, n.col * TILE, (n.row + 1) * TILE, n.item);
          },
        });
      }
      if (n.side) {
        drawables.push({
          y: n.y + 1,
          draw: function () {
            drawDeskItem(ctx, n.x + 12, n.y - 2, n.side);
          },
        });
      }
      if (n.notes) {
        drawables.push({
          y: n.y + 2,
          draw: function () {
            drawMusicNotes(ctx, n.x + 14, n.y + 2, time);
          },
        });
      }
    });

    drawables.push({
      y: player.y,
      draw: function () {
        drawPlayer(ctx, player);
      },
    });

    drawables.sort(function (a, b) {
      return a.y - b.y;
    });
    drawables.forEach(function (d) {
      d.draw();
    });
  }

  function drawIndicators(fs, cam, bubbleNpc) {
    if (state !== STATE.PLAYING) return;
    const near = nearestInteractive(player, fs.npcs);
    fs.npcs.forEach(function (n) {
      if (n.role === 'none') return;
      if (n.role === 'required' && n.talked) return;
      if (!visible(n.x, n.y, cam)) return;
      if (bubbleNpc && n.id === bubbleNpc.id) return;
      if (n === near) drawPrompt(ctx, n.x, n.y, time);
      else if (n.piece) drawPieceMark(ctx, n.x, n.y, time, pieceColor(n.piece));
      else if (n.role === 'mission') drawQuestMark(ctx, n.x, n.y, time);
      else drawTalkDots(ctx, n.x, n.y, time);
    });
    if (near || !nearElevator(player)) return;
    drawPrompt(ctx, ELEV.col * TILE + 8, (ELEV.row + 1) * TILE, time);
  }

  function pieceColor(id) {
    const value = VALUE_BY_ID[id];
    return value ? flashColorFor(value.color) : '#e8c25a';
  }

  // Corazones que suben desde cada persona que está celebrando.
  function drawPartyHearts(fs, cam) {
    if (!partyOn) return;
    fs.npcs.forEach(function (n) {
      if (!n.party || n.hidden || parade || !visible(n.x, n.y, cam)) return;
      for (let i = 0; i < 2; i++) {
        const t = ((time * 0.55 + n.col * 0.17 + i * 0.5) % 1);
        const hx = n.x + (i === 0 ? 12 : 0) + Math.round(Math.sin((t + i) * 5) * 2);
        const hy = n.y + 2 - Math.round(t * 24);
        drawTinyHeart(ctx, hx, hy, t < 0.4);
      }
    });
  }

  // Globos cortos de la celebración: mismo globo (y misma letra) que los
  // mensajes opcionales del resto del edificio, repartidos por turnos.
  function updateClouds(fs, cam) {
    const active = [];
    if (partyOn && !helpOpen() && state !== STATE.FINALE_END) {
      fs.npcs.forEach(function (n) {
        if (!n.cloud || n.hidden || parade || !visible(n.x, n.y, cam)) return;
        if ((time + n.cloudPhase) % 12 > 4.2) return;
        if (active.length < cloudEls.length) active.push(n);
      });
    }
    const scale = Engine.getScale();
    cloudEls.forEach(function (node, i) {
      const n = active[i];
      if (!n) {
        node.classList.remove('is-visible');
        return;
      }
      node.textContent = MESSAGES.clouds[n.cloud] || '';
      node.style.left = Math.round((n.x + 8 - cam.x) * scale) + 'px';
      node.style.top = Math.round((n.y - cam.y) * scale) + 'px';
      node.classList.add('is-visible');
    });
  }

  // Flecha en el borde que apunta a quien falta por visitar (o a Marce al final).
  function guideTargets(fs) {
    const out = [];
    fs.npcs.forEach(function (n) {
      if (n.piece && !n.talked) {
        out.push({ x: n.x + 8, y: n.y + 8, color: pieceColor(n.piece) });
        return;
      }
      if (n.role === 'mission' && (!missionGiven || floorIdx === TERRACE_IDX)) {
        out.push({ x: n.x + 8, y: n.y + 8, color: '#e8c25a' });
      }
    });
    return out;
  }

  function drawGuides(fs, cam) {
    if (state !== STATE.PLAYING) return;
    const margin = 14;
    guideTargets(fs).forEach(function (t) {
      const sx = t.x - cam.x;
      const sy = t.y - cam.y;
      if (sx > margin && sx < VIEW_W - margin && sy > margin && sy < VIEW_H - margin) return;
      const cx = Math.max(margin, Math.min(VIEW_W - margin, sx));
      const cy = Math.max(margin, Math.min(VIEW_H - margin, sy));
      const dx = sx - cx;
      const dy = sy - cy;
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      drawEdgeArrow(ctx, cx, cy, dir, t.color, time);
    });
  }

  function render() {
    const fs = current();
    const cam = cameraFor(player, fs.def, VIEW_W, VIEW_H);
    ctx.fillStyle = COLORS.void;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.save();
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));
    ctx.drawImage(backgroundFor(fs), 0, 0);
    drawPingScene(fs);
    drawEntities(fs, cam);
    drawIndicators(fs, cam, updateBubble(fs, cam));
    drawPartyHearts(fs, cam);
    ctx.restore();
    updateClouds(fs, cam);
    drawGuides(fs, cam);
    if (partyOn) drawConfetti();
    if (finaleLogo) drawFinaleLogo();
  }

  function handleInput() {
    if (helpOpen()) return;
    if (state === STATE.TITLE) {
      if (Engine.wasPressed('action')) {
        Engine.consume('action');
        Audio8.confirm();
        showHowto();
      }
      return;
    }

    if (state === STATE.HOWTO) {
      if (Engine.wasPressed('action')) {
        Engine.consume('action');
        Audio8.confirm();
        startGame();
      }
      return;
    }

    if (Dialogue.isOpen()) {
      if (Engine.wasPressed('action')) {
        Engine.consume('action');
        Dialogue.advance();
      }
      return;
    }

    if (state === STATE.ELEVATOR) {
      if (Engine.wasPressed('up')) {
        Engine.consume('up');
        moveElevatorSelection(1);
      }
      if (Engine.wasPressed('down')) {
        Engine.consume('down');
        moveElevatorSelection(-1);
      }
      if (Engine.wasPressed('left') || Engine.wasPressed('right')) {
        Engine.consume('left');
        Engine.consume('right');
        closeElevator();
      }
      if (Engine.wasPressed('action')) {
        Engine.consume('action');
        confirmElevator();
      }
      return;
    }

    if (state === STATE.PLAYING && Engine.wasPressed('action')) {
      Engine.consume('action');
      tryInteract();
    }
  }

  function frame(dt) {
    time += dt;
    handleInput();
    Dialogue.update(dt);

    if (labelTimer > 0) {
      labelTimer -= dt;
      if (labelTimer <= 0) hideLabel();
    }

    if (flashTimer > 0) {
      flashTimer -= dt;
      if (flashTimer <= 0) el['value-flash'].classList.remove('is-visible');
    }

    if (state === STATE.PLAYING && !helpOpen()) {
      const fs = current();
      movePlayer(
        player,
        dt,
        {
          up: Engine.isHeld('up'),
          down: Engine.isHeld('down'),
          left: Engine.isHeld('left'),
          right: Engine.isHeld('right'),
        },
        fs.def,
        fs.npcs
      );
    }

    if (parade) updateParade(dt);
    if (finaleLogo) updateFinaleLogo(dt);
    if (celebrateTimer > 0) {
      celebrateTimer -= dt;
      if (celebrateTimer <= 0) {
        state = STATE.FINALE_END;
        showEndScreen();
      }
    }
    moveRobot(current());
    moveZorro(current(), dt);
    if (partyOn) updateConfetti(dt);
    render();
  }

  function init() {
    cacheElements();
    Dialogue.init();
    const canvas = document.getElementById('game');
    ctx = Engine.init(canvas, VIEW_W, VIEW_H);
    Engine.onFirstInput(function () {
      Audio8.unlock();
    });
    player = createPlayer(BUILDING[0].spawn);
    backgroundFor(current());
    buildHudSlots();
    for (let i = 0; i < 8; i++) {
      const node = document.createElement('div');
      node.className = 'cloud';
      el.clouds.appendChild(node);
      cloudEls.push(node);
    }
    updateHud();

    el.help.addEventListener('click', function () {
      el['help-modal'].classList.toggle('is-visible');
      hideBubble();
    });

    el['help-close'].addEventListener('click', function () {
      el['help-modal'].classList.remove('is-visible');
    });

    el.mute.addEventListener('click', function () {
      const muted = Audio8.toggleMute();
      el.mute.textContent = muted ? '🔇' : '🔊';
      el.mute.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar');
    });

    document.getElementById('replay').addEventListener('click', function () {
      window.location.reload();
    });

    el['title-screen'].addEventListener('click', function () {
      if (state !== STATE.TITLE) return;
      Audio8.unlock();
      Audio8.confirm();
      showHowto();
    });

    el['howto-btn'].addEventListener('click', function () {
      if (state !== STATE.HOWTO) return;
      Audio8.confirm();
      startGame();
    });

    document.addEventListener('keydown', function (e) {
      if (e.code === 'Escape' && state === STATE.HOWTO) startGame();
    });

    Engine.start(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
