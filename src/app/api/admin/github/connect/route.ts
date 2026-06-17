import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_CLIENT_ID no configurado. Crea un OAuth App en GitHub." },
      { status: 400 }
    )
  }

  // Generate a random state for CSRF protection
  const state = crypto.randomUUID()

  // Store state in httpOnly cookie (10 min expiry)
  const cookieStore = await cookies()
  cookieStore.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  })

  const redirectUri = new URL("/api/admin/github/callback", request.url).toString()
  const githubUrl = new URL("https://github.com/login/oauth/authorize")
  githubUrl.searchParams.set("client_id", clientId)
  githubUrl.searchParams.set("redirect_uri", redirectUri)
  githubUrl.searchParams.set("state", state)
  githubUrl.searchParams.set("scope", "repo") // repo scope for committing

  return NextResponse.redirect(githubUrl)
}
