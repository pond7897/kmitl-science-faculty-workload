import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { oauthConfig } from "@/lib/config/oauth";

const getResource = async (url: string, accessToken: string) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const accessToken = searchParams.get("access_token");
  const error = searchParams.get("error");

  if (error || !accessToken) {
    return NextResponse.redirect(new URL("/", origin));
  }

  try {
    const [profile, userinfo] = await Promise.all([
      getResource(oauthConfig.profileUrl, accessToken),
      getResource(oauthConfig.userinfoUrl, accessToken),
    ]);

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: oauthConfig.cookieMaxAge,
      path: "/",
    };

    cookieStore.set("access_token", accessToken, cookieOptions);
    cookieStore.set(
      "user_info",
      JSON.stringify({ profile, userinfo }),
      cookieOptions
    );

    return NextResponse.redirect(new URL("/dashboard", origin));
  } catch (err) {
    console.error("Error fetching user data:", err);
    return NextResponse.redirect(new URL("/", origin));
  }
}