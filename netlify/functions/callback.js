exports.handler = async (event) => {
  const params = new URLSearchParams(event.queryStringParameters || {});
  const code = params.get("code");

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing OAuth code" }),
    };
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Decap expects this format
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
