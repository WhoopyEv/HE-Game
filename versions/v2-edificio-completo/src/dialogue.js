const Dialogue = (function () {
  const CHARS_PER_SEC = 42;

  let box = null;
  let nameEl = null;
  let textEl = null;
  let nextEl = null;

  let lines = [];
  let index = 0;
  let revealed = 0;
  let open = false;
  let onDone = null;
  let speakerName = '';

  function currentLine() {
    return lines[index] || '';
  }

  function render() {
    const line = currentLine();
    textEl.textContent = line.slice(0, Math.floor(revealed));
    const done = revealed >= line.length;
    nextEl.classList.toggle('is-ready', done);
    nextEl.textContent = index >= lines.length - 1 ? '✦ ENTER' : '▼ ENTER';
  }

  return {
    init: function () {
      box = document.getElementById('dialogue');
      nameEl = document.getElementById('dialogue-name');
      textEl = document.getElementById('dialogue-text');
      nextEl = document.getElementById('dialogue-next');
    },

    open: function (name, newLines, done) {
      speakerName = name || '';
      lines = newLines.slice();
      index = 0;
      revealed = 0;
      open = true;
      onDone = done || null;
      nameEl.textContent = speakerName;
      nameEl.style.display = speakerName ? '' : 'none';
      box.classList.add('is-open');
      render();
    },

    isOpen: function () {
      return open;
    },

    isLineComplete: function () {
      return revealed >= currentLine().length;
    },

    update: function (dt) {
      if (!open) return false;
      const line = currentLine();
      if (revealed < line.length) {
        const before = Math.floor(revealed);
        revealed = Math.min(line.length, revealed + CHARS_PER_SEC * dt);
        render();
        return Math.floor(revealed) > before;
      }
      return false;
    },

    advance: function () {
      if (!open) return;
      const line = currentLine();
      if (revealed < line.length) {
        revealed = line.length;
        render();
        return;
      }
      index += 1;
      if (index >= lines.length) {
        open = false;
        box.classList.remove('is-open');
        const cb = onDone;
        onDone = null;
        if (cb) cb();
        return;
      }
      revealed = 0;
      render();
    },

    close: function () {
      open = false;
      onDone = null;
      box.classList.remove('is-open');
    },
  };
})();
