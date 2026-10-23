# Lavina | Coletivo de Arquitetura — Investigação completa da cliente

Versão 1 · 20/10/2026 · WAXLO · Projeto 3 de 3 (coletivo de arquitetura)

Documento-base do site. Junta o que o João mandou, o que vi no Instagram, no Google, no Google Maps e na Receita Federal (via BrasilAPI), e as decisões do João. A parte de mídia do repositório entra na seção 14 quando o repositório chegar.

Legenda: **INFORMADO** (João/cliente disse) · **VISTO** (vi na fonte, com data) · **REGISTRO** (dado público oficial) · **NÃO VERIFICADO** · **DIVERGE** · **PENDENTE** · **DECISÃO DO JOÃO**.

---

## 0. Resumo em 12 linhas

1. A marca pública é **"Lavina | Coletivo de Arquitetura"** (@lavina.co.arq, 53,5 mil seguidores, 207 posts). A empresa formal é **Amanda Lavina Arquitetura Ltda**, ativa desde **08/09/2023**, sócia-administradora **Amanda Oliveira Lavina** (REGISTRO).
2. Antes houve outra marca: um monograma **"AL — arquitetura e interiores"** (stories de 2021–2022). A ficha do Google e o Facebook ainda se chamam "Amanda Lavina Arquitetura".
3. O coletivo tem ao menos 3 pessoas: **Amanda** (líder), **Renata Nürnberg** (arquiteta e urbanista, interiores e imagens realistas; assina projetos e renders "elaborados para @lavina.co.arq") e **Lara Honofre** (arquitetura e urbanismo; função a confirmar).
4. Posicionamento real, repetido em tudo: **presença em cada etapa + acompanhamento de obra + projeto fiel à execução.** As avaliações do Google provam isso, inclusive com clientes de fora (MS) e projeto à distância.
5. Atuação: **Lages** (sede) e **Litoral Catarinense**, com Balneário Camboriú como segundo polo. Também há obras em **Urubici** e **Campo Belo do Sul** (VISTO).
6. Forças do portfólio: **clínicas e consultórios** (HOF, ginecologia e obstetrícia, cardiologia, odontologia), **cozinhas**, **quartos** (inclusive infantis, montessorianos) e **banheiros**. Linguagem: tons claros e quentes, pedra, madeira, curvas e muita **luz embutida**.
7. Prova de qualidade que diferencia: o par **render → obra executada** ("100% fiel ao projeto") e a série **Antes & Depois**.
8. O que mais engaja são os **vídeos da Amanda falando** ("Arquiteta do outro lado": 16 mil e 13,1 mil visualizações) e os vídeos de ambiente com ela.
9. Google: **5,0 com 15 avaliações**, todas 5 estrelas, ricas em fatos (obra, orçamento, materiais, cliente à distância). Facebook: 5,0 com 5 avaliações (VISTO na busca).
10. Rede de parceiros visível (marcenarias, marmoraria, iluminação, cortinas, decoração). Uma delas, a Espaço Decora by Rita Assunção, é cliente da WAXLO.
11. A marcenaria da **Clínica Espaço B** (nosso projeto 1) foi feita pela Balbino Móveis, num post em que o @lavina.co.arq está marcado. Indica que o projeto é da Lavina, mas é **NÃO VERIFICADO**: perguntar.
12. A cliente não tem site nem imprensa indexada. O site vira a fonte oficial.

---

## 1. Fontes e método

- **Instagram @lavina.co.arq** (VISTO em 20/10/2026, logado como waxlo.tech): bio, grade completa rolada até ~2024, 30 legendas lidas uma a uma, aba Reels com visualizações, aba Marcados, destaques "Escritório" e "Clientes" (parcialmente; são stories antigos).
- **Perfis da equipe:** @lavinamanda, @arq_renatanurnberg, @honofrelara, @lara.honofre (privado). Só a parte profissional (bio).
- **Google Maps:** ficha "Amanda Lavina Arquitetura" (visão geral, as 15 avaliações e a aba Sobre).
- **Google Search:** "Amanda Lavina" e "Lavina arquitetura Balneário Camboriú".
- **Receita Federal** via BrasilAPI (CNPJ 52.116.202/0001-05).
- **Linktree** amandalavina.
- **Não consegui:**
  - Consultar o CAU. O "Ache um Arquiteto" do CAU/BR não permitiu automação, então não verifiquei registros.
  - Ler todos os 207 posts (li 30, cobrindo 2024–2026).
  - Ver todos os stories dos destaques.
  - Abrir o Facebook e o TikTok (só vi o resumo na busca).

