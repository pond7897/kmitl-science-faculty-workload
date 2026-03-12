import { NextResponse } from "next/server";
import { oauthConfig } from "@/lib/config/oauth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }

  const redirectUri = `${origin}/auth/callback`;

  const response = await fetch(oauthConfig.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: oauthConfig.clientId,
      redirect_uri: redirectUri,
      code,
      client_secret: oauthConfig.clientSecret,
    }),
  });

  const result = await response.json();

  const redirectUrl = new URL("/api/auth/user", origin);
  const accessToken = result?.data?.access_token;
  const errorMessage = result?.data?.error || result?.error;

  if (result?.data?.success && accessToken) {
    redirectUrl.searchParams.set("access_token", accessToken);
  } else {
    redirectUrl.searchParams.set(
      "error",
      errorMessage || "Failed to get access token"
    );
  }

  return NextResponse.redirect(redirectUrl.toString());
}
