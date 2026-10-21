// Liga/desliga blocos do site. Mudar aqui, nunca nas páginas.
export const modulos = {
  comparadorProjetoExecutado: true,
  comparadorAntesDepois: true,
  avaliacoesGoogle: true,
  mapaAtuacao: true,
  // Mapa e Instagram externos só depois do consentimento (LGPD; sessão 7).
  mapaInterativo: false,
  blocoInstagram: false,
  videosComSom: true,
  loopAbertura: true,
} as const;

export type Modulo = keyof typeof modulos;
