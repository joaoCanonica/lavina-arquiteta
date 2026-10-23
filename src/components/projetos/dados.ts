// Dados de apresentação das páginas /projetos e /projetos/[slug].
// Fonte: coleção "projetos" (src/config), media.manifest.json, docs/dados/pares.json,
// public/media/midia.json e o COPY_DECK §4 (citações com post de origem). Nada inventado.
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import manifesto from '../../../media.manifest.json';
import type { Projeto } from '../../config/projeto-schema.ts';

export type NaturezaExibida = 'executado' | 'render' | 'antes' | 'video';

type Registro = {
  id: string;
  natureza: string;
  descricao?: string;
  publicavel?: boolean;
  post?: { codigo?: string; url?: string };
};
type Entrada = { largura: number; altura: number; fontes: { largura: number; avif: string }[] };
type Indice = {
  imagens: Record<string, Entrada>;
  quadros: Record<string, Entrada>;
};
type Par = {
  id: string;
  tipo: 'projeto-executado' | 'antes-depois';
  aceito: boolean;
  proporcao?: '4:5' | '3:2';
};

const registros = new Map((manifesto.registros as Registro[]).map((r) => [r.id, r] as const));
const indice = JSON.parse(readFileSync('public/media/midia.json', 'utf8')) as Indice;
const pares = new Map(
  (JSON.parse(readFileSync('docs/dados/pares.json', 'utf8')) as { pares: Par[] }).pares.map(
    (p) => [p.id, p] as const,
  ),
);

// Ordem pedida: Cozinha J|C e Consultório primeiro, depois as obras executadas, depois as
// imagens 3D (dentro de cada grupo, pelo destaque).
const PESO = { misto: 0, executado: 1, render: 2 } as const;
const PRIMEIROS = ['cozinha-jc', 'consultorio-jonny-arruda'];

export const TIPO = { residencial: 'Residencial', 'saude-comercial': 'Saúde e comercial' } as const;

// Capa (imagem de destaque) de cada projeto. Projeto T|B: a vista com camisas fica fora da capa.
type Capa = { id: string; alt: string; posicao?: string };
const CAPAS: Record<string, Capa> = {
  'cozinha-jc': {
    id: 'cozinha-jc-depois-03',
    alt: 'Cozinha J|C executada: ilha de pedra e cristaleira iluminada',
    posicao: '50% 62%',
  },
  'consultorio-jonny-arruda': {
    id: 'consultorio-jonny-arruda-depois-02',
    alt: 'Consultório Jonny Arruda executado: mesa oval de pedra e estante iluminada',
    posicao: '50% 55%',
  },
  'living-jantar-painel': {
    id: 'quadro-apresentacao-principal-06',
    alt: 'Living com painel paramétrico de madeira e TV (quadro do vídeo)',
  },
  'cozinha-farmhouse': {
    id: 'quadro-novo-modelo-01',
    alt: 'Cozinha farmhouse: mesa redonda e cristaleiras em arco (quadro do vídeo)',
  },
  'banheiro-tons-claros': {
    id: 'banheiro-tons-claros-executado-03',
    alt: 'Banheiro em tons claros: bancada e espelho com luz embutida',
    posicao: '50% 45%',
  },
  'quarto-closet': {
    id: 'quadro-mostrando-quarto-05',
    alt: 'Quarto e closet: closet de portas claras e penteadeira (quadro do vídeo)',
  },
  'clinica-cordis': {
    id: 'clinica-cordis-render-02',
    alt: 'Imagem 3D da Clínica Cordis: mesa e painel com o coração iluminado',
  },
  'projeto-tb': {
    id: 'projeto-tb-render-03',
    alt: 'Imagem 3D do Projeto T|B: cama e forro paramétrico em madeira',
    posicao: '58% 50%',
  },
  'suite-fl': {
    id: 'suite-fl-render-02',
    alt: 'Imagem 3D da Suíte F|L: vista geral em tons escuros',
  },
};

