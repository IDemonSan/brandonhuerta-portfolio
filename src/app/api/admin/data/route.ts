import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
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
