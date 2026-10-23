# Lavina — coletivo de arquitetura · Pacote de prompts para o Claude Code (Opus)

Versão 1 · 21/10/2026 · WAXLO · Projeto 3 de 3

Base: `LAVINA_INVESTIGACAO_CLIENTE.md` (investigação), `LAVINA_MAPA_MIDIA_LEGENDAS.md` + `LAVINA_MIDIA_LEGENDAS.json` (cada arquivo casado com o post e a legenda literal), `assets/lavina-logo.svg` (logo reconstruído). Repositório: `github.com/joaoCanonica/lavina-arquiteta`.

---

## Como usar (ordem exata)

1. **Antes da sessão 0**, copie para a raiz do repositório `LAVINA_INVESTIGACAO_CLIENTE.md` e este arquivo (`LAVINA_PACOTE_PROMPTS_CODE.md`). O mapa, o JSON e o logo já estão lá.
2. Abra o Claude Code (Opus) **na pasta do repositório**.
3. **Sessão 0:** cole o bloco da seção B ("Contexto do projeto") e, logo abaixo, o Prompt 0. **Sem anexos.** A sessão grava o bloco como `CLAUDE.md`.
4. **Sessões 1 a 9:** uma sessão nova para cada, colando **só o prompt**. Todos começam com "Leia CLAUDE.md". Não junte prompts. Cada sessão termina em commit.
5. **Nenhuma sessão precisa de anexo.** Toda a mídia já está no repositório.
6. Depois das sessões **1, 3, 4, 6A, 6B e 9**, me traga o relatório e as capturas (390 e 1440 px, claro e escuro). Eu audito antes de você seguir.
7. Ordem: 0 Fundação · 1 Mídia · 2 Config · 3 Design system e logo · 4 Entrada e hero · 5 Textos · 6A Home · 6B Projetos · 6C Processo, Coletivo e Contato · 7 Conversão e LGPD · 8 SEO e GEO · 9 QA, conferência e deploy. Depois, quando precisar: **L** (nova mídia) e **D** (novo dado).

---

## A. Dados fixos (a sessão 2 transforma em config)

| Campo | Valor | Estado |
|---|---|---|
| Marca | **Lavina — coletivo de arquitetura** (Instagram: "Lavina \| Coletivo de Arquitetura") | CONFIRMADO |
| Razão social / CNPJ | Amanda Lavina Arquitetura Ltda · 52.116.202/0001-05 (ativa desde 08/09/2023) | REGISTRO (Receita). No rodapé legal, chave `exibirCnpj` ligada por padrão |
| Arquiteta líder | Amanda Lavina (no registro: Amanda Oliveira Lavina, sócia-administradora) | CONFIRMADO |
| Equipe | Renata Nürnberg (arquiteta e urbanista; interiores e imagens realistas); Lara Honofre (arquitetura e urbanismo) | CONFIRMADO pelo João; papéis formais a confirmar |
| CAU (pessoas e empresa) | — | PENDENTE. Não aparece até existir; vai para a conferência final |
| Endereço | Av. Pres. Vargas, 505, Sagrado Coração de Jesus, Lages/SC, CEP 88508-110 | CONFIRMADO pelo João |
| Coordenadas | -27.8109211, -50.3161973 (ficha do Google) | VISTO |
| Horário | seg a sex 9h–19h; sáb e dom fechado | CONFIRMADO |
| WhatsApp de orçamento | +55 49 99190-0821 | CONFIRMADO |
| Instagram | @lavina.co.arq · Amanda: @lavinamanda | CONFIRMADO |
| Google | "Amanda Lavina Arquitetura", 5,0 com 15 avaliações (conferido em 20/10/2026) | VISTO |
| Atuação real | Lages (sede), Balneário Camboriú (Litoral), Urubici, Campo Belo do Sul | VISTO nos posts e avaliações |
| Domínio | coletivoarquiteturalavina.com.br (ainda não registrado) | PENDENTE. `SITE_URL` por variável; noindex até existir |
| Logo | `assets/lavina-logo.svg`: monograma "AN" + "LAVINA" em traço monolinha + "coletivo de arquitetura", reconstruído do vídeo | Validar com a Amanda. O arquivo `assets/Captura de tela…png` é a **marca antiga** e não entra |
| Tese da marca (palavras dela) | "Arquitetura com presença em cada etapa"; "Projetos personalizados + acompanhamento de obra" | CONFIRMADO (bio) |

**Decisões do João (20 e 21/10/2026):**
- Os projetos e imagens 3D da Renata são feitos para a Lavina, estão autorizados e levam crédito.
- Cada imagem é rotulada como imagem 3D ou obra executada.
- Os vídeos da Amanda são o centro. Os vídeos com Renata e Lara entram normalmente.
- Os clientes com nome (clínicas) autorizaram.
- Não há fotos da obra pronta da Cordis e do T|B: usar o que existe, da melhor forma.
- As fotos podem ser melhoradas por nós, com o limite da seção B.

---

## B. BLOCO "CONTEXTO DO PROJETO" (colar só na sessão 0)

````text
CONTEXTO DO PROJETO — Lavina, coletivo de arquitetura (site premium)
Idioma de tudo (código, comentários curtos, textos, relatórios): português do Brasil.

1. QUEM E O QUÊ
- Cliente: Lavina — coletivo de arquitetura (Amanda Lavina Arquitetura Ltda), Lages/SC, com atuação no Litoral Catarinense. Arquiteta líder: Amanda Lavina. Equipe: Renata Nürnberg (interiores e imagens realistas) e Lara Honofre.
- Especialidade: arquitetura de interiores e iluminação, projetos residenciais e de saúde/comerciais, com acompanhamento de obra.
- Tese (palavras dela): "Arquitetura com presença em cada etapa." Pilares, todos com prova no material: (1) presença do primeiro encontro à entrega; (2) projeto fiel à execução ("100% fiel ao projeto"); (3) o projeto parte da identidade do cliente, não de um estilo do escritório; (4) "projetar pra viver, não pra impressionar"; (5) luz como matéria do projeto.
- Meta do João (CEO da WAXLO): o melhor site que já fizemos. Minimalista, de presença muito forte, fluido, com interatividade que prova a tese. O visual é o que mais vale. Sem "cara de IA".
- Regra do projeto: o site primeiro, com texto e imagem certos. A conferência de normas (CAU, direito autoral, CDC, LGPD) é UMA passada no final (sessão 9). O que o João mandou está autorizado. Não corte conteúdo por falta de papel: sinalize em docs/PENDENCIAS.md.
- Dados do cliente (CAU, números, nomes, anos, cidades) NUNCA são inventados. Faltou: campo pendente.

