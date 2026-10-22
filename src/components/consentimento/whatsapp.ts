// Link do WhatsApp com a mensagem única do site (uso no servidor).
import { config } from '../../config/index.ts';
import { linkWhatsapp } from '../../config/contato.ts';
import { mensagemWhatsapp } from './mensagem.ts';

export { mensagemWhatsapp };

/** Link wa.me com a mensagem montada (tipo e cidade em branco, se não vierem). */
export const linkOrcamento = (tipo?: string, cidade?: string): string =>
  linkWhatsapp(config.contato.whatsapp.valor, mensagemWhatsapp(tipo, cidade));
