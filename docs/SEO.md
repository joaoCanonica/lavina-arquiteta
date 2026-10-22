# SEO local e GEO

Sessão 8 · 22/10/2026. Base: `docs/pesquisa/busca-local.md` (termos candidatos, sem dado de volume) e a config (`src/config/`). Conferido por `pnpm audit-seo`, que também roda `pnpm validar-schema`. A saída da última execução está em `docs/capturas/seo/audit-seo.json`.

## 1. Estado atual: sem indexação

- **noindex em todas as páginas:** o site está em preview e o domínio `coletivoarquiteturalavina.com.br` ainda não foi registrado (`src/config/seo.ts`, estado `aviso`).
- **robots.txt bloqueia tudo:**

  ```
  User-agent: *
  Disallow: /
  ```

  A auditoria falha se isso mudar antes da hora.
- **URLs absolutas** (canonical, OG, sitemap, JSON-LD) saem de `SITE_URL`. A variável de ambiente tem prioridade; sem ela, vale o domínio previsto na config.
- **Para indexar** (sessão 9, depois do domínio):
  1. registrar o domínio e marcar `dominio` como `confirmado` na config (Prompt D);
  2. publicar com `LAVINA_MODO=producao`;
  3. conferir que `pnpm audit-seo` continua verde. Ele passa a exigir que não haja noindex, que o robots.txt traga o `Sitemap:` e os robôs de IA;
  4. enviar o sitemap no Search Console.

## 2. Metadados por página

Título ≤ 60 caracteres e descrição ≤ 155, únicos por página. O texto vem do COPY_DECK e da config, com cidade só onde há fonte. Todas as páginas públicas têm canonical, Open Graph (`og:type`, `og:locale`, título, descrição, url, imagem 1200×630 com `alt`) e Twitter `summary_large_image`.

| rota | título (caracteres) | descrição (caracteres) |
| --- | --- | --- |
| / | Lavina — coletivo de arquitetura · Interiores em Lages/SC (57) | 149 |
| /projetos/ | Projetos de interiores e reformas · Lavina (42) | 143 |
| /projetos/cozinha-jc/ | Cozinha J\|C: reforma em Balneário Camboriú · Lavina (51) | 147 |
| /projetos/consultorio-jonny-arruda/ | Consultório Jonny Arruda, Lages: projeto e obra · Lavina (56) | 147 |
| /projetos/living-jantar-painel/ | Living e jantar com painel paramétrico · Lavina (47) | 137 |
| /projetos/cozinha-farmhouse/ | Cozinha farmhouse: obra executada · Lavina (42) | 146 |
| /projetos/banheiro-tons-claros/ | Banheiro em tons claros: obra executada · Lavina (48) | 146 |
| /projetos/quarto-closet/ | Quarto e closet: reforma executada · Lavina (43) | 144 |
| /projetos/clinica-cordis/ | Clínica Cordis, Lages: imagens 3D do projeto · Lavina (53) | 148 |
| /projetos/projeto-tb/ | Projeto T\|B, Campo Belo do Sul: imagens 3D · Lavina (51) | 133 |
| /projetos/suite-fl/ | Suíte F\|L, Lages: imagens 3D do projeto · Lavina (48) | 136 |
| /processo/ | Processo: presença em cada etapa · Lavina (41) | 142 |
| /coletivo/ | Coletivo: Amanda Lavina, Renata e Lara · Lavina (47) | 146 |
| /contato/ | Contato e orçamento: Lages, Litoral e à distância · Lavina (58) | 146 |
| /privacidade/ | Política de privacidade e de cookies · Lavina (45) | 145 |

- A 404 e as páginas internas (`/_sistema/`, `/_pendencias/`) ficam sempre com noindex e fora do sitemap.
- Os projetos que só têm imagens 3D dizem isso no título ("imagens 3D"). É a mesma regra do rótulo de natureza (CDC).

### Imagem OG (gerada no build)

`src/pages/og/[nome].jpg.ts` usa `src/components/seo/og.ts`. Cada imagem tem 1200×630 px e leva:
- à esquerda, um painel grafite com o logo, o nome da página e o **rótulo de natureza da foto** ("Obra executada", "Imagem 3D do projeto", "Retrato");
- a fresta acesa, saindo do painel para a foto;
- à direita, a foto real da página.

