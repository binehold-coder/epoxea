export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const callbackUrl = `${url.protocol}//${url.host}/callback`;

    // OAuth authorize endpoint
    if (url.pathname === '/auth') {
      const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
      authorizeUrl.searchParams.set('scope', 'repo');
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    // OAuth callback endpoint
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      // Exchange code for token
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
        return new Response(`OAuth Error: ${tokenData.error}`, { status: 400 });
      }

      // Return HTML that stores token and redirects back to admin
      const html = `<!DOCTYPE html><html><body><script>
        const token = '${tokenData.access_token}';
        const origin = window.opener ? window.opener.location.origin : '${url.protocol}//${url.host}';
        
        if (window.opener && !window.opener.closed) {
          // Send token via postMessage
          window.opener.postMessage({
            token: token,
            access_token: token,
            provider: 'github'
          }, origin);
          setTimeout(() => window.close(), 100);
        } else {
          // Fallback: store in sessionStorage and redirect
          sessionStorage.setItem('decap_token', token);
          window.location.href = origin + '/admin/?token=' + encodeURIComponent(token);
        }
      <\/script></body></html>`;

      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return new Response('Not Found', { status: 404 });
  },
};
