import { aviso, confirmado, type Campo } from './tipos.ts';

// Tipado como Campo: o estado muda quando o domínio for registrado (Prompt D).
const dominio = aviso(
  'Domínio do site',
  'coletivoarquiteturalavina.com.br ainda não registrado; noindex até existir (pacote §A)',
  'https://coletivoarquiteturalavina.com.br',
) as Campo<string>;

type Env = { process?: { env?: Record<string, string | undefined> } };
const env = (globalThis as Env).process?.env ?? {};

/** Origem das URLs absolutas (canonical, OG, sitemap). SITE_URL no ambiente tem prioridade. */
export const SITE_URL = (
  env['SITE_URL'] ??
  dominio.valor ??
  'https://coletivoarquiteturalavina.com.br'
)
  .trim()
  .replace(/\/+$/, '');

// Metadados por rota. Título ≤ 60 e descrição ≤ 155 caracteres (conferido por audit-seo).
// Texto a partir do COPY_DECK e da config; cidade só onde há fonte.
// `og`: imagem da prévia (id do manifesto) e a natureza escrita nela.
export type MetaPagina = {
  titulo: string;
  descricao: string;
  og: { imagem: string; natureza: 'executado' | 'render' | 'retrato'; posicao?: string };
  /** nome curto na trilha (BreadcrumbList) */
  trilha: string;
};

const OBRA_JC = { imagem: 'cozinha-jc-depois-01', natureza: 'executado' } as const;

