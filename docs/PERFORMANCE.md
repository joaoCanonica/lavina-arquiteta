# Performance

Orçamento (CLAUDE.md §3):
- JS ≤ 40 KB gzip por página
- LCP < 2,0 s no mobile
- CLS ≈ 0
- INP < 200 ms
- Lighthouse mobile ≥ 95 em Performance, Boas Práticas e SEO, e 100 em Acessibilidade

## Home (sessão 4: entrada + abertura)

### Lighthouse mobile

`pnpm audit-lighthouse /` roda 3 vezes, com a simulação padrão do Lighthouse 13.5 (Moto G Power, 4G lento, CPU 4x), sobre o build de preview. A tabela mostra a mediana.

| métrica | valor | meta |
| --- | --- | --- |
| Performance | **100** | ≥ 95 |
| Acessibilidade | **100** | 100 |
| Boas práticas | **100** | ≥ 95 |
| SEO | 54 | ≥ 95 (ver abaixo) |
| FCP | 0,91 s | — |
| **LCP** | **1,36 s** (1,35–1,36 nas 3 execuções) | < 2,0 s |
| TBT | 0 ms | — |
| **CLS** | **0** | ≈ 0 |
| Speed Index | 0,91 s | — |
| Peso total da página | 66 KB | — |

- **Elemento de LCP:** a foto da abertura (`figure.abertura__foto … img`), em AVIF de 800 px com 24 KB, prioridade alta. Ela é descoberta no `<link rel="preload" imagesrcset>` do `<head>`.
- **Composição do LCP:**

  | parte | tempo |
  | --- | --- |
  | primeiro byte (TTFB) | 9 ms |
  | atraso até começar a baixar | 15 ms |
  | download | 20 ms |
  | atraso de renderização | 37 ms |

  A entrada não atrasa o LCP: a imagem carrega e pinta por baixo da camada da animação.
- **SEO 54, esperado nesta fase:** só falham `is-crawlable` (noindex obrigatório no preview, e até existir domínio) e `meta-description` (o texto final entra nas sessões 5 e 8). Em produção, com domínio e descrição, essas duas auditorias passam. Reconferir na sessão 8.
- **Fonte:** relatórios em `docs/capturas/lighthouse/home.json` (mediana) e `home.lighthouse.json` (relatório completo da 1ª execução).

### Trace de performance (Chromium, DevTools timeline)

`node scripts/medir-animacoes.mjs`; dados em `docs/capturas/sistema/desempenho.json`.

| animação | fps médio | quadro p95 | quadros > 20 ms | layout total |
| --- | --- | --- | --- | --- |
| entrada da home (0–3,5 s, medida desde a navegação) | 59,7 | 16,7 ms | 1 (o do carregamento) | 4,0 ms (inclui o layout inicial da página) |

- **Sem layout thrash:** a entrada só anima `transform`, `opacity` e `stroke-dashoffset`. Os painéis se abrem com `translateY`; o logo voa até o cabeçalho com `translate` + `scale` (FLIP calculado uma vez). A fresta usa `scaleX`.

### Entrada

- **Duração medida:** 3,31 s até a classe `entrada-ativa` sair (teste `pnpm test:entrada`). O limite é 3,5 s, e a rede de segurança atua aos 5 s.
- **"Pular":** visível desde o primeiro quadro. Funciona por mouse, toque (em qualquer ponto da camada) e teclado (Tab + Enter, ou Esc); encerra em menos de 1 s. Tudo isso tem teste.
- **Movimento reduzido ou sem JS:** abertura direta (testado).

### JS e CSS da home

| item | bruto | gzip |
| --- | --- | --- |
| JS (inline: tema + entrada + Fresta + cabeçalho) | 3,9 KB | **1,4 KB** (orçamento: 40 KB) |
| CSS (2 arquivos) | 21,4 KB | 5,6 KB |
| HTML | 22,7 KB | 6,3 KB |
| Fonte Urbanist (preload) | 27,1 KB | — |

### Decisões que protegem o LCP

- A foto da abertura é a única mídia acima da dobra. Ela vai em AVIF com `srcset`, com `fetchpriority="high"`, `width`/`height` declarados e LQIP de fundo, e tem preload no `<head>`.
- **Sem vídeo na abertura.** O loop mudo da sessão 1 ficou de fora: a linha de luz do forro na própria foto já conversa com a fresta, e o vídeo só pesaria. Ele fica disponível para o desktop depois do LCP, se a home (6A) pedir.
- A entrada é uma camada CSS sobre a abertura, que já está pintada por baixo.
- No preview, a faixa "em revisão" fica no rodapé da tela, para não cobrir o cabeçalho fixo nem mexer no layout. Em produção ela não existe.

### Ainda não medido

- **INP:** a home ainda não tem interações além de links e do menu. Medir na sessão 9, com o site completo.
- **Rede real:** os números acima são de laboratório (simulação). Medir com dados de campo depois do deploy.

## Home completa (sessão 6A: entrada + abertura + 10 seções)

Lighthouse mobile, mediana de 3 execuções (`pnpm audit-lighthouse /`):

| métrica | sessão 4 (só abertura) | sessão 6A (home completa) | meta |
| --- | --- | --- | --- |
| Performance | 100 | **100** | ≥ 95 |
| Acessibilidade | 100 | **100** | 100 |
| Boas práticas | 100 | **100** | ≥ 95 |
| SEO | 54 | 54 | ≥ 95 (noindex do preview + meta description: sessões 5/8) |
| FCP | 0,91 s | **0,91 s** | — |
| LCP | 1,36 s | **1,65 s** (1,58–1,81) | < 2,0 s |
| CLS | 0 | **0** | ≈ 0 |
| TBT | 0 ms | 0 ms | — |
| Peso transferido na carga | 66 KB | 264 KB (miniaturas lazy perto da dobra) | — |

- **O que mudou e por quê:** com as 10 seções, o CSS da home passou a 48 KB em dois arquivos que bloqueavam a renderização. Na primeira medição, o LCP foi a 1,74 s, com uma execução em 2,56 s. **Correção:** `build.inlineStylesheets: 'always'` (`astro.config.mjs`). Ela embute o CSS no HTML e elimina as requisições bloqueantes; o FCP voltou a 0,91 s.
- **O que ainda pesa no LCP:** o HTML da home (141 KB, 28 KB gzip: CSS embutido, LQIPs e o logo inline) e as miniaturas lazy logo abaixo da dobra.
- **Próximos ganhos possíveis** (sessão 9):
  - LQIP só nas imagens acima da dobra;
  - `content-visibility: auto` nas seções de baixo, depois de medir o CLS;
  - logo da entrada sem o subtítulo em curvas.
- **Vídeos:** nenhum carrega antes do clique (testado). O loop da abertura continua fora.

### JS por página (gzip, tudo inline; nenhum script externo)

| página | JS |
| --- | --- |
| home | 2,6 KB (tema, entrada, Fresta, cabeçalho, comparadores, vídeo, capítulos, lista de projetos, orçamento) |
| `/_sistema` | 0,9 KB |
| `/_pendencias` | 0,7 KB |

Orçamento: 40 KB por página.
