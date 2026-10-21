# Copy deck — Lavina, coletivo de arquitetura

Sessão 5 · 21/10/2026. Todo o texto do site, a partir das legendas e frases da própria Amanda. Nenhuma afirmação sem fonte no repositório.

## Como ler este documento

- **Fontes:**
  - `docs/dados/midia-legendas.json` (legendas literais, por post);
  - `docs/LAVINA_MAPA_MIDIA_LEGENDAS.md` (frases literais e retratos);
  - `docs/LAVINA_INVESTIGACAO_CLIENTE.md` (dados, avaliações, equipe);
  - `src/config/` (fonte única dos dados).
- **Citação literal:** entre aspas, assinada e com o post de origem. No HTML, sai assim:
  ```html
  <blockquote class="citacao" data-fonte-post="DXzMwBRFUox">
    <p>"Hoje eu não projeto mais pra impressionar, eu projeto pra viver."</p>
    <footer>— Amanda Lavina</footer>
  </blockquote>
  ```
- **Texto editado:** frases dela adaptadas para o site (sem emojis, sem hashtags, sem "arrasta pro lado"). O post de origem aparece entre colchetes, ex.: [DNqdWgzOxED].
- **[PENDENTE]:** dado que não existe nas fontes. Não foi inventado e não aparece no site até ser confirmado.
- **Rótulo de natureza:** "Obra executada", "Imagem 3D do projeto", "Antes", "Depois", "Vídeo" aparecem sempre que o texto fala de uma imagem.
- **Termos vetados** (`src/config/termos.ts`): nenhum. Conferido por script no fim deste documento.

---

## 1. Abertura (home)

**Título (tese):** Arquitetura com presença em cada etapa.
*Fonte: bio do Instagram @lavina.co.arq.*

**Subtítulo:** Interiores, iluminação e acompanhamento de obra. Lages e Litoral Catarinense.
*Fonte: especialidade (investigação §0 e §5) e atuação (config `atuacao`).*

**CTAs:** Ver projetos · Solicitar orçamento (WhatsApp)

**Legenda da foto:** Cozinha J|C · Obra executada · Balneário Camboriú

**Duas alternativas de título** (literais, assinadas):
1. "Hoje eu não projeto mais pra impressionar, eu projeto pra viver." — Amanda Lavina [DXzMwBRFUox]
2. "Antes de falar de plantas, medidas e orçamentos… a gente fala sobre você." — Amanda Lavina [DNVwPbWxkqZ]

---

## 2. Manifesto (bloco curto)

> Antes de falar de plantas, medidas e orçamentos, a gente fala sobre você. [DNVwPbWxkqZ]
>
> Acreditamos que o bom arquiteto é aquele que escuta. Que respeita o estilo, os desejos e a história de quem vai viver ali. [DLGhb8zMT8m]
>
> Não existe acaso em um projeto bem executado. Cada escolha tem um motivo. Cada detalhe tem uma função. [DZn_e-qOnLN]
>
> "Hoje eu não projeto mais pra impressionar, eu projeto pra viver." — Amanda Lavina [DXzMwBRFUox]

*Edição: só pontuação (sem reticências duplas e sem emoji). As três primeiras frases são da voz do coletivo, em posts de @lavina.co.arq; a última é literal e assinada.*

---

## 3. Processo: presença em cada etapa

**Abertura da seção:** Arquitetura é feita de detalhes e processos bem definidos. No nosso escritório, cada projeto passa por cinco etapas. [DNqdWgzOxED]

