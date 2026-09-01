# ARCHITECTURE DECISION RECORDS (ADR) — Industrial Packaging Platform

> **System:** B2B Industrial Converting & Offset Packaging Platform  
> **Status:** Production Architecture Ledger  
> **Rule:** Append-only comprehensive engineering decision records detailing architectural pivots, CPQ calculation models, security policies, and performance optimizations.

---

## Decision & Evolution Timeline

### [D001] Design System Architecture — Swiss 60-30-10 Industrial Palette
- **Date:** 2026-08-23
- **Action:** Implemented a calibrated CSS variable system with Swiss 60-30-10 distribution:
  - 60% Canvas & Neutral Wells (`#FAFAFC` light / `#070B12` dark).
  - 30% Structural Machine Slate (`#0F172A`).
  - 10% Laser Brand Crimson (`#E00019`) + Process CMYK registration accents (`#00A3E0`, `#E6007E`, `#FFD100`, `#0F172A`).
- **Rationale:** Industrial manufacturing tools require high data legibility, high visual hierarchy, and robust contrast ratios under diverse warehouse/office lighting conditions.

---

### [D002] Scroll Reveal & Progressive Enhancement Fix
- **Date:** 2026-08-23
- **Context:** In headless test environments or browsers where client scripts are delayed, static `opacity: 0` CSS reveal classes could leave critical UI unrendered.
- **Resolution:** Implemented an inline head guard that binds `.js-ready` dynamically. All GSAP scroll triggers and CSS reveal hooks scope strictly under `html.js-ready .reveal`.

---

### [D003] Isomorphic CPQ Calculation Model & Zero-Drift Parity
- **Date:** 2026-08-24
- **Action:** Created unified mathematical estimating models shared across client preview (`frontend/src/lib/calculator.ts`) and backend quotation endpoints (`backend/src/domain/estimating/calculator.js`).
- **Formulas Implemented:**
  - `singleLabelAreaCm2 = (widthMm * heightMm) / 100`
  - `linearMeters = Math.round((quantity * (heightMm + webGapMm)) / 1000)`
  - `totalSqMeters = (quantity * widthMm * (heightMm + webGapMm)) / 1000000`
  - `pressRunHours = flexo_line_speed_or_offset_sheet_throughput`
- **Verification:** Continuous fixture-based test suite (`backend/test/calculatorParity.test.js`) guaranteeing identical decimal outputs across client and server.

---

### [D004] Binary Magic-Byte File Validation (Client & Server)
- **Date:** 2026-08-24
- **Security Context:** MIME type and file extension spoofing allow malicious executables to disguise as vector CAD files or dieline proofs.
- **Resolution:** Added client-side (`FileReader` chunk reader) and server-side binary inspections validating true file signatures (`%PDF-`, `PNG`, `PK\x03\x04` ZIP) before storage ingestion.

---

### [D005] CSV Formula Injection Sanitization
- **Date:** 2026-08-25
- **Security Context:** Spreadsheets exported from customer RFQs can trigger Dynamic Data Exchange (DDE) and formula command execution when opened in Microsoft Excel or LibreOffice.
- **Resolution:** Implemented `csvSanitizer.js` prefixing any leading `=`, `+`, `-`, `@`, `\t`, `\r` with a single quote escape (`'`) and enclosing all text cells in RFC 4180 double quotes.

---

### [D006] Role-Based Access Control (RBAC) & Hardened Supabase RLS Matrix
- **Date:** 2026-08-25
- **Action:** Hardened Supabase PostgreSQL schema with strict Row Level Security (RLS):
  - Public anonymous users: `INSERT` only on `rfq_inquiries` and `sample_kit_requests`.
  - Sales Estimators (`role: 'sales'`): `SELECT` and `UPDATE` on RFQ pipeline, supplier rate cards, and bank clearances.
  - SuperAdmins (`role: 'superadmin'`): Full CRUD on staff profiles, plant settings, and audit logs.
- **Security Function:** Created `get_user_role()` in PL/pgSQL to prevent client-side JWT role manipulation.

---

### [D007] Offline-First Commercial Reality & Decision Gates
- **Date:** 2026-08-25
- **Business Logic:** B2B industrial manufacturing operates on custom negotiated volume terms, offline credit accounts, and wire settlements rather than direct card checkouts.
- **Workflow Implementation:** Built direct-URL staff CRM (`/sales`) enforcing manual human verification gates:
  `Pending Review` &rarr; `Quote Dispatched` &rarr; `In Production` &rarr; `Dispatched` &rarr; `Mark as Settled`.

