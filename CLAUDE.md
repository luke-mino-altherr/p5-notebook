# p5 notebook

A gallery of p5.js sketches. Each sketch is a folder in `sketches/`; the gallery (`index.html`) shows a card for each one, and clicking a card opens the sketch full page.

This is used in workshops: participants describe an idea in plain English and build it up with Claude one step at a time. When someone describes a new artwork or asks to change their sketch, follow the `/sketch` skill (`.claude/skills/sketch/SKILL.md`). `WORKSHOP.md` is the participant guide.

The people working here range from experienced developers to artists who have never used a terminal. Explain things in plain language, avoid jargon unless the user uses it first, and when you finish a sketch, tell them the exact URL to open (`http://localhost:3000/sketches/<slug>/`).

## Running it

- `npm start` runs the dev server at http://localhost:3000. Pages reload automatically on save. No install step; there are no dependencies.
- Requires Node 20+ (`.nvmrc`). If `node --version` is older, run `nvm use` first.
- If the user wants to see their work and the server isn't running, start it in the background.

## Making a sketch

1. `npm run new "Sketch Name"` copies `sketches/_template/` to `sketches/<slug>/` and sets the title. Always use this rather than creating the folder by hand.
2. Write the art in `sketches/<slug>/sketch.js`.
3. Set the gallery description with `<meta name="description" content="...">` in the sketch's `index.html`. Write one short sentence describing what you see.
4. Keep `recipe.md` in sync with the code: **The recipe** describes the sketch as it is now, in numbered plain-English steps; **Building it up** lists the prompts used, one idea each, tagged with building blocks.

A sketch folder:

```
sketches/<slug>/
  index.html      loads p5, sketch.js and ../../lib/frame.js. <title> is the gallery title
  sketch.js       the art
  recipe.md       plain-English recipe and the prompts that built it (Recipe tab in the toolbar)
  style.css       makes the canvas fill the page
  thumbnail.png   optional gallery picture (the "Save thumbnail" button writes this)
  assets/         optional images, sounds, fonts, data
```

## Sketch conventions

- Use p5 **global mode** (`function setup()`, `function draw()`), the style used in the p5 web editor and most tutorials. Use instance mode only if the user asks for it.
- Fill the window: `createCanvas(windowWidth, windowHeight)` plus a `windowResized()` that calls `resizeCanvas`. Size things relative to `width`/`height` so the sketch looks right as a small gallery preview and full screen.
- Load files with relative paths (`loadImage('assets/cat.png')`) inside `preload()` or with callbacks.
- p5 is pinned to 1.11.1 from jsdelivr in each `index.html`. Use p5 1.x APIs. Extra libraries (p5.sound etc.) go in that sketch's `index.html` as pinned CDN script tags.
- Keep `lib/frame.js` included as the last script. It adds the back / fullscreen / recipe / code / thumbnail toolbar and hides itself in gallery previews. Escape goes back to the gallery, so don't use Escape in sketches.
- Comment the code the way a patient teacher would: say what each block does visually, and name the numbers worth tweaking (e.g. `// try 0.005 for slower, smoother swirls`).
- Each sketch must stand on its own. Don't share code between sketches.
- History examples (homages to artists) add `<meta name="year" content="1968">` to `index.html`. The gallery lists them separately, oldest first, with the year on the card. Participants' sketches have no year and appear under "Your sketches", newest first. Homages are named "(after Artist)", implement the published technique in our own code, and don't copy original source or specific finished works.

## Project layout

- `index.html`, `lib/gallery.js`, `lib/gallery.css`: the gallery page (plain HTML/CSS/JS, no framework).
- `lib/frame.js`: toolbar injected into every full-page sketch. Its side panel shows `recipe.md` (via a small built-in Markdown renderer: headings, lists, `>` quotes, bold, italic, code, links) and `sketch.js`, so keep the art in that file.
- `server.js`: zero-dependency dev server (static files, live reload, `/sketches.json`, thumbnail saving).
- `scripts/scan.js`: finds sketches; folders starting with `_` or `.` are skipped.
- `scripts/new-sketch.js`, `scripts/build-index.js`: `npm run new` and `npm run build`.
- `promo/`: workshop poster and infographics in a 1960s plotter style (plain HTML + SVG). Event details live at the top of `promo/plotter.js`; `./promo/render.sh` exports PNGs to `promo/images/` (gitignored) using macOS Chrome.

Keep it buildless and free of dependencies. Every file should be readable and editable by someone who knows a little HTML.

## Publishing

`npm run build` writes `sketches.json`, after which the folder is a static site that can be hosted anywhere (GitHub Pages, Netlify, ...). `sketches.json` is gitignored, so hosting setups need to run the build. Live reload and "Save thumbnail" only work under `npm start`.
