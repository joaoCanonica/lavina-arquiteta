// Termos vetados no HTML publicado. Lista do João: NUNCA afrouxar sem ordem expressa.
export const termosVetados = [
  'o melhor',
  'a melhor',
  'número 1',
  'nº 1',
  'garantido',
  'garantia de resultado',
  'grande arquiteta',
  'a mais',
  '100% garantido',
] as const;

const normalizar = (s: string): string => s.toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ');
const escapar = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Ocorrências de termos vetados em um texto (limites de palavra, sem diferenciar caixa).
export function acharTermosVetados(texto: string): { termo: string; trecho: string }[] {
  const t = normalizar(texto);
  const achados: { termo: string; trecho: string }[] = [];
  for (const termo of termosVetados) {
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapar(termo)}(?=$|[^\\p{L}\\p{N}])`, 'gu');
    for (const m of t.matchAll(re)) {
      const i = m.index ?? 0;
      achados.push({ termo, trecho: t.slice(Math.max(0, i - 30), i + termo.length + 31).trim() });
    }
  }
  return achados;
}