O texto usa a Urbanist (`src/components/seo/urbanist-og.ttf`, OFL; o WOFF2 do site não é lido pelo gerador). Assim a imagem não depende das fontes da máquina de build. A foto só é recortada, nunca editada.

## 3. Dados estruturados (JSON-LD)

Validados em duas camadas:
- **Estrutura** (`audit-seo`): campos exigidos, `@id` coerentes, trilha em ordem, cidades reais, nenhuma avaliação.
- **Vocabulário** (`validar-schema`): cada tipo e cada propriedade existe no **schema.org release 30.1**, baixado hoje do repositório oficial (`schemaorg/schemaorg` no GitHub). Nenhum tipo substituído ou "pending", e cada propriedade aplicável ao tipo em que está. Resultado: verde nas 15 páginas.

O validador do Google (Rich Results Test) e o validator.schema.org não ficaram acessíveis deste ambiente (bloqueio de rede). Rodar os dois na sessão 9, com a URL do preview.

### Tipo do escritório: `LocalBusiness`

- **Por que não `ProfessionalService`:** no vocabulário 30.1, o comentário do tipo diz: *"The general ProfessionalService type for local businesses was deprecated due to confusion with Service."* Ele continua existindo, mas descontinuado.
- **Por que não um tipo mais específico:** não existe tipo para escritório de arquitetura. O mais perto (`HomeAndConstructionBusiness`) cobre ofícios de obra (eletricista, encanador, empreiteiro), não projeto.
- **Decisão:** `LocalBusiness`, o tipo genérico de negócio local. É também o que o Google documenta para dados de negócio local.
- **Sem `additionalType`:** não achei um identificador oficial que eu pudesse conferir.

Campos (todos da config):

| campo | valor |
| --- | --- |
| `name` | Lavina — coletivo de arquitetura |
| `alternateName` | Amanda Lavina Arquitetura (nome da ficha do Google) · Lavina \| Coletivo de Arquitetura |
| `legalName`, `taxID` | Amanda Lavina Arquitetura Ltda · 52.116.202/0001-05 (`exibirCnpj`) |
| `foundingDate` | 2023-09-08 (Receita Federal) |
| `address`, `geo`, `hasMap` | Av. Pres. Vargas, 505, Lages/SC, 88508-110 · coordenadas e link da ficha do Google |
| `telephone` | +5549991900821 |
| `openingHoursSpecification` | segunda a sexta, 09:00–19:00 |
| `areaServed` | só as 4 cidades com projeto ou obra: Lages, Balneário Camboriú, Urubici, Campo Belo do Sul |
| `sameAs` | Instagram @lavina.co.arq e a ficha do Google |
| `founder` | Person Amanda Lavina, `jobTitle` "Arquiteta", sameAs @lavinamanda |

- **Em todas as páginas:** `WebSite`, `LocalBusiness` e `WebPage` com `primaryImageOfPage`. Fora da home, também `BreadcrumbList`.
- **Projetos:** `CreativeWork` com:
  - `creator` (o escritório) e `creditText` (autoria como na ficha técnica);
  - `contributor` = Renata Nürnberg ("Imagens 3D do projeto"), quando há imagem 3D;
  - `locationCreated` só com cidade de fonte;
  - `sameAs` com os posts de origem.
- **Sem `dateCreated`:** o ano não existe nas fontes. Quando existir, entra sozinho.
- **FAQPage: não usado.** O FAQ está no COPY_DECK (§9), mas ainda não está em nenhuma página, e marcação de FAQ sem o FAQ visível contraria as regras do Google. Quando houver página de FAQ, adicionar.
- **SEM `AggregateRating` e SEM `Review`** (investigação §11): a auditoria falha se aparecer qualquer um, como tipo ou como propriedade.

## 4. sitemap.xml e robots.txt

- **`sitemap.xml`:** as 15 rotas públicas, em URL absoluta. Sem `<lastmod>`, porque não há data confiável por página.
- **`robots.txt` em preview ou sem domínio:** bloqueia tudo.
- **`robots.txt` em produção com domínio:** libera tudo, exceto `/_sistema/` e `/_pendencias/`, aponta o sitemap e lista os robôs de IA.
  - **`/og/` fica liberado:** os robôs das redes sociais (Twitterbot e outros) respeitam o robots.txt e precisam buscar a imagem da prévia.
  - **Os dois modos são conferidos hoje** pelo `audit-seo`, porque a versão liberada só vai ao ar com o domínio. O texto sai de `src/components/seo/robots.ts`, uma função pura que a rota e a auditoria usam.

