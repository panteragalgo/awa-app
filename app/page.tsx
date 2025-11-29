import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Droplet, MapPin, CreditCard, Star, Clock, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white px-6 py-24 dark:from-slate-900 dark:to-background">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Droplet className="h-4 w-4" />
              Agua fresca en tu domicilio
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl">
              Tu agua,
              <span className="text-primary"> a un click</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
              Conectamos clientes con proveedores de agua verificados. Pedidos programados o inmediatos, pagos seguros y
              seguimiento en tiempo real.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-40">
                <Link href="/auth">Registrate</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-w-40 bg-transparent">
                <Link href="/auth">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">¿Cómo funciona AWA?</h2>
            <p className="text-muted-foreground">Simple, rápido y confiable</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Busca proveedores</h3>
                <p className="text-muted-foreground">
                  Filtra por zona, disponibilidad, precio y calificación. Encuentra el proveedor ideal cerca de ti.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Programa o pide ahora</h3>
                <p className="text-muted-foreground">
                  Agenda pedidos para la semana o solicita entrega inmediata. Tú decides cuándo necesitas tu agua.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Paga seguro</h3>
                <p className="text-muted-foreground">
                  Integración con Mercado Pago y otras plataformas. Pagos protegidos y sin complicaciones.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Droplet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Recibe tu agua</h3>
                <p className="text-muted-foreground">
                  Seguimiento en tiempo real con geolocalización. Notificaciones cuando el proveedor esté llegando.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Confirmación con foto</h3>
                <p className="text-muted-foreground">
                  Proof of Delivery: el proveedor saca una foto al entregar. Transparencia total en cada pedido.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Califica el servicio</h3>
                <p className="text-muted-foreground">
                  Deja tu opinión y ayuda a otros usuarios. Los mejores proveedores destacan con puntuación alta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-6 py-24 text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">¿Sos proveedor de agua?</h2>
          <p className="mb-8 text-lg opacity-90">
            Únete a AWA y lleva tu negocio al siguiente nivel. Gestiona pedidos, pagos y entregas desde una sola
            plataforma.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/proveedor">Registrar mi negocio</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Droplet className="h-6 w-6 text-primary" />
              AWA
            </div>
            <p className="text-sm text-muted-foreground">2026 AWA. Haciendo más simple la distribución de agua.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
