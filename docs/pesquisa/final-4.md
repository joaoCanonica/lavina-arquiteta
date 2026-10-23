# Final 4 — CDC: imagem 3D × obra executada

Conferência de 22/10/2026. O texto do CDC no Planalto está inacessível aqui (DNS).

| norma | o que diz (segundo a busca) | situação |
| --- | --- | --- |
| CDC (Lei 8.078/1990), art. 37, § 1º | Publicidade enganosa é a informação inteira ou parcialmente falsa, ou capaz de induzir em erro, inclusive por omissão, sobre a natureza e as características do produto ou serviço. | NÃO VERIFICADO no texto oficial ([Aurum, CDC comentado](https://www.aurum.com.br/blog/cdc-comentado/art-36-a-38-cdc/), [modeloinicial](https://modeloinicial.com.br/lei/CDC/array-0x558671c9fe48/art-37)) |
| art. 37, § 3º | Também é enganosa a publicidade que deixa de informar dado essencial. | NÃO VERIFICADO no texto oficial |
| art. 30 e 38 | A publicidade vincula quem anuncia; o ônus de provar a veracidade é de quem patrocina. Comentários dizem que "imagem meramente ilustrativa" não afasta a vinculação. | NÃO VERIFICADO no texto oficial ([jus.com.br](https://jus.com.br/artigos/72077/aspectos-juridicos-da-publicidade-e-da-imagem-meramente-ilustrativa-no-direito-do-consumidor)) |

## O que o site faz hoje (VERIFICADO no próprio site, por script)

- **Rótulo de natureza:** toda imagem e todo vídeo de projeto têm o atributo `data-natureza` válido e um rótulo visível com o texto da natureza ("Imagem 3D do projeto", "Obra executada", "Antes", "Depois", "Vídeo", "Retrato") no mesmo `figure`. Medido: **135 mídias, 0 sem rótulo** (`pnpm audit-compliance`).
- **Projetos só com imagem 3D** (Cordis, T|B, Suíte F|L) avisam "Todas as imagens desta página são imagens 3D do projeto. Nenhuma delas é foto de obra."
- **Títulos e descrições** desses projetos dizem "imagens 3D".
- **Prévia de compartilhamento:** a imagem OG traz o rótulo de natureza escrito.
- **Comparadores:** "Imagem 3D do projeto × Obra executada" e "Antes × Depois", rotulados nos dois lados.
- **Cordis e T|B:** o texto diz que a obra foi executada, mas que as fotos dela ainda não estão no site. É uma afirmação de fato tirada das legendas (decisão 5 do copy deck).

## Conclusão

**Atendido.** Nenhuma imagem 3D aparece como obra. A trava de produção "imagem publicada sem rótulo de natureza" está verde.
