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
- **Monograma em marca d'água** em `mudanca-cozinha.mp4` e `novo-modelo.mp4`: confirmar se é a marca atual.
- **Autoria das fotos de obra:** "a confirmar" no manifesto (consultório, banheiro, cozinha).
- **Projetos que só existem em vídeo** (living/jantar paramétrico, quarto e closet, cozinha farmhouse) ganharam ids provisórios no manifesto (`living-jantar-parametrico`, `quarto-closet`, `cozinha-farmhouse`) e não têm créditos de projeto próprios além de "Lavina | Coletivo de Arquitetura"; confirmar cidade/ano/créditos (sessão 2).
- **Lista completa do que pedir ao João:** `docs/MIDIA_CATALOGO.md`, seção final.
- **Verticais não corrigidas** em 627064897, 627098371, 641767635, 729424348, 730513804 e 641226479: a estimativa automática pedia cortar 20–50% da foto. Corrigidas (35%) só 625681099, 627664561 e 728943785. Para as demais, marcar linhas verticais à mão numa sessão L, se o João quiser.
- **Quadros quase repetidos:** `quadro-mostrando-quarto-01/02` e `quadro-novo-modelo-03/04` são muito parecidos; escolher um de cada na sessão 6.
