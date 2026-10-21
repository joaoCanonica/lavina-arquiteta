// Quadros da entrada da home em tempos exatos (0 / 0,8 / 1,6 / 2,4 / 3,2 s), em 390 e 1440 px.
// Timers congelados (relógio do Playwright) e animações CSS posicionadas via Web Animations API.
// Uso: pnpm build && node scripts/capturar-entrada.mjs
/* global document */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const PORTA = 4332;
const BASE = `http://localhost:${PORTA}/`;
const SAIDA = 'docs/capturas/entrada';
const TEMPOS = [0, 800, 1600, 2400, 3200];
await mkdir(SAIDA, { recursive: true });

spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
const preview = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORTA)], {
  stdio: 'ignore',
  detached: true,
});
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {
    /* subindo */
  }
  await new Promise((r) => setTimeout(r, 500));
}

const navegador = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined,
});

for (const [largura, altura, escala] of [
  [390, 844, 2],
  [1440, 900, 1],
]) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: escala,
  });
  const pagina = await ctx.newPage();
  await pagina.clock.install(); // congela setTimeout (fim em 3,3 s e rede de 5 s)
  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.evaluate(() =>
    Promise.all([...document.images].map((i) => i.decode().catch(() => null))),
  );
  const quadros = [];
  for (const t of TEMPOS) {
    await pagina.evaluate((tt) => {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = tt;
      }
    }, t);
    await pagina.waitForTimeout(80);
    quadros.push(await pagina.screenshot());
  }
  await ctx.close();
  const w = largura < 600 ? 300 : 560;
  const metas = await Promise.all(
    quadros.map((q) => sharp(q).resize({ width: w }).png().toBuffer({ resolveWithObject: true })),
  );
  const G = 8;
  const h = metas[0].info.height;
  const rotulos = Buffer.from(
    `<svg width="${G + metas.length * (w + G)}" height="30" xmlns="http://www.w3.org/2000/svg">${TEMPOS.map(
      (t, i) =>
        `<text x="${G + i * (w + G) + 4}" y="21" font-family="sans-serif" font-size="15" fill="#A79C8F">${(t / 1000).toFixed(1).replace('.', ',')} s</text>`,
    ).join('')}</svg>`,
  );
  await sharp({
    create: {
      width: G + metas.length * (w + G),
      height: h + 30 + G,
      channels: 3,
      background: '#111',
    },
  })
    .composite([
      ...metas.map((m, i) => ({ input: m.data, top: 30, left: G + i * (w + G) })),
      { input: rotulos, top: 0, left: 0 },
    ])
    .jpeg({ quality: 84 })
    .toFile(path.join(SAIDA, `entrada-${largura}.jpg`));
  console.log('ok', path.join(SAIDA, `entrada-${largura}.jpg`));
}

await navegador.close();
spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
try {
  process.kill(-preview.pid);
} catch {
  /* já encerrado */
}
