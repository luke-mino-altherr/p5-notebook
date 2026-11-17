// MANDELBROT SET, after Benoit Mandelbrot (1980)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const ZOOM = 3;           // how much each click zooms in
const COLOUR_SPREAD = 0.03; // try 0.1 for tighter colour bands

let centreX = -0.6;
let centreY = 0;
let scale;      // how much of the maths "map" one pixel covers
let startScale;
let row;        // the next row of pixels to calculate
let maxSteps;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  resetView();
}

function resetView() {
  centreX = -0.6;
  centreY = 0;
  scale = max(3.4 / width, 2.6 / height);
  startScale = scale;
  startRender();
}

function startRender() {
  row = 0;
  // Zoomed in further, the edges need more steps to show their detail.
  maxSteps = floor(min(2000, 120 + 60 * Math.log2(startScale / scale)));
  background(10, 12, 30);
  loadPixels();
}

function draw() {
  if (row >= height) return;

  // Work out rows of pixels for about 20 milliseconds per frame, so the image
  // appears from top to bottom without freezing the page.
  const started = millis();
  while (row < height && millis() - started < 20) {
    for (let x = 0; x < width; x++) setPixel(x, row);
    row++;
  }
  updatePixels();
}

function setPixel(x, y) {
  // Each pixel stands for a point on the maths map.
  const cx = centreX + (x - width / 2) * scale;
  const cy = centreY + (y - height / 2) * scale;

  // THE FORMULA: start at zero, then over and over: square the point and add
  // the pixel's own position. Count how many steps it takes to fly away.
  let zx = 0;
  let zy = 0;
  let steps = 0;
  while (steps < maxSteps && zx * zx + zy * zy < 256) {
    const nextX = zx * zx - zy * zy + cx;
    zy = 2 * zx * zy + cy;
    zx = nextX;
    steps++;
  }

  const i = (y * width + x) * 4;
  if (steps === maxSteps) {
    // Never flew away: this point is inside the set. Paint it dark.
    pixels[i] = 10;
    pixels[i + 1] = 12;
    pixels[i + 2] = 30;
  } else {
    // Flew away: colour by how quickly. The log part smooths out the colour bands.
    const smooth = steps + 1 - Math.log2(Math.log2(zx * zx + zy * zy) / 2);
    const t = smooth * COLOUR_SPREAD;
    // Three offset waves of red, green and blue make a looping rainbow.
    pixels[i] = 255 * (0.5 + 0.5 * Math.cos(TWO_PI * (t + 0.0)));
    pixels[i + 1] = 255 * (0.5 + 0.5 * Math.cos(TWO_PI * (t + 0.15)));
    pixels[i + 2] = 255 * (0.5 + 0.5 * Math.cos(TWO_PI * (t + 0.35)));
  }
  pixels[i + 3] = 255;
}

function mousePressed() {
  // Move the clicked point to the centre and zoom in.
  centreX += (mouseX - width / 2) * scale;
  centreY += (mouseY - height / 2) * scale;
  scale /= ZOOM;
  // Computers run out of precision eventually, so start over when we get there.
  if (scale < 1e-14) resetView();
  else startRender();
}

function doubleClicked() {
  resetView();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetView();
}