| # | Etapa (literal do post, editado) | Frase da etapa (dela) | Fonte da frase |
| --- | --- | --- | --- |
| 01 | Reunião inicial, para entender cada necessidade. | "Antes de falar de plantas, medidas e orçamentos… a gente fala sobre você." | DNVwPbWxkqZ (vídeo `falando-sobre-primeiro-contato.mp4`) |
| 02 | Estudo do espaço, da rotina e do estilo de vida de quem vai viver ali. | Seu lifestyle, o que te encanta, o que você não gosta, suas memórias e sonhos. | DNVwPbWxkqZ |
| 03 | Criação do conceito, onde estética e propósito se encontram. | "É como assistir a um filme na mente e depois desenhá-lo cena por cena." | DMyqTe1MnUS |
| 04 | Desenvolvimento do projeto técnico, com soluções funcionais e criativas. | "Cada escolha tem um motivo. Cada detalhe tem uma função." | DZn_e-qOnLN |
| 05 | Acompanhamento próximo da execução, para que tudo saia como planejado. | "Não existe acaso em um projeto bem executado." | DZn_e-qOnLN |

**Edição feita no literal:**
- Tirei "que garantem qualidade e identidade única". A frase soa como promessa, e "garant-" está perto dos termos vetados.
- Tirei os emojis numerados.
- Mudei "dos clientes" para "de quem vai viver ali", a expressão dela em DLGhb8zMT8m.

**Linha discreta sobre IA** (sem destaque, corpo pequeno, depois da etapa 05):
> A inteligência artificial também entra, de forma sutil, na organização do processo. [DNqdWgzOxED]

**Encaixe com o vídeo `um-dia-no-escritorio.mp4`** [DOd4IshDqUc]. Os tempos em que cada rótulo aparece estão em `src/config/processo.ts`. O encaixe abaixo é editorial: o vídeo é um dia de rotina, não uma etapa por hora.

| rótulo no vídeo | tempo (s) | etapa do site |
| --- | --- | --- |
| 8 AM · Escritório | 8–11 | abertura da seção (o escritório) |
| 9 AM · Alinhamento da Equipe | 14–16 | 02 e 03 (estudo e conceito, em equipe) |
| 10 AM · Apresentação de Projeto | 23–26 | 03 e 04 (conceito e projeto técnico apresentados) |
| 2 PM · Acompanhamento de Obra | 34–41 | 05 |
| 5 PM · Ambientação e entrega de projeto | 52–56 | a entrega (fecho da seção) |

**Legenda do vídeo, editada:** A rotina é cheia de reuniões, obras e detalhes. Por trás de tudo isso, existe gente que gosta de ver projetos virando lares. [DOd4IshDqUc]
*O literal fala em "corações que amam ver projetos virando lares, sonhos ganhando forma e famílias construindo memórias". Reduzi para uma frase.*

---

## 4. Projetos (9)

**Créditos padrão:**
- Projetos com imagem 3D da Renata: "Projeto: Lavina — coletivo de arquitetura · Imagem 3D: Renata Nürnberg".
- Projetos em que a legenda diz "PROJETO E IMAGENS ELABORADOS PARA @lavina.co.arq": "Projeto e imagens 3D: Renata Nürnberg para Lavina — coletivo de arquitetura" (decisão do João, 20/10).
- Fotos de obra: "Fotografia: [PENDENTE]".

**Campos que não aparecem:** ano e área não existem em nenhuma fonte e ficam fora. Cidade só onde há fonte. O texto de cada projeto (abertura + o pedido + a resposta) está gravado em `textoSite` (`src/content/projetos/*.json`).

### 4.1 Consultório Jonny Arruda

