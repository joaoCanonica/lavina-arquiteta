// Texto da mensagem do WhatsApp (sem import de config: entra também no JS do navegador).
// Sem dado sensível; a pessoa completa o que faltar.
export const LACUNA = '___';

export const mensagemWhatsapp = (tipo: string = LACUNA, cidade: string = LACUNA): string =>
  `Olá! Gostaria de conversar sobre um projeto.\nTipo de projeto: ${tipo}\nCidade: ${cidade}\nVim pelo site.`;
