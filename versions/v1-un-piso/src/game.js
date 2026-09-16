(function () {
  const LOGICAL_W = MAP_W * TILE;
  const LOGICAL_H = MAP_H * TILE;

  const STATE = {
    TITLE: 'title',
    INTRO: 'intro',
    PLAYING: 'playing',
    DIALOGUE: 'dialogue',
    FINALE_TALK: 'finaleTalk',
    FINALE_END: 'finaleEnd',
  };

  let ctx = null;
  let background = null;
  let state = STATE.TITLE;
  let player = null;
  let devs = null;
  let doorOpen = false;
  let time = 0;
  let talkedCount = 0;
  let confetti = [];
  let pendingDev = null;
  let finaleTriggered = false;

  const el = {};

  function cacheElements() {
    ['title-screen', 'end-screen', 'hud', 'hud-count', 'mute', 'end-credits', 'end-dedication'].forEach(
      function (id) {
        el[id] = document.getElementById(id);
      }
    );
  }

  function buildBackground() {
    background = document.createElement('canvas');
    background.width = LOGICAL_W;
    background.height = LOGICAL_H;
    const g = background.getContext('2d');
    g.imageSmoothingEnabled = false;
    drawBackground(g);
  }

  function updateHud() {
    el['hud-count'].textContent = talkedCount + '/5';
    el.hud.classList.toggle('is-complete', talkedCount >= 5);
  }

  function startGame() {
    el['title-screen'].classList.remove('is-visible');
    el.hud.classList.add('is-visible');
    Audio8.startMusic();
    state = STATE.INTRO;
    Dialogue.open(MESSAGES.intro.name, MESSAGES.intro.lines, function () {
      state = STATE.PLAYING;
    });
  }

  function moveDevsToMeeting() {
    FINALE_SPOTS.forEach(function (spot) {
      const dev = devs.find(function (d) {
        return d.key === spot.key;
      });
      dev.x = spot.col * TILE;
      dev.y = spot.row * TILE;
      dev.standing = true;
    });
  }

  function onDevTalked(dev) {
    dev.talked = true;
    talkedCount += 1;
    updateHud();
    if (talkedCount >= 5) {
      doorOpen = true;
      moveDevsToMeeting();
      Audio8.unlocked();
      state = STATE.DIALOGUE;
      Dialogue.open(MESSAGES.unlock.name, MESSAGES.unlock.lines, function () {
        state = STATE.PLAYING;
      });
      return;
    }
    state = STATE.PLAYING;
  }

  function tryInteract() {
    const dev = nearestDev(player, devs);
    if (!dev) return;
    pendingDev = dev;
    state = STATE.DIALOGUE;
    Audio8.confirm();
    const msg = MESSAGES.devs[dev.key];
    Dialogue.open(msg.name, msg.lines, function () {
      onDevTalked(pendingDev);
      pendingDev = null;
    });
  }

  function spawnConfetti() {
    const colors = ['#e0453e', '#e8c25a', '#4a8fd4', '#4fa06a', '#b061c0', '#f4f0e6'];
    confetti = [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < 90; i++) {
      confetti.push({
        x: Math.random() * LOGICAL_W,
        y: -Math.random() * LOGICAL_H,
        vy: 18 + Math.random() * 34,
        vx: (Math.random() - 0.5) * 16,
        size: 1 + Math.floor(Math.random() * 2),
        color: colors[Math.floor(Math.random() * colors.length)],
        sway: Math.random() * Math.PI * 2,
      });
    }
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
    spawnConfetti();
    Audio8.fanfare();
    Dialogue.open(MESSAGES.finale.name, MESSAGES.finale.lines, function () {
      state = STATE.FINALE_END;
      showEndScreen();
    });
  }

  function checkFinaleTrigger() {
    if (finaleTriggered || talkedCount < 5) return;
    const inMeetingRoom = player.x > 14 * TILE && player.y > 5 * TILE;
    if (inMeetingRoom) triggerFinale();
  }

  function updateConfetti(dt) {
    confetti.forEach(function (p) {
      p.sway += dt * 3;
      p.y += p.vy * dt;
      p.x += (p.vx + Math.sin(p.sway) * 10) * dt;
      if (p.y > LOGICAL_H) {
        p.y = -4;
        p.x = Math.random() * LOGICAL_W;
      }
    });
  }

  function drawConfetti() {
    confetti.forEach(function (p) {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size + 1);
    });
  }

  const PING = {
    aCol: 16,
    bCol: 21,
    row: 3,
    lift: 8,
    rallySeconds: 0.85,
  };

  function drawPaddle(x, y, flip) {
    ctx.fillStyle = '#6b4a2a';
    ctx.fillRect(x + (flip ? 3 : 1), y + 4, 2, 2);
    ctx.fillStyle = '#c9454a';
    ctx.fillRect(x + (flip ? 0 : 2), y, 3, 5);
    ctx.fillStyle = '#e06a6a';
    ctx.fillRect(x + (flip ? 1 : 3), y + 1, 1, 2);
  }

  function drawPingPongScene() {
    const baseY = PING.row * TILE + PING.lift;
    const beat = Math.floor(time * 4) % 2;
    const ax = PING.aCol * TILE;
    const bx = PING.bCol * TILE;
    const ay = baseY + beat;
    const by = baseY + (1 - beat);

    drawSprite(ctx, 'pingpongA', 0, ax, ay, false);
    drawSprite(ctx, 'pingpongB', 0, bx, by, true);
    drawPaddle(ax + 13, ay + 7, false);
    drawPaddle(bx, by + 7, true);

    const cycle = (time % (PING.rallySeconds * 2)) / PING.rallySeconds;
    const p = cycle < 1 ? cycle : 2 - cycle;
    const from = (PING.aCol + 1) * TILE + 8;
    const to = (PING.bCol - 1) * TILE + 6;
    const ballX = from + (to - from) * p;
    const ballY = (PING.row + 1) * TILE - 2 - Math.sin(p * Math.PI) * 7;
    ctx.fillStyle = '#f4f0e6';
    ctx.fillRect(Math.round(ballX), Math.round(ballY), 2, 2);
  }

  function drawEntities() {
    const drawables = [];

    devs.forEach(function (d) {
      drawables.push({
        y: d.y,
        draw: function () {
          if (d.standing) drawSprite(ctx, d.key + 'Stand', 0, d.x, d.y, false);
          else drawDevSitting(ctx, d, time);
        },
      });
      if (d.standing) return;
      drawables.push({
        y: (d.row + 1) * TILE,
        draw: function () {
          drawMonitor(ctx, d.col * TILE, (d.row + 1) * TILE, d.monitor);
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

  function drawIndicators() {
    if (state !== STATE.PLAYING) return;
    const near = nearestDev(player, devs);
    devs.forEach(function (d) {
      if (d.talked || d.standing) return;
      if (d === near) drawPrompt(ctx, d.x, d.y, time);
      else drawHeart(ctx, d.x, d.y, time);
    });
  }

  function render() {
    ctx.drawImage(background, 0, 0);
    drawPingPongScene();
    drawDoor(ctx, DOOR.col * TILE, DOOR.row * TILE, doorOpen);
    drawEntities();
    drawIndicators();
    if (finaleTriggered) drawConfetti();
  }

  function handleInput() {
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

    if (state === STATE.PLAYING && Engine.wasPressed('action')) {
      Engine.consume('action');
      tryInteract();
    }
  }

  function frame(dt) {
    time += dt;
    handleInput();

    Dialogue.update(dt);

    if (state === STATE.PLAYING) {
      movePlayer(
        player,
        dt,
        {
          up: Engine.isHeld('up'),
          down: Engine.isHeld('down'),
          left: Engine.isHeld('left'),
          right: Engine.isHeld('right'),
        },
        devs,
        doorOpen
      );
      checkFinaleTrigger();
    }

    if (finaleTriggered) updateConfetti(dt);
    render();
  }

  function init() {
    cacheElements();
    Dialogue.init();
    const canvas = document.getElementById('game');
    ctx = Engine.init(canvas, LOGICAL_W, LOGICAL_H);
    Engine.onFirstInput(function () {
      Audio8.unlock();
    });
    buildBackground();
    player = createPlayer();
    devs = createDevs();
    updateHud();

    el.mute.addEventListener('click', function () {
      const muted = Audio8.toggleMute();
      el.mute.textContent = muted ? '🔇' : '🔊';
      el.mute.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar');
    });

    document.getElementById('replay').addEventListener('click', function () {
      window.location.reload();
    });

    el['title-screen'].addEventListener('click', function () {
      if (state === STATE.TITLE) {
        Audio8.unlock();
        Audio8.confirm();
        startGame();
      }
    });

    Engine.start(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
