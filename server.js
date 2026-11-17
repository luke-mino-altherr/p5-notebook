// Local dev server for the notebook. No dependencies: `npm start`.
//  - serves the gallery and every sketch
//  - builds the sketch list (/sketches.json) on every request
//  - reloads open pages when you save a file
//  - lets the "Save thumbnail" button write thumbnail.png into a sketch folder
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanSketches } from './scripts/scan.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const MAX_THUMBNAIL_BYTES = 25 * 1024 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.obj': 'text/plain; charset=utf-8',
  '.glsl': 'text/plain; charset=utf-8',
  '.frag': 'text/plain; charset=utf-8',
  '.vert': 'text/plain; charset=utf-8',
};

// Injected into every HTML page. Gallery previews run inside iframes and skip the
// live-reload connection: browsers only allow ~6 open connections per host.
const DEV_SNIPPET = `<script>
window.__P5NB_DEV = true;
if (window.self === window.top) {
  new EventSource('/__reload').onmessage = () => location.reload();
}
</script>`;

// ---- live reload ------------------------------------------------------------

const reloadClients = new Set();
let reloadTimer;

function ignoredChange(file) {
  return (
    !file ||
    /(^|[\\/])(\.git|node_modules)([\\/]|$)/.test(file) ||
    /(^|[\\/])thumbnail\.[a-z]+$/i.test(file) ||
    file === 'sketches.json' ||
    file.endsWith('.DS_Store')
  );
}

fs.watch(ROOT, { recursive: true }, (_event, file) => {
  if (ignoredChange(file)) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of reloadClients) client.write('data: reload\n\n');
  }, 100);
});

function handleReload(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
  });
  res.write(': connected\n\n');
  reloadClients.add(res);
  req.on('close', () => reloadClients.delete(res));
}

// ---- thumbnails -------------------------------------------------------------

function handleThumbnail(req, res, slug) {
  const dir = path.join(ROOT, 'sketches', slug);
  if (!/^[\w-]+$/.test(slug) || !fs.existsSync(path.join(dir, 'index.html'))) {
    return send(res, 404, 'No such sketch');
  }

  const chunks = [];
  let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > MAX_THUMBNAIL_BYTES) {
      send(res, 413, 'Thumbnail too large');
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => {
    if (res.writableEnded) return;
    const match = Buffer.concat(chunks).toString('utf8').trim().match(/^data:image\/png;base64,(.+)$/);
    if (!match) return send(res, 400, 'Expected a PNG data URL');
    fs.writeFileSync(path.join(dir, 'thumbnail.png'), Buffer.from(match[1], 'base64'));
    console.log(`Saved sketches/${slug}/thumbnail.png`);
    send(res, 200, 'Saved');
  });
}

// ---- static files -----------------------------------------------------------

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';

  if (ext === '.html') {
    let html = fs.readFileSync(filePath, 'utf8');
    html = /<head[^>]*>/i.test(html)
      ? html.replace(/<head[^>]*>/i, (tag) => tag + DEV_SNIPPET)
      : DEV_SNIPPET + html;
    return send(res, 200, html, type);
  }

  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return send(res, 400, 'Bad URL');
  }

  if (pathname === '/__reload') return handleReload(req, res);
  if (pathname === '/sketches.json') {
    return send(res, 200, JSON.stringify(scanSketches(ROOT)), MIME['.json']);
  }
  if (req.method === 'POST' && pathname.startsWith('/__thumbnail/')) {
    return handleThumbnail(req, res, pathname.slice('/__thumbnail/'.length));
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');

  let filePath = path.join(ROOT, pathname);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return send(res, 403, 'Forbidden');
  if (!fs.existsSync(filePath)) return send(res, 404, `Not found: ${pathname}`);

  if (fs.statSync(filePath).isDirectory()) {
    // Sketches load files with relative paths, so folders need a trailing slash.
    if (!pathname.endsWith('/')) {
      res.writeHead(301, { Location: pathname + '/' + url.search });
      return res.end();
    }
    filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath)) return send(res, 404, `No index.html in ${pathname}`);
  }

  serveFile(res, filePath);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try: PORT=3001 npm start`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`\n  p5 notebook running at http://localhost:${PORT}\n`);
  console.log('  Pages reload automatically when you save. Press Ctrl+C to stop.\n');
});
