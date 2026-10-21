// Utilitários compartilhados pelos scripts de mídia.
import { execFile } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);

export const ORIG = 'media-originais';
export const DESTINO = path.join('public', 'media');

const arquivos = readdirSync(ORIG);

// Acha o original pelo número de mídia do Instagram (ex.: "729424348").
export function originalPorNumero(numero) {
  const nome = arquivos.find((a) => a.startsWith(`SaveClip.App_${numero}_`));
  if (!nome) throw new Error(`original não encontrado: ${numero}`);
  return path.join(ORIG, nome);
}

// Ajuste de escala + translação (sem rotação) por mínimos quadrados: b = s·a + t.
export function ajustarEscalaTranslacao(pa, pb) {
  const n = pa.length;
  const media = (pts, i) => pts.reduce((s, p) => s + p[i], 0) / n;
  const [ax, ay, bx, by] = [media(pa, 0), media(pa, 1), media(pb, 0), media(pb, 1)];
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const [dax, day] = [pa[i][0] - ax, pa[i][1] - ay];
    const [dbx, dby] = [pb[i][0] - bx, pb[i][1] - by];
    num += dax * dbx + day * dby;
    den += dax * dax + day * day;
  }
  const s = num / den;
  const t = [bx - s * ax, by - s * ay];
  const residuo = Math.sqrt(
    pa.reduce((acc, p, i) => {
      const dx = s * p[0] + t[0] - pb[i][0];
      const dy = s * p[1] + t[1] - pb[i][1];
      return acc + dx * dx + dy * dy;
    }, 0) / n,
  );
  return { s, t, residuo };
}

// Maior retângulo de proporção `r` (largura/altura) centrado em (cx, cy) dentro de `caixa`.
export function retanguloCentrado(caixa, r) {
  const cx = (caixa.x0 + caixa.x1) / 2;
  const cy = (caixa.y0 + caixa.y1) / 2;
  const meiaL = Math.min(cx - caixa.x0, caixa.x1 - cx);
  const meiaA = Math.min(cy - caixa.y0, caixa.y1 - cy);
  let l = meiaL * 2;
  let a = l / r;
  if (a > meiaA * 2) {
    a = meiaA * 2;
    l = a * r;
  }
  return { x: cx - l / 2, y: cy - a / 2, l, a };
}

export const PROPORCOES = { '4:5': 4 / 5, '3:2': 3 / 2 };

// Um quadro do vídeo no tempo t (s), como PNG.
export async function quadro(arquivo, t) {
  const { stdout } = await exec(
    'ffmpeg',
    [
      '-v',
      'error',
      '-ss',
      String(t),
      '-i',
      arquivo,
      '-frames:v',
      '1',
      '-f',
      'image2pipe',
      '-vcodec',
      'png',
      '-',
    ],
    { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 },
  );
  return stdout;
}

// Caixa em pixels a partir de frações.
export function caixa(r, w, h) {
  return {
    left: Math.round(r.x * w),
    top: Math.round(r.y * h),
    width: Math.round(r.largura * w),
    height: Math.round(r.altura * h),
  };
}
