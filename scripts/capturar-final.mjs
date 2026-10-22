// Capturas finais (sessão 9): todas as rotas em 390 e 1440 px, claro e escuro, e com
// prefers-reduced-motion (390 e 1440, escuro). Página inteira, imagens carregadas, faixa de
// preview visível (é o estado publicado). Servidor: dist/ com os cabeçalhos do vercel.json.
// Saída: docs/capturas/final/<largura>-<tema>[-reduzido]/<rota>.jpg + folhas de contato.
// Uso: pnpm build && node scripts/capturar-final.mjs
/* global document, scrollTo, innerHeight */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const PORTA = 4362;
const BASE = `http://localhost:${PORTA}`;
const SAIDA = 'docs/capturas/final';
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
  '/nao-existe/',
];
const nome = (r) =>
  r === '/' ? 'home' : r === '/nao-existe/' ? '404' : r.replace(/^\/|\/$/g, '').replace(/\//g, '-');
const ESCOLHA = JSON.stringify({
  versao: 1,
  data: new Date().toISOString(),
  preferencias: false,
  mapas: false,
  estatistica: false,
});

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

const combos = [
  [390, 'claro', false],
  [390, 'escuro', false],
  [1440, 'claro', false],
  [1440, 'escuro', false],
  [390, 'escuro', true],
  [1440, 'escuro', true],
];
for (const [largura, tema, reduzido] of combos) {
  const pasta = path.join(SAIDA, `${largura}-${tema}${reduzido ? '-reduzido' : ''}`);
  await rm(pasta, { recursive: true, force: true });
  await mkdir(pasta, { recursive: true });
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: largura < 600 ? 844 : 900 },
    colorScheme: tema === 'escuro' ? 'dark' : 'light',
    reducedMotion: reduzido ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(
    ([t, e]) => {
      localStorage.setItem('lavina-tema', t);
      localStorage.setItem('lavina-consentimento', e);
      sessionStorage.setItem('lavina-entrada', '1');
    },
    [tema === 'escuro' ? 'dark' : 'light', ESCOLHA],
  );
  const arquivos = [];
  for (const rota of ROTAS) {
    const p = await ctx.newPage();
    await p.goto(BASE + rota, { waitUntil: 'networkidle' });
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
    await p.waitForTimeout(reduzido ? 600 : 2200);
    const arq = path.join(pasta, `${nome(rota)}.jpg`);
    const buf = await p.screenshot({ fullPage: true });
    // 1440 sai reduzida para 960 de largura: leitura do layout, sem pesar no repositório.
    await sharp(buf, { limitInputPixels: false })
      .resize({ width: Math.min(largura, 960) })
      .jpeg({ quality: 62, mozjpeg: true })
      .toFile(arq);
    arquivos.push(arq);
    await p.close();
  }
  await ctx.close();
  // Folha de contato: o topo de cada rota lado a lado.
  const w = 220;
  const h = largura < 600 ? 480 : 300;
  const miniaturas = await Promise.all(
    arquivos.map((a) => sharp(a).resize({ width: w, height: h, position: 'top' }).toBuffer()),
  );
  const colunas = 6;
  const G = 8;
  const linhas = Math.ceil(miniaturas.length / colunas);
  await sharp({
    create: {
      width: G + colunas * (w + G),
      height: G + linhas * (h + G),
      channels: 3,
      background: '#777',
    },
  })
    .composite(
      miniaturas.map((m, i) => ({
        input: m,
        left: G + (i % colunas) * (w + G),
        top: G + Math.floor(i / colunas) * (h + G),
      })),
    )
    .jpeg({ quality: 70 })
    .toFile(path.join(SAIDA, `folha-${path.basename(pasta)}.jpg`));
  console.log('ok', path.basename(pasta), arquivos.length, 'rotas');
}

await navegador.close();
servidor.kill();
