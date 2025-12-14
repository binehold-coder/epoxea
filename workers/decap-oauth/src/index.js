export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    console.log(`[Worker] ${request.method} ${url.pathname}${url.search}`);

    // OAuth proxy endpoint for Decap CMS GitHub backend
    if (url.pathname === '/oauth') {
      console.log('[Worker] OAuth endpoint hit');
      
      // Decap sends token request here
      const code = url.searchParams.get('code');
      
      if (!code) {
        console.log('[Worker] No code, redirecting to GitHub');
        
        // Authorization redirect (no code yet)
        const redirectUri = `${url.protocol}//${url.host}/oauth`;
        
        const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
        authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
        authorizeUrl.searchParams.set('redirect_uri', redirectUri);
        authorizeUrl.searchParams.set('scope', 'repo');
        
        console.log('[Worker] Redirect URI:', redirectUri);
        console.log('[Worker] Authorize URL:', authorizeUrl.toString());
        
        return Response.redirect(authorizeUrl.toString(), 302);
      }

      console.log('[Worker] Code received, exchanging for token');
      
      // Code received, exchange for token
      const redirectUri = `${url.protocol}//${url.host}/oauth`;
      
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
        console.error('[Worker] Token error:', tokenData.error);
        return new Response(JSON.stringify({ error: tokenData.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const token = tokenData.access_token;
      console.log('[Worker] Token obtained, returning');

      // Return token as JSON for Decap to pick up
      return new Response(JSON.stringify({ token }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    console.log(`[Worker] Path not found: ${url.pathname}`);
    return new Response('Not Found', { status: 404 });
  },
};
