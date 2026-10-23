# Final 7 — LGPD: política, banner, mapa e WhatsApp

Conferência de 22/10/2026. O site da ANPD e o Planalto estão inacessíveis aqui (DNS).

| fonte | o que diz | situação |
| --- | --- | --- |
| Guia orientativo da ANPD "Cookies e proteção de dados pessoais" (v1.0, out/2022) | Botão para rejeitar os cookies não necessários, de fácil visualização, no primeiro e no segundo nível do banner. Cookies de consentimento desligados por padrão. Opções de aceitar, rejeitar e gerenciar. | NÃO VERIFICADO no PDF oficial; resumido por escritórios ([Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/anpd-divulga-novo-guia-com-orientacoes-sobre-cookies), [Licks](https://www.lickslegal.com/post/o-guia-da-anpd-sobre-cookies-e-protecao-de-dados-pessoais)). **FONTES DIVERGEM** na data (out/2022 × out/2023). |
| Res. CD/ANPD 2/2022 | Agentes de tratamento de pequeno porte podem ser dispensados de indicar encarregado, desde que mantenham canal de comunicação com o titular. | NÃO VERIFICADO (a busca não trouxe o texto) |
| Marco Civil da Internet, art. 15 | Provedor de aplicações PJ, organizado, profissional e com fins econômicos, guarda os registros de acesso por 6 meses. | NÃO VERIFICADO no texto oficial ([modeloinicial](https://modeloinicial.com.br/lei/27460/marco-civil-internet/art-15)). Se a Lavina se enquadra (o site é institucional) é **DECISÃO HUMANA** |
| Vercel Web Analytics | Sem cookies; o visitante é identificado por um hash da requisição, descartado em 24 horas; só estatística agregada. | VERIFICADO pela busca na página oficial da Vercel ([privacy policy](https://vercel.com/docs/analytics/privacy-policy), [docs](https://vercel.com/docs/analytics)) |

## O que o site faz hoje (VERIFICADO por teste, `pnpm test:consentimento`)

- **Antes da escolha:** zero requisição de terceiros, em 8 rotas, a 390 e 1440 px.
- **Banner:** Aceitar, Recusar e Personalizar com o mesmo estilo calculado. As categorias começam desligadas. A revogação fica no rodapé.
- **Mapa:** iframe do Google só depois de "mapas"; antes, só o link.
- **WhatsApp:** a mensagem pronta tem só tipo de projeto, cidade e "Vim pelo site". Nenhum formulário coleta dado pessoal.
- **Instagram:** só links.
- **`/privacidade`:** controlador com CNPJ, dados, finalidades, bases legais, terceiros, cookies, retenção, direitos (art. 18) e canal, com data de 22/10/2026.

## Conclusão

**DECISÃO HUMANA: revisão jurídica** (já marcada no COMPLIANCE.md) de:
- bases legais;
- retenção;
- encarregado;
- transferência internacional;
- texto final da política.

Pendências de dado:
- **E-mail do titular:** falta na config.
- **Estatística:** o texto do site pode passar de "de forma agregada" para "sem cookies; identificação descartada em 24 horas", agora que a fonte foi achada. Fica para a revisão jurídica, porque muda a política.
