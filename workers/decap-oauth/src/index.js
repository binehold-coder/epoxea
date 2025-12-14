export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // OAuth proxy endpoint for Decap CMS GitHub backend
    if (url.pathname === '/oauth') {
      // Decap sends token request here
      const code = url.searchParams.get('code');
      
      if (!code) {
        // Authorization redirect (no code yet)
        const state = Math.random().toString(36).substring(7);
        const redirectUri = `${url.protocol}//${url.host}/oauth`;
        
        const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
        authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
        authorizeUrl.searchParams.set('redirect_uri', redirectUri);
        authorizeUrl.searchParams.set('scope', 'repo');
        authorizeUrl.searchParams.set('state', state);
        
        return Response.redirect(authorizeUrl.toString(), 302);
      }

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
        return new Response(JSON.stringify({ error: tokenData.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const token = tokenData.access_token;

      // Return token as JSON for Decap to pick up
      return new Response(JSON.stringify({ token }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
