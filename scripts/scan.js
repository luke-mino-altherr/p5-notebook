// Finds every sketch in sketches/ and reads its title, description and thumbnail.
// A sketch is any folder with an index.html whose name doesn't start with "_" or ".".
import fs from 'node:fs';
import path from 'node:path';

const THUMBNAILS = ['thumbnail.png', 'thumbnail.jpg', 'thumbnail.jpeg', 'thumbnail.gif', 'thumbnail.webp'];

function readTag(html, regex) {
  const match = html.match(regex);
  return match ? decodeEntities(match[1].trim()) : '';
}

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// Most recent change to any file directly inside the sketch folder.
function lastModified(dir) {
  return fs.readdirSync(dir).reduce((latest, name) => {
    const { mtimeMs } = fs.statSync(path.join(dir, name));
    return Math.max(latest, mtimeMs);
  }, 0);
}

export function scanSketches(root) {
  const sketchesDir = path.join(root, 'sketches');
  if (!fs.existsSync(sketchesDir)) return [];

  return fs
    .readdirSync(sketchesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !/^[_.]/.test(entry.name))
    .filter((entry) => fs.existsSync(path.join(sketchesDir, entry.name, 'index.html')))
    .map((entry) => {
      const dir = path.join(sketchesDir, entry.name);
      const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
      return {
        slug: entry.name,
        title: readTag(html, /<title>([\s\S]*?)<\/title>/i) || entry.name,
        description: readTag(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i),
        // Optional: example sketches about art history set this so the gallery can order them by date.
        year: readTag(html, /<meta\s+name=["']year["']\s+content=["']([^"']*)["']/i) || null,
        thumbnail: THUMBNAILS.find((name) => fs.existsSync(path.join(dir, name))) || null,
        updated: Math.round(lastModified(dir)),
      };
    })
    .sort((a, b) => b.updated - a.updated);
}
