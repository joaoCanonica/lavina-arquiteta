// Auditoria de acessibilidade sobre o build (dist/ servido com os cabeçalhos do vercel.json):
//  1. axe-core (WCAG 2.0/2.1/2.2 A e AA) em todas as rotas, 390 e 1440 px, claro e escuro;
//  2. teclado: primeiro Tab = "Pular para o conteúdo"; foco visível em cada elemento alcançado
//     por Tab; banner de consentimento operável só por teclado;
//  3. leitor de tela: landmarks (banner, navegação, main, contentinfo), um h1, títulos sem salto,
//     lang pt-BR, nomes acessíveis; grava a árvore ARIA (aria snapshot) de cada rota;
//  4. sem JavaScript e com prefers-reduced-motion: nada escondido no conteúdo principal.
//  5. reflow: celular emulado em 390 px sem viewport de layout alargada (WCAG 1.4.10).
// Saída: docs/capturas/a11y/relatorio.json + arvore-<rota>.yml; sai com 1 se houver violação.
// Uso: pnpm build && pnpm audit-a11y
/* global document, getComputedStyle, axe, innerWidth */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const PORTA = 4360;
const BASE = `http://localhost:${PORTA}`;
const SAIDA = 'docs/capturas/a11y';
const AXE = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const ROTAS = [
  '/',
  '/projetos/',
  ...readdirProjetos(),
  '/processo/',
  '/coletivo/',
  '/contato/',
  '/privacidade/',
  '/nao-existe/',
];
// As 9 páginas de projeto, a partir do sitemap do build.
function readdirProjetos() {
  return readFileSync('dist/sitemap.xml', 'utf8')
    .match(/\/projetos\/[^/<]+\//g)
    .filter((v, i, a) => a.indexOf(v) === i);
}
const ESCOLHA = JSON.stringify({
  versao: 1,
  data: new Date().toISOString(),
  preferencias: false,
  mapas: false,
  estatistica: false,
});

await rm(SAIDA, { recursive: true, force: true });
await mkdir(SAIDA, { recursive: true });
const servidor = spawn('node', ['scripts/servir-dist.mjs', '--porta', String(PORTA)], {
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
const navegador = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined,
});

const problemas = [];
const relatorio = { axe: {}, teclado: {}, estrutura: {}, semJs: {}, reduzido: {} };
const nomeArq = (r) => (r === '/' ? 'inicio' : r.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

// Contexto: entrada já vista; escolha de cookies feita (o banner é testado à parte).
const contexto = (opcoes = {}, comEscolha = true) =>
  navegador.newContext({ bypassCSP: true, ...opcoes }).then(async (ctx) => {
    await ctx.addInitScript(
      ([escolha, tema, marcar]) => {
        sessionStorage.setItem('lavina-entrada', '1');
        if (marcar) localStorage.setItem('lavina-consentimento', escolha);
        if (tema) localStorage.setItem('lavina-tema', tema);
      },
      [
        ESCOLHA,
        opcoes.colorScheme === 'dark' ? 'dark' : opcoes.colorScheme ? 'light' : null,
        comEscolha,
      ],
    );
    return ctx;
  });

// 1. axe
for (const largura of [390, 1440]) {
  for (const tema of ['light', 'dark']) {
    const ctx = await contexto({
      viewport: { width: largura, height: 900 },
      colorScheme: tema,
      reducedMotion: 'reduce',
    });
    for (const rota of ROTAS) {
      const p = await ctx.newPage();
      await p.goto(BASE + rota, { waitUntil: 'networkidle' });
      await p.addScriptTag({ content: AXE });
      const r = await p.evaluate(async () => {
        const res = await axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          },
          resultTypes: ['violations', 'incomplete'],
        });
        return {
          violacoes: res.violations.map((v) => ({
            id: v.id,
            impacto: v.impact,
            alvos: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
            resumo: v.nodes[0]?.failureSummary?.slice(0, 300),
          })),
          revisar: res.incomplete.map((v) => v.id),
        };
      });
      const chave = `${rota} @${largura} ${tema}`;
      relatorio.axe[chave] = r;
      r.violacoes.forEach((v) =>
        problemas.push(`axe ${chave}: ${v.id} (${v.impacto}) ${v.alvos[0] ?? ''}`),
      );
      await p.close();
    }
    await ctx.close();
  }
}