2. FONTES DE VERDADE NO REPOSITÓRIO
- LAVINA_INVESTIGACAO_CLIENTE.md (investigação), LAVINA_MAPA_MIDIA_LEGENDAS.md e LAVINA_MIDIA_LEGENDAS.json (cada arquivo casado com o post de origem, a legenda literal, a natureza e o uso sugerido), assets/lavina-logo.svg (logo).
- As legendas dela são a matéria-prima do texto: o site usa a VOZ dela (frases curtas, primeira pessoa do plural, perguntas ao leitor), editada para o site (sem emojis, sem hashtags). Toda citação literal leva a fonte (post).

3. STACK
- Astro (versão estável atual; confira em docs.astro.build e no npm e fixe), TypeScript strict, estático, ilhas mínimas, pnpm, Node LTS. `engines` e `packageManager` fixados.
- Movimento: CSS (transições, @keyframes, scroll-driven animations e View Transitions como MELHORIA PROGRESSIVA sob @supports; o conteúdo sempre funciona sem elas) + IntersectionObserver + Web Animations API. Sem GSAP, Lenis, Motion, Swiper, jQuery. NÃO sequestrar o scroll (nada de smooth-scroll por JS). Qualquer biblioteca exige medição e justificativa em docs/MELHORIAS.md.
- Orçamento (meta, medir): JS ≤ 40 KB gzip por página; LCP < 2,0 s mobile; CLS ≈ 0; INP < 200 ms; Lighthouse mobile ≥ 95 em Performance/BP/SEO e 100 em Acessibilidade. Vídeo nunca no caminho do LCP.
- Fontes self-hosted.

4. IDENTIDADE
- Assinatura: "A FRESTA". A especialidade dela é luz (perfis de LED embutidos, nichos e espelhos iluminados aparecem em quase todo projeto). O site se revela por frestas de luz: uma linha horizontal fina e luminosa que acende e abre o conteúdo, como um perfil de LED no forro. Usos:
  (a) entrada: o logo se desenha como luz acendendo;
  (b) revelação de imagens: a imagem abre a partir de uma fresta horizontal (clip-path), uma vez, ao entrar na tela;
  (c) divisores entre seções: uma fresta que acende;
  (d) hover/foco em projetos: uma linha de luz percorre a borda inferior.
  A fresta ACENDE (evento), não acompanha o progresso do scroll. Não é linha que se desenha ao rolar.
- PROIBIDO repetir (já usado em outros sites nossos): vinho + coluna de pontos, linha da vida (linha que se desenha no scroll), curva dourada, oval verde, arco como assinatura, navy + areia; fontes Cormorant, Bodoni Moda, Marcellus, Instrument Serif, Hanken Grotesk, Fraunces, Lato, Figtree, Jost, Gloock. Os arcos aparecem nos projetos dela (fotos), e isso é ok; não viram forma da interface.
- Paleta (tokens, claro e escuro; calibrar com as fotos e validar AA por script):
  Grafite quente ≈ #1C1A18 (escuro principal, "obra à noite");
  Osso ≈ #F4F1EC (claro principal; cor do logo);
  Travertino ≈ #E6DED2 (superfície clara secundária);
  Greige ≈ #A79C8F (texto secundário em escuro, linhas);
  Freijó ≈ #8A6A4F (acento raro, madeira);
  Luz ≈ #F7D9A8 (SÓ como luz: brilho da fresta, foco, glow; nunca bloco de cor, nunca dourado metálico).
- Tipografia (candidatas; testar e decidir na sessão 3; confirmar licença e fazer self-host): texto e interface em Urbanist (geométrica, conversa com o logo; pesos 200–600); citações em Spectral Italic (300). Alternativas se não funcionarem: Manrope / Newsreader Italic. Escala com display muito grande e fino contra texto pequeno; versaletes espaçados para rótulos (como o "LAVINA" do logo).
- Fotografia real em destaque, sempre com rótulo de natureza visível: "Obra executada", "Imagem 3D do projeto", "Antes", "Depois".

5. ANTI "CARA DE IA"
Proibido: grade de cartões brancos arredondados com borda fina; ícone em círculo; pílulas por toda parte; ícones de biblioteca como ilustração; hero centralizado com degradê; hero só com logo; seções todas com a mesma estrutura; gradiente roxo/azul; brilho decorativo que não seja a fresta.
Usar: grande formato; muito respiro; assimetria; números e legendas editoriais (01 / 06); lista editorial de projetos em vez de grade de cartões; transições entre índice e projeto com a imagem "viajando" (View Transitions, melhoria progressiva); cada seção com um gesto próprio; alternância de grafite e osso.

6. MÍDIA
- Originais em media-originais/ (a sessão 1 move assets/ com git mv). Derivados no build em public/media/ (fora do git): AVIF/WebP com srcset, LQIP, poster por vídeo, MP4 + WebM.
- Manifesto media.manifest.json gerado a partir de LAVINA_MIDIA_LEGENDAS.json: id, projeto, natureza (render | executado | antes | depois | video | retrato), autoria da imagem, crédito de projeto, post de origem, legenda, uso, problemas, edições.
- Edição permitida: correção GLOBAL de cor, exposição e balanço de branco, alinhamento de verticais (perspectiva), recorte, e remoção por RECORTE dos selos "ANTES & DEPOIS" queimados. Proibido: IA generativa que adicione, remova ou invente qualquer parte do ambiente; super-resolução por IA em rosto; retoque em pessoas. Toda edição é registrada no manifesto (campo edicoes) e aplicada no derivado, nunca no original.
- Vídeos: 720×1280 vertical, alguns com legenda queimada; entram em janelas verticais inteiras (não recortar a legenda), clique para tocar com som; loops mudos só onde dito.
- Pessoas: Amanda, Renata e Lara (autorizadas). Clientes com nome (clínicas): autorizados. Residências: sem endereço; iniciais dos clientes podem ficar como código do projeto (J|C, T|B, F|L), sem nome de morador nem de criança.

7. CONFIG E TRAVAS
- Fonte única em src/config/ tipada, com estados confirmado(), opcional(), bloqueante(), aviso(). Preview sempre funciona (faixa "em revisão", selo PROVISÓRIO, noindex).
- Produção trava só em: WhatsApp ausente; termo vetado no HTML; imagem publicada sem rótulo de natureza; projeto publicado sem crédito de autoria; uso de mídia marcada "não usar". CAU ausente = aviso (decisão do João), vai para a conferência final.
- Termos vetados (src/config/termos.ts): "o melhor", "a melhor", "número 1", "nº 1", "garantido", "garantia de resultado", "grande arquiteta", "a mais", "100% garantido". O Code NUNCA afrouxa listas nem travas sem ordem expressa.

8. CONDUTA DO CODE
- Um prompt = uma sessão = um commit, com mensagem curta em português.
- Plano curto antes de tarefa grande. Capturas e métricas no lugar de "ficou ótimo". Se não conseguir algo, diga.
- Capturas sempre em 390 e 1440 px, claro e escuro, e com prefers-reduced-motion.
- Relatório no fim: o que mudou · o que falhou · o que depende do João · números medidos.
````

---

## PROMPT 0 — Fundação

````text
[COLE AQUI O BLOCO "CONTEXTO DO PROJETO" INTEIRO, ANTES DESTE TEXTO]