### Robôs de IA (decisão: liberados)

O objetivo do GEO é ser citado. Por isso os robôs que declaram respeitar o robots.txt ficam liberados, em grupo próprio, para documentar:

| token | quem | papel (segundo as fontes de 2026) |
| --- | --- | --- |
| GPTBot | OpenAI | treino de modelos |
| OAI-SearchBot | OpenAI | índice da busca do ChatGPT: bloquear tira o site das respostas de busca |
| ChatGPT-User | OpenAI | busca feita a pedido de um usuário; as fontes divergem sobre respeitar o robots.txt |
| ClaudeBot | Anthropic | treino |
| Claude-SearchBot | Anthropic | busca |
| Claude-User | Anthropic | busca feita a pedido de um usuário |
| PerplexityBot | Perplexity | índice de busca (sem treino) |
| Google-Extended | Google | uso no Gemini (treino e grounding); não é um robô à parte |
| Applebot-Extended | Apple | uso em modelos da Apple; não é um robô à parte |

- **Decisão humana:** se o João preferir aparecer nas respostas **sem servir de treino**, basta mover GPTBot, ClaudeBot, Google-Extended e Applebot-Extended para um grupo `Disallow: /` (lista em `src/config/seo.ts → robosIA`).
- **Fontes:** guias de 2026 encontrados pela busca, por exemplo [anagram.ai](https://www.anagram.ai/blog/ai-crawler-user-agent-list-2026-14-bots-and-robotstxt-tokens-to-know) e [contextbolt](https://contextbolt.com/blog/ai-crawlers-list/). A documentação dos próprios fornecedores não estava acessível deste ambiente; conferir na sessão 9.

## 5. GEO: parágrafo citável

**Autoria perto do topo:** nos projetos, a abertura mostra "Projeto" (autoria) e, quando houver, "Imagens 3D" (Renata Nürnberg), junto com tipo, cidade e natureza. A ficha técnica completa fica no fim. O `audit-seo` exige a autoria dentro da primeira seção.

Cada página de projeto e o `/processo` têm, no topo do texto, um parágrafo de 40 a 60 palavras (`[data-geo]`). Ele é montado só com dados da config:
- o que é;
- tipo e cidade;
- quem fez: Lavina — coletivo de arquitetura, de Lages (SC), liderado pela arquiteta Amanda Lavina;
- a natureza das imagens;
- até três destaques;
- os créditos (projeto e imagens 3D da Renata).

Medido pela auditoria:
- projetos: de 45 a 59 palavras;
- /processo: 54 palavras.

Sem data, porque o ano não está nas fontes.

Exemplo (Clínica Cordis):
> Clínica Cordis é um projeto de saúde em Lages da Lavina — coletivo de arquitetura, de Lages (SC), liderado pela arquiteta Amanda Lavina. As imagens são 3D do projeto, não fotos de obra. Destaques: coração iluminado integrado ao painel, bancada de pedra escura, recepção com curvas e luz. Projeto: Renata Nürnberg para Lavina — coletivo de arquitetura.

## 6. Consultas-alvo por página

**Sem dado de volume:** o Keyword Planner, o Search Console e o autocomplete não estavam acessíveis (`docs/pesquisa/busca-local.md`). As consultas abaixo saem do que o conteúdo sustenta e da busca real em 21/10/2026. Validar no Search Console nas primeiras semanas.

| consulta-alvo | página que responde | por que essa página |
| --- | --- | --- |
| arquiteta de interiores em Lages | `/` e `/coletivo/` | escritório e arquiteta líder em Lages; projetos reais na cidade |
| projeto de interiores Balneário Camboriú | `/projetos/cozinha-jc/` | único projeto com cidade marcada no Litoral (Cozinha J\|C) |
| projeto de consultório Lages | `/projetos/consultorio-jonny-arruda/` e `/projetos/clinica-cordis/` | dois projetos de saúde em Lages |
| reforma de cozinha Lages | `/projetos/cozinha-jc/` e `/projetos/cozinha-farmhouse/` | as reformas de cozinha do site; **atenção:** a J\|C fica em Balneário Camboriú e a farmhouse não tem cidade. A página só responde à intenção "reforma de cozinha" com o escritório em Lages; não afirmar obra de cozinha em Lages. |
| acompanhamento de obra | `/processo/` | etapa 05, quadros reais da obra e o comparador "projeto fiel à execução" |
| arquitetura de interiores Lages (variação) | `/projetos/` | lista dos 9 projetos com tipo, cidade e natureza |
| Lavina arquitetura · Amanda Lavina arquiteta (marca) | `/` e `/coletivo/` | nome, alternateName e founder no JSON-LD |

**Sem páginas por bairro ou por cidade sem conteúdo real.** Nada de "arquiteta em Balneário Camboriú" como página própria enquanto houver um só projeto lá. Uma página por cidade só existe quando houver projetos reais suficientes para ela; até lá, a cidade aparece no projeto e no `areaServed`.

## 7. Perfil da Empresa no Google (checklist para a Amanda)

- [ ] **Nome:** hoje é "Amanda Lavina Arquitetura". Renomear para "Lavina — coletivo de arquitetura"? **Decisão da Amanda.** O Google pede o nome real do negócio, como aparece na fachada e nos documentos, e a razão social é "Amanda Lavina Arquitetura Ltda". Por isso o JSON-LD leva os dois (`name` e `alternateName`).
- [ ] **Categoria principal:** "Arquiteto" ou "Designer de interiores" (escolher a que descreve melhor). Categorias secundárias só se forem verdade.
- [ ] **Site:** colocar o link do domínio quando ele estiver no ar.
- [ ] **Fotos reais:** obras executadas (Cozinha J\|C, Consultório, Banheiro), escritório e equipe. Imagem 3D só com a legenda "Imagem 3D do projeto".
- [ ] **Serviços:** arquitetura de interiores, projeto de iluminação, acompanhamento de obra, projetos para saúde (consultórios e clínicas). Projeto à distância só depois de definido como funciona (FAQ 5 do copy deck).
- [ ] **Horário:** segunda a sexta, 9h às 19h, igual ao site.
- [ ] **Telefone e endereço:** iguais ao site, que segue a ficha do Google.
- [ ] **Área atendida:** só cidades reais (Lages, Balneário Camboriú, Urubici, Campo Belo do Sul) ou a região.
- [ ] **Avaliações:** responder às 15. O site mostra trechos com nome e inicial, sem marcação de avaliação.
- [ ] **Publicações:** uma por projeto novo, com link para a página do projeto.

## 8. Roteiro mensal de teste em IA (ChatGPT, Perplexity, Gemini)

**Quando:** uma vez por mês, no mesmo dia, em sessão anônima ou sem histórico. Registrar numa planilha: data, ferramenta, pergunta, se a Lavina aparece (sim/não), a posição, o que foi dito, a fonte citada e se houve erro factual.

**Perguntas fixas:**
1. "Quem faz projeto de arquitetura de interiores em Lages, SC?"
2. "Indique arquitetas de interiores em Lages."
3. "Escritório de arquitetura para consultório médico em Lages."
4. "Arquiteta que faz projeto de interiores em Balneário Camboriú e acompanha a obra."
5. "O que é a Lavina coletivo de arquitetura?"
6. "Quem é Amanda Lavina, arquiteta?"
7. "Como funciona o processo de projeto da Lavina?" (espera-se: as 5 etapas)
8. "A Lavina faz projeto à distância?" (só a avaliação da Luísa W. sustenta isso; anotar o que a IA disser)

**O que olhar:**
- Respostas com dado errado: cidade inventada, CAU, prêmio, "a melhor". Anotar e corrigir a fonte, nunca o site para agradar a IA.
- Se a fonte citada é o site, o Instagram ou o Google: indica o que ajustar (parágrafo citável, ficha do Google).
- Projetos com imagem 3D descritos como obra: corrigir o texto da página se houver ambiguidade.

**Quando mexer:** se em três meses seguidos a Lavina não aparecer para a pergunta 1, revisar o título e o parágrafo citável da home e do `/coletivo` e a ficha do Google, nessa ordem.

## 9. Pendências de SEO

- Domínio e `LAVINA_MODO=producao`: liberam a indexação (sessão 9).
- Search Console e Bing Webmaster: verificar o domínio, enviar o sitemap e medir as consultas reais.
- Rich Results Test e validator.schema.org na URL do preview (bloqueados aqui).
- Ano dos projetos e cidades que faltam: entram no título, no JSON-LD e no parágrafo citável quando informados.
- Página de FAQ (copy deck §9): quando entrar, adicionar FAQPage.
