// robots.txt: tudo bloqueado em preview ou sem domínio confirmado; liberado (com os robôs de IA
// e o sitemap) em produção com domínio. Texto em src/components/seo/robots.ts.
import type { APIRoute } from 'astro';
import { textoRobots } from '../components/seo/robots.ts';
import { config } from '../config/index.ts';
import { ehPreview } from '../config/modo.ts';
import { SITE_URL } from '../config/seo.ts';

export const GET: APIRoute = () =>
  new Response(textoRobots(!ehPreview && config.seo.dominio.estado === 'confirmado', SITE_URL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
