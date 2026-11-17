// A homage to "Schotter" ("Gravel") by Georg Nees, 1968, one of the first works of computer art.
// A grid of squares starts perfectly ordered at the top. Each row down, the squares
// are rotated and pushed out of place a little more, until the grid falls apart.
// Click (or tap) for a new random version.

const COLUMNS = 12;
const ROWS = 22;
const CHAOS = 1; // try 0.5 for a calmer drawing, 2 for a wilder one

let seed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  seed = floor(random(100000));
  noLoop(); // it's a still image, so draw once (and again on click or resize)
}

function draw() {
  randomSeed(seed); // the same seed always gives the same drawing
  background(245, 242, 234); // paper

  // Choose a square size that fits the whole grid on screen with a margin around it.
  const size = min(width / (COLUMNS + 4), height / (ROWS + 4));
  const left = (width - COLUMNS * size) / 2;
  const top = (height - ROWS * size) / 2;

  noFill();
  stroke(20);
  strokeWeight(max(1, size / 30));
  rectMode(CENTER);

  for (let row = 0; row < ROWS; row++) {
    // How disordered this row is: 0 at the top, growing towards the bottom.
    const disorder = (row / ROWS) * CHAOS;

    for (let col = 0; col < COLUMNS; col++) {
      const shiftX = random(-1, 1) * disorder * size * 0.5;
      const shiftY = random(-1, 1) * disorder * size * 0.5;
      const angle = random(-1, 1) * disorder * QUARTER_PI;

      push();
      translate(left + (col + 0.5) * size + shiftX, top + (row + 0.5) * size + shiftY);
      rotate(angle);
      square(0, 0, size);
      pop();
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
