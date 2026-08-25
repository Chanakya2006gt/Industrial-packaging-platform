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


