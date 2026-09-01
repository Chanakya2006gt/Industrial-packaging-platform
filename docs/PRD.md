# Product Requirements Document (PRD) — Industrial Packaging Platform

**Version:** 2.2  
**Date:** 2026-09-01  
**Owner:** Product & Engineering  
**Status:** Approved & Shipped  

---

## 1. Product Scope & Vision

The platform serves industrial printing and packaging converters operating continuous high-volume production (multi-colour flexographic label lines and Heidelberg Speedmaster offset lithography).

The digital platform bridges commercial packaging buyers with plant manufacturing workflows through:
1. **High-Fidelity Public Interface**: Instant specification configuration for procurement and brand managers without artificial login walls.
2. **Hidden Sales Console (`/sales`)**: Streamlined pipeline management, CAD dieline inspection, Quote PDF attachment, native SVG CRM analytics, CPQ pricing calculator, and Trelio-style Decision Gates.
3. **Executive Management Hub (`/admin`)**: Ownership telemetry, sales staff account CRUD & deactivation, dynamic plant settings, raw material rate card manager, and live media asset management.

---

## 2. Key Functional Requirements

### 2.1 Public B2B Interface
* **FR-1 (5-Step CAD & FINAT Configurator)**: Multi-step interactive RFQ builder with dynamic substrate specifications, volume tiers, FINAT 1–8 unwind selectors, and CAD dieline uploader.
* **FR-2 (Standardized FINAT 1–8 Unwind Specification)**: Standardized against FINAT Handbook §2.8 (Directions 1–4 Wound Out, Directions 5–8 Wound In; 0°, 180°, 90°, 270° orientation rotations; dynamic web telemetry with 3mm web gap and 2,500 labels/roll calculations).
* **FR-3 (3D Container Virtual Prototyping Studio)**: 1:1 pixel-calibrated container inspection across Beverage Bottles, 5L Jerry Cans, Food Jars, Pharma Vials, and Folding Cartons with substrate pop-outs.
* **FR-4 (Sample Kit Logistics)**: Free physical sample swatch pack request form with direct dispatch tracking.
* **FR-5 (Machine Telemetry)**: Live 8-station flexo deck status (`Cyan`, `Mag`, `Yel`, `Black`, `Spot 1`, `Spot 2`, `Gold Foil`, `UV Varnish`), turnaround notice, and contact links.
* **FR-6 (Visual Consistency & Accessibility)**: Adherence to Swiss 60-30-10 palette, Plus Jakarta Sans / Inter / IBM Plex Mono typography, Radix UI accessible primitives, and WCAG 2.2 focus/motion standards.

### 2.2 Hidden Sales Console (`/sales` — Direct URL)
* **FR-7 (Pipeline Tracking & Filtering)**: Real-time filtering by `Pending Review`, `Quoted`, `In Production`, `Dispatched`, and `Settled`.
* **FR-8 (Interactive Packaging CPQ Calculator)**: Live estimation panel calculating converted area cm², linear web run meters, CTP plate fees, machine run hours, embellishment costs, and gross margins.
* **FR-9 (Native SVG CRM Sales Intelligence)**: Zero-dependency 60fps vector analytics including 4-tier KPI pulse cards with sparklines, multi-stage sales funnel, 6-month dual-series revenue charts, and CMYK packaging category share donuts.
* **FR-10 (Quote PDF Attachment)**: Estimators can upload official generated quote documents (`.pdf`) directly to the RFQ record.
* **FR-11 (Trelio-Style Decision Gates)**: Status progression operates through human decision gates, including the manual **`[Mark as Settled]`** confirmation of offline bank payment.

### 2.3 Executive Management Hub (`/admin` — Direct URL)
* **FR-12 (Staff Management)**: Create, monitor, and deactivate Sales Estimator accounts with role-based access control.
* **FR-13 (Rate Cards & Paperboard Editor)**: Drag-and-drop CSV parser and live editor for flexo and offset raw material pricing.
* **FR-14 (Plant Settings & Media)**: Live update of operational notices, contact numbers, and all verified plant media slots.
* **FR-15 (Security & Audit Trail)**: Cryptographic logging of logins, media updates, and decision gate advancements.
* **FR-16 (Automated 3-Hour SLA Monitoring)**: Background worker sweeps with JSON webhook dispatch alerts for overdue quotes.

---

## 3. Commercial Reality & Non-Goals

* **Zero In-App Payment Gateways**: Commercial prices, volume discounts, and payment methods (net-30, cash, bank TT, wire transfer) are negotiated offline. No direct consumer checkout or credit card forms exist inside the application.
* **Hidden Staff Consoles**: Public navigation shows zero links or mentions of `/sales` or `/admin`. Access is strictly via direct URL address bar entry with JWT authentication guards.

