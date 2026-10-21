// Gera media.manifest.json a partir de docs/dados/midia-legendas.json,
// dos complementos da sessão 1 (renders novos, marca, logo antigo),
// das correções (docs/dados/correcoes.json), dos pares e dos quadros de vídeo.
// Uso: pnpm media:manifesto
import { createHash } from 'node:crypto';
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ORIG = 'media-originais';
const ler = async (p) => JSON.parse(await readFile(p, 'utf8'));

const fonte = await ler('docs/dados/midia-legendas.json');
const correcoes = await ler('docs/dados/correcoes.json');
const pares = await ler('docs/dados/pares.json');
const stills = await ler('docs/dados/stills.json');

const ROTULO = {
  render: 'Imagem 3D do projeto',
  executado: 'Obra executada',
  antes: 'Antes',
  depois: 'Depois',
  video: 'Vídeo',
  retrato: 'Retrato',
  marca: 'Marca',
  documentacao: 'Documentação interna',
  'nao-usar': 'Não usar',
};

const FOTO_A_CONFIRMAR = 'Fotografia: autoria a confirmar (publicada por @lavina.co.arq)';

// Arquivo → post de origem (nos projetos com mais de um post).
const POST_POR_ARQUIVO = {
  588442716: 'DSGdwDDj4Kv',
  598761174: 'DSGdwDDj4Kv',
  710959395: 'DZIFaXyFq8k',
  713283758: 'DZIFaXyFq8k',
  713843664: 'DZIFaXyFq8k',
  719918476: 'DZh0O6uFqkV',
  723099267: 'DZh0O6uFqkV',
};
const POST_PADRAO = {
  'consultorio-jonny-arruda': 'DUUHxO4DhqK',
  'cozinha-jc': 'DZ5PcHNDj3R',
};

// Arquivos novos que não estão no JSON de legendas (prompt da sessão 1).
const NOVOS = {
  'consultorio-jonny-arruda': [
    [
      'SaveClip.App_588442716_17869031958483108_6881159161144977863_n.jpg',
      'render',
      'mesa oval de pedra + estantes iluminadas (vista da esquerda)',
    ],
    [
      'SaveClip.App_598761174_17869031967483108_7242716098048022537_n.jpg',
      'render',
      'vista frontal (estantes, janela, mesa)',
    ],
  ],
  'cozinha-jc': [
    [
      'SaveClip.App_710959395_17890720767483108_2756011782472961855_n.jpg',
      'render',
      'cristaleira + mesa e pendentes',
    ],
    [
      'SaveClip.App_713283758_17890720743483108_4251243534598581787_n.jpg',
      'render',
      'vista frontal: janela, cooktop, torre de fornos, refrigerador',
    ],
    [
      'SaveClip.App_713843664_17890720755483108_2170458033472249592_n.jpg',
      'render',
      'painel ripado com TV, ilha com banquetas, fornos',
    ],
    [
      'SaveClip.App_719918476_17892033012483108_4323779363077244549_n.jpg',
      'render',
      'TV, mesa posta, cozinha ao fundo',
    ],
    [
      'SaveClip.App_723099267_17892033003483108_4387115283769733568_n.jpg',
      'render',
      'detalhe da bancada, cooktop e frontão curvo',
    ],
  ],
};

const numero = (arquivo) => arquivo.match(/SaveClip\.App_(\d+)_/)?.[1] ?? null;

async function infoArquivo(arquivo) {
  const p = path.join(ORIG, arquivo);
  const buf = await readFile(p);
  const st = await stat(p);
  const ext = path.extname(arquivo).toLowerCase();
  let dimensoes = null;
  if (['.jpg', '.png', '.svg'].includes(ext)) {
    const m = await sharp(buf).metadata();
    dimensoes = { largura: m.width, altura: m.height };
  }
  return {
    bytes: st.size,
    sha256: createHash('sha256').update(buf).digest('hex'),
    dimensoes,
  };
}

function postDe(projeto, codigo) {
  const p = projeto.posts.find((x) => x.codigo === codigo);
  const l = projeto.legendas.find((x) => x.post === codigo);
  return {
    post: p ? { codigo: p.codigo, data: p.data, url: p.url } : null,
    legenda: l?.texto ?? null,
  };
}

