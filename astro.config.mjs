// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://selmersbo.dk',
  // Static by default. The Vercel adapter lets a few routes run on-demand
  // (the CMS OAuth endpoints under /api/oauth) via `export const prerender = false`.
  output: 'static',
  adapter: vercel(),
  // Gamle Bricksite-URL'er → nye stier (301, permanent).
  redirects: {
    '/mobile-pay': { status: 301, destination: '/mobilepay' },
  },
  integrations: [sitemap({
    // Hold /admin, API-endpoints og den interne statistik-side ude af sitemap.
    filter: (page) => !page.includes('/admin') && !page.includes('/api/') && !page.includes('/statistik') && !page.includes('/oppdatering'),
  })],
});
