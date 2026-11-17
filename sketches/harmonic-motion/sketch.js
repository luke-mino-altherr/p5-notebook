// HARMONIC MOTION, after John Whitney (1960s–70s)
//
// ABOUT: John Whitney is often called the father of computer animation. In films like
// "Permutations" (1968) and "Arabesque" (1975) he moved hundreds of points at related
// speeds, a bit like musical harmony, and filmed the patterns that appeared.
//
// THE IDEA: dot number 1 goes round once, dot 2 goes round twice as fast, dot 3 three
// times as fast... Most of the time they look scattered, but every so often the speeds
// "agree" and the dots snap into spirals, stars and petals.
//
// TRY CHANGING: DOTS, TEMPO, or the shape in the dot's position (swap sin and cos,
// or multiply the radius by sin(angle * 3) for flower shapes).

const DOTS = 160;
const TEMPO = 0.0006; // how fast time passes: try 0.002 to see patterns change quickly

let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  background(240, 40, 6);
}

function draw() {
  // A see-through background leaves short trails behind the dots.
  background(240, 40, 6, 18);
  translate(width / 2, height / 2);

  const maxRadius = min(width, height) * 0.45;

  for (let i = 1; i <= DOTS; i++) {
    // The key line: each dot's angle is time multiplied by its own number.
    const angle = time * i;
    const radius = (i / DOTS) * maxRadius;

    const x = cos(angle) * radius;
    const y = sin(angle) * radius;

    fill((i * 2 + frameCount * 0.3) % 360, 60, 100, 90);
    circle(x, y, map(i, 1, DOTS, 3, 8) * (maxRadius / 400));
  }

  time += TEMPO;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(240, 40, 6);
}
