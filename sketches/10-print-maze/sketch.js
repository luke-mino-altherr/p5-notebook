// The "10 PRINT" maze: a famous one-line program from the early 1980s.
// Each cell gets a random diagonal line, either / or \. On their own they're
// meaningless, but together they form a maze. Cells are drawn one by one, and when
// the screen is full the maze starts over.

const CELL = 24;            // size of each cell in pixels
const CELLS_PER_FRAME = 12; // drawing speed: try 1 to watch it slowly, 200 for instant

let cols, rows, index;

function setup() {
  createCanvas(windowWidth, windowHeight);
  restart();
}

function restart() {
  cols = ceil(width / CELL);
  rows = ceil(height / CELL);
  index = 0;
  background(28, 30, 60);
}

function draw() {
  stroke(170, 190, 255);
  strokeWeight(CELL / 8);
  strokeCap(SQUARE);

  for (let n = 0; n < CELLS_PER_FRAME; n++) {
    if (index >= cols * rows) {
      // Screen full: pause about two seconds, then start again.
      if (index++ > cols * rows + 120) restart();
      return;
    }
    const x = (index % cols) * CELL;
    const y = floor(index / cols) * CELL;

    // A coin flip decides which way the line leans.
    if (random() < 0.5) line(x, y, x + CELL, y + CELL); // "\"
    else line(x, y + CELL, x + CELL, y);                // "/"
    index++;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restart();
}
