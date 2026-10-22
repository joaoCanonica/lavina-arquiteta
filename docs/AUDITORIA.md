# Auditoria final (sessão 9 · 22/10/2026)

Build de preview (`pnpm build`), servido localmente com os cabeçalhos do `vercel.json`. Chromium 1440 e 390 px. Os arquivos de cada auditoria estão anexados em `docs/capturas/`.

## 1. Resumo

| auditoria | resultado | anexo |
| --- | --- | --- |
| Acessibilidade (axe-core 4.14, WCAG 2.0/2.1/2.2 A e AA) | **0 violações** em 64 execuções (16 rotas × 390/1440 × claro/escuro) | `docs/capturas/a11y/relatorio.json` |
| Teclado | primeiro Tab = "Pular para o conteúdo" (durante a entrada, o "Pular" da entrada); foco visível em todos os elementos alcançados por Tab; banner de cookies operável só por teclado | idem |
| Leitor de tela (estrutura) | lang pt-BR, um h1, títulos sem salto, um `<main>`, header/nav/footer, árvore ARIA gravada por rota | `docs/capturas/a11y/arvore-*.yml` |
| Reflow (WCAG 1.4.10) | celular emulado em 390 px: viewport de layout = 390 em todas as rotas (**corrigido nesta sessão**, ver §4) | `relatorio.json → reflow` |
| Sem JavaScript | conteúdo principal visível em todas as rotas | `relatorio.json → semJs` |
| prefers-reduced-motion | conteúdo principal visível; sem entrada animada | `relatorio.json → reduzido` + capturas `*-reduzido` |
| Lighthouse mobile e desktop | Performance 99–100 · Acessibilidade 100 · Boas práticas 100 em todas as rotas. SEO 63–69: **só** `is-crawlable` falha, por causa do noindex obrigatório no preview | `docs/capturas/final/lighthouse/` |
| SEO (`pnpm audit-seo`) | verde: títulos ≤ 60, descrições ≤ 155, OG, canonical, JSON-LD, GEO, sitemap, robots | — |
| Schema (`validar-schema`) | 15 blocos JSON-LD, todos os tipos e propriedades existem no schema.org 30.1 | — |
| Compliance (`audit-compliance`) | 18 páginas, 135 mídias, **0 termos vetados, 0 sem rótulo** | `docs/COMPLIANCE.md` |
| Contraste (`audit-contraste`) | AA em todos os pares dos dois temas | `docs/CONTRASTE.md` |
| Links (`verificar-links`) | 371 links internos, 0 quebrados | — |
| Config (`validate-config`) | 9 projetos válidos, 31 pendências, **0 travas** (preview e produção) | `docs/PENDENCIAS.md` |
| Testes | config, entrada (9/9), home (6/6), projetos (8/8), páginas (7/7), consentimento (13/13): todos verdes | — |
| Código | `astro check` 0 erros · ESLint 0 · Prettier ok | — |
| Firefox e Safari/WebKit | **NÃO VERIFICADO.** Só há Chromium neste ambiente, e `playwright install` não é permitido. O fallback sem View Transitions foi emulado no Chromium (`test:projetos`). | `docs/MELHORIAS.md` §2 |
| Leitor de tela real (NVDA, VoiceOver) | **NÃO VERIFICADO** com o leitor. A estrutura foi conferida pela árvore de acessibilidade do Chromium. | — |

## 2. Notas por rota

P/A/BP/SEO = Performance, Acessibilidade, Boas práticas, SEO do Lighthouse (mobile: Moto G Power simulado, 4G lento, CPU 4×; desktop: preset desktop). Peso = o que o navegador baixa, com texto em gzip e sem vídeos (só carregam no clique). "Inicial" = sem rolar; "página inteira" = rolando até o fim.

