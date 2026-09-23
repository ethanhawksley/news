import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  url: z.url(),
  title: z.string(),
  domain: z.string(),
  comments: z.url(),
});

export type Post = z.infer<typeof postSchema>;

const days = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/days' }),
  schema: z.object({
    date: z.string(),
    hn: z.array(postSchema),
    lobsters: z.array(postSchema),
  }),
});

export const collections = { days };
