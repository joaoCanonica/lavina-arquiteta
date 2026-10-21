// Tokens de cor (CLAUDE.md §4). Calibração e validação AA na sessão 3.
export const paleta = {
  grafite: '#1C1A18',
  osso: '#F4F1EC',
  travertino: '#E6DED2',
  greige: '#A79C8F',
  freijo: '#8A6A4F',
  luz: '#F7D9A8', // só como luz: fresta, foco, glow
} as const;

export const temas = {
  claro: {
    fundo: paleta.osso,
    superficie: paleta.travertino,
    texto: paleta.grafite,
    linha: paleta.greige,
    luz: paleta.luz,
  },
  escuro: {
    fundo: paleta.grafite,
    superficie: '#24211E',
    texto: paleta.osso,
    linha: paleta.greige,
    luz: paleta.luz,
  },
} as const;
