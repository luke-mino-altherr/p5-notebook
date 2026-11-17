// Particles drift along a flow field made from Perlin noise.
// Each particle asks the noise "which way should I go here?" and takes a small step.

let particles = [];

const PARTICLE_COUNT = 1500; // more particles = denser texture
const NOISE_SCALE = 0.003;   // try 0.01 for tighter, busier swirls
const SPEED = 1.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(230, 40, 8);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createVector(random(width), random(height)));
  }
}

function draw() {
  // A nearly see-through background leaves soft trails behind the particles.
  background(230, 40, 8, 4);

  strokeWeight(1.2);
  for (const p of particles) {
    // The noise value at this spot (and moment in time) becomes a direction.
    const angle = noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE, frameCount * 0.002) * TWO_PI * 2;
    const previous = p.copy();
    p.add(cos(angle) * SPEED, sin(angle) * SPEED);

    // Colour shifts from teal to pink across the screen.
    stroke(map(p.x, 0, width, 170, 330), 70, 100, 40);
    line(previous.x, previous.y, p.x, p.y);

    // Particles that leave the screen start again somewhere random.
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.set(random(width), random(height));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(230, 40, 8);
}
