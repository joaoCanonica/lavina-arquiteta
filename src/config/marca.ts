import { aviso, confirmado } from './tipos.ts';

const RECEITA = 'Receita Federal via BrasilAPI, CNPJ 52.116.202/0001-05 (investigação §2)';

export const marca = {
  nome: confirmado('Lavina — coletivo de arquitetura', 'pacote de prompts §A (decisão do João)'),
  nomeInstagram: confirmado(
    'Lavina | Coletivo de Arquitetura',
    'Instagram @lavina.co.arq (investigação §2)',
  ),
  razaoSocial: confirmado('Amanda Lavina Arquitetura Ltda', RECEITA),
  cnpj: confirmado('52.116.202/0001-05', RECEITA),
  exibirCnpj: true,
  inicioAtividade: confirmado('2023-09-08', RECEITA),
  logo: {
    original: confirmado(
      'media-originais/lavina-logo.svg',
      'logo reconstruído do vídeo (pacote §A)',
    ),
    publico: '/media/marca/lavina-logo.svg',
    validacao: aviso(
      'Logo validado pela Amanda',
      'o SVG foi reconstruído a partir do vídeo; falta o arquivo original da marca',
    ),
  },
  tese: confirmado('Arquitetura com presença em cada etapa.', 'bio do Instagram @lavina.co.arq'),
  subtese: confirmado(
    'Projetos personalizados + acompanhamento de obra',
    'bio do Instagram @lavina.co.arq',
  ),
  pilares: [
    {
      id: 'presenca',
      titulo: 'Presença do primeiro encontro à entrega',
      citacao: confirmado(
        'Arquitetura com presença em cada etapa',
        'bio do Instagram; avaliação Google de Roberta S.: "Acompanha a obra de perto"',
      ),
    },
    {
      id: 'fiel',
      titulo: 'Projeto fiel à execução',
      citacao: confirmado(
        'o quanto o projeto ficou fiel a execução!',
        'legenda do post DZn_e-qOnLN (Cozinha J|C); comentário de Renata Nürnberg: "100% fiel ao projeto!"',
      ),
    },
    {
      id: 'identidade',
      titulo: 'O projeto parte da identidade do cliente',
      citacao: confirmado(
        'Aqui, a cliente não precisou se adaptar ao estilo do escritório. O projeto foi construído a partir da identidade dela.',
        'legenda do post DeHe75fOqIA (cozinha farmhouse)',
      ),
    },
    {
      id: 'viver',
      titulo: 'Projetar pra viver, não pra impressionar',
      citacao: confirmado(
        'Hoje eu não projeto mais pra impressionar, eu projeto pra viver.',
        'post DXzMwBRFUox de Amanda Lavina (docs/LAVINA_MAPA_MIDIA_LEGENDAS.md, frases literais)',
      ),
    },
    {
      id: 'luz',
      titulo: 'Luz como matéria do projeto',
      citacao: confirmado(
        'A paleta neutra e o porcelanato suave refletem luz, ampliam a percepção do espaço',
        'legenda do post DVcLRsXDpYJ (banheiro); luz embutida em quase todo projeto (investigação §10)',
      ),
    },
  ],
} as const;
