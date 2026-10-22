## Conferência de normas (sessão 9, 22/10/2026)

Passada única. Detalhe, fontes e situação de cada fonte em `docs/pesquisa/final-1.md` … `final-9.md`.

**Limite:** este ambiente não alcança os sites oficiais (CAU/BR, Planalto, DOU, ANPD: DNS bloqueado). O conteúdo das normas veio da busca na web. Por isso quase nada aparece como VERIFICADO no texto oficial. **O que o site faz** foi VERIFICADO por script em cada item.

Legenda: **VERIFICADO** (fonte oficial lida, ou o comportamento do site conferido por teste) · **FONTES DIVERGEM** · **NÃO VERIFICADO** (norma não lida no texto oficial) · **DECISÃO HUMANA**.

| # | item | situação | o que mudar | quem decide |
| --- | --- | --- | --- | --- |
| 1 | **CAU**: autor e responsável técnico em cada projeto divulgado (Res. CAU/BR 75/2014; infrações na Res. 198/2020, art. 39); registro da PJ; número CAU das arquitetas | Autoria na abertura e na ficha de cada projeto: VERIFICADO (audit-seo). **Faltam** responsável técnico, título, número CAU (Amanda, Renata, Lara e PJ) e RRT. Normas: NÃO VERIFICADO no texto oficial. Revisão da Res. 75 para sites (Consulta 51/2025): FONTES DIVERGEM, sem confirmação | Informar os CAUs e o responsável técnico de cada projeto (Prompt D). O site ganha "Responsável técnica: …, arquiteta e urbanista, CAU …" na abertura e o registro da PJ no rodapé | **João e Amanda** (DECISÃO HUMANA; recomendado antes da produção) |
| 2 | **Direito autoral**: crédito de projeto, da imagem 3D (Renata) e da fotógrafa (@sabrinarodriguesfoto); fotos de obra sem crédito | Projeto, imagem 3D e fotógrafa dos retratos da Amanda: VERIFICADO no site. Fotos e vídeos de obra e retratos da Renata e da Lara: "A confirmar" (em produção aparece o texto, sem o selo). Lei 9.610/98 (arts. 7º, 24 e 79) e Res. CAU 67/2013: NÃO VERIFICADO no texto oficial | Amanda informa quem fotografou e filmou cada obra e confirma a autorização de uso | **Amanda** (DECISÃO HUMANA) |
| 3 | **Publicidade** (Código de Ética, Res. CAU/BR 52/2013): sem superlativo; reputação por fatos; fornecedores só como crédito técnico | 0 termos vetados no HTML (VERIFICADO, audit-compliance). Reputação por fatos (nota, total, data, trechos com nome) e fornecedores só na ficha técnica: VERIFICADO. Regra do CAU sobre superlativos: FONTES DIVERGEM (a busca só achou vedação expressa em outros conselhos). **Achado:** a legenda queimada do vídeo `apresentacao-principal.mp4` (living e jantar) diz "o melhor" | Decidir o vídeo do living: manter (fala dela, do post), trocar pelos quadros ou cortar o trecho (com autorização). Recomendação: quadros | **João** (DECISÃO HUMANA) |
| 4 | **CDC**: rótulo render × executado em todas as imagens; nenhuma imagem 3D como obra | VERIFICADO: 135 mídias, 0 sem rótulo; aviso nas páginas só com 3D; títulos e descrições dizem "imagens 3D"; a imagem OG traz o rótulo. CDC art. 37: NÃO VERIFICADO no texto oficial | Nada | — |
| 5 | **Clientes identificáveis**: clínicas com nome; residências sem endereço; crianças sem nome | Residências sem endereço e com código de iniciais; nenhuma criança nomeada: VERIFICADO. Clínicas (Jonny Arruda, Cordis) publicadas com base na autorização registrada no CLAUDE.md; não há documento no repositório | Guardar a autorização escrita das duas clínicas antes da produção | **João** (DECISÃO HUMANA) |
| 6 | **Avaliações do Google** (nome e inicial) e atualização da nota | Nome e inicial, "no Google", nota com data (20/10/2026), sem AggregateRating nem Review: VERIFICADO. Política do Google para avaliações via API: VERIFICADO na página oficial, mas não se aplica (o site não usa a API). Termos para citação manual: NÃO VERIFICADO | Atualizar a nota e o total uma vez por mês (Prompt D); avisar os clientes citados | **João** (rotina) |
| 7 | **LGPD**: política, banner, mapa, WhatsApp sem dado sensível | Zero terceiros antes do aceite, botões iguais, revogação, mapa só com consentimento, mensagem do WhatsApp sem dado sensível: VERIFICADO (test:consentimento). Vercel Analytics sem cookies, hash de 24 h: VERIFICADO pela busca na página oficial. Guia de cookies da ANPD: NÃO VERIFICADO no PDF; datas FONTES DIVERGEM. Res. CD/ANPD 2/2022 (encarregado) e Marco Civil art. 15: NÃO VERIFICADO | **[DECISÃO HUMANA: revisão jurídica]** da `/privacidade` e do banner; definir e-mail do titular; definir o encarregado | **Advogado do João** |
| 8 | **Coerência de nome, endereço e telefone** (Google: "Amanda Lavina Arquitetura") | Endereço e telefone iguais aos da ficha; nome do site "Lavina — coletivo de arquitetura" com o nome do Google como `alternateName`: VERIFICADO. Diretriz do Google (nome real do negócio): VERIFICADO na página oficial. Endereço da Receita diverge (outra rua e CEP, mesmo prédio) | Renomear a ficha só se fachada, cartões e site usarem o novo nome; alinhar o endereço da Receita com o da ficha | **Amanda** (nome) · **João** (endereço) |
| 9 | **Uso de IA no processo** | A frase literal dela (post DNqdWgzOxED) aparece só como ela publicou; nenhuma imagem com IA generativa; edições globais registradas no manifesto: VERIFICADO | Manter ou retirar a linha (decisão 10 do copy deck) | **João** |

## Bloqueios de produção (nenhum escondido)

**Travas automáticas** (`pnpm validate-config --producao` + `pnpm audit-compliance --producao`): **0 travas**. WhatsApp presente, 0 termos vetados no HTML, todas as mídias rotuladas, todos os projetos com autoria, nenhuma mídia "não usar" publicada.

**Impedem a produção por regra do projeto** (`docs/DEPLOY.md` §3):
1. **Domínio** `coletivoarquiteturalavina.com.br` não registrado (config `aviso`). Sem ele, o site fica com noindex e o robots.txt bloqueado, de propósito.

**Recomendado resolver antes da produção** (não travam o build; ficam aqui para não ficarem escondidos):
1. CAU e responsável técnico de cada projeto (item 1). Risco de "omissão de responsável técnico em publicação".
2. Revisão jurídica da `/privacidade` e e-mail do titular (item 7).
3. Vídeo do living com "o melhor" queimado (item 3).
4. Crédito das fotos e vídeos de obra (item 2).
5. Autorização escrita das clínicas (item 5).
