exports.handler = async () => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUrl = "https://github.com/login/oauth/authorize";

  const url = `${redirectUrl}?client_id=${clientId}&scope=public_repo,user`;

  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
  };
};
