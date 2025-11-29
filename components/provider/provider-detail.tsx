"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, MapPin, Star, ShoppingCart, Plus, Minus, CheckCircle2, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Provider, Product, Review } from "@/lib/types/database"

interface CartItem {
  product: Product
  quantity: number
}

interface ProviderDetailProps {
  provider: Provider & { profile?: { full_name: string; phone: string } }
  products: Product[]
  reviews: (Review & { customer?: { full_name: string } })[]
}

export default function ProviderDetail({ provider, products, reviews }: ProviderDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"productos" | "resenas" | "info">("productos")
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = Math.max(0, Math.min(item.quantity + delta, item.product.stock))
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const getCartQuantity = (productId: string) => {
    return cart.find((item) => item.product.id === productId)?.quantity || 0
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-6">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>

          {/* Provider info */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-4xl">💧</span>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{provider.business_name}</h1>
                {provider.verified && (
                  <Badge className="bg-green-500 text-white border-0">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                {renderStars(Math.round(provider.rating))}
                <span className="text-lg font-semibold">{provider.rating.toFixed(1)}</span>
                <span className="opacity-90">({provider.total_reviews} reseñas)</span>
              </div>

              {/* Description */}
              {provider.description && <p className="text-white/90 mb-4 max-w-2xl">{provider.description}</p>}

              {/* Info pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{provider.zone}</span>
                </div>
                {provider.profile?.phone && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">{provider.profile.phone}</span>
                  </div>
                )}
                {provider.availability_days && provider.availability_days.length > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{provider.availability_days.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {["productos", "resenas", "info"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "resenas" ? "Reseñas" : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Productos Tab */}
        {activeTab === "productos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Catálogo de productos</h2>
            {products.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500">No hay productos disponibles</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const cartQty = getCartQuantity(product.id)
                  return (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Product image */}
                      <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">💧</span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        )}

                        {/* Stock */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">Stock:</span>
                          <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                            {product.stock} {product.unit}
                          </Badge>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                          <span className="text-gray-600 ml-2">/ {product.unit}</span>
                        </div>

                        {/* Add to cart */}
                        {cartQty === 0 ? (
                          <Button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Agregar al carrito
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(product.id, -1)}
                                className="h-10 w-10"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="flex-1 text-center font-semibold text-lg">{cartQty}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(product.id, 1)}
                                disabled={cartQty >= product.stock}
                                className="h-10 w-10"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-center text-green-600 font-medium">✓ {cartQty} en el carrito</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Reseñas Tab */}
        {activeTab === "resenas" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reseñas de clientes ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500">Aún no hay reseñas</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.customer?.full_name?.[0] || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{review.customer?.full_name || "Usuario"}</span>
                          {renderStars(review.rating)}
                        </div>
                        {review.comment && <p className="text-gray-700 mb-2">{review.comment}</p>}
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === "info" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del proveedor</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Ubicación y cobertura
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium">Dirección:</span> {provider.address}
                  </p>
                  <p>
                    <span className="font-medium">Zona:</span> {provider.zone}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Disponibilidad
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium">Días disponibles:</span>{" "}
                    {provider.availability_days?.join(", ") || "No especificado"}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-500" />
                  Contacto
                </h3>
                <div className="space-y-3 text-gray-700">
                  {provider.profile?.phone && (
                    <p>
                      <span className="font-medium">Teléfono:</span> {provider.profile.phone}
                    </p>
                  )}
                  {provider.profile?.full_name && (
                    <p>
                      <span className="font-medium">Contacto:</span> {provider.profile.full_name}
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Certificaciones
                </h3>
                <div className="space-y-3">
                  {provider.verified ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Proveedor Verificado
                    </Badge>
                  ) : (
                    <p className="text-gray-500">Sin certificaciones</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  {cartItemsCount} {cartItemsCount === 1 ? "producto" : "productos"}
                </p>
                <p className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ir al carrito
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
