// Alinha os pares de docs/dados/pares.json: calcula escala + translação a partir
// dos pontos de referência, escolhe a proporção comum (4:5 ou 3:2) que perde menos
// e grava as caixas de recorte. Gera folhas de contato em docs/capturas/pares/.
// Uso: pnpm media:pares
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  PROPORCOES,
  ajustarEscalaTranslacao,
  originalPorNumero,
  retanguloCentrado,
} from './lib/midia.mjs';

const ARQ = 'docs/dados/pares.json';
const SAIDA = 'docs/capturas/pares';
const dados = JSON.parse(await readFile(ARQ, 'utf8'));
await mkdir(SAIDA, { recursive: true });

const dim = async (p) => {
  const m = await sharp(p).metadata();
  return { w: m.width, h: m.height };
};

async function folha(par, recA, recB, arqA, arqB) {
  const ALT = 900;
  const larg = Math.round((ALT * recA.l) / recA.a);
  const corte = (arq, r) =>
    sharp(arq)
      .extract({ left: r.x, top: r.y, width: r.l, height: r.a })
      .resize(larg, ALT)
      .toBuffer();
  const [ia, ib] = await Promise.all([corte(arqA, recA), corte(arqB, recB)]);
  // Sobreposição a 50% para conferir o alinhamento.
  const [ra, rb] = await Promise.all([
    sharp(ia).removeAlpha().raw().toBuffer(),
    sharp(ib).removeAlpha().raw().toBuffer(),
  ]);
  const mix = Buffer.alloc(ra.length);
  for (let i = 0; i < ra.length; i++) mix[i] = (ra[i] + rb[i]) >> 1;
  const meio = await sharp(mix, { raw: { width: larg, height: ALT, channels: 3 } })
    .png()
    .toBuffer();
  const grade = Buffer.from(
    `<svg width="${larg}" height="${ALT}" xmlns="http://www.w3.org/2000/svg">${[1, 2, 3]
      .map(
        (i) =>
          `<line x1="${(larg * i) / 4}" y1="0" x2="${(larg * i) / 4}" y2="${ALT}" stroke="#ff2d55" stroke-width="1"/>` +
          `<line x1="0" y1="${(ALT * i) / 4}" x2="${larg}" y2="${(ALT * i) / 4}" stroke="#ff2d55" stroke-width="1"/>`,
      )
      .join('')}</svg>`,
  );
  const comGrade = (buf) =>
    sharp(buf)
      .composite([{ input: grade }])
      .toBuffer();
  const GAP = 12;
  const titulo = Buffer.from(
    `<svg width="${larg * 3 + GAP * 4}" height="60" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1C1A18"/><text x="${GAP}" y="38" font-family="sans-serif" font-size="24" fill="#F4F1EC">${par.id} · ${par.a.numero} → ${par.b.numero} · semelhança ${par.semelhanca} · ${par.proporcao} · resíduo ${par.alinhamento.residuoPct}%</text></svg>`,
  );
  await sharp({
    create: {
      width: larg * 3 + GAP * 4,
      height: ALT + GAP * 2 + 60,
      channels: 3,
      background: '#1C1A18',
    },
  })
    .composite([
      { input: titulo, top: 0, left: 0 },
      { input: await comGrade(ia), top: 60 + GAP, left: GAP },
      { input: await comGrade(ib), top: 60 + GAP, left: larg + GAP * 2 },
      { input: await comGrade(meio), top: 60 + GAP, left: larg * 2 + GAP * 3 },
    ])
    .jpeg({ quality: 82 })
    .toFile(path.join(SAIDA, `${par.id}.jpg`));
}

