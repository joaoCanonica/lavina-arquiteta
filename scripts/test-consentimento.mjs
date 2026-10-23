// Testes de consentimento, privacidade e segurança (Playwright + Chromium), servindo dist/ com
// os cabeçalhos do vercel.json (scripts/servir-dist.mjs). Grava a lista de requisições de rede
// antes e depois do aceite e as capturas do banner em docs/capturas/consentimento/.
// Uso: pnpm build && pnpm test:consentimento
/* global document, window, getComputedStyle, scrollTo */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, test } from 'node:test';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const PORTA = 4350;
const BASE = `http://localhost:${PORTA}`;
const SAIDA = 'docs/capturas/consentimento';
const ROTAS = [
  '/',
  '/projetos/',
  '/projetos/cozinha-jc/',
  '/processo/',
  '/coletivo/',
  '/contato/',
  '/privacidade/',
  '/nao-existe/',
];
let navegador;
let servidor;

before(async () => {
  await mkdir(SAIDA, { recursive: true });
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
  navegador = await chromium.launch({
    executablePath: existsSync('/opt/pw-browsers/chromium')
      ? '/opt/pw-browsers/chromium'
      : undefined,
  });
});
after(async () => {
  await navegador?.close();
  servidor?.kill();
});

// Página com registro de requisições, violações de CSP e erros de JS.
const abrir = async (rota, opcoes = {}, ctxExistente) => {
  const ctx =
    ctxExistente ??
    (await navegador.newContext({ viewport: { width: 1440, height: 900 }, ...opcoes }));
  if (!ctxExistente)
    await ctx.addInitScript(() => {
      sessionStorage.setItem('lavina-entrada', '1');
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', (e) =>
        window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
      );
    });
  const p = await ctx.newPage();
  const pedidos = [];
  const erros = [];
  p.on('request', (r) => pedidos.push(r.url()));
  p.on('pageerror', (e) => erros.push(e.message));
  p.on('console', (m) => {
    if (m.type() === 'error' && /Content Security Policy|Refused to/i.test(m.text()))
      erros.push(m.text());
  });
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  return { ctx, p, pedidos, erros };
};
const terceiros = (lista) =>
  lista.filter((u) => !u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:'));
// Rola a página inteira (carrega lazy, dispara a Fresta e os observers).
const rolar = (p) =>
  p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    scrollTo(0, 0);
  });

test('cabeçalhos de segurança chegam em todas as respostas', async () => {
  const r = await fetch(BASE + '/');
  for (const h of [
    'content-security-policy',
    'referrer-policy',
    'permissions-policy',
    'x-content-type-options',
    'strict-transport-security',
  ])
    assert.ok(r.headers.get(h), h);
  assert.doesNotMatch(r.headers.get('content-security-policy'), /script-src[^;]*unsafe-inline/);
});

test('antes do aceite: zero requisição de terceiros e nenhuma violação de CSP (todas as rotas)', async () => {
  const relatorio = {};
  for (const largura of [390, 1440]) {
    for (const rota of ROTAS) {
      const { ctx, p, pedidos, erros } = await abrir(rota, {
        viewport: { width: largura, height: 900 },
      });
      await rolar(p);
      await p.waitForTimeout(400);
      const csp = await p.evaluate(() => window.__csp);
      assert.deepEqual(terceiros(pedidos), [], `${rota} @${largura}`);
      assert.deepEqual(csp, [], `CSP ${rota} @${largura}`);
      assert.deepEqual(erros, [], `erros ${rota} @${largura}`);
      assert.ok(await p.locator('[data-consentimento]').isVisible(), `banner ${rota}`);
      if (largura === 1440)
        relatorio[rota] = {
          total: pedidos.length,
          terceiros: terceiros(pedidos),
          origens: [...new Set(pedidos.map((u) => new URL(u).origin))],
        };
      await ctx.close();
    }
  }
  await writeFile(
    path.join(SAIDA, 'rede-antes-do-aceite.json'),
    JSON.stringify(relatorio, null, 2) + '\n',
  );
});

