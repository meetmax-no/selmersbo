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
  integrations: [sitemap({
    // Hold /admin og API-endpoints ude af sitemap.
    filter: (page) => !page.includes('/admin') && !page.includes('/api/'),
  })],
});