---

### [D008] Portfolio Sanitization & Universal Brand Abstraction
- **Date:** 2026-08-25
- **Context:** Transforming proprietary enterprise code into a resume-ready public portfolio repository without leaking physical factory addresses, telephone numbers, staff identities, or client records.
- **Resolution:** Standardized entity tokens across the entire stack:
  - Brand: **Apex Packaging & Converting** (`Apex Pack`).
  - Reference IDs: `RFQ-YYYY-XXXX` (Quotes/Inquiries) and `SMP-YYYY-XXXX` (Sample Swatch Packs).
  - Facility Location: **1000 Industrial Parkway, Westgate Logistics Park, Metro City**.
  - Contact Line: `sales@apexconverting.demo` | `+1 (555) 019-2834`.
  - Client Profiles: Apex Bottling Co., Metro Pharma Labs, Summit FMCG.

---

### [D009] Bespoke Apex Geometric Vector Identity & Favicon System
- **Date:** 2026-08-25
- **Action:** Replaced legacy raster/vector paths with mathematical vector SVG assets (`logo.svg`, `favicon.svg`) built on the Swiss 60-30-10 palette.
- **Anatomy:**
  - Faceted Summit "A" Chevron in Laser Crimson (`#E00019`).
  - Interlocking Fold Plane in Machine Slate (`#0F172A`).
  - 4-Color CMYK Process Registration Line (`Cyan #00A3E0`, `Magenta #E6007E`, `Yellow #FFD100`, `Slate #0F172A`).
  - Sub-millimeter center registration crosshair and high-legibility badge typography.

---

### [D010] Zero-Cost Serverless Hosting Architecture (Vercel + Supabase)
- **Date:** 2026-08-25
- **Decision:** Decoupled platform from persistent Node.js servers (Render) by leveraging direct client SDK (`@supabase/supabase-js`) over PostgREST.
- **Economics:**
  - Vercel (Hobby): Static SPA hosting + global edge CDN ($0/mo).
  - Supabase (Free Tier): 500MB PostgreSQL ACID database + Auth + 1GB S3 Storage buckets (`rfq-dielines`, `quote-attachments`) ($0/mo).
  - Client-Side Estimating: All CPQ calculations and FINAT 1–8 reel algorithms execute instantly in TypeScript with zero backend network latency.

---

