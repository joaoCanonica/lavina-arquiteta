# Marca e design system — "A Fresta"

Sessão 3. Vitrine viva em `/_sistema` (noindex). Tokens em `src/styles/tokens.css`; componentes em `src/components/{marca,fresta,ui}/`.

## 1. Logo

- **É uma reconstrução vetorial**, feita pela WAXLO (21/10/2026) a partir do quadro final do vídeo `um-dia-no-escritorio.mp4`. O monograma e o "LAVINA" foram redesenhados como traço monolinha medido no quadro. O subtítulo é Comfortaa Light (SIL OFL) convertida em curvas. **Precisa ser validado pela cliente** e substituído pelo arquivo original, se ele existir (pendência em `docs/PENDENCIAS.md`). Comparação em `media-originais/lavina-logo-comparacao.jpg`.
- **Arquivos:** original intocado em `media-originais/lavina-logo.svg` (38,5 KB). O otimizado, `src/components/marca/lavina-logo.svg` (7,9 KB, 79% menor), é gerado por `pnpm marca` com SVGO. O SVGO mantém os ids `#marca`, `#lavina` e `#subtitulo` e o `pathLength="1"` dos 10 traços (o script falha se perder algum).
- **Fidelidade:** a renderização a 4x do original e do otimizado difere em 0,12% dos pixels, todos de antialiasing de borda. A precisão de 2 casas move as coordenadas em menos de 0,005 unidade. Visualmente é idêntico.
- **`<Logo/>`:** inline, em `currentColor`, com as variantes `completa` | `monograma` | `lavina`.
  - **Modo `desenhar`:** cada traço anima `stroke-dashoffset` de 1 a 0 (via `pathLength`), em sequência: marca (2 traços longos, 0–1,55 s) → LAVINA (8 traços em cascata, 1,15–2,3 s) → subtítulo em fade (2,05–2,75 s).
  - **No tema escuro:** o traço nasce na cor Luz e assenta no osso, "como luz acendendo".
  - **Estado final:** sem `stroke-dasharray`, o logo fica idêntico ao SVG.
  - **Movimento reduzido:** o logo aparece pronto.
- **Ícones** (gerados do monograma por `pnpm marca`):
  - `public/favicon.svg`: grafite, ou osso quando o sistema está em modo escuro.
  - `public/icons/`: favicon 32, apple-touch 180, 192, 512 e maskable 512, em osso sobre grafite.
  - `public/site.webmanifest`.
- **Achado:** no quadro original do vídeo, um feixe de luz horizontal atravessa o monograma. "A Fresta" já está na marca dela; o site só a torna sistema.

## 2. A Fresta

Linha horizontal fina (1,5 px) na cor Luz, com brilho suave (dois `box-shadow` baixos, sem neon). Ela **acende** (evento) do centro para as bordas em 600 ms. Nada acompanha o progresso do scroll.

| Componente | O que faz |
| --- | --- |
| `<Fresta/>` | a linha; acende quando ela (com `gatilho`) ou um ancestral `[data-fresta-gatilho]` entra na tela |
| `<RevelaPorFresta/>` | a fresta acende no meio da mídia e a mídia abre verticalmente a partir dela (`clip-path: inset(50% 0)` → `inset(0)`, 1,2 s, após 420 ms); a fresta se apaga. Uma vez só (IntersectionObserver, threshold 0,35) |
| `<DivisorFresta/>` | divisor de seção (cheia, média ou curta) |
| `<LinkProjeto/>` | no hover/foco, uma linha de luz corre na base, da esquerda para a direita |

- **Animações:** só `transform`, `opacity` e `clip-path`. Medição no Chromium (`node scripts/medir-animacoes.mjs`, dados em `docs/capturas/sistema/desempenho.json`):