- **Tipo:** saúde (ginecologia e obstetrícia de alto risco) · **Cidade:** Lages · **Natureza:** Imagem 3D do projeto + Antes + Depois.
- **Linha de abertura (citável):** Um consultório de ginecologia e obstetrícia de alto risco em que cada detalhe foi desenhado para gerar conforto, confiança e tranquilidade. Um espaço técnico, mas profundamente humano. Aqui o projeto pode ser visto duas vezes: na imagem 3D, antes da obra, e na obra executada, no mesmo ângulo.
- **O pedido:** Um ambiente que transformasse consultas em momentos de cuidado e transmitisse tranquilidade, segurança e delicadeza desde o primeiro olhar. [DSGdwDDj4Kv]
- **A resposta do projeto:** Marcenaria em madeira com armário curvo, estantes com luz embutida e uma mesa oval de pedra no lugar do escritório antigo. A sala de exame ganhou painel de madeira, iluminação indireta e cortina. Pelo comentário da Renata, o resultado ficou fiel ao projeto. [DTqJY19jgis · comentários]
- **Detalhes:**
  - estantes com luz embutida;
  - mesa oval de pedra;
  - painel de madeira na sala de exame;
  - par "Imagem 3D do projeto × Obra executada" no mesmo ângulo.
- **Citação:** "Eu amei esse resultado final, 100% fiel ao projeto!" — Renata Nürnberg [comentário em post do consultório]
- **Créditos:**
  - Projeto: Lavina — coletivo de arquitetura · Imagem 3D: Renata Nürnberg.
  - Marcenaria: Lazzari Móveis · Pedras: Álamo Marmoraria · Cortinas: Maitê Decorações · Iluminação: AF Eletricidade · Decoração: Espaço Decora by Rita Assunção.
  - Fotografia: [PENDENTE].
- **Ver no Instagram:** /p/DTqJY19jgis · /p/DUUHxO4DhqK · /p/DSGdwDDj4Kv

### 4.2 Cozinha J|C

- **Tipo:** residencial (reforma) · **Cidade:** Balneário Camboriú · **Natureza:** Imagem 3D do projeto + Antes + Depois + Vídeo.
- **Linha de abertura (citável):** A cozinha existente foi inteira repensada, e o caminho pode ser visto de ponta a ponta: a imagem 3D do projeto, o antes, a obra executada e o vídeo da entrega. Leveza na composição, riqueza nos detalhes: a textura da pedra, a suavidade da iluminação e o equilíbrio entre cada elemento.
- **O pedido:** Transformar a cozinha antiga (armários e bancada de granito, piso cerâmico) num ambiente de conforto e sofisticação sutil e atemporal. [DZIFaXyFq8k; fotos "Antes"]
- **A resposta do projeto:** Marcenaria clara do piso ao teto, torre de fornos, ilha de pedra com banquetas, cristaleira iluminada e uma linha de luz embutida no forro. A obra seguiu o projeto: "Se você acompanhou os nossos últimos posts, já pode perceber o quanto o projeto ficou fiel a execução!" [DZn_e-qOnLN]
- **Detalhes:**
  - linha de luz embutida no forro;
  - torre de fornos e refrigerador embutidos;
  - ilha de pedra e cristaleira iluminada;
  - comparadores "Antes × Depois" e "Imagem 3D × Obra executada".
- **Citação:** "Não existe acaso em um projeto bem executado. Cada escolha tem um motivo. Cada detalhe tem uma função." [DZn_e-qOnLN]
- **Créditos:**
  - Projeto: Lavina — coletivo de arquitetura · Imagem 3D: Renata Nürnberg.
  - Marcados no post do Antes & Depois: Maitê Decorações, Álamo Marmoraria, Alpen Planejados, AF Eletricidade (a função de cada um não está escrita no post).
  - Fotografia e vídeo: [PENDENTE].
- **Ver no Instagram:** /p/DZ5PcHNDj3R · /p/DZn_e-qOnLN · /p/DZIFaXyFq8k · /p/DZh0O6uFqkV

### 4.3 Living e jantar com painel paramétrico