---

## 2. Dados fixos (campos do config)

| Campo | Valor | Estado |
|---|---|---|
| Marca de uso | Lavina \| Coletivo de Arquitetura | VISTO (Instagram) |
| Nome na ficha do Google e no Facebook | Amanda Lavina Arquitetura | VISTO |
| Razão social / nome fantasia na Receita | AMANDA LAVINA ARQUITETURA LTDA / AMANDA LAVINA ARQUITETURA | REGISTRO |
| CNPJ | 52.116.202/0001-05 · ativa · Microempresa · Simples · início 08/09/2023 | REGISTRO (exibir no site: DECISÃO DO JOÃO) |
| CNAE principal | 7111-1/00 Serviços de arquitetura | REGISTRO |
| CNAEs secundários relevantes | 4399-1/01 Administração de obras; 7119-7/99 Atividades técnicas de engenharia e arquitetura; outras obras de engenharia civil; comércio de artigos domésticos; marketing direto | REGISTRO |
| Responsável | Amanda Oliveira Lavina, sócia-administradora | REGISTRO (o João passou "Amanda Lavina") |
| Registro CAU (pessoa e empresa) | — | PENDENTE (o João disse que ainda não tem; não consegui consultar) |
| Endereço (Google) | Av. Pres. Vargas, 505, Sagrado Coração de Jesus, Lages/SC, CEP 88508-110 | INFORMADO e VISTO no Maps |
| Endereço (Receita) | Rua Lourenço Teodoro Waltrick, 505, esquina com Av. Pres. Vargas, Sagrado Coração de Jesus, CEP 88508-170 | REGISTRO. **DIVERGE** do Google em rua e CEP (é um prédio de esquina). Decidir qual vai no site e no schema; o ideal é o Google e a Receita ficarem iguais |
| Coordenadas (Maps) | -27.8109211, -50.3161973 | VISTO |
| Plus code | 5MQM+JG Sagrado Coração de Jesus, Lages | VISTO |
| Horário | seg a sex 9h–19h; sáb e dom fechado | INFORMADO e VISTO |
| WhatsApp de orçamento | +55 49 99190-0821 (também é o botão do Linktree) | INFORMADO e VISTO |
| Instagram | @lavina.co.arq · pessoal da líder: @lavinamanda (9,4 mil) | VISTO |
| Outros canais | Facebook "Amanda Lavina Arquitetura" (≈510 seguidores, 5,0 com 5 avaliações, frase "Transformamos o seu lar, através de uma arquitetura de DETALHES!"); TikTok @amandaolavina (≈6,1 mil, conteúdo pessoal e de casa) | VISTO na busca do Google |
| Linktree | "É aqui que a realização de um sonho começa. Solicite seu orçamento já" → WhatsApp; também e-mail (endereço não exibido) | VISTO |
| E-mail | — | PENDENTE |
| Domínio | — | PENDENTE |
| Acessibilidade | estacionamento acessível para cadeira de rodas | VISTO (aba Sobre do Maps) |

---

## 3. Linha do tempo (só fatos com fonte)

- **≈2017:** formatura da Amanda. Ela escreveu em 01/05/2026: "9 anos de formação e 6 anos de escritório". O ano é uma conta minha a partir disso (NÃO VERIFICADO).
- **≈2020:** início do escritório, pela mesma frase.
- **2021–2022:** marca "AL — arquitetura e interiores" (monograma em papelaria e nos prints de clientes). Story do fim de 2022: "37 clientes" no ano, "ansiosa pelos clientes de 2023".
- **08/09/2023:** abertura do CNPJ Amanda Lavina Arquitetura Ltda (REGISTRO).
- **2024:** o perfil já é @lavina.co.arq; posts de quartos infantis e "quarto capuccino" (ago/2023, pela busca).
- **2025–2026:**
  - Vira "Lavina | Coletivo de Arquitetura".
  - A Renata Nürnberg passa a assinar projetos e imagens realistas "para @lavina.co.arq".
  - A Lara Honofre aparece em projetos de Balneário Camboriú.
  - Fotos de equipe em estúdio.
