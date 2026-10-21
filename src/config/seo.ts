import { aviso, confirmado, type Campo } from './tipos.ts';

// Tipado como Campo: o estado muda quando o domínio for registrado (Prompt D).
const dominio = aviso(
  'Domínio do site',
  'coletivoarquiteturalavina.com.br ainda não registrado; noindex até existir (pacote §A)',
  'https://coletivoarquiteturalavina.com.br',
) as Campo<string>;

export const seo = {
  idioma: 'pt-BR',
  dominio,
  tituloPadrao: confirmado('Lavina — coletivo de arquitetura', 'marca (config/marca.ts)'),
  descricaoPadrao: aviso('Descrição SEO', 'copy final nas sessões 5 e 8'),
  // Sem AggregateRating no schema (investigação §11).
  aggregateRating: false,
} as const;
