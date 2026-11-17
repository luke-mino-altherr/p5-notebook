// PROCESS STUDY, after Casey Reas (2004 onwards)
//
// ABOUT: Casey Reas co-created Processing, the language p5.js grew out of. In his
// "Process" series each artwork starts as a few sentences in plain English describing
// simple elements and how they behave. The software is just one way of carrying them out.
//
// THE IDEA (our own instructions, in the same spirit):
//   - Circles drift across the space in straight lines.
//   - While two circles overlap, draw a faint line between their centres.
//   - While a circle is touching another, it slowly turns.
// Nothing here says "make a pattern", yet one builds up from thousands of faint lines.
//
// TRY CHANGING: COUNT, the circle sizes, the line colour, or invent a new rule
// (e.g. circles speed up while touching). Write your rule in words first, then in code.

const COUNT = 90;
const LINE_ALPHA = 14; // how strong each line is: lower = softer, slower build-up

let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  restart();
}

function restart() {
  background(240, 238, 232);
  circles = [];
  const size = min(width, height);
  for (let i = 0; i < COUNT; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      r: random(size * 0.03, size * 0.12),
      heading: random(TWO_PI),
      speed: random(0.3, 1),
      turn: random([-1, 1]) * 0.01,
    });
  }
}

function draw() {
  // Draw: a line between every pair of overlapping circles.
  strokeWeight(1);
  for (let i = 0; i < circles.length; i++) {
    const a = circles[i];
    a.touching = false;
    for (let j = 0; j < i; j++) {
      const b = circles[j];
      if (dist(a.x, a.y, b.x, b.y) < a.r + b.r) {
        a.touching = b.touching = true;
        stroke(30, 30, 40, LINE_ALPHA);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  // Move: straight ahead, turning only while touching. Wrap around the edges.
  for (const c of circles) {
    if (c.touching) c.heading += c.turn;
    c.x = (c.x + cos(c.heading) * c.speed + width) % width;
    c.y = (c.y + sin(c.heading) * c.speed + height) % height;
  }
}

function mousePressed() {
  restart();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restart();
}
