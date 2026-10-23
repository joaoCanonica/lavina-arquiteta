// Firefox e WebKit (Safari) de verdade, sobre o build: o fallback das transições entre páginas
// e o básico de cada rota. Neste ambiente só há Chromium; roda no CI
// (.github/workflows/navegadores.yml), que instala os navegadores do Playwright.
// Uso: pnpm build && NAVEGADOR=firefox node --test scripts/test-navegadores.mjs
//      (NAVEGADOR = firefox | webkit | chromium; padrão: firefox)
// Grava docs/capturas/final/navegadores-<navegador>.json com o que cada navegador fez.
/* global document, getComputedStyle, window, innerWidth, CSS */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import * as pw from 'playwright-core';

const NOME = process.env.NAVEGADOR ?? 'firefox';
const PORTA = 4380;
const BASE = `http://localhost:${PORTA}`;
// clip-path final da abertura: imagem inteira à mostra.
const ABERTO = /^(none|inset\(0(%|px)?( 0(%|px)?){0,3}\))$/;
const ESCOLHA = JSON.stringify({
  versao: 1,
  data: new Date().toISOString(),
  preferencias: false,
  mapas: false,
  estatistica: false,
});
const projetos = [
  ...new Set(readFileSync('dist/sitemap.xml', 'utf8').match(/\/projetos\/[^/<]+\//g)),
];
const ROTAS = [
  '/',
  '/projetos/',
  ...projetos,
  '/processo/',
  '/coletivo/',
  '/contato/',
  '/privacidade/',
];
const relatorio = { navegador: NOME, versao: null, rotas: {}, transicao: {}, navegacao: {} };
let servidor;
let navegador;

before(async () => {
  servidor = spawn('node', ['scripts/servir-dist.mjs', '--porta', String(PORTA)], {
    stdio: 'ignore',
  });
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(BASE + '/')).ok) break;
    } catch {
      /* subindo */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  const exec =
    NOME === 'chromium' && existsSync('/opt/pw-browsers/chromium')
      ? '/opt/pw-browsers/chromium'
      : undefined;
  navegador = await pw[NOME].launch({ executablePath: exec });
  relatorio.versao = navegador.version();
});
after(async () => {
  await navegador?.close();
  servidor?.kill();
  await mkdir('docs/capturas/final', { recursive: true });
  await writeFile(
    `docs/capturas/final/navegadores-${NOME}.json`,
    JSON.stringify(relatorio, null, 2) + '\n',
  );
});

const pagina = async (rota, opcoes = {}) => {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, ...opcoes });
  await ctx.addInitScript((e) => {
    sessionStorage.setItem('lavina-entrada', '1');
    localStorage.setItem('lavina-consentimento', e);
  }, ESCOLHA);
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  return { ctx, p, erros };
};

// Clica e navega. Separa as falhas: o clique não inicia a navegação (commit) ou a página
// nova não termina de carregar (load). Em falha, grava o diagnóstico no relatório.
const navegarPorClique = async (p, seletor, padrao, chave) => {
  const alvo = p.locator(seletor).first();
  await alvo.scrollIntoViewIfNeeded();
  const caixa = await alvo.boundingBox();
  const sob = caixa
    ? await p.evaluate(
        ([x, y]) => {
          const e = document.elementFromPoint(x, y);
          return e ? `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}` : null;
        },
        [caixa.x + caixa.width / 2, caixa.y + caixa.height / 2],
      )
    : null;
  const d = { seletor, caixa, sob, urlAntes: p.url() };
  relatorio.navegacao[chave] = d;
  await alvo.click();
  try {
    await p.waitForURL(padrao, { waitUntil: 'commit', timeout: 10000 });
    d.commit = true;
  } catch {
    d.commit = false;
    d.urlDepois = p.url();
    throw new Error(`${chave}: o clique não iniciou a navegação (${JSON.stringify(d)})`);
  }
  try {
    await p.waitForLoadState('load', { timeout: 15000 });
    d.load = true;
  } catch {
    d.load = false;
    d.estado = await p.evaluate(() => document.readyState).catch(() => 'sem acesso');
    throw new Error(`${chave}: a página nova não terminou de carregar (${JSON.stringify(d)})`);
  }
};

test(`${NOME}: todas as rotas carregam sem erro de script, com h1 e sem rolagem lateral`, async () => {
  for (const largura of [1440, 390]) {
    for (const rota of ROTAS) {
      const { ctx, p, erros } = await pagina(rota, { viewport: { width: largura, height: 900 } });
      const r = await p.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        largura: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      relatorio.rotas[`${rota} @${largura}`] = { ...r, erros };
      assert.deepEqual(erros, [], `${rota} @${largura}: ${erros.join(' | ')}`);
      assert.equal(r.h1, 1, `${rota} @${largura}: ${r.h1} h1`);
      assert.ok(r.largura <= r.viewport + 1, `${rota} @${largura}: ${r.largura} > ${r.viewport}`);
      await ctx.close();
    }
  }
});

test(`${NOME}: índice → projeto → próximo; a foto de abertura termina aberta`, async () => {
  const { ctx, p, erros } = await pagina('/projetos/');
  relatorio.transicao.suporta = await p.evaluate(() => ({
    pagereveal: 'onpagereveal' in window,
    startViewTransition: 'startViewTransition' in document,
    regraCss: CSS.supports('view-transition-name: a'),
  }));
  await navegarPorClique(
    p,
    'a[href="/projetos/consultorio-jonny-arruda/"]',
    '**/consultorio-jonny-arruda/',
    'indice→projeto',
  );
  await p.waitForTimeout(2000);
  relatorio.transicao.chegadaPorTransicao = await p.evaluate(() =>
    document.documentElement.classList.contains('vt-chegada'),
  );
  const clip = await p.locator('.heroi__midia').evaluate((e) => getComputedStyle(e).clipPath);
  relatorio.transicao.clipAbertura = clip;
  assert.match(clip, ABERTO, `clip ${clip}`);
  await navegarPorClique(p, '.proximo__link', '**/living-jantar-painel/', 'projeto→proximo');
  await p.waitForTimeout(2000);
  // Projeto em vídeo: a abertura é a janela vertical, sem foto para abrir.
  assert.ok(await p.locator('h1').isVisible());
  relatorio.transicao.erros = erros;
  assert.deepEqual(erros, []);
  await ctx.close();
});

test(`${NOME}: movimento reduzido abre a foto direto, sem transição`, async () => {
  const { ctx, p } = await pagina('/projetos/', { reducedMotion: 'reduce' });
  await navegarPorClique(p, 'a[href="/projetos/suite-fl/"]', '**/suite-fl/', 'reduzido');
  assert.equal(
    await p.evaluate(() => document.documentElement.classList.contains('vt-chegada')),
    false,
  );
  const clip = await p.locator('.heroi__midia').evaluate((e) => getComputedStyle(e).clipPath);
  assert.match(clip, ABERTO, `clip ${clip}`);
  await ctx.close();
});

test(`${NOME}: sem JavaScript, o conteúdo das páginas de projeto aparece`, async () => {
  const { ctx, p } = await pagina('/projetos/cozinha-jc/', { javaScriptEnabled: false });
  const clip = await p.locator('.heroi__midia').evaluate((e) => getComputedStyle(e).clipPath);
  assert.match(clip, ABERTO, `clip ${clip}`);
  assert.ok(await p.locator('h1').isVisible());
  await ctx.close();
});
