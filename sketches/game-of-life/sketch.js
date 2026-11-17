// GAME OF LIFE, after John Conway (1970)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const CELL = 10;         // size of each cell in pixels: try 4 for a huge world
const START_ALIVE = 0.2; // share of cells alive at the start
const SPEED = 5;         // frames per generation: lower = faster

let cols, rows;
let alive;     // 1 = alive, 0 = dead, one entry per cell
let age;       // how many generations each cell has been alive
let stillFor = 0;
let history = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  reset();
}

function reset() {
  cols = ceil(width / CELL);
  rows = ceil(height / CELL);
  alive = new Uint8Array(cols * rows);
  age = new Uint16Array(cols * rows);
  for (let i = 0; i < alive.length; i++) alive[i] = random() < START_ALIVE ? 1 : 0;
  stillFor = 0;
  history = [];
}

function draw() {
  if (frameCount % SPEED === 0 && !mouseIsPressed) step();

  background(230, 40, 10);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (!alive[i]) continue;
      // Newborn cells are warm yellow; long-lived cells cool towards blue.
      const a = min(age[i], 60);
      fill(map(a, 0, 60, 50, 210), 70, map(a, 0, 60, 100, 70));
      rect(x * CELL, y * CELL, CELL - 1, CELL - 1, CELL * 0.2);
    }
  }
}

// One generation: every cell counts its 8 neighbours and follows the rules.
function step() {
  const next = new Uint8Array(alive.length);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let neighbours = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          // The edges wrap around, so the world has no walls.
          const nx = (x + dx + cols) % cols;
          const ny = (y + dy + rows) % rows;
          neighbours += alive[ny * cols + nx];
        }
      }
      const i = y * cols + x;
      // THE RULES:
      // a live cell with 2 or 3 live neighbours survives; otherwise it dies.
      // a dead cell with exactly 3 live neighbours comes to life.
      next[i] = alive[i] ? (neighbours === 2 || neighbours === 3 ? 1 : 0) : (neighbours === 3 ? 1 : 0);
      age[i] = next[i] ? age[i] + 1 : 0;
    }
  }
  alive = next;

  // If the world has settled into a steady state, start a fresh one.
  const population = alive.reduce((sum, cell) => sum + cell, 0);
  stillFor = population === history[history.length - 2] ? stillFor + 1 : 0;
  history = [...history.slice(-1), population];
  if (stillFor > 60 || population === 0) reset();
}

// Drag to bring cells to life (the world pauses while you draw).
function paint() {
  const x = floor(mouseX / CELL);
  const y = floor(mouseY / CELL);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (random() < 0.6) {
        const i = ((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols);
        alive[i] = 1;
        age[i] = 0;
      }
    }
  }
}

function mousePressed() {
  paint();
}

function mouseDragged() {
  paint();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  reset();
}
