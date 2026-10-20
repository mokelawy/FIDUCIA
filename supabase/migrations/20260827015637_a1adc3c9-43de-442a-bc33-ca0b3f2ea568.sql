CREATE OR REPLACE FUNCTION public.decrement_variant_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.product_variants
      SET stock = GREATEST(0, stock - NEW.quantity)
      WHERE product_id = NEW.product_id AND color = NEW.color AND size = NEW.size;
    UPDATE public.products
      SET stock = GREATEST(0, stock - NEW.quantity)
      WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS order_items_decrement_stock ON public.order_items;
CREATE TRIGGER order_items_decrement_stock
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.decrement_variant_stock();