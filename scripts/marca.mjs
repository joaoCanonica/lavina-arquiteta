// Marca: otimiza o logo (SVGO, mantendo ids e pathLength) e gera favicon e ícones
// a partir do monograma. Saídas versionadas:
//   src/components/marca/lavina-logo.svg     (usado inline pelo <Logo/>)
//   public/favicon.svg, public/icons/*.png, public/site.webmanifest
// Uso: pnpm marca
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { optimize } from 'svgo';

const ORIGINAL = 'media-originais/lavina-logo.svg';
const GRAFITE = '#1C1A18';
const OSSO = '#F4F1EC';

const bruto = await readFile(ORIGINAL, 'utf8');
const { data } = optimize(bruto, {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false, // #marca, #lavina, #subtitulo são usados pelo <Logo/>
          mergePaths: false, // cada traço é animado separado
          convertPathData: { floatPrecision: 2 },
          collapseGroups: false,
          removeUnknownsAndDefaults: { keepRoleAttr: true, keepAriaAttrs: true },
        },
      },
    },
    'removeComments',
  ],
});

// Conferências: ids e pathLength preservados.
for (const id of ['marca', 'lavina', 'subtitulo']) {
  if (!data.includes(`id="${id}"`)) throw new Error(`SVGO removeu o id ${id}`);
}
const tracos = (s) => (s.match(/pathLength="1"/g) ?? []).length;
if (tracos(data) !== tracos(bruto))
  throw new Error(`pathLength: ${tracos(bruto)} → ${tracos(data)}`);

await mkdir('src/components/marca', { recursive: true });
await writeFile('src/components/marca/lavina-logo.svg', data + '\n');

// Monograma (grupo #marca) para favicon e ícones.
const marca = data.match(/<g id="marca"[\s\S]*?<\/g>/)[0];
const VB = '110 15 105 137'; // caixa do monograma + margem do traço
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}"><style>g{color:${GRAFITE}}@media (prefers-color-scheme:dark){g{color:${OSSO}}}</style>${marca}</svg>\n`;
await writeFile('public/favicon.svg', favicon);

const icone = (tamanho, margem) => {
  const [x, y, w, h] = VB.split(' ').map(Number);
  const lado = Math.max(w, h) / (1 - margem * 2);
  const vb = `${x + w / 2 - lado / 2} ${y + h / 2 - lado / 2} ${lado} ${lado}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${tamanho}" height="${tamanho}"><rect x="${x + w / 2 - lado / 2}" y="${y + h / 2 - lado / 2}" width="${lado}" height="${lado}" fill="${GRAFITE}"/><g style="color:${OSSO}">${marca}</g></svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
};
await mkdir('public/icons', { recursive: true });
const saidas = [
  ['favicon-32.png', 32, 0.12],
  ['apple-touch-icon.png', 180, 0.18],
  ['icon-192.png', 192, 0.18],
  ['icon-512.png', 512, 0.18],
  ['icon-maskable-512.png', 512, 0.28],
];
for (const [nome, t, m] of saidas) await writeFile(`public/icons/${nome}`, await icone(t, m));

await writeFile(
  'public/site.webmanifest',
  JSON.stringify(
    {
      name: 'Lavina — coletivo de arquitetura',
      short_name: 'Lavina',
      lang: 'pt-BR',
      background_color: GRAFITE,
      theme_color: GRAFITE,
      display: 'browser',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/icons/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    null,
    2,
  ) + '\n',
);

console.log(
  `logo: ${bruto.length} → ${data.length} bytes (${Math.round((1 - data.length / bruto.length) * 100)}% menor), ${tracos(data)} traços com pathLength`,
);
