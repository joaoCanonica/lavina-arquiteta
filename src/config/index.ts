// Fonte única da config. Páginas e scripts importam daqui.
import { atuacao } from './atuacao.ts';
import { avaliacoes } from './avaliacoes.ts';
import { contato } from './contato.ts';
import { marca } from './marca.ts';
import { modulos } from './modulos.ts';
import { cauEmpresa, pessoas } from './pessoas.ts';
import { diaNoEscritorio, etapas, introducaoProcesso } from './processo.ts';
import { seo } from './seo.ts';

export const config = {
  marca,
  pessoas,
  cauEmpresa,
  contato,
  atuacao,
  avaliacoes,
  processo: { introducao: introducaoProcesso, etapas, diaNoEscritorio },
  modulos,
  seo,
};

export type Config = typeof config;

export { MODO, ehPreview } from './modo.ts';
export { termosVetados, acharTermosVetados } from './termos.ts';
export { paleta, temas } from './tema.ts';
export * from './tipos.ts';
