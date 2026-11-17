// Adds a small toolbar to a full-page sketch: back to the gallery, fullscreen,
// view the code, and (when running under `npm start`) "Save thumbnail".
// It fades out when the mouse is still, and stays hidden in gallery previews.
(function () {
  if (window.self !== window.top) return;

  const style = document.createElement('style');
  style.textContent = `
    .p5nb-bar {
      position: fixed; top: 12px; left: 12px; z-index: 2147483647;
      display: flex; flex-wrap: wrap; gap: 6px;
      font: 500 13px/1 system-ui, -apple-system, sans-serif;
      transition: opacity 0.4s ease;
    }
    .p5nb-bar.p5nb-hidden { opacity: 0; pointer-events: none; }
    .p5nb-bar a, .p5nb-bar button, .p5nb-code button {
      appearance: none; border: 0; cursor: pointer; text-decoration: none;
      padding: 8px 12px; border-radius: 999px;
      color: #fff; background: rgba(20, 20, 24, 0.72);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      font: inherit;
    }
    .p5nb-bar a:hover, .p5nb-bar button:hover, .p5nb-code button:hover { background: rgba(60, 60, 68, 0.9); }
    .p5nb-bar a:focus-visible, .p5nb-bar button:focus-visible, .p5nb-code button:focus-visible {
      outline: 2px solid #fff; outline-offset: 2px;
    }

    .p5nb-code {
      position: fixed; top: 0; right: 0; bottom: 0; z-index: 2147483646;
      width: min(560px, 100vw);
      display: flex; flex-direction: column;
      color: #e8e8ec; background: rgba(16, 16, 20, 0.94);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      box-shadow: -8px 0 32px rgba(0, 0, 0, 0.35);
      font: 500 13px/1 system-ui, -apple-system, sans-serif;
      transform: translateX(100%); transition: transform 0.25s ease;
    }
    .p5nb-code.p5nb-open { transform: none; }
    .p5nb-code header {
      display: flex; align-items: center; gap: 6px;
      padding: 12px 12px 12px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .p5nb-code header span { flex: 1; color: #a8a8b3; font-family: ui-monospace, Menlo, monospace; }
    .p5nb-code pre {
      flex: 1; margin: 0; padding: 16px 20px 32px; overflow: auto;
      font: 13px/1.6 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      white-space: pre-wrap; overflow-wrap: anywhere; tab-size: 2; user-select: text;
    }
    .p5nb-code .p5nb-comment { color: #8a93a6; font-style: italic; }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.className = 'p5nb-bar';

  const back = document.createElement('a');
  back.href = '../../';
  back.textContent = '← Gallery';
  back.title = 'Back to the gallery (Esc)';
  bar.appendChild(back);

  if (document.documentElement.requestFullscreen) {
    const full = document.createElement('button');
    full.textContent = 'Fullscreen';
    full.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    });
    document.addEventListener('fullscreenchange', () => {
      full.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
    });
    bar.appendChild(full);
  }

  // ---- code panel -----------------------------------------------------------

  const panel = document.createElement('aside');
  panel.className = 'p5nb-code';
  panel.setAttribute('aria-label', 'Sketch source code');
  panel.innerHTML = `
    <header>
      <span>sketch.js</span>
      <button type="button" data-action="copy">Copy</button>
      <button type="button" data-action="close" aria-label="Close code">✕</button>
    </header>
    <pre tabindex="0">Loading…</pre>`;
  const pre = panel.querySelector('pre');
  let source = '';

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Dim whole-line comments so the explanations stand apart from the code.
  function render(text) {
    return text
      .split('\n')
      .map((line) => {
        const html = escapeHtml(line);
        return /^\s*\/\//.test(line) ? `<span class="p5nb-comment">${html}</span>` : html;
      })
      .join('\n');
  }

  async function loadSource() {
    try {
      const res = await fetch('sketch.js', { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      source = await res.text();
      pre.innerHTML = render(source);
    } catch {
      pre.textContent = 'Could not load sketch.js.';
    }
  }

  const codeButton = document.createElement('button');
  codeButton.textContent = 'Code';
  codeButton.title = 'Show the code for this sketch';
  codeButton.setAttribute('aria-expanded', 'false');

  function setPanel(open) {
    panel.classList.toggle('p5nb-open', open);
    codeButton.setAttribute('aria-expanded', String(open));
    codeButton.textContent = open ? 'Hide code' : 'Code';
    if (open) {
      loadSource();
      pre.focus({ preventScroll: true });
    }
    wake();
  }
  const isPanelOpen = () => panel.classList.contains('p5nb-open');

  codeButton.addEventListener('click', () => setPanel(!isPanelOpen()));
  panel.querySelector('[data-action="close"]').addEventListener('click', () => setPanel(false));
  panel.querySelector('[data-action="copy"]').addEventListener('click', async (event) => {
    try {
      await navigator.clipboard.writeText(source);
      flash(event.currentTarget, 'Copied ✓');
    } catch {
      flash(event.currentTarget, 'Select and copy');
    }
  });
  bar.appendChild(codeButton);

  // ---- thumbnail ------------------------------------------------------------

  if (window.__P5NB_DEV) {
    const thumb = document.createElement('button');
    thumb.textContent = 'Save thumbnail';
    thumb.title = 'Use the current frame as this sketch’s picture in the gallery';
    thumb.addEventListener('click', async () => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return flash(thumb, 'No canvas found');
      const slug = location.pathname.split('/').filter(Boolean).pop();
      try {
        const res = await fetch('/__thumbnail/' + encodeURIComponent(slug), {
          method: 'POST',
          body: canvas.toDataURL('image/png'),
        });
        flash(thumb, res.ok ? 'Saved ✓' : 'Could not save');
      } catch {
        flash(thumb, 'Could not save');
      }
    });
    bar.appendChild(thumb);
  }

  function flash(button, message) {
    const original = button.textContent;
    button.textContent = message;
    setTimeout(() => (button.textContent = original), 1500);
  }

  // p5 listens for mouse, touch and key events on the whole window, so without this,
  // clicking a button or scrolling the code would also count as input to the sketch.
  ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend', 'touchmove', 'wheel', 'keydown', 'keyup']
    .forEach((type) => {
      bar.addEventListener(type, (event) => {
        if (type === 'keydown') wake();
        event.stopPropagation();
      });
      panel.addEventListener(type, (event) => {
        if (type === 'keydown' && event.key === 'Escape') setPanel(false);
        event.stopPropagation();
      });
    });

  // ---- fade out when idle ---------------------------------------------------

  let idleTimer;
  function wake() {
    bar.classList.remove('p5nb-hidden');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!isPanelOpen() && !bar.matches(':hover, :focus-within')) bar.classList.add('p5nb-hidden');
    }, 2500);
  }
  ['mousemove', 'touchstart', 'keydown'].forEach((type) =>
    window.addEventListener(type, wake, { passive: true })
  );

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || document.fullscreenElement) return;
    if (isPanelOpen()) setPanel(false);
    else location.href = back.href;
  });

  function mount() {
    document.body.appendChild(panel);
    document.body.appendChild(bar);
    wake();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
