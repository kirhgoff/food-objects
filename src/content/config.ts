import { z, defineCollection } from 'astro:content';

const storiesCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    links: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  'stories': storiesCollection
};