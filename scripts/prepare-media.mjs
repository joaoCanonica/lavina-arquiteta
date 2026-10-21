// Gera os derivados de mídia em public/media/ (fora do git) a partir de
// media-originais/ + media.manifest.json + docs/dados/{pares,stills}.json.
// Idempotente: cada grupo de saída tem uma chave (hash do original + parâmetros);
// se a chave não mudou e os arquivos existem, nada é refeito.
// Uso: pnpm media:prepare [--capturas]   (--capturas grava antes/depois das correções)
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';
import { DESTINO, ORIG, caixa, originalPorNumero, quadro } from './lib/midia.mjs';

const exec = promisify(execFile);
const VERSAO = 3;
const VERSAO_VIDEO = 2; // muda quando a lógica de saída muda (invalida o cache)
const LARGURAS = [480, 800, 1200, 1600, 2400];
const CAPTURAS = process.argv.includes('--capturas');

const ler = async (p) => JSON.parse(await readFile(p, 'utf8'));
const manifesto = await ler('media.manifest.json');
const pares = await ler('docs/dados/pares.json');
const stills = await ler('docs/dados/stills.json');
const correcoes = await ler('docs/dados/correcoes.json');

const ARQ_CACHE = path.join(DESTINO, '.cache.json');
await mkdir(DESTINO, { recursive: true });
const cache = existsSync(ARQ_CACHE) ? await ler(ARQ_CACHE) : {};
const indice = { versao: VERSAO, imagens: {}, pares: {}, videos: {}, quadros: {} };
const contagem = { feitos: 0, cache: 0 };

const hash = (...partes) => {
  const h = createHash('sha256');
  for (const p of partes) h.update(typeof p === 'string' ? p : JSON.stringify(p));
  return h.digest('hex').slice(0, 16);
};
const hashArquivo = async (p) => hash(await readFile(p));

// Executa `gerar` só se a chave mudou ou faltam saídas; o resultado vai para o índice.
async function emCache(nome, chave, gerar) {
  const c = cache[nome];
  if (c && c.chave === chave && c.saidas.every((s) => existsSync(path.join(DESTINO, s)))) {
    contagem.cache++;
    return c.resultado;
  }
  const resultado = await gerar();
  cache[nome] = { chave, saidas: resultado.saidas, resultado };
  contagem.feitos++;
  // Grava o cache a cada grupo: uma execução interrompida não perde o que já fez.
  await writeFile(ARQ_CACHE, JSON.stringify(cache, null, 2));
  console.log('gerado', nome);
  return resultado;
}

// Executa tarefas com no máximo `n` simultâneas.
async function emParalelo(itens, n, fn) {
  const fila = [...itens.entries()];
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (fila.length) {
        const [i, item] = fila.shift();
        await fn(item, i);
      }
    }),
  );
}
const PARALELO = 4;

// ---------- correções ----------

