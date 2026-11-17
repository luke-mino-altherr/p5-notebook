// Adds a small toolbar to a full-page sketch: back to the gallery, fullscreen,
// and (when running under `npm start`) "Save thumbnail".
// It fades out when the mouse is still, and stays hidden in gallery previews.
(function () {
  if (window.self !== window.top) return;

  const style = document.createElement('style');
  style.textContent = `
    .p5nb-bar {
      position: fixed; top: 12px; left: 12px; z-index: 2147483647;
      display: flex; gap: 6px;
      font: 500 13px/1 system-ui, -apple-system, sans-serif;
      transition: opacity 0.4s ease;
    }
    .p5nb-bar.p5nb-hidden { opacity: 0; pointer-events: none; }
    .p5nb-bar a, .p5nb-bar button {
      appearance: none; border: 0; cursor: pointer; text-decoration: none;
      padding: 8px 12px; border-radius: 999px;
      color: #fff; background: rgba(20, 20, 24, 0.72);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      font: inherit;
    }
    .p5nb-bar a:hover, .p5nb-bar button:hover { background: rgba(20, 20, 24, 0.9); }
    .p5nb-bar a:focus-visible, .p5nb-bar button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
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

  let idleTimer;
  function wake() {
    bar.classList.remove('p5nb-hidden');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!bar.matches(':hover, :focus-within')) bar.classList.add('p5nb-hidden');
    }, 2500);
  }
  ['mousemove', 'touchstart', 'keydown'].forEach((type) =>
    window.addEventListener(type, wake, { passive: true })
  );

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !document.fullscreenElement) location.href = back.href;
  });

  function mount() {
    document.body.appendChild(bar);
    wake();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
