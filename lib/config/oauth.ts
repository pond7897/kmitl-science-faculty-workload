export const oauthConfig = {
  authUrl: process.env.OAUTH_AUTH_URL!,
  clientId: process.env.OAUTH_CLIENT_ID!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  state: process.env.OAUTH_STATE!,
  tokenUrl: 'https://api.science.kmitl.ac.th/iam/oauth2/token',
  profileUrl: 'https://api.science.kmitl.ac.th/iam/oauth2/resource/read:profile',
  userinfoUrl: 'https://api.science.kmitl.ac.th/iam/oauth2/resource/read:userinfo',
  scopes: 'read:userinfo,read:profile',
  cookieMaxAge: 60 * 60 * 24 * 7, // 7 days
} as const;
