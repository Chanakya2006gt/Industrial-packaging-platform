# ARCHITECTURE — PrintFast Zambia Cloud Platform

**Version:** 2.0 (Production Cloud-Native Enterprise)  
**Date:** 2026-08-25  
**Maintainer:** PrintFast Zambia Limited  

---

## 1. Executive System Overview

PrintFast Zambia Limited (PZL) operates as a modern cloud-native, high-performance web platform combining:
1. **Public B2B Engineering Interface**: Fast, responsive customer web experience featuring interactive 5-step B2B quote configuration, FINAT 1–8 roll unwind calculators, CAD dieline uploads, and physical swatch sample logistics.
2. **Hidden Direct-URL Staff Consoles**:
   * `/sales` &rarr; Estimator Pipeline Console with Trelio-style Decision Gates (`Under Review` &rarr; `Quote Sent` &rarr; `In Production` &rarr; `Dispatched` &rarr; `Settled`) and official Quote/Proof PDF attachments.
   * `/admin` &rarr; Executive Management Hub for plant ownership (full pipeline oversight, sales staff account CRUD, plant settings, and live media asset replacement).
3. **Cloud-Native Data & Storage Engine**: Supabase (Managed PostgreSQL 15+, Supabase Auth with Row Level Security, S3-compatible Supabase Object Storage).
4. **Global Edge Infrastructure**: Vercel Edge Hosting with automated CI/CD and Cloudflare DNS/WAF protection.

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
• 5-Step B2B Roll Configurator       • Upload Quote / Proof PDFs          • Staff User Management (CRUD Sales)
• Sample Swatch Kit Request          • Trelio "Mark as Settled" Gate      • Dynamic Plant Settings & Media
• GSAP Industrial Motion Engine      • Internal Technical Notes           • Full Security Audit Logs
           │                                    │                                    │
           └────────────────────────────────────┼────────────────────────────────────┘
                                                ▼
                                    [ Supabase Cloud Platform ]
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
[ PostgreSQL Database & RLS ]          [ Supabase Auth (RBAC) ]          [ Supabase Object Storage ]
• `rfq_inquiries` (Decision Gates)     • Role: `superadmin` (Ownership)   • Bucket: `rfq-dielines`
• `sample_kit_requests`                • Role: `sales` (Estimators)       • Bucket: `quote-attachments`
• `plant_settings` & `audit_logs`      • Row Level Security (RLS)         • Bucket: `site-media`
```

---

## 2. Business Philosophy: Offline Commercials & Zero Digital Payment Gateways

* In regional Zambian and African industrial manufacturing, volume pricing, payment terms (net-30, cash, bank TT, mobile transfer), and dieline alterations are **negotiated strictly offline** (phone, WhatsApp, plant visits).
* The platform functions as a **Specification, Visibility & Workflow Coordination Gateway**.
* Status progression moves through human **Decision Gates**:
  1. `RFQ Received` &rarr; Customer submitted technical specs & dielines.
  2. `Under Review` &rarr; Sales estimator checking tooling die # and plate availability.
  3. `Quote Sent` &rarr; Sales attached official Quote PDF / Dieline Proof generated offline.
  4. `Confirmed` &rarr; Client confirmed order offline.
  5. `In Production` &rarr; Job queued on Heidelberg 6C or 8C UV Flexo.
  6. `Dispatched` &rarr; Goods departed Mwembeshi Road facility.
  7. `Settled` &rarr; Trelio-style manual "Mark as Done" confirmation that offline payment was satisfied (zero digital currency amounts tracked).

---

## 3. Technology Stack

| Layer | Component | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + TypeScript | Component modularity, typed props, sub-second route transitions. |
| **Styling & Design System** | Tailwind CSS + CSS Custom Properties | Exact Swiss 60-30-10 palette (`#f8fafc` canvas, `#0F172A` Slate, `#E00019` PZL Crimson, CMYK accents). |
| **Motion Engine** | GSAP 3.12 + ScrollTrigger | Industrial mass and weighted deceleration curves (`power3.out` / `power2.out`). |
| **Database** | PostgreSQL 15+ (Supabase) | Cloud ACID relational schema with foreign key constraints and triggers. |
| **Authentication** | Supabase Auth (JWT) | Role-Based Access Control (`superadmin`, `sales`) with Row Level Security (RLS). |
| **Object Storage** | Supabase Storage (S3-compatible) | Cloud buckets for CAD dielines, quote PDF attachments, and plant media. |
| **Hosting & CI/CD** | Vercel | Automated Git edge deployment with SPA rewrites. |
| **Security & WAF** | Cloudflare | DNSSEC, DDoS mitigation, SSL/TLS full encryption. |

---

## 4. Visual Continuity & 100% Non-Drift Guarantee

Every design element from the approved brand system is preserved 1:1:
* **Typography:** `Fraunces` (Display Serif), `Libre Franklin` (Industrial Body), `IBM Plex Mono` (Machine Specs).
* **Brand Logo:** Exact mathematical vector SVG with 4-quadrant diamond mark, centered red dot, and roundabout loop.
* **Photography:** All 5 verified packaging and plant machinery slots (`hero-packaging.jpg`, `press-flexo-8c.jpg`, `press-heidelberg-6c.jpg`, `prepress-ctp.jpg`, `cartons-packaging.jpg`).
