// Testes de /projetos e /projetos/[slug] (Playwright + Chromium, sobre o build).
// Uso: pnpm build && pnpm test:projetos
/* global document, location, getComputedStyle, window */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright-core';

const PORTA = 4338;
const BASE = `http://localhost:${PORTA}`;
const EXEC = existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
// clip-path final da abertura: imagem inteira à mostra.
const ABERTO = /^(none|inset\(0(%|px)?( 0(%|px)?){0,3}\))$/;
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
      if ((await fetch(BASE + '/projetos/')).ok) break;
    } catch {
      /* subindo */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  navegador = await chromium.launch({ executablePath: EXEC });
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

const pagina = async (rota, opcoes = {}, nav = navegador) => {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, ...opcoes });
  // Escolha de consentimento já feita (Recusar): o banner não cobre o que o teste clica.
  await ctx.addInitScript(() =>
    localStorage.setItem(
      'lavina-consentimento',
      JSON.stringify({
        versao: 1,
        data: new Date().toISOString(),
        preferencias: false,
        mapas: false,
        estatistica: false,
      }),
    ),
  );
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  return { ctx, p, erros };
};
const visiveis = (p) => p.locator('[data-projeto]:not([hidden])').count();

test('9 páginas de projeto geradas, cada uma com h1, imagem de destaque e próximo projeto', async () => {
  const slugs = readdirSync('dist/projetos', { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  assert.equal(slugs.length, 9);
  const { ctx, p } = await pagina('/projetos/');
  for (const s of slugs) {
    await p.goto(`${BASE}/projetos/${s}/`);
    assert.equal(await p.locator('h1').count(), 1, s);
    assert.equal(
      await p.locator(`[style*="view-transition-name:projeto-${s}"]`).count(),
      1,
      `destaque ${s}`,
    );
    assert.equal(await p.locator('.proximo a[href^="/projetos/"]').count(), 1, `próximo ${s}`);
  }
  await ctx.close();
});

test('índice sem JS: os 9 projetos visíveis e a contagem honesta', async () => {
  const { ctx, p } = await pagina('/projetos/?tipo=saude', { javaScriptEnabled: false });
  assert.equal(await visiveis(p), 9);
  assert.equal((await p.locator('[data-contagem]').textContent()).trim(), '9 projetos');
  await ctx.close();
});

test('filtros por teclado: atualizam lista, contagem, aria-current e a URL', async () => {
  const { ctx, p, erros } = await pagina('/projetos/');
  const esperado = { residencial: 7, saude: 2, executados: 6, 'imagens-3d': 5, todos: 9 };
  for (const [tipo, n] of Object.entries(esperado)) {
    await p.locator(`[data-filtro="${tipo}"]`).focus();
    await p.keyboard.press('Enter');
    await p.waitForFunction(
      (k) => document.querySelectorAll('[data-projeto]:not([hidden])').length === k,
      n,
    );
    assert.equal(await visiveis(p), n, tipo);
    assert.equal(await p.locator(`[data-filtro="${tipo}"]`).getAttribute('aria-current'), 'page');
    assert.equal(await p.locator('[aria-current="page"][data-filtro]').count(), 1);
    assert.match(await p.locator('[data-contagem]').textContent(), new RegExp(`^${n} projeto`));
    const busca = await p.evaluate(() => location.search);
    assert.equal(busca, tipo === 'todos' ? '' : `?tipo=${tipo}`);
  }
  // Voltar no histórico restaura o filtro anterior.
  await p.goBack();
  await p.waitForFunction(
    () => document.querySelectorAll('[data-projeto]:not([hidden])').length === 5,
  );
  // Entrada direta com ?tipo=.
  await p.goto(`${BASE}/projetos/?tipo=saude`, { waitUntil: 'networkidle' });
  assert.equal(await visiveis(p), 2);
  assert.deepEqual(erros, []);
  await ctx.close();
});

test('lightbox por teclado: abre, navega com setas, prende o foco, Esc fecha e devolve o foco', async () => {
  const { ctx, p, erros } = await pagina('/projetos/cozinha-jc/');
  const botao = p.locator('[data-lightbox-abrir]').first();
  await botao.focus();
  await p.keyboard.press('Enter');
  const dlg = p.locator('[data-lightbox]');
  await dlg.waitFor({ state: 'visible' });
  const contagem = p.locator('[data-lb-contagem]');
  assert.equal(await contagem.textContent(), '01 / 14');
  assert.ok(await p.locator('[data-lb-palco] img').count());
  assert.match(await p.locator('[data-lb-rotulo]').textContent(), /Imagem 3D do projeto/);
  await p.keyboard.press('ArrowRight');
  assert.equal(await contagem.textContent(), '02 / 14');
  await p.keyboard.press('ArrowLeft');
  await p.keyboard.press('ArrowLeft');
  assert.equal(await contagem.textContent(), '14 / 14');
  for (let i = 0; i < 6; i++) {
    await p.keyboard.press('Tab');
    assert.ok(
      await p.evaluate(() =>
        document.querySelector('[data-lightbox]').contains(document.activeElement),
      ),
      'foco preso no diálogo',
    );
  }
  await p.keyboard.press('Escape');
  await dlg.waitFor({ state: 'hidden' });
  assert.ok(await botao.evaluate((b) => b === document.activeElement), 'foco volta à miniatura');
  assert.deepEqual(erros, []);
  await ctx.close();
});

test('lightbox por arraste (toque/ponteiro): arrastar para a esquerda passa à próxima', async () => {
  const { ctx, p } = await pagina('/projetos/banheiro-tons-claros/', {
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  await p.locator('[data-lightbox-abrir]').first().click();
  const palco = await p.locator('[data-lb-palco]').boundingBox();
  const y = palco.y + palco.height / 2;
  await p.mouse.move(palco.x + palco.width * 0.8, y);
  await p.mouse.down();
  await p.mouse.move(palco.x + palco.width * 0.2, y, { steps: 5 });
  await p.mouse.up();
  assert.equal(await p.locator('[data-lb-contagem]').textContent(), '02 / 04');
  await ctx.close();
});

test('View Transition no Chrome: índice → projeto chega por transição, imagem aberta', async () => {
  const { ctx, p } = await pagina('/projetos/');
  assert.ok(await p.evaluate(() => 'onpagereveal' in window), 'pagereveal suportado');
  await p.locator('a[href="/projetos/consultorio-jonny-arruda/"]').click();
  await p.waitForURL('**/consultorio-jonny-arruda/');
  await p.waitForFunction(() => document.documentElement.classList.contains('vt-chegada'));
  const clip = await p.locator('.heroi__midia').evaluate((e) => getComputedStyle(e).clipPath);
  assert.match(clip, ABERTO, `clip ${clip}`);
  // E do projeto para o próximo.
  await p.locator('.proximo__link').click();
  await p.waitForURL('**/living-jantar-painel/');
  await p.waitForFunction(() => document.documentElement.classList.contains('vt-chegada'));
  await ctx.close();
});

test('sem View Transitions (como Firefox/Safari): navegação comum e a fresta abre a foto', async () => {
  // Emula um navegador sem a regra @view-transition (Firefox; Safari < 18.2): o HTML chega
  // sem ela. Só há Chromium neste ambiente.
  const semVT = await chromium.launch({ executablePath: EXEC });
  const { ctx, p, erros } = await pagina('/projetos/', {}, semVT);
  await ctx.route('**/projetos/**', async (rota) => {
    const r = await rota.fetch();
    const corpo = (await r.text()).replace(/@view-transition\s*\{[^}]*\}/g, '');
    await rota.fulfill({ response: r, body: corpo });
  });
  await p.reload({ waitUntil: 'networkidle' });
  assert.equal(await p.content().then((h) => h.includes('@view-transition')), false);
  try {
    await p.locator('a[href="/projetos/cozinha-jc/"]').click();
    await p.waitForURL('**/cozinha-jc/');
    await p.waitForTimeout(1900);
    assert.equal(
      await p.evaluate(() => document.documentElement.classList.contains('vt-chegada')),
      false,
    );
    const clip = await p.locator('.heroi__midia').evaluate((e) => getComputedStyle(e).clipPath);
    assert.match(clip, ABERTO, `clip ${clip}`);
    assert.deepEqual(erros, []);
  } finally {
    await ctx.close();
    await semVT.close();
  }
});

test('movimento reduzido: sem transição entre páginas e foto aberta direto', async () => {
  const { ctx, p } = await pagina('/projetos/', { reducedMotion: 'reduce' });
  await p.locator('a[href="/projetos/suite-fl/"]').click();
  await p.waitForURL('**/suite-fl/');
  assert.equal(
    await p.evaluate(() => document.documentElement.classList.contains('vt-chegada')),
    false,
  );
  const anim = await p.locator('.heroi__midia').evaluate((e) => getComputedStyle(e).animationName);
  assert.equal(anim, 'none');
  await ctx.close();
});
