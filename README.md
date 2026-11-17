# p5 notebook

A personal gallery of [p5.js](https://p5js.org) sketches. Every sketch gets a card with a live preview, and clicking a card opens it full page.

## Getting started

You need [Node.js](https://nodejs.org) version 20 or newer. Nothing else to install.

```sh
npm start
```

Then open **http://localhost:3000**. Leave this running while you work. Pages refresh by themselves whenever you save a file.

## Making a sketch

**Running a workshop?** See [WORKSHOP.md](WORKSHOP.md), a participant guide to describing ideas and building them up step by step.

**With Claude:** open this folder in Claude Code and type `/sketch` followed by your idea. Claude turns it into a plain-English recipe, builds the simplest version first, and suggests what to try next. You can also just describe what you want:

> Make a new sketch called "Rainy Window" with raindrops sliding down glass, and let me click to wipe it clear.

> In rainy-window, make the drops bigger and slower.

Claude knows the project's conventions (see `CLAUDE.md`), so you don't need to explain the folder structure.

**By hand:**

```sh
npm run new "Rainy Window"
```

That creates `sketches/rainy-window/`. Open `sketch.js` in that folder and start drawing.

## What's in a sketch folder

| File            | What it's for                                                                  |
| --------------- | ------------------------------------------------------------------------------ |
| `sketch.js`     | Your code (`setup()` runs once, `draw()` runs every frame)                     |
| `recipe.md`     | The sketch in plain-English steps, plus the prompts that built it               |
| `index.html`    | The `<title>` is the name shown in the gallery. Add a description here too |
| `style.css`     | Page styling. Makes the canvas fill the window                                 |
| `thumbnail.png` | Optional picture for the gallery card                                          |
| `assets/`       | Optional images, sounds, fonts or data your sketch loads                       |

## Viewing a sketch

- Move the mouse to show the toolbar: **← Gallery**, **Fullscreen**, **Recipe**, **Code**, and **Save thumbnail**.
- **Recipe** and **Code** open a side panel with the sketch's `recipe.md` or `sketch.js`, each with a Copy button.
- **Save thumbnail** freezes the current frame as the sketch's gallery picture. The live sketch still plays when you hover over the card.
- Press **Esc** to go back to the gallery.

## Bringing in sketches from the p5 web editor

In the [p5 web editor](https://editor.p5js.org) choose **File → Download**, unzip it, and move the folder into `sketches/`. Rename the folder to something short with no spaces (e.g. `my-sketch`). To get the toolbar, add this line just before `</body>` in its `index.html`:

```html
<script src="../../lib/frame.js"></script>
```

## Publishing

Run `npm run build` and upload the whole folder to any static host (GitHub Pages, Netlify, Vercel, and so on).
