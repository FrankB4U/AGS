exports.handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;

  // GitHub OAuth endpoint
  const githubAuthorizeUrl = "https://github.com/login/oauth/authorize";

  // Redirect URI must match the callback function we will create next
  const redirectUri = "https://agscms.netlify.app/.netlify/functions/callback";

  // Build authorization URL
  const url = `${githubAuthorizeUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=repo`;

  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
  };
};
