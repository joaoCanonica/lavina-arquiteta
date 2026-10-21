# Pendências

Itens que não travam o trabalho, mas precisam de decisão ou dado. Cada sessão acrescenta aqui.

## Sessão 0 — Fundação

- **Caminhos citados no CLAUDE.md.** O CLAUDE.md foi gravado idêntico ao bloco de contexto, que
  cita os arquivos na raiz. Depois desta sessão eles estão em:
  `docs/LAVINA_INVESTIGACAO_CLIENTE.md`, `docs/LAVINA_MAPA_MIDIA_LEGENDAS.md`,
  `docs/LAVINA_PACOTE_PROMPTS_CODE.md` e `docs/dados/midia-legendas.json`.
  O logo segue em `assets/lavina-logo.svg` até a sessão 1 mover `assets/` para `media-originais/`.
- **Node.** O ambiente veio com Node 22.22; o Astro 7.4.2 exige Node ≥ 22.23.4. Fixado Node 24
  LTS (24.22.1) em `engines` e `.nvmrc`. Na máquina local, instale Node 24 (nvm/fnm) e rode
  `corepack enable` para o pnpm 12.14.0.
- **pnpm 12 e idade mínima de versão.** O pnpm 12 recusa por padrão versões publicadas há pouco;
  o `pnpm-workspace.yaml` lista as exceções que ele próprio gravou (astro 7.4.2 e pacotes
  `@astrojs/*`, publicados nesta semana).

## Sessão 1 — Mídia

- **Pares Projeto × Executado do consultório invertidos no prompt.** O prompt indicava 588442716 → 627064897 e 598761174 → 625681099; pelo ângulo real (conferido em sobreposição) os pares são 588442716 → 625681099 e 598761174 → 627064897. Registrado em `docs/dados/pares.json`.
- **Par Antes × Depois principal da cozinha trocado.** 730173676 tem o selo queimado no centro; o recorte não salva o par. Usado 730561497 → 729424348 (mesma janela e canto). Pedir a foto sem selo.
- **Termo vetado em vídeo:** a legenda queimada de `apresentacao-principal.mp4` diz "o melhor". A trava atual é do HTML; decidir na sessão 9 se o vídeo entra assim.
- ~~**Monograma em marca d'água** em `mudanca-cozinha.mp4` e `novo-modelo.mp4`: confirmar se é a marca atual.~~ Resolvido na sessão 2: é o mesmo monograma do cartão final "LAVINA coletivo de arquitetura" de `um-dia-no-escritorio.mp4` (marca atual).
- **Autoria das fotos de obra:** "a confirmar" no manifesto (consultório, banheiro, cozinha).
- **Projetos que só existem em vídeo** (living/jantar paramétrico, quarto e closet, cozinha farmhouse) ganharam ids provisórios no manifesto (`living-jantar-painel`, `quarto-closet`, `cozinha-farmhouse`) e não têm créditos de projeto próprios além de "Lavina | Coletivo de Arquitetura"; confirmar cidade/ano/créditos (sessão 2).
- **Lista completa do que pedir ao João:** `docs/MIDIA_CATALOGO.md`, seção final.
- **Verticais não corrigidas** em 627064897, 627098371, 641767635, 729424348, 730513804 e 641226479: a estimativa automática pedia cortar 20–50% da foto. Corrigidas (35%) só 625681099, 627664561 e 728943785. Para as demais, marcar linhas verticais à mão numa sessão L, se o João quiser.
- **Quadros quase repetidos:** `quadro-mostrando-quarto-01/02` e `quadro-novo-modelo-03/04` são muito parecidos; escolher um de cada na sessão 6.

## Sessão 2 — Config e travas

- **Trechos de avaliações** com nome e inicial do sobrenome seguinte ("Jane W.", "Luísa W.", "Isabel S.", "Roberta S."); trechos cortados sem superlativos (o 7 começa no meio da frase). Confirmar o formato na sessão 9.
- **Pilar "projetar pra viver, não pra impressionar"** sem o código do post (investigação §5 cita só a data 01/05/2026).
- **Projetos só em vídeo** (living e jantar, quarto e closet, cozinha farmhouse): cidade, ano e créditos de execução desconhecidos (ficam null e não aparecem). Autoria do projeto registrada como "Lavina | Coletivo de Arquitetura" (vídeos publicados por @lavina.co.arq).
- **Créditos "marcado no post"** (banheiro e Cozinha J|C): a função de cada fornecedor não está escrita no post; não foi inferida.

## Sessão 3 — Marca e design system

- **Logo reconstruído**: validar com a Amanda (traços e subtítulo em Comfortaa Light); trocar pelo arquivo original se existir. Ver `docs/MARCA.md`.
- **Grão** disponível e desligado por padrão; decidir na home (sessão 6A).
- **Comparador**: estrutura e acessibilidade prontas; comportamento (arrastar, sincronizar com o range) na sessão 6B.

## Sessão 4 — Entrada e abertura

- **Copy provisória da abertura**: tese literal da bio ("Arquitetura com presença em cada etapa."); subtítulo "Interiores, iluminação e acompanhamento de obra. Lages e Litoral Catarinense." (cidades da config). Revisar na sessão 5.
- **Mensagem do WhatsApp** neutra ("Tipo de projeto: ___ · Cidade: ___"), sem dado sensível; revisar na sessão 7 (LGPD).
- **Links do menu** (/projetos/, /processo/, /coletivo/, /contato/) apontam para páginas das sessões 6B e 6C.
- **SEO 54 no Lighthouse** por noindex (preview) e falta de meta description: resolve nas sessões 5/8 e com o domínio.

