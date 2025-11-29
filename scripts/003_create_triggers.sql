-- AWA Database Triggers
-- Automatic profile creation and rating updates

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'cliente')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update provider rating
CREATE OR REPLACE FUNCTION public.update_provider_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.providers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE provider_id = NEW.provider_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;

  RETURN NEW;
END;
$$;

-- Trigger for updating provider rating after review
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_provider_rating();

DROP TRIGGER IF EXISTS on_review_updated ON public.reviews;

CREATE TRIGGER on_review_updated
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_provider_rating();

-- Function to create notification on order status change
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    -- Notify customer
    INSERT INTO public.notifications (user_id, title, message, type, related_order_id)
    VALUES (
      NEW.customer_id,
      'Actualización de pedido',
      'Tu pedido cambió a estado: ' || NEW.status,
      'order_update',
      NEW.id
    );

    -- Notify provider if status is 'pending'
    IF NEW.status = 'pending' THEN
      INSERT INTO public.notifications (user_id, title, message, type, related_order_id)
      VALUES (
        NEW.provider_id,
        'Nuevo pedido',
        'Tienes un nuevo pedido pendiente',
        'order_update',
        NEW.id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for order status notifications
DROP TRIGGER IF EXISTS on_order_status_changed ON public.orders;

CREATE TRIGGER on_order_status_changed
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.notify_order_status_change();
