"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Droplet, User, Store } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userType, setUserType] = useState<"cliente" | "proveedor">("cliente")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", data.user.id)
        .single()

      if (profileError) throw profileError

      if (profile.user_type !== userType) {
        setError(`Esta cuenta es de tipo ${profile.user_type}. Por favor selecciona la pestaña correcta.`)
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      if (profile.user_type === "cliente") {
        router.push("/dashboard")
      } else if (profile.user_type === "proveedor") {
        router.push("/dashboard-proveedor")
      }
    } catch (err: any) {
      console.error("[v0] Error en login:", err)
      setError("Email o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplet className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido a AWA</h1>
          <p className="text-gray-600 mt-2">Seleccioná tu tipo de cuenta</p>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setUserType("cliente")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              userType === "cliente"
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User className="w-5 h-5" />
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setUserType("proveedor")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              userType === "proveedor"
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Store className="w-5 h-5" />
            Proveedor
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="juan@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a href="/recuperar-password" className="text-sm text-sky-500 hover:text-sky-600">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : `Iniciar sesión como ${userType}`}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          ¿No tenés cuenta?{" "}
          <a href="/registro" className="text-sky-500 font-semibold hover:text-sky-600">
            Registrate gratis
          </a>
        </p>
      </div>
    </div>
  )
}
