// robots.txt. Enquanto for preview ou não houver domínio confirmado: tudo bloqueado (e noindex
// nas páginas). Com domínio e em produção: tudo liberado, inclusive os robôs de IA que respeitam
// o robots.txt (lista em src/config/seo.ts; decisão documentada em docs/SEO.md), e o sitemap.
import type { APIRoute } from 'astro';
import { config } from '../config/index.ts';
import { ehPreview } from '../config/modo.ts';
import { SITE_URL, robosIA } from '../config/seo.ts';

export const GET: APIRoute = () => {
  const indexavel = !ehPreview && config.seo.dominio.estado === 'confirmado';
  const internas = ['/_sistema/', '/_pendencias/', '/og/'].map((r) => `Disallow: ${r}`);
  const texto = indexavel
    ? [
        '# Lavina — coletivo de arquitetura',
        'User-agent: *',
        'Allow: /',
        ...internas,
        '',
        '# Robôs de IA (busca, citação e treino) que respeitam o robots.txt: liberados.',
        ...robosIA.map((r) => `User-agent: ${r}`),
        'Allow: /',
        ...internas,
        '',
        `Sitemap: ${SITE_URL}/sitemap.xml`,
      ]
    : [
        '# Lavina — coletivo de arquitetura (PRÉVIA: sem indexação até o domínio definitivo)',
        'User-agent: *',
        'Disallow: /',
      ];
  return new Response(texto.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