- **2026:**
  - Série "**Arquiteta do outro lado**" sobre a obra da casa da própria Amanda em Balneário Camboriú (ela do lado de cliente: prazos, marcenaria, obra).
  - Grandes projetos comerciais: Clínica Day HOF (mais de 300 m²), consultório ginecológico-obstétrico, Clínica Cordis.

---

## 4. Equipe (só dados profissionais)

| Pessoa | O que se sabe | Fonte | Falta |
|---|---|---|---|
| **Amanda Oliveira Lavina** | Arquiteta, líder, sócia-administradora; rosto da marca nos vídeos; bio "Projetos, lugares e rituais do cotidiano · Arquiteta · @lavina.co.arq" | REGISTRO + VISTO | CAU; formação (instituição); como quer ser apresentada |
| **Renata Nürnberg** (@arq_renatanurnberg) | "Arquiteta e Urbanista \| @lavina.co.arq · Especializada em interiores e imagens realistas"; assina projetos e renders da Lavina (Cordis, T\|B, F\|L, Cozinha J\|C, Lavabo A\|R, Quarto I, Quarto Isa, Prédio Convicta, quarto infantil) | VISTO | CAU; papel formal no coletivo (sócia, associada, parceira) |
| **Lara Honofre** (@honofrelara; pessoal @lara.honofre, privado) | "arquitetura e urbanismo"; perfil "mostrando processos e crescimento dia a dia · arquitetura com propósito"; coautora marcada em projetos de Balneário Camboriú | VISTO | Formada ou estudante? CAU? função |
| Outras pessoas nas fotos de equipe | Fotos de estúdio com 3 mulheres; os nomes vêm das marcações | VISTO | Confirmar quem são e a ordem |

**DECISÃO DO JOÃO (20/10):** os projetos e imagens da Renata são feitos para a Amanda, estão autorizados e o site dá o crédito em cada projeto.

---

## 5. Posicionamento e voz (como ela fala)

Pilares que se repetem nas legendas, nas avaliações e na bio:

1. **Presença em cada etapa / acompanhamento de obra.** Bio: "Arquitetura com presença em cada etapa · Projetos personalizados + acompanhamento de obra". Avaliações: "acompanha a obra de perto"; "fez o projeto, providenciou materiais, mão de obra e acompanhou a execução".
2. **Fidelidade projeto → obra.** "O projeto ficou fiel à execução"; "100% fiel ao projeto"; "Executado ficou tão lindo quanto".
3. **O projeto parte da identidade do cliente.** "A cliente não precisou se adaptar ao estilo do escritório"; "traduzir a essência da nossa cliente".
4. **Projetar para viver, não para impressionar.** É a frase-tese da Amanda no post do living (01/05/2026).
5. **Sensação acima de tendência.** Leveza, paz, acolhimento, "sofisticação serena"; materiais "que não cansam com o tempo".
6. **Técnica a serviço do resultado.** Tons claros "estratégicos" para ampliar e refletir a luz; marcenaria que organiza; iluminação integrada.

**Tom:** primeira pessoa (Amanda) ou "nós" (coletivo), frases curtas, perguntas ao leitor, emojis brancos e bege. No site: manter a voz dela, sem emojis, sem "arrasar"; frases-chave dela como citações assinadas.

---

## 6. Portfólio mapeado (o que existe hoje no Instagram)

Render = imagem 3D. Executado = obra pronta (foto ou vídeo). "Ambos" = existe o par render → obra.

