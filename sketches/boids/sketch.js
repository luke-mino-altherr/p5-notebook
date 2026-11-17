// BOIDS, after Craig Reynolds (1987)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const BIRDS = 150; // try 300 for a big murmuration (it gets slower)

// How strongly each bird follows the three rules. Try turning one up or down to see what it does.
const SEPARATION = 1.6; // don't crowd your neighbours
const ALIGNMENT = 1.0; // fly the same way as your neighbours
const COHESION = 0.8; // stay close to your neighbours

let birds = [];
let sightRange, maxSpeed, maxTurn, birdSize; // set from the screen size in setScale()

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  setScale();
  for (let i = 0; i < BIRDS; i++) {
    birds.push({
      position: createVector(random(width), random(height)),
      velocity: p5.Vector.random2D().mult(maxSpeed * random(0.5, 1)),
    });
  }
  background(215, 45, 14);
}

// Size distances and speeds to the screen, so the flock looks the same in a small preview.
function setScale() {
  const unit = min(width, height);
  sightRange = unit * 0.08; // how far each bird can see its neighbours
  maxSpeed = unit * 0.005;
  maxTurn = maxSpeed * 0.05; // how sharply a bird can change direction
  birdSize = unit * 0.012;
}

function draw() {
  // A see-through background leaves short trails behind the birds.
  background(215, 45, 14, 35);

  for (const bird of birds) {
    steer(bird);
  }
  for (const bird of birds) {
    move(bird);
    drawBird(bird);
  }
}

// Look at the neighbours and work out which way to turn.
function steer(bird) {
  const away = createVector(0, 0); // separation
  const heading = createVector(0, 0); // alignment
  const centre = createVector(0, 0); // cohesion
  let neighbours = 0;
  let tooClose = 0;

  for (const other of birds) {
    if (other === bird) continue;
    const d = p5.Vector.dist(bird.position, other.position);
    if (d < sightRange) {
      heading.add(other.velocity);
      centre.add(other.position);
      neighbours++;
      if (d < sightRange * 0.4 && d > 0) {
        // The closer the neighbour, the harder we push away from it.
        away.add(p5.Vector.sub(bird.position, other.position).div(d * d));
        tooClose++;
      }
    }
  }

  bird.turn = createVector(0, 0);
  if (tooClose > 0) bird.turn.add(towards(bird, away).mult(SEPARATION));
  if (neighbours > 0) {
    bird.turn.add(towards(bird, heading).mult(ALIGNMENT));
    centre.div(neighbours).sub(bird.position);
    bird.turn.add(towards(bird, centre).mult(COHESION));
  }

  // Birds flee from the mouse, like a hawk.
  const mouse = createVector(mouseX, mouseY);
  const fromMouse = p5.Vector.sub(bird.position, mouse);
  if (fromMouse.mag() < sightRange * 1.5 && mouseX > 0 && mouseY > 0) {
    bird.turn.add(towards(bird, fromMouse).mult(3));
  }
}

// A small, limited turn that points the bird's flight towards a direction.
function towards(bird, direction) {
  return direction.copy().setMag(maxSpeed).sub(bird.velocity).limit(maxTurn);
}

function move(bird) {
  bird.velocity.add(bird.turn).limit(maxSpeed);
  bird.position.add(bird.velocity);

  // Fly off one edge and come back on the opposite one.
  if (bird.position.x < 0) bird.position.x += width;
  if (bird.position.x > width) bird.position.x -= width;
  if (bird.position.y < 0) bird.position.y += height;
  if (bird.position.y > height) bird.position.y -= height;
}

// A small triangle pointing the way the bird is flying.
function drawBird(bird) {
  push();
  translate(bird.position.x, bird.position.y);
  rotate(bird.velocity.heading());
  noStroke();
  fill(40, 15, 98);
  triangle(birdSize, 0, -birdSize * 0.7, birdSize * 0.45, -birdSize * 0.7, -birdSize * 0.45);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setScale();
  background(215, 45, 14);
}
