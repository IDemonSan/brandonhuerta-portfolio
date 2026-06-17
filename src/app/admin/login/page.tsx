"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Store password in session storage for the admin session
      const res = await fetch("/api/admin/data", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      })

      if (res.ok) {
        sessionStorage.setItem("admin_token", password)
        router.push("/admin")
      } else if (res.status === 429) {
        const data = await res.json()
        setError(
          data.retryAfter
            ? `Demasiados intentos. Espera ${data.retryAfter} segundos.`
            : "Demasiados intentos. Intenta más tarde."
        )
      } else {
        setError("Contraseña incorrecta")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-accent-crimson flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-muted mt-1">Ingresa la contraseña para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de administrador"
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-theme text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-crimson focus:border-accent-crimson transition-all"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-accent-crimson bg-accent-crimson-subtle px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-crimson w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Acceder"}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          Configura ADMIN_SECRET en las variables de entorno
        </p>
      </div>
    </div>
  )
}