// 2 e 3. Teclado e estrutura (1440 claro e 390 escuro).
for (const [largura, tema] of [
  [1440, 'light'],
  [390, 'dark'],
]) {
  const ctx = await contexto({ viewport: { width: largura, height: 900 }, colorScheme: tema });
  for (const rota of ROTAS) {
    const p = await ctx.newPage();
    await p.goto(BASE + rota, { waitUntil: 'networkidle' });
    const chave = `${rota} @${largura}`;
    // Primeiro Tab: o atalho "Pular para o conteúdo", visível no foco.
    await p.keyboard.press('Tab');
    const primeiro = await p.evaluate(() => {
      const el = document.activeElement;
      const r = el.getBoundingClientRect();
      return {
        texto: el.textContent.trim(),
        href: el.getAttribute('href'),
        visivel: r.top >= 0 && r.height > 0,
      };
    });
    if (primeiro.href !== '#conteudo' || !primeiro.visivel)
      problemas.push(
        `teclado ${chave}: primeiro Tab não é o "Pular para o conteúdo" visível (${primeiro.texto})`,
      );
    // Percorre até 60 Tabs: cada foco precisa de indicador visível (outline ou box-shadow).
    const semFoco = [];
    let passos = 0;
    for (; passos < 60; passos++) {
      await p.keyboard.press('Tab');
      const f = await p.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        // Indicador: contorno ou sombra no elemento, ou contorno no ::after (links que cobrem
        // o card inteiro desenham o foco no pseudo-elemento).
        const depois = getComputedStyle(el, '::after');
        const visivel =
          (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) ||
          s.boxShadow !== 'none' ||
          (depois.content !== 'none' &&
            depois.outlineStyle !== 'none' &&
            parseFloat(depois.outlineWidth) > 0);
        return {
          alvo: `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} ${el.textContent.trim().slice(0, 30)}`,
          visivel,
        };
      });
      if (!f) break;
      if (!f.visivel) semFoco.push(f.alvo);
    }
    relatorio.teclado[chave] = { tabs: passos, semIndicador: semFoco };
    semFoco.forEach((a) => problemas.push(`teclado ${chave}: foco sem indicador visível em ${a}`));

    // Estrutura para leitor de tela.
    const e = await p.evaluate(() => {
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(
        (h) => h.getClientRects().length || h.closest('.so-leitor'),
      );
      const niveis = hs.map((h) => Number(h.tagName[1]));
      const saltos = niveis.flatMap((n, i) =>
        i && n > niveis[i - 1] + 1 ? [`h${niveis[i - 1]}→h${n}`] : [],
      );
      return {
        lang: document.documentElement.lang,
        h1: document.querySelectorAll('h1').length,
        saltos,
        main: document.querySelectorAll('main').length,
        banner: document.querySelectorAll('body > header, header[data-cabecalho]').length,
        nav: document.querySelectorAll('nav').length,
        rodape: document.querySelectorAll('footer[data-rodape]').length,
        titulo: document.title,
      };
    });
    relatorio.estrutura[chave] = e;
    const publica = rota !== '/nao-existe/';
    if (e.lang !== 'pt-BR') problemas.push(`estrutura ${chave}: lang "${e.lang}"`);
    if (e.h1 !== 1) problemas.push(`estrutura ${chave}: ${e.h1} h1`);
    if (e.main !== 1) problemas.push(`estrutura ${chave}: ${e.main} <main>`);
    if (publica && (e.banner < 1 || e.nav < 1 || e.rodape !== 1))
      problemas.push(
        `estrutura ${chave}: falta landmark (header ${e.banner}, nav ${e.nav}, footer ${e.rodape})`,
      );
    e.saltos.forEach((s) => problemas.push(`estrutura ${chave}: salto de título ${s}`));
    if (largura === 1440)
      await writeFile(
        path.join(SAIDA, `arvore-${nomeArq(rota)}.yml`),
        await p.locator('body').ariaSnapshot(),
      );
    await p.close();
  }
  await ctx.close();
}

// Reflow (WCAG 1.4.10): celular emulado em 390 px, a viewport de layout não pode crescer.
// No celular, conteúdo que vaza alarga a viewport e a página passa a arrastar para o lado.
{
  const ctx = await contexto({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });
  relatorio.reflow = {};
  for (const rota of ROTAS) {
    const p = await ctx.newPage();
    await p.goto(BASE + rota, { waitUntil: 'networkidle' });
    const largura = await p.evaluate(() => innerWidth);
    relatorio.reflow[rota] = largura;
    if (largura !== 390)
      problemas.push(`reflow ${rota}: viewport de layout com ${largura} px em celular de 390`);
    await p.close();
  }
  await ctx.close();
}

