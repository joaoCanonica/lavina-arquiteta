// Peso por rota: o que o navegador baixa (dist/ servido com os cabeçalhos do vercel.json),
// separado por tipo, em dois momentos: carga inicial (sem rolar) e página inteira (rolando até
// o fim, com as imagens lazy). Vídeos não entram (só carregam no clique). Texto (HTML, JS, CSS)
// em bytes gzip, como a Vercel entrega; imagens e fontes como estão.
// Saída: docs/capturas/final/peso.json + tabela no console.
// Uso: pnpm build && node scripts/medir-peso.mjs
/* global document */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright-core';

const PORTA = 4361;
const BASE = `http://localhost:${PORTA}`;
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
const ESCOLHA = JSON.stringify({
  versao: 1,
  data: new Date().toISOString(),
  preferencias: false,
  mapas: false,
  estatistica: false,
});

await mkdir('docs/capturas/final', { recursive: true });
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

const tipo = (rt) =>
  rt === 'document'
    ? 'html'
    : rt === 'script'
      ? 'js'
      : rt === 'stylesheet'
        ? 'css'
        : rt === 'font'
          ? 'fonte'
          : rt === 'image'
            ? 'imagem'
            : rt === 'media'
              ? 'video'
              : 'outro';
const ehTexto = (t) => t === 'html' || t === 'js' || t === 'css';

const resultado = [];
for (const largura of [390, 1440]) {
  for (const rota of ROTAS) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
    await ctx.addInitScript((e) => {
      sessionStorage.setItem('lavina-entrada', '1');
      localStorage.setItem('lavina-consentimento', e);
    }, ESCOLHA);
    const p = await ctx.newPage();
    const pedidos = [];
    p.on('response', async (r) => {
      const url = r.url();
      if (!url.startsWith(BASE) && !url.startsWith('data:')) return;
      if (url.startsWith('data:')) return; // LQIP inline: já conta no HTML
      try {
        const corpo = await r.body();
        const t = tipo(r.request().resourceType());
        pedidos.push({ t, bytes: ehTexto(t) ? gzipSync(corpo).length : corpo.length, url });
      } catch {
        /* resposta sem corpo (redirecionamento) */
      }
    });
    await p.goto(BASE + rota, { waitUntil: 'networkidle' });
    const soma = () =>
      pedidos.reduce((acc, x) => ((acc[x.t] = (acc[x.t] ?? 0) + x.bytes), acc), {});
    const inicial = soma();
    const altura = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < altura; y += 600) await p.mouse.wheel(0, 600);
    await p.waitForLoadState('networkidle');
    await p.waitForTimeout(500);
    const inteira = soma();
    const kb = (o) =>
      Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v / 1024)]));
    const total = (o) => Math.round(Object.values(o).reduce((s, v) => s + v, 0) / 1024);
    resultado.push({
      rota,
      largura,
      inicialKB: total(inicial),
      inteiraKB: total(inteira),
      inicial: kb(inicial),
      inteira: kb(inteira),
    });
    await ctx.close();
  }
}
await navegador.close();
servidor.kill();
await writeFile('docs/capturas/final/peso.json', JSON.stringify(resultado, null, 2) + '\n');

console.log(
  'rota | largura | carga inicial (KB) | página inteira (KB) | JS gzip | HTML gzip | imagens (inteira)',
);
for (const r of resultado)
  console.log(
    `${r.rota} | ${r.largura} | ${r.inicialKB} | ${r.inteiraKB} | ${r.inteira.js ?? 0} | ${r.inteira.html ?? 0} | ${r.inteira.imagem ?? 0}`,
  );
const jsMax = Math.max(...resultado.map((r) => r.inteira.js ?? 0));
console.log(`JS máximo por página: ${jsMax} KB gzip (orçamento 40 KB)`);
if (jsMax > 40) process.exit(1);
