// Capturas de /projetos e das 9 páginas de projeto em 390 e 1440 px, claro e escuro,
// e com prefers-reduced-motion (1440 escuro). Página inteira, imagens carregadas.
// Saída: docs/capturas/projetos/<largura>-<tema>[-reduzido]/<pagina>.jpg + folhas de contato.
// Uso: pnpm build && node scripts/capturar-projetos.mjs
/* global document, scrollTo, innerHeight */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const PORTA = 4337;
const BASE = `http://localhost:${PORTA}`;
const SAIDA = 'docs/capturas/projetos';
const slugs = readdirSync('dist/projetos', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const paginas = [['indice', '/projetos/'], ...slugs.map((s) => [s, `/projetos/${s}/`])];
// Limpa só as capturas deste script (a pasta transicao/ é de capturar-transicao.mjs).
if (existsSync(SAIDA))
  for (const n of readdirSync(SAIDA))
    if (n !== 'transicao') await rm(path.join(SAIDA, n), { recursive: true, force: true });

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

const combos = [
  [390, 'escuro', false],
  [390, 'claro', false],
  [1440, 'escuro', false],
  [1440, 'claro', false],
  [1440, 'escuro', true],
];
for (const [largura, tema, reduzido] of combos) {
  const pasta = path.join(SAIDA, `${largura}-${tema}${reduzido ? '-reduzido' : ''}`);
  await mkdir(pasta, { recursive: true });
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: largura < 600 ? 844 : 900 },
    colorScheme: tema === 'escuro' ? 'dark' : 'light',
    reducedMotion: reduzido ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(
    (t) => localStorage.setItem('lavina-tema', t),
    tema === 'escuro' ? 'dark' : 'light',
  );
  const arquivos = [];
  for (const [nome, rota] of paginas) {
    const p = await ctx.newPage();
    await p.goto(BASE + rota, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '[data-preview-banner]{display:none!important}' });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.5)) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      const imgs = [...document.images];
      imgs.forEach((i) => (i.loading = 'eager'));
      await Promise.all(imgs.map((i) => i.decode().catch(() => null)));
      scrollTo(0, 0);
    });
    await p.waitForTimeout(2200);
    const arq = path.join(pasta, `${nome}.jpg`);
    const buf = await p.screenshot({ fullPage: true });
    await sharp(buf).jpeg({ quality: 72 }).toFile(arq);
    arquivos.push(arq);
    await p.close();
  }
  await ctx.close();
  // Folha de contato: as 10 páginas lado a lado, cortadas na mesma altura.
  const w = largura < 600 ? 260 : 420;
  const metas = await Promise.all(
    arquivos.map((a) => sharp(a).resize({ width: w }).toBuffer({ resolveWithObject: true })),
  );
  const h = Math.min(4200, Math.max(...metas.map((m) => m.info.height)));
  const G = 10;
  const cortes = await Promise.all(
    metas.map((m) =>
      sharp(m.data)
        .extract({ left: 0, top: 0, width: w, height: Math.min(h, m.info.height) })
        .toBuffer(),
    ),
  );
  await sharp({
    create: {
      width: G + cortes.length * (w + G),
      height: h + 2 * G,
      channels: 3,
      background: '#777',
    },
  })
    .composite(cortes.map((c, i) => ({ input: c, top: G, left: G + i * (w + G) })))
    .jpeg({ quality: 70 })
    .toFile(path.join(SAIDA, `folha-${path.basename(pasta)}.jpg`));
  console.log('ok', path.basename(pasta), arquivos.length, 'páginas');
}

await navegador.close();
spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
try {
  process.kill(-preview.pid);
} catch {
  /* já encerrado */
}