test('os três botões do banner têm o mesmo peso visual', async () => {
  for (const largura of [390, 1440]) {
    const { ctx, p } = await abrir('/', { viewport: { width: largura, height: 900 } });
    const estilos = await p.locator('[data-consentimento-acao]').evaluateAll((bs) =>
      bs.map((b) => {
        const s = getComputedStyle(b);
        const r = b.getBoundingClientRect();
        return {
          fonte: `${s.fontSize} ${s.fontWeight} ${s.fontFamily} ${s.letterSpacing} ${s.textTransform}`,
          cor: `${s.color} ${s.backgroundColor}`,
          borda: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
          padding: `${s.paddingLeft} ${s.paddingRight}`,
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      }),
    );
    assert.equal(estilos.length, 3);
    assert.equal(
      await p.locator('[data-consentimento-painel]').isVisible(),
      false,
      'painel de categorias fechado até clicar em Personalizar',
    );
    // Nenhum texto estoura o botão.
    assert.ok(
      await p
        .locator('[data-consentimento-acao]')
        .evaluateAll((bs) => bs.every((b) => b.scrollWidth <= b.clientWidth)),
      `texto cabe nos botões @${largura}`,
    );
    assert.deepEqual(estilos[1], estilos[0], `Recusar = Aceitar @${largura}`);
    assert.deepEqual(estilos[2], estilos[0], `Personalizar = Aceitar @${largura}`);
    await ctx.close();
  }
});

test('Recusar: nada de terceiro; a escolha fica e o rodapé reabre em Personalizar', async () => {
  const { ctx, p, pedidos } = await abrir('/contato/');
  await p.locator('[data-consentimento-acao="recusar"]').click();
  assert.equal(await p.locator('[data-consentimento]').isVisible(), false);
  const salvo = await p.evaluate(() => JSON.parse(localStorage.getItem('lavina-consentimento')));
  assert.deepEqual([salvo.preferencias, salvo.mapas, salvo.estatistica], [false, false, false]);
  await p.reload({ waitUntil: 'networkidle' });
  assert.equal(await p.locator('[data-consentimento]').isVisible(), false, 'não pergunta de novo');
  await rolar(p);
  assert.equal(await p.locator('[data-mapa] iframe').count(), 0);
  assert.deepEqual(terceiros(pedidos), []);
  // Revogação/alteração pelo link fixo do rodapé.
  await p.locator('[data-rodape] [data-consentimento-abrir]').click();
  await p.locator('[data-consentimento-painel]').waitFor({ state: 'visible' });
  assert.equal(
    await p.locator('[data-consentimento-acao="personalizar"]').getAttribute('aria-expanded'),
    'true',
  );
  await ctx.close();
});

test('Personalizar só "mapas": o iframe do Google entra no /contato; estatística continua desligada', async () => {
  const { ctx, p, pedidos } = await abrir('/contato/');
  await p.locator('[data-consentimento-acao="personalizar"]').click();
  await p.locator('input[data-categoria="mapas"]').check();
  await p.locator('[data-consentimento-acao="personalizar"]').click(); // "Salvar escolhas"
  await p.locator('[data-mapa] iframe').waitFor({ state: 'attached' });
  const src = await p.locator('[data-mapa] iframe').getAttribute('src');
  assert.match(src, /^https:\/\/www\.google\.com\/maps\?q=-27\.8109211,-50\.3161973/);
  await p.waitForTimeout(800);
  const t = terceiros(pedidos);
  assert.ok(
    t.length > 0 && t.every((u) => /google|gstatic/.test(new URL(u).hostname)),
    t.join('\n'),
  );
  assert.equal(await p.evaluate(() => window.__csp.length), 0, 'iframe permitido pela CSP');
  await ctx.close();
});

test('mapa pelo botão "Mostrar o mapa aqui" (consentimento só para mapas)', async () => {
  const { ctx, p } = await abrir('/contato/');
  await p.locator('[data-consentimento-acao="recusar"]').click();
  await p.locator('[data-mapa-permitir]').click();
  await p.locator('[data-mapa] iframe').waitFor({ state: 'attached' });
  const salvo = await p.evaluate(() => JSON.parse(localStorage.getItem('lavina-consentimento')));
  assert.deepEqual([salvo.mapas, salvo.estatistica], [true, false]);
  await ctx.close();
});

test('depois de Aceitar: requisições por rota (relatório) e clique no WhatsApp medido', async () => {
  const relatorio = {};
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('lavina-entrada', '1');
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) =>
      window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
    window.__medidas = [];
    document.addEventListener('lavina:medida', (e) => window.__medidas.push(e.detail));
  });
  const primeira = await abrir('/', {}, ctx);
  await primeira.p.locator('[data-consentimento-acao="aceitar"]').click();
  await primeira.p.close();
  for (const rota of ROTAS) {
    const { p, pedidos } = await abrir(rota, {}, ctx);
    await rolar(p);
    await p.waitForTimeout(800);
    assert.deepEqual(await p.evaluate(() => window.__csp), [], `CSP ${rota}`);
    relatorio[rota] = {
      total: pedidos.length,
      terceiros: terceiros(pedidos).map((u) => u.slice(0, 120)),
    };
    if (rota !== '/contato/') assert.deepEqual(terceiros(pedidos), [], rota);
    await p.close();
  }
  // Medição: clique no link do cabeçalho (não abre a aba: o teste impede a navegação).
  const { p } = await abrir('/processo/', {}, ctx);
  await p.evaluate(() =>
    document.addEventListener('click', (e) => e.preventDefault(), { once: true }),
  );
  await p.locator('.cta a[href^="https://wa.me/"]').first().click();
  const medidas = await p.evaluate(() => window.__medidas);
  assert.equal(medidas.length, 1);
  assert.equal(medidas[0].nome, 'whatsapp');
  await ctx.close();
  await writeFile(
    path.join(SAIDA, 'rede-depois-do-aceite.json'),
    JSON.stringify(relatorio, null, 2) + '\n',
  );
});

