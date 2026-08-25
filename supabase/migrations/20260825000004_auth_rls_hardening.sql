-- ==============================================================================
-- INDUSTRIAL PACKAGING & CONVERTING — AUTH & RLS SECURITY HARDENING (MIGRATION 0004)
-- ==============================================================================

-- 1. Helper function to safely fetch authenticated user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() AND is_active = TRUE;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Drop any legacy or overly permissive profile policies
DROP POLICY IF EXISTS "Public can view active profiles minimal" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "SuperAdmin can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superadmins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superadmins can manage profiles" ON public.profiles;

-- 3. Hardened Profile Policies
-- Authenticated users can only read their own profile row
CREATE POLICY "Users select own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id AND is_active = TRUE);

-- SuperAdmins have full visibility and management on profiles
CREATE POLICY "Superadmin manage all profiles"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (public.get_user_role() = 'superadmin')
    WITH CHECK (public.get_user_role() = 'superadmin');

-- 4. Secure handle_new_user() trigger (Prevents privilege escalation on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Strict guard: never allow 'superadmin' role via user metadata
  INSERT INTO public.profiles (id, full_name, email, role, is_active)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Staff Member'),
    new.email,
    'sales', -- All new signups default strictly to sales; superadmin must be elevated by executive
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Hardened Rate Cards Policies
DROP POLICY IF EXISTS "Public read active rates" ON public.supplier_rate_cards;
DROP POLICY IF EXISTS "Staff manage rates" ON public.supplier_rate_cards;

-- Public can read active supplier rate cards
CREATE POLICY "Public read active rate cards"
    ON public.supplier_rate_cards
    FOR SELECT
    USING (is_active = true);

-- Staff (Sales & Superadmin) can insert and update rate cards
CREATE POLICY "Staff insert update rate cards"
    ON public.supplier_rate_cards
    FOR INSERT
    TO authenticated
    WITH CHECK (public.get_user_role() IN ('sales', 'superadmin'));

CREATE POLICY "Staff update rate cards"
    ON public.supplier_rate_cards
    FOR UPDATE
    TO authenticated
    USING (public.get_user_role() IN ('sales', 'superadmin'))
    WITH CHECK (public.get_user_role() IN ('sales', 'superadmin'));

-- Only SuperAdmin can delete rate cards
CREATE POLICY "Superadmin delete rate cards"
    ON public.supplier_rate_cards
    FOR DELETE
    TO authenticated
    USING (public.get_user_role() = 'superadmin');

-- 6. Hardened Offline Bank Clearance Policies
DROP POLICY IF EXISTS "Staff manage clearances" ON public.offline_bank_clearances;

CREATE POLICY "Staff select clearances"
    ON public.offline_bank_clearances
    FOR SELECT
    TO authenticated
    USING (public.get_user_role() IN ('sales', 'superadmin'));

CREATE POLICY "Staff insert clearances"
    ON public.offline_bank_clearances
    FOR INSERT
    TO authenticated
    WITH CHECK (public.get_user_role() IN ('sales', 'superadmin'));

-- 7. Hardened RFQ Inquiries Policies
DROP POLICY IF EXISTS "Public can submit RFQs" ON public.rfq_inquiries;
DROP POLICY IF EXISTS "Staff can view and update RFQs" ON public.rfq_inquiries;

CREATE POLICY "Public insert RFQs"
    ON public.rfq_inquiries
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff select RFQs"
    ON public.rfq_inquiries
    FOR SELECT
    TO authenticated
    USING (public.get_user_role() IN ('sales', 'superadmin'));

CREATE POLICY "Staff update RFQs"
    ON public.rfq_inquiries
    FOR UPDATE
    TO authenticated
    USING (public.get_user_role() IN ('sales', 'superadmin'))
    WITH CHECK (public.get_user_role() IN ('sales', 'superadmin'));
