// AWA Database Types
// Generated from Supabase schema

export type UserType = "cliente" | "proveedor"

export type OrderStatus = "pending" | "confirmed" | "in_progress" | "delivered" | "cancelled"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  user_type: UserType
  created_at: string
  updated_at: string
}

export interface Provider {
  id: string
  business_name: string
  description: string | null
  address: string
  zone: string
  latitude: number | null
  longitude: number | null
  availability_days: string[]
  rating: number
  total_reviews: number
  verified: boolean
  show_prices: boolean
  show_catalog: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  provider_id: string
  name: string
  description: string | null
  price: number
  unit: string
  stock: number
  image_url: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  provider_id: string
  status: OrderStatus
  delivery_address: string
  delivery_latitude: number | null
  delivery_longitude: number | null
  scheduled_date: string | null
  is_immediate: boolean
  total_amount: number
  payment_status: PaymentStatus
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  created_at: string
}

export interface DeliveryProof {
  id: string
  order_id: string
  photo_url: string
  latitude: number | null
  longitude: number | null
  notes: string | null
  delivered_at: string
  created_at: string
}

export interface Review {
  id: string
  order_id: string
  customer_id: string
  provider_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  related_order_id: string | null
  created_at: string
}

// Extended types with relations
export interface ProviderWithProfile extends Provider {
  profile: Profile
}

export interface ProductWithProvider extends Product {
  provider: Provider
}

export interface OrderWithDetails extends Order {
  customer: Profile
  provider: Provider
  items: (OrderItem & { product: Product })[]
  delivery_proof: DeliveryProof | null
}