for (const par of dados.pares) {
  const arqA = originalPorNumero(par.a.numero);
  const arqB = originalPorNumero(par.b.numero);
  const [dA, dB] = await Promise.all([dim(arqA), dim(arqB)]);

  if (!par.aceito) {
    // Rejeitados: só a folha lado a lado, para registro.
    const ALT = 700;
    const [ia, ib] = await Promise.all([
      sharp(arqA).resize({ height: ALT }).toBuffer({ resolveWithObject: true }),
      sharp(arqB).resize({ height: ALT }).toBuffer({ resolveWithObject: true }),
    ]);
    await sharp({
      create: {
        width: ia.info.width + ib.info.width + 36,
        height: ALT + 24,
        channels: 3,
        background: '#1C1A18',
      },
    })
      .composite([
        { input: ia.data, top: 12, left: 12 },
        { input: ib.data, top: 12, left: ia.info.width + 24 },
      ])
      .jpeg({ quality: 80 })
      .toFile(path.join(SAIDA, `rejeitado--${par.id}.jpg`));
    delete par.recorte;
    continue;
  }

  // Pontos em pixels.
  const px = (pts, d) => pts.map(([x, y]) => [(x / 100) * d.w, (y / 100) * d.h]);
  const pa = px(par.a.pontos, dA);
  const pb = px(par.b.pontos, dB);
  const { s, t, residuo } = ajustarEscalaTranslacao(pa, pb);

  // Retângulo de B expresso nas coordenadas de A, intersectado com A.
  const caixa = {
    x0: Math.max(0, (0 - t[0]) / s),
    y0: Math.max(0, (0 - t[1]) / s),
    x1: Math.min(dA.w, (dB.w - t[0]) / s),
    y1: Math.min(dA.h, (dB.h - t[1]) / s),
  };

  let melhor = null;
  for (const [nome, r] of Object.entries(PROPORCOES)) {
    const rec = retanguloCentrado(caixa, r);
    const areaA = (rec.l * rec.a) / (dA.w * dA.h);
    const areaB = (rec.l * s * rec.a * s) / (dB.w * dB.h);
    const media = (areaA + areaB) / 2;
    if (!melhor || media > melhor.media) melhor = { nome, rec, areaA, areaB, media };
  }
  const { rec } = melhor;
  const recA = {
    x: Math.round(rec.x),
    y: Math.round(rec.y),
    l: Math.round(rec.l),
    a: Math.round(rec.a),
  };
  const recB = {
    x: Math.round(rec.x * s + t[0]),
    y: Math.round(rec.y * s + t[1]),
    l: Math.round(rec.l * s),
    a: Math.round(rec.a * s),
  };
  // Garante limites (arredondamento).
  for (const [r, d] of [
    [recA, dA],
    [recB, dB],
  ]) {
    r.x = Math.max(0, Math.min(r.x, d.w - r.l));
    r.y = Math.max(0, Math.min(r.y, d.h - r.a));
  }

  par.proporcao = melhor.nome;
  par.alinhamento = {
    modelo: 'escala + translação (sem rotação, sem perspectiva)',
    escalaBsobreA: Number(s.toFixed(4)),
    translacaoPx: t.map((v) => Math.round(v)),
    residuoPx: Math.round(residuo),
    residuoPct: Number(((residuo / dB.h) * 100).toFixed(1)),
    areaMantidaA: Number(melhor.areaA.toFixed(2)),
    areaMantidaB: Number(melhor.areaB.toFixed(2)),
  };
  par.recorte = {
    a: { x: recA.x, y: recA.y, largura: recA.l, altura: recA.a },
    b: { x: recB.x, y: recB.y, largura: recB.l, altura: recB.a },
    larguraExportacao: Math.min(recA.l, recB.l),
  };
  await folha(par, recA, recB, arqA, arqB);
  console.log(
    `${par.id}: ${par.proporcao}, s=${s.toFixed(3)}, resíduo ${par.alinhamento.residuoPct}%, área A ${melhor.areaA.toFixed(2)} B ${melhor.areaB.toFixed(2)}, exporta ${par.recorte.larguraExportacao}px`,
  );
}

await writeFile(ARQ, JSON.stringify(dados, null, 2) + '\n');
