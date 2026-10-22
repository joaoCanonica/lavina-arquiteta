// Valida o JSON-LD gerado em dist/ contra o vocabulário oficial do schema.org (release 30.1,
// baixado do repositório schemaorg/schemaorg no GitHub e guardado em .cache/).
// Confere: cada @type existe, não está substituído (supersededBy) nem na área "pending";
// cada propriedade existe, não está substituída e aceita o tipo do nó (domainIncludes,
// considerando as superclasses); valores de objeto com @type compatível (rangeIncludes).
// Também relata o que o schema.org diz hoje de ProfessionalService (justificativa em SEO.md).
// Uso: pnpm build && node scripts/validar-schema.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const VERSAO = '30.1';
const URL_VOCAB = `https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/${VERSAO}/schemaorg-current-https.jsonld`;
const CACHE = `.cache/schemaorg-${VERSAO}.jsonld`;

if (!existsSync(CACHE)) {
  await mkdir('.cache', { recursive: true });
  const r = await fetch(URL_VOCAB).catch((e) => ({ ok: false, statusText: e.message }));
  if (!r.ok) {
    console.error(`validar-schema: não consegui baixar o vocabulário (${r.statusText}).`);
    process.exit(2);
  }
  await writeFile(CACHE, await r.text());
}
const vocab = JSON.parse(readFileSync(CACHE, 'utf8'))['@graph'];
const curto = (id) => String(id).replace(/^schema:/, '');
const lista = (v) => [].concat(v ?? []).map((x) => curto(x['@id'] ?? x));
const termos = new Map(vocab.map((t) => [curto(t['@id']), t]));
const ehClasse = (t) => [].concat(t['@type']).includes('rdfs:Class');
const ehProp = (t) => [].concat(t['@type']).includes('rdf:Property');

const ancestrais = (tipo, vistos = new Set()) => {
  if (vistos.has(tipo)) return vistos;
  vistos.add(tipo);
  for (const pai of lista(termos.get(tipo)?.['rdfs:subClassOf'])) ancestrais(pai, vistos);
  return vistos;
};

const htmls = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) return n === 'media' ? [] : htmls(p);
    return n.endsWith('.html') ? [p] : [];
  });

const erros = new Set();
const usados = new Map();
let blocos = 0;
function validar(no, arq) {
  if (Array.isArray(no)) return no.forEach((n) => validar(n, arq));
  if (!no || typeof no !== 'object') return;
  const tipos = [].concat(no['@type'] ?? []);
  for (const t of tipos) {
    const def = termos.get(t);
    usados.set(t, (usados.get(t) ?? 0) + 1);
    if (!def || !ehClasse(def)) erros.add(`${arq}: tipo inexistente "${t}"`);
    else {
      if (def['schema:supersededBy']) erros.add(`${arq}: tipo substituído "${t}"`);
      if (lista(def['schema:isPartOf']).some((x) => x.includes('pending')))
        erros.add(`${arq}: tipo da área pending "${t}"`);
    }
  }
  const linhagem = new Set(tipos.flatMap((t) => [...ancestrais(t)]));
  for (const [k, v] of Object.entries(no)) {
    if (k.startsWith('@')) continue;
    const def = termos.get(k);
    if (!def || !ehProp(def)) {
      erros.add(`${arq}: propriedade inexistente "${k}"`);
      continue;
    }
    if (def['schema:supersededBy']) erros.add(`${arq}: propriedade substituída "${k}"`);
    const dominio = lista(def['schema:domainIncludes']);
    if (tipos.length && !dominio.some((d) => linhagem.has(d)))
      erros.add(
        `${arq}: "${k}" não se aplica a ${tipos.join('/')} (domínio: ${dominio.join(', ')})`,
      );
    const faixa = lista(def['schema:rangeIncludes']);
    for (const valor of [].concat(v)) {
      if (valor && typeof valor === 'object' && valor['@type']) {
        const lin = new Set([].concat(valor['@type']).flatMap((t) => [...ancestrais(t)]));
        if (!faixa.some((f) => lin.has(f)))
          erros.add(`${arq}: "${k}" não aceita ${valor['@type']} (aceita: ${faixa.join(', ')})`);
      }
    }
    validar(v, arq);
  }
}

for (const arq of htmls('dist')) {
  const html = readFileSync(arq, 'utf8');
  for (const [, corpo] of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    blocos++;
    const dado = JSON.parse(corpo);
    validar(dado['@graph'] ?? dado, path.relative('dist', arq));
  }
}

const ps = termos.get('ProfessionalService');
console.log(`validar-schema: vocabulário schema.org ${VERSAO} · ${blocos} blocos JSON-LD em dist/`);
console.log(`  tipos usados: ${[...usados.keys()].sort().join(', ')}`);
console.log(
  `  ProfessionalService hoje: "${String(ps?.['rdfs:comment'] ?? '')
    .replace(/\s+/g, ' ')
    .slice(0, 220)}…"`,
);
if (erros.size) {
  console.log(`  ${erros.size} erro(s):`);
  [...erros].slice(0, 40).forEach((e) => console.log(`    ✗ ${e}`));
  process.exit(1);
}
console.log(
  '  ✓ todos os tipos e propriedades existem no schema.org e se aplicam aos tipos usados',
);
