"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Droplet,
  User,
  Store,
  ArrowLeft,
  Loader2,
  Mail,
  Lock,
  Phone,
  Building,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<"débil" | "media" | "fuerte" | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "cliente"
  const supabase = createClient()

  const isCliente = type === "cliente"

  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) return "débil"
    if (password.length < 10) return "media"
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return "fuerte"
    return "media"
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const nombre = formData.get("nombre") as string
    const telefono = formData.get("telefono") as string

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      setIsLoading(false)
      return
    }

    try {
      const metadata: any = {
        full_name: nombre,
        phone: telefono,
        user_type: type,
      }

      if (!isCliente) {
        metadata.business_name = formData.get("negocio") as string
        metadata.cuit = formData.get("cuit") as string
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}${isCliente ? "/dashboard" : "/dashboard-proveedor"}`,
          data: metadata,
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
          <CardTitle className="text-2xl">Crear cuenta en AWA</CardTitle>
          <CardDescription>
            {isCliente
              ? "Registrate como cliente para comenzar a pedir agua"
              : "Registrate como proveedor para gestionar tu negocio"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="nombre" name="nombre" required placeholder="Juan Pérez" className="h-12 pl-10" />
              </div>
            </div>

            {!isCliente && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="negocio">Nombre del negocio</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="negocio" name="negocio" required placeholder="Agua Pura SA" className="h-12 pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuit">CUIT</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="cuit" name="cuit" required placeholder="20-12345678-9" className="h-12 pl-10" />
                  </div>
                </div>
              </>
            )}

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
              <Label htmlFor="telefono">{isCliente ? "Teléfono" : "Teléfono comercial"}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  placeholder="+54 9 11 1234-5678"
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-12 pl-10 pr-10"
                  onChange={(e) => setPasswordStrength(checkPasswordStrength(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordStrength && (
                <p
                  className={`text-xs ${
                    passwordStrength === "fuerte"
                      ? "text-green-600"
                      : passwordStrength === "media"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  Contraseña {passwordStrength}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-12 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Acepto los{" "}
                <Link
                  href="#"
                  className={isCliente ? "text-blue-600 hover:underline" : "text-green-600 hover:underline"}
                >
                  términos y condiciones
                </Link>
              </label>
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

            <Button
              type="submit"
              className={`h-12 w-full ${
                isCliente ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear cuenta
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col space-y-2 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link
              href={`/auth/login?type=${type}`}
              className={`font-medium hover:underline ${
                isCliente ? "text-blue-600 hover:text-blue-700" : "text-green-600 hover:text-green-700"
              }`}
            >
              Iniciá sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
