"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Star, Clock, ShoppingCart, UserIcon, LogOut, Droplet, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Provider = {
  id: string
  business_name: string
  description: string
  rating: number
  total_reviews: number
  verified: boolean
  zone: string
  availability_days: string[]
  address: string
  show_prices: boolean
  show_catalog: boolean
  products?: Array<{
    id: string
    name: string
    price: number
    unit: string
    active: boolean
  }>
}

type Profile = {
  id: string
  full_name: string
  phone: string
  user_type: string
}

type ClienteUser = {
  id: string
  email: string
}

type ClienteDashboardProps = {
  user: ClienteUser
  profile: Profile
  providers: Provider[]
}

function ProviderCard({ provider, onSelect }: { provider: Provider; onSelect: (provider: Provider) => void }) {
  // Calcular el precio mínimo de los productos activos
  const minPrice = useMemo(() => {
    if (!provider.products || provider.products.length === 0) return null
    const activePrices = provider.products.filter((p) => p.active).map((p) => p.price)
    return activePrices.length > 0 ? Math.min(...activePrices) : null
  }, [provider.products])

  // Obtener zona principal (primera si es array, o el string completo)
  const mainZone = Array.isArray(provider.zone) ? provider.zone[0] : provider.zone

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border border-gray-100 hover:border-blue-300"
      onClick={() => onSelect(provider)}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          <Droplet className="text-white w-8 h-8" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-900">{provider.business_name}</h3>
                {provider.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{provider.rating?.toFixed(1) || "N/A"}</span>
                  <span className="text-gray-500 text-sm">({provider.total_reviews || 0})</span>
                </div>
              </div>
            </div>

            {/* Precio */}
            {provider.show_prices && minPrice && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">${minPrice}</div>
                <div className="text-xs text-gray-500">desde</div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mt-3 line-clamp-2">{provider.description || "Sin descripción"}</p>

          {/* Zona */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">{mainZone || "Sin zona"}</span>
          </div>

          {/* Disponibilidad */}
          {provider.availability_days && provider.availability_days.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600">{provider.availability_days.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botón */}
      <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all">
        Ver catálogo y pedir
      </button>
    </div>
  )
}

function Navbar({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Droplet className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">AWA</span>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{userName}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function SearchFilters({
  filters,
  onFilterChange,
  availableZones,
}: {
  filters: any
  onFilterChange: (filters: any) => void
  availableZones: string[]
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda por texto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar proveedor</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del proveedor..."
            />
          </div>
        </div>

        {/* Filtro por zona */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zona</label>
          <select
            value={filters.zone}
            onChange={(e) => onFilterChange({ ...filters, zone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las zonas</option>
            {availableZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rating">Mejor calificados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="reviews">Más reseñas</option>
          </select>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={() => onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filters.verifiedOnly ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filters.verifiedOnly ? "✓ " : ""}Solo verificados
        </button>
      </div>
    </div>
  )
}

export default function ClienteDashboard({ user, profile, providers }: ClienteDashboardProps) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: "",
    zone: "",
    sortBy: "rating",
    verifiedOnly: false,
  })
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)

  const availableZones = useMemo(() => {
    const zones = new Set<string>()
    providers.forEach((p) => {
      if (p.zone) {
        if (Array.isArray(p.zone)) {
          p.zone.forEach((z) => zones.add(z))
        } else {
          zones.add(p.zone)
        }
      }
    })
    return Array.from(zones).sort()
  }, [providers])

  const filteredProviders = useMemo(() => {
    let result = [...providers]

    // Filtro por búsqueda de texto
    if (filters.search) {
      result = result.filter((p) => p.business_name.toLowerCase().includes(filters.search.toLowerCase()))
    }

    // Filtro por zona
    if (filters.zone) {
      result = result.filter((p) => {
        if (Array.isArray(p.zone)) {
          return p.zone.includes(filters.zone)
        }
        return p.zone === filters.zone
      })
    }

    // Filtro solo verificados
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.verified)
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (filters.sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
      if (filters.sortBy === "reviews") return (b.total_reviews || 0) - (a.total_reviews || 0)
      if (filters.sortBy === "price-asc" || filters.sortBy === "price-desc") {
        const getMinPrice = (provider: Provider) => {
          if (!provider.products || provider.products.length === 0) return Number.POSITIVE_INFINITY
          const activePrices = provider.products.filter((p) => p.active).map((p) => p.price)
          return activePrices.length > 0 ? Math.min(...activePrices) : Number.POSITIVE_INFINITY
        }
        const priceA = getMinPrice(a)
        const priceB = getMinPrice(b)
        return filters.sortBy === "price-asc" ? priceA - priceB : priceB - priceA
      }
      return 0
    })

    return result
  }, [providers, filters])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={profile.full_name || "Usuario"} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscá tu proveedor de agua</h1>
          <p className="text-gray-600">
            Encontrá los mejores proveedores en tu zona. Pedidos programados o inmediatos.
          </p>
        </div>

        {/* Filtros */}
        <SearchFilters filters={filters} onFilterChange={setFilters} availableZones={availableZones} />

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProviders.length}</span> proveedores encontrados
          </p>
        </div>

        {/* Lista de proveedores */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onSelect={setSelectedProvider} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No encontramos proveedores</h3>
            <p className="text-gray-600">Intentá con otros filtros o zona diferente</p>
          </div>
        )}
      </div>
    </div>
  )
}
