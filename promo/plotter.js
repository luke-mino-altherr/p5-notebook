// Shared helpers for the promo images: workshop details, seeded randomness and SVG drawing.
// Edit EVENT, then run ./promo/render.sh to export the PNGs.

const EVENT = {
  name: 'Generative Art Jam',
  tool: 'p5.js',
  date: 'Wed 18 Nov',
  time: '6–7:30pm',
  place: 'Remote + in person',
};
EVENT.title = `${EVENT.name}: ${EVENT.tool}`;

// Fill any element marked data-event="date" (etc.) with the matching detail.
for (const node of document.querySelectorAll('[data-event]')) {
  node.textContent = EVENT[node.dataset.event];
}

// Random numbers that come out the same every time for the same seed (mulberry32).
function seeded(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SVG_NS = 'http://www.w3.org/2000/svg';

// Make an SVG drawing area inside `parent`, measured in its own units (w by h).
function makeSvg(parent, w, h) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  parent.appendChild(svg);
  return svg;
}

// Add one SVG element, e.g. add(svg, 'circle', { cx: 10, cy: 10, r: 5 }).
function add(svg, name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  svg.appendChild(node);
  return node;
}

const pointList = (points) => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

function line(svg, x1, y1, x2, y2, attrs = {}) {
  return add(svg, 'line', { x1, y1, x2, y2, ...attrs });
}

function polyline(svg, points, attrs = {}) {
  return add(svg, 'polyline', { points: pointList(points), ...attrs });
}

function polygon(svg, points, attrs = {}) {
  return add(svg, 'polygon', { points: pointList(points), ...attrs });
}

function circle(svg, cx, cy, r, attrs = {}) {
  return add(svg, 'circle', { cx, cy, r, ...attrs });
}

// A square of side `size` centred on (cx, cy), turned by `angle` radians.
function square(svg, cx, cy, size, angle = 0, attrs = {}) {
  const h = size / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const corners = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([x, y]) => [
    cx + x * cos - y * sin,
    cy + x * sin + y * cos,
  ]);
  return polygon(svg, corners, attrs);
}

// A small triangle pointing along `angle`, like a bird or an arrow head.
function pointer(svg, x, y, size, angle, attrs = {}) {
  const tip = [x + Math.cos(angle) * size, y + Math.sin(angle) * size];
  const left = [x + Math.cos(angle + 2.5) * size * 0.7, y + Math.sin(angle + 2.5) * size * 0.7];
  const right = [x + Math.cos(angle - 2.5) * size * 0.7, y + Math.sin(angle - 2.5) * size * 0.7];
  return polygon(svg, [tip, left, right], { class: 'solid', ...attrs });
}

// A mouse cursor with its tip at (x, y).
function cursor(svg, x, y, size, attrs = {}) {
  const s = size / 20;
  const shape = [[0, 0], [0, 17], [4.5, 13], [7.5, 20], [10, 19], [7, 12.5], [13, 12.5]];
  return polygon(svg, shape.map(([px, py]) => [x + px * s, y + py * s]), { class: 'cursor', ...attrs });
}

// A Schotter-style grid: neat at disorder 0, scattered and turned as disorder grows.
// disorderAt(col, row) returns how messy each square should be (0 = perfectly neat).
function schotterGrid(svg, rand, { left, top, columns, rows, size, gap = 0, disorderAt, attrs }) {
  const squares = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const d = disorderAt(col, row);
      const cx = left + col * (size + gap) + size / 2 + (rand() * 2 - 1) * d * size * 0.5;
      const cy = top + row * (size + gap) + size / 2 + (rand() * 2 - 1) * d * size * 0.5;
      const angle = (rand() * 2 - 1) * d * (Math.PI / 4);
      squares.push({ cx, cy, angle, col, row });
      square(svg, cx, cy, size, angle, attrs ? attrs(col, row) : {});
    }
  }
  return squares;
}