- **Tipo:** residencial · **Cidade:** [PENDENTE] · **Natureza:** Obra executada (vídeo e quadros do vídeo).
- **Linha de abertura (citável):** Um living com jantar em que o painel da TV deixou de ser só um painel: a marcenaria paramétrica em madeira percorre a parede e conversa com o forro de madeira, a sanca iluminada, a mesa redonda e a cristaleira com luz. A Amanda apresenta o ambiente em vídeo.
- **O pedido:** [PENDENTE: a legenda não descreve o pedido dos clientes.] O que a legenda diz: um projeto que reflita quem vai viver ali, "e não apenas uma assinatura estética". [DLGhb8zMT8m]
- **A resposta do projeto:** "Não precisa ser só um simples painel de tv! Neste projeto trouxemos um design inovador, que se tornou uma obra de arte." [DKuagnAMU8P] Em volta dele: mesa redonda de madeira, cristaleira iluminada, bancada de café e forro de madeira com luz indireta (quadros do vídeo).
- **Detalhes:**
  - painel paramétrico em madeira;
  - forro de madeira com sanca iluminada;
  - cristaleira com luz embutida;
  - mesa redonda de jantar.
- **Citação do cliente (comentário no post):** "Nosso ambiente mais aconchegante! Da idéia a realização!" [DKuagnAMU8P · comentário do cliente] *Grafia original mantida; a sessão 9 decide se vai assim ou sem a frase.*
- **Créditos:**
  - Projeto: Lavina — coletivo de arquitetura · Marcenaria: @mobmoveis17 (como na legenda).
  - Vídeo: [PENDENTE].
- **Ver no Instagram:** /p/DLGhb8zMT8m · /p/DKuagnAMU8P

### 4.4 Clínica Cordis

- **Tipo:** saúde (cardiologia) · **Cidade:** Lages · **Natureza:** Imagem 3D do projeto.
- **Linha de abertura (citável):** Consultório de cardiologia desenvolvido a partir da integração entre funcionalidade, conforto e identidade visual. A marcenaria organiza o armazenamento e o apoio ao atendimento, e um coração iluminado, integrado ao painel, reforça a especialidade de forma sutil e autoral, como mostram as imagens 3D do projeto.
- **O pedido:** Um consultório que unisse funcionalidade, conforto e a identidade visual da Cordis Cardiologia, e que recebesse com cuidado desde o primeiro contato. [DdY8lWNlqx7 · Dejm1uIFtwG]
- **A resposta do projeto:** Bancada de trabalho para uma rotina mais prática e fluida, marcenaria que organiza o atendimento e o coração iluminado no painel. Na recepção, curvas, detalhes iluminados e a mesma proposta em duas versões: off-white, para leveza e continuidade, e madeira, para profundidade e acolhimento. A obra já foi executada; as fotos dela ainda não estão no site.
- **Detalhes:**
  - coração iluminado integrado ao painel;
  - bancada de pedra escura;
  - recepção com curvas e luz;
  - duas versões do mesmo projeto (off-white e madeira).
- **Citação:** "Executado ficou tão lindo quanto." — Amanda Lavina [comentário em DdY8lWNlqx7] *Usar só se a foto da obra entrar; até lá, não citar.*
- **Créditos:** Projeto e imagens 3D: Renata Nürnberg para Lavina — coletivo de arquitetura.
- **Ver no Instagram:** /p/DdY8lWNlqx7 · /p/Dejm1uIFtwG

### 4.5 Cozinha farmhouse

- **Tipo:** residencial · **Cidade:** [PENDENTE] · **Natureza:** Obra executada (vídeo e quadros do vídeo).
- **Linha de abertura (citável):** Aqui a cliente não precisou se adaptar ao estilo do escritório: o projeto foi construído a partir da identidade dela. Nada de minimalismo. Marcenaria azul com luz no rodapé, cristaleiras em arco e mesa redonda, numa cozinha em que sofisticação e personalidade caminham juntas.
- **O pedido:** Uma cozinha com a cara da cliente, e não com a do escritório. [DeHe75fOqIA]
- **A resposta do projeto:** Marcenaria azul com fita de luz no rodapé, cristaleiras em arco com iluminação, mesa redonda e um bar em arco ao lado do estar. A cliente comentou: "O projeto ficou exatamente do jeitinho que eu sonhava e imaginava." [DeHe75fOqIA · comentário]
- **Detalhes:**
  - marcenaria azul com luz no rodapé;
  - cristaleiras em arco iluminadas;
  - mesa redonda;
  - bar em arco.
