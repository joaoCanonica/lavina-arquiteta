// Medição de conversão: o clique no WhatsApp (links wa.me e o envio do seletor de orçamento).
// Só com consentimento de "estatística". Provedor: Vercel Web Analytics, servido pelo próprio
// domínio (/_vercel/insights); o script só é pedido depois do aceite e só no site publicado
// (em localhost não existe). Sem aceite: nada é carregado nem enviado.
// A forma como a Vercel trata os dados está a conferir (docs/COMPLIANCE.md).
import { permitido, quandoPermitido } from './estado.ts';

type Va = (tipo: 'event', dados: { name: string; data?: Record<string, string> }) => void;
type JanelaVa = Window & { va?: Va & { q?: unknown[] }; vaq?: unknown[] };

const SCRIPT = '/_vercel/insights/script.js';
const local = /^(localhost|127\.|\[::1\])/.test(location.hostname);

function carregar(): void {
  if (local || document.querySelector(`script[src="${SCRIPT}"]`)) return;
  const w = window as JanelaVa;
  // Fila oficial do Vercel Analytics: eventos chamados antes do script carregar não se perdem.
  w.va =
    w.va ||
    ((...args: unknown[]) => {
      (w.vaq = w.vaq || []).push(args);
    });
  const s = document.createElement('script');
  s.src = SCRIPT;
  s.defer = true;
  document.head.append(s);
}

/** Registra um evento, se a estatística foi aceita. Devolve true quando registrou. */
export function medir(nome: string, dados: Record<string, string> = {}): boolean {
  if (!permitido('estatistica')) return false;
  (window as JanelaVa).va?.('event', { name: nome, data: dados });
  // Também como evento do DOM: o teste lê daqui (e serve a outro provedor no futuro).
  document.dispatchEvent(new CustomEvent('lavina:medida', { detail: { nome, dados } }));
  return true;
}

export function iniciarMedicao(): void {
  quandoPermitido('estatistica', carregar);
  const origem = (el: Element) =>
    el.closest<HTMLElement>('[data-origem]')?.dataset['origem'] ??
    el.closest('section')?.className.split(' ')[0] ??
    'pagina';
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element).closest?.('a[href^="https://wa.me/"]');
      if (a) medir('whatsapp', { origem: origem(a), pagina: location.pathname });
    },
    { capture: true },
  );
  document.addEventListener(
    'submit',
    (e) => {
      const f = e.target as HTMLFormElement;
      if (f.action.startsWith('https://wa.me/'))
        medir('whatsapp', { origem: 'orcamento', pagina: location.pathname });
    },
    { capture: true },
  );
}
