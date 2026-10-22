# Final 6 — Avaliações do Google no site

Conferência de 22/10/2026.

| fonte | o que diz | situação |
| --- | --- | --- |
| Políticas do Google Maps Platform (Places API) | Avaliações exibidas **pela API** levam atribuição, com o nome do autor perto do texto, e não podem ser armazenadas além do permitido. | VERIFICADO pela busca na página oficial do Google ([Places API policies](https://developers.google.cn/maps/documentation/places/web-service/policies?hl=en)), mas **não se aplica diretamente**: o site não usa a API, só cita trechos |
| Termos do Perfil da Empresa sobre republicar avaliações | A busca não achou regra oficial sobre copiar avaliações para o próprio site. | NÃO VERIFICADO |
| CDC, art. 37 | A avaliação precisa ser real e não pode induzir a erro. | NÃO VERIFICADO no texto oficial |

## O que o site faz hoje (VERIFICADO no repositório)

- **Trechos:** os de Jane W., Isabel S., Roberta S. e Luísa W. ficam em `src/config/avaliacoes.ts`, com nome e inicial e "no Google".
- **Edição:** só cortes marcados com "[…]", sem superlativos. O único ajuste de pontuação ("Lages/SC-" virou "Lages/SC —") está registrado no COPY_DECK.
- **Nota:** "5,0 de 5 no Google", "15 avaliações no Google (conferido em 20/10/2026)", com link para a ficha.
- **Dados estruturados:** sem `AggregateRating` e sem `Review` no JSON-LD (conferido pelo `audit-seo`).
- **Atualização:** a data da conferência é mostrada. Não há atualização automática, porque usaria a API, que exige chave e cache limitado.

## Conclusão

- **Reprodução e marcação:** atendido.
- **DECISÃO HUMANA:**
  - rotina de atualização da nota, por exemplo mensal, junto com o roteiro de IA do `docs/SEO.md`;
  - autorização dos autores das avaliações para a citação nominal. O site usa nome e inicial, como aparecem publicamente no Google; recomenda-se avisar os clientes citados.