### [D011] Secret Leak Prevention & Git Hygiene (.gitignore)
- **Date:** 2026-08-25
- **Security Context:** Public portfolio repositories risk catastrophic credential leaks if developer `.env` files are tracked.
- **Resolution:** Added root `.gitignore` matching `.env`, `*.env`, `frontend/.env`, `backend/.env`, while authoring explicit, sanitized `.env.example` templates mirroring Supabase Dashboard terminology (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

---

### [D012] Consolidated Idempotent Database Provisioning (complete_setup.sql)
- **Date:** 2026-08-25
- **Action:** Created unified single-transaction provisioning script (`supabase/complete_setup.sql`) combining UUID extensions, all 8 schema tables, Row Level Security policies, PL/pgSQL role verification functions, rate card presets, and initial demo pipeline items.
- **Benefit:** Allows zero-dependency 1-click database initialization in Supabase SQL Editor without requiring local PostgreSQL client CLI installations.

---

### [D013] Dual-Mode B2B Configurator & 8-Way FINAT SVG Technical Diagrams
- **Date:** 2026-08-25
- **Action:** Upgraded `FinatReelViewer.tsx` with complete 8-way SVG technical rewind diagrams across all FINAT selection tiles.
- **Key Capabilities:**
  - Dynamic rotary machine unwinding simulation with spinning core `{coreMm}mm` visualizer and peeling label with degree rotation.
  - Live manufacturing telemetry HUD: unit cm² area, linear meters, converted m², and roll count breakdown.

---

### [D014] 1:1 Pixel-Calibrated Container Matrix & Format Synchronizer
- **Date:** 2026-08-25
- **Action:** Upgraded `StudioMockupViewer.tsx` and `ConfiguratorSteps.tsx` with native square studio viewing (`aspect-square max-w-[480px]`) and sub-millimeter cylindrical bounding box coordinates for Bottles, 5L Jerry Cans, Glass Jars, Vials, and Folding Cartons.
- **Format Sync:** Step 1 classification automatically synchronizes container formats, roll vs. sheet geometry, and substrate material presets.

---

### [D015] Executive Administration Parity & Modular Tools Integration
- **Date:** 2026-08-25
- **Action:** Integrated full executive parity tools into the Admin Console (`/admin/dashboard`):
  - Interactive Packaging Price Calculator (`<CpqEstimatorPanel />`).
  - Raw Material & Paperboard Rate Cards editor with drag-and-drop CSV parser (`<RateCardsTab />`).
  - Response target pipeline monitor (`<PipelineList />`).
  - Bank payment clearance modal and rapid phone inquiry intake modal.
- **Rationale:** Ensures executive plant managers have identical operational estimating power and live price control without context-switching between separate portals.

---

### [D016] User-Centric Terminology Shift & Clean Swiss Card Elevation
- **Date:** 2026-08-25
- **Action:** Replaced dense developer/database jargon across all staff dashboards with intuitive, user-friendly commercial packaging terminology:
  - `Commercial Sales & CPQ Workstation` &rarr; **`Sales & Customer Quotes`**.
  - `EXECUTIVE MASTER CONSOLE` &rarr; **`ADMIN PORTAL`**.
  - `Packaging CPQ Calculator` &rarr; **`Price Calculator`**.
  - `Offline Bank Clearance Gate` &rarr; **`Payment History`**.
  - `SLA OVERDUE` &rarr; **`Needs Immediate Reply`**.
  - `Raw Substrate` / `CTP Laser Plates` &rarr; **`Raw Materials & Paper`** / **`Printing Plates Setup`**.
  - `FINAL GROSS QUOTE` &rarr; **`TOTAL CUSTOMER PRICE`**.
- **Card Hierarchy:** Replaced nested high-contrast double-bezel frames with clean elevated Swiss B2B cards (`bg-white dark:bg-[#0E1422]`, `border-slate-200 dark:border-slate-800`, `rounded-2xl`, `shadow-xs`).

---

### [D017] Native SVG B2B CRM Sales Intelligence & Conversion Funnel Architecture
- **Date:** 2026-08-25
- **Action:** Implemented zero-dependency React SVG CRM charting and analytics engine in `crmAnalytics.ts`:
  - 4-Tier KPI Pulse (`<CrmKpiGrid />`): Active Pipeline Value, Settled Cash, Conversion Win Rate, and Average Response Velocity with mini sparklines.
  - Multi-Stage Funnel Visualizer (`<SalesFunnelChart />`): Step retention and transition drop-off rates across `Inquiries` &rarr; `Review` &rarr; `Quoted` &rarr; `In Production` &rarr; `Settled`.
  - 6-Month Dual-Series Bar/Area Chart (`<RevenueTrendChart />`): Interactive hover tooltips comparing Quote Volume vs. Actual Settled Cash.
  - Category Volume Share Donut (`<PackagingMixDonut />`): CMYK-calibrated ring visualization for Flexo Labels, Folding Cartons, and Commercial Print.
  - Top Corporate Accounts Leaderboard (`<TopAccountsLeaderboard />`): Lifetime spend ranking with instant quote shortcut.
- **Benefit:** 100% vector fidelity, 60fps performance, zero layout shift (zero FOUC), and perfect light/dark theme adaptation without bulky third-party charting libraries.

---

### [D019] Full Token System Consolidation & CSS Variable Architecture
- **Date:** 2026-08-29
- **Action:** Consolidated all scattered palette utilities into a semantic HSL token architecture in `frontend/src/styles/globals.css` and `frontend/tailwind.config.js`:
  - Defined CSS variables `--background`, `--foreground`, `--card`, `--popover`, `--primary` (Laser Crimson `355 100% 44%`), `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`.
  - Added universal accessible focus system `:where(a, button, input, select, textarea, [tabindex]):focus-visible` with 2px ring offset.
  - Added global reduced motion fallback `@media (prefers-reduced-motion: reduce)` collapsing transitions and animations to 0.01ms.
  - Bound dynamic elevation tokens (`shadow-theme-sm` through `shadow-theme-2xl`, `shadow-bezel`).
- **Rationale:** Guarantees strict Swiss 60-30-10 distribution, consistent dark mode inversion, and eliminates scattered hardcoded hex codes.

---

### [D020] Accessible Radix UI Primitives & Unified Theme Calibration
- **Date:** 2026-08-29
- **Action:** Installed `@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `sonner`, and `class-variance-authority`.
- **Implementations:**
  - Replaced hand-rolled modal overlays in `PaymentClearanceModal.tsx` and `QuickIntakeModal.tsx` with Radix `Dialog` providing focus trap and Escape key dismissal.
  - Replaced native `<select>` controls across `PipelineList.tsx` and `CpqEstimatorPanel.tsx` with accessible Radix `Select` popovers.
  - Mounted Sonner toast engine `<Toaster />` at the root application level.
  - Swept all remaining `#E00019` hex strings across staff dashboards to semantic token classes (`bg-primary`, `text-primary`, `border-primary`).

---

### [D021] SVG Sparkline Area Fills, Terminus Pulse & Lazy Media Performance
- **Date:** 2026-08-29
- **Action:** Upgraded CRM KPI dashboard widgets and media assets for maximum visual polish and Core Web Vitals efficiency:
  - Added gradient polygon fills (`<polygon fill="url(#spark-grad)">`), anti-aliased polyline paths, and pulsing SVG terminus dots (`<circle className="animate-ping">`) in `CrmKpiGrid.tsx`.
  - Added `loading="lazy"` and `decoding="async"` across all media assets in `AboutPage.tsx`, `GalleryPage.tsx`, `HomePage.tsx`, and `ServicesPage.tsx`.
  - Verified zero layout shift and smooth 60fps rendering in GSAP corporate motion transitions.

---

### [D022] Backend Security Hardening, Helmet CSP, Rate Limiting & SLA Webhooks
- **Date:** 2026-08-29
- **Action:** Implemented OWASP security hardening in Express API server (`backend/src/server.js`), background worker (`backend/src/worker.js`), and Supabase database schema (`supabase/migrations/20260829000001_security_and_storage_hardening.sql`):
  - **Helmet & CSP:** Configured strict Content Security Policy directives, HSTS preload, X-Content-Type-Options (`nosniff`), and frame ancestors (`'none'`).
  - **Multi-Tier Rate Limiting:** Global limiter (300 req/15min) and strict sensitive endpoint limiter (60 req/15min) using `express-rate-limit`.
  - **Fail-Closed Authentication:** Middleware strictly fails closed (401/500) if Bearer tokens are invalid, malformed, or if auth service is unconfigured.
  - **Worker Overlap Lock:** Added `let isRunning = false;` execution guard to prevent concurrent scheduler cycle collisions.
  - **SLA Webhook Dispatch:** Added automated JSON webhook dispatch in `slaMonitor.js` to notify external systems upon 3-hour SLA breach risks.
  - **Database Migration 0005:** Added compound indices on `rfq_inquiries(status, created_at)`, automated profile role change audit trigger, and hardened S3 storage bucket RLS policies.
  - **Vercel Security Headers:** Declared CSP, HSTS, X-Frame-Options, X-Content-Type-Options in `frontend/vercel.json`.

---

### [D024] Centralized FINAT Rewind Specification & Web Telemetry Engine
- **Date:** 2026-09-01
- **Action:** Created dedicated FINAT unwind specification module in `frontend/src/lib/finat.ts`:
  - Standardized complete FINAT #1 through #8 specifications according to FINAT Handbook §2.8 standards (Directions 1–4 Wound Out, Directions 5–8 Wound In; Top, Bottom, Right, Left lead edges and 0°, 90°, 180°, 270° orientation rotations).
  - Implemented `rewindDirectionForRfq(rollOrSheet, finatDirection)` ensuring flat sheets/cartons store `null` while rotary rolls preserve validated `1–8` integer codes.
  - Implemented centralized `finatWebTelemetry` matching CPQ calculator web gap (3mm) and reel packaging density (2,500 labels/roll).
  - Replaced inline definition tables in `ConfiguratorPage.tsx` and manual math calculations in `FinatReelViewer.tsx`.
- **Validation:** Clean TypeScript build (0 errors, 0 warnings), 16/16 Playwright E2E tests passing, and 0 DOM quality violations across 45 files.







