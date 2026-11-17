// GESTURE LOOPS, in the spirit of Zach Lieberman (2010s to today)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

const TRAIL = 70;     // how many points of the gesture are visible at once
const MAX_LOOPS = 12; // older loops disappear when there are more than this

let loops = [];
let current = null; // the gesture being drawn right now

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  strokeCap(ROUND);
  addDemoLoop();
}

// Until someone draws, show a made-up gesture (a figure of eight) so the
// sketch is never empty. It disappears as soon as you draw your own.
function addDemoLoop() {
  const points = [];
  for (let i = 0; i < 240; i++) {
    const a = (i / 240) * TWO_PI;
    points.push({
      x: width / 2 + sin(a) * width * 0.3,
      y: height / 2 + sin(a * 2) * height * 0.2,
    });
  }
  loops = [{ points, born: frameCount, hue: 200, demo: true }];
}

function draw() {
  background(250, 30, 8);

  for (const loop of loops) drawLoop(loop);

  // Show the gesture you're drawing as a plain white line.
  if (current) {
    stroke(0, 0, 100, 60);
    strokeWeight(2);
    noFill();
    beginShape();
    for (const p of current.points) vertex(p.x, p.y);
    endShape();
  }

  if (loops.length === 1 && loops[0].demo && !current) {
    noStroke();
    fill(0, 0, 100, 40);
    textAlign(CENTER, CENTER);
    textSize(min(width, height) / 30);
    text('draw something', width / 2, height * 0.9);
  }
}

function drawLoop(loop) {
  const n = loop.points.length;
  // The playhead moves through the recorded points, one per frame, and wraps around.
  const head = (frameCount - loop.born) % n;

  // Draw from the tail to the head, so the bright head ends up on top.
  for (let k = min(TRAIL, n - 1) - 1; k >= 0; k--) {
    const a = loop.points[(head - k + n) % n];
    const b = loop.points[(head - k - 1 + n) % n];
    if (b.jump) continue; // don't join the end of the gesture back to its start

    const fade = 1 - k / TRAIL;
    const breathe = 1 + 0.5 * sin(frameCount * 0.05 + loop.hue);
    // Fade by getting darker rather than see-through, so the segments blend smoothly.
    stroke((loop.hue + k * 3) % 360, 70, 100 * fade);
    strokeWeight(fade * 14 * breathe);
    line(a.x, a.y, b.x, b.y);
  }
}

function mousePressed() {
  loops = loops.filter((loop) => !loop.demo);
  current = { points: [{ x: mouseX, y: mouseY }] };
}

function mouseDragged() {
  if (current) current.points.push({ x: mouseX, y: mouseY });
}

function mouseReleased() {
  if (current && current.points.length > 5) {
    current.points[current.points.length - 1].jump = true;
    loops.push({ points: current.points, born: frameCount, hue: random(360) });
    if (loops.length > MAX_LOOPS) loops.shift();
  }
  current = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (loops.length === 1 && loops[0].demo) addDemoLoop();
}
