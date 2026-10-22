// Auditoria de conformidade (inicial) sobre o HTML gerado em dist/:
//  1. termos vetados (src/config/termos.ts) no texto visível, alt, title, aria-label e metas;
//  2. <img>/<video> de projeto (src em /media/, fora da marca) sem rótulo de natureza:
//     exige data-natureza válido E um [data-rotulo-natureza] visível com o texto do rótulo
//     no mesmo <figure> (ou no ancestral com data-midia).
// Gera docs/COMPLIANCE.md. Em produção (LAVINA_MODO=producao ou --producao) sai com 1 se houver achados.
// Uso: pnpm audit-compliance [--producao] [--dist <pasta>] [--saida <arquivo.md>]
import { existsSync, readdirSync, statSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { acharTermosVetados } from '../src/config/termos.ts';

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(nome);
  return i >= 0 ? process.argv[i + 1] : padrao;
};
const DIST = arg('--dist', 'dist');
const SAIDA = arg('--saida', 'docs/COMPLIANCE.md');
const modo =
  process.argv.includes('--producao') || process.env.LAVINA_MODO === 'producao'
    ? 'producao'
    : 'preview';

const ROTULOS = {
  render: 'Imagem 3D do projeto',
  executado: 'Obra executada',
  antes: 'Antes',
  depois: 'Depois',
  video: 'Vídeo',
  retrato: 'Retrato',
};

function htmls(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) return n === 'media' ? [] : htmls(p);
    return n.endsWith('.html') ? [p] : [];
  });
}

