// Medição das animações da marca (ferramenta de desenvolvimento).
//  1. Sequências de 6 quadros (tempos exatos via Web Animations API, animações pausadas):
//     logo desenhando e fresta revelando a foto → docs/capturas/sistema/*.png
//  2. Desempenho no Chromium (trace do DevTools): quadros por segundo via rAF,
//     eventos de Layout/Paint durante cada animação, custo do grão.
// Uso: pnpm build && node scripts/medir-animacoes.mjs
/* global document, window, requestAnimationFrame, scrollTo */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const PORTA = 4331;
const BASE = `http://localhost:${PORTA}/_sistema/`;
const SAIDA = 'docs/capturas/sistema';
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
const novaPagina = async (tema = 'dark', largura = 1440) => {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript((t) => localStorage.setItem('lavina-tema', t), tema);
  return { ctx, pagina: await ctx.newPage() };
};

async function sequencia(seletor, tempos, nome, preparar) {
  const { ctx, pagina } = await novaPagina();
  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.addStyleTag({ content: '[data-preview-banner]{display:none!important}' });
  if (preparar) await preparar(pagina);
  const quadros = [];
  for (const t of tempos) {
    await pagina.evaluate(
      ([sel, tt]) => {
        const raiz = document.querySelector(sel);
        for (const a of document.getAnimations()) {
          const alvo = a.effect?.target;
          if (alvo && raiz.contains(alvo)) {
            a.pause();
            a.currentTime = tt;
          }
        }
      },
      [seletor, t],
    );
    await pagina.waitForTimeout(60);
    quadros.push(await pagina.locator(seletor).screenshot());
  }
  await ctx.close();
  // Tira de 6 quadros com o tempo anotado.
  const metas = await Promise.all(
    quadros.map((q) => sharp(q).resize({ width: 360 }).png().toBuffer({ resolveWithObject: true })),
  );
  const alt = Math.max(...metas.map((m) => m.info.height));
  const G = 8;
  const largura = metas.reduce((s, m) => s + m.info.width + G, G);
  const rotulos = Buffer.from(
    `<svg width="${largura}" height="28" xmlns="http://www.w3.org/2000/svg">${metas
      .map(
        (m, i) =>
          `<text x="${G + i * (m.info.width + G) + 4}" y="20" font-family="sans-serif" font-size="14" fill="#A79C8F">${tempos[i]} ms</text>`,
      )
      .join('')}</svg>`,
  );
  await sharp({
    create: { width: largura, height: alt + 28 + G, channels: 3, background: '#1C1A18' },
  })
    .composite([
      ...metas.map((m, i) => ({ input: m.data, top: 28, left: G + i * (m.info.width + G) })),
      { input: rotulos, top: 0, left: 0 },
    ])
    .png()
    .toFile(path.join(SAIDA, `${nome}.png`));
}

// 1. Sequências
await sequencia('.logo-palco', [0, 500, 1000, 1500, 2100, 3200], 'logo-desenhando');
await sequencia('[data-revela]', [0, 250, 600, 900, 1300, 2000], 'fresta-revelando', async (p) => {
  await p.locator('[data-revela]').scrollIntoViewIfNeeded();
  await p.waitForFunction(() =>
    document.querySelector('[data-revela]')?.classList.contains('esta-aceso'),
  );
});

// 2. Desempenho
async function medir(nome, acao, { grao = false, url = BASE, desdeOInicio = false } = {}) {
  const { ctx, pagina } = await novaPagina();
  const cdp = await ctx.newCDPSession(pagina);
  if (desdeOInicio) {
    // Mede desde a navegação (entrada da home): rAF registrado por script de inicialização.
    await ctx.addInitScript(() => {
      window.__quadros = [];
      let ant = performance.now();
      const passo = (t) => {
        window.__quadros.push(t - ant);
        ant = t;
        if (window.__quadros.length < 400) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }
  const eventos = [];
  cdp.on('Tracing.dataCollected', (e) => eventos.push(...e.value));
  const fim = new Promise((r) => cdp.once('Tracing.tracingComplete', r));
  const iniciarTrace = () =>
    cdp.send('Tracing.start', {
      categories: 'devtools.timeline,disabled-by-default-devtools.timeline',
      transferMode: 'ReportEvents',
    });
  if (desdeOInicio) await iniciarTrace();
  await pagina.goto(url, { waitUntil: desdeOInicio ? 'commit' : 'networkidle' });
  if (grao) await pagina.evaluate(() => document.documentElement.setAttribute('data-grao', ''));
  if (!desdeOInicio) {
    await pagina.waitForTimeout(500);
    await iniciarTrace();
  }
  if (!desdeOInicio)
    await pagina.evaluate(() => {
      window.__quadros = [];
      let ant = performance.now();
      const passo = (t) => {
        window.__quadros.push(t - ant);
        ant = t;
        if (window.__quadros.length < 400) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  await acao(pagina);
  const deltas = await pagina.evaluate(() => window.__quadros.slice(2));
  await cdp.send('Tracing.end');
  await fim;
  await ctx.close();
  const conta = (n) => eventos.filter((e) => e.name === n && e.ph === 'X');
  const soma = (n) => conta(n).reduce((s, e) => s + (e.dur ?? 0), 0) / 1000;
  const ordenados = [...deltas].sort((a, b) => a - b);
  const p95 = ordenados[Math.floor(ordenados.length * 0.95)] ?? 0;
  return {
    nome,
    quadros: deltas.length,
    fpsMedio: Number((1000 / (deltas.reduce((s, d) => s + d, 0) / deltas.length)).toFixed(1)),
    quadroP95ms: Number(p95.toFixed(1)),
    quadrosAcimaDe20ms: deltas.filter((d) => d > 20).length,
    layouts: conta('Layout').length,
    layoutMs: Number(soma('Layout').toFixed(2)),
    paintMs: Number(soma('Paint').toFixed(2)),
  };
}

const resultados = [];
resultados.push(
  await medir('entrada da home (0–3,5 s, desde a navegação)', (p) => p.waitForTimeout(3500), {
    url: BASE.replace('_sistema/', ''),
    desdeOInicio: true,
  }),
);
resultados.push(
  await medir('logo desenhando (redesenhar)', async (p) => {
    await p.click('.js-repetir-logo');
    await p.waitForTimeout(3200);
  }),
);
resultados.push(
  await medir('fresta acendendo (divisor)', async (p) => {
    await p.click('.js-repetir-fresta');
    await p.waitForTimeout(1200);
  }),
);
resultados.push(
  await medir('revelação da foto', async (p) => {
    await p.evaluate(() =>
      document.querySelector('[data-revela]').scrollIntoView({ block: 'center' }),
    );
    await p.waitForTimeout(2200);
  }),
);
const rolagem = async (p) => {
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 40) {
      scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
    }
  });
};
resultados.push(await medir('rolagem completa sem grão', rolagem));
resultados.push(await medir('rolagem completa com grão', rolagem, { grao: true }));

await navegador.close();
spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
try {
  process.kill(-preview.pid);
} catch {
  /* já encerrado */
}

await writeFile(path.join(SAIDA, 'desempenho.json'), JSON.stringify(resultados, null, 2) + '\n');
console.table(resultados);
