import { NextResponse } from "next/server";

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
    getResource(PROFILE_URL, accessToken),
    getResource(USERINFO_URL, accessToken),
  ]);

  return NextResponse.json({ profile, userinfo });
}