
-- Allow mitra to update orders assigned to them (accept/reject/complete)
CREATE POLICY "Mitra can update assigned orders"
ON public.orders
FOR UPDATE
TO public
USING (auth.uid() = mitra_id)
WITH CHECK (auth.uid() = mitra_id);

-- Allow mitra to see unassigned pending orders (so they can claim them)
CREATE POLICY "Mitra can view pending unassigned orders"
ON public.orders
FOR SELECT
TO public
USING (
  status = 'pending' AND mitra_id IS NULL AND
  public.has_role(auth.uid(), 'mitra')
);

-- Allow mitra to claim unassigned pending orders (update mitra_id to themselves)
CREATE POLICY "Mitra can claim pending orders"
ON public.orders
FOR UPDATE
TO public
USING (
  status = 'pending' AND mitra_id IS NULL AND
  public.has_role(auth.uid(), 'mitra')
)
WITH CHECK (auth.uid() = mitra_id);
