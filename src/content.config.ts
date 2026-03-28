import { defineCollection, z } from 'astro:content';

const nullableString = z.string().nullish().transform((value) => value ?? '');

const projects = defineCollection({
  type: 'content',
  schema: z
    .object({
      name: z.string(),
      uniqueID: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      category: z.string(),
      platform: z.string(),
      date: z.union([z.string(), z.date()]),
      url: nullableString.optional(),
      image: z.string(),
      image_small: nullableString.optional(),
      gifs: z.array(z.any()).optional().default([]),
      videos: z.array(z.array(z.any())).optional().default([]),
      features: z.boolean().optional().default(false),
      moreimages: z.boolean().optional().default(false),
      featurelist: z.array(z.any()).optional().default([]),
      linklist: z.array(z.string()).optional().default([]),
      content: nullableString.optional(),
      htmlenable: z.boolean().optional().default(false),
      htmlcontent: nullableString.optional().default(''),
      type: nullableString.optional(),
      gumroadlink: nullableString.optional(),
    })
    .passthrough(),
});

export const collections = {
  projects,
};
