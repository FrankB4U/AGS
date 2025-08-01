exports.handler = async (event) => {
  try {
    // Extract the authorization code from query parameters
    const params = new URLSearchParams(event.queryStringParameters);
    const code = params.get("code");

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing code parameter" }),
      };
    }

    // Exchange code for GitHub access token using native fetch
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: tokenData.error }),
      };
    }

    const accessToken = tokenData.access_token;

    // Build clean admin URL with hash only (no query string)
    const adminUrl = new URL("/admin", process.env.URL);
    adminUrl.hash = `access_token=${accessToken}&token_type=bearer`;

    // Redirect user to Decap CMS admin with token in hash
    return {
      statusCode: 302,
      headers: {
        Location: adminUrl.toString(),
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
