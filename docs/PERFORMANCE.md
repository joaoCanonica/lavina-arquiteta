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

## Projetos (sessão 6B: /projetos e as 9 páginas)

Lighthouse mobile, 1 execução por rota (`node scripts/audit-lighthouse.mjs <rotas> --vezes 1`), mesma simulação da home:

| página | Perf | A11y | BP | SEO | FCP | LCP | CLS | peso | elemento de LCP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /projetos/ | 100 | 100 | 100 | 54 | 0,70 s | 1,36 s | 0 | 75 KB | texto da abertura |
| cozinha-jc | 100 | 100 | 100 | 54 | 0,93 s | 1,73 s | 0 | 106 KB | foto da abertura |
| consultorio-jonny-arruda | 100 | 100 | 100 | 54 | 0,91 s | 1,73 s | 0 | 101 KB | foto da abertura |
| living-jantar-painel | 100 | 100 | 100 | 54 | 0,90 s | 1,58 s | 0 | 93 KB | pôster do vídeo |
| cozinha-farmhouse | 100 | 100 | 100 | 54 | 0,91 s | 1,73 s | 0 | 109 KB | pôster do vídeo |
| banheiro-tons-claros | 100 | 100 | 100 | 54 | 0,91 s | 1,28 s | 0 | 87 KB | foto da abertura |
| quarto-closet | 100 | 100 | 100 | 54 | 0,69 s | 1,13 s | 0 | 66 KB | pôster do vídeo |
| clinica-cordis | 100 | 100 | 100 | 54 | 0,73 s | 1,21 s | 0 | 61 KB | imagem 3D da abertura |
| projeto-tb | 100 | 100 | 100 | 54 | 0,70 s | 1,20 s | 0 | 60 KB | imagem 3D da abertura |
| suite-fl | 100 | 100 | 100 | 54 | 0,69 s | 1,28 s | 0 | 69 KB | imagem 3D da abertura |

- **SEO 54**: mesma causa da home (noindex do preview e meta description ausente).
- **Abertura das páginas**: a foto tem `preload` AVIF no `<head>` e `fetchpriority="high"`. A fresta abre a foto com `clip-path` a partir de uma fenda de 0,8% da altura: a imagem pinta no primeiro quadro, e o LCP não espera a animação.
- **Projetos só em vídeo**: o pôster da `VideoJanela` (componente da home, não alterado) é `loading="lazy"` e vira o LCP. Mesmo assim fica abaixo de 1,8 s. Ganho possível na sessão 9: pôster `eager` no topo.
- **Vídeos**: nenhum carrega antes do clique.

### JS por página (gzip, inline; nenhum script externo)

| página | JS |
| --- | --- |
| /projetos/ | 1,6 KB (tema, Fresta, cabeçalho, filtros) |
| cozinha-jc (página mais completa) | 2,3 KB (+ comparadores, vídeo, lightbox) |
| living-jantar-painel | 2,1 KB |
| suite-fl | 1,7 KB |

### View Transitions

- `@view-transition { navigation: auto }` só sob `prefers-reduced-motion: no-preference`. A imagem de destaque leva `view-transition-name: projeto-<slug>` no índice, na abertura do projeto e no "próximo projeto". O cabeçalho fica parado (`view-transition-name: cabecalho`).
- Na chegada por transição (`pagereveal` com `viewTransition`), a página recebe `.vt-chegada`: a imagem já entra aberta, sem repetir a fresta.
- Quadros em `docs/capturas/projetos/transicao/` (Chromium, animação a 1/8 da velocidade por CDP).
- **Fallback**: o teste emula um navegador sem `@view-transition` (o HTML chega sem a regra). Resultado: navegação comum, a fresta abre a foto e nenhum erro de JS. Firefox e Safari reais não existem neste ambiente.

## Processo, coletivo, contato e 404 (sessão 6C)

Lighthouse mobile, 1 execução por rota, mesma simulação:

| página | Perf | A11y | BP | SEO | FCP | LCP | CLS | peso | JS (gzip) | elemento de LCP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /processo/ | 100 | 100 | 100 | 54 | 0,90 s | 1,20 s | 0 | 66 KB | 1,8 KB | título da abertura |
| /coletivo/ | 100 | 100 | 100 | 54 | 0,90 s | 1,35 s | 0 | 91 KB | 0,9 KB | retrato da Amanda |
| /contato/ | 100 | 100 | 100 | 50 | 0,71 s | 1,05 s | 0 | 37 KB | 1,1 KB | trecho de avaliação |
| 404 | 100 | 100 | 100 | 50 | 0,66 s | 1,05 s | 0 | 34 KB | 0,7 KB | título |

