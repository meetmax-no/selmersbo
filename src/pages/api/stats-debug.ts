// MIDLERTIDIGT fejlsøgnings-endpoint – fjernes igen straks efter.
export const prerender = false;

export async function GET({ url }: { url: URL }) {
  if (url.searchParams.get('k') !== 'selmer-debug-9f') {
    return new Response('not found', { status: 404 });
  }
  const token = process.env.VERCEL_TOKEN;
  if (!token) return new Response(JSON.stringify({ error: 'no VERCEL_TOKEN' }), { status: 200 });

  const TEAM = 'team_OdQQR8eAX6JkbWsABToVEndh';
  const PROJ = 'prj_AzEzdiT76wwTfXQRWgZ449Gcz68K';
  const now = Date.now();
  const day = 86_400_000;

  const q = async (label: string, path: string, params: Record<string, string>) => {
    const u = new URL(`https://api.vercel.com/v1/query/web-analytics/${path}`);
    u.searchParams.set('teamId', TEAM);
    u.searchParams.set('projectId', PROJ);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    const r = await fetch(u, { headers: { Authorization: `Bearer ${token}` } });
    let body: any;
    try { body = await r.json(); } catch { body = await r.text(); }
    const data = body && body.data;
    return { label, status: r.status, query: body?.query, count: Array.isArray(data) ? data.length : 'n/a', sample: Array.isArray(data) ? data.slice(0, 4) : data };
  };

  const isoDate = (t: number) => new Date(t).toISOString().slice(0, 10);
  const since = isoDate(now - 30 * day);

  const variants = await Promise.all([
    q('A date until=today', 'visits/aggregate', { by: 'requestPath', limit: '50', since, until: isoDate(now) }),
    q('B date until=tomorrow', 'visits/aggregate', { by: 'requestPath', limit: '50', since, until: isoDate(now + day) }),
    q('C ms until=now', 'visits/aggregate', { by: 'requestPath', limit: '50', since: String(now - 30 * day), until: String(now) }),
    q('D ms until=now+2d', 'visits/aggregate', { by: 'requestPath', limit: '50', since: String(now - 30 * day), until: String(now + 2 * day) }),
    q('E iso until=now', 'visits/aggregate', { by: 'requestPath', limit: '50', since: new Date(now - 30 * day).toISOString(), until: new Date(now).toISOString() }),
    q('F device until=tomorrow', 'visits/aggregate', { by: 'deviceType', limit: '6', since, until: isoDate(now + day) }),
  ]);

  return new Response(JSON.stringify({ nowIso: new Date(now).toISOString(), variants }, null, 2), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