test('sem estatística, o clique no WhatsApp não é medido', async () => {
  const { ctx, p } = await abrir('/processo/');
  await p.evaluate(() => {
    window.__medidas = [];
    document.addEventListener('lavina:medida', (e) => window.__medidas.push(e.detail));
    document.addEventListener('click', (e) => e.preventDefault(), { once: true });
  });
  await p.locator('[data-consentimento-acao="recusar"]').click();
  await p.locator('.cta a[href^="https://wa.me/"]').first().click();
  assert.deepEqual(await p.evaluate(() => window.__medidas), []);
  await ctx.close();
});

test('WhatsApp: todos os links levam a mensagem com "Vim pelo site"; o seletor também', async () => {
  const { ctx, p } = await abrir('/contato/', { viewport: { width: 390, height: 844 } });
  const hrefs = await p
    .locator('a[href^="https://wa.me/"]')
    .evaluateAll((as) => as.map((a) => a.href));
  assert.ok(hrefs.length >= 2);
  for (const h of hrefs) {
    assert.match(h, /^https:\/\/wa\.me\/5549991900821\?text=/);
    assert.match(decodeURIComponent(h.split('text=')[1]), /Vim pelo site\.$/);
  }
  await p.locator('[data-consentimento-acao="recusar"]').click();
  await p.locator('label:has(input[value="Reforma"])').click();
  await p.locator('label:has(input[value="Lages"])').click();
  assert.equal(
    await p.locator('[data-orcamento-texto]').inputValue(),
    'Olá! Gostaria de conversar sobre um projeto.\nTipo de projeto: Reforma\nCidade: Lages\nVim pelo site.',
  );
  await ctx.close();
});

