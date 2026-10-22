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

## Sessão 5 — Textos

- **10 decisões para o João e a Amanda** em `docs/COPY_DECK.md` §10 (assinatura das citações, título, "Serra", comentários de clientes, prazos, projeto à distância, dados da equipe, cidades/anos, linha da IA).
- **[PENDENTE] no copy deck**: pedido do living e jantar; cidades de living, farmhouse, banheiro e quarto; prazos (FAQ 2); formato do atendimento à distância (FAQ 5); formação/CAU/papel da equipe; autoria de fotos e vídeos.
- **Pilar "projetar pra viver"**: fonte resolvida (post DXzMwBRFUox, literal no mapa de mídia); `src/config/marca.ts` atualizado de aviso para confirmado.
- **Pesquisa CAU** (`docs/pesquisa/cau-publicidade-autoria.md`): texto integral das Res. 75/2014, 52/2013 e 67/2013 a conferir nas fontes oficiais (bloqueadas neste ambiente); verificar se a Consulta Pública 51/2025 virou resolução que alcance sites.
- **Termos de busca** (`docs/pesquisa/busca-local.md`): sem dado de volume; validar no Search Console após o deploy.

## Sessão 6B — Projetos

- **Comentários de clientes como citação** (decisão 4 do copy deck): o living e jantar mostra "Nosso ambiente mais aconchegante! Da idéia a realização!" (grafia original) e a farmhouse mostra a frase da cliente, ambos com o post de origem. Se a decisão for não usar, sai de `src/components/projetos/dados.ts` (CITACOES).
- **Autoria de fotos e vídeos de obra**: aparece "A confirmar" na ficha técnica (selo PROVISÓRIO no preview) em todos os projetos com foto ou vídeo.
- **Cordis e T|B**: a página diz que a obra foi executada e que as fotos ainda não estão no site (decisão 5 do copy deck). A citação "Executado ficou tão lindo quanto." da Cordis só entra com a foto da obra.
- **Quem apresenta o vídeo do quarto e closet**: a legenda do vídeo não nomeia ninguém até confirmar.
- **Fallback das View Transitions**: testado só no Chromium, emulando um navegador sem `@view-transition`. Conferir em Firefox e Safari reais na sessão 9.
- **Páginas do menu** /processo/, /coletivo/ e /contato/: construídas na sessão 6C.

## Sessão 6C — Processo, coletivo, contato e 404

- **Mapa incorporado em /contato**: feito na sessão 7 (iframe só depois do consentimento "mapas").
- **Stills de obra em /processo**: três quadros novos do vídeo `um-dia-no-escritorio` (galpão), escolhidos sem rosto de terceiros. O primeiro foi recortado para tirar o carro e a placa (registrado em `docs/dados/stills.json` e no manifesto). A obra do vídeo não é identificada como projeto; os quadros levam o rótulo "Vídeo".
- **CAU e formação** de Amanda, Renata e Lara: não aparecem em /coletivo enquanto pendentes. Quando confirmados em `src/config/pessoas.ts`, entram sozinhos (Formação e CAU sob o texto de cada uma).
- **Linha sobre IA no processo** (decisão 10 do copy deck): aparece em /processo, discreta, como na home.
- **"À distância" em /contato**: apoiado nas avaliações de Luísa W. (consultoria à distância) e Jane W. (cliente em outro estado). "Serra" ficou de fora até a decisão 3 do copy deck.
- **Retratos da Renata e da Lara**: o nome e as palavras queimados na foto ficaram; as palavras se repetem em HTML. Se chegar o original sem texto, troca-se o arquivo.

## Sessão 7 — Consentimento, privacidade e segurança

- **Revisão jurídica da `/privacidade`** e do banner: [DECISÃO HUMANA] em `docs/COMPLIANCE.md` (bases legais, retenção, encarregado, transferência internacional).
- **E-mail para o titular**: ausente na config; a política oferece WhatsApp e endereço.
- **Estatística**: ativar o Web Analytics no painel da Vercel no deploy (sessão 9). Antes, conferir na documentação da Vercel como os dados são tratados; neste ambiente ela estava inacessível (bloqueio de rede). Sem a ativação, o aceite de "estatística" não envia nada.
- **CSP**: depois de mudar qualquer script ou CSS inline, rodar `pnpm csp` e versionar o `vercel.json` (o `postbuild` reprova o build se esquecer).
- **HSTS `preload`**: decidir quando o domínio definitivo estiver no ar.

