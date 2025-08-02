exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.queryStringParameters);
    const code = params.get("code");

    if (!code) {
      return { statusCode: 400, body: "Missing code parameter" };
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return { statusCode: 400, body: JSON.stringify(tokenData) };
    }

    const accessToken = tokenData.access_token;

    // Redirect to clean URL with token (no ?code)
    const cleanUrl = `https://agscms.netlify.app/admin#access_token=${accessToken}&token_type=bearer`;

    return {
      statusCode: 302,
      headers: {
        Location: cleanUrl,
        // Prevent caching of intermediate redirects
        "Cache-Control": "no-store",
      },
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
