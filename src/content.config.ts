import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Udflugter (excursions) – edited through the CMS at /admin.
// Each entry is a Markdown file in src/content/udflugter/.
// Images are uploaded by the CMS into public/images/udflugter and
// referenced by their public path (e.g. /images/udflugter/foo.jpg).
const udflugter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/udflugter' }),
  schema: z.object({
    title: z.string(),
    // ISO date (YYYY-MM-DD) – formatted to Danish on the page.
    date: z.coerce.date(),
    departure: z.string().optional(), // fx "10.00 fra Selmersbo"
    returnTime: z.string().optional(), // fx "ca. 15.00"
    price: z.string().optional(), // fx "250 kr."
    summary: z.string(),
    image: z.string().optional(), // public path, e.g. /images/udflugter/tur.jpg
    signupUrl: z.string().optional(),
    soldOut: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { udflugter };
