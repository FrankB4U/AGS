exports.handler = async (event) => {
  // Log what Netlify sends (will show in Netlify function logs)
  console.log("EVENT QUERY:", event.queryStringParameters);
  console.log("EVENT BODY:", event.body);

  const params = new URLSearchParams(event.queryStringParameters || {});
  const code = params.get("code");

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing OAuth code", details: params.toString() }),
    };
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
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

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error }),
      };
    }

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
