// The gallery: one card per sketch, in two sections: "Your sketches" (newest first)
// and the history examples (sketches with a year, oldest first).
// Cards with a thumbnail.png show it and play the live sketch on hover;
// cards without one play the sketch while on screen.
(function () {
  const sections = document.getElementById('sections');
  const message = document.getElementById('message');
  const count = document.getElementById('count');
  const search = document.getElementById('search');

  let sketches = [];

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function sketchUrl(sketch) {
    return 'sketches/' + encodeURIComponent(sketch.slug) + '/';
  }

  function showMessage(html) {
    message.innerHTML = html;
    message.hidden = false;
  }

  function addLivePreview(preview, sketch) {
    if (preview.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.src = sketchUrl(sketch);
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('scrolling', 'no');
    preview.appendChild(frame);
  }

  function removeLivePreview(preview) {
    const frame = preview.querySelector('iframe');
    if (frame) frame.remove();
  }

  // Only run live previews for cards that are on screen, so a big notebook stays fast.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const preview = entry.target;
      if (entry.isIntersecting) addLivePreview(preview, preview._sketch);
      else removeLivePreview(preview);
    }
  }, { rootMargin: '100px' });

  function card(sketch) {
    const link = document.createElement('a');
    link.className = 'card';
    link.href = sketchUrl(sketch);

    const updated = new Date(sketch.updated).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });

    link.innerHTML = `
      <div class="preview"></div>
      <div class="info">
        ${sketch.year ? `<span class="year">${escapeHtml(sketch.year)}</span>` : ''}
        <h2>${escapeHtml(sketch.title)}</h2>
        ${sketch.description ? `<p>${escapeHtml(sketch.description)}</p>` : ''}
        <time datetime="${new Date(sketch.updated).toISOString()}">Updated ${updated}</time>
      </div>`;

    const preview = link.querySelector('.preview');
    if (sketch.thumbnail) {
      const img = document.createElement('img');
      img.src = sketchUrl(sketch) + sketch.thumbnail + '?v=' + sketch.updated;
      img.alt = '';
      img.loading = 'lazy';
      preview.appendChild(img);
      link.addEventListener('mouseenter', () => addLivePreview(preview, sketch));
      link.addEventListener('mouseleave', () => removeLivePreview(preview));
    } else {
      preview._sketch = sketch;
      observer.observe(preview);
    }
    return link;
  }

  // "1968" → 1968, "2010s" → 2010, so examples can be put in date order.
  function yearOf(sketch) {
    const match = sketch.year.match(/\d{4}/);
    return match ? Number(match[0]) : Infinity;
  }

  function section(title, intro, list, emptyHint) {
    const el = document.createElement('section');
    el.innerHTML = `<h2 class="section-title">${title}</h2>${intro ? `<p class="section-intro">${intro}</p>` : ''}`;
    if (list.length) {
      const grid = document.createElement('div');
      grid.className = 'grid';
      list.forEach((sketch) => grid.appendChild(card(sketch)));
      el.appendChild(grid);
    } else if (emptyHint) {
      el.insertAdjacentHTML('beforeend', `<p class="hint">${emptyHint}</p>`);
    }
    sections.appendChild(el);
  }

  function render() {
    observer.disconnect();
    sections.innerHTML = '';
    message.hidden = true;

    const query = search.value.trim().toLowerCase();
    const shown = sketches.filter((s) =>
      !query || (s.title + ' ' + s.description + ' ' + s.slug).toLowerCase().includes(query)
    );

    count.textContent = sketches.length === 1 ? '1 sketch' : sketches.length + ' sketches';

    if (sketches.length === 0) {
      showMessage('No sketches yet. Create one with <code>npm run new "My first sketch"</code>, or ask Claude to make one.');
      return;
    }
    if (shown.length === 0) {
      showMessage('No sketches match “' + escapeHtml(search.value) + '”.');
      return;
    }

    const yours = shown.filter((s) => !s.year);
    const history = shown
      .filter((s) => s.year)
      .sort((a, b) => yearOf(a) - yearOf(b) || a.title.localeCompare(b.title));

    if (yours.length || !query) {
      section('Your sketches', '', yours,
        'Your sketches will appear here. In Claude, type <code>/sketch</code> followed by your idea, or run <code>npm run new "My sketch"</code>.');
    }
    if (history.length) {
      section('A short history of generative art', 'Each one comes with a plain-English recipe and the prompts that built it. Open a sketch and click <strong>Recipe</strong>.', history);
    }
  }

  async function load() {
    try {
      const res = await fetch('sketches.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      sketches = await res.json();
      render();
    } catch {
      showMessage(
        location.protocol === 'file:'
          ? 'Open the notebook through the local server: run <code>npm start</code>, then visit <code>http://localhost:3000</code>.'
          : 'Could not load the sketch list. If this is a published copy, run <code>npm run build</code> before uploading.'
      );
    }
  }

  search.addEventListener('input', render);
  load();
})();