- **Créditos:**
  - Projeto: Lavina — coletivo de arquitetura.
  - Vídeo: [PENDENTE].
- **Ver no Instagram:** /p/DeHe75fOqIA

### 4.6 Banheiro em tons claros

- **Tipo:** residencial · **Cidade:** [PENDENTE] · **Natureza:** Obra executada.
- **Linha de abertura (citável):** Neste banheiro, os tons claros não foram só uma escolha estética: foram estratégicos. A paleta neutra e o porcelanato suave refletem luz, ampliam a percepção do espaço e criam uma atmosfera de sofisticação serena. Um espaço compacto pode e deve parecer grandioso.
- **O pedido:** Um banheiro compacto que parecesse maior. [DVcLRsXDpYJ]
- **A resposta do projeto:** Paleta neutra e porcelanato suave para refletir a luz; espelho com luz embutida sobre a bancada; marcenaria com puxadores dourados; cuba esculpida; banheira. [DVcLRsXDpYJ; fotos]
- **Detalhes:**
  - espelho com luz embutida;
  - cuba esculpida;
  - marcenaria com puxadores dourados;
  - banheira.
- **Citação:** "Esse banheiro é um respiro." — Amanda Lavina [comentário em DVcLRsXDpYJ]
- **Créditos:**
  - Projeto: Lavina — coletivo de arquitetura.
  - Marcados no post: Portobello Shop Lages, Álamo Marmoraria, AF Eletricidade, Espaço Decora Enxovais.
  - Fotografia: [PENDENTE].
- **Ver no Instagram:** /p/DVcLRsXDpYJ

### 4.7 Quarto e closet

- **Tipo:** residencial (reforma) · **Cidade:** [PENDENTE] · **Natureza:** Obra executada (vídeo e quadros do vídeo).
- **Linha de abertura (citável):** Às vezes o que você precisa não é de uma casa nova, mas de um novo olhar para a sua casa. Este quarto passou por uma transformação: cada centímetro foi redesenhado para trazer amplitude, leveza e sofisticação, com closet e penteadeira integrados.
- **O pedido:** Um quarto que voltasse a representar quem vive nele. [DVPU7xpDhVQ]
- **A resposta do projeto:** Cada centímetro redesenhado: cabeceira estofada com arandelas, penteadeira com espelho iluminado, nichos e um closet de portas claras. [DVPU7xpDhVQ; quadros do vídeo]
- **Detalhes:**
  - arandelas na cabeceira;
  - penteadeira com espelho iluminado;
  - closet integrado;
  - nichos para perfumes e objetos.
- **Créditos:**
  - Projeto: Lavina — coletivo de arquitetura.
  - Vídeo: [PENDENTE] (a arquiteta do vídeo também está a confirmar).
- **Ver no Instagram:** /p/DVPU7xpDhVQ

### 4.8 Projeto T|B

- **Tipo:** residencial · **Cidade:** Campo Belo do Sul · **Natureza:** Imagem 3D do projeto.
- **Linha de abertura (citável):** Um quarto que vai além do descanso: um refúgio particular. A proposta nasceu do desejo por um ambiente masculino, acolhedor e voltado ao lazer. O painel paramétrico em madeira percorre o espaço, e as camisas assinadas ganham uma área própria, com iluminação integrada.
- **O pedido:** Um quarto masculino, acolhedor e voltado ao lazer, com lugar para as camisas assinadas do cliente. [DcOmO3WFqjk]
- **A resposta do projeto:** Painel paramétrico em madeira como elemento de destaque, área de exposição das camisas com luz integrada e tons sóbrios, madeira e tecidos para uma atmosfera intimista. Cada escolha foi pensada para que o ambiente carregasse a identidade e as paixões de quem vai vivê-lo. A obra já foi executada; as fotos dela ainda não estão no site.
- **Detalhes:**
  - painel paramétrico em madeira;
  - camisas expostas com iluminação integrada;
  - tons sóbrios, madeira e tecidos;
  - criado-mudo com detalhe em madeira.
