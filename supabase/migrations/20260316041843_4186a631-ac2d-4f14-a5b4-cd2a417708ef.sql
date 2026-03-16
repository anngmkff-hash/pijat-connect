
-- 1. Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS policies for kyc-documents bucket
-- Users can upload their own KYC documents
CREATE POLICY "Users can upload own KYC docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can view their own KYC documents
CREATE POLICY "Users can view own KYC docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Admins can view all KYC documents
CREATE POLICY "Admins can view all KYC docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'kyc-documents' AND public.has_role(auth.uid(), 'admin'));

-- 3. Create security definer function for mitra registration
CREATE OR REPLACE FUNCTION public.register_as_mitra(
  _user_id UUID,
  _bio TEXT DEFAULT NULL,
  _ktp_url TEXT DEFAULT NULL,
  _certificate_url TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update role from customer to mitra
  UPDATE public.user_roles
  SET role = 'mitra'
  WHERE user_id = _user_id AND role = 'customer';

  -- Create mitra profile
  INSERT INTO public.mitra_profiles (user_id, bio, ktp_url, certificate_url, verification_status, status)
  VALUES (_user_id, _bio, _ktp_url, _certificate_url, 'pending', 'inactive')
  ON CONFLICT DO NOTHING;
END;
$$;
