// Estado do consentimento (LGPD). Guardado no próprio navegador (localStorage), sem cookie.
// Essenciais: sempre ligados (não dependem de aceite). As outras categorias só valem depois
// de uma escolha explícita: Aceitar, Recusar ou Personalizar.
// Quem muda o estado dispara 'lavina:consentimento' (detail = Escolha) no document.

export type Categoria = 'preferencias' | 'mapas' | 'estatistica';
export type Escolha = Record<Categoria, boolean> & { versao: number; data: string };

export const CATEGORIAS: Categoria[] = ['preferencias', 'mapas', 'estatistica'];
const CHAVE = 'lavina-consentimento';
// Mudar a versão (nova categoria, novo terceiro) pede a escolha de novo.
export const VERSAO = 1;
// A escolha vale 12 meses; depois, o banner volta.
const VALIDADE_MS = 365 * 24 * 60 * 60 * 1000;

export function lerEscolha(): Escolha | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const e = JSON.parse(bruto) as Partial<Escolha>;
    if (e.versao !== VERSAO || !e.data) return null;
    if (Date.now() - Date.parse(e.data) > VALIDADE_MS) return null;
    return {
      versao: VERSAO,
      data: e.data,
      preferencias: e.preferencias === true,
      mapas: e.mapas === true,
      estatistica: e.estatistica === true,
    };
  } catch {
    return null;
  }
}

export function permitido(c: Categoria): boolean {
  return lerEscolha()?.[c] === true;
}

export function salvarEscolha(valores: Record<Categoria, boolean>): Escolha {
  const escolha: Escolha = { ...valores, versao: VERSAO, data: new Date().toISOString() };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(escolha));
    // Sem consentimento de preferências, a escolha de tema não fica guardada.
    if (!escolha.preferencias) localStorage.removeItem('lavina-tema');
  } catch {
    /* armazenamento bloqueado: vale só nesta página */
  }
  document.dispatchEvent(new CustomEvent<Escolha>('lavina:consentimento', { detail: escolha }));
  return escolha;
}

/** Roda agora (se já permitido) ou quando a categoria for aceita. */
export function quandoPermitido(c: Categoria, fn: () => void): void {
  if (permitido(c)) {
    fn();
    return;
  }
  const ouvir = (e: Event) => {
    if ((e as CustomEvent<Escolha>).detail[c]) {
      document.removeEventListener('lavina:consentimento', ouvir);
      fn();
    }
  };
  document.addEventListener('lavina:consentimento', ouvir);
}
