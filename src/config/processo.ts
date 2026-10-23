import { confirmado } from './tipos.ts';

const POST =
  'legenda do reel DNqdWgzOxED (22/08/2025), literal sem emojis (docs/dados/midia-legendas.json → textos.processo)';
const VIDEO =
  'rótulos queimados em um-dia-no-escritorio.mp4 (post DOd4IshDqUc), tempos medidos quadro a quadro (±1 s)';

// As 5 etapas, nas palavras dela.
export const etapas = [
  {
    n: 1,
    texto: confirmado('Reunião inicial para entender profundamente cada necessidade.', POST),
  },
  {
    n: 2,
    texto: confirmado('Estudo do espaço, da rotina e do estilo de vida dos clientes.', POST),
  },
  { n: 3, texto: confirmado('Criação do conceito, onde estética e propósito se encontram.', POST) },
  {
    n: 4,
    texto: confirmado(
      'Desenvolvimento do projeto técnico, com soluções funcionais e criativas.',
      POST,
    ),
  },
  {
    n: 5,
    texto: confirmado(
      'Acompanhamento próximo da execução para que tudo saia como planejado.',
      POST,
    ),
  },
] as const;

export const introducaoProcesso = confirmado(
  'Arquitetura é feita de detalhes e processos bem definidos.',
  POST,
);

// Um dia no escritório: rótulos do vídeo com o intervalo (s) em que aparecem.
export const diaNoEscritorio = {
  video: 'video-um-dia-no-escritorio',
  rotulos: confirmado(
    [
      { hora: '8 AM', rotulo: 'Escritório', inicio: 8, fim: 11 },
      { hora: '9 AM', rotulo: 'Alinhamento da Equipe', inicio: 14, fim: 16 },
      { hora: '10 AM', rotulo: 'Apresentação de Projeto', inicio: 23, fim: 26 },
      { hora: '11 AM', rotulo: null, inicio: 28, fim: 31 },
      { hora: '2 PM', rotulo: null, inicio: 34, fim: 37 },
      { hora: null, rotulo: 'Acompanhamento de Obra', inicio: 39, fim: 41 },
      { hora: '3 PM', rotulo: null, inicio: 42, fim: 44 },
      { hora: '4 PM', rotulo: null, inicio: 47, fim: 50 },
      { hora: '5 PM', rotulo: 'Ambientação e entrega de projeto', inicio: 52, fim: 56 },
    ],
    VIDEO,
  ),
} as const;
