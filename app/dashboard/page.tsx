import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ClienteDashboard from "@/components/dashboard/cliente-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Verificar si el usuario está autenticadooo
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/login")
  }

  // Verificar que sea un cliente
  if (profile.user_type === "proveedor") {
    redirect("/proveedor/dashboard")
  }

  const { data: providers } = await supabase
    .from("providers")
    .select(`
      *,
      products (
        id,
        name,
        price,
        unit,
        active
      )
    `)
    .eq("verified", true)
    .order("rating", { ascending: false })

  return <ClienteDashboard user={user} profile={profile} providers={providers || []} />
}
