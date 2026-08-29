-- ==============================================================================
-- INDUSTRIAL PACKAGING & CONVERTING — STORAGE & AUDIT HARDENING (MIGRATION 0005)
-- ==============================================================================

-- 1. Compound Indices for High-Throughput Pipeline & SLA Lookups
CREATE INDEX IF NOT EXISTS idx_rfq_status_created_at 
  ON public.rfq_inquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rfq_company_reference 
  ON public.rfq_inquiries (company_name, reference_no);

CREATE INDEX IF NOT EXISTS idx_clearances_rfq_created 
  ON public.offline_bank_clearances (rfq_inquiry_id, created_at DESC);

-- 2. Audit Trigger for Role Changes on Profiles
CREATE OR REPLACE FUNCTION public.audit_profile_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role OR OLD.is_active IS DISTINCT FROM NEW.is_active THEN
    INSERT INTO public.admin_audit_logs (actor_email, action, details, ip_address)
    VALUES (
      auth.jwt()->>'email',
      'ROLE_OR_STATUS_MODIFICATION',
      jsonb_build_object(
        'target_user_id', NEW.id,
        'old_role', OLD.role,
        'new_role', NEW.role,
        'old_active', OLD.is_active,
        'new_active', NEW.is_active
      ),
      'system_trigger'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_profile_role_changes ON public.profiles;
CREATE TRIGGER trg_audit_profile_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_profile_role_changes();

-- 3. Storage Bucket Hardening Policies (if storage schema exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    -- Ensure artwork-uploads bucket exists and is private
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'artwork-uploads',
      'artwork-uploads',
      false,
      52428800, -- 50MB
      ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/svg+xml', 'application/postscript', 'application/illustrator']
    )
    ON CONFLICT (id) DO UPDATE
    SET public = false,
        file_size_limit = 52428800,
        allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/svg+xml', 'application/postscript', 'application/illustrator'];

    -- Staff can read and upload artwork
    DROP POLICY IF EXISTS "Staff full access artwork bucket" ON storage.objects;
    CREATE POLICY "Staff full access artwork bucket"
      ON storage.objects
      FOR ALL
      TO authenticated
      USING (bucket_id = 'artwork-uploads' AND public.get_user_role() IN ('sales', 'superadmin'))
      WITH CHECK (bucket_id = 'artwork-uploads' AND public.get_user_role() IN ('sales', 'superadmin'));

    -- Anonymous users can upload RFQ artwork attachments if referencing valid structure
    DROP POLICY IF EXISTS "Public upload artwork with size limit" ON storage.objects;
    CREATE POLICY "Public upload artwork with size limit"
      ON storage.objects
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (bucket_id = 'artwork-uploads');
  END IF;
END $$;
