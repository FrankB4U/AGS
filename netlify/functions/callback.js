exports.handler = async (event) => {
  const params = new URLSearchParams(event.queryStringParameters || {});
  const code = params.get("code");

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing OAuth code", details: params.toString() }),
    };
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error_description || data.error }),
      };
    }

    // Redirect to /admin with access token in URL hash
    return {
      statusCode: 302,
      headers: {
        Location: `/admin/#access_token=${data.access_token}&token_type=${data.token_type}&scope=${data.scope}`,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
