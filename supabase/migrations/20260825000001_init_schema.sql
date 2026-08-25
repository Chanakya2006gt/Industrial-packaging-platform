-- ==============================================================================
-- Industrial Packaging & Converting — Cloud PostgreSQL Schema & RLS Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'sales')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 2. RFQ Inquiries (B2B Technical Specifications & Decision Gates)
CREATE TABLE IF NOT EXISTS public.rfq_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT UNIQUE NOT NULL, -- e.g. PZL-2026-0842
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    industry TEXT NOT NULL,
    category TEXT NOT NULL,
    substrate TEXT NOT NULL,
    dimensions_mm TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    roll_or_sheet TEXT NOT NULL,
    roll_core_mm INTEGER DEFAULT 76,
    rewind_direction INTEGER DEFAULT 1,
    embellishments JSONB DEFAULT '[]'::jsonb,
    artwork_file_url TEXT,
    artwork_original_name TEXT,
    artwork_size_bytes BIGINT,
    quote_pdf_url TEXT,
    quote_pdf_name TEXT,
    notes TEXT,
    internal_notes TEXT,
    assigned_estimator TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'reviewing', 'quoted', 'confirmed',
        'in_production', 'dispatched', 'settled', 'cancelled'
    )),
    settled_at TIMESTAMPTZ,
    settled_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Physical Sample Kit Requests
CREATE TABLE IF NOT EXISTS public.sample_kit_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT UNIQUE NOT NULL, -- e.g. SMP-2026-0198
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    industry TEXT NOT NULL,
    sample_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    delivery_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'delivered')),
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Dynamic Catalog Products
CREATE TABLE IF NOT EXISTS public.catalog_products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    substrate_specs JSONB NOT NULL,
    finish_options JSONB NOT NULL,
    typical_lead_time TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Plant Operational Settings & Announcements
CREATE TABLE IF NOT EXISTS public.plant_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Security Audit Trail Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    payload_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_rfq_updated_at ON public.rfq_inquiries;
CREATE TRIGGER set_rfq_updated_at
BEFORE UPDATE ON public.rfq_inquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_kit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() AND is_active = TRUE;
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public can view active profiles minimal" ON public.profiles
FOR SELECT USING (is_active = TRUE);

CREATE POLICY "SuperAdmin can manage all profiles" ON public.profiles
FOR ALL USING (public.get_user_role() = 'superadmin');

-- 2. RFQ Inquiries Policies
CREATE POLICY "Public can submit RFQs" ON public.rfq_inquiries
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Staff can view and update RFQs" ON public.rfq_inquiries
FOR ALL USING (public.get_user_role() IN ('superadmin', 'sales'));

-- 3. Sample Kit Requests Policies
CREATE POLICY "Public can request sample kits" ON public.sample_kit_requests
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Staff can view and update sample kits" ON public.sample_kit_requests
FOR ALL USING (public.get_user_role() IN ('superadmin', 'sales'));

-- 4. Catalog Products Policies
CREATE POLICY "Public can view active catalog products" ON public.catalog_products
FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Staff can manage catalog products" ON public.catalog_products
FOR ALL USING (public.get_user_role() IN ('superadmin', 'sales'));

-- 5. Plant Settings Policies
CREATE POLICY "Public can view plant settings" ON public.plant_settings
FOR SELECT USING (TRUE);

CREATE POLICY "SuperAdmin can manage plant settings" ON public.plant_settings
FOR ALL USING (public.get_user_role() = 'superadmin');

-- 6. Audit Logs Policies
CREATE POLICY "Staff can insert audit logs" ON public.audit_logs
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "SuperAdmin can view audit logs" ON public.audit_logs
FOR SELECT USING (public.get_user_role() = 'superadmin');
