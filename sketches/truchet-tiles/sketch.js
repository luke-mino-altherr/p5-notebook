// TRUCHET TILES, after Sébastien Truchet (1704)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const TILES = 14; // tiles across the shorter side of the screen: try 6 for big tiles, 30 for fine ones

let seed;
let style = 'triangles'; // press any key to switch between 'triangles' (Truchet, 1704) and 'arcs' (Smith, 1987)

function setup() {
  createCanvas(windowWidth, windowHeight);
  seed = floor(random(100000));
  noLoop(); // it's a still image, so draw once (and again on click, key press or resize)
}

function draw() {
  randomSeed(seed); // the same seed always gives the same pattern
  background(245, 242, 234); // paper

  const size = min(width, height) / TILES;
  const columns = ceil(width / size);
  const rows = ceil(height / size);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // The only random choice: which way this tile is turned (0, 1, 2 or 3 quarter turns).
      const turns = floor(random(4));

      push();
      translate((col + 0.5) * size, (row + 0.5) * size); // move to the centre of this tile
      rotate(turns * HALF_PI);
      if (style === 'triangles') {
        drawTriangleTile(size);
      } else {
        drawArcTile(size);
      }
      pop();
    }
  }
}

// Truchet's tile: a square cut corner to corner, one half dark.
function drawTriangleTile(size) {
  const h = size / 2;
  noStroke();
  fill(30, 40, 70); // deep blue ink: try any colour you like
  triangle(-h, -h, h, -h, -h, h);
}

// Smith's tile: two quarter circles in opposite corners. Neighbouring arcs join into long winding paths.
function drawArcTile(size) {
  const h = size / 2;
  noFill();
  stroke(30, 40, 70);
  strokeWeight(size * 0.14); // try 0.4 for thick, bold ribbons
  arc(-h, -h, size, size, 0, HALF_PI);
  arc(h, h, size, size, PI, PI + HALF_PI);
}

// Click for a new random pattern.
function mousePressed() {
  seed = floor(random(100000));
  redraw();
}

// Any key switches the tile style but keeps the same turns.
function keyPressed() {
  style = style === 'triangles' ? 'arcs' : 'triangles';
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
