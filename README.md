# Apex Packaging & Converting — Industrial Operations Platform

[![Architecture](https://img.shields.io/badge/Architecture-Cloud--Native_React_+_Supabase-blue)](./docs/ARCHITECTURE.md)
[![Design System](https://img.shields.io/badge/Design_System-Swiss_60--30--10_Industrial-red)](./DESIGN.md)
[![Security](https://img.shields.io/badge/Security-Supabase_RLS_+_Defense--in--Depth-green)](./docs/SECURITY.md)
[![Decisions Ledger](https://img.shields.io/badge/Architecture_Ledger-DECISIONS.md-orange)](./DECISIONS.md)

An enterprise-grade, cloud-native B2B manufacturing and operations platform engineered for industrial packaging converters. The system connects public B2B procurement clients with high-volume production lines (multi-colour flexographic roll label converting and Heidelberg Speedmaster offset lithography) through an interactive 5-step CAD/FINAT configurator, real-time CPQ estimator, and secure role-based operations consoles.

---

## 🌟 Highlights & Key Engineering Capabilities

### 1. Interactive 5-Step B2B Configurator & FINAT Rewind Visualizer
- **FINAT 1–8 Technical Reel Viewer**: Full visual feedback loop rendering European standard label unwind orientations (Wound Out / Wound In, Top/Bottom/Left/Right off first; FINAT Handbook §2.8) for automatic bottling and packaging machinery.
- **3D Container Mockup Studio**: Dynamic substrate pop-out preview across bottles, jars, jugs, vials, and cartons with live finish overlays (White/Clear/Silver BOPP, Cold Foil, Spot UV).
- **Client Magic-Byte Pre-flight**: Fail-closed client-side binary validation verifying authentic PDF/vector headers (`%PDF-`, `PNG`, `PK\x03\x04`) before storage ingestion.

### 2. Dual-Engine CPQ Estimator & Parity Test Suite
- **Complex Industrial Estimating Math**: Calculates square meter surface area, linear web meters, CTP plate exposure costs, hourly press run calculations (flexo vs. offset), embellishments, and margin controls.
- **Property-Based Invariant Fuzzing**: 1,000 randomized packaging inputs verified with `fast-check` asserting finite price invariants, VAT precision, and tooling fee waivers.
- **Isomorphic Parity**: Shared TypeScript / Node.js calculation models with deterministic unit tests verifying 100% parity across client preview and backend API quotation endpoints.
- **CSV Formula Injection Defense**: Sanitizes spreadsheet exports to mitigate formula execution vulnerabilities in Excel / Google Sheets (`=`, `+`, `-`, `@`).

### 3. Workflow Decision Gates & Operations CRM (`/sales`)
- **Trelio-Style Workflow Decision Gates**: Manages offline-first industrial commercial lifecycles (`Under Review` &rarr; `Quote Dispatched` &rarr; `In Production` &rarr; `Dispatched` &rarr; `Mark as Settled`).
- **Native SVG CRM Intelligence**: Zero-dependency vector analytics featuring 4-tier KPI pulse cards with sparklines, sales funnel visualizer, dual-series revenue charts, and CMYK volume mix donuts.
- **Dynamic 3-Hour SLA Monitor**: Real-time visual countdown timers, background worker sweeps, and automated external webhook dispatch alerts.
- **Offline Bank Clearance Ledger**: Records verified wire transfers, corporate ACH, bank cheques, and cash settlements with audit records.

### 4. Zero-Trust Supabase Security Architecture (`/admin`)
- **Row Level Security (RLS) Matrix**: Strict PostgreSQL policies isolating public anonymous RFQ insertions, estimator read/updates, and executive superadmin role capabilities.
- **Helmet CSP & Rate Limiting**: Strict Content Security Policy directives and multi-tier rate limiters on sensitive and global endpoints.
- **Secure Auth Session Hooks**: Role normalization with protection against privilege escalation.
- **Executive Operations Console**: Staff management, drag-and-drop CSV rate card editor, live media slot replacements, and cryptographic audit logs.

---

## 📐 System Architecture

```
                                  [ Cloudflare / Edge CDN ]
                                             │
                                             ▼
                        [ Vercel Edge: React 18 Application (SPA) ]
                                             │
           ┌─────────────────────────────────┼─────────────────────────────────┐
           ▼                                 ▼                                 ▼
[ Public Customer Portal ]        [ Sales Operations Console ]      [ Executive Management Hub ]
• 5-Step B2B Configurator         • Route: `/sales`                 • Route: `/admin`
• FINAT 1–8 Rewind Viewer         • CPQ Estimation Engine           • Staff Account CRUD
• 3D Studio Mockup Stage          • Native SVG CRM Analytics        • Rate Card CSV Drag & Drop
• Sample Swatch Kit Request       • Trelio Decision Gates           • Dynamic Plant Settings
• Radix UI Accessible Primitives  • Rate Card CSV Importer          • Live Media Slots & Audit
           │                                 │                                 │
           └─────────────────────────────────┼─────────────────────────────────┘
                                             │
                                             ▼
                             [ Express API & Background Worker ]
                             • Helmet CSP & Multi-Tier Rate Limiting
                             • Fail-Closed JWT Bearer Verification
                             • 3-Hour SLA Alert Webhook Dispatcher
                                             │
                                             ▼
                                [ Supabase Cloud Platform ]
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         ▼                                   ▼                                   ▼
[ PostgreSQL 15 + RLS ]             [ Supabase Auth (JWT) ]            [ Object Storage (S3) ]
• `rfq_inquiries`                   • Role: `superadmin`               • `rfq-dielines`
• `sample_kit_requests`             • Role: `sales`                    • `quote-attachments`
• `supplier_rate_cards`             • Function: `get_user_role()`      • `site-media`
• `offline_bank_clearances`                                            • `artwork-uploads`
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, React Router 6, Radix UI Primitives, Sonner |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Custom HSL Double-Bezel Design Tokens |
| **Animation Engine** | GSAP 3.12 (GreenSock), ScrollTrigger |
| **Backend Services** | Node.js 20+ (ES Modules), Express 4.21, Helmet, Rate Limiter |
| **Database & Auth** | Supabase Managed PostgreSQL 15+, Supabase Auth, Row Level Security |
| **Cloud Storage** | S3-compatible Object Storage (`rfq-dielines`, `quote-attachments`, `artwork-uploads`) |
| **Testing Suite** | Playwright E2E (16 tests), `fast-check` (1,000 fuzzing runs), `node:test` (17 tests) |

---

## 📁 Repository Structure

```text
├── backend/
│   ├── scripts/health-check.js          # Zero-dependency platform diagnostic tool
│   ├── src/domain/estimating/           # Isomorphic CPQ mathematical calculation engine
│   ├── src/jobs/                        # 3-hr SLA monitor & 30-day quote expiry sweep jobs
│   ├── src/utils/                       # Magic-byte validator, CSV sanitizer, boot guards
│   ├── src/server.js                    # Express API with Helmet CSP & fail-closed auth
│   ├── src/worker.js                    # Concurrency-locked 15-min background job scheduler
│   └── test/                            # Unit & security tests (fuzzing, parity, CSP, auth)
├── docs/
│   ├── ARCHITECTURE.md                  # Comprehensive architectural specification
│   ├── PRD.md                           # Product Requirements Document
│   └── SECURITY.md                      # Threat model & Supabase RLS matrix
├── e2e/                                 # Playwright end-to-end integration tests (16/16 pass)
├── frontend/
│   ├── public/assets/                   # SVG vector marks and industrial plant photography
│   └── src/
│       ├── components/ui/               # Accessible Radix UI primitives (Dialog, Select, Tabs)
│       ├── components/layout/           # Header, Footer, TelemetryBar, ProtectedRoute
│       ├── lib/                         # FINAT spec (`finat.ts`), CRM analytics, CPQ calculator
│       ├── pages/public/                # Home, About, Services, Gallery, Contact, Configurator
│       ├── pages/sales/                 # Pipeline Kanban, CPQ Estimator, Rate Cards, Clearances
│       └── pages/admin/                 # Staff CRUD, Plant Settings, Media Slots, Audit Logs
├── supabase/
│   ├── migrations/                      # PostgreSQL schema, RLS policies, RBAC functions
│   └── seed.sql                         # Demonstrative B2B catalog, rate cards & test pipeline
├── DECISIONS.md                         # Append-only architectural decision records (D001-D024)
├── DESIGN.md                            # Comprehensive Swiss 60-30-10 design system spec
└── package.json                         # Workspace monorepo manifest
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Chanakya2006gt/industrial-packaging-platform.git
cd industrial-packaging-platform
npm install
```

### 2. Configure Environment Variables
```bash
cp frontend/.env.example frontend/.env
```
*(Optionally populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for live cloud database features).*

### 3. Run Development Server
```bash
# Start frontend application (Vite on http://localhost:5173)
npm run dev

# Or start backend API server (http://localhost:5001)
npm run dev:backend
# Or run background worker
npm run dev:worker
```

### 4. Demo Staff Consoles & Roles
The platform includes two role-protected operations consoles:

| Console Route | Email Reference | Role | Capabilities |
| :--- | :--- | :--- | :--- |
| **`/sales/login`** | `sales@apexconverting.demo` | `sales` | RFQ Kanban Pipeline, CPQ Packaging Calculator, Excel Rate Cards, Offline Bank Clearances |
| **`/admin/login`** | `admin@apexconverting.demo` | `superadmin` | Executive Master Console, Staff Account CRUD, Live Plant Settings, Media Slots & Audit Logs |

*Note: In your Supabase project, accounts are created under **Authentication &rarr; Users** with your chosen password and mapped to `public.profiles`.*

### 5. Execute Test Suites & Health Diagnostic
```bash
# Run backend unit tests (CPQ parity, CSV sanitization, magic bytes, worker SLA)
npm run test:backend

# Run Playwright E2E smoke and functional suite
npm run test:e2e

# Run platform diagnostic health check
npm run health

# Build frontend for production verification
npm run build
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