const ehMidiaDeProjeto = (el) => {
  const srcs = [el.getAttribute('src'), el.getAttribute('srcset'), el.getAttribute('poster')]
    .concat(
      el.querySelectorAll('source').map((s) => s.getAttribute('src') ?? s.getAttribute('srcset')),
    )
    .filter(Boolean)
    .join(' ');
  return (
    el.hasAttribute('data-projeto') || (/\/media\//.test(srcs) && !/\/media\/marca\//.test(srcs))
  );
};

const visivel = (el) => {
  for (let n = el; n && n.tagName; n = n.parentNode) {
    if (n.hasAttribute?.('hidden') || n.getAttribute?.('aria-hidden') === 'true') return false;
    const style = n.getAttribute?.('style') ?? '';
    if (/display\s*:\s*none|visibility\s*:\s*hidden/.test(style)) return false;
  }
  return true;
};

const achados = { termos: [], midia: [] };
let paginas = 0;
let midiasConferidas = 0;

for (const arquivo of htmls(DIST)) {
  paginas++;
  const rel = path.relative(DIST, arquivo);
  const raiz = parse(await readFile(arquivo, 'utf8'), { comment: false });
  for (const el of raiz.querySelectorAll('script, style, noscript, template')) el.remove();

  // 1. Termos vetados.
  const textos = [raiz.querySelector('body')?.textContent ?? ''];
  for (const el of raiz.querySelectorAll('[alt], [title], [aria-label]')) {
    textos.push(
      el.getAttribute('alt') ?? '',
      el.getAttribute('title') ?? '',
      el.getAttribute('aria-label') ?? '',
    );
  }
  for (const m of raiz.querySelectorAll('meta[content]')) {
    if (
      /description|og:|twitter:/.test(`${m.getAttribute('name')} ${m.getAttribute('property')}`)
    ) {
      textos.push(m.getAttribute('content') ?? '');
    }
  }
  textos.push(raiz.querySelector('title')?.textContent ?? '');
  for (const a of acharTermosVetados(textos.join('\n'))) achados.termos.push({ pagina: rel, ...a });

  // 2. Rótulo de natureza.
  for (const el of raiz.querySelectorAll('img, video')) {
    if (!ehMidiaDeProjeto(el)) continue;
    midiasConferidas++;
    const src =
      el.getAttribute('src') ??
      el.getAttribute('poster') ??
      el.querySelector('source')?.getAttribute('src') ??
      '?';
    const natureza =
      el.getAttribute('data-natureza') ??
      el.closest('[data-natureza]')?.getAttribute('data-natureza');
    if (!natureza || !ROTULOS[natureza]) {
      achados.midia.push({
        pagina: rel,
        src,
        problema: `sem data-natureza válido (${natureza ?? 'ausente'})`,
      });
      continue;
    }
    const caixa = el.closest('[data-midia]') ?? el.closest('figure');
    const rotulos = caixa?.querySelectorAll('[data-rotulo-natureza]') ?? [];
    const rotulo = rotulos.find((r) => r.getAttribute('data-natureza') === natureza) ?? rotulos[0];
    const texto = rotulo?.textContent.trim() ?? '';
    if (!rotulo || !visivel(rotulo) || !texto) {
      achados.midia.push({
        pagina: rel,
        src,
        problema: 'sem rótulo de natureza visível no mesmo <figure>',
      });
    } else if (
      !texto.toLocaleLowerCase('pt-BR').includes(ROTULOS[natureza].toLocaleLowerCase('pt-BR'))
    ) {
      achados.midia.push({
        pagina: rel,
        src,
        problema: `rótulo "${texto}" não corresponde à natureza "${natureza}" ("${ROTULOS[natureza]}")`,
      });
    }
  }
}

const total = achados.termos.length + achados.midia.length;
const linhas = [
  '# Conformidade (auditoria automática)',
  '',
  `Gerado por \`pnpm audit-compliance\` (modo ${modo}) sobre \`${DIST}/\`. Não edite à mão.`,
  '',
  `- Páginas lidas: ${paginas}`,
  `- Mídias de projeto conferidas: ${midiasConferidas}`,
  `- Termos vetados encontrados: ${achados.termos.length}`,
  `- Mídias sem rótulo de natureza: ${achados.midia.length}`,
  `- Resultado: ${total ? (modo === 'producao' ? '**TRAVADO**' : '**achados (travariam a produção)**') : '**ok**'}`,
  '',
  '## Termos vetados',
  '',
  achados.termos.length
    ? achados.termos.map((t) => `- \`${t.pagina}\`: "${t.termo}" em "…${t.trecho}…"`).join('\n')
    : 'Nenhum.',
  '',
  '## Rótulo de natureza das mídias de projeto',
  '',
  achados.midia.length
    ? achados.midia.map((m) => `- \`${m.pagina}\`: \`${m.src}\` — ${m.problema}`).join('\n')
    : 'Nenhum problema.',
  '',
  '## O que esta auditoria ainda não cobre',
  '',
  '- Conferência de normas (CAU, direito autoral, CDC, LGPD): passada única na sessão 9.',
  '- Texto queimado em vídeo (ex.: "o melhor" na legenda de `apresentacao-principal.mp4`): ver `docs/PENDENCIAS.md`.',
  '',
  '## Privacidade e segurança (sessão 7)',
  '',
  'Testado por `pnpm test:consentimento` (dist/ servido com os cabeçalhos do `vercel.json`):',
  '',
  '- zero requisição de terceiros antes do aceite, em todas as rotas, a 390 e 1440 px (lista em `docs/capturas/consentimento/rede-antes-do-aceite.json`);',
  '- Aceitar, Recusar e Personalizar com o mesmo estilo calculado (fonte, cor, borda, tamanho);',
  '- CSP por hash (`scripts/gerar-csp.mjs`) sem violação no console, antes e depois do aceite;',
  '- Instagram só como link; nenhum script da Meta; mapa do Google só depois do consentimento "mapas".',
  '',
  '### Decisões humanas',
  '',
  '- [DECISÃO HUMANA: revisão jurídica] `/privacidade` (política de privacidade e de cookies): bases legais, prazos de retenção, transferência internacional e redação final. Escrita pelo Code a partir da LGPD; não substitui revisão de advogado.',
  '- [DECISÃO HUMANA: revisão jurídica] Encarregado (DPO): a política não nomeia encarregado e oferece canal direto (WhatsApp e endereço). Confirmar se a empresa se enquadra como agente de pequeno porte (Res. CD/ANPD nº 2/2022) ou indicar o encarregado.',
  '- [DECISÃO HUMANA: revisão jurídica] Registros de acesso: a política cita o prazo do Marco Civil da Internet (Lei 12.965/2014, art. 15) "quando a lei exigir". Confirmar se se aplica e quem guarda (Vercel).',
  '- [NÃO VERIFICADO] Como o Vercel Web Analytics trata os dados (cookies, identificação, retenção): a documentação da Vercel estava inacessível neste ambiente (bloqueio de rede). O texto do site diz só "de forma agregada". Conferir antes de ativar a estatística no painel da Vercel.',
  '- [DECISÃO HUMANA] E-mail de contato para o titular exercer direitos: ausente na config (aparece PROVISÓRIO no preview).',
  '',
];
await writeFile(SAIDA, linhas.join('\n'));
console.log(
  `audit-compliance [${modo}]: ${paginas} páginas, ${midiasConferidas} mídias, ${achados.termos.length} termos, ${achados.midia.length} sem rótulo → ${SAIDA}`,
);
if (paginas === 0) console.warn(`! nenhuma página em ${DIST}/ (rode o build antes)`);
if (total && modo === 'producao') process.exit(1);
