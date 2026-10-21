// Lighthouse mobile (simulação padrão: Moto G Power, 4G lento, CPU 4x) sobre o build.
// Roda N vezes por rota e grava a mediana em docs/capturas/lighthouse/<rota>.json.
// Uso: pnpm build && pnpm audit-lighthouse [rota ...] [--vezes 3]
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const iV = args.indexOf('--vezes');
const VEZES = iV >= 0 ? Number(args[iV + 1]) : 3;
const rotas = args.filter((a, i) => a.startsWith('/') && args[i - 1] !== '--vezes');
if (!rotas.length) rotas.push('/');
const PORTA = 4333;
const SAIDA = 'docs/capturas/lighthouse';
await mkdir(SAIDA, { recursive: true });

spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
const preview = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORTA)], {
  stdio: 'ignore',
  detached: true,
});
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORTA}/`)).ok) break;
  } catch {
    /* subindo */
  }
  await new Promise((r) => setTimeout(r, 500));
}

const chrome = existsSync('/opt/pw-browsers/chromium')
  ? '/opt/pw-browsers/chromium'
  : process.env.CHROME_PATH;
const mediana = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const resumo = [];

for (const rota of rotas) {
  const execucoes = [];
  for (let n = 0; n < VEZES; n++) {
    const tmp = path.join(SAIDA, `.tmp-${n}.json`);
    const r = spawnSync(
      'pnpm',
      [
        'exec',
        'lighthouse',
        `http://localhost:${PORTA}${rota}`,
        '--quiet',
        '--output=json',
        `--output-path=${tmp}`,
        '--only-categories=performance,accessibility,best-practices,seo',
        '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      ],
      { env: { ...process.env, CHROME_PATH: chrome }, encoding: 'utf8' },
    );
    if (r.status !== 0) throw new Error(r.stderr || r.stdout);
    const j = JSON.parse(await readFile(tmp, 'utf8'));
    const a = j.audits;
    execucoes.push({
      performance: Math.round(j.categories.performance.score * 100),
      acessibilidade: Math.round(j.categories.accessibility.score * 100),
      boasPraticas: Math.round(j.categories['best-practices'].score * 100),
      seo: Math.round(j.categories.seo.score * 100),
      fcp: a['first-contentful-paint'].numericValue,
      lcp: a['largest-contentful-paint'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      si: a['speed-index'].numericValue,
      lcpElemento:
        a['lcp-breakdown-insight']?.details?.items?.find((i) => i.type === 'node')?.selector ??
        null,
      bytesTotais: a['total-byte-weight'].numericValue,
      falhasA11y: Object.values(a)
        .filter(
          (x) => x.score === 0 && j.categories.accessibility.auditRefs.some((r) => r.id === x.id),
        )
        .map((x) => x.id),
      json: j,
    });
  }
  const pick = (k) => mediana(execucoes.map((e) => e[k]));
  const med = {
    rota,
    vezes: VEZES,
    performance: pick('performance'),
    acessibilidade: pick('acessibilidade'),
    boasPraticas: pick('boasPraticas'),
    seo: pick('seo'),
    fcpMs: Math.round(pick('fcp')),
    lcpMs: Math.round(pick('lcp')),
    tbtMs: Math.round(pick('tbt')),
    cls: Number(pick('cls').toFixed(3)),
    siMs: Math.round(pick('si')),
    bytesTotaisKB: Math.round(pick('bytesTotais') / 1024),
    lcpElemento: execucoes[0].lcpElemento,
    falhasA11y: [...new Set(execucoes.flatMap((e) => e.falhasA11y))],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execucoes: execucoes.map(({ json, ...e }) => ({ ...e, lcpElemento: undefined })),
  };
  const nome = rota === '/' ? 'home' : rota.replace(/\//g, '');
  await writeFile(path.join(SAIDA, `${nome}.json`), JSON.stringify(med, null, 2) + '\n');
  await writeFile(path.join(SAIDA, `${nome}.lighthouse.json`), JSON.stringify(execucoes[0].json));
  resumo.push(med);
}

spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
try {
  process.kill(-preview.pid);
} catch {
  /* já encerrado */
}
for (const m of resumo) {
  const { execucoes, ...r } = m;
  console.log(r);
  console.log(
    '  por execução:',
    execucoes
      .map((e) => `perf ${e.performance} · LCP ${Math.round(e.lcp)} ms · CLS ${e.cls.toFixed(3)}`)
      .join(' | '),
  );
}
