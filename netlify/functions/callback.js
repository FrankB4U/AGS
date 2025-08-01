exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.queryStringParameters);
    const code = params.get("code");

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing code parameter" }),
      };
    }

    // Exchange code for GitHub access token
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

    /** DEBUG STEP: Verify token works with GitHub API **/
    const testResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` }
    });
    const testData = await testResponse.json();
    console.l
