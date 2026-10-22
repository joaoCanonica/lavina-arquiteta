# Deploy

Hospedagem: **Vercel**, projeto `lavina-arquiteta` no time "Joao Canonica's projects", ligado ao repositório `joaocanonica/lavina-arquiteta` no GitHub.

## 1. Preview (no ar desde a sessão 9)

- **URL:** ver a seção "Preview atual", no fim deste arquivo.
- **Modo:** preview (`LAVINA_MODO` não definido). Isso significa:
  - faixa "em revisão" e selo PROVISÓRIO;
  - `noindex` em todas as páginas;
  - robots.txt `Disallow: /`.
- **Proteção da Vercel:** depende da configuração do time. Se a URL pedir login, o João libera um link de compartilhamento em Settings → Deployment Protection.
- **Build na Vercel:** `pnpm build` = `media:prepare` + `astro build` + `gerar-csp --verificar`.
  - **Mídia:** a Vercel não tem ffmpeg; o `ffmpeg-static` (devDependency, liberado em `pnpm-workspace.yaml → allowBuilds`) traz o binário. Com a variável `VERCEL` presente, a mídia sai em **modo rápido** (AVIF esforço 1, VP9 em tempo real), para caber no tempo de build: 7 min medidos do zero contra 45 min de limite. Os arquivos ficam cerca de 19% maiores que os gerados localmente (212 MB contra 178 MB no total).
  - **Node 24.x** e **pnpm 12.14.0** (`packageManager`, via Corepack: variável `ENABLE_EXPERIMENTAL_COREPACK=1` no projeto).
- **Cabeçalhos:** `vercel.json`, gerado por `pnpm csp`, traz:
  - CSP por hash, Referrer-Policy, Permissions-Policy, nosniff, X-Frame-Options, COOP;
  - HSTS sem `preload`.

  O `postbuild` reprova o build se a CSP estiver desatualizada.

## 2. Como plugar `coletivoarquiteturalavina.com.br`

1. **Registrar o domínio** (Registro.br), se ainda não estiver registrado.
2. **Na Vercel:** Project → Settings → Domains → Add: `coletivoarquiteturalavina.com.br` e `www.coletivoarquiteturalavina.com.br`. Redirecionar o `www` para o domínio sem `www`, ou o contrário; escolher um só.
3. **No DNS (Registro.br ou o provedor do DNS):** criar os registros que o painel da Vercel mostrar. Normalmente:
   - um registro **A** para o domínio raiz;
   - um **CNAME** para o `www`.

   Usar exatamente os valores do painel, que podem ser específicos do projeto. Esperar o certificado HTTPS ficar ativo.
4. **Trocar o `SITE_URL`:**
   - em Project → Settings → Environment Variables (ambiente **Production**), criar `SITE_URL = https://coletivoarquiteturalavina.com.br`, sem barra no fim;
   - se o domínio final for outro, este é o único lugar a mudar: canonical, Open Graph, sitemap e JSON-LD saem dele (`src/config/seo.ts`).
5. **Confirmar o domínio na config (Prompt D):** em `src/config/seo.ts`, o campo `dominio` passa de `aviso` para `confirmado`, com a fonte (registro e data).

## 3. Produção (só depois do domínio e das travas verdes)

Ordem obrigatória:

1. **Domínio** no ar e confirmado na config (seção 2).
2. **Travas locais verdes:**
   ```bash
   pnpm validate-config --producao      # sai 1 se houver trava (WhatsApp ausente etc.)
   LAVINA_MODO=producao pnpm build
   pnpm audit-compliance --producao     # sai 1 com termo vetado, mídia sem rótulo
   LAVINA_MODO=producao pnpm audit-seo  # passa a exigir indexação liberada e robots com sitemap
   ```
   Ou tudo junto: `pnpm build:producao`.
3. **Decisões humanas resolvidas:** os bloqueios da tabela de `docs/COMPLIANCE.md`, em especial o CAU (responsável técnico e registro) e a revisão jurídica da `/privacidade`.
4. **Variáveis do ambiente Production na Vercel:** `LAVINA_MODO = producao` e `SITE_URL`.
5. **Deploy de produção:** merge do branch no `main` (branch de produção do projeto) ou "Promote to Production" no deployment de preview aprovado. Depois:
   - conferir `/robots.txt`: liberado, com `Sitemap:`;
   - conferir o `<meta name="robots">`: ausente;
   - enviar o sitemap no Search Console.
6. **Estatística:** ativar o Web Analytics no painel da Vercel (Project → Analytics), só se a decisão de usar a estatística estiver mantida.
7. **HSTS preload:** decidir depois de algumas semanas com o domínio estável. Se sim, acrescentar `preload` ao cabeçalho em `scripts/gerar-csp.mjs`, rodar `pnpm csp` e inscrever o domínio em hstspreload.org.

## 4. Depois de mudar código

- Mudou script ou CSS inline: `pnpm csp` e versionar o `vercel.json`. Sem isso, o build da Vercel falha de propósito.
- Mídia nova: Prompt L (`media-originais/` + manifesto). O build da Vercel gera os derivados.

## Preview atual

(preenchido no fim da sessão 9)
