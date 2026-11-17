// PHYLLOTAXIS, after Helmut Vogel (1979)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const SEEDS = 1200; // how many seeds in the flower head
const GROWTH = 8; // new seeds per frame: try 1 to watch the spiral form slowly
const GOLDEN_ANGLE = 137.508; // in degrees: the angle sunflowers use
const MOUSE_RANGE = 3; // how far the mouse can push the angle away from golden, in degrees

let count = 0; // how many seeds have grown so far
let mouseHasMoved = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  background(30, 30, 12); // dark soil
  translate(width / 2, height / 2);

  // Moving the mouse left and right nudges the angle away from golden.
  // Only the golden angle packs the seeds evenly, with no gaps or spokes.
  let turn = GOLDEN_ANGLE;
  if (mouseHasMoved) {
    turn += map(mouseX, 0, width, -MOUSE_RANGE, MOUSE_RANGE);
  }

  // Spread the seeds so the last one reaches near the edge of the screen.
  const maxRadius = min(width, height) * 0.45;
  const spacing = maxRadius / sqrt(SEEDS);

  for (let n = 0; n < count; n++) {
    // Vogel's formula: turn by the same angle each time, and step out by the square root of n.
    const angle = n * turn;
    const radius = spacing * sqrt(n);

    const x = cos(angle) * radius;
    const y = sin(angle) * radius;

    // Colour shifts from gold in the middle to orange at the rim.
    fill(map(n, 0, SEEDS, 50, 15), 80, map(n, 0, SEEDS, 100, 85));
    circle(x, y, spacing * 0.9); // try 0.5 for small, separate seeds
  }

  count = min(count + GROWTH, SEEDS);

  // Show the angle in use, so you can see how small a change matters.
  if (mouseHasMoved) {
    resetMatrix();
    fill(0, 0, 80);
    textSize(14);
    text(nf(turn, 1, 3) + '°', 16, height - 16);
  }
}

function mouseMoved() {
  mouseHasMoved = true;
}

// Click to grow the flower again from the centre.
function mousePressed() {
  count = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
