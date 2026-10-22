// sitemap.xml: só as rotas públicas do mapa de SEO (src/config/seo.ts), com URL absoluta
// a partir de SITE_URL. Sem <lastmod>: o site não tem data confiável por página.
import type { APIRoute } from 'astro';
import { SITE_URL, paginas } from '../config/seo.ts';

export const GET: APIRoute = () => {
  const urls = Object.keys(paginas)
    .map((c) => `  <url><loc>${SITE_URL}${c}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