Tarefa: criar a fundação do projeto Astro no repositório lavina-arquiteta e gravar o contexto como CLAUDE.md.
Escopo: estrutura e configuração. NÃO escreva páginas, textos ou componentes visuais. NÃO apague mídia.
Leia primeiro: git ls-files; LAVINA_MAPA_MIDIA_LEGENDAS.md (só o resumo e os achados).

Passos:
1. Salve o bloco de contexto acima, sem alterar, como CLAUDE.md na raiz e como docs/CONTEXTO.md.
2. Crie docs/ e mova para lá (git mv): LAVINA_INVESTIGACAO_CLIENTE.md, LAVINA_MAPA_MIDIA_LEGENDAS.md, LAVINA_PACOTE_PROMPTS_CODE.md. Mova LAVINA_MIDIA_LEGENDAS.json para docs/dados/midia-legendas.json. Se algum não existir, anote em docs/PENDENCIAS.md e siga.
3. Verifique ferramentas: node, pnpm, git, ffmpeg, ffprobe, sharp (via pnpm), Chromium do Playwright. Liste o que falta e como instalar; instale o seguro via pnpm. Nada global sem me dizer.
4. Inicialize Astro (estável atual, TS strict, estático, sem framework de UI) na raiz, preservando assets/. package.json: name "lavina-site", `engines` (Node LTS atual), `packageManager` (pnpm exato), scripts: dev, build, preview, check, validate-config, audit-compliance, audit-a11y, audit-lighthouse, audit-seo, audit-contraste, media:prepare, capturar. Auditorias podem nascer como stubs que saem com 0.
5. Estrutura: src/{config,components,layouts,pages,styles,scripts,content}, scripts/, docs/{pesquisa,capturas,dados}, media-originais/ (.gitkeep), public/. .gitignore: node_modules, dist, .astro, public/media, docs/capturas/**/*.png, .env*.
6. tsconfig strict, ESLint + Prettier mínimos, .editorconfig, .nvmrc.
7. scripts/capturar.mjs: sobe o preview e, com Playwright/Chromium, captura uma lista de rotas em 390 e 1440 px, claro e escuro (data-theme no <html>), e com prefers-reduced-motion, salvando em docs/capturas/<data>/.
8. Página temporária "/" com <h1>Lavina</h1> e noindex.
9. README.md curto.

Regras: nenhuma dependência de animação. Versões exatas no lockfile.
Entrega: versões fixadas, ferramentas que faltam, saída de pnpm build e pnpm check.
Critério de aceite: pnpm install, build e check verdes; pnpm capturar gera as capturas da home; CLAUDE.md idêntico ao bloco; commit "fundação".
````

---

## PROMPT 1 — Mídia: catálogo, correção, derivados

````text
Leia CLAUDE.md, docs/LAVINA_MAPA_MIDIA_LEGENDAS.md e docs/dados/midia-legendas.json. Esta sessão só trata mídia. NADA vai para páginas.

Tarefa: mover os originais, gerar o manifesto, preparar os derivados e montar os pares de comparação.
Escopo: media-originais/, media.manifest.json, scripts/prepare-media.mjs, scripts/extract-stills.mjs, docs/MIDIA_CATALOGO.md. Originais intactos (só git mv).

Passos:
1. `git mv assets media-originais`. Mantenha os nomes originais; slugs no manifesto.
2. Arquivos novos que NÃO estão no JSON (inclua no manifesto):
   - Renders do Consultório Jonny Arruda (post DSGdwDDj4Kv, imagem 3D de Renata Nürnberg): SaveClip.App_588442716_17869031958483108_6881159161144977863_n.jpg (mesa oval + estantes; par do executado 627064897…) e SaveClip.App_598761174_17869031967483108_7242716098048022537_n.jpg (vista frontal; par do executado 625681099…).
   - Renders da Cozinha J|C (posts DZIFaXyFq8k e DZh0O6uFqkV, imagem 3D de Renata Nürnberg): SaveClip.App_710959395_17890720767483108_2756011782472961855_n.jpg, SaveClip.App_713283758_17890720743483108_4251243534598581787_n.jpg, SaveClip.App_713843664_17890720755483108_2170458033472249592_n.jpg, SaveClip.App_719918476_17892033012483108_4323779363077244549_n.jpg, SaveClip.App_723099267_17892033003483108_4387115283769733568_n.jpg.
   - "Captura de tela de 2026-10-21 11-58-49.png": logo ANTIGO. Natureza "nao-usar".
   - lavina-logo.svg e lavina-logo-comparacao.jpg: marca. A comparação é só documentação, não vai ao site.
3. Manifesto: um registro por arquivo, a partir do JSON (projeto, natureza, autoria, créditos, post, legendas, uso, problemas). Para os renders novos, mesma autoria e créditos dos posts acima.
4. PARES (o coração interativo do site). Monte em docs/dados/pares.json, conferindo visualmente o enquadramento (gere uma folha de contato lado a lado para cada par em docs/capturas/pares/):
   - Projeto × Executado (render → obra): Consultório Jonny Arruda (2 pares indicados) e Cozinha J|C (encontre os melhores pares entre os 5 renders e as 5 fotos "depois"; aceite par só com ângulo realmente próximo; registre a nota de semelhança).
   - Antes × Depois: Cozinha J|C (par principal 730561497 → 730173676, mesmo ângulo; busque outros) e Consultório (antes 625638741/625969940/626043387/625109164 × depois; mesma regra).
   - Para cada par: recorte e alinhamento para o MESMO enquadramento (crop/scale/translate; correção de perspectiva só se necessária e igual nos dois), proporção comum (4:5 ou 3:2, a que perder menos), e registro das transformações.
5. Correção (derivados, nunca originais): verticais alinhadas nas fotos executadas; balanço de branco e exposição consistentes por projeto (um ajuste por projeto, documentado); recorte dos selos "ANTES & DEPOIS" queimados (627136937…, 730173676…): no 730173676 o selo cobre o centro; se o recorte não salvar o par, use o "depois" alternativo mais próximo e registre. Sem IA generativa. Antes/depois de cada correção em docs/capturas/correcoes/.
6. Vídeos: ffprobe; poster AVIF (quadro limpo); MP4 H.264 + WebM em 720×1280 e 540×960; áudio preservado; nenhum corte de conteúdo. Para cada vídeo, extraia 6 quadros nítidos (scripts/extract-stills.mjs) como STILLS reais dos projetos que só existem em vídeo (living e jantar do apresentacao-principal, quarto e closet do mostrando-quarto, cozinha farmhouse do novo-modelo): natureza "executado (quadro de vídeo)", sem upscale por IA, para uso em tamanho médio.
   Loop mudo (6–8 s, ≤ 1,5 MB, sem legenda queimada) a partir de um trecho limpo de apresentacao-principal ou mudanca-cozinha, para a seção de abertura (escolha o trecho mais bonito e sem texto; se não houver, relate).