- **Créditos:** Projeto e imagens 3D: Renata Nürnberg para Lavina — coletivo de arquitetura.
- **Ver no Instagram:** /p/DcOmO3WFqjk
- *Nota: as camisas de clubes são objetos do cliente; não usar como capa (mapa de mídia).*

### 4.9 Suíte F|L

- **Tipo:** residencial · **Cidade:** Lages · **Natureza:** Imagem 3D do projeto.
- **Linha de abertura (citável):** Neste projeto, o principal pedido dos clientes era tons escuros. A missão foi fazer essa escolha conversar com a luz, com as texturas e com cada detalhe do ambiente, para que a suíte transmitisse conforto e aconchego. As imagens 3D mostram a cama com arandelas, o roupeiro e o painel de TV.
- **O pedido:** Uma suíte em tons escuros. [DaLTDbClllI]
- **A resposta do projeto:** Fazer o escuro conversar com a luz, com as texturas e com cada detalhe: arandelas na cabeceira, roupeiro e painel de TV no mesmo tom. [DaLTDbClllI; imagens 3D]
- **Detalhes:**
  - cama com arandelas;
  - roupeiro;
  - painel de TV;
  - tons escuros, a pedido dos clientes.
- **Créditos:** Projeto e imagens 3D: Renata Nürnberg para Lavina — coletivo de arquitetura.
- **Ver no Instagram:** /p/DaLTDbClllI
- *Nota: duas das imagens têm baixa resolução (máximo 480 px).*

---

## 5. Coletivo

**Abertura da página:** Cada uma com sua essência, todas com o mesmo propósito: criar espaços que respeitam quem habita. [DSTUiTJjoQk]

**Legenda do Dia do Arquiteto, editada para o site:**
> Conheça as arquitetas que caminham comigo. Celebro mais do que projetos: celebro pessoas, processos e relações construídas com cuidado. — Amanda Lavina [DSTUiTJjoQk]

### Amanda Lavina: arquiteta líder

- **Papel:** arquiteta líder e sócia-administradora da Amanda Lavina Arquitetura Ltda (Receita Federal).
- **Na voz dela:**
  - "Hoje eu não projeto mais pra impressionar, eu projeto pra viver." [DXzMwBRFUox]
  - Bio do Instagram: "Projetos, lugares e rituais do cotidiano."
- **Formação:** [PENDENTE] · **CAU:** [PENDENTE]
- **Retrato:** ensaio de estúdio · Fotografia: @sabrinarodriguesfoto.

### Renata Nürnberg

- **Papel:** arquiteta e urbanista, especializada em interiores e imagens realistas (bio @arq_renatanurnberg). Assina os projetos e as imagens 3D feitos para o coletivo.
- **Palavras dela** (do retrato, em texto HTML): Calma que resolve · Escutar vem antes de projetar · Projeta para pessoas reais · Detalhe é prioridade · Diálogo claro com os clientes · Apaixonada por criar imagens realistas.
- **Formação:** [PENDENTE] · **CAU:** [PENDENTE] · **Papel formal no coletivo:** [PENDENTE]

### Lara Honofre

- **Papel:** arquitetura e urbanismo (bio @honofrelara).
- **Palavras dela** (do retrato, em texto HTML): Sensibilidade e acolhimento · Apoio no processo · Evolução diária · Construindo repertório · Dedicação constante.
- **Formação** (arquiteta formada ou estudante): [PENDENTE] · **CAU:** [PENDENTE]

