// RANDOM TYPE, after LettError's Beowolf (1990)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

// Fraunces, an open-source typeface (SIL Open Font License), loaded from a CDN.
const FONT_URL = 'https://cdn.jsdelivr.net/npm/@fontsource/fraunces@5.2.5/files/fraunces-latin-900-normal.woff';

const MAX_WOBBLE = 0.08; // the wildest wobble, as a share of the letter size: try 0.2
const REDRAW_EVERY = 6;  // frames between new random shapes: 1 = frantic, 30 = slow
const MAX_LETTERS = 14;
// Three ink colours printed on top of each other, slightly out of line, like a risograph.
const INKS = ['#ff4f79', '#2f6fde', '#1b1b1f'];

let font;
let word = 'chance';
let outline = []; // the letter shapes, as a list of drawing instructions
let letterSize;
let mouseHasMoved = false;

function preload() {
  font = loadFont(FONT_URL);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  layoutWord();
}

// Turn the word into outline instructions, sized and centred to fit the window.
function layoutWord() {
  if (!word) {
    outline = [];
    return;
  }
  letterSize = height * 0.4;
  let box = font.font.getPath(word, 0, 0, letterSize).getBoundingBox();
  letterSize = min(letterSize, (letterSize * width * 0.85) / (box.x2 - box.x1));
  box = font.font.getPath(word, 0, 0, letterSize).getBoundingBox();

  const x = (width - (box.x2 - box.x1)) / 2 - box.x1;
  const y = (height - (box.y2 - box.y1)) / 2 - box.y1;
  outline = font.font.getPath(word, x, y, letterSize).commands;
}

function draw() {
  if (frameCount % REDRAW_EVERY !== 1) return;

  background(246, 242, 234);

  // Mouse on the left = crisp letters, on the right = wild ones.
  const amount = mouseHasMoved ? mouseX / width : 0.35;
  const wobble = constrain(amount, 0, 1) * MAX_WOBBLE * letterSize;

  blendMode(MULTIPLY);
  noStroke();
  for (const ink of INKS) {
    fill(ink);
    drawWobbly(outline, wobble);
  }
  blendMode(BLEND);

  fill(120);
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(word ? 'type to change the word · move the mouse left and right' : 'type something', width / 2, height - 20);
}

// Draw the letters, nudging every point of every outline by a random amount.
// This uses the browser's own canvas drawing, which understands font curves.
function drawWobbly(commands, wobble) {
  const nudge = () => random(-wobble, wobble);
  const ctx = drawingContext;
  ctx.beginPath();
  for (const c of commands) {
    if (c.type === 'M') ctx.moveTo(c.x + nudge(), c.y + nudge());
    else if (c.type === 'L') ctx.lineTo(c.x + nudge(), c.y + nudge());
    else if (c.type === 'C') ctx.bezierCurveTo(c.x1 + nudge(), c.y1 + nudge(), c.x2 + nudge(), c.y2 + nudge(), c.x + nudge(), c.y + nudge());
    else if (c.type === 'Q') ctx.quadraticCurveTo(c.x1 + nudge(), c.y1 + nudge(), c.x + nudge(), c.y + nudge());
    else if (c.type === 'Z') ctx.closePath();
  }
  ctx.fill();
}

function mouseMoved() {
  mouseHasMoved = true;
}

// Typing adds letters; Backspace removes them.
function keyTyped() {
  if (key.length !== 1 || (key === ' ' && !word)) return; // ignore special keys and leading spaces
  if (word.length < MAX_LETTERS) word += key;
  layoutWord();
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    word = word.slice(0, -1);
    layoutWord();
    return false; // stop the browser treating Backspace as "go back"
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutWord();
}