## Sessão 8 — SEO e GEO

- **Indexação**: noindex e robots.txt "Disallow: /" até o domínio ser confirmado e o site ir para produção (`docs/SEO.md` §1).
- **Robôs de IA**: liberados por decisão de GEO. Se o João quiser aparecer sem servir de treino, bloquear só GPTBot, ClaudeBot, Google-Extended e Applebot-Extended (`docs/SEO.md` §4).
- **Nome no Perfil da Empresa** ("Amanda Lavina Arquitetura" ou "Lavina — coletivo de arquitetura"): decisão da Amanda (`docs/SEO.md` §7).
- **Validação externa**: Rich Results Test, validator.schema.org e as páginas de robôs dos fornecedores, na URL do preview (bloqueados neste ambiente).
- **Search Console**: medir as consultas reais; hoje não há dado de volume.

<!-- pendencias:auto:inicio -->

## Pendências da config (gerado por `pnpm validate-config`; não edite este bloco)

Projetos válidos no schema: 9. Travas de produção hoje: nenhuma.

### Avisos da config (PROVISÓRIO no preview; não travam)

- **Logo validado pela Amanda** — o SVG foi reconstruído a partir do vídeo; falta o arquivo original da marca `marca.logo.validacao`
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

### Projetos (PROVISÓRIO no preview; não travam)

- **Cidade de "Banheiro em tons claros"** — não informada; o campo não aparece `projetos[banheiro-tons-claros]`
- **Ano de "Banheiro em tons claros"** — não informado; o campo não aparece `projetos[banheiro-tons-claros]`
- **Autoria das imagens (foto) de "Banheiro em tons claros"** — a confirmar com o João `projetos[banheiro-tons-claros]`
- **Ano de "Clínica Cordis"** — não informado; o campo não aparece `projetos[clinica-cordis]`
- **Ano de "Consultório Jonny Arruda"** — não informado; o campo não aparece `projetos[consultorio-jonny-arruda]`
- **Autoria das imagens (foto) de "Consultório Jonny Arruda"** — a confirmar com o João `projetos[consultorio-jonny-arruda]`
- **Cidade de "Cozinha farmhouse"** — não informada; o campo não aparece `projetos[cozinha-farmhouse]`
- **Ano de "Cozinha farmhouse"** — não informado; o campo não aparece `projetos[cozinha-farmhouse]`
- **Autoria das imagens (video) de "Cozinha farmhouse"** — a confirmar com o João `projetos[cozinha-farmhouse]`
- **Ano de "Cozinha J|C"** — não informado; o campo não aparece `projetos[cozinha-jc]`
- **Autoria das imagens (foto) de "Cozinha J|C"** — a confirmar com o João `projetos[cozinha-jc]`
- **Autoria das imagens (video) de "Cozinha J|C"** — a confirmar com o João `projetos[cozinha-jc]`
- **Cidade de "Living e jantar com painel paramétrico"** — não informada; o campo não aparece `projetos[living-jantar-painel]`
- **Ano de "Living e jantar com painel paramétrico"** — não informado; o campo não aparece `projetos[living-jantar-painel]`
- **Autoria das imagens (video) de "Living e jantar com painel paramétrico"** — a confirmar com o João `projetos[living-jantar-painel]`
- **Ano de "Projeto T|B"** — não informado; o campo não aparece `projetos[projeto-tb]`
- **Cidade de "Quarto e closet"** — não informada; o campo não aparece `projetos[quarto-closet]`
- **Ano de "Quarto e closet"** — não informado; o campo não aparece `projetos[quarto-closet]`
- **Autoria das imagens (video) de "Quarto e closet"** — a confirmar com o João `projetos[quarto-closet]`
- **Ano de "Suíte F|L"** — não informado; o campo não aparece `projetos[suite-fl]`

<!-- pendencias:auto:fim -->
