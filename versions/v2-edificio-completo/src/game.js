(function () {
  const VIEW_W = 384;
  const VIEW_H = 224;
  const CULL = 24;

  const STATE = {
    TITLE: 'title',
    INTRO: 'intro',
    PLAYING: 'playing',
    DIALOGUE: 'dialogue',
    ELEVATOR: 'elevator',
    FINALE_TALK: 'finaleTalk',
    FINALE_END: 'finaleEnd',
  };

  const IDS = [
    'title-screen', 'end-screen', 'hud', 'hud-count', 'mute', 'end-credits',
    'end-dedication', 'elevator', 'elev-list', 'floor-label',
    'bubble', 'bubble-name', 'bubble-text', 'help', 'help-modal', 'help-close', 'stage',
  ];

  let ctx = null;
  let state = STATE.TITLE;
  let player = null;
  let time = 0;
  let hearts = 0;
  let missionGiven = false;
  let finaleTriggered = false;
  let floorIdx = 0;
  let elevSel = 0;
  let labelTimer = 0;
  let confetti = [];
  let crowd = [];
  let bubbleFor = null;
  let bubbleW = 0;
  let bubbleH = 0;
  const floors = [];
  const el = {};

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

  function requiredOf(i) {
    const list = floorState(i).npcs.filter(function (n) {
      return n.role === 'required';
    });
    return list.length ? list[0] : null;
  }

  function updateHud() {
    el['hud-count'].textContent = hearts + '/' + REQUIRED_TOTAL;
    el.hud.classList.toggle('is-complete', hearts >= REQUIRED_TOTAL);
  }

  function showLabel(text) {
    el['floor-label'].textContent = text;
    el['floor-label'].classList.add('is-visible');
    labelTimer = 2.2;
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

  function startGame() {
    el['title-screen'].classList.remove('is-visible');
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
      const req = requiredOf(i);
      if (req) mark.textContent = req.talked ? '❤' : '·';
      else mark.textContent = i === BUILDING.length - 1 ? '★' : '';

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

  function confirmElevator() {
    const target = elevSel;
    closeElevator();
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
    crowd = FINALE_CROWD.map(function (c) {
      return { style: c.style, x: c.col * TILE, y: c.row * TILE };
    });
    const fs = current();
    fs.npcs.forEach(function (n) {
      if (n.id !== 'marce') return;
      n.x = MARCE_FINALE_SPOT.col * TILE;
      n.y = MARCE_FINALE_SPOT.row * TILE;
      n.role = 'none';
    });
    player.x = 16 * TILE;
    player.y = 13 * TILE;
    player.dir = 'up';
    player.moving = false;
    hideLabel();
    spawnConfetti();
    Audio8.fanfare();
    Dialogue.open(MESSAGES.finale.name, MESSAGES.finale.lines, function () {
      state = STATE.FINALE_END;
      showEndScreen();
    });
  }

  function talkToMarce(fs) {
    const m = MESSAGES.marce;
    Audio8.confirm();
    if (fs.def.n === 8) {
      if (hearts >= REQUIRED_TOTAL) {
        state = STATE.DIALOGUE;
        Dialogue.open(m.name, m.ready, triggerFinale);
        return;
      }
      const lines = m.waiting.concat([
        'Le faltan ' + (REQUIRED_TOTAL - hearts) + ' de ' + REQUIRED_TOTAL + '. Súbase otra vez y no me deje ningún piso por fuera.',
      ]);
      openDialogue(m.name, lines);
      return;
    }
    const first = !missionGiven;
    openDialogue(m.name, first ? m.mission : m.again, function () {
      missionGiven = true;
      state = STATE.PLAYING;
    });
  }

  function talkTo(npc, fs) {
    if (npc.role === 'mission') {
      talkToMarce(fs);
      return;
    }
    const msg = npc.role === 'required' ? MESSAGES.floors[fs.def.n] : MESSAGES.extras[npc.id];
    if (!msg) return;
    Audio8.confirm();
    openDialogue(msg.name, msg.lines, function () {
      if (npc.role === 'required' && !npc.talked) {
        npc.talked = true;
        hearts += 1;
        updateHud();
        Audio8.unlocked();
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
      if (!visible(n.x, n.y, cam)) return;
      drawables.push({
        y: n.y,
        draw: function () {
          drawNpc(ctx, n, time);
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
    });

    crowd.forEach(function (c) {
      if (!visible(c.x, c.y, cam)) return;
      drawables.push({
        y: c.y,
        draw: function () {
          drawSprite(ctx, c.style, 0, c.x, c.y, false);
        },
      });
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
      else if (n.role === 'required') drawHeart(ctx, n.x, n.y, time);
      else if (n.role === 'mission') drawQuestMark(ctx, n.x, n.y, time);
      else drawTalkDots(ctx, n.x, n.y, time);
    });
    if (near || !nearElevator(player)) return;
    drawPrompt(ctx, ELEV.col * TILE + 8, (ELEV.row + 1) * TILE, time);
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
    ctx.restore();
    if (finaleTriggered) drawConfetti();
  }

  function handleInput() {
    if (helpOpen()) return;
    if (state === STATE.TITLE) {
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

    if (finaleTriggered) updateConfetti(dt);
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
      startGame();
    });

    Engine.start(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
