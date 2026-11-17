// Creates a new sketch from sketches/_template.
//   npm run new "Rainy Window"
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKETCHES = path.join(ROOT, 'sketches');
const TEMPLATE = path.join(SKETCHES, '_template');

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let title = process.argv.slice(2).join(' ').trim();
if (!title) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  title = (await rl.question('Name your sketch: ')).trim();
  rl.close();
}

const slug = slugify(title);
if (!slug) {
  console.error('Please give the sketch a name with at least one letter or number.');
  process.exit(1);
}

const target = path.join(SKETCHES, slug);
if (fs.existsSync(target)) {
  console.error(`A sketch called "${slug}" already exists at sketches/${slug}/`);
  process.exit(1);
}

fs.cpSync(TEMPLATE, target, { recursive: true });
const indexPath = path.join(target, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8').replace(
  /<title>[\s\S]*?<\/title>/i,
  `<title>${escapeHtml(title)}</title>`
);
fs.writeFileSync(indexPath, html);

console.log(`
Created sketches/${slug}/

  Edit:  sketches/${slug}/sketch.js
  View:  http://localhost:3000/sketches/${slug}/   (run "npm start" first)
`);