| Projeto (como aparece) | Tipo | Cidade | Render/Executado | Autoria/créditos visíveis | Post |
|---|---|---|---|---|---|
| Clínica Day HOF (Dra. Dayane Hoefling) | Clínica de HOF, mais de 300 m² | Balneário Camboriú (marcação) / #lages (hashtag): **DIVERGE** | Executado (reels e fotos) | Lavina + Renata; vídeo captado por agência | /p/DYnfljQO-y2, /p/DYxH-LQDqk1, /p/DYpO6ZAOayo |
| Consultório ginecológico-obstétrico de alto risco | Consultório | — | Executado + Antes & Depois | Marcenaria Lazzari; pedras Álamo; cortinas Maitê; iluminação AF Eletricidade; decor Espaço Decora | /p/DTqJY19jgis, /p/DUUHxO4DhqK |
| Clínica Cordis Cardiologia | Consultório | Lages | Ambos ("Executado ficou tão lindo quanto") | Projeto e imagens: Renata Nürnberg para @lavina.co.arq | /p/DdY8lWNlqx7, /p/Dejm1uIFtwG |
| Projeto T\|B (quarto masculino, painel paramétrico, camisas) | Residencial | Campo Belo do Sul/SC | Ambos ("Executado ficou incrível") | Renata para @lavina.co.arq | /p/DcOmO3WFqjk |
| Projeto F\|L (canto de leitura) e Suíte F\|L (tons escuros) | Residencial | Lages | Render | Renata para @lavina.co.arq | /p/Daf3oholu57, /p/DaLTDbClllI |
| Cozinha J\|C | Residencial | Balneário Camboriú | Ambos (render + Antes & Depois executado) | Renata (render); fornecedores Maitê, Álamo, Alpen, AF | /p/DZIFaXyFq8k, /p/DZh0O6uFqkV, /p/DZ5PcHNDj3R |
| Cozinha com cristaleira (fixado) | Residencial | — | Executado ("fiel à execução") | Lavina + Renata | /p/DZn_e-qOnLN |
| Banheiro de tons claros (cuba esculpida) | Residencial | — | Executado | Portobello Shop Lages, Álamo, AF Eletricidade, Espaço Decora Enxovais | /p/DVcLRsXDpYJ |
| Quarto "super transformação" | Residencial (reforma) | — | Executado | Lavina + Amanda | /p/DVPU7xpDhVQ |
| Cozinha farmhouse ("nada de minimalismo") | Residencial | — | Executado (out/2026) | Lavina + Renata | /p/DeHe75fOqIA |
| Living e cozinha (casa cheia, café, vinho) | Residencial | Balneário Camboriú | Ambos | Lavina + Lara Honofre | /p/DXb1ylYjrk4, /p/DXOz1TbDlgU |
| Casa da Amanda (living com quartzito Abstrato verde) | Residencial | Balneário Camboriú | Executado (série) | Amanda; fornecedores marcados | /p/DXzMwBRFUox |
| Lavabo A\|R | Residencial | Balneário Camboriú | Render | Renata para @lavina.co.arq | /p/DX_1ArHFgqO |
| Quarto I e Quarto Isa (transição infância-adolescência) | Residencial | Lages | Render | Renata (imagem realista e projeto) | /p/DXJ_qhzFvuN, /p/DU58sxUDdUO |
| Quarto infantil LEGO + montessoriano | Residencial | — | Executado | Lavina + Amanda | /p/DWCyK5Xjhn3, /p/DWkaHwZjiM7 |
| Quarto de menina "MC" | Residencial | — | Executado (2024) | Balbino Móveis, Dona Decor | /p/DBFQwrWvJqq, /p/C7CNNFgMszr, /p/C7iLVrVswnE |
| Prédio Convicta (fachada) | Arquitetônico | Balneário Camboriú | Render. **O Instagram marca o post como "Conteúdo de IA"** | Renata ("projeto e imagem realista") | /p/DYZqJr_Fqwz |
| Cabana em Urubici | Residencial | Urubici/SC | Executado (avaliação no Google com fotos) | Amanda | avaliação de Daniela Gerber |
| Clínica Viver Sorrindo | Odontologia | — (há uma clínica com esse nome perto do escritório, em Lages; confirmar) | Antes & Depois | — | grade |
| Casas e fachadas com piscina | Arquitetônico | — | Render | provavelmente Renata | grade (2025) |
| **Clínica Espaço B** (marcenaria) | Estética | Lages | Executado | Balbino Móveis executou; @lavina.co.arq marcado | /p/Dcv2JSSRwe6. **NÃO VERIFICADO** se o projeto é da Lavina: perguntar (seria vitrine cruzada WAXLO) |

