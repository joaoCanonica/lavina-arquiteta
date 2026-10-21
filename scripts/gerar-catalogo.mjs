// Gera docs/MIDIA_CATALOGO.md a partir do manifesto, dos pares, dos quadros
// e dos derivados em public/media/ (pesos medidos). Rode depois de media:prepare.
// Uso: pnpm media:catalogo
import { existsSync, statSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ler = async (p) => JSON.parse(await readFile(p, 'utf8'));
const manifesto = await ler('media.manifest.json');
const pares = await ler('docs/dados/pares.json');
const stills = await ler('docs/dados/stills.json');
const indice = await ler('public/media/midia.json');
const fonte = await ler('docs/dados/midia-legendas.json');

const kb = (b) => `${Math.round(b / 1024)} KB`;
const mb = (b) => `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
const peso = (url) => {
  const p = path.join('public', url);
  return existsSync(p) ? statSync(p).size : 0;
};
const num = (arquivo) => arquivo.match(/SaveClip\.App_(\d+)_/)?.[1] ?? arquivo;
const esc = (s) =>
  String(s ?? '')
    .replace(/\|/g, '/')
    .replace(/\n/g, ' ');

const linhas = [];
const L = (s = '') => linhas.push(s);

const originais = manifesto.registros.filter((r) => r.tipo !== 'quadro-de-video');
const totalOrig = originais.reduce((s, r) => s + r.bytes, 0);

L('# Catálogo de mídia');
L();
L(
  'Gerado por `pnpm media:catalogo` a partir de `media.manifest.json`, `docs/dados/pares.json`, `docs/dados/stills.json` e dos derivados em `public/media/` (pesos medidos). Não edite à mão.',
);
L();
L('## Resumo');
L();
const nat = {};
for (const r of manifesto.registros) nat[r.natureza] = (nat[r.natureza] ?? 0) + 1;
L(
  `- **${originais.length} originais** em \`media-originais/\` (${mb(totalOrig)}), todos com natureza; **${stills.quadros.length} quadros de vídeo** extraídos.`,
);
L(
  `- Naturezas no manifesto: ${Object.entries(nat)
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ')}.`,
);
L(
  `- Não publicáveis: ${manifesto.registros
    .filter((r) => !r.publicavel)
    .map((r) => `\`${r.id}\``)
    .join(', ')}.`,
);
L(
  '- Rótulos de natureza no site: ' +
    Object.values(manifesto.rotulos)
      .filter((x) => !/Não usar|Documentação/.test(x))
      .map((x) => `"${x}"`)
      .join(', ') +
    '.',
);
L();

// Pesos dos derivados
let derivImg = 0;
let maiorImg = 0;
for (const img of Object.values(indice.imagens)) {
  for (const f of img.fontes) derivImg += peso(f.avif) + peso(f.webp);
  maiorImg += peso(img.fontes.at(-1).avif);
}
const origImg = originais
  .filter((r) => r.tipo === 'imagem' && indice.imagens[r.id])
  .reduce((s, r) => s + r.bytes, 0);
L('### Pesos antes / depois');
L();
L(
  '| Grupo | Originais | Derivados (maior largura, AVIF) | Todos os derivados (AVIF + WebP, todas as larguras) |',
);
L('| --- | --- | --- | --- |');
L(
  `| Imagens publicáveis (${Object.keys(indice.imagens).length}) | ${mb(origImg)} | ${mb(maiorImg)} | ${mb(derivImg)} |`,
);
let origVid = 0;
let vid720 = 0;
let todosVid = 0;
for (const r of originais.filter((x) => x.tipo === 'video')) {
  origVid += r.bytes;
  const v = indice.videos[r.id];
  vid720 += peso(v.fontes[0].mp4);
  for (const f of v.fontes) todosVid += peso(f.mp4) + peso(f.webm);
  todosVid += peso(v.poster);
}
L(
  `| Vídeos (6) | ${mb(origVid)} | ${mb(vid720)} (MP4 720p) | ${mb(todosVid)} (MP4 + WebM, 720 e 540, pôsteres) |`,
);
L();

// Por projeto
L('## Por projeto');
const grupos = new Map();
for (const r of manifesto.registros) {
  const g =
    r.projeto ??
    (r.tipo === 'video' ? 'videos' : r.natureza === 'retrato' ? 'pessoas' : 'marca-e-outros');
  if (!grupos.has(g)) grupos.set(g, []);
  grupos.get(g).push(r);
}
const tituloProjeto = Object.fromEntries(fonte.projetos.map((p) => [p.id, p.titulo]));
Object.assign(tituloProjeto, {
  'living-jantar-parametrico': 'Living e jantar com painel paramétrico (só em vídeo)',
  'quarto-closet': 'Quarto e closet reformados (só em vídeo)',
  'cozinha-farmhouse': 'Cozinha farmhouse (só em vídeo)',
  videos: 'Vídeos',
  pessoas: 'Pessoas',
  'marca-e-outros': 'Marca, documentação e "não usar"',
});
for (const [g, regs] of grupos) {
  L();
  L(`### ${tituloProjeto[g] ?? g}`);
  L();
  L('| id | arquivo | natureza | uso | problemas | edições | original | derivado (maior) |');
  L('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of regs) {
    const d = indice.imagens[r.id] ?? indice.quadros[r.id];
    const maior = d
      ? `${d.largura}px · ${kb(peso(d.fontes.at(-1).avif))}`
      : r.tipo === 'video'
        ? 'ver vídeos'
        : '—';
    const ed = r.edicoes.map((e) => e.tipo).join(', ') || '—';
    const orig = r.bytes ? kb(r.bytes) : `quadro ${r.tempo}s`;
    L(
      `| \`${r.id}\` | ${esc(r.tipo === 'quadro-de-video' ? r.arquivo : num(r.arquivo))} | ${r.rotulo}${r.publicavel ? '' : ' (não publicar)'} | ${esc(r.uso).slice(0, 90)} | ${esc(r.problemas.join('; ')) || '—'} | ${ed} | ${orig} | ${maior} |`,
    );
  }
}

