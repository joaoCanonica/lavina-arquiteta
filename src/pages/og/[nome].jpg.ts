// Imagens OG 1200×630, uma por rota pública, geradas no build (src/components/seo/og.ts).
import type { APIRoute, GetStaticPaths } from 'astro';
import { paginas } from '../../config/seo.ts';
import { gerarOg, ogNome } from '../../components/seo/og.ts';

export const getStaticPaths = (() =>
  Object.entries(paginas).map(([caminho, meta]) => ({
    params: { nome: ogNome(caminho) },
    props: { meta, caminho },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { meta, caminho } = props as { meta: (typeof paginas)[string]; caminho: string };
  // Na home, a tese; nas outras, o nome curto da página.
  const titulo = caminho === '/' ? 'Arquitetura com presença em cada etapa.' : meta.trilha;
  const jpg = await gerarOg(meta, titulo);
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
