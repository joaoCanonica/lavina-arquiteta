// Travas e pendências. Função pura: usada por scripts/validate-config.mjs,
// scripts/test-config.mjs e pela rota _pendencias.
//
// Produção falha SÓ por: WhatsApp ausente; imagem sem natureza; projeto sem autoria;
// mídia "não usar" referenciada. O resto (CAU, e-mail, textos...) é pendência.
import { avisoValidadeGoogle } from './avaliacoes.ts';
import type { Modo } from './modo.ts';
import type { Projeto } from './projeto-schema.ts';
import { ehCampo, type Campo, type Estado } from './tipos.ts';

export type RegistroMidia = {
  id: string;
  natureza: string;
  rotulo: string;
  publicavel: boolean;
  projeto?: string | null;
};
export type Manifesto = { registros: RegistroMidia[] };
export type ParInfo = { id: string; aceito: boolean; a: { numero: string }; b: { numero: string } };

export type CodigoTrava =
  'whatsapp-ausente' | 'imagem-sem-natureza' | 'projeto-sem-autoria' | 'midia-nao-usar';
export type Falha = { codigo: CodigoTrava; onde: string; detalhe: string };
export type Pendencia = {
  onde: string;
  estado: Estado | 'projeto';
  rotulo: string;
  motivo: string;
};
export type Resultado = { modo: Modo; ok: boolean; falhas: Falha[]; pendencias: Pendencia[] };

const NATUREZAS_IMAGEM = ['render', 'executado', 'antes', 'depois', 'retrato', 'video'];

// Percorre a config e coleta campos em aviso/bloqueante.
function coletarCampos(no: unknown, caminho: string, saida: Pendencia[]): void {
  if (ehCampo(no)) {
    const c = no as Campo<unknown>;
    if (c.estado === 'aviso')
      saida.push({ onde: caminho, estado: 'aviso', rotulo: c.rotulo, motivo: c.motivo });
    if (c.estado === 'bloqueante')
      saida.push({
        onde: caminho,
        estado: 'bloqueante',
        rotulo: c.rotulo,
        motivo: 'campo obrigatório ausente',
      });
    return;
  }
  if (Array.isArray(no)) {
    no.forEach((item, i) => {
      const id =
        typeof item === 'object' && item && 'id' in item
          ? String((item as { id: unknown }).id)
          : String(i);
      coletarCampos(item, `${caminho}[${id}]`, saida);
    });
  } else if (typeof no === 'object' && no !== null) {
    for (const [k, v] of Object.entries(no))
      coletarCampos(v, caminho ? `${caminho}.${k}` : k, saida);
  }
}

type Entrada = {
  config: { contato: { whatsapp: Campo<string> } } & Record<string, unknown>;
  projetos: Projeto[];
  manifesto: Manifesto;
  pares: { pares: ParInfo[] };
  modo: Modo;
  hoje?: Date;
};

