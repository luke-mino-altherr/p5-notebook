// Drag (or touch) to paint glowing ribbons. Strokes fade away over a few seconds.
// When nobody is painting, an invisible brush wanders around on its own.

let strokes = [];

const FADE_SPEED = 2;  // higher = strokes disappear faster
const MAX_POINTS = 150; // ribbon length before a new colour starts

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(260, 30, 6);
  blendMode(ADD);

  // The "ghost brush" paints when nobody is touching the canvas.
  if (!mouseIsPressed) {
    const t = frameCount * 0.01;
    addPoint(
      width * noise(t),
      height * noise(t + 100)
    );
  }

  for (const s of strokes) {
    s.life -= FADE_SPEED / 10;
    noFill();
    // Draw each ribbon twice: a wide faint halo, then a thin bright core.
    strokeWeight(24);
    stroke(s.hue, 80, 100, s.life * 0.12);
    drawRibbon(s.points);
    strokeWeight(4);
    stroke(s.hue, 40, 100, s.life * 0.8);
    drawRibbon(s.points);
  }

  blendMode(BLEND);
  strokes = strokes.filter((s) => s.life > 0);
}

function drawRibbon(points) {
  beginShape();
  for (const p of points) curveVertex(p.x, p.y);
  endShape();
}

function addPoint(x, y) {
  let current = strokes[strokes.length - 1];
  if (!current || current.done) {
    current = { points: [], hue: (frameCount * 3) % 360, life: 100, done: false };
    strokes.push(current);
  }
  current.points.push(createVector(x, y));
  current.life = 100;
  if (current.points.length > MAX_POINTS) current.done = true;
}

function mousePressed() {
  // Finish the ghost brush's ribbon so the visitor starts a fresh one.
  if (strokes.length) strokes[strokes.length - 1].done = true;
}

function mouseDragged() {
  addPoint(mouseX, mouseY);
}

function mouseReleased() {
  if (strokes.length) strokes[strokes.length - 1].done = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
