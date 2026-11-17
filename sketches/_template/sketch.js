// setup() runs once when the sketch starts.
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// draw() runs over and over, about 60 times a second.
function draw() {
  background(17);

  noStroke();
  fill(255);
  circle(mouseX, mouseY, 40);
}

// Keep the canvas filling the window when it is resized.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
