// Imagem OG 1200×630 gerada no build (sharp): painel grafite com o logo, o nome da página e o
// rótulo de natureza da foto, a fresta acesa saindo para a foto real do projeto à direita.
// Texto em Urbanist (TTF desta pasta, OFL): não depende das fontes da máquina de build.
// A foto vem dos derivados (public/media/midia.json); nenhuma edição além do recorte.
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import manifesto from '../../../media.manifest.json';
import logoSvg from '../marca/lavina-logo.svg?raw';
import type { MetaPagina } from '../../config/seo.ts';

export const OG = { largura: 1200, altura: 630 } as const;
const PAINEL = 400;
// Caminho a partir da raiz do projeto (o build roda nela, como o resto do pipeline de mídia).
const FONTE = 'src/components/seo/urbanist-og.ttf';
const COR = { grafite: '#1C1A18', osso: '#F4F1EC', greige: '#A79C8F', luz: '#F7D9A8' };

type Entrada = { largura: number; fontes: { largura: number; webp: string }[] };
type Indice = { imagens: Record<string, Entrada>; quadros: Record<string, Entrada> };

/** Nome do arquivo OG de uma rota: "/" → inicio, "/projetos/x/" → projeto-x. */
export const ogNome = (caminho: string): string => {
  const partes = caminho.split('/').filter(Boolean);
  if (!partes.length) return 'inicio';
  if (partes[0] === 'projetos' && partes[1]) return `projeto-${partes[1]}`;
  return partes.join('-');
};

const escapar = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function texto(markup: string, fonte: string, largura?: number) {
  return sharp({
    text: {
      text: markup,
      font: fonte,
      fontfile: FONTE,
      rgba: true,
      dpi: 72,
      ...(largura ? { width: largura, wrap: 'word' as const } : {}),
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

export async function gerarOg(meta: MetaPagina, titulo: string): Promise<Buffer> {
  const indice = JSON.parse(readFileSync('public/media/midia.json', 'utf8')) as Indice;
  const img = indice.imagens[meta.og.imagem] ?? indice.quadros[meta.og.imagem];
  if (!img) throw new Error(`OG: mídia "${meta.og.imagem}" não existe em midia.json`);
  const maior = img.fontes.reduce((a, b) => (b.largura > a.largura ? b : a));
  const foto = await sharp(`public${maior.webp}`)
    .resize(OG.largura - PAINEL, OG.altura, {
      fit: 'cover',
      position: meta.og.posicao ?? 'attention',
    })
    .toBuffer();

  const logo = await sharp(Buffer.from(logoSvg), { density: 220 })
    .resize({ width: 150 })
    .png()
    .toBuffer();

  const rotulo = (manifesto.rotulos as Record<string, string>)[meta.og.natureza] ?? '';
  const nome = await texto(
    `<span foreground="${COR.osso}">${escapar(titulo)}</span>`,
    'Urbanist Light 44',
    PAINEL - 96,
  );
  const etiqueta = await texto(
    `<span foreground="${COR.greige}" letter_spacing="2600">${escapar(rotulo.toUpperCase())}</span>`,
    'Urbanist SemiBold 15',
  );

  // A fresta: linha fina e quente, com halo desfocado, saindo do painel e entrando na foto.
  const yFresta = 548;
  const fresta = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.largura}" height="${OG.altura}">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="${COR.luz}" stop-opacity="0"/>
          <stop offset="0.08" stop-color="${COR.luz}" stop-opacity="0.9"/>
          <stop offset="0.6" stop-color="#FFF4E0" stop-opacity="1"/>
          <stop offset="1" stop-color="${COR.luz}" stop-opacity="0"/>
        </linearGradient>
        <filter id="b" x="-10%" y="-400%" width="120%" height="900%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <rect x="48" y="${yFresta - 4}" width="640" height="8" fill="url(#g)" opacity="0.55" filter="url(#b)"/>
      <rect x="48" y="${yFresta - 1}" width="640" height="2" fill="url(#g)"/>
    </svg>`,
  );

  return sharp({
    create: { width: OG.largura, height: OG.altura, channels: 3, background: COR.grafite },
  })
    .composite([
      { input: foto, left: PAINEL, top: 0 },
      { input: logo, left: 52, top: 52 },
      { input: nome.data, left: 52, top: Math.max(250, 470 - nome.info.height) },
      { input: etiqueta.data, left: 52, top: yFresta - 40 },
      { input: fresta, left: 0, top: 0 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
}