**Privacidade:** nomes de crianças e iniciais de clientes que aparecem nas legendas (Theo, MC, I, Isa, T\|B, F\|L, J\|C, A\|R) não entram no site como nome. Usar só o código do projeto ou um título neutro. Clínicas entram com nome (DECISÃO DO JOÃO: clientes autorizaram).

---

## 7. Rede de parceiros (créditos que aparecem)

Marcenaria: Lazzari Móveis, Balbino Móveis, Alpen Planejados, Móveis Moraes (casa da Amanda), MVH Móveis. Pedras: Álamo Marmoraria. Iluminação/elétrica: AF Eletricidade. Cortinas: Maitê Decorações. Revestimentos: Portobello Shop Lages. Mobiliário: Gottie, Pollus Móveis. Decoração e enxoval: Espaço Decora by Rita Assunção. Vídeo de obra: agência SM Marketing (Day HOF).

Uso no site: uma **ficha técnica por projeto** com créditos de execução (como em revista de arquitetura). Não fazer uma "vitrine de marcas" na home, para evitar cara de patrocínio velado (ponto do Código de Ética do CAU, a conferir no final).

---

## 8. O que performa (Reels, visualizações VISTAS em 20/10/2026)

- "Living com painel paramétrico e TV" (Amanda apresentando): **16,5 mil**
- "Arquiteta do outro lado" (Amanda na rua, carro): **16 mil**
- Sala de jantar com cristaleira iluminada: **13,8 mil**
- "Arquiteta do outro lado" (casa à noite): **13,1 mil**
- Quarto de solteiro verde (executado): **11,4 mil**
- Equipe na escada (vestidos marrons): **10,2 mil**
- "Arquiteta do outro lado" (obra): **9.037** e **8.368**
- Cozinha com cristaleira: **8.353**; "o cliente: eu gostaria de melhorar o que já é bom": **8.262**

**Leitura:** a Amanda falando e a pessoa da arquiteta em obra rendem o dobro dos ambientes sozinhos. O site deve ter os vídeos dela em destaque (DECISÃO DO JOÃO), com a série como trilha "do projeto à obra".

---

## 9. Avaliações do Google (todas as 15, 5,0, VISTAS em 20/10/2026)

Transcrição literal. No site: nome e inicial, sem foto. Frases com superlativo não entram.