function parsePost(texto) {
  const m = texto?.match(/^([A-Za-z0-9_-]{8,})\s*(?:\(([^)]*)\))?/);
  if (!m) return null;
  return { codigo: m[1], data: m[2] ?? null, url: `https://www.instagram.com/p/${m[1]}/` };
}

// Vídeo → projeto (os três últimos só existem em vídeo).
const PROJETO_DO_VIDEO = {
  'mudanca-cozinha.mp4': 'cozinha-jc',
  'apresentacao-principal.mp4': 'living-jantar-painel',
  'mostrando-quarto.mp4': 'quarto-closet',
  'novo-modelo.mp4': 'cozinha-farmhouse',
};

const registros = [];
const contadores = {};
const slug = (base) => {
  contadores[base] = (contadores[base] ?? 0) + 1;
  return `${base}-${String(contadores[base]).padStart(2, '0')}`;
};

// Projetos
for (const projeto of fonte.projetos) {
  const lista = [
    ...(NOVOS[projeto.id] ?? []).map(([arquivo, estado, obs]) => ({
      arquivo,
      estado,
      obs,
      novo: true,
    })),
    ...projeto.arquivos,
  ];
  for (const a of lista) {
    const estado = a.estado.split(' ')[0];
    const natureza = ['antes', 'depois', 'executado', 'render'].includes(estado)
      ? estado
      : 'executado';
    const num = numero(a.arquivo);
    const codigo = POST_POR_ARQUIVO[num] ?? POST_PADRAO[projeto.id] ?? projeto.posts[0].codigo;
    const { post, legenda } = postDe(projeto, codigo);
    const render = natureza === 'render';
    const problemas = [];
    if (/selo/i.test(a.estado))
      problemas.push('selo "ANTES & DEPOIS" queimado sobre a foto: publicar só recortado');
    registros.push({
      id: slug(`${projeto.id}-${natureza}`),
      arquivo: a.arquivo,
      tipo: 'imagem',
      projeto: projeto.id,
      natureza,
      rotulo: ROTULO[natureza],
      autoriaImagem: render ? 'Imagem 3D: Renata Nürnberg' : FOTO_A_CONFIRMAR,
      creditoProjeto: projeto.creditos,
      post,
      legenda,
      descricao: a.obs,
      uso: projeto.uso,
      problemas,
      edicoes: [],
      publicavel: true,
      origemDado: a.novo
        ? 'sessão 1 (arquivo novo, fora do JSON de legendas)'
        : 'docs/dados/midia-legendas.json',
      ...(await infoArquivo(a.arquivo)),
    });
  }
}

// Pessoas
for (const p of fonte.pessoas) {
  const avatar = p.arquivo === 'foto-amanda.jpg';
  const problemas = [];
  if (/queimad/.test(p.o_que)) problemas.push('nome e palavras-chave queimados na imagem');
  if (avatar) problemas.push('150×150 px: resolução insuficiente para o site');
  registros.push({
    id: slug(`retrato-${p.quem.toLowerCase().split(' ')[0]}`),
    arquivo: p.arquivo,
    tipo: 'imagem',
    projeto: null,
    natureza: 'retrato',
    rotulo: ROTULO.retrato,
    pessoa: p.quem,
    autoriaImagem: p.credito === '—' ? 'a confirmar' : p.credito,
    creditoProjeto: null,
    post: parsePost(p.post),
    legenda: null,
    legendaObs: p.legenda,
    descricao: p.o_que,
    uso: avatar ? 'não usar: só referência' : 'retrato da equipe',
    problemas,
    edicoes: [],
    publicavel: !avatar,
    origemDado: 'docs/dados/midia-legendas.json',
    ...(await infoArquivo(p.arquivo)),
  });
}

// Vídeos
for (const v of fonte.videos) {
  registros.push({
    id: `video-${v.arquivo.replace(/\.mp4$/, '')}`,
    arquivo: v.arquivo,
    tipo: 'video',
    projeto: PROJETO_DO_VIDEO[v.arquivo] ?? null,
    natureza: 'video',
    rotulo: ROTULO.video,
    autoriaImagem: 'Vídeo publicado por @lavina.co.arq; autoria da gravação a confirmar',
    creditoProjeto: 'Lavina | Coletivo de Arquitetura',
    post: parsePost(v.post),
    legenda: v.legenda,
    descricao: `${v.quem}. ${v.extra ?? ''}`.trim(),
    uso: v.uso,
    problemas: [],
    edicoes: [],
    publicavel: true,
    duracao: v.dur,
    origemDado: 'docs/dados/midia-legendas.json',
    ...(await infoArquivo(v.arquivo)),
  });
}

