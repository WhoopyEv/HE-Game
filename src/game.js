(function () {
  const STATE = {
    TITLE: 'title',
    HOWTO: 'howto',
    PLAY: 'play',
    PAUSE: 'pause',
    FINALE: 'finale',
    END: 'end',
  };

  const IDS = [
    'title-screen', 'howto-screen', 'howto-intro', 'howto-controls', 'pause-screen',
    'end-screen', 'end-credits', 'end-dedication', 'hud', 'hud-count', 'zone-label',
    'value-flash', 'mute', 'replay', 'start-btn', 'howto-btn', 'resume-btn', 'restart-btn',
  ];

  // Dónde vive cada color dentro del logo (coordenadas del logo nativo de 32x22).
  const LOGO_SLOTS = {
    respaldo: { x: 16, y: 11 },
    oportunidad: { x: 26, y: 3 },
    aprendizaje: { x: 15, y: 9 },
    confianza: { x: 4, y: 13 },
    equipo: { x: 16, y: 18 },
  };
  const LOGO_SCALE = 3;
  const LOGO_X = Math.round((VIEW_W - 32 * LOGO_SCALE) / 2);
  const LOGO_Y = 16;

  let ctx = null;
  let state = STATE.TITLE;
  let player = null;
  let entities = [];
  let time = 0;
  let camX = 0;
  let collected = [];
  let sceneId = null;
  let labelTimer = 0;
  let flashTimer = 0;
  let finale = null;
  let logoCanvas = null;
  const el = {};

  function cacheElements() {
    IDS.forEach(function (id) {
      el[id] = document.getElementById(id);
    });
  }

  function show(id) {
    el[id].classList.add('is-visible');
  }

  function hide(id) {
    el[id].classList.remove('is-visible');
  }

  function updateHud() {
    el['hud-count'].textContent = collected.length + '/' + VALUES.length;
    el.hud.classList.toggle('is-complete', collected.length >= VALUES.length);
  }

  function showZoneLabel(text) {
    el['zone-label'].textContent = text;
    el['zone-label'].classList.add('is-visible');
    labelTimer = 2;
  }

  function showValueFlash(label) {
    el['value-flash'].textContent = '¡' + label + '!';
    el['value-flash'].classList.add('is-visible');
    flashTimer = 1.3;
  }

  function fillHowto() {
    el['howto-intro'].textContent = MESSAGES.howto.intro.replace('{n}', VALUES.length);
    el['howto-controls'].innerHTML = '';
    MESSAGES.howto.controls.forEach(function (row) {
      const li = document.createElement('li');
      const k = document.createElement('b');
      k.textContent = row[0];
      const d = document.createElement('span');
      d.textContent = row[1];
      li.appendChild(k);
      li.appendChild(d);
      el['howto-controls'].appendChild(li);
    });
  }

  function resetRun() {
    const first = LEVEL.scenes[0];
    player = createPlayer((first.start + 2) * TILE, (GROUND_ROW - 2) * TILE);
    entities = createEntities();
    collected = [];
    sceneId = null;
    finale = null;
    camX = 0;
    updateHud();
  }

  function startRun() {
    hide('title-screen');
    hide('howto-screen');
    show('hud');
    resetRun();
    Audio8.startMusic();
    state = STATE.PLAY;
  }

  function respawn() {
    const scene = sceneAtCol(Math.floor(player.x / TILE));
    player.x = (scene.start + 1) * TILE;
    player.y = (GROUND_ROW - 2) * TILE;
    player.vx = 0;
    player.vy = 0;
    player.hurtFlash = 0.7;
    Audio8.hurt();
  }

  function onPiece(valueId) {
    if (collected.indexOf(valueId) !== -1) return;
    collected.push(valueId);
    updateHud();
    const value = VALUE_BY_ID[valueId];
    if (value) showValueFlash(value.label);
    Audio8.pickup();
  }

  function startFinale() {
    if (finale) return;
    state = STATE.FINALE;
    hide('hud');
    el['zone-label'].classList.remove('is-visible');
    Audio8.fanfare();

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

    finale = {
      t: 0,
      phase: 'gather',
      flipped: false,
      pieces: mine.map(function (id, i) {
        const slot = LOGO_SLOTS[id] || { x: 16, y: 11 };
        return {
          id: id,
          color: (VALUE_BY_ID[id] || {}).color || '#f4f0e6',
          fromX: VIEW_W / 2 - (n * 22) / 2 + i * 22,
          fromY: 186,
          toX: LOGO_X + slot.x * LOGO_SCALE - 8,
          toY: LOGO_Y + slot.y * LOGO_SCALE - 8,
          delay: i * 0.2,
        };
      }),
      have: collected.slice(),
    };
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

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateFinale(dt) {
    finale.t += dt;
    const f = finale;

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

    if (f.phase === 'devs') {
      if (f.t >= 1.1) {
        f.phase = 'message';
        f.t = 0;
        const msg = collected.length >= VALUES.length ? MESSAGES.finale : MESSAGES.incomplete;
        Dialogue.open(msg.name, msg.lines, function () {
          state = STATE.END;
          el['end-credits'].textContent = MESSAGES.credits.join('  ·  ');
          el['end-dedication'].textContent = MESSAGES.dedication;
          show('end-screen');
        });
      }
    }
  }

  function drawFinale() {
    const f = finale;
    ctx.fillStyle = 'rgba(13, 10, 18, 0.82)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    if (f.phase === 'gather') {
      f.pieces.forEach(function (p) {
        const t = Math.max(0, Math.min(1, (f.t - p.delay) / 0.75));
        const e = easeOut(t);
        drawPieceIcon(ctx, p.fromX + (p.toX - p.fromX) * e, p.fromY + (p.toY - p.fromY) * e, p.color, 0);
      });
      return;
    }

    const cx = LOGO_X + (32 * LOGO_SCALE) / 2;
    let sx = 1;
    if (f.phase === 'flip') {
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
        drawPieceIcon(ctx, p.toX, p.toY, p.color, 0);
      });
    }
    ctx.restore();

    if (f.phase === 'devs' || f.phase === 'message') {
      const names = ['daniel', 'diana', 'nicolas', 'guillermo', 'felipe'];
      const baseY = LOGO_Y + 22 * LOGO_SCALE + 6;
      names.forEach(function (name, i) {
        const appear = f.phase === 'message' ? 1 : Math.max(0, Math.min(1, (f.t - i * 0.12) / 0.25));
        if (appear <= 0) return;
        const x = VIEW_W / 2 - names.length * 11 + i * 22;
        const y = baseY - Math.round((1 - appear) * 8);
        drawSprite(ctx, name, 0, x, y, false);
      });
    }
  }

  function render() {
    ctx.fillStyle = '#15101d';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    ctx.save();
    ctx.translate(-Math.round(camX), 0);
    drawLevel(ctx, camX);
    drawEntities(ctx, entities, time);
    drawPlayer(ctx, player, time);
    ctx.restore();

    if (state === STATE.FINALE || state === STATE.END) drawFinale();
  }

  function handleInput() {
    const confirm = Engine.wasPressed('action') || Engine.wasPressed('jump');

    if (state === STATE.TITLE) {
      if (confirm) {
        Engine.consume('action');
        Engine.consume('jump');
        Audio8.confirm();
        hide('title-screen');
        show('howto-screen');
        state = STATE.HOWTO;
      }
      return;
    }

    if (state === STATE.HOWTO) {
      if (confirm || Engine.wasPressed('pause')) {
        Engine.consume('action');
        Engine.consume('jump');
        Engine.consume('pause');
        Audio8.confirm();
        startRun();
      }
      return;
    }

    if (state === STATE.PLAY && Engine.wasPressed('pause')) {
      Engine.consume('pause');
      state = STATE.PAUSE;
      show('pause-screen');
      return;
    }

    if (state === STATE.PAUSE && (Engine.wasPressed('pause') || confirm)) {
      Engine.consume('pause');
      Engine.consume('action');
      Engine.consume('jump');
      hide('pause-screen');
      state = STATE.PLAY;
      return;
    }

    if (Dialogue.isOpen() && confirm) {
      Engine.consume('action');
      Engine.consume('jump');
      Dialogue.advance();
    }
  }

  function frame(dt) {
    time += dt;
    handleInput();
    Dialogue.update(dt);

    if (labelTimer > 0) {
      labelTimer -= dt;
      if (labelTimer <= 0) el['zone-label'].classList.remove('is-visible');
    }
    if (flashTimer > 0) {
      flashTimer -= dt;
      if (flashTimer <= 0) el['value-flash'].classList.remove('is-visible');
    }

    if (state === STATE.PLAY) {
      const jumpPressed = Engine.wasPressed('jump');
      if (jumpPressed) Engine.consume('jump');
      movePlayer(
        player,
        dt,
        {
          left: Engine.isHeld('left'),
          right: Engine.isHeld('right'),
          jumpPressed: jumpPressed,
          jumpHeld: Engine.isHeld('jump'),
        },
        activeSolids(entities)
      );
      if (player.justJumped) {
        player.justJumped = false;
        Audio8.jump();
      }

      updateEntities(entities, dt, player, {
        onHit: respawn,
        onPiece: onPiece,
        onGoal: startFinale,
      });

      const scene = sceneAtCol(Math.floor((player.x + 8) / TILE));
      if (scene.id !== sceneId) {
        sceneId = scene.id;
        showZoneLabel(scene.label);
      }

      camX = Math.max(0, Math.min(LEVEL_W - VIEW_W, player.x + 8 - VIEW_W / 2));
    }

    if (state === STATE.FINALE) updateFinale(dt);

    render();
  }

  function init() {
    cacheElements();
    Dialogue.init();
    fillHowto();
    const canvas = document.getElementById('game');
    ctx = Engine.init(canvas, VIEW_W, VIEW_H);
    Engine.onFirstInput(function () {
      Audio8.unlock();
    });
    resetRun();

    el.mute.addEventListener('click', function () {
      const muted = Audio8.toggleMute();
      el.mute.textContent = muted ? '🔇' : '🔊';
    });
    el['start-btn'].addEventListener('click', function () {
      if (state !== STATE.TITLE) return;
      Audio8.unlock();
      Audio8.confirm();
      hide('title-screen');
      show('howto-screen');
      state = STATE.HOWTO;
    });
    el['howto-btn'].addEventListener('click', function () {
      if (state !== STATE.HOWTO) return;
      Audio8.confirm();
      startRun();
    });
    el['resume-btn'].addEventListener('click', function () {
      hide('pause-screen');
      state = STATE.PLAY;
    });
    el['restart-btn'].addEventListener('click', function () {
      hide('pause-screen');
      resetRun();
      state = STATE.PLAY;
    });
    el.replay.addEventListener('click', function () {
      window.location.reload();
    });

    Engine.start(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
