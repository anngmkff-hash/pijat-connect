
-- Payments table for tracking simulated payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'transfer_bank',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_proof_url TEXT,
  admin_notes TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id)
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Customers can create payments for their orders
CREATE POLICY "Customers can create payments" ON public.payments
  FOR INSERT TO public
  WITH CHECK (auth.uid() = customer_id);

-- Customers can view their own payments
CREATE POLICY "Customers can view own payments" ON public.payments
  FOR SELECT TO public
  USING (auth.uid() = customer_id);

-- Admins can manage all payments
CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Mitra can view payments for their assigned orders
CREATE POLICY "Mitra can view assigned order payments" ON public.payments
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payments.order_id 
      AND orders.mitra_id = auth.uid()
    )
  );

-- Updated at trigger
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
