-- ==============================================================================
-- PrintFast Zambia Limited (PZL) — Database Seed Script
-- ==============================================================================

-- 1. Default Plant Settings & Media Slots
INSERT INTO public.plant_settings (key, value, description)
VALUES
    ('plant_status_notice', 'Plant Status: 24/7 Continuous Shifts • Mwembeshi Road, Lusaka', 'Top bar operational notice'),
    ('sales_phone', '+260 974 423 496', 'Primary sales estimating phone'),
    ('whatsapp_number', '+260 974 423 496', 'Direct WhatsApp plant dispatch phone'),
    ('sales_email', 'sales@printfastzambia.com', 'Official RFQ reception inbox'),
    ('factory_location', 'Plot 35288 Mwembeshi Road, Light Industrial Area, Lusaka, Zambia', 'Physical manufacturing plant address'),
    ('default_currency', 'ZMW', 'Default billing currency'),
    ('quote_turnaround_text', 'Quote Turnaround: < 4 Hours', 'Estimating speed commitment'),
    ('media_site_logo', 'assets/logo.svg', 'Primary brand logo vector/image'),
    ('media_hero_packaging', 'assets/img/hero-packaging.jpg', 'Hero packaging and proofing photo'),
    ('media_press_flexo', 'assets/img/press-flexo-8c.jpg', '8-Colour Flexo UV press photo'),
    ('media_press_offset', 'assets/img/press-heidelberg-6c.jpg', 'Heidelberg Speedmaster 6C press photo'),
    ('media_prepress_ctp', 'assets/img/prepress-ctp.jpg', 'Heidelberg Suprasetter CTP cleanroom photo'),
    ('media_cartons_packaging', 'assets/img/cartons-packaging.jpg', 'Folding boxboard packaging photo')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- 2. Dynamic Catalog Products
INSERT INTO public.catalog_products (
    id, slug, category, title, tagline, description, substrate_specs, finish_options, typical_lead_time, image_url, sort_order
) VALUES
    (
        'prod_flexo_labels',
        'flexographic-self-adhesive-labels',
        'labels',
        'Flexographic Self-Adhesive Roll Labels',
        'High-speed roll labels up to 8 colours with UV curing and inline cold foil embellishment.',
        'Manufactured for high-speed automated bottling lines and packaging applicators across pharmaceutical, beverage, edible oil, and FMCG sectors. Available in full FINAT rewind orientations 1–8 with 25mm, 40mm, or 76mm cores.',
        '["White Polypropylene (BOPP 60μm)", "Clear BOPP (No-Look Label Effect)", "Silver Metallized Foil BOPP", "Fasson Semi-Gloss High-Tack Paper", "Direct Thermal Eco & Thermal Top", "Tamper-Evident Void & Destructible Vinyl", "Biodegradable Cellophane Film"]'::jsonb,
        '["High-Gloss UV Protective Varnish", "Matt Silky Soft Varnish", "Inline Rotary Cold Foil Stamping (Gold/Silver)", "Tactile Screen Printed Varnishes", "Gloss / Matt Thermal Lamination", "Rotary Die-Cut Perforations & Slits"]'::jsonb,
        '3–5 working days (24/7 press schedule)',
        '/assets/img/press-flexo-8c.jpg',
        1
    ),
    (
        'prod_offset_cartons',
        'heidelberg-offset-folding-cartons',
        'cartons',
        'Heidelberg Multi-Colour Folding Cartons',
        'Up to 6-colour precision lithography + inline dispersion/UV coating up to 28.5" × 40".',
        'Engineered for pharmaceutical blister pack outer boxes, food & confectionery cartons, consumer goods packaging, and cosmetic retail boxes with calibrated CTP prepress registration.',
        '["Folding Boxboard (FBB 250–450 gsm)", "Solid Bleached Board (SBB / GZ)", "White-Lined Chipboard (WLC)", "Virgin Kraft Board & Food-Grade Board", "Holographic Metallized Board"]'::jsonb,
        '["Inline Dispersion & Aqueous Coating", "UV Spot Varnish & High-Gloss Flood", "Precision Platen Die-Cutting & Creasing", "Hot Foil Stamping (Metallic Gold/Bronze/Holographic)", "Multi-Level Blind Embossing & Debossing", "Crash-Lock & Side-Seam Gluing"]'::jsonb,
        '4–7 working days',
        '/assets/img/press-heidelberg-6c.jpg',
        2
    ),
    (
        'prod_commercial_print',
        'commercial-publishing-stationery',
        'commercial',
        'Commercial Publishing & Security Collateral',
        'Corporate annual reports, periodicals, brochures, danglers, posters, and security stationery.',
        'High-fidelity commercial print runs backed by Heidelberg Speedmaster press lines, CTP prepress color management, and industrial post-press binding suites.',
        '["Gloss / Matt Art Paper (115–350 gsm)", "High-Bulk Book Wove & Uncoated Offset", "Carbonless NCR Security Paper (CB, CFB, CF)", "Heavyweight Cover Boards"]'::jsonb,
        '["Soft-Touch Velvet Lamination", "Saddle-Stitching & Automated Trimming", "Perfect Binding & PUR Hot-Melt Binding", "Sequential Numbering & Security Barcoding", "Die-Cut Danglers & Display Stands"]'::jsonb,
        '2–4 working days',
        '/assets/img/cartons-packaging.jpg',
        3
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    substrate_specs = EXCLUDED.substrate_specs,
    finish_options = EXCLUDED.finish_options,
    typical_lead_time = EXCLUDED.typical_lead_time,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order;

-- 3. Initial Demonstrative RFQ Pipeline Items
INSERT INTO public.rfq_inquiries (
    id, reference_no, company_name, contact_name, email, phone, industry,
    category, substrate, dimensions_mm, quantity, roll_or_sheet, roll_core_mm,
    rewind_direction, embellishments, notes, status, assigned_estimator
) VALUES
    (
        'a1b2c3d4-0001-4000-8000-000000000001',
        'PZL-2026-0801',
        'Zambian Breweries PLC',
        'Mulenga Chileshe',
        'procurement@zambianbreweries.co.zm',
        '+260 977 123 456',
        'Beverage',
        'flexo_labels',
        'polypropylene_white',
        '85x120',
        500000,
        'roll',
        76,
        3,
        '["uv_varnish", "cold_foil"]'::jsonb,
        'High-speed rotary bottling line. Need sample swatch before mass run.',
        'pending',
        'Chanakya (Sales Director)'
    ),
    (
        'a1b2c3d4-0002-4000-8000-000000000002',
        'PZL-2026-0802',
        'Lusaka Pharma Laboratories',
        'Dr. Karen Banda',
        'k.banda@lusakapharma.com',
        '+260 966 987 654',
        'Pharmaceutical',
        'offset_packaging',
        'fbb_carton',
        '60x60x140',
        100000,
        'sheet',
        NULL,
        NULL,
        '["uv_varnish", "embossing"]'::jsonb,
        'Outer cartons for 100ml cough syrup bottles. Embossed braille required.',
        'quoted',
        'Chanakya (Sales Director)'
    )
ON CONFLICT (reference_no) DO NOTHING;
