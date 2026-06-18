import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { cookies } from "next/headers"
import {
  checkRateLimit,
  resetRateLimit,
  safeCompare,
  withSecurityHeaders,
} from "@/lib/rate-limiter"

const DATA_DIR = path.join(process.cwd(), "src", "data")

export async function GET(request: Request) {
  // Rate limiting: strict on auth failures (5 attempts / 15 min window / 30 min block)
  const rateLimit = checkRateLimit(request, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
    label: "admin-login",
  })

  if (rateLimit.limited) {
    return rateLimit.response!
  }

  // Auth check with constant-time comparison
  const authHeader = request.headers.get("authorization")
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || !authHeader) {
    return withSecurityHeaders(
      NextResponse.json({ error: "No autorizado" }, { status: 401 })
    )
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

  // Constant-time comparison to prevent timing attacks
  const isAuthenticated = safeCompare(token, adminSecret)

  if (!isAuthenticated) {
    return withSecurityHeaders(
      NextResponse.json({ error: "No autorizado" }, { status: 401 })
    )
  }

  // Successful auth: reset rate limit counter
  resetRateLimit(request, "admin-login")

  try {
    const files = ["profile.json", "experience.json", "projects.json", "tech-stack.json"]
    const data: Record<string, unknown> = {}

    // In production (Vercel), read from GitHub API to avoid stale filesystem data
    const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL

    if (isProduction) {
      // Try to get GitHub token
      const cookieStore = await cookies()
      const oauthToken = cookieStore.get("github_token")?.value
      const githubToken = oauthToken || process.env.GITHUB_TOKEN
      const owner = process.env.GITHUB_OWNER
      const repo = process.env.GITHUB_REPO

      if (githubToken && owner && repo) {
        const branch = process.env.GITHUB_BRANCH || "main"
        let fetchedAny = false

        for (const file of files) {
          const url = `https://api.github.com/repos/${owner}/${repo}/contents/src/data/${file}?ref=${branch}`
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": `${owner}/${repo}`,
            },
            cache: "no-store",
          })

          if (res.ok) {
            const fileData = await res.json()
            const decoded = Buffer.from(fileData.content, "base64").toString("utf-8")
            data[file.replace(".json", "")] = JSON.parse(decoded)
            fetchedAny = true
          } else {
            console.error(`GitHub API error fetching ${file}: ${res.status}`)
          }
        }

        if (fetchedAny) {
          return withSecurityHeaders(NextResponse.json({ success: true, data }))
        }

        console.error("GitHub API: no se pudo obtener ningún archivo, usando filesystem como fallback")
      }

      // Fallback: GitHub data fetch no disponible, usar filesystem
      console.log("GitHub data fetch no disponible (sin token o API falló), usando filesystem como fallback")
    }

    // Development or fallback: read from filesystem
    for (const file of files) {
      const filePath = path.join(DATA_DIR, file)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8")
        data[file.replace(".json", "")] = JSON.parse(content)
      }
    }

    return withSecurityHeaders(NextResponse.json({ success: true, data }))
  } catch (error) {
    console.error("Error reading data files:", error)
    return withSecurityHeaders(
      NextResponse.json({ error: "Error al leer datos" }, { status: 500 })
    )
  }
}
