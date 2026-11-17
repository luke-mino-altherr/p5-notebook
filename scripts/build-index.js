// Writes sketches.json so the gallery works on any static host (GitHub Pages, Netlify, ...).
// The dev server (`npm start`) generates this on the fly, so you only need this to publish.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanSketches } from './scan.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sketches = scanSketches(ROOT);

fs.writeFileSync(path.join(ROOT, 'sketches.json'), JSON.stringify(sketches, null, 2) + '\n');
console.log(`Wrote sketches.json with ${sketches.length} sketch${sketches.length === 1 ? '' : 'es'}.`);
