// Henter besøgstal fra Vercel Web Analytics (server-side).
//
// Bruges kun på /statistik-siden, som er server-renderet og caches i 10
// minutter – afsluttede måneder et døgn (se Cache-Control i statistik.astro).
// Derfor rammes Vercels API ikke ved hvert besøg. Tokenet læses fra en miljøvariabel på serveren og sendes
// ALDRIG til browseren.
//
// Kræver miljøvariablen VERCEL_TOKEN (sæt den i Vercel → Project → Settings →
// Environment Variables). Team- og projekt-id er ikke hemmelige og kan stå her.

const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_OdQQR8eAX6JkbWsABToVEndh';
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_AzEzdiT76wwTfXQRWgZ449Gcz68K';
const RANGE_DAYS = 30;
const TZ = 'Europe/Copenhagen';
// Første måned der kan vælges: siden gik live på Vercel i september 2026
// (projektet blev oprettet 26. august – kun testbesøg før).
const FIRST_MONTH = { year: 2026, month: 9 };
// Vercel gemmer besøgstal i 12 måneder (Pro), så længere tilbage kan ikke vælges.
const MAX_MONTHS = 12;
// Vercel samler alt ud over "limit" i én række med dette navn.
const OTHERS = 'Others';

export interface StatEntry { path: string; views: number; }
export interface DeviceEntry { type: string; count: number; share: number; }
// Det, der ikke kom med i top 10: antal ting og samlede åbninger.
// others = Vercel har selv samlet nogle i "Others" (antal ting kendes da ikke).
export interface RestEntry { items: number; views: number; others: boolean; }
// En kalendermåned (dansk tid). current = indeværende måned (indtil nu).
export interface MonthPeriod { key: string; year: number; month: number; current: boolean; }
export interface Stats {
  updated: string;
  rangeDays: number;
  month?: MonthPeriod | null;
  collecting: boolean;
  visitors: number;
  pageviews: number;
  topPages: StatEntry[];
  topActivities: StatEntry[];
  topExcursions: StatEntry[];
  topLetters: StatEntry[];
  restActivities?: RestEntry;
  restExcursions?: RestEntry;
  restLetters?: RestEntry;
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
const pad = (n: number) => String(n).padStart(2, '0');

// År og måned i dansk tid for et tidspunkt.
function dkYearMonth(ms: number) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' }).formatToParts(new Date(ms));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get('year'), month: get('month') };
}

// Midnat dansk tid den 1. i måneden, som tidsstempel (ms). Sommertid skifter
// aldrig ved midnat den 1., så forskydningen målt kl. 00 UTC er den rigtige.
function dkMonthStart(year: number, month: number): number {
  const utc = Date.UTC(year, month - 1, 1);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(utc));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const local = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'));
  return utc - (local - utc);
}

// Måneder der kan vælges på /statistik – nyeste først, højst 12 og ikke før
// FIRST_MONTH. Beregnes ved hvert (cachede) opslag, så en ny måned kommer af sig selv.
export function listMonths(nowMs = Date.now()): MonthPeriod[] {
  let { year, month } = dkYearMonth(nowMs);
  const out: MonthPeriod[] = [];
  while (out.length < MAX_MONTHS && (year > FIRST_MONTH.year || (year === FIRST_MONTH.year && month >= FIRST_MONTH.month))) {
    out.push({ key: `${year}-${pad(month)}`, year, month, current: out.length === 0 });
    month -= 1;
    if (month === 0) { month = 12; year -= 1; }
  }
  return out;
}