// Correção de verticais (keystone): homografia que leva o ponto de fuga vertical ao
// infinito; `intensidade` < 1 corrige parcialmente. Aplica-se a TODA a imagem (global).
async function corrigirVerticais(buf, { pontoDeFuga, intensidade }) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const cx = W / 2;
  const cy = H / 2;
  const vx = pontoDeFuga[0] * W - cx;
  const vy = (pontoDeFuga[1] * H - cy) / intensidade;
  // Direta: x' = (x - (vx/vy)·y) / w, y' = y / w, w = 1 - y/vy  (coordenadas centradas)
  const direta = (x, y) => {
    const w = 1 - y / vy;
    return [(x - (vx / vy) * y) / w, y / w];
  };
  // Inversa: y = y'/(1 + y'/vy), w = 1 - y/vy, x = x'·w + (vx/vy)·y
  const inversa = (xp, yp) => {
    const y = yp / (1 + yp / vy);
    const w = 1 - y / vy;
    return [xp * w + (vx / vy) * y, y];
  };
  const cantos = [
    [-cx, -cy],
    [W - cx, -cy],
    [-cx, H - cy],
    [W - cx, H - cy],
  ].map(([x, y]) => direta(x, y));
  // Maior caixa interna (o quadrilátero é convexo).
  const x0 = Math.max(cantos[0][0], cantos[2][0]);
  const x1 = Math.min(cantos[1][0], cantos[3][0]);
  const y0 = Math.max(cantos[0][1], cantos[1][1]);
  const y1 = Math.min(cantos[2][1], cantos[3][1]);
  // Escala para manter a largura original (sem perder resolução útil).
  const escala = (x1 - x0) / W;
  const Wo = W;
  const Ho = Math.round((y1 - y0) / escala);
  const saida = Buffer.alloc(Wo * Ho * 3);
  for (let v = 0; v < Ho; v++) {
    const yp = y0 + v * escala;
    for (let u = 0; u < Wo; u++) {
      const xp = x0 + u * escala;
      const [xs, ys] = inversa(xp, yp);
      const sx = Math.min(W - 1.001, Math.max(0, xs + cx));
      const sy = Math.min(H - 1.001, Math.max(0, ys + cy));
      const ix = Math.floor(sx);
      const iy = Math.floor(sy);
      const fx = sx - ix;
      const fy = sy - iy;
      const o = (v * Wo + u) * 3;
      const p00 = (iy * W + ix) * 3;
      const p10 = p00 + 3;
      const p01 = p00 + W * 3;
      const p11 = p01 + 3;
      for (let c = 0; c < 3; c++) {
        const top = data[p00 + c] * (1 - fx) + data[p10 + c] * fx;
        const bot = data[p01 + c] * (1 - fx) + data[p11 + c] * fx;
        saida[o + c] = Math.round(top * (1 - fy) + bot * fy);
      }
    }
  }
  return sharp(saida, { raw: { width: Wo, height: Ho, channels: 3 } })
    .png()
    .toBuffer();
}

async function aplicarEdicoes(arquivo, edicoes, { geometria = true } = {}) {
  let buf = await sharp(arquivo).rotate().png().toBuffer();
  for (const e of edicoes) {
    if (e.tipo === 'cor') {
      const g = e.ganhoExposicao ?? 1;
      buf = await sharp(buf)
        .linear(
          e.multiplicadoresRGB.map((m) => m * g),
          [0, 0, 0],
        )
        .png()
        .toBuffer();
    } else if (e.tipo === 'verticais' && geometria) {
      buf = await corrigirVerticais(buf, e);
    } else if (e.tipo === 'recorte' && geometria) {
      const m = await sharp(buf).metadata();
      buf = await sharp(buf)
        .extract(caixa(e, m.width, m.height))
        .png()
        .toBuffer();
    }
  }
  return buf;
}

// ---------- saída de imagens ----------