| rota | mobile P/A/BP/SEO | LCP mobile | desktop P/A/BP/SEO | LCP desktop | CLS | peso inicial 390 / 1440 (KB) | página inteira 390 / 1440 (KB) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | 100/100/100/69 | 1,73 s (mediana de 3) | 100/100/100/69 | 0,41 s | 0 | 118 / 151 | 368 / 541 |
| /projetos/ | 100/100/100/66 | 1,51 s | 100/100/100/69 | 0,40 s | 0 | 58 / 78 | 74 / 105 |
| /projetos/cozinha-jc/ | 99/100/100/69 | 1,80 s | 100/100/100/69 | 0,54 s | 0 | 89 / 196 | 334 / 774 |
| /projetos/consultorio-jonny-arruda/ | 99/100/100/69 | 1,80 s | 100/100/100/69 | 0,51 s | 0 | 88 / 149 | 311 / 681 |
| /projetos/living-jantar-painel/ | 100/100/100/69 | 1,65 s | 100/100/100/69 | 0,40 s | 0 | 96 / 96 | 171 / 187 |
| /projetos/cozinha-farmhouse/ | 99/100/100/69 | 1,80 s | 100/100/100/69 | 0,42 s | 0 | 112 / 112 | 194 / 204 |
| /projetos/banheiro-tons-claros/ | 100/100/100/69 | 1,58 s | 100/100/100/69 | 0,42 s | 0 | 79 / 117 | 133 / 221 |
| /projetos/quarto-closet/ | 100/100/100/69 | 1,43 s | 100/100/100/69 | 0,37 s | 0 | 69 / 69 | 146 / 157 |
| /projetos/clinica-cordis/ | 100/100/100/69 | 1,40 s | 100/100/100/69 | 0,42 s | 0 | 54 / 96 | 77 / 186 |
| /projetos/projeto-tb/ | 100/100/100/69 | 1,35 s | 100/100/100/69 | 0,42 s | 0 | 53 / 108 | 96 / 314 |
| /projetos/suite-fl/ | 100/100/100/69 | 1,43 s | 100/100/100/69 | 0,45 s | 0 | 55 / 143 | 90 / 253 |
| /processo/ | 100/100/100/69 | 1,45 s | 100/100/100/69 | 0,38 s | 0 | 69 / 69 | 183 / 230 |
| /coletivo/ | 100/100/100/69 | 1,43 s | 100/100/100/69 | 0,35 s | 0 | 82 / 71 | 98 / 107 |
| /contato/ | 100/100/100/66 | 1,25 s | 100/100/100/66 | 0,34 s | 0 | 41 / 41 | 41 / 41 |
| /privacidade/ | 100/100/100/66 | 1,10 s | 100/100/100/66 | 0,33 s | 0 | 41 / 41 | 41 / 41 |
| 404 | 100/100/100/69 | 0,37 s | 100/100/100/63 | 0,30 s | 0 | 35 / 35 | 35 / 35 |

- **Orçamentos:** LCP mobile < 2,0 s em todas as rotas (máximo 1,80 s); CLS 0; TBT 0 ms (INP sem medição de campo, sem tarefa longa no laboratório).
- **JS por página:** no máximo **≈ 5 KB gzip** (2,8 KB inline na home + até 2,2 KB em módulos externos), contra 40 KB de orçamento. O script do Web Analytics só entra depois do aceite e não está nessa conta.
- **SEO 63–69:** a única auditoria que falha é `is-crawlable` (noindex), que é proposital até o domínio existir. Pesos diferentes (63/66/69) vêm das auditorias que não se aplicam em cada página.
- **404:** o Lighthouse recusa páginas com status 404, por isso foi medido `/404.html`, o mesmo HTML.
- **Mídia no ar:** a Vercel gera a mídia em modo rápido (ver `docs/DEPLOY.md`), com arquivos cerca de 19% maiores que os medidos aqui. As páginas mais pesadas (Cozinha J|C e Consultório em 1440) devem passar de ~0,7 MB para ~0,85 MB na página inteira; a carga inicial muda pouco.
- Dados brutos: `docs/capturas/final/peso.json` e `docs/capturas/final/lighthouse/*.json` (relatórios completos em `.lighthouse.json.gz`).

## 3. Capturas finais

`docs/capturas/final/<largura>-<tema>[-reduzido]/<rota>.jpg`: 16 rotas em 390 claro, 390 escuro, 1440 claro, 1440 escuro, 390 escuro com movimento reduzido e 1440 escuro com movimento reduzido. Página inteira, com a faixa "em revisão" visível, que é o estado publicado. As capturas de 1440 foram reduzidas para 960 px de largura. Visão geral nas folhas `folha-*.jpg`. Script: `node scripts/capturar-final.mjs`.

## 4. Bugs encontrados e corrigidos nesta sessão

1. **Rolagem lateral no celular (home).** Os textos só para leitor de tela (`.so-leitor`, absolutos) da faixa do Instagram escapavam da rolagem horizontal. Num celular de 390 px, a viewport de layout ia para 1465 px e a página arrastava para o lado. Correção: `position: relative` na faixa (`SecaoInstagram.astro`). Agora há uma verificação permanente de reflow em `audit-a11y`.
2. **Contraste na /privacidade (1440, escuro).** Os links do cabeçalho ficavam sobre o fundo escuro fora do `<main>` (2,73:1). Correção: o fundo claro da política passou a ocupar a largura inteira.
3. **Sem atalho "Pular para o conteúdo".** Foi criado (primeiro elemento do `<body>`, visível no foco) e o `<main>` de todas as páginas tem `id="conteudo"`. Durante a entrada, o atalho fica oculto, e o primeiro Tab continua sendo o "Pular" da entrada.
4. **Build na Vercel sem ffmpeg.** Entrou o `ffmpeg-static` e o modo rápido de mídia (ver `docs/MELHORIAS.md` §3 e `docs/DEPLOY.md`).

## 5. Bloqueios de produção

Ver `docs/COMPLIANCE.md` → "Bloqueios de produção (nenhum escondido)". Travas automáticas: 0. O que impede a produção hoje é o domínio, mais as decisões humanas listadas na tabela de normas.
