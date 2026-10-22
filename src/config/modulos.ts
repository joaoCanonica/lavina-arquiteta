// Liga/desliga blocos do site. Mudar aqui, nunca nas páginas.
export const modulos = {
  comparadorProjetoExecutado: true,
  comparadorAntesDepois: true,
  avaliacoesGoogle: true,
  mapaAtuacao: true,
  // Mapa do Google: só depois do consentimento "mapas" (components/consentimento/Mapa.astro).
  mapaInterativo: true,
  // Instagram: só links. Nenhum embed nem script da Meta (sessão 7).
  blocoInstagram: false,
  videosComSom: true,
  loopAbertura: true,
} as const;

export type Modulo = keyof typeof modulos;
