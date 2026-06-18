import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  const cookieStore = await cookies()

  if (error) {
    return NextResponse.redirect(
      new URL("/admin?github=error&reason=" + error, request.url)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/admin?github=error&reason=missing_params", request.url)
    )
  }

  // Verify state matches
  const storedState = cookieStore.get("github_oauth_state")?.value
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL("/admin?github=error&reason=state_mismatch", request.url)
    )
  }

  // Clear state cookie
  cookieStore.delete("github_oauth_state")

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/admin?github=error&reason=missing_config", request.url)
    )
  }

  // Exchange code for access token
  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    }
  )

  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/admin?github=error&reason=token_exchange_failed", request.url)
    )
  }

  // Store token in httpOnly cookie (7 days)
  cookieStore.set("github_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  // Get the authenticated user's info
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "brandonhuerta-portfolio",
    },
  })

  let githubUser = "GitHub"
  if (userRes.ok) {
    const userData = await userRes.json()
    githubUser = userData.login

    // Store GitHub username for convenience
    cookieStore.set("github_login", githubUser, {
      httpOnly: false, // client needs to read this
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
  }

  // Redirect back to admin with success
  return NextResponse.redirect(
    new URL(`/admin?github=connected&user=${githubUser}`, request.url)
  )
}
