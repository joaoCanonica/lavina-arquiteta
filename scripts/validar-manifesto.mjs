// Valida media.manifest.json contra o JSON Schema e confere regras da sessão 1:
// todo original tem registro e natureza; originais batem com o sha256 registrado.
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';

const ler = async (p) => JSON.parse(await readFile(p, 'utf8'));
const schema = await ler('docs/dados/media.manifest.schema.json');
const manifesto = await ler('media.manifest.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const valido = ajv.validate(schema, manifesto);
const erros = (ajv.errors ?? []).map((e) => `${e.instancePath} ${e.message}`);

const originais = readdirSync('media-originais').filter((a) => !a.startsWith('.'));
const porArquivo = new Map(
  manifesto.registros.filter((r) => r.tipo !== 'quadro-de-video').map((r) => [r.arquivo, r]),
);
for (const a of originais) {
  const r = porArquivo.get(a);
  if (!r) {
    erros.push(`original sem registro: ${a}`);
    continue;
  }
  const h = createHash('sha256')
    .update(await readFile(path.join('media-originais', a)))
    .digest('hex');
  if (h !== r.sha256) erros.push(`original alterado (sha256 difere): ${a}`);
}
const ids = manifesto.registros.map((r) => r.id);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dup.length) erros.push(`ids duplicados: ${dup.join(', ')}`);

if (!valido || erros.length) {
  console.error(`manifesto inválido:\n- ${erros.join('\n- ')}`);
  process.exit(1);
}
const naturezas = {};
for (const r of manifesto.registros) naturezas[r.natureza] = (naturezas[r.natureza] ?? 0) + 1;
console.log(
  `manifesto válido: ${manifesto.registros.length} registros, ${originais.length} originais com natureza`,
  naturezas,
);
