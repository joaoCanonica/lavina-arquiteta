# Conformidade (auditoria automática)

Gerado por `pnpm audit-compliance` (modo preview) sobre `dist/`. Não edite à mão.

- Páginas lidas: 18
- Mídias de projeto conferidas: 135
- Termos vetados encontrados: 0
- Mídias sem rótulo de natureza: 0
- Resultado: **ok**

## Termos vetados

Nenhum.

## Rótulo de natureza das mídias de projeto

Nenhum problema.

## O que esta auditoria ainda não cobre

- Conferência de normas (CAU, direito autoral, CDC, LGPD): passada única na sessão 9.
- Texto queimado em vídeo (ex.: "o melhor" na legenda de `apresentacao-principal.mp4`): ver `docs/PENDENCIAS.md`.

## Privacidade e segurança (sessão 7)

Testado por `pnpm test:consentimento` (dist/ servido com os cabeçalhos do `vercel.json`):

- zero requisição de terceiros antes do aceite, em todas as rotas, a 390 e 1440 px (lista em `docs/capturas/consentimento/rede-antes-do-aceite.json`);
- Aceitar, Recusar e Personalizar com o mesmo estilo calculado (fonte, cor, borda, tamanho);
- CSP por hash (`scripts/gerar-csp.mjs`) sem violação no console, antes e depois do aceite;
- Instagram só como link; nenhum script da Meta; mapa do Google só depois do consentimento "mapas".

### Decisões humanas

- [DECISÃO HUMANA: revisão jurídica] `/privacidade` (política de privacidade e de cookies): bases legais, prazos de retenção, transferência internacional e redação final. Escrita pelo Code a partir da LGPD; não substitui revisão de advogado.
- [DECISÃO HUMANA: revisão jurídica] Encarregado (DPO): a política não nomeia encarregado e oferece canal direto (WhatsApp e endereço). Confirmar se a empresa se enquadra como agente de pequeno porte (Res. CD/ANPD nº 2/2022) ou indicar o encarregado.
- [DECISÃO HUMANA: revisão jurídica] Registros de acesso: a política cita o prazo do Marco Civil da Internet (Lei 12.965/2014, art. 15) "quando a lei exigir". Confirmar se se aplica e quem guarda (Vercel).
- [NÃO VERIFICADO] Como o Vercel Web Analytics trata os dados (cookies, identificação, retenção): a documentação da Vercel estava inacessível neste ambiente (bloqueio de rede). O texto do site diz só "de forma agregada". Conferir antes de ativar a estatística no painel da Vercel.
- [DECISÃO HUMANA] E-mail de contato para o titular exercer direitos: ausente na config (aparece PROVISÓRIO no preview).
