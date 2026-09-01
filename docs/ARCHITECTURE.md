# ARCHITECTURE — Industrial Packaging & Operations Platform

**Version:** 2.2 (Production Cloud-Native Enterprise)  
**Date:** 2026-09-01  
**Maintainer:** Engineering Architecture Team  

---

## 1. Executive System Overview

The platform operates as a modern cloud-native, high-performance web platform combining:
1. **Public B2B Engineering Interface**: Fast, responsive customer web experience featuring interactive 5-step B2B quote configuration, FINAT 1–8 roll unwind calculators (`lib/finat.ts`), 3D studio container visualizers, CAD dieline uploads, and physical swatch sample logistics.
2. **Hidden Direct-URL Staff Consoles**:
   * `/sales` &rarr; Estimator Pipeline Console with CPQ Pricing Calculator, Native SVG CRM Sales Intelligence, Trelio-style Decision Gates (`Pending Review` &rarr; `Quoted` &rarr; `In Production` &rarr; `Dispatched` &rarr; `Settled`), and official Quote/Proof PDF attachments.
   * `/admin` &rarr; Executive Management Hub for plant ownership (full pipeline oversight, sales staff account CRUD, plant settings, raw material rate card editor, and live media asset replacement).
3. **Dedicated Node.js Services**:
   * **Express API Server (`backend/src/server.js`)**: Staff CPQ calculation endpoints, binary magic-byte validators, CSV formula sanitization, Helmet CSP, multi-tier rate limiters, and fail-closed bearer auth.
   * **Background Worker (`backend/src/worker.js`)**: 15-minute scheduler with concurrency execution locks, 3-hour SLA monitor with external webhook alerts (`slaMonitor.js`), and 30-day quote expiry sweeps.
4. **Cloud-Native Data & Storage Engine**: Supabase (Managed PostgreSQL 15+, Supabase Auth with Row Level Security, S3-compatible Supabase Object Storage).
5. **Global Edge Infrastructure**: Vercel Edge Hosting with automated CI/CD and Cloudflare DNS/WAF protection.

```
                                  [ Cloudflare WAF & Edge CDN ]
                                                │
                                                ▼
                         [ Vercel: Modern React Application (Public + Consoles) ]
                                                │
           ┌────────────────────────────────────┼────────────────────────────────────┐
           ▼                                    ▼                                    ▼
[ Public Customer Interface ]        [ Hidden `/sales` Console ]          [ Hidden `/admin` Executive Hub ]
• Home, About, Services, Gallery     • Pipeline Kanban & Table            • Executive Operational Telemetry
• 5-Step CAD Configurator            • Native SVG CRM Analytics           • Staff User Management (CRUD Sales)
• FINAT 1–8 Rewind (`lib/finat.ts`)  • CPQ Pricing Calculator             • Rate Card CSV Drag & Drop Editor
• 3D Studio Mockup Stage             • Upload Quote / Proof PDFs          • Dynamic Plant Settings & Media
• Sample Swatch Kit Request          • Trelio "Mark as Settled" Gate      • Full Security Audit Logs
• GSAP Industrial Motion Engine      • Internal Technical Notes           • Quick Intake & Clearance Modals
           │                                    │                                    │
           └────────────────────────────────────┼────────────────────────────────────┘
                                                │
                                                ▼
                              [ Express API & Background Worker ]
                              • Helmet CSP & Multi-Tier Rate Limiting
                              • Fail-Closed Supabase JWT Auth Verification
                              • 3-Hour SLA Alert Webhook Dispatcher
                                                │
                                                ▼
                                    [ Supabase Cloud Platform ]
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
[ PostgreSQL Database & RLS ]          [ Supabase Auth (RBAC) ]          [ Supabase Object Storage ]
• `rfq_inquiries` (Decision Gates)     • Role: `superadmin` (Ownership)   • Bucket: `rfq-dielines`
• `sample_kit_requests`                • Role: `sales` (Estimators)       • Bucket: `quote-attachments`
• `supplier_rate_cards`                • Row Level Security (RLS)         • Bucket: `site-media`
• `plant_settings` & `audit_logs`      • Function: `get_user_role()`      • Bucket: `artwork-uploads`
```

---

## 2. Business Philosophy: Offline Commercials & Zero Digital Payment Gateways

* In regional industrial packaging manufacturing, volume pricing, payment terms (net-30, cash, bank TT, wire transfer), and dieline alterations are **negotiated offline** (phone, email, technical consultations).
* The platform functions as a **Specification, Visibility & Workflow Coordination Gateway**.
* Status progression moves through human **Decision Gates**:
  1. `RFQ Received` &rarr; Customer submitted technical specs & dielines.
  2. `Under Review` &rarr; Sales estimator checking tooling die # and plate availability.
  3. `Quote Sent` &rarr; Sales attached official Quote PDF / Dieline Proof generated offline.
  4. `Confirmed` &rarr; Client confirmed order offline.
  5. `In Production` &rarr; Job queued on Heidelberg 6C or 8C UV Flexo.
  6. `Dispatched` &rarr; Goods departed manufacturing facility.
  7. `Settled` &rarr; Trelio-style manual "Mark as Settled" confirmation that payment was satisfied.

---

## 3. Technology Stack

| Layer | Component | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + TypeScript | Component modularity, typed props, sub-second route transitions. |
| **UI Primitives** | Radix UI (`Dialog`, `Select`, `Tabs`, `Tooltip`) + Sonner | Accessible modal overlays, keyboard-navigable selects, and global toast engine. |
| **Design System** | Tailwind CSS + CSS HSL Custom Properties | Exact Swiss 60-30-10 palette (`#FAFAFC` canvas, `#0F172A` Slate, `#E00019` Laser Crimson, CMYK accents). |
| **Motion Engine** | GSAP 3.12 + ScrollTrigger | Industrial mass and weighted deceleration curves (`power3.out` / `power2.out`). |
| **Backend API** | Express 4.21 + Helmet + Rate Limiter | RESTful microservice with security headers and fail-closed auth. |
| **Worker & Jobs** | Node.js 20+ Background Worker | Concurrency-locked 15-min scheduler and 3-hour SLA webhook alerts. |
| **Database** | PostgreSQL 15+ (Supabase) | Cloud ACID relational schema with foreign key constraints, compound indexes, and triggers. |
| **Authentication** | Supabase Auth (JWT) | Role-Based Access Control (`superadmin`, `sales`) with Row Level Security (RLS). |
| **Object Storage** | Supabase Storage (S3-compatible) | Cloud buckets for CAD dielines, quote PDF attachments, and plant media. |
| **Testing** | Playwright E2E + `fast-check` + `node:test` | Full suite (16 E2E tests, 1,000 property fuzzing runs, 17 security tests). |
| **Hosting & CI/CD** | Vercel | Automated Git edge deployment with SPA rewrites. |
| **Security & WAF** | Cloudflare | DNSSEC, DDoS mitigation, SSL/TLS full encryption. |

---

## 4. Visual Continuity & Design Standard

The design system enforces high industrial fidelity:
* **Typography:** `Plus Jakarta Sans` (Display/Headings), `Inter` (Industrial Body), `IBM Plex Mono` (Machine Specs).
* **Brand Mark:** Vector SVG mark with 4-quadrant diamond geometry, centered focus dot, and precision loop.
* **Photography Slots:** 5 verified packaging and plant machinery slots (`hero-packaging.jpg`, `press-flexo-8c.jpg`, `press-heidelberg-6c.jpg`, `prepress-ctp.jpg`, `cartons-packaging.jpg`).

