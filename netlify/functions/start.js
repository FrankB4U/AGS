exports.handler = async () => {
  try {
    // GitHub OAuth authorize URL
    const authorizeUrl = new URL("https://github.com/login/oauth/authorize");

    authorizeUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
    authorizeUrl.searchParams.set("redirect_uri", `${process.env.URL}/.netlify/functions/callback`);
    authorizeUrl.searchParams.set("scope", "repo,user");
    authorizeUrl.searchParams.set("allow_signup", "true");

    return {
      statusCode: 302,
      headers: {
        Location: authorizeUrl.toString(),
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
