// Modo do site: "preview" (padrão; faixa "em revisão", selos, noindex) ou
// "producao" (só com LAVINA_MODO=producao; passa pelas travas).
type ComEnv = { process?: { env?: Record<string, string | undefined> } };

export type Modo = 'preview' | 'producao';

export const MODO: Modo =
  (globalThis as ComEnv).process?.env?.['LAVINA_MODO'] === 'producao' ? 'producao' : 'preview';

export const ehPreview = MODO === 'preview';
