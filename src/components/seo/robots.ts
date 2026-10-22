// Texto do robots.txt (função pura: a rota usa, o audit-seo confere os dois modos).
//  - sem indexação (preview ou sem domínio confirmado): bloqueia tudo;
//  - indexável: libera tudo, inclusive os robôs de IA que respeitam o robots.txt (grupo
//    próprio, para documentar; decisão em docs/SEO.md), fecha só as páginas internas e aponta
//    o sitemap. /og/ fica liberado: os robôs das redes sociais (que respeitam o robots.txt)
//    precisam buscar a imagem da prévia.
import { robosIA } from '../../config/seo.ts';

export const ROTAS_INTERNAS = ['/_sistema/', '/_pendencias/'] as const;

export function textoRobots(indexavel: boolean, siteUrl: string): string {
  const internas = ROTAS_INTERNAS.map((r) => `Disallow: ${r}`);
  const linhas = indexavel
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
        `Sitemap: ${siteUrl}/sitemap.xml`,
      ]
    : [
        '# Lavina — coletivo de arquitetura (PRÉVIA: sem indexação até o domínio definitivo)',
        'User-agent: *',
        'Disallow: /',
      ];
  return linhas.join('\n') + '\n';
}