*Nota: os retratos da Renata e da Lara têm o texto queimado na imagem. Por isso o site repete as palavras em HTML (acessível) e mostra a foto com o texto, ou sem ele, se chegar o original.*

---

## 6. Avaliações

**Nota:** 5,0 · 15 avaliações no Google (conferido em 20/10/2026). *Sem AggregateRating no schema.*

> "Fez a reforma da nossa casa, em Lages/SC — e nós morando em outro estado (MS). Fez o projeto, providenciou materiais, mão de obra e acompanhou a execução. Muito cuidadosa com orçamentos, opções de materiais e sempre disponível." — Jane W., no Google
>
> "[…] atende em Lages/SC, mas que também faz projetos e acompanhamento de obra em outras cidades." — Isabel S., no Google
>
> "Projetos de muita elegância e bom gosto. Acompanha a obra de perto e é extremamente exigente com o resultado final." — Roberta S., no Google

*Edição: trechos cortados do literal (avaliações 4, 7 e 9 da investigação §9), sem os superlativos. O texto foi mantido como escrito, exceto o hífen de "Lages/SC-", que virou travessão.*

---

## 7. Atuação

**Texto:** Escritório em Lages, com projetos e obras acompanhadas também no Litoral Catarinense e na Serra.

**Cidades com projeto ou obra:**

| cidade | fonte |
| --- | --- |
| Lages (sede) | Receita Federal e Google |
| Balneário Camboriú | Cozinha J\|C |
| Urubici | avaliação de Daniela G. |
| Campo Belo do Sul | Projeto T\|B |

**Frase de prova:** "[…] atende em Lages/SC, mas que também faz projetos e acompanhamento de obra em outras cidades." — Isabel S., no Google

*"Serra" se apoia em Urubici e Campo Belo do Sul (as duas na Serra Catarinense). Se o João preferir só nomes de cidades, troque por "e em outras cidades de Santa Catarina".*

---

## 8. Contato e orçamento

**Título:** Vamos começar pelo que é mais importante: você.
*Fonte: "um projeto só é realmente seu quando começa pelo que é mais importante: você no centro de tudo" [DNVwPbWxkqZ].*

**Texto:** Conte que tipo de projeto você tem em mente e em que cidade. A primeira conversa é sobre você: sua rotina, o que te encanta, o que você não gosta. Plantas, medidas e orçamento vêm depois. [DNVwPbWxkqZ]

**Botão:** Solicitar orçamento pelo WhatsApp

**Mensagem pronta do WhatsApp** (sem dado sensível; a pessoa completa):
> Olá! Gostaria de conversar sobre um projeto.
> Tipo de projeto: (casa, apartamento, comercial ou saúde) ___
> Cidade: ___

**Dados:** Av. Pres. Vargas, 505 · Sagrado Coração de Jesus · Lages/SC · CEP 88508-110 · Segunda a sexta, 9h às 19h · Instagram @lavina.co.arq
*Fonte: config `contato`.*

---

## 9. Perguntas frequentes

**1. Como começa um projeto?**
Com uma conversa sobre você. Na reunião inicial, antes de plantas, medidas e orçamentos, falamos da sua rotina, do que te encanta, do que você não gosta, das suas memórias e dos seus sonhos. Depois vêm o estudo do espaço, o conceito, o projeto técnico e o acompanhamento da execução. O primeiro contato é pelo WhatsApp.
*(56 palavras · DNVwPbWxkqZ, DNqdWgzOxED)*

**2. Quanto tempo leva?**
Depende do tamanho e do tipo de projeto, e não publicamos um prazo médio sem saber o que você precisa. [PENDENTE: prazos de referência de projeto e de obra, a confirmar com a Amanda.] O que é igual em todos: as cinco etapas, da reunião inicial ao acompanhamento da execução, combinadas com você desde o começo.
*(56 palavras · DNqdWgzOxED)*

