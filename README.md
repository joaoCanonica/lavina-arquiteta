# Lavina — coletivo de arquitetura · site

Site estático em Astro (TypeScript strict, sem framework de UI). Contexto e regras do projeto em
`CLAUDE.md`; documentos de base em `docs/`.

## Requisitos

- Node 24 LTS (`.nvmrc`) e pnpm 12 (fixado em `packageManager`; use `corepack enable`).
- ffmpeg (mídia): o do sistema ou, se não houver, o do `ffmpeg-static` (devDependency; é o que
  roda na Vercel). `FFMPEG_PATH` força outro. Chromium para capturas e auditorias (detectado em
  `/opt/pw-browsers/chromium` ou `CHROMIUM_PATH`).
- Deploy: `docs/DEPLOY.md`. Auditoria final: `docs/AUDITORIA.md`.

## Comandos

| Comando                                   | O que faz                                                                  |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`                                | servidor local                                                             |
| `pnpm build`                              | gera `dist/`                                                               |
| `pnpm preview`                            | serve `dist/`                                                              |
| `pnpm check`                              | `astro check` + ESLint + Prettier                                          |
| `pnpm capturar [/r]`                      | capturas 390/1440 px, claro/escuro, com e sem movimento                    |
| `pnpm media:prepare`                      | derivados de mídia em `public/media/` (sessão 1)                           |
| `pnpm validate-config [--producao]`       | config e travas; atualiza `docs/PENDENCIAS.md`                             |
| `pnpm audit-compliance [--producao]`      | termos vetados e rótulo de natureza no `dist/`                             |
| `pnpm test:config`                        | testes das travas e da rota `/_pendencias`                                 |
| `pnpm audit-contraste`                    | contraste AA dos dois temas → `docs/CONTRASTE.md`                          |
| `pnpm marca`                              | otimiza o logo e gera favicon/ícones                                       |
| `pnpm medir-animacoes`                    | quadros e fps das animações (após o build)                                 |
| `pnpm build:producao`                     | build com `LAVINA_MODO=producao` (travas ligadas)                          |
| `pnpm csp`                                | recalcula os hashes da CSP no `vercel.json` (após mudar script/CSS inline) |
| `pnpm audit-a11y`                         | axe, teclado, estrutura, reflow, sem JS, movimento reduzido                |
| `pnpm audit-lighthouse [/r] [--desktop]`  | Lighthouse mobile ou desktop                                               |
| `pnpm audit-seo` · `pnpm validar-schema`  | metadados, JSON-LD e vocabulário schema.org                                |
| `pnpm verificar-links`                    | links internos do `dist/`                                                  |
| `pnpm medir-peso`                         | peso por rota (JS, HTML, imagens) → `docs/capturas/final/peso.json`        |
| `pnpm capturar:final`                     | capturas de todas as rotas → `docs/capturas/final/`                        |
| `NAVEGADOR=firefox pnpm test:navegadores` | Firefox ou WebKit (no CI: workflow `navegadores`)                          |

## Pastas

- `media-originais/` — originais (intocados). `public/media/` — derivados do build, fora do git.
- `docs/` — investigação, mapa de mídia, pacote de prompts, pendências, capturas.
- `src/config/` — fonte única de dados do cliente: campos `confirmado`/`opcional`/`bloqueante`/`aviso`.
- `src/content/projetos/` — coleção de projetos (schema em `src/config/projeto-schema.ts`).
- Preview é o padrão (faixa "em revisão", selo PROVISÓRIO, noindex, rota `/_pendencias`).
