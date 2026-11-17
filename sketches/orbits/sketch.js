// Rings of planets circling a glowing centre, each ring at its own speed.
// Moving the mouse up and down tilts the whole system.

const RINGS = 7;           // how many orbits
const PLANETS_PER_RING = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(12, 10, 24);
  translate(width / 2, height / 2);

  // Mouse height controls the tilt: squash circles into ellipses.
  const tilt = map(mouseY, 0, height, 0.25, 1, true);
  const maxRadius = min(width, height) * 0.45;

  // The sun.
  for (let r = 60; r > 0; r -= 6) {
    fill(255, 190, 90, map(r, 60, 0, 10, 255));
    circle(0, 0, r * maxRadius / 300);
  }

  for (let ring = 1; ring <= RINGS; ring++) {
    const radius = (ring / RINGS) * maxRadius;
    // Inner rings move faster, like real planets. Try changing 0.02.
    const speed = 0.02 / sqrt(ring);

    // Faint orbit line.
    noFill();
    stroke(255, 20);
    ellipse(0, 0, radius * 2, radius * 2 * tilt);
    noStroke();

    for (let i = 0; i < PLANETS_PER_RING; i++) {
      const angle = frameCount * speed + (i / PLANETS_PER_RING) * TWO_PI + ring;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius * tilt;
      // Planets in front (lower on screen) are drawn bigger and brighter.
      const depth = map(sin(angle), -1, 1, 0.6, 1.2);
      fill(120 + ring * 18, 160, 255 - ring * 15, 255 * depth * 0.8);
      circle(x, y, (maxRadius / 40) * depth);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
