import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ProviderDetail from "@/components/provider/provider-detail"

export default async function ProviderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch provider data
  const { data: provider, error: providerError } = await supabase
    .from("providers")
    .select(`
      *,
      profile:profiles(full_name, phone)
    `)
    .eq("id", params.id)
    .single()

  if (providerError || !provider) {
    notFound()
  }

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("provider_id", params.id)
    .eq("active", true)
    .order("name")

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      customer:profiles!reviews_customer_id_fkey(full_name)
    `)
    .eq("provider_id", params.id)
    .order("created_at", { ascending: false })

  return <ProviderDetail provider={provider} products={products || []} reviews={reviews || []} />
}
