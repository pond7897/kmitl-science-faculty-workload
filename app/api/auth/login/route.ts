import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/auth/callback`;
  
  const url = new URL(process.env.OAUTH_AUTH_URL!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.OAUTH_CLIENT_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:userinfo,read:profile");
  url.searchParams.set("state", process.env.OAUTH_STATE!);

  return NextResponse.redirect(url.toString(), 302);
}
