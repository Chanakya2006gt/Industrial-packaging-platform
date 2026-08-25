-- ==============================================================================
-- INDUSTRIAL PACKAGING & CONVERTING — SALES CRM & RATE CARDS SCHEMA
-- ==============================================================================

-- 1. Supplier Raw Material Rate Cards
CREATE TABLE IF NOT EXISTS public.supplier_rate_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_key VARCHAR(100) NOT NULL UNIQUE,
    material_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    cost_per_sqm_zmw NUMERIC(10, 2) NOT NULL,
    supplier_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial default material rates
INSERT INTO public.supplier_rate_cards (material_key, material_name, category, cost_per_sqm_zmw)
VALUES 
    ('polypropylene_white', 'White Gloss BOPP 60μm', 'Roll Film', 12.50),
    ('polypropylene_clear', 'Crystal Clear BOPP', 'Roll Film', 14.20),
    ('polypropylene_silver', 'Silver Metallized BOPP', 'Roll Film', 18.00),
    ('fasson_semi_gloss', 'Fasson Semi-Gloss Paper', 'Paper Label', 8.50),
    ('fbb_carton', 'Folding Boxboard FBB 350gsm', 'Carton Board', 9.80),
    ('solid_bleached_board', 'Solid Bleached Board SBB', 'Carton Board', 15.00)
ON CONFLICT (material_key) DO UPDATE 
SET cost_per_sqm_zmw = EXCLUDED.cost_per_sqm_zmw,
    updated_at = NOW();

-- 2. Offline Bank Payment Clearance Records
CREATE TABLE IF NOT EXISTS public.offline_bank_clearances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_reference_no VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- stanbic_wire, zanaco_wire, cheque, cash
    bank_reference_no VARCHAR(150) NOT NULL,
    amount_zmw NUMERIC(12, 2) NOT NULL,
    cleared_by VARCHAR(150) NOT NULL,
    cleared_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.supplier_rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_bank_clearances ENABLE ROW LEVEL SECURITY;

-- Public can read active supplier rates
CREATE POLICY "Public read active rates"
    ON public.supplier_rate_cards
    FOR SELECT
    USING (is_active = true);

-- Staff can modify supplier rates
CREATE POLICY "Staff manage rates"
    ON public.supplier_rate_cards
    FOR ALL
    TO authenticated
    USING (true);

-- Staff manage bank clearances
CREATE POLICY "Staff manage clearances"
    ON public.offline_bank_clearances
    FOR ALL
    TO authenticated
    USING (true);
