const Engine = (function () {
  const KEY_MAP = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    KeyW: 'up',
    KeyS: 'down',
    KeyA: 'left',
    KeyD: 'right',
    KeyE: 'action',
    Space: 'action',
    Enter: 'action',
    NumpadEnter: 'action',
  };

  const held = {};
  const justPressed = {};
  const pressedKeys = new Set();
  let canvas = null;
  let ctx = null;
  let logicalW = 0;
  let logicalH = 0;
  let scale = 1;
  let frameCb = null;
  let lastTime = 0;
  let firstInputCb = null;
  let gotFirstInput = false;

  function fireFirstInput() {
    if (gotFirstInput) return;
    gotFirstInput = true;
    if (firstInputCb) firstInputCb();
  }

  function refreshHeld(action) {
    let any = false;
    pressedKeys.forEach(function (code) {
      if (KEY_MAP[code] === action) any = true;
    });
    held[action] = any;
  }

  function pressKey(code) {
    const action = KEY_MAP[code];
    if (!action) return;
    if (!pressedKeys.has(code)) {
      pressedKeys.add(code);
      justPressed[action] = true;
    }
    held[action] = true;
    fireFirstInput();
  }

  function releaseKey(code) {
    const action = KEY_MAP[code];
    if (!action) return;
    pressedKeys.delete(code);
    refreshHeld(action);
  }

  function releaseAll() {
    pressedKeys.clear();
    for (const k in held) held[k] = false;
  }

  function controlsHeight() {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    return fine ? 60 : 120;
  }

  function resize() {
    const maxW = window.innerWidth - 24;
    const maxH = window.innerHeight - controlsHeight();
    const fit = Math.min(maxW / logicalW, maxH / logicalH);
    scale = Math.min(4, Math.max(0.55, Math.floor(fit * 100) / 100));
    const w = Math.floor(logicalW * scale);
    const h = Math.floor(logicalH * scale);
    document.documentElement.style.setProperty('--game-w', w + 'px');
    document.documentElement.style.setProperty('--game-h', h + 'px');
  }

  function bindTouchControls() {
    const buttons = document.querySelectorAll('[data-action]');
    buttons.forEach(function (btn, i) {
      const action = btn.dataset.action;
      const code = 'Touch' + i;
      KEY_MAP[code] = action;
      const press = function (e) {
        e.preventDefault();
        pressKey(code);
        btn.classList.add('is-pressed');
      };
      const release = function (e) {
        e.preventDefault();
        releaseKey(code);
        btn.classList.remove('is-pressed');
      };
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    });
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0);
    lastTime = now;
    if (frameCb) frameCb(dt);
    for (const k in justPressed) justPressed[k] = false;
    requestAnimationFrame(loop);
  }

  return {
    init: function (canvasEl, w, h) {
      canvas = canvasEl;
      logicalW = w;
      logicalH = h;
      canvas.width = w;
      canvas.height = h;
      ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      window.addEventListener('keydown', function (e) {
        if (!KEY_MAP[e.code]) return;
        e.preventDefault();
        pressKey(e.code);
      });
      window.addEventListener('keyup', function (e) {
        releaseKey(e.code);
      });
      window.addEventListener('blur', releaseAll);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) releaseAll();
      });
      window.addEventListener('resize', resize);
      bindTouchControls();
      resize();
      return ctx;
    },

    start: function (cb) {
      frameCb = cb;
      lastTime = performance.now();
      requestAnimationFrame(loop);
    },

    onFirstInput: function (cb) {
      firstInputCb = cb;
    },

    isHeld: function (action) {
      return !!held[action];
    },

    wasPressed: function (action) {
      return !!justPressed[action];
    },

    consume: function (action) {
      justPressed[action] = false;
    },

    getScale: function () {
      return scale;
    },
  };
})();
