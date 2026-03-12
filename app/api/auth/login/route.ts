import { NextResponse } from "next/server";
import { oauthConfig } from "@/lib/config/oauth";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/auth/callback`;

  const url = new URL(oauthConfig.authUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", oauthConfig.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", oauthConfig.scopes);
  url.searchParams.set("state", oauthConfig.state);

  return NextResponse.redirect(url.toString(), 302);
}
