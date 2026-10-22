// Auditoria de SEO e GEO sobre o HTML gerado em dist/:
//  - por página pública: title (≤ 60, único), description (≤ 155, única), canonical absoluto a
//    partir de SITE_URL e igual à rota, Open Graph e Twitter completos, imagem OG existente e
//    1200×630;
//  - JSON-LD: JSON válido, @context schema.org, tipos e propriedades exigidos (LocalBusiness,
//    WebSite, WebPage, BreadcrumbList, CreativeWork nos projetos), areaServed só com as cidades
//    da config, @id referenciados existentes, NENHUM AggregateRating/Review;
//  - GEO: parágrafo [data-geo] com 40–60 palavras nos projetos e no /processo;
//  - noindex enquanto não houver domínio (ou em preview) e robots.txt coerente;
//  - sitemap.xml: URLs absolutas, todas existem, todas as páginas públicas presentes;
//  - links internos (scripts/verificar-links.mjs).
// Grava docs/capturas/seo/audit-seo.json. Sai com 1 se houver erro.
// Uso: pnpm build && pnpm audit-seo
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import { config } from '../src/config/index.ts';
import { SITE_URL, paginas, robosIA } from '../src/config/seo.ts';

const DIST = 'dist';
const erros = [];
const avisos = [];
const linhas = [];
const erro = (rota, msg) => erros.push(`${rota}: ${msg}`);
const indexavel =
  process.env.LAVINA_MODO === 'producao' && config.seo.dominio.estado === 'confirmado';

const arquivoDaRota = (rota) => path.join(DIST, rota, 'index.html');
const conta = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const titulos = new Map();
const descricoes = new Map();
const cidades = new Set(config.atuacao.cidades.map((c) => c.nome.valor));

// Percorre o JSON-LD inteiro procurando tipos proibidos e coletando @id.
function varrer(no, fn) {
  if (Array.isArray(no)) no.forEach((n) => varrer(n, fn));
  else if (no && typeof no === 'object') {
    fn(no);
    Object.values(no).forEach((v) => varrer(v, fn));
  }
}

