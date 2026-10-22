// CSP por hash a partir do HTML gerado em dist/ + cabeçalhos de segurança do deploy (Vercel).
//  - script-src: 'self' + sha256 de cada <script> inline (sem 'unsafe-inline', sem 'unsafe-eval');
//  - style-src-elem: 'self' + sha256 de cada <style> inline;
//  - style-src-attr: 'unsafe-inline' (atributos style="" com variáveis CSS e LQIP; ver docs);
//  - nenhum atributo on*="" é aceito (o script falha se achar um).
// Grava vercel.json (cabeçalhos para todas as rotas). Na Vercel, o vercel.json é lido ANTES do
// build: por isso ele é versionado, e o postbuild roda com --verificar (falha se algum hash do
// build não estiver no vercel.json, o que causaria violação de CSP em produção).
// Preview e produção geram HTML diferente (faixa "em revisão"): o vercel.json precisa cobrir os dois.
// Uso: pnpm csp  (= node scripts/gerar-csp.mjs --ambos: constrói os dois modos em .csp/ e regrava)
//      node scripts/gerar-csp.mjs [--dist <pasta> ...]    (regrava a partir de pastas já construídas)
//      node scripts/gerar-csp.mjs --verificar             (confere dist/; sai 1 se desatualizado)
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ARQ = 'vercel.json';
const args = process.argv.slice(2);
const verificar = args.includes('--verificar');
let pastas = args.flatMap((a, i) => (args[i - 1] === '--dist' ? [a] : []));
if (args.includes('--ambos')) {
  pastas = [];
  for (const modo of ['preview', 'producao']) {
    const destino = `.csp/${modo}`;
    const r = spawnSync('pnpm', ['exec', 'astro', 'build', '--outDir', destino], {
      stdio: 'inherit',
      env: { ...process.env, LAVINA_MODO: modo },
    });
    if (r.status !== 0) process.exit(r.status ?? 1);
    pastas.push(destino);
  }
}
if (!pastas.length) pastas = ['dist'];

const htmls = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) return n === 'media' ? [] : htmls(p);
    return n.endsWith('.html') ? [p] : [];
  });
const sha = (txt) => `'sha256-${createHash('sha256').update(txt, 'utf8').digest('base64')}'`;

for (const p of pastas)
  if (!existsSync(p)) {
    console.error(`gerar-csp: ${p}/ ausente (rode pnpm build)`);
    process.exit(1);
  }

const scripts = new Set();
const estilos = new Set();
const problemas = [];
for (const arq of pastas.flatMap(htmls)) {
  const html = readFileSync(arq, 'utf8');
  for (const [, attrs, corpo] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(attrs)) continue;
    const tipo = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
    // Blocos de dados (JSON-LD etc.) não executam: a CSP não se aplica a eles.
    if (tipo && !['module', 'text/javascript', 'application/javascript'].includes(tipo)) continue;
    scripts.add(sha(corpo));
  }
  for (const [, corpo] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
    estilos.add(sha(corpo));
  for (const [m] of html.matchAll(/<[a-z][^>]*\son[a-z]+\s*=/gi))
    problemas.push(`${arq}: atributo de evento inline (${m.slice(0, 60)}…)`);
  if (/href\s*=\s*["']\s*javascript:/i.test(html)) problemas.push(`${arq}: link javascript:`);
}
if (problemas.length) {
  console.error('gerar-csp: o HTML tem código inline que a CSP bloquearia:');
  problemas.forEach((p) => console.error('  ' + p));
  process.exit(1);
}

const ordenar = (s) => [...s].sort();
const csp = [
  "default-src 'self'",
  `script-src 'self' ${ordenar(scripts).join(' ')}`,
  `style-src-elem 'self' ${ordenar(estilos).join(' ')}`,
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  // Mapa do Google: só é inserido depois do consentimento "mapas".
  'frame-src https://www.google.com',
  "manifest-src 'self'",
  "worker-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  // O seletor de orçamento envia (GET) para o WhatsApp; wa.me redireciona para api.whatsapp.com.
  "form-action 'self' https://wa.me https://api.whatsapp.com",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const cabecalhos = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), autoplay=(self), browsing-topics=(), camera=(), display-capture=(), fullscreen=(self "https://www.google.com"), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Sem "preload" até o domínio definitivo estar no ar (decisão do deploy, sessão 9).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  headers: [{ source: '/(.*)', headers: cabecalhos }],
};
const novo = JSON.stringify(config, null, 2) + '\n';

if (verificar) {
  const atual = existsSync(ARQ) ? readFileSync(ARQ, 'utf8') : '';
  const cspAtual =
    (JSON.parse(atual || '{}').headers ?? [])
      .flatMap((h) => h.headers)
      .find((h) => h.key === 'Content-Security-Policy')?.value ?? '';
  const faltam = [...scripts, ...estilos].filter((h) => !cspAtual.includes(h));
  if (faltam.length) {
    console.error(
      `gerar-csp --verificar: ${faltam.length} hash(es) do build fora do vercel.json. Rode: node scripts/gerar-csp.mjs e versione o vercel.json.`,
    );
    process.exit(1);
  }
  console.log(
    `gerar-csp --verificar: ok (${scripts.size} scripts, ${estilos.size} estilos inline cobertos)`,
  );
} else {
  writeFileSync(ARQ, novo);
  console.log(
    `gerar-csp: ${ARQ} gravado · ${scripts.size} scripts e ${estilos.size} estilos inline por hash · CSP com ${csp.length} caracteres`,
  );
}
