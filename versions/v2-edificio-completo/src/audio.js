const Audio8 = (function () {
  const BPM = 96;
  const STEP = 60 / BPM / 2;
  const LOOKAHEAD = 0.3;

  const N = {
    F2: 87.31,
    G2: 98.0,
    A2: 110.0,
    C3: 130.81,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88,
    C5: 523.25,
  };

  const MELODY = [
    N.E4, N.G4, N.C5, null, N.C5, N.B4, N.G4, null,
    N.D4, N.G4, N.B4, null, N.B4, N.A4, N.G4, null,
    N.C4, N.E4, N.A4, null, N.A4, N.G4, N.E4, null,
    N.C4, N.F4, N.A4, null, N.G4, N.F4, N.E4, null,
  ];

  const BASS = [
    N.C3, null, null, null, N.C3, null, null, null,
    N.G2, null, null, null, N.G2, null, null, null,
    N.A2, null, null, null, N.A2, null, null, null,
    N.F2, null, null, null, N.F2, null, null, null,
  ];

  let ctx = null;
  let master = null;
  let sfxBus = null;
  let musicBus = null;
  let muted = false;
  let ready = false;

  let timer = null;
  let step = 0;
  let nextTime = 0;
  let spartanCall = null;

  function ensure() {
    if (ready) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.2;
    master.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 1;
    sfxBus.connect(master);
    musicBus = ctx.createGain();
    musicBus.gain.value = 0.34;
    musicBus.connect(master);
    ready = true;
    return true;
  }

  function voice(freq, at, duration, type, volume, dest) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(at);
    osc.stop(at + duration + 0.03);
  }

  function tone(freq, delay, duration, type, volume) {
    if (!ready) return;
    voice(freq, ctx.currentTime + delay, duration, type || 'square', volume || 0.4, sfxBus);
  }

  function scheduleStep(index, at) {
    const lead = MELODY[index];
    if (lead) voice(lead, at, STEP * 1.7, 'triangle', 0.5, musicBus);
    const low = BASS[index];
    if (low) voice(low, at, STEP * 3.2, 'square', 0.16, musicBus);
  }

  function tick() {
    if (!ready) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      scheduleStep(step, nextTime);
      nextTime += STEP;
      step = (step + 1) % MELODY.length;
    }
  }

  return {
    unlock: function () {
      if (!ensure()) return;
      if (ctx.state === 'suspended') ctx.resume();
    },

    startMusic: function () {
      if (!ensure() || timer) return;
      step = 0;
      nextTime = ctx.currentTime + 0.15;
      tick();
      timer = setInterval(tick, 60);
    },

    stopMusic: function () {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    },

    confirm: function () {
      tone(523, 0, 0.08, 'square', 0.3);
      tone(784, 0.06, 0.11, 'square', 0.26);
    },

    unlocked: function () {
      [523, 659, 784, 1047].forEach(function (f, i) {
        tone(f, i * 0.09, 0.16, 'square', 0.3);
      });
    },

    ding: function () {
      tone(1047, 0, 0.2, 'sine', 0.34);
      tone(784, 0.15, 0.3, 'sine', 0.3);
    },

    fanfare: function () {
      const notes = [523, 659, 784, 1047, 784, 1047, 1319];
      notes.forEach(function (f, i) {
        tone(f, i * 0.13, 0.3, 'square', 0.3);
        tone(f / 2, i * 0.13, 0.3, 'triangle', 0.2);
      });
    },

    // El grito de "¿cuál es su profesión?" antes de que salga la gente en la
    // terraza. onEnded se llama al terminar el clip, o de una, si no se pudo
    // reproducir (bloqueo del navegador, archivo faltante, etc).
    playSpartanCall: function (onEnded) {
      if (!spartanCall) {
        spartanCall = new Audio('assets/300-espartanos.mp3');
        spartanCall.preload = 'auto';
        spartanCall.volume = 0.6;
      }
      spartanCall.muted = muted;
      spartanCall.currentTime = 0;
      spartanCall.onended = onEnded || null;
      const played = spartanCall.play();
      if (played && played.catch) played.catch(function () { if (onEnded) onEnded(); });
    },

    toggleMute: function () {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.2;
      if (spartanCall) spartanCall.muted = muted;
      return muted;
    },

    isMuted: function () {
      return muted;
    },
  };
})();