// Pares
L();
L('## Pares');
L();
L(`Método: ${pares.metodo}`);
L();
L('Folhas de contato (A · B · sobreposição a 50%) em `docs/capturas/pares/`.');
L();
L('| par | tipo | A → B | semelhança | proporção | resíduo | área mantida A / B | nota |');
L('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const p of pares.pares.filter((x) => x.aceito)) {
  L(
    `| \`${p.id}\` | ${p.tipo} | ${p.a.numero} → ${p.b.numero} | ${p.semelhanca} | ${p.proporcao} | ${p.alinhamento.residuoPct}% da altura | ${p.alinhamento.areaMantidaA} / ${p.alinhamento.areaMantidaB} | ${esc(p.nota)} |`,
  );
}
L();
L('Rejeitados:');
L();
for (const p of pares.pares.filter((x) => !x.aceito)) {
  L(`- \`${p.id}\` (${p.a.numero} → ${p.b.numero}, ${p.semelhanca}): ${p.nota}`);
}

// Vídeos
L();
L('## Vídeos');
L();
L('| vídeo | original | MP4 720 | WebM 720 | MP4 540 | WebM 540 | pôster |');
L('| --- | --- | --- | --- | --- | --- | --- |');
for (const r of originais.filter((x) => x.tipo === 'video')) {
  const v = indice.videos[r.id];
  const [a, b] = v.fontes;
  L(
    `| \`${r.arquivo}\` (${r.duracao}) | ${mb(r.bytes)} | ${mb(peso(a.mp4))} | ${mb(peso(a.webm))} | ${mb(peso(b.mp4))} | ${mb(peso(b.webm))} | ${kb(peso(v.poster))} |`,
  );
}
const loop = indice.videos.loopAbertura;
L();
L(
  `Loop mudo da abertura: \`${loop.origem.video}\` de ${loop.origem.inicio}s a ${loop.origem.inicio + loop.origem.duracao}s, recortado a 720×${loop.origem.altura} (acima do monograma em marca d'água) e reduzido a 540 px. MP4 ${kb(peso(loop.mp4))} · WebM ${kb(peso(loop.webm))} · pôster ${kb(peso(loop.poster))}.`,
);

// Quadros
L();
L('## Quadros de vídeo');
L();
L(`Método: ${stills.metodo} Folhas de contato em \`docs/capturas/stills/\`.`);
L();
L('| id | vídeo | tempo | natureza | o quê | recorte |');
L('| --- | --- | --- | --- | --- | --- |');
for (const q of stills.quadros) {
  L(
    `| \`${q.id}\` | ${q.video} | ${q.tempo}s | ${q.natureza} | ${q.descricao} | ${q.recorte ? esc(q.motivoRecorte) : '—'} |`,
  );
}

const pedir = await readFile('docs/dados/pedir-ao-joao.md', 'utf8');
L();
L('## O que pedir ao João');
L();
L(pedir.trim());
L();

await writeFile('docs/MIDIA_CATALOGO.md', linhas.join('\n'));
console.log('docs/MIDIA_CATALOGO.md gravado');
