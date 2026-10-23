// Leitura do índice de derivados (public/media/midia.json) no build da home.
import { readFileSync } from 'node:fs';

export type FonteVideo = { largura: number; altura: number; mp4: string; webm: string };
export type Video = { poster: string; fontes: FonteVideo[] };
type Indice = { videos: Record<string, Video> };

let cache: Indice | null = null;
const indice = (): Indice =>
  (cache ??= JSON.parse(readFileSync('public/media/midia.json', 'utf8')) as Indice);

export function video(id: string): Video {
  const v = indice().videos[id];
  if (!v) throw new Error(`vídeo "${id}" não existe em midia.json`);
  return v;
}

// Natureza exibida na home: "depois" fora de um comparador é obra executada.
export const naturezaExibida = (
  n: string,
): 'executado' | 'render' | 'antes' | 'depois' | 'video' =>
  n === 'depois' ? 'executado' : (n as 'executado' | 'render' | 'antes' | 'video');