// Interne sider (kun for bestyrelsen) – husets egne værktøjer, ikke offentligt
// indhold. De tælles IKKE med i "Mest besøgte sider".
const INTERNAL_PAGES = new Set(['/menu', '/statistik', '/oppdatering', '/guide']);
const isInternal = (p: string) => INTERNAL_PAGES.has(p) || p.startsWith('/admin') || p.startsWith('/api');

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
// month = null → de sidste 30 dage; ellers den valgte kalendermåned (dansk tid).
export async function getStats(month: MonthPeriod | null = null): Promise<Stats | null> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return null;

  const nowMs = Date.now();
  const dayMs = 86_400_000;
  // De to endpoints fortolker datoer forskelligt:
  //  - count er gladest for dato-strenge (og medtager hele slutdagen).
  //  - aggregate KRÆVER ms-tidsstempler; en dato-streng afskæres til kl. 01:00
  //    i projektets tidszone og udelader dermed dagens besøg (→ tomme lister).
  let dateRange = { since: ymd(new Date(nowMs - RANGE_DAYS * dayMs)), until: ymd(new Date(nowMs + dayMs)) };
  let msRange = { since: String(nowMs - RANGE_DAYS * dayMs), until: String(nowMs) };
  if (month) {
    const start = dkMonthStart(month.year, month.month);
    const next = month.month === 12 ? dkMonthStart(month.year + 1, 1) : dkMonthStart(month.year, month.month + 1);
    const lastDay = new Date(Date.UTC(month.year, month.month, 0)).getUTCDate();
    dateRange = {
      since: `${month.key}-01`,
      until: month.current ? ymd(new Date(nowMs + dayMs)) : `${month.key}-${pad(lastDay)}`,
    };
    msRange = { since: String(start), until: String(month.current ? nowMs : next - 1) };
  }

  // Hjælper til "åbnet"-events (modaler for aktiviteter, udflugter, nyhedsbreve).
  const openEvents = (name: string) =>
    q('events/aggregate', { ...msRange, by: 'eventData/navn', limit: '100', filter: `eventName eq '${name}'` }, token);

  const [count, byPath, byDevice, byActivity, byExcursion, byLetter] = await Promise.all([
    q('visits/count', dateRange, token),
    q('visits/aggregate', { ...msRange, by: 'requestPath', limit: '100' }, token),
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
    .filter((r: StatEntry) => r.path && r.path !== OTHERS && !isInternal(r.path))
    .sort((a: StatEntry, b: StatEntry) => b.views - a.views);

  const topPages = pages.slice(0, 10);

  // Parser "åbnet"-events defensivt (events-API'ets nøgler kan variere).
  // Vi beder om alle (limit 100) og tager selv top 10; resten tælles sammen,
  // så "Others" aldrig står som en aktivitet på listen.
  const parseOpens = (rows: any): { top: StatEntry[]; rest: RestEntry } => {
    const all: StatEntry[] = (rows ?? [])
      .map((r: any) => ({
        path: String(r['eventData/navn'] ?? r.navn ?? r.value ?? r.key ?? ''),
        views: Number(r.count ?? r.total ?? r.events ?? r.pageviews ?? r.visitors ?? 0),
      }))
      .filter((r: StatEntry) => r.path && r.path !== 'undefined' && r.views > 0);
    const sum = (list: StatEntry[]) => list.reduce((s, r) => s + r.views, 0);
    const others = all.filter((r) => r.path === OTHERS);
    const named = all.filter((r) => r.path !== OTHERS).sort((a, b) => b.views - a.views);
    const rest = named.slice(10);
    return {
      top: named.slice(0, 10),
      rest: { items: rest.length, views: sum(rest) + sum(others), others: others.length > 0 },
    };
  };

  const activities = parseOpens(byActivity);
  const excursions = parseOpens(byExcursion);
  const letters = parseOpens(byLetter);

  // Antal = besøgende pr. enhed (summerer til ~antal besøgende i alt).
  const devRows = (byDevice ?? []).map((r: any) => ({
    type: DEVICE_LABELS[String(r.deviceType ?? '').toLowerCase()] ?? (r.deviceType || 'Andet'),
    count: Number(r.visitors ?? r.pageviews ?? 0),
  }));
  const devTotal = devRows.reduce((s: number, r: any) => s + r.count, 0) || 1;
  const devices: DeviceEntry[] = devRows
    .sort((a: any, b: any) => b.count - a.count)
    .map((r: any) => ({ type: r.type, count: r.count, share: Math.round((r.count / devTotal) * 100) }));

  // Totaler fra count; falder count ud, udledes sidevisninger fra listen, så
  // siden stadig viser noget (og ikke tom-tilstanden).
  const pageviews = count?.pageviews ?? pages.reduce((s, r) => s + r.views, 0);
  const visitors = count?.visitors ?? 0;

  return {
    updated: ymd(new Date(nowMs)),
    rangeDays: RANGE_DAYS,
    month,
    collecting: true,
    visitors,
    pageviews,
    topPages,
    topActivities: activities.top,
    topExcursions: excursions.top,
    topLetters: letters.top,
    restActivities: activities.rest,
    restExcursions: excursions.rest,
    restLetters: letters.rest,
    devices,
  };
}