**3. Vocês acompanham a obra?**
Sim. Acompanhamento de obra faz parte do trabalho, e está na nossa apresentação: "Projetos personalizados + acompanhamento de obra". A quinta etapa do processo é o acompanhamento próximo da execução. Em avaliações no Google, clientes contam que a Amanda acompanhou a execução e providenciou materiais e mão de obra. Em outra: "Acompanha a obra de perto".
*(56 palavras · bio; DNqdWgzOxED; avaliações 4 e 9)*

**4. Vocês atendem fora de Lages?**
Sim. O escritório fica em Lages, e já há projetos e obras em Balneário Camboriú, Urubici e Campo Belo do Sul. Numa avaliação no Google, uma cliente resume assim: atende em Lages, mas também faz projetos e acompanhamento de obra em outras cidades. Para saber se atendemos a sua, conte a cidade no primeiro contato.
*(55 palavras · config `atuacao`; avaliação 7)*

**5. Dá para fazer o projeto à distância?**
Sim, já fizemos. Uma cliente que se mudou de apartamento recebeu consultoria à distância em todas as etapas de renovação e decoração. Outra família reformou a casa em Lages morando em Mato Grosso do Sul, com projeto, materiais, mão de obra e execução acompanhados pela Amanda. [PENDENTE: formato das reuniões à distância.]
*(52 palavras · avaliações 4 e 5)*

**6. O que é a imagem 3D do projeto?**
É uma imagem realista do ambiente, feita antes da obra, para você ver cores, texturas e luz antes de executar. No site, toda imagem leva um rótulo: "Imagem 3D do projeto" ou "Obra executada". Em alguns projetos as duas aparecem no mesmo ângulo, para comparar o que foi projetado com o que foi construído.
*(54 palavras · DMyqTe1MnUS; bio da Renata; pares do consultório e da Cozinha J|C)*

---

## 10. Decisões para o João e a Amanda (aprovar de uma vez)

1. **Assinatura das citações:** as legendas de @lavina.co.arq (voz do coletivo) podem ser assinadas como "— Amanda Lavina"? Proposta: assinar como Amanda só as frases do perfil dela (DXzMwBRFUox) e dos comentários dela. As do coletivo ficam sem assinatura pessoal, com o post como fonte.
2. **Título da abertura:** manter a tese ("Arquitetura com presença em cada etapa.") ou usar uma das alternativas (§1).
3. **"Serra" na atuação:** usar "Litoral Catarinense e na Serra" (com base em Urubici e Campo Belo do Sul) ou só os nomes das quatro cidades.
4. **Comentários de clientes nos projetos:** usar as frases do cliente do living ("Nosso ambiente mais aconchegante! Da idéia a realização!", com a grafia original) e da cliente da farmhouse? Elas são públicas, mas não são avaliações formais.
5. **Projetos executados sem foto** (Cordis e T|B): manter a frase "A obra já foi executada; as fotos dela ainda não estão no site", ou pedir as fotos antes de publicar.
6. **Prazos (FAQ 2):** a Amanda passa prazos de referência de projeto e de obra, ou a resposta fica sem número?
7. **Projeto à distância (FAQ 5):** como funcionam as reuniões (videochamada? visitas?) para completar a resposta.
8. **Dados das equipes:** formação, CAU e papel formal de Amanda, Renata e Lara (e se a Lara é arquiteta formada ou estudante).
9. **Cidades e anos dos projetos sem marcação:** living e jantar, quarto e closet, cozinha farmhouse e banheiro. Se a Amanda informar, entram na ficha.
10. **Linha sobre IA no processo:** manter (discreta, como ela publicou) ou retirar.

---

## Conferência automática

`node --input-type=module -e "…acharTermosVetados…"` sobre este arquivo e os 9 `textoSite`: **0 termos vetados** (resultado registrado no relatório da sessão 5).
