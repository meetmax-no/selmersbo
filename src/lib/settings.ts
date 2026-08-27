// Site settings (contact + opening hours) – edited in the CMS under
// "Indstillinger" (src/content/indstillinger/index.md).
//
// getSettings() returns the SAME shape as the old hardcoded `site` object, so
// pages/components just swap `import { site }` for `const site = await getSettings()`
// and keep every `site.foo` reference. If the entry is ever missing, we fall
// back to the hardcoded values in src/data/site.ts.
import { getEntry } from 'astro:content';
import { site as fallback } from '../data/site';

export type Settings = typeof fallback;

export async function getSettings(): Promise<Settings> {
  const entry = await getEntry('indstillinger', 'index');
  if (!entry) return fallback;
  // Schema guarantees the fields exist; merge over the fallback for safety.
  return { ...fallback, ...entry.data } as Settings;
}
