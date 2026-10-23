// Testes das seções da home (Playwright + Chromium, sobre o build).
// Uso: pnpm build && pnpm test:home
/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright-core';

const PORTA = 4336;
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

const pagina = async (largura = 1440) => {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
  await ctx.addInitScript(() => sessionStorage.setItem('lavina-entrada', '1'));
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
  await p.goto(URL, { waitUntil: 'networkidle' });
  return { ctx, p };
};

test('nenhum vídeo carregado antes do clique', async () => {
  const { ctx, p } = await pagina();
  assert.equal(await p.locator('main video').count(), 0);
  await ctx.close();
});

test('comparador por teclado: setas mudam a posição e o aria-valuetext', async () => {
  const { ctx, p } = await pagina();
  const range = p.locator('#cmp-cozinha-projeto-executado-fornos');
  await range.focus();
  for (let i = 0; i < 5; i++) await p.keyboard.press('ArrowRight');
  assert.equal(await range.inputValue(), '55');
  assert.equal(await range.getAttribute('aria-valuetext'), 'Projeto 55%');
  const pos = await p
    .locator('[data-cmp]')
    .first()
    .evaluate((e) => getComputedStyle(e).getPropertyValue('--pos').trim());
  assert.equal(pos, '55%');
  await p.keyboard.press('Home');
  assert.equal(await range.getAttribute('aria-valuetext'), 'Projeto 0%');
  await ctx.close();
});

test('comparador por ponteiro: arrastar move a luz', async () => {
  const { ctx, p } = await pagina();
  const palco = p.locator('[data-cmp-palco]').first();
  await palco.scrollIntoViewIfNeeded();
  const r = await palco.boundingBox();
  await p.mouse.move(r.x + r.width * 0.5, r.y + r.height / 2);
  await p.mouse.down();
  await p.mouse.move(r.x + r.width * 0.2, r.y + r.height / 2, { steps: 6 });
  await p.mouse.up();
  const v = Number(await p.locator('#cmp-cozinha-projeto-executado-fornos').inputValue());
  assert.ok(v >= 18 && v <= 22, `valor ${v}`);
  await ctx.close();
});

test('capítulos do vídeo por teclado: etapa leva o vídeo ao tempo e fica marcada', async () => {
  const { ctx, p } = await pagina();
  const botoes = p.locator('[data-etapa-ir]');
  assert.equal(await botoes.count(), 5);
  await botoes.nth(2).focus();
  await p.keyboard.press('Enter');
  const video = p.locator('[data-etapas] video');
  await video.waitFor();
  await p.waitForFunction(() => {
    const v = document.querySelector('[data-etapas] video');
    return v && v.readyState >= 1 && v.currentTime >= 22.5;
  });
  const t = await video.evaluate((v) => v.currentTime);
  assert.ok(t >= 23 && t < 27, `tempo ${t}`);
  assert.equal(await botoes.nth(2).getAttribute('aria-current'), 'step');
  assert.equal(await p.locator('.etapa--ativa').count(), 1);
  await ctx.close();
});

test('vídeo do manifesto toca no clique, com controles e sem recorte', async () => {
  const { ctx, p } = await pagina();
  await p.locator('.manifesto [data-janela-tocar]').click();
  const v = p.locator('.manifesto video');
  await v.waitFor();
  assert.equal(await v.evaluate((x) => x.controls && getComputedStyle(x).objectFit), 'contain');
  await p.waitForFunction(() => document.querySelector('.manifesto video')?.readyState >= 1);
  assert.match(
    await v.evaluate((x) => x.currentSrc),
    /falando-sobre-primeiro-contato-(720|540)\.(webm|mp4)$/,
  );
  await ctx.close();
});

test('orçamento: escolhas montam a mensagem do WhatsApp (sem dado sensível)', async () => {
  const { ctx, p } = await pagina(390);
  await p.locator('label:has(input[value="Reforma"])').click();
  await p.locator('label:has(input[value="Litoral"])').click();
  const texto = await p.locator('[data-orcamento-texto]').inputValue();
  assert.equal(
    texto,
    'Olá! Gostaria de conversar sobre um projeto.\nTipo de projeto: Reforma\nCidade: Litoral\nVim pelo site.',
  );
  assert.match(
    await p.locator('[data-orcamento-form]').getAttribute('action'),
    /^https:\/\/wa\.me\/5549991900821/,
  );
  await ctx.close();
});