| # | Quem (perfil) | Quando | Texto |
|---|---|---|---|
| 1 | Daniela Gerber (4 aval., 9 fotos) | 3 anos | "Simplesmente entregou tudo que precisávamos no projeto da nossa cabana em Urubici-SC do início ao fim, impecável o trabalho da Amanda! Sem falar que é extremamente atenciosa e sempre responde rapidamente! Obrigada pelo excelente trabalho que fez pra gente ! Gratidão" (+6 fotos) |
| 2 | Alceu Rodrigo De Souza Pinguim | 3 anos | "Indispensável trabalho lindo, otimização de espaços com a cara e gosto dos clientes." (com fotos) |
| 3 | Paulo Carvalho (Local Guide) | editado há 5 meses | "Super profissionais. Prestativas e muito competente. Super recomendo" |
| 4 | Jane Walter | 4 anos | "Amanda, excelente arquiteta. Fez a reforma da nossa casa, em Lages/SC- e nós morando em outro estado (MS). Fez o projeto, providenciou materiais, mão de obra e acompanhou a execução. Muito cuidadosa com orçamentos, opções de materiais e sempre disponível. Nossa casa ficou muito além das nossas expectativas - LINDA. Recomendamos!" |
| 5 | Luísa Walter da Rosa | 4 anos | "Amanda é uma profissional completa. Eu me mudei de apartamento e ela prestou consultoria à distância, me auxiliando em todas as etapas de renovação e decoração. Sempre disponível, respondendo com agilidade, e aberta a entender e se adaptar […]" (truncado) |
| 6 | Dieimes Lopes | 3 anos | "Excelente profissional, moderna com uma abordagem inovadora e única em seus projetos. Com uma proposta original para o projeto demonstrou um pensamento fora da caixa, apresentando soluções que vão além das expectativas convencionais, com Funcionalidade e Eficiência." |
| 7 | Isabel Soro Melo | 4 anos | "Excelente arquiteta que atende em Lages/SC, mas que também faz projetos e acompanhamento de obra em outras cidades. Os projetos são lindos e de extremo bom gosto." |
| 8 | Cintya Ramlov (Local Guide) | 4 anos | "Arquiteta de confiança, acompanho o trabalho há anos! Profissional, agilizada e de muito bom gosto, recomendo demais." |
| 9 | Roberta de Souza Zappelini (Local Guide) | 4 anos | "Projetos de muita elegância e bom gosto. Acompanha a obra de perto e é extremamente exigente com o resultado final." |
| 10 | Rosane Nunes Franca | 3 anos | "Foi tudo de bom extremamente satisfeita com o resultado ❤️" |
| 11 | lolipop (Local Guide) | 3 anos | "Os projetos mais conseituais e exclusivos! Inclusive o meu. 🧡🤍🧡 Perfeita! […]" |
| 12 | Caroline Miranda | 4 anos | "A melhor arquiteta de Lages e região!!" (superlativo: não usar) |
| 13 | Eliezer Miranda | 4 anos | "Uma excelente profissional!!" |
| 14 | Japa Machado | 3 anos | (só estrelas) |
| 15 | Bianca Paes | 4 anos | (só estrelas) |

Os trechos mais úteis para o site são o 4 (cliente em outro estado, obra completa), o 9 (obra de perto), o 7 (outras cidades), o 5 (à distância) e o 1 (cabana em Urubici). Eles provam o pilar "presença em cada etapa" melhor que qualquer texto nosso.

---

## 10. Identidade visual observada

- **Paleta dos projetos:** off-white quente, greige, nude e rosado claro; madeira (freijó e carvalho, ripado reto e paramétrico curvo); pedras (mármore branco, travertino, quartzito verde "Abstrato"); metais dourados escovados; pontos de verde-oliva e terracota.
- **Assinatura técnica:** **luz embutida em linha** (perfis de LED no forro, nichos e cristaleiras iluminados, espelhos retroiluminados, sancas). Está em quase todo projeto.
- **Formas:** curvas (recepções, cabeceiras, bancadas), arcos e cantos arredondados. Atenção: "arco" já foi assinatura de outro site nosso. Nos projetos dela os arcos aparecem nas fotos, mas não viram assinatura do site.
- **Marca atual:** nos reels aparece uma marca d'água "LAVINA" com um símbolo à esquerda e o subtítulo "coletivo de arquitetura". Preciso do arquivo original. **Marca antiga:** monograma "AL" manuscrito + "arquitetura e interiores". Não usar.
- **Fotografia:** ensaio de estúdio da equipe com fundo cinza claro e figurino marrom/chocolate. Amanda no avatar com fundo neutro.
- **Tipografia dos posts** (não copiar no site): serifa com itálico manuscrito ("closet com penteadeira"), serifa bold ("ANTES & DEPOIS"), versalete espaçado ("ARQUITETA DO OUTRO LADO").

---

## 11. Implicações para o site (direção preliminar; fecha com as fotos do repositório)

