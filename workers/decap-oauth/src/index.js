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

      // Return HTML that shows the token (for debug), sends postMessage, and delays auto-close
      const token = tokenData.access_token;
      const html = `<!DOCTYPE html>
<html>
<head><title>OAuth Callback</title></head>
<body style="font-family: sans-serif; padding: 16px;">
  <h2>OAuth successful</h2>
  <p>This window will close automatically in 5 seconds after sending the token to the opener.</p>
  <p><strong>Token (debug, do not share):</strong></p>
  <code style="display:block; word-break:break-all; padding:8px; background:#f5f5f5;">${token}</code>
  <p>If the window does not close, you can close it manually after 5 seconds.</p>
  <script>
    const token = '${token}';
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({
        token: token,
        access_token: token,
        provider: 'github'
      }, '*');
      setTimeout(() => window.close(), 5000);
    }
  <\/script>
</body>
</html>`;

      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return new Response('Not Found', { status: 404 });
  },
};
