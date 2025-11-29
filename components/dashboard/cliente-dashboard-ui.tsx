"use client"

import { useState } from "react"
import { Search, MapPin, Star, Clock, ShoppingCart, User, LogOut, Droplet, CheckCircle } from "lucide-react"

// Mock data de proveedores (después viene de Supabase)
const mockProviders = [
  {
    id: "1",
    businessName: "Agua Pura del Sur",
    logo: "💧",
    rating: 4.8,
    totalReviews: 124,
    isVerified: true,
    zones: ["Recoleta", "Palermo"],
    price: 850,
    availability: ["Lunes", "Miércoles", "Viernes"],
    description: "Agua purificada de alta calidad. Servicio rápido y confiable.",
  },
  {
    id: "2",
    businessName: "Distribuidora La Plata",
    logo: "🌊",
    rating: 4.9,
    totalReviews: 89,
    isVerified: true,
    zones: ["La Plata Centro", "La Plata Este"],
    price: 780,
    availability: ["Martes", "Jueves", "Sábado"],
    description: "Más de 20 años en el mercado. Bidones de 20L.",
  },
  {
    id: "3",
    businessName: "AguaFresca Express",
    logo: "💦",
    rating: 4.6,
    totalReviews: 67,
    isVerified: false,
    zones: ["Recoleta", "Barrio Norte"],
    price: 900,
    availability: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    description: "Entrega en el día. Servicio express disponible.",
  },
  {
    id: "4",
    businessName: "Manantial Natural",
    logo: "⛲",
    rating: 4.7,
    totalReviews: 156,
    isVerified: true,
    zones: ["Palermo", "Belgrano"],
    price: 820,
    availability: ["Lunes", "Miércoles", "Viernes"],
    description: "Agua de manantial natural. Certificada por ANMAT.",
  },
]

function ProviderCard({ provider, onSelect }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border border-gray-100 hover:border-blue-300"
      onClick={() => onSelect(provider)}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          {provider.logo}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-900">{provider.businessName}</h3>
                {provider.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{provider.rating}</span>
                  <span className="text-gray-500 text-sm">({provider.totalReviews})</span>
                </div>
              </div>
            </div>

            {/* Precio */}
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">${provider.price}</div>
              <div className="text-xs text-gray-500">por bidón 20L</div>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mt-3">{provider.description}</p>

          {/* Zonas */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <MapPin className="w-4 h-4 text-gray-400" />
            {provider.zones.map((zone) => (
              <span key={zone} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {zone}
              </span>
            ))}
          </div>

          {/* Disponibilidad */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">{provider.availability.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Botón */}
      <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all">
        Ver catálogo y pedir
      </button>
    </div>
  )
}

function Navbar({ userName, onLogout }) {
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
              <User className="w-5 h-5 text-gray-600" />
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

function SearchFilters({ filters, onFilterChange }) {
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
            <option value="Recoleta">Recoleta</option>
            <option value="Palermo">Palermo</option>
            <option value="La Plata Centro">La Plata Centro</option>
            <option value="La Plata Este">La Plata Este</option>
            <option value="Belgrano">Belgrano</option>
            <option value="Barrio Norte">Barrio Norte</option>
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
          ✓ Solo verificados
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
          Disponible hoy
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
          Precio económico
        </button>
      </div>
    </div>
  )
}

export default function ClienteDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    zone: "",
    sortBy: "rating",
    verifiedOnly: false,
  })
  const [selectedProvider, setSelectedProvider] = useState(null)

  // Filtrar proveedores
  let filteredProviders = mockProviders

  if (filters.search) {
    filteredProviders = filteredProviders.filter((p) =>
      p.businessName.toLowerCase().includes(filters.search.toLowerCase()),
    )
  }

  if (filters.zone) {
    filteredProviders = filteredProviders.filter((p) => p.zones.includes(filters.zone))
  }

  if (filters.verifiedOnly) {
    filteredProviders = filteredProviders.filter((p) => p.isVerified)
  }

  // Ordenar
  filteredProviders = [...filteredProviders].sort((a, b) => {
    if (filters.sortBy === "rating") return b.rating - a.rating
    if (filters.sortBy === "price-asc") return a.price - b.price
    if (filters.sortBy === "price-desc") return b.price - a.price
    if (filters.sortBy === "reviews") return b.totalReviews - a.totalReviews
    return 0
  })

  const handleLogout = () => {
    alert("Cerrando sesión...")
    // Aquí irá: supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="Juan Pérez" onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscá tu proveedor de agua</h1>
          <p className="text-gray-600">
            Encontrá los mejores proveedores en tu zona. Pedidos programados o inmediatos.
          </p>
        </div>

        {/* Filtros */}
        <SearchFilters filters={filters} onFilterChange={setFilters} />

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProviders.length}</span> proveedores encontrados
          </p>
        </div>

        {/* Lista de proveedores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} onSelect={setSelectedProvider} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProviders.length === 0 && (
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
