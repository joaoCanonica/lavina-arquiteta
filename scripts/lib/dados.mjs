// Carrega config (TS, via type stripping do Node 24), projetos, manifesto e pares.
import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../../src/config/index.ts';
import { projetoSchema } from '../../src/config/projeto-schema.ts';

const ler = async (p) => JSON.parse(await readFile(p, 'utf8'));
const PASTA_PROJETOS = 'src/content/projetos';

export async function carregar() {
  const errosSchema = [];
  const projetos = [];
  for (const arq of readdirSync(PASTA_PROJETOS)
    .filter((a) => a.endsWith('.json'))
    .sort()) {
    const bruto = await ler(path.join(PASTA_PROJETOS, arq));
    const r = projetoSchema.safeParse(bruto);
    if (!r.success) {
      errosSchema.push(
        `${arq}: ${r.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`,
      );
      continue;
    }
    if (r.data.slug !== arq.replace(/\.json$/, ''))
      errosSchema.push(`${arq}: slug "${r.data.slug}" difere do nome do arquivo`);
    projetos.push(r.data);
  }
  return {
    config,
    projetos,
    errosSchema,
    manifesto: await ler('media.manifest.json'),
    pares: await ler('docs/dados/pares.json'),
  };
}
