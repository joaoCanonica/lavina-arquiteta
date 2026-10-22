// JSON-LD (schema.org) a partir da config. Tipos:
//  - escritório: LocalBusiness. ProfessionalService está descontinuado no schema.org (a página
//    do tipo manda usar LocalBusiness) e não há tipo específico para escritório de arquitetura;
//    justificativa em docs/SEO.md;
//  - WebSite e WebPage em todas as páginas; BreadcrumbList fora da home;
//  - CreativeWork nas páginas de projeto (creator: o escritório; contributor: Renata Nürnberg
//    nas imagens 3D).
// SEM AggregateRating e SEM Review (investigação §11; conferido por audit-seo).
import { config } from '../../config/index.ts';
import { SITE_URL, paginas } from '../../config/seo.ts';
import type { ProjetoPagina } from '../projetos/dados.ts';
import { nomeAutoria, projetosOrdenados } from '../projetos/dados.ts';
import { ogNome } from './og.ts';

type No = Record<string, unknown>;
const abs = (caminho: string) => `${SITE_URL}${caminho}`;
export const ID_ESCRITORIO = abs('/#escritorio');
export const ID_SITE = abs('/#site');
const ID_AMANDA = abs('/coletivo/#amanda-lavina');

const DIAS = {
  seg: 'Monday',
  ter: 'Tuesday',
  qua: 'Wednesday',
  qui: 'Thursday',
  sex: 'Friday',
  sab: 'Saturday',
  dom: 'Sunday',
} as const;

export function escritorio(): No {
  const m = config.marca;
  const c = config.contato;
  const e = c.endereco.valor;
  const amanda = config.pessoas.find((p) => p.id === 'amanda-lavina');
  const horarios = c.horarios.valor.flatMap((h) =>
    'abre' in h
      ? [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dias.map((d) => DIAS[d]),
            opens: h.abre,
            closes: h.fecha,
          },
        ]
      : [],
  );
  return {
    '@type': 'LocalBusiness',
    '@id': ID_ESCRITORIO,
    name: m.nome.valor,
    // Nome da ficha do Google e nome do Instagram.
    alternateName: ['Amanda Lavina Arquitetura', m.nomeInstagram.valor],
    legalName: m.razaoSocial.valor,
    ...(m.exibirCnpj ? { taxID: m.cnpj.valor } : {}),
    foundingDate: m.inicioAtividade.valor,
    slogan: m.tese.valor,
    description: paginas['/']!.descricao,
    url: abs('/'),
    logo: abs('/media/marca/lavina-logo.svg'),
    image: abs('/og/inicio.jpg'),
    telephone: `+${c.whatsapp.valor}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.logradouro,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: c.geo.valor.lat,
      longitude: c.geo.valor.lng,
    },
    hasMap: c.mapsUrl.valor,
    openingHoursSpecification: horarios,
    // Só as cidades com projeto ou obra comprovados (config/atuacao.ts).
    areaServed: config.atuacao.cidades.map((cid) => ({
      '@type': 'City',
      name: cid.nome.valor,
      containedInPlace: { '@type': 'State', name: 'Santa Catarina' },
    })),
    knowsAbout: ['Arquitetura de interiores', 'Projeto de iluminação', 'Acompanhamento de obra'],
    sameAs: [...c.instagram.valor.slice(0, 1).map((i) => i.url), c.mapsUrl.valor],
    founder: {
      '@type': 'Person',
      '@id': ID_AMANDA,
      name: amanda?.nome.valor ?? 'Amanda Lavina',
      jobTitle: 'Arquiteta',
      sameAs: amanda
        ? [`https://www.instagram.com/${amanda.instagram.valor.replace('@', '')}/`]
        : [],
    },
  };
}

export const site = (): No => ({
  '@type': 'WebSite',
  '@id': ID_SITE,
  url: abs('/'),
  name: config.marca.nome.valor,
  inLanguage: 'pt-BR',
  publisher: { '@id': ID_ESCRITORIO },
});

export function pagina(caminho: string, titulo: string, descricao: string, og: string): No {
  return {
    '@type': 'WebPage',
    '@id': `${abs(caminho)}#pagina`,
    url: abs(caminho),
    name: titulo,
    description: descricao,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': ID_SITE },
    about: { '@id': ID_ESCRITORIO },
    primaryImageOfPage: { '@type': 'ImageObject', url: og, width: 1200, height: 630 },
    ...(caminho !== '/' ? { breadcrumb: { '@id': `${abs(caminho)}#trilha` } } : {}),
  };
}

/** Trilha a partir dos segmentos da rota: Início › Projetos › Cozinha J|C. */
export function trilha(caminho: string): No {
  const partes = caminho.split('/').filter(Boolean);
  const itens = ['/', ...partes.map((_, i) => `/${partes.slice(0, i + 1).join('/')}/`)];
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(caminho)}#trilha`,
    itemListElement: itens.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: paginas[c]?.trilha ?? c,
      item: abs(c),
    })),
  };
}

export function obra(p: ProjetoPagina, caminho: string, descricao: string, og: string): No {
  const renderista = p.autoriaImagens.find((a) => a.tipo === 'render' && a.autor)?.autor;
  const insta = config.pessoas.find((x) => x.nome.valor === renderista)?.instagram.valor;
  return {
    '@type': 'CreativeWork',
    '@id': `${abs(caminho)}#projeto`,
    name: p.titulo,
    description: descricao,
    url: abs(caminho),
    image: og,
    inLanguage: 'pt-BR',
    genre:
      p.tipo === 'residencial'
        ? 'Arquitetura de interiores residencial'
        : 'Arquitetura de interiores para saúde',
    creator: { '@id': ID_ESCRITORIO },
    creditText: nomeAutoria(p.autoriaProjeto),
    ...(renderista
      ? {
          contributor: {
            '@type': 'Person',
            name: renderista,
            description: 'Imagens 3D do projeto',
            ...(insta ? { sameAs: [`https://www.instagram.com/${insta.replace('@', '')}/`] } : {}),
          },
        }
      : {}),
    ...(p.cidade
      ? {
          locationCreated: {
            '@type': 'City',
            name: p.cidade,
            containedInPlace: { '@type': 'State', name: 'Santa Catarina' },
          },
        }
      : {}),
    ...(p.ano ? { dateCreated: String(p.ano) } : {}),
    sameAs: p.instagram,
    mainEntityOfPage: { '@id': `${abs(caminho)}#pagina` },
  };
}

export const grafo = (nos: No[]): string =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nos }).replace(/</g, '\\u003c');

/** Grafo completo da rota (null fora do mapa de SEO: 404 e internas). */
export async function grafoDaRota(caminho: string): Promise<string | null> {
  const meta = paginas[caminho];
  if (!meta) return null;
  const og = `${SITE_URL}/og/${ogNome(caminho)}.jpg`;
  const nos: No[] = [site(), escritorio(), pagina(caminho, meta.titulo, meta.descricao, og)];
  if (caminho !== '/') nos.push(trilha(caminho));
  const slug = caminho.match(/^\/projetos\/([^/]+)\/$/)?.[1];
  if (slug) {
    const p = (await projetosOrdenados()).find((x) => x.slug === slug);
    if (p) nos.push(obra(p, caminho, meta.descricao, og));
  }
  return grafo(nos);
}

/** Rota normalizada com barra final ("/404" → "/404/"). */
export const rotaNormal = (pathname: string): string =>
  pathname.endsWith('/') ? pathname : `${pathname}/`;