- **SEO 50 e 54:** as falhas são as mesmas em todas as páginas: noindex do preview e meta description ausente. O 50 aparece nas páginas sem imagem, que não têm a auditoria de `alt` somando a favor; não é falha nova.
- **Vídeo do processo:** só carrega no clique (testado). Os capítulos funcionam por teclado.
- **Mapa:** nenhum iframe; só o link "Ver no mapa" até o consentimento (sessão 7).

## Consentimento, rodapé e segurança (sessão 7)

Lighthouse mobile depois do banner, do rodapé e do botão fixo do WhatsApp:

| página | Perf | A11y | BP | LCP | CLS | observação |
| --- | --- | --- | --- | --- | --- | --- |
| / (mediana de 3) | 100 | 100 | 100 | 1,66 s (1,66 · 1,66 · 2,56) | 0 | FCP 1,10 s (era 0,91 s): o HTML subiu de 141 para 154 KB com o banner, o rodapé e o CSS deles |
| /projetos/cozinha-jc/ | 99 | 100 | 100 | 1,81 s | 0 | 1 execução |
| /contato/ | 100 | 100 | 100 | 1,21 s | 0 | 1 execução; mapa só depois do consentimento |
| /privacidade/ | 100 | 100 | 100 | 1,21 s | 0 | 1 execução |

- **O banner não causa CLS:** é fixo, por cima do conteúdo, e só aparece por JS depois da carga.
- **Rodapé:** o logo completo (subtítulo em curvas, 7,9 KB por página) foi trocado pelo monograma com o nome em texto.
- **Uma execução da home passou de 2 s** (2,56 s), a mesma oscilação vista na sessão 6A. Reconferir com dados de campo depois do deploy.

### CSP e cabeçalhos

- `scripts/gerar-csp.mjs` lê o HTML gerado e escreve o `vercel.json`:
  - `script-src 'self'` + hash de cada script inline (sem `unsafe-inline` e sem `unsafe-eval`);
  - `style-src-elem` por hash;
  - `style-src-attr 'unsafe-inline'`: os atributos `style=""` levam variáveis CSS e os LQIPs; hashear cada valor deixaria o cabeçalho com dezenas de KB;
  - `frame-src` só `https://www.google.com` (o mapa);
  - `form-action` com `wa.me` e `api.whatsapp.com`;
  - `frame-ancestors 'none'`.
- Junto vão Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options, COOP e HSTS (2 anos, sem `preload` até haver o domínio definitivo).
- **Fluxo:** a Vercel lê o `vercel.json` antes do build, então ele é versionado. Toda mudança de script ou CSS inline pede `pnpm csp`, que constrói o preview e a produção e grava a união dos hashes. O `postbuild` reprova o build quando algum hash falta: uma CSP desatualizada nunca chega ao ar.
- **Prova:** `pnpm test:consentimento` serve o `dist/` com esses cabeçalhos (`scripts/servir-dist.mjs`) e não registra nenhuma violação em 8 rotas, a 390 e 1440 px, antes e depois do aceite. Num teste à parte, um script injetado na página foi bloqueado e a violação apareceu no console, o que mostra que a detecção funciona.

## SEO e GEO (sessão 8)

| página | Perf | A11y | BP | SEO | LCP |
| --- | --- | --- | --- | --- | --- |
| / (mediana de 3) | 100 | 100 | 100 | 69 | 1,65 s (1,51 · 1,65 · 2,28) |
| /projetos/cozinha-jc/ | 99 | 100 | 100 | 69 | 1,81 s |
| /processo/ | 100 | 100 | 100 | 69 | 1,51 s |

- **SEO 54 → 69:** a meta description agora existe em todas as páginas. A única auditoria que ainda falha é `is-crawlable`, por causa do noindex, que é obrigatório enquanto não houver domínio.
- **Regressão corrigida:** com o JSON-LD no `<head>`, o LCP simulado da home foi a 2,4–2,6 s nas três execuções, porque o preload da foto ficava mais para baixo no documento. O JSON-LD passou para o fim do `<body>` (`src/components/seo/JsonLd.astro`, válido para o Google), e o LCP voltou a 1,65 s.
- **Imagens OG:** 15 JPEGs 1200×630 gerados no build (`/og/*.jpg`, 37–71 KB). Só são pedidos por quem compartilha o link; nenhum entra na carga da página.
