// Entrada da home. A sequência é CSS (html.entrada-ativa); aqui só:
//  - calcula o destino do logo (FLIP até o logo do cabeçalho);
//  - Pular por botão, clique/toque na camada e Esc;
//  - encerra em ~3,3 s (ou na hora, ao pular) e devolve o foco se ele estava no "Pular".
const raiz = document.documentElement;
const DURACAO = 3300;

function iniciar(): void {
  if (!raiz.classList.contains('entrada-ativa')) return;
  const camada = document.querySelector<HTMLElement>('[data-entrada]');
  const logo = document.querySelector<HTMLElement>('[data-entrada-logo]');
  const destino = document.querySelector<HTMLElement>('[data-cabecalho-logo]');
  const pular = document.querySelector<HTMLButtonElement>('[data-entrada-pular]');
  if (!camada || !pular) return;

  // FLIP: posição e escala do logo do cabeçalho em relação ao logo da entrada.
  if (logo && destino) {
    const a = logo.getBoundingClientRect();
    const b = destino.getBoundingClientRect();
    if (a.width > 0 && b.width > 0) {
      const escala = b.width / a.width;
      logo.style.setProperty('--dx', `${b.left - a.left}px`);
      logo.style.setProperty(
        '--dy',
        `${b.top + b.height / 2 - (a.top + (a.height * escala) / 2)}px`,
      );
      logo.style.setProperty('--escala', String(escala));
      raiz.classList.add('entrada-voa');
    }
  }

  let encerrada = false;
  const encerrar = (rapido: boolean) => {
    if (encerrada) return;
    encerrada = true;
    const tinhaFoco = document.activeElement === pular;
    const fim = () => {
      raiz.classList.remove('entrada-ativa', 'entrada-voa', 'entrada-pulada');
      camada.remove();
      pular.remove();
      if (tinhaFoco) document.querySelector<HTMLElement>('main h1, main')?.focus();
      document.removeEventListener('keydown', teclado);
    };
    if (rapido) {
      raiz.classList.add('entrada-pulada');
      setTimeout(fim, 230);
    } else fim();
  };
  const teclado = (e: KeyboardEvent) => {
    if (e.key === 'Escape') encerrar(true);
  };

  pular.addEventListener('click', () => encerrar(true));
  camada.addEventListener('click', () => encerrar(true));
  document.addEventListener('keydown', teclado);

  const inicio =
    (window as Window & { __entradaInicio?: number }).__entradaInicio ?? performance.now();
  setTimeout(() => encerrar(false), Math.max(0, DURACAO - (performance.now() - inicio)));
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', iniciar, { once: true });
else iniciar();

export {};
