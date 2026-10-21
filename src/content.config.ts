import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projetoSchema } from './config/projeto-schema.ts';

const projetos = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projetos' }),
  schema: projetoSchema,
});

export const collections = { projetos };
