// Testes da config e das travas (node:test).
// Uso: pnpm test:config
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { projetosVisiveis, verificar } from '../src/config/travas.ts';
import { bloqueante } from '../src/config/tipos.ts';
import { carregar } from './lib/dados.mjs';

const base = await carregar();
const clonar = () => structuredClone({ ...base, config: base.config });
const rodar = (d, modo) => verificar({ ...d, modo, hoje: new Date('2026-10-21T12:00:00Z') });
const codigos = (r) => r.falhas.map((f) => f.codigo);

const env = { ...process.env };
const astroBuild = (modo) =>
  spawnSync('pnpm', ['exec', 'astro', 'build'], {
    env: { ...env, LAVINA_MODO: modo },
    encoding: 'utf8',
  });

test('9 projetos válidos no schema', () => {
  assert.deepEqual(base.errosSchema, []);
  assert.equal(base.projetos.length, 9);
});

test('preview passa com pendências', () => {
  const r = rodar(clonar(), 'preview');
  assert.equal(r.ok, true);
  assert.ok(r.pendencias.length > 0, 'deveria haver pendências');
});

test('produção passa com os dados atuais; CAU é só aviso', () => {
  const r = rodar(clonar(), 'producao');
  assert.deepEqual(codigos(r), []);
  assert.equal(r.ok, true);
  assert.ok(
    r.pendencias.some((p) => /CAU/.test(p.rotulo)),
    'CAU deveria aparecer como pendência',
  );
});

test('trava: WhatsApp ausente derruba a produção (preview segue)', () => {
  const d = clonar();
  d.config = {
    ...d.config,
    contato: { ...d.config.contato, whatsapp: bloqueante('WhatsApp de orçamento') },
  };
  const prod = rodar(d, 'producao');
  assert.equal(prod.ok, false);
  assert.ok(codigos(prod).includes('whatsapp-ausente'));
  assert.equal(rodar(d, 'preview').ok, true);
});

test('trava: imagem sem natureza derruba a produção', () => {
  const d = clonar();
  const id = d.projetos[0].midia[0];
  const reg = d.manifesto.registros.find((r) => r.id === id);
  reg.natureza = '';
  reg.rotulo = '';
  const prod = rodar(d, 'producao');
  assert.equal(prod.ok, false);
  assert.ok(codigos(prod).includes('imagem-sem-natureza'));
  assert.equal(rodar(d, 'preview').ok, true);
});

test('trava: projeto sem autoria derruba a produção', () => {
  const d = clonar();
  d.projetos[2].autoriaProjeto = '  ';
  const prod = rodar(d, 'producao');
  assert.equal(prod.ok, false);
  assert.ok(codigos(prod).includes('projeto-sem-autoria'));
  assert.equal(rodar(d, 'preview').ok, true);
});

test('trava: mídia "não usar" referenciada derruba a produção', () => {
  const d = clonar();
  d.projetos[1].midia.push('nao-usar-logo-antigo');
  const prod = rodar(d, 'producao');
  assert.equal(prod.ok, false);
  assert.ok(codigos(prod).includes('midia-nao-usar'));
  assert.equal(rodar(d, 'preview').ok, true);
});

test('projeto sem texto aparece no preview com selo e não some', () => {
  const d = clonar();
  d.projetos[0].textoSite = '';
  const vis = projetosVisiveis(d.projetos, 'preview');
  assert.equal(vis.length, d.projetos.length, 'nenhum projeto some');
  assert.equal(vis.find((p) => p.slug === d.projetos[0].slug).provisorio, true);
});

test('build de preview: rota _pendencias lista os 9 projetos (selo PROVISÓRIO onde há pendência) e noindex', () => {
  const b = astroBuild('preview');
  assert.equal(b.status, 0, b.stderr || b.stdout);
  const html = readFileSync('dist/_pendencias/index.html', 'utf8');
  for (const p of projetosVisiveis(base.projetos, 'preview')) {
    const selo = p.provisorio ? 'sim' : 'nao';
    assert.match(html, new RegExp(`data-projeto="${p.slug}" data-provisorio="${selo}"`), p.slug);
  }
  assert.match(html, /Provisório/);
  assert.match(html, /data-preview-banner/);
  assert.match(readFileSync('dist/index.html', 'utf8'), /noindex/);
});

test('build de produção: sem rota _pendencias e sem faixa de revisão', () => {
  const b = astroBuild('producao');
  assert.equal(b.status, 0, b.stderr || b.stdout);
  assert.equal(existsSync('dist/_pendencias/index.html'), false);
  assert.doesNotMatch(readFileSync('dist/index.html', 'utf8'), /data-preview-banner/);
  // Volta o dist ao preview (padrão).
  assert.equal(astroBuild('preview').status, 0);
});

test('audit-compliance: termo vetado e mídia sem rótulo travam a produção', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'lavina-audit-'));
  const saida = path.join(dir, 'out.md');
  const rodarAudit = () =>
    spawnSync(
      'node',
      ['scripts/audit-compliance.mjs', '--producao', '--dist', dir, '--saida', saida],
      { encoding: 'utf8' },
    );

  writeFileSync(
    path.join(dir, 'ruim.html'),
    '<html><body><p>O melhor projeto.</p><img src="/media/img/x/a-800.avif" alt=""></body></html>',
  );
  const ruim = rodarAudit();
  assert.equal(ruim.status, 1, ruim.stdout);
  const relatorio = readFileSync(saida, 'utf8');
  assert.match(relatorio, /"o melhor"/);
  assert.match(relatorio, /sem data-natureza/);

  writeFileSync(
    path.join(dir, 'ruim.html'),
    '<html><body><figure><img src="/media/img/x/a-800.avif" data-natureza="render" alt=""><figcaption><span data-rotulo-natureza>Imagem 3D do projeto</span></figcaption></figure></body></html>',
  );
  const bom = rodarAudit();
  assert.equal(bom.status, 0, bom.stdout);
});

test('avaliações: nota do Google vira aviso após 90 dias', async () => {
  const { avisoValidadeGoogle } = await import('../src/config/avaliacoes.ts');
  assert.equal(avisoValidadeGoogle(new Date('2026-10-21T12:00:00Z')), null);
  assert.match(
    avisoValidadeGoogle(new Date('2027-02-01T12:00:00Z')).motivo,
    /conferida há 104 dias/,
  );
});

test('tema sem flash: script inline no <head> antes de qualquer CSS; _sistema com padrão escuro', () => {
  const b = astroBuild('preview');
  assert.equal(b.status, 0, b.stderr || b.stdout);
  for (const arq of ['dist/index.html', 'dist/_sistema/index.html']) {
    const html = readFileSync(arq, 'utf8');
    const head = html.slice(0, html.indexOf('</head>'));
    const iScript = head.indexOf('lavina-tema');
    const iCss = head.search(/<link rel="stylesheet"|<style/);
    assert.ok(iScript > 0, `${arq}: script de tema ausente no <head>`);
    assert.ok(iCss === -1 || iScript < iCss, `${arq}: script de tema depois do CSS`);
  }
  assert.match(readFileSync('dist/_sistema/index.html', 'utf8'), /data-tema-padrao="dark"/);
});
