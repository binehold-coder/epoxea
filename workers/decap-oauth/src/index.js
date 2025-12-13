export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Helper to build redirect URI consistently
    const callbackUrl = `${url.protocol}//${url.host}/api/oauth/callback`;

    // Step 1: start OAuth — redirect user to GitHub auth page
    if (url.pathname === '/api/oauth/authorize') {
      const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
      authorizeUrl.searchParams.set('scope', 'repo');
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    // Only handle OAuth callback route
    if (url.pathname === '/api/oauth/callback') {
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

      // Return the token to Decap CMS via postMessage
      const html = `<!DOCTYPE html><html><body><script>
        window.opener && window.opener.postMessage(
          { token: '${tokenData.access_token}' },
          'https://epoxea.pages.dev'
        );
        window.close();
      <\/script></body></html>`;

      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not Found', { status: 404 });
  },
};
