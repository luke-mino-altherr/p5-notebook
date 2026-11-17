// KLEE GRID, after Frieder Nake (1965)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const BANDS = 7; // horizontal bands down the page: try 4 for big bands, 12 for thin ones
const CORNERS = 6; // corners in each zig-zag line: try 2 for gentle slopes, 12 for jagged ones
const CIRCLES = 6; // circles scattered on top

let seed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  seed = floor(random(100000));
  noLoop(); // it's a still image, so draw once (and again on click or resize)
}

function draw() {
  randomSeed(seed); // the same seed always gives the same drawing
  background(245, 242, 234); // paper

  noFill();
  stroke(20);
  strokeWeight(max(1, min(width, height) / 500));

  // The drawing area, with a margin around it.
  const margin = min(width, height) * 0.08;
  const left = margin;
  const right = width - margin;
  const top = margin;
  const bandHeight = (height - 2 * margin) / BANDS;

  // 1. Make the zig-zag lines that split the page into bands.
  // Each line is a list of corner heights, evenly spaced from left to right.
  const lines = [];
  for (let i = 0; i <= BANDS; i++) {
    const wobble = (i === 0 || i === BANDS) ? 0.15 : 0.35; // keep the outer edges calmer
    const heights = [];
    for (let c = 0; c <= CORNERS; c++) {
      heights.push(top + i * bandHeight + random(-wobble, wobble) * bandHeight);
    }
    lines.push(heights);
  }

  // Where is a line at a given x? Find the two corners either side and go between them.
  function heightAt(heights, x) {
    const position = map(x, left, right, 0, CORNERS);
    const c = constrain(floor(position), 0, CORNERS - 1);
    return lerp(heights[c], heights[c + 1], position - c);
  }

  // 2. Fill each band in one of three ways, chosen at random.
  for (let i = 0; i < BANDS; i++) {
    const above = lines[i];
    const below = lines[i + 1];
    const choice = random();

    if (choice < 0.45) {
      // Straight up-and-down lines at random places.
      const count = floor(random(6, 30));
      for (let n = 0; n < count; n++) {
        const x = random(left, right);
        line(x, heightAt(above, x), x, heightAt(below, x));
      }
    } else if (choice < 0.8) {
      // Slanted lines, all leaning the same way.
      const count = floor(random(6, 30));
      const lean = random(-1, 1) * bandHeight;
      for (let n = 0; n < count; n++) {
        const x1 = random(left, right);
        const x2 = constrain(x1 + lean, left, right);
        line(x1, heightAt(above, x1), x2, heightAt(below, x2));
      }
    }
    // Otherwise the band stays empty: a pause in the rhythm.
  }

  // 3. Draw the zig-zag lines themselves.
  for (const heights of lines) {
    beginShape();
    for (let c = 0; c <= CORNERS; c++) {
      vertex(map(c, 0, CORNERS, left, right), heights[c]);
    }
    endShape();
  }

  // 4. Scatter a few circles over the top.
  for (let n = 0; n < CIRCLES; n++) {
    const size = random(0.03, 0.12) * min(width, height);
    circle(random(left, right), random(top, height - margin), size);
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