// Marca, documentação e logo antigo
const extras = [
  {
    id: 'marca-logo',
    arquivo: 'lavina-logo.svg',
    tipo: 'vetor',
    natureza: 'marca',
    descricao: 'logo Lavina reconstruído em vetor',
    uso: 'marca do site (cabeçalho, entrada, favicon)',
    publicavel: true,
  },
  {
    id: 'doc-logo-comparacao',
    arquivo: 'lavina-logo-comparacao.jpg',
    tipo: 'imagem',
    natureza: 'documentacao',
    descricao: 'comparação do logo original com a reconstrução vetorial',
    uso: 'só documentação; não vai ao site',
    publicavel: false,
  },
  {
    id: 'nao-usar-logo-antigo',
    arquivo: 'Captura de tela de 2026-10-21 11-58-49.png',
    tipo: 'imagem',
    natureza: 'nao-usar',
    descricao: 'captura de tela com o logo ANTIGO',
    uso: 'não usar',
    publicavel: false,
  },
];
for (const e of extras) {
  registros.push({
    projeto: null,
    rotulo: ROTULO[e.natureza],
    autoriaImagem: e.natureza === 'marca' ? 'Lavina | Coletivo de Arquitetura' : '—',
    creditoProjeto: null,
    post: null,
    legenda: null,
    problemas: e.natureza === 'nao-usar' ? ['logo antigo: não publicar'] : [],
    edicoes: [],
    origemDado: 'sessão 1',
    ...e,
    ...(await infoArquivo(e.arquivo)),
  });
}

// Problemas de qualidade e correções registradas
const porNumero = new Map(registros.map((r) => [numero(r.arquivo), r]));
for (const [num, texto] of Object.entries(correcoes.qualidade)) {
  porNumero.get(num)?.problemas.push(texto);
}
for (const c of correcoes.edicoes) {
  const r = porNumero.get(c.numero);
  if (!r) throw new Error(`correção para arquivo inexistente: ${c.numero}`);
  r.edicoes.push(...c.edicoes);
  if (c.exibicaoMaxima) r.exibicaoMaxima = c.exibicaoMaxima;
}
for (const r of registros) {
  const proj = correcoes.corPorProjeto[r.projeto];
  if (proj && ['executado', 'depois'].includes(r.natureza)) {
    r.edicoes.unshift({ tipo: 'cor', ...proj, escopo: 'derivado' });
  }
}

// Pares (referência)
for (const p of pares.pares.filter((x) => x.aceito)) {
  for (const lado of ['a', 'b']) {
    const r = porNumero.get(p[lado].numero);
    r.pares = [...(r.pares ?? []), p.id];
  }
}

// Quadros de vídeo
for (const s of stills.quadros) {
  const video = registros.find((r) => r.arquivo === s.video);
  registros.push({
    id: s.id,
    arquivo: `${s.video}#t=${s.tempo}`,
    tipo: 'quadro-de-video',
    projeto: s.projeto ?? video.projeto,
    natureza: s.natureza,
    rotulo: s.natureza === 'executado' ? 'Obra executada (quadro de vídeo)' : 'Quadro de vídeo',
    autoriaImagem: video.autoriaImagem,
    creditoProjeto: video.creditoProjeto,
    post: video.post,
    legenda: null,
    descricao: s.descricao,
    uso: 'tamanho médio (720 px de largura nativa; sem upscale)',
    problemas: s.problemas ?? [],
    edicoes: s.recorte ? [{ tipo: 'recorte', ...s.recorte, motivo: s.motivoRecorte }] : [],
    publicavel: true,
    origemDado: 'docs/dados/stills.json',
    video: video.id,
    tempo: s.tempo,
  });
}

const manifesto = {
  $schema: './docs/dados/media.manifest.schema.json',
  versao: 1,
  gerado: new Date().toISOString().slice(0, 10),
  rotulos: ROTULO,
  registros,
};
await writeFile('media.manifest.json', JSON.stringify(manifesto, null, 2) + '\n');
const arquivos = new Set(
  registros.filter((r) => r.tipo !== 'quadro-de-video').map((r) => r.arquivo),
);
console.log(`manifesto: ${registros.length} registros (${arquivos.size} arquivos originais)`);