// Citação de cada projeto (COPY_DECK §4), literal e com o post de origem.
// Cordis: o deck pede para não citar enquanto a foto da obra não entrar.
type Citacao = { texto: string; autor: string; post: string; nota?: string };
const CITACOES: Record<string, Citacao> = {
  'consultorio-jonny-arruda': {
    texto: 'Eu amei esse resultado final, 100% fiel ao projeto!',
    autor: 'Renata Nürnberg',
    post: 'DTqJY19jgis',
    nota: 'comentário no post',
  },
  'cozinha-jc': {
    texto:
      'Não existe acaso em um projeto bem executado. Cada escolha tem um motivo. Cada detalhe tem uma função.',
    autor: 'Lavina — coletivo de arquitetura',
    post: 'DZn_e-qOnLN',
  },
  'living-jantar-painel': {
    texto: 'Nosso ambiente mais aconchegante! Da idéia a realização!',
    autor: 'Cliente',
    post: 'DKuagnAMU8P',
    nota: 'comentário no post, grafia original',
  },
  'cozinha-farmhouse': {
    texto: 'O projeto ficou exatamente do jeitinho que eu sonhava e imaginava.',
    autor: 'Cliente',
    post: 'DeHe75fOqIA',
    nota: 'comentário no post',
  },
  'banheiro-tons-claros': {
    texto: 'Esse banheiro é um respiro.',
    autor: 'Amanda Lavina',
    post: 'DVcLRsXDpYJ',
    nota: 'comentário no post',
  },
};

// Detalhes de cada projeto (COPY_DECK §4).
const DETALHES: Record<string, string[]> = {
  'consultorio-jonny-arruda': [
    'Estantes com luz embutida',
    'Mesa oval de pedra',
    'Painel de madeira na sala de exame',
  ],
  'cozinha-jc': [
    'Linha de luz embutida no forro',
    'Torre de fornos e refrigerador embutidos',
    'Ilha de pedra e cristaleira iluminada',
  ],
  'living-jantar-painel': [
    'Painel paramétrico em madeira',
    'Forro de madeira com sanca iluminada',
    'Cristaleira com luz embutida',
    'Mesa redonda de jantar',
  ],
  'clinica-cordis': [
    'Coração iluminado integrado ao painel',
    'Bancada de pedra escura',
    'Recepção com curvas e luz',
  ],
  'cozinha-farmhouse': [
    'Marcenaria azul com luz no rodapé',
    'Cristaleiras em arco iluminadas',
    'Mesa redonda',
    'Bar em arco',
  ],
  'banheiro-tons-claros': [
    'Espelho com luz embutida',
    'Cuba esculpida',
    'Marcenaria com puxadores dourados',
    'Banheira',
  ],
  'quarto-closet': [
    'Arandelas na cabeceira',
    'Penteadeira com espelho iluminado',
    'Closet integrado',
    'Nichos para perfumes e objetos',
  ],
  'projeto-tb': [
    'Painel paramétrico em madeira',
    'Camisas expostas com iluminação integrada',
    'Tons sóbrios, madeira e tecidos',
  ],
  'suite-fl': [
    'Cama com arandelas',
    'Roupeiro',
    'Painel de TV',
    'Tons escuros, a pedido dos clientes',
  ],
};

// Legenda do vídeo de cada projeto (sem nomear quem não está confirmado).
const LEGENDAS_VIDEO: Record<string, string> = {
  'cozinha-jc': 'A cozinha executada, apresentada em vídeo.',
  'living-jantar-painel': 'Amanda Lavina apresenta o living e o jantar.',
  'quarto-closet': 'Quarto, closet e penteadeira, apresentados em vídeo.',
  'cozinha-farmhouse': 'A cozinha farmhouse executada, apresentada em vídeo.',
};

// Legendas que a descrição do manifesto não resolve (faixas recortadas do selo).
const LEGENDAS: Record<string, string> = {
  'cozinha-jc-depois-04': 'Detalhe: a linha de luz embutida no forro',
  'consultorio-jonny-arruda-depois-04': 'Detalhe: o armário curvo e a linha de luz no forro',
};

// Textos alternativos dos comparadores (mesmo ângulo nas duas imagens).
const ALT_PARES: Record<string, [string, string]> = {
  'cozinha-projeto-executado-fornos': [
    'Imagem 3D do projeto da Cozinha J|C: janela, pia, cooktop, torre de fornos e refrigerador',
    'Cozinha J|C executada no mesmo ângulo: marcenaria clara, torre de fornos e refrigerador',
  ],
  'cozinha-antes-depois': [
    'Cozinha J|C antes da reforma: armários antigos, bancada e ilha de granito, piso cerâmico',
    'Cozinha J|C depois, no mesmo ângulo: marcenaria clara, torre de fornos, refrigerador e ilha de pedra',
  ],
  'cozinha-antes-depois-alternativo': [
    'Cozinha J|C antes da reforma, vista da janela um pouco mais à esquerda',
    'Cozinha J|C depois, no mesmo ângulo: marcenaria clara e ilha de pedra',
  ],
  'consultorio-projeto-executado-mesa': [
    'Imagem 3D do projeto do Consultório Jonny Arruda: armário curvo, pia, estantes iluminadas e mesa oval',
    'Consultório Jonny Arruda executado no mesmo ângulo',
  ],
  'consultorio-projeto-executado-estantes': [
    'Imagem 3D do projeto do Consultório Jonny Arruda: estantes iluminadas, janela com persiana e mesa',
    'Consultório Jonny Arruda executado: as mesmas estantes, a janela e a mesa',
  ],
  'consultorio-antes-depois-pia': [
    'Consultório antes da reforma: parede da pia com o dispenser',
    'Consultório depois, na mesma parede: pia, dispenser e marcenaria nova',
  ],
};
const TITULO_PAR = {
  'projeto-executado': 'Imagem 3D do projeto × Obra executada',
  'antes-depois': 'Antes × Depois',
} as const;

