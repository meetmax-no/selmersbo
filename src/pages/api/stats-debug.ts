// MIDLERTIDIGT fejlsøgnings-endpoint – fjernes igen straks efter.
// Viser råsvaret fra Vercel Web Analytics, så feltnavnene kan verificeres.
export const prerender = false;

export async function GET({ url }: { url: URL }) {
  if (url.searchParams.get('k') !== 'selmer-debug-9f') {
    return new Response('not found', { status: 404 });
  }
  const token = process.env.VERCEL_TOKEN;
  if (!token) return new Response(JSON.stringify({ error: 'no VERCEL_TOKEN' }), { status: 200 });

  const TEAM = 'team_OdQQR8eAX6JkbWsABToVEndh';
  const PROJ = 'prj_AzEzdiT76wwTfXQRWgZ449Gcz68K';
  const ymd = (d: Date) => d.toISOString().slice(0, 10);
  const until = new Date();
  const since = new Date(until.getTime() - 30 * 86_400_000);

  const q = async (path: string, params: Record<string, string>) => {
    const u = new URL(`https://api.vercel.com/v1/query/web-analytics/${path}`);
    u.searchParams.set('teamId', TEAM);
    u.searchParams.set('projectId', PROJ);
    u.searchParams.set('since', ymd(since));
    u.searchParams.set('until', ymd(until));
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    const r = await fetch(u, { headers: { Authorization: `Bearer ${token}` } });
    let body: unknown;
    try { body = await r.json(); } catch { body = await r.text(); }
    return { status: r.status, body };
  };

  const [count, byRequestPath, byRoute, byDevice] = await Promise.all([
    q('visits/count', {}),
    q('visits/aggregate', { by: 'requestPath', limit: '50' }),
    q('visits/aggregate', { by: 'route', limit: '50' }),
    q('visits/aggregate', { by: 'deviceType', limit: '6' }),
  ]);

  return new Response(JSON.stringify({ count, byRequestPath, byRoute, byDevice }, null, 2), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
