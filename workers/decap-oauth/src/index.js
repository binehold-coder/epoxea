export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    console.log(`[Worker] ${request.method} ${url.pathname}${url.search}`);

    // Only handle /auth path, ignore everything else
    if (url.pathname !== '/auth') {
      console.log('[Worker] Non-auth path, ignoring');
      return new Response('Not Found', { status: 404 });
    }

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
      const baseUrl = `${url.protocol}//${url.host}`;
      const redirectUri = `${baseUrl}/auth`;
      
      const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', redirectUri);
      // Use narrower scope to reduce rate-limit triggers when possible
      authorizeUrl.searchParams.set('scope', 'public_repo');
      
      console.log('[Worker] Redirecting to GitHub. Redirect URI:', redirectUri);
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    // We have code, exchange for token
    console.log('[Worker] Exchanging code for token');
    const baseUrl = `${url.protocol}//${url.host}`;
    const redirectUri = `${baseUrl}/auth`;
    
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

    // Redirect back to admin with token in URL
    // Admin is hosted on Netlify Pages at epoxea.pages.dev, not on this worker
    const adminUrl = new URL('https://epoxea.pages.dev/admin/');
    adminUrl.searchParams.set('token', token);
    
    console.log('[Worker] Redirecting to admin with token');
    return Response.redirect(adminUrl.toString(), 302);
  },
};
