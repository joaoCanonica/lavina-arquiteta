// Valida a config e os projetos. Grava as pendências em docs/PENDENCIAS.md
// (bloco automático). Em produção (LAVINA_MODO=producao ou --producao) falha SÓ por:
// WhatsApp ausente; imagem sem natureza; projeto sem autoria; mídia "não usar"
// referenciada. CAU ausente é aviso.
// Uso: pnpm validate-config [--producao]
import { readFile, writeFile } from 'node:fs/promises';
import { verificar } from '../src/config/travas.ts';
import { carregar } from './lib/dados.mjs';

const modo =
  process.argv.includes('--producao') || process.env.LAVINA_MODO === 'producao'
    ? 'producao'
    : 'preview';

const { config, projetos, errosSchema, manifesto, pares } = await carregar();
if (errosSchema.length) {
  console.error(`✗ projetos inválidos no schema:\n- ${errosSchema.join('\n- ')}`);
  process.exit(1);
}

const r = verificar({ config, projetos, manifesto, pares, modo });

// Bloco automático em docs/PENDENCIAS.md
const INICIO = '<!-- pendencias:auto:inicio -->';
const FIM = '<!-- pendencias:auto:fim -->';
const grupos = {
  bloqueante: 'Bloqueantes (travam a produção)',
  aviso: 'Avisos da config (PROVISÓRIO no preview; não travam)',
  projeto: 'Projetos (PROVISÓRIO no preview; não travam)',
};
const linhas = [
  INICIO,
  '',
  '## Pendências da config (gerado por `pnpm validate-config`; não edite este bloco)',
  '',
  `Projetos válidos no schema: ${projetos.length}. Travas de produção hoje: ${
    r.falhas.length ? r.falhas.map((f) => `${f.codigo} (${f.onde})`).join(', ') : 'nenhuma'
  }.`,
];
for (const [estado, titulo] of Object.entries(grupos)) {
  const itens = r.pendencias.filter((p) => p.estado === estado);
  if (!itens.length) continue;
  linhas.push('', `### ${titulo}`, '');
  for (const p of itens) linhas.push(`- **${p.rotulo}** — ${p.motivo} \`${p.onde}\``);
}
linhas.push('', FIM);

const arq = 'docs/PENDENCIAS.md';
const atual = await readFile(arq, 'utf8');
const bloco = linhas.join('\n');
const novo = atual.includes(INICIO)
  ? atual.replace(new RegExp(`${INICIO}[\\s\\S]*${FIM}`), bloco)
  : `${atual.trimEnd()}\n\n${bloco}\n`;
if (novo !== atual) await writeFile(arq, novo);

console.log(
  `validate-config [${modo}]: ${projetos.length} projetos válidos · ${r.pendencias.length} pendências · ${r.falhas.length} travas`,
);
for (const f of r.falhas)
  console.log(`  ${modo === 'producao' ? '✗' : '!'} ${f.codigo}: ${f.detalhe} (${f.onde})`);
if (!r.ok) {
  console.error('✗ produção travada.');
  process.exit(1);
}
console.log(
  modo === 'preview'
    ? '✓ preview liberado (pendências marcadas como PROVISÓRIO).'
    : '✓ produção liberada.',
);
