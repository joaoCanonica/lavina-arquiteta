// Escolhe quadros nítidos dos vídeos (STILLS reais, sem upscale) e grava
// docs/dados/stills.json + folhas de contato em docs/capturas/stills/.
// Cada janela [início, fim] foi escolhida olhando o vídeo; o script pega o quadro
// mais nítido (variância do laplaciano) dentro dela. Sem janelas: 6 janelas iguais.
// Uso: pnpm media:stills
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';
import { ORIG, caixa, quadro } from './lib/midia.mjs';

const exec = promisify(execFile);
const PASSO = 0.25;

// Recortes (frações) tiram legenda queimada e marca d'água; nunca recortam pessoas por estética.
const VIDEOS = [
  {
    video: 'apresentacao-principal.mp4',
    projeto: 'living-jantar-painel',
    natureza: 'executado',
    recorte: { x: 0, y: 0, largura: 1, altura: 0.6 },
    motivoRecorte: 'exclui a faixa de legenda queimada (y ≈ 62–67%)',
    janelas: [
      [17, 21, 'mesa redonda de jantar e pendente'],
      [37, 41, 'cristaleira iluminada'],
      [49, 51.5, 'bancada de café'],
      [57, 61, 'mesa e pendente, forro de madeira com sanca iluminada'],
      [71, 74, 'bancada e cuba'],
      [95.5, 99.5, 'painel paramétrico com TV'],
    ],
  },
  {
    video: 'mostrando-quarto.mp4',
    projeto: 'quarto-closet',
    natureza: 'executado',
    janelas: [
      [7, 9, 'cabeceira e arandela'],
      [11, 13, 'cama'],
      [15, 17, 'quarto com janela'],
      [23, 25, 'penteadeira e nichos'],
      [29, 31, 'closet e penteadeira'],
      [33, 35, 'cama e penteadeira'],
    ],
  },
  {
    video: 'novo-modelo.mp4',
    projeto: 'cozinha-farmhouse',
    natureza: 'executado',
    recorte: { x: 0, y: 0, largura: 1, altura: 0.8 },
    motivoRecorte: "exclui a marca d'água (monograma) no rodapé",
    janelas: [
      [9, 11, 'mesa redonda e cristaleiras em arco'],
      [17, 19, 'marcenaria azul com fita de LED no rodapé'],
      [19.5, 21, 'cozinha e bancada'],
      [21.5, 23, 'estar com TV'],
      [23.5, 25, 'bar em arco'],
      [25.5, 27, 'bar e janela'],
    ],
  },
  {
    video: 'mudanca-cozinha.mp4',
    projeto: 'cozinha-jc',
    natureza: 'executado',
    recorte: { x: 0, y: 0, largura: 1, altura: 0.82 },
    motivoRecorte: "exclui a marca d'água (monograma) no rodapé",
  },
  { video: 'falando-sobre-primeiro-contato.mp4', projeto: null, natureza: 'retrato' },
  { video: 'um-dia-no-escritorio.mp4', projeto: null, natureza: 'retrato' },
];

async function duracao(arquivo) {
  const { stdout } = await exec('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'csv=p=0',
    arquivo,
  ]);
  return Number(stdout.trim());
}

async function nitidez(png, recorte) {
  let img = sharp(png);
  if (recorte) {
    const m = await img.metadata();
    img = sharp(png).extract(caixa(recorte, m.width, m.height));
  }
  const { data } = await img
    .greyscale()
    .resize({ width: 360 })
    .convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0] })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let s = 0;
  let s2 = 0;
  for (const v of data) {
    s += v;
    s2 += v * v;
  }
  const n = data.length;
  return s2 / n - (s / n) ** 2;
}

const quadros = [];
await mkdir('docs/capturas/stills', { recursive: true });

for (const cfg of VIDEOS) {
  const arquivo = path.join(ORIG, cfg.video);
  const dur = await duracao(arquivo);
  const janelas =
    cfg.janelas ??
    Array.from({ length: 6 }, (_, i) => {
      const passo = (dur - 5) / 6;
      return [1 + i * passo, 1 + (i + 1) * passo - 0.5, 'quadro automático'];
    });
  const miniaturas = [];
  for (const [i, [ini, fim, descricao]] of janelas.entries()) {
    let melhor = null;
    for (let t = ini; t <= fim; t += PASSO) {
      const png = await quadro(arquivo, t.toFixed(2));
      const n = await nitidez(png, cfg.recorte);
      if (!melhor || n > melhor.n) melhor = { t: Number(t.toFixed(2)), n, png };
    }
    const id = `quadro-${cfg.video.replace(/\.mp4$/, '')}-${String(i + 1).padStart(2, '0')}`;
    quadros.push({
      id,
      video: cfg.video,
      tempo: melhor.t,
      projeto: cfg.projeto,
      natureza: cfg.natureza,
      descricao,
      nitidez: Math.round(melhor.n),
      ...(cfg.recorte ? { recorte: cfg.recorte, motivoRecorte: cfg.motivoRecorte } : {}),
    });
    let mini = sharp(melhor.png);
    if (cfg.recorte) {
      const m = await sharp(melhor.png).metadata();
      mini = mini.extract(caixa(cfg.recorte, m.width, m.height));
    }
    miniaturas.push(
      await mini.resize({ height: 420 }).jpeg().toBuffer({ resolveWithObject: true }),
    );
    console.log(`${id}: t=${melhor.t}s nitidez=${Math.round(melhor.n)}`);
  }
  // Folha de contato do vídeo.
  const GAP = 8;
  const largura = miniaturas.reduce((s, m) => s + m.info.width + GAP, GAP);
  await sharp({
    create: { width: largura, height: 420 + GAP * 2, channels: 3, background: '#1C1A18' },
  })
    .composite(
      miniaturas.map((m, i) => ({
        input: m.data,
        top: GAP,
        left: miniaturas.slice(0, i).reduce((s, x) => s + x.info.width + GAP, GAP),
      })),
    )
    .jpeg({ quality: 80 })
    .toFile(path.join('docs/capturas/stills', `${cfg.video.replace(/\.mp4$/, '')}.jpg`));
}

await writeFile(
  'docs/dados/stills.json',
  JSON.stringify(
    {
      versao: 1,
      metodo:
        'Quadro mais nítido (variância do laplaciano, passo de 0,25 s) dentro de cada janela escolhida olhando o vídeo. Resolução nativa 720×1280, sem upscale.',
      quadros,
    },
    null,
    2,
  ) + '\n',
);
console.log(`${quadros.length} quadros em docs/dados/stills.json`);
