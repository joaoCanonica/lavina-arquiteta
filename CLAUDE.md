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