- **Promessa central:** "Arquitetura com presença em cada etapa", provada por fatos: render → obra, obra acompanhada, clientes à distância, avaliações.
- **Assinatura visual candidata: "A Fresta".** O site é revelado por frestas de luz, como um perfil de LED que acende no forro. É uma linha de luz que abre o espaço, não uma linha que se desenha no scroll. Combina com a especialidade (interiores e iluminação) e não repete nenhuma assinatura da lista de proibidos. Validar com as fotos reais.
- **Interatividade com lastro:**
  1. **Projeto × Executado**: comparador com cursor entre o render e a foto da obra pronta, nos projetos que têm os dois (Cordis, T|B, Cozinha J|C e outros). É a prova mais forte do posicionamento.
  2. **Antes & Depois** nos projetos de reforma (consultório, cozinhas, quarto).
  3. **Índice de projetos** com filtro por tipo (residencial, comercial/saúde, arquitetônico) e por cidade (Lages, Litoral, Serra). Visual de lista editorial, não grade de cartões.
  4. **Página de projeto** com ficha técnica (tipo, cidade, ano, área, autoria, imagens 3D de quem, créditos de execução, render ou executado) e link "ver no Instagram".
  5. **"Do projeto à obra"**: a trilha das etapas (escuta → projeto e imagens 3D → detalhamento → obra acompanhada → entrega), com os vídeos da Amanda de "Arquiteta do outro lado".
  6. **Mapa de atuação** só com cidades reais: Lages, Balneário Camboriú, Urubici, Campo Belo do Sul. Sem inventar região.
- **Instagram:** link "ver no Instagram" em cada projeto (para o post), um bloco final com as últimas imagens (estáticas, geradas no build a partir de arquivos nossos, nunca embed antes do consentimento) e "Seguir @lavina.co.arq".
- **Conversão:** "Solicite seu orçamento" → WhatsApp +55 49 99190-0821, com mensagem neutra que pergunta o tipo de projeto e a cidade (sem dado sensível).
- **Equipe:** página do coletivo com as três (fotos de estúdio), nome, formação e CAU quando houver.
- **Avaliações:** a nota do Google (5,0 · 15, com data) e 3 trechos de fato. Sem AggregateRating no schema.
- **Nada de "melhor", "nº 1" ou "grande arquiteta":** só fatos (anos de atuação, número de projetos, cidades, obras).

---

## 12. Decisões do João (20/10/2026)

1. **Autoria:** os projetos e imagens da Renata foram feitos para a Amanda e estão autorizados. O site dá o crédito em cada projeto ("Projeto e imagens 3D: Renata Nürnberg para Lavina").
2. **Render × executado:** cada imagem é rotulada como "imagem 3D do projeto" ou "obra executada".
3. **Vídeos da Amanda:** entram para dar visibilidade e deixar o site mais premium.
4. **Clientes identificáveis** (clínicas com nome e logo): autorizados pelos clientes à Amanda e por ela à WAXLO.
5. **CAU:** ainda não há número. Quando houver, entra pelo config (Prompt D).

---

## 13. Divergências e pendências (para fechar com o João)