| animação | fps médio | quadro p95 | quadros > 20 ms | layout total |
| --- | --- | --- | --- | --- |
| logo desenhando | 60 | 16,7 ms | 0 | 0,8 ms em 3,2 s |
| fresta acendendo | 60 | 16,7 ms | 0 | 0,6 ms |
| revelação da foto | 60 | 16,8 ms | 0 | 0,7 ms |
| rolagem da página | 60 | 16,7 ms | 0 | 1,1 ms |

  Os poucos eventos de Layout no trace vêm do clique e da troca de nó, não de cada quadro. Não há layout thrash.
- **Sem JS, ou com `prefers-reduced-motion`,** tudo aparece pronto. O CSS só esconde sob `:root.js` + `prefers-reduced-motion: no-preference`. Se o script da Fresta não rodar, uma rede de segurança no `<head>` remove `.js` 1,5 s depois do `load`.
- **Sequências de 6 quadros:** `docs/capturas/sistema/logo-desenhando.jpg` e `fresta-revelando.jpg` (tempos exatos via Web Animations API).

## 3. Tema: claro e escuro

- **Decisão:**
  - **O escuro é o padrão de impacto da home.** O grafite quente é a "obra à noite": é nele que a Luz da fresta aparece como luz de verdade, e as fotos (sempre claras e quentes) ganham presença de vitrine.
  - **O claro é o padrão de leitura.** O osso, a cor do próprio logo e das paredes dos projetos dela, é melhor para texto longo, fichas e processo.
  - **Ordem de decisão:** escolha salva (`localStorage` `lavina-tema`) > padrão da página (`temaPadrao="dark"` na home) > `prefers-color-scheme` > claro.
- **Sem flash:** um script inline mínimo no `<head>` define `data-theme` antes da primeira pintura, com `localStorage` em try/catch. Sem JS, o CSS segue `prefers-color-scheme`.
- **Papéis de cor:**

| papel | claro | escuro |
| --- | --- | --- |
| fundo | Osso `#F4F1EC` | Grafite `#1C1A18` |
| superfície | Travertino `#E6DED2` | `#24211E` |
| texto | Grafite | Osso |
| texto secundário | Greige profundo `#675E55` | Greige `#A79C8F` |
| acento de texto | Greige profundo | Freijó claro `#B8916E` |
| madeira (UI/grandes) | Freijó `#8A6A4F` | Freijó |
| foco | anel Grafite + halo de Luz | anel de Luz |
| fresta | Luz `#F7D9A8` | Luz |

- **Calibração:**
  - O greige original dá 2,39:1 sobre osso, então no claro o texto secundário usa um greige escurecido (5,63:1).
  - O freijó dá 3,52:1 sobre grafite: fica para UI, e o acento de texto no escuro é um freijó clareado (6,04:1).
  - A Luz sobre osso dá 1,21:1, por isso no claro o foco é grafite e a Luz entra só como halo.
  - Tabela completa: `docs/CONTRASTE.md` (`pnpm audit-contraste`, falha abaixo de 4,5 em texto e 3 em UI/grande).
- **Grão:** está disponível (`<Base grao>` → `html[data-grao]`). É um ruído SVG estático, com 5% de opacidade e sem animação. O custo medido na rolagem foi nulo (60 fps nos dois casos; pintura 39 ms com grão contra 36 ms sem, dentro do ruído da medição). **Fica desligado por padrão:** não acrescenta à tese, e a textura real vem das fotos (pedra, madeira). Reavaliar na home (sessão 6A).

## 4. Tipografia

**Escolha: Urbanist (200–600) + Spectral Italic 300.** Testadas ao lado do logo, nos dois temas, contra Manrope + Newsreader Italic:

