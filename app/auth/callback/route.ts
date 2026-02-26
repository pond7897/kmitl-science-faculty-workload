import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code received" },
      { status: 400 }
    );
  }

  const redirectUrl = new URL("/api/auth/token", origin);
  redirectUrl.searchParams.set("code", code);

  return NextResponse.redirect(redirectUrl.toString());
}
