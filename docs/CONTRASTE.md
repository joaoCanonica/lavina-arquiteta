# Contraste (WCAG 2.x)

Gerado por `pnpm audit-contraste` a partir de `src/styles/tokens.css`. Texto ≥ 4,5; UI e texto grande ≥ 3.
A Luz da fresta é decorativa (brilho) e não carrega informação; fica fora da tabela. Linhas finas `--cor-linha` também são decorativas.

| tema | primeiro plano | fundo | razão | mínimo | resultado | uso |
| --- | --- | --- | --- | --- | --- | --- |
| claro | `--cor-texto` #1C1A18 | `--cor-fundo` #F4F1EC | 15,40 | 4,50 | ok | texto principal |
| claro | `--cor-texto` #1C1A18 | `--cor-superficie` #E6DED2 | 13,01 | 4,50 | ok | texto sobre superfície |
| claro | `--cor-texto-2` #675E55 | `--cor-fundo` #F4F1EC | 5,63 | 4,50 | ok | texto secundário, legendas, rótulos |
| claro | `--cor-texto-2` #675E55 | `--cor-superficie` #E6DED2 | 4,76 | 4,50 | ok | texto secundário sobre superfície |
| claro | `--cor-acento` #675E55 | `--cor-fundo` #F4F1EC | 5,63 | 4,50 | ok | texto de acento |
| claro | `--cor-acento` #675E55 | `--cor-superficie` #E6DED2 | 4,76 | 4,50 | ok | texto de acento sobre superfície |
| claro | `--cor-linha-forte` #675E55 | `--cor-fundo` #F4F1EC | 5,63 | 3,00 | ok | borda de controle (UI) |
| claro | `--cor-foco` #1C1A18 | `--cor-fundo` #F4F1EC | 15,40 | 3,00 | ok | anel de foco (UI) |
| claro | `--cor-foco` #1C1A18 | `--cor-superficie` #E6DED2 | 13,01 | 3,00 | ok | anel de foco sobre superfície (UI) |
| claro | `--cor-madeira` #8A6A4F | `--cor-fundo` #F4F1EC | 4,38 | 3,00 | ok | freijó: elementos grandes/UI |
| escuro | `--cor-texto` #F4F1EC | `--cor-fundo` #1C1A18 | 15,40 | 4,50 | ok | texto principal |
| escuro | `--cor-texto` #F4F1EC | `--cor-superficie` #24211E | 14,21 | 4,50 | ok | texto sobre superfície |
| escuro | `--cor-texto-2` #A79C8F | `--cor-fundo` #1C1A18 | 6,44 | 4,50 | ok | texto secundário, legendas, rótulos |
| escuro | `--cor-texto-2` #A79C8F | `--cor-superficie` #24211E | 5,94 | 4,50 | ok | texto secundário sobre superfície |
| escuro | `--cor-acento` #B8916E | `--cor-fundo` #1C1A18 | 6,04 | 4,50 | ok | texto de acento |
| escuro | `--cor-acento` #B8916E | `--cor-superficie` #24211E | 5,58 | 4,50 | ok | texto de acento sobre superfície |
| escuro | `--cor-linha-forte` #A79C8F | `--cor-fundo` #1C1A18 | 6,44 | 3,00 | ok | borda de controle (UI) |
| escuro | `--cor-foco` #F7D9A8 | `--cor-fundo` #1C1A18 | 12,76 | 3,00 | ok | anel de foco (UI) |
| escuro | `--cor-foco` #F7D9A8 | `--cor-superficie` #24211E | 11,78 | 3,00 | ok | anel de foco sobre superfície (UI) |
| escuro | `--cor-madeira` #8A6A4F | `--cor-fundo` #1C1A18 | 3,52 | 3,00 | ok | freijó: elementos grandes/UI |
| ambos | `--osso` #F4F1EC | `--grafite` #1C1A18 | 15,40 | 4,50 | ok | faixa "em revisão" |
| ambos | `--grafite` #1C1A18 | `--luz` #F7D9A8 | 12,76 | 4,50 | ok | selo PROVISÓRIO; seleção de texto |

Resultado: **todos os pares passam**.
