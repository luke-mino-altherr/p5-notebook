// Inspired by Vera Molnár's "(Des)Ordres" (1974).
// Each cell of the grid holds a stack of squares, one inside the next. Every corner
// trembles slightly, and some squares are left out, so no two cells look alike.
// Click (or tap) for a new random version.

const CELLS_ACROSS = 10;   // grid size (the shorter side of the screen gets fewer)
const RINGS = 8;           // squares per cell
const TREMBLE = 0.06;      // how far corners wander, as a fraction of the cell size
const SKIP_CHANCE = 0.25;  // chance that a square is left out

let seed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  seed = floor(random(100000));
  noLoop();
}

function draw() {
  randomSeed(seed);
  background(242, 238, 228);

  const cell = min(width, height) / (CELLS_ACROSS + 1);
  const cols = floor(width / cell) - 1;
  const rows = floor(height / cell) - 1;
  const left = (width - cols * cell) / 2;
  const top = (height - rows * cell) / 2;

  noFill();
  stroke(40, 30, 30);
  strokeWeight(max(1, cell / 120));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = left + (col + 0.5) * cell;
      const cy = top + (row + 0.5) * cell;

      for (let ring = 1; ring <= RINGS; ring++) {
        if (random() < SKIP_CHANCE) continue;
        const half = (ring / RINGS) * cell * 0.45;
        const wobble = () => random(-1, 1) * TREMBLE * cell;

        // Draw the square as four corners, each nudged a little.
        quad(
          cx - half + wobble(), cy - half + wobble(),
          cx + half + wobble(), cy - half + wobble(),
          cx + half + wobble(), cy + half + wobble(),
          cx - half + wobble(), cy + half + wobble()
        );
      }
    }
  }
}

function mousePressed() {
  seed = floor(random(100000));
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
