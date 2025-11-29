import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProveedorDashboard from "@/components/dashboard/proveedor-dashboard"

export default async function DashboardProveedorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "proveedor") {
    redirect("/dashboard")
  }

  return <ProveedorDashboard />
}
