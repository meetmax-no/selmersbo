import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Icons an editor can pick for an activity (must exist in Icon.astro).
export const ACTIVITY_ICONS = [
  'music', 'heart', 'cards', 'device', 'mic', 'thread', 'plate', 'bus', 'users', 'calendar',
] as const;

// Udflugter (excursions) – edited through the CMS at /admin.
const udflugter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/udflugter' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // ISO date, formatted to Danish on the page
    departure: z.string().optional(),
    returnTime: z.string().optional(),
    price: z.string().optional(),
    summary: z.string(),
    image: z.string().optional(), // public path, e.g. /images/udflugter/tur.jpg
    signupUrl: z.string().optional(),
    soldOut: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Nyheder (news) – shown on the front page and on /nyheder.
const nyheder = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nyheder' }),
  schema: z.object({
    title: z.string(),
    tag: z.string().default('Nyt'),
    date: z.coerce.date(),
    summary: z.string(),
    cta: z.string().default('Læs mere'),
    url: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Aktiviteter (activities) – shown on the front page and on /aktiviteter.
const aktiviteter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aktiviteter' }),
  schema: z.object({
    title: z.string(),
    icon: z.enum(ACTIVITY_ICONS).default('users'),
    day: z.string(),
    text: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

// Udlejning (rental) – a single editable page (one entry: index.md).
const priceRow = z.object({ label: z.string(), price: z.string() });
const udlejning = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/udlejning' }),
  schema: z.object({
    title: z.string().default('Udlejning'),
    lead: z.string(),
    conditions: z.array(z.object({ text: z.string() })).default([]),
    contactNote: z.string().default(''),
    priceHeading: z.string().default(''),
    prices: z.array(priceRow).default([]),
    recurringHeading: z.string().default(''),
    recurringPrices: z.array(priceRow).default([]),
    extraHeading: z.string().default(''),
    extraPrices: z.array(priceRow).default([]),
  }),
});

export const collections = { udflugter, nyheder, aktiviteter, udlejning };
