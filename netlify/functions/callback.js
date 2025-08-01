exports.handler = async (event) => {
  console.log("OAUTH CALLBACK QUERY:", event.queryStringParameters);
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

    // Exchange code for access token
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
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

    // **Redirect back to /admin with token in URL hash**
    const redirectUrl = `https://agscms.netlify.app/admin#access_token=${data.access_token}&token_type=bearer`;

    return {
      statusCode: 302,
      headers: { Location: redirectUrl },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
