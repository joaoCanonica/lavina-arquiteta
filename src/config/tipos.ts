// Estados de um campo da config. Fonte única: todo dado do cliente passa por aqui.
//  - confirmado: valor com fonte (documento, post, registro, decisão do João).
//  - opcional:   pode faltar; se faltar, não aparece e não gera pendência.
//  - bloqueante: falta e TRAVA a produção (usado só onde a regra manda, ex.: WhatsApp).
//  - aviso:      falta ou depende de decisão; aparece como PROVISÓRIO no preview e
//                vai para docs/PENDENCIAS.md, mas não trava a produção.

export type Confirmado<T> = {
  readonly estado: 'confirmado';
  readonly valor: T;
  readonly fonte: string;
};
export type Opcional<T> = { readonly estado: 'opcional'; readonly valor: T | null };
export type Bloqueante = {
  readonly estado: 'bloqueante';
  readonly valor: null;
  readonly rotulo: string;
};
export type Aviso<T> = {
  readonly estado: 'aviso';
  readonly valor: T | null;
  readonly rotulo: string;
  readonly motivo: string;
};

export type Campo<T> = Confirmado<T> | Opcional<T> | Bloqueante | Aviso<T>;
export type Estado = Campo<unknown>['estado'];

export const confirmado = <T>(valor: T, fonte: string): Confirmado<T> => ({
  estado: 'confirmado',
  valor,
  fonte,
});

export const opcional = <T>(valor: T | null = null): Opcional<T> => ({ estado: 'opcional', valor });

export const bloqueante = (rotulo: string): Bloqueante => ({
  estado: 'bloqueante',
  valor: null,
  rotulo,
});

// `valor` permite um valor provisório (exibido com selo PROVISÓRIO no preview).
export const aviso = <T = never>(
  rotulo: string,
  motivo: string,
  valor: T | null = null,
): Aviso<T> => ({
  estado: 'aviso',
  valor,
  rotulo,
  motivo,
});

export const ehCampo = (x: unknown): x is Campo<unknown> =>
  typeof x === 'object' &&
  x !== null &&
  'estado' in x &&
  ['confirmado', 'opcional', 'bloqueante', 'aviso'].includes((x as { estado: string }).estado);

// Valor exibível (null quando não deve aparecer).
export const valor = <T>(c: Campo<T>): T | null => c.valor;

// Campo precisa do selo PROVISÓRIO no preview?
export const provisorio = (c: Campo<unknown>): boolean =>
  c.estado === 'aviso' || c.estado === 'bloqueante';