<!-- pendencias:auto:inicio -->

## Pendências da config (gerado por `pnpm validate-config`; não edite este bloco)

Projetos válidos no schema: 9. Travas de produção hoje: nenhuma.

### Avisos da config (PROVISÓRIO no preview; não travam)

- **Logo validado pela Amanda** — o SVG foi reconstruído a partir do vídeo; falta o arquivo original da marca `marca.logo.validacao`
- **Fonte da frase "projetar pra viver, não pra impressionar"** — a investigação (§5) cita o post do living de 01/05/2026, sem o código do post `marca.pilares[viver].citacao`
- **CAU de Amanda Lavina** — ainda não há número (decisão do João: aviso, vai para a conferência final) `pessoas[amanda-lavina].cau`
- **Formação de Amanda Lavina** — instituição e ano não informados `pessoas[amanda-lavina].formacao`
- **CAU de Renata Nürnberg** — ainda não há número (decisão do João: aviso, vai para a conferência final) `pessoas[renata-nurnberg].cau`
- **Papel formal de Renata no coletivo** — sócia, associada ou parceira? (investigação §13.4) `pessoas[renata-nurnberg].formacao`
- **CAU de Lara Honofre** — ainda não há número (decisão do João: aviso, vai para a conferência final) `pessoas[lara-honofre].cau`
- **Formação de Lara Honofre** — arquiteta formada ou estudante? (investigação §13.4) `pessoas[lara-honofre].formacao`
- **CAU da pessoa jurídica** — ainda não há número (decisão do João: aviso, vai para a conferência final) `cauEmpresa`
- **Endereço da Receita diverge do Google** — Receita: Rua Lourenço Teodoro Waltrick, 505, CEP 88508-170 (prédio de esquina); o site usa o do Google, confirmado pelo João `contato.enderecoDivergencia`
- **E-mail de contato** — não informado (investigação §13.9) `contato.email`
- **Domínio do site** — coletivoarquiteturalavina.com.br ainda não registrado; noindex até existir (pacote §A) `seo.dominio`
- **Descrição SEO** — copy final nas sessões 5 e 8 `seo.descricaoPadrao`

### Projetos (PROVISÓRIO no preview; não travam)

- **Texto de "Banheiro em tons claros"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[banheiro-tons-claros]`
- **Cidade de "Banheiro em tons claros"** — não informada; o campo não aparece `projetos[banheiro-tons-claros]`
- **Ano de "Banheiro em tons claros"** — não informado; o campo não aparece `projetos[banheiro-tons-claros]`
- **Autoria das imagens (foto) de "Banheiro em tons claros"** — a confirmar com o João `projetos[banheiro-tons-claros]`
- **Texto de "Clínica Cordis"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[clinica-cordis]`
- **Ano de "Clínica Cordis"** — não informado; o campo não aparece `projetos[clinica-cordis]`
- **Texto de "Consultório Jonny Arruda"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[consultorio-jonny-arruda]`
- **Ano de "Consultório Jonny Arruda"** — não informado; o campo não aparece `projetos[consultorio-jonny-arruda]`
- **Autoria das imagens (foto) de "Consultório Jonny Arruda"** — a confirmar com o João `projetos[consultorio-jonny-arruda]`
- **Texto de "Cozinha farmhouse"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[cozinha-farmhouse]`
- **Cidade de "Cozinha farmhouse"** — não informada; o campo não aparece `projetos[cozinha-farmhouse]`
- **Ano de "Cozinha farmhouse"** — não informado; o campo não aparece `projetos[cozinha-farmhouse]`
- **Autoria das imagens (video) de "Cozinha farmhouse"** — a confirmar com o João `projetos[cozinha-farmhouse]`
- **Texto de "Cozinha J|C"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[cozinha-jc]`
- **Ano de "Cozinha J|C"** — não informado; o campo não aparece `projetos[cozinha-jc]`
- **Autoria das imagens (foto) de "Cozinha J|C"** — a confirmar com o João `projetos[cozinha-jc]`
- **Autoria das imagens (video) de "Cozinha J|C"** — a confirmar com o João `projetos[cozinha-jc]`
- **Texto de "Living e jantar com painel paramétrico"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[living-jantar-painel]`
- **Cidade de "Living e jantar com painel paramétrico"** — não informada; o campo não aparece `projetos[living-jantar-painel]`
- **Ano de "Living e jantar com painel paramétrico"** — não informado; o campo não aparece `projetos[living-jantar-painel]`
- **Autoria das imagens (video) de "Living e jantar com painel paramétrico"** — a confirmar com o João `projetos[living-jantar-painel]`
- **Texto de "Projeto T|B"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[projeto-tb]`
- **Ano de "Projeto T|B"** — não informado; o campo não aparece `projetos[projeto-tb]`
- **Texto de "Quarto e closet"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[quarto-closet]`
- **Cidade de "Quarto e closet"** — não informada; o campo não aparece `projetos[quarto-closet]`
- **Ano de "Quarto e closet"** — não informado; o campo não aparece `projetos[quarto-closet]`
- **Autoria das imagens (video) de "Quarto e closet"** — a confirmar com o João `projetos[quarto-closet]`
- **Texto de "Suíte F|L"** — textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview `projetos[suite-fl]`
- **Ano de "Suíte F|L"** — não informado; o campo não aparece `projetos[suite-fl]`

<!-- pendencias:auto:fim -->
