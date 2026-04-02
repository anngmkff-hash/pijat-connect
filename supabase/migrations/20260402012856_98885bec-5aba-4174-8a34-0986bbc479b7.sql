
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  mitra_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can create reviews for their completed orders"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = customer_id
  AND EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_id
    AND orders.customer_id = auth.uid()
    AND orders.status = 'completed'
  )
);

CREATE POLICY "Customers can view their own reviews"
ON public.reviews FOR SELECT TO authenticated
USING (auth.uid() = customer_id);

CREATE POLICY "Mitra can view reviews about them"
ON public.reviews FOR SELECT TO authenticated
USING (auth.uid() = mitra_id);

CREATE POLICY "Admins can manage reviews"
ON public.reviews FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view reviews publicly"
ON public.reviews FOR SELECT
USING (true);
