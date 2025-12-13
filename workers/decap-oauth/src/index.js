export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Helper to build redirect URI consistently
    const callbackUrl = `${url.protocol}//${url.host}/api/oauth/callback`;

    const isAuth = url.pathname === '/api/oauth/authorize' || url.pathname === '/api/oauth/authorize/';
    const isCallback = url.pathname === '/api/oauth/callback' || url.pathname === '/api/oauth/callback/';

    // Step 1: start OAuth — redirect user to GitHub auth page
    if (isAuth) {
      const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
      authorizeUrl.searchParams.set('scope', 'repo');
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    // Only handle OAuth callback route
    if (isCallback) {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: callbackUrl,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return new Response(`Error: ${tokenData.error}`, { status: 400 });
      }

      // Return the token to Decap CMS via postMessage. Close only if window was opened by the app.
      const html = `<!DOCTYPE html><html><body><script>
        (function() {
          const target = 'https://epoxea.pages.dev';
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ token: '${tokenData.access_token}' }, target);
            setTimeout(() => window.close(), 50);
          } else {
            // Fallback: show token if window not opened by app
            document.write('Token received. You can close this window.');
          }
        })();
      <\/script></body></html>`;

      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
  },
};
