export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
