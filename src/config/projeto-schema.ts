import { z } from 'astro/zod';

// Schema da coleção "projetos" (src/content/projetos/*.json). Compartilhado com
// src/content.config.ts e com os scripts (validate-config, test-config).
// Regra: nada inventado. Cidade e ano ausentes ficam null e não aparecem.

const id = z.string().regex(/^[a-z0-9-]+$/);
const urlInstagram = z
  .string()
  .regex(/^https:\/\/www\.instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/$/);

export const projetoSchema = z.object({
  slug: id,
  titulo: z.string().min(3),
  codigo: z.string().nullable(), // ex.: "J|C" (iniciais dos clientes como código; nunca nome)
  tipo: z.enum(['residencial', 'saude-comercial']),
  cidade: z.string().nullable(),
  cidadeFonte: z.string().nullable(),
  ano: z.number().int().min(2015).max(2100).nullable(),
  natureza: z.enum(['executado', 'render', 'misto']),
  destaque: z.number().int().min(0), // 0 = fora dos destaques; maior = mais destaque
  autoriaProjeto: z.string(), // vazio = projeto sem autoria → trava de produção
  autoriaImagens: z.array(
    z.object({
      tipo: z.enum(['render', 'foto', 'video']),
      autor: z.string().nullable(), // null = a confirmar (aviso)
    }),
  ),
  creditosExecucao: z.array(z.object({ funcao: z.string(), nome: z.string().min(1) })),
  legendaLiteral: z.array(z.object({ post: z.string().min(8), texto: z.string().min(1) })),
  textoSite: z.string(), // vazio até a sessão 5 → selo PROVISÓRIO no preview
  midia: z.array(id), // ids de media.manifest.json
  pares: z.array(id), // ids de docs/dados/pares.json
  videos: z.array(id), // ids de vídeo do manifesto
  instagram: z.array(urlInstagram).min(1),
  proximosProjetos: z.array(id),
});

export type Projeto = z.infer<typeof projetoSchema>;