export const paginas: Record<string, MetaPagina> = {
  '/': {
    titulo: 'Lavina — coletivo de arquitetura · Interiores em Lages/SC',
    descricao:
      'Arquitetura com presença em cada etapa: interiores, iluminação e acompanhamento de obra. Escritório em Lages/SC, com projetos no Litoral Catarinense.',
    og: OBRA_JC,
    trilha: 'Início',
  },
  '/projetos/': {
    titulo: 'Projetos de interiores e reformas · Lavina',
    descricao:
      'Nove projetos: casas, consultório e clínica em Lages, Balneário Camboriú e Campo Belo do Sul. Cada imagem diz se é obra executada ou imagem 3D.',
    og: { imagem: 'cozinha-jc-depois-03', natureza: 'executado' },
    trilha: 'Projetos',
  },
  '/projetos/cozinha-jc/': {
    titulo: 'Cozinha J|C: reforma em Balneário Camboriú · Lavina',
    descricao:
      'Reforma de cozinha em Balneário Camboriú: imagem 3D do projeto, antes, obra executada e vídeo. Ilha de pedra, cristaleira iluminada e luz no forro.',
    og: { imagem: 'cozinha-jc-depois-03', natureza: 'executado' },
    trilha: 'Cozinha J|C',
  },
  '/projetos/consultorio-jonny-arruda/': {
    titulo: 'Consultório Jonny Arruda, Lages: projeto e obra · Lavina',
    descricao:
      'Consultório de ginecologia e obstetrícia em Lages: imagem 3D do projeto e obra executada no mesmo ângulo. Estantes iluminadas e mesa oval de pedra.',
    og: { imagem: 'consultorio-jonny-arruda-depois-02', natureza: 'executado' },
    trilha: 'Consultório Jonny Arruda',
  },
  '/projetos/living-jantar-painel/': {
    titulo: 'Living e jantar com painel paramétrico · Lavina',
    descricao:
      'Living e jantar com painel paramétrico em madeira, forro com sanca iluminada e cristaleira com luz. Obra executada, apresentada em vídeo.',
    og: { imagem: 'quadro-apresentacao-principal-06', natureza: 'executado' },
    trilha: 'Living e jantar',
  },
  '/projetos/cozinha-farmhouse/': {
    titulo: 'Cozinha farmhouse: obra executada · Lavina',
    descricao:
      'Cozinha farmhouse feita a partir da identidade da cliente: marcenaria azul com luz no rodapé, cristaleiras em arco e mesa redonda. Obra executada.',
    og: { imagem: 'quadro-novo-modelo-01', natureza: 'executado' },
    trilha: 'Cozinha farmhouse',
  },
  '/projetos/banheiro-tons-claros/': {
    titulo: 'Banheiro em tons claros: obra executada · Lavina',
    descricao:
      'Banheiro compacto em tons claros: espelho com luz embutida, cuba esculpida, marcenaria com puxadores dourados e banheira. Fotos da obra executada.',
    og: { imagem: 'banheiro-tons-claros-executado-03', natureza: 'executado' },
    trilha: 'Banheiro em tons claros',
  },
  '/projetos/quarto-closet/': {
    titulo: 'Quarto e closet: reforma executada · Lavina',
    descricao:
      'Reforma de quarto com closet e penteadeira integrados: arandelas na cabeceira, espelho iluminado e nichos. Obra executada, apresentada em vídeo.',
    og: { imagem: 'quadro-mostrando-quarto-05', natureza: 'executado' },
    trilha: 'Quarto e closet',
  },
  '/projetos/clinica-cordis/': {
    titulo: 'Clínica Cordis, Lages: imagens 3D do projeto · Lavina',
    descricao:
      'Consultório de cardiologia em Lages: bancada de pedra escura, marcenaria para o atendimento e um coração iluminado no painel. Imagens 3D do projeto.',
    og: { imagem: 'clinica-cordis-render-02', natureza: 'render' },
    trilha: 'Clínica Cordis',
  },
  '/projetos/projeto-tb/': {
    titulo: 'Projeto T|B, Campo Belo do Sul: imagens 3D · Lavina',
    descricao:
      'Quarto masculino em Campo Belo do Sul, com painel paramétrico em madeira e camisas expostas com luz integrada. Imagens 3D do projeto.',
    og: { imagem: 'projeto-tb-render-03', natureza: 'render', posicao: 'right' },
    trilha: 'Projeto T|B',
  },
  '/projetos/suite-fl/': {
    titulo: 'Suíte F|L, Lages: imagens 3D do projeto · Lavina',
    descricao:
      'Suíte em tons escuros, a pedido dos clientes, em Lages: cama com arandelas, roupeiro e painel de TV no mesmo tom. Imagens 3D do projeto.',
    og: { imagem: 'suite-fl-render-02', natureza: 'render' },
    trilha: 'Suíte F|L',
  },
  '/processo/': {
    titulo: 'Processo: presença em cada etapa · Lavina',
    descricao:
      'Cinco etapas, da reunião inicial ao acompanhamento da obra: estudo do espaço e da rotina, conceito e projeto técnico. Projeto fiel à execução.',
    og: { imagem: 'consultorio-jonny-arruda-depois-02', natureza: 'executado' },
    trilha: 'Processo',
  },
  '/coletivo/': {
    titulo: 'Coletivo: Amanda Lavina, Renata e Lara · Lavina',
    descricao:
      'Amanda Lavina, arquiteta líder, com Renata Nürnberg (interiores e imagens realistas) e Lara Honofre. Cada uma com sua essência, o mesmo propósito.',
    og: { imagem: 'retrato-amanda-02', natureza: 'retrato', posicao: 'top' },
    trilha: 'Coletivo',
  },
  '/contato/': {
    titulo: 'Contato e orçamento: Lages, Litoral e à distância · Lavina',
    descricao:
      'Peça um orçamento pelo WhatsApp. Escritório na Av. Pres. Vargas, 505, em Lages/SC, de segunda a sexta, das 9h às 19h. Projetos também à distância.',
    og: { imagem: 'banheiro-tons-claros-executado-03', natureza: 'executado' },
    trilha: 'Contato',
  },
  '/privacidade/': {
    titulo: 'Política de privacidade e de cookies · Lavina',
    descricao:
      'Como a Amanda Lavina Arquitetura Ltda trata dados no site: sem formulário, WhatsApp, mapa e estatística só com consentimento, e os seus direitos.',
    og: OBRA_JC,
    trilha: 'Privacidade',
  },
};

// Robôs de IA que declaram respeitar o robots.txt. Liberados (GEO): o site quer ser citado.
// Treino x busca: ver docs/SEO.md (decisão do João, se quiser bloquear só o treino).
export const robosIA = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
] as const;

export const seo = {
  idioma: 'pt-BR',
  dominio,
  tituloPadrao: confirmado('Lavina — coletivo de arquitetura', 'marca (config/marca.ts)'),
  descricaoPadrao: confirmado(paginas['/']!.descricao, 'COPY_DECK §1 (tese e subtítulo), sessão 8'),
  // Sem AggregateRating e sem Review no schema (investigação §11).
  aggregateRating: false,
} as const;
