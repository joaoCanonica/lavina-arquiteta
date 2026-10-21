# Lavina — coletivo de arquitetura · site

Site estático em Astro (TypeScript strict, sem framework de UI). Contexto e regras do projeto em
`CLAUDE.md`; documentos de base em `docs/`.

## Requisitos

- Node 24 LTS (`.nvmrc`) e pnpm 12 (fixado em `packageManager`; use `corepack enable`).
- ffmpeg/ffprobe (mídia) e Chromium (capturas; detectado em `/opt/pw-browsers/chromium` ou
  `CHROMIUM_PATH`).

## Comandos

| Comando                                | O que faz                                               |
| -------------------------------------- | ------------------------------------------------------- |
| `pnpm dev`                             | servidor local                                          |
| `pnpm build`                           | gera `dist/`                                            |
| `pnpm preview`                         | serve `dist/`                                           |
| `pnpm check`                           | `astro check` + ESLint + Prettier                       |
| `pnpm capturar [/r]`                   | capturas 390/1440 px, claro/escuro, com e sem movimento |
| `pnpm media:prepare`                   | derivados de mídia em `public/media/` (sessão 1)        |
| `pnpm validate-config`, `pnpm audit-*` | travas e auditorias (stubs até as sessões 2 e 9)        |

## Pastas

- `media-originais/` — originais (intocados). `public/media/` — derivados do build, fora do git.
- `docs/` — investigação, mapa de mídia, pacote de prompts, pendências, capturas.
- `src/config/` — fonte única de dados do cliente (sessão 2).