test('botão fixo do WhatsApp (celular): aparece, some perto do rodapé e não existe no desktop', async () => {
  const { ctx, p } = await abrir('/projetos/', { viewport: { width: 390, height: 844 } });
  const botao = p.locator('[data-whats-fixo]');
  assert.equal(await botao.isVisible(), false, 'escondido enquanto o banner está aberto');
  await p.locator('[data-consentimento-acao="recusar"]').click();
  await p.waitForTimeout(400);
  assert.equal(await botao.isVisible(), true);
  await p.locator('[data-rodape]').scrollIntoViewIfNeeded();
  await p.waitForFunction(() => {
    const b = document.querySelector('[data-whats-fixo]');
    return getComputedStyle(b).visibility === 'hidden';
  });
  await ctx.close();
  const d = await abrir('/projetos/');
  assert.equal(await d.p.locator('[data-whats-fixo]').isVisible(), false);
  await d.ctx.close();
});

test('Instagram só como link: nenhum embed nem script da Meta no HTML', async () => {
  for (const rota of ROTAS) {
    const html = await (await fetch(BASE + rota)).text();
    assert.doesNotMatch(html, /instagram\.com\/embed|connect\.facebook\.net|instgrm|fbq\(/i, rota);
  }
});

test('/privacidade: seções obrigatórias, controlador com CNPJ e data de atualização', async () => {
  const { ctx, p } = await abrir('/privacidade/');
  const texto = await p.locator('main').innerText();
  for (const t of [
    'Amanda Lavina Arquitetura Ltda',
    '52.116.202/0001-05',
    'Que dados são tratados',
    'Finalidades e bases legais',
    'Serviços de terceiros',
    'WhatsApp (Meta)',
    'Google Maps',
    'Por quanto tempo',
    'Seus direitos',
    'Como falar conosco',
  ])
    assert.ok(texto.includes(t), t);
  assert.ok(await p.locator('main time[datetime]').count());
  await ctx.close();
});

test('capturas do banner: fechado e em Personalizar, 390 e 1440, claro e escuro', async () => {
  for (const largura of [390, 1440]) {
    for (const tema of ['claro', 'escuro']) {
      const { ctx, p } = await abrir('/', {
        viewport: { width: largura, height: largura < 600 ? 844 : 900 },
        colorScheme: tema === 'escuro' ? 'dark' : 'light',
        deviceScaleFactor: largura < 600 ? 2 : 1,
      });
      await p.waitForTimeout(600);
      for (const estado of ['banner', 'personalizar']) {
        if (estado === 'personalizar')
          await p.locator('[data-consentimento-acao="personalizar"]').click();
        await p.waitForTimeout(250);
        const buf = await p.screenshot();
        await sharp(buf)
          .jpeg({ quality: 78 })
          .toFile(path.join(SAIDA, `${estado}-${largura}-${tema}.jpg`));
      }
      await ctx.close();
    }
  }
  // Mapa no /contato antes e depois do consentimento.
  const { ctx, p } = await abrir('/contato/', { viewport: { width: 1440, height: 900 } });
  await p.locator('[data-consentimento-acao="recusar"]').click();
  const mapa = p.locator('[data-mapa]');
  await mapa.scrollIntoViewIfNeeded();
  await sharp(await mapa.screenshot())
    .jpeg({ quality: 78 })
    .toFile(path.join(SAIDA, 'mapa-antes.jpg'));
  await p.locator('[data-mapa-permitir]').click();
  await p.waitForTimeout(1500);
  await sharp(await mapa.screenshot())
    .jpeg({ quality: 78 })
    .toFile(path.join(SAIDA, 'mapa-depois.jpg'));
  await ctx.close();
  // Rodapé.
  const r = await abrir('/contato/', { viewport: { width: 1440, height: 900 } });
  await r.p.locator('[data-consentimento-acao="recusar"]').click();
  await sharp(await r.p.locator('[data-rodape]').screenshot())
    .jpeg({ quality: 78 })
    .toFile(path.join(SAIDA, 'rodape-1440.jpg'));
  await r.ctx.close();
});
