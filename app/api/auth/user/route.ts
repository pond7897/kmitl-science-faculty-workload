import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PROFILE_URL = "https://api.science.kmitl.ac.th/iam/oauth2/resource/read:profile";
const USERINFO_URL = "https://api.science.kmitl.ac.th/iam/oauth2/resource/read:userinfo";

const getResource = async (url: string, accessToken: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const accessToken = searchParams.get("access_token");
  const error = searchParams.get("error");

  if (error) {
    // Redirect to home page with error
    const redirectUrl = new URL("/", origin);
    return NextResponse.redirect(redirectUrl);
  }

  if (!accessToken) {
    // Redirect to home page if no access token
    const redirectUrl = new URL("/", origin);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const [profile, userinfo] = await Promise.all([
      getResource(PROFILE_URL, accessToken),
      getResource(USERINFO_URL, accessToken),
    ]);

    // Store access token and user data in httpOnly cookies
    const cookieStore = await cookies();
    
    // Set access token (httpOnly for security)
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    cookieStore.set("user_info", JSON.stringify({ profile, userinfo }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Redirect to dashboard after successful login
    const redirectUrl = new URL("/profile", origin);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Error fetching user data:", err);
    const redirectUrl = new URL("/", origin);
    return NextResponse.redirect(redirectUrl);
  }
}