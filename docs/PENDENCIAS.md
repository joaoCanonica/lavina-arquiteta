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
