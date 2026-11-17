// SUBSTRATE, after Jared Tarbell (2003)
//
// ABOUT: Jared Tarbell's "Substrate" grows lines that look like cracks in dried mud or
// a city seen from above. It was part of a wave of 2000s software art where artists
// wrote small simulations and let them run, shaping the result through the rules.
//
// THE IDEA: a "crack" walks in a straight line until it hits another crack or the edge.
// Then it stops, and a new crack sprouts at a right angle from some existing crack.
// Each crack also scatters a few grains of coloured sand beside it, building up soft
// shading over time. Every grain is placed by a rule; nothing is drawn by hand.
//
// TRY CHANGING: MAX_CRACKS, the PALETTE, GRAINS, or the 90 in newCrack()
// (try 60 for triangular cells).

const MAX_CRACKS = 120;
const SEEDS = 12;          // how many cracks to start with
const GRAINS = 10;         // sand grains per step: more = richer shading
const STEPS_PER_FRAME = 4; // drawing speed
const PALETTE = ['#d8a35d', '#b5543a', '#5e7f86', '#2f4858', '#e6c9a8', '#8f6b8f', '#a3b18a'];

const EMPTY = 10000; // marks a pixel no crack has visited yet
let grid, cracks;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  restart();
}

function restart() {
  background(250, 248, 242);
  grid = new Float32Array(width * height).fill(EMPTY);
  cracks = [];

  // Scatter a few seed points with random directions for cracks to grow from.
  for (let i = 0; i < SEEDS * 50; i++) {
    const x = floor(random(width));
    const y = floor(random(height));
    grid[y * width + x] = floor(random(360));
  }
  for (let i = 0; i < SEEDS; i++) cracks.push(newCrack());
}

// Find a random pixel that is already part of a crack, and branch off it at a right angle.
function newCrack() {
  for (let tries = 0; tries < 2000; tries++) {
    const x = floor(random(width));
    const y = floor(random(height));
    const parent = grid[y * width + x];
    if (parent === EMPTY) continue;

    const angle = parent + random([-90, 90]) + random(-2, 2);
    return {
      x: x + 0.6 * cos(radians(angle)),
      y: y + 0.6 * sin(radians(angle)),
      angle,
      color: color(random(PALETTE)),
    };
  }
  return null; // nowhere left to branch from
}

function draw() {
  for (let step = 0; step < STEPS_PER_FRAME; step++) {
    for (let i = 0; i < cracks.length; i++) {
      if (!cracks[i] || !grow(cracks[i])) {
        // This crack has ended: replace it, and add one more while there's room.
        cracks[i] = newCrack();
        if (cracks.length < MAX_CRACKS) cracks.push(newCrack());
      }
    }
  }
}

// Move a crack one step. Returns false when it hits something and should stop.
function grow(crack) {
  crack.x += 0.4 * cos(radians(crack.angle));
  crack.y += 0.4 * sin(radians(crack.angle));
  const x = floor(crack.x);
  const y = floor(crack.y);
  if (x < 0 || x >= width || y < 0 || y >= height) return false;

  const here = grid[y * width + x];
  // Empty pixel, or our own trail: keep going. Any other crack: stop.
  if (here !== EMPTY && abs(here - crack.angle) > 2) return false;
  grid[y * width + x] = crack.angle;

  paintSand(crack);
  stroke(40, 35, 35, 200);
  point(crack.x, crack.y);
  return true;
}

// Look sideways from the crack until we hit another one, then sprinkle grains
// in that gap, mostly close to the crack so the shading fades outwards.
function paintSand(crack) {
  const side = radians(crack.angle + 90);
  const dx = cos(side);
  const dy = sin(side);

  let reach = 0;
  for (let r = 2; r < 300; r++) {
    const x = floor(crack.x + dx * r);
    const y = floor(crack.y + dy * r);
    if (x < 0 || x >= width || y < 0 || y >= height || grid[y * width + x] !== EMPTY) break;
    reach = r;
  }

  crack.color.setAlpha(28);
  stroke(crack.color);
  for (let g = 0; g < GRAINS; g++) {
    const d = reach * random() * random();
    point(crack.x + dx * d, crack.y + dy * d);
  }
}

function mousePressed() {
  restart();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restart();
}
