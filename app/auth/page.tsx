import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Store, User, ArrowRight, Shield, TrendingUp } from "lucide-react"

export default function AuthSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-white to-cyan-50 p-6 dark:from-slate-900 dark:via-background dark:to-slate-900">
      <div className="mb-8 text-center">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-2xl font-bold">
          <Droplet className="h-8 w-8 text-primary" />
          AWA
        </Link>
        <h1 className="mb-2 text-3xl font-bold">¿Cómo querés usar AWA?</h1>
        <p className="text-muted-foreground">Seleccioná el tipo de cuenta que mejor se adapte a vos</p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        {/* Cliente Card */}
        <Card className="group relative overflow-hidden border-2 transition-all hover:border-blue-500 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="relative">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition-transform group-hover:scale-110">
              <User className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Soy Cliente</CardTitle>
            <CardDescription className="text-base">
              Buscá proveedores de agua cerca tuyo y realizá pedidos de forma simple
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Proveedores verificados
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Pagos seguros integrados
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Seguimiento en tiempo real
              </li>
            </ul>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <Link href="/auth/login?type=cliente">
                Continuar como Cliente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Proveedor Card */}
        <Card className="group relative overflow-hidden border-2 transition-all hover:border-green-500 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="relative">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 transition-transform group-hover:scale-110">
              <Store className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Soy Proveedor</CardTitle>
            <CardDescription className="text-base">
              Gestioná tu negocio de agua embotellada desde una sola plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Más clientes y visibilidad
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Gestión de pedidos centralizada
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Cobros automáticos y seguros
              </li>
            </ul>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700" size="lg">
              <Link href="/auth/login?type=proveedor">
                Continuar como Proveedor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
