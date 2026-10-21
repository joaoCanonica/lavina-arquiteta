import { confirmado } from './tipos.ts';

// Só cidades com prova. Nada de "região" inventada.
export const atuacao = {
  sede: 'lages',
  regiao: confirmado(
    'Litoral Catarinense',
    'CLAUDE.md §1 (João); posts marcados em Balneário Camboriú',
  ),
  cidades: [
    {
      id: 'lages',
      nome: confirmado(
        'Lages',
        'Receita Federal e Google Maps (sede); posts DSGdwDDj4Kv e DdY8lWNlqx7',
      ),
      uf: 'SC',
      papel: 'sede',
    },
    {
      id: 'balneario-camboriu',
      nome: confirmado(
        'Balneário Camboriú',
        'marcação dos posts da Cozinha J|C (DZIFaXyFq8k, DZ5PcHNDj3R)',
      ),
      uf: 'SC',
      papel: 'obras',
    },
    {
      id: 'urubici',
      nome: confirmado('Urubici', 'avaliação Google de Daniela Gerber ("cabana em Urubici-SC")'),
      uf: 'SC',
      papel: 'obras',
    },
    {
      id: 'campo-belo-do-sul',
      nome: confirmado('Campo Belo do Sul', 'marcação do post do Projeto T|B (DcOmO3WFqjk)'),
      uf: 'SC',
      papel: 'obras',
    },
  ],
} as const;