// Banner de consentimento só por teclado (sem escolha prévia).
{
  const ctx = await contexto({ viewport: { width: 390, height: 844 } }, false);
  const p = await ctx.newPage();
  await p.goto(BASE + '/contato/', { waitUntil: 'networkidle' });
  let chegou = false;
  for (let i = 0; i < 80 && !chegou; i++) {
    await p.keyboard.press('Tab');
    chegou = await p.evaluate(
      () => document.activeElement?.dataset?.consentimentoAcao === 'personalizar',
    );
  }
  if (!chegou) problemas.push('teclado banner: "Personalizar" não alcançável por Tab');
  else {
    await p.keyboard.press('Enter');
    await p.keyboard.press('Space'); // marca a primeira categoria (foco vai ao painel)
    for (let i = 0; i < 6; i++) {
      await p.keyboard.press('Tab');
      if (
        await p.evaluate(
          () => document.activeElement?.dataset?.consentimentoAcao === 'personalizar',
        )
      )
        break;
    }
    await p.keyboard.press('Enter');
    const salvo = await p.evaluate(() => localStorage.getItem('lavina-consentimento'));
    relatorio.teclado['banner (teclado)'] = { salvo: JSON.parse(salvo ?? 'null') };
    if (!salvo) problemas.push('teclado banner: escolha não salva só com teclado');
  }
  await ctx.close();
}

// 4. Sem JS e com movimento reduzido: nada do conteúdo principal escondido.
for (const [modo, opcoes] of [
  ['semJs', { javaScriptEnabled: false }],
  ['reduzido', { reducedMotion: 'reduce' }],
]) {
  const ctx = await contexto({ viewport: { width: 1440, height: 900 }, ...opcoes });
  for (const rota of ROTAS) {
    const p = await ctx.newPage();
    await p.goto(BASE + rota, { waitUntil: 'networkidle' });
    // Rola pela página com a roda do mouse (sem timers na página: com o JS desligado,
    // setTimeout não dispara).
    const altura = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < altura; y += 700) await p.mouse.wheel(0, 700);
    await p.waitForTimeout(300);
    const escondidos = await p.evaluate(() =>
      [...document.querySelectorAll('main img, main h1, main h2, main h3, main p, main video')]
        .filter((el) => {
          // Fora da conta: o que já está oculto de propósito e as cópias decorativas
          // aria-hidden (miniaturas que aparecem no hover/foco do link).
          if (
            el.closest(
              '[hidden], dialog:not([open]), .so-leitor, [data-lightbox], [aria-hidden="true"]',
            )
          )
            return false;
          for (let n = el; n && n !== document.body; n = n.parentElement) {
            const s = getComputedStyle(n);
            if (
              s.opacity === '0' ||
              /inset\((4\d|50)(\.\d+)?%/.test(s.clipPath) ||
              s.visibility === 'hidden'
            )
              return true;
          }
          return false;
        })
        .slice(0, 5)
        .map(
          (el) =>
            `${el.tagName.toLowerCase()} ${(el.getAttribute('alt') ?? el.textContent).trim().slice(0, 40)}`,
        ),
    );
    relatorio[modo][rota] = escondidos;
    escondidos.forEach((x) => problemas.push(`${modo} ${rota}: conteúdo escondido (${x})`));
    await p.close();
  }
  await ctx.close();
}

await navegador.close();
servidor.kill();
relatorio.problemas = problemas;
await writeFile(path.join(SAIDA, 'relatorio.json'), JSON.stringify(relatorio, null, 2) + '\n');
const totalAxe = Object.values(relatorio.axe).reduce((s, r) => s + r.violacoes.length, 0);
console.log(
  `audit-a11y: ${ROTAS.length} rotas · axe em 390/1440 × claro/escuro (${Object.keys(relatorio.axe).length} execuções, ${totalAxe} violações) · teclado, estrutura, reflow, sem JS e movimento reduzido`,
);
if (problemas.length) {
  console.log(`  ${problemas.length} problema(s):`);
  [...new Set(problemas)].slice(0, 60).forEach((x) => console.log(`    ✗ ${x}`));
  process.exit(1);
}
console.log('  ✓ verde');
