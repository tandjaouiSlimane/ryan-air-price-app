/**
 * Ryanair Explorer — Proxy Server
 * Node.js pur, aucune dépendance externe requise
 * Usage: node server.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// server.js
const PORT = process.env.PORT ;


// ─── MIME TYPES ──────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};

// ─── RYANAIR API PROXY ───────────────────────────────────────────────────────
const RYANAIR_BASE = 'www.ryanair.com';

const RYANAIR_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Origin': 'https://www.ryanair.com',
  'Referer': 'https://www.ryanair.com/',
  'Cache-Control': 'no-cache',
};

function proxyRyanair(apiPath, queryString, res) {
  const fullPath = queryString ? `${apiPath}?${queryString}` : apiPath;

  console.log(`[PROXY] → https://${RYANAIR_BASE}${fullPath}`);

  const options = {
    hostname: RYANAIR_BASE,
    path: fullPath,
    method: 'GET',
    headers: RYANAIR_HEADERS,
  };

  const req = https.request(options, (proxyRes) => {
    const chunks = [];

    proxyRes.on('data', chunk => chunks.push(chunk));
    proxyRes.on('end', () => {
      const buffer = Buffer.concat(chunks);
      let body;

      // Handle gzip/deflate/br
      const encoding = proxyRes.headers['content-encoding'];
      if (encoding === 'gzip' || encoding === 'deflate') {
        const zlib = require('zlib');
        try {
          body = zlib.gunzipSync(buffer).toString('utf8');
        } catch(e) {
          try { body = zlib.inflateSync(buffer).toString('utf8'); } catch(e2) {
            body = buffer.toString('utf8');
          }
        }
      } else if (encoding === 'br') {
        const zlib = require('zlib');
        try {
          body = zlib.brotliDecompressSync(buffer).toString('utf8');
        } catch(e) { body = buffer.toString('utf8'); }
      } else {
        body = buffer.toString('utf8');
      }

      const status = proxyRes.statusCode;
      console.log(`[PROXY] ← ${status} (${body.length} bytes)`);

      res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end(body);
    });
  });

  req.on('error', (e) => {
    console.error('[PROXY] Erreur:', e.message);
    res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Proxy error: ' + e.message }));
  });

  req.setTimeout(15000, () => {
    req.destroy();
    res.writeHead(504, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Timeout' }));
  });

  req.end();
}

// ─── HTTP SERVER ─────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const querystring = parsed.search ? parsed.search.slice(1) : '';

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // ── PROXY ROUTES ────────────────────────────────────────────────────────
  if (pathname.startsWith('/api/ryanair/')) {
    // Strip /api/ryanair prefix and forward to Ryanair
    const apiPath = pathname.replace('/api/ryanair', '');
    return proxyRyanair(apiPath, querystring, res);
  }
  // ── ROBOTS.TXT / SITEMAP.XML ─────────────────────────────────────────────
  if (pathname === '/robots.txt') {
    fs.readFile(path.join(__dirname, 'robots.txt'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
    return;
  }

  if (pathname === '/sitemap.xml') {
    fs.readFile(path.join(__dirname, 'sitemap.xml'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(data);
    });
    return;
  }
  // ── STATIC FILES ─────────────────────────────────────────────────────────
  let filePath;
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else {
    filePath = path.join(__dirname, 'public', pathname);
  }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║          RYANAIR EXPLORER — PROXY            ║
╠══════════════════════════════════════════════╣
║  Serveur démarré sur http://localhost:${PORT}   ║
║                                              ║
║  Ouvrez votre navigateur et allez sur :      ║
║  → http://localhost:${PORT}                     ║
║                                              ║
║  Ctrl+C pour arrêter le serveur              ║
╚══════════════════════════════════════════════╝
`);
});
