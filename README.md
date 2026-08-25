# PrintFast Zambia Limited (PZL) — Cloud Operations Platform

[![Architecture](https://img.shields.io/badge/Architecture-Cloud--Native_React_+_Supabase-blue)](./docs/ARCHITECTURE.md)
[![Design System](https://img.shields.io/badge/Design_System-60--30--10_Industrial-red)](./src/styles/globals.css)
[![Security](https://img.shields.io/badge/Security-Supabase_RLS_+_Cloudflare-green)](./docs/SECURITY.md)
[![Audit Log](https://img.shields.io/badge/Ledger-memory__PZL.md-orange)](./memory_PZL.md)

Welcome to the official technical repository and digital platform for **PrintFast Zambia Limited (PZL)**, Lusaka's premier high-volume printing press and packaging converter specializing in flexographic self-adhesive labels, Heidelberg multi-colour offset lithography (up to 28.5"×40"), and precision industrial finishing.

---

## 1. Documentation Index

This project adheres to rigorous, production-grade software engineering standards:

| Document | Purpose & Scope |
| :--- | :--- |
| 📄 **[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)** | Cloud-native system architecture, React + Supabase PostgreSQL schema, RLS policies, and Vercel/Cloudflare edge delivery. |
| 📄 **[`docs/PRD.md`](./docs/PRD.md)** | Product Requirements Document: Target personas, 5-step B2B Configurator, FINAT roll calculator, hidden direct-URL staff consoles. |
| 📄 **[`docs/SECURITY.md`](./docs/SECURITY.md)** | Threat model, Supabase RLS matrix, RBAC roles (`superadmin`, `sales`), magic-byte file validation, and Cloudflare WAF. |
| 📄 **[`memory_PZL.md`](./memory_PZL.md)** | Append-only decision ledger ([D000] &rarr; [D029]), competitor benchmarking insights, and error resolution registry. |

---

## 2. Technology Stack & Key Features

- **Frontend Application**: React 18 + Vite + TypeScript.
- **Styling & Theme**: Tailwind CSS + Custom CSS Variables (Swiss 60-30-10 industrial palette).
- **Motion Choreography**: GSAP 3.12 + ScrollTrigger corporate animation engine with industrial deceleration curves.
- **Database & Auth**: Supabase Managed PostgreSQL 15+ with Row Level Security (RLS) & JWT authentication.
- **Cloud Object Storage**: S3-compatible Supabase Storage (`rfq-dielines`, `quote-attachments`, `site-media`).
- **Deployment & Edge Security**: Vercel Global Edge Hosting with Cloudflare DNS, DDoS protection, and WAF.

### Portals & Routing Architecture:
* **Public Customer Interface** (`/`, `/about`, `/services`, `/gallery`, `/contact`, `/configurator`): Seamless B2B specification configuration, CAD dieline uploader, sample kit ordering, and machine telemetry. Zero artificial login walls.
* **Hidden Sales Console** (Direct URL: `/sales`): Estimator pipeline management, dieline inspection, Quote PDF attachment, and **Trelio-Style Decision Gates** (`Under Review` &rarr; `Quote Sent` &rarr; `In Production` &rarr; `Dispatched` &rarr; **`Mark as Settled`**).
* **Hidden Executive Hub** (Direct URL: `/admin`): Plant ownership telemetry, sales staff account CRUD & deactivation, dynamic plant settings, and live media asset replacement.

---

## 3. Quick Start & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/Chanakya2006gt/Printfast_Zambia.git
cd Printfast_zambia_website

# 2. Copy environment template
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production (Vercel)
npm run build
```

---

## 4. License & Proprietary Rights

All brand marks, machinery specifications, and corporate assets are proprietary to **PrintFast Zambia Limited**.
Software architecture and platform source code are developed for the exclusive operations of PZL.
