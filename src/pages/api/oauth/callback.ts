import type { APIRoute } from 'astro';

// On-demand route (needs the Vercel adapter). Completes the GitHub OAuth flow
// and hands the token back to the CMS window using the Decap/Sveltia handshake.
export const prerender = false;

const TOKEN_URL = 'https://github.com/login/oauth/access_token';

const clientId = () => process.env.GITHUB_OAUTH_ID ?? import.meta.env.GITHUB_OAUTH_ID;
const clientSecret = () => process.env.GITHUB_OAUTH_SECRET ?? import.meta.env.GITHUB_OAUTH_SECRET;

/** Renders the tiny page that postMessages the result to the opener (the CMS). */
function respond(status: 'success' | 'error', content: Record<string, unknown>): Response {
  const message = `authorization:github:${status}:` + JSON.stringify(content);
  const script = `
    (function () {
      function receive(e) {
        if (!e.data || e.data !== 'authorizing:github') return;
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        window.removeEventListener('message', receive, false);
      }
      window.addEventListener('message', receive, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  `;
  const html = `<!doctype html><html lang="da"><head><meta charset="utf-8"><title>Logger ind…</title></head>
<body style="font-family:system-ui;padding:2rem;color:#23211d">Logger ind i CMS… du kan lukke dette vindue.<script>${script}</script></body></html>`;
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) {
    return respond('error', { message: 'Serveren mangler GitHub OAuth-konfiguration.' });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = cookies.get('oauth_state')?.value;

  if (!code) return respond('error', { message: 'Manglende autorisationskode fra GitHub.' });
  if (savedState && state && savedState !== state) {
    return respond('error', { message: 'Ugyldig state – prøv at logge ind igen.' });
  }

  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: id, client_secret: secret, code }),
    });
    const data = (await res.json()) as { access_token?: string; error_description?: string; error?: string };
    if (!data.access_token) {
      return respond('error', { message: data.error_description || data.error || 'Kunne ikke hente adgangstoken.' });
    }
    return respond('success', { token: data.access_token, provider: 'github' });
  } catch (err) {
    return respond('error', { message: `Uventet fejl: ${(err as Error).message}` });
  }
};
