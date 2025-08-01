const fetch = require('node-fetch');

exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return {
      statusCode: 400,
      body: 'Error: Missing OAuth code.',
    };
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 400, body: JSON.stringify(data) };
    }

    const token = data.access_token;

    // This is the new part:
    // Instead of a 302 redirect, we return a 200 OK with an HTML page.
    // This page runs a script to store the token and then redirects.
    const script = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Authenticating...</title>
      </head>
      <body>
        <script>
          // The data that Decap CMS expects to find in localStorage.
          const authData = {
            token: "${token}",
            provider: "github"
          };
          
          // The key Decap CMS uses to check for a logged-in user.
          window.localStorage.setItem('decap-cms-user', JSON.stringify(authData));
          
          // Redirect to the main admin page.
          window.location.replace('/admin/');
        </script>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: script,
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
