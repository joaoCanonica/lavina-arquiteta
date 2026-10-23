# Final 3 — Publicidade: Código de Ética do CAU (Res. 52/2013)

Conferência de 22/10/2026. O PDF oficial do Código de Ética está em caubr.gov.br, inacessível aqui.

| regra | o que diz (segundo a busca) | situação |
| --- | --- | --- |
| Res. CAU/BR 52/2013, 3.2.8 (numeração citada na pesquisa da sessão 5) | Ao comunicar, publicar, divulgar ou promover o trabalho, considerar a veracidade das informações e o respeito à reputação da Arquitetura e Urbanismo. | NÃO VERIFICADO no texto oficial ([vLex](https://vlex.com.br/vid/cau-br-resolucao-no-641482993), resumos no [Studocu](https://www.studocu.com/pt-br/document/universidade-federal-de-santa-maria/legislacao-e-normas/cau-resolucao-52-codigo-de-etica-arquiteto-e-urbanista/57200831)) |
| 3.2.9 | Não assumir a autoria de trabalho que não realizou; não se representar de forma falsa ou enganosa. | NÃO VERIFICADO no texto oficial |
| Superlativos | A busca **não achou** regra do CAU que vete expressamente "o melhor". As vedações a superlativos encontradas são de outros conselhos (CFM, OAB). | **FONTES DIVERGEM:** blogs atribuem ao CAU uma regra que pertence a outros códigos. A lista de termos vetados do projeto (`src/config/termos.ts`) é decisão do João e vale mesmo sem norma expressa. |

## O que o site faz hoje

- **Termos vetados:** 0 no HTML das 18 páginas (`pnpm audit-compliance`).
- **Reputação por fatos:** nota 5,0 com 15 avaliações e data da conferência; trechos com nome e inicial; nenhum selo, prêmio ou ranking.
- **Fornecedores:** aparecem só na ficha técnica, em tipografia igual à dos outros créditos, nunca como vitrine de marcas.

## Achado: superlativo queimado em vídeo

- O vídeo `apresentacao-principal.mp4` (living e jantar) tem uma legenda queimada com "o melhor" (já registrado em `docs/PENDENCIAS.md`).
- O audit-compliance confere só o HTML, não o texto dentro do vídeo.
- **DECISÃO HUMANA:**
  - manter o vídeo (é a fala dela, no post original);
  - ou trocar pelos quadros já existentes;
  - ou cortar o trecho, que é edição de vídeo e precisa da autorização dela.

  Recomendação do Code: manter os quadros e tirar o vídeo da página até a decisão. Não fiz essa troca sozinho porque ela muda conteúdo aprovado.