7. Qualidade: marque em problemas os arquivos muito comprimidos (Suíte F|L 728991882 e 729654054; render J|C 713283758 com 36 KB) com o tamanho máximo de exibição recomendado.
8. scripts/prepare-media.mjs (predev/prebuild, idempotente, cache por hash): AVIF/WebP 480/800/1200/1600/2400 (nunca acima do original), LQIP, pares exportados já alinhados.
9. docs/MIDIA_CATALOGO.md: tabela por projeto (arquivos, natureza, uso, problemas, pesos), lista de pares com a nota de semelhança, e o que pedir ao João.

Regras: originais imutáveis; nenhum arquivo "nao-usar" publicável; nenhuma pessoa editada.
Entrega: relatório + folhas de contato dos pares + pesos antes/depois.
Critério de aceite: media:prepare roda do zero e é idempotente; manifesto válido (JSON Schema); 2 pares Projeto × Executado e ≥ 2 pares Antes × Depois registrados (ou relatório do porquê); todos os 58 arquivos com natureza; build verde.
````

---

## PROMPT 2 — Config, estados e travas

````text
Leia CLAUDE.md, docs/MIDIA_CATALOGO.md e docs/dados/pares.json.

Tarefa: criar a config tipada (fonte única), o modelo de projetos e as travas.
Escopo: src/config/**, src/content/projetos/** (coleção do Astro), scripts/validate-config.mjs, scripts/audit-compliance.mjs (inicial), docs/PENDENCIAS.md, componentes PreviewBanner e Provisorio (funcionais, estilo mínimo). Sem copy final.

Passos:
1. src/config/tipos.ts: confirmado(v, fonte), opcional(v), bloqueante(rotulo), aviso(rotulo, motivo), Campo<T>.
2. marca.ts (nome "Lavina — coletivo de arquitetura", razão social, CNPJ com exibirCnpj=true, logo = media-originais/lavina-logo.svg, tese e pilares com fonte), pessoas.ts (Amanda Lavina = líder; Renata Nürnberg; Lara Honofre; cau = aviso para as três), contato.ts (endereço Av. Pres. Vargas, 505…, CEP 88508-110; geo; horários estruturados; WhatsApp 5549991900821; Instagram @lavina.co.arq e @lavinamanda; mapsUrl da ficha "Amanda Lavina Arquitetura"), atuacao.ts (cidades reais: Lages, Balneário Camboriú, Urubici, Campo Belo do Sul, cada uma com a fonte), avaliacoes.ts (Google 5,0 · 15 · conferido 20/10/2026; trechos literais das avaliações 4, 5, 7 e 9 da investigação, com nome e inicial; aviso se conferidoEm > 90 dias), processo.ts (as 5 etapas literais do post DNqdWgzOxED + os rótulos do vídeo um-dia-no-escritorio com os tempos em que aparecem), modulos.ts, termos.ts, seo.ts, tema.ts.
3. Coleção "projetos" (src/content/projetos/*.md ou .json) com schema Zod. Campos: slug, titulo, codigo (ex.: J|C), tipo (residencial | saude-comercial), cidade (ou null), ano (ou null), natureza (executado | render | misto), destaque (0–n), autoriaProjeto, autoriaImagens, creditosExecucao[], legendaLiteral[{post, texto}], textoSite (vazio por enquanto), midia[], pares[], videos[], instagram[] (URLs dos posts), proximosProjetos.
   Projetos (dados do docs/dados/midia-legendas.json e dos pares):
   1. consultorio-jonny-arruda (saúde, Lages, misto: render + antes/depois + executado);
   2. cozinha-jc (residencial, Balneário Camboriú, misto: render + antes/depois + vídeo);
   3. banheiro-tons-claros (residencial, executado);
   4. suite-fl (residencial, Lages, render);
   5. projeto-tb (residencial, Campo Belo do Sul, render);
   6. clinica-cordis (saúde, Lages, render);
   7. living-jantar-painel (residencial, executado: vídeo apresentacao-principal + stills; post DLGhb8zMT8m; o painel paramétrico do reel DKuagnAMU8P com marcenaria @mobmoveis17);
   8. quarto-closet (residencial, executado: vídeo mostrando-quarto + stills; post DVPU7xpDhVQ);
   9. cozinha-farmhouse (residencial, executado: vídeo novo-modelo + stills; post DeHe75fOqIA).
4. validate-config.mjs: pendências em docs/PENDENCIAS.md. Em produção falha SÓ por: WhatsApp ausente; imagem sem natureza; projeto sem autoria; mídia "nao-usar" referenciada. CAU = aviso.
5. audit-compliance.mjs (inicial): varre dist/ por termos vetados e por <img>/<video> de projeto sem rótulo de natureza visível (data-natureza + texto). Gera docs/COMPLIANCE.md.
6. Preview: faixa "em revisão", selo PROVISÓRIO em campos pendentes, noindex. Rota _pendencias (dev).
7. Testes (scripts/test-config.mjs): preview passa com pendências; cada trava simulada derruba a produção; um projeto sem texto aparece em preview com selo e não some.

Regras: nada inventado (ano, área, cidade ausentes ficam null e não aparecem).
Entrega: relatório + saída dos testes + captura da rota _pendencias.
Critério de aceite: testes verdes; 9 projetos válidos no schema; PENDENCIAS.md e COMPLIANCE.md gerados.
````

---

## PROMPT 3 — Design system, logo e "A Fresta"

````text
Leia CLAUDE.md. Abra media-originais/lavina-logo.svg e media-originais/lavina-logo-comparacao.jpg.

Tarefa: construir o design system da assinatura "A Fresta", o componente do logo (com animação de desenho) e os tokens.
Escopo: src/styles/**, src/components/{marca,ui,fresta}/**, src/layouts/Base.astro, rota src/pages/_sistema.astro (noindex), scripts/audit-contraste.mjs, docs/MARCA.md. Sem seções de página.

Passos:
1. Logo:
   - <Logo/> inline a partir do SVG, currentColor, variantes completa / monograma / só "LAVINA".
   - Cada traço já tem pathLength="1": implemente o modo "desenhar" (stroke-dasharray/offset por traço, em sequência: marca → LAVINA → subtítulo com fade).
   - Otimize o SVG (SVGO) mantendo ids e pathLength.
   - Gere favicon/ícones (SVG + PNGs) a partir do monograma.
   - Escreva em docs/MARCA.md que é uma reconstrução vetorial e deve ser validada pela cliente.
2. "A Fresta":
   - <Fresta/>: linha horizontal de 1–2 px com brilho na cor Luz (box-shadow/filter suave; nada de neon), que acende de 0 a 100% de largura a partir do centro em ~600 ms.
   - <RevelaPorFresta/>: envolve imagem ou vídeo; a fresta acende e, em seguida, a mídia abre verticalmente a partir dela (clip-path: inset de 50% 0 → 0), uma única vez, ao entrar na tela (IntersectionObserver, threshold ~0,35). Sem JS ou com prefers-reduced-motion: mídia visível direto.
   - <DivisorFresta/>: divisor de seção.
   - Estado de foco/hover dos links de projeto: linha de luz que corre na base.
   - Tudo em CSS + IntersectionObserver; nada acompanha o progresso do scroll.
3. Tokens (claro e escuro): Grafite, Osso, Travertino, Greige, Freijó, Luz (só como luz); espaçamentos generosos; raios quase nulos (arquitetura: cantos retos; o raio vem só das fotos); linhas finas; durações e curvas de movimento (ease-out longas, sem bounce); grão sutil global (opcional; meça o custo).
   Tema claro/escuro sem flash (script inline mínimo, localStorage em try/catch, prefers-color-scheme). O tema escuro é o "padrão de impacto" da home; o claro é o padrão de leitura. Decida e justifique em MARCA.md.
4. Tipografia: teste Urbanist (200–600) + Spectral Italic 300 ao lado do logo; alternativas Manrope + Newsreader Italic. Escolha e justifique em 5 linhas. Licença conferida, self-host woff2, subset latino, preload só da principal. Escala nomeada com clamp(): display enorme e fino (ex.: 200–300), rótulos em versalete espaçado (como o LAVINA do logo).
5. Componentes-base: <Rotulo natureza="executado|render|antes|depois|video"/> (texto discreto e legível, ex.: "Obra executada", "Imagem 3D do projeto"); <Legenda/> editorial (01 / 09); <Credito/>; botões (primário = linha + texto, sem pílula); links; foco visível (anel de luz); <Comparador/> com estrutura e acessibilidade (o comportamento fica no 6B): input range nativo, setas do teclado, rótulos "Antes/Depois" ou "Projeto/Executado".
6. scripts/audit-contraste.mjs: AA em todos os pares de texto dos dois temas; falha abaixo de 4.5 (texto) e 3 (UI e grande).
7. _sistema: mostra tudo, inclusive o logo desenhando, a fresta acendendo e a revelação de uma foto real (use um "depois" da Cozinha J|C).

Regras: sem arco/oval/curva dourada como forma de interface; sem cartões brancos com borda fina; sem pílulas; prefers-reduced-motion desliga tudo.
Entrega: relatório + capturas de _sistema (390/1440, claro/escuro) + GIF ou sequência de 6 quadros do logo desenhando e da fresta revelando + tabela de contraste + pesos de fontes e CSS.
Critério de aceite: build verde; contraste verde; logo idêntico ao SVG quando "pronto"; animações a 60 fps no perfil do Chrome (sem layout thrash); fontes self-hosted; nenhum flash de tema.
````

---

## PROMPT 4 — Entrada e abertura (hero)

````text
Leia CLAUDE.md e docs/MARCA.md.

Tarefa: construir a entrada (o logo desenhado por luz) e a abertura da home.
Escopo: src/components/{entrada,abertura}/**, src/pages/index.astro (só entrada + abertura), src/scripts/entrada.ts.

Passos:
1. Entrada (≤ 3,5 s até a abertura legível; "Pular" visível desde o primeiro quadro; rede de segurança de 5 s; abertura já no DOM e acessível desde o início):
   - tela Grafite;
   - a marca "AN" se desenha como luz (stroke animado, com leve brilho Luz);
   - "LAVINA" se desenha logo depois, mais rápido;
   - "coletivo de arquitetura" aparece em fade;
   - uma Fresta horizontal acende na altura do logo e se abre de cima a baixo, revelando a abertura (o logo encolhe e vira o logo do cabeçalho).
   Só na primeira visita da sessão (sessionStorage em try/catch). Esc ou clique pulam. prefers-reduced-motion ou sem JS: abertura direta, logo estático.
2. Abertura (grafite, tela cheia, assimétrica):
   - imagem principal: a foto executada da Cozinha J|C com a linha de luz no forro (728943785…, derivado corrigido). A luz da foto conversa com a fresta. Alternativa: o loop mudo da sessão 1, só no desktop e depois do LCP;
   - título display enorme e fino, com a tese: "Arquitetura com presença em cada etapa.";
   - subtítulo curto, ex.: "Interiores, iluminação e acompanhamento de obra. Lages e Litoral Catarinense.";
   - dois CTAs em linha (sem pílula): "Ver projetos" e "Solicitar orçamento" (WhatsApp);
   - legenda editorial com o rótulo de natureza da foto ("Cozinha J|C · Obra executada · Balneário Camboriú");
   - um indicador discreto de rolagem.
3. Mobile 390: foto em 4:5, título sobre o terço inferior com proteção de contraste (degradê só de luminosidade, sem cor), CTAs empilhados. Nada de vídeo no mobile.
4. LCP = imagem principal em AVIF com fetchpriority="high" e dimensões, ou o título. A entrada não pode atrasar o LCP: a imagem carrega por baixo da animação.
5. Cabeçalho: logo (monograma + LAVINA) e menu (Projetos, Processo, Coletivo, Contato) + botão WhatsApp. Lê o tom da seção abaixo (data-tone). Menu mobile em tela cheia, com foco preso e Esc.
6. Meça (Lighthouse mobile + trace de performance) e registre em docs/PERFORMANCE.md.

Regras: sem GSAP; sem scroll-jacking; foco e teclado funcionando durante a entrada.
Entrega: capturas da entrada em 0 / 0,8 / 1,6 / 2,4 / 3,2 s e da abertura em 390/1440, claro/escuro + números do Lighthouse.
Critério de aceite: entrada ≤ 3,5 s; "Pular" por mouse, toque e teclado; LCP mobile < 2,0 s (ou relatório do motivo e correção proposta); CLS ≈ 0; JS da home dentro do orçamento.
````

---

## PROMPT 5 — Textos (a voz dela, editada para o site)

````text
Leia CLAUDE.md, docs/LAVINA_INVESTIGACAO_CLIENTE.md, docs/LAVINA_MAPA_MIDIA_LEGENDAS.md e src/content/projetos/**.

Tarefa: escrever todo o texto do site em docs/COPY_DECK.md e preencher textoSite de cada projeto, a partir das legendas e frases da própria Amanda.
Escopo: docs/COPY_DECK.md, docs/pesquisa/*.md, campo textoSite das coleções. NÃO altere layout.

Regras de escrita:
- Base: as legendas literais (com a fonte). Edite para o site: sem emojis, sem hashtags, sem "arrasou"; mantenha a voz (frases curtas, nós/eu, perguntas ao leitor). Não invente fatos (ano, área, material, cidade) que não estejam nas legendas ou na investigação.
- Citações literais dela entre aspas, assinadas ("— Amanda Lavina") e com o post de origem em data-attribute (para auditoria).
- Sem superlativos nem promessas (ver termos.ts). Fatos > adjetivos.
- Rótulo de natureza sempre que falar de imagem.
- Créditos: "Projeto: Lavina — coletivo de arquitetura · Imagem 3D: Renata Nürnberg" e execução conforme as legendas.

Entregar no COPY_DECK:
1. Abertura (tese + subtítulo + CTAs) e 2 alternativas de título.
2. Manifesto (bloco curto) a partir de: "Antes de falar de plantas, medidas e orçamentos… a gente fala sobre você", "o bom arquiteto é aquele que escuta", "não projeto mais pra impressionar, projeto pra viver", "Não existe acaso em um projeto bem executado".
3. Processo em 5 etapas (literal do post DNqdWgzOxED, editado) + a frase de cada etapa + o encaixe com o vídeo um-dia-no-escritorio (rótulos 8 AM, 9 AM, 10 AM, 2 PM, entrega). A menção à IA no processo: uma linha discreta, sem destaque.
4. Texto de cada um dos 9 projetos: título, linha de abertura (40–60 palavras, citável), "o pedido", "a resposta do projeto", detalhes (até 4 itens curtos), créditos e "ver no Instagram".
5. Coletivo: Amanda (líder), Renata e Lara. Use as palavras-chave que estão nos retratos delas (Renata: "Calma que resolve", "Escutar vem antes de projetar", "Projeta para pessoas reais", "Detalhe é prioridade", "Diálogo claro com os clientes", "Apaixonada por criar imagens realistas"; Lara: "Sensibilidade e acolhimento", "Apoio no processo", "Evolução diária", "Construindo repertório", "Dedicação constante") e a legenda do Dia do Arquiteto (post DSTUiTJjoQk). Formação e CAU: pendentes, não inventar.
6. Avaliações: 3 trechos do Google (4, 7 e 9 da investigação) com nome e inicial, mais "5,0 · 15 avaliações no Google (conferido em 20/10/2026)".
7. Atuação: as 4 cidades reais e a frase das avaliações "atende em Lages/SC, mas também faz projetos e acompanhamento de obra em outras cidades".
8. Contato: texto do orçamento e a mensagem pré-pronta do WhatsApp (tipo de projeto + cidade, sem dado sensível).
9. FAQ (6 perguntas reais de quem contrata arquiteto: como começa; quanto tempo; acompanha a obra; atende fora de Lages; projeto à distância; o que é imagem 3D). Resposta de 40–60 palavras, só com fatos da investigação. O que não sabemos vira [PENDENTE] (ex.: prazos).
10. No fim: até 10 decisões para o João e a Amanda aprovarem de uma vez.

Pesquisa (docs/pesquisa/): só o necessário para a conferência final e o SEO. (a) CAU: Res. 75/2014 (indicação de autoria e responsável técnico em peça publicitária) e Código de Ética (Res. 52/2013) sobre publicidade e crédito; (b) termos de busca reais para arquitetura de interiores em Lages e Balneário Camboriú. Fonte e data em cada um.
Entrega: COPY_DECK + lista de decisões.
Critério de aceite: nenhuma afirmação sem base nas fontes do repositório; zero termos vetados; cada projeto com textoSite.
````

---

## PROMPT 6A — Home

````text
Leia CLAUDE.md, docs/COPY_DECK.md, docs/MARCA.md e docs/dados/pares.json. Faça um plano de 10 linhas e implemente.

Tarefa: construir a home completa depois da abertura.
Escopo: src/pages/index.astro e src/components/home/**. Não mexa na entrada/abertura nem nas páginas internas.

Seções (cada uma com um gesto próprio; alternar grafite e osso; respiro grande):
1. Manifesto (osso): uma frase dela em display grande ("Antes de falar de plantas, medidas e orçamentos… a gente fala sobre você.") com o resto em texto pequeno; o vídeo falando-sobre-primeiro-contato numa janela vertical estreita ao lado (clique para tocar com som, poster, legenda queimada preservada).
2. A prova (grafite) — "Projeto × Executado": o comparador grande da Cozinha J|C (render → obra) ocupando a largura, com a fresta como linha divisória do comparador (a alça é a luz). Arrastar, tocar, setas do teclado; rótulos "Projeto (imagem 3D)" e "Obra executada"; legenda com crédito. Abaixo, o segundo par (Consultório Jonny Arruda) menor. Frase: "Não existe acaso em um projeto bem executado." — Amanda Lavina.
3. Projetos selecionados (osso): lista editorial numerada (01–06), nome grande e fino, tipo, cidade e natureza em versalete. No desktop, o hover/foco mostra a imagem do projeto flutuando junto ao cursor, revelada pela fresta (com pointer:fine; sem isso, miniatura fixa); no mobile, cada linha tem a miniatura. Link "Todos os projetos".
4. Presença em cada etapa (grafite): o vídeo um-dia-no-escritorio como peça central. As 5 etapas ao lado como capítulos clicáveis: clicar numa etapa leva o vídeo ao tempo correspondente (8 AM, 9 AM, 10 AM, 2 PM, entrega), com a etapa ativa marcada pela fresta. Sem vídeo (reduced-data/sem JS), as etapas em lista com stills.
5. Antes & Depois (osso): o comparador do Consultório (ou da Cozinha, o melhor par que não foi usado em 2), com legenda e créditos de execução.
6. O coletivo (grafite): as três arquitetas em retratos de mesma altura, com Amanda em destaque; palavras-chave delas como texto vivo; link para /coletivo.
7. Vozes (osso): 5,0 · 15 avaliações no Google, em display grande, mais 3 trechos em linhas editoriais (nome e inicial), e link para a ficha.
8. Onde atuamos (grafite): as 4 cidades em tipografia grande sobre uma linha de luz que as liga (sem mapa de terceiros).
9. Instagram (osso): "@lavina.co.arq" em display; 6 imagens NOSSAS (do manifesto, sem embed) em faixa horizontal com scroll-snap, cada uma linkando o post de origem; botão "Seguir no Instagram".
10. Orçamento (grafite): bloco final com o chamado; seletor de tipo de projeto (Residencial / Comercial e saúde / Reforma / Só interiores) e de cidade (Lages / Litoral / Outra) que monta a mensagem do WhatsApp; endereço, horário e "Ver no mapa" (link para o Google, sem iframe).

Regras: textos só do COPY_DECK; mídia só do manifesto; vídeos só no clique (exceto o loop da abertura no desktop); comparadores acessíveis (input range, aria-valuetext "Projeto 50%"); nenhuma seção repete a estrutura de outra; nada de cartões brancos com borda fina.
Entrega: relatório + capturas de cada seção em 390/1440, claro/escuro + Lighthouse + JS por página.
Critério de aceite: build verde; audit-compliance sem pendência nova (todas as imagens com rótulo); Lighthouse dentro da meta ou relatório do que falta; comparador e capítulos do vídeo funcionando por teclado.
````

---

## PROMPT 6B — Projetos: índice, páginas e transições

````text
Leia CLAUDE.md, docs/COPY_DECK.md e src/content/projetos/**.

Tarefa: construir /projetos e /projetos/[slug], com transições fluidas entre o índice e o projeto.
Escopo: src/pages/projetos/**, src/components/projetos/**. Não altere a home nem a config.

1. /projetos:
   - abertura curta;
   - filtros (Todos · Residencial · Saúde e comercial · Obras executadas · Imagens 3D) como texto com sublinhado de luz, acessíveis, atualizando a URL (?tipo=), funcionando sem JS (todos visíveis);
   - lista editorial grande (nome, cidade, tipo, natureza) com imagem de destaque alternando lados, em formatos diferentes (nada de grade uniforme);
   - contagem honesta ("9 projetos").
2. /projetos/[slug] (9 páginas), cada uma com:
   - abertura: imagem de destaque em tela cheia revelada pela fresta, título, código, cidade e natureza;
   - linha citável (40–60 palavras);
   - "o pedido" e "a resposta do projeto";
   - galeria editorial (formatos mistos; cada imagem com rótulo de natureza e legenda; lightbox acessível com teclado, swipe e foco preso; sem biblioteca);
   - comparadores quando houver par;
   - vídeo quando houver (janela vertical, clique para tocar);
   - ficha técnica (projeto, imagem 3D, execução e fornecedores conforme os créditos, cidade, natureza, post de origem);
   - "Ver no Instagram" (link para cada post);
   - próximo projeto (com a imagem dele).
3. Transição índice ↔ projeto: View Transitions (cross-document, @view-transition, view-transition-name na imagem de destaque) como MELHORIA PROGRESSIVA. Onde não houver suporte, navegação normal. Respeitar reduced-motion. Teste no Chrome e confira o fallback no Firefox/Safari.
4. Projetos só com render (Suíte F|L, T|B, Cordis): página completa, com aviso discreto "Imagens 3D do projeto"; não simular obra executada.
5. Projetos só com vídeo (living e jantar, quarto e closet, cozinha farmhouse): vídeo em destaque, stills reais como galeria, citação dela.
6. Ordem e destaque: Cozinha J|C e Consultório Jonny Arruda primeiro (têm a prova completa); depois executados; depois renders.

Regras: nenhuma imagem sem rótulo; créditos sempre visíveis; nada de cidade, ano ou área inventados.
Entrega: capturas do índice e das 9 páginas em 390/1440, claro/escuro + vídeo curto ou sequência de quadros da transição + Lighthouse por página.
Critério de aceite: 9 páginas geradas; links internos válidos (script); lightbox e filtros por teclado; transição funcionando no Chrome e fallback limpo nos outros; nenhuma pendência nova no audit-compliance.
````

---

## PROMPT 6C — Processo, Coletivo, Contato, 404

````text
Leia CLAUDE.md e docs/COPY_DECK.md.

Tarefa: construir /processo, /coletivo, /contato e a 404.
Escopo: src/pages/{processo,coletivo,contato,404}.astro e componentes. Não altere a home nem os projetos.

- /processo: as 5 etapas em sequência vertical, cada uma acendendo pela fresta ao entrar; o vídeo um-dia-no-escritorio com capítulos (reuso do componente da home); "acompanhamento de obra" com stills reais do vídeo (obra no galpão; escolha quadros sem rosto de terceiros, como os operários); fecho "projeto fiel à execução" com o comparador do Consultório; CTA de orçamento.
- /coletivo:
  - Amanda em destaque: retrato P&B, crédito da fotógrafa @sabrinarodriguesfoto, texto, citação, link @lavinamanda;
  - Renata e Lara com os retratos (o texto queimado no retrato pode ficar; se atrapalhar a leitura, use recorte sem o texto e escreva as palavras-chave em HTML);
  - a legenda do Dia do Arquiteto;
  - CAU e formação: não aparecem enquanto pendentes (sem buraco no layout).
- /contato:
  - o mesmo seletor de orçamento da home (WhatsApp com mensagem montada);
  - endereço, horário, telefone;
  - "Ver no mapa" (link) e o mapa incorporado SÓ depois do consentimento (sessão 7);
  - Instagram;
  - texto "projetos em Lages, no Litoral e à distância", com base nas avaliações.
- 404: tela grafite, monograma, uma fresta acesa e link "Voltar aos projetos".
Regras: tudo do COPY_DECK; sem formulário que colete dado pessoal (o orçamento vai pelo WhatsApp).
Entrega: capturas 390/1440, claro/escuro + Lighthouse.
Critério de aceite: build verde; nenhuma seção quebrada por dado pendente; audit-compliance sem pendência nova.
````

---

## PROMPT 7 — Conversão e LGPD

````text
Leia CLAUDE.md.

Tarefa: consentimento, privacidade, segurança e medição de conversão.
Escopo: src/components/consentimento/**, src/pages/privacidade.astro, scripts/gerar-csp.mjs, cabeçalhos do deploy.

1. WhatsApp: link wa.me/5549991900821 com a mensagem montada pelo seletor (tipo de projeto + cidade + "Vim pelo site"). Botão fixo discreto no mobile que some perto do rodapé. Rastreio de clique só com consentimento.
2. Banner de consentimento: Aceitar / Recusar / Personalizar com o mesmo peso visual; categorias: essenciais, preferências (tema), mapas, estatística; revogação por link fixo no rodapé. Nenhum terceiro antes do aceite.
3. Mapa (contato): iframe do Google Maps (coordenadas da ficha) só após aceitar "mapas"; antes, link.
4. Instagram: só links (nenhum embed, nenhum script da Meta).
5. /privacidade: política real (controlador: Amanda Lavina Arquitetura Ltda, CNPJ; dados tratados; finalidades; bases legais; retenção; direitos do titular; canal de contato; terceiros: WhatsApp/Meta, Google Maps; atualização datada). Marque [DECISÃO HUMANA: revisão jurídica] no COMPLIANCE.md.
6. CSP por hash no build; Referrer-Policy, Permissions-Policy, X-Content-Type-Options, HSTS no deploy. Sem violação no console.
7. Rodapé: marca, razão social e CNPJ (se exibirCnpj), endereço, horário, Instagram, privacidade, revogação de cookies, crédito "Site: WAXLO".
Entrega: capturas do banner + lista de requisições de rede antes e depois do aceite (Playwright).
Critério de aceite: zero requisição de terceiros antes do aceite; botões com mesmo peso; CSP sem violação; build verde.
````

---

## PROMPT 8 — SEO e GEO

````text
Leia CLAUDE.md e docs/pesquisa/.

Tarefa: SEO local e GEO.
Escopo: src/components/seo/**, src/config/seo.ts, sitemap, robots, scripts/audit-seo.mjs, docs/SEO.md.

1. Metadados por página (title ≤ 60, description ≤ 155, canonical a partir de SITE_URL, OG/Twitter). Imagem OG 1200×630 gerada no build: foto do projeto + logo + fresta.
2. JSON-LD:
   - entidade do escritório com o tipo correto conferido hoje no schema.org (ex.: ProfessionalService/LocalBusiness; justificar em SEO.md), com nome, alternateName ("Amanda Lavina Arquitetura"), endereço, geo, telefone, horários, sameAs (Instagram, ficha do Google), founder (Person: Amanda Lavina, jobTitle "Arquiteta") e areaServed só com as 4 cidades reais;
   - páginas de projeto como CreativeWork com creator (Lavina) e contributor (Renata Nürnberg nas imagens 3D);
   - BreadcrumbList; FAQPage onde houver FAQ;
   - SEM AggregateRating e SEM Review.
3. sitemap.xml e robots.txt (permitir crawlers de IA que respeitam robots; documentar). noindex em preview e enquanto não houver domínio.
4. GEO: cada página de projeto e o /processo com um parágrafo citável de 40–60 palavras no topo; autora e créditos perto do topo; datas quando houver.
5. docs/SEO.md:
   - consultas-alvo reais por página (arquiteta de interiores em Lages, projeto de interiores Balneário Camboriú, projeto de consultório Lages, reforma de cozinha Lages, acompanhamento de obra);
   - checklist do Perfil da Empresa (renomear para "Lavina — coletivo de arquitetura"? decisão da Amanda; fotos reais; serviços; link do site);
   - roteiro mensal de teste em ChatGPT, Perplexity e Gemini;
   - sem páginas por bairro ou cidade sem conteúdo real.
6. audit-seo.mjs: títulos, descriptions, canonical, OG, JSON-LD válido, links, sitemap.
Entrega: relatório + saída do audit-seo + validação do schema.
Critério de aceite: audit-seo verde; JSON-LD válido; noindex ativo enquanto não houver domínio.
````

---

## PROMPT 9 — QA, conferência final e deploy

````text
Leia CLAUDE.md, docs/COMPLIANCE.md, docs/PENDENCIAS.md e docs/pesquisa/.

Tarefa: auditoria completa, passada única de normas e deploy de preview.
Escopo: auditorias, correção de bugs, docs. NÃO afrouxe travas, listas nem rótulos.

1. Auditorias: a11y (axe, claro/escuro, 390/1440, teclado, leitor de tela), Lighthouse (mobile e desktop, todas as rotas), SEO, compliance, contraste, links, peso de JS e mídia por rota, prefers-reduced-motion, sem JavaScript, Firefox e Safari/WebKit (Playwright) para o fallback das transições.
2. Conferência de normas (fonte primária vigente hoje, em docs/pesquisa/final-<n>.md, com VERIFICADO / FONTES DIVERGEM / NÃO VERIFICADO / DECISÃO HUMANA). Tabela em COMPLIANCE.md "item → situação → o que mudar → quem decide":
   1. CAU: indicação do autor e do responsável técnico em cada projeto divulgado (Res. CAU/BR 75/2014; infrações da Res. 198/2020); registro da PJ; número CAU das arquitetas (hoje ausente).
   2. Direito autoral: crédito de projeto e de imagem 3D (Renata) e da fotógrafa (@sabrinarodriguesfoto); fotos de obra sem crédito de fotógrafo.
   3. Publicidade (Código de Ética, Res. CAU/BR 52/2013): sem superlativo; reputação por fatos; fornecedores só como crédito técnico.
   4. CDC: rótulo render × executado em todas as imagens; nenhuma imagem 3D apresentada como obra.
   5. Clientes identificáveis (clínicas com nome): autorização declarada; residências sem endereço; crianças sem nome.
   6. Avaliações do Google reproduzidas (nome e inicial) e atualização da nota.
   7. LGPD: política, banner, mapa, WhatsApp sem dado sensível (revisão jurídica).
   8. Coerência nome / endereço / telefone entre site, Google e Instagram (o nome no Google é "Amanda Lavina Arquitetura").
   9. Uso de IA no processo (citado por ela): só como ela descreve.
3. Gere COMPLIANCE.md final, MELHORIAS.md (fotos profissionais das obras, executado da Cordis e do T|B, vetor original do logo, mais projetos, página por projeto do Litoral, e-mail, blog) e DEPLOY.md (como plugar coletivoarquiteturalavina.com.br e trocar SITE_URL).
4. Deploy de PREVIEW na Vercel (noindex), com engines/packageManager fixados; relate a URL. Produção só depois do domínio e de validate-config + audit-compliance verdes.
5. Capturas finais de todas as rotas em docs/capturas/final/.
Entrega: notas por rota, pesos, bloqueios de produção, tabela de normas, URL do preview.
Critério de aceite: preview no ar; todas as auditorias anexadas; COMPLIANCE.md completo; nenhum bloqueio escondido.
````

---

## PROMPT L — Nova mídia (reutilizável)

Coloque os arquivos em `media-originais/entrada/` e cole o prompt com a legenda numerada (anexar é opcional).

````text
Leia CLAUDE.md e docs/MIDIA_CATALOGO.md.
Tarefa: ingerir o lote abaixo. NÃO altere páginas.
Lote: <1 = arquivo — projeto — natureza (render/executado/antes/depois/vídeo/retrato) — autoria da imagem — post de origem (se houver)>, <2 = …>
Passos: mover para media-originais/ com git mv; registrar no manifesto (natureza, autoria, créditos, legenda, uso); conferir qualidade e anotar problemas; formar novos pares se houver; rodar media:prepare; atualizar MIDIA_CATALOGO.md. Ligar a mídia a uma página só se eu pedir.
Critério de aceite: originais intactos (hash), manifesto válido, derivados gerados, nada sem natureza.
````

## PROMPT D — Novo dado (reutilizável)

````text
Leia CLAUDE.md, src/config e docs/PENDENCIAS.md.
Tarefa: aplicar os dados abaixo e fechar as pendências correspondentes.
Dados: <campo = valor — fonte — estado>
Passos: atualizar a config com a fonte; rodar validate-config e mostrar o antes/depois de PENDENCIAS.md; refazer as capturas das páginas afetadas; atualizar textos só onde houver marcador.
Critério de aceite: build verde; pendências fechadas; nada mais alterado.
````

Exemplos de uso:
- "cau.amanda = A000000-0 — certidão CAU — confirmado"
- "dominio = coletivoarquiteturalavina.com.br e SITE_URL — João — confirmado"
- "projeto clinica-cordis: adicionar fotos do executado (Prompt L antes) — natureza misto"

---

## C. Checklist do que ainda falta (não trava nada)

1. **Aprovação do logo reconstruído** pela Amanda (ou o arquivo original, se existir).
2. **CAU** da Amanda, da Renata, da Lara e da empresa.
3. **Domínio** coletivoarquiteturalavina.com.br registrado (confira no registro.br).
4. **Fotos da obra pronta** da Cordis e do T|B, e fotos profissionais das obras (o site melhora muito).
5. **Papel formal** da Renata e da Lara no coletivo, e formação de cada uma.
6. **E-mail** de contato.
7. **Nome da ficha do Google:** manter "Amanda Lavina Arquitetura" ou trocar para "Lavina — coletivo de arquitetura". A Amanda decide; o ideal é tudo igual.