for (const [rota, meta] of Object.entries(paginas)) {
  const arq = arquivoDaRota(rota);
  if (!existsSync(arq)) {
    erro(rota, 'página não gerada');
    continue;
  }
  const doc = parse(readFileSync(arq, 'utf8'));
  const m = (sel, attr = 'content') => doc.querySelector(sel)?.getAttribute(attr) ?? '';
  const titulo = doc.querySelector('title')?.text.trim() ?? '';
  const descricao = m('meta[name="description"]');
  const canonical = m('link[rel="canonical"]', 'href');

  if (!titulo) erro(rota, 'sem <title>');
  if (titulo.length > 60) erro(rota, `title com ${titulo.length} caracteres (> 60)`);
  if (titulos.has(titulo)) erro(rota, `title repetido de ${titulos.get(titulo)}`);
  titulos.set(titulo, rota);
  if (descricao.length < 70 || descricao.length > 155)
    erro(rota, `description com ${descricao.length} caracteres (70–155)`);
  if (descricoes.has(descricao)) erro(rota, `description repetida de ${descricoes.get(descricao)}`);
  descricoes.set(descricao, rota);
  if (canonical !== `${SITE_URL}${rota}`) erro(rota, `canonical "${canonical}"`);

  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:locale'])
    if (!m(`meta[property="${p}"]`)) erro(rota, `sem ${p}`);
  for (const n of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'])
    if (!m(`meta[name="${n}"]`)) erro(rota, `sem ${n}`);
  if (m('meta[property="og:url"]') !== canonical) erro(rota, 'og:url difere do canonical');
  const ogImg = m('meta[property="og:image"]');
  if (!ogImg.startsWith(`${SITE_URL}/og/`)) erro(rota, `og:image fora de SITE_URL: ${ogImg}`);
  const ogArq = path.join(DIST, ogImg.replace(SITE_URL, ''));
  if (!existsSync(ogArq)) erro(rota, `imagem OG ausente (${ogArq})`);
  else {
    const md = await sharp(ogArq).metadata();
    if (md.width !== 1200 || md.height !== 630) erro(rota, `OG ${md.width}×${md.height}`);
  }

  // noindex enquanto não houver domínio confirmado (ou em preview).
  const robots = m('meta[name="robots"]');
  if (!indexavel && !/noindex/.test(robots)) erro(rota, 'sem noindex (preview ou sem domínio)');
  if (indexavel && /noindex/.test(robots)) erro(rota, 'noindex em produção com domínio');

  // JSON-LD
  const blocos = doc.querySelectorAll('script[type="application/ld+json"]');
  if (!blocos.length) erro(rota, 'sem JSON-LD');
  const tipos = new Set();
  const ids = new Set();
  const refs = new Set();
  for (const b of blocos) {
    let dado;
    try {
      dado = JSON.parse(b.text);
    } catch (e) {
      erro(rota, `JSON-LD inválido: ${e.message}`);
      continue;
    }
    if (dado['@context'] !== 'https://schema.org')
      erro(rota, '@context diferente de https://schema.org');
    varrer(dado, (no) => {
      const t = [].concat(no['@type'] ?? []);
      t.forEach((x) => tipos.add(x));
      if (t.some((x) => /AggregateRating|Review/.test(x))) erro(rota, `tipo proibido: ${t}`);
      if ('aggregateRating' in no || 'review' in no)
        erro(rota, 'propriedade de avaliação no JSON-LD');
      if (no['@id'] && Object.keys(no).length > 1) ids.add(no['@id']);
      else if (no['@id']) refs.add(no['@id']);
    });
    const grafo = dado['@graph'] ?? [dado];
    const achar = (tipo) => grafo.find((n) => n['@type'] === tipo);
    const lb = achar('LocalBusiness');
    if (!lb) erro(rota, 'sem LocalBusiness');
    else {
      for (const k of [
        'name',
        'alternateName',
        'address',
        'geo',
        'telephone',
        'openingHoursSpecification',
        'sameAs',
        'founder',
        'areaServed',
        'url',
      ])
        if (!(k in lb)) erro(rota, `LocalBusiness sem ${k}`);
      if (![].concat(lb.alternateName).includes('Amanda Lavina Arquitetura'))
        erro(rota, 'alternateName sem "Amanda Lavina Arquitetura"');
      if (lb.founder?.['@type'] !== 'Person' || lb.founder?.jobTitle !== 'Arquiteta')
        erro(rota, 'founder deve ser Person com jobTitle "Arquiteta"');
      const servidas = (lb.areaServed ?? []).map((a) => a.name);
      if (servidas.length !== cidades.size || servidas.some((c) => !cidades.has(c)))
        erro(rota, `areaServed fora das cidades reais: ${servidas.join(', ')}`);
      if (!lb.address?.streetAddress || !lb.address?.postalCode) erro(rota, 'endereço incompleto');
      if (typeof lb.geo?.latitude !== 'number') erro(rota, 'geo sem latitude numérica');
    }
    if (!achar('WebSite')) erro(rota, 'sem WebSite');
    const wp = achar('WebPage');
    if (!wp || wp.url !== canonical)
      erro(rota, 'WebPage ausente ou com url diferente do canonical');
    if (rota !== '/') {
      const bc = achar('BreadcrumbList');
      if (!bc) erro(rota, 'sem BreadcrumbList');
      else {
        const itens = bc.itemListElement ?? [];
        itens.forEach((it, i) => {
          if (it.position !== i + 1) erro(rota, 'BreadcrumbList fora de ordem');
          if (!String(it.item).startsWith(SITE_URL)) erro(rota, 'item da trilha não absoluto');
        });
        if (itens.at(-1)?.item !== canonical) erro(rota, 'último item da trilha ≠ página');
      }
    }
    if (/^\/projetos\/[^/]+\/$/.test(rota)) {
      const cw = achar('CreativeWork');
      if (!cw) erro(rota, 'projeto sem CreativeWork');
      else {
        if (!cw.creator) erro(rota, 'CreativeWork sem creator');
        if (!cw.name || !cw.image) erro(rota, 'CreativeWork sem name ou image');
      }
    }
  }
  for (const r of refs) if (!ids.has(r)) erro(rota, `@id referenciado e não definido: ${r}`);

  // GEO
  const geo = doc.querySelector('[data-geo]');
  if (/^\/projetos\/[^/]+\/$/.test(rota) || rota === '/processo/') {
    if (!geo) erro(rota, 'sem parágrafo citável [data-geo]');
    else {
      const n = conta(geo.text);
      if (n < 40 || n > 60) erro(rota, `parágrafo citável com ${n} palavras (40–60)`);
    }
  }
  linhas.push({
    rota,
    titulo: titulo.length,
    descricao: descricao.length,
    tipos: [...tipos].sort(),
    geo: geo ? conta(geo.text) : null,
  });
  void meta;
}

// Páginas fora do mapa (404, internas): noindex sempre e fora do sitemap.
for (const arq of ['404.html', '_sistema/index.html']) {
  const p = path.join(DIST, arq);
  if (existsSync(p) && !/<meta name="robots" content="noindex/.test(readFileSync(p, 'utf8')))
    erro(arq, 'sem noindex');
}

// sitemap.xml
const sitemap = existsSync(path.join(DIST, 'sitemap.xml'))
  ? readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
  : '';
if (
  !sitemap.startsWith('<?xml') ||
  !sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9')
)
  erro('sitemap.xml', 'ausente ou sem o namespace do protocolo');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
for (const u of locs) {
  if (!u.startsWith(SITE_URL + '/')) erro('sitemap.xml', `URL fora de SITE_URL: ${u}`);
  else if (!existsSync(arquivoDaRota(u.slice(SITE_URL.length))))
    erro('sitemap.xml', `URL sem página: ${u}`);
}
for (const r of Object.keys(paginas))
  if (!locs.includes(SITE_URL + r)) erro('sitemap.xml', `falta ${r}`);
if (locs.some((u) => /\/(_sistema|_pendencias|404)/.test(u)))
  erro('sitemap.xml', 'rota interna no sitemap');

// robots.txt
const robots = existsSync(path.join(DIST, 'robots.txt'))
  ? readFileSync(path.join(DIST, 'robots.txt'), 'utf8')
  : '';
if (!robots) erro('robots.txt', 'ausente');
else if (!indexavel && !/User-agent: \*\s*\nDisallow: \/\s*$/m.test(robots))
  erro('robots.txt', 'preview/sem domínio deve bloquear tudo');
else if (indexavel) {
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) erro('robots.txt', 'sem Sitemap');
  for (const r of robosIA) if (!robots.includes(`User-agent: ${r}`)) erro('robots.txt', `sem ${r}`);
}

// Vocabulário schema.org (tipos e propriedades existentes e aplicáveis).
const schema = spawnSync('node', ['scripts/validar-schema.mjs'], { encoding: 'utf8' });
if (schema.status === 2)
  avisos.push(
    'validar-schema: vocabulário do schema.org inacessível (rede); validação estrutural feita, vocabulário não.',
  );
else if (schema.status !== 0)
  erro('schema.org', schema.stdout.trim().split('\n').slice(-6).join(' | '));
const schemaResumo = schema.stdout.trim().split('\n')[0] ?? '';

// Links internos.
const links = spawnSync('node', ['scripts/verificar-links.mjs'], { encoding: 'utf8' });
if (links.status !== 0) erro('links', links.stdout.trim().split('\n').slice(-5).join(' | '));

if (!indexavel)
  avisos.push(
    `noindex ativo (modo ${process.env.LAVINA_MODO === 'producao' ? 'produção' : 'preview'}; domínio: ${config.seo.dominio.estado}). robots.txt bloqueia tudo.`,
  );

await mkdir('docs/capturas/seo', { recursive: true });
await writeFile(
  'docs/capturas/seo/audit-seo.json',
  JSON.stringify(
    { SITE_URL, indexavel, paginas: linhas, sitemap: locs.length, erros, avisos },
    null,
    2,
  ) + '\n',
);

console.log(
  `audit-seo: ${linhas.length} páginas · sitemap com ${locs.length} URLs · SITE_URL ${SITE_URL}`,
);
if (schemaResumo) console.log(`  ${schemaResumo}`);
for (const l of linhas)
  console.log(
    `  ${l.rota.padEnd(38)} title ${String(l.titulo).padStart(2)} · desc ${String(l.descricao).padStart(3)}${l.geo ? ` · GEO ${l.geo} palavras` : ''} · ${l.tipos.join(', ')}`,
  );
avisos.forEach((a) => console.log(`  aviso: ${a}`));
if (erros.length) {
  console.log(`  ${erros.length} erro(s):`);
  erros.forEach((e) => console.log(`    ✗ ${e}`));
  process.exit(1);
}
console.log(
  '  ✓ verde: metadados, OG, JSON-LD (estrutura e vocabulário schema.org), GEO, sitemap, robots e links',
);
