import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const storiesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    links: z.array(z.string()).optional()
  }),
});

const poetryCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/poetry' }),
  schema: z.object({
    title: z.string(),
    theme: z.string().optional() // TODO: add enum
  }),
});

export const collections = {
  'stories': storiesCollection,
  'poetry': poetryCollection
};
