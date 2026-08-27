// Henter besøgstal fra Vercel Web Analytics (server-side).
//
// Bruges kun på /statistik-siden, som er server-renderet og caches i ~8 timer
// (se Cache-Control i statistik.astro). Derfor rammes Vercels API kun nogle få
// gange i døgnet. Tokenet læses fra en miljøvariabel på serveren og sendes
// ALDRIG til browseren.
//
// Kræver miljøvariablen VERCEL_TOKEN (sæt den i Vercel → Project → Settings →
// Environment Variables). Team- og projekt-id er ikke hemmelige og kan stå her.

const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_OdQQR8eAX6JkbWsABToVEndh';
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_AzEzdiT76wwTfXQRWgZ449Gcz68K';
const RANGE_DAYS = 30;

export interface StatEntry { path: string; views: number; }
export interface DeviceEntry { type: string; share: number; }
export interface Stats {
  updated: string;
  rangeDays: number;
  collecting: boolean;
  visitors: number;
  pageviews: number;
  topPages: StatEntry[];
  topActivities: StatEntry[];
  devices: DeviceEntry[];
}

const DEVICE_LABELS: Record<string, string> = {
  mobile: 'Telefon',
  desktop: 'Computer',
  tablet: 'Tablet',
  wearable: 'Ur',
  console: 'Spilkonsol',
  smarttv: 'Smart-tv',
};

const stripSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
const ymd = (d: Date) => d.toISOString().slice(0, 10);

async function q(path: string, params: Record<string, string>, token: string) {
  const url = new URL(`https://api.vercel.com/v1/query/web-analytics/${path}`);
  url.searchParams.set('teamId', TEAM_ID);
  url.searchParams.set('projectId', PROJECT_ID);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Vercel analytics ${path}: ${res.status}`);
  return (await res.json()).data;
}

// Returnerer besøgstal, eller null hvis der ikke er token / data endnu / API-fejl.
export async function getStats(): Promise<Stats | null> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return null;

  const until = new Date();
  const since = new Date(until.getTime() - RANGE_DAYS * 86_400_000);
  const range = { since: ymd(since), until: ymd(until) };

  try {
    const [count, byPath, byDevice] = await Promise.all([
      q('visits/count', range, token),
      q('visits/aggregate', { ...range, by: 'requestPath', limit: '50' }, token),
      q('visits/aggregate', { ...range, by: 'deviceType', limit: '6' }, token),
    ]);

    const pages: StatEntry[] = (byPath ?? [])
      .map((r: any) => ({ path: stripSlash(r.requestPath ?? ''), views: r.pageviews ?? 0 }))
      .filter((r: StatEntry) => r.path)
      .sort((a: StatEntry, b: StatEntry) => b.views - a.views);

    const topPages = pages.slice(0, 10);
    const topActivities = pages
      .filter((r) => r.path.startsWith('/aktiviteter/') && r.path !== '/aktiviteter')
      .slice(0, 10);

    const devRows = (byDevice ?? []).map((r: any) => ({
      type: DEVICE_LABELS[String(r.deviceType ?? '').toLowerCase()] ?? (r.deviceType || 'Andet'),
      views: r.pageviews ?? 0,
    }));
    const devTotal = devRows.reduce((s: number, r: any) => s + r.views, 0) || 1;
    const devices: DeviceEntry[] = devRows
      .sort((a: any, b: any) => b.views - a.views)
      .map((r: any) => ({ type: r.type, share: Math.round((r.views / devTotal) * 100) }));

    return {
      updated: ymd(until),
      rangeDays: RANGE_DAYS,
      collecting: true,
      visitors: count?.visitors ?? 0,
      pageviews: count?.pageviews ?? 0,
      topPages,
      topActivities,
      devices,
    };
  } catch (err) {
    console.error('[statistik] kunne ikke hente besøgstal:', err);
    return null;
  }
}
