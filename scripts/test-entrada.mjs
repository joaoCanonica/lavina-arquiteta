// Testes da entrada da home (Playwright + Chromium, sobre o build).
// Uso: pnpm build && pnpm test:entrada
/* global document, requestAnimationFrame, window */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright-core';

const PORTA = 4334;
const URL = `http://localhost:${PORTA}/`;
let navegador;
let preview;

before(async () => {
  spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
  preview = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORTA)], {
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
  navegador = await chromium.launch({
    executablePath: existsSync('/opt/pw-browsers/chromium')
      ? '/opt/pw-browsers/chromium'
      : undefined,
  });
});

after(async () => {
  await navegador?.close();
  spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
  try {
    process.kill(-preview.pid);
  } catch {
    /* já encerrado */
  }
});

const ativa = (p) => p.evaluate(() => document.documentElement.classList.contains('entrada-ativa'));
const nova = async (opcoes = {}) => {
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, ...opcoes });
  return { ctx, p: await ctx.newPage() };
};

test('entrada roda na 1ª visita e termina em ≤ 3,5 s; abertura acessível desde o início', async () => {
  const { ctx, p } = await nova();
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  assert.equal(await ativa(p), true);
  // "Pular" visível desde o primeiro quadro.
  assert.equal(await p.locator('[data-entrada-pular]').isVisible(), true);
  // Abertura no DOM e na árvore de acessibilidade (a camada da entrada é aria-hidden).
  assert.equal(
    await p.getByRole('heading', { level: 1, name: /presença em cada etapa/ }).count(),
    1,
  );
  assert.equal(await p.locator('[data-entrada]').getAttribute('aria-hidden'), 'true');
  const fim = await p.evaluate(
    () =>
      new Promise((r) => {
        const ini = window.__entradaInicio;
        const olhar = () =>
          document.documentElement.classList.contains('entrada-ativa')
            ? requestAnimationFrame(olhar)
            : r(performance.now() - ini);
        olhar();
      }),
  );
  console.log(`# duração da entrada: ${Math.round(fim)} ms`);
  assert.ok(fim <= 3500, `entrada levou ${Math.round(fim)} ms`);
  assert.equal(await p.locator('[data-entrada]').count(), 0, 'camada removida do DOM');
  await ctx.close();
});

test('só na 1ª visita da sessão', async () => {
  const { ctx, p } = await nova();
  await p.goto(URL);
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  assert.equal(await ativa(p), false);
  await ctx.close();
});

for (const [nome, acao] of [
  ['mouse (botão Pular)', (p) => p.click('[data-entrada-pular]')],
  ['toque (na camada)', (p) => p.tap('[data-entrada]', { position: { x: 100, y: 400 } })],
  [
    'teclado (Tab + Enter no Pular)',
    async (p) => {
      await p.keyboard.press('Tab');
      assert.equal(
        await p.evaluate(() => document.activeElement?.hasAttribute('data-entrada-pular')),
        true,
      );
      await p.keyboard.press('Enter');
    },
  ],
  ['teclado (Esc)', (p) => p.keyboard.press('Escape')],
]) {
  test(`pular por ${nome}`, async () => {
    const { ctx, p } = await nova({ hasTouch: true });
    await p.goto(URL, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(300);
    assert.equal(await ativa(p), true);
    const t0 = Date.now();
    await acao(p);
    await p.waitForFunction(
      () => !document.documentElement.classList.contains('entrada-ativa'),
      null,
      { timeout: 2000 },
    );
    assert.ok(Date.now() - t0 < 1000, 'pular deve encerrar em menos de 1 s');
    assert.equal(await p.locator('[data-entrada]').count(), 0);
    await ctx.close();
  });
}

test('prefers-reduced-motion: abertura direta, sem entrada', async () => {
  const { ctx, p } = await nova({ reducedMotion: 'reduce' });
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  assert.equal(await ativa(p), false);
  assert.equal(await p.locator('[data-entrada]').isVisible(), false);
  await ctx.close();
});

test('sem JS: abertura direta, sem entrada', async () => {
  const { ctx, p } = await nova({ javaScriptEnabled: false });
  await p.goto(URL);
  assert.equal(await p.locator('[data-entrada]').isVisible(), false);
  assert.equal(await p.locator('h1').isVisible(), true);
  await ctx.close();
});

test('menu mobile: abre em tela cheia, prende o foco e fecha com Esc', async () => {
  const { ctx, p } = await nova({ reducedMotion: 'reduce' });
  await p.goto(URL);
  await p.click('[data-menu-abrir]');
  assert.equal(await p.locator('[data-menu]').evaluate((d) => d.open), true);
  for (let i = 0; i < 8; i++) await p.keyboard.press('Tab');
  assert.equal(
    await p.evaluate(() => !!document.activeElement?.closest('[data-menu]')),
    true,
    'foco preso no menu',
  );
  await p.keyboard.press('Escape');
  assert.equal(await p.locator('[data-menu]').evaluate((d) => d.open), false);
  assert.equal(
    await p.evaluate(() => document.activeElement?.hasAttribute('data-menu-abrir')),
    true,
    'foco volta ao botão',
  );
  await ctx.close();
});
