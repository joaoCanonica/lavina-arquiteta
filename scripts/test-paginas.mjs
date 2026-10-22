// Testes de /processo, /coletivo, /contato e da 404 (Playwright + Chromium, sobre o build).
// Uso: pnpm build && pnpm test:paginas
/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright-core';

const PORTA = 4341;
const BASE = `http://localhost:${PORTA}`;
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
      if ((await fetch(BASE + '/processo/')).ok) break;
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

const pagina = async (rota, opcoes = {}) => {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, ...opcoes });
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

test('as quatro páginas existem, com um h1 e sem erro de JS', async () => {
  for (const rota of ['/processo/', '/coletivo/', '/contato/', '/404.html']) {
    const { ctx, p, erros } = await pagina(rota);
    assert.equal(await p.locator('h1').count(), 1, rota);
    assert.deepEqual(erros, [], rota);
    await ctx.close();
  }
  assert.match(
    readFileSync('dist/404.html', 'utf8'),
    /href="\/projetos\/"[^>]*>Voltar aos projetos/,
  );
});

test('processo: as 5 etapas acendem pela fresta ao entrar na tela', async () => {
  const { ctx, p } = await pagina('/processo/');
  const etapas = p.locator('.etapa');
  assert.equal(await etapas.count(), 5);
  assert.equal(await p.locator('.etapa.esta-aceso').count(), 0);
  for (let i = 0; i < 5; i++) {
    await etapas.nth(i).scrollIntoViewIfNeeded();
    await p.waitForFunction(
      (k) => document.querySelectorAll('.etapa')[k].classList.contains('esta-aceso'),
      i,
    );
  }
  await ctx.close();
});

test('processo sem JS ou com movimento reduzido: etapas visíveis', async () => {
  for (const opcoes of [{ javaScriptEnabled: false }, { reducedMotion: 'reduce' }]) {
    const { ctx, p } = await pagina('/processo/', opcoes);
    const op = await p
      .locator('.etapa__texto')
      .last()
      .evaluate((e) => getComputedStyle(e).opacity);
    assert.equal(op, '1', JSON.stringify(opcoes));
    await ctx.close();
  }
});

test('processo: capítulo por teclado leva o vídeo ao tempo do rótulo', async () => {
  const { ctx, p } = await pagina('/processo/');
  assert.equal(await p.locator('main video').count(), 0, 'nenhum vídeo antes do clique');
  const botoes = p.locator('[data-capitulo-ir]');
  assert.equal(await botoes.count(), 9);
  await botoes.nth(5).focus(); // Acompanhamento de Obra (39 s)
  await p.keyboard.press('Enter');
  await p.waitForFunction(() => {
    const v = document.querySelector('[data-dia] video');
    return v && v.readyState >= 1 && v.currentTime >= 38.5;
  });
  assert.equal(await botoes.nth(5).getAttribute('aria-current'), 'step');
  await ctx.close();
});

test('processo: stills da obra com rótulo e o comparador do Consultório', async () => {
  const { ctx, p } = await pagina('/processo/');
  assert.equal(await p.locator('.obra__fig [data-rotulo-natureza]').count(), 3);
  assert.equal(await p.locator('#cmp-consultorio-projeto-executado-mesa').count(), 1);
  await ctx.close();
});

test('coletivo: retratos com rótulo, crédito da fotógrafa e nada de CAU/formação pendente', async () => {
  const { ctx, p } = await pagina('/coletivo/');
  assert.equal(await p.locator('main img[data-natureza="retrato"]').count(), 4);
  assert.match(await p.locator('main').textContent(), /@sabrinarodriguesfoto/);
  assert.equal(await p.locator('.registro').count(), 0);
  assert.doesNotMatch(await p.locator('main').innerText(), /\bCAU\b|Formação|Provisório/i);
  assert.equal(await p.locator('main a[href="https://www.instagram.com/lavinamanda/"]').count(), 1);
  await ctx.close();
});

test('contato: o seletor monta a mensagem do WhatsApp e não há campo de dado pessoal', async () => {
  const { ctx, p } = await pagina('/contato/', { viewport: { width: 390, height: 844 } });
  const campos = await p
    .locator('main input:not([type="radio"]):not([type="hidden"]), main textarea')
    .count();
  assert.equal(campos, 0);
  await p.locator('label:has(input[value="Residencial"])').click();
  await p.locator('label:has(input[value="Outra"])').click();
  assert.equal(
    await p.locator('[data-orcamento-texto]').inputValue(),
    'Olá! Gostaria de conversar sobre um projeto.\nTipo de projeto: Residencial\nCidade: Outra\nVim pelo site.',
  );
  assert.equal(
    await p.locator('main iframe').count(),
    0,
    'sem mapa incorporado antes do consentimento',
  );
  assert.ok(await p.locator('a[href^="https://www.google.com/maps/"]').count());
  await ctx.close();
});
