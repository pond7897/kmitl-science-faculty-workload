import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }

  const tokenUrl = new URL("https://api.science.kmitl.ac.th/iam/oauth2/token");
  const response = await fetch(tokenUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.OAUTH_CLIENT_ID!,
      redirect_uri: process.env.OAUTH_REDIRECT_URI!,
      code,
      client_secret: process.env.OAUTH_CLIENT_SECRET!,
    }),
  });

  const result = await response.json();

  const redirectUrl = new URL("/api/auth/user", origin);

  if (result?.data?.success && result?.data?.access_token) {
    redirectUrl.searchParams.set("access_token", result.data.access_token);
  } else if (result?.data?.error || result?.error) {
    redirectUrl.searchParams.set("error", result.data?.error || result.error);
  } else {
    redirectUrl.searchParams.set("error", "Failed to get access token");
  }

  return NextResponse.redirect(redirectUrl.toString());
}
