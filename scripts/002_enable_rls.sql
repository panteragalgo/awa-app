-- AWA Row Level Security (RLS) Policies
-- Security is non-negotiable per guidelines

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- PROVIDERS POLICIES
-- Anyone can view verified providers
CREATE POLICY "providers_select_verified"
  ON public.providers FOR SELECT
  USING (verified = TRUE);

-- Providers can view their own data (even if not verified)
CREATE POLICY "providers_select_own"
  ON public.providers FOR SELECT
  USING (auth.uid() = id);

-- Providers can insert their own data
CREATE POLICY "providers_insert_own"
  ON public.providers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Providers can update their own data
CREATE POLICY "providers_update_own"
  ON public.providers FOR UPDATE
  USING (auth.uid() = id);

-- PRODUCTS POLICIES
-- Anyone can view active products from verified providers
CREATE POLICY "products_select_active"
  ON public.products FOR SELECT
  USING (
    active = TRUE 
    AND EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = products.provider_id 
      AND providers.verified = TRUE
    )
  );

-- Providers can view their own products
CREATE POLICY "products_select_own"
  ON public.products FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE id = auth.uid()
    )
  );

-- Providers can insert their own products
CREATE POLICY "products_insert_own"
  ON public.products FOR INSERT
  WITH CHECK (
    provider_id IN (
      SELECT id FROM public.providers WHERE id = auth.uid()
    )
  );

-- Providers can update their own products
CREATE POLICY "products_update_own"
  ON public.products FOR UPDATE
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE id = auth.uid()
    )
  );

-- Providers can delete their own products
CREATE POLICY "products_delete_own"
  ON public.products FOR DELETE
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE id = auth.uid()
    )
  );

-- ORDERS POLICIES
-- Customers can view their own orders
CREATE POLICY "orders_select_customer"
  ON public.orders FOR SELECT
  USING (customer_id = auth.uid());

-- Providers can view orders assigned to them
CREATE POLICY "orders_select_provider"
  ON public.orders FOR SELECT
  USING (provider_id = auth.uid());

-- Customers can create orders
CREATE POLICY "orders_insert_customer"
  ON public.orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Customers can update their own pending orders
CREATE POLICY "orders_update_customer"
  ON public.orders FOR UPDATE
  USING (customer_id = auth.uid() AND status = 'pending');

-- Providers can update orders assigned to them
CREATE POLICY "orders_update_provider"
  ON public.orders FOR UPDATE
  USING (provider_id = auth.uid());

-- ORDER ITEMS POLICIES
-- Users can view order items if they can view the order
CREATE POLICY "order_items_select"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE customer_id = auth.uid() OR provider_id = auth.uid()
    )
  );

-- Customers can insert order items for their orders
CREATE POLICY "order_items_insert"
  ON public.order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders WHERE customer_id = auth.uid()
    )
  );

-- DELIVERY PROOFS POLICIES
-- Customers and providers can view proofs for their orders
CREATE POLICY "delivery_proofs_select"
  ON public.delivery_proofs FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE customer_id = auth.uid() OR provider_id = auth.uid()
    )
  );

-- Providers can insert delivery proofs for their orders
CREATE POLICY "delivery_proofs_insert"
  ON public.delivery_proofs FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders WHERE provider_id = auth.uid()
    )
  );

-- REVIEWS POLICIES
-- Anyone can view reviews
CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT
  USING (true);

-- Customers can insert reviews for their delivered orders
CREATE POLICY "reviews_insert_customer"
  ON public.reviews FOR INSERT
  WITH CHECK (
    customer_id = auth.uid()
    AND order_id IN (
      SELECT id FROM public.orders 
      WHERE customer_id = auth.uid() 
      AND status = 'delivered'
    )
  );

-- Customers can update their own reviews
CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE
  USING (customer_id = auth.uid());

-- NOTIFICATIONS POLICIES
-- Users can view their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System can insert notifications (handled via service role key in backend)
-- No public insert policy needed
