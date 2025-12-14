export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    console.log(`[Worker] ${request.method} ${url.pathname}${url.search}`);

    // Handle root or any path — log everything
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    // If we got an error from GitHub
    if (error) {
      console.error('[Worker] GitHub error:', error);
      const msg = url.searchParams.get('error_description') || error;
      return new Response(`OAuth Error: ${msg}`, { status: 400 });
    }

    // If no code, redirect to GitHub
    if (!code) {
      const redirectUri = `${url.protocol}//${url.host}${url.pathname}`;
      
      const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', redirectUri);
      authorizeUrl.searchParams.set('scope', 'repo');
      
      console.log('[Worker] Redirecting to GitHub. Redirect URI:', redirectUri);
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    // We have code, exchange for token
    console.log('[Worker] Exchanging code for token');
    const redirectUri = `${url.protocol}//${url.host}${url.pathname}`;
    
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
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('[Worker] Token exchange error:', tokenData.error);
      return new Response(JSON.stringify({ error: tokenData.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = tokenData.access_token;
    console.log('[Worker] Token received');

    // Return HTML with token that closes after storing
    const html = `<!DOCTYPE html>
<html>
<head><title>OAuth Success</title></head>
<body>
  <h2>OAuth Successful</h2>
  <p>Token received. Closing in 3 seconds...</p>
  <script>
    const token = '${token}';
    console.log('[Callback] Token:', token);
    
    // Store token
    localStorage.setItem('gh_token', token);
    console.log('[Callback] Token stored in localStorage');
    
    // Close window and signal parent
    if (window.opener) {
      window.opener.postMessage({ token: token }, '*');
      console.log('[Callback] Sent postMessage to opener');
    }
    
    setTimeout(() => window.close(), 3000);
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
