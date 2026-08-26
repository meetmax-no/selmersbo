import type { APIRoute } from 'astro';

// On-demand route (needs the Vercel adapter). Starts the GitHub OAuth flow
// for the CMS. Requires env vars GITHUB_OAUTH_ID / GITHUB_OAUTH_SECRET.
export const prerender = false;

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';

const clientId = () => process.env.GITHUB_OAUTH_ID ?? import.meta.env.GITHUB_OAUTH_ID;

// On Vercel serverless, request.url is often http://localhost/... — derive the
// real public origin from the proxy headers instead.
function publicOrigin(request: Request): string {
  const proto = request.headers.get('x-forwarded-proto') ?? 'https';
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

export const GET: APIRoute = ({ request }) => {
  const id = clientId();
  if (!id) {
    return new Response('Mangler GITHUB_OAUTH_ID på serveren.', { status: 500 });
  }
  const url = new URL(request.url);
  const scope = url.searchParams.get('scope') || 'repo,user';
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: id,
    redirect_uri: `${publicOrigin(request)}/api/oauth/callback`,
    scope,
    state,
    allow_signup: 'false',
  });
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`,
  );
  headers.append('Location', `${GITHUB_AUTHORIZE}?${params.toString()}`);
  return new Response(null, { status: 302, headers });
};
