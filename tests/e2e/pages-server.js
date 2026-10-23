// GitHub Pages と同じように、存在しないパスには 404 ステータスで 404.html を返す e2e 用の静的サーバです。
// vite preview は SPA 用にどのパスにも index.html を返すので、Pages での直リンクやリロードのバグを検出できません。
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const [root = 'dist-e2e', port = '4173'] = process.argv.slice(2);
const BASE = '/ShuumulatorWeb/';
const DIR = resolve(root);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function findFile(pathname) {
  if (!pathname.startsWith(BASE)) {
    return null;
  }
  try {
    let file = resolve(DIR, `.${sep}${decodeURIComponent(pathname.slice(BASE.length))}`);
    if (file !== DIR && !file.startsWith(DIR + sep)) {
      return null;
    }
    if ((await stat(file)).isDirectory()) {
      file = join(file, 'index.html');
    }
    return (await stat(file)).isFile() ? file : null;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost');
  if (pathname === BASE.slice(0, -1)) {
    response.writeHead(301, { Location: BASE }).end();
    return;
  }
  const file = await findFile(pathname);
  const served = file ?? join(DIR, '404.html');
  response
    .writeHead(file ? 200 : 404, { 'Content-Type': TYPES[extname(served)] ?? 'application/octet-stream' })
    .end(await readFile(served));
}).listen(Number(port), 'localhost');
