// TURING PATTERNS, after Alan Turing (1952)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).
//
// This uses the "Gray-Scott" model, a later and simpler way to code Turing's idea.
// Two invisible chemicals, A and B, fill a grid of cells. B eats A to make more B,
// both spread out to neighbouring cells, and A is slowly topped up while B slowly fades.

const CELLS = 220; // cells across the longer side: more = finer detail, but slower
const STEPS_PER_FRAME = 12; // how many chemistry steps per frame: try 3 to watch it grow slowly

// These two numbers decide the kind of pattern.
const FEED = 0.055; // how fast A is topped up
const KILL = 0.062; // how fast B fades away
// Try FEED 0.0367 and KILL 0.0649 for spots that keep splitting in two,
// or FEED 0.03 and KILL 0.057 for twisting stripes.

let columns, rows;
let a, b, nextA, nextB; // the amount of each chemical in every cell, from 0 to 1
let picture; // a small image, one pixel per cell, stretched to fill the screen

function setup() {
  createCanvas(windowWidth, windowHeight);
  startGrid();
}

function draw() {
  // Holding the mouse down pours chemical B onto the grid.
  if (mouseIsPressed) {
    pour(floor((mouseX / width) * columns), floor((mouseY / height) * rows), 3);
  }

  for (let step = 0; step < STEPS_PER_FRAME; step++) {
    react();
  }

  showGrid();
}

// Fill every cell with chemical A, then drop a few small patches of B to get things started.
function startGrid() {
  const cellSize = max(width, height) / CELLS;
  columns = ceil(width / cellSize);
  rows = ceil(height / cellSize);

  a = new Float32Array(columns * rows).fill(1);
  b = new Float32Array(columns * rows).fill(0);
  nextA = a.slice();
  nextB = b.slice();

  for (let i = 0; i < 12; i++) { // 12 starting patches: try 1 to watch a single one spread
    pour(floor(random(columns)), floor(random(rows)), 3);
  }

  picture = createGraphics(columns, rows);
  picture.pixelDensity(1);
}

// Set chemical B to full in a small square around a cell.
function pour(centreX, centreY, radius) {
  for (let y = centreY - radius; y <= centreY + radius; y++) {
    for (let x = centreX - radius; x <= centreX + radius; x++) {
      if (x > 0 && x < columns - 1 && y > 0 && y < rows - 1) {
        b[x + y * columns] = 1;
      }
    }
  }
}

// One step of chemistry for every cell (except the outside edge).
function react() {
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < columns - 1; x++) {
      const i = x + y * columns;
      const aHere = a[i];
      const bHere = b[i];

      // Spreading: compare this cell with a blend of its 8 neighbours.
      const spreadA = blendNeighbours(a, i) - aHere;
      const spreadB = blendNeighbours(b, i) - bHere;

      // The reaction: where A meets B, some A turns into B.
      const eaten = aHere * bHere * bHere;

      nextA[i] = aHere + 1.0 * spreadA - eaten + FEED * (1 - aHere);
      nextB[i] = bHere + 0.5 * spreadB + eaten - (KILL + FEED) * bHere; // B spreads half as fast as A
    }
  }

  // The new amounts become the current amounts.
  [a, nextA] = [nextA, a];
  [b, nextB] = [nextB, b];
}

// Side neighbours count more than corner neighbours.
function blendNeighbours(grid, i) {
  const up = i - columns;
  const down = i + columns;
  return (
    0.2 * (grid[i - 1] + grid[i + 1] + grid[up] + grid[down]) +
    0.05 * (grid[up - 1] + grid[up + 1] + grid[down - 1] + grid[down + 1])
  );
}

// Colour each cell: cream where there's mostly A, deep teal where there's B.
function showGrid() {
  picture.loadPixels();
  for (let i = 0; i < columns * rows; i++) {
    const amount = constrain(a[i] - b[i], 0, 1);
    picture.pixels[i * 4] = lerp(15, 245, amount);
    picture.pixels[i * 4 + 1] = lerp(70, 238, amount);
    picture.pixels[i * 4 + 2] = lerp(80, 220, amount);
    picture.pixels[i * 4 + 3] = 255;
  }
  picture.updatePixels();
  image(picture, 0, 0, width, height); // stretching the small image softens the cells
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  startGrid();
}
