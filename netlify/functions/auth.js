exports.handler = async (event) => {
  try {
    // Support both GET (query params) and POST (body) for code
    let code = null;

    if (event.httpMethod === "GET" && event.queryStringParameters) {
      code = event.queryStringParameters.code;
    } else if (event.httpMethod === "POST" && event.body) {
      const params = new URLSearchParams(event.body);
      code = params.get("code");
    }

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing OAuth code" }),
      };
    }

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
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
