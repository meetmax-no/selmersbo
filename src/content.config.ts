import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Icons an editor can pick for an activity (must exist in Icon.astro).
export const ACTIVITY_ICONS = [
  'music', 'heart', 'cards', 'device', 'mic', 'thread', 'plate', 'bus', 'users', 'calendar',
  'book', 'brush', 'film', 'coffee', 'dumbbell', 'chat',
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
// Everything is shown in full inline (no "read more" click). A pinned item is
// a standing notice ("fast besked") shown at the top; the rest are dated news.
const nyheder = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nyheder' }),
  schema: z.object({
    title: z.string(),
    tag: z.string().default('Nyt'),
    date: z.coerce.date(),
    summary: z.string().optional(), // short text for the front page
    image: z.string().optional(),
    order: z.number().default(0), // section order on /nyheder
    pinned: z.boolean().default(false), // "fast besked" → highlighted notice
    cta: z.string().default('Læs mere'),
    url: z.string().optional(), // only a real external link
    draft: z.boolean().default(false),
    // Markdown body = full text shown inline.
  }),
});

// Aktiviteter (activities) – shown on the front page and on /aktiviteter.
// Each card opens the full description (Markdown body) in a modal.
const aktiviteter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aktiviteter' }),
  schema: z.object({
    title: z.string(),
    icon: z.enum(ACTIVITY_ICONS).default('users'), // fallback when no image
    image: z.string().optional(), // public path, e.g. /uploads/akt-banko.jpg
    day: z.string(), // short schedule shown on the card
    text: z.string(), // short teaser (card + front page)
    status: z.string().optional(), // e.g. "Ingen ledige pladser"
    order: z.number().default(0),
    draft: z.boolean().default(false),
    // Markdown body = the full description shown in the modal / detail page.
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

// Nyhedsbreve (newsletters) – readable web content (Markdown body), opened
// in a modal on the list page. No PDF: better for seniors, mobile & a11y.
const nyhedsbreve = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nyhedsbreve' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Indstillinger (settings) – a single editable entry (index.md) with the
// contact info + opening hours that are shown all over the site. One place
// to edit → updates header, footer, front page, CTA, etc.
const indstillinger = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/indstillinger' }),
  schema: z.object({
    // Årstidspalet – styrer sidens farver (efterår er standard/varm).
    theme: z.enum(['efteraar', 'vinter', 'foraar', 'sommer']).default('efteraar'),
    name: z.string().default('Selmersbo'),
    full: z.string().default('Aktivhuset Selmersbo'),
    tagline: z.string().default('Aktivhuset i Hørsholm'),
    manager: z.string().default(''),
    address: z.object({
      street: z.string().default(''),
      zip: z.string().default(''),
      city: z.string().default(''),
      mapsUrl: z.string().default(''),
    }),
    phone: z.string().default(''),
    clinicPhone: z.string().default(''),
    email: z.string().default(''),
    facebook: z.string().default(''),
    hours: z.array(z.object({
      day: z.string(),
      time: z.string(),
      closed: z.boolean().default(false),
    })).default([]),
  }),
});

// Galleri (gallery) – list of photos with a caption.
const galleri = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galleri' }),
  schema: z.object({
    caption: z.string().optional(),
    image: z.string(), // public path, e.g. /uploads/foto.jpg
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { udflugter, nyheder, aktiviteter, udlejning, nyhedsbreve, galleri, indstillinger };
