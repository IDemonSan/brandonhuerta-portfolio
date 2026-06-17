/**
 * In-memory rate limiter for admin API routes.
 *
 * No external dependencies — uses a Map with periodic cleanup.
 * Resets on server restart (deployment in Vercel = fresh start).
 *
 * Usage:
 *   const result = checkRateLimit(request, { maxRequests: 5, windowMs: 15 * 60 * 1000 })
 *   if (result.limited) return result.response
 */

import { timingSafeEqual } from "crypto"

export interface RateLimitOptions {
  /** Max requests allowed within the window (default: 10) */
  maxRequests?: number
  /** Window duration in milliseconds (default: 15 min) */
  windowMs?: number
  /** After exceeding maxRequests, block for this duration in ms (default: 15 min) */
  blockDurationMs?: number
  /** Label for the rate limit (used in error messages) */
  label?: string
}

export interface RateLimitResult {
  limited: boolean
  remaining: number
  resetAt: number
  response?: Response
}

interface RateLimitEntry {
  count: number
  resetAt: number
  blockedUntil: number | null
}

const store = new Map<string, RateLimitEntry>()

// Periodic cleanup every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now && (entry.blockedUntil === null || entry.blockedUntil < now)) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Extract a consistent identifier from the request.
 * Prefers X-Forwarded-For (Vercel/proxies), falls back to cf-connecting-ip (Cloudflare),
 * then to the direct remote address.
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    // X-Forwarded-For can be a comma-separated list: client, proxy1, proxy2
    return forwarded.split(",")[0].trim()
  }

  const cfIp = request.headers.get("cf-connecting-ip")
  if (cfIp) return cfIp

  // Fallback: use a hash of common headers as a pseudo-identifier
  const userAgent = request.headers.get("user-agent") || "unknown"
  const accept = request.headers.get("accept") || ""
  return `ip_${Buffer.from(userAgent + accept).toString("base64").slice(0, 20)}`
}

/**
 * Check if a request is rate-limited.
 * Returns { limited: false } if allowed, or { limited: true, response } with a 429 if blocked.
 */
export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  const {
    maxRequests = 10,
    windowMs = 15 * 60 * 1000,
    blockDurationMs = 15 * 60 * 1000,
    label = "admin",
  } = options

  const clientId = getClientIp(request)
  const now = Date.now()
  const key = `ratelimit:${label}:${clientId}`

  let entry = store.get(key)

  // If no entry exists or the window has expired, create a new one
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
      blockedUntil: null,
    }
    store.set(key, entry)
  }

  // Check if currently blocked
  if (entry.blockedUntil !== null && entry.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000)
    return {
      limited: true,
      remaining: 0,
      resetAt: entry.blockedUntil,
      response: new Response(
        JSON.stringify({
          error: "Demasiados intentos. Intenta de nuevo más tarde.",
          retryAfter: retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(entry.blockedUntil / 1000)),
          },
        }
      ),
    }
  }

  // Increment counter
  entry.count++

  // If exceeded max requests, activate block
  if (entry.count > maxRequests) {
    entry.blockedUntil = now + blockDurationMs
    const retryAfterSeconds = Math.ceil(blockDurationMs / 1000)

    return {
      limited: true,
      remaining: 0,
      resetAt: entry.blockedUntil,
      response: new Response(
        JSON.stringify({
          error: "Demasiados intentos. Intenta de nuevo más tarde.",
          retryAfter: retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(entry.blockedUntil / 1000)),
          },
        }
      ),
    }
  }

  // Reset the counter on success (called externally)
  return {
    limited: false,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Reset the rate limit counter for a given request on successful auth.
 */
export function resetRateLimit(request: Request, label = "admin"): void {
  const clientId = getClientIp(request)
  const key = `ratelimit:${label}:${clientId}`
  store.delete(key)
}

/**
 * Constant-time string comparison to prevent timing attacks on auth.
 */
export function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)

  try {
    return timingSafeEqual(aBuf, bBuf)
  } catch {
    // Lengths differ — do a dummy comparison to prevent timing leak
    timingSafeEqual(Buffer.alloc(1), Buffer.alloc(1))
    return false
  }
}

/**
 * Add security headers to a Response object, merging with any existing headers.
 */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)

  // Prevent MIME type sniffing
  if (!headers.has("X-Content-Type-Options")) {
    headers.set("X-Content-Type-Options", "nosniff")
  }

  // Prevent clickjacking
  if (!headers.has("X-Frame-Options")) {
    headers.set("X-Frame-Options", "DENY")
  }

  // Enable XSS filter in older browsers
  if (!headers.has("X-XSS-Protection")) {
    headers.set("X-XSS-Protection", "1; mode=block")
  }

  // Referrer policy
  if (!headers.has("Referrer-Policy")) {
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Wrap a Response with CORS headers (same-origin only).
 */
export function withCorsHeaders(response: Response, origin: string): Response {
  const headers = new Headers(response.headers)
  headers.set("Access-Control-Allow-Origin", origin)
  headers.set("Access-Control-Allow-Methods", "GET, POST")
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