export type ItemGaleria = {
  id: string;
  natureza: NaturezaExibida;
  legenda: string;
  alt: string;
  formato: 'retrato' | 'paisagem' | 'faixa' | 'pequena';
  quadro: boolean;
};
export type GrupoGaleria = { natureza: NaturezaExibida; titulo: string; itens: ItemGaleria[] };
export type Comparador = {
  par: string;
  tipo: 'projeto-executado' | 'antes-depois';
  proporcao: '4:5' | '3:2';
  titulo: string;
  altA: string;
  altB: string;
};

export type ProjetoPagina = Projeto & {
  ordem: number;
  capa: Capa & { natureza: NaturezaExibida; largura: number; altura: number; quadro: boolean };
  naturezas: NaturezaExibida[]; // naturezas de imagem presentes (para o índice e a ficha)
  filtros: string[]; // residencial | saude | executados | imagens-3d
  soRender: boolean;
  soVideo: boolean;
  citacao: Citacao | null;
  detalhes: string[];
  legendaVideo: string | null;
  video: { id: string; post: string | null } | null;
  galeria: GrupoGaleria[];
  comparadores: Comparador[];
  posts: { codigo: string; url: string }[];
  proximo: string;
};

const natExibida = (n: string): NaturezaExibida =>
  n === 'depois' ? 'executado' : n === 'quadro-de-video' ? 'executado' : (n as NaturezaExibida);

// "mesa oval de pedra + estantes iluminadas (capa)" → "Mesa oval de pedra e estantes iluminadas"
function limparDescricao(d: string): string {
  const s = d
    .replace(/\s*\((?:[^)]*\d[^)]*|[^)]*capa[^)]*|[^)]*qualidade[^)]*)\)/gi, '')
    .replace(/\s\+\s/g, ' e ')
    .replace(/:\s/, ': ')
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formato(e: Entrada): ItemGaleria['formato'] {
  const r = e.largura / e.altura;
  if (r > 2) return 'faixa';
  if (e.largura < 800) return 'pequena';
  return r > 1.15 ? 'paisagem' : 'retrato';
}

const TITULO_GRUPO: Record<NaturezaExibida, string> = {
  render: 'Imagem 3D do projeto',
  antes: 'Antes',
  executado: 'Obra executada',
  video: 'Vídeo',
};

