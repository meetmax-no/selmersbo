import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Icons an editor can pick for an activity (must exist in Icon.astro).
export const ACTIVITY_ICONS = [
  'music', 'heart', 'cards', 'device', 'mic', 'thread', 'plate', 'bus', 'users', 'calendar',
  'book', 'brush', 'film', 'coffee', 'dumbbell', 'chat', 'health', 'yoga', 'activity',
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
    forside: z.boolean().default(false), // vis på forsiden (maks 6)
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

// Footer shortcut links ("Genveje") – default set, editable in the CMS.
export const DEFAULT_FOOTER_LINKS = [
  { label: 'Søg', url: '/soeg' },
  { label: 'Om os', url: '/om-os' },
  { label: 'MobilePay', url: '/mobilepay' },
  { label: 'Vedtægter', url: '/dokumenter/vedtaegter' },
  { label: 'Privatlivspolitik', url: '/dokumenter/privatlivspolitik' },
  { label: 'Facebook', url: 'https://www.facebook.com/groups/146686506050448' },
];

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
    mobilepay: z.string().default('95956'), // MobilePay-nummer

    hours: z.array(z.object({
      day: z.string(),
      time: z.string(),
      closed: z.boolean().default(false),
    })).default([]),
    // Footer-genveje – redigerbare i CMS. Falder tilbage til standardsættet.
    footerLinks: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).default(DEFAULT_FOOTER_LINKS),
  }),
});

// Forside – editable hero + welcome text (one entry: index.md).
const forside = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/forside' }),
  schema: z.object({
    heroEyebrow: z.string().default('Aktivhuset Selmersbo'),
    heroTitle: z.string(),
    heroLead: z.string(),
    heroImage: z.string().default('/images/community-flags.jpg'),
    heroImageAlt: z.string().default(''),
    heroBadge: z.string().default('Alt i ét plan – god tilgængelighed'),
    // Aktuelle genveje / links (fx seniorside, avisartikel, ekstern side).
    // Enten en uploadet fil (PDF – ligger på vores eget domæne, så
    // tilbage-knappen virker) ELLER en ekstern adresse (url). `file` vinder.
    highlightsHeading: z.string().default('Aktuelt at læse'),
    highlights: z.array(z.object({
      label: z.string(),
      note: z.string().optional(),
      file: z.string().optional(),
      url: z.string().optional(),
      icon: z.string().default('document'),
    }).refine((h) => !!(h.file || h.url), {
      message: 'Angiv enten en fil eller en adresse (url).',
    })).default([]),
    welcomeEyebrow: z.string().default('Velkommen'),
    welcomeTitle: z.string(),
    welcomeText: z.string(),
    welcomePoints: z.array(z.object({ text: z.string() })).default([]),
    welcomeImage: z.string().default('/images/koncert.jpg'),
    welcomeImageAlt: z.string().default(''),
    welcomeCaption: z.string().default(''),
  }),
});

// Om os – a single editable page: intro, daglig leder, bestyrelse, frivillige.
const omos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/omos' }),
  schema: z.object({
    title: z.string().default('Aktivhuset Selmersbo'),
    lead: z.string(),
    purpose: z.string(),
    leader: z.object({
      name: z.string(),
      role: z.string().default('Daglig leder'),
      image: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      mobile: z.string().optional(),
    }),
    board: z.array(z.object({
      name: z.string(),
      role: z.string(),
      image: z.string().optional(),
      phone: z.string().optional(),
      mobile: z.string().optional(),
    })).default([]),
    volunteersHeading: z.string().default('De frivillige'),
    volunteersText: z.string(),
    followHeading: z.string().default('Følg os'),
    followText: z.string(),
    facebookUrl: z.string().optional(),
    cvr: z.string().optional(),
  }),
});

// Dokumenter (legal/reference pages: vedtægter, privatlivspolitik) – long
// Markdown bodies, linked from the footer. One entry per file.
const dokumenter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dokumenter' }),
  schema: z.object({
    title: z.string(),
    updated: z.string().optional(), // e.g. "Oktober 2011"
    summary: z.string().optional(),
  }),
});

// Quiz – referater fra husets quizzer med vinderbilleder. Egen side,
// linket fra Quiz-aktiviteten. Redigeres i CMS (én post pr. quiz).
const quiz = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quiz' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    winners: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Generalforsamling – indkaldelser, beretninger og referater. Egne læsbare
// sider, listet på /generalforsamling. Redigeres i CMS (én post pr. dokument).
const generalforsamling = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/generalforsamling' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    summary: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
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

// Oppdateringer (changelog) – korte, daterede noter om ændringer på siden.
// Markdown-body = detaljerne. Vises på /oppdatering.
const oppdateringer = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/oppdateringer' }),
  schema: z.object({
    date: z.coerce.date(),
    version: z.string().optional(),
    title: z.string(),
    draft: z.boolean().default(false),
  }),
});

// Nyhedsflash – én vigtig besked der kan vises som popup, som banner øverst
// på siden, eller være slukket. Styres fra CMS.
const newsflash = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsflash' }),
  schema: z.object({
    status: z.enum(['off', 'banner', 'popup']).default('off'),
    heading: z.string().default('Vigtigt'),
    body: z.string(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
  }),
});

export const collections = { udflugter, nyheder, aktiviteter, udlejning, nyhedsbreve, galleri, indstillinger, omos, dokumenter, forside, quiz, generalforsamling, oppdateringer, newsflash };
