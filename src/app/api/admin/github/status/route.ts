import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("github_token")?.value;
  const login = cookieStore.get("github_login")?.value;

  if (!token) {
    return NextResponse.json({
      connected: false,
      user: null,
    });
  }

  // Verify token is still valid by fetching user
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  const userAgent =
    process.env.GITHUB_USER_AGENT ||
    (owner && repo ? `${owner}/${repo}` : "nextjs-oauth-client"); // ◄ 100% Genérico y agnóstico

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": userAgent,
    },
  });

  if (!userRes.ok) {
    // Token expired or invalid
    return NextResponse.json({
      connected: false,
      user: null,
    });
  }

  const userData = await userRes.json();

  return NextResponse.json({
    connected: true,
    user: login || userData.login,
    avatarUrl: userData.avatar_url,
  });
}
