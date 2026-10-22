// Verifica os links internos do HTML gerado em dist/: cada href "/..." precisa existir
// (arquivo ou pasta com index.html) e cada "#id" precisa existir na página de destino.
// Rotas ainda não construídas e já previstas no menu ficam listadas à parte (não falham).
// Uso: pnpm build && node scripts/verificar-links.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = 'dist';
// Rotas previstas e ainda não construídas (nenhuma desde a sessão 6C).
const PLANEJADAS = new Set([]);

const htmls = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) return n === 'media' ? [] : htmls(p);
    return n.endsWith('.html') ? [p] : [];
  });

const rotaDe = (arq) =>
  '/' +
  path
    .relative(DIST, arq)
    .replace(/index\.html$/, '')
    .replace(/\\/g, '/');
const arquivoDe = (rota) => {
  const limpa = decodeURIComponent(rota);
  const p = path.join(DIST, limpa);
  if (limpa.endsWith('/')) return path.join(p, 'index.html');
  if (existsSync(p) && statSync(p).isFile()) return p;
  return existsSync(path.join(p, 'index.html')) ? path.join(p, 'index.html') : null;
};
const ids = new Map();
const idsDe = (arq) => {
  if (!ids.has(arq))
    ids.set(
      arq,
      new Set(
        parse(readFileSync(arq, 'utf8'))
          .querySelectorAll('[id]')
          .map((e) => e.id),
      ),
    );
  return ids.get(arq);
};

let total = 0;
const quebrados = [];
const planejados = new Map();
for (const arq of htmls(DIST)) {
  const doc = parse(readFileSync(arq, 'utf8'));
  for (const a of doc.querySelectorAll('a[href], link[href]')) {
    const href = a.getAttribute('href') ?? '';
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    if (a.tagName === 'LINK' && !href.startsWith('/')) continue;
    total++;
    const [semHash, hash] = href.split('#');
    const rota = (semHash ?? '').split('?')[0] ?? '';
    const destino = rota === '' ? arq : arquivoDe(rota);
    if (!destino || !existsSync(destino)) {
      if (PLANEJADAS.has(rota)) {
        planejados.set(rota, (planejados.get(rota) ?? 0) + 1);
        continue;
      }
      quebrados.push(`${rotaDe(arq)} → ${href}`);
      continue;
    }
    if (hash && destino.endsWith('.html') && !idsDe(destino).has(hash))
      quebrados.push(`${rotaDe(arq)} → ${href} (âncora inexistente)`);
  }
}

console.log(`verificar-links: ${htmls(DIST).length} páginas, ${total} links internos`);
for (const [r, n] of planejados) console.log(`  planejada (sessão 6C): ${r} (${n} links)`);
if (quebrados.length) {
  console.log(`  ${quebrados.length} quebrados:`);
  quebrados.forEach((q) => console.log('   ', q));
  process.exit(1);
}
console.log('  0 quebrados');
