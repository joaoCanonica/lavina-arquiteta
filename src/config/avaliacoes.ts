import { aviso, confirmado, type Aviso } from './tipos.ts';

const FICHA =
  'ficha "Amanda Lavina Arquitetura" no Google Maps, conferida em 20/10/2026 (investigação §9)';

export const avaliacoes = {
  google: {
    nota: confirmado(5.0, FICHA),
    total: confirmado(15, FICHA),
    conferidoEm: '2026-10-20',
    url: 'https://www.google.com/maps/place/Amanda+Lavina+Arquitetura/@-27.8109211,-50.3161973,17z',
  },
  // Trechos literais (sem superlativo), com nome e inicial. Números = linha da tabela §9.
  trechos: [
    {
      n: 4,
      autor: 'Jane W.',
      texto: confirmado(
        'Fez a reforma da nossa casa, em Lages/SC- e nós morando em outro estado (MS). Fez o projeto, providenciou materiais, mão de obra e acompanhou a execução. Muito cuidadosa com orçamentos, opções de materiais e sempre disponível.',
        FICHA,
      ),
    },
    {
      n: 5,
      autor: 'Luísa W.',
      texto: confirmado(
        'Eu me mudei de apartamento e ela prestou consultoria à distância, me auxiliando em todas as etapas de renovação e decoração. Sempre disponível, respondendo com agilidade',
        FICHA,
      ),
    },
    {
      n: 7,
      autor: 'Isabel S.',
      texto: confirmado(
        'atende em Lages/SC, mas que também faz projetos e acompanhamento de obra em outras cidades.',
        FICHA,
      ),
    },
    {
      n: 9,
      autor: 'Roberta S.',
      texto: confirmado(
        'Projetos de muita elegância e bom gosto. Acompanha a obra de perto e é extremamente exigente com o resultado final.',
        FICHA,
      ),
    },
  ],
} as const;

const DIA = 24 * 60 * 60 * 1000;

// Nota do Google conferida há mais de 90 dias vira aviso (reconferir antes de publicar).
export function avisoValidadeGoogle(hoje: Date = new Date()): Aviso<never> | null {
  const dias = Math.floor(
    (hoje.getTime() - new Date(`${avaliacoes.google.conferidoEm}T00:00:00Z`).getTime()) / DIA,
  );
  return dias > 90
    ? aviso(
        'Nota do Google desatualizada',
        `conferida há ${dias} dias (${avaliacoes.google.conferidoEm}); reconferir`,
      )
    : null;
}
