import { z, defineCollection } from 'astro:content';

const storiesCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    links: z.array(z.string()).optional()
  }),
});

const poetryCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    theme: z.array(z.string()).optional() // TODO: add enum
  }),
});

export const collections = {
  'stories': storiesCollection,
  'poetry': poetryCollection
};