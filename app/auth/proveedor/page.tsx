"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Droplet, Store, ArrowLeft, Loader2 } from "lucide-react"

export default function ProveedorAuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

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

      // Verify user type
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", authData.user.id)
        .single()

      if (profileError) throw profileError

      if (profile.user_type !== "proveedor") {
        await supabase.auth.signOut()
        throw new Error("Esta cuenta no es de proveedor. Por favor usá el login de cliente.")
      }

      router.push("/dashboard-proveedor")
    } catch (err: any) {
      console.error("[v0] Error en login:", err)
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const nombre = formData.get("nombre") as string
    const negocio = formData.get("negocio") as string
    const telefono = formData.get("telefono") as string
    const cuit = formData.get("cuit") as string

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard-proveedor`,
          data: {
            full_name: nombre,
            phone: telefono,
            user_type: "proveedor",
            business_name: negocio,
            cuit: cuit,
          },
        },
      })

      if (signUpError) throw signUpError

      setSuccess("¡Cuenta creada! Revisá tu email para confirmar tu cuenta.")
    } catch (err: any) {
      console.error("[v0] Error en registro:", err)
      setError(err.message || "Error al crear cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 via-white to-emerald-50 p-6 dark:from-slate-900 dark:via-background dark:to-slate-900">
      <div className="mb-6 flex w-full max-w-md items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/auth">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cambiar tipo de cuenta
          </Link>
        </Button>
        <div className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
          <Store className="mr-1 inline h-4 w-4" />
          Proveedor
        </div>
      </div>

      <Card className="w-full max-w-md border-2 border-green-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
            <Droplet className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Panel de Proveedor</CardTitle>
          <CardDescription>Gestioná tu negocio de agua desde acá</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="email" type="email" required placeholder="tu@negocio.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input id="login-password" name="password" type="password" required placeholder="••••••••" />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar Sesión
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nombre">Nombre completo</Label>
                  <Input id="register-nombre" name="nombre" required placeholder="Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-negocio">Nombre del negocio</Label>
                  <Input id="register-negocio" name="negocio" required placeholder="Agua Pura SA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-cuit">CUIT</Label>
                  <Input id="register-cuit" name="cuit" required placeholder="20-12345678-9" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" name="email" type="email" required placeholder="contacto@negocio.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-telefono">Teléfono comercial</Label>
                  <Input id="register-telefono" name="telefono" type="tel" required placeholder="+54 9 11 1234-5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input id="register-password" name="password" type="password" required placeholder="••••••••" />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Cuenta de Proveedor
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
