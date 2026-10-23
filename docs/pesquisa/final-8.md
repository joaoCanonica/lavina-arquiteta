# Final 8 — Coerência de nome, endereço e telefone (NAP)

Conferência de 22/10/2026.

| canal | nome | endereço | telefone | fonte |
| --- | --- | --- | --- | --- |
| Site (config) | Lavina — coletivo de arquitetura | Av. Pres. Vargas, 505, Sagrado Coração de Jesus, Lages/SC, 88508-110 | (49) 99190-0821 (WhatsApp) | `src/config/marca.ts`, `contato.ts` |
| Google (ficha) | **Amanda Lavina Arquitetura** | igual ao site | igual (botão do Linktree) | investigação §2 (VISTO em 20/10/2026) |
| Instagram | Lavina \| Coletivo de Arquitetura (@lavina.co.arq) | — | — | investigação §2 |
| Receita Federal | Amanda Lavina Arquitetura Ltda | **Rua Lourenço Teodoro Waltrick, 505, CEP 88508-170** (prédio de esquina) | — | investigação §2; `enderecoDivergencia` (aviso) |

| fonte normativa | o que diz | situação |
| --- | --- | --- |
| Diretrizes do Perfil da Empresa no Google | O nome deve refletir o nome real do negócio, como aparece na fachada, no site e nos materiais. Termos legais (Ltda) e palavras-chave não entram por padrão. | VERIFICADO pela busca na página oficial ([Google, diretrizes](https://support.google.com/business/answer/3038177?hl=en)) |

## O que o site faz

- **Endereço e telefone:** iguais aos da ficha do Google.
- **Nome:** "Lavina — coletivo de arquitetura", com "Amanda Lavina Arquitetura" como `alternateName` e a razão social como `legalName` no JSON-LD.
- **Rodapé e `/privacidade`:** mostram a razão social e o CNPJ (`exibirCnpj`).

## Conclusão

- **DECISÃO HUMANA (Amanda):** se a marca pública passa a ser "Lavina — coletivo de arquitetura", renomear a ficha do Google. Isso só se a fachada, os cartões e o site usarem esse nome; é o que pede a diretriz do Google. Se a ficha continuar "Amanda Lavina Arquitetura", o site já cobre os dois nomes.
- **DECISÃO HUMANA (João):** o endereço da Receita diverge do da ficha (mesmo prédio de esquina, outra rua e outro CEP). O site usa o do Google, como o João confirmou. Recomenda-se atualizar o cadastro na Receita ou na ficha para que fiquem iguais.
