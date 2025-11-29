"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Droplet, User, Store, ArrowLeft, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "cliente"
  const supabase = createClient()

  const isCliente = type === "cliente"
  const themeColor = isCliente ? "blue" : "green"

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", authData.user.id)
        .single()

      if (profileError) throw profileError

      if (profile.user_type !== type) {
        await supabase.auth.signOut()
        throw new Error(`Esta cuenta no es de ${type}. Por favor usá el login correcto.`)
      }

      router.push(isCliente ? "/dashboard" : "/dashboard-proveedor")
    } catch (err: any) {
      console.error("[v0] Error en login:", err)
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b p-6 ${
        isCliente
          ? "from-sky-50 via-white to-cyan-50 dark:from-slate-900 dark:via-background dark:to-slate-900"
          : "from-green-50 via-white to-emerald-50 dark:from-slate-900 dark:via-background dark:to-slate-900"
      }`}
    >
      <div className="mb-6 flex w-full max-w-[450px] items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/auth">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cambiar tipo de cuenta
          </Link>
        </Button>
        <div
          className={`rounded-full px-4 py-1 text-sm font-medium ${
            isCliente
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
          }`}
        >
          {isCliente ? <User className="mr-1 inline h-4 w-4" /> : <Store className="mr-1 inline h-4 w-4" />}
          {isCliente ? "Cliente" : "Proveedor"}
        </div>
      </div>

      <Card className={`w-full max-w-[450px] border-2 ${isCliente ? "border-blue-500/20" : "border-green-500/20"}`}>
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
              isCliente ? "bg-blue-500/10" : "bg-green-500/10"
            }`}
          >
            <Droplet className={`h-8 w-8 ${isCliente ? "text-blue-600" : "text-green-600"}`} />
          </div>
          <CardTitle className="text-2xl">Bienvenido a AWA</CardTitle>
          <CardDescription>
            {isCliente
              ? "Ingresá como cliente para buscar proveedores de agua"
              : "Ingresá como proveedor para gestionar tu negocio"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={isCliente ? "tu@email.com" : "contacto@negocio.com"}
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="#"
                  className={`text-sm hover:underline ${
                    isCliente ? "text-blue-600 hover:text-blue-700" : "text-green-600 hover:text-green-700"
                  }`}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-12 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className={`h-12 w-full ${
                isCliente ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col space-y-2 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link
              href={`/auth/register?type=${type}`}
              className={`font-medium hover:underline ${
                isCliente ? "text-blue-600 hover:text-blue-700" : "text-green-600 hover:text-green-700"
              }`}
            >
              Registrate gratis
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