1. **Endereço:** a Receita diz Rua Lourenço Teodoro Waltrick, 505, esquina com Av. Pres. Vargas, CEP 88508-170. O Google diz Av. Pres. Vargas, 505, CEP 88508-110. Qual vai no site? Recomendo alinhar a ficha do Google com o endereço oficial.
2. **Nome:** Instagram "Lavina | Coletivo de Arquitetura"; Google, Facebook e Receita "Amanda Lavina Arquitetura". O site usa "Lavina — Coletivo de Arquitetura" no visual e "Amanda Lavina Arquitetura Ltda" no rodapé legal? Decidir. A ficha do Google deveria ser renomeada?
3. **CAU** da Amanda, da Renata e da Lara, e o registro da empresa no CAU. Precisa estar no site em cada projeto divulgado (conferência final).
4. **Função da Lara** (arquiteta formada ou estudante?) e se a Renata é sócia, associada ou parceira. Quem mais compõe o coletivo?
5. **Day HOF:** a cidade é Balneário Camboriú ou Lages?
6. **Prédio Convicta:** o Instagram marcou como "Conteúdo de IA". Se a imagem foi gerada ou alterada por IA, o site precisa rotular assim, ou deixá-la de fora.
7. **Clínica Espaço B:** o projeto é da Lavina? Se for, vira um case cruzado da WAXLO.
8. **Lavin Home e @lavin.mesaposta:** são marcas paralelas da Amanda (casa e mesa posta, pela busca). Entram no site ou ficam fora? Recomendo fora, ou só um link.
9. **E-mail** de contato e **domínio**.
10. **Logo atual** em vetor e manual de marca (a marca d'água "LAVINA" dos reels).
11. **Números para a seção de fatos:** total de projetos entregues, obras acompanhadas, cidades e anos de escritório (a frase dela diz 6 anos).
12. **Fichas por projeto:** ano, área, cidade e créditos de cada projeto que entrar no site.

---

## 14. Mídia do repositório (a preencher quando o repositório chegar)

- Inventário por projeto: arquivos, render ou executado, autoria das imagens, qualidade.
- Vídeos da Amanda: duração, peso, legenda queimada, uso.
- Fotos da equipe e do escritório.
- Logo.
- Seleção: o que vira hero, o que vira par render → obra, o que fica fora.

---

## 15. Lista para a conferência final (não trava o design)

1. **CAU:** registro de cada arquiteta citada e da pessoa jurídica. Indicação do responsável técnico e do autor em cada projeto divulgado (Res. CAU/BR 75/2014 e 198/2020; direito autoral e Manual do Arquiteto).
2. **Crédito do fotógrafo** de cada foto de obra e do ensaio da equipe.
3. **Render × executado × IA:** rótulo em todas as imagens (CDC, publicidade enganosa).
4. **Autorização dos clientes:** comercial com nome e logo (autorizado, conforme o João); residencial sem endereço e sem nome de morador; crianças sem nome.
5. **Fornecedores:** só como crédito técnico, sem permuta não declarada (ética CAU).
6. **LGPD:** consentimento para Instagram e mapas, política de privacidade, WhatsApp sem dado sensível.
7. **Avaliações:** reprodução com nome e inicial; sem superlativos.

---

## Fontes

- Instagram: [@lavina.co.arq](https://www.instagram.com/lavina.co.arq/), [Reels](https://www.instagram.com/lavina.co.arq/reels/), [Marcados](https://www.instagram.com/lavina.co.arq/tagged/), [@lavinamanda](https://www.instagram.com/lavinamanda/), [@arq_renatanurnberg](https://www.instagram.com/arq_renatanurnberg/), [@honofrelara](https://www.instagram.com/honofrelara/)
- Posts citados: [cozinha com cristaleira](https://www.instagram.com/p/DZn_e-qOnLN/), [banheiro claro](https://www.instagram.com/p/DVcLRsXDpYJ/), [quarto transformação](https://www.instagram.com/p/DVPU7xpDhVQ/), [Clínica Cordis](https://www.instagram.com/p/DdY8lWNlqx7/), [Projeto T|B](https://www.instagram.com/p/DcOmO3WFqjk/), [Projeto F|L](https://www.instagram.com/p/Daf3oholu57/), [Suíte F|L](https://www.instagram.com/p/DaLTDbClllI/), [Antes & Depois cozinha](https://www.instagram.com/p/DZ5PcHNDj3R/), [Cozinha J|C](https://www.instagram.com/p/DZIFaXyFq8k/), [Day HOF](https://www.instagram.com/p/DYnfljQO-y2/), [Day HOF 2](https://www.instagram.com/p/DYxH-LQDqk1/), [consultório GO](https://www.instagram.com/p/DTqJY19jgis/), [living da Amanda](https://www.instagram.com/p/DXzMwBRFUox/), [cozinha farmhouse](https://www.instagram.com/p/DeHe75fOqIA/), [Prédio Convicta](https://www.instagram.com/p/DYZqJr_Fqwz/), [equipe](https://www.instagram.com/p/DW2X0ZJjjc6/), [marcenaria Clínica Espaço B (Balbino)](https://www.instagram.com/p/Dcv2JSSRwe6/)
- [Google Maps: Amanda Lavina Arquitetura](https://www.google.com/maps/place/Amanda+Lavina+Arquitetura/@-27.8109211,-50.3161973,17z)
- [Receita Federal via BrasilAPI: CNPJ 52.116.202/0001-05](https://brasilapi.com.br/api/cnpj/v1/52116202000105)
- [Linktree amandalavina](https://linktr.ee/amandalavina)
- [Busca Google "Amanda Lavina"](https://www.google.com/search?q=%22Amanda+Lavina%22) (Facebook, TikTok, Econodata, Serasa nos resultados)
- [CAU/BR — Ache um Arquiteto](https://acheumarquiteto.caubr.gov.br/) (não consegui consultar)
