// Adds a small toolbar to a full-page sketch: back to the gallery, fullscreen,
// the plain-English recipe, the code, and (when running under `npm start`) "Save thumbnail".
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
    .p5nb-bar a, .p5nb-bar button, .p5nb-panel header button {
      appearance: none; border: 0; cursor: pointer; text-decoration: none;
      padding: 8px 12px; border-radius: 999px;
      color: #fff; background: rgba(20, 20, 24, 0.72);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      font: inherit;
    }
    .p5nb-bar a:hover, .p5nb-bar button:hover, .p5nb-panel header button:hover { background: rgba(60, 60, 68, 0.9); }
    .p5nb-bar [aria-pressed="true"], .p5nb-panel header [aria-selected="true"] { background: #fff; color: #111; }
    .p5nb-bar a:focus-visible, .p5nb-bar button:focus-visible, .p5nb-panel button:focus-visible {
      outline: 2px solid #fff; outline-offset: 2px;
    }

    .p5nb-panel {
      position: fixed; top: 0; right: 0; bottom: 0; z-index: 2147483646;
      width: min(580px, 100vw);
      display: flex; flex-direction: column;
      color: #e8e8ec; background: rgba(16, 16, 20, 0.95);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      box-shadow: -8px 0 32px rgba(0, 0, 0, 0.35);
      font: 500 13px/1 system-ui, -apple-system, sans-serif;
      transform: translateX(100%); transition: transform 0.25s ease;
    }
    .p5nb-panel.p5nb-open { transform: none; }
    .p5nb-panel header {
      display: flex; align-items: center; gap: 6px;
      padding: 12px 12px 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .p5nb-panel .p5nb-tabs { flex: 1; display: flex; gap: 4px; }
    .p5nb-panel [hidden] { display: none !important; }

    .p5nb-panel pre {
      flex: 1; margin: 0; padding: 16px 20px 32px; overflow: auto;
      font: 13px/1.6 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      white-space: pre-wrap; overflow-wrap: anywhere; tab-size: 2; user-select: text;
    }
    .p5nb-panel .p5nb-comment { color: #8a93a6; font-style: italic; }

    .p5nb-recipe {
      flex: 1; overflow: auto; padding: 8px 24px 40px;
      font: 400 15px/1.6 system-ui, -apple-system, sans-serif; user-select: text;
    }
    .p5nb-recipe h1 { font-size: 24px; line-height: 1.25; margin: 16px 0 4px; }
    .p5nb-recipe h1 + p em { color: #a8a8b3; }
    .p5nb-recipe h2 {
      margin: 28px 0 8px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #a8a8b3;
    }
    .p5nb-recipe h3 { font-size: 15px; margin: 20px 0 6px; }
    .p5nb-recipe p { margin: 0 0 12px; }
    .p5nb-recipe ol, .p5nb-recipe ul { margin: 0 0 12px; padding-left: 22px; }
    .p5nb-recipe li { margin: 4px 0; }
    .p5nb-recipe blockquote {
      margin: 0 0 10px; padding: 10px 14px; border-left: 3px solid #ed225d; border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
    }
    .p5nb-recipe code {
      font: 13px ui-monospace, Menlo, monospace; padding: 1px 5px; border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    }
    .p5nb-recipe a { color: #ff7aa2; }
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

  // ---- side panel: recipe.md and sketch.js ------------------------------------

  const panel = document.createElement('aside');
  panel.className = 'p5nb-panel';
  panel.setAttribute('aria-label', 'About this sketch');
  panel.innerHTML = `
    <header>
      <div class="p5nb-tabs" role="tablist">
        <button type="button" role="tab" data-tab="recipe">Recipe</button>
        <button type="button" role="tab" data-tab="code">Code</button>
      </div>
      <button type="button" data-action="copy" title="Copy this tab’s text">Copy</button>
      <button type="button" data-action="close" aria-label="Close panel">✕</button>
    </header>
    <div class="p5nb-recipe" data-view="recipe" tabindex="0"></div>
    <pre data-view="code" tabindex="0"></pre>`;

  const files = { recipe: 'recipe.md', code: 'sketch.js' };
  const text = { recipe: '', code: '' };
  const toolbarButtons = {};
  let openTab = null;

  function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Dim whole-line comments so the explanations stand apart from the code.
  function renderCode(source) {
    return source
      .split('\n')
      .map((line) => {
        const html = escapeHtml(line);
        return /^\s*\/\//.test(line) ? `<span class="p5nb-comment">${html}</span>` : html;
      })
      .join('\n');
  }

  function inline(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  // A small Markdown reader: headings, paragraphs, lists, quotes, `code`, **bold**, *italic*, links.
  function renderMarkdown(md) {
    const out = [];
    let paragraph = [];
    let list = null;
    const endParagraph = () => {
      if (paragraph.length) out.push(`<p>${inline(paragraph.join(' '))}</p>`);
      paragraph = [];
    };
    const endList = () => {
      if (list) out.push(`</${list}>`);
      list = null;
    };

    for (const line of md.split('\n')) {
      let match;
      if (!line.trim()) {
        endParagraph();
        endList();
      } else if ((match = line.match(/^(#{1,3})\s+(.*)/))) {
        endParagraph();
        endList();
        out.push(`<h${match[1].length}>${inline(match[2])}</h${match[1].length}>`);
      } else if ((match = line.match(/^>\s?(.*)/))) {
        endParagraph();
        endList();
        out.push(`<blockquote>${inline(match[1])}</blockquote>`);
      } else if ((match = line.match(/^\s*(?:[-*]|(\d+)\.)\s+(.*)/))) {
        endParagraph();
        const type = match[1] ? 'ol' : 'ul';
        if (list !== type) {
          endList();
          out.push(`<${type}>`);
          list = type;
        }
        out.push(`<li>${inline(match[2])}</li>`);
      } else {
        endList();
        paragraph.push(line.trim());
      }
    }
    endParagraph();
    endList();
    return out.join('\n');
  }

  async function load(tab) {
    const res = await fetch(files[tab], { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status);
    text[tab] = await res.text();
    const view = panel.querySelector(`[data-view="${tab}"]`);
    view.innerHTML = tab === 'code' ? renderCode(text[tab]) : renderMarkdown(text[tab]);
  }

  function showTab(tab) {
    openTab = tab;
    panel.classList.toggle('p5nb-open', Boolean(tab));
    for (const name of Object.keys(files)) {
      const active = name === tab;
      panel.querySelector(`[data-view="${name}"]`).hidden = !active;
      panel.querySelector(`[data-tab="${name}"]`).setAttribute('aria-selected', String(active));
      if (toolbarButtons[name]) toolbarButtons[name].setAttribute('aria-pressed', String(active));
    }
    if (tab) {
      const view = panel.querySelector(`[data-view="${tab}"]`);
      if (!text[tab]) view.textContent = 'Loading…';
      load(tab).catch(() => (view.textContent = `Could not load ${files[tab]}.`));
      view.focus({ preventScroll: true });
    }
    wake();
  }

  function addToolbarButton(tab, label, title) {
    const button = document.createElement('button');
    button.textContent = label;
    button.title = title;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => showTab(openTab === tab ? null : tab));
    toolbarButtons[tab] = button;
    bar.appendChild(button);
    return button;
  }

  const recipeButton = addToolbarButton('recipe', 'Recipe', 'How this sketch works, in plain English');
  addToolbarButton('code', 'Code', 'Show the code for this sketch');

  // Only offer the Recipe tab when the sketch has a recipe.md.
  recipeButton.hidden = true;
  panel.querySelector('[data-tab="recipe"]').hidden = true;
  load('recipe')
    .then(() => {
      recipeButton.hidden = false;
      panel.querySelector('[data-tab="recipe"]').hidden = false;
    })
    .catch(() => {});

  panel.querySelectorAll('[data-tab]').forEach((tabButton) =>
    tabButton.addEventListener('click', () => showTab(tabButton.dataset.tab))
  );
  panel.querySelector('[data-action="close"]').addEventListener('click', () => showTab(null));
  panel.querySelector('[data-action="copy"]').addEventListener('click', async (event) => {
    try {
      await navigator.clipboard.writeText(text[openTab]);
      flash(event.currentTarget, 'Copied ✓');
    } catch {
      flash(event.currentTarget, 'Select and copy');
    }
  });

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
  // clicking a button or scrolling the panel would also count as input to the sketch.
  ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend', 'touchmove', 'wheel', 'keydown', 'keyup']
    .forEach((type) => {
      bar.addEventListener(type, (event) => {
        if (type === 'keydown') wake();
        event.stopPropagation();
      });
      panel.addEventListener(type, (event) => {
        if (type === 'keydown' && event.key === 'Escape') showTab(null);
        event.stopPropagation();
      });
    });

  // ---- fade out when idle ---------------------------------------------------

  let idleTimer;
  function wake() {
    bar.classList.remove('p5nb-hidden');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!openTab && !bar.matches(':hover, :focus-within')) bar.classList.add('p5nb-hidden');
    }, 2500);
  }
  ['mousemove', 'touchstart', 'keydown'].forEach((type) =>
    window.addEventListener(type, wake, { passive: true })
  );

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || document.fullscreenElement) return;
    if (openTab) showTab(null);
    else location.href = back.href;
  });

  function mount() {
    document.body.appendChild(panel);
    document.body.appendChild(bar);
    showTab(null);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
