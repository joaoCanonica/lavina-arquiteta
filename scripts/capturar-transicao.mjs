// Quadros da View Transition índice → projeto e projeto → próximo (Chromium, 1440 e 390).
// A animação roda a 1/8 da velocidade (CDP Animation.setPlaybackRate) para caber nos quadros.
// Saída: docs/capturas/projetos/transicao/<nome>-NN.jpg + tira <nome>.jpg
// Uso: pnpm build && node scripts/capturar-transicao.mjs
/* global document */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const PORTA = 4339;
const BASE = `http://localhost:${PORTA}`;
const SAIDA = 'docs/capturas/projetos/transicao';
const LENTO = 8;
await rm(SAIDA, { recursive: true, force: true });
await mkdir(SAIDA, { recursive: true });

spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
const preview = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORTA)], {
  stdio: 'ignore',
  detached: true,
});
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE + '/projetos/')).ok) break;
  } catch {
    /* subindo */
  }
  await new Promise((r) => setTimeout(r, 500));
}
const navegador = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined,
});

const casos = [
  ['indice-projeto-1440', 1440, 900, '/projetos/', 'a[href="/projetos/consultorio-jonny-arruda/"]'],
  ['indice-projeto-390', 390, 844, '/projetos/', 'a[href="/projetos/cozinha-jc/"]'],
  ['projeto-proximo-1440', 1440, 900, '/projetos/banheiro-tons-claros/', '.proximo__link'],
];
for (const [nome, w, h, rota, alvo] of casos) {
  const ctx = await navegador.newContext({
    viewport: { width: w, height: h },
    colorScheme: 'dark',
  });
  await ctx.addInitScript(() => localStorage.setItem('lavina-tema', 'dark'));
  const p = await ctx.newPage();
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '[data-preview-banner]{display:none!important}' });
  const link = p.locator(alvo).first();
  await link.scrollIntoViewIfNeeded();
  // Centraliza a imagem de destaque do alvo na tela (como quem rolou até ela).
  await p.evaluate((sel) => {
    const el = document.querySelector(sel)?.closest('li, section');
    el?.scrollIntoView({ block: 'center' });
  }, alvo);
  await p.waitForTimeout(1500);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / LENTO });
  const quadros = [];
  const clique = link.click({ noWaitAfter: true });
  const t0 = Date.now();
  // ~640 ms de transição × 8 = ~5 s; um quadro a cada ~450 ms.
  for (let i = 0; i < 12; i++) {
    try {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
      const arq = path.join(SAIDA, `${nome}-${String(i).padStart(2, '0')}.jpg`);
      await sharp(Buffer.from(data, 'base64')).toFile(arq);
      quadros.push(arq);
    } catch {
      /* troca de documento no meio da captura */
    }
    await new Promise((r) => setTimeout(r, Math.max(0, (i + 1) * 450 - (Date.now() - t0))));
  }
  await clique.catch(() => null);
  await ctx.close();
  const lw = w > 600 ? 360 : 180;
  const metas = await Promise.all(
    quadros.map((q) => sharp(q).resize({ width: lw }).toBuffer({ resolveWithObject: true })),
  );
  const lh = metas[0]?.info.height ?? 0;
  await sharp({
    create: {
      width: metas.length * (lw + 6) + 6,
      height: lh + 12,
      channels: 3,
      background: '#777',
    },
  })
    .composite(metas.map((m, i) => ({ input: m.data, left: 6 + i * (lw + 6), top: 6 })))
    .jpeg({ quality: 75 })
    .toFile(path.join(SAIDA, `${nome}.jpg`));
  console.log('ok', nome, quadros.length, 'quadros');
}

await navegador.close();
spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
try {
  process.kill(-preview.pid);
} catch {
  /* já encerrado */
}
