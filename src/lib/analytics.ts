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
  topExcursions: StatEntry[];
  topLetters: StatEntry[];
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

// Ét kald. Returnerer data-arrayet/objektet, eller null ved fejl (kaster ikke,
// så ét fejlende kald ikke tømmer hele siden).
async function q(path: string, params: Record<string, string>, token: string): Promise<any> {
  const url = new URL(`https://api.vercel.com/v1/query/web-analytics/${path}`);
  url.searchParams.set('teamId', TEAM_ID);
  url.searchParams.set('projectId', PROJECT_ID);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { console.error(`[statistik] ${path} → HTTP ${res.status}`); return null; }
    return (await res.json()).data;
  } catch (err) {
    console.error(`[statistik] ${path} fejlede:`, err);
    return null;
  }
}

// Returnerer besøgstal, eller null hvis der hverken er token eller data endnu.
export async function getStats(): Promise<Stats | null> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return null;

  const nowMs = Date.now();
  const dayMs = 86_400_000;
  // De to endpoints fortolker datoer forskelligt:
  //  - count er gladest for dato-strenge (og medtager hele slutdagen).
  //  - aggregate KRÆVER ms-tidsstempler; en dato-streng afskæres til kl. 01:00
  //    i projektets tidszone og udelader dermed dagens besøg (→ tomme lister).
  const dateRange = { since: ymd(new Date(nowMs - RANGE_DAYS * dayMs)), until: ymd(new Date(nowMs + dayMs)) };
  const msRange = { since: String(nowMs - RANGE_DAYS * dayMs), until: String(nowMs) };

  // Hjælper til "åbnet"-events (modaler for aktiviteter, udflugter, nyhedsbreve).
  const openEvents = (name: string) =>
    q('events/aggregate', { ...msRange, by: 'eventData/navn', limit: '10', filter: `eventName eq '${name}'` }, token);

  const [count, byPath, byDevice, byActivity, byExcursion, byLetter] = await Promise.all([
    q('visits/count', dateRange, token),
    q('visits/aggregate', { ...msRange, by: 'requestPath', limit: '50' }, token),
    q('visits/aggregate', { ...msRange, by: 'deviceType', limit: '6' }, token),
    // Custom events med { navn } – tingene vises i en modal, ikke som egen side.
    openEvents('Aktivitet åbnet'),
    openEvents('Udflugt åbnet'),
    openEvents('Nyhedsbrev åbnet'),
  ]);

  // Kom der intet svar overhovedet, så vis "tom" tilstand.
  if (!count && !byPath && !byDevice && !byActivity && !byExcursion && !byLetter) return null;

  const pages: StatEntry[] = (byPath ?? [])
    .map((r: any) => ({ path: stripSlash(r.requestPath ?? ''), views: r.pageviews ?? 0 }))
    .filter((r: StatEntry) => r.path)
    .sort((a: StatEntry, b: StatEntry) => b.views - a.views);

  const topPages = pages.slice(0, 10);

  // Parser "åbnet"-events defensivt (events-API'ets nøgler kan variere).
  const parseOpens = (rows: any): StatEntry[] =>
    (rows ?? [])
      .map((r: any) => ({
        path: String(r['eventData/navn'] ?? r.navn ?? r.value ?? r.key ?? ''),
        views: Number(r.count ?? r.total ?? r.events ?? r.pageviews ?? r.visitors ?? 0),
      }))
      .filter((r: StatEntry) => r.path && r.path !== 'undefined' && r.views > 0)
      .sort((a: StatEntry, b: StatEntry) => b.views - a.views)
      .slice(0, 10);

  const topActivities = parseOpens(byActivity);
  const topExcursions = parseOpens(byExcursion);
  const topLetters = parseOpens(byLetter);

  const devRows = (byDevice ?? []).map((r: any) => ({
    type: DEVICE_LABELS[String(r.deviceType ?? '').toLowerCase()] ?? (r.deviceType || 'Andet'),
    views: r.pageviews ?? 0,
  }));
  const devTotal = devRows.reduce((s: number, r: any) => s + r.views, 0) || 1;
  const devices: DeviceEntry[] = devRows
    .sort((a: any, b: any) => b.views - a.views)
    .map((r: any) => ({ type: r.type, share: Math.round((r.views / devTotal) * 100) }));

  // Totaler fra count; falder count ud, udledes sidevisninger fra listen, så
  // siden stadig viser noget (og ikke tom-tilstanden).
  const pageviews = count?.pageviews ?? pages.reduce((s, r) => s + r.views, 0);
  const visitors = count?.visitors ?? 0;

  return {
    updated: ymd(new Date(nowMs)),
    rangeDays: RANGE_DAYS,
    collecting: true,
    visitors,
    pageviews,
    topPages,
    topActivities,
    topExcursions,
    topLetters,
    devices,
  };
}
