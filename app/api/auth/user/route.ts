import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("access_token");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token provided" },
      { status: 400 }
    );
  }

  const [profile, userinfo] = await Promise.all([
    fetch("https://api.science.kmitl.ac.th/iam/oauth2/resource/read:profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json()),
    fetch("https://api.science.kmitl.ac.th/iam/oauth2/resource/read:userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json()),
  ]);

  return NextResponse.json({ profile, userinfo });
}