// Contraste WCAG 2.x dos pares de cor dos dois temas, lidos de src/styles/tokens.css.
// Texto: mínimo 4,5. UI e texto grande: mínimo 3. Sai com 1 se algum par falhar.
// Gera docs/CONTRASTE.md. Uso: pnpm audit-contraste
import { readFile, writeFile } from 'node:fs/promises';

const css = await readFile('src/styles/tokens.css', 'utf8');

// Blocos de declarações.
const bloco = (seletorRe) => {
  const m = css.match(seletorRe);
  if (!m) throw new Error(`bloco não encontrado: ${seletorRe}`);
  const corpo = css.slice(m.index + m[0].length, css.indexOf('}', m.index));
  return Object.fromEntries(
    [...corpo.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()]),
  );
};
const raiz = bloco(/^:root\s*\{/m);
const temas = {
  claro: bloco(/^:root,\s*\[data-theme='light'\]\s*\{/m),
  escuro: bloco(/^\[data-theme='dark'\]\s*\{/m),
};

const hex = (h) => {
  const s = h.replace('#', '');
  const n =
    s.length === 3
      ? s
          .split('')
          .map((c) => c + c)
          .join('')
      : s;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
function resolver(valor, vars, profundidade = 0) {
  if (profundidade > 10) throw new Error(`referência circular: ${valor}`);
  const v = valor.trim();
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  if (ref) {
    const alvo = vars[ref[1]] ?? raiz[ref[1]];
    if (!alvo) throw new Error(`variável indefinida: ${ref[1]}`);
    return resolver(alvo, vars, profundidade + 1);
  }
  if (v.startsWith('#')) return { rgb: hex(v), a: 1 };
  const rgb = v.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\s*\)$/);
  if (rgb) return { rgb: [+rgb[1], +rgb[2], +rgb[3]], a: rgb[4] === undefined ? 1 : +rgb[4] };
  throw new Error(`cor não suportada: ${v}`);
}
const sobre = (c, fundo) => c.rgb.map((x, i) => Math.round(x * c.a + fundo[i] * (1 - c.a)));
const lum = ([r, g, b]) => {
  const f = (x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const paraHex = (c) =>
  '#' +
  c
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

// Pares auditados: [primeiro plano, fundo, mínimo, uso]
const PARES = [
  ['--cor-texto', '--cor-fundo', 4.5, 'texto principal'],
  ['--cor-texto', '--cor-superficie', 4.5, 'texto sobre superfície'],
  ['--cor-texto-2', '--cor-fundo', 4.5, 'texto secundário, legendas, rótulos'],
  ['--cor-texto-2', '--cor-superficie', 4.5, 'texto secundário sobre superfície'],
  ['--cor-acento', '--cor-fundo', 4.5, 'texto de acento'],
  ['--cor-acento', '--cor-superficie', 4.5, 'texto de acento sobre superfície'],
  ['--cor-linha-forte', '--cor-fundo', 3, 'borda de controle (UI)'],
  ['--cor-foco', '--cor-fundo', 3, 'anel de foco (UI)'],
  ['--cor-foco', '--cor-superficie', 3, 'anel de foco sobre superfície (UI)'],
  ['--cor-madeira', '--cor-fundo', 3, 'freijó: elementos grandes/UI'],
];
// Pares fixos (iguais nos dois temas).
const FIXOS = [
  ['--osso', '--grafite', 4.5, 'faixa "em revisão"'],
  ['--grafite', '--luz', 4.5, 'selo PROVISÓRIO; seleção de texto'],
];

const linhas = [];
let falhas = 0;
const registrar = (tema, fg, bg, min, uso, cFg, cBg) => {
  const r = razao(cFg, cBg);
  const ok = r >= min;
  if (!ok) falhas++;
  linhas.push({ tema, fg, bg, min, uso, r, ok, hexFg: paraHex(cFg), hexBg: paraHex(cBg) });
};

for (const [tema, vars] of Object.entries(temas)) {
  for (const [fg, bg, min, uso] of PARES) {
    const cBg = resolver(vars[bg], vars);
    const fundo = sobre(cBg, hex('#ffffff'));
    registrar(tema, fg, bg, min, uso, sobre(resolver(vars[fg], vars), fundo), fundo);
  }
}
for (const [fg, bg, min, uso] of FIXOS) {
  registrar('ambos', fg, bg, min, uso, resolver(raiz[fg], raiz).rgb, resolver(raiz[bg], raiz).rgb);
}

const fmt = (x) => x.toFixed(2).replace('.', ',');
const md = [
  '# Contraste (WCAG 2.x)',
  '',
  'Gerado por `pnpm audit-contraste` a partir de `src/styles/tokens.css`. Texto ≥ 4,5; UI e texto grande ≥ 3.',
  'A Luz da fresta é decorativa (brilho) e não carrega informação; fica fora da tabela. Linhas finas `--cor-linha` também são decorativas.',
  '',
  '| tema | primeiro plano | fundo | razão | mínimo | resultado | uso |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...linhas.map(
    (l) =>
      `| ${l.tema} | \`${l.fg}\` ${l.hexFg} | \`${l.bg}\` ${l.hexBg} | ${fmt(l.r)} | ${fmt(l.min)} | ${l.ok ? 'ok' : '**FALHA**'} | ${l.uso} |`,
  ),
  '',
  `Resultado: ${falhas ? `**${falhas} falha(s)**` : '**todos os pares passam**'}.`,
  '',
];
await writeFile('docs/CONTRASTE.md', md.join('\n'));
for (const l of linhas)
  console.log(
    `${l.ok ? '✓' : '✗'} ${l.tema.padEnd(6)} ${fmt(l.r).padStart(6)} ≥ ${fmt(l.min)}  ${l.fg} / ${l.bg}`,
  );
console.log(falhas ? `✗ ${falhas} par(es) abaixo do mínimo` : '✓ contraste AA em todos os pares');
if (falhas) process.exit(1);
