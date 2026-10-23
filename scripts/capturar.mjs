// Capturas de tela: sobe o preview e fotografa as rotas em 390 e 1440 px,
// claro e escuro (data-theme no <html>), com e sem prefers-reduced-motion.
// Uso: pnpm capturar [rota ...]   (padrão: /)
/* global document, innerHeight, scrollTo */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const PORTA = 4329;
const BASE = `http://localhost:${PORTA}`;
const LARGURAS = [390, 1440];
const TEMAS = ['claro', 'escuro'];
const MOVIMENTOS = ['movimento', 'reduzido'];

const rotas = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];

function caminhoChromium() {
  const candidatos = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'];
  return candidatos.find((c) => c && existsSync(c));
}

function hoje() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function nomeRota(rota) {
  return rota.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home';
}

async function esperarServidor(url, tentativas = 60) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 404) return;
    } catch {
      // ainda subindo
    }
    await new Promise((res) => setTimeout(res, 500));
  }
  throw new Error(`Preview não respondeu em ${url}`);
}

if (!existsSync('dist')) {
  console.error('dist/ não existe. Rode pnpm build antes de pnpm capturar.');
  process.exit(1);
}

const preview = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORTA)], {
  stdio: 'ignore',
  detached: true,
});

let codigo = 0;
let navegador;
try {
  await esperarServidor(BASE);
  const destino = path.join('docs', 'capturas', hoje());
  await mkdir(destino, { recursive: true });

  const executablePath = caminhoChromium();
  navegador = await chromium.launch(executablePath ? { executablePath } : {});

  let total = 0;
  for (const rota of rotas) {
    for (const largura of LARGURAS) {
      for (const tema of TEMAS) {
        for (const movimento of MOVIMENTOS) {
          const contexto = await navegador.newContext({
            viewport: { width: largura, height: largura < 600 ? 844 : 900 },
            deviceScaleFactor: largura < 600 ? 2 : 1,
            colorScheme: tema === 'escuro' ? 'dark' : 'light',
            reducedMotion: movimento === 'reduzido' ? 'reduce' : 'no-preference',
          });
          // Tema escolhido = o que o script inline do <head> lê (localStorage).
          await contexto.addInitScript(
            (t) => {
              try {
                localStorage.setItem('lavina-tema', t);
              } catch {
                /* sem armazenamento */
              }
            },
            tema === 'escuro' ? 'dark' : 'light',
          );
          const pagina = await contexto.newPage();
          await pagina.goto(BASE + rota, { waitUntil: 'networkidle' });
          // Rola a página inteira para as frestas acenderem (eventos de entrada na tela).
          await pagina.evaluate(async () => {
            const passo = Math.round(innerHeight * 0.6);
            for (let y = 0; y < document.body.scrollHeight; y += passo) {
              scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 120));
            }
            scrollTo(0, 0);
            // Força o carregamento das imagens lazy e espera a decodificação.
            const imgs = [...document.images];
            imgs.forEach((i) => (i.loading = 'eager'));
            await Promise.all(imgs.map((i) => i.decode().catch(() => null)));
          });
          // Deixa as animações terminarem antes da foto.
          await pagina.waitForTimeout(movimento === 'reduzido' ? 300 : 3200);
          const arquivo = path.join(
            destino,
            `${nomeRota(rota)}--${largura}--${tema}--${movimento}.png`,
          );
          await pagina.screenshot({ path: arquivo, fullPage: true });
          await contexto.close();
          total++;
          console.log('ok', arquivo);
        }
      }
    }
  }
  console.log(`${total} capturas em ${destino}`);
} catch (erro) {
  console.error(erro);
  codigo = 1;
} finally {
  await navegador?.close();
  // O Astro 7 deixa o preview como daemon: encerra explicitamente.
  spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
  try {
    process.kill(-preview.pid);
  } catch {
    // já encerrado
  }
}
process.exit(codigo);