async function lqip(buf) {
  const b = await sharp(buf).resize(20).blur(1).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${b.toString('base64')}`;
}

async function exportarLarguras(
  buf,
  pasta,
  base,
  { maxLargura = Infinity, larguras = LARGURAS } = {},
) {
  const m = await sharp(buf).metadata();
  const limite = Math.min(m.width, maxLargura);
  let alvo = larguras.filter((w) => w <= limite);
  if (!alvo.length || alvo.at(-1) < limite) alvo = [...alvo, limite]; // nunca acima do original
  await mkdir(path.join(DESTINO, pasta), { recursive: true });
  const saidas = [];
  const fontes = [];
  for (const w of alvo) {
    const r = sharp(buf).resize({ width: w, withoutEnlargement: true });
    const avif = path.join(pasta, `${base}-${w}.avif`);
    const webp = path.join(pasta, `${base}-${w}.webp`);
    await r.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(DESTINO, avif));
    await r.clone().webp({ quality: 74 }).toFile(path.join(DESTINO, webp));
    saidas.push(avif, webp);
    fontes.push({ largura: w, avif: `/media/${avif}`, webp: `/media/${webp}` });
  }
  return {
    largura: limite,
    altura: Math.round((m.height * limite) / m.width),
    fontes,
    lqip: await lqip(buf),
    saidas,
  };
}

// ---------- imagens do manifesto ----------

const publicaveis = manifesto.registros.filter(
  (r) => r.publicavel && r.tipo === 'imagem' && !['nao-usar', 'documentacao'].includes(r.natureza),
);
await emParalelo(publicaveis, PARALELO, async (r) => {
  const arquivo = path.join(ORIG, r.arquivo);
  const chave = hash(VERSAO, await hashArquivo(arquivo), r.edicoes, r.exibicaoMaxima ?? null);
  const res = await emCache(`img:${r.id}`, chave, async () => {
    const buf = await aplicarEdicoes(arquivo, r.edicoes);
    return exportarLarguras(buf, path.join('img', r.projeto ?? 'geral'), r.id, {
      maxLargura: r.exibicaoMaxima,
    });
  });
  indice.imagens[r.id] = {
    projeto: r.projeto,
    natureza: r.natureza,
    rotulo: r.rotulo,
    largura: res.largura,
    altura: res.altura,
    fontes: res.fontes,
    lqip: res.lqip,
  };
});

// Marca (SVG copiado como está).
{
  const r = manifesto.registros.find((x) => x.natureza === 'marca');
  const arquivo = path.join(ORIG, r.arquivo);
  await emCache('marca', hash(VERSAO, await hashArquivo(arquivo)), async () => {
    await mkdir(path.join(DESTINO, 'marca'), { recursive: true });
    await writeFile(path.join(DESTINO, 'marca', 'lavina-logo.svg'), await readFile(arquivo));
    return { saidas: ['marca/lavina-logo.svg'] };
  });
  indice.marca = '/media/marca/lavina-logo.svg';
}

// ---------- pares alinhados ----------

const registroPorNumero = (n) => manifesto.registros.find((r) => r.arquivo.includes(`_${n}_`));
for (const par of pares.pares.filter((p) => p.aceito)) {
  const lados = {};
  for (const lado of ['a', 'b']) {
    const reg = registroPorNumero(par[lado].numero);
    const arquivo = originalPorNumero(par[lado].numero);
    // Nos pares, só a correção de cor; a geometria é a do alinhamento (igual nos dois).
    const cor = reg.edicoes.filter((e) => e.tipo === 'cor');
    const rec = par.recorte[lado];
    const chave = hash(VERSAO, await hashArquivo(arquivo), cor, rec, par.recorte.larguraExportacao);
    lados[lado] = await emCache(`par:${par.id}:${lado}`, chave, async () => {
      const base = await aplicarEdicoes(arquivo, cor, { geometria: false });
      const buf = await sharp(base)
        .extract({ left: rec.x, top: rec.y, width: rec.largura, height: rec.altura })
        .resize({ width: par.recorte.larguraExportacao })
        .png()
        .toBuffer();
      return exportarLarguras(buf, path.join('pares', par.id), lado);
    });
    lados[lado] = { ...lados[lado], id: reg.id, natureza: reg.natureza, rotulo: reg.rotulo };
  }
  indice.pares[par.id] = {
    tipo: par.tipo,
    projeto: par.projeto,
    proporcao: par.proporcao,
    semelhanca: par.semelhanca,
    a: { ...lados.a, saidas: undefined },
    b: { ...lados.b, saidas: undefined },
  };
}

// ---------- quadros de vídeo ----------

await emParalelo(stills.quadros, PARALELO, async (q) => {
  const arquivo = path.join(ORIG, q.video);
  const chave = hash(VERSAO, await hashArquivo(arquivo), q.tempo, q.recorte ?? null);
  const res = await emCache(`quadro:${q.id}`, chave, async () => {
    let buf = await quadro(arquivo, q.tempo);
    if (q.recorte) {
      const m = await sharp(buf).metadata();
      buf = await sharp(buf)
        .extract(caixa(q.recorte, m.width, m.height))
        .png()
        .toBuffer();
    }
    return exportarLarguras(buf, 'quadros', q.id, { larguras: [480, 720] });
  });
  indice.quadros[q.id] = {
    video: q.video,
    projeto: q.projeto,
    natureza: q.natureza,
    largura: res.largura,
    altura: res.altura,
    fontes: res.fontes,
    lqip: res.lqip,
  };
});

// ---------- vídeos ----------

// Quadro do pôster: limpo (sem pessoa no centro quando possível; a legenda queimada
// de apresentacao-principal aparece em todos os quadros).
const POSTER = {
  'apresentacao-principal.mp4': 18.5,
  'falando-sobre-primeiro-contato.mp4': 1.5,
  'mostrando-quarto.mp4': 8,
  'mudanca-cozinha.mp4': 8,
  'novo-modelo.mp4': 10,
  'um-dia-no-escritorio.mp4': 1,
};
const TAMANHOS = [
  [720, 1280],
  [540, 960],
];

async function ffmpeg(args) {
  await exec('ffmpeg', ['-v', 'error', '-y', ...args], { maxBuffer: 16 * 1024 * 1024 });
}

for (const r of manifesto.registros.filter((x) => x.tipo === 'video')) {
  const arquivo = path.join(ORIG, r.arquivo);
  const nome = r.arquivo.replace(/\.mp4$/, '');
  const pasta = path.join('video', nome);
  const chave = hash(VERSAO_VIDEO, await hashArquivo(arquivo), POSTER[r.arquivo], TAMANHOS);
  const res = await emCache(`video:${nome}`, chave, async () => {
    await mkdir(path.join(DESTINO, pasta), { recursive: true });
    const saidas = [];
    const poster = path.join(pasta, 'poster.avif');
    await sharp(await quadro(arquivo, POSTER[r.arquivo]))
      .avif({ quality: 50 })
      .toFile(path.join(DESTINO, poster));
    saidas.push(poster);
    const fontes = [];
    for (const [w, h] of TAMANHOS) {
      const mp4 = path.join(pasta, `${nome}-${w}.mp4`);
      const webm = path.join(pasta, `${nome}-${w}.webm`);
      const escala = ['-vf', `scale=${w}:${h}:flags=lanczos`];
      if (w === 720) {
        // O original já é H.264 720×1280: remux sem perda, com faststart.
        await ffmpeg([
          '-i',
          arquivo,
          '-c',
          'copy',
          '-movflags',
          '+faststart',
          path.join(DESTINO, mp4),
        ]);
      } else {
        await ffmpeg([
          '-i',
          arquivo,
          ...escala,
          '-c:v',
          'libx264',
          '-preset',
          'slow',
          '-crf',
          '27',
          '-profile:v',
          'high',
          '-pix_fmt',
          'yuv420p',
          '-c:a',
          'aac',
          '-b:a',
          '96k',
          '-movflags',
          '+faststart',
          path.join(DESTINO, mp4),
        ]);
      }
      await ffmpeg([
        '-i',
        arquivo,
        ...escala,
        '-c:v',
        'libvpx-vp9',
        '-crf',
        w === 720 ? '37' : '39',
        '-b:v',
        '0',
        '-row-mt',
        '1',
        '-threads',
        '4',
        '-deadline',
        'good',
        '-cpu-used',
        '4',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'libopus',
        '-b:a',
        '80k',
        path.join(DESTINO, webm),
      ]);
      saidas.push(mp4, webm);
      fontes.push({ largura: w, altura: h, mp4: `/media/${mp4}`, webm: `/media/${webm}` });
    }
    return { saidas, poster: `/media/${poster}`, fontes };
  });
  indice.videos[r.id] = {
    poster: res.poster,
    fontes: res.fontes,
    legenda: r.legenda ? 'ver manifesto' : null,
  };
}

// Loop mudo da abertura: cozinha J|C, 7,0–13,5 s (plano aberto, sem legenda);
// recortado acima do monograma em marca d'água (rodapé). Sem áudio.
const LOOP = { video: 'mudanca-cozinha.mp4', inicio: 7.0, duracao: 6.5, altura: 1040 };
{
  const arquivo = path.join(ORIG, LOOP.video);
  const chave = hash(VERSAO, await hashArquivo(arquivo), LOOP);
  const res = await emCache('loop:abertura', chave, async () => {
    await mkdir(path.join(DESTINO, 'video', 'loop'), { recursive: true });
    const filtro = `crop=720:${LOOP.altura}:0:0,scale=540:-2:flags=lanczos`;
    const comum = [
      '-ss',
      String(LOOP.inicio),
      '-t',
      String(LOOP.duracao),
      '-i',
      arquivo,
      '-an',
      '-vf',
      filtro,
    ];
    const mp4 = 'video/loop/abertura.mp4';
    const webm = 'video/loop/abertura.webm';
    const poster = 'video/loop/abertura-poster.avif';
    await ffmpeg([
      ...comum,
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '26',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      path.join(DESTINO, mp4),
    ]);
    await ffmpeg([
      ...comum,
      '-c:v',
      'libvpx-vp9',
      '-crf',
      '38',
      '-b:v',
      '0',
      '-row-mt',
      '1',
      '-deadline',
      'good',
      '-cpu-used',
      '2',
      path.join(DESTINO, webm),
    ]);
    const quadroPoster = await quadro(arquivo, LOOP.inicio);
    await sharp(quadroPoster)
      .extract({ left: 0, top: 0, width: 720, height: LOOP.altura })
      .resize({ width: 540 })
      .avif({ quality: 50 })
      .toFile(path.join(DESTINO, poster));
    for (const s of [mp4, webm]) {
      const { size } = await stat(path.join(DESTINO, s));
      if (size > 1.5 * 1024 * 1024) throw new Error(`loop acima de 1,5 MB: ${s} (${size} B)`);
    }
    return {
      saidas: [mp4, webm, poster],
      mp4: `/media/${mp4}`,
      webm: `/media/${webm}`,
      poster: `/media/${poster}`,
    };
  });
  indice.videos.loopAbertura = { ...res, saidas: undefined, origem: LOOP };
}

// ---------- capturas das correções ----------

if (CAPTURAS) {
  const pasta = path.join('docs', 'capturas', 'correcoes');
  await mkdir(pasta, { recursive: true });
  for (const r of publicaveis.filter((x) => x.edicoes.length)) {
    const arquivo = path.join(ORIG, r.arquivo);
    const ALT = 700;
    const antes = await sharp(arquivo)
      .resize({ height: ALT })
      .toBuffer({ resolveWithObject: true });
    const depois = await sharp(await aplicarEdicoes(arquivo, r.edicoes))
      .resize({ height: ALT })
      .toBuffer({ resolveWithObject: true });
    const G = 12;
    await sharp({
      create: {
        width: antes.info.width + depois.info.width + G * 3,
        height: ALT + G * 2,
        channels: 3,
        background: '#1C1A18',
      },
    })
      .composite([
        { input: antes.data, top: G, left: G },
        { input: depois.data, top: G, left: antes.info.width + G * 2 },
      ])
      .jpeg({ quality: 80 })
      .toFile(path.join(pasta, `${r.id}.jpg`));
  }
  console.log('capturas das correções em', pasta);
}

// ---------- trava: nada "não usar" publicado ----------

const proibidos = manifesto.registros
  .filter((r) => !r.publicavel || r.natureza === 'nao-usar')
  .map((r) => r.id);
for (const id of proibidos) {
  if (indice.imagens[id]) throw new Error(`mídia não publicável no índice: ${id}`);
}

// Limpa do cache os grupos que não existem mais.
for (const k of Object.keys(cache)) {
  const existe =
    (k.startsWith('img:') && indice.imagens[k.slice(4)]) ||
    (k.startsWith('par:') && indice.pares[k.split(':')[1]]) ||
    (k.startsWith('quadro:') && indice.quadros[k.slice(7)]) ||
    (k.startsWith('video:') && indice.videos[`video-${k.slice(6)}`]) ||
    ['marca', 'loop:abertura'].includes(k);
  if (!existe) {
    for (const s of cache[k].saidas) await rm(path.join(DESTINO, s), { force: true });
    delete cache[k];
  }
}

// Ordem estável (o paralelismo termina fora de ordem).
const ordenado = (o) =>
  Object.fromEntries(
    Object.keys(o)
      .sort()
      .map((k) => [k, o[k]]),
  );
for (const k of ['imagens', 'pares', 'videos', 'quadros']) indice[k] = ordenado(indice[k]);
await writeFile(path.join(DESTINO, 'midia.json'), JSON.stringify(indice, null, 2));
await writeFile(ARQ_CACHE, JSON.stringify(cache, null, 2));
console.log(`media:prepare — ${contagem.feitos} gerados, ${contagem.cache} do cache`);

// Referência não usada pelo build: as correções declaradas precisam bater com o manifesto.
for (const c of correcoes.edicoes) {
  const r = registroPorNumero(c.numero);
  if (!r) throw new Error(`correção sem registro: ${c.numero}`);
}
