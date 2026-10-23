# Melhorias

Sessão 9 · 22/10/2026. O que deixaria o site melhor depois do lançamento, em ordem de impacto. Nada aqui bloqueia o preview. Os bloqueios de produção estão em `docs/COMPLIANCE.md`.

## 1. Conteúdo

| melhoria | por quê | o que precisa |
| --- | --- | --- |
| **Fotos profissionais das obras** | Hoje as fotos de obra são do Instagram (celular, cor corrigida só de forma global) e os projetos em vídeo usam quadros de 720 px. Fotos profissionais aumentam a nitidez na tela grande e fecham o crédito "Fotografia: a confirmar". | Sessão de fotos da Cozinha J\|C, do Consultório, do Banheiro, do Living e da Farmhouse; crédito do fotógrafo; originais em alta (Prompt L) |
| **Obra executada da Clínica Cordis e do Projeto T\|B** | As duas obras foram executadas, mas o site só mostra as imagens 3D. Com as fotos, as páginas ganham o comparador "Imagem 3D × Obra executada", a prova mais forte da tese, e a citação da Cordis ("Executado ficou tão lindo quanto.") pode entrar. | Fotos da obra no mesmo ângulo dos renders; Prompt L para ingerir e formar os pares |
| **Vetor original do logo** | O logo do site foi reconstruído a partir do vídeo (`docs/MARCA.md`). O arquivo original garante proporções e espessuras exatas. | Arquivo vetorial da marca (AI, SVG ou PDF) |
| **Mais projetos** | São 9; quatro deles sem cidade nem ano. Cada projeto novo com cidade real reforça o SEO local (`docs/SEO.md` §6). | Fotos, legenda, cidade, ano e créditos (Prompt L + Prompt D) |
| **Página por projeto do Litoral** | Hoje só a Cozinha J\|C (Balneário Camboriú) prova a atuação no Litoral. Uma página por projeto real no Litoral, nunca uma página só de cidade, sustenta "projeto de interiores Balneário Camboriú". | Projetos executados no Litoral, com fotos e cidade marcadas |
| **E-mail de contato** | Canal formal para o titular de dados (LGPD) e para quem não usa WhatsApp. | Endereço de e-mail (Prompt D, `contato.email`) |
| **Blog / diário de obra** | A Amanda já escreve legendas com processo e decisões. Textos curtos por obra, como "como escolhemos a pedra da Cozinha J\|C", geram conteúdo citável (GEO) e consultas de cauda longa. | Decisão da Amanda; uma pauta mensal; mesmas regras de texto (sem superlativo, fonte de cada fato) |
| Página de FAQ | O copy deck já tem 9 perguntas (§9). Com a página, entra o FAQPage no JSON-LD. | Respostas das perguntas 2 e 5 (prazos e projeto à distância) |
| Responsável técnico e CAU em cada projeto | Exigência da Res. CAU/BR 75/2014 (ver COMPLIANCE.md). | CAU da Amanda e da PJ; quem é o responsável técnico de cada projeto |

## 2. Técnica

| melhoria | por quê | custo |
| --- | --- | --- |
| Pôster `eager` nos projetos só em vídeo | O pôster da janela de vídeo é `lazy` e vira o LCP (1,6–1,7 s). Com `eager` e preload, cai. | Pequeno, no componente da home `VideoJanela` |
| LQIP só acima da dobra | O HTML da home tem cerca de 150 KB; os LQIPs em base64 de imagens abaixo da dobra pesam no primeiro byte. | Médio |
| Derivados de mídia fora do build | A Vercel gera toda a mídia do zero a cada build, em modo rápido (AVIF esforço 1, VP9 em tempo real), com arquivos maiores que os locais. Guardar os derivados num armazenamento de objetos (ou no cache de build) daria a compressão máxima também no ar. | Médio |
| Safari real (iPhone/Mac) | O WebKit do Playwright já passou no CI (`docs/AUDITORIA.md` §5), mas não é o Safari do aparelho, com o mesmo motor e outra integração. | Abrir o preview num iPhone e num Mac uma vez antes da produção |
| Validação externa | Rich Results Test, validator.schema.org e Search Console, na URL publicada. | Com o domínio |

## 3. Bibliotecas adicionadas (medição e justificativa)

| biblioteca | onde | por quê | medição |
| --- | --- | --- | --- |
| `ffmpeg-static` 5.3.0 (devDependency) | só no build (`scripts/lib/midia.mjs`) | A imagem de build da Vercel não tem ffmpeg, e os vídeos e pôsteres são gerados no build. O pacote baixa um ffmpeg estático (x264, VP9, Opus) na instalação. Localmente vale o ffmpeg do sistema. | **0 KB no site** (não vai para o navegador). Binário de 80 MB só na máquina de build. Licença GPL do binário: uso interno no build, sem distribuição. |
| `axe-core` (devDependency, sessão 9) | só nos testes (`scripts/audit-a11y.mjs`) | Auditoria de acessibilidade automática (regras WCAG 2.2 A/AA). | **0 KB no site.** |
