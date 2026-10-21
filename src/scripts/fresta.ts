// A Fresta acende (evento), uma vez, quando o elemento entra na tela.
// Nada acompanha o progresso do scroll. Sem JS ou com movimento reduzido, tudo já
// aparece pronto (o CSS só esconde sob :root.js + prefers-reduced-motion: no-preference).
const SELETOR = '[data-fresta-gatilho]';
const ACESO = 'esta-aceso';

function acender(el: Element): void {
  el.classList.add(ACESO);
}

function iniciar(): void {
  const raiz = document.documentElement;
  (window as Window & { __frestaOk?: boolean }).__frestaOk = true;

  const alvos = document.querySelectorAll(SELETOR);
  if (
    !('IntersectionObserver' in window) ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    alvos.forEach(acender);
    return;
  }
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        acender(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.35 },
  );
  alvos.forEach((el) => io.observe(el));
  raiz.classList.add('fresta-pronta');
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', iniciar, { once: true });
else iniciar();

export {};
