// Capturas de cada seção da home em 390 e 1440 px, claro e escuro (entrada pulada).
// Saída: docs/capturas/home/<largura>-<tema>/NN-<id>.jpg + folha de contato por combinação.
// Uso: pnpm build && node scripts/capturar-secoes.mjs
/* global document, scrollTo, innerHeight */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const PORTA = 4335;
const URL = `http://localhost:${PORTA}/`;
const SAIDA = 'docs/capturas/home';
await rm(SAIDA, { recursive: true, force: true });

spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
const preview = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORTA)], {
  stdio: 'ignore',
  detached: true,
});
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(URL)).ok) break;
  } catch {
    /* subindo */
  }
  await new Promise((r) => setTimeout(r, 500));
}
const navegador = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined,
});

for (const largura of [390, 1440]) {
  for (const tema of ['escuro', 'claro']) {
    const pasta = path.join(SAIDA, `${largura}-${tema}`);
    await mkdir(pasta, { recursive: true });
    const ctx = await navegador.newContext({
      viewport: { width: largura, height: largura < 600 ? 844 : 900 },
      deviceScaleFactor: largura < 600 ? 2 : 1,
      colorScheme: tema === 'escuro' ? 'dark' : 'light',
    });
    await ctx.addInitScript(
      (t) => {
        sessionStorage.setItem('lavina-entrada', '1');
        localStorage.setItem('lavina-tema', t);
      },
      tema === 'escuro' ? 'dark' : 'light',
    );
    const p = await ctx.newPage();
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '[data-preview-banner]{display:none!important}' });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.5)) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      scrollTo(0, 0);
      const imgs = [...document.images];
      imgs.forEach((i) => (i.loading = 'eager'));
      await Promise.all(imgs.map((i) => i.decode().catch(() => null)));
    });
    await p.waitForTimeout(1500);
    const secoes = p.locator('main > section');
    const n = await secoes.count();
    const arquivos = [];
    for (let i = 0; i < n; i++) {
      const s = secoes.nth(i);
      const nome =
        (await s.getAttribute('aria-labelledby'))?.replace('-titulo', '') ?? `secao-${i}`;
      const arq = path.join(pasta, `${String(i).padStart(2, '0')}-${nome}.jpg`);
      if (i === 1)
        await p.addStyleTag({ content: '[data-cabecalho]{visibility:hidden!important}' });
      await s.scrollIntoViewIfNeeded();
      await p.waitForTimeout(150);
      const buf = await s.screenshot({ animations: 'disabled' });
      await sharp(buf).jpeg({ quality: 80 }).toFile(arq);
      arquivos.push(arq);
    }
    await ctx.close();
    // Folha de contato: seções lado a lado (390) ou empilhadas (1440).
    const w = largura < 600 ? 300 : 720;
    const metas = await Promise.all(
      arquivos.map((a) => sharp(a).resize({ width: w }).toBuffer({ resolveWithObject: true })),
    );
    const G = 10;
    if (largura < 600) {
      const h = Math.max(...metas.map((m) => m.info.height));
      await sharp({
        create: {
          width: G + metas.length * (w + G),
          height: h + 2 * G,
          channels: 3,
          background: '#777',
        },
      })
        .composite(metas.map((m, i) => ({ input: m.data, top: G, left: G + i * (w + G) })))
        .jpeg({ quality: 78 })
        .toFile(path.join(SAIDA, `folha-${largura}-${tema}.jpg`));
    } else {
      let y = G;
      const comps = metas.map((m) => {
        const c = { input: m.data, top: y, left: G };
        y += m.info.height + G;
        return c;
      });
      await sharp({ create: { width: w + 2 * G, height: y, channels: 3, background: '#777' } })
        .composite(comps)
        .jpeg({ quality: 78 })
        .toFile(path.join(SAIDA, `folha-${largura}-${tema}.jpg`));
    }
    console.log('ok', largura, tema, n, 'seções');
  }
}

await navegador.close();
spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
try {
  process.kill(-preview.pid);
} catch {
  /* já encerrado */
}
