"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  MapPin,
  Calendar,
  Menu,
  X,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  Droplet,
  User,
  Phone,
  Settings,
  Tag,
  Plus,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Order = {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  profiles: {
    full_name: string
    phone: string
  }
  order_items: Array<{
    quantity: number
    products: {
      name: string
      price: number
    }
  }>
}

type Product = {
  id: string
  name: string
  price: number
  stock: number
  is_active: boolean
}

export default function ProveedorDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"pedidos" | "productos" | "estadisticas" | "promociones">("pedidos")
  const [provider, setProvider] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState({
    totalVentas: 0,
    pedidosPendientes: 0,
    productosActivos: 0,
    rating: 0,
  })
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showPromotionForm, setShowPromotionForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "bidon",
  })

  useEffect(() => {
    loadProviderData()
  }, [])

  const loadProviderData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Obtener datos del proveedor
      const { data: providerData } = await supabase.from("providers").select("*").eq("user_id", user.id).single()

      setProvider(providerData)

      if (providerData) {
        // Obtener pedidos
        const { data: ordersData } = await supabase
          .from("orders")
          .select(
            `
            *,
            profiles!orders_client_id_fkey(full_name, phone),
            order_items(
              quantity,
              products(name, price)
            )
          `,
          )
          .eq("provider_id", providerData.id)
          .order("created_at", { ascending: false })
          .limit(10)

        setOrders(ordersData || [])

        // Obtener productos
        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .eq("provider_id", providerData.id)
          .order("name")

        setProducts(productsData || [])

        // Calcular estadísticas
        const totalVentas = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
        const pedidosPendientes = ordersData?.filter((o) => o.status === "pending").length || 0
        const productosActivos = productsData?.filter((p) => p.is_active).length || 0

        setStats({
          totalVentas,
          pedidosPendientes,
          productosActivos,
          rating: providerData.average_rating || 0,
        })
      }
    } catch (error) {
      console.error("[v0] Error loading provider data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

    if (!error) {
      loadProviderData()
    }
  }

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !isActive }).eq("id", productId)

    if (!error) {
      loadProviderData()
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!provider) return

    const { error } = await supabase.from("products").insert({
      provider_id: provider.id,
      name: newProduct.name,
      description: newProduct.description,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      category: newProduct.category,
      is_active: true,
    })

    if (!error) {
      setShowProductForm(false)
      setNewProduct({ name: "", description: "", price: "", stock: "", category: "bidon" })
      loadProviderData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
      in_transit: { label: "En camino", color: "bg-purple-100 text-purple-800", icon: Package },
      delivered: { label: "Entregado", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
      cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
    }
    const badge = badges[status as keyof typeof badges] || badges.pending
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">AWA Proveedor</h1>
                <p className="text-xs text-gray-500">{provider?.business_name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">{provider?.business_name}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{provider?.business_name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {provider?.phone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {provider?.coverage_zones?.[0]}
                    </p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configuración
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out mt-16 lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab("pedidos")
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "pedidos"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Pedidos</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("productos")
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "productos"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Productos</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("estadisticas")
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "estadisticas"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Estadísticas</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("promociones")
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "promociones"
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Tag className="w-5 h-5" />
              <span className="font-medium">Promociones</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalVentas.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Ventas</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pedidosPendientes}</p>
              <p className="text-sm text-gray-600">Pedidos Pendientes</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.productosActivos}</p>
              <p className="text-sm text-gray-600">Productos Activos</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Rating Promedio</p>
            </div>
          </div>

          {/* Pedidos Tab */}
          {activeTab === "pedidos" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Pedidos Recientes</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay pedidos todavía</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">#{order.order_number}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {order.profiles?.full_name}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_at).toLocaleDateString("es-AR")}
                            </p>
                          </div>
                          <div className="mt-2">
                            {order.order_items?.map((item, idx) => (
                              <p key={idx} className="text-sm text-gray-600">
                                {item.quantity}x {item.products?.name}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${order.total_amount.toLocaleString()}</p>
                          {order.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => updateOrderStatus(order.id, "confirmed")}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                              >
                                Aceptar
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, "cancelled")}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                              >
                                Rechazar
                              </button>
                            </div>
                          )}
                          {order.status === "confirmed" && (
                            <button
                              onClick={() => updateOrderStatus(order.id, "in_transit")}
                              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                            >
                              Marcar en camino
                            </button>
                          )}
                          {order.status === "in_transit" && (
                            <button
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                            >
                              Marcar entregado
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Productos Tab */}
          {activeTab === "productos" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Mis Productos</h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-medium hover:from-sky-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Producto
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {products.length === 0 ? (
                  <div className="col-span-full p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay productos cargados</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-2xl font-bold text-sky-500 mt-1">${product.price}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Stock: {product.stock} unidades</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleProductStatus(product.id, product.is_active)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            product.is_active
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {product.is_active ? "Desactivar" : "Activar"}
                        </button>
                        <button className="px-3 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors">
                          Editar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Promociones Tab */}
          {activeTab === "promociones" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Promociones</h2>
                <button
                  onClick={() => setShowPromotionForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-medium hover:from-sky-600 hover:to-cyan-600 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear Promoción
                </button>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay promociones activas</p>
                  <p className="text-sm text-gray-400 mt-2">Las promociones te ayudan a destacar tu negocio</p>
                </div>
              </div>
            </div>
          )}

          {/* Estadísticas Tab */}
          {activeTab === "estadisticas" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Negocio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ventas Totales</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.totalVentas.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pedidos Completados</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {orders.filter((o) => o.status === "delivered").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating Promedio</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
                      <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Productos Activos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.productosActivos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Proveedor</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span>{provider?.business_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{provider?.coverage_zones?.join(", ") || "Sin zonas configuradas"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{provider?.available_days?.join(", ") || "Sin días configurados"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Agregar Nuevo Producto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Ej: Bidón 20L"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe tu producto..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="bidon">Bidón</option>
                  <option value="botella">Botella</option>
                  <option value="dispenser">Dispenser</option>
                  <option value="soda">Soda</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-medium hover:from-sky-600 hover:to-cyan-600 transition-all"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
