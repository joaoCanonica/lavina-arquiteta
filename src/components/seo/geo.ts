// GEO: parágrafo citável de 40–60 palavras no topo de cada página de projeto e do /processo.
// Montado só com dados da config (autoria, cidade, natureza, detalhes): nada inventado.
// Datas: o ano dos projetos não existe nas fontes; quando existir, entra aqui.
import { config } from '../../config/index.ts';
import type { ProjetoPagina } from '../projetos/dados.ts';
import { nomeAutoria } from '../projetos/dados.ts';

const ESCRITORIO =
  'Lavina — coletivo de arquitetura, de Lages (SC), liderado pela arquiteta Amanda Lavina';

export const contarPalavras = (t: string): number => t.trim().split(/\s+/).filter(Boolean).length;

export function paragrafoProjeto(p: ProjetoPagina): string {
  const tipo = p.tipo === 'residencial' ? 'residencial' : 'de saúde';
  const ano = p.ano ? `, de ${p.ano}` : '';
  const onde = p.cidade ? ` em ${p.cidade}` : '';
  const abre = `${p.titulo} é um projeto ${tipo}${onde}${ano} da ${ESCRITORIO}.`;
  const natureza =
    p.natureza === 'render'
      ? 'As imagens são 3D do projeto, não fotos de obra.'
      : p.natureza === 'misto'
        ? `Mostra a imagem 3D do projeto, o antes, a obra executada${p.video ? ' e o vídeo da entrega' : ''}.`
        : p.soVideo
          ? 'A obra executada aparece em vídeo e em quadros do vídeo.'
          : 'As fotos são da obra executada.';
  const destaques = (n: number) =>
    p.detalhes.length
      ? `Destaques: ${p.detalhes
          .slice(0, n)
          .map((d) => d.charAt(0).toLowerCase() + d.slice(1))
          .join(', ')}.`
      : '';
  const render = p.autoriaImagens.find((a) => a.tipo === 'render' && a.autor)?.autor;
  const projeto = nomeAutoria(p.autoriaProjeto);
  const creditos =
    `Projeto: ${projeto}` +
    (render && !projeto.startsWith(render) ? `; imagens 3D: ${render}` : '') +
    '.';
  // 40–60 palavras: até três destaques, menos se passar de 60.
  const montar = (n: number) => [abre, natureza, destaques(n), creditos].filter(Boolean).join(' ');
  let n = 3;
  while (n > 1 && contarPalavras(montar(n)) > 60) n--;
  return montar(n);
}

export const paragrafoProcesso = (): string => {
  const regiao = config.atuacao.regiao.valor;
  return (
    `A ${ESCRITORIO}, conduz cada projeto de interiores em cinco etapas: reunião inicial, ` +
    'estudo do espaço e da rotina, criação do conceito, projeto técnico e acompanhamento ' +
    `próximo da obra, em Lages e no ${regiao}, para que a execução seja fiel ao projeto.`
  );
};
