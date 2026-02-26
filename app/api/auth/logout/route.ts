import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const cookieStore = await cookies();
  
  // Clear all auth cookies
  cookieStore.delete('access_token');
  cookieStore.delete('user_info');
  
  // Redirect to home page
  const redirectUrl = new URL("/", origin);
  return NextResponse.redirect(redirectUrl);
}
