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

      const token = tokenData.access_token;

      // Fetch user profile from GitHub API
      let userProfile = { login: 'github-user', name: 'GitHub User' };
      try {
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        if (userRes.ok) {
          userProfile = await userRes.json();
        }
      } catch (e) {
        console.error('[Worker] Failed to fetch user profile:', e);
      }

      // Return HTML that shows token, fetches user, and sends postMessage with protocol format
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
    const userProfile = ${JSON.stringify(userProfile)};
    
    console.log('[Worker] window.opener:', window.opener);
    console.log('[Worker] window.location.origin:', window.location.origin);
    
    if (window.opener && !window.opener.closed) {
      const payload = JSON.stringify({
        token: token,
        user: {
          login: userProfile.login,
          name: userProfile.name,
          avatar_url: userProfile.avatar_url,
          html_url: userProfile.html_url
        }
      });
      const message = 'authorization:github:success:' + payload;
      
      console.log('[Worker] Sending message to opener:', message);
      try {
        window.opener.postMessage(message, window.location.origin);
        console.log('[Worker] postMessage sent successfully');
      } catch (e) {
        console.error('[Worker] postMessage failed:', e);
        window.opener.postMessage(message, '*'); // fallback
      }
      setTimeout(() => window.close(), 5000);
    } else {
      console.error('[Worker] Opener null or closed');
    }
  <\/script>
</body>
</html>`;

      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return new Response('Not Found', { status: 404 });
  },
};
