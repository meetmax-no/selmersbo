// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://selmersbo.dk',
  // Static by default. The Vercel adapter lets a few routes run on-demand
  // (the CMS OAuth endpoints under /api/oauth) via `export const prerender = false`.
  output: 'static',
  adapter: vercel(),
});