1. A Urbanist é geométrica e monolinha, com os mesmos ângulos e terminais retos do "LAVINA" do logo; o display fino (200) parece uma extensão da marca.
2. Os "a" e "o" redondos da Urbanist conversam com o subtítulo arredondado (Comfortaa) do logo; a Manrope puxa para um grotesco técnico, mais "app".
3. A Spectral Italic 300 tem desenho de pena, com contraste vivo: as citações dela soam como voz, não como interface. A Newsreader Italic é mais genérica de jornal.
4. As duas são OFL 1.1 (licenças em `public/fonts/`), variáveis ou leves, com subset latino que cobre todo o português.
5. O peso total fica em 50 KB, e só a Urbanist tem `preload`.

- **Arquivos:**
  - `public/fonts/urbanist-latin-wght.woff2`: 27,1 KB, variável 200–600.
  - `public/fonts/spectral-latin-300-italic.woff2`: 23,2 KB.
  - Fonte dos arquivos: Fontsource 5.3.0, licença SIL OFL 1.1.
- **Carregamento:**
  - `font-display: swap`.
  - Fallbacks com `size-adjust` para reduzir o salto na troca.
- **Escala nomeada** (`clamp()`; classes `.t-*`):
  - Display: 52–160 px, peso 200, entrelinha 0,95.
  - Título: 36–80 px, peso 250.
  - Subtítulo: 24–38 px, peso 300.
  - Citação: Spectral 24–46 px.
  - Corpo grande: 18–21 px.
  - Corpo: 16–17 px.
  - Pequeno: 14 px.
  - Rótulo: 12 px, peso 500, caixa alta, espaçamento 0,32 em (o versalete espaçado do "LAVINA").

## 5. Forma, espaço e movimento

- **Cantos:** retos (`--raio: 0`). Nas fotos dela há raios e arcos, mas não na interface.
- **Linhas e alinhamento:** linhas de 1 px; fresta de 1,5 px. Nenhuma pílula, nenhum ícone em círculo, nenhum cartão com borda.
- **Espaço:** generoso, de `--e-1` (4 px) a `--e-10` (até 16 rem), fluido nos grandes. O gutter lateral tem 16 px no celular.
- **Movimento:**
  - Curvas de saída longas, sem bounce: `--ease-saida` (expo-out) e `--ease-suave`.
  - Durações: 180 / 420 / 600 (fresta) / 1200 (revelação) / 2600 ms (logo).
  - `prefers-reduced-motion` desliga tudo.

## 6. Componentes de base

- **`<Rotulo natureza>`:** texto discreto em versalete, com um traço curto (tracejado em "Imagem 3D do projeto"). O texto vem dos `rotulos` do manifesto. Leva `data-rotulo-natureza`, que o `audit-compliance` confere contra o `data-natureza` da imagem.
- **`<Legenda n total>`:** numeração editorial (01 / 09).
- **`<Credito itens>`:** ficha técnica função → nome. Itens sem nome não aparecem.
- **`<Botao>`:** primário = texto + linha que se estende; secundário = sublinhado. Alvo mínimo de 44 px.
- **Foco:** `:focus-visible` global com anel e halo.
- **`<Imagem id>`:** `<picture>` AVIF/WebP com `srcset`, `width`/`height`, LQIP de fundo e `data-natureza`.
- **`<Comparador par tipo>`:** estrutura e acessibilidade (o comportamento fica para a sessão 6B):
  - `input type=range` nativo, com rótulo para leitor de tela e `aria-valuetext`; as setas do teclado funcionam.
  - Rótulos visíveis "Antes"/"Depois" ou "Imagem 3D"/"Obra executada".
  - Divisa em Luz.
- **`<AlternarTema>`:** um botão com `aria-pressed` e uma fresta que acende quando o escuro está ativo.

## 7. Pesos

| item | bruto | gzip |
| --- | --- | --- |
| CSS global (`Base.*.css`) | 6,6 KB | 2,4 KB |
| CSS da página `_sistema` | 12,1 KB | 2,8 KB |
| JS por página (inline: tema + Fresta) | 1,3–2,1 KB | 0,7–0,9 KB |
| Fontes (2 arquivos woff2) | 50,3 KB | — |
| Logo inline | 7,9 KB | — |
