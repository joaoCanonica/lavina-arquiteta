// Servidor estático de dist/ com os MESMOS cabeçalhos do vercel.json (CSP, HSTS etc.).
// Serve para testar a CSP e as requisições de rede como em produção (o astro preview não
// aplica cabeçalhos). Uso: node scripts/servir-dist.mjs [--porta 4350] [--dist dist]
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const args = process.argv.slice(2);
const arg = (n, p) => (args.includes(n) ? args[args.indexOf(n) + 1] : p);
const PORTA = Number(arg('--porta', '4350'));
const DIST = path.resolve(arg('--dist', 'dist'));

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const cabecalhos = vercel.headers.find((h) => h.source === '/(.*)')?.headers ?? [];
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

const achar = (url) => {
  const limpo = decodeURIComponent(new URL(url, 'http://x').pathname);
  const p = path.join(DIST, limpo);
  if (!p.startsWith(DIST)) return null;
  if (existsSync(p) && statSync(p).isFile()) return p;
  const indice = path.join(p, 'index.html');
  if (existsSync(indice)) return indice;
  if (existsSync(p + '.html')) return p + '.html';
  return null;
};

createServer((req, res) => {
  for (const h of cabecalhos) res.setHeader(h.key, h.value);
  let arq = achar(req.url ?? '/');
  let status = 200;
  if (!arq) {
    arq = path.join(DIST, '404.html');
    status = 404;
  }
  const tamanho = statSync(arq).size;
  const tipo = TIPOS[path.extname(arq)] ?? 'application/octet-stream';
  // Faixas (vídeo): o navegador pede Range ao tocar.
  const faixa = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (faixa && status === 200) {
    const ini = faixa[1] ? Number(faixa[1]) : 0;
    const fim = faixa[2] ? Number(faixa[2]) : tamanho - 1;
    res.writeHead(206, {
      'Content-Type': tipo,
      'Content-Range': `bytes ${ini}-${fim}/${tamanho}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': fim - ini + 1,
    });
    createReadStream(arq, { start: ini, end: fim }).pipe(res);
    return;
  }
  res.writeHead(status, {
    'Content-Type': tipo,
    'Content-Length': tamanho,
    'Accept-Ranges': 'bytes',
  });
  if (req.method === 'HEAD') res.end();
  else createReadStream(arq).pipe(res);
}).listen(PORTA, () => console.log(`servir-dist: http://localhost:${PORTA} (${DIST})`));