function montar(p: Projeto, ordem: number, proximo: string): ProjetoPagina {
  const capaBase = CAPAS[p.slug];
  if (!capaBase) throw new Error(`projeto "${p.slug}" sem capa em dados.ts`);
  const capaReg = registros.get(capaBase.id);
  const capaImg = indice.imagens[capaBase.id] ?? indice.quadros[capaBase.id];
  if (!capaReg || !capaImg) throw new Error(`capa "${capaBase.id}" ausente`);

  const soVideo = p.videos.length > 0 && !p.midia.some((id) => !id.startsWith('quadro-'));
  // Galeria: tudo o que é publicável, menos a capa. Na Cozinha J|C, os quadros automáticos
  // do vídeo ficam fora (há fotos da obra); nos projetos só em vídeo, os quadros são a galeria.
  const itens: ItemGaleria[] = [];
  for (const id of p.midia) {
    if (id === capaBase.id) continue;
    const r = registros.get(id);
    const e = indice.imagens[id] ?? indice.quadros[id];
    if (!r || !e || r.publicavel === false) continue;
    const quadro = id.startsWith('quadro-');
    if (quadro && !soVideo) continue;
    const legenda =
      LEGENDAS[id] ?? limparDescricao(r.descricao ?? '') + (quadro ? ' (quadro do vídeo)' : '');
    itens.push({
      id,
      natureza: natExibida(r.natureza),
      legenda,
      alt: `${p.titulo}: ${legenda.charAt(0).toLowerCase()}${legenda.slice(1)}`,
      formato: formato(e),
      quadro,
    });
  }
  const ordemGrupos: NaturezaExibida[] = ['render', 'antes', 'executado'];
  const galeria = ordemGrupos
    .map((n) => ({
      natureza: n,
      titulo: TITULO_GRUPO[n],
      itens: itens.filter((i) => i.natureza === n),
    }))
    .filter((g) => g.itens.length > 0);

  const naturezas = [
    ...new Set([
      ...p.midia.map((id) => natExibida(registros.get(id)?.natureza ?? 'executado')),
      ...p.pares.flatMap((id) =>
        pares.get(id)?.tipo === 'antes-depois' ? (['antes'] as const) : [],
      ),
    ]),
  ].filter((n): n is NaturezaExibida => ['render', 'antes', 'executado'].includes(n));
  naturezas.sort((a, b) => ordemGrupos.indexOf(a) - ordemGrupos.indexOf(b));
  if (p.videos.length) naturezas.push('video');

  const filtros = [p.tipo === 'residencial' ? 'residencial' : 'saude'];
  if (naturezas.includes('executado')) filtros.push('executados');
  if (naturezas.includes('render')) filtros.push('imagens-3d');

  const comparadores: Comparador[] = p.pares.flatMap((id) => {
    const par = pares.get(id);
    const alt = ALT_PARES[id];
    if (!par?.aceito || !par.proporcao || !alt) return [];
    return [
      {
        par: id,
        tipo: par.tipo,
        proporcao: par.proporcao,
        titulo: TITULO_PAR[par.tipo],
        altA: alt[0],
        altB: alt[1],
      },
    ];
  });

  const posts = p.instagram.map((url) => ({
    url,
    codigo: url.replace(/^https:\/\/www\.instagram\.com\/(p|reel)\//, '').replace(/\/$/, ''),
  }));

  return {
    ...p,
    ordem,
    capa: {
      ...capaBase,
      natureza: natExibida(capaReg.natureza),
      largura: capaImg.largura,
      altura: capaImg.altura,
      quadro: capaBase.id.startsWith('quadro-'),
    },
    naturezas,
    filtros,
    soRender: p.natureza === 'render',
    soVideo,
    citacao: CITACOES[p.slug] ?? null,
    detalhes: DETALHES[p.slug] ?? [],
    legendaVideo: LEGENDAS_VIDEO[p.slug] ?? null,
    video: p.videos[0]
      ? { id: p.videos[0], post: registros.get(p.videos[0])?.post?.url ?? null }
      : null,
    galeria,
    comparadores,
    posts,
    proximo,
  };
}

let cache: ProjetoPagina[] | null = null;
export async function projetosOrdenados(): Promise<ProjetoPagina[]> {
  if (cache) return cache;
  const lista = (await getCollection('projetos'))
    .map((e) => e.data)
    .sort((a, b) => {
      const pa = PRIMEIROS.indexOf(a.slug);
      const pb = PRIMEIROS.indexOf(b.slug);
      if (pa >= 0 || pb >= 0) return (pa < 0 ? 99 : pa) - (pb < 0 ? 99 : pb);
      return PESO[a.natureza] - PESO[b.natureza] || b.destaque - a.destaque;
    });
  cache = lista.map((p, i) => montar(p, i, lista[(i + 1) % lista.length]!.slug));
  return cache;
}

// Texto do projeto: "abertura\n\n**O pedido.** …\n\n**A resposta do projeto.** …"
export function partesTexto(texto: string): { abertura: string; pedido: string; resposta: string } {
  const blocos = texto.split(/\n\n+/);
  const achar = (rotulo: string) =>
    blocos
      .find((b) => b.startsWith(`**${rotulo}.**`))
      ?.replace(`**${rotulo}.**`, '')
      .trim() ?? '';
  return {
    abertura: blocos.find((b) => !b.startsWith('**')) ?? '',
    pedido: achar('O pedido'),
    resposta: achar('A resposta do projeto'),
  };
}

// Nome da marca como no copy deck ("Lavina | Coletivo de Arquitetura" → "Lavina — coletivo de arquitetura").
export const nomeAutoria = (s: string) =>
  s.replace('Lavina | Coletivo de Arquitetura', 'Lavina — coletivo de arquitetura');

// srcset AVIF de uma imagem (preload da imagem de destaque).
export function srcsetAvif(id: string): string | null {
  const e = indice.imagens[id] ?? indice.quadros[id];
  return e ? e.fontes.map((f) => `${f.avif} ${f.largura}w`).join(', ') : null;
}

// view-transition-name da imagem de destaque (índice ↔ abertura ↔ próximo projeto).
export const nomeTransicao = (slug: string) => `projeto-${slug}`;