export function verificar({ config, projetos, manifesto, pares, modo, hoje }: Entrada): Resultado {
  const falhas: Falha[] = [];
  const pendencias: Pendencia[] = [];
  const midia = new Map(manifesto.registros.map((r) => [r.id, r]));
  const paresPorId = new Map(pares.pares.map((p) => [p.id, p]));

  // 1. Campos da config.
  coletarCampos(config, '', pendencias);
  const google = avisoValidadeGoogle(hoje);
  if (google)
    pendencias.push({
      onde: 'avaliacoes.google.conferidoEm',
      estado: 'aviso',
      rotulo: google.rotulo,
      motivo: google.motivo,
    });

  // Trava 1: WhatsApp.
  const wa = config.contato.whatsapp;
  if (wa.estado !== 'confirmado' || !/^\d{12,13}$/.test(String(wa.valor ?? ''))) {
    falhas.push({
      codigo: 'whatsapp-ausente',
      onde: 'contato.whatsapp',
      detalhe: 'WhatsApp de orçamento ausente ou inválido',
    });
  }

  // Mídia referenciada pela config (retratos).
  const refsConfig: [string, string][] = [];
  const pessoas = (config['pessoas'] ?? []) as { id: string; retrato?: Campo<string> }[];
  for (const p of pessoas)
    if (p.retrato?.valor) refsConfig.push([`pessoas[${p.id}].retrato`, p.retrato.valor]);

  const conferirRef = (onde: string, id: string, exigeNatureza: boolean) => {
    const r = midia.get(id);
    if (!r) {
      falhas.push({
        codigo: 'imagem-sem-natureza',
        onde,
        detalhe: `mídia "${id}" não existe no manifesto (sem natureza)`,
      });
      return;
    }
    // Trava 4: mídia "não usar".
    if (!r.publicavel || r.natureza === 'nao-usar' || r.natureza === 'documentacao') {
      falhas.push({
        codigo: 'midia-nao-usar',
        onde,
        detalhe: `mídia "${id}" está marcada como não publicável (${r.natureza})`,
      });
    }
    // Trava 2: imagem sem natureza (ou sem rótulo visível).
    if (exigeNatureza && (!NATUREZAS_IMAGEM.includes(r.natureza) || !r.rotulo?.trim())) {
      falhas.push({
        codigo: 'imagem-sem-natureza',
        onde,
        detalhe: `mídia "${id}" sem natureza/rótulo válido (natureza "${r.natureza}")`,
      });
    }
  };
  for (const [onde, id] of refsConfig) conferirRef(onde, id, true);

  // 2. Projetos.
  for (const p of projetos) {
    const onde = `projetos[${p.slug}]`;
    // Trava 3: autoria.
    if (!p.autoriaProjeto.trim()) {
      falhas.push({
        codigo: 'projeto-sem-autoria',
        onde: `${onde}.autoriaProjeto`,
        detalhe: `projeto "${p.slug}" sem autoria do projeto`,
      });
    }
    for (const id of p.midia) conferirRef(`${onde}.midia`, id, true);
    for (const id of p.videos) conferirRef(`${onde}.videos`, id, true);
    for (const parId of p.pares) {
      const par = paresPorId.get(parId);
      if (!par || !par.aceito) {
        falhas.push({
          codigo: 'imagem-sem-natureza',
          onde: `${onde}.pares`,
          detalhe: `par "${parId}" inexistente ou rejeitado`,
        });
      }
    }

    // Pendências do projeto (não travam).
    const pend = (rotulo: string, motivo: string) =>
      pendencias.push({ onde, estado: 'projeto', rotulo, motivo });
    if (!p.textoSite.trim())
      pend(
        `Texto de "${p.titulo}"`,
        'textoSite vazio (sessão 5); aparece com selo PROVISÓRIO no preview',
      );
    if (p.cidade === null) pend(`Cidade de "${p.titulo}"`, 'não informada; o campo não aparece');
    if (p.ano === null) pend(`Ano de "${p.titulo}"`, 'não informado; o campo não aparece');
    for (const a of p.autoriaImagens) {
      if (a.autor === null)
        pend(`Autoria das imagens (${a.tipo}) de "${p.titulo}"`, 'a confirmar com o João');
    }
    for (const slug of p.proximosProjetos) {
      if (!projetos.some((x) => x.slug === slug))
        pend(`Próximo projeto de "${p.titulo}"`, `"${slug}" não existe`);
    }
  }

  return { modo, ok: modo === 'preview' ? true : falhas.length === 0, falhas, pendencias };
}

// Projetos visíveis: no preview TODOS aparecem (os incompletos com selo); nada some.
export function projetosVisiveis(
  projetos: Projeto[],
  modo: Modo,
): (Projeto & { provisorio: boolean })[] {
  return [...projetos]
    .sort((a, b) => b.destaque - a.destaque || a.titulo.localeCompare(b.titulo, 'pt-BR'))
    .map((p) => ({
      ...p,
      provisorio:
        modo === 'preview' &&
        (!p.textoSite.trim() || p.autoriaImagens.some((a) => a.autor === null)),
    }));
}
