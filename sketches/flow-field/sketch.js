// FLOW FIELD, after Tyler Hobbs (2020)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const CURVES = 1200;         // how many curves to try drawing
const CURVES_PER_FRAME = 12; // drawing speed
const STEPS = 160;           // the longest a curve can be
const NOISE_SCALE = 0.0022;  // size of the swirls: try 0.006 for tighter, busier ones
const GAP = 3;               // space kept between curves, in pixels
const PALETTE = ['#2b3a55', '#4f6d7a', '#ce7777', '#d9a441', '#e8c4c4', '#7a9e7e'];

let attempts;
let taken;      // a coarse grid that remembers where curves have been drawn
const GRID = 4; // size of each grid square in pixels
let gridCols;
let margin;

function setup() {
  createCanvas(windowWidth, windowHeight);
  restart();
}

function restart() {
  noiseSeed(floor(random(100000)));
  background(245, 240, 230);
  attempts = 0;
  margin = min(width, height) * 0.06;
  gridCols = ceil(width / GRID);
  taken = new Uint8Array(gridCols * ceil(height / GRID));
}

// The invisible current: smooth noise turned into a direction at every spot.
function angleAt(x, y) {
  return noise(x * NOISE_SCALE, y * NOISE_SCALE) * TWO_PI * 2;
}

function draw() {
  for (let n = 0; n < CURVES_PER_FRAME && attempts < CURVES; n++) {
    drawCurve();
    attempts++;
  }
}

function drawCurve() {
  const unit = min(width, height) / 800;
  const weight = random([1, 1.5, 2, 3, 5, 8]) * unit;
  let x = random(margin, width - margin);
  let y = random(margin, height - margin);

  // Follow the current step by step until we'd hit the margin or another curve.
  const points = [];
  const reach = ceil((weight / 2 + GAP) / GRID);
  for (let s = 0; s < STEPS; s++) {
    if (x < margin || x > width - margin || y < margin || y > height - margin) break;
    if (isTaken(x, y, reach)) break;
    points.push([x, y]);
    const angle = angleAt(x, y);
    x += cos(angle) * 2 * unit;
    y += sin(angle) * 2 * unit;
  }
  if (points.length < 12) return; // too short to be worth drawing

  noFill();
  stroke(random(PALETTE));
  strokeWeight(weight);
  strokeCap(ROUND);
  beginShape();
  for (const [px, py] of points) vertex(px, py);
  endShape();

  // Mark where this curve went, so later curves stay clear of it.
  const mark = ceil(weight / 2 / GRID);
  for (const [px, py] of points) {
    forEachCell(px, py, mark, (i) => (taken[i] = 1));
  }
}

function isTaken(x, y, reach) {
  let hit = false;
  forEachCell(x, y, reach, (i) => (hit = hit || taken[i] === 1));
  return hit;
}

function forEachCell(x, y, reach, action) {
  const cx = floor(x / GRID);
  const cy = floor(y / GRID);
  for (let dy = -reach; dy <= reach; dy++) {
    for (let dx = -reach; dx <= reach; dx++) {
      const gx = cx + dx;
      const gy = cy + dy;
      if (gx >= 0 && gx < gridCols && gy >= 0 && gy * gridCols < taken.length) action(gy * gridCols + gx);
    }
  }
}

function mousePressed() {
  restart();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restart();
}
